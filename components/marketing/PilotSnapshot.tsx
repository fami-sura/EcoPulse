import { useTranslations } from 'next-intl';
import {
  Target01Icon,
  Clock01Icon,
  ChartLineData02Icon,
  CheckmarkSquare02Icon,
  Calendar01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const metrics = [
  { icon: CheckmarkSquare02Icon, key: 'verifiedReports', target: '20+' },
  { icon: Clock01Icon, key: 'timeToVerified', target: '<24h' },
  { icon: Target01Icon, key: 'timeToResponse', target: '<48h' },
  { icon: ChartLineData02Icon, key: 'resolutionRate', target: 'TBD' },
] as const;

const timeline = [
  { key: 'phase1', days: '0-30' },
  { key: 'phase2', days: '31-60' },
  { key: 'phase3', days: '61-90' },
] as const;

export function PilotSnapshot() {
  const t = useTranslations('marketing.landing.pilotFramework');

  return (
    <section className="bg-secondary py-16 sm:py-24 text-secondary-foreground overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[20px_20px]"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full bg-amber-500/20 px-4 py-1.5 text-sm font-medium text-amber-200 ring-1 ring-inset ring-amber-500/30 mb-4">
            <HugeiconsIcon icon={Target01Icon} size={16} className="mr-2" aria-hidden="true" />
            {t('badge')}
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HugeiconsIcon
              icon={Calendar01Icon}
              size={20}
              className="text-secondary-foreground/70"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground/70">
              {t('timelineLabel')}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {timeline.map((phase, index) => (
              <div
                key={phase.key}
                className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 ring-1 ring-white/10"
              >
                {/* Phase indicator */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-secondary-foreground/70">
                    Days {phase.days}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-secondary-foreground mb-2">
                  {t(`timeline.${phase.key}.title`)}
                </h3>

                <ul className="space-y-2">
                  {[1, 2, 3].map((num) => (
                    <li
                      key={num}
                      className="flex items-start gap-2 text-sm text-secondary-foreground/80"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                      {t(`timeline.${phase.key}.item${num}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-secondary-foreground/70 mb-6">
            {t('metricsLabel')}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {metrics.map((item) => (
              <div
                key={item.key}
                className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    <HugeiconsIcon
                      icon={item.icon}
                      size={16}
                      className="text-primary-foreground"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <p className="text-2xl font-bold text-secondary-foreground mb-1">{item.target}</p>

                <p className="text-xs text-secondary-foreground/70">{t(`metrics.${item.key}`)}</p>

                <span className="inline-block mt-2 text-[10px] font-medium uppercase tracking-wider text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded">
                  {t('targetLabel')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
