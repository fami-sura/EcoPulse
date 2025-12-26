'use client';

/**
 * NewsletterSignup Component
 *
 * Simple email capture for newsletter/pilot updates.
 * Minimal form: just email + submit button.
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function NewsletterSignup({ className, variant = 'default' }: NewsletterSignupProps) {
  const t = useTranslations('marketing.newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Simulate API call - replace with actual newsletter signup
    // For now, just log and show success
    try {
      // TODO: Integrate with Resend or newsletter service
      console.log('Newsletter signup:', email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4 text-emerald-700 dark:text-emerald-300',
          className
        )}
      >
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
        <span className="text-sm font-medium">{t('success')}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={Mail01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            className="pl-9 min-h-10"
            required
          />
        </div>
        <Button type="submit" size="sm" disabled={status === 'loading'} className="min-h-10 px-4">
          {status === 'loading' ? t('submitting') : t('subscribe')}
        </Button>
      </form>
    );
  }

  return (
    <div className={cn('bg-muted/30 rounded-2xl p-6 border border-border', className)}>
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HugeiconsIcon icon={Mail01Icon} size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{t('title')}</h3>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          className="min-h-11 flex-1"
          required
        />
        <Button type="submit" disabled={status === 'loading'} className="min-h-11 px-5">
          {status === 'loading' ? t('submitting') : t('subscribe')}
        </Button>
      </form>

      {status === 'error' && <p className="mt-2 text-sm text-destructive">{t('error')}</p>}

      <p className="mt-3 text-xs text-muted-foreground">{t('privacy')}</p>
    </div>
  );
}
