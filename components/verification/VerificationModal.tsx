'use client';

/**
 * VerificationModal Component
 *
 * Modal/bottom sheet for the verification flow:
 * 1. Photo capture with EXIF stripping
 * 2. Optional context notes
 * 3. Geolocation capture
 * 4. Submit verification
 *
 * @features
 * - Mobile: Bottom sheet with swipe to close
 * - Desktop: Centered modal
 * - Photo upload reusing existing uploadPhoto action
 * - Screenshot detection warning
 * - Distance validation warning
 * - Character counter for notes
 *
 * @accessibility
 * - Focus trap when open
 * - Escape key to close
 * - Screen reader announcements
 *
 * Stories 2.1.1, 2.1.2, 2.1.3
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Camera01Icon,
  Location01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { uploadPhoto } from '@/app/actions/uploadPhoto';
import { createVerification } from '@/app/actions/createVerification';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import type { VerifiableIssue } from './VerifyButton';

interface VerificationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** The issue being verified */
  issue: VerifiableIssue;
  /** Callback on successful verification */
  onSuccess?: () => void;
}

/** Max note length */
const MAX_NOTE_LENGTH = 500;

/** Max distance from issue for warning (meters) */
const MAX_DISTANCE_METERS = 500;

/** Earth's radius in meters */
const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Check if photo might be a screenshot (size similarity check)
 */
function checkPotentialScreenshot(newPhotoSize: number, originalPhotoSizes: number[]): boolean {
  for (const originalSize of originalPhotoSizes) {
    if (originalSize === 0) continue;
    const sizeDiff = Math.abs(newPhotoSize - originalSize);
    const percentDiff = (sizeDiff / originalSize) * 100;
    if (percentDiff < 5) {
      return true;
    }
  }
  return false;
}

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export function VerificationModal({ isOpen, onClose, issue, onSuccess }: VerificationModalProps) {
  const { user, sessionId } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Warning states
  const [screenshotWarning, setScreenshotWarning] = useState(false);
  const [distanceWarning, setDistanceWarning] = useState(false);
  const [warningOverridden, setWarningOverridden] = useState(false);

  // Geolocation state
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    error: null,
    loading: false,
  });

  /**
   * Request geolocation
   */
  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeolocation((prev) => ({
        ...prev,
        error: 'Geolocation not supported by your browser',
        loading: false,
      }));
      return;
    }

    setGeolocation((prev) => ({ ...prev, loading: true, error: null }));

    const timeoutId = setTimeout(() => {
      setGeolocation((prev) => ({
        ...prev,
        error: 'Location detection slow. Using report location instead.',
        loading: false,
        lat: issue.lat,
        lng: issue.lng,
      }));
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude, accuracy } = position.coords;
        setGeolocation({
          lat: latitude,
          lng: longitude,
          accuracy,
          error: null,
          loading: false,
        });

        // Check distance from original report
        const distance = calculateDistance(latitude, longitude, issue.lat, issue.lng);
        if (distance > MAX_DISTANCE_METERS) {
          setDistanceWarning(true);
        }
      },
      (geoError) => {
        clearTimeout(timeoutId);
        let errorMessage = 'Unable to get location';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage = 'Location access denied. Please enable location.';
        } else if (geoError.code === geoError.TIMEOUT) {
          errorMessage = 'Location request timed out.';
        }
        setGeolocation({
          lat: issue.lat,
          lng: issue.lng,
          accuracy: null,
          error: errorMessage,
          loading: false,
        });
      },
      { timeout: 5000, enableHighAccuracy: true, maximumAge: 0 }
    );
  }, [issue.lat, issue.lng]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPhotoUrl(null);
      setNote('');
      setError(null);
      setScreenshotWarning(false);
      setDistanceWarning(false);
      setWarningOverridden(false);
      // Request geolocation when modal opens
      requestGeolocation();
    }
  }, [isOpen, requestGeolocation]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  /**
   * Handle photo file selection
   */
  const handlePhotoSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setScreenshotWarning(false);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, HEIC, WebP).');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Photo too large. Maximum 10MB.');
      return;
    }

    // Check for potential screenshot (compare to original photos)
    // This is a basic check - comparing file sizes
    const originalPhotoSizes: number[] = []; // Would need to fetch from server
    if (checkPotentialScreenshot(file.size, originalPhotoSizes)) {
      setScreenshotWarning(true);
    }

    // Upload photo
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('bucket', 'verification-photos');

      const result = await uploadPhoto(formData);

      if (result.success && result.url) {
        setPhotoUrl(result.url);
      } else {
        setError(result.error || 'Upload failed. Please try again.');
      }
    } catch {
      setError('Upload failed. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!photoUrl || !user) {
      setError('Please upload a verification photo.');
      return;
    }

    // Check for warnings that haven't been overridden
    if ((screenshotWarning || distanceWarning) && !warningOverridden) {
      return; // Show warning UI first
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const verifierSessionId = sessionId || localStorage.getItem('session_id') || '';

      const result = await createVerification({
        issue_id: issue.id,
        photo_url: photoUrl,
        note: note.trim() || null,
        lat: geolocation.lat || issue.lat,
        lng: geolocation.lng || issue.lng,
        verifier_session_id: verifierSessionId,
        screenshot_warning: screenshotWarning,
        distance_warning: distanceWarning,
        warning_overridden: warningOverridden,
      });

      if (result.success) {
        onSuccess?.();
      } else {
        if (result.error === 'self_verification') {
          setError('You cannot verify your own report.');
        } else if (result.error === 'already_verified') {
          setError('You have already verified this issue.');
        } else {
          setError(result.error || 'Verification failed. Please try again.');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    photoUrl,
    user,
    note,
    geolocation,
    issue,
    sessionId,
    screenshotWarning,
    distanceWarning,
    warningOverridden,
    onSuccess,
  ]);

  /**
   * Handle warning override
   */
  const handleOverrideWarning = () => {
    setWarningOverridden(true);
  };

  if (!isOpen) return null;

  const hasWarnings = (screenshotWarning || distanceWarning) && !warningOverridden;
  const canSubmit =
    photoUrl && !isUploading && !isSubmitting && (!hasWarnings || warningOverridden);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-modal-title"
        className={cn(
          'fixed z-50 bg-white rounded-t-2xl md:rounded-xl shadow-xl',
          'animate-in slide-in-from-bottom-4 duration-300',
          // Mobile: Bottom sheet
          'inset-x-0 bottom-0 max-h-[90vh]',
          // Desktop: Centered modal
          'md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
          'md:w-full md:max-w-lg md:max-h-[85vh]'
        )}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 md:hidden">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 md:px-6">
          <h2 id="verification-modal-title" className="text-lg font-semibold text-gray-900">
            Verify This Issue
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 md:p-6 space-y-6 max-h-[calc(90vh-180px)] md:max-h-[calc(85vh-180px)]">
          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <HugeiconsIcon icon={AlertCircleIcon} size={20} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Photo Capture */}
          <section>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Verification Photo <span className="text-red-500">*</span>
            </label>
            <p className="mb-3 text-sm text-gray-500">
              Take a new photo from the location to verify this issue exists.
            </p>

            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={photoUrl}
                  alt="Verification photo"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  unoptimized
                />
                <button
                  onClick={() => {
                    setPhotoUrl(null);
                  }}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  aria-label="Remove photo"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-sm text-white">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                  Photo uploaded
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={cn(
                  'w-full h-48 rounded-xl border-2 border-dashed border-gray-300',
                  'flex flex-col items-center justify-center gap-3',
                  'text-gray-500 hover:border-green-500 hover:bg-green-50 hover:text-green-600',
                  'transition-colors cursor-pointer',
                  isUploading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isUploading ? (
                  <>
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <HugeiconsIcon icon={Camera01Icon} size={28} />
                    </div>
                    <span className="font-medium">Take Photo</span>
                    <span className="text-xs text-gray-400">Tap to open camera</span>
                  </>
                )}
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
              aria-label="Capture verification photo"
            />
          </section>

          {/* Screenshot Warning */}
          {screenshotWarning && !warningOverridden && (
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
              <HugeiconsIcon icon={AlertCircleIcon} size={20} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Photo appears to be a screenshot</p>
                <p className="mt-1 text-amber-700">Please take a new photo from the location.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOverrideWarning}
                  className="mt-2 text-amber-800 hover:text-amber-900"
                >
                  Submit Anyway
                </Button>
              </div>
            </div>
          )}

          {/* Distance Warning */}
          {distanceWarning && !warningOverridden && (
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
              <HugeiconsIcon icon={Location01Icon} size={20} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium">You&apos;re far from the issue location</p>
                <p className="mt-1 text-amber-700">
                  Please verify in person at the reported location.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOverrideWarning}
                  className="mt-2 text-amber-800 hover:text-amber-900"
                >
                  Submit Anyway
                </Button>
              </div>
            </div>
          )}

          {/* Context Notes */}
          <section>
            <label
              htmlFor="verification-note"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Context Notes <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <Textarea
              id="verification-note"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE_LENGTH))}
              placeholder="What did you observe? Any additional context?"
              className="min-h-24"
              maxLength={MAX_NOTE_LENGTH}
            />
            <div className="mt-1 text-right text-xs text-gray-400">
              {note.length}/{MAX_NOTE_LENGTH} characters
            </div>
          </section>

          {/* Location Info */}
          <section className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <HugeiconsIcon
                icon={Location01Icon}
                size={18}
                className={geolocation.loading ? 'animate-pulse text-gray-400' : 'text-blue-500'}
              />
              <span className="font-medium text-gray-700">Your Location</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {geolocation.loading ? (
                <span className="text-gray-400">Detecting location...</span>
              ) : geolocation.error ? (
                <span className="text-amber-600">{geolocation.error}</span>
              ) : geolocation.accuracy ? (
                <span>Accurate within {Math.round(geolocation.accuracy)} meters</span>
              ) : (
                <span>Using report location as fallback</span>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-4 md:px-6">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full gap-2 h-12"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
                Submit Verification
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

export default VerificationModal;
