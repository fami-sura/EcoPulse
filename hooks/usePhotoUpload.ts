'use client';

/**
 * usePhotoUpload Hook
 *
 * Client-side hook for handling photo uploads with:
 * - Loading state management
 * - Error handling
 * - Progress tracking (future enhancement)
 * - Multiple photo support
 *
 * @example
 * const { uploadPhoto, isUploading, error } = usePhotoUpload();
 *
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     const result = await uploadPhoto(file);
 *     if (result.success) {
 *       console.log('Uploaded:', result.url);
 *     }
 *   }
 * };
 */

import { useState, useCallback } from 'react';
import {
  uploadPhoto as uploadPhotoAction,
  uploadMultiplePhotos as uploadMultiplePhotosAction,
  deletePhoto as deletePhotoAction,
  type UploadPhotoResult,
} from '@/app/actions/uploadPhoto';

// Client-side validation constants (matching server)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UsePhotoUploadReturn {
  /** Upload a single photo */
  uploadPhoto: (file: File, bucket?: string) => Promise<UploadPhotoResult>;
  /** Upload multiple photos */
  uploadMultiplePhotos: (files: File[], bucket?: string) => Promise<UploadPhotoResult[]>;
  /** Delete a photo */
  deletePhoto: (url: string, bucket?: string) => Promise<{ success: boolean; error?: string }>;
  /** Whether an upload is in progress */
  isUploading: boolean;
  /** Current error message */
  error: string | null;
  /** Clear error */
  clearError: () => void;
  /** Validate file before upload (client-side) */
  validateFile: (file: File) => { valid: boolean; error?: string };
}

export function usePhotoUpload(): UsePhotoUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Client-side file validation
   */
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: JPEG, PNG, WebP, HEIC`,
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    return { valid: true };
  }, []);

  /**
   * Upload a single photo
   */
  const uploadPhoto = useCallback(
    async (file: File, bucket: string = 'issue-photos'): Promise<UploadPhotoResult> => {
      setError(null);

      // Client-side validation first
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error!);
        return { success: false, error: validation.error };
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('bucket', bucket);

        const result = await uploadPhotoAction(formData);

        if (!result.success) {
          setError(result.error || 'Upload failed');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile]
  );

  /**
   * Upload multiple photos
   */
  const uploadMultiplePhotos = useCallback(
    async (files: File[], bucket: string = 'issue-photos'): Promise<UploadPhotoResult[]> => {
      setError(null);

      if (files.length === 0) {
        const err = 'No files provided';
        setError(err);
        return [{ success: false, error: err }];
      }

      if (files.length > 5) {
        const err = 'Maximum 5 photos allowed';
        setError(err);
        return [{ success: false, error: err }];
      }

      // Validate all files first
      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          setError(validation.error!);
          return [{ success: false, error: validation.error }];
        }
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        files.forEach((file) => formData.append('photos', file));
        formData.append('bucket', bucket);

        const results = await uploadMultiplePhotosAction(formData);

        // Check if any failed
        const failed = results.filter((r) => !r.success);
        if (failed.length > 0) {
          setError(`${failed.length} of ${files.length} uploads failed`);
        }

        return results;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        return [{ success: false, error: errorMessage }];
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile]
  );

  /**
   * Delete a photo
   */
  const deletePhoto = useCallback(
    async (
      url: string,
      bucket: string = 'issue-photos'
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        return await deletePhotoAction(url, bucket);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Delete failed';
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadPhoto,
    uploadMultiplePhotos,
    deletePhoto,
    isUploading,
    error,
    clearError,
    validateFile,
  };
}

export default usePhotoUpload;
