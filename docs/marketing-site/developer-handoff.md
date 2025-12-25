# EcoPulse Public-Facing Site (Marketing) + Map Route Refactor — Developer Brief

Date: 2025-12-25

This document is a complete briefing for a developer who has no prior context about EcoPulse. It explains **why** we’re building these pages, **what** they must contain, **how** they fit into the existing Next.js codebase, and **when** to deliver each part.

---

## 1) Project Context (why this exists)

EcoPulse is a community-powered environmental action platform for African communities. People can report waste/drainage issues with photo evidence and a location, other community members verify, and then responders (NGOs/community groups/civic actors) can coordinate cleanup and improvements.

### Why the public site matters right now

We are actively pursuing:

- Fiscal sponsorship / legal-entity coverage
- Grant funding (LOI-driven)
- Pilot partnerships (local NGOs, community leaders, municipal contacts)

Funders and partners require a credible, public-facing web presence that answers:

- Who are you?
- What do you do?
- Why should we trust you?
- What will the pilot do and how will you measure success?
- How can we contact you?

The existing app UI is optimized for usage (maps, reports, auth). The public site must be **institutional-grade** (clean, structured, professional) while still reflecting community-first values.

---

## 2) Objectives (what success looks like)

### Primary outcomes (must support these)

1. A funder can understand EcoPulse in < 60 seconds.
2. A partner can evaluate the pilot plan and metrics.
3. A visitor can immediately access the working product map.
4. The site looks legitimate and maintained (not “hackathon”).
5. The build is i18n-ready and accessible.

### Primary conversions (CTAs)

Priority order:

1. “View live map” → `/[locale]/map`
2. “Report an issue” → the report flow (or map entry point if report flow is embedded)
3. “Partner with us / Contact” → contact page + email

### Anti-goals (explicitly avoid)

- Do not overclaim outcomes or imply official government endorsement.
- Do not use emotional/fear-heavy imagery.
- Do not show user personal data.
- Do not turn marketing pages into app navigation (keep them distinct).

---

## 3) Target Audiences (who reads this)

### A) Funders / foundations

Needs: legitimacy, clarity, measurable pilot, risk management, compliance tone.

### B) Fiscal sponsors

Needs: mission alignment, operational readiness, responsible governance signals.

### C) NGO / community partners

Needs: how to participate, how verification works, data trust.

### D) Community members

Needs: simple explanation, clear “how it works”, quick access to map/report.

---

## 4) Messaging & Tone (how we sound)

### Voice

- Institutional and clear (grant-ready)
- Community-respectful (not savior tone)
- Evidence-based language (“pilot”, “target”, “in progress”)

### Core positioning (one-liner)

EcoPulse helps communities **report**, **verify**, and **coordinate action** on waste and drainage issues—starting with a measurable pilot.

### Proof signals (include throughout)

- Verification threshold / anti-fraud approach
- Privacy-first photo handling (EXIF stripping)
- Accessibility (mobile, low bandwidth)

---

## 5) Information Architecture (what pages exist)

Public marketing pages (new):

- `/[locale]/` — Landing (the entry point for funders/partners)
- `/[locale]/about` — About
- `/[locale]/mission` — Mission & principles
- `/[locale]/pilot` — Pilot Plan (detailed)
- `/[locale]/faq` — FAQ
- `/[locale]/contact` — Contact + partnership inquiry
- `/[locale]/privacy` — Privacy policy (simple but real)
- `/[locale]/terms` — Terms (simple but real)

Product pages:

- `/[locale]/map` — existing `IssueMap` (move from locale home)

---

## 6) Critical Refactor (routing + layouts)

### Why we must refactor

Currently [app/[locale]/page.tsx](../../app/%5Blocale%5D/page.tsx) is the map. For LOIs and partners, `/[locale]/` should be a marketing landing page. The map becomes `/[locale]/map`.

### Recommended structure (Route Groups)

Create two route groups under `[locale]`:

- Marketing (public): `app/[locale]/(marketing)/**`
- App (product): `app/[locale]/(app)/**`

Both share the locale provider from [app/[locale]/layout.tsx](../../app/%5Blocale%5D/layout.tsx), but each group has its own chrome:

- Marketing: `MarketingHeader` + `MarketingFooter`
- App: current `AuthProvider` + `DesktopNav` + `MobileHeader` + `Toaster`

### Minimal-risk approach

Phase 1 changes only what’s required:

- Marketing pages added
- Map moved to `/map`
- App nav updated to point to `/map`

Do not migrate every app route into `(app)` unless needed.

---

## 7) Deliverables & Timeline (when)

This project should be delivered in 2 short sprints.

### Sprint 1 (2–3 days): “Credible public presence + working map link”

Must deliver:

- Route groups + layouts
- Landing page (complete)
- About + Mission + Pilot pages (complete, even with placeholder city)
- Map moved to `/map` + navigation updated
- Basic metadata for all marketing pages

Exit criteria:

- A funder can navigate `/`, read pilot, and click into map.

### Sprint 2 (1–2 days): “Polish + compliance”

Must deliver:

- FAQ + Contact pages
- Contact form (Server Action + email)
- Privacy + Terms pages
- Accessibility pass, performance pass
- Optional analytics

Exit criteria:

- Contact works; policies exist; Lighthouse is reasonable.

---

## 8) Implementation Plan (exact file tree)

### Phase 1 target file tree (add/change)

Add:

```
app/
  [locale]/
    (marketing)/
      layout.tsx
      page.tsx
      about/page.tsx
      mission/page.tsx
      pilot/page.tsx
      faq/page.tsx
      contact/page.tsx
      privacy/page.tsx
      terms/page.tsx
    (app)/
      layout.tsx
      map/page.tsx
components/
  marketing/
    MarketingHeader.tsx
    MarketingFooter.tsx
    Hero.tsx
    TrustBar.tsx
    HowItWorks.tsx
    ImpactStats.tsx
    PilotSnapshot.tsx
    FAQAccordion.tsx
    ContactForm.tsx
app/actions/
  submitContact.ts
```

Change:

- `app/[locale]/layout.tsx` (remove app chrome; keep only locale provider)
- `components/navigation/DesktopNav.tsx` (Map href: `/` → `/map`)
- `components/navigation/MobileMenu.tsx` (if it has Map href)

---

## 9) Page-by-Page Requirements (why + what + structure)

The developer must treat this section as the authoritative specification.

### Global marketing layout (applies to ALL marketing pages)

Must include:

- Header with:
  - EcoPulse logo (links to `/[locale]/`)
  - Primary nav: About, Mission, Pilot, FAQ, Contact
  - Primary CTA button: “View map” → `/[locale]/map`
- Footer with:
  - Links: About, Mission, Pilot, FAQ, Contact
  - Links: Privacy, Terms
  - Email contact
  - “EcoPulse” + short mission line

Do not include:

- App user avatar menu
- In-app navigation (My Reports, Dashboard, etc.)

### Landing: `/[locale]/` (most important page)

Purpose:

- Convert funders/partners from “uncertain” to “this is credible”.

Primary CTA:

- “View live map” → `/[locale]/map`

Secondary CTA:

- “Contact / Partner with us” → `/[locale]/contact`

Required section structure (in order):

1. Hero
   - H1 (one sentence)
   - 1–2 line subheadline
   - Primary + secondary CTAs
2. Trust signals
   - 3–5 bullets (privacy, verification, mobile-first)
3. How it works (3 steps)
   - Report → Verify → Coordinate
4. Pilot snapshot (high-level)
   - Location placeholder allowed
   - Timeline preview
   - Metrics preview
5. “Who it’s for” (3 cards)
   - Communities, NGOs, Civic responders
6. FAQ preview (top 4)
7. Final CTA band
   - Repeat primary CTA + contact link

Content constraints:

- No fake numbers. Use “targets” if data not available.
- Keep hero headline professional (no hype words like “revolutionary”).

### About: `/[locale]/about`

Purpose:

- Establish legitimacy and origin story.

Required structure:

1. Hero header
   - H1 “About EcoPulse”
   - 1–2 paragraph summary
2. The problem we focus on
   - Waste and drainage issues → flooding and health risks
3. What EcoPulse does (clear bullets)
   - Report with photo+location
   - Community verification
   - Visibility for coordinated response
4. Why this approach works
   - Trust + verification + evidence
5. Team / governance
   - If names unknown: “Core team” + roles (Product, Community, Engineering)
   - Include a line: “Fiscal sponsorship in progress” if applicable

### Mission: `/[locale]/mission`

Purpose:

- Provide a crisp mission statement and principles funders expect.

Required structure:

1. Mission statement (1–2 sentences)
2. Principles (5–7 bullets)
   - Transparency
   - Community-led verification
   - Privacy by design
   - Accessibility / low bandwidth
   - Safety and dignity
3. What we’re not
   - Not a government agency
   - Not a surveillance platform
   - Not a replacement for city services
4. How we measure impact
   - Verified reports
   - Response coordination
   - Resolution outcomes (pilot-defined)

### Pilot: `/[locale]/pilot` (most important for grants)

Purpose:

- Make the pilot plan “grant-readable”: scope, timeline, metrics, risks.

Required structure:

1. Pilot overview
   - Problem statement
   - Target geography (placeholder ok)
   - Duration (recommended: 90 days)
2. Scope table
   - Where (city/wards)
   - Who verifies (community members)
   - Verification threshold (use your MVP rule; if changing, align with code)
   - What counts as “resolved”
3. Workflow description (simple)
   - Report → Verify → Coordinate
4. Pilot timeline (0–30 / 31–60 / 61–90)
5. Metrics & evaluation
   - Output metrics: number of reports, verification rate
   - Outcome metrics: median time-to-verified, median time-to-first-response
   - Learning metrics: false report rate, user retention (optional)
6. Risks & mitigations
   - Misinformation / spam → verification threshold + dedupe
   - Privacy concerns → EXIF stripping, minimal PII
   - Low adoption → partner onboarding plan
7. Partner ask
   - What we need from NGOs/civic actors
   - Contact CTA

### FAQ: `/[locale]/faq`

Purpose:

- Reduce doubts quickly.

Must include these questions:

- How do you prevent false reports?
- How does verification work?
- What about privacy?
- Who can see my report?
- How can an NGO/city partner help?

### Contact: `/[locale]/contact`

Purpose:

- Make partnership and sponsorship outreach frictionless.

Required structure:

1. Header with 1 paragraph: who should contact us
2. Contact methods
   - Email link (always)
   - Form (preferred)
3. Form requirements
   - Fields: name, email, organization (optional), message
   - Validation: required + basic email format
   - Success state: confirmation message
   - Error state: generic error + fallback email

### Privacy: `/[locale]/privacy`

Purpose:

- Satisfy funder and partner due diligence.

Must include:

- What we collect (photos, location, notes)
- What we do not collect (device fingerprinting; sensitive PII)
- How we process photos (privacy-first; EXIF stripping)
- Retention basics (if unknown, state “we minimize retention; details updated during pilot”)
- Contact for data questions

### Terms: `/[locale]/terms`

Purpose:

- Basic usage expectations and liability framing.

Must include:

- Acceptable use (no illegal content, harassment)
- Content ownership & permission to display reports
- No guarantee of resolution
- Contact

---

## 10) Design System Guidance (institutional vs community)

Recommendation: **Institutional-first, community-warm accents**.

Why:

- The immediate users include funders and fiscal sponsors who judge credibility heavily on design and clarity.
- Community warmth should show via photography and respectful language, not loud styling.

Use existing tokens in [app/globals.css](../../app/globals.css):

- Primary green: already present
- Neutral surfaces: already present

Optional improvement:

- Add one restrained “trust” accent token (blue/slate) for links/badges only.

Layout rules:

- Max width: `max-w-7xl`
- Section rhythm: `py-12 md:py-16`
- Prefer light borders and cards over heavy shadows
- Maintain 44×44 touch targets

---

## 11) i18n Requirements (strict)

Marketing pages must be translation-ready. Even though MVP is English-only, we will add locales later.

Rules:

- No hardcoded strings in marketing page JSX.
- Add new keys under `marketing.*` in [messages/en.json](../../messages/en.json).
- Use `next-intl` consistently.

Minimum key namespaces:

- `marketing.nav.*`
- `marketing.landing.*`
- `marketing.about.*`
- `marketing.mission.*`
- `marketing.pilot.*`
- `marketing.faq.*`
- `marketing.contact.*`
- `marketing.legal.*`

---

## 12) SEO / Metadata (required)

Each marketing page must ship with:

- Meaningful title and description
- OpenGraph basics
- Canonical URL based on `NEXT_PUBLIC_APP_URL`

Copy guidelines:

- Keep descriptions factual and grant-appropriate.
- Avoid superlatives.

---

## 13) Accessibility & Performance (required)

Accessibility checklist:

- 44×44 minimum touch targets
- Visible focus states
- Proper heading hierarchy
- High contrast on body text
- Icon-only buttons have `aria-label`

Performance checklist:

- Prefer Server Components for pages
- Only mark accordion/form as client
- Avoid huge hero images; if used, use `next/image`

---

## 14) QA / Acceptance Criteria (definition of done)

Routing:

- `/[locale]/` is marketing landing
- `/[locale]/map` is the existing map
- App “Map” navigation goes to `/[locale]/map`

Content:

- Each marketing page includes all required sections
- No “Lorem ipsum” remains

i18n:

- All marketing strings are in `messages/en.json`

Functional:

- Contact form sends email (or at least validates + shows correct error state)

---

## Appendix A — Component Build List (implementation guidance)

Create folder: `components/marketing/`

Required components:

- `MarketingHeader.tsx`
- `MarketingFooter.tsx`
- `Hero.tsx`
- `TrustBar.tsx`
- `HowItWorks.tsx`
- `ImpactStats.tsx`
- `PilotSnapshot.tsx`
- `FAQAccordion.tsx`
- `ContactForm.tsx`

Guidance:

- Pages should be Server Components assembling sections.
- Only interactive widgets should be Client Components.
- Use shadcn components from `components/ui/**`.

---

## Appendix B — Phase 1 implementation details (how)

### Parent locale layout change (keep only intl provider)

In [app/[locale]/layout.tsx](../../app/%5Blocale%5D/layout.tsx):

- Keep `setRequestLocale`, `getMessages`, and `NextIntlClientProvider`
- Remove app chrome (`AuthProvider`, `DesktopNav`, `MobileHeader`, `Toaster`) and move that into `(app)/layout.tsx`

### Navigation updates

In [components/navigation/DesktopNav.tsx](../../components/navigation/DesktopNav.tsx):

- Map nav item: `href: '/'` → `href: '/map'`

If [components/navigation/MobileMenu.tsx](../../components/navigation/MobileMenu.tsx) contains a map link, update it similarly.

### Locale-aware linking

On marketing pages and marketing header/footer:

- Prefer locale-aware Link from `@/i18n/routing`.

---

## Appendix C — Contact form backend (how)

Use a Server Action at `app/actions/submitContact.ts`.

Requirements:

- Use Resend if configured
- Validate required fields
- Return `{ success: boolean, error?: string }`
- Do not leak secrets to client

Environment variables:

- `RESEND_API_KEY`
- `EMAIL_FROM`

---

## Appendix D — Starter translation scaffold

Add keys under `marketing.*` in [messages/en.json](../../messages/en.json). Start with the scaffold below and expand while implementing.

```json
{
  "marketing": {
    "nav": {
      "home": "Home",
      "about": "About",
      "mission": "Mission",
      "pilot": "Pilot Plan",
      "faq": "FAQ",
      "contact": "Contact",
      "viewMap": "View Map"
    }
  }
}
```

---

## Appendix E — Content placeholders (what you can ship with)

If the exact pilot city/ward isn’t decided yet, use:

- “Pilot location: Selected communities in [City, Country] (finalizing with partners).”

If fiscal sponsorship isn’t finalized yet, use:

- “Fiscal sponsorship: In progress (in active discussion with sponsors).”

These statements are funder-safe and do not overclaim.

---

## Appendix F — Copy Deck (ready-to-implement content)

This section provides **grant-appropriate, institutional** copy that the developer can implement immediately. Treat this as **default English MVP copy**.

Copy rules:

- Keep claims factual; use “pilot”, “aim”, “target”, “in progress” where needed.
- Avoid naming government endorsements unless formally true.
- Don’t invent numbers. If metrics aren’t known, label as “Targets (pilot)” clearly.

### Global microcopy

Brand one-liner (footer):

- “EcoPulse helps communities report, verify, and coordinate action on waste and drainage issues.”

Funder-safe status line (where needed):

- “Fiscal sponsorship: In progress (in active discussion with sponsors).”

Primary CTA label:

- “View live map”

Secondary CTA label:

- “Partner with us”

---

### Landing page copy (`/[locale]/`)

**SEO**

- Title: “EcoPulse — Community-Verified Environmental Reporting”
- Description: “EcoPulse enables communities to report and verify waste and drainage issues with photo evidence—supporting a measurable pilot and coordinated response.”

**Hero**

- H1: “Community-verified reporting for waste and drainage issues.”
- Subheadline: “EcoPulse helps communities report issues with photo evidence, verify them locally, and support coordinated action—starting with a measurable pilot.”
- Primary CTA: “View live map”
- Secondary CTA: “Partner with us”

**Trust signals (3–5 bullets)**

- “Photo evidence with privacy-first processing (EXIF removed).”
- “Community verification to reduce false or duplicate reports.”
- “Designed for mobile and low bandwidth.”
- “Clear pilot metrics and transparent learning.”

**How it works (3 steps)**

- Step 1 title: “Report”
  - Body: “Share a photo, location, and a clear description of the issue.”
- Step 2 title: “Verify”
  - Body: “Nearby community members confirm what they see, improving trust in the data.”
- Step 3 title: “Coordinate”
  - Body: “Verified issues can be prioritized by partners for response and cleanup.”

**Pilot snapshot (short paragraph)**

- “We are preparing a 90‑day pilot to test adoption, verification quality, and response coordination in selected communities. Our goal is to learn what works, measure outcomes, and improve the model with partners.”

**Who it’s for (3 cards)**

- Communities: “A simple way to report and verify issues that affect daily life.”
- NGOs & community groups: “A shared picture of verified needs to support coordinated action.”
- Civic responders: “A clearer signal of priority problems and where to start.”

**Metrics (label as targets)**

- Section title: “Pilot targets”
- Items:
  - “Verified reports per week”
  - “Median time from report → verified”
  - “Median time from verified → first response”
  - “Resolution rate (definition agreed with partners)”

**Footer CTA band**

- Title: “Interested in partnering on the pilot?”
- Body: “We’re looking for community partners, NGOs, and supporters to help validate and scale a responsible model for environmental reporting.”
- CTA: “Contact us”

---

### About page copy (`/[locale]/about`)

**SEO**

- Title: “EcoPulse — About”
- Description: “Learn why EcoPulse was created and how community verification supports trustworthy reporting and coordinated environmental action.”

**Page header**

- H1: “About EcoPulse”
- Intro paragraph 1: “EcoPulse is a community-powered platform for reporting waste and drainage issues with photo evidence and location.”
- Intro paragraph 2: “We add community verification to improve trust, reduce noise, and support coordinated action—starting with a measurable pilot.”

**The problem we focus on**

- “Waste accumulation and blocked drainage contribute to flooding risks and public health challenges. Communities often lack an easy, trusted way to document issues and coordinate attention.”

**What EcoPulse does (bullets)**

- “Enables photo-and-location reporting.”
- “Supports community verification to strengthen trust.”
- “Creates shared visibility for partners to coordinate response.”

**Why verification matters (short)**

- “In many settings, the biggest challenge is not awareness—it’s trust and prioritization. Verification helps reduce false reports and duplicate entries so responders can focus attention effectively.”

**Team / governance (safe placeholder)**

- “EcoPulse is built by a small core team with experience in product, community operations, and engineering. We are setting up responsible governance and operational partnerships for the pilot.”
- Add status line if true: “Fiscal sponsorship: In progress (in active discussion with sponsors).”

---

### Mission page copy (`/[locale]/mission`)

**SEO**

- Title: “EcoPulse — Mission”
- Description: “EcoPulse’s mission is to enable community-led reporting and verification of environmental issues with privacy, accessibility, and measurable impact.”

**Mission statement**

- H1: “Mission & principles”
- Mission (1–2 sentences): “Our mission is to help communities document environmental issues with evidence, verify them locally, and support coordinated action—while protecting privacy and accessibility.”

**Principles (bullets)**

- “Community-led verification: trust comes from local knowledge.”
- “Privacy by design: minimize data collection and protect contributors.”
- “Accessibility: mobile-first, low-bandwidth friendly.”
- “Transparency: clear status and learning during the pilot.”
- “Safety and dignity: respectful design for communities.”

**What we’re not**

- “EcoPulse is not a government agency.”
- “EcoPulse is not a surveillance product.”
- “EcoPulse does not guarantee issue resolution—our role is to strengthen evidence and coordination.”

**How we measure impact**

- “Verification quality and rate.”
- “Time-to-verified and time-to-response (pilot metrics).”
- “Resolution outcomes, defined with partners.”

---

### Pilot page copy (`/[locale]/pilot`)

**SEO**

- Title: “EcoPulse — Pilot Plan”
- Description: “A 90-day pilot plan to evaluate community reporting, verification quality, and response coordination for waste and drainage issues.”

**Pilot overview**

- H1: “Pilot plan (90 days)”
- Intro: “This pilot is designed to test adoption, verification quality, and response coordination for waste and drainage issues in selected communities.”

**Scope (table copy)**

- Geography: “Selected communities in [City, Country] (finalizing with partners).”
- Duration: “90 days”
- Issue focus: “Waste accumulation and blocked drainage”
- Verification model: “Community verification with safeguards against duplicates and self-verification.”
- Success definition: “Verified issues receive documented response attempts and resolution outcomes where feasible.”

**Timeline (0–30 / 31–60 / 61–90)**

- 0–30: “Partner onboarding, baseline mapping, community onboarding, first reports and verifications.”
- 31–60: “Improve workflows, monitor verification quality, start response coordination playbooks.”
- 61–90: “Measure outcomes, document learnings, publish pilot summary and next steps.”

**Metrics & evaluation (use headings + bullets)**

- Outputs:
  - “Number of reports submitted”
  - “Verification rate (verified / total)”
  - “Duplicate/spam rate (tracked internally)”
- Outcomes:
  - “Median time: report → verified”
  - “Median time: verified → first response attempt”
  - “Resolution rate (as defined with partners)”
- Learning:
  - “What prevents verification?”
  - “What motivates reporting?”
  - “What partner workflows lead to faster response?”

**Risks & mitigations (copy)**

- Risk: “False or misleading reports.” Mitigation: “Verification threshold, deduplication, and anti-self-verification rules.”
- Risk: “Privacy concerns.” Mitigation: “EXIF stripping, minimal personal data, clear user guidance.”
- Risk: “Low adoption.” Mitigation: “Partner onboarding, community champions, and mobile-first UX.”

**Partner ask (short)**

- “We’re looking for partners who can support community onboarding, verification participation, and response coordination during the pilot.”
- CTA: “Contact us to discuss the pilot.”

---

### FAQ page copy (`/[locale]/faq`)

**SEO**

- Title: “EcoPulse — FAQ”
- Description: “Answers to common questions about reporting, verification, privacy, and partnerships with EcoPulse.”

Use these Q/A pairs verbatim (short and clear):

1. Q: “How do you prevent false reports?”
   - A: “EcoPulse uses community verification and duplicate safeguards to reduce false or misleading reports. Verification helps strengthen trust before issues are prioritized.”
2. Q: “How does verification work?”
   - A: “Nearby community members confirm what they see. A report can be promoted when it reaches the verification threshold.”
3. Q: “What about privacy?”
   - A: “We minimize data collection. Photos are processed with privacy in mind (including EXIF removal), and we avoid collecting unnecessary personal information.”
4. Q: “Who can see my report?”
   - A: “Reports are visible in the map experience to support coordination. We recommend avoiding personal details in notes.”
5. Q: “How can an NGO or civic partner help?”
   - A: “Partners can support community onboarding, participate in verification, and help coordinate response workflows during the pilot.”

---

### Contact page copy (`/[locale]/contact`)

**SEO**

- Title: “EcoPulse — Contact”
- Description: “Contact EcoPulse to discuss partnerships, pilots, or fiscal sponsorship. We respond to serious inquiries as quickly as possible.”

**Header**

- H1: “Contact EcoPulse”
- Body: “If you’re an NGO, community organization, or supporter interested in the pilot, we’d love to hear from you.”

**Fallback email line**

- “Prefer email? Write to: [your-email]”

**Form submit states**

- Success: “Thanks—your message has been sent. We’ll respond as soon as possible.”
- Error: “We couldn’t send your message. Please try again or email us directly.”

---

### Privacy page copy (`/[locale]/privacy`)

**SEO**

- Title: “EcoPulse — Privacy”
- Description: “EcoPulse’s privacy approach: minimal data collection, privacy-first photo handling, and clear user guidance during the pilot.”

**H1:** “Privacy”

Sections (short paragraphs):

- “What we collect: photos, locations, and issue descriptions to support reporting and verification.”
- “What we avoid: we do not use device fingerprinting. We encourage users not to include sensitive personal information in notes.”
- “Photo handling: photos are processed with privacy in mind, including removing EXIF metadata.”
- “Data retention: we aim to minimize retention and will refine details during the pilot based on partner requirements and user safety.”
- “Contact: for privacy questions, contact us at [your-email].”

---

### Terms page copy (`/[locale]/terms`)

**SEO**

- Title: “EcoPulse — Terms”
- Description: “Basic terms of use for EcoPulse, including acceptable use, content permission, and no guarantee of resolution.”

**H1:** “Terms of use”

Required bullets:

- “Acceptable use: do not upload illegal content, harassment, or personal sensitive data.”
- “Content permission: by submitting content, you allow EcoPulse to display the report to support coordination.”
- “No guarantee: EcoPulse does not guarantee that any issue will be resolved.”
- “Contact: questions can be sent to [your-email].”
