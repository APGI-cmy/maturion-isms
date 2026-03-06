# SCOPE DECLARATION

**Wave**: Wave 15 — Post-Delivery Oversight Remediation (Criteria Parsing Pipeline)
**Branch**: copilot/initiate-wave-15-orchestration
**Session**: session-wave15-impl-20260306
**Date**: 2026-03-06
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**PR**: copilot/initiate-wave-15-orchestration

## Files Changed in This PR

### Governance Batch (T-W15-GOV-002 to T-W15-QA-001)
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave 15 section added; version bumped to v1.6
- `modules/mat/00-app-description/app-description.md` - v1.4; §6.2 Parsing Pipeline concretised
- `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` - Step 2a concrete parse cycle wiring
- `modules/mat/01-frs/functional-requirements.md` - v2.0.0; FR-005 expanded; FR-103 added
- `modules/mat/02-architecture/system-architecture.md` - §4 Criteria Parsing Pipeline Architecture added
- `modules/mat/tests/wave15/wave15-criteria-parsing.test.ts` - new; 14 RED gate tests (T-W15-CP-001 to T-W15-CP-014)
- `modules/mat/tests/wave15/wave15-red-gate-evidence.log` - committed test run log; 14/14 RED at commit time

### Implementation Batches A+B (T-W15-IMPL-001, T-W15-IMPL-002)
- `supabase/functions/invoke-ai-parse-criteria/index.ts` - new; Supabase Edge Function; criteria parsing pipeline
- `apps/mat-ai-gateway/services/parsing.py` - real DocumentParser; GPT-4 Turbo + pypdf2 + python-docx + FastAPI router
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` - useParseStatus hook with refetchInterval polling added
- `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` - FR-103 inline uploadError state; data-testid="criteria-upload-error"

### Governance Artifacts
- `.agent-admin/assurance/iaa-prebrief-wave15.md` - IAA Pre-Brief for Wave 15
- `.agent-admin/assurance/iaa-token-session-wave15-gov-batch-20260306.md` - IAA rejection token (v1; superseded)
- `.agent-admin/assurance/iaa-token-session-wave15-gov-batch-v2-20260306.md` - IAA PASS token v2 (gov batch)
- `.agent-admin/assurance/iaa-token-session-wave15-impl-20260306.md` - IAA PASS token (implementation batches A+B)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-gov-batch-20260306.md` - PREHANDOVER proof (gov batch; PARITY-2 fixed)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-impl-20260306.md` - PREHANDOVER proof (implementation batches A+B)
- `.agent-workspace/foreman-v2/memory/session-wave15-orchestration-20260306.md` - Foreman session memory
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave 15 task list
- `SCOPE_DECLARATION.md` - this file
