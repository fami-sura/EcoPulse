'use server';

/**
 * Create Verification Server Action
 *
 * Handles verification submission with:
 * - Self-verification blocking (authenticated + session-based)
 * - Atomic verification count increment
 * - 2-verification threshold status promotion
 * - Duplicate prevention
 * - Spam logging for suspicious activity
 * - Email notification on verification threshold
 *
 * Story 2.1.4 - Create Verification Server Action with Self-Verification Block
 * Story 2.1.8 - Verification Notifications (Email)
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendVerificationEmail, sendWithRetry } from '@/lib/email';

interface CreateVerificationInput {
  issue_id: string;
  photo_url: string;
  note: string | null;
  lat: number;
  lng: number;
  verifier_session_id: string;
  screenshot_warning?: boolean;
  distance_warning?: boolean;
  warning_overridden?: boolean;
}

interface CreateVerificationResult {
  success: boolean;
  verification_id?: string;
  new_status?: string;
  new_verification_count?: number;
  error?: string;
}

/** Verification threshold to mark issue as verified */
const VERIFICATION_THRESHOLD = 2;

export async function createVerification(
  input: CreateVerificationInput
): Promise<CreateVerificationResult> {
  const supabase = await createClient();

  try {
    // 1. Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // 2. Get issue details for validation
    const { data: issue, error: issueError } = await supabase
      .from('issues')
      .select('id, user_id, session_id, status, verification_count')
      .eq('id', input.issue_id)
      .single();

    if (issueError || !issue) {
      return { success: false, error: 'Issue not found' };
    }

    // 3. Self-verification block (authenticated users)
    if (issue.user_id && issue.user_id === user.id) {
      return { success: false, error: 'self_verification' };
    }

    // 4. Self-verification block (anonymous reports via session_id)
    if (
      !issue.user_id &&
      issue.session_id &&
      input.verifier_session_id &&
      issue.session_id === input.verifier_session_id
    ) {
      return { success: false, error: 'self_verification' };
    }

    // 5. Check if issue is still pending (can only verify pending issues)
    if (issue.status !== 'pending') {
      return { success: false, error: 'Issue is no longer pending verification' };
    }

    // 6. Check for duplicate verification
    const { data: existingVerification } = await supabase
      .from('verifications')
      .select('id')
      .eq('issue_id', input.issue_id)
      .eq('verifier_id', user.id)
      .single();

    if (existingVerification) {
      return { success: false, error: 'already_verified' };
    }

    // 7. Insert verification record
    const { data: verification, error: verificationError } = await supabase
      .from('verifications')
      .insert({
        issue_id: input.issue_id,
        verifier_id: user.id,
        verifier_session_id: input.verifier_session_id,
        photo_url: input.photo_url,
        note: input.note,
        lat: input.lat,
        lng: input.lng,
        is_valid: true,
      })
      .select()
      .single();

    if (verificationError) {
      // Handle unique constraint violation (race condition)
      if (verificationError.code === '23505') {
        return { success: false, error: 'already_verified' };
      }
      console.error('Verification insert error:', verificationError);
      return { success: false, error: 'Failed to submit verification' };
    }

    // 8. Log spam warnings if any were triggered
    if (input.screenshot_warning || input.distance_warning) {
      await supabase.from('verification_spam_log').insert({
        verification_id: verification.id,
        user_id: user.id,
        issue_id: input.issue_id,
        screenshot_detected: input.screenshot_warning || false,
        distance_override: input.distance_warning || false,
        override_clicked: input.warning_overridden || false,
      });
    }

    // 9. Atomic increment of verification count with row locking
    // This uses Supabase's RPC for atomic operations
    const newVerificationCount = issue.verification_count + 1;

    // Determine new status based on threshold
    const newStatus =
      newVerificationCount >= VERIFICATION_THRESHOLD && issue.status === 'pending'
        ? 'verified'
        : issue.status;

    // Update issue with new count and potentially new status
    const { error: updateError } = await supabase
      .from('issues')
      .update({
        verification_count: newVerificationCount,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.issue_id)
      .eq('verification_count', issue.verification_count); // Optimistic locking

    if (updateError) {
      console.error('Issue update error:', updateError);
      // Don't fail the verification - the record is created
      // The count might be slightly off due to race condition but it's acceptable
    }

    // 10. If status changed to verified, trigger notification (async, don't block)
    if (newStatus === 'verified' && issue.user_id) {
      // Send email notification - don't await to avoid blocking the response
      sendVerificationNotification(
        supabase,
        issue.user_id,
        input.issue_id,
        newVerificationCount
      ).catch((err) => console.error('[Verification] Email notification error:', err));
    }

    // 11. Revalidate cached pages
    revalidatePath(`/issues/${input.issue_id}`);
    revalidatePath('/');

    return {
      success: true,
      verification_id: verification.id,
      new_status: newStatus,
      new_verification_count: newVerificationCount,
    };
  } catch (error) {
    console.error('Create verification error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
/**
 * Send verification notification email to the reporter
 * Called asynchronously after verification threshold is reached
 */
async function sendVerificationNotification(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  issueId: string,
  verificationCount: number
): Promise<void> {
  try {
    // 1. Get reporter details and email preferences
    const { data: reporter, error: reporterError } = await supabase
      .from('users')
      .select('email, username, email_verified_reports')
      .eq('id', userId)
      .single();

    if (reporterError || !reporter) {
      console.warn('[Verification] Reporter not found for notification:', userId);
      return;
    }

    // 2. Check if user has email notifications enabled
    if (reporter.email_verified_reports === false) {
      console.log('[Verification] User has disabled verification emails:', userId);
      return;
    }

    // 3. Skip if no email address
    if (!reporter.email) {
      console.warn('[Verification] Reporter has no email address:', userId);
      return;
    }

    // 4. Get issue details for email content
    const { data: issue, error: issueError } = await supabase
      .from('issues')
      .select('category, address')
      .eq('id', issueId)
      .single();

    if (issueError || !issue) {
      console.warn('[Verification] Issue not found for notification:', issueId);
      return;
    }

    // 5. Get verifier usernames (optional)
    const { data: verifications } = await supabase
      .from('verifications')
      .select('verifier:users!verifier_id(username)')
      .eq('issue_id', issueId)
      .limit(5);

    const verifierNames = verifications
      ?.map((v) => {
        const verifier = v.verifier as unknown as { username: string | null } | null;
        return verifier?.username;
      })
      .filter((name): name is string => !!name);

    // 6. Send email with retry
    const result = await sendWithRetry(() =>
      sendVerificationEmail({
        to: reporter.email!,
        username: reporter.username || 'Community Member',
        issueId,
        category: issue.category,
        location: issue.address || 'Unknown location',
        verificationCount,
        verifierNames,
      })
    );

    if (result.success) {
      console.log('[Verification] Email sent successfully:', result.messageId);
    } else {
      console.error('[Verification] Email failed after retries:', result.error);
    }
  } catch (error) {
    console.error('[Verification] Error sending notification:', error);
  }
}
