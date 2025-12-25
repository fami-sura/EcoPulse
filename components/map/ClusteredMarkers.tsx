'use client';

/**
 * ClusteredMarkers Component
 *
 * Wraps issue markers in a MarkerClusterGroup for client-side clustering.
 * Improves performance and readability when displaying many pins.
 *
 * @features
 * - Custom cluster icons with count display
 * - Dynamic sizing based on cluster count (small/medium/large)
 * - Green/gray color scheme matching app design
 * - Click to zoom in and reveal pins
 * - Chunked loading for better performance
 * - Popup with issue details on marker click
 *
 * @accessibility
 * - Cluster badges are aria-labeled with count
 * - Keyboard navigable clusters
 */

import MarkerClusterGroup from 'react-leaflet-cluster';
import { divIcon } from 'leaflet';
import { IssueMarker } from './IssueMarker';
import { IssuePopup } from './IssuePopup';
import type { MapPin } from '@/stores/mapStore';

interface ClusteredMarkersProps {
  /** Array of pins to cluster and display */
  pins: MapPin[];
  /** Callback when a pin is clicked */
  onPinClick?: (pinId: string) => void;
}

/**
 * Size categories for cluster badges
 */
type ClusterSize = 'small' | 'medium' | 'large';

/**
 * Get the size category based on pin count
 */
function getClusterSize(count: number): ClusterSize {
  if (count >= 50) return 'large';
  if (count >= 10) return 'medium';
  return 'small';
}

/**
 * Cluster type from leaflet.markercluster
 */
interface ClusterMarker {
  getChildCount: () => number;
}

/**
 * Create a custom cluster icon with count and sizing
 */
function createClusterIcon(cluster: ClusterMarker) {
  const count = cluster.getChildCount();
  const size = getClusterSize(count);

  // Size dimensions for each category
  const dimensions = {
    small: { width: 40, height: 40, fontSize: 14 },
    medium: { width: 50, height: 50, fontSize: 16 },
    large: { width: 60, height: 60, fontSize: 18 },
  };

  const { width, height, fontSize } = dimensions[size];

  return divIcon({
    html: `
      <div 
        class="cluster-icon cluster-${size}" 
        role="button"
        aria-label="${count} reports in this area"
        style="width: ${width}px; height: ${height}px; font-size: ${fontSize}px;"
      >
        ${count}
      </div>
    `,
    className: 'custom-cluster-marker',
    iconSize: [width, height],
  });
}

export function ClusteredMarkers({ pins, onPinClick }: ClusteredMarkersProps) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={80}
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={false}
      iconCreateFunction={createClusterIcon}
      animate={true}
      animateAddingMarkers={false}
      disableClusteringAtZoom={18}
      removeOutsideVisibleBounds={true}
    >
      {pins.map((pin) => (
        <IssueMarker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          status={pin.status}
          category={pin.category}
          issueId={pin.id}
          onClick={onPinClick ? () => onPinClick(pin.id) : undefined}
          popupContent={<IssuePopup pin={pin} />}
        />
      ))}
    </MarkerClusterGroup>
  );
}
