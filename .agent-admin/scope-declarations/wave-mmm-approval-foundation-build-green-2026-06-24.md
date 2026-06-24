# MMM Approval Workflow Foundation Build-to-GREEN Scope

Wave: `wave-mmm-approval-foundation-build-green-2026-06-24`
Date: 2026-06-24
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-approval-foundation-build-green`
Module scope: MMM approval workflow foundation implementation
Lane: Build-to-GREEN foundation wave
CS2 Authority: Johan Ras
Foreman role: scope, assurance, implementation sequencing, and verification

## Objective

Start the first implementation build-to-GREEN wave after completion of Steps 1-8 pre-build / QA-to-red / alignment artifacts.

This wave is limited to the approval workflow foundation needed before UI-specific runtime waves.

## Authority inputs

- `modules/MMM/approval-workflow/approval-workflow-prebuild-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-db-api-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-notification-lock-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-qa-to-red.md`
- `modules/MMM/approval-workflow/frs-trs-architecture-alignment-addendum.md`
- `modules/MMM/BUILD_PROGRESS_TRACKER_APPROVAL_WORKFLOW_20260624.md`

## Required first-wave build scope

This wave may implement only:

- executable failing tests for the approval workflow foundation;
- canonical approval function naming guardrails;
- typed approval client contract surface;
- approval persistence/state-machine scaffolding;
- notification event scaffolding;
- audit event scaffolding;
- AI learning event scaffolding;
- lock/unlock transition scaffolding;
- minimal runtime needed to turn those tests green.

## Required executable tests before runtime code

The builder must create executable failing tests before runtime implementation for:

- canonical approval function names from the DB/API contract;
- no non-canonical approval function aliases;
- approval round create request/response shape;
- proposed changes submit request/response shape;
- approval decision submit request/response shape;
- Level 1 response submit request/response shape;
- lock transition request/response shape;
- audit event creation expectations;
- AI learning event creation expectations;
- notification event creation expectations;
- final lock cannot be bypassed.

## Out of scope for this wave

- Level 2 invite modal UI runtime.
- Level 2 approver workspace UI runtime.
- Level 1 e-mail templates or delivery runtime.
- Level 3 final approval UI runtime.
- Published model runtime view.
- Evidence modal runtime.
- Evidence upload runtime.
- AI evidence evaluation runtime.
- PIT/risk/incident integration runtime.

## Build law

No runtime code may be introduced before executable failing tests for the scoped foundation behavior exist in the PR.
