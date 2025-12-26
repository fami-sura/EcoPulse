'use client';

/**
 * Breadcrumb Component
 *
 * Navigation component showing current page location in site hierarchy.
 * Helps users understand where they are and navigate back.
 *
 * @accessibility
 * - Uses proper nav element with aria-label
 * - Current page marked with aria-current
 */

import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight01Icon, Home01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const t = useTranslations('marketing.nav');

  return (
    <nav aria-label={t('a11y.breadcrumb')} className={cn('py-4', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded px-1.5 py-1 hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <HugeiconsIcon icon={Home01Icon} size={14} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{t('home')}</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={item.label}>
              <li aria-hidden="true">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  className="text-muted-foreground/50"
                />
              </li>
              <li>
                {isLast ? (
                  <span className="font-medium text-foreground px-1.5 py-1" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || '/'}
                    className="rounded px-1.5 py-1 hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
