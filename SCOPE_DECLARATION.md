# Wave 19 MAT Criteria Parsing Holistic Repair — Scope Declaration
# Authority: A-026/A-029 (SCOPE_DECLARATION-FRESH-OVERWRITE)
# Session: session-wave19-orchestration-20260317
# Issue: maturion-isms#1137
# Branch: copilot/wave-19-holistic-mat-criteria-repair
# NOTE: Per A-031, Foreman does not appear as author of production code files below.
#       All production code changes are authored by inducted builder agents.

## Batch A — QA RED Suite (qa-builder)
- `modules/mat/tests/wave19/wave19-criteria-parsing.test.ts` — T-W19-001..T-W19-015 RED gate tests
- `apps/mat-ai-gateway/tests/test_wave19_startup.py` — T-W19-016 Python startup validation test

## Batch B — Schema Migrations (schema-builder)
- `apps/maturion-maturity-legacy/supabase/migrations/20260317000001_criteria_number_text.sql` — criteria.number TYPE TEXT (GAP-PARSE-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260317000002_mps_intent_guidance.sql` — MPS intent_statement/guidance columns (GAP-PARSE-002)
- `apps/maturion-maturity-legacy/supabase/migrations/20260317000003_parse_write_back_atomic_rpc.sql` — atomic write-back RPC (GAP-PARSE-005)

## Batch C — API/Edge Function (api-builder)
- `supabase/functions/invoke-ai-parse-criteria/index.ts` — 6 fixes: c.number, MPS intent_statement, zero-domain throw, reason field, zero-insert assertion, AI_GATEWAY_URL 500
- `apps/mat-ai-gateway/services/parsing.py` — MpsResult intent_statement/guidance fields (GAP-PARSE-008)

## Batch D — UI (ui-builder)
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` — MAX_POLL_ITERATIONS=600 poll timeout (GAP-PARSE-009)

## Batch E — Integration (integration-builder)
- `.github/scripts/validate-mat-schema-alignment.sh` — CI schema alignment validation (GAP-PARSE-007)

## Batch F — E2E Fixture (qa-builder)
- `modules/mat/tests/wave19/fixtures/ldcs-fixture.json` — LDCS E2E content assertion fixture (GAP-PARSE-010)

## Governance Artifacts (foreman-v2-agent)
- `.agent-admin/assurance/iaa-prebrief-wave19-criteria-parsing-repair.md` — IAA Pre-Brief
- `.agent-admin/assurance/iaa-rejection-session-wave19-orchestration-20260317.md` — IAA R1 rejection
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave19-orchestration-20260317.md` — PREHANDOVER Proof
- `.agent-workspace/foreman-v2/memory/session-wave19-orchestration-20260317.md` — Session Memory
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — Wave 19 task tracking
- `SCOPE_DECLARATION.md` — Wave 19 scope declaration (this file)
