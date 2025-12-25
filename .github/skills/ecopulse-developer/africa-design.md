# Africa-First UI Design System

Complete guide for implementing accessible, low-literacy-friendly UI with flexible icon+text or icon-only modes.

## Design Philosophy

EcoPulse is designed for **African communities** with diverse literacy levels and mobile-first usage patterns. Our UI system supports **two modes**:

1. **Icon+Text Mode** (Default/Recommended) - Accessible, inclusive, WCAG compliant
2. **Icon-Only Mode** (Specific Contexts) - For contexts where text literacy is a barrier

**Key Principle:** Default to Icon+Text for accessibility, use Icon-Only selectively with proper aria-labels.

## Core Constraints

### Touch Targets (WCAG 2.1 AA)

- **Minimum size:** 44×44px for ALL interactive elements
- **Spacing:** Minimum 8px between touch targets
- **Target area:** Includes padding, not just visible icon

```typescript
// ✅ Correct - meets 44px minimum
<button className="h-11 w-11 p-2">
  <Icon size={24} />
</button>

// ❌ Wrong - too small
<button className="h-8 w-8 p-1">
  <Icon size={16} />
</button>
```

### Mobile-First Viewport

- **Primary range:** 320px - 1023px
- **Breakpoints:**
  - `xs`: 320px (small phones)
  - `sm`: 640px (large phones)
  - `md`: 768px (tablets)
  - `lg`: 1024px (desktop)

```tsx
// Mobile-first responsive design
<div className="w-full sm:w-1/2 lg:w-1/3">
  {/* Stacks on mobile, 2-col on tablet, 3-col on desktop */}
</div>
```

### Offline-First Architecture

- **Progressive enhancement** - core features work offline
- **Local-first data** - save to localStorage, sync when online
- **Optimistic updates** - show changes immediately, reconcile later

```typescript
// Example: Offline report draft
function saveReportDraft(data: ReportDraft) {
  const drafts = JSON.parse(localStorage.getItem('report_drafts') || '[]');
  drafts.push({ ...data, id: crypto.randomUUID(), timestamp: Date.now() });
  localStorage.setItem('report_drafts', JSON.stringify(drafts));
}
```

## Icon System (Hugeicons)

**Library:** `@hugeicons/react` (23,000+ icons)

**Why Hugeicons:**

- ✅ Comprehensive icon set
- ✅ Consistent visual language
- ✅ Tree-shakeable (only import used icons)
- ✅ Supports stroke width customization
- ✅ Accessible with proper sizing

### Icon Guidelines

```typescript
import {
  Home01Icon,
  MapIcon,
  CameraIcon,
  TickDouble02Icon,
  AlertCircleIcon,
} from '@hugeicons/react'

// Standard sizes
const ICON_SIZES = {
  xs: 16,   // Small inline icons
  sm: 20,   // Compact UI
  md: 24,   // Standard (most common)
  lg: 32,   // Large emphasis
  xl: 48,   // Hero/feature icons
}

// Usage
<Home01Icon size={ICON_SIZES.md} strokeWidth={2} />
```

### Icon Selection Best Practices

1. **Recognizable metaphors** - Use universally understood symbols
2. **Consistent style** - Same stroke width throughout app
3. **Cultural sensitivity** - Avoid culture-specific symbols
4. **Action clarity** - Icons should clearly communicate their function

```typescript
// ✅ Good - clear action
<CameraIcon /> // Take photo
<TickDouble02Icon /> // Verify/Approve
<MapIcon /> // View map

// ❌ Avoid - ambiguous
<SparklesIcon /> // What does this do?
<CircleIcon /> // No clear action
```

## UI Mode Implementations

### Mode 1: Icon+Text (Default/Recommended)

**When to use:**

- Default for all UI components
- Navigation menus
- Form buttons
- Action buttons
- Settings/preferences

**Benefits:**

- Accessible to all literacy levels
- WCAG 2.1 AAA compliance
- Clear communication
- Reduces cognitive load

**Implementation:**

```tsx
// Primary Button (Icon+Text)
<button className="flex items-center gap-2 h-11 px-4 rounded-lg bg-primary text-white">
  <CameraIcon size={24} />
  <span className="text-base font-medium">{t('common.takePhoto')}</span>
</button>

// Navigation Item (Icon+Text)
<Link
  href="/reports"
  className="flex items-center gap-3 h-12 px-4 rounded-lg hover:bg-gray-100"
>
  <MapIcon size={24} />
  <span className="text-base">{t('navigation.reports')}</span>
</Link>

// Card Action (Icon+Text)
<div className="flex items-center gap-2 text-sm text-gray-600">
  <TickDouble02Icon size={20} />
  <span>{t('report.verify')}</span>
</div>
```

### Mode 2: Icon-Only (Specific Contexts)

**When to use:**

- Space-constrained mobile UI
- Toolbar quick actions
- Floating action buttons
- Icon grids/launchers
- When paired with visible labels nearby

**Requirements:**

- ✅ Must include `aria-label` or `aria-labelledby`
- ✅ Must include tooltip on hover/long-press
- ✅ Must meet 44px touch target minimum
- ✅ Icons must be universally recognizable

**Implementation:**

```tsx
'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CameraIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

// Icon-only button with tooltip
export function IconButton() {
  const t = useTranslations('common');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center"
            aria-label={t('takePhoto')}
          >
            <CameraIcon size={24} className="text-white" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('takePhoto')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Floating Action Button (Icon-only)
export function FAB() {
  const t = useTranslations('common');

  return (
    <button
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary shadow-lg flex items-center justify-center"
      aria-label={t('createReport')}
    >
      <CameraIcon size={28} className="text-white" />
    </button>
  );
}

// Icon grid (Icon-only with labels below)
export function ActionGrid() {
  const t = useTranslations('actions');

  return (
    <div className="grid grid-cols-4 gap-4">
      <button className="flex flex-col items-center gap-2" aria-label={t('report')}>
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
          <CameraIcon size={28} className="text-primary" />
        </div>
        <span className="text-xs text-center">{t('report')}</span>
      </button>
      {/* More actions */}
    </div>
  );
}
```

## Color & Contrast

**WCAG 2.1 AA Requirements:**

- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

```typescript
// Color palette with WCAG AA compliance
const colors = {
  // Primary (ensure AA contrast on white)
  primary: {
    DEFAULT: '#16a34a', // green-600
    foreground: '#ffffff', // white text
  },

  // Status colors
  success: '#22c55e', // green-500
  warning: '#f59e0b', // amber-500
  error: '#ef4444', // red-500

  // Text
  foreground: '#0f172a', // slate-900 (primary text)
  muted: '#64748b', // slate-500 (secondary text)
  'muted-foreground': '#94a3b8', // slate-400 (tertiary)
};
```

## Responsive Typography

```typescript
// Mobile-first typography scale
const typography = {
  // Display
  'display-lg': 'text-3xl sm:text-4xl lg:text-5xl font-bold',
  'display-md': 'text-2xl sm:text-3xl lg:text-4xl font-bold',

  // Headings
  h1: 'text-2xl sm:text-3xl font-bold',
  h2: 'text-xl sm:text-2xl font-bold',
  h3: 'text-lg sm:text-xl font-semibold',
  h4: 'text-base sm:text-lg font-semibold',

  // Body
  'body-lg': 'text-base sm:text-lg',
  body: 'text-sm sm:text-base',
  'body-sm': 'text-xs sm:text-sm',

  // UI
  button: 'text-sm sm:text-base font-medium',
  label: 'text-sm font-medium',
  caption: 'text-xs text-muted-foreground',
};
```

## Component Examples

### Navigation Bar (Icon+Text Mode)

```tsx
'use client';

import { Home01Icon, MapIcon, SettingsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const t = useTranslations('navigation');
  const pathname = usePathname();

  const items = [
    { href: '/', icon: Home01Icon, label: t('home') },
    { href: '/map', icon: MapIcon, label: t('map') },
    { href: '/settings', icon: SettingsIcon, label: t('settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-4 min-h-[56px] min-w-[64px]',
                isActive ? 'text-primary' : 'text-gray-600'
              )}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### Report Card (Mixed Mode)

```tsx
'use client';

import { MapPinIcon, CalendarIcon, TickDouble02Icon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

export function ReportCard({ report }) {
  const t = useTranslations('report');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Image */}
      <img
        src={report.photo_url}
        alt={t('reportImage')}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />

      {/* Metadata (Icon+Text) */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPinIcon size={16} />
          <span>{report.location_label}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarIcon size={16} />
          <span>{formatDate(report.created_at)}</span>
        </div>
      </div>

      {/* Note */}
      <p className="text-sm text-gray-800 mb-3 line-clamp-2">{report.note}</p>

      {/* Actions (Icon+Text buttons) */}
      <div className="flex gap-2">
        <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-300 flex-1">
          <TickDouble02Icon size={20} />
          <span className="text-sm font-medium">{t('verify')}</span>
        </button>
      </div>
    </div>
  );
}
```

### Quick Actions (Icon-only with tooltips)

```tsx
'use client';

import { ShareIcon, FlagIcon, BookmarkIcon } from '@hugeicons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';

export function QuickActions({ reportId }) {
  const t = useTranslations('actions');

  const actions = [
    { icon: ShareIcon, label: t('share'), onClick: () => {} },
    { icon: BookmarkIcon, label: t('save'), onClick: () => {} },
    { icon: FlagIcon, label: t('flag'), onClick: () => {} },
  ];

  return (
    <TooltipProvider>
      <div className="flex gap-1">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Tooltip key={action.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={action.onClick}
                  className="h-11 w-11 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  aria-label={action.label}
                >
                  <Icon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
```

## Form Patterns

### Input with Icon (Icon+Text)

```tsx
'use client';

import { SearchIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

export function SearchInput() {
  const t = useTranslations('common');

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <SearchIcon size={20} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={t('search')}
        className="w-full h-12 pl-11 pr-4 rounded-lg border border-gray-300 text-base"
      />
    </div>
  );
}
```

### Select with Icon (Icon+Text)

```tsx
'use client';

import { Category02Icon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

export function CategorySelect() {
  const t = useTranslations('report');

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Category02Icon size={16} />
        <span>{t('category')}</span>
      </label>

      <select className="w-full h-12 px-4 rounded-lg border border-gray-300 text-base">
        <option value="">{t('selectCategory')}</option>
        <option value="waste">{t('categories.waste')}</option>
        <option value="drainage">{t('categories.drainage')}</option>
      </select>
    </div>
  );
}
```

## Accessibility Checklist

### Required for ALL Components

- ✅ Keyboard navigation support
- ✅ Focus indicators (outline on focus)
- ✅ Screen reader labels (aria-label, aria-labelledby)
- ✅ Semantic HTML (button, nav, article, etc.)
- ✅ Color contrast (WCAG AA minimum)
- ✅ Touch target size (44×44px minimum)
- ✅ Error messages in forms
- ✅ Loading states communicated

### Icon-Only Components Checklist

- ✅ `aria-label` on buttons
- ✅ Tooltip on hover/long-press
- ✅ Alternative text representation
- ✅ Icon universally recognizable
- ✅ Grouped logically (ARIA landmarks)

## Testing for Accessibility

```bash
# Run axe-core checks in E2E tests
pnpm test:e2e

# Manual checks:
# 1. Keyboard navigation - Tab through all interactive elements
# 2. Screen reader - Test with VoiceOver (Mac) or TalkBack (Android)
# 3. Touch targets - Verify 44px minimum on mobile device
# 4. Color blindness - Use browser DevTools color vision simulator
# 5. Low vision - Test at 200% zoom
```

## Progressive Enhancement

```tsx
// Example: Enhanced features when online
'use client';

import { useEffect, useState } from 'react';

export function ReportButton() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <button className="flex items-center gap-2 h-11 px-4">
      <CameraIcon size={24} />
      <span>{isOnline ? 'Submit Report' : 'Save Draft (Offline)'}</span>
    </button>
  );
}
```

## Summary: Icon+Text vs Icon-Only Decision Matrix

| Context                | Recommended Mode             | Rationale                    |
| ---------------------- | ---------------------------- | ---------------------------- |
| Primary navigation     | Icon+Text                    | Universal accessibility      |
| Form buttons           | Icon+Text                    | Clear action communication   |
| Card actions           | Icon+Text                    | Reduces confusion            |
| Settings/preferences   | Icon+Text                    | Complex options need clarity |
| Toolbar quick actions  | Icon-Only (with tooltip)     | Space efficiency             |
| Floating action button | Icon-Only (with aria-label)  | Single primary action        |
| Icon grid launchers    | Icon-Only (with label below) | Visual organization          |
| Mobile bottom nav      | Icon+Text                    | Primary navigation clarity   |

**Default Rule:** When in doubt, use Icon+Text mode. Only use Icon-Only when space is severely constrained AND you provide proper aria-labels and tooltips.
