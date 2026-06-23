# MMM Approval Workflow Pre-Build Scope

Wave: `wave-mmm-approval-workflow-prebuild-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-approval-workflow-prebuild`
Module scope: MMM approval workflow pre-build alignment
Lane: pre-build / specification alignment
CS2 Authority: Johan Ras
Foreman role: scope, alignment, and traceability only

## Objective

Align MMM pre-build artifacts with the next product development sequence for approval workflows after maturity descriptor generation.

The required sequence is:

1. Gap analysis / pre-build alignment for the approval workflow.
2. Database/API contract for approval rounds, approvers, proposed edits, comments, notifications, and locks.
3. Level 2 invite modal and approval workspace.
4. Change summary email and accept/reject/apply flow.
5. Level 3 approval expansion.
6. Published maturity model view.
7. Evidence modal harvest/adaptation from MAT.

This wave addresses item 1 only and prepares bounded acceptance contracts for item 2 onward.

## Authority inputs

- CS2 instruction in chat on 2026-06-23.
- Uploaded `The Maturity Roadmap(5).docx`.
- Existing MMM FRS and UX workflow artifacts.
- Existing MAT evidence upload panel harvest source.

## Bounded file scope

Pre-build alignment artifacts may be added under:

- `modules/MMM/approval-workflow/`

No runtime app code, database migrations, edge functions, e-mail implementation, or UI component implementation is in scope for this wave.

## Output expectation

This wave must produce a gap analysis and a pre-build functional contract covering:

- level 1 / level 2 / level 3 approval states;
- multi-approver invitation model;
- proposed change capture and highlighting;
- e-mail summary requirements;
- accept / reject / edit / apply flows;
- lock and unlock rules;
- AI learning capture;
- evidence modal harvest plan from MAT;
- implementation sequencing and acceptance criteria for future build waves.

## Out of scope

- Implementing the approval modal.
- Implementing database tables or API routes.
- Implementing e-mail delivery.
- Implementing level 2 or level 3 workspaces.
- Implementing published maturity model view.
- Implementing evidence modal harvest.

## Lane note

This is a pre-build alignment wave. It does not assert implementation readiness for any subsequent build step until QA-to-red and builder appointment are established for that step.
