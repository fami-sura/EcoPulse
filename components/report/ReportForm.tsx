'use client';

/**
 * ReportForm Component
 *
 * Complete form for submitting environmental issue reports.
 *
 * @features
 * - Integrates all sub-components
 * - Form validation
 * - Race condition prevention (waits for uploads)
 * - Session ID generation
 * - Success/Error states
 * - Optimistic UI
 *
 * @accessibility
 * - Screen reader announcements
 * - Keyboard navigable
 */

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { PhotoCapture } from './PhotoCapture';
import { LocationDetector } from './LocationDetector';
import { CategorySelector, type Category } from './CategorySelector';
import { SeveritySelector, type Severity } from './SeveritySelector';
import { createReport, type ReportFormData } from '@/app/actions/createReport';
import { type GeolocationResult } from '@/hooks/useGeolocation';

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
import dynamic from 'next/dynamic';
const LocationPicker = dynamic(() => import('./LocationPicker').then((mod) => mod.LocationPicker), {
  ssr: false,
  loading: () => <div className="h-50 animate-pulse rounded-lg bg-gray-200" />,
});

/** Minimum description length */
const MIN_DESCRIPTION_LENGTH = 60;

interface ReportFormProps {
  /** Callback when form is submitted successfully */
  onSuccess?: (reportId: string) => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Custom class names */
  className?: string;
}

type FormStep = 'form' | 'submitting' | 'success' | 'error';

interface LocationState {
  lat: number;
  lng: number;
  address: string;
  accuracy?: number;
}

/**
 * Get or create session ID for anonymous users
 */
function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const storageKey = 'ecopulse_session_id';
  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    // Generate new session ID
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = crypto.randomUUID();
    } else {
      // Fallback for older browsers
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

export function ReportForm({ onSuccess, onCancel, className }: ReportFormProps) {
  const router = useRouter();

  // Form state
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [location, setLocation] = useState<LocationState | null>(null);
  const [category, setCategory] = useState<Category | undefined>();
  const [severity, setSeverity] = useState<Severity>('medium');
  const [description, setDescription] = useState('');
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Submission state
  const [step, setStep] = useState<FormStep>('form');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Handle location detection from LocationDetector
   */
  const handleLocationDetected = useCallback((geoResult: GeolocationResult) => {
    setLocation({
      lat: geoResult.lat,
      lng: geoResult.lng,
      address: geoResult.address,
      accuracy: geoResult.accuracy,
    });
  }, []);

  /**
   * Handle location change from LocationPicker
   */
  const handleLocationChange = useCallback(
    (newLocation: { lat: number; lng: number; address: string }) => {
      setLocation({
        lat: newLocation.lat,
        lng: newLocation.lng,
        address: newLocation.address,
      });
    },
    []
  );

  /**
   * Validate form
   */
  const validation = useMemo(() => {
    const errors: Record<string, string> = {};

    if (photoUrls.length === 0) {
      errors.photos = 'At least one photo is required';
    }

    if (!location) {
      errors.location = 'Location is required';
    }

    if (!category) {
      errors.category = 'Please select a category';
    }

    if (description.length < MIN_DESCRIPTION_LENGTH) {
      errors.description = `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters (${description.length}/${MIN_DESCRIPTION_LENGTH})`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [photoUrls, location, category, description]);

  /**
   * Check if form can be submitted
   */
  const canSubmit = validation.isValid && !isUploading && step === 'form';

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    // Show validation errors
    setShowValidationErrors(true);

    if (!validation.isValid || !location || !category) {
      return;
    }

    setStep('submitting');
    setSubmitError(null);

    const reportData: ReportFormData = {
      photoUrls,
      lat: location.lat,
      lng: location.lng,
      address: location.address || '',
      category,
      severity,
      note: description,
      sessionId: getSessionId(),
    };

    try {
      const result = await createReport(reportData);

      if (result.success && result.reportId) {
        setReportId(result.reportId);
        setStep('success');
        onSuccess?.(result.reportId);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError(err instanceof Error ? err.message : 'Unable to submit report');
      setStep('error');
    }
  }, [validation.isValid, location, category, severity, description, photoUrls, onSuccess]);

  /**
   * Handle retry
   */
  const handleRetry = useCallback(() => {
    if (retryCount >= 3) {
      setSubmitError('Maximum retry attempts reached. Please try again later.');
      return;
    }

    setRetryCount((c) => c + 1);
    handleSubmit();
  }, [retryCount, handleSubmit]);

  /**
   * Handle view on map
   */
  const handleViewOnMap = useCallback(() => {
    if (reportId) {
      router.push(`/?report=${reportId}`);
    }
  }, [reportId, router]);

  /**
   * Handle submit another
   */
  const handleSubmitAnother = useCallback(() => {
    // Reset form
    setPhotoUrls([]);
    setIsUploading(false);
    setLocation(null);
    setCategory(undefined);
    setSeverity('medium');
    setDescription('');
    setShowValidationErrors(false);
    setStep('form');
    setSubmitError(null);
    setReportId(null);
    setRetryCount(0);
  }, []);

  // Success state
  if (step === 'success') {
    return (
      <div
        className={cn('flex flex-col items-center justify-center space-y-6 p-6', className)}
        role="alert"
        aria-live="polite"
      >
        <div className="animate-scale-in">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={80} className="text-green-600" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Thank you!</h2>
          <p className="text-gray-600">Your report has been submitted.</p>
          {reportId && (
            <p className="font-mono text-sm text-gray-500">Report #{reportId.slice(0, 8)}</p>
          )}
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleViewOnMap} className="w-full sm:w-auto">
            View on Map
          </Button>
          <Button variant="outline" onClick={handleSubmitAnother} className="w-full sm:w-auto">
            Submit Another Report
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (step === 'error') {
    return (
      <div
        className={cn('flex flex-col items-center justify-center space-y-6 p-6', className)}
        role="alert"
        aria-live="assertive"
      >
        <div className="text-red-500">
          <HugeiconsIcon icon={Cancel01Icon} size={64} />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold text-gray-900">Submission Failed</h2>
          <p className="text-gray-600">{submitError}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {retryCount < 3 && (
            <Button onClick={handleRetry} className="w-full sm:w-auto">
              Try Again ({3 - retryCount} attempts left)
            </Button>
          )}
          <Button variant="outline" onClick={() => setStep('form')} className="w-full sm:w-auto">
            Edit Report
          </Button>
        </div>
      </div>
    );
  }

  // Submitting state
  if (step === 'submitting') {
    return (
      <div
        className={cn('flex flex-col items-center justify-center space-y-6 p-6', className)}
        role="status"
        aria-live="polite"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
        <p className="text-lg text-gray-600">Submitting your report...</p>
      </div>
    );
  }

  // Form state
  return (
    <form
      className={cn('space-y-6', className)}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Photos Section */}
      <section className="space-y-2">
        <Label className="text-base font-medium">
          Photos <span className="text-red-500">*</span>
        </Label>
        <PhotoCapture
          photoUrls={photoUrls}
          onPhotosChange={setPhotoUrls}
          onUploadingChange={setIsUploading}
        />
        {showValidationErrors && validation.errors.photos && (
          <p className="text-sm text-red-500">{validation.errors.photos}</p>
        )}
      </section>

      {/* Location Section */}
      <section className="space-y-3">
        <Label className="text-base font-medium">
          Location <span className="text-red-500">*</span>
        </Label>

        {/* Auto-detection */}
        <LocationDetector onLocationDetected={handleLocationDetected} autoDetect={true} />

        {/* Manual adjustment */}
        {location && (
          <LocationPicker
            initialLocation={{ lat: location.lat, lng: location.lng }}
            initialAddress={location.address}
            onLocationChange={handleLocationChange}
          />
        )}

        {showValidationErrors && validation.errors.location && (
          <p className="text-sm text-red-500">{validation.errors.location}</p>
        )}
      </section>

      {/* Category Section */}
      <section className="space-y-3">
        <Label className="text-base font-medium">
          Issue Type <span className="text-red-500">*</span>
        </Label>
        <CategorySelector
          value={category}
          onChange={setCategory}
          error={showValidationErrors && !category}
        />
        {showValidationErrors && validation.errors.category && (
          <p className="text-sm text-red-500">{validation.errors.category}</p>
        )}
      </section>

      {/* Severity Section */}
      <section className="space-y-3">
        <Label className="text-base font-medium">Severity Level</Label>
        <SeveritySelector value={severity} onChange={setSeverity} />
      </section>

      {/* Description Section */}
      <section className="space-y-2">
        <Label htmlFor="description" className="text-base font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail (minimum 60 characters)..."
          rows={4}
          className={cn(showValidationErrors && validation.errors.description && 'border-red-500')}
        />
        <div className="flex justify-between text-sm">
          <span
            className={cn(
              description.length >= MIN_DESCRIPTION_LENGTH ? 'text-green-600' : 'text-gray-500'
            )}
          >
            {description.length}/{MIN_DESCRIPTION_LENGTH} characters
          </span>
          {showValidationErrors && validation.errors.description && (
            <span className="text-red-500">{validation.errors.description}</span>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Button type="submit" disabled={!canSubmit} className="flex-1">
          {isUploading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Uploading photos...
            </>
          ) : (
            'Submit Report'
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default ReportForm;
