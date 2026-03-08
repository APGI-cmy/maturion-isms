# SCOPE DECLARATION

**Wave**: patch-T075-isolation — Fix T-075 test isolation: buildPersistentMemory() shared state contamination
**Branch**: copilot/fix-isolate-build-persistent-memory-test
**Session**: session-patch-T075-20260308
**Date**: 2026-03-08
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**PR**: copilot/fix-isolate-build-persistent-memory-test

## Files Changed in This PR

- `.agent-admin/assurance/iaa-prebrief-patch-T075-isolation.md` - IAA Pre-Brief for patch-T075-isolation committed by IAA agent
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - wave current tasks updated for patch-T075-isolation
- `api/ai/request.test.ts` - T-075-1 test updated: use fresh makeTestSupabaseClient() adapter + unique org-red-${Date.now()} organisationId to prevent cross-run contamination (T-T075-ISO-001)
- `SCOPE_DECLARATION.md` - this file
