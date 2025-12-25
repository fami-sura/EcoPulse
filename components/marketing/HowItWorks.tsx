import { useTranslations } from 'next-intl';
import {
  Camera01Icon,
  CheckmarkCircle02Icon,
  UserGroupIcon,
  CheckmarkBadge01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const steps = [
  { icon: Camera01Icon, step: 'step1', number: '01' },
  { icon: CheckmarkCircle02Icon, step: 'step2', number: '02' },
  { icon: UserGroupIcon, step: 'step3', number: '03' },
  { icon: CheckmarkBadge01Icon, step: 'step4', number: '04' },
] as const;

export function HowItWorks() {
  const t = useTranslations('marketing.landing.howItWorks');

  return (
    <section className="bg-background py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
            {t('eyebrow')}
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Steps - 4 Column Grid */}
        <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-border via-primary/30 to-border hidden lg:block"></div>

          {steps.map((item) => (
            <div key={item.step} className="relative flex flex-col items-center text-center z-10">
              {/* Icon Circle */}
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-background border-2 border-border shadow-sm mb-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/5 text-primary">
                  <HugeiconsIcon
                    icon={item.icon}
                    size={36}
                    className="text-primary"
                    aria-hidden="true"
                  />
                </div>
                <span className="absolute -top-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold border-4 border-background shadow-md">
                  {item.number}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-2">{t(`${item.step}.title`)}</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 max-w-xs mx-auto">
                {t(`${item.step}.description`)}
              </p>

              {/* Why It Matters - Funder Education */}
              <div className="mt-auto pt-4 border-t border-dashed border-border w-full">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  {t('whyMattersLabel')}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {t(`${item.step}.whyMatters`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
