# IAA Rejection Package — Session 159 — PS-B: FAIL-ONLY-ONCE v4.2.0

**Artifact Type**: REJECTION-PACKAGE
**Session**: 159
**Wave**: ps-b-fail-only-once-v420-20260407
**Branch**: copilot/ps-b-foreman-fail-only-once
**Issue**: maturion-isms#1268
**Date**: 2026-04-07
**IAA Agent**: independent-assurance-agent v6.2.0 / contract v2.4.0
**Adoption Phase**: PHASE_B_BLOCKING — hard gate ACTIVE
**Invoking Agent**: foreman-v2-agent
**Producing Agent**: foreman-v2-agent (class: foreman)

REJECTION_TOKEN: IAA-session-159-ps-b-fail-only-once-v420-20260407-REJECT

---

## Verdict

**REJECTION-PACKAGE**

8 checks FAILED. Merge blocked. STOP-AND-FIX required.
This PR must not be opened until all failures are resolved and IAA re-invoked.

---

## Failures (All Blocking — CORE-021 Zero-Severity-Tolerance)

### F-01 — A-021 / CORE-018(a): PREHANDOVER Proof Not Committed Before IAA Invocation

**Finding**: `git ls-tree HEAD -- .agent-workspace/foreman-v2/memory/PREHANDOVER-session-159-ps-b-fail-only-once-v420-20260407.md` returned NO OUTPUT (untracked file).
The PREHANDOVER proof exists on disk but is NOT committed to the branch.
A-021 rule text: "A working-tree-only or staging-area-only fix is NOT a committed fix and WILL fail IAA audit."
A-021 authoritative check: "GitHub API `get_file_contents` on the PR branch ref."

**Fix required**: Stage and commit the PREHANDOVER proof as part of a full commit including all wave artifacts (see fix plan below) BEFORE re-invoking IAA.

---

### F-02 — A-021 / CORE-015 / CORE-018(b): Session Memory Not Committed Before IAA Invocation

**Finding**: `git ls-tree HEAD -- .agent-workspace/foreman-v2/memory/session-159-ps-b-fail-only-once-v420-20260407.md` returned NO OUTPUT (untracked file).
CORE-015: "Session memory artifact included in PR bundle" — not committed.
CORE-018(b): "session memory file on branch" — not on branch.

**Fix required**: Stage and commit the session memory before re-invoking IAA.

---

### F-03 — A-021 / CORE-018: FAIL-ONLY-ONCE.md v4.2.0 Not Committed

**Finding**: `git ls-tree HEAD -- .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` shows blob `4e3dc1ff` (v4.1.0).
`git diff --cached` confirms v4.2.0 changes are STAGED but not committed.
The delivered substantive content (all 6 PS-B changes) exists in the working tree only.

**Fix required**: `git commit` the staged FAIL-ONLY-ONCE.md changes.

---

### F-04 — A-021: index.md v2.5.0 Not Committed

**Finding**: `git show HEAD:.agent-workspace/foreman-v2/knowledge/index.md` shows Knowledge Version 2.4.0.
The v2.5.0 changes are UNSTAGED (not even staged for commit).
`git status` output: ` M .agent-workspace/foreman-v2/knowledge/index.md` (working tree modification, not staged).

**Fix required**: `git add` and `git commit` the index.md v2.5.0 changes.

---

### F-05 — prehandover-template.md v1.7.0 / A-021: Pre-IAA Commit Gate Section Missing

**Finding**: PREHANDOVER proof does not contain the mandatory section:
`## Pre-IAA Commit Gate (MANDATORY STOP — A-021)`
This section is required by prehandover-template.md v1.7.0 and must contain:
- Actual `git status` output showing all artifacts staged and committed
- Actual `git log --oneline -5` output after committing — first line must be the commit adding these artifacts
- Confirmation: "All ceremony artifacts staged and committed before IAA invocation: ✅"

The template states: ⛔ HARD STOP — DO NOT INVOKE IAA UNTIL THIS SECTION IS COMPLETE.

**Fix required**: Add the Pre-IAA Commit Gate section to the PREHANDOVER proof (the proof is not yet committed so it may still be amended) with actual git outputs. The section must be populated AFTER all artifacts are committed, not before.

---

### F-06 — IAA A-026: SCOPE_DECLARATION.md Stale

**Finding**: SCOPE_DECLARATION.md (committed on branch) contains content from prior wave:
```
# SCOPE DECLARATION — Wave pre-mmm-build-readiness
Agent: governance-liaison-isms v6.2.0
Session: session-056-20260406
Branch: copilot/pre-mmm-build-readiness-orchestration
```
This is NOT the current wave (ps-b-fail-only-once-v420-20260407).
IAA A-026: "SCOPE_DECLARATION.md must be updated and committed on every PR branch to exactly match `git diff --name-only origin/main...HEAD` before IAA is invoked."

**Fix required**:
1. `cat /dev/null > SCOPE_DECLARATION.md` (A-029 — clear stale content first)
2. Write new scope declaration for this wave listing all files in `git diff --name-only origin/main...HEAD`
3. Commit SCOPE_DECLARATION.md as part of the full wave commit

---

### F-07 — CORE-018: Merge Gate Parity FAIL

**Finding**: Local equivalent of governance-ceremony-gate.yml would fail:
- PREHANDOVER proof not committed ❌
- Session memory not committed ❌
Both are required by the CI gate before PR can be merged.

**Fix required**: Resolved automatically when F-01/F-02 are fixed.

---

### F-08 — CORE-018: Substantive Deliverables Not Committed (Summary)

**Finding**: Of the four substantive/ceremony files in this wave, TWO are untracked (PREHANDOVER, session memory), ONE is staged-only (FAIL-ONLY-ONCE.md), ONE is unstaged (index.md). The branch HEAD (0821db6) contains only: iaa-prebrief and wave-current-tasks.md.
Complete commit is required before IAA can issue ASSURANCE-TOKEN.

**Fix required**: Resolved when F-01 through F-04 are fixed.

---

## Complete Fix Plan

Perform these steps IN ORDER before re-invoking IAA:

```bash
# Step 1: Clear and rewrite SCOPE_DECLARATION.md (F-06, A-029)
cat /dev/null > SCOPE_DECLARATION.md
# Then write this wave's scope declaration

# Step 2: Add Pre-IAA Commit Gate section to PREHANDOVER proof (F-05)
# (The proof is not yet committed — add the template section with actual git outputs)

# Step 3: Stage all remaining files
git add .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md
git add .agent-workspace/foreman-v2/knowledge/index.md
git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-159-ps-b-fail-only-once-v420-20260407.md
git add .agent-workspace/foreman-v2/memory/session-159-ps-b-fail-only-once-v420-20260407.md
git add SCOPE_DECLARATION.md
# Also add this rejection artifact:
git add .agent-admin/assurance/iaa-rejection-session-159-ps-b-fail-only-once-v420-20260407.md

# Step 4: Verify git status shows all files staged, nothing untracked
git status

# Step 5: Commit all files
git commit -m "chore(wave-psb): FAIL-ONLY-ONCE v4.2.0 — all PS-B changes + ceremony artifacts"

# Step 6: Confirm git log shows commit as latest
git log --oneline -5

# Step 7: Update Pre-IAA Commit Gate section with the actual git status and git log output from steps 4 and 6
# (Amend the PREHANDOVER proof if not yet committed, or add addendum if already committed)
# Then commit the updated PREHANDOVER proof

# Step 8: Re-invoke IAA
```

---

## Substantive Quality Note (for Foreman's information)

**All 6 PS-B changes are substantively CORRECT. The REJECTION-PACKAGE is SOLELY on ceremony/procedure grounds.**

| Change | Status |
|--------|--------|
| PS-B-01: ID Namespace Note updated (A-001–A-038, canonical dedup A-018/A-019) | ✅ CORRECT |
| PS-B-02: A-019 ARTIFACT-IMMUTABILITY added as canonical A-19 layer-down | ✅ CORRECT |
| PS-B-03: A-033→A-036; new A-033 CEREMONY-FILES-IN-SCOPE-DECLARATION | ✅ CORRECT |
| PS-B-04: A-034→A-037; new A-034 CANON-INVENTORY-UPDATE-MANDATORY | ✅ CORRECT |
| PS-B-05: A-035→A-038; new A-035 DELEGATION-ISSUE-REQUIRED; S-025 REMEDIATED | ✅ CORRECT |
| PS-B-06: Completion marker [ ]/[x] convention formally declared | ✅ CORRECT |
| No duplicate A-rule IDs | ✅ CONFIRMED (30 unique IDs) |
| All new rules clear, grounded, non-duplicating | ✅ CONFIRMED |
| Cross-references resolve | ✅ CONFIRMED |
| Version history entry for v4.2.0 | ✅ CONFIRMED |

The substantive work is complete and correct. Once the 6 ceremony fixes are applied and committed, re-invocation is expected to PASS.

---

## Re-Invocation Instructions

After completing the fix plan above:
1. Verify all files are committed: `git ls-tree HEAD -- [each file path]`
2. Re-invoke IAA via the task tool: `task(agent_type: "independent-assurance-agent", ...)`
3. IAA will verify committed state via git ls-tree
4. If all checks pass: ASSURANCE-TOKEN issued and token file written to `.agent-admin/assurance/iaa-token-session-159R-ps-b-fail-only-once-v420-20260407.md`

**Note on session numbering**: Re-invocation may use session-159-R1 or session-160 per the Foreman's own session tracking. The PREHANDOVER proof must reference the correct session number that corresponds to the IAA token.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Contract**: v2.4.0
**Rejection issued**: 2026-04-07
**PHASE_B_BLOCKING status**: ACTIVE — this rejection is a hard gate
