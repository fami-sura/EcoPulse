import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

/**
 * Auth Callback Route Handler
 *
 * Handles OAuth and magic link callbacks from Supabase Auth.
 * Exchanges the auth code for a session and redirects to the intended destination.
 *
 * Note: This route is at the root level (/app/auth/callback) to ensure
 * compatibility with Supabase's redirect URL requirements.
 * It is excluded from i18n middleware processing.
 */

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect') || '/';
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const errorCode = requestUrl.searchParams.get('error_code');

  // Default locale for redirects (since we're outside the [locale] route)
  const defaultLocale = routing.defaultLocale;

  // Handle error from Supabase (e.g., expired OTP, access denied)
  if (error) {
    console.error('Auth callback error:', { error, errorCode, errorDescription });

    // For OTP expired errors, show a user-friendly message
    const friendlyMessage =
      errorCode === 'otp_expired'
        ? 'Email link has expired. Please request a new one.'
        : errorDescription || error;

    // Redirect to locale-prefixed login page
    return NextResponse.redirect(
      new URL(
        `/${defaultLocale}/auth/login?error=${encodeURIComponent(friendlyMessage)}`,
        requestUrl.origin
      )
    );
  }

  // Exchange code for session
  if (code) {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      // Redirect to locale-prefixed login page with error
      return NextResponse.redirect(
        new URL(
          `/${defaultLocale}/auth/login?error=${encodeURIComponent(exchangeError.message)}`,
          requestUrl.origin
        )
      );
    }
  }

  // Redirect to the intended destination
  // Ensure redirect is a relative path to prevent open redirect vulnerabilities
  let safeRedirect = redirect.startsWith('/') ? redirect : '/';

  // If redirect doesn't start with a locale, prepend the default locale
  // This handles cases where redirectTo was set to '/' or '/dashboard' etc.
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(/|$)`);
  if (!localePattern.test(safeRedirect)) {
    safeRedirect = `/${defaultLocale}${safeRedirect}`;
  }

  return NextResponse.redirect(new URL(safeRedirect, requestUrl.origin));
}
