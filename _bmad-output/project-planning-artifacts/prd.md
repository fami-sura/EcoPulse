---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
inputDocuments:
  - 'README.md'
  - 'strategic-decisions.md'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 1
  projectDocs: 0
workflowType: 'prd'
lastStep: 10
project_name: 'ecoPulse'
user_name: 'Aliahmad'
date: '2025-12-17'
---

# Product Requirements Document - ecoPulse

**Author:** Aliahmad
**Date:** 2025-12-16

---

## Executive Summary

### Product Vision

EcoPulse is a **distributed environmental action platform** designed for **African communities** in Sub-Saharan Africa that transforms hyperlocal environmental issues (litter hotspots, blocked drainage) into structured, trackable, and verifiable community-driven solutions. We close the accountability loop: **Report → Action Plan → Fix → Proof → Verification → Insights**.

Unlike Western 311 civic tech platforms that assume constant internet access, high literacy, and responsive government systems, EcoPulse **empowers African communities as active change-makers** in contexts where government trust is low and infrastructure is limited. We provide immediate Action Cards with safe, realistic steps—while building trust through community-driven verification with before/after photo proof.

**Why Africa-First Design Matters:**

- **Low government trust**: Communities verify outcomes, not distant bureaucracy
- **Limited internet access**: Mobile-first with offline capability (3G/4G optimization)
- **Icon-driven interface**: Works for communities with varying literacy levels
- **Tangible impact**: Community sees real change (kg trash removed), not abstract metrics
- **NGO-native**: Local NGOs and community groups are primary coordinators, not government

### What Makes EcoPulse Special

**1. Action Cards with Safety Guidance**
Every report immediately generates a deterministic action plan with:

- Quick Steps (3-6 actionable items)
- Safety Notes (category-specific warnings)
- Contact Templates (WhatsApp/email pre-fills for escalation)
- Who to Contact (from configurable directory)

_Unlike SeeClickFix/FixMyStreet which say "report and wait," we say "report and here's how YOU can help safely."_

**2. Community-Driven Verification**
Second-person verification with before/after photos builds distributed trust:

- Verifier cannot be the same user who submitted proof (objectivity)
- Photo evidence is irrefutable (not just "closed" status)
- Community validates outcomes, not distant bureaucracy

_This works especially well in regions with low institutional trust—trust is social, not bureaucratic._

**3. Multi-Org Native Architecture**
Government agencies, NGOs, schools, and community groups collaborate as first-class citizens:

- Organization-level dashboards with verified outcomes
- CSV exports for donor reporting (NGO differentiator)
- Audit logs and transparency by default
- Data sovereignty with self-hosting capability (Phase 2)

_NGOs aren't guests—they're co-owners of the platform with equal access to verified data._

**4. Environmental Domain Expertise**
Focused on 2 MVP categories (Waste/Litter + Drainage/Flood Risk) with category-specific templates:

- Drainage gets flood-risk safety notes
- Waste gets recycling guidance and disposal point info
- Future categories: Urban Heat, Water Issues, Air/Smoke (Phase 2)

_We're not generic issue tracking—we understand environmental response workflows._

**5. Quality-First Reporting**
Required fields (category, location, severity, photo, note) ensure every report is actionable:

- Inline validation with helpful prompts
- 60-second target for speed + accuracy (not shortcuts)
- Progress indicator during upload maintains confidence

_Organizations trust our data because we enforce quality at submission._

**6. Community Motivation with Verified Impact**
Tangible impact messaging replaces traditional gamification:

- "You saved 15 kg of waste!" instead of generic points
- "Your neighbor cleared 3 drainage blockages!" - community celebration
- User profiles show personal impact stats (contributions, verified outcomes, community impact)
- NO points, NO leaderboards - focus on real environmental change

_Unlike Litterati (gamification without government) or SeeClickFix (government without gamification), we focus on verified tangible outcomes that motivate through community impact visibility._

---

## Project Classification

**Technical Type:** web_app (mobile-first responsive design)  
**Domain:** govtech (Government Technology / Civic Tech)  
**Complexity Level:** HIGH

**Complexity Drivers:**

- Multi-organization collaboration with RBAC and audit requirements
- Government/NGO integration needs procurement and security standards
- Geospatial data handling with privacy considerations
- Anonymous + authenticated user flows with moderation
- Verification system requiring trust and data integrity
- Real-time collaboration across stakeholder groups

**Govtech-Specific Concerns:**

- **Data ownership and transparency** - Organizations own their data, exportable as CSV/JSON
- **Accessibility standards** - Section 508 compliance for government use (WCAG 2.1 AA)
- **Privacy regulations** - Anonymous reporting with photo metadata stripping
- **Integration with existing systems** - API-first design for future 311 system integrations (Phase 2)
- **Multi-jurisdiction handling** - Different municipalities with different workflows (configurable Contact Directory)
- **Data sovereignty** - Self-hosting architecture (Supabase supports this) for governments requiring data to stay in-country

---

## Strategic Positioning (Blue Ocean)

### Competitive Landscape

**Analyzed Platforms:**

- **Western Civic Tech:** SeeClickFix, FixMyStreet, PublicStuff, Accela, GovPilot (13+ platforms)
- **African Civic Tech:** U-Report (UNICEF), mWater, Kobo Toolbox, Ushahidi (Kenya-based)
- **Community Engagement:** Nextdoor, iNaturalist, Litterati
- **Emerging Tech:** CIVIC AI, Blockchain Environmental Tracking

**African Civic Tech Landscape:**

**U-Report (UNICEF):**

- **Strength:** SMS-based, 20M+ users across 91 countries, works on feature phones
- **Weakness:** Polling/surveys only (not issue reporting), no verification system, no Action Cards
- **Gap:** No photo proof, no before/after verification, no community coordination

**mWater:**

- **Strength:** Water quality monitoring, offline-capable, used by NGOs in 50+ countries
- **Weakness:** Domain-specific (water only), no waste/drainage, requires trained surveyors
- **Gap:** Not designed for community members, complex data collection forms

**Ushahidi (Kenya):**

- **Strength:** Crisis mapping, SMS reporting, African-founded, used in 160+ countries
- **Weakness:** Generic incident reporting, no verification, no Action Cards, dated UX
- **Gap:** No community-driven resolution loop, no NGO coordination workflows

**Kobo Toolbox:**

- **Strength:** Offline surveys, humanitarian focus, free for NGOs
- **Weakness:** Survey tool (not civic engagement), no public map view, no gamification
- **Gap:** Researcher-focused, not community-facing platform

### Critical Gaps We're Filling

**African Market Gaps:**

| Competitor Gap                                                                            | EcoPulse Solution                                                                                 |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **SMS-Only or App-Only** - U-Report has SMS but no photos, others require smartphone apps | **Mobile-First Web App** - Works on any smartphone browser, no download required, photos included |
| **No Photo Verification** - African civic tech lacks visual proof systems                 | **Community Photo Verification** - Before/after photos with multi-verifier trust system           |
| **No Community Action** - Platforms stop at reporting, no coordination                    | **Action Cards** - NGOs organize community cleanups with volunteer coordination                   |
| **Western-Centric Design** - Assume constant internet, high literacy, government trust    | **Africa-First Design** - 3G optimization, icon-driven UI, NGO-native coordination                |
| **No NGO Workflows** - Built for government only or community only                        | **NGO Dashboard** - Funder-ready exports, verified outcomes, volunteer management                 |
| **Generic Issue Tracking** - All problems treated equally                                 | **Environmental Domain Expertise** - Waste/drainage specific workflows and safety guidance        |
| **No Donor Reporting** - Can't export verified impact data                                | **CSV Exports** - Verified resolutions with before/after photos for donor reports                 |
| **Outdated UX** - Ushahidi feels like 2010 software                                       | **Modern React/Next.js** - Fast, mobile-optimized, icon-driven interface                          |

**Universal Civic Tech Gaps (Western + African):**

| Gap                                                                     | Solution                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Report and Forget** - Citizens report, then wait                      | **Action Cards** - Immediate community empowerment                  |
| **Government-Only Verification** - "Closed" status requires blind trust | **Community Verification** - Second-person validation with photos   |
| **Low Data Quality** - Text-only, photos optional                       | **Required Photo + Note** - Every report has visual evidence        |
| **Gamification Without Impact** - Points with no real change            | **Verified Closed-Loop** - Points for verified resolutions only     |
| **Enterprise Pricing** - $50k-$500k/year excludes African NGOs          | **Affordable SaaS** - $49-99/month, adjusted for African market PPP |

**Key Insight:** EcoPulse is not "African version of SeeClickFix." We're fundamentally different:

- **SeeClickFix:** Western 311 ticketing for government efficiency
- **EcoPulse:** African community action platform for distributed environmental impact in low-trust contexts

---

## Go-To-Market Strategy: Trojan Horse

### Primary Market: Nigerian NGOs First

**Why Nigerian NGOs:**

- Fast decision-making (no government procurement red tape)
- Motivated users (need verified data for donor reports - critical for international funding)
- Government influence (NGO success with community data → government/donor interest)
- Strong civil society presence in Lagos, Kano, Abuja, Port Harcourt
- Used to working with limited government support

**Target Cities (Phase 1):**

- **Lagos**: Population 15M+, waste management crisis, strong NGO ecosystem
- **Kano**: Population 4M+, drainage/flood issues, active community groups
- **Abuja**: Capital city, government/NGO presence, donor visibility
- **Port Harcourt**: Oil region, environmental concerns, corporate CSR funding

**Pricing (Nigerian Market):**

- $49-99/month for dashboard, CSV exports, contact directory, moderation tools
- Adjusted for purchasing power parity (₦35,000-70,000/month at ₦750/$1)
- Free tier for small community groups (<50 verified reports/month)

### Secondary Market: Government Agencies & International NGOs

**Entry Point:** After Nigerian NGO success proves community impact
**Positioning:** "Community environmental action platform with verified outcomes" (not 311 replacement)
**Emphasis:** Donor-ready reporting, community trust verification, transparency

**Pricing:** $499+/month for multi-org coordination, API access, custom branding, SLA support

### Revenue Target

**Year 1:** $150k ARR with 80 organizations (adjusted for African market)

- 60 Nigerian NGOs @ $49-99/mo = $35k-$70k/year
- 10 International NGOs (UNICEF, UNDP, etc.) @ $499/mo = $60k/year
- 5 Government agencies @ $800/mo (custom, Nigerian pricing) = $48k/year
- Geographic expansion: Kenya, Ghana, South Africa (Year 2)

---

## MVP Scope Refinements (Party Mode Decisions)

### Categories: 2 Only (Waste/Litter + Drainage/Flood Risk)

**Rationale:** Highest-ROI proof points for African communities—visible, verifiable, clear before/after states

- **Waste/Litter:** Critical issue in Lagos (LAWMA overload), Kano markets, Port Harcourt streets
- **Drainage/Flood Risk:** Lagos flooding during rainy season, Kano drainage blockage during Harmattan
  **Deferred to Phase 2:** Urban Heat, Water Issues (contamination), Air/Smoke (generator fumes)

### Roles: 3 Simplified (from 5)

**MVP Roles:**

1. **Anonymous/Public** - Browse map, view issues, submit reports (rate-limited), share
2. **Authenticated Member** - Submit proof, verify others' proofs, join teams, earn points
3. **Admin** - Review flags, hide/unhide, mark duplicates, org dashboard, CSV exports

**Deferred to Phase 2:** Org Staff vs Org Admin split, Moderator as separate role

### Tech Stack Locked

- **Frontend:** Next.js 15
- **Backend/Database:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Maps:** Leaflet + OpenStreetMap (data sovereignty, free)
- **Geolocation:** float8 (double precision lat/lng with GiST index for spatial queries)
- **Action Cards:** Database table (6 templates: 2 categories × 3 severities)

### Sprint Prioritization

**Sprint 1:** Core reporting + Map (2 categories, anonymous + auth, issue detail pages)
**Sprint 2:** Verification flow + User Profiles (points, contributions, personal impact stats)
**Sprint 3:** NGO Dashboard (/org/dashboard route with CSV exports, verified outcomes)
**Sprint 4:** Polish + Contact Directory + anti-spam tuning

**Phase 2:** Government admin panel (full RBAC), 311 integration API, self-hosting deployment, additional categories

---

## Architecture Requirements

### Data Sovereignty & Compliance

- **Multi-org data isolation:** Supabase Row-Level Security (RLS) policies
- **Export-ready data model:** PostgreSQL COPY TO for CSV generation
- **API-first design:** tRPC with OpenAPI codegen for future 311 integrations
- **Self-hosting capability:** Architect for Supabase self-hosting (build in Phase 2)
- **Audit logs:** All actions tracked (org_id, actor, action, target, metadata, timestamp)

### Security & Privacy

- **Photo metadata stripping:** Remove EXIF GPS data before storage
- **Anonymous rate limiting:** Per device/session/IP to prevent spam
- **RBAC:** Row-Level Security enforces org boundaries and role permissions
- **Input validation:** Server-side validation of coordinates, photo sizes, text lengths

### Performance & Scalability

- **Map clustering:** Client-side clustering for 1000+ pins without lag
- **Geospatial indexing:** GiST index on (lat, lng) for "near me" queries
- **Materialized views:** Pre-computed KPIs for org dashboards (refreshed hourly)
- **CDN:** Supabase Storage with automatic image optimization

---

## Success Criteria (KPIs)

### MVP Goals

- Median report submission time **< 60 seconds**
- **≥ 30%** issues move from Open → In Progress
- **≥ 10-15%** reach Resolved with Verification
- **≥ 20%** of active users join a team or follow a local area
- Spam/duplicate rate **< 5-10%** with moderation

### Business Metrics (Year 1)

- **100+ NGO organizations** signed up ($49-99/month tier)
- **20+ municipalities** using platform
- **$300k ARR** achieved
- **5,000+ verified resolutions** showcased for donor reporting

### User Engagement

- **Weekly Active Users (WAU):** 5,000+ community members
- **Verification Rate:** 15% of resolved issues get second-person verification
- **CSV Exports:** 50+ NGOs export data monthly for donor reports
- **Team Participation:** 1,000+ users in teams with 50+ teams active

---

## Non-Goals (MVP)

- Not an emergency-response system (persistent safety banner directs to emergency services)
- No hardware sensor integrations (AQI devices, IoT)
- No advanced case management (multi-stage workflows, SLAs, procurement)
- No full public transparency portal for agencies (Phase 2+)
- No AI-enhanced features (duplicate detection, title generation deferred to Phase 2)

---

## Success Criteria

### User Success

**Community Members - "Worth It" Moments:**

- **Primary:** User uploads proof photo and earns 5 points (gamification reward + visible impact)
- **Report submission:** Median time **< 60 seconds** (speed + quality maintained)
- **Action engagement:** **≥ 30%** of reported issues move from Open → In Progress (users take action, not just report)
- **Proof submission:** **≥ 15%** of In Progress issues receive proof uploads (users follow through to completion)
- **Social engagement:** **≥ 20%** of active users join a team (community building)

**NGO Coordinators - Time Saved & Impact Proven:**

- **Primary:** Time saved from **10 hours/month → 1 hour/month** on impact tracking (90% time reduction)
- **Export usage:** **≥ 50 NGOs** export CSV data monthly for donor reporting
- **Verified outcomes:** **5,000+ verified resolutions** available for donor pitches in Year 1
- **Dashboard adoption:** **≥ 80%** of paying NGO tier users access dashboard weekly

**Verification Success - Quality Trust:**

- **Primary:** **≥ 90%** of verifications are VALID (not spam rejections) - maintains trust in system
- **Verification rate:** **10-15%** of resolved issues receive second-person verification
- **Verification speed:** Average time from "Resolved Unverified" → "Verified" **< 48 hours** (rapid community validation)
- **Abuse rate:** Spam/duplicate reports **< 5-10%** with moderation (clean data maintained)

---

### Business Success

**Revenue Targets (Year 1 - African Market):**

- **Total ARR:** $150k with 80 organizations (adjusted for purchasing power parity)
  - 60 Nigerian NGOs @ $49-99/month = $35k-$70k/year
  - 10 International NGOs (UNICEF, UNDP, Ford Foundation) @ $499/month = $60k/year
  - 5 Government agencies (Lagos State, Kano State, FCT Abuja) @ $800/month = $48k/year

**Conversion & Retention:**

- **Freemium conversion:** **10-20%** of free-tier Nigerian NGOs convert to paid within 90 days
- **Free tier base:** 300-500 free-tier organizations actively using platform (funnel for paid conversion)
- **Annual retention:** **≥ 80%** retention rate for paying organizations (Year 1 target, accounting for NGO funding volatility)
- **Time to first value:** NGOs see value (first verified resolution in their dashboard) within **4-7 days** of signup

**User Engagement:**

- **Weekly Active Users (WAU):** 3,000+ community members actively reporting/verifying (Lagos, Kano, Abuja)
- **Team participation:** 500+ users in teams with 30+ teams actively contributing
- **Geographic spread:** Active usage in **≥ 3 Nigerian cities** by end of Year 1 (Lagos, Kano, Abuja minimum)

**Market Validation:**

- **NGO referrals:** **≥ 25%** of new NGO signups come from referrals (product-market fit indicator)
- **Government pilots:** **≥ 2 Nigerian government agencies** (state/LGA level) complete pilot programs and convert to paid
- **International donor visibility:** **≥ 3 international NGOs/donors** (USAID, DFID, GIZ) using platform data in their programs

### Technical Success

**Performance (Non-Negotiable):**

- **Map load time:** **< 1 second** with 1,000 pins displayed (client-side clustering + optimization)
- **Report submission:** End-to-end submission (including photo upload) **< 10 seconds on 3G** connection
- **Page load:** All pages **< 2 seconds** on 4G mobile (mobile-first requirement)
- **Uptime:** **99.9% availability** (downtime < 9 hours/year) via Supabase infrastructure

**Data Integrity (Zero Tolerance):**

- **Data loss:** **Zero tolerance** - verification photos, reports, proof data must NEVER be lost
- **Export accuracy:** **< 0.1% error rate** on CSV exports (NGO donor trust depends on this)
- **Verification integrity:** Second-person verification rules enforced 100% (verifier ≠ submitter)
- **Audit logs:** 100% of admin actions logged (org_id, actor, action, timestamp, metadata)

**Security & Privacy:**

- **EXIF stripping:** 100% of uploaded photos have GPS metadata stripped before storage
- **Rate limiting:** Anonymous spam reports blocked at **< 5%** of total submissions
- **RLS enforcement:** Multi-org data isolation via Supabase Row-Level Security - zero data leaks between orgs
- **Photo storage:** Images served via CDN with automatic optimization (< 200KB per image)

**Scalability:**

- **Geospatial queries:** "Near me" queries **< 500ms** with GiST index optimization
- **Dashboard KPIs:** Org dashboard loads **< 2 seconds** using materialized views (refreshed hourly)
- **Concurrent users:** Support **1,000 concurrent users** without degradation (load testing validation)

**Accessibility & Compliance (Govtech Requirement):**

- **WCAG 2.1 AA compliance:** All pages meet accessibility standards for government use
- **Mobile responsive:** 100% feature parity between mobile/desktop (mobile-first design)
- **Data export:** Organizations can export ALL their data as CSV/JSON on demand (data sovereignty)

---

### Measurable Outcomes (Definition of Success)

**3-Month Milestones:**

- ✅ MVP launched with 2 categories (Waste/Litter + Drainage)
- ✅ 500+ community members registered
- ✅ 100+ verified resolutions completed
- ✅ 10 NGOs signed up (5 paying @ $49-99/month)
- ✅ Average report submission time < 60 seconds validated
- ✅ Map performance < 1 second with 200+ pins validated

**6-Month Milestones:**

- ✅ 2,000+ community members active (WAU: 1,000+)
- ✅ 1,000+ verified resolutions completed
- ✅ 50 NGOs signed up (30 paying)
- ✅ 3 municipalities piloting platform
- ✅ CSV exports being used by 20+ NGOs for donor reporting
- ✅ 10-15% verification rate achieved
- ✅ NGO time saved validated: 10 hours → 1 hour/month

**12-Month Milestones (End of Year 1 - African Market):**

- ✅ 3,000+ community members active in Nigeria (WAU: 3,000+)
- ✅ 3,000+ verified resolutions completed across Lagos, Kano, Abuja
- ✅ 60 Nigerian NGOs paying @ $49-99/month ($35k-$70k ARR)
- ✅ 10 International NGOs @ $499/month ($60k ARR)
- ✅ 5 Nigerian government agencies @ $800/month ($48k ARR)
- ✅ **$150k ARR achieved** (African market adjusted)
- ✅ 80% annual retention rate maintained (accounting for NGO funding cycles)
- ✅ Active usage in 3+ Nigerian cities (Lagos, Kano, Abuja minimum)
- ✅ 25% of new NGO signups from referrals (product-market fit)
- ✅ 3+ international donors/NGOs using platform data in their programs

---

## Product Scope

### MVP - Minimum Viable Product (Sprints 1-4, ~8-12 weeks)

**Core Features (Must Have):**

- ✅ Issue reporting (anonymous + authenticated, required fields: category, location, severity, photo, note)
- ✅ Action Cards (6 templates: 2 categories × 3 severities, database-driven)
- ✅ Map with clustering + filters (Leaflet + OpenStreetMap)
- ✅ Proof submission (after photo required, before photo optional)
- ✅ Second-person verification (verifier ≠ submitter, photo validation)
- ✅ User profiles (points, contributions, personal impact stats)
- ✅ NGO Dashboard (KPIs, CSV exports, team performance, verified outcomes)
- ✅ Contact Directory (who-to-contact per category/region)
- ✅ Moderation queue (flags, hide/unhide, mark duplicates)
- ✅ Teams + points system (gamification with verified closed-loop)

**Categories (MVP):**

- Waste & Litter
- Drainage / Flood Risk

**Roles (MVP):**

- Anonymous/Public User
- Authenticated Member
- Admin

**Tech Stack:**

- Next.js 15 + Supabase + Leaflet + OpenStreetMap + float8 geolocation

**Success Validation:**

- User can report → get Action Card → fix → upload proof → another user verifies
- NGO can access dashboard, see verified outcomes, export CSV for donor report
- Admin can moderate flags, hide spam, export data

---

### Growth Features (Post-MVP, Phase 2)

**Additional Categories:**

- Urban Heat / No Shade
- Water Issues (leaks, dirty points)
- Air / Smoke / Noise

**Enhanced Roles & RBAC:**

- Org Staff vs Org Admin split
- Moderator as separate role
- Super Admin (platform-level)

**Government Features:**

- Full government admin panel with SLA-based case management
- Work orders: assign to field team, schedule visits, attach documents
- Multi-org collaboration: inter-org handoffs, shared issues with permissions

**Integrations:**

- 311 system API integration (SeeClickFix, Accela, PublicStuff)
- WhatsApp bot intake for reports
- Email ingestion for offline reporting
- SMS notifications for status updates

**Advanced Features:**

- AI-powered duplicate detection
- Smart prioritization algorithms
- Auto-generated titles and summaries
- Sentiment analysis on community feedback

**Data & Transparency:**

- Public transparency portal ("Resolved this month" showcase)
- GIS layers (flood zones, waste bins, drainage infrastructure)
- Advanced analytics (heatmaps, trend analysis, predictive hotspots)

---

### Vision (Future, 18-24 months)

**Global Scale:**

- Self-hosting deployment option for governments (data sovereignty)
- Multi-language support (10+ languages)
- Regional adaptation (different waste/drainage systems by country)

**Impact Measurement:**

- Carbon impact calculator (tons of waste diverted, emissions reduced)
- Water quality improvement tracking
- Flood prevention impact modeling

**Ecosystem:**

- Open-source community verification module (developer advocates)
- Partnership marketplace (connect NGOs with corporate sponsors)
- Impact investment platform (fund community environmental projects)

**Advanced Govtech:**

- Blockchain-backed verification for immutable trust records
- Inter-city collaboration network (share best practices, aggregate data)
- Policy recommendation engine (AI suggests policy changes based on verified data)

**Business Vision:**

- $3M ARR by Year 3 (1,000 organizations paying)
- Expansion to 20+ countries with localized versions
- Partnership with UN/World Bank for global environmental monitoring

---

## User Journeys

### Journey 1: Amara's Report - The Community Leader

**Opening Scene:**
Amara Okafor, a 36-year-old primary school teacher in Lagos, is walking home from work through her Surulere neighborhood on a Thursday afternoon. Near the community primary school where she teaches, she spots an overflowing waste bin with garbage scattered across the drainage channel. Children from her school play nearby after classes, and she worries about waterborne diseases and the flooding that happens every rainy season when drains are blocked.

**Rising Action:**
She pulls out her phone (a 2-year-old Android smartphone) and opens EcoPulse. The map immediately shows her location in Surulere. She taps "Report Issue" and the camera opens - she takes a photo of the overflowing bin and blocked drain. The app suggests "Waste/Litter" category, which she confirms. She adds a note: "Overflowing bin at community school - drain blocked, children play here, will flood when rain comes." She marks severity as "High" because of the school proximity and flood risk.

**Climax:**
Amara submits the report. Instantly, a pin appears on the map at her exact location. A notification shows "+5 points earned for helping your community!" She sees the issue is now visible to everyone - her neighbors, local NGOs, LAWMA (Lagos Waste Management Authority), and community development associations.

**Resolution:**
That evening, Amara opens the app again. Two neighbors have already verified her report with photos showing the same overflowing bin from different angles. Her report has 2 verifications and 12 upvotes. The Lagos Environmental Action Network (an NGO) has assigned an Action Card: "Organize community cleanup - Saturday 8am before market opens." Amara signs up as a volunteer. Four days later, she gets a notification: "Your issue has been addressed! The community cleared the drain and LAWMA replaced the bin." She uploads a "proof of completion" photo showing the cleared drain and new bin. +5 more points.

**Requirements Revealed:**

- Mobile-first map interface with auto-location (works on 3G/4G networks)
- Single-tap issue reporting with camera integration
- Category suggestions (smart defaults)
- Required fields: photo, note, location, severity
- Real-time pin visualization (when online, cached when offline)
- Points/gamification system (+5 for report, +5 for proof)
- Verification by other community members
- Action Card assignment by NGOs
- Volunteer sign-up for organized actions
- Issue status tracking (open → assigned → resolved)
- Proof of completion workflow
- Notifications for issue updates (email + push notification)

---

### Journey 2: Ibrahim's Action - The University Student

**Opening Scene:**
Ibrahim Musa, a 21-year-old Environmental Science student at the University of Lagos (UNILAG), opens EcoPulse while sitting in the campus library. He's looking for ways to earn community service hours required for his program. The map shows dozens of issues reported around Yaba, Akoka, and nearby Bariga neighborhoods.

**Rising Action:**
He filters the map to "Waste/Litter" and sees a cluster of 6 verified reports near the Yaba-Tejuosho Market area. One report has 18 upvotes and 3 verifications - clearly a community priority. He clicks on it and sees an Action Card created by "Lagos Environmental Action Network" NGO: "Coordinate drainage clearing - need 8 volunteers - Saturday 7am (before market opens)." The card includes a detailed plan: bring work gloves, boots (water in drains), tools will be provided, meet at Tejuosho Bus Stop.

Ibrahim taps "I'll help with this action." He joins a team of 8 volunteers who have already signed up. The app shows him the team member profiles and phone numbers (so they can coordinate via WhatsApp group).

**Climax:**
On Saturday, Ibrahim and the team meet at the location. They spend 3 hours clearing debris from drainage channels. Ibrahim uses EcoPulse to document their work - he takes 5 photos showing before/during/after states. He uploads them as "proof of action" and tags all 8 team members.

**Resolution:**
The proof photos are automatically attached to all 6 related issue reports. Each issue status changes to "resolved." Ibrahim receives +15 points (5 for participation, 10 bonus for uploading proof). He gets a notification: "Lagos Environmental Action Network thanks you! 3 volunteer hours logged to your profile." His student profile now shows 3 hours contributed this month. He receives a message from the NGO coordinator asking if he'd like to lead the next cleanup action at UNILAG campus.

**Requirements Revealed:**

- Map filtering by category/status
- Issue clustering visualization
- Action Card detailed view (what/when/where/who)
- Team volunteer sign-up with capacity limits
- Volunteer profile pages
- Phone number visibility for WhatsApp coordination (no in-app chat needed)
- Multi-photo proof upload workflow
- Tag team members in proof submissions
- Bulk issue resolution (one proof → many issues)
- Points with bonus structure
- Volunteer hour tracking and certification
- Profile analytics (hours contributed per month)
- NGO-to-volunteer messaging (email notifications)
- Leadership/role progression paths
  On Saturday, James and the team meet at the location. They spend 2 hours cleaning debris from storm drains. James uses EcoPulse to document their work - he takes 6 photos showing before/during/after states. He uploads them as "proof of action" and tags all 5 team members.

**Resolution:**
The proof photos are automatically attached to all 8 related issue reports. Each issue status changes to "resolved." James receives +15 points (5 for participation, 10 bonus for uploading proof). He gets a notification: "Berkeley Environmental Action thanks you! 3 volunteer hours logged to your profile." His student profile now shows 3 hours contributed this month. He receives a message from the NGO coordinator asking if he'd like to lead the next cleanup action.

**Requirements Revealed:**

- Map filtering by category/status
- Issue clustering visualization
- Action Card detailed view (what/when/where/who)
- Team volunteer sign-up with capacity limits
- Volunteer profile pages
- Team chat/coordination
- Multi-photo proof upload workflow
- Tag team members in proof submissions
- Bulk issue resolution (one proof → many issues)
- Points with bonus structure
- Volunteer hour tracking and certification
- Profile analytics (hours contributed per month)
- NGO-to-volunteer messaging
- Leadership/role progression paths

---

### Journey 3: Fatima's Verification - The Neighborhood Elder

**Opening Scene:**
Fatima Yusuf, a 48-year-old shop owner in Kano's Sabon Gari neighborhood, has lived in the same area for 25 years. She knows every street, every compound, every problem area. She's skeptical of platforms where people complain but nothing changes. She opens EcoPulse during her lunch break to see what people are reporting this week.

**Climax:**
The map shows 4 new reports within 3 blocks of her shop. One catches her eye: "Blocked drainage at Enugu Road junction - floods during rain." The photo looks legitimate, but Fatima decides to walk over and check for herself. It's a 7-minute walk from her shop.

**Rising Action:**
She stands at the junction and sees the exact drainage channel from the report. It's indeed blocked with plastic bags and market waste. She takes her own photo from a different angle to show the same drain. Back in the app, she taps the report and clicks "Verify this issue." She uploads her photo and adds a note: "Confirmed - blocked drain, verified on 18/12/2025 at 2pm. This area floods badly during rainy season. I've seen it many times."

The app immediately marks the report as "verified" and shows Fatima's photo alongside the original reporter's photo. A verification badge appears on the map pin.

**Climax (Second Moment):**
Two hours later, Fatima gets a notification: "Your verification helped trigger action! Kano Environmental Coalition has created an Action Card for this issue." She opens it and sees the NGO has prioritized this drain for immediate attention because it now has 2 verifications and Fatima's note about flooding history.

**Resolution:**
Three days later, the drain is cleared by community volunteers coordinated by the NGO. The original reporter uploads proof of resolution. Fatima gets a notification: "An issue you verified has been resolved! +3 points." Her profile now shows "4 issues verified this month" with a 100% validation rate (all 4 issues she verified were confirmed valid by resolution or additional verifiers).

She feels satisfaction - her local knowledge helped validate real problems and trigger real solutions. She starts checking EcoPulse daily during her lunch break, looking for nearby reports to verify.

**Requirements Revealed:**

- Map view for discovering nearby reports
- Individual issue detail view accessible from map
- "Verify this issue" action with photo upload
- Timestamp and location stamping on verifications
- Verification notes/context (not just photos)
- Multi-verifier display (original + verifications side-by-side)
- Verification badge/indicator on map pins
- Verification as trigger for NGO prioritization (algorithmic or manual)
- Verification-based points (+3 for verification)
- Verifier profile analytics (issues verified, validation rate)
- Notifications for verification → resolution pipeline (email + push)
- Reputation/trust system (validation rate %)
- Geographic filtering for "nearby issues" discovery
- Historical context attachment to verifications

---

### Journey 4: Chidi's Coordination - The NGO Organizer

**Opening Scene:**
Chidi Eze, Program Director of the Lagos Environmental Action Network (LEAN), arrives at his office in Yaba on a Monday morning with his usual overwhelming to-do list. He manages 12 volunteers, coordinates with LAWMA (Lagos Waste Management Authority), and submits quarterly reports to 3 international grant funders (Ford Foundation, USAID, and a German development agency). Before EcoPulse, he spent 12 hours per month manually tracking environmental issues reported via phone calls, WhatsApp messages, and community meetings - then creating Excel spreadsheets to show funders what his organization had accomplished.

**Rising Action:**
He opens the EcoPulse NGO Dashboard. It shows 19 new verified reports in Lagos Mainland this week - all waste/litter and drainage issues in his organization's coverage area (Yaba, Surulere, Ebute Metta). The dashboard auto-prioritizes them: 6 reports have 3+ verifications (high confidence), 9 have severity marked "high," and 4 are in "vulnerable communities" (defined by Local Government Area in his org settings).

Chidi clicks on a high-priority cluster: 5 verified reports about blocked drainage near a primary school in Surulere. He creates an Action Card: "Organize community cleanup + report to LAWMA for bin replacement." He sets it for Saturday 7am (before market opens), assigns his volunteer coordinator Amara as team lead, and adds a capacity limit of 10 volunteers. He attaches a template checklist: bring boots, gloves provided, document before/after, tag LAWMA officials in proof photos.

**Climax:**
Saturday's cleanup happens. Chidi watches in real-time as volunteers check in at the location (their profiles appear on the Action Card). Amara uploads proof photos at 9:45am. Chidi reviews them and approves the proof with one tap. All 5 related issues automatically close with "resolved by LEAN" attribution.

**Resolution:**
On Monday, Chidi opens the quarterly funder report export. EcoPulse generates a CSV showing: 19 issues addressed this quarter, 38 volunteer hours contributed, 15 proofs of action uploaded, 84% issue resolution rate, 127 community members engaged (reporters + verifiers + volunteers). He attaches before/after photos for the top 5 actions. The report that used to take him 6 hours now takes 20 minutes. He exports and emails it to his 3 funders. He gets a reply from his USAID program officer: "This level of transparency is impressive - let's schedule a call about expanding your project scope and budget."

**Requirements Revealed:**

- NGO Dashboard (dedicated interface)
- Auto-filtering for org coverage area (Lagos Mainland LGAs)
- Verified report queue/inbox
- Auto-prioritization algorithm (verifications + severity + vulnerability)
- Geographic community vulnerability tags (LGA/ward settings)
- Action Card creation workflow (title, details, date, team lead, capacity)
- Template/checklist attachment to Action Cards
- Real-time volunteer check-in visibility
- Proof photo review and approval workflow
- Bulk issue closure with org attribution
- Quarterly export (CSV + photos)
- Funder-ready report format with metrics:
  - Issues addressed
  - Volunteer hours
  - Proofs of action
  - Resolution rate %
  - Community engagement count
- Before/after photo exports
- Time tracking (12 hours → 20 minutes savings)

---

### Journey 5: Adebayo's Official Response - The Government Environmental Officer

**Opening Scene:**
Adebayo Adeyemi, an Environmental Health Officer for Lagos State Ministry of Environment, used to receive citizen complaints through phone calls, walk-ins at the ministry office, and occasional letters. Issues were scattered across paper files and Excel sheets - none of them talked to each other. He never knew if a complaint was a real problem or had already been addressed. He couldn't show citizens what his department was actually accomplishing.

**Rising Action:**
His ministry pilot-tested EcoPulse after seeing impressive verified community data from Lagos Environmental Action Network. Now, Adebayo opens the Government Dashboard (Phase 2 feature) each morning. It shows him 12 verified community reports in his district (Lagos Mainland) this week. The map clusters them by type: 7 waste/litter, 3 drainage, 2 already marked "assigned to LAWMA."

He clicks on a drainage report: "Blocked drainage at Enugu Road junction, Sabon Gari." Wait - that's in Kano, not Lagos. [Note: This journey represents future multi-state expansion]. The report has 2 verifications with photos from different community members on different days. One verifier notes: "This area floods badly during rainy season. I've seen it many times." Adebayo recognizes this is a chronic issue, not a one-time complaint.

**Climax:**
He clicks "Assign to my team" and the report status changes to "In Progress - Government assigned." He adds an internal note: "Scheduling drainage clearing team - ETA 72 hours." The app automatically notifies the original reporter and both verifiers via email that their issue has been assigned.

Three days later, his crew clears the drain. Adebayo uploads an official "resolution proof" photo showing the cleared drain with a government vehicle in the background. He marks the issue "Resolved - Completed by Ministry 18/12/2025."

**Resolution:**
The original reporter and both verifiers get notifications: "Your issue has been resolved by Lagos State Ministry of Environment!" Adebayo sees on his dashboard that this resolution earned his department +12 community trust points. His weekly stats show: 9 issues resolved this week, 88% resolution within 7 days, 19 community trust points earned.

At the end of the quarter, Adebayo exports a public accountability report showing 124 verified community issues addressed, 83% resolution rate, 1,890 community members engaged. The report includes a map visualization of resolved issues across Lagos Mainland. His supervisor uses it in a Lagos State House of Assembly presentation to justify next year's budget increase. The Assembly is impressed by the transparency and community-driven data.

**Requirements Revealed (Phase 2):**

- Government Dashboard (separate from NGO Dashboard)
- District/LGA filtering for staff assignments
- Verification indicator in issue list (shows confidence level)
- Verifier context notes visible to government staff
- "Assign to my team" workflow with status updates
- Internal notes (not visible to public)
- Auto-notification to reporters and verifiers on status changes (email + push)
- Official resolution proof upload (with ministry/agency attribution)
- Issue status: In Progress → Resolved with timestamp
- Community trust points/reputation system for agencies
- Weekly staff analytics dashboard:
  - Issues resolved
  - Resolution time (% within 7 days)
  - Trust points earned
- Quarterly public accountability exports:
  - CSV + map visualization
  - Resolution rate %
  - Community engagement count
  - Before/after photo galleries

---

### Journey 6: Alex's Anonymous Report - The Skeptical Citizen

**Opening Scene:**
Alex Thompson, a 28-year-old rideshare driver, spots an illegal dumping site in an industrial area at 11pm. There's a pile of construction debris blocking a public sidewalk - mattresses, drywall, paint cans. He's frustrated but also cynical about "reporting apps" that never lead to action. He doesn't want to create yet another account that will spam his email.

**Rising Action:**
He searches "report illegal dumping Oakland" on his phone and finds EcoPulse. The landing page shows a map with dozens of resolved issues - proof that things actually get fixed. He sees a prominent button: "Report Issue (No Account Required)." He taps it.

The app opens the camera. He takes a photo of the dumping site. He's required to add a location (map auto-locates him), select a category (Waste/Litter), add a brief note, and mark severity. No email signup, no password, no personal info. He submits the report.

**Climax:**
A message appears: "Your report has been submitted! It will appear on the public map once verified by community members. Want to track this issue? Create a free account to earn points and see updates." He dismisses it - he's not interested.

Two days later, Alex drives past the same spot and sees the dumping site is still there. He opens EcoPulse again (the URL was saved in his browser history) and searches the map. He finds his report - it's marked "Pending Verification" with a gray pin instead of the colored pins he sees for verified reports. A tooltip explains: "Anonymous reports need 2 verifications from authenticated members before appearing prominently."

**Rising Action (Second Wave):**
He zooms in and sees three authenticated members have now verified his report with their own photos. The pin turns green and moves to the main layer. An Action Card appears: "Richmond Environmental Coalition will address this on Saturday."

Alex is surprised - something is actually happening. He clicks "Create Account" to track the progress. He signs up with email in 30 seconds, and the app immediately links his anonymous report to his new account. "Retroactive credit: +5 points for your verified report!"

**Resolution:**
Saturday afternoon, he gets a notification: "Your issue has been resolved!" The REC uploaded proof photos showing the site cleared. Alex earned +5 points for the original report. His profile shows "1 issue reported, 1 resolved, 100% success rate."

The next week, he reports two more issues - this time while logged in. He starts verifying other reports in areas he drives through. After a month, he has 47 points, 8 reports submitted, 12 verifications contributed. He's no longer cynical - he's an engaged community member.

**Requirements Revealed:**

- Anonymous reporting allowed (no authentication required)
- Minimal required fields for anonymous (photo, location, category, note, severity)
- Anonymous reports marked "Pending Verification" with visual distinction
- Verification threshold for anonymous reports (2 verifications from authenticated users)
- Anonymous reports promoted to full visibility after verification
- Conversion prompts (non-intrusive, value-focused)
- Account creation flow (email signup, <60 seconds)
- Retroactive credit linking (anonymous report → new account)
- Success rate tracking per user
- Conversion funnel analytics (anonymous → authenticated)
- Browser session persistence (no account required to view updates)
- Search/filter by report status (pending, verified, resolved)

---

### Journey 7: Michelle's Moderation - The Trust & Safety Guardian

**Opening Scene:**
Michelle Okafor, a Platform Moderator for EcoPulse, starts her Tuesday shift reviewing the flag queue. EcoPulse has grown to 15,000 users across 6 cities, and with scale comes challenges - spam reports, duplicate issues, inappropriate content, and occasional vandalism (people reporting fake issues to game the points system).

**Rising Action:**
Her moderator dashboard shows 8 flagged items this week:

- 3 reports flagged as "spam/inappropriate"
- 2 users flagged for "suspicious activity pattern"
- 2 reports flagged as "duplicate"
- 1 verification photo flagged as "unrelated to issue"

She clicks the first spam flag. It's a report titled "Test 123" with a photo of someone's lunch. The community member who flagged it wrote: "This is not an environmental issue - looks like spam." Michelle reviews the reporter's history: account created 2 hours ago, 5 identical reports in different locations, all with random photos.

**Climax:**
Michelle marks the report as "Confirmed Spam" and selects "Remove & Suspend User." A dialog asks for an explanation (logged to audit trail): "Spam pattern - 5 fake reports in 2 hours from new account." She confirms.

The system immediately:

- Removes all 5 reports from the map
- Suspends the user account
- Notifies the community member who flagged it: "Thanks for helping keep EcoPulse trustworthy! +2 trust points."
- Logs the action to the audit trail with timestamp and moderator ID

**Second Wave - Duplicate Handling:**
Michelle reviews a duplicate flag. Two reports about the same overflowing dumpster, submitted 3 hours apart by different users. Both are legitimate, but they're reporting the same issue from slightly different angles.

She clicks "Merge Duplicates." The system prompts her to select the primary report (she chooses the one with more verifications). The secondary report's photos, notes, and verifications are attached to the primary report. Both original reporters are notified: "Your report was merged with a related issue to help coordinate community action."

**Resolution:**
Michelle completes her flag queue in 45 minutes. Her dashboard shows weekly moderation stats:

- 8 flags reviewed, 8 resolved
- 3 spam reports removed (1 user suspended)
- 2 duplicate sets merged (4 reports consolidated)
- 1 inappropriate photo blurred with warning to user
- 2 false flags rejected (legitimate reports that were incorrectly flagged)
- 98.2% community trust score maintained

She exports a weekly Trust & Safety report for the platform team showing trending patterns: "Spam attempts increased 15% this week - recommend implementing phone verification for accounts that submit 3+ reports in first hour."

**Requirements Revealed:**

- Moderator dashboard with flag queue
- Community flagging system (spam, duplicate, inappropriate, suspicious)
- Flag categories and custom notes
- Moderator review workflow with evidence display
- User history and pattern analysis tools
- Bulk actions (remove, suspend, merge)
- Audit trail with moderator ID and timestamps
- User suspension with reason logging
- Notification system for flag reporters (+2 trust points)
- Duplicate detection and merge workflow
  - Primary/secondary report selection
  - Automatic attachment of photos/notes/verifications
  - Notification to all affected reporters
- Content moderation actions (blur, remove, warn)
- False flag rejection (with feedback to flagger)
- Weekly Trust & Safety analytics:
  - Flags reviewed/resolved
  - Spam removal count
  - Duplicate merges
  - Community trust score %
  - Trending pattern detection
- Export/reporting for platform team
- Recommendations engine based on patterns

---

### Journey 8: Kevin's Integration - The 311 Systems Developer

**Opening Scene:**
Kevin Martinez is a Senior Developer for Oakland's 311 Citizen Request System. His director attended a City Council presentation where David Park (Public Works) showed impressive transparency metrics from EcoPulse. The Council asked: "Can we integrate this with our official 311 system so citizens can report through either platform and staff see everything in one place?"

Kevin's director assigned him to build the integration. He opens the EcoPulse Developer Portal.

**Rising Action:**
He reads the API documentation. EcoPulse offers:

- REST API with OAuth 2.0 authentication
- Webhooks for real-time event notifications
- Read endpoints (GET verified reports by geography/category/date)
- Write endpoints (POST status updates, resolution proofs)
- Rate limits: 1000 requests/hour for government tier

Kevin creates an API key for "Oakland 311 System" and configures a webhook to receive notifications when new verified reports are submitted in Oakland with category "Drainage" (the pilot category for integration).

**Climax:**
He writes a Node.js service that:

1. **Inbound Sync:** Every 15 minutes, polls EcoPulse API for new verified drainage reports in Oakland
2. **Work Order Creation:** Automatically creates 311 work orders with attached photos, reporter notes, verification count, and community priority score
3. **Assignment Routing:** Routes to appropriate Public Works staff based on geographic district
4. **Outbound Sync:** When a 311 work order is marked "Completed," posts status update back to EcoPulse with official resolution timestamp

Kevin tests the integration in staging. He creates a test drainage report in EcoPulse. Within 15 minutes, a work order appears in the 311 system with all context. He marks it completed in 311, and the EcoPulse status updates to "Resolved - Completed by Oakland Public Works 12/16/25."

**Resolution:**
The integration goes live. Over the next month:

- 47 verified EcoPulse drainage reports auto-create 311 work orders
- Public Works staff see community verification context (photos, verifier notes, priority scores) they never had before
- 43 work orders are completed and status syncs back to EcoPulse (91% resolution rate)
- Average resolution time drops from 14 days to 8 days (staff can prioritize based on verification count)
- Community trust in both systems increases - 311 benefits from EcoPulse's community engagement, EcoPulse benefits from official government response

Kevin presents metrics to the City Council:

- 0 duplicate reports (EcoPulse's verification prevents spam from cluttering 311)
- 67% reduction in "false positive" work orders (only verified issues create tickets)
- 156 staff hours saved per month (no manual data entry from phone calls)
- 89% citizen satisfaction score (surveyed EcoPulse users who got government response)

The Council approves expansion to all issue categories. Three neighboring cities request the same integration.

**Requirements Revealed:**

- REST API with full CRUD operations
- OAuth 2.0 authentication for API clients
- API key management (generation, rotation, revocation)
- Developer Portal with documentation
- Webhook system for real-time event notifications:
  - New verified reports
  - Status updates
  - Issue resolution
  - Configurable filters (geography, category)
- Rate limiting with tier-based quotas (government tier: 1000/hour)
- GET endpoints:
  - Verified reports by geography/category/date
  - Report details with photos, notes, verifications
  - Community priority scores
  - Verification count and validator context
- POST endpoints:
  - Status updates (in-progress, assigned, resolved)
  - Resolution proofs with timestamps
  - Official government attribution
- API request/response format (JSON)
- Error handling and status codes
- Bidirectional sync architecture support
- Geographic filtering (district-level)
- Category-based routing
- Integration testing environment (staging API)
- API analytics dashboard:
  - Request volume
  - Response times
  - Error rates
  - Usage by client/organization
- Impact metrics tracking:
  - Resolution time comparison
  - Duplicate prevention
  - False positive reduction
  - Staff hours saved
  - Citizen satisfaction scores
- Multi-jurisdiction support (city-to-city replication)

---

## Journey Requirements Summary

### Core Platform Capabilities

**Reporting & Mapping:**

- Mobile-first map with auto-location (Maria)
- Camera-integrated reporting (Maria)
- Required fields: photo, location, category, note, severity (Maria, Alex)
- Anonymous reporting with verification threshold (Alex)
- Real-time pin visualization with status-based styling (Maria, Alex)
- Issue clustering and filtering (James, David)
- Geographic boundary filtering (Linda, Kevin)

**Verification & Trust:**

- Second-person verification with photos and notes (Sara)
- Multi-verifier display and timestamps (Sara, David)
- Verification-based prioritization algorithms (Sara, Linda)
- Verifier reputation and validation rate tracking (Sara)
- Community trust scoring for agencies (David)
- Verification threshold for anonymous reports (Alex)
- Flag/report system for community moderation (Michelle)

**Gamification & Engagement:**

- Points system (+5 report, +5 proof, +3 verification, +2 trust flag) (Maria, Alex, Michelle)
- Profile analytics (hours, points, success rate) (James, Alex, Sara)
- Retroactive credit for anonymous→authenticated conversion (Alex)
- Volunteer hour tracking and certification (James)
- Reputation metrics (validation rate, resolution rate) (Sara, Alex)

**Action Coordination:**

- Action Card creation and management (James, Linda)
- Team volunteer sign-up with capacity limits (James)
- Team chat and coordination tools (James)
- Multi-photo proof upload with team tagging (James)
- Proof review and approval workflows (Linda)
- Bulk issue resolution (one proof → many issues) (James)

**Organization Dashboards:**

_NGO Dashboard (Linda):_

- Auto-prioritization (verifications + severity + vulnerability)
- Coverage area and vulnerable community filtering
- Action Card workflow management
- Volunteer coordination and check-in tracking
- Funder report exports (CSV + photos with metrics)
- Time savings analytics (10hrs → 1hr)

_Government Dashboard (David):_

- District/geographic assignment filtering
- Issue queue with verification indicators
- Internal notes (staff-only)
- Official resolution proof uploads
- Community trust points tracking
- Public accountability reports (quarterly exports)
- Work order system integration support (Kevin)

**Moderation & Trust & Safety:**

- Community flagging (spam, duplicate, inappropriate, suspicious) (Michelle)
- Moderator dashboard and review queue (Michelle)
- User history and pattern analysis (Michelle)
- Content moderation actions (remove, blur, warn, suspend) (Michelle)
- Duplicate detection and merge workflow (Michelle)
- Audit trail with moderator ID and timestamps (Michelle)
- False flag rejection with feedback (Michelle)
- Weekly Trust & Safety analytics and pattern detection (Michelle)

**API & Integrations:**

- REST API with OAuth 2.0 (Kevin)
- Webhook system for real-time event notifications (Kevin)
- Rate limiting with tier-based quotas (Kevin)
- GET endpoints (reports, verifications, priority scores) (Kevin)
- POST endpoints (status updates, resolution proofs) (Kevin)
- Developer Portal with documentation (Kevin)
- Bidirectional sync architecture (Kevin)
- API analytics dashboard (usage, performance, impact) (Kevin)

**Notifications & Communication:**

- Status change notifications to reporters/verifiers (Maria, David, Alex)
- Verification → action trigger notifications (Sara)
- Issue resolution notifications (Maria, Alex, David)
- Flag acknowledgment notifications (Michelle)
- Duplicate merge notifications (Michelle)
- NGO-to-volunteer messaging (James)
- Team coordination messaging (James)

**Data & Reporting:**

- Funder report exports (CSV + before/after photos) (Linda)
- Public accountability reports with map visualizations (David)
- Trust & Safety weekly reports with trend analysis (Michelle)
- API integration impact metrics (resolution time, duplicate reduction, staff hours saved) (Kevin)
- User profile analytics (personal dashboards) (Maria, James, Sara, Alex)

---

## Domain-Specific Requirements

### Govtech Compliance & Regulatory Overview

EcoPulse operates in the **govtech domain** (government technology for civic engagement) with **HIGH complexity**, requiring specialized compliance, security, and transparency standards that fundamentally shape product architecture and go-to-market strategy.

Unlike consumer or enterprise SaaS, govtech platforms must balance:

- **Public accountability** (transparency and open data mandates)
- **Government security** (SOC 2, data sovereignty, audit trails)
- **Universal accessibility** (Section 508/WCAG compliance - legal requirement)
- **Privacy protection** (CCPA, GDPR for community members)
- **Multi-jurisdiction adaptation** (different regulations, terminology, workflows across cities/states/countries)

These requirements are **non-negotiable** for government adoption and create significant competitive moats when implemented correctly.

---

### Key Domain Concerns

#### 1. Procurement Rules & Government Sales Strategy

**MVP Approach (Sprints 1-4):**

- Pure SaaS self-service with credit card signup
- Target departmental budgets <$10k (bypasses formal procurement cycles)
- Position as "pilot program" or "innovation fund" expense

**Government Sales Funnel:**

- **Stage 1:** NGO adoption generates verified community data (no government involvement)
- **Stage 2:** Government staff see data value, request 3-6 month pilot
- **Stage 3:** Pilot proves ROI, expands to departmental subscription ($499-999/month)
- **Stage 4:** Formal procurement for enterprise contract (Phase 2, 12-18 months)

**GSA Schedule Strategy (Phase 2, Month 9):**

- Apply after proving 10+ government customers
- GSA Schedule approval takes 6-9 months
- Enables streamlined federal/state procurement

**Competitive Differentiation:** "Try before you buy" approach - governments pilot with NGO data already proving community value. Unlike competitors requiring multi-year enterprise contracts upfront, we offer proof of value in 90 days.

---

#### 2. Security Standards & Frameworks

**MVP Security Posture (Sufficient for state/local government):**

- **SOC 2 Type II compliance** (via Supabase infrastructure)
- **SSL/TLS encryption** in transit (HTTPS enforced)
- **Encryption at rest** (PostgreSQL AES-256)
- **Role-based access control** (RLS policies for multi-org data isolation)
- **Audit logs** for all admin actions (timestamp, user ID, action type)
- **Password security** (bcrypt hashing, 2FA optional)

**FedRAMP Status:**

- **NOT pursuing FedRAMP authorization for MVP** (costs $250k-500k, takes 12-18 months)
- State/local governments do NOT require FedRAMP (only federal agencies)
- NGO → Local Government strategy avoids FedRAMP entirely

**Self-Hosting for Data Sovereignty (Phase 2, Month 12-18):**

- On-premise deployment option for large cities requiring data residency
- Target: NYC, LA, Chicago, international governments (EU, Canada)
- Premium tier: $2,500+/month for self-hosted enterprise
- Architecture designed for containerized deployment (Docker/Kubernetes)

**Market Positioning:** "Government-grade security without government pricing" - SOC 2 compliance at $499/month vs. competitors like Accela at $50k+ annually.

---

#### 3. Accessibility Standards (Section 508/WCAG 2.1 AA)

**Mandate: Section 508 compliance REQUIRED for MVP.**

**Rationale:**

- Government agencies legally prohibited from adopting non-compliant software
- NGOs receiving government grants also require 508 compliance
- Creates competitive moat (many civic tech platforms fail accessibility audits)

**Implementation (Built into Sprint 1-4):**

**Map Interface (Leaflet):**

- Keyboard navigation (Tab, Enter, Arrow keys for pin selection)
- Screen reader announcements ("Issue reported: Waste/Litter at Main Street, severity high")
- ARIA labels on all interactive map controls
- Focus indicators (visible outline on active elements, 4.5:1 contrast ratio)

**Forms & Inputs:**

- Semantic HTML (`<label>`, `<fieldset>`, proper heading hierarchy H1→H2→H3)
- Error messages announced to screen readers with `aria-live="polite"`
- Color contrast ratio minimum 4.5:1 for text, 3:1 for large text (WCAG AA)
- Touch targets minimum 44x44px for mobile accessibility

**Images & Photos:**

- Alt text required for all uploaded photos (user-provided description in "note" field)
- Decorative images hidden from screen readers (`role="presentation"`)
- Photo captions displayed visually and announced to assistive technology

**Mobile Accessibility:**

- iOS VoiceOver support from Sprint 1
- Android TalkBack support from Sprint 1
- Font scaling (respect system font size preferences, test at 200% zoom)

**Testing & Validation Protocol:**

- **Sprint 2:** Automated accessibility audit (axe DevTools, Lighthouse score >90)
- **Sprint 3:** Manual keyboard-only testing (ensure all features accessible without mouse)
- **Sprint 4:** Screen reader testing (NVDA, JAWS, VoiceOver on macOS/iOS, TalkBack on Android)

**Competitive Positioning:** "The only accessible civic engagement platform" - document WCAG violations in SeeClickFix and FixMyStreet, market accessibility as sales differentiator.

---

#### 4. Privacy & Data Protection Requirements

**Privacy Framework - Tiered Compliance:**

**CCPA Compliance (California - REQUIRED for Oakland pilot):**

- **Right to know:** User dashboard showing all collected data (reports, verifications, points, volunteer hours)
- **Right to delete:** Account deletion removes all personal data within 30 days (photos archived anonymously)
- **Opt-out of "sale":** No data selling; public API excludes personal identifiers (name, email, IP address)
- **Privacy notice:** Clear language on what data is public (reports, verifications) vs. private (email, profile details)
- **Data minimization:** Collect only essential data for platform operation

**GDPR Readiness (Phase 2 international expansion):**

- Data processing agreements (DPAs) for government customers
- EU data residency via self-hosting option
- Cookie consent management (explicit opt-in for analytics)
- Data portability (export user data in JSON format)
- Right to be forgotten (delete all personal data on request)

**Photo Privacy - Tiered Approach:**

_MVP (Sprints 1-4):_

- EXIF stripping on all uploads (Supabase Storage automatic)
- User guidance: "Avoid photographing people's faces or license plates"
- Community flag system: Report photos with privacy concerns → Michelle (moderator) reviews → blur or remove

_Phase 2 (12-18 months):_

- Optional AI face blurring (privacy enhancement, user toggle)
- License plate detection and blurring
- PII detection in photos (warn before upload if faces detected)

**Government vs. Community Data Retention Conflict:**

_Challenge:_ Government agencies require 7-year audit trail retention (public records laws), while community members have right to delete (CCPA).

_Solution:_ **Dual retention policies with anonymization**

- **Community members:** Right to delete personal identifiers after issue resolution
- **Government agencies:** 7-year retention of anonymized reports for audit compliance
- **Technical implementation:** User deletion removes name, email, photo metadata but preserves anonymized report (e.g., "User_12345" instead of "Maria Rodriguez")
- **Audit trail integrity:** Government can prove action history without exposing personal data

**Data Minimization Principles:**

- Anonymous reporting allowed (no account required, no personal data collection)
- Authenticated users: email + username only (no SSN, postal address, phone unless volunteer opt-in)
- Location data: Issue location only, NOT user's home address or tracking history
- Verification data: Photos and notes only, no facial recognition or biometric data

**Market Positioning:** "Privacy-first civic engagement" - contrast with 311 systems requiring full name, address, phone number. EcoPulse allows anonymous reporting with community verification, respecting privacy while ensuring accountability.

---

#### 5. Transparency & Open Data Requirements

**Mandate: Radical transparency as competitive differentiation.**

**Public API (Phase 1, Sprint 4):**

- **Open read access** to verified reports (no authentication required for public data)
- **Anonymized exports** (no personal identifiers in public API responses)
- **Real-time feeds** (RSS/Atom) for civic hackers, journalists, researchers
- **Bulk data downloads** (CSV, GeoJSON) updated daily, Creative Commons Attribution license

**API Access Tiers:**

- **Public tier:** Read-only verified reports, 100 requests/hour, free (no API key required)
- **NGO tier:** Write access for Action Cards, 500 requests/hour, included in $49+/month subscription
- **Government tier:** Full bidirectional sync (status updates, resolution proofs), 1000 requests/hour, included in $499+/month subscription

**Public Transparency Dashboards (Phase 2, Month 9):**

_Real-time Government Accountability Dashboards:_

- Live metrics for each government agency:
  - Average resolution time (days) vs. citywide average
  - Resolution rate % (resolved / assigned) vs. peer cities
  - Community trust score (earned through timely responses, 0-100 scale)
  - Month-over-month improvement trends (↑↓ indicators)
- Filterable by category, district, time period
- Embeddable widgets for government websites ("Resolved this month: 156 issues")

_NGO Impact Dashboards:_

- Public metrics for each NGO:
  - Issues addressed, volunteer hours contributed, proofs of action uploaded
  - Community engagement count (reporters + verifiers + volunteers)
  - Funder-ready visualizations (before/after photo galleries)
- Embeddable widgets for donor pages ("Community impact: 47 volunteer hours this month")

**Open Data Commitment:**

- **Creative Commons Attribution License** (CC BY 4.0) for anonymized community data
- **Public data portal** showing aggregated trends (heatmaps, time series, geographic clusters)
- **Annual transparency report** with platform-wide impact metrics (issues resolved, community members engaged, government response rates by city)

**Data Openness Benefits:**

- **Journalists:** Data-driven reporting on government responsiveness ("Oakland resolves drainage issues 3x faster than San Francisco")
- **Civic hackers:** Build complementary tools on open API (mobile apps, data visualizations, notification bots)
- **Academics:** Research on community-driven environmental action and government accountability

**Competitive Moat:** Once a city's civic ecosystem is built on EcoPulse's open API (third-party apps, integrations, public dashboards), switching costs become prohibitive. Competitors like SeeClickFix lock data in proprietary silos; we make openness our strategic advantage.

---

#### 6. Multi-Jurisdiction Complexity Management

**Challenge:** Each jurisdiction has different terminology, responsible departments, SLAs, and data privacy laws.

_Examples:_

- **Oakland:** "Illegal Dumping" (Public Works, 7-day response goal, CCPA)
- **San Francisco:** "Refuse Violation" (DPW, 48-hour commitment, CCPA)
- **Berkeley:** "Waste Management" (Zero Waste Division, 5-day goal, CCPA)
- **EU cities:** "Environmental Offense" (varies by country, GDPR compliance)

**Solution: Three-tier adaptive taxonomy**

**Tier 1: Universal Categories (MVP - Sprints 1-4)**

- Core categories that transcend jurisdictions:
  - **Waste/Litter** (universal concept, maps to any local terminology)
  - **Drainage/Flooding** (universal infrastructure category)
- Backend database uses universal taxonomy for cross-jurisdiction analytics

**Tier 2: Jurisdiction-Specific Display Mapping (Phase 2, Month 9)**

- Organization settings allow custom category names for UI display:
  - Oakland: "Waste/Litter" → displayed as "Illegal Dumping" in their dashboard
  - San Francisco: "Waste/Litter" → displayed as "Refuse Violation" in their dashboard
  - Backend taxonomy remains universal for aggregated reporting

**Tier 3: Responsible Department Routing (Phase 2, Month 12)**

- Organization settings define department routing rules:
  - Oakland: Waste → Public Works, Drainage → Stormwater Management
  - San Francisco: Waste → DPW, Drainage → SFPUC (San Francisco Public Utilities Commission)
- API integration auto-routes issues to correct internal department

**Data Model Structure:**

```
Issue:
  universal_category: "waste_litter" (internal taxonomy, never changes)
  display_category: "Illegal Dumping" (jurisdiction-specific display label)
  responsible_org_unit: "Oakland Public Works" (department routing)
  jurisdiction_sla_days: 7 (custom SLA per organization)
```

**SLA Flexibility:**

- Organization settings allow custom SLA targets (response time goals):
  - Oakland: 7-day response goal
  - San Francisco: 48-hour commitment for high-severity issues
  - Dashboard shows % meeting their own SLA (no unfair cross-city comparisons)

**Privacy Law Adaptation:**

- Organization-level privacy compliance settings:
  - California orgs: CCPA compliance mode enabled (right to delete, opt-out)
  - Texas orgs: State privacy law compliance mode
  - EU orgs: GDPR mode (stricter consent requirements, data residency, DPAs)
- Privacy controls adapt automatically based on organization location

**Scaling Strategy:**

- **MVP:** 2 universal categories (sufficient for first 10 cities with 90% overlap)
- **Phase 2:** Add 3-5 more universal categories based on demand (Graffiti, Potholes, Tree Maintenance)
- **Enterprise:** Custom category creation for large government contracts with unique needs

**Market Positioning:** "Local control with global scale" - cities keep their terminology and workflows, but benefit from shared platform improvements and cross-city best practice sharing. Competitors force cities to adapt to rigid taxonomy; we adapt to each city's existing processes while maintaining data interoperability.

---

### Compliance Requirements Summary

**MVP Must-Haves (Sprints 1-4):**

- ✅ Section 508 accessibility (WCAG 2.1 AA compliance)
- ✅ CCPA compliance for California pilot (Oakland)
- ✅ SOC 2 Type II security standards (via Supabase)
- ✅ Open API for public transparency (read-only verified reports)
- ✅ Audit logs for all admin/moderation actions
- ✅ Photo EXIF stripping and privacy guidance

**Phase 2 Compliance Enhancements (12-18 months):**

- ✅ GDPR compliance for international expansion (EU, Canada)
- ✅ Self-hosting option for data sovereignty requirements
- ✅ AI-powered photo privacy (face/license plate blurring)
- ✅ Multi-jurisdiction taxonomy and routing
- ✅ Real-time public transparency dashboards
- ✅ GSA Schedule for streamlined federal/state procurement

**Deferred Beyond Phase 2:**

- ❌ FedRAMP authorization (not targeting federal agencies in Years 1-2)
- ❌ HIPAA compliance (not handling health data)
- ❌ PCI DSS Level 1 (payment processing handled by Stripe, not in-app)

---

### Industry Standards & Best Practices

**Govtech Standards Adherence:**

- **NIST Cybersecurity Framework:** Identify, Protect, Detect, Respond, Recover
- **Open311 API Compatibility:** API design follows Open311 GeoReport v2 patterns for interoperability
- **W3C Web Accessibility Standards:** WCAG 2.1 Level AA (government requirement)
- **OWASP Top 10:** Security protections against common web vulnerabilities
- **GDPR Privacy by Design:** Data minimization, purpose limitation, storage limitation

**Civic Tech Best Practices:**

- **Code for America Principles:** Human-centered design, iterative development, open data
- **Digital Public Infrastructure:** Open-source ethos, interoperability, vendor independence
- **Community-Led Development:** Co-design with community members, not just government
- **Equity-Centered Design:** Accessible to all community members regardless of technical literacy

---

### Required Expertise & Validation

**Domain Expertise Required:**

_Product Team:_

- Government procurement and contracting experience (GSA Schedule, RFPs)
- Accessibility expertise (WCAG compliance, assistive technology testing)
- Privacy compliance knowledge (CCPA, GDPR interpretation and implementation)
- Multi-tenant SaaS architecture (data isolation, RLS policies)

_Advisory Board/Consultants:_

- Government CTO or CDO (Chief Data Officer) from pilot city (Oakland)
- Accessibility advocate/consultant (blind or low-vision user for testing)
- Civic tech veteran (Code for America, Civic Hall, or similar experience)
- Data privacy attorney (CCPA/GDPR compliance validation)

**Validation Requirements:**

_Sprint 2:_

- Accessibility audit by third-party WCAG expert
- Privacy notice review by data privacy attorney
- Security review by SOC 2 auditor (via Supabase)

_Sprint 4:_

- Pilot with Oakland government department (Public Works or Stormwater)
- User testing with screen reader users (blind/low-vision community members)
- Load testing with realistic government data volumes (10,000+ issues)

_Phase 2:_

- GSA Schedule application and approval process
- GDPR compliance audit for EU expansion
- Penetration testing by third-party security firm

---

### Implementation Considerations

**Architecture Decisions Driven by Govtech Requirements:**

_Multi-org data isolation (RLS policies):_

- Required for data sovereignty and multi-tenant security
- Prevents cross-contamination of government and NGO data
- Enables self-hosting for organizations with strict compliance needs

_Audit log for all admin actions:_

- Government transparency and accountability requirement
- Immutable log (append-only, never deleted) with timestamp, user ID, action type, before/after state
- Queryable for public records requests and internal investigations

_Open API architecture:_

- Public transparency mandate drives API-first design
- REST API with OAuth 2.0 for government integrations (311 systems)
- Webhooks for real-time event notifications (new verified reports, status updates)

_Accessibility-first design:_

- Semantic HTML, ARIA labels, keyboard navigation as foundational requirements
- Cannot be retrofitted - must be built into Sprint 1 components
- Influences choice of UI libraries (Radix UI, Headless UI for accessibility primitives)

**Development Priorities:**

1. **Sprint 1:** Core reporting + map with accessibility built-in
2. **Sprint 2:** Verification + User Profiles + accessibility audit
3. **Sprint 3:** NGO Dashboard + audit logs + privacy controls
4. **Sprint 4:** Public API + government pilot + CCPA compliance validation

**Risk Mitigation:**

- **Accessibility failure:** Conduct automated audits in Sprint 2, manual testing in Sprint 3 (early detection)
- **Privacy violation:** Data privacy attorney review in Sprint 2 before pilot (legal validation)
- **Security breach:** SOC 2 compliance via Supabase, penetration testing in Phase 2 (defense in depth)
- **Government adoption failure:** Trojan Horse strategy (NGOs first) reduces dependence on government sales cycle

---

## Innovation & Novel Patterns

### Detected Innovation Areas

EcoPulse introduces **four fundamental innovations** to the civic engagement and environmental action space, each challenging core assumptions in traditional govtech platforms:

#### 1. Community-Driven Verification (Second-Person Validation)

**Innovation:** Peer-to-peer verification where community members validate each other's reports before government involvement.

**Traditional Assumption Challenged:**

- Legacy 311 systems assume **only government staff** can verify citizen complaints
- Citizens are treated as "reporters" with government as "validators"
- Creates bottleneck: government must verify every single report before action

**Our Approach:**

- **Sara validates Maria's report** - trusted community members with local knowledge verify issues
- Reports gain credibility through **multiple independent verifications** (photos from different angles, timestamps, context notes)
- Government sees verification count as confidence signal (2+ verifications = high priority)
- Anonymous reports require **verification threshold** (2 verifications by authenticated members) before appearing prominently

**Why It's Novel:**
No civic tech platform makes community verification a **first-class feature**. Competitors use upvotes/likes (weak signal), comments (unstructured), or government-only validation. We treat verifiers as **essential contributors** with reputation tracking (validation rate %), profile analytics, and points incentives (+3 per verification).

---

#### 2. Distributed Action Coordination (Action Cards)

**Innovation:** NGOs, community groups, and volunteers can create and execute structured action plans, not just report problems.

**Traditional Assumption Challenged:**

- Legacy platforms are **one-directional**: Citizens report → Government responds
- Citizens passive, government reactive
- NGOs and community groups have no structured role in the platform

**Our Approach:**

- **Linda (NGO) creates Action Card** for community cleanup with volunteer coordination
- **James (student) joins volunteer team** and uploads proof of action
- **One proof resolves multiple related issues** - bulk closure efficiency
- Action Cards include: what/when/where/who, team capacity limits, checklists, before/after documentation

**Why It's Novel:**
We're architecting for **distributed action**, not centralized ticketing. Multiple actors (NGOs, volunteers, government) can all take coordinated action on the same issue. Competitors force linear workflow: report → assign to government → government resolves. We enable: report → NGO organizes community action → community resolves → government validates.

This is a **fundamental rethinking** of civic problem-solving: from "wait for government" to "community + government partnership."

---

#### 3. Trojan Horse Go-to-Market Strategy

**Innovation:** NGO adoption generates verified community data that drives government demand (not traditional govtech RFP sales).

**Traditional Assumption Challenged:**

- Govtech startups target government directly with RFP responses and multi-year contracts
- Government is the customer from Day 1
- Long sales cycles (12-18 months) and high customer acquisition costs

**Our Approach:**

- **Phase 1:** NGOs adopt freely and generate verified community reports (fast adoption, no procurement)
- **Phase 2:** Government staff see valuable data they didn't have to create (passive demand generation)
- **Phase 3:** Government requests pilot after seeing community proof of value (inbound sales)
- **Phase 4:** Pilot converts to subscription after proving ROI (short sales cycle, low CAC)

**Why It's Novel:**
We're using NGOs as **data generation engines** that create government demand. Competitors like SeeClickFix and Accela require expensive government contracts upfront. We create a **network effect**: more NGO users → more verified data → more government value → more government adoption → more resources for NGO features.

Strategic advantage: By the time government engages, we have 3-6 months of **proof** (156 verified issues addressed, 89% resolution rate, 47 volunteer hours contributed). Traditional govtech sells on promises; we sell on demonstrated impact.

---

#### 4. Community Motivation in Govtech Context

**Innovation:** Tangible impact messaging and verified outcomes replace traditional gamification.

**Traditional Assumption Challenged:**

- Govtech platforms either use juvenile gamification (points/badges) or avoid motivation entirely
- Abstract points don't resonate with African communities focused on tangible change
- Traditional "civic duty" messaging has low engagement

**Our Approach:**

- **NO points or badges** - replaced with tangible impact metrics
- "You saved 15 kg of waste!" (specific, verifiable, meaningful)
- "Your community cleared 3 blocked drains this month!" (collective celebration)
- Profile analytics showing **verified contributions**, **community impact**, **volunteer hours**
- Reputation through verified outcomes, not arbitrary scores

**Why It's Novel:**
We're betting that **tangible impact visibility + civic duty > abstract points** for sustained engagement. Traditional platforms either gamify everything (juvenile) or nothing (boring). We show REAL environmental change with verified proof.

**Validation strategy:** Frame as "community impact transparency" - users see their concrete contributions (kg waste removed, drains cleared, volunteer hours). Government agencies see community trust metrics based on verified responsiveness, not game mechanics.

---

### Market Context & Competitive Landscape

**Competitive Analysis Findings (from strategic-decisions.md):**

Researched 13+ platforms (SeeClickFix, FixMyStreet, PublicStuff, Accela, GovPilot, Nextdoor, iNaturalist, Litterati, Ushahidi, HOT OpenStreetMap, Map Action, CIVIC AI) and identified **8 critical gaps** that validate our innovation strategy:

#### Gap 1: Government-Only Verification → **Community Verification**

- All competitors rely on government staff or platform admins to validate reports
- We enable peer-to-peer validation with reputation tracking

#### Gap 2: Report-Only Interface → **Action Coordination**

- All competitors stop at "report submitted" (government handles action privately)
- We enable NGOs and volunteers to coordinate structured actions with proof documentation

#### Gap 3: Single-Tenant Focus → **Multi-Org Native**

- Competitors are either government-only (SeeClickFix) or community-only (Nextdoor)
- We treat NGOs, governments, and community members as **co-equal actors** with dedicated dashboards

#### Gap 4: Data Silos → **Open API + Radical Transparency**

- Competitors lock data in proprietary systems
- We publish real-time accountability dashboards and open API for civic ecosystem

#### Gap 5: Government Direct Sales → **Trojan Horse Strategy**

- Competitors require government contracts before value demonstration
- We use NGO adoption to create government demand (proof before purchase)

#### Gap 6: Generic Civic → **Environmental Domain Expertise**

- Competitors are generalist 311 platforms (potholes, graffiti, noise complaints)
- We specialize in environmental issues with domain-specific categories and workflows

#### Gap 7: No Incentives → **Gamification + Reputation**

- Competitors rely on civic duty alone
- We add points, reputation, volunteer hour tracking, and agency trust scores

#### Gap 8: Government-Centric Language → **Community-First Framing**

- Competitors use bureaucratic language ("service requests", "work orders")
- We use community language ("issues", "action cards", "proof", "impact")

**Market Positioning:** This combination creates a **Blue Ocean** - we're not competing as "better 311 system." We're creating a new category: **"Distributed Environmental Action Platform"** that happens to integrate with government (vs. traditional "Government Ticketing System" that happens to have community features).

---

### Validation Approach

Each innovation requires specific validation during MVP and early adoption:

#### Innovation 1: Community-Driven Verification

**Hypothesis:** Community members with local knowledge can reliably validate environmental issues before government involvement.

**Validation Metrics (Sprint 4 pilot):**

- **Primary:** ≥90% of verified reports are confirmed valid by eventual resolution (government validates community validators)
- **Secondary:** Average verifications per report ≥2.0 (community engagement)
- **Red flag:** <70% validation accuracy → revert to government-only verification

**Anti-Gaming Measures:**

- Verification requires photo from different angle (not screenshot of original)
- Timestamp and location stamping (prevents pre-coordinated verification)
- Reputation system (validation rate %) discourages false verifications
- Michelle (moderator) reviews flagged verifications for collusion patterns

**Fallback Plan:** If verification accuracy <70% in first 3 months, implement **verified community member** role (requires government approval, similar to Reddit's "verified user") - adds friction but maintains community verification concept.

---

#### Innovation 2: Distributed Action Coordination (Action Cards)

**Hypothesis:** NGOs can coordinate volunteer actions that resolve community issues faster than waiting for government response.

**Validation Metrics (Sprint 3-4 pilot with Oakland Green Alliance):**

- **Primary:** ≥50% of NGO-coordinated actions result in issue resolution (proof uploaded, issue closed)
- **Secondary:** Average resolution time NGO actions < Government-only actions (speed comparison)
- **Success threshold:** NGOs resolve ≥30 issues in first 3 months

**Coordination Risk Mitigation:**

- Action Cards include "assigned to" field (prevents duplicate actions by multiple NGOs)
- When NGO assigns Action Card, issue status changes to "Action Planned" (visible to all)
- Government can also create Action Cards (if government wants to organize community cleanup, they can)

**Fallback Plan:** If coordination becomes messy (multiple NGOs claiming same issue, conflicting actions), implement **Action Card approval workflow** where government must approve NGO actions before execution - adds friction but prevents chaos.

---

#### Innovation 3: Trojan Horse Go-to-Market

**Hypothesis:** NGO adoption will generate verified data that creates inbound government demand (vs. traditional outbound govtech sales).

**Validation Metrics (Year 1):**

- **Primary:** ≥3 government pilot requests generated from NGO activity (inbound demand signal)
- **Secondary:** Time from NGO launch to first government pilot ≤6 months
- **Conversion:** ≥50% of government pilots convert to paid subscription within 6 months

**Demand Generation Tracking:**

- Government staff profile views of NGO-generated data (API analytics)
- Government staff sign-ups for "observer" accounts (demand signal)
- Direct government inquiries mentioning NGO data value (qualitative validation)

**Fallback Plan:** If NGO → Government funnel doesn't produce government demand in 9 months, pivot to **hybrid strategy**: Pursue traditional government RFPs while maintaining NGO focus (dual-track sales). Risk: Higher CAC, slower growth, but ensures government revenue.

---

#### Innovation 4: Gamification in Govtech

**Hypothesis:** Points and reputation systems will increase sustained engagement without government rejection (framing as "impact tracking").

**Validation Metrics (Sprint 2-4):**

- **Primary:** ≥40% of users return within 30 days (retention signal)
- **Secondary:** Average actions per user ≥3 (reports + verifications + proofs)
- **Government acceptance:** Zero government pilot rejections citing gamification concerns

**Framing Strategy for Government:**

- Present as **"Community Impact Dashboard"** (not gamification)
- Emphasize **transparency and accountability** (quantified contributions)
- Show government trust scores as **accountability metrics** (not competitive leaderboards)
- Avoid game-like language in government demos (no "levels", "badges", "achievements")

**Fallback Plan:** If government agencies reject gamification despite framing, implement **toggle feature**: Government orgs can disable points display in their view while community members still see points (dual interface). Reduces innovation impact but maintains government adoption path.

---

### Risk Mitigation

**Innovation Risk Matrix:**

| Innovation             | Success Probability | Impact if Fails                                   | Mitigation Strategy                                                      |
| ---------------------- | ------------------- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| Community Verification | 75% (high)          | Medium - Can revert to gov-only validation        | Accuracy tracking, moderator review, verified member role fallback       |
| Action Cards           | 80% (high)          | Medium - Can simplify to NGO announcement feature | Coordination workflows, approval gates, assignment visibility            |
| Trojan Horse GTM       | 60% (medium)        | High - Core business model at risk                | Track demand signals monthly, pivot to hybrid sales at Month 9 if needed |
| Gamification           | 85% (high)          | Low - Can remove points without platform failure  | Government-specific framing, toggle feature, de-emphasize in sales       |

**Highest Risk:** Trojan Horse strategy (60% confidence) - if NGO adoption doesn't drive government demand, we need fast pivot to traditional sales. **Mitigation:** Monthly demand signal tracking (government inquiries, observer accounts, data API usage) with pivot decision at Month 9 (before runway runs out).

**Lowest Risk:** Gamification (85% confidence) - proven in other civic tech (iNaturalist has 2.5M users with gamified nature reporting). **Mitigation:** Frame as "impact tracking" not "gaming", offer toggle for government orgs.

**Validation Timeline:**

- **Month 3 (end of Sprint 3):** Community verification accuracy check (≥90% threshold)
- **Month 4 (end of Sprint 4):** Action Card coordination effectiveness (≥50% resolution rate)
- **Month 6:** Trojan Horse demand signals (≥1 government inquiry)
- **Month 9:** Trojan Horse pivot decision point (≥3 government pilots or pivot to hybrid)
- **Month 12:** Full innovation validation (all 4 innovations proven or mitigated)

---

## Africa-First Design Philosophy

### Why Africa Requires Different Design

EcoPulse is **Africa-first by design**, not an afterthought adaptation of Western civic tech. Sub-Saharan African communities face unique challenges that traditional 311 platforms ignore:

**Infrastructure Reality:**

- **Mobile-first internet**: 80%+ of Nigerian internet users access via mobile only (no desktop)
- **3G/4G networks**: Spotty coverage in urban areas, limited 4G penetration outside Lagos/Abuja
- **Data cost sensitivity**: ₦1,000/GB (~$1.30) is significant for average Nigerian ($2,000/year income)
- **Device constraints**: 2-3 year old Android devices (4GB RAM, Android 11-12) dominate market

**Social & Cultural Context:**

- **Low government trust**: Decades of corruption mean communities trust each other more than officials
- **Community-driven action**: Strong tradition of community self-help (Nigerian "town unions", Kenyan "harambee")
- **Oral communication preference**: WhatsApp voice notes more common than text messages
- **Icon/visual literacy**: Road signs, market stalls use universal symbols for diverse literacy levels

**NGO Ecosystem:**

- **Strong civil society**: Nigeria has 100,000+ registered NGOs, many focused on environmental/community issues
- **International donor funding**: USAID, DFID, Ford Foundation require verifiable impact data
- **Local autonomy**: NGOs operate independently of government (often filling gaps government can't)
- **Grassroots networks**: Community Development Associations (CDAs) organize at neighborhood level

**MVP Pragmatic Approach:**

We're building for **urban Nigerian communities first** (Lagos, Kano, Abuja) where:

- ✅ 3G/4G coverage is reliable enough for mobile-first platform
- ✅ English is widely understood as official language (defer multi-language to Phase 2)
- ✅ NGO ecosystem is mature and donor-funded
- ✅ Community self-organization is culturally normal

**Future Expansion** (Phase 2+) will add:

- Voice notes as primary input (for communities with lower literacy)
- SMS integration (for rural areas with 2G-only coverage)
- Hausa/Yoruba/Igbo/Swahili language support
- Offline-first with aggressive caching (for intermittent connectivity)

**Strategic Decision:** Ship lean MVP in English for urban Nigeria first, then expand with lessons learned. Avoid over-engineering for rural/low-literacy contexts we haven't validated yet.

---

## Web Application Specific Requirements

### Project-Type Overview

EcoPulse is a **modern web application** built with Next.js 15 (App Router with React Server Components) and Supabase backend, optimized for **African mobile-first civic engagement**. As a web app for African markets, we prioritize:

- **Mobile-first responsive design** (Nigerian community members report via smartphones)
- **3G/4G performance optimization** (fast load times on limited bandwidth)
- **Progressive enhancement** (works without JavaScript for older Android browsers)
- **Data efficiency** (minimize bandwidth usage for cost-sensitive users)
- **Icon-driven interface** (works across literacy levels with visual cues)

These web-specific requirements differentiate us from Western civic tech platforms built for high-bandwidth, desktop-centric, highly-literate users.

---

### Technical Architecture Considerations

#### Rendering Strategy: Hybrid Next.js 15 with React Server Components

**Approach:** Server-first by default with strategic client islands for interactivity.

**Server-Rendered Pages (SEO + Performance):**

- `/` Landing page (public marketing, crawlable by search engines)
- `/issues/[id]` Individual issue pages (SEO for transparency, government press releases, journalist discovery)
- `/organizations/[slug]` NGO public profiles (funder visibility, donor discovery)
- `/transparency` Public accountability dashboards (journalist access, crawlable metrics, city comparisons)

**Benefits:**

- Fast initial load for government staff on slow connections (server-rendered HTML)
- SEO-optimized for public transparency (journalists find verified issues via Google)
- Progressive enhancement supports accessibility (screen readers get semantic HTML before JavaScript loads)

**Client-Side Interactive Pages (Leaflet + Real-Time):**

- `/map` Main map interface (Leaflet requires DOM, client-side clustering)
- `/report` Issue reporting flow (camera access, geolocation APIs, photo upload)
- `/dashboard` NGO/Government dashboards (real-time data subscriptions, interactive filters)

**Benefits:**

- Rich interactivity for map manipulation (pan, zoom, pin clustering)
- Device API access (camera, GPS) for mobile reporting
- Real-time updates via WebSocket (Supabase Realtime)

**Hybrid Pages (SSR shell + Client hydration):**

- `/issues` Issue list with filters (SSR initial load, client-side filtering after hydration)
- `/verify` Verification queue (SSR for accessibility, client for photo comparison UI)

**Benefits:**

- Best of both worlds: fast initial paint (SSR) + interactive filtering (client)
- Graceful degradation if JavaScript fails to load

**Strategic Advantage:** Modern React Server Components reduce JavaScript bundle size by 40-60% vs. traditional SPA, resulting in 2-5x faster load times than competitors (SeeClickFix, Accela) still using client-side frameworks.

---

#### Browser Support Matrix: Modern Evergreen Only

**Supported Browsers (Last 2 Versions):**

- ✅ **Chrome/Edge Chromium 120+** (~95% market share, automatic updates)
- ✅ **Safari 17+** (iOS 17+, macOS Sonoma+, mobile majority)
- ✅ **Firefox 120+** (privacy-conscious users, automatic updates)

**NOT Supported:**

- ❌ **Internet Explorer 11** (Microsoft ended support June 2022)
- ❌ **Safari <17** (iOS <17, drops to <2% annually)
- ❌ **Android WebView <Chrome 100** (old budget phones, <5% usage)

**Rationale:**

_Community Members (Mobile-First):_

- Modern smartphones (iOS 17+, Android 12+) have 80% adoption within 18 months
- Camera + GPS + decent browser required for reporting (self-selecting modern devices)
- Progressive Web App (PWA) fallback for budget phones

_Government Staff (Enterprise):_

- Government enterprises modernized to Edge Chromium (Microsoft mandate 2021+)
- Legacy browser support = 2-3x development cost for <5% users (diminishing returns)
- Accessibility audits focus on standards compliance (WCAG), not legacy browser support

_NGO Coordinators (Desktop):_

- NGOs use modern Macs/PCs (Chrome, Safari, Firefox) for operational efficiency
- Zero IE11 requests in civic tech space (confirmed by Code for America, mySociety)

**Future-Proofing:**

- **WebAssembly support** (Phase 2: client-side image processing, EXIF stripping)
- **WebGPU support** (Future: advanced map rendering with 10k+ pins)
- **CSS Container Queries** (Modern responsive design, replaces media queries)

**Competitive Advantage:** While competitors support legacy browsers (bloated codebases, slower features), we're lean and fast on modern devices. Market as **"Built for 2025+"** - a speed competitive advantage.

---

#### Real-Time Requirements: Supabase Realtime (PostgreSQL LISTEN/NOTIFY)

**Strategy:** Real-time for high-value interactions, polling for low-priority updates.

**Real-Time Updates (Supabase Realtime WebSocket subscriptions):**

**Use Case 1: Verification → Action Pipeline**

- **Scenario:** Sara verifies Maria's report → Linda's NGO dashboard updates instantly
- **Why real-time:** NGO coordinators need verification confidence signals immediately for prioritization
- **Technical:** Subscribe to `issues` table changes where `organization_id = user.organization`
- **Latency:** ~50ms notification delivery (WebSocket)

**Use Case 2: Action Card Volunteer Join**

- **Scenario:** James joins volunteer team → Linda sees live count (5/10 volunteers)
- **Why real-time:** Prevents overbooking (capacity limits), enables live coordination
- **Technical:** Subscribe to `issue_actions` table where `action_card_id = current_action`
- **UX:** "James just joined!" toast notification, live counter update

**Use Case 3: Government Assignment Notifications**

- **Scenario:** David assigns issue to Public Works → Reporter + verifiers notified instantly
- **Why real-time:** Government responsiveness perception (feels fast = builds trust)
- **Technical:** Subscribe to `issues` where `user_id IN (reporter, verifiers)` AND `status = assigned`
- **Impact:** Community sees government as responsive (even if actual fix takes days)

**Polling (5-30 second intervals):**

**Use Case 1: Map Pin Updates**

- **Interval:** 30 seconds
- **Why polling:** Leaflet map re-clustering is expensive, batching updates reduces render thrashing
- **UX:** Silent background refresh (no toast spam)

**Use Case 2: Dashboard Metrics**

- **Interval:** 5 seconds ("23 issues this week" counter)
- **Why polling:** Aggregated metrics don't need instant precision, reduces database load

**Use Case 3: Issue List Views**

- **Interval:** 10 seconds
- **Why polling:** List pagination conflicts with real-time inserts (UX confusion if page jumps)

**Cost Efficiency:**

- Supabase Realtime charges by concurrent connections (not message volume)
- Real-time for 3 critical use cases = <$50/month for 1000 concurrent users
- Polling for low-value use cases reduces connection overhead

**Competitive Advantage:** Instant coordination (Linda sees Sara's verification live, creates Action Card immediately) vs. 311 systems with 24-hour refresh cycles. Market as **"Real-time civic action."**

---

### Browser-Specific Technical Requirements

#### Responsive Design (Mobile-First)

**Breakpoints:**

- **Mobile:** 320px - 767px (primary design target, 70% of community member traffic)
- **Tablet:** 768px - 1023px (secondary, 15% traffic)
- **Desktop:** 1024px+ (government/NGO staff, 15% traffic)

**Mobile-First Features:**

- Touch-optimized controls (44x44px minimum tap targets per WCAG)
- Camera integration (inline photo capture, no file upload flow)
- Geolocation auto-fill (one-tap location, no manual address entry)
- Bottom navigation (thumb-friendly for one-handed use)
- Pull-to-refresh (native mobile gesture for issue list updates)

**Desktop Enhancements:**

- Multi-column layouts for dashboards (NGO coordinators scan 23 reports efficiently)
- Keyboard shortcuts (power users: Ctrl+K command palette, arrow keys for map navigation)
- Hover states (desktop mice reveal additional context without tap)

**Responsive Images:**

- Next.js Image component with automatic srcset generation
- Mobile: 640px width (reduce bandwidth on cellular)
- Tablet: 1024px width
- Desktop: 1920px width
- Lazy loading below fold (reduce initial page weight)

---

### Performance Targets (Core Web Vitals for Government Compliance)

**Core Web Vitals Thresholds ("Good" rating required):**

**Largest Contentful Paint (LCP) - Loading Performance:**

- **Target:** <2.5 seconds at 75th percentile
- **Critical pages:** Landing page, issue detail, map interface
- **Measurement:** Lighthouse CI on every deploy (GitHub Actions)
- **Strategy:**
  - Next.js Image optimization (automatic WebP, responsive srcsets)
  - Supabase CDN for photo delivery (global edge caching)
  - Code splitting (only load JavaScript needed for current page)
  - Lazy load below-the-fold content

**First Input Delay (FID) / Interaction to Next Paint (INP) - Interactivity:**

- **Target:** <100ms at 75th percentile (FID) / <200ms (INP)
- **Critical interactions:** "Report Issue" button, map pin clicks, form submissions
- **Strategy:**
  - Defer non-critical JavaScript (analytics, chat widgets)
  - React Server Components reduce client bundle size 40-60%
  - Main thread kept free (no long tasks >50ms)

**Cumulative Layout Shift (CLS) - Visual Stability:**

- **Target:** <0.1 at 75th percentile
- **Critical for accessibility:** Screen reader users, keyboard navigation (no unexpected jumps)
- **Strategy:**
  - Reserve space for images (aspect-ratio CSS, width/height attributes)
  - No dynamic ads or injected content
  - Skeleton loaders for async content (prevent layout shift on load)
  - Font loading optimization (font-display: swap with fallback matching)

**Additional Performance Targets:**

**Map Load Performance (<1s with 1000 pins):**

- **Measurement:** Time to first pin render on `/map`
- **Current benchmark:** <1 second (defined in Success Criteria)
- **Strategy:**
  - Leaflet MarkerCluster plugin (renders clusters not individual pins until zoom)
  - Viewport culling (only render pins in visible map bounds)
  - Canvas rendering for high-density clusters (faster than DOM)
- **Validation:** Load testing with realistic Oakland data (500-1000 issues)

**Dashboard Load Performance (<2s):**

- **Measurement:** Time to interactive for Linda's NGO dashboard with 23 reports
- **Target:** <2 seconds on 4G Fast (10 Mbps)
- **Strategy:**
  - Server-side aggregation (PostgreSQL queries, not client-side filtering)
  - Data table virtualization (only render visible rows, not all 23)
  - Prefetch critical data on hover (anticipate user actions)

**Mobile Network Performance (3G/4G):**

- **Target:** <5 seconds on 3G Fast (1.6 Mbps down, 750ms RTT)
- **Critical:** Community members reporting in field with spotty coverage
- **Strategy:**
  - Service Worker caching (offline-first for critical paths)
  - Low-res photo uploads (compress client-side before upload)
  - Lazy loading images (only load when scrolled into view)
  - Request coalescing (batch API calls to reduce round trips)

**Progressive Web App (PWA) Capabilities:**

- **Installability:** Passes PWA audit (manifest.json, service worker, HTTPS)
- **Offline capability:** Report drafts saved locally (IndexedDB), sync when online
- **Add to Home Screen:** Mobile users can install for native-like experience
- **Background sync:** Failed uploads retry automatically when connection restored

**Monitoring & Enforcement:**

- Lighthouse CI in GitHub Actions (fails PR if Core Web Vitals drop below "Good")
- Real User Monitoring (RUM) via Vercel Analytics (measure actual user experiences)
- Performance budgets (max bundle size: 200KB initial, 50KB per route)

**Competitive Advantage:** Legacy 311 systems load in 5-10 seconds (heavy enterprise frameworks). Modern stack (Next.js 15 + Supabase) enables <2s page loads = **3-5x faster**. Speed = user retention = network effects.

---

### SEO Strategy (Public Transparency + Privacy Balance)

**Approach:** Selective indexing for public accountability, opt-out for privacy.

**Indexed Content (Public SEO):**

**Individual Issue Pages (`/issues/[id]`):**

- **Use case:** Journalist searches "Oakland illegal dumping Broadway 2025" → finds EcoPulse report
- **Content:** Issue photos, verifications, resolution proof, government response time
- **Meta tags:**
  - Dynamic title: `"Illegal Dumping at Broadway & 12th - Resolved"`
  - Description: First 160 chars of note + status
  - Open Graph image: Issue photo (social media previews)
- **Schema.org markup:** Structured data for Google Rich Results
  ```json
  {
    "@type": "Report",
    "location": { "latitude": 37.8044, "longitude": -122.2712 },
    "dateReported": "2025-01-15",
    "status": "resolved",
    "resolvedBy": "Oakland Public Works"
  }
  ```
- **Privacy protection:** Only verified issues indexed (anonymous pending reports NOT indexed until 2+ verifications)

**Organization Profiles (`/organizations/[slug]`):**

- **Use case:** Donor searches "Oakland Green Alliance environmental impact" → finds public profile
- **Content:** Issues addressed, volunteer hours, resolution rate %, impact photos
- **Strategic value:** NGOs use EcoPulse profile as **public impact page** (links from grant applications, donor reports)
- **SEO benefit:** Backlinks from NGO websites → domain authority boost

**Public Transparency Dashboards (`/transparency`):**

- **Use case:** City Council searches "Oakland environmental issues 2025" → finds real-time dashboard
- **Content:** Aggregated city metrics, government response rates, trending issues, peer city comparisons
- **Strategic value:** Journalists cite EcoPulse data in articles = backlinks = SEO authority
- **Media coverage:** "Oakland resolves drainage issues 3x faster than San Francisco" (data-driven journalism)

**NOT Indexed (Privacy Protection):**

**User Profiles (`/users/[username]`):**

- `robots.txt: Disallow: /users/` (prevents personal data exposure)
- Users can opt-in to public profiles (future feature for reputation/credibility)

**Anonymous Reports (Pending Verification):**

- `<meta name="robots" content="noindex">` until 2+ verifications
- Prevents spam/fake reports from polluting search results
- Protects anonymous reporters (no public exposure until community validates)

**Internal Dashboards:**

- `/dashboard/*` requires authentication (Next.js middleware redirect)
- Government/NGO operational data never indexed (private by design)

**Technical Implementation:**

**Next.js Dynamic Metadata Generation:**

```typescript
// app/issues/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const issue = await getIssue(params.id);
  const isIndexable = issue.verification_count >= 2;

  return {
    title: `${issue.category} at ${issue.location} - ${issue.status}`,
    description: issue.note.substring(0, 160),
    openGraph: {
      images: [issue.photo_url],
      type: 'article',
      publishedTime: issue.created_at,
    },
    robots: isIndexable ? 'index,follow' : 'noindex',
  };
}
```

**Sitemap Generation:**

- `/sitemap.xml` dynamically generated from verified issues + org profiles
- Updated daily (Supabase cron job triggers Next.js revalidation)
- Submitted to Google Search Console for crawl prioritization
- Split sitemaps (issues, organizations, static pages) for large datasets

**Canonical URLs:**

- Prevent duplicate content penalties (same issue accessible via multiple paths)
- `<link rel="canonical" href="https://ecopulse.app/issues/123" />`

**Strategic Benefits:**

**Public Accountability:**

- Indexed issues = searchable record of government responsiveness
- Government can't hide from "Oakland took 45 days to fix this" search results
- External accountability pressure (press coverage drives government action)

**Network Effects:**

- Journalists discover EcoPulse data → cite in articles → backlinks → SEO authority → more organic traffic → more community members
- Flywheel: More indexed issues → higher search rankings → more discovery → more reports → more data → more press coverage

**Privacy Balance:**

- Only verified issues indexed (spam/fake reports filtered out)
- Anonymous reporters protected (no personal data in meta tags)
- Opt-out available (users can request issue de-indexing for sensitive cases)

**Competitive Advantage:** 311 systems (SeeClickFix, Accela) hide data behind authentication walls. We make government responsiveness **publicly searchable**. Market as **"Google-indexed civic accountability"** - our transparency moat.

---

### Accessibility Implementation (Web-Specific)

**Note:** Comprehensive accessibility requirements already documented in Domain-Specific Requirements (Section 508/WCAG 2.1 AA). Web-specific implementation details:

**Semantic HTML Structure:**

- Proper heading hierarchy (H1 → H2 → H3, no skipping)
- Landmark regions (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
- Form labels (`<label for="issue-note">`) associated with inputs
- Button vs. link semantics (`<button>` for actions, `<a>` for navigation)

**Keyboard Navigation:**

- All interactive elements focusable via Tab key
- Focus indicator visible (4.5:1 contrast ratio, 2px outline)
- Skip navigation links ("Skip to main content" for screen readers)
- Map interface keyboard accessible (arrow keys pan, +/- zoom, Enter selects pin)
- Modal dialogs trap focus (Esc key closes, focus returns to trigger)

**Screen Reader Optimization:**

- ARIA labels on icon-only buttons (`aria-label="Report Issue"`)
- ARIA live regions for dynamic updates (`aria-live="polite"` for notifications)
- ARIA describedby for form field hints
- Hidden decorative images (`role="presentation"` on background images)

**Color Contrast:**

- Text: 4.5:1 minimum (WCAG AA)
- Large text (18pt+): 3:1 minimum
- Interactive elements: 3:1 against background
- Automated testing: axe DevTools, Lighthouse accessibility score >95

**Touch Targets (Mobile Accessibility):**

- Minimum 44x44px tap targets (WCAG 2.1 Success Criterion 2.5.5)
- Adequate spacing between interactive elements (8px minimum)
- No hover-only interactions (mobile users can't hover)

**Form Accessibility:**

- Error messages announced to screen readers (`aria-live="assertive"`)
- Required fields marked with `aria-required="true"` and visual indicator
- Form validation on blur (not just submit) for immediate feedback
- Clear error recovery ("Address must include city and state")

---

### Implementation Considerations

**Technology Stack (Locked):**

- **Framework:** Next.js 15 with App Router (React Server Components)
- **Backend:** Supabase (PostgreSQL 15+, Auth, Storage, Realtime)
- **Hosting:** Vercel (automatic deployments, edge functions, analytics)
- **Maps:** Leaflet 1.9+ with MarkerCluster plugin
- **Styling:** Tailwind CSS 4.0 (utility-first, optimized for production)
- **UI Components:** Radix UI primitives (accessible by default)

**Development Workflow:**

- TypeScript strict mode (type safety, fewer runtime errors)
- ESLint + Prettier (code quality, consistent formatting)
- Husky pre-commit hooks (lint, format, type-check before commit)
- GitHub Actions CI/CD (test, build, deploy on every push)
- Lighthouse CI (performance regression testing)

**Deployment Strategy:**

- Vercel preview deployments (every PR gets unique URL for testing)
- Staging environment (staging.ecopulse.app) for government pilot
- Production environment (ecopulse.app) with zero-downtime deployments
- Rollback capability (instant revert to previous deployment if issues)

**Monitoring & Observability:**

- Vercel Analytics (Real User Monitoring for Core Web Vitals)
- Sentry error tracking (catch and fix bugs before users report)
- Supabase logs (database query performance, API errors)
- Uptime monitoring (alerts if site goes down, 99.9% SLA)

**Risk Mitigation:**

- **Browser compatibility:** Automated testing via BrowserStack (Chrome, Safari, Firefox on real devices)
- **Performance regression:** Lighthouse CI fails PR if metrics drop below thresholds
- **Accessibility regression:** axe DevTools in CI, manual screen reader testing quarterly
- **SEO regression:** Sitemap validation, Search Console monitoring for index coverage

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach: Platform MVP with Intermediate Team Constraints**

EcoPulse follows a **"Crawl, Walk, Run"** development philosophy optimized for an intermediate development team:

- **Crawl (Sprint 1-4):** Build the foundation - core user loops working reliably with simple implementations
- **Walk (Phase 2, Months 4-12):** Enhance validated features with advanced capabilities after learning from MVP
- **Run (Phase 3, 12-24 months):** Scale and expand with enterprise features, new markets, advanced integrations

**Strategic Rationale:**

This MVP prioritizes **user value delivery over technical sophistication**. We're solving the core problem (distributed environmental action) with the simplest possible implementations that an intermediate team can deliver with high quality. Complex features (real-time chat, advanced moderation, bidirectional API sync) are deferred until after MVP validation proves they're worth the development investment.

**Key Design Decisions:**

1. **Manual processes acceptable at low scale** (<500 users) - admin moderates via Supabase dashboard, no custom UI needed
2. **External workarounds encouraged** - volunteers coordinate via email instead of in-app chat
3. **Read-only integrations first** - government pulls data before building write endpoints
4. **Simplest implementation wins** - feature flag buttons over complex workflows

This approach reduces MVP complexity by ~25% (30 development days saved) while delivering 80% of user value, enabling faster validation of our 4 core innovations.

---

### Resource Requirements

**MVP Team Size (Sprint 1-4, 12 weeks):**

- **1 Full-Stack Developer** (intermediate level, Next.js + Supabase experience)
- **1 Designer/UX** (part-time, 50%, creates flows and components)
- **1 PM/Product Owner** (part-time, 25%, manages backlog and decisions)
- **Optional: 1 Accessibility Consultant** (contract, Sprint 2 audit)

**Phase 2 Team Expansion (Months 4-12):**

- **2 Full-Stack Developers** (add 1 more for advanced features)
- **1 Designer/UX** (full-time for NGO/Government dashboards)
- **1 PM/Product Owner** (full-time for government partnerships)
- **Optional: 1 Backend Specialist** (for API integrations, webhooks)

**Key Skills Required:**

- **Frontend:** Next.js 15, React Server Components, Tailwind CSS, Leaflet maps
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime), REST API design
- **Accessibility:** WCAG 2.1 AA compliance, screen reader testing, keyboard navigation
- **DevOps:** Vercel deployment, GitHub Actions CI/CD, Lighthouse CI

---

### MVP Feature Set (Phase 1: Sprint 1-4)

**Core User Journeys Supported:**

The MVP supports **4 of 8 user journeys** completely, with partial support for 2 more:

✅ **Fully Supported:**

1. **Maria (Community Reporter):** Report issue → See on map → Earn points → Track resolution
2. **Sara (Neighborhood Validator):** Find nearby reports → Verify with photo → Build reputation → See impact
3. **Linda (NGO Coordinator):** View verified reports → Create Action Cards → Coordinate volunteers → Export funder reports
4. **Alex (Anonymous Reporter):** Report without account → Community verifies → Convert to authenticated → Track success

⚠️ **Partially Supported:** 5. **James (Student Volunteer):** Find actions → Sign up → Upload proof → Earn volunteer hours _(No in-app chat, email coordination)_ 6. **Kevin (311 Developer):** Read API docs → Pull verified reports → Create work orders _(Read-only API, no bidirectional sync)_

❌ **Deferred to Phase 2:** 7. **Michelle (Moderator):** Flag review via Supabase admin panel _(No custom moderator dashboard)_ 8. **David (Government Staff):** No government dashboard in MVP _(Phase 2 per strategic decisions)_

---

### Must-Have Capabilities (Sprint 1-4 Breakdown)

#### Sprint 1 (Weeks 1-3): Core Reporting + Map

**Essential Features:**

- ✅ **Issue reporting flow:** Mobile-first form with camera integration, geolocation auto-fill, required fields (photo, note, location, severity, category)
- ✅ **Map visualization:** Leaflet map with pin clustering, issue status colors (pending/verified/resolved), tap to view details
- ✅ **Anonymous reporting:** Submit without account, marked "Pending Verification" until 2+ authenticated verifications
- ✅ **User authentication:** Email signup via Supabase Auth, profile creation
- ✅ **Points system:** +5 points for issue report, display on user profile
- ✅ **Issue detail page:** View report with photo, note, location, severity, verification count

**Technical Implementation:**

- Next.js 15 App Router with React Server Components
- Supabase PostgreSQL database (issues, users, organizations tables)
- Leaflet map with MarkerCluster plugin
- Supabase Storage for photo uploads with automatic EXIF stripping
- Mobile-responsive design (320px-767px primary target)

**Success Criteria:**

- Community member can report issue in <2 minutes on mobile
- Map loads in <1 second with 100 pins (performance target)
- Anonymous reports accepted and marked "Pending"
- Accessibility: Lighthouse score >90, keyboard navigable

---

#### Sprint 2 (Weeks 4-6): Verification + User Profiles

**Essential Features:**

- ✅ **Verification flow:** "Verify this issue" button on issue detail, upload verification photo, add context note, timestamp/location auto-captured
- ✅ **Multi-verifier display:** Show original photo + verification photos side-by-side, verification timestamps, verifier usernames
- ✅ **Verification threshold:** Anonymous reports promoted to verified after 2+ authenticated verifications (status change + map pin color change)
- ✅ **User profiles:** Display reports submitted, verifications contributed, points earned, success rate %, volunteer hours (if applicable)
- ✅ **Points for verification:** +3 points per verification, validation rate % tracking
- ✅ **Community flagging:** "Flag as spam/inappropriate" button on reports and photos (simple boolean field)

**Technical Implementation:**

- Verifications table (issue_id, user_id, photo_url, note, timestamp)
- Profile page with aggregated stats (SQL queries for counts)
- RLS policies ensure users can only verify others' reports (not their own)
- Flag system: `is_flagged` boolean on issues, admin reviews via Supabase dashboard

**Success Criteria:**

- ≥90% verification accuracy (verified reports are valid when resolved)
- Average 2.0 verifications per report
- Verifier reputation tracking functional (validation rate %)
- Accessibility audit completed (axe DevTools, WCAG 2.1 AA)

---

#### Sprint 3 (Weeks 7-9): NGO Dashboard + Action Cards

**Essential Features:**

- ✅ **NGO Dashboard:** Organization-scoped view of verified reports in coverage area, auto-prioritization (verification count + severity + vulnerability zip codes)
- ✅ **Action Card creation:** NGO creates action plan (title, description, date, location, capacity limit, checklist template)
- ✅ **Volunteer sign-up:** Community members click "I'll help" → name added to participant list (simple CRUD)
- ✅ **Action Card assignment:** Attach Action Card to one or multiple issues (bulk assignment)
- ✅ **Proof upload:** NGO or volunteer uploads before/after photos, tags participants, marks issues resolved
- ✅ **Bulk issue resolution:** One proof closes all issues attached to Action Card
- ✅ **Funder report export:** CSV export with columns (issues addressed, volunteer hours, resolution rate, engagement count, before/after photos)
- ✅ **Organization profiles:** Public `/organizations/[slug]` pages with basic info (name, coverage area, contact email, issues addressed count)

**NOT in Sprint 3 (Deferred to Phase 2):**

- ❌ Team chat/messaging for volunteers (use email coordination)
- ❌ Volunteer check-in tracking with GPS (manual attendance)
- ❌ Role assignments (team lead, coordinator roles)

**Technical Implementation:**

- NGO Dashboard: Organization-scoped queries with RLS policies
- Action Cards table (title, description, date, capacity, organization_id, issue_ids[])
- Participant join: Simple many-to-many table (action_card_id, user_id)
- CSV export: Server-side generation with aggregated metrics
- Organization profiles: Next.js dynamic routes with SSR for SEO

**Success Criteria:**

- NGOs save 10 hours → 1 hour per month on funder reporting
- ≥50% of Action Cards result in issue resolution (proof uploaded)
- Volunteer sign-up functional, participant list displays
- Linda's complete journey works end-to-end

---

#### Sprint 4 (Weeks 10-12): Polish + Public API + Contact Directory

**Essential Features:**

- ✅ **Public read-only API:** REST endpoints for verified reports (GET /api/reports), organization profiles (GET /api/organizations), JSON responses with pagination
- ✅ **API authentication:** Simple token-based authentication for rate limiting (100 requests/hour for public tier)
- ✅ **API documentation:** Markdown docs with endpoint descriptions, request/response examples, authentication instructions
- ✅ **Contact Directory:** Public organization directory page with search/filter by city and category (dropdown filters)
- ✅ **Organization discovery:** SEO-indexed org profiles for donor/funder discovery
- ✅ **Issue resolution workflow:** Community members or government can upload "resolution proof" photos, mark issue as resolved, earn +5 points
- ✅ **Notification system:** Basic email notifications for issue status changes (assigned, resolved) via Supabase triggers
- ✅ **Accessibility final testing:** Screen reader testing (NVDA, JAWS, VoiceOver), keyboard-only navigation validation
- ✅ **Performance optimization:** Lighthouse CI enforcement, Core Web Vitals monitoring, image optimization

**NOT in Sprint 4 (Deferred to Phase 2):**

- ❌ Bidirectional API sync (write endpoints, webhooks, status updates from 311)
- ❌ OAuth 2.0 enterprise authentication (token-based sufficient for MVP)
- ❌ Developer portal with interactive API explorer (markdown docs sufficient)
- ❌ In-app contact forms for organizations (email directly for MVP)

**Technical Implementation:**

- Next.js API routes exposing Supabase data with RLS filters (public data only)
- Token-based rate limiting via middleware
- Organization directory: Simple list page with SQL filtering
- Email notifications: Supabase database triggers → edge functions → SendGrid/Resend
- Accessibility: Manual testing with screen readers, keyboard navigation audit

**Success Criteria:**

- Public API functional with JSON responses
- Kevin (311 dev) can pull verified reports programmatically
- Organization directory indexed by Google (SEO validation)
- Core Web Vitals "Good" rating (LCP <2.5s, FID <100ms, CLS <0.1)
- WCAG 2.1 AA compliance validated (screen reader testing passed)

---

### MVP Scope Summary: What's IN vs. OUT

**IN (Sprint 1-4):**
| Feature | Sprint | User Value |
|---------|--------|------------|
| Issue reporting (auth + anon) | 1 | Core loop |
| Map visualization with pins | 1 | Discovery |
| Points/gamification | 1 | Engagement |
| Second-person verification | 2 | Trust/validation |
| User profiles with stats | 2 | Reputation |
| Community flagging | 2 | Quality control |
| NGO Dashboard | 3 | Coordination |
| Action Card creation | 3 | Structured action |
| Volunteer sign-up (simple) | 3 | Participation |
| Funder report export | 3 | NGO retention |
| Public read-only API | 4 | Gov integration |
| Organization directory | 4 | Discovery |
| Issue resolution proof | 4 | Accountability loop |
| Email notifications | 4 | Engagement |

**OUT (Phase 2):**
| Feature | Rationale | Deferred Until |
|---------|-----------|----------------|
| Team chat for Action Cards | Complex infrastructure, email workaround acceptable | Month 6 (after 30+ Action Cards validated) |
| Custom moderator dashboard | Manual via Supabase sufficient at <500 users | Month 9 (after spam patterns identified) |
| Bidirectional API sync | Read-only proves value first, write after pilot | Month 6 (after government pilot requests) |
| Government Dashboard | Strategic decision: NGOs first, gov Phase 2 | Month 9 (after 3+ gov pilot requests) |
| Advanced moderation | Duplicate detection, AI spam filtering | Month 12 (after scale necessitates) |
| Volunteer check-in tracking | GPS verification, attendance over-engineered | Month 9 (after 50+ Action Cards) |
| Developer portal | Interactive API explorer, SDKs | Month 12 (after 5+ API consumers) |
| In-app org messaging | Spam risk, moderation burden | Month 9 (after contact spam measured) |

---

### Post-MVP Features (Phase 2: Months 4-12)

**Growth Features (After MVP Validation):**

**Enhanced Action Coordination:**

- **Team chat for Action Cards:** Real-time messaging for volunteer coordination (WebSocket via Supabase Realtime)
- **Volunteer check-in tracking:** GPS-based attendance verification, live participant count
- **Role assignments:** Team lead, coordinator, volunteer roles with permissions
- **Action Card templates:** Pre-built templates for common actions (cleanup, drain clearing, tree planting)

**Government Integration:**

- **Government Dashboard:** District-filtered issue queue, assignment workflows, internal notes, official resolution proofs, trust score tracking
- **Bidirectional API sync:** Write endpoints for status updates, webhook notifications for real-time events, OAuth 2.0 for enterprise auth
- **311 system integration:** Auto-create work orders from verified EcoPulse reports, sync resolution status back
- **Public accountability dashboards:** Real-time government response metrics, embeddable widgets, peer city comparisons

**Advanced Moderation:**

- **Custom moderator dashboard:** Flag queue with filtering, bulk actions (delete, suspend, merge), user history analysis
- **Duplicate detection:** Algorithm to find similar reports (geolocation proximity + text similarity), merge workflow with primary/secondary selection
- **Automated spam prevention:** Rate limiting (max reports per hour), new account restrictions, pattern detection
- **Appeal workflow:** Suspended users can contest, admin reviews with audit trail

**Enhanced Data & Transparency:**

- **Multi-jurisdiction taxonomy:** Custom category names per organization (Oakland: "Illegal Dumping", SF: "Refuse Violation")
- **Department routing:** Automatic assignment to correct government department based on category
- **Advanced analytics:** Heatmaps, time series trends, predictive hotspot modeling
- **Public data portal:** Aggregated city metrics, downloadable datasets (CSV, GeoJSON), Creative Commons licensing

**Privacy Enhancements:**

- **AI photo privacy:** Automatic face blurring, license plate detection, PII warnings before upload
- **GDPR compliance:** Cookie consent management, data portability, right to be forgotten workflows
- **Self-hosting option:** Containerized deployment (Docker/Kubernetes) for governments requiring data residency

**Mobile Enhancements:**

- **Progressive Web App:** Offline reporting with draft sync when online, background sync for failed uploads
- **Push notifications:** Real-time issue status updates, Action Card reminders, verification requests
- **Native mobile apps:** iOS/Android apps with deeper device integration (future, if PWA insufficient)

---

### Expansion Features (Phase 3: 12-24 months)

**Global Scale:**

- **Multi-language support:** 10+ languages with localized content
- **Regional adaptation:** Different waste/drainage systems by country (US vs. EU vs. APAC)
- **Currency localization:** Pricing in local currencies for international NGOs/governments

**Impact Measurement:**

- **Carbon impact calculator:** Tons of waste diverted, emissions reduced from cleanup actions
- **Water quality tracking:** Integration with EPA water quality APIs, flood prevention impact modeling
- **Community health metrics:** Correlation with public health data (vermin reduction, flood prevention)

**Ecosystem Expansion:**

- **Partnership marketplace:** Connect NGOs with corporate sponsors for action funding
- **Impact investment platform:** Crowdfunding for community environmental projects
- **Developer ecosystem:** Open-source verification module, SDKs for third-party apps
- **White-label platform:** License EcoPulse to other cities/countries with custom branding

**Advanced Govtech:**

- **Blockchain verification:** Immutable trust records for high-stakes government accountability
- **Inter-city collaboration network:** Share best practices, aggregate data across peer cities
- **Policy recommendation engine:** AI suggests policy changes based on verified issue patterns
- **Integration with GIS systems:** Overlay environmental data with infrastructure maps

---

## Africa-Specific Future Roadmap (Phase 2+)

### Deferred Features for Future African Expansion

**Why Deferring These Features:**
These capabilities are **critical for long-term African market success** but add significant technical complexity. We're validating core platform value (verification, Action Cards, community coordination) in urban English-speaking Nigeria first, then adding these enhancements based on user feedback and scale economics.

---

### Phase 2: Enhanced African Accessibility (Months 6-12)

**Voice Notes as Primary Input:**

- **Use Case:** Illiterate community members record verbal report instead of typing text
- **Technical:** Audio file storage (Supabase Storage), max 5 minutes/10MB per note
- **UX:** WhatsApp-style hold-to-record button, playback before submit, optional text transcription (AI, Phase 3)
- **Validation Trigger:** ≥30% of reports submitted as text-only in MVP → voice needed
- **Cost:** ~$2/month audio storage (cheap), transcription ~$0.006/minute (if added)

**Multi-Language Content (Hausa, Yoruba, Igbo):**

- **Use Case:** Non-English speaking community members in Kano (Hausa), Ibadan (Yoruba), Enugu (Igbo)
- **Technical:** Next.js i18n framework already implemented in MVP, add translation files
- **UX:** Language selector in settings, browser language auto-detection
- **Validation Trigger:** User requests for non-English content from ≥20 users/month
- **Cost:** Translation services ~$0.10/word × 5,000 words = $500 per language (one-time)

**Offline-First with Aggressive Caching:**

- **Use Case:** Users in areas with intermittent 3G coverage can draft reports offline, auto-sync when online
- **Technical:** Service Worker for PWA, IndexedDB for local storage, background sync API
- **UX:** "Drafts saved locally" indicator, auto-sync queue shows pending uploads
- **Validation Trigger:** ≥15% of report submissions fail due to connectivity issues
- **Cost:** No additional infrastructure cost (client-side only)

---

### Phase 2: SMS Integration for Scale (Months 9-12)

**SMS Notifications (Africa's Talking API):**

- **Use Case:** Rural users with 2G-only coverage, users who prefer SMS over email
- **Technical:** Africa's Talking SDK integration, webhook for delivery status
- **Cost:** ~$0.02/SMS × 5,000 users × 3 notifications/month = **$300/month** at scale
- **Validation Trigger:** ≥1,000 active Nigerian users justify SMS infrastructure cost
- **Geographic Coverage:** Nigeria, Kenya, Uganda, Tanzania (Africa's Talking footprint)

**SMS Report Submission (Inbound SMS):**

- **Use Case:** Users without smartphones text reports to dedicated number
- **Technical:** Africa's Talking inbound SMS webhook → parse → create report with "SMS" tag
- **UX:** Dedicated SMS shortcode (e.g., "Text 32100"), structured format guide
- **Cost:** ~$0.02/inbound SMS + manual moderation for unstructured text reports
- **Validation Trigger:** ≥50 user requests for SMS reporting capability

---

### Phase 3: Low-Literacy Enhancements (Months 12-18)

**Audio Guidance & Text-to-Speech:**

- **Use Case:** Illiterate users navigate app via audio instructions ("Tap camera button to take photo")
- **Technical:** Google Cloud Text-to-Speech API, pre-recorded audio for common actions
- **Cost:** ~$4/million characters × 50,000 chars = $0.20/month (cheap at scale)
- **Validation Trigger:** User testing reveals difficulty with text-only instructions

**Icon-Driven UI Enhancements:**

- **Use Case:** Visual category selection without reading text
- **Technical:** Emoji/icon library for categories (🗑️ Waste, 🌊 Drainage), severity (😊😐😰)
- **UX:** Large tap targets with icons + minimal text labels
- **Cost:** Design work only (no infrastructure cost)
- **Validation Trigger:** User feedback requests more visual/less text interface

---

### Phase 3+: Rural & Remote Expansion (18-24 months)

**2G Network Optimization:**

- **Use Case:** Rural communities with only 2G EDGE coverage (50-100 kbps)
- **Technical:** Ultra-compressed images (<50KB), text-only mode, aggressive caching
- **Validation Trigger:** Expansion beyond Lagos/Kano/Abuja to rural states
- **Cost:** No additional infrastructure, but dev time for extreme optimization

**USSD/Feature Phone Support:**

- **Use Case:** Communities without smartphones use basic feature phones
- **Technical:** USSD menu integration (\*123# shortcodes), Africa's Talking USSD API
- **Validation Trigger:** ≥100 requests for feature phone access
- **Cost:** ~$100/month USSD gateway rental + $0.01/session

---

### Validation Gates for Phase 2+ Features

**Decision Framework:**

- **Voice Notes:** Implement when ≥30% text reports are <10 words (signal users want audio)
- **Multi-Language:** Implement when ≥20 user requests/month for specific language
- **Offline-First:** Implement when ≥15% submissions fail due to connectivity
- **SMS Notifications:** Implement when ≥1,000 active users (justify $300/month cost)
- **SMS Reporting:** Implement when ≥50 user requests for SMS submission
- **2G Optimization:** Implement when expanding beyond urban Lagos/Kano/Abuja

**Prioritization:** User feedback + usage analytics drive feature prioritization, not roadmap dates.

---

### Risk Mitigation Strategy

#### Technical Risks

**Risk 1: Intermediate Team Overwhelmed by Complexity**

- **Probability:** Medium (40%)
- **Impact:** High (delays MVP delivery by 4-8 weeks)
- **Mitigation:**
  - Simplified MVP scope removes 30 days of complex features (chat, advanced moderation, bidirectional API)
  - Weekly code reviews to catch complexity creep early
  - External contractors for specialized needs (accessibility audit, security review)
  - Documented fallback: Cut Sprint 4 features if Sprint 3 slips, launch with 3-sprint MVP
- **Monitoring:** Track sprint velocity, adjust scope if velocity drops below 70% of planned

**Risk 2: Accessibility Compliance Failure**

- **Probability:** Low (20%)
- **Impact:** Critical (government cannot adopt, blocks revenue)
- **Mitigation:**
  - Accessibility built-in from Sprint 1 (semantic HTML, ARIA labels, keyboard nav)
  - Sprint 2 automated audit (axe DevTools, Lighthouse)
  - Sprint 4 manual screen reader testing with blind/low-vision users
  - Contract accessibility consultant for Sprint 2 audit ($2k-5k)
- **Monitoring:** Lighthouse accessibility score >90 enforced in CI, fails PR if drops

**Risk 3: Performance Degradation at Scale**

- **Probability:** Medium (30%)
- **Impact:** Medium (user retention suffers, government pilots reject)
- **Mitigation:**
  - Core Web Vitals targets enforced via Lighthouse CI
  - Load testing in Sprint 4 with 1,000 issues, 10,000 pins on map
  - Supabase connection pooling and query optimization
  - CDN for photo delivery (Supabase Storage includes global CDN)
- **Monitoring:** Real User Monitoring via Vercel Analytics, alert if LCP >3s or FID >200ms

---

#### Market Risks

**Risk 1: Trojan Horse Strategy Fails (NGO → Gov funnel broken)**

- **Probability:** Medium-High (40% per Innovation section)
- **Impact:** Critical (core business model at risk, $300k ARR target missed)
- **Mitigation:**
  - Monthly demand signal tracking: Government inquiries, observer account signups, API usage
  - Pivot decision at Month 9: If <3 government pilots, switch to hybrid sales (NGO + traditional gov RFPs)
  - Maintain relationships with Oakland Public Works during MVP (David's pilot)
- **Monitoring:**
  - Month 3: ≥1 government inquiry (first demand signal)
  - Month 6: ≥1 government pilot launched
  - Month 9: ≥3 government pilots or pivot to hybrid

**Risk 2: Community Verification Accuracy Below 90%**

- **Probability:** Low-Medium (25% per Innovation section)
- **Impact:** Medium (undermines trust, government rejects platform)
- **Mitigation:**
  - Anti-gaming measures: Different angle photo required, timestamp/location stamping, reputation tracking
  - Fallback: Implement "verified community member" role (government approves trusted verifiers)
  - Moderation: Michelle flags suspicious verification patterns for admin review
- **Monitoring:**
  - Month 3: Measure verification accuracy (% of verified reports that resolve)
  - Target: ≥90% accuracy, red flag if <70%
  - Quarterly review of validation rate % per verifier

**Risk 3: Gamification Rejected by Government**

- **Probability:** Low (15% per Innovation section)
- **Impact:** Low (can remove points without platform failure)
- **Mitigation:**
  - Frame as "Community Impact Tracking" in government demos (not gamification)
  - Government trust scores as "accountability metrics" (not competitive leaderboards)
  - Fallback: Toggle feature allows government orgs to hide points in their view
- **Monitoring:** Government pilot feedback, zero rejections citing gamification concerns

---

#### Resource Risks

**Risk 1: Budget Constraints Force Scope Reduction**

- **Probability:** Medium (30%)
- **Impact:** Medium (delays Phase 2, limits growth)
- **Mitigation:**
  - MVP already scoped lean (4 sprints, 1 developer)
  - Prioritized feature cuts if needed: Sprint 4 API → Phase 2, Sprint 4 Contact Directory → Phase 2
  - Minimum viable MVP: Sprint 1-3 only (reporting, verification, NGO Dashboard) = $60k-80k budget
- **Monitoring:** Monthly burn rate, adjust scope if runway drops below 6 months

**Risk 2: Key Developer Leaves Mid-Sprint**

- **Probability:** Low (15%)
- **Impact:** High (4-6 week delay to onboard replacement)
- **Mitigation:**
  - Comprehensive documentation from Sprint 1 (README, architecture docs, API specs)
  - Code reviews ensure knowledge sharing (no silos)
  - Backup: Contract developer network for rapid replacement (Toptal, Upwork)
- **Monitoring:** Developer satisfaction check-ins, retention bonuses tied to MVP completion

**Risk 3: Scope Creep from Stakeholder Requests**

- **Probability:** Medium-High (50%)
- **Impact:** Medium (delays delivery, quality suffers)
- **Mitigation:**
  - Strict feature freeze after Sprint planning (no mid-sprint additions)
  - "Phase 2 backlog" for all new ideas (document, prioritize later)
  - Product Owner (PM) enforces scope discipline, presents trade-off analysis for any changes
- **Monitoring:** Track feature requests vs. accepted changes, target 0 mid-sprint additions

---

### Validation Gates & Success Criteria

**Sprint 2 Validation Gate:**

- ✅ Accessibility audit passed (Lighthouse score >90, axe DevTools zero critical issues)
- ✅ Privacy notice reviewed by data privacy attorney (CCPA compliance validated)
- ✅ Community verification flow functional (Sara's journey works end-to-end)
- ❌ **If failed:** Address issues before proceeding to Sprint 3 (accessibility blocks government adoption)

**Sprint 4 Validation Gate:**

- ✅ Government pilot launched with Oakland Public Works (David's journey working)
- ✅ Load testing passed (1,000 issues, map <1s, dashboard <2s)
- ✅ Core Web Vitals "Good" rating (LCP <2.5s, FID <100ms, CLS <0.1)
- ✅ Screen reader testing passed (NVDA, JAWS, VoiceOver functional)
- ❌ **If failed:** Delay launch, fix performance/accessibility issues (government adoption blockers)

**Month 3 Validation (End of Sprint 3):**

- ✅ 50 active users (community members reporting/verifying)
- ✅ 100 verified reports (community verification working)
- ✅ 1 NGO pilot (Oakland Green Alliance using dashboard)
- ✅ ≥90% verification accuracy (community validators trustworthy)
- ❌ **If failed:** Investigate why adoption slow, adjust marketing or onboarding

**Month 6 Validation:**

- ✅ 500 active users
- ✅ $10k MRR ($120k ARR run rate)
- ✅ 1 government pilot launched (inbound request from NGO data visibility)
- ✅ ≥50% Action Card resolution rate (NGO coordination effective)
- ❌ **If failed:** Trojan Horse demand signal missing, prepare hybrid sales pivot

**Month 9 Pivot Decision:**

- ✅ ≥3 government pilot requests (Trojan Horse validated) → Continue strategy
- ❌ <3 government pilots → **PIVOT to hybrid sales** (NGO + traditional gov RFPs)

**Month 12 Success Criteria:**

- ✅ 5,000 active users
- ✅ $25k MRR ($300k ARR)
- ✅ 10 NGOs paying + 3 governments paying
- ✅ All 4 innovations validated or mitigated
- 🎯 **Result:** MVP successful, proceed to Phase 2 growth features

---

### Development Timeline & Milestones

**Sprint 0 (Week 0, Pre-Development):**

- Dev environment setup (Next.js, Supabase, Vercel)
- Supabase project configuration (database schema, RLS policies, Auth)
- Design system setup (Tailwind, Radix UI, component library)
- CI/CD pipeline (GitHub Actions, Lighthouse CI, automated testing)

**Sprint 1 (Weeks 1-3): Core Reporting + Map**

- Week 1: Database schema, Auth, issue reporting form
- Week 2: Map visualization, pin clustering, issue detail page
- Week 3: Anonymous reporting, points system, mobile responsive design
- **Milestone:** Community members can report and see issues on map

**Sprint 2 (Weeks 4-6): Verification + User Profiles**

- Week 4: Verification flow, multi-verifier display, verification threshold logic
- Week 5: User profiles, reputation tracking, flag system
- Week 6: Accessibility audit, privacy review, Sprint 2 validation gate
- **Milestone:** Community-driven verification working, WCAG 2.1 AA validated

**Sprint 3 (Weeks 7-9): NGO Dashboard + Action Cards**

- Week 7: NGO Dashboard, auto-prioritization, org profiles
- Week 8: Action Card creation, volunteer sign-up, proof upload
- Week 9: Funder report export, bulk issue resolution, Sprint 3 validation
- **Milestone:** NGOs can coordinate actions and generate funder reports

**Sprint 4 (Weeks 10-12): Polish + API + Contact Directory**

- Week 10: Public read-only API, API docs, contact directory
- Week 11: Issue resolution proof, email notifications, performance optimization
- Week 12: Screen reader testing, load testing, Sprint 4 validation gate
- **Milestone:** Platform ready for government pilot launch

**Post-Sprint 4:**

- Week 13: Government pilot onboarding (Oakland Public Works)
- Week 14-16: Bug fixes, user feedback incorporation, marketing launch
- Month 4+: Monitor validation metrics, prepare Phase 2 roadmap

---

## Functional Requirements

**Purpose:** This section defines THE CAPABILITY CONTRACT for the entire product. These requirements specify WHAT capabilities the product must have, not HOW they will be implemented. Every feature built must trace back to one of these requirements.

**Usage:**

- UX designers will design interactions for these capabilities
- Architects will build systems to support these capabilities
- Epic breakdown will implement these capabilities

**Organization:** Requirements are grouped by capability area (not by technology or implementation layer).

---

### Issue Reporting & Submission

**FR1:** Anonymous users can submit environmental issue reports with photo, description, location, severity, and category

**FR2:** Anonymous users can use device GPS to auto-populate location coordinates

**FR3:** Anonymous users can manually adjust pin location on map interface before submission

**FR4:** Authenticated members can submit issue reports with same fields as anonymous users

**FR5:** Users can upload photos from device camera or photo library

**FR6:** Users can select issue severity (Critical/High/Medium/Low)

**FR7:** Users can select issue category (Waste/Litter or Drainage/Flood Risk)

**FR8:** Users can add optional contact information for follow-up

**FR9:** Users can view submission confirmation with assigned issue ID

**FR10:** System can strip EXIF GPS metadata from uploaded photos before storage

---

### Map Visualization & Discovery

**FR11:** All users can view interactive map with environmental issue pins

**FR12:** Users can see pin colors indicating issue status (Pending/Verified/In Progress/Resolved)

**FR13:** Users can tap/click pins to view issue summary popup

**FR14:** Users can filter map view by category, severity, and status

**FR15:** Users can search map by address or place name

**FR16:** Users can view issues within specific geographic radius from their location

**FR17:** System can cluster pins when map shows 100+ issues in viewport

**FR18:** Users can toggle between map view and list view of issues

**FR19:** Users can share issue location via public link

**FR20:** Users can view issue density heatmap overlay

---

### Verification & Trust Building

**FR21:** Authenticated members can verify other users' issue reports

**FR22:** Verifiers can upload verification photo from same location

**FR23:** Verifiers can add context notes to their verification

**FR24:** System can automatically capture timestamp and GPS coordinates during verification

**FR25:** Users can view all verification photos and notes for an issue

**FR26:** System can promote anonymous reports to "Verified" status after 2+ authenticated verifications

**FR27:** Users can view verification count and verifier usernames on issue detail

**FR28:** System can prevent users from verifying their own submitted reports (session-based tracking for anonymous users: verifier_session_id ≠ reporter_session_id; device fingerprinting added if abuse >5% in Month 3)

**FR29:** Users can view verification accuracy rate on their profile

**FR30:** Authenticated members can flag issues or photos as spam/inappropriate

---

### User Profiles & Gamification

**FR31:** Authenticated members can create user profile with username and optional bio

**FR32:** Users can view their own profile showing reports submitted, verifications contributed, and community impact metrics (kg waste removed, verified resolutions contributed to)

**FR33:** Users see tangible impact messaging for contributions ("You saved 15 kg of waste!" instead of abstract points)

**FR34:** Users see community celebration for verifications ("You helped verify 12 community cleanups!" instead of points)

**FR35:** Users can view their validation rate percentage (verified reports that resolved)

**FR36:** Users can view volunteer hours earned from completed Action Cards

**FR37:** Users can view public profiles of other community members

**FR38:** Users can see success rate and reputation metrics on profiles

**FR39:** Users can update profile settings and notification preferences

---

### NGO & Organization Management

**FR40:** NGO staff can access organization-scoped dashboard

**FR41:** NGOs can view verified reports filtered to their coverage area

**FR42:** NGOs can see auto-prioritized issue queue (verification count + severity + vulnerability zip codes)

**FR43:** NGOs can create Action Card campaigns with title, description, date, location, and capacity limit (templates per-org customizable: action_card_templates table with organization_id nullable - null = platform admin defaults, non-null = org-specific templates)

**FR44:** NGOs can attach Action Cards to single or multiple issues (bulk assignment)

**FR45:** NGOs can view volunteer sign-up list for Action Cards

**FR46:** NGOs can upload before/after resolution proof photos

**FR47:** NGOs can mark issues as resolved via proof upload

**FR48:** NGOs can export funder reports as CSV with metrics (issues addressed, volunteer hours, resolution rate, engagement count)

**FR49:** NGOs can manage organization profile with name, description, coverage area, and contact email

**FR50:** Public users can discover NGOs via searchable contact directory

---

### Action Cards & Volunteer Coordination

**FR51:** Community members can browse available Action Cards on map and list views

**FR52:** Authenticated members can sign up to volunteer for Action Cards

**FR53:** System can display participant count and capacity limit on Action Cards

**FR54:** Volunteers can view Action Cards they've signed up for on profile dashboard

**FR55:** Volunteers can upload completion proof photos after Action Card event

**FR56:** System can award volunteer hours to participants when Action Card marked complete

**FR57:** Users can view attached issues that will be addressed by Action Card

**FR58:** System can bulk-resolve all attached issues when Action Card proof uploaded

---

### Moderation & Content Management

**FR59:** Community members can flag issues or photos using flag button

**FR60:** Admin users can review flagged content via admin interface

**FR61:** Admin users can hide/unhide issues or photos

**FR62:** Admin users can mark issues as duplicates

**FR63:** Admin users can view moderation queue with flag count and context

**FR64:** System can rate-limit anonymous report submissions per device/session/IP

**FR65:** System can log all admin moderation actions with timestamp and actor ID

---

### Public API & Transparency

**FR66:** External developers can access read-only API documentation

**FR67:** API consumers can authenticate using token-based authentication

**FR68:** API consumers can retrieve verified reports via GET /api/reports endpoint

**FR69:** API consumers can filter reports by category, status, date range, and geographic bounds

**FR70:** API consumers can retrieve organization profiles via GET /api/organizations endpoint

**FR71:** API consumers can receive paginated JSON responses with standard metadata

**FR72:** System can rate-limit API requests (100 requests/hour for public tier)

---

### Compliance & Accessibility (Cross-Cutting)

**FR73:** All interactive elements can be accessed via keyboard navigation

**FR74:** All images can have alternative text descriptions for screen readers

**FR75:** All forms can provide clear error messages and validation feedback

**FR76:** All color-coded information can have non-color visual indicators

**FR77:** Users can request data export of their personal information (CCPA compliance); NGO organizations can export THEIR org-scoped data (reports, verifications, Action Cards with RLS filtering) but NOT full platform database - full exports require platform admin contact for security/multi-tenant isolation

**FR78:** Users can delete their account and associated data

**FR79:** Users can view privacy policy and terms of service

**FR80:** System can send email notifications for issue status changes

---

### Functional Requirements Summary

**Total Requirements:** 80 functional requirements across 8 capability areas

**Coverage Validation:**

- ✅ All 8 user journeys covered (Maria, Sara, Linda, James, Alex, Kevin, Michelle, David)
- ✅ Domain requirements integrated (Section 508, CCPA, SOC 2, Open API)
- ✅ Innovation patterns supported (Community Verification, Action Cards, Gamification, API Transparency)
- ✅ Scoping constraints respected (Simplified Action Cards, Manual Moderation, Read-Only API)
- ✅ MVP boundaries enforced (No chat, No custom dashboard, No write API, No in-app messaging)

**Traceability:**

- Issue Reporting: FR1-10 → Maria (Reporter), Alex (Anonymous)
- Map & Discovery: FR11-20 → All users, map-first interface
- Verification: FR21-30 → Sara (Verifier), trust building innovation
- Profiles & Gamification: FR31-39 → All authenticated users, engagement innovation
- NGO Management: FR40-50 → Linda (NGO Coordinator), organizational orchestration
- Action Cards: FR51-58 → James (Volunteer), Linda (NGO), collective action innovation
- Moderation: FR59-65 → Michelle (Moderator), admin users, content quality
- Public API: FR66-72 → Kevin (311 Developer), David (Government), Trojan Horse GTM
- Compliance: FR73-80 → Govtech domain requirements, accessibility mandatory

**Implementation Notes:**

- These requirements are implementation-agnostic (could be built multiple ways)
- Each requirement is testable and verifiable
- No UI specifics or technology choices included (those belong in architecture/design)
- Non-functional requirements (performance, security, scalability) defined in next section

---

## Non-Functional Requirements

**Purpose:** This section defines HOW WELL the system must perform. These are measurable quality attributes that specify system behavior under various conditions.

**Selective Approach:** We only document NFR categories that are critical for EcoPulse's success. Irrelevant categories are omitted to avoid requirement bloat.

---

### Performance

**NFR1:** Map interface loads in <1 second with 100 pins, <3 seconds with 1,000+ pins (client-side clustering)

**NFR2:** Issue report submission completes in <2 seconds from form submit to confirmation (excluding photo upload time)

**NFR3:** Photo uploads complete in <5 seconds for images up to 10MB on 3G connection

**NFR4:** NGO dashboard displays prioritized issue queue in <2 seconds with 500+ verified reports

**NFR5:** CSV export generation completes in <10 seconds for datasets up to 10,000 records

**NFR6:** Core Web Vitals compliance: LCP <2.5s, FID/INP <100ms/<200ms, CLS <0.1 (Lighthouse CI enforcement)

**NFR7:** API response times: <500ms for single resource queries, <2s for paginated list queries with 100 items per page

**NFR8:** Search and filter operations return results in <1 second for datasets up to 10,000 issues

---

### Security

**NFR9:** All data in transit encrypted using TLS 1.3 or higher

**NFR10:** All data at rest encrypted using AES-256 (Supabase default)

**NFR11:** Photo uploads automatically strip EXIF GPS metadata before storage (prevent location doxxing)

**NFR12:** Row-Level Security (RLS) policies enforce organization-scoped data access (NGO users cannot see other orgs' internal data)

**NFR13:** Admin moderation actions logged with timestamp, actor ID, target resource, and action type (immutable audit trail)

**NFR14:** Anonymous report submissions rate-limited to 10 reports per hour per device/session/IP (anti-spam)

**NFR15:** API requests rate-limited to 100 requests/hour for public tier (prevents abuse)

**NFR16:** Password requirements: minimum 8 characters, bcrypt hashing via Supabase Auth

**NFR17:** Session tokens expire after 7 days of inactivity, refresh tokens after 30 days

**NFR18:** Admin access requires multi-factor authentication (MFA) for production environment

**NFR19:** SOC 2 Type II compliance validated through Supabase infrastructure (annual audit reports required)

---

### Accessibility

**NFR20:** All interactive elements keyboard-navigable with visible focus indicators (WCAG 2.1 AA Level 2.1.1)

**NFR21:** All images have descriptive alternative text for screen readers (WCAG 2.1 AA Level 1.1.1)

**NFR22:** Color contrast ratios meet 4.5:1 for normal text, 3:1 for large text (WCAG 2.1 AA Level 1.4.3)

**NFR23:** All forms provide clear error messages and validation feedback (WCAG 2.1 AA Level 3.3.1, 3.3.3)

**NFR24:** No information conveyed by color alone - status indicators use icons + color (WCAG 2.1 AA Level 1.4.1)

**NFR25:** Page structure uses semantic HTML with proper heading hierarchy (WCAG 2.1 AA Level 1.3.1)

**NFR26:** Lighthouse accessibility score >90 enforced in CI/CD pipeline (fails PR merge if drops below threshold)

**NFR27:** Manual screen reader testing validates NVDA, JAWS, and VoiceOver compatibility before production release

**NFR28:** Touch targets minimum 44x44 pixels for mobile interactions (WCAG 2.1 AA Level 2.5.5)

**NFR29:** Time limits provide warning and ability to extend (WCAG 2.1 AA Level 2.2.1) - applicable for session timeouts

**NFR30:** Skip navigation links available for keyboard users to bypass repeated content (WCAG 2.1 AA Level 2.4.1)

---

### Scalability

**NFR31:** System supports 500 concurrent users in MVP without performance degradation

**NFR32:** Database queries optimized to handle 10,000 issues with <2 second query times (GiST spatial indexing)

**NFR33:** Map clustering algorithm handles 100,000+ pins without browser performance issues (<16ms frame time)

**NFR34:** Photo storage scales to 100,000 images in Year 1 using Supabase Storage CDN

**NFR35:** System architecture supports 10x user growth (5,000 → 50,000 users) with <10% performance degradation

**NFR36:** API infrastructure supports 10,000 requests/hour without throttling paid tier users

**NFR37:** Database connection pooling configured for 100 concurrent connections (Supabase default)

**NFR38:** NGO dashboard materialized views refresh hourly to maintain sub-2-second query performance at scale

---

### Integration

**NFR39:** Public API provides JSON responses conforming to JSON:API specification for consistency

**NFR40:** API pagination supports 100 items per page with cursor-based pagination for datasets >1,000 records

**NFR41:** API authentication tokens are revocable by users or admins (security requirement)

**NFR42:** CSV exports conform to RFC 4180 standard for compatibility with Excel, Google Sheets, data analysis tools (validated via automated CI/CD tests: seed 1,000 reports → export CSV → validate row count + field accuracy programmatically)

**NFR43:** Email notifications deliver within 5 minutes of trigger event (Supabase Edge Functions → Resend with React Email templates)

**NFR44:** API documentation uses OpenAPI 3.0 specification for automated client generation

**NFR45:** Webhook delivery (Phase 2) implements retry logic with exponential backoff (3 attempts over 1 hour)

**NFR46:** Geographic data exports support GeoJSON format for GIS software compatibility (QGIS, ArcGIS)

---

### Reliability & Availability

**NFR47:** System uptime target: 99.5% availability (43 hours downtime/year acceptable for MVP)

**NFR48:** Database backups run daily with 30-day retention (Supabase automatic backups)

**NFR49:** Photo storage includes redundant copies across multiple availability zones (Supabase Storage default)

**NFR50:** Point-in-time recovery available for database with 7-day recovery window

**NFR51:** Vercel deployment includes automatic rollback on failed deployments

**NFR52:** Error monitoring captures client-side errors with stack traces (Sentry or Vercel Analytics)

**NFR53:** Critical user actions (report submission, verification, proof upload) implement retry logic for network failures

**NFR54:** System degrades gracefully if external services fail (map tiles, geocoding API) - shows cached data or error messages

---

### Data Integrity & Privacy

**NFR55:** Issue data includes soft-delete flag (no permanent deletion) for audit trail and spam pattern analysis

**NFR56:** User account deletion removes personal information but preserves anonymized contributions for data integrity

**NFR57:** CCPA data export request fulfilled within 45 days with machine-readable JSON format

**NFR58:** Verification photos include cryptographic hash to detect tampering (SHA-256 stored in database)

**NFR59:** Geolocation coordinates validated to ensure within valid lat/lng ranges (-90 to 90, -180 to 180)

**NFR60:** Photo uploads validated for file type (JPEG, PNG, WebP only), max size (10MB), and malware scanning

**NFR61:** Duplicate report detection (Phase 2) uses geographic proximity (<100m radius) + text similarity (>70% match)

---

### Monitoring & Observability

**NFR62:** Real User Monitoring (RUM) tracks Core Web Vitals for 100% of production traffic (Vercel Analytics)

**NFR63:** Server-side error rates monitored with alerts if >1% of requests fail within 5-minute window

**NFR64:** API usage metrics tracked per organization for billing and abuse detection

**NFR65:** Database query performance logged with slow query alerts (>5 seconds)

**NFR66:** Government pilot dashboards include custom metrics tracking for success validation (response times, verification rates, resolution rates)

---

### Browser & Device Compatibility

**NFR67:** Modern browser support with African market considerations:

- Chrome/Edge 120+, Safari 17+, Firefox 120+ (last 2 versions for desktop)
- Android Chrome 110+ (supports 2-3 year old budget Android devices common in Nigeria)
- iOS Safari 16+ (iPhone 11 and newer, 3-year support window)

**NFR68:** Progressive enhancement ensures core reporting functionality works without JavaScript (form submission via server actions)

**NFR69:** Mobile-first responsive design supports viewport widths from 360px (budget Android) to 2560px (desktop)

**NFR70:** Touch interactions optimized for Android Chrome and iOS Safari (>95% of African mobile traffic)

**NFR71:** Camera integration supports native device camera and photo library access via HTML5 File API

**NFR72:** Offline detection shows user-friendly message and queues failed requests for retry when connection restored

**NFR73 (African Market Specific):** Application optimized for 3G/4G networks common in Nigerian urban areas (Lagos, Kano, Abuja)

**NFR74 (African Market Specific):** Photo compression reduces upload sizes by 60-70% for users on limited data plans

### Internationalization (i18n)

**NFR75:** Application built with `next-intl` framework from Sprint 1 (official Next.js team recommendation for App Router + Server Components support)

**NFR76:** All UI text strings use translation keys (e.g., `t('report.submit.button')`) instead of hardcoded English text

**NFR77:** MVP launches with English-only content, but architecture ready for future language additions without system rebuild (add `/messages/ha.json` for Hausa, `/messages/yo.json` for Yoruba - no code changes needed)

**NFR78 (Future Phase 2):** Support for Nigerian languages (Hausa, Yoruba, Igbo) and other African languages (Swahili, Amharic, French)

**NFR79 (Future Phase 2):** Right-to-left (RTL) language support for Arabic-speaking African regions (North Africa expansion)

**NFR80 (Future Phase 2):** Date, time, and number formatting adapts to local conventions (DD/MM/YYYY for Nigeria vs MM/DD/YYYY for US donors)

---

### Notifications & Communication

**NFR81:** Email notifications sent via SendGrid or Resend with delivery within 5 minutes

**NFR82:** Push notifications (web push) delivered to opted-in users for issue status updates

**NFR83 (Future Phase 2):** SMS notifications via Africa's Talking API for Nigerian users (when scaling justifies $0.02/SMS cost)

**NFR84 (Future Phase 2):** WhatsApp Business API integration for notification delivery (preferred communication channel in Nigeria)

---

### Non-Functional Requirements Summary

**Total NFRs:** 84 measurable quality attributes across 10 categories (updated for African market)

**Priority Distribution:**

- **Critical (MVP Sprint 1-4):** NFR1-8 (Performance), NFR9-19 (Security), NFR20-30 (Accessibility), NFR47-54 (Reliability), NFR75-77 (i18n Framework)
- **Important (MVP Validation):** NFR31-38 (Scalability), NFR39-46 (Integration), NFR55-61 (Data Integrity), NFR73-74 (African Market)
- **Monitoring (Operational):** NFR62-66 (Observability)
- **Compatibility (Foundation):** NFR67-72 (Browser/Device - includes African Android devices)
- **Future (Phase 2):** NFR78-80 (Multi-language content), NFR83-84 (SMS/WhatsApp notifications)

**Compliance Alignment:**

- Section 508/WCAG 2.1 AA: NFR20-30 (accessibility mandatory for government adoption + NGO international donors)
- SOC 2 Type II: NFR9-19 (security audit requirements)
- CCPA: NFR55-57 (data privacy and export rights)
- Core Web Vitals: NFR6, NFR62 (performance standards)
- i18n Ready: NFR75-77 (architecture for future African languages)

**African Market Specific:**

- NFR73: 3G/4G network optimization (Nigerian urban areas)
- NFR74: Photo compression for data-sensitive users
- NFR75-77: i18n framework (English MVP, Hausa/Yoruba/Igbo future)
- NFR83-84 (Future): SMS/WhatsApp notifications when scale justifies cost

**Testing Strategy:**

- **Automated:** NFR6, NFR26 (Lighthouse CI), NFR31-33 (load testing), NFR39-44 (API contract testing)
- **Manual:** NFR27 (screen reader testing), NFR28-30 (accessibility audit)
- **Monitoring:** NFR62-66 (production observability), NFR47-48 (uptime tracking)
- **African Market Testing:** NFR73-74 (3G throttling tests, compression validation)

**Traceability to Domain Requirements:**

- Govtech compliance (Domain Requirements) → Accessibility (NFR20-30), Security (NFR9-19), Privacy (NFR55-57)
- Innovation validation (Step 6) → Performance (NFR1-8), Scalability (NFR31-38)
- Web architecture (Step 7) → Browser compatibility (NFR67-74 includes African devices), Core Web Vitals (NFR6)
- Africa-First Design → i18n framework (NFR75-77), 3G optimization (NFR73), compression (NFR74)
- Scoping constraints (Step 8) → Simplified implementations reduce infrastructure NFRs (no real-time chat, no SMS in MVP, no multi-language content in MVP)

---
