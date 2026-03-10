# IAA Verdict — session-wave-criteria-display-bugfix-1049-20260310

**Verdict Type**: REJECTION-PACKAGE
**Token Reference**: IAA-session-wave-criteria-display-bugfix-1049-20260310-REJECT
**Session ID**: session-wave-criteria-display-bugfix-1049-20260310
**Date**: 2026-03-10
**IAA Version**: 6.2.0
**IAA Contract Version**: 2.2.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (@APGI-cmy)

---

## Invocation Context

| Field | Value |
|-------|-------|
| Wave | wave-criteria-display-bugfix-1049 |
| Branch | copilot/fix-column-mapping-issue |
| Issue | maturion-isms#1049 |
| Invoking Agent | foreman-v2-agent |
| Producing Agent | foreman-v2-agent (direct implementation — POLC violation INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001) |
| PR Category | MIXED — AAWP_MAT (primary) + KNOWLEDGE_GOVERNANCE (secondary) |
| Pre-Brief Reference | iaa-prebrief-wave-criteria-display-bugfix-1049.md (SHA f6c60a7) |

---

## IAA Agent Response (verbatim)

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/fix-column-mapping-issue — "Bug: Criteria Not Displayed After Parsing — Column Mapping Mismatch" (issue #1049)
3 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  CORE-015: Session memory present
    Finding: `.agent-workspace/foreman-v2/memory/session-wave-criteria-display-bugfix-1049-20260310.md`
    exists on the filesystem but is UNTRACKED in git (`??` per git status). It is NOT committed
    to the branch. `git ls-files` returns empty. `git diff origin/main...HEAD --name-only` does
    not list this file. A working-tree-only artifact is not a committed artifact (FAIL-ONLY-ONCE
    A-021).
    Fix required: Stage, commit, and push this file to the branch before re-invoking IAA.

  CORE-018: Complete evidence artifact sweep — item (a) PREHANDOVER proof NOT on branch
    Finding: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-criteria-display-bugfix-1049-20260310.md`
    exists on the filesystem but is UNTRACKED in git (`??` per git status). NOT committed to the
    branch. `git ls-files` returns empty. `git diff origin/main...HEAD --name-only` confirms
    absence. This is an A-021 violation (commit before invocation) — the PREHANDOVER proof must
    be a committed artifact on the branch, not a working-tree file, at the point of IAA
    invocation.
    Fix required: Stage, commit, and push the PREHANDOVER proof to the branch before re-invoking IAA.

  MERGE-PARITY / A-026: SCOPE_DECLARATION.md stale
    Finding: `SCOPE_DECLARATION.md` at repository root contains scope for the previous wave
    (wave-gov-improvement-s032-s033-s007-s023), not for the current wave
    (wave-criteria-display-bugfix-1049). `git diff origin/main...HEAD --name-only` confirms
    SCOPE_DECLARATION.md is NOT in the current branch diff. Per A-026: "SCOPE_DECLARATION.md must
    match git diff --name-only origin/main...HEAD exactly before IAA invocation — stale =
    BL-027 merge gate parity failure."
    Fix required: Update SCOPE_DECLARATION.md to declare the files in `git diff origin/main...HEAD
    --name-only` for this wave (7 files + the 2 new files being committed), then commit and push
    before re-invoking IAA.

NOTE — Positive assessment: The substantive work (fix, tests, FAIL-ONLY-ONCE incident record) is
technically correct and would pass all BD-TIER checks. The fix to normaliseMpsNumber is logically
sound, tests are real assertions (not stubs), all 5 T-WCDB tests are GREEN, and the
KNOWLEDGE_GOVERNANCE incident entry is correctly structured. These three ceremony failures are
purely procedural — once corrected, re-invocation should be straightforward and a PASS is expected.

This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════
```

---

## Check Summary

| Check | Result |
|-------|--------|
| CORE-001 to CORE-014 | PASS (applicable checks) |
| CORE-015 Session memory on branch | **FAIL ❌** |
| CORE-016 IAA token (first invocation) | PASS (carve-out) |
| CORE-017 No .github/agents/ mods | PASS |
| CORE-018 Evidence artifact sweep | **FAIL ❌** |
| CORE-019 Token cross-verification | PASS (first invocation) |
| CORE-020/021/022 | PASS |
| BD-TIER-1 (BD-001 to BD-004) | PASS |
| BD-TIER-2 (BD-005 to BD-010) | PASS |
| BD-TIER-3 (BD-011 to BD-014) | PASS |
| BD-TIER-4 (BD-015 to BD-019) | PASS |
| BD-TIER-5 (BD-020 to BD-022) | PASS |
| OVL-KG-001 to OVL-KG-004 | PASS |
| OVL-KG-ADM-001 (ceremony complete) | FAIL ❌ (carries from CORE-018) |
| OVL-KG-ADM-002 (version bumped) | PASS |
| OVL-KG-ADM-003 (index updated) | PASS |
| OVL-INJ-001 (injection trail) | PASS |
| MERGE-PARITY / A-026 | **FAIL ❌** |

**Total: 46 PASS, 3 FAIL → REJECTION-PACKAGE**

---

## PREHANDOVER Proof Status

Per §4.2b architecture:
- PREHANDOVER proof: **UNCHANGED** (read-only post-commit per A-029 §4.3b)
- Note: PREHANDOVER proof was NOT committed at time of IAA invocation — this is itself the
  primary finding. Upon resolution, the Foreman must commit the PREHANDOVER proof and
  initiate a fresh pre-IAA-commit sequence before re-invoking IAA.

---

## Re-Invocation Requirements

To satisfy this REJECTION-PACKAGE, ALL of the following must be completed in order:

1. **Commit PREHANDOVER proof**: Stage and commit `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-criteria-display-bugfix-1049-20260310.md` to branch
2. **Commit session memory**: Stage and commit `.agent-workspace/foreman-v2/memory/session-wave-criteria-display-bugfix-1049-20260310.md` to branch
3. **Update SCOPE_DECLARATION.md**: Overwrite with current wave scope listing all files in `git diff origin/main...HEAD --name-only`, then commit
4. **Push all commits to origin**
5. **Re-invoke IAA** for Phase 2–4 assurance
6. **DO NOT pre-fill `iaa_audit_token` with REJECT token** — per A-029, fresh PREHANDOVER proof should use expected PASS reference for the re-invocation session

---

**IAA Version**: 6.2.0 | **Session**: session-wave-criteria-display-bugfix-1049-20260310
**Issued**: 2026-03-10
**Authority**: CS2 (@APGI-cmy)
**STOP-AND-FIX**: ACTIVE — No merge until ASSURANCE-TOKEN issued
