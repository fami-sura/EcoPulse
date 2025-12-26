'use client';

/**
 * PilotCountdown Component
 *
 * Displays countdown to pilot launch date.
 * Creates urgency and anticipation for funders.
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight02Icon, Calendar01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface PilotCountdownProps {
  /** Target date for pilot launch (ISO string) */
  targetDate: string;
  className?: string;
}

export function PilotCountdown({ targetDate, className }: PilotCountdownProps) {
  const t = useTranslations('marketing.landing.countdown');
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - Date.now();

      if (difference <= 0) {
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Show "Pilot is Live" if expired
  if (isExpired) {
    return (
      <div
        className={cn(
          'bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center',
          className
        )}
      >
        <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300 mb-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider">{t('liveNow')}</span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-4">{t('liveTitle')}</h3>
        <Button asChild>
          <Link href="/map">
            {t('viewMap')}
            <HugeiconsIcon icon={ArrowRight02Icon} size={18} className="ml-2" />
          </Link>
        </Button>
      </div>
    );
  }

  // Loading state
  if (!timeLeft) {
    return (
      <div
        className={cn(
          'bg-primary/5 border-2 border-primary/20 rounded-2xl p-8 text-center animate-pulse',
          className
        )}
      >
        <div className="h-6 bg-muted rounded w-32 mx-auto mb-4"></div>
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-12 w-16 bg-muted rounded mb-1"></div>
              <div className="h-3 w-10 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: t('days') },
    { value: timeLeft.hours, label: t('hours') },
    { value: timeLeft.minutes, label: t('minutes') },
    { value: timeLeft.seconds, label: t('seconds') },
  ];

  return (
    <div
      className={cn(
        'bg-primary/5 border-2 border-primary/20 rounded-2xl p-8 text-center',
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 text-primary mb-4">
        <HugeiconsIcon icon={Calendar01Icon} size={18} />
        <p className="text-sm font-semibold uppercase tracking-wider">{t('title')}</p>
      </div>

      <div className="flex justify-center gap-3 sm:gap-6 mb-6">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="bg-background rounded-xl px-3 py-2 sm:px-5 sm:py-3 border border-border shadow-sm min-w-15 sm:min-w-20">
              <span className="text-2xl sm:text-4xl font-bold text-foreground tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
              {unit.label}
            </span>
            {index < timeUnits.length - 1 && (
              <span
                className="absolute text-xl font-bold text-muted-foreground hidden sm:block"
                style={{ right: '-0.5rem' }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>

      <Button asChild className="min-h-11">
        <Link href="/contact">
          {t('joinPilot')}
          <HugeiconsIcon icon={ArrowRight02Icon} size={18} className="ml-2" />
        </Link>
      </Button>
    </div>
  );
}
