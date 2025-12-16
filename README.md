# EcoPulse (Mixed) — Ready-to-Build Product Spec (Hackathon Edition)

**One-line pitch:** EcoPulse lets students and communities report local environmental issues in 60 seconds, see them on a live map, and turn them into verified action through teams, missions, and shareable impact posters.

**Primary outcome:** More *resolved* issues (with proof), not just reports.

---

## 1) Goals, Non-Goals, Success Criteria

### Goals
- Make reporting **frictionless** (≤ 60 seconds, mobile-first).
- Convert each report into a clear **Action Card** (what to do next).
- Enable **teams + weekly missions** to drive repeat use.
- Provide **verification** (before/after + second-person verify) for trust.
- Make sharing effortless to boost visibility and engagement.

### Non-Goals (for MVP)
- Not a replacement for emergency services or official reporting systems.
- No complex sensor integrations (air quality devices, etc.) in MVP.
- No full-blown moderation staffing workflows—just lightweight controls.

### Success Criteria (what “good” looks like)
- ≥ 30% of issues move from **Open → In Progress**.
- ≥ 10–15% reach **Resolved with Proof**.
- ≥ 20% of active users join a team.
- ≥ 5% of sessions generate a **share poster**.
- Median time to submit a report: **< 60 seconds**.

---

## 2) Target Users & Personas

### Persona A: Student Volunteer (Primary)
- Wants impact, points, and something shareable for clubs/portfolio.
- Pain: “We clean once, then everyone forgets.”

### Persona B: Community Organizer (Primary)
- Needs coordination, clarity, and evidence to advocate.
- Pain: “People complain, but nothing is structured.”

### Persona C: Teacher / Club Mentor (Secondary)
- Wants project-based learning with measurable outcomes.
- Pain: “Hard to track what students actually did.”

---

## 3) Core MVP Features

### F1 — 60-Second Reporting (no signup required)
- Category (5)
- Drop pin (or “Use my location”)
- Severity (Low/Medium/High)
- Short note (optional but encouraged)
- Photo (optional)
- Submit → creates Issue Card URL

### F2 — Live Map + Feed
- Map pins + list view
- Filters: category, severity, status, distance (“near me”), time (last 24h/7d)

### F3 — Action Cards (auto-generated)
- “Quick steps” + “Safety note”
- “Who to contact” suggestions (from local directory)
- Copy/paste message templates (WhatsApp/email)

### F4 — Status + Proof
- Status: **Open → In Progress → Resolved**
- Proof upload: before/after + short proof note
- Second-person “Verify” button (logged in)

### F5 — Teams + Weekly Missions
- Create/join team (School/Club/Community)
- Leaderboard (weekly + all-time)
- Weekly mission types (rotating)

### F6 — Social Share Poster
- Auto-generated “Impact Card”
- Share button (download/share link + prefilled X post)

---

## 4) Information Architecture (Pages)

1. `/` Landing  
2. `/report` Report Issue  
3. `/map` Map + Feed  
4. `/issue/:id` Issue Detail + Action Card + Proof  
5. `/teams` Browse/Join/Create teams  
6. `/team/:id` Team page + leaderboard + missions  
7. `/profile` My activity *(optional MVP, useful for retention)*  
8. `/admin/mod` Moderation queue *(optional but recommended)*  

---

## 5) User Flows

### Flow A — Report in 60 seconds
Landing → Report → Pin location → Choose category + severity → Add note/photo → Submit → Issue Detail + Action Card

### Flow B — Turn report into action
Issue Detail → Tap “Start Fix” → Status becomes “In Progress” → Share Action Card → After fix upload proof → Request verification

### Flow C — Verification
Logged-in user views Issue → Tap “Verify” → Confirm checklist → Verified → Issue marked “Resolved (Verified)”

### Flow D — Team loop
Teams → Join team → Weekly mission page → Do 1 mission → Earn points → Share Impact Poster

---

## 6) Categories (Mixed but Light)

Only 5 categories (icon + color + short label):
1. **Waste & Litter**
2. **Drainage / Flood Risk**
3. **Urban Heat / No Shade**
4. **Water Issues** (leaks/dirty points)
5. **Air / Smoke / Noise**

Severity definitions:
- **Low:** small/localized, non-urgent
- **Medium:** recurring/problematic, needs attention soon
- **High:** hazardous/urgent *(but not emergency services)*

---

## 7) UI Copy (Ready to Paste)

### Landing
- Headline: **Turn local environmental problems into verified action.**
- Subtext: “Report in 60 seconds. Get an action plan. Fix together.”
- Buttons: **Report an Issue** / **View Map** / **Join a Team**
- Trust line: “Proof-based. Community verified.”

### Report Page
- Title: **Report an Issue**
- Helper: “Be safe. Don’t approach hazards.”
- Fields:
  - Category: “What did you notice?”
  - Location: “Drop a pin or use your current location”
  - Severity: “How serious is it?”
  - Notes: “What’s happening? (optional)”
  - Photo: “Add a photo (optional)”
- CTA: **Submit Report**
- After submit toast: “Reported! Here’s what you can do next.”

### Issue Detail
- Status pill: Open / In Progress / Resolved / Verified
- Buttons:
  - **Start Fix** (sets In Progress)
  - **Add Proof** (opens proof modal)
  - **Verify** (if eligible)
  - **Share** (share issue link)
- Section titles:
  - “Action Card”
  - “Safety”
  - “Who to Contact”
  - “Updates & Proof”

### Team
- CTA: **Join Team** / **Create Team**
- Weekly mission: “This week’s mission”
- Buttons: **Log Mission Activity** / **Share Impact**

---

## 8) Action Card Templates (Rules-Based First, AI-Enhanced Second)

Each Action Card has 4 blocks:
1) **Quick Steps (3–6 steps)**  
2) **Safety Note**  
3) **Who to Contact**  
4) **Message Template(s)**  

### Template 1 — Waste & Litter
**Quick Steps**
1. Organize 2–5 people (gloves + bags).
2. Clean only safe, visible areas (avoid sharp objects).
3. Separate recyclables if possible.
4. Take “before” and “after” photos from the same angle.
5. Dispose properly (bin/collection point).

**Safety**
- Avoid needles, broken glass, unknown chemicals. If unsafe: report and don’t touch.

**Who to Contact**
- School admin / sanitation unit / community lead / local NGO

**Message Template (WhatsApp)**
> Hello, we reported a litter hotspot at (location). It’s affecting the area and needs cleanup support / bin placement. Can you advise the best disposal point or schedule pickup? Link: (issue link)

---

### Template 2 — Drainage / Flood Risk
**Quick Steps**
1. Take a photo from a safe distance.
2. Mark whether water is flowing or blocked.
3. If safe, remove *light* surface litter only (no deep digging).
4. Report to the proper authority/community lead.
5. Re-check after rainfall and update the issue.

**Safety**
- Do not enter drains. Avoid contaminated water.

**Who to Contact**
- Local public works / municipal drainage unit / campus maintenance

**Message Template**
> Hi, there is a blocked drainage point at (location) causing flood risk. Photo attached and issue link: (link). Please advise the best channel for clearance.

---

### Template 3 — Urban Heat / No Shade
**Quick Steps**
1. Log time + condition (midday heat, no shade).
2. Add photos of the exposed area.
3. Suggest shade action: trees, shade cloth, seating relocation.
4. If school/campus: propose a “Shade Spot” plan.
5. Update with any improvements.

**Safety**
- Encourage hydration; avoid long exposure during peak heat.

**Who to Contact**
- School/campus facilities / local parks department / community association

**Message Template**
> Hello, this area at (location) has high heat exposure with no shade. We suggest adding trees or shade structure. Issue link: (link). Who can review this?

---

### Template 4 — Water Issues (leak/dirty point)
**Quick Steps**
1. Photograph leak/dirty water point clearly.
2. Note time + whether it’s continuous.
3. If leak: estimate flow (slow drip / steady stream).
4. Report to maintenance or local water authority.
5. Re-check within 24–72 hours and update.

**Safety**
- Avoid contact with unknown water sources.

**Who to Contact**
- Water utility / campus maintenance / building manager

**Message Template**
> Hi, we noticed a water issue at (location): (leak/dirty point). Please review and advise next steps. Issue link: (link).

---

### Template 5 — Air / Smoke / Noise
**Quick Steps**
1. Record time + duration.
2. Note source if visible (burning trash, generator, construction).
3. Upload photo/video if safe.
4. Report to responsible party/authority.
5. Track repeat occurrences.

**Safety**
- Do not confront people burning waste; keep distance.

**Who to Contact**
- Environmental health unit / school admin / community leader

**Message Template**
> Hello, there is recurring smoke/noise at (location) around (time). It’s affecting residents/students. Issue link: (link). Please advise who can address this.

---

## 9) Data Model (Collections/Tables)

### `users`
- `id` (uuid)
- `name` (string)
- `handle` (string, optional)
- `role` (enum: user/mod/admin)
- `team_id` (uuid, nullable)
- `created_at`

### `teams`
- `id`
- `name`
- `type` (enum: school/club/community)
- `region` (string, optional)
- `created_by`
- `created_at`

### `issues`
- `id`
- `title` (string) — derived from note/category
- `description` (text)
- `category` (enum)
- `severity` (enum)
- `status` (enum: open/in_progress/resolved/verified/hidden)
- `lat`, `lng`
- `address_label` (string, optional)
- `photo_url` (string, optional)
- `created_by` (nullable if anonymous)
- `created_at`
- `updated_at`
- `tags` (array/string)
- `duplicates_of` (issue_id nullable)

### `issue_actions`
- `id`
- `issue_id`
- `action_steps` (json/text)
- `safety_note` (text)
- `contacts` (json array: `{name, type, contact_method}`)
- `message_templates` (json)
- `generated_by` (enum: rules/ai)
- `created_at`

### `proofs`
- `id`
- `issue_id`
- `before_photo_url` (string, optional)
- `after_photo_url` (string)
- `proof_note` (text)
- `submitted_by`
- `submitted_at`
- `verified_by` (nullable)
- `verified_at` (nullable)
- `verify_note` (text nullable)

### `points_log`
- `id`
- `user_id`
- `team_id`
- `issue_id` (nullable)
- `action` (enum: report,start_fix,submit_proof,verify,share)
- `points` (int)
- `created_at`

### `flags`
- `id`
- `issue_id`
- `flagged_by`
- `flag_type` (enum: spam/unsafe/duplicate/wrong_location)
- `note` (text)
- `created_at`

---

## 10) Business Rules (Deterministic)

### Status logic
- New issue → **Open**
- Clicking “Start Fix” → **In Progress**
- Proof submitted → **Resolved (Unverified)**
- Second-person verification → **Verified**

### Points
- Report accepted: +1
- Start Fix: +1 (only once)
- Submit Proof (after photo): +5
- Verify someone else’s proof: +2
- Share poster: +1 (rate-limited daily)

### Eligibility
- Verification requires login.
- Verifier cannot be the same user as proof submitter.
- Rate limit actions to reduce gaming.

---

## 11) AI Specs (Optional but High-Impact)

### AI Task A — Clean Title + Tags
**Input:** category, severity, description, location label  
**Output:** title (≤ 60 chars), tags (3–6), cleaned summary (≤ 200 chars)

**Guardrails:** no personal data; remove phone numbers; no accusations.

### AI Task B — Action Card Enhancer
Use rules-based template as base, then AI can:
- personalize steps to description (e.g., “blocked by plastic + leaves”)
- suggest best “who to contact” option from directory
- generate 1–2 message variants (formal + friendly)

**Fallback:** if AI fails, show the rules-based template.

### AI Task C — Duplicate Suggestion
If new report within X meters and same category within last Y days:
- show “Possible duplicate” prompt before submitting
- allow “Submit anyway”

---

## 12) Contact Directory (Config Object)

A simple editable list (per deployment/community). Example schema:
- type: “School Admin”
  methods: [WhatsApp, Email]
  value: “+234… / admin@…”
- type: “Campus Maintenance”
- type: “Municipal Drainage”
- type: “Water Utility”
- type: “Environmental Health”
- type: “Local NGO”

**MVP default:** placeholder entries + ability for admins to edit.

---

## 13) Moderation & Safety (Minimum Required)

### Safety banner (shown on report + issue pages)
- “Do not approach hazardous areas.”
- “For emergencies, contact local emergency services.”
- “Avoid confrontations; report from a safe distance.”

### Anti-spam controls
- Rate limit anonymous reports (e.g., 3/day/device)
- Flagging system visible on Issue Detail
- Auto-hide if flagged by N users (configurable)
- Admin page to review hidden issues (optional)

### Privacy defaults
- Anonymous reporting allowed (no public user identity displayed)
- Remove precise address if user opts out (store lat/lng but show approximate neighborhood label)

---

## 14) Analytics & KPIs (Event Tracking Plan)

Track events:
- `view_landing`
- `start_report`
- `submit_report`
- `view_issue`
- `start_fix`
- `generate_action_card`
- `submit_proof`
- `verify_proof`
- `join_team`
- `create_team`
- `share_poster`
- `flag_issue`

Key dashboards:
- Reports/week, resolved/week, verified/week
- Median time-to-first-action
- Category heatmap (most frequent issues)
- Team engagement (weekly active teams)

---

## 15) QA Checklist (Pre-Submission)

### Functional
- Report works on mobile
- Map loads quickly, filters work
- Action Card always appears (rules fallback)
- Proof submission works, verification rules enforced
- Leaderboard updates correctly

### UX
- Clear empty states (“No issues nearby yet”)
- Loading states + error messages
- Share poster looks good on mobile

### Trust
- Safety banner visible
- Flagging works
- Duplicate warning works (optional)

---

## 16) Hackathon Submission Assets (Prepared Content)

### 90-second Demo Script (judges)
1. “This is EcoPulse: report → action → proof.”
2. Create a report in 20 seconds (category + pin + severity).
3. Show the generated Action Card + message template.
4. Click “Start Fix” → status changes.
5. Upload proof (after photo) → resolved.
6. From another account, verify → becomes Verified.
7. Show leaderboard + weekly mission.
8. Generate and share impact poster.

### Prefilled Social Post Template (X)
> Built EcoPulse on lumi.new: report local environmental issues in 60 seconds, get an action plan, and verify fixes with teams + missions. Try it: {PROJECT_URL} @lumidotnew #LumiHackathon

---

## 17) Build Order (Practical Sprint Plan)

### Sprint 1 (Core)
- Data model + CRUD for issues
- Report page → create issue
- Issue detail page → display + status
- Map + feed + filters

### Sprint 2 (Impact Loop)
- Action card rules templates (always available)
- Proof upload + status transitions
- Verification rules

### Sprint 3 (Growth Loop)
- Teams + leaderboard + points log
- Weekly missions (simple rotating text + goal counter)
- Share poster generation + share button

### Sprint 4 (Polish)
- Moderation flags + basic admin view
- Empty states + onboarding tips
- Performance pass

---

## 18) MVP “Definition of Done”
- A user can report an issue, see it on the map, view an action card, mark progress, submit proof, and get verified.
- Teams exist with a working leaderboard and mission prompt.
- Sharing produces a clean, readable impact poster + link.
