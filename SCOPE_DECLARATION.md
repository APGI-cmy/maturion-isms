# SCOPE DECLARATION

**Wave**: patch-T075-isolation — Fix T-075 test isolation: buildPersistentMemory() shared state contamination
**Branch**: copilot/fix-isolate-build-persistent-memory-test
**Session**: session-patch-T075-20260308
**Date**: 2026-03-08
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**PR**: copilot/fix-isolate-build-persistent-memory-test

## Files Changed in This PR

- `.agent-admin/assurance/iaa-prebrief-patch-T075-isolation.md` - IAA Pre-Brief for patch-T075-isolation committed by IAA agent
- `.agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308-R2-REJECTION.md` - IAA R2 REJECTION-PACKAGE token file committed by IAA agent
- `.agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308.md` - IAA R1 REJECTION-PACKAGE token file committed by IAA agent
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md` - Foreman PREHANDOVER proof artifact
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - wave current tasks updated for patch-T075-isolation
- `.agent-workspace/independent-assurance-agent/memory/session-patch-T075-isolation-20260308-R2.md` - IAA R2 session memory committed by IAA agent
- `.agent-workspace/independent-assurance-agent/memory/session-patch-T075-isolation-20260308.md` - IAA R1 session memory committed by IAA agent
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station log updated by IAA agent
- `.agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md` - qa-builder session memory
- `api/ai/request.test.ts` - T-075-1 test updated: use fresh makeTestSupabaseClient() adapter + unique org-red-${Date.now()}-${random} organisationId to prevent cross-run contamination (T-T075-ISO-001)
- `SCOPE_DECLARATION.md` - this file
