import { useTranslations } from 'next-intl';
import { Building06Icon, HeartCheckIcon, UniversityIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const partnerTypes = [
  {
    key: 'ngos',
    icon: Building06Icon,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  },
  {
    key: 'sponsors',
    icon: HeartCheckIcon,
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
  },
  {
    key: 'researchers',
    icon: UniversityIcon,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  },
] as const;

export function PartnershipsInProgress() {
  const t = useTranslations('marketing.landing.partnerships');

  return (
    <section className="bg-muted/30 py-16 sm:py-20 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
            {t('eyebrow')}
          </p>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{t('description')}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          {partnerTypes.map((type) => (
            <div
              key={type.key}
              className="bg-background rounded-2xl p-6 border border-border text-center hover:shadow-md transition-shadow"
            >
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${type.color} mb-4`}
              >
                <HugeiconsIcon icon={type.icon} size={28} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t(`${type.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`${type.key}.status`)}
              </p>
            </div>
          ))}
        </div>

        {/* Transparency note */}
        <p className="mt-10 text-center text-sm text-muted-foreground italic max-w-2xl mx-auto">
          {t('note')}
        </p>
      </div>
    </section>
  );
}
