'use server';

/**
 * getMapIssues Server Action
 *
 * Fetches environmental issues within map bounds from Supabase.
 * RLS policies automatically enforce is_flagged = false filter.
 *
 * @param bounds - Map viewport bounds (sw_lat, sw_lng, ne_lat, ne_lng)
 * @param limit - Maximum number of issues to return (50 mobile, 100 desktop)
 * @param filters - Optional filters for category, status, and date range
 * @returns Issues within bounds or error
 */

import { createClient } from '@/lib/supabase/server';
import type { MapBounds, GetMapIssuesResponse, MapFiltersParam } from '@/lib/map/constants';
import { MAP_ISSUE_LIMITS } from '@/lib/map/constants';

/**
 * Calculate date threshold for date range filter
 */
function getDateThreshold(dateRange: MapFiltersParam['dateRange']): Date | null {
  if (!dateRange || dateRange === 'all') return null;

  const now = new Date();
  const days = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
  }[dateRange];

  if (!days) return null;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

/**
 * Fetch issues within map bounds
 *
 * @param bounds - Map viewport bounds
 * @param limit - Maximum issues to return (default: 50)
 * @param filters - Optional category, status, date range filters
 * @returns Array of issues or error
 */
export async function getMapIssues(
  bounds: MapBounds,
  limit: number = MAP_ISSUE_LIMITS.mobile,
  filters?: MapFiltersParam
): Promise<GetMapIssuesResponse> {
  try {
    const supabase = await createClient();

    // Validate bounds
    if (
      typeof bounds.sw_lat !== 'number' ||
      typeof bounds.sw_lng !== 'number' ||
      typeof bounds.ne_lat !== 'number' ||
      typeof bounds.ne_lng !== 'number' ||
      Number.isNaN(bounds.sw_lat) ||
      Number.isNaN(bounds.sw_lng) ||
      Number.isNaN(bounds.ne_lat) ||
      Number.isNaN(bounds.ne_lng)
    ) {
      return { success: false, error: 'Invalid bounds parameters' };
    }

    // Validate limit
    const safeLimit = Math.min(Math.max(1, limit), MAP_ISSUE_LIMITS.desktop);

    // Build query with filters
    let query = supabase
      .from('issues')
      .select('id, lat, lng, status, category, photos, created_at, severity, note, address')
      .eq('is_flagged', false)
      .gte('lat', bounds.sw_lat)
      .lte('lat', bounds.ne_lat)
      .gte('lng', bounds.sw_lng)
      .lte('lng', bounds.ne_lng);

    // Apply category filter
    if (filters?.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }

    // Apply status filter
    if (filters?.statuses && filters.statuses.length > 0) {
      query = query.in('status', filters.statuses);
    }

    // Apply date range filter
    const dateThreshold = getDateThreshold(filters?.dateRange);
    if (dateThreshold) {
      query = query.gte('created_at', dateThreshold.toISOString());
    }

    // Execute query with ordering and limit
    const { data, error } = await query.order('created_at', { ascending: false }).limit(safeLimit);

    if (error) {
      console.error('Error fetching map issues:', error);
      return { success: false, error: 'Unable to load issues. Please try again.' };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('Unexpected error in getMapIssues:', error);
    return { success: false, error: 'Unable to load issues. Please try again.' };
  }
}
