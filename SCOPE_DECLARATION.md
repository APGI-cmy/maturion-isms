# SCOPE DECLARATION

**Wave**: Wave WF-Dispatch — Workflow Manual Dispatch Fix
**Branch**: copilot/fix-workflow-trigger-conditions
**Session**: session-157-wave-wf-dispatch-20260306
**Date**: 2026-03-06
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**PR**: #959

## Files Changed in This PR

- `.github/workflows/deploy-mat-ai-gateway.yml` - 2-line change: `deploy-production` job (line 146) and `cwt` job (line 209) `if:` conditions updated to include `|| github.event_name == 'workflow_dispatch'`
- `.agent-admin/assurance/iaa-prebrief-wave-wf-dispatch-20260306.md` - IAA Pre-Brief for this wave (committed by IAA)
- `.agent-admin/assurance/iaa-token-session-157-wave-wf-dispatch-20260306.md` - IAA ASSURANCE-TOKEN (to be committed by IAA after Final Audit)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-157-wave-wf-dispatch-20260306.md` - PREHANDOVER proof for this wave (immutable post-commit)
- `.agent-workspace/foreman-v2/memory/session-157-wave-wf-dispatch-20260306.md` - Foreman session memory
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave WF-Dispatch task list
- `.agent-workspace/independent-assurance-agent/memory/session-157-wave-wf-dispatch-20260306.md` - IAA session memory (committed by IAA)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station (committed by IAA)
- `SCOPE_DECLARATION.md` - this file
