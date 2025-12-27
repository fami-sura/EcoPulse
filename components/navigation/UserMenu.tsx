'use client';

/**
 * UserMenu Component
 *
 * Dropdown menu for authenticated users with profile, settings, and logout options.
 *
 * @accessibility
 * - Keyboard navigable (Arrow keys, Tab, Enter, Escape)
 * - Proper ARIA labels and roles
 * - Focus management with focus trap
 * - Click-outside to close
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { UserIcon, Settings02Icon, Logout01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { logout } from '@/app/actions/logout';

export function UserMenu() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const { user, profile, logout: storeLogout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLElement | null)[]>([]);

  // Menu items count (Profile, Settings, Logout)
  const MENU_ITEMS_COUNT = 3;

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
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
          setIsOpen(false);
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
    [isOpen]
  );

  // Focus the correct menu item when focusedIndex changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuItemsRef.current[focusedIndex]) {
      menuItemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  if (!user) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
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

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(isOpen ? -1 : 0);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={t('userMenu')}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? 'user-menu-dropdown' : undefined}
        className={cn(
          'flex min-h-11 min-w-11 items-center justify-center rounded-full',
          'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="user-menu-dropdown"
          className={cn(
            'absolute right-0 top-full mt-2 w-48 rounded-xl bg-background shadow-xl border border-border',
            'py-1 z-50'
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          onKeyDown={handleKeyDown}
        >
          {/* Profile Link */}
          <Link
            ref={(el) => {
              menuItemsRef.current[0] = el;
            }}
            href="/profile"
            onClick={closeMenu}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 text-sm text-foreground',
              'hover:bg-muted focus:outline-none focus:bg-muted',
              'transition-colors',
              focusedIndex === 0 && 'bg-muted'
            )}
            role="menuitem"
            tabIndex={focusedIndex === 0 ? 0 : -1}
          >
            <HugeiconsIcon icon={UserIcon} size={18} aria-hidden="true" />
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
              'flex items-center gap-3 px-4 py-2.5 text-sm text-foreground',
              'hover:bg-muted focus:outline-none focus:bg-muted',
              'transition-colors',
              focusedIndex === 1 && 'bg-muted'
            )}
            role="menuitem"
            tabIndex={focusedIndex === 1 ? 0 : -1}
          >
            <HugeiconsIcon icon={Settings02Icon} size={18} aria-hidden="true" />
            <span>{t('settings')}</span>
          </Link>

          {/* Divider */}
          <div className="my-1 h-px bg-border" role="separator" />

          {/* Logout Button */}
          <button
            ref={(el) => {
              menuItemsRef.current[2] = el;
            }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              'flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive',
              'hover:bg-destructive/10 focus:outline-none focus:bg-destructive/10',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors',
              focusedIndex === 2 && 'bg-destructive/10'
            )}
            role="menuitem"
            tabIndex={focusedIndex === 2 ? 0 : -1}
          >
            <HugeiconsIcon icon={Logout01Icon} size={18} aria-hidden="true" />
            <span>{isLoggingOut ? t('loggingOut') : t('logout')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
