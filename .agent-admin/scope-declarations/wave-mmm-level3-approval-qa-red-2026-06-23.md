# MMM Level 3 Approval Expansion QA-to-Red Scope

Wave: `wave-mmm-level3-approval-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-level3-approval-qa-red`
Module scope: MMM Level 3 approval expansion
Lane: QA-to-red / pre-build preparation
CS2 Authority: Johan Ras
Foreman role: scope, assurance, delegation, and QA-to-red coordination

## Objective

Prepare Step 5 of the MMM approval workflow sequence by establishing scope, IAA pre-brief, builder record, and QA-to-red coverage before any implementation code.

This wave covers Step 5 in the CS2-approved sequence:

1. Gap analysis / pre-build alignment for the approval workflow. Completed by PR #1831.
2. Database/API contract for approval rounds, approvers, proposed edits, comments, notifications, and locks. Completed by PR #1833.
3. Level 2 invite modal and approval workspace QA-to-red. Completed by PR #1837.
4. Change summary e-mail and accept/reject/apply flow QA-to-red. Completed by PR #1838.
5. Level 3 approval expansion. This wave prepares QA-to-red before code.

## Authority inputs

- `modules/MMM/approval-workflow/approval-workflow-prebuild-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-db-api-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-notification-lock-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-qa-to-red.md`
- `modules/MMM/approval-workflow/level2-invite-workspace-qa-to-red.md`
- `modules/MMM/approval-workflow/change-summary-accept-reject-apply-qa-to-red.md`
- Uploaded `The Maturity Roadmap(5).docx`
- CS2 instruction to proceed with Step 5 QA-to-red before implementation.

## Bounded file scope for this QA-to-red wave

QA-to-red artifacts may be added under:

- `modules/MMM/approval-workflow/`

Required governance / assurance / delegation records for this wave may be added under:

- `.agent-admin/scope-declarations/`
- `.agent-admin/assurance/`
- `.agent-admin/builder-appointments/`

## Required QA-to-red coverage

This wave must define failing tests for:

- Level 3 invitation only after required Level 2 approvals are complete;
- multi-approver Level 3 invitation;
- full roadmap / control standard approval scope;
- `level_3_pending` state;
- Level 3 approval workspace scope expectations;
- Level 3 proposed changes;
- Level 1 receives actionable Level 3 change request;
- affected Level 2 approvers are copied on Level 3 correspondence;
- copied Level 2 approvers may comment but do not become final approvers;
- temporary unlock of affected locked items only;
- final approval only after all required Level 3 approvers sign off;
- final lock after all required Level 3 approvals;
- notification, audit, and AI learning event expectations;
- authorization boundaries and out-of-scope access denial.

## Out of scope

- Implementing Level 3 UI components.
- Implementing database migrations.
- Implementing API routes or edge functions.
- Implementing e-mail delivery.
- Implementing e-mail templates.
- Implementing runtime scoped access behavior.
- Implementing published maturity model view.
- Implementing evidence modal harvest/adaptation.
- Implementing Level 2 invite/workspace runtime behavior.

## Lane note

This wave is QA-to-red only. Implementation may start only after QA-to-red has been committed and delegated against this scope.
