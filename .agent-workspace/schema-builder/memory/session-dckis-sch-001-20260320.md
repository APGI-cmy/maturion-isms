# Schema Builder — Session Memory
## Session: dckis-sch-001
## Date: 2026-03-20
## Wave: DCKIS-SCH-001 — MAT Knowledge Schema Alignment (ai_knowledge vs document_chunks Delta)
## Task: DCKIS-SCH-001

---

## Agent Metadata
- **Agent Type**: schema-builder
- **Agent Class**: Builder
- **Session ID**: session-dckis-sch-001
- **Contract Version**: v4.1.0 (Four-Phase Canonical)

## Task Description
Assess schema gap between `ai_knowledge` and `document_chunks` required for Pipeline 2 ingestion.
Produce a migration to close all identified gaps. Turn T-KU-004 and T-KU-005 from RED to GREEN.

## Files Created

| File | Action | Notes |
|------|--------|-------|
| `packages/ai-centre/supabase/migrations/008_ai_knowledge_chunk_metadata.sql` | CREATED | 7 columns + 1 index + INSERT RLS WITH CHECK |
| `packages/ai-centre/supabase/migrations/008_ai_knowledge_chunk_metadata_schema_doc.md` | CREATED | Column table, SQL delta, gap resolution notation |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | UPDATED | iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-dckis-sch-001.md |
| `.agent-admin/assurance/iaa-prebrief-dckis-sch-001.md` | CREATED | IAA pre-brief for DCKIS-SCH-001 |
| `.agent-workspace/schema-builder/evidence/prehandover/proof-dckis-sch-001-20260320.md` | CREATED | Pre-handover proof |
| `.agent-workspace/schema-builder/memory/session-dckis-sch-001-20260320.md` | CREATED | This file |

## Schema Gaps Resolved

| Gap | Column | Status |
|-----|--------|--------|
| Gap 1 (AIMC-P1 §2.4) | `document_id TEXT` | ✅ RESOLVED |
| Gap 2 (AIMC-P1 §2.4) | `chunk_index INTEGER` | ✅ RESOLVED |
| Gap 3 (AIMC-P1 §2.4) | `content_hash TEXT` + `idx_ai_knowledge_content_hash` index | ✅ RESOLVED |
| Gap 4 (AIMC-P1 §2.4) | `metadata JSONB DEFAULT '{}'` | ✅ RESOLVED |
| §4.6.3 addition | `chunk_size INTEGER DEFAULT 2000` | ✅ ADDED |
| §4.6.3 addition | `chunk_overlap INTEGER DEFAULT 200` | ✅ ADDED |
| §4.6.3 addition | `source_document_name TEXT` | ✅ ADDED |
| RLS gap | `ai_knowledge_org_insert` INSERT WITH CHECK policy | ✅ ADDED |

## Test Results

| Test | Status |
|------|--------|
| T-KU-004 — chunk metadata columns | ✅ GREEN |
| T-KU-005 — INSERT WITH CHECK RLS policy | ✅ GREEN |
| T-KU-001 through T-KU-003, T-KU-006 through T-KU-012 | ❌ RED (out of scope — DCKIS-IMPL-001/002) |

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| All 7 new columns nullable | Backward compatibility with existing rows |
| `chunk_size DEFAULT 2000`, `chunk_overlap DEFAULT 200` | Matches Pipeline 2 architecture §4.6.3 defaults |
| Added `document_id`, `content_hash`, `metadata` beyond test requirements | Architecture review §2.4 identified these as critical gaps; complete the migration fully |
| `idx_ai_knowledge_content_hash` index | Smart Chunk Reuse deduplication requires efficient hash lookups |
| INSERT policy uses `current_setting('app.current_organisation_id', true)` | Consistent with existing SELECT policy pattern from 003_ai_knowledge.sql |

## Constitutional Compliance
- ADR-001: ai_knowledge remains the target ✅
- ADR-003: approval_status = 'pending' default preserved ✅
- ADR-005: Pipeline 1 untouched ✅
- Architecture authority: system-architecture.md §4.6.3 FROZEN ✅

## IAA Token
- iaa_audit_token: IAA-session-dckis-sch-001-20260320-PASS
- Token artifact: `.agent-admin/assurance/iaa-token-session-dckis-sch-001-20260320.md`
- Phase: PHASE_B_BLOCKING
