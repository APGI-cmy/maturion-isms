# IAA Pre-Brief: DCKIS-SCH-001

**Wave**: DCKIS-SCH-001 — MAT Knowledge Schema Alignment  
**Agent**: schema-builder  
**Date**: 2026-03-20  
**IAA Pre-Brief ID**: iaa-prebrief-dckis-sch-001  
**Parent Pre-Brief**: .agent-admin/assurance/iaa-prebrief-dckis-qa-red.md (QA pre-brief that established the T-KU-001–T-KU-012 RED gate suite; DCKIS-SCH-001 satisfies T-KU-004 and T-KU-005 from that suite)  

---

## 1. Scope Declaration

Schema-builder wave DCKIS-SCH-001 delivers:

1. **SQL migration** `packages/ai-centre/supabase/migrations/008_ai_knowledge_chunk_metadata.sql`
   - 7 chunk metadata columns added to `ai_knowledge` (nullable, backward-compatible)
   - INSERT RLS policy with `WITH CHECK` clause for org isolation
   - Index on `content_hash` for deduplication

2. **Schema documentation** `packages/ai-centre/supabase/migrations/008_ai_knowledge_chunk_metadata_schema_doc.md`
   - Column table with types and purposes
   - SQL diff against legacy `document_chunks` structure
   - AIMC-P1-upload-arch-review-20260319.md §2.4 gap resolution notation

---

## 2. Architecture Authority

- **Frozen architecture**: system-architecture.md §4.6 (Pipeline 2 Knowledge Ingestion) — CONFIRMED FROZEN
- **Column spec source**: system-architecture.md §4.6.3 (`chunk_index`, `chunk_size`, `chunk_overlap`, `source_document_name`)
- **Gap spec source**: AIMC-P1-upload-arch-review-20260319.md §2.4 (`document_id`, `content_hash`, `metadata`)

---

## 3. RED Tests Addressed

| Test ID  | Description                                           | Pre-Wave  | Post-Wave |
|----------|-------------------------------------------------------|-----------|-----------|
| T-KU-004 | ai_knowledge migration adds chunk metadata columns    | RED ❌     | GREEN ✅   |
| T-KU-005 | ai_knowledge INSERT RLS with WITH CHECK               | RED ❌     | GREEN ✅   |

Tests T-KU-001 through T-KU-003, T-KU-006 through T-KU-012 remain RED — outside schema-builder scope.

---

## 4. Constitutional Compliance

- ✅ Zero test debt — no `.skip()`, `.todo()`, no commented tests
- ✅ Architecture frozen before build commenced
- ✅ QA-to-Red tests existed and were RED before implementation
- ✅ 100% of in-scope tests (T-KU-004, T-KU-005) are GREEN
- ✅ No application code modified (schema-builder scope only)
- ✅ No RLS policies weakened (new INSERT policy added)
- ✅ No governance files modified
- ✅ Self-modification prohibition respected (SELF-MOD-SCHEMA-001)

---

## 5. Evidence References

- Migration: `packages/ai-centre/supabase/migrations/008_ai_knowledge_chunk_metadata.sql`
- Schema doc: `packages/ai-centre/supabase/migrations/008_ai_knowledge_chunk_metadata_schema_doc.md`
- Pre-handover proof: `.agent-workspace/schema-builder/evidence/prehandover/proof-dckis-sch-001-20260320.md`
- Test output: T-KU-004 ✅, T-KU-005 ✅ (10 other tests remain RED per design)

---

## 6. IAA Invocation Status

**Status**: PHASE_B_BLOCKING — IAA deployed as a blocking gate for this wave.

This pre-brief is filed per AGCFPP-001 mandate. Under PHASE_B_BLOCKING, the independent-assurance-agent must verify, before merge:
- Migration SQL matches architecture spec (§4.6.3 + §2.4 gaps)
- RLS INSERT policy correctly scoped to `ai_knowledge` with `WITH CHECK`
- T-KU-004 and T-KU-005 are GREEN
- No constitutional violations in build artifacts
