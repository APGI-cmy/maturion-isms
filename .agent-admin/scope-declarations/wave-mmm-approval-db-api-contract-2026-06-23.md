# MMM Approval Workflow DB/API Contract Scope

Wave: `wave-mmm-approval-db-api-contract-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-approval-db-api-contract`
Module scope: MMM approval workflow database and API contract
Lane: pre-build / contract specification
CS2 Authority: Johan Ras
Foreman role: scope, alignment, and traceability only

## Objective

Define the database and API contract for MMM approval workflow implementation after approval workflow gap alignment has been merged.

This wave covers step 2 in the CS2-approved sequence:

1. Gap analysis / pre-build alignment for the approval workflow. Completed by PR #1831.
2. Database/API contract for approval rounds, approvers, proposed edits, comments, notifications, and locks. This wave.
3. Level 2 invite modal and approval workspace.
4. Change summary email and accept/reject/apply flow.
5. Level 3 approval expansion.
6. Published maturity model view.
7. Evidence modal harvest/adaptation from MAT.

## Authority inputs

- `modules/MMM/approval-workflow/approval-workflow-gap-analysis.md`
- `modules/MMM/approval-workflow/approval-workflow-prebuild-contract.md`
- Uploaded `The Maturity Roadmap(5).docx`
- CS2 approval sequence instruction from 2026-06-23

## Bounded file scope

Pre-build contract artifacts may be added under:

- `modules/MMM/approval-workflow/`

Required governance / assurance records for this wave may be added under:

- `.agent-admin/scope-declarations/`
- `.agent-admin/assurance/`

## Required outputs

This wave must define:

- approval round record contract;
- approver invitation/access record contract;
- proposed edit object contract;
- comment/thread contract;
- notification event contract;
- lock state and lock transition contract;
- AI learning event contract;
- API / edge-function names, request payloads, responses, and failure modes;
- QA-to-red tests for the later build.

## Out of scope

- Creating database migrations.
- Implementing API routes or edge functions.
- Implementing e-mail delivery.
- Implementing UI components.
- Implementing approval workspace behavior.
- Implementing published maturity model view.
- Implementing MAT evidence harvest.

## Lane note

This is a pre-build contract wave. It creates implementation-ready contracts but does not build the capability.
