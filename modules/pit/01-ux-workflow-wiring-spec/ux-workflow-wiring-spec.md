# PIT — UX Workflow & Wiring Spec

## Status Header

| Field | Value |
|---|---|
| Module | PIT |
| Application Name | Project Implementation Tracker |
| Artifact Type | Stage 2 — UX Workflow & Wiring Spec |
| Version | v0.1-draft |
| Status | Draft |
| Approval Status | Pending Foreman review |
| Derived From | `docs/governance/PIT_APP_DESCRIPTION.md` v1.0 (CS2 Approved 2026-05-06) |
| Author | pit-specialist (delegated by foreman-v2-agent) |
| Date | 2026-05-06 |
| Issue | maturion-isms#1540 |
| Pre-Build Authority | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 |

---

## Section 0: Derivation Statement and MMM Carry-Forward

### 0.1 Derivation Statement

This UX Workflow & Wiring Spec derives directly from the approved PIT App Description at `docs/governance/PIT_APP_DESCRIPTION.md` v1.0 (CS2 Approved 2026-05-06, ref: maturion-isms#1540). All user journeys, screen definitions, wiring tables, and state requirements in this document are grounded in the product intent, scope, success criteria, and business logic established in the App Description.

The architecture artifacts at `modules/pit/04-architecture/` provide supplementary technical context. Where architectural guidance is referenced, this spec treats the App Description as the overriding authority. Conflicts between this spec and legacy architecture artifacts must be resolved in favour of the App Description unless CS2 authorises otherwise.

Every downstream Stage 3 (FRS), Stage 4 (TRS), Stage 6 (QA-to-Red), and Stage 12 (Build) artifact must cite this document as a derivation source alongside the App Description.

**Authoritative canonical location**: `docs/governance/PIT_APP_DESCRIPTION.md` (v1.0)  
**Module-stage copy location**: `modules/pit/00-app-description/app-description.md`

---

### 0.2 MMM Carry-Forward Requirements

The following eight build-process controls were promoted from the MMM build into PIT pre-build governance per Foreman directive (maturion-isms#1534). Each is binding on this Stage 2 artifact.

#### L-001 — Build-Complete Is Not Operationally Closed

**MMM Lesson**: Build-complete (L1), deployment commissioned (L2), and CS2-verified E2E operational (L3) are three distinct closure levels.

**PIT Stage 2 Implication**: This spec must design workflows such that each primary user journey can be verified end-to-end at L3. Every screen and journey must be deliverable as a complete, working experience — not a partial stub. The deployment surface map (Section 9) ensures all journeys have a verifiable route in the deployed environment.

#### L-002 — UI Can Pass Code/File Tests and Still Render Incorrectly

**MMM Lesson**: File-existence and string-presence tests do not verify visual rendering.

**PIT Stage 2 Implication**: This spec explicitly defines the app shell and global navigation (Section 5) so that visual rendering completeness can be checked. Every screen includes a definition of what its rendered state must look like. QA-to-Red (Stage 6) must derive rendering checks from this spec.

#### L-003 — All Primary Pages Require All 5 UI States

**MMM Lesson**: Post-login pages failed to show loading, empty, permission-denied, network-error, and data states. Users received blank or misleading screens.

**PIT Stage 2 Implication**: Section 4 of this spec defines all 5 UI states for every primary page. The five states are:
1. **Loading state** — spinner/skeleton while data fetches
2. **Empty data state** — no data yet; useful message + CTA
3. **Permission-denied state** — user authenticated but lacks permission
4. **Network/server error state** — API or network failure
5. **Data state** — normal, populated data view

No page definition in this spec is complete without all 5 states. Stage 6 QA-to-Red must include test cases for all 5 states per page.

#### L-004 — Auth Route Discoverability Must Be Designed Up Front

**MMM Lesson**: MMM required post-build fixes for missing login route registration, forgot-password, reset callback, SPA fallback, and signup.

**PIT Stage 2 Implication**: Section 1 (Primary User Journeys) explicitly includes all auth journeys: public entry, login, signup, invitation, forgot-password, reset-password, protected-route redirect, SPA fallback, access-denied, and onboarding. Section 2 includes dedicated screens for all auth flows. Section 9 (Deployment Surface Map) includes all auth routes.

All auth routes must be in QA-to-Red before implementation begins.

#### L-005 — Tests Must Prove Runtime and UI Behaviour

**MMM Lesson**: String/file-existence tests alone are insufficient.

**PIT Stage 2 Implication**: This spec is written to enable runtime/UI behaviour testing. Screen definitions include component-level specifics, not just descriptions. The wiring table (Section 7) provides granular API/table touchpoints that can be used to write integration tests. Section 4 five-state definitions provide concrete test scenarios.

#### L-006 — Deployment Execution Is a First-Class Contract

**MMM Lesson**: Deployment required post-build hardening around Vercel, Supabase migrations, and live validation.

**PIT Stage 2 Implication**: Section 9 (Deployment Surface Map) defines all routes and their deployment evidence requirements. A Runtime/Deployment Contract must be filed before PBFAG. The deployment surface map in this spec seeds that contract.

#### L-007 — Operational Closure Requires Live Evidence

**MMM Lesson**: CI GREEN and provisioning confirmations alone do not close operational items.

**PIT Stage 2 Implication**: All primary journeys defined in Section 1 must be verifiable as live end-to-end workflows in the deployed environment. CS2 sign-off on live product is required for L3 closure.

#### L-008 — Continuous Improvement Must Be Recorded

**MMM Lesson**: Build-process oversights discovered late are expensive.

**PIT Stage 2 Implication**: Any gap discovered in this spec or during Stage 3 onward must be recorded in `modules/pit/_readiness/pit-build-process-improvement-register.md` and propagated back to affected upstream artifacts before the affected wave proceeds.

---

## Section 1: Primary User Journeys

### Journey 1 — Public Landing / Unauthenticated Entry

**Start**: User navigates to the PIT root URL or receives a shared link.  
**Goal**: User understands PIT's purpose and finds a clear path to sign in or sign up.  
**Steps**:
1. User lands on the public Landing screen.
2. The Landing screen displays the PIT product description, key features, and two clear CTAs: **Sign In** and **Sign Up**.
3. If the user already has a session cookie, they are redirected immediately to the Portfolio Dashboard.
4. User clicks Sign In → navigated to Login screen (Journey 2).
5. User clicks Sign Up → navigated to Signup screen (Journey 3).
6. User clicks Accept Invitation link (from email) → navigated to Invitation Acceptance screen (Journey 4).

**Auth required**: No  
**Guard**: If authenticated, redirect to `/dashboard` before rendering landing.

---

### Journey 2 — Login

**Start**: User on Login screen.  
**Goal**: Authenticated user redirected to their intended destination.  
**Steps**:
1. User enters email and password.
2. On submit, PIT calls Supabase `auth.signInWithPassword`.
3. On success: if user has a pending redirect (e.g., deep link before login), navigate to that URL; otherwise navigate to `/dashboard`.
4. On failure: display inline validation error (toast + field error).
5. Forgot-password link is visible → navigates to Forgot-Password screen (Journey 5).
6. Sign Up link is visible → navigates to Signup screen (Journey 3).

**Auth required**: No  
**Supabase Auth**: `supabase.auth.signInWithPassword`

---

### Journey 3 — Signup

**Start**: User on Signup screen (self-registration).  
**Goal**: New user account created and user progresses to onboarding.  
**Steps**:
1. User enters email, password, and full name.
2. On submit, PIT calls Supabase `auth.signUp`.
3. Supabase sends email verification.
4. User is shown "Check your email" confirmation screen.
5. On email verification, user is redirected to Onboarding screen (Journey 10).
6. If email already exists, display inline error.

**Auth required**: No  
**Supabase Auth**: `supabase.auth.signUp`  
**Note**: Signup may be organisation-gated (invite-only setting). If signup is disabled, the Signup screen shows an "Invite Only" message and the Sign Up CTA is hidden from the Landing screen.

---

### Journey 4 — Invitation Acceptance

**Start**: User clicks an invitation link received by email.  
**Goal**: User accepts invitation, creates/links account, and joins the organisation.  
**Steps**:
1. User clicks invitation link → navigated to Invitation Acceptance screen with token.
2. PIT validates the invitation token (via Edge Function `validate_invitation`).
3. If invalid/expired: display error with option to request a new invitation.
4. If user has no account: show account-creation form (password setup).
5. User submits → account created, invitation accepted, user linked to organisation.
6. User redirected to Onboarding screen (Journey 10).
7. If user already has an account: show "Accept invitation to join [Org Name]" confirmation button.
8. On confirm: invitation accepted, user added to organisation, redirected to Portfolio Dashboard.

**Auth required**: Token-based (invitation token in URL)  
**Edge Function**: `validate_invitation`, `accept_invitation`  
**Tables**: `invitations`, `organisation_members`

---

### Journey 5 — Forgot Password

**Start**: User on Login screen, clicks "Forgot password".  
**Goal**: User receives password reset email.  
**Steps**:
1. User navigated to Forgot-Password screen.
2. User enters email address and submits.
3. PIT calls Supabase `auth.resetPasswordForEmail` with redirect URL to `/reset-password`.
4. User is shown "Check your email" confirmation message.
5. If email not found: Supabase still shows success (security — no enumeration).

**Auth required**: No  
**Supabase Auth**: `supabase.auth.resetPasswordForEmail`

---

### Journey 6 — Reset Password

**Start**: User clicks password reset link in email.  
**Goal**: User sets a new password.  
**Steps**:
1. User is redirected to `/reset-password` with Supabase auth token in URL hash.
2. PIT detects `type=recovery` in URL hash and presents Reset-Password screen.
3. User enters new password and confirms.
4. PIT calls Supabase `auth.updateUser({ password: newPassword })`.
5. On success: user redirected to Login screen with success toast.
6. On error (token expired): display error with link to retry Forgot-Password.

**Auth required**: Recovery token (one-time)  
**Supabase Auth**: `supabase.auth.updateUser`

---

### Journey 7 — Protected-Route Redirect (Unauthenticated)

**Start**: Unauthenticated user navigates directly to a protected route.  
**Goal**: User redirected to Login screen, then returned to original destination post-login.  
**Steps**:
1. PIT's `ProtectedRoute` component checks session.
2. No session found → store intended path in session storage.
3. Redirect to `/login`.
4. After successful login (Journey 2): redirect user to stored intended path.
5. If no stored path: redirect to `/dashboard`.

**Implementation note**: This journey is a component-level concern (ProtectedRoute HOC). It must be present for every protected route (all routes except `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/invite/[token]`).

---

### Journey 8 — Direct SPA Route Fallback

**Start**: User directly navigates to a deep SPA route (e.g., `/projects/abc/milestones`) via browser URL bar or external link.  
**Goal**: Application loads correctly and renders the correct page.  
**Steps**:
1. Deployment infrastructure (Vercel) is configured to serve `index.html` for all non-asset paths (SPA fallback rule).
2. React Router matches the route and renders the appropriate component.
3. If the route is protected and user is unauthenticated → Journey 7 (redirect to login, return after login).
4. If the route is protected and user is authenticated but lacks permission → Journey 9 (access-denied).
5. If the route does not exist → 404 Not Found screen.

**Deployment requirement**: Vercel `vercel.json` must include a rewrite rule: `{ "source": "/(.*)", "destination": "/index.html" }`.

---

### Journey 9 — Access Denied (Authenticated, Insufficient Permission)

**Start**: Authenticated user attempts to access a page or action they lack permission for.  
**Goal**: User sees a clear, helpful message and a path back to permitted content.  
**Steps**:
1. PIT's `ProtectedRoute` or page-level permission check fails for the current user's role.
2. User is shown the Access-Denied screen (or inline permission-denied state within a page).
3. Screen displays: "You don't have permission to view this page."
4. CTA: "Go to Dashboard" or "Go Back".
5. No sensitive data is disclosed.

**This is distinct from network/server error.** The UI must differentiate between "403 Forbidden" and "500 Server Error".

---

### Journey 10 — Onboarding / First-Use

**Start**: New user arrives after signup or invitation acceptance.  
**Goal**: User is oriented in PIT, their profile is complete, and they can begin using the application.  
**Steps**:
1. User is shown Onboarding screen.
2. Step 1 — Profile setup: confirm full name, role/title (optional), profile picture (optional).
3. Step 2 — Organisation context: user sees which organisation(s) they belong to (auto-populated from invitation or signup domain). If multiple orgs, they select primary.
4. Step 3 — Orientation: brief explanations of key concepts (Projects, Milestones, Deliverables, Tasks) with visual diagrams. Skip option available.
5. Step 4 — First action prompt: "Create your first project" CTA or "View existing projects" if the organisation already has projects.
6. On completion: user redirected to Portfolio Dashboard.

**Tables touched**: `users` (profile update), `organisations`, `organisation_members`

---

### Journey 11 — Create Project

**Start**: Authenticated user with Project Creator or Admin role on Portfolio Dashboard or Implementation page.  
**Goal**: New project created and user navigated to new project's Implementation page.  
**Steps**:
1. User clicks "New Project" button.
2. Project Creation modal/wizard opens.
3. Step 1 — Core details: project name, type (Project / Operational Stream / Improvement), description, project leader (user), organisation/division/department context.
4. Step 2 — Timeline: start date, target end date, quick-win type (Quick Win / Medium Term / Long Term).
5. Step 3 — Source link (optional): link to originating Risk, Audit Finding, Incident, Maturity Roadmap item, or Manual.
6. Step 4 — Cost (optional): CAPEX amount, OPEX amount, fiscal year.
7. Confirm — user reviews and submits.
8. PIT Edge Function `create_project` is called.
9. On success: user navigated to new project's Implementation page.
10. Project appears in Portfolio Dashboard immediately (optimistic update or refetch).

**Tables touched**: `projects`, `project_members`, `source_links`  
**Edge Function**: `create_project`  
**Auth**: Requires `project_creator` or `org_admin` role.

---

### Journey 12 — Add Milestone

**Start**: User on Implementation page for a project.  
**Goal**: New milestone added to the project.  
**Steps**:
1. User clicks "Add Milestone" within the project hierarchy.
2. Milestone creation form appears (inline or modal): name, description, start date, end date, milestone leader.
3. User submits.
4. PIT inserts row into `milestones` table.
5. Milestone appears in project hierarchy and timeline immediately.

**Tables touched**: `milestones`

---

### Journey 13 — Add Deliverable

**Start**: User on Implementation page, within a milestone.  
**Goal**: New deliverable added under the milestone.  
**Steps**:
1. User clicks "Add Deliverable" within a milestone row.
2. Deliverable form: name, description, deliverable leader, evidence required flag.
3. User submits.
4. PIT inserts row into `deliverables` table.
5. Deliverable appears in milestone hierarchy.

**Tables touched**: `deliverables`

---

### Journey 14 — Add Task / Action Item

**Start**: User on Implementation page, within a deliverable (or directly under a project for ad-hoc tasks).  
**Goal**: New task added and assigned.  
**Steps**:
1. User clicks "Add Task" within a deliverable or project.
2. Task form: name, description, task owner, start date, due date, priority, evidence required flag, CAPEX/OPEX amounts (optional).
3. Option to apply a Task Cluster Template (pre-defined sub-task sets).
4. User submits.
5. PIT inserts row into `tasks` table. If template applied, sub-tasks created.
6. Task appears in hierarchy. If task owner is different user, notification sent.

**Tables touched**: `tasks`, `task_clusters`, `notifications`

---

### Journey 15 — Assign Owner / Invite Team Member

**Start**: User creating or editing a project, milestone, deliverable, or task.  
**Goal**: Another user is assigned as owner/responsible person.  
**Steps**:
1. User selects "Assign Owner" or "Add Team Member" (person-picker component).
2. PIT searches `users` table filtered by organisation membership.
3. If user not yet in the system: user can enter email address to send an invitation (Journey 4).
4. On selection: assignment recorded. Assignee receives in-app notification and (optionally) email.

**Tables touched**: `project_members`, `milestone_members`, `deliverable_members`, `task_assignments`, `invitations`, `notifications`

---

### Journey 16 — Evidence Submission

**Start**: Task owner on their assigned task on the Implementation page or Task Management page.  
**Goal**: Evidence file or note is uploaded and linked to the task.  
**Steps**:
1. User opens the task detail panel/modal.
2. User clicks "Add Evidence".
3. User selects file(s) from local device or pastes a URL/note.
4. File is uploaded to Supabase Storage bucket `pit-evidence`.
5. Row inserted into `evidence_items` table linking to task.
6. Task status may auto-advance if evidence requirement is now met.
7. Toast: "Evidence submitted successfully."
8. Reviewers/approvers receive notification.

**Tables touched**: `evidence_items`, `tasks`  
**Storage**: Supabase Storage bucket `pit-evidence`

---

### Journey 17 — Evidence Review and Approval

**Start**: Reviewer/approver receives notification of submitted evidence.  
**Goal**: Evidence accepted or returned for revision.  
**Steps**:
1. Reviewer navigates to Evidence Upload and Review screen or task detail.
2. Reviewer views submitted evidence (file preview where supported, metadata).
3. Reviewer clicks "Approve" or "Return for Revision".
4. If Approved: `evidence_items.status` set to `approved`. Task marked as evidence-complete. Audit log entry created.
5. If Returned: reviewer adds a comment. `evidence_items.status` set to `returned`. Task owner notified.

**Tables touched**: `evidence_items`, `audit_log`, `notifications`  
**Role required**: `reviewer` or `org_admin`

---

### Journey 18 — Timeline / Gantt View Interaction

**Start**: User navigates to the Timeline/Gantt page for a project.  
**Goal**: User views and interacts with the visual project timeline.  
**Steps**:
1. PIT loads all milestones and deliverables for the selected project.
2. Gantt bars rendered for each milestone and deliverable on a date axis.
3. User can scroll/zoom the timeline (week/month/quarter view).
4. User can drag milestone/deliverable bars to adjust dates (updates `start_date`/`end_date` via Edge Function).
5. When a milestone is dragged, dependent deliverables may auto-shift (if dependency wiring is set).
6. Conflict indicators shown for overlapping dependent items.
7. User can click a bar to open the detail panel.

**Conflict detection**: If a deliverable's end date would exceed its parent milestone's end date, a warning indicator is shown. User must confirm the conflict resolution.

**Tables touched**: `milestones`, `deliverables`  
**Edge Functions**: `update_milestone_dates`, `update_deliverable_dates`

---

### Journey 19 — Watchdog / Escalation Review

**Start**: Watchdog engine has flagged an overdue or at-risk item; user navigates to Watchdog Dashboard.  
**Goal**: Manager reviews flagged items and takes action (escalate, reassign, or acknowledge).  
**Steps**:
1. User opens Watchdog Dashboard.
2. Flagged items listed (overdue tasks, stalled milestones, late evidence submissions).
3. User clicks an item to see detail and escalation history.
4. Actions available: Escalate (triggers notification to project leader or org admin), Reassign owner, Extend deadline (with override justification), or Acknowledge (snooze with note).
5. All actions are logged in `escalation_log` and `audit_log`.
6. Toast confirms action taken.

**Tables touched**: `tasks`, `milestones`, `escalation_log`, `audit_log`, `notifications`  
**Role required**: `org_admin`, `project_leader`, or `watchdog_operator`

---

### Journey 20 — Report Generation and Export

**Start**: User navigates to Reports and Exports screen.  
**Goal**: User generates a formatted report and downloads it.  
**Steps**:
1. User selects report type (Project Status Report, Portfolio Summary, Task Completion Report, Audit Trail Extract, CAPEX/OPEX Summary).
2. User selects scope (organisation, division, department, specific project, date range).
3. User selects format (PDF, Excel, CSV).
4. User clicks "Generate Report".
5. Edge Function `generate_report` is invoked with parameters.
6. Report generated server-side (or streamed for large datasets).
7. Download triggered in browser.
8. Report generation logged in `audit_log`.

**Edge Function**: `generate_report`  
**Tables read**: `projects`, `milestones`, `deliverables`, `tasks`, `evidence_items`, `users`, `organisations`  
**Storage output**: Optionally saved to Supabase Storage for retrieval.

---

### Journey 21 — Audit Log Review

**Start**: Auditor or admin navigates to Audit Log screen.  
**Goal**: Auditor reviews the change history for a project, user, or resource.  
**Steps**:
1. User selects audit log scope: all activity, by project, by user, by action type, by date range.
2. Audit log entries loaded from `audit_log` table.
3. User can filter, sort, and search entries.
4. User can export audit log as CSV.

**Tables touched**: `audit_log` (read only in this journey)  
**Role required**: `auditor`, `org_admin`, or `cs2_admin`

---

### Journey 22 — Admin / Settings Management

**Start**: PIT Admin or Org Super Admin navigates to Admin/Settings screen.  
**Goal**: Configuration saved and effective.  
**Steps**:
1. User accesses Admin screens (org settings, user management, permission roles, integration settings, notification templates, task cluster templates).
2. User makes changes and saves.
3. Changes are applied immediately (or after reload where applicable).
4. Admin actions are logged in `audit_log`.

**Tables touched**: `organisations`, `organisation_settings`, `roles`, `role_assignments`, `task_cluster_templates`, `notification_templates`, `integration_configs`  
**Role required**: `pit_admin` or `org_admin`

---

## Section 2: Primary App Screens

### Screen 1 — Landing / Public Entry Screen

**Purpose**: Public marketing/entry page. Describes PIT's value proposition and routes unauthenticated users to sign in or sign up.  
**Key UI Components**:
- PIT logo and product name
- Headline and brief product description (3–4 sentences from App Description §1.2, §1.4)
- Feature highlights grid (3–6 key features)
- Primary CTAs: "Sign In" (primary button), "Sign Up" (secondary button)
- Optional: testimonial or platform trust signals
**Entry points**: Direct URL navigation; shared links; back-navigation from auth screens  
**Navigation from this screen**:
- → Login screen (Sign In CTA)
- → Signup screen (Sign Up CTA)
- → Invitation Acceptance screen (invitation link)

**Auth guard**: If authenticated, redirect to `/dashboard` before rendering.

---

### Screen 2 — Login Screen

**Purpose**: Authenticate an existing user.  
**Key UI Components**:
- Email field
- Password field (with show/hide toggle)
- "Sign In" submit button
- "Forgot password?" link
- "Don't have an account? Sign Up" link
- Inline error message area (below the form)
- Loading spinner on submit
**Entry points**: Landing screen; direct URL `/login`; protected-route redirect  
**Navigation from this screen**:
- → Dashboard (on success, or to intended redirect destination)
- → Forgot-Password screen
- → Signup screen

---

### Screen 3 — Signup Screen

**Purpose**: Create a new user account.  
**Key UI Components**:
- Full name field
- Email field
- Password field (with strength indicator)
- Confirm password field
- "Create Account" submit button
- "Already have an account? Sign In" link
- Inline error message area
- Post-submit: "Check your email" confirmation banner
**Entry points**: Landing screen; direct URL `/signup`  
**Navigation from this screen**:
- → "Check your email" state (same screen, post-submit)
- → Login screen (Sign In link)
- → Onboarding (after email verification)

---

### Screen 4 — Onboarding / First-Use Screen

**Purpose**: Orient new users and complete their profile. Guide them to their first action.  
**Key UI Components**:
- Progress stepper (Step 1: Profile, Step 2: Organisation, Step 3: Orientation, Step 4: First Action)
- Step 1: Profile form (name, role/title, avatar upload)
- Step 2: Organisation display / multi-org selector
- Step 3: PIT concept explainer (visual hierarchy diagram: Project → Milestone → Deliverable → Task)
- Step 4: CTA panel — "Create First Project" or "View Projects"
- "Skip" option for orientation steps
- "Back" and "Next" navigation  
**Entry points**: Post-signup email verification; post-invitation acceptance  
**Navigation from this screen**:
- → Portfolio Dashboard (on completion or skip)
- → Project Creation modal (First Action CTA)

---

### Screen 5 — Portfolio Dashboard

**Purpose**: Cross-portfolio, cross-organisation roll-up view. The primary landing page for authenticated users.  
**Key UI Components**:
- Top-level summary cards: total projects (active/completed/overdue), total open tasks, total overdue tasks, portfolio progress %
- Project list/grid: each card shows project name, leader, progress %, RAG status, milestone count, due date
- Filter bar: by organisation/division/department, by project type, by status, by date range
- "New Project" button (for permitted roles)
- Watchdog alert banner (if any active escalations)
- Navigation sidebar (persistent across all authenticated screens)
- User profile menu (top right)
**Entry points**: Post-login; app logo link; direct URL `/dashboard`  
**Navigation from this screen**:
- → Implementation page (click project card)
- → Timeline/Gantt page (timeline icon on project card)
- → Reports and Exports screen
- → Watchdog Dashboard
- → Admin/Settings (if role permits)
- → Project Creation modal

---

### Screen 6 — Implementation Page (Project Dashboard) ⭐ PRIMARY SCREEN

**Purpose**: The central execution screen for a single project. Displays the full work hierarchy (milestones, deliverables, tasks) and the project's top-indicator summary. This is the most important screen in PIT.

**Top-of-page Indicators** (see Section 3 for full definition):
1. Project duration with visual progress indicator
2. Milestone count (total / completed)
3. Deliverable count (total / completed)
4. Task count (total / completed / overdue)
5. Team member count
6. Progress against plan %
7. Overall progress %

**Key UI Components**:
- Project name header with edit button (permitted roles)
- Top indicators row (7 indicator widgets — see Section 3)
- Hierarchy tree/table: Project → Milestones → Deliverables → Tasks (collapsible/expandable)
- Inline add buttons at each level (Add Milestone, Add Deliverable, Add Task)
- Row-level quick actions: edit, complete, add evidence, assign, delete (role-dependent)
- Task row fields visible: name, owner, due date, status, progress %, evidence indicator
- Status colour coding: on-track (green), at-risk (amber), overdue (red), complete (grey)
- Filter bar: filter by status, owner, date range, task type
- View toggle: hierarchy view / flat list view / timeline link
- Watchdog flag icon on flagged items
- AI Advisor prompt button (AIMC — see Section 8)
**Entry points**: Portfolio Dashboard (click project); direct URL `/projects/[id]`  
**Navigation from this screen**:
- → Timeline/Gantt page (timeline link/button)
- → Evidence Upload screen (evidence icon on task)
- → Milestone Management page (milestone row expand/link)
- → Task Management page (task row link)
- → Reports and Exports
- → Audit Log

---

### Screen 7 — Project Creation Modal / Wizard

**Purpose**: Step-by-step guided creation of a new project.  
**Key UI Components**:
- Multi-step modal or full-page wizard (4 steps: Core Details, Timeline, Source Link, Cost)
- Step 1: Name (required), type selector (Project/Operational/Improvement), description, project leader selector, org/division/department selectors
- Step 2: Start date picker, end date picker, quick-win type selector
- Step 3: Source link (optional — search/select Risk, Audit Finding, Incident, Roadmap item, or mark as Manual)
- Step 4: CAPEX amount, OPEX amount, fiscal year (all optional)
- Review screen: summary of all inputs before submit
- "Back", "Next", "Create Project" buttons
- Cancel option (with discard confirmation)  
**Entry points**: Portfolio Dashboard "New Project" button; Onboarding first-action CTA; Implementation page breadcrumb  
**Navigation from this screen**:
- → Implementation page (on successful creation)
- → Portfolio Dashboard (on cancel)

---

### Screen 8 — Timeline / Gantt Page

**Purpose**: Visual date-axis representation of all milestones and deliverables for a project.  
**Key UI Components**:
- Gantt chart component (horizontal bars on a date axis)
- Zoom/view controls: day, week, month, quarter, year
- Milestone bars (thicker, labelled)
- Deliverable bars (thinner, indented under milestones)
- Task bars (optional overlay toggle)
- Progress fill within bars (% complete shading)
- Today line (vertical marker)
- Dependency arrows (if dependencies are set)
- Conflict indicator (overlapping dependent items shown in amber/red)
- Click bar → opens detail panel (same as Implementation page row)
- Drag bar → adjust dates (confirmed with modal if conflict)
- Add milestone/deliverable button  
**Entry points**: Implementation page "Timeline" button; Portfolio Dashboard timeline icon; direct URL `/projects/[id]/timeline`  
**Navigation from this screen**:
- → Implementation page (back/breadcrumb)
- → Milestone/Deliverable detail panels (click bars)

---

### Screen 9 — Milestone Management Page

**Purpose**: Dedicated view of all milestones within a project and their deliverables.  
**Key UI Components**:
- Milestone list with expand/collapse
- Each milestone row: name, leader, start, end, status, deliverable count, progress %
- Deliverables list nested under each milestone
- Inline edit for milestone details
- Add Deliverable button per milestone
- RAG status badges
- Link to Timeline page  
**Entry points**: Implementation page milestone row; direct URL `/projects/[id]/milestones`  
**Navigation from this screen**:
- → Deliverable Management page
- → Timeline page
- → Implementation page

---

### Screen 10 — Deliverable Management Page

**Purpose**: Focused view of a single deliverable and its tasks.  
**Key UI Components**:
- Deliverable header: name, leader, milestone parent, status, evidence required indicator
- Task list: all tasks under this deliverable
- Add Task button
- Task rows: name, owner, due date, status, evidence indicator
- Evidence summary: how many evidence items are submitted/approved
- Inline edit for deliverable details  
**Entry points**: Milestone Management page; Implementation page deliverable row; direct URL `/projects/[id]/milestones/[mid]/deliverables/[did]`  
**Navigation from this screen**:
- → Task Management page (task row click)
- → Evidence Upload screen (evidence button)
- → Milestone Management page

---

### Screen 11 — Task Management Page

**Purpose**: Full detail view of a single task, including assignment, status, evidence, and history.  
**Key UI Components**:
- Task header: name, owner, parent deliverable/project, due date, priority, status badge
- Description field (rich text, read or edit mode)
- Status selector (not_started, upcoming, active, in_progress, completed, overdue, blocked)
- Progress % slider
- Evidence section: list of submitted evidence items with preview/download links and approval status
- Add Evidence button
- Assignment section: current owner, add co-assignees
- CAPEX/OPEX fields
- Comments/notes thread
- Status history log (timeline of status changes)
- AI Advisor suggestion panel (AIMC — see Section 8)  
**Entry points**: Implementation page task row; Deliverable Management page task row; direct URL `/projects/[id]/tasks/[tid]`  
**Navigation from this screen**:
- → Evidence Upload screen (Add Evidence button)
- → Deliverable Management page
- → Implementation page

---

### Screen 12 — Assignment / Invitation Management Screen

**Purpose**: Manage team membership for a project, invite new members, and control role assignments.  
**Key UI Components**:
- Project team member list: name, email, role, joined date, assigned items count
- "Add Team Member" button (person-picker or email invite)
- Role selector per member (Project Leader, Milestone Leader, Deliverable Leader, Task Owner, Reviewer, Viewer)
- Remove member action (with confirmation)
- Pending invitations list with resend/cancel actions  
**Entry points**: Implementation page settings icon; Admin/Settings; direct URL `/projects/[id]/team`  
**Navigation from this screen**:
- → Implementation page

---

### Screen 13 — Evidence Upload and Review Screen

**Purpose**: Upload evidence for a task and review/approve submitted evidence.  
**Key UI Components**:
- Task reference header (which task this evidence is for)
- Evidence item list: file name, type, uploader, upload date, status (pending/approved/returned), comment
- Upload button (file picker, drag-and-drop zone)
- URL/note input option (for non-file evidence)
- File preview panel (images, PDFs inline where supported)
- Approve/Return-for-Revision buttons (for reviewer roles)
- Reviewer comment field  
**Entry points**: Task Management page "Add Evidence"; notification link; Implementation page evidence icon; direct URL `/tasks/[tid]/evidence`  
**Navigation from this screen**:
- → Task Management page

---

### Screen 14 — Watchdog / Escalation Dashboard

**Purpose**: Centralised view of all flagged, overdue, or at-risk items requiring manager attention.  
**Key UI Components**:
- Summary counts: total flagged (red), at-risk (amber), escalated today
- Filter by: project, owner, type (overdue task, stalled milestone, missing evidence), severity
- Flagged item list: item name, type, project, owner, days overdue, escalation count
- Row actions: Escalate, Reassign, Extend Deadline, Acknowledge
- Escalation thread view for each item (history of escalation actions)
- Export as CSV button  
**Entry points**: Portfolio Dashboard alert banner; sidebar navigation; direct URL `/watchdog`  
**Navigation from this screen**:
- → Task/Milestone/Deliverable detail (click item)
- → Implementation page

---

### Screen 15 — Reports and Exports Screen

**Purpose**: Generate and download structured reports on project/portfolio status.  
**Key UI Components**:
- Report type selector: Project Status Report, Portfolio Summary, Task Completion Report, Audit Trail Extract, CAPEX/OPEX Summary
- Scope selectors: organisation, division, project, date range
- Format selector: PDF, Excel (XLSX), CSV
- "Generate Report" button
- Report history list (previous generated reports, if stored)
- Download button per historical report  
**Entry points**: Sidebar navigation; Portfolio Dashboard; direct URL `/reports`  
**Navigation from this screen**:
- → Portfolio Dashboard
- → Implementation page (from report links where applicable)

---

### Screen 16 — Audit Log Screen

**Purpose**: Tamper-evident view of all system actions and user changes.  
**Key UI Components**:
- Filter bar: by action type, user, project, resource type, date range
- Audit log table: timestamp, actor, action type, resource, resource ID, old value, new value, IP address
- Pagination (server-side)
- Export as CSV button
- Search by keyword  
**Entry points**: Sidebar navigation (admin/auditor role only); direct URL `/audit-log`  
**Navigation from this screen**:
- → Project/Task/Resource pages (click resource ID link)

---

### Screen 17 — QA Dashboard Screen

**Purpose**: Real-time QA health view for the PIT implementation (primarily for CS2/admin/QA operators). Shows test status, build health, and QA metrics.  
**Key UI Components**:
- Test suite summary: total tests, passing, failing, skipped
- Per-wave test history
- Coverage metrics
- Link to test evidence artifacts
- Last run timestamp  
**Entry points**: Admin/Settings; direct URL `/qa-dashboard` (role-gated)  
**Navigation from this screen**:
- → Admin/Settings

---

### Screen 18 — Admin / Settings Screens

**Purpose**: Configuration and administration of PIT for the organisation.  
**Sub-screens**:
- **Organisation Settings**: name, logo, timezone, fiscal year start, default currency
- **User Management**: list all users, roles, invite/remove, activate/deactivate
- **Role Management**: define and assign custom roles
- **Integration Settings**: configure connections to Maturity Roadmap, Risk Management, Incident Management modules
- **Notification Templates**: configure email/in-app notification templates
- **Task Cluster Templates**: create/edit reusable task cluster templates
- **System Settings**: feature flags, watchdog sensitivity thresholds, invitation settings (open vs invite-only)  
**Entry points**: Sidebar navigation (admin role only); direct URL `/admin/*`  
**Navigation from this screen**:
- → Portfolio Dashboard (back)

---

### Screen 19 — Forgot-Password / Reset-Password Screens

**Forgot-Password Screen**:
- Email input field
- "Send Reset Link" button
- "Back to Login" link
- Post-submit: "Check your email" confirmation state

**Reset-Password Screen**:
- New password field (with strength indicator)
- Confirm new password field
- "Set New Password" button
- On success: redirect to Login with success toast
- On token error: error message with "Try Again" link to Forgot-Password  
**Entry points**: Login screen "Forgot password?" link; direct email link to `/reset-password`

---

## Section 3: Implementation Page Top Indicators

The Implementation Page (Screen 6) must display the following seven summary indicators at the top of the page in a persistent indicator row. These indicators give the project manager immediate situational awareness without scrolling.

---

### Indicator 1 — Project Duration with Visual Progress

**Display format**: "DD MMM YYYY → DD MMM YYYY | [progress bar] | X% time elapsed"  
**Visual component**: Horizontal progress bar showing elapsed days / total days. Colour: green (< 75%), amber (75–90%), red (> 90% without proportional work completion).  
**Data source**: `projects.start_date`, `projects.end_date`  
**Calculation**: `(today - start_date) / (end_date - start_date) * 100 = % time elapsed`  
**RAG logic**: If % time elapsed > % overall progress + 15, status is amber; if > 25 behind, status is red.  
**Threshold**: Warning if project end date has passed (overdue banner).

---

### Indicator 2 — Milestone Count

**Display format**: "Milestones: X / Y" (completed / total)  
**Visual component**: Badge with completed count highlighted.  
**Data source**: `milestones` table filtered by `project_id`. Status `completed` counted separately.  
**Calculation**: `COUNT(milestones WHERE project_id = X)` for total; `COUNT(milestones WHERE project_id = X AND status = 'completed')` for completed.  
**RAG logic**: If any milestone is overdue (end_date < today AND status != 'completed'), amber or red badge shown.

---

### Indicator 3 — Deliverable Count

**Display format**: "Deliverables: X / Y" (completed / total)  
**Visual component**: Badge, same pattern as Indicator 2.  
**Data source**: `deliverables` table joined via `milestones` to `project_id`.  
**Calculation**: COUNT with status = 'completed' filter for completed count.  
**RAG logic**: Same as Indicator 2 — overdue deliverables trigger amber/red.

---

### Indicator 4 — Task Count (with Overdue)

**Display format**: "Tasks: X / Y (Z overdue)" — completed / total (overdue count)  
**Visual component**: Three sub-counts: total (grey), completed (green), overdue (red chip if > 0).  
**Data source**: `tasks` table joined through hierarchy to `project_id`.  
**Calculation**: Total: `COUNT(tasks WHERE project_id = X via hierarchy)`. Completed: `WHERE status = 'completed'`. Overdue: `WHERE due_date < today AND status NOT IN ('completed', 'cancelled')`.  
**RAG logic**: Overdue count > 0 = amber; overdue count > 10% of total = red.

---

### Indicator 5 — Team Member Count

**Display format**: "Team: X members"  
**Visual component**: Avatars (up to 5 shown, then "+N more" overflow).  
**Data source**: `project_members` table filtered by `project_id`.  
**Calculation**: `COUNT(DISTINCT user_id WHERE project_id = X)`.  
**RAG logic**: None (informational only).

---

### Indicator 6 — Progress Against Plan %

**Display format**: "Planned: X% | Actual: Y%" with delta indicator (▲ ahead / ▼ behind)  
**Visual component**: Two-bar comparative progress bar OR two percentage badges with coloured delta arrow.  
**Data source**: Derived from milestone/deliverable/task completion vs. date-proportional planned completion.  
**Calculation**:
- Planned % = (elapsed days / total project days) * 100 (assumes linear plan as baseline unless milestones have custom weighting)
- Actual % = weighted completion % (see Indicator 7)
- Delta = Actual % − Planned %
**RAG logic**: Delta < −5% = amber; Delta < −15% = red; Delta > 0 = green.

---

### Indicator 7 — Overall Progress %

**Display format**: "Progress: X%" with circular progress ring or linear bar.  
**Visual component**: Circular progress ring or large percentage badge.  
**Data source**: `tasks.progress_percent`, `deliverables`, `milestones` — weighted roll-up.  
**Calculation**:
1. Task progress: average of `tasks.progress_percent` for all tasks in the project.
2. Deliverable progress: average of task completion % for tasks within each deliverable.
3. Milestone progress: average of deliverable completion % within each milestone.
4. Project progress: average of milestone progress %.
5. Override: if all tasks = 100% and evidence approved where required, deliverable = 100%.
**RAG logic**: < 25% with > 25% time elapsed = amber; < 50% with > 75% time elapsed = red.

---

## Section 4: UI States for Every Primary Page

Every primary page MUST implement all five required UI states. Below is the specification for each screen.

---

### State Definitions

| State | Trigger | Required Behaviour |
|---|---|---|
| **1 — Loading** | Data fetch in progress | Show skeleton loaders or spinner in the content area. Navigation remains visible. No data flicker. |
| **2 — Empty Data** | Fetch successful, zero records | Show illustration or icon, descriptive empty-state message, and contextual CTA (e.g., "Create your first project"). Do not show "No records found" without CTA. |
| **3 — Permission Denied** | 403 / RLS blocks data | Show "You don't have permission to view this" with CTA to go back. No sensitive resource names shown. Must be visually distinct from error state. |
| **4 — Network / Server Error** | Network failure or 500 | Show "Something went wrong. Please try again." with retry button. Log error in console. Must be visually distinct from permission-denied state. |
| **5 — Data** | Fetch successful, data present | Render full page with all data, interactions, and secondary actions available. |

---

### Screen-by-Screen State Matrix

| Screen | Loading | Empty | Permission Denied | Error | Data |
|---|---|---|---|---|---|
| Portfolio Dashboard | Skeleton cards (3–4 placeholder project cards) | "No projects yet. Create your first project." + "New Project" CTA | "You don't have permission to view this portfolio." + "Go Home" | "Failed to load projects. Retry" button | Full project cards grid/list |
| Implementation Page | Skeleton hierarchy table + skeleton top indicators | "No milestones yet. Add your first milestone." + "Add Milestone" CTA | "You don't have permission to view this project." | "Failed to load project. Retry" button | Full hierarchy + indicators |
| Timeline / Gantt | Skeleton Gantt bars (placeholder rows) | "No timeline data yet. Add milestones to see the timeline." | "You don't have permission to view this timeline." | "Failed to load timeline. Retry" button | Full Gantt chart |
| Milestone Management | Skeleton milestone list | "No milestones. Add first milestone." + CTA | "You don't have permission to manage milestones." | "Failed to load milestones. Retry" | Full milestone list |
| Deliverable Management | Skeleton task list | "No tasks. Add first task." + CTA | "You don't have permission to manage this deliverable." | "Failed to load deliverable. Retry" | Full task list |
| Task Management | Skeleton task fields | N/A (task must exist to navigate here) | "You don't have permission to view this task." | "Failed to load task. Retry" | Full task detail |
| Evidence Upload & Review | Skeleton evidence list | "No evidence submitted yet." + "Upload Evidence" CTA | "You don't have permission to view evidence for this task." | "Failed to load evidence. Retry" | Full evidence list |
| Watchdog Dashboard | Skeleton flagged-item rows | "No flagged items. All items are on track." (green state) | "You don't have permission to view the Watchdog." | "Failed to load watchdog data. Retry" | Full flagged-item list |
| Reports and Exports | Spinner on generate | "No reports generated yet. Select parameters above." | "You don't have permission to generate reports." | "Report generation failed. Retry" | Report ready + download |
| Audit Log | Skeleton table rows | "No audit events found for this filter." | "You don't have permission to view the audit log." | "Failed to load audit log. Retry" | Full paginated audit log |
| QA Dashboard | Spinner | "No QA data available." | "You don't have permission to view the QA dashboard." | "Failed to load QA data. Retry" | Full QA metrics |
| Admin / Settings | Skeleton settings forms | N/A | "You don't have permission to access settings." | "Failed to load settings. Retry" | Full settings forms |

---

## Section 5: App Shell / Navigation and Root-Level Notification Pattern

### 5.1 App Shell Layout

```
┌────────────────────────────────────────────────────────┐
│ TOP NAV: [PIT Logo] [Org Switcher] [Search] [🔔] [👤] │
├──────────┬─────────────────────────────────────────────┤
│ SIDEBAR  │                                             │
│          │        MAIN CONTENT AREA                   │
│ Nav      │                                             │
│ Items    │   (Screen-specific content renders here)   │
│          │                                             │
│          │                                             │
└──────────┴─────────────────────────────────────────────┘
```

The app shell is persistent across all authenticated screens. The sidebar and top nav must be visible in ALL five UI states (loading, empty, permission-denied, error, data). The top nav and sidebar are never replaced by a loading spinner — only the main content area shows loading/error/empty states.

### 5.2 Primary Navigation Items

| Nav Item | Route | Min Role Required | Icon |
|---|---|---|---|
| Portfolio Dashboard | `/dashboard` | `viewer` | Grid icon |
| My Work | `/my-work` | `task_owner` | Person icon |
| Watchdog | `/watchdog` | `project_leader` | Alert icon |
| Reports | `/reports` | `reporter` | Chart icon |
| Audit Log | `/audit-log` | `auditor` | Log icon |
| QA Dashboard | `/qa-dashboard` | `cs2_admin` | Test icon |
| Admin / Settings | `/admin` | `pit_admin` | Settings icon |

### 5.3 Role-Based Navigation Visibility

Navigation items are shown or hidden based on the current user's role within the current organisation context. The visibility rules are:

- Items the user does not have access to are hidden from the sidebar (not greyed out — hidden).
- If a user navigates to a hidden route directly (URL), they receive the Permission-Denied state (Journey 9).
- The "Admin / Settings" item is only visible to `pit_admin` and `org_admin` roles.
- The "Audit Log" item is only visible to `auditor`, `org_admin`, and `cs2_admin` roles.
- The "QA Dashboard" item is only visible to `cs2_admin`.

### 5.4 Notification Pattern

**Location**: Bell icon in top navigation bar.  
**Badge count**: Number of unread notifications shown as a red badge on the bell icon. Badge disappears when all notifications are marked read.  
**Click behaviour**: Clicking the bell opens a notification drawer (slide-in panel from top right). Notification drawer shows the 20 most recent unread notifications with "Mark all read" and "View all" options.  
**Notification types**:
- Task assigned to you
- Task due in X days (configurable warning period)
- Task overdue
- Evidence submitted (for reviewers)
- Evidence approved or returned (for submitters)
- Escalation triggered for your item
- Invitation received
- Project membership granted
- Watchdog flag raised on your item

**In-app delivery**: Supabase Realtime subscription on `notifications` table filtered by `user_id`.  
**Email delivery**: Optional, configurable per notification type in User Preferences.  
**Root-level requirement**: `NotificationProvider` must wrap the entire authenticated app shell at the root level. No per-page notification setup permitted.

### 5.5 Global Header

| Element | Description |
|---|---|
| PIT Logo | Left-aligned; clicking navigates to Portfolio Dashboard |
| Organisation Switcher | Dropdown showing all organisations the user is a member of. Switching org reloads the dashboard in that org's context. Hidden if user belongs to only one org. |
| Global Search | Search bar (icon or expanded). Searches projects, tasks, users within the current org context. |
| Notification Bell | See Section 5.4 |
| User Profile Menu | Avatar/initials + dropdown: Profile Settings, Preferences, Sign Out |

### 5.6 Breadcrumbs / Wayfinding

Breadcrumbs are displayed in the main content area header for all deep-navigation screens:

- Portfolio Dashboard: `PIT > Dashboard`
- Implementation Page: `PIT > [Project Name]`
- Milestone Management: `PIT > [Project Name] > Milestones`
- Deliverable Management: `PIT > [Project Name] > [Milestone Name] > [Deliverable Name]`
- Task Management: `PIT > [Project Name] > [Milestone Name] > [Deliverable Name] > [Task Name]`
- Evidence: `PIT > [Project Name] > ... > [Task Name] > Evidence`
- Timeline: `PIT > [Project Name] > Timeline`

Each breadcrumb segment is a clickable link.

---

## Section 6: Timeline Creator Interactions and Date-Alignment Expectations

### 6.1 Timeline Creation Interactions

**Primary interaction mode**: Date picker inputs in milestone/deliverable/task creation forms. Drag-and-drop on the Gantt view is a secondary/edit interaction.

**Date picker standards**:
- All dates displayed in `DD MMM YYYY` format (e.g., 06 May 2026) in the UI.
- All dates stored in ISO 8601 format (`YYYY-MM-DD`) in the database.
- Timezone: all dates are stored as date-only (no time component) to avoid timezone complications. PIT operates in the organisation's configured timezone.
- When creating a milestone: start date ≥ project start date; end date ≤ project end date.
- When creating a deliverable: end date ≤ parent milestone end date (warning if violated; hard block not required at creation time but flagged by watchdog).
- When creating a task: due date ≤ parent deliverable end date (warning if violated).

### 6.2 Auto-Calculation of Dependent Dates

**When a milestone is extended (end date pushed out)**:
- System checks if any deliverables under the milestone would now extend past the new milestone end date.
- If conflicts exist: modal asks user "Do you want to auto-extend dependent deliverables to match the new milestone end date?"
- User can confirm auto-extension or manually adjust each.

**When a milestone is shortened (end date pulled in)**:
- System checks if any deliverables would now exceed the new milestone end date.
- Warning shown: "X deliverables extend past the new milestone end date." User must resolve (either shorten deliverables or keep conflict flagged by watchdog).

**When a deliverable is moved**: same cascading logic applies to its tasks.

### 6.3 Visual Gantt Representation

- Milestones rendered as thicker bars with a diamond marker at the end date.
- Deliverables rendered as narrower bars indented under their milestone.
- Task bars optionally shown (toggle: "Show tasks on Gantt" — hidden by default for readability).
- Progress fill: bar fill colour shows completion percentage within the bar.
- Today line: vertical red dashed line at current date.
- Bar colours: on-track (blue), at-risk (amber), overdue (red), complete (grey/green).
- Dependencies: optional arrow connections between dependent items. Dependencies stored in `task_dependencies` table.

### 6.4 Drag-and-Drop

- Dragging a milestone bar horizontally adjusts its start and end date by the same delta (move, not resize).
- Dragging the right edge of a bar resizes (extends or shortens the end date).
- Dragging the left edge resizes the start date.
- After drag: confirmation dialog shows new dates and any cascade implications. User confirms or cancels.
- Drag operations are undoable within the current session (Ctrl+Z / Cmd+Z).

### 6.5 Conflict Detection

**Hard conflicts** (system flags, prevents cascade without user confirmation):
- Deliverable end date > parent milestone end date
- Task due date > parent deliverable end date
- Circular dependency (Item A depends on Item B which depends on Item A)

**Soft conflicts** (watchdog flags, user can acknowledge):
- Progress % < proportional target for current date
- Milestone has no deliverables
- Deliverable has no tasks
- Task has no assigned owner

### 6.6 Calendar / Date Format Standards

- Display format: `DD MMM YYYY` (e.g., `06 May 2026`)
- Storage format: `YYYY-MM-DD` (ISO 8601 date)
- Duration display: "X days" for short durations, "X months, Y days" for longer durations
- Relative dates in notifications/watchdog: "Due in 3 days", "Overdue by 2 days"
- Fiscal year: configurable per organisation. Does not affect date storage; affects financial roll-up grouping only.

---

## Section 7: Screen-to-Data Wiring

| UI Component / User Action | API / Edge Function Candidate | Table / Entity Touched | Auth / RLS Context | Audit Event | Evidence / QA Verification Expectation |
|---|---|---|---|---|---|
| Landing screen load | None (static) | None | None | None | Page renders without auth; redirects if session exists |
| Login form submit | `supabase.auth.signInWithPassword` | `auth.users` (Supabase Auth) | None | `auth.sign_in` (Supabase managed) | Successful login redirects to `/dashboard`; failed login shows inline error |
| Signup form submit | `supabase.auth.signUp` | `auth.users` | None | `auth.sign_up` (Supabase managed) | Email verification sent; confirmation state shown |
| Invitation token validate | `validate_invitation` Edge Function | `invitations` | Service-role (token-scoped) | None | Invalid/expired token shows error; valid token shows acceptance form |
| Invitation accept | `accept_invitation` Edge Function | `invitations`, `organisation_members`, `auth.users` | Service-role | `invitation_accepted` | User added to org; redirected to onboarding |
| Forgot password submit | `supabase.auth.resetPasswordForEmail` | `auth.users` | None | None | "Check email" confirmation shown regardless of result |
| Reset password submit | `supabase.auth.updateUser` | `auth.users` | Recovery token | None | Redirect to login with success toast; token error shows retry |
| Profile update (onboarding) | `update_user_profile` Edge Function or direct Supabase RPC | `users` | JWT (own user only) | `user_profile_updated` | Profile saved; user proceeds to next onboarding step |
| Portfolio Dashboard load | `list_projects` Edge Function or Supabase query | `projects`, `project_members`, `milestones`, `tasks` | JWT + RLS (user's org + role) | None | Project cards render with correct data; all 5 states handled |
| New Project CTA click | (Opens modal; no API until submit) | None | `project_creator` or `org_admin` role check | None | "New Project" button hidden if role insufficient |
| Project Creation submit | `create_project` Edge Function | `projects`, `project_members`, `source_links` | JWT + `project_creator` or `org_admin` | `project_created` | Project created; redirected to Implementation page; appears in Portfolio |
| Implementation Page load | `get_project_detail` Edge Function or Supabase query | `projects`, `milestones`, `deliverables`, `tasks`, `project_members` | JWT + RLS (project member) | None | All hierarchy levels loaded; top indicators calculated; all 5 states handled |
| Top indicators calculation | Derived from `get_project_detail` response | `projects`, `milestones`, `deliverables`, `tasks` | Same as project load | None | All 7 indicators display correct counts/percentages |
| Add Milestone submit | Supabase insert or `create_milestone` Edge Function | `milestones` | JWT + `project_leader` or `org_admin` | `milestone_created` | Milestone appears in hierarchy immediately; Timeline updates |
| Add Deliverable submit | Supabase insert or `create_deliverable` Edge Function | `deliverables` | JWT + `milestone_leader` or above | `deliverable_created` | Deliverable appears under milestone |
| Add Task submit | Supabase insert or `create_task` Edge Function | `tasks`, `notifications` | JWT + `deliverable_leader` or above | `task_created` | Task appears; assignee notified |
| Task status update | Supabase update or `update_task_status` Edge Function | `tasks`, `status_logs` | JWT + `task_owner` or above | `task_status_updated` | Status updated; status_log entry created; watchdog re-evaluates |
| Evidence upload | `upload_evidence` Edge Function | `evidence_items`, Supabase Storage `pit-evidence` | JWT + `task_owner` | `evidence_submitted` | File stored; evidence_items row created; reviewer notified |
| Evidence approve | `approve_evidence` Edge Function | `evidence_items` | JWT + `reviewer` or above | `evidence_approved` | Status set to `approved`; task owner notified; task may auto-advance |
| Evidence return | `return_evidence` Edge Function | `evidence_items` | JWT + `reviewer` or above | `evidence_returned` | Status set to `returned`; task owner notified |
| Timeline load | `get_project_timeline` Edge Function or Supabase query | `projects`, `milestones`, `deliverables` | JWT + project member | None | Gantt bars render; conflict indicators shown; all 5 states handled |
| Milestone date drag/update | `update_milestone_dates` Edge Function | `milestones`, `deliverables` (cascade) | JWT + `project_leader` or above | `milestone_dates_updated` | Confirmation dialog shown; dates updated; cascade applied |
| Deliverable date update | `update_deliverable_dates` Edge Function | `deliverables`, `tasks` (cascade) | JWT + `milestone_leader` or above | `deliverable_dates_updated` | Dates updated; conflict indicators refreshed |
| Watchdog Dashboard load | `get_watchdog_items` Edge Function or Supabase query | `tasks`, `milestones`, `deliverables`, `escalation_log` | JWT + `project_leader` or above + RLS org scope | None | Flagged items listed; all 5 states handled |
| Escalation action | `create_escalation` Edge Function | `escalation_log`, `notifications`, `audit_log` | JWT + `project_leader` or above | `escalation_created` | Escalation logged; relevant parties notified |
| Report generate | `generate_report` Edge Function | `projects`, `milestones`, `deliverables`, `tasks`, `evidence_items`, `users`, `organisations` | JWT + `reporter` role | `report_generated` | Report generated; download triggered; report history updated |
| Audit log load | Supabase query (read-only) | `audit_log` | JWT + `auditor` or `org_admin` | None | Filtered entries rendered; export available |
| Admin settings save | Supabase update or `update_org_settings` Edge Function | `organisations`, `organisation_settings`, `roles`, `notification_templates` | JWT + `pit_admin` or `org_admin` | `settings_updated` | Settings saved; confirmation toast |
| User invite (from team management) | `send_invitation` Edge Function | `invitations`, `notifications` | JWT + `org_admin` | `invitation_sent` | Invitation email sent; pending invitation shown in team list |
| Notification bell open | Supabase query | `notifications` filtered by `user_id` | JWT (own notifications only) | None | Unread notifications shown; mark-as-read available |
| Sign out | `supabase.auth.signOut` | `auth.sessions` | JWT | None | Session cleared; redirected to Landing screen |

---

## Section 8: AIMC-Only AI Touchpoints

### 8.1 AIMC Architecture Requirement

**ALL AI functionality in PIT MUST be routed through the Maturion AIMC (AI Management and Control) Gateway.** Direct calls to OpenAI, Anthropic, or any AI model provider from PIT frontend or backend code are **strictly prohibited** per App Description §AD-14. This is a hard governance constraint with no exceptions.

### 8.2 PIT AIMC Touchpoints

The following screens and actions invoke AIMC capabilities:

#### Touchpoint AI-1 — Task Detail: AI Advisor Suggestion Panel

**Screen**: Task Management Page (Screen 11), Implementation Page (Screen 6) task detail drawer  
**Trigger**: User clicks "AI Advisor" button / panel expand  
**What AIMC does**: Analyses the task description, current status, due date, and project context; suggests next actions, identifies risks, or highlights similar completed tasks as reference.  
**UI component type**: Expandable side panel labelled "AI Advisor". Suggestions rendered as a bulleted list with confidence indicators.  
**Human approval mechanism**: User explicitly clicks "Apply suggestion" for any AI suggestion to take effect. Suggestions never auto-apply. Dismissed suggestions are logged.  
**AIMC invocation**: Via `/api/aimc/pit/task-advisor` Edge Function endpoint.  
**Prohibited**: Direct call to OpenAI/Anthropic API.  
**Audit**: AIMC invocation and user accept/dismiss actions logged in `audit_log`.

---

#### Touchpoint AI-2 — Portfolio Dashboard: Project Risk Highlight

**Screen**: Portfolio Dashboard (Screen 5)  
**Trigger**: Periodic or on-demand "Analyse portfolio" button  
**What AIMC does**: Reviews all active projects' progress vs. plan; highlights top 3 at-risk projects with plain-language explanations.  
**UI component type**: Floating suggestion card on the Portfolio Dashboard — "AI Risk Insights". Dismissible.  
**Human approval mechanism**: Insights are read-only suggestions. No data changes without explicit user action. User clicks a project card to review and decide independently.  
**AIMC invocation**: Via `/api/aimc/pit/portfolio-risk-analysis` Edge Function endpoint.  
**Prohibited**: Direct provider calls. AI output must not be used to automatically change project status or escalation flags.

---

#### Touchpoint AI-3 — Watchdog Dashboard: Escalation Recommendation

**Screen**: Watchdog Dashboard (Screen 14)  
**Trigger**: User clicks "Get AI recommendation" on a flagged item  
**What AIMC does**: Reviews escalation history, task details, and similar past escalations; recommends action (escalate / reassign / extend / acknowledge) with rationale.  
**UI component type**: Inline recommendation box below the item detail. Displays recommended action + rationale text.  
**Human approval mechanism**: "Apply recommendation" button. User must explicitly click to apply. Recommendation alone creates no changes.  
**AIMC invocation**: Via `/api/aimc/pit/escalation-advisor` Edge Function endpoint.  
**Prohibited**: AI must not auto-escalate. All escalation actions require human confirmation.

---

#### Touchpoint AI-4 — Report Generation: AI Executive Summary

**Screen**: Reports and Exports Screen (Screen 15)  
**Trigger**: Optional checkbox "Include AI Executive Summary" during report generation  
**What AIMC does**: Generates a plain-language executive summary of the report data (key findings, progress highlights, risk flags, recommended focus areas).  
**UI component type**: Summary text block prepended to the generated report (clearly labelled "AI-Generated Summary — Review before distribution").  
**Human approval mechanism**: Summary is included in the report only if user opts in. User can edit the summary text before finalising download.  
**AIMC invocation**: Via `/api/aimc/pit/report-summary` Edge Function endpoint within `generate_report` Edge Function.

---

### 8.3 AI Touchpoint Prohibition Summary

| Prohibited Action | Reason |
|---|---|
| Direct call to `api.openai.com` from any PIT component | AD-14 — all AI calls must route via AIMC Gateway |
| Direct call to `api.anthropic.com` from any PIT component | AD-14 — same |
| Auto-applying AI suggestions without user confirmation | Governance — AI must support, not replace, human decisions |
| Storing AI-generated content without audit trace | AD-22 — all AI actions must be logged |
| Using AI output as the sole basis for project status changes | Governance — human decision is required |

---

## Section 9: Deployment Surface Map

Every route in PIT must be covered by deployment wave evidence. The following map defines all routes and their deployment verification requirements.

| Route | Screen | Auth Required | Role Required | Deployment Wave Evidence |
|---|---|---|---|---|
| `/` | Landing Screen | No | None | Wave: verify page loads without auth; Sign In and Sign Up CTAs present |
| `/login` | Login Screen | No | None | Wave: login form submits; success redirects to `/dashboard`; invalid credentials show error |
| `/signup` | Signup Screen | No | None | Wave: signup form submits; email verification flow initiated; duplicate email shows error |
| `/forgot-password` | Forgot-Password Screen | No | None | Wave: email submission shows confirmation; Supabase email received |
| `/reset-password` | Reset-Password Screen | Recovery token | None | Wave: valid token shows form; password update succeeds; expired token shows error |
| `/invite/[token]` | Invitation Acceptance Screen | Token-based | None | Wave: valid invitation token shows acceptance form; acceptance links user to org |
| `/onboarding` | Onboarding Screen | Yes | Any authenticated | Wave: new user directed to onboarding; all 4 steps navigable; completion redirects to dashboard |
| `/dashboard` | Portfolio Dashboard | Yes | `viewer` or above | Wave: projects list renders; correct RLS scope; New Project button visible for permitted roles |
| `/projects/[id]` | Implementation Page | Yes | Project member | Wave: hierarchy renders; top 7 indicators calculated correctly; Add Milestone/Deliverable/Task functional |
| `/projects/[id]/timeline` | Timeline / Gantt Page | Yes | Project member | Wave: Gantt renders milestones and deliverables; date bars accurate; drag updates dates |
| `/projects/[id]/milestones` | Milestone Management | Yes | Project member | Wave: milestones list renders; Add Deliverable functional |
| `/projects/[id]/milestones/[mid]/deliverables/[did]` | Deliverable Management | Yes | Project member | Wave: deliverable detail renders; tasks list renders; Add Task functional |
| `/projects/[id]/tasks/[tid]` | Task Management | Yes | Project member | Wave: task detail renders; status update functional; evidence section visible |
| `/projects/[id]/team` | Assignment / Invitation Management | Yes | `project_leader` or above | Wave: team list renders; invite sends email; role assignment saves |
| `/tasks/[tid]/evidence` | Evidence Upload and Review | Yes | `task_owner` or `reviewer` | Wave: evidence list renders; file upload stores to Supabase Storage; approve/return functional |
| `/watchdog` | Watchdog Dashboard | Yes | `project_leader` or above | Wave: flagged items render; escalate/reassign/acknowledge actions save; notifications sent |
| `/reports` | Reports and Exports | Yes | `reporter` or above | Wave: report type selection renders; generate produces downloadable file; format options work |
| `/audit-log` | Audit Log | Yes | `auditor` or `org_admin` | Wave: audit log entries render; filtering works; CSV export works |
| `/qa-dashboard` | QA Dashboard | Yes | `cs2_admin` | Wave: QA metrics render; test history visible |
| `/admin` | Admin Settings (root) | Yes | `pit_admin` or `org_admin` | Wave: settings root renders; navigation to sub-sections works |
| `/admin/users` | Admin — User Management | Yes | `pit_admin` or `org_admin` | Wave: user list renders; invite sends; role assignment saves |
| `/admin/roles` | Admin — Role Management | Yes | `org_admin` | Wave: role list renders; custom role creation saves |
| `/admin/integrations` | Admin — Integration Settings | Yes | `pit_admin` or `org_admin` | Wave: integration config renders; save updates settings |
| `/admin/notifications` | Admin — Notification Templates | Yes | `pit_admin` or `org_admin` | Wave: notification templates render; save updates templates |
| `/admin/task-clusters` | Admin — Task Cluster Templates | Yes | `pit_admin` or `org_admin` | Wave: template list renders; create/edit/delete functional |
| `/my-work` | My Work (personal task view) | Yes | `task_owner` or above | Wave: personal task list renders; tasks assigned to current user only; status updates save |
| `/*` (unmatched) | 404 Not Found | No | None | Wave: non-existent route shows 404 page; "Go Home" link works |

**Deployment Infrastructure Requirement** (from L-006):
- `vercel.json` must include SPA fallback rewrite rule for all non-asset routes.
- Supabase Storage bucket `pit-evidence` must be created and RLS policies applied before deployment wave.
- All AIMC Edge Function endpoints must be deployed and tested before AI touchpoints are live.

---

## Section 10: Open Items and Stage 3 Prerequisites

The following items are open or require resolution before Stage 3 (FRS) can proceed:

### Open Item 1 — Invitation-Only vs. Open Signup Configuration

**Item**: The App Description does not definitively specify whether PIT supports open public signup or is invite-only per organisation. Current spec (Journey 3) treats this as a configurable organisation-level setting.  
**Stage 3 action**: FRS must define this as a hard requirement. Default configuration (invite-only vs. open) must be specified.  
**Owner**: CS2 / Johan Ras decision required before FRS.

---

### Open Item 2 — Dependency Wiring Between Tasks

**Item**: Task dependencies (Task A must complete before Task B can start) are referenced in Section 6.3 (Gantt dependency arrows). The `task_dependencies` table is referenced but not fully modelled in this spec.  
**Stage 3 action**: FRS must include a complete requirements specification for dependency management, including UI behaviour for blocked tasks and cascade effects.

---

### Open Item 3 — Multi-Organisation Portfolio Scope

**Item**: The App Description specifies cross-organisation visibility for Org Super Admins. The Portfolio Dashboard spec in this document addresses multi-org switching but the full data scoping requirements for cross-org reports and audit logs need FRS specification.  
**Stage 3 action**: FRS must define RLS policies for cross-org scenarios.

---

### Open Item 4 — AIMC Endpoint Configuration

**Item**: The AIMC Gateway endpoint paths (`/api/aimc/pit/...`) are specified in this document but depend on the AIMC module's routing configuration. The exact endpoint paths may change pending AIMC integration spec.  
**Stage 3 action**: FRS/TRS must confirm AIMC endpoint paths with the AIMC module owner before Stage 6 QA-to-Red.

---

### Open Item 5 — Notification Delivery Infrastructure (Email)

**Item**: In-app notifications via Supabase Realtime are specified. Email notification delivery depends on an email provider (e.g., Resend, Postmark, or Supabase email). The specific provider has not been selected.  
**Stage 3 action**: TRS must specify the email delivery provider and configuration.  
**Stage 4 (TRS) prerequisite**.

---

### Open Item 6 — Report Generation Technology (Server-Side Rendering)

**Item**: PDF and XLSX report generation requires server-side rendering. The specific library (e.g., Puppeteer for PDF, ExcelJS for XLSX) has not been confirmed.  
**Stage 3/4 action**: TRS must specify the report generation library and confirm it is compatible with the Supabase Edge Function runtime.

---

### Open Item 7 — Task Cluster Template Schema

**Item**: Task Cluster Templates (Section 1, Journey 14; Admin Screen 18) are referenced but the full schema (how templates are stored, versioned, applied, and overridden) is not specified in this Stage 2 document.  
**Stage 3 action**: FRS must include a complete task cluster template requirements specification.

---

### Open Item 8 — Integration with Upstream Modules

**Item**: The App Description specifies that PIT receives work items from Maturity Roadmap, Risk Management, and Incident Management. The integration wiring (webhook, polling, or direct Supabase cross-module query) is not specified in this document.  
**Stage 3 action**: FRS must define integration requirements per upstream module. Cross-module integration may require a separate Integration Builder delegation.

---

### Stage 3 Prerequisite Checklist

Before Stage 3 (FRS) can commence, the following must be true:

- [ ] This Stage 2 document has been reviewed and approved by Foreman
- [ ] Open Item 1 (signup configuration) resolved by CS2
- [ ] All auth routes (Journey 1–9) confirmed by CS2/Foreman as complete
- [ ] All 5 UI states confirmed for all primary screens
- [ ] All 7 top indicators confirmed for Implementation Page
- [ ] Deployment surface map confirmed as complete (no routes missing)
- [ ] AIMC gateway endpoint paths confirmed with AIMC module owner
- [ ] Improvement register updated with any design oversights discovered during Stage 2 (L-008)

---

**End of PIT UX Workflow & Wiring Spec v0.1-draft**
