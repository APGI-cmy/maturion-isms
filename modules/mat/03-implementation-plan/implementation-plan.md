# MAT — Implementation Plan

**Module**: MAT (Manual Audit Tool)  
**Version**: v1.8.0  
**Status**: APPROVED  
**Owner**: Foreman (FM)  
**Created**: 2026-02-13  
**Last Updated**: 2026-02-23  
**Authority**: Derived from Architecture (modules/mat/02-architecture/), FRS (modules/mat/01-frs/functional-requirements.md), TRS (modules/mat/01.5-trs/technical-requirements-specification.md), Test Registry (governance/TEST_REGISTRY.json)

---

## 0. Purpose

This document defines the complete, phased implementation plan for the MAT module. It specifies:

- All build waves, tasks, and sub-tasks
- Sequential vs. concurrent execution logic
- Builder agent assignments per task
- Dependencies, acceptance criteria, and evidence requirements
- Risk mitigation strategies
- Multi-builder coordination and handover protocols

### Derivation Chain

```
App Description → FRS (FR-001–FR-072) → TRS (TR-001–TR-072) → Architecture (13 documents) → Test Registry (MAT-T-0001–MAT-T-0098) → **PBFAG** → This Plan
```

---

## 1. Build Wave Overview

MAT is built in **eleven waves** (Wave 0–Wave 9, plus Waves 5.5 and 5.6), with remediation waves for identified gaps. Each wave has a gate that must achieve 100% GREEN before the next wave begins.

| Wave | Name | Builder(s) | Execution | Tests | Est. Duration |
|------|------|-----------|-----------|-------|---------------|
| 0 | Foundational Infrastructure | schema-builder, api-builder | Sequential (0.1→0.2→0.3) | MAT-T-0042–0050, MAT-T-0083–0098 | 5 days |
| 1 | Criteria Management | api-builder, ui-builder | Partially concurrent (1.1∥1.3, then 1.2) | MAT-T-0007–0014, MAT-T-0004–0006 | 5 days |
| 2 | Evidence Collection & Offline Sync | api-builder, ui-builder | Partially concurrent (2.1∥2.3, then 2.2) | MAT-T-0015–0025, MAT-T-0056–0058 | 6 days |
| 2R | **Wave 2 Remediation** *(RCA G-07, G-10, G-16)* | ui-builder, api-builder | Sequential | MAT-T-0056–0058 (confirm GREEN), MAT-T-0101, MAT-T-0102 | 3 days |
| 3 | AI Scoring & Human Confirmation | api-builder, ui-builder | Sequential (3.1→3.2) | MAT-T-0026–0039 | 5 days |
| 4 | Dashboards & Reporting | ui-builder, api-builder | Concurrent (4.1∥4.2) | MAT-T-0069–0081 | 5 days |
| 4R | **Wave 4 Remediation** *(RCA G-14)* | api-builder, qa-builder | Sequential | MAT-T-0105 | 1 day |
| 5 | Watchdog & Continuous Improvement | api-builder, integration-builder | Sequential (5.1→5.2) | MAT-T-0059–0062, MAT-T-0063–0066 | 4 days |
| 5.5 | Frontend Application Assembly | ui-builder | Sequential (5.5.1→5.5.2→5.5.3) | FR-070, FR-071 acceptance criteria | 3 days |
| 5.6 | UI Component Wiring & Data Integration | ui-builder | Sequential (5.6.1→5.6.2→5.6.3→5.6.4→5.6.5→5.6.6) | MAT-T-0001–0042 (functional frontend tests) | 5 days |
| 5.6R | **Wave 5.6 Remediation** *(RCA G-03, G-04, G-15)* | ui-builder | Sequential | MAT-T-0099, MAT-T-0100, MAT-T-0106–MAT-T-0108 | 2 days |
| 6 | Deployment & Commissioning | api-builder, qa-builder | Sequential (6.1→6.2→6.3→6.4) | CWT (all tests on production) | 3 days |
| 7 | **AIMC Advisory Integration** *(BLOCKED — Awaiting AIMC Wave 3)* | api-builder, ui-builder | Sequential | MAT-T-AIMC-001–MAT-T-AIMC-010 (RED until AIMC Wave 3) | TBD |
| 8 | **AIMC Analysis Integration** *(BLOCKED — Awaiting AIMC Wave 4)* | api-builder | Sequential | MAT-T-AIMC-011–MAT-T-AIMC-020 (RED until AIMC Wave 4) | TBD |
| 9 | **AIMC Embeddings/RAG Integration** *(BLOCKED — Awaiting AIMC Wave 5)* | api-builder | Sequential | MAT-T-AIMC-021–MAT-T-AIMC-030 (RED until AIMC Wave 5) | TBD |

**Total Estimated Duration**: ~41 working days (8.5 weeks) for Waves 0–6. Waves 7–9 duration TBD — blocked on AIMC delivery.

> **⚠️ AIMC BLOCKER — Waves 7, 8, 9**: These waves CANNOT start or pass their gate until the upstream
> AIMC wave is confirmed complete by POLC/CS2. All AI test cases for these waves are RED and will
> remain RED until the respective AIMC Gateway capability is delivered. Builders MUST NOT begin
> any implementation work for Waves 7–9 without explicit POLC/CS2 approval.

> **Change Note (v1.8.0, 2026-02-23)**: Post-Delivery Gap Analysis & RCA complete. Remediation waves 2R, 4R, and 5.6R added to address gaps G-03, G-04, G-07, G-10, G-14, G-15, G-16 identified in `modules/mat/05-rca/MAT_APP_V2_RCA.md` v1.0.0. **Pre-Build Functionality Assessment Gate (PBFAG)** added to Derivation Chain between QA-to-Red and Implementation Plan — this gate is mandatory for all future build phases. Wave count updated to fourteen (plus remediation waves). See BUILD_PROGRESS_TRACKER.md Post-Delivery Gap Analysis section.

> **Change Note (v1.7.0, 2026-02-23)**: Tasks 1.2, 2.1, 3.1, and 4.2 scope and acceptance criteria corrected to remove all direct-provider references (GPT-4 Turbo, Whisper API, GPT-4o Mini fallback). All builder-facing scope statements now reference AIMC Gateway capability calls exclusively per `AIMC_STRATEGY.md` v1.0.0 and `ai-architecture.md` v2.0.0. Derivation chain updated to include FR-072.

> **Change Note (v1.6.0, 2026-02-23)**: Waves 7 (AIMC Advisory Integration), 8 (AIMC Analysis
> Integration), and 9 (AIMC Embeddings/RAG Integration) added per AIMC Strategy v1.0.0 realignment.
> All three waves are BLOCKED pending their upstream AIMC wave. Wave count updated to 11. Prior AI
> integration approach (direct provider calls) is constitutionally prohibited. Issue #377 superseded.
> See `ai-architecture.md` v2.0.0 and BUILD_PROGRESS_TRACKER.md AIMC deviation entry.

> **Change Note (v1.3.0, 2026-02-16)**: Wave 5.5 (Frontend Application Assembly) added to address governance gap where all component-level tests passed but no deployable React application was built. Wave 5.5 sits between Waves 5 and 6 because it requires all component implementations (Waves 0–5) to be complete before assembly, and must complete before deployment (Wave 6). See BUILD_PROGRESS_TRACKER.md Deviation #9.

> **Change Note (v1.5.0, 2026-02-17)**: Wave 5.6 (UI Component Wiring & Data Integration) added to address critical gap discovered during Wave 6 production testing. Wave 5.5 delivered application STRUCTURE (scaffolding, routing, layouts), but all components remained empty placeholders with NO data fetching, NO CRUD handlers, and NO component-to-page wiring. Wave 5.6 implements full frontend functionality by wiring components to Supabase, implementing CRUD operations, state management, and ensuring complete user workflows are functional. See RCA_WAVE6_FRONTEND_NON_FUNCTIONAL_20260217.md and BUILD_PROGRESS_TRACKER.md Deviation #11.

> **Change Note (v1.4.0, 2026-02-16)**: MANDATORY PRE-BUILD GATE language added to Wave 5.5 section (§2.6.5) requiring QA-to-Red functional test suite presence BEFORE any implementation begins. This enforces the canonical workflow (Architecture → QA-to-Red → Build-to-Green → Validation) and prevents code-first violations. Added after Deviation #10 (PR #239 attempted code-first implementation without QA-to-Red suite). See BUILD_PROGRESS_TRACKER.md Deviation #10.

---

## 1.5. Pre-Build Functionality Assessment Gate (PBFAG)

**Gate ID**: PBFAG  
**Authority**: `modules/mat/05-rca/MAT_APP_V2_RCA.md` §7 — established 2026-02-23  
**Mandatory**: Yes — applies to all future MAT build phases and all new module build phases  
**When**: After Stage 2.5 (QA-to-Red) is complete and BEFORE any builder is appointed or begins implementation  
**Verdict**: PASS or FAIL — builders must NOT be appointed until PBFAG PASS is recorded

### PBFAG Checklist

Before any builder receives a task, the Foreman must confirm ALL of the following:

1. **Requirements Coverage Check** — Every FR in the FRS has ≥ 1 corresponding test in the Red QA suite. Any FR without a test is a blocker.
2. **Stub/Placeholder Audit** — All placeholder components listed in architecture documents have a failing (RED) test in the Red QA suite so they cannot be shipped as "complete."
3. **API-to-UI Wiring Check** — Every feature requiring UI-to-API wiring has at least one wiring invariant test in the suite asserting the API call occurs from the UI.
4. **Blocked Features Check** — Every FR that depends on an upstream module is tagged BLOCKED with an explicit prerequisite gate in the implementation plan.
5. **Hardware/Media API Spec Check** — Every FR involving camera, microphone, or device API specifies the exact browser API, mobile fallback, and data model in the TRS.
6. **Offline Mode Check** — If offline mode is in scope, the offline sync architecture is complete and the Red QA suite includes offline scenario tests.
7. **Mobile Viewport Check** — The Red QA suite includes viewport tests at ≥ 375px width for all major user flows.
8. **Report Generation Check** — If reporting is in scope, the Red QA suite includes an E2E file-validity test (non-empty valid PDF/DOCX from seeded data).

### PBFAG Evidence Artifact

The Foreman must record the PBFAG result in:  
`modules/mat/05-build-evidence/PBFAG-mat-{YYYYMMDD}.md`

This artifact is a mandatory prerequisite for all future builder appointment documents.

---

## 2. Wave Details

### 2.1 Wave 0 — Foundational Infrastructure

**Objective**: Establish database schema, authentication, RLS policies, and core API framework.

**Execution**: Sequential — each sub-task depends on the prior.

#### Task 0.1: Database Schema & Migrations

| Field | Value |
|-------|-------|
| **Builder** | schema-builder |
| **Execution** | Sequential (must complete before 0.2) |
| **Dependencies** | Architecture frozen (§data-architecture.md, §security-architecture.md) |
| **FRS Refs** | FR-001–FR-003, FR-010–FR-015, FR-030–FR-035 |
| **TRS Refs** | TR-001–TR-010 |
| **Test Registry** | MAT-T-0083–MAT-T-0098 (Wiring Invariants) |

**Scope**:
- Create all PostgreSQL tables per `data-architecture.md`
- Implement indexes per performance targets (TR-004)
- Create RLS policies per `security-architecture.md`
- Seed test data per `test-strategy.md` §12
- Create migration scripts (up + down)

**Acceptance Criteria**:
1. All tables match `data-architecture.md` entity definitions exactly
2. All RLS policies enforce organisation isolation (MAT-T-0042–0050)
3. All wiring invariants pass (MAT-T-0083–0098)
4. Migration scripts are idempotent (up then down then up = same state)
5. Seed data creates valid test fixtures

#### Task 0.2: Authentication & Authorization

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Sequential (depends on 0.1, must complete before 0.3) |
| **Dependencies** | Task 0.1 complete (schema exists) |
| **FRS Refs** | FR-030–FR-035 |
| **TRS Refs** | TR-011–TR-015 |
| **Test Registry** | MAT-T-0042–MAT-T-0050 (Security and RLS) |

**Scope**:
- Configure Supabase Auth (JWT + MFA) per `security-architecture.md`
- Implement role-based access (Lead Auditor, Domain Auditor, MPS Auditor, Evidence Contributor)
- Wire MFA enforcement for Lead Auditor role (FR-031)
- Implement session management and token refresh

**Acceptance Criteria**:
1. Login/signup flow functional with all roles
2. MFA enrollment and verification for Lead Auditor (MAT-T-0043)
3. RLS policies reject cross-organisation access (MAT-T-0044–0046)
4. JWT claims include role and organisation_id
5. Session expiry and refresh work correctly

#### Task 0.3: Core API Framework

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Sequential (depends on 0.2) |
| **Dependencies** | Task 0.2 complete (auth functional) |
| **FRS Refs** | FR-001–FR-003 |
| **TRS Refs** | TR-016–TR-020 |
| **Test Registry** | MAT-T-0001–MAT-T-0003 (Audit Lifecycle) |

**Scope**:
- Scaffold Edge Functions (Deno) per `system-architecture.md` §3.2
- Implement CRUD for audit lifecycle (create, status transitions, soft delete)
- Wire PostgREST API with RLS
- Implement error handling and logging middleware
- Create health check endpoint (`GET /health`)

**Acceptance Criteria**:
1. Audit creation returns unique ID (MAT-T-0001)
2. Status transitions follow defined order (MAT-T-0002)
3. Soft deletion preserves data, prevents physical deletion (MAT-T-0003)
4. All API errors return structured JSON responses
5. Health check endpoint returns 200 with service status

**Wave 0 Gate**: All tests GREEN for MAT-T-0001–0003, MAT-T-0042–0050, MAT-T-0083–0098. Zero warnings. PREHANDOVER proof compiled.

---

### 2.2 Wave 1 — Criteria Management

**Objective**: Criteria document upload, AI parsing pipeline, and criteria management UI.

**Execution**: Partially concurrent — Tasks 1.1 and 1.3 can run in parallel; Task 1.2 depends on both.

#### Task 1.1: Criteria Document Upload & Storage (API)

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Concurrent with Task 1.3 |
| **Dependencies** | Wave 0 complete |
| **FRS Refs** | FR-004–FR-006 |
| **TRS Refs** | TR-021–TR-025 |
| **Test Registry** | MAT-T-0004–MAT-T-0006 |

**Scope**:
- Implement file upload Edge Function (PDF/DOCX, size limits per TR-021)
- Store criteria documents in Supabase Storage with signed URLs
- Compute SHA-256 hash at upload time
- Create metadata records in criteria table

**Acceptance Criteria**:
1. PDF/DOCX upload within size limits succeeds (MAT-T-0004)
2. SHA-256 hash computed and stored (MAT-T-0005)
3. Retrieval via signed URL returns original file (MAT-T-0006)
4. Oversized files rejected with clear error

#### Task 1.2: AI Parsing Pipeline

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Sequential (depends on 1.1 + 1.3) |
| **Dependencies** | Tasks 1.1 and 1.3 complete |
| **FRS Refs** | FR-007–FR-012 |
| **TRS Refs** | TR-026–TR-030 |
| **Test Registry** | MAT-T-0007–MAT-T-0014 |

**Scope**:
- Invoke `@maturion/ai-centre` Gateway capability `analysis` for criteria document parsing per `ai-architecture.md` v2.0.0
- Pass document content as structured input to `aimc.analysis.parseCriteriaDocument(input)`
- Implement deterministic validation of AIMC Gateway response (schema, coverage, numbering)
- Create human review queue for parsed results
- All routing, model selection, circuit breaking, and rate limiting are managed by the AIMC Gateway — do NOT implement these in MAT

**Acceptance Criteria**:
1. AI parses PDF into structured criteria JSON via AIMC Gateway (MAT-T-0007)
2. Parsed criteria follow Domain → MPS → Criteria hierarchy (MAT-T-0008)
3. Invalid AIMC Gateway response rejected by MAT schema validation (MAT-T-0009)
4. AIMC Gateway unavailability surfaces a structured error to MAT; MAT offers manual review mode (MAT-T-0010)
5. No direct provider fallback logic exists in MAT; AIMC Gateway manages all fallback internally (verified by MAT-T-0011)
6. Human review interface shows parsed results for approval (MAT-T-0012–0014)

#### Task 1.3: Criteria Management UI

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Concurrent with Task 1.1 |
| **Dependencies** | Wave 0 complete |
| **FRS Refs** | FR-004–FR-012 |
| **TRS Refs** | TR-051 (Vitest + React Testing Library) |
| **Test Registry** | MAT-T-0069–MAT-T-0073 (UI and Accessibility subset) |

**Scope**:
- Build criteria tree view (Domain → MPS → Criteria) per `ui-component-architecture.md`
- Build criteria upload form with drag-and-drop
- Build human approval workflow UI
- Implement responsive design (desktop, tablet, mobile)

**Acceptance Criteria**:
1. Criteria tree renders correctly at all viewports (MAT-T-0069)
2. Upload form accepts PDF/DOCX with progress indicator
3. Approval UI shows AI-parsed criteria with confirm/reject actions
4. WCAG 2.1 AA compliance for all criteria pages (MAT-T-0070–0073)

**Wave 1 Gate**: All tests GREEN for MAT-T-0004–0014, MAT-T-0069–0073. Zero warnings. PREHANDOVER proof compiled.

---

### 2.3 Wave 2 — Evidence Collection & Offline Sync

**Objective**: Evidence capture (photo, voice, file), offline mode, and sync.

**Execution**: Partially concurrent — Tasks 2.1 and 2.3 can run in parallel; Task 2.2 depends on 2.1.

#### Task 2.1: Evidence Capture API

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Concurrent with Task 2.3 |
| **Dependencies** | Wave 1 complete |
| **FRS Refs** | FR-013–FR-020 |
| **TRS Refs** | TR-031–TR-035 |
| **Test Registry** | MAT-T-0015–MAT-T-0025 |

**Scope**:
- Implement evidence upload Edge Functions (photo, audio, file)
- SHA-256 hashing at upload for immutability
- Evidence metadata capture (timestamp, GPS, criterion link)
- Append-only storage (no update/delete through API)
- Audio transcription via AIMC Gateway capability `analysis` (`aimc.analysis.transcribe(input)`) per `ai-architecture.md` v2.0.0 — no direct Whisper API call

**Acceptance Criteria**:
1. Photo upload with metadata succeeds (MAT-T-0015)
2. Audio upload triggers transcription (MAT-T-0016)
3. File upload computes and stores SHA-256 hash (MAT-T-0017)
4. Evidence retrieval verifies hash integrity (MAT-T-0018)
5. Delete attempt on committed evidence is rejected (MAT-T-0019–0020)
6. Evidence linked to correct criterion (MAT-T-0021–0025)

#### Task 2.2: Offline Mode & Sync Engine

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Sequential (depends on 2.1) |
| **Dependencies** | Task 2.1 complete |
| **FRS Refs** | FR-050–FR-058 |
| **TRS Refs** | TR-036–TR-040 |
| **Test Registry** | MAT-T-0056–MAT-T-0058 |

**Scope**:
- Implement Service Worker per `offline-sync-architecture.md`
- IndexedDB for structured offline data storage
- Cache API / OPFS for binary evidence files
- Sync queue (ordered, replay on reconnect)
- Conflict resolution (server-wins with merge for non-conflicting fields)

**Acceptance Criteria**:
1. Offline evidence capture stores locally (MAT-T-0056)
2. Reconnect triggers sync queue replay in order (MAT-T-0057)
3. Conflict resolution follows defined strategy (MAT-T-0058)

#### Task 2.3: Evidence Management UI

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Concurrent with Task 2.1 |
| **Dependencies** | Wave 1 complete |
| **FRS Refs** | FR-013–FR-020 |
| **TRS Refs** | TR-051 |
| **Test Registry** | MAT-T-0074–MAT-T-0076 (UI subset) |

**Scope**:
- Evidence gallery per criterion
- Photo/audio/file preview components
- Evidence annotation interface
- Offline indicator and sync status UI
- Mobile-optimized capture interface

**Acceptance Criteria**:
1. Evidence gallery renders all evidence types (MAT-T-0074)
2. Preview works for photo, audio, and document types (MAT-T-0075)
3. Offline indicator displays when network unavailable (MAT-T-0076)
4. Mobile capture interface is touch-optimized

**Wave 2 Gate**: All tests GREEN for MAT-T-0015–0025, MAT-T-0056–0058, MAT-T-0074–0076. Zero warnings. PREHANDOVER proof compiled.

---

### 2.4 Wave 3 — AI Scoring & Human Confirmation

**Objective**: AI maturity scoring engine and human confirmation workflow.

**Execution**: Sequential — Task 3.2 depends on Task 3.1.

#### Task 3.1: AI Scoring Engine

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Sequential (must complete before 3.2) |
| **Dependencies** | Wave 2 complete |
| **FRS Refs** | FR-021–FR-029 |
| **TRS Refs** | TR-041–TR-045 |
| **Test Registry** | MAT-T-0026–MAT-T-0033 |

**Scope**:
- Invoke AIMC Gateway capability `analysis` for maturity level prediction (`aimc.analysis.scoreMaturity(input)`) per `ai-architecture.md` v2.0.0
- Receive and surface confidence score, rationale, and evidence citations from AIMC Gateway response
- Implement gap analysis rendering (immediate, medium-term, long-term) from structured AIMC response
- Enforce refuse-to-score logic at MAT layer (insufficient evidence threshold — block Gateway call if < 2 evidence items)
- AIMC Gateway manages fallback provider selection internally — do NOT implement direct fallback in MAT
- Validate AIMC Gateway response against MAT AI scoring schema before storage

**Acceptance Criteria**:
1. AIMC Gateway returns maturity score with confidence level; MAT stores and surfaces result (MAT-T-0026)
2. Rationale includes evidence citations as returned by AIMC Gateway (MAT-T-0027)
3. Gap analysis renders correctly from structured AIMC Gateway response (MAT-T-0028)
4. MAT blocks Gateway call and flags criterion as "AI Blocked" below evidence threshold (MAT-T-0029)
5. AIMC Gateway unavailability returns structured error; MAT surfaces "AI temporarily unavailable" state with no direct fallback logic (verified by MAT-T-0030)
6. Invalid AIMC Gateway responses rejected by MAT schema validation (MAT-T-0031–0033)

#### Task 3.2: Human Confirmation UI & Workflow

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (depends on 3.1) |
| **Dependencies** | Task 3.1 complete |
| **FRS Refs** | FR-021–FR-029 |
| **TRS Refs** | TR-051 |
| **Test Registry** | MAT-T-0034–MAT-T-0039, MAT-T-0077–MAT-T-0078 (UI subset) |

**Scope**:
- AI score review interface showing score, confidence, rationale, evidence
- Confirm/override workflow with mandatory override justification
- Dual storage (AI decision + human decision) per `data-architecture.md`
- Score comparison view (AI vs. human across criteria)

**Acceptance Criteria**:
1. Score review shows all AI output fields (MAT-T-0034)
2. Confirm action records human agreement (MAT-T-0035)
3. Override requires justification text (MAT-T-0036)
4. Both AI and human scores stored independently (MAT-T-0037)
5. Score comparison view renders correctly (MAT-T-0038–0039)
6. WCAG 2.1 AA compliance for scoring UI (MAT-T-0077–0078)

**Wave 3 Gate**: All tests GREEN for MAT-T-0026–0039, MAT-T-0077–0078. Zero warnings. PREHANDOVER proof compiled.

---

### 2.5 Wave 4 — Dashboards & Reporting

**Objective**: Real-time dashboards and multi-format report generation.

**Execution**: Concurrent — Tasks 4.1 and 4.2 are independent.

#### Task 4.1: Dashboards

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Concurrent with Task 4.2 |
| **Dependencies** | Wave 3 complete |
| **FRS Refs** | FR-040–FR-048 |
| **TRS Refs** | TR-046–TR-048 |
| **Test Registry** | MAT-T-0079–MAT-T-0081 (UI subset) |

**Scope**:
- Global audit dashboard with aggregate metrics
- Domain dashboard with drill-down capability
- MPS dashboard with criterion-level detail
- Real-time updates via Supabase Realtime per `system-architecture.md` §3.2
- Responsive charts (desktop, tablet, mobile)

**Acceptance Criteria**:
1. Global dashboard shows correct aggregate metrics (MAT-T-0079)
2. Domain drill-down displays domain-level scores (MAT-T-0080)
3. MPS drill-down displays criterion-level detail (MAT-T-0081)
4. Real-time updates reflect within 2 seconds of data change
5. All charts render correctly at all breakpoints

#### Task 4.2: Report Generation

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Concurrent with Task 4.1 |
| **Dependencies** | Wave 3 complete |
| **FRS Refs** | FR-060–FR-065 |
| **TRS Refs** | TR-049–TR-050 |
| **Test Registry** | MAT-T-0063–MAT-T-0066 (Integration subset) |

**Scope**:
- Report generation Edge Function per `reporting-architecture.md`
- DOCX export with standard template
- PDF export with styling
- JSON export for API consumers
- AI-assisted executive summary generation via AIMC Gateway capability `document-generation` per `ai-architecture.md` v2.0.0 — no direct GPT-4 Turbo call
- Review table with Excel export

**Acceptance Criteria**:
1. DOCX report contains all audit data sections (MAT-T-0063)
2. PDF report renders correctly with styling (MAT-T-0064)
3. JSON export matches API schema (MAT-T-0065)
4. Excel review table export contains all criteria data (MAT-T-0066)

**Wave 4 Gate**: All tests GREEN for MAT-T-0063–0066, MAT-T-0079–0081. Zero warnings. PREHANDOVER proof compiled.

---

### 2.6 Wave 5 — Watchdog & Continuous Improvement

**Objective**: Runtime monitoring, alerting, and feedback loops.

**Execution**: Sequential — Task 5.2 depends on Task 5.1.

#### Task 5.1: Watchdog Monitoring

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Sequential (must complete before 5.2) |
| **Dependencies** | Wave 4 complete |
| **FRS Refs** | FR-066–FR-069 |
| **TRS Refs** | TR-057–TR-060 |
| **Test Registry** | MAT-T-0059–MAT-T-0062 |

**Scope**:
- Metrics collection per `observability-architecture.md`
- Alert threshold definitions (error rates, latency, AI costs)
- Alert routing (Sentry frontend, container health backend)
- Health check endpoints for all services

**Acceptance Criteria**:
1. Watchdog metrics captured for all services (MAT-T-0059)
2. Alerts trigger at defined thresholds (MAT-T-0060)
3. Alert routing delivers to correct channels (MAT-T-0061)
4. Health check endpoints return correct status (MAT-T-0062)

#### Task 5.2: Feedback & Integration

| Field | Value |
|-------|-------|
| **Builder** | integration-builder |
| **Execution** | Sequential (depends on 5.1) |
| **Dependencies** | Task 5.1 complete |
| **FRS Refs** | FR-066–FR-069, integration requirements |
| **TRS Refs** | TR-046–TR-050 |
| **Test Registry** | MAT-T-0063–MAT-T-0066 |

**Scope**:
- PIT module export endpoint per `integration-architecture.md`
- Maturity Roadmap export endpoint
- Override analysis pipeline (learning from human overrides)
- API contract validation against PIT and Maturity Roadmap specs

**Acceptance Criteria**:
1. PIT export endpoint returns valid data (MAT-T-0063)
2. Maturity Roadmap export endpoint returns valid data (MAT-T-0064)
3. Override analysis captures patterns correctly (MAT-T-0065)
4. API contracts match OpenAPI specifications (MAT-T-0066)

**Wave 5 Gate**: All tests GREEN for MAT-T-0059–0066. Zero warnings. PREHANDOVER proof compiled.

---

### 2.6.5 Wave 5.5 — Frontend Application Assembly

**Objective**: Scaffold the MAT React frontend application at `apps/mat-frontend/`, wire all implemented components (Waves 1–5) into page layouts with routing, and produce a buildable, deployable application artifact.

**Execution**: Sequential — each sub-task depends on the prior.

**Rationale**: Waves 0–5 delivered all backend services and UI component logic, but NO deployable React application was ever scaffolded. The components exist in `modules/mat/src/components/` as TypeScript service/logic modules, not as rendered React components in a running SPA. This wave bridges the gap between tested components and a working application. See BUILD_PROGRESS_TRACKER.md Deviation #9.

**FRS References**: FR-070 (Frontend Application Scaffolding), FR-071 (Frontend Application Wiring)
**TRS References**: TR-001 (React 18+ with Vite 5+), TR-006 (Monorepo Workspace), TR-071 (Frontend Application as Deployable Artifact)

---

#### ⚠️ MANDATORY PRE-BUILD GATE: QA-to-Red Test Suite Required

**Authority**: BUILD_PHILOSOPHY.md (test-first sequence), Issue [APGI-cmy/maturion-isms#240](https://github.com/APGI-cmy/maturion-isms/issues/240), PR [APGI-cmy/maturion-isms#241](https://github.com/APGI-cmy/maturion-isms/pull/241), CS2 governance ruling 2026-02-16

**Gate Requirement**: Before ANY implementation work begins on Wave 5.5 tasks (5.5.1, 5.5.2, 5.5.3), Foreman MUST generate and merge a complete QA-to-Red test suite covering all Wave 5.5 frontend requirements (FR-070, FR-071, TR-001, TR-006, TR-071).

**Mandatory Conditions**:
1. **Test-First Sequence**: QA-to-Red tests MUST exist and be committed BEFORE any builder receives implementation assignment
2. **Requirements Mapping**: All tests MUST be explicitly mapped to FRS/TRS requirements (FR-070, FR-071)
3. **Non-Destructive**: New tests MUST preserve all 98 existing GREEN tests from Waves 0–5 (zero test regressions allowed)
4. **Runnable RED State**: Tests MUST be executable and initially fail (RED status) before implementation begins
5. **Complete Coverage**: Tests MUST cover:
   - React application scaffolding verification (FR-070)
   - Component wiring and routing validation (FR-071)
   - Build and deployment artifact verification (TR-071)
   - Responsive layout requirements (FR-062)
   - PWA manifest and service worker registration (FR-063)

**Stop-and-Fix Enforcement**: If this gate is violated (code-first approach attempted), Foreman MUST:
- STOP all Wave 5.5 implementation work immediately
- Document deviation in BUILD_PROGRESS_TRACKER.md
- Generate QA-to-Red test suite before resuming
- Conduct root cause analysis of gate violation

**Traceability**:
- **Governance Deviation Record**: See BUILD_PROGRESS_TRACKER.md Stage 2.5 (QA-to-Red Previously Omitted)
- **QA-to-Red Issue**: [APGI-cmy/maturion-isms#240](https://github.com/APGI-cmy/maturion-isms/issues/240)
- **QA-to-Red Implementation**: [APGI-cmy/maturion-isms#241](https://github.com/APGI-cmy/maturion-isms/pull/241)

**Gate Validation**: Wave 5.5 cannot proceed to Task 5.5.1 until QA-to-Red test suite is merged and verified.

---

#### Task 5.5.1: React Application Scaffolding

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (must complete before 5.5.2) |
| **Dependencies** | Wave 5 complete |
| **FRS Refs** | FR-070 |
| **TRS Refs** | TR-001, TR-006, TR-071 |

**Scope**:
- Scaffold React 18+ application with Vite 5+ at `apps/mat-frontend/` (per TRS TR-001, NOT App Description §16.3 which specifies Next.js — TRS is authoritative)
- Configure `package.json` with workspace dependencies
- Configure TypeScript with `strict: true`
- Configure Tailwind CSS 3+ and Shadcn/UI
- Configure Zustand for client state, TanStack Query for server state
- Configure Supabase client SDK
- Create `src/main.tsx` entry point with providers (Auth, QueryClient, Store)
- Register in `pnpm-workspace.yaml`
- Verify `pnpm build` produces static assets
- Verify `pnpm dev` starts development server

**Acceptance Criteria** (FR-070):
1. `apps/mat-frontend/` exists as a buildable workspace package
2. `pnpm build` succeeds with zero warnings
3. `pnpm dev` starts a development server
4. TypeScript strict mode enabled
5. Shadcn/UI + Tailwind CSS configured
6. Supabase client SDK configured

#### Task 5.5.2: Page Layouts, Routing, and Component Wiring

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (depends on 5.5.1, must complete before 5.5.3) |
| **Dependencies** | Task 5.5.1 complete |
| **FRS Refs** | FR-071 |
| **TRS Refs** | TR-071, TR-001 |

**Scope**:
- Create page layouts for all major sections: Audit Management, Criteria Management, Evidence Collection, AI Scoring Review, Dashboards, Report Generation
- Configure client-side routing (React Router or equivalent)
- Import and render all components from `modules/mat/src/components/`
- Implement responsive navigation (sidebar on desktop, drawer on mobile) per FR-062
- Wire PWA manifest and service worker registration per FR-063

**Acceptance Criteria** (FR-071):
1. All major sections accessible via navigation
2. Components render in their respective pages
3. Responsive layout at desktop (≥1024px), tablet (768–1023px), mobile (<768px)
4. PWA manifest registered
5. Client-side routing functional

#### Task 5.5.3: Integration Verification and Build Validation

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (depends on 5.5.2) |
| **Dependencies** | Task 5.5.2 complete |
| **FRS Refs** | FR-070, FR-071 |
| **TRS Refs** | TR-071, TR-001, TR-007 |

**Scope**:
- Verify all existing tests (MAT-T-0001–MAT-T-0098) still pass
- Verify frontend builds (`pnpm build`) without errors or warnings
- Verify frontend starts and renders in browser
- Smoke test critical user flows in the running application
- Document application structure in build evidence

**Acceptance Criteria**:
1. All 98 existing tests remain GREEN
2. Frontend build succeeds with zero warnings
3. Application renders in browser and all pages are navigable
4. Critical user flows (audit creation, criteria upload, evidence capture, dashboard view) are functional or show appropriate placeholder states

**Wave 5.5 Gate**: FR-070 and FR-071 acceptance criteria met. All 98 existing tests remain GREEN. Frontend builds and renders. PREHANDOVER proof compiled.

---

### 2.6.6 Wave 5.6 — UI Component Wiring & Data Integration

**Objective**: Implement full frontend functionality by wiring all components to Supabase, implementing CRUD operations, data fetching, state management, loading/error states, and ensuring complete user workflows are functional.

**Execution**: Sequential — each sub-task builds on the prior.

**Rationale**: Wave 5.5 delivered the React application STRUCTURE (scaffolding, routing, page layouts), but all components remain empty placeholders with NO business logic. Wave 6 production testing (2026-02-17) revealed the application is completely non-functional: dashboard shows hardcoded zeros, audits page is blank, no CRUD operations exist, no Supabase data fetching implemented. This wave bridges the gap between application structure and functional user experience. See BUILD_PROGRESS_TRACKER.md Deviation #11.

**FRS References**: FR-001 to FR-069 (All functional requirements requiring frontend implementation)
**TRS References**: TR-001 (React 18+), TR-016 (Supabase Integration), TR-033 (UI Components), TR-047 (Responsive Design)

**Root Cause Addressed**: "Tested ≠ Delivered" pattern at UI layer. Tests validated component structure ("component exists") but NOT component behavior ("component fetches data from Supabase"). Physical verification ("Does the app WORK?") was not enforced during Waves 1-5.

---

#### Task 5.6.1: Dashboard Data Fetching & Metrics Display

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (must complete before 5.6.2) |
| **Dependencies** | Wave 5.5 complete (app scaffolded) |
| **FRS Refs** | FR-039 to FR-042 (Global Dashboard, Domain Dashboard, MPS Dashboard, Criteria Dashboard) |
| **TRS Refs** | TR-033 (Dashboard Components), TR-016 (Supabase Integration) |
| **Test Registry** | MAT-T-0039 (Global Dashboard Test) |

**Scope**:
- Implement `<GlobalDashboard>` component with real-time Supabase data fetching:
  - Total audits count (query `audits` table)
  - Completion rate calculation (query `audits` with `status = 'completed'`)
  - Average maturity score (query `audit_scores` table with aggregation)
- Implement TanStack Query hooks for data fetching with automatic caching
- Implement Supabase Realtime subscriptions for live updates (max 5-second lag per TR-033)
- Implement loading states (skeleton loaders during data fetch)
- Implement error states (toast notifications on fetch failure)
- Implement empty states (when no audits exist)
- Wire `<GlobalDashboard>` to `DashboardPage.tsx`

**Acceptance Criteria**:
1. Dashboard displays real audit metrics from Supabase (not hardcoded zeros)
2. Metrics update in real-time when audits change (Realtime subscription functional)
3. Loading skeleton displays during initial data fetch
4. Error toast appears if Supabase query fails
5. Empty state message displays when no audits exist
6. MAT-T-0039 test GREEN
7. Physical verification: Dashboard shows live data when running `pnpm dev`

---

#### Task 5.6.2: Audit Management CRUD Implementation

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (depends on 5.6.1, must complete before 5.6.3) |
| **Dependencies** | Task 5.6.1 complete |
| **FRS Refs** | FR-001 (Create Audit), FR-002 (Audit Listing), FR-003 (Audit Deletion/Archival) |
| **TRS Refs** | TR-047 (Audit Management UI), TR-016 (Supabase Integration) |
| **Test Registry** | MAT-T-0001, MAT-T-0002, MAT-T-0003 (Audit Lifecycle Tests) |

**Scope**:
- Implement `<AuditList>` component with Supabase data fetching:
  - Query `audits` table with RLS (organization isolation)
  - Display audit list with title, status, created date
  - Implement search and filter functionality
- Implement `<AuditCreationForm>` component with full CRUD logic:
  - Form fields: title, organization, facility, audit lead, dates
  - Form validation (Zod schema per TRS TR-047)
  - Submit handler: `INSERT INTO audits` via Supabase
  - Success/error handling with toast notifications
- Implement audit edit functionality:
  - Edit form pre-populated with existing audit data
  - Update handler: `UPDATE audits` via Supabase
- Implement audit deletion:
  - Soft delete: `UPDATE audits SET deleted_at = NOW()`
  - Confirmation dialog before deletion
- Wire all components to `AuditManagementPage.tsx`

**Acceptance Criteria**:
1. User can create new audit via form (audit saved to Supabase)
2. Audit list displays audits from Supabase (not "No audits yet" placeholder)
3. User can edit existing audit (changes saved to Supabase)
4. User can delete audit (soft delete in Supabase)
5. Form validation prevents invalid submissions
6. Loading states during CRUD operations
7. Success/error toast notifications
8. MAT-T-0001, MAT-T-0002, MAT-T-0003 tests GREEN
9. Physical verification: Can create, edit, delete audit in running app

---

#### Task 5.6.3: Criteria Management CRUD Implementation

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (depends on 5.6.2, must complete before 5.6.4) |
| **Dependencies** | Task 5.6.2 complete |
| **FRS Refs** | FR-004 to FR-009 (Criteria Upload, AI Parsing, Hierarchy Display, Modal Interaction) |
| **TRS Refs** | TR-047 (Criteria Management UI), TR-016 (Supabase Integration), TR-028 (AI Parsing) |
| **Test Registry** | MAT-T-0004 to MAT-T-0012 (Criteria Management Tests) |

**Scope**:
- Implement `<CriteriaUpload>` component with file upload logic:
  - File validation (PDF, DOCX, max 10MB)
  - Drag-and-drop support
  - Upload to Supabase Storage with signed URL
  - SHA-256 hash computation
  - Progress bar during upload
- Implement AI parsing trigger:
  - Call `invoke-ai-parse-criteria` edge function
  - Display parsing progress
  - Handle parsing success/failure
- Implement `<CriteriaTree>` component with Supabase data fetching:
  - Query `criteria` table with hierarchical structure
  - Display Domain → MPS → Criteria hierarchy
  - Keyboard navigation (arrow keys, Tab)
  - Search and filter
- Implement `<CriteriaModal>` component with full functionality:
  - Fetch criterion details from Supabase
  - Display all 5 tabs (Details, Evidence, Scoring, Compliance, History)
  - Evidence sub-tabs (Text, Photo, Audio, Video)
  - Unsaved data protection
- Wire all components to `CriteriaManagementPage.tsx`

**Acceptance Criteria**:
1. User can upload criteria document (PDF/DOCX) to Supabase Storage
2. AI parsing triggers and displays progress
3. Criteria tree displays parsed hierarchy from Supabase
4. User can navigate criteria tree with keyboard
5. Criteria modal displays criterion details from Supabase
6. All 5 modal tabs functional
7. File upload progress bar displays
8. SHA-256 hash computed and stored
9. MAT-T-0004 to MAT-T-0012 tests GREEN
10. Physical verification: Can upload criteria, view hierarchy, open modal

---

#### Task 5.6.4: Evidence Collection Implementation

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (depends on 5.6.3, must complete before 5.6.5) |
| **Dependencies** | Task 5.6.3 complete |
| **FRS Refs** | FR-010 to FR-015 (Evidence Collection: text, photo, audio, video, interview) |
| **TRS Refs** | TR-047 (Evidence Collection UI), TR-016 (Supabase Integration) |
| **Test Registry** | MAT-T-0013 to MAT-T-0022 (Evidence Collection Tests) |

**Scope**:
- Implement `<EvidenceCapture>` component with multi-type support:
  - Text notes (rich text editor with Markdown support)
  - Photo capture (camera access via MediaDevices API)
  - Audio recording (microphone access, WAV/MP3 format)
  - Video recording (camera + microphone, MP4 format)
  - Interview recording mode (structured Q&A with timestamps)
- Implement evidence upload to Supabase Storage:
  - File upload with progress tracking
  - SHA-256 hash computation for integrity
  - Metadata storage (timestamps, geolocation if enabled)
- Implement evidence linking to criteria:
  - Link evidence to specific criterion
  - Display evidence count per criterion
- Implement evidence review workflow:
  - View all evidence for a criterion
  - Approve/reject evidence
  - Add reviewer notes
- Wire all components to `EvidenceCollectionPage.tsx`

**Acceptance Criteria**:
1. User can capture text notes and save to Supabase
2. User can capture photo via camera and upload to Supabase Storage
3. User can record audio and upload to Supabase Storage
4. User can record video and upload to Supabase Storage
5. User can conduct interview with structured Q&A
6. Evidence linked to specific criteria in database
7. Evidence count displays on criteria tree
8. Review workflow functional (approve/reject)
9. SHA-256 hash computed for all file uploads
10. MAT-T-0013 to MAT-T-0022 tests GREEN
11. Physical verification: Can collect all evidence types in running app

---

#### Task 5.6.5: Scoring & Reports Implementation

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (depends on 5.6.4, must complete before 5.6.6) |
| **Dependencies** | Task 5.6.4 complete |
| **FRS Refs** | FR-023 to FR-029 (AI Scoring, Human Confirmation, Override), FR-044 to FR-047 (Report Generation, Review Table) |
| **TRS Refs** | TR-047 (Scoring/Reports UI), TR-028 (AI Integration) |
| **Test Registry** | MAT-T-0023 to MAT-T-0037 (Scoring and Reports Tests) |

**Scope**:
- Implement AI scoring trigger:
  - Call `invoke-ai-score-criterion` edge function
  - Display AI confidence score (1-5 maturity levels)
  - Display AI reasoning/explanation
- Implement human confirmation workflow:
  - Approve AI score (confirm button)
  - Override AI score (justification required)
  - Reject AI score (request re-scoring)
- Implement `<ReviewTable>` component:
  - Query all criteria with scores from Supabase
  - Display status, evidence count, score, reviewer
  - Inline editing of scores and notes
  - Excel export functionality (XLSX format)
- Implement `<ReportGenerator>` component:
  - Select report template (Executive, Detailed, Gap Analysis)
  - Generate report (DOCX/PDF/JSON formats)
  - Download or email report
- Wire all components to `ScoringPage.tsx` and `ReportsPage.tsx`

**Acceptance Criteria**:
1. User can trigger AI scoring for a criterion
2. AI score displays with confidence level and reasoning
3. User can approve AI score (saves to Supabase)
4. User can override AI score with justification
5. Review table displays all criteria with scores from Supabase
6. User can edit scores inline in review table
7. User can export review table to Excel (XLSX)
8. User can generate reports in multiple formats (DOCX, PDF, JSON)
9. Reports populate with real audit data from Supabase
10. MAT-T-0023 to MAT-T-0037 tests GREEN
11. Physical verification: Can score criteria, generate reports in running app

---

#### Task 5.6.6: Settings & Final Integration

| Field | Value |
|-------|-------|
| **Builder** | ui-builder |
| **Execution** | Sequential (depends on 5.6.5) |
| **Dependencies** | Task 5.6.5 complete |
| **FRS Refs** | FR-066 to FR-069 (Settings, Preferences, Organization Management) |
| **TRS Refs** | TR-047 (Settings UI), TR-016 (Supabase Integration) |

**Scope**:
- Implement `<SettingsPage>` component:
  - User profile management (name, email, avatar)
  - Organization settings (name, logo, contact info)
  - Preferences (language, theme, notifications)
  - Data export/import functionality
- Implement state persistence:
  - Save settings to Supabase `user_preferences` table
  - Load settings on app startup
  - Apply theme and language preferences globally
- Final integration verification:
  - All components wired to pages
  - All Supabase queries functional
  - All CRUD operations tested
  - All loading/error/empty states implemented
  - No console errors or warnings
  - No broken UI states

**Acceptance Criteria**:
1. User can update profile (name, email, avatar)
2. User can update organization settings
3. User can change preferences (language, theme)
4. Settings persist in Supabase and reload on next session
5. Theme applies globally (light/dark mode)
6. Data export downloads all audit data (JSON format)
7. All pages functional and wired to components
8. Zero console errors or warnings
9. Zero broken UI states
10. Physical verification: All settings functional in running app

---

#### ⚠️ MANDATORY PHYSICAL VERIFICATION GATE

**Authority**: FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §4.2, BUILD_PHILOSOPHY.md, BUILD_PROGRESS_TRACKER.md Deviation #11

**Gate Requirement**: Before Wave 5.6 can close, Foreman MUST perform comprehensive physical verification of the running application. "Does the app WORK?" is non-negotiable.

**Mandatory Physical Verification Checklist**:

1. **Video Walkthrough** (5-10 minutes):
   - Record video demonstrating ALL core user workflows:
     - Create new audit
     - Upload criteria document
     - Navigate criteria tree
     - Collect evidence (text, photo, audio, video)
     - Trigger AI scoring
     - Approve/override AI score
     - Generate report (DOCX, PDF, Excel)
     - Update settings
   - Video MUST be committed to evidence bundle

2. **Screenshot Evidence** (all pages):
   - Dashboard showing real data (not hardcoded zeros)
   - Audits page with audit list and create form
   - Criteria page with hierarchy tree and modal
   - Evidence page with all capture modes
   - Scoring page with AI scores and review table
   - Reports page with generated reports
   - Settings page with profile/org settings
   - Screenshots MUST be committed to evidence bundle

3. **Manual Test Checklist** (Foreman MUST personally execute):
   - [ ] Dashboard displays real-time audit metrics from Supabase
   - [ ] Can create new audit via form (audit saved to database)
   - [ ] Can edit audit (changes saved to database)
   - [ ] Can delete audit (soft delete in database)
   - [ ] Can upload criteria document (file saved to Supabase Storage)
   - [ ] AI parsing triggers and displays progress
   - [ ] Criteria tree displays parsed hierarchy
   - [ ] Can navigate criteria tree with keyboard
   - [ ] Criteria modal opens and displays all tabs
   - [ ] Can capture text evidence (saved to database)
   - [ ] Can capture photo evidence (saved to Storage + database)
   - [ ] Can record audio evidence (saved to Storage + database)
   - [ ] Can record video evidence (saved to Storage + database)
   - [ ] Can trigger AI scoring for criterion
   - [ ] AI score displays with confidence and reasoning
   - [ ] Can approve AI score (saved to database)
   - [ ] Can override AI score with justification
   - [ ] Review table displays all criteria with scores
   - [ ] Can edit scores inline in review table
   - [ ] Can export review table to Excel
   - [ ] Can generate report (DOCX, PDF, JSON)
   - [ ] Can update user profile (saved to database)
   - [ ] Can update organization settings (saved to database)
   - [ ] Can change theme (persists across sessions)
   - [ ] Zero console errors or warnings
   - [ ] Zero broken UI states
   - [ ] All loading states display correctly
   - [ ] All error states handle failures gracefully

4. **User Workflow Validation**:
   - Foreman MUST personally complete END-TO-END user workflows:
     - Workflow 1: Create audit → Upload criteria → Collect evidence → Score criteria → Generate report
     - Workflow 2: View dashboard → Navigate to audit → Update scores → Export review table
     - Workflow 3: Manage settings → Change theme → Update profile → Verify persistence
   - Each workflow MUST complete without errors or manual intervention

**Stop-and-Fix Enforcement**: If ANY item in the physical verification checklist FAILS, Foreman MUST:
- STOP Wave 5.6 closure immediately
- Document failure in session memory
- Assign ui-builder to fix identified issues
- Re-run physical verification after fixes
- Repeat until 100% checklist pass

**Wave 5.6 Gate**: ALL Wave 5.6 acceptance criteria met. ALL physical verification checklist items PASS. Video walkthrough + screenshots committed to evidence bundle. E2E tests GREEN (if implemented). Application fully functional and provides USER VALUE.

---

### 2.6.7 Wave 2R — Wave 2 Remediation (RCA G-07, G-10, G-16)

**Objective**: Address three critical gaps identified in post-delivery RCA: photo capture stub (G-07), interview recording stub (G-10), and offline mode not verified (G-16).  
**Authority**: `modules/mat/05-rca/MAT_APP_V2_RCA.md` §8 — Remediation Plan  
**Prerequisite**: Wave 2 original complete. RCA document approved.  
**Builder**: ui-builder (Tasks 2R.1, 2R.2), api-builder (Task 2R.3)  
**Execution**: Sequential (2R.1 → 2R.2 → 2R.3)

#### Task 2R.1: Photo Capture Implementation (G-07)

| Field | Value |
|-------|-------|
| **Scope** | Replace photo capture stub with working implementation using `<input type="file" accept="image/*" capture="environment">` (mobile) and/or `getUserMedia` (desktop). Upload captured image to `evidence-media` Supabase Storage bucket. Attach to evidence record. |
| **FRS** | FR-027 |
| **TRS** | TR-027 (must be expanded with browser API surface before implementation) |
| **Test** | MAT-T-0101 (RED → GREEN) |
| **Acceptance Criteria** | (1) Photo capture UI appears in evidence modal Photo tab. (2) On mobile (375px viewport), native camera opens via `capture="environment"`. (3) Captured image uploads to Supabase Storage. (4) Evidence record references uploaded image URL. (5) MAT-T-0101 GREEN. |

#### Task 2R.2: Interview Recording Implementation (G-10)

| Field | Value |
|-------|-------|
| **Scope** | Replace interview recording stub with working implementation. Implement consent capture fields (interviewee name, role, consent checkbox). Reuse `MediaRecorder` pipeline from voice recording. Store recording with consent metadata. |
| **FRS** | FR-028 (must be expanded with full spec before implementation) |
| **TRS** | TR-028 (must be expanded with data model, consent fields before implementation) |
| **Test** | MAT-T-0102 (RED → GREEN) |
| **Acceptance Criteria** | (1) Interview recording tab in evidence modal operational. (2) Consent fields (interviewee name, role, consent checkbox) present and required before recording starts. (3) Recording uploaded to Supabase Storage with consent metadata. (4) Evidence record includes interview metadata. (5) MAT-T-0102 GREEN. |

#### Task 2R.3: Offline Mode Verification (G-16)

| Field | Value |
|-------|-------|
| **Scope** | Verify Service Worker is registered and operational. Confirm IndexedDB sync queue writes evidence records when offline. Confirm background sync submits queued records when connectivity is restored. If not implemented, implement per `offline-sync-architecture.md`. |
| **FRS** | FR-060, FR-061, FR-062 |
| **TRS** | TR-060, TR-061, TR-062 |
| **Tests** | MAT-T-0056, MAT-T-0057, MAT-T-0058 (confirm GREEN) |
| **Acceptance Criteria** | (1) Service Worker registers in deployed app (`navigator.serviceWorker.controller` non-null). (2) With network disabled in Playwright: user can capture evidence; record appears in IndexedDB queue. (3) With network re-enabled: queued record syncs to Supabase within 30s. (4) MAT-T-0056–0058 all GREEN. |

**Wave 2R Gate**: MAT-T-0056–0058 GREEN. MAT-T-0101 GREEN. MAT-T-0102 GREEN. Physical verification of offline capture-and-sync cycle complete.

---

### 2.6.8 Wave 4R — Wave 4 Remediation (RCA G-14)

**Objective**: Confirm PDF/DOCX report backend generation is operational and produces a valid, downloadable file from a seeded audit.  
**Authority**: `modules/mat/05-rca/MAT_APP_V2_RCA.md` §8 — Remediation Plan  
**Prerequisite**: Wave 4 original complete.  
**Builder**: api-builder, qa-builder  
**Execution**: Sequential (4R.1 → 4R.2)

#### Task 4R.1: Report Generation E2E Verification (G-14)

| Field | Value |
|-------|-------|
| **Scope** | Seed a complete audit with criteria, evidence records, and maturity scores. Trigger report generation via the reporting endpoint. Download the resulting file. Verify it is a non-empty, valid PDF (using a PDF parsing library) and DOCX (using a DOCX parsing library). |
| **FRS** | FR-051, FR-052, FR-053 |
| **TRS** | TR-051, TR-052, TR-053 |
| **Test** | MAT-T-0105 (RED → GREEN) |
| **Acceptance Criteria** | (1) `POST /api/reports/generate` with seeded audit ID returns 200 and a file URL. (2) File at returned URL is downloadable. (3) PDF file is non-empty and parseable. (4) DOCX file is non-empty and parseable. (5) Download link resolves within TTL (per TR-053). (6) MAT-T-0105 GREEN. |

**Wave 4R Gate**: MAT-T-0105 GREEN. Downloaded PDF and DOCX committed as evidence artifacts.

---

### 2.6.9 Wave 5.6R — Wave 5.6 Remediation (RCA G-03, G-04, G-15)

**Objective**: Address three gaps in the UI wiring layer: hierarchy display not verified (G-03), evidence modal using mock data (G-04), and mobile viewport not tested (G-15).  
**Authority**: `modules/mat/05-rca/MAT_APP_V2_RCA.md` §8 — Remediation Plan  
**Prerequisite**: Wave 5.6 original complete.  
**Builder**: ui-builder  
**Execution**: Sequential (5.6R.1 → 5.6R.2 → 5.6R.3)

#### Task 5.6R.1: Criteria Hierarchy UI Render Verification (G-03)

| Field | Value |
|-------|-------|
| **Scope** | With a seeded Supabase instance containing criteria data, open the criteria tree view in the running application and verify all three levels (Domain → MPS → Criteria) render correctly. Fix any rendering defect found. |
| **FRS** | FR-006, FR-007, FR-008 |
| **TRS** | TR-006, TR-021 |
| **Test** | MAT-T-0099 (RED → GREEN) |
| **Acceptance Criteria** | (1) Criteria tree view displays all Domain nodes from seeded data. (2) Each Domain expands to show its MPS nodes. (3) Each MPS expands to show its Criteria nodes. (4) Criterion count per MPS and Domain is accurate. (5) MAT-T-0099 GREEN. (6) Screenshot committed as evidence. |

#### Task 5.6R.2: Evidence Modal Live Data Wiring (G-04)

| Field | Value |
|-------|-------|
| **Scope** | Replace mock/hardcoded data in the evidence modal with a live Supabase fetch. When a criterion is clicked, the modal must call `GET /api/evidence?criterionId={id}` and display the criterion title and any existing evidence records. |
| **FRS** | FR-019, FR-020, FR-021 |
| **TRS** | TR-019, TR-020 |
| **Test** | MAT-T-0100 (RED → GREEN) |
| **Acceptance Criteria** | (1) Clicking any criterion opens the evidence modal. (2) Modal header shows the criterion title (fetched from Supabase, not hardcoded). (3) Any pre-existing evidence records for that criterion are listed. (4) Network tab in browser shows `GET /api/evidence?criterionId=...` request on modal open. (5) MAT-T-0100 GREEN. |

#### Task 5.6R.3: Mobile Viewport Tests (G-15)

| Field | Value |
|-------|-------|
| **Scope** | Run Playwright tests at 375px × 812px (mobile) viewport for three critical flows: (1) audit creation, (2) evidence modal, (3) review table. Assert no horizontal overflow, all interactive elements meet 44px touch target, key CTAs are visible without horizontal scroll. |
| **FRS** | FR-065 |
| **TRS** | TR-065 |
| **Tests** | MAT-T-0106, MAT-T-0107, MAT-T-0108 (RED → GREEN) |
| **Acceptance Criteria** | (1) Audit creation flow: no horizontal overflow at 375px. (2) Evidence modal: all tabs accessible, no overflow. (3) Review table: scrollable horizontally if needed, no content clipped. (4) All interactive elements (buttons, inputs) ≥ 44px touch target. (5) MAT-T-0106–0108 GREEN. (6) Playwright screenshots at 375px viewport committed as evidence. |

**Wave 5.6R Gate**: MAT-T-0099 GREEN. MAT-T-0100 GREEN. MAT-T-0106–0108 GREEN. Screenshots committed to evidence bundle.

---

### 2.7 Wave 6 — Deployment & Commissioning

**Objective**: Deploy MAT to production (Vercel), provision all environment variables, validate deployment health, execute Combined Wave Test (CWT) on the production build, and perform formal closure with governance sign-off.

**Execution**: Sequential — each sub-task depends on the prior.

**Rationale**: Governance requires an explicit deployment and commissioning wave. No build is closed or signable without evidence of full deployment, 100% test pass, and certified sign-over. This wave reflects PartPulse propagation learnings and ensures a documented, repeatable deployment process.

#### Task 6.1: Vercel Project Provisioning & Configuration

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Sequential (must complete before 6.2) |
| **Dependencies** | Wave 5.5 complete (frontend application assembled and verified) |
| **Architecture Refs** | `deployment-architecture.md` §3.1, §3.4 |

**Scope**:
- Provision Vercel project for MAT frontend
- Configure `vercel.json` (rewrites, headers, environment variables)
- Configure `.vercelignore` to exclude non-deployment files
- Set all environment variables on Vercel using `.env.example` as source-of-truth
- Verify CI/CD pipeline integration (GitHub Actions → Vercel)

**Acceptance Criteria**:
1. Vercel project created and linked to repository
2. `vercel.json` configuration matches `deployment-architecture.md` §3.1
3. All environment variables from `.env.example` provisioned on Vercel
4. CI/CD pipeline triggers Vercel deployment on merge to main

#### Task 6.2: Staging Deployment & Health Validation

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Sequential (depends on 6.1, must complete before 6.3) |
| **Dependencies** | Task 6.1 complete (Vercel provisioned) |
| **Architecture Refs** | `deployment-architecture.md` §3.1–§3.5, `system-architecture.md` §3.2 |

**Scope**:
- Deploy to Vercel staging/preview environment
- Validate application startup and health (`GET /health` returns 200)
- Verify all environment variables accessible at runtime
- Verify database migrations applied and data flows functional
- Verify Supabase connection (Auth, Storage, Realtime, Edge Functions)
- Verify AI Gateway connectivity and circuit breaker status
- Smoke test critical user flows (audit creation, criteria upload, evidence capture)

**Acceptance Criteria**:
1. Staging deployment accessible at preview URL
2. Health check endpoint returns 200 with all service dependencies healthy
3. All environment variables present and correctly configured
4. Database migrations verified (schema matches `data-architecture.md`)
5. Critical user flows pass smoke testing on staging

#### Task 6.3: Production Deployment

| Field | Value |
|-------|-------|
| **Builder** | api-builder |
| **Execution** | Sequential (depends on 6.2, must complete before 6.4) |
| **Dependencies** | Task 6.2 complete (staging validated) |
| **Architecture Refs** | `deployment-architecture.md` §3.1 |

**Scope**:
- Formal production deployment to Vercel production environment
- Verify production URL is accessible and fully functional
- Verify all environment variables present in production
- Verify database migrations and data flows in production
- Confirm no test-only artifacts or seed data present in production
- Archive CI/CD configuration and governance artifacts

**Acceptance Criteria**:
1. Application running at production Vercel URL and fully functional
2. All environment variables present and accessible in production
3. Database migrations verified and all data flows validated in production
4. No test-only artifacts or seed data present in production
5. CI/CD configuration and governance artifacts archived

#### Task 6.4: CWT on Production & Formal Sign-Over

| Field | Value |
|-------|-------|
| **Builder** | qa-builder |
| **Execution** | Sequential (depends on 6.3) |
| **Dependencies** | Task 6.3 complete (production deployment) |
| **Architecture Refs** | `test-strategy.md`, `governance/canon/COMBINED_TESTING_PATTERN.md` |
| **Test Registry** | CWT: All MAT-T-0001–MAT-T-0098 on production |

**Scope**:
- Execute Combined Wave Test (CWT) on the deployed production build
- Validate all 98 tests GREEN against production environment
- End-to-end use case validation with real data (no test-only artifacts)
- Security validation on production (RLS, auth, MFA, CORS)
- Performance validation on production (response times, load handling)
- Formal sign-over: governance agent or product owner verifies all acceptance criteria
- Document closure evidence and certification statement

**Acceptance Criteria**:
1. CWT executed on production — all 98 tests GREEN (zero failures, zero skipped)
2. End-to-end use case validated with real data on production
3. Security validated on production (RLS cross-org isolation, auth flows, MFA)
4. Performance validated on production (meets targets per `performance-architecture.md`)
5. Formal sign-over completed by governance agent or product owner
6. Closure evidence and certification statement documented in tracker

**Escalation Rule**: If deployment or CWT in production discovers any failure, escalate per governance policies. Wave 6 closure is blocked until all failures are resolved and CWT re-executed to 100% GREEN.

**Wave 6 Gate**: CWT 100% GREEN on production (all 98 tests). Formal sign-over completed. Closure evidence documented. PREHANDOVER proof compiled.

---

### 2.8 Wave 7 — AIMC Advisory Integration

> **🚫 STATUS: BLOCKED — Cannot start until AIMC Wave 3 (Advisory Gateway) is confirmed complete by POLC/CS2.**
> Builders MUST NOT begin any implementation work for this wave without explicit POLC/CS2 approval.
> All test cases for this wave are RED and will remain RED until the AIMC Wave 3 prerequisite is met.

**Objective**: Integrate the MAT embedded AI assistant panel with the `@maturion/ai-centre` Advisory
Gateway, consuming the Maturity Advisor and related personas per FR-072 and TR-072.

**AIMC Prerequisite**: AIMC Wave 3 — Advisory Gateway delivered in `@maturion/ai-centre` package.

**Architecture Reference**: `modules/mat/02-architecture/ai-architecture.md` v2.0.0 §§2–4

| Field | Value |
|-------|-------|
| **Status** | BLOCKED — Awaiting AIMC Wave 3 |
| **Builder** | api-builder, ui-builder (after POLC/CS2 approval) |
| **Dependencies** | Wave 6 complete; AIMC Wave 3 complete |
| **FRS Refs** | FR-072, FR-028, FR-029 |
| **TRS Refs** | TR-072, TR-017 |
| **Tests** | MAT-T-AIMC-001–MAT-T-AIMC-010 (RED — pending AIMC Wave 3) |

**Acceptance Criteria** (cannot be signed off before AIMC Wave 3):
1. `EmbeddedAIAssistant` component calls `@maturion/ai-centre` Gateway — no direct provider calls.
2. Persona list sourced from AIMC canonical agent directory.
3. AIMC invocation reference ID captured and stored per FR-029.
4. No AI provider API keys in MAT bundle or MAT backend config.
5. Panel handles AIMC unavailability gracefully (disabled state, no crash).

**Wave 7 Gate**: All MAT-T-AIMC-001–MAT-T-AIMC-010 tests GREEN. AIMC Wave 3 confirmed complete.
POLC/CS2 approval on record. PREHANDOVER proof compiled. Zero direct provider references in code.

---

### 2.9 Wave 8 — AIMC Analysis Integration

> **🚫 STATUS: BLOCKED — Cannot start until AIMC Wave 4 (Analysis Gateway) is confirmed complete by POLC/CS2.**
> Builders MUST NOT begin any implementation work for this wave without explicit POLC/CS2 approval.
> All test cases for this wave are RED and will remain RED until the AIMC Wave 4 prerequisite is met.

**Objective**: Refactor MAT criteria parsing (FR-005, TR-037) and maturity scoring (FR-023, TR-038)
pipelines to call `@maturion/ai-centre` Analysis Gateway instead of any direct provider.

**AIMC Prerequisite**: AIMC Wave 4 — Analysis Gateway delivered in `@maturion/ai-centre` package.

**Architecture Reference**: `modules/mat/02-architecture/ai-architecture.md` v2.0.0 §3

| Field | Value |
|-------|-------|
| **Status** | BLOCKED — Awaiting AIMC Wave 4 |
| **Builder** | api-builder (after POLC/CS2 approval) |
| **Dependencies** | Wave 7 complete; AIMC Wave 4 complete |
| **FRS Refs** | FR-005, FR-023, FR-024, FR-028, FR-029, FR-030 |
| **TRS Refs** | TR-037, TR-038, TR-040, TR-017 |
| **Tests** | MAT-T-AIMC-011–MAT-T-AIMC-020 (RED — pending AIMC Wave 4) |

**Acceptance Criteria** (cannot be signed off before AIMC Wave 4):
1. Criteria parsing calls `aimc.analysis.parseCriteriaDocument()` — no direct provider calls.
2. Maturity scoring calls `aimc.analysis.scoreMaturity()` — no direct provider calls.
3. All existing Wave 1/3 test cases remain GREEN with AIMC-backed implementation.
4. No provider SDK imports or API keys in MAT codebase.

**Wave 8 Gate**: All MAT-T-AIMC-011–MAT-T-AIMC-020 tests GREEN. AIMC Wave 4 confirmed complete.
POLC/CS2 approval on record. PREHANDOVER proof compiled. Zero direct provider references in code.

---

### 2.10 Wave 9 — AIMC Embeddings/RAG Integration

> **🚫 STATUS: BLOCKED — Cannot start until AIMC Wave 5 (Embeddings/RAG Gateway) is confirmed complete by POLC/CS2.**
> Builders MUST NOT begin any implementation work for this wave without explicit POLC/CS2 approval.
> All test cases for this wave are RED and will remain RED until the AIMC Wave 5 prerequisite is met.

**Objective**: Integrate MAT with `@maturion/ai-centre` Embeddings/RAG Gateway for criteria
similarity search and evidence-to-criterion matching.

**AIMC Prerequisite**: AIMC Wave 5 — Embeddings/RAG Gateway delivered in `@maturion/ai-centre` package.

**Architecture Reference**: `modules/mat/02-architecture/ai-architecture.md` v2.0.0 §3

| Field | Value |
|-------|-------|
| **Status** | BLOCKED — Awaiting AIMC Wave 5 |
| **Builder** | api-builder (after POLC/CS2 approval) |
| **Dependencies** | Wave 8 complete; AIMC Wave 5 complete |
| **FRS Refs** | FR-055 (Extensibility), FR-056 (PIT Integration) |
| **TRS Refs** | TR-017 (AI Invocation Logging) |
| **Tests** | MAT-T-AIMC-021–MAT-T-AIMC-030 (RED — pending AIMC Wave 5) |

**Acceptance Criteria** (cannot be signed off before AIMC Wave 5):
1. Embeddings/RAG calls route through `@maturion/ai-centre` Gateway — no direct provider calls.
2. No vector database credentials or embedding model config in MAT configuration.

**Wave 9 Gate**: All MAT-T-AIMC-021–MAT-T-AIMC-030 tests GREEN. AIMC Wave 5 confirmed complete.
POLC/CS2 approval on record. PREHANDOVER proof compiled. Zero direct provider references in code.

---

These tasks run across all waves and are the responsibility of the qa-builder.

### QA Validation (All Waves)

| Field | Value |
|-------|-------|
| **Builder** | qa-builder |
| **Execution** | Continuous — runs validation at each wave gate |
| **Test Registry** | MAT-T-0067–MAT-T-0068 (Performance), MAT-T-0082 (Data Privacy) |

**Scope**:
- Performance testing per `performance-architecture.md` (k6 load scenarios)
- Security scanning (CodeQL, Dependabot, Trivy)
- Accessibility auditing (WCAG 2.1 AA)
- Data privacy compliance (GDPR, POPIA) per `security-architecture.md`
- Regression test suite management
- CI pipeline validation (all stages GREEN)

---

## 4. Combined Subwave Testing (CST) and Combined Wave Testing (CWT)

**Authority**: `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0

CST and CWT are mandatory integration testing disciplines required by canonical governance. Their omission from v1.0.0 of this plan was a governance failure (see `modules/mat/BUILD_PROGRESS_TRACKER.md` Stage 3 deviation record).

### 4.1 CST Checkpoints (Strategic, Per-Wave)

CST is applied at convergence points where concurrent subwaves must integrate.

| Wave | CST Checkpoint | Converging Tasks | Scope |
|------|----------------|-----------------|-------|
| 1 | After Tasks 1.1 + 1.3 complete | Upload API + Criteria UI | API contract integration: UI consumes upload/criteria endpoints |
| 2 | After Tasks 2.1 + 2.3 complete | Evidence API + Evidence UI | API contract integration: UI consumes evidence endpoints, offline indicator |
| 4 | After Tasks 4.1 + 4.2 complete | Dashboards + Reporting | Data consistency: dashboards and reports render from same data source |

**CST is not required for Waves 0, 3, 5** — these waves are fully sequential with no concurrent subwave convergence points.

**CST Evidence Requirements**:
- Integration scenarios documented before convergence point
- CST tests executed at convergence (cross-subwave API contract validation)
- CST results recorded (PASS/FAIL with details)
- Integration issues resolved before wave completion

### 4.2 CWT Requirements (Mandatory, Pre-IBWR)

CWT is mandatory before IBWR completion at every wave boundary. CWT cannot be skipped, deferred, or replaced.

| Wave Gate | CWT Scope | Validation |
|-----------|-----------|------------|
| Wave 0 → 1 | Schema + Auth + Core API cross-layer integration | RLS enforced end-to-end, auth flows through API, health check returns status |
| Wave 1 → 2 | Waves 0–1: Criteria upload → AI parsing → UI display | Full criteria lifecycle from upload through parsing to display |
| Wave 2 → 3 | Waves 0–2: Evidence capture → storage → offline sync → UI display | Evidence lifecycle with offline/online transitions |
| Wave 3 → 4 | Waves 0–3: Evidence → AI scoring → human confirmation → stored results | Scoring lifecycle from evidence through AI + human decision |
| Wave 4 → 5 | Waves 0–4: All data flows rendered in dashboards + reports | Dashboard and report accuracy against stored audit data |
| Wave 5 → 6 | Waves 0–5: Complete system integration (pre-deployment) | Full audit lifecycle, watchdog monitoring, integration exports |
| Wave 6 (Final) | Waves 0–6: CWT on production build | All 98 tests GREEN on production, E2E with real data, security + performance validated, formal sign-over |

**CWT Evidence Requirements** (per `COMBINED_TESTING_PATTERN.md` §5.4):
- CWT scope defined (waves covered, modules covered, scenarios covered)
- CWT tests executed (cross-wave, cross-module, multi-scenario)
- CWT results recorded (PASS/FAIL with detailed evidence)
- CWT PASS verdict recorded in IBWR report
- IBWR CANNOT complete without CWT PASS

### 4.3 Updated Wave Gate Criteria

Each wave gate now requires CST/CWT compliance in addition to existing criteria:

1. All wave tests GREEN (zero failures, zero skipped, zero warnings)
2. PREHANDOVER proof compiled
3. **CST executed at convergence points (if applicable for wave)**
4. **CWT executed and PASS before IBWR** (mandatory, non-negotiable)
5. CWT evidence documented in wave reconciliation report

### 4.4 CST/CWT Test Coverage

CST/CWT integration tests supplement (not replace) existing test registry coverage:

| Type | Scope | Responsibility |
|------|-------|---------------|
| CST tests | Cross-subwave API contract validation at convergence | Builders provide; FM validates |
| CWT tests | Cross-wave end-to-end integration scenarios | Builders provide; FM executes/coordinates |

**Health Check Integration**: The `GET /health` endpoint (Task 0.3) MUST include service dependency status to support CWT validation of cross-service integration health.

---

## 5. Dependency Graph

```
Wave 0:  [0.1 Schema] ──→ [0.2 Auth] ──→ [0.3 Core API]
                                                │
Wave 1:                        [1.1 Upload API] ┤ ──→ [1.2 AI Parsing]
                               [1.3 Criteria UI]┘
                                                │
Wave 2:                        [2.1 Evidence API]┤ ──→ [2.2 Offline/Sync]
                               [2.3 Evidence UI] ┘
                                                │
Wave 3:                        [3.1 AI Scoring] ──→ [3.2 Human Confirm UI]
                                                │
Wave 4:                        [4.1 Dashboards] ┐
                               [4.2 Reporting]  ┘
                                                │
Wave 5:                        [5.1 Watchdog]  ──→ [5.2 Integration]
                                                │
Wave 6:  [6.1 Vercel Provision] ──→ [6.2 Staging Validate] ──→ [6.3 Prod Deploy] ──→ [6.4 CWT + Sign-Over]

Wave 7:  [BLOCKED: Awaiting AIMC Wave 3] ──→ [7.1 AIMC Advisory Integration (FR-072, TR-072)]
Wave 8:  [BLOCKED: Awaiting AIMC Wave 4] ──→ [8.1 AIMC Analysis Integration (TR-037, TR-038)]
Wave 9:  [BLOCKED: Awaiting AIMC Wave 5] ──→ [9.1 AIMC Embeddings/RAG Integration]
```

**Legend**:
- `──→` = sequential dependency (must complete before next)
- Tasks at the same level with `┐┘` = concurrent (can run in parallel)

---

## 6. Builder Assignment Summary

| Builder | Waves | Primary Responsibility |
|---------|-------|----------------------|
| **schema-builder** | 0 | Database schema, migrations, RLS policies, seed data |
| **api-builder** | 0, 1, 2, 3, 4, 5, 6 (Tasks 6.1–6.3) | Edge Functions, AI Gateway, business logic, offline sync engine, deployment provisioning |
| **ui-builder** | 1, 2, 3, 4 | React components, responsive design, accessibility, PWA shell |
| **integration-builder** | 5 | PIT/Maturity Roadmap exports, API contract validation |
| **qa-builder** | All, 6 (Task 6.4) | Performance testing, security scanning, compliance validation, regression, production CWT + sign-over |

### Multi-Builder Coordination Points

1. **Wave 1 (Tasks 1.1 + 1.3)**: api-builder and ui-builder work concurrently. Handoff to api-builder for Task 1.2 requires both to complete. Coordination via shared API contract (OpenAPI spec in `system-architecture.md`).

2. **Wave 2 (Tasks 2.1 + 2.3)**: Same pattern as Wave 1. api-builder and ui-builder work on backend and frontend concurrently against shared API contract.

3. **Wave 4 (Tasks 4.1 + 4.2)**: ui-builder (dashboards) and api-builder (reporting) work fully concurrently with no shared dependency.

4. **Wave 5 (Task 5.2)**: integration-builder takes over from api-builder. Handover includes API documentation, test fixtures, and deployment configuration.

5. **Wave 6 (Tasks 6.1–6.3 + 6.4)**: api-builder handles deployment provisioning and production deployment (Tasks 6.1–6.3). qa-builder executes CWT on production and facilitates formal sign-over (Task 6.4). Handover from api-builder to qa-builder occurs after production deployment is confirmed healthy.

---

## 7. Orchestration Protocol

### 7.1 Sequential Execution Rules

- No wave starts until the prior wave gate is 100% GREEN
- Within a wave, sequential tasks must complete before dependent tasks begin
- Gate checks are performed by FM (not builders)

### 7.2 Concurrent Execution Rules

- Concurrent tasks share a common API contract defined in architecture
- Each concurrent task has independent test coverage
- Both tasks must complete before any dependent task begins

### 7.3 Builder Handover Protocol

**Handover Points** (where builder assignment changes):

| From | To | Point | Handover Artifacts |
|------|----|-------|-------------------|
| schema-builder | api-builder | After Task 0.1 | Schema DDL, RLS policies, seed data, migration scripts |
| api-builder + ui-builder | api-builder | After Tasks 1.1+1.3 | API contract, UI component list, shared test fixtures |
| api-builder | integration-builder | After Task 5.1 | API documentation, health check endpoints, deployment config |
| api-builder | qa-builder | After Task 6.3 | Production URL, deployment evidence, environment configuration |

**Handover Checklist** (for each handover):
1. All tests GREEN for outgoing builder's scope
2. PREHANDOVER proof compiled for scope
3. Documentation updated (API contracts, component docs)
4. Incoming builder briefed with scope, constraints, and acceptance criteria
5. FM validates handover completeness

### 7.4 Retry & Failure Protocol

- If a builder fails to achieve GREEN for their scope after 3 attempts → FM escalation
- FM may reassign task to a different builder instance or split task further
- Failed attempts documented in session memory with RCA
- Stop-and-Fix doctrine applies: no downstream work until failure resolved

---

## 8. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI API availability (AIMC Gateway) | Medium | High | AIMC Gateway manages circuit breaking and fallback internally per `AIMC_STRATEGY.md` v1.0.0; MAT surfaces AIMC error response to user |
| Offline sync conflicts | Medium | Medium | Server-wins strategy with merge for non-conflicting fields per `offline-sync-architecture.md` |
| RLS policy gaps | Low | Critical | Automated RLS tests per wave; dedicated test fixtures per organisation |
| Performance regression | Medium | Medium | Performance budgets in CI; k6 tests at each wave gate |
| Schema migration failures | Low | High | Idempotent migrations; up+down scripts tested in CI |
| Builder unavailability | Low | Medium | Builder contracts define replacement protocol; FM can reassign |
| Scope creep | Medium | High | Architecture is frozen; any change requires FM + CS2 approval |
| Deployment failure | Low | Critical | Staging validation before production; rollback via Vercel instant rollback; `.env.example` as env var source-of-truth |

---

## 9. Evidence Requirements

Each wave gate requires the following evidence:

1. **PREHANDOVER_PROOF.md** — Gate validation evidence per `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`
2. **Test Results** — 100% GREEN (zero failures, zero skipped, zero warnings)
3. **Coverage Report** — Meets targets per `test-strategy.md` §9 (80%+ line, 70%+ branch)
4. **Build Output** — `pnpm build` exit code 0
5. **Lint Output** — `pnpm lint` exit code 0 with zero warnings
6. **Session Memory** — FM session record per `FOREMAN_MEMORY_PROTOCOL.md`

---

## 10. Acceptance Criteria (Plan Level)

This implementation plan is accepted when:

1. ✅ All MAT components/tasks are covered without exception
2. ✅ Builder assignments documented per builder category
3. ✅ Explicit instructions provided for each builder (see `modules/mat/04-builder-appointment/builder-contract.md`)
4. ✅ Orchestration logic distinguishes concurrent/sequential build steps
5. ✅ Multi-builder handover protocols documented
6. ✅ All artifacts cross-linked to Architecture, FRS, TRS, and Test Registry
7. ✅ Risk mitigation strategies defined for all identified risks
8. ✅ CST/CWT integration testing requirements defined per `governance/canon/COMBINED_TESTING_PATTERN.md`
9. ✅ Deployment & Commissioning wave (Wave 6) defined with production CWT, formal sign-over, and closure certification
10. ✅ Frontend Application Assembly wave (Wave 5.5) defined with scaffolding, wiring, and build verification per FR-070, FR-071, TR-071
11. ✅ AIMC Integration waves (7, 8, 9) defined with explicit BLOCKED status and AIMC prerequisite gates per `AIMC_STRATEGY.md` v1.0.0
12. ✅ Post-Delivery RCA complete (`modules/mat/05-rca/MAT_APP_V2_RCA.md` v1.0.0); remediation waves 2R, 4R, 5.6R defined
13. ✅ Pre-Build Functionality Assessment Gate (PBFAG) defined (§1.5) and inserted into Derivation Chain

**Change Log**:
- v1.8.0 (2026-02-23): Post-Delivery Gap Analysis & RCA complete. Added §1.5 (PBFAG — Pre-Build
  Functionality Assessment Gate) as mandatory step between QA-to-Red and builder appointment.
  Derivation Chain updated to include PBFAG. Remediation waves 2R (G-07 photo capture, G-10 interview
  recording, G-16 offline mode), 4R (G-14 report generation), and 5.6R (G-03 hierarchy render, G-04
  evidence modal live data, G-15 mobile viewport) added. Wave overview table updated. Acceptance
  criteria 12 and 13 added. RCA reference: `modules/mat/05-rca/MAT_APP_V2_RCA.md` v1.0.0.
- v1.7.0 (2026-02-23): Tasks 1.2, 2.1, 3.1, 4.2 scope and acceptance criteria corrected to remove all
  direct-provider references (GPT-4 Turbo, Whisper API, GPT-4o Mini fallback) per `AIMC_STRATEGY.md`
  v1.0.0. Derivation chain updated to FR-001–FR-072. All builder-facing scope now references AIMC
  Gateway capability calls exclusively.
- v1.6.0 (2026-02-23): Added Waves 7, 8, 9 (AIMC Advisory, Analysis, Embeddings/RAG Integration).
  All three waves BLOCKED pending upstream AIMC waves per `AIMC_STRATEGY.md` v1.0.0. Updated
  derivation chain to include AIMC_STRATEGY.md and ai-architecture.md v2.0.0. Issue #377 superseded.
  See BUILD_PROGRESS_TRACKER.md AIMC deviation entry.
- v1.5.0 (2026-02-17): Added Wave 5.6 (UI Component Wiring & Data Integration) per governance remediation. See BUILD_PROGRESS_TRACKER.md Deviation #11.
- v1.4.0 (2026-02-16): Added MANDATORY PRE-BUILD GATE to Wave 5.5 requiring QA-to-Red suite before implementation. Enforces canonical workflow (Architecture → QA-to-Red → Build-to-Green). See BUILD_PROGRESS_TRACKER.md Deviation #10.
- v1.3.0 (2026-02-16): Added Wave 5.5 (Frontend Application Assembly) per governance remediation. Updated derivation chain to FR-001–FR-071 and TR-001–TR-071. See BUILD_PROGRESS_TRACKER.md Deviation #9.
- v1.2.0 (2026-02-15): Added Wave 6 (Deployment & Commissioning).
- v1.1.0 (2026-02-14): Added CST/CWT integration testing requirements.
- v1.0.0 (2026-02-13): Initial implementation plan with Waves 0–5.

---

## 11. Cross-References

| Artifact | Location |
|----------|----------|
| App Description | `modules/mat/00-app-description/app-description.md` |
| FRS | `modules/mat/01-frs/functional-requirements.md` |
| TRS | `modules/mat/01.5-trs/technical-requirements-specification.md` |
| System Architecture | `modules/mat/02-architecture/system-architecture.md` |
| Data Architecture | `modules/mat/02-architecture/data-architecture.md` |
| Security Architecture | `modules/mat/02-architecture/security-architecture.md` |
| AI Architecture | `modules/mat/02-architecture/ai-architecture.md` (v2.0.0 — AIMC Gateway pattern) |
| Offline/Sync Architecture | `modules/mat/02-architecture/offline-sync-architecture.md` |
| UI Component Architecture | `modules/mat/02-architecture/ui-component-architecture.md` |
| Performance Architecture | `modules/mat/02-architecture/performance-architecture.md` |
| Observability Architecture | `modules/mat/02-architecture/observability-architecture.md` |
| Reporting Architecture | `modules/mat/02-architecture/reporting-architecture.md` |
| Integration Architecture | `modules/mat/02-architecture/integration-architecture.md` |
| Test Strategy | `modules/mat/02-architecture/test-strategy.md` |
| TRS-to-Architecture Traceability | `modules/mat/02-architecture/trs-to-architecture-traceability.md` |
| Test Registry | `governance/TEST_REGISTRY.json` |
| Builder Contracts | `modules/mat/04-builder-appointment/builder-contract.md` |
| Build Progress Tracker | `modules/mat/BUILD_PROGRESS_TRACKER.md` |
| Deployment Architecture | `modules/mat/02-architecture/deployment-architecture.md` |
| CST/CWT Pattern | `governance/canon/COMBINED_TESTING_PATTERN.md` |
| Builder Contract Schema | [BUILDER_CONTRACT_SCHEMA.md](https://github.com/APGI-cmy/maturion-foreman-office-app/blob/main/.github/agents/BUILDER_CONTRACT_SCHEMA.md) |
| QA-to-Red RCA | `modules/mat/05-build-evidence/RCA_QA_PROCESS_LAPSE.md` |
| Post-Delivery Gap Analysis & RCA | `modules/mat/05-rca/MAT_APP_V2_RCA.md` |

---

**End of Implementation Plan**

**Next Step**: Builder appointment (modules/mat/04-builder-appointment/builder-contract.md)
