'use client';

/**
 * IssueMap Component
 *
 * Main map view component that displays environmental issues.
 * Uses dynamic import to avoid SSR issues with Leaflet.
 *
 * @features
 * - Geolocation detection with 5-second timeout
 * - Nigeria center fallback if geolocation denied/unavailable
 * - Loading skeleton during initialization
 * - Full viewport height minus header (60px)
 * - Filter panel (mobile: bottom sheet, desktop: sidebar)
 * - Report FAB for creating new reports
 *
 * @accessibility
 * - Zoom controls with 44x44px touch targets
 * - Screen reader announcements for location changes
 */

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapSkeleton } from './MapSkeleton';
import { MapFilters } from './MapFilters';
import { useMapStore } from '@/stores/mapStore';
import { ReportFAB } from '@/components/report/ReportFAB';

// Dynamically import the map client to avoid SSR issues with Leaflet
const IssueMapClient = dynamic(() => import('./IssueMapClient').then((mod) => mod.IssueMapClient), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

// Dynamically import IssuePinLayer (also uses react-leaflet hooks)
const IssuePinLayer = dynamic(() => import('./IssuePinLayer').then((mod) => mod.IssuePinLayer), {
  ssr: false,
});

// Dynamically import ReportForm to avoid loading it until needed
const ReportForm = dynamic<{ onSuccess?: (reportId: string) => void; onCancel?: () => void }>(
  () => import('../report/ReportForm').then((mod) => mod.ReportForm),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground/20 border-t-primary" />
      </div>
    ),
  }
);

export function IssueMap() {
  const { pins } = useMapStore();
  const [showReportForm, setShowReportForm] = useState(false);

  const handleReportClick = useCallback(() => {
    setShowReportForm(true);
  }, []);

  const handleReportSuccess = useCallback(() => {
    // Close form after success animation completes
    setTimeout(() => {
      setShowReportForm(false);
    }, 2000);
  }, []);

  const handleReportCancel = useCallback(() => {
    setShowReportForm(false);
  }, []);

  return (
    <div
      className="relative h-[calc(100vh-60px)] w-full"
      role="region"
      aria-label="Environmental issues map"
    >
      {/* Map with pins - full width, no sidebar margin */}
      <div className="h-full w-full">
        <IssueMapClient>
          <IssuePinLayer />
        </IssueMapClient>
      </div>

      {/* Filters (mobile: FAB + sheet, desktop: toggle sidebar) */}
      <MapFilters filteredCount={pins.length} />

      {/* Report FAB - hidden when report form is open */}
      {!showReportForm && <ReportFAB onClick={handleReportClick} />}

      {/* Report Form Modal - Portal rendered outside map container */}
      {showReportForm && (
        <>
          {/* Backdrop - covers everything including map */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            style={{ zIndex: 9998 }}
            onClick={handleReportCancel}
            aria-hidden="true"
          />
          {/* Modal container - above backdrop */}
          <div
            className="fixed inset-0 overflow-y-auto"
            style={{ zIndex: 9999 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-form-title"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-lg rounded-xl bg-card p-6 shadow-2xl border border-border">
                <h2 id="report-form-title" className="mb-4 text-xl font-bold text-foreground">
                  Report an Issue
                </h2>
                <ReportForm onSuccess={handleReportSuccess} onCancel={handleReportCancel} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
