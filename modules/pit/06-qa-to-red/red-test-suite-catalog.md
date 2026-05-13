# PIT — RED Test Suite Catalog

## Stage 6 — QA-to-Red

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | RED Test Suite Catalog |
| Version | v1.0 |
| Status | RED_SUITE_DEFINED |
| Source | FRS v0.2-hardened (PIT-FR-001–123), TRS v0.2-draft (PIT-TR-001–126), Architecture v1.0, LFV Package |
| Author | foreman-v2-agent |
| Date | 2026-05-13 |
| Issue | maturion-isms#1625 |

> All tests in this catalog are in **RED state** — they will fail before implementation begins. The expected GREEN behaviour defines what the builder must implement to pass.

---

## Column Definitions

| Column | Definition |
|---|---|
| RED Test ID | Stable identifier (e.g., PIT-RED-ROUTE-001) |
| Source | FRS/TRS/Architecture/LFV requirement reference |
| Route/Screen/Domain | Specific target |
| Actor/Role | User role executing the scenario |
| Precondition | State before the test |
| Action | What the actor does |
| Expected Failure (RED) | What happens before implementation |
| Expected GREEN Behaviour | Required post-implementation outcome |
| Harness/Tool | Test harness |
| Evidence Artifact | Evidence captured |
| Priority | P1=blocker, P2=high, P3=medium, P4=low |

---

## Category 1: Route and Screen Rendering (PIT-RED-ROUTE)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-ROUTE-001 | PIT-TR-011, PIT-FR-103 | `/` (LandingPage) | unauthenticated | App deployed to Vercel | Navigate directly to `/` | 404 or blank page | Landing page renders | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-ROUTE-002 | PIT-TR-012 | `/login` | unauthenticated | App deployed | Navigate to `/login` | 404 or blank | Login form renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-003 | PIT-TR-012 | `/signup` | unauthenticated | App deployed | Navigate to `/signup` | 404 or blank | Signup form renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-004 | PIT-TR-012 | `/forgot-password` | unauthenticated | App deployed | Navigate to `/forgot-password` | 404 or blank | Forgot password form renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-005 | PIT-TR-012 | `/reset-password` | unauthenticated | Valid reset token | Navigate to `/reset-password?token=...` | 404 or blank | Reset password form renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-006 | PIT-TR-012 | `/invite/:token` | unauthenticated | Valid invite token | Navigate to `/invite/VALID_TOKEN` | 404 or blank | Invite acceptance screen renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-007 | PIT-TR-011, PIT-TR-013 | `/dashboard` | authenticated viewer | Logged in | Navigate to `/dashboard` | 404 or auth error | Portfolio dashboard renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-008 | PIT-TR-011 | `/projects` | authenticated viewer | Logged in | Navigate to `/projects` | 404 or blank | Projects list renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-009 | PIT-TR-011 | `/projects/new` | project_creator | Logged in with project_creator role | Navigate to `/projects/new` | 404 or permission denied | New project form renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-010 | PIT-TR-011 | `/projects/:id` | viewer | Logged in, project exists | Navigate to `/projects/PROJECT_ID` | 404 or blank | Project detail renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-011 | PIT-TR-011 | `/projects/:id/timeline` | project_leader | Logged in, project with tasks | Navigate to timeline route | 404 or blank | Timeline/Gantt renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-012 | PIT-TR-011 | `/projects/:id/milestones` | project_leader | Logged in | Navigate to milestones route | 404 or blank | Milestones page renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-013 | PIT-TR-011 | `/projects/:id/deliverables` | project_leader | Logged in | Navigate to deliverables route | 404 or blank | Deliverables page renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-014 | PIT-TR-011 | `/projects/:id/tasks` | project_leader | Logged in | Navigate to tasks route | 404 or blank | Tasks page renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-015 | PIT-TR-011 | `/projects/:id/evidence` | reviewer | Logged in | Navigate to evidence route | 404 or blank | Evidence page renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-016 | PIT-TR-011 | `/projects/:id/reports` | reporter | Logged in | Navigate to reports route | 404 or blank | Reports page renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-017 | PIT-TR-011 | `/projects/:id/settings` | project_leader | Logged in | Navigate to settings route | 404 or blank | Project settings renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-018 | PIT-TR-011 | `/my-work` | task_owner | Logged in | Navigate to `/my-work` | 404 or blank | My Work page renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-019 | PIT-TR-011 | `/notifications` | authenticated | Logged in | Navigate to `/notifications` | 404 or blank | Notifications history renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-020 | PIT-TR-011 | `/profile` | authenticated | Logged in | Navigate to `/profile` | 404 or blank | Profile page renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-021 | PIT-TR-011 | `/onboarding` | new user | Just signed up | Navigate to `/onboarding` | 404 or redirect loop | Onboarding screen renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-022 | PIT-TR-011 | `/admin/org` | org_admin | Logged in as org_admin | Navigate to `/admin/org` | 404 or permission denied | Org admin page renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-023 | PIT-TR-011 | `/admin/users` | org_admin | Logged in | Navigate to `/admin/users` | 404 or blank | User management renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-024 | PIT-TR-011 | `/admin/settings` | org_admin | Logged in | Navigate to `/admin/settings` | 404 or blank | Org settings renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-025 | PIT-TR-011 | `/admin/audit-log` | auditor | Logged in | Navigate to `/admin/audit-log` | 404 or blank | Audit log renders | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-026 | PIT-TR-011, PIT-TR-046 | `/qa-dashboard` | cs2_admin | Logged in as cs2_admin | Navigate to `/qa-dashboard` | 404 or permission denied | QA dashboard renders | Playwright E2E | screenshot | P1 |
| PIT-RED-ROUTE-027 | PIT-TR-016, PIT-FR-104 | `*` (404) | authenticated | Logged in | Navigate to `/unknown-route` | White screen or 500 | 404 NotFoundPage renders with Go Home CTA | Playwright E2E | screenshot | P2 |
| PIT-RED-ROUTE-028 | PIT-TR-015, PIT-FR-014 | SPA fallback | unauthenticated | Vercel deployed | Navigate directly to `/projects/123` | 404 from server | SPA loads, protected route guard fires | Playwright E2E | HAR, screenshot | P1 |

---

## Category 2: Auth and Onboarding (PIT-RED-AUTH)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-AUTH-001 | PIT-FR-004, PIT-TR-018 | `/login` | unauthenticated | Valid test user exists | Submit valid credentials | Error or no session | Session created, redirected to /dashboard | Playwright E2E | HAR, screenshot | P1 |
| PIT-RED-AUTH-002 | PIT-FR-004 | `/login` | unauthenticated | Invalid credentials | Submit wrong password | No error shown or auth succeeds | Error message shown, session not created | Playwright E2E | screenshot | P1 |
| PIT-RED-AUTH-003 | PIT-FR-005, PIT-TR-014 | `/login` | unauthenticated | Stored intended destination in sessionStorage | Login successfully | Redirect goes to /dashboard instead of intended | Redirected to stored intended destination | Playwright E2E | screenshot, console | P2 |
| PIT-RED-AUTH-004 | PIT-FR-006, PIT-TR-019 | `/signup` | unauthenticated | New email address | Submit signup form | Error or no account created | Account created, email verification sent | Playwright E2E | screenshot | P2 |
| PIT-RED-AUTH-005 | PIT-FR-007 | `/signup` | unauthenticated | Invite-only mode active | Access signup without invite | Signup proceeds | Blocked with message "invite only" | Playwright E2E | screenshot | P2 |
| PIT-RED-AUTH-006 | PIT-FR-008, PIT-TR-021 | `/invite/:token` | unauthenticated | Valid invite token | Navigate to invite URL | Error or blank | Invite details rendered | Playwright E2E | screenshot | P2 |
| PIT-RED-AUTH-007 | PIT-FR-009, PIT-TR-022 | `/invite/:token` | new user | Valid token | Complete invite acceptance (new user) | Error or no account | Account created, role assigned, session started | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-AUTH-008 | PIT-FR-010 | `/invite/:token` | existing user | Valid token, user has account | Accept invite as existing user | Error | Role added to existing user, redirected to dashboard | Playwright E2E | screenshot | P2 |
| PIT-RED-AUTH-009 | PIT-FR-011, PIT-TR-020 | `/forgot-password` | unauthenticated | Registered email | Submit forgot password | No email sent or error | Reset email sent | Playwright E2E | screenshot | P2 |
| PIT-RED-AUTH-010 | PIT-FR-012, PIT-TR-020 | `/reset-password` | unauthenticated | Valid reset token | Submit new password | Error or password not changed | Password changed, redirected to login | Playwright E2E | screenshot | P2 |
| PIT-RED-AUTH-011 | PIT-FR-013, PIT-TR-013 | Protected route | unauthenticated | Not logged in | Navigate to `/dashboard` | 200 OK shows dashboard | Redirect to `/login` | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-AUTH-012 | PIT-TR-008 | Session restoration | authenticated | App reload | Reload app with valid session | Session lost, redirected to login | Session restored, stays on current page | Playwright E2E | screenshot, console | P1 |
| PIT-RED-AUTH-013 | PIT-TR-008 | Session expiry | authenticated | Session expired | Continue using app after expiry | Undefined behaviour | Graceful logout, session expiry message | Playwright E2E | screenshot | P2 |
| PIT-RED-AUTH-014 | PIT-FR-015, PIT-TR-014 | `/onboarding` | new user | First signup | Complete onboarding steps | Error or stuck | Onboarding completes, redirected to dashboard | Playwright E2E | screenshot | P2 |
| PIT-RED-AUTH-015 | PIT-FR-019 | Organisation switcher | org_admin with multiple orgs | Multiple org memberships | Switch organisation | UI error or wrong data | Organisation context switches, data reloads | Playwright E2E | screenshot | P3 |

---

## Category 3: Role and RLS Negative Paths (PIT-RED-RLS)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-RLS-001 | PIT-FR-001, PIT-TR-026, PIT-TR-041 | `/projects/new` | viewer | Logged in as viewer | Navigate to /projects/new | Route renders without permission check | PermissionDenied component shown | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-RLS-002 | PIT-FR-113, PIT-TR-116 | Milestone creation | viewer | Logged in | POST /milestones API call | 200 OK or no RLS block | 403 Forbidden from RLS | Playwright + Supabase test | HAR, network payload | P1 |
| PIT-RED-RLS-003 | PIT-TR-042 | Project read | viewer (other org) | Logged in, different org | GET /projects?org_id=other_org | 200 OK with other org data | 200 OK with empty data (org-scoped RLS) | Vitest + Supabase test | test output | P1 |
| PIT-RED-RLS-004 | PIT-TR-043 | Audit log cross-org | org_admin | Logged in | Query audit_log without cs2_admin role | All org audit data returned | Only own-org data returned | Vitest + Supabase test | test output | P1 |
| PIT-RED-RLS-005 | PIT-TR-044 | Audit log | task_owner | Logged in | Query audit_log | All audit records returned | 403 / empty (denied) | Vitest + Supabase test | test output | P1 |
| PIT-RED-RLS-006 | PIT-TR-045 | Evidence upload | viewer | Logged in | Attempt evidence upload | Upload succeeds | 403 / RLS block | Playwright E2E | HAR, screenshot | P1 |
| PIT-RED-RLS-007 | PIT-TR-046, PIT-FR-093 | QA dashboard | task_owner | Logged in | Navigate to /qa-dashboard | QA data visible | PermissionDenied component | Playwright E2E | screenshot | P1 |
| PIT-RED-RLS-008 | PIT-FR-001, PIT-TR-047 | Task deletion | task_owner | Logged in | DELETE /tasks/:id (not owner) | 200 OK deleted | 403 Forbidden | Vitest + Supabase | test output | P2 |
| PIT-RED-RLS-009 | PIT-FR-113 | Protected URL navigation | unauthenticated | Not logged in | Navigate directly to /projects/123 | Page loads or 500 | Redirect to /login | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-RLS-010 | PIT-TR-082 | RLS all tables | Any non-admin | Logged in | Direct Supabase query without RLS | Data returned | RLS blocks / filtered | Vitest + Supabase | test output | P1 |
| PIT-RED-RLS-011 | PIT-TR-025, PIT-FR-113 | Permission denied state | insufficient role | Logged in | Access action requiring higher role | White screen or 500 | PermissionDenied component with correct CTA | Playwright E2E | screenshot | P1 |
| PIT-RED-RLS-012 | PIT-TR-024 | Role-gated navigation | viewer | Logged in | Admin menu items visible in nav | Admin items shown | Admin items hidden/absent in nav | Playwright E2E | screenshot | P2 |
| PIT-RED-RLS-013 | PIT-FR-113 | API-level denial | viewer | Logged in | POST create-project Edge Function | 200 OK or 500 | 403 with error body | Playwright + Edge Function | HAR, network payload | P1 |

---

## Category 4: Project Hierarchy and Lifecycle (PIT-RED-PROJECT)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-PROJECT-001 | PIT-FR-031, PIT-TR-029 | Project creation | project_creator | Logged in | Submit project creation form | Error or project not created | Project created, appears in list | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-PROJECT-002 | PIT-FR-032 | Project type classification | project_creator | Creating project | Set type to "initiative" | Type not saved | Type saved, displayed correctly | Playwright E2E | screenshot | P3 |
| PIT-RED-PROJECT-003 | PIT-FR-048, PIT-TR-030 | Milestone creation | project_leader | Project exists | Create milestone | Error or milestone not created | Milestone created in hierarchy | Playwright E2E | screenshot | P1 |
| PIT-RED-PROJECT-004 | PIT-FR-049 | Milestone date constraints | project_leader | Milestone exists | Set milestone end before start | No validation | Date validation error shown | Playwright E2E | screenshot | P2 |
| PIT-RED-PROJECT-005 | PIT-FR-051, PIT-TR-030 | Deliverable creation | milestone_leader | Milestone exists | Create deliverable | Error | Deliverable created under milestone | Playwright E2E | screenshot | P1 |
| PIT-RED-PROJECT-006 | PIT-FR-053, PIT-TR-030 | Task creation | deliverable_leader | Deliverable exists | Create task | Error | Task created under deliverable | Playwright E2E | screenshot | P1 |
| PIT-RED-PROJECT-007 | PIT-FR-054 | Task status: todo→in_progress | task_owner | Task assigned | Update task status to in_progress | Status not updated or no state transition | Status updated, audit log entry created | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-PROJECT-008 | PIT-FR-054 | Task status: in_progress→done | task_owner | Task in_progress | Mark task done (with required evidence) | Status updated without evidence check | Blocked if required evidence missing | Playwright E2E | screenshot | P2 |
| PIT-RED-PROJECT-009 | PIT-FR-058, PIT-TR-033 | Team member assignment | project_leader | Project exists, user exists | Assign user to task | Error or no assignment | User assigned, assignment notification sent | Playwright E2E | screenshot | P2 |
| PIT-RED-PROJECT-010 | PIT-FR-121, PIT-TR-124 | Project archive | project_leader | Active project | Archive project | Error or not archived | Project archived, excluded from active list | Playwright E2E | screenshot | P2 |
| PIT-RED-PROJECT-011 | PIT-FR-121, PIT-TR-124 | Project restore | project_leader | Archived project | Restore project | Error or not restored | Project restored, visible in active list | Playwright E2E | screenshot | P2 |
| PIT-RED-PROJECT-012 | PIT-FR-121, PIT-TR-124 | Task cancel | project_leader | Active task | Cancel task | Error | Task cancelled, excluded from progress roll-up | Playwright E2E | screenshot | P2 |
| PIT-RED-PROJECT-013 | PIT-FR-114, PIT-TR-117 | Progress roll-up computation | project_leader | 5 tasks (3 done, 2 todo) | View project progress | Incorrect percentage or not calculated | Progress = 60% (3/5 done tasks counted) | Vitest unit test | test output | P1 |
| PIT-RED-PROJECT-014 | PIT-FR-114, PIT-TR-117 | Progress excludes cancelled | project_leader | Mix of done/todo/cancelled tasks | View progress after cancel | Cancelled tasks included in denominator | Cancelled tasks excluded from denominator | Vitest unit test | test output | P1 |
| PIT-RED-PROJECT-015 | PIT-FR-056, PIT-TR-031 | Task dependency | project_leader | Two tasks exist | Set task B depends on task A | No dependency tracked | Dependency saved, B blocked if A incomplete | Playwright E2E | screenshot | P3 |
| PIT-RED-PROJECT-016 | PIT-FR-039, PIT-TR-039 | Circular dependency | project_leader | A depends B | Set B depends on A | Circular dependency accepted | Error: circular dependency detected | Vitest unit test | test output | P2 |

---

## Category 5: Timeline Engine (PIT-RED-TIMELINE)

> See also: `timeline-engine-red-tests.md` for full specification.

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-TIMELINE-001 | PIT-TR-064, PIT-FR-068 | `/projects/:id/timeline` | project_leader | Project with tasks | Load timeline page | 404 or blank | Timeline renders within 500ms | Playwright E2E | screenshot, performance trace | P1 |
| PIT-RED-TIMELINE-002 | PIT-TR-066 | Date-to-pixel math | project_leader | Task with dates | Inspect task bar position | Bar at wrong pixel position | Bar position = (task_start - view_start) / (view_end - view_start) × width | Vitest unit | test output | P1 |
| PIT-RED-TIMELINE-003 | PIT-TR-067 | Drag task bar | project_leader | Task exists in timeline | Drag task bar to new position | No change or error | Task dates updated, audit log created | Playwright E2E | screenshot, HAR | P2 |
| PIT-RED-TIMELINE-004 | PIT-TR-067 | Resize task bar | project_leader | Task in timeline | Resize right edge | Duration not changed | Task end date updated | Playwright E2E | screenshot | P2 |
| PIT-RED-TIMELINE-005 | PIT-TR-064 | Denominator switching | project_leader | Timeline open | Switch from days to weeks view | View does not change | Timeline re-renders with weeks denominator | Playwright E2E | screenshot | P2 |
| PIT-RED-TIMELINE-006 | PIT-FR-070, PIT-TR-064 | Progress overlay | project_leader | Tasks with progress% | View timeline | No progress fill on bars | Progress fill = task.progress_percentage % of bar width | Playwright E2E | screenshot | P2 |
| PIT-RED-TIMELINE-007 | PIT-TR-079 | Virtualisation performance | project_leader | 500 tasks in project | Load timeline | >500ms render, jank | Renders within 500ms, only visible rows in DOM | Playwright E2E | performance trace, screenshot | P2 |
| PIT-RED-TIMELINE-008 | PIT-TR-067, PIT-TR-087 | Keyboard accessibility | keyboard user | Timeline open | Tab to task bar, use arrow keys | Non-interactive via keyboard | Task bars keyboard-accessible, dates adjustable | Playwright E2E + axe | accessibility report | P2 |
| PIT-RED-TIMELINE-009 | PIT-FR-069 | Zoom controls | project_leader | Timeline open | Click zoom in/out | No zoom effect | Timeline zoom changes, tasks remain proportional | Playwright E2E | screenshot | P3 |
| PIT-RED-TIMELINE-010 | PIT-FR-071 | Today line | project_leader | Timeline open | View current date on timeline | No today line | Vertical today line visible at current date | Playwright E2E | screenshot | P3 |
| PIT-RED-TIMELINE-011 | PIT-TR-080 | Visual regression baseline | project_leader | Timeline populated with representative tasks | Capture timeline baseline screenshot | Timeline layout/styles regress without detection | Baseline screenshot matches approved layout and styling | Playwright E2E | visual regression screenshot | P3 |
| PIT-RED-TIMELINE-012 | PIT-FR-068, PIT-TR-065 | Horizontal scroll | project_leader | Timeline wider than viewport | Scroll horizontally through timeline | Timeline cannot scroll horizontally or header/body desynchronise | Horizontal scrolling works and header/grid/task bars remain aligned | Playwright E2E | screenshot | P2 |

---

## Category 6: Evidence Workflow (PIT-RED-EVIDENCE)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-EVIDENCE-001 | PIT-FR-062, PIT-TR-060 | Evidence upload | task_owner | Task exists | Upload evidence file (PDF, <10MB) | Error or no upload | File stored in Supabase bucket, metadata row created | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-EVIDENCE-002 | PIT-TR-061 | Oversized file | task_owner | Task exists | Upload 50MB file | Upload succeeds | Rejected with "file too large" message | Playwright E2E | screenshot | P2 |
| PIT-RED-EVIDENCE-003 | PIT-TR-061 | Invalid file type | task_owner | Task exists | Upload .exe file | Upload succeeds | Rejected with "invalid file type" message | Playwright E2E | screenshot | P2 |
| PIT-RED-EVIDENCE-004 | PIT-FR-063, PIT-TR-059 | Evidence submission notification | task_owner | Evidence uploaded | Submit evidence for review | No notification to reviewer | Reviewer receives notification | Playwright E2E | screenshot, realtime check | P2 |
| PIT-RED-EVIDENCE-005 | PIT-FR-064 | Evidence approval | reviewer | Evidence in pending_review | Approve evidence | Error or status not updated | Evidence status → approved, task completion check runs | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-EVIDENCE-006 | PIT-FR-065 | Evidence return | reviewer | Evidence in pending_review | Return evidence with comment | Error or no comment stored | Evidence returned with comment, submitter notified | Playwright E2E | screenshot | P2 |
| PIT-RED-EVIDENCE-007 | PIT-FR-066, PIT-FR-052 | Task blocked by missing evidence | task_owner | Task requires evidence, none approved | Try to mark task done | Task marked done | Task status blocked until evidence approved | Playwright E2E | screenshot | P1 |
| PIT-RED-EVIDENCE-008 | PIT-TR-062 | File download via signed URL | reviewer | Evidence file exists | Click download | Error or unsigned URL | Signed URL generated, file downloads | Playwright E2E | HAR, network | P2 |
| PIT-RED-EVIDENCE-009 | PIT-TR-085 | Evidence storage access control | viewer (not reviewer) | Evidence file exists | Attempt direct bucket access | File accessible | 403 from storage RLS | Vitest + Supabase | test output | P1 |
| PIT-RED-EVIDENCE-010 | PIT-TR-045 | Evidence RLS denied write | viewer | Logged in | POST to evidence_items | 200 OK | 403 RLS denied | Vitest + Supabase | test output | P1 |

---

## Category 7: Notifications (PIT-RED-NOTIFICATION)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-NOTIFICATION-001 | PIT-FR-022, PIT-TR-056 | Notification bell | authenticated | Logged in, new notification | View app header | No bell or unread count not shown | Bell visible with unread count | Playwright E2E | screenshot | P1 |
| PIT-RED-NOTIFICATION-002 | PIT-FR-023, PIT-TR-056 | Real-time notification | task_owner | Open app | Trigger event in another session | No update until refresh | Bell count updates in real-time via Supabase Realtime | Playwright E2E | screenshot, console | P2 |
| PIT-RED-NOTIFICATION-003 | PIT-FR-115, PIT-TR-118 | Mark as read | authenticated | Unread notifications exist | Click notification | Not marked as read | Notification marked read, count decremented | Playwright E2E | screenshot, HAR | P2 |
| PIT-RED-NOTIFICATION-004 | PIT-FR-116, PIT-TR-119 | Notification history | authenticated | Notifications exist | Navigate to /notifications | 404 or blank | Full notification history displayed | Playwright E2E | screenshot | P2 |
| PIT-RED-NOTIFICATION-005 | PIT-FR-117, PIT-TR-120 | Notification preferences | authenticated | Logged in | Navigate to preferences, disable email | Error or preference not saved | Email preference disabled, no emails sent after | Playwright E2E | screenshot, HAR | P3 |
| PIT-RED-NOTIFICATION-006 | PIT-TR-058 | Notification permission scoping | viewer | Logged in | Receive notification for other user's action | Other user's private notifications visible | Only own notifications visible | Vitest + Supabase | test output | P1 |
| PIT-RED-NOTIFICATION-007 | PIT-TR-056 | Realtime failure state | authenticated | Realtime disconnected | Continue using app | Undefined behaviour | Graceful degradation, notification on reconnect | Playwright E2E | console, screenshot | P3 |

---

## Category 8: Reports (PIT-RED-REPORT)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-REPORT-001 | PIT-FR-080, PIT-TR-068 | Report generation | reporter | Project with data | Request project status report (PDF) | Error or no file | PDF generated, stored in Supabase bucket | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-REPORT-002 | PIT-FR-082, PIT-TR-070 | XLSX generation | reporter | Project with data | Request report in XLSX | Error or wrong format | XLSX file generated correctly | Playwright E2E | downloaded file | P2 |
| PIT-RED-REPORT-003 | PIT-FR-084, PIT-TR-071 | Report history | reporter | Reports previously generated | View report history | 404 or blank | Report history listed with download links | Playwright E2E | screenshot | P2 |
| PIT-RED-REPORT-004 | PIT-FR-118, PIT-TR-121 | Report download | reporter | Report in history | Click download | Error or access denied | Report downloads via signed URL | Playwright E2E | HAR | P2 |
| PIT-RED-REPORT-005 | PIT-FR-118, PIT-TR-121 | Report permission denial | viewer | Logged in | Request report generation | Report generated | PermissionDenied UI shown | Playwright E2E | screenshot | P1 |
| PIT-RED-REPORT-006 | PIT-TR-068 | Report generation failure | reporter | Edge Function unavailable | Request report | Silent failure, no feedback | Error state shown with retry option | Playwright E2E | screenshot | P3 |
| PIT-RED-REPORT-007 | PIT-FR-087, PIT-TR-073 | Report audit event | reporter | Logged in | Generate report | No audit entry | Audit log entry: actor, timestamp, report_type, scope | Vitest + Supabase | test output | P2 |
| PIT-RED-REPORT-008 | PIT-FR-119, PIT-TR-122 | Report history scope | org_admin | Reports from other orgs exist | View history | Cross-org reports visible | Only own-org reports visible | Vitest + Supabase | test output | P1 |

---

## Category 9: Audit Log (PIT-RED-AUDIT)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-AUDIT-001 | PIT-FR-087, PIT-TR-035 | Audit event creation | project_leader | Project exists | Create milestone | No audit entry | Audit entry: actor, action, resource, timestamp, before/after | Vitest + Supabase | test output | P1 |
| PIT-RED-AUDIT-002 | PIT-TR-073 | Append-only audit log | org_admin | Audit entry exists | Attempt to update/delete audit entry | Entry modified/deleted | 403 or DB constraint (append-only) | Vitest + Supabase | test output | P1 |
| PIT-RED-AUDIT-003 | PIT-TR-044 | Audit log cross-org isolation | org_admin | Other org has audit entries | Query audit log | Cross-org entries returned | Only own-org entries returned | Vitest + Supabase | test output | P1 |
| PIT-RED-AUDIT-004 | PIT-FR-087, PIT-TR-044 | cs2_admin global visibility | cs2_admin | Audit entries from multiple orgs | Query audit log | Only own-org entries | All org entries accessible | Vitest + Supabase | test output | P1 |
| PIT-RED-AUDIT-005 | PIT-FR-087, PIT-TR-044 | contributor/viewer denied | viewer | Logged in | Navigate to /admin/audit-log | Audit log visible | PermissionDenied component | Playwright E2E | screenshot | P1 |
| PIT-RED-AUDIT-006 | PIT-TR-074 | Audit log pagination | auditor | >1000 audit entries | Load audit log page | All entries loaded at once (memory crash) | Paginated, 50/page | Playwright E2E | screenshot, performance | P2 |
| PIT-RED-AUDIT-007 | PIT-FR-088, PIT-TR-075 | Audit log CSV export | auditor | Audit entries exist | Export CSV | Error or wrong format | CSV downloaded with correct columns | Playwright E2E | downloaded file | P3 |

---

## Category 10: QA Dashboard (PIT-RED-QA)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-QA-001 | PIT-FR-093, PIT-TR-077, PIT-FR-120 | `/qa-dashboard` | cs2_admin | Logged in as cs2_admin | Navigate to /qa-dashboard | 404 or PermissionDenied | QA Dashboard renders with wave/test data | Playwright E2E | screenshot | P1 |
| PIT-RED-QA-002 | PIT-FR-094, PIT-TR-076 | QA wave evidence | cs2_admin | Wave evidence data exists | View QA dashboard | Empty or no wave data | Wave execution records visible | Playwright E2E | screenshot | P2 |
| PIT-RED-QA-003 | PIT-TR-077, PIT-FR-120 | QA dashboard denied role | org_admin | Logged in | Navigate to /qa-dashboard | QA data visible | PermissionDenied component | Playwright E2E | screenshot | P1 |
| PIT-RED-QA-004 | PIT-TR-046, PIT-FR-093 | QA data isolation | org_admin | Logged in, QA data exists | Inspect network payloads | QA data in response | 403 / empty response (no QA data leakage) | Playwright E2E | HAR, network payload | P1 |
| PIT-RED-QA-005 | PIT-FR-120 | QA empty state | cs2_admin | No wave data | View QA dashboard | Crash or blank | Empty state component with explanation | Playwright E2E | screenshot | P3 |

---

## Category 11: AIMC AI Touchpoints (PIT-RED-AIMC)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-AIMC-001 | PIT-FR-095, PIT-TR-052, PIT-TR-083 | AI task advisor | task_owner | Task exists, AIMC available | Click "Get AI suggestion" | Direct call to OpenAI/Anthropic from frontend | Request routed through AIMC Edge Function only | Playwright E2E | HAR (verify endpoint host) | P1 |
| PIT-RED-AIMC-002 | PIT-TR-083 | No direct provider call | authenticated | Any AIMC feature active | Intercept network requests | Request to openai.com or anthropic.com from browser | No direct provider calls from frontend | Playwright E2E | HAR | P1 |
| PIT-RED-AIMC-003 | PIT-FR-096 | Accept AI suggestion | task_owner | AI suggestion shown | Click "Accept" | No action or suggestion not applied | Suggestion applied, audit log entry created | Playwright E2E | screenshot, HAR | P2 |
| PIT-RED-AIMC-004 | PIT-FR-096 | Dismiss AI suggestion | task_owner | AI suggestion shown | Click "Dismiss" | Nothing happens | Suggestion dismissed, decision logged | Playwright E2E | screenshot | P3 |
| PIT-RED-AIMC-005 | PIT-TR-054 | Human approval required | task_owner | AI suggestion pending | No human action | AI auto-applies suggestion | Suggestion pending human review, not auto-applied | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-AIMC-006 | PIT-TR-090 | AIMC call audit | cs2_admin | AIMC call made | View audit log | No AIMC call entry | Audit entry: actor, capability, input_hash, outcome | Vitest + Supabase | test output | P2 |
| PIT-RED-AIMC-007 | PIT-TR-052 | AIMC unavailable state | task_owner | AIMC Gateway down | Click "Get AI suggestion" | Uncaught error, white screen | Graceful error: "AI suggestions temporarily unavailable" | Playwright E2E | screenshot | P2 |

---

## Category 12: Deployment / Live Verification Readiness (PIT-RED-LFV)

> See also: `live-functional-red-gates.md` for full LFV specification.

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-LFV-001 | LFV-03 §2.1, PIT-TR-114 | Deployed SHA match | automated | App deployed to Vercel | Query `/__git_info` or env var | SHA not exposed or mismatched | Deployed SHA matches expected commit | Playwright E2E | JSON response | P1 |
| PIT-RED-LFV-002 | LFV-03 §3.2, PIT-TR-099 | Vercel bypass access | automated | Vercel protection enabled | Navigate with bypass token | 401 Vercel auth wall | App loads with bypass token | Playwright E2E | screenshot, HAR | P1 |
| PIT-RED-LFV-003 | LFV-05 | Test identity readiness | cs2_admin | Test user accounts required | Attempt login with test identity | Login fails (no test users) | Login succeeds for all 7 test identities | Playwright E2E | screenshot per identity | P1 |
| PIT-RED-LFV-004 | LFV-02 §4 | GitHub Actions secrets | automated | CI workflow configured | Check secrets availability | Secrets unavailable | All required secrets resolvable in workflow | GitHub Actions run | workflow log | P1 |
| PIT-RED-LFV-005 | LFV-01 Journey 1 | Full journey — org_admin | org_admin | Test org created, test user logged in | Complete: login→dashboard→create project→milestone→task→assign | Journey fails at any step | Complete journey executes, all steps GREEN | Playwright E2E | screenshots, HAR, console log | P1 |
| PIT-RED-LFV-006 | LFV-04 §CTA-map | CTA → backend state reflection | org_admin | Project created | Click "Create Milestone" CTA → verify DB row + Supabase channel update | DB row not created or state not reflected | Row in milestones table, Supabase Realtime event emitted | Playwright + Supabase | HAR, DB snapshot | P1 |
| PIT-RED-LFV-007 | LFV-07 §gates | Dashboard state reflection | viewer | Task status changed by owner | View Portfolio Dashboard | Dashboard not updated | Dashboard reflects updated task status after Realtime | Playwright E2E | screenshot before/after | P1 |
| PIT-RED-LFV-008 | LFV-08 §evidence | Screenshot/HAR/trace artifacts | automated | LFV workflow run | Review run artifacts | No artifacts or incomplete | Screenshots, HAR, console log, Playwright trace all captured | GitHub Actions | artifact bundle | P1 |
| PIT-RED-LFV-009 | LFV-09 §3 | CS2 UI acceptance readiness | cs2_admin | LFV workflow completed | CS2 manually reviews UI | No sign-off checklist | CS2 acceptance checklist completeable by Johan Ras | Manual + checklist | signed checklist | P1 |
| PIT-RED-LFV-010 | LFV-08 §gate-8 | No functional pass without evidence | cs2_admin | LFV workflow not run | Attempt to claim FUNCTIONAL_PASS | FUNCTIONAL_PASS claimed | FUNCTIONAL_PASS blocked until LFV artifacts present | Governance gate | PREHANDOVER proof | P1 |

---

## Category 13: Non-Functional Requirements (PIT-RED-NFR)

| RED Test ID | Source | Route/Screen/Domain | Actor/Role | Precondition | Action | Expected Failure (RED) | Expected GREEN Behaviour | Harness/Tool | Evidence Artifact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-NFR-001 | PIT-TR-078, PIT-TR-081 | API response time | authenticated | Production-like load | Execute typical query | >500ms p95 | <200ms p95 Supabase queries, <3s SPA navigation | Lighthouse / k6 | performance report | P2 |
| PIT-RED-NFR-002 | PIT-TR-087, PIT-TR-125, PIT-FR-122 | Accessibility (axe-core) | authenticated | Any post-login page | Run axe-core on page | 1+ violations | Zero axe-core violations on primary pages | Playwright + axe | accessibility report | P1 |
| PIT-RED-NFR-003 | PIT-TR-100 | TypeScript strict compilation | developer | Full codebase | Run `tsc --noEmit` | Compilation errors | Zero TypeScript errors | tsc | CI log | P1 |
| PIT-RED-NFR-004 | PIT-TR-101 | ESLint zero errors | developer | Full codebase | Run `eslint .` | ESLint errors | Zero ESLint errors | eslint | CI log | P1 |
| PIT-RED-NFR-005 | PIT-TR-107 | Bundle size | developer | Production build | Run Vite build | >500KB gzipped | <500KB gzipped initial bundle | Vite build | build output | P2 |
| PIT-RED-NFR-006 | PIT-TR-096 | No secrets in repository | developer | Codebase | Grep for secrets | Secret found in code | No secrets/tokens in any committed file | git-secrets / trufflehog | scan report | P1 |
| PIT-RED-NFR-007 | PIT-TR-104 | No stub tests | developer | Test suite | Grep for expect(true) | Stub tests present | Zero stub/fake tests | grep CI check | CI log | P1 |
| PIT-RED-NFR-008 | PIT-TR-102 | Test coverage gate | developer | Test suite | Run coverage | Coverage <80% | ≥80% line coverage on critical modules | Vitest coverage | coverage report | P2 |

---

## Summary Statistics

| Category | Test Count | P1 Tests | P2 Tests | P3 Tests | P4 Tests |
|---|---|---|---|---|---|
| Route/Screen Rendering (ROUTE) | 28 | 11 | 14 | 3 | 0 |
| Auth/Onboarding (AUTH) | 15 | 5 | 8 | 2 | 0 |
| Role/RLS Negative Paths (RLS) | 13 | 10 | 2 | 1 | 0 |
| Project Hierarchy/Lifecycle (PROJECT) | 16 | 7 | 7 | 2 | 0 |
| Timeline Engine (TIMELINE) | 10 | 2 | 6 | 2 | 0 |
| Evidence Workflow (EVIDENCE) | 10 | 6 | 3 | 1 | 0 |
| Notifications (NOTIFICATION) | 7 | 2 | 4 | 1 | 0 |
| Reports (REPORT) | 8 | 3 | 4 | 1 | 0 |
| Audit Log (AUDIT) | 7 | 5 | 1 | 1 | 0 |
| QA Dashboard (QA) | 5 | 3 | 1 | 1 | 0 |
| AIMC AI Touchpoints (AIMC) | 7 | 3 | 3 | 1 | 0 |
| Live Functional Verification (LFV) | 10 | 10 | 0 | 0 | 0 |
| Non-Functional Requirements (NFR) | 8 | 5 | 3 | 0 | 0 |
| **TOTAL** | **144** | **72** | **56** | **15** | **1** |

**144 RED tests defined.** All tests are in RED state (failing before implementation).
