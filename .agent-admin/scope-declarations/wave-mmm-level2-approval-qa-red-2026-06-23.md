# MMM Level 2 Approval Invite/Workspace QA-to-Red Scope

Wave: `wave-mmm-level2-approval-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-level2-approval-qa-red`
Module scope: MMM Level 2 approval invite modal and approval workspace
Lane: QA-to-red / pre-build preparation
CS2 Authority: Johan Ras
Foreman role: scope, assurance, delegation, and QA-to-red coordination

## Objective

Prepare the Level 2 invite modal and approval workspace implementation wave by establishing scope, IAA pre-brief, builder appointment, and QA-to-red tests before any implementation code.

This wave covers the first part of Step 3 in the CS2-approved sequence:

1. Gap analysis / pre-build alignment for the approval workflow. Completed by PR #1831.
2. Database/API contract for approval rounds, approvers, proposed edits, comments, notifications, and locks. Completed by PR #1833.
3. Level 2 invite modal and approval workspace. This wave prepares QA-to-red before code.

## Authority inputs

- `modules/MMM/approval-workflow/approval-workflow-prebuild-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-db-api-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-notification-lock-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-qa-to-red.md`
- Uploaded `The Maturity Roadmap(5).docx`
- CS2 instruction to proceed with a fresh branch from main with scope, IAA pre-brief, builder appointment, and QA-to-red before code.

## Bounded file scope for this QA-to-red wave

QA-to-red artifacts may be added under:

- `modules/MMM/approval-workflow/`

Required governance / assurance / delegation records for this wave may be added under:

- `.agent-admin/scope-declarations/`
- `.agent-admin/assurance/`
- `.agent-admin/builder-appointments/`

## Required QA-to-red coverage

This wave must define failing tests for:

- level 1 submit-domain-for-approval entry point;
- Level 2 invite modal with multiple approvers;
- approver row add/remove behavior;
- e-mail validation and duplicate e-mail prevention;
- required fields: name, e-mail, approval level, designation/scope;
- API contract integration with `mmm-approval-round-create`;
- notification event creation expectations;
- scoped approver invitation/access handoff expectations;
- Level 2 approval workspace rendering domain/MPS/intent/criteria/descriptors;
- proposed-change controls existing but not silently mutating canonical content;
- approve/submit-changes actions routed to the correct future API contracts;
- authorization and scope boundaries.

## Out of scope

- Implementing UI components.
- Implementing database migrations.
- Implementing API routes or edge functions.
- Implementing e-mail delivery.
- Implementing scoped access runtime behavior.
- Implementing Level 3 approval expansion.
- Implementing published maturity model view.
- Implementing evidence modal harvest/adaptation.

## Lane note

This wave is QA-to-red only. Implementation may start only after QA-to-red has been committed and builder work is delegated against this scope.
