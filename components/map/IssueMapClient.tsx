'use client';

/**
 * IssueMapClient Component
 *
 * Main map view component that displays environmental issues.
 * Uses browser geolocation to center on user's location.
 *
 * This is the client-only version that actually renders Leaflet.
 * It's imported dynamically by IssueMap to avoid SSR issues.
 *
 * @features
 * - Geolocation detection with 5-second timeout
 * - Nigeria center fallback if geolocation denied/unavailable
 * - Full viewport height minus header (60px)
 *
 * @accessibility
 * - Zoom controls with 44x44px touch targets
 * - Screen reader announcements for location changes
 */

import { useEffect, useState, useCallback, useRef, useId } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet';
import { useMapStore } from '@/stores/mapStore';
import { NIGERIA_CENTER, MAP_ZOOM } from '@/lib/map/constants';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

/** Geolocation timeout in milliseconds */
const GEOLOCATION_TIMEOUT = 5000;

type GeolocationStatus = 'pending' | 'success' | 'error' | 'unavailable';

/**
 * Component to update map center when props change
 */
function MapCenterUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [map, center]);

  return null;
}

interface IssueMapClientProps {
  children?: React.ReactNode;
}

export function IssueMapClient({ children }: IssueMapClientProps) {
  const { center, zoom, setCenter, setZoom } = useMapStore();
  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>('pending');
  const [isReady, setIsReady] = useState(false);
  const geolocationAttempted = useRef(false);
  const mapRef = useRef<LeafletMap | null>(null);
  const mapId = useId();

  /**
   * Handle successful geolocation
   */
  const handleGeolocationSuccess = useCallback(
    (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setCenter([latitude, longitude]);
      setZoom(MAP_ZOOM.neighborhood);
      setGeolocationStatus('success');
      setIsReady(true);
    },
    [setCenter, setZoom]
  );

  /**
   * Handle geolocation error (denied, unavailable, timeout)
   */
  const handleGeolocationError = useCallback(
    (error: GeolocationPositionError) => {
      console.warn('Geolocation error:', error.message);
      // Fall back to Nigeria center for country-wide view
      setCenter(NIGERIA_CENTER);
      setZoom(MAP_ZOOM.country);
      setGeolocationStatus('error');
      setIsReady(true);
    },
    [setCenter, setZoom]
  );

  /**
   * Request user's geolocation on mount
   */
  useEffect(() => {
    // Prevent double-execution in StrictMode
    if (geolocationAttempted.current) return;
    geolocationAttempted.current = true;

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      // Use setTimeout to avoid sync setState in effect
      setTimeout(() => {
        setCenter(NIGERIA_CENTER);
        setZoom(MAP_ZOOM.country);
        setGeolocationStatus('unavailable');
        setIsReady(true);
      }, 0);
      return;
    }

    // Request current position with timeout
    navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError, {
      timeout: GEOLOCATION_TIMEOUT,
      enableHighAccuracy: false,
      maximumAge: 60000,
    });
  }, [handleGeolocationSuccess, handleGeolocationError, setCenter, setZoom]);

  // Cleanup map on unmount to prevent reuse issues
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Don't render map until geolocation is resolved
  if (!isReady) {
    return null;
  }

  return (
    <>
      <MapContainer
        key={mapId}
        ref={mapRef}
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Map lifecycle handlers */}
        <MapCenterUpdater center={center} />

        {/* Children (pins, overlays, etc.) */}
        {children}
      </MapContainer>

      {/* Screen reader announcement for location */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {geolocationStatus === 'success' && 'Map centered on your current location'}
        {geolocationStatus === 'error' && 'Could not get your location. Map centered on Nigeria'}
        {geolocationStatus === 'unavailable' &&
          'Geolocation not available. Map centered on Nigeria'}
      </div>
    </>
  );
}

export default IssueMapClient;
