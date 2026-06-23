# MMM Level 2 Invite Modal and Approval Workspace QA-to-Red

Status: QA-to-red artifact
Date: 2026-06-23
Wave: `wave-mmm-level2-approval-qa-red-2026-06-23`
CS2 Authority: Johan Ras

## 1. Purpose

This artifact defines the failing test expectations for the Level 2 invite modal and Level 2 approval workspace before implementation begins.

It is intentionally pre-code. It does not implement UI, database migrations, API routes, edge functions, e-mail delivery, or runtime access control.

## 2. Authority inputs

- `approval-workflow-prebuild-contract.md`
- `approval-workflow-db-api-contract.md`
- `approval-workflow-notification-lock-contract.md`
- `approval-workflow-qa-to-red.md`
- CS2 instruction to prepare QA-to-red before code for the Level 2 invite/workspace behavior.

## 3. Feature under test

The future Level 2 implementation must allow a level 1 user to submit a completed domain for approval and invite one or more Level 2 approvers.

The invited approver must be able to access a scoped approval workspace for the relevant domain and review:

- domain name and description;
- MPS names and descriptions;
- intent statements;
- criteria;
- maturity descriptors.

The workspace must support proposed-change controls and approval actions without allowing direct canonical overwrites.

## 4. Red tests — Level 1 submit-domain entry point

### T-MMM-L2-INVITE-001 — Submit button hidden until domain has required configuration

Given a domain does not have required MPS, intent statement, criteria, and descriptor content,
when the level 1 user views the domain,
then the Submit Domain for Approval control must be disabled or hidden with a visible reason.

### T-MMM-L2-INVITE-002 — Submit button opens invite modal for eligible domain

Given a domain has required configuration content,
when the level 1 user clicks Submit Domain for Approval,
then a Level 2 approver invite modal must open.

### T-MMM-L2-INVITE-003 — Modal displays selected approval scope summary

Given the invite modal is open,
then it must show the domain name and a summary of included MPS, criteria, and maturity descriptor counts.

## 5. Red tests — Multi-approver modal behavior

### T-MMM-L2-INVITE-004 — Modal supports adding multiple approvers

Given the invite modal is open,
when the user clicks Add approver,
then a new approver row must be added without losing existing row values.

### T-MMM-L2-INVITE-005 — Modal supports removing approver rows

Given the invite modal has multiple approver rows,
when the user removes one row,
then the row is removed and remaining approver values are preserved.

### T-MMM-L2-INVITE-006 — Approver full name is required

Given an approver row has no full name,
when the user submits the modal,
then submission must be blocked and the missing-name row must show a visible validation error.

### T-MMM-L2-INVITE-007 — Approver e-mail is required and must be valid

Given an approver row has a missing or invalid e-mail address,
when the user submits the modal,
then submission must be blocked and the row must show a visible validation error.

### T-MMM-L2-INVITE-008 — Duplicate approver e-mails are blocked

Given two approver rows contain the same e-mail address,
when the user submits the modal,
then submission must be blocked before calling the API.

### T-MMM-L2-INVITE-009 — Designation/scope is captured for each approver

Given a user completes approver rows,
when the modal is submitted,
then each approver payload must include full name, e-mail, approval level, designation/role, and approval scope.

### T-MMM-L2-INVITE-010 — Optional message and due date are preserved

Given the user adds an optional invite message and due date,
when the modal submits,
then the API payload must include the message and due date.

## 6. Red tests — API contract integration

### T-MMM-L2-INVITE-011 — Submit calls `mmm-approval-round-create`

Given the modal is valid,
when the user submits,
then the UI must call the future `mmm-approval-round-create` contract with `approval_level: level_2`, `domain_id`, `framework_id`, `organisation_id`, `submitted_by_user_id`, and approver array.

### T-MMM-L2-INVITE-012 — API success shows invite status per approver

Given `mmm-approval-round-create` returns approval round id, approver ids, and notification event ids,
when the response is received,
then the UI must show successful invitation status and next-step guidance.

### T-MMM-L2-INVITE-013 — API validation errors are visible

Given the API rejects missing domain, duplicate approver, unauthorized submitter, or final-locked target,
when the response is received,
then the UI must show a specific visible error and must not show success.

### T-MMM-L2-INVITE-014 — Notification event expectation is represented

Given the modal submits successfully,
then tests must expect notification event ids to be returned or queued for each invited approver.

## 7. Red tests — Level 2 invitation handoff

### T-MMM-L2-WORKSPACE-001 — Invite link acceptance routes to scoped workspace

Given a Level 2 approver accepts an invitation link,
when invite acceptance succeeds,
then the approver must be routed to a workspace scoped to the invited domain approval round.

### T-MMM-L2-WORKSPACE-002 — Expired or revoked invite blocks workspace access

Given an invitation is expired or revoked,
when the approver attempts to accept the link,
then access must be blocked and a visible error must be shown.

### T-MMM-L2-WORKSPACE-003 — Approver cannot access non-invited domain

Given an approver is invited to Domain A,
when the approver attempts to open Domain B through the approval workspace,
then access must be denied.

## 8. Red tests — Approval workspace rendering

### T-MMM-L2-WORKSPACE-004 — Workspace renders domain summary

Given a Level 2 approver opens the workspace,
then the domain name, domain description, approval status, and submitting user must be visible.

### T-MMM-L2-WORKSPACE-005 — Workspace renders MPS list

Given the domain contains MPS records,
then each MPS name and description must be visible in the approval workspace.

### T-MMM-L2-WORKSPACE-006 — Workspace renders intent statements

Given an MPS has an intent statement,
then the intent statement must be visible under its MPS.

### T-MMM-L2-WORKSPACE-007 — Workspace renders criteria under the correct MPS

Given an MPS has criteria,
then each criterion must render under the correct MPS and display its sequence/reference.

### T-MMM-L2-WORKSPACE-008 — Workspace renders maturity descriptors per criterion

Given a criterion has maturity descriptors,
then descriptor text must render per maturity level and remain linked to the criterion reference.

### T-MMM-L2-WORKSPACE-009 — Workspace preserves reference context

Given an approver views or acts on an item,
then the UI must preserve display references such as `MPS 2 / Criteria 5 / Descriptor: Compliant`.

## 9. Red tests — Proposed-change controls

### T-MMM-L2-WORKSPACE-010 — Proposed-change control exists for editable fields

Given an approver reviews domain, MPS, intent, criterion, or descriptor text,
then the workspace must expose a propose-change control for that field.

### T-MMM-L2-WORKSPACE-011 — Proposed change does not mutate canonical content

Given an approver proposes a change,
when the change is saved,
then canonical domain/MPS/criteria/descriptor content must remain unchanged until level 1 accepts/applies it.

### T-MMM-L2-WORKSPACE-012 — Proposed change captures original and proposed values

Given an approver proposes a change,
then the future API payload must include object type, object id, field name, display reference, original value, proposed value, and comment.

### T-MMM-L2-WORKSPACE-013 — Proposed change requires proposed value

Given an approver attempts to submit an empty proposed value,
then submission must be blocked with visible validation.

### T-MMM-L2-WORKSPACE-014 — Proposed changes can be reviewed before submission

Given an approver has staged proposed changes,
when they review the submission summary,
then all proposed changes and comments must be visible before final submit.

## 10. Red tests — Approval and submit-changes actions

### T-MMM-L2-WORKSPACE-015 — Approver can submit proposed changes

Given an approver has one or more proposed changes,
when they click Submit Changes,
then the workspace must call the future `mmm-approval-proposed-changes-submit` contract.

### T-MMM-L2-WORKSPACE-016 — Submit changes queues level 1 notification expectation

Given proposed changes are submitted,
then the response expectation must include a notification event for the level 1 user.

### T-MMM-L2-WORKSPACE-017 — Approver can approve with no pending proposed changes

Given an approver has no pending proposed changes,
when they click Approve,
then the workspace must call the future `mmm-approval-decision-submit` contract with decision `approved`.

### T-MMM-L2-WORKSPACE-018 — Approve is blocked with unsent proposed changes

Given an approver has staged but unsubmitted proposed changes,
when they click Approve,
then approval must be blocked or require explicit discard/submit decision.

### T-MMM-L2-WORKSPACE-019 — Partial approvals do not lock the domain

Given multiple Level 2 approvers exist and only one approves,
then tests must expect the domain not to enter `locked_by_level_2` until all required approvers approve.

## 11. Red tests — Error and boundary states

### T-MMM-L2-WORKSPACE-020 — Loading failure is visible

Given workspace data fails to load,
then the approver must see a visible error and retry option.

### T-MMM-L2-WORKSPACE-021 — Empty domain data blocks approval

Given the workspace has missing required domain/MPS/criteria/descriptor data,
then approval must be blocked with a visible reason.

### T-MMM-L2-WORKSPACE-022 — Unauthorized user cannot submit changes

Given a user is not an approver in the active round,
when they attempt to submit proposed changes,
then the API expectation must reject the action and UI must show access denied.

### T-MMM-L2-WORKSPACE-023 — Final-locked domains cannot be submitted for Level 2 approval

Given a domain/framework is final locked,
when a level 1 user attempts to submit it for Level 2 approval,
then the UI/API expectation must block the request.

## 12. Non-goals for this QA-to-red wave

The future implementation wave must not use these tests to implement:

- Level 3 approval workspace;
- final approval workflow;
- published maturity model view;
- evidence management modal;
- MAT evidence harvest;
- production e-mail delivery beyond notification event expectations.

## 13. Acceptance criteria for this QA-to-red artifact

This artifact is complete when a future builder can convert these expectations into executable failing tests before implementing:

- Level 2 submit-domain invite modal;
- multi-approver validation;
- Level 2 approver workspace;
- proposed-change controls;
- approval/changes action routing;
- scoped access boundaries.
