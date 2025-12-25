'use client';

/**
 * useGeolocation Hook
 *
 * Custom hook for browser geolocation with reverse geocoding.
 *
 * @features
 * - Auto-detect location on mount
 * - Reverse geocoding via Nominatim
 * - Rate limit compliance (1 req/sec debounce)
 * - Error handling
 * - Refetch capability
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/** Geolocation timeout in ms */
const GEO_TIMEOUT = 5000;

/** Debounce delay for reverse geocoding */
const GEOCODE_DEBOUNCE = 1000;

export interface GeolocationResult {
  lat: number;
  lng: number;
  accuracy: number;
  address: string;
}

export interface UseGeolocationReturn {
  /** Current location */
  location: GeolocationResult | null;
  /** Whether location is being fetched */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether geolocation was denied by user */
  isDenied: boolean;
  /** Trigger location refetch */
  refetch: () => void;
  /** Update location manually */
  setLocation: (location: { lat: number; lng: number }) => Promise<void>;
}

/**
 * Reverse geocode coordinates to address using Nominatim
 */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'EcoPulse/1.0 (environmental-reporting-app)',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

export function useGeolocation(autoFetch = true): UseGeolocationReturn {
  const [location, setLocationState] = useState<GeolocationResult | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [isDenied, setIsDenied] = useState(false);

  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  /**
   * Fetch current location
   */
  const fetchLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported. Please place pin manually.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsDenied(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!isMountedRef.current) return;

        const { latitude, longitude, accuracy } = position.coords;

        // Debounce reverse geocoding
        if (geocodeTimeoutRef.current) {
          clearTimeout(geocodeTimeoutRef.current);
        }

        geocodeTimeoutRef.current = setTimeout(async () => {
          if (!isMountedRef.current) return;

          const address = await reverseGeocode(latitude, longitude);

          if (isMountedRef.current) {
            setLocationState({
              lat: latitude,
              lng: longitude,
              accuracy,
              address,
            });
            setLoading(false);
          }
        }, GEOCODE_DEBOUNCE);
      },
      (geoError) => {
        if (!isMountedRef.current) return;

        let errorMessage: string;

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please place pin on map manually.';
            setIsDenied(true);
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Please place pin on map manually.';
            break;
          case geoError.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or place pin manually.';
            break;
          default:
            errorMessage = 'Unable to detect location. Please place pin manually.';
        }

        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: GEO_TIMEOUT,
        maximumAge: 0,
      }
    );
  }, []);

  /**
   * Set location manually and reverse geocode
   */
  const setLocation = useCallback(async (coords: { lat: number; lng: number }) => {
    setLoading(true);

    // Debounce reverse geocoding
    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current);
    }

    geocodeTimeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;

      const address = await reverseGeocode(coords.lat, coords.lng);

      if (isMountedRef.current) {
        setLocationState({
          lat: coords.lat,
          lng: coords.lng,
          accuracy: 0, // Manual placement has no accuracy
          address,
        });
        setLoading(false);
        setError(null);
      }
    }, GEOCODE_DEBOUNCE);
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    isMountedRef.current = true;

    if (autoFetch) {
      fetchLocation();
    }

    return () => {
      isMountedRef.current = false;
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
      }
    };
  }, [autoFetch, fetchLocation]);

  return {
    location,
    loading,
    error,
    isDenied,
    refetch: fetchLocation,
    setLocation,
  };
}

export default useGeolocation;
