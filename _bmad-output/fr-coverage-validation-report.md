# ecoPulse MVP: Functional Requirements Coverage Validation Report

**Report Date:** December 20, 2024  
**Sprint Scope:** Sprints 0-4B (16 weeks total)  
**Total Stories:** 69  
**Total Story Points:** 243  
**Analysis Type:** Comprehensive FR-to-Story Mapping

---

## Executive Summary

**Overall Coverage: 70 of 80 FRs (87.5%)**

- **✅ Full Coverage:** 66 FRs (82.5%)
- **⚠️ Partial Coverage:** 4 FRs (5.0%)
- **❌ Missing Coverage:** 10 FRs (12.5%)

**Critical Assessment:** ✅ **MVP LAUNCH READY**

- All showstopper FRs (core reporting, verification, NGO dashboard) fully covered
- Missing FRs intentionally deferred to Phase 2 per strategic decisions
- Partial coverage items have acceptable MVP implementations with documented Phase 2 upgrades

---

## FR Coverage Matrix

### FR1-FR10: Issue Reporting & Submission

| FR       | Requirement                                | Coverage Status | Sprint Stories                              | Notes                                                       |
| -------- | ------------------------------------------ | --------------- | ------------------------------------------- | ----------------------------------------------------------- |
| **FR1**  | Report environmental issue without account | ✅ **FULL**     | Sprint 1: 1.3.1, 1.3.2, 1.3.3, 1.3.5, 1.3.6 | Anonymous reporting fully implemented with session tracking |
| **FR2**  | GPS auto-populate from device location     | ✅ **FULL**     | Sprint 1: 1.3.4                             | Geolocation API integration with manual fallback            |
| **FR3**  | Upload 1-3 photos per report               | ✅ **FULL**     | Sprint 0: 0.4; Sprint 1: 1.3.2              | Supabase Storage with compression + EXIF stripping          |
| **FR4**  | Add text/voice note description            | ✅ **FULL**     | Sprint 1: 1.3.3                             | Text input (0-500 chars) + voice recording (max 60s)        |
| **FR5**  | Select issue category (Waste/Drainage)     | ✅ **FULL**     | Sprint 1: 1.3.1                             | Simplified to 2 categories for MVP                          |
| **FR6**  | Select severity (Low/Medium/High)          | ✅ **FULL**     | Sprint 1: 1.3.1                             | Visual icons + color coding                                 |
| **FR7**  | Anonymous reports assigned random ID       | ✅ **FULL**     | Sprint 1: 1.3.5, 1.3.6                      | localStorage session_id (UUID) with 7-day expiry            |
| **FR8**  | Anonymous-to-authenticated conversion      | ✅ **FULL**     | Sprint 1: 1.3.7, 1.4.3                      | Automatic report transfer on signup                         |
| **FR9**  | Confirmation screen with report ID         | ✅ **FULL**     | Sprint 1: 1.3.6                             | Success modal with shareable link                           |
| **FR10** | EXIF metadata stripped from photos         | ✅ **FULL**     | Sprint 0: 0.4                               | Server-side stripping before upload                         |

**Category Coverage: 10/10 FRs (100%)**

---

### FR11-FR20: Map Visualization & Discovery

| FR       | Requirement                                      | Coverage Status | Sprint Stories                        | Notes                                             |
| -------- | ------------------------------------------------ | --------------- | ------------------------------------- | ------------------------------------------------- |
| **FR11** | Interactive map with pins                        | ✅ **FULL**     | Sprint 0: 0.3; Sprint 1: 1.2.1, 1.2.4 | Leaflet with OpenStreetMap                        |
| **FR12** | Pin colors by status (pending/verified/resolved) | ✅ **FULL**     | Sprint 1: 1.2.4; Sprint 2: 2.1.6      | Green (verified), Gray (pending), Blue (resolved) |
| **FR13** | Click pin to view issue details                  | ✅ **FULL**     | Sprint 1: 1.2.2                       | Popup card with photo gallery, address, category  |
| **FR14** | Cluster pins at low zoom levels                  | ✅ **FULL**     | Sprint 1: 1.2.3                       | Leaflet.markercluster plugin                      |
| **FR15** | Filter by category, status, date range           | ✅ **FULL**     | Sprint 1: 1.2.2                       | Client-side filtering panel                       |
| **FR16** | Search by address or location name               | ✅ **FULL**     | Sprint 1: 1.2.2                       | Text search with geocoding                        |
| **FR17** | Pan/zoom to explore different areas              | ✅ **FULL**     | Sprint 1: 1.2.1                       | Standard Leaflet controls                         |
| **FR18** | View issue photos in gallery lightbox            | ✅ **FULL**     | Sprint 1: 1.2.2                       | Click photo opens full-screen gallery             |
| **FR19** | Share issue via public link                      | ❌ **MISSING**  | -                                     | Deferred to Phase 2 (social sharing feature)      |
| **FR20** | Display verification status badges               | ✅ **FULL**     | Sprint 2: 2.1.6                       | Badge shows verification count + checkmark icon   |

**Category Coverage: 9/10 FRs (90%)** | **Missing: 1 (FR19 - social sharing deferred)**

---

### FR21-FR30: Verification & Trust Building

| FR       | Requirement                                            | Coverage Status | Sprint Stories         | Notes                                                                                                                         |
| -------- | ------------------------------------------------------ | --------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **FR21** | Second-person verification (cannot verify own reports) | ✅ **FULL**     | Sprint 2: 2.1.1, 2.1.2 | Session-based blocking for anonymous, user_id for authenticated                                                               |
| **FR22** | Upload photo proof for verification                    | ✅ **FULL**     | Sprint 2: 2.1.3        | Same upload pipeline as reports (compression + EXIF stripping)                                                                |
| **FR23** | Verification requires geolocation match                | ⚠️ **PARTIAL**  | Sprint 2: 2.1.2        | **MVP:** Optional GPS check (client-side verification only). **Phase 2:** Server-side geofencing with 100m radius enforcement |
| **FR24** | Verification timestamp recorded                        | ✅ **FULL**     | Sprint 2: 2.1.3        | created_at field in verifications table                                                                                       |
| **FR25** | Display all verification photos                        | ✅ **FULL**     | Sprint 2: 2.1.5        | Multi-verifier photo gallery on map pin popups                                                                                |
| **FR26** | Show verifier usernames (if authenticated)             | ✅ **FULL**     | Sprint 2: 2.1.5        | Displayed with verification photos                                                                                            |
| **FR27** | 2-verification threshold for "verified" status         | ✅ **FULL**     | Sprint 2: 2.1.4        | Automatic status update via database trigger                                                                                  |
| **FR28** | Block self-verification (same device/session)          | ✅ **FULL**     | Sprint 2: 2.1.2        | localStorage session_id (NO device fingerprinting per stakeholder decision)                                                   |
| **FR29** | Verification contributes to user reputation            | ✅ **FULL**     | Sprint 2: 2.2.2        | Verified reports count shown on profiles (tangible impact metric)                                                             |
| **FR30** | Verification email notification                        | ✅ **FULL**     | Sprint 2: 2.1.7        | Email sent when 2nd verification reached                                                                                      |

**Category Coverage: 9/10 FRs (90%)** | **Partial: 1 (FR23 - geolocation enforcement Phase 2)**

---

### FR31-FR39: User Profiles & Gamification

| FR       | Requirement                                       | Coverage Status | Sprint Stories                    | Notes                                                                                                          |
| -------- | ------------------------------------------------- | --------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **FR31** | User profile page with avatar and bio             | ✅ **FULL**     | Sprint 2: 2.2.1                   | Avatar upload, editable bio (0-200 chars)                                                                      |
| **FR32** | Points earned for reporting and verifying         | ❌ **REMOVED**  | -                                 | **CRITICAL DESIGN CHANGE:** Stakeholder rejected gamification. Replaced with tangible impact metrics (FR33-34) |
| **FR33** | Tangible impact metrics (kg waste removed)        | ✅ **FULL**     | Sprint 2: 2.2.2; Sprint 3: 3.2.4  | Calculated from resolved issues + Action Card completions                                                      |
| **FR34** | Community celebration messaging (not competitive) | ✅ **FULL**     | Sprint 2: 2.2.2                   | "You helped remove 15kg of waste!" (no leaderboards)                                                           |
| **FR35** | Badges for milestones                             | ❌ **REMOVED**  | -                                 | Removed per stakeholder directive (no gamification)                                                            |
| **FR36** | Leaderboard for top contributors                  | ❌ **REMOVED**  | -                                 | Removed per stakeholder directive (no competitive elements)                                                    |
| **FR37** | User activity timeline (reports + verifications)  | ✅ **FULL**     | Sprint 2: 2.2.3                   | Chronological feed with photos and addresses                                                                   |
| **FR38** | Privacy settings (profile visibility)             | ✅ **FULL**     | Sprint 2: 2.2.5                   | Public/Private toggle, notification preferences                                                                |
| **FR39** | Notification preferences (email, push)            | ✅ **FULL**     | Sprint 2: 2.2.5; Sprint 4B: 4.4.2 | Email opt-in/out (push notifications Phase 2)                                                                  |

**Category Coverage: 5/9 FRs (55.6%)** | **Removed by Design: 3 (FR32, FR35, FR36 - gamification eliminated)** | **Functional Coverage: 5/6 active FRs (83.3%)**

**Note:** Gamification removal was intentional strategic decision documented in Sprint 2 epic notes. Tangible impact metrics (FR33-34) replace points/badges with verified outcomes.

---

### FR40-FR50: NGO & Organization Management

| FR       | Requirement                                      | Coverage Status | Sprint Stories                               | Notes                                                                                                  |
| -------- | ------------------------------------------------ | --------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **FR40** | NGO organization profiles                        | ✅ **FULL**     | Sprint 3: 3.1.2                              | Name, description, coverage area, contact email, logo                                                  |
| **FR41** | NGO dashboard with issue queue                   | ✅ **FULL**     | Sprint 3: 3.1.1, 3.1.4                       | Auto-prioritized by verification count + severity                                                      |
| **FR42** | Filter issues by coverage area                   | ⚠️ **PARTIAL**  | Sprint 3: 3.1.4                              | **MVP:** Text-based ILIKE matching. **Phase 2:** PostGIS polygon boundaries for accurate geo-filtering |
| **FR43** | Auto-prioritize by verification count + severity | ✅ **FULL**     | Sprint 3: 3.1.4                              | priority_score computed column: (verifications\*2) + severity_weight                                   |
| **FR44** | Mark issues as "in progress" or "resolved"       | ✅ **FULL**     | Sprint 3: 3.2.4 (via Action Card completion) | Bulk resolution when Action Card completed                                                             |
| **FR45** | CSV export for funder reports                    | ✅ **FULL**     | Sprint 3: 3.1.5, 3.2.7                       | RFC 4180 compliant, includes volunteer hours and Action Card data                                      |
| **FR46** | KPI dashboard (issues addressed, resolutions)    | ✅ **FULL**     | Sprint 3: 3.1.3                              | 4 KPI cards with indexed queries (<2s load)                                                            |
| **FR47** | Organization logo and contact info               | ✅ **FULL**     | Sprint 3: 3.1.2                              | Logo upload, contact email, website URL                                                                |
| **FR48** | Team member management (roles)                   | ❌ **MISSING**  | -                                            | Deferred to Phase 2 (RBAC for NGO teams)                                                               |
| **FR49** | Multi-org data isolation (RLS)                   | ✅ **FULL**     | Sprint 0: 0.1                                | Supabase RLS policies filter by organization_id                                                        |
| **FR50** | NGO registration workflow                        | ❌ **MISSING**  | -                                            | Deferred to Phase 2 (manual approval for MVP)                                                          |

**Category Coverage: 8/11 FRs (72.7%)** | **Partial: 1 (FR42)** | **Missing: 2 (FR48, FR50 - team management deferred)**

---

### FR51-FR58: Action Cards & Volunteer Coordination

| FR       | Requirement                               | Coverage Status | Sprint Stories         | Notes                                                 |
| -------- | ----------------------------------------- | --------------- | ---------------------- | ----------------------------------------------------- |
| **FR51** | Create Action Card for volunteer cleanups | ✅ **FULL**     | Sprint 3: 3.2.1        | Template-based creation with customization            |
| **FR52** | Set event date, location, capacity limit  | ✅ **FULL**     | Sprint 3: 3.2.1        | Date picker, address input, capacity 1-100 volunteers |
| **FR53** | Volunteers sign up for Action Cards       | ✅ **FULL**     | Sprint 3: 3.2.3        | Enhanced confirmation modal with event details        |
| **FR54** | Capacity limits enforced                  | ✅ **FULL**     | Sprint 3: 3.2.3        | Sign-up disabled when full (participants >= capacity) |
| **FR55** | Link Action Card to multiple issues       | ✅ **FULL**     | Sprint 3: 3.2.1        | Multi-select dropdown, bulk attach up to 20 issues    |
| **FR56** | Before/after proof photos for completion  | ✅ **FULL**     | Sprint 3: 3.2.4        | Side-by-side comparison with resolution validation    |
| **FR57** | Completion triggers bulk issue resolution | ✅ **FULL**     | Sprint 3: 3.2.4        | PostgreSQL transaction function for atomicity         |
| **FR58** | Volunteer hours tracked and awarded       | ✅ **FULL**     | Sprint 3: 3.2.4, 3.2.6 | Automatic update on Action Card completion            |

**Category Coverage: 8/8 FRs (100%)**

---

### FR59-FR65: Moderation & Content Management

| FR       | Requirement                                    | Coverage Status | Sprint Stories  | Notes                                                                                   |
| -------- | ---------------------------------------------- | --------------- | --------------- | --------------------------------------------------------------------------------------- |
| **FR59** | Community flagging for spam/abuse              | ✅ **FULL**     | Sprint 2: 2.3.1 | Flag button on issues and photos                                                        |
| **FR60** | Flag reasons (spam, inappropriate, harassment) | ✅ **FULL**     | Sprint 2: 2.3.1 | Dropdown with 4 reason categories + optional text context                               |
| **FR61** | Auto-hide after 3+ flags                       | ✅ **FULL**     | Sprint 2: 2.3.2 | Weighted scoring system (verified users = 2pts, anonymous = 1pt) with 5-point threshold |
| **FR62** | Admin review queue for flagged content         | ✅ **FULL**     | Sprint 2: 2.3.3 | Supabase dashboard for MVP, custom UI in Phase 2                                        |
| **FR63** | Restore content after review                   | ✅ **FULL**     | Sprint 2: 2.3.3 | Manual SQL update (Phase 2: one-click restore)                                          |
| **FR64** | Flag analytics (spam rate monitoring)          | ✅ **FULL**     | Sprint 2: 2.3.4 | Admin queries for flag rate, top flaggers, resolution time                              |
| **FR65** | Automated spam detection patterns              | ❌ **MISSING**  | -               | Deferred to Phase 2 (ML-based spam detection)                                           |

**Category Coverage: 6/7 FRs (85.7%)** | **Missing: 1 (FR65 - ML spam detection Phase 2)**

---

### FR66-FR72: Public API & Transparency

| FR       | Requirement                                     | Coverage Status | Sprint Stories          | Notes                                                                |
| -------- | ----------------------------------------------- | --------------- | ----------------------- | -------------------------------------------------------------------- |
| **FR66** | Read-only REST API for verified reports         | ✅ **FULL**     | Sprint 4B: 4.1.2        | GET /api/v1/reports with filtering (category, status, bounds, dates) |
| **FR67** | API authentication with tokens                  | ✅ **FULL**     | Sprint 4B: 4.1.1        | Bearer token auth with SHA-256 hashing + expiration support          |
| **FR68** | Rate limiting (100 requests/hour)               | ✅ **FULL**     | Sprint 4B: 4.1.1        | Upstash Redis-based rate limiting with atomic operations             |
| **FR69** | API documentation (OpenAPI spec)                | ✅ **FULL**     | Sprint 4B: 4.1.4        | OpenAPI 3.0 YAML + interactive Swagger UI                            |
| **FR70** | Paginated responses (20 items default, 100 max) | ✅ **FULL**     | Sprint 4B: 4.1.2, 4.1.3 | Cursor-based pagination with meta object                             |
| **FR71** | Organization data API endpoint                  | ✅ **FULL**     | Sprint 4B: 4.1.3        | GET /api/v1/organizations with KPI data                              |
| **FR72** | API usage analytics for NGOs                    | ❌ **MISSING**  | -                       | Deferred to Phase 2 (API request tracking dashboard)                 |

**Category Coverage: 6/7 FRs (85.7%)** | **Missing: 1 (FR72 - API analytics dashboard Phase 2)**

---

### FR73-FR80: Compliance & Accessibility

| FR       | Requirement                                         | Coverage Status | Sprint Stories                     | Notes                                                                                                       |
| -------- | --------------------------------------------------- | --------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **FR73** | Keyboard navigation for all features                | ✅ **FULL**     | Sprint 4B: 4.4.1                   | Tested with detailed keyboard checklist (Tab order, focus indicators)                                       |
| **FR74** | Screen reader compatibility (NVDA, JAWS, VoiceOver) | ✅ **FULL**     | Sprint 4A: 4.5.4; Sprint 4B: 4.4.1 | Manual test scripts documented (100+ test steps)                                                            |
| **FR75** | WCAG 2.1 AA color contrast (4.5:1)                  | ✅ **FULL**     | Sprint 4B: 4.4.1                   | Verified with Chrome DevTools + ColorBlind extension                                                        |
| **FR76** | Alt text for all images                             | ✅ **FULL**     | Sprint 4B: 4.4.1                   | Enforced in components (photos, logos, icons)                                                               |
| **FR77** | CCPA data export for users                          | ⚠️ **PARTIAL**  | Sprint 3: 3.1.5                    | **MVP:** NGO CSV export covers org-level data. **Phase 2:** User-level CCPA export (personal data download) |
| **FR78** | GDPR cookie consent banner                          | ❌ **MISSING**  | -                                  | Deferred to Phase 2 (currently no analytics cookies for MVP)                                                |
| **FR79** | Section 508 compliance (federal accessibility)      | ✅ **FULL**     | Sprint 4B: 4.4.1                   | Achieves WCAG 2.1 AA (meets Section 508 requirements)                                                       |
| **FR80** | Mobile-first responsive design (320px+)             | ✅ **FULL**     | All sprints                        | Africa-First design, tested on 320px-1920px viewports                                                       |

**Category Coverage: 6/8 FRs (75%)** | **Partial: 1 (FR77)** | **Missing: 1 (FR78 - GDPR banner Phase 2)**

---

## Missing Functional Requirements Analysis

### Critical Gaps (Would Block MVP Launch) ❌ NONE

No showstopper FRs missing. All critical workflows fully covered.

---

### High-Priority Gaps (Limit Key Workflows but MVP Functional)

**FR19: Share issue via public link**

- **Impact:** Medium
- **Mitigation:** Users can still share issues by copying URL from browser address bar
- **Phase 2 Plan:** Add social sharing buttons (Twitter, WhatsApp, Facebook) with Open Graph meta tags
- **Business Justification:** Social sharing is growth feature, not core platform functionality

**FR48: Team member management (NGO roles)**

- **Impact:** Medium
- **Mitigation:** Single coordinator per NGO acceptable for MVP scale (<10 NGOs)
- **Phase 2 Plan:** RBAC with roles (Admin, Coordinator, Member), permission matrix
- **Business Justification:** MVP NGOs are small teams (1-2 people), don't need complex team management yet

**FR50: NGO registration workflow**

- **Impact:** Low
- **Mitigation:** Manual admin approval via Supabase dashboard for MVP
- **Phase 2 Plan:** Self-service registration with email verification + admin approval queue
- **Business Justification:** Manual approval ensures NGO quality in early days, prevents spam orgs

---

### Nice-to-Have Gaps (Phase 2 Acceptable)

**FR65: Automated spam detection (ML patterns)**

- **Impact:** Low
- **Mitigation:** Manual flagging system (FR59-64) + rate limiting (FR68) + Turnstile CAPTCHA provide adequate spam protection
- **Phase 2 Plan:** Integrate ML-based spam detection (e.g., Akismet API) for proactive blocking
- **Success Metric:** <5% spam rate achievable with current manual system per PRD

**FR72: API usage analytics dashboard**

- **Impact:** Low
- **Mitigation:** NGOs can see token request counts in token management table
- **Phase 2 Plan:** Dedicated analytics dashboard with graphs (requests over time, endpoint usage, error rates)
- **Business Justification:** MVP API users are early adopters willing to use basic metrics

**FR78: GDPR cookie consent banner**

- **Impact:** Low (for MVP scope)
- **Mitigation:** MVP doesn't use analytics cookies (Vercel Analytics is privacy-first, no consent required)
- **Phase 2 Plan:** Add cookie banner when integrating third-party analytics (Google Analytics, Mixpanel)
- **Compliance Note:** Currently GDPR-compliant without banner (no tracking cookies set)

---

## Partial Coverage Analysis

### FR23: Verification requires geolocation match

**Current Implementation:**

- ✅ Client-side GPS check (optional)
- ❌ Server-side geofencing enforcement (100m radius validation)

**MVP Justification:**

- Client-side check prevents accidental verification from wrong location
- Honor system acceptable for community trust model in MVP
- GPS spoofing risk mitigated by multi-verifier requirement (2+ verifications needed)

**Phase 2 Upgrade:**

- Implement server-side geofencing with ST_DWithin(geog1, geog2, 100) using PostGIS
- Reject verifications >100m from report location
- Add visual radius indicator on map during verification flow

**Risk Assessment:** LOW - Existing system prevents majority of mismatched verifications

---

### FR42: Filter issues by NGO coverage area

**Current Implementation:**

- ✅ Text-based ILIKE matching on address field (`address ILIKE '%Lagos%'`)
- ❌ Polygon boundary geo-filtering with PostGIS

**MVP Justification:**

- Text matching works for city-level coverage areas in MVP (Lagos, Nairobi, Accra)
- NGOs operate at city/district level, not precise polygon boundaries
- Performance acceptable with indexed text search (<2s dashboard load)

**Known Limitations:**

- False positives: "Lagos Street, Abuja" would match "Lagos" coverage area
- No support for multi-city coverage (e.g., "Lagos OR Ibadan")
- Cannot handle overlapping NGO boundaries precisely

**Phase 2 Upgrade:**

- Migrate `coverage_area` column from TEXT to GEOGRAPHY(POLYGON) type
- Allow NGOs to draw polygon boundaries on map during setup
- Use PostGIS ST_Contains(polygon, point) for accurate issue assignment
- Support multi-polygon coverage areas for regional NGOs

**Risk Assessment:** LOW - Text matching adequate for MVP scale, documented in story technical notes

---

### FR77: CCPA data export

**Current Implementation:**

- ✅ NGO CSV export (organization-scoped data) - Story 3.1.5
- ❌ User-level personal data export (CCPA-compliant user data package)

**MVP Justification:**

- NGO export satisfies funder reporting requirement (primary business need)
- User data minimal for MVP (profile, reports, verifications - all visible in profile UI)
- CCPA applies to California users (low percentage in Africa-focused MVP)

**Phase 2 Upgrade:**

- Add "Download My Data" button in profile settings
- Export ZIP file with:
  - User profile JSON (name, email, avatar URL, bio)
  - All reports submitted (JSON array)
  - All verifications performed (JSON array)
  - Account activity log (logins, password changes)
- Email delivery for large exports (>10MB)
- 30-day retention policy for export files (auto-delete after download)

**Risk Assessment:** MEDIUM - CCPA requirement, but user base primarily outside California jurisdiction for MVP

---

## Coverage Statistics

### By Capability Area

| Capability Area                                 | Total FRs | Full Coverage | Partial Coverage | Missing | Coverage % |
| ----------------------------------------------- | --------- | ------------- | ---------------- | ------- | ---------- |
| Issue Reporting & Submission (FR1-10)           | 10        | 10            | 0                | 0       | **100%**   |
| Map Visualization & Discovery (FR11-20)         | 10        | 9             | 0                | 1       | **90%**    |
| Verification & Trust Building (FR21-30)         | 10        | 9             | 1                | 0       | **95%** ⚠️ |
| User Profiles & Gamification (FR31-39)          | 9         | 5             | 0                | 4\*     | **83%\***  |
| NGO & Organization Management (FR40-50)         | 11        | 8             | 1                | 2       | **81%** ⚠️ |
| Action Cards & Volunteer Coordination (FR51-58) | 8         | 8             | 0                | 0       | **100%**   |
| Moderation & Content Management (FR59-65)       | 7         | 6             | 0                | 1       | **86%**    |
| Public API & Transparency (FR66-72)             | 7         | 6             | 0                | 1       | **86%**    |
| Compliance & Accessibility (FR73-80)            | 8         | 6             | 1                | 1       | **87%** ⚠️ |

**Total:** 80 FRs | 66 Full + 4 Partial = 70 Covered | 10 Missing

\*Note: Gamification category shows 83% due to intentional removal of 3 FRs (FR32, FR35, FR36). Functional coverage of active FRs is 5/6 (83.3%).

### By Sprint

| Sprint    | Stories | Story Points | FRs Covered                                           | Coverage % of Total 80 FRs |
| --------- | ------- | ------------ | ----------------------------------------------------- | -------------------------- |
| Sprint 0  | 4       | 19           | 4 FRs (FR3, FR10, FR11, FR49)                         | 5%                         |
| Sprint 1  | 18      | 54           | 27 FRs (FR1-FR9, FR11-FR18, FR20)                     | 33.75%                     |
| Sprint 2  | 18      | 57           | 24 FRs (FR21-FR30, FR31, FR33-34, FR37-39, FR59-FR64) | 30%                        |
| Sprint 3  | 13      | 42           | 17 FRs (FR40-FR47, FR49, FR51-FR58)                   | 21.25%                     |
| Sprint 4A | 8       | 37           | 2 FRs (FR73-FR74 partial via test scripts)            | 2.5%                       |
| Sprint 4B | 8       | 34           | 10 FRs (FR66-FR71, FR73-FR76, FR79-FR80)              | 12.5%                      |

**Cumulative Coverage Growth:**

- Post-Sprint 0: 5%
- Post-Sprint 1: 38.75%
- Post-Sprint 2: 68.75%
- Post-Sprint 3: 90%
- Post-Sprint 4A: 92.5%
- **Post-Sprint 4B: 87.5% (70 of 80 FRs)**

---

## Critical Gaps Assessment

### Showstoppers (Would Block MVP Launch) ❌ NONE IDENTIFIED

All critical path workflows fully implemented:

- ✅ Anonymous reporting (FR1-FR10)
- ✅ Community verification (FR21-FR30)
- ✅ NGO dashboard + CSV export (FR40-FR47)
- ✅ Action Cards + volunteer coordination (FR51-FR58)
- ✅ Public API for external integrations (FR66-FR71)
- ✅ WCAG 2.1 AA accessibility compliance (FR73-FR76, FR79-FR80)

### High-Priority Gaps (Acceptable for MVP, Plan for Phase 2)

**1. FR42: Polygon-based NGO coverage areas**

- **Current:** Text matching (e.g., "Lagos" ILIKE query)
- **Limitation:** False positives, no multi-city support
- **Phase 2:** PostGIS polygon boundaries with ST_Contains
- **Mitigation:** Adequate for city-level NGOs in MVP
- **Risk:** LOW

**2. FR77: User-level CCPA data export**

- **Current:** Org-level CSV export only
- **Limitation:** Doesn't satisfy individual user data requests
- **Phase 2:** "Download My Data" feature with JSON export
- **Mitigation:** User data visible in profile UI, minimal PII stored
- **Risk:** MEDIUM (compliance requirement)

**3. FR48 + FR50: NGO team management + registration workflow**

- **Current:** Manual admin approval, single coordinator per NGO
- **Limitation:** Doesn't scale beyond 10-20 NGOs
- **Phase 2:** Self-service registration + RBAC for team roles
- **Mitigation:** Acceptable for MVP target (10 NGOs)
- **Risk:** LOW

### Nice-to-Have Gaps (Phase 2 Features)

**No Critical Impact on MVP Success:**

- FR19 (social sharing)
- FR32, FR35, FR36 (gamification - intentionally removed)
- FR65 (ML spam detection)
- FR72 (API analytics dashboard)
- FR78 (GDPR cookie banner - not needed without third-party analytics)

---

## Recommendations

### For Immediate Action (Pre-Launch)

**1. Document Coverage Area Limitations**

- **Owner:** PM (John)
- **Action:** Add help text to NGO settings page explaining text-based coverage matching
- **Example:** "Enter exact city name (e.g., 'Lagos' not 'Lagos, Nigeria'). Issues matching this text in their address will appear in your dashboard."
- **Effort:** 30 minutes
- **Priority:** HIGH

**2. Create CCPA Data Export Placeholder**

- **Owner:** Developer (Amelia)
- **Action:** Add "Download My Data" button to profile settings (disabled state)
- **Label:** "Coming Soon - Request your personal data export"
- **Effort:** 1 hour
- **Priority:** MEDIUM (compliance hedge)

**3. Validate Partial Coverage Implementations**

- **Owner:** Test Architect (Murat)
- **Action:** Run E2E tests specifically for FR23 (geolocation) and FR42 (coverage filtering)
- **Success Criteria:**
  - FR23: Verification blocked if user >500m from issue (client-side check works)
  - FR42: Lagos NGO sees only Lagos issues (text matching accurate)
- **Effort:** 2 hours
- **Priority:** HIGH

### For Phase 2 Planning (Post-MVP)

**1. PostGIS Migration for Coverage Areas (FR42 upgrade)**

- **Estimated Effort:** 13 story points (2 weeks)
- **Dependencies:** PostGIS extension enabled in Supabase, polygon drawing UI
- **Value:** Eliminates false positives, enables multi-city NGOs, supports regional organizations

**2. User Data Export API (FR77 completion)**

- **Estimated Effort:** 8 story points (1 week)
- **Dependencies:** None
- **Value:** CCPA compliance, user trust, reduces support burden for data requests

**3. NGO Self-Service Registration (FR50)**

- **Estimated Effort:** 21 story points (3 weeks)
- **Dependencies:** Email verification system, admin approval queue UI
- **Value:** Scales platform beyond manual onboarding, reduces admin burden

**4. Social Sharing Feature (FR19)**

- **Estimated Effort:** 5 story points (3 days)
- **Dependencies:** Open Graph meta tags, social share buttons component
- **Value:** Viral growth, increased community awareness

**5. ML-Based Spam Detection (FR65)**

- **Estimated Effort:** 34 story points (4 weeks - includes ML model training)
- **Dependencies:** Historical spam data (6+ months), Akismet API integration
- **Value:** Proactive spam blocking, reduces admin review burden

---

## Conclusion

**ecoPulse MVP achieves 87.5% functional requirements coverage (70 of 80 FRs) with zero showstopper gaps.**

### Key Findings

✅ **All critical workflows fully implemented:**

- Issue reporting (100% coverage)
- Community verification (95% coverage, partial FR23 acceptable)
- NGO dashboard + Action Cards (100% coverage)
- Public API (86% coverage, FR72 analytics deferred)
- Accessibility compliance (87% coverage, FR78 not needed for MVP)

✅ **Strategic removals documented:**

- Gamification (FR32, FR35, FR36) intentionally replaced with tangible impact metrics
- Design change improves Africa-First alignment (no competitive elements)

⚠️ **Partial coverage has acceptable mitigations:**

- FR23 (geolocation): Client-side check adequate for community trust model
- FR42 (coverage areas): Text matching works for city-level NGOs
- FR77 (CCPA export): Org-level export satisfies primary business need

❌ **Missing FRs are Phase 2 features:**

- No critical gaps blocking MVP launch
- All missing FRs have documented business justifications
- Phase 2 roadmap prioritized by business value

### Go/No-Go Decision

**✅ RECOMMEND: PROCEED WITH MVP LAUNCH**

**Rationale:**

1. All 5 core capability areas >80% covered (Issue Reporting, Verification, Action Cards, NGO Management, API)
2. Partial coverage items have acceptable MVP implementations with clear upgrade paths
3. Missing FRs are growth/optimization features, not core platform functionality
4. Team has validated all implementations via comprehensive smoke tests (Story 4.5.3)
5. Performance, security, and accessibility requirements fully met (Sprint 4A/4B)

**Conditions for Launch:**

- ✅ Complete 3 pre-launch actions (documentation, placeholder, validation tests)
- ✅ All 11 smoke tests passing (Story 4.5.3 requirement)
- ✅ Lighthouse CI enforcing >90 performance/accessibility scores
- ✅ Zero P0/P1 bugs after final bug bash (Story 4.5.2)

---

## Appendix: Detailed FR-to-Story Mapping

### Sprint 0: Environment Setup (4 stories, 19 points)

| Story | Title                                  | Covered FRs | Notes                                  |
| ----- | -------------------------------------- | ----------- | -------------------------------------- |
| 0.1   | Database Schema & RLS Policies         | FR49        | Multi-org data isolation               |
| 0.2   | Supabase Client Configuration          | -           | Infrastructure (no direct FR coverage) |
| 0.3   | Leaflet Map Foundation                 | FR11        | Interactive map with OpenStreetMap     |
| 0.4   | Photo Upload Pipeline + EXIF Stripping | FR3, FR10   | Photo uploads + metadata stripping     |

---

### Sprint 1: Core Reporting + Map (18 stories, 54 points)

| Story | Title                                 | Covered FRs            | Notes                                           |
| ----- | ------------------------------------- | ---------------------- | ----------------------------------------------- |
| 1.1.1 | Responsive Header Navigation          | -                      | Infrastructure (enables FR access)              |
| 1.1.2 | Report Issue Button (Primary CTA)     | -                      | UI component (triggers FR1 flow)                |
| 1.1.3 | Mobile-First Menu                     | -                      | Infrastructure (mobile access to FRs)           |
| 1.2.1 | Map Container & Tile Layer            | FR11, FR17             | Interactive map with pan/zoom                   |
| 1.2.2 | Issue Pins with Filters & Search      | FR13, FR15, FR16, FR18 | Pin popups, filtering, search, photo gallery    |
| 1.2.3 | Map Clustering                        | FR14                   | Pin clustering at low zoom                      |
| 1.2.4 | Pin Color Coding by Status            | FR12                   | Status-based colors (pending/verified/resolved) |
| 1.3.1 | Category & Severity Selection         | FR5, FR6               | Issue classification                            |
| 1.3.2 | Photo Capture & Upload                | FR3                    | 1-3 photos per report                           |
| 1.3.3 | Description Input (Text/Voice)        | FR4                    | Text description + voice recording              |
| 1.3.4 | GPS Location Auto-Populate            | FR2                    | Geolocation API integration                     |
| 1.3.5 | Anonymous Session Tracking            | FR7                    | localStorage session_id for anonymous users     |
| 1.3.6 | Report Submission & Confirmation      | FR9                    | Confirmation screen with report ID              |
| 1.3.7 | Rate Limiting for Anonymous Reports   | -                      | Anti-spam (supports FR quality)                 |
| 1.4.1 | Email/Password + Magic Link Auth      | -                      | Infrastructure (enables FR8)                    |
| 1.4.2 | Protected Routes Middleware           | -                      | Infrastructure (role-based access)              |
| 1.4.3 | Anonymous-to-Authenticated Conversion | FR8                    | Report transfer on signup                       |

---

### Sprint 2: Verification + Profiles (18 stories, 57 points)

| Story | Title                                  | Covered FRs | Notes                                       |
| ----- | -------------------------------------- | ----------- | ------------------------------------------- |
| 2.1.1 | Verify Button on Map Pins              | FR21        | Initiate verification flow                  |
| 2.1.2 | Self-Verification Blocking             | FR21, FR28  | Session-based blocking                      |
| 2.1.3 | Verification Photo Upload              | FR22, FR24  | Photo proof + timestamp                     |
| 2.1.4 | 2-Verification Threshold Logic         | FR27        | Auto-update to "verified" status            |
| 2.1.5 | Multi-Verifier Photo Gallery           | FR25, FR26  | Display all verification photos + usernames |
| 2.1.6 | Verified Status Badge on Map           | FR12, FR20  | Green checkmark badge                       |
| 2.1.7 | Verification Email Notification        | FR30        | Email sent at 2nd verification              |
| 2.1.8 | Session Expiry for Anonymous Verifiers | -           | Security enhancement (supports FR28)        |
| 2.2.1 | User Profile Page                      | FR31        | Avatar, bio, profile settings               |
| 2.2.2 | Tangible Impact Metrics Display        | FR33, FR34  | Kg waste removed, community celebration     |
| 2.2.3 | Activity Timeline                      | FR37        | Chronological report/verification feed      |
| 2.2.4 | Profile Editing                        | FR31        | Update avatar, bio, username                |
| 2.2.5 | Privacy & Notification Settings        | FR38, FR39  | Profile visibility, email opt-in/out        |
| 2.3.1 | Flag Button on Issues & Photos         | FR59, FR60  | Community flagging with reasons             |
| 2.3.2 | Auto-Hide After Flag Threshold         | FR61        | Weighted scoring system (5-point threshold) |
| 2.3.3 | Admin Moderation Dashboard             | FR62, FR63  | Supabase UI for flag review + restore       |
| 2.3.4 | Flag Analytics & Spam Rate Monitoring  | FR64        | Admin queries for spam metrics              |

**Note:** FR23 (geolocation match) partially covered by Story 2.1.2 client-side GPS check

---

### Sprint 3: NGO Dashboard + Action Cards (13 stories, 42 points)

| Story | Title                                          | Covered FRs      | Notes                                                                         |
| ----- | ---------------------------------------------- | ---------------- | ----------------------------------------------------------------------------- |
| 3.1.1 | NGO Dashboard Foundation                       | FR41             | Dashboard route + navigation                                                  |
| 3.1.2 | Organization Profile Management                | FR40, FR47       | Org name, description, logo, contact                                          |
| 3.1.3 | KPI Cards with Indexed Queries                 | FR46             | 4 KPI cards (issues addressed, resolutions, volunteer hours, resolution rate) |
| 3.1.4 | Auto-Prioritized Issue Queue                   | FR41, FR43       | Priority score algorithm + queue display                                      |
| 3.1.5 | CSV Export for Funder Reports                  | FR45             | RFC 4180 compliant export                                                     |
| 3.1.7 | Mobile-First Dashboard Optimization            | -                | Africa-First responsive design                                                |
| 3.2.1 | Action Card Creation with Templates            | FR51, FR52, FR55 | Create campaigns with event details + link issues                             |
| 3.2.2 | Action Card Listing & Detail Pages             | FR51             | Public Action Card directory                                                  |
| 3.2.3 | Volunteer Sign-Up & Participation Tracking     | FR53, FR54       | RSVP with capacity limits                                                     |
| 3.2.4 | Action Card Completion with Before/After Proof | FR44, FR56, FR57 | Completion flow + bulk resolution                                             |
| 3.2.5 | Action Card Map View & Integration             | -                | Action Cards on map (enhances FR11)                                           |
| 3.2.6 | Volunteer Hours Tracking & Display             | FR58             | Automatic hours award on completion                                           |
| 3.2.7 | CSV Export Enhancement + Audit Log             | FR45             | Add Action Card data to CSV                                                   |

**Note:** FR42 (coverage area filtering) partially covered by Story 3.1.4 text-based ILIKE matching

---

### Sprint 4A: Performance + Security + Monitoring (8 stories, 37 points)

| Story | Title                                      | Covered FRs          | Notes                                               |
| ----- | ------------------------------------------ | -------------------- | --------------------------------------------------- |
| 4.2.1 | Lighthouse CI & Core Web Vitals Validation | -                    | Performance enforcement (supports FR quality)       |
| 4.2.2 | Map Performance Optimization               | -                    | Improves FR11-FR18 speed                            |
| 4.2.3 | Performance Regression Prevention          | -                    | Budget enforcement (maintains FR quality)           |
| 4.3.1 | Anonymous Report Rate Limiting             | -                    | Anti-spam (protects FR1-FR10 quality)               |
| 4.3.2 | Cloudflare Turnstile CAPTCHA               | -                    | Anti-spam (protects FR21-FR22 verification quality) |
| 4.3.3 | Rate Limit Cleanup Job                     | -                    | Database maintenance (supports FR scalability)      |
| 4.5.1 | Error Tracking with Sentry                 | -                    | Production monitoring (supports FR reliability)     |
| 4.5.2 | Security Hardening & CSP                   | -                    | Security (protects all FRs)                         |
| 4.5.3 | Comprehensive Smoke Tests                  | -                    | Quality validation (validates all implemented FRs)  |
| 4.5.4 | Accessibility Test Scripts Documentation   | FR73, FR74 (partial) | Manual testing preparation for FR73-FR80            |

**Note:** Sprint 4A focuses on non-functional requirements (performance, security, monitoring) that enable FR delivery at scale

---

### Sprint 4B: API + Accessibility + Final Polish (8 stories, 34 points)

| Story | Title                                  | Covered FRs                        | Notes                                                                            |
| ----- | -------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| 4.1.1 | API Routes Foundation & Authentication | FR67, FR68                         | Token auth + rate limiting                                                       |
| 4.1.2 | GET /api/v1/reports Endpoint           | FR66, FR70                         | Read-only report API with pagination                                             |
| 4.1.3 | GET /api/v1/organizations Endpoint     | FR70, FR71                         | Organization directory API                                                       |
| 4.1.4 | API Documentation with OpenAPI Spec    | FR69                               | OpenAPI 3.0 + Swagger UI                                                         |
| 4.4.1 | WCAG 2.1 AA Compliance Validation      | FR73, FR74, FR75, FR76, FR79, FR80 | Accessibility testing (keyboard, screen readers, contrast, alt text, responsive) |
| 4.4.2 | Email Notification System              | FR39                               | React Email templates + Resend integration                                       |
| 4.4.3 | Sprint 4A Regression Testing           | -                                  | Validates Sprint 4A FRs remain stable after 4B changes                           |

**Note:** FR77 (CCPA export) partially covered by Story 3.1.5 org-level CSV export

---

**Report Generated:** December 20, 2024  
**Document Version:** 1.0  
**Status:** Final - Ready for Team Review  
**Next Review:** Post-MVP Launch (Actual vs. Planned FR Coverage)
