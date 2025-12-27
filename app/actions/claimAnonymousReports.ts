'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * claimAnonymousReports Server Action
 *
 * Claims anonymous reports for the authenticated user by matching session IDs.
 * Awards retroactive points for all claimed reports.
 *
 * @param sessionId - The anonymous session ID from localStorage
 * @returns Object containing success status, claimed count, and points awarded
 */

export interface ClaimResult {
  success: boolean;
  claimedCount: number;
  pointsAwarded?: number;
  error?: string;
}

export async function claimAnonymousReports(sessionId: string): Promise<ClaimResult> {
  // Validate session ID
  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, claimedCount: 0, error: 'Invalid session ID' };
  }

  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, claimedCount: 0, error: 'Not authenticated' };
  }

  try {
    // Find anonymous reports with this session_id that haven't been claimed
    const { data: reports, error: fetchError } = await supabase
      .from('issues')
      .select('id')
      .eq('session_id', sessionId)
      .is('user_id', null);

    if (fetchError) {
      console.error('Error fetching anonymous reports:', fetchError);
      return { success: false, claimedCount: 0, error: fetchError.message };
    }

    // No reports to claim
    if (!reports || reports.length === 0) {
      return { success: true, claimedCount: 0 };
    }

    // Update reports to claim them (set user_id, clear session_id)
    const reportIds = reports.map((r) => r.id);
    const { error: updateError } = await supabase
      .from('issues')
      .update({ user_id: user.id, session_id: null })
      .in('id', reportIds);

    if (updateError) {
      console.error('Error claiming reports:', updateError);
      return { success: false, claimedCount: 0, error: updateError.message };
    }

    // Award retroactive points (10 points per report)
    const pointsToAward = reports.length * 10;

    // Update user's total points using RPC function for atomic increment
    // If RPC doesn't exist, fall back to direct update
    const { error: pointsError } = await supabase.rpc('increment_user_points', {
      user_id_param: user.id,
      points_to_add: pointsToAward,
    });

    // Fallback if RPC function doesn't exist
    if (pointsError && pointsError.code === 'PGRST202') {
      // Function not found, try direct update
      const { data: currentUser, error: getUserError } = await supabase
        .from('users')
        .select('points')
        .eq('id', user.id)
        .single();

      if (!getUserError && currentUser) {
        await supabase
          .from('users')
          .update({ points: (currentUser.points || 0) + pointsToAward })
          .eq('id', user.id);
      }
    }

    // Insert point history records for audit trail
    const pointHistoryRecords = reports.map((report) => ({
      user_id: user.id,
      amount: 10,
      reason: `claimed_anonymous_report`,
      issue_id: report.id,
      created_at: new Date().toISOString(),
    }));

    // Try to insert point history - don't fail if table doesn't exist yet
    const { error: historyError } = await supabase
      .from('points_history')
      .insert(pointHistoryRecords);

    if (historyError) {
      // Log but don't fail - points_history table may not exist yet
      console.warn('Points history insert warning (non-fatal):', historyError.message);
    }

    return {
      success: true,
      claimedCount: reports.length,
      pointsAwarded: pointsToAward,
    };
  } catch (error) {
    console.error('Claim anonymous reports error:', error);
    // Return failure with error details
    return {
      success: false,
      claimedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
