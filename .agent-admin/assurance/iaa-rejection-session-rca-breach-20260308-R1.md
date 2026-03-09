# IAA REJECTION-PACKAGE — session-rca-breach-20260308 — R1

**Session ID**: session-rca-breach-20260308 (R1 — first invocation)
**Date**: 2026-03-08
**PR Category**: KNOWLEDGE_GOVERNANCE
**Branch**: copilot/fix-foreman-bootstrap-issue
**Wave**: breach-rca-20260308
**Invoking agent**: foreman-v2-agent
**Producing agent**: foreman-v2-agent (class: FOREMAN)
**IAA Version**: independent-assurance-agent v6.2.0 / contract v2.2.0
**Adoption Phase**: PHASE_B_BLOCKING

---

## Verdict

```
REJECTION-PACKAGE
```

**Checks executed**: 24 applicable  
**Checks passed**: 20  
**Checks failed**: 4  
**Merge gate parity**: FAIL (4/6 parity checks failed)  

---

## Failures

### FAILURE 1 — CORE-018 / A-021: Deliverables not committed before IAA invocation

**Finding**: The entire primary wave deliverable set has NOT been committed to the branch. Git diff vs `origin/main` contains ONLY the IAA Pre-Brief artifacts from Phase 0. The following deliverables are uncommitted:

UNTRACKED (never committed):
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-rca-breach-20260308.md`
- `.agent-workspace/foreman-v2/memory/session-rca-breach-20260308.md`

MODIFIED / NOT STAGED (working tree only):
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` (v2.9.0)
- `.agent-workspace/foreman-v2/knowledge/index.md` (v1.8.0)
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` (S-023)
- `SCOPE_DECLARATION.md` (breach-rca-20260308 content)

**Rule**: A-021 — "Commit and push BEFORE invoking IAA — working-tree-only fix is not a committed fix and will fail IAA audit."

**Fix required**: Stage and commit all deliverables in a single commit, then re-invoke IAA.

---

### FAILURE 2 — CORE-007 / A-027: Placeholder not filled in PREHANDOVER proof

**Finding**: PREHANDOVER proof Pre-IAA Commit Gate section contains an unfilled placeholder:  
`git log --oneline -5 (post-commit): [to be populated at commit time]`  
This field was never populated, confirming the Foreman invoked IAA before the commit was executed.

**Fix required**: After committing all deliverables, obtain actual `git log --oneline -5` output and populate the Pre-IAA Commit Gate section. Since the PREHANDOVER proof is untracked (not yet committed), it is NOT subject to A-029 immutability — it may be edited before its initial commit.

---

### FAILURE 3 — CORE-015: Session memory not committed

**Finding**: Foreman session memory `.agent-workspace/foreman-v2/memory/session-rca-breach-20260308.md` is present on disk (untracked) but NOT in the committed diff.

**Fix required**: Include in the commit (resolved by CORE-018 fix).

---

### FAILURE 4 — A-026 / BL-027: SCOPE_DECLARATION.md stale on HEAD

**Finding**: The committed SCOPE_DECLARATION.md on HEAD contains prior wave (`patch-T075-isolation`) content, declaring 13 files from a prior wave — none of which are in the current branch diff (4 files). The breach-rca-20260308 content is only in the working tree (unstaged).

**Fix required**: Commit the correct SCOPE_DECLARATION.md (resolved by CORE-018 fix).

---

## Substantive Review Note (Positive)

The CONTENT of the deliverables in working tree is substantively SOUND:
- INC-BOOTSTRAP-IMPL-001: complete, specific, traceable (PRs #986/#990, issue #1013)
- A-031 (PRE-BRIEF-BEFORE-DELEGATION): clear, actionable, non-duplicative (OVL-KG-001 PASS, OVL-KG-003 PASS)
- Ripple assessment: thorough — ISMS-local scope, no contract change required
- Session memory: complete with all required fields
- Index.md v1.8.0: correct and consistent

All failures are ceremony/commit-gate failures only. Fast to resolve.

---

## Required Resolution Steps

1. `git add .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`
2. `git add .agent-workspace/foreman-v2/knowledge/index.md`
3. `git add .agent-workspace/foreman-v2/parking-station/suggestions-log.md`
4. `git add SCOPE_DECLARATION.md`
5. Edit PREHANDOVER proof to populate `git log --oneline -5 (post-commit):` section (BEFORE staging the PREHANDOVER proof)
6. `git add .agent-workspace/foreman-v2/memory/session-rca-breach-20260308.md`
7. `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-rca-breach-20260308.md`
8. `git commit -m "gov(wave): breach-rca-20260308 — FAIL-ONLY-ONCE.md v2.9.0 + session memory + PREHANDOVER + SCOPE_DECLARATION"`
9. Re-invoke IAA via `task(agent_type: "independent-assurance-agent")`

---

## Next Steps for Foreman

Per §4.3b: The Foreman initiates a **fresh PREHANDOVER proof** in a new commit to resolve findings. Since the PREHANDOVER proof is currently untracked (not yet committed), the Foreman may edit it in-place to add the `git log` output before committing. No new PREHANDOVER file is required — just populate the placeholder and commit all deliverables together.

---

**Authority**: CS2 only (@APGI-cmy)
**Merge authority**: CS2 ONLY — this PR must not be opened until ASSURANCE-TOKEN issued
**Rejection reference**: IAA-session-rca-breach-20260308-wavebreachRCA-20260308-R1-REJECTION
