# PIT — Technical Requirements Specification (TRS)

## Stage 4 — Pre-Build Specification Artifact

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Application Name | Project Implementation Tracker |
| Artifact Type | Technical Requirements Specification (TRS — Stage 4) |
| Version | v0.2-draft |
| Status | **DRAFT_UPDATED — Stage 2 and Stage 3 baselines re-confirmed by CS2; Stage 4 technical validation update prepared for CS2 review (maturion-isms#1604)** |
| Approval Status | Not approved — pending CS2 Stage 4 TRS approval/re-confirmation |
| Derived From (Stage 1) | `docs/governance/PIT_APP_DESCRIPTION.md` v1.0 (CS2 Approved 2026-05-06, ref: maturion-isms#1540) |
| Derived From (Stage 2) | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.2 baseline (CS2 re-confirmed in tracker context) |
| Derived From (Stage 3) | `modules/pit/02-frs/functional-requirements.md` **v0.2-hardened** baseline (CS2 re-confirmed in tracker context) |
| Author | foreman-v2-agent (POLC-Orchestration mode) |
| Date | 2026-05-07; updated 2026-05-08 (retrofit wave maturion-isms#1575 / PR #1576) |
| Issue | maturion-isms#1554 (original); maturion-isms#1575 (retrofit — PIT-TR-116 to PIT-TR-126 added) |
| Pre-Build Authority | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 |

> **Governance Note:** This TRS is a Stage 4 draft artifact under CS2 review. Stage 2 UX and Stage 3 FRS baselines are now re-confirmed in tracker context; Stage 5 Architecture remains blocked until this Stage 4 TRS is explicitly approved/gate-passed by CS2. Build Authorization remains NOT CLEARED. This TRS does not authorise code implementation, builder appointment, schema migration, or deployment.

> **Retrofit Note (maturion-isms#1575):** This TRS was updated in the PIT pre-build functional delivery retrofit wave (PR #1576) to propagate PIT-FR-113 through PIT-FR-123 from FRS v0.2-hardened into new technical requirements PIT-TR-116 through PIT-TR-126. The stale Issue #1556 dependency notice has been resolved: Section 31 of this document now contains the technical requirements derived from FRS v0.2-hardened additions. The derivation source is now listed as FRS v0.2-hardened (pending CS2 approval) rather than v0.1-draft.

---

## 0. Derivation Statement and Change-Propagation Note

This Technical Requirements Specification (TRS) translates the functional requirements of PIT into technical constraints and implementation contracts. It derives exclusively from:

1. **Stage 1** — `docs/governance/PIT_APP_DESCRIPTION.md` v1.0 (CS2 Approved 2026-05-06)
2. **Stage 2** — `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.2-draft (Foreman-reviewed 2026-05-06)
3. **Stage 3** — `modules/pit/02-frs/functional-requirements.md` **v0.2-hardened** baseline (re-confirmed in tracker context)

Any conflict discovered between this TRS and the FRS, UX Wiring Spec, or App Description **must be resolved upstream** before Stage 5 Architecture proceeds. Changes in upstream stages propagate to this TRS per L-008.

### MMM Carry-Forward Controls

PIT inherits eight build-process improvement controls from MMM (L-001 through L-008). These controls are binding on this TRS and all downstream artifacts. Each is converted to an explicit PIT-TR requirement below.

---

## 1. Scope Summary

### 1.1 In Scope (TRS)

The TRS defines technical constraints and implementation contracts for:

- Runtime and deployment baseline (tech stack)
- Frontend SPA architecture requirements
- Routing, SPA fallback, and protected route guard implementation
- Auth/session technical requirements
- Role/access-control implementation requirements
- Data model and table candidates
- Relationship and referential-integrity requirements
- RLS policy design requirements
- API and Edge Function contracts
- AIMC integration technical requirements
- Notification system technical requirements
- Evidence upload and storage technical requirements
- Timeline/Gantt technical requirements
- Reporting and export technical requirements
- Audit log technical requirements
- QA Dashboard technical requirements
- Performance requirements
- Security requirements
- Observability and logging requirements
- Error handling and state management requirements
- Deployment, environment, and secrets requirements
- Tool validation and quality gate definitions
- MMM carry-forward controls (L-001 through L-008) as technical requirements

### 1.2 Out of Scope (TRS Boundary)

The following are explicitly NOT in scope for this TRS:

- Application code (TypeScript, CSS, HTML)
- Database schema migrations or DDL scripts
- CI workflow changes
- Infrastructure configuration or deployment scripts
- QA test case specifications (Stage 6)
- Architecture component decisions (Stage 5)
- Builder appointment or build authorisation
- CS2 approval of any stage (not granted by this document)

---

## 2. Requirement Numbering Scheme

Technical requirements are identified as `PIT-TR-NNN` (three-digit, zero-padded, starting at 001). Requirements within a technical domain share sequential IDs. Each requirement is phrased as a technical constraint or implementation contract.

---

## 3. FRS-to-TRS Domain Mapping

| FRS Requirement Group | FRS IDs | TRS Technical Domain |
|---|---|---|
| Role hierarchy and access | PIT-FR-001, PIT-FR-002 | Roles/RBAC implementation |
| Auth and onboarding | PIT-FR-003 to PIT-FR-015, PIT-FR-110 | Auth/session, routing |
| Five-state UI and app shell | PIT-FR-016, PIT-FR-017 | Frontend architecture, error handling |
| App shell and navigation | PIT-FR-018 to PIT-FR-021 | Frontend architecture |
| Notifications | PIT-FR-022 to PIT-FR-026 | Notification system |
| Portfolio dashboard | PIT-FR-027 to PIT-FR-030 | API/data layer |
| Project creation | PIT-FR-031 to PIT-FR-035 | Data model, API |
| Implementation page | PIT-FR-036 to PIT-FR-045 | Frontend, API |
| Project hierarchy | PIT-FR-046, PIT-FR-047 | Data model, API |
| Milestones | PIT-FR-048 to PIT-FR-050 | Data model, API |
| Deliverables | PIT-FR-051, PIT-FR-052 | Data model, API |
| Tasks | PIT-FR-053 to PIT-FR-057 | Data model, API |
| Assignment/invitations | PIT-FR-058 to PIT-FR-061 | Auth, Edge Functions |
| Evidence | PIT-FR-062 to PIT-FR-067 | Storage, API |
| Timeline/Gantt | PIT-FR-068 to PIT-FR-076 | Frontend (Gantt), API |
| Watchdog/escalation | PIT-FR-077 to PIT-FR-079 | API, Edge Functions |
| Reports/exports | PIT-FR-080 to PIT-FR-084 | Edge Functions, storage |
| Filters | PIT-FR-085, PIT-FR-086 | API query |
| Audit log | PIT-FR-087 to PIT-FR-089 | Audit log table, RLS |
| Admin/settings | PIT-FR-090 to PIT-FR-092, PIT-FR-106 to PIT-FR-109 | Admin API |
| QA Dashboard | PIT-FR-093, PIT-FR-094 | RLS, data |
| AIMC | PIT-FR-095 to PIT-FR-099 | AIMC integration |
| Cross-module integrations | PIT-FR-100 to PIT-FR-102 | API, data model |
| Deployment surface | PIT-FR-103 to PIT-FR-105 | Deployment, routing |
| My Work | PIT-FR-111, PIT-FR-112 | API, frontend |
| Permission Negative-Path Contract | PIT-FR-113 | RBAC / RLS enforcement |
| Progress Roll-Up Method | PIT-FR-114 | Data model, API |
| Notification Read / History / Preferences | PIT-FR-115 to PIT-FR-117 | Notification system |
| Report Permissions / States / History | PIT-FR-118, PIT-FR-119 | Reporting, storage |
| QA Dashboard Enhanced | PIT-FR-120 | QA Dashboard, RLS |
| Lifecycle Removal Semantics | PIT-FR-121 | Data model, API, RLS |
| Accessibility Outcomes | PIT-FR-122 | Frontend, tooling |
| Bulk Operations Non-Scope | PIT-FR-123 | Non-functional — explicit exclusion |
| Non-functional placeholders | NF-001 to NF-010 | Performance, security, tool validation |
| MMM controls | L-001 to L-008 | Cross-cutting technical controls |

---

## 4. Runtime and Deployment Baseline

### PIT-TR-001 — Frontend Runtime

The PIT frontend must be implemented as a React Single-Page Application (SPA) using TypeScript. React Router v6 or later must be used for client-side routing.

**Derived from**: §AD-16, NF-001 (TRS)

### PIT-TR-002 — Backend Runtime

The PIT backend must use Supabase, comprising: PostgreSQL database (managed by Supabase), Supabase Auth (JWT-based), Supabase Edge Functions (Deno runtime), Supabase Storage, and Supabase Realtime.

**Derived from**: §AD-16, NF-007 (TRS)

### PIT-TR-003 — Deployment Target (Candidate)

The primary deployment target candidate is Vercel. A `vercel.json` SPA fallback rewrite rule must be configured. If an alternative platform is chosen at Architecture stage, an equivalent SPA fallback mechanism is required. Final deployment target must be confirmed before Stage 7 PBFAG.

**Derived from**: PIT-FR-014, §UX-SEC-9, L-006

### PIT-TR-004 — State Management

TanStack Query (React Query) is the candidate library for server-state management (data fetching, caching, synchronisation). Client-only state may use React context or `useState`. Final selection confirmed at Architecture stage.

**Derived from**: NF-001 (performance baseline)

### PIT-TR-005 — TypeScript Strictness

All PIT source files must be TypeScript. The TypeScript configuration must enable `strict: true`. Zero TypeScript compilation errors is a required quality gate.

**Derived from**: PIT-TR-001, tool validation requirements

---

## 5. Frontend Architecture Requirements

### PIT-TR-006 — React SPA with Root Layout

The application must implement a root-level layout component that wraps all authenticated routes. This root layout must render: the persistent app shell (sidebar + top nav), the `NotificationProvider`, the `AuthProvider`, and the main content `<Outlet />`.

**Derived from**: PIT-FR-017, PIT-FR-018, PIT-FR-022

### PIT-TR-007 — NotificationProvider at Root

The `NotificationProvider` must be mounted at the root layout level, above all route components. No per-page notification subscription is permitted. The provider establishes the Supabase Realtime subscription on the `notifications` table filtered to the current user.

**Derived from**: PIT-FR-022; L-002 (app shell completeness)

### PIT-TR-008 — AuthProvider with Session Management

An `AuthProvider` must wrap the entire application, providing session state (current user, role, loading) to all child components via context. The provider must handle: session restoration on page load, token refresh, and session expiry logout.

**Derived from**: PIT-FR-003, PIT-FR-013

### PIT-TR-009 — Global CSS and App Shell Completeness

Global CSS (reset, typography, CSS variables, app shell layout) must be loaded at the root level, not per-page. The app shell (sidebar + top nav) must render in all five UI states. White screens and layout flash are disqualifying defects.

**Derived from**: L-002; PIT-FR-017

### PIT-TR-010 — Global Error Boundary

A React error boundary must be implemented at the root level. Unhandled rendering errors must render a generic error state (not a white screen). The error boundary must log the error to the observability system.

**Derived from**: PIT-FR-016 (error state); error-handling requirements

---

## 6. Routing and SPA Fallback Requirements

### PIT-TR-011 — All 27 Routes Registered

All 27 routes defined in §UX-SEC-9 (Deployment Surface Map) of the UX Wiring Spec must be registered in the React Router configuration. Missing route registrations are a hard defect.

**Derived from**: PIT-FR-103

### PIT-TR-012 — Public Routes Enumeration

The following routes are public (no authentication required): `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/invite/[token]`. All other routes are protected.

**Derived from**: PIT-FR-013

### PIT-TR-013 — Protected Route Guard Implementation

A `ProtectedRoute` wrapper component must intercept all unauthenticated requests to protected routes, store the intended destination path in `sessionStorage` under the key `pit_intended_destination`, and redirect to `/login`.

**Derived from**: PIT-FR-013, PIT-FR-005

### PIT-TR-014 — Post-Login Redirect

After successful login, the authentication handler must read `pit_intended_destination` from `sessionStorage`, redirect to that path if set, and clear the key. If not set, redirect to `/dashboard`.

**Derived from**: PIT-FR-005

### PIT-TR-015 — SPA Fallback

The deployment must serve `index.html` for all non-asset paths. For Vercel: `vercel.json` must include `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`. For any other platform, an equivalent fallback mechanism must be documented in the deployment contract.

**Derived from**: PIT-FR-014; L-006

### PIT-TR-016 — 404 Route

A catch-all `*` route must be registered in React Router that renders a dedicated 404 Not Found page with a "Go Home" link navigating to `/dashboard` (or `/` if unauthenticated).

**Derived from**: PIT-FR-104

### PIT-TR-017 — Auth Route Discoverability

All auth routes (`/login`, `/signup`, `/forgot-password`, `/reset-password`) must be registered and discoverable by the router. Auth routes must not return 404 in any deployment environment.

**Derived from**: L-004; PIT-FR-003 to PIT-FR-012

---

## 7. Auth/Session Technical Requirements

### PIT-TR-018 — Supabase Auth JWT Sessions

Authentication must use Supabase Auth. Sessions are JWT-based. The Supabase JS client handles token storage (localStorage by default) and automatic refresh. The JWT expiry is 1 hour (Supabase default); refresh tokens extend the session.

**Derived from**: PIT-FR-003, PIT-FR-013

### PIT-TR-019 — Email Verification Contract

After signup, Supabase Auth sends an email verification link. The user cannot access protected routes until the email is verified. The Supabase Auth email confirmation setting must be enabled in the Supabase project.

**Derived from**: PIT-FR-006

### PIT-TR-020 — Password Reset Token Contract

Password reset tokens are issued by Supabase Auth via `auth.resetPasswordForEmail()`. Token expiry is server-side enforced by Supabase. The frontend must handle expired-token errors and display the error state with a retry CTA.

**Derived from**: PIT-FR-012

### PIT-TR-021 — Invitation Token Validation Edge Function

An Edge Function `validate_invitation` must accept `POST /invite/validate` with `{ token: string }` in the request body. It must:
- Validate the token against the `invitations` table.
- Check the token expiry date server-side.
- Return `{ valid: true, email, org_name, inviter_name, role, is_new_user: bool }` on success.
- Return `{ valid: false, error: "expired" | "invalid" }` on failure.
- Require no authentication (public Edge Function).

**Derived from**: PIT-FR-008

### PIT-TR-022 — Invitation Acceptance Edge Function

An Edge Function `accept_invitation` must accept `POST /invite/accept` with `{ token, password? }`. It must:
- Validate the token.
- For new users: create the Supabase Auth user with the provided password, link to the organisation.
- For existing users: link the user to the organisation.
- Delete or mark the invitation as used.
- Return `{ success: true, redirect: "/onboarding" | "/dashboard" }`.

**Derived from**: PIT-FR-009, PIT-FR-010

---

## 8. Role/Access-Control Implementation Requirements

### PIT-TR-023 — Role Hierarchy Storage

User roles must be stored in a `user_roles` table with the schema: `(id, user_id, org_id, project_id NULLABLE, role, created_at)`. When `project_id` is NULL, the role applies organisation-wide. When `project_id` is set, the role is project-scoped.

**Derived from**: PIT-FR-001, PIT-FR-061

### PIT-TR-024 — Role-Gated Navigation

Navigation items in the sidebar must be conditionally rendered based on the user's effective role for the current organisation and project. Items must be hidden (not greyed out) for roles without access.

**Derived from**: PIT-FR-002

### PIT-TR-025 — Permission-Denied State

When a user navigates directly to a URL they are not authorised to access, the route component must render the permission-denied state (not a 404 and not a redirect to login). The permission-denied state must include a CTA to a safe destination (e.g. `/dashboard`).

**Derived from**: PIT-FR-002; L-003

### PIT-TR-026 — RLS as First-Class Enforcement Layer

Row-Level Security (RLS) must be enabled on all Supabase tables. RLS is the primary enforcement layer for data access. Frontend role-checking is supplementary only and must not be relied upon as the sole access control.

**Derived from**: PIT-FR-101; security requirements

---

## 9. Data Model and Table Definitions

### PIT-TR-027 — Canonical Table Candidates

The following tables are required by the PIT data model. Final schema (column types, constraints, indexes) is delegated to Stage 5 Architecture. TRS defines the logical structure and relationships.

| Table | Purpose | Key FRS Source |
|---|---|---|
| `profiles` | Extended user data (name, avatar, preferences) linked to Supabase `auth.users` | PIT-FR-001 |
| `organisations` | Organisation records | PIT-FR-019, PIT-FR-090 |
| `user_org_memberships` | Links users to organisations | PIT-FR-019, PIT-FR-091 |
| `user_roles` | Role assignments per user per org (project-scoped optional) | PIT-FR-001, PIT-FR-061 |
| `projects` | Project records | PIT-FR-031 to PIT-FR-035 |
| `milestones` | Milestones within projects | PIT-FR-048 to PIT-FR-050 |
| `deliverables` | Deliverables within milestones | PIT-FR-051, PIT-FR-052 |
| `tasks` | Tasks within deliverables | PIT-FR-053 to PIT-FR-057 |
| `task_dependencies` | Task-to-task dependency links | PIT-FR-056 |
| `task_cluster_templates` | Reusable task cluster templates | PIT-FR-047 |
| `task_cluster_items` | Sub-task definitions within templates | PIT-FR-047 |
| `status_logs` | Status transition history for tasks | PIT-FR-054 |
| `evidence_items` | Evidence submissions linked to tasks | PIT-FR-062 to PIT-FR-067 |
| `invitations` | Invitation tokens for new and existing users | PIT-FR-008 to PIT-FR-010 |
| `notifications` | In-app notification records | PIT-FR-022 to PIT-FR-025 |
| `notification_preferences` | Per-user per-event email opt-in | PIT-FR-026 |
| `audit_log` | Append-only audit event log | PIT-FR-087 to PIT-FR-089 |
| `escalation_log` | Escalation action records | PIT-FR-079 |
| `watchdog_flags` | Active watchdog flags on items | PIT-FR-077, PIT-FR-078 |
| `report_history` | Record of generated reports with storage references | PIT-FR-084 |
| `source_links` | Links from projects to upstream module items | PIT-FR-034, PIT-FR-100 |
| `integration_configs` | Upstream module integration configuration per org | PIT-FR-102 |

### PIT-TR-028 — Profiles Table

The `profiles` table must extend `auth.users` with: `id` (FK to `auth.users.id`), `full_name`, `avatar_url`, `preferences (jsonb)`, `created_at`, `updated_at`. Every `auth.users` row must have a corresponding `profiles` row (maintained by a database trigger on user creation).

**Derived from**: PIT-FR-015 (onboarding profile step)

### PIT-TR-029 — Projects Table

The `projects` table must include: `id`, `org_id` (FK to `organisations`), `name`, `type` (`project | operational | improvement`), `quick_win_type` (`quick_win | medium_term | long_term`), `description`, `project_leader_id` (FK to `profiles`), `start_date` (date), `end_date` (date), `status`, `capex_amount`, `opex_amount`, `fiscal_year`, `created_at`, `updated_at`.

**Derived from**: PIT-FR-031 to PIT-FR-035

### PIT-TR-030 — Hierarchy Tables

`milestones` must include: `id`, `project_id` (FK), `name`, `description`, `milestone_leader_id`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`.

`deliverables` must include: `id`, `milestone_id` (FK), `name`, `description`, `deliverable_leader_id`, `evidence_required` (boolean), `status`, `created_at`, `updated_at`.

`tasks` must include: `id`, `deliverable_id` (FK), `name`, `description`, `task_owner_id`, `start_date`, `due_date`, `priority`, `status`, `progress_pct` (0–100), `evidence_required` (boolean), `capex_amount`, `opex_amount`, `cluster_template_id` (nullable FK), `created_at`, `updated_at`.

**Derived from**: PIT-FR-046 to PIT-FR-057

### PIT-TR-031 — Task Dependencies Table

`task_dependencies` must include: `id`, `task_id` (FK — the blocked task), `depends_on_task_id` (FK — the blocking task), `created_at`. A unique constraint on `(task_id, depends_on_task_id)` prevents duplicate entries. Circular dependency detection must be enforced server-side (before insert).

**Derived from**: PIT-FR-056

### PIT-TR-032 — Evidence Items Table

`evidence_items` must include: `id`, `task_id` (FK), `uploaded_by` (FK to `profiles`), `file_type`, `file_name`, `storage_path`, `url_or_note` (nullable — for URL/note evidence), `status` (`pending | approved | returned`), `reviewer_id` (nullable FK), `reviewer_comment` (nullable), `created_at`, `updated_at`.

**Derived from**: PIT-FR-062 to PIT-FR-067

### PIT-TR-033 — Invitations Table

`invitations` must include: `id`, `org_id` (FK), `invited_by` (FK to `profiles`), `email`, `role`, `token` (unique, cryptographically random), `expires_at`, `accepted_at` (nullable), `status` (`pending | accepted | expired`), `created_at`.

**Derived from**: PIT-FR-008 to PIT-FR-010

### PIT-TR-034 — Notifications Table

`notifications` must include: `id`, `user_id` (FK to `profiles`), `type` (`task_assigned | task_due_warning | task_overdue | evidence_submitted | evidence_approved | evidence_returned | escalation_triggered | invitation_received | membership_granted | watchdog_flag_raised`), `title`, `body`, `resource_type`, `resource_id`, `read` (boolean, default false), `created_at`.

**Derived from**: PIT-FR-025

### PIT-TR-035 — Audit Log Table

`audit_log` must include: `id`, `timestamp` (timestamptz), `actor_id` (FK to `profiles`), `action_type`, `resource_type`, `resource_id`, `old_value (jsonb nullable)`, `new_value (jsonb nullable)`, `ip_address`, `org_id` (FK). No UPDATE or DELETE is permitted on `audit_log` rows (append-only). RLS must enforce SELECT only for authorised roles.

**Derived from**: PIT-FR-087

### PIT-TR-036 — Source Links Table

`source_links` must include: `id`, `project_id` (FK), `source_type` (`risk | audit | incident | roadmap | manual`), `source_ref` (nullable — the external item ID), `created_at`. One project may have at most one source link (enforced by unique constraint on `project_id`).

**Derived from**: PIT-FR-034, PIT-FR-100

---

## 10. Relationship and Referential-Integrity Requirements

### PIT-TR-037 — Hierarchy Constraint

Every `task` must belong to a `deliverable`. Every `deliverable` must belong to a `milestone`. Every `milestone` must belong to a `project`. These constraints must be enforced at the database level via foreign key constraints with `ON DELETE` policies defined at Architecture stage.

**Derived from**: PIT-FR-046

### PIT-TR-038 — Org-Scoping Constraint

Every data table that contains project, task, or user data must include an `org_id` column (FK to `organisations`). Data access policies (RLS) must filter by `org_id` for all non-admin queries.

**Derived from**: PIT-FR-101

### PIT-TR-039 — Circular Dependency Detection

Before inserting into `task_dependencies`, the server must perform a graph traversal to detect whether adding the new dependency would create a cycle. The detection must be server-side (not client-side only). On detection, the insert must be rejected with a clear error message.

**Derived from**: PIT-FR-056

### PIT-TR-040 — Date Constraint Validation

Milestone start date must be ≥ project start date. Milestone end date must be ≤ project end date. Deliverable end date must be ≤ parent milestone end date (warning only — not hard block). These constraints must be checked by the API layer before insert/update.

**Derived from**: PIT-FR-049

---

## 11. RLS Policy Design Requirements

### PIT-TR-041 — RLS Enabled on All Tables

Row-Level Security must be enabled on all tables in the PIT schema. Tables without RLS enabled are a blocking defect.

**Derived from**: PIT-FR-101; security requirements

### PIT-TR-042 — Org-Scoped Read Policy

For all org-scoped tables (`projects`, `milestones`, `deliverables`, `tasks`, etc.), SELECT policies must restrict rows to those where `org_id` matches the current user's organisation memberships. Query: `EXISTS (SELECT 1 FROM user_org_memberships WHERE user_id = auth.uid() AND org_id = <table>.org_id)`.

**Derived from**: PIT-FR-101

### PIT-TR-043 — cs2_admin Cross-Org Policy

Users with the `cs2_admin` role must bypass org-scoped RLS restrictions for read operations (audit log, QA dashboard, reporting). This must be implemented as an additional SELECT policy: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'cs2_admin')`.

**Derived from**: PIT-FR-101, PIT-FR-093

### PIT-TR-044 — Audit Log RLS

The `audit_log` table SELECT policy must restrict to: users with role `auditor`, `org_admin`, or `cs2_admin`. No INSERT/UPDATE/DELETE policies for regular users. Server-side functions (Edge Functions using service role key) perform inserts.

**Derived from**: PIT-FR-087, PIT-FR-088

### PIT-TR-045 — Evidence Items RLS

Evidence items SELECT policy: project members (any role within the project's org), reviewers, project leaders, org admins, cs2_admin. Uploaded evidence must not be readable by users outside the project's organisation.

**Derived from**: PIT-FR-062 to PIT-FR-067

### PIT-TR-046 — QA Dashboard RLS

The data source for the QA Dashboard must restrict SELECT to `cs2_admin` role only. Any `qa_runs` or equivalent table must have RLS enforcing this.

**Derived from**: PIT-FR-093

### PIT-TR-047 — Write Policy Pattern

INSERT, UPDATE, and DELETE policies must validate the actor's role before permitting state changes. The general pattern: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND org_id = <table>.org_id AND role IN ('<permitted_roles>'))`.

**Derived from**: PIT-FR-001, PIT-FR-061

---

## 12. API / Edge Function Requirements

### PIT-TR-048 — Edge Function List

The following Edge Functions are required:

| Function | Route | Method | Auth Required | Purpose |
|---|---|---|---|---|
| `validate_invitation` | `/functions/v1/validate-invitation` | POST | No | Validate invitation token |
| `accept_invitation` | `/functions/v1/accept-invitation` | POST | No (new user) / Yes (existing) | Accept invitation |
| `generate_report` | `/functions/v1/generate-report` | POST | Yes | Server-side report generation |
| `watchdog_evaluation` | Scheduled / on-demand | POST | Service role | Evaluate and flag watchdog items |
| `pit-task-advisor` | `/functions/v1/pit-task-advisor` | POST | Yes | Proxy to AIMC task-advisor capability |
| `pit-portfolio-risk` | `/functions/v1/pit-portfolio-risk` | POST | Yes | Proxy to AIMC portfolio-risk capability |
| `pit-escalation-advisor` | `/functions/v1/pit-escalation-advisor` | POST | Yes | Proxy to AIMC escalation-advisor capability |
| `pit-report-summary` | `/functions/v1/pit-report-summary` | POST | Yes | Proxy to AIMC report-summary capability |

**Derived from**: PIT-FR-008 to PIT-FR-010, PIT-FR-077, PIT-FR-083, PIT-FR-095 to PIT-FR-099

### PIT-TR-049 — Edge Function Audit Obligation

All state-changing Edge Functions must write an entry to `audit_log` on every successful operation. The entry must include: actor, action type, resource type, resource ID, and relevant old/new values.

**Derived from**: PIT-FR-087

### PIT-TR-050 — Edge Function Error Contract

All Edge Functions must return structured JSON responses: `{ success: true, data: {...} }` on success and `{ success: false, error: { code, message } }` on failure. HTTP status codes must be semantically correct (200, 201, 400, 401, 403, 404, 500).

**Derived from**: error-handling requirements

### PIT-TR-051 — Service Role Key Usage

Edge Functions may use the Supabase service role key to bypass RLS where required (e.g. notification delivery, watchdog evaluation). The service role key must NEVER be exposed to client-side code. It must be stored as a Supabase Edge Function secret.

**Derived from**: PIT-TR-002; security requirements

---

## 13. AIMC Integration Technical Requirements

### PIT-TR-052 — AIMC Gateway Mandatory

ALL AI functionality must route through the Maturion AIMC Gateway. Direct API calls from any PIT frontend component, backend module, or Edge Function to OpenAI, Anthropic, or any AI model provider are strictly prohibited. This is a zero-tolerance constraint.

**Derived from**: PIT-FR-095

### PIT-TR-053 — AIMC Capability Names and Routes

The four AIMC capabilities for PIT are:

| Capability Name | Gateway Route | Edge Function Proxy |
|---|---|---|
| `pit.task-advisor` | `/api/aimc/pit/task-advisor` | `pit-task-advisor` |
| `pit.portfolio-risk-analysis` | `/api/aimc/pit/portfolio-risk-analysis` | `pit-portfolio-risk` |
| `pit.escalation-advisor` | `/api/aimc/pit/escalation-advisor` | `pit-escalation-advisor` |
| `pit.report-summary` | `/api/aimc/pit/report-summary` | `pit-report-summary` |

> Note: Final gateway route paths are subject to confirmation with the AIMC module owner before Stage 6 QA-to-Red (open assumption A-004).

**Derived from**: PIT-FR-096 to PIT-FR-099

### PIT-TR-054 — Human Approval Contract

No AI suggestion may auto-apply. Every AIMC response must be presented to the user for explicit accept or dismiss action. The accept/dismiss action must be logged in `audit_log` with the capability name, resource context, and user decision.

**Derived from**: PIT-FR-096, L-001

### PIT-TR-055 — AIMC Gateway Authentication

AIMC Edge Function proxies must authenticate to the AIMC Gateway using the `AIMC_API_KEY` secret. This key must be stored as a Supabase Edge Function secret and must NEVER be exposed to client-side code.

**Derived from**: PIT-FR-095; security requirements

---

## 14. Notification System Technical Requirements

### PIT-TR-056 — Real-Time Delivery via Supabase Realtime

In-app notification delivery must use Supabase Realtime subscription on the `notifications` table filtered to `user_id = auth.uid()`. The subscription must be established in `NotificationProvider` at root level.

**Derived from**: PIT-FR-023, PIT-TR-007

### PIT-TR-057 — Email Delivery Architecture

Email notifications must be sent via an Edge Function triggered by `notifications` table inserts (via Supabase database webhook or trigger). The email provider candidate is Resend; alternatives are Postmark and Supabase default email. Final provider selection deferred to Architecture stage (open assumption A-005). The `SMTP_API_KEY` or equivalent must be stored as an Edge Function secret.

**Derived from**: PIT-FR-026, NF-004 (TRS)

### PIT-TR-058 — Notification Preference Enforcement

Before sending an email notification, the Edge Function must check `notification_preferences` for the recipient user and event type. Email must not be sent if the user has disabled that event type.

**Derived from**: PIT-FR-026

### PIT-TR-059 — Notification Generation Contract

A notification record must be inserted into the `notifications` table for every event listed in PIT-FR-025. Notifications must be inserted server-side (Edge Function or database trigger) to ensure reliability. Client-side notification creation is prohibited.

**Derived from**: PIT-FR-025

---

## 15. Evidence Upload and Storage Technical Requirements

### PIT-TR-060 — Supabase Storage for Evidence

Evidence file uploads must be stored in Supabase Storage. The bucket must be private (not publicly readable). Bucket naming convention: `pit-evidence` with path-based org scoping (`{org_id}/{project_id}/{task_id}/{filename}`).

**Derived from**: PIT-FR-062, PIT-FR-105, NF-003 (TRS)

### PIT-TR-061 — Allowed File Types and Size

Evidence uploads must accept: PDF, DOCX, XLSX, PNG, JPG, GIF. Maximum file size: 50 MB per file (candidate — subject to CS2 decision, open assumption A-010). Uploads exceeding the limit must be rejected with a clear error.

**Derived from**: PIT-FR-062, PIT-FR-067

### PIT-TR-062 — Signed URL Access

Evidence files must be accessed via time-limited signed URLs generated by Supabase Storage. Signed URLs must expire after 1 hour. Direct file URL access without a signed URL must be blocked by the bucket access policy.

**Derived from**: PIT-FR-067; security requirements

### PIT-TR-063 — Evidence Status Lifecycle

Evidence status transitions must be: `pending → approved` (by reviewer) and `pending → returned` (by reviewer with mandatory comment). Returning to `pending` after `returned` is permitted (resubmission). Status transitions must be logged in `audit_log`.

**Derived from**: PIT-FR-064, PIT-FR-065

---

## 16. Timeline / Gantt Technical Requirements

### PIT-TR-064 — Timeline Rendering Model and Alignment Architecture Contract

The Timeline engine must be implemented as a split-plane layout with:
1. Fixed descriptor/progress columns on the left.
2. A horizontally scrollable time-grid on the right.
3. Shared row identity between both panes so project/milestone/deliverable/task rows never drift out of alignment.
4. Multi-row date headers that can render year/quarter/month/week/day denominators.
5. Bars and progress overlays rendered on the same coordinate system as the date grid.

Stage 5 Architecture must select and justify one rendering family (DOM/virtualised grid, SVG, Canvas, or hybrid). Generic "use a Gantt library" wording is insufficient.

**Derived from**: PIT-FR-068 to PIT-FR-076, PIT-FR-085, PIT-FR-086

### PIT-TR-065 — Timeline Tool/Library Selection Criteria Contract

Stage 5 Architecture must evaluate timeline tooling against these mandatory capabilities and document the final choice (including licensing, customisability, and testability):

- Exact date↔pixel mapping and inverse hover/cursor date resolution.
- Drag and resize handles for start/end updates.
- Progress overlay rendering inside each bar.
- Multi-row denominator headers (year/quarter/month/week/day).
- User-selectable denominator + viewport presets (e.g. 12 months, 4 quarters, 5 years).
- Horizontal scrolling for long ranges (minimum 10-year range).
- Row virtualisation for large datasets.
- Dependency/predecessor link rendering.
- Nested hierarchy rendering (project → milestone → deliverable → task).
- Keyboard/mouse accessibility support and compatible fallback views.
- Snapshot/export support.
- Styling compatibility with PIT/Maturion UI system.
- Testability through Playwright/E2E and visual regression checks.

No timeline tool may be selected only because it is easy to integrate.

**Derived from**: PIT-FR-068 to PIT-FR-076, PIT-FR-122, NF-005 (TRS)

### PIT-TR-066 — Timeline Date Mathematics and Alignment Contract

Timeline date calculations must use a canonical organisation timezone and enforce:

1. Milestone/deliverable/project boundaries persisted as ISO dates (`YYYY-MM-DD`).
2. Task scheduling supports predecessor + offset + duration logic with day/hour/minute precision for calculation.
3. Start date inclusive, internal end boundary exclusive, user-facing end date displayed as inclusive calendar day.
4. Date→pixel and pixel→date mappings share one denominator math contract (no drift between grid and bars).
5. Snap behaviour configurable per denominator (day/week/month).
6. Hover, drag, and handle labels all use the same mapping contract.
7. Progress overlay width = bar span × progress percentage.
8. DST/timezone edge cases neutralised by calendar-cell calculations in canonical timezone before display formatting.

**Derived from**: PIT-FR-072 to PIT-FR-076, PIT-FR-114

### PIT-TR-067 — Timeline Interaction, Persistence, Performance, and QA Contract

The timeline subsystem must provide and persist:

1. Visual timeline creation/editing for project and milestone bars within project boundary constraints.
2. Deliverable timeline population from child task schedules.
3. Task schedule derivation from predecessor + offset + duration where direct manual dates are not supplied.
4. Drag body + start/end handles with visible date labels during drag.
5. Hover exact-date labels at any x-position over grid/bar.
6. Auto-scroll while dragging beyond visible viewport.
7. Denominator switching (year/quarter/month/week/day), collapsible header behaviour, and viewport presets while full range remains scrollable.
8. Timeline filters for project/milestone/deliverable/task/responsible person/company/department/date/status.
9. Persistence for predecessor links, offsets, durations, progress overlay values, timeline view settings, denominator/viewport settings, and collapsed/expanded states.
10. Locked timeline override/approval workflow: changing a locked project/milestone/deliverable timeline requires approval request + audit event before final mutation.
11. Stage 5/6 performance targets:
    - 10-year horizontal range supported.
    - 1,000 visible hierarchy rows supported with virtualisation.
    - Initial timeline render target ≤ 2 seconds (p95 reference dataset).
    - Drag interaction target ≥ 30 FPS where browser/device permits.
    - No descriptor/grid alignment drift under scroll, zoom, or resize.
12. Stage 6 QA-to-Red timeline tests for date-to-pixel exactness, drag date calculations, hover-date accuracy, overlay proportionality, denominator switching, viewport presets, long horizontal scroll, alignment integrity, filter correctness, predecessor-derived scheduling, and locked-change approval behaviour.

Task dependency arrows may render client-side, but server-side circular dependency validation (PIT-TR-039) remains mandatory for all dependency writes.

**Derived from**: PIT-FR-056, PIT-FR-068 to PIT-FR-076, PIT-FR-085, PIT-FR-086, PIT-FR-113, PIT-FR-121, PIT-FR-122

---

## 17. Reporting and Export Technical Requirements

### PIT-TR-068 — Report Generation via Edge Function

All report generation must be handled server-side by the `generate_report` Edge Function. The function accepts: `{ report_type, scope, format, include_ai_summary }` and returns either a download URL (async) or a streaming response (sync). Large datasets must use streaming or pagination to avoid Edge Function timeout.

**Derived from**: PIT-FR-083

### PIT-TR-069 — PDF Generation (Candidate Library)

PDF reports must be generated server-side. Candidate library: Puppeteer (headless Chromium) or a lightweight alternative. Final selection deferred to Architecture (open assumption A-007). The library must produce valid, downloadable `.pdf` files.

**Derived from**: PIT-FR-082, NF-005 (TRS)

### PIT-TR-070 — XLSX/CSV Generation

XLSX reports must be generated using ExcelJS or equivalent. CSV reports must be generated via native streaming. Both formats must be directly downloadable.

**Derived from**: PIT-FR-082

### PIT-TR-071 — Report Storage and History

Generated reports must be stored in Supabase Storage under a `pit-reports` bucket. A reference record must be inserted into `report_history`. Report files must be accessible via signed URL for download.

**Derived from**: PIT-FR-084

### PIT-TR-072 — AI Executive Summary Integration

When `include_ai_summary: true`, the `generate_report` Edge Function must call the `pit.report-summary` AIMC capability, receive the summary text, prepend it to the report with a clear "AI-Generated Summary — Review before distribution" label, and allow the user to edit the summary before finalising the download.

**Derived from**: PIT-FR-099

---

## 18. Audit Log Technical Requirements

### PIT-TR-073 — Append-Only Enforcement

The `audit_log` table must have UPDATE and DELETE disabled via RLS (no UPDATE or DELETE policies) and via database-level constraints where possible. All audit entries are inserted by server-side functions using the service role key.

**Derived from**: PIT-FR-087

### PIT-TR-074 — Server-Side Pagination for Audit Log

Audit log queries must use keyset pagination (cursor-based) or offset pagination with a maximum page size of 50 rows. The API must never load all audit log entries into memory in a single query.

**Derived from**: PIT-FR-089

### PIT-TR-075 — Audit Log CSV Export

The `generate_report` Edge Function must support report type `audit_trail`. The CSV export must be scoped to the current filter (action type, actor, project, date range) and accessible only to `auditor`, `org_admin`, or `cs2_admin` roles.

**Derived from**: PIT-FR-088

---

## 19. QA Dashboard Technical Requirements

### PIT-TR-076 — QA Dashboard Data Source

The QA Dashboard at `/qa-dashboard` must query a `qa_runs` table (or equivalent test result artifact store) containing: run ID, timestamp, suite name, total tests, passing, failing, skipped, coverage %, wave identifier, evidence artifact links.

**Derived from**: PIT-FR-094

### PIT-TR-077 — QA Dashboard Access Enforcement

The `/qa-dashboard` route must enforce `cs2_admin` role at both the RLS level (data query) and the route guard level (UI). Users without `cs2_admin` see the permission-denied state.

**Derived from**: PIT-FR-093

---

## 20. Performance Requirements

### PIT-TR-078 — API Response Time Targets

- Single-entity fetch (project, task, milestone): < 200 ms p95
- List queries (up to 100 records): < 500 ms p95
- Audit log page load (50-row page, 10,000-record dataset): < 2 seconds p95
- Portfolio Summary report generation (200 projects): must complete without Edge Function timeout (< 25 seconds)

**Derived from**: NF-001 (TRS), PIT-FR-089, PIT-FR-083

### PIT-TR-079 — Gantt Rendering Performance

The Timeline page must satisfy the baseline performance envelope defined in PIT-TR-067 and load/render core timeline content in < 1 second for a project with up to 50 milestones.

**Derived from**: NF-001 (TRS)

### PIT-TR-080 — Concurrent User Target

The Supabase instance configuration must support 100 concurrent active users without degraded p95 response times.

**Derived from**: NF-002 (TRS)

### PIT-TR-081 — SPA Client-Side Navigation Performance

Client-side route transitions (already-loaded routes) must render in < 100 ms.

**Derived from**: NF-001 (TRS)

---

## 21. Security Requirements

### PIT-TR-082 — RLS on All Tables

All tables in the PIT schema must have RLS enabled. Tables without RLS enabled are a blocking defect. Verified via a QA-to-Red test that queries `pg_tables` and `pg_policies`.

**Derived from**: PIT-FR-101; L-005

### PIT-TR-083 — No Direct AI Provider Calls

A code audit must confirm zero direct calls to AI provider endpoints (`api.openai.com`, `api.anthropic.com`, or equivalent) in all PIT source files, Edge Functions, and build artifacts.

**Derived from**: PIT-FR-095

### PIT-TR-084 — Invitation Token Security

Invitation tokens must be cryptographically random (minimum 32 bytes, hex-encoded). Token expiry must be enforced server-side. Client-side expiry display is supplementary only.

**Derived from**: PIT-FR-008, PIT-TR-033

### PIT-TR-085 — Evidence Storage Access Control

The `pit-evidence` Supabase Storage bucket must be private. All access must be via signed URLs. Bucket policies must deny unauthenticated access.

**Derived from**: PIT-FR-105, PIT-TR-060

### PIT-TR-086 — Server-Side Input Validation

All form inputs submitted to Edge Functions must be validated server-side before database insert. Client-side validation is supplementary only.

**Derived from**: security requirements

### PIT-TR-087 — WCAG AA Accessibility

The PIT application must meet WCAG 2.1 AA accessibility compliance. Lighthouse accessibility score must be ≥ 80.

**Derived from**: NF-010 (TRS)

---

## 22. Observability and Logging Requirements

### PIT-TR-088 — Structured Edge Function Logging

All Edge Functions must emit structured JSON logs to the Supabase Edge Function log stream. Each log entry must include: timestamp, function name, request ID, action, result, and error details if applicable.

**Derived from**: observability requirements

### PIT-TR-089 — Client-Side Error Tracking

A client-side error tracking integration (candidate: Sentry or equivalent) must be configured to capture unhandled JavaScript errors and React rendering errors. Error reports must include: component stack, user context (user ID only — no PII), and route.

**Derived from**: PIT-TR-010; L-007

### PIT-TR-090 — AIMC Call Logging

Every AIMC capability invocation must be logged in `audit_log` with: capability name, calling user ID, resource context, input summary (not raw PII), and the user's accept/dismiss decision.

**Derived from**: PIT-FR-096 to PIT-FR-099, PIT-TR-054

---

## 23. Error Handling and State Management Requirements

### PIT-TR-091 — Universal Five-State UI Contract

Every primary page (post-login) must implement all five UI states as technical contracts:

| State | Technical Implementation |
|---|---|
| **1 — Loading** | TanStack Query `isLoading` → skeleton loaders in content area; app shell renders normally |
| **2 — Empty Data** | TanStack Query `data.length === 0` → empty state component with illustration + CTA |
| **3 — Permission Denied** | API returns 403 → permission-denied component; no sensitive data in DOM |
| **4 — Network/Server Error** | TanStack Query `isError` → error component with retry button; visually distinct from permission-denied |
| **5 — Data** | TanStack Query `data` present → full page render |

**Derived from**: PIT-FR-016; L-003

### PIT-TR-092 — App Shell in All Five States

The persistent app shell (sidebar + top nav) must render in all five UI states. The loading state must NEVER replace the app shell with a full-screen spinner. Skeleton loaders apply only to the main content area.

**Derived from**: PIT-FR-017; L-002

### PIT-TR-093 — Form Validation Contract

All forms must implement: client-side validation on submit (React Hook Form or equivalent), server-side validation in Edge Functions, and inline field-level error display. Generic form-level errors are supplementary.

**Derived from**: PIT-TR-086; UX requirements

### PIT-TR-094 — Global Error Boundary

The React global error boundary (PIT-TR-010) must catch all unhandled rendering errors and render a user-friendly error page (not a white screen). It must not expose stack traces or internal error details to the user.

**Derived from**: PIT-TR-010; L-003

---

## 24. Deployment, Environment, and Secrets Requirements

### PIT-TR-095 — Required Environment Variables

The following environment variables must be defined in the deployment environment:

| Variable | Scope | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) | Client + Server | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) | Client + Server | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server (Edge Functions) only | Bypasses RLS for system operations |
| `AIMC_GATEWAY_URL` | Server (Edge Functions) only | AIMC Gateway base URL |
| `AIMC_API_KEY` | Server (Edge Functions) only | AIMC Gateway authentication |
| `EMAIL_PROVIDER_API_KEY` | Server (Edge Functions) only | Email delivery API key |
| `STORAGE_BUCKET_EVIDENCE` | Server (Edge Functions) only | Evidence storage bucket name |
| `STORAGE_BUCKET_REPORTS` | Server (Edge Functions) only | Report storage bucket name |

**Derived from**: PIT-TR-051, PIT-TR-055, PIT-TR-057

### PIT-TR-096 — Secrets Never in Repository

No secret or API key may be committed to the repository. All secrets must be stored in: Supabase Edge Function secrets vault (server-side) and deployment platform secrets (e.g. Vercel environment variables).

**Derived from**: PIT-TR-095; security requirements

### PIT-TR-097 — Staging Environment Parity

A staging Supabase instance must mirror the production schema exactly. All deployment waves must be validated against staging before production deployment.

**Derived from**: L-006; PIT-FR-103

### PIT-TR-098 — Deployment Contract Artifact

A formal deployment contract document must be filed before Stage 7 PBFAG. The contract must specify: deployment platform, environment variables, SPA fallback configuration, database migration sequence, and storage bucket provisioning steps.

**Derived from**: L-006; PIT-FR-103

### PIT-TR-099 — SPA Fallback Must Be Verified in Deployed Environment

The SPA fallback must be verified by navigating directly to a deep URL (e.g. `/projects/123`) in the deployed environment (not just in local dev). This is a deployment verification test, not a file-existence check.

**Derived from**: L-005; PIT-FR-014

---

## 25. Tool Validation and Quality Gate Definitions

### PIT-TR-100 — TypeScript Zero-Error Gate

`tsc --noEmit` must exit with code 0 (zero errors). This is a blocking CI gate.

**Derived from**: PIT-TR-005

### PIT-TR-101 — ESLint Zero-Error Gate

ESLint must exit with zero errors using the project-configured ruleset. Warnings are permitted temporarily but must be tracked in the improvement register. This is a blocking CI gate.

**Derived from**: tool validation requirements

### PIT-TR-102 — Test Coverage Gate

Minimum 80% line coverage for all business logic (Edge Functions, data access layer, role-checking utilities). Coverage is measured by the CI test runner. Coverage below 80% is a blocking defect.

**Derived from**: NF-009 (TRS); L-005

### PIT-TR-103 — Lighthouse Performance and Accessibility Gate

Lighthouse must score ≥ 80 on performance and ≥ 80 on accessibility (WCAG AA). Scores below 80 are blocking defects.

**Derived from**: NF-010 (TRS); PIT-TR-087

### PIT-TR-104 — Stub Detection Gate

Test stubs of the form `expect(true).toBe(true)` or equivalent pass-through stubs are prohibited. CI must fail if stub patterns are detected. This implements governance requirement A-003/A-004 (stub detection).

**Derived from**: L-005; A-003/A-004

### PIT-TR-105 — RLS Validation Gate

All RLS policies must be validated by role-switching tests that actually attempt data access with each role. File-existence checks for RLS migration files are not sufficient. The tests must prove that a non-member cannot read a member's data.

**Derived from**: L-005; PIT-TR-041 to PIT-TR-047

### PIT-TR-106 — Deployment Surface Verification Gate

All 27 routes (from §UX-SEC-9) must be verified to return correct components (not 404) in the deployed environment. This is a post-deployment verification test, not a static analysis check.

**Derived from**: L-006; PIT-FR-103; PIT-TR-099

### PIT-TR-107 — Initial Bundle Size Target

The initial JavaScript bundle (gzipped) must be < 500 KB. Builds exceeding this are flagged for Architecture review. Not a hard CI block at TRS stage — reviewed at Architecture.

**Derived from**: performance requirements

---

## 26. MMM Carry-Forward Controls as Technical Requirements

The following technical requirements convert MMM lessons L-001 through L-008 into enforceable PIT-TR controls:

### PIT-TR-108 — L-001: L1/L2/L3 Closure Model

PIT build completion must follow the three-closure model:
- **L1**: All tests pass locally.
- **L2**: All tests pass in CI with no failures, no skipped tests, and no warnings.
- **L3**: CS2 verifies the application is live, accessible, and functionally correct in the deployed production environment.

Build is not considered closed until L3 is verified by CS2.

**Derived from**: L-001

### PIT-TR-109 — L-002: UI Rendering Completeness

The global CSS, app shell, and root-level providers (NotificationProvider, AuthProvider) must render correctly as a first-class test. QA-to-Red must include a test that: (a) renders the root layout, (b) asserts the app shell is present, (c) asserts no layout flash or white screen. File-existence checks for CSS files are not sufficient.

**Derived from**: L-002; PIT-TR-009

### PIT-TR-110 — L-003: Five UI States Required

Every post-login primary page must implement all five UI states (loading, empty, permission-denied, network-error, data). QA-to-Red must include tests for all five states on every primary page. Any page missing any state is a blocking defect.

**Derived from**: L-003; PIT-TR-091

### PIT-TR-111 — L-004: Auth Route Discoverability

All auth routes (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/invite/[token]`) must be discoverable (registered, rendering correct component, not returning 404). Onboarding route (`/onboarding`) must also be registered and accessible post-signup. These routes must be verified in the deployed environment.

**Derived from**: L-004; PIT-TR-017

### PIT-TR-112 — L-005: Runtime Behaviour Validation

QA-to-Red tests must validate runtime and UI behaviour, not file existence. Examples:
- RLS: prove a non-member cannot read member data (not just "RLS migration file exists").
- SPA fallback: navigate directly to `/projects/123` in the deployed environment (not just "vercel.json exists").
- Notifications: prove a notification appears in the bell after a trigger (not just "notifications table exists").

**Derived from**: L-005; PIT-TR-099, PIT-TR-105

### PIT-TR-113 — L-006: Deployment Execution Contract

A deployment contract document (PIT-TR-098) must be a first-class artifact, filed before Stage 7 PBFAG. The contract must include: deployment platform, all environment variables, SPA fallback configuration, database migration sequence, storage provisioning steps, and rollback procedure. The contract is the authoritative deployment reference for Stage 12 Build.

**Derived from**: L-006; PIT-TR-098

### PIT-TR-114 — L-007: Live Operational Closure Evidence

L3 closure (PIT-TR-108) requires live evidence collected in the deployed production environment. Evidence must include: CS2-verified live E2E navigation log, screenshots of key screens in production, and a confirmation that all 27 routes are functional. Evidence is filed in `.agent-admin/evidence/` and referenced in the Stage 12 handover.

**Derived from**: L-007

### PIT-TR-115 — L-008: Continuous Improvement Register

The improvement register at `modules/pit/_readiness/pit-build-process-improvement-register.md` must be updated whenever a new oversight, defect pattern, or process improvement is identified during any pre-build stage. The register must be reviewed at the start of each wave.

**Derived from**: L-008; PIT-TR-115

---

## 27. Non-Functional Requirements Binding on Stage 5 and Stage 6

Stage 5 Architecture must respect:
- All data model and table definitions (Section 9)
- All RLS policy design requirements (Section 11)
- All API/Edge Function contracts (Section 12)
- Performance requirements (Section 20)
- Security requirements (Section 21)
- Deployment/environment requirements (Section 24)

Stage 6 QA-to-Red must:
- Validate all five UI states (PIT-TR-091, PIT-TR-110 / L-003)
- Validate auth route discoverability and onboarding route (PIT-TR-111 / L-004)
- Validate runtime/UI behaviour (not file-existence checks) (PIT-TR-112 / L-005)
- Validate RLS with role-switching tests (PIT-TR-105)
- Validate deployment surface (all 27 routes) in deployed environment (PIT-TR-106)
- Enforce stub detection gate (PIT-TR-104)

---

## 28. Open Questions and Assumptions

| ID | Assumption / Open Question | Blocking Stage | Status |
|---|---|---|---|
| A-004 | AIMC endpoint paths (`/api/aimc/pit/...`) — confirmation with AIMC module owner required | Stage 6 | OPEN |
| A-005 | Email provider selection (Resend vs Postmark vs Supabase) | Stage 5 Architecture | OPEN |
| A-007 | Report generation library (Puppeteer vs alternatives) | Stage 5 Architecture | OPEN |
| A-008 | Deep integration mechanism for upstream modules (Maturity Roadmap, Risk, Incident) | Stage 5 Architecture | OPEN |
| A-009 | Final deployment platform (Vercel vs alternatives) | Stage 7 PBFAG | OPEN |
| A-010 | Maximum file size for evidence uploads (50 MB candidate) | CS2 decision | OPEN |
| A-011 | Stage 4 final approval/re-confirmation by CS2 after timeline-engine technical validation and legacy requirement coverage reconciliation (maturion-isms#1604) | Stage 4 gate-pass | OPEN |

---

## 29. Change-Propagation Note

Any TRS conflict with the FRS, UX Wiring Spec, or App Description must be resolved upstream before Stage 5 Architecture. The improvement register (`modules/pit/_readiness/pit-build-process-improvement-register.md`) must be updated with any conflict discovered during TRS review.

**FRS v0.2-Hardened Propagation (Retrofit Wave maturion-isms#1575)**: The technical requirements for PIT-FR-113 through PIT-FR-123 were propagated into this TRS in PR #1576. See Section 31 for the propagated requirements. The FRS-to-TRS traceability matrix in `modules/pit/03-trs/frs-to-trs-traceability.md` was updated correspondingly to cover all 123 FRS requirements.

---

## 30. Stage 5 Architecture Readiness Statement

Stage 5 Architecture is **BLOCKED** until:
- [ ] This TRS is approved by CS2
- [ ] Open assumption A-004 (AIMC endpoint paths) resolved or deferred with CS2 approval

**Build Authorization**: NOT CLEARED. No implementation code, schema migrations, tests, or CI changes are authorised by this document.

---

## 31. FRS v0.2-Hardened Propagation Requirements (Retrofit Wave maturion-isms#1575)

This section contains technical requirements derived from PIT-FR-113 through PIT-FR-123, which were added to the FRS in the hardening wave (maturion-isms#1556). These requirements were propagated into the TRS in the PIT pre-build functional delivery retrofit wave (maturion-isms#1575 / PR #1576).

### PIT-TR-116 — Permission Negative-Path Enforcement Contract

For every role-gated route, API endpoint, and data operation, both a positive-path (allowed) and negative-path (denied) enforcement mechanism must be implemented:

1. **RLS layer**: Every relevant table must have RLS policies that enforce the access boundary at the database level. For unauthorised access, `SELECT` must return no rows, while `INSERT`, `UPDATE`, and `DELETE` must be blocked so no data mutation occurs (the API/DB response may surface a permission error depending on operation and API layer).
2. **API/Edge Function layer**: Every Edge Function that performs a gated operation must verify the caller's role before execution and return `{ error: "permission_denied" }` with HTTP 403 if the check fails.
3. **Frontend layer**: When a user navigates to a route they are not authorised to access, the route component must render the permission-denied UI state (PIT-TR-025). The frontend must not expose data from the 403 response.
4. **QA-to-Red coverage**: At least one denied-path test must exist for every role boundary. Denied-path tests must verify that the API returns 403, that the UI renders the permission-denied state, and that no protected data appears in the DOM.

**Derived from**: PIT-FR-113; PIT-TR-025, PIT-TR-026

---

### PIT-TR-117 — Progress Roll-Up Computation Contract

Project, milestone, and deliverable progress percentages must be computed server-side as follows:

1. **Task-level**: Task progress is the explicit task progress percentage (0–100%) maintained per PIT-FR-055.
2. **Deliverable-level**: Progress = arithmetic mean of non-cancelled child task progress percentages.
3. **Milestone-level**: Progress = arithmetic mean of non-cancelled child deliverable progress percentages.
4. **Project-level**: Progress = arithmetic mean of non-cancelled child milestone progress percentages.
5. **RAG thresholds** (from FRS §29): Green ≥ 80%, Amber 60–79%, Red < 60%. RAG status must be stored as a computed field or derived at query time.
6. Computation must be triggered on every update that can affect roll-up percentages (including task progress %, cancellation state, and relevant status changes) via database trigger or Edge Function.
7. The progress computation logic must be testable in isolation (unit-testable pure function or Edge Function).

**Derived from**: PIT-FR-114; PIT-TR-035 to PIT-TR-037

---

### PIT-TR-118 — Notification Read and Mark-as-Read Technical Contract

1. The `notifications` table must include a `read_at TIMESTAMPTZ` column (nullable). A `null` value means unread.
2. A `PATCH /notifications/:id/read` API endpoint (or equivalent Edge Function) must set `read_at = now()` for the authenticated user's notification. RLS must prevent users from marking other users' notifications as read.
3. A `PATCH /notifications/read-all` endpoint must set `read_at = now()` on all unread notifications for the authenticated user.
4. The notification bell in the app shell must display a badge count of unread notifications (where `read_at IS NULL`). The badge count must update in real time via Supabase Realtime on the `notifications` table.
5. Mark-as-read operations must be optimistically updated in the UI and reconciled via TanStack Query invalidation.

**Derived from**: PIT-FR-115; PIT-TR-056, PIT-TR-007

---

### PIT-TR-119 — Notification History View Technical Contract

1. A dedicated `/notifications` route must be registered (see Route Coverage Appendix, PIT-FR Appendix A, route `/notifications`).
2. The notification history view must support server-side pagination (cursor-based, page size 20). Fetching all notifications without pagination is prohibited.
3. Each history entry must display: notification type icon, message, timestamp, read/unread state, and a CTA link to the relevant entity.
4. Unread notifications must be visually distinguished from read notifications.
5. The five UI states (PIT-TR-091) must be implemented for the notification history view.

**Derived from**: PIT-FR-116; PIT-TR-074 (pagination pattern)

---

### PIT-TR-120 — Notification Preferences Technical Contract

1. The `notification_preferences` table must store per-user, per-event-type email opt-in flags. Schema: `(id, user_id, event_type, email_enabled BOOLEAN DEFAULT true, updated_at)`.
2. A settings page section (Profile/Notifications) must expose toggles for each notification event type.
3. The notification preference check (PIT-TR-058) must read from this table before sending email.
4. Default: all email notifications enabled for new users. A `notification_preferences` row is inserted (or defaults applied) when a user is created.

**Derived from**: PIT-FR-117; PIT-TR-058

---

### PIT-TR-121 — Report Access Control and State Management Technical Contract

1. Report generation must enforce the role-based access matrix from PIT-FR-118: `cs2_admin` can generate all report types; `org_admin` can generate org-scoped reports; `project_manager` can generate project-scoped reports; `viewer` cannot generate any report.
2. Report generation state must transition through: `queued → generating → ready | failed`. The `report_history` table must include a `status` column with these values.
3. Failed reports must store an `error_reason` column for admin visibility.
4. Report download links must be signed URLs (PIT-TR-062 pattern) that expire after the configurable period. When a signed URL expires, re-generating it on demand (without re-running the report) must be supported.
5. The Reports page must implement all five UI states (PIT-TR-091), including a dedicated "generating" loading state while a report is in progress.

**Derived from**: PIT-FR-118; PIT-TR-068 to PIT-TR-072

---

### PIT-TR-122 — Report History Retention Technical Contract

1. The `report_history` table must retain all report records for a minimum of 30 days. Automated purge of records older than the retention window must be configurable via an environment variable (`REPORT_RETENTION_DAYS`, default: 30).
2. Report files in Supabase Storage must be retained for the same period as their `report_history` record.
3. On expiry of a `report_history` record: the associated file must be deleted from storage, and the record status set to `expired`.
4. The `report_history` table must be readable by the report owner, `org_admin`, and `cs2_admin` (enforced by RLS). All other roles must be denied.
5. A report history list must be displayed on the Reports screen, sorted by generation timestamp descending, with pagination (page size 20).

**Derived from**: PIT-FR-119; PIT-TR-071

---

### PIT-TR-123 — QA Dashboard Evidence Visibility Technical Contract

1. The `/qa-dashboard` route must be accessible only to `cs2_admin` (PIT-TR-077). All other roles see the permission-denied state.
2. The QA Dashboard must display, per wave: wave identifier, run date, suite name, total/passing/failing/skipped test counts, coverage percentage, and direct links to evidence artifacts.
3. Evidence artifact links must point to files in `.agent-admin/evidence/` or equivalent storage. Links must be navigable from the QA Dashboard.
4. QA runs must be insertable by `cs2_admin` only. The `qa_runs` table must have an RLS INSERT policy restricted to `cs2_admin`.
5. The QA Dashboard must implement the five UI states (PIT-TR-091).

**Derived from**: PIT-FR-120; PIT-TR-076, PIT-TR-077

---

### PIT-TR-124 — Lifecycle Removal Semantics Technical Contract

The following status states are the canonical lifecycle states for PIT entities:

**Tasks**: `not_started → in_progress → completed → verified` (positive path); `→ cancelled` (terminal, from any state); `→ overdue` (system-set watchdog state); archived (soft-delete — `archived_at TIMESTAMPTZ` column set).

**Deliverables / Milestones**: `not_started → in_progress → completed → verified → archived`. Archived deliverables and milestones must not be deleted from the database.

**Projects**: `active → paused → completed → archived`. A project may only be archived when all milestones are completed or archived.

**Archive vs Delete**: All entity removal must be implemented as soft-delete (archive) only. Hard delete is prohibited at the application layer. Hard delete via database admin may be performed only by `cs2_admin` and must be audit-logged.

**Restore**: Archived entities may be restored to their previous active state by `org_admin` or `cs2_admin`. A restore operation must be audit-logged.

**Cancel**: Task cancellation must store a `cancellation_reason` (free text, optional). Cancelled tasks count as "removed from scope" and are excluded from progress roll-up computation (PIT-TR-117).

**Implementation**: Soft-delete must be implemented via `archived_at TIMESTAMPTZ` (nullable) column on each entity table. RLS `SELECT` policies must exclude archived rows from default queries. A separate `include_archived=true` query parameter must be available for `org_admin` and `cs2_admin` to retrieve archived entities.

**Derived from**: PIT-FR-121; PIT-TR-027 to PIT-TR-041

---

### PIT-TR-125 — Minimum Accessibility Technical Contract

1. The PIT application must meet WCAG 2.1 AA compliance. This extends and supersedes PIT-TR-087 (which states Lighthouse ≥ 80).
2. All interactive elements (buttons, links, form fields, dropdowns) must have accessible names (visible label or `aria-label`).
3. All images must have `alt` text. Decorative images must have `alt=""`.
4. Keyboard navigation must be fully functional: all interactive elements must be reachable via Tab, and all actions must be activatable via Enter/Space.
5. Focus ring must be visible on all focused elements. Focus ring must not be suppressed globally.
6. Colour contrast ratio for text must meet WCAG AA minimum (4.5:1 for body text, 3:1 for large text).
7. The Gantt chart (timeline page) must provide a table-based accessible alternative view.
8. Axe-core accessibility scan at build time must produce zero violations. This is a blocking quality gate.
9. Lighthouse accessibility score must be ≥ 90 in the deployed environment.

**Derived from**: PIT-FR-122; PIT-TR-087

---

### PIT-TR-126 — Bulk Operations, CSV Import, and Project Templates — Explicit Non-Scope

The following features are explicitly **NOT IN SCOPE** for PIT v1:

1. Bulk task creation (selecting multiple tasks and applying an action to all).
2. CSV import of tasks, deliverables, milestones, or projects.
3. Project templates (saving a project structure as a reusable template with all milestones, deliverables, and tasks).
4. Bulk evidence upload (uploading multiple evidence files simultaneously via a single action).
5. Bulk status transitions (e.g., marking all tasks in a deliverable as complete in a single action).

These features must NOT be implemented in Stage 12 Build without an explicit CS2-approved scope change to the FRS and TRS. Any builder who encounters a request for these features must raise it with Foreman.

**Derived from**: PIT-FR-123

---

## 32. Legacy Action Tracker Requirement Coverage and Gap Classification (Stage 4 Re-Confirmation)

Legacy source reviewed: `apps/pit/Legacy/Action tracker.docx` (timeline/action-tracker baseline requirements).

| Legacy requirement cluster | Coverage classification | Evidence |
|---|---|---|
| Visual timeline matrix (descriptors left, calendar axis right; draggable/resizable bars; exact grid alignment) | Covered by Stage 1 + Stage 2 + Stage 3 + Stage 4 | App Description timeline clauses; UX Timeline screen; FRS PIT-FR-068–076; PIT-TR-064/065/066/067 |
| Year/quarter/month/week/day denominators, viewport presets, long horizontal scrolling | Covered by Stage 1 + Stage 2 + Stage 4 | App Description timeline behavior; UX timeline controls; PIT-TR-064/065/067 |
| Hover exact-date labels, visible start/end during drag, auto-scroll while dragging | Covered by Stage 2 + Stage 3 + Stage 4 | UX interaction flow; FRS PIT-FR-072/PIT-FR-075; PIT-TR-066/067 |
| Progress overlay inside timeline bars | Covered by Stage 1 + Stage 3 + Stage 4 | App Description timeline definition; FRS PIT-FR-070; PIT-TR-064/066/067 |
| Filters across project/milestone/deliverable/task/responsible/company/department/date/status | Covered by Stage 1 + Stage 2 + Stage 3 + Stage 4 | App Description filtering model; UX filter wiring; FRS PIT-FR-085/PIT-FR-086; PIT-TR-067 |
| Task scheduling via predecessor + offset + duration instead of manual date-only entry | Covered by Stage 1 + Stage 3 + Stage 4 | App Description scheduling logic; FRS PIT-FR-056/PIT-FR-072/PIT-FR-073; PIT-TR-066/067 |
| Locked timeline change override with approval + audit trail | Covered by Stage 1 + Stage 3 + Stage 4 | App Description override principle; FRS escalation/approval and audit controls; PIT-TR-067 locked-change contract |
| QA must prove runtime behavior and UI alignment (not file-existence checks) | Covered by Stage 1 + Stage 2 + Stage 3 + Stage 4 | MMM L-005 propagation; UX five-state + wiring; FRS Stage 6 derivation clauses; PIT-TR-067 + PIT-TR-112 |

**Gap statement:** No unclassified legacy timeline gaps remain after this Stage 4 update. No Stage 1 or Stage 2 amendment is required by this wave; remaining action is CS2 approval/re-confirmation of Stage 4.

---

**End of PIT Technical Requirements Specification v0.2-draft**

---

**Template Version**: 1.0.0
**Template Authority**: `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0
**Last Updated**: 2026-05-08 (retrofit wave maturion-isms#1575 / PR #1576 — PIT-TR-116 to PIT-TR-126 added)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
