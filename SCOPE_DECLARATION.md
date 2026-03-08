# Scope Declaration — wave-audit-log-column-fix — 2026-03-08

**Wave**: wave-audit-log-column-fix  
**Branch**: `copilot/fix-document-upload-issues`  
**Session**: session-wave-audit-log-column-fix-20260308  
**Authority**: CS2 (Johan Ras / @APGI-cmy) — "fix(criteria-upload): audit_logs insert/query column mismatches prevent uploaded documents from appearing; migration drift and governance gaps require postmortem / scope closure"  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-audit-log-column-fix.md`

## Scope

This PR fixes schema column mismatches in `useCriteria.ts` that were introduced in wave-upload-doclist-fix (PR #1007). The `useUploadCriteria` INSERT used non-existent columns (`user_id`, `resource_type`, `resource_id`) and omitted required NOT NULL `organisation_id`. The `useUploadedDocuments` SELECT included non-existent `resource_id`. Fix: correct INSERT/SELECT column names, update `UploadedDocument` interface, fix deduplication key. Governance: register INC-ALCF-001 in FAIL-ONLY-ONCE v3.4.0, add S-028 (SCHEMA-COLUMN-COMPLIANCE-MANDATORY), update BUILD_PROGRESS_TRACKER and implementation-plan.

## IAA Ceremony Artifacts (IAA-Authored — A-031 Carve-Out)

Files committed on this branch by independent-assurance-agent during the final audit.
IAA-owned artifacts declared here to satisfy SCOPE_DECLARATION exact-match gate.

## Files Changed

- `.agent-admin/assurance/iaa-prebrief-wave-audit-log-column-fix.md` - IAA Pre-Brief (IAA-authored)
- `.agent-admin/assurance/iaa-token-session-wave-audit-log-column-fix-20260308.md` - IAA ASSURANCE-TOKEN (IAA-authored)
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - INC-ALCF-001 registered; S-028 added; v3.4.0
- `.agent-workspace/foreman-v2/knowledge/index.md` - Knowledge version bumped to 2.1.0
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-audit-log-column-fix-20260308.md` - PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave-audit-log-column-fix-20260308.md` - Session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Parking station S-028
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave task list for wave-audit-log-column-fix
- `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` - IAA FAIL-ONLY-ONCE A-032 added (IAA-authored)
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - IAA knowledge index updated (IAA-authored)
- `.agent-workspace/independent-assurance-agent/memory/session-wave-audit-log-column-fix-20260308.md` - IAA session memory (IAA-authored)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station (IAA-authored)
- `SCOPE_DECLARATION.md` - Updated for wave-audit-log-column-fix
- `modules/mat/03-implementation-plan/implementation-plan.md` - Wave entry for wave-audit-log-column-fix
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave entry for wave-audit-log-column-fix
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` - INSERT/SELECT column fix; UploadedDocument interface; dedup key
- `modules/mat/tests/wave-audit-log-column-fix/wave-audit-log-column-fix.test.ts` - 7 RED to GREEN tests
