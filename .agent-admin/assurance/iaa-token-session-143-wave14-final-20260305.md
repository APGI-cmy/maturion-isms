# IAA Assurance Token — Session 143 / Wave 14 Final / 2026-03-05

## Token Header

| Field | Value |
|-------|-------|
| Token Reference | IAA-session-143-wave14-final-20260305-REJECTION |
| Verdict | **REJECTION-PACKAGE** |
| Session | session-143 (Wave 14 Final — first invocation) |
| IAA Internal Session | session-152 |
| Date | 2026-03-05 |
| Agent | independent-assurance-agent v6.2.0 / contract v2.2.0 |
| PR Branch | `copilot/apply-wave-14-migrations` |
| Wave | Wave 14 Final — Governance Closure |
| Invoking Agent | foreman-v2-agent v6.2.0 (session-143) |
| Producing Agents | mat-specialist (BUILD_PROGRESS_TRACKER.md), foreman-v2-agent (governance artifacts) |
| Category | AAWP_MAT |
| Adoption Phase | PHASE_B_BLOCKING — Hard gate ACTIVE |
| Authority | CS2 only (@APGI-cmy) |

---

## REJECTION-PACKAGE

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/apply-wave-14-migrations — Wave 14 Final Governance Closure
Invoking Agent: foreman-v2-agent (session-143)
3 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  FINDING-001: A-028 / CORE-021
  Check: SCOPE_DECLARATION.md must be trimmed to contain ONLY files in current PR diff
  Evidence: SCOPE_DECLARATION.md contains stale entries from two prior sessions not in
  the current git diff (origin/main...HEAD returns 6 files only):
    — Session-050 (copilot/formalise-ovl-ac-adm-overlay): iaa-category-overlays.md,
      index.md, governance-liaison session artifacts, IAA ceremony artifacts
    — Session-142 (copilot/finalise-mat-gap-closure): migration SQL files,
      wave14-cwt-evidence, Wave 14 Batch C PREHANDOVER proofs, IAA session-147/149
      ceremony artifacts
  Fix required: Delete all content below the session-143 scope section in
  SCOPE_DECLARATION.md. Retain ONLY the "# Scope Declaration — foreman-v2-agent
  Session 143" section and its "## Files Declared" subsections. New commit. Push.
  Re-invoke IAA.

  FINDING-002: BPT-006 / CORE-020 / CORE-021
  Check: BUILD_PROGRESS_TRACKER.md IAA token citations must be accurate and verifiable
  Evidence: BUILD_PROGRESS_TRACKER.md "Wave 14 Final Closure / IAA PASS Tokens" table
  cites Batch A token as `IAA-session-140-wave14-batchA-20260305-PASS` (wrong date).
  Actual token from iaa-token-session-140-wave14-batchA-20260304.md header:
  `IAA-session-140-wave14-batchA-20260304-PASS` (date is 20260304 not 20260305).
  Impact: The BUILD_PROGRESS_TRACKER cites a non-existent token reference — breaks the
  audit trail for Batch A.
  Fix required:
    Change: `IAA-session-140-wave14-batchA-20260305-PASS`
    To:     `IAA-session-140-wave14-batchA-20260304-PASS`
  Also update the Foreman session-143 memory Batch A table row (same wrong date).
  New commit. Push. Re-invoke IAA.

  FINDING-003: BD-022 / CORE-021
  Check: BUILD_PROGRESS_TRACKER.md internal consistency
  Evidence: End-of-file states "Next Update: After qa-builder delivers RED test file
  implementation (TASK-W14-006)" but the Prerequisites table already shows
  "RED test file implementation | ✅ COMPLETE" and 104/104 tests are GREEN.
  Stale note is inconsistent with the document's own closure state.
  Fix required: Update "Next Update" line to reflect Wave 14 closure state, e.g.:
  "**Status**: Wave 14 CLOSED. All 15 GAPs verified. All 9 migrations applied and
  assured (IAA Batch A/B/C tokens). 104/104 tests GREEN. No further Wave 14 updates
  required."
  New commit. Push. Re-invoke IAA.

Merge gate parity: FAIL (all 3 gates blocked)
This PR must not be opened until all 3 failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════════════════════════════
```

---

## Assurance Check Summary

| Phase | Checks Executed | PASS | FAIL |
|-------|----------------|------|------|
| FAIL-ONLY-ONCE learning | 10 | 9 | 1 (FINDING-001 A-028) |
| Core invariants (CORE-013–021) | 8 | 7 | 1 (CORE-021 triggered) |
| CERT checks (CERT-001–004) | 4 | 4 | 0 |
| AAWP_MAT overlay + BPT | 14 | 12 | 2 (FINDING-002, FINDING-003) |
| Merge gate parity (§4.3) | 3 | 0 | 3 |
| **Total** | **39** | **32** | **7** |

(Multiple gate checks triggered by same 3 findings — root findings = 3)

---

## PREHANDOVER Proof Status

Per §4.3b — PREHANDOVER proof is READ-ONLY post-commit. IAA has NOT modified it.
Token file: `.agent-admin/assurance/iaa-token-session-143-wave14-final-20260305.md` (this file — NEW dedicated file per §4.3b).

---

## Re-Invocation Instructions

Per STOP-AND-FIX mandate:

1. **Fix FINDING-001**: Edit SCOPE_DECLARATION.md — remove all content below the session-143 section (delete old session-050 and session-142 blocks). **New commit** (do NOT amend).
2. **Fix FINDING-002**: Edit BUILD_PROGRESS_TRACKER.md — change Batch A token from `IAA-session-140-wave14-batchA-20260305-PASS` to `IAA-session-140-wave14-batchA-20260304-PASS`. Also fix the same date in Foreman session memory. **New commit**.
3. **Fix FINDING-003**: Edit BUILD_PROGRESS_TRACKER.md — update "Next Update" stale line to reflect Wave 14 closure state. **New commit** (may combine with FINDING-002 fix in same commit).
4. Push all commits to `copilot/apply-wave-14-migrations`.
5. Verify `git diff --name-only origin/main...HEAD` is correct.
6. Re-invoke IAA with "Re-invocation" context citing this REJECTION-PACKAGE and confirming all 3 findings resolved.

**Per A-030**: A correction addendum committed to the branch documents the REJECTION-PACKAGE; this enables the PREHANDOVER proof to remain immutable per A-029 §4.3b.

---

**Authority**: CS2 only (@APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 / contract v2.2.0
**Date**: 2026-03-05
