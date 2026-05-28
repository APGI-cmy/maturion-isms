# MMM Cleanup Wave — Build Traceability and Redundancy Removal

- **Module**: MMM
- **Stage**: Cleanup Wave (Build-to-Green enforcement)
- **Date**: 2026-05-26
- **Status**: In progress

## Rule
Only components with explicit QA-to-red traceability and green verification remain active in runtime paths.

## Wave Steps
1. Build inventory of active runtime components (routes/pages/hooks/edge functions).
2. Map each component to QA IDs in `modules/MMM/05-qa-to-red/*` and test files in `modules/MMM/tests/B4-framework/*`.
3. Mark untraced items as:
   - `Q-CANDIDATE` (needs QA artifact), or
   - `REMOVE-CANDIDATE` (unused/legacy).
4. Remove or quarantine `REMOVE-CANDIDATE` artifacts.
5. Re-run B4 suite and publish final trace map.

## Initial Focus
- DMC interaction reliability and visibility of click outcomes.
- Route-level artifacts used by Dashboard, Frameworks, Onboarding, DMC, Domain workspace.
- New edge functions introduced in Wave S6/S7.

## New QA Gate Added in This Wave
- **T-MMM-DMC-008** — DMC click actions must provide immediate user feedback and inline validation errors.
