# MMM Change Summary Email and Accept/Reject/Apply QA-to-Red Scope

Wave: `wave-mmm-change-summary-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-change-summary-qa-red`
Module scope: MMM approval workflow change summary e-mail and level 1 proposed-change response flow
Lane: QA-to-red / pre-build preparation
CS2 Authority: Johan Ras
Foreman role: scope, assurance, delegation, and QA-to-red coordination

## Objective

Prepare Step 4 of the MMM approval workflow sequence by establishing scope, IAA pre-brief, builder appointment, and QA-to-red coverage before any implementation code.

This wave covers Step 4 in the CS2-approved sequence:

1. Gap analysis / pre-build alignment for the approval workflow. Completed by PR #1831.
2. Database/API contract for approval rounds, approvers, proposed edits, comments, notifications, and locks. Completed by PR #1833.
3. Level 2 invite modal and approval workspace QA-to-red. Completed by PR #1837.
4. Change summary e-mail and accept/reject/apply flow. This wave prepares QA-to-red before code.

## Authority inputs

- `modules/MMM/approval-workflow/approval-workflow-prebuild-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-db-api-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-notification-lock-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-qa-to-red.md`
- `modules/MMM/approval-workflow/level2-invite-workspace-qa-to-red.md`
- Uploaded `The Maturity Roadmap(5).docx`
- CS2 instruction to proceed with Step 4 using QA-to-red before implementation.

## Bounded file scope for this QA-to-red wave

QA-to-red artifacts may be added under:

- `modules/MMM/approval-workflow/`

Required governance / assurance / delegation records for this wave may be added under:

- `.agent-admin/scope-declarations/`
- `.agent-admin/assurance/`
- `.agent-admin/builder-appointments/`

## Required QA-to-red coverage

This wave must define failing tests for:

- proposed-change summary generation;
- level 1 e-mail summary payload expectations;
- precise display references such as `MPS 4 / Criteria 7 / Descriptor: Compliant`;
- grouping by domain, MPS, criterion, descriptor, approver, and approval round;
- accept as proposed;
- reject with reason;
- edit and apply modified value;
- request clarification;
- add reply comment;
- resubmit to Level 2 approvers;
- notification events to level 1 and level 2 approvers;
- audit event expectations;
- AI learning event expectations;
- canonical content non-overwrite until level 1 applies a change;
- conflict handling if canonical content changed since proposal.

## Out of scope

- Implementing e-mail delivery.
- Implementing e-mail templates.
- Implementing UI components.
- Implementing database migrations.
- Implementing API routes or edge functions.
- Implementing runtime scoped access behavior.
- Implementing Level 3 approval expansion.
- Implementing published maturity model view.
- Implementing evidence modal harvest/adaptation.

## Lane note

This wave is QA-to-red only. Implementation may start only after QA-to-red has been committed and delegated against this scope.
