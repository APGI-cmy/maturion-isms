# MMM Approval Workflow DB/API Contract

Status: pre-build contract
Date: 2026-06-23
Wave: `wave-mmm-approval-db-api-contract-2026-06-23`
CS2 Authority: Johan Ras

## 1. Purpose

This artifact defines the database and API contract for the MMM approval workflow.

It is contract-only. It does not create database migrations, API routes, edge functions, e-mail delivery code, or UI components.

The contract implements Step 2 after the merged approval workflow pre-build alignment.

## 2. Contract principles

### 2.1 Proposed edits must not overwrite canonical content

Approvers must never directly overwrite domain, MPS, intent, criteria, or descriptor records.

All approver edits are stored as proposed changes until the level 1 user accepts, rejects, edits, or applies them through the controlled loop.

### 2.2 Approval state and lock state are separate

Approval state describes where the item is in the workflow.

Lock state controls whether level 1 can edit canonical content outside the controlled approval loop.

### 2.3 Notifications must be event-backed

Every e-mail or in-app notification must be backed by a notification event record so delivery can be retried, audited, and made idempotent.

### 2.4 AI learning capture must be organisation-specific

Every decision that accepts, rejects, edits, supersedes, or applies a proposed change must produce an AI learning event linked to the organisation and model context.

## 3. Proposed database record contracts

The following table contracts define required logical records. They may later be implemented as Supabase tables, views, or equivalent storage structures.

## 4. `mmm_approval_rounds`

Represents one approval round for a domain or full roadmap.

### Required fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Primary key. |
| `organisation_id` | uuid | yes | Organisation owning the model. |
| `framework_id` | uuid | yes | Maturity framework / roadmap id. |
| `domain_id` | uuid nullable | conditional | Required for level 2 domain approval. Null allowed for level 3 full-roadmap approval. |
| `approval_level` | enum | yes | `level_2` or `level_3`. Level 1 is component acceptance, not an approval round. |
| `round_number` | integer | yes | Incremented per resubmission loop. |
| `status` | enum | yes | See status enum below. |
| `submitted_by_user_id` | uuid | yes | Level 1 user who initiated round. |
| `submitted_at` | timestamptz | yes | Round submission timestamp. |
| `resubmitted_from_round_id` | uuid nullable | no | Prior round if this is a resubmission. |
| `all_approvers_required` | boolean | yes | Default true. |
| `created_at` | timestamptz | yes | Audit timestamp. |
| `updated_at` | timestamptz | yes | Audit timestamp. |

### Status enum

`mmm_approval_round_status`:

- `draft`
- `invited`
- `in_review`
- `changes_requested`
- `resubmitted`
- `approved_by_some`
- `approved_by_all`
- `cancelled`
- `superseded`

### Required invariants

- A level 2 round must have `domain_id`.
- A level 3 round may cover the full framework and may leave `domain_id` null.
- A round reaches `approved_by_all` only when every required approver has an approval decision on the current round.
- If any required approver requests changes, the round status becomes `changes_requested`.
- Superseded rounds remain immutable.

## 5. `mmm_approval_approvers`

Represents an invited approver in a round.

### Required fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Primary key. |
| `approval_round_id` | uuid | yes | Parent round. |
| `organisation_id` | uuid | yes | Organisation context. |
| `user_id` | uuid nullable | no | Set after invitee signs up or links account. |
| `email` | text | yes | Invitation e-mail. |
| `full_name` | text | yes | Invite modal value. |
| `designation` | text nullable | no | Role/title/designation. |
| `approval_level` | enum | yes | Mirrors parent round. |
| `status` | enum | yes | See approver status enum. |
| `invited_by_user_id` | uuid | yes | Level 1 user or authorized inviter. |
| `invited_at` | timestamptz | yes | Invite timestamp. |
| `accepted_invite_at` | timestamptz nullable | no | Signup/access acceptance. |
| `decision` | enum nullable | no | Latest decision. |
| `decision_at` | timestamptz nullable | no | Latest decision timestamp. |
| `decision_comment` | text nullable | no | Approval/change summary comment. |
| `created_at` | timestamptz | yes | Audit timestamp. |
| `updated_at` | timestamptz | yes | Audit timestamp. |

### Approver status enum

`mmm_approval_approver_status`:

- `invited`
- `invite_accepted`
- `in_review`
- `changes_submitted`
- `approved`
- `declined`
- `replaced`
- `expired`

### Decision enum

`mmm_approval_decision`:

- `approved`
- `changes_requested`
- `declined`

### Required invariants

- The same email cannot appear twice in the same round unless a prior approver record is `replaced` or `expired`.
- Approver write access is scoped to the approval round and invited object scope.
- A level 3 approver cannot be invited until the prerequisite level 2 approval condition is satisfied.

## 6. `mmm_approval_invitations`

Tracks invite token lifecycle separately from approver identity.

### Required fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Primary key. |
| `approval_round_id` | uuid | yes | Parent round. |
| `approver_id` | uuid | yes | Invited approver. |
| `email` | text | yes | Target e-mail. |
| `token_hash` | text | yes | Store hash only. |
| `status` | enum | yes | See invitation status enum. |
| `expires_at` | timestamptz | yes | Expiration. |
| `sent_at` | timestamptz nullable | no | First send timestamp. |
| `accepted_at` | timestamptz nullable | no | Invite accepted timestamp. |
| `revoked_at` | timestamptz nullable | no | Invite revoked timestamp. |
| `created_at` | timestamptz | yes | Audit timestamp. |

### Invitation status enum

`mmm_approval_invitation_status`:

- `pending_send`
- `sent`
- `accepted`
- `expired`
- `revoked`
- `failed`

### Required invariants

- Token values must not be stored in plaintext.
- Invitation acceptance must bind the approver record to a user account or scoped guest access record.
- Revoked/expired invitations must not grant access.

## 7. `mmm_approval_proposed_changes`

Stores approver-suggested edits.

### Required fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Primary key. |
| `approval_round_id` | uuid | yes | Parent round. |
| `approver_id` | uuid | yes | Proposing approver. |
| `organisation_id` | uuid | yes | Organisation context. |
| `framework_id` | uuid | yes | Framework context. |
| `domain_id` | uuid nullable | no | Domain context if applicable. |
| `mps_id` | uuid nullable | no | MPS context if applicable. |
| `criterion_id` | uuid nullable | no | Criteria context if applicable. |
| `descriptor_id` | uuid nullable | no | Maturity descriptor context if applicable. |
| `object_type` | enum | yes | See object type enum. |
| `object_id` | uuid | yes | Target object id. |
| `field_name` | text | yes | Field proposed for change. |
| `display_reference` | text | yes | Human reference for e-mail/UI. |
| `original_value` | text | yes | Snapshot value at time proposed. |
| `proposed_value` | text | yes | Approver proposed value. |
| `comment` | text nullable | no | Approver reason/comment. |
| `status` | enum | yes | See proposed change status enum. |
| `level_1_response` | text nullable | no | Accept/reject/edit response. |
| `final_value` | text nullable | no | Value applied if accepted or edited. |
| `applied_by_user_id` | uuid nullable | no | Level 1 actor. |
| `applied_at` | timestamptz nullable | no | Apply timestamp. |
| `created_at` | timestamptz | yes | Audit timestamp. |
| `updated_at` | timestamptz | yes | Audit timestamp. |

### Object type enum

`mmm_approval_object_type`:

- `domain`
- `mps`
- `intent_statement`
- `criterion`
- `maturity_descriptor`

### Proposed change status enum

`mmm_approval_proposed_change_status`:

- `proposed`
- `accepted`
- `edited_by_level_1`
- `rejected`
- `applied`
- `superseded`

### Required invariants

- Proposed changes are immutable after submission except status/response/final application fields.
- `original_value` must be captured at proposal time.
- Applying a change must create audit and AI learning events.
- A proposed change must not apply if its target object has changed since proposal unless conflict resolution is performed.

## 8. `mmm_approval_comments`

Stores threaded comments attached to rounds or proposed changes.

### Required fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Primary key. |
| `approval_round_id` | uuid | yes | Parent round. |
| `proposed_change_id` | uuid nullable | no | Optional target proposed change. |
| `parent_comment_id` | uuid nullable | no | Threading. |
| `author_user_id` | uuid | yes | Comment author. |
| `author_role` | enum | yes | `level_1`, `level_2`, `level_3`, `system`. |
| `body` | text | yes | Comment body. |
| `visibility` | enum | yes | See visibility enum. |
| `created_at` | timestamptz | yes | Audit timestamp. |
| `updated_at` | timestamptz | yes | Audit timestamp. |

### Visibility enum

`mmm_approval_comment_visibility`:

- `round_participants`
- `level_1_only`
- `level_2_and_level_1`
- `level_3_level_2_and_level_1`

### Required invariants

- Level 3 change-loop comments must be visible to level 1 and copied level 2 approvers.
- Comments cannot be hard-deleted after submission; use redaction/soft delete if required later.

## 9. `mmm_approval_locks`

Tracks lock state at framework, domain, and object levels.

### Required fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Primary key. |
| `organisation_id` | uuid | yes | Organisation context. |
| `framework_id` | uuid | yes | Framework context. |
| `domain_id` | uuid nullable | no | Domain lock scope. |
| `object_type` | enum nullable | no | Optional narrower lock object type. |
| `object_id` | uuid nullable | no | Optional narrower lock object id. |
| `lock_state` | enum | yes | See lock state enum. |
| `locked_by_round_id` | uuid nullable | no | Round that established lock. |
| `temporarily_unlocked_by_round_id` | uuid nullable | no | Round that reopened item. |
| `reason` | text | yes | Lock/unlock reason. |
| `created_at` | timestamptz | yes | Audit timestamp. |
| `updated_at` | timestamptz | yes | Audit timestamp. |

### Lock state enum

`mmm_approval_lock_state`:

- `unlocked`
- `locked_by_level_2`
- `temporarily_unlocked_for_change_request`
- `locked_by_final_approval`

### Required invariants

- Level 1 approval does not create a lock.
- Level 2 `approved_by_all` creates a domain-level lock.
- Level 3 change request may create a temporary unlock for affected items only.
- Final approval creates final framework/domain locks.

## 10. `mmm_approval_notification_events`

Event outbox for e-mail and in-app notifications.

### Required fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Primary key. |
| `organisation_id` | uuid | yes | Organisation context. |
| `approval_round_id` | uuid | yes | Parent round. |
| `recipient_user_id` | uuid nullable | no | Known recipient. |
| `recipient_email` | text | yes | Target e-mail. |
| `notification_type` | enum | yes | See notification type enum. |
| `payload_json` | jsonb | yes | Structured payload for renderer. |
| `idempotency_key` | text | yes | Prevent duplicate sends. |
| `status` | enum | yes | See notification status enum. |
| `queued_at` | timestamptz | yes | Queue timestamp. |
| `sent_at` | timestamptz nullable | no | Sent timestamp. |
| `failed_at` | timestamptz nullable | no | Failure timestamp. |
| `failure_reason` | text nullable | no | Error summary. |

### Notification type enum

`mmm_approval_notification_type`:

- `level_2_invitation`
- `level_2_changes_submitted`
- `level_1_response_submitted`
- `level_2_all_approved`
- `level_3_invitation`
- `level_3_changes_submitted`
- `final_approval_complete`

### Notification status enum

`mmm_approval_notification_status`:

- `queued`
- `sent`
- `failed`
- `cancelled`

## 11. `mmm_ai_learning_events`

Records organisation-specific learning events from approval-loop decisions.

### Required fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | yes | Primary key. |
| `organisation_id` | uuid | yes | Organisation context. |
| `framework_id` | uuid | yes | Framework context. |
| `approval_round_id` | uuid nullable | no | Related round. |
| `proposed_change_id` | uuid nullable | no | Related proposed change. |
| `approval_level` | enum nullable | no | `level_2` or `level_3`. |
| `object_type` | enum | yes | Same as approval object type. |
| `object_id` | uuid | yes | Target object id. |
| `original_value` | text nullable | no | Prior value. |
| `proposed_value` | text nullable | no | Proposed value. |
| `final_value` | text nullable | no | Accepted/applied value. |
| `decision` | enum | yes | See learning decision enum. |
| `reason` | text nullable | no | Reason/comment. |
| `actor_role` | enum | yes | `level_1`, `level_2`, `level_3`, `system`. |
| `created_at` | timestamptz | yes | Audit timestamp. |

### Learning decision enum

`mmm_ai_learning_decision`:

- `accepted`
- `rejected`
- `edited`
- `superseded`
- `final_signed_off`

## 12. API / edge-function contract

The final implementation may use Supabase edge functions or equivalent API endpoints. The function names below are canonical for future build waves unless CS2 approves a change.

## 13. `mmm-approval-round-create`

Creates a level 2 or level 3 approval round and approver invitations.

### Request

```json
{
  "organisation_id": "uuid",
  "framework_id": "uuid",
  "domain_id": "uuid-or-null",
  "approval_level": "level_2",
  "submitted_by_user_id": "uuid",
  "approvers": [
    {
      "full_name": "Jane Approver",
      "email": "jane@example.com",
      "designation": "Operations Executive",
      "message": "Please review this domain.",
      "due_date": "2026-07-15"
    }
  ]
}
```

### Response

```json
{
  "approval_round_id": "uuid",
  "status": "invited",
  "approver_ids": ["uuid"],
  "notification_event_ids": ["uuid"]
}
```

### Failure modes

- missing domain for level 2;
- level 3 requested before level 2 prerequisites are complete;
- duplicate approver e-mail in active round;
- unauthorised submitter;
- target domain already locked by final approval.

## 14. `mmm-approval-invite-accept`

Accepts an invitation and grants scoped access.

### Request

```json
{
  "token": "plaintext-token-from-link",
  "user_id": "uuid-or-null",
  "signup_profile": {
    "full_name": "Jane Approver",
    "email": "jane@example.com"
  }
}
```

### Response

```json
{
  "approval_round_id": "uuid",
  "approver_id": "uuid",
  "access_scope": {
    "framework_id": "uuid",
    "domain_id": "uuid-or-null",
    "approval_level": "level_2"
  }
}
```

### Failure modes

- token invalid;
- token expired;
- invite revoked;
- e-mail mismatch;
- round superseded.

## 15. `mmm-approval-proposed-changes-submit`

Submits approver proposed changes and comments.

### Request

```json
{
  "approval_round_id": "uuid",
  "approver_id": "uuid",
  "changes": [
    {
      "object_type": "criterion",
      "object_id": "uuid",
      "field_name": "statement",
      "display_reference": "MPS 4 / Criteria 7 / statement",
      "original_value": "Current criterion text",
      "proposed_value": "Proposed criterion text",
      "comment": "Please clarify ownership."
    }
  ],
  "round_comment": "I have proposed three changes."
}
```

### Response

```json
{
  "approval_round_id": "uuid",
  "status": "changes_requested",
  "proposed_change_ids": ["uuid"],
  "notification_event_ids": ["uuid"]
}
```

### Failure modes

- approver not part of round;
- round not in review state;
- proposed value empty;
- original value does not match latest snapshot and conflict detection fails;
- target object outside approver scope.

## 16. `mmm-approval-decision-submit`

Records an approver approval decision.

### Request

```json
{
  "approval_round_id": "uuid",
  "approver_id": "uuid",
  "decision": "approved",
  "decision_comment": "Approved with no further changes."
}
```

### Response

```json
{
  "approval_round_id": "uuid",
  "round_status": "approved_by_all",
  "lock_state_changes": [
    {
      "object_type": "domain",
      "object_id": "uuid",
      "lock_state": "locked_by_level_2"
    }
  ],
  "notification_event_ids": ["uuid"]
}
```

### Failure modes

- pending proposed changes by same approver;
- approver not in round;
- round superseded;
- decision conflicts with existing changes requested state.

## 17. `mmm-approval-level1-response-submit`

Allows level 1 to accept, reject, edit, or apply proposed changes.

### Request

```json
{
  "approval_round_id": "uuid",
  "level_1_user_id": "uuid",
  "responses": [
    {
      "proposed_change_id": "uuid",
      "action": "edited_by_level_1",
      "final_value": "Accepted wording with level 1 edits.",
      "response_comment": "Accepted but tightened language."
    }
  ],
  "resubmit": true
}
```

### Response

```json
{
  "approval_round_id": "uuid",
  "new_round_id": "uuid-or-null",
  "applied_change_ids": ["uuid"],
  "ai_learning_event_ids": ["uuid"],
  "notification_event_ids": ["uuid"]
}
```

### Failure modes

- level 1 user not authorised;
- proposed change already applied/rejected/superseded;
- target object is final locked;
- final value empty for accept/edit action;
- attempted apply without audit/AI learning event.

## 18. `mmm-approval-lock-transition`

Internal API used by approval functions to transition lock state.

### Request

```json
{
  "approval_round_id": "uuid",
  "lock_scope": {
    "framework_id": "uuid",
    "domain_id": "uuid-or-null",
    "object_type": "domain",
    "object_id": "uuid"
  },
  "target_lock_state": "locked_by_level_2",
  "reason": "All level 2 approvers approved."
}
```

### Response

```json
{
  "lock_id": "uuid",
  "lock_state": "locked_by_level_2"
}
```

### Failure modes

- illegal transition;
- final lock already present;
- missing reason;
- round state does not permit transition.

## 19. Required authorization rules

- Level 1 can create approval rounds for owned or administrable domains/frameworks.
- Level 2 approvers can read the invited domain and propose changes/comments only within the round scope.
- Level 3 approvers can read the invited full roadmap/control standard and propose changes/comments only within the final approval round.
- Level 2 approvers copied into level 3 correspondence can comment on affected domain changes but cannot directly approve level 3 unless separately invited as final approvers.
- No approver can directly update canonical domain/MPS/criteria/descriptor tables through the approval workspace.

## 20. Required audit events

Every state transition must produce an audit event in the later implementation.

Required event categories:

- approval round created;
- approver invited;
- invite accepted;
- proposed changes submitted;
- approver approved;
- level 1 accepted change;
- level 1 rejected change;
- level 1 edited/applied change;
- round resubmitted;
- lock applied;
- temporary unlock applied;
- final approval completed.

## 21. Acceptance criteria for this contract

This DB/API contract is complete when future builders can implement:

- the approval round storage model;
- approver invite and scoped access;
- proposed change storage and review;
- comment threading;
- notification event queue;
- lock state transitions;
- AI learning event capture;
- API payload validation;
- authorization boundaries;
- QA-to-red tests without inventing additional domain rules.
