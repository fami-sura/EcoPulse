import { useTranslations } from 'next-intl';
import { ArrowRight02Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const comparisons = [
  { key: 'government' },
  { key: 'design' },
  { key: 'workflow' },
  { key: 'trust' },
  { key: 'pricing' },
] as const;

export function WhyWereDifferent() {
  const t = useTranslations('marketing.landing.different');

  return (
    <section className="bg-background py-16 sm:py-24 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
            {t('eyebrow')}
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Comparison Table */}
        <div className="mx-auto max-w-4xl">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 mb-4 px-4">
            <div className="col-span-1"></div>
            <div className="text-center">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t('columns.western')}
              </span>
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                {t('columns.ecopulse')}
              </span>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            {comparisons.map((item) => (
              <div key={item.key} className="grid grid-cols-3 gap-4 p-4 sm:p-6 items-center">
                {/* Row Label */}
                <div className="col-span-1">
                  <span className="text-sm font-medium text-foreground">
                    {t(`rows.${item.key}.label`)}
                  </span>
                </div>

                {/* Western Approach */}
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    {t(`rows.${item.key}.western`)}
                  </span>
                </div>

                {/* EcoPulse Approach */}
                <div className="text-center flex items-center justify-center gap-2">
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={16}
                    className="text-primary shrink-0 hidden sm:block"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-primary">
                    {t(`rows.${item.key}.ecopulse`)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-full px-6 py-3">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={20}
                className="text-primary"
                aria-hidden="true"
              />
              <span className="text-base font-medium text-foreground">{t('tagline')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
