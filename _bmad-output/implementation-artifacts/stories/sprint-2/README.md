# Sprint 2 Stories - Verification + Profiles

**Sprint Duration:** Weeks 4-6  
**Total Stories:** 18  
**Total Story Points:** 57

---

## Epic 2.1: Community Verification Flow (27 points)

| Story | Title                                                          | Points | Status      |
| ----- | -------------------------------------------------------------- | ------ | ----------- |
| 2.1.1 | Verification Button & UI Entry Point                           | 3      | Not Started |
| 2.1.2 | Verification Photo Capture with Angle Validation               | 3      | Not Started |
| 2.1.3 | Verification Context Notes & Timestamp                         | 3      | Not Started |
| 2.1.4 | Create Verification Server Action with Self-Verification Block | 6      | Not Started |
| 2.1.5 | Multi-Verifier Display & Photo Gallery                         | 3      | Not Started |
| 2.1.6 | Verification Status Badge on Map Pins                          | 3      | Not Started |
| 2.1.7 | Email Notification Preferences                                 | 3      | Not Started |
| 2.1.8 | Verification Notifications (Email)                             | 3      | Not Started |
| 2.1.9 | Verification Analytics for Reporters                           | 5      | Not Started |

---

## Epic 2.2: User Profiles with Tangible Impact (17 points)

| Story | Title                                     | Points | Status      |
| ----- | ----------------------------------------- | ------ | ----------- |
| 2.2.1 | User Profile Page Foundation              | 3      | Not Started |
| 2.2.2 | Tangible Impact Metrics (NO Gamification) | 7      | Not Started |
| 2.2.3 | Community Celebration Messaging           | 3      | Not Started |
| 2.2.4 | Contribution Timeline & Activity Feed     | 4      | Not Started |
| 2.2.5 | Satellite Layer Toggle                    | 2      | Not Started |

---

## Epic 2.3: Basic Flagging System (13 points)

| Story | Title                                    | Points | Status      |
| ----- | ---------------------------------------- | ------ | ----------- |
| 2.3.1 | Flag Button on Issues & Photos           | 3      | Not Started |
| 2.3.2 | Auto-Hide Issues After Flag Threshold    | 4      | Not Started |
| 2.3.3 | Admin Moderation Dashboard (Supabase UI) | 2      | Not Started |
| 2.3.4 | Flag Analytics & Spam Rate Monitoring    | 4      | Not Started |

---

## Dependencies & Order

**Week 1 (Verification Flow):**

1. 2.1.1 → 2.1.2 → 2.1.3 → 2.1.4 (Verification core)
2. 2.1.5 → 2.1.6 (Display features)

**Week 2 (Profiles + Integration):**

1. 2.2.1 → 2.2.2 (Profile foundation)
2. 2.1.7 → 2.1.8 → 2.1.9 (Email & analytics)
3. 2.2.5 (Satellite toggle - independent)

**Week 3 (Community Features):**

1. 2.2.3 → 2.2.4 (Celebration & timeline)
2. 2.3.1 → 2.3.2 → 2.3.3 → 2.3.4 (Flagging system)

---

## Critical Success Criteria

- ✅ 2-verification threshold promotes status to "verified"
- ✅ Self-verification blocked (authenticated + anonymous via session_id)
- ✅ Email notifications sent (with preference check)
- ✅ Profiles show tangible impact (NO points/badges)
- ✅ Flagging auto-hides at 5+ weighted score
- ✅ Zero race conditions in concurrent verifications
- ✅ All features WCAG 2.1 AA compliant
