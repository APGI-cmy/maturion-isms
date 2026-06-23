# MMM Evidence Modal Harvest/Adaptation QA-to-Red Scope

Wave: `wave-mmm-evidence-modal-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-evidence-modal-qa-red`
Module scope: MMM evidence modal harvest/adaptation from MAT
Lane: QA-to-red / pre-build preparation
CS2 Authority: Johan Ras
Foreman role: scope, assurance, delegation, and QA-to-red coordination

## Objective

Prepare Step 7 of the MMM approval workflow sequence by establishing scope, IAA pre-brief, builder record, and QA-to-red coverage before any implementation code.

This wave covers Step 7 in the CS2-approved sequence:

1. Gap analysis / pre-build alignment for the approval workflow. Completed by PR #1831.
2. Database/API contract for approval rounds, approvers, proposed edits, comments, notifications, and locks. Completed by PR #1833.
3. Level 2 invite modal and approval workspace QA-to-red. Completed by PR #1837.
4. Change summary e-mail and accept/reject/apply flow QA-to-red. Completed by PR #1838.
5. Level 3 approval expansion QA-to-red. Completed by PR #1840.
6. Published maturity model view QA-to-red. Completed by PR #1842.
7. Evidence modal harvest/adaptation from MAT. This wave prepares QA-to-red before code.

## Authority inputs

- `modules/MMM/approval-workflow/approval-workflow-prebuild-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-db-api-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-notification-lock-contract.md`
- `modules/MMM/approval-workflow/approval-workflow-qa-to-red.md`
- `modules/MMM/approval-workflow/level2-invite-workspace-qa-to-red.md`
- `modules/MMM/approval-workflow/change-summary-accept-reject-apply-qa-to-red.md`
- `modules/MMM/approval-workflow/level3-approval-expansion-qa-to-red.md`
- `modules/MMM/approval-workflow/published-model-view-qa-to-red.md`
- `modules/mat/frontend/src/components/evidence/EvidenceUploadPanel.tsx`
- Uploaded `The Maturity Roadmap(5).docx`
- CS2 instruction to proceed with Step 7 QA-to-red before implementation.

## Bounded file scope for this QA-to-red wave

QA-to-red artifacts may be added under:

- `modules/MMM/approval-workflow/`

Required governance / assurance / delegation records for this wave may be added under:

- `.agent-admin/scope-declarations/`
- `.agent-admin/assurance/`
- `.agent-admin/builder-appointments/`

## Required QA-to-red coverage

This wave must define failing tests for:

- MAT evidence source identification;
- evidence modal entry from a published criterion card;
- criterion-linked context preservation;
- document/URL upload expectation;
- photo/image upload expectation;
- video upload expectation;
- voice note/audio upload expectation;
- spreadsheet/file upload expectation;
- text findings expectation;
- remove/replace controls;
- mobile capture expectations;
- direct camera/photo/video capture expectations;
- evidence storage path context;
- evidence list rendering;
- AI evidence evaluation placeholder;
- evidence re-evaluation placeholder;
- PIT/risk/incident data-link placeholders;
- authorization/read-only boundaries;
- non-mutation of final-approved maturity model content;
- no evidence runtime implementation in this QA-to-red wave.

## Out of scope

- Implementing evidence modal runtime behavior.
- Implementing file upload runtime behavior.
- Implementing storage adapters.
- Implementing camera/audio/video capture runtime behavior.
- Implementing AI evidence evaluation runtime behavior.
- Implementing PIT/risk/incident integrations.
- Implementing database migrations.
- Implementing API routes or edge functions.
- Implementing published model UI runtime behavior.
- Implementing approval workflow runtime behavior.

## Lane note

This wave is QA-to-red only. Implementation may start only after QA-to-red has been committed and delegated against this scope.
