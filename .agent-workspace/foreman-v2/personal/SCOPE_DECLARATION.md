# SCOPE_DECLARATION — Wave 18 Post-Merge Hotfix
# Session: session-wave18-postmerge-hotfix-20260315
# Branch: copilot/fix-wave-18-post-merge-hotfixes
# Date: 2026-03-15 (v2 — correction addendum per IAA FINDING-1)
# Authority: A-026 / A-029 (SCOPE_DECLARATION-FRESH-OVERWRITE — cleared before writing)

## Declared Changed Files

### Production Code Fixes
- apps/mat-ai-gateway/services/parsing.py
- apps/maturion-maturity-legacy/supabase/migrations/20260315000003_wave18_profiles_rls_fix.sql
- supabase/functions/invoke-ai-parse-criteria/index.ts

### Governance Artifacts
- modules/mat/00-app-description/app-description.md
- modules/mat/03-implementation-plan/implementation-plan.md
- modules/mat/BUILD_PROGRESS_TRACKER.md

### Session/Assurance Artifacts
- .agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-20260315.md
- .agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-IAA-response-20260315.md
- .agent-admin/assurance/iaa-rejection-session-wave18postmerge-hotfix-20260315.md
- .agent-workspace/foreman-v2/personal/wave-current-tasks.md
- .agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md
- .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave18-postmerge-hotfix-20260315.md
- .agent-workspace/foreman-v2/memory/PREHANDOVER-ADDENDUM-session-wave18-postmerge-hotfix-20260315.md
- .agent-workspace/foreman-v2/memory/session-wave18-postmerge-hotfix-20260315.md
- .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md
- .agent-workspace/independent-assurance-agent/memory/session-prebrief-wave18-postmerge-hotfix-20260315.md
- .agent-workspace/independent-assurance-agent/memory/session-wave18-postmerge-hotfix-20260315-AUDIT.md
- .agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md

## POLC Boundary Declaration

All production code changes were made by inducted ISMS specialist agents:
- T-W18P-001 (RLS migration): schema-builder
- T-W18P-002/003/004 (Pydantic, Prompt, Descriptor Index): api-builder
- T-W18P-006 (Governance docs): mat-specialist

foreman-v2-agent authored: governance artifacts only (pre-brief, wave-current-tasks, SCOPE_DECLARATION, PREHANDOVER, PREHANDOVER addendum, session memory, FAIL-ONLY-ONCE status update)
