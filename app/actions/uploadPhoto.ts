'use server';

/**
 * Photo Upload Server Action
 *
 * Handles secure photo uploads with:
 * - EXIF metadata stripping (removes GPS, camera info for privacy)
 * - Image resizing (max 1920x1080)
 * - JPEG compression (85% quality)
 * - Supabase Storage upload
 *
 * Zero tolerance for GPS leaks: if EXIF stripping fails, upload is rejected.
 *
 * @example
 * const formData = new FormData();
 * formData.append('photo', file);
 * formData.append('bucket', 'issue-photos');
 * const result = await uploadPhoto(formData);
 */

import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

// Allowed MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Max dimensions
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

// JPEG quality for compression
const JPEG_QUALITY = 85;

export interface UploadPhotoResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadPhoto(formData: FormData): Promise<UploadPhotoResult> {
  try {
    // Get file from form data
    const file = formData.get('photo') as File | null;
    const bucket = (formData.get('bucket') as string) || 'issue-photos';

    // Validation: File exists
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validation: File type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`,
      };
    }

    // Validation: File size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Get Supabase client
    const supabase = await createClient();

    // Get current user (for folder path)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';

    // Process image with sharp
    let processedBuffer: Buffer;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Process image:
      // 1. Auto-rotate based on EXIF orientation
      // 2. Resize to max dimensions (maintain aspect ratio)
      // 3. Convert to JPEG with compression
      // 4. STRIP ALL METADATA (EXIF, ICC, XMP) - CRITICAL FOR PRIVACY
      //    By NOT calling .withMetadata(), sharp strips all metadata by default
      processedBuffer = await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF orientation (reads EXIF, then discards)
        .resize(MAX_WIDTH, MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true, // Don't upscale small images
        })
        .jpeg({
          quality: JPEG_QUALITY,
          mozjpeg: true, // Better compression
        })
        // NOTE: Do NOT call .withMetadata() - that would preserve EXIF
        // Sharp strips all metadata by default when not calling withMetadata()
        .toBuffer();

      // Verify EXIF was stripped
      const metadata = await sharp(processedBuffer).metadata();
      if (metadata.exif) {
        // EXIF still present - this should never happen with sharp
        // But we have zero tolerance for GPS leaks
        console.error('EXIF stripping failed - rejecting upload');
        return {
          success: false,
          error: 'Image processing failed. Please try again.',
        };
      }
    } catch (imageError) {
      console.error('Image processing error:', imageError);
      return {
        success: false,
        error: 'Failed to process image. Please try a different file.',
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueId = randomUUID().slice(0, 8);
    const fileName = `${userId}/${timestamp}-${uniqueId}.jpg`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, processedBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600', // 1 hour cache
        upsert: false, // Don't overwrite existing files
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return {
        success: false,
        error: 'Upload failed. Please try again.',
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Upload photo error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Upload multiple photos
 *
 * @param formData FormData with multiple 'photos' entries
 * @returns Array of upload results
 */
export async function uploadMultiplePhotos(formData: FormData): Promise<UploadPhotoResult[]> {
  const files = formData.getAll('photos') as File[];
  const bucket = (formData.get('bucket') as string) || 'issue-photos';

  if (files.length === 0) {
    return [{ success: false, error: 'No files provided' }];
  }

  if (files.length > 5) {
    return [{ success: false, error: 'Maximum 5 photos allowed per upload' }];
  }

  const results: UploadPhotoResult[] = [];

  for (const file of files) {
    const singleFormData = new FormData();
    singleFormData.append('photo', file);
    singleFormData.append('bucket', bucket);

    const result = await uploadPhoto(singleFormData);
    results.push(result);

    // If any upload fails, continue but mark it
    if (!result.success) {
      console.warn(`Upload failed for file: ${file.name}`, result.error);
    }
  }

  return results;
}

/**
 * Delete a photo from storage
 *
 * @param url The public URL of the photo to delete
 * @param bucket The storage bucket name
 */
export async function deletePhoto(
  url: string,
  bucket: string = 'issue-photos'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Extract file path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${bucket}/`);

    if (pathParts.length !== 2) {
      return { success: false, error: 'Invalid photo URL' };
    }

    const filePath = pathParts[1];

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error('Delete photo error:', error);
      return { success: false, error: 'Failed to delete photo' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete photo error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
