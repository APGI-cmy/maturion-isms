# MAT — Implementation Plan

**Module**: MAT (Manual Audit Tool)  
**Version**: v1.1.0  
**Status**: APPROVED  
**Owner**: Foreman (FM)  
**Created**: 2026-02-13  
**Last Updated**: 2026-02-14  
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
App Description → FRS (FR-001–FR-069) → TRS (TR-001–TR-070) → Architecture (13 documents) → Test Registry (MAT-T-0001–MAT-T-0098) → This Plan
```

---

## 1. Build Wave Overview

MAT is built in **six waves** (Wave 0–Wave 5). Each wave has a gate that must achieve 100% GREEN before the next wave begins.

| Wave | Name | Builder(s) | Execution | Tests | Est. Duration |
|------|------|-----------|-----------|-------|---------------|
| 0 | Foundational Infrastructure | schema-builder, api-builder | Sequential (0.1→0.2→0.3) | MAT-T-0042–0050, MAT-T-0083–0098 | 5 days |
| 1 | Criteria Management | api-builder, ui-builder | Partially concurrent (1.1∥1.3, then 1.2) | MAT-T-0007–0014, MAT-T-0004–0006 | 5 days |
| 2 | Evidence Collection & Offline Sync | api-builder, ui-builder | Partially concurrent (2.1∥2.3, then 2.2) | MAT-T-0015–0025, MAT-T-0056–0058 | 6 days |
| 3 | AI Scoring & Human Confirmation | api-builder, ui-builder | Sequential (3.1→3.2) | MAT-T-0026–0039 | 5 days |
| 4 | Dashboards & Reporting | ui-builder, api-builder | Concurrent (4.1∥4.2) | MAT-T-0069–0081 | 5 days |
| 5 | Watchdog & Continuous Improvement | api-builder, integration-builder | Sequential (5.1→5.2) | MAT-T-0059–0062, MAT-T-0063–0066 | 4 days |

**Total Estimated Duration**: ~30 working days (6 weeks)

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
- Implement AI Gateway service for document parsing per `ai-architecture.md`
- Wire GPT-4 Turbo for criteria extraction (Domain → MPS → Criteria)
- Implement deterministic validation (schema, coverage, numbering)
- Implement circuit breaker and rate limiting per `system-architecture.md` §3.3
- Create human review queue for parsed results

**Acceptance Criteria**:
1. AI parses PDF into structured criteria JSON (MAT-T-0007)
2. Parsed criteria follow Domain → MPS → Criteria hierarchy (MAT-T-0008)
3. Invalid AI output rejected by schema validation (MAT-T-0009)
4. Circuit breaker activates on repeated failures (MAT-T-0010)
5. Fallback to GPT-4o Mini when primary unavailable (MAT-T-0011)
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
- Audio transcription via Whisper API per `ai-architecture.md`

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
- Maturity level prediction service (GPT-4 Turbo) per `ai-architecture.md`
- Confidence scoring with rationale and evidence citations
- Gap analysis (immediate, medium-term, long-term)
- Refuse-to-score logic (insufficient evidence threshold)
- Fallback scoring (GPT-4o Mini) on primary failure
- AI response validation via Pydantic schemas

**Acceptance Criteria**:
1. AI produces maturity score with confidence level (MAT-T-0026)
2. Rationale includes evidence citations (MAT-T-0027)
3. Gap analysis categorizes findings correctly (MAT-T-0028)
4. Refuse-to-score triggers below evidence threshold (MAT-T-0029)
5. Fallback scoring activates on primary failure (MAT-T-0030)
6. Invalid AI responses rejected by schema validation (MAT-T-0031–0033)

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
- AI-assisted executive summary generation (GPT-4 Turbo)
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

## 3. Cross-Wave Tasks (Continuous)

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
| Wave 5 (Final) | Waves 0–5: Complete system integration | Full audit lifecycle, watchdog monitoring, integration exports |

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
```

**Legend**:
- `──→` = sequential dependency (must complete before next)
- Tasks at the same level with `┐┘` = concurrent (can run in parallel)

---

## 6. Builder Assignment Summary

| Builder | Waves | Primary Responsibility |
|---------|-------|----------------------|
| **schema-builder** | 0 | Database schema, migrations, RLS policies, seed data |
| **api-builder** | 0, 1, 2, 3, 4, 5 | Edge Functions, AI Gateway, business logic, offline sync engine |
| **ui-builder** | 1, 2, 3, 4 | React components, responsive design, accessibility, PWA shell |
| **integration-builder** | 5 | PIT/Maturity Roadmap exports, API contract validation |
| **qa-builder** | All | Performance testing, security scanning, compliance validation, regression |

### Multi-Builder Coordination Points

1. **Wave 1 (Tasks 1.1 + 1.3)**: api-builder and ui-builder work concurrently. Handoff to api-builder for Task 1.2 requires both to complete. Coordination via shared API contract (OpenAPI spec in `system-architecture.md`).

2. **Wave 2 (Tasks 2.1 + 2.3)**: Same pattern as Wave 1. api-builder and ui-builder work on backend and frontend concurrently against shared API contract.

3. **Wave 4 (Tasks 4.1 + 4.2)**: ui-builder (dashboards) and api-builder (reporting) work fully concurrently with no shared dependency.

4. **Wave 5 (Task 5.2)**: integration-builder takes over from api-builder. Handover includes API documentation, test fixtures, and deployment configuration.

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
| AI API availability (OpenAI) | Medium | High | Circuit breaker + fallback model (GPT-4o Mini) per `ai-architecture.md` |
| Offline sync conflicts | Medium | Medium | Server-wins strategy with merge for non-conflicting fields per `offline-sync-architecture.md` |
| RLS policy gaps | Low | Critical | Automated RLS tests per wave; dedicated test fixtures per organisation |
| Performance regression | Medium | Medium | Performance budgets in CI; k6 tests at each wave gate |
| Schema migration failures | Low | High | Idempotent migrations; up+down scripts tested in CI |
| Builder unavailability | Low | Medium | Builder contracts define replacement protocol; FM can reassign |
| Scope creep | Medium | High | Architecture is frozen; any change requires FM + CS2 approval |

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
| AI Architecture | `modules/mat/02-architecture/ai-architecture.md` |
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
| CST/CWT Pattern | `governance/canon/COMBINED_TESTING_PATTERN.md` |
| Builder Contract Schema | [BUILDER_CONTRACT_SCHEMA.md](https://github.com/APGI-cmy/maturion-foreman-office-app/blob/main/.github/agents/BUILDER_CONTRACT_SCHEMA.md) |
| QA-to-Red RCA | `modules/mat/05-build-evidence/RCA_QA_PROCESS_LAPSE.md` |

---

**End of Implementation Plan**

**Next Step**: Builder appointment (modules/mat/04-builder-appointment/builder-contract.md)
