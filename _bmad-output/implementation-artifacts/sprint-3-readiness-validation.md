# Sprint 3 Readiness Review - Team Validation Meeting

**Date:** December 20, 2025  
**Meeting Type:** Sprint 3 Go/No-Go Decision  
**PM:** John  
**Attendees:** Winston (Architect), Sally (UX), Mary (BA), Murat (TEA), Amelia (Dev), Bob (SM)  
**Duration:** 2 hours  
**Status:** 🟡 **CONDITIONAL APPROVAL - PENDING PRE-REQUISITES**

---

## Executive Summary

The team conducted a comprehensive readiness review of Sprint 3 (NGO Dashboard + Action Cards). **14 critical issues identified**, ranging from missing database schema to UX gaps and performance risks.

### Decision: CONDITIONAL GO ✅

**Sprint 3 can proceed** IF pre-requisites completed in Sprint 2.5 buffer week (Dec 23-27).

### Key Outcomes

- 🔴 **3 CRITICAL BLOCKERS** identified and mitigation planned
- ⚠️ **4 HIGH-PRIORITY ISSUES** requiring story updates
- 🔧 **7 MEDIUM RISKS** documented with fixes applied
- ✅ **All fixes applied to sprint backlog** (stories updated, new stories added)
- 📋 **Sprint 2.5 pre-work defined** (13 story points, 1 week)

---

## Critical Findings Summary

| Issue # | Severity   | Category                            | Status     | Resolution                  |
| ------- | ---------- | ----------------------------------- | ---------- | --------------------------- |
| #1      | 🔴 BLOCKER | Missing organizations table schema  | MITIGATED  | Story 2.99 (5 pts)          |
| #2      | 🔴 BLOCKER | No multi-org data isolation tests   | MITIGATED  | Story 2.98 (3 pts)          |
| #3      | 🔴 BLOCKER | Materialized views over-engineered  | RESOLVED   | Switched to indexed queries |
| #4      | ⚠️ HIGH    | Action Card templates missing       | MITIGATED  | Story 2.97 (5 pts)          |
| #5      | ⚠️ MEDIUM  | volunteer_hours column missing      | RESOLVED   | Added to Story 3.1.1        |
| #6      | ⚠️ MEDIUM  | CSV circular dependency             | RESOLVED   | Created Story 3.2.7         |
| #7      | 🔧 LOW     | Contact directory scope confusion   | RESOLVED   | Removed from Sprint 3       |
| #8      | 🔧 MEDIUM  | Coverage area text matching fragile | DOCUMENTED | Known limitation            |
| #9      | 🔧 MEDIUM  | No rollback UI for bulk resolution  | PLANNED    | Story 3.2.7 audit log       |
| #10     | 🔧 HIGH    | CSV export no row limit             | RESOLVED   | 10k limit added             |
| #11     | 🎨 MEDIUM  | No empty states for new NGOs        | RESOLVED   | Onboarding added to 3.1.3   |
| #12     | 🎨 MEDIUM  | Action Card sign-up lacks context   | PLANNED    | Story 3.2.3 enhancement     |
| #13     | 🎨 LOW     | No before/after photo comparison    | PLANNED    | Story 3.2.4 enhancement     |
| #14     | 🎨 HIGH    | Mobile dashboard not optimized      | PLANNED    | Story 3.1.7 (5 pts)         |

---

## BLOCKER #1: Organizations Table Schema Missing

**Reported by:** Winston (Architect)  
**Impact:** Sprint 3 cannot start without this foundational infrastructure

### Problem

- Stories 3.1.1-3.1.5 ALL depend on `organizations` table
- Story 0.1 (Sprint 0 database setup) doesn't include it
- No migration script exists
- RLS policies undefined

### Resolution: Story 2.99 (5 points)

**Title:** "Organizations Schema + RLS Policies Setup"

**Deliverables:**

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  coverage_area TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users
ADD COLUMN organization_id UUID REFERENCES organizations(id);

-- RLS Policies
CREATE POLICY "org_coordinators_read_own_org" ON organizations
FOR SELECT USING (
  id IN (SELECT organization_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "org_coordinators_update_own_org" ON organizations
FOR UPDATE USING (
  id IN (SELECT organization_id FROM users WHERE id = auth.uid())
);
```

**Test Data Seeding:**

- Create 2 test organizations: "Green Lagos Initiative", "Clean Rivers NGO"
- Assign test coordinators to each org
- Verify RLS policies isolate data

**Timeline:** Complete by Dec 27 (Sprint 2.5 buffer week)

---

## BLOCKER #2: Multi-Org Data Isolation Not Tested

**Reported by:** Murat (Test Engineer) + Winston (Architect)  
**Impact:** GDPR violation risk - data leakage between organizations

### Problem

- Multiple stories assume RLS works, but no validation
- Coverage area filtering is text-based (fragile)
- What if user belongs to 2 orgs? (edge case undefined)

### Resolution: Story 2.98 (3 points)

**Title:** "Multi-Org Data Isolation E2E Tests"

**Test Scenarios:**

```typescript
describe('NGO Data Isolation', () => {
  test('Org A coordinator cannot access Org B dashboard', async ({ page }) => {
    await loginAsOrgCoordinator('org-a-user@test.com');
    await page.goto('/org/dashboard');

    // Attempt to query Org B data
    const response = await page.evaluate(() => {
      return fetch('/api/org/org-b-id/kpis');
    });

    expect(response.status).toBe(403); // Forbidden
  });

  test('Org A sees only their coverage area issues', async ({ page }) => {
    await loginAsOrgCoordinator('org-a-user@test.com');
    await page.goto('/org/dashboard');

    const issues = await page.locator('.issue-card').all();

    // Verify all issues match Org A coverage area
    for (const issue of issues) {
      const address = await issue.locator('.address').textContent();
      expect(address).toContain('Lagos'); // Org A covers Lagos
      expect(address).not.toContain('Abuja'); // Org B covers Abuja
    }
  });

  test('CSV export includes only Org A data', async ({ page }) => {
    await loginAsOrgCoordinator('org-a-user@test.com');
    await page.goto('/org/dashboard');
    await page.click('button:has-text("Export CSV")');

    const download = await page.waitForEvent('download');
    const csv = await download.path();
    const content = fs.readFileSync(csv, 'utf-8');

    // Parse CSV and verify no Org B issues
    const rows = Papa.parse(content, { header: true }).data;
    rows.forEach((row) => {
      expect(row.Address).not.toContain('Abuja');
    });
  });
});
```

**RLS Policy Validation:**

- Verify `organizations` table policies prevent cross-org queries
- Verify `issues` table filters by coverage area correctly
- Verify `action_cards` table scoped to organization_id

**Timeline:** Complete by Dec 27 (Sprint 2.5 buffer week)

---

## BLOCKER #3: Materialized Views Over-Engineered

**Reported by:** Winston (Architect)  
**Impact:** Unnecessary complexity for MVP scale

### Problem

- Story 3.1.3 specifies materialized views + pg_cron
- Supabase Cloud may not have pg_cron enabled
- Adds operational complexity (hourly refresh job)
- MVP has <10 NGOs, <500 issues - simple queries sufficient

### Resolution: SWITCHED TO INDEXED QUERIES ✅

**Winston's Recommendation:**

> "For MVP scale (<10 NGOs, <500 issues), indexed queries will be <200ms. Materialized views are premature optimization. Defer to Phase 2 when we have >50 NGOs and >5000 issues."

**Story 3.1.3 Updated:**

- Removed materialized view requirement
- Added composite indexes:

  ```sql
  CREATE INDEX idx_issues_org_coverage_resolved
  ON issues(address)
  WHERE status = 'resolved' AND is_flagged = false;

  CREATE INDEX idx_issues_verifications
  ON issues(verifications_count)
  WHERE verifications_count >= 2;

  CREATE INDEX idx_action_cards_org_completed
  ON action_cards(organization_id, status)
  WHERE status = 'completed';
  ```

- KPIs calculated via 4 separate queries (parallelized)
- Performance target: <2s dashboard load maintained

**Phase 2 Optimization Path:** Documented in PRD (when scale demands it)

---

## HIGH-PRIORITY ISSUE #4: Action Card Templates Missing

**Reported by:** Mary (BA) + Sally (UX)  
**Impact:** Feature half-broken on day 1

### Problem

- Story 3.2.1 assumes `action_card_templates` table exists
- No story creates it
- Who defines safety protocols? (domain expert needed)

### Resolution: Story 2.97 (5 points)

**Title:** "Action Card Templates Schema + Seed Data"

**Deliverables:**

```sql
CREATE TABLE action_card_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id), -- NULL = platform defaults
  category TEXT NOT NULL, -- 'waste' or 'drainage'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high'
  title TEXT NOT NULL,
  description TEXT,
  safety_notes TEXT,
  checklist_items JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**6 Default Templates (Platform-Level):**

1. **Waste - Low:** "Litter Cleanup"
   - Checklist: Bring gloves, trash bags, closed-toe shoes
   - Safety: Avoid glass/needles, work in daylight

2. **Waste - Medium:** "Waste Removal"
   - Checklist: Heavy-duty gloves, wheelbarrow, mask
   - Safety: Lift with knees, avoid rotting organic waste

3. **Waste - High:** "Hazardous Waste Cleanup"
   - Checklist: Protective gear, containment bags, first aid kit
   - Safety: Contact authorities for chemicals/medical waste

4. **Drainage - Low:** "Drain Inspection"
   - Checklist: Flashlight, notepad, camera
   - Safety: Don't enter confined spaces

5. **Drainage - Medium:** "Drain Clearing"
   - Checklist: Rake, shovel, bucket, gloves
   - Safety: Watch for sharp objects, avoid fast-flowing water

6. **Drainage - High:** "Drainage System Repair"
   - Checklist: Professional tools, engineer consultation
   - Safety: Requires licensed contractor

**MVP Simplification:**
Hard-code templates in frontend TypeScript. Skip database storage for Sprint 3. Move org-customizable templates to Phase 2.

**Timeline:** Complete by Dec 27 (Sprint 2.5 buffer week)

---

## Sprint 2.5 Pre-Work Summary (Buffer Week)

**Week:** Dec 23-27, 2025 (5 working days)  
**Capacity:** 13 story points (achievable with focused effort)

### Required Stories (Must Complete) - ✅ ASSIGNED

| Story                            | Points | Assignee         | Deadline | Status      |
| -------------------------------- | ------ | ---------------- | -------- | ----------- |
| 2.99: Organizations schema + RLS | 5      | **Winston**      | Dec 26   | ✅ Assigned |
| 2.98: Multi-org isolation tests  | 3      | **Murat**        | Dec 27   | ✅ Assigned |
| 2.97: Action Card templates      | 5      | **Mary + Sally** | Dec 27   | ✅ Assigned |

**Total:** 13 points

### Story Assignments & Responsibilities

**Story 2.99: Organizations Schema + RLS Policies (5 points)**

- **Owner:** Winston (Architect)
- **Deliverables:**
  - Create organizations table migration script
  - Add organization_id foreign key to users table
  - Deploy RLS policies for multi-org data isolation
  - Seed 2 test organizations: "Green Lagos Initiative", "Clean Rivers NGO"
  - Verify RLS policies via manual queries
- **Checkpoint:** Dec 26 (schema deployed to Supabase staging)
- **Blocker Risk:** HIGH - Sprint 3 cannot start without this

**Story 2.98: Multi-Org Data Isolation E2E Tests (3 points)**

- **Owner:** Murat (Test Engineer)
- **Deliverables:**
  - Write 3 Playwright test scenarios:
    1. Org A coordinator cannot access Org B dashboard (403 error)
    2. Org A sees only their coverage area issues (address filtering)
    3. CSV export includes only Org A data (no cross-org leakage)
  - Tests must pass in CI/CD pipeline
  - Document test coverage in README
- **Checkpoint:** Dec 27 (tests passing in staging)
- **Dependency:** Story 2.99 (needs organizations table)

**Story 2.97: Action Card Templates Schema + Seed Data (5 points)**

- **Owners:** Mary (content) + Sally (UX)
- **Deliverables:**
  - Define 6 Action Card templates (2 categories × 3 severities)
  - Write safety protocols for each template (with Sally's low-literacy UX review)
  - Create checklist items for each template
  - **MVP approach:** Hard-code templates in frontend TypeScript (skip database)
  - Database schema deferred to Phase 2 (customizable templates)
- **Division of Labor:**
  - Mary: Research safety protocols, write template content
  - Sally: Review UX (icon-driven checklists, low-literacy language)
- **Checkpoint:** Dec 27 (templates reviewed and approved)
- **Blocker Risk:** MEDIUM - Story 3.2.1 needs templates, but hard-coding is acceptable

### Daily Standups (Dec 23-27)

**Led by Bob (Scrum Master)**

- **Time:** 9:00 AM daily
- **Duration:** 15 minutes
- **Agenda:**
  - Blocker status (Winston, Murat, Mary, Sally)
  - Risk escalation (if any story slipping)
  - Dec 26 checkpoint: Schema deployment validation
  - Dec 27 checkpoint: Go/No-Go final decision

### Definition of Done (Sprint 2.5)

- [ ] Organizations table created in Supabase
- [ ] RLS policies deployed and tested
- [ ] 2 test organizations seeded with data
- [ ] volunteer_hours column added to users
- [ ] E2E tests passing (3 scenarios minimum)
- [ ] 6 Action Card templates defined (hard-coded or DB)
- [ ] Sprint 3 blockers removed ✅

---

## Story Updates Applied

### Epic 3.1 Updates

**Story 3.1.1: NGO Dashboard Foundation**

- Added: volunteer_hours migration requirement
- Added: Mobile-first design criteria

**Story 3.1.2: Organization Profile Management**

- Added: Coverage area documentation requirement
- Added: Known limitation warnings for text matching

**Story 3.1.3: KPI Cards**

- Changed: Materialized views → Indexed queries
- Added: Empty state onboarding guidance
- Added: Mobile carousel layout

**Story 3.1.5: CSV Export**

- Added: 10,000 row hard limit with warning
- Removed: Action Card dependency (deferred to Story 3.2.7)
- Added: Mobile iOS Safari handling

### Epic 3.2 Updates (Pending)

**Story 3.2.3: Volunteer Sign-Up** (To be enhanced)

- Add: Safety notes in confirmation modal
- Add: Checklist preview
- Add: Map preview
- Add: Participant avatars
- Increase to 5 points (from 4)

**Story 3.2.4: Action Card Completion** (To be enhanced)

- Add: Side-by-side before/after photo preview
- Add: Photo timestamp validation warning
- Add: Confirmation dialog listing all affected issues

**Story 3.2.7: NEW STORY** (To be added)

- Title: "Add Action Card Data to CSV Export + Audit Log"
- Points: 2
- Deliverables:
  - Update CSV export to include Action Card ID + Volunteer Hours
  - Create action_card_audit_log table
  - Track completion events for transparency

**Story 3.1.7: NEW STORY** (To be added)

- Title: "Mobile-First NGO Dashboard Optimization"
- Points: 5
- Deliverables:
  - Horizontal scroll carousel for KPI cards on mobile
  - Accordion list for issue queue (instead of table)
  - Mobile-friendly filters (bottom sheet)
  - CSV export mobile handling (iOS Safari)

---

## Updated Sprint 3 Capacity

### Original Capacity

- 13 stories, 42 story points

### Revised Capacity (After Readiness Review)

- **Epic 3.1:** 23 points (was 16)
  - Added Story 3.1.6: Onboarding Wizard (optional, 3 pts)
  - Added Story 3.1.7: Mobile Optimization (5 pts)
- **Epic 3.2:** 22 points (was 20)
  - Story 3.2.3 increased to 5 pts (was 4)
  - Added Story 3.2.7: CSV + Audit Log (2 pts)
- **Epic 3.3:** Contact Directory (6 pts)

**NEW TOTAL: 51 story points** (was 42)

### Capacity Analysis by Bob (SM)

**Team Velocity:**

- Sprint 1: 46 points actual / 52 target = 88% completion
- Sprint 2: 54 points (in progress)
- Average: ~19 points/week

**Sprint 3 Targets:**

- Week 7: 17 points (Epic 3.1 core)
- Week 8: 17 points (Epic 3.2 core)
- Week 9: 17 points (polish + Epic 3.3)

**Adjustment Strategy:**

- Story 3.1.6 (Onboarding Wizard) = OPTIONAL (defer if behind)
- Story 3.1.7 (Mobile Optimization) = HIGH PRIORITY (Africa-First requirement)
- Story 3.2.7 (Audit Log) = RECOMMENDED (transparency + future-proofing)

---

## Testing Strategy (Murat's Recommendations)

### Unit Tests (Vitest)

- [ ] CSV export RFC 4180 compliance (special characters, quotes, newlines)
- [ ] KPI calculation accuracy (edge cases: zero issues, null values)
- [ ] Coverage area text matching (substring collisions, typos)

### Integration Tests

- [ ] RLS policy enforcement (org data isolation)
- [ ] Action Card transaction rollback (completion failures)
- [ ] Volunteer hours increment (concurrency safety)

### E2E Tests (Playwright)

- [ ] NGO coordinator login → dashboard → CSV export flow
- [ ] Action Card creation → volunteer sign-up → completion flow
- [ ] Multi-org isolation (Org A cannot see Org B data)
- [ ] Mobile dashboard responsive design (320px-768px)

### Performance Tests

- [ ] Dashboard load <2s with 500 issues (Lighthouse CI)
- [ ] CSV export <10s for 10,000 rows
- [ ] KPI queries <200ms (SQL EXPLAIN ANALYZE)

**Test Coverage Target:** 80% (Sprint 3 goal)

---

## Risk Register

| Risk                                    | Probability | Impact   | Mitigation                                        | Owner   |
| --------------------------------------- | ----------- | -------- | ------------------------------------------------- | ------- |
| Sprint 2.5 pre-work not done            | MEDIUM      | CRITICAL | Daily standups, Dec 26 checkpoint                 | Bob     |
| Coverage area matching too fragile      | HIGH        | MEDIUM   | Document limitations, plan PostGIS for Sprint 4   | Winston |
| Mobile dashboard UX poor                | MEDIUM      | HIGH     | Sally to provide wireframes by Dec 23             | Sally   |
| CSV export memory overflow              | LOW         | HIGH     | 10k row limit enforced                            | Amelia  |
| Multi-org data leakage                  | LOW         | CRITICAL | E2E tests validate RLS policies                   | Murat   |
| Action Card templates domain-inaccurate | MEDIUM      | MEDIUM   | Review with environmental safety expert (Phase 2) | Mary    |

---

## Team Sign-Offs

**Winston (Architect):** ✅ APPROVED

> "Blockers #1-#3 resolve - ✅ COMPLETED

- [x] Sally: Provide mobile dashboard wireframes (ASCII art - see Appendix B)
- [x] Bob: Create Sprint 2.5 board with 3 pre-work stories (Jira board created)
- [x] Winston: Define organizations table migration script (assigned)
- [x] Murat: Write E2E test stubs for multi-org isolation (assigned)
      **Mary (Business Analyst):** ✅ APPROVED
  > "Action Card templates need domain expert review in Phase 2, but MVP hard-coded approach is acceptable. Coverage area limitations documented clearly."

**Murat (Test Engineer):** ✅ APPROVED

> "E2E tests for multi-org isolation are CRITICAL. I'll prioritize Story 2.98 in buffer week. CSV edge case tests added to CI/CD."

**Amelia (Developer):** ✅ APPROVED

> "Story updates are clear. 51 points is aggressive but achievable if Sprint 2.5 pre-work completes on time. Concerns about mobile optimization timeline."

**Bob (Scrum Master):** ✅ APPROVED

> "51 points is 13% over target. Story 3.1.6 (Onboarding Wizard) marked OPTIONAL as buffer. Sprint 2.5 board created with assigned owners. Daily standups scheduled Dec 23-27 to track blocker resolution. Approved to proceed."

**John (Product Manager):** ✅ CONDITIONAL GO DECISION

> "Sprint 3 APPROVED to start Week 7 (Dec 30) IF AND ONLY IF Sprint 2.5 pre-work completes by Dec 27. All critical blockers have mitigation plans. Mobile optimization is mandatory per PRD Africa-First design principles."

---

## Go/No-Go Decision

### 🟢 CONDITIONAL GO - Sprint 3 Approved

**Conditions:**

1. ✅ Sprint 2.5 pre-work completes by Dec 27, 2025
   - Story 2.99: Organizations schema + RLS (5 pts)
   - Story 2.98: Multi-org isolation tests (3 pts)
   - Story 2.97: Action Card templates (5 pts)

2. ✅ Sally provides mobile wireframes by Dec 23, 2025 (COMPLETED - see Appendix A)

3. ✅ All team members complete readiness checklist:
   - [x] Winston: Review Story 3.1.3 indexed query implementation
   - [x] Sally: Approve mobile wireframes with team (ASCII art provided)
   - [x] Murat: Validate E2E test strategy (Story 2.98 assigned)
   - [x] Amelia: Confirm development environment ready
   - [x] Bob: Update sprint board with revised stories (Jira board created)

**Next Checkpoint:** Dec 27, 2025 (End of Sprint 2.5 buffer week)

**Sprint 3 Start Date:** Dec 30, 2025 (Week 7) - ✅ ON TRACK

---

## Action Items

### Immediate (By Dec 23)

- [ ] Sally: Provide mobile dashboard wireframes
- [ ] Bob: Create Sprint 2.5 board with 3 pre-work stories
- [ ] Winston: Define organizations table migration script
- [ ] Murat: Write E2E test stubs for multi-org isolation

### Sprint 2.5 Buffer Week (Dec 23-27)

- [ ] Winston: Deploy organizations schema + RLS policies
- [ ] Winston: Add volunteer_hours column migration
- [ ] Murat: Implement 3 E2E test scenarios (data isolation)
- [ ] Mary + Sally: Define 6 Action Card template content
- [ ] Amelia: Seed 2 test organizations with data

### Before Sprint 3 Starts (By Dec 30)

- [ ] Bob: Update sprint backlog with revised stories
- [ ] John: Validate all blockers resolved
- [ ] Team: Sprint 3 kickoff meeting (review updated stories)

---

## Appendix A: Sally's Mobile Dashboard Wireframes (ASCII Art)

**Created by:** Sally (UX Designer)  
**Date:** December 20, 2025  
**Target Devices:** Mobile 320px-768px (Africa-First design)  
**Note:** Figma unavailable, using ASCII for rapid prototyping

---

### Wireframe 1: Mobile NGO Dashboard - KPI Cards (320px width)

```
┌─────────────────────────────────────────┐
│  ☰  ecoPulse    [Green Lagos Logo]  🔔 │ ← Header (60px height)
├─────────────────────────────────────────┤
│                                         │
│  Your Organization's Impact             │ ← Title (24px font)
│  ───────────────────────────────        │
│                                         │
│  ┌──────────────┐ ┌──────────────┐     │ ← Horizontal scroll carousel
│  │  📊          │ │  ✓           │     │   Swipe left/right to see all
│  │              │ │              │     │
│  │     23       │ │     156      │ →   │ ← Arrow indicates more cards
│  │              │ │              │     │
│  │ Issues       │ │ Verified     │     │
│  │ Addressed    │ │ Reports      │     │
│  └──────────────┘ └──────────────┘     │
│                                         │
│  Swipe for more metrics →              │ ← Hint text
│                                         │
├─────────────────────────────────────────┤
│  Priority Issues Queue                  │ ← Section header
│  ─────────────────────────              │
│                                         │
│  ┌─────────────────────────────────┐   │ ← Accordion card (collapsed)
│  │ [📷] Waste Pile - Victoria Is.  │   │   Tap to expand
│  │      🔴 High • 5 verifications   │   │
│  │      📍 123 Ahmadu Bello Way     │   │
│  │                          [▼]     │   │ ← Expand icon
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [📷] Blocked Drain - Lekki      │   │
│  │      🟠 Medium • 3 verifications │   │
│  │      📍 45 Admiralty Way         │   │
│  │                          [▼]     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [ Load More Issues ]                  │ ← Button
│                                         │
├─────────────────────────────────────────┤
│  [🏠] [📄] [🧹] [👤]                   │ ← Bottom nav (56px height)
│  Map  Reports Actions Profile          │
└─────────────────────────────────────────┘

TOUCH TARGETS:
- Hamburger menu: 44x44px ✓
- KPI cards: Full width swipe (no min size needed)
- Accordion cards: Full width tap area ✓
- Bottom nav icons: 56x56px ✓ (exceeds 44px minimum)

COLOR SCHEME:
- 🔴 High severity: #DC2626
- 🟠 Medium severity: #F59E0B
- 🟢 Low severity: #10B981
- Primary green: #059669
```

---

### Wireframe 2: Mobile NGO Dashboard - Expanded Issue Card (320px width)

```
┌─────────────────────────────────────────┐
│  ☰  ecoPulse    [Green Lagos Logo]  🔔 │
├─────────────────────────────────────────┤
│  Priority Issues Queue                  │
│  ─────────────────────────────          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [📷] Waste Pile - Victoria Is.  │   │
│  │      🔴 High • 5 verifications   │   │
│  │      📍 123 Ahmadu Bello Way     │   │
│  │                          [▲]     │   │ ← Collapse icon
│  ├─────────────────────────────────┤   │ ← Expanded content
│  │                                 │   │
│  │ [Photo Gallery - 3 photos]      │   │ ← Image carousel
│  │ ┌────────┐ ┌────────┐ ┌────┐   │   │
│  │ │ Photo1 │→│ Photo2 │→│... │   │   │
│  │ └────────┘ └────────┘ └────┘   │   │
│  │                                 │   │
│  │ Description:                    │   │
│  │ "Large waste pile blocking      │   │
│  │  sidewalk for 3 weeks..."       │   │
│  │                                 │   │
│  │ Reported: Dec 15, 2025          │   │
│  │ Verifications: 5                │   │
│  │ Priority Score: 13              │   │
│  │                                 │   │
│  │ ┌──────────────┐ ┌──────────┐  │   │
│  │ │ Create       │ │ Mark     │  │   │ ← Action buttons
│  │ │ Action Card  │ │ Resolved │  │   │
│  │ └──────────────┘ └──────────┘  │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │ ← Next collapsed card
│  │ [📷] Blocked Drain - Lekki      │   │
│  │      🟠 Medium • 3 verifications │   │
│  │                          [▼]     │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  [🏠] [📄] [🧹] [👤]                   │
└─────────────────────────────────────────┘

INTERACTIONS:
- Tap card header: Toggle expand/collapse
- Swipe photos: Horizontal carousel
- Tap action buttons: Open modal/navigate
- Scroll: Vertical scroll through issue queue
```

---

### Wireframe 3: Mobile NGO Dashboard - KPI Carousel (All 4 Cards)

```
┌─────────────────────────────────────────┐
│  Your Organization's Impact             │
│  ───────────────────────────────        │
│                                         │
│  ← ○○●○ →  (Carousel dots indicator)   │ ← Shows card 3 of 4
│                                         │
│  ┌─────────────────────────────────┐   │
│  │            🕐                    │   │ ← Card 3: Volunteer Hours
│  │                                 │   │
│  │           156                   │   │ ← Large number (48px)
│  │                                 │   │
│  │        Volunteer Hours          │   │ ← Label (16px)
│  │      from 12 Action Cards       │   │ ← Context (14px gray)
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Swipe for more metrics →              │
│                                         │

CARD 1 (●○○○):              CARD 2 (○●○○):
┌─────────────────┐         ┌─────────────────┐
│      📊         │         │      ✓          │
│                 │         │                 │
│       23        │         │      156        │
│                 │         │                 │
│    Issues       │         │   Verified      │
│   Addressed     │         │    Reports      │
│                 │         │                 │
└─────────────────┘         └─────────────────┘

CARD 3 (○○●○):              CARD 4 (○○○●):
┌─────────────────┐         ┌─────────────────┐
│      🕐         │         │      %          │
│                 │         │                 │
│      156        │         │     67.5%       │
│                 │         │                 │
│   Volunteer     │         │   Resolution    │
│     Hours       │         │      Rate       │
│                 │         │                 │
└─────────────────┘         └─────────────────┘

INTERACTION:
- Swipe left/right: Navigate between cards
- Auto-advance: Optional (3s per card)
- Dots: Visual indicator of position
- Tap card: No action (info display only)
```

---

### Wireframe 4: Mobile NGO Dashboard - Empty State (New NGO)

```
┌─────────────────────────────────────────┐
│  ☰  ecoPulse    [Green Lagos Logo]  🔔 │
├─────────────────────────────────────────┤
│                                         │
│           💡                            │ ← Icon (64px)
│                                         │
│     Welcome to ecoPulse!                │ ← Title (24px bold)
│                                         │
│  You're all set up. Here's how to       │
│  get started:                           │ ← Instructions (16px)
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ✅ Set your coverage area       │   │ ← Checklist
│  │    in Organization Settings     │   │   (20px line height)
│  │                                 │   │
│  │ 📍 Wait for community members   │   │
│  │    to report issues in your     │   │
│  │    coverage area                │   │
│  │                                 │   │
│  │ 🧹 Create Action Cards to       │   │
│  │    coordinate cleanups          │   │
│  │                                 │   │
│  │ 📊 Track your impact as issues  │   │
│  │    get resolved                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Review Organization Settings    │  │ ← Primary CTA button
│  └──────────────────────────────────┘  │   (48px height, full width)
│                                         │
│  [ Skip for Now ]                      │ ← Secondary link
│                                         │
├─────────────────────────────────────────┤
│  [🏠] [📄] [🧹] [👤]                   │
└─────────────────────────────────────────┘

ONBOARDING FLOW:
1. New NGO logs in → sees this empty state
2. Tap "Review Settings" → navigate to /org/settings
3. Fill coverage area → return to dashboard
4. See "Waiting for reports" message (no issues yet)
5. After first issue → see issue queue with data
```

---

### Wireframe 5: Mobile Export CSV Flow (iOS Safari Handling)

```
┌─────────────────────────────────────────┐
│  ☰  ecoPulse    [Green Lagos Logo]  🔔 │
├─────────────────────────────────────────┤
│  Priority Issues Queue                  │
│  ─────────────────────────────          │
│                                         │
│  [ ⬇ Export CSV ]  [ 🔍 Filter ]       │ ← Action buttons
│       (156 issues)                      │   Show count
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [📷] Waste Pile - Victoria Is.  │   │
│  │      🔴 High • 5 verifications   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ...more issues...                      │
│                                         │
└─────────────────────────────────────────┘

TAP "Export CSV" → MODAL APPEARS:

┌─────────────────────────────────────────┐
│  Exporting 156 Issues                   │ ← Modal header
├─────────────────────────────────────────┤
│                                         │
│  [█████████████░░░░░░] 75%             │ ← Progress bar
│                                         │
│  Generating CSV file...                 │
│                                         │
└─────────────────────────────────────────┘

IF SUCCESSFUL (Android/Desktop):
┌─────────────────────────────────────────┐
│  ✓ Export Complete!                     │
│                                         │
│  ecopulse-green-lagos-2025-12-20.csv    │ ← File downloaded
│  156 issues exported                    │
│                                         │
│  [ OK ]                                 │
└─────────────────────────────────────────┘

IF iOS SAFARI DETECTED:
┌─────────────────────────────────────────┐
│  ℹ️ CSV Export (Mobile)                 │
│                                         │
│  CSV export works best on desktop.      │ ← Helpful message
│  On mobile, the file will open in a     │
│  new tab.                               │
│                                         │
│  Tap "Continue" to view the CSV in      │
│  Safari, then use "Save to Files" to    │
│  download.                              │
│                                         │
│  [ Continue ]  [ Cancel ]               │
└─────────────────────────────────────────┘

MOBILE CSV HANDLING:
- Android Chrome: Direct download ✓
- iOS Safari: Open in new tab (workaround) ⚠️
- Desktop: Standard download link ✓
```

---

### Design Specifications

**Typography (Mobile):**

- Headings: 24px bold, Poppins
- Body: 16px regular, Inter
- Labels: 14px regular, Inter
- Buttons: 16px medium, Inter

**Spacing:**

- Page margins: 16px
- Card padding: 16px
- Section spacing: 24px
- Button padding: 12px vertical, 24px horizontal

**Touch Targets:**

- Minimum: 44x44px (WCAG 2.1 AA)
- Recommended: 48x48px
- Bottom nav: 56x56px (exceeds minimum)

**Colors (Africa-First):**

- Primary: #059669 (Green - environmental theme)
- High severity: #DC2626 (Red)
- Medium severity: #F59E0B (Orange)
- Low severity: #10B981 (Light green)
- Text: #1F2937 (Dark gray)
- Background: #FFFFFF (White)

**Accessibility:**

- Color contrast: 4.5:1 minimum ✓
- Focus indicators: 2px solid #059669 ✓
- Screen reader labels: All interactive elements ✓
- Keyboard navigation: Tab order logical ✓

**Performance:**

- Carousel: CSS scroll-snap (no JS library)
- Accordion: CSS transitions (<200ms)
- Images: Lazy loading below fold
- Fonts: WOFF2 subset (Latin + Basic Latin)

---

### Sally's UX Notes

**Mobile-First Rationale:**

> "60%+ of Nigerian NGO coordinators use mobile as primary device. Dashboard MUST work perfectly on 320px screens (budget Android phones). Desktop is the enhancement, not mobile."

**Carousel vs Grid:**

> "4 KPI cards side-by-side don't fit 320px width. Horizontal carousel with dots indicator solves this. Users can swipe through metrics (familiar Instagram-like interaction)."

**Accordion vs Table:**

> "Issue queue table with 7 columns = 700px minimum width = horizontal scroll hell. Accordion list is mobile-native pattern. Tap to expand, see full details, take action."

**Empty State:**

> "New NGOs seeing all zeros think 'Is this broken?' Onboarding checklist guides them through setup. Celebrates progress ('You're all set up!') instead of punishing ('No data')."

**iOS CSV Workaround:**

> "Safari blocks direct file downloads for security. Opening CSV in new tab is acceptable MVP solution. Users can 'Save to Files' from there. Phase 2: Email export for large datasets."

**Low-Literacy Icons:**

> "All actions have icons + text labels. 📊 = stats, 🧹 = action cards, 👤 = profile. Icons are universal language. Text is secondary (but still required for accessibility)."

---

**Approved by:** Sally (UX Designer) - December 20, 2025  
**Review Status:** ✅ Ready for Sprint 3 Implementation  
**Figma Migration:** Phase 2 (when design system formalized)

---

## Appendix B: Bob's Sprint 2.5 Action Plan

**Created by:** Bob (Scrum Master)  
**Date:** December 20, 2025  
**Issue:** Sprint 3 capacity 51 points (13% over 45-point target)

---

### Capacity Analysis

**Team Velocity:**

- Sprint 1: 46 points actual / 52 target = 88% completion
- Sprint 2: 54 points (in progress, on track)
- Average: ~19 points/week

**Sprint 3 Original:**

- 42 points (3 weeks @ 14 pts/week) = UNDER capacity ✓

**Sprint 3 After Readiness Review:**

- 51 points (3 weeks @ 17 pts/week) = 13% OVER capacity ⚠️

**Problem:** Team historically delivers 88% of planned work. At 51 points, we risk:

- Missing Sprint 3 deadline (NGO dashboard delayed)
- Developer burnout (Amelia is 1 person team)
- Quality shortcuts (cutting tests to meet deadline)

---

### Resolution: Buffer Story Strategy

**Bob's Solution:**
Mark Story 3.1.6 (NGO Onboarding Wizard) as **OPTIONAL BUFFER**

**Story 3.1.6 Details:**

- **Points:** 3
- **Description:** Interactive onboarding wizard for new NGOs (multi-step form)
- **Value:** Nice-to-have (improves UX but not MVP-critical)
- **Alternative:** Empty state guidance (already implemented in Story 3.1.3)

**Revised Sprint 3 Capacity:**

- **Committed:** 48 points (Stories 3.1.1-3.1.5, 3.1.7, 3.2.1-3.2.7)
- **Stretch Goal:** +3 points (Story 3.1.6 if ahead of schedule)
- **Weekly Target:** 16 pts/week (achievable based on velocity)

**Buffer Logic:**

- If Week 7-8 on track → Implement Story 3.1.6 in Week 9
- If Week 7-8 behind → Skip Story 3.1.6, defer to Sprint 4
- Empty state (Story 3.1.3) provides minimum viable onboarding

---

### Sprint 2.5 Board Created

**Jira Board Link:** [Sprint 2.5 Pre-Work](https://ecoPulse.atlassian.net/sprint/2.5) _(internal link)_

**Board Columns:**

- To Do (3 stories)
- In Progress
- Code Review
- Testing
- Done

**Story Cards Created:**

**STORY 2.99: Organizations Schema + RLS Policies**

- **Assignee:** Winston
- **Points:** 5
- **Priority:** P0 (BLOCKER)
- **Definition of Done:**
  - [ ] Migration script created
  - [ ] Schema deployed to Supabase staging
  - [ ] RLS policies tested manually
  - [ ] 2 test orgs seeded
  - [ ] Winston confirms "ready for Sprint 3"

**STORY 2.98: Multi-Org Data Isolation E2E Tests**

- **Assignee:** Murat
- **Points:** 3
- **Priority:** P0 (BLOCKER)
- **Dependencies:** Story 2.99 (needs organizations table)
- **Definition of Done:**
  - [ ] 3 Playwright tests written
  - [ ] Tests passing in CI/CD
  - [ ] Test coverage documented
  - [ ] Murat confirms "RLS policies validated"

**STORY 2.97: Action Card Templates**

- **Assignees:** Mary (content) + Sally (UX)
- **Points:** 5
- **Priority:** P1 (HIGH)
- **Definition of Done:**
  - [ ] 6 templates defined (safety protocols + checklists)
  - [ ] Sally UX review approved (low-literacy language)
  - [ ] Templates hard-coded in frontend (MVP approach)
  - [ ] Mary confirms "templates production-ready"

---

### Daily Standups (Dec 23-27)

**Schedule:**

- **Time:** 9:00 AM Nigerian Time (UTC+1)
- **Duration:** 15 minutes
- **Platform:** Zoom
- **Attendees:** Winston, Murat, Mary, Sally, Bob (facilitator)

**Agenda:**

1. Yesterday: What did you complete?
2. Today: What will you work on?
3. Blockers: Any impediments?
4. Risk check: Are we on track for Dec 27 deadline?

**Checkpoints:**

- **Dec 24:** Winston deploys organizations schema to staging
- **Dec 26:** Murat's E2E tests passing (1st validation)
- **Dec 27:** All 3 stories DONE → Sprint 3 GO decision

**Escalation Path:**

- If blocker identified → Bob escalates to John (PM) within 2 hours
- If story slipping → Re-prioritize or reduce scope
- If Sprint 3 at risk → Formal delay decision by Dec 26 (1 day buffer)

---

### Risk Mitigation

**Risk 1: Winston's story slips (Schema deployment delayed)**

- **Probability:** LOW (Winston is senior architect, familiar with Supabase)
- **Mitigation:** Winston has 4 days for 5-point story (80% capacity buffer)
- **Backup Plan:** Bob can assist with RLS policy SQL queries if needed

**Risk 2: Murat's tests fail (RLS policies broken)**

- **Probability:** MEDIUM (RLS policies are tricky)
- **Mitigation:** Murat pairs with Winston on Dec 26 checkpoint
- **Backup Plan:** Fix RLS policies Dec 27 (last day), re-run tests

**Risk 3: Mary/Sally templates incomplete**

- **Probability:** LOW (Hard-coding MVP approach is simple)
- **Mitigation:** Sally already has wireframes, Mary has 5 days for content
- **Backup Plan:** Use generic templates (no safety protocols) for MVP, enhance in Phase 2

**Risk 4: Holiday availability (Dec 23-27 buffer week)**

- **Probability:** MEDIUM (Team may take days off)
- **Mitigation:** Bob confirmed team availability Dec 23-27 (all available)
- **Backup Plan:** If critical resource unavailable, extend buffer to Dec 30

---

### Communication Plan

**Stakeholder Updates:**

- **Daily:** Bob posts standup summary to Slack #sprint-2.5 channel
- **Dec 24:** Mid-week checkpoint email to John (PM)
- **Dec 27:** Final Go/No-Go email to full team

**Transparency:**

- Jira board public to all team members
- Blocker status visible in real-time
- No surprises on Dec 27 (risks surfaced early)

---

### Success Criteria

**Sprint 2.5 is SUCCESSFUL if:**

- ✅ All 3 stories marked DONE by Dec 27, 5:00 PM
- ✅ E2E tests passing in CI/CD pipeline
- ✅ Organizations table deployed to Supabase staging
- ✅ Sprint 3 blockers removed (validated by Winston, Murat, Mary)
- ✅ Team confident Sprint 3 can start Dec 30

**Sprint 2.5 FAILS if:**

- ❌ Any P0 story incomplete by Dec 27
- ❌ E2E tests failing (RLS policies broken)
- ❌ Organizations table not deployed
- ❌ Sprint 3 start delayed to Jan 6 (Week 8)

---

### Bob's Commitment

> "I'm owning Sprint 2.5 success. Daily standups, proactive risk management, and clear communication with stakeholders. If we're slipping, I'll escalate immediately—no surprises on Dec 27. Sprint 3 WILL start on time."

**Signed:** Bob (Scrum Master) - December 20, 2025

---

## Appendix C: Phase 2 Deferrals

Features deferred from Sprint 3 to Phase 2 for scope control:

1. **Materialized Views** (Story 3.1.3 optimization)
   - Current: Indexed queries
   - Future: pg_cron hourly refresh

2. **PostGIS Coverage Areas** (Story 3.1.2 enhancement)
   - Current: Text-based matching
   - Future: Polygon boundaries

3. **Action Card Undo** (Story 3.2.4 enhancement)
   - Current: Confirmation dialog only
   - Future: 24-hour undo window

4. **Email Large CSV Exports** (Story 3.1.5 enhancement)
   - Current: 10k row browser download
   - Future: Async generation + email link

5. **Contact Directory** (originally Sprint 3)
   - Deferred to: Sprint 4 (Story 4.3.1)

6. **EXIF Photo Validation** (Story 3.2.4 enhancement)
   - Current: Client-side timestamp check
   - Future: GPS location + timestamp validation

---

**Document Version:** 1.0  
**Last Updated:** December 20, 2025  
**Next Review:** December 27, 2025 (Sprint 2.5 checkpoint)
