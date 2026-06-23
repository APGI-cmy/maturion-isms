# MMM Published Maturity Model View QA-to-Red Scope

Wave: `wave-mmm-published-model-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-published-model-qa-red`
Module scope: MMM published maturity model view
Lane: QA-to-red / pre-build preparation
CS2 Authority: Johan Ras
Foreman role: scope, assurance, delegation, and QA-to-red coordination

## Objective

Prepare Step 6 of the MMM approval workflow sequence by establishing scope, IAA pre-brief, builder record, and QA-to-red coverage before any implementation code.

This wave covers Step 6 in the CS2-approved sequence:

1. Gap analysis / pre-build alignment for the approval workflow. Completed by PR #1831.
2. Database/API contract for approval rounds, approvers, proposed edits, comments, notifications, and locks. Completed by PR #1833.
3. Level 2 invite modal and approval workspace QA-to-red. Completed by PR #1837.
4. Change summary e-mail and accept/reject/apply flow QA-to-red. Completed by PR #1838.
5. Level 3 approval expansion QA-to-red. Completed by PR #1840.
6. Published maturity model view. This wave prepares QA-to-red before code.

## Authority inputs

- `modules/MMM/approval-workflow/approval-workflow-prebuild-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-db-api-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-notification-lock-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-qa-to-red.md`
- `modules/MMM/approval-workflow/level2-invite-workspace-qa-to-red.md`
- `modules/MMM/approval-workflow/change-summary-accept-reject-apply-qa-to-red.md`
- `modules/MMM/approval-workflow/level3-approval-expansion-qa-to-red.md`
- Uploaded `The Maturity Roadmap(5).docx`
- CS2 instruction to proceed with Step 6 QA-to-red before implementation.

## Bounded file scope for this QA-to-red wave

QA-to-red artifacts may be added under:

- `modules/MMM/approval-workflow/`

Required governance / assurance / delegation records for this wave may be added under:

- `.agent-admin/scope-declarations/`
- `.agent-admin/assurance/`
- `.agent-admin/builder-appointments/`

## Required QA-to-red coverage

This wave must define failing tests for:

- final-approved / final-locked model visibility;
- published model route or entry point;
- read-only post-final-lock behavior;
- collapsible MPS-first view;
- drilldown from MPS to intent statement to criteria to descriptors;
- criterion cards;
- current maturity level tab;
- next maturity level tab;
- maturity descriptor modal;
- evidence management entry point placeholder;
- AI question interface placeholder;
- domain to MPS to criterion to descriptor traceability;
- authorization boundaries for published model access;
- empty/loading/error states;
- no mutation of final-approved model content from published view.

## Out of scope

- Implementing published model UI components.
- Implementing database migrations.
- Implementing API routes or edge functions.
- Implementing evidence management modal.
- Implementing MAT evidence harvest/adaptation.
- Implementing AI question runtime behavior.
- Implementing maturity scoring or evidence scoring.
- Implementing approval workflow runtime behavior.

## Lane note

This wave is QA-to-red only. Implementation may start only after QA-to-red has been committed and delegated against this scope.
