'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  Globe02Icon,
  SecurityLockIcon,
  Download01Icon,
  SmartPhone01Icon,
  Analytics01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { HeroMapPreview } from './HeroMapPreview';

const trustIndicators = [
  { icon: CheckmarkCircle02Icon, key: 'verification' },
  { icon: SecurityLockIcon, key: 'privacy' },
  { icon: Analytics01Icon, key: 'exports' },
  { icon: SmartPhone01Icon, key: 'mobile' },
  { icon: Globe02Icon, key: 'openData' },
] as const;

export function Hero() {
  const t = useTranslations('marketing.landing.hero');

  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-16 lg:pt-20 lg:pb-24">
      {/* Decorative Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 lg:items-center">
          {/* Left Column: Content */}
          <div className="max-w-2xl">
            {/* Status Badge */}
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-6">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t('badge')}
            </div>

            {/* Emotional Hook */}
            <p className="text-base text-muted-foreground italic mb-4">
              &ldquo;{t('emotionalHook')}&rdquo;
            </p>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              {t('title')}
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              {t('subtitle')}
            </p>

            {/* CTA Group - 3 Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-12 px-8 text-base font-semibold shadow-md"
              >
                <Link href="/map">
                  {t('primaryCta')}
                  <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground min-h-12 px-8 text-base font-semibold"
              >
                <Link href="/contact">{t('secondaryCta')}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-foreground min-h-12 px-6 text-base font-medium"
              >
                <Link href="/pilot">
                  <HugeiconsIcon icon={Download01Icon} size={18} className="mr-2" />
                  {t('tertiaryCta')}
                </Link>
              </Button>
            </div>

            {/* Trust Indicators - Horizontal Chips */}
            <div className="mt-12 border-t border-border pt-8">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {t('trustTitle')}
              </p>
              <div className="flex flex-wrap gap-3">
                {trustIndicators.map((item) => (
                  <div
                    key={item.key}
                    className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5 text-sm text-foreground"
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      size={14}
                      className="text-primary"
                      aria-hidden="true"
                    />
                    <span>{t(`trust.${item.key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="relative lg:ml-auto lg:pl-8">
            <div className="relative">
              {/* Live Map Preview */}
              <HeroMapPreview />

              {/* Floating Verification Card */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 sm:-bottom-6 bg-background/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border animate-scale-in max-w-xs z-30">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">Verified by Community</p>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        2/2
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Drainage Blockage • Lagos, Nigeria
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="h-7 w-7 rounded-full ring-2 ring-background bg-secondary flex items-center justify-center text-[10px] font-bold text-secondary-foreground">
                      AB
                    </div>
                    <div className="h-7 w-7 rounded-full ring-2 ring-background bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground">
                      CD
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 -z-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 -z-10 h-40 w-40 rounded-full bg-accent/10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
