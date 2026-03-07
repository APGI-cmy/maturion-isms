# SCOPE DECLARATION

**Wave**: Wave 15 — Schema Drift Remediation (parse_tasks migration)
**Branch**: copilot/add-migration-for-parse-tasks-table
**Session**: session-wave15-schemadrift-20260307
**Date**: 2026-03-07
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**PR**: copilot/add-migration-for-parse-tasks-table

## Files Changed in This PR

### Schema Drift Fix (T-W15-SCH-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260307000001_parse_tasks_table.sql` - new; CREATE TABLE public.parse_tasks + RLS SELECT policy (org-isolation); fixes T-W13-SCH-11

### Governance Artifacts (T-W15-SCH-002)
- `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` - Wave 15 Schema Drift section added; RCA INC-W15-SCHEMA-DRIFT-001 recorded

### IAA Protocol Artifacts
- `.agent-admin/assurance/iaa-prebrief-wave15-schemadrift.md` - IAA Pre-Brief for wave15-schemadrift
- `.agent-admin/assurance/iaa-token-session-wave15-schemadrift-wave15-20260307.md` - IAA assurance token
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-schemadrift-wave15-20260307.md` - PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave15-schemadrift-20260307.md` - Foreman session memory
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - updated; T-W15-SCH-001 and T-W15-SCH-002 added
- `.agent-workspace/independent-assurance-agent/memory/session-wave15-schemadrift-20260307.md` - IAA session memory
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station log
- `SCOPE_DECLARATION.md` - this file
