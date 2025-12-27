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
 * MagicLinkForm Component
 *
 * Allows users to request a passwordless magic link login.
 * All UI text uses next-intl for internationalization.
 */

// Validation schema
const createMagicLinkSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t('errors.invalidEmail')),
  });

type MagicLinkFormData = z.infer<ReturnType<typeof createMagicLinkSchema>>;

interface MagicLinkFormProps {
  /** URL to redirect to after successful magic link authentication */
  redirectTo?: string;
}

export function MagicLinkForm({ redirectTo = '/profile' }: MagicLinkFormProps) {
  const t = useTranslations('auth');

  const [serverError, setServerError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);

  const magicLinkSchema = createMagicLinkSchema((key) => t(key));

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<MagicLinkFormData>({
    resolver: standardSchemaResolver(magicLinkSchema),
    mode: 'onBlur',
  });

  const sendMagicLink = async (email: string) => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });

    return { error };
  };

  const onSubmit = async (data: MagicLinkFormData) => {
    setServerError(null);

    try {
      const { error } = await sendMagicLink(data.email);

      if (error) {
        if (error.message.includes('rate limit')) {
          setServerError(t('magicLink.rateLimited'));
        } else {
          setServerError(error.message || t('errors.serverError'));
        }
        return;
      }

      setSubmittedEmail(data.email);
      setLinkSent(true);
      setLastSentTime(Date.now());
    } catch (error) {
      console.error('Magic link error:', error);
      setServerError(t('errors.networkError'));
    }
  };

  const handleResend = async () => {
    // Rate limit: 60 seconds between resends
    if (lastSentTime && Date.now() - lastSentTime < 60000) {
      setServerError(t('magicLink.rateLimited'));
      return;
    }

    setIsResending(true);
    setServerError(null);

    try {
      const { error } = await sendMagicLink(submittedEmail || getValues('email'));

      if (error) {
        if (error.message.includes('rate limit')) {
          setServerError(t('magicLink.rateLimited'));
        } else {
          setServerError(error.message || t('errors.serverError'));
        }
      } else {
        setLastSentTime(Date.now());
      }
    } catch (error) {
      console.error('Resend magic link error:', error);
      setServerError(t('errors.networkError'));
    } finally {
      setIsResending(false);
    }
  };

  // Show success message after magic link sent
  if (linkSent) {
    return (
      <div className="text-center space-y-4" role="status" aria-live="polite">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="w-6 h-6 text-primary"
            aria-hidden="true"
          />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{t('magicLink.sent')}</h2>
        <p className="text-muted-foreground">
          {t('magicLink.sentDescription', { email: submittedEmail })}
        </p>

        {/* Error message (for resend failures) */}
        {serverError && (
          <div
            role="alert"
            className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl"
          >
            {serverError}
          </div>
        )}

        {/* Resend Button */}
        <Button variant="outline" onClick={handleResend} disabled={isResending} className="mt-4">
          {isResending ? (
            <>
              <HugeiconsIcon
                icon={Loading01Icon}
                className="w-4 h-4 animate-spin"
                aria-hidden="true"
              />
              <span>{t('magicLink.submitting')}</span>
            </>
          ) : (
            t('magicLink.resend')
          )}
        </Button>

        {/* Back to login link */}
        <div className="mt-4">
          <Link href="/auth/login" className="text-sm text-primary hover:underline">
            {t('magicLink.backToLogin')}
          </Link>
        </div>
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
      <p className="text-sm text-muted-foreground text-center">{t('magicLink.description')}</p>

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
        <Label htmlFor="email">{t('magicLink.email')}</Label>
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
            placeholder={t('magicLink.emailPlaceholder')}
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
          t('magicLink.submit')
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
