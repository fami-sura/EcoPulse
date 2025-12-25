'use client';

/**
 * HeroMapPreview Component
 *
 * A lightweight, non-interactive map preview for the Hero section.
 * Shows sample markers to demonstrate the platform's capabilities.
 * Click redirects to the full interactive map.
 */

import { useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/routing';
import { LAGOS_CENTER, MAP_ZOOM } from '@/lib/map/constants';
import { cn } from '@/lib/utils';
import { MapsLocation01Icon } from '@hugeicons/core-free-icons';

// SSR-safe hook for detecting client-side mounting
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
import { HugeiconsIcon } from '@hugeicons/react';

// Sample marker type
interface SampleMarker {
  id: number;
  lat: number;
  lng: number;
  status: 'verified' | 'pending' | 'in_progress' | 'resolved';
  category: 'waste' | 'drainage';
}

// Sample markers for demo purposes - representing typical issues
const sampleMarkers: SampleMarker[] = [
  { id: 1, lat: 6.5244, lng: 3.3792, status: 'verified', category: 'drainage' },
  { id: 2, lat: 6.518, lng: 3.365, status: 'pending', category: 'waste' },
  { id: 3, lat: 6.532, lng: 3.388, status: 'verified', category: 'waste' },
  { id: 4, lat: 6.51, lng: 3.372, status: 'in_progress', category: 'drainage' },
  { id: 5, lat: 6.528, lng: 3.355, status: 'verified', category: 'waste' },
  { id: 6, lat: 6.515, lng: 3.395, status: 'pending', category: 'drainage' },
];

function MapPreviewSkeleton() {
  return (
    <div className="absolute inset-0 bg-muted flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
          <HugeiconsIcon icon={MapsLocation01Icon} size={32} className="text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">Loading Map...</p>
        <p className="text-xs text-muted-foreground mt-1">Lagos, Nigeria</p>
      </div>
    </div>
  );
}

function MapFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted to-accent/5 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center ring-4 ring-primary/20">
          <HugeiconsIcon icon={MapsLocation01Icon} size={40} className="text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">Interactive Map</p>
        <p className="text-sm text-muted-foreground mt-1">Click to explore verified reports</p>
      </div>
    </div>
  );
}

// Dynamically import the map to avoid SSR issues with Leaflet
const MapPreviewContent = dynamic(
  () =>
    import('@/components/marketing/HeroMapPreviewContent').then((mod) => mod.HeroMapPreviewContent),
  {
    ssr: false,
    loading: () => <MapPreviewSkeleton />,
  }
);

interface HeroMapPreviewProps {
  className?: string;
}

export function HeroMapPreview({ className }: HeroMapPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  // Use useSyncExternalStore pattern for SSR-safe mounting detection
  const mounted = useMounted();

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border group cursor-pointer bg-muted',
        className
      )}
      style={{ aspectRatio: '4/3', minHeight: '300px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Map Container - with explicit dimensions */}
      <div className="absolute inset-0">
        {mounted ? (
          <MapPreviewContent
            center={LAGOS_CENTER}
            zoom={MAP_ZOOM.neighborhood - 1}
            markers={sampleMarkers}
          />
        ) : (
          <MapFallback />
        )}
      </div>

      {/* Hover Overlay - CTA to view full map */}
      <Link
        href="/map"
        className={cn(
          'absolute inset-0 bg-foreground/60 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300 z-20',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        aria-label="View the full interactive map"
      >
        <div className="text-center text-background">
          <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center shadow-lg">
            <HugeiconsIcon
              icon={MapsLocation01Icon}
              size={32}
              className="text-primary-foreground"
            />
          </div>
          <p className="text-lg font-semibold">Explore Live Map</p>
          <p className="text-sm opacity-80 mt-1">See verified reports in real-time</p>
        </div>
      </Link>

      {/* Status Pills - Show live stats */}
      <div className="absolute top-4 left-4 flex gap-2 z-10 pointer-events-none">
        <div className="bg-background/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium shadow-md border border-border flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-foreground">3 Verified</span>
        </div>
        <div className="bg-background/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium shadow-md border border-border flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span className="text-foreground">2 Pending</span>
        </div>
      </div>

      {/* Location Badge */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div className="bg-background/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium shadow-md border border-border text-foreground">
          Lagos, Nigeria
        </div>
      </div>
    </div>
  );
}

export default HeroMapPreview;
