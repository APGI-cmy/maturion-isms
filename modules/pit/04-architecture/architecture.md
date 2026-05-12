# PIT — Stage 5 Architecture

## Stage 5 — Pre-Build Architecture Artifact

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Application Name | Project Implementation Tracker |
| Artifact Type | Architecture (Stage 5) |
| Version | v1.0 — Stage 5 reconciliation |
| Status | **IN_RECONCILIATION — READY_FOR_CS2_REVIEW** |
| Approval Status | Not approved — pending CS2 Stage 5 review |
| Derived From (Stage 1) | `docs/governance/PIT_APP_DESCRIPTION.md` v1.0 (CS2 Approved 2026-05-06, ref: maturion-isms#1540) |
| Derived From (Stage 2) | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.2 (CS2 re-confirmed 2026-05-11) |
| Derived From (Stage 3) | `modules/pit/02-frs/functional-requirements.md` v0.2-hardened (CS2 re-confirmed 2026-05-11) |
| Derived From (Stage 4) | `modules/pit/03-trs/technical-requirements-specification.md` v0.2-draft (CS2 approved 2026-05-11, ref: maturion-isms#1604 closed by @APGI-cmy) |
| Author | foreman-v2-agent (POLC-Orchestration mode) |
| Date | 2026-05-11 |
| Issue | maturion-isms#1611 — PIT Stage 5 Architecture reconciliation |
| Pre-Build Authority | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.1.0 |

> **Governance Notice — Stage 5 Design/Gate Artifact Only**: This document is a pre-build architecture gate artifact. It authorises NO code implementation, schema migration, builder appointment, QA-to-Red gate-pass, PBFAG pass, deployment configuration, or Edge Function creation. Build Authorization remains **NOT CLEARED**. No downstream stage (Stages 6–12) may proceed without explicit CS2 gate-pass of this Stage 5 Architecture.

> **Upstream Authority Chain**: This architecture derives exclusively from the approved/re-confirmed Stage 1–4 baseline. Any conflict discovered between this document and the Stage 1–4 chain must be resolved upstream before Stage 6 proceeds.

> **Legacy Architecture Notice**: The prior `architecture.md` (legacy v0.1, pre-canonical) contained valuable structural content but was not produced under the canonical 12-stage process. This document supersedes it. Legacy subfolder content is preserved as reference material. No legacy content is treated as gate-passed unless explicitly reconciled herein.

---

## 0. Document Purpose and Derivation Statement

This Stage 5 Architecture document defines the system architecture for PIT — Project Implementation Tracker — and reconciles all Stage 4 TRS requirements (PIT-TR-001 through PIT-TR-126) to architecture components and decisions.

Derived from:

1. **Stage 1** — App Description v1.0 (`docs/governance/PIT_APP_DESCRIPTION.md`) — CS2 Approved 2026-05-06 (ref: maturion-isms#1540)
2. **Stage 2** — UX Workflow & Wiring Spec v0.2 — CS2 re-confirmed 2026-05-11 (UX-GAP-001 + UX-GAP-002 resolved PR #1594)
3. **Stage 3** — FRS v0.2-hardened (PIT-FR-001 through PIT-FR-123) — CS2 re-confirmed 2026-05-11
4. **Stage 4** — TRS v0.2-draft (PIT-TR-001 through PIT-TR-126) — CS2 approved 2026-05-11 (ref: maturion-isms#1604 closed by @APGI-cmy)

Companion documents:
- Full TRS-to-Architecture traceability: `modules/pit/04-architecture/trs-to-architecture-traceability.md`
- Timeline engine ADR: `modules/pit/04-architecture/timeline-engine-architecture-decision.md`
- Stage 5 reconciliation evidence: `modules/pit/04-architecture/stage5-architecture-reconciliation.md`

---

## 1. Runtime and Tech Stack Architecture

**TRS**: PIT-TR-001 through PIT-TR-005

### 1.1 Frontend Runtime

- React 18+ SPA, TypeScript (`strict: true`), TanStack Router v1 (file-based routing)
- State: TanStack Query v5 (server state) + React Context / `useState` (client state)
- Build: Vite
- Zero TypeScript compilation errors required (hard gate)

### 1.2 Backend Runtime

- Supabase: PostgreSQL (managed), Auth (JWT), Edge Functions (Deno), Storage, Realtime

### 1.3 Architecture Decisions Confirmed at Stage 5

| Decision | Resolution | TRS |
|---|---|---|
| Deployment target | **Vercel** + `vercel.json` SPA fallback | PIT-TR-003 |
| State management | **TanStack Query v5** + React Context | PIT-TR-004 |
| Email provider | **Resend** (open assumption A-005 closed here) | PIT-TR-057 |
| PDF generation | **Puppeteer** server-side in Edge Function (A-007 closed here) | PIT-TR-069 |
| XLSX/CSV | **ExcelJS** (XLSX) + native streaming (CSV) | PIT-TR-070 |
| Error tracking | **Sentry** (user ID only, no PII) | PIT-TR-089 |
| Initial bundle target | < 500 KB gzipped | PIT-TR-107 |

---

## 2. Frontend Architecture

**TRS**: PIT-TR-006 through PIT-TR-010

### 2.1 Root Provider Hierarchy

```
<QueryClientProvider>
  <AuthProvider>               ← session, user, role, loading
    <NotificationProvider>     ← Supabase Realtime subscription
      <RouterProvider>
        <RootLayout>           ← app shell (sidebar + top nav)
          <GlobalErrorBoundary>
            <Outlet />
          </GlobalErrorBoundary>
        </RootLayout>
      </RouterProvider>
    </NotificationProvider>
  </AuthProvider>
</QueryClientProvider>
```

**`AuthProvider`** (PIT-TR-008): Provides `{ user, role, session, loading }` via context. Handles session restoration, token refresh, session expiry logout.

**`NotificationProvider`** (PIT-TR-007): Mounted above routes. Supabase Realtime on `notifications` filtered to `user_id = auth.uid()`. No per-page subscription. Provides `{ notifications, unreadCount, markRead, markAllRead }`.

**`RootLayout`** (PIT-TR-006, PIT-TR-009): Renders persistent app shell in all five UI states. Global CSS (reset + typography + CSS variables) loaded at root. No layout flash.

**`GlobalErrorBoundary`** (PIT-TR-010, PIT-TR-094): Root-level React error boundary. Catches rendering errors → generic error page + Sentry log. No stack trace exposed to user.

### 2.2 Five-State UI Contract (L-003)

Every primary post-login page implements all five states:

| State | Technical Trigger | Component |
|---|---|---|
| Loading | TanStack Query `isLoading` | `<SkeletonLoader />` in content area |
| Empty | `data.length === 0` | `<EmptyState />` with illustration + CTA |
| Permission Denied | API 403 or role check fail | `<PermissionDenied CTA="/dashboard" />` |
| Network/Server Error | TanStack Query `isError` | `<ErrorState retryButton />` |
| Data | `data` populated | Full page render |

App shell renders in all five states. Skeleton loaders: content area only. (PIT-TR-091, PIT-TR-092)

---

## 3. Routing Architecture

**TRS**: PIT-TR-011 through PIT-TR-017

### 3.1 All 27 Routes

**Public routes** (6):
| Route | Component |
|---|---|
| `/` | `<LandingPage />` |
| `/login` | `<LoginPage />` |
| `/signup` | `<SignupPage />` |
| `/forgot-password` | `<ForgotPasswordPage />` |
| `/reset-password` | `<ResetPasswordPage />` |
| `/invite/:token` | `<InviteAcceptPage />` |

**Protected routes — main app** (16):
| Route | Component | Screen |
|---|---|---|
| `/dashboard` | `<DashboardPage />` | Portfolio dashboard |
| `/projects` | `<ProjectsPage />` | Projects list |
| `/projects/new` | `<NewProjectPage />` | Project creation |
| `/projects/:id` | `<ProjectDetailPage />` | Project detail |
| `/projects/:id/timeline` | `<TimelinePage />` | Timeline/Gantt |
| `/projects/:id/milestones` | `<MilestonesPage />` | Milestones |
| `/projects/:id/deliverables` | `<DeliverablesPage />` | Deliverables |
| `/projects/:id/tasks` | `<TasksPage />` | Tasks |
| `/projects/:id/evidence` | `<EvidencePage />` | Evidence |
| `/projects/:id/reports` | `<ReportsPage />` | Reports |
| `/projects/:id/settings` | `<ProjectSettingsPage />` | Project settings |
| `/my-work` | `<MyWorkPage />` | My Work |
| `/notifications` | `<NotificationsPage />` | Notification history |
| `/profile` | `<ProfilePage />` | Profile + preferences |
| `/onboarding` | `<OnboardingPage />` | Post-signup onboarding |
| `/admin/org` | `<OrgAdminPage />` | Org admin |

**Admin/user management routes** (3):
| Route | Component |
|---|---|
| `/admin/users` | `<UserManagementPage />` |
| `/admin/settings` | `<OrgSettingsPage />` |
| `/admin/audit-log` | `<AuditLogPage />` |

**CS2/admin-only routes** (1):
| Route | Component |
|---|---|
| `/qa-dashboard` | `<QaDashboardPage />` |

**Utility** (1):
| Route | Component |
|---|---|
| `*` | `<NotFoundPage />` |

**Total: 27 routes registered.** (PIT-TR-011)

### 3.2 ProtectedRoute Guard (PIT-TR-013, PIT-TR-014)

- Intercepts unauthenticated requests: stores intended path in `sessionStorage['pit_intended_destination']`, redirects to `/login`.
- Post-login: reads and clears `pit_intended_destination`. Default redirect: `/dashboard`.
- Authorised but insufficient role: renders `<PermissionDenied />` (not 404).

### 3.3 SPA Fallback (PIT-TR-015)

`vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
Verified by direct deep-URL navigation in deployed environment.

### 3.4 Auth Route Discoverability (PIT-TR-017, L-004)

All 6 auth routes registered. Must never return 404 in any environment.

### 3.5 404 Fallback (PIT-TR-016)

Catch-all `*` → `<NotFoundPage />` with "Go Home" CTA.

---

## 4. Authentication Architecture

**TRS**: PIT-TR-018 through PIT-TR-022

- Supabase Auth, JWT (1-hour expiry, automatic refresh, localStorage).
- Email verification required before protected route access.
- Password reset: `auth.resetPasswordForEmail()`. Expired token → error state + retry CTA.

**Invitation Edge Functions**:
- `validate_invitation` (`POST /functions/v1/validate-invitation`, no auth): validates token + expiry. Returns status + user context.
- `accept_invitation` (`POST /functions/v1/accept-invitation`): creates/links user, marks invitation used. Returns redirect target.

---

## 5. Role and Access Control Architecture

**TRS**: PIT-TR-023 through PIT-TR-026

### 5.1 Role Storage

`user_roles`: `(id, user_id, org_id, project_id NULLABLE, role, created_at)`
- `project_id = NULL` → org-wide role
- `project_id` set → project-scoped role

Role hierarchy: `cs2_admin > org_admin > project_manager > team_leader > contributor > viewer`

### 5.2 Navigation Gating

Sidebar items hidden (not greyed) for roles without access. Checked via `useRole()` hook from `AuthProvider` context.

### 5.3 Permission-Denied Pattern (PIT-TR-025, PIT-TR-116)

For every role boundary:
1. **RLS**: Unauthorized SELECT → 0 rows. INSERT/UPDATE/DELETE → blocked.
2. **Edge Function**: Returns `{ error: "permission_denied" }`, HTTP 403.
3. **Frontend**: `<PermissionDenied />` rendered. No protected data in DOM.
4. **QA-to-Red**: One denied-path test per role boundary (API 403 + UI state + DOM check).

---

## 6. Data Model Architecture

**TRS**: PIT-TR-027 through PIT-TR-036

### 6.1 Confirmed Table Set (Stage 5 Baseline)

| Table | Purpose | Key TRS |
|---|---|---|
| `profiles` | Extended user data (name, avatar, preferences), linked to `auth.users` | PIT-TR-028 |
| `organisations` | Organisation records | PIT-TR-029 |
| `user_org_memberships` | User↔org links | PIT-TR-027 |
| `user_roles` | Role assignments | PIT-TR-023 |
| `projects` | Project records | PIT-TR-029 |
| `milestones` | Milestones | PIT-TR-030 |
| `deliverables` | Deliverables | PIT-TR-030 |
| `tasks` | Tasks (incl. timeline extensions) | PIT-TR-030 |
| `task_dependencies` | Predecessor links | PIT-TR-031 |
| `task_cluster_templates` | Reusable task cluster templates | PIT-TR-027 |
| `task_cluster_items` | Sub-task definitions | PIT-TR-027 |
| `status_logs` | Status transition history | PIT-TR-027 |
| `evidence_items` | Evidence files/notes | PIT-TR-032 |
| `invitations` | Invitation tokens | PIT-TR-033 |
| `notifications` | In-app notification records | PIT-TR-034 |
| `notification_preferences` | Per-user per-event email opt-in | PIT-TR-120 |
| `audit_log` | Append-only audit events | PIT-TR-035 |
| `escalation_log` | Escalation records | PIT-TR-027 |
| `watchdog_flags` | Active watchdog flags | PIT-TR-027 |
| `report_history` | Generated report records | PIT-TR-071 |
| `source_links` | Project↔upstream module links | PIT-TR-036 |
| `integration_configs` | Per-org integration config | PIT-TR-027 |
| `qa_runs` | QA Dashboard test run records | PIT-TR-076 |
| `timeline_view_settings` | Per-user/org/project timeline viewport state | PIT-TR-067 |

### 6.2 Hierarchy and Referential Integrity (PIT-TR-037 through PIT-TR-040)

Project → Milestone → Deliverable → Task — FK constraints enforced at DB level.
`ON DELETE` policies: final determination at Stage 8 Implementation Plan (candidate: `RESTRICT` for project-level, `CASCADE` for tasks within deliverables).
Date constraints: Milestone start ≥ project start; milestone end ≤ project end. API-layer validation before insert/update.

### 6.3 Org Scoping (PIT-TR-038)

All data tables include `org_id` FK. RLS filters by `org_id` for all non-admin queries.

### 6.4 Lifecycle Removal Semantics (PIT-TR-124)

Soft-delete via `archived_at TIMESTAMPTZ` (nullable) on all entity tables. Hard delete prohibited at application layer. RLS `SELECT` excludes archived rows by default. `include_archived=true` query parameter available for org_admin/cs2_admin.

| Entity | States | Notes |
|---|---|---|
| Tasks | `not_started → in_progress → completed → verified → cancelled | overdue | archived` | Cancel stores `cancellation_reason`; cancelled excluded from progress roll-up |
| Deliverables/Milestones | `not_started → in_progress → completed → verified → archived` | |
| Projects | `active → paused → completed → archived` | Archive only when all milestones completed/archived |

Restore by org_admin/cs2_admin. All archive/restore operations logged in `audit_log`.

### 6.5 Timeline Data Extensions

**`tasks` additional columns**:
- `predecessor_task_id` (FK nullable), `offset_days` (int, default 0), `duration_days` (int nullable)
- `calculated_start_date` (date, computed), `calculated_end_date` (date, computed)
- `timeline_locked` (boolean, default false)
- `lock_override_requested_at` (timestamptz nullable), `lock_override_requested_by` (FK nullable)

**`projects` / `milestones`** additional columns:
- `timeline_locked` (boolean, default false)
- `lock_override_requested_at` (timestamptz nullable), `lock_override_requested_by` (FK nullable)

**`timeline_view_settings`**:
- `id`, `user_id` (FK), `org_id` (FK), `project_id` (FK nullable)
- `denominator` (enum: `year | quarter | month | week | day`, default `month`)
- `viewport_preset` (enum: `12m | 4q | 5y | 10y | custom`, default `12m`)
- `collapsed_node_ids` (jsonb array), `scroll_position_x` (int nullable), `updated_at`

---

## 7. RLS Policy Architecture

**TRS**: PIT-TR-041 through PIT-TR-047, PIT-TR-082

### 7.1 RLS on All Tables (Hard Gate)

Every table in PIT schema has RLS enabled. Tables without RLS = blocking defect. Verified via QA test querying `pg_tables + pg_policies`.

### 7.2 Policy Summary

| Policy Pattern | Applies To |
|---|---|
| Org-scoped read: `user_org_memberships` membership check | All org-scoped data tables |
| cs2_admin cross-org read | audit_log, qa_runs, report_history |
| Append-only (no UPDATE/DELETE policy) | audit_log |
| Evidence read: project members + reviewers + project_leader + org_admin + cs2_admin | evidence_items |
| QA dashboard: cs2_admin only | qa_runs |
| Write: actor role in permitted_roles list | All writable tables |
| Notification read: `user_id = auth.uid()` | notifications, notification_preferences |
| Report history read: owner + org_admin + cs2_admin | report_history |

---

## 8. API and Edge Function Architecture

**TRS**: PIT-TR-048 through PIT-TR-055

### 8.1 API Layer Boundaries

| Layer | Scope | Credentials |
|---|---|---|
| Supabase JS client | Direct CRUD (org-scoped data) | anon key + RLS |
| Edge Functions | Complex server-side ops: auth, notifications, reports, watchdog, AIMC proxy | user JWT or service role |
| Service role | Privileged system ops only: audit insert, notification delivery, watchdog evaluation | NEVER client-side |

### 8.2 Edge Function Catalogue (PIT-TR-048)

| Function | Route | Auth | Purpose |
|---|---|---|---|
| `validate_invitation` | `POST /functions/v1/validate-invitation` | None | Validate token |
| `accept_invitation` | `POST /functions/v1/accept-invitation` | Conditional | Accept invite |
| `generate_report` | `POST /functions/v1/generate-report` | Yes | Report generation |
| `watchdog_evaluation` | `POST /functions/v1/watchdog-evaluation` | Service role | Watchdog evaluation |
| `send_notification_email` | DB webhook trigger | Service role | Email delivery |
| `compute_progress_rollup` | DB trigger/webhook | Service role | Progress roll-up **and** predecessor schedule recomputation (`calculated_start_date` / `calculated_end_date`) |
| `pit-task-advisor` | `POST /functions/v1/pit-task-advisor` | Yes | AIMC proxy |
| `pit-portfolio-risk` | `POST /functions/v1/pit-portfolio-risk` | Yes | AIMC proxy |
| `pit-escalation-advisor` | `POST /functions/v1/pit-escalation-advisor` | Yes | AIMC proxy |
| `pit-report-summary` | `POST /functions/v1/pit-report-summary` | Yes | AIMC proxy |

### 8.3 Audit Insert Pattern (PIT-TR-049)

All state-changing Edge Functions write to `audit_log` via service role. Client-side audit writes prohibited.

### 8.4 Error Response Contract (PIT-TR-050)

```json
{ "success": true, "data": {...} }
{ "success": false, "error": { "code": "...", "message": "..." } }
```
HTTP: 200/201 success, 400 validation, 401 unauth, 403 permission denied, 404 not found, 500 server error.

---

## 9. AIMC Integration Architecture

**TRS**: PIT-TR-052 through PIT-TR-055, PIT-TR-083, PIT-TR-090

### 9.1 Zero-Tolerance Gateway Enforcement

All AI functionality routes through Maturion AIMC Gateway. Zero direct provider calls (OpenAI, Anthropic, etc.) from any PIT source file, Edge Function, or build artifact. CI audit gate confirms zero violations.

### 9.2 AIMC Proxy Pattern

`Client → PIT Edge Function → AIMC Gateway → AI provider`

Edge Functions authenticate to AIMC via `AIMC_API_KEY` (Edge Function secret — never client-side).

### 9.3 Human Approval Contract (PIT-TR-054)

Every AIMC response presented for explicit accept/dismiss. No auto-apply. Accept/dismiss logged in `audit_log` (capability name, user ID, resource context, decision).

### 9.4 AIMC Capability Map (PIT-TR-053)

| Capability | Edge Function | Gateway Route (candidate — A-004) |
|---|---|---|
| `pit.task-advisor` | `pit-task-advisor` | `/api/aimc/pit/task-advisor` |
| `pit.portfolio-risk-analysis` | `pit-portfolio-risk` | `/api/aimc/pit/portfolio-risk-analysis` |
| `pit.escalation-advisor` | `pit-escalation-advisor` | `/api/aimc/pit/escalation-advisor` |
| `pit.report-summary` | `pit-report-summary` | `/api/aimc/pit/report-summary` |

---

## 10. Timeline Engine Architecture

**TRS**: PIT-TR-064 through PIT-TR-067, PIT-TR-079

> **Critical architecture section.** Prior PIT build attempts failed at the timeline/tooling layer. These decisions are binding for Stage 6 QA-to-Red. See full ADR: `timeline-engine-architecture-decision.md`.

### 10.1 Rendering Architecture Decision

**Selected approach**: DOM-virtualised split-pane grid + custom date math engine

**Bounded acceptable alternatives**: DHTMLX Gantt (if licensing acceptable), Bryntum Gantt Pro (if budget approved for commercial license)

**Disqualified**: Generic Gantt libraries lacking exact date-to-pixel mapping; canvas-only without accessibility fallback; D3-only SVG without virtualisation

### 10.2 Split-Pane Layout

```
+---------------------+-----------------------------------------------+
| DESCRIPTOR PANE     |  TIMELINE GRID PANE (horizontally scrollable) |
| (fixed width)       |  Date headers (year/quarter/month/week/day)   |
| Hierarchy rows      |  Bar rows + progress overlays                 |
| Progress % column   |  Today-line overlay                           |
+---------------------+-----------------------------------------------+
```

Row identity contract: shared row index, synchronised row heights, zero drift under scroll/zoom/resize. (PIT-TR-064)

### 10.3 Date Header Architecture

Sticky header rows scrolling horizontally with timeline grid:
- Year row (always visible)
- Quarter row (visible when denominator ≤ quarter)
- Month row (visible when denominator ≤ month)
- Week row (visible when denominator ≤ week)
- Day row (visible when denominator = day)

### 10.4 Bar Rendering

| Level | Style | Content |
|---|---|---|
| Project | Primary brand colour, thick | Name + dates |
| Milestone | Secondary colour, medium | Name |
| Deliverable | Derived colour, thinner | Name |
| Task | Accent colour, thinnest | Name + predecessor indicator |

Progress overlay: `bar_width × (progress_pct / 100)` — inset fill, visually distinct.
Today-line: vertical high-contrast line, non-interactive, above all bars.

### 10.5 Date-to-Pixel Mapping Contract (PIT-TR-066)

```
pixelX = (date - viewport_start_date) / total_date_range × viewport_width_px
date   = viewport_start_date + (pixelX / viewport_width_px) × total_date_range
```

- Single shared date math module — no separate hover vs. drag calculation.
- Denominator snapping: pixelX snapped to nearest denominator boundary.
- Canonical timezone: organisation timezone. ISO date-only (no time component).
- DST neutralised by calendar-cell arithmetic in canonical timezone.
- Hover date: inverse mapping using same contract.

### 10.6 Virtualisation (PIT-TR-067 §11)

- Row virtualisation: `@tanstack/react-virtual` (both panes). Only visible rows + overscan rendered.
- Column virtualisation: only rendered date columns within viewport + overscan.
- Target: 1,000 hierarchy rows, 10-year horizontal range, ≤ 2s initial render.
- Drag: ≥ 30 FPS target.

### 10.7 Interaction Architecture (PIT-TR-067 §1–8)

- Drag bar body: repositions (updates start + end)
- Drag start/end handle: adjusts one date. Visible date label during drag.
- Hover: exact-date tooltip at cursor (pixel-to-date inverse).
- Auto-scroll: when drag handle reaches viewport edge, grid scrolls.
- Denominator switching: toolbar. Viewport re-renders at new density.
- Viewport presets: `12m | 4q | 5y | 10y | custom`.
- Row collapse/expand: state in `timeline_view_settings.collapsed_node_ids`.

### 10.8 Locked Timeline Override (PIT-TR-067 §10)

Locked bars: drag disabled (visual indicator). Override request: creates DB entry + audit event. Approval by org_admin/cs2_admin → unlocks, mutation proceeds, audit logged. Rejection → request cleared, reason logged.

### 10.9 Predecessor + Offset + Duration Scheduling (PIT-TR-066)

```
calculated_start = MAX(predecessor.calculated_end + offset_days, milestone.start_date)
calculated_end   = calculated_start + duration_days
```
Computation triggered on every relevant mutation via DB trigger / `compute_progress_rollup` Edge Function (which handles both schedule recomputation and progress roll-up — see §8.2).

Circular dependency detection: server-side graph traversal before insert. Rejected with clear error on cycle.

### 10.10 Accessibility (PIT-TR-125)

All interactive timeline elements keyboard-accessible. Table-based alternative view (toggled via toolbar). Screen reader labels on bars. Axe-core: zero violations.

### 10.11 QA Architecture Hooks (PIT-TR-067 §12)

Pure functions `getPixelForDate(date, config)` and `getDateForPixel(px, config)` exported for unit testing. Playwright E2E for drag, hover, denominator switch, visual regression. Playwright `toHaveScreenshot()` for visual regression. `@axe-core/playwright` for accessibility.

---

## 11. Evidence Upload and Storage Architecture

**TRS**: PIT-TR-060 through PIT-TR-063

- Supabase Storage bucket `pit-evidence` (private). Path: `{org_id}/{project_id}/{task_id}/{filename}`.
- Accepted: PDF, DOCX, XLSX, PNG, JPG, GIF. Max 50 MB per file.
- Access: signed URLs (1-hour expiry). Direct access blocked.
- Status lifecycle: `pending → approved | returned`. Resubmission permitted. Transitions in `audit_log`.

---

## 12. Notification System Architecture

**TRS**: PIT-TR-056 through PIT-TR-059, PIT-TR-118 through PIT-TR-120

- Supabase Realtime on `notifications` in `NotificationProvider`. Real-time unread count badge.
- `read_at TIMESTAMPTZ` (nullable) — null = unread.
- Mark-as-read: `PATCH /notifications/:id/read`. Mark-all-read: `PATCH /notifications/read-all`. Optimistic UI.
- Email: `send_notification_email` Edge Function (Resend). Checks `notification_preferences` before send.
- `/notifications` route: server-side cursor pagination, page size 20. Five UI states required.
- `notification_preferences`: per-user per-event-type email opt-in. Default: all enabled.

---

## 13. Progress Roll-Up Architecture

**TRS**: PIT-TR-117

```
task_progress        = explicit task.progress_pct
deliverable_progress = MEAN(non-cancelled child task progress_pct)
milestone_progress   = MEAN(non-cancelled child deliverable progress_pct)
project_progress     = MEAN(non-cancelled child milestone progress_pct)
```
RAG: Green ≥ 80%, Amber 60–79%, Red < 60%. Triggered on every relevant mutation. Pure function, unit-testable.

---

## 14. Reporting and Export Architecture

**TRS**: PIT-TR-068 through PIT-TR-072, PIT-TR-121, PIT-TR-122

- All reports: `generate_report` Edge Function. Accepts `{ report_type, scope, format, include_ai_summary }`.
- PDF: Puppeteer (server-side). XLSX: ExcelJS. CSV: native streaming.
- `pit-reports` Storage bucket. `report_history` record created per generation.
- Report state: `queued → generating → ready | failed | expired`. Signed URL download (1-hour expiry).
- AI summary: calls `pit-report-summary` AIMC capability. User edits before download.
- Report access RLS: owner + org_admin + cs2_admin.
- Retention: 30 days (`REPORT_RETENTION_DAYS` env var). File + record deleted on expiry.
- Report history: paginated list on Reports screen, sorted by timestamp descending.

---

## 15. Audit Log Architecture

**TRS**: PIT-TR-073 through PIT-TR-075

- Append-only. No UPDATE/DELETE policy. All inserts via service role in Edge Functions.
- Server-side pagination: cursor-based, max 50 rows/page.
- CSV export via `generate_report` (`report_type: audit_trail`). Access: auditor + org_admin + cs2_admin.

---

## 16. QA Dashboard Architecture

**TRS**: PIT-TR-076 through PIT-TR-077, PIT-TR-123

- `/qa-dashboard`: cs2_admin only (route guard + RLS).
- `qa_runs` table: RLS SELECT restricted to cs2_admin. INSERT restricted to cs2_admin.
- Displays per wave: wave ID, run date, suite name, test counts, coverage %, evidence artifact links.
- Five UI states required.

---

## 17. Watchdog and Escalation Architecture

- `watchdog_evaluation` Edge Function: scheduled (daily) + on-demand.
- Rules: overdue tasks, stale tasks (no progress > N days), SLA breach approaching.
- On flag: inserts `watchdog_flags` + creates notification + optional escalation_log entry.
- AIMC `pit-escalation-advisor` available for escalation suggestions.

---

## 18. Cross-Module Integration Architecture

**TRS**: PIT-TR-036, PIT-TR-100 through PIT-TR-102

- `source_links`: project ↔ upstream module item (Maturity Roadmap, Risk, Incident, manual). One per project.
- `integration_configs`: per-org configuration for each upstream module.
- No direct DB reads between modules. Integration via API/Edge Function contracts only.
- Cross-module display: source link section on Project Detail page.

---

## 19. Deployment and Runtime Architecture

**TRS**: PIT-TR-095 through PIT-TR-099, PIT-TR-113

### 19.1 Deployment

- Platform: **Vercel** (confirmed)
- SPA fallback: `vercel.json` rewrites all non-asset paths → `index.html`
- SPA fallback verification: direct deep-URL navigation in deployed env (not static file check)
- Staging: Supabase staging instance mirrors production schema exactly
- Environments: local / dev / staging / production (separate Supabase projects)

### 19.2 Environment Variables

| Variable | Scope | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Client | Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Client | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions only | System ops (bypasses RLS) |
| `AIMC_GATEWAY_URL` | Edge Functions only | AIMC Gateway URL |
| `AIMC_API_KEY` | Edge Functions only | AIMC auth |
| `EMAIL_PROVIDER_API_KEY` | Edge Functions only | Resend API key |
| `STORAGE_BUCKET_EVIDENCE` | Edge Functions only | Evidence bucket name |
| `STORAGE_BUCKET_REPORTS` | Edge Functions only | Reports bucket name |
| `REPORT_RETENTION_DAYS` | Edge Functions only | Retention window (default 30) |

No secrets committed to repository. All stored in Supabase Edge Function secrets vault + Vercel environment variables.

### 19.3 Observability

- Structured JSON logs in all Edge Functions: timestamp, function, request ID, action, result, error.
- Sentry: client-side errors + React rendering errors. User ID only — no PII. No stack trace to user.

### 19.4 Performance Targets

| Metric | Target |
|---|---|
| Single-entity fetch | < 200 ms p95 |
| List query (≤ 100 records) | < 500 ms p95 |
| Audit log page (50-row) | < 2 s p95 |
| Portfolio summary report (200 projects) | < 25 s |
| SPA route transition (loaded) | < 100 ms |
| Timeline initial render | ≤ 2 s p95 (ref dataset) |
| Timeline drag | ≥ 30 FPS target |
| Concurrent users | 100 |

---

## 20. Accessibility Architecture

**TRS**: PIT-TR-087, PIT-TR-125

- WCAG 2.1 AA. All interactive elements: accessible names. All images: alt text.
- Full keyboard navigation (Tab + Enter/Space). Visible focus ring.
- Colour contrast: ≥ 4.5:1 body, ≥ 3:1 large text.
- Timeline: table-based accessible alternative view.
- Axe-core at build time: zero violations (blocking gate).
- Lighthouse accessibility ≥ 90 in deployed environment.

---

## 21. Quality Gate Architecture

**TRS**: PIT-TR-100 through PIT-TR-107

| Gate | Tool | Threshold | Type |
|---|---|---|---|
| TypeScript | `tsc --noEmit` | 0 errors | Blocking CI |
| ESLint | ESLint | 0 errors | Blocking CI |
| Test coverage | Vitest/Jest | ≥ 80% line (business logic) | Blocking CI |
| Lighthouse performance | Lighthouse | ≥ 80 | Blocking |
| Lighthouse accessibility | Lighthouse | ≥ 90 (deployed) | Blocking |
| Stub detection | grep pattern | 0 stub matches | Blocking CI |
| RLS validation | Role-switching tests | Non-member cannot read member data | Blocking |
| Route surface | Playwright E2E | All 27 routes correct | Blocking |
| Bundle size | Vite build | < 500 KB gzipped | Advisory |
| Axe-core | axe-core | 0 violations | Blocking |

---

## 22. MMM Carry-Forward Controls Architecture

**TRS**: PIT-TR-108 through PIT-TR-115

| Control | Architecture Binding | TRS |
|---|---|---|
| L-001 (L1/L2/L3 closure) | Build not closed until CS2 verifies live production | PIT-TR-108 |
| L-002 (UI completeness) | Root CSS + app shell + providers tested first-class | PIT-TR-109 |
| L-003 (five UI states) | All five states on every post-login page | PIT-TR-110 |
| L-004 (auth discoverability) | All 6 auth routes registered + deployed verified | PIT-TR-111 |
| L-005 (runtime behaviour) | RLS/SPA/notifications tested via runtime (not file existence) | PIT-TR-112 |
| L-006 (deployment contract) | Formal deployment contract before Stage 7 PBFAG | PIT-TR-113 |
| L-007 (live evidence) | CS2-verified live E2E + screenshots for L3 closure | PIT-TR-114 |
| L-008 (improvement register) | Register updated on every new oversight/defect | PIT-TR-115 |

---

## 23. Frontend Application Scaffolding and UI Wiring

> **Canon Reference**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` v1.4 §3.14

### 23.1 Framework Scaffold Baseline

| Item | Decision | Notes |
|---|---|---|
| Framework | React 18 + TypeScript | Strict mode enabled |
| Build Tool | Vite 5 | `vite.config.ts` with path aliases |
| Router | TanStack Router v1 (file-based) | Code-split per route |
| Component Library | Radix UI primitives + custom design tokens | No opinionated UI kit |
| State (server) | TanStack Query v5 | Cache, background refetch |
| State (client) | React Context (§2.1) | AuthContext, OrgContext, ProjectContext, NotificationContext |
| Styling | Tailwind CSS v3 + CSS variables | Design tokens in `tokens.css` |
| Icons | Lucide React | Tree-shakeable |
| Forms | React Hook Form + Zod | Schema-validated |

Completeness test: ✅ Builder can scaffold without research — all tools named and versioned.

### 23.2 Build Configuration

- **Entry point**: `src/main.tsx` → mounts `<App />` → `<RouterProvider />`
- **Production build**: `vite build` → `dist/` (HTML + JS chunks + CSS)
- **Development server**: `vite dev` on `localhost:5173` (configured)
- **Environment**: `.env.local` for local secrets; Vercel environment for deployment
- **TypeScript**: `tsconfig.json` strict mode; `tsc --noEmit` in CI (blocking gate)
- **Path aliases**: `@/` → `src/` (configured in `vite.config.ts` and `tsconfig.json`)

### 23.3 UI → API Wiring Architecture

```
React Component
  → useQuery / useMutation (TanStack Query)
    → Supabase client SDK (createClient)
      → PostgREST (table queries with RLS filter)
        → PostgreSQL (Supabase managed)
```

Auth token propagation path:
1. `supabaseClient = createClient(url, anonKey)` — singleton in `src/lib/supabase.ts`
2. `supabase.auth.getSession()` → returns JWT; automatically attached to all subsequent requests by Supabase SDK
3. `AuthContext` (§4) wraps the app; providers receive `session.user` from `onAuthStateChange` listener
4. TanStack Query keys include `user.id` → cache scoped per user; stale cache is invalidated on sign-out

**API endpoint configurable via env**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — never hardcoded.

### 23.4 CORS Architecture

- Supabase PostgREST: CORS managed by Supabase platform (no custom config required)
- Edge Functions: `Access-Control-Allow-Origin` restricted to Vercel deployment origin + localhost
- Evidence: Edge Function CORS tested as part of Stage 6 integration QA

### 23.5 Authentication Token Propagation Path (§3.14 Explicit)

```
Login form submit
  → supabase.auth.signInWithPassword()
    → Supabase Auth service (JWT issued)
      → Stored in Supabase SDK session store (localStorage/in-memory)
        → onAuthStateChange fires → AuthContext updates
          → All queries re-executed with new session JWT
            → RLS filters activate for org-scoped access
```

Credential scope: `SUPABASE_SERVICE_ROLE_KEY` used ONLY inside Edge Functions; never exposed to client.

---

## 24. Infrastructure Deployment and Provisioning

> **Canon Reference**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` v1.4 §3.15

### 24.1 Deployment Targets

| Component | Platform | Notes |
|---|---|---|
| Frontend (SPA) | Vercel | A-009 Closed/Binding (§29.3) |
| Backend API (PostgREST) | Supabase (managed) | PIT Supabase project |
| Edge Functions | Supabase Edge Runtime (Deno) | 8 catalogued functions (§8.2) |
| Database | Supabase (PostgreSQL 15) | PIT Supabase project |
| Storage | Supabase Storage | `evidence` bucket, `reports` bucket |

### 24.2 Provisioning Sequence

```
Step 1 — Supabase project provisioning
  1a. Create PIT Supabase project (separate from MAT/MMM)
  1b. Apply schema migrations (Stage 7 Schema Builder)
  1c. Enable RLS on all 13 tables (Stage 7 gate — zero exceptions)
  1d. Create storage buckets: evidence (50 MB limit), reports
  1e. Set Edge Function secrets: SERVICE_ROLE_KEY, AIMC_GATEWAY_URL, AIMC_API_KEY,
      EMAIL_PROVIDER_API_KEY, STORAGE_BUCKET_EVIDENCE, STORAGE_BUCKET_REPORTS, REPORT_RETENTION_DAYS

Step 2 — Vercel project provisioning
  2a. Link Vercel project to repository (PIT module path)
  2b. Set environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
  2c. Configure `vercel.json` SPA fallback rewrite (all non-asset paths → index.html)
  2d. Configure build command: `vite build`

Step 3 — Edge Function deployment
  3a. Deploy all 8 Edge Functions (supabase functions deploy)
  3b. Verify each function responds to preflight OPTIONS request
  3c. Verify AIMC gateway connectivity from Edge Function environment

Step 4 — Seed and readiness verification
  4a. Insert seed org record for acceptance testing
  4b. Create seed user with confirmed email
  4c. Execute RLS smoke test (org-scoped reads return only org data)
  4d. Execute SPA fallback smoke test (direct deep URL → 200 HTML, not 404)
```

### 24.3 Environment Variable Provisioning and Validation

| Variable | Source | Validation Checkpoint |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel env | Vercel preview deployment build succeeds |
| `VITE_SUPABASE_ANON_KEY` | Vercel env | Supabase client initialises without error |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Edge Function secrets | Edge Function responds with non-auth-error |
| `AIMC_GATEWAY_URL` | Supabase Edge Function secrets | AIMC proxy test call returns 200 |
| `AIMC_API_KEY` | Supabase Edge Function secrets | AIMC proxy test call returns 200 |
| `EMAIL_PROVIDER_API_KEY` | Supabase Edge Function secrets | Notification test returns 200 |

**Validation checkpoint protocol**: All variables must be confirmed populated before Stage 7 PBFAG. Unset variables are a blocking deployment defect, not a runtime failure.

### 24.4 Health Check and Readiness Verification

| Check | Method | Pass Criterion |
|---|---|---|
| Frontend reachable | HTTP GET deployment URL | 200 + `<div id="root">` in body |
| SPA fallback | HTTP GET `/some/deep/path` | 200 HTML (not 404) |
| Supabase PostgREST | GET `/rest/v1/` with anon key | 200 (schema introspection) |
| Auth endpoint | POST `/auth/v1/token?grant_type=password` | 400 (invalid creds) or 200 (valid) — not 500 |
| Edge Function | GET `/functions/v1/compute_progress_rollup` | 200 or 405 (method not allowed) — not 500 |
| RLS | Select from `projects` with org-A session | Returns only org-A projects |

### 24.5 Rollback and Redeploy Strategy

- **Vercel**: Instant rollback to prior deployment via Vercel dashboard (no rebuild required)
- **Edge Functions**: `supabase functions deploy <name> --version <prev>` or re-deploy prior commit
- **Database schema**: Schema migrations are append-only (no destructive migration in Stage 7); rollback = apply reverse migration if migration is backwards-compatible
- **Blocking condition**: If rollback is required in production, CS2 must authorise before re-engagement

---

## 25. End-to-End Integration and Deployment Evidence

> **Canon Reference**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` v1.4 §3.16

### 25.1 Mandatory End-to-End Workflow Paths

Architecture defines the following integration-critical paths that must be evidenced at Stage 7 PBFAG (L-007):

#### Path A — Project Create + Task Assignment + Audit Log

```
1. CS2 user logs in (POST /auth/v1/token → JWT)
2. CS2 user creates project (POST /rest/v1/projects → row created, audit_log entry written)
3. CS2 user assigns task to assignee (PATCH /rest/v1/tasks → updated, audit_log entry)
4. Assignee logs in (separate session)
5. Assignee views own tasks (GET /rest/v1/tasks?assignee_id=eq.{uid} → only own org's tasks)
6. RLS verification: assignee cannot see other org's tasks (GET /rest/v1/tasks?org_id=neq.{own_org} → 0 rows)
7. Assignee updates task status (PATCH /rest/v1/tasks → status updated, audit_log entry written)
```

**Persistence check**: `audit_log` table shows 3 entries from this workflow.

#### Path B — Evidence Upload + Storage Constraint

```
1. User uploads evidence file ≤ 50 MB (POST /storage/v1/object/evidence/{org_id}/{task_id}/{filename})
2. Edge Function validates file size + org ownership → stores object
3. User uploads evidence file > 50 MB → rejected at API layer (413 response)
4. User retrieves evidence URL (GET /functions/v1/evidence → signed URL returned)
```

#### Path C — Timeline Progress Roll-up

```
1. Task status changed to COMPLETE (PATCH /rest/v1/tasks)
2. compute_progress_rollup Edge Function triggered (manual or via DB trigger)
3. Milestone completion_percentage updated (verified via GET /rest/v1/milestones)
4. Predecessor scheduling recalculated (calculated_start_date, calculated_end_date updated)
```

### 25.2 Evidence Requirements (PBFAG L-007 Gate)

At Stage 7 PBFAG, the following evidence artifacts are required:

| Evidence Artifact | Description | Blocking? |
|---|---|---|
| Deployment URLs | Frontend URL + Supabase project URL | YES — no abstract deployments |
| Path A screenshot/video | User login → project create → task → audit log | YES |
| Path B screenshot | Evidence upload ≤ 50 MB PASS, > 50 MB REJECT | YES |
| Path C screenshot | Progress roll-up triggered → completion% updated | YES |
| RLS test logs | Role-switching test results (Playwright E2E) | YES |
| SPA fallback test | Direct deep URL navigation → 200 HTML | YES |
| CI/CD green screenshot | Full CI run green for deployed commit | YES |

Evidence must reference a live deployment SHA, not a local dev server.

### 25.3 Integration Gate Criteria (Deployment Readiness)

Deployment readiness is blocked when:
1. Any evidence artifact listed in §25.2 is missing
2. RLS test shows cross-org data leakage
3. SPA fallback returns 404 for any registered route
4. Any Edge Function returns 500 on health check
5. Audit log is absent for any state-changing operation

**"Deploy later" prohibition** (aligns with MMM L-007 carry-forward):
Architecture explicitly prohibits closing Stage 7 PBFAG without live deployment evidence. Claiming evidence "will be added" or "is acceptable in the next wave" is not permitted. Evidence must exist at gate review time.

---

## 26. QA Catalog Alignment

> **Canon Reference**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` v1.4 §3.17

### 26.1 QA Catalog Precondition for Stage 6

This architecture constitutes the **architectural freeze** required before Stage 6 (QA-to-Red) can proceed. The QA Catalog for PIT MUST be created and validated at the start of Stage 6 before any QA-to-Red test creation or wave planning.

**Required QA Catalog action at Stage 6**:
- QA components must be created for all architecture sections §1–§22 (functional domains) plus §23–§26 (scaffolding, provisioning, e2e evidence, QA catalog) of this document
- QA ID ranges must be allocated and must not overlap with other modules
- Each QA component must have: unique QA ID, semantic description matching architectural feature intent, category (component/flow/state/failure), architectural element reference
- All QA-to-Red tests must be in RED status (architecture exists, implementation does not) before planning proceeds

### 26.2 QA Domains Derived from This Architecture

| QA Domain | Architectural Source | QA Category | Coverage Scope |
|---|---|---|---|
| Frontend scaffolding and build | §23 | component | React 18 + Vite scaffold, routing, build config |
| Authentication flow | §4, §23.5 | flow | Login, session, role assignment, logout |
| Role-based access control | §5 | flow | Navigation gating, permission-denied pattern |
| Route surface | §3 | component | All 27 routes render correct components |
| RLS enforcement | §7 | flow | Org-scoped reads, cross-org blocking |
| Data model integrity | §6 | component | Referential integrity, lifecycle semantics |
| API/Edge Function contracts | §8 | flow | All 8 Edge Functions respond per contract |
| AIMC gateway enforcement | §9 | flow | Zero-tolerance AI gateway, human approval |
| Timeline rendering | §10 | component | Date header, bar rendering, virtualisation |
| Timeline date-math | §10.5 | component | DST-safe day-count arithmetic |
| Predecessor scheduling | §10.9 | flow | Predecessor + offset + duration recalculation |
| Evidence upload | §11 | flow | 50 MB limit enforcement, storage |
| Notifications | §12 | flow | Realtime delivery, in-app centre |
| Progress roll-up | §13 | flow | compute_progress_rollup dual role |
| Reporting/export | §14 | flow | PDF/CSV export, retention policy |
| Audit log | §15 | flow | All state-changing operations logged |
| QA dashboard | §16 | component | Org-scoped QA metrics |
| Watchdog/escalation | §17 | flow | Escalation triggers, notifications |
| Cross-module integration | §18 | flow | MAT/MMM status sync |
| Deployment | §19, §24 | flow | Vercel SPA, env vars, Edge Function health |
| Accessibility | §20 | component | WCAG 2.1 AA, keyboard nav, axe-core |
| Five-state UI contract | §2.2 | component | Loading/Empty/Populated/Error/No-Permission |
| End-to-end path evidence | §25 | flow | Paths A/B/C per §25.1 |
| MMM carry-forward controls | §22 | flow | L-001 through L-008 |

### 26.3 QA Catalog Alignment Gate Status

| Criterion | Stage 5 Status |
|---|---|
| Architecture sections exist and are frozen | ✅ 29 sections (§1–§29, including §23–§26 covering v1.4 §§3.14–3.17) |
| QA Catalog created | ⏳ Stage 6 — not yet; blocked until CS2 approves Stage 5 |
| QA-to-Red tests created and RED | ⏳ Stage 6 — not yet |
| Wave planning validated against QA Catalog | ⏳ Stage 7+ — not yet |

**Stage 5 gate compliance**: Architecture is **complete** for Stage 5 purposes. Stage 6 begins ONLY after CS2 gate-passes Stage 5. No QA-to-Red tests may be created before Stage 5 CS2 approval.

---

## 27. Deferred Open Assumptions

| ID | Assumption | Status at Stage 5 | Architecture Constraint |
|---|---|---|---|
| A-004 | AIMC gateway route paths | Open — before Stage 6 | Bounded in §9.4 |
| A-005 | Email provider | **Closed: Resend selected** | Binding |
| A-007 | PDF generation library | **Closed: Puppeteer selected** | Binding |
| A-008 | Deep integration mechanism | Open — Stage 5–7 | Bounded via source_links pattern (§18) |
| A-009 | Final deployment platform | **Closed: Vercel selected** | Binding — Vercel confirmed as deployment target in §21; equivalent fallback requires CS2 approval if changed |
| A-010 | Max evidence file size | **Closed: 50 MB per file** | Binding — enforced at API layer and Supabase Storage config (§11) |

---

## 28. Legacy Architecture Reconciliation

Legacy `modules/pit/04-architecture/` subfolder content review:

- **`data-contracts/`** → Superseded by §6 (Data Model Architecture). Preserved in `_legacy/` for reference.
- **`exports/`** → Superseded by §14 (Reporting Architecture). Reference only.
- **`integrations/`** → Superseded by §18 (Cross-Module Integration). Reference only.
- **`qa/`** → Superseded by per-section QA hooks in this document and Stage 6 derivation. Reference only.
- **`ui-ux/`** → Superseded by §3 (Routing) and §2 (Frontend Architecture). Reference only.
- **`watchdog/`** → Superseded by §17 (Watchdog Architecture). Reference only.
- **`_legacy/`** → Pre-canonical reference material only. No legacy content authoritative.

No stale legacy architecture contradicts the approved Stage 1–4 chain. All reconciliation complete as of 2026-05-11.

---

## 29. Build Authorization Statement

**Build Authorization**: NOT CLEARED.

This Stage 5 Architecture document does NOT authorise:
- Application source code implementation
- Database schema migrations
- Supabase RLS policies or Edge Function creation
- Deployment configuration creation
- Builder appointment
- QA-to-Red specification gate-pass
- PBFAG gate-pass
- Implementation plan approval
- Build execution

Stages 6–12 remain blocked until this Stage 5 Architecture receives explicit CS2 gate-pass approval.

---

**End of PIT — Stage 5 Architecture v1.0**

---

**Template Version**: 1.1.0
**Template Authority**: `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.1.0
**Date**: 2026-05-11
**Author**: foreman-v2-agent (POLC-Orchestration mode)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
