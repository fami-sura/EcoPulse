---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - '_bmad-output/project-planning-artifacts/prd.md'
  - '_bmad-output/project-planning-artifacts/prd-progress-summary.md'
  - '_bmad-output/project-planning-artifacts/strategic-decisions.md'
workflowType: 'architecture'
lastStep: 5
project_name: 'ecoPulse'
user_name: 'Aliahmad'
date: '2025-12-17'
hasProjectContext: false
---

# Architecture Decision Document - ecoPulse

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (80 Total):**

ecoPulse is a distributed environmental action platform with 11 functional categories:

1. **Core Reporting** - Issue submission with required fields (category, location, severity, photo, note), anonymous + authenticated flows, 60-second target submission time
2. **Verification System** - Second-person verification with before/after photos, verifier ≠ submitter enforcement, photo validation rules
3. **User Profiles & Community Motivation** - Tangible impact metrics (kg waste removed, verified resolutions), personal impact stats ("You saved 15 kg of waste!"), contributions timeline (NO points/badges)
4. **NGO/Org Dashboard** - KPIs, verified outcomes, CSV exports for donor reporting, team performance metrics
5. **Contact Directory** - Configurable who-to-contact per category/region, WhatsApp/email templates
6. **Action Cards** - 6 deterministic templates (2 categories × 3 severities), database-driven with safety notes
7. **Moderation** - Flag queue, hide/unhide, mark duplicates, admin audit logs
8. **Search & Filtering** - Map filters by category/status/date/organization, "near me" geospatial queries
9. **Teams** - User groups, team leaderboards, follow local areas, organizational affiliations
10. **Public API** - REST endpoints for 311 integration (Phase 2), API keys, rate limiting
11. **Accessibility** - WCAG 2.1 AA compliance, keyboard navigation, screen reader support, high contrast mode

**Non-Functional Requirements (72 Total):**

Critical NFRs that will drive architectural decisions:

- **Performance (Non-Negotiable):**
  - Map load time: <1s with 1,000 pins (client-side clustering required)
  - Report submission: <10s on 3G including photo upload
  - Page loads: <2s on 4G mobile (mobile-first requirement)
  - Dashboard KPIs: <2s using materialized views
  - API response: <500ms for all endpoints
  - Geospatial queries: <500ms with GiST indexing

- **Security & Privacy:**
  - Multi-org data isolation: Supabase Row-Level Security (RLS) enforcement
  - EXIF stripping: 100% of photos have GPS metadata removed before storage
  - Anonymous rate limiting: <5% spam reports
  - Input validation: Server-side validation of coordinates, photo sizes, text lengths
  - Audit logs: 100% of admin actions logged (org_id, actor, action, timestamp)

- **Data Integrity (Zero Tolerance):**
  - Data loss: Zero tolerance for verification photos, reports, proof data
  - Export accuracy: <0.1% error rate on CSV exports (NGO donor trust = business model)
  - Verification integrity: Second-person rules enforced 100%
  - Export generation must be transactional with ACID guarantees

- **Scalability:**
  - User growth: 500 MVP → 5,000 Year 1 → 50,000+ Year 2
  - Concurrent users: 1,000 without degradation
  - Geospatial performance: GiST index on (lat, lng) for efficient spatial queries

- **Accessibility & Compliance (Govtech Requirement):**
  - WCAG 2.1 AA compliance for Section 508 (government use)
  - Mobile responsive: 100% feature parity mobile/desktop
  - Data sovereignty: Organizations export ALL data as CSV/JSON on demand
  - Touch targets: 44x44px minimum for mobile accessibility

- **Availability:**
  - Uptime: 99.9% (downtime < 9 hours/year via Supabase infrastructure)
  - Disaster recovery: Backup/restore procedures for business continuity

**Scale & Complexity:**

- **Primary domain:** Full-stack web application (mobile-first responsive, 320px-2560px)
- **Complexity level:** HIGH (govtech with multi-org collaboration, real-time features, regulatory compliance)
- **Estimated architectural components:** 15-20 major components
  - Frontend: Map + Forms + Dashboards + Profiles + Verification flows
  - Backend: API layer + Authentication + Authorization (RLS) + File processing + Notifications
  - Data: PostgreSQL + Spatial extensions + Materialized views + Audit logging
  - Infrastructure: CDN + Storage + Real-time subscriptions

### Technical Constraints & Dependencies

**Locked Tech Stack Decisions (from PRD):**

- **Frontend:** Next.js 15 (React Server Components, App Router)
- **Backend/Database:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Maps:** Leaflet + OpenStreetMap (data sovereignty, no vendor lock-in)
- **Geolocation:** float8 (double precision lat/lng) with GiST index for spatial queries
- **Action Cards:** Database-driven templates (not hardcoded)
- **Hosting:** Vercel (frontend) + Supabase Cloud (backend)

**Known Constraints:**

- Must support self-hosting architecture (Phase 2) - affects deployment architecture NOW
- Must integrate with future 311 systems via API (Phase 2) - requires API-first design
- Must support data export for donor reporting - requires well-structured data model
- Must handle anonymous users with rate limiting - requires device/session/IP tracking
- Must strip EXIF metadata from photos - requires server-side image processing pipeline
- Mobile-first requirement - all features must work on 320px screens with touch optimization

**Dependencies & Risk Analysis:**

| Dependency              | Purpose                           | Risk                            | Fallback Strategy                                                   |
| ----------------------- | --------------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| Supabase                | Database, Auth, Storage, Realtime | Outage during NGO board meeting | Document backup/restore procedures, consider read replicas          |
| Vercel                  | Frontend hosting, Edge Functions  | Deployment issues               | Multi-region deployment, consider CDN failover                      |
| Leaflet + OpenStreetMap | Map visualization                 | Performance issues at scale     | Evaluate map clustering optimization, consider MapLibre GL fallback |
| CDN (Supabase Storage)  | Image delivery                    | Cost/performance                | Design for CDN portability (CloudFlare, AWS CloudFront)             |
| Email Service (Resend)  | Notifications                     | Delivery failures               | Design email provider abstraction layer                             |

**Self-Hosting Architecture Consideration (Phase 2 but affects MVP):**

- Supabase supports self-hosting (PostgreSQL + PostgREST + GoTrue + Storage API)
- Architecture should avoid Vercel-specific features that break on-premise deployment
- Document deployment requirements: Docker, PostgreSQL, object storage (S3-compatible)
- Design multi-deployment from day one to avoid major refactoring later

### Cross-Cutting Concerns Identified

These architectural concerns will affect multiple components and require coordinated decisions:

#### MVP-Critical Concerns (Sprint 1-4)

**1. Multi-Tenancy & Data Isolation**

- Organizations share infrastructure but data must be isolated
- Row-Level Security (RLS) policies enforce org boundaries
- Some data is shared (public map view), some is org-private (dashboard analytics)
- **Performance Critical:** RLS can become bottleneck if not architected correctly
  - Index strategy must align with RLS policies: index on `org_id` for EVERY multi-tenant table
  - RLS policies should use indexed columns only
  - Composite indexes required: `(org_id, location)` with GiST for geospatial queries
  - Load test RLS under concurrent multi-org access (1,000+ users)
- Affects: Database schema, API layer, UI permissions, query performance

**2. Geospatial Data Handling**

- Float8 lat/lng with GiST indexing for "near me" queries
- Client-side map clustering for performance (1,000+ pins without lag)
- Bounding box queries for visible map area
- **Specific Query Pattern (must be <500ms with 50,000 issues):**
  ```sql
  SELECT * FROM issues
  WHERE ST_DWithin(location, ST_MakePoint($lng, $lat), 5000) -- 5km radius
  AND org_id = $org_id
  LIMIT 100;
  ```
- **Index Strategy:** Composite indexes: `(org_id, location)` with GiST
- Mobile map performance: clustering MORE critical on mobile (320px screens)
- Affects: Database indexing, API design, frontend map component, mobile optimization

**3. Authentication & Authorization**

- Three user types: Anonymous, Authenticated, Admin
- Anonymous users have limited actions + rate limiting (session-based tracking via localStorage session_id, device fingerprinting added if abuse >5% in Month 3)
- RBAC for organization-level permissions
- Second-person verification rules enforced at database level (verifier_session_id ≠ reporter_session_id for anonymous users):
  ```sql
  ALTER TABLE verifications
  ADD CONSTRAINT check_verifier_not_submitter
  CHECK (verifier_id != (SELECT user_id FROM issues WHERE id = issue_id));
  ```
- Edge case: Admin verification overrides need audit trail
- Affects: Auth flow, RLS policies, API middleware, UI state, database constraints

**4. File Storage & Processing**

- Photo uploads with EXIF stripping (remove GPS metadata BEFORE storing)
- **EXIF Stripping Pipeline Architecture:**
  - Process images BEFORE storing in Supabase Storage (not after)
  - Use queue (Supabase Edge Functions or Vercel serverless) for async processing
  - Retry logic if EXIF stripping fails? Reject upload? (Decision needed)
- Image optimization (CDN, compression, responsive images)
- Before/after photo requirements for verification
- Zero data loss requirement for verification photos (business-critical)
- Photo capture optimization: compress before upload on mobile (reduce 3G upload time)
- Affects: Storage architecture, image processing pipeline, CDN strategy, mobile performance

**5. Performance Optimization**

- Map clustering (client-side, MORE critical on mobile)
- Dashboard KPIs via materialized views (refreshed hourly, ACID guarantees for export accuracy)
- API response caching where appropriate
- Image CDN with automatic optimization
- Geospatial query optimization (composite indexes + query planning)
- Affects: Frontend architecture, database views, caching strategy, mobile UX

**6. Accessibility Compliance**

- WCAG 2.1 AA mandatory for all features (government requirement, non-negotiable)
- Keyboard navigation, screen readers, high contrast
- Touch targets: 44x44px minimum for mobile accessibility
- Must be validated before launch with automated + manual testing
- **Testing Infrastructure Required:**
  - Automated accessibility testing in CI (axe-core, Lighthouse)
  - Manual testing with screen readers (NVDA, JAWS, VoiceOver)
  - Keyboard navigation testing for ALL workflows
- Affects: Component library selection, testing strategy, development workflow, QA gates

#### Phase 2 Concerns (Deferred but Architecturally Considered)

**7. Real-Time Features** _(Can be simplified for MVP - polling initially, WebSocket in Phase 2)_

- Live map updates when new issues reported
- Verification status changes
- Team activity notifications
- Affects: WebSocket/SSE strategy, state management, database subscriptions

**8. Audit & Compliance** _(Basic action tracking in MVP, full audit logging Phase 2)_

- All admin actions logged (org_id, actor, action, timestamp, metadata)
- Data export capability (CSV/JSON) for all organizations
- Privacy-first design (anonymous reporting, EXIF stripping)
- Security audit trail for compliance (NGO/government requirement)
- Affects: Database schema, API logging, data model design, compliance reporting

**9. API-First Design** _(Internal API only in MVP, public API Phase 2)_

- Public API for future 311 system integrations (Phase 2)
- CSV/JSON exports for NGO donor reporting (MVP)
- Rate limiting per organization tier (free vs paid)
- API-as-a-product potential (charge for API access in Phase 2)
- Webhook subscriptions for real-time notifications (Phase 2)
- Affects: API architecture, documentation, versioning strategy, revenue model

**10. Gamification & Verification Loop** _(Core loop MVP, leaderboards Phase 2)_

- Points awarded for verified actions only
- Second-person verification enforced at database level
- User profiles show verified contributions
- Team leaderboards (Phase 2)
- Affects: Database triggers/constraints, point calculation logic, UI design

#### Additional Cross-Cutting Concerns (From Team Feedback)

**11. Data Migration & Versioning Strategy**

- Government/NGO customers cannot have data broken during updates
- Database migration strategy: forward/backward compatible migrations
- Zero-downtime deployment architecture required
- Rollback procedures must be tested regularly
- **Architecture Implications:**
  - Use migration tools (Supabase migrations, Prisma, or native PostgreSQL)
  - Version API endpoints if breaking changes occur
  - Blue-green deployment or rolling updates for zero downtime
- Affects: Database schema evolution, deployment pipeline, DevOps strategy

**12. Test Data Management**

- Need realistic test data: geospatial coordinates, photos, multi-org scenarios
- Cannot expose real user data in testing environments
- Synthetic data generation for load testing
- **Test Scenarios Critical to Architecture:**
  - Can user A verify their own proof? (Should fail - database constraint validation)
  - Can user A verify proof if they later claimed the issue? (Edge case)
  - Can admin override verification rules? (Audit trail required)
  - What if verification photos are deleted? (Data integrity validation)
- Affects: Testing infrastructure, CI/CD pipeline, data seeding scripts

**13. Business Continuity & Disaster Recovery**

- NGOs presenting at board meetings cannot tolerate Supabase outages
- Backup/restore procedures documented and tested
- **Recovery Requirements:**
  - Point-in-time recovery (PITR) for database (Supabase supports this)
  - Image backup strategy (S3 versioning or equivalent)
  - Documented recovery time objective (RTO): <4 hours
  - Documented recovery point objective (RPO): <1 hour
- Self-service data export: organizations control their own data
- Affects: Infrastructure design, SLA commitments, customer contracts

**14. Mobile-First Architecture**

- Touch targets: 44x44px minimum (accessibility requirement)
- Offline capability: PWA for field reporting in low-connectivity areas (Phase 2, but affects architecture NOW)
- Photo capture optimization: compress before upload on mobile (reduce 3G time)
- Mobile map performance: clustering MORE critical on mobile than desktop
- Responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)
- **Mobile-Specific Considerations:**
  - Service Worker for offline support (Phase 2)
  - IndexedDB for offline data storage (Phase 2)
  - Camera API integration with compression
  - GPS accuracy handling on mobile devices
- Affects: Frontend architecture, PWA strategy, component design, performance optimization

## Starter Template & Existing Project Foundation

### Project Status: Existing Next.js Project

This is **NOT a greenfield project**—ecoPulse already has an established Next.js foundation with modern tooling configured.

### Map Technology

**Interactive Map:** Leaflet with OpenStreetMap tiles (mobile gestures handled by Leaflet Touch plugin, built-in)

### Current Technology Stack (Verified)

**Framework & Runtime:**

- **Next.js 16** (latest stable, October 2025 release)
- **React 19.2** (Canary with View Transitions, useEffectEvent, Activity component)
- **TypeScript** (strict mode enabled)
- **Node.js 20.9+** (Next.js 16 minimum requirement)

**Build & Development:**

- **Turbopack** (stable, default bundler in Next.js 16)
  - 2-5× faster production builds
  - Up to 10× faster Fast Refresh in development
- **Turbopack File System Caching** (beta) - Available for large projects
- **pnpm** - Fast, disk-efficient package manager

**UI & Styling:**

- **Shadcn UI (Radix-Vega style)** - Copy-paste component system
- **Radix UI** - Accessible primitives (WCAG 2.1 AA foundation)
- **Tailwind CSS** - Utility-first styling with CSS variables for theming
- **Hugeicons** - Icon library (23,000+ icons, environmental coverage)
- **PostCSS** - CSS processing pipeline

**Configuration:**

```json
// components.json
{
  "style": "radix-vega",
  "rsc": true, // React Server Components enabled
  "tsx": true,
  "tailwind": {
    "baseColor": "neutral", // Professional gray scale
    "cssVariables": true, // Theme customization capability
    "prefix": ""
  },
  "iconLibrary": "hugeicons"
}
```

### Existing Project Structure

```
ecoPulse/
├── app/
│   ├── globals.css              # Global styles + Tailwind base
│   ├── layout.tsx               # Root layout (required in App Router)
│   └── page.tsx                 # Homepage
├── components/
│   ├── ui/                      # Shadcn UI components (owned by us)
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── combobox.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── field.tsx
│   │   ├── input-group.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   └── textarea.tsx
│   ├── component-example.tsx
│   └── example.tsx
├── lib/
│   └── utils.ts                 # Utilities (cn() for className merging)
├── public/                      # Static assets
├── components.json              # Shadcn UI configuration
├── next.config.ts               # Next.js 16 configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.mjs            # ESLint flat config (Next.js 16 default)
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies
└── pnpm-lock.yaml               # Lockfile
```

### Architectural Decisions Already Made

**1. Component Architecture: Shadcn UI Pattern**

Shadcn UI is NOT a traditional component library:

- **Copy-Paste System** - Components are copied into `/components/ui` (not npm dependencies)
- **Full Ownership** - We customize and maintain components in our codebase
- **Built on Radix UI** - Accessible primitives handle ARIA, keyboard navigation, focus management
- **Tailwind + CVA** - Styling via Tailwind CSS + `class-variance-authority` for variants
- **Tree-Shakeable** - Only bundle components we actually use

**Benefits for ecoPulse:**

- ✅ Customizable for government/NGO white-labeling (CSS variables for theming)
- ✅ WCAG 2.1 AA compliance path (Radix UI accessibility foundation)
- ✅ No runtime bundle bloat (components are tree-shakeable)
- ✅ TypeScript-first with full type safety
- ✅ Mobile-optimized (responsive by default, touch-friendly)

**2. Next.js 16 Features & Breaking Changes**

**New Features We'll Leverage:**

- **Cache Components (`"use cache"`)** - Opt-in caching for explicit performance control

  ```typescript
  'use cache';
  export async function getVerifiedIssuesForOrg(orgId: string) {
    // Cached with explicit cacheLife profile
    return await supabase.from('issues').select('*').eq('org_id', orgId).eq('status', 'verified');
  }
  ```

- **`proxy.ts` (replaces `middleware.ts`)** - Node.js runtime for request interception
  - Use for authentication middleware
  - Rate limiting for anonymous users
  - Request logging and analytics

- **Enhanced Routing** - Layout deduplication, incremental prefetching
  - 50 product links download shared layout once (not 50 times)
  - Automatic prefetch cancellation when links leave viewport
  - Re-prefetch on hover or viewport re-entry

- **React 19.2 Features:**
  - **View Transitions** - Smooth animations between routes (critical for mobile UX)
  - **useEffectEvent** - Extract non-reactive logic from Effects
  - **Activity Component** - Background activity with `display: none` while maintaining state

- **New Caching APIs:**
  - `updateTag(tag)` - Read-your-writes semantics for Server Actions (immediate UI updates)
  - `revalidateTag(tag, profile)` - Stale-while-revalidate with background revalidation
  - `refresh()` - Refresh uncached data only (doesn't touch cache)

**BREAKING CHANGES (Critical for Architecture):**

**Async Params & SearchParams:**

```typescript
// ❌ OLD (Next.js 15) - NO LONGER WORKS
export default function Page({ params, searchParams }: PageProps) {
  const { id } = params; // Sync access BREAKS
  const { filter } = searchParams; // Sync access BREAKS
}

// ✅ NEW (Next.js 16) - REQUIRED
export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params; // Async required
  const { filter } = await searchParams; // Async required
}
```

**Async Server Functions:**

```typescript
// ❌ OLD - NO LONGER WORKS
import { cookies, headers } from 'next/headers';
const cookieStore = cookies(); // Sync BREAKS
const headersList = headers(); // Sync BREAKS

// ✅ NEW (Next.js 16) - REQUIRED
import { cookies, headers } from 'next/headers';
const cookieStore = await cookies(); // Async required
const headersList = await headers(); // Async required
```

**revalidateTag() Signature Change:**

```typescript
// ❌ OLD - DEPRECATED
revalidateTag('blog-posts');

// ✅ NEW - Requires cacheLife profile
revalidateTag('blog-posts', 'max'); // Stale-while-revalidate
// or
updateTag('user-profile'); // Immediate refresh in Server Actions
```

**Parallel Routes Require default.js:**

```typescript
// All parallel route slots NOW REQUIRE explicit default.js files
// app/@modal/default.tsx
export default function Default() {
  return null; // or call notFound()
}
```

**3. Icon Library: Hugeicons**

- **23,000+ icons** (vs Lucide's 1,400) - Better environmental coverage
- Icons for: recycling symbols, drainage, waste bins, flood warnings, trees, pollution
- **Verify React 19.2 Compatibility** - Test in Sprint 0
- **Tree-Shaking Critical** - Import specific icons: `import { MapPin } from '@hugeicons/react'`

**4. Build Tooling & Performance**

- **Turbopack Stable** - Default bundler (2-5× faster builds, 10× faster HMR)
- **Opt-out if needed:** `next dev --webpack` or `next build --webpack`
- **File System Caching (beta):** Enable for large codebases:
  ```typescript
  // next.config.ts
  const nextConfig = {
    experimental: {
      turbopackFileSystemCacheForDev: true,
    },
  };
  ```

**5. Code Organization**

- `/app` - Routes, layouts, Server Components (App Router)
- `/components` - Reusable React components
- `/components/ui` - Shadcn UI components (owned, customizable)
- `/lib` - Utilities, helpers, shared functions
- `/public` - Static assets (images, fonts, manifest)

**6. Development Experience**

- **ESLint Flat Config** (Next.js 16 default) - Aligns with ESLint v10
- **TypeScript Plugin** - Advanced type-checking via VS Code
- **Hot Module Replacement** - Instant feedback with Turbopack
- **Improved Logging** - Build time breakdown, request tracing

### What Needs to Be Added (Architecture Scope)

The existing foundation is solid, but ecoPulse requires additional architectural components:

**Backend Integration:**

- Supabase client setup (`@supabase/supabase-js`, `@supabase/ssr` for Next.js)
- Environment variable configuration (`.env.local` for Supabase URL + anon key)
- Database schema and RLS policies (separate architecture decision)
- Auth configuration (Supabase Auth with `proxy.ts` middleware)

**Geospatial Features:**

- Leaflet integration (`react-leaflet`, `leaflet` packages)
- OpenStreetMap tile configuration
- Map clustering library (e.g., `react-leaflet-cluster` or `supercluster`)
- Geospatial utilities (coordinate validation, distance calculation, bounding boxes)

**File Upload & Processing:**

- Image upload component with EXIF stripping (privacy requirement)
- Supabase Storage integration
- Server-side image processing (Edge Functions, API routes, or Server Actions)
- Client-side photo compression before upload (reduce 3G upload time)

**State Management:**

- **Server State:** Supabase Realtime subscriptions for live map updates
- **Client State:** Decision needed - React Context, Zustand, or Jotai
- **Form State:** React Hook Form (recommended for complex forms with validation)
- **Cache State:** Next.js 16 Cache Components with `"use cache"` directive

**API Layer:**

- Next.js API Routes (REST) or Server Actions (mutations) - DECISION NEEDED
- tRPC consideration for type-safe API (mentioned in PRD)
- Rate limiting middleware for anonymous users (`proxy.ts`)
- Error handling and logging strategy

**Testing Infrastructure:**

- **Unit Testing:** Vitest or Jest (not yet configured)
- **E2E Testing:** Playwright (Next.js 16 recommendation)
- **Component Testing:** React Testing Library + Testing Library User Event
- **Accessibility Testing:** @axe-core/react, Lighthouse CI (WCAG 2.1 AA validation)
- **Async Component Testing:** Handle Next.js 16 async params/searchParams

**CI/CD Pipeline:**

- GitHub Actions workflows (not yet configured)
- Vercel deployment automation with preview deployments
- Automated testing, linting, type-checking
- Lighthouse CI for performance regression testing

### Architecture Risks & Mitigations

**Risk 1: Next.js 16 Bleeding Edge**

- **Risk:** Latest stable release (October 2025), less Stack Overflow content
- **Mitigation:** Document Next.js 16 patterns in architecture doc, leverage official docs, Vercel Discord community

**Risk 2: Async Breaking Changes**

- **Risk:** All params, searchParams, cookies, headers are now async
- **Mitigation:** Create coding standards document, use TypeScript strict mode, add ESLint rules for async patterns

**Risk 3: Hugeicons React 19.2 Compatibility**

- **Risk:** Icon library may not be tested with React 19.2 Canary
- **Mitigation:** Test Hugeicons with Next.js 16 RSC in Sprint 0, have Lucide Icons as fallback

**Risk 4: Cache Components Learning Curve**

- **Risk:** `"use cache"` directive is new, limited documentation and best practices
- **Mitigation:** Start with simple caching patterns, gradually adopt as team learns, leverage Vercel examples

**Risk 5: Shadcn UI Component Testing**

- **Risk:** Components in `/components/ui` are OUR code—must be tested
- **Mitigation:** Create component test suite, use React Testing Library, automate accessibility testing

### Next Steps for Architecture Decisions

This document will define:

1. **Database Schema** - PostgreSQL tables, indexes, RLS policies, geospatial types
2. **API Design** - Server Actions vs API Routes, tRPC consideration, rate limiting
3. **Authentication Flow** - Supabase Auth integration with `proxy.ts` middleware
4. **File Storage Architecture** - EXIF stripping pipeline, CDN strategy, image optimization
5. **State Management Strategy** - Server state (Supabase Realtime), client state, form state
6. **Geospatial Architecture** - Map rendering, clustering, spatial queries, performance
7. **Caching Strategy** - Next.js 16 Cache Components, cacheLife profiles, updateTag vs revalidateTag
8. **Performance Optimization** - Turbopack config, materialized views, CDN, compression
9. **Security Architecture** - RLS enforcement, input validation, CSRF protection, rate limiting
10. **Deployment Architecture** - Vercel + Supabase, environment config, monitoring
11. **Testing Strategy** - Unit, integration, E2E, accessibility, performance, async patterns

**Note:** No new project initialization required—we build on the existing Next.js 16 + Shadcn UI foundation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

1. ✅ Database Schema Approach - Supabase Migrations + Drizzle ORM
2. ✅ API Architecture - Server Actions (MVP), tRPC (Phase 2)
3. ✅ Authentication Flow - Supabase Auth + proxy.ts middleware
4. ✅ Caching Strategy - Next.js 16 Cache Components + Materialized Views
5. ✅ EXIF Stripping Pipeline - Server Action with sharp library

**Important Decisions (Shape Architecture):** 6. ✅ Client State Management - Zustand + React Hook Form 7. ✅ Rate Limiting Strategy - Supabase Anonymous Auth + Cloudflare Turnstile 8. ✅ Testing Framework - Vitest + Playwright + React Testing Library + axe-core 9. ✅ CI/CD Pipeline - GitHub Actions + Vercel

**Deferred Decisions (Post-MVP):**

- Real-Time Updates - Polling for MVP, Supabase Realtime in Phase 2
- Public API - tRPC implementation deferred to Phase 2 for 311 integration
- Advanced Caching - Start simple with Cache Components, optimize based on metrics

---

### Data Architecture

**Database Schema & ORM:**

- **Decision:** Supabase Migrations (SQL) + Drizzle ORM (optional type-safe queries)
- **Version:** Supabase latest, Drizzle ORM latest
- **Implementation:**
  - SQL migrations in `supabase/migrations/*.sql` (version-controlled)
  - RLS policies written in SQL (Supabase native)
  - Drizzle schema for type-safe queries where beneficial
  - Geospatial queries use raw SQL with PostGIS functions
- **Rationale:** RLS policies require SQL, geospatial queries need PostGIS, Drizzle adds type safety without Prisma's overhead
- **Affects:** All database tables, RLS policies, API queries, type definitions

**Caching Strategy:**

- **Decision:** Next.js 16 Cache Components + PostgreSQL Materialized Views
- **Version:** Next.js 16 (latest), PostgreSQL 15+ (Supabase)
- **Implementation:**
  - `"use cache"` directive with cacheLife profiles:
    - Static content (Action Cards, Contact Directory): `'max'` profile
    - Dynamic content (user-specific data): no caching or short TTL
  - Materialized views for dashboard KPIs (refreshed hourly via `pg_cron` extension)
  - `updateTag(tag)` for immediate updates in Server Actions (user submissions, verification)
  - `revalidateTag(tag, 'max')` for background revalidation (reports, statistics)
  - **Materialized View Refresh Pattern:**

    ```sql
    -- Enable pg_cron extension (built into Supabase)
    CREATE EXTENSION IF NOT EXISTS pg_cron;

    -- Schedule hourly refresh of dashboard KPIs
    SELECT cron.schedule(
      'refresh-dashboard-mvs',
      '0 * * * *',  -- Every hour at minute 0
      $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_org_dashboard_kpis$$
    );

    -- Add CONCURRENTLY to allow reads during refresh
    CREATE UNIQUE INDEX ON mv_org_dashboard_kpis (org_id);
    ```

  - **Data Freshness:** NGO dashboard shows "Last updated: [timestamp]" to set expectations

- **Rationale:** Meets <1s map, <2s dashboard performance requirements; stale-while-revalidate improves UX; pg_cron eliminates need for external scheduler; CONCURRENTLY allows reads during refresh
- **Affects:** All data fetching, Server Components, dashboard components, map rendering

---

### API & Communication Patterns

**API Architecture:**

- **Decision:** Server Actions (MVP), tRPC (Phase 2 public API)
- **Version:** Next.js 16 Server Actions (built-in), tRPC v11+ (Phase 2)
- **Implementation:**
  - **MVP:** All mutations via Server Actions
    - Form submissions (report, verification, proof upload)
    - User profile updates
    - Moderation actions (hide/unhide, mark duplicate)
    - CSV export generation
  - **Phase 2:** tRPC for public API
    - 311 system integration endpoints
    - API keys and rate limiting per organization
    - OpenAPI documentation generation
- **Rationale:** Server Actions simplify MVP (no API surface to secure), tRPC provides type-safe public API later
- **Affects:** Form handling, anonymous submissions, rate limiting strategy, Phase 2 integrations

**Error Handling:**

- **Decision:** Standardized error types with user-friendly messages
- **Implementation:**
  - Server Actions return `{ success: boolean, error?: string, data?: T }`
  - Supabase errors mapped to user-friendly messages
  - Client-side error boundaries for React errors
  - Sentry/Vercel Analytics for production error tracking
- **Affects:** All Server Actions, form validation, user feedback

---

### Authentication & Authorization

**Authentication Flow:**

- **Decision:** Supabase Auth + proxy.ts middleware
- **Version:** @supabase/ssr latest, @supabase/supabase-js latest
- **Implementation:**
  - Supabase Auth providers: Email/password, magic link, OAuth (Google, GitHub)
  - Anonymous sessions via Supabase (temporary user_id for spam tracking)
  - `proxy.ts` middleware checks auth status, role-based redirects
  - RLS policies enforce multi-org data isolation automatically
  - JWT tokens in HTTP-only cookies (Supabase SSR handles this)
- **Rationale:** Built-in RLS integration, anonymous user tracking, flexible auth providers
- **Affects:** User registration, login flow, protected routes, data access patterns

**Rate Limiting Strategy:**

- **Decision:** Supabase Anonymous Auth + Cloudflare Turnstile
- **Version:** Supabase Auth (latest), Cloudflare Turnstile (free tier)
- **Implementation:**
  - Anonymous users get temporary Supabase user_id (tracked in database)
  - Rate limits: 3 reports per hour per user_id (anonymous or authenticated)
  - Cloudflare Turnstile (CAPTCHA replacement) for high-risk actions:
    - Proof submission (prevents bot spam)
    - Verification submission (ensures human verification)
  - Database trigger tracks submission counts per user_id
  - Admin can adjust rate limits per organization (Phase 2)
  - **Testing Strategy:**
    - **CI/CD:** Use Turnstile test keys (`1x00000000000000000000AA` always passes, `2x00000000000000000000AB` always fails)
    - **Unit Tests:** Mock Turnstile client-side widget and server-side verification
    - **E2E Tests:** Use test keys in Playwright, verify both pass/fail scenarios
- **Rationale:** Achieve <5% spam target, user-friendly (no traditional CAPTCHA), database-enforced limits; test keys enable reliable CI/CD
- **Affects:** Report submission, proof upload, verification flow, anonymous user experience

**Authorization (RBAC):**

- **Decision:** Supabase RLS policies enforce role-based access
- **Implementation:**
  - Roles stored in `users.role` column: 'anonymous', 'authenticated', 'admin'
  - RLS policies check `auth.uid()` and `auth.jwt() ->> 'role'`
  - Organization membership in `org_members` table
  - Admin actions logged in `audit_logs` table (100% coverage)
- **Affects:** Database queries, admin dashboard, moderation queue, CSV exports

---

### Frontend State Management

**Client-Side State:**

- **Decision:** Zustand (global state) + React Hook Form (forms)
- **Version:** Zustand v5+, React Hook Form v7+
- **Implementation:**
  - **Zustand stores:**
    - Map filters (category, status, date range, organization)
    - User session state (role, org membership, points)
    - UI state (modals, sidebars, notifications)
  - **React Hook Form:**
    - Report submission form (category, location, severity, photo, note)
    - Verification form (validation, photo comparison)
    - Proof upload form (before/after photos)
    - User profile updates
    - NGO dashboard filters
  - **Server State:** Managed by Supabase queries (no React Query needed with RSC)
- **Rationale:** Zustand is lightweight (~1KB), React Hook Form handles validation efficiently, meets 60-second submission target
- **Affects:** Form validation, map filters, session management, UI state

**Real-Time Updates:**

- **Decision:** Polling (MVP), Supabase Realtime (Phase 2)
- **Version:** Supabase Realtime (Phase 2)
- **Implementation:**
  - **MVP:** Polling every 30 seconds for map updates
    - Client-side `useEffect` with `setInterval`
    - Refresh button for manual updates
    - Cache-friendly (revalidate cached data)
  - **Phase 2:** Supabase Realtime subscriptions ($50/month for 1,000 concurrent users - justified by improved UX and government "modern platform" perception)
    - Subscribe to `issues` table changes (new reports, status updates)
    - Real-time verification notifications
    - Live dashboard updates
  - **Polling Acceptability:**
    - PRD requirement: Map updates within <2 minutes (30s polling = well within threshold)
    - User's own actions update immediately via `updateTag()` (no polling delay)
    - Phase 2 can implement Supabase Realtime if A/B testing shows user preference
    - Mobile data savings: 30s polling uses less bandwidth than persistent WebSocket
- **Rationale:** Real-time not critical for MVP success criteria; polling is simpler, faster to implement, and meets PRD requirements
- **Affects:** Map component, dashboard updates, notification system (Phase 2)

---

### File Storage & Image Processing

**EXIF Stripping Pipeline:**

- **Decision:** Server Action with sharp library
- **Version:** sharp v0.33+, @supabase/storage-js latest
- **Implementation:**

  ```typescript
  // Server Action pseudo-code
  'use server';
  export async function uploadPhoto(formData: FormData) {
    const file = formData.get('photo');

    // 1. Validate file type and size
    if (!isValidImage(file)) return { error: 'Invalid image' };

    // 2. Strip EXIF metadata with sharp
    const strippedBuffer = await sharp(await file.arrayBuffer())
      .rotate() // Auto-rotate based on EXIF
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .withMetadata({ exif: false, icc: false }) // Remove ALL metadata
      .toBuffer();

    // 3. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('issue-photos')
      .upload(`${userId}/${timestamp}.jpg`, strippedBuffer);

    if (error) return { error: 'Upload failed' };
    return { success: true, url: data.path };
  }
  ```

- **Reject upload if stripping fails** (zero tolerance for GPS leaks)
- **Client-side compression:** Use browser APIs to reduce file size before upload (improve 3G performance)
- **Rationale:** Consistent with Server Actions pattern, sharp is fast and reliable, privacy-first
- **Affects:** Report submission, proof upload, photo storage, privacy compliance

**CDN Strategy:**

- **Decision:** Supabase Storage CDN (automatic)
- **Implementation:**
  - Supabase Storage uses CloudFlare CDN automatically
  - Images served via CDN URLs with automatic optimization
  - Responsive images: generate multiple sizes (thumbnail, medium, full)
- **Affects:** Image delivery, page load performance, mobile experience

---

### Testing Strategy

**Testing Framework:**

- **Decision:** Vitest + Playwright + React Testing Library + @axe-core/react
- **Version:** Vitest v2+, Playwright v1.40+, Testing Library latest, axe-core latest
- **Implementation:**
  - **Unit Tests (Vitest + React Testing Library):**
    - Server Actions (data mutations, validation)
    - React components (Shadcn UI components in `/components/ui`)
    - Utility functions (geolocation, date formatting, point calculations)
    - Async component testing (Next.js 16 async params/searchParams)
  - **E2E Tests (Playwright):**
    - Complete user journeys: report → action → proof → verification
    - Anonymous flow vs authenticated flow
    - NGO dashboard CSV export
    - Mobile viewport testing (320px, 768px, 1024px)
  - **Accessibility Tests (@axe-core/react):**
    - Automated WCAG 2.1 AA validation on all pages
    - Keyboard navigation testing
    - Screen reader compatibility
    - Color contrast validation
- **Coverage Target:** 80% unit test coverage, 100% critical path E2E coverage
- **CSV Export Validation:** Automated CI/CD tests seed 1,000 reports → export CSV → validate row count + field accuracy programmatically (PRD NFR42: <0.1% error rate for NGO donor trust)
- **Rationale:** Modern stack, Vite-native (Vitest works with Turbopack), accessibility-first, government compliance requirement
- **Affects:** Development workflow, quality gates, deployment pipeline

**CI/CD Pipeline:**

- **Decision:** GitHub Actions + Vercel
- **Version:** GitHub Actions latest, Vercel CLI latest
- **Implementation:**
  - **GitHub Actions Workflow:**
    ```yaml
    # .github/workflows/ci.yml
    - Lint: ESLint flat config
    - Type-check: TypeScript strict mode
    - Unit tests: Vitest with coverage report
    - E2E tests: Playwright on preview deployment
    - Accessibility: Lighthouse CI (score >= 95)
    - Build: next build (verify no build errors)
    ```
  - **Vercel Integration:**
    - Automatic preview deployments on PRs
    - Production deployment on `main` branch merge
    - Environment variables per environment (preview, production)
  - **Quality Gates:**
    - Block PR merge if: tests fail, lint errors, type errors, accessibility score < 95
    - Require PR reviews before merge
- **Rationale:** Automated quality gates, fast feedback loop, prevents regressions
- **Affects:** Development workflow, deployment process, code quality

---

### Decision Impact Analysis

**Implementation Sequence (Sprint 0 + Sprint 1-4):**

**Sprint 0 (Environment Setup - 1 week):**

1. Initialize Supabase project (database, auth, storage)
2. Configure environment variables (`.env.local`)
3. Set up Drizzle ORM schema and Supabase migrations
4. Configure `proxy.ts` middleware for auth
5. Set up GitHub Actions CI/CD pipeline
6. Install testing dependencies (Vitest, Playwright, axe-core)
7. Verify Hugeicons compatibility with Next.js 16 RSC

**Sprint 1 (Core Reporting + Map):**

- Server Actions for report submission (with sharp EXIF stripping)
- Zustand store for map filters
- React Hook Form for report form
- Supabase Anonymous Auth for anonymous submissions
- Cloudflare Turnstile integration
- Playwright E2E tests for report flow

**Sprint 2 (Verification + User Profiles):**

- Server Actions for verification and proof upload
- Second-person verification constraint (database)
- User profile with points (Zustand for client state)
- React Hook Form for verification flow
- E2E tests for verification journey

**Sprint 3 (NGO Dashboard):**

- Materialized views for dashboard KPIs
- Next.js 16 Cache Components with `"use cache"`
- CSV export Server Action
- React Hook Form for dashboard filters
- Performance testing (dashboard <2s target)

**Sprint 4 (Polish + API Foundation):**

- Polling for map updates (30s interval)
- Accessibility testing with axe-core
- Lighthouse CI integration
- tRPC foundation for Phase 2 (architecture only, no implementation)

**Cross-Component Dependencies:**

1. **Authentication → All Features**
   - Supabase Auth must be configured first
   - RLS policies depend on auth.uid()
   - Anonymous sessions enable spam tracking

2. **Database Schema → API Layer**
   - Supabase migrations must run before Server Actions
   - RLS policies enforce data isolation
   - Materialized views feed dashboard queries

3. **EXIF Stripping → File Upload**
   - sharp library in Server Actions
   - Blocks all photo uploads (reports, proofs, verification)
   - Privacy compliance depends on this

4. **Caching → Performance**
   - Cache Components enable <1s map, <2s dashboard
   - Materialized views require hourly refresh job
   - `updateTag()` enables instant user feedback

5. **State Management → Forms**
   - Zustand provides global filter state
   - React Hook Form handles validation
   - Both interact with Server Actions

6. **Testing → CI/CD**
   - Vitest runs in GitHub Actions
   - Playwright tests against Vercel preview
   - Lighthouse CI validates performance/accessibility

**Technology Version Summary:**

- Next.js: 16 (latest stable)
- React: 19.2 (Canary)
- Supabase: @supabase/ssr latest, @supabase/supabase-js latest
- Drizzle ORM: latest
- Zustand: v5+
- React Hook Form: v7+
- sharp: v0.33+
- Vitest: v2+
- Playwright: v1.40+
- Cloudflare Turnstile: free tier
- tRPC: v11+ (Phase 2)

## Implementation Patterns & Consistency Rules

### Purpose

These patterns ensure multiple AI agents write compatible, consistent code. Without these rules, different agents might make conflicting choices that break the application.

This section was collaboratively reviewed by the development team to identify and address potential implementation conflicts.

---

### Naming Conventions

**Database Naming (PostgreSQL/Supabase):**

- **Tables:** snake_case, plural (`users`, `issues`, `verifications`, `org_members`, `action_cards`)
- **Columns:** snake_case (`user_id`, `created_at`, `is_verified`, `lat`, `lng`)
- **Foreign Keys:** `{table}_id` format (`user_id`, `org_id`, `issue_id`, `verifier_id`)
- **Indexes:** `idx_{table}_{columns}` format (`idx_users_email`, `idx_issues_location`, `idx_issues_org_id_status`)
- **RLS Policies:** `{action}_{table}_{description}` (`select_issues_public`, `insert_issues_authenticated`, `update_issues_owner`)
- **Materialized Views:** `mv_{description}` (`mv_org_dashboard_kpis`, `mv_verified_issue_counts`)

**Code Naming (TypeScript/React):**

- **Components:** PascalCase files & exports (`UserCard.tsx`, `export function UserCard()`)
- **React Client Components:** `'use client'` directive at top, same PascalCase naming
- **Server Actions:** camelCase files in `/app/actions` (`uploadPhoto.ts`, `createReport.ts`, `verifyIssue.ts`)
- **Server Action Functions:** camelCase with descriptive verb (`createReport`, `uploadProofPhoto`, `verifyIssue`)
- **Types/Interfaces:** PascalCase (`type User`, `interface ReportFormData`, `type IssueStatus`)
- **Utilities:** camelCase files in `/lib` (`formatDate.ts`, `validateCoords.ts`, `calculatePoints.ts`)
- **Variables:** camelCase (`userId`, `reportData`, `isVerified`, `mapFilters`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`, `RATE_LIMIT_WINDOW`, `DEFAULT_MAP_ZOOM`)
- **Zod Schemas:** camelCase with 'Schema' suffix (`reportSchema`, `verificationSchema`, `userProfileSchema`)

**Route Naming (Next.js App Router):**

- **Routes:** kebab-case for multi-word routes (`/dashboard`, `/report-issue`, `/verify-report`)
- **Route Parameters:** `[id]` for dynamic segments (`/issues/[id]`, `/organizations/[orgId]`)
- **Route Groups:** Parentheses for layout grouping (`(auth)`, `(dashboard)`)

---

### Project Structure & Organization

**Directory Structure:**

```
ecoPulse/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, signup, magic-link)
│   │   └── actions.ts            # Auth-specific Server Actions
│   ├── (dashboard)/              # Dashboard pages (user, org, admin)
│   │   └── actions.ts            # Dashboard-specific Server Actions
│   ├── (public)/                 # Public pages (map, issue detail)
│   ├── actions/                  # Shared Server Actions
│   │   ├── reports.ts            # Report creation, updates
│   │   ├── verification.ts       # Verification logic
│   │   ├── uploads.ts            # Photo uploads with EXIF stripping
│   │   └── exports.ts            # CSV export generation
│   ├── api/                      # API routes (only if tRPC/REST needed)
│   ├── globals.css               # Global styles + Tailwind base
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/
│   ├── ui/                       # Shadcn UI components (owned, customizable)
│   │   └── *.tsx                 # Button, Card, Input, etc.
│   ├── features/                 # Feature-specific components
│   │   ├── map/                  # Map components (MapView, MapFilters, Clustering)
│   │   ├── reports/              # Report components (ReportForm, ReportCard, ReportDetail)
│   │   ├── verification/         # Verification components (VerifyFlow, PhotoComparison)
│   │   └── dashboard/            # Dashboard components (KPICards, ExportButton)
│   └── shared/                   # Shared UI components (Header, Footer, LoadingSpinner)
├── lib/
│   ├── supabase/                 # Supabase utilities
│   │   ├── client.ts             # Client-side Supabase client
│   │   ├── server.ts             # Server-side Supabase client
│   │   └── middleware.ts         # Auth helpers for proxy.ts
│   ├── validations/              # Zod schemas
│   │   ├── report.ts             # Report validation
│   │   ├── verification.ts       # Verification validation
│   │   └── user.ts               # User profile validation
│   ├── analytics.ts              # Analytics tracking utilities
│   ├── features.ts               # Feature flags
│   └── utils.ts                  # General utilities (cn, formatDate, etc.)
├── stores/                       # Zustand stores
│   ├── mapStore.ts               # Map filters, bounds, selected issue
│   ├── userStore.ts              # User session, role, points
│   └── uiStore.ts                # Modals, sidebars, notifications
├── types/                        # Shared TypeScript types
│   ├── database.ts               # Supabase database types (auto-generated)
│   ├── api.ts                    # Server Action response types
│   └── index.ts                  # Exported types
├── hooks/                        # Custom React hooks
│   ├── useUser.ts                # User session hook
│   ├── useMap.ts                 # Map interaction hook
│   └── useDebounce.ts            # Utility hooks
├── tests/
│   ├── unit/                     # Vitest unit tests
│   │   ├── actions/              # Server Actions tests
│   │   ├── components/           # Component tests
│   │   └── lib/                  # Utility tests
│   ├── e2e/                      # Playwright E2E tests
│   │   ├── report-flow.spec.ts  # Report submission journey
│   │   └── verification-flow.spec.ts
│   ├── fixtures/                 # Test data and mocks
│   ├── mocks/                    # Mock implementations (Supabase, etc.)
│   └── setup.ts                  # Test environment setup
├── supabase/
│   ├── migrations/               # SQL migrations (timestamped)
│   ├── seed.sql                  # Seed data for development
│   └── config.toml               # Supabase local config
├── public/                       # Static assets
│   ├── icons/                    # App icons, favicons
│   └── images/                   # Static images
├── proxy.ts                      # Next.js 16 request interception
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── drizzle.config.ts             # Drizzle ORM configuration (if used)
└── vitest.config.ts              # Vitest configuration
```

**File Collocation Rules:**

- **Tests:** Co-located with source files (`ReportForm.test.tsx` next to `ReportForm.tsx`)
- **Types:** Define in same file if only used there, export to `/types` if shared
- **Styles:** Use Tailwind classes, no separate CSS files except `globals.css`
- **Server Actions:** Group by domain in `/app/actions`, co-locate with routes if route-specific

---

### Internationalization (i18n) Architecture

**Strategic Context (Africa-First Design):**

EcoPulse targets **Sub-Saharan African markets** (Nigeria, Kenya, Ghana) where multilingual support is critical for long-term success. However, MVP launches **English-only** to validate core platform value before investing in translation infrastructure.

**MVP Approach (Sprint 1-4): i18n Framework + English Only**

- Set up Next.js internationalization framework from **Day 1** (Sprint 1)
- All UI strings use translation keys instead of hardcoded English text
- English translation files only in MVP
- **Zero system rebuild** needed when adding languages in Phase 2

**Phase 2+ Expansion: African Languages**

- Hausa, Yoruba, Igbo (Nigeria - 60% of population)
- Swahili (Kenya, Tanzania, Uganda)
- Amharic (Ethiopia)
- French (Francophone West Africa)

**Why i18n Framework Now:**

- Refactoring 50+ components to support translations later = 3-4 weeks dev work + high regression risk
- Building with translation keys from Sprint 1 = 1-2 days setup, zero technical debt
- Enables rapid geographic expansion (add language in 1 week vs. 1 month)

---

#### Next.js i18n Library Selection

**Chosen: `next-intl` v3.x (Official Next.js team recommendation, App Router native)**

**Rationale:**

- ✅ Official Next.js team recommendation for App Router + Server Components
- ✅ Lightweight (~2.5KB gzipped vs. 15KB for next-i18next)
- ✅ Built specifically for Next.js App Router (not an adapter)
- ✅ First-class Server Components support (no experimental flags)
- ✅ Strong TypeScript support with typed translation keys
- ✅ Server-side rendering optimization (zero client-side FOUC)
- ✅ Automatic locale detection from headers, cookies, URL
- ✅ ICU MessageFormat support for plurals and rich formatting
- ✅ Namespaces, nested translations, date/number formatting

**Trade-offs:**

- ✅ Smaller bundle size = better performance (especially on 3G mobile)
- ✅ Simpler API designed for Next.js specifically
- ✅ Better alignment with Next.js roadmap (official recommendation)

**Installation:**

```bash
npm install next-intl@^3.0.0
```

---

#### Directory Structure for i18n

```
├── messages/                     # Translation files (next-intl convention)
│   ├── en.json                   # English translations (nested namespaces)
│   ├── ha.json                   # Hausa (Phase 2)
│   ├── yo.json                   # Yoruba (Phase 2)
│   ├── ig.json                   # Igbo (Phase 2)
│   └── sw.json                   # Swahili (Phase 2)
├── public/
├── app/
│   ├── [locale]/                 # Locale-specific routes
│   │   ├── layout.tsx            # Locale layout
│   │   ├── page.tsx              # Homepage
│   │   ├── map/                  # Map page
│   │   └── ...                   # Other routes
├── lib/
│   └── i18n/
│       └── settings.ts           # i18n configuration (locales, namespaces)
└── next-i18next.config.js        # next-i18next configuration
```

---

#### Configuration Files

**1. `next.config.ts` - i18n Routing Configuration**

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Other Next.js config...
};

export default withNextIntl(nextConfig);
```

**2. `i18n.ts` - next-intl Configuration**

```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

````

**2. `lib/i18n/settings.ts` - TypeScript Constants**

```typescript
export const fallbackLng = 'en';
export const languages = ['en'] as const; // MVP: English only
// Phase 2: ['en', 'ha', 'yo', 'ig', 'sw']

export const defaultNS = 'common';
export const namespaces = ['common', 'report', 'verification', 'dashboard', 'errors'] as const;

export type Locale = (typeof languages)[number];
export type Namespace = (typeof namespaces)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  // Phase 2:
  // ha: 'Hausa',
  // yo: 'Yorùbá',
  // ig: 'Igbo',
  // sw: 'Kiswahili',
};
````

**3. `messages/en.json` - English Translations (MVP, Nested Namespaces)**

```json
{
  "common": {
    "submit": "Submit",
    "cancel": "Cancel",
    "loading": "Loading...",
    "error": "An error occurred. Please try again."
  },
  "report": {
    "title": "Report an Issue",
    "category": {
      "label": "Category",
      "waste": "Waste & Litter",
      "drainage": "Drainage / Flood Risk"
    },
  "severity": {
    "label": "Severity",
    "low": "Low",
    "medium": "Medium",
    "high": "High"
  },
  "photo": {
    "label": "Upload Photo",
    "required": "Photo is required to submit report"
  },
  "note": {
    "label": "Description",
    "placeholder": "Describe the issue (minimum 10 characters)"
  },
  "submit": {
    "button": "Submit Report",
    "success": "Report submitted successfully!",
    "error": "Failed to submit report. Please try again."
  }
}
```

**`public/locales/en/dashboard.json`:**

```json
{
  "title": "NGO Dashboard",
  "issuesAddressed": "Issues Addressed",
  "volunteerHours": "Volunteer Hours",
  "resolutionRate": "Resolution Rate",
  "export": "Export Funder Report"
}
```

**`public/locales/en/errors.json`:**

```json
{
  "invalidLocation": "Please provide a valid location",
  "photoTooLarge": "Photo must be less than 10MB",
  "noteTooShort": "Description must be at least 10 characters",
  "unauthorized": "You must be logged in to perform this action"
}
```

**Structure Convention:**

- Separate JSON files per namespace (`common.json`, `report.json`, `dashboard.json`, `errors.json`)
- Nested keys within each namespace file
- Use dot notation in code: `t('category.waste')` (namespace inferred from hook)

---

#### Usage Patterns

**Server Components (Default in Next.js 16):**

```typescript
// app/[locale]/map/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function MapPage() {
  const t = await getTranslations('common');

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('submit')}</button>
    </div>
  );
}

// Enable SSR translations
export async function generateStaticParams() {
  return [{ locale: 'en' }]; // MVP: English only
}
```

**Client Components:**

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function ReportForm() {
  const t = useTranslations('report');

  return (
    <form>
      <label>{t('category.label')}</label>
      <select>
        <option value="waste">{t('category.waste')}</option>
        <option value="drainage">{t('category.drainage')}</option>
      </select>
      <button type="submit">{t('submit.button')}</button>
    </form>
  );
}
```

**Server Actions (Translation in Error Messages):**

```typescript
'use server';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

export async function createReport(formData: FormData) {
  // Initialize i18next instance for server-side translations
  const i18n = createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      lng: 'en', // Get from headers in production
      ns: ['errors', 'common'],
      defaultNS: 'common',
      resources: {
        en: {
          errors: await import('@/public/locales/en/errors.json'),
          common: await import('@/public/locales/en/common.json'),
        },
      },
    });

  try {
    // Validation and processing
    if (!isValidLocation(lat, lng)) {
      return { success: false, error: i18n.t('invalidLocation', { ns: 'errors' }) };
    }

    // Success
    const report = await supabase.from('issues').insert({...});
    return { success: true, data: report };
  } catch (error) {
    return { success: false, error: i18n.t('error', { ns: 'common' }) };
  }
}

```

**Dynamic Text with Variables (Interpolation):**

```json
{
  "pointsEarned": "You earned {{points}} points for reporting this issue!"
}
```

```typescript
const { t } = useTranslation('report');
t('pointsEarned', { points: 5 });
// Output: "You earned 5 points for reporting this issue!"
```

---

#### Locale Detection & Routing

**Middleware Configuration (`middleware.ts`):**

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en';

  // Locale already in URL
  if (req.nextUrl.pathname.startsWith(`/${locale}`)) {
    return NextResponse.next();
  }

  // Redirect to locale-prefixed URL
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${req.nextUrl.pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Match all routes except API, static files, images
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/'],
};
```

**Note:** next-i18next v15+ with App Router uses Next.js built-in i18n routing. Configure in `next.config.ts`:

```typescript
// next.config.ts
import nextI18nextConfig from './next-i18next.config.js';

const nextConfig = {
  i18n: nextI18nextConfig.i18n,
  // ... other config
};

export default nextConfig;
```

**URL Structure:**

- **MVP:** `/en/map`, `/en/report`, `/en/dashboard`
- **Phase 2:** `/ha/map` (Hausa), `/yo/map` (Yoruba), `/sw/map` (Swahili)

**Locale Switching Component (Phase 2):**

```typescript
'use client';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { languages, localeNames } from '@/lib/i18n/settings';

export function LocaleSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  const switchLocale = async (newLocale: string) => {
    await i18n.changeLanguage(newLocale);

    // Replace locale in pathname (e.g., /en/map → /ha/map)
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <select value={currentLocale} onChange={(e) => switchLocale(e.target.value)}>
      {languages.map((locale) => (
        <option key={locale} value={locale}>
          {localeNames[locale]}
        </option>
      ))}
    </select>
  );
}
}
```

---

#### Date, Time, Number Formatting

**i18next with Intl API integration:**

```typescript
import { useTranslation } from 'next-i18next';

export function IssueCard({ createdAt, resolutionCount }: Props) {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <div>
      {/* Date formatting (adapts to locale) */}
      <p>Reported: {new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(createdAt))}</p>

      {/* Number formatting (e.g., 1,234 in English, 1 234 in French) */}
      <p>Resolutions: {new Intl.NumberFormat(locale).format(resolutionCount)}</p>

      {/* Relative time with i18next plugin (optional) */}
      <p>{formatDistanceToNow(new Date(createdAt), { locale: getDateFnsLocale(locale) })}</p>
    </div>
  );
}
```

**Recommended: date-fns for relative time:**

```bash
npm install date-fns
```

```typescript
import { formatDistanceToNow } from 'date-fns';
import { enUS, ha } from 'date-fns/locale';

const dateFnsLocales = { en: enUS, ha: ha };
const getDateFnsLocale = (locale: string) => dateFnsLocales[locale] || enUS;
```

    <div>
      {/* Date formatting (adapts to locale) */}
      <p>Reported: {format.dateTime(new Date(createdAt), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</p>

      {/* Number formatting (e.g., 1,234 in English, 1 234 in French) */}
      <p>Resolutions: {format.number(resolutionCount)}</p>

      {/* Relative time (e.g., "2 days ago") */}
      <p>{format.relativeTime(new Date(createdAt))}</p>
    </div>

);
}

````

---

#### TypeScript Type Safety

**Enable TypeScript checking for translation keys:**

```typescript
// types/i18next.d.ts
import 'react-i18next';
import type common from '../public/locales/en/common.json';
import type report from '../public/locales/en/report.json';
import type dashboard from '../public/locales/en/dashboard.json';
import type errors from '../public/locales/en/errors.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      report: typeof report;
      dashboard: typeof dashboard;
      errors: typeof errors;
    };
  }
}
````

**Result:** TypeScript autocomplete + compile-time error if translation key doesn't exist:

```typescript
const { t } = useTranslation('report');
t('category.waste'); // ✅ Valid key
t('invalid.key'); // ❌ TypeScript error: Key doesn't exist
```

---

#### Migration Path to Phase 2

**Adding Hausa Language Support (Example):**

1. **Create translation files:** `public/locales/ha/`
   - Copy entire `public/locales/en/` directory structure
   - Translate all JSON values to Hausa (`common.json`, `report.json`, etc.)
   - Professional translator recommended (~$500 for 5,000 words)

2. **Update i18n config:**

   ```javascript
   // next-i18next.config.js
   module.exports = {
     i18n: {
       defaultLocale: 'en',
       locales: ['en', 'ha'], // Add 'ha'
     },
     // ... rest of config
   };
   ```

3. **Update TypeScript types:**

   ```typescript
   // lib/i18n/settings.ts
   export const languages = ['en', 'ha'] as const; // Add 'ha'

   export const localeNames: Record<Locale, string> = {
     en: 'English',
     ha: 'Hausa', // Add language name
   };
   ```

4. **Test new locale:**
   - Navigate to `/ha/map` → Hausa UI
   - Verify all strings translated (no English fallbacks)

5. **Deploy:**
   - Zero code changes needed (framework handles routing)
   - Vercel automatically builds all locale variants

**Effort:** ~1 week per language (translation + QA), not 1 month of refactoring.

---

#### Future Roadmap (Phase 2+)

**Phase 2 (Months 6-12): Nigerian Languages**

- Hausa (60M speakers, Northern Nigeria, Kano)
- Yoruba (45M speakers, Southwestern Nigeria, Lagos, Ibadan)
- Igbo (30M speakers, Southeastern Nigeria, Enugu, Onitsha)
- **Cost:** ~$500/language professional translation, 2 weeks QA per language

**Phase 2 (Months 9-12): East African Languages**

- Swahili (200M speakers, Kenya, Tanzania, Uganda, DRC)
- **Strategic Value:** Largest African language by speaker count, enables Kenya/Tanzania expansion

**Phase 3 (Months 12-18): Additional Languages**

- Amharic (Ethiopia, 50M speakers)
- French (Francophone West Africa: Senegal, Côte d'Ivoire, Cameroon)
- Arabic (North Africa: Egypt, Sudan, Morocco)

**Phase 3+ (18-24 months): Low-Literacy Enhancements**

- Audio translations (text-to-speech for all UI strings)
- Icon-driven UI with minimal text dependency
- Voice note transcription with automatic language detection
- See "Africa-Specific Future Roadmap" section in PRD for details

**Future Audio Support:**

- Integrate Google Cloud Text-to-Speech API
- Pre-generate audio files for common UI strings (cache in CDN)
- Button to "hear" any translation (accessibility + low-literacy)
- Cost: ~$4/million characters = <$20/month for all UI strings

---

#### Development Guidelines

**1. Always Use Translation Keys (Never Hardcode Text):**

```typescript
// ❌ BAD - Hardcoded English
<button>Submit Report</button>

// ✅ GOOD - Translation key
const { t } = useTranslation('report');
<button>{t('submit.button')}</button>
```

**2. Keep Keys Descriptive and Namespaced:**

```typescript
// ❌ BAD - Generic, unclear namespace
t('button1');

// ✅ GOOD - Descriptive, clear context
const { t } = useTranslation('report');
t('category.waste');
```

**3. Extract Reusable Translations to `common` Namespace:**

```json
// public/locales/en/common.json
{
  "submit": "Submit",
  "cancel": "Cancel",
  "loading": "Loading...",
  "error": "An error occurred"
}
```

**4. Test with Long Translations (German/French are 30% longer than English):**

```css
/* Ensure buttons don't break with longer text */
button {
  padding: 0.5rem 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**5. Use Interpolation for Dynamic Values:**

```json
{
  "verificationCount": "{{count}} verification",
  "verificationCount_plural": "{{count}} verifications"
}
```

```typescript
const { t } = useTranslation('report');
t('verificationCount', { count: 5 });
// Output: "5 verifications"
```

**Note:** next-i18next automatically handles pluralization with `_plural` suffix.

---

### API & Response Formats

**Server Action Response Format:**

All Server Actions MUST return this standardized format:

```typescript
// Success response
type SuccessResponse<T> = { success: true; data: T };

// Error response
type ErrorResponse = { success: false; error: string };

// Union type
type ActionResponse<T> = SuccessResponse<T> | ErrorResponse;
```

**Example Implementation:**

```typescript
'use server';
export async function createReport(formData: FormData): Promise<ActionResponse<Report>> {
  try {
    // Validation, processing, database insert
    const report = await supabase.from('issues').insert({...}).single();
    return { success: true, data: report };
  } catch (error) {
    return { success: false, error: 'Failed to create report. Please try again.' };
  }
}
```

**Note:** Loading states are handled by React Hook Form's `useFormStatus()` hook automatically.

**Date/Time Formats:**

- **Database Storage:** `timestamptz` (PostgreSQL timezone-aware timestamps)
- **Server Actions Return:** ISO 8601 strings (`2025-12-17T10:30:00Z`)
- **Display to Users:** Format using `date-fns` or `Intl.DateTimeFormat` based on user's timezone
- **API Inputs:** Accept ISO 8601 strings, validate with Zod

**JSON Field Naming:**

- **Database → TypeScript:** Transform snake_case to camelCase
  ```typescript
  // Database: { user_id: 1, created_at: '...' }
  // TypeScript: { userId: 1, createdAt: '...' }
  ```
- **Use Drizzle ORM camelCase mapping** or manual transformation helpers
- **Keep snake_case in raw SQL queries** for clarity

**Boolean Representations:**

- **Database:** PostgreSQL `boolean` type
- **TypeScript:** `true` / `false`
- **Never use:** `1` / `0` or `'true'` / `'false'` strings

---

### Error Handling & Validation

**Error Handling Pattern:**

```typescript
// 1. User-friendly error messages (no technical details)
if (!isValidLocation(lat, lng)) {
  return { success: false, error: 'Please provide a valid location within the service area.' };
}

// 2. Map Supabase errors to user-friendly messages
if (error?.code === '23505') {
  // Unique constraint violation
  return { success: false, error: 'This report already exists. Please check the map.' };
}

if (error?.code === '23503') {
  // Foreign key violation
  return { success: false, error: 'Invalid reference. Please try again.' };
}

// 3. Generic fallback for unexpected errors
return { success: false, error: 'Something went wrong. Please try again or contact support.' };
```

**Validation Strategy (Defense in Depth):**

1. **Client-Side (React Hook Form + Zod):**
   - Instant feedback for users
   - Validates before submission
   - Shows field-level errors

2. **Server-Side (Zod in Server Actions):**
   - Security layer (never trust client)
   - Same Zod schemas as client
   - Returns validation errors in standard format

3. **Database (PostgreSQL Constraints):**
   - Final safety net
   - NOT NULL, CHECK constraints, foreign keys
   - Prevents data corruption

**Zod Schema Pattern:**

```typescript
// lib/validations/report.ts
import { z } from 'zod';

export const reportSchema = z.object({
  category: z.enum(['waste_litter', 'drainage'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  severity: z.enum(['low', 'medium', 'high']),
  note: z.string().min(10, 'Please provide at least 10 characters').max(500),
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Photo must be less than 10MB'),
});

export type ReportFormData = z.infer<typeof reportSchema>;
```

**Business Rule Validation Pattern:**

For complex business rules (e.g., second-person verification), use Zod's `refine` or `superRefine`:

```typescript
// lib/validations/verification.ts
export const verificationSchema = z
  .object({
    issue_id: z.string().uuid(),
    verifier_id: z.string().uuid(),
    proof_photo_url: z.string().url(),
  })
  .refine(
    async (data) => {
      // Business rule: verifier cannot be the submitter
      const { data: issue } = await supabase
        .from('issues')
        .select('user_id')
        .eq('id', data.issue_id)
        .single();

      return issue?.user_id !== data.verifier_id;
    },
    { message: 'You cannot verify your own submission' }
  );
```

**Rate Limiting Business Rules:**

- **Anonymous users:** 3 reports per hour (enforced by database trigger)
- **Authenticated users:** 10 reports per hour
- **Admin users:** No limit

---

### Testing Patterns

**Test File Naming:**

- **Unit Tests:** `{filename}.test.ts` or `{filename}.test.tsx`
- **E2E Tests:** `{feature}-flow.spec.ts` (e.g., `report-flow.spec.ts`)
- **Fixtures:** `{domain}.fixture.ts` (e.g., `users.fixture.ts`, `reports.fixture.ts`)

**Database State Management in Tests:**

```typescript
// tests/setup.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_TEST_URL!, process.env.SUPABASE_TEST_ANON_KEY!);

beforeEach(async () => {
  // Reset database to known state
  await supabase.from('verifications').delete().neq('id', '');
  await supabase.from('issues').delete().neq('id', '');
  await supabase.from('users').delete().neq('id', '');

  // Seed test data
  await seedTestData();
});

async function seedTestData() {
  // Insert predictable test data
  await supabase.from('users').insert([
    { id: 'test-user-1', email: 'user1@test.com' },
    { id: 'test-user-2', email: 'user2@test.com' },
  ]);
}
```

**Supabase Mocking Pattern:**

```typescript
// tests/mocks/supabase.ts
export const mockSupabase = {
  from: (table: string) => ({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    }),
    insert: vi.fn().mockResolvedValue({
      data: { id: 'mock-id' },
      error: null,
    }),
  }),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-1' } },
      error: null,
    }),
  },
};
```

**Test Organization:**

```typescript
// components/features/reports/ReportForm.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReportForm } from './ReportForm';

expect.extend(toHaveNoViolations);

describe('ReportForm', () => {
  describe('Validation', () => {
    it('shows error when note is too short', async () => {
      render(<ReportForm />);
      const noteInput = screen.getByLabelText(/note/i);
      await userEvent.type(noteInput, 'short');
      await userEvent.tab(); // Trigger blur validation

      expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    });
  });

  describe('Submission', () => {
    it('calls Server Action with correct data', async () => {
      const mockAction = vi.fn().mockResolvedValue({ success: true });
      render(<ReportForm action={mockAction} />);

      // Fill form...
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(mockAction).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<ReportForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

**Async Component Testing (Next.js 16):**

```typescript
// app/issues/[id]/page.test.tsx
test('renders issue detail page', async () => {
  const PageComponent = await Page({
    params: Promise.resolve({ id: '123' }),
    searchParams: Promise.resolve({}),
  });
  render(PageComponent);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});
```

**RLS Policy Testing:**

```typescript
// tests/unit/rls/issues-policies.test.ts
describe('Issues RLS Policies', () => {
  it('allows user to read their own org issues', async () => {
    // Login as user1 (org A)
    await supabase.auth.signInWithPassword({
      email: 'user1@test.com',
      password: 'test123',
    });

    const { data } = await supabase.from('issues').select('*').eq('org_id', 'org-a');

    expect(data).toHaveLength(3); // Should see org A issues
  });

  it('prevents user from accessing other org issues', async () => {
    // Login as user1 (org A)
    await supabase.auth.signInWithPassword({
      email: 'user1@test.com',
      password: 'test123',
    });

    const { data } = await supabase.from('issues').select('*').eq('org_id', 'org-b'); // Try to access org B

    expect(data).toHaveLength(0); // RLS should filter out
  });
});
```

**Rate Limiting Testing:**

```typescript
// tests/unit/rate-limiting.test.ts
describe('Rate Limiting', () => {
  it('blocks 4th anonymous report within 1 hour', async () => {
    const testData = {
      category: 'waste_litter',
      latitude: 37.7749,
      longitude: -122.4194,
      severity: 'medium',
      note: 'Test report for rate limiting',
    };

    // Submit 3 reports (should succeed)
    for (let i = 0; i < 3; i++) {
      const result = await createReport(testData);
      expect(result.success).toBe(true);
    }

    // 4th should fail
    const result = await createReport(testData);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Rate limit');
  });

  it('allows authenticated users higher limit', async () => {
    await supabase.auth.signInWithPassword({
      email: 'user1@test.com',
      password: 'test123',
    });

    // Authenticated users can submit 10 per hour
    for (let i = 0; i < 10; i++) {
      const result = await createReport(testData);
      expect(result.success).toBe(true);
    }
  });
});
```

---

### UX Consistency Patterns

**Loading State Pattern:**

```typescript
import { useFormStatus } from 'react-dom';
import { Loader2 } from '@hugeicons/react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="min-h-[44px] min-w-[44px]" // Accessibility: 44x44px touch target
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Report'
      )}
    </Button>
  );
}
```

**Error Display Pattern:**

```typescript
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from '@hugeicons/react';

// Consistent error display
{!result.success && (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{result.error}</AlertDescription>
  </Alert>
)}
```

**Success Feedback Patterns:**

```typescript
import { toast } from 'sonner'; // or your toast library

// Pattern 1: Toast notification (non-blocking, preferred for quick actions)
toast.success('Report submitted successfully!', {
  description: 'Your report is now visible on the map.',
  duration: 5000,
});

// Pattern 2: Redirect with success message (for major actions)
redirect('/reports?success=Report+created');

// Pattern 3: In-place confirmation (for forms staying on same page)
<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your report has been submitted and is now visible on the map.
  </AlertDescription>
</Alert>
```

**Mobile Touch Target Enforcement:**

All interactive elements MUST meet 44x44px minimum:

```typescript
// Button component
<Button className="min-h-[44px] min-w-[44px]">
  Submit
</Button>

// Icon buttons
<button className="p-3 min-h-[44px] min-w-[44px]" aria-label="Close">
  <X className="h-4 w-4" />
</button>

// Links
<a href="/reports" className="inline-flex items-center justify-center min-h-[44px] px-4">
  View Reports
</a>
```

**Upload Progress Pattern (3G Mobile):**

```typescript
// Client-side compression + progress
async function uploadWithProgress(
  file: File,
  onProgress: (percent: number) => void
) {
  // 1. Compress client-side first
  onProgress(10);
  const compressed = await compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85
  });
  onProgress(30);

  // 2. Call Server Action
  onProgress(50);
  const result = await uploadPhoto(compressed);
  onProgress(100);

  return result;
}

// Usage in component
const [uploadProgress, setUploadProgress] = useState(0);

<ProgressBar value={uploadProgress} />
```

---

### Feature Flags & Product Tracking

**Feature Flag Pattern:**

```typescript
// lib/features.ts
export const features = {
  // MVP features (enabled)
  anonymousReporting: true,
  verification: true,
  nGoDashboard: true,

  // Phase 2 features (disabled in MVP)
  realTimeUpdates: process.env.NEXT_PUBLIC_FEATURE_REALTIME === 'true',
  tRPCPublicAPI: process.env.NEXT_PUBLIC_FEATURE_PUBLIC_API === 'true',

  // Phase 3 features (future)
  advancedAnalytics: false,
  aiDuplicateDetection: false,
} as const;

// Usage in components
import { features } from '@/lib/features';

export function MapView() {
  return (
    <div>
      {features.realTimeUpdates && <LiveMapUpdates />}
      {!features.realTimeUpdates && <PollingMapUpdates />}
    </div>
  );
}
```

**Analytics Event Tracking Pattern:**

```typescript
// lib/analytics.ts
type AnalyticsEvent =
  | 'report_submitted'
  | 'verification_completed'
  | 'csv_exported'
  | 'user_registered'
  | 'proof_uploaded';

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, any>) {
  // Vercel Analytics or PostHog
  if (typeof window !== 'undefined') {
    window.va?.track(event, {
      timestamp: new Date().toISOString(),
      ...properties,
    });
  }
}

// Consistent usage
trackEvent('report_submitted', {
  category: 'waste_litter',
  severity: 'high',
  has_photo: true,
});

trackEvent('verification_completed', {
  issue_id: '123',
  verifier_type: 'authenticated',
});

trackEvent('csv_exported', {
  org_id: 'abc',
  row_count: 247,
  date_range_days: 30,
});
```

**Metric Tracking Pattern (KPIs from PRD):**

```typescript
// lib/metrics.ts
type Metric = 'report_submission_duration_ms' | 'verification_rate' | 'dashboard_load_time_ms';

export function trackMetric(metric: Metric, value: number, tags?: Record<string, string>) {
  // Send to monitoring service
  console.log(`[METRIC] ${metric}:`, value, tags);

  // Example: Track in Vercel Analytics
  if (typeof window !== 'undefined') {
    window.va?.track(`metric:${metric}`, { value, ...tags });
  }
}

// Usage: Track report submission time (PRD target: <60s)
const startTime = Date.now();
const result = await createReport(data);
const duration = Date.now() - startTime;

trackMetric('report_submission_duration_ms', duration, {
  success: result.success.toString(),
  category: data.category,
});

// Usage: Track dashboard load time (PRD target: <2s)
const loadStart = performance.now();
const dashboardData = await getDashboardKPIs(orgId);
const loadTime = performance.now() - loadStart;

trackMetric('dashboard_load_time_ms', loadTime, {
  org_id: orgId,
  kpi_count: dashboardData.length.toString(),
});
```

---

### Code Style & Formatting

**TypeScript Strict Mode:**

- `strict: true` in tsconfig.json
- No `any` types (use `unknown` if truly unknown)
- Explicit return types for exported functions

**Import Organization:**

```typescript
// 1. React/Next.js imports
import { useState } from 'react';
import { redirect } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { format } from 'date-fns';

// 3. Internal imports (absolute paths via @/)
import { Button } from '@/components/ui/button';
import { createReport } from '@/app/actions/reports';
import type { Report } from '@/types';

// 4. Relative imports (same directory)
import { ReportCard } from './ReportCard';
```

**Component Structure:**

```typescript
'use client'; // Only if needed

import { ... }; // Imports

type Props = {  // Props type
  userId: string;
  onSubmit: () => void;
};

export function ComponentName({ userId, onSubmit }: Props) {
  // 1. Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState();

  // 2. Derived values
  const computedValue = useMemo(() => ..., [deps]);

  // 3. Event handlers
  const handleClick = () => { ... };

  // 4. Effects
  useEffect(() => { ... }, [deps]);

  // 5. Render
  return (
    <div>...</div>
  );
}
```

**Comments (Only When Needed):**

```typescript
// ✅ GOOD: Explain WHY, not WHAT
// Use composite index because RLS policies filter by org_id first
CREATE INDEX idx_issues_org_id_status ON issues(org_id, status);

// ❌ BAD: Redundant comment
// Create an index on issues table
CREATE INDEX idx_issues_org_id_status ON issues(org_id, status);

// ✅ GOOD: Document complex business logic
// Anonymous users can submit 3 reports per hour to prevent spam
// while allowing legitimate community participation (PRD requirement)
if (submissionCount >= 3) {
  return { success: false, error: 'Rate limit exceeded' };
}
```

---

### Security Patterns

**Input Sanitization:**

- **Never trust client input** - validate in Server Actions
- **Use Zod schemas** for type checking and validation
- **Sanitize SQL inputs** - use parameterized queries (Supabase handles this)
- **Strip EXIF metadata** from all uploaded photos (privacy requirement)

**Authentication Checks in Server Actions:**

```typescript
'use server';
import { createServerClient } from '@/lib/supabase/server';

export async function deleteReport(id: string) {
  // 1. Get authenticated user
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // 2. Check authentication
  if (authError || !user) {
    return { success: false, error: 'You must be logged in to delete reports' };
  }

  // 3. Check authorization (RLS handles this, but explicit check for clarity)
  const { data: report } = await supabase.from('issues').select('user_id').eq('id', id).single();

  if (!report) {
    return { success: false, error: 'Report not found' };
  }

  if (report.user_id !== user.id) {
    return { success: false, error: 'You can only delete your own reports' };
  }

  // 4. Perform action (RLS enforces as backup)
  const { error: deleteError } = await supabase.from('issues').delete().eq('id', id);

  if (deleteError) {
    return { success: false, error: 'Failed to delete report' };
  }

  return { success: true, data: null };
}
```

**Environment Variables Validation:**

```typescript
// lib/env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'TURNSTILE_SECRET_KEY',
] as const;

// Validate at startup
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Export typed environment
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY!,
} as const;
```

---

### Performance Patterns

**Next.js 16 Cache Components:**

```typescript
'use cache';
export async function getActionCards() {
  // Static content - cache with 'max' profile
  const { data } = await supabase.from('action_cards').select('*');
  return data;
}

// No cache for user-specific data
export async function getUserReports(userId: string) {
  const { data } = await supabase.from('issues').select('*').eq('user_id', userId);
  return data;
}

// Update cache immediately in Server Actions
('use server');
import { updateTag } from 'next/cache';

export async function createReport(data: ReportFormData) {
  const result = await supabase.from('issues').insert(data);

  // Immediately update map cache
  updateTag('map-issues');

  return { success: true, data: result };
}
```

**Image Optimization with sharp:**

```typescript
// app/actions/uploads.ts
'use server';
import sharp from 'sharp';

export async function uploadPhoto(formData: FormData) {
  const file = formData.get('photo') as File;

  // Validate file
  if (!file || file.size > 10 * 1024 * 1024) {
    return { success: false, error: 'File must be less than 10MB' };
  }

  try {
    // Process with sharp: resize, compress, strip EXIF
    const buffer = await file.arrayBuffer();
    const optimized = await sharp(Buffer.from(buffer))
      .rotate() // Auto-rotate based on EXIF orientation
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .withMetadata({ exif: false, icc: false }) // Strip ALL metadata
      .toBuffer();

    // Upload to Supabase Storage
    const user = await getUser();
    const filename = `${user.id}/${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('issue-photos')
      .upload(filename, optimized, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL (CDN)
    const { data: urlData } = supabase.storage.from('issue-photos').getPublicUrl(data.path);

    return { success: true, data: { url: urlData.publicUrl } };
  } catch (error) {
    console.error('Photo upload error:', error);
    return { success: false, error: 'Failed to upload photo. Please try again.' };
  }
}
```

**Database Query Optimization:**

```typescript
// ✅ GOOD: Select only needed columns
const { data } = await supabase
  .from('issues')
  .select('id, title, status, created_at, lat, lng')
  .eq('org_id', orgId)
  .order('created_at', { ascending: false })
  .limit(100);

// ❌ BAD: Select all columns when not needed
const { data } = await supabase.from('issues').select('*');

// ✅ GOOD: Use indexes for geospatial queries
const { data } = await supabase.rpc('get_nearby_issues', {
  p_lat: latitude,
  p_lng: longitude,
  p_radius_meters: 5000,
});

// Database function with GiST index:
// CREATE OR REPLACE FUNCTION get_nearby_issues(p_lat float, p_lng float, p_radius_meters int)
// RETURNS TABLE (...)
// AS $$
//   SELECT * FROM issues
//   WHERE ST_DWithin(
//     ST_MakePoint(lng, lat)::geography,
//     ST_MakePoint(p_lng, p_lat)::geography,
//     p_radius_meters
//   )
//   ORDER BY ST_Distance(
//     ST_MakePoint(lng, lat)::geography,
//     ST_MakePoint(p_lng, p_lat)::geography
//   );
// $$ LANGUAGE sql;
```

---

### Consistency Checklist

Before implementing any feature, AI agents must verify:

- [ ] Database tables use snake_case plural naming
- [ ] React components use PascalCase
- [ ] Server Actions use camelCase and return `{ success, data/error }` format
- [ ] Zod schemas used for validation (client + server)
- [ ] Dates stored as `timestamptz`, returned as ISO strings
- [ ] Tests co-located with source files
- [ ] TypeScript strict mode enabled, no `any` types
- [ ] EXIF metadata stripped from all uploaded photos
- [ ] RLS policies enforce data isolation
- [ ] Error messages are user-friendly (no technical details)
- [ ] Components follow structure: hooks → handlers → effects → render
- [ ] Imports organized: React → libraries → internal → relative
- [ ] Touch targets are minimum 44x44px (accessibility)
- [ ] Loading states use Spinner + disabled buttons
- [ ] Success/error feedback follows UX patterns
- [ ] Analytics events tracked for key actions
- [ ] Metrics tracked for KPI validation (submission time, dashboard load, etc.)
- [ ] Feature flags used for Phase 2/3 features

---

## Future African Market Features (Phase 2+ Architecture)

**Context:** These features are **deferred from MVP** to validate core platform value first. Architecture decisions below ensure we can add these capabilities without major refactoring when user feedback + scale justify the investment.

---

### Voice Notes Infrastructure (Phase 2: Months 6-9)

**Use Case:** Low-literacy users record verbal report instead of typing text.

**Architecture Decision:**

**Storage:**

- Supabase Storage bucket: `voice-notes/`
- File naming: `{user_id}/{issue_id}_{timestamp}.webm` (WebM Opus codec for web)
- Max file size: 10MB (~5 minutes of audio at 32kbps)
- Storage cost: ~$2/month for 1,000 notes (cheap)

**Recording Flow:**

```typescript
'use client';
import { useState, useRef } from 'react';

export function VoiceNoteRecorder({ onRecordingComplete }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    mediaRecorder.ondataavailable = (event) => {
      // Upload chunk to Supabase Storage
      uploadVoiceNote(event.data);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      className="min-h-[60px] min-w-[60px] rounded-full bg-primary"
    >
      {isRecording ? '🎙️ Recording...' : '🎤 Hold to Record'}
    </button>
  );
}
```

**Database Schema Addition:**

```sql
CREATE TABLE voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_voice_notes_issue ON voice_notes(issue_id);
CREATE INDEX idx_voice_notes_user ON voice_notes(user_id);
```

**Validation Gate:** Implement when ≥30% of text reports are <10 words (signal users want audio).

---

### SMS Notifications Infrastructure (Phase 2: Months 9-12)

**Use Case:** Rural users with 2G-only coverage, users who prefer SMS over email.

**Architecture Decision:**

**SMS Gateway: Africa's Talking API**

- Coverage: Nigeria, Kenya, Uganda, Tanzania, Rwanda, Ghana, South Africa
- Cost: ~$0.015-0.025/SMS depending on country
- Webhook support for delivery status tracking

**Integration Architecture:**

```typescript
// lib/sms/africas-talking.ts
import AfricasTalking from 'africastalking';

const client = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY!,
  username: process.env.AFRICASTALKING_USERNAME!,
});

export async function sendSMS(to: string, message: string) {
  try {
    const result = await client.SMS.send({
      to: [to],
      message,
      from: 'EcoPulse', // Sender ID (requires registration)
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('SMS send failed:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}
```

**Notification Abstraction Layer:**

```typescript
// lib/notifications/send.ts
export async function sendNotification(
  userId: string,
  type: 'issue_assigned' | 'issue_resolved' | 'verification_added',
  data: Record<string, any>
) {
  const user = await supabase
    .from('profiles')
    .select('email, phone, notification_preferences')
    .eq('id', userId)
    .single();

  // Check user preferences
  const prefs = user.notification_preferences || {};

  // Email (MVP)
  if (prefs.email !== false) {
    await sendEmail(user.email, type, data);
  }

  // SMS (Phase 2)
  if (prefs.sms === true && user.phone) {
    await sendSMS(user.phone, formatSMSMessage(type, data));
  }

  // Push (Phase 2)
  if (prefs.push !== false) {
    await sendPushNotification(userId, type, data);
  }
}
```

**Database Schema Addition:**

```sql
ALTER TABLE profiles ADD COLUMN phone TEXT;
ALTER TABLE profiles ADD COLUMN notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}';

CREATE TABLE sms_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, sent, delivered, failed
  provider_message_id TEXT,
  cost_usd NUMERIC(10, 4),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Cost Management:**

- Track SMS spend per user in `sms_log` table
- Set monthly SMS budget cap per organization
- Alert when approaching budget limit
- Default: SMS disabled, users opt-in via settings

**Validation Gate:** Implement when ≥1,000 active Nigerian users (justify $300/month SMS cost).

---

### Implementation Priority Matrix

| Feature                    | Cost                    | Dev Effort           | User Impact              | Priority                    |
| -------------------------- | ----------------------- | -------------------- | ------------------------ | --------------------------- |
| **i18n Framework**         | $0                      | 1-2 days             | HIGH (enables expansion) | **SPRINT 1** ✅             |
| **Voice Notes**            | ~$2/month               | 5-7 days             | MEDIUM (30% users need)  | **Phase 2 (Months 6-9)**    |
| **SMS Notifications**      | ~$300/month @ scale     | 3-4 days             | HIGH (rural users)       | **Phase 2 (Months 9-12)**   |
| **Multi-Language Content** | ~$500/language          | 1 week/language (QA) | HIGH (non-English users) | **Phase 2 (Months 6-12)**   |
| **Offline-First**          | $0 (Service Worker)     | 7-10 days            | MEDIUM (15% users need)  | **Phase 2 (Months 9-12)**   |
| **WhatsApp API**           | ~$100/month + $0.02/msg | 2 weeks              | MEDIUM (5K+ users)       | **Phase 3 (Months 12-18)**  |
| **Audio Guidance**         | ~$20/month              | 1 week               | LOW (user testing TBD)   | **Phase 3 (Months 12-18)**  |
| **2G Optimization**        | $0 (client-side)        | 2 weeks              | LOW (rural expansion)    | **Phase 3+ (18-24 months)** |

**Decision Framework:**

- Implement when **validation gate** triggers (user feedback + usage data)
- Prioritize features with **low cost + high user impact** first (i18n, voice notes)
- Defer features with **high cost until scale justifies** (SMS @ $300/mo, WhatsApp API)

---

## Architecture Document Complete

This architecture document provides comprehensive guidance for implementing ecoPulse with **Africa-First design principles**:

✅ **Technical feasibility** - Verified current versions and compatibility  
✅ **Implementation consistency** - Patterns prevent AI agent conflicts  
✅ **Business alignment** - Decisions support African market PRD goals  
✅ **Quality gates** - Testing, accessibility, and performance requirements defined  
✅ **Security-first** - Privacy, authentication, and data isolation architected  
✅ **Team collaboration** - Multiple expert perspectives integrated  
✅ **i18n Framework** - Built from Sprint 1, English MVP, multi-language ready  
✅ **Future Expansion** - Voice notes, SMS, WhatsApp, audio guidance documented

**Africa-Specific Additions:**

- 🌍 **i18n architecture** with `next-intl` (translation keys from day 1)
- 🌍 **English-only MVP** with zero-refactor path to Hausa/Yoruba/Igbo/Swahili
- 🌍 **Future features documented** (voice notes, SMS, WhatsApp) with validation gates
- 🌍 **Cost estimates** for African expansion features
- 🌍 **Implementation priorities** based on user impact + cost

**Next Steps:**

1. **Bob (Scrum Master)** creates epics and user stories:
   - Sprint 0: i18n framework setup (1-2 days) + Supabase env setup
   - Sprint 1-4: Same as before (anonymous reporting, verification, NGO dashboard)
   - Phase 2+ epics documented for future backlog (voice notes, SMS, multi-language)
2. **Sally (UX Designer)** creates wireframes aligned with technical decisions:
   - Mobile-first design for Nigerian smartphone users
   - Icon-driven UI patterns ready for low-literacy enhancements (Phase 2+)
3. **Murat (TEA)** designs test strategy with i18n considerations:
   - Test translation key coverage (no hardcoded strings)
   - Validate locale switching and routing
4. **Development begins** with Sprint 0 (i18n framework + Supabase schema)
