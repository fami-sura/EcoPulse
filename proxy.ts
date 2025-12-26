/**
 * Next.js Proxy for Supabase Auth + i18n
 *
 * This proxy:
 * 1. Handles i18n routing with next-intl
 * 2. Refreshes the user's session on every request (prevents stale sessions)
 * 3. Handles auth state synchronization between server and client
 *
 * For Next.js 16+ with Supabase SSR and next-intl.
 */

import { createServerClient } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // First, handle i18n routing
  const intlResponse = intlMiddleware(request);

  // Skip Supabase client initialization if environment variables are not set
  // This is needed for e2e tests and CI environments where these might not be available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // In development or testing without Supabase configured, just return the intl response
    return intlResponse;
  }

  // Create Supabase client with the response from intl middleware
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        // Copy cookies to the intl response
        cookiesToSet.forEach(({ name, value, options }) =>
          intlResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do not write any logic between createServerClient and
  // supabase.auth.getUser(). This is required to refresh the session.

  // Refresh session if expired
  await supabase.auth.getUser();

  // Optional: Protect routes that require authentication
  // Uncomment the following to redirect unauthenticated users from protected routes

  // const { data: { user } } = await supabase.auth.getUser();
  // const isProtectedRoute = request.nextUrl.pathname.includes('/dashboard') ||
  //                          request.nextUrl.pathname.includes('/profile');
  //
  // if (isProtectedRoute && !user) {
  //   const locale = request.nextUrl.pathname.split('/')[1] || routing.defaultLocale;
  //   const url = request.nextUrl.clone();
  //   url.pathname = `/${locale}/login`;
  //   return NextResponse.redirect(url);
  // }

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - auth/callback (Supabase auth callback - must be excluded from i18n)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (static assets)
     */
    '/((?!api|auth/callback|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)$).*)',
  ],
};
