# EcoPulse Nigeria Pilot Program Pack

**Owner:** Product (John, PM)

**Last updated:** 2025-12-26

## 0) Executive Summary (what we’re doing and why)

EcoPulse will run a **Nigeria pilot (90 days)** as the first phase of a **12-month program** to prove a scalable, privacy-first, community verification model for **waste/litter** and **drainage/flood risk** issues.

The pilot is structured to validate three things fast:

- **Community demand:** people will report issues in under a minute, repeatedly.
- **Trust signal:** community verification produces reliable, prioritized issues.
- **Closed-loop outcomes:** partners can turn verified signals into visible action and proof.

**Pilot success at day 90** unlocks a 12-month scale plan (more geographies, more partner capacity, and stronger reporting for funders).

---

## 1) Goals

### 1.1 Goals (90-day pilot phase)

By day 90, we will prove:

- **Uptake & repeat usage:** a stable weekly reporting baseline in the pilot area(s), driven by champion-led onboarding.
- **Quality & verification:** a meaningful share of reports becomes **Verified** via **two independent verifications** (no self-verification).
- **Closed-loop action:** a measurable subset of verified issues moves into **In Progress** and **Resolved with Proof** (photo evidence + partner confirmation).
- **Safe participation:** clear safety guidance in field ops; incidents are rare and handled quickly.
- **Privacy-by-design:** EXIF stripping enforced; no device fingerprinting; anonymous flow supported via expiring `session_id`.

### 1.2 Goals (12-month program)

By month 12, we will:

- **Scale coverage:** expand from pilot area(s) to **2–8 partner sites** (LGAs/cities) with partner-led onboarding.
- **Build program reliability:** predictable monthly reporting + quarterly learning loops; partners operate a repeatable moderation + response routine.
- **Demonstrate impact:** sustained verified-to-resolved outcomes with evidence and case studies suitable for funder reporting.
- **Productize the playbook:** publish a reusable **EcoPulse Partner Kit** (training, templates, SOPs, reporting pack).

---

## 2) Non-goals

What we are explicitly not doing in the pilot:

- Not an emergency response system; no guarantee of immediate remediation.
- Not replacing existing government case-management/311 systems (integration is out of scope for this pilot).
- Not collecting device fingerprints or building surveillance-style user tracking.
- Not public naming/shaming of individuals or households.
- Not expanding beyond MVP categories (**Waste/Litter**, **Drainage/Flood Risk**) during the 90 days.

---

## 3) Assumptions & constraints

### 3.1 Assumptions (we’re betting on these)

- Smartphone access is sufficient among target users (community champions, youth groups, volunteers) to sustain reporting.
- An implementing NGO can mobilize champions and maintain weekly routines.
- The 2-verification threshold is feasible in the selected communities.
- There is at least one response pathway for “quick wins” (community cleanups and/or a responsive contractor/agency).

### 3.2 Constraints (we design around these)

- **Connectivity:** intermittent 2G/3G; uploads and comms must be low-bandwidth friendly.
- **Trust:** adoption requires a visible feedback loop (status updates, proof, “what happened next”).
- **Safety:** reporting/verifying must avoid confrontation; safeguards and escalation are required.
- **Privacy (non-negotiable):**
  - EXIF stripping on all uploads.
  - No device fingerprinting.
  - Anonymous reporting via expiring `session_id` (7-day expiry).
  - Self-verification blocked via `user_id` or `session_id`.
- **Verification:** an issue becomes “Verified” only after **two independent verifications**.

---

## 4) Partner requirements (roles, responsibilities, time commitments)

### 4.1 Implementing NGO (program operator)

**Who this is:** the organization running community onboarding, moderation, verification coordination, and the day-to-day pilot routine.

**Minimum capabilities (must-have):**

- Community presence in the pilot geography; ability to convene local leaders.
- Ability to recruit, train, and manage champions.
- Ability to run a lightweight moderation/triage workflow.
- Ability to coordinate action days and capture outcome evidence.

**Responsibilities:**

- Recruit/train champions; run onboarding events.
- Maintain a help channel (WhatsApp preferred) for participants.
- Triage new reports weekly; prioritize high-severity + verified items.
- Coordinate verification coverage (without violating independence/self-verification rules).
- Coordinate or execute “quick win” actions (community cleanups, escalation, bin requests) and upload proof.
- Collect qualitative feedback (monthly champion pulse + field notes).

**Time commitment (recommended minimum):**

- Pilot Lead: **0.4–0.6 FTE** (program management + partner coordination)
- M&E / Reporting: **0.2 FTE** (metrics tracking + monthly review pack)
- Moderation/Triage: **0.2–0.4 FTE** (queue hygiene, duplicates, flags)
- Champions: **6–12 people**, **2–4 hours/week** each

### 4.2 Response partner (service delivery)

**Who this is:** a sanitation contractor, waste management operator, public works unit, drainage team, or community cleanup coalition that can turn prioritized issues into real outcomes.

**Responsibilities:**

- Provide a named liaison for intake and weekly prioritization.
- Confirm what “resolved” means for each issue type and what proof is acceptable.
- Participate in at least one monthly “action day” per pilot area.
- Provide a lightweight response status update for prioritized issues (even if full remediation takes longer).

**Time commitment (recommended minimum):**

- Liaison: **1–2 hours/week** (triage + coordination)
- Field team time: variable; plan for **2–6 action windows/month** (pilot-dependent)

### 4.3 Funder (sponsor + governance)

**Who this is:** a foundation, CSR program, or donor supporting the 90-day pilot and/or 12-month program.

**Responsibilities:**

- Align on success criteria (targets + decision gates) and eligible activity scope.
- Join the monthly steering review; unblock governance and visibility needs.
- Support comms (optional): help amplify verified outcomes and case studies.

**Time commitment (recommended minimum):**

- Program officer: **1 hour/month** steering review
- Optional mid-pilot checkpoint: **45 minutes** (week 6)

---

## 5) Success metrics (definitions, targets, sources, cadence)

Targets are ranges to fit different pilot geographies and partner capacity. “90-day” targets apply to the pilot; “12-month” targets apply to the program.

| Metric                               | Definition (how we calculate it)                                                        | 90-day target | 12-month target | Primary data source           | Cadence          |
| ------------------------------------ | --------------------------------------------------------------------------------------- | ------------: | --------------: | ----------------------------- | ---------------- |
| Active contributors (30d)            | Unique users (auth + anonymous session) who submit ≥1 report in last 30 days            |       150–600 |     2,000–8,000 | DB + telemetry                | Weekly / Monthly |
| Total reports                        | Count of new issues created                                                             |     300–1,200 |    6,000–25,000 | DB (issues)                   | Weekly / Monthly |
| Report completion time (p50)         | Median time from “start report” → “submit report”                                       |        45–75s |  ≤60s sustained | Telemetry                     | Weekly           |
| Required-field completeness          | % reports meeting required rules (photo(s), location, category, note length)            |        95–99% |            ≥98% | DB validations                | Weekly           |
| Verification rate                    | % reports that reach Verified (two independent verifications)                           |        15–35% |          25–45% | DB (verifications + status)   | Weekly / Monthly |
| Time to verified (p50)               | Median days from report created → verified                                              |     2–10 days |        2–7 days | DB timestamps                 | Weekly / Monthly |
| Duplicate rate                       | % reports marked duplicate (by moderation rules)                                        |       <10–25% |         <10–15% | DB moderation fields          | Weekly           |
| Spam/low-quality rate                | % reports hidden/flagged as spam/unsafe/inappropriate                                   |        <5–12% |           <5–8% | DB flags/moderation           | Weekly           |
| In-progress conversion               | % reports moved to In Progress                                                          |        20–40% |          25–50% | DB status history             | Weekly / Monthly |
| Resolved with proof                  | % reports reaching Resolved with proof photo(s)                                         |         8–20% |          10–25% | DB + storage metadata         | Weekly / Monthly |
| Verified resolutions                 | % resolved issues that receive ≥1 verification after resolution                         |         5–15% |          10–20% | DB verifications              | Monthly          |
| Time to first partner response (p50) | Median days from Verified → first status update by partner (In Progress or comment)     |      2–7 days |        1–5 days | DB status history             | Monthly          |
| Privacy incidents                    | Count of confirmed EXIF/PII exposure incidents                                          | 0 (must be 0) |   0 (must be 0) | Incident log                  | Weekly / Monthly |
| Safety incidents                     | Count of safety incidents tied to app usage; investigated within 48 hours               |           0–1 |         ≤2/year | Incident log + partner report | Monthly          |
| Champion weekly active rate          | % champions who perform ≥1 meaningful action/week (onboard, verify, triage, action day) |        60–85% |          70–90% | Partner ops log + telemetry   | Weekly           |

---

## 6) Reporting cadence & artifacts (what we produce)

### 6.1 Weekly cadence (ops)

- **30-minute ops check-in** (EcoPulse PM/ops + Implementing NGO lead + response liaison as needed)
- **Weekly Snapshot (1 page)** delivered within 24 hours of the check-in:
  - KPI delta (last week vs prior week)
  - Top 5 hotspots / issues needing action
  - Verification funnel health
  - Notable outcomes (before/after links) and blockers
  - Risks/incidents summary (privacy/safety)

### 6.2 Monthly cadence (steering)

- **60-minute Monthly Review** (partner leads + funder program officer)
- **Monthly Review Pack (6–10 slides / 2–4 pages)**:
  - Progress to targets (table + short narrative)
  - Outcome story: 2–3 case studies with photos and timeline
  - What we learned + what we’re changing next month
  - Budget/effort reality check (time commitments vs actual)

### 6.3 Final pilot closeout (day 90)

- **Final Report (PDF, 8–15 pages)**:
  - Executive summary
  - Site overview + onboarding approach
  - KPI performance vs targets
  - Outcome evidence (before/after gallery + sample issue timelines)
  - Risks/incidents and how they were handled
  - Scale recommendations (months 4–12 plan)
- **Decision meeting (60 minutes):** Go / Conditional Go / No-Go for 12-month program.

---

## 7) Risks & mitigations

| Risk                            | What it looks like                       | Mitigation (what we do in pilot)                                                            | Early warning signal                         |
| ------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Low adoption after launch       | Reports spike then collapse              | Champion-led onboarding cadence; weekly feedback loop; publish outcomes fast                | Active contributors decline 2 weeks in a row |
| High duplicates (trust erosion) | Many repeat reports of same hotspot      | Moderator SOP + “mark duplicate” workflow; community messaging (“check map before posting”) | Duplicate rate >25% week 3+                  |
| Spam/misinformation             | Fake reports or irrelevant content       | Flag queue + rate limits + moderation; require photos; keep verification threshold          | Spam rate >12%                               |
| Partner can’t respond           | Verified issues pile up without movement | Define triage SLA (status update within 7 days); focus on “quick win” backlog               | Time to first partner response >7 days       |
| Safety incident                 | Confrontation while verifying            | Safety guidance, champion training, escalation path; avoid adversarial messaging            | Reports of harassment / conflict             |
| Privacy incident (critical)     | EXIF or sensitive info leaks             | EXIF stripping enforced; takedown path; guidance to avoid faces/plates                      | Any confirmed incident (stop-the-line)       |
| Connectivity issues             | Upload failures, user churn              | Compression + retries; champion-assisted reporting; schedule upload windows                 | Upload failure rate spikes                   |
| Political sensitivity           | Program framed as anti-government        | Frame as community improvement + partner collaboration; avoid naming/shaming                | Pushback from local stakeholders             |

---

## 8) Acceptance checklist — “ready to convert to PDF”

### 8.1 Content completeness (must be true)

- Goals for 90 days and 12 months are explicit and measurable.
- Non-goals are explicit (no emergency response, no fingerprinting, no government system replacement in pilot).
- Assumptions and constraints are stated, including privacy + verification rules.
- Partner roles are defined with responsibilities and time commitments.
- Success metrics table includes definitions, targets, source, and cadence.
- Reporting artifacts are defined (weekly snapshot, monthly review pack, final report).
- Risks and mitigations are listed with early warning signals.

### 8.2 Packaging & formatting (must be true)

- Front page includes: title, geography, partner names, version, date, contact owner(s).
- Headings are consistent; tables fit A4; links are readable when printed.
- Language is plain and non-technical for partners/funders (PM voice).
- All placeholders are resolved (pilot LGAs, partner names, dates, contacts).

### 8.3 Approval gates (must be signed)

- EcoPulse PM sign-off.
- Implementing NGO Pilot Lead sign-off.
- Response partner liaison sign-off on “resolved” definition.
- Privacy/security review sign-off (EXIF stripping + no fingerprinting + incident response).

---

## Appendix A — Suggested 90-day timeline (recommended)

- Weeks 0–2: partner onboarding, champion recruitment, training, comms setup
- Weeks 3–6: onboarding events, reporting activation, moderation routines, first action windows
- Weeks 7–10: verification push + quick-win backlog execution, mid-pilot checkpoint (week 6/7)
- Weeks 11–13: stabilize, consolidate proof, deliver final report and scale decision
