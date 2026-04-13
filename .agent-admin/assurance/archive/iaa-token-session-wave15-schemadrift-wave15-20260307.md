# IAA Token — Wave 15 Schema Drift Remediation (parse_tasks migration)

**Token type**: ASSURANCE-TOKEN
**Session ID**: session-wave15-schemadrift-reinvocation-20260307
**Original Session ID**: session-wave15-schemadrift-20260307
**Date**: 2026-03-07
**Agent**: independent-assurance-agent v6.2.0 / contract v2.2.0
**PR Branch**: copilot/add-migration-for-parse-tasks-table
**Issue**: #971
**Wave**: Wave 15 — Schema Drift Remediation (parse_tasks migration)
**Wave Slug**: wave15-schemadrift
**Adoption Phase**: PHASE_B_BLOCKING — hard gate ACTIVE
PHASE_B_BLOCKING_TOKEN: IAA-session-wave15-schemadrift-wave15-20260307-PASS
**Invocation Type**: RE-INVOCATION after STOP-AND-FIX remediation
**Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15-schemadrift.md`
**PREHANDOVER proof reviewed**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-schemadrift-wave15-20260307.md`

---

## Re-Invocation Context

| Field | Value |
|-------|-------|
| Invoked by | foreman-v2-agent (CS2-authorised, Issue #971) |
| Work produced by | schema-builder (T-W15-SCH-001) + foreman-v2-agent (T-W15-SCH-002) |
| Producing agent class | builder + foreman |
| PR category | AAWP_MAT |
| IAA triggered | YES |
| Independence check | CONFIRMED — IAA did not produce any artifact in this PR |
| Prior invocation | REJECTION-PACKAGE (5 ceremony failures — all resolved) |

---

## Prior REJECTION-PACKAGE Failures — Resolution Verified

| # | Prior Failure | Resolution | Verification |
|---|--------------|------------|-------------|
| F-1 | PREHANDOVER proof untracked | Committed in 5f0650b | `git ls-files` → PRESENT ✅ |
| F-2 | BUILD_PROGRESS_TRACKER staged-not-committed | Committed in cc83991 | `git diff --name-only origin/main...HEAD` → PRESENT ✅ |
| F-3 | Foreman session memory untracked | Committed in 5f0650b | `git ls-files` → PRESENT ✅ |
| F-4 | SCOPE_DECLARATION.md stale (BL-027 fail) | Updated for wave15-schemadrift branch | `validate-scope-to-diff.sh` EXIT 0, 10/10 ✅ |
| F-5 | Session memory not on branch (same as F-3) | Same resolution as F-3 | CONFIRMED ✅ |

**All 5 REJECTION-PACKAGE failures: RESOLVED ✅**

---

## Checks Executed

| Category | Checks | PASS | FAIL |
|----------|--------|------|------|
| FAIL-ONLY-ONCE learning (A-001, A-002, A-021, A-026, A-029, A-030) | 6 | 6 | 0 |
| Core invariants — CORE-005, 006, 007, 013, 014, 015, 016, 017, 018, 019, 020, 021 (applicable to AAWP_MAT) | 12 | 12 | 0 |
| AAWP_MAT overlay BD-001 through BD-024 | 24 | 24 | 0 |
| FFA Summary (FFA-01 through FFA-06) | 6 | 6 | 0 |
| Merge gate parity (3 checks) | 3 | 3 | 0 |
| **TOTAL** | **51** | **51** | **0** |

---

## Migration SQL Quality (confirmed from first invocation — unchanged)

Migration `20260307000001_parse_tasks_table.sql` — all 19 Pre-Brief technical checks PASS.

| Column | Type & Constraints | Status |
|--------|-------------------|--------|
| id | `uuid PRIMARY KEY DEFAULT gen_random_uuid()` | ✅ |
| audit_id | `uuid NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE` | ✅ |
| status | `text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed'))` | ✅ |
| error_message | `text` (nullable) | ✅ |
| created_at | `timestamptz NOT NULL DEFAULT now()` | ✅ |
| updated_at | `timestamptz NOT NULL DEFAULT now()` | ✅ |

- ENABLE ROW LEVEL SECURITY: ✅
- SELECT policy org-isolation (`auth.uid()` → profiles → organisation_id → audits → parse_tasks): ✅
- CREATE TABLE IF NOT EXISTS (idempotent): ✅
- DO $$ BEGIN IF NOT EXISTS … END $$ (idempotent policy guard): ✅
- Zero stubs, TODOs, FIXMEs, placeholders: ✅
- T-W13-SCH-11 passes GREEN: ✅

---

## Functional Fitness Assessment

```
FFA-01 Delivery Completeness: PASS — 10/10 files declared and present in diff
FFA-02 Wiring Verification:   PASS — parse_tasks wired to useCriteria.ts consumer; FK to audits confirmed
FFA-03 Integration Fit:       PASS — adds missing schema existing frontend hook already expects
FFA-04 Security:              PASS — RLS active, org-isolation SELECT policy, no secrets, no injection
FFA-05 Code Quality:          PASS — idiomatic DDL, idempotent guards, clean structure, zero debt
FFA-06 One-Time Build:        PASS — T-W13-SCH-11 RED gate clears on merge; no further fix required
FFA-CARRY-FORWARD:            NONE
```

---

## Merge Gate Parity (§4.3)

| Check | Local Result |
|-------|-------------|
| validate-scope-to-diff.sh (BL-027) | PASS — EXIT 0, 10/10 exact match |
| governance/alignment | PASS — 191 canons, 0 bad hashes, IAA canon + AGCFPP-001 present |
| stop-and-fix/enforcement | PASS — all 5 prior failures resolved and committed |

---

## Verdict

```
═══════════════════════════════════════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/add-migration-for-parse-tasks-table — Issue #971
Wave: Wave 15 — Schema Drift Remediation (parse_tasks migration)
All 51 checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-wave15-schemadrift-wave15-20260307-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
Re-invocation: all 5 REJECTION-PACKAGE failures resolved and verified.
═══════════════════════════════════════════════════════════════════════
```

---

## CWT Gate Impact

Upon merge, T-W13-SCH-11 (`no frontend hook references a table absent from all migrations`) will pass GREEN.
The `CREATE TABLE IF NOT EXISTS public.parse_tasks` pattern satisfies the test assertion.
The CWT RED gate that triggered Wave 15 will clear.

---

## Note on PREHANDOVER Proof

The PREHANDOVER proof `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-schemadrift-wave15-20260307.md` is **NOT modified** by this token issuance — it is read-only post-commit per §4.3b (A-029). The `iaa_audit_token: IAA-session-wave15-schemadrift-wave15-20260307-PASS` pre-populated reference in the PREHANDOVER proof is confirmed by this ASSURANCE-TOKEN.

---

*Authority: CS2 (@APGI-cmy) | independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING*
*PREHANDOVER proof: NOT modified — immutable post-commit per §4.3b / A-029*
