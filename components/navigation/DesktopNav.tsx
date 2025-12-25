'use client';

/**
 * DesktopNav Component
 *
 * Horizontal navigation bar for desktop users (≥1024px).
 * Features logo, navigation links with icons, active state, and user avatar/login.
 *
 * @accessibility
 * - All touch targets minimum 44x44px (WCAG 2.1 AA)
 * - Keyboard navigable (Tab, Enter, Esc)
 * - Proper ARIA labels
 */

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Home03Icon,
  File02Icon,
  FlashIcon,
  UserIcon,
  Login01Icon,
  Building06Icon,
} from '@hugeicons/core-free-icons';
import { EcoPulseLogo } from '@/components/brand';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { UserMenu } from './UserMenu';
import type { Database } from '@/lib/supabase/database.types';

type UserRole = Database['public']['Enums']['user_role'];

interface NavItem {
  href: string;
  labelKey: string;
  icon: typeof Home03Icon;
  ariaLabel: string;
  /** Which roles can see this item. 'all' = everyone, 'authenticated' = logged in users */
  visibility: 'all' | 'authenticated' | UserRole[];
}

const allNavItems: NavItem[] = [
  {
    href: '/map',
    labelKey: 'map',
    icon: Home03Icon,
    ariaLabel: 'Navigate to Map',
    visibility: 'all',
  },
  {
    href: '/profile/reports',
    labelKey: 'myReports',
    icon: File02Icon,
    ariaLabel: 'Navigate to My Reports',
    visibility: 'authenticated',
  },
  {
    href: '/actions',
    labelKey: 'actions',
    icon: FlashIcon,
    ariaLabel: 'Navigate to Actions',
    visibility: 'authenticated',
  },
  {
    href: '/profile',
    labelKey: 'profile',
    icon: UserIcon,
    ariaLabel: 'Navigate to Profile',
    visibility: 'authenticated',
  },
  {
    href: '/dashboard',
    labelKey: 'ngoDashboard',
    icon: Building06Icon,
    ariaLabel: 'Navigate to NGO Dashboard',
    visibility: ['ngo_coordinator', 'admin'],
  },
];

export function DesktopNav() {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const { isAuthenticated, user, profile } = useAuthStore();

  // Remove locale prefix from pathname for matching
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/');

  const isActive = (href: string) => {
    if (href === '/map') {
      return pathnameWithoutLocale === '/map' || pathnameWithoutLocale.startsWith('/map/');
    }
    return pathnameWithoutLocale.startsWith(href);
  };

  // Filter nav items based on user role
  const navItems = useMemo(() => {
    const userRole = profile?.role;

    return allNavItems.filter((item) => {
      // 'all' visibility - everyone can see
      if (item.visibility === 'all') return true;

      // 'authenticated' visibility - only logged in users
      if (item.visibility === 'authenticated') return isAuthenticated;

      // Role-based visibility - check if user has required role
      if (Array.isArray(item.visibility)) {
        if (!isAuthenticated || !userRole) return false;
        return item.visibility.includes(userRole);
      }

      return false;
    });
  }, [isAuthenticated, profile?.role]);

  return (
    <nav
      className="sticky top-0 z-50 hidden h-15 w-full border-b border-gray-200 bg-white lg:block"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Logo with Official Brand Mark */}
        <Link
          href="/"
          className="flex min-h-11 min-w-11 items-center"
          aria-label="EcoPulse - Go to homepage"
        >
          <EcoPulseLogo size="sm" />
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.ariaLabel}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-11 min-w-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  'hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2',
                  active ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  aria-hidden="true"
                  className={cn(active ? 'text-green-600' : 'text-gray-500')}
                />
                <span>
                  {item.labelKey === 'myReports' && !isAuthenticated
                    ? t('reports')
                    : t(item.labelKey)}
                </span>
                {/* Active indicator - green underline */}
                {active && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-green-600"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Avatar / Login Button */}
        <div className="flex items-center">
          {isAuthenticated && user ? (
            <UserMenu />
          ) : (
            <Link
              href="/auth/login"
              aria-label="Log in to your account"
              className={cn(
                'flex min-h-11 items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors',
                'hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2'
              )}
            >
              <HugeiconsIcon icon={Login01Icon} size={18} aria-hidden="true" />
              <span>{t('login')}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
