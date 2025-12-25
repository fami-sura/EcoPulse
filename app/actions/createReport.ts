'use server';

/**
 * createReport Server Action
 *
 * Submits a new environmental issue report to Supabase.
 *
 * @features
 * - Insert into issues table
 * - Session ID for anonymous retroactive credit
 * - Revalidate home page cache
 * - Structured error handling
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ReportFormData {
  /** Photo URLs from upload */
  photoUrls: string[];
  /** Latitude */
  lat: number;
  /** Longitude */
  lng: number;
  /** Human-readable address */
  address: string;
  /** Issue category */
  category: 'waste' | 'drainage';
  /** Issue severity */
  severity: 'low' | 'medium' | 'high';
  /** User note/description */
  note: string;
  /** Anonymous session ID for retroactive credit */
  sessionId: string;
}

export interface CreateReportResult {
  success: boolean;
  reportId?: string;
  error?: string;
}

/**
 * Create a new environmental issue report
 */
export async function createReport(reportData: ReportFormData): Promise<CreateReportResult> {
  try {
    // Validate required fields
    if (!reportData.photoUrls || reportData.photoUrls.length === 0) {
      return { success: false, error: 'At least one photo is required' };
    }

    if (!reportData.lat || !reportData.lng) {
      return { success: false, error: 'Location is required' };
    }

    if (!reportData.category) {
      return { success: false, error: 'Category is required' };
    }

    if (!reportData.note || reportData.note.length < 60) {
      return {
        success: false,
        error: 'Description must be at least 60 characters',
      };
    }

    const supabase = await createClient();

    // Get current user (if authenticated)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Build insert data based on authentication status
    const insertData: Record<string, unknown> = {
      photos: reportData.photoUrls,
      lat: reportData.lat,
      lng: reportData.lng,
      address: reportData.address || null,
      category: reportData.category,
      severity: reportData.severity || 'medium',
      note: reportData.note,
      status: 'pending',
    };

    // For authenticated users: set user_id, no session_id
    // For anonymous users: set session_id, no user_id
    if (user) {
      insertData.user_id = user.id;
      // Don't set session_id for authenticated users
    } else {
      insertData.session_id = reportData.sessionId;
      // user_id stays null for anonymous users
    }

    // Insert the report
    const { data, error } = await supabase.from('issues').insert(insertData).select('id').single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(error.message);
    }

    // Revalidate home page to show new pin
    revalidatePath('/');
    revalidatePath('/[locale]');

    return { success: true, reportId: data.id };
  } catch (err) {
    console.error('Report submission error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to submit report. Please try again.',
    };
  }
}
