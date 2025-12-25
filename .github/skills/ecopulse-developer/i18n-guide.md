# Internationalization (i18n) Guide

Complete guide for implementing multi-language support with next-intl in EcoPulse.

## Architecture Overview

**Library:** `next-intl` (Next.js App Router native)
**Default Locale:** `en` (English) - MVP ships with English only
**Future Locales:** Hausa (`ha`), Yoruba (`yo`), Igbo (`ig`), Swahili (`sw`)

**Key Files:**

- [`i18n/routing.ts`](i18n/routing.ts) - Locale configuration & routing
- [`i18n/request.ts`](i18n/request.ts) - Server-side i18n initialization
- [`middleware.ts`](middleware.ts) - Locale detection & session refresh
- [`messages/en.json`](messages/en.json) - English translations
- [`app/[locale]/layout.tsx`](app/[locale]/layout.tsx) - Locale provider setup

## Configuration

### Locale Routing (`i18n/routing.ts`)

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'ha', 'yo', 'ig', 'sw'],

  // Default locale (English for MVP)
  defaultLocale: 'en',

  // Locale detection strategy
  localeDetection: true,

  // Path configuration
  localePrefix: 'as-needed', // Only show non-default locales in URL
});

export type Locale = (typeof routing.locales)[number];
```

**URL Structure:**

- Default locale (en): `/` → `/reports` → `/issues/123`
- Other locales: `/ha` → `/ha/reports` → `/ha/issues/123`

### Server-Side Setup (`i18n/request.ts`)

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request or fallback to default
  let locale = await requestLocale;

  // Validate locale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### Middleware Integration (`middleware.ts`)

```typescript
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create i18n middleware
const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Handle i18n routing first
  let response = handleI18nRouting(request);

  // 2. Refresh Supabase session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser(); // Refresh session

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except static files
    '/((?!_next|_vercel|.*\\..*|api).*)',
  ],
};
```

## Translation Files

### Structure (`messages/en.json`)

```json
{
  "common": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Success!",
    "takePhoto": "Take Photo",
    "selectFromGallery": "Select from Gallery",
    "useCurrentLocation": "Use Current Location"
  },

  "navigation": {
    "home": "Home",
    "map": "Map",
    "reports": "My Reports",
    "profile": "Profile",
    "settings": "Settings",
    "signIn": "Sign In",
    "signOut": "Sign Out"
  },

  "report": {
    "title": "Report an Issue",
    "category": "Category",
    "selectCategory": "Select a category",
    "categories": {
      "waste": "Waste Disposal",
      "drainage": "Drainage Problem",
      "sanitation": "Sanitation Issue",
      "other": "Other"
    },
    "location": "Location",
    "note": "Description",
    "notePlaceholder": "Describe the issue in detail (minimum 60 characters)...",
    "photos": "Photos",
    "addPhotos": "Add Photos",
    "photosRequired": "At least one photo is required",
    "noteMinLength": "Description must be at least 60 characters",
    "submitReport": "Submit Report",
    "reportSubmitted": "Report submitted successfully!",
    "verify": "Verify This Issue",
    "alreadyVerified": "You've already verified this issue",
    "cannotVerifySelf": "You cannot verify your own report",
    "verificationSuccess": "Thank you for verifying!",
    "verificationCount": "{count, plural, =0 {No verifications} =1 {1 verification} other {# verifications}}"
  },

  "status": {
    "pending": "Pending",
    "verified": "Verified",
    "in_progress": "In Progress",
    "resolved": "Resolved"
  },

  "auth": {
    "signInWith": "Sign in with {provider}",
    "signInTitle": "Sign in to your account",
    "signUpTitle": "Create an account",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "signOut": "Sign Out",
    "forgotPassword": "Forgot password?",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?",
    "emailSent": "Check your email for the login link",
    "invalidCredentials": "Invalid email or password",
    "passwordMismatch": "Passwords do not match",
    "weakPassword": "Password must be at least 8 characters"
  },

  "errors": {
    "generic": "Something went wrong. Please try again.",
    "network": "Network error. Check your connection.",
    "notFound": "Page not found",
    "unauthorized": "You must be signed in to do that",
    "forbidden": "You don't have permission to do that",
    "validation": "Please check your input and try again"
  }
}
```

### Namespaces Best Practices

- `common`: Reusable UI strings (buttons, states, actions)
- `navigation`: Menu items, links, breadcrumbs
- `report`: Report creation/viewing workflow
- `status`: Report status labels
- `auth`: Authentication flows
- `errors`: Error messages
- `validation`: Form validation messages

## Usage Patterns

### Server Components (Preferred)

```tsx
// app/[locale]/reports/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function ReportsPage() {
  const t = await getTranslations('report');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}

// With parameters
export default async function ReportDetail({ params }) {
  const { reportId } = await params;
  const t = await getTranslations('report');

  // Plural handling
  const count = 5;
  const message = t('verificationCount', { count });
  // Result: "5 verifications"

  return <div>{message}</div>;
}
```

### Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { CameraIcon } from '@hugeicons/react';

export function PhotoButton() {
  const t = useTranslations('common');

  return (
    <button>
      <CameraIcon size={24} />
      <span>{t('takePhoto')}</span>
    </button>
  );
}
```

### With NextIntlClientProvider

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Typed Translations (Recommended)

```typescript
// types/i18n.ts
import type en from '@/messages/en.json';

export type Messages = typeof en;
export type MessageKeys = keyof Messages;

// Usage with type safety
const t = useTranslations('report');
t('title'); // ✅ Type-safe
t('invalidKey'); // ❌ TypeScript error
```

## Locale Switching

### Link Component

```tsx
import { Link } from '@/i18n/routing';

export function LocaleNav() {
  return (
    <>
      {/* Automatic locale prefix */}
      <Link href="/reports">My Reports</Link>
      {/* Renders: /en/reports or /ha/reports based on current locale */}
    </>
  );
}
```

### Programmatic Navigation

```tsx
'use client';

import { useRouter } from '@/i18n/routing';

export function LocaleSwitcher() {
  const router = useRouter();

  const switchLocale = (locale: string) => {
    router.replace('/reports', { locale });
    // Navigates to same page in new locale
  };

  return (
    <select onChange={(e) => switchLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="ha">Hausa</option>
      <option value="yo">Yoruba</option>
      <option value="ig">Igbo</option>
      <option value="sw">Swahili</option>
    </select>
  );
}
```

### Redirect

```tsx
import { redirect } from '@/i18n/routing';

export async function action() {
  // Redirects to localized path
  redirect('/reports');
}
```

## Advanced Patterns

### Pluralization

```json
{
  "report": {
    "verificationCount": "{count, plural, =0 {No verifications} =1 {1 verification} other {# verifications}}"
  }
}
```

```tsx
const t = useTranslations('report');
t('verificationCount', { count: 0 }); // "No verifications"
t('verificationCount', { count: 1 }); // "1 verification"
t('verificationCount', { count: 5 }); // "5 verifications"
```

### Date/Time Formatting

```tsx
import { useFormatter } from 'next-intl';

export function ReportDate({ timestamp }: { timestamp: string }) {
  const format = useFormatter();

  return (
    <time>
      {format.dateTime(new Date(timestamp), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
      {/* English: "December 20, 2024" */}
      {/* Hausa: "20 Disamba, 2024" (if configured) */}
    </time>
  );
}
```

### Number Formatting

```tsx
import { useFormatter } from 'next-intl';

export function Stats({ count }: { count: number }) {
  const format = useFormatter();

  return <span>{format.number(count, { notation: 'compact' })}</span>;
  // 1,234 → "1.2K"
}
```

### Rich Text

```json
{
  "report": {
    "disclaimer": "By submitting, you agree to our <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>."
  }
}
```

```tsx
const t = useTranslations('report');

t.rich('disclaimer', {
  terms: (chunks) => <Link href="/terms">{chunks}</Link>,
  privacy: (chunks) => <Link href="/privacy">{chunks}</Link>,
});
```

## Future Locales (Post-MVP)

### Hausa (`ha`)

```json
{
  "common": {
    "submit": "Aika",
    "cancel": "Soke",
    "save": "Ajiye",
    "delete": "Share",
    "loading": "Ana loda...",
    "error": "Kuskure ya faru",
    "success": "Nasara!"
  },
  "navigation": {
    "home": "Gida",
    "map": "Taswirar Ƙasa",
    "reports": "Rahotannina",
    "profile": "Bayani",
    "settings": "Saitunan"
  }
}
```

### Yoruba (`yo`)

```json
{
  "common": {
    "submit": "Fi ranṣẹ",
    "cancel": "Fagilee",
    "save": "Fi pamọ",
    "delete": "Paarẹ",
    "loading": "N ṣiṣẹ...",
    "error": "Aṣiṣe kan ṣẹlẹ",
    "success": "Aṣeyọri!"
  }
}
```

### Igbo (`ig`)

```json
{
  "common": {
    "submit": "Ziga",
    "cancel": "Kagbuo",
    "save": "Chekwa",
    "delete": "Hichapụ",
    "loading": "Na-ebu...",
    "error": "Njehie mere",
    "success": "Ihe ịga nke ọma!"
  }
}
```

### Swahili (`sw`)

```json
{
  "common": {
    "submit": "Wasilisha",
    "cancel": "Ghairi",
    "save": "Hifadhi",
    "delete": "Futa",
    "loading": "Inapakia...",
    "error": "Hitilafu imetokea",
    "success": "Umefanikiwa!"
  }
}
```

## SEO & Metadata

```tsx
// app/[locale]/layout.tsx
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '/',
      languages: {
        en: '/en',
        ha: '/ha',
        yo: '/yo',
        ig: '/ig',
        sw: '/sw',
      },
    },
  };
}
```

## Testing i18n

```typescript
// test/i18n.test.ts
import { describe, it, expect } from 'vitest';
import { getTranslations } from 'next-intl/server';

describe('i18n translations', () => {
  it('should load English translations', async () => {
    const t = await getTranslations({ locale: 'en', namespace: 'common' });
    expect(t('submit')).toBe('Submit');
  });

  it('should handle pluralization', async () => {
    const t = await getTranslations({ locale: 'en', namespace: 'report' });
    expect(t('verificationCount', { count: 0 })).toBe('No verifications');
    expect(t('verificationCount', { count: 1 })).toBe('1 verification');
    expect(t('verificationCount', { count: 5 })).toBe('5 verifications');
  });
});
```

## Translation Workflow (Future)

### 1. Extract Strings

```bash
# Future: Extract all translation keys to CSV for translators
pnpm i18n:extract
```

### 2. Translation Management

- Use platform like Crowdin, Lokalise, or Phrase
- Community translators contribute
- Automated PR creation for new translations

### 3. Validation

```bash
# Future: Validate all locales have matching keys
pnpm i18n:validate
```

## Common Pitfalls

### ❌ Hardcoded Strings

```tsx
// Bad
<button>Submit Report</button>

// Good
const t = useTranslations('common')
<button>{t('submitReport')}</button>
```

### ❌ Missing Locale in Server Actions

```tsx
// Bad - no locale context
'use server';
export async function createReport(data) {
  // Error messages in English only
  return { error: 'Invalid data' };
}

// Good - pass locale from client
('use client');
const locale = useLocale();
await createReport(data, locale);

('use server');
export async function createReport(data, locale) {
  const t = await getTranslations({ locale, namespace: 'errors' });
  return { error: t('invalidData') };
}
```

### ❌ Not Using Link Component

```tsx
// Bad - loses locale
import Link from 'next/link';
<Link href="/reports">Reports</Link>;

// Good - maintains locale
import { Link } from '@/i18n/routing';
<Link href="/reports">Reports</Link>;
```

## Checklist for New Features

- ✅ All user-facing strings in `messages/en.json`
- ✅ Using `useTranslations()` or `getTranslations()` hooks
- ✅ Namespaced keys (e.g., `report.title` not `reportTitle`)
- ✅ Pluralization handled correctly
- ✅ Dates/numbers formatted with `useFormatter()`
- ✅ Using `Link` from `@/i18n/routing`
- ✅ Server Actions return localized error messages
- ✅ Metadata/SEO uses translations
- ✅ No hardcoded strings in components

## Summary

**MVP (English only):**

- Single locale (`en`) configured
- All strings in `messages/en.json`
- Infrastructure ready for multi-locale

**Post-MVP (Multi-locale):**

- Add `messages/ha.json`, `messages/yo.json`, etc.
- Test with community translators
- Enable locale switcher in UI
- SEO with `hreflang` tags

**Key Principle:** Even with English-only MVP, structure all strings through next-intl to make future localization seamless.
