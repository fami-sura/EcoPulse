# ecoPulse - Project Context

**Last Updated:** 2025-12-23  
**Sprint:** 1 (COMPLETE) | Sprint 2 Epic 2.1 (COMPLETE) | Sprint 2 Epic 2.2 In Progress

---

## Project Overview

**ecoPulse** is a distributed environmental action platform enabling African communities to report, verify, and coordinate resolution of environmental issues through community-driven verification and NGO coordination.

### Key Design Principles

- **Africa-First Design:** Icon-driven UI for low-literacy users, offline-first considerations
- **Mobile-First:** 320px primary breakpoint, 44x44px touch targets (WCAG 2.1 AA)
- **Community Motivation:** Tangible impact metrics (NOT gamification points/badges)
- **Privacy-First:** EXIF stripping on all photos, no GPS metadata leaks

---

## Tech Stack

| Layer                | Technology              | Version         |
| -------------------- | ----------------------- | --------------- |
| **Framework**        | Next.js                 | 16.0.10         |
| **React**            | React                   | 19.2.1          |
| **Language**         | TypeScript              | 5.x             |
| **Database**         | Supabase (PostgreSQL)   | Latest          |
| **ORM/Client**       | Supabase Client         | @supabase/ssr   |
| **UI Components**    | Shadcn UI + Radix UI    | Latest          |
| **Icons**            | Hugeicons               | 1.1.2           |
| **Styling**          | Tailwind CSS            | 4.x             |
| **Maps**             | Leaflet + React-Leaflet | 1.9.4 / 5.0.0   |
| **State**            | Zustand                 | 5.0.9           |
| **Forms**            | React Hook Form + Zod   | 7.69.0 / 4.2.1  |
| **Image Processing** | Sharp                   | 0.34.5          |
| **Testing**          | Vitest + Playwright     | 4.0.16 / 1.57.0 |
| **Package Manager**  | pnpm                    | 10.x            |

---

## Project Structure

```
ecoPulse/
├── app/                      # Next.js App Router
│   ├── actions/              # Server Actions
│   │   └── uploadPhoto.ts    # Photo upload with EXIF stripping
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/
│   ├── map/                  # Map components
│   │   ├── BaseMap.tsx       # Leaflet base map (client)
│   │   ├── IssueMarker.tsx   # Custom Hugeicons markers
│   │   └── index.ts
│   └── ui/                   # Shadcn UI components
├── hooks/
│   ├── usePhotoUpload.ts     # Photo upload hook
│   └── index.ts
├── lib/
│   ├── supabase/             # Supabase clients
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server Component client
│   │   ├── admin.ts          # Admin client (service role)
│   │   ├── database.types.ts # Generated types
│   │   └── index.ts
│   └── utils.ts              # Utility functions
├── stores/                   # Zustand stores
│   ├── mapStore.ts           # Map state
│   ├── authStore.ts          # Auth state
│   ├── navigationStore.ts    # Navigation UI state
│   └── index.ts
├── e2e/                      # Playwright E2E tests
├── middleware.ts             # Auth session refresh
├── vitest.config.ts          # Unit test config
├── playwright.config.ts      # E2E test config
└── .env.local                # Environment variables
```

---

## Coding Standards

### TypeScript

- **Strict mode enabled** - No `any` types unless absolutely necessary
- **Explicit return types** on exported functions
- **Use database types** from `@/lib/supabase/database.types`

### React Components

- **Server Components by default** - Only use `'use client'` when needed
- **Async params in Next.js 16** - Always `await params` and `await searchParams`
- **Icons:** Use Hugeicons only, 24x24px default, include `aria-label` for accessibility

### Server Actions

- **File path:** `/app/actions/[name].ts`
- **Return type:** `{ success: boolean, data?: T, error?: string }`
- **Always validate inputs** with Zod schemas

### State Management

- **Server state:** Supabase queries in Server Components
- **Client state:** Zustand stores (map, auth, navigation)
- **Form state:** React Hook Form with Zod validation

### Internationalization (i18n)

- **Framework:** next-intl v4.x (NFR75-77)
- **Messages:** `/messages/en.json` (nested namespaces)
- **Locale routing:** `/app/[locale]/...` with `localePrefix: 'as-needed'`
- **ALL UI text must use translation keys** - never hardcode strings

### Testing

- **Unit tests:** `*.test.ts` files co-located with source
- **E2E tests:** `/e2e/*.spec.ts`
- **Run before commit:** Pre-commit hook runs lint-staged
- **Run before push:** Pre-push hook runs type-check

---

## Database Schema

### Tables

- `users` - User profiles (extends auth.users)
- `issues` - Environmental issue reports
- `verifications` - Second-person verifications
- `points_history` - Audit trail of point transactions

### Key Constraints

- **Second-person verification:** `verifier_id != reporter_id` (database trigger)
- **RLS enabled:** All tables have Row Level Security policies
- **GiST index:** `ll_to_earth(lat, lng)` for geospatial queries

### Enums

```typescript
type IssueCategory = 'waste' | 'drainage';
type IssueSeverity = 'low' | 'medium' | 'high';
type IssueStatus = 'pending' | 'verified' | 'in_progress' | 'resolved';
type UserRole = 'member' | 'ngo_coordinator' | 'government_staff' | 'admin';
```

---

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx

# Optional (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

---

## Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint check
pnpm type-check       # TypeScript check

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Watch mode
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # E2E with UI

# Code Quality
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
```

---

## Sprint 0 Deliverables ✅

- [x] Database schema with RLS policies
- [x] Supabase client configuration (browser, server, admin)
- [x] Leaflet map with custom Hugeicons markers
- [x] Photo upload pipeline with EXIF stripping
- [x] CI/CD pipeline (GitHub Actions)
- [x] Test infrastructure (Vitest + Playwright)
- [x] Zustand stores (map, auth, navigation)
- [x] React Hook Form setup
- [x] **Internationalization (i18n)** - next-intl with English translations

---

## Sprint 1 Deliverables ✅

### Epic 1.1: Responsive Navigation & Layout (8 points) ✅

- [x] **Story 1.1.1** Desktop Navigation Bar (3 pts)
  - Component: `/components/navigation/DesktopNav.tsx`
  - Logo + nav items (Map, Reports, Actions, Profile)
  - 44x44px touch targets, sticky positioning
- [x] **Story 1.1.2** Mobile Hamburger Menu (3 pts)
  - Component: `/components/navigation/MobileMenu.tsx`
  - Icon-only navigation (no text labels)
  - Radix Dialog with slide animation, 56x56px touch targets
- [x] **Story 1.1.3** Role-Based Menu Visibility (2 pts)
  - Store: `/stores/authStore.ts`
  - Role-based rendering (anonymous, member, NGO, gov)

### Epic 1.2: Interactive Map with Clustering & Filters (13 points) ✅

- [x] **Story 1.2.1** Basic Leaflet Map Setup (3 pts)
  - Components: `/components/map/IssueMap.tsx`, `IssueMapClient.tsx`
  - Geolocation with Lagos fallback, zoom controls
- [x] **Story 1.2.2** Display Issue Pins on Map (5 pts)
  - Action: `/app/actions/getMapIssues.ts`
  - Component: `/components/map/IssueMarker.tsx`
  - Status-based colors (gray/green/blue/resolved)
- [x] **Story 1.2.3** Client-Side Pin Clustering (3 pts)
  - Component: `/components/map/ClusteredMarkers.tsx`
  - react-leaflet-cluster integration
- [x] **Story 1.2.4** Map Filters UI (3 pts)
  - Component: `/components/map/MapFilters.tsx`
  - Category/Status/Date filters
  - Mobile sheet + desktop sidebar, URL sync

### Epic 1.3: 60-Second Report Submission Flow (22 points) ✅

- [x] **Story 1.3.1** Floating Action Button (2 pts)
  - Component: `/components/report/ReportFAB.tsx`
  - Camera icon, 56x56px FAB
- [x] **Story 1.3.2** Photo Capture & EXIF Stripping (5 pts)
  - Component: `/components/report/PhotoCapture.tsx`
  - Action: `/app/actions/uploadPhoto.ts`
  - Sharp EXIF strip, 1-5 photos, retry logic
- [x] **Story 1.3.3a** Auto-Location Detection (3 pts)
  - Component: `/components/report/LocationDetector.tsx`
  - Geolocation API + Nominatim reverse geocoding
- [x] **Story 1.3.3b** Map Pin Adjustment & Search (5 pts)
  - Component: `/components/report/LocationPicker.tsx`
  - Draggable marker, address search autocomplete
- [x] **Story 1.3.4** Icon-Based Category Selection (2 pts)
  - Component: `/components/report/CategorySelector.tsx`
  - Icon-only cards (waste/drainage), 100x100px targets
- [x] **Story 1.3.5** Visual Severity Indicator (2 pts)
  - Component: `/components/report/SeveritySelector.tsx`
  - Emoji faces only (smile/neutral/sad)
- [x] **Story 1.3.6** Report Submission & Confirmation (5 pts)
  - Component: `/components/report/ReportForm.tsx`
  - Action: `/app/actions/createReport.ts`
  - Retry mechanism, optimistic UI, success/error states

### Epic 1.4: User Authentication & Profile (6 points - 1.4.4 deferred) ✅

- [x] **Story 1.4.1** Email/Password Signup & Login (3 pts)
  - Components: `/components/auth/LoginForm.tsx`, `SignupForm.tsx`
  - React Hook Form + Zod validation
- [x] **Story 1.4.2** Magic Link Authentication (2 pts)
  - Component: `/components/auth/MagicLinkForm.tsx`
  - Supabase OTP with rate limiting
- [x] **Story 1.4.3** Anonymous to Authenticated Conversion (3 pts)
  - Action: `/app/actions/claimAnonymousReports.ts`
  - Session ID matching, retroactive point credit

**Sprint 1 Total:** 49 story points completed

---

## Sprint 2 Epic 2.1 Deliverables ✅ (December 23, 2025)

### Epic 2.1: Community Verification Flow (27 points) ✅

- [x] **Story 2.1.1** Verification Button & UI Entry Point (3 pts)
  - Component: `/components/verification/VerifyButton.tsx`
  - Session-based self-verification blocking (7-day session expiry)
  - 15/15 unit tests passing
- [x] **Story 2.1.2** Verification Photo Capture (3 pts)
  - Component: `/components/verification/VerificationModal.tsx`
  - Screenshot detection, geolocation integration
  - Photo upload with EXIF stripping
- [x] **Story 2.1.3** Verification Context Notes (3 pts)
  - Component: `/components/verification/VerificationModal.tsx`
  - 500-character limit, distance validation (500m threshold)
  - Auto-capture GPS coordinates
- [x] **Story 2.1.4** Create Verification Server Action (6 pts)
  - Action: `/app/actions/createVerification.ts`
  - Atomic 2-verification threshold with race condition prevention
  - Self-verification blocking (auth + session-based)
  - Duplicate verification prevention
- [x] **Story 2.1.5** Multi-Verifier Display (3 pts)
  - Component: `/components/verification/VerificationList.tsx`
  - Horizontal photo gallery with lightbox support
  - Relative timestamps, verifier profiles
- [x] **Story 2.1.6** Verification Badge on Map (3 pts)
  - Component: `/components/map/IssueMarker.tsx`
  - Status-based icons (pending/verified/resolved)
  - "Verified Only" filter in MapFilters
  - Updated mapStore with verifiedOnly state
- [x] **Story 2.1.7** Email Notification Preferences (3 pts)
  - Page: `/app/[locale]/profile/settings/page.tsx`
  - Auto-save toggles for verified reports, action cards, monthly summary
  - Database schema: email preference columns added to users table
- [x] **Story 2.1.8** Verification Notifications (3 pts)
  - Service: `/lib/email/sendVerificationEmail.ts`
  - React Email template: `/emails/VerificationNotification.tsx`
  - Resend API integration with preference checking

**Epic 2.1 Total:** 27 story points completed

### Technical Infrastructure Updates ✅

- **Database Migrations Applied:**
  - `add_verification_geolocation` - Added lat/lng columns to verifications
  - `add_user_email_preferences` - Added email preference columns to users
  - `create_verification_spam_log` - Created spam monitoring table
  - `add_verification_rls_policies` - Created RLS policies for verifications
  - `create_verification_photos_storage_bucket` - Created verification-photos bucket

- **Test Suite Status:**
  - ✅ 8/8 test files passing
  - ✅ 118/118 tests passing
  - ✅ TypeScript compilation: No errors
  - ✅ Fixed next-intl module resolution in vitest
  - ✅ All MobileMenu tests updated for role-based visibility

- **Email Service Integration:**
  - Resend API configured with React Email templates
  - Email preferences system with auto-save toggles
  - Verification notification emails with preference checking

---

## i18n Usage Patterns (CRITICAL - NFR75-77)

**⚠️ NEVER hardcode UI text. Always use translation keys.**

### Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('report');
  return <h1>{t('title')}</h1>;
}
```

### Client Components

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function ReportButton() {
  const t = useTranslations('common');
  return <button>{t('submit')}</button>;
}
```

### With Variables (Interpolation)

```typescript
// In messages/en.json: "showing": "Showing {count} of {total} issues"
t('map.filters.showing', { count: 23, total: 150 });
```

### Pluralization

```typescript
// In messages/en.json: "reports": "{count, plural, =0 {No reports} =1 {# report} other {# reports}}"
t('reports', { count: 5 }); // "5 reports"
```

### Translation Namespaces

- `common` - Shared UI strings (submit, cancel, loading)
- `navigation` - Menu items (map, myReports, actions)
- `report` - Report flow strings
- `auth` - Authentication strings
- `map` - Map UI strings
- `errors` - Error messages

### Adding New Translations

1. Add key to `/messages/en.json` under appropriate namespace
2. Use in component with `t('namespace.key')` or `useTranslations('namespace')`
3. Never add text directly to JSX

---

## Sprint 2 Status

**Theme:** Verification, Profiles & UX Polish

**Epic 2.1: Community Verification Flow** ✅ COMPLETE (27 points)

- All 8 stories (2.1.1 - 2.1.8) implemented and tested
- Verification system with photo proof + context notes
- 2-verification threshold with atomic race condition prevention
- Session-based self-verification blocking (7-day expiry)
- Email notifications with preference system
- Full test coverage: 118/118 tests passing

**Epic 2.2: User Profiles & Impact Metrics** 🔄 IN PROGRESS

- Story 1.5.1: Points System Foundation (deferred from Sprint 1)
- Story 1.4.4: User Profile Display (deferred from Sprint 1)
- Story 2.2.2: Tangible Impact Metrics
- Story 2.2.3: Community Celebration Messaging

**Epic 2.3: Basic Flagging System** ⏳ PENDING

- Spam/abuse reporting with admin moderation

---

## API Patterns

### Server Actions (Preferred for Mutations)

```typescript
'use server';

export async function createIssue(formData: FormData) {
  const supabase = await createClient();
  // ... validation and insert
  return { success: true, data: issue };
}
```

### Data Fetching (Server Components)

```typescript
export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('issues').select('*');
  return <IssueList issues={data} />;
}
```

---

## Important Files

| File                                                     | Purpose                                    |
| -------------------------------------------------------- | ------------------------------------------ |
| [middleware.ts](middleware.ts)                           | Auth session refresh + i18n routing        |
| [i18n/request.ts](i18n/request.ts)                       | next-intl request configuration            |
| [i18n/routing.ts](i18n/routing.ts)                       | Locale routing config + navigation exports |
| [messages/en.json](messages/en.json)                     | English translations                       |
| [lib/supabase/server.ts](lib/supabase/server.ts)         | Server-side Supabase client                |
| [app/actions/uploadPhoto.ts](app/actions/uploadPhoto.ts) | Photo upload with EXIF stripping           |
| [components/map/BaseMap.tsx](components/map/BaseMap.tsx) | Leaflet map component                      |
| [stores/authStore.ts](stores/authStore.ts)               | Auth state + session ID                    |
