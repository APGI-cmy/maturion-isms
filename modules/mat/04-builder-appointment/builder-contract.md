# MAT — Builder Appointment & Contracts

**Module**: MAT (Manual Audit Tool)  
**Version**: v1.0.0  
**Status**: APPROVED  
**Owner**: Foreman (FM)  
**Created**: 2026-02-13  
**Last Updated**: 2026-02-13  
**Authority**: Derived from Implementation Plan (`modules/mat/03-implementation-plan/implementation-plan.md`), Architecture (`modules/mat/02-architecture/`), [BUILDER_CONTRACT_SCHEMA.md](https://github.com/APGI-cmy/maturion-foreman-office-app/blob/main/.github/agents/BUILDER_CONTRACT_SCHEMA.md)

---

## 0. Purpose

This document defines builder assignments, responsibilities, constraints, and handover instructions for every builder agent category required to build the MAT module. Each builder section serves as the authoritative briefing artifact for that builder at handover time.

### Governance Binding

All builder contracts in this document comply with:
- **BUILDER_CONTRACT_SCHEMA.md** v2.0 (Maturion Doctrine Enforced)
- **BUILD_PHILOSOPHY.md** — One-Time Build Correctness, Zero Regression, Build-to-Green
- **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** — FM as managerial authority

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
| **Assigned Waves** | Wave 1 (Task 1.3), Wave 2 (Task 2.3), Wave 3 (Task 3.2), Wave 4 (Task 4.1) |
| **Recruited By** | Foreman (FM) |
| **Handover Protocol** | gate-first-deterministic |

### Scope

The ui-builder is responsible for all frontend React components, layouts, responsive design, accessibility, and PWA shell.

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

### Test Coverage

| Test Registry IDs | Category | Count |
|-------------------|----------|-------|
| MAT-T-0069–MAT-T-0081 | CAT-10: UI and Accessibility | 13 |

All 13 tests must be GREEN before each wave gate.

### Acceptance Criteria

1. All components render correctly at desktop (1024px), tablet (768px), mobile (375px)
2. WCAG 2.1 AA compliance for all pages (keyboard navigation, screen reader, color contrast)
3. All components use Shadcn/UI + Tailwind CSS (no external UI libraries)
4. All state management via Zustand (client) and TanStack Query (server)
5. All components have unit tests via Vitest + React Testing Library
6. Zero lint warnings (`eslint` with React/hooks plugins)
7. No class components — functional components only

### Forbidden Actions

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

---

**End of Builder Appointment & Contracts**

**Contract Status**: ✅ ACTIVE  
**Appointed By**: Foreman (FM)  
**Date**: 2026-02-13  
**Doctrine Version**: 1.0.0
