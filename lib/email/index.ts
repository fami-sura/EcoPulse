/**
 * Email Service
 *
 * Centralized email sending using Resend.
 * All email templates and sending logic.
 *
 * Story 2.1.8 - Verification Notifications (Email)
 */

import { Resend } from 'resend';
import { VerificationNotificationEmail } from '@/emails/verification-notification';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/** From address for all emails */
const FROM_EMAIL = process.env.EMAIL_FROM || 'EcoPulse <notifications@ecopulse.ng>';

/** Base URL for links in emails */
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ecopulse.ng';

interface SendVerificationEmailParams {
  /** Recipient email */
  to: string;
  /** Reporter's username */
  username: string;
  /** Issue ID */
  issueId: string;
  /** Issue category */
  category: string;
  /** Issue location */
  location: string;
  /** Number of verifications */
  verificationCount: number;
  /** Names of verifiers (optional) */
  verifierNames?: string[];
}

/**
 * Send verification notification email
 *
 * @param params - Email parameters
 * @returns Success status and message ID or error
 */
export async function sendVerificationEmail(
  params: SendVerificationEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, username, issueId, category, location, verificationCount, verifierNames } = params;

  // Skip if Resend API key not configured
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured. Skipping email send.');
    return { success: false, error: 'Email service not configured' };
  }

  const issueUrl = `${BASE_URL}/issues/${issueId}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Your report has been verified by the community! 🎉',
      react: VerificationNotificationEmail({
        username,
        category,
        location,
        verificationCount,
        issueUrl,
        verifierNames,
      }),
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('[Email] Verification email sent:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[Email] Failed to send verification email:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Send email with retry logic
 *
 * @param sendFn - Email send function
 * @param maxRetries - Maximum retry attempts (default: 3)
 * @returns Result from successful send or final error
 */
export async function sendWithRetry<T>(
  sendFn: () => Promise<{ success: boolean; error?: string } & T>,
  maxRetries = 3
): Promise<{ success: boolean; error?: string } & T> {
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await sendFn();

    if (result.success) {
      return result;
    }

    lastError = result.error;
    console.warn(`[Email] Attempt ${attempt}/${maxRetries} failed:`, lastError);

    // Wait before retry (exponential backoff)
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return { success: false, error: lastError } as { success: boolean; error?: string } & T;
}
