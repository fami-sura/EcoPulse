import { useTranslations } from 'next-intl';
import { CheckmarkCircle02Icon, SecurityLockIcon, Globe02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const signals = [
  { icon: CheckmarkCircle02Icon, key: 'fiscal' },
  { icon: SecurityLockIcon, key: 'dataSovereignty' },
  { icon: Globe02Icon, key: 'transparency' },
] as const;

export function TeamGovernance() {
  const t = useTranslations('marketing.landing.governance');

  return (
    <section className="bg-background py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Section Header */}
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
            {t('title')}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('description')}
          </p>

          {/* Governance Signals */}
          <div className="flex flex-wrap justify-center gap-4">
            {signals.map((item) => (
              <div
                key={item.key}
                className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-sm"
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={16}
                  className="text-primary"
                  aria-hidden="true"
                />
                <span className="text-foreground">{t(`signals.${item.key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
