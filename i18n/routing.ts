import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'fr'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Locale prefix strategy: 'always' | 'as-needed' | 'never'
  // Using 'as-needed' for cleaner URLs (no /en prefix for default locale)
  localePrefix: 'as-needed',
});

// Locale display names for language switcher
export const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
};

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

// Type exports for use in other files
export type Locale = (typeof routing.locales)[number];
