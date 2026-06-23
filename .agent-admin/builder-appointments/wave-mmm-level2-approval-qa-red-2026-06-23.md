# Builder Record - MMM Level 2 Approval QA-to-Red

Wave: `wave-mmm-level2-approval-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-level2-approval-qa-red`
Builder role: `qa-to-red-builder`

## Task

Create QA-to-red coverage for the Level 2 invite modal and Level 2 approval workspace before implementation code is written.

## Required coverage

- Submit-domain-for-approval entry point.
- Multi-approver Level 2 invite modal.
- Approver row add/remove behavior.
- Name, e-mail, and designation validation (plus optional message/due date), with round-level `approval_level: "level_2"` and selected domain scope captured.
- Duplicate e-mail blocking.
- API contract expectations for `mmm-approval-round-create`.
- Notification event expectations.
- Level 2 approval workspace rendering.
- Proposed-change controls.
- Approve and submit-changes action routing.
- Scoped access and authorization boundaries.

## Boundaries

This record allows QA-to-red artifacts only.

Not in scope:

- UI implementation.
- Database migrations.
- API routes or edge functions.
- E-mail delivery.
- Runtime scoped access behavior.
- Level 3 approval.
- Published model view.
- Evidence modal harvest.

## Required output location

```text
modules/MMM/approval-workflow/
```
