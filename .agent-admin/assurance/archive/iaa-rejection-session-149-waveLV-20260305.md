# IAA Rejection Package — Session 142 Re-Audit v2 — Wave LV — 2026-03-05

**Agent**: independent-assurance-agent
**Session ID**: IAA-session-142-waveLV-v2 (supersedes premature ASSURANCE-TOKEN)
**Wave**: Wave LV — MAT Liveness Test Suite
**PR Branch**: copilot/implement-mat-liveness-test-suite
**Issue**: #932
**Commit reviewed**: fa72776 (F-142-001 fix applied)
**Date**: 2026-03-05
**Adoption Phase**: PHASE_B_BLOCKING

---

## Supersession Notice

This REJECTION-PACKAGE supersedes the premature ASSURANCE-TOKEN issued in
`.agent-admin/assurance/iaa-token-session-142-waveLV-20260305.md`.

That token was committed before the mandatory codeql_checker step completed.
CodeQL surfaced a new finding (F-149-001). Under CORE-021 (Zero-Severity-Tolerance),
any finding identified during the assurance review MUST produce REJECTION-PACKAGE.
The premature ASSURANCE-TOKEN is revoked by this document.

---

## F-142-001 Status

F-142-001 (OVL-CI-001 + OVL-CI-003) — **RESOLVED** ✅
The 3 comment lines in liveness.yml and runner.ts accurately describe the
non-blocking CI architecture. This finding is closed.

---

## NEW FINDING — F-149-001

**Finding ID**: F-149-001
**Check**: BD-016 (security) / CodeQL: actions/missing-workflow-permissions
**File**: `.github/workflows/liveness.yml` — job `liveness` (line 22–86)
**Severity category**: Security — GITHUB_TOKEN over-permission risk

### Description

The `liveness` job in `.github/workflows/liveness.yml` does not declare an explicit
`permissions:` block. Without this, the job inherits the repository's default
GITHUB_TOKEN permissions, which may include write access to contents, issues,
pull-requests, and other resources.

The liveness workflow only requires:
- `contents: read` — for `actions/checkout@v4`
- No additional permissions (artifact upload uses `ACTIONS_RUNTIME_TOKEN`, not `GITHUB_TOKEN`)

Running a post-deploy workflow with write permissions is a security risk:
- If the workflow is compromised (e.g., via compromised `npm` dependency in the liveness runner),
  it could push code, create issues, or modify repository contents.
- Principle of least privilege requires explicit minimal permissions.

### CodeQL Alert

```
[actions/missing-workflow-permissions]
Actions job or workflow does not limit the permissions of the GITHUB_TOKEN.
Consider setting an explicit permissions block:
  permissions:
    contents: read
Location: .github/workflows/liveness.yml — jobs.liveness (line 22–86)
```

### Fix Required

Add an explicit `permissions:` block to the `liveness` job:

```yaml
jobs:
  liveness:
    permissions:
      contents: read
    # Only run on successful deploy OR when manually triggered
    if: >-
```

This is the minimum required permission for the workflow to function correctly
(checkout requires contents: read; artifact upload uses ACTIONS_RUNTIME_TOKEN).

### Session-148 Oversight Note

This finding was present in commit 75bac27 (original build). Session-148 reviewed
the workflow and passed BD-016 without surfacing this issue. CodeQL surfaced it
during this session's mandatory codeql_checker run. Per A-018 (post-merge retrospective
findings must be formally recorded): session-149 session memory records this as a
session-148 oversight. FAIL-ONLY-ONCE A-031 consideration: future CI workflow reviews
should include explicit GITHUB_TOKEN permissions check as a standalone check.

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/implement-mat-liveness-test-suite (Issue #932, commit fa72776)
1 check FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

F-149-001 — CodeQL: actions/missing-workflow-permissions
File: .github/workflows/liveness.yml — job: liveness
Finding: liveness job does not declare explicit permissions block.
         GITHUB_TOKEN defaults to potentially over-broad permissions.
Fix required: Add `permissions: contents: read` to the liveness job definition.

NOTE: F-142-001 (session-148) is RESOLVED. Only F-149-001 remains.

This PR must not be merged until F-149-001 is resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING
═══════════════════════════════════════════════════════════════
```

---

## Prior Passing Checks Carry Forward

All 50 checks from this re-audit PASS except F-149-001. On re-invocation after fix:
- F-142-001: RESOLVED — carries forward PASS
- F-149-001: Requires fix + re-invocation
- All 49 other checks: carry forward PASS

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA STOP-AND-FIX mandate**: ACTIVE
**Session memory**: `.agent-workspace/independent-assurance-agent/memory/session-149-waveLV-20260305.md` (to be updated)
