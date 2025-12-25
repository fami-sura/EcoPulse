'use client';

/**
 * IssuePinLayer Component
 *
 * Displays issue markers on the map based on current bounds.
 * Fetches issues from the server when map bounds change.
 *
 * @features
 * - Bounds-based fetching (only loads visible area)
 * - Responsive limits (50 mobile, 100 desktop)
 * - Loading state with spinner
 * - Error handling with retry
 * - Click handler for pin selection
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { ClusteredMarkers } from './ClusteredMarkers';
import { useMapStore, type MapPin } from '@/stores/mapStore';
import { getMapIssues } from '@/app/actions/getMapIssues';
import { MAP_ISSUE_LIMITS, type MapBounds, type MapIssue } from '@/lib/map/constants';

/** Debounce delay for map movement in ms */
const FETCH_DEBOUNCE_MS = 300;

/** Minimum bounds change to trigger refetch (in degrees) */
const MIN_BOUNDS_CHANGE = 0.001;

export function IssuePinLayer() {
  const map = useMap();
  const { pins, setPins, setSelectedPinId, isLoadingPins, setLoadingPins, filters } = useMapStore();
  const [error, setError] = useState<string | null>(null);

  // Track last fetched bounds and filters to prevent duplicate fetches
  const lastBoundsRef = useRef<MapBounds | null>(null);
  const lastFiltersRef = useRef<string | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Determine if we're on mobile based on viewport width
   */
  const isMobile = useCallback(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  }, []);

  /**
   * Get current map bounds as MapBounds
   */
  const getMapBounds = useCallback((): MapBounds | null => {
    // Guard against map not being fully initialized
    if (!map || !map.getContainer() || !map.getBounds) {
      return null;
    }
    try {
      const bounds = map.getBounds();
      return {
        sw_lat: bounds.getSouthWest().lat,
        sw_lng: bounds.getSouthWest().lng,
        ne_lat: bounds.getNorthEast().lat,
        ne_lng: bounds.getNorthEast().lng,
      };
    } catch {
      return null;
    }
  }, [map]);

  /**
   * Check if bounds have changed significantly
   */
  const boundsChanged = useCallback((newBounds: MapBounds): boolean => {
    if (!lastBoundsRef.current) return true;

    const prev = lastBoundsRef.current;
    return (
      Math.abs(newBounds.sw_lat - prev.sw_lat) > MIN_BOUNDS_CHANGE ||
      Math.abs(newBounds.sw_lng - prev.sw_lng) > MIN_BOUNDS_CHANGE ||
      Math.abs(newBounds.ne_lat - prev.ne_lat) > MIN_BOUNDS_CHANGE ||
      Math.abs(newBounds.ne_lng - prev.ne_lng) > MIN_BOUNDS_CHANGE
    );
  }, []);

  /**
   * Fetch issues within current bounds
   */
  const fetchIssues = useCallback(
    async (forceRefresh = false) => {
      const bounds = getMapBounds();

      // Skip if map bounds not available yet
      if (!bounds) {
        return;
      }

      const filtersKey = JSON.stringify(filters);

      // Skip if bounds and filters haven't changed significantly (unless forced)
      if (!forceRefresh && !boundsChanged(bounds) && lastFiltersRef.current === filtersKey) {
        return;
      }

      // Update last bounds and filters
      lastBoundsRef.current = bounds;
      lastFiltersRef.current = filtersKey;

      setLoadingPins(true);
      setError(null);

      try {
        const limit = isMobile() ? MAP_ISSUE_LIMITS.mobile : MAP_ISSUE_LIMITS.desktop;

        // Build filters param for server action
        const filtersParam = {
          categories: filters.categories.length > 0 ? filters.categories : undefined,
          statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
          dateRange: filters.dateRange !== 'all' ? filters.dateRange : undefined,
        };

        const response = await getMapIssues(bounds, limit, filtersParam);

        if (response.success) {
          // Transform MapIssue to MapPin format
          const mapPins: MapPin[] = response.data.map((issue: MapIssue) => ({
            id: issue.id,
            lat: issue.lat,
            lng: issue.lng,
            status: issue.status,
            category: issue.category,
            severity: issue.severity,
            photos: issue.photos,
            created_at: issue.created_at,
            note: issue.note,
            address: issue.address,
          }));
          setPins(mapPins);
        } else {
          setError(response.error);
        }
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Unable to load issues. Please try again.');
      } finally {
        setLoadingPins(false);
      }
    },
    [getMapBounds, boundsChanged, isMobile, setPins, setLoadingPins, filters]
  );

  /**
   * Debounced fetch on map movement
   */
  const debouncedFetch = useCallback(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(() => fetchIssues(false), FETCH_DEBOUNCE_MS);
  }, [fetchIssues]);

  /**
   * Handle map events (moveend, zoomend)
   */
  useMapEvents({
    moveend: debouncedFetch,
    zoomend: debouncedFetch,
  });

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchIssues(true);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount - fetchIssues is stable

  /**
   * Refetch when filters change
   */
  useEffect(() => {
    fetchIssues(true);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Handle pin click
   */
  const handlePinClick = useCallback(
    (pinId: string) => {
      setSelectedPinId(pinId);
    },
    [setSelectedPinId]
  );

  // Render loading spinner overlay
  if (isLoadingPins && pins.length === 0) {
    return (
      <div className="absolute left-1/2 top-1/2 z-1000 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4 shadow-lg">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
          <span className="text-sm text-gray-600">Loading issues...</span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && pins.length === 0) {
    return (
      <div className="absolute left-1/2 top-1/2 z-1000 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4 shadow-lg">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => fetchIssues(true)}
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render pins with clustering
  return (
    <>
      <ClusteredMarkers pins={pins} onPinClick={handlePinClick} />

      {/* Loading indicator overlay when refetching */}
      {isLoadingPins && pins.length > 0 && (
        <div className="absolute right-4 top-4 z-1000">
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-lg">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
            <span className="text-sm text-gray-600">Updating...</span>
          </div>
        </div>
      )}
    </>
  );
}

export default IssuePinLayer;
