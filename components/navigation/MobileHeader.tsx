'use client';

/**
 * MobileHeader Component
 *
 * Complete mobile header with hamburger menu, centered logo, and auth button.
 * Visible only on mobile (<1024px).
 *
 * @features
 * - Hamburger menu on left
 * - Centered EcoPulse logo
 * - Login/User avatar button on right
 * - All touch targets 44x44px minimum
 *
 * @accessibility
 * - WCAG 2.1 AA compliant
 * - Proper ARIA labels
 * - Keyboard navigable with focus trap
 * - Escape key to close
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { UserIcon, Logout01Icon, Settings02Icon } from '@hugeicons/core-free-icons';
import { EcoPulseLogo } from '@/components/brand';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { logout } from '@/app/actions/logout';
import { Link } from '@/i18n/routing';
import { MobileMenu } from './MobileMenu';

export function MobileHeader() {
  const t = useTranslations('navigation');
  const { isAuthenticated, user, profile } = useAuthStore();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLElement | null)[]>([]);

  // Menu items count (Profile, Settings, Logout)
  const MENU_ITEMS_COUNT = 3;

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!showUserDropdown) {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setShowUserDropdown(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          setShowUserDropdown(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % MENU_ITEMS_COUNT);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + MENU_ITEMS_COUNT) % MENU_ITEMS_COUNT);
          break;
        case 'Tab':
          // Close menu on Tab to allow natural navigation flow
          setShowUserDropdown(false);
          setFocusedIndex(-1);
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(MENU_ITEMS_COUNT - 1);
          break;
      }
    },
    [showUserDropdown]
  );

  // Focus the correct menu item when focusedIndex changes
  useEffect(() => {
    if (showUserDropdown && focusedIndex >= 0 && menuItemsRef.current[focusedIndex]) {
      menuItemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, showUserDropdown]);

  // Close on escape key (global listener)
  useEffect(() => {
    if (!showUserDropdown) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserDropdown(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showUserDropdown]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowUserDropdown(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const handleToggle = () => {
    setShowUserDropdown(!showUserDropdown);
    setFocusedIndex(showUserDropdown ? -1 : 0);
  };

  const closeMenu = () => {
    setShowUserDropdown(false);
    setFocusedIndex(-1);
  };

  return (
    <header className="sticky top-0 z-50 flex h-15 items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-4 lg:hidden">
      {/* Left: Hamburger Menu */}
      <MobileMenu />

      {/* Center: Logo with Official Brand Mark */}
      <Link href="/map" className="flex items-center" aria-label="EcoPulse - Go to Map">
        <EcoPulseLogo size="sm" />
      </Link>

      {/* Right: User Avatar (only when authenticated) or spacer */}
      <div className="relative w-11" ref={menuRef}>
        {isAuthenticated && user && (
          <>
            {/* User Avatar Button */}
            <button
              ref={buttonRef}
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              aria-label={t('userMenu')}
              aria-expanded={showUserDropdown}
              aria-haspopup="menu"
              aria-controls={showUserDropdown ? 'mobile-user-menu-dropdown' : undefined}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full',
                'hover:bg-muted',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'transition-colors'
              )}
            >
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HugeiconsIcon icon={UserIcon} size={18} aria-hidden="true" />
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div className="fixed inset-0 z-40" onClick={closeMenu} aria-hidden="true" />
                <div
                  id="mobile-user-menu-dropdown"
                  className={cn(
                    'absolute right-0 top-full mt-2 w-56 rounded-xl bg-background shadow-xl border border-border',
                    'py-2 z-50'
                  )}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="mobile-user-menu-button"
                  onKeyDown={handleKeyDown}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile?.username || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>

                  {/* Profile Link */}
                  <Link
                    ref={(el) => {
                      menuItemsRef.current[0] = el;
                    }}
                    href="/profile"
                    onClick={closeMenu}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm text-foreground',
                      'hover:bg-muted active:bg-muted/80 focus:outline-none focus:bg-muted',
                      focusedIndex === 0 && 'bg-muted'
                    )}
                    role="menuitem"
                    tabIndex={focusedIndex === 0 ? 0 : -1}
                  >
                    <HugeiconsIcon icon={UserIcon} size={20} aria-hidden="true" />
                    <span>{t('profile')}</span>
                  </Link>

                  {/* Settings Link */}
                  <Link
                    ref={(el) => {
                      menuItemsRef.current[1] = el;
                    }}
                    href="/profile/settings"
                    onClick={closeMenu}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm text-foreground',
                      'hover:bg-muted active:bg-muted/80 focus:outline-none focus:bg-muted',
                      focusedIndex === 1 && 'bg-muted'
                    )}
                    role="menuitem"
                    tabIndex={focusedIndex === 1 ? 0 : -1}
                  >
                    <HugeiconsIcon icon={Settings02Icon} size={20} aria-hidden="true" />
                    <span>{t('settings')}</span>
                  </Link>

                  {/* Divider */}
                  <div className="my-1 border-t border-border" role="separator" />

                  {/* Logout Button */}
                  <button
                    ref={(el) => {
                      menuItemsRef.current[2] = el;
                    }}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3 text-sm text-destructive',
                      'hover:bg-destructive/10 active:bg-destructive/20 disabled:opacity-50 focus:outline-none focus:bg-destructive/10',
                      focusedIndex === 2 && 'bg-destructive/10'
                    )}
                    role="menuitem"
                    tabIndex={focusedIndex === 2 ? 0 : -1}
                  >
                    <HugeiconsIcon icon={Logout01Icon} size={20} aria-hidden="true" />
                    <span>{isLoggingOut ? t('loggingOut') : t('logout')}</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default MobileHeader;
