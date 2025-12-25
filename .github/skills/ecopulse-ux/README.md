# EcoPulse UI/UX Design Skill

**Author:** Maya (Design Thinking Coach) via BMAD Agent System  
**Created:** December 24, 2025  
**Status:** Production Ready

---

## Overview

This Copilot Skill provides comprehensive UI/UX guidance for building EcoPulse's Africa-first environmental action platform. It synthesizes insights from:

- **8 User Personas** with real pain points and use cases
- **Architecture Document** (2,847 lines) - technical patterns and constraints
- **UX Design Specification** (2,615 lines) - screen layouts and interaction flows
- **BMAD Design Thinking Workflow** - empathy-driven methodologies

---

## What's Inside

### 1. **Core Design Philosophy** (African Community Focus 🌍)

- Low-literacy support (icon-driven UI, voice notes)
- Offline-first architecture (2G/3G networks)
- SMS notifications (works without data/smartphones)
- Tangible impact metrics ("15 kg waste removed")
- Educational by design (teach users to act)

### 2. **User Personas & Pain Points**

- **Maria Rodriguez** (Reporter) - 60-second report flow, anonymous reporting
- **Sara Chen** (Verifier) - Resolution verification, reputation system
- **Linda Martinez** (NGO) - Bulk operations, auto-prioritization, funder reports
- **Alex Kim** (Anonymous) - Retroactive credit, conversion triggers
- **James Taylor** (Volunteer) - Social proof, volunteer certificates
- Plus 3 more personas (Michelle, David, Kevin)

### 3. **UI Component Patterns**

- **Icon Library:** Hugeicons (23,000+ icons, environmental symbols)
- **Voice Notes:** WhatsApp-style recording for illiterate users
- **Offline-First:** Local storage + sync when online
- **SMS:** Africa's Talking API for rural users
- **Touch Targets:** 44px minimum (WCAG 2.1 AA)
- **Event Timeline:** Show what happened (not abstract status labels)

### 4. **Responsive Navigation**

- Desktop navbar (1024px+) - horizontal menu
- Mobile hamburger (320px-1023px) - drawer from left
- Role-based progressive disclosure

### 5. **Accessibility Standards**

- Screen reader support (NVDA, JAWS, VoiceOver)
- Keyboard navigation (tab order, focus indicators)
- Form accessibility (labels, error messages, ARIA)
- Color contrast (WCAG 2.1 AA compliant)

### 6. **Performance Optimization**

- Map pin limit (50 mobile, 100 desktop)
- Smart prioritization algorithm
- Image compression (sharp library)
- Lazy loading for photos

### 7. **Form Validation**

- React Hook Form + Zod
- Client-side + server-side validation
- User-friendly error messages

---

## How to Use This Skill

### For AI Coding Agents

**Before implementing any UI/UX work:**

1. Read the full [SKILL.md](./SKILL.md) document
2. Cross-reference with [ecopulse-developer skill](../ecopulse-developer/SKILL.md) for technical patterns
3. Identify which persona's pain point you're solving
4. Validate your design meets African community design principles
5. Ensure WCAG 2.1 AA compliance
6. Test with 44px touch targets on mobile

**Example Workflow:**

```
Task: Implement report submission flow

1. Read persona: Maria Rodriguez (60-second target)
2. Review UI pattern: Voice Notes + Icon-driven UI
3. Check accessibility: Screen reader support + keyboard nav
4. Verify performance: Photo compression before upload
5. Validate offline: Local storage + sync when online
```

### For UX Designers

**Creating mockups:**

1. Use Hugeicons library for all icons
2. Design mobile-first (320px baseline)
3. Test with low-literacy users (voice notes, icons)
4. Validate color contrast (WCAG 2.1 AA)
5. Document new patterns in this skill

**Figma Templates:**

- Mobile: 375x667 (iPhone SE baseline)
- Tablet: 768x1024 (iPad)
- Desktop: 1440x900 (MacBook Pro)

### For Product Managers

**Prioritizing features:**

1. Map to persona pain points
2. Consider African market context (low-literacy, offline, SMS)
3. Validate conversion triggers (anonymous → authenticated)
4. Monitor key metrics:
   - Report submission time (target: <60s)
   - Anonymous conversion rate (target: 25%)
   - Verification completion (target: 40%)

---

## Complementary Skills

**This skill works with:**

1. **[ecopulse-developer](../ecopulse-developer/)** - Technical implementation patterns
   - Server Actions, database schema, API patterns
   - Supabase integration, RLS policies
   - Testing strategies, CI/CD workflows

2. **BMAD Agents** - Design thinking and planning
   - [Design Thinking Coach](/_bmad/cis/agents/design-thinking-coach.md) - Human-centered design
   - [Development Team Lead](/_bmad/bmm/agents/dev.md) - Sprint planning and execution
   - [Scrum Master](/_bmad/bmm/agents/scrum-master.md) - Backlog management

---

## Real Use Cases

### Use Case 1: Illiterate User Reports Waste Issue

**Persona:** Maria (low-literacy, mobile-only)

**Flow:**

1. Tap FAB → Camera opens immediately
2. Take photo of overflowing bin
3. Tap icon: 🗑️ (Waste/Trash)
4. Tap emoji: 😰 (High severity)
5. **Hold microphone button, record:** "This bin is full, kids playing nearby"
6. Submit → Pin appears on map

**Design Patterns Used:**

- Icon-driven UI (no text labels)
- Voice note recording (WhatsApp-style)
- 44px touch targets
- Auto-location (no manual entry)

---

### Use Case 2: NGO Coordinator Creates Cleanup Event

**Persona:** Linda (bulk operations, donor reporting)

**Flow:**

1. Open NGO Dashboard → Priority Inbox
2. See 6 related reports auto-grouped
3. Select all 6 → "Create Action Card"
4. Auto-fill from template: "Saturday Cleanup"
5. Upload proof photo → Closes all 6 issues
6. Export funder report → CSV with embedded photo URLs

**Design Patterns Used:**

- Bulk operations (checkboxes)
- Auto-prioritization algorithm
- Action Card templates
- One-click CSV export

---

### Use Case 3: Anonymous User Converts to Account

**Persona:** Alex (rideshare driver, doesn't want signup friction)

**Flow:**

1. Land on homepage → See map with resolved issues
2. Tap "Report Issue (No Account Required)"
3. Submit report → Get bookmarkable URL
4. **3 days later:** Report is verified by 2 neighbors
5. See banner: "Your report was verified! Create account to track updates."
6. Create account → Backend links 3 anonymous reports retroactively
7. See impact: "You helped remove 8 kg waste!"

**Design Patterns Used:**

- Social proof landing page
- Anonymous reporting
- Retroactive credit linking
- Non-intrusive conversion triggers

---

## Testing Checklist

### Before Merging UI/UX Code

- [ ] **Persona Validation:** Which persona's pain point does this solve?
- [ ] **Mobile-First:** Tested on 320px viewport?
- [ ] **Touch Targets:** All interactive elements ≥44x44px?
- [ ] **Icons:** Using Hugeicons library?
- [ ] **Voice Notes:** Illiterate users can complete flow?
- [ ] **Offline:** Works without internet + syncs when online?
- [ ] **Screen Reader:** NVDA/JAWS/VoiceOver announce correctly?
- [ ] **Keyboard Nav:** Tab order follows visual flow?
- [ ] **Color Contrast:** Meets WCAG 2.1 AA (4.5:1 minimum)?
- [ ] **Performance:** Map loads in <1s, report submits in <60s?
- [ ] **SMS:** Notifications arrive within 5 minutes?

---

## Metrics & Success Criteria

### Sprint 1 KPIs

- **Report submission time:** <60s (95th percentile)
- **Anonymous conversion rate:** 25%+ (target: 1,250 accounts/year)
- **Verification completion:** 40%+ (verified reports / total reports)
- **Map load time:** <1s with 50 pins (mobile)

### Phase 2 KPIs

- **Voice note adoption:** 30%+ of reports use audio (low-literacy validation)
- **Offline sync rate:** 95%+ successful uploads when back online
- **SMS engagement:** 60%+ open rate (vs 20% email)
- **NGO time savings:** 80%+ reduction (10 hours → 2 hours/month)

---

## Updates & Maintenance

**Update this skill when:**

- New personas emerge from user research
- Additional African markets are targeted (Swahili, Amharic, French)
- Accessibility standards change (WCAG updates)
- New UI patterns are validated through user testing
- Performance targets are adjusted

**Last Updated:** December 24, 2025  
**Next Review:** Sprint 2 retrospective (Week 6)

---

## Quick Reference

| Need              | See Section                               |
| ----------------- | ----------------------------------------- |
| Icon library      | UI Component Patterns → Icon Library      |
| Voice notes       | UI Component Patterns → Voice Notes       |
| Offline support   | UI Component Patterns → Offline-First     |
| SMS notifications | UI Component Patterns → SMS Notifications |
| Touch targets     | UI Component Patterns → Touch Targets     |
| Navigation        | Responsive Navigation Patterns            |
| Accessibility     | Accessibility Patterns                    |
| Forms             | Form Validation Patterns                  |
| Performance       | Performance Optimization                  |
| Personas          | User Personas & Pain Points               |

---

**Questions or Feedback:**

- Slack: #ecopulse-design
- Email: design@ecopulse.io
- Documentation: [SKILL.md](./SKILL.md)
