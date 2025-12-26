'use client';

/**
 * FloatingContactCTA Component
 *
 * Floating action button that appears after scrolling past the hero.
 * Provides quick access to contact page for impulse conversion.
 *
 * @accessibility
 * - Proper aria-label for screen readers
 * - Keyboard focusable
 * - Visible focus state
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 600;

export function FloatingContactCTA() {
  const t = useTranslations('marketing.nav');
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <Link
      href="/contact"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-2',
        'rounded-full bg-primary text-primary-foreground shadow-lg',
        'transition-all duration-300 ease-out',
        'hover:scale-105 hover:shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
        isHovered ? 'px-5 py-3' : 'h-14 w-14 justify-center'
      )}
      aria-label={t('contactUs')}
    >
      <HugeiconsIcon icon={Mail01Icon} size={22} aria-hidden="true" />
      {isHovered && (
        <span className="text-sm font-medium whitespace-nowrap animate-in fade-in duration-200">
          {t('contactUs')}
        </span>
      )}
    </Link>
  );
}
