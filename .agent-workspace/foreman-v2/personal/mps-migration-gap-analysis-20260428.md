# MPS Source Document Migration Gap Analysis

**Author**: foreman-v2-agent (Track A Research — POLC Orchestration)
**Wave**: wave-mps-source-verification
**Date**: 2026-04-28
**Issue**: CS2 clarification — verify canonical generic MPS source pack in AIMC/KUC before static question bank
**Related PR**: maturion-isms#1500 (static question bank — approved interim implementation under maturion-isms#1499; must NOT close maturion-isms#1501)
**Branch**: copilot/verify-generic-mps-source-documents

---

## 1. Executive Summary

**Track A Result**: **MIGRATION GAP LIKELY** — code/schema investigation finds no evidence that
the 25 generic MPS Word source documents were migrated into the current MMM storage system.
**CS2 Action Required**: Query the live Supabase database using the SQL provided below (§6) to
confirm presence or absence. Based on that finding, decide Track B path.

**PR #1500 Status**: **APPROVED INTERIM** (CS2 caveat) — merged as static interim implementation
under maturion-isms#1499. Must NOT close maturion-isms#1501. Canonical KUC/AIMC source
verification (#1501) remains open and unresolved. Track B is still required once CS2 confirms
DB verification results.

---

## 2. Acceptance Criteria Mapping

| # | Acceptance Criterion | Track A Finding |
|---|---------------------|-----------------|
| 1 | KUC/document-upload storage searched for generic MPS source documents | ✅ DONE (code/schema investigation) |
| 2 | Records whether documents are approved/active and retrievable by MMM/AIMC path | ⚠️ SCHEMA PRESENT, DATA UNKNOWN — needs live DB query |
| 3 | Confirms content is generic MPS, not diamond-specific LDCS | ⚠️ UNKNOWN — live DB query needed |
| 4 | If present, use KUC source as canonical input | ❌ BLOCKED — Track B pending CS2 gate |
| 5 | If absent, record migration gap and request re-upload | ✅ THIS DOCUMENT |
| 6 | Structured Domain → MPS → Criteria JSON produced or reused | ❌ BLOCKED — Track B pending CS2 gate |
| 7 | Free-assessment question bank derived from structured model, not hand-authored | ❌ BLOCKED — Track B pending CS2 gate |
| 8 | Tests prove free assessment covers all 25 MPSs | ❌ BLOCKED — Track B pending CS2 gate |

---

## 3. Current Storage Architecture — Code Evidence

### 3.1 MMM Framework Source Storage (New System)

| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| `mmm-framework-sources` bucket | `supabase/migrations/20260420000004_mmm_storage_buckets.sql` | Private storage bucket accepting Word (.docx), PDF, and other framework documents (100MB limit) | **CREATED** (schema exists) |
| `mmm_parse_jobs` table | `supabase/migrations/20260420000001_mmm_core_tables.sql` | Tracks framework document parse jobs with `document_id` reference | **CREATED** (schema exists) |
| `mmm_maturity_process_steps` table | `supabase/migrations/20260420000001_mmm_core_tables.sql` | Stores parsed Maturity Process Steps (MPS) with `domain_id` FK | **CREATED** (schema exists — DATA UNKNOWN) |
| `mmm_criteria` table | `supabase/migrations/20260420000001_mmm_core_tables.sql` | Stores criteria per MPS with `mps_id` FK | **CREATED** (schema exists — DATA UNKNOWN) |
| `mmm_domains` table | `supabase/migrations/20260420000001_mmm_core_tables.sql` | Stores domains with `framework_id` FK | **CREATED** (schema exists — DATA UNKNOWN) |

### 3.2 AIMC Knowledge Store (Supplemental)

| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| `ai_knowledge` table | `packages/ai-centre/supabase/migrations/003_ai_knowledge.sql` | Org-scoped vector knowledge store for RAG retrieval | **CREATED** (schema exists — DATA UNKNOWN) |
| `source`, `domain`, `module`, `standard_ref` columns | `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` | Metadata columns for knowledge classification including standard reference | **PRESENT** |
| `source_document_name`, `document_id` columns | `packages/ai-centre/supabase/migrations/008_ai_knowledge_chunk_metadata.sql` | Source document traceability per chunk | **PRESENT** |

### 3.3 Legacy Document System (Deprecated Path)

| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| `ai_documents` table | `apps/maturion-maturity-legacy/supabase/migrations.bak.*/` | Legacy KUC document upload store | **LEGACY — DEPRECATED** |
| `ai_document_chunks` table | Legacy backup migrations | Chunked content from uploaded documents | **LEGACY — DEPRECATED** |
| `generate-and-save-criteria` Edge Function | `apps/maturion-maturity-legacy/supabase/functions/generate-and-save-criteria/index.ts` | Queries `ai_document_chunks` for `document_type = 'mps_document'` | **LEGACY — NOT APPLICABLE TO MMM** |

---

## 4. Migration Gap Assessment

### 4.1 Expected Migration Path

Per the MMM harvest map (`modules/MMM/harvest-map/harvest-map.md`):
> "Mode A — Verbatim Upload: Accepts document uploads (e.g. PDF of existing standard) and uses AI
> to extract and structure criteria into Domain → MPS → Criteria format. Reclassified: requires AIMC
> integration wiring for AI-assisted extraction."

The intended data path for MPS source documents in the MMM system is:
```
CS2 uploads Word document → mmm-framework-sources bucket → mmm_parse_jobs created
→ AI extraction → mmm_domains + mmm_maturity_process_steps + mmm_criteria populated
```

### 4.2 Gap Evidence

**Code investigation findings** (cannot confirm data without live DB query):

1. **No seed migration exists** for MPS 1–25 generic content in any MMM migration file.
   - Checked all 6 migrations in `supabase/migrations/` (20260420000001 through 20260422000002)
   - No `INSERT INTO mmm_maturity_process_steps` or `INSERT INTO mmm_criteria` statements found
   - No `INSERT INTO mmm_domains` statements for generic MPS domains found

2. **No framework document upload recorded** in any migration or seed file.
   - The `mmm-framework-sources` bucket was created (20260420000004) but no document uploads exist in code

3. **The AIMC/ai_knowledge table** has no MPS-specific seed data. The `source_document_name` and
   `document_id` columns exist but are only populated at runtime via the document ingestion pipeline.

4. **The legacy `ai_documents` / `ai_document_chunks` path** is for the LEGACY app (`apps/maturion-maturity-legacy/`) and does NOT map to the MMM `mmm_maturity_process_steps` / `mmm_criteria` tables.

### 4.3 Migration Gap Conclusion

The 25 generic MPS Word source documents appear **NOT to have been migrated** into the new MMM system
(`mmm-framework-sources` bucket → `mmm_maturity_process_steps` / `mmm_criteria`). The storage
infrastructure EXISTS (bucket, tables, parse jobs pipeline), but the data has NOT been seeded or
uploaded via migration scripts.

**This is a MIGRATION GAP** that requires CS2 to:
1. **Verify** by querying the live database (SQL provided in §6 below).
2. **Act** by re-uploading the 25 Word documents via the MMM framework upload pipeline if absent.

---

## 5. Content Verification Requirement

Per acceptance criterion #3: content must be confirmed as **generic** MPS content, not the
diamond-specific LDCS markdown file.

**Code finding**: The `mmm_maturity_process_steps.framework_id` FK links to `mmm_frameworks`. If
documents are uploaded, CS2 must verify:
- Framework name/type does NOT reference "diamond" or org-specific LDCS identifier
- `mmm_maturity_process_steps` records reflect generic MPS 1–25 content

The diamond-specific LDCS content is in:
`apps/maturion-maturity-legacy/` — criteria parsing for org-specific LDCS documents.
This path is NOT the same as the generic MPS source pack.

---

## 6. CS2 DB Verification Queries

Run these queries against the live Supabase `public` schema to confirm document presence:

### Q1: Check for MPS source documents in the MMM framework sources bucket
```sql
-- MMM framework-sources bucket: check for uploaded MPS documents
SELECT name, metadata, created_at
FROM storage.objects
WHERE bucket_id = 'mmm-framework-sources'
ORDER BY created_at DESC;
```

### Q2: Check if mmm_maturity_process_steps is populated
```sql
-- MPS table row count and sample data
SELECT 
  COUNT(*) AS total_mps,
  COUNT(DISTINCT d.name) AS distinct_domains
FROM public.mmm_maturity_process_steps mps
JOIN public.mmm_domains d ON d.id = mps.domain_id;
```

### Q3: Check if mmm_criteria is populated
```sql
-- Criteria count per MPS
SELECT 
  mps.name AS mps_name,
  COUNT(c.id) AS criteria_count
FROM public.mmm_maturity_process_steps mps
LEFT JOIN public.mmm_criteria c ON c.mps_id = mps.id
GROUP BY mps.id, mps.name
ORDER BY mps.name;
```

### Q4: Check AIMC ai_knowledge for MPS-related entries
```sql
-- AIMC knowledge base entries with MPS-related source references
SELECT 
  id, domain, module, standard_ref, source, source_document_name, approval_status, created_at
FROM ai_knowledge
WHERE 
  standard_ref ILIKE '%MPS%'
  OR source ILIKE '%MPS%'
  OR source ILIKE '%maturity process%'
  OR source_document_name ILIKE '%MPS%'
ORDER BY created_at DESC
LIMIT 50;
```

### Q5: Verify content is generic (not diamond-specific LDCS)
```sql
-- Check framework names to verify generic vs org-specific content
SELECT f.name, f.description, f.framework_type, COUNT(d.id) AS domain_count
FROM public.mmm_frameworks f
LEFT JOIN public.mmm_domains d ON d.framework_id = f.id
GROUP BY f.id, f.name, f.description, f.framework_type;
```

---

## 7. CS2 Decision Tree

```
CS2 runs Q1+Q2+Q3 queries above
         │
         ├── mmm_maturity_process_steps has 25 rows AND
         │   criteria populated AND content verified as generic
         │                           │
         │                           └──► Documents PRESENT: 
         │                                Proceed to Track B.
         │                                Delegate to mat-specialist + api-builder for
         │                                JSON derivation; ui-builder for question bank;
         │                                qa-builder for 25-MPS coverage tests.
         │                                Track B replaces PR #1500 static interim once
         │                                KUC-derived model is confirmed and complete.
         │
         ├── mmm_maturity_process_steps is EMPTY or has < 25 rows
         │                           │
         │                           └──► MIGRATION GAP CONFIRMED:
         │                                1. Re-upload all 25 generic MPS Word documents
         │                                   via the MMM framework upload pipeline
         │                                   (mmm-framework-sources bucket)
         │                                2. Wait for mmm_parse_jobs processing to complete
         │                                3. Verify mmm_maturity_process_steps + mmm_criteria
         │                                   are populated with all 25 MPSs
         │                                4. Then approve Track B delegation
         │                                Track B replaces PR #1500 static interim once re-upload complete and KUC source verified.
         │
         └── Content present but diamond-specific (LDCS)
                                     │
                                     └──► Wrong content. Re-upload generic MPS pack.
                                          Same Track B path as migration gap.
```

---

## 8. CS2 Decision on PR #1500 (Updated)

PR #1500 (`QUESTION_BANK` in `FreeAssessmentPage.tsx`) has been **approved by CS2 as an interim
static implementation** under maturion-isms#1499, with the following explicit caveat:

- **PR #1500 must NOT close maturion-isms#1501.**
- maturion-isms#1501 (canonical KUC/AIMC source verification) remains **open and unresolved**.
- Track B (KUC-derived question bank) remains blocked pending CS2 DB verification and re-upload
  decision — it is not blocked by PR #1500 itself.
- A follow-up action is required to search KUC/document-upload tables for the generic MPS Word
  source pack and determine whether a KUC migration or re-upload is needed.

The static approach in PR #1500 is technically correct (tests pass, scoring works) and has been
accepted as a known interim measure. Track B will replace it once the canonical KUC source is
confirmed and the structured Domain → MPS → Criteria model is derived.

---

## 9. Track B Prerequisites (if CS2 confirms documents present)

When CS2 confirms MPS source documents are present in the MMM system, Track B delegation proceeds:

| Builder | Task | Evidence Required |
|---------|------|-------------------|
| `mat-specialist` | Query `mmm_maturity_process_steps` + `mmm_criteria`; produce `generic-mps-baseline.json` structure (Domain → MPS → Criteria) | JSON artifact committed; MPS 1–25 all present |
| `api-builder` | API endpoint for question bank retrieval (or static JSON model artifact) | Endpoint tests GREEN; covers all 25 MPSs |
| `ui-builder` | Replace `FreeAssessmentPage.tsx` static `QUESTION_BANK` with KUC-derived model | Tests GREEN; QUESTION_BANK replaced |
| `qa-builder` | Tests proving all 25 MPSs covered | T-MMM-S6-xxx: `expect(coveredMPSIds).toHaveLength(25)` |

IAA pre-brief Track B categories: AAWP_MAT × 3 + MPS Coverage Proof (mandatory table in PREHANDOVER).

---

*Document committed as Track A deliverable. CS2 action required before Track B delegation.*
