'use client';

/**
 * MobileMenu Component
 *
 * Slide-in navigation menu for mobile users (<1024px).
 * Uses ONLY icons (no text labels) for low-literacy accessibility.
 *
 * @accessibility
 * - All touch targets minimum 56x56px (exceeds WCAG 2.1 AA 44px requirement)
 * - Icon-only design with aria-labels for screen readers
 * - Focus trap when open (Radix Dialog)
 * - Esc key and backdrop click to close
 */

import { useCallback, useState, useMemo } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Home03Icon,
  File02Icon,
  FlashIcon,
  UserIcon,
  Menu01Icon,
  Cancel01Icon,
  Login01Icon,
  Logout01Icon,
  Building06Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { useNavigationStore } from '@/stores/navigationStore';
import { useAuthStore } from '@/stores/authStore';
import { logout } from '@/app/actions/logout';
import type { Database } from '@/lib/supabase/database.types';

type UserRole = Database['public']['Enums']['user_role'];

interface NavItem {
  href: string;
  icon: typeof Home03Icon;
  ariaLabel: string;
  labelKey: string;
  /** Which roles can see this item. 'all' = everyone, 'authenticated' = logged in users */
  visibility: 'all' | 'authenticated' | UserRole[];
}

const allNavItems: NavItem[] = [
  {
    href: '/map',
    icon: Home03Icon,
    ariaLabel: 'Navigate to Map',
    labelKey: 'map',
    visibility: 'all',
  },
  {
    href: '/profile/reports',
    icon: File02Icon,
    ariaLabel: 'Navigate to My Reports',
    labelKey: 'myReports',
    visibility: 'authenticated',
  },
  {
    href: '/actions',
    icon: FlashIcon,
    ariaLabel: 'Navigate to Actions',
    labelKey: 'actions',
    visibility: 'authenticated',
  },
  {
    href: '/profile',
    icon: UserIcon,
    ariaLabel: 'Navigate to Profile',
    labelKey: 'profile',
    visibility: 'authenticated',
  },
  {
    href: '/dashboard',
    icon: Building06Icon,
    ariaLabel: 'Navigate to NGO Dashboard',
    labelKey: 'ngoDashboard',
    visibility: ['ngo_coordinator', 'admin'],
  },
];

export function MobileMenu() {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const locale = useLocale();
  const { isMenuOpen, openMenu, closeMenu } = useNavigationStore();
  const { isAuthenticated, user, profile, logout: storeLogout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Remove locale prefix from pathname for matching
  // Handles both '/en/map' and direct '/map' paths
  let pathnameWithoutLocale = pathname;
  const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  if (localeMatch) {
    pathnameWithoutLocale = pathname.slice(localeMatch[0].length - 1) || '/';
  }

  const isActive = useCallback(
    (href: string) => {
      // Normalize paths for comparison
      const normalizedPathname =
        pathnameWithoutLocale === '/' ? '/' : pathnameWithoutLocale.toLowerCase();
      const normalizedHref = href.toLowerCase();

      if (normalizedHref === '/map') {
        return (
          normalizedPathname === '/map' ||
          normalizedPathname === '/' ||
          normalizedPathname.startsWith('/map/')
        );
      }
      return normalizedPathname.startsWith(normalizedHref);
    },
    [pathnameWithoutLocale]
  );

  const handleNavClick = () => {
    closeMenu();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    closeMenu();
    try {
      const result = await logout();
      if (result.success) {
        // Clear client-side auth state
        storeLogout();
        // Redirect to home page with full page navigation
        const homePath = locale === 'en' ? '/' : `/${locale}`;
        window.location.href = homePath;
      } else {
        console.error('Logout failed:', result.error);
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
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
    <Dialog.Root
      open={isMenuOpen}
      onOpenChange={(open: boolean) => (open ? openMenu() : closeMenu())}
    >
      {/* Hamburger Button - visible on mobile only */}
      <Dialog.Trigger asChild>
        <button
          aria-label={t('openMenu')}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-lg lg:hidden',
            'text-muted-foreground hover:bg-muted hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'transition-colors'
          )}
          suppressHydrationWarning
        >
          <HugeiconsIcon icon={Menu01Icon} size={24} aria-hidden="true" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Backdrop Overlay */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 bg-black/50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
          style={{ zIndex: 9998 }}
        />

        {/* Slide-in Menu Panel */}
        <Dialog.Content
          className={cn(
            'fixed inset-y-0 left-0 w-75 bg-background shadow-xl',
            'flex flex-col',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
            'duration-300 ease-out',
            'focus-visible:outline-none'
          )}
          style={{ zIndex: 9999 }}
          aria-describedby={undefined}
        >
          {/* Menu Header with Close Button */}
          <div className="flex h-15 shrink-0 items-center justify-between border-b border-border px-4">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {t('mainMenu')}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label={t('closeMenu')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-lg',
                  'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  'transition-colors'
                )}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={24} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {/* Navigation Items - Icon with Labels */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    aria-label={item.ariaLabel}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex h-14 items-center gap-4 rounded-xl px-4 transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      size={24}
                      aria-hidden="true"
                      strokeWidth={active ? 2 : 1.5}
                    />
                    <span className={cn('text-base', active && 'font-medium')}>
                      {t(item.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Auth Section */}
          <div className="shrink-0 border-t border-border p-4">
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-2">
                {/* User Info */}
                <div className="flex items-center gap-3 px-2 py-2">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <HugeiconsIcon icon={UserIcon} size={20} aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile?.username || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  aria-label={isLoggingOut ? t('loggingOut') : t('logout')}
                  className={cn(
                    'flex h-12 items-center justify-center gap-2 rounded-xl',
                    'bg-destructive/10 text-destructive font-medium',
                    'hover:bg-destructive/20 active:bg-destructive/30 disabled:opacity-50',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2',
                    'transition-colors'
                  )}
                >
                  <HugeiconsIcon icon={Logout01Icon} size={20} aria-hidden="true" />
                  <span>{isLoggingOut ? t('loggingOut') : t('logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                onClick={handleNavClick}
                aria-label="Log in to your account"
                className={cn(
                  'flex h-14 items-center justify-center gap-2 rounded-xl',
                  'bg-primary text-primary-foreground font-semibold shadow-sm',
                  'hover:bg-primary/90 active:bg-primary/80',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  'transition-colors'
                )}
              >
                <HugeiconsIcon icon={Login01Icon} size={22} aria-hidden="true" />
                <span>{t('login')}</span>
              </Link>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default MobileMenu;
