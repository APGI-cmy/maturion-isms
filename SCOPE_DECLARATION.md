# Wave 18 Scope Declaration
# Authority: A-026/A-029 (SCOPE_DECLARATION-FRESH-OVERWRITE)
# Session: session-wave18-orchestration-20260315
# Branch: copilot/repair-mat-criteria-parsing-pipeline

- `.agent-admin/assurance/iaa-prebrief-wave18-criteria-parsing-repair.md` - IAA Pre-Brief artifact for Wave 18
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - Phase 1 governance overlay: INC-W18-CRITERIA-PIPELINE-001, S-034, v3.9.0
- `.agent-workspace/foreman-v2/knowledge/index.md` - Updated FAIL-ONLY-ONCE version reference to 3.9.0
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave 18 task tracking
- `.agent-workspace/independent-assurance-agent/memory/session-prebrief-wave18-criteria-parsing-20260315.md` - IAA Pre-Brief session memory
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station
- `.agent-workspace/qa-builder/memory/session-001-20260315.md` - qa-builder session memory
- `apps/mat-ai-gateway/services/parsing.py` - T-W18-007: Extended system prompt with intent_statement, guidance, maturity_descriptors; renamed stale comment to GPT-4.1; added TypedDicts
- `apps/maturion-maturity-legacy/supabase/migrations/20260315000001_wave18_criteria_intent_source_anchor.sql` - T-W18-005: ADD COLUMN intent_statement TEXT, source_anchor TEXT to criteria table
- `apps/maturion-maturity-legacy/supabase/migrations/20260315000002_wave18_upload_rls_fix.sql` - T-W18-006: Fix upload RLS — replace broken audit_documents_org_insert policy; add criteria_documents_insert guard
- `modules/mat/frontend/src/components/criteria/CriteriaApproval.tsx` - T-W18-009: Full Criteria Review/Approval screen implementation (replaces stub)
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` - T-W18-009: Extended Criterion interface with intent_statement, guidance, source_anchor, domain_id, organisation_id
- `modules/mat/tests/wave18/wave18-criteria-parsing-repair.test.ts` - T-W18-004: Red QA test suite covering all 8 Wave 18 gaps (15 tests, all GREEN after fixes)
- `supabase/functions/invoke-ai-parse-criteria/index.ts` - T-W18-008: Fix guidance/source_anchor mapping bug; add intent_statement; add descriptor table write-backs
