'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/routing';
import { Mail02Icon, CheckmarkCircle02Icon, Loading01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

/**
 * ResetPasswordForm Component
 *
 * Allows users to request a password reset email.
 * All UI text uses next-intl for internationalization.
 */

// Validation schema
const createResetSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t('errors.invalidEmail')),
  });

type ResetFormData = z.infer<ReturnType<typeof createResetSchema>>;

export function ResetPasswordForm() {
  const t = useTranslations('auth');

  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const resetSchema = createResetSchema((key) => t(key));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: standardSchemaResolver(resetSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResetFormData) => {
    setServerError(null);
    const supabase = createClient();

    try {
      // Use auth/callback route which handles the code exchange
      // The callback will then redirect to update-password page
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/auth/update-password`,
      });

      if (error) {
        setServerError(error.message || t('errors.serverError'));
        return;
      }

      setSubmittedEmail(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Reset password error:', error);
      setServerError(t('errors.networkError'));
    }
  };

  // Show success message after email sent
  if (emailSent) {
    return (
      <div className="text-center space-y-4" role="status" aria-live="polite">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="w-6 h-6 text-primary"
            aria-hidden="true"
          />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{t('resetPassword.sent')}</h2>
        <p className="text-muted-foreground">
          {t('verification.description', { email: submittedEmail })}
        </p>
        <p className="text-sm text-muted-foreground">{t('verification.checkSpam')}</p>
        <Link href="/auth/login">
          <Button variant="outline" className="mt-4">
            {t('magicLink.backToLogin')}
          </Button>
        </Link>
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
      {/* Description */}
      <p className="text-sm text-muted-foreground text-center">{t('resetPassword.description')}</p>

      {/* Server Error Alert */}
      {serverError && (
        <div
          id="server-error"
          role="alert"
          className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl"
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
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email.message}
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
            <span>{t('magicLink.submitting')}</span>
          </>
        ) : (
          t('resetPassword.submit')
        )}
      </Button>

      {/* Back to login link */}
      <p className="text-sm text-center text-muted-foreground">
        <Link href="/auth/login" className="text-primary hover:underline">
          {t('magicLink.backToLogin')}
        </Link>
      </p>
    </form>
  );
}
