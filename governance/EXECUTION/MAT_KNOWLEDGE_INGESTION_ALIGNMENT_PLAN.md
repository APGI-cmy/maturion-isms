# MAT Knowledge Ingestion Alignment Plan

| Field | Value |
|-------|-------|
| **Document Type** | Foreman POLC Planning Output — Alignment Plan and Wave Execution Roadmap |
| **Status** | ACTIVE — Awaiting CS2 Wave-Start Authorisations Per Wave |
| **Version** | 1.0.0 |
| **Date** | 2026-03-19 |
| **Produced By** | foreman-v2-agent v6.2.0 (session: session-dckis-alignment-plan-20260319) |
| **Source Authority** | `Maturion/strategy/DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md` v1.0.0 (DCKIS) — CS2 authorised via GitHub issue |
| **Triggering Issue** | [Foreman Task] Produce MAT Knowledge Ingestion Alignment Plan (DCKIS v1.0.0) |
| **Authority** | CS2 (Johan Ras / @APGI-cmy) |
| **Location** | `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` |
| **IAA Pre-Brief** | `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md` |

> **Note on DCKIS Strategy Document Header**: The `DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md` header is set to `CS2-AUTHORISED`, with the CS2 GitHub issue that triggered this alignment plan cited as the approving authority. No implementation wave may begin for any Pipeline 2 work unless this CS2 authorisation remains in force and wave-specific CS2 wave-start authorisation has been granted.

---

## 1. Purpose

This document is the **authoritative alignment plan and wave execution roadmap** for integrating the legacy document chunking and knowledge ingestion system (formalised in DCKIS v1.0.0) into the MAT module and AIMC Knowledge Centre architecture.

It provides:

1. **Gap analysis** — what exists in legacy vs. what the target state in MAT/AIMC requires
2. **Accelerated approach** — what is taken directly from legacy vs. what must adapt
3. **Wave sequencing** — new waves and amendments to the Combined Execution Plan
4. **RED gate test requirements** — test identifiers and descriptions per wave
5. **Task breakdown** — delegated work for governance-liaison, schema-builder, api-builder, ui-builder, qa-builder
6. **Wave start criteria and acceptance checkpoints** — what must be true before each wave begins
7. **Tracker references and success criteria** — DCKIS §10 SC-1 through SC-10 mapped to wave acceptance checkpoints

This plan does **not** authorise any wave to begin. CS2 wave-start authorisation is required for each wave individually.

---

## 2. Gap Analysis

### 2.1 Legacy Pipeline 2 vs. Target State

| Component | Legacy Location | Target Location | Gap Type | Gap Severity |
|---|---|---|---|---|
| Chunk Tester UI | `apps/maturion-maturity-legacy/src/components/qa/DocumentChunkTester.tsx` | `modules/mat/frontend/src/components/knowledge/` | **Migration** | HIGH |
| Document Upload Processor UI | `apps/maturion-maturity-legacy/src/components/ai/DocumentUploadProcessor.tsx` | `modules/mat/frontend/src/components/knowledge/` | **Migration** | HIGH |
| Knowledge Upload Zone UI | `apps/maturion-maturity-legacy/src/components/ai/MaturionKnowledgeUploadZone.tsx` | Superseded by unified MAT component | **Adapt + migrate** | MEDIUM |
| Unified Document Uploader UI | `apps/maturion-maturity-legacy/src/components/ai/UnifiedDocumentUploader.tsx` | `modules/mat/frontend/src/components/knowledge/` | **Migration** | HIGH |
| Upload Hook | `apps/maturion-maturity-legacy/src/hooks/useMaturionDocuments.ts` | `modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts` | **Migration + adapt** | HIGH |
| process-document-v2 Edge Function | `apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts` | `packages/ai-centre/supabase/functions/process-document-v2/index.ts` | **Re-host + re-target** | HIGH |
| process-ai-document Edge Function | `apps/maturion-maturity-legacy/supabase/functions/process-ai-document/index.ts` | `packages/ai-centre/supabase/functions/process-ai-document/index.ts` | **Re-host + re-target** | MEDIUM |
| RAG Engine | `apps/maturion-maturity-legacy/src/agents/maturion/rag/documentRetrieval.ts` | `packages/ai-centre/` (governed) | **Future wave — AIMC** | LOW (this plan) |
| Output table | `document_chunks` (legacy Supabase) | `ai_knowledge` (AIMC-governed) | **Schema delta** | CRITICAL |
| Domain tagging | Free-text `domain` field (legacy) | AIMC `source` taxonomy (governed) | **Governance alignment** | HIGH |
| Approval workflow | None (legacy) | `approval_status = 'pending'` + ARC Protocol | **Governance addition** | HIGH |
| organisation_id scoping | Present in legacy | Required + RLS-enforced in AIMC | **Verify + confirm** | HIGH |

### 2.2 MAT Governance Documents — Gap vs. Target

| Document | Current State | Required Addition | Gap |
|---|---|---|---|
| `modules/mat/00-app-description/app-description.md` | Pipeline 1 only | New §6.3 Knowledge Document Upload (Pipeline 2) | **MISSING** |
| `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` | STEP 2: Criteria Upload only | New STEP 2b: Knowledge Upload workflow | **MISSING** |
| `modules/mat/01-frs/functional-requirements.md` | FR-001–FR-113 (Pipeline 1 only) | FR-KU-001–FR-KU-005 (Pipeline 2) | **MISSING** |
| `modules/mat/01.5-trs/technical-requirements-specification.md` | TR-001–TR-112 (Pipeline 1 only) | TR-KU-001–TR-KU-004 (Pipeline 2) | **MISSING** |
| `modules/mat/02-architecture/system-architecture.md` | Pipeline 1 architecture | New §4.3 Knowledge Ingestion Pipeline | **MISSING** |
| `modules/mat/03-implementation-plan/implementation-plan.md` | Waves 0–16 (Pipeline 1 + AIMC wiring) | New Wave 17: Knowledge Upload Centre Integration | **MISSING** |
| `modules/mat/02-architecture/test-strategy.md` | Pipeline 1 test coverage | Pipeline 2 RED gate test requirements | **MISSING** |

### 2.3 AIMC Programme — Gap vs. Target

| AIMC Item | Current State | Required State | Gap |
|---|---|---|---|
| CL-5-D2 (upload architecture review) | Outstanding deliverable | Completed against `process-document-v2` as candidate | **OUTSTANDING** |
| CL-11 (Knowledge Upload Centre implementation) | PENDING (blocked on CL-5-D2 + predecessors) | Scoped to legacy pipeline as implementation candidate | **SCOPE CLARIFICATION NEEDED** |
| CL-3 Deprecation Register | Not yet produced | Legacy Pipeline 2 components classified as `PARALLEL-RUN` | **AWAITING CL-3 WAVE** |
| `ai_knowledge` schema | Exists in `packages/ai-centre/` | Must accommodate chunk-level metadata from legacy `document_chunks` | **SCHEMA DELTA TO VERIFY** |

### 2.4 Accelerated Approach Summary

| Item | Approach | Justification |
|---|---|---|
| UI Components (DocumentChunkTester, UnifiedDocumentUploader) | **Take directly** — migrate with minimal domain label adaptation | Production-tested; only change is AIMC source taxonomy labels |
| process-document-v2 Edge Function | **Take directly** — re-host, re-target output table | Mature, production-tested; only change is table target + AIMC metadata fields |
| Smart Chunk Reuse logic | **Take directly** — no changes (ADR-002) | Proven cost optimisation; no governance conflict |
| Output table target | **Must adapt** — `document_chunks` → `ai_knowledge` | ADR-001: AIMC canonical knowledge store |
| Domain taxonomy | **Must adapt** — free-text → AIMC source taxonomy (§5 mapping) | ADR-004: required for CL-8 routing |
| Approval workflow | **New addition** — `approval_status = 'pending'` on insert | ADR-003: GRS-governed quality control |
| MAT governance documents | **Must produce** — 7 documents require amendment | DCKIS §7: governance clarifications precede implementation |
| Pipeline 1 (Criteria Parsing) | **Untouched** — ADR-005 is absolute | DCKIS §3.1, ADR-005: architecturally separate |

---

## 3. Wave Sequencing

The following new waves are proposed for integration into the existing MAT and AIMC/LKIAC execution plans. All waves require individual CS2 wave-start authorisation.

### Wave Roster for DCKIS Integration

| Wave ID | Title | Type | Depends On | Priority |
|---|---|---|---|---|
| **DCKIS-GOV-001** | MAT Governance Document Amendments | Governance (no code) | DCKIS strategy CS2-authorised | **IMMEDIATE** |
| **DCKIS-CL5D2** | CL-5-D2: Upload Architecture Review | Architecture review | DCKIS-GOV-001 | **HIGH** |
| **DCKIS-SCH-001** | `ai_knowledge` Schema Delta Assessment | Schema review + migration (if needed) | DCKIS-CL5D2 | **HIGH** |
| **DCKIS-QA-RED** | Pipeline 2 RED Gate Test Suite | QA (tests only, RED) | DCKIS-GOV-001 (FRS/TRS must exist) | **HIGH** |
| **DCKIS-IMPL-001** | Pipeline 2 Implementation — Edge Functions | API implementation | DCKIS-SCH-001, DCKIS-QA-RED | **HIGH** |
| **DCKIS-IMPL-002** | Pipeline 2 Implementation — MAT Frontend UI | UI implementation | DCKIS-IMPL-001 | **HIGH** |
| **DCKIS-CL11** | AIMC CL-11 Scope Alignment | Programme admin | DCKIS-IMPL-001 + DCKIS-IMPL-002 | **MEDIUM** |

> **Note on MAT Implementation Plan**: Wave 17 (Knowledge Upload Centre Integration) must be added to `modules/mat/03-implementation-plan/implementation-plan.md` as part of Wave DCKIS-GOV-001. The existing Wave 16.x sub-waves are Pipeline-1-repair scope. Wave 17 is a new, independent Pipeline 2 integration scope.

> **Note on Sequencing Conflict**: Wave 17 (DCKIS Pipeline 2) does not conflict with Waves 16.3/16.4/16.5 (AIMC Scoring/Reporting Wiring — blocked on AIMC Waves 3–4). They are independent scope in the MAT implementation plan.

---

## 4. Detailed Wave Specifications

### Wave DCKIS-GOV-001: MAT Governance Document Amendments

**Type**: Governance documentation — no production code changes  
**Responsible Agent**: `governance-liaison-isms-agent`  
**Estimated Duration**: 1–2 days  
**CS2 Checkpoint**: After amendments are merged and confirmed

#### Entry Criteria

- [ ] DCKIS strategy document header updated to `CS2-AUTHORISED` (T-DCKIS-002)
- [ ] This alignment plan merged and CS2-acknowledged
- [ ] CS2 wave-start authorisation for DCKIS-GOV-001

#### Deliverables

| ID | Document | Section | Amendment |
|---|---|---|---|
| GOV-001-D1 | `modules/mat/00-app-description/app-description.md` | New §6.3 | Knowledge Document Upload (Pipeline 2) — purpose, actor (Content Administrator), document types, target table (`ai_knowledge`), AIMC governance link |
| GOV-001-D2 | `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` | New STEP 2b | Knowledge Upload workflow — actor: Content Administrator; UI: Knowledge Upload panel; pipeline: chunk tester → process-document-v2 → ai_knowledge; approval_status display |
| GOV-001-D3 | `modules/mat/01-frs/functional-requirements.md` | FR-KU-001 to FR-KU-005 | Pipeline 2 functional requirements (see §6 of this plan for full FR definitions) |
| GOV-001-D4 | `modules/mat/01.5-trs/technical-requirements-specification.md` | TR-KU-001 to TR-KU-004 | Pipeline 2 technical requirements (see §7 of this plan for full TR definitions) |
| GOV-001-D5 | `modules/mat/02-architecture/system-architecture.md` | New §4.3 | Knowledge Ingestion Pipeline architecture — component diagram (text), data flow, table targets, ADR references |
| GOV-001-D6 | `modules/mat/03-implementation-plan/implementation-plan.md` | New Wave 17 | Wave 17: Knowledge Upload Centre Integration (Pipeline 2 migration from legacy) — builder assignments, test IDs, entry/exit criteria |
| GOV-001-D7 | `modules/mat/02-architecture/test-strategy.md` | New Pipeline 2 section | Pipeline 2 test coverage requirements — RED gate test structure, chunk tester, upload processor, domain tagging, ARC status display |

#### EXIT Criteria

- All 7 deliverables merged
- No production code changed (governance-only PR)
- FRS and TRS updated with FR-KU-001–005 and TR-KU-001–004
- implementation-plan.md Wave 17 entry present
- IAA audit token received

---

### Wave DCKIS-CL5D2: CL-5-D2 Upload Architecture Review

**Type**: Architecture review — produces artefact only  
**Responsible Agent**: `api-builder`  
**Estimated Duration**: 1 day  
**CS2 Checkpoint**: CL-5 checkpoint (CL-5-CP-2)

#### Entry Criteria

- [ ] DCKIS-GOV-001 merged (FRS/TRS must formally exist before architecture review)
- [ ] CS2 wave-start authorisation for DCKIS-CL5D2
- [ ] `apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts` accessible

#### Deliverables

| ID | Artefact | Location |
|---|---|---|
| CL5D2-D1 | Upload architecture review document | `.agent-workspace/audit/AIMC-P1-upload-arch-review-20260319.md` |

**Architecture Review Must Cover**:
1. Confirm `process-document-v2` can be re-hosted in `packages/ai-centre/supabase/functions/`
2. Document schema delta: legacy `document_chunks` columns vs. AIMC `ai_knowledge` columns — identify any gaps (expected: `source`, `approval_status` as additions; `organisation_id` already present in legacy)
3. Confirm Smart Chunk Reuse (`chunked_from_tester` / `approved_via_tester`) is portable
4. Identify any dependency on legacy Supabase project-specific settings (env vars, secrets) that must be migrated
5. Produce architecture review artefact with explicit PASS/FAIL verdict on re-hosting feasibility

#### Exit Criteria

- CL5D2-D1 committed and merged
- CL-5-D2 deliverable recorded as COMPLETE in `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`
- CL-5 formally COMPLETE (CL-5-D1 was already delivered; CL-5-D2 is the only outstanding item)

---

### Wave DCKIS-SCH-001: `ai_knowledge` Schema Delta Assessment

**Type**: Schema review + migration (if required)  
**Responsible Agent**: `schema-builder`  
**Estimated Duration**: 1 day (review) + 1 day (migration, if required)  
**CS2 Checkpoint**: After schema assessment; before implementation begins

#### Entry Criteria

- [ ] DCKIS-CL5D2 merged (schema delta identified in architecture review)
- [ ] CS2 wave-start authorisation for DCKIS-SCH-001

#### Deliverables

| ID | Artefact | Condition |
|---|---|---|
| SCH-001-D1 | Schema delta assessment report | Always |
| SCH-001-D2 | Migration: add `source` column to `ai_knowledge` (if not present) | If gap found |
| SCH-001-D3 | Migration: confirm/add `chunk_size`, `chunk_overlap`, `chunk_index` metadata columns | If gap found |
| SCH-001-D4 | Migration: RLS policy for `ai_knowledge` INSERT (org-scoped, `approval_status = 'pending'` enforced) | If gap found |

#### Exit Criteria

- `ai_knowledge` schema confirmed to support chunk-level metadata from `process-document-v2`
- All required columns present with correct types and RLS policies
- No breaking changes to existing `ai_knowledge` consumers
- IAA audit token received

---

### Wave DCKIS-QA-RED: Pipeline 2 RED Gate Test Suite

**Type**: QA — tests written to RED (no implementation)  
**Responsible Agent**: `qa-builder`  
**Estimated Duration**: 2 days  
**CS2 Checkpoint**: After RED suite committed (before implementation begins)

#### Entry Criteria

- [ ] DCKIS-GOV-001 merged (FR-KU-001–005 and TR-KU-001–004 must exist before tests can be written)
- [ ] CS2 wave-start authorisation for DCKIS-QA-RED

#### Test IDs and Descriptions

The following RED gate tests must be written. All must FAIL (RED) at time of submission — confirming no implementation has been added prematurely.

| Test ID | Description | FR/TR Reference |
|---|---|---|
| T-KU-001 | Knowledge Upload panel renders with file picker and domain selector | FR-KU-001, FR-KU-003 |
| T-KU-002 | Chunk Preflight Tester shows local chunk preview with size=2000 and overlap=200 before upload | FR-KU-002, TR-KU-001 |
| T-KU-003 | Domain selection at upload time maps to valid AIMC `source` taxonomy value | FR-KU-003, TR-KU-003 |
| T-KU-004 | Uploaded document appears in `ai_knowledge` with `approval_status = 'pending'` | FR-KU-001, TR-KU-003 |
| T-KU-005 | Uploaded document appears in `ai_knowledge` with correct `organisation_id` scoping | TR-KU-004 |
| T-KU-006 | ARC approval status (`pending` / `approved` / `rejected`) is visible in the MAT UI | FR-KU-004 |
| T-KU-007 | Re-upload of same document triggers Smart Chunk Reuse (no duplicate embedding cost) | ADR-002 |
| T-KU-008 | Pipeline 2 upload does NOT affect criteria table or Pipeline 1 workflow | ADR-005, FR-KU-001 |
| T-KU-009 | File validation rejects invalid file types (non-.docx/.pdf/.txt/.md) | TR-KU-001 |
| T-KU-010 | Re-upload / retry flow works after a failed upload attempt | FR-KU-005 |
| T-KU-011 | process-document-v2 Edge Function produces correct chunk count from .docx test fixture | TR-KU-001 |
| T-KU-012 | process-document-v2 Edge Function produces 1536-dim embedding for each chunk | TR-KU-002 |

**Total RED gate tests**: 12 (T-KU-001 through T-KU-012)

#### Exit Criteria

- All 12 tests written and committed
- All 12 tests FAIL (RED) — confirming no implementation exists
- Zero GREEN tests in this test file at handover
- IAA audit token received

---

### Wave DCKIS-IMPL-001: Pipeline 2 Implementation — Edge Functions

**Type**: API implementation  
**Responsible Agent**: `api-builder`  
**Estimated Duration**: 3 days  
**Depends On**: DCKIS-SCH-001 (schema confirmed), DCKIS-QA-RED (RED tests present)  
**CS2 Checkpoint**: After implementation; after GREEN gate achieved

#### Entry Criteria

- [ ] DCKIS-SCH-001 merged (`ai_knowledge` schema confirmed)
- [ ] DCKIS-QA-RED merged (12 RED tests in place, all failing)
- [ ] CS2 wave-start authorisation for DCKIS-IMPL-001

#### Deliverables

| ID | Artefact | Details |
|---|---|---|
| IMPL-001-D1 | Re-hosted Edge Function | `packages/ai-centre/supabase/functions/process-document-v2/index.ts` (migrated from legacy, output table re-targeted to `ai_knowledge`) |
| IMPL-001-D2 | Re-hosted Edge Function | `packages/ai-centre/supabase/functions/process-ai-document/index.ts` (migrated from legacy) |
| IMPL-001-D3 | AIMC metadata integration | `source` domain tag, `approval_status = 'pending'`, `organisation_id` scoping in Edge Function output |
| IMPL-001-D4 | Smart Chunk Reuse preserved | `chunked_from_tester` / `approved_via_tester` short-circuit path retained |
| IMPL-001-D5 | Knowledge upload API hook | `modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts` — typed hook for Pipeline 2 upload |

**Pipeline 1 Preservation Constraint (ADR-005 — HARD)**: api-builder MUST NOT modify any of the following:
- `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx`
- `supabase/functions/invoke-ai-parse-criteria/`
- `apps/mat-ai-gateway/services/parsing.py`
- Any `criteria`, `domains`, or `mini_performance_standards` table migrations

Any PR that touches Pipeline 1 files will be **REJECTED by IAA** with reference to ADR-005.

#### Exit Criteria

- All 12 T-KU-xxx tests GREEN (T-KU-004, T-KU-005, T-KU-007, T-KU-008, T-KU-009, T-KU-011, T-KU-012 are backend-testable at this stage)
- Zero Pipeline 1 files modified
- IAA audit token received

---

### Wave DCKIS-IMPL-002: Pipeline 2 Implementation — MAT Frontend UI

**Type**: UI implementation  
**Responsible Agent**: `ui-builder`  
**Estimated Duration**: 3 days  
**Depends On**: DCKIS-IMPL-001 (Edge Functions and hook available)  
**CS2 Checkpoint**: After implementation; after full GREEN gate

#### Entry Criteria

- [ ] DCKIS-IMPL-001 merged (backend hook available)
- [ ] CS2 wave-start authorisation for DCKIS-IMPL-002

#### Deliverables

| ID | Artefact | Details |
|---|---|---|
| IMPL-002-D1 | Knowledge Upload Panel component | `modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx` — wraps DocumentChunkTester + UnifiedDocumentUploader, integrated with `useKnowledgeDocuments` hook |
| IMPL-002-D2 | Document Chunk Tester component | `modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx` — migrated from legacy with AIMC source taxonomy labels |
| IMPL-002-D3 | Knowledge Documents List component | `modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx` — shows `approval_status` badge |
| IMPL-002-D4 | MAT frontend routing + layout | Knowledge Upload panel wired into MAT frontend navigation (distinct from Criteria Upload panel) |
| IMPL-002-D5 | Domain selector | AIMC source taxonomy options: `general`, `iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management` |

**UI Constraint (ADR-005)**: ui-builder MUST clearly distinguish the Knowledge Upload panel (Pipeline 2) from the Criteria Upload panel (Pipeline 1) in the MAT UI. They must NOT be on the same page or share any upload handler.

#### Exit Criteria

- All 12 T-KU-xxx tests GREEN (full GREEN gate — all tests including UI tests T-KU-001 through T-KU-010)
- Knowledge Upload panel is accessible in MAT frontend navigation
- Criteria Upload panel is unaffected and continues to function
- Zero Pipeline 1 files modified
- IAA audit token received

---

### Wave DCKIS-CL11: AIMC CL-11 Scope Alignment

**Type**: Programme administration (governance update)  
**Responsible Agent**: `governance-liaison-isms-agent`  
**Estimated Duration**: 0.5 day  
**Depends On**: DCKIS-IMPL-001 + DCKIS-IMPL-002 merged  
**CS2 Checkpoint**: After update; before CL-11 formally closed

#### Entry Criteria

- [ ] DCKIS-IMPL-001 and DCKIS-IMPL-002 merged and GREEN gate confirmed
- [ ] CS2 wave-start authorisation for DCKIS-CL11

#### Deliverables

| ID | Artefact | Details |
|---|---|---|
| CL11-D1 | CL-11 scope update in Combined Execution Plan | Update `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` — CL-11 scope recorded as covered by DCKIS-IMPL-001 + DCKIS-IMPL-002; reference to this alignment plan and DCKIS strategy |
| CL11-D2 | CL-3 Deprecation Register entries | When CL-3 produces the Deprecation Register, the following legacy components are classified as `PARALLEL-RUN`: `DocumentUploadProcessor.tsx`, `MaturionKnowledgeUploadZone.tsx`, `UnifiedDocumentUploader.tsx`, `process-document-v2`, `process-ai-document`, `DocumentChunkTester.tsx` |

#### Exit Criteria

- CL-11 status in Combined Execution Plan updated
- CL-3 Deprecation Register entries staged (or note added to CL-3 wave for future action)
- IAA audit token received

---

## 5. Wave Start Criteria Summary

### Overall Programme Prerequisites

Before any DCKIS implementation wave begins, ALL of the following must be true:

1. **DCKIS strategy CS2-authorised** — `DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md` header updated to `CS2-AUTHORISED`
2. **This alignment plan merged** — `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` is live
3. **IAA Pre-Brief on file** — `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md` committed
4. **No in-flight Pipeline 1 conflicts** — Wave 18 repair (PR #1163) must be merged before any DCKIS-IMPL wave begins (to avoid conflicts in `modules/mat/frontend/`)

### Per-Wave Start Criteria

| Wave | Gate 1 | Gate 2 | Gate 3 | CS2 Authorization |
|---|---|---|---|---|
| DCKIS-GOV-001 | DCKIS strategy CS2-authorised | This plan merged | — | Required |
| DCKIS-CL5D2 | DCKIS-GOV-001 merged | — | — | Required |
| DCKIS-SCH-001 | DCKIS-CL5D2 merged | CL5D2-D1 committed | — | Required |
| DCKIS-QA-RED | DCKIS-GOV-001 merged (FR/TR exist) | — | — | Required |
| DCKIS-IMPL-001 | DCKIS-SCH-001 merged | DCKIS-QA-RED merged | Wave 18 PR merged | Required |
| DCKIS-IMPL-002 | DCKIS-IMPL-001 merged | — | — | Required |
| DCKIS-CL11 | DCKIS-IMPL-001 + IMPL-002 merged | — | — | Required |

---

## 6. Pipeline 2 Functional Requirements (FR-KU-001 to FR-KU-005)

These requirements are the formal definitions for GOV-001-D3. `governance-liaison-isms-agent` must add these verbatim (or with minor editorial improvements) to `modules/mat/01-frs/functional-requirements.md`.

### FR-KU-001: Knowledge Document Upload

**Description**: A Content Administrator can upload guidance documents, training materials, organisational policies, and reference documents to the MAT Knowledge Base via a dedicated Knowledge Upload panel distinct from the Criteria Upload panel.

**Acceptance Criteria**:
1. The Knowledge Upload panel is reachable from the MAT navigation
2. The Knowledge Upload panel does NOT share any code path, route, or upload handler with the Criteria Upload panel (Pipeline 1)
3. Supported file types: `.docx`, `.pdf`, `.txt`, `.md`
4. File size limits consistent with existing evidence upload constraints
5. Uploaded documents appear in the `ai_knowledge` table (not `criteria`, `domains`, or `mini_performance_standards`)

### FR-KU-002: Chunk Preflight Tester

**Description**: Before finalising a knowledge document upload, the system presents a QA preflight view showing the document split into chunks (chunk size = 2000 characters, overlap = 200 characters, sentence-boundary aware). The Content Administrator can approve or reject the chunk split before any AI processing credits are consumed.

**Acceptance Criteria**:
1. Chunk preview is generated locally (client-side) before network call
2. Chunk count, average chunk length, and first 3 chunks are shown
3. Approve action proceeds to embedding generation
4. Reject/Cancel action discards without any database write

### FR-KU-003: Domain Tagging at Upload

**Description**: The Content Administrator selects a domain (`source`) from the AIMC-governed taxonomy at upload time. The selected domain is stored in the `ai_knowledge.source` column.

**Acceptance Criteria**:
1. Domain selector presents: `general`, `iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management`
2. Domain selection is mandatory (upload cannot proceed without selection)
3. Selected domain is stored in `ai_knowledge.source` for every chunk produced by the upload

### FR-KU-004: ARC Approval Status Display

**Description**: Uploaded knowledge documents are visible in a list within the MAT UI, showing their current ARC approval status (`pending`, `approved`, `rejected`).

**Acceptance Criteria**:
1. Knowledge Documents List panel shows document name, upload date, domain tag, and approval status
2. `pending` status is visually distinguished from `approved` and `rejected`
3. The list is scoped to the current organisation (`organisation_id`)
4. Content Administrators cannot bypass the `pending` state — documents enter `ai_knowledge` with `approval_status = 'pending'` only

### FR-KU-005: Re-upload and Retry

**Description**: If a knowledge document upload fails at any stage, the Content Administrator can retry without duplicate data being written to `ai_knowledge`.

**Acceptance Criteria**:
1. A failed upload that wrote partial chunks can be retried cleanly (duplicate detection at chunk level)
2. Smart Chunk Reuse: if pre-approved chunks exist for the same document content, the upload short-circuits embedding generation and reuses stored chunks
3. Retry UI feedback is distinct from "first upload in progress" state

---

## 7. Pipeline 2 Technical Requirements (TR-KU-001 to TR-KU-004)

These requirements are the formal definitions for GOV-001-D4. `governance-liaison-isms-agent` must add these to `modules/mat/01.5-trs/technical-requirements-specification.md`.

### TR-KU-001: Chunk-Based Ingestion

**Description**: The Pipeline 2 ingestion backend (`process-document-v2`) chunks documents using the proven parameters: chunk size = 2000 characters, overlap = 200 characters, sentence-boundary aware splitting.

**Technical Constraints**:
1. Chunking algorithm: identical to legacy `splitTextIntoChunks(text, 2000, 200)` implementation
2. File format support: `.docx` (mammoth extraction), `.pdf` (text layer extraction), `.txt` / `.md` (plain text)
3. Empty chunks are discarded before embedding
4. Minimum chunk length: 50 characters (discard shorter artefacts)

### TR-KU-002: Embedding Generation

**Description**: Each chunk produced by Pipeline 2 is embedded using an OpenAI-compatible 1536-dimension embedding model via the AIMC AI Gateway.

**Technical Constraints**:
1. Embedding dimensions: 1536
2. Embedding calls MUST route through AIMC AI Gateway (`/api/ai/embed` or equivalent) — direct OpenAI API calls are prohibited
3. Embedding failure on any chunk causes the entire upload to fail (no partial writes)

### TR-KU-003: AIMC Knowledge Store Integration

**Description**: Pipeline 2 output writes to `ai_knowledge` with mandatory AIMC governance fields.

**Technical Constraints**:
1. All rows written with `approval_status = 'pending'` — never `approved` on insert
2. `source` field populated from AIMC taxonomy (FR-KU-003 domain selection)
3. `organisation_id` set to the uploading user's organisation (RLS-verified)
4. Chunk metadata fields: `chunk_index` (0-based), `chunk_size`, `chunk_overlap`, `source_document_name`

### TR-KU-004: Organisation-ID Scoping

**Description**: All knowledge documents and chunks written by Pipeline 2 are scoped to the uploading user's organisation.

**Technical Constraints**:
1. `organisation_id` is set server-side (Edge Function reads from authenticated user's profile) — not client-supplied
2. RLS policy on `ai_knowledge` MUST enforce `organisation_id` isolation on SELECT and INSERT
3. Cross-organisation chunk access is prohibited

---

## 8. DCKIS v1.0.0 Success Criteria — Acceptance Checkpoint Mapping

All SC items from DCKIS §10 are mapped to wave acceptance checkpoints in this plan:

| DCKIS SC | Description | Wave | Acceptance Checkpoint |
|---|---|---|---|
| **SC-1** | MAT frontend has Knowledge Upload panel distinct from Criteria Upload panel | DCKIS-IMPL-002 | T-KU-001 GREEN; UI navigation confirms two distinct panels |
| **SC-2** | Documents uploaded via Pipeline 2 in `ai_knowledge` with `approval_status='pending'`, correct `source` tag, `organisation_id` scoping | DCKIS-IMPL-001 + IMPL-002 | T-KU-004, T-KU-005 GREEN |
| **SC-3** | Smart Chunk Reuse functional | DCKIS-IMPL-001 | T-KU-007 GREEN |
| **SC-4** | ARC approval status visible in MAT UI | DCKIS-IMPL-002 | T-KU-006 GREEN |
| **SC-5** | At least one advisory agent can retrieve knowledge from Pipeline 2 documents | Future wave (AIMC Wave 7+ / DCKIS-CL11 downstream) | Not in this plan — AIMC Waves 7–9 gate |
| **SC-6** | 100% GREEN test gate on all Pipeline 2 RED gate tests | DCKIS-IMPL-002 (final GREEN gate) | All T-KU-001–012 GREEN, zero stubs/skipped |
| **SC-7** | MAT governance documents formally document Pipeline 2 | DCKIS-GOV-001 | All 7 GOV-001-Dx deliverables merged |
| **SC-8** | CL-3 Deprecation Register records migrated legacy components as `PARALLEL-RUN` | DCKIS-CL11 | CL11-D2 committed |
| **SC-9** | CL-5-D2 upload architecture review complete | DCKIS-CL5D2 | CL5D2-D1 committed; CL-5 COMPLETE recorded in Combined Execution Plan |
| **SC-10** | CL-11 scope confirmed as covered by Pipeline 2 integration wave | DCKIS-CL11 | CL11-D1 committed |

> **SC-5 Note**: The advisory agent retrieval capability (SC-5) depends on AIMC Waves 7–9 (currently BLOCKED pending AIMC Wave 3 delivery). The DCKIS integration plan cannot unblock AIMC Waves 7–9 — it can only populate the `ai_knowledge` table. SC-5 will be declared complete when AIMC Wave 7 (Advisory Integration) closes successfully with knowledge retrieval confirmed.

---

## 9. Domain Taxonomy Mapping (DCKIS §5 — Confirmed)

| Legacy Domain Label | AIMC `source` Tag | FR-KU-003 Selector Label |
|---|---|---|
| `Global Platform Logic` | `general` | General |
| `ISO 27001` | `iso27001` | ISO 27001 |
| `NIST` | `nist` | NIST |
| `PCI DSS` | `pci-dss` | PCI DSS |
| `SOC 2` | `soc2` | SOC 2 |
| `Risk Management` | `risk-management` | Risk Management |
| `Maturity Roadmap` | `general` | General |
| `Training Content` | `general` | General |

---

## 10. Agent Delegation Summary

| Wave | Lead Agent | Support Agents | Foreman Supervision Points |
|---|---|---|---|
| DCKIS-GOV-001 | `governance-liaison-isms-agent` | `mat-specialist` (domain review) | QP evaluation after all 7 deliverables; Architecture compliance check (no Pipeline 1 changes) |
| DCKIS-CL5D2 | `api-builder` | — | QP evaluation of architecture review artefact; CL-5-D2 closure confirmation |
| DCKIS-SCH-001 | `schema-builder` | — | QP evaluation of schema delta report; Migration review (no breaking changes to existing consumers) |
| DCKIS-QA-RED | `qa-builder` | — | QP evaluation: verify all 12 tests FAIL (RED); zero GREEN at time of handover |
| DCKIS-IMPL-001 | `api-builder` | `schema-builder` (RLS verification) | QP evaluation: 100% GREEN on backend tests; ADR-005 compliance (zero Pipeline 1 changes) |
| DCKIS-IMPL-002 | `ui-builder` | `qa-builder` (final GREEN gate) | QP evaluation: 100% GREEN on all 12 tests; Pipeline 1 unaffected; ARC status visible |
| DCKIS-CL11 | `governance-liaison-isms-agent` | — | QP evaluation: Combined Execution Plan updated; CL-11 scope confirmed |

---

## 11. Risk Register

| Risk ID | Description | Severity | Mitigation |
|---|---|---|---|
| RISK-001 | `ai_knowledge` schema missing required chunk metadata columns | HIGH | DCKIS-SCH-001 explicitly assesses this before IMPL-001 begins |
| RISK-002 | `process-document-v2` has implicit dependency on legacy Supabase project env vars | HIGH | DCKIS-CL5D2 architecture review must identify all env var dependencies |
| RISK-003 | Pipeline 1 affected by Pipeline 2 UI work (ADR-005 violation) | CRITICAL | IAA Pre-Brief and per-wave IAA audits will verify ADR-005 compliance |
| RISK-004 | Smart Chunk Reuse logic not portable (table schema mismatch) | MEDIUM | DCKIS-SCH-001 and DCKIS-CL5D2 both assess chunk reuse portability |
| RISK-005 | Wave 18 PR (#1163) not merged before DCKIS-IMPL waves begin (file conflict risk) | MEDIUM | DCKIS-IMPL-001 entry criteria gate: Wave 18 PR merged |
| RISK-006 | SC-5 (advisory agent retrieval) creates incorrect expectation of immediate delivery | MEDIUM | SC-5 is explicitly noted as dependent on AIMC Waves 7–9 |

---

## 12. AIMC/LKIAC Combined Execution Plan — Proposed Amendments

The following amendments are proposed to `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`:

1. **CL-5-D2 status**: Mark as actionable now (DCKIS-CL5D2 wave provides the delivery vehicle)
2. **CL-11 scope**: Add note: "CL-11 implementation candidate confirmed as legacy `process-document-v2` pipeline per DCKIS v1.0.0 strategy and MAT Knowledge Ingestion Alignment Plan"
3. **DCKIS integration waves**: Add footnote referencing this alignment plan as the governing document for the Pipeline 2 integration sequence
4. **SC-5 dependency**: Note that DCKIS-CL11 feeds CL-11, which in turn enables AIMC Waves 7–9 advisory agent retrieval

These amendments are delegated to `governance-liaison-isms-agent` as part of Wave DCKIS-GOV-001 scope (or as a parallel documentation task if timing requires separation).

---

## 13. Amendment Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0.0 | 2026-03-19 | foreman-v2-agent v6.2.0 (session-dckis-alignment-plan-20260319) | Initial alignment plan — produced from DCKIS v1.0.0 strategy per CS2-authorised GitHub issue |

---

*This document is a Foreman POLC Planning Output — Alignment Plan.*
*It does NOT constitute a wave-start authorisation for any wave.*
*Each wave in §4 requires individual CS2 wave-start authorisation before work begins.*
*Authority: CS2 (Johan Ras / @APGI-cmy)*
*Governed by: LIVING_AGENT_SYSTEM.md v6.2.0 | Contract: foreman-v2-agent v6.2.0 (2.7.0)*
