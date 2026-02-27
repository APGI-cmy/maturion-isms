# PREHANDOVER PROOF — Integration Builder Session 002
**Date**: 2026-02-27  
**Agent**: integration-builder  
**Task**: Add branch guard to workflow_dispatch condition  
**Delegated by**: foreman-v2-agent

---

## Implementation Summary

Added `&& github.ref == 'refs/heads/main'` to the `workflow_dispatch` condition in the `deploy-production` job of `.github/workflows/deploy-mat-vercel.yml`.

**Security Impact**: Prevents accidental production deployments triggered via `workflow_dispatch` from non-main branches.

---

## Change Evidence

**File**: `.github/workflows/deploy-mat-vercel.yml` (lines 194-196)

**Before**:
```yaml
    if: >
      (github.event_name == 'push' && github.ref == 'refs/heads/main') ||
      github.event_name == 'workflow_dispatch'
```

**After**:
```yaml
    if: >
      (github.event_name == 'push' && github.ref == 'refs/heads/main') ||
      (github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/main')
```

**Local Commit SHA**: `19d6fe1c5b8ebc0db0abd084796e07d71e4c2b49`

---

## Verification Checklist

- [x] Both conditions now include `github.ref == 'refs/heads/main'`
- [x] YAML syntax valid: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy-mat-vercel.yml')); print('VALID')"` → **VALID**
- [x] Only the targeted line was modified (no other changes)
- [x] Code review: **PASS** (0 comments from automated review)
- [x] CodeQL: **0 alerts** (actions ecosystem)
- [x] Zero test debt (no tests modified)
- [x] Commit message: `fix: restrict workflow_dispatch production deploy to main branch`
- [ ] Push to remote: **BLOCKED** — see escalation

---

## Merge Gate Parity Check
- `merge_gate_parity`: FAIL (local gate not runnable due to push being blocked — environment token scope limitation)
- Note: Implementation is complete and verified. Blocker is infrastructure, not code quality.

---

## IAA Invocation
- `iaa_invocation_result`: **PHASE_A_ADVISORY** (push blocked, PR not opened, IAA review pending)
- `double_qa_confirmed`: Foreman QA (delegated) ✅ | IAA QA pending ⏳

---

## Push Blocker

**Root Cause**: Copilot SWE agent OAuth token (`ghu_ntIy...`) has zero scopes:
```
x-oauth-scopes: (empty)
x-accepted-oauth-scopes: repo
```
All write operations (git push, Contents API, Refs API) return HTTP 403.

**Escalation Filed**: `.agent-workspace/integration-builder/escalation-inbox/blocker-20260227.md`

**Resolution Path**: Foreman to configure token with `repo` scope OR manually push/apply change.

---

## Process Improvement Reflection

1. **What went well**: Implementation was clean, targeted, and verified. YAML validation, code review, and CodeQL all passed on first attempt.

2. **What failed**: Push to remote failed due to zero-scope OAuth token in the Copilot SWE agent environment.

3. **Process improvement**: The task spec mentions `report_progress` as the push mechanism. This tool is not available as a shell command. Future task specs should clarify the push mechanism, or the Copilot workflow should be configured with a token that has `contents: write` permission.

4. **BL compliance**: BL-016 (ratchet) ✅ | BL-018 (QA range) N/A | BL-019 (semantic alignment) N/A | BL-024 (constitutional sandbox) ✅ | BL-029 (tracker update) N/A (non-wave task)

5. **Actionable governance improvement**: Document the token scope requirement for Copilot agent environments in the builder workflow setup guide. Add a pre-flight check: `curl -sI -H "Authorization: token $GITHUB_TOKEN" https://api.github.com | grep x-oauth-scopes` — if empty, halt and escalate before spending build cycles.

---

## Outcome
**PARTIAL** — Implementation COMPLETE, push BLOCKED by environment. Escalation filed.
