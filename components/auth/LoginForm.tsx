'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/routing';
import { claimAnonymousReports } from '@/app/actions/claimAnonymousReports';
import {
  Mail02Icon,
  LockPasswordIcon,
  ViewIcon,
  ViewOffIcon,
  Loading01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { OAuthButtons } from './OAuthButtons';

/**
 * LoginForm Component
 *
 * Allows users to log in with email and password.
 * Integrates with Supabase Auth and handles anonymous report claiming.
 * All UI text uses next-intl for internationalization.
 */

// Validation schema
const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t('errors.invalidEmail')),
    password: z.string().min(1, t('errors.invalidCredentials')),
  });

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

interface LoginFormProps {
  /** URL to redirect to after successful login */
  redirectTo?: string;
}

export function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const { setUser, setProfile, sessionId, setSessionId } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [claimResult, setClaimResult] = useState<{
    count: number;
    points: number;
  } | null>(null);

  const loginSchema = createLoginSchema((key) => t(key));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: standardSchemaResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setClaimResult(null);
    const supabase = createClient();

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        // Handle specific Supabase errors
        if (
          authError.message.includes('Invalid login') ||
          authError.message.includes('invalid_credentials')
        ) {
          setServerError(t('errors.invalidCredentials'));
        } else if (authError.message.includes('Email not confirmed')) {
          setServerError(t('errors.emailNotVerified'));
        } else {
          setServerError(authError.message || t('errors.serverError'));
        }
        return;
      }

      if (authData.user && authData.session) {
        // Update auth store
        setUser(authData.user);

        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profile) {
          setProfile({
            id: profile.id,
            email: profile.email,
            username: profile.username,
            avatar_url: profile.avatar_url,
            role: profile.role,
            points: profile.points,
          });
        }

        // Claim anonymous reports if session ID exists
        let claimedReports: { count: number; points: number } | null = null;
        if (sessionId) {
          try {
            const result = await claimAnonymousReports(sessionId);
            if (result.success && result.claimedCount > 0) {
              claimedReports = {
                count: result.claimedCount,
                points: result.pointsAwarded || 0,
              };
              setClaimResult(claimedReports);
              // Clear session ID after successful claim
              setSessionId('');

              // Update profile points if we claimed reports
              if (profile && result.pointsAwarded) {
                setProfile({
                  ...profile,
                  points: (profile.points || 0) + result.pointsAwarded,
                });
              }
            }
          } catch (claimError) {
            console.error('Error claiming anonymous reports:', claimError);
            // Don't block login if claim fails
          }
        }

        // Show claim result briefly, then redirect
        const performRedirect = () => {
          setIsRedirecting(true);
          // Use router.push + refresh to ensure middleware runs and auth state is synced
          router.push(redirectTo);
          router.refresh();
        };

        if (claimedReports) {
          // Show success message for 2 seconds, then redirect
          setTimeout(performRedirect, 2000);
        } else {
          // Redirect immediately
          performRedirect();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError(t('errors.networkError'));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
      aria-describedby={serverError ? 'server-error' : undefined}
    >
      {/* Claim Result Success Message */}
      {claimResult && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md"
        >
          {t('conversion.success', {
            count: claimResult.count,
            points: claimResult.points,
          })}
        </div>
      )}

      {/* Server Error Alert */}
      {serverError && (
        <div
          id="server-error"
          role="alert"
          className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
        >
          {serverError}
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">{t('login.email')}</Label>
        <div className="relative">
          <HugeiconsIcon
            icon={Mail02Icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t('login.emailPlaceholder')}
            className="pl-10"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t('login.password')}</Label>
          <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
            {t('login.forgotPassword')}
          </Link>
        </div>
        <div className="relative">
          <HugeiconsIcon
            icon={LockPasswordIcon}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder={t('login.passwordPlaceholder')}
            className="pl-10 pr-10"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <HugeiconsIcon icon={ViewOffIcon} className="w-4 h-4" aria-hidden="true" />
            ) : (
              <HugeiconsIcon icon={ViewIcon} className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || isRedirecting}
        aria-busy={isSubmitting || isRedirecting}
      >
        {isSubmitting || isRedirecting ? (
          <>
            <HugeiconsIcon
              icon={Loading01Icon}
              className="w-4 h-4 animate-spin"
              aria-hidden="true"
            />
            <span>{isRedirecting ? t('login.redirecting') : t('login.submitting')}</span>
          </>
        ) : (
          t('login.submit')
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('login.orContinueWith')}
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <OAuthButtons redirectTo={redirectTo} />

      {/* Magic Link Option */}
      <Link href="/auth/magic-link" className="block">
        <Button type="button" variant="outline" className="w-full">
          {t('login.magicLink')}
        </Button>
      </Link>

      {/* Signup Link */}
      <p className="text-sm text-center text-muted-foreground">
        {t('login.noAccount')}{' '}
        <Link href="/auth/signup" className="text-primary hover:underline font-medium">
          {t('login.signupLink')}
        </Link>
      </p>
    </form>
  );
}
