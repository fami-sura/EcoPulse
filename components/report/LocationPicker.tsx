'use client';

/**
 * LocationPicker Component
 *
 * Map-based location picker with draggable marker and address search.
 *
 * @features
 * - Draggable marker for precise location
 * - Address search with Nominatim autocomplete
 * - Reverse geocoding on pin drag
 * - Reset to current location button
 * - Touch-friendly for mobile
 *
 * @accessibility
 * - Screen reader support
 * - Keyboard navigation
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Location01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

/** Nominatim search API */
const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

/** Debounce delay in ms */
const DEBOUNCE_DELAY = 1000;

/** Default marker icon */
const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerProps {
  /** Initial location */
  initialLocation: { lat: number; lng: number } | null;
  /** Initial address */
  initialAddress?: string;
  /** Callback when location changes */
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  /** Callback to refetch current location */
  onRequestCurrentLocation?: () => void;
  /** Custom class names */
  className?: string;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

/**
 * Search for addresses using Nominatim
 */
async function searchAddress(query: string): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '5',
      countrycodes: 'ng', // Limit to Nigeria
    });

    const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params}`, {
      headers: {
        'User-Agent': 'EcoPulse/1.0 (environmental-reporting-app)',
      },
    });

    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
}

/**
 * Reverse geocode coordinates
 */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const params = new URLSearchParams({
      format: 'json',
      lat: lat.toString(),
      lon: lng.toString(),
      zoom: '18',
    });

    const response = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, {
      headers: {
        'User-Agent': 'EcoPulse/1.0 (environmental-reporting-app)',
      },
    });

    if (!response.ok) throw new Error('Reverse geocoding failed');
    const data = await response.json();
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

/**
 * Draggable marker component
 */
function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: LatLng;
  onDragEnd: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const { lat, lng } = marker.getLatLng();
          onDragEnd(lat, lng);
        }
      },
    }),
    [onDragEnd]
  );

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={markerIcon}
    />
  );
}

/**
 * Map events handler for click-to-place
 */
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * Map center updater
 */
function MapCenterUpdater({ center }: { center: LatLng }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [map, center]);

  return null;
}

export function LocationPicker({
  initialLocation,
  initialAddress = '',
  onLocationChange,
  onRequestCurrentLocation,
  className,
}: LocationPickerProps) {
  // Default to Nigeria center if no initial location
  const defaultLocation = initialLocation || { lat: 9.082, lng: 8.6753 };

  const [position, setPosition] = useState<LatLng>(
    new LatLng(defaultLocation.lat, defaultLocation.lng)
  );
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update position when initial location changes from parent
  // This is intentional - syncing controlled props to internal state
  useEffect(() => {
    if (initialLocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosition(new LatLng(initialLocation.lat, initialLocation.lng));
    }
  }, [initialLocation?.lat, initialLocation?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update address when initial address changes from parent
  // This is intentional - syncing controlled props to internal state
  useEffect(() => {
    if (initialAddress) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  /**
   * Handle marker drag or map click
   */
  const handlePositionChange = useCallback(
    (lat: number, lng: number) => {
      const newPosition = new LatLng(lat, lng);
      setPosition(newPosition);

      // Debounce reverse geocoding
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
      }

      geocodeTimeoutRef.current = setTimeout(async () => {
        const newAddress = await reverseGeocode(lat, lng);
        setAddress(newAddress);
        onLocationChange({ lat, lng, address: newAddress });
      }, DEBOUNCE_DELAY);
    },
    [onLocationChange]
  );

  /**
   * Handle search input change
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchAddress(query);
      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, DEBOUNCE_DELAY);
  }, []);

  /**
   * Handle search result selection
   */
  const handleResultSelect = useCallback(
    (result: SearchResult) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      setPosition(new LatLng(lat, lng));
      setAddress(result.display_name);
      setSearchQuery('');
      setShowResults(false);

      onLocationChange({ lat, lng, address: result.display_name });
    },
    [onLocationChange]
  );

  /**
   * Clear search
   */
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  }, []);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search Bar - must be positioned above map with high z-index */}
      <div className="relative z-1000">
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for address or place"
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 z-1001 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => handleResultSelect(result)}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}

        {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 3 && (
          <div className="absolute left-0 right-0 z-1001 mt-1 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <p className="text-sm text-gray-500">No results found</p>
          </div>
        )}
      </div>

      {/* Map Preview */}
      <div className="h-50 w-full overflow-hidden rounded-lg border border-gray-300 md:h-75">
        <MapContainer
          center={position}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker position={position} onDragEnd={handlePositionChange} />
          <MapClickHandler onClick={handlePositionChange} />
          <MapCenterUpdater center={position} />
        </MapContainer>
      </div>

      {/* Current Address */}
      {address && (
        <p className="text-sm text-gray-600">
          <span className="font-medium">Selected location:</span> {address}
        </p>
      )}

      {/* Instruction Text */}
      <p className="text-xs text-gray-500">Tap on the map or drag the pin to adjust the location</p>

      {/* Reset Button */}
      {onRequestCurrentLocation && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRequestCurrentLocation}
          className="w-full"
        >
          <HugeiconsIcon icon={Location01Icon} className="mr-2 h-4 w-4" />
          Reset to Current Location
        </Button>
      )}
    </div>
  );
}

export default LocationPicker;
