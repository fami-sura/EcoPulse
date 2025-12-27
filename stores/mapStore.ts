/**
 * Map Store - Zustand
 *
 * Manages map-related state:
 * - Map center and zoom
 * - Selected pin
 * - Map filters (category, status, date range)
 * - Pins data
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Database } from '@/lib/supabase/database.types';
import { NIGERIA_CENTER, MAP_ZOOM } from '@/lib/map/constants';

type IssueCategory = Database['public']['Enums']['issue_category'];
type IssueStatus = Database['public']['Enums']['issue_status'];

type IssueSeverity = Database['public']['Enums']['issue_severity'];

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  status: IssueStatus;
  category: IssueCategory;
  severity: IssueSeverity;
  photos: string[];
  created_at: string;
  note: string | null;
  address: string | null;
  verification_count: number;
}

export interface MapFilters {
  categories: IssueCategory[];
  statuses: IssueStatus[];
  dateRange: '7d' | '30d' | '90d' | 'all';
  /** Story 2.1.6: Show only verified issues (verification_count >= 2) */
  verifiedOnly: boolean;
}

interface MapState {
  // Map view state
  center: [number, number];
  zoom: number;

  // Pins
  pins: MapPin[];
  selectedPinId: string | null;
  isLoadingPins: boolean;

  // Filters
  filters: MapFilters;

  // Actions
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setPins: (pins: MapPin[]) => void;
  setSelectedPinId: (id: string | null) => void;
  setLoadingPins: (loading: boolean) => void;
  setFilters: (filters: Partial<MapFilters>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: MapFilters = {
  categories: [],
  statuses: [],
  dateRange: 'all',
  verifiedOnly: false,
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      // Initial state - Nigeria center with country-level zoom
      center: NIGERIA_CENTER,
      zoom: MAP_ZOOM.country,
      pins: [],
      selectedPinId: null,
      isLoadingPins: false,
      filters: DEFAULT_FILTERS,

      // Actions
      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),
      setPins: (pins) => set({ pins }),
      setSelectedPinId: (selectedPinId) => set({ selectedPinId }),
      setLoadingPins: (isLoadingPins) => set({ isLoadingPins }),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
    }),
    {
      name: 'ecopulse-map-store',
      partialize: (state) => ({
        // Only persist filters, not pins or center
        filters: state.filters,
      }),
    }
  )
);
