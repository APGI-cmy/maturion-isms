# Architecture Review: Pipeline 2 (`process-document-v2`) Re-Hosting Feasibility

**Document Type**: Architecture Review Artefact  
**Document ID**: AIMC-P1-upload-arch-review-20260319  
**Version**: 1.0.0  
**Date**: 2026-03-19  
**Wave**: DCKIS-CL5D2  
**Producing Agent**: `api-builder`  
**Authority**: CS2 (@APGI-cmy) | `MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` §4 DCKIS-CL5D2  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-dckis-cl5d2.md`  
**Status**: FINAL — no placeholder, stub, or TBD content  

---

## Source Documents Reviewed

The following source documents were read in full to produce this review:

| # | Document | Path | Lines |
|---|----------|------|-------|
| SD-1 | Pipeline 2 Edge Function | `apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts` | 572 lines — read in full |
| SD-2 | AIMC Knowledge Table (base) | `packages/ai-centre/supabase/migrations/003_ai_knowledge.sql` | read in full |
| SD-3 | AIMC Knowledge Table (metadata amendment) | `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` | read in full |
| SD-4 | MAT Knowledge Ingestion Alignment Plan §2.4, §4 | `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` | §2.4 Accelerated Approach, §4 DCKIS-CL5D2 spec — read |
| SD-5 | Smart Chunk Reuse detection (reference impl.) | `apps/maturion-maturity-legacy/supabase/functions/process-ai-document/index.ts` | lines 114–124 — read for comparison |
| SD-6 | Legacy schema types | `apps/maturion-maturity-legacy/src/integrations/supabase/types.ts` | field declarations for `chunked_from_tester` — read |
| SD-7 | Legacy migration (Smart Chunk Reuse fields) | `apps/maturion-maturity-legacy/supabase/migrations.bak.20250926-095649/20250731103837_*.sql` | ADD COLUMN declarations — read |

---

## Review Topic 1: Re-Hosting Feasibility of `process-document-v2` in AIMC

### 1.1 Function Architecture

`process-document-v2` (`apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts`) is a Deno-based Supabase Edge Function. Its structure is:

- **Entry point**: Deno `serve()` — standard Supabase Edge Function pattern  
- **HTTP handling**: CORS pre-flight + JSON body parse  
- **Processing pipeline**: 5 sequential stages — Validation → File Extraction → Chunking → Chunk Storage + Embedding → Finalization  
- **Helpers**: `extractFileContent()`, `chunkText()`, `chunkByStructure()`, `inferDocType()`, `generateContentHash()`, `logPipelineStage()`, `logQAMetric()`  
- **File parsing**: Plain text, PDF (text extraction from ArrayBuffer), DOCX (JSZip + `word/document.xml` parsing)  
- **Self-contained logic**: All processing is within the single 572-line file with no cross-function imports from legacy

### 1.2 Deno Compatibility

The target host `packages/ai-centre/supabase/functions/` is a Supabase Edge Functions directory that runs the same Deno runtime as the legacy project. The function uses only:

- `https://deno.land/x/xhr@0.1.0/mod.ts` — XHR polyfill
- `https://deno.land/std@0.168.0/http/server.ts` — standard `serve()` 
- `https://esm.sh/@supabase/supabase-js@2.51.0` — Supabase client
- `https://esm.sh/jszip@3.10.1` — DOCX ZIP parsing

All four imports are URL-based and Deno-native. No Node.js-specific APIs (`require`, `fs`, `path`, `Buffer`) are used anywhere in the function. The function is fully portable to any Supabase project's Edge Functions directory without runtime incompatibility.

**Finding**: The function is runtime-compatible with `packages/ai-centre/supabase/functions/`. The directory can host a copy of this function file.

### 1.3 Adaptations Required for Re-Hosting

Re-hosting requires the following code-level changes (scope for DCKIS-IMPL-001):

| # | Change | Description |
|---|--------|-------------|
| A-1 | Table retarget | Change `.from('ai_document_chunks').insert(...)` to `.from('ai_knowledge').insert(...)` |
| A-2 | Field mapping | Map legacy chunk record fields to `ai_knowledge` schema (see §2 Schema Delta below) |
| A-3 | `approval_status` default | Add `approval_status: 'pending'` on every chunk insert (ADR-003) |
| A-4 | `source` field | Add `source` field (AIMC domain taxonomy label) on insert (ADR-004) |
| A-5 | Spelling variant | Change `organization_id` (US) to `organisation_id` (UK) for AIMC schema alignment |
| A-6 | Smart Chunk Reuse | Port `chunked_from_tester` / `approved_via_tester` detection logic from `process-ai-document` (see §3) |
| A-7 | Auxiliary tables | Confirm `ai_documents`, `processing_pipeline_status`, `qa_metrics` exist in AIMC Supabase project |

These are targeted adaptations, not a rewrite. The core logic — file parsing, chunking algorithm, pipeline stage tracking — transfers without modification.

---

## Review Topic 2: Column-by-Column Schema Delta

### 2.1 Legacy Output Table: `ai_document_chunks`

Fields written by `process-document-v2` to `ai_document_chunks` (observed from Stage 4 chunk record construction at line ~180–192):

| Column | Type | Value Source |
|--------|------|--------------|
| `document_id` | UUID / TEXT | `documentId` (request param) |
| `chunk_index` | INTEGER | Array index from `chunks.map()` |
| `content` | TEXT | Chunk text string |
| `content_hash` | TEXT | `generateContentHash(content)` — deterministic hash for deduplication |
| `metadata` | JSONB | `{ processing_version, schema_version, session_id, extraction_method, chunk_size }` |
| `organization_id` | TEXT | `document.organization_id` (US spelling) |

**Note**: `ai_document_chunks` does NOT store vector embeddings. The function's Stage 4 is labelled "Store Chunks & Generate Embeddings" but the actual code only inserts the text chunk records. No call to an embedding API (OpenAI or otherwise) is present in this function. Embedding generation is either deferred to a downstream trigger or not yet implemented in this version.

### 2.2 AIMC Target Table: `ai_knowledge`

Full column set from `003_ai_knowledge.sql` + `006_ai_knowledge_metadata.sql`:

| Column | Type | Nullable | Default | Source Migration |
|--------|------|----------|---------|-----------------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | 003 |
| `organisation_id` | TEXT | NOT NULL | — | 003 |
| `content` | TEXT | NOT NULL | — | 003 |
| `source` | TEXT | NULL | — | 003 |
| `embedding` | vector(1536) | NULL | — | 003 |
| `created_at` | TIMESTAMPTZ | NOT NULL | `now()` | 003 |
| `domain` | TEXT | NULL | — | 006 |
| `module` | TEXT | NULL | — | 006 |
| `standard_ref` | TEXT | NULL | — | 006 |
| `freshness_date` | TIMESTAMPTZ | NULL | — | 006 |
| `approval_status` | TEXT | NULL | `'pending'` | 006 |

### 2.3 Column Delta Analysis

| Column | In `ai_document_chunks`? | In `ai_knowledge`? | Delta / Action Required |
|--------|--------------------------|--------------------|-----------------------|
| `content` | ✅ YES | ✅ YES | **Direct map** — identical semantics |
| `organisation_id` / `organization_id` | ✅ YES (`organization_id` — US spelling) | ✅ YES (`organisation_id` — UK spelling) | **Map with rename** — `organization_id` → `organisation_id` |
| `source` | ❌ NO (free-text in domain metadata) | ✅ YES (nullable, AIMC taxonomy) | **Addition required** — populate with AIMC taxonomy label per ADR-004 |
| `approval_status` | ❌ NO | ✅ YES (defaults `'pending'`) | **Addition** — insert with `approval_status: 'pending'` per ADR-003 |
| `embedding` | ❌ NO (not generated by this function) | ✅ YES (nullable, vector(1536)) | **No gap for re-host** — `ai_knowledge` allows null embedding; embedding generation is a separate concern |
| `domain` | ❌ NO (not in chunk record) | ✅ YES (nullable from 006) | **Optional enrichment** — can be set from AIMC domain taxonomy or left null until CL-8 routing |
| `module` | ❌ NO | ✅ YES (nullable from 006) | **Optional enrichment** — nullable, no blocking gap |
| `standard_ref` | ❌ NO | ✅ YES (nullable from 006) | **Optional enrichment** — nullable, no blocking gap |
| `freshness_date` | ❌ NO | ✅ YES (nullable from 006) | **Optional enrichment** — nullable, can be set from `document.created_at` |
| `document_id` | ✅ YES | ❌ NO | **Schema gap** — `ai_knowledge` has no `document_id` column; linkage to source document is lost at re-host unless added |
| `chunk_index` | ✅ YES | ❌ NO | **Schema gap** — `ai_knowledge` has no `chunk_index` column; ordering is lost unless added |
| `content_hash` | ✅ YES | ❌ NO | **Schema gap** — `ai_knowledge` has no `content_hash` column; deduplication support lost unless added |
| `metadata` | ✅ YES (JSONB) | ❌ NO | **Schema gap** — `ai_knowledge` has no `metadata` JSONB column; processing provenance lost unless added |
| `id` | Implicit (assumed) | ✅ YES (`gen_random_uuid()`) | **Auto-generated** — no action required |
| `created_at` | Implicit (assumed) | ✅ YES (`now()`) | **Auto-generated** — no action required |

### 2.4 Critical Schema Gaps

Four columns present in the legacy output are absent from `ai_knowledge`:

1. **`document_id`** — Chunk-to-document linkage. Required for traceability and for the finalization stage which updates `ai_documents` with `total_chunks`.
2. **`chunk_index`** — Chunk ordering within a document. Required for reconstructing ordered document context during RAG retrieval.
3. **`content_hash`** — Deterministic hash for deduplication. Required for Smart Chunk Reuse short-circuit detection.
4. **`metadata` (JSONB)** — Processing provenance (`processing_version`, `session_id`, `extraction_method`, `chunk_size`). Required for audit and debugging.

**These four gaps are the subject of DCKIS-SCH-001** (next wave). The `ai_knowledge` schema requires amendment before `process-document-v2` can be re-hosted with full fidelity. The gaps are well-bounded and resolvable via targeted `ALTER TABLE` migrations. They do not block the re-hosting feasibility verdict — they define the schema migration scope.

---

## Review Topic 3: Smart Chunk Reuse Portability

### 3.1 Smart Chunk Reuse Definition

Smart Chunk Reuse is a cost-optimisation mechanism that detects when a document has already been pre-approved through the DocumentChunkTester UI. The detection relies on two fields:

- **`chunked_from_tester`**: A `BOOLEAN` column on the `ai_documents` table, set to `TRUE` when a document's chunks were generated via the Chunk Tester UI.
- **`approved_via_tester`**: A `BOOLEAN` field in the `ai_documents.metadata` JSONB, set to `TRUE` when the Content Administrator explicitly approved the chunks in the Chunk Tester.

When both flags are present, the pipeline can short-circuit embedding generation (chunks already exist and are approved), reducing OpenAI API calls.

**Authority**: `MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` §4, ADR-002 (Smart Chunk Reuse unchanged).

### 3.2 Presence in `process-document-v2` Source Code

**Finding: `chunked_from_tester` and `approved_via_tester` are NOT present in `process-document-v2/index.ts`.**

A line-by-line review of the 572-line function (SD-1) confirms:
- No reference to `chunked_from_tester` anywhere in the file
- No reference to `approved_via_tester` anywhere in the file
- The `ProcessDocumentRequest` interface includes `enableSmartChunkReuse?: boolean` as an option, but this flag is accepted in the request body and never acted upon — no conditional branch uses it in the pipeline stages

The Smart Chunk Reuse detection logic exists in the companion function `process-ai-document/index.ts` (SD-5), lines 114–124:

```typescript
console.log(`   - chunked_from_tester: ${document.chunked_from_tester}`);
console.log(`   - metadata.approved_via_tester: ${document.metadata?.approved_via_tester}`);
// ...
document.chunked_from_tester === true ||
document.metadata?.approved_via_tester === true ||
```

### 3.3 Portability Assessment

The Smart Chunk Reuse logic exists in the legacy codebase (`process-ai-document`) and in the `DocumentChunkTester.tsx` component. The fields `chunked_from_tester` and `approved_via_tester` are defined in the legacy Supabase schema (confirmed via `supabase/types.ts` line 566 and migration `20250731103837_*.sql`).

**Portability conclusion**: The Smart Chunk Reuse logic is **portable but requires explicit porting** into `process-document-v2`. The detection logic from `process-ai-document/index.ts` (lines 114–124) must be copied and integrated as a conditional branch in `process-document-v2`'s pipeline, activated when `enableSmartChunkReuse: true` is passed in the request. The `ai_documents` table must also carry the `chunked_from_tester` BOOLEAN column in the AIMC project for the detection to function.

This is a DCKIS-IMPL-001 implementation task. Per ADR-002, the logic must be transferred without modification to its core decision path.

### 3.4 Compliance with ADR-002

ADR-002 (Smart Chunk Reuse unchanged) is satisfied at re-host time by: (1) porting the `chunked_from_tester` / `approved_via_tester` detection from `process-ai-document`, (2) wiring it to the `enableSmartChunkReuse` request flag, (3) ensuring `ai_documents` table in AIMC carries the `chunked_from_tester` BOOLEAN column. No change to the decision logic itself is permitted.

---

## Review Topic 4: External Dependencies

### 4.1 Environment Variables / Secrets

| Variable | Source in Code | Purpose | Migration Action |
|----------|---------------|---------|-----------------|
| `SUPABASE_URL` | `Deno.env.get('SUPABASE_URL')` (line 12) | Supabase project URL for client initialization | **Must be re-configured** in AIMC Supabase project secrets to point to `packages/ai-centre/` Supabase URL, not the legacy project |
| `SUPABASE_SERVICE_ROLE_KEY` | `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')` (line 13) | Service role key for privileged DB access | **Must be re-configured** in AIMC Supabase project secrets to the AIMC service role key |

No other environment variables are referenced (`Deno.env.get` called exactly twice).

**Critical note**: Both variables are automatically injected by Supabase into every Edge Function running within a given project. When the function is deployed to the AIMC Supabase project (not the legacy project), these variables will automatically resolve to the AIMC project's URL and service key — no explicit secret management action is required beyond deploying to the correct project.

### 4.2 Storage Buckets

| Bucket Name | Usage | Location in Code |
|-------------|-------|-----------------|
| `ai-documents` | `supabase.storage.from('ai-documents').download(document.file_path)` (line 99) | Stage 1: Validation — downloads document binary for processing |

**Migration action**: The bucket name `ai-documents` is hardcoded as a string literal. The AIMC Supabase project must have a storage bucket named `ai-documents` created before this function can be deployed. If the AIMC bucket has a different name, the hardcoded string must be updated at re-host time (DCKIS-IMPL-001 scope).

### 4.3 Auxiliary Database Tables

The function reads from and writes to the following tables beyond the primary output table:

| Table | Operation | Purpose |
|-------|-----------|---------|
| `ai_documents` | SELECT (read document details) | Input: fetches document metadata, file path, org ID |
| `ai_documents` | UPDATE (finalization) | Sets `processing_status`, `processed_at`, `total_chunks`, `doc_type`, `is_ai_ingested` |
| `processing_pipeline_status` | INSERT | Logs each stage status for pipeline observability |
| `qa_metrics` | INSERT | Records success/failure metrics per organization |

**Migration action**: All four tables must exist in the AIMC Supabase project. `ai_documents` is the most critical — it is both the input source and the status update target. `processing_pipeline_status` and `qa_metrics` are auxiliary observability tables. Their absence would cause non-fatal errors (wrapped in try/catch in `logPipelineStage()` and `logQAMetric()`) but would not prevent chunk storage from succeeding.

### 4.4 Deno Import Dependencies

| Import URL | Version | Purpose | Portability |
|------------|---------|---------|------------|
| `https://deno.land/x/xhr@0.1.0/mod.ts` | 0.1.0 | XHR polyfill for Deno | Direct — URL import |
| `https://deno.land/std@0.168.0/http/server.ts` | 0.168.0 | `serve()` function | Direct — URL import |
| `https://esm.sh/@supabase/supabase-js@2.51.0` | 2.51.0 | Supabase client | Direct — URL import |
| `https://esm.sh/jszip@3.10.1` | 3.10.1 | DOCX ZIP extraction | Direct — URL import |

All imports are URL-pinned CDN imports (Deno's standard pattern). No local file imports, no workspace packages, no Node.js modules. These imports are fully portable — Deno will fetch them at deploy time from the same CDN URLs regardless of which Supabase project hosts the function.

### 4.5 Dependency Summary

| Dependency Type | Count | Migration Complexity |
|----------------|-------|---------------------|
| Env vars (auto-injected by Supabase) | 2 | LOW — auto-resolved on deploy to correct project |
| Storage buckets | 1 (`ai-documents`) | LOW — create bucket or update hardcoded name |
| Auxiliary tables | 4 | MEDIUM — require AIMC schema migrations |
| Deno CDN imports | 4 | NONE — fully portable |

---

## Review Topic 5: ADR Compliance Check

The following ADRs are defined in `MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` and must not be contradicted by this review:

| ADR | Title | This Review's Position | Compliant? |
|-----|-------|----------------------|------------|
| ADR-001 | Output table target is `ai_knowledge` | §2 identifies `ai_document_chunks` → `ai_knowledge` retargeting as required adaptation A-1/A-2 | ✅ YES |
| ADR-002 | Smart Chunk Reuse logic unchanged | §3 specifies porting without modification to decision logic | ✅ YES |
| ADR-003 | Approval workflow: `approval_status = 'pending'` on insert | §2.3 identifies this as adaptation A-3; §1.3 lists it | ✅ YES |
| ADR-004 | Domain taxonomy: AIMC source taxonomy labels required | §2.3 identifies `source` field as adaptation A-4 | ✅ YES |
| ADR-005 | Pipeline 1 (Criteria Parsing) untouched | This review addresses Pipeline 2 (`process-document-v2`) only. No reference to Pipeline 1 components | ✅ YES |

---

## Review Verdict

### VERDICT: PASS

`process-document-v2` **CAN be re-hosted** in `packages/ai-centre/supabase/functions/`.

**Justification**:

1. **Runtime compatibility is confirmed.** The function is a self-contained Deno Edge Function with no Node.js dependencies, no workspace-level imports, and no legacy-project-specific runtime requirements. Deploying it to a different Supabase project's Edge Functions directory requires no runtime changes.

2. **Adaptations are bounded and well-defined.** The seven adaptations identified in §1.3 (table retarget, field mapping, `approval_status`, `source`, spelling variant, Smart Chunk Reuse port, auxiliary table confirmation) are each targeted code changes, not architectural rewrites. The core logic — file parsing (plain text, PDF, DOCX via JSZip), text chunking, pipeline stage tracking — transfers without modification.

3. **Schema gaps are resolvable.** Four columns absent from `ai_knowledge` (`document_id`, `chunk_index`, `content_hash`, `metadata`) are documented in §2.4. These gaps are the well-defined scope of DCKIS-SCH-001 and do not make re-hosting infeasible — they make it conditional on completing that wave first.

4. **Smart Chunk Reuse is portable.** The fields (`chunked_from_tester` / `approved_via_tester`) and detection logic exist in the legacy codebase. They are absent from `process-document-v2` but exist in `process-ai-document`. Porting them is a contained task compliant with ADR-002.

5. **External dependencies are manageable.** Two auto-injected env vars, one storage bucket, four auxiliary tables, and four CDN-hosted Deno imports. None of these present re-hosting blockers.

**Pre-conditions for re-hosting implementation (DCKIS-IMPL-001)**:
- DCKIS-SCH-001 completed (schema gap resolved — four columns added to `ai_knowledge`)
- Storage bucket `ai-documents` exists in AIMC Supabase project
- Auxiliary tables `ai_documents`, `processing_pipeline_status`, `qa_metrics` exist in AIMC schema
- `chunked_from_tester` BOOLEAN column confirmed on `ai_documents` in AIMC

**Blocked implementation waves**: DCKIS-IMPL-001 is blocked on DCKIS-SCH-001 (schema) and DCKIS-QA-RED (RED gate tests). This review does not unblock DCKIS-IMPL-001 directly — it confirms feasibility and identifies the exact scope for those waves.

---

## Summary Table

| Review Area | Finding | Action Required |
|------------|---------|----------------|
| Re-hosting feasibility | **PASS** — runtime compatible, self-contained | Targeted adaptations in DCKIS-IMPL-001 |
| Schema delta | 4 columns to add to `ai_knowledge`; 2 to add on insert (`source`, `approval_status`) | DCKIS-SCH-001 |
| Smart Chunk Reuse | Fields NOT in `process-document-v2`; must be ported from `process-ai-document` | DCKIS-IMPL-001 (per ADR-002) |
| Env vars | 2 (auto-injected); re-resolved automatically on deploy to AIMC project | No action beyond correct project deployment |
| Storage bucket | `ai-documents` hardcoded; must exist in AIMC | Create bucket in AIMC before deploy |
| Auxiliary tables | `ai_documents`, `processing_pipeline_status`, `qa_metrics` must exist in AIMC | Confirm/create in AIMC schema |
| ADR compliance | All 5 ADRs respected | None — compliant |

---

*End of Architecture Review — DCKIS-CL5D2*  
*Produced by api-builder — Wave DCKIS-CL5D2 — 2026-03-19*
