# Scope Declaration — Wave: pit-stage6-qa-to-red-20260513

## Meta

| Field | Value |
|---|---|
| Wave | pit-stage6-qa-to-red-20260513 |
| Session ID | session-pit-stage6-qa-to-red-20260513 |
| PR | #1626 |
| Issue | maturion-isms#1625 |
| Branch | copilot/create-stage-6-red-test-package |
| Date | 2026-05-13 |
| Orchestrating Agent | foreman-v2-agent |
| Executing Agent | foreman-v2-agent (direct execution — no builder delegation) |

## Scope Summary

Stage 6 QA-to-Red derivation wave for PIT module. Creates the RED test specification package that defines all failing tests a future builder must make GREEN. No implementation, no migrations, no builder appointment, no PBFAG.

## Approved Artifact Paths

All agent-created files in this wave must match one of the paths below:

```
.admin/prs/pr-1626.json
.agent-admin/scope-declarations/scope-declaration-wave-pit-stage6-qa-to-red.md
.agent-workspace/foreman-v2/personal/wave-current-tasks-pit-stage6-qa-to-red.md
modules/pit/06-qa-to-red/qa-to-red-plan.md
modules/pit/06-qa-to-red/red-test-suite-catalog.md
modules/pit/06-qa-to-red/frs-to-red-traceability.md
modules/pit/06-qa-to-red/trs-to-red-traceability.md
modules/pit/06-qa-to-red/architecture-to-red-traceability.md
modules/pit/06-qa-to-red/lfv-to-red-traceability.md
modules/pit/06-qa-to-red/route-screen-state-red-matrix.md
modules/pit/06-qa-to-red/role-denied-path-red-matrix.md
modules/pit/06-qa-to-red/timeline-engine-red-tests.md
modules/pit/06-qa-to-red/live-functional-red-gates.md
modules/pit/06-qa-to-red/stage6-gate-readiness-checklist.md
modules/pit/BUILD_PROGRESS_TRACKER.md
```

## Hard Boundaries

This wave MUST NOT create or modify:
- Any file under `apps/`, `supabase/`, `scripts/` (no implementation)
- Any database migration files
- Any Supabase RLS policy files
- `.github/workflows/pit-live-verification.yml` (workflow design artifact only; not activated here)
- Any deployment configuration
- Any builder agent contract or appointment files
- Any Stage 7+ artifacts

## Non-Goals Confirmed

- [x] No CODE_PASS claimed
- [x] No FUNCTIONAL_PASS claimed
- [x] No Build Authorization cleared
- [x] No builder appointed
- [x] No PBFAG started
- [x] No Implementation Plan started
- [x] No Build Execution started
