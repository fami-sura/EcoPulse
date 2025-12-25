import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  File02Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  ImageUploadIcon,
  ShieldUserIcon,
  CancelCircleIcon,
  Mail01Icon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketing.terms' });

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

function TermsContent() {
  const t = useTranslations('marketing.terms');

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <HugeiconsIcon icon={File02Icon} size={16} />
              {t('badge')}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">{t('effectiveDate')}</p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="bg-muted/30 py-12 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">
              {t('summary.title')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {['access', 'content', 'conduct', 'liability'].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border"
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    className="text-primary mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-muted-foreground">{t(`summary.${item}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* 1. Acceptance of Terms */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('acceptance.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('acceptance.intro')}</p>
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 border border-amber-200 dark:border-amber-900">
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={AlertCircleIcon}
                    size={20}
                    className="text-amber-600 mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-muted-foreground">{t('acceptance.warning')}</p>
                </div>
              </div>
            </div>

            {/* 2. Description of Service */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('service.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('service.intro')}</p>
              <ul className="space-y-2">
                {['reporting', 'verification', 'coordination', 'exports'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-muted-foreground">{t(`service.${item}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. User Accounts */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold">
                  3
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('accounts.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('accounts.intro')}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {['registration', 'security', 'anonymous', 'termination'].map((item) => (
                  <div key={item} className="p-4 rounded-xl border border-border bg-muted/20">
                    <h4 className="font-medium text-foreground text-sm mb-1">
                      {t(`accounts.${item}.title`)}
                    </h4>
                    <p className="text-xs text-muted-foreground">{t(`accounts.${item}.content`)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. User Content */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <HugeiconsIcon icon={ImageUploadIcon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('userContent.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('userContent.intro')}</p>
              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-border bg-muted/20">
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('userContent.license.title')}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('userContent.license.content')}
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-border bg-muted/20">
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('userContent.responsibility.title')}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('userContent.responsibility.content')}
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-border bg-muted/20">
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('userContent.moderation.title')}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('userContent.moderation.content')}
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Acceptable Use */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                  <HugeiconsIcon icon={ShieldUserIcon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('acceptable.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('acceptable.intro')}</p>
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-6 border border-red-200 dark:border-red-900">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <HugeiconsIcon icon={CancelCircleIcon} size={18} className="text-red-600" />
                  {t('acceptable.prohibited.title')}
                </h4>
                <ul className="space-y-2">
                  {[
                    'illegal',
                    'harassment',
                    'falseReports',
                    'personalData',
                    'spam',
                    'interference',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-red-500 font-bold mt-0.5">✕</span>
                      <span className="text-sm text-muted-foreground">
                        {t(`acceptable.prohibited.${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 6. Verification Guidelines */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('verification.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('verification.intro')}
              </p>
              <ul className="space-y-2">
                {['honesty', 'noSelf', 'proximity', 'objectivity'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-purple-600 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-muted-foreground">
                      {t(`verification.${item}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 7. Intellectual Property */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-bold">
                  7
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('ip.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('ip.platform')}</p>
              <p className="text-muted-foreground leading-relaxed">{t('ip.data')}</p>
            </div>

            {/* 8. Disclaimers */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <HugeiconsIcon icon={AlertCircleIcon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('disclaimers.title')}</h2>
              </div>
              <div className="bg-muted/30 rounded-xl p-6 border border-border space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('disclaimers.noGuarantee.title')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t('disclaimers.noGuarantee.content')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('disclaimers.asIs.title')}
                  </h4>
                  <p className="text-sm text-muted-foreground">{t('disclaimers.asIs.content')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('disclaimers.availability.title')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t('disclaimers.availability.content')}
                  </p>
                </div>
              </div>
            </div>

            {/* 9. Limitation of Liability */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 font-bold">
                  9
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('liability.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('liability.intro')}</p>
              <div className="bg-muted/30 rounded-xl p-6 border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('liability.content')}
                </p>
              </div>
            </div>

            {/* 10. Indemnification */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                  10
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('indemnification.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('indemnification.content')}
              </p>
            </div>

            {/* 11. Governing Law */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                  11
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('governing.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{t('governing.content')}</p>
            </div>

            {/* 12. Changes to Terms */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                  12
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('changes.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{t('changes.content')}</p>
            </div>

            {/* Contact */}
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={Mail01Icon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('contact.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('contact.intro')}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:legal@ecopulse.app"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  <HugeiconsIcon icon={Mail01Icon} size={18} />
                  legal@ecopulse.app
                </a>
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-background border border-border text-foreground font-medium hover:bg-muted transition-colors"
                >
                  {t('contact.privacy')}
                  <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsContent />;
}
