import { useTranslations } from 'next-intl';
import {
  WasteIcon,
  WaterEnergyIcon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';

const useCases = [
  {
    key: 'waste',
    icon: WasteIcon,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-200 dark:border-orange-800',
    iconBg: 'bg-orange-100 dark:bg-orange-900',
  },
  {
    key: 'drainage',
    icon: WaterEnergyIcon,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
  },
] as const;

const workflowSteps = ['report', 'verify', 'respond'] as const;

export function PilotUseCases() {
  const t = useTranslations('marketing.landing.useCases');

  return (
    <section className="bg-muted/30 py-16 sm:py-24 border-y border-border">
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

        {/* Use Case Cards */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {useCases.map((item) => (
            <div
              key={item.key}
              className={cn(
                'relative overflow-hidden rounded-2xl border-2 p-6 sm:p-8 transition-all hover:shadow-lg',
                item.bg,
                item.border
              )}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
                    item.iconBg
                  )}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={28}
                    className={item.color}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{t(`${item.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(`${item.key}.description`)}
                  </p>
                </div>
              </div>

              {/* Examples */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t('examplesLabel')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((num) => (
                    <span
                      key={num}
                      className="inline-flex items-center rounded-full bg-background/80 px-3 py-1 text-sm text-foreground border border-border"
                    >
                      {t(`${item.key}.examples.${num}`)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Workflow */}
              <div className="pt-6 border-t border-border/50">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {t('workflowLabel')}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {workflowSteps.map((step, idx) => (
                    <div key={step} className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm text-foreground font-medium">
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={16}
                          className="text-primary"
                        />
                        {t(`workflow.${step}`)}
                      </span>
                      {idx < workflowSteps.length - 1 && (
                        <HugeiconsIcon
                          icon={ArrowRight02Icon}
                          size={16}
                          className="text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 2 Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{t('phase2Label')}</span> {t('phase2Categories')}
          </p>
        </div>
      </div>
    </section>
  );
}

// Keep backward compatibility export
export { PilotUseCases as ImpactGallery };
