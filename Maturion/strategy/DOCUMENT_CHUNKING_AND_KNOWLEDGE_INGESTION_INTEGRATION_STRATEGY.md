# Document Chunking and Knowledge Ingestion Integration Strategy

| Field | Value |
|-------|-------|
| **Document Type** | Strategy — CS2 Planning Output |
| **Status** | CS2-AUTHORISED — Foreman Alignment Plan produced at `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` v1.0.0 |
| **Version** | 1.0.0 |
| **Date** | 2026-03-19 |
| **Author** | GitHub Copilot (on behalf of CS2) |
| **Location** | `Maturion/strategy/DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md` |
| **Authority** | CS2 (Johan Ras / @APGI-cmy) |
| **Triggering Observation** | Legacy app contains a production-grade document upload and chunking system. MAT module criteria parsing pipeline exists but has a production gap. AIMC Knowledge Upload Centre (CL-11) is planned but blocked on 5 predecessor waves. The legacy chunking system is the working prototype of what the plan intends to build. |

---

## 1. Purpose

This strategy document defines the integration approach for migrating the document chunking and knowledge ingestion capability from `apps/maturion-maturity-legacy/` into the MAT module and the AIMC Knowledge Centre architecture. It provides the strategic foundation that Foreman will use to produce an alignment plan and waved execution roadmap.

The strategy answers three questions:

1. **What already exists** that should not be rebuilt
2. **What needs to change** in the MAT module to accommodate two distinct document pipelines
3. **How this accelerates** the existing AIMC/LKIAC programme (specifically CL-5, CL-6, CL-11) without violating wave sequencing or governance rules

---

## 2. Context and Strategic Trigger

### 2.1 The Legacy Asset

The `apps/maturion-maturity-legacy/` application contains a complete, production-tested document ingestion stack:

| Component | File | Status |
|---|---|---|
| Document Chunk Tester (QA preflight) | `src/components/qa/DocumentChunkTester.tsx` | Production-tested |
| Document Upload Processor | `src/components/ai/DocumentUploadProcessor.tsx` | Production-tested |
| Knowledge Upload Zone | `src/components/ai/MaturionKnowledgeUploadZone.tsx` | Production-tested |
| Unified Document Uploader | `src/components/ai/UnifiedDocumentUploader.tsx` | Active (Phase 1 migration target) |
| Upload Hook | `src/hooks/useMaturionDocuments.ts` | Production-tested |
| Server-side Processing Pipeline | `supabase/functions/process-document-v2/index.ts` | Production-tested |
| Primary AI Document Processor | `supabase/functions/process-ai-document/index.ts` | Production-tested |
| RAG Engine | `src/agents/maturion/rag/documentRetrieval.ts` | Production-tested |

Key capabilities delivered by this stack:
- File validation: `.docx`, `.pdf`, `.txt`, `.md` — MIME type + signature verification
- Text extraction: `mammoth` (DOCX), PDF text layer, plain text fallback
- Chunking: `splitTextIntoChunks(text, chunkSize=2000, overlap=200)` — sentence-boundary aware
- Smart Chunk Reuse: pre-approved chunk bypass to avoid reprocessing costs
- Metadata tagging: `document_type`, `domain`, `tags`, `visibility`, `organisation_id`
- Server-side embedding: 1536-dim OpenAI-compatible vector generation
- QA preflight: local chunk preview + approval gate before any AI credits consumed
- Processing pipeline: download → extract → chunk → embed → store → QA metrics

### 2.2 The MAT Situation

The MAT module has **one** document processing pipeline (Pipeline 1 — Criteria Parsing):

```
CriteriaUpload.tsx → invoke-ai-parse-criteria (Edge Fn) → mat-ai-gateway/parsing.py
  → INSERT INTO domains / mini_performance_standards / criteria
```

This pipeline:
- Is **architecturally correct** for its purpose
- Has a **production gap** (INC-WAVE15-PARSE-001, INC-W18-CRITERIA-PIPELINE-001) — multiple gaps repaired in Wave 18, with PR open (maturion-isms#1163)
- Serves a **specific, irreplaceable function**: verbatim extraction of compliance criteria from audit documents into a structured Domain → MPS → Criteria hierarchy
- **Must not be replaced** — it is the structural backbone of MAT assessments

### 2.3 The AIMC Programme Status

The AIMC/LKIAC Combined Execution Plan (v1.5.0) currently has:

| Wave | Description | Status |
|---|---|---|
| CL-0 | Governance Foundation | ✅ COMPLETE |
| CL-1 | Maturion Persona Migration | ✅ COMPLETE |
| CL-2 | Legacy Knowledge Inventory | ⏳ STARTED |
| CL-5 | Knowledge Upload Centre Spec | 🟡 IN PROGRESS (CL-5-D2 outstanding) |
| CL-6 | Knowledge Re-ingestion | ⏳ PENDING |
| CL-11 | Knowledge Upload Centre Implementation | ⏳ PENDING |
|
The legacy document upload system is the **working prototype** for CL-11. This strategy proposes accelerating CL-11 by latching the proven legacy implementation into MAT rather than building from scratch.

---

## 3. Strategic Position

### 3.1 Two Distinct Pipelines — Not One

The core architectural insight of this strategy is that MAT requires **two separate, complementary document ingestion pipelines** that must never be conflated:

```
PIPELINE 1 — Criteria Compilation (Existing, Keep)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Purpose:    Extract structured compliance audit criteria from LDCS/standard documents
Input:      Compliance standard documents (LDCS, ISO 27001, NIST, etc.)
Output:     domains → mini_performance_standards → criteria (structured hierarchy)
AI model:   GPT-based structured extraction (verbatim, zero-hallucination rule)
Governance: No-hallucination gate; all criteria source_anchor tracked
Status:     Code-complete; Wave 18 repair in progress (PR #1163)
Owner:      CriteriaUpload.tsx + invoke-ai-parse-criteria + mat-ai-gateway/parsing.py


PIPELINE 2 — Knowledge Ingestion (Migrate from Legacy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Purpose:    Ingest guidance documents, training materials, org policies as knowledge
Input:      Any governance, guidance, training, or reference document
Output:     document_chunks → ai_knowledge table (semantic search + RAG)
AI model:   Embedding model (1536-dim, OpenAI-compatible)
Governance: ARC Knowledge Promotion Protocol; approval_status = 'pending' on upload
Status:     Production-tested in legacy; needs migration to MAT + AIMC table target
Owner:      DocumentChunkTester + process-document-v2 + KnowledgeRetrieverImpl
```

### 3.2 Why This Does Not Redesign the Wheel

The legacy document upload and chunking system is not a prototype to be improved — it is a **mature, production-tested implementation**. The integration work is:

1. **Re-targeting the output table**: `document_chunks` (legacy Supabase) → `ai_knowledge` (AIMC-governed, `packages/ai-centre/`)
2. **Re-hosting the Edge Functions**: `maturion-maturity-legacy/supabase/functions/process-document-v2` → `packages/ai-centre/supabase/functions/` (per CL-3.5 pattern)
3. **Integrating the UI components** into MAT frontend: `DocumentChunkTester.tsx` + `UnifiedDocumentUploader.tsx` → MAT Knowledge Upload panel
4. **Applying AIMC governance**: `organisation_id` scoping, `approval_status = 'pending'`, ARC protocol hook, `source` domain tagging

### 3.3 The Advisory Agent Connection

The advisory agents defined in `.github/copilot-instructions.md` and `packages/ai-centre/agents/` (including `maturion-advisor.md` from CL-1) require a populated `ai_knowledge` table to function correctly. Pipeline 2 is the **production-grade mechanism** for populating that knowledge base. This integration directly enables:

- `maturion-advisor` — cross-domain ISMS consultant (ISO 27001, NIST, PCI DSS, SOC 2)
- `mat-advisor` — ISO 27001, maturity scoring, audit lifecycle
- `isms-navigator` — ISMS programme management
- `course-crafter-advisor` — instructional design and learning content
- All other domain specialists defined in `AIMC_PERSONA_LIFECYCLE.md §2`

---

## 4. Scope of Integration

### 4.1 What This Strategy Covers

1. **Migration of Pipeline 2 from legacy into MAT and AIMC**
   - The UI components (chunk tester, upload zone, upload processor)
   - The Edge Function pipeline (`process-document-v2`)
   - The AIMC table re-targeting (`ai_knowledge` with AIMC schema)
   - Domain taxonomy alignment (legacy labels → AIMC `source` field values)

2. **Updates to MAT governance documents**
   - `app-description.md` — new §6.3 Knowledge Document Upload (Pipeline 2)
   - `MAT_UX_WORKFLOW_AND_WIRING.md` — STEP 2b Knowledge Upload workflow
   - `functional-requirements.md` (FRS) — new functional requirements for Pipeline 2
   - `technical-requirements-specification.md` (TRS) — chunk-based ingestion requirements
   - `system-architecture.md` — §4.3 Knowledge Ingestion Pipeline
   - `implementation-plan.md` — new wave entry for Pipeline 2 integration
   - Test suite — new RED gate tests for knowledge upload component

3. **AIMC/LKIAC programme acceleration**
   - Accelerate CL-5-D2 (upload architecture review) by identifying `process-document-v2` as the candidate
   - Formally designate the legacy upload system as the CL-11 implementation candidate
   - Record this strategy as the authority source for CL-11 scoping decisions
   - Update CL-3 Deprecation Register entries for `DocumentUploadProcessor`, `MaturionKnowledgeUploadZone`, `UnifiedDocumentUploader`, `process-document-v2`, `process-ai-document`

### 4.2 What This Strategy Does NOT Cover

- The MAT criteria parsing pipeline (Pipeline 1) — this is architecturally separate and governed by Wave 18 repair
- The LKIAC one-time knowledge migration from the legacy Supabase project (CL-6) — that remains a separate migration wave
- The AIMC domain specialist routing (CL-8) — this strategy feeds the knowledge base; routing is a downstream concern
- Legacy component decommission (CL-15) — decommission happens only after verified AIMC equivalents are confirmed operational

---

## 5. The Document Domain Taxonomy

The legacy system uses these domain labels. They map to the AIMC source taxonomy as follows (preliminary — to be confirmed by CL-2-D2 domain tagging):

| Legacy Domain Label | AIMC `source` Tag | Notes |
|---|---|---|
| `Global Platform Logic` | `general` | Platform-wide guidance |
| `ISO 27001` | `iso27001` | ISO 27001 framework content |
| `NIST` | `nist` | NIST CSF / SP 800 content |
| `PCI DSS` | `pci-dss` | PCI DSS framework content |
| `SOC 2` | `soc2` | SOC 2 Type II content |
| `Risk Management` | `risk-management` | Risk assessment and management |
| `Maturity Roadmap` | `general` | Maturity model guidance |
| `Training Content` | `general` | Training and learning materials |

The company-specific document types from the legacy system map to Pipeline 2 document categories:

| Legacy `document_type` | Pipeline 2 Role |
|---|---|
| `maturity_model` | Maturity scoring and roadmap guidance |
| `sector_context` | Industry-specific context documents |
| `scoring_logic` | Assessment scoring methodology |
| `sop_template` | Standard operating procedure templates |
| `governance_reasoning_manifest` | Governance reasoning and rationale |
| `threat_intelligence_profile` | Threat intelligence knowledge |
| `assessment_framework_component` | Assessment framework reference |
| `mps_document` | MPS reference knowledge (NOT criteria parsing input) |
| `iso_alignment` | ISO framework alignment guidance |

> ⚠️ **Important distinction**: `mps_document` type in the legacy system is a knowledge reference document. It is NOT the same as the criteria input for Pipeline 1. Documents labelled `mps_document` in Pipeline 2 provide advisory knowledge about MPS; they do not generate the `mini_performance_standards` table entries (that is Pipeline 1's job).

---

## 6. Architectural Decision Record

### ADR-001: Single Knowledge Table Target

**Decision**: Pipeline 2 SHALL write to the AIMC-governed `ai_knowledge` table (`packages/ai-centre/`), not the legacy `ai_documents` / `document_chunks` tables.

**Rationale**: The `ai_knowledge` table is the canonical AIMC knowledge store. It has `organisation_id` scoping, `approval_status` workflow, `source` domain tagging, and RLS policies. Routing to the legacy tables would create a parallel knowledge silo that advisory agents cannot access.

**Consequence**: The schema migration must be assessed (CL-4/CL-5-D2) to confirm `ai_knowledge` can accommodate the chunk-level metadata currently in `document_chunks`. Any gap must be resolved before the integration wave begins.

### ADR-002: Preserve Smart Chunk Reuse

**Decision**: The Smart Chunk Reuse mechanism (`preApprovedChunks: true`, `saveApprovedChunks()`) SHALL be preserved in the migrated implementation.

**Rationale**: Smart Chunk Reuse is a cost and reliability optimisation that prevents unnecessary AI credit consumption on re-uploads. It is a mature pattern that has been proven in production.

**Consequence**: The migrated `process-document-v2` Edge Function must retain the `chunked_from_tester` / `approved_via_tester` detection logic and short-circuit path.

### ADR-003: ARC Protocol Integration

**Decision**: All documents uploaded via Pipeline 2 SHALL enter `ai_knowledge` with `approval_status = 'pending'` and be subject to the ARC Knowledge Promotion Protocol before advisory agents can retrieve them.

**Rationale**: GRS-governed knowledge quality control. The ARC protocol is the governance mechanism that prevents unvetted content from reaching advisory agents. This aligns with the CS2-approved Knowledge Upload Centre specification (CL-5-D1 v1.1.0).

**Consequence**: The Pipeline 2 upload UI must surface the `approval_status` state to the Lead Auditor / Content Administrator, showing items awaiting ARC approval.

### ADR-004: Domain Tagging at Upload Time

**Decision**: The Pipeline 2 upload UI SHALL require domain selection at upload time, mapped to the AIMC `source` taxonomy.

**Rationale**: Domain tagging is required for CL-8 (domain specialist routing). Without a `source` tag, knowledge chunks cannot be routed to the correct advisor persona. The legacy `domain` field maps to the AIMC `source` field per §5 of this strategy.

**Consequence**: The `DocumentChunkTester` metadata form must be updated to use AIMC source taxonomy labels rather than legacy free-text domain labels.

### ADR-005: Pipeline 1 Unchanged

**Decision**: The criteria parsing pipeline (Pipeline 1: `CriteriaUpload.tsx` → `invoke-ai-parse-criteria` → `mat-ai-gateway/parsing.py`) SHALL NOT be modified by any wave produced from this strategy.

**Rationale**: Pipeline 1 serves a structurally different function (verbatim criteria extraction into a relational hierarchy). Mixing the two pipelines would violate the no-hallucination rule governing criteria and would confuse the audit evidence workflow.

**Consequence**: The MAT UI must clearly distinguish between the two upload pathways. A Lead Auditor uploading a criteria document uses Pipeline 1. A Content Administrator uploading guidance knowledge uses Pipeline 2.

---

## 7. Impact on MAT Governance Documents

The following MAT governance documents require amendment to formally recognise Pipeline 2. These amendments are **not implementation work** — they are governance clarifications that must precede any implementation wave.

| Document | Section | Amendment Required |
|---|---|---|
| `modules/mat/00-app-description/app-description.md` | New §6.3 | Knowledge Document Upload (Pipeline 2) — purpose, actor, document types, target table, AIMC governance link |
| `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` | New STEP 2b | Knowledge Upload workflow — actor: Content Administrator; UI: Knowledge Upload panel; pipeline: chunk tester → process-document-v2 → ai_knowledge |
| `modules/mat/01-frs/functional-requirements.md` | New FR | FR-KU-001: Knowledge document upload UI; FR-KU-002: Chunk preflight tester; FR-KU-003: Domain tagging; FR-KU-004: ARC approval status display; FR-KU-005: Re-upload / retry |
| `modules/mat/01.5-trs/technical-requirements-specification.md` | New TR | TR-KU-001: Chunk-based ingestion (size=2000, overlap=200); TR-KU-002: Embedding generation (1536-dim); TR-KU-003: approval_status='pending' on insert; TR-KU-004: organisation_id scoping |
| `modules/mat/02-architecture/system-architecture.md` | New §4.3 | Knowledge Ingestion Pipeline architecture — component diagram, data flow, table targets |
| `modules/mat/03-implementation-plan/implementation-plan.md` | New Wave | Wave: Knowledge Upload Centre Integration (Pipeline 2 migration from legacy) |
| `modules/mat/02-architecture/test-strategy.md` | New section | Pipeline 2 test coverage requirements — RED gate tests for chunk tester, upload processor, domain tagging, ARC status |

---

## 8. Impact on AIMC/LKIAC Programme

This strategy does not modify the AIMC/LKIAC Combined Execution Plan. It provides strategic direction that Foreman will use when producing the alignment plan. However, the following programme notes are flagged for Foreman's consideration:

### 8.1 CL-5-D2 Acceleration

The outstanding CL-5-D2 deliverable (upload endpoint architecture review) should be completed against the legacy `process-document-v2` Edge Function as the primary candidate architecture. The review should:

- Confirm that `process-document-v2` can be re-hosted in `packages/ai-centre/supabase/functions/`
- Confirm the schema delta between legacy `document_chunks` and AIMC `ai_knowledge` (gap = AIMC metadata columns: `source`, `approval_status`, `organisation_id`)
- Produce the architecture review artefact at `.agent-workspace/audit/AIMC-P1-upload-arch-review-{date}.md`

### 8.2 CL-11 Implementation Candidate

The CL-11 implementation (Knowledge Upload Centre + ARC Operationalisation) SHALL use the legacy pipeline as its implementation candidate rather than building from scratch. The `POST /api/ai/knowledge/upload` endpoint specified in CL-5-D1 shall be implemented as a governed wrapper around the `process-document-v2` pipeline logic.

### 8.3 CL-3 Deprecation Register Entries

When CL-3 produces the Deprecation Register, the following legacy components should be classified as `PARALLEL-RUN` (not `SUPERSEDED` yet) pending this integration:

| Legacy Component | Target AIMC Equivalent | CL-3 Classification |
|---|---|---|
| `DocumentUploadProcessor.tsx` | MAT Pipeline 2 UI (this strategy) | `PARALLEL-RUN` |
| `MaturionKnowledgeUploadZone.tsx` | MAT Pipeline 2 UI (this strategy) | `PARALLEL-RUN` |
| `UnifiedDocumentUploader.tsx` | MAT Pipeline 2 UI (this strategy) | `PARALLEL-RUN` |
| `process-document-v2` Edge Function | `packages/ai-centre/supabase/functions/process-document-v2` | `PARALLEL-RUN` |
| `process-ai-document` Edge Function | `packages/ai-centre/supabase/functions/process-ai-document` | `PARALLEL-RUN` |
| `DocumentChunkTester.tsx` | MAT Knowledge Upload Panel (QA preflight) | `PARALLEL-RUN` |

### 8.4 No Conflict With Wave Sequencing

This strategy does not propose bypassing any AIMC/LKIAC wave gate. The integration work proposed here:

- Is downstream of CL-0 ✅ (already complete)
- Is downstream of CL-1 ✅ (already complete)
- Can proceed in parallel with CL-2, CL-3, CL-4 (no interdependency with the MAT governance document updates in §7)
- Requires CL-5-D2 completion before the Pipeline 2 implementation wave begins
- Feeds CL-6 (domain tagging established by this strategy's §5 taxonomy)
- Accelerates CL-11 (the legacy pipeline IS the CL-11 candidate)

---

## 9. Proposed Next Steps

The following sequence is proposed. CS2 review of this strategy is required before Foreman produces the alignment plan.

### Step 1 — CS2 Review This Strategy (IMMEDIATE)

CS2 reviews this document and confirms:
- The two-pipeline architectural position (§3.1)
- The ADRs (§6)
- The domain taxonomy (§5)
- The list of MAT governance documents requiring amendment (§7)

### Step 2 — Foreman Alignment Strategy (AFTER CS2 REVIEW)

Foreman produces a **MAT Knowledge Ingestion Alignment Plan** that covers:
- Gap analysis: what exists in legacy vs. what is needed in MAT/AIMC
- Accelerated approach: what can be taken directly, what needs adaptation
- Wave sequencing: new waves or amended waves in the Combined Execution Plan
- Red gate test requirements for each implementation wave

### Step 3 — MAT Governance Document Updates (Wave: Governance Amendments)

`governance-liaison-isms-agent` updates the MAT governance documents listed in §7. This is a documentation-only wave with no production code changes.

### Step 4 — CL-5-D2 Completion (Accelerated)

`api-builder` completes the upload architecture review using `process-document-v2` as the candidate. This closes the last outstanding CL-5 deliverable.

### Step 5 — Pipeline 2 Integration Wave (Implementation)

With governance documents updated and CL-5-D2 closed:
- `qa-builder` produces RED gate test suite for Pipeline 2 components
- `ui-builder` migrates `DocumentChunkTester.tsx` + `UnifiedDocumentUploader.tsx` into MAT frontend
- `api-builder` re-hosts `process-document-v2` to `packages/ai-centre/supabase/functions/`
- `schema-builder` confirms `ai_knowledge` schema accommodates chunk metadata (or produces delta migration)

### Step 6 — AIMC/LKIAC CL-11 Alignment

Foreman records the Pipeline 2 integration as the CL-11 implementation, closing the CL-11 scope with reference to this strategy document and the integration wave deliverables.

---

## 10. Success Criteria

This strategy is considered complete and the integration successful when:

- [ ] **SC-1**: MAT frontend has a Knowledge Upload panel (Pipeline 2 UI) that is clearly distinct from the Criteria Upload panel (Pipeline 1 UI)
- [ ] **SC-2**: Documents uploaded via Pipeline 2 appear in the AIMC `ai_knowledge` table with `approval_status = 'pending'`, correct `source` domain tag, and `organisation_id` scoping
- [ ] **SC-3**: Smart Chunk Reuse is functional — pre-approved chunks bypass reprocessing
- [ ] **SC-4**: ARC approval status is visible in the MAT UI for uploaded knowledge documents
- [ ] **SC-5**: At least one advisory agent (e.g. `maturion-advisor` or `mat-advisor`) can retrieve domain-relevant knowledge from documents uploaded via Pipeline 2
- [ ] **SC-6**: 100% GREEN test gate on all Pipeline 2 RED gate tests (zero stubs, zero skipped)
- [ ] **SC-7**: MAT governance documents (app-description, FRS, TRS, architecture, implementation plan) formally document Pipeline 2
- [ ] **SC-8**: CL-3 Deprecation Register records the migrated legacy components as `PARALLEL-RUN` with this strategy as the authority
- [ ] **SC-9**: CL-5-D2 upload architecture review complete, referencing this strategy
- [ ] **SC-10**: CL-11 scope confirmed as covered by the Pipeline 2 integration wave

---

## 11. Document References

| Document | Location | Relevance |
|---|---|---|
| AIMC + LKIAC Combined Execution Plan | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` | Governing programme — CL-5, CL-6, CL-11 |
| AIMC Knowledge Upload Centre Specification | `governance/aimc/AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md` | CL-5-D1 — API specification for Pipeline 2 endpoint |
| AIMC ARC Knowledge Promotion Protocol | `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` | ARC approval workflow for uploaded documents |
| AIMC Persona Lifecycle | `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` | Advisory agent registry — beneficiaries of Pipeline 2 |
| LKIAC-001 Strategy | `APGI-cmy/maturion-foreman-governance` → `maturion/strategy/LEGACY_KNOWLEDGE_INTEGRATION_AND_ARCHITECTURE_CONSOLIDATION_STRATEGY.md` | LKIAC strategic framework |
| MAT App Description | `modules/mat/00-app-description/app-description.md` | Primary MAT governance document — requires amendment |
| MAT UX Workflow | `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` | MAT UX specification — requires STEP 2b addition |
| MAT FRS | `modules/mat/01-frs/functional-requirements.md` | Functional requirements — requires Pipeline 2 FRs |
| MAT TRS | `modules/mat/01.5-trs/technical-requirements-specification.md` | Technical requirements — requires Pipeline 2 TRs |
| DocumentChunkTester.tsx | `apps/maturion-maturity-legacy/src/components/qa/DocumentChunkTester.tsx` | Primary source component for Pipeline 2 UI |
| UnifiedDocumentUploader.tsx | `apps/maturion-maturity-legacy/src/components/ai/UnifiedDocumentUploader.tsx` | Phase 1 migration-ready upload UI |
| process-document-v2 | `apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts` | Primary source Edge Function for Pipeline 2 backend |
| FAIL-ONLY-ONCE Registry | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | Institutional learning — INC-W18-CRITERIA-PIPELINE-001 |
| Wave 18 Repair Issue | `maturion-isms#1114` | Pipeline 1 repair — INC-W18-CRITERIA-PIPELINE-001 |

---

## 12. Amendment Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0.1 | 2026-03-19 | foreman-v2-agent v6.2.0 | Updated status from DRAFT to CS2-AUTHORISED — Foreman Alignment Plan produced (MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md v1.0.0) per CS2-authorised GitHub issue |
| 1.0.0 | 2026-03-19 | GitHub Copilot (CS2 direction) | Initial strategy document — drafted following investigation of legacy chunking system and integration opportunity identification |

---

*This document is a CS2 Planning Output — Strategy Level.*
*It does NOT constitute a wave start authorisation or implementation task.*
*Wave execution may NOT begin for any wave derived from this strategy until CS2 has reviewed and approved this document and Foreman has produced the alignment plan.*
*Authority: CS2 (Johan Ras / @APGI-cmy) | 2026-03-19