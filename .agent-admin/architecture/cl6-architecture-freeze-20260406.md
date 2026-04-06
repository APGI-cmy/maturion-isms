# CL-6 Architecture Freeze — Wave CL-6: LKIAC Wave 3 Knowledge Re-ingestion

**Artifact Type**: Architecture Freeze  
**Wave**: CL-6 (Re-launch — governed builder path)  
**Freeze Date**: 2026-04-06  
**Freeze Authority**: CS2 (Johan Ras / @APGI-cmy) via CEP v1.8.0 §Wave CL-6  
**CS2 Authorization Issue**: #1240  
**Branch**: copilot/cl-6-relaunch-knowledge-ingestion  
**Freeze Status**: FROZEN — no changes permitted without CS2 written authorisation  

---

## Architecture Source

**Canonical source**: `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` §Wave CL-6  
**LKIAC source**: LKIAC-001 §5 Wave 3; §7  
**CEP version at freeze**: v1.8.0  
**Entry criteria confirmed**: CL-2 ✅ COMPLETE, CL-4 ✅ COMPLETE  

---

## Canonical Deliverable Paths (FROZEN)

| Deliverable ID | Description | Agent | Canonical Path |
|---------------|-------------|-------|----------------|
| CL-6-D1 | RED gate migration test suite | `qa-builder` | `packages/ai-centre/src/migrations/` (or `packages/ai-centre/__tests__/cl6/`) |
| CL-6-D2 | Migration script (TypeScript) | `api-builder` | `packages/ai-centre/scripts/migrate-legacy-knowledge.ts` |
| CL-6-D3 | Semantic search validation report | `qa-builder` | `.agent-workspace/audit/LKIAC-W3-semantic-validation-20260406.md` |
| CL-6-D4 | Migration report | `api-builder` | `.agent-workspace/audit/LKIAC-W3-migration-report-20260406.md` |

**⚠️ PATH CONFLICT RESOLUTION (IAA BLOCKER-1)**:  
Prior PR #1233 used `src/scripts/migrate-knowledge-embeddings.ts` — this path is REJECTED.  
Canonical path per CEP v1.8.0 is `packages/ai-centre/scripts/migrate-legacy-knowledge.ts`.  
All builders MUST use the CEP-canonical path. Any deviation is an architecture violation.

---

## Technical Requirements (FROZEN)

### Migration Script (CL-6-D2)

- **Source**: Legacy Supabase project `dmhlxhatogrrrvuruayv`
- **Target**: AIMC `ai_knowledge` table
- **Embedding dimension**: 1536 (OpenAI-compatible, same as AIMC vector model)
- **Credentials**: Environment variables ONLY — `LEGACY_SUPABASE_URL`, `LEGACY_SUPABASE_SERVICE_KEY`, `AIMC_SUPABASE_URL`, `AIMC_SUPABASE_SERVICE_KEY`. No hardcoded project IDs. (CL6-FFA-014)
- **Approved domain source labels**: `iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management`, `general`, `ldcs`, `diamond-industry` (from CL-2-D2 mapping, `ldcs` + `diamond-industry` adopted from CP-2) (CL6-FFA-004)
- **approval_status**: All migrated rows must have `approval_status = 'pending'` (CL6-FFA-005)
- **Deduplication**: SHA-256 `content_hash` based deduplication (CL6-FFA-009)
- **Batching**: Batched fetch (100 rows per batch), per-row error isolation
- **org_page_chunks**: INCLUDED in migration scope (per CP-2 closure)

### Schema/RLS Requirements

- **RLS Policy Fix**: `ai_knowledge_org_insert` policy must be scoped `TO authenticated` only — drops `anon` INSERT access (CL6-FFA-007)
- **Schema verification**: SQL script `010_cl6_schema_verification.sql` confirms all required columns present across migration chain (003→006→008→009)

### Pipeline 1 Isolation (ADR-005 — HARD GATE)

The following files MUST NOT be touched by this wave (CL6-FFA-006):
- `CriteriaUpload.tsx`
- `CriteriaManagementPage.tsx`
- `useCriteria.ts`
- `invoke-ai-parse-criteria` Edge Function

Any change to these files is a HARD GATE violation at IAA audit.

### RED Gate Test Suite (CL-6-D1)

12 tests covering (minimum):
1. Row count match (≥ legacy count)
2. Per-domain row counts (all 8 domains represented)
3. Embedding dimension check (1536)
4. `approval_status = 'pending'` on migrated rows
5. RLS policy enforcement (`ai_knowledge_org_insert` scoped to authenticated)
6. ARC queue domain queryability (CL6-FFA-008)
7. Deduplication via `content_hash` (CL6-FFA-009)
8. Pipeline 1 isolation (no Pipeline 1 files touched)
9. Chunk schema shape compliance
10. Semantic search basic functionality
11. Domain tag validation (approved labels only)
12. Schema verification SQL assertions

**RED gate sequencing (CL6-FFA-001)**: All 12 tests MUST be RED (failing) BEFORE any migration script code is written. `qa-builder` produces CL-6-D1 BEFORE `api-builder` receives migration task.

### Semantic Search Validation (CL-6-D3)

- Minimum 10 queries per domain area returning relevant results post-migration
- Per LKIAC-001 §7.4
- Documents which domains returned results and quality assessment

### Migration Report (CL-6-D4)

- Legacy Supabase row count vs AIMC row count (must be ≥)
- Per-domain counts
- Semantic search results summary
- Confirmation migration complete
- No placeholder content (CL6-FFA-011)

---

## Prior Work Reference Policy

PR #1233 (closed 2026-04-06) may be used as **technical reference material only**. It is NOT the implementation vehicle. The governed implementation MUST proceed through a fresh builder path with:
- New builder invocation via `task()` tool
- Fresh RED gate before any green code
- No direct code copy-paste without explicit declaration in PREHANDOVER proof (CL6-FFA-013)

---

## Sequencing Constraints

1. Foreman commits wave-current-tasks.md and architecture freeze → report_progress
2. qa-builder receives RED gate task → produces CL-6-D1 (all 12 tests failing)
3. Foreman verifies RED gate → QP check → confirms RED
4. api-builder receives migration task → produces CL-6-D2 + CL-6-D4
5. qa-builder produces CL-6-D3 (semantic search validation) in parallel with or after CL-6-D2
6. Foreman QP evaluation → all tests GREEN → PREHANDOVER proof → IAA audit

---

## AAWP Confirmation (IAA BLOCKER-2)

`AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` has no explicit CL-6 row. This is confirmed as expected:  
CL-6 is governed exclusively by CEP v1.8.0. No AAWP row amendment is required.  
**Resolved**: CEP-only governance confirmed for CL-6. Blocker cleared.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Freeze Date**: 2026-04-06  
**Living Agent System**: v6.2.0  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-cl6-relaunch-20260406.md`
