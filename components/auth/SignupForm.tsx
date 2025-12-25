'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/routing';
import {
  Mail02Icon,
  LockPasswordIcon,
  UserIcon,
  ViewIcon,
  ViewOffIcon,
  Loading01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { OAuthButtons } from './OAuthButtons';

/**
 * SignupForm Component
 *
 * Allows users to create an account with email, password, and username.
 * Uses React Hook Form with Zod validation and Supabase Auth.
 * All UI text uses next-intl for internationalization.
 */

// Validation schemas
const createSignupSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t('errors.invalidEmail')),
    password: z.string().min(8, t('errors.weakPassword')),
    username: z
      .string()
      .min(3, t('errors.usernameTooShort'))
      .max(20, t('errors.usernameTooLong'))
      .regex(/^[a-zA-Z0-9_]+$/, t('errors.usernameInvalid')),
  });

type SignupFormData = z.infer<ReturnType<typeof createSignupSchema>>;

interface SignupFormProps {
  /** URL to redirect to after successful signup */
  redirectTo?: string;
}

export function SignupForm({ redirectTo = '/' }: SignupFormProps) {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const { setUser } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const signupSchema = createSignupSchema((key) => t(key));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: standardSchemaResolver(signupSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    const supabase = createClient();

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (authError) {
        // Handle specific Supabase errors
        if (authError.message.includes('already registered')) {
          setServerError(t('errors.emailExists'));
        } else if (authError.message.includes('weak password')) {
          setServerError(t('errors.weakPassword'));
        } else {
          setServerError(authError.message || t('errors.serverError'));
        }
        return;
      }

      if (authData.user) {
        // Check if email confirmation is required
        if (authData.user.identities?.length === 0) {
          // User already exists but tried to sign up again
          setServerError(t('errors.emailExists'));
          return;
        }

        // Show verification message
        setSubmittedEmail(data.email);
        setVerificationSent(true);

        // Update auth store with user (session may not be available until email is verified)
        if (authData.session) {
          setUser(authData.user);

          // Create user profile in database
          const { error: profileError } = await supabase.from('users').insert({
            id: authData.user.id,
            email: data.email,
            username: data.username,
            role: 'member',
            points: 0,
          });

          if (profileError && !profileError.message.includes('duplicate')) {
            console.error('Profile creation error:', profileError);
          }

          // If we have a session, redirect after a short delay
          // Full page navigation to ensure cookies are read
          setTimeout(() => {
            window.location.replace(redirectTo);
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setServerError(t('errors.networkError'));
    }
  };

  // Show verification sent message
  if (verificationSent) {
    return (
      <div className="text-center space-y-4" role="status" aria-live="polite">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <HugeiconsIcon icon={Mail02Icon} className="w-6 h-6 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{t('verification.title')}</h2>
        <p className="text-muted-foreground">
          {t('verification.description', { email: submittedEmail })}
        </p>
        <p className="text-sm text-muted-foreground">{t('verification.checkSpam')}</p>
        <Button variant="outline" onClick={() => setVerificationSent(false)} className="mt-4">
          {tCommon('back')}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
      aria-describedby={serverError ? 'server-error' : undefined}
    >
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
        <Label htmlFor="email">{t('signup.email')}</Label>
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
            placeholder={t('signup.emailPlaceholder')}
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

      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username">{t('signup.username')}</Label>
        <div className="relative">
          <HugeiconsIcon
            icon={UserIcon}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder={t('signup.usernamePlaceholder')}
            className="pl-10"
            aria-invalid={errors.username ? 'true' : 'false'}
            aria-describedby={errors.username ? 'username-error' : 'username-hint'}
            {...register('username')}
          />
        </div>
        <p id="username-hint" className="text-xs text-muted-foreground">
          {t('signup.usernameHint')}
        </p>
        {errors.username && (
          <p id="username-error" className="text-sm text-red-600" role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">{t('signup.password')}</Label>
        <div className="relative">
          <HugeiconsIcon
            icon={LockPasswordIcon}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t('signup.passwordPlaceholder')}
            className="pl-10 pr-10"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : 'password-hint'}
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
        <p id="password-hint" className="text-xs text-muted-foreground">
          {t('signup.passwordHint')}
        </p>
        {errors.password && (
          <p id="password-error" className="text-sm text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? (
          <>
            <HugeiconsIcon
              icon={Loading01Icon}
              className="w-4 h-4 animate-spin"
              aria-hidden="true"
            />
            <span>{t('signup.submitting')}</span>
          </>
        ) : (
          t('signup.submit')
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

      {/* Terms Agreement */}
      <p className="text-xs text-center text-muted-foreground">{t('signup.termsAgreement')}</p>

      {/* Login Link */}
      <p className="text-sm text-center text-muted-foreground">
        {t('signup.hasAccount')}{' '}
        <Link href="/auth/login" className="text-primary hover:underline font-medium">
          {t('signup.loginLink')}
        </Link>
      </p>
    </form>
  );
}
