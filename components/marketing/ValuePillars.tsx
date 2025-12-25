import { useTranslations } from 'next-intl';
import {
  SecurityLockIcon,
  CheckmarkBadge01Icon,
  Analytics01Icon,
  Globe02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const pillars = [
  {
    icon: SecurityLockIcon,
    key: 'privacy',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  },
  {
    icon: CheckmarkBadge01Icon,
    key: 'verification',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  },
  {
    icon: Analytics01Icon,
    key: 'actionable',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  },
  {
    icon: Globe02Icon,
    key: 'africaNative',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
  },
] as const;

export function ValuePillars() {
  const t = useTranslations('marketing.landing.valuePillars');

  return (
    <section className="bg-muted/30 py-16 sm:py-20 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
            {t('eyebrow')}
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>
        </div>

        {/* Pillars Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.key}
              className="relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Icon */}
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${pillar.color} mb-4`}
              >
                <HugeiconsIcon icon={pillar.icon} size={24} aria-hidden="true" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-foreground mb-2">{t(`${pillar.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`${pillar.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
