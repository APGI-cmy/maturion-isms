# IAA Pre-Brief — Wave 20: Wire parse_write_back_atomic RPC into Edge Function

**Document type**: IAA Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave**: Wave 20 — Wire parse_write_back_atomic RPC into Edge Function for atomic DB write-back
**Branch**: copilot/implement-wire-parse-write-back-rpc
**Issue**: maturion-isms#1143 — Wire parse_write_back_atomic RPC into criteria parsing Edge Function for atomic DB write-back
**Pre-Brief authored by**: foreman-v2-agent (Phase 1 Step 1.8 — pre-brief request)
**Date**: 2026-03-18
**Authority**: CS2 (@APGI-cmy) | INDEPENDENT_ASSURANCE_AGENT_CANON.md
**Invocation mode**: PHASE 0 — PRE-BRIEF. IAA assurance phases 1–4 to be invoked by IAA agent.
**Gap register source**: `modules/mat/00-app-description/CRITERIA-PARSING-GAP-REGISTER.md`
**Task origin**: Wave 19 IAA PASS flagged T-W19C-004 as open/uncompleted task

---

## 1. Wave Summary

Wave 20 is a focused follow-up to Wave 19, addressing the one remaining open task
from GAP-PARSE-005: T-W19C-004 (wire the `parse_write_back_atomic` RPC into the Edge Function).

The Wave 19 IAA PASS (token: IAA-session-wave19-orchestration-20260317-R3-PASS) confirmed the RPC
exists and is schema-correct, but noted that the Edge Function had NOT yet been updated to call it.
The sequential supabase-js upserts remained, leaving a mid-flight failure window that could produce
orphaned domain/MPS rows with no criteria.

**Scope**: Single focused task — wire the atomic RPC + fix 3 bugs in the RPC itself + add tests + update README
**Test coverage**: T-W20-001 through T-W20-008 (8 new tests in `wave20-atomic-write-back.test.ts`)
**Batches**: Single batch (api-builder + schema corrections + test suite)

---

## 2. IAA Trigger Category Declaration

This wave triggers **ONE** IAA category:

| Category | Reason | Applicable Tasks |
|----------|--------|-----------------|
| **AAWP_MAT** (PRIMARY) | SQL migration changes, Edge Function code changes, test suite additions, README documentation update — all are build deliverables for the MAT module | All tasks T-W20-001 through T-W20-008 |

**No AGENT_CONTRACT trigger**: No agent contracts modified.
**No CI_WORKFLOW trigger**: No CI workflows modified.
**No CANON_GOVERNANCE trigger**: No canon or governance documents authored.

---

## 3. Qualifying Tasks and Per-Task IAA Declarations

### Wave 20 — api-builder (T-W20-001 through T-W20-005: Edge Function wiring)

| Field | Value |
|-------|-------|
| **Task IDs** | T-W20-001, T-W20-002, T-W20-003, T-W20-004, T-W20-005 |
| **Task Summary** | Replace sequential `supabase.from().upsert()` calls for domains/MPS/criteria with single `supabase.rpc('parse_write_back_atomic', {...})` call in `invoke-ai-parse-criteria/index.ts` |
| **IAA Trigger Category** | AAWP_MAT |
| **Required Phases at Handover** | Phase 2, Phase 3 (AAWP overlay), Phase 4 |
| **Required Evidence Artifacts** | (1) T-W20-001 GREEN: `supabase.rpc('parse_write_back_atomic')` call present; (2) T-W20-002 GREEN: all 4 RPC parameters present; (3) T-W20-003 GREEN: sequential upserts removed; (4) T-W20-004 GREEN: document_id resolution before RPC; (5) T-W20-005 GREEN: rpcError check + zero-insert assertion |
| **Applicable Overlays** | AAWP_MAT category overlay |
| **Specific IAA Rules** | (1) Must confirm old sequential upserts (`supabase.from('domains').upsert`, `supabase.from('mini_performance_standards').upsert`, `supabase.from('criteria').upsert`) are removed. (2) Must confirm `supabase.rpc('parse_write_back_atomic', { p_document_id, p_domains, p_mps, p_criteria })` is present. (3) Must confirm error handling: `if (rpcError) throw new Error(...)`. (4) Must confirm zero-insert assertion reads `domainsInserted`, `mpsInserted`, `criteriaInserted` from RPC response. |

### Wave 20 — schema-builder corrections (T-W20-006 through T-W20-008: Migration fix)

| Field | Value |
|-------|-------|
| **Task IDs** | T-W20-006, T-W20-007, T-W20-008 |
| **Task Summary** | Migration `20260318000001` corrects 3 bugs in the Wave 19 `parse_write_back_atomic` RPC: (1) status `'processed'` → `'pending_review'`; (2) service_role `auth.uid() IS NULL` bypass; (3) GRANT EXECUTE to service_role |
| **IAA Trigger Category** | AAWP_MAT |
| **Required Phases at Handover** | Phase 2, Phase 3 (AAWP overlay), Phase 4 |
| **Required Evidence Artifacts** | (1) T-W20-006 GREEN: migration uses `'pending_review'` not `'processed'`; (2) T-W20-007 GREEN: `GRANT EXECUTE ... TO service_role`; (3) T-W20-008 GREEN: `IF auth.uid() IS NOT NULL` branch present |
| **Applicable Overlays** | AAWP_MAT category overlay |
| **Specific IAA Rules** | (1) Migration must use `CREATE OR REPLACE FUNCTION` (idempotent). (2) Status value `'pending_review'` must match the CHECK constraint in `criteria_documents` table. (3) Service-role bypass must NOT grant unrestricted access — direct document lookup by `p_document_id` is correct. (4) No changes to the Wave 19 `20260317000003` migration file (it is committed and must remain immutable). |

---

## 4. FFA Checks IAA Will Run at Handover

| Check ID | Description |
|----------|-------------|
| CORE-001 | Working tree clean (nothing to commit beyond Wave 20 artifacts) |
| CORE-002 | Branch declared: `copilot/implement-wire-parse-write-back-rpc` |
| CORE-003 | Tests 36/36 PASS (vitest: wave15 + wave19 + wave20) — zero failures |
| CORE-004 | Zero test debt / stubs in wave20 test file |
| CORE-005 | Architecture decisions honoured (atomic RPC wiring as specified) |
| CORE-006 | POLC boundary — no direct production code written by Foreman |
| CORE-013 | PREHANDOVER proof committed |
| CORE-015 | Session memory committed |
| CORE-016 | `iaa_audit_token` pre-populated in PREHANDOVER proof |
| CORE-018 | Evidence artifact bundle complete |
| CORE-019 | PREHANDOVER reflects actual state |
| CORE-021 | Commits present (HEAD local ahead of origin — token commit will push) |
| CORE-022 | SCOPE_DECLARATION current |
| **W20-001** | Sequential upserts removed: `from('domains').upsert`, `from('mini_performance_standards').upsert`, `from('criteria').upsert` all ABSENT from main parse path |
| **W20-002** | Atomic RPC present: `supabase.rpc('parse_write_back_atomic', { p_document_id, p_domains, p_mps, p_criteria })` present |
| **W20-003** | Migration `20260318000001` uses status = `'pending_review'` not `'processed'` |
| **W20-004** | Migration `20260318000001` grants `EXECUTE` to `service_role` |
| **W20-005** | `auth.uid() IS NULL` bypass present in `20260318000001` |
| **W20-006** | T-W20-001 through T-W20-008 all GREEN |
| MERGE GATE PARITY (§4.3) | Local checks aligned with CI merge gate |
| INDEPENDENCE | IAA did not produce any artifact in this PR |

---

## 5. Required PREHANDOVER Proof Structure

The PREHANDOVER proof (to be committed by Foreman at Phase 4) must contain:

```markdown
- Session ID: session-wave20-atomic-write-back-20260318
- Date: 2026-03-18
- Agent: foreman-v2-agent v6.2.0
- Issue: maturion-isms#1143
- Wave: Wave 20 — Wire parse_write_back_atomic RPC
- Builder: api-builder (Edge Function), schema corrections
- QP verdict: PASS
- OPOJD gate: PASS
  - [x] Zero test failures (36/36 PASS)
  - [x] Zero skipped/todo/stub tests
  - [x] Zero deprecation warnings
  - [x] Zero compiler/linter warnings
  - [x] Evidence artifacts present
  - [x] Architecture followed
  - [x] §4.3 Merge gate parity: PASS
- merge_gate_parity: PASS
- iaa_audit_token: IAA-session-wave20-atomic-write-back-20260318-PASS (expected at commit time)
- CS2 authorization: Issue maturion-isms#1143 opened by CS2 and assigns this agent
```

---

## 6. Scope Blockers and Governance Conflicts

**No scope blockers identified.** The following observations are advisory:

1. **Migration immutability**: Migration `20260317000003` (Wave 19) must NOT be modified. Wave 20 correction is in a new migration `20260318000001`. IAA must verify the Wave 19 file is unchanged.

2. **Descriptor writes are NOT atomic**: `domain_level_descriptors`, `mps_level_descriptors`, `criteria_level_descriptors` are written via separate upserts after the atomic RPC. This is by design — descriptors are non-critical enrichment and their failure does not corrupt the core hierarchy. IAA should confirm this is architecturally acceptable (it was the pattern in Wave 19 as well).

3. **Re-parse idempotency**: The Edge Function pre-clears stale hierarchy rows before calling the RPC (DELETE domains WHERE audit_id — CASCADE propagates). IAA should confirm this does not violate atomicity expectations.

4. **T-W15-CP-007/008/009 backward compatibility**: These Wave 15 tests were updated to accept either the legacy upsert pattern OR the atomic RPC pattern. IAA should confirm the updated assertions are still meaningful and not trivially passing.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Next action**: IAA agent invoked — awaiting assurance phases 1–4
