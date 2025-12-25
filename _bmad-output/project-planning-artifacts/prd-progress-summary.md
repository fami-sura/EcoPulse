# EcoPulse PRD - Progress Summary

**Date:** December 17, 2025  
**Status:** Steps 1-7 Complete (7 of 11)  
**Document Length:** ~2,200 lines

---

## Executive Summary

We've completed 64% of the Product Requirements Document for EcoPulse, a distributed environmental action platform. The PRD documents:

- **8 User Journeys** covering all personas (reporters, verifiers, volunteers, NGOs, government, moderators, API consumers)
- **4 Core Innovations** that create Blue Ocean differentiation from 311 systems
- **6 Govtech Compliance Areas** ensuring government adoption readiness
- **5 Web Architecture Decisions** positioning us 3-5x faster than competitors

**Key Achievement:** We've transformed a product brief into a comprehensive, government-ready, innovation-validated requirements document that provides clear implementation guidance for Winston (Architect) and Bob (Scrum Master).

---

## Completed Sections

### ✅ Step 1: Initialization & Executive Summary

**Content:**

- Product vision: "Distributed environmental action platform that closes the accountability loop"
- 6 core differentiators: Action Cards, Community Verification, Multi-Org Native, Open API, Environmental Domain, Gamification
- Strategic positioning: Blue Ocean (not "better 311")
- Go-to-market: Trojan Horse strategy (NGOs → Government)
- Business model: $300k ARR Year 1, freemium SaaS ($49-99 NGO, $499+ Gov)

**Key Decisions:**

- Classification: web_app, govtech domain, HIGH complexity
- Tech stack: Next.js 15 + Supabase + Leaflet
- Market gap: 13+ competitors researched, 8 critical gaps identified

---

### ✅ Step 2: Discovery & Classification

**Project Classification:**

- **Type:** web_app (mobile-first responsive)
- **Domain:** govtech (government technology for civic engagement)
- **Complexity:** HIGH (data sovereignty, accessibility, multi-jurisdiction)

**Classification Impact:**

- Triggered mandatory Domain Requirements step (govtech compliance)
- Defined web-specific technical requirements (browser support, SEO, real-time)
- Set complexity-appropriate timeline (4 sprints MVP, 12-18 months Phase 2)

---

### ✅ Step 3: Success Criteria

**User Success Metrics:**

- Community Members: +5 points for proof upload with 10hrs→1hr/month NGO time savings
- NGO Coordinators: 10 hours/month → 1 hour/month saved on funder reporting
- Verification Success: ≥90% valid verifications (community validates community)

**Business Success Targets:**

- Revenue: $300k ARR Year 1, $1M ARR Year 2
- Conversion: 10-20% free → paid NGO conversion
- Retention: >85% annual for paid NGOs
- Time to Value: 4-7 days (first issue resolved)

**Technical Success Requirements:**

- Performance: <1s map load with 1000 pins, <2s dashboard load
- Data Integrity: Zero data loss, <0.1% export error rate
- Security: SOC 2 Type II compliance via Supabase
- Scalability: Support 10,000 concurrent users Phase 1
- Accessibility: WCAG 2.1 AA compliance (Section 508 mandatory)

**Measurable Outcomes Timeline:**

- 3 months: 50 active users, 100 verified reports, 1 NGO pilot
- 6 months: 500 active users, $10k MRR, 1 government pilot
- 12 months: 5,000 active users, $25k MRR, $300k ARR, 10 NGOs + 3 governments

**Product Scope:**

- MVP (Sprints 1-4): Core reporting, verification, Action Cards, NGO Dashboard
- Growth (Phase 2, 12-18 months): Government Dashboard, API integrations, self-hosting
- Vision (18-24 months): Global scale, impact measurement, blockchain verification

---

### ✅ Step 4: User Journeys (8 Personas)

**Core Personas (5):**

1. **Maria Rodriguez - Community Reporter (Age 34, Teacher)**
   - Journey: Reports overflowing bin → Verified by neighbors → NGO creates Action Card → City resolves → Uploads proof
   - Requirements revealed: Mobile-first map, camera integration, points/gamification, real-time visualization

2. **James Kim - Student Volunteer (Age 19, UC Berkeley)**
   - Journey: Finds cleanup action on map → Joins team → Coordinates via chat → Documents work → Earns volunteer hours
   - Requirements revealed: Action Card system, team coordination, multi-photo proof upload, volunteer hour tracking

3. **Sara Chen - Neighborhood Validator (Age 42, Software Engineer)**
   - Journey: Sees new report → Walks to location → Takes verification photo → NGO prioritizes due to her context
   - Requirements revealed: Second-person verification, photo upload, timestamp/location stamping, reputation tracking

4. **Linda Martinez - NGO Coordinator (Oakland Green Alliance Director)**
   - Journey: Reviews 23 verified reports → Creates Action Card → Volunteers execute → Exports funder report (10hrs→1hr saved)
   - Requirements revealed: NGO Dashboard, auto-prioritization, funder report export, volunteer management

5. **David Park - Government Staff (Oakland Public Works)**
   - Journey: Reviews verified reports → Assigns to team → Clears drain → Uploads official proof → Earns trust points
   - Requirements revealed: Government Dashboard, assignment workflow, official resolution proof, public accountability reports

**Edge Cases & Admin (3):**

6. **Alex Thompson - Anonymous Reporter (Age 28, Rideshare Driver)**
   - Journey: Reports without account → Pending verification → Community validates → Converts to authenticated user
   - Requirements revealed: Anonymous reporting, verification threshold, retroactive credit, conversion funnel

7. **Michelle Okafor - Platform Moderator**
   - Journey: Reviews flag queue → Confirms spam → Suspends user → Merges duplicates → Maintains 98.2% trust score
   - Requirements revealed: Moderator dashboard, flag system, user history analysis, duplicate detection/merge

8. **Kevin Martinez - 311 Systems Developer (Oakland)**
   - Journey: Reads API docs → Creates webhook → Auto-creates work orders → Bidirectional sync → Council presentation
   - Requirements revealed: REST API, OAuth 2.0, webhooks, rate limiting, developer portal, impact metrics tracking

**Journey Requirements Summary:**

- **Reporting & Mapping:** Mobile-first, camera integration, required fields, anonymous support, real-time pins
- **Verification & Trust:** Second-person validation, multi-verifier display, reputation tracking, flag system
- **Gamification:** Points system (+5/+3/+2), profile analytics, volunteer hours, success rates
- **Action Coordination:** Action Cards, team management, proof workflows, bulk resolution
- **Organization Dashboards:** NGO auto-prioritization, Government assignment workflows, funder exports
- **Moderation:** Community flagging, moderator review, duplicate merge, audit trails
- **API & Integrations:** REST API, webhooks, developer portal, bidirectional sync

---

### ✅ Step 5: Domain-Specific Requirements (Govtech Compliance)

**6 Key Domain Concerns Addressed:**

**1. Procurement Rules & Government Sales Strategy:**

- MVP: Pure SaaS self-service, departmental budgets <$10k (bypass procurement)
- Government funnel: NGO adoption → Gov sees data → Pilot request → Subscription → Enterprise
- GSA Schedule strategy: Apply Month 9 after 10+ government customers (6-9 month approval)
- Competitive differentiation: "Try before you buy" (90-day proof vs. multi-year contracts)

**2. Security Standards & Frameworks:**

- MVP: SOC 2 Type II (via Supabase), SSL/TLS, encryption at rest, RLS policies, audit logs
- NOT pursuing FedRAMP (costs $250k-500k, only for federal agencies, not MVP target)
- Self-hosting Phase 2 (Month 12-18) for data sovereignty (NYC, LA, EU, Canada)
- Market positioning: "Government-grade security without government pricing" ($499/mo vs. $50k+/yr)

**3. Accessibility Standards (Section 508/WCAG 2.1 AA):**

- REQUIRED for MVP (government legally prohibited from non-compliant software)
- Implementation: Keyboard navigation, screen reader support, 4.5:1 contrast, 44x44px touch targets
- Testing protocol: Sprint 2 automated audit, Sprint 3 keyboard testing, Sprint 4 screen reader testing
- Competitive moat: Many civic tech platforms fail accessibility audits

**4. Privacy & Data Protection Requirements:**

- CCPA compliance (California - Oakland pilot): Right to know, delete, opt-out of sale
- GDPR readiness (Phase 2 international): DPAs, data residency, cookie consent
- Photo privacy: EXIF stripping, user guidance, community flag system, AI blurring (Phase 2)
- Dual retention policies: Community right to delete vs. Government 7-year audit trail (anonymization solution)
- Market positioning: "Privacy-first civic engagement" (vs. 311 requiring full identity)

**5. Transparency & Open Data Requirements:**

- Public API: Open read access, anonymized exports, RSS/Atom feeds, bulk downloads (CC BY 4.0)
- API tiers: Public (100 req/hr free), NGO (500 req/hr), Government (1000 req/hr)
- Public transparency dashboards (Phase 2): Real-time government accountability metrics, embeddable widgets
- Competitive moat: Once civic ecosystem built on open API, switching costs prohibitive

**6. Multi-Jurisdiction Complexity Management:**

- Three-tier adaptive taxonomy: Universal backend (Waste/Litter, Drainage), jurisdiction-specific display (Oakland: "Illegal Dumping"), department routing
- SLA flexibility: Custom response time goals per organization (no unfair comparisons)
- Privacy law adaptation: CCPA for California, GDPR mode for EU, automatic based on location
- Market positioning: "Local control with global scale" (vs. rigid taxonomy competitors)

**Compliance Summary:**

- MVP must-haves: Section 508, CCPA, SOC 2, Open API, Audit logs, EXIF stripping
- Phase 2 enhancements: GDPR, self-hosting, AI photo privacy, multi-jurisdiction taxonomy, GSA Schedule
- Deferred: FedRAMP (not targeting federal), HIPAA (no health data), PCI DSS Level 1 (Stripe handles)

---

### ✅ Step 6: Innovation & Novel Patterns

**4 Fundamental Innovations Identified:**

**Innovation 1: Community-Driven Verification (Second-Person Validation)**

- **What:** Peer-to-peer verification where community members validate each other's reports
- **Challenge:** Traditional 311 assumes only government staff can verify
- **Our Approach:** Sara verifies Maria's report with independent photos, context notes, timestamps
- **Why Novel:** No platform treats verifiers as first-class contributors with reputation tracking
- **Validation:** ≥90% accuracy by Sprint 4, fallback to "verified member" role if <70%
- **Success Probability:** 75% (high)

**Innovation 2: Distributed Action Coordination (Action Cards)**

- **What:** NGOs/volunteers create and execute structured action plans, not just report problems
- **Challenge:** Traditional platforms are one-directional (citizens report → government responds)
- **Our Approach:** Linda creates cleanup Action Card, James joins team, uploads proof, bulk resolution
- **Why Novel:** We enable multiple actors to take coordinated action on same issue
- **Validation:** ≥50% NGO actions resolve issues by Sprint 4, fallback to approval workflow if chaos
- **Success Probability:** 80% (high)

**Innovation 3: Trojan Horse Go-to-Market Strategy**

- **What:** NGO adoption generates data that drives government demand (not traditional RFP sales)
- **Challenge:** Govtech startups target government directly with 12-18 month sales cycles
- **Our Approach:** NGOs adopt freely → Gov sees valuable data → Requests pilot → Converts to paid
- **Why Novel:** Using NGOs as data generation engines that create government demand
- **Validation:** ≥3 government pilot requests in Year 1, pivot to hybrid sales at Month 9 if needed
- **Success Probability:** 60% (medium) - HIGHEST RISK

**Innovation 4: Gamification in Govtech Context**

- **What:** Points, reputation, achievement systems in government/civic engagement domain
- **Challenge:** Govtech avoids gamification (perceived as frivolous)
- **Our Approach:** +5 points for reports/proofs, +3 for verifications, frame as "impact tracking"
- **Why Novel:** Extrinsic motivation + civic duty > civic duty alone for sustained engagement
- **Validation:** ≥40% return within 30 days by Sprint 4, toggle feature fallback if gov rejection
- **Success Probability:** 85% (high)

**Market Context - 8 Competitive Gaps Identified:**

1. Government-Only Verification → Community Verification
2. Report-Only Interface → Action Coordination
3. Single-Tenant Focus → Multi-Org Native
4. Data Silos → Open API + Radical Transparency
5. Government Direct Sales → Trojan Horse Strategy
6. Generic Civic → Environmental Domain Expertise
7. No Incentives → Gamification + Reputation
8. Government-Centric Language → Community-First Framing

**Innovation Risk Matrix:**

- Highest Risk: Trojan Horse GTM (60% confidence, core business model at risk)
- Mitigation: Monthly demand signal tracking, pivot decision at Month 9
- Lowest Risk: Gamification (85% confidence, proven in iNaturalist)

**Validation Timeline:**

- Month 3: Verification accuracy check (≥90%)
- Month 4: Action Card effectiveness (≥50% resolution)
- Month 6: Trojan Horse demand signals (≥1 gov inquiry)
- Month 9: Pivot decision point (≥3 gov pilots or hybrid sales)
- Month 12: Full validation (all 4 innovations proven or mitigated)

---

### ✅ Step 7: Web Application Specific Requirements

**5 Web Architecture Strategic Decisions:**

**1. Rendering Strategy: Hybrid Next.js 15 with React Server Components**

- Server-rendered: Landing, issue pages, org profiles, transparency (SEO + performance)
- Client-side interactive: Map, report flow, dashboards (Leaflet + real-time)
- Hybrid: Issue lists, verification queue (SSR shell + client hydration)
- Competitive advantage: 40-60% smaller bundles, 2-5x faster than competitors

**2. Browser Support: Modern Evergreen Only**

- Supported: Chrome/Edge 120+, Safari 17+, Firefox 120+ (last 2 versions)
- NOT supported: IE11 (dead), Safari <17 (<2% usage), old Android WebView
- Rationale: Modern devices self-select (camera + GPS required), legacy = 2-3x dev cost for <5% users
- Future-proofing: WebAssembly, WebGPU, CSS Container Queries

**3. Real-Time Strategy: Supabase Realtime (WebSocket) + Polling**

- Real-time (3 use cases): Verification → NGO dashboard, volunteer joins, gov assignment (50ms latency)
- Polling (3 use cases): Map updates (30s), dashboard metrics (5s), issue lists (10s)
- Cost efficiency: <$50/month for 1000 concurrent users (strategic real-time only)
- Competitive advantage: Instant coordination vs. 311's 24-hour refresh

**4. Performance Targets: Core Web Vitals "Good" Thresholds**

- LCP <2.5s: Next.js Image optimization, Supabase CDN, code splitting, lazy loading
- FID <100ms / INP <200ms: Defer non-critical JS, RSC reduces bundles, no long tasks >50ms
- CLS <0.1: Reserve image space, no dynamic ads, skeleton loaders, font loading optimization
- Additional: Map <1s (1000 pins), Dashboard <2s, Mobile 3G <5s, PWA installable
- Monitoring: Lighthouse CI on every deploy, Real User Monitoring via Vercel Analytics

**5. SEO Strategy: Selective Indexing for Transparency**

- Indexed: Individual verified issues (journalist discovery), org profiles (donor discovery), transparency dashboards (press coverage)
- NOT indexed: User profiles (privacy), anonymous pending reports (spam protection), internal dashboards (authentication required)
- Technical: Next.js dynamic metadata, sitemap generation, canonical URLs, Schema.org markup
- Competitive advantage: Government responsiveness publicly searchable (311 systems hide behind logins)

**Responsive Design:**

- Mobile-first breakpoints: 320-767px (primary, 70% traffic), 768-1023px (15%), 1024px+ (15%)
- Touch-optimized: 44x44px tap targets, camera integration, geolocation auto-fill, bottom navigation
- Desktop enhancements: Multi-column dashboards, keyboard shortcuts, hover states

**Accessibility Implementation:**

- Semantic HTML: Proper heading hierarchy, landmark regions, form labels, button/link semantics
- Keyboard navigation: Tab-focusable elements, focus indicators, skip links, modal focus traps
- Screen readers: ARIA labels, live regions, describedby hints, hidden decorative images
- Color contrast: 4.5:1 text, 3:1 interactive, automated axe DevTools testing

**Technology Stack:**

- Framework: Next.js 15 with App Router (RSC)
- Backend: Supabase (PostgreSQL 15+, Auth, Storage, Realtime)
- Hosting: Vercel (edge functions, preview deployments, analytics)
- Maps: Leaflet 1.9+ with MarkerCluster
- Styling: Tailwind CSS 4.0
- UI: Radix UI primitives (accessible by default)

---

## Key Metrics & Targets Summary

**User Success:**

- Community: +5 points/proof, 90% valid verifications
- NGO: 10hrs→1hr/month time savings
- Government: 91% resolution within 7 days

**Business Success:**

- Year 1: $300k ARR (100 NGOs @ $49-99/mo + 10 Gov @ $499+/mo)
- Conversion: 10-20% free → paid NGO
- Retention: >85% annual
- CAC: <$500 per customer (Trojan Horse reduces CAC vs. traditional govtech)

**Technical Success:**

- Performance: <1s map, <2s dashboard, <5s mobile 3G
- Data: Zero data loss, <0.1% export error
- Scale: 10,000 concurrent users Phase 1
- Security: SOC 2 Type II compliance
- Accessibility: WCAG 2.1 AA (Section 508 mandatory)

---

## Strategic Positioning Summary

**Blue Ocean Differentiation:**

- We're NOT "better 311 system" - we're creating new category: "Distributed Environmental Action Platform"
- 8 gaps identified in 13+ competitor platforms create wide Blue Ocean moat
- Community verification + Action Cards + Multi-org native = unique combination

**Trojan Horse Go-to-Market:**

- Phase 1: NGOs adopt (fast, no procurement, generate data)
- Phase 2: Government sees data value (passive demand generation)
- Phase 3: Government pilots (inbound sales, short cycle)
- Phase 4: Enterprise contracts (proof before purchase)

**Competitive Advantages:**

1. **Speed:** 3-5x faster load times (Next.js 15 vs. legacy frameworks)
2. **Transparency:** Public API + SEO (vs. proprietary data silos)
3. **Accessibility:** WCAG 2.1 AA from Sprint 1 (competitors fail audits)
4. **Innovation:** Community verification (no competitor has this)
5. **Pricing:** $499/mo gov tier (vs. $50k+/yr enterprise platforms)

---

## Implementation Readiness

**Ready for Handoff:**

- Winston (Architect) can design technical architecture from web requirements + user journeys
- Bob (Scrum Master) can create epics/stories from 8 user journeys + requirement summaries
- Sally (UX Designer) can design flows from journey narratives + accessibility requirements
- Amelia (Developer) can implement with clear tech stack + performance targets

**Validation Gates:**

- Sprint 2: Accessibility audit (axe DevTools), privacy review (attorney)
- Sprint 4: Government pilot (Oakland Public Works), load testing (1000 issues)
- Month 3: Verification accuracy check (≥90%)
- Month 9: Trojan Horse pivot decision (≥3 gov pilots or hybrid sales)

**Risk Mitigations Defined:**

- Innovation validation metrics with fallback plans
- Monthly demand signal tracking for GTM strategy
- Performance budgets enforced via Lighthouse CI
- Accessibility regression testing (automated + manual quarterly)

---

## Next Steps

**Remaining PRD Steps (4 of 11):**

- **Step 8: Scoping** - Define MVP boundaries, feature prioritization, phasing strategy
- **Step 9: Functional Requirements** - Detailed feature specs derived from journeys
- **Step 10: Non-Functional Requirements** - Performance, security, scalability deep dive
- **Step 11: Final Review** - Completeness check, stakeholder sign-off

**After PRD Completion:**

1. Winston creates Technical Architecture Document (system design, data model, API specs)
2. Bob creates Epics & User Stories (Sprint 1-4 breakdown, acceptance criteria)
3. Sally creates UX/UI designs (wireframes, prototypes, design system)
4. Sprint 0: Dev environment setup, Supabase configuration, Next.js scaffolding
5. Sprint 1: Core reporting + map with accessibility

---

## Document Quality Indicators

**Completeness:**

- ✅ 8 user personas with detailed narrative journeys (1,000+ lines)
- ✅ Innovation validation with risk mitigation (4 innovations, metrics, fallbacks)
- ✅ Govtech compliance (6 domain concerns, MVP/Phase 2 split)
- ✅ Web architecture (5 decisions with strategic rationale)

**Implementability:**

- ✅ Specific tech stack with version numbers (Next.js 15, Supabase PostgreSQL 15+)
- ✅ Measurable targets (≥90% verification accuracy, <1s map load, $300k ARR)
- ✅ Clear validation gates (Sprint 2 audit, Sprint 4 pilot, Month 9 pivot decision)

**Strategic Alignment:**

- ✅ Blue Ocean positioning validated via 13+ platform competitive analysis
- ✅ Trojan Horse GTM with demand signal tracking and pivot criteria
- ✅ Accessibility-first approach (competitive moat, government requirement)

**Stakeholder Value:**

- For Winston (Architect): Clear technical constraints, performance targets, integration requirements
- For Bob (Scrum Master): Journey-derived requirements, acceptance criteria foundations, sprint priorities
- For Sally (UX Designer): User flows, accessibility requirements, responsive breakpoints
- For Victor (Innovation Strategist): Validation metrics, risk mitigation, market positioning
- For Ali (Founder/User): Comprehensive blueprint for $300k ARR Year 1, government-ready platform

---

## Session Achievements

**What We Built:**

- Transformed 18-section product brief into 2,200-line government-ready PRD
- Validated 4 innovations with metrics, fallbacks, and risk mitigation
- Defined 8 user journeys revealing 150+ specific requirements
- Documented govtech compliance for Section 508, CCPA, SOC 2, transparency
- Architected modern web platform with Core Web Vitals compliance

**Key Decisions Made:**

- 2 categories (not 5), 3 roles (not 5), all fields required
- NGO Dashboard priority over government admin (Sprint 3 vs. Phase 2)
- User Profiles in Sprint 2 (not deferred)
- Float8 geolocation (pragmatic MVP), database Action Cards (6 templates)
- Section 508 accessibility from Sprint 1 (non-negotiable)
- Modern browsers only (no IE11, no legacy Android)
- Strategic real-time for 3 use cases, polling for rest

**Strategic Insights:**

- Blue Ocean validated: No competitor combines Action Cards + Community Verification + Multi-Org Native
- Trojan Horse risk identified: 60% confidence, pivot criteria at Month 9
- Accessibility as moat: Competitors fail audits, we pass from Sprint 1
- Speed as advantage: 3-5x faster than legacy platforms = retention driver

**Next Milestone:**
Complete Steps 8-11 (Scoping, Functional Requirements, Non-Functional Requirements, Final Review) to reach 100% PRD completion and hand off to Winston for Technical Architecture.

---

**Total PRD Progress: 64% Complete (7 of 11 steps)**
**Estimated Time to Complete:** 2-3 hours (Steps 8-11)
**Document Quality:** Production-ready for architecture and sprint planning handoff
