'use client';

/**
 * LocationDetector Component
 *
 * Auto-detects user location with reverse geocoding.
 *
 * @features
 * - Geolocation API with 5s timeout
 * - Reverse geocoding via Nominatim
 * - Accuracy indicator
 * - Fallback messaging for denied/unavailable
 * - "Use Current Location" refresh button
 *
 * @accessibility
 * - Screen reader announcements for status
 * - Loading state indication
 */

import { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Location01Icon, AlertCircleIcon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { useGeolocation, type GeolocationResult } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LocationDetectorProps {
  /** Callback when location is detected */
  onLocationDetected: (location: GeolocationResult) => void;
  /** Whether to auto-detect on mount */
  autoDetect?: boolean;
  /** Custom class names */
  className?: string;
}

/**
 * Format accuracy for display
 */
function formatAccuracy(meters: number): string {
  if (meters <= 10) return 'Very accurate (within 10m)';
  if (meters <= 50) return `Accurate within ${Math.round(meters)}m`;
  if (meters <= 100) return `Approximate (within ${Math.round(meters)}m)`;
  return `Low accuracy (within ${Math.round(meters)}m)`;
}

export function LocationDetector({
  onLocationDetected,
  autoDetect = true,
  className,
}: LocationDetectorProps) {
  const { location, loading, error, isDenied, refetch } = useGeolocation(autoDetect);

  // Notify parent when location changes
  useEffect(() => {
    if (location) {
      onLocationDetected(location);
    }
  }, [location, onLocationDetected]);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Loading State */}
      {loading && (
        <div
          className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20"
          role="status"
          aria-live="polite"
        >
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Detecting your location...
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Please allow location access when prompted
            </p>
          </div>
        </div>
      )}

      {/* Success State */}
      {!loading && location && (
        <div className="space-y-2">
          <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Location detected
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{location.address}</p>
              {location.accuracy > 0 && (
                <p className="mt-1 text-xs text-gray-500">{formatAccuracy(location.accuracy)}</p>
              )}
            </div>
          </div>

          {/* Refresh Button */}
          <Button type="button" variant="outline" size="sm" onClick={refetch} className="w-full">
            <HugeiconsIcon icon={Location01Icon} className="mr-2 h-4 w-4" />
            Use Current Location
          </Button>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="space-y-2">
          <div
            className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20"
            role="alert"
          >
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                {isDenied ? 'Location access denied' : 'Unable to detect location'}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </div>

          {/* Retry Button (only if not denied) */}
          {!isDenied && (
            <Button type="button" variant="outline" size="sm" onClick={refetch} className="w-full">
              <HugeiconsIcon icon={Location01Icon} className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationDetector;
