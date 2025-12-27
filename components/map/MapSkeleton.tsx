'use client';

/**
 * MapSkeleton Component
 *
 * Loading skeleton displayed while the map is initializing
 * or waiting for geolocation data.
 *
 * @accessibility
 * - Has role="progressbar" for screen readers
 * - Announces loading state
 */

import { cn } from '@/lib/utils';

interface MapSkeletonProps {
  /** Custom class names */
  className?: string;
}

export function MapSkeleton({ className }: MapSkeletonProps) {
  return (
    <div
      className={cn(
        'relative flex h-[calc(100vh-60px)] w-full items-center justify-center',
        'bg-muted',
        className
      )}
      role="progressbar"
      aria-label="Loading map"
      aria-busy="true"
    >
      {/* Animated skeleton background */}
      <div className="absolute inset-0 animate-pulse bg-linear-to-r from-muted via-muted-foreground/10 to-muted" />

      {/* Loading indicator */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Map pin icon placeholder */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/20">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Loading map...</p>
          <p className="mt-1 text-xs text-muted-foreground">Detecting your location</p>
        </div>

        {/* Pulsing dots animation */}
        <div className="flex gap-1.5">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-primary"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-primary"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-primary"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}

export default MapSkeleton;
