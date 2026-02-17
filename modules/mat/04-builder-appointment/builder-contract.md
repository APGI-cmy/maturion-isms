# MAT — Builder Appointment & Contracts

**Module**: MAT (Manual Audit Tool)  
**Version**: v3.1.0  
**Status**: APPROVED  
**Owner**: Foreman (FM)  
**Created**: 2026-02-13  
**Last Updated**: 2026-02-16  
**Governance Alignment**: FM Contract v2.1.0, LIVING_AGENT_SYSTEM.md v6.2.0  
**Authority**: Derived from Implementation Plan (`modules/mat/03-implementation-plan/implementation-plan.md`), Architecture (`modules/mat/02-architecture/`), [BUILDER_CONTRACT_SCHEMA.md](https://github.com/APGI-cmy/maturion-foreman-office-app/blob/main/.github/agents/BUILDER_CONTRACT_SCHEMA.md)

**Change History**:
- v3.1.0 (2026-02-17) — Added "Component Implementation Requirements (EXPLICIT)" section to ui-builder scope with 12 mandatory sub-deliverables, physical verification checklist, and Deviation #11 learning integration. Updated acceptance criteria and forbidden actions to prevent placeholder components. Authority: GOVERNANCE_CHAIN_TRACEABILITY_ANALYSIS_20260217.md, FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §3.2. See Issue #303 (Wave 5.6 Recovery Plan).
- v3.0.0 (2026-02-16) — Added Wave 5.5 (Frontend Application Assembly) to ui-builder scope, added `apps/mat-frontend/**` to authorized paths, added FR-070/FR-071 acceptance criteria. See BUILD_PROGRESS_TRACKER.md Deviation #9.
- v2.0.0 (2026-02-16) — Aligned with FM v2.1.0 for gate compliance (Issue #196)
- v1.0.0 (2026-02-13) — Initial builder appointment and contracts

---

## 0. Purpose

This document defines builder assignments, responsibilities, constraints, and handover instructions for every builder agent category required to build the MAT module. Each builder section serves as the authoritative briefing artifact for that builder at handover time.

### Governance Binding

All builders comply with:
- BUILDER_CONTRACT_SCHEMA.md v2.0, BUILD_PHILOSOPHY.md, FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md
- LIVING_AGENT_SYSTEM.md v6.2.0, FM Contract v2.1.0
- MERGE_GATE_INTERFACE_STANDARD.md, EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md

### LAS v6.2.0 Compliance (All Builders)

All builders comply with LAS v6.2.0 categories (see `governance/canon/LIVING_AGENT_SYSTEM.md` for full specification):

| Category | Reference |
|----------|-----------|
| 0: Identity & Bindings | `AGENT_RECRUITMENT.md`, `CANON_INVENTORY.json` |
| 1: Authority & Boundaries | §1–§5 Builder-Only Constraint, §6 Doctrine |
| 2: Governance Loading | §6 Governance Loading, `BUILD_PHILOSOPHY.md` |
| 3: Memory & Evidence | §8 Session Memory Protocol |
| 4: Ripple & Gates | §6 Ripple Boundary, Merge Gate Awareness |
| 5: Escalation & Stop | §6 Escalation & Stop Conditions |
| 6: Deliverables & Outputs | §1–§5 Scope and acceptance criteria |
| 7: Prohibitions & Guardrails | §1–§5 Forbidden Actions + Builder-Only Constraint |

---

## 1. schema-builder

### Assignment

| Field | Value |
|-------|-------|
| **Builder ID** | schema-builder |
| **Builder Type** | specialized |
| **Assigned Waves** | Wave 0 (Task 0.1) |
| **Recruited By** | Foreman (FM) |
| **Handover Protocol** | gate-first-deterministic |
| **Contract Version** | 2.0.0 |
| **LAS Version** | 6.2.0 |

### Builder-Only Constraint (Mirrors FM §1.2)

**Authorized File Paths**:
- ✅ `modules/mat/src/schema/**`, `modules/mat/src/migrations/**`, `modules/mat/src/seeds/**`
- ✅ `modules/mat/tests/schema/**`, `modules/mat/tests/wiring/**`
- ✅ `.agent-workspace/schema-builder/**`

**Prohibited File Paths**:
- ❌ API/Edge Functions, UI components, AI services, integrations (other builder scopes)
- ❌ `governance/**`, `modules/mat/02-architecture/**` (read-only)

**Violation Response**: POLC boundary gate Check 2 failure.

### Scope

The schema-builder is responsible for all database schema work: table creation, RLS policies, indexes, migrations, and seed data.

### Detailed Instructions

To complete this build you must do:

1. **Read and internalize these architecture documents**:
   - `modules/mat/02-architecture/data-architecture.md` — All table definitions, entity relationships, constraints
   - `modules/mat/02-architecture/security-architecture.md` — RLS policies, encryption requirements
   - `modules/mat/02-architecture/system-architecture.md` §3.2 — Supabase backend component specification
   - `modules/mat/02-architecture/trs-to-architecture-traceability.md` — Requirement-to-architecture mapping

2. **Create all PostgreSQL tables** exactly matching `data-architecture.md`:
   - All entity tables with correct column types, constraints, and defaults
   - All junction/relationship tables
   - All audit trail tables (append-only)
   - Timestamp columns (`created_at`, `updated_at`) on all mutable tables

3. **Create RLS policies** per `security-architecture.md`:
   - Organisation isolation (user can only see own org data)
   - Role-based write restrictions (Lead Auditor vs. Domain Auditor vs. Contributor)
   - Audit trail append-only enforcement (no UPDATE or DELETE on audit log)

4. **Create indexes** per performance targets in `performance-architecture.md`:
   - Primary key indexes (automatic)
   - Foreign key indexes
   - Composite indexes for common query patterns
   - Partial indexes for status-filtered queries

5. **Create migration scripts**:
   - Up migration: creates all tables, indexes, RLS policies
   - Down migration: reverts all changes cleanly
   - Scripts must be idempotent (safe to re-run)

6. **Create seed data** per `test-strategy.md` §12:
   - Realistic sample organisation with known test data
   - At least 2 organisations for cross-org isolation testing
   - Test fixtures for all entity types

### Test Coverage

| Test Registry IDs | Category | Count |
|-------------------|----------|-------|
| MAT-T-0083–MAT-T-0098 | CAT-11: Wiring Invariants | 16 |
| MAT-T-0042–MAT-T-0050 | CAT-05: Security and RLS | 9 |

All 25 tests must be GREEN before handover.

### Acceptance Criteria

1. All tables match `data-architecture.md` entity definitions exactly — no missing columns, no extra columns
2. All RLS policies enforce organisation isolation — automated test proves user A cannot see org B data
3. All wiring invariants pass (MAT-T-0083–0098)
4. Migration scripts are idempotent — running up→down→up produces identical schema
5. Seed data creates valid, queryable test fixtures
6. Zero warnings from `sqlfluff` linting

### Forbidden Actions

- ❌ Modifying application code (Edge Functions, frontend, AI services)
- ❌ Changing architecture documents
- ❌ Adding tables or columns not specified in `data-architecture.md`
- ❌ Weakening RLS policies
- ❌ Using non-PostgreSQL data stores

### Handover Artifacts (to api-builder)

Upon completion, schema-builder must provide:
- Schema DDL (complete SQL)
- RLS policy definitions (complete SQL)
- Seed data script
- Migration scripts (up + down)
- Test evidence (all 25 tests GREEN)

---

## 2. api-builder

### Assignment

| Field | Value |
|-------|-------|
| **Builder ID** | api-builder |
| **Builder Type** | specialized |
| **Assigned Waves** | Wave 0 (Tasks 0.2, 0.3), Wave 1 (Tasks 1.1, 1.2), Wave 2 (Tasks 2.1, 2.2), Wave 3 (Task 3.1), Wave 4 (Task 4.2), Wave 5 (Task 5.1) |
| **Recruited By** | Foreman (FM) |
| **Handover Protocol** | gate-first-deterministic |
| **Contract Version** | 2.0.0 |
| **LAS Version** | 6.2.0 |

### Builder-Only Constraint (Mirrors FM §1.2)

**Authorized File Paths**:
- ✅ `modules/mat/src/api/**`, `modules/mat/src/edge-functions/**`, `modules/mat/src/ai-gateway/**`
- ✅ `modules/mat/src/offline-sync/**`, `modules/mat/src/reports/**`, `modules/mat/src/watchdog/**`
- ✅ `modules/mat/tests/api/**`, `modules/mat/tests/edge-functions/**`, `modules/mat/tests/ai-gateway/**`
- ✅ `.agent-workspace/api-builder/**`

**Prohibited File Paths**:
- ❌ Database schema/migrations (schema-builder scope), UI components (ui-builder scope), integrations (integration-builder scope)
- ❌ `governance/**`, `modules/mat/02-architecture/**` (read-only)

**Violation Response**: POLC boundary gate Check 2 failure.

### Scope

The api-builder is responsible for all server-side logic: Supabase Edge Functions, AI Gateway (FastAPI), authentication flows, offline sync engine, report generation, and watchdog monitoring.

### Detailed Instructions

To complete this build you must do:

**Wave 0 — Authentication & Core API (Tasks 0.2, 0.3)**:

1. **Configure Supabase Auth** per `security-architecture.md`:
   - JWT issuance with role and organisation_id claims
   - MFA enforcement for Lead Auditor role (TOTP)
   - Session management with configurable expiry
   - Token refresh mechanism

2. **Implement Audit Lifecycle Edge Functions** per `system-architecture.md` §3.2:
   - `POST /audits` — Create audit with mandatory fields (FR-001)
   - `PATCH /audits/:id/status` — Status transitions following defined order (FR-002)
   - `DELETE /audits/:id` — Soft delete only, no physical deletion (FR-003)
   - Error handling middleware (structured JSON errors)
   - Health check: `GET /health`

**Wave 1 — Criteria Upload & AI Parsing (Tasks 1.1, 1.2)**:

3. **Implement criteria upload** per `system-architecture.md` §3.2:
   - `POST /criteria/upload` — Accept PDF/DOCX within size limits
   - Store in Supabase Storage with signed URLs
   - Compute SHA-256 hash at upload time
   - Create metadata records

4. **Implement AI Gateway** per `ai-architecture.md`:
   - FastAPI service with document parsing endpoint
   - GPT-4 Turbo integration for criteria extraction
   - Pydantic v2 schemas for request/response validation
   - Circuit breaker (3 failures → open → half-open after 30s)
   - Rate limiter (per-tenant, per-model)
   - Fallback to GPT-4o Mini on primary failure

**Wave 2 — Evidence API & Offline Sync (Tasks 2.1, 2.2)**:

5. **Implement evidence upload** per `system-architecture.md` §3.2:
   - `POST /evidence` — Accept photo, audio, file with metadata
   - SHA-256 hash at upload time for immutability
   - Audio transcription via Whisper API
   - Append-only storage (reject update/delete on committed evidence)

6. **Implement offline sync engine** per `offline-sync-architecture.md`:
   - Service Worker registration and lifecycle
   - IndexedDB schema for offline data
   - Sync queue with ordered replay
   - Conflict resolution (server-wins with field-level merge)

**Wave 3 — AI Scoring (Task 3.1)**:

7. **Implement scoring service** per `ai-architecture.md`:
   - Maturity level prediction (GPT-4 Turbo)
   - Confidence scoring with evidence citations
   - Gap analysis (immediate, medium, long-term)
   - Refuse-to-score below evidence threshold
   - Fallback scoring (GPT-4o Mini)

**Wave 4 — Report Generation (Task 4.2)**:

8. **Implement report generation** per `reporting-architecture.md`:
   - DOCX export with template
   - PDF export with styling
   - JSON export matching API schema
   - Excel review table export
   - AI-assisted executive summary

**Wave 5 — Watchdog (Task 5.1)**:

9. **Implement watchdog** per `observability-architecture.md`:
   - Metrics collection for all services
   - Alert definitions and thresholds
   - Health check endpoints
   - Error reporting integration (Sentry)

### Test Coverage

| Test Registry IDs | Category | Count |
|-------------------|----------|-------|
| MAT-T-0001–MAT-T-0003 | CAT-01: Audit Lifecycle | 3 |
| MAT-T-0004–MAT-T-0006 | CAT-02: Criteria (upload) | 3 |
| MAT-T-0007–MAT-T-0014 | CAT-02: Criteria (AI parsing) | 8 |
| MAT-T-0015–MAT-T-0025 | CAT-03: Evidence Collection | 11 |
| MAT-T-0026–MAT-T-0033 | CAT-04: AI Services (scoring) | 8 |
| MAT-T-0042–MAT-T-0050 | CAT-05: Security and RLS | 9 |
| MAT-T-0056–MAT-T-0058 | CAT-06: Offline and Sync | 3 |
| MAT-T-0059–MAT-T-0062 | CAT-07: Watchdog | 4 |

All tests in each wave must be GREEN before wave gate.

### Acceptance Criteria

Per-wave acceptance criteria are defined in `modules/mat/03-implementation-plan/implementation-plan.md` Sections 2.1–2.6.

**Global Acceptance**:
1. All Edge Functions have structured error handling
2. All API endpoints are protected by RLS and JWT validation
3. All AI integrations have circuit breaker and fallback
4. All external API calls are mocked in tests
5. Zero lint warnings (`eslint` for TypeScript, `ruff` for Python)
6. Coverage ≥ 80% line, ≥ 70% branch (≥ 90% for auth/security/AI paths)

### Forbidden Actions

- ❌ Modifying database schema (schema-builder responsibility)
- ❌ Modifying UI components (ui-builder responsibility)
- ❌ Modifying governance artifacts
- ❌ Changing architecture specifications
- ❌ Skipping circuit breaker or fallback implementations
- ❌ Storing unencrypted sensitive data

### Key References

- `modules/mat/02-architecture/system-architecture.md` — Component architecture
- `modules/mat/02-architecture/ai-architecture.md` — AI service specifications
- `modules/mat/02-architecture/security-architecture.md` — Auth, RLS, encryption
- `modules/mat/02-architecture/offline-sync-architecture.md` — Offline engine
- `modules/mat/02-architecture/reporting-architecture.md` — Report generation
- `modules/mat/02-architecture/observability-architecture.md` — Watchdog
- `governance/TEST_REGISTRY.json` — Test definitions

---

## 3. ui-builder

### Assignment

| Field | Value |
|-------|-------|
| **Builder ID** | ui-builder |
| **Builder Type** | specialized |
| **Assigned Waves** | Wave 1 (Task 1.3), Wave 2 (Task 2.3), Wave 3 (Task 3.2), Wave 4 (Task 4.1), Wave 5.5 (Tasks 5.5.1–5.5.3) |
| **Recruited By** | Foreman (FM) |
| **Handover Protocol** | gate-first-deterministic |
| **Contract Version** | 3.1.0 |
| **LAS Version** | 6.2.0 |

### Builder-Only Constraint (Mirrors FM §1.2)

**Authorized File Paths**:
- ✅ `modules/mat/src/ui/**`, `modules/mat/src/components/**`, `modules/mat/src/hooks/**`
- ✅ `modules/mat/src/stores/**`, `modules/mat/src/styles/**`
- ✅ `modules/mat/tests/ui/**`, `modules/mat/tests/components/**`
- ✅ `apps/mat-frontend/**` (NEW — frontend application package)
- ✅ `.agent-workspace/ui-builder/**`

**Prohibited File Paths**:
- ❌ API/Edge Functions, database schema, AI services, integrations (other builder scopes)
- ❌ `governance/**`, `modules/mat/02-architecture/**` (read-only)

**Violation Response**: POLC boundary gate Check 2 failure.

### Scope

The ui-builder is responsible for all frontend React components, layouts, responsive design, accessibility, PWA shell, **and the scaffolding and assembly of the `apps/mat-frontend/` React application**.

---

### Component Implementation Requirements (EXPLICIT)

**Authority**: FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §3.2, GOVERNANCE_CHAIN_TRACEABILITY_ANALYSIS_20260217.md (Deviation #11 Root Cause)

**Constitutional Principle**: "Component Exists ≠ Component Works" — Delivering component STRUCTURE without component BEHAVIOR violates the Fully Functional Delivery Standard.

#### What "Implement Component" ALWAYS Means

When assigned to "implement" or "build" a component, you MUST deliver ALL of the following (not just JSX structure):

1. **Component Structure** (JSX/TSX file):
   - Component file at correct path per architecture
   - Props interface with TypeScript strict typing
   - Proper component hierarchy and composition

2. **Data Fetching** (if component displays data):
   - ✅ **TanStack Query `useQuery` hook** fetching from correct Supabase table
   - ✅ Query key following project conventions (e.g., `['audits', orgId]`)
   - ✅ Supabase client integration via `src/lib/supabase.ts`
   - ❌ NO hardcoded placeholder data
   - ❌ NO "TODO: fetch data" comments

3. **State Management** (if component has interactive state):
   - ✅ **TanStack Query mutations** for all CRUD operations
   - ✅ **Zustand stores** for client-side state (if required per architecture)
   - ✅ Optimistic updates where specified
   - ✅ Cache invalidation after mutations

4. **Loading States**:
   - ✅ Loading skeleton or spinner during data fetch (`isLoading` state)
   - ✅ Accessibility: `aria-busy="true"` during loading
   - ❌ NO blank screens while loading

5. **Error States**:
   - ✅ Error boundary or error UI for query failures (`isError` state)
   - ✅ User-friendly error messages (not raw error objects)
   - ✅ Retry mechanism where appropriate
   - ❌ NO silent failures or console-only errors

6. **Empty States**:
   - ✅ Friendly empty state UI when no data exists (`data.length === 0`)
   - ✅ Call-to-action (e.g., "Create your first audit")
   - ❌ NO "undefined" or blank screens for empty data

7. **CRUD Handlers** (if component performs actions):
   - ✅ **TanStack Query `useMutation` hooks** for create/update/delete
   - ✅ Form submit handlers wired to mutations
   - ✅ Success/error toast notifications
   - ✅ Navigation after successful mutations (if required)
   - ❌ NO placeholder button handlers with `console.log` only

8. **Form Validation** (if component has forms):
   - ✅ **Zod schema** matching backend validation rules
   - ✅ React Hook Form integration with Zod resolver
   - ✅ Field-level error display
   - ✅ Disabled submit button during validation or submission
   - ❌ NO unvalidated form submissions

9. **Component-to-Page Wiring**:
   - ✅ Component imported and rendered in correct page file (`apps/mat-frontend/src/pages/`)
   - ✅ Routing configured (if new page)
   - ✅ Navigation links updated (if new route)
   - ❌ NO orphaned components that exist but are never rendered

10. **Responsive Design**:
    - ✅ Mobile (375px), tablet (768px), desktop (1024px) layouts
    - ✅ Touch-optimized interactions for mobile
    - ✅ Tailwind CSS responsive utilities

11. **Accessibility**:
    - ✅ Semantic HTML elements (`<button>`, `<nav>`, etc.)
    - ✅ ARIA labels where needed
    - ✅ Keyboard navigation support
    - ✅ Focus management (modals, dialogs)

12. **Unit Tests**:
    - ✅ Vitest + React Testing Library tests
    - ✅ Test rendering, user interactions, loading/error/empty states
    - ✅ 100% GREEN before gate submission

---

#### Examples: Good vs. Vague Instructions

| ❌ VAGUE (Causes Deviation #11) | ✅ EXPLICIT (Prevents Deviation #11) |
|----------------------------------|---------------------------------------|
| "Implement dashboard component" | "Implement `<GlobalDashboard>` component with: (1) TanStack Query `useQuery` hook fetching aggregated metrics from `audits`, `criteria`, and `audits_criteria` tables using `countAudits()`, `countCriteria()` SQL functions; (2) Loading skeleton during fetch; (3) Error toast on failure; (4) Real-time updates via Supabase Realtime channel subscription; (5) Responsive grid layout (1 column mobile, 2 columns tablet, 4 columns desktop); (6) Unit test validating data fetch and display" |
| "Build audit creation form" | "Implement `<AuditCreationForm>` with: (1) Zod schema matching `audits` table constraints (`name` required, `organisation_id` FK, `status` enum); (2) React Hook Form with Zod resolver; (3) TanStack Query `useMutation` calling `POST /rest/v1/audits` via Supabase client; (4) Success toast + navigation to `/audits/{id}` on creation; (5) Field-level error display; (6) Disabled submit during submission; (7) Form wired into `<CreateAuditButton>` modal in `DashboardPage`" |
| "Create criteria tree component" | "Implement `<CriteriaTree>` with: (1) TanStack Query `useQuery` fetching hierarchical criteria from `criteria` table with `domain_id`, `mps_id`, `parent_id` joins; (2) Recursive tree rendering with expand/collapse state (Zustand store for open nodes); (3) Status badge per criterion (color-coded); (4) Keyboard navigation (arrow keys, Enter to expand); (5) Search filter input (debounced, filters tree client-side); (6) Loading skeleton; (7) Empty state 'No criteria uploaded yet'; (8) Rendered in `CriteriaPage`" |
| "Implement evidence gallery" | "Implement `<EvidenceGallery>` with: (1) TanStack Query `useQuery` fetching from `evidence` table filtered by `criterion_id`; (2) Grid layout (1 col mobile, 2 col tablet, 3 col desktop); (3) Thumbnail component per evidence type (photo preview, audio player, PDF icon); (4) Click opens `<EvidenceModal>` with full view; (5) Delete button per item (TanStack Query `useMutation` calling `DELETE /rest/v1/evidence/{id}`, optimistic update removes from grid); (6) Loading spinner; (7) Empty state 'No evidence collected'; (8) Rendered in `CriterionDetailPage`" |

---

#### Acceptance Criteria (EXPLICIT)

**BLOCKING criteria — ALL must be met before gate submission:**

1. ✅ **All components fetch/mutate data using TanStack Query**:
   - Zero hardcoded placeholder data in production code
   - All data-fetching components use `useQuery` with correct Supabase table/query
   - All CRUD components use `useMutation` with correct Supabase endpoint

2. ✅ **All forms have Zod validation wired**:
   - Zod schema exists matching backend validation rules
   - React Hook Form integrated with `zodResolver`
   - Field-level errors display to user
   - Submit button disabled during validation/submission

3. ✅ **All data-fetching components render loading/error/empty states**:
   - Loading skeleton or spinner visible during fetch
   - Error boundary or error UI catches and displays failures
   - Empty state UI with call-to-action when `data.length === 0`

4. ✅ **All components imported and rendered in page files**:
   - Zero orphaned components (components that exist but are never imported)
   - All pages render components per architecture specification
   - Navigation/routing configured for all user-facing pages

5. ✅ **All TanStack Query mutations invalidate caches**:
   - After create/update/delete mutation succeeds, query cache invalidated
   - UI automatically refetches and updates (no manual page refresh required)

6. ✅ **All interactive components have success/error feedback**:
   - Toast notifications for mutation success/failure
   - Loading indicators during async operations
   - Optimistic updates where specified in architecture

7. ✅ **All tests validate BEHAVIOR, not just structure**:
   - Unit tests verify data fetching (mock Supabase responses)
   - Unit tests verify mutation handling (mock mutation success/failure)
   - Unit tests verify loading/error/empty state rendering
   - ❌ NO tests that only check "component renders without crashing"

8. ✅ **All components meet WCAG 2.1 AA accessibility**:
   - Semantic HTML, ARIA labels, keyboard navigation
   - Color contrast ratios meet standards
   - Focus management for modals/dialogs

9. ✅ **All components responsive at 375px/768px/1024px**:
   - Mobile-first design with touch-optimized interactions
   - Tailwind responsive utilities (`sm:`, `md:`, `lg:`)
   - No horizontal scroll or layout breaks at any breakpoint

10. ✅ **Zero console warnings or errors in development mode**:
    - No React key warnings
    - No unused variables/imports
    - No ESLint errors

---

#### Physical Verification Checklist (Before Gate Submission)

**Authority**: FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §3.2 "Physical Existence" and "Functional Completeness"

Before submitting to gate, verify EACH component meets ALL criteria:

**For data-display components** (dashboard, list, gallery):
- [ ] Component file exists at correct path
- [ ] TanStack Query `useQuery` hook present
- [ ] Query fetches from correct Supabase table
- [ ] Loading skeleton renders during fetch (`isLoading === true`)
- [ ] Error UI renders on failure (`isError === true`)
- [ ] Empty state UI renders when `data.length === 0`
- [ ] Component imported and rendered in page file
- [ ] Unit test validates data fetch behavior

**For form components** (create, edit):
- [ ] Component file exists at correct path
- [ ] Zod schema defined matching backend constraints
- [ ] React Hook Form integrated with `zodResolver`
- [ ] TanStack Query `useMutation` hook present
- [ ] Mutation calls correct Supabase endpoint
- [ ] Field-level errors display to user
- [ ] Submit button disabled during submission
- [ ] Success toast + navigation on success
- [ ] Error toast on failure
- [ ] Component imported and rendered in page file (modal or route)
- [ ] Unit test validates form submission behavior

**For interactive components** (buttons, modals, dialogs):
- [ ] Component file exists at correct path
- [ ] Event handlers wired to TanStack Query mutations (if CRUD)
- [ ] Loading state during async operations
- [ ] Success/error feedback to user
- [ ] Keyboard navigation support
- [ ] ARIA labels and roles
- [ ] Component imported and rendered in page file
- [ ] Unit test validates interaction behavior

---

#### Deviation #11 Learning Integration

**Historical Context**: In Wave 5, ui-builder was assigned to "implement dashboard component" with vague acceptance criteria. Builder delivered component STRUCTURE (JSX files, component hierarchy) but NOT component BEHAVIOR (TanStack Query data fetching, loading/error/empty states, CRUD handlers). Result: Frontend appeared complete but was entirely non-functional with hardcoded placeholder data.

**Root Cause**: Implementation plan acceptance criteria was vague: "Dashboard components render with data visualizations" did not explicitly require "Fetch data from Supabase using TanStack Query hooks."

**Prevention Mechanism**: This "Component Implementation Requirements" section makes EXPLICIT what "implement component" means, with 12 mandatory sub-deliverables and physical verification checklist. No ambiguity remains.

**Testing Strategy**: 29 new QA-to-Red tests (MAT-T-0099 to MAT-T-0127) now validate UI BEHAVIOR (data fetching, CRUD operations, state management), not just structure.

**Authority**: 
- GOVERNANCE_CHAIN_TRACEABILITY_ANALYSIS_20260217.md (Root Cause Analysis)
- FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §3.2 (Physical Verification)
- BUILD_PROGRESS_TRACKER.md Deviation #11 (Historical Learning)

---

### Detailed Instructions

To complete this build you must do:

**Wave 1 — Criteria Management UI (Task 1.3)**:

1. **Build criteria tree view** per `ui-component-architecture.md`:
   - Domain → MPS → Criteria hierarchy component
   - Collapsible/expandable tree nodes
   - Status indicators per criteria (parsed, approved, rejected)
   - Search and filter capability

2. **Build criteria upload form**:
   - Drag-and-drop file upload (PDF/DOCX)
   - Upload progress indicator
   - File type validation (client-side)

3. **Build human approval workflow UI**:
   - AI-parsed criteria display with accept/reject actions
   - Batch approval capability
   - Justification input for rejections

**Wave 2 — Evidence Management UI (Task 2.3)**:

4. **Build evidence gallery** per `ui-component-architecture.md`:
   - Grid/list view per criterion
   - Photo thumbnail preview
   - Audio player component
   - Document preview (PDF viewer)
   - Evidence metadata display

5. **Build mobile capture interface**:
   - Camera capture with metadata overlay
   - Voice recorder with waveform display
   - Offline indicator and sync status badge

**Wave 3 — Human Confirmation UI (Task 3.2)**:

6. **Build AI score review interface**:
   - Score display with confidence indicator
   - Rationale text with evidence citations
   - Gap analysis categorized view
   - Confirm/override action buttons

7. **Build override workflow**:
   - Override justification form (mandatory text)
   - AI vs. human score comparison view
   - Score history timeline

**Wave 4 — Dashboards (Task 4.1)**:

8. **Build dashboards** per `ui-component-architecture.md`:
   - Global audit dashboard (aggregate metrics, charts)
   - Domain dashboard (drill-down from global)
   - MPS dashboard (criterion-level detail)
   - Real-time update indicators
   - Responsive charts (Recharts or similar)

**Wave 5.5 — Frontend Application Assembly (Tasks 5.5.1–5.5.3)**:

> **Governance Note**: This wave was added per governance remediation (BUILD_PROGRESS_TRACKER.md Deviation #9). All component logic built in Waves 1–4 must be assembled into a deployable React application.

9. **Scaffold React application** (Task 5.5.1, FR-070, TR-071):
   - Create `apps/mat-frontend/` with React 18+ and Vite 5+ (per TRS TR-001 — NOT Next.js from App Description §16.3)
   - Configure `package.json`, TypeScript strict mode, Tailwind CSS, Shadcn/UI
   - Configure Zustand + TanStack Query + Supabase client
   - Create `src/main.tsx` entry point with providers
   - Register in `pnpm-workspace.yaml`
   - Verify `pnpm build` and `pnpm dev` work

10. **Wire pages, routing, and components** (Task 5.5.2, FR-071):
    - Create page layouts for all sections (Audits, Criteria, Evidence, Scoring, Dashboards, Reports)
    - Configure client-side routing
    - Import and render all components from `modules/mat/src/components/`
    - Implement responsive navigation per FR-062
    - Register PWA manifest and service worker per FR-063

11. **Verify integration and build** (Task 5.5.3):
    - Verify all 98 existing tests remain GREEN
    - Verify frontend builds without errors
    - Smoke test critical user flows in browser
    - Document application structure

### Test Coverage

| Test Registry IDs | Category | Count |
|-------------------|----------|-------|
| MAT-T-0069–MAT-T-0081 | CAT-10: UI and Accessibility | 13 |

All 13 tests must be GREEN before each wave gate.

**Wave 5.5 Acceptance**: FR-070 and FR-071 acceptance criteria met (see Implementation Plan §2.6.5).

### Acceptance Criteria

**See "Component Implementation Requirements (EXPLICIT)" section above for complete blocking criteria.**

**Summary** (all must be met):

1. All components fetch/mutate data using TanStack Query (no hardcoded data)
2. All forms have Zod validation wired with field-level errors
3. All data-fetching components render loading/error/empty states
4. All components imported and rendered in page files (no orphaned components)
5. All TanStack Query mutations invalidate caches (UI auto-updates)
6. All interactive components have success/error feedback (toasts, loading indicators)
7. All tests validate BEHAVIOR, not just structure
8. All components meet WCAG 2.1 AA accessibility
9. All components responsive at 375px/768px/1024px
10. Zero console warnings or errors in development mode
11. All components render correctly at desktop (1024px), tablet (768px), mobile (375px)
12. All state management via Zustand (client) and TanStack Query (server)
13. All components use Shadcn/UI + Tailwind CSS (no external UI libraries)
14. No class components — functional components only
15. `apps/mat-frontend/` exists as a buildable, deployable workspace package (FR-070)
16. All components wired into the frontend application with routing (FR-071)
17. Zero lint warnings (`eslint` with React/hooks plugins)

### Forbidden Actions

- ❌ Delivering placeholder components without data fetching logic
- ❌ Delivering components without TanStack Query hooks when data is required
- ❌ Hardcoding data instead of fetching from Supabase
- ❌ Implementing forms without Zod validation
- ❌ Implementing CRUD actions without TanStack Query mutations
- ❌ Creating components that are never imported/rendered in pages
- ❌ Submitting components without loading/error/empty states
- ❌ Writing tests that only validate "component renders" without testing behavior
- ❌ Using `console.log` as placeholder for actual event handlers
- ❌ Leaving "TODO: implement data fetching" comments in production code
- ❌ Implementing backend logic or Edge Functions
- ❌ Modifying database schema or migrations
- ❌ Direct API calls bypassing TanStack Query
- ❌ Using class components
- ❌ Adding UI libraries not specified in architecture (Material UI, Ant Design, etc.)
- ❌ Modifying governance artifacts

### Key References

- `modules/mat/02-architecture/ui-component-architecture.md` — Component specifications
- `modules/mat/02-architecture/system-architecture.md` §3.1 — Frontend architecture
- `modules/mat/02-architecture/test-strategy.md` §2 — Unit testing requirements
- `modules/mat/01-frs/functional-requirements.md` — Functional requirements
- `governance/TEST_REGISTRY.json` — Test definitions (CAT-10)

---

## 4. integration-builder

### Assignment

| Field | Value |
|-------|-------|
| **Builder ID** | integration-builder |
| **Builder Type** | specialized |
| **Assigned Waves** | Wave 5 (Task 5.2) |
| **Recruited By** | Foreman (FM) |
| **Handover Protocol** | gate-first-deterministic |
| **Contract Version** | 2.0.0 |
| **LAS Version** | 6.2.0 |

### Builder-Only Constraint (Mirrors FM §1.2)

**Authorized File Paths**:
- ✅ `modules/mat/src/integrations/**`, `modules/mat/tests/integrations/**`
- ✅ `.agent-workspace/integration-builder/**`

**Prohibited File Paths**:
- ❌ Core API, UI, database schema (other builder scopes)
- ❌ `governance/**`, `modules/mat/02-architecture/**` (read-only)

**Violation Response**: POLC boundary gate Check 2 failure.

### Scope

The integration-builder is responsible for inter-module integration endpoints (PIT, Maturity Roadmap) and API contract validation.

### Detailed Instructions

To complete this build you must do:

1. **Implement PIT export endpoint** per `integration-architecture.md`:
   - Edge Function endpoint: `POST /integrations/pit/export`
   - Export audit findings in PIT-compatible format
   - OpenAPI contract validation against PIT specification
   - Error handling for PIT service unavailability

2. **Implement Maturity Roadmap export endpoint** per `integration-architecture.md`:
   - Edge Function endpoint: `POST /integrations/roadmap/export`
   - Export maturity scores and gap analysis
   - OpenAPI contract validation against Maturity Roadmap specification
   - Error handling for Roadmap service unavailability

3. **Implement override analysis pipeline**:
   - Capture human override patterns (which AI scores are consistently overridden)
   - Aggregate override data for learning memory integration
   - Generate override analysis reports

4. **Validate API contracts**:
   - Run contract tests against PIT and Maturity Roadmap OpenAPI specs
   - VCR pattern for recording/replaying integration responses
   - Verify bi-directional data consistency

### Test Coverage

| Test Registry IDs | Category | Count |
|-------------------|----------|-------|
| MAT-T-0063–MAT-T-0066 | CAT-09: Integration | 4 |

All 4 tests must be GREEN before wave gate.

### Acceptance Criteria

1. PIT export returns data matching PIT API contract
2. Maturity Roadmap export returns data matching Roadmap API contract
3. Override analysis captures patterns correctly
4. All integration endpoints have error handling for downstream service failures
5. VCR-recorded tests pass consistently
6. Zero lint warnings

### Forbidden Actions

- ❌ Modifying core MAT business logic (api-builder responsibility)
- ❌ Modifying UI components (ui-builder responsibility)
- ❌ Modifying database schema (schema-builder responsibility)
- ❌ Changing architecture specifications
- ❌ Modifying governance artifacts

### Key References

- `modules/mat/02-architecture/integration-architecture.md` — Integration specifications
- `modules/mat/02-architecture/system-architecture.md` §3.6 — External integrations
- `modules/mat/02-architecture/test-strategy.md` §3 — Integration testing
- `governance/TEST_REGISTRY.json` — Test definitions (CAT-09)

---

## 5. qa-builder

### Assignment

| Field | Value |
|-------|-------|
| **Builder ID** | qa-builder |
| **Builder Type** | specialized |
| **Assigned Waves** | All waves (continuous) |
| **Recruited By** | Foreman (FM) |
| **Handover Protocol** | gate-first-deterministic |
| **Contract Version** | 2.0.0 |
| **LAS Version** | 6.2.0 |

### Builder-Only Constraint (Mirrors FM §1.2)

**Authorized File Paths**:
- ✅ `modules/mat/tests/**` (all test categories), `modules/mat/src/test-fixtures/**`, `modules/mat/src/test-utils/**`
- ✅ `.agent-workspace/qa-builder/**`

**Prohibited File Paths**:
- ❌ Production feature code (all builder scopes), `governance/**`, `modules/mat/02-architecture/**` (read-only)

**Violation Response**: POLC boundary gate Check 2 failure.

### Scope

The qa-builder is responsible for performance testing, security scanning, accessibility auditing, compliance validation, and regression management across all waves.

### Detailed Instructions

To complete this build you must do:

1. **Performance testing** per `performance-architecture.md` and `test-strategy.md` §5:
   - Set up k6 or Artillery test framework
   - Create load scenarios: normal (50 VU), peak (100 VU), stress (200 VU), spike (0→100)
   - Test critical data scenarios (2,000 criteria, 10,000 evidence items, 100 concurrent viewers)
   - Run EXPLAIN ANALYZE on critical queries
   - Enforce performance budgets in CI (bundle size, LCP, API response times)

2. **Security scanning** per `test-strategy.md` §7:
   - Configure CodeQL or Semgrep for SAST
   - Configure Dependabot or Snyk for dependency scanning
   - Configure Trivy for Docker image scanning
   - Verify RLS policies with dedicated security test fixtures
   - Run OWASP Top 10 coverage checks

3. **Accessibility auditing** per `test-strategy.md` §1:
   - WCAG 2.1 AA compliance testing on all pages
   - Keyboard navigation testing
   - Screen reader testing
   - Color contrast validation
   - Focus management verification

4. **Data privacy compliance** per `security-architecture.md`:
   - GDPR compliance validation (right to erasure, data portability)
   - POPIA compliance validation
   - Data retention policy enforcement testing
   - Consent management flow testing

5. **Regression management**:
   - Maintain regression test suite across all waves
   - Ensure regression suite completes in under 12 minutes
   - Add all passing tests to CI/CD pipeline
   - Monitor coverage trends (no regression below thresholds)

6. **Wave gate validation** (at each wave completion):
   - Run full test suite for wave scope
   - Verify 100% GREEN (zero failures, zero skipped)
   - Verify coverage meets targets (80%+ line, 70%+ branch, 90%+ for critical paths)
   - Verify zero lint warnings
   - Compile evidence for PREHANDOVER proof

### Test Coverage

| Test Registry IDs | Category | Count |
|-------------------|----------|-------|
| MAT-T-0067–MAT-T-0068 | CAT-08: Performance | 2 |
| MAT-T-0082–MAT-T-0086 | CAT-12: Data Privacy and Compliance | 5 |

Plus regression responsibility for all 98 tests.

### Acceptance Criteria

1. Performance test suite covers all scenarios defined in `test-strategy.md` §5
2. Security scans produce zero high/critical findings
3. Accessibility audit achieves WCAG 2.1 AA compliance
4. Compliance tests validate GDPR and POPIA requirements
5. Regression suite executes in under 12 minutes
6. Coverage reports show trend data across waves

### Forbidden Actions

- ❌ Implementing feature code (builders' responsibility)
- ❌ Modifying architecture specifications
- ❌ Skipping performance or security tests
- ❌ Weakening test assertions to achieve GREEN
- ❌ Modifying governance artifacts
- ❌ Accepting partial passes (99% = FAILURE)

### Key References

- `modules/mat/02-architecture/test-strategy.md` — Complete QA strategy
- `modules/mat/02-architecture/performance-architecture.md` — Performance targets
- `modules/mat/02-architecture/security-architecture.md` — Security requirements
- `governance/TEST_REGISTRY.json` — Full test registry (MAT-T-0001–MAT-T-0098)
- `governance/policy/QA_POLICY_MASTER.md` — QA governance policy

---

## 6. Maturion Doctrine Compliance (All Builders)

All builders appointed under this contract must comply with:

### One-Time Build Correctness

- Architecture is frozen — no deviations permitted
- QA-to-Red tests exist before build begins (governance/TEST_REGISTRY.json)
- Build-to-Green: implement until all RED tests become GREEN
- No trial-and-error; understand architecture fully before implementing

### Zero Test Debt

- No `.skip()`, `.todo()`, or commented-out tests
- 100% pass rate required (99% = FAILURE)
- Test debt discovered → STOP, ESCALATE, WAIT

### Gate-First Handover

- Work is complete only when all tests GREEN, zero warnings, PREHANDOVER proof compiled
- No "close enough" passes
- FM validates each wave gate before next wave begins

### Enhancement Capture

At completion of each wave, every builder must evaluate:
> "Are there any potential enhancements, improvements, or future optimizations revealed by this work?"

Submit enhancement proposal or explicit "No enhancements identified" statement.

### Ripple Boundary

- Builders receive ripple context from FM but do not initiate or propagate ripple signals
- Cross-module or cross-repo concerns → escalate to FM

### Governance Loading (LAS Category 2)

Before build: Load BUILD_PHILOSOPHY.md, architecture docs (verify frozen), TEST_REGISTRY.json, EXECUTION_BOOTSTRAP_PROTOCOL.md. Stop if architecture ambiguous.

### Escalation & Stop (LAS Category 5)

**Stop & Escalate**: Test debt, architecture ambiguity, missing prerequisites, warnings, cross-builder conflicts.

**Hard Stops**: Architecture not frozen, QA-to-Red missing, governance ambiguity.

**Path**: Builder → FM → CS2

### Merge Gate Awareness (LAS Category 4)

Builder evidence for gate checks:

| Check | Evidence |
|-------|----------|
| merge-gate/verdict | PREHANDOVER proof, 100% GREEN, zero warnings |
| governance/alignment | Session memory with compliance attestation |
| stop-and-fix/enforcement | Test output, 100% pass, zero warnings |
| polc-boundary/validation | File changes in authorized paths only |
| session-memory/validation | Session memory per §8 |

Gate failure = PR blocked.

---

## 7. Cross-References

| Artifact | Location |
|----------|----------|
| Implementation Plan | `modules/mat/03-implementation-plan/implementation-plan.md` |
| Build Progress Tracker | `modules/mat/BUILD_PROGRESS_TRACKER.md` |
| App Description | `modules/mat/00-app-description/app-description.md` |
| FRS | `modules/mat/01-frs/functional-requirements.md` |
| TRS | `modules/mat/01.5-trs/technical-requirements-specification.md` |
| System Architecture | `modules/mat/02-architecture/system-architecture.md` |
| Test Registry | `governance/TEST_REGISTRY.json` |
| Builder Contract Schema | [BUILDER_CONTRACT_SCHEMA.md](https://github.com/APGI-cmy/maturion-foreman-office-app/blob/main/.github/agents/BUILDER_CONTRACT_SCHEMA.md) |
| QA-to-Red RCA | `modules/mat/05-build-evidence/RCA_QA_PROCESS_LAPSE.md` |
| PREHANDOVER Proof Template | `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` |
| MERGE_GATE_INTERFACE_STANDARD | `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` |
| EVIDENCE_ARTIFACT_BUNDLE_STANDARD | `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` |
| FM Contract v2.1.0 | `.github/agents/foreman-isms-agent.md` |
| LIVING_AGENT_SYSTEM v6.2.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` |

---

## 8. Builder Session Memory & Completion Report Protocol

All builders MUST follow session memory and completion report protocols per LAS v6.2.0 Category 3 (Memory & Evidence).

### 8.1 Session Memory (MANDATORY)

**Path**: `.agent-workspace/<builder-id>/memory/session-NNN-YYYYMMDD.md`

**Required** (see template in `governance/templates/SESSION_MEMORY_TEMPLATE.md`): Builder ID/version, task, files modified (SHA256), actions, decisions, Builder-Only Constraint compliance, test results (100% GREEN), governance compliance, enhancement proposals, attestation.

**Enforcement**: `session-memory/validation` gate check.

---

### 8.2 Completion Report (MANDATORY per Task/Wave)

**Path**: `.agent-workspace/<builder-id>/TASK_<id>_COMPLETION_REPORT.md`

**Required** (see template in `governance/templates/COMPLETION_REPORT_TEMPLATE.md`): Task reference, deliverables, tests implemented (Test Registry IDs, 100% GREEN), test results, PREHANDOVER proof reference, builder attestation, enhancement proposals.

**Purpose**: Supports gate Check 2 (Validate Builder Involvement).

---

### 8.3 Delegation Acceptance Protocol

When FM delegates: (1) Acknowledge, (2) Verify prerequisites, (3) Load governance per §6, (4) Confirm scope within authorized paths, (5) Begin build, (6) Report per §8.1–§8.2.

**Rejection**: Prerequisites missing or task outside scope → escalate to FM.

---

### 8.4 Memory Rotation

When >5 session files exist, archive oldest to `.agent-workspace/<builder-id>/memory/.archive/`.

---

### 8.5 Evidence Bundle Requirements

Each builder PR MUST include under `.agent-admin/`: (1) PREHANDOVER Proof, (2) Gate Results Summary, (3) Test Output Logs (100% GREEN), (4) Coverage Reports, (5) Session Memory copy, (6) Completion Report copy.

**Enforcement**: Gate Check 2 (Validate Builder Involvement).

---

**End of Builder Appointment & Contracts**

**Contract Status**: ✅ ACTIVE  
**Appointed By**: Foreman (FM)  
**Date**: 2026-02-16  
**Doctrine Version**: 2.0.0  
**LAS Version**: 6.2.0

**Change Log**:
- **v2.0.0** (2026-02-16) — FM v2.1.0 alignment (Issue #196): LAS v6.2.0 compliance, Builder-Only Constraints, Governance Loading, Escalation/Stop, Merge Gate Awareness, Session Memory (§8)
- **v1.0.0** (2026-02-13) — Initial contract
