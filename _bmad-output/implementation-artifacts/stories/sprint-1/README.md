# Sprint 1 Story Index

**Sprint:** 1 (Weeks 1-3)  
**Goal:** Core Reporting + Map  
**Total Stories:** 17  
**Total Story Points:** 52  
**Status:** Ready for Development

---

## Epic 1.1: Responsive Navigation & Layout (8 points)

| Story                                        | Title                               | Points | Status      |
| -------------------------------------------- | ----------------------------------- | ------ | ----------- |
| [1.1.1](1.1.1-desktop-navigation-bar.md)     | Desktop Navigation Bar              | 3      | Not Started |
| [1.1.2](1.1.2-mobile-hamburger-menu.md)      | Mobile Hamburger Menu (Icon-Driven) | 3      | Not Started |
| [1.1.3](1.1.3-role-based-menu-visibility.md) | Role-Based Menu Visibility          | 2      | Not Started |

**Epic Deliverables:**

- Responsive navigation with Radix UI
- Icon-driven mobile menu (NO text labels)
- Role-based menu visibility (anonymous, member, NGO, gov)

---

## Epic 1.2: Interactive Map with Clustering & Filters (13 points)

| Story                                        | Title                                   | Points | Status      |
| -------------------------------------------- | --------------------------------------- | ------ | ----------- |
| [1.2.1](1.2.1-basic-leaflet-map-setup.md)    | Basic Leaflet Map Setup                 | 3      | Not Started |
| [1.2.2](1.2.2-display-issue-pins.md)         | Display Issue Pins on Map               | 5      | Not Started |
| [1.2.3](1.2.3-client-side-pin-clustering.md) | Client-Side Pin Clustering              | 3      | Not Started |
| [1.2.4](1.2.4-map-filters-ui.md)             | Map Filters UI (Category, Status, Date) | 3      | Not Started |

**Epic Deliverables:**

- Interactive map with geolocation
- Issue pins with status colors
- Client-side clustering (react-leaflet-cluster)
- Filter panel (category, status, date range)

---

## Epic 1.3: 60-Second Report Submission Flow (22 points)

| Story                                            | Title                              | Points | Status      |
| ------------------------------------------------ | ---------------------------------- | ------ | ----------- |
| [1.3.1](1.3.1-floating-action-button.md)         | Floating Action Button (FAB)       | 2      | Not Started |
| [1.3.2](1.3.2-photo-capture-exif-stripping.md)   | Photo Capture & EXIF Stripping     | 5      | Not Started |
| [1.3.3a](1.3.3a-auto-location-detection.md)      | Auto-Location Detection            | 3      | Not Started |
| [1.3.3b](1.3.3b-map-pin-adjustment.md)           | Map Pin Adjustment & Manual Search | 5      | Not Started |
| [1.3.4](1.3.4-icon-based-category-selection.md)  | Icon-Based Category Selection      | 2      | Not Started |
| [1.3.5](1.3.5-visual-severity-indicator.md)      | Visual Severity Indicator          | 2      | Not Started |
| [1.3.6](1.3.6-report-submission-confirmation.md) | Report Submission & Confirmation   | 5      | Not Started |

**Epic Deliverables:**

- FAB button (56x56px, camera icon)
- Photo upload with EXIF stripping (1-5 photos)
- Geolocation with Nominatim reverse geocoding
- Draggable pin with address search
- Icon-only category selector (waste, drainage)
- Icon-only severity selector (low, medium, high)
- Complete submission flow with error handling

---

## Epic 1.4: User Authentication & Profile (9 points)

| Story                                                   | Title                                 | Points | Status      |
| ------------------------------------------------------- | ------------------------------------- | ------ | ----------- |
| [1.4.1](1.4.1-email-password-auth.md)                   | Email/Password Signup & Login         | 3      | Not Started |
| [1.4.2](1.4.2-magic-link-authentication.md)             | Magic Link Authentication             | 2      | Not Started |
| [1.4.3](1.4.3-anonymous-to-authenticated-conversion.md) | Anonymous to Authenticated Conversion | 3      | Not Started |

**Epic Deliverables:**

- Email/password authentication
- Magic link (passwordless) authentication
- Retroactive credit for anonymous reports
- Session ID tracking in localStorage

---

## Development Order

### Week 1: Navigation + Map Foundation

1. [1.1.1](1.1.1-desktop-navigation-bar.md) - Desktop Navigation Bar (3 pts)
2. [1.1.2](1.1.2-mobile-hamburger-menu.md) - Mobile Hamburger Menu (3 pts)
3. [1.2.1](1.2.1-basic-leaflet-map-setup.md) - Basic Leaflet Map Setup (3 pts)
4. [1.2.2](1.2.2-display-issue-pins.md) - Display Issue Pins on Map (5 pts)

**Week 1 Total:** 14 points

---

### Week 2: Map Features + Report Flow

5. [1.2.3](1.2.3-client-side-pin-clustering.md) - Client-Side Pin Clustering (3 pts)
6. [1.2.4](1.2.4-map-filters-ui.md) - Map Filters UI (3 pts)
7. [1.1.3](1.1.3-role-based-menu-visibility.md) - Role-Based Menu Visibility (2 pts)
8. [1.3.1](1.3.1-floating-action-button.md) - Floating Action Button (2 pts)
9. [1.3.2](1.3.2-photo-capture-exif-stripping.md) - Photo Capture & EXIF Stripping (5 pts)
10. [1.3.3a](1.3.3a-auto-location-detection.md) - Auto-Location Detection (3 pts)

**Week 2 Total:** 18 points

---

### Week 3: Report Completion + Auth

11. [1.3.3b](1.3.3b-map-pin-adjustment.md) - Map Pin Adjustment (5 pts)
12. [1.3.4](1.3.4-icon-based-category-selection.md) - Icon-Based Category Selection (2 pts)
13. [1.3.5](1.3.5-visual-severity-indicator.md) - Visual Severity Indicator (2 pts)
14. [1.3.6](1.3.6-report-submission-confirmation.md) - Report Submission & Confirmation (5 pts)
15. [1.4.1](1.4.1-email-password-auth.md) - Email/Password Auth (3 pts)
16. [1.4.2](1.4.2-magic-link-authentication.md) - Magic Link Authentication (2 pts)
17. [1.4.3](1.4.3-anonymous-to-authenticated-conversion.md) - Anonymous Conversion (3 pts)

**Week 3 Total:** 22 points

---

## Critical Implementation Standards

### Africa-First Design (Non-Negotiable)

- **Icon-only UI:** NO text labels in report flow
- **Touch targets:** 44x44px minimum (WCAG 2.1 AA)
- **Low-literacy:** Visual-first design patterns

### Internationalization (NFR75-77)

- **ALL UI text** must use translation keys
- Never hardcode strings
- Use `next-intl` for i18n

### Error Handling

- Comprehensive error messages
- Retry mechanisms for network issues
- ARIA announcements for accessibility

### Testing Requirements

- Unit tests: 80% coverage target
- E2E tests for critical paths
- Accessibility: axe-core validation
- Works on Chrome, Safari, Firefox (last 2 versions)

---

## Dependencies

### Sprint 0 Prerequisites (✅ COMPLETE)

- Database schema with RLS policies
- Supabase client (browser, server, admin)
- Leaflet map with Hugeicons markers
- Photo upload pipeline with EXIF stripping
- CI/CD pipeline
- Zustand stores
- Internationalization (next-intl)

### External Services

- Supabase (database, auth, storage)
- Nominatim (geocoding, free, rate-limited 1 req/sec)
- OpenStreetMap (map tiles, free)

---

## Files to Create

```
components/
├── navigation/
│   ├── DesktopNav.tsx
│   ├── MobileMenu.tsx
│   └── __tests__/
├── map/
│   ├── IssueMap.tsx
│   ├── IssuePinLayer.tsx
│   ├── ClusteredMarkers.tsx
│   ├── MapFilters.tsx
│   └── __tests__/
├── report/
│   ├── ReportFAB.tsx
│   ├── PhotoCapture.tsx
│   ├── LocationDetector.tsx
│   ├── LocationPicker.tsx
│   ├── CategorySelector.tsx
│   ├── SeveritySelector.tsx
│   ├── ReportForm.tsx
│   └── __tests__/
├── auth/
│   ├── SignupForm.tsx
│   ├── LoginForm.tsx
│   ├── MagicLinkForm.tsx
│   └── __tests__/

app/
├── actions/
│   ├── getMapIssues.ts
│   ├── createReport.ts
│   ├── claimAnonymousReports.ts
│   └── __tests__/
├── report/
│   └── new/
│       └── page.tsx
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── magic-link/page.tsx
│   └── callback/route.ts

hooks/
├── useUserRole.ts
├── useGeolocation.ts
└── __tests__/

stores/
├── mapStore.ts (update)
├── authStore.ts (update)
└── reportStore.ts (new)
```

---

## Ready to Start Development

All 17 Sprint 1 stories are documented and ready for implementation. Each story file contains:

- User story (As a/I want/So that)
- Detailed acceptance criteria
- Technical implementation guidance
- Task breakdown with subtasks
- Dependencies and blockers
- Definition of Done checklist

**Next Steps:**

1. Review stories with team
2. Begin with Story 1.1.1 (Desktop Navigation Bar)
3. Follow week-by-week development order
4. Use dev-story workflow for each story implementation
