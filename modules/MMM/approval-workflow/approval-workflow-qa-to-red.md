# MMM Approval Workflow DB/API QA-to-Red Contract

Status: QA-to-red pre-build contract
Date: 2026-06-23
Wave: `wave-mmm-approval-db-api-contract-2026-06-23`
CS2 Authority: Johan Ras

## 1. Purpose

This artifact defines failing test expectations for the future implementation of the MMM approval workflow database/API layer.

It is not executable test code yet. It is the QA-to-red contract the next implementation wave must convert into tests before building.

## 2. Test scope

Future QA-to-red tests must cover:

- approval round creation;
- multi-approver invitation;
- invite acceptance and scoped access;
- proposed-change submission;
- comments;
- level 1 accept/reject/edit/apply;
- notification event creation;
- lock transitions;
- level 3 approval prerequisites;
- AI learning event capture;
- authorization failures.

## 3. Required red tests

### T-MMM-APPROVAL-DB-001 — Level 2 round requires domain scope

Given a user attempts to create a level 2 approval round without a `domain_id`,
when `mmm-approval-round-create` is called,
then the API must reject the request and no approval round, approver, invitation, or notification event may be created.

### T-MMM-APPROVAL-DB-002 — Level 3 round blocked before level 2 approval

Given not all domains have required level 2 approval,
when the user attempts to create a level 3 approval round,
then the API must reject the request with a prerequisite failure.

### T-MMM-APPROVAL-DB-003 — Duplicate approver e-mail rejected in same round

Given a user submits two approver entries with the same e-mail for one approval round,
when `mmm-approval-round-create` is called,
then the API must reject the duplicate or return per-approver validation failure before sending invitations.

### T-MMM-APPROVAL-DB-004 — Invitation token stored hashed, not plaintext

Given an invitation is created,
when the invitation record is stored,
then the database contract must store `token_hash` and must not expose a plaintext token field.

### T-MMM-APPROVAL-DB-005 — Expired or revoked invite cannot grant access

Given an invitation is expired or revoked,
when `mmm-approval-invite-accept` is called,
then access must be denied and no approver account binding may occur.

### T-MMM-APPROVAL-DB-006 — Approver cannot edit outside invited scope

Given a level 2 approver is invited to Domain A,
when the approver submits a proposed change for Domain B,
then `mmm-approval-proposed-changes-submit` must reject the change.

### T-MMM-APPROVAL-DB-007 — Proposed edits do not overwrite canonical model content

Given an approver submits a proposed criterion statement change,
when the proposed change is saved,
then the canonical criterion record must remain unchanged until level 1 applies the change.

### T-MMM-APPROVAL-DB-008 — Proposed change captures original snapshot

Given an approver proposes a change,
when it is saved,
then `original_value`, `proposed_value`, `display_reference`, object identifiers, approver id, and round id must be stored.

### T-MMM-APPROVAL-DB-009 — Level 1 accept creates audit and AI learning events

Given level 1 accepts a proposed change,
when `mmm-approval-level1-response-submit` is called,
then the canonical field is updated, audit event is recorded, and an AI learning event is created.

### T-MMM-APPROVAL-DB-010 — Level 1 reject preserves canonical value

Given level 1 rejects a proposed change,
when the response is submitted,
then the canonical field must remain unchanged and rejection reason must be recorded.

### T-MMM-APPROVAL-DB-011 — Level 1 edited apply records final value

Given level 1 edits an approver proposed value before applying,
when the response is submitted,
then the final applied value must differ from the proposed value and both proposed and final values must be retained.

### T-MMM-APPROVAL-DB-012 — Any changes-requested decision blocks all-approved state

Given one approver approves and another submits changes requested,
when the round status is recalculated,
then the round must be `changes_requested`, not `approved_by_all`.

### T-MMM-APPROVAL-DB-013 — All level 2 approvers required for domain lock

Given a level 2 round has multiple required approvers,
when only some approvers approve,
then the domain must not enter `locked_by_level_2`.

### T-MMM-APPROVAL-DB-014 — All level 2 approvers approved creates domain lock

Given all required level 2 approvers approve,
when the last approval is submitted,
then the round becomes `approved_by_all` and a domain lock is created.

### T-MMM-APPROVAL-DB-015 — Level 3 invite creates `level_3_pending`

Given all prerequisite domains have level 2 approval,
when a level 3 approval round is created,
then affected domains/framework state must be representable as `level_3_pending` before final approval.

### T-MMM-APPROVAL-DB-016 — Level 3 proposed changes copy level 2 approvers

Given a level 3 approver proposes changes affecting a domain,
when notifications are generated,
then level 1 receives the actionable notification and the level 2 approvers for the affected domain are copied.

### T-MMM-APPROVAL-DB-017 — Level 3 change creates temporary unlock only for affected items

Given a domain is locked after level 2 approval,
when level 3 requests a change to one criterion,
then only that affected criterion path may enter temporary unlock state.

### T-MMM-APPROVAL-DB-018 — Final approval creates final lock

Given all required level 3 approvers approve,
when the last approval is submitted,
then the framework/control standard enters final lock state and later edits are blocked by this workflow.

### T-MMM-APPROVAL-DB-019 — Notification events are idempotent

Given a notification delivery retry occurs,
when a notification event with the same idempotency key already exists,
then no duplicate logical notification should be queued.

### T-MMM-APPROVAL-DB-020 — Failed notification does not imply approval failure

Given an e-mail send fails,
when approval state is recalculated,
then approval decisions and locks remain based on decisions, while notification delivery status remains failed/retryable.

### T-MMM-APPROVAL-DB-021 — Comments are threaded and visible by allowed scope

Given an approver comments on a proposed change,
when round participants view comments,
then visibility rules must allow only authorized round participants to read the comment.

### T-MMM-APPROVAL-DB-022 — Final-locked object cannot be changed through approval response

Given an object is `locked_by_final_approval`,
when level 1 attempts to apply a proposed change through the approval response API,
then the API must reject the attempt.

## 4. Required non-goals for red tests

The next implementation wave must not write UI tests for invite modals or approval workspaces until the DB/API layer exists.

The next implementation wave must not implement evidence modal harvest, published model UI, or level 3 workspace UI.

## 5. Acceptance criteria

This QA-to-red contract is complete when future builders can convert each test expectation into executable tests against the database/API implementation without inventing missing workflow rules.
