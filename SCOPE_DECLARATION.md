# Scope Declaration — wave-upload-doclist-fix — 2026-03-08

**Wave**: wave-upload-doclist-fix  
**Branch**: `copilot/fix-ai-parsing-trigger`  
**Session**: session-wave-upload-doclist-fix-20260308  
**Authority**: CS2 (Johan Ras / @APGI-cmy) — "fix(app/api): Criteria document upload — AI parsing never triggers, uploaded documents never show"  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-upload-doclist-fix.md` — COMMITTED (SHA: 99ee260)

## Scope

This PR fixes the production bug where uploaded criteria documents never appeared in the
Uploaded Documents list when the Edge Function was unavailable. Root cause: `useUploadCriteria`
did not write any `audit_log` entry on upload success, and `useUploadedDocuments` only queried
`criteria_parsed`/`criteria_parse_failed` actions — leaving uploaded-but-unparsed documents
permanently invisible.

Fix: (a) `useUploadCriteria` now writes `audit_log(action='criteria_upload')` immediately after
storage upload succeeds; (b) `useUploadedDocuments` now queries all three actions with
deduplication; (c) `getParseStatus()` explicitly handles `criteria_upload` → PENDING.

## Files Changed

- `SCOPE_DECLARATION.md` - Updated for wave-upload-doclist-fix
- `.agent-admin/assurance/iaa-prebrief-wave-upload-doclist-fix.md` - IAA Pre-Brief artifact (IAA-authored)
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated for wave-upload-doclist-fix
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` - api-builder: audit_log write + query expansion + deduplication
- `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` - ui-builder: explicit criteria_upload branch in getParseStatus
- `modules/mat/tests/wave-upload-doclist-fix/wave-upload-doclist-fix.test.ts` - qa-builder: 10 RED→GREEN tests
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - foreman: INC-WUF-DOCLIST-001 registered
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - foreman: wave-upload-doclist-fix entry
- `modules/mat/03-implementation-plan/implementation-plan.md` - foreman: wave entry
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-upload-doclist-fix-20260308.md` - PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave-upload-doclist-fix-20260308.md` - Session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Parking station update
