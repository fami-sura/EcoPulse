# EcoPulse Strategic Decisions Log

**Date:** 2025-12-16  
**Session:** Party Mode + Innovation Strategist Competitive Analysis

---

## Strategic Positioning

### Blue Ocean Differentiation

EcoPulse is **NOT** a generic 311 civic tech platform. We are a **Distributed Environmental Action Platform** that combines:

1. **Action Cards** - Immediate empowerment with safe, realistic steps
2. **Community Verification** - Second-person verification with before/after photos
3. **Multi-Org Native** - NGOs, government, schools as first-class citizens
4. **Environmental Domain Expertise** - Category-specific safety guidance and templates

**Key Insight:** We're not "better SeeClickFix." We're fundamentally different - **distributed action** vs. **centralized ticketing**.

---

## Competitive Intelligence Summary

**Platforms Analyzed:** 13+ platforms including SeeClickFix, FixMyStreet, PublicStuff, Accela, GovPilot, Nextdoor, iNaturalist, Litterati, Ushahidi, HOT OpenStreetMap, Map Action, Blockchain Environmental Tracking, CIVIC AI

### Critical Gaps in Existing Platforms (Our Opportunities)

1. **Report and Forget Problem** - Citizens report, then wait. No action guidance.
   - **EcoPulse Solution:** Action Cards empower immediate safe action

2. **Government-Only Verification** - Citizens must trust "closed" status
   - **EcoPulse Solution:** Community-driven verification with photo proof

3. **NGO/Multi-Org Afterthought** - Platforms built for ONE government entity
   - **EcoPulse Solution:** Multi-org architecture from Day 1

4. **Low Data Quality** - Text-only reports, photos optional
   - **EcoPulse Solution:** Required fields (photo + note + location + severity)

5. **Gamification Without Impact** - Points earned but nothing changes
   - **EcoPulse Solution:** Gamification WITH closed-loop verification

6. **Enterprise Pricing Excludes Small Orgs** - $50k-$500k/year
   - **EcoPulse Solution:** Freemium/SaaS pricing for accessibility

7. **Generic Issue Tracking** - All problems treated equally
   - **EcoPulse Solution:** Environmental-specific domain expertise

8. **No Transparency for Donors** - NGOs can't export verified outcomes
   - **EcoPulse Solution:** CSV exports with verification data for donor reporting

---

## Go-To-Market Strategy: Trojan Horse

### Primary Market: NGOs First

**Why NGOs:**

- Fast decision-making (no procurement red tape)
- Motivated users (need verified data for donor reports)
- Government influence (NGO success → government adoption)

**Secondary Market: Government Agencies**

- Enter after NGO success proves value
- Position as "environmental action layer ON TOP of existing 311 systems"
- Emphasis on data sovereignty and self-hosting options

### Pricing Model

- **Free Tier:** Community reporting, map viewing, basic verification
- **NGO Tier ($49-99/month):** Dashboard, CSV exports, contact directory, moderation tools
- **Enterprise Tier ($499+/month):** Multi-org coordination, API access, custom branding, SLA support

**Target:** $300k ARR Year 1 with 125 organizations (100 NGOs + 20 municipalities + 5 gov agencies)

---

## Architecture Decisions (Winston)

### Core Requirements

1. **Multi-Org Data Isolation** - Supabase Row-Level Security (RLS) policies
2. **Export-Ready Data Model** - PostgreSQL COPY TO for CSV generation
3. **API-First Design** - tRPC with OpenAPI codegen for future integrations
4. **Self-Hosting Capability** - Architect for Supabase self-hosting (build in Phase 2)

### Tech Stack

- **Frontend:** Next.js 15
- **Backend/Database:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Maps:** Leaflet + OpenStreetMap (data sovereignty, free)
- **Geolocation:** float8 (double precision lat/lng with GiST index)
- **Action Cards:** Database table (6 templates: 2 categories × 3 severities)

---

## Sprint Prioritization (Bob + Mary)

### Sprint 1: Core Reporting + Map

- Data models: issues, users, proofs (basic), flags (basic)
- Pages: landing, report, map, issue detail
- Status transitions: Open ↔ In Progress
- 2 categories only: Waste/Litter + Drainage

### Sprint 2: Verification + User Profiles

- Proof submission flow (after photo required, proof note required)
- Second-person verification (verifier ≠ submitter)
- **User Profile page:** points earned, contributions, personal impact stats, team affiliation
- Points system implementation

### Sprint 3: NGO Dashboard

- `/org/dashboard` route with org-scoped queries (RLS filtering by org_id)
- KPIs: total reports, open, in progress, resolved, verified (last 7/30 days)
- CSV export endpoint for donor reporting
- Team performance leaderboards
- Verified outcomes showcase

### Sprint 4: Polish + Contact Directory

- Contact directory (who-to-contact per category/region)
- Empty states, onboarding tips, safety copy
- Anti-spam tuning (rate limiting, duplicate detection)
- Shareable impact posters (optional)

### Phase 2 (Post-MVP)

- Government admin panel (full RBAC: Org Staff vs Org Admin)
- 311 system integration API
- Self-hosting deployment option
- Additional categories (Urban Heat, Water Issues, Air/Smoke)

---

## UX Priorities (Sally)

### Action Cards as Hero Component

- Prominent placement on issue detail page
- Pop up immediately after report submission
- Messaging: **"Great report! Here's how YOU can help fix this safely."**
- Flip script from passive reporter to active change-maker

### User Profile Design

- Personal impact stats (reports, fixes, proofs, verifications)
- Points visualization (progress bars, milestones)
- Contribution timeline (activity feed)
- Team affiliation badge
- Shareability (social proof for gamification)

---

## Testing Priorities (Murat)

### High Priority: Verification Flow Testing

- Happy path: User A reports → User B fixes → User B uploads proof → User C verifies
- Self-verification blocking: User B cannot verify their own proof
- Photo requirements: After photo required, before photo optional
- Malicious verification: Spam flagging mechanism

### Critical: Data Export Integrity

- CSV exports must be ACCURATE (NGO donor trust depends on this)
- Test aggregation queries for KPIs
- Test date range filtering for exports
- Test verification counts (one bug = platform reputation destroyed)

### Edge Cases

- Geolocation: denied permissions, GPS timeout, airplane mode
- Anonymous abuse: rate limiting validation, duplicate submission detection
- Photo upload: large files, corrupted images, EXIF stripping, offline-to-online sync

---

## Strategic Recommendations (Victor)

1. **Lead with NGOs, Not Government** - Trojan Horse strategy proven effective (Map Action Mali example)
2. **Open-Source Verification Module** - Build trust with gov tech community
3. **Partner with Existing 311 Systems** - Don't replace, integrate (API layer)
4. **Pilot in Climate-Vulnerable Cities** - Coastal cities with flooding, waste crisis regions
5. **Data Sovereignty from Day 1** - Self-hostable, exportable, country-specific deployment

---

## Key Decisions for Future Sessions

### What We're Building

- **Movement Platform**, not just civic tech
- Turns reporting into organizing
- Empowers communities first, invites government second

### What Makes Us Unique (No Competitor Does This)

1. Action Cards with Safety (immediate empowerment)
2. Community Verification System (distributed trust)
3. Multi-Org Native (NGOs as first-class citizens)
4. Environmental-Specific (domain expertise in templates)
5. Transparent by Default (audit logs, CSV exports, future public portal)
6. Gamification + Government (closed-loop verified impact)

### Business Model Innovation

- Freemium SaaS for Govtech (sweet spot between free Litterati and $50k SeeClickFix)
- NGO tier is revenue driver ($49-99/month × 100 orgs = $58k-$118k/year)
- Government tier scales ($499+/month for compliance features)

---

## References

- **Competitive Research:** 13+ platforms analyzed (2025-12-16)
- **ACM Interactions 2024:** 70% civic tech platforms discontinue due to ignoring government workflows
- **Party Mode Session:** Team alignment on scope, tech stack, prioritization
- **Innovation Strategist:** Victor's Blue Ocean positioning analysis

---

**Status:** Strategic decisions locked. Ready for PRD formalization and Technical Architecture.
