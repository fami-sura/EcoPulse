'use client';

/**
 * MarketingHeader Component
 *
 * Professional header for public-facing marketing pages.
 * Features logo, streamlined navigation, dual CTAs, and mobile menu.
 *
 * @accessibility
 * - All touch targets minimum 44x44px (WCAG 2.1 AA)
 * - Keyboard navigable
 * - Proper ARIA labels
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import {
  Menu01Icon,
  Cancel01Icon,
  ArrowRight02Icon,
  MapsLocation01Icon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import { EcoPulseLogo } from '@/components/brand';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/about', labelKey: 'about' },
  { href: '/mission', labelKey: 'mission' },
  { href: '/pilot', labelKey: 'pilot' },
  { href: '/faq', labelKey: 'faq' },
] as const;

export function MarketingHeader() {
  const t = useTranslations('marketing.nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Remove locale prefix from pathname for matching
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/');

  const isActive = (href: string) => {
    if (href === '/') {
      return pathnameWithoutLocale === '/' || pathnameWithoutLocale === '';
    }
    return pathnameWithoutLocale.startsWith(href);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-background/80 backdrop-blur-sm'
      )}
    >
      <div className="mx-auto flex h-16 lg:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-h-11 min-w-11 items-center group"
          aria-label="EcoPulse - Go to homepage"
        >
          <EcoPulseLogo size="md" showTagline />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex min-h-11 items-center px-4 py-2 text-sm font-medium transition-colors',
                  'rounded-lg hover:bg-muted',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  active
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {t(item.labelKey)}
                {active && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="min-h-10 text-muted-foreground hover:text-foreground"
          >
            <Link href="/contact">
              <HugeiconsIcon icon={Mail01Icon} size={18} className="mr-2" />
              {t('contact')}
            </Link>
          </Button>
          <Button asChild size="sm" className="min-h-10 px-5 font-semibold shadow-sm">
            <Link href="/map">
              <HugeiconsIcon icon={MapsLocation01Icon} size={18} className="mr-2" />
              {t('viewMap')}
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-lg lg:hidden',
            'text-muted-foreground hover:bg-muted hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'transition-colors'
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <HugeiconsIcon
            icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon}
            size={24}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="mx-auto max-w-7xl px-4 py-6 sm:px-6" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {t(item.labelKey)}
                    {active && <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>}
                  </Link>
                );
              })}

              {/* Mobile CTAs */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <Button asChild variant="outline" className="w-full min-h-12 justify-center">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <HugeiconsIcon icon={Mail01Icon} size={18} className="mr-2" />
                    {t('contact')}
                  </Link>
                </Button>
                <Button asChild className="w-full min-h-12 justify-center font-semibold">
                  <Link href="/map" onClick={() => setMobileMenuOpen(false)}>
                    <HugeiconsIcon icon={MapsLocation01Icon} size={18} className="mr-2" />
                    {t('viewMap')}
                    <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
