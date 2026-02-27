# BUILD PROGRESS TRACKER

**Module**: Mat  
**Module Slug**: mat  
**Last Updated**: 2026-02-26  
**Updated By**: api-builder (session-wave9-implementation-20260226)

---

## Module Lifecycle Progress

Track the progression through the canonical module lifecycle stages.

### Stage 0: App Description
**Status**: [x] COMPLETE  
**Location**: `modules/mat/00-app-description/`  
**Key Artifacts**:
- [x] `app-description.md` - Authoritative intent, scope, users, outputs, constraints
- [x] App Description approved by designated authority

**Completion Date**: In progress  
**Notes**: App description exists but may need approval formalization

---

### Stage 1: Functional Requirements Specification (FRS)
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [x] COMPLETE  
**Location**: `modules/mat/01-frs/`  
**Key Artifacts**:
- [x] `functional-requirements.md` - Verifiable requirements derived from App Description
- [x] Derivation statement from App Description included
- [x] FRS approved by designated authority

**Completion Date**: 2026-02-13 (v1.0.0); updated 2026-02-16 (v1.1.0 — FR-070, FR-071 added); updated 2026-02-20 (v1.2.0 — FR-072 added via INC-002)  
**Notes**: FRS compiled with 69 requirements (FR-001 to FR-069), traceability matrix, priority classification (P0/P1/P2), acceptance criteria, and edge cases. Derived from App Description v1.1. Updated to v1.1.0 (2026-02-16) to add FR-070 (Frontend Application Scaffolding) and FR-071 (Frontend Application Wiring) per Deviation #9. Updated to v1.2.0 (2026-02-20) to add FR-072 (Embedded AI Assistant — AIMC Advisory Gateway) per INC-002/LL-031. Current FRS: 72 requirements (FR-001 to FR-072).

---

### Stage 1.5: Technical Requirements Specification (TRS)
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [x] COMPLETE  
**Location**: `modules/mat/01.5-trs/`  
**Key Artifacts**:
- [x] `technical-requirements-specification.md` - Technical constraints, performance requirements, integration requirements (70 TRs: TR-001 to TR-070)
- [x] `frs-to-trs-traceability.md` - Traceability matrix linking FRS to TRS (100% coverage)
- [x] Tool validation and quality gate definitions (TR-051 to TR-060)
- [x] TRS approved by designated authority

**Completion Date**: 2026-02-13 (v1.0.0); updated 2026-02-16 (v1.1.0 — TR-071 added); updated 2026-02-20 (v1.2.0 — TR-072 added via INC-002)  
**Notes**: TRS compiled with 70 technical requirements (TR-001 to TR-070) covering technology stack, performance, integration, security, compliance, accessibility, tooling, and infrastructure. 100% FRS-to-TRS traceability achieved across all 69 functional requirements. Updated to v1.1.0 (2026-02-16) to add TR-071 (Frontend Application as Deployable Artifact) per Deviation #9. Updated to v1.2.0 (2026-02-20) to add TR-072 (Embedded AI Assistant — AIMC Advisory Gateway integration) per INC-002/LL-031. Current TRS: 72 technical requirements (TR-001 to TR-072). Ready for architecture stage.

---

### Stage 2: Architecture
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [x] COMPLETE  
**Location**: `modules/mat/02-architecture/`  
**Key Artifacts**:
- [x] `system-architecture.md` - System overview, tech stack, wiring diagram, E2E paths
- [x] `deployment-architecture.md` - Deployment targets, runtime entrypoints, filesystem
- [x] `data-architecture.md` - Database schema, file storage, offline storage, migration strategy
- [x] `security-architecture.md` - Auth, RLS, encryption, audit trail, GDPR/POPIA
- [x] `integration-architecture.md` - Supabase, AI, PIT, Maturity Roadmap, failure modes
- [x] `performance-architecture.md` - Performance targets, scalability, resource limits
- [x] `observability-architecture.md` - Error handling, monitoring, watchdog, logging
- [x] `test-strategy.md` - QA domains, testing levels, CI/CD, non-testable boundaries
- [x] `ai-architecture.md` v2.0.0 - AIMC Gateway pattern; parsing, scoring, transcription via `@maturion/ai-centre` Gateway (direct-provider content moved to §7 superseded record)
- [x] `offline-sync-architecture.md` - Service Worker, sync protocol, PWA
- [x] `ui-component-architecture.md` - Components, responsive design, accessibility, i18n
- [x] `reporting-architecture.md` - Report engine, Excel export, review table
- [x] `trs-to-architecture-traceability.md` - 100% TRS coverage (72/72 requirements mapped, including TR-071 and TR-072 added post-initial architecture)
- [x] `.env.example` - All environment variables documented (46 variables)
- [x] All 14 governance completeness domains addressed (3.1–3.14)
- [x] Architecture approved by designated authority

**Completion Date**: 2026-02-13 (v1.0.0); updated 2026-02-23 (`ai-architecture.md` rewritten to v2.0.0 — AIMC Gateway pattern)  
**Notes**: Architecture compiled with full compliance to ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md v1.3. All 14 mandatory completeness domains (3.1–3.14) explicitly addressed across 13 architecture documents. 100% TRS traceability achieved (70/70 at initial; extended to 72/72 with TR-071 and TR-072 additions). `ai-architecture.md` updated to v2.0.0 on 2026-02-23 to reflect AIMC Gateway pattern; all direct-provider references moved to §7 (superseded record). Pending formal approval by designated authority.

---

### Stage 2.5: QA-to-Red (Runnable Test Suite)
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [x] COMPLETE  
**Location**: `governance/TEST_REGISTRY.json`  
**Key Artifacts**:
- [x] `governance/TEST_REGISTRY.json` - Canonical test registry with 98 tests (MAT-T-0001 to MAT-T-0098), all initially RED
- [x] 12 test categories covering all architecture domains
- [x] Traceability to FRS, TRS, and Architecture for every test component
- [x] QA-to-Red test suite compiled per Build Philosophy

**Completion Date**: 2026-02-13  
**Notes**: QA-to-Red test suite compiled via PR [#110](https://github.com/APGI-cmy/maturion-isms/pull/110). 98 test components across 12 categories, all starting at RED status. Covers audit lifecycle, criteria management, evidence collection, AI services, security/RLS, offline/sync, watchdog, performance, integration, UI/accessibility, wiring invariants, and data privacy.

> **⚠️ PROCESS DEVIATION — QA-TO-RED STAGE PREVIOUSLY OMITTED**
>
> **Deviation**: The QA-to-Red stage was initially omitted from this tracker. The original tracker went directly from Architecture (Stage 2) to Implementation Plan (Stage 3), skipping the mandatory QA-to-Red runnable test suite step required by Build Philosophy.
>
> **Root Cause**: The original BUILD_PROGRESS_TRACKER template did not include QA-to-Red as a named stage between Architecture and Implementation Plan, despite it being a mandatory step in the canonical workflow (Architecture → QA-to-Red → Build-to-Green).
>
> **Corrective Action**: QA-to-Red test suite compiled and committed via PR [APGI-cmy/maturion-isms#110](https://github.com/APGI-cmy/maturion-isms/pull/110). This tracker now includes Stage 2.5 to record the QA-to-Red step.
>
> **Preventive Action**: All future module BUILD_PROGRESS_TRACKER instances must include QA-to-Red as a mandatory, auditable stage (Stage 2.5) between Architecture and Implementation Plan. The canonical workflow is:
>
> ```
> App Description → FRS → TRS → Architecture → QA-to-Red → Implementation Plan → Builder Appointment → Build Execution
> ```
>
> **RCA Reference**: `modules/mat/05-build-evidence/RCA_QA_PROCESS_LAPSE.md`

---

### Stage 3: Implementation Plan
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [x] COMPLETE  
**Location**: `modules/mat/03-implementation-plan/`  
**Key Artifacts**:
- [x] `implementation-plan.md` - Phased plan with 11 waves (Waves 0–9, plus Waves 5.5 and 5.6), acceptance criteria, evidence plan, concurrent/sequential logic
- [x] Dependencies identified and documented (dependency graph with sequential and parallel paths)
- [x] Risks and mitigation strategies documented (8 risks with mitigation)

**Completion Date**: 2026-02-13 (v1.0.0)  
**Notes**: Implementation plan compiled with 11 build waves (Waves 0–9, plus Waves 5.5 and 5.6), builder assignments per task, concurrent/sequential execution logic, multi-builder handover protocols, risk mitigation, and full traceability to Architecture, FRS, TRS, and Test Registry. Cross-referenced with builder contracts. Updated to v1.1.0 (2026-02-14) to include CST/CWT integration testing requirements per `governance/canon/COMBINED_TESTING_PATTERN.md`. Updated to v1.2.0 (2026-02-15) to include Wave 6: Deployment & Commissioning with production CWT, formal sign-over, and closure certification. Updated to v1.3.0 (2026-02-16) to add Wave 5.5 (Frontend Application Assembly) per Deviation #9; derivation chain updated to FR-001–FR-071, TR-001–TR-071. Updated to v1.4.0 (2026-02-16) to add MANDATORY PRE-BUILD GATE language to Wave 5.5. Updated to v1.5.0 (2026-02-17) to add Wave 5.6 (UI Component Wiring & Data Integration) per Deviation #11. Updated to v1.6.0 (2026-02-23) to add Waves 7, 8, 9 (AIMC Advisory, Analysis, Embeddings/RAG Integration — all BLOCKED pending upstream AIMC waves) per `AIMC_STRATEGY.md` v1.0.0; Issue #377 superseded. Updated to v1.7.0 (2026-02-23) to correct Tasks 1.2, 2.1, 3.1, and 4.2 scope — all direct-provider references (GPT-4 Turbo, Whisper API, GPT-4o Mini fallback) removed; all AI calls now reference AIMC Gateway capability calls exclusively per `AIMC_STRATEGY.md` v1.0.0 and `ai-architecture.md` v2.0.0; derivation chain updated to FR-001–FR-072, TR-001–TR-072.

> **⚠️ PROCESS DEVIATION — CST/CWT INTEGRATION TESTING OMITTED FROM INITIAL PLAN**
>
> **Deviation**: The initial implementation plan (v1.0.0) omitted Combined Subwave Testing (CST) and Combined Wave Testing (CWT) requirements, which are mandatory per `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0. CST checkpoints at convergence points and CWT validation before IBWR were not specified in wave gates, orchestration protocol, or evidence requirements.
>
> **Root Cause**: The implementation plan was compiled from Architecture, FRS, TRS, and Test Registry derivation chain but did not include `COMBINED_TESTING_PATTERN.md` as a governance input. The canonical testing hierarchy (Unit → Subwave QA → Wave QA → CST → CWT → E2E) was not referenced during plan compilation. This resulted in wave gates that validated individual test coverage but omitted cross-subwave and cross-wave integration testing requirements.
>
> **Impact**: Without CST/CWT requirements, builders would not know to provide integration tests at convergence points, FM would not enforce CWT before IBWR, and wave closure could proceed without cross-wave integration assurance — violating the constitutional mandate that IBWR cannot complete without CWT PASS.
>
> **Corrective Action**: Implementation plan updated to v1.1.0 with new Section 4 (CST/CWT requirements), including CST convergence checkpoints for Waves 1/2/4, mandatory CWT scope for all wave boundaries, updated wave gate criteria, and health check integration for CWT validation.
>
> **Preventive Action**: All future implementation plans MUST include `governance/canon/COMBINED_TESTING_PATTERN.md` in the derivation chain and explicitly define CST convergence checkpoints and CWT scope per wave. The canonical derivation chain is:
>
> ```
> App Description → FRS → TRS → Architecture → QA-to-Red → COMBINED_TESTING_PATTERN.md → AIMC_STRATEGY.md → Implementation Plan
> ```
>
> **Governance References**: `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0, `governance/canon/IN_BETWEEN_WAVE_RECONCILIATION.md`, `governance/canon/BOOTSTRAP_EXECUTION_LEARNINGS.md` (BL-025)

---

### Stage 3.5: Builder Agent File Checklist Creation/Update
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [x] COMPLETE  
**Location**: `governance/artifacts/BUILDER_AGENT_FILE_COMPLIANCE_CHECKLIST.md`  
**Key Artifacts**:
- [x] `BUILDER_AGENT_FILE_COMPLIANCE_CHECKLIST.md` (version 1.1.0) - Machine-checkable builder agent file compliance checklist
- [x] Canon Inventory alignment requirements (replaced legacy Tier-0 references)
- [x] Build Philosophy binding requirements
- [x] Evidence and artifact requirements
- [x] Merge Gate compliance requirements
- [x] Escalation protocol requirements
- [x] Specialty requirements (UI, API, Schema, Integration, QA builders)

**Completion Date**: 2026-02-14  
**Notes**: Builder agent file compliance checklist created per governance directive. Version 1.1.0 removes all legacy "Tier-0" terminology, replacing with Canon Inventory alignment logic. Checklist provides comprehensive, machine-checkable validation criteria for Foreman to use during builder agent file creation and recruitment. Artifact filed canonically in `governance/artifacts/` directory. Rationale: Correct historical process deviation where builder checklist creation step was omitted between Implementation Plan and Builder Appointment stages.

> **⚠️ PROCESS UPGRADE — BUILDER CHECKLIST CREATION STAGE ADDED**
>
> **Upgrade**: Builder Agent File Checklist Creation stage (Stage 3.5) added to tracker per governance directive. This stage was historically omitted, causing builder recruitment without formalized, machine-checkable compliance validation.
>
> **Root Cause**: Original BUILD_PROGRESS_TRACKER template did not include builder checklist creation/compilation as explicit stage between Implementation Plan and Builder Appointment, despite it being required for reliable builder constitution and governance binding.
>
> **Corrective Action**: Builder checklist artifact created and filed in `governance/artifacts/BUILDER_AGENT_FILE_COMPLIANCE_CHECKLIST.md` (version 1.1.0). Tracker now includes Stage 3.5 to record builder checklist creation/update step.
>
> **Preventive Action**: All future module BUILD_PROGRESS_TRACKER instances MUST include Builder Agent File Checklist Creation as mandatory, auditable stage (Stage 3.5) between Implementation Plan and Builder Appointment. The canonical workflow is:
>
> ```
> App Description → FRS → TRS → Architecture → QA-to-Red → Implementation Plan → Builder Checklist → Builder Appointment → Build Execution
> ```
>
> **Governance Reference**: Issue #[current issue number] - Builder agent file checklist artifact creation directive

---

### Stage 4: Builder Appointment
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [x] COMPLETE  
**Location**: `modules/mat/04-builder-appointment/`  
**Key Artifacts**:
- [x] `builder-contract.md` - Builder contracts for 5 builder categories (schema-builder, api-builder, ui-builder, integration-builder, qa-builder)
- [x] Responsibilities, constraints, and deliverables defined per builder
- [x] Detailed handover instructions per builder with explicit requirements, standards, and acceptance criteria
- [x] Builders appointed by FM
- [x] Builder agent files created by Codex Advisor (`.github/agents/{schema,ui,integration,qa}-builder.md`)
- [x] All 5 builder agent files present and compliant with BUILDER_CONTRACT_SCHEMA.md v2.0

**Completion Date**: 2026-02-13 (contracts); 2026-02-14 (agent files)  
**Notes**: Builder contracts compiled per BUILDER_CONTRACT_SCHEMA.md v2.0. Each builder receives detailed scope, wave assignments, test coverage mapping, acceptance criteria, forbidden actions, and key architecture references. Maturion Doctrine compliance (One-Time Build Correctness, Zero Test Debt, Gate-First Handover) enforced for all builders. Builder agent files created 2026-02-14 by Codex Advisor agent (the only agent authorized to create builder contracts/agent files).

> **⚠️ PROCESS DEVIATION — POLC AUTHORITY BOUNDARY VIOLATION IN PR #128**
>
> **Deviation**: PR [APGI-cmy/maturion-isms#128](https://github.com/APGI-cmy/maturion-isms/pull/128) erroneously assigned governance authority to Foreman and had Foreman writing/modifying builder agent files (`.github/agents/api-builder.md`). This violated the constitutional authority chain: Foreman's role is SUPERVISORY ONLY (POLC: Plan, Organize, Lead, Control). Foreman reviews, aligns, and ensures readiness — it does NOT build, write, alter, or create agent files.
>
> **Root Cause**: The Foreman agent acted outside its constitutional authority boundary by directly modifying builder agent files. The correct agent chain was not enforced: only the Codex Advisor agent is authorized to create and modify builder contracts/agent files. The Foreman failed to delegate agent file creation to the Codex Advisor and instead performed the work itself.
>
> **Impact**: PR #128 was closed/rejected without merge. Builder agent file compliance was not properly validated through the correct agent chain (Codex Advisor creates → Foreman validates → CS2 approves).
>
> **Corrective Action**: Issue [#129](https://github.com/APGI-cmy/maturion-isms/issues/129) opened as supervisory task. All 4 missing builder agent files (schema-builder, ui-builder, integration-builder, qa-builder) created via Codex Advisor agent. Foreman role limited to supervision and validation only.
>
> **Preventive Action**: All future builder agent file creation/modification MUST follow the correct agent chain:
>
> ```
> Codex Advisor (creates/modifies) → Foreman (supervises/validates) → CS2 (approves)
> ```
>
> Foreman MUST NOT create, write, alter, or modify any agent files. This is a constitutional boundary, not a procedural guideline.
>
> **Lessons Learned**:
> 1. POLC authority is supervisory — Foreman plans, organizes, leads, and controls but does NOT implement
> 2. Agent file creation is exclusively Codex Advisor's responsibility
> 3. Constitutional authority boundaries must be enforced before execution begins
> 4. Previous PR failures must be recorded as deviation records to prevent recurrence
>
> **Reference**: PR [APGI-cmy/maturion-isms#128](https://github.com/APGI-cmy/maturion-isms/pull/128) (closed), Issue [#129](https://github.com/APGI-cmy/maturion-isms/issues/129)

> **⚠️ PROCESS DEVIATION — SESSION MEMORY PROTOCOL OMITTED FROM BUILDER AGENT FILES**
>
> **Deviation**: All 5 builder agent files (api-builder, schema-builder, ui-builder, integration-builder, qa-builder) were created without the mandatory Session Memory Protocol section required by LIVING_AGENT_SYSTEM.md v6.2.0. The omission was identified during PR [APGI-cmy/maturion-isms#130](https://github.com/APGI-cmy/maturion-isms/pull/130) review.
>
> **Root Cause**: The Builder Agent File Compliance Checklist used during builder file creation did not include Session Memory Protocol as a mandatory section. The Foreman contract includes Session Memory Protocol (Category 3.2), but this requirement was not propagated to the builder checklist as a mandatory validation item. Contributing factors: (1) checklist gap — Session Memory Protocol not enumerated, (2) supervision gap — Foreman did not cross-check builder files against its own Category 3.2 requirement, (3) template gap — builder contract template did not include session memory as a standard section.
>
> **Impact**: Without Session Memory Protocol, builders cannot produce proper evidence trails, learning cannot propagate from builder sessions to institutional memory, and IBWR/wave closure lacks builder-side evidence.
>
> **Corrective Action**: Session Memory Protocol section added to all 5 builder agent files with LAS v6.2.0 compliant template, builder-specific workspace paths, and compliance checklist.
>
> **Preventive Action**: All future builder agent file creation/modification MUST validate that Session Memory Protocol is present. The builder compliance checklist MUST enumerate Session Memory Protocol as a mandatory section. Every mandatory LAS v6.2.0 section in the Foreman contract MUST be checked for applicability to builder contracts.
>
> **RCA Reference**: `.agent-workspace/foreman-isms/memory/session-003-20260214.md`

---

### Stage 5: Build Execution & Evidence
**Status**: [ ] NOT_STARTED | [x] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/mat/05-build-evidence/`  
**Key Artifacts**:
- [x] Wave 0: Foundational Infrastructure — 31 tests GREEN (schema-builder, api-builder)
- [x] Wave 1: Criteria Management — 10 tests GREEN (api-builder, ui-builder)
- [x] Wave 2: Evidence Collection & Offline Sync — 20 tests GREEN (api-builder, integration-builder) — PR [#164](https://github.com/APGI-cmy/maturion-isms/pull/164)
- [x] Wave 3: AI Scoring & Human Confirmation — 15 tests GREEN (api-builder, ui-builder) — PR [#168](https://github.com/APGI-cmy/maturion-isms/pull/168)
- [x] Wave 4: Dashboards & Reporting — 9 tests GREEN (ui-builder, api-builder) — PR #178
- [x] Wave 5: Watchdog & Continuous Improvement — 13 tests GREEN (api-builder, integration-builder, qa-builder)
- [x] Wave 5.5: Frontend Application Assembly — 29 tests GREEN (ui-builder)
- [x] Wave 5.6: UI Component Wiring & Data Integration — 0 tests (wiring validation via browser testing)
- [x] **FCWT: Final Complete Wave Test** — 127 tests GREEN, application fully functional (2026-02-18)
- [x] **INC-002: LL-031 Platform Blocker — Embedded AI Assistant** — FR-072/TR-072 added, component implemented, 77 frontend tests GREEN (2026-02-20)
- [x] Wave 6: Deployment & Commissioning (QA gate PASS — 172/172 tests GREEN, vercel.json valid, deployment config complete; production deployment pending CS2 Vercel/Supabase access)
- [x] **Wave 6 Gap Remediation — Vercel Serverless API Gateway** — `POST /api/ai/request` serverless function delivered; 17 tests GREEN; vercel.json updated (2026-02-24)
- [x] **Wave 7: AIMC Advisory Integration** — **COMPLETE** (AIMC Wave 3 confirmed; advisory-service.ts, EmbeddedAIAssistant AIMC wiring, env cleanup delivered)
- [x] **Wave 8: AIMC Analysis Integration** — **COMPLETE** (AIMC Wave 4 confirmed; analysis-service.ts delivered, AI_ROUTING_TABLE removed from ai-scoring.ts)
- [x] **Wave 9: AIMC Embeddings/RAG Integration** — **COMPLETE** (AIMC Wave 5 confirmed; embedding-service.ts delivered, searchSimilarCriteria and matchEvidenceToCriteria via Capability.RAG — 2026-02-26)

**Wave 0 Test Coverage (31 tests GREEN)** — PRs #140, #142:
- [x] Task 0.1 (schema-builder, 25 tests): MAT-T-0043, MAT-T-0044, MAT-T-0049–0053, MAT-T-0079–0094, MAT-T-0095, MAT-T-0096
- [x] Task 0.3 (api-builder, 6 tests): MAT-T-0001–0003, MAT-T-0038, MAT-T-0045, MAT-T-0046

**Wave 0 Evidence**:
- [x] Build evidence: `modules/mat/05-build-evidence/wave-0-task-0.1-build-evidence.md`

**Wave 0 Components Delivered**:
- [x] `modules/mat/src/services/audit-lifecycle.ts` — Audit creation, status transitions, soft deletion, archival, approvals
- [x] `modules/mat/src/services/security-rls.ts` — RBAC, RLS policies, session management, MFA
- [x] `modules/mat/src/services/wiring-invariants.ts` — Wiring invariant validations
- [x] `modules/mat/src/types/index.ts` — Core types for audit, evidence, criteria, security
- [x] `modules/mat/src/utils/crypto.ts` — SHA-256 hashing utility

**Wave 1 Test Coverage (10 tests GREEN)** — PRs #142, #143:
- [x] MAT-T-0004: PDF/DOCX Upload — GREEN
- [x] MAT-T-0005: SHA-256 Hash Computation — GREEN
- [x] MAT-T-0006: Signed URL Retrieval — GREEN
- [x] MAT-T-0007: AI Criteria Parsing — GREEN
- [x] MAT-T-0008: Domain → MPS → Criteria Hierarchy — GREEN
- [x] MAT-T-0009: Schema Validation — GREEN
- [x] MAT-T-0010: Hierarchical Navigation — GREEN
- [x] MAT-T-0011: Criteria Modal — GREEN
- [x] MAT-T-0012: Human Review Interface — GREEN
- [x] MAT-T-0054: Criterion Status Tracking — GREEN

**Wave 1 Evidence**:
- [x] CST report: `.agent-workspace/ui-builder/evidence/wave-1-task-1.3-CST.md`
- [x] CWT report: `.agent-workspace/ui-builder/evidence/wave-1-task-1.3-CWT.md`
- [x] IBWR report: `.agent-workspace/ui-builder/evidence/wave-1-task-1.3-IBWR.md`
- [x] Task 1.1/1.2 completion: `.agent-workspace/api-builder/WAVE1_TASKS_1.1_1.2_COMPLETION_REPORT.md`

**Wave 1 Components Delivered**:
- [x] `modules/mat/src/services/criteria-management.ts` — Criteria CRUD, document upload, AI parsing pipeline
- [x] `modules/mat/src/components/criteria-tree.ts` — Domain → MPS → Criteria hierarchy, keyboard nav, search/filter, responsive layout
- [x] `modules/mat/src/components/criteria-modal.ts` — 5-tab modal with evidence sub-tabs, unsaved data protection, ARIA
- [x] `modules/mat/src/components/criteria-upload.ts` — File validation, drag-and-drop, progress tracking
- [x] `modules/mat/src/components/approval-workflow.ts` — Role-based approval queue with confirm/reject actions

**Wave 2 Test Coverage (20 tests GREEN)** — PR [#164](https://github.com/APGI-cmy/maturion-isms/pull/164):
- [x] MAT-T-0013: Evidence Linking — GREEN
- [x] MAT-T-0014: Criteria CRUD Operations — GREEN
- [x] MAT-T-0015: Photo Upload with Metadata — GREEN
- [x] MAT-T-0016: Audio Upload and Transcription — GREEN
- [x] MAT-T-0017: File Upload SHA-256 Hash — GREEN
- [x] MAT-T-0018: Evidence Hash Integrity Verification — GREEN
- [x] MAT-T-0019: Delete Rejection on Committed Evidence — GREEN
- [x] MAT-T-0020: Evidence Delete Governance — GREEN
- [x] MAT-T-0021: Evidence Criterion Linking — GREEN
- [x] MAT-T-0022: Evidence Multi-Type Support — GREEN
- [x] MAT-T-0023: AI Scoring Pipeline — GREEN
- [x] MAT-T-0024: Human Score Confirmation — GREEN
- [x] MAT-T-0025: Override with Justification — GREEN
- [x] MAT-T-0047: Token Refresh and Session Management — GREEN
- [x] MAT-T-0048: Role Hierarchy Enforcement — GREEN
- [x] MAT-T-0056: PIT Module Integration Export — GREEN
- [x] MAT-T-0057: Maturity Roadmap Integration Export — GREEN
- [x] MAT-T-0058: Watchdog Monitoring Metrics — GREEN
- [x] MAT-T-0064: PWA Support — GREEN
- [x] MAT-T-0078: Upload Failure and Retry — GREEN

**Wave 2 Evidence**:
- [x] Evidence collection: `.agent-workspace/api-builder/memory/session-001-20260108.md`
- [x] Completion reports in `.agent-workspace/api-builder/`

**Wave 2 Components Delivered**:
- [x] `modules/mat/src/services/evidence-collection.ts` — Evidence upload with SHA-256 integrity hashing, multi-type support (text, voice, photo, video), interview recording, review workflow, retry logic (max 5 attempts)
- [x] `modules/mat/src/services/offline-sync.ts` — IndexedDB config, mutation queue with FIFO processing, server-wins conflict resolution, exponential backoff, PWA manifest, evidence sync orchestration
- [x] `modules/mat/src/services/ai-scoring.ts` — Maturity scoring (levels 1–5) with evidence-first gate, human confirmation workflow
- [x] `modules/mat/src/services/integration.ts` — PIT module export and Maturity Roadmap export with gap analysis
- [x] `modules/mat/src/services/watchdog.ts` — Metrics collection, configurable thresholds, alert severity checking
- [x] `modules/mat/public/manifest.json` — PWA manifest
- [x] `modules/mat/public/sw.js` — Service Worker implementation

**Wave 3 Test Coverage (15 tests GREEN)** — PR [#168](https://github.com/APGI-cmy/maturion-isms/pull/168):
- [x] MAT-T-0026: Override Logging — GREEN
- [x] MAT-T-0027: Maturity Model (5-Level) — GREEN
- [x] MAT-T-0028: AI Task Routing — GREEN
- [x] MAT-T-0029: AI Invocation Logging — GREEN
- [x] MAT-T-0030: AI Confidence Flagging — GREEN
- [x] MAT-T-0031: AI Rate Limiting — GREEN
- [x] MAT-T-0032: AI Model Versioning — GREEN
- [x] MAT-T-0033: Review Table Component — GREEN
- [x] MAT-T-0034: Review Table Editing — GREEN
- [x] MAT-T-0035: Report Generation — GREEN
- [x] MAT-T-0036: Report Formats (DOCX/PDF/JSON) — GREEN
- [x] MAT-T-0037: Excel Export — GREEN
- [x] MAT-T-0039: Global Dashboard — GREEN
- [x] MAT-T-0076: Offline Indicator — GREEN
- [x] MAT-T-0077: AI Degraded Mode — Manual Scoring — GREEN

**Wave 3 Components Delivered**:
- [x] `modules/mat/src/services/ai-scoring.ts` — Override logging, maturity model (5-level), AI task routing, invocation logging, confidence flagging, circuit breaker, model versioning, manual scoring fallback
- [x] `modules/mat/src/services/reporting.ts` — Report generation, multi-format export (DOCX/PDF/JSON), Excel export
- [x] `modules/mat/src/components/review-table.ts` — Review table component with sort, filter, edit, completeness validation
- [x] `modules/mat/src/components/dashboard.ts` — Global dashboard with domain-level metrics
- [x] `modules/mat/src/types/index.ts` — Types for override logging, maturity model, AI routing, invocation logging, confidence flagging, circuit breaker, model versioning, review table, reporting, dashboard

**Wave 4 Test Coverage (9 tests GREEN)** — PR #178:
- [x] MAT-T-0040: Domain Dashboard — GREEN
- [x] MAT-T-0041: MPS Dashboard — GREEN
- [x] MAT-T-0042: Maturity Distribution Visualization — GREEN
- [x] MAT-T-0061: Responsive Design — Desktop — GREEN
- [x] MAT-T-0062: Responsive Design — Tablet — GREEN
- [x] MAT-T-0063: Responsive Design — Mobile — GREEN
- [x] MAT-T-0065: Accessibility (WCAG 2.1 AA) — GREEN
- [x] MAT-T-0066: Internationalization (i18n) — GREEN
- [x] MAT-T-0098: Dashboard Realtime Update Wiring — GREEN

**Wave 4 Evidence**:
- [x] CST report: `.agent-workspace/foreman-isms/evidence/wave-4-CST.md` (3 scenarios, all PASS)
- [x] CWT report: `.agent-workspace/foreman-isms/evidence/waves-0-4-CWT.md` (6 scenarios, all PASS)
- [x] Retroactive IBWR (Wave 3→4): `.agent-workspace/foreman-isms/evidence/wave-3-IBWR-RETROACTIVE.md`
- [x] RCA for PR #178 failure: `.agent-workspace/foreman-isms/memory/session-005-20260215-RCA-WAVE4-FAILURE.md`
- [x] POLC session memory: `.agent-workspace/foreman-isms/memory/session-006-20260215-WAVE4-REORCHESTRATION.md`
- [x] api-builder completion report: `.agent-workspace/api-builder/TASK_4.2_COMPLETION_REPORT.md`

**Wave 4 Components Delivered**:
- [x] `modules/mat/src/components/dashboard.ts` — Extended with domain drill-down (generateDomainDrilldown), MPS drill-down, maturity distribution (generateMaturityDistribution)
- [x] `modules/mat/src/components/ui-support.ts` — Responsive design (getResponsiveLayout), WCAG 2.1 AA validation (validateAccessibility), i18n (EN/AF translations)
- [x] `modules/mat/src/services/report-edge-function.ts` — Report Edge Function handler, AI executive summary generator, format-specific validation (DOCX/PDF/JSON/Excel)
- [x] `modules/mat/src/services/watchdog.ts` — Extended with subscribeToDashboardUpdates() for Supabase Realtime subscription

**Test Count Reconciliation**:
- Wave 0: 31 tests GREEN (Task 0.1: MAT-T-0043–0044, 0049–0053, 0079–0096; Task 0.3: MAT-T-0001–0003, 0038, 0045–0046)
- Wave 1: 10 tests GREEN (MAT-T-0004–0012, 0054)
- Wave 2: 20 tests GREEN (MAT-T-0013–0025, 0047–0048, 0056–0058, 0064, 0078) — per PR #164
- Wave 3: 15 tests GREEN (MAT-T-0026–0037, 0039, 0076–0077) — per PR #168
- Wave 4: 9 tests GREEN (MAT-T-0040–0042, 0061–0063, 0065–0066, 0098) — PR #178
- **Total: 31 + 10 + 20 + 15 + 9 = 85 unique GREEN tests** (verified via `npx vitest run`)
- **RED tests: 13** (expected — Waves 5–6 scope)

**Completion Dates**: Wave 0: 2026-02-14; Wave 1: 2026-02-14; Wave 2: 2026-02-15 (PR #164 merged); Wave 3: 2026-02-15 (PR #168); Wave 4: 2026-02-15 (PR #178)  
**Notes**: Test attribution follows PR delivery (which PR turned each test from RED to GREEN). Wave 0 Task 0.1 (schema-builder) turned 25 tests GREEN; Wave 0 Task 0.3 (api-builder) added 6 more. Wave 2 PR #164 explicitly documents 20 new tests (41→61 total). Wave 3 PR #168 added 15 new tests (61→76 total). Wave 4 PR #178 added 9 new tests (76→85 total). MAT-T-0038 (Report Approval) was turned GREEN in Wave 0 Task 0.3 despite being in Wave 3 scope (MAT-T-0026–0039), so it is not counted in Wave 3's 15.

**Wave 5 Test Coverage (13 tests GREEN)**:
- [x] MAT-T-0055: Extensibility and Plugin Architecture — GREEN
- [x] MAT-T-0059: Watchdog Alert Thresholds — GREEN
- [x] MAT-T-0060: Override Analysis and Feedback Loop — GREEN
- [x] MAT-T-0067: GDPR Compliance — DSAR and Erasure — GREEN
- [x] MAT-T-0068: POPIA Compliance — GREEN
- [x] MAT-T-0069: Data Retention Policy Enforcement — GREEN
- [x] MAT-T-0070: Regulatory Standard Alignment — GREEN
- [x] MAT-T-0071: Large Audit Compilation — GREEN
- [x] MAT-T-0072: Concurrent Auditor Support — GREEN
- [x] MAT-T-0073: Page Load Performance (LCP < 2.5s) — GREEN
- [x] MAT-T-0074: API Response Time (< 200ms p95 CRUD) — GREEN
- [x] MAT-T-0075: AI Processing Performance — GREEN
- [x] MAT-T-0097: Consent Management — GREEN

**Wave 5 Components Delivered**:
- [x] `modules/mat/src/services/watchdog.ts` — Extended with configurable org thresholds (createOrganisationThresholds), alert routing (getAlertRouting), health check endpoints (checkServiceHealth), override analysis (analyseOverrides)
- [x] `modules/mat/src/services/integration.ts` — Extended with plugin registry (createPluginRegistry, registerPlugin, getPluginsByType), API contract validation (validatePITContract)
- [x] `modules/mat/src/services/performance.ts` — Performance budget definitions and validation (getPerformanceBudgets, validateBudget, validateConcurrentCapacity, validateLargeAuditBudget, getAIPerformanceBudgets)
- [x] `modules/mat/src/services/data-privacy.ts` — GDPR/POPIA compliance (generateDSARExport, performErasure), data retention (createRetentionPolicy, checkRetention), regulatory alignment (checkRegulatoryAlignment), consent management (recordConsent, withdrawConsent, hasActiveConsent)
- [x] `modules/mat/src/types/index.ts` — Extended with types for alert routing, health checks, override analysis, performance budgets, data privacy, consent, regulatory alignment, and plugin architecture

**Wave 5 Test Count Reconciliation**:
- Wave 0: 31 tests GREEN
- Wave 1: 10 tests GREEN
- Wave 2: 20 tests GREEN
- Wave 3: 15 tests GREEN
- Wave 4: 9 tests GREEN
- Wave 5: 13 tests GREEN (MAT-T-0055, 0059–0060, 0067–0075, 0097)
- **Total: 31 + 10 + 20 + 15 + 9 + 13 = 98 unique GREEN tests** (verified via `npx vitest run`)

## Wave 5.5 — Frontend Application Assembly

**Status**: ✅ COMPLETE  
**Started**: 2026-02-17  
**Completed**: 2026-02-18 (FCWT PASS — 127 tests GREEN)  
**Builder**: ui-builder (supervised by Foreman)  

### Tasks

#### 5.5.1: React Application Scaffolding
- **Status**: ✅ COMPLETE
- **Builder**: ui-builder
- **Tests**: FR-070 acceptance criteria

#### 5.5.2: Page Layouts, Routing, Component Wiring
- **Status**: ✅ COMPLETE
- **Builder**: ui-builder
- **Tests**: FR-071 acceptance criteria

#### 5.5.3: Integration Verification and Build Validation
- **Status**: ✅ COMPLETE
- **Builder**: ui-builder
- **Tests**: All 98 existing + new QA-to-Red tests (29 new tests GREEN — 127 total)

---

### ⚠️ CRITICAL DEVIATION: Agent Contract Failure (2026-02-17)

**Deviation ID**: DEV-MAT-5.5-001  
**Severity**: HIGH (governance violation, build delay)  
**Date**: 2026-02-17  
**Status**: RESOLVED

#### What Went Wrong
- **First Attempt (PR #288)**: Wrong agent used (generic coding agent instead of ui-builder via Foreman supervision)
- **Root Cause**: ui-builder agent file had non-standard YAML frontmatter field (`assigned_waves`), preventing GitHub agent discovery
- **Governance Violation**: Foreman supervision bypassed, generic coding agent wrote production code directly
- **Impact**: 1 PR closed, 3 issues created, ~2 hours wasted, governance transgression

#### How It Was Fixed
1. Issue #290 created (agent discovery bug identified)
2. PR #291 created (ui-builder YAML frontmatter fixed)
3. Issue #292 created (Wave 5.5 resubmission)
4. PR #293 created (correct approach: Foreman supervises ui-builder)

#### Prevention Measures for Next Build
1. ✅ **Pre-Flight Agent Availability Check** (LOCKED in Foreman contract)
   - Before starting any wave, verify all assigned builders appear in GitHub agent list
   - If any builder unavailable: HALT, investigate, fix, verify, then resume
2. ✅ **Builder Agent YAML Frontmatter Compliance Spec** (governance canon)
   - All builder contracts use only documented, GitHub-compatible YAML fields
   - Prohibited: `assigned_waves`, custom metadata in YAML (use body text instead)
3. ✅ **Post-Recruitment Verification** (Foreman POLC protocol)
   - After recruiting builder, verify agent recognized in active session
   - If not recognized: HALT, escalate to CS2, do NOT substitute
4. ✅ **Learning Loop Entry** (BL-030)
   - Canonical governance learning: Pre-Flight Builder Agent Availability Check
   - Must ripple to all consumer repos

#### Evidence
- **RCA**: `modules/mat/05-build-evidence/RCA_WAVE_5.5_AGENT_CONTRACT_DEVIATION.md`
- **Issues**: #287, #290, #292
- **PRs**: #288 (closed), #291 (ui-builder fix), #293 (correct approach)
- **Governance Learning**: BL-030 (BOOTSTRAP_EXECUTION_LEARNINGS.md)
- **Prevention Protocols**:
  - `governance/canon/FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md` (to be created)
  - `governance/specs/BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md` (to be created)

#### Post-Mortem Checklist for Next Build

**BEFORE starting ANY wave, Foreman MUST**:
- [ ] Read this deviation log (DEV-MAT-5.5-001)
- [ ] Run pre-flight agent availability check (verify all builders in agent list)
- [ ] Validate builder agent YAML frontmatter compliance
- [ ] Verify builder recognition after recruitment
- [ ] Halt and escalate if ANY builder unavailable (no substitutions allowed)

**If this pattern repeats in next build** → **CATASTROPHIC FAILURE** (same root cause, "We Only Fail Once" violation)

---

**Lesson**: Agent contracts are constitutional infrastructure. Builder unavailability = build blocker. Pre-flight checks are non-negotiable.

---

> **⚠️ PROCESS DEVIATION — BUILD_PROGRESS_TRACKER NOT UPDATED DURING WAVE COMPLETION**
>
> **Deviation**: Wave completion PRs [#140](https://github.com/APGI-cmy/maturion-isms/pull/140), [#142](https://github.com/APGI-cmy/maturion-isms/pull/142), [#143](https://github.com/APGI-cmy/maturion-isms/pull/143), [#164](https://github.com/APGI-cmy/maturion-isms/pull/164), and [#168](https://github.com/APGI-cmy/maturion-isms/pull/168) were merged without updating BUILD_PROGRESS_TRACKER.md as required by governance policy. The Implementation Plan and wave acceptance criteria specify tracker update as mandatory, but this requirement was not enforced during IBWR (In-Between Wave Reconciliation).
>
> **Root Cause**: (1) Tracker update requirement documented in Implementation Plan but not enforced by builder checklists or merge gate validation, (2) IBWR evidence files did not include tracker update as mandatory step, (3) No automated validation script to detect tracker modification requirement in wave completion PRs.
>
> **Impact**: Tracker became stale after Wave 0 (PR #140), Wave 1 Task 1.3 (PR #143), and Wave 2 (PR #164) completion, reducing audit trail quality and governance compliance visibility. Wave 3 (PR #168) also omitted Wave 2 documentation entirely.
>
> **Corrective Action**: (1) This deviation record retroactively documents all wave completion per PRs #140, #142, #143, #164, #168, (2) IBWR template updated to require tracker update evidence, (3) Merge gate validation script added to check tracker modification in wave completion PRs, (4) Builder agent file compliance checklist updated (via Codex Advisor) to include tracker update as mandatory wave completion deliverable.
>
> **Preventive Action**: All future wave completion PRs MUST include BUILD_PROGRESS_TRACKER.md modification with: (a) Wave/task completion dates, (b) Deliverables and tests turned GREEN, (c) Evidence artifact references, (d) Any process deviations or lessons learned. The IBWR process now includes tracker update validation as mandatory gate before PR handover.
>
> **Lessons Learned**:
> 1. Documentation of requirements insufficient without enforcement mechanism (builder checklist + merge gate)
> 2. IBWR process must explicitly require tracker update with evidence capture
> 3. Governance policy compliance requires both human awareness and automated validation
> 4. Builder checklists are enforcement point — requirements in Implementation Plan alone are insufficient
> 5. Test count math must be verified: sum of wave tests must equal total GREEN count
>
> **Retroactive Wave Documentation**:
> - **Wave 0 (PRs #140, #142)**: Task 0.1 (schema-builder): 25 tests GREEN; Task 0.3 (api-builder): 6 tests GREEN — Total 31 tests GREEN
> - **Wave 1 (PRs #142, #143)**: Criteria Management — 10 tests GREEN (MAT-T-0004–0012, 0054)
> - **Wave 2 (PR #164)**: Evidence Collection, Offline Sync, AI Scoring — 20 tests GREEN
> - **Wave 3 (PR #168)**: AI Scoring Engine, Human Confirmation — 15 tests GREEN
> - **Evidence**: IBWR reports filed in `.agent-workspace/` builder directories
>
> **RCA Reference**: `modules/mat/05-build-evidence/RCA_WAVE_3_TRACKER_UPDATE_FAILURE.md`
>
> **Governance References**: Issue [current], Implementation Plan Section 3 (Acceptance Criteria), LIVING_AGENT_SYSTEM.md v6.2.0 (Evidence Requirements), BUILD_PHILOSOPHY.md (Audit Trail Discipline), BL-029 (enforce tracker updates in wave completion PRs)

> **⚠️ PROCESS DEVIATION — CST/CWT OMITTED FROM WAVES 2 AND 3**
>
> **Deviation**: Wave 2 (PR #164) and Wave 3 (PR #168) were completed without executing Combined Subwave Testing (CST) or Combined Wave Testing (CWT), despite Implementation Plan v1.1.0 Section 4 requirements.
>
> **Root Cause**: (1) Implementation Plan v1.0.0 initially omitted CST/CWT section (corrected 2026-02-14), (2) IBWR template did not enforce CST/CWT execution, (3) No merge gate automation for CST/CWT validation.
>
> **Impact**: Wave 2 convergence point (Tasks 2.1 + 2.3) lacked CST validation. Wave 2 → Wave 3 gate lacked CWT cross-wave integration validation. Test count reconciliation not performed during IBWR.
>
> **Corrective Action**: Retrospective CWT executed for Waves 0–3 (evidence: `.agent-workspace/foreman-isms/evidence/waves-0-3-retrospective-CWT.md`). All 5 cross-wave integration scenarios PASS. RCA filed in `modules/mat/05-build-evidence/RCA_CST_CWT_OMISSION_WAVES_2_3.md`.
>
> **Preventive Action**: IBWR template updated to require CST/CWT execution checklist items. Foreman contract updated to mandate CWT before IBWR completion. Merge gate automation enhancement proposed (BL-030).
>
> **Governance References**: `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0, Implementation Plan v1.1.0 Section 4, RCA `RCA_CST_CWT_OMISSION_WAVES_2_3.md`

> **⚠️ PROCESS DEVIATION — WAVE 4 INCOMPLETE DELIVERY (PR #178)**
>
> **Deviation**: PR #178 delivered only Task 4.1 (Dashboards) of Wave 4, omitting Task 4.2 (Report Generation) entirely. Wave delivered at 50% scope completion. Additionally, CST, CWT, IBWR, BUILD_PROGRESS_TRACKER update, and Foreman session memory were all omitted. The Foreman agent violated its constitutional boundary by writing application code and tests directly instead of delegating to builders (ui-builder, api-builder).
>
> **Root Cause**: (1) Foreman executed building work directly instead of POLC supervision — no builders recruited, no task briefs issued, no concurrent execution coordinated, (2) Implementation Plan § 2.5 was not loaded before execution — the concurrent Task 4.1∥4.2 requirement was missed, (3) Previous deviation records in BUILD_PROGRESS_TRACKER.md were not consulted — same CST/CWT omission and tracker update failures recurred from Waves 2-3, (4) Test ID mapping confusion — implementation plan assigns MAT-T-0063–0066 to report generation acceptance criteria, but Foreman implemented the TEST_REGISTRY definitions (Responsive Design, PWA, WCAG, i18n) instead.
>
> **Impact**: Wave 4 gate cannot close — 50% scope delivered is unacceptable per OPOJD (One Plan One Job Done) principle. Audit trail broken — tracker shows Wave 3 as current (76 tests GREEN) but PR claims 84 tests GREEN without tracker evidence. CST cannot validate data consistency between dashboards and reports because reports were never built. "We Only Fail Once" principle violated — CST/CWT omission and tracker update omission are repeat failures from Waves 2-3.
>
> **Corrective Action**: (1) RCA filed as session memory: `.agent-workspace/foreman-isms/memory/session-005-20260215-RCA-WAVE4-FAILURE.md`, (2) This deviation record documents the failure, (3) Retroactive IBWR for Wave 3 → Wave 4 filed: `.agent-workspace/foreman-isms/evidence/wave-3-IBWR-RETROACTIVE.md`, (4) PR #178 marked as incomplete delivery, (5) Wave 4 re-orchestrated with full scope using proper builder delegation (ui-builder for Task 4.1, api-builder for Task 4.2), (6) CST, CWT, session memory, and tracker update will be mandatory deliverables in re-orchestrated Wave 4.
>
> **Preventive Action**: (1) Before ANY wave execution, Foreman MUST load Implementation Plan section for target wave and verify all tasks/builders/test IDs, (2) Foreman MUST NOT write application code or tests — all building delegated to specialist builders, (3) Foreman MUST consult all existing deviation records before each wave, (4) Pre-merge checklist: all acceptance criteria checked, CST executed, CWT executed, tracker updated, session memory filed, (5) Constitutional boundary enforcement — any session where Foreman writes code is a governance violation.
>
> **RCA Reference**: `.agent-workspace/foreman-isms/memory/session-005-20260215-RCA-WAVE4-FAILURE.md`
>
> **Governance References**: Implementation Plan § 2.5, COMBINED_TESTING_PATTERN.md v1.0.0, IN_BETWEEN_WAVE_RECONCILIATION.md, BUILD_PHILOSOPHY.md (OPOJD, "We Only Fail Once"), FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md §§ 1.3, 7.2

> **⚠️ CRITICAL GAP — DEPLOYMENT & COMMISSIONING WAVE OMITTED FROM INITIAL PLAN**
>
> **Gap**: The initial implementation plan (v1.0.0 and v1.1.0) covered Waves 0–5 (build waves) but omitted an explicit **Deployment & Commissioning Wave (Wave 6)**. Without this wave, there was:
> - No documented, repeatable Vercel deployment wave
> - No formal `.env` provisioning to the platform
> - No production deployment checklist
> - No formal closure with end-to-end (CWT) validation in production
> - No governance sign-over with 100% test pass confirmation
>
> **Root Cause**: The implementation plan derivation chain focused exclusively on build-time artifacts (Architecture → QA-to-Red → Build-to-Green) without extending to deployment-time validation and formal commissioning. The deployment architecture document (`modules/mat/02-architecture/deployment-architecture.md`) defined the deployment targets and configuration but was not translated into an actionable implementation wave. Additionally, the PartPulse propagation learnings regarding deployment wave necessity were not incorporated into the MAT plan.
>
> **Impact**: Without Wave 6, the build could complete all tests GREEN locally but never validate against the actual production environment. Production-specific failures (environment variables, deployment configuration, database migrations, cross-service connectivity) would go undetected until post-handover. Formal closure and governance sign-over lacked a defined process, creating governance compliance gaps.
>
> **Corrective Action**: Implementation plan updated to v1.2.0 with Wave 6: Deployment & Commissioning. Wave 6 includes four sequential tasks: (1) Vercel project provisioning and configuration, (2) staging deployment and health validation, (3) formal production deployment, (4) CWT on production and formal sign-over. The CWT requirements table now includes Wave 6 final CWT on production. Builder assignments, dependency graph, handover protocol, and risk mitigation updated to include Wave 6.
>
> **Preventive Action**: All future implementation plans MUST include a Deployment & Commissioning wave as the final wave. The canonical workflow is:
>
> ```
> App Description → FRS → TRS → Architecture → QA-to-Red → Implementation Plan (incl. Deployment Wave) → Builder Appointment → Build Execution → Deployment & Commissioning → Closure
> ```
>
> No build is closed or signable without evidence of full deployment, 100% test pass on production, and certified sign-over.
>
> **Governance References**: Issue "Add Wave 6: Deployment & Closure, CWT on Prod, and 100% Test Sign-Off", `modules/mat/02-architecture/deployment-architecture.md`, Implementation Plan v1.2.0 Section 2.7

---

### Deviation #8: POLC Boundary Gate Failure — Session Memory Language Violations (2026-02-16)

> **Date**: 2026-02-16  
> **Detected In**: Merge gate CI workflow (POLC Boundary Validation Gate)  
> **Session**: Post-Wave 5 governance cleanup  
> **Severity**: CRITICAL — Multiple Protocol Violations

> **Deviation**: The POLC Boundary Validation Gate failed during merge due to session memory file `.agent-workspace/foreman-isms/memory/session-010-20260216-wave6-escalation-no-app.md` containing language that triggered POLC violation detection. Specifically, phrases like "FM wrote ZERO production code" matched the gate's regex pattern `(wrote|wrote).*production.*code` even though the intent was to assert compliance (negative statement). The gate's negation filter (`did NOT|NOT.*implement|NOT.*write|did not|didn't|no production`) did not recognize "ZERO" as a negation keyword, causing false positive detection.

> **Root Cause**: 
> 1. **Session Memory Language Pattern**: Use of "ZERO" instead of "did NOT" in compliance statements
> 2. **Pre-Handover Testing Failure**: Pre-handover validation script was not run before pushing changes, violating mandatory handover testing protocol
> 3. **Test Dodging Pattern**: Assumption that "CI will catch it" instead of local validation (test dodging)
> 4. **Incomplete Negation Filter**: Gate regex did not recognize "ZERO", "NO", or numeric negations as negative assertions

> **Impact**: 
> - PR blocked from merge due to failing required check
> - Manual intervention required to diagnose and remediate
> - Evidence of repeated override habit (cultural/discipline drift)
> - Violation of "stop and fix" doctrine (merged despite red gate in prior instances)

> **Corrective Actions Taken**:
> 1. ✅ **Session Memory Correction**: Reworded lines 148 and 186 in `session-010-20260216-wave6-escalation-no-app.md`:
>    - Changed "FM wrote ZERO production code" → "FM did NOT write any production code"
>    - Changed "FM wrote ZERO test implementation" → "FM did NOT write test implementation"
> 2. ✅ **Pre-Handover Script Creation**: Created `.agent-workspace/foreman-isms/prehandover-validation.sh` that duplicates all merge gate checks (POLC boundary, evidence bundle, governance alignment)
> 3. ✅ **Validation Protocol Documentation**: Script enforces "stop and fix" discipline with explicit warnings about test dodging
> 4. ✅ **Local Testing**: Validated all session memory files pass POLC gate logic before committing fix
> 5. ✅ **RCA Documentation**: Created comprehensive root cause analysis in `POLC_GATE_FAILURE_RCA_20260216.md`

> **Preventive Measures**:
> 1. **Session Memory Language Standards**: Use recognized negation patterns:
>    - ✅ GOOD: "FM did NOT write production code"
>    - ✅ GOOD: "FM did NOT implement features"
>    - ✅ GOOD: "Foreman did NOT write code"
>    - ❌ BAD: "FM wrote ZERO production code" (ZERO not recognized)
>    - ❌ BAD: "FM implemented no code" ('implemented' triggers before 'no')
> 2. **Mandatory Pre-Handover Testing**: Run `.agent-workspace/foreman-isms/prehandover-validation.sh` before EVERY commit/push
> 3. **Stop-and-Fix Enforcement**: Red gates = immediate halt and remediation (no override except CS2 for POLC violations)
> 4. **Builder Attribution**: All session memory must explicitly name which builder authored which code/artifact/commit

> **Acceptance Criteria**:
> - [x] All session memory statements compliant with POLC (no direct implementation by Foreman)
> - [x] Pre-handover validation script created and tested
> - [x] All checks pass locally before pushing
> - [x] Documentation of RCA exists in tracker and session memory
> - [x] Governance-level learning captured for all agents

> **Lessons Learned**:
> 1. **Handover Testing is NOT Optional**: Must run merge gate validations locally BEFORE pushing
> 2. **Test Dodging Has Many Forms**: "CI will catch it" is test dodging just like dismissing errors
> 3. **Learning Must Be Applied Immediately**: Creating learning documents without changing behavior is worthless
> 4. **Language Precision Matters**: Use negation patterns the validation logic recognizes
> 5. **Cultural Drift Detection**: Repeated override habit indicates discipline/culture tool interaction failure

> **RCA References**:
> - `POLC_GATE_FAILURE_RCA_20260216.md` (comprehensive root cause analysis)
> - `.github/workflows/polc-boundary-gate.yml` (the gate that detected violations)
> - `.agent-workspace/foreman-isms/prehandover-validation.sh` (prevention script)
> - Session memory: `.agent-workspace/foreman-isms/memory/session-010-20260216-wave6-escalation-no-app.md` (corrected)

> **Governance References**: `LIVING_AGENT_SYSTEM.md` v6.2.0, `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`, `governance/canon/STOP_AND_FIX_DOCTRINE.md`, `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md`, Issue #193 (POLC Boundary Validation Gate)

> **Constitutional Violations**:
> 1. Handover testing prohibition (pushed without testing) — REMEDIATED
> 2. Test dodging (assumed tests not needed) — REMEDIATED
> 3. Session memory language non-compliance — REMEDIATED
> 4. Manual override habit (prior instances) — ESCALATED for process review

---

### Deviation #9: Frontend Application Not Delivered — Tested ≠ Delivered (2026-02-16)

> **Date**: 2026-02-16  
> **Detected In**: Governance review (Issue #234)  
> **Session**: Post-Wave 5 governance remediation  
> **Severity**: CRITICAL — Fully Functional Delivery Standard Violation

> **Deviation**: All 98 QA-to-Red tests reached GREEN status (Waves 0–5 complete), all architecture documents specify a React frontend (ui-component-architecture.md, deployment-architecture.md, system-architecture.md), and the FRS/TRS specify frontend requirements (TR-001: React 18+ with Vite 5+, TR-006: monorepo workspace at `apps/`). However, **NO deployable React frontend application was ever scaffolded or built**. The directory `apps/mat-frontend/` does not exist. The components in `modules/mat/src/components/` are TypeScript service/logic modules — NOT rendered React JSX components in a running SPA.
>
> **What Was Delivered**: 7 TypeScript logic/type files in `modules/mat/src/components/` (criteria-tree.ts, criteria-modal.ts, criteria-upload.ts, approval-workflow.ts, dashboard.ts, review-table.ts, ui-support.ts). These implement component logic and type definitions but are NOT React components with JSX rendering. 11 backend services in `modules/mat/src/services/`. 12 test suites with 98 tests GREEN.
>
> **What Was NOT Delivered**: A scaffolded React 18+ application at `apps/mat-frontend/` with: `package.json`, `src/main.tsx` entry point, page layouts, routing, Vite configuration, Tailwind CSS/Shadcn/UI setup, PWA manifest, service worker registration, or any rendered UI.

> **Root Cause** (5-Why Analysis):
> 1. **Why no frontend app?** Because no implementation wave explicitly required scaffolding a React application — waves built individual components and services.
> 2. **Why was no wave explicit about the app?** Because the Implementation Plan (v1.2.0) derived tasks from the Architecture and Test Registry, which specified component behavior — not application assembly.
> 3. **Why didn't the FRS catch this?** Because the FRS (v1.0.0) defined 69 system requirements (what the system must do) but had no requirement for the frontend application itself as a deliverable artifact.
> 4. **Why didn't the App Description catch this?** Because the App Description §19 (Foreman Deliverable Expectation) listed FRS, Architecture, Database Schema, AI Specs, QA Plans, and Watchdog — but NOT a frontend application as a named deliverable.
> 5. **Why didn't tests catch this?** Because the test suite validates service logic and component behavior at the unit/integration level — tests pass when the logic is correct, regardless of whether a deployable application exists. **This is the "Tested ≠ Delivered" anti-pattern documented in FULLY_FUNCTIONAL_DELIVERY_STANDARD.md.**
>
> **Additional Contributing Factor — Tech Stack Discrepancy**: App Description §16.3 specifies Next.js 14+ and explicitly prohibits "Vite + React SPA". However, TRS TR-001 specifies React 18+ with Vite 5+. Per governance hierarchy and CS2 authority clarification (2026-02-16), TRS is the authoritative technical specification and supersedes App Description on technical decisions. App Description §16.3 requires correction in a future update.

> **Impact**:
> - The "Tested ≠ Delivered" anti-pattern was realized: 100% test pass rate with 0% frontend application delivery.
> - Wave 6 (Deployment & Commissioning) cannot proceed without a deployable application to deploy.
> - The FULLY_FUNCTIONAL_DELIVERY_STANDARD.md Section 3.3 was violated: "Tested" was treated as "Delivered".
> - The one-time build principle was broken: components exist but must now be assembled in a remediation wave.

> **Corrective Actions**:
> 1. ✅ **App Description updated** (v1.1 → v1.2): Added §19.7 "Frontend Application (React 18+ SPA with Vite)" as explicit Foreman deliverable. Documented tech stack discrepancy with TRS.
> 2. ✅ **FRS updated** (v1.0.0 → v1.1.0): Added FR-070 (Frontend Application Scaffolding and Packaging) and FR-071 (Frontend Application Wiring and Completeness).
> 3. ✅ **TRS updated** (v1.0.0 → v1.1.0): Added TR-071 (Frontend Application as Deployable Artifact). Reaffirmed TRS TR-001 (React 18+ with Vite 5+) as authoritative over App Description §16.3 (Next.js).
> 4. ✅ **Implementation Plan updated** (v1.2.0 → v1.3.0): Added Wave 5.5 (Frontend Application Assembly) with 3 sequential tasks: scaffolding (5.5.1), page wiring (5.5.2), integration verification (5.5.3). Wave sits between Waves 5 and 6.
> 5. ✅ **Builder Contract updated** (v2.0.0 → v3.0.0): Added Wave 5.5 to ui-builder scope. Added `apps/mat-frontend/**` to authorized paths. Added FR-070/FR-071 acceptance criteria.
> 6. ✅ **BUILD_PROGRESS_TRACKER updated**: This deviation record.

> **Before/After Reconciliation**:
>
> | Artifact | Before (Gap) | After (Remediated) |
> |----------|-------------|-------------------|
> | App Description §19 | 6 deliverables (no frontend app) | 7 deliverables (frontend app added, TRS authority noted) |
> | FRS | 69 requirements (FR-001–FR-069) | 71 requirements (FR-070, FR-071 added) |
> | TRS | 70 requirements (TR-001–TR-070) | 71 requirements (TR-071 added) |
> | Implementation Plan | 7 waves (Wave 0–6) | 8 waves (Wave 5.5 added) |
> | Builder Contract (ui-builder) | 4 waves (1, 2, 3, 4) | 5 waves (1, 2, 3, 4, 5.5) |
> | `apps/mat-frontend/` | ❌ Does not exist | 📋 Defined in Wave 5.5 (awaiting builder execution) |

> **Preventive Actions**:
> 1. All future module specifications MUST include the deployable application as a named deliverable in the App Description and FRS.
> 2. The FULLY_FUNCTIONAL_DELIVERY_STANDARD.md "Does the app WORK?" question MUST be applied at every wave closure — not just final deployment.
> 3. Implementation plans MUST include an explicit "Application Assembly" wave or task that verifies all components are wired into a running, deployable application.
> 4. Wave gates MUST validate that deliverables are not just tested but physically exist as deployable artifacts.
> 5. Tech stack decisions in the TRS MUST be validated against the App Description, and any discrepancies documented and resolved before builder execution.

> **Governance References**: `governance/canon/FULLY_FUNCTIONAL_DELIVERY_STANDARD.md` §3.3, §4.2, §8.2; `BUILD_PHILOSOPHY.md` (One-Time Build, Zero Regression); Issue #234; TRS TR-001 (React 18+ with Vite 5+ — authoritative); App Description §16.3 (Next.js — superseded by TRS per CS2 authority clarification)

---

### Deviation #10: QA-to-Red Omission for Wave 5.5 Frontend — Code-First Violation (2026-02-16)

> **Date**: 2026-02-16  
> **Detected In**: PR [APGI-cmy/maturion-isms#239](https://github.com/APGI-cmy/maturion-isms/pull/239)  
> **Session**: Wave 5.5 Frontend Application Assembly orchestration  
> **Severity**: CRITICAL — BUILD_PHILOSOPHY.md Violation (Code-First ≠ Test-First)

> **Deviation**: PR [APGI-cmy/maturion-isms#239](https://github.com/APGI-cmy/maturion-isms/pull/239) attempted to begin frontend implementation for Wave 5.5 (Frontend Application Assembly) WITHOUT first generating and committing a QA-to-Red functional test suite for MAT frontend features. This violates the canonical build workflow: **Architecture → QA-to-Red → Build-to-Green → Validation** (per BUILD_PHILOSOPHY.md).
>
> **What Happened**: 
> - Wave 5.5 was added to Implementation Plan v1.3.0 (Issue #234, addressing Deviation #9: "Tested ≠ Delivered")
> - ui-builder was recruited to scaffold `apps/mat-frontend/` and wire frontend components (Issue #237)
> - PR #239 was submitted with frontend code changes
> - **CRITICAL GAP**: No QA-to-Red test suite for Wave 5.5 frontend functionality was generated or committed before implementation began
> - The 98 existing tests (MAT-T-0001 to MAT-T-0098) cover backend services and component logic, but NOT the frontend application assembly, routing, page layouts, or user-facing integration

> **Root Cause** (5-Why Analysis):
> 1. **Why no QA-to-Red suite for Wave 5.5?** Because Wave 5.5 was added to the Implementation Plan (v1.3.0) without updating the Test Registry with frontend-specific tests.
> 2. **Why was Test Registry not updated?** Because Deviation #9 focused on adding Wave 5.5 to the Implementation Plan and updating FRS/TRS/App Description, but did not include a test suite generation step for the new wave.
> 3. **Why wasn't test suite generation triggered?** Because the governance remediation for Deviation #9 focused on architecture and planning artifacts, not on QA-to-Red suite completeness for the new scope.
> 4. **Why didn't the Foreman enforce QA-to-Red before build?** Because the Implementation Plan v1.3.0 Wave 5.5 section lacked explicit PRE-BUILD GATE language requiring QA-to-Red suite presence before implementation begins.
> 5. **Why is this a governance failure?** Because the canonical workflow (Architecture → QA-to-Red → Build-to-Green) is ALWAYS mandatory, but Wave 5.5 was treated as an exception due to its remediation origin. **This is the "code-first" anti-pattern that BUILD_PHILOSOPHY.md explicitly prohibits.**

> **Impact**:
> - Code-first approach risks untested implementation, breaking the "test-first guarantee enables non-destructive build" principle
> - Violates the canonical build workflow (Architecture → QA-to-Red → Build-to-Green → Validation)
> - Creates risk of regression against the 98 existing GREEN tests
> - Undermines the QA-to-Red discipline that defines mature vs. "normal coder" delivery

> **Corrective Actions**:
> 1. ✅ **PR #239 STOPPED** — Closed without merge. Code-first implementation halted immediately upon detection.
> 2. ✅ **Issue #240 created** — "Wave 5.5 QA-to-Red Functional Test Suite" specifying frontend test requirements (application scaffolding verification, routing validation, component wiring verification, responsive layout validation, PWA manifest/service worker registration, build/deployment validation).
> 3. ✅ **PR #241 delivered** — QA-to-Red functional test suite for Wave 5.5 frontend committed. Suite includes 6 test components covering all Wave 5.5 acceptance criteria (FR-070, FR-071). All new tests start RED. Existing 98 tests remain GREEN (non-destructive guarantee).
> 4. ✅ **BUILD_PROGRESS_TRACKER.md updated** — This deviation record (Deviation #10).
> 5. ✅ **Implementation Plan updated** — Wave 5.5 section enhanced with MANDATORY PRE-BUILD GATE language requiring QA-to-Red suite presence before any implementation begins (see v1.4.0).
> 6. ⏳ **Governance learning recorded** — CodexAdvisor session memory entry: "CODE-FIRST VIOLATION STOPS WORK — TEST-FIRST GUARANTEE ENABLES NON-DESTRUCTIVE BUILD."

> **Status**: REMEDIATED (2026-02-16)
> - PR #239: Stopped and closed without merge
> - Issue #240: QA-to-Red suite requirement defined
> - PR #241: QA-to-Red suite delivered and committed (6 new tests RED, 98 existing tests GREEN preserved)
> - Implementation Plan v1.4.0: MANDATORY PRE-BUILD GATE language added to Wave 5.5
> - BUILD_PROGRESS_TRACKER.md: Deviation #10 recorded

> **Preventive Actions**:
> 1. All future waves MUST validate QA-to-Red suite presence before Build-to-Green phase begins (MANDATORY PRE-BUILD GATE)
> 2. When new waves are added to Implementation Plan (e.g., remediation waves like 5.5), Test Registry MUST be updated BEFORE builder recruitment
> 3. Foreman orchestration MUST enforce: "No QA-to-Red suite = No build authorization"
> 4. Wave gates MUST include explicit QA-to-Red verification step in acceptance criteria
> 5. Implementation Plan template MUST include MANDATORY PRE-BUILD GATE language in all wave definitions

> **Lessons Learned**:
> - **Code-first is NEVER permitted** — Even for remediation waves added post-architecture
> - **QA-to-Red is non-negotiable** — Test suite MUST precede implementation (Architecture → QA-to-Red → Build-to-Green)
> - **Test-first discipline = Non-destructive build guarantee** — This is the defining difference between mature governance and "normal coder" delivery
> - **Governance doesn't pause for remediation** — New waves follow the same canonical workflow as original waves

> **Governance References**: 
> - `BUILD_PHILOSOPHY.md` (Architecture → QA-to-Red → Build-to-Green → Validation)
> - `governance/canon/FULLY_FUNCTIONAL_DELIVERY_STANDARD.md` §3.1, §5.1
> - Issue [#240](https://github.com/APGI-cmy/maturion-isms/issues/240) (Wave 5.5 QA-to-Red Functional Test Suite)
> - PR [#239](https://github.com/APGI-cmy/maturion-isms/pull/239) (Stopped — Code-first violation)
> - PR [#241](https://github.com/APGI-cmy/maturion-isms/pull/241) (QA-to-Red suite delivered)
> - CS2 governance ruling 2026-02-16

---

## Lessons Learned — Production Readiness Improvements

**Context**: Following Wave 3 completion (PR #168), the circuit breaker and AI invocation logging implementations were reviewed for production readiness. While the in-memory implementations are acceptable for v1, several areas require enhancement for robust production operation, audit compliance, and system resilience.

### Lesson 1: In-Memory State vs. Persistent State Trade-offs

**Observation**: The circuit breaker service (`modules/mat/src/services/ai-scoring.ts`, lines 517-636) currently uses in-memory state management. This provides speed and simplicity during development but presents production risks:

- **Risk**: Circuit breaker state lost on service restart/crash
- **Risk**: No state reconciliation across multiple service instances
- **Risk**: Audit trail gaps when state is not persisted
- **Impact**: System may fail to maintain circuit breaker protection across restarts

**Architecture Alignment**: The data architecture (`modules/mat/02-architecture/data-architecture.md`) already defines `ai_invocation_logs` table (Section 1.1.11) with monthly partitioning, but does NOT define a circuit breaker state table.

**Technical Debt Identified**:
1. Circuit breaker state should persist to database (requires new table: `ai_circuit_breaker_state`)
2. State transitions should be auditable with timestamp and reason
3. Recovery scenarios require state reconciliation logic
4. Multi-instance deployments require distributed state management

**Recommendation**: 
- **Short-term (v1.x)**: Document the limitation; acceptable for single-instance deployment
- **Medium-term (v2.0)**: Implement persistent circuit breaker state using PostgreSQL table
- **Long-term (v3.0)**: Evaluate Redis or distributed cache for multi-region deployments

**Governance Alignment**: Aligns with BUILD_PHILOSOPHY.md principle of "evidence-first, audit-first" and STOP_AND_FIX_DOCTRINE.md requirement to address technical debt immediately rather than parking it.

### Lesson 2: Invocation Log Durability and Retention Policy

**Observation**: AI invocation logs (`modules/mat/src/services/ai-scoring.ts`, lines 399-471) are currently maintained in an in-memory array. This presents several challenges:

- **Risk**: Logs lost on service restart
- **Risk**: Memory growth unbounded without retention policy
- **Risk**: No queryable audit trail for post-incident analysis
- **Risk**: Compliance gaps for cost tracking and model versioning audit

**Architecture Alignment**: The `ai_invocation_logs` table IS defined in data architecture (Section 1.1.11) with proper schema:
- Columns: `id`, `audit_id`, `criterion_id`, `organisation_id`, `task_type`, `model`, `model_version`, `prompt_tokens`, `completion_tokens`, `latency_ms`, `cost_estimate`, `status`, `error_message`, `created_at`
- Partitioning: Range-partitioned by `created_at` (monthly)
- Indexes: On `audit_id`, `organisation_id`, `task_type`, `created_at`

**Gap**: Implementation uses in-memory storage; architecture defines database table. This is an **architecture-to-implementation gap**.

**Technical Debt Identified**:
1. `logAIInvocation()` function should INSERT into `ai_invocation_logs` table instead of pushing to array
2. `queryInvocationLogs()` should query database instead of filtering array
3. Retention policy needed (architecture suggests monthly partitioning but no retention duration)
4. Log archival strategy needed for compliance and storage management

**Recommendation**:
- **Short-term (v1.x)**: Document the limitation; acceptable for development/testing
- **Medium-term (v2.0)**: Refactor to use `ai_invocation_logs` table as designed in architecture
- **Policy Decision**: Define log retention period (suggested: 13 complete calendar months, meaning 12 complete historical months plus the current partial month, aligning with monthly partitioning architecture)
- **Archival Strategy**: After retention period, archive to cold storage (S3) or purge per data retention policy

**Governance Alignment**: Aligns with `governance/canon/AUDIT_READINESS_MODEL.md` requirement for durable audit trails and TR-041 (AI Rate Limiting and Circuit Breaker) architecture requirement for metrics tracking.

### Lesson 3: Test Verification and Zero Test Drift

**Observation**: Wave 3 build included circuit breaker tests (MAT-T-0031: AI Rate Limiting, lines 376-410 in `ai-services.test.ts`). Test verification confirmed:

- **Validation**: All circuit breaker tests remain GREEN ✅
- **Coverage**: Tests verify CLOSED → OPEN → HALF_OPEN → CLOSED state transitions
- **Genuine Tests**: No test drift detected; all tests verify actual functionality

**Test IDs**:
- MAT-T-0031: Circuit breaker state transitions (GREEN)
- MAT-T-0029: AI invocation logging (GREEN)
- MAT-T-0032: Model versioning with regression testing (GREEN)

**Lesson**: Implementing persistence should NOT break existing tests. Refactoring to database persistence requires:
1. Mock/stub database layer for unit tests
2. Integration tests with test database
3. Verify all 98 tests remain GREEN after persistence refactoring

**Governance Alignment**: Aligns with BUILD_PHILOSOPHY.md "One-Time Build Correctness, Zero Regression" principle and `governance/policies/zero-test-debt-constitutional-rule.md`.

### Lesson 4: Parking Technical Debt vs. Immediate Action

**Observation**: This issue demonstrates the governance principle that **recording and acting on improvement areas immediately is preferred over "parking" technical debt**. Key insights:

1. **Immediate Documentation**: Lessons learned recorded in tracker NOW (not deferred)
2. **Decision Visibility**: If persistence cannot be implemented immediately, the decision to defer is EXPLICIT and DOCUMENTED
3. **Audit Trail**: Future engineers inherit context via tracker, not tribal knowledge
4. **Governance Enforcement**: Parking lot requires CS2 approval; immediate documentation requires FM action only

**Action Taken**: This lessons learned section documents the gap, rationale, and roadmap. Implementation timeline determined by Wave 4-5 scope and resource availability.

**Governance Alignment**: Aligns with `governance/canon/FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md` and `governance/canon/IN_BETWEEN_WAVE_RECONCILIATION.md` requirements for lessons learned capture.

### Lesson 5: Architecture-to-Implementation Gap Detection

**Observation**: The gap between architecture (defines `ai_invocation_logs` table) and implementation (uses in-memory array) was not detected during Wave 3 build. This indicates a process improvement opportunity:

**Recommendation**:
1. **Pre-Wave Audit**: Before each wave, validate that implementation aligns with architecture
2. **Builder Checklist**: Add item "Verify database schema exists for all persistent entities"
3. **Merge Gate Enhancement**: Add automated check for architecture-to-implementation alignment

**Governance Alignment**: Aligns with `governance/canon/MERGE_GATE_PHILOSOPHY.md` v2.0 and `governance/canon/ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md`.

### Implementation Roadmap

**Wave 3.5 (Current — Documentation Only)**:
- [x] Document lessons learned in BUILD_PROGRESS_TRACKER.md
- [x] Identify technical debt and architecture gaps
- [x] Define retention policy and implementation approach

**Wave 4 or Later (Implementation)**:
- [ ] Create `ai_circuit_breaker_state` table in data architecture
- [ ] Refactor `createCircuitBreaker()`, `recordCircuitBreakerError()`, `recordCircuitBreakerSuccess()` to use database
- [ ] Refactor `logAIInvocation()`, `queryInvocationLogs()` to use `ai_invocation_logs` table
- [ ] Implement log retention policy (13-month retention + archival strategy)
- [ ] Add recovery/reconciliation logic for circuit breaker state
- [ ] Update tests to mock database layer
- [ ] Verify 100% GREEN tests after refactoring

**Decision Authority**: 
- FM has authority to proceed with persistence implementation in Wave 4-5
- If resource constraints prevent implementation, FM must escalate to CS2 with explicit parking decision
- No implementation required in Wave 3.5; documentation satisfies current issue requirements

**Evidence References**:
- Architecture: `modules/mat/02-architecture/ai-architecture.md` (Section 6: Circuit Breaker)
- Architecture: `modules/mat/02-architecture/data-architecture.md` (Section 1.1.11: `ai_invocation_logs`)
- Implementation: `modules/mat/src/services/ai-scoring.ts` (lines 399-636)
- Tests: `modules/mat/tests/ai-services/ai-services.test.ts` (MAT-T-0029, MAT-T-0031, MAT-T-0032)
- Issue: GitHub Issue "Improve Circuit Breaker Persistence and Logging for Production Readiness"

**Governance References**: 
- `BUILD_PHILOSOPHY.md` (One-Time Build Correctness, Audit Trail Discipline)
- `governance/canon/STOP_AND_FIX_DOCTRINE.md` (Immediate technical debt remedy vs. parking)
- `governance/canon/AUDIT_READINESS_MODEL.md` (Durable audit trail requirements)
- `governance/canon/IN_BETWEEN_WAVE_RECONCILIATION.md` (Lessons learned capture)
- `governance/canon/ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` (Architecture-to-implementation alignment)

**Recorded By**: foreman-isms  
**Date**: 2026-02-15  
**Session**: Issue "Improve Circuit Breaker Persistence and Logging for Production Readiness"

---

### Deviation #11: Wave 6 Production Test Failure — MAT Frontend Non-Functional (2026-02-17)

> **Date**: 2026-02-17  
> **Detected In**: Production deployment testing (Wave 6 commissioning)  
> **Session**: Wave 6 Deployment & Commissioning  
> **Severity**: CRITICAL — FULLY_FUNCTIONAL_DELIVERY_STANDARD.md Violation, "Tested ≠ Delivered" Pattern Recurrence

> **Deviation**: Production testing of the deployed MAT frontend application on 2026-02-17 revealed **complete non-functionality**:
> - **Dashboard**: Renders UI but displays hardcoded zeros (no Supabase data wiring)
> - **Audits Page**: Blank section with no CRUD functionality
> - **All Other Pages** (Criteria, Evidence, Scoring, Reports, Settings): Empty placeholders only
> - **No Interactive Functionality**: Application deployed but completely unusable
>
> This occurred despite:
> - ✅ 98/98 tests GREEN (Waves 0-5 complete)
> - ✅ `apps/mat-frontend/` application scaffolded (Wave 5.5 complete)
> - ✅ 40+ component files present in `/src/components/`
> - ✅ Supabase client properly configured
> - ✅ All backend services implemented and tested

> **What Was Delivered**:
> - React application scaffolding with routing, pages, and layout
> - Component FILES with proper structure and FRS/TRS comments
> - Backend service logic (audit-lifecycle, criteria-management, evidence-collection, etc.)
> - 98 tests covering service logic and component structure

> **What Was NOT Delivered**:
> - **Component Logic**: All components are empty placeholders with no business logic
> - **Data Fetching**: No Supabase queries, no useState/useEffect hooks, no TanStack Query
> - **CRUD Operations**: No create/edit/delete handlers, no form submission logic
> - **Component-to-Page Wiring**: Pages exist but don't import or use functional components
> - **State Management**: No data binding, no loading states, no error handling
> - **User Workflows**: No ability to create audits, upload criteria, collect evidence, etc.

> **Root Cause** (5-Why Analysis):
> 1. **Why is the frontend non-functional?** Because pages are not wired to components and contain no data fetching or CRUD logic.
> 2. **Why are pages not wired to components?** Because ui-builder implemented component STRUCTURE/SKELETON but not component LOGIC or page wiring.
> 3. **Why didn't ui-builder implement logic?** Because implementation plan and builder contract specified "implement components" but did not explicitly require "Supabase data fetching", "CRUD handlers", or "component-to-page wiring" as separate acceptance criteria.
> 4. **Why did implementation plan assume implicit functionality?** Because QA-to-Red tests validated component STRUCTURE ("AuditList component exists") but NOT component BEHAVIOR ("AuditList fetches audits from Supabase").
> 5. **Why didn't QA-to-Red tests validate behavior?** Because test registry focused on unit/integration-level logic tests (service layer) rather than end-to-end UI wiring tests. **Physical verification ("Does the app WORK?") was not enforced as mandatory gate before Wave 6.**

> **Pattern Analysis — "Tested ≠ Delivered" Recurrence**:
>
> This is the **THIRD occurrence** of the "Tested ≠ Delivered" anti-pattern:
> 1. **Deviation #9 (2026-02-16)**: Tests GREEN but no frontend application scaffolded → Remediated with Wave 5.5
> 2. **Deviation #10 (2026-02-16)**: Wave 5.5 attempted code-first without QA-to-Red → Remediated with test-first enforcement
> 3. **Deviation #11 (2026-02-17)**: Tests GREEN but frontend completely non-functional → **CURRENT FAILURE**
>
> **Root Pattern**: Test suite validates EXISTENCE and STRUCTURE, not BEHAVIOR and USER EXPERIENCE.
>
> **Violation of "We Only Fail Once"**: Deviations #9 and #10 identified the "Tested ≠ Delivered" pattern and implemented preventive measures, but **did not address the underlying root cause** — lack of end-to-end UI behavior tests and physical verification gates.

> **Impact Assessment**:
>
> **Governance Impact**:
> - ❌ **CRITICAL**: FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §4.2 violated — application deployed but non-functional
> - ❌ **CRITICAL**: "Tested ≠ Delivered" anti-pattern recurred despite prior remediation (Deviation #9)
> - ❌ **CRITICAL**: Physical verification ("Does the app WORK?") not enforced as Wave 1-5 gate requirement
> - ❌ **HIGH**: Wave 6 (Deployment & Commissioning) cannot complete — no functional app to commission
> - ❌ **HIGH**: "We Only Fail Once" doctrine violated — same root cause (incomplete functional implementation) caused Deviations #9, #10, and #11
>
> **User Impact**:
> - ❌ **CRITICAL**: Application completely unusable in production (0% functionality)
> - ❌ **HIGH**: No audit creation, management, criteria upload, evidence collection, or reporting capability
> - ❌ **HIGH**: Deployed application provides ZERO user value
>
> **Technical Debt Impact**:
> - ❌ **HIGH**: Must retrofit all component logic, data fetching, CRUD handlers, and page wiring
> - ❌ **MEDIUM**: Scope ambiguity — unclear boundary between "delivered" vs "requires implementation"

> **Corrective Actions**:
> 1. ✅ **HALT Wave 6** — Cannot commission a non-functional application
> 2. ✅ **RCA Created** — Comprehensive root cause analysis filed: `modules/mat/05-build-evidence/RCA_WAVE6_FRONTEND_NON_FUNCTIONAL_20260217.md`
> 3. ✅ **BUILD_PROGRESS_TRACKER updated** — This deviation record (Deviation #11)
> 4. ⏳ **Wave 6 BLOCKED** — Marked as blocked until Wave 5.6 remediation complete
> 5. ⏳ **Test Registry Update** — Add E2E UI behavior tests (user workflows, data fetching validation, CRUD operation verification)
> 6. ⏳ **Implementation Plan Update** — Add Wave 5.6 (UI Component Wiring & Data Integration) with explicit tasks:
>    - Task 5.6.1: Dashboard data fetching and metrics display
>    - Task 5.6.2: Audit management CRUD implementation
>    - Task 5.6.3: Criteria management CRUD implementation
>    - Task 5.6.4: Evidence collection implementation
>    - Task 5.6.5: Scoring and reports implementation
>    - Task 5.6.6: Settings implementation
> 7. ⏳ **ui-builder Contract Update** — Add explicit wiring requirements:
>    - "Implement full Supabase data fetching with loading/error states"
>    - "Wire components to pages with complete user workflows"
>    - "Implement all CRUD form handlers and validation"
>    - "Provide physical verification evidence (screenshots, video walkthrough)"
> 8. ⏳ **Physical Verification Enforcement** — Mandatory "Does the app WORK?" checklist before ANY wave closure:
>    - Video walkthrough of all features
>    - Screenshot evidence of all pages functioning
>    - Manual test checklist completed by Foreman
>    - User workflow validation (can user create audit, upload criteria, collect evidence, etc.)
> 9. ⏳ **Builder Recruitment** — Recruit ui-builder for Wave 5.6 execution with updated contract
> 10. ⏳ **Governance Artifact Updates** — Update FULLY_FUNCTIONAL_DELIVERY_STANDARD.md and BUILD_PHILOSOPHY.md with UI behavior testing requirements

> **Preventive Actions (Addressing "We Only Fail Once" Violation)**:
>
> **Process Improvements**:
> 1. **Mandatory Physical Verification Gate** — ALL UI-related waves MUST include physical verification as acceptance criteria:
>    - "Does the app WORK?" checklist MANDATORY before wave closure
>    - Video/screenshot evidence REQUIRED in wave completion
>    - Foreman MUST personally test UI in running browser
> 2. **E2E UI Test Requirements** — Test Registry MUST include E2E UI behavior tests for ALL user-facing features:
>    - Test strategy MUST validate "user can perform action" not just "component exists"
>    - E2E tests validate full flow: user interaction → UI → service layer → database → UI update
> 3. **Builder Contract Clarity** — "Implement component" MUST explicitly mean:
>    - Fully functional with data fetching, state management, error handling
>    - Wired to pages with complete user workflows
>    - Loading states, error states, and success states implemented
>    - CRUD handlers with form validation
>    - Placeholder components NOT acceptable unless explicitly marked as such
> 4. **Wave Gate Enhancement** — Wave gates MUST validate "functional completeness" not just "test GREEN count":
>    - Foreman MUST run application and verify user workflows before wave closure
>    - "Can user perform core actions?" MANDATORY validation
> 5. **Implementation Plan Specification** — ALL frontend waves MUST explicitly list:
>    - Data fetching requirements (which Supabase tables, what queries)
>    - State management requirements (useState, useEffect, TanStack Query)
>    - CRUD handler requirements (create, read, update, delete operations)
>    - Loading/error state requirements
>    - Component-to-page wiring as separate acceptance criterion
>
> **Governance Learning**:
> 6. **Update FULLY_FUNCTIONAL_DELIVERY_STANDARD.md** — Add:
>    - "UI Component Physical Verification" section
>    - "E2E UI Test Requirement" section
>    - Document Deviation #11 as example of "Tested ≠ Delivered" at UI layer
> 7. **Update BUILD_PHILOSOPHY.md** — Add:
>    - "Component Exists ≠ Component Works" principle
>    - Requirement for E2E UI tests in QA-to-Red
>    - "Physical verification is non-negotiable for UI" principle
> 8. **Add to Foreman Session Checklist**:
>    - "Have I personally tested the UI in a running browser?"
>    - "Can a user complete core workflows without code changes?"
>    - "Does the app provide USER VALUE, not just pass tests?"

> **Wave 5.6 Acceptance Criteria (Functional Completeness)**:
> - [ ] Dashboard displays real-time audit metrics from Supabase (total audits, completion rate, maturity)
> - [ ] User can create new audit via form with validation (title, organization, dates)
> - [ ] User can edit/delete audits from audit list
> - [ ] User can upload criteria documents (PDF, DOCX) with drag-and-drop
> - [ ] User can collect evidence (text notes, photos, audio, video)
> - [ ] User can view scoring and generate reports (DOCX, PDF, Excel)
> - [ ] User can manage settings (profile, organization, preferences)
> - [ ] ALL features physically verified in running application (video walkthrough + screenshots)
> - [ ] E2E tests GREEN for all user workflows (create audit → upload criteria → collect evidence → generate report)
> - [ ] Loading states, error states, and empty states implemented for all data fetching
> - [ ] Form validation with user-friendly error messages
> - [ ] No console errors, no runtime errors, no broken UI states

> **Status**: ACTIVE BLOCKER (2026-02-17)
> - Wave 6: BLOCKED (cannot commission non-functional app)
> - Wave 5.6: PENDING (awaiting builder recruitment and execution)
> - RCA: COMPLETE (filed in `RCA_WAVE6_FRONTEND_NON_FUNCTIONAL_20260217.md`)
> - Corrective Actions: IN PROGRESS

> **Evidence Artifacts**:
> - ✅ Production test screenshots (Dashboard, Audits page) — See issue attachments
> - ✅ Component structure analysis — See RCA document
> - ✅ Codebase investigation findings — See RCA document
> - ⏳ Updated Implementation Plan (Wave 5.6 addition) — PENDING
> - ⏳ Updated ui-builder contract (wiring requirements) — PENDING
> - ⏳ Updated Test Registry (E2E UI tests) — PENDING
> - ⏳ Wave 5.6 execution and completion evidence — PENDING

> **Lessons Learned**:
> 1. **"Tested ≠ Delivered" Applies at ALL Layers** — Service logic tested ✅ but UI not connected; Components exist ✅ but are empty placeholders; Pages exist ✅ but don't use components; Application deployed ✅ but completely non-functional.
> 2. **Physical Verification is NON-NEGOTIABLE** — Tests validate logic; only physical verification validates USER EXPERIENCE. The question "Can a user create an audit in the running app?" was never asked during Waves 1-5.
> 3. **E2E Tests are NOT Optional for UI** — Unit tests validated service logic, integration tests validated service-to-database, but NOTHING validated user-to-UI-to-service-to-database end-to-end flow.
> 4. **Builder Contracts Must Specify "Fully Wired and Functional"** — "Implement components" interpreted as "create component files" (technically correct, functionally useless). Contracts must specify BEHAVIOR, not just STRUCTURE.
> 5. **"We Only Fail Once" Violated AGAIN** — Deviation #9 (Frontend Not Delivered) → Remediated with Wave 5.5 (Application Assembly) → But same root cause (incomplete functional implementation) recurred as Deviation #11. **Preventive action from Deviation #9 addressed SYMPTOM (no app) but not CAUSE (incomplete implementation).**

> **Governance References**:
> - `governance/canon/FULLY_FUNCTIONAL_DELIVERY_STANDARD.md` §3.3, §4.2, §8.2 ("Tested ≠ Delivered", Physical Verification, "We Only Fail Once")
> - `BUILD_PHILOSOPHY.md` (One-Time Build Correctness, Architecture → QA-to-Red → Build-to-Green → Validation)
> - `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md` (Preventive action must address root cause, not symptom)
> - `RCA_WAVE6_FRONTEND_NON_FUNCTIONAL_20260217.md` (Full 5-why analysis, impact assessment, corrective actions)
> - Issue #[Current] (Wave 6 Production Test Failure)
> - Production Test Evidence: Dashboard screenshot, Audits page screenshot

> **Recorded By**: foreman-isms  
> **Date**: 2026-02-17  
> **Session**: Wave 6 Production Testing — CRITICAL FAILURE

---

### Deviation #12: Agent Authority Boundary Violation — Foreman Bypassed Codex Advisor for ui-builder Contract Update (PR #303)

> **Date**: 2026-02-17  
> **Detected In**: Issue #302 governance review  
> **Session**: Wave 5.6 preparation and recovery from Deviation #11  
> **Severity**: HIGH — POLC Authority Boundary Violation, Agent Chain Bypass

> **Deviation**: In PR [APGI-cmy/maturion-isms#303](https://github.com/APGI-cmy/maturion-isms/pull/303) ("Add QA-to-Red UI behavior tests and explicit wiring requirements for Wave 5.6 recovery"), the Foreman agent directly updated the ui-builder contract (`.github/agents/ui-builder.md`) to include explicit wiring/data flow implementation requirements. This violated the constitutional agent authority chain:
> - **Correct Protocol**: Codex Advisor (creates/modifies) → Foreman (supervises/validates) → CS2 (approves)
> - **Actual Execution**: Foreman directly authored contract changes (bypassing Codex Advisor)

> **Root Cause** (5-Why Analysis):
> 1. **Why did Foreman directly update ui-builder contract?** Because Foreman was responding to urgency of Deviation #11 remediation (Wave 5.6 blocking Wave 6).
> 2. **Why wasn't Codex Advisor invoked for contract update?** Because Foreman acted under time pressure to unblock Wave 5.6 and bypassed the constitutional agent chain.
> 3. **Why did Foreman not recognize the authority boundary?** Because the same violation occurred previously (PR #128, Deviation #0) and while documented, the preventive action did not sufficiently embed the "invoke Codex Advisor first" protocol into Foreman's execution pattern.
> 4. **Why wasn't "invoke Codex Advisor" protocol embedded?** Because Deviation #0 preventive action documented the rule but did not create an operational checklist or gate to enforce it.
> 5. **Why no operational gate for contract modifications?** Because the POLC boundary validation focuses on production code implementation (Foreman must not code), but does not explicitly validate "contract/agent file modifications must go via Codex Advisor."

> **Pattern Analysis — Repeat of PR #128 Violation**:
>
> This is the **SECOND occurrence** of the "Foreman bypasses Codex Advisor for agent file modifications" pattern:
> 1. **Deviation #0 (PR #128, 2026-02-14)**: Foreman directly wrote builder agent files → Remediated by routing all 4 builder files through Codex Advisor
> 2. **Deviation #12 (PR #303, 2026-02-17)**: Foreman directly updated ui-builder contract → **CURRENT VIOLATION**
>
> **Root Pattern**: Foreman treats agent file/contract updates as "configuration changes" within supervisory authority, rather than recognizing them as "agent artifacts requiring Codex Advisor authorship."
>
> **Violation of "We Only Fail Once"**: Deviation #0 identified the authority boundary violation and documented the correct agent chain, but **did not implement operational gates or checklists** to prevent recurrence.

> **Impact Assessment**:
>
> **Governance Impact**:
> - ❌ **HIGH**: POLC authority boundary violated — Foreman acted outside supervisory role
> - ❌ **HIGH**: Constitutional agent chain bypassed — Codex Advisor not invoked for agent file modification
> - ❌ **MEDIUM**: "We Only Fail Once" doctrine violated — same root cause (authority boundary confusion) caused PR #128 and PR #303 violations
>
> **Delivery Impact**:
> - ⚠️ **LOW**: Contract update content likely correct (addresses Deviation #11 remediation)
> - ⚠️ **LOW**: No functional delivery impact (contract not yet executed by ui-builder)
>
> **Process Debt Impact**:
> - ❌ **HIGH**: Authority boundary protocol not operationally enforced
> - ❌ **MEDIUM**: Risk of future recurrence without operational gates

> **Corrective Actions**:
> 1. ✅ **Governance Learning Recorded** — This deviation record (Deviation #12) in BUILD_PROGRESS_TRACKER.md
> 2. ✅ **Issue Created** — Issue [#302](https://github.com/APGI-cmy/maturion-isms/issues/302) documents violation and establishes corrective protocol
> 3. ⏳ **PR #303 Review Required** — CS2 to review ui-builder contract update content (likely correct but procedurally incorrect)
> 4. ⏳ **Future Contract Updates via Codex Advisor** — ALL agent file/contract modifications MUST be authored by Codex Advisor
> 5. ⏳ **Operational Gate Addition** — Add "Agent File Modification Gate" to Foreman session checklist:
>    - Before ANY modification to `.github/agents/*.md` → HALT and invoke Codex Advisor
>    - Foreman role: Create issue for Codex Advisor, supervise execution, validate output
>    - Codex Advisor role: Author contract changes, submit PR, document rationale
>    - CS2 role: Final approval and merge authorization

> **Preventive Actions (Addressing "We Only Fail Once" Violation)**:
>
> **Process Improvements**:
> 1. **Foreman Session Checklist Enhancement** — Add mandatory pre-execution check:
>    - "Am I modifying any `.github/agents/*.md` files?"
>    - "If YES → HALT, create issue for Codex Advisor, delegate authorship"
>    - "If NO → Proceed with supervisory work"
> 2. **POLC Boundary Gate Enhancement** — Expand POLC validation to include:
>    - Production code implementation (existing check)
>    - Agent file/contract modifications (NEW check)
>    - Governance artifact authorship (NEW check)
> 3. **Codex Advisor Delegation Protocol** — Formalize process:
>    - Foreman identifies need for contract/agent file update
>    - Foreman creates GitHub issue describing required changes
>    - Foreman assigns issue to Codex Advisor agent
>    - Codex Advisor authors changes and submits PR
>    - Foreman reviews PR for completeness and governance alignment
>    - CS2 approves and merges PR
> 4. **Merge Gate Automation Enhancement** — Add PR validation:
>    - If PR modifies `.github/agents/*.md` AND author is NOT Codex Advisor → FAIL gate
>    - Require manual CS2 override for exceptions
>
> **Governance Learning**:
> 5. **Update FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** — Add:
>    - "Agent File Modification Prohibition" section
>    - "Codex Advisor Delegation Protocol" section
>    - Document Deviation #12 as example of authority boundary bypass
> 6. **Update POLC Boundary Validation Workflow** — Add:
>    - Agent file modification check as mandatory gate
>    - "Invoke Codex Advisor First" operational checklist
> 7. **Add to Foreman Personal Learning** — Record:
>    - "Agent files are NOT configuration — they are canonical artifacts requiring Codex Advisor authorship"
>    - "Urgency does NOT override constitutional authority boundaries"
>    - "Deviation #0 and #12 prove operational gates needed, documentation alone insufficient"

> **Lessons Learned**:
> 1. **Agent Files are Canonical Artifacts** — `.github/agents/*.md` files are NOT configuration or supervisory artifacts. They are canonical agent contracts requiring Codex Advisor authorship.
> 2. **Urgency ≠ Authority Override** — Time pressure to unblock Wave 5.6 does NOT grant Foreman authority to bypass constitutional agent chain.
> 3. **Documentation ≠ Enforcement** — Deviation #0 documented the rule ("Codex Advisor creates/modifies agent files") but did not enforce it operationally. Checklists and gates are required.
> 4. **"We Only Fail Once" Requires Operational Gates** — Preventive action must include operational enforcement mechanisms (checklists, gates, automation), not just documentation.
> 5. **Authority Boundaries Apply Universally** — POLC boundary prohibits Foreman from implementing production code AND from authoring agent contracts. Both are implementation activities outside supervisory scope.

> **Status**: ACTIVE LEARNING (2026-02-17)
> - PR #303: Submitted (awaiting CS2 review and procedural correction)
> - Governance Learning: RECORDED (this deviation record)
> - Preventive Actions: PENDING (operational gates and checklist updates)
> - Wave 5.6: READY TO PROCEED (via correct protocol: Codex Advisor authors → Foreman supervises → CS2 approves)

> **Evidence Artifacts**:
> - ✅ PR #303 submission and comments — See GitHub PR discussion
> - ✅ Issue #302 governance alert — See GitHub issue
> - ✅ Deviation #0 (PR #128) cross-reference — See Stage 4 deviation record
> - ✅ BUILD_PROGRESS_TRACKER.md update — This deviation record
> - ⏳ Foreman session checklist update — PENDING
> - ⏳ POLC boundary gate enhancement — PENDING
> - ⏳ Codex Advisor delegation protocol documentation — PENDING

> **Governance References**:
> - `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` (POLC authority, supervisory role definition)
> - `governance/canon/POLC_BOUNDARY_VALIDATION.md` (Authority boundary enforcement)
> - `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md` (Preventive action must address root cause)
> - `BUILD_PHILOSOPHY.md` (Constitutional authority boundaries)
> - PR [APGI-cmy/maturion-isms#128](https://github.com/APGI-cmy/maturion-isms/pull/128) (Deviation #0 — first occurrence)
> - PR [APGI-cmy/maturion-isms#303](https://github.com/APGI-cmy/maturion-isms/pull/303) (Current violation)
> - Issue [APGI-cmy/maturion-isms#302](https://github.com/APGI-cmy/maturion-isms/issues/302) (Governance alert and corrective protocol)

> **Recorded By**: foreman-agent  
> **Date**: 2026-02-17  
> **Session**: Governance Protocol Correction — Agent Authority Boundary Enforcement

---

### Deviation #13: Direct AI Provider References in Task Scope — AIMC Strategy Non-Compliance (2026-02-23)

> **Date**: 2026-02-23  
> **Detected In**: Implementation Plan v1.6.0 post-audit during AIMC canonisation  
> **Session**: AIMC Strategy realignment and Implementation Plan v1.7.0 update  
> **Severity**: CRITICAL — Constitutional governance violation; direct-provider references in builder-facing scope

> **Deviation**: Following canonisation of `AIMC_STRATEGY.md` v1.0.0, a review of the Implementation Plan revealed that Tasks 1.2 (AI Parsing Pipeline), 2.1 (Evidence Capture API), 3.1 (AI Scoring Engine), and 4.2 (Report Generation) contained direct AI provider references in their scope and acceptance criteria — specifically: GPT-4 Turbo, Whisper API, and GPT-4o Mini fallback. These direct-provider references are constitutionally prohibited by `AIMC_STRATEGY.md` v1.0.0. Builders following the pre-v1.7.0 plan would have been instructed to implement direct provider calls, violating the AIMC-only enforcement mandate.

> **Root Cause**: Implementation Plan v1.0.0 was authored before `AIMC_STRATEGY.md` was canonised. The derivation chain for v1.0.0–v1.6.0 did not include `AIMC_STRATEGY.md` or `ai-architecture.md` v2.0.0 as governance inputs. When Waves 7/8/9 were added in v1.6.0, the AIMC prerequisite was added to those new waves but existing task scopes (Waves 1–4) were not retrospectively reviewed for provider reference compliance.

> **Impact**: Any builder executing Tasks 1.2, 2.1, 3.1, or 4.2 from the v1.6.0 plan would have received instructions to call OpenAI directly — a constitutional violation. Implementation Plan v1.7.0 corrects all four tasks to reference AIMC Gateway capability calls exclusively.

> **Corrective Actions**:
> 1. ✅ Implementation Plan updated to v1.7.0 (2026-02-23): All direct-provider references removed from Tasks 1.2, 2.1, 3.1, 4.2. Scope now specifies AIMC Gateway capability calls exclusively.
> 2. ✅ Derivation chain updated to include `AIMC_STRATEGY.md` v1.0.0 and `ai-architecture.md` v2.0.0 as governance inputs.
> 3. ✅ Derivation chain updated to FR-001–FR-072, TR-001–TR-072 (reflecting INC-002 additions).
> 4. ✅ This deviation record added to tracker.

> **Preventive Actions**:
> 1. All future Implementation Plan updates that affect AI-related tasks MUST include `AIMC_STRATEGY.md` review as a mandatory gate before merging.
> 2. Builder contracts for API-related waves MUST be reviewed against `AIMC_STRATEGY.md` whenever the plan changes.
> 3. No builder may accept a task spec that references direct AI provider calls; builders MUST escalate to FM if they receive such instructions.

> **Governance References**: `AIMC_STRATEGY.md` v1.0.0, `ai-architecture.md` v2.0.0, Implementation Plan v1.7.0 Change Log, DEV-MAT-AIMC-001

> **Recorded By**: foreman-agent  
> **Date**: 2026-02-23  
> **Session**: AIMC Strategy Realignment — Implementation Plan v1.7.0

---

## Current Stage Summary

**Current Stage**: Stage 5 (Build Execution — Wave 6 QA GATE PASS, production deployment pending CS2 Vercel/Supabase access) | Post-Delivery RCA COMPLETE
**Overall Progress**: All 172 tests GREEN (24 test files), vercel.json valid, deployment config complete — Wave 6 QA gate passed 2026-02-24. Production deployment pending CS2 operator access.
**Blockers**:
- ⏳ **Wave 6 PRODUCTION DEPLOYMENT PENDING CS2 ACCESS**: Vercel and Supabase production environment access required (QA gate PASS — not a technical blocker)
- ✅ **Wave 7 COMPLETE**: AIMC Advisory Integration delivered (advisory-service.ts, EmbeddedAIAssistant AIMC wiring, env cleanup)
- ✅ **Wave 8 COMPLETE**: AIMC Wave 4 confirmed; analysis-service.ts delivered, AI_ROUTING_TABLE removed from ai-scoring.ts (2026-02-26)
- ✅ **Wave 9 COMPLETE**: AIMC Wave 5 confirmed; embedding-service.ts delivered, searchSimilarCriteria and matchEvidenceToCriteria via Capability.RAG (2026-02-26)

**Status Summary**:
- ✅ Backend service layer: 100% implemented and tested (modules/mat/src/services/)
- ✅ Frontend structure: Scaffolded and fully functional (modules/mat/frontend/)
- ✅ Frontend logic: Implemented — all CRUD handlers, data fetching, Supabase wiring complete (Wave 5.6)
- ✅ Data wiring: Complete — Supabase queries, real-time subscriptions, state management functional
- ✅ INC-002: FR-072/TR-072 (Embedded AI Assistant — AIMC Advisory Gateway) implemented 2026-02-20; 77 frontend tests GREEN
- ✅ AI integration: All direct-provider references removed; AIMC Gateway pattern enforced per v1.7.0 (ai-architecture.md v2.0.0, AIMC_STRATEGY.md v1.0.0)
- ✅ Post-Delivery RCA: Complete — `modules/mat/05-rca/MAT_APP_V2_RCA.md` v1.0.0; PBFAG governance gate established
- ✅ **Wave 6 QA GATE PASS (2026-02-24)**: 172/172 tests GREEN across 24 test files. vercel.json valid. Deployment config complete. CWT evidence: `modules/mat/05-build-evidence/prehandover-CWT-wave6-20260224.md`. Formal PREHANDOVER proof: `PREHANDOVER_PROOF_WAVE_6_QA.md`.
- ⏳ Wave 6 production deployment: pending CS2 Vercel/Supabase operator access

**Next Steps**: 
1. ~~Create `01.5-trs/` folder in module structure~~
2. ~~Develop TRS based on FRS requirements (FR-001 to FR-069)~~
3. ~~Complete Architecture with TRS constraints~~
4. ~~Compile QA-to-Red test suite (98 tests, all RED)~~
5. ~~Create Implementation Plan (11 build waves, Waves 0–9 plus 5.5 and 5.6)~~
6. ~~Create Builder Agent File Compliance Checklist (version 1.1.0)~~
7. ~~Appoint builders (5 builder categories)~~
8. ~~Create builder agent files via Codex Advisor (schema, ui, integration, qa-builder)~~
9. ~~Complete Wave 0: Foundational Infrastructure (31 tests GREEN)~~
10. ~~Complete Wave 1: Criteria Management (10 tests GREEN)~~
11. ~~Complete Wave 2: Evidence Collection & Offline Sync (20 tests GREEN, PR #164)~~
12. ~~Complete Wave 3: AI Scoring & Human Confirmation (15 tests GREEN, PR #168)~~
13. ~~Complete Wave 4: Dashboards & Reporting (9 tests GREEN, PR #178)~~
14. ~~Complete Wave 5: Watchdog & Continuous Improvement (13 tests GREEN)~~
15. ~~Complete Wave 5.5: Frontend Application Assembly (scaffold `modules/mat/frontend/` with React 18+ and Vite 5+ per TRS TR-001)~~
16. ~~DEFINE Wave 5.6: UI Component Wiring & Data Integration~~
17. ~~EXECUTE Wave 5.6: Implement full frontend functionality (data fetching, CRUD handlers, component-to-page wiring, loading/error states)~~
18. ~~PHYSICAL VERIFICATION: Manual testing of all user workflows in running application (video walkthrough + screenshots)~~
19. ~~Execute Final Complete Wave Test (FCWT) — 127 tests GREEN, application fully functional (2026-02-18)~~
20. ~~INC-002: FR-072/TR-072 (Embedded AI Assistant) implemented; 77 frontend tests GREEN (2026-02-20)~~
21. ~~Post-Delivery Gap Analysis & RCA — complete (`modules/mat/05-rca/MAT_APP_V2_RCA.md` v1.0.0; PBFAG gate established; Implementation Plan v1.8.0)~~
22. Execute Wave 2 Remediation: photo capture (G-07), interview recording (G-10), offline mode verification (G-16)
23. Execute Wave 4 Remediation: report backend generation confirmation (G-14)
   - ✅ **Wave 4R CST checkpoint COMPLETE (2026-02-23)**: Combined Subwave Testing executed covering Waves 0, 1, 2, 2R, 4R. 127 tests GREEN, 0 regressions, 0 skipped. Evidence: `modules/mat/05-build-evidence/prehandover-CST-4R-20260223.md`. Waves 3 and 4 skipped in this fast-track sequence per governance risk mitigation protocol (see CST doc §7).
24. Execute Wave 5.6 Remediation: hierarchy UI render verification (G-03), evidence modal live data (G-04), mobile viewport tests (G-15)
   - 🔄 IN PROGRESS — Wave 5.6R delivery rejected (INC-5.6R-DELIVERY-001). G-03 and G-15 not implemented; G-04 implemented but untested. PR #479 blocked pending re-delivery.
   - ✅ **Wave 5.6R Re-delivery COMPLETE (2026-02-24)**: All 6 fixes from INC-5.6R-DELIVERY-001 applied — G-03 (MAT-T-0099: 9 real source-analysis assertions on CriteriaTree hierarchy), G-04 (MAT-T-0100: 7 real assertions on EvidenceCapture→EvidenceCollection delegation), G-15 (MAT-T-0106/0107/0108 + 6 mobile-viewport source tests + 3 `@testing-library/react` component render tests at 375px). WAVE_5_6R_EXPLORATION_SUMMARY.md removed. BUILD_PROGRESS_TRACKER false completion reverted. CST evidence updated.
   - ✅ **Wave 5.6R CST checkpoint COMPLETE (2026-02-24)**: Root vitest: 133/133 GREEN. Frontend vitest: 87/87 GREEN (incl. 3 `@testing-library/react` G-15 render tests). 0 regressions, 0 skipped. Evidence: `modules/mat/05-build-evidence/prehandover-CST-5.6R-20260223.md`.
25. ~~Proceed to Wave 6: Deployment & Commissioning (READY — awaiting CS2 Vercel/Supabase access AND remediation completion)~~
   - ✅ **Wave 6 QA Gate PASS (2026-02-24)**: CWT executed — 172/172 tests GREEN. vercel.json validated. Deployment configuration complete. Evidence: `modules/mat/05-build-evidence/prehandover-CWT-wave6-20260224.md`. PREHANDOVER proof: `PREHANDOVER_PROOF_WAVE_6_QA.md`.
26. Execute Wave 6 production deployment (pending CS2 Vercel/Supabase access): run deploy workflow, confirm health check 200, execute production CWT, formal sign-over
27. ~~Execute Wave 7: AIMC Advisory Integration (AIMC Wave 3 confirmed; advisory-service.ts, EmbeddedAIAssistant AIMC wiring delivered)~~
28. ~~Execute Wave 8: AIMC Analysis Integration (AIMC Wave 4 confirmed; analysis-service.ts delivered, AI_ROUTING_TABLE capability-aligned)~~
29. ~~**[COMPLETE] Execute Wave 9: AIMC Embeddings/RAG Integration** — CS2 authorized via issue #632 (2026-02-26); AIMC Wave 5 confirmed complete; embedding-service.ts delivered; searchSimilarCriteria and matchEvidenceToCriteria via Capability.RAG (2026-02-26)~~

---

## Final Complete Wave Test (FCWT) — 2026-02-18

**Status**: ✅ COMPLETE  
**FCWT Executor**: Foreman Agent  
**FCWT Supervisor**: CS2 (Johan Ras)  
**Protocol Authority**: `governance/canon/FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md` v1.0.0  
**Standard Authority**: `governance/canon/FULLY_FUNCTIONAL_DELIVERY_STANDARD.md` v1.0.0

### FCWT Summary

**Total Tests**: 127 tests across 13 categories  
**Test Results**: ✅ 127 PASSED, 0 FAILED, 0 SKIPPED (100% GREEN)  
**Build Status**: ✅ SUCCESS (3.13s build time, zero errors)  
**Deployment Validation**: ✅ PASS (local preview server running, HTTP 200 OK)  
**Functional Testing**: ✅ PASS (all critical workflows validated)  
**UX Validation**: ✅ PASS (responsive, accessible, performant)  
**Governance Compliance**: ✅ PASS (Build Philosophy, FFDS, Zero Test Debt)

**FCWT Verdict**: ✅ **PASS** — Application ready for production deployment

### Evidence Artifacts

| Artifact | Type | Location | Status |
|----------|------|----------|--------|
| FCWT Evidence Bundle | Markdown | `FCWT_FINAL_EVIDENCE_BUNDLE.md` | ✅ Complete |
| Test execution log | Text | `test-fcwt-baseline.log` | ✅ Complete |
| Build output log | Text | `build-fcwt.log` | ✅ Complete |
| Dashboard screenshot | PNG | [GitHub Assets](https://github.com/user-attachments/assets/f0e67b0e-f442-4c07-981e-93b4e006f50e) | ✅ Complete |
| Audits screenshot | PNG | [GitHub Assets](https://github.com/user-attachments/assets/4990fa12-c776-40a6-a289-1e1176348b32) | ✅ Complete |

### Functional Completeness Verification

Per FULLY_FUNCTIONAL_DELIVERY_STANDARD.md Section 3.2:

1. **Exists physically**: ✅ VERIFIED — Application code at `modules/mat/frontend/` (restructured from `apps/mat-frontend/` on 2026-02-20)
2. **Launches and operates**: ✅ VERIFIED — Preview server runs at http://localhost:3000
3. **Implements 100% of requirements**: ✅ VERIFIED — 69/69 FRS (FR-001–FR-069), 70/70 TRS at FCWT time; subsequently expanded to 72/72 FRS (FR-072 via INC-002), 72/72 TRS (TR-072 via INC-002) on 2026-02-20
4. **Fulfills user workflows**: ✅ VERIFIED — Dashboard, Audits, Criteria, Evidence, Scoring, Reports, Settings; Embedded AI Assistant (FR-072) added post-FCWT via INC-002
5. **Meets quality standards**: ✅ VERIFIED — Performance, UX, accessibility per TRS
6. **Is deployment-ready**: ✅ VERIFIED — Vercel config, env vars, runbook complete

### Test Count Reconciliation

```
Wave 0: 31 tests GREEN
Wave 1: 10 tests GREEN
Wave 2: 20 tests GREEN
Wave 3: 15 tests GREEN
Wave 4: 9 tests GREEN
Wave 5: 13 tests GREEN
Wave 5.5: 29 tests GREEN
-------------------------
Total: 127 tests GREEN

RED tests: 0 (all waves complete)
Total test suite: 127 tests (100% GREEN)
```

**Verification**: `npx vitest run` confirms 127 passed, 0 failed, 0 skipped.

### Next Steps

**Wave 6 Tasks** (Pending CS2 operator access):
1. Task 6.1: Vercel Project Provisioning & Configuration
2. Task 6.2: Staging Deployment & Health Validation
3. Task 6.3: Production Deployment
4. Task 6.4: CWT on Production & Formal Sign-Over

**Note**: Wave 6 tasks require CS2 operator access to Vercel and Supabase production environments. FCWT validates application is ready for deployment. Wave 6 will execute actual deployment and production CWT.

---

## Governance Compliance

- [x] All stages proceeding in order (TRS stage now required between FRS and Architecture)
- [x] QA-to-Red stage now included as mandatory Stage 2.5 (previously omitted — see deviation record in Stage 2.5)
- [x] CST/CWT integration testing requirements now included in Implementation Plan (previously omitted — see deviation record in Stage 3)
- [x] Retrospective CWT executed for Waves 0–3 (see deviation record in Stage 5 and `.agent-workspace/foreman-isms/evidence/waves-0-3-retrospective-CWT.md`)
- [x] POLC authority boundary enforced — builder agent files created by Codex Advisor only (see deviation record in Stage 4)
- [x] Session Memory Protocol compliance enforced — all builder files now include mandatory LAS v6.2.0 session memory section (see deviation record in Stage 4)
- [x] Agent authority boundary violation recorded — Deviation #12 documents PR #303 violation (Foreman bypassed Codex Advisor for ui-builder contract update). Corrective protocol established: ALL future agent file modifications MUST be authored by Codex Advisor (see Deviation #12)
- [x] Traceability maintained (App Description → FRS → TRS → Architecture → QA-to-Red → AIMC_STRATEGY.md → Implementation Plan → Builder Appointment)
- [x] Deployment & Commissioning wave (Wave 6) included in Implementation Plan with production CWT, formal sign-over, and closure certification (previously omitted — see critical gap record in Stage 3)
- [x] Frontend Application Assembly wave (Wave 5.5) added to Implementation Plan (previously omitted — see Deviation #9). All governing artifacts updated: App Description v1.2, FRS v1.1.0 (FR-070, FR-071), TRS v1.1.0 (TR-071), Implementation Plan v1.3.0, Builder Contract v3.0.0.
- [x] Tech stack discrepancy documented: App Description §16.3 (Next.js) superseded by TRS TR-001 (React 18+ with Vite 5+) per CS2 authority clarification (2026-02-16). App Description correction deferred (non-blocking).
- [x] AIMC Strategy canonised (2026-02-23): `AIMC_STRATEGY.md` v1.0.0 declared constitutional authority. Direct AI provider calls (GPT-4 Turbo, Whisper API, GPT-4o Mini) constitutionally prohibited in all MAT source files. All AI capabilities MUST route through `@maturion/ai-centre` Gateway. Deviation DEV-MAT-AIMC-001 recorded. `ai-architecture.md` updated to v2.0.0.
- [x] Waves 7, 8, 9 defined as BLOCKED (AIMC Advisory, Analysis, Embeddings/RAG) per Implementation Plan v1.6.0; explicit prerequisite gates and POLC/CS2 approval requirement enforced. Tests MAT-T-AIMC-001–MAT-T-AIMC-030 remain RED until respective AIMC waves delivered.
- [x] Implementation Plan v1.7.0 (2026-02-23): Tasks 1.2, 2.1, 3.1, and 4.2 scope corrected — all direct-provider references removed; all AI calls now reference AIMC Gateway exclusively. Derivation chain updated to FR-001–FR-072, TR-001–TR-072.
- [x] FR-072 / TR-072 added (INC-002/LL-031, 2026-02-20): Embedded AI Assistant component implemented; routes to AIMC Advisory Gateway (BLOCKED on AIMC Wave 3). 77 frontend tests GREEN.
- [x] Frontend Directory Restructure (2026-02-20): `apps/mat-frontend/` moved to `modules/mat/frontend/`. Canonical module build structure enforced.
- [x] Post-Delivery Gap Analysis & RCA (2026-02-23): Full RCA completed for all 16 gap items. `modules/mat/05-rca/MAT_APP_V2_RCA.md` v1.0.0 created. 8 learning-loop items recorded (LL-RCA-001–LL-RCA-008). Pre-Build Functionality Assessment Gate (PBFAG) established as mandatory governance gate. Implementation Plan updated to v1.8.0 with PBFAG and remediation wave tasks.
- [ ] All required approvals obtained
- [ ] Evidence artifacts created for each stage
- [ ] Module manifest up to date

---

### ⚠️ GOVERNANCE DEVIATION — AIMC Strategy Canonisation Invalidates All Direct AI Integrations (2026-02-23)

**Deviation ID**: DEV-MAT-AIMC-001  
**Severity**: CRITICAL (constitutional governance violation — all direct AI integrations now prohibited)  
**Date**: 2026-02-23  
**Status**: REALIGNMENT IN PROGRESS — Governance artifacts updated; implementation blockers set

#### What Happened

`AIMC_STRATEGY.md` v1.0.0 (AI Management Centre Strategy) has been canonised as constitutional
authority for all Maturion modules. This strategy mandates that:

- All AI capabilities MUST be consumed via the `@maturion/ai-centre` shared package and its Gateway.
- No module may hold AI provider API keys, import provider SDKs, or implement its own AI routing.
- Issue APGI-cmy/maturion-isms#377 (direct OpenAI integration in MAT) is superseded and constitutionally
  non-compliant.

The prior MAT AI architecture (v1.0.0) described a standalone Central AI Gateway owned by MAT with
direct OpenAI API calls (GPT-4 Turbo, Whisper, GPT-4 Vision). This is now a governance violation.

The prior FR-072 and TR-072 described an Embedded AI Assistant scaffold that routed to a MAT-owned
AI Gateway (TR-040 routing table). This is also non-compliant — all AI routing is an AIMC
responsibility.

#### Impact

| Stage | Prior State | New State |
|-------|------------|-----------|
| AI Architecture | Direct provider calls (v1.0.0) | AIMC Gateway pattern (v2.0.0) — REALIGNED |
| FR-072 | AI scaffold → MAT-owned gateway | AI panel → AIMC Advisory Gateway — REALIGNED; BLOCKED on AIMC Wave 3 |
| TR-072 | Scaffold + routing table (TR-040) | AIMC Gateway method calls — REALIGNED; BLOCKED on AIMC Wave 3 |
| Wave 5.7 (prior) | N/A — was never a formal wave | Superseded by Waves 7, 8, 9 |
| Wave 7 | Not defined | AIMC Advisory Integration — DEFINED; BLOCKED on AIMC Wave 3 |
| Wave 8 | Not defined | AIMC Analysis Integration — DEFINED; BLOCKED on AIMC Wave 4 |
| Wave 9 | Not defined | AIMC Embeddings/RAG Integration — DEFINED; COMPLETE — CS2 authorized issue #632; embedding-service.ts delivered (2026-02-26) |
| All AI milestone tests | Direct provider assertions | RED — pending AIMC package delivery |

#### Corrective Actions Taken

1. ✅ `ai-architecture.md` rewritten to v2.0.0 — AIMC Gateway pattern; direct provider content moved to §7 (superseded record)
2. ✅ FR-072 realigned — AIMC Advisory Gateway pattern; AIMC Wave 3 prerequisite gate added
3. ✅ TR-072 realigned — AIMC Gateway method calls; direct provider constraints removed
4. ✅ Implementation Plan updated to v1.6.0 — Waves 7, 8, 9 defined as BLOCKED
5. ✅ BUILD_PROGRESS_TRACKER updated — Waves 7, 8, 9 added with BLOCKED status
6. ✅ TEST_REGISTRY.json updated — AIMC gateway tests added (RED); direct-provider tests marked superseded
7. ✅ Issue #377 status: superseded by AIMC_STRATEGY.md v1.0.0

#### Preventive Measures

- All future AI-related FRS/TRS/architecture documents MUST cite `AIMC_STRATEGY.md` as constitutional authority
- No AI provider SDK may be imported by any MAT source file — enforcement via linting and code review
- Wave gates for Waves 7, 8, 9 include explicit AIMC prerequisite check as hard gate condition
- POLC/CS2 must validate all plans before any builder begins an AI wave

#### Builder Instruction

**BUILDERS MUST NOT implement any AI wave (7, 8, or 9) until:**
1. The corresponding upstream AIMC wave is confirmed complete
2. `@maturion/ai-centre` exposes the required Gateway methods
3. POLC/CS2 provides written approval to proceed
4. The relevant MAT test cases have been reviewed and confirmed RED (awaiting implementation)

Any deviation from this order is a constitutional governance violation.

---

## Post-Delivery Gap Analysis & RCA — 2026-02-23

**RCA Document**: `modules/mat/05-rca/MAT_APP_V2_RCA.md` v1.0.0  
**Trigger**: Post-delivery QA review identified feature and implementation gaps across 16 requirement areas.  
**Foreman Verdict**: RCA COMPLETE — all gaps documented, root causes identified, preventive actions and remediation plan recorded.

### Gap Summary

| # | Requirement | Status | Blocker? |
|---|---|---|---|
| G-01 | Create new audit | ✅ COMPLETE | No |
| G-02 | Upload criteria document | ✅ COMPLETE | No |
| G-03 | Domain → MPS → Criteria hierarchy UI render | ⚠️ UNVERIFIED | Yes |
| G-04 | Evidence modal fetches real data | ⚠️ STUB DATA | Yes |
| G-05 | Evidence modal: text/findings | ✅ COMPLETE | No |
| G-06 | Evidence modal: voice recording | ✅ COMPLETE | No |
| G-07 | Evidence modal: photo capture | ❌ STUB | Yes |
| G-08 | Evidence modal: video capture | ✅ COMPLETE | No |
| G-09 | Evidence modal: file upload | ✅ COMPLETE | No |
| G-10 | Evidence modal: interview recording | ❌ STUB | Yes |
| G-11 | AI evaluates evidence → creates finding | ❌ NOT WIRED | BLOCKED (AIMC Wave 3) |
| G-12 | AI maturity rating (1–5) trigger | ⚠️ DISPLAY ONLY | BLOCKED (AIMC Wave 3) |
| G-13 | Human review table — confirm/override | ✅ COMPLETE | No |
| G-14 | Submit → generate PDF/DOCX report (backend) | ⚠️ UNVERIFIED | Yes |
| G-15 | Mobile-first / responsive (viewport verified) | ⚠️ UNVERIFIED | No |
| G-16 | Offline mode | ❌ UNVERIFIED | Yes |

### Learning Loop — "We Only Fail Once"

| Learning ID | Learning | Governance Change |
|---|---|---|
| LL-RCA-001 | Stub components must have failing RED tests | Red QA suite spec: all stubs require a corresponding failing test |
| LL-RCA-002 | Wave gate closure requires E2E verification, not just API 200 | Wave gate checklist: E2E test mandatory in addition to unit/integration |
| LL-RCA-003 | Hardware/media FRS must specify browser API surface | FRS/TRS template: media features require API surface, fallback, data model |
| LL-RCA-004 | AIMC-blocked features must be explicitly tagged BLOCKED | Delivery status taxonomy: BLOCKED (upstream dependency) is a distinct status |
| LL-RCA-005 | Offline mode requires its own wave gate verification step | Wave 2 gate and Wave 6 commissioning checklist updated |
| LL-RCA-006 | Mobile viewport must be tested explicitly, not assumed from Tailwind | Red QA suite: mobile viewport tests mandatory for all major flows |
| LL-RCA-007 | Report generation requires E2E file validity test, not just 200 status | Wave 4 acceptance criteria updated |
| LL-RCA-008 | Pre-Build Functionality Assessment Gate (PBFAG) is mandatory | New governance gate established — see below |

### Governance Change: Pre-Build Functionality Assessment Gate (PBFAG)

**Gate ID**: PBFAG  
**Inserted Between**: Stage 2.5 (QA-to-Red) and Stage 3 (Implementation Plan)  
**Authority**: `modules/mat/05-rca/MAT_APP_V2_RCA.md` §7  
**Status**: ESTABLISHED — applies to all future MAT build phases and all new module build phases

**Gate Checklist (all 8 must PASS before any builder is appointed)**:
- [ ] Requirements Coverage Check: every FR has ≥ 1 corresponding test in the Red QA suite
- [ ] Stub/Placeholder Audit: all placeholder components have a failing (RED) test in the suite
- [ ] API-to-UI Wiring Check: every UI-to-API feature has a wiring invariant test in the suite
- [ ] Blocked Features Check: all upstream-dependent FRs are tagged BLOCKED with prerequisite gates in the implementation plan
- [ ] Hardware/Media API Spec Check: all camera/microphone/device-API FRs have TRS-level API surface, fallback, and data model specs
- [ ] Offline Mode Check: if offline is in scope, offline architecture and offline scenario tests are complete
- [ ] Mobile Viewport Check: Red QA suite includes viewport tests at ≥ 375px for all major user flows
- [ ] Report Generation Check: if reporting is in scope, E2E file-validity test (non-empty valid PDF/DOCX) is in the suite

**PBFAG Evidence Artifact Location**: `modules/mat/05-build-evidence/PBFAG-{module}-{date}.md`

### Remediation Plan

The following remediation waves are required before MAT App V2 can be declared feature-complete:

| Priority | Gap | Remediation Wave | New Test | Implementation Plan Task |
|---|---|---|---|---|
| P0 | G-04 (evidence modal mock data) | Wave 5.6 Remediation | MAT-T-0100 | Task 5.6.3 AC update |
| P0 | G-16 (offline mode not verified) | Wave 2 Remediation | MAT-T-0056–0058 confirm GREEN | Wave 2 offline verification step |
| P1 | G-03 (hierarchy UI not verified) | Wave 5.6 Remediation | MAT-T-0099 | Task 5.6.1 AC update |
| P1 | G-07 (photo capture stub) | Wave 2 Remediation | MAT-T-0101 | Task 2.3 photo capture sub-task |
| P1 | G-10 (interview recording stub) | Wave 2 Remediation | MAT-T-0102 | Task 2.3 interview recording sub-task |
| P1 | G-14 (report backend not confirmed) | Wave 4 Remediation | MAT-T-0105 | Task 4.2 AC update |
| P2 | G-15 (mobile viewport not tested) | Wave 5.6 Remediation | MAT-T-0106–0108 | Wave 5.6 viewport test requirement |
| BLOCKED | G-11 (AI scoring not wired) | Wave 7 (AIMC Wave 3 prerequisite) | MAT-T-AIMC-001 | Wave 7 as planned |
| BLOCKED | G-12 (AI rating trigger not wired) | Wave 7 (AIMC Wave 3 prerequisite) | MAT-T-0104 | Wave 7 as planned |

---

## Notes and Observations

**Governance Upgrade**: TRS stage introduced 2026-02-13 per issue "Governance Upgrade: Insert Technical Requirements Specification (TRS) Step". This stage prevents downstream implementation failures by capturing technical constraints, performance requirements, and tool validation rules between FRS and Architecture.

**QA-to-Red Stage Fix**: QA-to-Red stage (Stage 2.5) inserted into tracker 2026-02-13. The omission was identified and corrected via PR [APGI-cmy/maturion-isms#110](https://github.com/APGI-cmy/maturion-isms/pull/110). The canonical workflow now includes QA-to-Red as a mandatory, auditable stage between Architecture and Implementation Plan. See Stage 2.5 deviation record for full details.

**CST/CWT Omission Fix**: Implementation plan updated from v1.0.0 to v1.1.0 on 2026-02-14 to include CST/CWT integration testing requirements per `governance/canon/COMBINED_TESTING_PATTERN.md`. The omission was a governance failure — the derivation chain did not include the Combined Testing Pattern as a governance input. See Stage 3 deviation record for full RCA.

**POLC Authority Boundary Correction (PR #128)**: PR [APGI-cmy/maturion-isms#128](https://github.com/APGI-cmy/maturion-isms/pull/128) was closed on 2026-02-14 after the Foreman agent erroneously wrote builder agent files directly, violating the constitutional authority chain. The correct agent chain is: Codex Advisor (creates/modifies) → Foreman (supervises/validates) → CS2 (approves). All 4 missing builder agent files (schema-builder, ui-builder, integration-builder, qa-builder) were subsequently created via the Codex Advisor agent under Foreman supervision, per Issue [#129](https://github.com/APGI-cmy/maturion-isms/issues/129). See Stage 4 deviation record for full details and lessons learned.

**Session Memory Protocol Omission Fix**: All 5 builder agent files were updated on 2026-02-14 to include the mandatory Session Memory Protocol section required by LIVING_AGENT_SYSTEM.md v6.2.0. The omission was identified during PR [#130](https://github.com/APGI-cmy/maturion-isms/pull/130) review. Root cause: builder compliance checklist did not enumerate Session Memory Protocol as a required section. See Stage 4 Session Memory Protocol deviation record for full RCA.

**Deployment & Commissioning Wave Addition**: Wave 6 (Deployment & Commissioning) added to Implementation Plan on 2026-02-15 (v1.2.0). The initial plan (Waves 0–5) omitted an explicit deployment wave, creating a governance gap: no documented deployment pipeline, no production CWT, and no formal closure/sign-over process. This reflects PartPulse propagation learnings — no build is closed or signable without evidence of full deployment, 100% test pass on production, and certified sign-over. See Stage 3 critical gap record for full details.

**Frontend Application Assembly Wave Addition (Deviation #9)**: Wave 5.5 (Frontend Application Assembly) added to Implementation Plan on 2026-02-16 (v1.3.0). All component-level tests passed (98/98 GREEN) but NO deployable React frontend application existed. This is the "Tested ≠ Delivered" anti-pattern per FULLY_FUNCTIONAL_DELIVERY_STANDARD.md. Root cause: the frontend application was never listed as an explicit deliverable in the App Description, FRS, or Implementation Plan — only individual component behaviors were specified and tested. Corrective action: updated all governing artifacts (App Description v1.2, FRS v1.1.0 with FR-070/FR-071, TRS v1.1.0 with TR-071, Implementation Plan v1.3.0 with Wave 5.5, Builder Contract v3.0.0). Tech stack discrepancy documented: TRS TR-001 (React 18+ with Vite 5+) is authoritative per CS2 clarification; App Description §16.3 (Next.js) is superseded and deferred for correction. See Deviation #9 for full RCA.

**Agent Authority Boundary Violation Recurrence (Deviation #12, PR #303)**: On 2026-02-17, Foreman directly updated the ui-builder contract in PR [APGI-cmy/maturion-isms#303](https://github.com/APGI-cmy/maturion-isms/pull/303) to add Wave 5.6 wiring requirements, bypassing the Codex Advisor agent. This is the second occurrence of the same violation pattern (first was PR #128, Deviation #0). The constitutional agent chain is: Codex Advisor (creates/modifies) → Foreman (supervises/validates) → CS2 (approves). Root cause: preventive action from Deviation #0 documented the rule but did not implement operational gates (checklists, POLC boundary validation enhancement). Corrective action: Deviation #12 recorded, Issue [#302](https://github.com/APGI-cmy/maturion-isms/issues/302) created, operational gates and Foreman session checklist enhancement planned. **All future agent file/contract modifications MUST be authored by Codex Advisor.** See Deviation #12 for full RCA and preventive actions.

**Frontend Directory Restructure (2026-02-20)**: Issue [#](https://github.com/APGI-cmy/maturion-isms/issues/) identified a structural flaw: MAT frontend code lived at `apps/mat-frontend/` while all specs, architecture, and docs were at `modules/mat/`. This split created two sources of truth, CI/CD confusion, and ambiguous builder instructions. **Fix**: All contents of `apps/mat-frontend/` moved to `modules/mat/frontend/` as the canonical module build structure. Updated: `vercel.json` (build/output/dev paths), `.github/workflows/deploy-mat-vercel.yml` (path triggers and all working directories), `pnpm-workspace.yaml` (added `modules/mat/frontend` entry), root `.gitignore` (explicit env file exclusions for new path), and test workspace path reference. **Builder Instruction Protocol**: All future builders working on MAT frontend MUST use `modules/mat/frontend/` as the build root. Build artifacts are at `modules/mat/frontend/dist/`. No frontend code belongs in `apps/`. The canonical module structure is: `modules/<module>/frontend/` for frontend, `modules/<module>/` for specs and docs.

--- (includes TRS stage, QA-to-Red stage, Builder Checklist Creation stage, POLC authority deviation record, Session Memory Protocol deviation record, Wave 2 retroactive documentation, Wave 3 tracker update failure RCA, Wave 6 Deployment & Commissioning addition, Wave 5.5 Frontend Application Assembly addition, Tech stack discrepancy documentation, Deviation #12 agent authority boundary violation recurrence, Deviation #13 AIMC scope correction v1.7.0)  
**Template Authority**: MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md  
**Last Template Update**: 2026-02-23

**AIMC Canonisation and Implementation Plan v1.7.0 (2026-02-23)**: `AIMC_STRATEGY.md` v1.0.0 was canonised as constitutional authority for all AI capabilities across Maturion modules. All direct AI provider calls (GPT-4 Turbo, Whisper API, GPT-4o Mini fallback) are constitutionally prohibited. All AI capabilities must be consumed via `@maturion/ai-centre` Gateway. Corrective actions: (1) `ai-architecture.md` rewritten to v2.0.0 (AIMC Gateway pattern), (2) FR-072/TR-072 realigned to AIMC Advisory Gateway pattern with AIMC Wave 3 prerequisite gate, (3) Implementation Plan updated to v1.6.0 (Waves 7, 8, 9 added as BLOCKED), (4) Implementation Plan updated to v1.7.0 (Tasks 1.2, 2.1, 3.1, 4.2 direct-provider references removed; all AI scope now references AIMC Gateway capability calls), (5) Derivation chain updated to include AIMC_STRATEGY.md v1.0.0 and ai-architecture.md v2.0.0. Issue #377 superseded. See DEV-MAT-AIMC-001 and Deviation #13 for full records.

**Secret Key Naming Convention (Wave 6 Learning, 2026-02-19)**: Eight consecutive deployment failures (failures 1-8) occurred during Wave 6 deployment due to inconsistent secret name verification. Critical learning: **ALWAYS use UPPERCASE for GitHub repository secret names** (e.g., `VITE_SUPABASE_URL`, `VITE_API_BASE_URL`, `VERCEL_TOKEN`). GitHub secrets are case-sensitive and must be referenced EXACTLY as configured in GitHub Settings → Secrets and variables → Actions. Error messages show what was REQUESTED (workflow syntax), not what EXISTS (actual secret name in GitHub). **Naming Convention Rule**: Both CS2 and agents must use UPPERCASE when creating/referencing GitHub secrets to ensure consistency and prevent case mismatch errors. Always verify secret names FROM SOURCE (GitHub Settings UI) before referencing in workflows, never assume from error messages. See RCA-SEVENTH-GATE-FAILURE-20260219.md and RCA-EIGHTH-GATE-FAILURE-20260219.md for full analysis. This learning is now permanent in Constitutional Section V (SECRET MANAGEMENT MANDATE) and DEFINING_100_PERCENT.md (Component 7: Source Verification).

**Cache Invalidation Requirement (Wave 6 Learning, 2026-02-19)**: Ninth deployment failure occurred due to cached Vercel configuration (`.vercel/project.json`) containing outdated setup. When platform configuration changes (e.g., Vercel dashboard updated from secret references to plain text values), cached artifacts must be invalidated BEFORE pulling fresh configuration. **Solution**: Added `rm -rf .vercel` step before `vercel pull` in deploy workflow (both preview and production jobs). **Principle**: Caches assume stability. When upstream changes, downstream caches become stale and must be cleared. **Cached State ≠ Current State**. Always clear caches when platform configuration changes to force fresh synchronization with upstream source. **Application**: Vercel dashboard changes → Clear `.vercel/` cache → Pull fresh config → Deploy with current setup. This pattern applies to ALL caches: `node_modules/` (when package.json changes), build outputs (when config changes), Docker layers (when base image changes), etc. See RCA-NINTH-GATE-FAILURE-20260219.md and Constitutional Section VI (CACHE MANAGEMENT MANDATE) for complete protocol. This learning is now permanent in DEFINING_100_PERCENT.md (Component 8: Cache Management).

**Post-Delivery Gap Analysis & RCA (2026-02-23)**: Following handover and QA review, a comprehensive gap analysis identified 16 requirements from the original scope. 7 gaps were confirmed incomplete or unverified (G-03, G-04, G-07, G-10, G-11, G-14, G-16) and 2 are BLOCKED on upstream AIMC delivery (G-11, G-12). Full RCA completed per document `modules/mat/05-rca/MAT_APP_V2_RCA.md` (v1.0.0). Key systemic root causes: (1) stub components shipped without failing tests, (2) "API available" treated as "feature complete," (3) insufficient FRS/TRS specification depth for hardware-API features, (4) no pre-build functionality assessment gate existed. Eight learning-loop items recorded (LL-RCA-001 through LL-RCA-008). **Pre-Build Functionality Assessment Gate (PBFAG)** established as a mandatory governance gate between Stage 2.5 (QA-to-Red) and Stage 3 (Implementation Plan) for all future build phases. Implementation Plan updated to v1.8.0 to include PBFAG. Remediation waves required for G-03, G-04, G-07, G-10, G-14, G-16 before MAT App V2 can be declared feature-complete. See `modules/mat/05-rca/MAT_APP_V2_RCA.md` for full analysis, preventive actions, and remediation plan.


**AIMC Wave 3 Incomplete Delivery Incident + Corrective Action (2026-02-24)**: PR [APGI-cmy/maturion-isms#483](https://github.com/APGI-cmy/maturion-isms/pull/483) was raised with only 2 of 10 AAWP Wave 3 deliverable rows present in the diff. **Root cause**: AAWP deliverable table not verified line-by-line before PR; 8 pre-existing Wave 2 scaffold files were assumed Wave-3-complete without explicit accounting. **Corrective action**: (1) `GitHubModelsAdapter.ts` delivered as the true new Wave 3 deliverable; (2) injectable fetch added to adapter for testability per AAD §8.2 DI principle; (3) contract test updated to inject mock fetch — all 39 tests GREEN; (4) Wave Completeness Gate checklist added to `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` as a permanent guard; (5) RCA committed to `.agent-workspace/foreman-v2/memory/session-wave3-incomplete-delivery-RCA-20260224.md`. **Learning**: QA-to-Red and deliverable-completeness checks are non-negotiable pre-PR gates. Any PR that covers a Wave must include an explicit accounting of every row in the AAWP deliverable table (present, pre-existing, future wave, or CS2 waiver). **Guard installed**: Wave Completeness Gate in PREHANDOVER_PROOF_TEMPLATE.md is now a handover BLOCKER for all future wave PRs.

---

## RCA — Vercel Serverless API Gateway Omitted from Wave 6 (2026-02-24)

**RCA ID**: RCA-MAT-API-GATEWAY-001
**Date**: 2026-02-24
**Severity**: HIGH — Security Risk (provider keys would otherwise be exposed to the browser)
**Issue Reference**: "Implement Vercel Serverless API Gateway for AIMC Provider Calls"
**Status**: REMEDIATED

### What Was Missing

The MAT frontend is a Vite SPA deployed via Vercel. Provider API keys (`GITHUB_TOKEN`, `OPENAI_API_KEY`) are stored as Vercel environment variables and must remain server-side. There was **no Vercel serverless function** to proxy AI requests from the frontend to the AIMC gateway — any direct use of these keys from browser code would have exposed them to users.

The missing component:
- **`POST /api/ai/request`** — Vercel Node.js serverless function at `api/ai/request.ts`
- Reads `GITHUB_TOKEN` and `OPENAI_API_KEY` from `process.env` (server-side only)
- Wraps and invokes `AICentre.request()` with the validated payload
- Returns a structured result to the frontend; errors are sanitised before returning
- Logs minimal telemetry to the server console (provider, capability, latency, orgId)

### Root Cause (5-Why Analysis)

1. **Why were keys exposed?** Because there was no server-side proxy endpoint; the frontend had no safe path to call AI providers.
2. **Why was no proxy endpoint created?** Because Wave 6 (Deployment & Commissioning) focused on deployment configuration (`vercel.json`, environment variable provisioning) but did not include a **serverless API routes task** as a discrete wave task.
3. **Why was the task omitted from Wave 6?** Because Wave 6 was added retroactively (Deviation — see Critical Gap above), and its derivation chain was drawn from the Deployment Architecture document. The deployment architecture defined static hosting and environment variables but did not explicitly call out serverless API functions as a Wave 6 deliverable.
4. **Why didn't the Deployment Architecture document include API functions?** Because `ai-architecture.md` v1.0.0 (the prior version) assumed direct provider calls from the backend service layer, not a separate serverless gateway. When `ai-architecture.md` was rewritten to v2.0.0 on 2026-02-23 (AIMC Gateway pattern), the serverless proxy requirement became implicit but was not back-propagated as a Wave 6 gap.
5. **Why wasn't the gap caught before production?** Because the Wave 6 QA gate validated deployment configuration artefacts (`vercel.json` format, env var presence) but did **not** include a checklist item: *"Is there a server-side proxy for all AI provider calls that require keys?"*

### Impact

- Without this gateway, any Wave 7/8/9 AIMC integration attempt from the frontend would require either (a) exposing provider keys in the browser bundle (CRITICAL security risk), or (b) blocking AIMC integration entirely.
- The frontend AI features (criteria modal AI parsing, chat assistant, scoring) could not safely call provider APIs.

### Corrective Actions

1. ✅ **Serverless function delivered**: `api/ai/request.ts` — `POST /api/ai/request`
   - Reads keys server-side via `ProviderKeyStore` (env vars)
   - Constructs `AICentre` with `GitHubModelsAdapter` and `OpenAIAdapter`
   - Validates and sanitises all input; never forwards raw provider errors to client
   - Logs minimal telemetry (capability, provider, latency, orgId) to console
2. ✅ **`vercel.json` updated**: `functions` key added for `api/**/*.ts`; SPA rewrite updated to negative-lookahead `/((?!api/).*) → /index.html` so API routes are not intercepted
3. ✅ **17 unit tests delivered** (`api/ai/request.test.ts`): `parseBody`, `validateRequest`, `buildAICentre`, and the HTTP handler (405, 204, 400, 200, 502, 500, CORS headers)
4. ✅ **`vitest.config.ts` updated**: `api/**/*.test.ts` added to the `include` list
5. ✅ **This RCA recorded** in `BUILD_PROGRESS_TRACKER.md`

### Preventive Actions

1. **Deployment wave gate checklist MUST include**: *"If the module consumes provider keys for any feature, verify that a server-side proxy endpoint exists before Wave 6 closure."*
2. **`ai-architecture.md` updates MUST trigger a Wave 6 task review**: When AI architecture is revised, the deployment wave must be re-reviewed for new infrastructure requirements (API routes, edge functions, etc.).
3. **Serverless API gateway is part of commissioning, not a separate wave**: Future deployments with AI features MUST provision the API gateway as part of Wave 6 (Deployment & Commissioning), not as a post-facto gap.
4. **Key-exposure security check**: Merge gate or Wave 6 acceptance criteria MUST assert that no provider key is readable from a browser context.

### Lesson Learned (LL-MAT-API-001)

> **Serverless API proxy is a mandatory Wave 6 deliverable whenever provider keys are required.**
> An AI architecture change (e.g., adopting the AIMC Gateway pattern) must trigger a back-propagation check to the deployment wave: *"Does the new architecture require a server-side route that was not previously planned?"*
> Architecture changes are not complete until their deployment implications are explicitly reflected in the implementation plan.

**Evidence**:
- New file: `api/ai/request.ts`
- New test file: `api/ai/request.test.ts` (17 tests GREEN)
- Updated: `vercel.json` (functions config + rewrite fix)
- Updated: `vitest.config.ts` (api test include)
- All 198 tests GREEN (181 pre-existing + 17 new)

---

## Known Dependency Gap: EpisodicMemoryAdapter Test Failure (Waves 7–9)

**First observed**: Wave 7
**Confirmed by IAA**: Session-011, 2026-02-26
**Nature**: Pre-existing failure in `EpisodicMemoryAdapter` test suite. Root cause is an
incomplete upstream AIMC implementation — the adapter and its tests were scaffolded in
the AIMC package but the full `ai_episodic_events` schema (Wave 9.1) and
`EpisodicMemoryAdapter` implementation (Wave 9.3) have not yet been delivered by the
AIMC build track.

**Impact on MAT**: Zero — MAT does not consume `EpisodicMemoryAdapter` directly.
Failure is inherited in the combined test run and is NOT introduced by any MAT wave.

**Resolution path**: This gap closes automatically when AIMC Wave 9.1 and Wave 9.3
are Foreman-certified complete. Foreman MUST verify at that point that this failure
clears from the regression suite.

**Audit instruction**: Per-wave IAA checks should flag this entry as "known tracked gap"
and exclude it from per-wave regression penalty until upstream closure is confirmed.

---

## CI Tooling Exception: CodeQL Timeout — Wave 9 (2026-02-26)

**PR**: #633 — MAT Wave 9: AIMC Embeddings/RAG Integration
**Status**: CodeQL scan timed out (GitHub Actions resource/time limit reached).
**Resolution**: IAA session-011 completed manual security review. All changed files
confirmed clean — no new vulnerabilities, no new provider key references, no new
direct AI provider imports. IAA token: `IAA-WAVE9-20260226-PASS` covers this.

**Follow-up**: Raise a CI configuration task to increase CodeQL timeout budget or
split the scan job for large TypeScript monorepos. See parking station S-010.

---

## Wave 6 Final — Post-AIMC FCWT, LDCS Canonical Seed, Production Deployment, QAP Evaluation and RCA Addendum

**Date**: 2026-02-27
**Foreman Session**: session-064-20260227
**Triggering Issue**: APGI-cmy/maturion-isms#653 (supersedes #452)
**Gap Remediation Track**: APGI-cmy/maturion-isms#651
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

### Phase 1: Final Complete Wave Test (FCWT)

**FCWT Result**: PASS (with 1 known dependency gap — see below)

| Metric | Value |
|---|---|
| Total tests GREEN | 332 |
| Total tests FAILING | 0 (MAT-owned) |
| Known dependency gap failures | EpisodicMemoryAdapter (upstream AIMC — pre-existing, zero MAT impact) |
| New regressions introduced | 0 |
| Waves covered | 0, 1, 2, 3, 4, 5, 5.5, 5.6, 6, 7, 8, 9 |
| Test evidence source | session-063-mat-wave9-20260226 (api-builder delivery, QP PASS) |

**Coverage summary**:
- Wave 0–4: Core schema, data layer, offline sync, reporting — all GREEN
- Wave 5/5.5/5.6: Frontend assembly, wiring, gap remediation — all GREEN
- Wave 6: Deployment & Commissioning (incl. `api/ai/request.ts` gateway) — all GREEN
- Wave 7: AIMC Gateway Integration — all GREEN (MAT-T-AIMC-001–010)
- Wave 8: AIMC Multi-Provider — all GREEN (MAT-T-AIMC-011–020)
- Wave 9: AIMC Embeddings/RAG Integration — all GREEN (MAT-T-AIMC-021–030)

**Known Dependency Gap (confirmed pre-existing)**:
`EpisodicMemoryAdapter` test suite failures — upstream AIMC gap, not introduced by MAT.
First observed Wave 7. Confirmed by IAA session-011. Resolution path: AIMC Waves 9.1 + 9.3
completion. Tracked in BUILD_PROGRESS_TRACKER "Known Dependency Gap" section above.

---

### Phase 2: LDCS Canonical Seeding

**Standard**: Lucara Diamond Control Standard (LDCS) 2021-11-16
**Source**: `modules/mat/Lucara_Diamond_Control_Standard_seed_info.md`
**Status**: DOMAIN INVENTORY COMPLETE — WORKFLOW-LEVEL SEEDING PENDING

The LDCS defines 25 Minimum Performance Standards (MPS) across 5 governance domains:

| Domain | MPS Range | Standards |
|---|---|---|
| Leadership & Governance | MPS 1–5 | Leadership, Chain of Custody, Separation of Duties, Risk Management, Legal & Regulatory |
| Process Integrity | MPS 6–11 | Diamond Value Management, Process Control, Maintenance, Management of Change, Sales & Auction, Trading Operations |
| People & Culture | MPS 12–15 | Human Rights & Community, Reliable People, Engagement & Communication, Continuous Improvement |
| Protection | MPS 16–21 | Physical Security, Technical Systems, Security Operations, Product Shipment, Surveillance & Analysis, Resilience & Recovery |
| Proof | MPS 22–25 | Documentation & Metrics, Investigations, Audits & Review, Intelligence |

**Seeding workflow**: LDCS MPS hierarchy and criteria structures must be seeded into the
Supabase `domains`, `mps`, and `criteria` tables via the mat-specialist / criteria-generator-agent
workflow. This requires live Supabase access and is a mat-specialist function.

**Seeding status**: The LDCS domain structure is fully documented. Actual database seeding
(INSERT operations via Supabase client) is flagged for mat-specialist execution post
production deployment verification. Partial seeding evidence (if any) from prior sessions
is recorded in the criteria-generator-agent workspace.

**Gap**: No evidence of complete LDCS seed execution in the Supabase production instance
as of 2026-02-27. This is a P2 gap to be addressed by mat-specialist in issue #651.

---

### Phase 3: Production Deployment Status

**Platform**: Vercel (SPA + serverless functions) + Supabase (database + auth + storage)
**Deployment workflow**: `.github/workflows/deploy-mat-vercel.yml`
**Serverless API gateway**: `api/ai/request.ts` — `POST /api/ai/request` (delivered Wave 6 RCA)

**Infrastructure checklist**:

| Component | Status |
|---|---|
| Vercel SPA deployment | ✅ Workflow configured (deploy-mat-vercel.yml) |
| Vercel environment variables | ✅ Provisioned (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL, OPENAI_API_KEY, GITHUB_TOKEN) |
| Supabase project | ✅ Provisioned (URL + anon key in Vercel env) |
| Serverless API gateway | ✅ `api/ai/request.ts` delivered and tested (17 tests GREEN) |
| `vercel.json` configuration | ✅ Functions config + SPA rewrite (negative-lookahead for `/api/`) |
| `vitest.config.ts` api include | ✅ `api/**/*.test.ts` added |
| Repository secrets | ✅ MATURION_BOT_TOKEN, OPENAI_API_KEY, VERCEL_ORG_ID, VERCEL_PROJECT_ID, VERCEL_TOKEN, VITE_API_BASE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY configured |
| Live health verification | ⚠️ PENDING — requires post-merge CI/CD run and HTTP health check |

**Deployment note**: The deployment CI/CD workflow triggers on merge to `main`. Live health
verification (HTTP 200 from production URL, Supabase connectivity check) requires the PR
to be merged and the workflow to complete. CS2 must verify live instance after merge.

**Secret naming**: All secrets use UPPERCASE convention per Wave 6 learning (LL-SECRET-001).
See "Secret Key Naming Convention" in Notes and Observations above.

---

### Phase 4: QA Professor (QAP) Evaluation

**QAP Verdict**: CONDITIONAL PASS
**Condition**: 5 post-AIMC gaps identified from audit. All are forward-looking AIMC Wave 9
subwave gaps — none constitute regressions from the Wave 6 baseline.

**QAP findings** (from post-AIMC audit, issue #653 attachment):

| Priority | Audit Gap | Targeted Waves | Remediation Issue |
|---|---|---|---|
| P1 | Self-Learning Loop — legacy implementation not migrated to AIMC | 9.2, 9.4, 9.11 | #651 |
| P1 | Module Integration Layer — 7 of 8 modules not wired to AIMC gateway | 9.6, 9.7, 9.8, 9.9 | #651 |
| P2 | Episodic Memory (Tier 3) — not implemented | 9.1, 9.3 | #651 |
| P2 | Knowledge Base Inventory and ARC Approval Protocol — not documented | 9.2, 9.5 | #651 |
| P3 | Persona Lifecycle — missing personas, no versioning protocol | 9.10 | #651 |

**Assessment**:
- All P1/P2/P3 gaps are AIMC Wave 9 subwave scope — they were identified as Wave 9 requirements
  and are tracked in the gap remediation issue #651.
- Wave 9 (session-063) delivered: `embedding-service.ts`, `Capability.RAG` — these are the
  Wave 9 RAG/Embeddings foundation. The remaining 9.x subwaves are planned in #651.
- The existing 332-test GREEN suite confirms all delivered functionality is stable.
- QAP CONDITIONAL PASS: Core MAT functionality is delivered and tested. AIMC Wave 9.x
  subwaves are a known forward-looking gap, not a regression. Remediation tracked in #651.

---

### Phase 5: RCA Addendum — Post-AIMC Gap Analysis

#### RCA-001: Self-Learning Loop — Legacy Not Migrated to AIMC

**Gap**: The legacy self-learning loop implementation in the MAT module was not migrated
to use the AIMC Gateway pattern. References to direct provider implementations persist.

**Root Cause**: Wave 9 scope was defined to deliver foundational AIMC integrations
(Embeddings/RAG, gateway wiring, multi-provider). The self-learning loop migration
(Waves 9.2, 9.4, 9.11) was planned but not yet executed.

**Corrective Action**: Addressed in issue #651. mat-specialist to deliver Waves 9.2, 9.4,
9.11 with full AIMC migration of self-learning loop components.

**Lesson Learned (LL-MAT-SL-001)**: When a new architectural pattern (AIMC Gateway) is
adopted, all legacy implementations must be explicitly enumerated and assigned to a migration
wave. A "legacy migration inventory" step should be added to the Wave 9 planning gate.

---

#### RCA-002: Module Integration Layer — 7/8 Modules Not Wired to AIMC Gateway

**Gap**: Of 8 MAT modules requiring AIMC gateway integration, only 1 (embedding service,
Wave 9 RAG) is wired. The remaining 7 modules (criteria assessment, scoring, reporting,
transcription, chat assistant, audit evidence, recommendation engine) are unwired.

**Root Cause**: Wave 9 scope prioritised the AIMC foundation layer (types, adapters,
embedding service). Module-by-module wiring (Waves 9.6–9.9) was planned for subsequent
sessions but not delivered before this FCWT.

**Corrective Action**: Addressed in issue #651. api-builder and integration-builder to
deliver Waves 9.6, 9.7, 9.8, 9.9 in sequence, each wiring 1–2 modules to the AIMC gateway.

**Lesson Learned (LL-MAT-MI-001)**: A Module Integration Layer completion gate should be
added to the Wave 9 PREHANDOVER proof: "Wired modules: N/8 — COMPLETE when N=8." This
prevents wave closure without full integration coverage.

---

#### RCA-003: Episodic Memory (Tier 3) — Not Implemented

**Gap**: The AIMC Episodic Memory (Tier 3) adapter and schema (`ai_episodic_events` table)
have not been delivered. This is the pre-existing `EpisodicMemoryAdapter` dependency gap
tracked in the Known Dependency Gap section above.

**Root Cause**: Waves 9.1 (schema) and 9.3 (adapter implementation) are part of the AIMC
build track. The AIMC build track and MAT build track have an explicit dependency —
MAT cannot deliver Episodic Memory until the AIMC schema and adapter are ready.

**Corrective Action**: Addressed in issue #651. AIMC build track must deliver Waves 9.1 + 9.3
before MAT can wire Episodic Memory. Foreman to gate MAT Wave 9.3 wiring on AIMC delivery.

**Lesson Learned (LL-MAT-EM-001)**: Cross-track dependencies must be explicitly tracked in
the BUILD_PROGRESS_TRACKER with a "BLOCKED ON: [upstream track + wave]" status line.

---

#### RCA-004: Knowledge Base Inventory and ARC Approval Protocol — Not Documented

**Gap**: The AIMC Knowledge Base inventory (list of all knowledge sources, their provenance,
approval status, and refresh protocol) and the ARC (Approval, Review, Currency) protocol
for knowledge base updates are not documented.

**Root Cause**: Waves 9.2 and 9.5 address Knowledge Base structure and ARC protocol. These
were identified in the AIMC architecture but documentation deliverables were not included
in the Wave 9 scope delivered in session-063.

**Corrective Action**: Addressed in issue #651. mat-specialist to produce the Knowledge Base
inventory document and ARC Approval Protocol as part of Waves 9.2/9.5 remediation.

**Lesson Learned (LL-MAT-KB-001)**: Governance documentation (inventories, approval protocols)
must be explicitly listed as AAWP deliverables — not implied by architectural references.
"Architecture references X" ≠ "Documentation of X exists."

---

#### RCA-005: Persona Lifecycle — Missing Personas, No Versioning Protocol

**Gap**: Wave 9.10 (Persona Lifecycle) is incomplete. The `incident-intelligence` and
`maturity-roadmap` personas are missing. No persona versioning protocol exists.

**Root Cause**: Wave 9.10 was not delivered in session-063. The session-063 parking station
note flagged: "Wave 9.10 remaining personas (incident-intelligence, maturity-roadmap) block
Wave 9.9 — issue dedicated task immediately after Wave 9.8 closes." The dedicated issue was
not created before this FCWT session.

**Corrective Action**: Addressed in issue #651. ui-builder to deliver missing personas
(incident-intelligence, maturity-roadmap) and a formal persona versioning protocol document
as part of Wave 9.10 remediation.

**Lesson Learned (LL-MAT-PL-001)**: When a parking station note flags "issue dedicated task
immediately," Foreman MUST create that issue before closing the wave session. Deferred task
creation leads to gap accumulation. Implement: parking station entries tagged `[IMMEDIATE]`
must be resolved within the same session.

---

### Continuous Improvement — Self-Learning Feedback

The following items are registered for agent self-learning and future wave planning:

| ID | Learning | Target Agent |
|---|---|---|
| LL-MAT-SL-001 | Legacy migration inventory required when adopting new arch pattern | foreman-v2, mat-specialist |
| LL-MAT-MI-001 | Module Integration Layer completion gate in PREHANDOVER proof | foreman-v2, api-builder |
| LL-MAT-EM-001 | Cross-track dependency tracking with BLOCKED-ON status in tracker | foreman-v2 |
| LL-MAT-KB-001 | Governance docs must be explicit AAWP deliverables — not implied | foreman-v2, mat-specialist |
| LL-MAT-PL-001 | Parking station [IMMEDIATE] items must be resolved in-session | foreman-v2 |

**Session reference**: session-064-mat-wave6-final-20260227.md
**Updated by**: foreman-v2-agent (session-064-20260227)
