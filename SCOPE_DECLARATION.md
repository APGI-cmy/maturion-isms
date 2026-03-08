# Scope Declaration — wave-upload-doclist-fix — 2026-03-08

**Wave**: wave-upload-doclist-fix  
**Branch**: `copilot/fix-ai-parsing-trigger`  
**Session**: session-wave-upload-doclist-fix-20260308  
**Authority**: CS2 (Johan Ras / @APGI-cmy) — "fix(app/api): Criteria document upload — AI parsing never triggers, uploaded documents never show"  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-upload-doclist-fix.md` (SHA: 99ee260)

## Scope

This PR fixes the production bug where uploaded criteria documents never appeared in the
Uploaded Documents list when the Edge Function was unavailable. Fix: (a) `useUploadCriteria`
now writes `audit_log(action='criteria_upload')` after storage upload succeeds; (b)
`useUploadedDocuments` queries all three actions with Map-based deduplication; (c)
`getParseStatus()` explicitly handles `criteria_upload` → PENDING.

## IAA Ceremony Artifacts (IAA-Authored — A-031 Carve-Out)

Files committed on this branch by independent-assurance-agent during rejection sessions.
IAA-owned artifacts declared here to satisfy SCOPE_DECLARATION exact-match gate.

## Files Changed

- `.agent-admin/assurance/iaa-prebrief-wave-upload-doclist-fix.md` - IAA Pre-Brief (IAA-authored)
- `.agent-admin/assurance/iaa-rejection-session-wave-upload-doclist-fix-20260308-R1.md` - IAA R1 rejection (IAA-authored)
- `.agent-admin/assurance/iaa-rejection-session-wave-upload-doclist-fix-20260308-R2.md` - IAA R2 rejection (IAA-authored)
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - INC-WUF-DOCLIST-001 registered; v3.3.0
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-upload-doclist-fix-20260308.md` - PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave-upload-doclist-fix-20260308.md` - Session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Parking station S-027
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave task list for wave-upload-doclist-fix
- `.agent-workspace/independent-assurance-agent/memory/session-wave-upload-doclist-fix-20260308-R2.md` - IAA R2 session memory (IAA-authored)
- `.agent-workspace/independent-assurance-agent/memory/session-wave-upload-doclist-fix-20260308.md` - IAA R1 session memory (IAA-authored)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station (IAA-authored)
- `SCOPE_DECLARATION.md` - Updated for wave-upload-doclist-fix
- `modules/mat/03-implementation-plan/implementation-plan.md` - Wave entry
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave entry
- `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` - getParseStatus criteria_upload branch
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` - audit_log write + query expansion + deduplication
- `modules/mat/tests/wave-upload-doclist-fix/wave-upload-doclist-fix.test.ts` - 10 RED to GREEN tests
