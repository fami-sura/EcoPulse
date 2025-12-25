import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  ArrowRight02Icon,
  Calendar01Icon,
  Building06Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const ctaPaths = [
  { key: 'ngos', icon: Building06Icon, href: '/contact' },
  { key: 'funders', icon: Calendar01Icon, href: '/pilot' },
  { key: 'communities', icon: UserGroupIcon, href: '/map' },
] as const;

export function CTABand() {
  const t = useTranslations('marketing.landing.cta');

  return (
    <section className="bg-primary py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[20px_20px]"></div>
      <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-secondary/80 opacity-90"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl mix-blend-overlay"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/40 rounded-full blur-3xl mix-blend-multiply"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          {/* Urgency Badge */}
          <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary-foreground ring-1 ring-inset ring-white/20 mb-6">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            {t('urgencyBadge')}
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Multi-path CTAs */}
        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          {ctaPaths.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group flex flex-col items-center p-6 rounded-xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 hover:bg-white/10 transition-all hover:ring-white/20"
            >
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                <HugeiconsIcon
                  icon={item.icon}
                  size={24}
                  className="text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60 mb-1">
                {t(`paths.${item.key}.audience`)}
              </p>
              <p className="text-lg font-bold text-primary-foreground mb-3">
                {t(`paths.${item.key}.action`)}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-foreground/80 group-hover:text-primary-foreground transition-colors">
                {t(`paths.${item.key}.cta`)}
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>

        {/* Alternative single CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-primary-foreground/60 mb-4">{t('preferContact')}</p>
          <Button
            asChild
            size="lg"
            className="min-h-14 px-8 text-lg font-semibold bg-background text-primary hover:bg-muted shadow-lg border-0"
          >
            <Link href="/contact">
              {t('mainCta')}
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={20}
                className="ml-2"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
