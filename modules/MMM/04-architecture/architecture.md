# MMM — Maturity Model Management Architecture

## Stage 5 — Pre-Build Specification Artifact

---

## A1 — Document Header and Status

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: Architecture (Stage 5)
- **Status**: DRAFT — For CS2 review and approval
- **Version**: 0.1.0
- **Date**: 2026-04-14
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: mat-specialist (POLC-Orchestration mode, delegated by foreman-v2-agent v6.2.0)
- **Issue**: maturion-isms#1378 (MMM Stage 5 wave-start authorization)
- **Wave**: mmm-stage5-architecture-20260414

### Upstream Authority References

| Stage | Artifact | Version | Status | Reference |
|-------|----------|---------|--------|-----------|
| Stage 1 | `modules/MMM/00-app-description/MMM_app_description.md` | v0.5.0 | CS2-Approved | maturion-isms#1298 (2026-04-08) |
| Stage 2 | `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` | v0.1.0 | CS2-Approved | maturion-isms#1352 (2026-04-14) |
| Stage 3 | `modules/MMM/02-frs/functional-requirements.md` | v0.1.0 | CS2-Approved | maturion-isms#1366 (2026-04-14) |
| Stage 4 | `modules/MMM/03-trs/technical-requirements-specification.md` | v0.1.0 | CS2-Approved (carried forward per maturion-isms#1378) | maturion-isms#1378 (2026-04-14) |
| Harvest Map | `modules/MMM/harvest-map/harvest-map.md` | v0.3.0 | Active | — |

### IAA Pre-Brief Reference

`.agent-admin/assurance/iaa-wave-record-mmm-stage5-architecture-20260414.md` (SHA `ad5369d`)

### Scope Declaration

`.agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-stage5-architecture.md`

> **Derivation Rule**: This architecture derives exclusively from the approved upstream
> authority documents listed above. No requirement, component, or integration pattern
> in this architecture may be traced to any source other than these four stages and the
> harvest map. The legacy sub-folders in `modules/MMM/04-architecture/capabilities/` are
> ERM/WRAC artifacts from a prior module migration — they are NOT MMM architecture inputs.
> See §A11 and §A12 for their formal disposition.

> **One-Time-Build Model**: This architecture is a frozen baseline for the Wave-Based
> One-Time Build Model. All downstream stages (QA-to-Red, PBFAG, Implementation Plan,
> Builder Appointment) derive from this document without modification unless CS2
> authorises an architecture revision wave.

---

## A2 — Architecture Overview

### What MMM Is Architecturally

MMM — Maturity Model Management is a **multi-tenant SaaS web application** built on the
Maturion ISMS platform stack. It is the canonical system of record for the complete
maturity management lifecycle: from framework creation through audit execution, evidence
management, maturity scoring, findings generation, and output routing (report or PIT export).

Architecturally, MMM is:

1. **A React single-page application** (Vite build, TypeScript) deployed to Vercel, consuming
   a Supabase backend via authenticated REST/PostgREST calls and Supabase Edge Functions.

2. **A multi-tenant shared-schema backend** on Supabase PostgreSQL, with Row-Level Security
   as the sole tenant isolation mechanism. All MMM tables carry an `organisation_id` foreign
   key; RLS policies enforce that no user can access another organisation's data.

3. **An AIMC consumer**, not an AI provider. MMM contains zero AI provider integrations.
   All AI calls are routed exclusively through AIMC (AI Management Centre) via Supabase Edge
   Functions. AIMC is the canonical owner of all AI routing, governance, and provider
   abstraction.

4. **A producer module in the PIT integration pattern**. MMM generates findings and
   recommendations; PIT consumes them via a structured export contract. MMM owns no
   implementation plan execution logic.

5. **A KUC consumer** for all document and evidence ingestion. MMM routes all uploads
   through the Knowledge Upload Centre (within AIMC scope) rather than implementing its
   own document parsing infrastructure.

6. **A connectivity-required application** with progressive enhancement for audit workbench
   sessions. Evidence capture during brief connectivity loss is handled via a localStorage
   queue-and-sync pattern (TR-039 through TR-042). Full offline-first is deferred to a
   future enhancement wave.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| AI provider boundary | All AI via AIMC only — zero direct provider calls | AIMC governance mandate (TR-011); AI accountability, audit trail, cost control |
| Tenant isolation mechanism | RLS-only (shared schema) | Supabase/Vercel stack constraint; supports ≥ 1 000 organisations (TR-043) |
| Connectivity model | Connectivity-required + queue-and-sync | Stack constraint; FRS alignment (FR-041g); OQ-001 RESOLVED (TR-039) |
| Score confirmation model | Human-in-the-loop mandatory | AI proposes to `score_proposals`; human confirms to `maturity_scores` (TR-033) |
| Backend execution model | Supabase Edge Functions (Deno) only | No Render-hosted server required for MMM v1.0 (TR-049) |
| Schema namespace | `mmm_` prefix or Supabase schema separation | Cross-module isolation; no foreign keys to non-MMM tables (TR-028) |
| Framework versioning | Immutable published snapshots | Assessment replay against historical framework version (TR-027) |
| State management split | Zustand (client transient) + TanStack Query (server cache) + Supabase DB (persistent) | Separation of concerns; predictable cache invalidation |

### One-Time-Build Integrity Guarantees

1. **No architecture TBD items**: Every integration boundary, data entity, RLS rule, and
   deployment constraint is fully specified in this document.
2. **100% TRS traceability**: All 66 TRs are addressed. See §A14.
3. **Frozen integration contracts**: AIMC, PIT, and KUC boundary contracts at §A6 are frozen
   for all downstream stages. No boundary change without CS2-authorized architecture revision.
4. **No legacy component injection**: The legacy sub-folders in `capabilities/` are formally
   retired artifacts. MMM is built fresh from FRS/TRS specifications.

---

## A3 — Frontend Architecture

*Derived from: TRS §1.3, FRS FR-001 through FR-080, UX Wiring Spec J-01 through J-17*

### A3.1 — Technology Stack

| Component | Technology | Version Constraint |
|-----------|-----------|-------------------|
| Framework | React | ≥ 18.x (concurrent features required for Suspense data fetching) |
| Language | TypeScript | Strict mode (`tsc --strict`) — TR-061 zero-warning policy |
| Build Tool | Vite | ≥ 5.x |
| State Management | Zustand | ≥ 4.x |
| Data Fetching | TanStack Query (React Query) | ≥ 5.x |
| Styling | Tailwind CSS + Maturion Design System tokens | Per shared platform conventions |
| Testing | Vitest (unit/integration), Playwright (E2E) | Per TR-054, TR-056 |
| Linting | ESLint + `--max-warnings 0` | TR-061 zero-warning policy |

### A3.2 — Component Hierarchy and Responsibility

```
<App>
  <AuthProvider>          — Supabase Auth session management; JWT refresh
  <QueryClientProvider>   — TanStack Query root
  <ZustandProviders>      — Zustand stores (org, framework, notifications, connectivity)
    <Router>
      <PublicShell>       — Landing, free assessment, subscribe, auth screens
      <AuthenticatedShell>
        <OrgContextGuard>   — Enforces org selection; gates all org-scoped views
        <TopNav />
        <SideNav />
        <ConnectivityBanner /> — TR-041: offline status indicator
        <Outlet />          — Route-specific page components
      </AuthenticatedShell>
    </Router>
  </ZustandProviders>
```

**Page Component Responsibilities**:
- Page components: routing, layout, and data query wiring only
- Feature components: domain logic, form state, and business UI
- Primitive components: design system elements (buttons, inputs, modals)
- No direct Supabase calls in page or feature components; all data access via
  TanStack Query hooks that call Edge Function or PostgREST endpoints.

### A3.3 — Page / Route Structure (17 UX Journeys)

| Journey | Route Path | Primary Component | Auth Required |
|---------|-----------|-------------------|---------------|
| J-01 | `/` | `LandingPage` | No |
| J-02 | `/free-assessment` | `FreeAssessmentFlow` | No |
| J-03 | `/subscribe`, `/auth/register`, `/auth/login` | `SubscribeFlow`, `AuthPages` | No |
| J-04 | `/onboarding` | `OnboardingFlow` | Yes (unboarded user) |
| J-05 | `/frameworks/new` | `FrameworkOriginFork` | Yes |
| J-06 | `/frameworks/:id/upload` | `VerbatimUploadFlow` | Yes |
| J-07 | `/frameworks/:id/generate` | `NewCriteriaCreationFlow` | Yes |
| J-08 | `/frameworks/:id/review` | `FrameworkReviewFlow` | Yes |
| J-09 | `/frameworks/:id/publish` | `PublicationFlow` | Yes (ADMIN) |
| J-10 | `/frameworks/:id/criteria/:criterionId` | `CriterionDrillDown` | Yes |
| J-11 | `/audit/:sessionId` | `AuditWorkbench` | Yes |
| J-12 | `/assessments/:id/findings` | `FindingsRecommendations` | Yes |
| J-13 | `/assessments/:id/report` | `ReportOutputFlow` | Yes |
| J-14 | `/assessments/:id/export` | `PITExportFlow` | Yes |
| J-15 | `/dashboard` | `LiveDashboard` | Yes |
| J-16 | `/settings/team` | `TeamManagement` | Yes (ADMIN) |
| J-17 | Cross-cutting overlay | `AIMaturionChat` (floating) | Yes |
| Admin | `/admin/ai-chat`, `/admin/ai-telemetry` | `AdminAIInterface` | Yes (ADMIN only) |

**Route Guard Architecture**:
- `<RequireAuth>` — redirects to `/auth/login` if no active session
- `<RequireRole role="ADMIN">` — returns 403 view for insufficient role (TR-036)
- `<RequireOrg>` — redirects to `/onboarding` if organisation record missing
- Admin routes (`/admin/*`) — ADMIN-only guard; ASSESSOR/VIEWER receive 403 (TR-066)

### A3.4 — State Management (Zustand)

Zustand stores manage ephemeral client state that does not need to survive browser
refresh. The following Zustand slices are defined:

| Store Slice | Responsibility | Persistence |
|-------------|---------------|-------------|
| `orgStore` | Current organisation selection, cached org metadata | Hydrated from `profiles.current_org_id` on session load |
| `frameworkStore` | Active framework selection | Hydrated from `profiles.current_framework_id` |
| `notificationStore` | In-app toast notifications (TR-062) | Ephemeral (clears on refresh) |
| `connectivityStore` | Network connectivity status flag, queue depth | In-memory; drives `<ConnectivityBanner>` |
| `auditQueueStore` | Audit Workbench evidence capture queue | Backed by `localStorage` key `mmm_audit_queue` (TR-040) |
| `uiPreferencesStore` | Sidebar collapse state, theme preference | Ephemeral (server state authoritative per TR-063) |

**Zustand / TanStack Query boundary rule**:
- Zustand: client-only transient state (connectivity, toasts, UI toggles, active queue)
- TanStack Query: server-synchronized state (frameworks, criteria, assessments, scores)
- Supabase DB: canonical persistent state (all nine TR-063 state domains)

### A3.5 — Data Fetching Patterns (TanStack Query)

All server data is fetched via TanStack Query hooks. Hooks wrap Edge Function calls or
PostgREST queries via the Supabase client.

**Query Key Convention**:
```
['mmm', entityType, ...filters]
// Examples:
['mmm', 'frameworks', orgId]
['mmm', 'criteria', frameworkId, mpsId]
['mmm', 'maturity_scores', assessmentId]
```

**Mutation Patterns**:
- All write operations use TanStack Query `useMutation`
- On success: `queryClient.invalidateQueries` for affected query keys
- On error: display via `notificationStore` toast; log to audit trail on server

**Stale Time Policy**:
| Data Type | Stale Time | Background Refetch |
|-----------|-----------|-------------------|
| Framework list | 5 minutes | Yes |
| Criteria (published framework) | 30 minutes | No (immutable after publish) |
| Maturity scores | 30 seconds | Yes (supports real-time dashboard — TR-008) |
| Dashboard aggregate | 30 seconds | Yes |
| User profile | 5 minutes | Yes |

**Real-Time Score Updates (TR-008)**:
Supabase Realtime channel subscription on `maturity_scores` table for the current
`assessment_id`. On INSERT/UPDATE event, invalidate `['mmm', 'maturity_scores', assessmentId]`
query key. Dashboard reflects updated scores within ≤ 3 seconds of commit.

### A3.6 — Form Handling and Validation

- React Hook Form for all form state management
- Zod schemas for client-side validation; same schemas reused in Edge Functions
- Validation errors displayed inline per field
- Forms with destructive actions (publish framework, confirm score, PIT export) require
  an explicit confirmation modal before submission
- Evidence capture forms (Audit Workbench) queued via `auditQueueStore` when offline (TR-040)

### A3.7 — Connectivity Status Handling (TR-039 through TR-042)

**Connectivity Detection**:
```
navigator.onLine API + Supabase health ping (/api/health) every 10 seconds
```

**State Machine**:
```
ONLINE  ──[navigator.onLine = false]──► OFFLINE
OFFLINE ──[navigator.onLine = true + health ping OK]──► SYNCING
SYNCING ──[queue flushed]──► ONLINE
SYNCING ──[health ping fails]──► OFFLINE
```

**`<ConnectivityBanner>` rendering**:
- `OFFLINE`: Amber banner — "Offline — evidence capture queued locally (N items)"
- `SYNCING`: Green banner — "Online — syncing N captured items"
- `ONLINE`: No banner (hidden)
- Banner dismissed after 3 seconds of ONLINE state (TR-041)

**Scope boundary** (TR-042): Queue-and-sync applies only to Audit Workbench evidence capture.
All other operations display a "No connection" error state on connectivity loss.

### A3.8 — Queue-and-Sync Architecture for Audit Workbench (TR-040)

```
[Evidence capture event]
       │
       ▼
[connectivityStore.isOnline?]
       │
   YES ─► [POST to Edge Function directly]
       │
   NO  ─► [auditQueueStore.enqueue(event)]
              └─► localStorage key: mmm_audit_queue
              └─► Max 50 entries per session
              └─► Entry format: { id: uuid, type: "evidence_capture", payload: {...}, created_at: ISO8601 }
                         │
         [connectivityStore transitions to SYNCING]
                         │
              [Sync worker: process queue head-to-tail]
              └─► POST each entry to Edge Function
              └─► On 200: dequeue entry
              └─► On error: exponential backoff (1s, 2s, 4s, max 3 retries)
              └─► After 3 retries: retain in queue with error_count
                         │
         [Queue empty] ──► [connectivityStore transitions to ONLINE]
```

### A3.9 — Error Boundary Strategy

- Root `<ErrorBoundary>` wraps the entire application; catches unhandled render errors
- Route-level `<ErrorBoundary>` wraps each page component; prevents cascade failures
- API error states rendered via dedicated empty/error state components per feature area
- Network errors from TanStack Query surfaced via `notificationStore` toast (non-fatal)
- Fatal configuration errors (commissioning state machine failure — TR-051) render a
  full-screen diagnostic view instead of routing to the application

### A3.10 — Accessibility Approach (TR-059)

- WCAG 2.1 Level AA target for all primary user-facing routes
- Semantic HTML structure required for all feature components
- ARIA labels on all interactive elements without visible text labels
- Keyboard navigation: all primary actions completable without mouse
- axe-core automated scan in CI pipeline; PR fails on any CRITICAL violation
- Color contrast: Maturion Design System tokens must meet AA contrast ratios
- Screen reader testing required before Stage 12 completion

---

## A4 — Backend Architecture

*Derived from: TRS §3, §8; FRS FR-053, FR-054, FR-055, FR-067, FR-068, FR-072*

### A4.1 — Edge Function Inventory

All backend logic is implemented as Supabase Edge Functions (Deno runtime). No
alternative server-side execution model is permitted for MMM v1.0 (TR-049).

| Function | Route | Purpose | Auth |
|----------|-------|---------|------|
| `mmm-health` | `GET /api/health` | Health and telemetry endpoint (TR-052) | None (public) |
| `mmm-qiw-status` | `GET /api/qiw/status` | QIW dashboard API (TR-065) | JWT required |
| `mmm-org-create` | `POST /api/organisations` | Organisation creation (J-04) | JWT required |
| `mmm-org-update` | `PUT /api/organisations/:id` | Organisation update | JWT + ADMIN |
| `mmm-framework-init` | `POST /api/frameworks/init` | Framework record init (J-05) | JWT required |
| `mmm-framework-compile` | `POST /api/frameworks/:id/compile` | Compile parsed/proposed → canonical (J-06, J-07) | JWT required |
| `mmm-framework-publish` | `POST /api/frameworks/:id/publish` | Publish framework (J-09) | JWT + ADMIN |
| `mmm-ai-framework-parse` | `POST /api/ai/framework-parse` | AIMC proxy — verbatim parse (J-06) | JWT required |
| `mmm-ai-framework-generate` | `POST /api/ai/framework-generate` | AIMC proxy — new generation (J-07) | JWT required |
| `mmm-ai-framework-alter` | `POST /api/ai/framework-alter` | AIMC proxy — alter mechanism | JWT required |
| `mmm-ai-evidence-evaluate` | `POST /api/ai/evidence-evaluate` | AIMC proxy — evidence evaluation | JWT required |
| `mmm-ai-recommend` | `POST /api/ai/recommend` | AIMC proxy — recommendations | JWT required |
| `mmm-ai-chat` | `POST /api/ai/chat` | AIMC proxy — contextual chat (J-17) | JWT required |
| `mmm-ai-explain` | `POST /api/ai/explain` | AIMC proxy — contextual explain | JWT required |
| `mmm-ai-assessment-interpret` | `POST /api/ai/assessment-interpret` | AIMC proxy — result interpretation (J-02) | JWT required |
| `mmm-upload-framework-source` | `POST /api/upload/framework-source` | KUC upload — framework source (J-06) | JWT required |
| `mmm-upload-evidence` | `POST /api/upload/evidence` | KUC upload — evidence (J-11) | JWT required |
| `mmm-score-confirm` | `POST /api/scores/confirm` | Score confirmation — human HITL (TR-033) | JWT required |
| `mmm-score-cascade` | Internal trigger | Scoring cascade (FR-040) | Service role |
| `mmm-pit-export-send` | `POST /api/pit-export/:id/send` | PIT export send (J-14, TR-017) | JWT required |
| `mmm-pit-evidence-return` | `POST /api/evidence/pit-return` | PIT → MMM evidence return (TR-018) | Service JWT from PIT |
| `mmm-assessment-free-respond` | `POST /api/assessment/free/respond` | Free assessment submission (J-02) | None or session |
| `mmm-assessment-free-result` | `GET /api/assessment/free/result` | Free assessment result (J-02) | None or session |
| `mmm-invitation-create` | `POST /api/invitations` | User invitation (J-16, TR-035) | JWT + ADMIN |
| `mmm-invitation-accept` | `POST /api/invitations/accept` | Invitation acceptance (TR-035) | Token-based |
| `mmm-commissioning-check` | Internal startup | Commissioning state machine (TR-051) | Service role |

### A4.2 — API Endpoint Organization

Edge Functions follow the naming convention: `mmm-<domain>-<action>`.

**API surface is organized by domain**:
- `/api/health`, `/api/qiw/*` — System health and observability
- `/api/organisations/*` — Organisation lifecycle
- `/api/frameworks/*` — Framework lifecycle
- `/api/ai/*` — AIMC proxy layer
- `/api/upload/*` — KUC upload proxy
- `/api/scores/*` — Maturity score management
- `/api/pit-export/*`, `/api/evidence/pit-return` — PIT integration
- `/api/assessment/free/*` — Free assessment flow
- `/api/invitations/*` — User invitation lifecycle

### A4.3 — Business Logic Layer

Business logic resides exclusively in Edge Functions. No business logic may be
implemented in React components or client-side utilities (except client-side
form validation).

**Core business logic domains**:
1. **Scoring cascade** (FR-040): Evidence event → criterion score recalculation →
   MPS score → domain score → organisation score → real-time dashboard update.
   Implemented as a dedicated internal Edge Function triggered on evidence confirmation.
2. **AI Human Oversight enforcement** (TR-033): Edge Function for score confirmation
   requires `confirm: true` flag in payload; writes to `maturity_scores` (not
   `score_proposals`) only on explicit human confirmation.
3. **Framework compilation** (FR-017): Moves parsed/proposed structure from staging
   tables into canonical `domains`, `maturity_process_steps`, `criteria` tables.
4. **PIT export protocol** (TR-017): 7-step handshake sequence; all steps audit-logged.
5. **Commissioning state machine** (TR-051): 5-check startup sequence; halts on failure.

### A4.4 — Data Transformation Layer

Edge Functions are responsible for all data transformation between the frontend contract
and the database schema. The following transformations are defined:

- **AIMC request/response normalization**: Wraps frontend payload in AIMC canonical
  envelope; unwraps AIMC response envelope before returning to frontend (TR-012).
- **Score cascade computation**: Aggregates criterion scores → MPS score (mean of criteria);
  MPS scores → domain score (mean of MPSs); domain scores → org score (mean of domains).
- **PIT export serialization**: Converts internal finding/recommendation records to
  TR-016 JSON schema for PIT consumption.
- **Evidence staleness evaluation**: Computes whether evidence is within freshness
  threshold (TR-025) on each evidence read.

### A4.5 — AI Gateway Calling Pattern

```
[Frontend trigger (user action)]
       │
       ▼
[Edge Function: mmm-ai-<operation>]
       │
       ├─ Validate JWT (TR-030)
       ├─ Validate request payload (Zod)
       ├─ Check circuit breaker state (TR-009)
       │       └─ If OPEN: return fallback response; do not call AIMC
       │
       ▼
[AIMC call: POST https://<AIMC_BASE_URL>/api/ai/<operation>]
       ├─ Authorization: Bearer <service-to-service JWT> (TR-011)
       ├─ Content-Type: application/json; charset=utf-8 (TR-012)
       ├─ Timeout: per-operation values from TR-014
       ├─ Retry: per-operation policy from TR-014
       │
       ▼
[AIMC response: canonical envelope (TR-012)]
       │
       ├─ Log to audit_logs: action_type = AI_<OPERATION> (TR-034)
       ├─ Unwrap response; validate schema
       │
       ▼
[Return to frontend]
```

**Circuit Breaker Implementation** (TR-009):
- In-memory state per Edge Function instance: `CLOSED | OPEN | HALF_OPEN`
- Opens after ≥ 5 consecutive AIMC failures within 60-second window
- Holds OPEN for ≥ 30 seconds; then transitions to HALF_OPEN for probe request
- On successful probe: transitions to CLOSED
- State surfaced in health endpoint `circuit_breakers.aimc` field (TR-052)

---

## A5 — Data Architecture

*Derived from: TRS §4 (TR-021 through TR-028), §5 (TR-038), §7 (TR-046), §8 (TR-050)*

### A5.1 — Entity Model Overview

The following core tables constitute the MMM data model. All tables reside in the
`public` schema with `mmm_` namespace prefix per TR-028.

> **Note**: The diagram below is a **conceptual entity model** — the `mmm_` table prefix is
> omitted for readability. In the actual schema all table names carry the prefix
> (e.g. `mmm_organisations`, `mmm_frameworks`, `mmm_profiles`, etc.).

```
organisations
    │
    ├── frameworks (organisation_id)
    │       │
    │       ├── domains (framework_id)
    │       │       └── maturity_process_steps (domain_id)
    │       │               └── criteria (mps_id)
    │       │
    │       └── assessments (organisation_id, framework_id)
    │               │
    │               ├── maturity_scores (assessment_id, entity_type, entity_id)
    │               ├── evidence (assessment_id, criterion_id)
    │               │       └── score_proposals (evidence_id, criterion_id)
    │               ├── findings (assessment_id, criterion_id)
    │               ├── override_log (assessment_id, criterion_id)
    │               └── pit_exports (assessment_id, organisation_id)
    │
    ├── audit_sessions (organisation_id, framework_id, user_id)
    ├── users (extends auth.users; organisation_id)
    └── invitations (organisation_id)

ai_interactions (actor_id, target_entity_id)
parse_jobs (upload_id, document_id)
audit_logs (immutable; all entities)
user_preferences (user_id)
profiles (extends auth.users)
```

### A5.2 — Core Entity Schema (TR-022)

| Entity | Table | Mandatory Columns |
|--------|-------|-------------------|
| Organisation | `mmm_organisations` | id, name, slug, tier, subscription_status, evidence_freshness_days, created_at, updated_at |
| Framework | `mmm_frameworks` | id, organisation_id, name, version, status (DRAFT/REVIEW/PUBLISHED/ARCHIVED), source_type, origin_mode, created_at, updated_at |
| Domain | `mmm_domains` | id, framework_id, name, code, sort_order, created_at, updated_at |
| MPS | `mmm_maturity_process_steps` | id, domain_id, name, code, sort_order, intent_statement, created_at, updated_at |
| Criterion | `mmm_criteria` | id, mps_id, name, code, sort_order, maturity_level_target, created_at, updated_at |
| Level Descriptor | `mmm_level_descriptors` | id, criterion_id, level (1–5), descriptor_text, created_at |
| Assessment | `mmm_assessments` | id, organisation_id, framework_id, status, started_at, completed_at, created_by |
| Maturity Score | `mmm_maturity_scores` | id, assessment_id, entity_type, entity_id, score, confirmed_at, confirmed_by, updated_at |
| Score Proposal | `mmm_score_proposals` | id, assessment_id, criterion_id, proposed_score, proposed_by_ai, source_evidence_ids, created_at |
| Evidence | `mmm_evidence` | id, assessment_id, criterion_id, type, storage_ref, status (PENDING/ACCEPTED/REJECTED), reviewed_at, reviewed_by |
| Finding | `mmm_findings` | id, assessment_id, criterion_id, maturity_position, gap_to_next, finding_text, created_at |
| Override Log | `mmm_override_log` | id, assessment_id, criterion_id, previous_score, new_score, rationale, overridden_by, created_at |
| Audit Session | `mmm_audit_sessions` | id, organisation_id, framework_id, user_id, status (ACTIVE/CLOSED), started_at, closed_at |
| Audit Log | `mmm_audit_logs` | id, action_type, actor_id, target_entity_type, target_entity_id, before_state, after_state, created_at |
| PIT Export | `mmm_pit_exports` | id, assessment_id, organisation_id, status, payload_json, sent_at, pit_task_id, created_at |
| Parse Job | `mmm_parse_jobs` | id, upload_id, document_id, status (PENDING/PROCESSING/COMPLETE/FAILED), result_json, created_at, updated_at |
| AI Interaction | `mmm_ai_interactions` | id, actor_id, action_type, context_type, target_entity_id, token_count, duration_ms, status, request_json, response_json, created_at |
| User / Profile | `mmm_profiles` | id (= auth.users.id), organisation_id, role, current_org_id, current_framework_id, invitation_token, invitation_accepted_at, created_at |
| User Preferences | `mmm_user_preferences` | id, user_id, filters (jsonb), ui (jsonb), created_at, updated_at |
| Organisation Hierarchy | `mmm_organisation_hierarchy` | id, organisation_id, node_type (SITE/OPERATION/SUBSIDIARY), name, parent_id, created_at |
| Free Assessment | `mmm_free_assessments` | id, session_token, responses (jsonb), baseline_result (jsonb), status, created_at |
| Invitation | `mmm_invitations` | id, organisation_id, email, role, token, expires_at, accepted_at, created_by, created_at |
| Proposed Domains | `mmm_proposed_domains` | id, framework_id, name, code, sort_order, source (AI/HUMAN), created_at |
| Proposed MPS | `mmm_proposed_mps` | id, proposed_domain_id, name, code, sort_order, intent_statement, source, created_at |
| Proposed Criteria | `mmm_proposed_criteria` | id, proposed_mps_id, name, code, sort_order, maturity_level_target, source, created_at |
| Parse Ambiguity | `mmm_parse_ambiguities` | id, framework_id, item_type, item_ref, ambiguity_text, resolution_status, resolved_by, created_at |

### A5.3 — Row-Level Security (RLS) Policy Architecture (TR-031 through TR-032)

**RLS is enabled on all MMM tables without exception.**

**Policy architecture by table class**:

| Table Class | INSERT | SELECT | UPDATE | DELETE |
|------------|--------|--------|--------|--------|
| Organisation-scoped tables | Authenticated user, own org only | Authenticated user, own org only | ADMIN + own org | ADMIN + own org (soft-delete) |
| Audit logs | Service role only | Any authenticated user, own org | PROHIBITED (no role) | PROHIBITED (no role) |
| Override log | ADMIN + own org | Authenticated + own org | PROHIBITED | PROHIBITED |
| Score proposals | Edge Function (service role) | Authenticated + own org | PROHIBITED | Service role only |
| Maturity scores | Service role (via confirm endpoint) | Authenticated + own org | PROHIBITED (direct); confirm endpoint only | PROHIBITED |
| Invitations | ADMIN + own org | ADMIN + own org | ADMIN + own org | ADMIN + own org |
| Free assessments | No auth required (session token) | Session token matching | PROHIBITED | PROHIBITED |
| Admin AI interactions | Service role | ADMIN role + own org | PROHIBITED | PROHIBITED |

**Tenant isolation policy template** (applied to all organisation-scoped tables):
```sql
-- SELECT isolation
CREATE POLICY "org_isolation_select"
ON mmm_<table> FOR SELECT
USING (organisation_id = auth.jwt() ->> 'org_id');

-- INSERT isolation
CREATE POLICY "org_isolation_insert"
ON mmm_<table> FOR INSERT
WITH CHECK (organisation_id = auth.jwt() ->> 'org_id');
```

**RLS bypass test** (TR-032): A mandatory QA-to-Red test must confirm that a user
authenticated for org A cannot SELECT, INSERT, UPDATE, or DELETE any row with a
different `organisation_id`, even via direct SQL manipulation.

### A5.4 — Database Index Requirements (TR-046)

| Table | Index Column(s) | Type | Reason |
|-------|----------------|------|--------|
| `mmm_evidence` | `(assessment_id, criterion_id)` | B-tree | Evidence lookup per criterion |
| `mmm_maturity_scores` | `(assessment_id, entity_type, entity_id)` | B-tree | Score cascade lookup |
| `mmm_audit_logs` | `(target_entity_type, target_entity_id)` | B-tree | Audit trail lookup |
| `mmm_audit_logs` | `created_at` | B-tree | Time-range audit queries |
| `mmm_frameworks` | `(organisation_id, status)` | B-tree | Framework list per org/status |
| `mmm_criteria` | `mps_id` | B-tree | Criteria load for audit session |
| `mmm_parse_jobs` | `(upload_id, status)` | B-tree | Upload status polling |
| `mmm_pit_exports` | `(organisation_id, status)` | B-tree | Export status queries |
| `mmm_score_proposals` | `(assessment_id, criterion_id)` | B-tree | Proposal lookup per criterion |
| `mmm_ai_interactions` | `(actor_id, created_at)` | B-tree | AI telemetry queries |

All indexes must be present in migrations. `EXPLAIN ANALYSE` must confirm index scans.

### A5.5 — Data Retention Architecture (TR-023)

| Data Category | Retention Period | Deletion Mechanism |
|---------------|-----------------|-------------------|
| Active assessment data | Indefinite (until org account closure) | Soft-delete (`deleted_at` column) |
| Evidence files (`mmm-evidence` bucket) | 7 years (ISO 27001) | Supabase Storage lifecycle policy |
| Audit logs | 7 years (ISO 27001) | Immutable; no delete RLS pathway |
| PIT export payloads | 3 years | Soft-delete |
| Override log entries | 7 years (non-repudiation) | Immutable; no delete RLS pathway |
| User invitations (unaccepted) | 30 days from issuance | Hard-delete via scheduled Edge Function |
| Session / auth tokens | Per Supabase Auth default (1-hour JWT TTL) | Supabase managed |
| AI interaction logs | 3 years | Soft-delete |

**Retention policy documentation**: `COMPLIANCE_SCOPE.md`, `DATA_RETENTION_POLICY.md` —
both required as Architecture stage deliverables (TR-037).

### A5.6 — State Persistence: Queue-and-Sync localStorage (TR-040)

localStorage key: `mmm_audit_queue`

Queue entry schema:
```json
{
  "id": "uuid",
  "session_id": "uuid",
  "type": "evidence_capture",
  "payload": {
    "criterion_id": "uuid",
    "evidence_type": "document | voice | photo | integration",
    "content_ref": "string | null",
    "notes": "string | null"
  },
  "created_at": "ISO8601",
  "retry_count": 0,
  "error_message": null
}
```

Capacity: 50 entries per session. On overflow: reject new entries with user notification.

Additional localStorage keys (TR-063):
- `mmm_nav_position` — last navigation route
- `mmm_evidence_draft_{id}` — evidence workspace drafts

### A5.7 — Audit Log Architecture (TR-038)

Action type vocabulary (minimum 20 types):

```
EVIDENCE_SUBMIT        EVIDENCE_ACCEPT       EVIDENCE_REJECT
SCORE_PROPOSE          SCORE_CONFIRM         SCORE_OVERRIDE
FINDING_CREATE         FINDING_UPDATE        FINDING_APPROVE
REPORT_GENERATE        PIT_EXPORT_INITIATE   PIT_EXPORT_CONFIRM
FRAMEWORK_CREATE       FRAMEWORK_COMPILE     FRAMEWORK_PUBLISH
FRAMEWORK_ARCHIVE      USER_INVITE           USER_ACCEPT_INVITE
USER_ROLE_CHANGE       USER_REMOVE
AI_PARSE               AI_GENERATE           AI_EVALUATE
AI_RECOMMEND           AI_CHAT               AI_EXPLAIN
AI_INTERPRET           AI_ALTER
ASSESSMENT_START       ASSESSMENT_COMPLETE
```

All 8 event categories from TR-038 are covered: evidence decisions, scoring changes,
overrides, approvals, PIT exports, report generation, framework lifecycle, user management.

### A5.8 — Framework Versioning Storage (TR-027)

- `mmm_frameworks.version` (integer): Incremented on each publish event.
- On publish: immutable snapshot of the compiled framework JSON stored in Supabase Storage
  bucket `mmm-framework-sources` at path `snapshots/{framework_id}/v{version}.json`.
- `mmm_assessments.framework_id` references the specific version active at assessment
  creation time. Framework version is immutable from the assessment's perspective.
- Published framework records receive status = `PUBLISHED`; no writes permitted via RLS
  to any of the framework's `mmm_domains`, `mmm_maturity_process_steps`, or `mmm_criteria`
  rows after publication.

---

## A6 — Integration Boundaries

*This section freezes the integration contracts for all downstream stages. No boundary
change is permitted without a CS2-authorized architecture revision wave.*

### A6.1 — MMM ↔ AIMC Integration Boundary

**Architecture-level contract**:

MMM never calls AI providers directly. All AI operations are mediated by AIMC.
AIMC is the sole canonical owner of AI routing, provider selection, cost tracking,
and AI governance logging at the platform level. MMM's responsibility is to:
(a) construct the correct business payload for each operation,
(b) authenticate the call using a service-to-service JWT,
(c) route the call to the correct AIMC endpoint via the MMM Edge Function proxy layer,
(d) log the AI interaction in `mmm_ai_interactions` for MMM-level audit trail.

**Edge Functions that call AIMC** (under what conditions):

| Edge Function | AIMC Endpoint | Condition |
|--------------|---------------|-----------|
| `mmm-ai-framework-parse` | `/api/ai/framework-parse` | User triggers Mode A parse (J-06, step 7.2) |
| `mmm-ai-framework-generate` | `/api/ai/framework-generate` | User triggers Mode B generation (J-07, step 8.2) |
| `mmm-ai-framework-alter` | `/api/ai/framework-alter` | User uses AI altering mechanism (J-07, step 8.3–8.7) |
| `mmm-ai-evidence-evaluate` | `/api/ai/evidence-evaluate` | Evidence submitted; AI evaluation requested |
| `mmm-ai-recommend` | `/api/ai/recommend` | Findings generated; recommendations requested |
| `mmm-ai-chat` | `/api/ai/chat` | User opens Ask Maturion chat (J-17) |
| `mmm-ai-explain` | `/api/ai/explain` | User requests contextual explanation |
| `mmm-ai-assessment-interpret` | `/api/ai/assessment-interpret` | Free assessment completed (J-02, step 3.5) |

**Payload contract**:

*Request envelope* (from MMM Edge Function to AIMC):
```json
{
  "operation": "<operation name from endpoint>",
  "organisation_id": "uuid",
  "actor_id": "uuid",
  "context": { <operation-specific payload> }
}
```

*Response envelope* (from AIMC to MMM Edge Function — TR-012):
```json
{
  "success": boolean,
  "data": <operation-specific payload>,
  "error": { "code": string, "message": string } | null,
  "request_id": string
}
```

**Authentication model** (TR-011):
- MMM Edge Function obtains service-to-service JWT from Supabase Auth (service role)
- JWT TTL: 3 600 seconds; rotated before expiry
- Passed as `Authorization: Bearer <token>` header on every AIMC call
- Zero direct AI provider calls anywhere in MMM codebase (verified by static analysis)

**Error handling and circuit breaker architecture** (TR-009):
- Circuit breaker state maintained in Edge Function runtime memory
- State: `CLOSED` (normal) → `OPEN` (5 consecutive failures in 60s) → `HALF_OPEN` (30s hold, probe) → `CLOSED` (probe success)
- When `OPEN`: Edge Function returns fallback response with `{ "fallback": true, "reason": "AIMC_CIRCUIT_OPEN" }`
- Frontend renders graceful degradation UI: "AI features temporarily unavailable"
- Circuit breaker state reported in `/api/health` response (TR-052)

**AI Human Oversight architecture** (TR-033):
- AI scoring proposals written to `mmm_score_proposals`, NOT to `mmm_maturity_scores`
- `mmm_maturity_scores.confirmed_by` is `NOT NULL` (database constraint)
- Score confirmation Edge Function (`mmm-score-confirm`) requires `{ "confirm": true }` in payload
- Human confirmation moves score from `mmm_score_proposals` to `mmm_maturity_scores`
- No pathway exists for AI to write directly to `mmm_maturity_scores`

**Timeout contract** (TR-014):

| Operation | Request Timeout | Retry Policy |
|-----------|----------------|-------------|
| Framework parsing | 60 s | 1 retry with 10 s backoff |
| Framework generation | 90 s | 1 retry with 15 s backoff |
| Evidence evaluation | 30 s | 2 retries with 5 s backoff |
| Scoring recommendations | 30 s | 2 retries with 5 s backoff |
| Contextual chat / explain | 45 s | 1 retry with 10 s backoff |
| Assessment interpretation | 60 s | 1 retry with 10 s backoff |

**AIMC versioning rule** (TR-013): Current surface is `/api/ai/*` (unversioned).
On any AIMC URI-versioned successor, MMM must support a dual-routing compatibility
period of ≥ 30 days. Migration requires a dedicated implementation wave.

---

### A6.2 — MMM ↔ PIT Integration Boundary

**Architecture-level boundary**:

| Domain | Owner | Rule |
|--------|-------|------|
| Maturity findings and recommendations | **MMM** | MMM generates, stores, and presents all findings and recommendations. These are the output of assessment cycles. |
| Executable implementation plans | **PIT** | PIT owns all implementation plan lifecycle: task tracking, assignment, status, completion. |
| Export/interface contract (producer) | **MMM** | MMM produces the structured JSON export package conforming to TR-016 schema. |
| Export/interface contract (consumer) | **PIT** | PIT receives and imports the export package; PIT creates the executable plan. |
| Planning logic | **PROHIBITED in MMM** | No task tracking, assignment, or plan execution logic may exist in MMM. |

**Export flow architecture** (J-14 — Findings Review Screen):

```
[User confirms export on J-14]
       │
       ▼
[mmm_pit_exports: INSERT { status: PENDING }]
       │
       ▼
[Edge Function: mmm-pit-export-send]
       ├─ Validate assessment findings complete
       ├─ Serialize to TR-016 JSON schema
       ├─ POST to PIT import endpoint
       │
       ▼
[PIT acknowledges: { "accepted": true, "pit_task_id": "uuid" }]
       │
       ▼
[mmm_pit_exports: UPDATE { status: SENT, pit_task_id, sent_at }]
[mmm_audit_logs: INSERT { action_type: PIT_EXPORT_CONFIRM }]
       │
       ▼
[Frontend: display confirmation + PIT task link]
```

**Data handover architecture — structured JSON payload shape** (TR-016):
```json
{
  "export_id": "uuid",
  "organisation_id": "uuid",
  "framework_id": "uuid",
  "export_timestamp": "ISO 8601",
  "findings": [
    {
      "criterion_id": "uuid",
      "criterion_ref": "string",
      "maturity_position": 1 | 2 | 3 | 4 | 5,
      "gap_to_next": 0 | 1 | 2 | 3 | 4,
      "finding_text": "string",
      "recommendation_text": "string",
      "evidence_refs": ["uuid"],
      "priority": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "recommendations": [
    {
      "recommendation_id": "uuid",
      "criterion_id": "uuid",
      "text": "string",
      "rationale": "string",
      "target_level": 1 | 2 | 3 | 4 | 5,
      "estimated_effort": "string"
    }
  ],
  "implementation_tasks": [
    {
      "task_id": "uuid",
      "recommendation_id": "uuid",
      "title": "string",
      "description": "string",
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "suggested_owner": "string | null"
    }
  ]
}
```

**Evidence return architecture** (TR-018):
- PIT calls `POST /api/evidence/pit-return` on MMM
- Authentication: Supabase service-role JWT from PIT
- Payload: `{ "pit_export_id": "uuid", "criterion_id": "uuid", "evidence_ref": "uuid", "implementation_status": "IN_PROGRESS" | "COMPLETE", "notes": "string" }`
- MMM links evidence to criterion; writes audit log entry `PIT_EVIDENCE_RETURN`

---

### A6.3 — MMM ↔ KUC Integration Boundary

**Upload request flow architecture** (TR-019):

All document uploads (framework-source and evidence) are routed through KUC
(Knowledge Upload Centre — within AIMC scope). MMM Edge Functions act as authenticated
proxies to the KUC upload endpoint.

```
[Frontend: file selected by user]
       │
       ▼
[Edge Function: mmm-upload-framework-source OR mmm-upload-evidence]
       ├─ Validate file size ≤ 50 MB (TR-006)
       ├─ Validate document_role matches upload context
       ├─ Forward multipart/form-data to KUC
       │
       ▼
[KUC: store file + classify + create parse_job (if framework-source)]
       │
       ▼
[KUC response: TR-020 classification envelope]
       ├─ { "upload_id": "uuid", "document_role": "...", "classification": {...}, "parse_job_id": "uuid | null" }
       │
       ▼
[Edge Function: store document record + parse_job reference]
[Return classification result to frontend]
```

**Upload request format** (TR-019):
```
POST /api/upload/framework-source   (or /evidence)
Content-Type: multipart/form-data

Fields:
  file: <binary>
  document_role: "criteria_source" | "evidence"
  organisation_id: uuid
  user_id: uuid
  metadata: JSON string { "filename", "mime_type", "size_bytes", "upload_context" }
```

**Classification response handling** (TR-020):
- `parse_job_id` is non-null for all `criteria_source` uploads
- Frontend polls `GET /api/parse-jobs/:id/status` until status = `COMPLETE` or `FAILED`
- On `COMPLETE`: framework preview available via `GET /api/frameworks/:id/parsed`
- On `FAILED`: user presented with error and re-upload option

**Framework-source vs evidence-source ingestion distinction** (Harvest Map governance rule):
- `criteria_source` uploads: long-lived, versioned framework documents; create parse jobs
  → populate `mmm_proposed_domains`, `mmm_proposed_mps`, `mmm_proposed_criteria`
- `evidence` uploads: assessment-scoped; classification metadata linked to criterion
  → populate `mmm_evidence` with `storage_ref` pointing to `mmm-evidence` Supabase bucket
- These two pathways must not be conflated in implementation or testing

---

## A7 — Security Architecture

*Derived from: TRS §5 (TR-029 through TR-038)*

### A7.1 — Authentication and JWT Flow (TR-029 through TR-030)

```
[User: email/password or magic link or OAuth]
       │
       ▼
[Supabase Auth: validates credentials]
       │
       ▼
[Access token (JWT, 1-hour TTL) + Refresh token (7-day TTL)]
       │
       ▼
[Frontend: stores tokens in Supabase Auth client (memory + cookie)]
[JWT claims include: sub (user_id), role, org_id]
       │
       ▼
[API calls: Authorization: Bearer <access_token>]
[Edge Functions: validate JWT; extract claims]
[PostgREST: RLS policy evaluates auth.jwt() claims]
```

Supported auth methods (TR-029): Email + password, magic link, Google OAuth,
Microsoft OAuth (as configured by CS2). No alternative auth provider without CS2 authorization.

JWT refresh: Supabase Auth client handles automatic token refresh. Service-to-service
JWTs (for AIMC, PIT calls) use the service role key (never exposed to frontend).

### A7.2 — RLS Policy Model for Multi-Organisation Isolation (TR-031 through TR-032)

See §A5.3 for the complete RLS policy architecture.

**Isolation guarantee**: A verified RLS bypass test (TR-032) must be included in
QA-to-Red. Test scenario: User A (org A) authenticated session must not be able to
read, write, or infer existence of any row belonging to org B, even via:
- Direct PostgREST query manipulation
- Edge Function payload injection
- JWT claim forgery (AIMC service token must not be usable by frontend callers)

**`mmm_` namespace enforcement** (TR-028): Cross-module data access (AIMC, PIT) is
API-mediated only. No direct Supabase joins from MMM tables to non-MMM tables.
No foreign keys from `mmm_*` tables to tables outside the `mmm_` namespace.

### A7.3 — Invitation Security Model (TR-035)

- Token generation: `pgcrypto.gen_random_bytes(32)` — 256-bit entropy
- TTL: 72 hours from issuance
- Single-use: token invalidated on first acceptance
- Acceptance flow: token presented → email matched → Supabase Auth account created or linked → org access granted
- Expired invitations: hard-deleted via scheduled Edge Function (30-day cleanup for unaccepted)
- Replay attack test required in QA-to-Red (TR-035)

### A7.4 — Scope-Based Permission Enforcement (TR-036)

Permission matrix enforced at both API/Edge Function level and RLS level:

| Permission | ADMIN | ASSESSOR | VIEWER |
|-----------|-------|----------|--------|
| Read framework | ✅ | ✅ | ✅ |
| Write framework | ✅ | ❌ | ❌ |
| Publish framework | ✅ | ❌ | ❌ |
| Submit evidence | ✅ | ✅ | ❌ |
| Confirm score | ✅ | ✅ | ❌ |
| Override score (ADMIN-only) | ✅ | ❌ | ❌ |
| Export to PIT | ✅ | ✅ | ❌ |
| Manage users / invitations | ✅ | ❌ | ❌ |
| View dashboard | ✅ | ✅ | ✅ |
| Admin AI interface | ✅ | ❌ (403) | ❌ (403) |

Each permission boundary must be tested in QA-to-Red with an unauthorized role
attempting the restricted action and verifying the rejection response.

### A7.5 — Compliance Artifacts Architecture (TR-037)

The following compliance artifacts must be produced at the Architecture stage gate-pass:

- `modules/MMM/04-architecture/COMPLIANCE_SCOPE.md` — ISO 27001, ISO 31000, NIST CSF control scope
- `modules/MMM/04-architecture/CONTROL_MAPPING.md` — Control-to-requirement traceability
- `modules/MMM/04-architecture/EVIDENCE_CATALOG.md` — Evidence types accepted per control

Note: These are Architecture stage artifacts, not code. They document the control scope
and mapping; implementation verification occurs in QA-to-Red.

### A7.6 — AI Governance Logging (TR-034)

All AI interactions logged in `mmm_audit_logs` AND `mmm_ai_interactions`:

`mmm_audit_logs` entry for each AI call:
- `action_type`: `AI_PARSE | AI_GENERATE | AI_EVALUATE | AI_RECOMMEND | AI_CHAT | AI_EXPLAIN | AI_INTERPRET`
- `actor_id`: user ID who triggered the call
- `target_entity_id`: entity to which AI result applies
- `before_state`: null (for proposals) or prior score (for override context)
- `after_state`: AI proposal JSON

`mmm_ai_interactions` additional telemetry (for TR-066 admin AI telemetry dashboard):
- `token_count`, `duration_ms`, `status` for cost and latency tracking

---

## A8 — Deployment and Runtime Topology

*Derived from: TRS §8 (TR-048 through TR-053), §3.3 (TR-053)*

### A8.1 — Vercel Frontend Deployment (TR-048)

- **Target platform**: Vercel (production + preview deployments)
- **Build command**: `vite build` — output to `dist/` directory
- **Vercel configuration**: `vercel.json` at repository root specifying:
  - Build command, output directory
  - Environment variable references (not values)
  - SPA fallback routing: all routes → `index.html`
- **Platform constraints**:
  - No persistent server processes on Vercel; all backend logic in Supabase Edge Functions
  - Vercel Edge Network CDN serves static assets from `dist/`
  - Vercel preview deployments use staging Supabase project (separate from production)

### A8.2 — Supabase Backend Topology (TR-049 through TR-051)

```
Supabase Project (Production)
│
├── PostgreSQL database
│   ├── All mmm_* tables
│   ├── RLS policies
│   └── Indexes
│
├── Supabase Auth
│   ├── Email/password, magic link, Google, Microsoft OAuth
│   └── JWT issuer (access token 1h, refresh token 7d)
│
├── Supabase Edge Functions (Deno)
│   └── All mmm-* Edge Functions (see §A4.1)
│
└── Supabase Storage
    ├── mmm-evidence bucket (private, authenticated)
    └── mmm-framework-sources bucket (private, authenticated)
        └── snapshots/{framework_id}/v{version}.json (immutable)
```

**Schema migrations** (TR-050):
- All schema changes delivered as numbered Supabase migrations
- Location: `supabase/migrations/`
- Naming convention: `YYYYMMDDHHMMSS_mmm_<description>.sql`
- Applied via: `supabase db push` or `supabase migration up` from clean state
- Rollback strategy: each migration must have a corresponding rollback script;
  tested in staging before production deployment

### A8.3 — AIMC Integration Topology

```
MMM Edge Function → AIMC Gateway (https://<AIMC_BASE_URL>/api/ai/*)
```

- AIMC is hosted on Render or Vercel (CS2-configured; not MMM-managed)
- MMM Edge Functions call AIMC over HTTPS with service-to-service JWT auth
- AIMC URL configured via `AIMC_BASE_URL` environment variable (TR-053)
- MMM has no knowledge of AIMC's internal hosting or provider routing

### A8.4 — Environment Variables and Configuration Management (TR-053)

**Required environment variables**:

| Variable | Scope | Description |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | Frontend + Edge Functions | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend only | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions only (NEVER frontend) | Service role key for privileged operations |
| `AIMC_BASE_URL` | Edge Functions only | AIMC gateway base URL |
| `AIMC_SERVICE_TOKEN` | Edge Functions only | Service-to-service token for AIMC |
| `PIT_BASE_URL` | Edge Functions only | PIT import endpoint base URL |
| `PIT_SERVICE_TOKEN` | Edge Functions only | Service-to-service token for PIT |
| `MMM_ENV` | Edge Functions | Environment identifier: `development | staging | production` |

**`.env.example` file** (TR-053 mandatory artifact): Must be created at
`modules/MMM/.env.example` (or repository root per platform convention)
with all variables documented with format, source, and placeholder values.

**Commissioning check CHK-002** (TR-051): All required variables verified present
before application enters VALIDATED state.

**Secrets management rule**: `SUPABASE_SERVICE_ROLE_KEY`, `AIMC_SERVICE_TOKEN`,
and `PIT_SERVICE_TOKEN` are secrets. Never logged, never exposed to frontend
(`VITE_` prefix is prohibited for these variables), never committed to source code.

### A8.5 — CI/CD Pipeline Integration

- Vercel GitHub integration: automatic preview deployments on PR; production deployment on merge to `main`
- CI gates (all must pass before merge):
  - TypeScript strict check (`tsc --strict --noEmit`)
  - ESLint with zero-warning policy (`--max-warnings 0`)
  - Vitest unit coverage ≥ 80% (TR-054)
  - Playwright E2E suite on staging environment (TR-056)
  - Lighthouse CI on preview URL (TR-057)
  - axe-core accessibility scan (TR-059)
  - OWASP ZAP baseline scan (TR-058)
  - `npm audit` — zero HIGH/CRITICAL CVEs (TR-058)

### A8.6 — Non-Testable Configuration (Architecture Completeness §3.5)

The following configuration aspects cannot be validated by automated CI tests and
require manual runtime verification after deployment:

| Configuration Aspect | Verification Step |
|----------------------|------------------|
| Vercel production environment variables | Post-deploy commissioning check (CHK-002) — health endpoint reports DEGRADED if missing |
| Supabase RLS policies active in production | RLS bypass smoke test after first production migration |
| AIMC production endpoint reachability | Commissioning check CHK-004; health endpoint `services.aimc` status |
| SSL/TLS certificates for all endpoints | Browser security indicator + SSL Labs scan |
| Supabase Storage bucket permissions | Manual access test post-deploy: unauthenticated access attempt returns 403 |
| Supabase Auth OAuth provider configuration | OAuth sign-in flow manual test post-deploy |

**Failure detection**: `/api/health` endpoint (TR-052) reports per-service status.
A `DEGRADED` or `DOWN` response triggers rollback consideration. Rollback trigger:
any `services.database = DOWN` or `services.auth = DOWN` in health response.

---

## A9 — State Persistence Architecture

*Derived from: TRS §10 (TR-063), §6 (TR-039 through TR-042), TR-008*

### A9.1 — Server-Side Persistence (Supabase)

| State Domain (TR-063) | Persistence Table | Notes |
|-----------------------|-------------------|-------|
| (a) Organisation selection | `mmm_profiles.current_org_id` | Cached in JWT claims on refresh |
| (b) Framework selection | `mmm_profiles.current_framework_id` | Server-side per user |
| (d) Dashboard filters | `mmm_user_preferences.filters` (jsonb) | Per user, keyed by filter name |
| (g) AI conversation context | `mmm_ai_interactions` | All AI chat turns persisted |
| (h) UI preferences | `mmm_user_preferences.ui` (jsonb) | Theme, sidebar state per user |
| (i) Role and scope context | JWT claims + `mmm_profiles.role` | Refreshed on auth token renewal |

### A9.2 — Client-Side Persistence (TanStack Query, Zustand, localStorage)

| State Domain (TR-063) | Persistence Location | Key |
|-----------------------|---------------------|-----|
| (c) Navigation position | URL + localStorage | `mmm_nav_position` |
| (e) Evidence workspace drafts | localStorage | `mmm_evidence_draft_{id}` |
| (f) Offline queue state | localStorage | `mmm_audit_queue` (TR-040) |

**TanStack Query cache**: Server state is cached in-memory per stale time policy (§A3.5).
Cache survives SPA navigation but is reset on browser refresh (intentional: authoritative
source is Supabase DB).

**Ephemeral state**: Modal open/close, unsaved non-draft form fields, transient UI
selection state — intentionally lost on refresh.

**Legacy localStorage key migration** (TR-063): The following legacy keys from prior
implementations are superseded and must be migrated or ignored:
- `mmm_org_id` → superseded by `mmm_profiles.current_org_id`
- `mmm_framework_filter` → superseded by `mmm_user_preferences.filters`
- `mmm_active_audit_session` → superseded by `mmm_audit_queue` + `mmm_ai_interactions`

### A9.3 — Queue-and-Sync Model (TR-039 through TR-042)

See §A3.8 for the complete queue-and-sync architecture diagram.

**Invariants**:
- Queue applies only to Audit Workbench evidence capture (TR-042)
- Maximum queue size: 50 entries (TR-040)
- Auto-sync on reconnection with exponential backoff retry (TR-040)
- UI must accurately display queue depth in `<ConnectivityBanner>` (TR-041)
- Queue cleared only on confirmed server write; never cleared on timeout

### A9.4 — Real-Time Update Architecture (TR-008)

Supabase Realtime subscription is established on the `mmm_maturity_scores` table
filtered by `assessment_id` for the currently active assessment.

**Subscription lifecycle**:
- Subscribed: when user navigates to `/dashboard` or any view with live score display
- Unsubscribed: when user navigates away; managed by TanStack Query's `onSettled` cleanup
  or a dedicated React `useEffect` cleanup

**Update flow**:
```
[Score confirmed on any client]
       │
       ▼
[mmm_maturity_scores INSERT/UPDATE in Supabase]
       │
       ▼
[Supabase Realtime broadcasts to all subscribed clients]
       │
       ▼
[TanStack Query: invalidate ['mmm', 'maturity_scores', assessmentId]]
       │
       ▼
[Dashboard re-renders with updated score]
Target: ≤ 3 seconds from event commit to visible update (TR-008)
```

---

## A10 — Multi-Organisation and Tenant Isolation Architecture

*Derived from: TRS §5 (TR-031, TR-032), §7 (TR-043 through TR-046)*

### A10.1 — RLS-Based Tenant Isolation

MMM operates as a **shared-schema multi-tenant** deployment. Every MMM table that holds
organisation-scoped data carries an `organisation_id` column with a foreign key to
`mmm_organisations.id`. RLS policies enforce that authenticated users can only access
rows where `organisation_id` matches the `org_id` claim in their JWT.

This model supports ≥ 1 000 organisations (TR-043) without schema changes. No
per-organisation database, schema, or Supabase project is required.

### A10.2 — Organisation Boundary Model

```
mmm_organisations (top-level tenant boundary)
       │
       ├── mmm_frameworks (organisation_id FK)
       ├── mmm_assessments (organisation_id FK)
       ├── mmm_audit_sessions (organisation_id FK)
       ├── mmm_pit_exports (organisation_id FK)
       ├── mmm_profiles (organisation_id FK)
       ├── mmm_invitations (organisation_id FK)
       └── mmm_organisation_hierarchy (organisation_id FK)
```

All child entities (domains, criteria, evidence, scores) are transitively scoped to
an organisation via their parent entity's `organisation_id`.

**Cross-organisation isolation rules**:
1. No direct cross-organisation queries are permitted via any API endpoint
2. AIMC context payloads include `organisation_id` — AIMC must not return results
   containing data from other organisations
3. PIT export payloads include `organisation_id` — PIT import must validate
   that the receiving PIT organisation matches the exporting MMM organisation

### A10.3 — Multi-Organisation Scale Target Alignment

| Scale Metric | Target | Mechanism |
|-------------|--------|-----------|
| Organisations per instance | ≥ 1 000 | RLS + shared schema (TR-043) |
| Active frameworks per org | ≥ 20 × 500 criteria | DB indexes (TR-044, TR-046) |
| Concurrent assessors per framework | ≥ 10 | Last-write-wins at criterion level (TR-045) |
| Platform concurrent users | ≥ 500 | Supabase scaling; Edge Function horizontal scaling |
| API p95 latency under load | ≤ 500 ms | Indexes + Supabase connection pooling (TR-002, TR-046) |

---

## A11 — OQ-002 Resolution — Legacy UI / MAT Component Boundary

**Question** (from Harvest Map OQ-002, LG-03):
Has a component audit of the legacy UI assets been performed? Which components are
design-system-compatible and ready for Shared Platform harvesting?

### Legacy Sub-Folders in `modules/MMM/04-architecture/capabilities/`

The following sub-folders exist in the MMM capabilities directory:

| Sub-Folder | Contents | Assessment |
|-----------|----------|------------|
| `erm-framework/` | ERM (Enterprise Risk Management) database schema, edge functions, frontend component maps, sprint plans, wireframes, implementation guide, export spec — all versioned `v1.1` | ERM module artifacts from a prior risk management module migration |
| `risk-assessment/` | Risk assessment database schema, edge functions, frontend component maps, sprint plans, wireframes, true north docs — from same ERM module migration | ERM/Risk Assessment module artifacts |
| `threat-module/` | Threat module schema, edge functions, component maps, sprint plans, routing spec, integration map | ERM Threat module artifacts |
| `vulnerability-module/` | Vulnerability module artifacts (parallel to threat-module) | ERM Vulnerability module artifacts |
| `wrac/` | WRAC (weighted risk assessment and control) artifacts | ERM/WRAC module artifacts |

### OQ-002 Resolution Decision

**Finding**: These legacy sub-folders are **NOT MMM architecture artifacts**. They are
ERM (Enterprise Risk Management) and WRAC module artifacts from a prior module migration
into this directory path. They contain no MMM-specific capability specifications,
no Domain→MPS→Criteria structures, no maturity assessment workflows, and no alignment
with the MMM App Description, UX Wiring Spec, FRS, or TRS.

**Decision: These files are TRACEABILITY-ONLY historical artifacts. They are not inputs
to MMM architecture and must not be used by any MMM builder or QA agent.**

**Component disposition**:

| Legacy Component Set | Disposition | Rationale |
|---------------------|-------------|-----------|
| `erm-framework/` | TRACEABILITY-ONLY | ERM module artifacts; not MMM-relevant |
| `risk-assessment/` | TRACEABILITY-ONLY | ERM/Risk Assessment module; not MMM-relevant |
| `threat-module/` | TRACEABILITY-ONLY | ERM Threat module; not MMM-relevant |
| `vulnerability-module/` | TRACEABILITY-ONLY | ERM Vulnerability module; not MMM-relevant |
| `wrac/` | TRACEABILITY-ONLY | WRAC module; not MMM-relevant |

**What is reused from legacy assets for MMM**:
- **None** of these ERM/WRAC files are directly reused in MMM architecture.
- Per LG-03 in the harvest map, Shared Platform harvesting requires a component-level
  audit. This audit confirms that these specific files (ERM schema, ERM edge functions,
  ERM component maps) are not design-system-compatible candidates for the Maturity
  Management domain and are not suitable for Shared Platform adoption.

**What is rebuilt fresh**:
- All MMM components (React pages, feature components, Edge Functions, database schema)
  are built fresh from the FRS/TRS specifications.
- No ERM or WRAC implementation pattern, schema column, or component is adopted into MMM.

**What is retired**:
- These ERM/WRAC capability files have no live execution path in the MMM module.
  They are retained as TRACEABILITY-ONLY historical artifacts (not deleted) per
  the governance principle that legacy artifacts are preserved for audit traceability.

**Boundary rules for retained legacy assets**:
1. Files in `capabilities/erm-framework/`, `capabilities/risk-assessment/`,
   `capabilities/threat-module/`, `capabilities/vulnerability-module/`,
   `capabilities/wrac/` MUST NOT be referenced by any MMM builder, QA agent,
   or downstream specification stage.
2. No builder may use these files as implementation references.
3. These files have no switchover gate obligations (they were never MMM capabilities).
4. A `capabilities/index.md` artifact documents this disposition (created as a
   secondary Architecture artifact — see §A12 disposition index).

**OQ-002 Status**: ✅ RESOLVED (Stage 5 Architecture, 2026-04-14)
**Resolution Reference**: This document §A11; `modules/MMM/04-architecture/capabilities/index.md`

---

## A12 — OQ-003 Resolution — Criteria Duplication Handling

**Question** (from Harvest Map OQ-003, LG-05):
Has a full duplication audit of legacy vs Roadmap/MAT capabilities been completed?
Which legacy components are confirmed duplicates for retirement?

### OQ-003 Resolution: Duplication Architecture

**Duplicate detection rule**:
A MMM capability is a duplicate of a MAT/Roadmap capability when both of the following
are true:
1. The capability provides functionally equivalent behaviour (same user outcome, same data
   model, same governance rule) in the same operational context.
2. The source module has a documented convergence decision in the harvest map assigning
   canonical ownership to MMM (meaning the source module's copy is superseded).

Functional overlap without harvest map canonical assignment does NOT constitute a
duplicate for retirement purposes. All retirement decisions require explicit CS2 authorization.

**Canonical source rule**:
When a capability duplication exists, the canonical source is **MMM**, per the harvest
map ownership transition decisions. The source module's copy is transitionally held at
`ACTIVE_SOURCE` until MMM's equivalent passes the switchover gate (SG-1 through SG-5).

**Retirement / supersession rule**:
No source module capability may be retired until all 5 switchover gate conditions
(SG-1 through SG-5 in the harvest map) are satisfied and CS2 approves the transition.
No blanket retirement of legacy capabilities is authorized. Each capability is retired
individually with named evidence per SG-1 through SG-5.

**Migration / traceability rule**:
When a source capability is retired, its entry in the harvest map is updated to
`TRACEABILITY_ONLY` or `RETIRED` state. The harvest map remains the traceability anchor
for all retired capabilities. No capability may be retired without a corresponding
harvest map state update reviewed and approved by CS2.

**Architecture-level enforcement point(s)**:
1. **RLS / namespace isolation** (TR-028): `mmm_` table namespace ensures no accidental
   cross-module data sharing. MMM does not join to MAT or Roadmap tables.
2. **API-mediated boundary** (§A6): Cross-module data access (PIT, AIMC, KUC) is
   API-mediated only. No direct database access to non-MMM data.
3. **No legacy pattern adoption**: This architecture document and the OQ-002/OQ-003
   resolutions explicitly prohibit builders from adopting ERM/WRAC legacy patterns.
4. **Harvest map governance**: All capability ownership transitions are governed by
   the harvest map switchover gate model (SG-1 through SG-5). Architecture does not
   authorize any switchover — that authority belongs to CS2 + Foreman.

### Legacy Sub-Folder Component Audit (OQ-003 Named-Component-Level Artifact)

Per LG-05: "Each retired component must have: (a) named component identifier,
(b) confirmed Roadmap/MAT equivalent, (c) duplication-audit evidence reference."

| # | Legacy Component | Location | Confirmed MAT/Roadmap Equivalent? | Disposition |
|---|-----------------|----------|----------------------------------|-------------|
| 1 | ERM database schema (risk registers, risk items, controls) | `capabilities/erm-framework/ERM_DATABASE_SCHEMA_v1.1.md` | NO — ERM schema has no MMM equivalent; MMM uses maturity domain schema (domains/MPS/criteria) | TRACEABILITY-ONLY — no retirement; no MMM equivalent |
| 2 | ERM edge functions | `capabilities/erm-framework/ERM_EDGE_FUNCTIONS_v1.1.md` | NO — ERM risk operations are not maturity operations | TRACEABILITY-ONLY |
| 3 | ERM frontend component map | `capabilities/erm-framework/ERM_FRONTEND_COMPONENT_MAP_v1.1.md` | NO — Different domain and UI model | TRACEABILITY-ONLY |
| 4 | Risk assessment schema + edge functions | `capabilities/risk-assessment/RISK_ASSESSMENT_*` | NO — Risk assessment lifecycle is not maturity assessment lifecycle | TRACEABILITY-ONLY |
| 5 | Threat module schema + edge functions | `capabilities/threat-module/THREAT_*` | NO — Threat management is PIT domain, not MMM domain | TRACEABILITY-ONLY |
| 6 | Vulnerability module | `capabilities/vulnerability-module/` | NO — Vulnerability management is not maturity management | TRACEABILITY-ONLY |
| 7 | WRAC artifacts | `capabilities/wrac/` | NO — WRAC (weighted risk assessment and control) is risk domain, not maturity domain | TRACEABILITY-ONLY |

**Duplication audit conclusion**: None of the legacy sub-folder files in
`modules/MMM/04-architecture/capabilities/` constitute duplicates of MAT or Roadmap
maturity capabilities. They are ERM/WRAC risk management artifacts placed in this
directory path during a prior module migration. They are not candidates for LG-05
retirement (which applies to capabilities that duplicate Roadmap/MAT maturity capabilities).
They are TRACEABILITY-ONLY historical artifacts.

**Active duplication candidates** (from harvest map — not yet at retirement stage):
These capabilities remain `ACTIVE_SOURCE` in their source modules pending MMM build.
Retirement can only proceed after MMM equivalent passes switchover gate (SG-1 through SG-5):

| Harvest Map Ref | Source Capability | Source Module | MMM Equivalent |
|----------------|------------------|---------------|----------------|
| RR-01 | Free assessment flow | Maturity Roadmap | J-02 flow |
| RR-02 | Onboarding / org setup | Maturity Roadmap | J-04 flow |
| RR-03 | Domain/MPS/Criteria hierarchy | Maturity Roadmap | `mmm_domains`, `mmm_maturity_process_steps`, `mmm_criteria` |
| MT-01 | Criteria upload/parsing | MAT | J-06 + `mmm-upload-framework-source` Edge Function |
| MT-02 | Portable audit execution | MAT | J-11 Audit Workbench |
| MT-03 | Criterion-level evidence management | MAT | J-10 + `mmm_evidence` |
| MT-06 | Findings and recommendations | MAT + Roadmap | J-12 + `mmm_findings` |

None of these are authorized for retirement at this Architecture stage. Retirement
follows the switchover gate model; CS2 must authorize each transition.

**OQ-003 Status**: ✅ RESOLVED (Stage 5 Architecture, 2026-04-14)
**Resolution Reference**: This document §A12; harvest map LG-05

---

## A13 — Architecture Completeness Checklist

*Verified against `governance/canon/ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` v1.3*

| Domain | Standard Reference | Addressed In | Status |
|--------|-------------------|-------------|--------|
| 3.1 Deployment Target Declaration | §3.1 | §A8.1 — Vercel frontend; §A8.2 — Supabase backend; platform-specific constraints explicit | ✅ ADDRESSED |
| 3.2 Runtime Entrypoint and Filesystem | §3.2 | §A8.1 — Vite build → `dist/`; `vercel.json` at root; §A8.2 — Edge Function entry points | ✅ ADDRESSED |
| 3.3 Environment Variables | §3.3 | §A8.4 — All 8 required variables documented; `.env.example` mandated; secrets management rule explicit | ✅ ADDRESSED |
| 3.4 Database and Migration Strategy | §3.4 | §A8.2 — Supabase PostgreSQL; `supabase/migrations/`; naming convention; `supabase db push`; rollback strategy stated | ✅ ADDRESSED |
| 3.5 Non-Testable Configuration | §3.5 | §A8.6 — Explicit list of 6 non-testable config aspects; post-deploy verification steps; failure detection via `/api/health`; rollback triggers defined | ✅ ADDRESSED |
| 3.6 Integration and External Dependencies | §3.6 | §A6 — AIMC boundary (§A6.1), PIT boundary (§A6.2), KUC boundary (§A6.3); all contracts frozen | ✅ ADDRESSED |
| 3.7 Security and Compliance | §3.7 | §A7 — JWT auth, RLS, invitation security, scope-based permissions, compliance artifacts, AI governance logging | ✅ ADDRESSED |
| 3.8 Performance and Scalability | §3.8 | TRS §2 (TR-001 through TR-010), §7 (TR-043 through TR-047); §A10.3 scale target table | ✅ ADDRESSED |
| 3.9 Error Handling and Observability | §3.9 | §A3.9 — Error boundary strategy; §A4.5 — circuit breaker; §A8.5 — health endpoint (TR-052); §A4.1 — `mmm-health` Edge Function | ✅ ADDRESSED |
| 3.10 Test Strategy and QA Domains | §3.10 | TRS §9 (TR-054 through TR-061, TR-065); deferred to Stage 6 QA-to-Red for test case specification | ✅ ADDRESSED (QA catalog in Stage 6) |
| 3.11 Wiring and Interconnectivity Architecture | §3.11 | §A6 — Integration boundaries frozen; §A4.5 — AI gateway calling pattern; §A6.2 — PIT export flow; §A6.3 — KUC upload flow | ✅ ADDRESSED |
| 3.12 End-to-End Functional Paths | §3.12 | §A3.3 — 17 UX journeys wired to routes and components; §A6 — integration calling patterns; §A5 — data entities | ✅ ADDRESSED |
| 3.13 Wave-Based One-Time Build Model | §3.13 | §A1 — One-Time-Build integrity guarantees; §A15 — Downstream guardrails; frozen integration contracts declared | ✅ ADDRESSED |
| 3.14 QA Catalog Alignment | §3.14 | TRS quality gate definitions (TR-054 through TR-061, TR-065) provide catalog; full QA catalog deferred to Stage 6 | ✅ ADDRESSED (Stage 6 scope) |

**Final Verdict: Architecture Completeness: PASS**

All 14 domains from ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md §3 are explicitly addressed
in this architecture document. No domain is absent, deferred without reference, or
unresolved. Two domains (3.10 Test Strategy, 3.14 QA Catalog) are addressed at the
architecture level (TRS quality gates declared) with full test case specification deferred
to Stage 6 (QA-to-Red) — this deferral is explicit, named, and within stage-model norms.

---

## A14 — TRS → Architecture Traceability Matrix

All 66 TRS requirements (TR-001 through TR-066) are traced to architecture sections below.

| TR | Category | Description (abbreviated) | Architecture Section | Status |
|----|----------|--------------------------|---------------------|--------|
| TR-001 | Performance | Page load TTI ≤ 2.5 s | §A8.5 CI/CD (Lighthouse CI gate); §A3.5 TanStack stale-time | ✅ |
| TR-002 | Performance | API response p95 ≤ 500 ms (non-AI) | §A4.1 Edge Function inventory; §A5.4 DB indexes; §A10.3 scale table | ✅ |
| TR-003 | Performance | ≥ 50 concurrent users/org; ≥ 500 platform | §A10.3 scale target; §A8.2 Supabase topology | ✅ |
| TR-004 | Performance | Scoring cascade ≤ 2 s | §A4.3 scoring cascade business logic; §A4.1 `mmm-score-cascade` Edge Function | ✅ |
| TR-005 | Performance | Dashboard render ≤ 1.5 s cached / ≤ 3 s cold | §A3.5 TanStack Query stale-time (30s for scores); §A3.3 LiveDashboard route | ✅ |
| TR-006 | Performance | File upload ≤ 50 MB; begin processing ≤ 3 s | §A6.3 KUC upload architecture; §A4.1 `mmm-upload-*` functions | ✅ |
| TR-007 | Performance | Audit session load ≤ 2 s (500 criteria) | §A3.3 AuditWorkbench route; §A5.4 `mmm_criteria(mps_id)` index | ✅ |
| TR-008 | Performance | Real-time score update ≤ 3 s | §A9.4 Supabase Realtime subscription architecture | ✅ |
| TR-009 | Performance | Circuit breaker: 5 failures / 60 s | §A4.5 circuit breaker architecture; §A6.1 AIMC error handling | ✅ |
| TR-010 | Performance | Health endpoint p99 ≤ 100 ms | §A4.1 `mmm-health` Edge Function; §A8.5 CI gate | ✅ |
| TR-011 | Integration (AIMC) | Service-to-service JWT; 3 600 s TTL | §A6.1 Authentication model | ✅ |
| TR-012 | Integration (AIMC) | JSON + canonical AIMC response envelope | §A6.1 Payload contract | ✅ |
| TR-013 | Integration (AIMC) | Unversioned `/api/ai/*`; 30-day migration window | §A6.1 AIMC versioning rule | ✅ |
| TR-014 | Integration (AIMC) | Per-operation timeouts and retry policies | §A6.1 Timeout contract table | ✅ |
| TR-015 | Integration (AIMC) | 8 AIMC endpoints | §A4.1 Edge Function inventory (all 8 `mmm-ai-*` functions); §A6.1 endpoint table | ✅ |
| TR-016 | Integration (PIT) | PIT export payload schema | §A6.2 Data handover architecture / JSON schema | ✅ |
| TR-017 | Integration (PIT) | PIT export trigger and 7-step handshake | §A6.2 Export flow architecture diagram | ✅ |
| TR-018 | Integration (PIT) | PIT → MMM evidence return contract | §A6.2 Evidence return architecture | ✅ |
| TR-019 | Integration (KUC) | KUC upload request contract | §A6.3 Upload request format | ✅ |
| TR-020 | Integration (KUC) | KUC classification response contract | §A6.3 Classification response handling | ✅ |
| TR-021 | Data Persistence | Supabase PostgreSQL sole canonical store | §A5.1 entity model; §A5.2 core schema | ✅ |
| TR-022 | Data Persistence | Core entity schema with mandatory columns | §A5.2 Core Entity Schema table (all entities) | ✅ |
| TR-023 | Data Persistence | Data retention policy | §A5.5 Data Retention Architecture table | ✅ |
| TR-024 | Data Persistence | Deduplication: unique constraint evidence | §A5.2 `mmm_evidence` table notes; constraint documented | ✅ |
| TR-025 | Data Persistence | Evidence freshness tracking | §A4.4 Evidence staleness evaluation (data transformation layer) | ✅ |
| TR-026 | Data Persistence | Maturity score version history | §A5.2 `mmm_override_log`; §A5.7 audit log architecture | ✅ |
| TR-027 | Data Persistence | Framework versioning immutable snapshots | §A5.8 Framework Versioning Storage | ✅ |
| TR-028 | Data Persistence | Canonical data separation (`mmm_` namespace) | §A7.2 cross-org isolation rules; §A5.1 entity model (`mmm_` prefix) | ✅ |
| TR-029 | Security | Supabase Auth sole provider | §A7.1 authentication and JWT flow | ✅ |
| TR-030 | Security | JWT token requirements (1h TTL, refresh) | §A7.1 JWT flow; §A8.4 env vars (service role key) | ✅ |
| TR-031 | Security | RLS policy baseline | §A5.3 RLS policy architecture table | ✅ |
| TR-032 | Security | Cross-org data isolation guarantee | §A5.3 RLS policy template; §A7.2 RLS bypass test requirement | ✅ |
| TR-033 | Security | AI Human Oversight — score proposal model | §A4.3 HITL enforcement; §A6.1 AI Human Oversight architecture | ✅ |
| TR-034 | Security | AI governance logging | §A7.6 AI Governance Logging; §A5.7 audit log action types | ✅ |
| TR-035 | Security | Invitation security model | §A7.3 Invitation Security Model | ✅ |
| TR-036 | Security | Scope-based permission enforcement | §A7.4 Permission matrix; §A3.3 route guard architecture | ✅ |
| TR-037 | Security | Compliance baseline artifacts | §A7.5 Compliance Artifacts Architecture | ✅ |
| TR-038 | Security | Audit log technical requirements | §A5.7 Audit Log Architecture (8-column schema, action vocabulary) | ✅ |
| TR-039 | Offline/Connectivity | Connectivity-required declaration | §A2 key architectural decisions; §A3.7 connectivity state machine | ✅ |
| TR-040 | Offline/Connectivity | Queue-and-sync for Audit Workbench | §A3.8 queue-and-sync architecture; §A5.6 localStorage schema | ✅ |
| TR-041 | Offline/Connectivity | Connectivity status UI | §A3.7 `<ConnectivityBanner>` rendering rules | ✅ |
| TR-042 | Offline/Connectivity | Queue-and-sync scope boundary | §A3.7 scope boundary note; §A3.8 scope declaration | ✅ |
| TR-043 | Scalability | ≥ 1 000 organisations support | §A10.1 RLS-based tenant isolation; §A10.3 scale target table | ✅ |
| TR-044 | Scalability | ≥ 20 active frameworks × 500 criteria | §A10.3 scale target; §A5.4 `mmm_criteria(mps_id)` index | ✅ |
| TR-045 | Scalability | ≥ 10 concurrent assessors per framework | §A10.3 last-write-wins at criterion level | ✅ |
| TR-046 | Scalability | Database index requirements | §A5.4 Database Index Requirements table (10 indexes) | ✅ |
| TR-047 | Scalability | Supabase Storage bucket config | §A8.2 `mmm-evidence` and `mmm-framework-sources` buckets; 50 MB limit | ✅ |
| TR-048 | Infrastructure | Vercel frontend deployment | §A8.1 Vercel Frontend Deployment | ✅ |
| TR-049 | Infrastructure | Supabase Edge Functions (Deno) only | §A4 Backend Architecture; §A4.1 Edge Function inventory | ✅ |
| TR-050 | Infrastructure | Numbered Supabase migrations | §A8.2 Schema migrations naming convention and execution | ✅ |
| TR-051 | Infrastructure | Commissioning state machine (5 checks) | §A4.3 commissioning state machine; §A8.5 CHK-002 in CI/CD | ✅ |
| TR-052 | Infrastructure | Health endpoint `GET /api/health` | §A4.1 `mmm-health` Edge Function; §A8.6 failure detection | ✅ |
| TR-053 | Infrastructure | Environment variables | §A8.4 Environment Variables table (8 variables) | ✅ |
| TR-054 | Quality Gates | Unit test coverage ≥ 80% | §A8.5 CI/CD gates (Vitest coverage) | ✅ |
| TR-055 | Quality Gates | Integration test coverage (6 areas) | §A8.5 CI/CD integration tests; §A6 integration boundaries drive test scope | ✅ |
| TR-056 | Quality Gates | E2E test coverage (17 journeys) | §A3.3 route structure (17 journeys); §A8.5 Playwright E2E gate | ✅ |
| TR-057 | Quality Gates | Performance test gate (k6, Lighthouse) | §A8.5 CI/CD performance gates | ✅ |
| TR-058 | Quality Gates | Security scan gate (ZAP, npm audit, RLS bypass) | §A8.5 CI/CD security gates; §A7.2 RLS bypass test | ✅ |
| TR-059 | Quality Gates | Accessibility gate (WCAG 2.1 AA, axe-core) | §A3.10 Accessibility Approach; §A8.5 axe-core CI gate | ✅ |
| TR-060 | Quality Gates | QIW dashboard 5 pipeline stages + 7-day trend | §A3.3 QIW route wiring; §A4.1 `mmm-qiw-status` Edge Function | ✅ |
| TR-061 | Quality Gates | Zero-warning CI policy | §A8.5 CI/CD gates (tsc --strict, ESLint --max-warnings 0) | ✅ |
| TR-062 | Cross-Cutting | Notification technical contract | §A3.4 `notificationStore` Zustand slice; §A3.4 notification architecture | ✅ |
| TR-063 | Cross-Cutting | State persistence model (9 domains) | §A9 State Persistence Architecture (§A9.1, §A9.2, §A9.3) | ✅ |
| TR-064 | Cross-Cutting | `APP_STARTUP_REQUIREMENTS.md` artifact | §A4.3 commissioning state machine (5 checks); artifact required at gate-pass | ✅ |
| TR-065 | Quality Gates | QIW API `/api/qiw/status` | §A4.1 `mmm-qiw-status` Edge Function; §A3.3 Admin route | ✅ |
| TR-066 | Security | Admin AI administration interface | §A3.3 Admin routes (`/admin/ai-chat`, `/admin/ai-telemetry`); §A7.4 ADMIN-only guard; §A5.2 `mmm_ai_interactions` table | ✅ |

**Traceability summary**: 66 of 66 TRS requirements addressed. Zero untraced TRs.

---

## A15 — Downstream Guardrails

The following constraints apply to all downstream stages. **Stage 6 (QA-to-Red),
Stage 7 (PBFAG), Stage 8 (Implementation Plan), Stage 11 (Builder Appointment),
and Stage 12 (Build Execution & Evidence)
must NOT assume or change the following without CS2 authorization and a dedicated
architecture revision wave:**

### A15.1 — Frozen Architecture Decisions (No Change Without CS2 Authorization)

1. **AIMC as sole AI gateway**: Zero direct AI provider calls anywhere in MMM. Any change
   to add a direct provider integration requires CS2-authorized architecture revision.

2. **Supabase Edge Functions (Deno) as sole backend execution model**: No Express, Fastify,
   or custom server code. Any Render-hosted or alternative server-side service requires
   explicit CS2 authorization.

3. **Shared-schema multi-tenant RLS model**: No per-organisation schemas or databases.
   No bypassing RLS for any purpose.

4. **`mmm_` namespace for all tables**: No cross-module database joins. No foreign keys to
   non-MMM tables. API-mediated boundary is absolute.

5. **Human-in-the-loop score confirmation**: AI proposals must always write to
   `mmm_score_proposals`; human confirmation is required before `mmm_maturity_scores` write.
   No automated direct-to-scores pipeline.

6. **Integration contracts frozen at §A6**: AIMC payload envelope (TR-012), PIT export
   schema (TR-016), KUC upload contract (TR-019, TR-020) are frozen. Any contract change
   requires architecture revision.

7. **Queue-and-sync scope boundary** (TR-042): Queue-and-sync applies ONLY to Audit
   Workbench evidence capture. No scope expansion without architecture revision.

8. **Vercel + Supabase topology**: No addition of Render-hosted MMM services, alternative
   hosting, or database systems without CS2 authorization.

### A15.2 — Stage 6 (QA-to-Red) Scope Boundaries

- Stage 6 derives test cases from this architecture + FRS/TRS. It does NOT modify architecture.
- Stage 6 must test all integration contracts as frozen in §A6.
- Stage 6 must include the mandatory RLS bypass test (TR-032).
- Stage 6 must cover all 17 UX journeys (J-01 through J-17) — no journey may be excluded.
- Stage 6 must include the circuit breaker test (TR-009) — not optional.
- Stage 6 must NOT assume different performance thresholds than those in TRS §2.

### A15.3 — Stage 7 (PBFAG) Scope Boundaries

- PBFAG must verify the Runtime/Deployment Contract is complete (§A8 is the source).
- PBFAG must confirm all external dependencies (AIMC, PIT, KUC) are available.
- PBFAG must verify that `APP_STARTUP_REQUIREMENTS.md` (TR-064) has been created.
- PBFAG must confirm `.env.example` exists with all 8 required variables (§A8.4).

### A15.4 — Stage 8 (Implementation Plan) Scope Boundaries

- Implementation Plan must not introduce build waves that split integration contracts
  across waves without accounting for contract completeness at each wave boundary.
- AIMC, PIT, and KUC integrations should be waved in a sequence that allows
  integration testing at each boundary before dependent features are built.
- The commissioning state machine (TR-051) and health endpoint (TR-052) must be in
  the first build wave (they are prerequisites for all other build validation).

### A15.5 — Stage 9 (Builder Checklist) and Stage 10 (IAA Pre-Brief) Scope Boundaries

- Stage 9 (Builder Checklist) and Stage 10 (IAA Pre-Brief) are process-gate stages only.
- They do not modify architecture artifacts. Their scope is to confirm readiness to build.
- Stage 9 must verify this architecture is frozen and all §A15.1 decisions documented.
- Stage 10 IAA Pre-Brief must reference this architecture document as the frozen baseline.

### A15.6 — Stage 11 (Builder Appointment) Scope Boundaries

- Builders must not adopt any pattern, schema, or component from the legacy
  `capabilities/` sub-folders (ERM/WRAC artifacts). §A11 OQ-002 resolution is binding.
- Builders are bound by all constraints in §A15.1.
- Builders must confirm understanding of the `mmm_` namespace rule (TR-028) and
  API-mediated cross-module boundary before appointment.
- The zero-warning CI policy (TR-061) applies from the first commit.

### A15.7 — Stage 12 (Build Execution & Evidence) Scope Boundaries

- Builders must implement strictly from the FRS + TRS + this architecture. No gold-plating.
- No direct AI provider calls — all AI routing through AIMC (§A15.1 item 1).
- All database tables must use the `mmm_` prefix namespace (TR-028).
- The commissioning state machine (CHK-001 through CHK-005 from `APP_STARTUP_REQUIREMENTS.md`)
  must be implemented in the first build wave.
- Zero-warning policy (TR-061) is enforced: `tsc --strict`, ESLint `--max-warnings 0`
  from the first commit forward.
- Evidence artifacts (test results, coverage reports) must be produced per QA-to-Red
  suite at each wave boundary.

---

## Document Footer

**Module**: MMM — Maturity Model Management  
**Stage**: 5 — Architecture  
**Version**: 0.1.0  
**Date**: 2026-04-14  
**Status**: DRAFT — For CS2 review and approval  
**Produced By**: mat-specialist (POLC-Orchestration mode, delegated by foreman-v2-agent v6.2.0)  
**Issue**: maturion-isms#1378  
**Wave**: mmm-stage5-architecture-20260414  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Next Stage**: Stage 6 — QA-to-Red (derives test cases from this Architecture + FRS/TRS)
