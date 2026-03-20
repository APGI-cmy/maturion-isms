# IAA REJECTION-PACKAGE — session-dckis-qa-red-20260319

**Document type**: IAA REJECTION-PACKAGE (Phase B — Hard Gate)
**Session ID**: session-dckis-qa-red-20260319
**Date**: 2026-03-19
**Branch**: `copilot/dckis-qa-red-execute-failing-tests-again`
**PR Category**: AAWP_MAT
**Adoption Phase**: PHASE_B_BLOCKING — hard gate ACTIVE
**Authority**: CS2 (@APGI-cmy)

---

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/dckis-qa-red-execute-failing-tests-again
    [qa-builder] DCKIS-QA-RED: Execute 12 RED Gate Failing Tests — Knowledge Ingestion

3 check(s) FAILED (with cascade). Merge blocked. STOP-AND-FIX required.

FAILURES:

  CORE-013: IAA invocation evidence — FAIL ❌
    Finding: PREHANDOVER proof (.agent-workspace/foreman-v2/memory/PREHANDOVER-session-dckis-qa-red-20260319.md)
             exists in working tree but is UNTRACKED — NOT committed to branch.
             git ls-files HEAD returns zero results for all foreman dckis-qa-red memory files.
             git status shows `?? .agent-workspace/foreman-v2/memory/PREHANDOVER-session-dckis-qa-red-20260319.md`.
             FAIL-ONLY-ONCE A-001: IAA invocation evidence must be committed before IAA invocation.
             Note: PREHANDOVER proof falsely claims "✅ COMMITTED" for session memory — this is inaccurate.
    Fix: git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-dckis-qa-red-20260319.md
         git commit -m "chore(qa): DCKIS-QA-RED — commit foreman PREHANDOVER proof and session memory"

  CORE-015: Session memory present on branch — FAIL ❌
    Finding: Session memory (.agent-workspace/foreman-v2/memory/session-dckis-qa-red-20260319.md)
             is UNTRACKED — NOT committed to branch.
             git status shows `?? .agent-workspace/foreman-v2/memory/session-dckis-qa-red-20260319.md`.
    Fix: git add .agent-workspace/foreman-v2/memory/session-dckis-qa-red-20260319.md
         (include in same commit as PREHANDOVER proof)

  CORE-018: Complete evidence artifact sweep — FAIL ❌
    Finding (a): PREHANDOVER proof NOT on branch — untracked.
    Finding (b): Session memory NOT on branch — untracked.
    Both required per CORE-018 before any overlay checks proceed.
    FAIL-ONLY-ONCE A-021 reinforces: all artifacts committed at SHA before IAA invocation.

  ADDITIONAL FINDING (Fix required before re-invocation):
    Staged but uncommitted test file changes: knowledge-ingestion.test.ts has regex-splitting
    refactors staged (git status: M  modules/mat/tests/dckis-qa-red/knowledge-ingestion.test.ts)
    but not committed. CI will run the committed (HEAD) version; IAA tested the working-tree
    (staged) version. Committed version is functionally correct (12 fail per commit message),
    but the staged changes should be committed to keep the branch in a clean state.
    Fix: git add modules/mat/tests/dckis-qa-red/knowledge-ingestion.test.ts
         git commit -m "refactor(qa): DCKIS-QA-RED — finalize regex assertions (staged refinements)"

This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════
```

---

## What PASSED (for context only — does NOT override REJECTION-PACKAGE)

The core test deliverable is **excellent quality**. These checks passed:

| Check | Result |
|---|---|
| Test file committed | ✅ PASS — `modules/mat/tests/dckis-qa-red/knowledge-ingestion.test.ts` in HEAD |
| All 12 test IDs (T-KU-001–T-KU-012) | ✅ PASS — all 12 IDs declared and present |
| All 12 tests FAIL | ✅ PASS — `Tests 12 failed (12)` confirmed |
| Zero stubs/skips | ✅ PASS — 0 matches for `it.skip\|it.todo\|xit\|xdescribe` |
| No live DB/network calls | ✅ PASS — `node:fs`, `node:path`, `vitest` only |
| Pipeline 1 isolation | ✅ PASS — zero Pipeline 1 files in diff |
| ADR-005 guard (T-KU-008) | ✅ PASS — criteria/domains/mps isolation regex present |
| CANON_INVENTORY clean | ✅ PASS — no canon modifications |
| Pre-brief committed | ✅ PASS — `.agent-admin/assurance/iaa-prebrief-dckis-qa-red.md` |
| wave-current-tasks.md updated | ✅ PASS — line 9: `iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-dckis-qa-red.md` |
| CORE-023: Workflow integrity | ✅ PASS — vitest.config.ts wildcard covers test path; no broken workflows |
| OVL-INJ-001: Pre-Brief artifact | ✅ PASS — committed, non-empty |
| BD-000: User Journey Trace | ✅ N/A — pure RED gate test file, no app behaviour changes |

---

## Resolution Steps

1. Commit staged test file refinements:
   ```bash
   git add modules/mat/tests/dckis-qa-red/knowledge-ingestion.test.ts
   git commit -m "refactor(qa): DCKIS-QA-RED — finalize regex assertion structure (staged refinements)"
   ```

2. Commit foreman ceremony artifacts:
   ```bash
   git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-dckis-qa-red-20260319.md
   git add .agent-workspace/foreman-v2/memory/session-dckis-qa-red-20260319.md
   git commit -m "chore(qa): DCKIS-QA-RED — commit foreman PREHANDOVER proof and session memory"
   ```

3. Re-invoke IAA on the updated branch.

---

**IAA Token file**: NOT WRITTEN — REJECTION-PACKAGE verdict; no token issued.
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**STOP-AND-FIX mandate**: ACTIVE — no PR opens until IAA re-invoked and ASSURANCE-TOKEN issued.
