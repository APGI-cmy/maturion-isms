# IAA Verdict — session-wave-session-refresh-auth-fix-20260309

**Verdict**: REJECTION-PACKAGE  
**Token Reference**: IAA-session-wave-session-refresh-auth-fix-20260309-REJECTION  
**Date**: 2026-03-09  
**PR / Branch**: `copilot/fix-session-refresh-auth-header`  
**Wave**: wave-session-refresh-auth-fix  
**Session**: session-wave-session-refresh-auth-fix-20260309  
**Invoking Agent**: foreman-v2-agent  
**Producing Agents**: qa-builder (T-SRAF-QA-001), api-builder (T-SRAF-API-001)  
**IAA Version**: independent-assurance-agent v6.2.0  
**Adoption Phase**: PHASE_B_BLOCKING  
PHASE_B_BLOCKING_TOKEN: IAA-session-wave-session-refresh-auth-fix-20260309-REJECTION
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Verbatim Verdict Block

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/fix-session-refresh-auth-header — wave-session-refresh-auth-fix
5 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  CORE-013: IAA invocation evidence
    Finding: PREHANDOVER proof (.agent-workspace/foreman-v2/memory/
      PREHANDOVER-session-wave-session-refresh-auth-fix-20260309.md) is
      UNTRACKED — not committed to branch. "PR artifacts" requires
      committed files. IAA invocation evidence is absent from the
      committed PR bundle.
    Fix: git add + git commit the PREHANDOVER proof before re-invoking IAA.

  CORE-015: Session memory present
    Finding: Foreman session memory (.agent-workspace/foreman-v2/memory/
      session-wave-session-refresh-auth-fix-20260309.md) is UNTRACKED —
      not committed to branch. Not in PR bundle.
    Fix: git add + git commit the session memory file before re-invoking IAA.

  CORE-018: Complete evidence artifact sweep
    Finding: Evidence sweep (a) and (b) both fail. PREHANDOVER proof and
      session memory are working-tree-only (untracked). Per §4.3b
      architecture: "The PREHANDOVER proof is committed before the IAA
      runs and is read-only thereafter." Per A-021: working-tree-only
      artifacts are not committed artifacts and will fail IAA audit.
    Fix: Commit PREHANDOVER proof and session memory to branch
      copilot/fix-session-refresh-auth-header before re-invoking IAA.

  CORE-020: Zero partial pass rule
    Finding: Cascades from CORE-013, CORE-015, CORE-018. Absent/
      uncommitted evidence = REJECTION-PACKAGE per CORE-020.
    Fix: Resolve CORE-013, CORE-015, CORE-018 failures above.

  A-026 / BL-027: SCOPE_DECLARATION.md stale
    Finding: SCOPE_DECLARATION.md at root is from the prior wave
      (wave-audit-log-column-fix-20260308 / branch
      copilot/fix-document-upload-issues). It has NOT been updated for
      this wave (wave-session-refresh-auth-fix / branch
      copilot/fix-session-refresh-auth-header). The file is not in the
      current PR diff. Per A-026: stale SCOPE_DECLARATION.md = BL-027
      merge gate parity failure.
    Fix: Update SCOPE_DECLARATION.md to reference this wave, this branch,
      this session, and list the 5 committed files + any IAA ceremony
      artifacts (with A-031 carve-out note). Commit it.

This PR must not be merged until all failures are resolved and IAA
re-invoked. The underlying code quality is EXCELLENT — all 23 AAWP_MAT
overlay checks PASS. The implementation is correct, complete, and
well-tested. These 5 failures are purely ceremony/governance failures
that are straightforward to fix.

Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════
```

---

## Checks Summary

| Category | Total | PASS | FAIL |
|----------|-------|------|------|
| FAIL-ONLY-ONCE learning | 4 | 2 | 2 (A-021, A-026) |
| Core invariants (CORE-001 to CORE-022) | 17 | 13 | 4 (CORE-013, CORE-015, CORE-018, CORE-020) |
| AAWP_MAT overlay (BD-001 to BD-023) | 23 | 23 | 0 |
| Merge gate parity | 10 | 7 | 3 |
| **Total** | **41** | **36** | **5** |

---

## Substantive Code Quality Summary

> **The underlying implementation and tests are EXCELLENT.** All 23 AAWP_MAT overlay checks pass.

- **Implementation** (`useCriteria.ts`): 5 lines added to `useTriggerAIParsing`. Correct auth guard pattern: `supabase.auth.getSession()` called before `supabase.functions.invoke()`. Combined guard `if (sessionError || !session)` throws `'Authentication required. Please sign in again.'` exactly. `invoke()` is unreachable when session is invalid.
- **Tests** (`wave-sraf-session-refresh.test.ts`): 4 tests, all GREEN. Source-analysis approach is valid and non-trivial. T-SRAF-001 through T-SRAF-004 each assert distinct, meaningful behaviours. No `.skip`, `.only`, or `test.todo`. RED→GREEN sequence observed.
- **Regressions**: 541/541 non-env tests PASS. 8 pre-existing env-var failures unchanged.
- **No schema changes, no migration changes, no Edge Function changes, no CI changes.**

---

## Failures Detail — Fix Checklist

For the re-invocation, Foreman must:

- [ ] `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-session-refresh-auth-fix-20260309.md`
- [ ] `git add .agent-workspace/foreman-v2/memory/session-wave-session-refresh-auth-fix-20260309.md`
- [ ] Update `SCOPE_DECLARATION.md` to reference `wave-session-refresh-auth-fix`, branch `copilot/fix-session-refresh-auth-header`, session `session-wave-session-refresh-auth-fix-20260309`, list all 5 committed wave files + any IAA ceremony artifacts with A-031 carve-out note
- [ ] `git add SCOPE_DECLARATION.md`
- [ ] Also commit `parking-station/suggestions-log.md` (modified, not staged)
- [ ] `git commit -m "gov(phase4): commit PREHANDOVER proof, session memory, SCOPE_DECLARATION for wave-session-refresh-auth-fix"`
- [ ] `git push origin copilot/fix-session-refresh-auth-header`
- [ ] Re-invoke IAA

Note: PREHANDOVER proof must NOT be amended (per A-029 §4.3b — read-only post-commit). Committing an unmodified PREHANDOVER proof satisfies the §4.3b architecture.

---

## Re-invocation Note

On re-invocation:
- CORE-019 First Invocation Exception will NO LONGER apply — the rejectionpackage token file (this file) exists. IAA must cross-verify the re-invocation token against a fresh ASSURANCE-TOKEN file path.
- Per A-030: A correction addendum or this rejection artifact in the committed history satisfies CORE-019 for the re-invocation scenario.
- On re-invocation, the iaa_audit_token in the PREHANDOVER proof should be updated (via a NEW committed evidence artifact, not by amending the original PREHANDOVER) OR Foreman may rely on A-030 carve-out to document the re-invocation in a correction addendum.

---

*IAA Agent: independent-assurance-agent v6.2.0*  
*Authority: CS2 (Johan Ras / @APGI-cmy)*  
*STOP-AND-FIX mandate: ACTIVE. No class exceptions. This PR must not be merged.*
