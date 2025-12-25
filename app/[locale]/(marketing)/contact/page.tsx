import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ContactForm } from './ContactForm';
import {
  Mail01Icon,
  UserGroupIcon,
  ChartLineData02Icon,
  HeartCheckIcon,
  Leaf01Icon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketing.contact' });

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

function ContactContent() {
  const t = useTranslations('marketing.contact');

  const partnerTypes = [
    {
      key: 'ngo',
      icon: UserGroupIcon,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    },
    {
      key: 'responder',
      icon: ChartLineData02Icon,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      key: 'funder',
      icon: HeartCheckIcon,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    },
  ] as const;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-28">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-8">
              <HugeiconsIcon icon={Leaf01Icon} size={16} className="mr-2" />
              {t('hero.badge')}
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="bg-muted/30 py-12 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              {t('partnerTypes.eyebrow')}
            </p>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('partnerTypes.title')}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            {partnerTypes.map((type) => (
              <div
                key={type.key}
                className="bg-background rounded-xl p-5 border border-border hover:shadow-lg transition-shadow text-center"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${type.color} mb-3`}
                >
                  <HugeiconsIcon icon={type.icon} size={24} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {t(`partnerTypes.${type.key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`partnerTypes.${type.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            {/* Form */}
            <div className="bg-muted/30 rounded-2xl p-8 border border-border">
              <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground mb-2">
                {t('form.title')}
              </h2>
              <p className="text-muted-foreground mb-6">{t('form.description')}</p>
              <ContactForm />
            </div>

            {/* Contact Info & Quick Links */}
            <div className="space-y-6">
              {/* Department Emails */}
              <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={Mail01Icon} size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t('emails.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('emails.description')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* General Inquiries */}
                  <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t('emails.general.label')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('emails.general.description')}
                      </p>
                    </div>
                    <a
                      href="mailto:info@ecopulse.app"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      info@ecopulse.app
                    </a>
                  </div>

                  {/* NGO Partners */}
                  <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t('emails.community.label')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('emails.community.description')}
                      </p>
                    </div>
                    <a
                      href="mailto:community@ecopulse.app"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      community@ecopulse.app
                    </a>
                  </div>

                  {/* Sponsors */}
                  <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t('emails.sponsor.label')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('emails.sponsor.description')}
                      </p>
                    </div>
                    <a
                      href="mailto:sponsor@ecopulse.app"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      sponsor@ecopulse.app
                    </a>
                  </div>

                  {/* Finance */}
                  <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t('emails.finance.label')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('emails.finance.description')}
                      </p>
                    </div>
                    <a
                      href="mailto:finance@ecopulse.app"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      finance@ecopulse.app
                    </a>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">{t('responseTime.title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('responseTime.description')}
                </p>
              </div>

              {/* Quick Links */}
              <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">{t('quickLinks.title')}</h3>
                <div className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-between min-h-11">
                    <Link href="/pilot">
                      {t('quickLinks.pilot')}
                      <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between min-h-11">
                    <Link href="/faq">
                      {t('quickLinks.faq')}
                      <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between min-h-11">
                    <Link href="/about">
                      {t('quickLinks.about')}
                      <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent />;
}
