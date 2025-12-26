'use client';

/**
 * Error Boundary for Marketing Pages
 *
 * Provides a user-friendly error state for marketing section.
 * Allows recovery through page reset.
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, RefreshIcon, Home01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@/i18n/routing';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MarketingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry)
    console.error('Marketing page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <HugeiconsIcon icon={AlertCircleIcon} size={32} className="text-destructive" />
        </div>

        {/* Error Message */}
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-muted-foreground">
          We apologize for the inconvenience. The page you&apos;re trying to view encountered an
          unexpected error.
        </p>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-4 rounded-lg bg-muted/50 p-4 text-left">
            <p className="text-xs font-mono text-muted-foreground break-all">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="min-h-12 gap-2"
            aria-label="Try again to reload the page"
          >
            <HugeiconsIcon icon={RefreshIcon} size={18} />
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-12 gap-2">
            <Link href="/">
              <HugeiconsIcon icon={Home01Icon} size={18} />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Support Contact */}
        <p className="mt-8 text-sm text-muted-foreground">
          If this problem persists, please{' '}
          <Link href="/contact" className="text-primary underline hover:no-underline">
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
