# Remaining Sprint 2 Stories - Quick Reference

## Epic 2.1 (Remaining)

### 2.1.6: Verification Status Badge on Map Pins (3 pts)

- Update map markers to show verified status
- Green checkmark badge on pins with 2+ verifications
- Filter toggle: "Show only verified issues"
- Update IssueMarker component from Story 0.3

### 2.1.7: Email Notification Preferences (3 pts)

- Profile settings page for email preferences
- Toggle: Email when reports verified (default: ON)
- Toggle: Email for Action Cards (default: ON)
- Toggle: Monthly impact summary (default: OFF)
- Profile privacy toggle: Public/Private profile

### 2.1.8: Verification Notifications (Email) (3 pts)

- Send email when 2nd verification received
- React Email template
- Resend API integration
- Check email preference before sending
- Don't email anonymous reporters

### 2.1.9: Verification Analytics for Reporters (5 pts)

- User profile stats: Total reports, verified count, verification rate
- "My Reports" page with verification status
- Sort/filter options
- Pagination (20 per page)

## Epic 2.2: User Profiles

### 2.2.1: User Profile Page Foundation (3 pts)

- Profile routes: `/profile` and `/profile/[username]`
- Avatar upload with EXIF stripping
- Bio editor (200 chars max)
- Join date, location
- Edit mode for own profile

### 2.2.2: Tangible Impact Metrics (7 pts) **CRITICAL**

- NO points/badges/leaderboards
- Show: Verified reports (~kg waste estimated), Drains cleared, Volunteer hours
- Hybrid Sprint 2 (estimated) + Sprint 3 (actual measured) metrics
- PostgreSQL function: `get_user_impact()`
- Clear labeling: "~180 kg estimated" vs "45 kg measured"

### 2.2.3: Community Celebration Messaging (3 pts)

- Milestone modals (first report, 5 verified, 50kg waste)
- Toast notifications
- Focus on environmental impact (not competitive)
- Milestone tracking to prevent duplicate celebrations

### 2.2.4: Contribution Timeline & Activity Feed (4 pts)

- Recent activity feed on profile
- Show reports, verifications, Action Cards
- Relative timestamps
- Pagination (20 items)
- Filter by activity type

### 2.2.5: Satellite Layer Toggle (2 pts) **ALREADY CREATED**

- See #file:2.2.5-satellite-layer-toggle.md
- Street map (OpenStreetMap) and Satellite (Esri World Imagery)
- Mobile toggle button, desktop LayersControl
- Zustand state + localStorage persistence

## Epic 2.3: Basic Flagging System

### 2.3.1: Flag Button on Issues & Photos (3 pts)

- Flag icon on issue detail and photos
- Reason selection: Spam, Inappropriate, Harassment, Other
- Self-flag prevention
- Duplicate flag prevention
- Create flags table

### 2.3.2: Auto-Hide Issues After Flag Threshold (4 pts)

- Weighted scoring: Verified users (2 pts), Anonymous (1 pt)
- Auto-hide at 5+ points
- RLS policy filters flagged issues
- Database trigger for auto-hide
- Admin can unhide via Supabase

### 2.3.3: Admin Moderation Dashboard (2 pts)

- MVP: Use Supabase Table Editor
- Admins review flags table
- Manual unhide process
- Phase 2: Custom admin UI

### 2.3.4: Flag Analytics & Spam Rate Monitoring (4 pts)

- SQL queries for flag metrics
- Flag rate: (flags / total_issues) \* 100
- Target: <5% spam rate
- Top flaggers query
- Alert if flag rate >10%

---

## Implementation Priority Order

**Week 1:**

1. 2.1.1-2.1.4 (Verification core)
2. 2.1.5-2.1.6 (Display features)

**Week 2:**

1. 2.2.1-2.2.2 (Profile foundation)
2. 2.1.7-2.1.9 (Email & analytics)
3. 2.2.5 (Satellite toggle)

**Week 3:**

1. 2.2.3-2.2.4 (Community features)
2. 2.3.1-2.3.4 (Flagging system)

---

## Files Created So Far

✅ README.md
✅ 2.1.1-verification-button-ui.md
✅ 2.1.2-verification-photo-capture.md
✅ 2.1.3-verification-context-notes.md
✅ 2.1.4-verification-server-action.md
✅ 2.1.5-multi-verifier-display.md
✅ 2.2.5-satellite-layer-toggle.md (pre-existing)

🔄 Need to create: 2.1.6, 2.1.7, 2.1.8, 2.1.9, 2.2.1, 2.2.2, 2.2.3, 2.2.4, 2.3.1, 2.3.2, 2.3.3, 2.3.4 (12 more)
