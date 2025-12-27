'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LockPasswordIcon,
  ViewIcon,
  ViewOffIcon,
  Loading01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

/**
 * UpdatePasswordForm Component
 *
 * Allows users to set a new password after clicking a reset link.
 * All UI text uses next-intl for internationalization.
 */

// Validation schema
const createUpdatePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z.string().min(8, t('errors.weakPassword')),
      confirmPassword: z.string().min(1, t('errors.passwordMismatch')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('errors.passwordMismatch'),
      path: ['confirmPassword'],
    });

type UpdatePasswordFormData = z.infer<ReturnType<typeof createUpdatePasswordSchema>>;

export function UpdatePasswordForm() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updatePasswordSchema = createUpdatePasswordSchema((key) => t(key));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormData>({
    resolver: standardSchemaResolver(updatePasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setServerError(null);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setServerError(error.message || t('errors.serverError'));
        return;
      }

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      console.error('Update password error:', error);
      setServerError(t('errors.networkError'));
    }
  };

  // Show success message
  if (success) {
    return (
      <div className="text-center space-y-4" role="status" aria-live="polite">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="w-6 h-6 text-primary"
            aria-hidden="true"
          />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{t('resetPassword.success')}</h2>
        <p className="text-muted-foreground">{t('resetPassword.successMessage')}</p>
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
          className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl"
        >
          {serverError}
        </div>
      )}

      {/* New Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">{t('resetPassword.newPassword')}</Label>
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
          <p id="password-error" className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('resetPassword.confirmPassword')}</Label>
        <div className="relative">
          <HugeiconsIcon
            icon={LockPasswordIcon}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t('resetPassword.confirmPassword')}
            className="pl-10 pr-10"
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <HugeiconsIcon icon={ViewOffIcon} className="w-4 h-4" aria-hidden="true" />
            ) : (
              <HugeiconsIcon icon={ViewIcon} className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="text-sm text-destructive" role="alert">
            {errors.confirmPassword.message}
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
          t('resetPassword.submitNewPassword')
        )}
      </Button>
    </form>
  );
}
