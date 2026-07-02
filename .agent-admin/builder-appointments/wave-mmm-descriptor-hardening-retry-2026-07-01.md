# Builder Appointment — MMM Descriptor Hardening Retry

Wave ID: wave-mmm-descriptor-hardening-retry-2026-07-01  
Issue: #1883  
Module: MMM  
Builder: ui-builder  
Status: PRE-APPOINTED (execution blocked until canonical IAA pre-brief is committed)

## Pre-brief binding

- iaa_wave_record_path: `.agent-admin/assurance/iaa-wave-record-wave-mmm-descriptor-hardening-retry-2026-07-01.md`
- prebrief_result_required: `PREFLIGHT_BRIEF_COMPLETE`
- order_gate_required: `pre-brief commit -> builder appointment commit -> first implementation commit`

## Assignment

Re-implement MMM descriptor hardening after revert `41d7503c` by removing criterion-specific hardcoded descriptor template behavior and preserving coherent fallback semantics plus deterministic regression coverage.

## Authorized files

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

## Required behavior

1. Remove criterion-specific hardcoded descriptor-template branching.
2. Preserve actor/action/object meaning under generalized normalization.
3. Keep scoped MMM subject-knowledge grounding in generation flow.
4. Preserve coherent fallback when grounding inputs are absent/partial.
5. Add/update regression tests for gerund normalization and fallback consistency.
6. Keep tests non-skipped and deterministic.

## Required QA artifact

- `modules/MMM/05-qa-to-red/descriptor-hardening-retry-qa-to-red-2026-07-01.md`

## Exclusions

- No `.github/agents/*` changes
- No unrelated CI/deployment/routing/module work
- No IAA/ECAP final-assurance artifact production by builder

