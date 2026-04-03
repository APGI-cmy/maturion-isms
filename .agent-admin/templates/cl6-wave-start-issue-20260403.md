# CL-6 Wave-Start Issue Template (for CS2 to post)

**Prepared by**: foreman-v2-agent v6.2.0 (session-cep-v1.8.0-programme-clearance-20260403)  
**Date**: 2026-04-03  
**Purpose**: CS2 should copy the content between the `---` dividers below and post it as a new GitHub issue.

---

## TEMPLATE START (copy from here) ---

---
# 🟢 Wave CL-6: LKIAC Wave 3 — Knowledge Re-ingestion (Wave-Start Authorization)

**Authority:** CS2 (@APGI-cmy) — 2026-04-03  
**Custom agent:** foreman-v2-agent  
**Programme:** LKIAC — Wave 3 of 6

---

## Entry Gates — ALL MET ✅

| Gate | Status | Evidence |
|------|--------|---------|
| CL-2 ✅ — Legacy Knowledge Inventory COMPLETE | ✅ CLOSED | CP-2 signed off 2026-04-03; `.agent-admin/checkpoints/cp-2-closure-20260403.md` |
| CL-4 ✅ — AIMC Audit Phase A COMPLETE | ✅ CLOSED | CP-4 signed off 2026-04-03 |

All entry gates confirmed met. CL-6 is authorized to proceed.

---

## Wave Objective

Migrate all knowledge embeddings from the legacy Supabase project (`dmhlxhatogrrrvuruayv`) into the AIMC `ai_knowledge` table. Re-embed content using the AIMC vector model (1536-dim, OpenAI-compatible). Validate migration. Decommission legacy Supabase project after verified row count match.

**Architecture**: Frozen. No new AIMC features — migration only.

---

## Reference Artifacts

- **CP-2 Closure Artifact**: `.agent-admin/checkpoints/cp-2-closure-20260403.md`
- **Domain Tagging Map (CL-2-D2)**: `governance/aimc/` (produced 2026-03-01, accepted CP-2 2026-04-03)
- **Extended Taxonomy Decisions** (from CP-2):
  - `ldcs` domain label: **ADOPTED**
  - `diamond-industry` domain label: **ADOPTED**
- **`org_page_chunks` scope**: **INCLUDED in CL-6**
- **CEP Reference**: `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.8.0 §Wave CL-6

---

## Delegated Agents

| Agent | Role in CL-6 |
|-------|-------------|
| `qa-builder` | RED gate test suite (CL-6-D1): chunk tester, domain tagging, `ai_knowledge` write, ARC status, Smart Chunk Reuse, Pipeline 1 isolation |
| `api-builder` | Migration script (CL-6-D2) + Edge Function wiring |
| `schema-builder` | Schema verification — confirm `ai_knowledge` columns correct before migration |
| `mat-specialist` | Domain tag validation against CL-2-D2 mapping |

---

## RED Gate Test Specification

The following RED gate tests must be defined and FAILING before any builder receives implementation tasks.

**`qa-builder` must deliver all RED gate tests before `api-builder` receives the migration script task.**

| Test ID | Description | Failure Criterion |
|---------|-------------|-------------------|
| T-CL6-CHUNK-001 | Chunk tester: `org_page_chunks` table schema matches CL-6 spec (required columns: `id`, `organisation_id`, `page_id`, `chunk_text`, `embedding`, `source`, `domain`) | Any required column missing |
| T-CL6-CHUNK-002 | Chunk tester: chunk embedding dimension = 1536 | Embedding dimension != 1536 |
| T-CL6-CHUNK-003 | Chunk tester: chunk `source` field maps to CL-2-D2 approved source labels | Unknown source label found |
| T-CL6-DOM-001 | Domain tagging: chunk with `domain='ldcs'` is queryable via AIMC vector search | Zero results for `ldcs` query |
| T-CL6-DOM-002 | Domain tagging: chunk with `domain='diamond-industry'` is queryable via AIMC vector search | Zero results for `diamond-industry` query |
| T-CL6-WRITE-001 | `ai_knowledge` write: migration inserts row with `approval_status = 'pending'` on insert | Row inserted with approval_status != 'pending' |
| T-CL6-WRITE-002 | `ai_knowledge` write: RLS permits INSERT for service-role only; anon role denied | Anon INSERT succeeds (security failure) |
| T-CL6-ARC-001 | ARC status: newly migrated row appears in ARC pending review queue | Row not visible in ARC queue |
| T-CL6-SCR-001 | Smart Chunk Reuse: duplicate chunk (same `page_id` + `chunk_text`) is deduplicated — second INSERT does not create a new row | Duplicate row created |
| T-CL6-PIPE-001 | Pipeline 1 isolation: CL-6 migration does NOT touch Pipeline 1 tables (`criteria_documents`, `ai_knowledge` rows with `source='criteria'`) | Pipeline 1 row count changes during migration |
| T-CL6-ROWCOUNT-001 | Row count match: `ai_knowledge` row count after migration ≥ legacy Supabase `knowledge_embeddings` row count | Row count deficit |
| T-CL6-SEMANTIC-001 | Semantic search: query "diamond certification standards" returns ≥ 1 result with `domain='ldcs'` | Zero results |

---

## Acceptance Criteria

- [ ] RED gate tests (T-CL6-* above) defined and FAILING before implementation
- [ ] `api-builder` migration script delivers CL-6-D2 (TypeScript migration script)
- [ ] `schema-builder` confirms `ai_knowledge` schema is correct before migration runs
- [ ] `mat-specialist` validates domain tag mapping: all migrated rows have valid `ldcs` or `diamond-industry` or approved `source` values
- [ ] All RED gate tests GREEN after migration
- [ ] `ai_knowledge` row count ≥ legacy row count
- [ ] Semantic search validation: all domain areas returning relevant results (CL-6-D3)
- [ ] Migration report complete (CL-6-D4)
- [ ] CP-6 CS2 review gate reached before legacy decommission

**Merge authority:** CS2 ONLY (@APGI-cmy)

## TEMPLATE END ---

---

*This template was prepared by foreman-v2-agent v6.2.0 as part of the CEP v1.8.0 programme clearance session (2026-04-03).*  
*CS2: please copy the content between the TEMPLATE START and TEMPLATE END markers above and post it as a new GitHub issue.*
