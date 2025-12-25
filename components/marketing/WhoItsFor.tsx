'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  UserGroupIcon,
  Building06Icon,
  City01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';

const audiences = [
  {
    icon: UserGroupIcon,
    key: 'communities',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    href: '/map',
  },
  {
    icon: Building06Icon,
    key: 'ngos',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    href: '/contact',
  },
  {
    icon: City01Icon,
    key: 'civic',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    href: '/pilot',
  },
] as const;

export function WhoItsFor() {
  const t = useTranslations('marketing.landing.whoItsFor');
  const [activeTab, setActiveTab] = useState<(typeof audiences)[number]['key']>('communities');

  const activeAudience = audiences.find((a) => a.key === activeTab)!;

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
            {t('eyebrow')}
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Tabs (Left Side on Desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {audiences.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 border-2',
                  activeTab === item.key
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-transparent hover:bg-muted'
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors',
                    activeTab === item.key ? item.color : 'bg-muted'
                  )}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={24}
                    className={cn(
                      'transition-colors',
                      activeTab === item.key ? '' : 'text-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className={cn(
                      'font-semibold text-lg',
                      activeTab === item.key ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {t(`${item.key}.title`)}
                  </h3>
                </div>
                {activeTab === item.key && (
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={20}
                    className="text-primary"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Area (Right Side on Desktop) */}
          <div className="lg:col-span-8">
            <div className="bg-muted/30 rounded-2xl p-6 sm:p-10 border border-border h-full min-h-80 flex flex-col relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-muted to-transparent rounded-bl-full opacity-50"></div>

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Icon + Title */}
                <div
                  className={cn(
                    'inline-flex items-center justify-center p-3 rounded-xl mb-6 w-fit',
                    activeAudience.color
                  )}
                >
                  <HugeiconsIcon icon={activeAudience.icon} size={28} />
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {t(`${activeTab}.title`)}
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {t(`${activeTab}.description`)}
                </p>

                {/* Benefits */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t('benefitsLabel')}
                  </p>
                  <ul className="space-y-2">
                    {[1, 2, 3].map((num) => (
                      <li key={num} className="flex items-center gap-3 text-foreground/80">
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={20}
                          className="text-primary shrink-0"
                        />
                        <span>{t(`${activeTab}.features.${num}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome - Key differentiator */}
                <div className="mt-auto pt-6 border-t border-border">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    {t('outcomeLabel')}
                  </p>
                  <p className="text-lg font-medium text-foreground italic">
                    &ldquo;{t(`${activeTab}.outcome`)}&rdquo;
                  </p>
                </div>

                {/* CTA per audience */}
                <div className="mt-6">
                  <Link
                    href={activeAudience.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 hover:underline"
                  >
                    {t(`${activeTab}.cta`)}
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
