# MMM Change Summary Email and Accept/Reject/Apply QA-to-Red

Status: QA-to-red artifact
Date: 2026-06-23
Wave: `wave-mmm-change-summary-qa-red-2026-06-23`
CS2 Authority: Johan Ras

## 1. Purpose

This artifact defines failing test expectations for Step 4 of the MMM approval workflow: change summary e-mail and level 1 accept/reject/edit/apply response flow.

It is intentionally pre-code. It does not implement e-mail delivery, e-mail templates, UI, database migrations, API routes, edge functions, or runtime behavior.

## 2. Authority inputs

- `approval-workflow-prebuild-contract.md`
- `approval-workflow-db-api-contract.md`
- `approval-workflow-notification-lock-contract.md`
- `approval-workflow-qa-to-red.md`
- `level2-invite-workspace-qa-to-red.md`
- CS2 instruction to proceed with Step 4 using QA-to-red before implementation.

## 3. Feature under test

When a Level 2 approver submits proposed changes, the level 1 user must receive a clear change summary. The summary must identify exactly what was changed, where it sits in the maturity model, who proposed it, and what action the level 1 user can take.

The level 1 user must be able to:

- accept a proposed change;
- reject a proposed change with a reason;
- edit the proposed value and apply a final value;
- request clarification;
- add a reply comment;
- resubmit to active Level 2 approvers.

Canonical maturity model content must not change until level 1 applies a change.

## 4. Red tests — Change summary generation

### T-MMM-CHANGE-SUMMARY-001 — Summary generated when Level 2 submits proposed changes

Given a Level 2 approver submits one or more proposed changes,
when the proposed changes are accepted by the future change-summary service,
then a level 1 change summary payload must be generated.

### T-MMM-CHANGE-SUMMARY-002 — Summary contains approval round context

Given a change summary is generated,
then it must include approval round id, approval level, organisation id, framework id, domain id, domain name, and submitting approver details.

### T-MMM-CHANGE-SUMMARY-003 — Summary includes change count and comment count

Given a change summary is generated,
then it must include the number of proposed changes and comments included in the summary.

### T-MMM-CHANGE-SUMMARY-004 — Summary groups changes by object type

Given proposed changes include domain, MPS, intent statement, criterion, and descriptor fields,
then the summary must group or label changes by object type.

### T-MMM-CHANGE-SUMMARY-005 — Summary preserves exact display reference

Given a proposed change targets a maturity descriptor,
then the summary item must preserve a display reference such as `MPS 4 / Criteria 7 / Descriptor: Compliant`.

### T-MMM-CHANGE-SUMMARY-006 — Summary includes original and proposed values

Given a proposed change is summarized,
then the summary item must include original value excerpt and proposed value excerpt.

### T-MMM-CHANGE-SUMMARY-007 — Summary includes approver comment

Given a proposed change has an approver comment,
then the summary item must include that comment or a short excerpt with a link to full detail.

### T-MMM-CHANGE-SUMMARY-008 — Summary supports multiple approvers

Given multiple Level 2 approvers submit proposed changes in the same round,
then the summary must identify which approver proposed each change.

### T-MMM-CHANGE-SUMMARY-009 — Summary handles no-change approval separately

Given an approver approves with no changes,
then the summary must not invent change items and must record the approval decision separately from proposed-change summaries.

## 5. Red tests — E-mail payload expectations

### T-MMM-EMAIL-SUMMARY-001 — Level 1 notification event is queued

Given Level 2 proposed changes are submitted,
then a `level_2_changes_submitted` notification event must be queued for the level 1 user.

### T-MMM-EMAIL-SUMMARY-002 — Notification event uses idempotency key

Given the same logical summary event is generated more than once,
then the notification event must use an idempotency key to avoid duplicate logical e-mails.

### T-MMM-EMAIL-SUMMARY-003 — Payload contains review workspace link

Given the e-mail summary payload is generated,
then it must include a link to the level 1 review workspace for the approval round.

### T-MMM-EMAIL-SUMMARY-004 — Payload includes all summary items

Given an approver submitted multiple proposed changes,
then the e-mail payload must include all summary items or an explicit truncation rule with link to full summary.

### T-MMM-EMAIL-SUMMARY-005 — Payload excludes unauthorized data

Given the summary is generated for a domain approval round,
then the e-mail payload must not include data from unrelated domains or frameworks.

### T-MMM-EMAIL-SUMMARY-006 — Failed e-mail delivery does not alter approval state

Given e-mail delivery later fails,
then approval round state must remain driven by approval decisions and proposed-change status, not delivery status.

## 6. Red tests — Level 1 accept flow

### T-MMM-L1-RESPONSE-001 — Accept applies proposed value

Given a level 1 user accepts a proposed change,
when the future `mmm-approval-level1-response-submit` contract processes the response,
then the canonical target field must be updated to the proposed value.

### T-MMM-L1-RESPONSE-002 — Accept records status and timestamp

Given a level 1 user accepts a proposed change,
then the proposed change status must become `accepted` or `applied` according to implementation convention, and applied timestamp must be recorded.

### T-MMM-L1-RESPONSE-003 — Accept creates audit event

Given a level 1 user accepts a proposed change,
then an audit event must record actor, action, target object, original value, proposed value, final value, and timestamp.

### T-MMM-L1-RESPONSE-004 — Accept creates AI learning event

Given a level 1 user accepts a proposed change,
then an AI learning event must capture organisation id, object context, original value, proposed value, final value, decision `accepted`, actor role, and timestamp.

## 7. Red tests — Level 1 reject flow

### T-MMM-L1-RESPONSE-005 — Reject requires reason

Given a level 1 user rejects a proposed change,
when no reason is provided,
then the response must be blocked with a visible validation failure.

### T-MMM-L1-RESPONSE-006 — Reject does not mutate canonical content

Given a level 1 user rejects a proposed change,
then the canonical target field must remain unchanged.

### T-MMM-L1-RESPONSE-007 — Reject records reason and status

Given a level 1 user rejects a proposed change with a reason,
then the proposed change status and level 1 response reason must be recorded.

### T-MMM-L1-RESPONSE-008 — Reject creates AI learning event

Given a level 1 user rejects a proposed change,
then an AI learning event must capture decision `rejected`, original value, proposed value, final value unchanged, reason, actor role, and timestamp.

## 8. Red tests — Level 1 edit and apply flow

### T-MMM-L1-RESPONSE-009 — Edit/apply requires final value

Given a level 1 user chooses edit/apply,
when final value is empty,
then the response must be blocked with validation.

### T-MMM-L1-RESPONSE-010 — Edit/apply preserves original, proposed, and final values

Given a level 1 user edits a proposed value before applying,
then the proposed-change record must retain original value, approver proposed value, and level 1 final value.

### T-MMM-L1-RESPONSE-011 — Edit/apply updates canonical content to final value

Given a level 1 user edits and applies a proposed change,
then the canonical target field must be updated to the final value, not necessarily the approver proposed value.

### T-MMM-L1-RESPONSE-012 — Edit/apply creates AI learning event

Given a level 1 user edits and applies a proposed change,
then an AI learning event must capture decision `edited`, original value, proposed value, final value, reason/comment, actor role, and timestamp.

## 9. Red tests — Clarification and comments

### T-MMM-L1-RESPONSE-013 — Request clarification does not mutate canonical content

Given a level 1 user requests clarification on a proposed change,
then canonical content must remain unchanged.

### T-MMM-L1-RESPONSE-014 — Request clarification creates comment

Given a level 1 user requests clarification,
then a comment must be created on the proposed change or approval round with author role `level_1`.

### T-MMM-L1-RESPONSE-015 — Reply comment is visible to active Level 2 approvers

Given a level 1 user adds a reply comment,
then active Level 2 approvers in the round must be able to view it according to comment visibility rules.

### T-MMM-L1-RESPONSE-016 — Comment-only response can be sent without applying changes

Given level 1 responds with comments only,
then the system must allow comment submission without mutating canonical content.

## 10. Red tests — Resubmission to Level 2 approvers

### T-MMM-L1-RESUBMIT-001 — Resubmit notifies active Level 2 approvers

Given level 1 has responded to proposed changes and chooses resubmit,
then notification events must be queued for all active Level 2 approvers in the approval round.

### T-MMM-L1-RESUBMIT-002 — Resubmission summary includes response counts

Given resubmission occurs,
then the approver notification payload must include accepted, rejected, edited, clarification, and comment counts.

### T-MMM-L1-RESUBMIT-003 — Resubmission preserves round linkage

Given a resubmission creates a new approval round or updates the current round,
then the response must preserve linkage to the previous round and proposed changes.

### T-MMM-L1-RESUBMIT-004 — Resubmission does not notify replaced or expired approvers

Given approvers are replaced or expired,
then resubmission notifications must go only to active Level 2 approvers.

## 11. Red tests — Conflict and boundary handling

### T-MMM-L1-CONFLICT-001 — Changed canonical value blocks silent apply

Given canonical content changed after a proposed change was created,
when level 1 attempts to apply that proposed change,
then the system must block silent apply and require conflict resolution.

### T-MMM-L1-CONFLICT-002 — Conflict resolution records all values

Given level 1 resolves a conflict by applying a final edited value,
then original, proposed, current, and final values must be available for audit or conflict record.

### T-MMM-L1-CONFLICT-003 — Final-locked content cannot be changed

Given a target object is `locked_by_final_approval`,
when level 1 tries to accept or edit/apply a proposed change,
then the response must be rejected.

### T-MMM-L1-CONFLICT-004 — Unauthorized user cannot respond

Given a user is not the authorized level 1 submitter or permitted owner,
when they attempt to respond to proposed changes,
then the future API must reject the action.

## 12. Red tests — UI state expectations for future implementation

### T-MMM-L1-UI-001 — Level 1 sees pending response queue

Given proposed changes are waiting for level 1 action,
then the future UI must show a pending response queue grouped by affected object and approver.

### T-MMM-L1-UI-002 — Level 1 can act on each change independently

Given multiple proposed changes exist,
then level 1 must be able to accept one, reject one, edit/apply one, and request clarification on one before resubmitting.

### T-MMM-L1-UI-003 — Bulk submit validates unresolved required responses

Given level 1 attempts to resubmit while required proposed changes remain unaddressed,
then the UI/API expectation must block resubmission or clearly mark unresolved items.

## 13. Non-goals for this QA-to-red wave

The future implementation wave must not use these tests to implement:

- Level 3 approval expansion;
- final approval workflow;
- published maturity model view;
- evidence management modal;
- MAT evidence harvest;
- production e-mail delivery beyond notification event expectations.

## 14. Acceptance criteria for this QA-to-red artifact

This artifact is complete when a future builder can convert these expectations into executable failing tests before implementing:

- change summary payload generation;
- level 1 summary notification event creation;
- accept/reject/edit/apply response flow;
- clarification/comment response flow;
- resubmission notification behavior;
- audit and AI learning event capture;
- canonical content non-overwrite until apply;
- conflict and final-lock protections.
