# GitHub Copilot Instructions — EcoPulse

Concise, project-specific guidance for AI coding agents to be productive immediately in this codebase.

## Big Picture

- **Mission:** Distributed environmental action platform for African communities - report, verify, and coordinate resolution of waste/drainage issues through community-driven verification.
- **Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, Tailwind, Shadcn UI (owned), next-intl (i18n), Supabase (Auth/DB/Storage), Leaflet (maps), Vitest/Playwright.
- **Architecture:** Server-heavy with Server Actions for mutations (`app/actions/**`). Supabase SSR clients: `lib/supabase/{server,client,admin}.ts`. Row-Level Security (RLS) enforces multi-org isolation.
- **i18n:** next-intl with default locale `en` (English only in MVP). Routes: `app/[locale]/`, middleware handles session + i18n. Future: Hausa, Yoruba, Igbo, Swahili.
- **Maps:** Leaflet + react-leaflet-cluster; Zustand manages filters/state (`stores/mapStore.ts`). Bounding-box queries via `app/actions/getMapIssues.ts`.

## Workflows

- **Dev:** `pnpm dev` (port 3000). Playwright auto-starts server for E2E.
- **Build:** `pnpm build` → `pnpm start` for production preview.
- **Lint/Format:** `pnpm lint` (ESLint strict, 0 warnings), `pnpm lint:fix`, `pnpm format`, `pnpm format:check` (Prettier).
- **Types:** `pnpm type-check` (TypeScript strict mode).
- **Tests:** `pnpm test` (Vitest unit), `pnpm test:watch`, `pnpm test:ui`, `pnpm test:coverage`. E2E: `pnpm test:e2e` or `pnpm test:e2e:ui`.
- **CI/CD:** GitHub Actions runs lint, type-check, test, build on every PR. Vercel auto-deploys previews.

## Conventions & Patterns

- **Next.js 16 async APIs:** `cookies()`, `headers()`, `params`, `searchParams` are async. Follow patterns in `lib/supabase/server.ts` and `app/[locale]/layout.tsx`.
- **Server Actions:** Place in `app/actions/**`. Always export functions with `'use server'` and return `{ success: boolean, data?: T, error?: string }`. Examples: `createReport.ts`, `uploadPhoto.ts`, `createVerification.ts`.
- **Caching:** Use `revalidatePath()` after mutations (see `createReport.ts`, `createVerification.ts`). Prefer tag-based revalidation only when needed.
- **Supabase clients:**
  - Server: `await createClient()` from `lib/supabase/server.ts` (cookie-aware SSR).
  - Browser: `createClient()` from `lib/supabase/client.ts` in `'use client'` components.
  - Admin: `createAdminClient()` from `lib/supabase/admin.ts` for RLS-bypassing server-only tasks. Never expose service role key to client.
- **UI:** Shadcn components live in `components/ui/**` (owned). Use `lib/utils.ts` `cn()` for class merging. Maintain accessibility defaults from Radix.
- **State:** Use Zustand for global UI/map state (`stores/**`), React Hook Form for complex forms (see report/verification flows).
- **Icons:** Hugeicons only (`@hugeicons/react`). Icon-driven UI for low-literacy users (no text labels on primary flows).
- **Touch Targets:** All interactive elements 44x44px minimum (WCAG 2.1 AA).

## Domain Rules (MVP in code)

- **Report submission** (`app/actions/createReport.ts`):
  - Requires ≥1 photo, location, category, note ≥ 60 chars; sets `status: 'pending'`.
  - Authenticated sets `user_id`; anonymous sets `session_id` for later claim.
- **Photo upload** (`app/actions/uploadPhoto.ts`):
  - Strips EXIF (privacy), resizes ≤1920×1080, compresses JPEG, uploads to Supabase Storage; rejects if stripping fails.
- **Verification** (`app/actions/createVerification.ts`):
  - Blocks self-verification (by `user_id` or `session_id`), deduplicates per verifier, increments `verification_count`, promotes to `verified` at threshold (2).
- **Map fetch** (`app/actions/getMapIssues.ts`):
  - Bounds + optional filters; `is_flagged=false` enforced; limited results based on viewport/device.
- **Anonymous tracking:** Uses localStorage `session_id` (UUID), NOT device fingerprinting. Session expires after 7 days.

## i18n Usage

- Routing and providers: `i18n/routing.ts`, `i18n/request.ts`, `app/[locale]/layout.tsx`.
- Translations: `messages/en.json` with namespaced keys (`common`, `navigation`, `report`, etc.). Avoid hardcoded strings; prefer `NextIntlClientProvider` server-side patterns.
- Middleware integrates i18n + session refresh (`middleware.ts`).

## Testing & QA

- Unit/Component: Vitest + Testing Library; JSDOM environment (see `vitest.config.ts`, `vitest.setup.ts`).
- E2E: Playwright projects for desktop/mobile; starts `pnpm dev` automatically; baseURL `http://localhost:3000`.
- Accessibility: Basic checks in E2E; expand with axe-core where needed.
- Accessibility: Basic checks in E2E; expand with axe-core where needed.

## Environment & Secrets

- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY` (emails), `EMAIL_FROM`, `NEXT_PUBLIC_APP_URL`.
- Server-only: `SUPABASE_SERVICE_ROLE_KEY` for admin client. Never use in client components.

## Do/Don’t

- Do follow async patterns and use Server Actions for mutations; call `revalidatePath()` for affected pages.
- Do keep component strings translated via `messages/en.json`; use locale-aware layouts.
- Do use Supabase SSR clients consistently; prefer server-side queries when possible.
- Don’t hardcode text, secrets, or bypass RLS in client code.
- Don’t introduce REST endpoints unless necessary—Server Actions cover mutations for MVP.

## Helpful File Map

- App/layouts: `app/layout.tsx`, `app/[locale]/layout.tsx`.
- Actions: `app/actions/{createReport,uploadPhoto,createVerification,getMapIssues}.ts`.
- Supabase: `lib/supabase/{server,client,admin}.ts`, types in `lib/supabase/database.types.ts`.
- i18n: `i18n/{routing.ts,request.ts}`, translations in `messages/en.json`.
- State: `stores/mapStore.ts`, map constants `lib/map/constants.ts`.
- E2E: `e2e/homepage.spec.ts`, config `playwright.config.ts`.
