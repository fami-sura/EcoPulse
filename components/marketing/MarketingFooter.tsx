import { useTranslations } from 'next-intl';
import {
  Mail01Icon,
  Location01Icon,
  ArrowRight02Icon,
  Github01Icon,
  Linkedin01Icon,
  NewTwitterIcon,
} from '@hugeicons/core-free-icons';
import { EcoPulseLogo } from '@/components/brand';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/marketing/LanguageSwitcher';

const navLinks = [
  { href: '/about', labelKey: 'about' },
  { href: '/mission', labelKey: 'mission' },
  { href: '/pilot', labelKey: 'pilot' },
  { href: '/faq', labelKey: 'faq' },
] as const;

const resourceLinks = [
  { href: '/map', labelKey: 'viewMap' },
  { href: '/reports', labelKey: 'reports' },
  { href: '/contact', labelKey: 'contact' },
] as const;

const legalLinks = [
  { href: '/privacy', labelKey: 'privacy' },
  { href: '/terms', labelKey: 'terms' },
] as const;

const socialLinks = [
  { href: 'https://twitter.com/ecopulse', icon: NewTwitterIcon, label: 'Twitter' },
  { href: 'https://linkedin.com/company/ecopulse', icon: Linkedin01Icon, label: 'LinkedIn' },
  { href: 'https://github.com/ecopulse', icon: Github01Icon, label: 'GitHub' },
] as const;

export function MarketingFooter() {
  const t = useTranslations('marketing.nav');
  const tFooter = useTranslations('marketing.footer');

  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center group"
              aria-label="EcoPulse - Go to homepage"
            >
              <EcoPulseLogo size="md" showTagline />
            </Link>

            <p className="mt-6 max-w-md text-sm text-muted-foreground leading-relaxed">
              {tFooter('tagline')}
            </p>

            {/* Mission Statement */}
            <div className="mt-6 p-4 rounded-xl bg-background border border-border">
              <p className="text-sm font-medium text-foreground">{tFooter('mission')}</p>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label={social.label}
                >
                  <HugeiconsIcon icon={social.icon} size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid gap-8 sm:grid-cols-3">
            {/* Navigation Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {tFooter('navTitle')}
              </h3>
              <ul className="mt-4 space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded inline-flex items-center gap-1 group"
                    >
                      {t(link.labelKey)}
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        size={14}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {tFooter('resourcesTitle')}
              </h3>
              <ul className="mt-4 space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded inline-flex items-center gap-1 group"
                    >
                      {t(link.labelKey)}
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        size={14}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Legal */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {tFooter('contactTitle')}
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={`mailto:${tFooter('email')}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded inline-flex items-center gap-2"
                  >
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={14}
                      className="text-primary"
                      aria-hidden="true"
                    />
                    {tFooter('email')}
                  </a>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground inline-flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={14}
                      className="text-primary"
                      aria-hidden="true"
                    />
                    {tFooter('location')}
                  </span>
                </li>
                <li className="pt-4 border-t border-border mt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {tFooter('legalTitle')}
                  </h4>
                  <ul className="space-y-2">
                    {legalLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {t(link.labelKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-border bg-background/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {tFooter('newsletterTitle')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {tFooter('newsletterDescription')}
              </p>
            </div>
            <Button asChild variant="outline" className="min-h-11 px-6">
              <Link href="/contact">
                {tFooter('subscribeButton')}
                <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} EcoPulse. {tFooter('copyright')}
              </p>
              {/* Language Switcher - Professional placement in footer */}
              <LanguageSwitcher variant="footer" />
            </div>
            <p className="text-xs text-muted-foreground">{tFooter('madeWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
