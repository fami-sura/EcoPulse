// Type declarations for Leaflet CSS imports
declare module 'leaflet/dist/leaflet.css';

// Type declarations for react-leaflet-cluster
declare module 'react-leaflet-cluster' {
  import type { MarkerCluster, MarkerClusterGroupOptions } from 'leaflet';

  interface MarkerClusterGroupProps extends MarkerClusterGroupOptions {
    children?: React.ReactNode;
    chunkedLoading?: boolean;
    maxClusterRadius?: number;
    spiderfyOnMaxZoom?: boolean;
    showCoverageOnHover?: boolean;
    iconCreateFunction?: (cluster: MarkerCluster) => L.DivIcon;
    animate?: boolean;
    animateAddingMarkers?: boolean;
    disableClusteringAtZoom?: number;
    removeOutsideVisibleBounds?: boolean;
  }

  const MarkerClusterGroup: React.FC<MarkerClusterGroupProps>;
  export default MarkerClusterGroup;
}
