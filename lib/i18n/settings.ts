/**
 * i18n Configuration Settings
 *
 * This file contains all i18n-related constants and type definitions.
 * Per PRD NFR75-77: MVP launches with English only, architecture ready for African languages.
 *
 * Language Priority (from UX Design Specification):
 * 1. English (Sprint 1 MVP - universal, tested with Nigerian users)
 * 2. Hausa, Yoruba, Igbo (Sprint 2 - Northern/Southern Nigeria)
 * 3. Swahili, French (Phase 2 - East/West Africa expansion)
 */

// Supported locales - MVP: English only
export const locales = ['en'] as const;

// Default locale
export const defaultLocale = 'en' as const;

// Type for supported locales
export type Locale = (typeof locales)[number];

// Translation namespaces used in the application
export const namespaces = ['common', 'navigation', 'report', 'auth', 'map', 'errors'] as const;

export type Namespace = (typeof namespaces)[number];

// Locale display names (for future locale switcher)
export const localeNames: Record<Locale, string> = {
  en: 'English',
  // Phase 2 (uncomment when adding languages):
  // ha: 'Hausa',
  // yo: 'Yorùbá',
  // ig: 'Igbo',
  // sw: 'Kiswahili',
  // fr: 'Français',
};

// Locale flags for UI display (ISO country codes)
export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  // Phase 2:
  // ha: '🇳🇬',
  // yo: '🇳🇬',
  // ig: '🇳🇬',
  // sw: '🇹🇿',
  // fr: '🇫🇷',
};

// Date-fns locale mapping (for date formatting)
// Import from date-fns/locale when needed
export const dateFnsLocaleMap: Record<Locale, string> = {
  en: 'enUS',
  // Phase 2:
  // ha: 'enUS', // Hausa falls back to English for date-fns
  // yo: 'enUS',
  // ig: 'enUS',
  // sw: 'enUS',
  // fr: 'fr',
};

/**
 * Helper to check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get locale from Accept-Language header or default
 */
export function getPreferredLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  // Parse Accept-Language header and find first matching locale
  const preferredLocales = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().substring(0, 2).toLowerCase());

  for (const preferred of preferredLocales) {
    if (isValidLocale(preferred)) {
      return preferred;
    }
  }

  return defaultLocale;
}
