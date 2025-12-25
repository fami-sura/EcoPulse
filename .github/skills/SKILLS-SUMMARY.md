# EcoPulse Copilot Skills Summary

Created: December 24, 2025  
Status: Production Ready

---

## Overview

The EcoPulse project now has **two complementary GitHub Copilot Skills** that provide deep, context-rich assistance grounded in real user research, architectural decisions, and UX design specifications.

---

## Skills Created

### 1. ecopulse-developer (Backend & Infrastructure)

**Location:** `.github/skills/ecopulse-developer/`

**Purpose:** Technical implementation patterns for:

- Next.js 16 async APIs and Server Actions
- Supabase SSR clients and RLS policies
- Africa-first i18n with next-intl
- Testing with Vitest and Playwright
- Domain business rules

**Key Reference Files:**

- `supabase-patterns.md` - Database and auth integration
- `server-actions.md` - API mutation patterns
- `africa-design.md` - Icon+text and icon-only UI modes
- `domain-rules.md` - Business logic workflows
- `i18n-guide.md` - Translation patterns
- `testing-guide.md` - Test strategies

**Validation Scripts:**

- `scripts/validate.sh` - Full pre-PR validation
- `scripts/quick-check.sh` - Fast pre-commit checks
- `scripts/pre-commit.sh` - Git hook integration

---

### 2. ecopulse-ux (Frontend & User Experience) ✨ NEW

**Location:** `.github/skills/ecopulse-ux/`

**Purpose:** User-centered design patterns for:

- **8 User Personas** with validated pain points
- **African Community Design Principles** (low-literacy, offline-first, SMS)
- **UI Component Patterns** (icons, voice notes, touch targets)
- **Accessibility Standards** (WCAG 2.1 AA compliance)
- **Performance Optimization** (map pin limits, image compression)
- **Real Use Cases** from architecture and UX design specs

**Key Sections:**

- Core Design Philosophy (Africa-first imperatives)
- User Personas & Pain Points (Maria, Sara, Linda, Alex, James, + 3 more)
- UI Component Patterns (Hugeicons, voice notes, offline support, SMS)
- Responsive Navigation (navbar + hamburger menu)
- Accessibility Patterns (screen readers, keyboard nav)
- Form Validation (React Hook Form + Zod)
- Performance Optimization (50-pin mobile limit, smart prioritization)
- Real Use Cases (illiterate user reports, NGO bulk operations, anonymous conversion)

**Integration:**

- Synthesized from **2,847 lines** of architecture.md
- Synthesized from **2,615 lines** of ux-design-specification.md
- Cross-referenced with developer skill
- Validated against BMAD design thinking workflows

---

## How They Work Together

```
User Request: "Implement report submission flow for illiterate users"

┌─────────────────────────────────────────────────────────────┐
│ Copilot automatically activates BOTH skills:                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 1. ecopulse-ux skill provides:                              │
│    - Maria persona (60-second report flow)                  │
│    - Voice note recording pattern (WhatsApp-style)          │
│    - Icon-driven category selection (no text labels)        │
│    - 44px touch targets for mobile                          │
│    - Offline-first local storage pattern                    │
│                                                              │
│ 2. ecopulse-developer skill provides:                       │
│    - Server Action for report creation                      │
│    - Supabase client usage (SSR pattern)                    │
│    - Voice note upload to Supabase Storage                  │
│    - RLS policies for data isolation                        │
│    - Zod validation schema                                  │
│                                                              │
│ Result: Copilot generates code that combines:              │
│ - User-centered design (UX skill)                           │
│ - Technical implementation (Developer skill)                │
│ - Real use cases (from specs)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Relationship to BMAD Agents

| System                 | Purpose                    | When to Use                                            |
| ---------------------- | -------------------------- | ------------------------------------------------------ |
| **BMAD Agents**        | Orchestrate SDLC workflows | Sprint planning, architecture decisions, user research |
| **ecopulse-developer** | Backend coding assistance  | Server Actions, Supabase, testing, i18n                |
| **ecopulse-ux**        | Frontend design guidance   | UI components, accessibility, personas, flows          |

**Complementary, Not Redundant:**

- BMAD agents create _strategic plans_ (epics, user stories)
- Copilot Skills help _implement_ those plans with context
- Both reference same source of truth (PRD, architecture, UX specs)

---

## Design Thinking Integration

The **ecopulse-ux skill** was created using BMAD's Design Thinking Coach agent, which:

1. **Empathized** - Read complete architecture (2,847 lines) and UX specs (2,615 lines)
2. **Defined** - Extracted 8 personas with real pain points
3. **Ideated** - Synthesized African community design principles
4. **Prototyped** - Created reusable UI component patterns
5. **Tested** - Validated against real use cases and accessibility standards

**Result:** A skill grounded in real user needs, not generic best practices.

---

## Real Use Cases Integrated

### Use Case 1: Illiterate User Reports Waste

**Persona:** Maria (low-literacy, mobile-only)  
**Patterns:** Icon-driven UI, voice notes, 44px touch targets  
**Flow:** Camera → Icon category → Voice description → Auto-location → Submit

### Use Case 2: NGO Creates Cleanup Event

**Persona:** Linda (bulk operations, donor reporting)  
**Patterns:** Auto-prioritization, bulk actions, CSV export  
**Flow:** Select 6 related issues → Create Action Card → Upload proof → Export funder report

### Use Case 3: Anonymous User Converts

**Persona:** Alex (no signup friction)  
**Patterns:** Social proof, retroactive credit, conversion triggers  
**Flow:** Anonymous report → Verification → Non-intrusive account prompt → Link past reports

---

## Metrics & Success Criteria

### Sprint 1 KPIs (from UX skill)

- **Report submission time:** <60s (95th percentile)
- **Anonymous conversion rate:** 25%+ (1,250 accounts/year)
- **Verification completion:** 40%+ (verified reports / total)
- **Map load time:** <1s with 50 pins (mobile)

### Phase 2 KPIs (African expansion)

- **Voice note adoption:** 30%+ of reports (low-literacy validation)
- **Offline sync rate:** 95%+ successful uploads
- **SMS engagement:** 60%+ open rate (vs 20% email)
- **NGO time savings:** 80%+ reduction (10 hours → 2 hours/month)

---

## Validation & Testing

**Before merging UI/UX code, check:**

- [ ] Which persona's pain point does this solve?
- [ ] Tested on 320px mobile viewport?
- [ ] All touch targets ≥44px?
- [ ] Using Hugeicons library?
- [ ] Illiterate users can complete flow?
- [ ] Works offline + syncs when online?
- [ ] Screen reader announces correctly?
- [ ] Tab order follows visual flow?
- [ ] Color contrast meets WCAG 2.1 AA?
- [ ] Performance targets met?

**Validation scripts:**

```bash
# Developer skill validation (technical patterns)
.github/skills/ecopulse-developer/scripts/validate.sh

# Manual UX validation (accessibility, personas)
# (See ecopulse-ux/SKILL.md "Testing Checklist")
```

---

## Next Steps

### For Developers

1. **Read both skills** before starting any feature
2. **Cross-reference** UX patterns with technical implementation
3. **Validate against personas** (not generic user stories)
4. **Test with accessibility tools** (NVDA, VoiceOver)

### For Designers

1. **Document new patterns** in ecopulse-ux skill
2. **Test with Nigerian users** (Hausa, Yoruba, Igbo speakers)
3. **Validate offline flows** and SMS notifications
4. **Update Figma templates** with validated patterns

### For Product Managers

1. **Map features to personas** from UX skill
2. **Prioritize African market needs** (low-literacy, offline, SMS)
3. **Track conversion metrics** (anonymous → authenticated)
4. **Monitor performance KPIs** (report submission time, map load)

---

## Maintenance

**Update ecopulse-ux skill when:**

- New personas emerge from user research
- Additional African markets targeted (Swahili, Amharic, French)
- Accessibility standards change
- New UI patterns validated through testing

**Update ecopulse-developer skill when:**

- Architectural decisions change
- New technical patterns emerge
- Tech stack evolves

**Last Updated:** December 24, 2025  
**Next Review:** Sprint 2 retrospective (Week 6)

---

## Links

- **Developer Skill:** [.github/skills/ecopulse-developer/](ecopulse-developer/)
- **UX Skill:** [.github/skills/ecopulse-ux/](ecopulse-ux/)
- **Copilot Instructions:** [copilot-instructions.md](../copilot-instructions.md)
- **Architecture:** [/\_bmad-output/architecture.md](../../_bmad-output/architecture.md)
- **UX Design Spec:** [/\_bmad-output/ux-design-specification.md](../../_bmad-output/ux-design-specification.md)
- **BMAD Agents:** [/\_bmad/](../../_bmad/)

---

**Questions or Feedback:**

- Slack: #ecopulse-dev, #ecopulse-design
- Documentation: Skills README files
- BMAD Agents: `@_bmad/cis/agents/design-thinking-coach.md`
