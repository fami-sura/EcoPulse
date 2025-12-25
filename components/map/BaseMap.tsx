'use client';

/**
 * BaseMap Component
 *
 * Foundation map component using Leaflet + OpenStreetMap.
 * Provides the base map rendering with configurable center, zoom, and children for markers.
 *
 * @example
 * <BaseMap center={[6.5244, 3.3792]} zoom={13}>
 *   <IssueMarker position={[6.525, 3.380]} status="pending" />
 * </BaseMap>
 */

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ReactNode, useEffect } from 'react';

// Import Leaflet CSS - CRITICAL for map display
import 'leaflet/dist/leaflet.css';

interface BaseMapProps {
  /** Map center coordinates [lat, lng] */
  center: LatLngExpression;
  /** Zoom level (1-19, higher = more zoomed in) */
  zoom?: number;
  /** Child components (markers, overlays, etc.) */
  children?: ReactNode;
  /** CSS class for the map container */
  className?: string;
  /** Callback when map is ready */
  onMapReady?: () => void;
}

/**
 * Component to handle map ready callback
 */
function MapReadyHandler({ onReady }: { onReady?: () => void }) {
  const map = useMap();

  useEffect(() => {
    if (map && onReady) {
      onReady();
    }
  }, [map, onReady]);

  return null;
}

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

export function BaseMap({
  center,
  zoom = 13,
  children,
  className = 'h-full w-full',
  onMapReady,
}: BaseMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      scrollWheelZoom={true}
      zoomControl={true}
      attributionControl={true}
    >
      {/* OpenStreetMap Tiles - Free, no API key required */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* Map lifecycle handlers */}
      <MapReadyHandler onReady={onMapReady} />
      <MapCenterUpdater center={center} />

      {/* Markers, overlays, etc. */}
      {children}
    </MapContainer>
  );
}

export default BaseMap;
