'use client';

/**
 * HeroMapPreviewContent Component
 *
 * The actual Leaflet map content, separated for dynamic import.
 * This component is only loaded on the client side.
 */

import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

export interface SampleMarker {
  id: number;
  lat: number;
  lng: number;
  status: 'verified' | 'pending' | 'in_progress' | 'resolved';
  category: 'waste' | 'drainage';
}

export interface HeroMapPreviewContentProps {
  center: LatLngExpression;
  zoom: number;
  markers: SampleMarker[];
}

// Status colors
const statusColors: Record<SampleMarker['status'], string> = {
  verified: '#10b981', // emerald-500
  pending: '#f59e0b', // amber-500
  in_progress: '#3b82f6', // blue-500
  resolved: '#6b7280', // gray-500
};

export function HeroMapPreviewContent({ center, zoom, markers }: HeroMapPreviewContentProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
    >
      {/* Use a subtle map style */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />

      {/* Sample markers */}
      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={10}
          pathOptions={{
            fillColor: statusColors[marker.status],
            fillOpacity: 0.8,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
          }}
        >
          <Tooltip
            direction="top"
            offset={[0, -10]}
            opacity={1}
            className="bg-background! text-foreground! border-border! rounded-lg! shadow-lg! px-3! py-2! text-xs!"
          >
            <span className="font-medium capitalize">{marker.category}</span>
            <span className="text-muted-foreground"> • {marker.status.replace('_', ' ')}</span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default HeroMapPreviewContent;
