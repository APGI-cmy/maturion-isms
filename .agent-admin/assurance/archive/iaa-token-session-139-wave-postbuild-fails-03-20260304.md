# IAA Token — Session 139 — Wave postbuild-fails-03 — 2026-03-04

| Field | Value |
|---|---|
| Token Reference | IAA-session-139-wave-postbuild-fails-03-20260304-REJECT |
| Session ID | session-139 |
| Date | 2026-03-04 |
| PR Branch | copilot/fix-rls-policy-violations |
| Wave | postbuild-fails-03 |
| Invoking Agent | foreman-v2-agent (session-102) |
| Producing Agents | qa-builder (TASK-PBF3-004), schema-builder (TASK-PBF3-001), ui-builder (TASK-PBF3-002, TASK-PBF3-003) |
| Adoption Phase | PHASE_B_BLOCKING |
| Verdict | REJECTION-PACKAGE |

---

## Verbatim IAA Output

```
═══════════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/fix-rls-policy-violations — Wave postbuild-fails-03
3 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  CORE-018 / A-021 — PREHANDOVER PROOF NOT COMMITTED
  Finding: PREHANDOVER-session-102-wave-postbuild-fails-03-20260304.md
  is UNTRACKED (?? in git status). Not committed to branch.
  Fix: git add + git commit the PREHANDOVER proof before re-invoking IAA.

  CORE-015 / A-021 — SESSION MEMORY NOT COMMITTED
  Finding: session-102-20260304.md is UNTRACKED (?? in git status).
  Not committed to branch.
  Fix: git add + git commit session memory before re-invoking IAA.

  BL-027 / A-021 / A-026 — SCOPE_DECLARATION.md STAGED-NOT-COMMITTED
  Finding: SCOPE_DECLARATION.md is staged but NOT committed. BL-027
  validate-scope-to-diff.sh confirms FAIL: "EXTRA FILES: 1 file declared
  in SCOPE_DECLARATION.md but NOT in git diff — SCOPE_DECLARATION.md."
  The committed HEAD SCOPE_DECLARATION.md is the session-101 version
  (wrong wave). Fix: git commit the staged SCOPE_DECLARATION.md.

  A-021 — UNCOMMITTED WORKING TREE CHANGES TO HOOKS
  Finding: useEvidence.ts and useCriteria.ts have working-tree-only
  error message improvements (not staged/committed). Must be committed.
  Fix: git add + git commit the hook improvements.

CARRY-FORWARD MANDATE CF-001 (non-blocking):
  domains/criteria lack DELETE RLS policies; organisations lacks
  INSERT/UPDATE/DELETE policies. Document this architectural decision
  (cascade-from-audit design / admin-managed organisations) in
  data-architecture.md before architecture review.

SUBSTANTIVE VERDICT: ALL substantive checks PASS. Migration, hooks,
tests, and security controls are all correct. Only ceremony commits
required. Re-invoke after committing all 4 items above.
═══════════════════════════════════════════════════════════════════
```

---

## Check Results Summary

| Category | Pass | Fail |
|---|---|---|
| Core invariants (CORE-001 to CORE-022) | 17 | 3 |
| AAWP_MAT overlay (BD-001 to BD-024) | 24 | 0 |
| Merge gate parity (BL-027) | 0 | 3 |
| **Total** | **41** | **3** |

## Failures Cited

| Failure | Rule | Fix Required |
|---|---|---|
| PREHANDOVER proof not committed | CORE-018, A-021 | `git add` + `git commit` PREHANDOVER file |
| Session memory not committed | CORE-015, A-021 | `git add` + `git commit` session memory file |
| SCOPE_DECLARATION.md staged-not-committed | BL-027, A-021, A-026 | `git commit` staged SCOPE_DECLARATION.md |
| Uncommitted working tree changes to hooks | A-021 | `git add` + `git commit` useEvidence.ts and useCriteria.ts improvements |

## Carry-Forward Mandates

| CF ID | Description | Blocking? |
|---|---|---|
| CF-001 | Document domains/criteria/organisations DELETE RLS policy design decision in data-architecture.md | No — next architecture review |

## Authority

IAA — independent-assurance-agent v6.2.0
Authority: CS2 (Johan Ras / @APGI-cmy)
PREHANDOVER proof: READ-ONLY post-commit per §4.3b — IAA did NOT edit it.
