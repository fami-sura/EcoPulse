# EcoPulse — Comprehensive MVP Product Spec (Core Features)

**One-line pitch:** EcoPulse is a **distributed environmental action platform** that turns local environmental issues into **structured, trackable, and verifiable** community-driven solutions—empowering citizens as active change-makers, not passive reporters.

**Strategic Positioning (December 2025):** Blue Ocean differentiation—we combine Action Cards + Community Verification + Multi-Org Native architecture + Environmental Domain Expertise. We're not "better 311"; we're fundamentally different: **distributed action** vs. **centralized ticketing**.

**Go-To-Market:** NGOs first (Trojan Horse strategy), then government agencies. Freemium SaaS model: Free tier for communities, $49-99/month for NGOs (dashboard + CSV exports), $499+/month for government agencies.

---

## 1) Problem & Opportunity

Environmental issues are **hyperlocal** (litter hotspots, blocked drainage, smoke/burning, unsafe water points, urban heat). Most communities face three gaps:

1. **Unstructured reporting:** complaints are scattered across chats/social media with no consistent data.
2. **No action pathway:** even when a problem is reported, people don’t know the next steps or who to contact.
3. **Low trust & follow-through:** without proof/verification, it’s hard to know what’s resolved or prioritize resources.

EcoPulse closes the loop: **Report → Action Plan → Fix → Proof → Verification → Insights**.

---

## 2) MVP Goals, Non-Goals, Success Criteria

### MVP Goals

- Make reporting **fast** (≤ 60 seconds on mobile).
- Convert each report into an **Action Card** (safe, realistic steps + contact templates).
- Provide a **live map** + filters to see trends and urgency.
- Enable **verification** (before/after + second-person verification).
- Support **basic organizational oversight** (moderation + viewing + assigning) without heavy bureaucracy.

### Non-Goals (MVP)

- Not an emergency-response system.
- No hardware sensor integrations (AQI devices, IoT).
- No advanced case management (multi-stage workflows, SLAs, procurement).
- No full public transparency portal for agencies (Phase 2+).

### MVP Success Criteria (KPIs)

- Median report submission time **< 60s**.
- **≥ 30%** issues move from **Open → In Progress**.
- **≥ 10–15%** reach **Resolved with Proof**.
- **≥ 20%** of active users join a team or follow a local area.
- Low abuse: spam/duplicate rate **< 5–10%** with simple moderation.

---

## 3) Target Users & Personas

### Community Member (Reporter)

- Wants to report quickly and see action.
- Needs: simplicity, privacy options, safety guidance.

### Student / Volunteer (Action Taker)

- Wants to contribute and track impact.
- Needs: missions, points/badges, proof and shareability.

### NGO Coordinator (Organizer)

- Wants to mobilize volunteers, prioritize work, and report impact to donors.
- Needs: dashboard, assignments, verified outcomes, exportable reports.

### Government Agency Staff (Responder)

- Wants structured issues with location, severity, duplicates handled, and clear status.
- Needs: organization-level admin access, assignment, communication templates, analytics.

---

## 4) MVP Scope Overview

### Core Modules (MVP)

1. **Issue Reporting**
2. **Map + Feed + Filters**
3. **Issue Detail + Action Cards**
4. **Status Updates + Proof + Verification**
5. **Teams + Weekly Missions (light)**
6. **Organization Admin Panel (foundation)**

### Optional MVP Enhancers (Nice-to-have)

- Duplicate suggestions on submission
- Local contact directory configuration
- Shareable impact poster generation
- Simple notifications (email/web push later)

---

## 5) Environmental Issue Categories (MVP Focus: 2 Categories)

**MVP Launch: 2 Categories Only** (Strategic Decision - December 2025)

1. **Waste & Litter**
2. **Drainage / Flood Risk**

**Rationale:** These are highest-ROI proof points—visible, verifiable, clear before/after states. Proving the core loop (Report → Action → Fix → Proof → Verify) on 2 well-understood problems before expanding.

**Phase 2 Expansion:** 3. Urban Heat / No Shade 4. Water Issues (leaks, dirty points) 5. Air / Smoke / Noise

### Severity

- **Low:** small/localized, non-urgent
- **Medium:** recurring/problematic, needs attention soon
- **High:** hazardous/urgent (but not emergency)

**Action Card Templates:** 6 total (2 categories × 3 severity levels) stored in database table

---

## 6) Key User Flows

### Flow A — Report an Issue (Anonymous allowed)

1. Open **Report**
2. Select **Category**
3. Set **Location** (pin / current location)
4. Select **Severity**
5. Add **Short note** + optional photo
6. Submit → Issue created → user sees **Action Card** immediately

### Flow B — Start Fix → Proof

1. Open Issue
2. Tap **Start Fix** → status becomes **In Progress**
3. Follow Action Card steps
4. Upload **After photo** + proof note → status becomes **Resolved (Unverified)**

### Flow C — Verification

1. Another logged-in user taps **Verify**
2. Confirms checklist (photo looks valid, location matches, change is real)
3. Issue becomes **Verified**

### Flow D — Teams & Missions (Light)

1. Join/Create Team
2. See weekly mission
3. Contribute (report, proof, verify)
4. Earn points → appears on leaderboard

---

## 7) Feature Requirements (MVP)

### 7.1 Reporting

- Anonymous reporting allowed (no public identity shown).
- **ALL fields REQUIRED for quality:** category, location, severity, photo, note (minimum 10 characters)
- Rate limit anonymous submissions (per device/session/IP).

**Strategic Decision:** Required fields ensure NGOs/agencies receive actionable, trustworthy data. 60-second target is for speed + accuracy, not shortcuts.

**Validation rules**

- Must include a location (GPS auto-detect with manual pin adjustment fallback)
- Photo required (validates issue exists, enables before/after verification)
- Note minimum 10 characters (inline validation with helpful prompts)
- Prevent extreme coordinate errors (outside allowed region if configured)
- Progress indicator during upload maintains user confidence
- If user denies location, allow pin placement

### 7.2 Map + Feed

- Map pins with clustering.
- Filter by: category, severity, status, date range, distance (near me).
- List view mirrors map results.
- Sorting options: newest, most urgent, nearest.

### 7.3 Issue Detail

- Display: photos, location label, severity, status, timestamps.
- Buttons:
  - **Start Fix** (Open → In Progress)
  - **Add Proof** (Resolved Unverified)
  - **Verify** (eligible users)
  - **Share** (copy link)
  - **Flag** (spam/unsafe/duplicate/wrong location)

### 7.4 Action Cards (Rules-Based MVP)

Action Cards must always be available using deterministic templates based on category + severity.

Each Action Card includes:

1. **Quick Steps** (3–6)
2. **Safety Note**
3. **Who to Contact** (from directory)
4. **Message Templates** (WhatsApp/email)

> Phase 2+: AI-enhanced personalization (clean title/tags, duplicate detection, better action suggestions).

### 7.5 Status + Proof

Statuses:

- **Open**
- **In Progress**
- **Resolved (Unverified)**
- **Verified**
- **Hidden** (moderation)

Proof:

- After photo required to mark resolved.
- Proof note required (short).
- Optional before photo (but recommended).

Verification:

- Verifier cannot be the same user who submitted proof.
- One verification is enough for MVP; allow additional verifications later.

### 7.6 Teams + Missions

- Create team: name, type (school/club/community), region.
- Join team by invite link or search.
- Weekly mission displayed as a simple prompt + goal count.
- Leaderboard: weekly + all-time.

Points system:

- Report accepted: +1
- Start Fix: +1 (once)
- Submit Proof: +5
- Verify: +2
- Share impact poster: +1 (daily cap)

---

## 8) Organization & Roles (Government + NGO Ready)

EcoPulse is designed for multi-organization collaboration. Use an **Organization (Org)** model that can represent:

- Government agencies
- NGOs / nonprofits
- School administrations
- Community associations

### Roles (MVP - Simplified to 3)

**Strategic Decision (December 2025):** Simplified from 5 roles to 3 for MVP to reduce auth complexity by 60%.

- **Anonymous/Public User:** browse map, view issues, report (rate-limited), share links
- **Authenticated Member:** Everything Public can do PLUS submit proof, verify others' proofs, join teams, earn points, view personal profile
- **Admin:** Everything Member can do PLUS review flagged issues, hide/unhide, mark duplicates, view org dashboard, manage contact directory, export CSV reports, assign issues

**Phase 2 Role Expansion:**

- Org Staff vs Org Admin split (when building full organization management)
- Moderator as separate role (currently Admin handles moderation)
- Super Admin (platform-level multi-org management)

**Principle:** least privilege + audit logs + RBAC via Supabase Row-Level Security (RLS)

---

## 9) Admin Panel Spec (Organization-Grade)

> You asked for a “perfect admin panel” for orgs/agency/NGO integration. Below is the **full blueprint**, but MVP implementation focuses on the **core** subset.

### 9.1 MVP Admin (Core to Build Now)

**Admin Navigation**

- Dashboard
- Issues
- Flags/Moderation
- Contact Directory
- Teams (view-only)
- Reports/Exports (basic)
- Settings (org profile)

**Dashboard (MVP)**

- KPIs: total reports, open, in progress, resolved, verified (last 7/30 days)
- Category breakdown
- “Hotspots” list (top locations)
- Recent activity feed

**Issues (MVP)**

- Filters: category, severity, status, date, area
- Bulk actions: mark duplicate, hide, assign (light)
- Issue detail admin view: history, flags, notes

**Flags/Moderation (MVP)**

- Queue of flagged issues
- Decision actions:
  - mark as duplicate (link to original)
  - hide/unhide
  - request more info (comment)
- Abuse controls: rate limit overrides, ban user/device (optional)

**Contact Directory (MVP)**

- Maintain who-to-contact per category/region:
  - department name
  - contact methods (email/phone/WhatsApp/website)
  - hours / response note
- This powers Action Card “Who to Contact.”

**Exports (MVP)**

- CSV export for issues within a date range
- Basic PDF summary (Phase 2+ if needed)

### 9.2 Phase 2+ Admin (Advanced / “Perfect”)

- Case management: SLA timers, escalation, multi-step workflow
- Work orders: assign to field team, schedule visits, attach documents
- Inter-org collaboration: handoff to another org, shared issues with permissions
- GIS layers: flooding zones, waste bins, drainage infrastructure overlays
- Public transparency portal: “resolved this month” with verified proof
- Role-based custom dashboards per department
- API integrations: 311 systems, WhatsApp bot intake, email ingestion

---

## 10) Data Model (MVP)

### entities

#### organizations

- id (uuid)
- name
- type (government/ngo/nonprofit/school/community)
- region
- logo_url (optional)
- created_at

#### org_users

- id
- org_id
- user_id
- role (org_staff/org_admin/moderator)
- created_at

#### users

- id
- name (optional)
- handle (optional)
- email (optional)
- role (user/mod/admin)
- team_id (nullable)
- created_at

#### teams

- id
- org_id (nullable, for org-sponsored teams)
- name
- type (school/club/community)
- region
- created_by
- created_at

#### issues

- id
- org_id (nullable; assigned/owned later)
- title (derived)
- description
- category (enum)
- severity (enum)
- status (enum: open/in_progress/resolved_unverified/verified/hidden)
- lat, lng
- location_label (optional)
- photo_url (optional)
- created_by (nullable if anonymous)
- created_at
- updated_at
- tags (array)
- duplicates_of (issue_id nullable)

#### issue_actions

- id
- issue_id
- steps (json/text)
- safety_note
- contacts (json array)
- message_templates (json)
- generated_by (rules/ai)
- created_at

#### proofs

- id
- issue_id
- before_photo_url (optional)
- after_photo_url (required)
- proof_note
- submitted_by
- submitted_at
- verified_by (nullable)
- verified_at (nullable)
- verify_note (nullable)

#### flags

- id
- issue_id
- flagged_by (nullable if anonymous)
- flag_type (spam/unsafe/duplicate/wrong_location)
- note (optional)
- created_at
- status (open/closed)

#### points_log

- id
- user_id
- team_id
- issue_id (nullable)
- action (report/start_fix/submit_proof/verify/share)
- points
- created_at

#### audit_log (recommended even in MVP)

- id
- org_id (nullable)
- actor_user_id
- action
- target_type
- target_id
- metadata (json)
- created_at

---

## 11) Action Card Templates (MVP)

Action Cards are deterministic templates (always available). Each includes “Quick Steps”, “Safety”, “Who to Contact”, and “Message Template”.

### Waste & Litter

**Quick Steps**

1. Gather gloves + bags (2–5 people).
2. Clean only visible/safe items; avoid sharp objects.
3. Separate recyclables if possible.
4. Take before/after photos from same angle.
5. Dispose at approved bin/collection point.

**Safety** Avoid needles, broken glass, unknown liquids.

**Template Message**

> Hello, we reported a litter hotspot at (location). It needs cleanup support or bin placement. Issue link: (link)

### Drainage / Flood Risk

**Quick Steps**

1. Photograph from a safe distance.
2. Note if water is blocked or flowing.
3. Remove only light surface litter if safe (no entering drains).
4. Notify responsible unit.
5. Re-check after rainfall and update.

**Safety** Do not enter drains; avoid contaminated water.

**Template Message**

> Hi, there is a blocked drainage point at (location) causing flood risk. Issue link: (link). Please advise next steps.

### Urban Heat / No Shade

**Quick Steps**

1. Record time and heat condition.
2. Photo the exposed area.
3. Suggest shade action: trees/shade cloth/seating relocation.
4. Propose a “Shade Spot” plan.
5. Update if improvements happen.

**Safety** Encourage hydration; avoid peak sun exposure.

**Template Message**

> Hello, this area at (location) has high heat exposure and no shade. Could we add trees or shade structure? Issue link: (link)

### Water Issues

**Quick Steps**

1. Photo the leak/dirty point.
2. Note time and whether continuous.
3. Estimate flow (drip/steady stream).
4. Report to maintenance or water authority.
5. Re-check in 24–72 hours.

**Safety** Avoid contact with unknown water sources.

**Template Message**

> Hi, we noticed a water issue at (location): (leak/dirty water). Please advise next steps. Issue link: (link)

### Air / Smoke / Noise

**Quick Steps**

1. Record time and duration.
2. Note possible source if visible.
3. Upload photo/video if safe.
4. Report to the responsible unit.
5. Track recurrence.

**Safety** Don’t confront individuals; keep distance.

**Template Message**

> Hello, there is recurring smoke/noise at (location) around (time). Issue link: (link). Who can address this?

---

## 12) UI Copy (MVP)

### Landing

- Title: **Turn local environmental problems into verified action.**
- Subtitle: Report in 60 seconds. Get an action plan. Fix together.
- Buttons: **Report an Issue** | **View Map** | **Join a Team**

### Reporting

- Helper: “Be safe. Don’t approach hazards.”
- CTA: **Submit Report**

### Issue Detail

- Sections: “Action Card”, “Safety”, “Contacts”, “Updates & Proof”
- Actions: “Start Fix”, “Add Proof”, “Verify”, “Flag”, “Share”

### Admin

- “Review flags and duplicates first—clean data builds trust.”

---

## 13) Safety, Privacy, and Moderation

### Safety

- Persistent safety banner on report/issue pages.
- “For emergencies, contact local emergency services.”
- Category-specific warnings (drainage/air/smoke).

### Privacy

- Anonymous reporting supported.
- Display approximate location label (optional), not full address by default.
- Photo metadata stripping recommended.

### Moderation (MVP)

- Flags (spam/unsafe/duplicate/wrong location)
- Auto-hide if flagged by N users (configurable, e.g., 3).
- Moderator can:
  - hide/unhide
  - mark duplicate (link to original)
  - close flags with reason

---

## 14) Analytics & Telemetry (MVP)

Track events:

- `start_report`, `submit_report`, `view_issue`
- `start_fix`, `submit_proof`, `verify_proof`
- `join_team`, `create_team`
- `flag_issue`
- `admin_hide`, `admin_mark_duplicate`, `admin_export`

Dashboards:

- Reports, resolutions, verifications over time
- Category breakdown
- Hotspot clusters
- Median time-to-resolution
- Team performance

---

## 15) Non-Functional Requirements

- **Performance:** Map loads quickly (clustering + pagination).
- **Reliability:** Graceful fallback if photo upload fails (save report without photo).
- **Security:** RBAC, audit logs, input validation, rate limiting.
- **Accessibility:** Mobile-first, readable contrast, icon + text labels.
- **Scalability:** Use indexed geospatial queries and caching for map feeds.

---

## 16) MVP Build Plan (Step-by-Step)

**Tech Stack (Locked December 2025):**

- **Frontend:** Next.js 15 (App Router, React Server Components)
- **Backend/Database:** Supabase (PostgreSQL 15+ with PostGIS, Auth, Storage, Realtime)
- **Maps:** Leaflet + OpenStreetMap (data sovereignty, free, government-friendly)
- **Geolocation:** float8 (double precision lat/lng) with GiST spatial index
- **Action Cards:** Database table with 6 templates (2 categories × 3 severities)
- **Image Storage:** Supabase Storage with automatic optimization + EXIF stripping

---

### Sprint 1 — Core Reporting + Map

- Data models: issues, users, proofs (basic), flags (basic), action_card_templates
- Pages: landing, report form, map with clustering, issue detail
- Status transitions: Open ↔ In Progress
- **2 categories only:** Waste/Litter + Drainage
- Anonymous + authenticated reporting with required fields
- Action Cards display immediately after report submission
- Supabase Auth setup (magic link, OAuth, anonymous sessions)

### Sprint 2 — Verification + User Profiles

- Proof submission flow (after photo required, before photo optional)
- Second-person verification (verifier ≠ submitter, photo validation)
- **User Profile page:** personal impact stats (reports, fixes, proofs, verifications), points earned, contribution timeline, team affiliation badge
- Points system implementation (report +1, start fix +1, proof +5, verify +2)
- Status: Resolved (Unverified) → Verified

### Sprint 3 — NGO Dashboard

- `/org/dashboard` route with org-scoped RLS queries
- **NGO Dashboard features:**
  - KPIs: total reports, open, in progress, resolved, verified (last 7/30 days)
  - Category breakdown chart
  - Hotspots list (top locations by issue count)
  - Team performance leaderboards
  - Recent activity feed
- **CSV export endpoint** for donor reporting (verified outcomes with timestamps)
- Teams CRUD + join team functionality
- Weekly missions display (simple prompt + goal count)

### Sprint 4 — Polish + Contact Directory + Anti-Spam

- Contact directory (who-to-contact per category/region for Action Cards)
- Flags/Moderation queue (spam/unsafe/duplicate/wrong location)
- Empty states, onboarding tips, safety copy refinement
- Rate limiting tuning for anonymous submissions
- Shareable impact poster generation (optional)
- Performance optimization (map clustering, image lazy loading)

---

**Phase 2 (Post-MVP):**

- Government admin panel with full RBAC (Org Staff vs Org Admin roles)
- 311 system integration API (partner with SeeClickFix, Accela)
- Self-hosting deployment option (data sovereignty for governments)
- Additional categories (Urban Heat, Water Issues, Air/Smoke/Noise)
- AI enhancements (duplicate detection, smart prioritization, auto summaries)
- Public transparency portal ("resolved this month" with verified proof)
- WhatsApp/Email intake integration

---

## 17) Definition of Done (MVP)

A user can:

- report an issue (with/without login),
- see it on a map, open its details,
- get an Action Card,
- start a fix, upload proof,
- have another user verify it,
- join a team and appear on a leaderboard.

An org admin can:

- review flagged issues,
- hide/unhide and mark duplicates,
- manage contact directory,
- export issues as CSV.

---

## 18) Roadmap (Post-MVP)

### Phase 2: Advanced Features

- **Multi-org collaboration:** Inter-org handoffs, shared issues with permissions
- **Government admin panel:** Full RBAC (Org Staff vs Org Admin), SLA-based case management
- **311 Integration API:** Partner with SeeClickFix, Accela, PublicStuff (don't replace, integrate)
- **Self-hosting option:** Data sovereignty for governments (Supabase self-hosted)
- **Additional categories:** Urban Heat, Water Issues, Air/Smoke/Noise
- **GIS layers:** Flood zones, waste bins, drainage infrastructure overlays
- **Public transparency portal:** "Resolved this month" with verified proof showcase
- **AI enhancements:** Duplicate detection, smart prioritization, auto summaries, title generation
- **Advanced integrations:** WhatsApp bot intake, email ingestion, SMS notifications

### Strategic Partnerships

- Partner with existing 311 systems (integration layer, not replacement)
- Open-source community verification module (build developer advocates)
- Pilot programs in climate-vulnerable cities (coastal flooding, waste crisis regions)

### Business Model Evolution

- **Year 1 Target:** $300k ARR with 125 organizations (100 NGOs + 20 municipalities + 5 gov agencies)
- **Pricing Tiers:** Free (community), $49-99/mo (NGO), $499+/mo (government/enterprise)
- **Revenue Drivers:** NGO dashboards + CSV exports for donor reporting
