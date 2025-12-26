import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  SecurityLockIcon,
  ShieldUserIcon,
  Database01Icon,
  ImageRemove01Icon,
  Clock01Icon,
  Share01Icon,
  UserCircleIcon,
  Mail01Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketing.privacy' });

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

function PrivacyContent() {
  const t = useTranslations('marketing.privacy');

  const principles = [
    { key: 'minimal', icon: Database01Icon },
    { key: 'transparent', icon: ShieldUserIcon },
    { key: 'secure', icon: SecurityLockIcon },
    { key: 'respectful', icon: UserCircleIcon },
  ];

  const dataCategories = ['reports', 'verification', 'account', 'technical'] as const;

  const rights = [
    'access',
    'correction',
    'deletion',
    'portability',
    'objection',
    'withdraw',
  ] as const;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-linear-to-b from-primary/5 via-background to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <HugeiconsIcon icon={SecurityLockIcon} size={16} />
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

      {/* Privacy Principles */}
      <section className="bg-background py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {t('principles.title')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {principles.map(({ key, icon }) => (
                <div
                  key={key}
                  className="flex gap-4 p-5 rounded-xl bg-muted/30 border border-border"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HugeiconsIcon icon={icon} size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t(`principles.${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t(`principles.${key}.description`)}
                    </p>
                  </div>
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
            {/* Data We Collect */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <HugeiconsIcon icon={Database01Icon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('dataCollection.title')}</h2>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('dataCollection.intro')}
              </p>
              <div className="space-y-4">
                {dataCategories.map((category) => (
                  <div key={category} className="p-5 rounded-xl border border-border bg-muted/20">
                    <h3 className="font-semibold text-foreground mb-2">
                      {t(`dataCollection.${category}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`dataCollection.${category}.content`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Handling */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <HugeiconsIcon icon={ImageRemove01Icon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('photoHandling.title')}</h2>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 border border-green-200 dark:border-green-900">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('photoHandling.intro')}
                </p>
                <ul className="space-y-3">
                  {['exif', 'resize', 'storage', 'access'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={18}
                        className="text-green-600 mt-0.5 shrink-0"
                      />
                      <span className="text-sm text-muted-foreground">
                        {t(`photoHandling.${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Data Usage */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <HugeiconsIcon icon={Share01Icon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('dataUsage.title')}</h2>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">{t('dataUsage.intro')}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {['platform', 'partners', 'analytics', 'improvement'].map((use) => (
                  <div key={use} className="p-4 rounded-lg border border-border bg-muted/20">
                    <h4 className="font-medium text-foreground text-sm mb-1">
                      {t(`dataUsage.${use}.title`)}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t(`dataUsage.${use}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sharing */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <HugeiconsIcon icon={AlertCircleIcon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('dataSharing.title')}</h2>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-6 border border-amber-200 dark:border-amber-900 mb-4">
                <p className="font-medium text-foreground mb-2">{t('dataSharing.commitment')}</p>
                <p className="text-sm text-muted-foreground">{t('dataSharing.never')}</p>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('dataSharing.exceptions')}
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <HugeiconsIcon icon={Clock01Icon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('retention.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('retention.intro')}</p>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">
                        {t('retention.table.dataType')}
                      </th>
                      <th className="text-left p-4 font-semibold text-foreground">
                        {t('retention.table.period')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {['reports', 'account', 'session', 'analytics'].map((row, idx) => (
                      <tr key={row} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="p-4 text-foreground">{t(`retention.${row}.type`)}</td>
                        <td className="p-4 text-muted-foreground">
                          {t(`retention.${row}.period`)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                  <HugeiconsIcon icon={UserCircleIcon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('rights.title')}</h2>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t('rights.intro')}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rights.map((right) => (
                  <div key={right} className="p-4 rounded-lg border border-border bg-muted/20">
                    <h4 className="font-medium text-foreground text-sm mb-1">
                      {t(`rights.${right}.title`)}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t(`rights.${right}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <HugeiconsIcon icon={SecurityLockIcon} size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t('security.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('security.intro')}</p>
              <ul className="space-y-2">
                {['encryption', 'access', 'audit', 'rls'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-muted-foreground">{t(`security.${item}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* International Transfers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('international.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t('international.content')}</p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">{t('children.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('children.content')}</p>
            </div>

            {/* Policy Updates */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">{t('updates.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('updates.content')}</p>
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
                  href="mailto:privacy@ecopulse.app"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  <HugeiconsIcon icon={Mail01Icon} size={18} />
                  privacy@ecopulse.app
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-background border border-border text-foreground font-medium hover:bg-muted transition-colors"
                >
                  {t('contact.form')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyContent />;
}
