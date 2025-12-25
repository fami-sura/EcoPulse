/**
 * useMediaQuery Hook
 *
 * A custom hook for responsive design that listens to CSS media queries.
 * Useful for conditionally rendering components based on viewport size
 * or other media features.
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
 * ```
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that tracks whether a CSS media query matches
 * @param query - CSS media query string (e.g., '(max-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Lazy initialize with current query state
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  const handleChange = useCallback((event: MediaQueryListEvent) => {
    setMatches(event.matches);
  }, []);

  useEffect(() => {
    // Skip if window is not available (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // Modern browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers (Safari < 14)
      mediaQueryList.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query, handleChange]);

  return matches;
}

// Common breakpoint presets for convenience
export const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  touch: '(hover: none) and (pointer: coarse)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  darkMode: '(prefers-color-scheme: dark)',
} as const;

/**
 * Convenience hook for checking mobile viewport
 */
export function useIsMobile(): boolean {
  return useMediaQuery(breakpoints.mobile);
}

/**
 * Convenience hook for checking desktop viewport
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(breakpoints.desktop);
}

/**
 * Convenience hook for checking if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(breakpoints.reducedMotion);
}
