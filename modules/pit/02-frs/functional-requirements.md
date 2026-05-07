# PIT — Functional Requirements Specification (FRS)

## Stage 3 — Pre-Build Specification Artifact

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Application Name | Project Implementation Tracker |
| Artifact Type | Functional Requirements Specification (FRS — Stage 3) |
| Version | v0.2-hardened |
| Status | Draft — Hardened for CS2 review and approval |
| Approval Status | Pending CS2 approval |
| Derived From (Stage 1) | `docs/governance/PIT_APP_DESCRIPTION.md` v1.0 (CS2 Approved 2026-05-06, ref: maturion-isms#1540) |
| Derived From (Stage 2) | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.2-draft |
| Author | foreman-v2-agent (POLC-Orchestration mode) |
| Date | 2026-05-07 |
| Issue | maturion-isms#1556 (hardening); maturion-isms#1548 (initial draft) |
| Pre-Build Authority | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 |
| Upstream Authority (Stage 2) | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.2-draft — Foreman-reviewed 2026-05-06 (maturion-isms#1548) |
| Hardening Issue | maturion-isms#1556 — 19 hardening areas applied; total FRS requirements 123 |

> **Governance Note:** This document establishes the formal functional requirement baseline
> for all downstream PIT artifacts: TRS (Stage 4), Architecture gate-pass (Stage 5),
> QA-to-Red (Stage 6), PBFAG (Stage 7), and all subsequent stages.
> No downstream stage may derive from anything other than this FRS without explicit
> CS2 authorization.

---

## 0. Document Purpose and Change-Propagation Note

This Functional Requirements Specification (FRS) formalizes the complete set of verifiable
functional requirements for PIT — Project Implementation Tracker, derived from:

1. **Stage 1** — `docs/governance/PIT_APP_DESCRIPTION.md` v1.0 (CS2 Approved, §AD references below)
2. **Stage 2** — `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.2-draft (§UX references below)

### Change-Propagation Obligation

Any conflict discovered between this FRS and Stage 1 (App Description) or Stage 2 (UX Workflow & Wiring Spec) **must be resolved upstream** before any downstream stage (TRS, Architecture, QA-to-Red) proceeds. Changes in upstream stages propagate to this FRS and all downstream artifacts per L-008 and the improvement register at `modules/pit/_readiness/pit-build-process-improvement-register.md`.

### MMM Carry-Forward Controls

PIT inherits eight build-process improvement controls from MMM (L-001 through L-008). These controls are binding on this FRS and all downstream artifacts. See App Description §MMM Lessons Promoted Into PIT and Stage 2 Section 0.2 for the full control definitions.

---

## 1. Derivation Sources, Notation, and Traceability Convention

### 1.1 Reference Notation

| Notation | Source |
|----------|--------|
| `§AD-N` | App Description section N (e.g. `§AD-2` = App Description §2) |
| `§AD-N.M` | App Description sub-section N.M |
| `§UX-J-NN` | UX Wiring Spec Journey NN (e.g. `§UX-J-01`) |
| `§UX-S-NN` | UX Wiring Spec Screen NN |
| `§UX-SEC-N` | UX Wiring Spec Section N (e.g. `§UX-SEC-3` for Section 3 top indicators) |

### 1.2 Requirement ID Convention

Requirements are identified as `PIT-FR-NNN` (three-digit, zero-padded, starting at 001).
Requirements within a functional group share sequential IDs.
Acceptance criteria follow each requirement inline.

### 1.3 Traceability Completeness Statement

All App Description sections (§AD-01 through §AD-24) are traced in this FRS.
All 23 user journeys (§UX-J-01 through §UX-J-23) in the UX Wiring Spec are traced.
All 21 screens (§UX-S-01 through §UX-S-21) are traced.

### 1.4 Functional Persistence Labels and Candidate Entity Naming Caveat

> **Global Naming Caveat**: Table names, entity names, Edge Function names, and storage labels used in this FRS (such as `milestones`, `deliverables`, `tasks`, `notifications`, `audit_log`, `status_logs`, `evidence_items`, `source_links`, `escalation_log`, `task_dependencies`, `integration_configs`) are **functional persistence labels and candidate canonical entities**. Stage 4 TRS must confirm, rename, split, or supersede them. Functional behaviour described in this FRS remains binding even if the technical schema changes. No builder may treat FRS entity names as a substitute for TRS-confirmed schema definitions.

---

## 1.5 Requirement Index by Domain

The requirement series is non-linear because later additions (PIT-FR-106 through PIT-FR-123) were appended after the initial sequence. Requirements are NOT renumbered. Use this index to navigate by domain.

| Domain | Requirement IDs |
|---|---|
| Roles / Permissions | PIT-FR-001–002, PIT-FR-113 |
| Auth / Onboarding | PIT-FR-003–015, PIT-FR-110 |
| Five-State UI / App Shell | PIT-FR-016–021 |
| Notification System | PIT-FR-022–026, PIT-FR-115–117 |
| Portfolio Dashboard | PIT-FR-027–030 |
| Project Creation | PIT-FR-031–035 |
| Implementation Page | PIT-FR-036–045 |
| Project Hierarchy | PIT-FR-046–047 |
| Milestones | PIT-FR-048–050 |
| Deliverables | PIT-FR-051–052 |
| Tasks | PIT-FR-053–057, PIT-FR-114 |
| Assignment / Invitation | PIT-FR-058–061 |
| Evidence | PIT-FR-062–067 |
| Timeline / Gantt | PIT-FR-068–076 |
| Watchdog / Escalation | PIT-FR-077–079 |
| Reports | PIT-FR-080–084, PIT-FR-118–119 |
| Filters / Search | PIT-FR-085–086 |
| Audit Log | PIT-FR-087–089 |
| Admin / Settings | PIT-FR-090–092, PIT-FR-106–109 |
| QA Dashboard | PIT-FR-093–094, PIT-FR-120 |
| AIMC / AI | PIT-FR-095–099 |
| Cross-Module Integration | PIT-FR-100–102 |
| Deployment Surface | PIT-FR-103–105 |
| My Work | PIT-FR-111–112 |
| Lifecycle Removal (Archive/Delete/Restore/Cancel) | PIT-FR-121 |
| Accessibility | PIT-FR-122 |
| Bulk Operations / Import / Templates (Non-Scope) | PIT-FR-123 |
| RAG Threshold Central Table | §RAG-Central (Section 3.1) |
| Permission Negative-Path Contract | PIT-FR-113 |
| Progress Roll-Up Method | PIT-FR-114 |

---

## 2. Scope and Non-Scope

### 2.1 In Scope

The following functional areas are in scope for this FRS and for PIT implementation:

- Public entry and authentication flows (login, signup, invitation, forgot/reset password, onboarding)
- Portfolio Dashboard (cross-project, cross-org roll-up view)
- Implementation Page (primary project execution screen with 7 top indicators)
- Project creation, editing, and management
- Project hierarchy: Milestones → Deliverables → Tasks
- Assignment and invitation management
- Evidence submission, review, and approval
- Timeline / Gantt visualisation with drag-and-drop
- Watchdog / escalation management
- Reports and exports
- Audit log
- QA Dashboard (CS2/admin role)
- Admin / Settings screens
- In-app and email notification system
- AIMC AI advisory touchpoints (task advisor, portfolio risk, escalation recommendation, report summary)
- Cross-module integration intake (from Maturity Roadmap, Risk Management, Incident Management)
- Deployment surface verification

### 2.2 Explicitly Out of Scope (FRS Boundary)

The following are **not** functional requirements in this FRS. They are delegated to later stages:

- Database schema design → Stage 4 TRS
- API technology choice → Stage 4 TRS
- Email provider selection → Stage 4 TRS
- Report generation library selection → Stage 4 TRS
- AIMC Gateway endpoint path confirmation → Stage 4 TRS
- Infrastructure configuration details → Stage 5 Architecture / Stage 7 PBFAG
- Test case specifications → Stage 6 QA-to-Red
- Implementation code → Stage 12 Build

---

## 3. User Roles and Permission Assumptions

*Derived from: §AD-06, §AD-08, §UX-SEC-5.3*

### PIT-FR-001 — Role Hierarchy

The system shall support the following user roles in order of authority:

| Role | Permissions Summary |
|------|---------------------|
| `cs2_admin` | Full system access; QA Dashboard; all admin functions |
| `org_admin` / `pit_admin` | Organisation-wide project management; full admin settings; audit log |
| `project_leader` | Create and manage projects and their full hierarchy; invite members; watchdog |
| `milestone_leader` | Manage milestones and deliverables within their assigned milestone |
| `deliverable_leader` | Manage deliverables and tasks within their assigned deliverable |
| `task_owner` | Own assigned tasks; submit evidence; update task status |
| `reviewer` | Review and approve/return evidence submitted to tasks |
| `reporter` | Generate and download reports |
| `auditor` | Read-only access to audit log |
| `project_creator` | Create new projects; may not manage existing projects outside their scope |
| `viewer` | Read-only access to projects they are a member of |

**Acceptance**: Given a user with role `viewer`, when they attempt to add a milestone, then the system blocks the action and shows the permission-denied state. Role hierarchy enforcement is functionally validated by attempting the action with insufficient permissions and observing the denied outcome (access control implementation deferred to TRS).
**Derived from**: §AD-08, §UX-J-09, §UX-SEC-5.3

### 3.1 Role-Scope Matrix

The following table defines the scope, inheritance, and assignment rules for each role. This matrix is required to prevent ambiguity in cross-org visibility, audit export, QA Dashboard access, admin screens, project membership, and task ownership.

| Role | Scope | Can be inherited? | Can be assigned by | Applies to | Negative-path expectation |
|------|-------|-------------------|--------------------|------------|---------------------------|
| `cs2_admin` | Global (cross-organisation) | No | CS2 only | All organisations, all projects | Access denied to any action not explicitly granted to `cs2_admin` |
| `org_admin` | Organisation-scoped | No | `cs2_admin` | All projects within the organisation | Cannot access other organisations' data; denied cross-org audit except via `cs2_admin` delegation |
| `pit_admin` | Organisation-scoped | No | `org_admin`, `cs2_admin` | All projects within the organisation | Same cross-org restriction as `org_admin` |
| `project_creator` | Organisation-scoped | No | `org_admin`, `pit_admin` | Create new projects; read Portfolio Dashboard | Cannot manage projects they did not create unless also assigned a project-scoped role |
| `project_leader` | Project-scoped | No | `org_admin`, `pit_admin` | All milestones, deliverables, tasks, and team within the project | Cannot access projects they are not assigned to; denied admin screen unless also `pit_admin` |
| `milestone_leader` | Project-scoped (milestone) | No | `project_leader` or above | All deliverables and tasks within assigned milestone | Cannot manage milestones other than their own; denied project settings |
| `deliverable_leader` | Project-scoped (deliverable) | No | `milestone_leader` or above | All tasks within assigned deliverable | Cannot manage deliverables other than their own |
| `task_owner` | Task-scoped | No | `deliverable_leader` or above | The specific assigned task(s) | Cannot modify tasks not assigned to them; cannot approve evidence |
| `reviewer` | Project-scoped | No | `project_leader` or above | Evidence items within the project | Cannot approve evidence outside their project scope; denied admin |
| `reporter` | Organisation-scoped | No | `org_admin`, `pit_admin` | Report generation and download within the organisation | Cannot generate reports for organisations they are not a member of |
| `auditor` | Organisation-scoped | No | `org_admin`, `pit_admin` | Read-only audit log within the organisation | Cannot modify any records; denied all write actions |
| `viewer` | Project-scoped | No | `project_leader` or above | Read-only access to project data | Cannot create, edit, delete, or archive any record; denied evidence submission |

> **TRS Note**: Database-level row-security rules implementing this matrix are deferred to Stage 4 TRS (see PIT-FR-101). The matrix above defines the functional requirement; TRS must confirm the enforcement mechanism.

### PIT-FR-002 — Role-Based Navigation Visibility

The system shall hide (not grey out) navigation items the current user lacks permission to access. Navigating directly to a hidden route via URL shall render the permission-denied state (not a 404).

**Acceptance**: Given a user with role `viewer`, when they navigate directly to `/admin`, then the system shows the permission-denied state, not the admin screen.
**Derived from**: §UX-SEC-5.3, §UX-J-09

### PIT-FR-113 — Permission Negative-Path Contract

The system shall define and enforce denied-action behaviour for every role-gated action group. Denied-action behaviour is required for: create, edit, delete, archive, approve, export, admin, AI advisory, assignment, evidence submission, evidence approval, report generation, and role management actions.

A denied action shall:
- not mutate any data record or state,
- show a permission-denied state or inline denial message appropriate to the context,
- not expose sensitive data from the resource the action targeted,
- create an audit log entry when the denial involves a security-sensitive action (delete, export, admin, evidence approval).

**Acceptance**: QA-to-Red must include at least one insufficient-permission test per protected action group. Given a user with `viewer` role attempting to delete a task, the system shows a permission-denied message and the task record is unchanged; no audit event for the task mutation is created (but the denial attempt is logged).
**Derived from**: §AD-08, §UX-SEC-5.3, PIT-FR-001, role-scope matrix §3.1

---

## 4. Authentication and Onboarding Requirements

*Derived from: §AD-10, §UX-J-01 through §UX-J-10*

### PIT-FR-003 — Authenticated User Landing Redirect

The system shall redirect an authenticated user arriving at the public landing route (`/`) to the Portfolio Dashboard (`/dashboard`) without rendering public CTAs.

**Acceptance**: Given an authenticated session, when the user navigates to `/`, then the user is redirected to `/dashboard` before any public landing page content renders.
**Derived from**: §UX-J-01; §UX-S-01

### PIT-FR-004 — Login Credential Validation

The system shall authenticate users via email and password through the authentication service. On failure, the system shall display an inline error message at the form level. The system shall not disclose whether the failure is due to an unknown email or wrong password.

**Acceptance**: Given invalid credentials, when login is submitted, then an inline error appears without revealing which field is wrong; no redirect occurs.
**Derived from**: §UX-J-02; §UX-S-02

### PIT-FR-005 — Post-Login Redirect to Intended Destination

The system shall redirect a user who was intercepted by a protected-route guard to their originally intended URL after successful login. If no intended URL was stored, the user shall be redirected to `/dashboard`.

**Acceptance**: Given an unauthenticated user navigating to `/projects/123`, when they log in, then they are redirected to `/projects/123`, not `/dashboard`.
**Derived from**: §UX-J-07; §UX-S-02

### PIT-FR-006 — Signup Flow

The system shall allow new users to create an account with email, password, and full name via the authentication service. The system shall send an email verification before granting access.

**Acceptance**: After submitting the signup form, a "Check your email" confirmation state is shown; the user cannot access protected routes until email is verified.
**Derived from**: §UX-J-03; §UX-S-03

### PIT-FR-007 — Invite-Only Signup Configuration

The system shall support an organisation-level setting (`invite_only`) that, when enabled, hides the Sign Up CTA from the landing page and shows an "Invite Only" message on the signup screen.

**Default**: invite-only mode is **off** by default (open signup is the default); individual organisations may enable invite-only mode in Admin settings.

**Acceptance**: Given an organisation with `invite_only = true`, when an unauthenticated user visits `/signup`, then the form is replaced by an "Invite Only — contact your organisation admin" message.
**Derived from**: §UX-J-03 Note; §UX-SEC-10 Open Item 1 (resolved here)

### PIT-FR-008 — Invitation Token Validation and Acceptance

The system shall validate invitation tokens received via URL (`/invite/[token]`) using the `validate_invitation` Edge Function. Expired or invalid tokens shall display an error with an option to request a new invitation.

**Acceptance**: Given an expired invitation token, when the user navigates to `/invite/[token]`, then an error message is shown with a "Request new invitation" option.
**Derived from**: §UX-J-04; §UX-S-20

### PIT-FR-009 — Invitation Acceptance — New User Path

The system shall allow a new user receiving an invitation to set their password during invitation acceptance, creating their account and linking them to the inviting organisation in a single flow.

**Acceptance**: After completing the invitation acceptance form, the user's account is created, they are linked to the organisation, and they are redirected to Onboarding.
**Derived from**: §UX-J-04

### PIT-FR-010 — Invitation Acceptance — Existing User Path

The system shall allow an existing user to accept an invitation by confirming a prompt ("Accept invitation to join [Org Name]") without requiring account creation.

**Acceptance**: An existing authenticated user clicking an invitation link is shown a confirmation prompt; on confirm, they are added to the organisation and redirected to the Portfolio Dashboard.
**Derived from**: §UX-J-04

### PIT-FR-011 — Forgot Password Flow

The system shall allow unauthenticated users to initiate a password reset by entering their email address. The system shall send a reset link via the authentication service. The system shall display a "Check your email" confirmation regardless of whether the email is registered (no enumeration).

**Acceptance**: Whether or not the email exists in the system, the user sees "Check your email" after submission. A reset email is sent only if the email exists.
**Derived from**: §UX-J-05; §UX-S-19

### PIT-FR-012 — Password Reset Flow

The system shall allow users arriving via a valid password reset link to set a new password via the authentication service. On success, the user shall be redirected to the Login screen with a success toast. On token expiry, an error message with a retry link shall be shown.

**Acceptance**: Given a valid reset token, new password is accepted and saved; user redirected to login with success toast. Given an expired token, an error with "Try Again" link is shown.
**Derived from**: §UX-J-06; §UX-S-19

### PIT-FR-013 — Protected Route Guard

The system shall intercept all unauthenticated requests to protected routes, store the intended destination in session storage, and redirect to `/login`. All routes except `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, and `/invite/[token]` are protected.

**Acceptance**: An unauthenticated user navigating to `/projects/123` is redirected to `/login`; after login they are redirected to `/projects/123`.
**Derived from**: §UX-J-07

### PIT-FR-014 — SPA Fallback Route

The deployment infrastructure shall serve `index.html` for all non-asset paths (SPA fallback). If Vercel is the approved deployment target, a `vercel.json` rewrite rule (`{ "source": "/(.*)", "destination": "/index.html" }`) shall be configured to achieve this; for other deployment platforms, an equivalent SPA fallback mechanism shall be used. The deployment target for PIT is not yet formally confirmed.

**Acceptance**: Navigating directly to `/projects/123` in a browser (bypassing client-side routing) renders the correct React component.
**Derived from**: §UX-J-08; §UX-SEC-9

### PIT-FR-015 — Onboarding Flow

The system shall guide new users through a four-step onboarding process: (1) profile setup (name, role, avatar), (2) organisation context display/selection, (3) PIT concept orientation with visual hierarchy diagram, (4) first-action prompt. The orientation step shall be skippable.

**Acceptance**: A new user completing email verification is directed to onboarding; all four steps are navigable; "Skip" skips orientation; completion redirects to Portfolio Dashboard.
**Derived from**: §UX-J-10; §UX-S-04

### PIT-FR-110 — Invitation Acceptance Screen

The system shall display a dedicated Invitation Acceptance screen at `/invite/[token]` with the following states:
- **Validating**: loading/spinner state while the token is validated server-side.
- **New user path**: if the token is valid and the email is not yet registered, a password-creation form is displayed showing the inviting organisation name, inviter name, and assigned role. On submission the user's account is created and they are redirected to Onboarding (see PIT-FR-009).
- **Existing user path**: if the token is valid and the user already has an account, a confirmation prompt is displayed showing the organisation and role. On accept the user is added to the organisation and redirected to the Portfolio Dashboard (see PIT-FR-010).
- **Error state**: if the token is expired or invalid, an error message and "Request new invitation" CTA are displayed.

The screen shall handle all five UI states (loading, error/empty, permission context, network error, valid data) as defined in PIT-FR-016.

**Acceptance**: Given a valid new-user invitation token, the screen shows organisation context and a password-creation form; given a valid existing-user token, a confirmation prompt is shown; given an expired token, an error with retry CTA is shown.
**Derived from**: §UX-J-04; §UX-S-20

---

## 5. Five-State UI Requirements for Every Primary Page

*Derived from: §AD-11, §UX-SEC-4; MMM carry-forward L-003*

### PIT-FR-016 — Universal Five-State UI Contract

The system shall implement all five required UI states on every primary page:

| State | Trigger | Required Behaviour |
|---|---|---|
| **1 — Loading** | Data fetch in progress | Skeleton loaders or spinner in content area; navigation persistent |
| **2 — Empty Data** | Fetch successful, zero records | Illustration/icon, descriptive message, contextual CTA |
| **3 — Permission Denied** | 403 / permission denied | "You don't have permission" message; CTA to safe destination; no sensitive data shown |
| **4 — Network / Server Error** | Network failure or 500 | "Something went wrong" message with retry button; visually distinct from permission-denied |
| **5 — Data** | Fetch successful, data present | Full rendered page with all interactions available |

Permission-denied and network-error states shall be visually distinct from each other.

**Acceptance**: For each primary page, all five states are reachable and render correctly as specified in §UX-SEC-4 screen-by-screen state matrix.
**Derived from**: §UX-SEC-4; L-003

### PIT-FR-017 — App Shell Persistence Across All States

The system shall render the persistent app shell (sidebar navigation, top navigation bar) in all five UI states. The navigation shall never be replaced by a loading spinner. Only the main content area shall show loading, error, or empty states.

**Acceptance**: In the loading state on the Portfolio Dashboard, the sidebar and top nav are visible; the main content area shows skeleton cards.
**Derived from**: §UX-SEC-5.1; L-002

---

## 6. App Shell and Navigation Requirements

*Derived from: §AD-11, §UX-SEC-5*

### PIT-FR-018 — Persistent App Shell Layout

The system shall render a persistent app shell for all authenticated screens consisting of: (a) top navigation bar with PIT logo, organisation switcher, global search, notification bell, and user profile menu; (b) sidebar navigation with role-gated items; (c) main content area.

**Acceptance**: Navigating between any two authenticated screens shows the same sidebar and top nav without full-page reload.
**Derived from**: §UX-SEC-5.1

### PIT-FR-019 — Organisation Switcher

The system shall display an organisation switcher in the top navigation when a user belongs to multiple organisations. Switching organisations shall reload the portfolio dashboard in the selected organisation's context. The switcher shall be hidden for single-organisation users.

**Acceptance**: A multi-org user selecting a different org sees that org's projects in the Portfolio Dashboard.
**Derived from**: §UX-SEC-5.5

### PIT-FR-020 — Global Search

The system shall provide a global search function in the top navigation that searches across projects, tasks, and users within the current organisation context.

**Acceptance**: Searching "budget review" returns matching projects and tasks from the current org.
**Derived from**: §UX-SEC-5.5

### PIT-FR-021 — Breadcrumb Navigation

The system shall display breadcrumbs in the main content area header for all deep-navigation screens (Implementation Page, Milestone Management, Deliverable Management, Task Management, Evidence, Timeline). Each breadcrumb segment shall be a clickable link.

**Acceptance**: On the Task Management page, breadcrumbs show `PIT > [Project Name] > [Milestone] > [Deliverable] > [Task Name]`; clicking `[Project Name]` navigates to the Implementation Page.
**Derived from**: §UX-SEC-5.6

---

## 7. Notification System Requirements

*Derived from: §AD-13, §UX-SEC-5.4*

### PIT-FR-022 — Root-Level Notification Provider

The system shall wrap the entire authenticated application shell in a `NotificationProvider` at the root level. Per-page notification setup is prohibited.

**Acceptance**: Notifications received while on any authenticated page appear in the notification bell without the user navigating away.
**Derived from**: §UX-SEC-5.4; L-002

### PIT-FR-023 — Real-Time In-App Notification Delivery

The system shall deliver in-app notifications via a real-time data subscription mechanism, filtered to the current user's notifications. Notifications shall appear without page reload. (Real-time transport implementation deferred to TRS.)

**Acceptance**: When another user assigns a task to the current user, the notification bell badge updates in real time.
**Derived from**: §UX-SEC-5.4

### PIT-FR-024 — Notification Bell and Drawer

The system shall display a notification bell in the top navigation with a red badge showing the count of unread notifications. Clicking the bell shall open a notification drawer showing the 20 most recent unread notifications with "Mark all read" and "View all" options.

**Acceptance**: Given 5 unread notifications, the bell shows badge "5"; clicking opens the drawer with those 5 notifications.
**Derived from**: §UX-SEC-5.4

### PIT-FR-025 — Notification Types

The system shall generate and deliver notifications for the following events: task assigned, task due warning, task overdue, evidence submitted (to reviewers), evidence approved (to submitter), evidence returned (to submitter), escalation triggered, invitation received, project membership granted, watchdog flag raised.

**Acceptance**: Each listed event produces a notification record in the `notifications` table with `user_id` set to the recipient.
**Derived from**: §UX-SEC-5.4

### PIT-FR-026 — Optional Email Notification Delivery

The system shall support optional email notification delivery for each notification type. Email delivery shall be configurable per notification type in User Preferences.

**Acceptance**: A user disabling "Task Overdue" email notifications does not receive emails for that event but still receives in-app notifications.
**Derived from**: §UX-SEC-5.4

### PIT-FR-115 — Notification Read and Mark-as-Read Behaviour

The system shall support the following read-state management actions for in-app notifications:
- **Mark individual as read**: A user can mark a single notification as read from the notification drawer or notification history list. Marking as read removes it from the unread badge count.
- **Mark all read**: Clicking "Mark all read" marks all current unread notifications as read in a single action. The bell badge resets to zero.
- **Unread persistence**: Unread state persists across sessions. Navigating away from the notification drawer does not automatically mark notifications as read.

**Acceptance**: Given 5 unread notifications, marking one as read reduces the badge to 4. Clicking "Mark all read" reduces the badge to 0. Refreshing the page shows the updated read state.
**Derived from**: §UX-SEC-5.4; maturion-isms#1556 (notification read behaviour)

### PIT-FR-116 — Notification History View

The system shall provide a full notification history page or panel accessible via a "View all" link from the notification drawer. The history view shall:
- display all notifications (read and unread) for the current user in reverse-chronological order,
- retain notifications for a minimum of 90 days from the event date (retention period configurable by admin; default 90 days),
- paginate results server-side (maximum 50 per page),
- show at most one notification per unique event occurrence (duplicate suppression: if the same event triggers multiple notifications to the same user within a configurable de-duplication window, only one notification is created),
- group or de-duplicate repeated notification events of the same type from the same source item within a 24-hour window.

**Acceptance**: A user navigating to the notification history page sees all notifications older than 20 (the drawer limit), paginated. Notifications older than 90 days are not shown.
**Derived from**: §UX-SEC-5.4; maturion-isms#1556 (notification history)

### PIT-FR-117 — Notification Preferences

The system shall provide a Notification Preferences screen in User Settings allowing each user to configure, per notification type:
- whether the event generates an **in-app** notification (on/off; default on for all types),
- whether the event generates an **email** notification (on/off; default on for: task_assigned, evidence_approved, evidence_returned, invitation_received; default off for: all other types).

Notification type preferences are user-scoped and do not affect other users. The default email preference (off except listed types) applies to all users on first access until they configure their preferences.

**Acceptance**: A user disabling in-app notifications for "evidence_submitted" no longer receives in-app notifications for that event type but still receives them for other types. Another user's preferences are not affected. Email notifications respect the per-type preference independently of in-app preference.
**Derived from**: §UX-SEC-5.4; PIT-FR-026; maturion-isms#1556 (notification preferences)

---

## 8. Portfolio Dashboard Requirements

*Derived from: §AD-06, §UX-J-11, §UX-S-05*

### PIT-FR-027 — Portfolio Dashboard Summary Cards

The system shall display top-level summary cards on the Portfolio Dashboard showing: total projects (active / completed / overdue), total open tasks, total overdue tasks, portfolio progress %.

**Acceptance**: Given 10 projects (7 active, 2 completed, 1 overdue), the summary cards show these counts.
**Derived from**: §UX-S-05

### PIT-FR-028 — Project List with RAG Status

The system shall display a project list or grid on the Portfolio Dashboard. Each project card shall show: project name, project leader, progress %, RAG status (green/amber/red), milestone count, and due date.

**Acceptance**: A project with 80% time elapsed and 50% actual progress shows an amber RAG indicator.
**Derived from**: §UX-S-05

### PIT-FR-029 — Portfolio Dashboard Filtering

The system shall provide a filter bar on the Portfolio Dashboard allowing filtering by: organisation/division/department, project type (Project/Operational/Improvement), project status, and date range.

**Acceptance**: Filtering by "Division: Finance" shows only projects belonging to that division.
**Derived from**: §UX-S-05

### PIT-FR-030 — Watchdog Alert Banner on Portfolio Dashboard

The system shall display a watchdog alert banner on the Portfolio Dashboard when any active escalations exist. The banner shall link to the Watchdog Dashboard.

**Acceptance**: Given 3 active escalations, the banner reads "3 items require attention" with a link to `/watchdog`.
**Derived from**: §UX-S-05

---

## 9. Project Creation Requirements

*Derived from: §AD-07, §UX-J-11, §UX-S-07*

### PIT-FR-031 — Project Creation Modal / Wizard

The system shall provide a multi-step project creation wizard with four steps: (1) Core Details (name, type, description, project leader, org/division/department), (2) Timeline (start date, end date, quick-win type), (3) Source Link (optional link to Risk/Audit/Incident/Roadmap item or Manual), (4) Cost (CAPEX, OPEX, fiscal year — all optional). A review screen shall appear before final submission.

**Acceptance**: A user can create a project by completing all four wizard steps; the project appears in the Portfolio Dashboard immediately on success.
**Derived from**: §UX-J-11; §UX-S-07

### PIT-FR-032 — Project Type Classification

The system shall classify projects as one of three types: Project, Operational Stream, or Improvement. The type shall be required at creation and editable by `project_leader` or above.

**Acceptance**: Creating a project without selecting a type shows a validation error.
**Derived from**: §UX-S-07

### PIT-FR-033 — Quick-Win Type Classification

The system shall classify projects as one of three quick-win types: Quick Win, Medium Term, or Long Term. This classification shall be set at project creation and used in Portfolio Dashboard filtering.

**Acceptance**: Filtering the Portfolio Dashboard by "Quick Win" shows only projects with that classification.
**Derived from**: §UX-S-07

### PIT-FR-034 — Source Link for Projects

The system shall support linking a project to an originating source item from: Risk Management (risk ID), Audit Finding, Incident Management, Maturity Roadmap item, or Manual (no source). The source link is optional at creation.

**Acceptance**: A project linked to Risk #R-004 shows "Source: Risk R-004" on the project detail screen.
**Derived from**: §UX-J-11; §AD-15

### PIT-FR-035 — Project CAPEX/OPEX Tracking

The system shall capture optional CAPEX amount, OPEX amount, and fiscal year at project creation. These values shall be displayed on the Implementation Page and included in financial reports.

**Acceptance**: A project with CAPEX = R50,000 and OPEX = R20,000 shows these figures on the Implementation Page and in the CAPEX/OPEX Summary report.
**Derived from**: §UX-J-11; §UX-S-07

---

## 10. Implementation Page Requirements

*Derived from: §AD-07, §UX-J-11, §UX-S-06, §UX-SEC-3*

### PIT-FR-036 — Implementation Page as Primary Execution Screen

The system shall provide an Implementation Page (`/projects/[id]`) as the primary execution screen for each project, displaying: (a) project header with name and edit controls, (b) top-of-page indicator row (7 indicators — see PIT-FR-037 through PIT-FR-043), (c) collapsible/expandable project hierarchy (Milestones → Deliverables → Tasks), (d) inline add controls at each hierarchy level, (e) row-level quick actions (edit, complete, add evidence, assign, delete — role-dependent).

**Acceptance**: Loading a project with 3 milestones, 6 deliverables, and 12 tasks renders all three hierarchy levels with the indicator row populated.
**Derived from**: §UX-S-06

### PIT-FR-037 — Indicator 1: Project Duration with Visual Progress

The system shall display the project's start and end date with a horizontal progress bar showing elapsed days / total days. The display format shall be: "DD MMM YYYY → DD MMM YYYY | [progress bar] | X% time elapsed". RAG logic: amber if time elapsed > overall progress + 15%; red if time elapsed > overall progress + 25%.

**Acceptance**: A project 60% through its timeline with 45% actual progress shows an amber progress bar.
**Derived from**: §UX-SEC-3, Indicator 1

### PIT-FR-038 — Indicator 2: Milestone Count

The system shall display milestone count in "X / Y completed / total" format. A red or amber badge shall appear if any milestone is overdue.

**Acceptance**: A project with 2 completed milestones out of 5 total, one of which is overdue, shows "2 / 5" with an amber/red badge.
**Derived from**: §UX-SEC-3, Indicator 2

### PIT-FR-039 — Indicator 3: Deliverable Count

The system shall display deliverable count in "X / Y completed / total" format with RAG logic matching Indicator 2.

**Acceptance**: A project with all deliverables on-track shows a neutral badge; any overdue deliverable triggers amber/red.
**Derived from**: §UX-SEC-3, Indicator 3

### PIT-FR-040 — Indicator 4: Task Count with Overdue Sub-Count

The system shall display task count as "X / Y (Z overdue)" — completed / total with overdue count. The overdue count shall display as a red chip when > 0. RAG: overdue > 10% of total = red.

**Acceptance**: A project with 2 overdue tasks out of 20 total shows "5 / 20 (2 overdue)" with a red chip.
**Derived from**: §UX-SEC-3, Indicator 4

### PIT-FR-041 — Indicator 5: Team Member Count with Avatar Row

The system shall display the count of distinct team members for the project. Up to 5 member avatars shall be shown; if more, "+N more" overflow label appears.

**Acceptance**: A project with 8 members shows 5 avatars and "+3 more".
**Derived from**: §UX-SEC-3, Indicator 5

### PIT-FR-042 — Indicator 6: Progress Against Plan %

The system shall display planned progress % vs. actual progress % with a delta indicator (▲ ahead / ▼ behind). Planned % is calculated from elapsed days / total project days. RAG: delta < −5% = amber; delta < −15% = red.

**Acceptance**: A project with 50% planned and 35% actual progress shows "Planned: 50% | Actual: 35% ▼ −15%" in red.
**Derived from**: §UX-SEC-3, Indicator 6

### PIT-FR-043 — Indicator 7: Overall Progress %

The system shall display overall progress % as a weighted roll-up: task progress → deliverable progress → milestone progress → project progress. A circular progress ring or large percentage badge shall be used. RAG: < 25% with > 25% time elapsed = amber; < 50% with > 75% time elapsed = red.

**Acceptance**: A project at 70% overall progress renders a circular ring at 70% fill.
**Derived from**: §UX-SEC-3, Indicator 7

### PIT-FR-044 — Implementation Page Status Colour Coding

The system shall colour-code hierarchy rows by status: on-track (green), at-risk (amber), overdue (red), complete (grey/muted).

**Acceptance**: An overdue task row shows a red background or left-border indicator; a completed task shows grey.
**Derived from**: §UX-S-06

### PIT-FR-045 — Implementation Page View Toggle

The system shall provide a view toggle on the Implementation Page: hierarchy view (default), flat task list view, and a link to the Timeline page.

**Acceptance**: Switching to flat list view shows all tasks across all milestones and deliverables in a single table.
**Derived from**: §UX-S-06

---

## 11. Project Hierarchy Requirements

*Derived from: §AD-07, §UX-SEC-2, §UX-J-12 through §UX-J-14*

### PIT-FR-046 — Project Hierarchy Structure

The system shall organise work items in a four-level hierarchy: Project → Milestone → Deliverable → Task. Every task must belong to a deliverable; every deliverable must belong to a milestone; every milestone must belong to a project.

**Acceptance**: Attempting to add a task directly under a project (without a parent deliverable) is not permitted by the data model (TRS will specify the constraint; this is the functional requirement).
**Derived from**: §AD-07; §UX-S-06

### PIT-FR-047 — Task Cluster Templates

The system shall support Task Cluster Templates — reusable sets of pre-defined sub-tasks that can be applied when creating a task. When a template is applied, sub-tasks are created automatically under the parent task.

The template schema must support: template name, template description, list of sub-task definitions (name, default owner role, default due-date offset from parent task due date), version control for templates.

**Acceptance**: Applying "Procurement Cluster Template" to a task creates 4 sub-tasks (Request Quote, Evaluate Quotes, Purchase Order, Goods Receipt) with correct names and due-date offsets.
**Derived from**: §UX-J-14; §UX-SEC-10 Open Item 7 (resolved here); §UX-S-18

---

## 12. Milestone Requirements

*Derived from: §AD-07, §UX-J-12, §UX-S-09*

### PIT-FR-048 — Milestone Creation

The system shall allow users with `project_leader` role or above to create milestones within a project. Required fields: name, start date, end date, milestone leader. Optional: description.

**Acceptance**: Creating a milestone with all required fields inserts a row in the `milestones` table and the milestone appears in the Implementation Page hierarchy immediately.
**Derived from**: §UX-J-12; §UX-S-09

### PIT-FR-049 — Milestone Date Constraints

The system shall enforce: milestone start date ≥ project start date; milestone end date ≤ project end date (warning shown if violated; hard block not required at creation time but flagged by watchdog).

**Acceptance**: Setting a milestone end date beyond the project end date shows a warning banner; the milestone can still be created but the watchdog flags it.
**Derived from**: §UX-SEC-6.1

### PIT-FR-050 — Milestone Cascade on Date Change

When a milestone end date is extended, the system shall check for deliverables that would exceed the new end date and prompt the user to auto-extend them or resolve conflicts manually.

**Acceptance**: Extending a milestone by 2 weeks when 2 deliverables already end on the old end date prompts "Do you want to auto-extend 2 deliverables?".
**Derived from**: §UX-SEC-6.2

---

## 13. Deliverable Requirements

*Derived from: §AD-07, §UX-J-13, §UX-S-10*

### PIT-FR-051 — Deliverable Creation

The system shall allow users with `milestone_leader` role or above to create deliverables under a milestone. Required fields: name, deliverable leader, milestone parent. Optional: description, evidence required flag.

**Acceptance**: Creating a deliverable with all required fields inserts a row in the `deliverables` table and the deliverable appears under its milestone immediately.
**Derived from**: §UX-J-13; §UX-S-10

### PIT-FR-052 — Deliverable Evidence Requirement Flag

The system shall support an `evidence_required` flag on deliverables. Evidence linkage is supported at both task level and deliverable level.

When the flag is set, a deliverable **cannot** be marked complete unless **one of the following conditions** is met:

- **Task-level evidence path**: All child tasks for which `evidence_required = true` each have at least one evidence item with status `approved`; **and** no such task has an unapproved or missing evidence item, OR
- **Deliverable-level evidence path**: An approved evidence item is explicitly linked at the deliverable level (not at a child task), satisfying the deliverable's evidence requirement directly.

A deliverable with `evidence_required = true` where only *some* evidence-required child tasks have approved evidence (and others do not) **cannot** be marked complete unless the deliverable-level evidence path is used.

**Acceptance**: (a) A deliverable with `evidence_required = true`, two child tasks with `evidence_required = true`, and only one of those tasks having an approved evidence item cannot be set to `completed`. (b) A deliverable with `evidence_required = true` where all `evidence_required` child tasks have approved evidence can be set to `completed`. (c) A deliverable with `evidence_required = true` where no child tasks have `evidence_required = true` but a deliverable-level approved evidence item exists can be set to `completed`.
**Derived from**: §UX-J-13; §UX-S-10; maturion-isms#1556 (evidence completion clarification)

---

## 14. Task Requirements

*Derived from: §AD-07, §UX-J-14, §UX-S-11*

### PIT-FR-053 — Task Creation

The system shall allow users with `deliverable_leader` role or above to create tasks under a deliverable. Required fields: name, task owner, due date. Optional: description, start date, priority, evidence required flag, CAPEX/OPEX amounts, task cluster template.

**Acceptance**: Creating a task inserts a row in the `tasks` table; if a task owner different from the creator is selected, the owner receives a task-assigned notification.
**Derived from**: §UX-J-14; §UX-S-11

### PIT-FR-054 — Task Status Lifecycle

The system shall support the following task status values: `not_started`, `upcoming`, `active`, `in_progress`, `completed`, `overdue`, `blocked`, `cancelled`. Status transitions shall be logged in a `status_logs` table.

A task may be **cancelled** by a user with `deliverable_leader` role or above. When a task is cancelled:
- it is excluded from progress roll-up calculations (it does not count as 0% progress),
- it is excluded from watchdog overdue detection,
- any `evidence_required` requirement on the task is considered void for deliverable completion purposes,
- a `status_log` entry is created with the cancellation actor, timestamp, and a mandatory cancellation reason.

A `completed` task cannot be set to `overdue` by the system (it remains `completed`). A `cancelled` task cannot be set to `overdue` or `completed` by normal user action; cancellation may be reversed to `not_started` by a user with `deliverable_leader` role or above, with an audit entry.

**Acceptance**: (a) Changing a task from `in_progress` to `completed` creates a `status_log` entry with timestamp and actor. (b) A task cancelled by a `deliverable_leader` is excluded from the project's progress calculation. (c) A cancelled task does not appear in the watchdog overdue list. (d) Reversing a cancellation requires `deliverable_leader` role or above and creates an audit entry.
**Derived from**: §UX-S-11; maturion-isms#1556 (lifecycle consistency with PIT-FR-077)

### PIT-FR-055 — Task Progress Percentage

The system shall allow the task owner to set a progress percentage (0–100%) on each task. Progress % shall contribute to the deliverable-level and milestone-level roll-up calculations for Indicators 6 and 7.

**Acceptance**: Setting task progress to 75% updates the Implementation Page Indicator 7 (overall progress) in real time or on next load.
**Derived from**: §UX-S-11; §UX-SEC-3, Indicator 7

### PIT-FR-056 — Task Dependency Management

The system shall support task-to-task dependencies (Task A cannot start before Task B is complete). Dependencies shall be stored in a `task_dependencies` table and rendered as arrow connections on the Gantt chart when dependency display is enabled.

Circular dependency detection is required: if Task A depends on Task B and Task B depends on Task A, the system shall reject the dependency creation with a clear error.

**Acceptance**: Attempting to create a circular dependency shows an error "Circular dependency detected"; no record is created.
**Derived from**: §UX-SEC-6.3; §UX-SEC-6.5; §UX-SEC-10 Open Item 2 (resolved here)

### PIT-FR-057 — Blocked Task UI

When a task has an unmet dependency, the system shall display a "Blocked" status indicator on the task row in the Implementation Page and Task Management Page. The blocking dependency shall be shown in the task detail.

**Acceptance**: Task B blocked by incomplete Task A shows status `blocked` and "Blocked by: Task A" in the detail panel.
**Derived from**: §UX-SEC-10 Open Item 2 (resolved here)

### PIT-FR-114 — Progress Roll-Up Method

The system shall calculate roll-up progress from child items using **equal weighting by default**. The roll-up chain is: task progress % → deliverable progress % → milestone progress % → project progress %.

- **Equal weighting (default)**: Each child item contributes equally to the parent's progress percentage. The parent's progress is the arithmetic mean of all non-cancelled child item progress percentages.
- **Excluded items**: Cancelled tasks (status `cancelled`) are excluded from the roll-up denominator and numerator. Completed tasks contribute 100% to the calculation.
- **Manual weights (future)**: If manual weights are introduced by TRS, the weights for all non-cancelled children under a parent must total 100%. Incomplete or invalid weights (e.g., total ≠ 100%, negative values) cause the system to revert to equal weighting for that parent and display a validation warning.

**Acceptance**: (a) Given three child tasks at 0%, 50%, and 100% with no manual weights, the parent deliverable progress is 50%. (b) Given three child tasks where one is `cancelled`, at 0% and 100%, the parent deliverable progress is 50% (two non-cancelled items, mean of 0% and 100%). (c) Given a project with two milestones at 40% and 60%, the project progress is 50%.
**Derived from**: §UX-SEC-3, Indicator 7; PIT-FR-055; maturion-isms#1556 (progress roll-up method)

---

## 15. Assignment and Invitation Requirements

*Derived from: §AD-08, §UX-J-15, §UX-S-12*

### PIT-FR-058 — Team Member Assignment via Person-Picker

The system shall provide a person-picker component that allows assignment of owners/responsible persons to projects, milestones, deliverables, and tasks. The picker shall search users filtered by organisation membership.

**Acceptance**: Typing "John" in the person-picker shows matching users who are members of the current organisation.
**Derived from**: §UX-J-15; §UX-S-12

### PIT-FR-059 — Invitation from Person-Picker

The system shall allow users to send invitations to email addresses not yet in the system directly from the person-picker component during assignment flows. The invitation flow is the same as Journey 4.

**Acceptance**: Entering an unknown email in the person-picker offers "Invite [email] to PIT" option; selecting it sends an invitation.
**Derived from**: §UX-J-15; §UX-S-12

### PIT-FR-060 — Assignment Notification

When a user is assigned as owner of a task, milestone, or deliverable, they shall receive an in-app notification (and optional email notification, per user preferences).

**Acceptance**: Assigning a new task owner creates a `notifications` record with type `task_assigned` for the assignee.
**Derived from**: §UX-J-15

### PIT-FR-061 — Team Member Role Assignment

The system shall allow `project_leader` or above to assign roles to team members within a project: Project Leader, Milestone Leader, Deliverable Leader, Task Owner, Reviewer, Viewer. Roles are project-scoped.

**Acceptance**: Assigning a team member the "Reviewer" role grants them evidence review access for all tasks in the project.
**Derived from**: §UX-S-12

---

## 16. Evidence Submission and Review Requirements

*Derived from: §AD-09, §UX-J-16, §UX-J-17, §UX-S-13*

### PIT-FR-062 — Evidence Upload

The system shall allow `task_owner` users to upload evidence files (local file selection or drag-and-drop) or submit a URL/note as evidence for a task. Files shall be uploaded to the configured file storage service (storage provider and bucket configuration deferred to TRS). A row shall be inserted into the `evidence_items` table linking to the task.

**Acceptance**: Uploading a PDF to a task inserts a record in `evidence_items` with `status = pending` and stores the file in the configured file storage service.
**Derived from**: §UX-J-16; §UX-S-13

### PIT-FR-063 — Evidence Submission Notification to Reviewers

After evidence is submitted, all users with the `reviewer` role for the task (or project) shall receive an in-app notification.

**Acceptance**: Submitting evidence creates a `notifications` record for each reviewer.
**Derived from**: §UX-J-16

### PIT-FR-064 — Evidence Approval

The system shall allow users with `reviewer` role or above to approve evidence items. Approving an item shall set `evidence_items.status = approved`, add an audit log entry, and notify the task owner.

**Acceptance**: A reviewer clicking "Approve" on an evidence item updates its status and sends a notification to the task owner.
**Derived from**: §UX-J-17; §UX-S-13

### PIT-FR-065 — Evidence Return for Revision

The system shall allow reviewers to return evidence items for revision with a mandatory comment. Returning shall set `evidence_items.status = returned` and notify the task owner with the comment.

**Acceptance**: A reviewer returning evidence must provide a comment; the task owner receives a notification with the comment text.
**Derived from**: §UX-J-17; §UX-S-13

### PIT-FR-066 — Evidence Auto-Advance on Completion

When an evidence requirement is met (at least one approved evidence item linked to a task with `evidence_required = true`), the system shall allow the task status to advance to `completed` without additional manual status update (auto-advance or at minimum remove the evidence blocker).

**Acceptance**: After evidence is approved for a task with `evidence_required = true`, the task's evidence block is removed; the task owner can now set the task to `completed`.
**Derived from**: §UX-J-16

### PIT-FR-067 — Evidence File Preview

The system shall provide inline preview for evidence items of type image (JPG, PNG, GIF) and PDF. Other file types shall show a download link only.

**Acceptance**: Opening an evidence item that is a PDF shows an inline PDF viewer; opening a .docx shows a download link.
**Derived from**: §UX-S-13

---

## 17. Timeline / Gantt Requirements

*Derived from: §AD-07, §UX-J-18, §UX-S-08, §UX-SEC-6*

### PIT-FR-068 — Gantt Chart Rendering

The system shall render a Gantt chart on the Timeline page (`/projects/[id]/timeline`) showing all milestones and deliverables for the project as horizontal date-axis bars. Milestones shall be rendered as thicker bars with a diamond end marker; deliverables as narrower, indented bars.

**Acceptance**: A project with 3 milestones and 8 deliverables shows 11 bars on the Gantt, with milestones visually distinct from deliverables.
**Derived from**: §UX-J-18; §UX-S-08; §UX-SEC-6.3

### PIT-FR-069 — Gantt Zoom Controls

The system shall provide timeline zoom/view controls: day, week, month, quarter, year.

**Acceptance**: Switching to "quarter" view shows the entire year on screen at once; switching to "week" shows two weeks.
**Derived from**: §UX-S-08

### PIT-FR-070 — Gantt Progress Fill

The system shall show progress fill within each Gantt bar representing the completion percentage of that milestone or deliverable.

**Acceptance**: A deliverable at 60% completion shows a 60% filled bar.
**Derived from**: §UX-S-08

### PIT-FR-071 — Today Line

The system shall render a vertical "today" line on the Gantt chart at the current date, using a red dashed style.

**Acceptance**: The today line appears at today's date; it moves forward as the date advances.
**Derived from**: §UX-SEC-6.3

### PIT-FR-072 — Drag-and-Drop Date Adjustment

The system shall allow users with `project_leader` or `milestone_leader` roles to drag Gantt bars to adjust start and end dates. Dragging the body of a bar moves it (shifting both start and end by the same delta). Dragging the right edge resizes the end date. Dragging the left edge resizes the start date.

After drag, a confirmation dialog shall show new dates and cascade implications. Drag operations shall be undoable within the current session (Ctrl+Z / Cmd+Z).

**Acceptance**: Dragging a milestone bar 7 days to the right updates both start and end dates by 7 days after user confirms the dialog.
**Derived from**: §UX-J-18; §UX-SEC-6.4

### PIT-FR-073 — Cascade on Milestone Date Change

When a milestone date is updated via drag or form, the system shall check for dependent deliverables that would now exceed the new milestone end date. A modal shall prompt the user to auto-extend affected deliverables or resolve manually.

**Acceptance**: Shortening a milestone by 5 days when 2 deliverables end within those 5 days shows a conflict resolution modal.
**Derived from**: §UX-SEC-6.2; §UX-J-18

### PIT-FR-074 — Conflict Detection and Indicators

The system shall display conflict indicators (amber/red visual marker) on Gantt bars where: deliverable end date > parent milestone end date, or task due date > parent deliverable end date. Circular dependencies in task chains shall be flagged with an error (hard conflict).

**Acceptance**: A deliverable ending after its milestone shows an amber conflict marker on the Gantt bar.
**Derived from**: §UX-SEC-6.5

### PIT-FR-075 — Date Format Standards

The system shall display all dates in `DD MMM YYYY` format (e.g., "06 May 2026") in the UI. All dates shall be stored in ISO 8601 date-only format (`YYYY-MM-DD`). All dates are date-only (no time component) to avoid timezone complications; the organisation's configured timezone applies for display.

**Acceptance**: The date "2026-05-06" stored in the database renders as "06 May 2026" in the UI.
**Derived from**: §UX-SEC-6.6

### PIT-FR-076 — Task Bar Optional Overlay

The system shall provide a toggle on the Timeline page to show or hide task bars on the Gantt chart. Task bars shall be hidden by default for readability.

**Acceptance**: Enabling "Show tasks on Gantt" renders task bars nested under their deliverable bars.
**Derived from**: §UX-SEC-6.3

---

## 18. Watchdog / Escalation Requirements

*Derived from: §AD-12, §UX-J-19, §UX-S-14*

### PIT-FR-077 — Watchdog Engine

The system shall run a watchdog evaluation process that flags items meeting at least one of the following conditions: task is overdue (due_date < today and status ∉ {completed, cancelled}), milestone or deliverable is stalled (no progress update in configured time window), evidence submission is overdue (evidence_required = true and no approved evidence past a configurable threshold date).

Tasks with status `cancelled` are explicitly excluded from watchdog overdue detection (see PIT-FR-054).

**Acceptance**: A task with due_date = yesterday and status = in_progress is flagged by the watchdog. A task with due_date = yesterday and status = `cancelled` is NOT flagged by the watchdog.
**Derived from**: §AD-12; §UX-J-19; PIT-FR-054 (cancelled task exclusion)

### PIT-FR-078 — Watchdog Dashboard Display

The system shall display all flagged items on the Watchdog Dashboard with: summary counts (total flagged red, at-risk amber, escalated today), filter controls (by project, owner, type, severity), and a flagged item list (item name, type, project, owner, days overdue, escalation count).

**Acceptance**: A project leader with 5 flagged items sees all 5 listed; filtering by type "overdue task" narrows to overdue tasks only.
**Derived from**: §UX-S-14

### PIT-FR-079 — Escalation Actions

The system shall support the following actions on flagged items: Escalate (trigger notification to project leader or org admin and create an escalation log entry), Reassign (change ownership), Extend Deadline (with required override justification), Acknowledge (snooze with mandatory note).

All actions shall be logged in `escalation_log` and `audit_log`.

**Acceptance**: Selecting "Escalate" on a flagged task creates an `escalation_log` record and sends a notification to the project leader; a toast confirmation appears.
**Derived from**: §UX-J-19; §UX-S-14

---

## 19. Reports and Exports Requirements

*Derived from: §AD-13, §UX-J-20, §UX-S-15*

### PIT-FR-080 — Report Types

The system shall support the following report types: Project Status Report, Portfolio Summary, Task Completion Report, Audit Trail Extract, CAPEX/OPEX Summary.

**Acceptance**: The Reports screen shows all five report types in the type selector.
**Derived from**: §UX-J-20; §UX-S-15

### PIT-FR-081 — Report Scope Selection

The system shall allow users to scope reports by: organisation, division, department, specific project, and date range.

**Acceptance**: Generating a Task Completion Report scoped to "Division: Finance, Q1 2026" returns only matching records.
**Derived from**: §UX-J-20

### PIT-FR-082 — Report Output Formats

The system shall support report download in PDF, Excel (XLSX), and CSV formats.

**Acceptance**: Generating a report in PDF format produces a downloadable `.pdf` file; XLSX produces an `.xlsx` file.
**Derived from**: §UX-J-20; §UX-S-15

### PIT-FR-083 — Server-Side Report Generation

The system shall generate reports server-side via the `generate_report` Edge Function. Large datasets shall be streamed or paged to avoid timeout. Report generation shall be logged in `audit_log`.

**Acceptance**: Generating a Portfolio Summary for 200 projects completes without timeout and produces a valid download.
**Derived from**: §UX-J-20

### PIT-FR-084 — Report History

The system shall store all generated reports in the configured file storage service and display a report history list on the Reports screen. Report history is **mandatory** (not optional — see §PIT-FR-119 for scope definition). Each history entry shall include: report type, scope parameters, generated-by user, generation timestamp, download link, and expiry date (if applicable).

**Acceptance**: After generating a report, it appears in the "Previous Reports" list with a download button, report type label, scope summary, and generation timestamp.
**Derived from**: §UX-S-15; maturion-isms#1556 (report history mandatory)

### PIT-FR-118 — Report Generation Permissions and States

The system shall enforce the following report generation permissions and UI states:

**Generation permissions** (who may generate each report type):
- Project Status Report: `project_leader` or above within the project scope; `org_admin`, `pit_admin`, `reporter`, `cs2_admin` for org-wide scope
- Portfolio Summary: `org_admin`, `pit_admin`, `reporter`, `cs2_admin`
- Task Completion Report: same as Portfolio Summary
- Audit Trail Extract: `auditor`, `org_admin`, `cs2_admin` only
- CAPEX/OPEX Summary: `org_admin`, `pit_admin`, `reporter`, `cs2_admin`

**UI states for report generation**:
- **Loading state**: After clicking "Generate", a loading indicator is shown; the generate button is disabled to prevent duplicate submissions.
- **Long-running state**: If report generation exceeds 5 seconds, a "This report is being prepared — you will be notified when it is ready" status message is shown. The user may navigate away; a notification is sent on completion.
- **Failure state**: If generation fails (server error, timeout, or storage failure), an error message is shown with a "Try again" option. The failed attempt is logged but not stored in report history.
- **Success state**: Download link is shown immediately (or via notification for long-running reports).

**Export access control**: A report download link shall expire after a configurable period (default: 24 hours). Only the user who generated the report, plus `org_admin` and `cs2_admin`, may download the report via the history list.

**Acceptance**: (a) A user with `viewer` role attempting to generate a Portfolio Summary sees the permission-denied state. (b) A report generation that takes 8 seconds shows the "being prepared" state; the user receives a notification when the link is ready. (c) A failed report generation shows an error message and the failed attempt does not appear in report history.
**Derived from**: §UX-J-20; §UX-S-15; maturion-isms#1556 (report permissions and states)

### PIT-FR-119 — Report History Scope

Report history scope is **per-user within organisation context** (not global or cross-user). Each user sees only reports they generated, plus reports generated by `cs2_admin` that are explicitly shared.

Report history shall:
- retain reports for a minimum of 30 days (default; configurable by admin),
- display reports across all projects the user has access to (no single-project scope restriction on the history list),
- allow `org_admin` and `cs2_admin` to view all reports generated within their organisation (not per-user restricted),
- not expose `cs2_admin`-only reports (e.g., cross-org audit extracts) to `org_admin` unless explicitly shared.

**Acceptance**: User A sees only their own generated reports in the history list. The `org_admin` sees all reports generated by all users in the organisation. A cross-org audit extract generated by `cs2_admin` is not visible to `org_admin` by default.
**Derived from**: §UX-S-15; maturion-isms#1556 (report history scope)

---

## 20. Filter, Search, and Drill-Down Requirements

*Derived from: §UX-S-05, §UX-S-06, §UX-S-11, §UX-S-16*

### PIT-FR-085 — Implementation Page Filter Bar

The system shall provide a filter bar on the Implementation Page allowing filtering of the hierarchy by: status (not_started, active, overdue, completed), owner (team member), date range (due date), task type (standard task or task cluster).

**Acceptance**: Filtering by owner "Alice" shows only milestones, deliverables, and tasks assigned to Alice.
**Derived from**: §UX-S-06

### PIT-FR-086 — Audit Log Search and Filter

The system shall provide the Audit Log with filter controls: action type, actor (user), project, resource type, date range, and a keyword search.

**Acceptance**: Filtering the audit log by actor "Bob" and action type "task_status_updated" returns only Bob's status update events.
**Derived from**: §UX-S-16

---

## 21. Audit Log / Activity Feed Requirements

*Derived from: §AD-14, §UX-J-21, §UX-S-16*

### PIT-FR-087 — Comprehensive Audit Log

The system shall maintain a tamper-evident audit log in the `audit_log` table capturing all significant system events with: timestamp, actor (user ID), action type, resource type, resource ID, old value (where applicable), new value (where applicable), IP address.

**Acceptance**: Every action listed in the §UX-SEC-7 wiring table that specifies an audit event creates a corresponding `audit_log` entry.
**Derived from**: §UX-J-21; §UX-S-16; §UX-SEC-7

### PIT-FR-088 — Audit Log CSV Export

The system shall allow users with `auditor`, `org_admin`, or `cs2_admin` role to export the filtered audit log as a CSV file.

**Acceptance**: Clicking "Export CSV" on a filtered audit log downloads a `.csv` file containing the filtered entries.
**Derived from**: §UX-J-21; §UX-S-16

### PIT-FR-089 — Audit Log Pagination

The system shall implement server-side pagination for the Audit Log to support large datasets. Each page shall return a bounded number of records without loading all records into memory.

**Acceptance**: An audit log with 10,000 entries renders the first page in < 2 seconds (performance target for TRS); subsequent pages load on navigation.
**Derived from**: §UX-S-16

---

## 22. Admin / Settings Requirements

*Derived from: §AD-08, §UX-J-22, §UX-S-18*

### PIT-FR-090 — Organisation Settings

The system shall provide organisation-level settings configuration for: organisation name, logo, timezone, fiscal year start, default currency. Settings shall be accessible to `pit_admin` or `org_admin` only.

**Acceptance**: Changing the organisation timezone updates all date displays to use the new timezone.
**Derived from**: §UX-S-18

### PIT-FR-091 — User Management Screen

The system shall provide a user management screen showing all organisation users with their roles, joined date, and active/inactive status. Admins shall be able to invite, remove, activate, and deactivate users.

**Acceptance**: Deactivating a user prevents them from logging in; they appear with "Inactive" status in the user list.
**Derived from**: §UX-S-18

### PIT-FR-092 — Watchdog Sensitivity Configuration

The system shall allow admins to configure watchdog sensitivity thresholds (e.g., number of days overdue before flagging, stall detection window, evidence submission warning window) in Admin/Settings.

**Acceptance**: Setting "days before overdue flag" to 2 flags tasks 2 days after their due date.
**Derived from**: §UX-S-18; §UX-J-19

### PIT-FR-106 — Role Management Screen

The system shall provide a Role Management screen at `/admin/roles` accessible to `pit_admin`, `org_admin`, or `cs2_admin` that lists all roles defined for the organisation and allows assigning or revoking roles from users.

**Acceptance**: Navigating to `/admin/roles` as an `org_admin` shows the full role list; assigning a new role to a user updates their effective permissions on their next authenticated action.
**Derived from**: §UX-S-18; §AD-08

### PIT-FR-107 — Notification Templates Screen

The system shall provide a Notification Templates screen at `/admin/notifications` accessible to `pit_admin`, `org_admin`, or `cs2_admin` that allows configuration of which system events trigger email or in-app notifications, and allows editing the message template for each event type.

**Acceptance**: Disabling a notification template for "task overdue" stops the system from sending that notification for subsequent overdue events.
**Derived from**: §UX-S-18; §AD-08

### PIT-FR-108 — Task Cluster Templates Screen

The system shall provide a Task Cluster Templates screen at `/admin/task-clusters` accessible to `pit_admin`, `org_admin`, or `cs2_admin` that allows creation, editing, and deletion of reusable task cluster templates for use during project setup.

**Acceptance**: Creating a task cluster template with three tasks makes those tasks available for selection when adding a cluster to a new project.
**Derived from**: §UX-S-18; §AD-08

### PIT-FR-109 — Invitation Settings Screen

The system shall provide an Invitation Settings section within Admin/Settings that allows `pit_admin`, `org_admin`, or `cs2_admin` to configure: default invitation expiry period, whether open signup is enabled for the organisation, and the invitation email template.

**Acceptance**: Setting invitation expiry to 48 hours causes invitation links older than 48 hours to be rejected at the acceptance step.
**Derived from**: §UX-S-18; §AD-08; §UX-J-09

---

## 23. QA Dashboard Requirements

*Derived from: §AD-20, §UX-S-17*

### PIT-FR-093 — QA Dashboard Access Control

The system shall provide a QA Dashboard screen at `/qa-dashboard` accessible only to users with the `cs2_admin` role.

**Acceptance**: A user with `org_admin` role navigating to `/qa-dashboard` sees the permission-denied state.
**Derived from**: §UX-S-17

### PIT-FR-094 — QA Dashboard Content

The system shall display on the QA Dashboard: test suite summary (total tests, passing, failing, skipped), per-wave test history, coverage metrics, links to test evidence artifacts, last run timestamp.

**Acceptance**: After a test run, the QA Dashboard shows updated counts and the last run timestamp.
**Derived from**: §UX-S-17

### PIT-FR-120 — QA Dashboard Enhanced Requirements

The system shall provide the following enhanced QA Dashboard capabilities, accessible only to users with the `cs2_admin` role (see PIT-FR-093):

- **Empty state**: Before any test runs exist, the QA Dashboard shall show an informative empty state explaining that no test data is available and providing a link to the test execution documentation.
- **Failed-test drilldown**: Clicking on a failed test count shall expand or navigate to a drilldown list of individual failed tests with: test name, test file path, failure message, and timestamp. Each failed test entry shall link to the source artifact (test file) where available.
- **Evidence artifact links**: The QA Dashboard shall display links to deployment evidence artifacts (screenshots, logs, or CI run URLs) associated with each test run.
- **Wave filter**: A filter control shall allow filtering the QA Dashboard by build wave or test suite label.
- **Test run history**: The QA Dashboard shall show a chronological history of test runs with: run timestamp, total/pass/fail/skip counts, triggered-by label (CI, manual, or agent), and pass/fail outcome badge.
- **QA-to-Red vs QA-to-Green distinction**: Each test run shall be labelled as `QA-TO-RED` (failing baseline — expected failures before build) or `QA-TO-GREEN` (post-build run — expected passes). The distinction shall be visually clear.
- **Deployment evidence visibility**: Evidence items marked as deployment evidence shall be linked from the relevant test run entry.
- **Manual physical verification evidence**: Any manually captured physical verification evidence (screenshots, signed-off artefacts) shall be displayable as linked attachments from the test run detail.
- **Last run status and source link**: The main QA Dashboard header shall display the last run timestamp, overall pass/fail status, and a direct link to the source CI run.

**Acceptance**: (a) With no test runs, the QA Dashboard shows an empty state with guidance text. (b) Clicking on "5 failed" in a test run shows a list of 5 individual failed tests with names and failure messages. (c) A test run labelled `QA-TO-RED` is visually distinct from a `QA-TO-GREEN` run.
**Derived from**: §AD-20; §UX-S-17; maturion-isms#1556 (QA Dashboard expanded requirements)

---

## 24. AI / AIMC Functional Requirements

*Derived from: §AD-14, §UX-SEC-8; MMM carry-forward AIMC governance*

> **AIMC Route Candidate Notice**: The AIMC endpoint paths in PIT-FR-096 through PIT-FR-099 (e.g., `/api/aimc/pit/task-advisor`) are **functional route candidates**. Stage 4 TRS must confirm the exact AIMC gateway contract and may rename, consolidate, or restructure endpoints without changing the functional behaviour specified here. The functional requirement (AI advisory, human-confirmation-required, audit-logged) remains binding regardless of the final endpoint path. No builder may implement against these candidate paths without TRS confirmation.

### PIT-FR-095 — AIMC Gateway Routing Mandatory

The system shall route ALL AI functionality through the Maturion AIMC Gateway. Direct calls to OpenAI, Anthropic, or any AI model provider API from any PIT frontend component, backend component, or Edge Function are strictly prohibited.

**Acceptance**: A code audit of all PIT source files finds zero direct calls to `api.openai.com`, `api.anthropic.com`, or equivalent provider endpoints.
**Derived from**: §AD-14; §UX-SEC-8.1

### PIT-FR-096 — Task AI Advisor

The system shall provide an AI Advisor panel on the Task Management Page (and as a collapsible panel on the Implementation Page task detail drawer) that, when expanded, calls `/api/aimc/pit/task-advisor` and displays suggested next actions, risks, and similar completed tasks as a bulleted list.

Human approval is required for any AI suggestion to take effect. Suggestions shall never auto-apply. All AI invocations and user accept/dismiss actions shall be logged in `audit_log`.

**Acceptance**: The AI Advisor panel expands; suggestions appear; clicking "Apply suggestion" logs the acceptance; dismissing logs the dismissal.
**Derived from**: §UX-SEC-8.2, Touchpoint AI-1

### PIT-FR-097 — Portfolio Risk Highlight

The system shall provide an on-demand "Analyse portfolio" button on the Portfolio Dashboard that calls `/api/aimc/pit/portfolio-risk-analysis` and displays a dismissible "AI Risk Insights" card highlighting the top 3 at-risk projects with plain-language explanations. AI output shall not automatically change project status.

**Acceptance**: Clicking "Analyse portfolio" shows the insights card; dismissing removes it; no project status is changed without explicit user action.
**Derived from**: §UX-SEC-8.2, Touchpoint AI-2

### PIT-FR-098 — Watchdog Escalation Recommendation

The system shall provide a "Get AI recommendation" button on each flagged item in the Watchdog Dashboard that calls `/api/aimc/pit/escalation-advisor` and displays an inline recommendation with rationale. Applying the recommendation requires explicit user confirmation.

**Acceptance**: AI recommendation is shown inline; "Apply recommendation" button must be clicked to take action; clicking without the button creates no changes.
**Derived from**: §UX-SEC-8.2, Touchpoint AI-3

### PIT-FR-099 — AI Executive Summary in Reports

The system shall provide an optional "Include AI Executive Summary" checkbox on the Reports screen. When checked, the `generate_report` Edge Function calls `/api/aimc/pit/report-summary` and prepends a clearly labelled "AI-Generated Summary — Review before distribution" section to the report. The user shall be able to edit the summary text before finalising the download.

**Acceptance**: Generating a report with the checkbox checked includes the AI summary section; unchecked produces a report without it.
**Derived from**: §UX-SEC-8.2, Touchpoint AI-4

---

## 25. Cross-Module Integration Requirements

*Derived from: §AD-15, §UX-SEC-10 Open Item 8 (resolved here)*

### PIT-FR-100 — Source Link Integration with Upstream Modules

The system shall support receiving or linking work items from the following upstream modules: Maturity Roadmap (MMM), Risk Management, Incident Management. Integration shall follow the Source Link model established in PIT-FR-034.

The initial integration mechanism shall be: a user selects the source module and enters or searches for the source item ID during project creation. PIT stores the source reference. Deep integration (webhook/event-driven intake) is a TRS/Architecture decision.

**Acceptance**: Creating a project linked to Risk #R-007 stores `source_type = 'risk'` and `source_ref = 'R-007'` in the `source_links` table.
**Derived from**: §AD-15; §UX-J-11; §UX-SEC-10 Open Item 8

### PIT-FR-101 — Cross-Organisation Data Scoping

The system shall scope all project, milestone, deliverable, task, and evidence data to the current user's organisation membership. The `cs2_admin` role shall have cross-organisation visibility for audit and reporting purposes only.

Data access policies for cross-org scenarios (including any database-level row-security rules) shall be defined in TRS per IAA Acceptance Condition 6 (OVL-PBG-014).

**Acceptance**: A user who is a member of Org A cannot see Org B's projects, even when querying the same table. A `cs2_admin` can see data from all organisations in their report.
**Derived from**: §UX-SEC-10 Open Item 3 (resolved here); §AD-08

### PIT-FR-102 — Integration Settings Management

The system shall provide an Integration Settings screen in Admin (`/admin/integrations`) allowing admins to configure connections to Maturity Roadmap, Risk Management, and Incident Management modules.

**Acceptance**: The Admin > Integrations screen shows all three integration configurations; saving updates the `integration_configs` table.
**Derived from**: §UX-S-18

---

## 26. Deployment Surface Requirements

*Derived from: §AD-16, §UX-SEC-9; MMM carry-forward L-006*

### PIT-FR-103 — Complete Route Coverage

The system shall implement all 27 routes defined in §UX-SEC-9 (Deployment Surface Map). Each route shall be registered in the React Router configuration and in the deployment configuration.

**Acceptance**: Every route in §UX-SEC-9 is registered in the application and returns a correctly rendered component (not a 404) in the deployed environment.
**Derived from**: §UX-SEC-9; L-006

### PIT-FR-104 — 404 Not Found Page

The system shall display a dedicated 404 Not Found page for any route not matching the defined route set. The 404 page shall include a "Go Home" link navigating to the Portfolio Dashboard (or Landing if unauthenticated).

**Acceptance**: Navigating to `/this-does-not-exist` renders a 404 page with a "Go Home" link.
**Derived from**: §UX-SEC-9; §UX-J-08

### PIT-FR-105 — Evidence File Storage Provisioning

The deployment contract shall require that a dedicated file storage location for evidence uploads is created and access-controlled before any deployment wave that includes evidence upload functionality. The storage provider, bucket/container naming, and access policy implementation are deferred to TRS and the deployment contract.

**Acceptance**: Evidence files uploaded by task owners are only accessible to project members and admins; the storage location is not publicly readable.
**Derived from**: §UX-SEC-9; L-006

---

## 27. My Work / Personal Task View Requirements

*Derived from: §AD-06, §UX-J-23, §UX-S-21*

### PIT-FR-111 — My Work Screen

The system shall provide a personal task view screen at `/my-work`, accessible to all authenticated users. The screen shall display all tasks assigned to the current user across all projects, showing for each task: project name, milestone name, deliverable name, task name, status badge, due date, and a priority indicator. The screen shall support all five UI states per PIT-FR-016.

**Acceptance**: Navigating to `/my-work` renders only the tasks assigned to the currently authenticated user; tasks assigned to other users are not shown; an empty state with a helpful explanation is displayed when no tasks are assigned.
**Derived from**: §UX-J-23; §UX-S-21

### PIT-FR-112 — My Work Filter and Task Actions

The My Work screen shall provide:
- (a) filter controls for task status (overdue, due-soon, in-progress, completed), due date range, and project;
- (b) inline status update per task row that saves without a full page navigation;
- (c) a navigation link from each task row to the full Task Management page (`/projects/[id]/tasks/[tid]`);
- (d) a direct evidence upload shortcut per task row navigating to the evidence upload screen (`/tasks/[tid]/evidence`).

**Acceptance**: Applying the "overdue" filter shows only tasks with a past due date; inline status update saves without navigating away; clicking a task name navigates to the full task page; clicking the evidence icon navigates to the evidence upload screen for that task.
**Derived from**: §UX-J-23; §UX-S-21

---

## 28. Lifecycle Removal Semantics — Archive, Delete, Restore, and Cancel

*Derived from: §AD-07, §AD-09, §UX-S-06; maturion-isms#1556 (lifecycle removal requirement)*

### PIT-FR-121 — Lifecycle Removal Semantics

The system shall enforce the following lifecycle removal semantics for all entity types. The goal is to prevent data loss, preserve audit integrity, and protect evidence records.

#### Projects
- **Archive** is the preferred removal action. Archiving a project sets its status to `archived`, removes it from the active Portfolio Dashboard view, and preserves all child records.
- **Hard delete** is prohibited once a project has any child records (milestones, deliverables, tasks, evidence items, or audit entries). If a project has no child records, hard delete is permitted by `org_admin` or `cs2_admin` only.
- An archived project may be **restored** to active status by `org_admin` or `cs2_admin`. Restoration creates an audit log entry.

#### Milestones / Deliverables / Tasks
- **Soft delete (cancel)** is the preferred removal action. Soft-deleting a milestone, deliverable, or task sets its status to `cancelled` and removes it from active list views; it remains in history and audit records.
- **Hard delete** of milestones, deliverables, or tasks is prohibited if the item has child records, approved evidence items, or audit entries.
- **Cascade behaviour**: Cancelling a milestone cascades to offer the user the choice to cancel all child deliverables and tasks, or leave them active (with a warning that they are now orphaned from their parent milestone's completion path).
- Cancelled items may be **restored** to their prior status by a user with `deliverable_leader` role or above for tasks; `project_leader` for deliverables and milestones. Restoration creates an audit log entry and triggers a review of progress roll-up recalculation.

#### Evidence Items
- Evidence items (files, URLs, notes) are **never hard-deleted** through the normal user interface.
- Evidence may only be removed via an explicitly approved **retention workflow** (process defined in TRS/Architecture). The retention workflow requires `org_admin` or `cs2_admin` authorisation and creates an audit log entry.
- Returning an evidence item for revision (PIT-FR-065) does not delete it; the returned item remains in history with status `returned`.

#### Audit Log Entries
- Audit log entries (`audit_log` table) are **never user-deletable** through any user interface.
- No role, including `cs2_admin`, may delete audit log entries through the PIT application. Physical deletion requires a database-level administrative action outside the application, governed by the data retention policy (deferred to Architecture).

**Acceptance**: (a) A project with 3 milestones cannot be hard-deleted; the delete option is not available in the UI for that project. (b) Archiving a project preserves all child records and removes the project from the active Portfolio Dashboard. (c) Cancelling a task excludes it from progress roll-up and watchdog detection. (d) Attempting to delete an evidence item through the UI shows an error message stating evidence cannot be deleted. (e) The audit log has no delete button for any user role.
**Derived from**: §AD-07; §AD-09; §UX-S-06; maturion-isms#1556 (lifecycle removal semantics)

---

## 29. RAG Threshold Central Table

*Derived from: §UX-SEC-3; maturion-isms#1556 (centralised RAG thresholds)*

All Red/Amber/Green (RAG) logic in this FRS must reference this table. Requirements that specify RAG behaviour shall name the applicable RAG Rule ID. Conflicting threshold definitions in individual requirements are superseded by this table.

| RAG Rule | Green | Amber | Red | Applies To | Override Allowed? | Derived From |
|----------|-------|-------|-----|------------|-------------------|--------------|
| RAG-001 | Time elapsed ≤ actual progress + 15% | Time elapsed > actual progress + 15% | Time elapsed > actual progress + 25% | Project Duration (Indicator 1, PIT-FR-037) | No | §UX-SEC-3 Indicator 1 |
| RAG-002 | No milestones overdue | Any milestone overdue by 1–7 days | Any milestone overdue by > 7 days | Milestone Count (Indicator 2, PIT-FR-038) | No | §UX-SEC-3 Indicator 2 |
| RAG-003 | No deliverables overdue | Any deliverable overdue by 1–7 days | Any deliverable overdue by > 7 days | Deliverable Count (Indicator 3, PIT-FR-039) | No | §UX-SEC-3 Indicator 3 |
| RAG-004 | Overdue tasks = 0 | Overdue tasks 1–10% of total | Overdue tasks > 10% of total | Task Count / Overdue (Indicator 4, PIT-FR-040) | No | §UX-SEC-3 Indicator 4 |
| RAG-005 | Delta ≥ 0% (actual ≥ planned) | Delta −5% to −15% (actual < planned) | Delta < −15% (actual << planned) | Progress Against Plan (Indicator 6, PIT-FR-042) | No | §UX-SEC-3 Indicator 6 |
| RAG-006 | ≥ 50% overall progress with < 75% time elapsed | < 25% progress with 25–75% time elapsed | < 50% overall progress with > 75% time elapsed | Overall Progress % (Indicator 7, PIT-FR-043) | No | §UX-SEC-3 Indicator 7 |
| RAG-007 | All milestones on-track | Any milestone at-risk (amber per RAG-002) | Any milestone overdue (red per RAG-002) | Portfolio Dashboard project cards (PIT-FR-028) | No | §UX-S-05 |
| RAG-008 | Item within configured threshold | Item approaching threshold (configurable Amber window) | Item past threshold (configurable Red window) | Watchdog / Escalation (PIT-FR-077, PIT-FR-092) | Yes (admin configures thresholds per PIT-FR-092) | §UX-S-14; §UX-J-19 |

> **Note**: Threshold overrides for RAG-008 (watchdog) are admin-configurable per PIT-FR-092. All other RAG rules are system-fixed and not user-overridable. TRS may define additional RAG rules; they must be added to this table and must not conflict with existing rules.

---

## 30. Minimum Accessibility Outcomes

*Derived from: §AD-11; maturion-isms#1556 (minimum accessibility functional outcomes)*

### PIT-FR-122 — Minimum Accessibility Outcomes

The system shall achieve the following minimum accessibility functional outcomes. These are functional requirements, not implementation constraints (WCAG compliance level is deferred to TRS per NF-010). TRS must confirm the WCAG target level; these outcomes define the minimum functional baseline regardless of WCAG target.

1. **Keyboard navigation**: All interactive elements (forms, modals, menus, dropdowns, CTAs, and Gantt zoom controls) shall be reachable and operable using keyboard navigation alone (Tab, Shift+Tab, Enter, Space, Arrow keys as appropriate). Icon-only button actions shall have keyboard-accessible equivalents.
2. **Focus management**: When a modal or drawer opens, focus shall move to the modal or drawer. When the modal or drawer closes, focus shall return to the element that triggered it (or to a logical fallback if the trigger no longer exists).
3. **Screen-reader labels for icon-only buttons**: All icon-only buttons (e.g., notification bell, close modal, edit row, delete row, expand/collapse) shall have a programmatic text label (e.g., `aria-label`) that is announced by screen readers but not visible in the UI.
4. **Colour is not the sole status indicator**: RAG status indicators, task status badges, and error/success states shall convey their meaning through text or pattern in addition to colour (e.g., "Overdue" text alongside the red chip; error text beneath an invalid field).
5. **Accessible form errors**: Form validation errors shall be programmatically associated with their input fields and announced on submission failure without requiring the user to visually scan the form.
6. **Accessible toast/notification announcements**: In-app toast messages and notification bell updates shall be announced to screen readers via a live region where technically practical.

**Acceptance**: (a) A user can complete the project creation wizard using only keyboard navigation. (b) Opening a "Create Task" modal moves focus inside; pressing Escape closes it and returns focus to the trigger button. (c) All icon-only buttons have accessible labels confirmed by accessibility audit. (d) The red overdue task chip displays "Overdue" as visible or screen-reader text. (e) A form submission with a missing required field announces the error to screen readers.
**Derived from**: §AD-11; NF-010; maturion-isms#1556 (accessibility outcomes)

---

## 31. Bulk Operations and Import/Template Non-Scope Declaration

*Derived from: maturion-isms#1556 (bulk operations and import explicit scoping)*

### PIT-FR-123 — Bulk Operations, CSV Import, and Project Templates — Explicit v1 Non-Scope

The following capabilities are **explicitly excluded from PIT v1 scope**. They shall not be implemented in any build wave unless a separate CS2-authorised requirement is added to this FRS and the Build Authorization is updated accordingly.

| Feature | v1 Scope Decision | Rationale |
|---------|-------------------|-----------|
| Bulk assign tasks | **OUT OF SCOPE** | Adds complexity to permission model; not required for MVP workflow |
| Bulk status update | **OUT OF SCOPE** | Single-task status update (PIT-FR-054) covers the primary workflow |
| Bulk due-date update | **OUT OF SCOPE** | Gantt drag-and-drop (PIT-FR-072) covers multi-item date management |
| Bulk export filtered task list | **OUT OF SCOPE** | Report exports (PIT-FR-080–082) cover export needs |
| CSV import (projects, tasks, or users) | **OUT OF SCOPE** | Adds data validation complexity; deferred post-MVP |
| Project-level templates | **OUT OF SCOPE** | Task Cluster Templates (PIT-FR-047) cover the reuse pattern at task level; project-level templates deferred post-MVP |

**Acceptance**: None of the features listed above appear in the Stage 4 TRS, Stage 5 Architecture, Stage 6 QA-to-Red, or Stage 12 Build deliverables without explicit CS2-authorised FRS amendment.
**Derived from**: maturion-isms#1556 (explicit v1 scope declaration for bulk ops and import)

---

## 32. Non-Functional Placeholders (TRS-Only)

The following items are intentionally deferred to Stage 4 (TRS) and Stage 5 (Architecture). They are listed here as reminders only and must not be allowed to replace the functional requirements above.

| ID | Placeholder | Stage |
|----|-------------|-------|
| NF-001 | API response time targets (e.g., < 200ms for list queries) | TRS |
| NF-002 | Concurrent user capacity targets | TRS |
| NF-003 | Database schema definition and RLS policies | TRS |
| NF-004 | Email delivery provider selection (Resend, Postmark, Supabase email) | TRS |
| NF-005 | Report generation library (Puppeteer for PDF, ExcelJS for XLSX) | TRS |
| NF-006 | AIMC Gateway endpoint path confirmation | TRS |
| NF-007 | Supabase Edge Function runtime constraints | TRS |
| NF-008 | Data retention and backup policies | Architecture |
| NF-009 | Security penetration testing scope | Architecture / QA-to-Red |
| NF-010 | WCAG accessibility compliance level | TRS |

---

## 33. Build-Completeness Guardrails

*Derived from: maturion-isms#1556 (build-completeness guardrails for one-time build readiness)*

The implementation is not functionally complete unless **all** of the following are true:

1. Every route in the deployment surface map (§UX-SEC-9 — 27 routes; see also Appendix A) renders a correctly functioning component in the deployed environment (not a 404 or blank screen).
2. Every primary page implements the required five-state model (PIT-FR-016): loading, empty, permission-denied, network error, and data states are all reachable and render correctly.
3. Every role-gated action has at least one allowed-path test (verifying the action succeeds for an authorised role) and at least one denied-path test (verifying the action is blocked for an insufficient role), per PIT-FR-113.
4. Every create, edit, delete, archive, cancel, status-change, evidence, and report action creates the required audit event in `audit_log`, as specified in PIT-FR-087 and §UX-SEC-7.
5. Every notification-generating action (per PIT-FR-025) creates an in-app notification record for the relevant recipient(s), confirmed by a test that queries the `notifications` table.
6. Every evidence-required completion path is blocked until evidence criteria are satisfied (PIT-FR-052, PIT-FR-066), confirmed by a test that attempts completion without required evidence and observes the block.
7. Every report type (PIT-FR-080) can be generated, downloaded, and permission-checked (allowed-path and denied-path per PIT-FR-118).
8. All AIMC actions route through the AIMC Gateway (PIT-FR-095) and require explicit human confirmation before any suggestion takes effect (PIT-FR-096 through PIT-FR-099). No AI suggestion auto-applies.
9. All Gantt date changes show conflict/cascade consequences before save (PIT-FR-072, PIT-FR-073): the confirmation dialog must appear and must be confirmed before dates are written.
10. No downstream stage (TRS, Architecture, QA-to-Red, Implementation Plan, Builder Checklist, Build) may substitute implementation assumptions for unresolved FRS or TRS decisions. If an FRS or TRS decision is unresolved at the time a downstream stage is being executed, the downstream stage must halt and escalate to CS2.

> **Note for Quality Professor (Foreman QP mode)**: These guardrails are the build-completeness pass/fail criteria for the Stage 12 QP PASS verdict. Any builder deliverable that cannot satisfy all 10 guardrails at the time of handover is a QP FAIL. There are no exceptions or partial-credit outcomes.

---

## 34. QA-to-Red Derivation Requirements

*Derived from: `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 Stage 6; maturion-isms#1556 (QA-to-Red derivation guardrails)*

Stage 6 QA-to-Red **must** derive RED-phase tests (failing tests before implementation) covering every item in the following checklist. This derivation is mandatory and constitutes the QA-to-Red completeness gate. A QA-to-Red suite that does not cover all items listed here is incomplete and must not be gate-passed.

| Category | Derivation Source | Coverage Required |
|----------|-------------------|-------------------|
| All functional requirements (PIT-FR-001 through PIT-FR-123) | This FRS | At least one test per requirement or requirement group |
| All routes (27 routes — see Appendix A) | §UX-SEC-9; Appendix A | At least one test per route verifying: route is registered, renders correct component, applies correct auth guard |
| All screens (§UX-S-01 through §UX-S-21) | §UX-S-NN screen definitions | At least one test per screen verifying correct render |
| All user journeys (§UX-J-01 through §UX-J-23) | §UX-J-NN journey definitions | At least one end-to-end or integration test per journey |
| All five UI states per primary page | PIT-FR-016 | At least one test per state per primary page (loading, empty, permission-denied, network error, data) |
| All role-denied paths | PIT-FR-113; role-scope matrix §3.1 | At least one insufficient-permission test per protected action group |
| All evidence workflows | PIT-FR-062–067; PIT-FR-052 | Tests for submit, approve, return, evidence-required block, task completion path |
| All audit-generating actions | PIT-FR-087; §UX-SEC-7 | One test per audit event type verifying `audit_log` entry is created |
| All notification events | PIT-FR-025; PIT-FR-115–117 | One test per notification type verifying in-app notification record is created; one test for mark-as-read |
| All report exports | PIT-FR-080–082; PIT-FR-118–119 | One test per report type for generation (allowed path) and permission denial |
| All AIMC touchpoints | PIT-FR-095–099 | One test per AIMC touchpoint verifying: gateway routed (no direct provider call), human confirmation required, audit log entry created |
| Direct SPA route loads (bypassing client-side routing) | PIT-FR-014; PIT-FR-103 | One test per protected route verifying direct URL load renders correctly (SPA fallback working) |
| Visual rendering / app shell / global-style checks | PIT-FR-017; PIT-FR-018; L-002 | At least one test per primary page verifying app shell (sidebar + top nav) is present in all five UI states |
| Live deployment smoke checks | PIT-FR-103; L-006; L-007 | After each deployment wave: at least one smoke test per deployed route confirming the route renders in the deployed environment |
| Cancelled-task exclusions | PIT-FR-054; PIT-FR-077; PIT-FR-114 | Tests verifying cancelled tasks are excluded from watchdog, progress roll-up, and evidence requirements |
| Lifecycle removal and deletion blocks | PIT-FR-121 | Tests verifying: project with children cannot be hard-deleted, evidence items cannot be deleted via UI, audit log entries cannot be deleted |

---

## 35. Acceptance Criteria Summary

Each functional requirement above includes inline acceptance criteria in the format:

> **Acceptance**: Given [precondition], when [action], then [verifiable outcome].

Stage 6 QA-to-Red shall derive test cases directly from these acceptance criteria. No requirement in this FRS is considered testable unless its acceptance criterion can be validated by an automated test or a defined manual verification procedure.

---

## 36. Traceability Matrix

| App Description Section | Stage 2 Journey/Screen/Section | FRS Requirement IDs | Future Stage Placeholder |
|--------------------------|-------------------------------|---------------------|--------------------------|
| §AD-06 (User Flows) | §UX-J-01 through §UX-J-10; §UX-S-20 | PIT-FR-003 through PIT-FR-015, PIT-FR-110 | TRS §auth; QA-to-Red auth suite |
| §AD-11 (5-State UI) | §UX-SEC-4 | PIT-FR-016, PIT-FR-017 | QA-to-Red 5-state suite |
| §AD-11 (App Shell) | §UX-SEC-5 | PIT-FR-018 through PIT-FR-021 | Architecture §shell; QA-to-Red shell suite |
| §AD-13 (Notifications) | §UX-SEC-5.4 | PIT-FR-022 through PIT-FR-026, PIT-FR-115–117 | TRS §notifications; QA-to-Red notification suite |
| §AD-06 (Dashboard) | §UX-S-05; §UX-J-11 | PIT-FR-027 through PIT-FR-030 | QA-to-Red dashboard suite |
| §AD-07 (Projects) | §UX-J-11, §UX-S-07 | PIT-FR-031 through PIT-FR-035 | TRS §project; QA-to-Red project suite |
| §AD-07 (Implementation Page) | §UX-S-06, §UX-SEC-3 | PIT-FR-036 through PIT-FR-045 | QA-to-Red implementation suite |
| §AD-07 (Hierarchy) | §UX-J-12–14, §UX-S-09–11 | PIT-FR-046 through PIT-FR-057, PIT-FR-114 | TRS §hierarchy; QA-to-Red hierarchy suite |
| §AD-08 (Assignment) | §UX-J-15, §UX-S-12 | PIT-FR-058 through PIT-FR-061 | QA-to-Red assignment suite |
| §AD-09 (Evidence) | §UX-J-16–17, §UX-S-13 | PIT-FR-062 through PIT-FR-067 | TRS §evidence; QA-to-Red evidence suite |
| §AD-07 (Timeline) | §UX-J-18, §UX-S-08, §UX-SEC-6 | PIT-FR-068 through PIT-FR-076 | TRS §timeline; QA-to-Red timeline suite |
| §AD-12 (Watchdog) | §UX-J-19, §UX-S-14 | PIT-FR-077 through PIT-FR-079 | TRS §watchdog; QA-to-Red watchdog suite |
| §AD-13 (Reports) | §UX-J-20, §UX-S-15 | PIT-FR-080 through PIT-FR-084, PIT-FR-118–119 | TRS §reports; QA-to-Red reports suite |
| §AD-07 (Filters) | §UX-S-06, §UX-S-16 | PIT-FR-085, PIT-FR-086 | QA-to-Red filter suite |
| §AD-14 (Audit) | §UX-J-21, §UX-S-16 | PIT-FR-087 through PIT-FR-089 | TRS §audit; QA-to-Red audit suite |
| §AD-08 (Admin) | §UX-J-22, §UX-S-18 | PIT-FR-090 through PIT-FR-092, PIT-FR-106 through PIT-FR-109 | QA-to-Red admin suite |
| §AD-20 (QA Dashboard) | §UX-S-17 | PIT-FR-093, PIT-FR-094, PIT-FR-120 | QA-to-Red QA dashboard suite |
| §AD-14 (AIMC) | §UX-SEC-8 | PIT-FR-095 through PIT-FR-099 | TRS §aimc; QA-to-Red AIMC suite |
| §AD-15 (Integrations) | §UX-SEC-10 OI-8; §UX-J-11 | PIT-FR-100 through PIT-FR-102 | Architecture §integrations; QA-to-Red integration suite |
| §AD-16 (Deployment) | §UX-SEC-9 | PIT-FR-103 through PIT-FR-105 | Architecture §deployment; Stage 7 PBFAG |
| §AD-06 (My Work) | §UX-J-23, §UX-S-21 | PIT-FR-111, PIT-FR-112 | QA-to-Red my-work suite |
| §AD-01–§AD-05 (Identity) | — | PIT-FR-001, PIT-FR-002, PIT-FR-113 | Architecture §roles |
| maturion-isms#1556 (hardening) | — | PIT-FR-113–123, §RAG-Central, §33 Build Guardrails, §34 QA-to-Red Derivation, Appendix A | QA-to-Red all suites |

**FRS Coverage Totals (v0.2-hardened)**:
- Functional Requirements: PIT-FR-001 through PIT-FR-123 (123 requirements)
- Acceptance Criteria: 1 per requirement (123 inline acceptance criteria)
- Non-Functional Placeholders: NF-001 through NF-010 (10 deferred to TRS/Architecture)
- App Description Sections Traced: §AD-01 through §AD-24 — COMPLETE
- UX Journeys Traced: §UX-J-01 through §UX-J-23 — COMPLETE
- UX Screens Traced: §UX-S-01 through §UX-S-21 — COMPLETE
- v0.2 Hardening Areas Applied: 19 (per maturion-isms#1556 acceptance criteria)

---

## 37. Open Questions / Assumptions

The following assumptions are made in this FRS. Items marked [CS2] require CS2 decision before Stage 4 (TRS) proceeds. Items marked [ARCH] are deferred to Architecture.

| ID | Assumption / Open Question | Resolution Path |
|----|---------------------------|-----------------|
| A-001 | Default signup mode is **open** (invite-only is opt-in per org). Resolved in PIT-FR-007. | [RESOLVED] |
| A-002 | Task dependency UI (blocked task indicator) is a first-class feature. Resolved in PIT-FR-056, PIT-FR-057. | [RESOLVED] |
| A-003 | Cross-org data scoping: `cs2_admin` role (already in role hierarchy, PIT-FR-001) handles cross-org audit/reporting. Resolved in PIT-FR-101. | [RESOLVED] |
| A-004 | AIMC endpoint paths (`/api/aimc/pit/...`) are subject to confirmation with AIMC module owner. Final paths must be confirmed before Stage 6 QA-to-Red. Candidate paths are now explicitly labelled in §24 AIMC section. | [CS2] Before Stage 6 |
| A-005 | Email provider selection is deferred to TRS (NF-004). | [ARCH/TRS] |
| A-006 | Task Cluster Template schema versioning and override model defined in PIT-FR-047. Full schema detail is TRS. | [TRS] |
| A-007 | Report generation library selection is deferred to TRS (NF-005). | [TRS] |
| A-008 | Deep integration mechanism for upstream modules (Maturity Roadmap, Risk, Incident) is deferred to TRS/Architecture. PIT-FR-100 covers functional requirement only. | [ARCH/TRS] |
| A-009 | Cancelled task reversal authority level. Resolved in PIT-FR-054: reversal requires `deliverable_leader` role or above. | [RESOLVED] |
| A-010 | RAG thresholds for Indicator 2 (milestones) and Indicator 3 (deliverables) were undefined. Resolved in §29 RAG Central Table (RAG-002, RAG-003). | [RESOLVED] |

---

## 38. Stage 4 (TRS) Readiness Statement

This FRS (v0.2-hardened) is sufficiently complete to derive the TRS. Stage 4 may be prepared as draft-only before CS2 approval if governance explicitly permits it, but **Stage 4 may not be approved, gate-passed, or used to authorise Architecture until Stage 2 and Stage 3 approvals are recorded**.

The following conditions must be met before Stage 4 is approved (draft may proceed before these are all met, but gate-pass is blocked until all are satisfied):

- [ ] This FRS (Stage 3) reviewed and approved by CS2
- [ ] UX Workflow & Wiring Spec (Stage 2) approved by CS2
- [ ] Open assumption A-004 (AIMC endpoint paths) resolved or formally deferred with CS2 approval
- [ ] Improvement register updated with any oversights discovered during FRS review (L-008)
- [ ] Build Authorization remains NOT CLEARED — implementation is blocked until Stages 3–11 are completed and gate-passed

---

**End of PIT Functional Requirements Specification v0.2-hardened**

---

## Appendix A — Route Coverage

*Derived from: §UX-SEC-9 (Deployment Surface Map); PIT-FR-103; maturion-isms#1556 (route coverage appendix requirement)*

> **Status**: All 27 routes from Stage 2 §UX-SEC-9 are listed below. QA-to-Red Placeholder column identifies the QA suite responsible for testing each route. Every route must have at least one test confirming: (a) the route is registered, (b) the route renders the correct component in the deployed environment, (c) the auth guard applies correctly.

| Route | Screen | Auth Required | Minimum Role | FRS Requirement IDs | QA-to-Red Placeholder |
|-------|--------|---------------|--------------|---------------------|----------------------|
| `/` | Landing / Public Entry | No | — | PIT-FR-003, PIT-FR-013 | auth suite |
| `/login` | Login | No | — | PIT-FR-004, PIT-FR-005, PIT-FR-013 | auth suite |
| `/signup` | Signup | No | — | PIT-FR-006, PIT-FR-007 | auth suite |
| `/forgot-password` | Forgot Password | No | — | PIT-FR-011 | auth suite |
| `/reset-password` | Reset Password | No | — | PIT-FR-012 | auth suite |
| `/invite/[token]` | Invitation Acceptance | No (token-validated) | — | PIT-FR-008, PIT-FR-009, PIT-FR-010, PIT-FR-110 | auth suite |
| `/onboarding` | Onboarding | Yes | Any authenticated | PIT-FR-015 | auth suite |
| `/dashboard` | Portfolio Dashboard | Yes | Any authenticated | PIT-FR-027–030, PIT-FR-097 | dashboard suite |
| `/projects` | Project List | Yes | `project_creator` or above | PIT-FR-031–033 | project suite |
| `/projects/new` | Project Creation Wizard | Yes | `project_creator` or above | PIT-FR-031–035 | project suite |
| `/projects/[id]` | Implementation Page | Yes | `viewer` or above (project-scoped) | PIT-FR-036–045, PIT-FR-085, PIT-FR-096 | implementation suite |
| `/projects/[id]/edit` | Project Edit | Yes | `project_leader` or above | PIT-FR-031–035 | project suite |
| `/projects/[id]/timeline` | Timeline / Gantt | Yes | `viewer` or above (project-scoped) | PIT-FR-068–076 | timeline suite |
| `/projects/[id]/milestones/[mid]` | Milestone Management | Yes | `milestone_leader` or above | PIT-FR-048–050 | hierarchy suite |
| `/projects/[id]/deliverables/[did]` | Deliverable Management | Yes | `deliverable_leader` or above | PIT-FR-051–052 | hierarchy suite |
| `/projects/[id]/tasks/[tid]` | Task Management | Yes | `task_owner` or above (task-scoped) | PIT-FR-053–057, PIT-FR-096, PIT-FR-114 | hierarchy suite |
| `/tasks/[tid]/evidence` | Evidence Upload | Yes | `task_owner` or above | PIT-FR-062–067 | evidence suite |
| `/watchdog` | Watchdog Dashboard | Yes | `project_leader` or above | PIT-FR-077–079, PIT-FR-098 | watchdog suite |
| `/reports` | Reports | Yes | `reporter` or above | PIT-FR-080–084, PIT-FR-099, PIT-FR-118–119 | reports suite |
| `/audit` | Audit Log | Yes | `auditor` or above | PIT-FR-087–089 | audit suite |
| `/my-work` | My Work | Yes | Any authenticated | PIT-FR-111–112 | my-work suite |
| `/qa-dashboard` | QA Dashboard | Yes | `cs2_admin` only | PIT-FR-093–094, PIT-FR-120 | QA dashboard suite |
| `/admin` | Admin / Settings (root) | Yes | `pit_admin` or above | PIT-FR-090–092, PIT-FR-106–109 | admin suite |
| `/admin/roles` | Role Management | Yes | `pit_admin` or above | PIT-FR-106 | admin suite |
| `/admin/notifications` | Notification Templates | Yes | `pit_admin` or above | PIT-FR-107 | admin suite |
| `/admin/task-clusters` | Task Cluster Templates | Yes | `pit_admin` or above | PIT-FR-108 | admin suite |
| `/admin/integrations` | Integration Settings | Yes | `pit_admin` or above | PIT-FR-102 | admin suite |
| `/*` (404) | 404 Not Found | No | — | PIT-FR-104 | deployment suite |

> **Note**: Admin sub-routes (`/admin/roles`, `/admin/notifications`, `/admin/task-clusters`, `/admin/integrations`) are confirmed as separate routes. Invitation Settings (PIT-FR-109) may be a section within `/admin` rather than a separate route; TRS/Architecture must confirm the route path. My Work (`/my-work`), Invitation Acceptance (`/invite/[token]`), and QA Dashboard (`/qa-dashboard`) are confirmed as first-class routes. Total: 27 named routes + 1 catch-all 404.

---

**Template Version**: 1.0.0  
**Template Authority**: `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0  
**Last Updated**: 2026-05-07  
**Authority**: CS2 (Johan Ras / @APGI-cmy)
