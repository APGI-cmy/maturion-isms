# IAA REJECTION-PACKAGE — Session 097 Invocation 2 — Wave postbuild-fails-01 — 2026-03-04

**Token**: IAA-session-097-invocation2-20260304-REJECTION
**Session**: IAA session for second invocation of Foreman session-097
**Date**: 2026-03-04
**Agent**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING

---

## PR Under Review

- **Branch**: copilot/resolve-supabase-rls-failures
- **Issue**: #891 — MAT App: Supabase RLS Failures
- **Category**: AAWP_MAT
- **Invoking Agent**: foreman-v2-agent (session-097, second invocation request)
- **Producing Agents**: foreman-v2-agent / schema-builder / qa-builder

---

## Verdict: REJECTION-PACKAGE

**Checks executed**: 30 (22 core + 8 AAWP_MAT overlay)
**PASS**: 14 (including all technical work checks)
**FAIL**: 9 (all cascade from single root cause: A-021 uncommitted governance artifacts)
**Merge gate parity**: FAIL (validate-scope-to-diff.sh)

---

## Root Cause

**SINGLE ROOT CAUSE**: Governance ceremony artifacts created on disk but NOT COMMITTED
to branch copilot/resolve-supabase-rls-failures before IAA second invocation.

Per FAIL-ONLY-ONCE A-021: "working-tree-only fix is not a committed fix and will fail IAA audit."

---

## Failures

### FAIL-1: CORE-018/CORE-013/CORE-015 — Evidence Artifacts Not Committed to Branch

**Finding**: The following files EXIST ON DISK but are NOT committed (confirmed untracked):
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-097-wave-postbuild-fails-01-20260304.md` — untracked
- `.agent-workspace/foreman-v2/memory/session-097-20260304.md` — untracked
- `.agent-admin/assurance/iaa-rejection-session-097-wave-postbuild-fails-01-20260304.md` — untracked
- `.agent-workspace/independent-assurance-agent/memory/session-097-20260304.md` — untracked
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` — modified, not staged
- `SCOPE_DECLARATION.md` — modified, not staged
- `.agent-workspace/independent-assurance-agent/memory/.archive/*` — untracked

OVL-AM-002/004/005/006/007/008 cascade from this root cause.

**Fix required**:
```bash
git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-097-wave-postbuild-fails-01-20260304.md
git add .agent-workspace/foreman-v2/memory/session-097-20260304.md
git add SCOPE_DECLARATION.md
git add .agent-admin/assurance/iaa-rejection-session-097-wave-postbuild-fails-01-20260304.md
git add .agent-workspace/independent-assurance-agent/memory/session-097-20260304.md
git add .agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md
git add .agent-workspace/independent-assurance-agent/memory/.archive/session-114-20260303.md
git add .agent-workspace/independent-assurance-agent/memory/.archive/session-120-20260303.md
git add .agent-workspace/independent-assurance-agent/memory/.archive/session-121-20260303.md
git add .agent-workspace/independent-assurance-agent/memory/.archive/session-122-20260303.md
git add .agent-workspace/independent-assurance-agent/memory/.archive/session-123-20260303.md
git rm .agent-workspace/independent-assurance-agent/memory/session-114-20260303.md
git rm .agent-workspace/independent-assurance-agent/memory/session-120-20260303.md
git rm .agent-workspace/independent-assurance-agent/memory/session-121-20260303.md
git rm .agent-workspace/independent-assurance-agent/memory/session-122-20260303.md
git rm .agent-workspace/independent-assurance-agent/memory/session-123-20260303.md
git commit -m "chore: commit governance ceremony artifacts for wave-postbuild-fails-01 IAA audit"
git push
```

### FAIL-2: A-026 / validate-scope-to-diff.sh — Declaration-Diff Mismatch

**Finding**: SCOPE_DECLARATION.md (on-disk working tree version) declares 25 files but
`git diff --name-only origin/main...HEAD` contains only 9 committed files.
16 governance ceremony artifacts are declared but not in the diff (not committed).
Script output: "Extra in declaration: 16 — FAILED"

**Fix required**: Same commit action as FAIL-1. When all 25 declared files are committed,
the diff will contain all declared files and validate-scope-to-diff.sh will PASS.

### FAIL-3: CORE-019 Pre-condition Note (Non-blocking for commit step)

**Finding**: `iaa_audit_token: IAA-session-097-20260304-PASS` cross-references
`session-097-20260304.md` which currently records `verdict: REJECTION-PACKAGE` (first invocation).
In the THIRD invocation, IAA will update session-097-20260304.md to add the ASSURANCE-TOKEN
verdict record. No action needed before commit/push.

---

## Positive Findings (Confirmed — NOT Blocking)

| Check | Status | Notes |
|-------|--------|-------|
| CORE-017: No .github/agents/ mods | ✅ PASS | Zero agent files in PR diff |
| CORE-007: No stubs in deliverables | ✅ PASS | Migration SQL and tests are complete |
| Tests: T-PBF-001 to T-PBF-004 | ✅ 4/4 GREEN | vitest confirmed locally |
| FRS v1.7.0 + FR-082/083 | ✅ PASS | Committed correctly |
| TRS v1.6.0 + TR-082/083 | ✅ PASS | Committed correctly |
| TEST_REGISTRY v1.3.0 + T-PBF entries | ✅ PASS | All 4 T-PBF tests registered |
| BUILD_PROGRESS_TRACKER | ✅ PASS | wave-postbuild-fails-01 section present |
| PREHANDOVER content quality | ✅ PASS | All OVL-AM sections comprehensive and correct |
| QP VERDICT: schema-builder | ✅ PASS | Per PREHANDOVER proof |
| QP VERDICT: qa-builder | ✅ PASS | Per PREHANDOVER proof |
| OPOJD | ✅ PASS | Per PREHANDOVER proof |
| validate-yaml.sh failures | ✅ PRE-EXISTING | Not introduced by this PR |
| validate-tracker-update.sh | ✅ PASS | Not a wave completion PR |
| CS2 authorization | ✅ CONFIRMED | Issue #891 by @APGI-cmy |

---

## Required Action

**STEP 1**: Execute the git add/rm/commit/push sequence above.
**STEP 2**: Re-invoke IAA (THIRD invocation).
**No other changes required.** Technical work is complete, verified, and correct.

---

## Note on PREHANDOVER Proof Immutability

The PREHANDOVER proof at
`.agent-workspace/foreman-v2/memory/PREHANDOVER-session-097-wave-postbuild-fails-01-20260304.md`
is READ-ONLY after initial commit per A-029 / §4.3b. Do NOT modify it before committing.
The `iaa_audit_token: IAA-session-097-20260304-PASS` pre-fill is A-029 compliant.
The `## IAA Agent Response (verbatim)` placeholder is correct — it will be filled by
CS2 pasting the ASSURANCE-TOKEN text from the successful third invocation.

---

*Authority: CS2 (Johan Ras / @APGI-cmy)*
*IAA v6.2.0 | PHASE_B_BLOCKING | STOP-AND-FIX ACTIVE*
