# REJECTION-PACKAGE — Wave mmm-gov-gaps

**Artifact Type**: IAA Rejection Package
**IAA Session**: session-mmm-gov-gaps-20260403
**Date**: 2026-04-03
**Wave**: mmm-gov-gaps
**Branch**: copilot/fix-governance-compliance-gaps
**Invoking Agent**: foreman-v2-agent
**Producing Agent**: mat-specialist
**IAA Version**: independent-assurance-agent v6.2.0 / contract 2.3.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## Verdict

**REJECTION-PACKAGE**

3 checks FAILED. Merge blocked. STOP-AND-FIX required.

All failures are ceremony violations (uncommitted artifacts). The substantive content of
`modules/MMM/00-app-description/MMM_app_description.md` passed all 10 DOC-FFA checks.
No re-work of document content is required — only ceremony commit fixes.

---

## Failures

### FAILURE-001 — CERT-001 / PARITY-03: PREHANDOVER proof not committed

**Rule violated**: FAIL-ONLY-ONCE A-021 (commit before invoke), A-033 (git ls-tree authoritative)

**File**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-gov-gaps-wave-mmm-gov-gaps-20260403.md`

**Finding**: File exists on disk (untracked). `git ls-tree -r HEAD | grep PREHANDOVER-session-mmm-gov-gaps` returns NO OUTPUT. The file has never been committed to the branch. IAA cannot treat an untracked file as a committed artifact.

**Fix required**:
```bash
git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-gov-gaps-wave-mmm-gov-gaps-20260403.md
```
(Include in the fix commit — see Fix Sequence below.)
Verify after commit:
```bash
git ls-tree -r HEAD | grep PREHANDOVER-session-mmm-gov-gaps
```
Must return a blob entry before re-invoking IAA.

---

### FAILURE-002 — CERT-002 / PARITY-04: Session memory not committed

**Rule violated**: FAIL-ONLY-ONCE A-021, A-033

**File**: `.agent-workspace/foreman-v2/memory/session-mmm-gov-gaps-20260403.md`

**Finding**: File exists on disk (untracked). `git ls-tree -r HEAD | grep session-mmm-gov-gaps` returns NO OUTPUT.

**Fix required**:
```bash
git add .agent-workspace/foreman-v2/memory/session-mmm-gov-gaps-20260403.md
```
(Include in the fix commit — see Fix Sequence below.)

---

### FAILURE-003 — PARITY-02: Deliverable changes not committed to HEAD

**Rule violated**: FAIL-ONLY-ONCE A-021

**File**: `modules/MMM/00-app-description/MMM_app_description.md`

**Finding**: Staged changes (v0.2.0 — all 15 governance gap fixes) are present in the git index but NOT committed to HEAD. `git ls-tree HEAD` returns blob `f3b77752` (the v0.1.0 file, before mat-specialist changes). Any CI run or reviewer checking out HEAD will see the old v0.1.0 document without the governance gap fixes.

**Fix required**:
```bash
git commit
```
Ensure the staged changes are included. Verify after commit:
```bash
git ls-tree HEAD modules/MMM/00-app-description/MMM_app_description.md
```
Must return a new blob SHA (not `f3b77752`).

---

## Advisory (Non-Blocking)

**ADVISORY — DOC-FFA-001: Parking station log modification**

**File**: `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`

**Finding**: This file has unstaged modifications. It appears in `git diff HEAD --name-only`. If `git add -A` or `git commit -am` is used during the fix commit, this file will be inadvertently included in the PR, violating DOC-FFA-001 (scope: only declared files changed).

**Action required**: Use explicit `git add [specific files]` during the fix commit. Do NOT use `git add -A`. Either:
- Include the parking station log as an intentional ceremony artifact (acceptable), OR
- Exclude it from the commit by using explicit file paths only.

---

## Substantive Content Assessment (Informational — All PASS)

The document content was fully reviewed. All DOC-FFA checks pass:

| Check | Result | Notes |
|-------|--------|-------|
| DOC-FFA-001 | PASS ✅ | Scope clean (staged diff) |
| DOC-FFA-002 | PASS ✅ | All P1 items: §41, §37.0, §37.3, §31.1 |
| DOC-FFA-003 | PASS ✅ | All P2 items: §26.7, §32.1, §33.1, §38.1, §38.2, §39A.1 |
| DOC-FFA-004 | PASS ✅ | All P3 items: §32.2, §37.2, §31.2, §35.1, §31.3 |
| DOC-FFA-005 | PASS ✅ | No STUB/TODO/FIXME in additions |
| DOC-FFA-006 | PASS ✅ | All referenced governance files exist; non-existent artifacts correctly qualified "to be created" |
| DOC-FFA-007 | PASS ✅ | v0.1.0 → v0.2.0, 2026-04-03 |
| DOC-FFA-008 | PASS ✅ | ISO 27001, ISO 31000, NIST CSF explicitly named |
| DOC-FFA-009 | PASS ✅ | Q1 explicitly RESOLVED: distinct top-level application |
| DOC-FFA-010 | PASS ✅ | No over-specification (advisory) |

**No re-work of document content is required.**

---

## Required Fix Sequence

Execute the following exact sequence before re-invoking IAA:

```bash
# Step 1: Confirm staged changes are correct (v0.2.0 deliverable)
git --no-pager diff --cached --stat

# Step 2: Commit ONLY the intended files (use explicit paths — NOT git add -A)
git add modules/MMM/00-app-description/MMM_app_description.md
git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-gov-gaps-wave-mmm-gov-gaps-20260403.md
git add .agent-workspace/foreman-v2/memory/session-mmm-gov-gaps-20260403.md
# Optionally include parking station log if intended:
# git add .agent-workspace/foreman-v2/parking-station/suggestions-log.md

git commit -m "feat(mmm): close governance compliance gaps (P1/P2/P3) — wave mmm-gov-gaps"

# Step 3: Verify all ceremony artifacts are now in git tree
git ls-tree -r HEAD | grep "MMM_app_description\|PREHANDOVER-session-mmm-gov-gaps\|session-mmm-gov-gaps"

# All three must return blob entries before re-invoking IAA.

# Step 4: Push to remote
git push

# Step 5: Re-invoke IAA
```

---

## Re-Invocation Guidance

IAA expects re-invocation to result in ASSURANCE-TOKEN (PASS) subject to:
- All three failures resolved and committed
- Git tree showing all ceremony artifacts
- No new scope additions to the deliverable

IAA will NOT re-run the DOC-FFA substantive review in full if the re-invocation states only ceremony fixes were applied. A brief verification pass will confirm the document content is unchanged from this review.

---

## Rejection Reference

**Token reference**: REJECTION-IAA-session-mmm-gov-gaps-20260403
**IAA adoption phase at time of rejection**: PHASE_B_BLOCKING
**Failures cited**: 3 (CERT-001, CERT-002, PARITY-02)
**Advisory items**: 1 (DOC-FFA-001 parking station log)
**Substantive DOC-FFA checks**: 10/10 PASS
**Re-invocation required**: YES — ASSURANCE-TOKEN cannot be issued until failures are resolved

---

*Authority: CS2 (Johan Ras / @APGI-cmy) | IAA v6.2.0 | Rejection issued: 2026-04-03*
