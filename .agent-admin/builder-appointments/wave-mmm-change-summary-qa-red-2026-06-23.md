# Builder Record - MMM Change Summary QA-to-Red

Wave: `wave-mmm-change-summary-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-change-summary-qa-red`
Builder role: `qa-to-red-builder`

## Task

Create QA-to-red coverage for Step 4: change summary e-mail and level 1 accept/reject/edit/apply response flow before implementation code is written.

## Required coverage

- Proposed-change summary generation.
- Level 1 e-mail summary payload expectations.
- Exact display references for domain, MPS, intent, criterion, and descriptor changes.
- Grouping and counts for approvers, changes, comments, and affected objects.
- Accept proposed change.
- Reject proposed change with reason.
- Edit proposed value and apply a final value.
- Request clarification.
- Add reply comment.
- Resubmit to active Level 2 approvers.
- Notification event expectations.
- Audit event expectations.
- AI learning event expectations.
- Canonical non-overwrite before level 1 applies a change.
- Conflict handling.

## Boundaries

This record allows QA-to-red artifacts only.

Not in scope:

- UI implementation.
- Database migrations.
- API routes or edge functions.
- E-mail delivery.
- E-mail templates.
- Runtime scoped access behavior.
- Level 3 approval.
- Published model view.
- Evidence modal harvest.

## Required output location

```text
modules/MMM/approval-workflow/
```
