# IAA REJECTION-PACKAGE — Wave 20: Wire parse_write_back_atomic RPC into Edge Function

**Document type**: IAA REJECTION-PACKAGE
**Token reference**: IAA-session-wave20-atomic-write-back-20260318-REJECTION
**PR**: Wave 20 — Wire parse_write_back_atomic RPC into Edge Function for atomic DB write-back
**Branch**: copilot/implement-wire-parse-write-back-rpc
**Issue**: maturion-isms#1143
**Date**: 2026-03-18
**IAA Session**: session-wave20-atomic-write-back-20260318
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 (@APGI-cmy)
**Round**: R1 (first invocation — REJECTED)

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE
**PR**: Wave 20 — Wire parse_write_back_atomic RPC (maturion-isms#1143)
**5 check(s) FAILED. Merge blocked. STOP-AND-FIX required.**
**Token reference**: IAA-session-wave20-atomic-write-back-20260318-REJECTION
**Adoption phase**: PHASE_B_BLOCKING — hard gate ACTIVE
## ═══════════════════════════════════════

---

## Technical Quality Assessment (Informational)

The build deliverables are excellent. Technical failures: ZERO.

| Technical Check | Result |
|----------------|--------|
| T-W20-001 through T-W20-008 (8 new tests) | 8/8 PASS |
| Wave 15 backward compatibility (14 tests) | 14/14 PASS |
| Wave 19 backward compatibility (14 tests) | 14/14 PASS |
| **Total tests** | **36/36 PASS** |
| RPC call `supabase.rpc('parse_write_back_atomic')` present | ✅ PASS |
| All 4 RPC parameters (p_document_id, p_domains, p_mps, p_criteria) | ✅ PASS |
| Sequential upserts for domains/MPS/criteria removed | ✅ PASS |
| Migration status fix ('pending_review' not 'processed') | ✅ PASS |
| Migration service_role bypass (auth.uid() IS NULL) | ✅ PASS |
| Migration GRANT EXECUTE to service_role | ✅ PASS |
| A-032 schema column compliance (title not name for criteria) | ✅ PASS |
| No stubs, no TODOs, no test debt | ✅ PASS |
| Auth guards applied (SECURITY DEFINER + dual-path auth) | ✅ PASS |
| No injection vectors | ✅ PASS |
| Architecture alignment (GAP-PARSE-005) | ✅ PASS |
| Wave 19 migration 20260317000003 unchanged | ✅ PASS |

---

## Governance Ceremony Failures

### FAILURE 1 — CORE-013 / A-021: PREHANDOVER proof NOT committed

**Check**: CORE-013 — IAA invocation evidence  
**Governing rule**: FAIL-ONLY-ONCE A-021 (Commit and push BEFORE invoking IAA)  
**Finding**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave20-atomic-write-back-20260318.md`
does not exist in git. Verified via `git ls-files --error-unmatch` → error.  
**Root cause**: The invocation request explicitly states "to be written by Foreman after IAA response" —
direct A-021 violation. Correct order: (1) Commit PREHANDOVER → (2) Invoke IAA.  
**Fix required**: Commit PREHANDOVER proof with all required fields:
- Session ID: session-wave20-atomic-write-back-20260318
- Wave: Wave 20
- iaa_audit_token: IAA-session-wave20-atomic-write-back-20260318-PASS (expected reference per A-029)
- OPOJD gate evidence
- §4.3 merge gate parity: PASS

---

### FAILURE 2 — CORE-015: Foreman session memory NOT committed

**Check**: CORE-015 — Session memory present  
**Finding**: No Wave 20 Foreman session memory committed to branch.  
`git ls-files .agent-workspace/foreman-v2/memory/ | grep wave20` → empty.  
**Fix required**: Commit `.agent-workspace/foreman-v2/memory/session-wave20-atomic-write-back-20260318.md`
alongside the PREHANDOVER proof.

---

### FAILURE 3 — CORE-018: Complete evidence artifact sweep FAIL

**Check**: CORE-018 — Complete evidence artifact sweep  
**Finding**: 
- (a) PREHANDOVER proof: ABSENT from git ❌
- (b) Session memory: ABSENT from git ❌  
- (c) iaa_audit_token field: CANNOT VERIFY (no PREHANDOVER) ❌
- (d) IAA token file: First Invocation Exception — PASS ✅

Per CORE-018: "Any absent/empty item = immediate REJECTION-PACKAGE."  
**Fix required**: Items (a) and (b) must be committed before re-invocation.

---

### FAILURE 4 — A-026 / BL-027: SCOPE_DECLARATION stale

**Check**: FAIL-ONLY-ONCE A-026 — SCOPE_DECLARATION currency  
**Finding**: `SCOPE_DECLARATION.md` declares Wave 19 content (branch: copilot/wave-19-holistic-mat-criteria-repair,
issue #1137). The Wave 20 commit (116b6ae5) contains 6 new files, none of which are listed.  
**Fix required**: Overwrite `SCOPE_DECLARATION.md` with Wave 20 content listing:
```
# Wave 20 — Wire parse_write_back_atomic RPC — Scope Declaration
# Authority: A-026/A-029 (SCOPE_DECLARATION-FRESH-OVERWRITE)
# Session: session-wave20-atomic-write-back-20260318
# Issue: maturion-isms#1143
# Branch: copilot/implement-wire-parse-write-back-rpc
# NOTE: Per A-031, IAA ceremony artifacts (Pre-Brief, PREHANDOVER, session memory, token file)
#       from this wave are carved out of scope tracking per A-031.

## Build Artifacts (api-builder, schema corrections)
- apps/maturion-maturity-legacy/supabase/migrations/20260318000001_fix_parse_write_back_atomic_status.sql
- supabase/functions/invoke-ai-parse-criteria/index.ts
- supabase/functions/invoke-ai-parse-criteria/README.md

## Test Artifacts (qa-builder)
- modules/mat/tests/wave20/wave20-atomic-write-back.test.ts
- modules/mat/tests/wave15/wave15-criteria-parsing.test.ts (backward compat update)
- modules/mat/tests/wave19/wave19-criteria-parsing.test.ts (T-W19-004 RPC path update)

## Governance Artifacts (foreman-v2-agent)
- .agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md
- .agent-workspace/foreman-v2/personal/wave-current-tasks-wave20.md
- .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave20-atomic-write-back-20260318.md
- .agent-workspace/foreman-v2/memory/session-wave20-atomic-write-back-20260318.md
- SCOPE_DECLARATION.md
- .agent-admin/assurance/iaa-token-session-wave20-atomic-write-back-20260318.md
```

---

### FAILURE 5 — OVL-INJ-001: Pre-Brief artifact NOT committed to git

**Check**: OVL-INJ-001 — Pre-Brief Artifact Existence  
**Governing rule**: FAIL-ONLY-ONCE A-033 (git verification not disk)  
**Finding**: `.agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md` is UNTRACKED in git.
`git status --short` shows `??`. `git ls-files --error-unmatch` returns error.  
The invocation claimed it was committed — **this is factually incorrect per git verification.**  
**Fix required**: 
```
git add .agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md
git add .agent-workspace/foreman-v2/personal/wave-current-tasks-wave20.md
```
Include in the ceremony commit (single commit: Pre-Brief + PREHANDOVER + session memory + SCOPE_DECLARATION).

---

## Re-invocation Instructions

Foreman must execute the following ceremony corrections in ONE commit:

1. `git add .agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md`
2. `git add .agent-workspace/foreman-v2/personal/wave-current-tasks-wave20.md`
3. Create `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave20-atomic-write-back-20260318.md`
4. Create `.agent-workspace/foreman-v2/memory/session-wave20-atomic-write-back-20260318.md`
5. Overwrite `SCOPE_DECLARATION.md` with Wave 20 content
6. `git add` all above, `git commit -m "chore(wave20): IAA ceremony artifacts — PREHANDOVER, session memory, scope declaration"`
7. `git push`
8. Re-invoke IAA

**DO NOT** modify any production files (index.ts, migration, tests) — they are already correct.
The build is PASS. Only ceremony artifacts need to be committed.

---

## Verdict Summary

| Aspect | Result |
|--------|--------|
| Technical build quality | ✅ EXCELLENT — all technical checks PASS |
| 36/36 tests passing | ✅ PASS |
| PREHANDOVER committed | ❌ FAIL |
| Session memory committed | ❌ FAIL |
| SCOPE_DECLARATION current | ❌ FAIL |
| Pre-Brief committed to git | ❌ FAIL |
| CORE-018 evidence sweep | ❌ FAIL |
| **Overall verdict** | **REJECTION-PACKAGE** |

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Next step**: Foreman commits ceremony artifacts → re-invokes IAA (R2)
