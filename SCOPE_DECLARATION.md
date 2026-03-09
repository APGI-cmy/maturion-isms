# Scope Declaration — wave-session-refresh-auth-fix — 2026-03-09

**Wave**: wave-session-refresh-auth-fix  
**Branch**: `copilot/fix-session-refresh-auth-header`  
**Session**: session-wave-session-refresh-auth-fix-20260309  
**Authority**: CS2 (Johan Ras / @APGI-cmy) — "Bug: Edge Function returns 401 unless session is refreshed before parsing (fix useCriteria.ts mutation)" — CS2 FOREMAN RE-ALIGNMENT directive 2026-03-09  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-session-refresh-auth-fix.md`

## Scope

Single-function bug fix: `useTriggerAIParsing` in `modules/mat/frontend/src/lib/hooks/useCriteria.ts` now calls `supabase.auth.getSession()` before `supabase.functions.invoke('invoke-ai-parse-criteria', ...)` to ensure a valid JWT Authorization header is always sent. Governance: register INC-AUTHFIX-IMPL-001 in FAIL-ONLY-ONCE v3.5.0. No schema changes, no migration changes, no Edge Function changes, no CI workflow changes.

## IAA Ceremony Artifacts (IAA-Authored — A-031 Carve-Out)

Files committed on this branch by independent-assurance-agent during the final audit.
IAA-owned artifacts declared here to satisfy SCOPE_DECLARATION exact-match gate.

## Files Changed

- `.agent-admin/assurance/iaa-prebrief-wave-session-refresh-auth-fix.md` - IAA Pre-Brief (IAA-authored)
- `.agent-admin/assurance/iaa-token-session-wave-session-refresh-auth-fix-20260309.md` - IAA ASSURANCE-TOKEN (IAA-authored)
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - INC-AUTHFIX-IMPL-001 registered; S-029 noted; v3.5.0
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-session-refresh-auth-fix-20260309.md` - PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave-session-refresh-auth-fix-20260309.md` - Session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Parking station S-007 promotion entry
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave task list for wave-session-refresh-auth-fix
- `SCOPE_DECLARATION.md` - Updated for wave-session-refresh-auth-fix
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` - Session refresh guard in useTriggerAIParsing
- `modules/mat/tests/wave-session-refresh-auth-fix/wave-sraf-session-refresh.test.ts` - 4 RED to GREEN tests
