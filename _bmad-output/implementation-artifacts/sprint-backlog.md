# EcoPulse Sprint Backlog - Sprint 1-4 (MVP)

**Project:** ecoPulse - Distributed Environmental Action Platform  
**Created:** 2025-12-18  
**Author:** Bob (Scrum Master)  
**Team:** Intermediate Full-Stack Team (1 developer, 0.5 designer, 0.25 PM)  
**Duration:** 12 weeks (4 sprints × 3 weeks)  
**Status:** Ready for Sprint 0 (Environment Setup)

---

## Executive Summary

### MVP Goal

Build a **mobile-first distributed environmental action platform** that enables African communities to report, verify, and coordinate resolution of environmental issues (waste/litter and drainage) through community-driven verification and NGO coordination.

### Success Criteria

- ✅ **Performance:** Map loads <1s (100 pins), Report submission <60s, Dashboard <2s
- ✅ **Quality:** 90% verification accuracy, <5% spam rate, WCAG 2.1 AA compliance
- ✅ **Adoption:** 500 users, 100 verified resolutions, 10 NGOs signed up (5 paying)
- ✅ **Technical:** Zero data loss, <0.1% CSV export errors, 99.9% uptime

### Africa-First Design Principles

- **Low-Literacy:** Icon-driven UI, visual severity indicators, photo-first reporting
- **Offline-First:** Local storage, SMS fallbacks, sync when online
- **Mobile-First:** 320px-1023px primary target, 3G/4G optimization
- **Community Motivation:** Tangible impact metrics (NOT gamification points/badges)

### Technical Foundation

- **Stack:** Next.js 16, React 19.2, Supabase, Drizzle ORM, Leaflet, Hugeicons
- **Patterns:** Server Actions, Zustand state, React Hook Form, RLS policies
- **Testing:** Vitest + Playwright + axe-core, CI/CD with GitHub Actions
- **Deployment:** Vercel (frontend) + Supabase Cloud (backend)

---

## Sprint Overview

| Sprint        | Duration              | Theme                   | Stories | Story Points | Key Deliverables                                      |
| ------------- | --------------------- | ----------------------- | ------- | ------------ | ----------------------------------------------------- |
| **Sprint 0**  | Week 0 (Pre-Sprint 1) | Environment Setup       | 5       | 22           | Database, Supabase, Leaflet, Photo pipeline, CI/CD    |
| **Sprint 1**  | Weeks 1-3             | Core Reporting + Map    | 17      | 52           | Report flow, Map, Auth, Photo upload, 2 categories    |
| **Sprint 2**  | Weeks 4-6             | Verification + Profiles | 19      | 57           | Verification, Profiles, Email prefs, Points, Flagging |
| **Sprint 3**  | Weeks 7-9             | NGO Dashboard + Actions | 13      | 42           | NGO Dashboard, Action Cards, CSV                      |
| **Sprint 4A** | Weeks 10-12           | Performance + Security  | 8       | 37           | Performance, Security, Monitoring                     |
| **Sprint 4B** | Weeks 13-15           | API + Compliance        | 13      | 45           | API (split story), Accessibility, CCPA Compliance     |
| **Total**     | 16 weeks              | MVP Complete            | **70**  | **241**      | Production-ready platform                             |

---

## Story Point Scale (Fibonacci)

- **1 point:** < 4 hours (simple component, basic form field)
- **2 points:** 4-8 hours (moderate complexity, single feature)
- **3 points:** 1-2 days (complex feature, multiple components)
- **5 points:** 2-3 days (epic feature, integration work)
- **8 points:** 3-5 days (major feature, cross-cutting concerns)
- **13 points:** 1 week+ (architectural work, complex integration)

---

## Definition of Done (All Sprints)

### Code Quality

- ✅ TypeScript strict mode with no errors
- ✅ ESLint passes with no warnings
- ✅ Unit tests written (80% coverage target)
- ✅ E2E tests for critical paths (Playwright)
- ✅ Code reviewed and approved by peer/PM

### Functionality

- ✅ Acceptance criteria met (all scenarios tested)
- ✅ Works on mobile (320px-768px) and desktop (1024px+)
- ✅ Tested on Chrome, Safari, Firefox (last 2 versions)
- ✅ No console errors or warnings

### Performance

- ✅ Lighthouse score >90 (performance, accessibility, best practices)
- ✅ Page load <2s on 4G mobile
- ✅ No layout shifts (CLS <0.1)

### Accessibility

- ✅ WCAG 2.1 AA compliant (axe-core validation)
- ✅ Keyboard navigable (all interactive elements)
- ✅ Screen reader tested (VoiceOver/NVDA)
- ✅ Color contrast 4.5:1 minimum

### Deployment

- ✅ Deployed to Vercel preview environment
- ✅ Database migrations applied (Supabase)
- ✅ Supabase RLS policies tested
- ✅ Environment variables configured

---

# Sprint 0: Environment Setup (Week 0 - Pre-Sprint 1)

**Goal:** Set up foundational infrastructure required for all Sprint 1 stories - database schema, Supabase client, map library, and photo processing pipeline.

**Capacity:** 19 story points (1 week setup sprint)

**Why Sprint 0:** Winston (Architect) identified that Sprint 1 stories depend on foundational setup that cannot be implemented in parallel with feature development. This sprint eliminates blockers.

**Key Deliverables:**

- PostgreSQL database schema with RLS policies
- Supabase client configured for Next.js 16 SSR
- Leaflet map library with custom Hugeicons markers
- Photo upload pipeline with EXIF stripping

---

## Epic 0.1: Database & Backend Foundation

**Epic Goal:** Create database schema, RLS policies, Supabase client configuration, and CI/CD pipeline before any Server Actions can be written.

**Total Points:** 14 (includes CI/CD pipeline setup)

### Story 0.1: Database Schema & Migrations Setup

**As a** developer  
**I want** database tables and RLS policies defined  
**So that** I can implement Server Actions for reports, users, and verifications

**Acceptance Criteria:**

- [ ] Create Supabase migration file: `supabase/migrations/001_initial_schema.sql`
- [ ] Define `users` table:
  - Columns: id (UUID, PK), email, username, avatar_url, role (enum: 'member', 'ngo_coordinator', 'government_staff', 'admin'), points (integer, default: 0), anonymous_reports_migrated (boolean, default: false), created_at, updated_at
  - Indexes: email (unique), username (unique), role
- [ ] Define `issues` table:
  - Columns: id (UUID, PK), user_id (UUID, FK to users, nullable), session_id (text, nullable for anonymous), photos (text[], array), lat (float8), lng (float8), address (text), category (enum: 'waste', 'drainage'), severity (enum: 'low', 'medium', 'high'), note (text, nullable), status (enum: 'pending', 'verified', 'in_progress', 'resolved'), is_flagged (boolean, default: false), created_at, updated_at
  - Indexes: GiST(lat, lng) for geospatial queries, (user_id, created_at), (status, created_at), (category, status)
- [ ] Define `points_history` table:
  - Columns: id (UUID, PK), user_id (UUID, FK to users), amount (integer), reason (text), created_at
  - Indexes: (user_id, created_at)
- [ ] Create RLS policies:
  - `select_issues_public`: Anyone can view non-flagged issues
  - `insert_issues_authenticated`: Authenticated users can insert with user_id
  - `insert_issues_anonymous`: Anonymous users can insert with session_id
  - `update_issues_owner`: Only owner or admin can update
  - `select_users_public`: Anyone can view public profile fields (username, avatar_url, points)
  - `update_users_self`: Users can only update their own profile
- [ ] Run migration: `npx supabase migration up`
- [ ] Verify schema in Supabase dashboard
- [ ] **Test RLS policies:** Create test script to verify multi-org isolation:
  - User from Org A cannot query issues with `org_id = 'org-b'`
  - Anonymous user can insert with `session_id` but not with `user_id`
  - Authenticated user cannot update another user's profile

**Technical Notes:**

- Migration file location: `/supabase/migrations/001_initial_schema.sql`
- GiST index syntax:
  ```sql
  CREATE INDEX idx_issues_location ON issues USING GIST (
    ll_to_earth(lat, lng)
  );
  ```
- RLS policy example:

  ```sql
  CREATE POLICY "select_issues_public" ON issues
    FOR SELECT USING (is_flagged = false);

  CREATE POLICY "insert_issues_authenticated" ON issues
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```

- Enum types:
  ```sql
  CREATE TYPE user_role AS ENUM ('member', 'ngo_coordinator', 'government_staff', 'admin');
  CREATE TYPE issue_category AS ENUM ('waste', 'drainage');
  CREATE TYPE issue_severity AS ENUM ('low', 'medium', 'high');
  CREATE TYPE issue_status AS ENUM ('pending', 'verified', 'in_progress', 'resolved');
  ```

**Dependencies:** None (foundational)

**Story Points:** 8

---

### Story 0.2: Supabase Client Configuration for Next.js 16

**As a** developer  
**I want** Supabase client configured with SSR support  
**So that** I can query the database from Server Components and Server Actions

**Acceptance Criteria:**

- [ ] Install dependencies: `npm install @supabase/ssr @supabase/supabase-js`
- [ ] Create environment variables in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)
- [ ] Create Supabase client utility: `/lib/supabase/client.ts`
  - Client-side client (browser)
  - Server-side client (Server Components)
  - Server Action client (with cookies)
- [ ] Create middleware: `/middleware.ts`
  - Refresh Supabase session on every request
  - Attach user session to request context
- [ ] Create Supabase Storage buckets:
  - `issue-photos` bucket (public read, authenticated write)
  - `voice-notes` bucket (public read, authenticated write)
  - `avatars` bucket (public read, authenticated write)
- [ ] Configure bucket RLS policies (authenticated users can upload to their folders)
- [ ] Test connection: Create test Server Component that queries `users` table
- [ ] Verify session persistence across page refreshes

**Technical Notes:**

- Client utility structure:

  ```typescript
  // /lib/supabase/client.ts
  import { createBrowserClient } from '@supabase/ssr';

  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  ```

- Server Component client:

  ```typescript
  // /lib/supabase/server.ts
  import { createServerClient } from '@supabase/ssr';
  import { cookies } from 'next/headers';

  export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
  }
  ```

- Middleware pattern:

  ```typescript
  // /middleware.ts
  import { createServerClient } from '@supabase/ssr';
  import { NextResponse } from 'next/server';

  export async function middleware(request) {
    let response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          /* ... */
        },
      }
    );

    await supabase.auth.getSession(); // Refresh session

    return response;
  }
  ```

**Dependencies:** Story 0.1 (needs database schema)

**Story Points:** 3

---

### Story 0.5: CI/CD Pipeline Setup & Test Infrastructure

**As a** development team  
**I want** automated quality gates and testing infrastructure  
**So that** we catch errors early and maintain code quality from Sprint 1 onwards

**Acceptance Criteria:**

- [ ] GitHub Actions workflow: `.github/workflows/ci.yml`
  - Trigger: On every pull request and push to main
  - Jobs: ESLint, TypeScript checks, unit tests, build verification
- [ ] ESLint configuration:
  - Strict mode enabled
  - Next.js recommended rules
  - React Hooks rules
  - TypeScript ESLint rules
  - No warnings allowed (fail CI if warnings exist)
- [ ] Husky pre-commit hooks:
  - Install: `npm install --save-dev husky lint-staged`
  - Pre-commit: Run Prettier on staged files
  - Pre-commit: Run ESLint on staged files
  - Pre-push: Run TypeScript checks
- [ ] Prettier configuration:
  - `.prettierrc`: Single quotes, 2-space indentation, semicolons
  - Format on save enabled in `.vscode/settings.json`
- [ ] Vercel preview deployments:
  - Automatic preview URL for every PR
  - Production deployment on merge to main
  - Environment variables configured (Supabase URLs, API keys)
- [ ] Test infrastructure scaffolding:
  - Vitest installed: `npm install --save-dev vitest @vitest/ui`
  - Playwright installed: `npm install --save-dev @playwright/test`
  - Sample unit test: `/lib/__tests__/utils.test.ts`
  - Sample E2E test: `/e2e/homepage.spec.ts`
  - Test scripts in `package.json`: `npm run test`, `npm run test:e2e`
- [ ] CI/CD pipeline validates:
  - All tests pass (unit + E2E)
  - ESLint passes with 0 errors, 0 warnings
  - TypeScript compiles with no errors
  - Build succeeds (Next.js production build)
- [ ] Badge in README.md: Build status from GitHub Actions
- [ ] Documentation: `/docs/CONTRIBUTING.md` with CI/CD workflow explanation

**Technical Notes:**

- GitHub Actions workflow example:

  ```yaml
  # .github/workflows/ci.yml
  name: CI

  on:
    pull_request:
      branches: [main]
    push:
      branches: [main]

  jobs:
    lint-and-test:
      runs-on: ubuntu-latest

      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '20'
            cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Run ESLint
          run: npm run lint

        - name: Run TypeScript checks
          run: npm run type-check

        - name: Run unit tests
          run: npm run test

        - name: Build project
          run: npm run build
  ```

- Husky setup:

  ```bash
  npx husky install
  npx husky add .husky/pre-commit "npx lint-staged"
  ```

- lint-staged config in `package.json`:
  ```json
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{json,md}": "prettier --write"
  }
  ```

**Dependencies:** None (foundational)

**Story Points:** 3

---

## Epic 0.2: Frontend Foundation

**Epic Goal:** Set up Leaflet map library and photo processing pipeline before feature development begins.

**Total Points:** 8

### Story 0.3: Leaflet Map Component Foundation

**As a** developer  
**I want** Leaflet and React-Leaflet installed with custom Hugeicons markers  
**So that** I can build map features in Sprint 1

**Acceptance Criteria:**

- [ ] Install dependencies: `npm install leaflet react-leaflet @hugeicons/react`
- [ ] Install types: `npm install -D @types/leaflet`
- [ ] Import Leaflet CSS in root layout: `import 'leaflet/dist/leaflet.css'`
- [ ] Create base map component: `/components/map/BaseMap.tsx` (client component)
  - Displays OpenStreetMap tiles
  - Accepts center and zoom props
  - Responsive height (100vh - header height)
  - Zoom controls, attribution
- [ ] Create custom marker component: `/components/map/IssueMarker.tsx`
  - Uses Hugeicons instead of default Leaflet markers
  - Accepts `status` prop ('pending', 'verified', 'in_progress', 'resolved')
  - Color-coded icons:
    - Pending: Gray `MapPin` icon
    - Verified: Green `MapPinHome` icon
    - In Progress: Blue `MapPinArea` icon
    - Resolved: Green `CheckCircle` icon
  - 44x44px touch target size
- [ ] Configure OpenStreetMap tile layer:
  - URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  - Attribution: `© OpenStreetMap contributors`
  - Max zoom: 19
- [ ] Test map renders on localhost with sample markers
- [ ] Verify mobile responsiveness (320px-768px)

**Technical Notes:**

- Base map component structure:

  ```typescript
  'use client';
  import { MapContainer, TileLayer } from 'react-leaflet';
  import 'leaflet/dist/leaflet.css';

  export function BaseMap({ center, zoom, children }) {
    return (
      <MapContainer center={center} zoom={zoom} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {children}
      </MapContainer>
    );
  }
  ```

- Custom marker with Hugeicons:

  ```typescript
  import { Marker } from 'react-leaflet';
  import { MapPin, CheckCircle } from '@hugeicons/react';
  import { divIcon } from 'leaflet';

  export function IssueMarker({ position, status }) {
    const icon = divIcon({
      html: renderToStaticMarkup(
        <div className="relative w-11 h-11">
          {status === 'resolved' ? <CheckCircle /> : <MapPin />}
        </div>
      ),
      className: '',
    });

    return <Marker position={position} icon={icon} />;
  }
  ```

- Leaflet CSS must be imported globally (app/layout.tsx or globals.css)

**Dependencies:** None (foundational)

**Story Points:** 5

---

### Story 0.4: Photo Upload Pipeline with EXIF Stripping

**As a** developer  
**I want** a reusable Server Action for photo uploads with EXIF stripping  
**So that** all photo uploads (reports, proofs, avatars) are privacy-safe

**Acceptance Criteria:**

- [ ] Install dependency: `npm install sharp`
- [ ] Create Server Action: `/app/actions/uploadPhoto.ts`
  - Accepts: FormData with photo file
  - Validates: File type (jpg, png, heic), size (<10MB)
  - Processes with `sharp`:
    - Auto-rotate based on EXIF orientation
    - Resize to max 1920x1080 (maintain aspect ratio)
    - Compress to 85% JPEG quality
    - Strip ALL metadata: `{ exif: false, icc: false, xmp: false }`
  - Uploads to Supabase Storage with unique filename
  - Returns: `{ success: true, url: string }` or `{ success: false, error: string }`
- [ ] Error handling:
  - If EXIF stripping fails: Reject upload, return error (zero tolerance for GPS leaks)
  - If upload fails: Return error with retry suggestion
  - If validation fails: Return clear error message
- [ ] Create client-side validation hook: `/hooks/usePhotoUpload.ts`
  - Client-side file size check before upload
  - Loading state management
  - Error state display
- [ ] Unit tests:
  - Upload valid photo → success, returns URL
  - Upload photo with GPS EXIF → GPS stripped, verify with `sharp` metadata check
  - Upload oversized photo (>10MB) → rejected
  - Upload invalid file type → rejected
- [ ] Performance test: Upload completes in <5 seconds on 3G

**Technical Notes:**

- Server Action structure:

  ```typescript
  'use server';
  import sharp from 'sharp';
  import { createClient } from '@/lib/supabase/server';

  export async function uploadPhoto(formData: FormData) {
    const file = formData.get('photo') as File;

    // Validation
    if (!file) return { success: false, error: 'No file provided' };
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'File too large (max 10MB)' };
    }

    try {
      // EXIF stripping
      const buffer = await file.arrayBuffer();
      const strippedBuffer = await sharp(Buffer.from(buffer))
        .rotate() // Auto-rotate
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .withMetadata({ exif: false, icc: false, xmp: false })
        .toBuffer();

      // Upload to Supabase
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const fileName = `${user?.id || 'anon'}/${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('issue-photos')
        .upload(fileName, strippedBuffer, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('issue-photos').getPublicUrl(fileName);

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Photo upload failed:', error);
      return { success: false, error: 'Upload failed. Please try again.' };
    }
  }
  ```

- EXIF verification test:
  ```typescript
  // Test that GPS metadata is removed
  const metadata = await sharp(strippedBuffer).metadata();
  expect(metadata.exif).toBeUndefined();
  ```

**Dependencies:** Story 0.2 (needs Supabase Storage buckets)

**Story Points:** 3

---

## Sprint 0 Summary

**Total Stories:** 5  
**Total Story Points:** 22 (1.5 weeks - adjusted from 1 week to prevent foundation rush)

**Epics Breakdown:**

- Epic 0.1: Database & Backend Foundation (3 stories, 14 points) ← includes CI/CD pipeline
- Epic 0.2: Frontend Foundation (2 stories, 8 points)

**Key Deliverables:**
✅ Database schema with `issues`, `users`, `points_history` tables  
✅ RLS policies for multi-org data isolation  
✅ Supabase client configured for Next.js 16 SSR  
✅ Leaflet map with custom Hugeicons markers  
✅ Photo upload pipeline with EXIF stripping  
✅ Supabase Storage buckets created

**Dependencies Enabled:**

- Story 0.1 → Enables all Server Actions in Sprint 1
- Story 0.2 → Enables Stories 1.3.2, 1.3.7, 1.4.1 (auth/database operations)
- Story 0.3 → Enables Stories 1.2.1, 1.2.2, 1.2.3, 1.3.3a, 1.3.3b (map features)
- Story 0.4 → Enables Story 1.3.2 (photo capture)

**Testing Checklist:**

- [ ] Database migration applied successfully
- [ ] RLS policies tested with authenticated and anonymous users
- [ ] Supabase client queries work from Server Components
- [ ] Map renders with sample markers
- [ ] Photo upload strips EXIF and uploads to Supabase Storage

---

# Sprint 1: Core Reporting + Map (Weeks 1-3)

**Goal:** Enable users to report environmental issues with photo evidence, view reports on an interactive map, authenticate to earn points, and filter map by category/status.

**Capacity:** 52 story points (3 weeks × ~17 points/week)

**Story Count:** 17 stories across 4 epics

**Key Features:**

- Mobile-first responsive navigation with icon-driven UI (NO text labels)
- Interactive map with filtering and client-side clustering
- 60-second report submission flow with photo + text description
- User authentication (email/password, magic link) with comprehensive error handling
- Anonymous to authenticated conversion with retroactive credit (localStorage session ID)
- 2 categories: Waste/Litter + Drainage/Flood Risk

**Permanently Removed from Project:**

- ❌ Voice notes (Story 1.3.6) - ELIMINATED: Photos are superior for environmental reporting, eliminates MediaRecorder API complexity, saves development time

**Deferred to Sprint 2:**

- Story 1.5.1: Points System Foundation (2 points) - Moved to Sprint 2.1
- Story 1.4.4: User Profile Display (2 points) - Moved to Sprint 2.2

**Critical Implementation Notes:**

- **Icon-driven UI:** ONLY Hugeicons, NO text labels on report flow (enforced for low-literacy design)
- **44x44px touch targets:** All interactive elements meet WCAG 2.1 AA minimum
- **Error handling:** Comprehensive error scenarios + retry logic + ARIA announcements
- **Session tracking:** localStorage `session_id` for anonymous report credit (no device fingerprinting)
- **Race conditions:** Photo uploads must complete before submit button enabled

---

## Epic 1.1: Responsive Navigation & Layout

**Epic Goal:** Create mobile-first navigation with icon-driven interface (no text labels) for low-literacy users.

**Total Points:** 8

### Story 1.1.1: Desktop Navigation Bar

**As a** desktop user  
**I want** a horizontal navigation bar with clear links  
**So that** I can easily access different sections of the platform

**Acceptance Criteria:**

- [ ] Navbar displays logo (🌿 EcoPulse) on the left
- [ ] Menu items: Map, My Reports, Actions, Profile (right side)
- [ ] User avatar/login button on far right
- [ ] Active page highlighted with green underline (#059669)
- [ ] ~~Search icon opens search modal~~ **DEFERRED TO PHASE 2** (not MVP requirement)
- [ ] Responsive: collapses to hamburger menu at 1024px breakpoint
- [ ] Uses Radix UI Navigation Menu component
- [ ] Keyboard navigable (Tab, Enter, Esc)
- [ ] **Touch targets:** All clickable elements 44x44px minimum (WCAG 2.1 AA)
- [ ] Sticky positioning (stays visible on scroll, z-index: 50)

**Technical Notes:**

- Component: `/components/navigation/DesktopNav.tsx`
- Use Radix UI NavigationMenu primitive
- Icon imports: `import { Home, FileText, Zap, User, Search } from '@hugeicons/react'`
- Active state styling: `data-active` attribute with green underline

**Dependencies:** Story 0.3 (needs Hugeicons installed)

**Story Points:** 3

---

### Story 1.1.2: Mobile Hamburger Menu (Icon-Driven, No Text Labels)

**As a** mobile user with potentially low literacy  
**I want** a hamburger menu with ONLY icons  
**So that** I can navigate without needing to read text labels

**Acceptance Criteria:**

- [ ] Hamburger icon (≡) in top-left header on mobile (<1024px)
- [ ] **Touch target:** Hamburger button 44x44px minimum
- [ ] Tap opens slide-in menu from left (300px width, 300ms ease-out animation)
- [ ] **Menu items use ONLY Hugeicons (NO text labels):**
  - `Home` icon (24x24px) - Map
  - `FileText` icon (24x24px) - My Reports
  - `Zap` icon (24x24px) - Actions
  - `User` icon (24x24px) - Profile
- [ ] Each menu item is 56x56px touch target (exceeds 44px minimum)
- [ ] Active page has green background highlight (#059669 with 0.1 opacity)
- [ ] Tap outside menu closes it (backdrop overlay with `onClick` handler)
- [ ] Close button (✕) in top-right of menu (44x44px touch target)
- [ ] Smooth slide animation: `transform: translateX(-100%)` → `translateX(0)`
- [ ] Audio tooltips: **DEFERRED TO PHASE 2** (text-to-speech on tap)

**Technical Notes:**

- Component: `/components/navigation/MobileMenu.tsx`
- Use Radix UI Dialog for accessibility (focus trap, Esc key)
- Icon imports: `import { Home, FileText, Zap, User, Menu01, Cancel01 } from '@hugeicons/react'`
- Store menu open state in Zustand: `useNavigationStore({ isMenuOpen })`
- Animation: Framer Motion or CSS transitions
- **Accessibility:** Each icon button has `aria-label` for screen readers:
  ```tsx
  <button aria-label="Navigate to Map">
    <Home size={24} aria-hidden="true" />
  </button>
  ```

**Dependencies:** Story 1.1.1 (shares navigation state), Story 0.3 (Hugeicons)

**Story Points:** 3

---

### Story 1.1.3: Role-Based Menu Visibility

**As a** system  
**I want** to show/hide menu items based on user role  
**So that** anonymous users, members, NGO coordinators, and government staff see appropriate options

**Acceptance Criteria:**

- [ ] Anonymous users see: Map, Login/Signup icons only
- [ ] Authenticated members see: Map, My Reports, Actions, Profile, Logout
- [ ] NGO coordinators also see: NGO Dashboard icon (Building icon from Hugeicons)
- [ ] Government staff also see: Gov Dashboard icon (Government icon - Phase 2 placeholder)
- [ ] Role fetched from Supabase Auth JWT: `const { data: { user } } = await supabase.auth.getUser()`
- [ ] Check `users` table: `select role from users where id = auth.uid()`
- [ ] Menu updates immediately after login (no page refresh, use Zustand store)
- [ ] Loading skeleton while fetching role (avoid flash of wrong menu)

**Technical Notes:**

- Hook: `/hooks/useUserRole.ts`

  ```typescript
  export function useUserRole() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchRole = async () => {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase.from('users').select('role').eq('id', user.id).single();

          setRole(data?.role || 'member');
        }
        setLoading(false);
      };

      fetchRole();
    }, []);

    return { role, loading };
  }
  ```

- Zustand store: `useAuthStore({ user, role, isAuthenticated })`
- Role enum: `type UserRole = 'member' | 'ngo_coordinator' | 'government_staff' | 'admin'`
- **Performance Optimization:** Cache role in Zustand after first fetch to avoid repeated database queries:
  ```typescript
  // Only fetch if role not already cached
  if (!role && user) {
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
    setRole(data?.role);
  }
  ```

**Dependencies:** Story 1.1.1, 1.1.2, Story 0.2 (Supabase client), Story 1.4.1 (authentication)

**Story Points:** 2

---

## Epic 1.2: Interactive Map with Clustering & Filters

**Epic Goal:** Display environmental issue reports on an interactive Leaflet map with client-side clustering and filtering by category/status.

**Total Points:** 13

### Story 1.2.1: Basic Leaflet Map Setup

**As a** user  
**I want** to see an interactive map centered on my location  
**So that** I can view environmental issues in my area

**Acceptance Criteria:**

- [ ] Map displays using Leaflet + OpenStreetMap tiles (configured in Story 0.3)
- [ ] Default center: User's geolocation (browser Geolocation API)
- [ ] Fallback center if geolocation denied: Lagos, Nigeria (6.5244, 3.3792)
- [ ] Initial zoom level: 13 (neighborhood view)
- [ ] Map controls: Zoom in/out buttons (44x44px touch targets), full-screen toggle
- [ ] Mobile: pinch-to-zoom, two-finger pan
- [ ] Desktop: scroll-to-zoom, click-and-drag pan
- [ ] Map height: `calc(100vh - 60px)` (100vh - header height, responsive)
- [ ] Geolocation timeout: 5 seconds (then use fallback)
- [ ] Loading skeleton while geolocation is being fetched

**Technical Notes:**

- Component: `/components/map/IssueMap.tsx` (client component with `'use client'`)
- Extends BaseMap from Story 0.3
- Geolocation API:
  ```typescript
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setCenter([6.5244, 3.3792]); // Lagos fallback
        },
        { timeout: 5000 }
      );
    }
  }, []);
  ```
- Store map center in Zustand: `useMapStore({ center, zoom })`

**Dependencies:** Story 0.3 (BaseMap component)

**Story Points:** 3

---

### Story 1.2.2: Display Issue Pins on Map

**As a** user  
**I want** to see colored pins representing issue reports  
**So that** I can visually identify report locations and status

**Acceptance Criteria:**

- [ ] Fetch issue data from Supabase `issues` table (Server Action)
- [ ] Display pins at lat/lng coordinates using IssueMarker from Story 0.3
- [ ] **Pin colors based on status:**
  - ⚪ Gray: Pending verification (status = 'pending')
  - 🟢 Green: Verified (status = 'verified')
  - 🔵 Blue: In Progress (status = 'in_progress')
  - ✅ Green checkmark: Resolved (status = 'resolved')
- [ ] Query limited to map bounds for performance:
  - Mobile (<1024px): Max 50 pins
  - Desktop (≥1024px): Max 100 pins
- [ ] Server Action: `/app/actions/getMapIssues.ts`
  - Accepts: bounds (ne_lat, ne_lng, sw_lat, sw_lng), limit
  - Returns: Array of issues with id, lat, lng, status, category
- [ ] RLS policy enforced: Only show non-flagged issues (`is_flagged = false`)
- [ ] Tap pin opens issue summary card:
  - Mobile: Bottom sheet slides up (50% screen height)
  - Desktop: Popover next to pin
- [ ] Loading spinner while fetching pins
- [ ] Error handling: "Unable to load issues. Please try again."

**Technical Notes:**

- Server Action:

  ```typescript
  'use server';
  export async function getMapIssues(bounds, limit = 50) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('issues')
      .select('id, lat, lng, status, category, photos, created_at')
      .eq('is_flagged', false)
      .gte('lat', bounds.sw_lat)
      .lte('lat', bounds.ne_lat)
      .gte('lng', bounds.sw_lng)
      .lte('lng', bounds.ne_lng)
      .limit(limit);

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  }
  ```

- Zustand store: `useMapStore({ pins, selectedPin })`
- Render markers:
  ```tsx
  {
    pins.map((issue) => (
      <IssueMarker
        key={issue.id}
        position={[issue.lat, issue.lng]}
        status={issue.status}
        onClick={() => setSelectedPin(issue)}
      />
    ));
  }
  ```

**Dependencies:** Story 1.2.1 (map setup), Story 0.1 (database schema), Story 0.2 (Supabase client), Story 0.3 (IssueMarker)

**Story Points:** 5

---

### Story 1.2.3: Client-Side Pin Clustering (Simplified)

**As a** user  
**I want** to see cluster badges when many pins are close together  
**So that** the map remains readable with hundreds of reports

**Acceptance Criteria:**

- [ ] Install dependency: `npm install react-leaflet-cluster`
- [ ] Wrap markers in `<MarkerClusterGroup>` component (client-side clustering)
- [ ] Cluster badge shows count: "23 reports"
- [ ] Cluster badge color: gray background with green text (#059669)
- [ ] Cluster badge size scales with count (small: <10, medium: 10-50, large: 50+)
- [ ] Tap cluster badge zooms in one level (reveals individual pins or smaller clusters)
- [ ] **Performance:** Client-side clustering handles up to 500 pins without lag (<16ms frame time)
- [ ] **Performance Testing:** Test with 500 pins on budget Android device (Samsung Galaxy A10 2019 or equivalent) and verify:
  - Map interactions maintain 60fps (smooth pan, zoom, cluster tap)
  - Initial render completes in <2 seconds
  - No jank or dropped frames during cluster expansion/collapse
- [ ] Mobile: max 50 pins rendered (filtering done server-side in Story 1.2.2)
- [ ] Desktop: max 100 pins rendered
- [ ] Clustering respects map zoom level (higher zoom = less clustering)
- [ ] **Note:** Server-side clustering with PostGIS deferred to Phase 2 for complexity

**Technical Notes:**

- Use `react-leaflet-cluster` library (simpler than custom PostGIS algorithm):

  ```tsx
  import MarkerClusterGroup from 'react-leaflet-cluster';

  <MarkerClusterGroup
    chunkedLoading
    maxClusterRadius={80}
    spiderfyOnMaxZoom={true}
    showCoverageOnHover={false}
  >
    {pins.map((issue) => (
      <IssueMarker key={issue.id} {...issue} />
    ))}
  </MarkerClusterGroup>;
  ```

- Custom cluster icon:
  ```typescript
  iconCreateFunction={(cluster) => {
    const count = cluster.getChildCount();
    return divIcon({
      html: `<div class="cluster-icon">${count}</div>`,
      className: 'custom-cluster',
    });
  }}
  ```
- CSS styling:
  ```css
  .cluster-icon {
    background: rgba(5, 150, 105, 0.1);
    border: 2px solid #059669;
    border-radius: 50%;
    color: #059669;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ```

**Dependencies:** Story 1.2.2 (needs pins to cluster)

**Story Points:** 3 (reduced from 5 - client-side is simpler than server-side PostGIS)

---

### Story 1.2.4: Map Filters UI (Category, Status, Date)

**As a** user (especially James discovering volunteer opportunities)  
**I want** to filter map pins by category, status, and date  
**So that** I can find specific types of issues to address

**Acceptance Criteria:**

- [ ] Filter panel displays:
  - **Mobile:** Slide-up sheet from bottom (triggered by "Filter" button in header)
  - **Desktop:** Sidebar on right side of map (always visible, 280px width)
- [ ] Filter options:
  - **Category:** All, Waste/Litter (Hugeicons `Delete02`), Drainage (Hugeicons `Droplet`)
  - **Status:** All, Pending, Verified, In Progress, Resolved
  - **Date Range:** Last 7 days, Last 30 days, Last 90 days, All Time
- [ ] Icon-driven UI: Each category/status has icon, minimal text (matches low-literacy design)
- [ ] Touch targets: Each filter button 44x44px minimum
- [ ] Multiple selection allowed for category and status (checkboxes)
- [ ] "Apply Filters" button (mobile) or auto-apply on change (desktop)
- [ ] "Clear All Filters" button resets to defaults (All, All, All Time)
- [ ] Filter state persisted in URL query params: `?category=waste&status=verified&date=30d`
- [ ] Pin count updates dynamically: "Showing 23 of 150 issues"
- [ ] Filtered query uses Server Action from Story 1.2.2 with additional params

**Technical Notes:**

- Component: `/components/map/MapFilters.tsx`
- Icon imports: `import { Delete02, Droplet, Filter, XCircle } from '@hugeicons/react'`
- Zustand store: `useMapStore({ filters: { category[], status[], dateRange } })`
- URL sync with `useSearchParams`:
  ```typescript
  const searchParams = useSearchParams();
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.category.length) params.set('category', newFilters.category.join(','));
    if (newFilters.status.length) params.set('status', newFilters.status.join(','));
    params.set('date', newFilters.dateRange);
    router.push(`/map?${params.toString()}`);
  };
  ```
- Update `getMapIssues` Server Action to accept filters:
  ```typescript
  .in('category', filters.category.length ? filters.category : ['waste', 'drainage'])
  .in('status', filters.status.length ? filters.status : ['pending', 'verified', 'in_progress', 'resolved'])
  .gte('created_at', calculateDateThreshold(filters.dateRange))
  ```
- Mobile filter sheet uses Radix UI Dialog
- **Accessibility:** Filter checkboxes have proper labels, keyboard navigable

**Dependencies:** Story 1.2.2 (needs getMapIssues Server Action to extend)

**Story Points:** 3

---

## Epic 1.3: 60-Second Report Submission Flow

**Epic Goal:** Enable users to report environmental issues in under 60 seconds with required photo, location, category, severity, and text description.

**Total Points:** 22 (Voice notes Story 1.3.6 removed - photos are superior for environmental reporting)

### Story 1.3.1: Floating Action Button (FAB) / Report Button

**As a** user  
**I want** a prominent button to start reporting an issue  
**So that** I can quickly submit a report without navigating through menus

**Acceptance Criteria:**

- [ ] Mobile: FAB (Floating Action Button) in bottom-right corner, 56x56px
- [ ] Desktop: "Report Issue" button in bottom-right corner, standard button size
- [ ] Icon: Camera (Hugeicons `camera-01`)
- [ ] Primary green color (#059669)
- [ ] Tap/click opens camera (mobile) or file picker with camera option (desktop)
- [ ] FAB floats above map (z-index: 40)
- [ ] Always visible (no scroll hiding)
- [ ] Accessible label: `aria-label="Report environmental issue"`

**Technical Notes:**

- Component: `/components/report/ReportFAB.tsx`
- Mobile: Use `<input type="file" accept="image/*" capture="environment">` to trigger camera
- Desktop: Use standard file input with camera option
- Opens modal/sheet with report form after photo selected

**Dependencies:** Story 1.2.1 (needs to float above map)

**Story Points:** 2

---

### Story 1.3.2: Photo Capture & EXIF Stripping with Error Handling

**As a** user  
**I want** to take/upload a photo of the issue  
**So that** I can provide visual evidence while protecting my location privacy

**Acceptance Criteria:**

- [ ] Mobile: Opens native camera directly via `<input type="file" accept="image/*" capture="environment">`
- [ ] Desktop: File picker with "Use Camera" and "Choose File" options
- [ ] Photo preview with crop/rotate tools (optional for MVP, can defer)
- [ ] Multiple photos supported: 1-5 photos per report
- [ ] "Add Another Photo" button after first photo (max 5 total)
- [ ] Photo size limit: 10MB per photo (client-side validation before upload)
- [ ] Calls `uploadPhoto` Server Action from Story 0.4
- [ ] Server strips ALL EXIF metadata (GPS, device info, timestamp) using `sharp`
- [ ] Compression: resize to max 1920x1080, 85% JPEG quality
- [ ] Upload to Supabase Storage: `issue-photos/{userId}/{timestamp}.jpg`
- [ ] Client-side validation: file type (jpg, png, heic, webp), size
- [ ] **Loading state:** Progress bar during upload (<5s target on 3G)
- [ ] **Error handling:**
  - File too large (>10MB): "Photo too large. Maximum 10MB per photo."
  - Invalid file type: "Please upload a valid image (JPG, PNG, HEIC, WebP)."
  - EXIF stripping failed: "Photo processing failed. Please try a different photo." (reject upload per Architecture)
  - Upload failed (network timeout): "Upload failed. Please check your connection and try again." + Retry button
  - Supabase error: "Unable to upload photo. Please try again later."
- [ ] **Retry mechanism:** If upload fails, allow user to retry without losing photo
- [ ] Success feedback: Green checkmark + "Photo uploaded" message

**Technical Notes:**

- Component: `/components/report/PhotoCapture.tsx`
- Uses `uploadPhoto` Server Action from Story 0.4
- Client-side compression (optional): Use `browser-image-compression` library before upload
- Loading state: React Hook Form `useFormStatus().pending`
- Error state: Display error message above photo input with retry button
- Retry logic:

  ```typescript
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);

    const result = await uploadPhoto(formData);

    if (!result.success) {
      setUploadError(result.error);
      // Allow retry
      return;
    }

    setPhotoUrl(result.url);
    setUploadError(null);
  };
  ```

- **Race condition prevention:** Disable "Submit Report" button until all photos finish uploading
- Store uploaded URLs in Zustand: `useReportStore({ photoUrls: [] })`

**Dependencies:** Story 1.3.1 (FAB trigger), Story 0.4 (uploadPhoto Server Action)

**Story Points:** 5

---

### Story 1.3.3a: Auto-Location Detection

**As a** user  
**I want** my location auto-detected when reporting  
**So that** I don't need to manually enter an address

**Acceptance Criteria:**

- [ ] Auto-detect location using browser Geolocation API on form open
- [ ] Request permission modal: "Allow ecoPulse to access your location?"
- [ ] Success: Display detected location with accuracy indicator ("Accurate within 20 meters")
- [ ] Store lat/lng in form state (Zustand)
- [ ] Reverse geocoding using OpenStreetMap Nominatim API (free):
  - API: `https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}`
  - Display address: "2430 Telegraph Ave, Oakland, CA 94612"
  - Rate limit compliance: 1 request/second (Nominatim policy)
- [ ] "Use Current Location" button to re-trigger geolocation (if user moves)
- [ ] **Fallback if geolocation denied:**
  - Show map centered on last known area or Lagos, Nigeria default
  - User must manually place pin (Story 1.3.3b)
  - Message: "Location access denied. Please place pin on map manually."
- [ ] **Error handling:**
  - Geolocation timeout (5s): "Unable to detect location. Please try again or place pin manually."
  - Nominatim rate limit: Use debounce (1s delay between requests)
  - Nominatim API error: Show lat/lng without address, allow manual pin placement
- [ ] Loading spinner while detecting location
- [ ] Accessibility: Screen reader announces "Location detected" or "Location detection failed"

**Technical Notes:**

- Component: `/components/report/LocationDetector.tsx`
- Geolocation API:

  ```typescript
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocation({ lat: latitude, lng: longitude, accuracy });

          // Reverse geocoding
          const address = await reverseGeocode(latitude, longitude);
          setAddress(address);
        },
        (error) => {
          setError('Unable to detect location. Please place pin manually.');
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    }
  }, []);
  ```

- Reverse geocoding with rate limit:
  ```typescript
  const reverseGeocode = useMemo(
    () =>
      debounce(async (lat, lng) => {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        return data.display_name;
      }, 1000), // 1s debounce for Nominatim rate limit
    []
  );
  ```
- Store in Zustand: `useReportStore({ lat, lng, address, accuracy })`

**Dependencies:** Story 1.3.1

**Story Points:** 3

---

### Story 1.3.3b: Map Pin Adjustment & Manual Address Search

**As a** user  
**I want** to adjust the pin location on a map or search for an address  
**So that** I can report the exact location even if auto-detection is inaccurate

**Acceptance Criteria:**

- [ ] Display small map preview (300x200px mobile, 400x300px desktop)
- [ ] Pin defaults to detected location from Story 1.3.3a
- [ ] User can drag pin to adjust location (Leaflet draggable marker)
- [ ] Dragging pin updates reverse geocoded address in real-time (debounced 1s)
- [ ] Manual search bar above map: "Search for address or place"
  - Uses Nominatim search API: `https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=5`
  - Autocomplete suggestions (dropdown with top 5 results)
  - Selecting suggestion updates pin location and address
  - Rate limit: 1 request/second (debounced search input)
- [ ] "Reset to Current Location" button (calls geolocation again)
- [ ] Map zoom level: 16 (street-level detail)
- [ ] Map controls: Zoom in/out buttons (44x44px touch targets)
- [ ] **Error handling:**
  - Search returns no results: "No results found. Please try a different search term."
  - Nominatim API error: "Search unavailable. Please use map to place pin."
  - Invalid search query (empty): Disable search button
- [ ] Loading state during search (spinner in search bar)
- [ ] Touch-friendly: Pin dragging works on mobile with touch gestures

**Technical Notes:**

- Component: `/components/report/LocationPicker.tsx`
- Uses BaseMap component from Story 0.3
- Leaflet draggable marker:

  ```tsx
  <Marker
    position={[lat, lng]}
    draggable={true}
    eventHandlers={{
      dragend: async (e) => {
        const { lat, lng } = e.target.getLatLng();
        setLocation({ lat, lng });

        // Reverse geocode new position
        const address = await reverseGeocode(lat, lng);
        setAddress(address);
      },
    }}
  />
  ```

- Search autocomplete:
  ```typescript
  const searchAddress = useMemo(
    () =>
      debounce(async (query) => {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
        );
        const results = await response.json();
        setSuggestions(results);
      }, 1000),
    []
  );
  ```
- Store final location in Zustand: `useReportStore({ lat, lng, address })`

**Dependencies:** Story 1.3.3a (provides initial location), Story 0.3 (BaseMap component)

**Story Points:** 5

---

### Story 1.3.4: Icon-Based Category Selection (No Text Labels)

**As a** user with potentially low literacy  
**I want** to select a category using ONLY icons  
**So that** I can report issues without needing to read labels

**Acceptance Criteria:**

- [ ] Display 2 category options (MVP scope):
  - 🗑️ Waste/Litter - Hugeicons `Delete02` icon (24x24px)
  - 🌊 Drainage/Flood Risk - Hugeicons `Droplet` icon (24x24px)
- [ ] **NO text labels** - icon-only cards (enforced for low-literacy design)
- [ ] Large touch-friendly cards: 100x100px minimum (exceeds 44px requirement)
- [ ] Card structure:
  - Icon centered in card (32x32px)
  - Visual-only selection indicator (no text "Selected")
  - Selected: Green border (3px solid #059669) + green background (opacity 0.1)
  - Unselected: Gray border (1px solid #E5E7EB)
- [ ] Single selection (radio button behavior)
- [ ] **Audio tooltips: DEFERRED TO PHASE 2** (text-to-speech "Waste and litter")
- [ ] Required field: cannot submit without selection
- [ ] Validation error: Red border + shake animation if not selected on submit
- [ ] **Accessibility:** Each card has `aria-label` for screen readers:
  - `<button aria-label="Report waste or litter issue">`
  - `<button aria-label="Report drainage or flood risk issue">`
- [ ] Keyboard navigable: Arrow keys to move between options, Enter to select

**Technical Notes:**

- Component: `/components/report/CategorySelector.tsx`
- Icon imports: `import { Delete02, Droplet } from '@hugeicons/react'`
- Store in Zustand: `useReportStore({ category: 'waste' | 'drainage' })`
- Validation: Zod schema `z.enum(['waste', 'drainage'])`
- Card styling:
  ```tsx
  <button
    aria-label="Report waste or litter issue"
    className={cn(
      'flex items-center justify-center w-[100px] h-[100px] rounded-lg border transition-all',
      selected
        ? 'border-[3px] border-green-600 bg-green-50'
        : 'border border-gray-200 hover:border-gray-300'
    )}
    onClick={() => setCategory('waste')}
  >
    <Delete02 size={32} color={selected ? '#059669' : '#6B7280'} />
  </button>
  ```
- Shake animation for validation error:
  ```css
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-4px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(4px);
    }
  }
  ```

**Dependencies:** Story 1.3.1, Story 0.3 (Hugeicons installed)

**Story Points:** 2

---

### Story 1.3.5: Visual Severity Indicator (Icon-Only, No Text)

**As a** user with potentially low literacy  
**I want** to indicate severity using emoji faces ONLY (no text)  
**So that** I can communicate urgency without reading "Low/Medium/High"

**Acceptance Criteria:**

- [ ] Display 3 severity options using **ONLY Hugeicons (no text labels):**
  - 😊 Low - Hugeicons `FaceSmile` icon (24x24px, green #10B981)
  - 😐 Medium - Hugeicons `FaceNeutral` icon (24x24px, amber #F59E0B)
  - 😰 High - Hugeicons `FaceSad` icon (24x24px, red #EF4444)
- [ ] **NO text labels** like "Low", "Medium", "High" (enforced for low-literacy)
- [ ] Horizontal button group (mobile and desktop)
- [ ] Each button: 60x60px minimum touch target (exceeds 44px)
- [ ] Button structure:
  - Icon centered (28x28px)
  - Selected: Colored background + white icon + scale animation (1.1x)
  - Unselected: White background + colored icon + gray border
- [ ] Single selection (radio button behavior)
- [ ] Default: Medium pre-selected (most common)
- [ ] **Audio tooltips: DEFERRED TO PHASE 2** (text-to-speech "High severity - urgent")
- [ ] Required field: defaults to Medium if not changed
- [ ] **Accessibility:** Each button has `aria-label`:
  - `<button aria-label="Low severity">`
  - `<button aria-label="Medium severity">`
  - `<button aria-label="High severity - urgent">`
- [ ] Keyboard navigable: Arrow keys or Tab to move, Enter to select

**Technical Notes:**

- Component: `/components/report/SeveritySelector.tsx`
- Icon imports: `import { FaceSmile, FaceNeutral, FaceSad } from '@hugeicons/react'`
- Store in Zustand: `useReportStore({ severity: 'low' | 'medium' | 'high' })`
- Validation: Zod schema `z.enum(['low', 'medium', 'high']).default('medium')`
- Button styling:
  ```tsx
  <button
    aria-label="High severity - urgent"
    className={cn(
      'flex items-center justify-center w-[60px] h-[60px] rounded-lg border transition-all',
      selected
        ? 'bg-red-500 border-red-600 scale-110'
        : 'bg-white border-gray-200 hover:border-red-300'
    )}
    onClick={() => setSeverity('high')}
  >
    <FaceSad size={28} color={selected ? '#FFFFFF' : '#EF4444'} strokeWidth={2} />
  </button>
  ```
- Scale animation on selection: `transition: transform 200ms ease-out`

**Dependencies:** Story 1.3.1, Story 0.3 (Hugeicons installed)

**Story Points:** 2

---

### Story 1.3.6: Report Submission & Confirmation (with Error Handling)

**As a** user completing the report flow  
**I want** to submit my report and see confirmation  
**So that** I know my report was received and will be reviewed

**Acceptance Criteria:**

- [ ] "Submit Report" button at bottom of form
- [ ] Disabled until all required fields completed:
  - At least 1 photo
  - Location selected (lat/lng)
  - Category selected
  - Severity selected
  - Text description (60 characters minimum)
- [ ] **Race condition prevention:** Wait for all photo uploads to complete before enabling submit
- [ ] On submit:
  - Show loading spinner overlay: "Submitting your report..."
  - Disable submit button (prevent double submission)
  - Call Server Action `createReport(reportData)`
  - Insert report into `reports` table (Supabase)
  - Generate anonymous `session_id` for retroactive credit (localStorage)
- [ ] **Success state:**
  - ✅ Checkmark animation (scale in + fade in)
  - "Thank you! Your report has been submitted."
  - Display report ID: "Report #12345"
  - Two action buttons:
    - "View on map" → redirects to `/` with `?report={id}` (pin highlighted)
    - "Submit another report" → clears form, stays on `/report/new`
- [ ] **Error handling (comprehensive):**
  - **Network timeout (>30s):** "Network timeout. Check connection and try again." + Retry button
  - **Validation failure:** "Please complete all required fields." + scroll to first error
  - **Supabase error (DB insert failed):** "Unable to submit report. Try again in a moment." + Retry button
  - **Photo upload incomplete:** Disable submit until all uploads done (show "Uploading photos...")
  - **Session ID generation failure:** Log error but proceed (user can still claim later with email)
  - **Generic error:** "Something went wrong. Please try again." + Retry button
- [ ] Retry mechanism:
  - Retry button re-submits same data (no form re-fill)
  - Max 3 retry attempts, then show "Still having trouble? Contact support."
- [ ] **Optimistic UI update:** Pin appears on map immediately (local state), persists after DB confirmation
- [ ] **Accessibility:**
  - Success/error announced to screen readers with `role="status"` aria-live region
  - Loading state announced: "Submitting report, please wait"
  - Focus management: Move focus to success message or error message

**Technical Notes:**

- Server Action: `app/actions/createReport.ts`
- Database insert:

  ```ts
  'use server';
  export async function createReport(reportData: ReportFormData) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          photo_urls: reportData.photoUrls,
          latitude: reportData.latitude,
          longitude: reportData.longitude,
          category: reportData.category,
          severity: reportData.severity,
          description: reportData.description,
          session_id: reportData.sessionId, // for retroactive credit
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      revalidatePath('/');
      return { success: true, reportId: data.id };
    } catch (err) {
      console.error('Report submission error:', err);
      return { success: false, error: err.message || 'Unknown error' };
    }
  }
  ```

- Optimistic update: Add report to Zustand map store before DB response
  ```ts
  const { addOptimisticReport, confirmReport } = useMapStore();
  const tempId = `temp-${Date.now()}`;
  addOptimisticReport({ ...reportData, id: tempId });
  const result = await createReport(reportData);
  if (result.success) {
    confirmReport(tempId, result.reportId);
  } else {
    removeOptimisticReport(tempId); // rollback on error
  }
  ```
- Session ID generation: `localStorage.getItem('session_id') || crypto.randomUUID()` (save to localStorage)
- **Session ID fallback:** If `crypto.randomUUID()` fails (very rare, older browsers), use fallback:
  ```typescript
  const generateSessionId = () => {
    try {
      return crypto.randomUUID();
    } catch (err) {
      // Fallback for browsers without crypto.randomUUID()
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  };
  const sessionId = localStorage.getItem('session_id') || generateSessionId();
  localStorage.setItem('session_id', sessionId);
  ```
- Form reset: `useReportStore.getState().reset()`
- Retry logic:
  ```tsx
  const [retryCount, setRetryCount] = useState(0);
  const handleSubmit = async () => {
    if (retryCount >= 3) {
      setError('Still having trouble? Contact support.');
      return;
    }
    // ... submit logic
    if (!result.success) {
      setRetryCount((prev) => prev + 1);
    }
  };
  ```
- ARIA live region for announcements:
  ```tsx
  <div role="status" aria-live="polite" className="sr-only">
    {submitting && 'Submitting report, please wait'}
    {success && 'Report submitted successfully'}
    {error && `Error: ${error}`}
  </div>
  ```

**Dependencies:** Story 1.3.1, Story 1.3.2 (photo uploads), Story 0.1 (reports table exists)

**Story Points:** 5

---

## Epic 1.4: User Authentication & Profile

**Epic Goal:** Enable users to create accounts, login, and convert anonymous reports to authenticated profiles with retroactive point credit.

**Total Points:** 8 (Story 1.4.4 deferred to Sprint 2.2)

### Story 1.4.1: Email/Password Signup & Login (with Error Handling)

**As a** user  
**I want** to create an account and login with email and password  
**So that** I can claim ownership of my reports and earn points

**Acceptance Criteria:**

- [ ] Signup form with fields: email, password, username (display name)
- [ ] Password requirements: min 8 characters, validation feedback
- [ ] Email validation: valid format, not already registered
- [ ] Username validation: 3-20 characters, alphanumeric + underscore
- [ ] Login form with fields: email, password
- [ ] "Forgot Password" link (triggers password reset email)
- [ ] Supabase Auth handles: password hashing (bcrypt), email verification, session management
- [ ] Success redirect: Returns to previous page or map home
- [ ] **Comprehensive error handling:**
  - **"Email already registered":** Show link to login page
  - **"Invalid credentials":** Clear error message, retry allowed
  - **"Email not verified":** Show "Check your email for verification link" + resend button
  - **"Weak password":** Show password strength requirements inline
  - **Network error:** "Connection failed. Check internet and try again."
  - **Supabase service down:** "Authentication service unavailable. Try again in a moment."
  - **Generic error:** "Something went wrong. Please try again."
- [ ] Loading states on submit buttons (disable while processing)
- [ ] Forms use React Hook Form + Zod validation
- [ ] **Accessibility:** keyboard navigable, screen reader labels, focus management

**Technical Notes:**

- Components: `/components/auth/SignupForm.tsx`, `/components/auth/LoginForm.tsx`
- Supabase Auth methods:

  ```typescript
  // Signup with error handling
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Email already registered. <a href="/login">Login instead</a>');
      } else if (error.message.includes('weak password')) {
        setError('Password must be at least 8 characters with uppercase, lowercase, number');
      } else {
        setError(error.message);
      }
      return;
    }

    // Success: redirect or show verification message
  } catch (err) {
    setError('Network error. Check connection and try again.');
  }

  // Login with error handling
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email or password incorrect. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Email not verified. Check your inbox or <button>resend</button>');
      } else {
        setError(error.message);
      }
      return;
    }
  } catch (err) {
    setError('Network error. Check connection and try again.');
  }
  ```

- Store session in Zustand: `useAuthStore({ user, session, error })`
- Middleware: `/middleware.ts` checks `auth.getSession()` on protected routes
- Zod schemas:
  ```ts
  const signupSchema = z.object({
    email: z.string().email('Valid email required'),
    password: z.string().min(8, 'Minimum 8 characters'),
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscore only'),
  });
  ```

**Dependencies:** None (foundational)

**Story Points:** 3

---

### Story 1.4.2: Magic Link Authentication (with Error Handling)

**As a** user  
**I want** to login using a magic link sent to my email  
**So that** I don't need to remember a password (easier for low-literacy users)

**Acceptance Criteria:**

- [ ] "Login with Magic Link" button on login page
- [ ] Input field: email address only
- [ ] Sends magic link email via Supabase Auth
- [ ] Email template: "Click here to login to ecoPulse" with button/link
- [ ] Link expires after 1 hour
- [ ] Click link → auto-login → redirect to map or previous page
- [ ] User record created automatically if email not registered (passwordless signup)
- [ ] Success message: "Check your email for login link"
- [ ] Loading state during email send (2-5 seconds)
- [ ] **Error handling:**
  - **"Email send failed":** Retry button + "Try again or use password login"
  - **"Invalid email format":** Inline validation error
  - **"Rate limit exceeded":** "Too many requests. Wait 60 seconds and try again."
  - **Link expired:** Show clear message + "Request new link" button
  - **Generic error:** "Something went wrong. Try password login instead."

**Technical Notes:**

- Supabase Auth method:

  ```typescript
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes('rate limit')) {
        setError('Too many attempts. Wait 60 seconds and try again.');
      } else if (error.message.includes('email send')) {
        setError('Email delivery failed. Try password login or check email address.');
      } else {
        setError(error.message);
      }
      return;
    }

    setSuccess('Check your email for login link (expires in 1 hour)');
  } catch (err) {
    setError('Network error. Try again or use password login.');
  }
  ```

- Callback route: `/app/auth/callback/route.ts` exchanges code for session
- Email provider: Resend (configured in Supabase dashboard)
- Email template: Customizable in Supabase settings

**Dependencies:** Story 1.4.1 (shares auth components)

**Story Points:** 2

---

### Story 1.4.3: Anonymous to Authenticated Conversion (localStorage Session ID)

**As an** anonymous user who reported issues  
**I want** my previous reports linked to my new account  
**So that** I receive retroactive credit for my contributions

**Acceptance Criteria:**

- [ ] After signup/login, detect if user previously reported anonymously
- [ ] **Detection method: localStorage `session_id` (per stakeholder clarification - NO device fingerprinting)**
  - On anonymous report: Generate UUID and store in `localStorage.setItem('session_id', uuid)`
  - On signup/login: Read `localStorage.getItem('session_id')`
  - Query `reports` table for reports with matching `session_id` where `user_id IS NULL`
- [ ] Update reports: set `user_id = authenticated_user_id`
- [ ] Calculate retroactive points: +5 per report converted
- [ ] Success modal: "Welcome back! We found 3 reports you made. You earned 15 points!"
- [ ] Points added to user profile immediately
- [ ] Conversion runs once per user (flag: `anonymous_reports_migrated = true`)
- [ ] **Error handling:**
  - **localStorage disabled:** Log warning, skip conversion (user can still use account)
  - **Query failed:** Log error, retry on next login
  - **Update failed:** Rollback transaction, show generic error (don't block login)
  - **Multiple browsers:** Each browser has separate session_id (expected behavior, no error)
- [ ] **Edge case:** If localStorage cleared between report and signup, reports not linked (acceptable tradeoff)
- [ ] **Multi-browser scenario (documented behavior):**
  - User reports on Chrome (session_id stored in Chrome localStorage)
  - User signs up on Firefox (different session_id in Firefox localStorage)
  - Result: Chrome reports NOT automatically linked (localStorage is per-browser)
  - **User action required:** Re-login on Chrome to trigger conversion of Chrome reports
  - **This is acceptable:** User can access original browser to link reports, or reports remain anonymous
  - **No error shown:** System works as designed, localStorage is intentionally browser-scoped

**Technical Notes:**

- Server Action: `/app/actions/convertAnonymousReports.ts`
- Query:

  ```typescript
  'use server';
  export async function convertAnonymousReports(userId: string, sessionId: string) {
    try {
      const { data: anonReports, error: queryError } = await supabase
        .from('reports')
        .select('id')
        .is('user_id', null)
        .eq('session_id', sessionId);

      if (queryError) throw queryError;

      if (anonReports && anonReports.length > 0) {
        // Update reports in transaction
        const { error: updateError } = await supabase
          .from('reports')
          .update({ user_id: userId })
          .in(
            'id',
            anonReports.map((r) => r.id)
          );

        if (updateError) throw updateError;

        // Award retroactive points
        const points = anonReports.length * 5;
        await supabase.rpc('increment_user_points', {
          uid: userId,
          amount: points,
          reason: 'Retroactive credit for anonymous reports',
        });

        // Mark migration complete
        await supabase.from('users').update({ anonymous_reports_migrated: true }).eq('id', userId);

        return { success: true, reportCount: anonReports.length, points };
      }

      return { success: true, reportCount: 0, points: 0 };
    } catch (err) {
      console.error('Anonymous report conversion error:', err);
      return { success: false, error: err.message };
    }
  }
  ```

- Run on first login after signup (use `useEffect` with `user` dependency)
- Client-side detection:
  ```tsx
  useEffect(() => {
    if (user && !user.anonymous_reports_migrated) {
      const sessionId = localStorage.getItem('session_id');
      if (sessionId) {
        convertAnonymousReports(user.id, sessionId).then((result) => {
          if (result.success && result.reportCount > 0) {
            toast.success(
              `Welcome! Found ${result.reportCount} reports. Earned ${result.points} points!`
            );
          }
        });
      }
    }
  }, [user]);
  ```

**Dependencies:** Story 1.4.1, Story 1.3.7 (needs session tracking in reports)

**Story Points:** 3

---

### ~~Story 1.4.4: User Profile Creation & Display~~ **DEFERRED TO SPRINT 2.2**

**Rationale:** User profiles require points system foundation (Story 1.5.1) and tangible impact metrics (Story 2.2.2) to be meaningful. Moving to Sprint 2.2 after verification features implemented.

---

## Epic 1.5: ~~Points System Foundation~~ **DEFERRED TO SPRINT 2.1**

**Rationale:** Points system requires user profiles (Story 1.4.4) and verification features (Sprint 2.1) to be functional. Moving entire epic to Sprint 2.1 to enable proper implementation with all dependencies.

**Original Total Points:** 2 (Story 1.5.1)

### ~~Story 1.5.1: Points Calculation & Storage~~ **DEFERRED TO SPRINT 2.1**

**Rationale:** Points awarded for verification (Sprint 2 feature) and resolution proof (Sprint 3 feature). Implementing in Sprint 1 would create unused code. Moving to Sprint 2.1 alongside verification system.

---

- id, user_id, amount, reason, created_at
- [ ] Points cannot go negative (minimum: 0)
- [ ] Display on user profile (Story 1.4.4)

**Technical Notes:**

- Server Action: `/app/actions/awardPoints.ts`
- Implementation:

  ```typescript
  'use server';
  export async function awardPoints(userId: string, amount: number, reason: string) {
    // Insert into points_history
    await supabase.from('points_history').insert({
      user_id: userId,
      amount,
      reason,
    });

    // Update user total
    await supabase.rpc('increment_user_points', {
      user_id: userId,
      points_delta: amount,
    });
  }
  ```

- PostgreSQL function `increment_user_points` (atomic update):
  ```sql
  CREATE FUNCTION increment_user_points(user_id UUID, points_delta INT)
  RETURNS VOID AS $$
  BEGIN
    UPDATE users
    SET points = GREATEST(points + points_delta, 0)
    WHERE id = user_id;
  END;
  $$ LANGUAGE plpgsql;
  ```
- Call from `createReport` Server Action after successful insert

**Dependencies:** Story 1.4.1 (needs authenticated users)

**Story Points:** 2

---

## Sprint 1 Summary

**Total Stories:** 18  
**Total Story Points:** 57 (includes voice notes MediaRecorder API complexity at 5 points)

**Epics Breakdown:**

- Epic 1.1: Responsive Navigation (3 stories, 8 points)
- Epic 1.2: Interactive Map (3 stories, 13 points)
- Epic 1.3: Report Submission Flow (7 stories, 27 points) ← Voice notes complexity +3
- Epic 1.4: User Authentication (4 stories, 10 points)
- Epic 1.5: Points System (1 story, 3 points)

**Key Deliverables:**
✅ Mobile-first responsive navigation  
✅ Interactive Leaflet map with clustering  
✅ 60-second report submission with voice notes  
✅ Photo upload with EXIF stripping  
✅ Email/password + magic link authentication  
✅ Anonymous to authenticated conversion  
✅ User profiles with points system  
✅ 2 categories: Waste/Litter + Drainage

**Dependencies Resolved:**

- All stories have clear dependencies mapped
- Foundation stories (navigation, map, auth) completed first
- Report flow builds on map infrastructure
- Points system depends on authentication

---

# Sprint 2: Verification + Profiles (Weeks 4-6)

**Goal:** Enable community-driven verification with 2-verification threshold, build user profiles with tangible impact metrics (NO gamification), and implement basic flagging system for spam moderation.

**Capacity:** 54 story points (3 weeks)

**Critical Design Change:** Per stakeholder clarification, **NO POINTS/BADGES/LEADERBOARDS**. User profiles show **verified tangible impact** (kg waste removed, community cleanups verified) instead of arbitrary scores.

**Key Deliverables:**

- Verification flow with photo proof + context notes
- Session-based anonymous verification (localStorage session_id)
- 2-verification threshold for status promotion
- User profiles with tangible impact metrics
- Community celebration messaging (not points)
- Basic flagging system (admin moderation via Supabase dashboard)

---

## Epic 2.1: Community Verification Flow

**Epic Goal:** Enable authenticated members to verify other users' reports with photo proof and context notes, promoting anonymous reports to "Verified" status after 2+ verifications. Includes email notification preferences to support verification emails.

**Total Points:** 27 (increased from 24 - added Story 2.1.7 Email Preferences, moved from Epic 2.2)

### Story 2.1.1: Verification Button & UI Entry Point

**As a** authenticated community member  
**I want** to see a "Verify This Issue" button on unverified reports  
**So that** I can contribute to validating community reports

**Acceptance Criteria:**

- [ ] "Verify This Issue" button displays on issue detail pages for reports with status = 'pending'
- [ ] Button hidden for reports with status = 'verified' or 'resolved'
- [ ] Button disabled if user is the original reporter (self-verification blocked)
- [ ] **Anonymous verification check:** If user's `session_id` (from localStorage) matches report's `session_id`, disable button with tooltip: "You cannot verify your own report"
- [ ] **Session expiry enforcement:** Session IDs expire after 7 days. Reports older than 7 days with session_id cannot be self-verification blocked (session considered stale)
- [ ] Button shows verification count: "Verify (1/2)" or "Verified ✓" if threshold met
- [ ] Tap button opens verification modal/sheet (mobile: bottom sheet, desktop: modal)
- [ ] Anonymous users see "Login to verify" tooltip on hover
- [ ] Button uses Hugeicons `CheckCircle` icon
- [ ] Primary green color (#059669) when enabled, gray when disabled
- [ ] Touch target: 44x44px minimum
- [ ] Accessible: `aria-label="Verify this environmental issue"`

**Technical Notes:**

- Session ID handling:

  ```typescript
  // Client-side: Get session_id from localStorage
  const sessionId = localStorage.getItem('session_id');

  // Pass to verification button click handler
  const canVerify =
    user &&
    report.user_id !== user.id && // Not own report (authenticated)
    report.session_id !== sessionId && // Not own report (anonymous)
    isSessionValid(report.created_at); // Session not expired (7 days)

  function isSessionValid(reportCreatedAt: Date) {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - new Date(reportCreatedAt).getTime() < SEVEN_DAYS_MS;
  }
  ```

- Session ID from `localStorage.getItem('session_id')`
- Verification count from `reports.verifications_count` column (denormalized for performance)

**Dependencies:** Story 1.3.7 (needs issue detail page), Story 1.4.1 (needs auth)

**Story Points:** 3 (+1 for session expiry logic)

---

### Story 2.1.2: Verification Photo Capture with Angle Validation

**As a** verifier  
**I want** to upload a verification photo from the same location  
**So that** I can provide proof that the issue exists

**Acceptance Criteria:**

- [ ] Verification modal shows camera button (same as report photo capture)
- [ ] Photo captured using `<input type="file" accept="image/*" capture="environment">`
- [ ] Single photo required (1 photo minimum, max 3 for additional context)
- [ ] Photo uploaded with EXIF stripping (reuse uploadPhoto Server Action from Story 0.4)
- [ ] Photo size limit: 10MB per photo
- [ ] Compression: max 1920x1080, 85% JPEG quality
- [ ] Upload to Supabase Storage: `verification-photos/{userId}/{verificationId}.jpg`
- [ ] **Angle validation (basic):** Display warning if photo appears identical to original report photo
  - Use client-side perceptual hash comparison (optional for MVP, can defer)
  - Warn user: "Photo looks very similar to original. Please take from different angle."
  - Allow override: "Submit Anyway" button (trust community for MVP)
- [ ] Loading state: Progress bar during upload (<5s target on 3G)
- [ ] Error handling:
  - File too large: "Photo too large. Max 10MB."
  - Upload failed: Retry button + "Upload failed. Check connection and retry."
  - EXIF strip failed: Reject upload + "Privacy error. Try again or contact support."
- [ ] Success feedback: Green checkmark + "Photo uploaded"
- [ ] Photo preview with crop/rotate tools (optional, can defer)
- [ ] **Screenshot detection (client-side):** If photo file size matches original within 5%, show warning
  - Warning: "Photo appears to be a screenshot. Please take a new photo from the location."
  - Allow override: "Submit Anyway" button (adds friction to lazy spam)
  - **Spam logging:** Log all "Submit Anyway" clicks to `verification_spam_log` table for Sprint 4 analysis
  - Log fields: verification_id, user_id, screenshot_detected (boolean), override_clicked (boolean), created_at
  - **Phase 2 decision criteria:** If spam rate >5%, implement server-side perceptual hashing in Sprint 4

**Technical Notes:**

- Reuse `uploadPhoto` Server Action from Story 0.4
- **Screenshot detection (per Sally's UX recommendation):**

  ```typescript
  async function checkPotentialScreenshot(newPhotoSize: number, originalPhotoSize: number) {
    const sizeDiff = Math.abs(newPhotoSize - originalPhotoSize);
    const percentDiff = (sizeDiff / originalPhotoSize) * 100;

    if (percentDiff < 5) {
      return {
        isPotentialScreenshot: true,
        message: 'Photo appears to be a screenshot. Please take a new photo from the location.',
      };
    }
    return { isPotentialScreenshot: false };
  }
  ```

- Angle validation (Phase 2 enhancement):

  ```typescript
  import imageHash from 'image-hash'; // Perceptual hash library

  async function checkSimilarity(newPhoto, originalPhoto) {
    const hash1 = await imageHash.hash(newPhoto);
    const hash2 = await imageHash.hash(originalPhoto);
    const similarity = hammingDistance(hash1, hash2);
    return similarity < 10; // Very similar if <10 bits different
  }
  ```

**Dependencies:** Story 0.4 (uses uploadPhoto Server Action), Story 2.1.1 (verification modal)

**Story Points:** 3

---

### Story 2.1.3: Verification Context Notes & Timestamp

**As a** verifier  
**I want** to add context notes to my verification  
**So that** I can provide additional details about what I observed

**Acceptance Criteria:**

- [ ] Text area for verification notes (optional, 0-500 characters)
- [ ] Placeholder: "What did you observe? Any additional context?"
- [ ] Character counter: "0/500 characters"
- [ ] Voice note option (optional, reuse voice recording from Story 1.3.6)
- [ ] Notes NOT required (can submit with photo only)
- [ ] **Auto-capture metadata:**
  - Timestamp: `created_at` (automatic)
  - GPS coordinates: Use browser Geolocation API (same as report submission)
  - Verifier username: Fetched from `users` table
- [ ] Geolocation accuracy indicator: "Accurate within 20 meters"
- [ ] Geolocation timeout: 5 seconds (then use report's coordinates as fallback)
- [ ] Display verification location on small map preview (150x150px)
- [ ] Location validation: Warn if verifier >500 meters from original report location
  - Warning message: "You're far from the issue location. Please verify in person."
  - Allow override: "Submit Anyway" button (trust community for MVP)
- [ ] Error handling:
  - Geolocation denied: "Location required for verification. Please enable."
  - Geolocation timeout: "Location detection slow. Using report location instead."
  - Network error: "Cannot submit. Check connection and retry."

**Technical Notes:**

- Server Action: `/app/actions/createVerification.ts`
- Verification record structure:
  ```typescript
  {
    id: uuid,
    issue_id: uuid,
    verifier_id: uuid,
    photo_url: string,
    note: string (nullable),
    voice_note_url: string (nullable),
    lat: float8,
    lng: float8,
    created_at: timestamp
  }
  ```
- Distance calculation (PostgreSQL):
  ```sql
  SELECT earth_distance(
    ll_to_earth(report.lat, report.lng),
    ll_to_earth(verification.lat, verification.lng)
  ) AS distance_meters;
  ```
- Show warning if `distance_meters > 500`

**Dependencies:** Story 2.1.2 (verification photo), Story 1.3.6 (voice notes)

**Story Points:** 3

---

### Story 2.1.4: Create Verification Server Action with Self-Verification Block

**As a** system  
**I want** to prevent users from verifying their own reports  
**So that** verification integrity is maintained

**Acceptance Criteria:**

- [ ] Server Action: `/app/actions/createVerification.ts`
- [ ] Input validation:
  - Required: issue_id, verifier_id, photo_url, lat, lng
  - Optional: note, voice_note_url
- [ ] **Self-verification block (authenticated users):**
  - Query: `SELECT user_id FROM issues WHERE id = issue_id`
  - If `user_id = verifier_id`, reject with error: "Cannot verify your own report"
- [ ] **Session-based self-verification block (anonymous reports):**
  - Query: `SELECT session_id FROM issues WHERE id = issue_id AND user_id IS NULL`
  - Get verifier's session_id from localStorage (passed as param)
  - If `session_id = verifier_session_id`, reject: "Cannot verify your own report"
- [ ] Insert verification record into `verifications` table
- [ ] **Atomic increment with race condition prevention:**

  ```sql
  BEGIN;
  -- Lock row to prevent concurrent updates
  SELECT verifications_count FROM issues
  WHERE id = issue_id
  FOR UPDATE;

  -- Increment count atomically
  UPDATE issues
  SET verifications_count = verifications_count + 1
  WHERE id = issue_id
  RETURNING verifications_count;

  -- Check threshold with new count
  IF verifications_count >= 2 AND status = 'pending' THEN
    UPDATE issues SET status = 'verified' WHERE id = issue_id;
  END IF;
  COMMIT;
  ```

- [ ] **2-verification threshold check:**
  - If `verifications_count >= 2` AND `status = 'pending'`
  - Update `status = 'verified'`
  - Increment `reporter.verified_reports_count` (used in Story 2.2.2 impact metrics)
- [ ] **Session ID integration:** Client must pass `localStorage.getItem('session_id')` as parameter to Server Action
- [ ] Transaction rollback on any error (atomic operation)
- [ ] Error handling:
  - Self-verification blocked: Return `{ success: false, error: 'self_verification' }`
  - Duplicate verification: Return `{ success: false, error: 'already_verified' }`
  - Database error: Log error + return generic message
- [ ] Success response: `{ success: true, verification_id: uuid, new_status: string }`
- [ ] **Prevent duplicate verifications:** One user can only verify an issue once
  - Add unique constraint: `UNIQUE(issue_id, verifier_id)`
  - Show friendly error: "You already verified this issue"

**Technical Notes:**

- Server Action implementation:

  ```typescript
  'use server';
  export async function createVerification(data: {
    issue_id: string;
    verifier_id: string;
    verifier_session_id: string; // From localStorage
    photo_url: string;
    note?: string;
    voice_note_url?: string;
    lat: number;
    lng: number;
  }) {
    // Self-verification check (authenticated)
    const { data: issue } = await supabase
      .from('issues')
      .select('user_id, session_id, verifications_count, status')
      .eq('id', data.issue_id)
      .single();

    if (issue.user_id === data.verifier_id) {
      return { success: false, error: 'self_verification' };
    }

    // Self-verification check (anonymous)
    if (!issue.user_id && issue.session_id === data.verifier_session_id) {
      return { success: false, error: 'self_verification' };
    }

    // Insert verification
    const { data: verification, error } = await supabase
      .from('verifications')
      .insert({
        issue_id: data.issue_id,
        verifier_id: data.verifier_id,
        photo_url: data.photo_url,
        note: data.note,
        voice_note_url: data.voice_note_url,
        lat: data.lat,
        lng: data.lng,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        return { success: false, error: 'already_verified' };
      }
      throw error;
    }

    // Increment count + check threshold
    const newCount = issue.verifications_count + 1;
    const newStatus = newCount >= 2 && issue.status === 'pending' ? 'verified' : issue.status;

    await supabase
      .from('issues')
      .update({
        verifications_count: newCount,
        status: newStatus,
      })
      .eq('id', data.issue_id);

    return {
      success: true,
      verification_id: verification.id,
      new_status: newStatus,
    };
  }
  ```

- Database constraint:
  ```sql
  ALTER TABLE verifications
  ADD CONSTRAINT unique_issue_verifier
  UNIQUE(issue_id, verifier_id);
  ```
- **Integration tests (per Murat's recommendation):**

  ```typescript
  test('verification threshold triggers status change', async () => {
    const issue = await createTestIssue({ status: 'pending', verifications_count: 0 });

    // 1st verification - status should remain pending
    await createVerification({
      issue_id: issue.id,
      verifier_id: user1.id,
      verifier_session_id: 'session-1',
      photo_url: 'photo1.jpg',
      lat: 6.5244,
      lng: 3.3792,
    });
    const afterFirst = await getIssue(issue.id);
    expect(afterFirst.status).toBe('pending');
    expect(afterFirst.verifications_count).toBe(1);

    // 2nd verification - threshold met, status should change to verified
    await createVerification({
      issue_id: issue.id,
      verifier_id: user2.id,
      verifier_session_id: 'session-2',
      photo_url: 'photo2.jpg',
      lat: 6.5244,
      lng: 3.3792,
    });
    const afterSecond = await getIssue(issue.id);
    expect(afterSecond.status).toBe('verified'); // Threshold met!
    expect(afterSecond.verifications_count).toBe(2);
  });

  test('self-verification blocked for authenticated users', async () => {
    const issue = await createTestIssue({ user_id: user1.id });

    const result = await createVerification({
      issue_id: issue.id,
      verifier_id: user1.id, // Same user!
      photo_url: 'photo.jpg',
      lat: 6.5244,
      lng: 3.3792,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('self_verification');
  });

  test('self-verification blocked for anonymous users via session_id', async () => {
    const issue = await createTestIssue({
      user_id: null,
      session_id: 'anonymous-session-123',
    });

    const result = await createVerification({
      issue_id: issue.id,
      verifier_id: user1.id,
      verifier_session_id: 'anonymous-session-123', // Same session!
      photo_url: 'photo.jpg',
      lat: 6.5244,
      lng: 3.3792,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('self_verification');
  });
  ```

**Dependencies:** Story 2.1.3 (verification data), Database schema update

**Story Points:** 6 (+1 for race condition fix + session_id integration)

---

### Story 2.1.5: Multi-Verifier Display & Photo Gallery

**As a** user viewing an issue  
**I want** to see all verification photos and notes  
**So that** I can understand community consensus on the issue

**Acceptance Criteria:**

- [ ] Issue detail page shows verification section below report details
- [ ] Display verification count badge: "2 verifications" with green checkmark icon
- [ ] List all verifiers with usernames and timestamps:
  - "Verified by @ola_lagos 2 hours ago"
  - "Verified by @chidi_abuja yesterday"
- [ ] Display verification photos in horizontal gallery (swipeable on mobile)
- [ ] Each verification card shows:
  - Verifier username (linked to profile)
  - Verification photo (tappable to expand full-screen)
  - Verification note (if provided)
  - Timestamp (relative: "2 hours ago", "yesterday")
  - Location accuracy indicator if >100m from report location
- [ ] Photo gallery:
  - Horizontal scroll on mobile (snap to each photo)
  - Grid view on desktop (2-3 photos per row)
  - Lightbox/modal on tap (full-screen photo view)
- [ ] "Verify This Issue" button positioned above verification list if not yet verified by user
- [ ] Empty state if no verifications: "No verifications yet. Be the first to verify!"
- [ ] Loading skeleton while fetching verifications
- [ ] Error handling: "Unable to load verifications. Refresh page."

**Technical Notes:**

- Query:
  ```typescript
  const { data: verifications } = await supabase
    .from('verifications')
    .select(
      `
      id,
      photo_url,
      note,
      lat,
      lng,
      created_at,
      verifier:users!verifier_id (
        username,
        avatar_url
      )
    `
    )
    .eq('issue_id', issueId)
    .order('created_at', { ascending: false });
  ```
- Use `react-photo-view` library for lightbox (or native modal)
- Relative timestamps using `date-fns` library:

  ```typescript
  import { formatDistanceToNow } from 'date-fns';

  const timestamp = formatDistanceToNow(new Date(verification.created_at), {
    addSuffix: true, // "2 hours ago"
  });
  ```

**Dependencies:** Story 2.1.4 (verification records), Story 1.3.7 (issue detail page)

**Story Points:** 3

---

### Story 2.1.6: Verification Status Badge on Map Pins

**As a** map viewer  
**I want** to see which issues are verified  
**So that** I can quickly identify community-validated reports

**Acceptance Criteria:**

- [ ] Map pins display different icons based on verification status:
  - Pending (0-1 verifications): Gray `MapPin` icon
  - Verified (2+ verifications): Green `MapPinHome` icon with checkmark badge
  - Resolved: Green `CheckCircle` icon
- [ ] Verified pin icon includes small green dot or checkmark overlay (top-right corner)
- [ ] Verification count shown on pin hover (desktop) or tap (mobile):
  - Tooltip: "2 verifications"
- [ ] Filter panel includes "Verified Only" toggle:
  - Checkbox: "Show only verified issues"
  - Applies filter to map query: `WHERE verifications_count >= 2`
- [ ] Verified pin color: #059669 (primary green)
- [ ] Pending pin color: #9CA3AF (gray)
- [ ] Pin size: 44x44px touch target
- [ ] Accessible: ARIA labels on pins include verification status

**Technical Notes:**

- Update `IssueMarker` component from Story 0.3:

  ```tsx
  export function IssueMarker({ issue }) {
    const icon = useMemo(() => {
      if (issue.status === 'resolved') {
        return <CheckCircle className="text-green-600" />;
      } else if (issue.verifications_count >= 2) {
        return (
          <div className="relative">
            <MapPinHome className="text-green-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full border-2 border-white" />
          </div>
        );
      } else {
        return <MapPin className="text-gray-500" />;
      }
    }, [issue.status, issue.verifications_count]);

    return (
      <Marker
        position={[issue.lat, issue.lng]}
        icon={divIcon({ html: renderToStaticMarkup(icon) })}
      >
        <Tooltip>{issue.verifications_count} verifications</Tooltip>
      </Marker>
    );
  }
  ```

- Map query includes `verifications_count` column

**Dependencies:** Story 0.3 (IssueMarker component), Story 2.1.4 (verifications_count)

**Story Points:** 3

---

### Story 2.1.7: Email Notification Preferences (MOVED FROM Epic 2.2 to fix dependency)

**As a** user  
**I want** to control email notification preferences  
**So that** I receive only the notifications I want

**Acceptance Criteria:**

- [ ] Profile settings page: `/profile/settings`
- [ ] Email notification preferences section:
  - "Email me when my reports are verified" (default: ON)
  - "Email me when Action Cards I signed up for are approaching" (default: ON)
  - "Email me monthly impact summary" (default: OFF)
- [ ] Settings auto-save on toggle change (debounced)
- [ ] Success toast: "Settings saved"
- [ ] Error handling: "Save failed. Try again."
- [ ] Database columns added to `users` table:
  - `email_verified_reports` (boolean, default: true)
  - `email_action_cards` (boolean, default: true)
  - `email_monthly_summary` (boolean, default: false)
- [ ] Profile privacy toggle: "Make profile public" (default: ON)
  - Public profile: Anyone can view `/profile/[username]`
  - Private profile: Only user can view, returns 404 to others
  - Verifications still attributed (username shown), but profile not clickable

**Technical Notes:**

- Database migration to add columns:

  ```sql
  ALTER TABLE users
  ADD COLUMN email_verified_reports BOOLEAN DEFAULT true,
  ADD COLUMN email_action_cards BOOLEAN DEFAULT true,
  ADD COLUMN email_monthly_summary BOOLEAN DEFAULT false,
  ADD COLUMN profile_public BOOLEAN DEFAULT true;
  ```

- Settings update Server Action:
  ```typescript
  'use server';
  export async function updateProfileSettings(
    userId: string,
    settings: {
      email_verified_reports?: boolean;
      email_action_cards?: boolean;
      email_monthly_summary?: boolean;
      profile_public?: boolean;
    }
  ) {
    await supabase.from('users').update(settings).eq('id', userId);
  }
  ```

**Dependencies:** Story 2.2.1 (profile page)

**Story Points:** 3

**🔧 FIX:** Moved from Epic 2.2 (was Story 2.2.5) to Epic 2.1 to resolve forward dependency violation. Story 2.1.8 (verification emails) needs email preferences to function.

---

### Story 2.1.8: Verification Notifications (Email) (RENUMBERED from 2.1.7)

**As a** report submitter  
**I want** to be notified when my report is verified  
**So that** I know the community validated my observation

**Acceptance Criteria:**

- [ ] Email sent to reporter when verification threshold reached (2nd verification)
- [ ] Email subject: "Your report has been verified by the community!"
- [ ] Email body includes:
  - Issue location and category
  - Verification count: "2 community members verified your report"
  - Tangible impact message: "Your report is helping clean up your community!"
  - Link to issue detail page
  - Verifier usernames (optional, privacy consideration)
- [ ] Email template uses React Email (professional formatting)
- [ ] Email provider: Resend (configured in Supabase Auth settings)
- [ ] Email sent within 5 minutes of verification (NFR81)
- [ ] No email sent to anonymous reporters (no email address available)
- [ ] **Email preference check:** Query `users.email_verified_reports` preference (from Story 2.1.7)
- [ ] Only send email if user.email_verified_reports = true (default: true for new users)
- [ ] Error handling:
  - Email send failed: Log error, don't block verification submission
  - Retry mechanism: Supabase Edge Function with 3 retries

**Technical Notes:**

- Trigger email from `createVerification` Server Action when threshold reached:

  ```typescript
  if (newStatus === 'verified' && issue.user_id) {
    // Fetch reporter email AND email preferences
    const { data: reporter } = await supabase
      .from('users')
      .select('email, username, email_verified_reports')
      .eq('id', issue.user_id)
      .single();

    // Check preference before sending
    if (reporter.email_verified_reports) {
      await sendVerificationEmail({
        to: reporter.email,
        issueId: issue.id,
        verificationCount: newCount,
        issueLocation: issue.address,
      });
    }
  }
  ```

- React Email template: `/emails/verification-notification.tsx`
- Resend API integration:

  ```typescript
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export async function sendVerificationEmail(data) {
    await resend.emails.send({
      from: 'EcoPulse <notifications@ecopulse.ng>',
      to: data.to,
      subject: 'Your report has been verified!',
      react: VerificationEmail({ ...data }),
    });
  }
  ```

**Dependencies:** Story 2.1.4 (verification trigger), Story 2.1.7 (email preferences), Resend API setup

**✅ DEPENDENCY FIX:** No longer blocked - Story 2.1.7 (email preferences) now completes before this story

**Story Points:** 3

---

### Story 2.1.9: Verification Analytics for Reporters (RENUMBERED from 2.1.8)

**As a** reporter  
**I want** to see how many of my reports were verified  
**So that** I understand my contribution accuracy

**Acceptance Criteria:**

- [ ] User profile displays verification statistics:
  - Total reports submitted
  - Reports verified by community (count + percentage)
  - Average verification speed (time from submission to 2nd verification)
- [ ] "My Reports" page shows verification status for each report:
  - Badge: "Pending (0/2)" or "Verified ✓"
  - Verifier usernames for verified reports
- [ ] Sort options on "My Reports" page:
  - Most recent
  - Most verified
  - Pending verification
- [ ] Filter options:
  - All, Pending, Verified, Resolved
- [ ] Empty state for zero reports: "You haven't reported any issues yet. Start contributing!"
- [ ] Loading skeleton while fetching reports
- [ ] Pagination: 20 reports per page

**Technical Notes:**

- Query for profile stats:

  ```typescript
  const { data: stats } = await supabase
    .from('users')
    .select(
      `
      reports:issues!user_id (count),
      verified_reports:issues!user_id (count) WHERE verifications_count >= 2
    `
    )
    .eq('id', userId)
    .single();

  const verificationRate = (stats.verified_reports / stats.reports) * 100;
  ```

- My Reports query:
  ```typescript
  const { data: reports } = await supabase
    .from('issues')
    .select(
      `
      id,
      category,
      severity,
      status,
      verifications_count,
      created_at,
      address,
      verifications:verifications (
        verifier:users!verifier_id (username)
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(start, end); // Pagination
  ```

**Dependencies:** Story 2.1.4 (verifications data), Story 1.4.1 (auth)

**Story Points:** 5

---

## Epic 2.2: User Profiles with Tangible Impact Metrics

**Epic Goal:** Build user profiles that display **verified tangible impact** (kg waste removed, community cleanups contributed to) instead of arbitrary points/badges, following stakeholder directive to remove gamification.

**Total Points:** 15 (reduced from 18 - Story 2.2.5 moved to Epic 2.1 as Story 2.1.7)

### Story 2.2.1: User Profile Page Foundation

**As a** authenticated user  
**I want** to view and edit my profile  
**So that** I can manage my account and see my contributions

**Acceptance Criteria:**

- [ ] Profile page route: `/profile` (own profile) and `/profile/[username]` (public profiles)
- [ ] Profile displays:
  - Avatar (uploaded or default)
  - Username
  - Bio (optional, 0-200 characters)
  - Join date: "Member since March 2024"
  - Location (optional, city/region)
- [ ] "Edit Profile" button (only on own profile)
- [ ] Avatar upload:
  - Tap avatar to open file picker
  - Image upload with EXIF stripping (reuse uploadPhoto Server Action)
  - Crop to square (1:1 aspect ratio)
  - Max size: 2MB
  - Upload to Supabase Storage: `avatars/{userId}.jpg`
- [ ] Bio editor:
  - Textarea with 200 character limit
  - Character counter
  - Auto-save on blur (debounced)
- [ ] Privacy settings (Phase 2 placeholder):
  - Profile visibility: Public / Private (default: Public)
- [ ] Loading skeleton while fetching profile data
- [ ] Error handling:
  - Profile not found: 404 page
  - Avatar upload failed: "Upload failed. Try again or use default."
  - Bio update failed: "Save failed. Try again."

**Technical Notes:**

- Server Action: `/app/actions/updateProfile.ts`
- Profile query:
  ```typescript
  const { data: profile } = await supabase
    .from('users')
    .select('id, username, avatar_url, bio, location, created_at')
    .eq('username', username)
    .single();
  ```
- Avatar upload (reuse Story 0.4):

  ```typescript
  const avatarUrl = await uploadPhoto(formData, {
    bucket: 'avatars',
    path: `${userId}.jpg`,
    resize: { width: 400, height: 400 }, // Square crop
    quality: 90,
  });

  await supabase.from('users').update({ avatar_url: avatarUrl }).eq('id', userId);
  ```

**Dependencies:** Story 0.4 (uploadPhoto), Story 1.4.1 (auth)

**Story Points:** 3

---

### Story 2.2.2: Tangible Impact Metrics (NO Gamification Points)

**As a** user  
**I want** to see my verified tangible impact on the environment  
**So that** I understand my real contribution (not abstract points)

**Acceptance Criteria:**

- [ ] **CRITICAL:** NO points/badges/leaderboards displayed anywhere in UI (per stakeholder directive)
- [ ] Profile displays verified impact metrics (hybrid Sprint 2 + Sprint 3 data):
  - **Issues Reported & Verified:** "Your 12 verified reports identified ~180 kg of waste" (Sprint 2: estimated impact, clearly labeled)
  - **Community Cleanups Participated:** "You helped remove 45 kg of waste at 3 cleanups!" (Sprint 3: actual measured impact from Action Cards)
  - **Drains Cleared:** "You contributed to clearing 3 drainage blockages!" (count of verified drainage resolutions user participated in)
  - **Volunteer Hours:** "You volunteered 8 hours at Action Card events!" (Sprint 3: tracked from Action Card sign-ins)
- [ ] Impact metrics section header: "Your Environmental Impact"
- [ ] **Sprint 2 UX:** Community Cleanups and Volunteer Hours show "Join Action Cards to start cleaning up!" CTA (data available in Sprint 3)
- [ ] **Labeling clarity:** Estimated metrics clearly marked with "~" symbol and "estimated" label to maintain NGO/funder credibility
- [ ] Each metric includes:
  - Icon (trash can, drainage, cleanup, clock)
  - Value with unit (kg, count, hours)
  - Celebratory message (NOT competitive language)
- [ ] **Calculation logic (hybrid Sprint 2 + Sprint 3):**
  - **Sprint 2 - Estimated Waste (reporting impact):**
    - Count: `SELECT COUNT(*) FROM issues WHERE user_id = uid AND category = 'waste' AND verifications_count >= 2`
    - Estimated kg: `count × 15kg` (clearly labeled as ESTIMATE)
    - Display: "Your 12 verified reports identified ~180 kg of waste"
  - **Sprint 3 - Actual Waste (cleanup impact):**
    - Count: `SELECT COUNT(*) FROM action_card_participants WHERE user_id = uid AND action_card.status = 'completed' AND category = 'waste'`
    - Measured kg: `SUM(action_card.waste_removed_kg)` (actual measured from Action Card completion)
    - Display: "You helped remove 45 kg of waste at 3 cleanups!"
  - Drains cleared: Count of drainage issues user VERIFIED (not just reported) that reached 'resolved' status
  - Volunteer hours: `SUM(action_card.duration_hours)` from completed Action Cards user participated in (Sprint 3)
- [ ] **Verification requirement:** Only count VERIFIED data (verifications_count >= 2 for reports, status = 'completed' for Action Cards)
- [ ] Impact timeline: Monthly breakdown chart (optional for MVP, can defer to Phase 2)
- [ ] **Messaging tone:** Community-focused, NOT competitive
  - ✅ "You saved 15 kg of waste from landfills!"
  - ❌ "You ranked #3 in waste collection!"
- [ ] Empty state: "Start contributing to see your environmental impact!"

**Technical Notes:**

- Query tangible impact metrics:

  ```typescript
  const { data: impact } = await supabase.rpc('get_user_impact', {
    uid: userId
  });

  // PostgreSQL function
  CREATE FUNCTION get_user_impact(uid UUID)
  RETURNS JSON AS $$
  DECLARE
    result JSON;
  BEGIN
    SELECT json_build_object(
      -- Sprint 2: Estimated impact from verified reports
      'verified_reports_count', (
        SELECT COUNT(*) FROM issues
        WHERE user_id = uid AND verifications_count >= 2
      ),
      'estimated_waste_kg', (
        SELECT COUNT(*) * 15 -- Estimated 15kg per verified waste report
        FROM issues
        WHERE user_id = uid
          AND category = 'waste'
          AND verifications_count >= 2
      ),
      -- Sprint 3: Actual impact from Action Card participation
      'actual_waste_removed_kg', (
        SELECT COUNT(*) * 15 -- Avg 15kg per waste cleanup
        FROM action_card_participants acp
        JOIN action_cards ac ON acp.action_card_id = ac.id
        JOIN issues i ON ac.id = ANY(i.action_card_ids)
        WHERE acp.user_id = uid
          AND ac.status = 'completed'
          AND i.category = 'waste'
      ),
      'drains_cleared', (
        SELECT COUNT(DISTINCT i.id)
        FROM issues i
        WHERE i.status = 'resolved'
          AND i.category = 'drainage'
          AND EXISTS (
            SELECT 1 FROM verifications v
            WHERE v.issue_id = i.id AND v.verifier_id = uid
          )
      ),
      'cleanups_verified', (
        SELECT COUNT(*) FROM verifications WHERE verifier_id = uid
      ),
      'volunteer_hours', (
        SELECT COALESCE(SUM(ac.duration_hours), 0)
        FROM action_card_participants acp
        JOIN action_cards ac ON acp.action_card_id = ac.id
        WHERE acp.user_id = uid AND ac.status = 'completed'
      )
    ) INTO result;

    RETURN result;
  END;
  $$ LANGUAGE plpgsql;
  ```

- Display component:
  ```tsx
  <div className="grid grid-cols-2 gap-4">
    <ImpactCard
      icon={<Trash02 />}
      value={`${impact.waste_removed_kg} kg`}
      label="Waste Removed"
      message="You saved waste from landfills!"
    />
    <ImpactCard
      icon={<Droplet />}
      value={impact.drains_cleared}
      label="Drains Cleared"
      message="You helped prevent flooding!"
    />
    {/* More cards... */}
  </div>
  ```

**Dependencies:** Story 2.1.4 (verifications), Sprint 3 Action Cards (volunteer hours)

**Story Points:** 7 (+2 for hybrid metrics calculation with Sprint 2/3 data separation)

---

### Story 2.2.3: Community Celebration Messaging (Replace Points System)

**As a** user  
**I want** to receive encouraging feedback on my contributions  
**So that** I feel motivated by tangible impact (not points)

**Acceptance Criteria:**

- [ ] **NO** "You earned 10 points!" messages anywhere in app
- [ ] **YES** "You saved 15 kg of waste from landfills!" messages
- [ ] Celebration modals triggered after key actions:
  - After report verified: "Great news! Your report was verified by 2 community members!"
  - After Action Card completion: "Amazing! You volunteered 2 hours and helped remove 30 kg of waste!"
  - After verification submitted: "Thank you! You helped validate a community report!"
- [ ] Milestone celebrations (one-time modals):
  - First report: "Welcome! You just made your first environmental report!"
  - 5 verified reports: "Milestone! You've contributed 5 verified reports to your community!"
  - 50 kg waste removed: "Impact! You've helped remove 50 kg of waste!"
- [ ] Toast notifications for small actions:
  - Report submitted: "Report submitted! We'll notify you when verified."
  - Profile updated: "Profile updated successfully!"
- [ ] **Tone guidelines:**
  - Focus on environmental impact, not competition
  - Use "community", "together", "helped" language
  - Avoid "win", "beat", "top user" language
- [ ] Milestone tracking in database:
  - `user_milestones` table: user_id, milestone_key, achieved_at
  - Check if milestone already shown before displaying modal

**Technical Notes:**

- Celebration component:

  ```tsx
  export function CelebrationModal({ type, data }) {
    const messages = {
      first_report: {
        title: 'Welcome to EcoPulse! 🌿',
        body: 'You just made your first environmental report. Thank you for helping your community!',
        impact: null,
      },
      report_verified: {
        title: 'Your Report Was Verified!',
        body: '2 community members confirmed your observation. Your contribution matters!',
        impact: data.impact_message, // "You saved 15 kg of waste!"
      },
      action_card_completed: {
        title: 'Action Card Completed! 🎉',
        body: `You volunteered ${data.hours} hours at ${data.event_name}`,
        impact: `You helped remove ${data.waste_kg} kg of waste!`,
      },
    };

    const msg = messages[type];

    return (
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogTitle>{msg.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {msg.body}
            {msg.impact && <p className="mt-4 text-green-600 font-semibold">{msg.impact}</p>}
          </AlertDialogDescription>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  ```

- Milestone tracking:

  ```typescript
  async function checkAndShowMilestone(userId: string, milestoneKey: string) {
    const { data: existing } = await supabase
      .from('user_milestones')
      .select('id')
      .eq('user_id', userId)
      .eq('milestone_key', milestoneKey)
      .single();

    if (!existing) {
      await supabase.from('user_milestones').insert({
        user_id: userId,
        milestone_key: milestoneKey,
      });

      return true; // Show milestone modal
    }

    return false; // Already shown
  }
  ```

**Dependencies:** Story 2.2.2 (impact metrics), Story 2.1.4 (verification trigger)

**Story Points:** 3

---

### Story 2.2.4: Contribution Timeline & Activity Feed

**As a** user  
**I want** to see my recent contributions  
**So that** I can track my environmental actions over time

**Acceptance Criteria:**

- [ ] Profile page displays "Recent Activity" section
- [ ] Activity feed shows:
  - Reports submitted (with status: pending, verified, resolved)
  - Verifications submitted
  - Action Card sign-ups
  - Action Card completions
- [ ] Each activity item displays:
  - Icon (based on activity type)
  - Action description: "Verified drainage issue on Main St"
  - Timestamp (relative: "2 hours ago", "yesterday")
  - Link to related issue/Action Card
- [ ] Sort order: Most recent first
- [ ] Pagination: 20 items per page, "Load More" button
- [ ] Filter options:
  - All activity
  - Reports only
  - Verifications only
  - Action Cards only
- [ ] Empty state: "No activity yet. Start contributing!"
- [ ] Loading skeleton while fetching activity
- [ ] Error handling: "Unable to load activity. Refresh page."

**Technical Notes:**

- Activity feed query (union of multiple tables):

  ```typescript
  const { data: activity } = await supabase.rpc('get_user_activity', {
    uid: userId,
    limit_count: 20,
    offset_count: offset
  });

  // PostgreSQL function
  CREATE FUNCTION get_user_activity(uid UUID, limit_count INT, offset_count INT)
  RETURNS TABLE (
    id UUID,
    type TEXT,
    description TEXT,
    created_at TIMESTAMP,
    related_id UUID,
    related_url TEXT
  ) AS $$
  BEGIN
    RETURN QUERY (
      SELECT
        i.id,
        'report' AS type,
        'Reported ' || i.category || ' issue on ' || i.address AS description,
        i.created_at,
        i.id AS related_id,
        '/issues/' || i.id AS related_url
      FROM issues i
      WHERE i.user_id = uid

      UNION ALL

      SELECT
        v.id,
        'verification' AS type,
        'Verified ' || i.category || ' issue on ' || i.address AS description,
        v.created_at,
        i.id AS related_id,
        '/issues/' || i.id AS related_url
      FROM verifications v
      JOIN issues i ON v.issue_id = i.id
      WHERE v.verifier_id = uid

      -- Add Action Card activity in Sprint 3

      ORDER BY created_at DESC
      LIMIT limit_count
      OFFSET offset_count
    );
  END;
  $$ LANGUAGE plpgsql;
  ```

**Dependencies:** Story 2.2.1 (profile page), Story 2.1.4 (verifications)

**Story Points:** 4

**📝 NOTE:** Story 2.2.5 (Email Preferences & Profile Visibility) was moved to Epic 2.1 as Story 2.1.7 to fix forward dependency violation.

---

## Epic 2.3: Basic Flagging System

**Epic Goal:** Enable community members to flag inappropriate content, with admin moderation via Supabase dashboard (no custom moderator UI for MVP).

**Total Points:** 12

### Story 2.3.1: Flag Button on Issues & Photos

**As a** authenticated user  
**I want** to flag issues or photos as spam/inappropriate  
**So that** inappropriate content can be reviewed by moderators

**Acceptance Criteria:**

- [ ] Flag icon (Hugeicons `Flag01`) on issue detail page (top-right corner)
- [ ] Flag icon on verification photos (hover overlay on desktop, long-press on mobile)
- [ ] Tap flag icon opens flag modal with reason selection:
  - Spam/duplicate
  - Inappropriate content
  - Harassment
  - Other (text input)
- [ ] Text input for additional context (optional, 0-200 characters)
- [ ] "Submit Flag" button (disabled until reason selected)
- [ ] Confirmation toast: "Flagged for review. Thank you!"
- [ ] **Self-flag prevention:** Users cannot flag their own issues/photos
  - Show tooltip: "Cannot flag your own content"
- [ ] **Duplicate flag prevention:** Users can only flag content once
  - Show toast: "You already flagged this content"
- [ ] Accessible: `aria-label="Flag as inappropriate"`
- [ ] Touch target: 44x44px minimum
- [ ] Error handling:
  - Submit failed: "Flag submission failed. Try again."
  - Network error: "Connection error. Check network and retry."

**Technical Notes:**

- Server Action: `/app/actions/createFlag.ts`
- Flags table schema:

  ```sql
  CREATE TABLE flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    flagged_type TEXT NOT NULL, -- 'issue' or 'photo'
    flagged_id UUID NOT NULL,
    reason TEXT NOT NULL,
    context TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'dismissed'
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE UNIQUE INDEX idx_flags_user_content
  ON flags(user_id, flagged_type, flagged_id);
  ```

- Flag submission:

  ```typescript
  'use server';
  export async function createFlag(data: {
    user_id: string;
    flagged_type: 'issue' | 'photo';
    flagged_id: string;
    reason: string;
    context?: string;
  }) {
    const { error } = await supabase.from('flags').insert(data);

    if (error?.code === '23505') {
      // Unique constraint violation
      return { success: false, error: 'already_flagged' };
    }

    return { success: true };
  }
  ```

**Dependencies:** Story 1.3.7 (issue detail page), Story 2.1.5 (verification photos)

**Story Points:** 3

---

### Story 2.3.2: Auto-Hide Issues After Flag Threshold

**As a** system  
**I want** to auto-hide issues that receive 3+ flags  
**So that** spam is quickly removed from public view

**Acceptance Criteria:**

- [ ] Database trigger: Calculate weighted flag score when flag submitted
- [ ] **Weighted scoring system (anti-Sybil attack protection):**
  - Verified users (email_verified = true): 2 points
  - Anonymous users: 1 point
  - Bonus for contributors (verified_reports_count > 0): +1 point
  - Example: 3 verified users = 6 points (auto-hide), 5 anonymous users = 5 points (auto-hide)
- [ ] Auto-hide logic: If `flag_score >= 5`, set `issues.is_flagged = true`
- [ ] Flagged issues:
  - Removed from map pins (not displayed)
  - Hidden from issue list pages
  - Detail page shows: "This content is under review"
  - Still accessible to admins via Supabase dashboard
- [ ] RLS policy enforced: `SELECT WHERE is_flagged = false` (public queries)
- [ ] Admin override: Admins can manually unhide issues (Supabase dashboard)
- [ ] **Auto-unhide on flag dismissal:** If all flags dismissed (status = 'dismissed'), recalculate flag_score and set is_flagged = false if score < 5
- [ ] Audit log: Track all flag threshold triggers
  - `flag_audit_log` table: issue_id, flag_score, action ('hidden' | 'unhidden'), triggered_at
- [ ] Notification to original reporter (optional for MVP):
  - Email: "Your report was flagged and is under review. We'll restore it if approved."

**Technical Notes:**

- Weighted flag scoring trigger:

  ```sql
  CREATE FUNCTION calculate_flag_score(issue_uuid UUID)
  RETURNS INT AS $$
  DECLARE
    total_score INT := 0;
    flag_record RECORD;
  BEGIN
    FOR flag_record IN
      SELECT f.user_id, u.email_verified, u.verified_reports_count
      FROM flags f
      JOIN users u ON f.user_id = u.id
      WHERE f.flagged_id = issue_uuid
        AND f.flagged_type = 'issue'
        AND f.status = 'pending'
    LOOP
      -- Base score
      IF flag_record.email_verified THEN
        total_score := total_score + 2; -- Verified users
      ELSE
        total_score := total_score + 1; -- Anonymous users
      END IF;

      -- Contributor bonus
      IF flag_record.verified_reports_count > 0 THEN
        total_score := total_score + 1;
      END IF;
    END LOOP;

    RETURN total_score;
  END;
  $$ LANGUAGE plpgsql;

  CREATE FUNCTION check_flag_threshold()
  RETURNS TRIGGER AS $$
  DECLARE
    flag_score INT;
  BEGIN
    flag_score := calculate_flag_score(NEW.flagged_id);

    IF flag_score >= 5 THEN
      UPDATE issues
      SET is_flagged = true
      WHERE id = NEW.flagged_id AND flagged_type = 'issue';
    END IF;

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER flag_threshold_trigger
  AFTER INSERT ON flags
  FOR EACH ROW
  EXECUTE FUNCTION check_flag_threshold();
  ```

- RLS policy update:
  ```sql
  CREATE POLICY "select_issues_public" ON issues
  FOR SELECT USING (is_flagged = false);
  ```

**Dependencies:** Story 2.3.1 (flags table)

**Story Points:** 4 (+1 for weighted scoring system + auto-unhide logic)

---

### Story 2.3.3: Admin Moderation Dashboard (Supabase UI - MVP Scope)

**As an** admin  
**I want** to review flagged content via Supabase dashboard  
**So that** I can approve/dismiss flags without custom UI

**Acceptance Criteria:**

- [ ] **MVP Simplification:** No custom admin UI built in Sprint 2
- [ ] Admins use Supabase Table Editor to review `flags` table
- [ ] Admins can:
  - View all pending flags: `SELECT * FROM flags WHERE status = 'pending'`
  - View flagged issue details: JOIN with `issues` table
  - Manually set `issues.is_flagged = false` to unhide
  - Update `flags.status = 'reviewed'` or `'dismissed'`
  - Set `flags.reviewed_by = admin_user_id` and `flags.reviewed_at = NOW()`
- [ ] Admin role check: `users.role = 'admin'` (enforced by RLS)
- [ ] RLS policy for flags table:
  ```sql
  CREATE POLICY "admins_can_manage_flags" ON flags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
  ```
- [ ] **Phase 2:** Build custom moderator UI with:
  - Flag queue dashboard
  - Side-by-side comparison (original report + flags)
  - Bulk actions (approve/dismiss multiple flags)
  - Moderation history log

**Technical Notes:**

- Admin access via Supabase dashboard: https://app.supabase.com/project/[project-id]/editor
- Admin review query:
  ```sql
  SELECT
    f.id,
    f.reason,
    f.context,
    f.created_at,
    u.username AS flagger,
    i.category,
    i.address,
    i.flag_count
  FROM flags f
  JOIN users u ON f.user_id = u.id
  JOIN issues i ON f.flagged_id = i.id
  WHERE f.status = 'pending' AND f.flagged_type = 'issue'
  ORDER BY f.created_at ASC;
  ```
- Manual unhide:
  ```sql
  UPDATE issues SET is_flagged = false WHERE id = 'issue-uuid';
  UPDATE flags SET status = 'dismissed', reviewed_by = 'admin-uuid', reviewed_at = NOW() WHERE flagged_id = 'issue-uuid';
  ```

**Dependencies:** Story 2.3.2 (flags table + auto-hide)

**Story Points:** 2

---

### Story 2.3.4: Flag Analytics & Spam Rate Monitoring

**As an** admin  
**I want** to monitor spam/flag rates  
**So that** I can detect abuse patterns and adjust thresholds

**Acceptance Criteria:**

- [ ] Admin analytics query (run via Supabase SQL editor):
  - Total flags submitted (last 7 days, 30 days)
  - Flag rate: `(flags / total_issues) * 100`
  - Auto-hide trigger count (issues flagged >= 3 times)
  - Flag resolution time (median time from flag to review)
  - Top flaggers (users submitting most flags)
  - Top flagged users (users whose content is flagged most)
- [ ] **Success metric:** Flag rate <5% of total submissions (per PRD)
- [ ] Alert if flag rate >10%:
  - Manual check via query (automated alerts in Phase 2)
  - Consider adjusting auto-hide threshold or adding CAPTCHA
- [ ] Flag distribution by reason:
  - Spam/duplicate: X%
  - Inappropriate: Y%
  - Harassment: Z%
  - Other: W%
- [ ] **Phase 2:** Automated alerts via Supabase Edge Functions
  - Daily email digest to admins if flag rate >10%
  - Slack/Discord webhook for urgent flags (harassment)

**Technical Notes:**

- Analytics query:
  ```sql
  SELECT
    (SELECT COUNT(*) FROM flags WHERE created_at > NOW() - INTERVAL '7 days') AS flags_7d,
    (SELECT COUNT(*) FROM flags WHERE created_at > NOW() - INTERVAL '30 days') AS flags_30d,
    (SELECT COUNT(*) FROM issues WHERE created_at > NOW() - INTERVAL '30 days') AS issues_30d,
    (
      SELECT COUNT(*) FROM flags WHERE created_at > NOW() - INTERVAL '30 days'
    )::FLOAT / NULLIF(
      (SELECT COUNT(*) FROM issues WHERE created_at > NOW() - INTERVAL '30 days'), 0
    ) * 100 AS flag_rate_percent,
    (SELECT COUNT(DISTINCT flagged_id) FROM flags WHERE status = 'pending' GROUP BY flagged_id HAVING COUNT(*) >= 3) AS auto_hide_count,
    (
      SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (reviewed_at - created_at)))
      FROM flags WHERE status != 'pending'
    ) AS median_resolution_seconds;
  ```
- Top flaggers query:
  ```sql
  SELECT
    u.username,
    COUNT(f.id) AS flag_count,
    ARRAY_AGG(DISTINCT f.reason) AS reasons
  FROM flags f
  JOIN users u ON f.user_id = u.id
  WHERE f.created_at > NOW() - INTERVAL '30 days'
  GROUP BY u.username
  ORDER BY flag_count DESC
  LIMIT 10;
  ```

**Dependencies:** Story 2.3.1 (flags table)

**Story Points:** 4

---

## Sprint 2 Summary

**Total Stories:** 18  
**Total Story Points:** 57 (+3 from critical fixes)

**Story Point Changes:**

- Story 2.1.1: 2 → 3 points (+1 for session expiry)
- Story 2.1.4: 5 → 6 points (+1 for race condition fix)
- Story 2.2.2: 5 → 7 points (+2 for hybrid metrics)
- Story 2.3.2: 3 → 4 points (+1 for weighted scoring)

**Epics Breakdown:**

- Epic 2.1: Community Verification Flow (8 stories, 27 points)
- Epic 2.2: User Profiles with Tangible Impact (5 stories, 20 points)
- Epic 2.3: Basic Flagging System (4 stories, 13 points)

**Key Deliverables:**
✅ Verification flow with 2-verification threshold  
✅ Session-based anonymous verification (localStorage session_id)  
✅ Multi-verifier photo gallery  
✅ Verified status badges on map pins  
✅ User profiles with tangible impact metrics (NO gamification)  
✅ Community celebration messaging (not points)  
✅ Activity timeline & contribution history  
✅ Basic flagging system with auto-hide (3+ flags)  
✅ Admin moderation via Supabase dashboard

**Critical Design Changes:**

- ❌ Removed points/badges/leaderboards (per stakeholder directive)
- ✅ Replaced with verified tangible impact metrics (kg waste, drains cleared, volunteer hours)
- ✅ Community-focused messaging (not competitive language)

**Dependencies Resolved:**

- Verification depends on authentication (Sprint 1)
- Profiles depend on verifications (impact metrics)
- Flagging depends on issues + verifications

---

# Sprint 3: NGO Dashboard + Action Cards (Weeks 7-9)

**Goal:** Build organization-scoped NGO dashboard with CSV exports, implement Action Cards system for volunteer coordination, and enable verified outcomes tracking with before/after proof photos.

**Capacity:** 54 story points (3 weeks @ 18 pts/week)

- **Committed:** 48 points (achievable based on team velocity)
- **Stretch Goal:** +3 points (Story 3.1.6 - Optional if ahead of schedule)
- **Adjusted from original 42 points** after Sprint 3 readiness review

**Stories:** 15 stories (13 committed + 2 new: 3.1.7 mobile optimization, 3.2.7 audit log)

**Key Deliverables:**

- NGO dashboard with auto-prioritized issue queue
- CSV exports for funder reports (RFC 4180 compliant, 10k row limit)
- Indexed queries for sub-2-second dashboard performance (materialized views deferred to Phase 2)
- Action Cards with capacity limits and volunteer sign-ups
- Enhanced sign-up modal (safety notes, checklist, map, participants)
- Before/after resolution proof photos with side-by-side comparison
- Confirmation dialogs for irreversible actions (bulk resolution)
- Bulk issue resolution via Action Card completion
- Volunteer hours tracking + audit log
- **Mobile-optimized NGO dashboard (Africa-First design - HIGH PRIORITY)**
  - KPI carousel (swipe interaction)
  - Accordion issue queue (tap to expand)
  - iOS Safari CSV handling

**Note:** Contact directory for NGO discovery deferred to Sprint 4 (Story 4.3.1)

**⚠️ CRITICAL: Sprint 2.5 Buffer Week Required (Dec 23-27)**

- All pre-requisites MUST complete before Sprint 3 starts Dec 30
- See sprint-3-readiness-validation.md for detailed assignments
- Daily standups 9:00 AM to track blocker resolution

---

## Epic 3.1: NGO Dashboard & Analytics

**Epic Goal:** Build organization-scoped dashboard that enables NGOs to view verified reports, export funder-ready data, and manage organization profiles.

**Total Points:** 26 (updated: Story 3.1.6 added 3 pts optional, Story 3.1.7 added 5 pts mandatory)

**⚠️ CRITICAL PRE-REQUISITES (Sprint 2.5 Buffer Week):**

- Story 2.99: Organizations table schema + RLS policies (5 points) - BLOCKER
- Story 2.98: Multi-org data isolation E2E tests (3 points) - BLOCKER
- Story 2.97: Action Card templates schema + seed data (5 points)
- Migration: Add volunteer_hours column to users table

### Story 3.1.1: NGO Dashboard Foundation & Route Protection

**As an** NGO coordinator  
**I want** to access my organization's dashboard  
**So that** I can manage environmental issues in my coverage area

**Acceptance Criteria:**

- [ ] **Pre-requisite: Run volunteer_hours migration** (ALTER TABLE users ADD COLUMN volunteer_hours INT DEFAULT 0)
- [ ] Dashboard route: `/org/dashboard` (protected route)
- [ ] Route protection: Only users with `role = 'ngo_coordinator'` can access
- [ ] Redirect non-NGO users to `/` with toast: "Access denied. NGO coordinators only."
- [ ] Dashboard layout:
  - Sidebar navigation (desktop) or hamburger menu (mobile)
  - Main content area for KPI cards and issue queue
  - Organization logo/name in header
- [ ] Sidebar menu items:
  - Overview (KPI cards)
  - Issues Queue
  - Action Cards
  - Team Management (Phase 2)
  - Organization Settings
- [ ] **Mobile-first design** (320px-768px primary target, desktop enhancement)
- [ ] Loading skeleton while fetching dashboard data
- [ ] Error handling:
  - Organization not found: "No organization assigned. Contact admin."
  - Data fetch failed: "Unable to load dashboard. Refresh page."

**Technical Notes:**

- Middleware protection:

  ```typescript
  // /middleware.ts
  export async function middleware(request: NextRequest) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (request.nextUrl.pathname.startsWith('/org')) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role, organization_id')
        .eq('id', user.id)
        .single();

      if (profile.role !== 'ngo_coordinator' && profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  }
  ```

- Organization association:
  - `users.organization_id` foreign key to `organizations` table
  - RLS policies filter all queries by `organization_id`

**Dependencies:** Story 1.4.1 (auth), Database schema update (organizations table)

**Story Points:** 3

---

### Story 3.1.2: Organization Profile Management

**As an** NGO coordinator  
**I want** to manage my organization's public profile  
**So that** community members and funders can discover us

**Acceptance Criteria:**

- [ ] Organization settings page: `/org/settings`
- [ ] Editable fields:
  - Organization name
  - Description (0-500 characters)
  - Coverage area (city/region select or polygon drawing on map - MVP: text input)
  - Contact email
  - Website URL (optional)
  - Logo upload (max 2MB, square crop)
- [ ] Logo upload:
  - Uses uploadPhoto Server Action (reuse Story 0.4)
  - Crop to square (1:1 aspect ratio)
  - Upload to Supabase Storage: `org-logos/{orgId}.jpg`
- [ ] Coverage area (MVP scope):
  - Text input: "Lagos, Nigeria" (Phase 2: interactive polygon drawing)
  - **IMPORTANT:** Must be exact city name for text matching to work
  - **Known limitation:** Text-based ILIKE matching may have false positives/negatives
  - Used for filtering issues in dashboard
  - **Phase 2 upgrade:** PostGIS polygon boundaries for accurate geo-filtering
- [ ] **Documentation required:** Add coverage area guidelines to org settings help text
- [ ] Auto-save on blur (debounced 1 second)
- [ ] Success toast: "Organization updated"
- [ ] Form validation:
  - Name required (3-100 characters)
  - Valid email format
  - Valid URL format (if provided)
- [ ] Error handling:
  - Update failed: "Save failed. Try again."
  - Logo upload failed: "Upload failed. Try again or use default logo."

**Technical Notes:**

- Server Action: `/app/actions/updateOrganization.ts`
- Organizations table schema:

  ```sql
  CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    coverage_area TEXT, -- MVP: text, Phase 2: GEOGRAPHY(POLYGON)
    contact_email TEXT NOT NULL,
    website_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  ALTER TABLE users
  ADD COLUMN organization_id UUID REFERENCES organizations(id);
  ```

- RLS policy:
  ```sql
  CREATE POLICY "org_coordinators_can_update_own_org" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );
  ```

**Dependencies:** Story 3.1.1 (dashboard route), Story 0.4 (uploadPhoto)

**Story Points:** 3

---

### Story 3.1.3: KPI Cards with Indexed Queries

**As an** NGO coordinator  
**I want** to see key metrics at a glance  
**So that** I can track our organization's impact

**Acceptance Criteria:**

- [ ] Dashboard displays 4 KPI cards (above issue queue):
  - **Issues Addressed:** Count of issues with status = 'resolved' in coverage area
  - **Verified Reports:** Count of issues with verifications_count >= 2 in coverage area
  - **Volunteer Hours:** Sum of volunteer hours from completed Action Cards
  - **Resolution Rate:** `(resolved / total) * 100` percentage
- [ ] Each KPI card shows:
  - Large number (primary metric)
  - Icon (Hugeicons - chart, check, clock, percent)
  - Label (metric name)
  - Trend indicator (optional for MVP - "+5% this month")
- [ ] **Performance requirement:** Dashboard loads in <2 seconds with 500+ verified reports (NFR4)
- [ ] **Technical solution:** Indexed queries (materialized views deferred to Phase 2 per Winston's recommendation)
- [ ] **Mobile responsiveness:** KPI cards display as horizontal scroll carousel on mobile (320px-768px)
- [ ] **Empty state:** New NGOs with zero metrics see onboarding guidance (not just zeros)
- [ ] Loading skeleton while fetching KPIs
- [ ] Error handling: "Unable to load metrics. Refresh page."

**Technical Notes:**

- **Indexed queries for <2s performance (adequate for MVP scale <10 NGOs, <500 issues):**

  ```sql
  -- Add composite indexes for fast KPI queries
  CREATE INDEX idx_issues_org_coverage_resolved ON issues(address)
  WHERE status = 'resolved' AND is_flagged = false;

  CREATE INDEX idx_issues_verifications ON issues(verifications_count)
  WHERE verifications_count >= 2 AND is_flagged = false;

  CREATE INDEX idx_action_cards_org_completed ON action_cards(organization_id, status)
  WHERE status = 'completed';

  CREATE INDEX idx_users_volunteer_hours ON users(volunteer_hours)
  WHERE volunteer_hours > 0;
  ```

- **KPI query (O(log n) with indexes, <200ms for MVP scale):**

  ```typescript
  // Server Action: /app/actions/getNGOKPIs.ts
  'use server';
  export async function getNGOKPIs(orgId: string) {
    const { data: org } = await supabase
      .from('organizations')
      .select('coverage_area')
      .eq('id', orgId)
      .single();

    // Issues Addressed (resolved count)
    const { count: issuesAddressed } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true })
      .ilike('address', `%${org.coverage_area}%`)
      .eq('status', 'resolved')
      .eq('is_flagged', false);

    // Verified Reports (verifications >= 2)
    const { count: verifiedReports } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true })
      .ilike('address', `%${org.coverage_area}%`)
      .gte('verifications_count', 2)
      .eq('is_flagged', false);

    // Volunteer Hours (sum from completed Action Cards)
    const { data: actionCards } = await supabase
      .from('action_cards')
      .select('duration_hours')
      .eq('organization_id', orgId)
      .eq('status', 'completed');

    const volunteerHours = actionCards?.reduce((sum, ac) => sum + ac.duration_hours, 0) || 0;

    // Total issues for resolution rate
    const { count: totalIssues } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true })
      .ilike('address', `%${org.coverage_area}%`)
      .eq('is_flagged', false);

    const resolutionRate = totalIssues > 0 ? ((issuesAddressed / totalIssues) * 100).toFixed(1) : 0;

    return {
      issuesAddressed: issuesAddressed || 0,
      verifiedReports: verifiedReports || 0,
      volunteerHours,
      resolutionRate,
    };
  }
  ```

- **Empty state for new NGOs (onboarding guidance):**

  ```tsx
  {
    kpis.issuesAddressed === 0 && kpis.verifiedReports === 0 && (
      <EmptyStateCard
        icon={<Lightbulb />}
        title="Welcome to ecoPulse!"
        description="You're all set up. Here's how to get started:"
        steps={[
          '✅ Set your coverage area in Organization Settings',
          '📍 Wait for community members to report issues in your area',
          '🧹 Create Action Cards to coordinate cleanups',
          '📊 Track your impact as issues get resolved',
        ]}
        cta={{
          text: 'Review Organization Settings',
          link: '/org/settings',
        }}
      />
    );
  }
  ```

- **Performance note:** Materialized views deferred to Phase 2. Current indexed query approach sufficient for MVP (<10 NGOs, <500 issues). Will optimize when scale demands it (>50 NGOs, >5000 issues).

**Dependencies:** Story 3.1.1 (dashboard), Database indexes

**Story Points:** 5

---

### Story 3.1.4: Auto-Prioritized Issue Queue

**As an** NGO coordinator  
**I want** to see a prioritized list of issues to address  
**So that** I can focus on the most urgent and impactful problems

**Acceptance Criteria:**

- [ ] Issue queue displays on dashboard below KPI cards
- [ ] **Prioritization algorithm:** `priority_score = (verifications * 2) + (severity_weight) + (vulnerability_bonus)`
  - Verifications: 2 points per verification
  - Severity: High = 3, Medium = 2, Low = 1
  - Vulnerability bonus: +5 if issue in designated vulnerable zip code (Phase 2 feature)
- [ ] Sort order: Highest priority score first
- [ ] Issue queue table columns:
  - Thumbnail photo (first photo from report)
  - Category icon + label
  - Address (truncated to 30 chars with tooltip)
  - Severity indicator (color-coded)
  - Verification count badge
  - Priority score (numeric)
  - Actions dropdown (Create Action Card, Mark Resolved, View Details)
- [ ] Filters:
  - Category: All, Waste, Drainage
  - Status: All, Pending, Verified, In Progress
  - Date range: Last 7 days, 30 days, 90 days, All time
- [ ] Pagination: 20 issues per page with "Load More" button
- [ ] **Mobile view:** Accordion cards (vertical stack, tap to expand) - see Sally's wireframes in sprint-3-readiness-validation.md
- [ ] **Desktop view:** Table layout (7 columns)
- [ ] Loading skeleton while fetching issues
- [ ] **Empty state (new NGOs):** Show onboarding guidance instead of "No issues"
  ```tsx
  {
    issues.length === 0 && (
      <EmptyStateCard
        icon={<Search />}
        title="No Issues in Your Coverage Area Yet"
        description="Don't worry! Here's what happens next:"
        steps={[
          '📍 Community members report issues in your area',
          '✓ Issues get verified by other community members',
          "📋 They'll appear here for you to address",
          '🧹 Create Action Cards to organize cleanups',
        ]}
        cta={{
          text: 'Review Coverage Area Settings',
          link: '/org/settings',
        }}
      />
    );
  }
  ```
- [ ] Error handling: "Unable to load issues. Refresh page."

**Technical Notes:**

- **Optimized prioritization with computed column (per Winston's recommendation):**

  ```sql
  -- Add computed column for priority score (avoids recalculation on every query)
  ALTER TABLE issues
  ADD COLUMN priority_score INT GENERATED ALWAYS AS (
    (verifications_count * 2) +
    (CASE severity
      WHEN 'high' THEN 3
      WHEN 'medium' THEN 2
      ELSE 1
    END)
  ) STORED;

  -- Index the computed column for O(log n) performance
  CREATE INDEX idx_issues_priority_score ON issues(priority_score DESC)
  WHERE status != 'resolved' AND is_flagged = false;
  ```

- Optimized query (uses indexed computed column):
  ```sql
  SELECT i.*
  FROM issues i
  WHERE i.address ILIKE '%' || $1 || '%' -- MVP: text match on coverage area
    AND i.status != 'resolved'
    AND i.is_flagged = false
  ORDER BY i.priority_score DESC -- Fast index scan!
  LIMIT 20 OFFSET $2;
  ```
- Additional indexes for filtering:
  ```sql
  CREATE INDEX idx_issues_coverage_status ON issues(address, status)
  WHERE is_flagged = false;
  ```
- **Performance improvement:** Query complexity reduced from O(n log n) to O(log n) via indexed computed column

**Dependencies:** Story 3.1.3 (dashboard layout), Story 2.1.4 (verifications_count)

**Story Points:** 5

---

### Story 3.1.5: CSV Export for Funder Reports

**As an** NGO coordinator  
**I want** to export funder-ready reports as CSV  
**So that** I can share impact data with donors and funders

**Acceptance Criteria:**

- [ ] "Export CSV" button on dashboard (top-right corner)
- [ ] Export includes all issues in coverage area (no pagination limit)
- [ ] **CSV columns (RFC 4180 compliant):**
  - Issue ID
  - Date Reported
  - Category
  - Severity
  - Address
  - Status
  - Verifications Count
  - Resolution Date (if resolved)
  - Action Card ID (if linked)
  - Volunteer Hours (if Action Card completed)
- [ ] **Performance requirement:** Export completes in <10 seconds for datasets up to 10,000 records (NFR5)
- [ ] **Compliance requirement:** CSV conforms to RFC 4180 standard (NFR42 - validated via automated CI/CD tests)
- [ ] Loading state: Progress indicator during export generation
- [ ] Download triggers automatically when CSV ready
- [ ] Filename: `ecopulse-{org-name}-{date}.csv` (e.g., `ecopulse-green-lagos-2024-03-15.csv`)
- [ ] Error handling:
  - Export failed: "Export failed. Try again or contact support."
  - Timeout (>10s): "Export taking longer than expected. We'll email you when ready." (Phase 2)
- [ ] **Data accuracy requirement:** <0.1% error rate on CSV exports (per NFR - business-critical for NGO donor trust)

**Technical Notes:**

- Server Action: `/app/actions/exportCSV.ts`
- CSV generation with `papaparse` library:

  ```typescript
  'use server';
  import Papa from 'papaparse';

  export async function exportOrgIssuesCSV(orgId: string) {
    const { data: org } = await supabase
      .from('organizations')
      .select('name, coverage_area')
      .eq('id', orgId)
      .single();

    const { data: issues } = await supabase
      .from('issues')
      .select(
        `
        id,
        created_at,
        category,
        severity,
        address,
        status,
        verifications_count,
        resolved_at,
        action_cards:action_card_issues!issue_id (
          action_card:action_cards (
            id,
            duration_hours,
            status
          )
        )
      `
      )
      .ilike('address', `%${org.coverage_area}%`)
      .order('created_at', { ascending: false });

    const csvData = issues.map((issue) => ({
      'Issue ID': issue.id,
      'Date Reported': new Date(issue.created_at).toISOString().split('T')[0],
      Category: issue.category,
      Severity: issue.severity,
      Address: issue.address,
      Status: issue.status,
      'Verifications Count': issue.verifications_count,
      'Resolution Date': issue.resolved_at || 'N/A',
      'Action Card ID': issue.action_cards[0]?.action_card.id || 'N/A',
      'Volunteer Hours': issue.action_cards[0]?.action_card.duration_hours || 0,
    }));

    const csv = Papa.unparse(csvData, {
      header: true,
      quotes: true, // RFC 4180 compliance
      delimiter: ',',
      newline: '\r\n', // Windows line endings for Excel compatibility
    });

    return {
      success: true,
      csv,
      filename: `ecopulse-${org.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`,
    };
  }
  ```

- Client-side download trigger:

  ```typescript
  async function handleExport() {
    const result = await exportOrgIssuesCSV(orgId);

    if (result.success) {
      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = result.filename;
      link.click();
    }
  }
  ```

- CI/CD validation test (Vitest):

  ```typescript
  import Papa from 'papaparse';

  test('CSV export conforms to RFC 4180', async () => {
    const csv = await exportOrgIssuesCSV('test-org-id');
    const parsed = Papa.parse(csv.csv, { header: true });

    expect(parsed.errors).toHaveLength(0);
    expect(parsed.data[0]).toHaveProperty('Issue ID');
    expect(parsed.data[0]).toHaveProperty('Date Reported');
    // Validate all columns present
  });

  test('CSV export handles edge cases with special characters', async () => {
    // Test data with problematic characters (per Murat's recommendation)
    const testIssue1 = await createTestIssue({
      address: 'Street with "quotes" and, commas',
      category: 'waste',
      severity: 'high',
    });
    const testIssue2 = await createTestIssue({
      note: 'Multi\\nline\\nnote with\\ttabs',
      address: "O'Connell Street", // Single quote
    });

    const csv = await exportOrgIssuesCSV('test-org-id');
    const parsed = Papa.parse(csv.csv, { header: true });

    // Verify proper escaping of quotes and commas
    const issue1Data = parsed.data.find((d) => d['Issue ID'] === testIssue1.id);
    expect(issue1Data.Address).toBe('Street with "quotes" and, commas');

    // Verify newlines and tabs are escaped/replaced
    const issue2Data = parsed.data.find((d) => d['Issue ID'] === testIssue2.id);
    expect(issue2Data.Address).toBe("O'Connell Street"); // Single quote preserved
    expect(issue2Data.Note).not.toContain('\\n'); // Newlines escaped
    expect(issue2Data.Note).not.toContain('\\t'); // Tabs replaced
  });

  test('CSV export handles empty and null values', async () => {
    const testIssue = await createTestIssue({
      note: null, // Null note
      resolved_at: null, // Not resolved
    });

    const csv = await exportOrgIssuesCSV('test-org-id');
    const parsed = Papa.parse(csv.csv, { header: true });

    const issueData = parsed.data.find((d) => d['Issue ID'] === testIssue.id);
    expect(issueData['Resolution Date']).toBe('N/A');
    expect(issueData.Note).toBeDefined(); // Should have some default value
  });
  ```

**Dependencies:** Story 3.1.4 (issue queue)

**Note:** Action Card columns (Action Card ID, Volunteer Hours) added in Story 3.2.7 after Epic 3.2 completes

**Story Points:** 5

---

### Story 3.1.6: NGO Onboarding Wizard (OPTIONAL - Buffer Story)

**As a** new NGO coordinator  
**I want** a guided onboarding flow  
**So that** I can quickly set up my organization profile

**Acceptance Criteria:**

- [ ] Multi-step wizard triggered on first login for new NGOs (no coverage area set)
- [ ] Step 1: Welcome + Value proposition
- [ ] Step 2: Organization details (name, description, contact email)
- [ ] Step 3: Coverage area selection (city/region)
- [ ] Step 4: Logo upload (optional)
- [ ] Step 5: Success confirmation + "View Dashboard" CTA
- [ ] Progress indicator (step X of 5)
- [ ] "Skip" option on each step (saves partial progress)
- [ ] Mobile-optimized (full-screen modal)
- [ ] **OPTIONAL STATUS:** Defer to Sprint 4 if capacity constraints arise

**Technical Notes:**

- Wizard modal component with Radix UI Dialog
- Store wizard progress in localStorage (resume if interrupted)
- Mark wizard complete: `users.onboarding_completed = true`

**Dependencies:** Story 3.1.2 (org profile management)

**Story Points:** 3 (OPTIONAL - implement only if ahead of schedule)

---

### Story 3.1.7: Mobile-First NGO Dashboard Optimization

**As an** NGO coordinator on mobile  
**I want** a mobile-optimized dashboard experience  
**So that** I can manage my organization from my phone (Africa-First design)

**Acceptance Criteria:**

- [ ] **KPI Cards: Horizontal scroll carousel (320px-768px)**
  - Swipe left/right to view all 4 KPI cards
  - Dot indicators showing position (●○○○)
  - Auto-advance optional (3s per card)
  - Full-width cards (no side-by-side layout)
  - See Sally's wireframes in sprint-3-readiness-validation.md Appendix A
- [ ] **Issue Queue: Accordion cards (not table)**
  - Vertical stack of collapsible cards
  - Tap card header to expand/collapse
  - Expanded view shows: photo gallery, description, action buttons
  - Actions: "Create Action Card", "Mark Resolved", "View Details"
  - See Sally's wireframe 2 for interaction design
- [ ] **Mobile filters: Bottom sheet**
  - Filter button opens slide-up modal (category, status, date range)
  - Apply filters → close sheet → see filtered results
  - Clear filters button
- [ ] **CSV export: iOS Safari handling**
  - Detect iOS: `/iPad|iPhone|iPod/.test(navigator.userAgent)`
  - Show warning: "CSV export works best on desktop. On mobile, file opens in new tab."
  - iOS: Open CSV in new tab (user can "Save to Files")
  - Android: Direct download works normally
- [ ] **Navigation: Hamburger menu**
  - Icon-driven navigation (Hugeicons only, minimal text)
  - Touch targets: 56x56px minimum
  - Active page highlighting
- [ ] **Performance: <2s dashboard load on 3G**
  - Lazy load below-fold content
  - Compress images (WebP format)
  - CSS scroll-snap for carousel (no JS library)
- [ ] **Accessibility: Touch target compliance**
  - All interactive elements ≥44x44px (WCAG 2.1 AA)
  - Screen reader labels on all icons
  - Focus indicators visible (2px solid #059669)

**Technical Notes:**

- **KPI Carousel (CSS scroll-snap):**
  ```tsx
  <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
    {kpis.map((kpi, i) => (
      <div key={i} className="min-w-full snap-center px-4">
        <KPICard {...kpi} />
      </div>
    ))}
  </div>
  ```
- **Accordion cards (Radix UI Accordion):**

  ```tsx
  import * as Accordion from '@radix-ui/react-accordion';

  <Accordion.Root type="single" collapsible>
    {issues.map((issue) => (
      <Accordion.Item key={issue.id} value={issue.id}>
        <Accordion.Trigger>{/* Card header: photo, title, severity */}</Accordion.Trigger>
        <Accordion.Content>{/* Expanded: gallery, description, actions */}</Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion.Root>;
  ```

- **Mobile detection:**
  ```typescript
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  ```
- **CSS optimizations:**
  - Remove unused Tailwind classes (PurgeCSS)
  - Enable font subsetting (Latin + Basic Latin only)
  - Image lazy loading: `loading="lazy"`

**Design Reference:** See sprint-3-readiness-validation.md Appendix A (Sally's ASCII wireframes)

**Dependencies:** Stories 3.1.1-3.1.5 (dashboard components exist)

**Story Points:** 5 (HIGH PRIORITY - Africa-First requirement)

---

## Epic 3.2: Action Cards System

**Epic Goal:** Enable NGOs to create volunteer campaigns (Action Cards) with capacity limits, link them to issues, and track volunteer participation and completion.

**Total Points:** 22 (updated: Story 3.2.3 increased to 5 pts, Story 3.2.7 added for 2 pts)

### Story 3.2.1: Action Card Creation with Templates

**As an** NGO coordinator  
**I want** to create Action Card campaigns  
**So that** I can organize community volunteers to resolve issues

**Acceptance Criteria:**

- [ ] "Create Action Card" button on NGO dashboard
- [ ] Action Card creation modal with form fields:
  - **Template selection:** Dropdown with 6 deterministic templates (2 categories × 3 severities)
    - Waste - Low: "Litter Cleanup"
    - Waste - Medium: "Waste Removal"
    - Waste - High: "Hazardous Waste Cleanup"
    - Drainage - Low: "Drain Inspection"
    - Drainage - Medium: "Drain Clearing"
    - Drainage - High: "Drainage System Repair"
  - Title (pre-filled from template, editable)
  - Description (pre-filled from template, editable, 0-500 characters)
  - Event date & time (date picker + time picker)
  - Location (address input with map preview)
  - Capacity limit (1-100 volunteers)
  - Duration (hours, 1-8 hours)
  - Safety notes (optional, pre-filled from template)
  - Checklist items (pre-filled from template, editable list)
- [ ] **Template customization:**
  - Platform admin defaults (if `organization_id IS NULL`)
  - Org-specific templates (if `organization_id = current_org_id`)
  - NGO coordinators can save custom templates for reuse
- [ ] Attach issues: Multi-select dropdown of issues in coverage area
  - Filter by category matching Action Card category
  - Show issue address, severity, verification count
  - Bulk attach up to 20 issues per Action Card
- [ ] Form validation:
  - Title required (5-100 characters)
  - Event date must be future date
  - Capacity >= 1
  - Duration 1-8 hours
- [ ] "Create Action Card" button (disabled until validation passes)
- [ ] Success toast: "Action Card created! Volunteers can now sign up."
- [ ] Loading state during creation
- [ ] Error handling:
  - Creation failed: "Failed to create Action Card. Try again."
  - Network error: "Connection error. Check network and retry."

**Technical Notes:**

- Server Action: `/app/actions/createActionCard.ts`
- Action cards table schema:

  ```sql
  CREATE TABLE action_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    template_id UUID REFERENCES action_card_templates(id),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location TEXT NOT NULL,
    lat FLOAT8 NOT NULL,
    lng FLOAT8 NOT NULL,
    capacity INT NOT NULL CHECK (capacity >= 1 AND capacity <= 100),
    duration_hours INT NOT NULL CHECK (duration_hours >= 1 AND duration_hours <= 8),
    safety_notes TEXT,
    checklist_items JSONB, -- Array of {item: string, completed: boolean}
    status TEXT DEFAULT 'upcoming', -- 'upcoming', 'in_progress', 'completed', 'cancelled'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE action_card_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id), -- NULL = platform defaults
    category TEXT NOT NULL, -- 'waste' or 'drainage'
    severity TEXT NOT NULL, -- 'low', 'medium', 'high'
    title TEXT NOT NULL,
    description TEXT,
    safety_notes TEXT,
    checklist_items JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE action_card_issues (
    action_card_id UUID REFERENCES action_cards(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    PRIMARY KEY (action_card_id, issue_id)
  );
  ```

- Template query:
  ```typescript
  const { data: templates } = await supabase
    .from('action_card_templates')
    .select('*')
    .or(`organization_id.is.null,organization_id.eq.${orgId}`)
    .order('category, severity');
  ```

**Dependencies:** Story 3.1.1 (NGO dashboard), Database schema

**Story Points:** 5

---

### Story 3.2.2: Action Card Listing & Detail Pages

**As a** community member  
**I want** to browse available Action Cards  
**So that** I can find volunteer opportunities

**Acceptance Criteria:**

- [ ] Action Cards page route: `/action-cards` (public, no auth required)
- [ ] Display all upcoming Action Cards (status = 'upcoming', event_date >= today)
- [ ] Action Card list view:
  - Card layout: Thumbnail (organization logo), title, date, location, capacity (e.g., "5/20 signed up")
  - Filter by: Category (Waste, Drainage), Date (This week, This month, All)
  - Sort by: Soonest first, Most popular (highest sign-up count)
- [ ] Mobile: Vertical card stack (1 column)
- [ ] Desktop: Grid layout (2-3 cards per row)
- [ ] Each card shows:
  - Organization logo + name
  - Action Card title + category icon
  - Event date & time (formatted: "Saturday, March 15, 10:00 AM")
  - Location (truncated address + map icon)
  - Capacity progress bar: "5/20 volunteers"
  - "Sign Up" button (disabled if full or past date)
- [ ] Tap card opens detail page: `/action-cards/[id]`
- [ ] Action Card detail page displays:
  - Full description
  - Event date, time, location (with map preview)
  - Safety notes (if provided)
  - Checklist items
  - Attached issues list (with links to issue detail pages)
  - Volunteer list (usernames + avatars of signed-up users)
  - "Sign Up" button (authenticated users only, anonymous see "Login to volunteer")
- [ ] Empty state: "No upcoming Action Cards. Check back soon!"
- [ ] Loading skeleton while fetching
- [ ] Error handling: "Unable to load Action Cards. Refresh page."

**Technical Notes:**

- Query:
  ```typescript
  const { data: actionCards } = await supabase
    .from('action_cards')
    .select(
      `
      id,
      title,
      description,
      event_date,
      location,
      capacity,
      duration_hours,
      safety_notes,
      checklist_items,
      organization:organizations!organization_id (
        name,
        logo_url
      ),
      participants:action_card_participants (count),
      attached_issues:action_card_issues (
        issue:issues (
          id,
          category,
          severity,
          address
        )
      )
    `
    )
    .eq('status', 'upcoming')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true });
  ```
- Capacity calculation:
  ```typescript
  const spotsLeft = actionCard.capacity - actionCard.participants[0].count;
  const isFull = spotsLeft <= 0;
  ```

**Dependencies:** Story 3.2.1 (Action Card creation)

**Story Points:** 4

---

### Story 3.2.3: Volunteer Sign-Up & Participation Tracking

**As a** community member  
**I want** to sign up for Action Cards  
**So that** I can volunteer to help resolve issues

**Acceptance Criteria:**

- [ ] "Sign Up" button on Action Card detail page
- [ ] **Auth requirement:** Authenticated users only (anonymous users see "Login to volunteer" link)
- [ ] **Capacity check:** Button disabled if Action Card full (`participants >= capacity`)
- [ ] Tap "Sign Up" → **enhanced confirmation modal (per Sally's UX recommendations):**
  - **Header:** Organization logo + Action Card title + event date/time
  - **Section: What We'll Do**
    - Checklist preview (first 3 items)
    - Duration display ("[X] hours")
  - **Section: What to Bring**
    - Safety notes (from template)
    - Equipment list (if applicable)
  - **Section: Where We'll Meet**
    - Mini map preview (lat/lng)
    - Full address text
  - **Section: Who's Coming**
    - Avatar stack (first 5 participants)
    - Participant count ("[X] volunteers signed up")
  - **Actions:** "Cancel" and "Confirm Sign-Up" buttons
- [ ] After confirmation:
  - Insert record into `action_card_participants` table
  - Increment participant count (denormalized counter for performance)
  - Send confirmation email (Phase 2 - reminder 24h before event)
  - Success toast: "Signed up! We'll remind you before the event."
- [ ] **Prevent duplicate sign-ups:** One user can only sign up once per Action Card
  - Show "Already signed up" badge if user already registered
  - "Cancel Sign-Up" button for registered users
- [ ] Participant list displays on Action Card detail page:
  - Avatars + usernames of all signed-up volunteers
  - "You" badge for current user
  - Privacy: Only show first 10 participants publicly, full list to NGO coordinators
- [ ] User profile shows signed-up Action Cards:
  - "My Action Cards" tab on profile page
  - Filter: Upcoming, Past
  - Each card shows event date, title, organization, "Cancel Sign-Up" button
- [ ] Cancel sign-up:
  - "Are you sure?" confirmation modal
  - Remove from `action_card_participants`
  - Decrement participant count
  - Success toast: "Sign-up cancelled"
- [ ] Error handling:
  - Action Card full: "This event is full. Try another opportunity."
  - Already signed up: "You're already registered for this event."
  - Network error: "Sign-up failed. Check connection and retry."

**Technical Notes:**

- Participants table:
  ```sql
  CREATE TABLE action_card_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_card_id UUID REFERENCES action_cards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    signed_up_at TIMESTAMP DEFAULT NOW(),
    attended BOOLEAN DEFAULT false, -- Phase 2: GPS check-in tracking
    proof_uploaded BOOLEAN DEFAULT false,
    UNIQUE(action_card_id, user_id)
  );
  ```
- Sign-up Server Action:

  ```typescript
  'use server';
  export async function signUpForActionCard(actionCardId: string, userId: string) {
    // Check capacity
    const { data: actionCard } = await supabase
      .from('action_cards')
      .select('capacity, participants:action_card_participants(count)')
      .eq('id', actionCardId)
      .single();

    if (actionCard.participants[0].count >= actionCard.capacity) {
      return { success: false, error: 'action_card_full' };
    }

    // Insert participant
    const { error } = await supabase
      .from('action_card_participants')
      .insert({ action_card_id: actionCardId, user_id: userId });

    if (error?.code === '23505') {
      // Unique constraint violation
      return { success: false, error: 'already_signed_up' };
    }

    return { success: true };
  }
  ```

**Dependencies:** Story 3.2.2 (Action Card detail page), Story 1.4.1 (auth)

**Story Points:** 5 (increased from 4 due to enhanced modal)

---

### Story 3.2.4: Action Card Completion with Before/After Proof

**As an** NGO coordinator  
**I want** to upload resolution proof photos  
**So that** I can mark Action Cards as complete and resolve attached issues

**Acceptance Criteria:**

- [ ] "Mark as Complete" button on Action Card page (visible only to NGO coordinators)
- [ ] Completion modal with form:
  - **Before photo:** Upload (required, from Action Card event)
  - **After photo:** Upload (required, showing resolution)
  - **Side-by-side preview (per Sally's UX recommendations):**

    ```tsx
    <ComparisonView>
      <BeforePhoto>
        <img src={beforeUrl} />
        <Label>BEFORE</Label>
        <ReplaceButton>Change Photo</ReplaceButton>
      </BeforePhoto>

      <AfterPhoto>
        <img src={afterUrl} />
        <Label>AFTER</Label>
        <ReplaceButton>Change Photo</ReplaceButton>
      </AfterPhoto>
    </ComparisonView>
    ```

  - **Validation checks:**
    - ✓ Both photos uploaded
    - ⚠️ Warning if photos appear identical (encourage different angles)
    - ⚠️ Optional: EXIF timestamp validation (after photo taken after before photo)
  - Completion notes (optional, 0-500 characters)
  - **Confirmation dialog before submitting:**
    - "You are about to mark this Action Card as complete and resolve [X] attached issues."
    - List all attached issue addresses
    - "This action cannot be undone. Continue?"
    - "Cancel" and "Confirm Completion" buttons

- [ ] Photo uploads:
  - Same EXIF stripping as reports (reuse uploadPhoto Server Action)
  - Max 2 photos (1 before + 1 after) required
  - Max 10MB per photo
  - Compression: 1920x1080, 85% JPEG quality
  - Upload to Supabase Storage: `action-card-proofs/{actionCardId}/before.jpg` and `after.jpg`
- [ ] After completion:
  - Update Action Card status to 'completed'
  - **Bulk resolve attached issues:** Set all linked issues to status = 'resolved', resolved_at = NOW()
  - Award volunteer hours to all participants: Update `users` table with volunteer_hours += action_card.duration_hours
  - Send completion email to participants (Phase 2)
  - Success toast: "Action Card completed! {X} issues marked as resolved."
- [ ] Before/after photos display on Action Card detail page after completion
- [ ] **Verification integrity:** Zero data loss requirement for proof photos (business-critical per NFR)
- [ ] Error handling:
  - Photo upload failed: "Upload failed. Check connection and retry."
  - Completion failed: "Completion failed. Try again or contact support."
  - Network error: Retry mechanism (3 attempts)

**Technical Notes:**

- Server Action: `/app/actions/completeActionCard.ts`
- **Bulk resolution with transaction safety (per Murat's recommendation):**

  ```typescript
  'use server';
  export async function completeActionCard(data: {
    action_card_id: string;
    before_photo_url: string;
    after_photo_url: string;
    notes?: string;
  }) {
    // Use Supabase transaction for atomicity
    const { data: result, error } = await supabase.rpc('complete_action_card_transaction', {
      p_action_card_id: data.action_card_id,
      p_before_photo_url: data.before_photo_url,
      p_after_photo_url: data.after_photo_url,
      p_notes: data.notes,
    });

    if (error) {
      console.error('Action Card completion failed:', error);
      return { success: false, error: error.message };
    }

    return { success: true, resolved_count: result.resolved_count };
  }
  ```

- **PostgreSQL transaction function (ensures all-or-nothing atomicity):**

  ```sql
  CREATE FUNCTION complete_action_card_transaction(
    p_action_card_id UUID,
    p_before_photo_url TEXT,
    p_after_photo_url TEXT,
    p_notes TEXT
  )
  RETURNS JSON AS $$
  DECLARE
    v_attached_issues UUID[];
    v_duration_hours INT;
    v_resolved_count INT;
  BEGIN
    -- Update Action Card status
    UPDATE action_cards
    SET status = 'completed',
        before_photo_url = p_before_photo_url,
        after_photo_url = p_after_photo_url,
        completion_notes = p_notes
    WHERE id = p_action_card_id
    RETURNING duration_hours INTO v_duration_hours;

    -- Get attached issues
    SELECT ARRAY_AGG(issue_id) INTO v_attached_issues
    FROM action_card_issues
    WHERE action_card_id = p_action_card_id;

    -- Bulk resolve attached issues
    IF v_attached_issues IS NOT NULL THEN
      UPDATE issues
      SET status = 'resolved',
          resolved_at = NOW()
      WHERE id = ANY(v_attached_issues);

      GET DIAGNOSTICS v_resolved_count = ROW_COUNT;
    ELSE
      v_resolved_count := 0;
    END IF;

    -- Award volunteer hours to all participants
    UPDATE users
    SET volunteer_hours = COALESCE(volunteer_hours, 0) + v_duration_hours
    WHERE id IN (
      SELECT user_id FROM action_card_participants
      WHERE action_card_id = p_action_card_id
    );

    -- Return result
    RETURN json_build_object(
      'resolved_count', v_resolved_count,
      'duration_hours', v_duration_hours
    );
  END;
  $$ LANGUAGE plpgsql;
  ```

- **E2E test for transaction rollback (per Murat's recommendation):**

  ```typescript
  test('Action Card completion rolls back on failure', async ({ page }) => {
    const actionCard = await createTestActionCard({
      organization_id: orgId,
      attached_issues: [issue1.id, issue2.id, issue3.id],
    });

    // Simulate failure by providing invalid photo URL
    const result = await completeActionCard({
      action_card_id: actionCard.id,
      before_photo_url: 'invalid-url', // This will fail
      after_photo_url: 'valid-url.jpg',
    });

    expect(result.success).toBe(false);

    // Verify rollback: Action Card should still be 'upcoming'
    const updatedCard = await getActionCard(actionCard.id);
    expect(updatedCard.status).toBe('upcoming'); // Not 'completed'

    // Verify rollback: Issues should still be 'pending'
    const issue1Status = await getIssue(issue1.id);
    expect(issue1Status.status).toBe('pending'); // Not 'resolved'
  });
  ```

- PostgreSQL function for volunteer hours:
  ```sql
  CREATE FUNCTION increment_volunteer_hours(uid UUID, hours INT)
  RETURNS VOID AS $$
  BEGIN
    UPDATE users
    SET volunteer_hours = COALESCE(volunteer_hours, 0) + hours
    WHERE id = uid;
  END;
  $$ LANGUAGE plpgsql;
  ```

**Dependencies:** Story 3.2.3 (participants), Story 0.4 (uploadPhoto)

**Story Points:** 5

---

### Story 3.2.5: Action Card Map View & Integration

**As a** community member  
**I want** to see Action Cards on the map  
**So that** I can find volunteer opportunities near me

**Acceptance Criteria:**

- [ ] Main map displays Action Card pins alongside issue pins
- [ ] Action Card pins use different icon: `Calendar` icon from Hugeicons
- [ ] Pin color: Blue (#3B82F6) to differentiate from issue pins (green/gray)
- [ ] Pin size: 44x44px touch target
- [ ] Tap Action Card pin opens summary card:
  - Event title
  - Organization logo + name
  - Event date & time
  - Capacity: "5/20 volunteers"
  - "View Details" button (links to Action Card detail page)
- [ ] Map filter panel includes "Action Cards" toggle:
  - Checkbox: "Show Action Cards"
  - Defaults to ON
  - Hide/show Action Card pins on toggle
- [ ] **Performance:** Action Card pins load with <1s delay (same as issue pins)
- [ ] Clustering: Action Cards cluster with issues (use react-leaflet-cluster)
- [ ] Mobile: Summary card slides up from bottom (bottom sheet)
- [ ] Desktop: Summary card displays as popup next to pin
- [ ] Accessible: ARIA labels on Action Card pins include event title and date

**Technical Notes:**

- Fetch Action Cards for map:
  ```typescript
  const { data: actionCards } = await supabase
    .from('action_cards')
    .select('id, title, event_date, lat, lng, capacity, organization:organizations(name, logo_url)')
    .eq('status', 'upcoming')
    .gte('event_date', new Date().toISOString())
    .within('lat', 'lng', bounds); // Map bounds for performance
  ```
- Action Card marker component:

  ```tsx
  export function ActionCardMarker({ actionCard }) {
    const icon = divIcon({
      html: renderToStaticMarkup(
        <div className="relative w-11 h-11">
          <Calendar className="text-blue-600" size={44} />
        </div>
      ),
    });

    return (
      <Marker position={[actionCard.lat, actionCard.lng]} icon={icon}>
        <Popup>
          <ActionCardSummary actionCard={actionCard} />
        </Popup>
      </Marker>
    );
  }
  ```

**Dependencies:** Story 3.2.2 (Action Card listing), Story 1.2.1 (map)

**Story Points:** 3

---

### Story 3.2.6: Volunteer Hours Tracking & Display

**As a** user  
**I want** to see my volunteer hours on my profile  
**So that** I can track my time contribution to the community

**Acceptance Criteria:**

- [ ] User profile displays volunteer hours metric:
  - "You volunteered {X} hours at {Y} Action Card events!"
  - Icon: Clock from Hugeicons
  - Celebratory message (not competitive language)
- [ ] Volunteer hours calculation:
  - Sum of `action_card.duration_hours` for all completed Action Cards where user participated
  - Only count Action Cards with status = 'completed'
- [ ] Profile activity feed shows volunteer hours earned:
  - "Earned 2 hours volunteering at Litter Cleanup on Main St"
  - Timestamp of Action Card completion
- [ ] NGO dashboard KPI card shows total volunteer hours (all participants in org's Action Cards)
- [ ] **Data integrity:** Volunteer hours only awarded after proof uploaded (not at sign-up)
- [ ] Empty state: "No volunteer hours yet. Sign up for an Action Card!"

**Technical Notes:**

- Query volunteer hours:
  ```typescript
  const { data: user } = await supabase
    .from('users')
    .select('volunteer_hours')
    .eq('id', userId)
    .single();
  ```
- Volunteer hours column added in Story 3.2.4 (increment_volunteer_hours function)

**Dependencies:** Story 3.2.4 (Action Card completion), Story 2.2.1 (profile page)

**Story Points:** 2

---

### Story 3.2.7: CSV Export Enhancement + Action Card Audit Log

**As an** NGO coordinator  
**I want** Action Card data included in CSV exports and audit trail for completions  
**So that** I can track volunteer contributions and maintain transparency

**Acceptance Criteria:**

- [ ] **Update CSV export (Story 3.1.5 enhancement):**
  - Add "Action Card ID" column (populate from action_card_issues join)
  - Add "Volunteer Hours" column (from action_cards.duration_hours where status = 'completed')
  - Handle NULL values gracefully ("N/A" for unlinked issues)
- [ ] **Create audit log table:**

  ```sql
  CREATE TABLE action_card_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_card_id UUID REFERENCES action_cards(id),
    action TEXT NOT NULL, -- 'created', 'completed', 'cancelled'
    performed_by UUID REFERENCES users(id),
    issues_affected INT, -- Count of issues resolved (for 'completed' action)
    before_photo_url TEXT,
    after_photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_audit_log_action_card ON action_card_audit_log(action_card_id);
  CREATE INDEX idx_audit_log_created_at ON action_card_audit_log(created_at DESC);
  ```

- [ ] **Log Action Card events:**
  - Created: When Story 3.2.1 creates new Action Card
  - Completed: When Story 3.2.4 marks Action Card complete
  - Cancelled: When coordinator cancels event (Phase 2)
- [ ] **Audit log viewer (NGO coordinator only):**
  - Accessible from Action Card detail page
  - Show timeline of events (created → completed)
  - Display: Timestamp, action type, performer, affected issues count
  - Photos viewable for 'completed' events
- [ ] **CSV update Server Action:**
  ```typescript
  // Update exportOrgIssuesCSV to include Action Card data
  const csvData = issues.map((issue) => ({
    'Issue ID': issue.id,
    'Date Reported': new Date(issue.created_at).toISOString().split('T')[0],
    Category: issue.category,
    Severity: issue.severity,
    Address: issue.address,
    Status: issue.status,
    'Verifications Count': issue.verifications_count,
    'Resolution Date': issue.resolved_at || 'N/A',
    'Action Card ID': issue.action_cards[0]?.action_card.id || 'N/A', // NEW
    'Volunteer Hours': issue.action_cards[0]?.action_card.duration_hours || 0, // NEW
  }));
  ```
- [ ] **Audit log insertion (in Story 3.2.4 completion function):**
  ```typescript
  await supabase.from('action_card_audit_log').insert({
    action_card_id: data.action_card_id,
    action: 'completed',
    performed_by: auth.uid(),
    issues_affected: result.resolved_count,
    before_photo_url: data.before_photo_url,
    after_photo_url: data.after_photo_url,
    notes: data.notes,
  });
  ```

**Technical Notes:**

- Audit log provides transparency for funders (who completed what, when)
- Enables future "undo" functionality (Phase 2 - revert completion within 24h)
- CSV columns match NFR42 RFC 4180 compliance (existing tests already validate)

**Dependencies:** Story 3.1.5 (CSV export), Story 3.2.4 (Action Card completion)

**Story Points:** 2

---

## Epic 3.3: Contact Directory for NGO Discovery

**Epic Goal:** Enable public users to discover NGOs via searchable directory, with SEO-indexed organization profiles for funder visibility.

**Total Points:** 6

### Story 3.3.1: Organization Directory Page

**As a** public user or funder  
**I want** to browse NGOs working on environmental issues  
**So that** I can discover organizations to support or partner with

**Acceptance Criteria:**

- [ ] Directory route: `/organizations` (public, no auth required)
- [ ] Display all organizations with verified resolutions > 0 (exclude inactive orgs)
- [ ] Organization card shows:
  - Logo (or default icon)
  - Organization name
  - Coverage area (city/region)
  - Issues addressed count
  - Verified resolutions count
  - "View Profile" button
- [ ] Filter options:
  - City/region dropdown (populated from org coverage areas)
  - Category: All, Waste Focus, Drainage Focus (based on resolved issues)
- [ ] Sort options:
  - Most impact (highest verified resolutions count)
  - Alphabetical (A-Z)
  - Newest organizations
- [ ] Search bar: Filter by organization name (client-side fuzzy search)
- [ ] Mobile: Vertical card stack (1 column)
- [ ] Desktop: Grid layout (3 cards per row)
- [ ] Pagination: 20 organizations per page with "Load More" button
- [ ] Empty state: "No organizations found. Try adjusting filters."
- [ ] Loading skeleton while fetching
- [ ] Error handling: "Unable to load organizations. Refresh page."
- [ ] **SEO optimization:** Server-side rendering for search engine indexing

**Technical Notes:**

- Query organizations:

  ```typescript
  export async function OrganizationsPage() {
    const { data: orgs } = await supabase
      .from('organizations')
      .select(`
        id,
        name,
        logo_url,
        coverage_area,
        kpis:ngo_dashboard_kpis!organization_id (
          issues_addressed,
          verified_reports
        )
      `)
      .gt('kpis.verified_reports', 0) // Only show active orgs
      .order('kpis.verified_reports', { ascending: false });

    return <OrganizationGrid organizations={orgs} />;
  }
  ```

- SEO metadata:
  ```tsx
  export const metadata: Metadata = {
    title: 'Environmental NGOs Directory | EcoPulse',
    description:
      'Discover environmental organizations working to resolve waste and drainage issues across Africa.',
    openGraph: {
      title: 'Environmental NGOs Directory',
      description: 'Find NGOs making an impact on environmental issues',
      images: ['/og-directory.jpg'],
    },
  };
  ```

**Dependencies:** Story 3.1.2 (organization profiles), Story 3.1.3 (KPIs)

**Story Points:** 4

---

### Story 3.3.2: Public Organization Profile Pages (SEO-Indexed)

**As a** public user or funder  
**I want** to view an organization's public profile  
**So that** I can learn about their impact and how to support them

**Acceptance Criteria:**

- [ ] Organization profile route: `/organizations/[slug]` (public, SEO-indexed)
- [ ] Slug format: `org-name-lowercase-with-dashes` (e.g., `/organizations/green-lagos-initiative`)
- [ ] Profile page displays:
  - Organization logo (large)
  - Name, description, coverage area
  - Contact email (obfuscated: `contact[at]greenlondon.org` to prevent scraping)
  - Website URL (if provided)
  - **Impact metrics (public):**
    - Issues addressed
    - Verified resolutions
    - Volunteer hours (total from all Action Cards)
  - **Recent Action Cards:** List of upcoming Action Cards (max 5)
  - **Recent resolutions:** Before/after photo gallery of completed Action Cards
- [ ] "Contact Organization" button (mailto: link)
- [ ] "Support Us" section (optional, for Phase 2 donation integration)
- [ ] **SEO optimization:**
  - Server-side rendering (SSR) for search engines
  - OpenGraph tags for social media sharing
  - Structured data (JSON-LD) for Google rich results
- [ ] Mobile-friendly layout (responsive cards)
- [ ] Loading skeleton while fetching
- [ ] 404 page if organization not found
- [ ] Error handling: "Unable to load organization. Refresh page."

**Technical Notes:**

- Dynamic route with SSR:

  ```tsx
  export async function OrganizationProfilePage({ params }: { params: { slug: string } }) {
    const { data: org } = await supabase
      .from('organizations')
      .select(
        `
        *,
        kpis:ngo_dashboard_kpis!organization_id (
          issues_addressed,
          verified_reports,
          volunteer_hours
        ),
        action_cards:action_cards (
          id,
          title,
          event_date,
          capacity,
          participants:action_card_participants(count)
        ) WHERE status = 'upcoming' LIMIT 5,
        resolutions:action_cards (
          before_photo_url,
          after_photo_url,
          title
        ) WHERE status = 'completed' LIMIT 6
      `
      )
      .eq('slug', params.slug)
      .single();

    if (!org) {
      notFound();
    }

    return <OrganizationProfile org={org} />;
  }

  export async function generateMetadata({ params }): Promise<Metadata> {
    const { data: org } = await supabase
      .from('organizations')
      .select('name, description, logo_url')
      .eq('slug', params.slug)
      .single();

    return {
      title: `${org.name} | EcoPulse`,
      description: org.description || `Environmental organization working in ${org.coverage_area}`,
      openGraph: {
        title: org.name,
        description: org.description,
        images: [org.logo_url],
      },
    };
  }
  ```

- Add `slug` column to organizations table:
  ```sql
  ALTER TABLE organizations ADD COLUMN slug TEXT UNIQUE;
  CREATE INDEX idx_organizations_slug ON organizations(slug);
  ```

**Dependencies:** Story 3.3.1 (directory page), Story 3.2.4 (resolutions)

**Story Points:** 4

---

## Sprint 3 Summary

**Total Stories:** 13  
**Total Story Points:** 42

**Epics Breakdown:**

- Epic 3.1: NGO Dashboard & Analytics (5 stories, 16 points)
- Epic 3.2: Action Cards System (6 stories, 20 points)
- Epic 3.3: Contact Directory (2 stories, 6 points)

**Key Deliverables:**
✅ NGO dashboard with auto-prioritized issue queue  
✅ KPI cards with materialized views (<2s load time)  
✅ CSV exports for funder reports (RFC 4180 compliant)  
✅ Action Card creation with customizable templates  
✅ Volunteer sign-up and capacity tracking  
✅ Before/after proof photos for verified outcomes  
✅ Bulk issue resolution via Action Card completion  
✅ Volunteer hours tracking and display  
✅ Action Cards on map view  
✅ Public organization directory (SEO-indexed)  
✅ Organization profile pages with impact metrics

**Technical Achievements:**

- Materialized views for sub-2-second dashboard performance
- RFC 4180 CSV export compliance (validated in CI/CD)
- Bulk operations for Action Card → Issue resolution
- PostgreSQL functions for volunteer hours tracking
- SEO-optimized public pages for funder discovery

**Dependencies Resolved:**

- NGO dashboard depends on verifications (Sprint 2)
- Action Cards depend on organization profiles
- Volunteer hours depend on Action Card completion
- Contact directory depends on NGO KPIs

---

# Sprint 4A: Performance + Security + Monitoring (Weeks 10-12)

**Goal:** Optimize platform performance, implement anti-spam protection, and establish production monitoring before launch.

**Capacity:** 35 story points (3 weeks)

**Why Sprint 4A First:** Team review identified that performance optimization and security hardening are prerequisites for production launch. These must be stable before adding external API access.

**Key Deliverables:**

- Performance optimization (LCP <2.5s, map <1s load with 100 pins)
- Lighthouse CI enforcing Core Web Vitals in CI/CD
- Anti-spam rate limiting with cleanup jobs
- Cloudflare Turnstile CAPTCHA integration
- Production error tracking with Sentry
- Security hardening (proper CSP with nonces)
- Comprehensive smoke tests for launch

**Sprint 4A Epics:**

- Epic 4.2: Performance Optimization (10 points)
- Epic 4.3: Anti-Spam & Abuse Prevention (11 points)
- Epic 4.5: Production Monitoring & Security (14 points)

---

## Sprint 4A & 4B Prerequisites Checklist

**Timeline:** Week 9 (1 week before Sprint 4A starts)  
**Total Effort:** ~8 hours (can be parallelized)  
**Owner:** Technical lead + PM

### Category 1: Infrastructure Provisioning (Sprint 4B Blockers)

#### ✅ Prerequisite 1.1: Upstash Redis Account Setup

**Required For:** Story 4.1.1 (API rate limiting)  
**Effort:** 30 minutes  
**Owner:** Technical lead  
**Steps:**

1. Sign up at [upstash.com](https://upstash.com) (free tier: 10K commands/day)
2. Create Redis database (Global region for low latency)
3. Copy `UPSTASH_REDIS_URL` and `UPSTASH_REDIS_TOKEN`
4. Add to `.env.local` and Vercel environment variables
5. Test connection with simple SET/GET command

**Validation:**

```bash
# Test Redis connection
curl -X POST https://[your-endpoint].upstash.io/set/test/hello \
  -H "Authorization: Bearer [your-token]"
# Should return: {"result":"OK"}
```

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

#### ✅ Prerequisite 1.2: Resend Email Service Setup

**Required For:** Story 4.4.2 (Email notifications), Story 2.1.7 (verification emails)  
**Effort:** 1 hour  
**Owner:** Technical lead  
**Steps:**

1. **Create Resend account:**
   - Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day, 3K/month)
   - Verify email address
   - Create API key → Copy to `.env.local` as `RESEND_API_KEY`

2. **Domain verification (CRITICAL):**
   - Add your domain in Resend dashboard (e.g., `ecopulse.ng`)
   - Add DNS records to domain registrar:

     ```
     Type: TXT
     Name: resend._domainkey.ecopulse.ng
     Value: [provided by Resend]

     Type: TXT
     Name: _dmarc.ecopulse.ng
     Value: v=DMARC1; p=none; rua=mailto:dmarc@ecopulse.ng

     Type: TXT
     Name: ecopulse.ng
     Value: v=spf1 include:_spf.resend.com ~all
     ```

   - Wait 24-48 hours for DNS propagation
   - Verify in Resend dashboard (green checkmark)

3. **Test email send:**

   ```typescript
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);

   await resend.emails.send({
     from: 'test@ecopulse.ng',
     to: 'your-email@example.com',
     subject: 'Test Email',
     html: '<p>DNS configured correctly!</p>',
   });
   ```

**Validation:**

- [ ] API key works (test email sent successfully)
- [ ] Domain verified (green checkmark in Resend dashboard)
- [ ] SPF, DKIM, DMARC records pass verification
- [ ] Test email lands in inbox (NOT spam folder)

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**⚠️ WARNING:** If DNS verification fails, emails will be rejected or land in spam. This is a BLOCKER for Story 4.4.2.

---

### Category 2: Design & Planning (Sprint 4B Blockers)

#### ✅ Prerequisite 2.1: Token Management UI Design

**Required For:** Story 4.1.1 (API token generation UI)  
**Effort:** 2 hours  
**Owner:** UX Designer (Sally) + PM  
**Steps:**

1. **Determine UI placement in NGO dashboard:**
   - **Location:** NGO Dashboard → Settings → API Access tab
   - **Trigger:** "Generate New Token" button (top-right of API Access page)
   - **Alternative:** Could be sidebar item "API Tokens" under Dashboard
   - **Decision required:** PM + UX to finalize placement
2. **Design modal/dashboard section** for token generation:
   - Input: Token name (required, e.g., "Production App", "Mobile Client")
   - Dropdown: Expiration (30 days, 90 days, 1 year, Never)
   - Button: "Generate Token"
   - Success state: Display token ONCE with copy button + warning message
   - Warning text: "⚠️ Save this token now. You won't be able to see it again."
3. **Design token management table:**
   - Columns: Name, Created, Last Used, Requests Count, Expires, Status
   - Actions: Revoke button (confirmation modal)
   - Empty state: "No API tokens yet. Generate your first token to get started."
4. **Create Figma mockup** or low-fidelity wireframe
5. **Review with developer** (Amelia) for feasibility
6. **Document final placement** in mockup annotations

**Deliverable:** Figma link or screenshot in GitHub issue

**Validation:**

- [ ] Mockup approved by PM and developer
- [ ] All states covered (empty, loading, success, error, revoked)
- [ ] Mobile responsive design (320px-768px)

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

### Category 3: Baseline Measurements (Sprint 4A Validation)

#### ✅ Prerequisite 3.1: Performance Baseline Capture

**Required For:** Story 4.2.1 (validate improvement from baseline)  
**Effort:** 1 hour  
**Owner:** Technical lead  
**Steps:**

1. **Run Lighthouse on current build** (before optimization):
   ```bash
   npm run build
   npm run start
   npx lighthouse http://localhost:3000 --output json --output-path ./baseline-lighthouse.json
   ```
2. **Capture key metrics:**
   - LCP (Largest Contentful Paint): `____` ms
   - FID/INP: `____` ms
   - CLS (Cumulative Layout Shift): `____`
   - Performance score: `____`
3. **Test map load time** (current state):
   - 100 pins: `____` ms
   - 1,000 pins: `____` ms
4. **Document bundle sizes:**

   ```bash
   npm run build
   # Check .next/analyze output or use @next/bundle-analyzer
   ```

   - Total JS: `____` KB (gzipped)
   - Total CSS: `____` KB (gzipped)

5. **Save baseline report** to `_bmad-output/sprint-4-baseline.md`

**Deliverable:** Baseline report with all metrics documented

**Validation:**

- [ ] Lighthouse JSON report saved
- [ ] Map load times measured and documented
- [ ] Bundle sizes captured
- [ ] Baseline report reviewed by team

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

#### ✅ Prerequisite 3.2: Cloudflare Turnstile Account Setup

**Required For:** Story 4.3.2 (CAPTCHA integration)  
**Effort:** 20 minutes  
**Owner:** Technical lead  
**Steps:**

1. Log in to [Cloudflare dashboard](https://dash.cloudflare.com)
2. Navigate to Turnstile section
3. Create new site:
   - **Domain:** `ecopulse.ng` (or `localhost` for testing)
   - **Widget mode:** Invisible (for better UX)
4. Copy **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (`.env.local`)
5. Copy **Secret Key** → `TURNSTILE_SECRET_KEY` (`.env.local`, NEVER in `NEXT_PUBLIC_`)
6. Test widget renders:
   ```tsx
   import { Turnstile } from '@marsidev/react-turnstile';
   <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />;
   ```

**Validation:**

- [ ] Site and secret keys obtained
- [ ] Keys added to environment variables
- [ ] Test widget renders without errors
- [ ] Token verification works (fetch to Cloudflare API returns success)

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

#### ✅ Prerequisite 3.3: Leaflet Lazy-Load Refactoring Validation

**Required For:** Story 4.2.2 (Map optimization - lazy loading)
**Effort:** 30 minutes
**Owner:** Technical lead
**Steps:**

1. **Create feature branch:** `refactor/leaflet-lazy-load`
2. **Current state (Sprint 0.3):**
   ```tsx
   // app/layout.tsx - Global import
   import 'leaflet/dist/leaflet.css';
   ```
3. **Target state (Sprint 4A):**

   ```tsx
   // app/map/page.tsx - Dynamic import
   import dynamic from 'next/dynamic';
   const MapComponent = dynamic(() => import('./MapComponent'), {
     ssr: false,
     loading: () => <MapSkeleton />,
   });

   // MapComponent.tsx - CSS imported in component
   import 'leaflet/dist/leaflet.css';
   ```

4. **Test refactored code:**
   - Map renders without errors
   - Clustering (Story 1.2.3) still works
   - Custom markers (Story 0.3) display correctly
   - No CSS conflicts or missing styles
   - Mobile responsive (320px-768px)
5. **Performance validation:**
   - Run Lighthouse before/after refactor
   - Verify JS bundle size decreases
   - Confirm map page loads faster (lazy-loaded)
6. **Decision:**
   - ✅ **Pass:** Merge to main before Sprint 4A starts
   - ❌ **Fail:** Keep global import, update Story 4.2.2 AC to skip lazy-load

**Rollback Plan:**
If lazy-loading breaks production:

1. Revert to global CSS import
2. Accept performance trade-off (map library loaded on all pages)
3. Defer lazy-loading to Phase 2
4. Story 4.2.2 still achieves <1s load via other optimizations (clustering, bounds filtering)

**Validation:**

- [ ] Feature branch created and tested
- [ ] Map functionality verified (no regressions)
- [ ] Lighthouse performance compared (before/after)
- [ ] Decision documented: Pass/Fail + reasoning
- [ ] If Pass: Merged to main
- [ ] If Fail: Story 4.2.2 AC updated

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

### Category 4: Database Preparation (Sprint 4A & 4B)

#### ✅ Prerequisite 4.1: Create Supabase Staging Project

**Required For:** Testing migrations without affecting production  
**Effort:** 30 minutes  
**Owner:** Technical lead  
**Steps:**

1. Create new Supabase project: `ecopulse-staging`
2. Copy database schema from Sprint 0-3 migrations
3. Apply migrations to staging database
4. Configure Supabase Storage buckets (same as production)
5. Add staging connection strings to `.env.staging`
6. Test RLS policies work correctly

**Validation:**

- [ ] Staging database mirrors production schema
- [ ] Can insert test data without errors
- [ ] RLS policies prevent unauthorized access

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

## Prerequisites Summary Checklist

**Before Sprint 4A (Week 10) Starts:**

- [ ] ✅ Upstash Redis provisioned (30 min)
- [ ] ✅ Cloudflare Turnstile configured (20 min)
- [ ] ✅ Performance baselines captured (1 hour)
- [ ] ✅ Supabase staging project created (30 min)
- **Total Sprint 4A Prep:** ~2.5 hours

**Before Sprint 4B (Week 13) Starts:**

- [ ] ✅ Resend account + domain verification (1 hour + 24-48h DNS wait)
- [ ] ✅ Token management UI designed (2 hours)
- [ ] ✅ All Sprint 4A stories completed and stable
- **Total Sprint 4B Prep:** ~3 hours + DNS propagation time

**Critical Path:**

1. **Week 9 (Day 1):** Start Resend DNS verification (longest lead time)
2. **Week 9 (Day 2-3):** Complete all other prerequisites in parallel
3. **Week 9 (Day 4-5):** Validate all prerequisites, document any issues
4. **Week 9 (Day 5, 2pm):** Prerequisites Validation Meeting (Go/No-Go decision)
5. **Week 10 (Day 1):** Sprint 4A kickoff (ready to start)

**Prerequisites Validation Meeting:**

- **Date:** Week 9, Day 5 at 2:00 PM
- **Duration:** 1 hour
- **Attendees (Required):**
  - John (PM) - Meeting owner
  - Technical Lead - Reports on technical prerequisites
  - Bob (Scrum Master) - Validates sprint readiness
- **Attendees (Optional):**
  - Winston (Architect) - Available for technical questions
  - Amelia (Developer) - Available for implementation concerns
- **Agenda:**
  1. Review all prerequisite checkboxes (10 min)
  2. Validate service integrations (Upstash, Resend, Turnstile, Sentry) (15 min)
  3. Review Leaflet refactoring decision (Pass/Fail) (10 min)
  4. Confirm performance baselines captured (5 min)
  5. Review token UI mockup approval (5 min)
  6. Document credentials location (1Password/Vercel) (5 min)
  7. Go/No-Go decision for Sprint 4A (5 min)
  8. Contingency activation (if needed) (5 min)
- **Decision Criteria:**
  - ✅ **GO:** All "Sprint 4A Prep" items complete, no critical blockers
  - ⚠️ **GO with Contingency:** 1-2 minor blockers, contingency plan activated
  - ❌ **NO-GO:** Critical blockers (e.g., Resend DNS failed, no mitigation), delay Sprint 4A by 1 week
- **Outcome Documentation:**
  - Meeting notes published to `_bmad-output/sprint-4a-readiness.md`
  - Go/No-Go decision recorded with reasoning
  - Action items for any remaining prerequisites

**Contingency Plan:**

- If Resend DNS fails → Use Supabase built-in email (limited to 3 emails/hour) temporarily
- If Upstash Redis unavailable → Use Supabase database table for rate limiting (slower but functional)
- If Cloudflare Turnstile fails → Defer Story 4.3.2 to Phase 2, rely on rate limiting only
- If UI mockup delayed → Use text-based modal (basic HTML), improve in Phase 2

---

**PM Sign-Off Required Before Sprint 4A:**

- [ ] All "Sprint 4A Prep" checkboxes completed
- [ ] Performance baseline report reviewed
- [ ] Redis and Turnstile tested and working
- [ ] Team has access to all credentials

**Date:** \***\*\_\_\_\_\*\***  
**Signed:** \***\*\_\_\_\_\*\*** (John, PM)

---

## Epic 4.2: Performance Optimization

**Epic Goal:** Validate and optimize performance to meet Core Web Vitals targets (LCP <2.5s, map <1s load) with CI/CD enforcement to prevent regressions.

**Total Points:** 10

### Story 4.2.1: Lighthouse CI & Core Web Vitals Validation

**As a** developer  
**I want** Lighthouse CI to enforce performance standards  
**So that** regressions are caught before deployment

**Acceptance Criteria:**

- [ ] **Target metrics (NFR6):**
  - LCP (Largest Contentful Paint): <2.5 seconds
  - FID/INP (First Input Delay / Interaction to Next Paint): <100ms / <200ms
  - CLS (Cumulative Layout Shift): <0.1
  - Lighthouse Performance score: >90
- [ ] Lighthouse CI integrated into GitHub Actions:
  - Run on every PR commit
  - Fail build if performance score <90 or any Core Web Vital fails
  - Comment on PR with Lighthouse report
- [ ] Test pages:
  - Home page `/`
  - Map page `/` (with 100 pins loaded)
  - NGO dashboard `/org/dashboard`
  - Report submission flow `/report`
- [ ] Lighthouse CI configuration:
  - Mobile simulation (Moto G4)
  - 3G throttling (1.6 Mbps)
  - Disable service workers (test cold start)
- [ ] Vercel Analytics integrated for Real User Monitoring (RUM):
  - Track Core Web Vitals in production
  - Alert if metrics degrade >10%
- [ ] Performance budget enforced:
  - Total JS: <300KB (gzipped)
  - Total CSS: <50KB (gzipped)
  - Images: Lazy-loaded, WebP format, max 500KB per page

**Technical Notes:**

- Lighthouse CI config (`.lighthouserc.js`):
  ```javascript
  module.exports = {
    ci: {
      collect: {
        url: [
          'http://localhost:3000/',
          'http://localhost:3000/org/dashboard',
          'http://localhost:3000/report',
        ],
        settings: {
          preset: 'desktop',
          throttling: {
            rttMs: 150,
            throughputKbps: 1638.4,
            cpuSlowdownMultiplier: 4,
          },
        },
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.9 }],
          'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
          'first-input-delay': ['error', { maxNumericValue: 100 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        },
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };
  ```
- GitHub Actions workflow (`.github/workflows/lighthouse.yml`):
  ```yaml
  name: Lighthouse CI
  on: [pull_request]
  jobs:
    lighthouse:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm ci
        - run: npm run build
        - run: npm run start &
        - uses: treosh/lighthouse-ci-action@v9
          with:
            configPath: './.lighthouserc.js'
  ```

**Dependencies:** None (foundational)

**Story Points:** 4

---

### Story 4.2.2: Map Performance Optimization (Load <1s with 100 pins)

**As a** user  
**I want** the map to load instantly  
**So that** I can quickly browse environmental issues

**Acceptance Criteria:**

- [ ] **Performance target (NFR1):**
  - Map loads in <1 second with 100 pins
  - Map loads in <3 seconds with 1,000+ pins
- [ ] **Optimization techniques:**
  - Server-side filtering: Query only pins within map bounds
  - Limit mobile queries to 50 pins, desktop to 100 pins (server-side)
  - Lazy-load Leaflet library (code-split, load on map page only) - **Note:** Refactor Story 0.3 global CSS import to dynamic import
  - Use Leaflet's `preferCanvas` option for better performance
  - Debounce map pan/zoom events (500ms) to reduce query frequency
  - Cache map tiles in browser (service worker - Phase 2)
- [ ] Client-side clustering with `Leaflet.markercluster` (battle-tested):
  - Cluster pins at zoom levels <14
  - Unclustered at zoom >=14 (street level)
  - Smooth zoom animations
  - Preserve status-based marker colors in clusters
- [ ] Loading skeleton during map initialization
- [ ] Progressive enhancement: Show map center first, then load pins
- [ ] Performance testing:
  - Load test with 1,000 pins on budget Android device (manual testing - document results)
  - Verify <16ms frame time (60 FPS) during pan/zoom using Chrome DevTools Performance tab
  - **Document profiling results in PR description:**
    - Screenshot of Performance tab timeline
    - Frame rate graph showing consistent 60 FPS
    - JavaScript execution time breakdown
    - Memory usage during pan/zoom
  - Chrome DevTools Performance profiling recorded and saved

**Technical Notes:**

- Server-side bounds filtering:

  ```typescript
  export async function getMapIssues(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) {
    const limit = isMobile ? 50 : 100;

    const { data } = await supabase
      .from('issues')
      .select('id, lat, lng, category, status, verifications_count')
      .gte('lat', bounds.south)
      .lte('lat', bounds.north)
      .gte('lng', bounds.west)
      .lte('lng', bounds.east)
      .eq('is_flagged', false)
      .limit(limit);

    return data;
  }
  ```

- Leaflet optimization:

  ```tsx
  import { MapContainer } from 'react-leaflet';

  <MapContainer preferCanvas={true} ...>
  ```

- Debounced map events with cleanup:

  ```tsx
  const debouncedFetch = useMemo(() => debounce((bounds) => fetchIssues(bounds), 500), []);

  useEffect(() => {
    return () => debouncedFetch.cancel(); // Cleanup on unmount
  }, [debouncedFetch]);

  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      debouncedFetch(bounds);
    },
  });
  ```

- **Device detection:** Use `window.innerWidth < 768` for mobile/desktop distinction (not user-agent parsing)

**Dependencies:** Story 1.2.1 (map), Story 1.2.3 (clustering)

**Story Points:** 6

---

### Story 4.2.3: Performance Regression Prevention & Budgets

**As a** developer  
**I want** performance budgets enforced in CI/CD  
**So that** we prevent performance from regressing after optimization

**Acceptance Criteria:**

- [ ] **Bundle size budgets** enforced in `next.config.ts`:
  - Total JavaScript: <300KB gzipped
  - Total CSS: <50KB gzipped
  - Page-specific budgets: Home <150KB, Map <200KB, Dashboard <180KB
- [ ] **Performance budgets** in Lighthouse CI:
  - LCP: <2.5s (already in Story 4.2.1)
  - FID/INP: <100ms / <200ms
  - CLS: <0.1
  - Build fails if any budget exceeded
- [ ] **Automated alerts** via Vercel Analytics:
  - Email alert if LCP exceeds 2.8s for >5% of users (production)
  - Slack webhook (optional) for critical degradation (>3.5s)
  - Weekly performance report
- [ ] **Regression testing**:
  - Baseline metrics captured from current build
  - CI compares each PR against baseline
  - Regression >10% requires justification in PR description
- [ ] **Monitoring dashboard**: Vercel Analytics configured to track:
  - Core Web Vitals (LCP, FID, CLS) by page
  - Map load time by pin count
  - API response times (for Sprint 4B)

**Technical Notes:**

- Bundle size budgets (`next.config.ts`):
  ```typescript
  module.exports = {
    experimental: {
      bundlePagesRouterDependencies: true,
    },
    webpack: (config) => {
      config.performance = {
        maxAssetSize: 300 * 1024, // 300KB
        maxEntrypointSize: 300 * 1024,
      };
      return config;
    },
  };
  ```
- Vercel Analytics alert setup (Vercel dashboard → Analytics → Alerts)

**Dependencies:** Story 4.2.1 (Lighthouse CI baseline)

**Story Points:** 3 (NEW STORY - added from team review)

---

## Epic 4.3: Anti-Spam & Abuse Prevention

**Epic Goal:** Implement rate limiting for anonymous users and Cloudflare Turnstile CAPTCHA for high-risk actions to maintain <5% spam rate, with database cleanup to prevent bloat.

**Total Points:** 11

### Story 4.3.1: Anonymous Report Rate Limiting

**As a** system  
**I want** to rate-limit anonymous report submissions  
**So that** spam reports are prevented

**Acceptance Criteria:**

- [ ] **Rate limits (NFR14):**
  - Anonymous users: 3 reports per hour per device/session/IP
  - Authenticated users: 10 reports per hour
- [ ] **Enforcement:** Database trigger + server-side validation with atomic operations
- [ ] Anonymous user tracking:
  - Use `session_id` from localStorage (same as verification tracking)
  - Fallback to IP address if localStorage unavailable
  - Store rate limit state in database: `rate_limit_log` table
- [ ] **Database migration** for `rate_limit_log` table:
  ```sql
  CREATE TABLE rate_limit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    action_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  CREATE INDEX idx_rate_limit_session ON rate_limit_log(session_id, created_at);
  CREATE INDEX idx_rate_limit_user ON rate_limit_log(user_id, created_at);
  ```
- [ ] Rate limit exceeded error:
  - Modal: "You've reached the hourly limit. Please wait {X} minutes or sign up for more access."
  - Countdown timer showing time until reset
  - "Sign Up" button (encourages authentication)
- [ ] Authenticated users: Higher limit (10/hour) to encourage sign-ups
- [ ] Rate limit reset: 1 hour rolling window
- [ ] Admin bypass: Admins exempt from rate limits
- [ ] Error logging: Track rate limit violations for abuse monitoring
- [ ] **Concurrency protection:** Use database transaction to prevent race conditions

**Technical Notes:**

- Server Action validation with atomic check:

  ```typescript
  'use server';
  export async function createReport(data) {
    const sessionId = data.session_id;
    const userId = data.user_id;
    const limit = userId ? 10 : 3;

    // Atomic insert with conflict check
    const { error: rateLimitError } = await supabase.rpc('check_and_log_rate_limit', {
      p_session_id: sessionId,
      p_user_id: userId,
      p_ip_address: request.ip,
      p_action_type: 'report_submission',
      p_limit: limit,
    });

    if (rateLimitError) {
      return {
        success: false,
        error: 'rate_limit_exceeded',
        next_allowed: new Date(Date.now() + 3600000).toISOString(),
      };
    }

    // Continue with report creation...
  }
  ```

- PostgreSQL function for atomic rate limit check:

  ```sql
  CREATE OR REPLACE FUNCTION check_and_log_rate_limit(
    p_session_id TEXT,
    p_user_id UUID,
    p_ip_address INET,
    p_action_type TEXT,
    p_limit INT
  ) RETURNS VOID AS $$
  DECLARE
    v_count INT;
  BEGIN
    -- Count recent actions
    SELECT COUNT(*) INTO v_count
    FROM rate_limit_log
    WHERE (session_id = p_session_id OR user_id = p_user_id)
      AND action_type = p_action_type
      AND created_at > NOW() - INTERVAL '1 hour';

    IF v_count >= p_limit THEN
      RAISE EXCEPTION 'Rate limit exceeded';
    END IF;

    -- Log action
    INSERT INTO rate_limit_log (session_id, user_id, ip_address, action_type)
    VALUES (p_session_id, p_user_id, p_ip_address, p_action_type);
  END;
  $$ LANGUAGE plpgsql;
  ```

**Dependencies:** Story 1.3.7 (report submission)

**Story Points:** 4 (was 3, +1 for database migration and atomic logic)

---

### Story 4.3.2: Cloudflare Turnstile for High-Risk Actions

**As a** system  
**I want** to use Cloudflare Turnstile (CAPTCHA replacement) for high-risk actions  
**So that** automated spam is prevented

**Acceptance Criteria:**

- [ ] Cloudflare Turnstile integrated for:
  - Anonymous report submissions (after 2nd report in session)
  - Verification photo uploads
  - Action Card proof uploads
- [ ] **User experience:** Invisible challenge (no user interaction unless suspicious)
- [ ] Turnstile widget placement:
  - Bottom of report form (before "Submit" button)
  - Above proof upload button in verification modal
  - Above proof upload in Action Card completion form
- [ ] Server-side validation:
  - Verify Turnstile token with Cloudflare API
  - **5-second timeout** using AbortController (prevent hanging)
  - Reject submission if token invalid or expired (tokens expire in 5 minutes)
  - Error message: "Security check failed. Please try again."
- [ ] **Accessibility:** Turnstile is WCAG 2.1 AA compliant (no visual CAPTCHA)
- [ ] **Performance:** Turnstile loads asynchronously (doesn't block form)
- [ ] **Smart bypass:** Turnstile bypassed for authenticated users with good reputation (>5 verified reports)
- [ ] **Fail-secure design** (CRITICAL CHANGE):
  - Turnstile API down + user is anonymous → Block submission, show error: "Security verification unavailable. Please try again or sign up."
  - Turnstile API down + authenticated user with good reputation → Allow submission (rate limiting still active)
  - Log all fail-secure events for monitoring
- [ ] Error handling:
  - Token expired: Refresh widget automatically
  - API timeout: Treat as fail-secure scenario

**Technical Notes:**

- Client-side integration (3 flows):

  ```tsx
  'use client';
  import { Turnstile } from '@marsidev/react-turnstile';

  export function ReportForm() {
    const [turnstileToken, setTurnstileToken] = useState('');
    const { user } = useAuth();
    const showTurnstile = !user || user.verified_reports_count < 5;

    return (
      <form>
        {/* Form fields... */}

        {showTurnstile && (
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={setTurnstileToken}
            onError={() => setTurnstileToken('failed')}
          />
        )}

        <button disabled={showTurnstile && !turnstileToken}>Submit</button>
      </form>
    );
  }
  ```

- Server-side verification with timeout:

  ```typescript
  'use server';
  export async function createReport(data) {
    const { user } = await getUser();
    const requiresTurnstile = !user || user.verified_reports_count < 5;

    if (requiresTurnstile) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const verifyResponse = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret: process.env.TURNSTILE_SECRET_KEY,
              response: data.turnstile_token,
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
          return { success: false, error: 'captcha_failed' };
        }
      } catch (error) {
        // API timeout or network error
        await logFailSecureEvent(user?.id, 'turnstile_unavailable');

        if (!user) {
          return {
            success: false,
            error: 'security_unavailable',
            message: 'Security verification unavailable. Please sign up or try again later.',
          };
        }
        // Authenticated user with good reputation can proceed
      }
    }

    // Continue with report creation...
  }
  ```

**Dependencies:** Story 4.3.1 (rate limiting context)

**Story Points:** 5 (was 3, +2 for 3 separate flow integrations and fail-secure logic)

---

### Story 4.3.3: Rate Limit Cleanup Job & Monitoring

**As a** system  
**I want** to automatically clean up old rate limit logs  
**So that** the database doesn't bloat and performance stays fast

**Acceptance Criteria:**

- [ ] **Supabase cron job** (Edge Function scheduled via pg_cron):
  - Runs daily at 2 AM UTC
  - Deletes `rate_limit_log` entries older than 7 days
  - Logs cleanup metrics (rows deleted)
- [ ] **Retention policy:** Keep logs for 7 days for abuse analysis
- [ ] **Cleanup safety:**
  - Only delete completed rate limit windows (>7 days old)
  - Never delete logs from last 24 hours (active investigations)
- [ ] **Monitoring:**
  - Alert if cleanup fails 2 days in a row (Sentry alert)
  - Track rate_limit_log table size growth
  - Dashboard metric: "Rate limit violations per day"
- [ ] **Manual cleanup function** for admins:
  - Dashboard button: "Clean up old logs now"
  - Shows preview: "{X} logs will be deleted"
  - Requires confirmation

**Technical Notes:**

- Supabase Edge Function (`supabase/functions/cleanup-rate-limits/index.ts`):

  ```typescript
  import { createClient } from '@supabase/supabase-js';

  Deno.serve(async () => {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { count, error } = await supabase
      .from('rate_limit_log')
      .delete({ count: 'exact' })
      .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }

    console.log(`Cleaned up ${count} rate limit logs`);

    return new Response(JSON.stringify({ deleted: count }), {
      headers: { 'Content-Type': 'application/json' },
    });
  });
  ```

- Schedule via Supabase Dashboard → Database → Cron Jobs:
  ```sql
  SELECT cron.schedule(
    'cleanup-rate-limits',
    '0 2 * * *', -- 2 AM daily
    $$
    SELECT net.http_post(
      'https://[project-ref].supabase.co/functions/v1/cleanup-rate-limits',
      '{}',
      '{"Authorization": "Bearer [service-role-key]"}'::jsonb
    );
    $$
  );
  ```

**Dependencies:** Story 4.3.1 (rate_limit_log table)

**Story Points:** 2 (NEW STORY - added from team review)

---

## Epic 4.5: Production Monitoring & Security

**Epic Goal:** Set up production monitoring, error tracking, security hardening, and comprehensive smoke tests for confident launch.

**Total Points:** 14

### Story 4.5.1: Error Tracking with Sentry

**As a** developer  
**I want** to track production errors  
**So that** I can fix bugs quickly

**Acceptance Criteria:**

- [ ] Sentry integrated for error tracking
- [ ] Error tracking enabled for:
  - Client-side React errors (ErrorBoundary)
  - Server Action errors
  - API route errors (for Sprint 4B)
  - Database errors (Supabase queries)
- [ ] Error context captured:
  - User ID (if authenticated)
  - Page URL
  - Browser/device info
  - Stack trace
  - Breadcrumbs (user actions leading to error)
- [ ] Sentry alerts configured:
  - Email notification for new errors
  - Slack webhook for critical errors (optional)
  - Daily digest of unresolved errors
- [ ] Source maps uploaded for readable stack traces
- [ ] Environment tags: `production`, `staging`, `development`
- [ ] **Performance monitoring:** Track slow API responses (>2s)
- [ ] **Release tracking:** Tag errors with git commit SHA

**Technical Notes:**

- Sentry setup:
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```
- Sentry config (`sentry.client.config.ts`):

  ```typescript
  import * as Sentry from '@sentry/nextjs';

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1, // 10% of transactions
    beforeSend(event, hint) {
      // Filter out known errors (e.g., ad blockers)
      if (event.exception?.values?.[0]?.value?.includes('AdBlocker')) {
        return null;
      }
      return event;
    },
  });
  ```

- Error Boundary component:

  ```tsx
  'use client';
  import { ErrorBoundary as SentryErrorBoundary } from '@sentry/nextjs';

  export function ErrorBoundary({ children }: { children: React.ReactNode }) {
    return (
      <SentryErrorBoundary
        fallback={({ error, resetError }) => (
          <div>
            <h2>Something went wrong</h2>
            <pre>{error.message}</pre>
            <button onClick={resetError}>Try again</button>
          </div>
        )}
      >
        {children}
      </SentryErrorBoundary>
    );
  }
  ```

**Dependencies:** None (foundational)

**Story Points:** 3

---

### Story 4.5.2: Security Hardening & CSP with Nonces

**As a** system  
**I want** proper security headers and Content Security Policy  
**So that** the platform is protected from XSS and other attacks

**Acceptance Criteria:**

- [ ] **Security headers** configured in `next.config.ts`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` for camera, geolocation
- [ ] **Content Security Policy with nonces** (NO unsafe-inline/unsafe-eval):
  - Generate random nonce per request (middleware)
  - Pass nonce to all components via context
  - Inject nonce into all `<script>` and `<style>` tags
  - CSP header: `script-src 'self' 'nonce-{random}'; style-src 'self' 'nonce-{random}';`
- [ ] **HTTPS enforcement:**
  - Strict-Transport-Security (HSTS) header
  - Redirect HTTP to HTTPS (Vercel handles this)
- [ ] **DNS security:**
  - SPF record for email sending (Resend domain)
  - DKIM signature verification
  - DMARC policy configured
- [ ] **Supabase RLS policies audited:**
  - Multi-org isolation tested (org A can't access org B data)
  - Anonymous insert policies tested
  - Admin policies tested
- [ ] **Secrets audit:**
  - No secrets in client-side code
  - Environment variables properly prefixed (NEXT*PUBLIC* only for public vars)
  - Service role keys never exposed

**Technical Notes:**

- Security headers (`next.config.ts`):
  ```typescript
  module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
          ],
        },
      ];
    },
  };
  ```
- CSP with nonces (middleware):

  ```typescript
  import { NextResponse } from 'next/server';
  import crypto from 'crypto';

  export function middleware(request: NextRequest) {
    const nonce = crypto.randomBytes(16).toString('base64');

    const response = NextResponse.next();

    response.headers.set(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; img-src 'self' data: https:; font-src 'self' data:;`
    );

    // Pass nonce to components via header (read in layout)
    response.headers.set('X-Nonce', nonce);

    return response;
  }
  ```

- Layout reads nonce:

  ```tsx
  import { headers } from 'next/headers';

  export default async function RootLayout({ children }) {
    const headersList = await headers();
    const nonce = headersList.get('X-Nonce') || '';

    return (
      <html>
        <head>
          <script nonce={nonce} src="..."></script>
        </head>
        <body>{children}</body>
      </html>
    );
  }
  ```

- **Nonce Context Provider** (for components needing inline scripts):

  ```tsx
  // app/providers/NonceProvider.tsx
  'use client';
  import { createContext, useContext } from 'react';

  const NonceContext = createContext<string>('');

  export function NonceProvider({ nonce, children }: { nonce: string; children: React.ReactNode }) {
    return <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>;
  }

  export function useNonce() {
    return useContext(NonceContext);
  }
  ```

- Layout wraps children with NonceProvider:

  ```tsx
  // app/layout.tsx
  import { NonceProvider } from './providers/NonceProvider';

  export default async function RootLayout({ children }) {
    const headersList = await headers();
    const nonce = headersList.get('X-Nonce') || '';

    return (
      <html>
        <body>
          <NonceProvider nonce={nonce}>{children}</NonceProvider>
        </body>
      </html>
    );
  }
  ```

- **Component usage** (accessing nonce for inline scripts):

  ```tsx
  'use client';
  import { useNonce } from '@/app/providers/NonceProvider';

  export function AnalyticsComponent() {
    const nonce = useNonce();

    return (
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `console.log('Analytics initialized');`,
        }}
      />
    );
  }
  ```

**Dependencies:** None (foundational)

**Story Points:** 5 (was 3, +2 for CSP nonce implementation complexity)

---

### Story 4.5.3: Comprehensive Smoke Tests & Launch Validation

**As a** team  
**I want** automated smoke tests for all critical flows  
**So that** we catch regressions before launch

**Acceptance Criteria:**

- [ ] **10 critical path smoke tests** (Playwright E2E):
  1. User signup flow (email/password + magic link)
  2. Report submission (anonymous + authenticated)
  3. Map interaction (pan, zoom, pin click)
  4. Verification flow (submit photo proof)
  5. Action Card creation + RSVP
  6. NGO dashboard login + issue management
  7. Profile editing (avatar, bio, notification preferences)
  8. CSV export download
  9. Organization directory browsing
  10. Mobile responsive design (320px viewport)
  11. **Concurrent rate limit test** (validates Story 4.3.1 atomic operations):
      - Spawn 10 parallel requests to hit rate limit simultaneously
      - Verify exactly 3 succeed (anonymous limit)
      - Verify atomic counter prevents race conditions
      - Expected: 3 reports created, 7 rejected with rate_limit_exceeded error
- [ ] **Passing criteria (ZERO TOLERANCE):**
  - **All 11 smoke tests must pass** before Sprint 4B kickoff
  - Any single failure blocks Sprint 4B start
  - Failed tests must be debugged and re-run until 100% pass rate achieved
  - Test results documented in `_bmad-output/sprint-4a-smoke-test-results.md`
- [ ] **Smoke tests run on:**
  - Staging environment (before production deploy)
  - Production environment (post-deploy validation)
  - Scheduled daily (detect production issues)
- [ ] **Test data management:**
  - Seed database with test data (100 issues, 10 users, 5 orgs)
  - Reset test database before each run
  - Use separate test Supabase project
- [ ] **Failure handling:**
  - Email alert if any smoke test fails
  - Screenshot + video recording of failures
  - Slack notification (optional)
- [ ] **Performance validation:**
  - Each smoke test must complete in <30 seconds
  - Total test suite <5 minutes

**Technical Notes:**

- Playwright smoke tests (`e2e/smoke/`):

  ```typescript
  import { test, expect } from '@playwright/test';

  test('smoke: user signup flow', async ({ page }) => {
    await page.goto('https://staging.ecopulse.ng');

    await page.click('[aria-label="Sign up"]');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Welcome to EcoPulse')).toBeVisible({ timeout: 10000 });
  });

  test('smoke: report submission authenticated', async ({ page }) => {
    // Login first
    await page.goto('https://staging.ecopulse.ng/login');
    await page.fill('[name="email"]', 'smoke-user@example.com');
    await page.fill('[name="password"]', 'SmokeTestPass123!');
    await page.click('button:has-text("Log in")');

    // Submit report
    await page.click('[aria-label="Report environmental issue"]');
    await page.fill('[name="address"]', '123 Test St, Lagos');
    await page.selectOption('[name="category"]', 'waste');
    await page.selectOption('[name="severity"]', 'high');
    // Photo upload handled via file input
    await page.setInputFiles('input[type="file"]', 'e2e/fixtures/test-photo.jpg');

    await page.click('button:has-text("Submit Report")');

    await expect(page.locator('text=Report submitted successfully')).toBeVisible({
      timeout: 30000,
    });
  });

  // 8 more smoke tests...
  ```

- GitHub Actions smoke test job:
  ```yaml
  name: Smoke Tests
  on:
    deployment_status:
  jobs:
    smoke:
      if: github.event.deployment_status.state == 'success'
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm ci
        - run: npx playwright install --with-deps
        - run: npm run test:smoke
          env:
            SMOKE_TEST_URL: ${{ github.event.deployment_status.target_url }}
  ```

**Dependencies:** All previous stories (Sprint 0-4A)

**Story Points:** 6 (was 3, +3 for 10 comprehensive smoke tests across all critical flows)

---

### Story 4.5.4: Accessibility Test Scripts Documentation

**As a** QA tester  
**I want** detailed accessibility test scripts  
**So that** manual testing is reproducible and consistent

**Acceptance Criteria:**

- [ ] **NVDA (Windows) test script** documented in `_bmad-output/testing/accessibility-nvda-script.md`:
  - Step-by-step navigation instructions
  - Expected screen reader announcements for each element
  - Test coverage: Map, Report form, Verification modal, Dashboard, Profile
  - Minimum 20 test steps per page
  - Pass/fail criteria for each step
- [ ] **VoiceOver (macOS/iOS) test script** documented in `_bmad-output/testing/accessibility-voiceover-script.md`:
  - Rotor navigation tests (headings, links, form controls)
  - Touch gesture tests for iOS
  - Expected announcements
  - Minimum 20 test steps per page
- [ ] **JAWS (Windows) test script** documented in `_bmad-output/testing/accessibility-jaws-script.md`:
  - Virtual cursor navigation
  - Forms mode testing
  - Table navigation (if applicable)
  - Minimum 20 test steps per page
- [ ] **Keyboard navigation checklist** documented in `_bmad-output/testing/accessibility-keyboard-checklist.md`:
  - Tab order validation for all pages
  - Focus indicator visibility tests
  - Keyboard shortcuts (if any)
  - Modal focus trap tests
  - No keyboard trap verification
- [ ] **Test script template** includes:
  - Page/component name
  - Prerequisites (e.g., "User must be logged in")
  - Step number
  - Action (e.g., "Press Tab key")
  - Expected result (e.g., "Focus moves to Submit button, announced as 'Submit button'")
  - Actual result (blank - filled during testing)
  - Pass/Fail (blank - filled during testing)
- [ ] **Example test script entry:**

  ```markdown
  ## Page: Report Submission Form

  ### Prerequisites

  - Navigate to homepage
  - Click "Report Issue" button

  ### Test Steps

  | Step | Action                         | Expected Result                                                          | Actual Result | Pass/Fail |
  | ---- | ------------------------------ | ------------------------------------------------------------------------ | ------------- | --------- |
  | 1    | Press Tab from page load       | Focus on "Category" dropdown, announced as "Category, combo box, 1 of 2" |               |           |
  | 2    | Press Down Arrow               | "Waste and Litter" option announced                                      |               |           |
  | 3    | Press Enter                    | Option selected, focus returns to dropdown                               |               |           |
  | 4    | Press Tab                      | Focus moves to "Severity" dropdown                                       |               |           |
  | 5    | Fill form, press Tab to Submit | Submit button receives focus, announced as "Submit report, button"       |               |           |
  ```

**Deliverables:**

- [ ] 4 test script documents in `_bmad-output/testing/` folder
- [ ] Each script covers all critical pages (5 pages minimum)
- [ ] Total test steps documented: 100+ across all scripts
- [ ] Scripts reviewed by Murat (Test Architect)
- [ ] Scripts ready for use in Sprint 4B Story 4.4.1

**Technical Notes:**

- Scripts should be tool-agnostic (can be used by any tester)
- Include screen reader version compatibility notes
- Document known issues or limitations
- Provide links to WCAG 2.1 AA criteria being tested

**Dependencies:** All UI components from Sprints 1-3 (need complete UI to test)

**Story Points:** 2 (NEW STORY - documentation work, enables Sprint 4B Story 4.4.1)

---

## Sprint 4A Summary

**Total Stories:** 8 (was 7, +1 for accessibility test scripts)  
**Total Story Points:** 37 (was 35, +2 for Story 4.5.4)

**Epics Breakdown:**

- Epic 4.2: Performance Optimization (3 stories, 10 points)
- Epic 4.3: Anti-Spam & Abuse Prevention (3 stories, 11 points)
- Epic 4.5: Production Monitoring & Security (4 stories, 16 points - was 3 stories, 14 points)

**Key Deliverables:**
✅ Lighthouse CI enforcing Core Web Vitals in every PR  
✅ Map load <1s with 100 pins (optimized clustering + lazy loading)  
✅ Performance budgets preventing regressions  
✅ Anonymous rate limiting (3 reports/hour) with atomic operations  
✅ Cloudflare Turnstile CAPTCHA with fail-secure design  
✅ Rate limit cleanup job preventing database bloat  
✅ Sentry error tracking with source maps  
✅ Security headers with proper CSP (nonce-based, no unsafe-inline)  
✅ 11 comprehensive smoke tests for critical flows (including concurrent rate limit test)  
✅ Production-ready security hardening  
✅ Accessibility test scripts documented (NVDA, VoiceOver, JAWS, keyboard - 100+ test steps)

**Technical Achievements:**

- CI/CD performance enforcement (build fails on regression)
- Fail-secure CAPTCHA design (anonymous users blocked if Turnstile down)
- Atomic rate limiting (no race conditions)
- Nonce-based CSP (XSS protection without unsafe-inline)
- Automated smoke tests on staging + production

**Dependencies Resolved:**

- Performance optimization establishes baselines for Sprint 4B API work
- Security hardening protects API endpoints (Sprint 4B)
- Smoke tests validate all Sprint 1-3 features before adding API

**Ready for Sprint 4B:** Platform is performant, secure, and monitored. Ready to add public API and final polish.

---

# Sprint 4B: API + Accessibility + CCPA Compliance (Weeks 13-15)

**Goal:** Launch public API for external integrations, validate WCAG compliance, implement email notifications, ensure CCPA legal compliance, and complete final production readiness.

**Capacity:** 41 story points (3 weeks)

**Why Sprint 4B After 4A:** Public API and email notifications are value-add features that depend on a stable, performant, secure platform. Sprint 4A delivered that foundation. CCPA compliance stories added based on team readiness review.

**Key Deliverables:**

- Read-only public API with token authentication and rate limiting
- OpenAPI 3.0 documentation with interactive Swagger UI
- WCAG 2.1 AA compliance validation with detailed test scripts
- Email notification system (React Email + Resend)
- **Privacy Policy & Terms of Service pages**
- **Account deletion (CCPA right to deletion)**
- **User data export (CCPA right to know)**
- Public organization directory (SEO-optimized)
- Final production readiness checklist and bug bash

**Sprint 4B Epics:**

- Epic 4.1: Public Read-Only API (4 stories, 22 points)
- Epic 4.4: Accessibility & Email Notifications (4 stories, 12 points)
- Epic 4.6: CCPA Compliance (4 stories, 8 points) **[NEW - LEGAL REQUIREMENT]**

---

## Epic 4.1: Public Read-Only API

**Epic Goal:** Expose read-only API for verified reports and organization data, enabling external developers to integrate ecoPulse data with token-based authentication and rate limiting.

**Total Points:** 25 (increased from 22 - Story 4.1.1 split into 4.1.1a + 4.1.1b)

### Story 4.1.1a: API Routes Foundation & Authentication (Backend)

**As an** external developer  
**I want** to access ecoPulse data via API with secure authentication  
**So that** I can build integrations and visualizations

**Prerequisites (MUST COMPLETE BEFORE SPRINT START):**

- [ ] Provision Upstash Redis account for API rate limiting
- [ ] Configure Redis connection in environment variables

**Acceptance Criteria:**

- [ ] API route prefix: `/api/v1/`
- [ ] **Authentication:** Token-based (API keys stored in `api_tokens` table)
- [ ] **API tokens table migration** with expiration support:
  ```sql
  CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    token_hash TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    expires_at TIMESTAMP, -- Optional: null = never expires
    created_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP,
    requests_count INT DEFAULT 0
  );
  CREATE INDEX idx_api_tokens_org ON api_tokens(organization_id);
  CREATE INDEX idx_api_tokens_hash ON api_tokens(token_hash);
  ```
- [ ] Authentication middleware:
  - Check `Authorization: Bearer {token}` header
  - Validate token against hashed database records
  - Check expiration: reject if `expires_at < NOW()`
  - Return 401 Unauthorized if invalid/missing token
  - Return 403 Forbidden if token revoked/expired
- [ ] Rate limiting: 100 requests/hour per token (public tier)
  - Use Upstash Redis for rate limit tracking
  - Implement `checkRateLimit(tokenId)` function
  - Return 429 Too Many Requests if exceeded
  - Include rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- [ ] Error responses (JSON format):
  - 401: `{ "error": "unauthorized", "message": "Invalid or missing API token" }`
  - 403: `{ "error": "forbidden", "message": "Token revoked or expired" }`
  - 429: `{ "error": "rate_limit_exceeded", "message": "100 requests/hour limit reached. Resets at {timestamp}" }`
- [ ] Success response format (REST API with standard envelope):
  - Standard envelope: `{ "data": [...], "meta": { "total": 150, "page": 1, "per_page": 20 } }`
  - Note: Not full JSON:API compliant (missing links object), but consistent structure

**Technical Notes:**

- Rate limiting function with Upstash Redis:

  ```typescript
  import { Redis } from '@upstash/redis';

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });

  export async function checkRateLimit(tokenId: string) {
    const key = `api_rate_limit:${tokenId}`;
    const limit = 100;
    const window = 3600; // 1 hour in seconds

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, window);
    }

    const ttl = await redis.ttl(key);
    const resetTime = new Date(Date.now() + ttl * 1000);

    return {
      allowed: count <= limit,
      message:
        count > limit ? `Rate limit exceeded. Resets at ${resetTime.toISOString()}` : undefined,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': Math.max(0, limit - count).toString(),
        'X-RateLimit-Reset': resetTime.toISOString(),
      },
    };
  }
  ```

- Token generation Server Action:

  ```typescript
  'use server';
  import crypto from 'crypto';

  export async function generateAPIToken(orgId: string, name: string, expiresInDays?: number) {
    const token = `ecp_live_${crypto.randomBytes(32).toString('hex')}`;
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    await supabase.from('api_tokens').insert({
      organization_id: orgId,
      token_hash: hash,
      name,
      expires_at: expiresAt,
    });

    return { token }; // Return plain token ONLY ONCE (never stored in DB)
  }
  ```

- Authentication middleware:

  ```typescript
  // /middleware.ts
  export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/v1')) {
      const authHeader = request.headers.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'unauthorized', message: 'Missing API token' },
          { status: 401 }
        );
      }

      const token = authHeader.replace('Bearer ', '');
      const hash = crypto.createHash('sha256').update(token).digest('hex');

      const { data: apiToken } = await supabase
        .from('api_tokens')
        .select('id, status, expires_at')
        .eq('token_hash', hash)
        .single();

      if (!apiToken || apiToken.status !== 'active') {
        return NextResponse.json(
          { error: 'forbidden', message: 'Invalid or revoked token' },
          { status: 403 }
        );
      }

      // Check expiration
      if (apiToken.expires_at && new Date(apiToken.expires_at) < new Date()) {
        return NextResponse.json({ error: 'forbidden', message: 'Token expired' }, { status: 403 });
      }

      // Rate limiting check
      const rateLimit = await checkRateLimit(apiToken.id);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: 'rate_limit_exceeded', message: rateLimit.message },
          { status: 429, headers: rateLimit.headers }
        );
      }

      // Update last_used_at
      await supabase
        .from('api_tokens')
        .update({
          last_used_at: new Date().toISOString(),
          requests_count: supabase.raw('requests_count + 1'),
        })
        .eq('id', apiToken.id);
    }

    return NextResponse.next();
  }
  ```

**Dependencies:** Upstash Redis provisioned

**Story Points:** 5 (backend authentication, middleware, rate limiting)

---

### Story 4.1.1b: API Token Management UI (Frontend)

**As an** NGO coordinator  
**I want** to generate and manage API tokens from my dashboard  
**So that** I can integrate ecoPulse data with external tools

**Prerequisites:**

- [ ] Story 4.1.1a completed (token generation Server Action available)
- [ ] Design token management UI mockup (modal or dashboard section)

**Acceptance Criteria:**

- [ ] Token generation UI in NGO dashboard (`/dashboard/api-tokens`):
  - Page title: \"API Tokens\"
  - \"Generate New Token\" button (opens modal)
  - Modal with form:
    - \"Token Name\" input (required, max 50 chars) - e.g., \"Production Dashboard\", \"Analytics Integration\"
    - \"Expires in\" dropdown (30 days, 90 days, 1 year, Never)
    - \"Generate Token\" button
  - On success: Show token ONCE in modal with copy-to-clipboard button
  - Warning message: \"Save this token now. You won't see it again.\"
  - Token format displayed: `ecp_live_a1b2c3...` (truncated with ellipsis)
  - After copying/closing: Return to tokens list
- [ ] Token management dashboard table:
  - Columns: Name, Created, Last Used, Total Requests, Expires, Status
  - Sort by: Created (default: newest first), Last Used, Requests
  - Actions column: Revoke button (red, shows confirmation dialog)
  - Revoke confirmation: \"Are you sure? This action cannot be undone.\"
  - Revoked tokens shown with strikethrough + \"Revoked\" badge
  - No ability to view token after creation (security best practice)
- [ ] Empty state (no tokens):
  - Icon: Key icon (Hugeicons `Key01`)
  - Message: \"No API tokens yet\"
  - Description: \"Generate an API token to access ecoPulse data from external applications\"
  - \"Generate Your First Token\" button
- [ ] Loading states:
  - Skeleton loader while fetching tokens
  - Spinner on \"Generate Token\" button during creation
  - Disabled revoke button with spinner during revocation
- [ ] Error handling:
  - Token generation failed: \"Unable to generate token. Try again.\"
  - Token revocation failed: \"Unable to revoke token. Refresh and try again.\"
  - Token list load failed: \"Unable to load tokens. Refresh page.\"
- [ ] Accessibility:
  - Copy button: `aria-label=\"Copy API token to clipboard\"`
  - Revoke button: `aria-label=\"Revoke API token {name}\"`
  - Success toast: \"Token copied to clipboard\" (auto-dismiss after 3s)

**Technical Notes:**

- Use `generateAPIToken` Server Action from Story 4.1.1a
- Revoke token Server Action:
  ```typescript
  'use server';
  export async function revokeAPIToken(tokenId: string, orgId: string) {
    await supabase
      .from('api_tokens')
      .update({ status: 'revoked' })
      .eq('id', tokenId)
      .eq('organization_id', orgId); // Ensure org owns token
  }
  ```
- Fetch tokens query:
  ```typescript
  const { data: tokens } = await supabase
    .from('api_tokens')
    .select('id, name, created_at, last_used_at, requests_count, status, expires_at')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  ```
- Copy to clipboard:
  ```typescript
  await navigator.clipboard.writeText(token);
  toast.success('Token copied to clipboard');
  ```

**Dependencies:** Story 4.1.1a (token generation Server Action), Story 3.1.1 (NGO dashboard)

**Story Points:** 3 (UI components, modals, forms, table, error handling)

**🔧 QUALITY FIX:** Split from Story 4.1.1 (8 points) to reduce sprint risk and enable parallel UI/backend work.

---

### Story 4.1.2: GET /api/v1/reports Endpoint

**As an** API consumer  
**I want** to retrieve verified reports via API  
**So that** I can display environmental data in my application

**Acceptance Criteria:**

- [ ] Endpoint: `GET /api/v1/reports`
- [ ] Query parameters:
  - `category`: Filter by category (waste, drainage)
  - `status`: Filter by status (pending, verified, resolved)
  - `bounds`: Geographic bounding box `{north},{south},{east},{west}` (e.g., `6.6,-6.4,3.5,3.1`)
  - `start_date`: Filter reports after date (ISO 8601: `2024-03-01`)
  - `end_date`: Filter reports before date (ISO 8601: `2024-03-31`)
  - `page`: Page number (default: 1)
  - `per_page`: Items per page (default: 20, max: 100)
- [ ] Response format (JSON:API spec):
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "type": "report",
        "attributes": {
          "category": "waste",
          "severity": "high",
          "status": "verified",
          "address": "123 Main St, Lagos",
          "lat": 6.5244,
          "lng": 3.3792,
          "verifications_count": 3,
          "created_at": "2024-03-15T10:30:00Z",
          "photos": ["url1", "url2"]
        }
      }
    ],
    "meta": {
      "total": 150,
      "page": 1,
      "per_page": 20,
      "total_pages": 8
    }
  }
  ```
- [ ] **Performance requirement:** Response time <500ms for single resource, <2s for paginated lists (NFR7)
- [ ] **Data filtering:** Only return non-flagged reports (`is_flagged = false`)
- [ ] **Privacy:** Exclude reporter user IDs and session IDs (public API should not expose PII)
- [ ] Pagination: Cursor-based for performance (support 100 items per page max - NFR40)
- [ ] **Bounds validation:**
  - Reject if `north < south`: 400 Bad Request "Invalid bounds: north must be >= south"
  - Handle anti-meridian crossing: if `east < west`, query wraps longitude (Pacific Ocean)
  - Validate latitude range: -90 to 90
  - Validate longitude range: -180 to 180
- [ ] Error handling:
  - Invalid bounds: 400 Bad Request + specific error message
  - Invalid date format: 400 Bad Request "Date must be ISO 8601 format"
  - Page out of range: Return empty data array (NOT 404, valid request with no results)
- [ ] CORS enabled for browser requests:
  - `Access-Control-Allow-Origin: *` (public API)
  - `Access-Control-Allow-Methods: GET, OPTIONS`
  - `Access-Control-Allow-Headers: Authorization, Content-Type`

**Technical Notes:**

- API route: `/app/api/v1/reports/route.ts`
- Implementation:

  ```typescript
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const bounds = searchParams.get('bounds')?.split(',').map(Number);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '20'), 100);

    let query = supabase
      .from('issues')
      .select(
        'id, category, severity, status, address, lat, lng, verifications_count, created_at, photos',
        { count: 'exact' }
      )
      .eq('is_flagged', false);

    if (category) query = query.eq('category', category);
    if (status) query = query.eq('status', status);
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    if (bounds && bounds.length === 4) {
      const [north, south, east, west] = bounds;
      query = query.gte('lat', south).lte('lat', north).gte('lng', west).lte('lng', east);
    }

    const { data, count, error } = await query
      .range((page - 1) * perPage, page * perPage - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data.map((issue) => ({
        id: issue.id,
        type: 'report',
        attributes: {
          category: issue.category,
          severity: issue.severity,
          status: issue.status,
          address: issue.address,
          lat: issue.lat,
          lng: issue.lng,
          verifications_count: issue.verifications_count,
          created_at: issue.created_at,
          photos: issue.photos,
        },
      })),
      meta: {
        total: count,
        page,
        per_page: perPage,
        total_pages: Math.ceil(count / perPage),
      },
    });
  }
  ```

**Dependencies:** Story 4.1.1 (API auth)

**Story Points:** 5 (was 4, +1 for comprehensive bounds validation including anti-meridian handling)

---

### Story 4.1.3: GET /api/v1/organizations Endpoint

**As an** API consumer  
**I want** to retrieve organization profiles via API  
**So that** I can list NGOs in my directory application

**Acceptance Criteria:**

- [ ] Endpoint: `GET /api/v1/organizations`
- [ ] Query parameters:
  - `city`: Filter by coverage area (e.g., `Lagos`)
  - `page`: Page number (default: 1)
  - `per_page`: Items per page (default: 20, max: 100)
- [ ] Response format (JSON:API spec):
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "type": "organization",
        "attributes": {
          "name": "Green Lagos Initiative",
          "slug": "green-lagos-initiative",
          "description": "Environmental NGO focused on waste management",
          "coverage_area": "Lagos, Nigeria",
          "contact_email": "contact@greenlondon.org",
          "website_url": "https://greenlondon.org",
          "logo_url": "https://...",
          "issues_addressed": 45,
          "verified_resolutions": 32
        }
      }
    ],
    "meta": {
      "total": 12,
      "page": 1,
      "per_page": 20,
      "total_pages": 1
    }
  }
  ```
- [ ] **Performance:** Response time <500ms (NFR7)
- [ ] **Data filtering:** Only return active organizations (verified_resolutions > 0)
- [ ] Error handling: Same as Story 4.1.2
- [ ] CORS enabled

**Technical Notes:**

- API route: `/app/api/v1/organizations/route.ts`
- Query organizations with KPI join:

  ```typescript
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '20'), 100);

    let query = supabase
      .from('organizations')
      .select(
        `
        id, name, slug, description, coverage_area, contact_email, website_url, logo_url,
        kpis:ngo_dashboard_kpis!organization_id (issues_addressed, verified_reports)
      `,
        { count: 'exact' }
      )
      .gt('kpis.verified_reports', 0);

    if (city) query = query.ilike('coverage_area', `%${city}%`);

    const { data, count, error } = await query
      .range((page - 1) * perPage, page * perPage - 1)
      .order('kpis.verified_reports', { ascending: false });

    return NextResponse.json({
      data: data.map((org) => ({
        id: org.id,
        type: 'organization',
        attributes: {
          name: org.name,
          slug: org.slug,
          description: org.description,
          coverage_area: org.coverage_area,
          contact_email: org.contact_email,
          website_url: org.website_url,
          logo_url: org.logo_url,
          issues_addressed: org.kpis.issues_addressed,
          verified_resolutions: org.kpis.verified_reports,
        },
      })),
      meta: {
        total: count,
        page,
        per_page: perPage,
        total_pages: Math.ceil(count / perPage),
      },
    });
  }
  ```

**Dependencies:** Story 4.1.1 (API auth), Story 3.1.3 (KPIs)

**Story Points:** 4 (was 3, +1 for KPI join complexity and performance optimization with indexing)

---

### Story 4.1.4: API Documentation with OpenAPI Spec

**As an** external developer  
**I want** to read API documentation  
**So that** I can understand how to integrate with ecoPulse

**Acceptance Criteria:**

- [ ] API docs page route: `/api/docs` (public, no auth required)
- [ ] Documentation includes:
  - Getting started guide (how to generate API token)
  - Authentication instructions (Bearer token in header)
  - Rate limiting details (100 requests/hour)
  - Endpoint reference for `/reports` and `/organizations`
  - Query parameters with examples
  - Response format examples (JSON:API spec)
  - Error codes and handling
  - Pagination guide
- [ ] **OpenAPI 3.0 specification** (NFR44):
  - YAML file: `/public/openapi.yaml`
  - Served at `/api/openapi.yaml`
  - Includes all endpoints, parameters, responses, schemas
- [ ] Interactive API explorer: Swagger UI or Redoc embedded on `/api/docs`
  - Try-it-out functionality (requires user's API token)
- [ ] **Comprehensive code examples:**
  - JavaScript/TypeScript fetch examples
  - Python requests examples
  - cURL examples for all endpoints
  - Response examples with real-looking data
- [ ] **Error handling guide:**
  - All possible error codes (401, 403, 429, 400, 500)
  - Retry strategies for rate limits
  - Best practices for token security
- [ ] Markdown documentation for GitHub README (quick start section)
- [ ] SEO-optimized docs page:
  - Meta tags for search engines
  - Structured data (JSON-LD) for API documentation
  - Sitemap entry
- [ ] **Interactive Swagger UI:**
  - Try-it-out functionality with user-provided API token
  - Request/response examples
  - Schema definitions
  - Authentication UI (paste token)

**Technical Notes:**

- Complete OpenAPI 3.0 spec (`/public/openapi.yaml`):
  ```yaml
  openapi: 3.0.0
  info:
    title: EcoPulse API
    version: 1.0.0
    description: Public API for accessing verified environmental reports and NGO data
  servers:
    - url: https://ecopulse.ng/api/v1
  paths:
    /reports:
      get:
        summary: List verified reports
        parameters:
          - name: category
            in: query
            schema:
              type: string
              enum: [waste, drainage]
          - name: status
            in: query
            schema:
              type: string
              enum: [pending, verified, resolved]
        responses:
          200:
            description: Successful response
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    data:
                      type: array
                      items:
                        $ref: '#/components/schemas/Report'
                    meta:
                      $ref: '#/components/schemas/Meta'
  components:
    securitySchemes:
      BearerAuth:
        type: http
        scheme: bearer
    schemas:
      Report:
        type: object
        properties:
          id: { type: string }
          type: { type: string }
          attributes: { type: object }
  ```
- Swagger UI integration:

  ```tsx
  'use client';
  import SwaggerUI from 'swagger-ui-react';
  import 'swagger-ui-react/swagger-ui.css';

  export function APIDocsPage() {
    return <SwaggerUI url="/api/openapi.yaml" />;
  }
  ```

**Dependencies:** Story 4.1.2, Story 4.1.3 (API endpoints to document)

**Story Points:** 5 (was 3, +2 for comprehensive OpenAPI spec, Swagger UI integration, code examples in multiple languages, and SEO optimization)

---

## Epic 4.4: Accessibility & Email Notifications

**Epic Goal:** Validate WCAG 2.1 AA compliance with detailed test scripts and implement email notification system for critical user events.

**Total Points:** 10

### Story 4.2.1: Lighthouse CI & Core Web Vitals Validation

**As a** developer  
**I want** Lighthouse CI to enforce performance standards  
**So that** regressions are caught before deployment

**Acceptance Criteria:**

- [ ] **Target metrics (NFR6):**
  - LCP (Largest Contentful Paint): <2.5 seconds
  - FID/INP (First Input Delay / Interaction to Next Paint): <100ms / <200ms
  - CLS (Cumulative Layout Shift): <0.1
  - Lighthouse Performance score: >90
- [ ] Lighthouse CI integrated into GitHub Actions:
  - Run on every PR commit
  - Fail build if performance score <90 or any Core Web Vital fails
  - Comment on PR with Lighthouse report
- [ ] Test pages:
  - Home page `/`
  - Map page `/` (with 100 pins loaded)
  - NGO dashboard `/org/dashboard`
  - Report submission flow `/report`
- [ ] Lighthouse CI configuration:
  - Mobile simulation (Moto G4)
  - 3G throttling (1.6 Mbps)
  - Disable service workers (test cold start)
- [ ] Vercel Analytics integrated for Real User Monitoring (RUM):
  - Track Core Web Vitals in production
  - Alert if metrics degrade >10%
- [ ] Performance budget enforced:
  - Total JS: <300KB (gzipped)
  - Total CSS: <50KB (gzipped)
  - Images: Lazy-loaded, WebP format, max 500KB per page

**Technical Notes:**

- Lighthouse CI config (`.lighthouserc.js`):
  ```javascript
  module.exports = {
    ci: {
      collect: {
        url: [
          'http://localhost:3000/',
          'http://localhost:3000/org/dashboard',
          'http://localhost:3000/report',
        ],
        settings: {
          preset: 'desktop',
          throttling: {
            rttMs: 150,
            throughputKbps: 1638.4,
            cpuSlowdownMultiplier: 4,
          },
        },
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.9 }],
          'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
          'first-input-delay': ['error', { maxNumericValue: 100 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        },
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };
  ```
- GitHub Actions workflow (`.github/workflows/lighthouse.yml`):
  ```yaml
  name: Lighthouse CI
  on: [pull_request]
  jobs:
    lighthouse:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm ci
        - run: npm run build
        - run: npm run start &
        - uses: treosh/lighthouse-ci-action@v9
          with:
            configPath: './.lighthouserc.js'
  ```

**Dependencies:** None (foundational)

**Story Points:** 4

---

### Story 4.2.2: Map Performance Optimization (Load <1s with 100 pins)

**As a** user  
**I want** the map to load instantly  
**So that** I can quickly browse environmental issues

**Acceptance Criteria:**

- [ ] **Performance target (NFR1):**
  - Map loads in <1 second with 100 pins
  - Map loads in <3 seconds with 1,000+ pins
- [ ] **Optimization techniques:**
  - Server-side filtering: Query only pins within map bounds
  - Limit mobile queries to 50 pins, desktop to 100 pins (server-side)
  - Lazy-load Leaflet library (code-split, load on map page only)
  - Use Leaflet's `preferCanvas` option for better performance
  - Debounce map pan/zoom events (500ms) to reduce query frequency
  - Cache map tiles in browser (service worker - Phase 2)
- [ ] Client-side clustering with `react-leaflet-cluster`:
  - Cluster pins at zoom levels <14
  - Unclustered at zoom >=14 (street level)
  - Smooth zoom animations
- [ ] Loading skeleton during map initialization
- [ ] Progressive enhancement: Show map center first, then load pins
- [ ] Performance testing:
  - Load test with 1,000 pins on budget Android device
  - Verify <16ms frame time (60 FPS) during pan/zoom
  - Chrome DevTools Performance profiling

**Technical Notes:**

- Server-side bounds filtering:

  ```typescript
  export async function getMapIssues(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) {
    const limit = isMobile ? 50 : 100;

    const { data } = await supabase
      .from('issues')
      .select('id, lat, lng, category, status, verifications_count')
      .gte('lat', bounds.south)
      .lte('lat', bounds.north)
      .gte('lng', bounds.west)
      .lte('lng', bounds.east)
      .eq('is_flagged', false)
      .limit(limit);

    return data;
  }
  ```

- Leaflet optimization:

  ```tsx
  import { MapContainer } from 'react-leaflet';

  <MapContainer preferCanvas={true} ...>
  ```

- Debounced map events:

  ```tsx
  const debouncedFetch = useMemo(() => debounce((bounds) => fetchIssues(bounds), 500), []);

  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      debouncedFetch(bounds);
    },
  });
  ```

**Dependencies:** Story 1.2.1 (map), Story 1.2.3 (clustering)

**Story Points:** 4

---

## Epic 4.3: Anti-Spam & Abuse Prevention

**Epic Goal:** Implement rate limiting for anonymous users and Cloudflare Turnstile CAPTCHA for high-risk actions to maintain <5% spam rate.

**Total Points:** 6

### Story 4.3.1: Anonymous Report Rate Limiting

**As a** system  
**I want** to rate-limit anonymous report submissions  
**So that** spam reports are prevented

**Acceptance Criteria:**

- [ ] **Rate limits (NFR14):**
  - Anonymous users: 3 reports per hour per device/session/IP
  - Authenticated users: 10 reports per hour
- [ ] **Enforcement:** Database trigger + server-side validation
- [ ] Anonymous user tracking:
  - Use `session_id` from localStorage (same as verification tracking)
  - Fallback to IP address if localStorage unavailable
  - Store rate limit state in database: `rate_limit_log` table
- [ ] Rate limit exceeded error:
  - Modal: "You've reached the hourly limit. Please wait {X} minutes or sign up for more access."
  - Countdown timer showing time until reset
  - "Sign Up" button (encourages authentication)
- [ ] Authenticated users: Higher limit (10/hour) to encourage sign-ups
- [ ] Rate limit reset: 1 hour rolling window
- [ ] Admin bypass: Admins exempt from rate limits
- [ ] Error logging: Track rate limit violations for abuse monitoring

**Technical Notes:**

- Rate limit log table:

  ```sql
  CREATE TABLE rate_limit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT, -- For anonymous users
    user_id UUID REFERENCES users(id), -- For authenticated users
    ip_address INET,
    action_type TEXT NOT NULL, -- 'report_submission', 'verification', etc.
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_rate_limit_session ON rate_limit_log(session_id, created_at);
  CREATE INDEX idx_rate_limit_user ON rate_limit_log(user_id, created_at);
  ```

- Server Action validation:

  ```typescript
  'use server';
  export async function createReport(data) {
    const sessionId = data.session_id;
    const userId = data.user_id;
    const limit = userId ? 10 : 3;

    // Check rate limit (last 1 hour)
    const { count } = await supabase
      .from('rate_limit_log')
      .select('*', { count: 'exact', head: true })
      .eq(userId ? 'user_id' : 'session_id', userId || sessionId)
      .eq('action_type', 'report_submission')
      .gte('created_at', new Date(Date.now() - 3600000).toISOString());

    if (count >= limit) {
      const nextAllowed = new Date(Date.now() + (3600000 - (Date.now() % 3600000)));
      return {
        success: false,
        error: 'rate_limit_exceeded',
        next_allowed: nextAllowed.toISOString(),
      };
    }

    // Log action
    await supabase.from('rate_limit_log').insert({
      session_id: sessionId,
      user_id: userId,
      ip_address: request.ip,
      action_type: 'report_submission',
    });

    // Continue with report creation...
  }
  ```

**Dependencies:** Story 1.3.7 (report submission)

**Story Points:** 3

---

### Story 4.3.2: Cloudflare Turnstile for High-Risk Actions

**As a** system  
**I want** to use Cloudflare Turnstile (CAPTCHA replacement) for proof uploads  
**So that** automated spam is prevented

**Acceptance Criteria:**

- [ ] Cloudflare Turnstile integrated for:
  - Anonymous report submissions (after 2nd report in session)
  - Verification photo uploads
  - Action Card proof uploads
- [ ] **User experience:** Invisible challenge (no user interaction unless suspicious)
- [ ] Turnstile widget placement:
  - Bottom of report form (before "Submit" button)
  - Above proof upload button in verification modal
- [ ] Server-side validation:
  - Verify Turnstile token with Cloudflare API
  - Reject submission if token invalid
  - Error message: "Security check failed. Please try again."
- [ ] **Accessibility:** Turnstile is WCAG 2.1 AA compliant (no visual CAPTCHA)
- [ ] **Performance:** Turnstile loads asynchronously (doesn't block form)
- [ ] Turnstile bypassed for authenticated users with good reputation (>5 verified reports)
- [ ] Error handling:
  - Turnstile API down: Allow submission (don't block users)
  - Token expired: Refresh widget automatically

**Technical Notes:**

- Cloudflare Turnstile setup:
  1. Sign up at https://dash.cloudflare.com/
  2. Create site key and secret key
  3. Add keys to environment variables: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- Client-side integration:

  ```tsx
  'use client';
  import { Turnstile } from '@marsidev/react-turnstile';

  export function ReportForm() {
    const [turnstileToken, setTurnstileToken] = useState('');

    return (
      <form>
        {/* Form fields... */}

        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={setTurnstileToken}
        />

        <button disabled={!turnstileToken}>Submit</button>
      </form>
    );
  }
  ```

- Server-side verification:

  ```typescript
  'use server';
  export async function createReport(data) {
    // Verify Turnstile token
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: data.turnstile_token,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return { success: false, error: 'captcha_failed' };
    }

    // Continue with report creation...
  }
  ```

**Dependencies:** Story 4.3.1 (rate limiting context)

**Story Points:** 3

---

## Epic 4.4: Accessibility & Email Notifications

**Epic Goal:** Validate WCAG 2.1 AA compliance and implement email notification system for critical events.

**Total Points:** 6

### Story 4.4.1: WCAG 2.1 AA Compliance Validation

**As a** user with disabilities  
**I want** the platform to be fully accessible  
**So that** I can use all features with assistive technologies

**Acceptance Criteria:**

- [ ] **Lighthouse accessibility score >90** enforced in CI/CD (NFR26)
- [ ] **Manual screen reader testing** (NFR27):
  - NVDA (Windows)
  - JAWS (Windows)
  - VoiceOver (macOS/iOS)
- [ ] **axe-core automated testing** integrated in Playwright E2E tests:
  - Run on all critical pages (map, report flow, dashboard, profile)
  - Zero violations on production build
- [ ] **Keyboard navigation:** All interactive elements accessible via keyboard
  - Tab order logical (top to bottom, left to right)
  - Focus indicators visible (2px outline, high contrast)
  - No keyboard traps
- [ ] **Color contrast:** 4.5:1 minimum for text, 3:1 for UI components (WCAG AA)
  - Verify with Chrome DevTools Color Picker
  - Test with ColorBlind Chrome extension
- [ ] **Touch targets:** 44x44px minimum (already enforced in previous stories)
- [ ] **ARIA labels:** All icons, buttons, links have descriptive labels
  - Example: `<button aria-label="Report environmental issue">` not just icon
- [ ] **Form validation:** Error messages clearly linked to form fields via `aria-describedby`
- [ ] **Skip links:** "Skip to main content" link at top of page
- [ ] **Alt text:** All images have descriptive alt text (photos, logos, icons)
- [ ] **Accessible modals:** Focus trapped, Escape key closes, focus returns to trigger

**Technical Notes:**

- axe-core integration (Playwright):

  ```typescript
  import { test, expect } from '@playwright/test';
  import AxeBuilder from '@axe-core/playwright';

  test('map page has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  ```

- Lighthouse CI accessibility check (already in Story 4.2.1):
  ```javascript
  'categories:accessibility': ['error', { minScore: 0.9 }]
  ```
- Accessible modal pattern:
  ```tsx
  <Dialog onOpenChange={setOpen}>
    <DialogTrigger ref={triggerRef}>Open</DialogTrigger>
    <DialogContent onEscapeKeyDown={() => setOpen(false)}>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Modal content...</DialogDescription>
      <button
        onClick={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
      >
        Close
      </button>
    </DialogContent>
  </Dialog>
  ```

**Dependencies:** All UI components from Sprints 1-3

**Story Points:** 3

---

### Story 4.4.2: Email Notification System with React Email

**As a** user  
**I want** to receive email notifications for important events  
**So that** I stay informed about my reports and Action Cards

**Acceptance Criteria:**

- [ ] Email notifications sent for:
  - Report verified (2nd verification reached) - Already in Story 2.1.7
  - Report resolved (NGO marked as resolved)
  - Action Card reminder (24 hours before event)
  - Action Card completed (volunteer hours awarded)
- [ ] **Email provider:** Resend (configured in Supabase Auth - NFR43)
- [ ] **Email templates:** React Email for professional formatting
- [ ] **Delivery time:** Emails sent within 5 minutes of event (NFR81)
- [ ] **Email content:**
  - Subject lines: Clear and actionable
  - Body: HTML + plain text fallback
  - CTA buttons: "View Report", "View Action Card"
  - Unsubscribe link (footer)
  - EcoPulse branding (logo, colors)
- [ ] **User preferences:** Opt-out via profile settings (Story 2.2.5)
- [ ] **Error handling:**
  - Email send failed: Log error, retry 3 times
  - Invalid email: Skip sending, log error
  - Rate limit (Resend): Queue for later delivery
- [ ] **Testing:** Send test emails in staging environment

**Technical Notes:**

- React Email templates (`/emails/`):

  ```tsx
  // /emails/report-resolved.tsx
  import { Html, Head, Body, Container, Heading, Text, Button } from '@react-email/components';

  export function ReportResolvedEmail({
    reportId,
    address,
  }: {
    reportId: string;
    address: string;
  }) {
    return (
      <Html>
        <Head />
        <Body style={{ fontFamily: 'sans-serif' }}>
          <Container>
            <Heading>Your Report Was Resolved! 🎉</Heading>
            <Text>
              Great news! The environmental issue you reported at <strong>{address}</strong> has
              been resolved by a local NGO.
            </Text>
            <Text>Thank you for helping clean up your community!</Text>
            <Button
              href={`https://ecopulse.ng/issues/${reportId}`}
              style={{ background: '#059669', color: '#fff', padding: '12px 24px' }}
            >
              View Resolution
            </Button>
          </Container>
        </Body>
      </Html>
    );
  }
  ```

- Resend integration:

  ```typescript
  import { Resend } from 'resend';
  import { ReportResolvedEmail } from '@/emails/report-resolved';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export async function sendReportResolvedEmail(data: {
    to: string;
    reportId: string;
    address: string;
  }) {
    try {
      await resend.emails.send({
        from: 'EcoPulse <notifications@ecopulse.ng>',
        to: data.to,
        subject: 'Your report was resolved!',
        react: ReportResolvedEmail({ reportId: data.reportId, address: data.address }),
      });
    } catch (error) {
      console.error('Email send failed:', error);
      // Retry logic or queue for later
    }
  }
  ```

**Dependencies:** Story 2.1.7 (email infrastructure), Resend API setup

**Story Points:** 3

---

## Epic 4.5: Production Monitoring & Final Polish

**Epic Goal:** Set up production monitoring, error tracking, and final bug fixes for launch.

**Total Points:** 6

### Story 4.5.1: Error Tracking with Sentry

**As a** developer  
**I want** to track production errors  
**So that** I can fix bugs quickly

**Acceptance Criteria:**

- [ ] Sentry integrated for error tracking
- [ ] Error tracking enabled for:
  - Client-side React errors (ErrorBoundary)
  - Server Action errors
  - API route errors
  - Database errors (Supabase queries)
- [ ] Error context captured:
  - User ID (if authenticated)
  - Page URL
  - Browser/device info
  - Stack trace
  - Breadcrumbs (user actions leading to error)
- [ ] Sentry alerts configured:
  - Email notification for new errors
  - Slack webhook for critical errors (optional)
  - Daily digest of unresolved errors
- [ ] Source maps uploaded for readable stack traces
- [ ] Environment tags: `production`, `staging`, `development`
- [ ] **Performance monitoring:** Track slow API responses (>2s)
- [ ] **Release tracking:** Tag errors with git commit SHA

**Technical Notes:**

- Sentry setup:
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```
- Sentry config (`sentry.client.config.ts`):

  ```typescript
  import * as Sentry from '@sentry/nextjs';

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1, // 10% of transactions
    beforeSend(event, hint) {
      // Filter out known errors (e.g., ad blockers)
      if (event.exception?.values?.[0]?.value?.includes('AdBlocker')) {
        return null;
      }
      return event;
    },
  });
  ```

- Error Boundary component:

  ```tsx
  'use client';
  import { ErrorBoundary as SentryErrorBoundary } from '@sentry/nextjs';

  export function ErrorBoundary({ children }: { children: React.ReactNode }) {
    return (
      <SentryErrorBoundary
        fallback={({ error, resetError }) => (
          <div>
            <h2>Something went wrong</h2>
            <pre>{error.message}</pre>
            <button onClick={resetError}>Try again</button>
          </div>
        )}
      >
        {children}
      </SentryErrorBoundary>
    );
  }
  ```

**Dependencies:** None (foundational)

**Story Points:** 3

---

### Story 4.5.2: Production Readiness Checklist & Bug Bash

**As a** team  
**I want** to validate production readiness  
**So that** we launch with confidence

**Acceptance Criteria:**

- [ ] **Production readiness checklist:**
  - ✅ All Sprint 0-4 stories completed (DoD met)
  - ✅ Lighthouse scores >90 (performance, accessibility, best practices)
  - ✅ Core Web Vitals passing (LCP <2.5s, FID <100ms, CLS <0.1)
  - ✅ Zero critical bugs (P0/P1)
  - ✅ Security headers configured (CSP, HSTS, X-Frame-Options)
  - ✅ Environment variables set in Vercel
  - ✅ Database migrations applied in production Supabase
  - ✅ Supabase RLS policies tested
  - ✅ API rate limiting active
  - ✅ Error tracking (Sentry) active
  - ✅ Analytics (Vercel) active
  - ✅ Email notifications working (test emails sent)
  - ✅ Backups configured (Supabase automatic backups)
  - ✅ Domain configured and SSL active
  - ✅ GDPR compliance notice (cookie banner - Phase 2)
- [ ] **Bug bash session:**
  - 2-hour team testing session
  - Test all critical flows (report, verify, Action Cards, dashboard)
  - Test on multiple devices (iOS, Android, desktop)
  - Test on multiple browsers (Chrome, Safari, Firefox)
  - Log all bugs in GitHub Issues
  - Prioritize: P0 (block launch), P1 (fix before launch), P2 (fix post-launch)
- [ ] **Smoke tests (automated):**
  - Playwright E2E tests for critical paths
  - Run on production environment after deployment
  - Alert if any test fails
- [ ] **Launch checklist:**
  - [ ] Final database backup
  - [ ] Deploy to production
  - [ ] Run smoke tests
  - [ ] Monitor error rates (Sentry) for first 24 hours
  - [ ] Monitor performance (Vercel Analytics)
  - [ ] Announce launch (social media, email list)

**Technical Notes:**

- Security headers (`next.config.ts`):
  ```typescript
  module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            {
              key: 'Content-Security-Policy',
              value:
                "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
            },
          ],
        },
      ];
    },
  };
  ```
- Smoke test example:
  ```typescript
  test('critical flow: submit report', async ({ page }) => {
    await page.goto('https://ecopulse.ng');
    await page.click('[aria-label="Report environmental issue"]');
    await page.fill('[name="address"]', '123 Main St, Lagos');
    await page.selectOption('[name="category"]', 'waste');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=Report submitted')).toBeVisible();
  });
  ```

**Dependencies:** All previous stories (Sprint 0-4)

**Story Points:** 3

---

### Story 4.4.3: Sprint 4A Regression Testing

**As a** developer  
**I want** to verify Sprint 4B changes don't break Sprint 4A work  
**So that** performance and security remain intact after API integration

**Acceptance Criteria:**

- [ ] **Re-run all Sprint 4A smoke tests** (11 tests from Story 4.5.3):
  - All 11 tests must still pass after Sprint 4B changes
  - Document any failures with root cause analysis
  - Fix regressions before marking story complete
- [ ] **Verify performance budgets unchanged:**
  - Run Lighthouse CI on all pages tested in Sprint 4A
  - Confirm LCP <2.5s still passing
  - Confirm bundle sizes within budgets (<300KB JS, <50KB CSS)
  - If API code increased bundle size, identify and optimize
- [ ] **Verify security headers intact:**
  - Check CSP header still has nonces (no regression to unsafe-inline)
  - Verify all security headers from Story 4.5.2 present
  - Test XSS attack vectors (should still be blocked)
- [ ] **Verify rate limiting still works:**
  - Test anonymous 3 reports/hour limit
  - Test authenticated 10 reports/hour limit
  - Verify concurrent request test still passes (atomic operations)
- [ ] **Verify Sentry error tracking active:**
  - Trigger test error, confirm appears in Sentry dashboard
  - Verify source maps still working (stack traces readable)
- [ ] **Performance comparison report:**
  - Before Sprint 4B: [baseline metrics from Sprint 4A completion]
  - After Sprint 4B: [new metrics after API/email integration]
  - Regression threshold: <5% degradation acceptable
  - If >5% degradation: Investigate and optimize before launch
- [ ] **Document regression test results:**
  - Save to `_bmad-output/sprint-4b-regression-test-results.md`
  - Include: All test results, performance comparison, any fixes applied
  - Sign-off from PM and Test Architect

**Why This Story Matters:**
Sprint 4B adds significant new code (API routes, email templates, accessibility tests). This could inadvertently:

- Increase bundle sizes (breaking performance budgets)
- Introduce security regressions (CSP violations)
- Break existing functionality (smoke test failures)
- Degrade performance (slower map, higher LCP)

This story ensures we **launch with Sprint 4A quality intact**.

**Technical Notes:**

- Run tests after each Sprint 4B story completes (catch regressions early)
- Use git bisect if regression found but cause unclear
- Performance comparison automated via Lighthouse CI historical data

**Dependencies:**

- Sprint 4A completion (need baseline to compare against)
- All Sprint 4B stories complete (Epic 4.1 + Epic 4.4)

**Story Points:** 2 (NEW STORY - regression validation work)

---

## Epic 4.6: CCPA Compliance (Legal Requirements)

**Epic Goal:** Implement CCPA-required features (privacy policy, account deletion, user data export, data sharing opt-out) to ensure legal compliance before California pilot launch.

**Total Points:** 8

### Story 4.6.1: Privacy Policy & Terms of Service Pages

**As a** user  
**I want** to review the platform's privacy policy and terms of service  
**So that** I understand how my data is collected and used

**Acceptance Criteria:**

- [ ] Privacy Policy page (`/privacy`) with comprehensive sections:
  - Data collection practices (what we collect: email, location, photos, reports)
  - Data usage (how we use your data: platform functionality, NGO coordination)
  - Data sharing (who we share with: NGOs, public API, government agencies)
  - Data retention (how long we keep your data: active account duration + 7 years for audit trail)
  - Your rights under CCPA (right to know, delete, opt-out)
  - Contact information for privacy requests (privacy@ecopulse.ng)
  - Last updated date (automatically tracked)
- [ ] Terms of Service page (`/terms`) with:
  - Acceptable use policy (no spam, harassment, false reports)
  - User responsibilities (accuracy of reports, verification integrity)
  - Prohibited content (no personal attacks, doxxing, illegal activity)
  - Termination clause (we may suspend accounts for violations)
  - Dispute resolution (arbitration clause for legal disputes)
  - Governing law (California law - aligned with Oakland pilot)
  - Last updated date
- [ ] Footer links to both pages on all pages
- [ ] Signup flow checkbox: "I agree to the Terms of Service and Privacy Policy" (required)
  - Checkbox unchecked by default (GDPR best practice)
  - Clicking checkbox opens modal with full text preview
  - Cannot submit signup form without checking
- [ ] Admin dashboard: Policy version tracking
  - Track when policies were last updated
  - Notify all users via email when policies change (30-day notice)
  - Option to accept new version or delete account
- [ ] SEO-optimized pages (indexed for transparency)
- [ ] Mobile-responsive formatting (long legal text readable on mobile)
- [ ] Accessible (screen reader friendly, proper heading hierarchy)

**Technical Notes:**

- Use markdown files in `/content/legal/` for easy updates:
  ```
  /content/legal/privacy-policy.md
  /content/legal/terms-of-service.md
  ```
- Render with Next.js MDX or react-markdown
- Version tracking in database:
  ```sql
  CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'privacy' | 'terms'
    version INT NOT NULL,
    content TEXT NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- Signup form checkbox:
  ```tsx
  <label className="flex items-start gap-2">
    <input
      type="checkbox"
      required
      checked={agreedToTerms}
      onChange={(e) => setAgreedToTerms(e.target.checked)}
    />
    <span className="text-sm">
      I agree to the{' '}
      <a href="/terms" target="_blank" className="underline">
        Terms of Service
      </a>{' '}
      and{' '}
      <a href="/privacy" target="_blank" className="underline">
        Privacy Policy
      </a>
    </span>
  </label>
  ```

**Legal Review Required:**

- [ ] Privacy policy reviewed by data privacy attorney (CCPA compliance)
- [ ] Terms of service reviewed by corporate attorney (liability protection)
- [ ] Sign-off from legal counsel before deployment

**Dependencies:** None (foundational legal requirement)

**Story Points:** 2

---

### Story 4.6.2: Account Deletion (CCPA Right to Deletion)

**As a** user  
**I want** to permanently delete my account and personal data  
**So that** I can exercise my CCPA right to deletion

**Acceptance Criteria:**

- [ ] Profile settings: "Delete Account" button (danger zone section)
- [ ] Delete account flow:
  - Click "Delete Account" → Modal opens
  - Modal warning: "This action is permanent and cannot be undone. Your personal information will be deleted, but anonymized contributions will be preserved for audit trail."
  - Input field: "Type DELETE to confirm"
  - Checkbox: "I understand that my account cannot be recovered"
  - Confirm button (disabled until both requirements met)
- [ ] Data deletion process:
  - **Personal information deleted:**
    - Email address (replaced with `deleted_user_<uuid>@ecopulse.internal`)
    - Username (replaced with `Deleted User <uuid>`)
    - Avatar URL (removed)
    - Phone number (if provided)
    - Any optional profile fields
  - **Anonymized contributions preserved:**
    - Issue reports: `user_id` set to NULL, `session_id` randomized
    - Verifications: `user_id` set to NULL
    - Action Card participation: Username replaced with "Deleted User"
    - Points history: User ID preserved for audit but name removed
  - **Fully deleted (no retention):**
    - API tokens (all revoked and deleted)
    - Notification preferences
    - Profile settings
    - Session data
- [ ] Audit trail preservation (7-year retention for NGO/government compliance):
  - Anonymized issue reports remain visible on map (no personal identifiers)
  - Verification photos preserved (no username/email attached)
  - CSV exports show "Deleted User" instead of real username
- [ ] Email confirmation:
  - Send email to user's email address: "Your account has been deleted"
  - Include date of deletion and appeal contact (within 30 days)
  - After 30 days, deletion is final (no recovery)
- [ ] Account deletion logged in admin audit trail:
  - User ID, email (encrypted), deletion date, reason (user-initiated)
- [ ] Grace period (optional enhancement):
  - 30-day soft delete: Account marked `deleted_at` but not fully anonymized
  - User can recover within 30 days by logging in
  - After 30 days, cron job fully anonymizes data
- [ ] Admin override (support use case):
  - Support staff can delete accounts on user request (CCPA compliance)
  - Requires admin approval + audit log entry

**Technical Notes:**

- Server Action for account deletion:

  ```typescript
  'use server';
  export async function deleteAccount(userId: string, confirmationText: string) {
    if (confirmationText !== 'DELETE') {
      throw new Error('Confirmation text must be "DELETE"');
    }

    const uuid = crypto.randomUUID();

    // Anonymize user record
    await supabase
      .from('users')
      .update({
        email: `deleted_user_${uuid}@ecopulse.internal`,
        username: `Deleted User ${uuid}`,
        avatar_url: null,
        phone: null,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', userId);

    // Anonymize issue reports
    await supabase
      .from('issues')
      .update({ user_id: null, session_id: crypto.randomUUID() })
      .eq('user_id', userId);

    // Revoke API tokens
    await supabase.from('api_tokens').delete().eq('organization_id', userId);

    // Send confirmation email
    await sendAccountDeletionEmail(email);

    // Log to audit trail
    await logAuditEvent({
      action: 'account_deleted',
      actor_id: userId,
      metadata: { email_encrypted: encrypt(email) },
    });
  }
  ```

- Grace period implementation (optional):
  - Add `deleted_at` column to `users` table
  - Cron job runs daily: fully anonymize accounts with `deleted_at > 30 days ago`
  - Login page: Check if `deleted_at` exists, offer recovery option

**Dependencies:** Story 4.6.1 (privacy policy must explain deletion process)

**Story Points:** 3

---

### Story 4.6.3: User Data Export (CCPA Right to Know)

**As a** user  
**I want** to export all my personal data  
**So that** I can review what ecoPulse knows about me (CCPA compliance)

**Acceptance Criteria:**

- [ ] Profile settings: "Export My Data" button
- [ ] Data export flow:
  - Click "Export My Data" → Server Action triggered
  - Generate JSON file with all user data (see technical notes)
  - Email user: "Your data export is ready" with download link
  - Download link expires after 7 days (privacy protection)
- [ ] Exported data includes:
  - **Personal information:**
    - Email, username, phone (if provided)
    - Profile bio, avatar URL
    - Account creation date, last login date
    - Organization affiliation (if NGO/government user)
  - **Activity data:**
    - All issue reports (id, location, category, severity, status, photos, notes, created_at)
    - All verifications submitted (issue_id, verification_photo, notes, timestamp)
    - All Action Card participations (action_card_id, event_date, volunteer_hours)
    - All flagged content (flagged_issue_id, reason, timestamp)
  - **Engagement metrics:**
    - Total points earned (not exported since removed in favor of tangible impact)
    - Tangible impact stats (kg waste removed, verified resolutions)
    - Total reports, verifications, Action Card participation count
  - **API tokens (if NGO/org user):**
    - Token names, creation dates, last used dates (not the actual tokens)
  - **Notification preferences:**
    - Email notification settings (enabled/disabled by event type)
- [ ] Export format: Machine-readable JSON
  - Example structure:
    ```json
    {
      "export_date": "2025-12-20T10:30:00Z",
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "username": "johndoe",
        "created_at": "2025-01-15T08:00:00Z"
      },
      "reports": [
        {
          "id": "uuid",
          "location": { "lat": 6.5244, "lng": 3.3792 },
          "category": "waste",
          "severity": "high",
          "status": "resolved",
          "created_at": "2025-02-20T14:30:00Z"
        }
      ],
      "verifications": [...],
      "action_cards": [...]
    }
    ```
- [ ] Export generation time: <45 seconds for typical user (CCPA 45-day requirement met within minutes)
- [ ] Export size limit: <10MB per user (paginate if needed)
- [ ] Email notification:
  - Subject: "Your ecoPulse Data Export is Ready"
  - Body: "You requested a copy of your personal data. Download it here: [link]. This link expires in 7 days."
  - Resend integration (same as Story 4.4.2)
- [ ] Security:
  - Download link requires authentication (user must be logged in)
  - Download link is one-time use (revoked after first download)
  - Expires after 7 days (automatic cleanup)
- [ ] Admin dashboard: Track data export requests
  - Table: User, Request Date, Download Status, Expiration Date
  - Monitor for abuse (multiple exports per day)

**Technical Notes:**

- Server Action for data export:

  ```typescript
  'use server';
  export async function requestDataExport(userId: string) {
    // Fetch all user data
    const [user, reports, verifications, actionCards] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('issues').select('*').eq('user_id', userId),
      supabase.from('verifications').select('*').eq('user_id', userId),
      supabase.from('action_card_participants').select('*').eq('user_id', userId),
    ]);

    // Generate JSON export
    const exportData = {
      export_date: new Date().toISOString(),
      user: user.data,
      reports: reports.data,
      verifications: verifications.data,
      action_cards: actionCards.data,
    };

    // Save to Supabase Storage (temporary bucket)
    const filename = `user_export_${userId}_${Date.now()}.json`;
    await supabase.storage
      .from('data-exports')
      .upload(filename, JSON.stringify(exportData, null, 2), {
        contentType: 'application/json',
        cacheControl: '604800', // 7 days
      });

    // Generate signed URL (7-day expiration)
    const { data: signedUrl } = await supabase.storage
      .from('data-exports')
      .createSignedUrl(filename, 604800); // 7 days in seconds

    // Send email with download link
    await sendDataExportEmail(user.data.email, signedUrl.signedUrl);

    // Log to audit trail
    await logAuditEvent({
      action: 'data_export_requested',
      actor_id: userId,
      metadata: { filename },
    });
  }
  ```

- Cleanup cron job:
  - Run daily: Delete exports older than 7 days from `data-exports` bucket
  - Supabase Storage lifecycle policy (automatic cleanup)

**Dependencies:** Story 4.6.1 (privacy policy must explain data export process)

**Story Points:** 2

---

### Story 4.6.4: Data Sharing Opt-Out (CCPA Right to Opt-Out)

**As a** user  
**I want** to control whether my reports are shared with NGOs  
**So that** I can exercise my CCPA right to opt-out of data sharing

**Acceptance Criteria:**

- [ ] Profile settings: "Data Sharing Preferences" section
- [ ] Checkbox: "Share my reports with NGOs for coordination" (default: enabled)
  - Label explains: "NGOs use this data to organize community cleanups and address environmental issues"
  - Help text: "Opting out means NGOs won't see your reports in their dashboards, but reports remain public on the map"
- [ ] Database schema update:
  ```sql
  ALTER TABLE users ADD COLUMN allow_ngo_sharing BOOLEAN DEFAULT true;
  CREATE INDEX idx_users_ngo_sharing ON users(allow_ngo_sharing);
  ```
- [ ] RLS policy update for NGO dashboard queries:
  - Current: NGOs see all reports in their coverage area
  - Updated: NGOs only see reports where `reporter.allow_ngo_sharing = true`
  - Query modification:
    ```sql
    SELECT i.* FROM issues i
    LEFT JOIN users u ON i.user_id = u.id
    WHERE i.address ILIKE '%Oakland%'
      AND (u.allow_ngo_sharing = true OR i.user_id IS NULL); -- Anonymous reports always visible
    ```
- [ ] Privacy Policy update:
  - Add section: "Your Right to Opt-Out of Data Sharing"
  - Explain: "You can opt-out of sharing your reports with NGOs in Profile Settings. Reports remain public on the map for community transparency."
  - Clarify: "Opting out does not affect your ability to report issues or verify others' reports."
- [ ] User notification on first opt-out:
  - Modal: "Are you sure you want to opt-out?"
  - Warning: "NGOs won't be able to coordinate Action Cards for your reports. Reports remain public."
  - Checkbox: "I understand and want to opt-out"
  - Confirm button
- [ ] Impact on existing features:
  - Map view: No change (all reports still visible to public)
  - Action Cards: NGOs can't attach Action Cards to opted-out reports
  - CSV exports: Opted-out reports excluded from NGO exports
  - Verification: Other users can still verify opted-out reports
- [ ] Analytics tracking:
  - Track opt-out rate (monitor for unintended consequences)
  - Alert if >10% of users opt-out (may indicate UX confusion)
- [ ] Testing:
  - Verify NGO dashboard filters opted-out reports
  - Verify CSV exports exclude opted-out reports
  - Verify anonymous reports always visible (no user_id to check preference)
  - Verify map view shows all reports regardless of opt-out status

**Technical Notes:**

- Server Action for updating preference:

  ```typescript
  'use server';
  export async function updateDataSharingPreference(userId: string, allowSharing: boolean) {
    await supabase.from('users').update({ allow_ngo_sharing: allowSharing }).eq('id', userId);

    // Log preference change
    await logAuditEvent({
      action: 'data_sharing_preference_updated',
      actor_id: userId,
      metadata: { allow_ngo_sharing: allowSharing },
    });
  }
  ```

- NGO dashboard query pattern:
  ```typescript
  const { data: reports } = await supabase
    .from('issues')
    .select('*, users!left(allow_ngo_sharing)')
    .ilike('address', `%${org.coverage_area}%`)
    .or('allow_ngo_sharing.eq.true,user_id.is.null'); // Opted-in OR anonymous
  ```
- Default to `true` ensures existing users maintain current behavior (no disruption)
- Opt-out is CCPA-compliant: stops data sharing while preserving public transparency

**Why This Story Matters (CCPA Compliance):**

- **CCPA Right to Opt-Out:** California law requires businesses to allow users to opt-out of data "sale" or sharing
- **ecoPulse interpretation:** While we don't "sell" data, sharing with NGOs qualifies as "disclosure for business purpose"
- **Compliance strategy:** Provide clear opt-out mechanism while maintaining platform value (public map visibility)
- **User control:** Balances privacy rights with community benefit (transparency vs. NGO coordination)

**UX Considerations:**

- **Default enabled:** Most users want NGOs to help resolve their reports
- **Clear explanation:** Users understand trade-off (less NGO help but more privacy)
- **Non-punitive:** Opting out doesn't remove reports from map or reduce user functionality
- **Reversible:** Users can re-enable sharing anytime

**Dependencies:** Story 4.6.1 (privacy policy must explain opt-out option)

**Story Points:** 1

---

## Sprint 4B Summary

**Total Stories:** 12 (was 8, +4 for CCPA compliance)  
**Total Story Points:** 42 (was 34, +8 for Epic 4.6)

**Epics Breakdown:**

- Epic 4.1: Public Read-Only API (4 stories, 22 points)
- Epic 4.4: Accessibility & Email Notifications (4 stories, 12 points)
- Epic 4.6: CCPA Compliance (4 stories, 8 points) **[NEW - LEGAL REQUIREMENT]**

**Key Deliverables:**
✅ Public REST API with token authentication  
✅ Token expiration + revocation management  
✅ API rate limiting (100 req/hour) with Upstash Redis  
✅ OpenAPI 3.0 spec with Swagger UI  
✅ WCAG 2.1 AA compliance with detailed test scripts  
✅ Email notifications (React Email + Resend)  
✅ Comprehensive API documentation  
✅ SEO-optimized API docs page  
✅ Sprint 4A regression testing (all 11 smoke tests + performance validation)  
✅ **Privacy Policy & Terms of Service pages (CCPA compliance)**  
✅ **Account deletion (CCPA right to deletion)**  
✅ **User data export (CCPA right to know)**  
✅ **Data sharing opt-out (CCPA right to opt-out)**

**Technical Achievements:**

- Token-based API auth with SHA-256 hashing
- Upstash Redis rate limiting with atomic operations
- OpenAPI 3.0 compliant documentation
- Interactive Swagger UI with try-it-out functionality
- Manual accessibility test scripts (NVDA, JAWS, VoiceOver)
- React Email professional templates
- Resend email integration with retry logic

**Dependencies Resolved:**

- API endpoints depend on Sprint 4A performance + security
- Email notifications require Resend DNS configuration (SPF/DKIM)
- Accessibility validation covers all Sprint 0-4A UI components

**Prerequisites Completed:**

- Upstash Redis provisioned and configured
- Resend account created with domain verification
- Token management UI designed
- Performance baselines established in Sprint 4A

---

# MVP Complete - Sprint 0-4B Summary

**Total Duration:** 16 weeks (1 week setup + 15 weeks development)  
**Total Stories:** 70 stories  
**Total Story Points:** 240 points

**Sprint Breakdown:**

- **Sprint 0:** 4 stories, 19 points (Environment setup)
- **Sprint 1:** 18 stories, 54 points (Core reporting + Map)
- **Sprint 2:** 18 stories, 57 points (Verification + Profiles)
- **Sprint 3:** 13 stories, 42 points (NGO Dashboard + Actions)
- **Sprint 4A:** 8 stories, 37 points (Performance + Security + Monitoring)
- **Sprint 4B:** 12 stories, 42 points (API + Accessibility + CCPA Compliance)

**Production-Ready Platform Features:**
✅ Mobile-first responsive design (320px-1920px)  
✅ Interactive Leaflet map with real-time pins (<1s load with 100 pins)  
✅ 60-second report submission (photos + voice notes)  
✅ Community verification (2-verification threshold)  
✅ User profiles with tangible impact metrics (NO gamification)  
✅ NGO dashboard with auto-prioritized issue queue  
✅ CSV exports for funder reports (RFC 4180 compliant)  
✅ Action Cards for volunteer coordination  
✅ Before/after proof photos for verified outcomes  
✅ **Public REST API** with token authentication (100 req/hour)  
✅ Public organization directory (SEO-indexed)  
✅ WCAG 2.1 AA compliant (manual + automated testing)  
✅ Core Web Vitals optimized (LCP <2.5s enforced in CI/CD)  
✅ Production monitoring (Sentry + Vercel Analytics)  
✅ Anti-spam protection (rate limiting + Turnstile CAPTCHA)  
✅ Email notifications (React Email templates)  
✅ Security hardening (CSP with nonces, no XSS vulnerabilities)  
✅ Comprehensive smoke tests (10 critical flows)  
✅ **CCPA compliance (Privacy Policy, Account Deletion, Data Export)**

**Performance Achievements:**

- LCP <2.5s on 3G mobile
- Map loads in <1s with 100 pins
- FID/INP <100ms/<200ms
- CLS <0.1
- Lighthouse performance score >90 (enforced in CI/CD)
- Bundle sizes within budgets (<300KB JS, <50KB CSS)

**Security Achievements:**

- Nonce-based CSP (no unsafe-inline/unsafe-eval)
- API token expiration + revocation
- Rate limiting with atomic operations (no race conditions)
- Fail-secure Turnstile (anonymous users blocked if CAPTCHA down)
- Supabase RLS policies audited and tested
- HTTPS enforcement with HSTS

**Success Metrics (MVP Goals):**

- 500 users
- 100 verified resolutions
- 10 NGOs signed up (5 paying $49-99/month)
- <5% spam rate (achieved via rate limiting + Turnstile)
- 99.9% uptime (monitored with Sentry + Vercel Analytics)
- Zero data loss (Supabase automatic backups)

**Team Review Findings Addressed:**
✅ Sprint split into 4A + 4B (reduced overcommitment from 67pts to 35+32pts)  
✅ Story estimates revised based on team feedback (+36% total points)  
✅ Blockers resolved (Upstash Redis, Resend DNS, token UI mockup)  
✅ Security vulnerabilities fixed (CSP nonces, fail-secure Turnstile, atomic rate limiting)  
✅ Testing gaps filled (performance budgets, accessibility test scripts, smoke tests)  
✅ 7 new stories added (cleanup job, performance budgets, test scripts)

**Next Steps (Post-MVP / Phase 2):**

- Government admin panel with full RBAC
- 311 integration API (bidirectional sync)
- Self-hosting option (Docker + Supabase self-hosted)
- Advanced search with Algolia
- Mobile app (React Native)
- SMS notifications for low-connectivity areas
- Multi-language support (i18n with next-intl)
- Advanced analytics dashboard
- Donation integration for NGOs
- Team collaboration features (chat, task assignment)
- API write endpoints (POST/PUT/DELETE for authenticated NGOs)
- GraphQL API alternative
- Webhook notifications for real-time integrations

**Launch Ready! 🚀**

---

## Team Sign-Off

**Date:** 2025-12-20 (After Sprint 4 Split Review)

**Team Consensus:**

- ✅ Sprint 4 split into 4A + 4B approved unanimously
- ✅ Revised estimates validated by Winston (Architect), Bob (SM), Murat (TEA), Amelia (Dev)
- ✅ Blockers identified and resolution plan documented
- ✅ Security vulnerabilities addressed in revised stories
- ✅ Testing strategy comprehensive and achievable
- ✅ 16-week timeline realistic for intermediate team

**Architect (Winston) Sign-Off:**

- API architecture production-ready with token expiration + revocation
- CSP with nonces eliminates XSS risks
- Performance baselines established before API work begins
- PostGIS optimization deferred to Phase 2 (acceptable trade-off)

**Scrum Master (Bob) Sign-Off:**

- Sprint velocity sustainable (35-42 points per 3-week sprint)
- Story breakdowns achievable with clear acceptance criteria
- Dependencies mapped and validated
- Definition of Done enforceable

**Test Architect (Murat) Sign-Off:**

- Test coverage comprehensive (unit + E2E + manual + performance)
- Performance regression prevention in CI/CD
- Accessibility testing reproducible with detailed scripts
- Smoke tests cover all critical flows

**Developer (Amelia) Sign-Off:**

- All blockers resolvable before Sprint 4A start
- Implementation details clear and complete
- Library choices validated (Leaflet.markercluster over react-leaflet-cluster)
- Estimated effort realistic for features described

**Product Manager (John) Sign-Off:**

- MVP scope achieves all success metrics
- Timeline extension (3 weeks) justified by quality improvements
- Team feedback incorporated comprehensively
- Ready to execute Sprint 4A on Week 10

---
