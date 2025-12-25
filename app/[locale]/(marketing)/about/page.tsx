import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  CheckmarkCircle02Icon,
  UserGroupIcon,
  SecurityLockIcon,
  SmartPhone01Icon,
  Globe02Icon,
  HeartCheckIcon,
  ArrowRight02Icon,
  Leaf01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketing.about' });

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

function AboutContent() {
  const t = useTranslations('marketing.about');

  const values = [
    {
      icon: UserGroupIcon,
      key: 'communityFirst',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      icon: SecurityLockIcon,
      key: 'privacyByDesign',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    },
    {
      icon: CheckmarkCircle02Icon,
      key: 'verifiedTrust',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    },
    {
      icon: SmartPhone01Icon,
      key: 'accessibleDesign',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    },
  ] as const;

  const differentiators = [
    { key: 'localContext', icon: Globe02Icon },
    { key: 'communityOwned', icon: UserGroupIcon },
    { key: 'privacyFirst', icon: SecurityLockIcon },
  ] as const;

  const team = [
    { key: 'founder', role: 'Founder & Product Lead' },
    { key: 'community', role: 'Community Operations' },
    { key: 'engineering', role: 'Engineering' },
  ] as const;

  return (
    <div className="flex flex-col">
      {/* Hero with Origin Story */}
      <section className="relative overflow-hidden bg-background py-16 sm:py-24">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-6">
              <HugeiconsIcon icon={Leaf01Icon} size={16} className="mr-2" />
              {t('hero.badge')}
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t('hero.title')}
            </h1>

            {/* Origin Story Quote */}
            <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border">
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                &ldquo;{t('hero.originStory')}&rdquo;
              </p>
            </div>

            <p className="mt-8 text-lg text-muted-foreground leading-relaxed">{t('hero.intro')}</p>
          </div>
        </div>
      </section>

      {/* Values & Principles */}
      <section className="bg-muted/30 py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              {t('values.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('values.title')}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <div
                key={item.key}
                className="bg-background rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.color} mb-4`}
                >
                  <HugeiconsIcon icon={item.icon} size={24} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t(`values.${item.key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`values.${item.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
                {t('different.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('different.title')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t('different.intro')}
              </p>

              <div className="mt-8 space-y-4">
                {differentiators.map((item) => (
                  <div key={item.key} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <HugeiconsIcon icon={item.icon} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {t(`different.${item.key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(`different.${item.key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Side */}
            <div className="relative">
              <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    {t('different.comparisonLabel')}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                      <span className="text-sm text-muted-foreground">
                        {t('different.comparison.western')}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {t('different.comparison.ecopulse')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                      <span className="text-sm text-muted-foreground line-through">
                        {t('different.comparison.topDown')}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {t('different.comparison.communityDriven')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                      <span className="text-sm text-muted-foreground line-through">
                        {t('different.comparison.dataExtract')}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {t('different.comparison.dataEmpower')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/30 py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              {t('team.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('team.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('team.description')}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            {team.map((member) => (
              <div
                key={member.key}
                className="bg-background rounded-2xl p-6 border border-border text-center"
              >
                {/* Avatar Placeholder */}
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {t(`team.members.${member.key}.initials`)}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">
                  {t(`team.members.${member.key}.name`)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {t(`team.members.${member.key}.bio`)}
                </p>
              </div>
            ))}
          </div>

          {/* Fiscal Status */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-background rounded-full px-4 py-2 border border-border text-sm text-muted-foreground">
              <HugeiconsIcon icon={HeartCheckIcon} size={16} className="text-primary" />
              {t('team.fiscalStatus')}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
                <Link href="/contact">{t('cta.contactButton')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}
