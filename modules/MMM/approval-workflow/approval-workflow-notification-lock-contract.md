# MMM Approval Workflow Notification and Lock Contract

Status: pre-build contract
Date: 2026-06-23
Wave: `wave-mmm-approval-db-api-contract-2026-06-23`
CS2 Authority: Johan Ras

## 1. Purpose

This artifact expands the notification and lock behavior required by the MMM approval workflow database/API contract.

It is contract-only and does not implement e-mail sending, database migrations, API routes, or UI behavior.

## 2. Notification principles

### 2.1 Notifications are generated from approval events

The system must not send approval e-mails directly from UI click handlers without recording a notification event.

Every notification must be traceable to:

- organisation;
- framework;
- approval round;
- recipient;
- notification type;
- payload;
- idempotency key;
- status.

### 2.2 E-mail and in-app notifications share payload contract

The same structured payload must support:

- e-mail rendering;
- in-app notification rendering;
- audit review;
- retry after failure.

### 2.3 Notification delivery is idempotent

Each logical notification must have an idempotency key so retries do not spam approvers or users.

Recommended idempotency key format:

```text
mmm-approval:{notification_type}:{approval_round_id}:{recipient_email}:{version_or_event_id}
```

## 3. Notification types

### 3.1 `level_2_invitation`

Sent when level 1 submits a domain for level 2 approval.

Required recipients:

- each invited level 2 approver.

Required payload fields:

- `organisation_name`;
- `framework_name`;
- `domain_name`;
- `inviter_name`;
- `approval_level`;
- `invitation_link`;
- `due_date` nullable;
- `message` nullable;
- `mps_count`;
- `criteria_count`;
- `descriptor_count`.

### 3.2 `level_2_changes_submitted`

Sent when one or more level 2 approvers submit proposed changes.

Required recipients:

- level 1 user / compiler.

Required payload fields:

- `domain_name`;
- `approval_round_id`;
- `approver_names`;
- `change_count`;
- `comment_count`;
- `change_summary_items`;
- `review_workspace_link`.

### 3.3 `level_1_response_submitted`

Sent when level 1 accepts, rejects, edits, or applies proposed changes and resubmits.

Required recipients:

- all active level 2 approvers in the round.

Required payload fields:

- `domain_name`;
- `round_number`;
- `accepted_count`;
- `rejected_count`;
- `edited_count`;
- `resubmission_link`;
- `response_summary_items`.

### 3.4 `level_2_all_approved`

Sent when all required level 2 approvers sign off.

Required recipients:

- level 1 user;
- all level 2 approvers.

Required payload fields:

- `domain_name`;
- `approved_by`;
- `approved_at`;
- `lock_state`;
- `next_action`.

### 3.5 `level_3_invitation`

Sent when level 1 invites final approvers after level 2 prerequisite approvals are met.

Required recipients:

- each invited level 3 approver.

Required payload fields:

- `organisation_name`;
- `framework_name`;
- `inviter_name`;
- `approval_level`;
- `invitation_link`;
- `domain_count`;
- `mps_count`;
- `criteria_count`;
- `due_date` nullable;
- `message` nullable.

### 3.6 `level_3_changes_submitted`

Sent when a final approver proposes changes.

Required recipients:

- level 1 user;
- level 2 approvers for affected domains as copied recipients.

Required payload fields:

- `framework_name`;
- `approval_round_id`;
- `final_approver_names`;
- `change_count`;
- `affected_domain_names`;
- `copied_level_2_approvers`;
- `change_summary_items`;
- `review_workspace_link`.

### 3.7 `final_approval_complete`

Sent when all required final approvers sign off.

Required recipients:

- level 1 user;
- level 2 approvers;
- level 3 approvers;
- optional organisation administrators later.

Required payload fields:

- `framework_name`;
- `approved_by`;
- `approved_at`;
- `final_lock_state`;
- `published_model_link` nullable until publication implementation exists.

## 4. Change summary item contract

All change-summary notification payloads must use the same item structure.

```json
{
  "display_reference": "MPS 4 / Criteria 7 / Descriptor: Compliant",
  "object_type": "maturity_descriptor",
  "field_name": "descriptor_text",
  "original_value_excerpt": "There is a policy in place and it is current.",
  "proposed_value_excerpt": "There is an approved policy in place...",
  "comment_excerpt": "Please make ownership explicit.",
  "proposed_change_id": "uuid",
  "status": "proposed"
}
```

Rules:

- Excerpts must be short enough for e-mail but link to full workspace detail.
- Each item must retain precise reference to domain/MPS/criterion/descriptor.
- Level 3 change summaries must include affected domain and copied level 2 approvers.

## 5. Lock principles

### 5.1 Level 1 approval does not lock

Level 1 acceptance confirms user satisfaction with AI-generated content but leaves content editable with audit trail.

### 5.2 Level 2 approval locks a domain

A domain becomes locked only after every required level 2 approver in the active round approves.

Lock scope:

- domain;
- MPS records under domain;
- intent statements under domain/MPS;
- criteria under domain/MPS;
- maturity descriptors under criteria.

### 5.3 Change requests create controlled temporary unlocks

When level 2 or level 3 requests changes, only affected objects become temporarily editable by level 1.

Temporary unlocks must record:

- approval round;
- requested change;
- object scope;
- reason;
- actor;
- timestamp.

### 5.4 Final approval creates final lock

Final approval locks the maturity roadmap/control standard.

Post-final change requires a future change-management workflow and is outside this contract.

## 6. Lock transition matrix

| From | To | Allowed when | Actor/API |
|---|---|---|---|
| `unlocked` | `locked_by_level_2` | all level 2 approvers approved | `mmm-approval-decision-submit` |
| `locked_by_level_2` | `temporarily_unlocked_for_change_request` | level 3 requests changes affecting object | `mmm-approval-proposed-changes-submit` |
| `temporarily_unlocked_for_change_request` | `locked_by_level_2` | level 1 applies/rejects and level 2 confirms or no level 2 reconfirm required | `mmm-approval-level1-response-submit` |
| `locked_by_level_2` | `locked_by_final_approval` | all level 3 approvers approved | `mmm-approval-decision-submit` |
| `temporarily_unlocked_for_change_request` | `locked_by_final_approval` | final approval completed after change loop resolution | `mmm-approval-decision-submit` |

Forbidden transitions:

- `unlocked` directly to `locked_by_final_approval`.
- `locked_by_final_approval` to any editable state in this workflow.
- Any transition without reason and approval round reference.

## 7. Lock conflict rules

If a proposed change targets an object that has changed since proposal:

1. The proposed change must be flagged as conflicted in the later implementation.
2. The system must not auto-apply the change.
3. Level 1 must compare original, proposed, and current values.
4. A new edited value may be applied only with a new audit and AI learning event.

## 8. Copied correspondence rules for level 3

When level 3 proposes changes:

- level 1 receives the actionable notification;
- level 2 approvers for affected domains are copied;
- copied level 2 approvers may comment;
- copied level 2 approvers do not become final approvers unless invited as final approvers;
- comments from copied level 2 approvers are included in the round audit trail.

## 9. Notification failure handling

Required failure behavior for later implementation:

- Failed notification events remain stored with `failed` status.
- Retry creates no duplicate logical notification because idempotency key is reused.
- UI must eventually be able to show notification delivery status.
- Approval state must not become final merely because e-mail delivery succeeded; approval decisions drive state, notification delivery supports communication.

## 10. Acceptance criteria

This notification/lock contract is complete when future builders can implement:

- idempotent notification event creation;
- invitation e-mails;
- change-summary e-mails;
- level 3 copied correspondence;
- lock state transitions;
- temporary unlock behavior;
- conflict handling;
- final lock behavior;
- notification retry logic.
