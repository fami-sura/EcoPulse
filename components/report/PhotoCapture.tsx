'use client';

/**
 * PhotoCapture Component
 *
 * Handles photo capture and upload with EXIF stripping.
 *
 * @features
 * - Mobile: Opens native camera via capture="environment"
 * - Desktop: File picker
 * - Multiple photos (1-5)
 * - Client-side validation (type, size)
 * - Progress indicator during upload
 * - Error handling with retry
 *
 * @accessibility
 * - Screen reader announcements for upload status
 * - Keyboard accessible
 */

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Camera01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';
import { uploadPhoto } from '@/app/actions/uploadPhoto';
import { cn } from '@/lib/utils';

/** Allowed MIME types */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

/** Max file size: 10MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Max photos per report */
const MAX_PHOTOS = 5;

/** Max retry attempts */
const MAX_RETRIES = 3;

interface PhotoCaptureProps {
  /** Array of uploaded photo URLs */
  photoUrls: string[];
  /** Callback when photos change */
  onPhotosChange: (urls: string[]) => void;
  /** Whether any upload is in progress */
  isUploading?: boolean;
  /** Callback when upload state changes */
  onUploadingChange?: (uploading: boolean) => void;
  /** Error message */
  error?: string;
}

interface UploadingPhoto {
  id: string;
  file: File;
  progress: number;
  error?: string;
  retries: number;
}

export function PhotoCapture({
  photoUrls,
  onPhotosChange,
  onUploadingChange,
  error,
}: PhotoCaptureProps) {
  const [uploadingPhotos, setUploadingPhotos] = useState<UploadingPhoto[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploading = uploadingPhotos.length > 0;
  const canAddMore = photoUrls.length + uploadingPhotos.length < MAX_PHOTOS;

  /**
   * Validate file before upload
   */
  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a valid image (JPG, PNG, HEIC, WebP).';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Photo too large. Maximum 10MB per photo.';
    }
    return null;
  }, []);

  /**
   * Upload a single photo with retry logic
   */
  const uploadSinglePhoto = useCallback(
    async (uploadingPhoto: UploadingPhoto): Promise<string | null> => {
      const formData = new FormData();
      formData.append('photo', uploadingPhoto.file);
      formData.append('bucket', 'issue-photos');

      try {
        const result = await uploadPhoto(formData);

        if (result.success && result.url) {
          return result.url;
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        throw error;
      }
    },
    []
  );

  /**
   * Handle file selection
   */
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setValidationError(null);

      // Check total photo limit
      const totalPhotos = photoUrls.length + uploadingPhotos.length + files.length;
      if (totalPhotos > MAX_PHOTOS) {
        setValidationError(`Maximum ${MAX_PHOTOS} photos allowed per report.`);
        return;
      }

      // Validate all files
      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          setValidationError(error);
          return;
        }
      }

      // Create uploading photo entries
      const newUploadingPhotos: UploadingPhoto[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        retries: 0,
      }));

      setUploadingPhotos((prev) => [...prev, ...newUploadingPhotos]);
      onUploadingChange?.(true);

      // Upload photos
      const newUrls: string[] = [];

      for (const uploadingPhoto of newUploadingPhotos) {
        let success = false;
        let attempts = 0;

        while (!success && attempts < MAX_RETRIES) {
          try {
            // Update progress
            setUploadingPhotos((prev) =>
              prev.map((p) =>
                p.id === uploadingPhoto.id
                  ? { ...p, progress: 50 + attempts * 10, error: undefined }
                  : p
              )
            );

            const url = await uploadSinglePhoto(uploadingPhoto);
            if (url) {
              newUrls.push(url);
              success = true;
            }
          } catch {
            attempts++;
            if (attempts >= MAX_RETRIES) {
              setUploadingPhotos((prev) =>
                prev.map((p) =>
                  p.id === uploadingPhoto.id
                    ? { ...p, error: 'Upload failed. Please try again.' }
                    : p
                )
              );
            }
          }
        }

        // Remove from uploading list if successful
        if (success) {
          setUploadingPhotos((prev) => prev.filter((p) => p.id !== uploadingPhoto.id));
        }
      }

      // Update photo URLs
      if (newUrls.length > 0) {
        onPhotosChange([...photoUrls, ...newUrls]);
      }

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Update uploading state - keep only failed uploads
      setUploadingPhotos((prev) => prev.filter((p) => p.error));

      // Notify parent that uploading is complete
      // All uploads in this batch are done (either successful or failed)
      onUploadingChange?.(false);
    },
    [
      photoUrls,
      uploadingPhotos.length,
      validateFile,
      uploadSinglePhoto,
      onPhotosChange,
      onUploadingChange,
    ]
  );

  /**
   * Remove a photo
   */
  const handleRemovePhoto = useCallback(
    (index: number) => {
      const newUrls = photoUrls.filter((_, i) => i !== index);
      onPhotosChange(newUrls);
    },
    [photoUrls, onPhotosChange]
  );

  /**
   * Remove a failed upload
   */
  const handleRemoveFailedUpload = useCallback((id: string) => {
    setUploadingPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  /**
   * Retry a failed upload
   */
  const handleRetryUpload = useCallback(
    async (uploadingPhoto: UploadingPhoto) => {
      setUploadingPhotos((prev) =>
        prev.map((p) =>
          p.id === uploadingPhoto.id ? { ...p, error: undefined, retries: p.retries + 1 } : p
        )
      );

      try {
        const url = await uploadSinglePhoto(uploadingPhoto);
        if (url) {
          onPhotosChange([...photoUrls, url]);
          setUploadingPhotos((prev) => prev.filter((p) => p.id !== uploadingPhoto.id));
        }
      } catch {
        setUploadingPhotos((prev) =>
          prev.map((p) =>
            p.id === uploadingPhoto.id ? { ...p, error: 'Upload failed. Please try again.' } : p
          )
        );
      }
    },
    [photoUrls, onPhotosChange, uploadSinglePhoto]
  );

  /**
   * Trigger file input click
   */
  const handleAddClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {/* Uploaded Photos */}
        {photoUrls.map((url, index) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={url}
              alt={`Uploaded photo ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => handleRemovePhoto(index)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              aria-label={`Remove photo ${index + 1}`}
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
            </button>
            <div className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-3 w-3 text-white" />
            </div>
          </div>
        ))}

        {/* Uploading Photos */}
        {uploadingPhotos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
          >
            <div className="flex h-full w-full items-center justify-center">
              {photo.error ? (
                <div className="flex flex-col items-center gap-1 p-2">
                  <HugeiconsIcon icon={Cancel01Icon} className="h-6 w-6 text-red-500" />
                  <span className="text-xs text-red-500">Failed</span>
                  <button
                    type="button"
                    onClick={() => handleRetryUpload(photo)}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
                  <span className="text-xs text-gray-500">Uploading...</span>
                </div>
              )}
            </div>
            {photo.error && (
              <button
                type="button"
                onClick={() => handleRemoveFailedUpload(photo.id)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                aria-label="Remove failed upload"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        {/* Add Photo Button */}
        {canAddMore && (
          <button
            type="button"
            onClick={handleAddClick}
            disabled={isUploading}
            className={cn(
              'aspect-square rounded-lg border-2 border-dashed',
              'flex flex-col items-center justify-center gap-2',
              'transition-colors',
              isUploading
                ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                : 'border-gray-300 bg-white text-gray-500 hover:border-green-500 hover:bg-green-50 hover:text-green-600'
            )}
            aria-label={photoUrls.length === 0 ? 'Add photo' : 'Add another photo'}
          >
            {photoUrls.length === 0 ? (
              <>
                <HugeiconsIcon icon={Camera01Icon} className="h-8 w-8" />
                <span className="text-xs font-medium">Add Photo</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={PlusSignIcon} className="h-6 w-6" />
                <span className="text-xs font-medium">Add More</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        capture="environment"
        multiple
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload photo"
      />

      {/* Photo Count */}
      <p className="text-sm text-gray-500">
        {photoUrls.length} of {MAX_PHOTOS} photos{' '}
        {photoUrls.length === 0 && <span className="text-red-500">• At least 1 required</span>}
      </p>

      {/* Error Messages */}
      {(validationError || error) && (
        <p className="text-sm text-red-500" role="alert">
          {validationError || error}
        </p>
      )}
    </div>
  );
}

export default PhotoCapture;
