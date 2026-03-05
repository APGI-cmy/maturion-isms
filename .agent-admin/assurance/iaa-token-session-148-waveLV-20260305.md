# IAA Token — Session 148 — Wave LV — 2026-03-05

**Agent**: independent-assurance-agent
**Session ID**: IAA-session-148
**Wave**: Wave LV — MAT Liveness Test Suite
**PR Branch**: copilot/implement-mat-liveness-test-suite
**Issue**: #932
**Commit reviewed**: 75bac27
**Date**: 2026-03-05
**Adoption Phase**: PHASE_B_BLOCKING

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/implement-mat-liveness-test-suite (Issue #932, commit 75bac27)
2 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

F-142-001 — OVL-CI-001 + OVL-CI-003: Workflow policy/implementation contradiction

  liveness.yml comments (lines 5–6, 46) and runner.ts comment (line 6)
  claim WARN checks exit 0 and blocking FAIL checks exit 1 causing CI failure.
  This is FALSE. continue-on-error: true swallows ALL exit codes.
  Net effect: ALL liveness failures produce a GREEN CI signal (silent failure).

  Fix required (Option A — recommended):
    Update liveness.yml lines 5–6:
      # All liveness results are non-blocking at CI level (continue-on-error: true).
      # Runner exits 1 on any test failure for artifact reporting; CI continues regardless.
      # Review uploaded liveness-evidence artifact for PASS/FAIL/WARN assessment.
    Update liveness.yml line 46 comment:
      # continue-on-error: true — liveness failures never block CI; captured in artifact.
    Update runner.ts line 6 comment:
      # Exits 1 if any check fails (for artifact report signal); all results non-blocking via CI.

  This is a 3-line comment update. Option B (implement true WARN/FAIL
  distinction in runner.ts) is the alternative if blocking behaviour is required.

STOP-AND-FIX: Fix F-142-001 and re-invoke IAA before opening PR.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════════════════════════════
```

## Checks Summary

| Layer | PASS | FAIL |
|-------|------|------|
| FAIL-ONLY-ONCE | 2 | 0 |
| CORE-001 to CORE-022 | 22 | 0 |
| AAWP_MAT BD-001 to BD-024 | 24 | 0 |
| CI_WORKFLOW OVL-CI-001 to OVL-CI-005 | 3 | 2 |
| **TOTAL** | **51** | **2** |

## Substantive Quality Assessment

The Wave LV MAT Liveness Test Suite is **substantively well-built**:

- ✅ Correct file structure per spec §7 (modules/mat/tests/liveness/)
- ✅ Exactly 3 spec files covering AUTO/AI/VISUAL check categories
- ✅ All spec §1 check IDs verified present (LV-00-01 through LV-10, LV-AI-01..06)
- ✅ Valid PDF 1.4 fixtures (282 bytes each, non-zero, parseable)
- ✅ Zero hardcoded secrets — all credentials via process.env[] / GitHub secrets
- ✅ Zero test debt — no .skip(), .todo(), commented-out tests
- ✅ liveness-evidence/ correctly gitignored
- ✅ Runner orchestrates 3 spec files correctly; report-assembler produces JSON + Markdown + manual checklist per spec §5
- ✅ CI workflow: correct trigger (workflow_run after deploy), artifact upload, step summary

The ONLY blocking issue is **comment accuracy in liveness.yml and runner.ts** (F-142-001).
The fix is 3 comment lines. All substantive delivery is PASS.

## Advisory Observations (non-blocking — carry-forward)

1. **SCOPE_DECLARATION.md self-reference**: SCOPE_DECLARATION.md itself (19th file in diff)
   is not listed in its own Modified section. Consistent with codebase convention; advisory only.

2. **TEST_PASSWORD fallback** (BD-016 advisory): `mat-liveness.spec.ts` line 21 uses
   `process.env['LIVENESS_TEST_PASSWORD'] ?? 'LivenessTest!2026'` as fallback. Since liveness
   creates ephemeral test accounts this is not a security risk. Recommend requiring env var
   explicitly to avoid confusion: `if (!process.env['LIVENESS_TEST_PASSWORD']) throw new Error(...)`.

3. **BASE_URL fallback** (OVL-CI-004 advisory): `'https://mat.example.com'` fallback domain
   will cause silent all-failures if `LIVENESS_BASE_URL` repository variable is not configured.
   README-LIVENESS.md should be updated to explicitly state the repository variable requirement.

## Re-invocation Instructions

After applying the Option A fix (3 comment lines in liveness.yml and runner.ts):
1. Commit the changes to the branch
2. Re-invoke IAA with the new commit SHA
3. IAA will re-run all 51 checks; only F-142-001 was failing
4. Expected result: ASSURANCE-TOKEN on re-invocation

---

**Token Reference**: IAA-session-148-waveLV-20260305-REJECTED
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0
