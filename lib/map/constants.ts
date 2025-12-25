/**
 * Map Constants
 *
 * Shared constants for map components and server actions.
 */

import type { Database } from '@/lib/supabase/database.types';

type IssueRow = Database['public']['Tables']['issues']['Row'];

/**
 * Default limits for mobile and desktop viewports
 */
export const MAP_ISSUE_LIMITS = {
  mobile: 50,
  desktop: 100,
} as const;

/**
 * Nigeria map bounds and defaults
 */
export const NIGERIA_BOUNDS = {
  // Nigeria bounding box
  sw_lat: 4.2,
  sw_lng: 2.7,
  ne_lat: 13.9,
  ne_lng: 14.7,
} as const;

/**
 * Default map center - Nigeria center point
 */
export const NIGERIA_CENTER: [number, number] = [9.082, 8.6753];

/**
 * Lagos fallback center
 */
export const LAGOS_CENTER: [number, number] = [6.5244, 3.3792];

/**
 * Default zoom levels
 */
export const MAP_ZOOM = {
  country: 6, // Nigeria overview
  region: 9, // State level
  city: 12, // City level
  neighborhood: 13, // Default neighborhood view
  street: 16, // Street level
} as const;

/**
 * Map bounds interface
 */
export interface MapBounds {
  /** Southwest latitude (bottom) */
  sw_lat: number;
  /** Southwest longitude (left) */
  sw_lng: number;
  /** Northeast latitude (top) */
  ne_lat: number;
  /** Northeast longitude (right) */
  ne_lng: number;
}

/**
 * Issue data for map display
 */
export interface MapIssue {
  id: string;
  lat: number;
  lng: number;
  status: IssueRow['status'];
  category: IssueRow['category'];
  photos: string[];
  created_at: string;
  severity: IssueRow['severity'];
  note: string | null;
  address: string | null;
}

/**
 * Filter parameters for getMapIssues
 */
export interface MapFiltersParam {
  /** Filter by issue categories */
  categories?: IssueRow['category'][];
  /** Filter by issue statuses */
  statuses?: IssueRow['status'][];
  /** Filter by date range */
  dateRange?: '7d' | '30d' | '90d' | 'all';
}

/**
 * Response type for getMapIssues
 */
export type GetMapIssuesResponse =
  | { success: true; data: MapIssue[] }
  | { success: false; error: string };
