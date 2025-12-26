import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  UserGroupIcon,
  SecurityCheckIcon,
  SmartPhone01Icon,
  ChartLineData02Icon,
  HeartCheckIcon,
  ArrowRight02Icon,
  Target01Icon,
  Leaf01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketing.mission' });

  const canonical = process.env.NEXT_PUBLIC_APP_URL
    ? new URL(`/${locale}/mission`, process.env.NEXT_PUBLIC_APP_URL).toString()
    : undefined;

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: canonical,
    },
  };
}

function MissionContent() {
  const t = useTranslations('marketing.mission');

  const principles = [
    {
      icon: UserGroupIcon,
      key: 'communityLed',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      icon: SecurityCheckIcon,
      key: 'privacy',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    },
    {
      icon: SmartPhone01Icon,
      key: 'accessibility',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    },
    {
      icon: ChartLineData02Icon,
      key: 'transparency',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    },
    {
      icon: HeartCheckIcon,
      key: 'safety',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
    },
  ] as const;

  const beliefs = ['belief1', 'belief2', 'belief3', 'belief4'] as const;

  const impactMetrics = [
    { key: 'reports', icon: Target01Icon },
    { key: 'verification', icon: CheckmarkCircle02Icon },
    { key: 'response', icon: ChartLineData02Icon },
  ] as const;

  return (
    <div className="flex flex-col">
      {/* Vision Hero */}
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

            {/* Vision Statement - Large & Bold */}
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
              {t('hero.vision')}
            </h1>

            {/* Mission Statement */}
            <p className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t('hero.mission')}
            </p>
          </div>
        </div>
      </section>

      {/* Core Beliefs - Manifesto Style */}
      <section className="bg-muted/30 py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              {t('beliefs.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('beliefs.title')}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {beliefs.map((key, index) => (
              <div
                key={key}
                className="bg-background rounded-2xl p-6 sm:p-8 border border-border relative overflow-hidden"
              >
                <div className="absolute top-4 left-4 text-6xl font-serif font-bold text-muted/20">
                  {index + 1}
                </div>
                <div className="relative z-10 pl-12 sm:pl-16">
                  <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed italic">
                    &ldquo;{t(`beliefs.${key}`)}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              {t('principles.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('principles.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('principles.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {principles.map((item) => (
              <div
                key={item.key}
                className="bg-muted/30 rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.color} mb-4`}
                >
                  <HugeiconsIcon icon={item.icon} size={24} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t(`principles.${item.key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`principles.${item.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Measure Impact */}
      <section className="bg-muted/30 py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
                {t('impact.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('impact.title')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t('impact.description')}
              </p>

              <div className="mt-8 space-y-4">
                {impactMetrics.map((item) => (
                  <div key={item.key} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <HugeiconsIcon icon={item.icon} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {t(`impact.metrics.${item.key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(`impact.metrics.${item.key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Side */}
            <div className="bg-background rounded-2xl p-8 border border-border">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 text-center">
                {t('impact.notLabel')}
              </p>
              <div className="space-y-4">
                {['vanity', 'extraction', 'dependency'].map((key) => (
                  <div key={key} className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                    <span className="text-destructive text-lg">✗</span>
                    <span className="text-muted-foreground line-through">
                      {t(`impact.not.${key}`)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground italic">{t('impact.philosophy')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Mission CTA */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
              {t('cta.title')}
            </h2>
            <p className="mt-4 text-base text-primary-foreground/80">{t('cta.description')}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="min-h-12">
                <Link href="/pilot">
                  {t('cta.pilotButton')}
                  <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="min-h-12 px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/about">{t('cta.aboutButton')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function MissionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MissionContent />;
}
