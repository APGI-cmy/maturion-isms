# Builder Appointment - MMM Approval Foundation Build-to-GREEN

Wave: `wave-mmm-approval-foundation-build-green-2026-06-24`
Date: 2026-06-24
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-approval-foundation-build-green`
Builder role: `approval-foundation-builder`

## Appointment

The builder is appointed to implement the first MMM approval workflow foundation build-to-GREEN wave after completed Steps 1-8 pre-build alignment.

## Mandatory sequence

1. Create executable failing tests for the scoped approval foundation.
2. Confirm those tests fail for the right reason.
3. Implement minimal runtime/contracts to make those tests pass.
4. Do not implement later UI/runtime waves.

## Required test coverage

- Canonical approval function names.
- Non-canonical approval alias rejection.
- Approval round create contract.
- Invitation accept contract.
- Proposed changes submit contract.
- Approval decision submit contract.
- Level 1 response submit contract.
- Approval lock transition contract.
- Notification event expectation.
- Audit event expectation.
- AI learning event expectation.
- Final lock bypass prevention.

## Runtime scope allowed after red tests exist

- Typed approval client contract surface.
- Contract constants/types.
- State-machine helper logic.
- Event-shape helper logic.
- Lock-transition guard helper logic.
- Minimal implementation needed to turn scoped tests green.

## Out of scope

- Level 2 invite modal UI.
- Level 2 approver workspace UI.
- Level 1 e-mail delivery/templates.
- Level 3 final approval UI.
- Published model runtime.
- Evidence modal runtime.
- Evidence upload runtime.
- AI evidence evaluation runtime.
- PIT/risk/incident integration runtime.
