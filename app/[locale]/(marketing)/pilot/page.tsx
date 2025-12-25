import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  ArrowRight02Icon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  ChartLineData02Icon,
  Target01Icon,
  UserGroupIcon,
  AlertCircleIcon,
  Leaf01Icon,
  Clock02Icon,
  Location01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketing.pilot' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
    },
  };
}

function PilotContent() {
  const t = useTranslations('marketing.pilot');

  const phases = [
    {
      key: 'phase1',
      icon: UserGroupIcon,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    },
    {
      key: 'phase2',
      icon: ChartLineData02Icon,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    },
    {
      key: 'phase3',
      icon: Target01Icon,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
  ] as const;

  const metrics = [
    { key: 'reports', icon: CheckmarkCircle02Icon },
    { key: 'verification', icon: Clock02Icon },
    { key: 'response', icon: ChartLineData02Icon },
    { key: 'resolution', icon: Target01Icon },
  ] as const;

  const risks = [
    { key: 'falseReports', riskColor: 'text-destructive', mitigationColor: 'text-primary' },
    { key: 'privacy', riskColor: 'text-destructive', mitigationColor: 'text-primary' },
    { key: 'adoption', riskColor: 'text-destructive', mitigationColor: 'text-primary' },
  ] as const;

  const partnerTypes = ['ngos', 'responders', 'funders'] as const;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-32">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-8">
              <HugeiconsIcon icon={Leaf01Icon} size={16} className="mr-2" />
              {t('hero.badge')}
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
              {t('hero.title')}
            </h1>

            <p className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t('hero.intro')}
            </p>

            {/* Quick Stats */}
            <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <HugeiconsIcon icon={Calendar01Icon} size={18} />
                  <span className="text-2xl font-bold">{t('hero.stats.duration')}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('hero.stats.durationLabel')}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <HugeiconsIcon icon={Location01Icon} size={18} />
                  <span className="text-2xl font-bold">{t('hero.stats.locations')}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('hero.stats.locationsLabel')}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <HugeiconsIcon icon={Target01Icon} size={18} />
                  <span className="text-2xl font-bold">{t('hero.stats.categories')}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('hero.stats.categoriesLabel')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Scope */}
      <section className="bg-muted/30 py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
                {t('scope.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('scope.title')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t('scope.description')}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon icon={Location01Icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t('scope.geography.title')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('scope.geography.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t('scope.verification.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('scope.verification.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon icon={Target01Icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t('scope.success.title')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('scope.success.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="bg-background rounded-2xl p-8 border border-border">
              <h3 className="font-semibold text-foreground mb-6">{t('scope.focus.title')}</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span className="font-medium text-foreground">
                      {t('scope.focus.waste.title')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('scope.focus.waste.description')}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium text-foreground">
                      {t('scope.focus.drainage.title')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('scope.focus.drainage.description')}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground italic text-center">
                {t('scope.focus.note')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              {t('timeline.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('timeline.title')}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-border hidden sm:block"></div>

              <div className="space-y-6">
                {phases.map((phase) => (
                  <div key={phase.key} className="relative flex gap-6">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${phase.color} relative z-10`}
                    >
                      <HugeiconsIcon icon={phase.icon} size={28} />
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-6 border border-border flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-primary">
                          {t(`timeline.${phase.key}.days`)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {t(`timeline.${phase.key}.title`)}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {t(`timeline.${phase.key}.description`)}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {['activity1', 'activity2', 'activity3'].map((activity) => (
                          <li
                            key={activity}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <HugeiconsIcon
                              icon={CheckmarkCircle02Icon}
                              size={16}
                              className="text-primary shrink-0"
                            />
                            {t(`timeline.${phase.key}.${activity}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics & Evaluation */}
      <section className="bg-muted/30 py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              {t('metrics.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('metrics.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('metrics.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {metrics.map((metric) => (
              <div
                key={metric.key}
                className="bg-background rounded-2xl p-6 border border-border text-center"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <HugeiconsIcon icon={metric.icon} size={24} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {t(`metrics.${metric.key}.title`)}
                </h3>
                <p className="text-2xl font-bold text-primary mb-2">
                  {t(`metrics.${metric.key}.target`)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(`metrics.${metric.key}.description`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground italic">{t('metrics.disclaimer')}</p>
          </div>
        </div>
      </section>

      {/* Risks & Mitigations */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              {t('risks.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('risks.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('risks.subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {risks.map((risk) => (
              <div key={risk.key} className="bg-muted/30 rounded-2xl p-6 border border-border">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <HugeiconsIcon
                        icon={AlertCircleIcon}
                        size={18}
                        className="text-destructive"
                      />
                      <span className="text-sm font-semibold uppercase tracking-wider text-destructive">
                        {t('risks.riskLabel')}
                      </span>
                    </div>
                    <p className="text-foreground">{t(`risks.${risk.key}.risk`)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={18}
                        className="text-primary"
                      />
                      <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                        {t('risks.mitigationLabel')}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{t(`risks.${risk.key}.mitigation`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="bg-muted/30 py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              {t('partners.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('partners.title')}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
            {partnerTypes.map((type) => (
              <div key={type} className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  {t(`partners.${type}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t(`partners.${type}.description`)}
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {t('partners.whatYouGetLabel')}
                  </p>
                  <ul className="space-y-1">
                    {['benefit1', 'benefit2', 'benefit3'].map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={14}
                          className="text-primary shrink-0"
                        />
                        {t(`partners.${type}.${benefit}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
              {t('cta.title')}
            </h2>
            <p className="mt-4 text-base text-primary-foreground/80">{t('cta.description')}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="min-h-12">
                <Link href="/contact">
                  {t('cta.contactButton')}
                  <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="min-h-12 px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/faq">{t('cta.faqButton')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function PilotPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PilotContent />;
}
