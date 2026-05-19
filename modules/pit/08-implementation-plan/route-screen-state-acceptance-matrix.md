# PIT Stage 8 — Route/Screen/Five-State Acceptance Matrix

Sources:
- `modules/pit/08-implementation-plan/implementation-plan.md` §4 (27 routes)
- `modules/pit/06-qa-to-red/route-screen-state-red-matrix.md` (five-state RED definitions)
- `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` §2 and §4 (22-screen source of truth)

> Evidence contract: each applicable state requires screenshot or equivalent visual/runtime proof (HAR/log/trace where relevant).

| Route | Screen | Owning Wave | Loading | Empty | Permission Denied | Network Error | Data | Role Restrictions | Evidence Required | RED Test IDs |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Landing Screen | W8.1 | N/A (public) | N/A | N/A | Public route error state | Public render | None | direct-load screenshot + HAR | PIT-RED-ROUTE-001 |
| `/login` | Login Screen | W8.1 | submitting state | validation empty/error states | N/A | auth service error | success redirect | unauth only | form/error screenshots + HAR | PIT-RED-ROUTE-002, PIT-RED-AUTH-001..003 |
| `/signup` | Signup Screen | W8.1 | submitting state | validation empty/error states | invite-only deny where applicable | signup service error | success/verification state | unauth only; invite-only rules | screenshots + HAR | PIT-RED-ROUTE-003, PIT-RED-AUTH-004..005 |
| `/forgot-password` | Forgot-Password Screen | W8.1 | submitting state | empty input validation | N/A | mail/send error | confirmation state | unauth only | screenshots + HAR | PIT-RED-ROUTE-004, PIT-RED-AUTH-009 |
| `/reset-password` | Reset-Password Screen | W8.1 | token validation loading | invalid/expired token empty state | N/A | reset API error | password changed state | token required | screenshots + HAR | PIT-RED-ROUTE-005, PIT-RED-AUTH-010 |
| `/invite/:token` | Invitation Acceptance Screen | W8.1 | token validation loading | invalid token state | N/A | invite API/network error | invitation accepted state | token required | screenshots + HAR | PIT-RED-ROUTE-006, PIT-RED-AUTH-006..008 |
| `/dashboard` | Portfolio Dashboard | W8.7 (foundation W8.1) | required | required | required | required | required | authenticated; role-scoped data | five-state screenshots + HAR | PIT-RED-ROUTE-007, PIT-RED-QA-001..002 |
| `/projects` | Projects List Screen | W8.1 | required | required | required | required | required | authenticated | five-state screenshots + HAR | PIT-RED-ROUTE-008 |
| `/projects/new` | Project Creation Screen | W8.3 | form loading | empty form state | required | submit/network error | successful form/data render | creator role required | screenshot + denied HAR | PIT-RED-ROUTE-009, PIT-RED-RLS-001 |
| `/projects/:id` | Implementation Page (Project Dashboard) | W8.3 | required | required | required | required | required | project member scope | five-state screenshots + indicator proof | PIT-RED-ROUTE-010, PIT-RED-PROJECT-001..016 |
| `/projects/:id/timeline` | Timeline / Gantt Screen | W8.6 | required | required | required | required | required | project member; editor-only mutations | five-state screenshots + traces | PIT-RED-ROUTE-011, PIT-RED-TIMELINE-001..012 |
| `/projects/:id/milestones` | Milestone Management Screen | W8.3 | required | required | required | required | required | project member scope | five-state screenshots + CRUD traces | PIT-RED-ROUTE-012, PIT-RED-PROJECT-003..004 |
| `/projects/:id/deliverables` | Deliverable Management Screen | W8.3 | required | required | required | required | required | project member scope | five-state screenshots + CRUD traces | PIT-RED-ROUTE-013, PIT-RED-PROJECT-005 |
| `/projects/:id/tasks` | Task Management Screen | W8.3 (AI touchpoints W8.9) | required | required | required | required | required | task/member role boundaries | five-state screenshots + action logs | PIT-RED-ROUTE-014, PIT-RED-PROJECT-006..009, PIT-RED-AIMC-001..007 |
| `/projects/:id/evidence` | Evidence Upload/Review Screen | W8.5 | required | required | required | required | required | reviewer/task-owner permissions; viewer denied writes | five-state screenshots + upload/review HAR | PIT-RED-ROUTE-015, PIT-RED-EVIDENCE-001..010 |
| `/projects/:id/reports` | Reports and Exports Screen | W8.8 | required | required | required | required | required | reporter role required for generation/export | five-state screenshots + export artifacts | PIT-RED-ROUTE-016, PIT-RED-REPORT-001..008 |
| `/projects/:id/settings` | Project Settings Screen | W8.3 | required | required | required | required | required | project leader/admin restrictions | five-state screenshots + denied-path proof | PIT-RED-ROUTE-017 |
| `/my-work` | My Work Screen | W8.4 | required | required | required | required | required | task-owner/member scoping | five-state screenshots + assignment proof | PIT-RED-ROUTE-018 |
| `/notifications` | Notification History Screen (Stage 2 Screen 22) | W8.4 (report hooks W8.8) | required | required | required (where role-gated events) | required | required | user-scope notifications only | five-state screenshots + payload isolation | PIT-RED-ROUTE-019, PIT-RED-NOTIFICATION-001..007 |
| `/profile` | Profile + Preferences Screen | W8.4 | required | required | required | required | required | authenticated own-profile only | five-state screenshots + preference save logs | PIT-RED-ROUTE-020 |
| `/onboarding` | Onboarding Screen | W8.1 | step loading/submitting | step-empty validation | N/A | onboarding API error | completion state | authenticated new user | screenshots + HAR | PIT-RED-ROUTE-021, PIT-RED-AUTH-014 |
| `/admin/org` | Org Admin Screen | W8.2 | required | required | required | required | required | org_admin+ only | five-state screenshots + denied proof | PIT-RED-ROUTE-022, PIT-RED-RLS-001 |
| `/admin/users` | User Management Screen | W8.2 | required | required | required | required | required | org_admin+ only | five-state screenshots + denied proof | PIT-RED-ROUTE-023 |
| `/admin/settings` | Org Settings Screen | W8.2 | required | required | required | required | required | org_admin+ only | five-state screenshots + denied proof | PIT-RED-ROUTE-024 |
| `/admin/audit-log` | Audit Log Screen | W8.5 (access baseline W8.2) | required | required | required | required | required | auditor/cs2_admin scoped visibility | five-state screenshots + export proof | PIT-RED-ROUTE-025, PIT-RED-AUDIT-001..007 |
| `/qa-dashboard` | QA Dashboard Screen | W8.7 (access baseline W8.2) | required | required | required | required | required | cs2_admin-only data visibility | five-state screenshots + HAR payload isolation | PIT-RED-ROUTE-026, PIT-RED-QA-001..005 |
| `*` | NotFound Screen | W8.2 | N/A | N/A | N/A | fallback error handling | 404 page render | none | direct-load screenshot | PIT-RED-ROUTE-027 |

## Reconciliation note (27 routes vs 22 screens)

- Route-level acceptance uses the canonical 27-route set from Stage 8/Architecture.
- Screen-level acceptance maps to Stage 2's 22-screen source-of-truth where a single screen services multiple routes or auth variants.
- No route is out-of-scope; no primary page may close without five-state evidence where applicable.
