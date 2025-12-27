'use client';

/**
 * OAuthButtons Component
 *
 * Social login buttons for Google and Microsoft OAuth authentication.
 * Uses Supabase Auth with OAuth providers.
 *
 * @features
 * - Google OAuth sign-in
 * - Microsoft OAuth sign-in
 * - Professional SVG icons (no emojis)
 * - Loading states during authentication
 * - Error handling with user-friendly messages
 *
 * @accessibility
 * - Proper ARIA labels
 * - Keyboard accessible
 * - Focus states
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OAuthButtonsProps {
  /** Redirect URL after successful OAuth */
  redirectTo?: string;
  /** Custom class names */
  className?: string;
}

/**
 * Google Logo SVG Component
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/**
 * Microsoft Logo SVG Component
 */
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022" />
      <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00" />
      <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF" />
      <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900" />
    </svg>
  );
}

export function OAuthButtons({ redirectTo = '/profile', className }: OAuthButtonsProps) {
  const t = useTranslations('auth');
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'azure' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: 'google' | 'azure') => {
    setLoadingProvider(provider);
    setError(null);

    const supabase = createClient();

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (oauthError) {
        console.error(`${provider} OAuth error:`, oauthError);
        setError(t('errors.serverError'));
        setLoadingProvider(null);
      }

      // If successful, the user will be redirected to the provider's login page
    } catch (err) {
      console.error(`${provider} OAuth error:`, err);
      setError(t('errors.networkError'));
      setLoadingProvider(null);
    }
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl"
        >
          {error}
        </div>
      )}

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthSignIn('google')}
        disabled={loadingProvider !== null}
        aria-busy={loadingProvider === 'google'}
      >
        {loadingProvider === 'google' ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        <span className="ml-2">
          {loadingProvider === 'google' ? t('login.submitting') : t('oauth.google')}
        </span>
      </Button>

      {/* Microsoft Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthSignIn('azure')}
        disabled={loadingProvider !== null}
        aria-busy={loadingProvider === 'azure'}
      >
        {loadingProvider === 'azure' ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
        ) : (
          <MicrosoftIcon className="h-5 w-5" />
        )}
        <span className="ml-2">
          {loadingProvider === 'azure' ? t('login.submitting') : t('oauth.microsoft')}
        </span>
      </Button>
    </div>
  );
}
