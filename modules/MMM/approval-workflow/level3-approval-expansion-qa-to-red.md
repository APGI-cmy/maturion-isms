# MMM Level 3 Approval Expansion QA-to-Red

Status: QA-to-red artifact
Date: 2026-06-23
Wave: `wave-mmm-level3-approval-qa-red-2026-06-23`
CS2 Authority: Johan Ras

## 1. Purpose

This artifact defines failing test expectations for Step 5 of the MMM approval workflow: Level 3 approval expansion.

It is intentionally pre-code. It does not implement Level 3 UI, database migrations, API routes, edge functions, e-mail delivery, e-mail templates, runtime scoped access, published model view, or evidence management behavior.

## 2. Authority inputs

- `approval-workflow-prebuild-contract.md`
- `approval-workflow-db-api-contract.md`
- `approval-workflow-notification-lock-contract.md`
- `approval-workflow-qa-to-red.md`
- `level2-invite-workspace-qa-to-red.md`
- `change-summary-accept-reject-apply-qa-to-red.md`
- CS2 instruction to proceed with Step 5 QA-to-red before implementation.

## 3. Feature under test

After all required Level 2 approvers sign off the required domains, the Level 1 user can initiate Level 3 approval for the full maturity roadmap / control standard.

Level 3 approvers review the complete roadmap/control standard. They may approve it or propose changes. Proposed changes from Level 3 route to Level 1, with affected Level 2 approvers copied and able to comment. Final approval is complete only after all required Level 3 approvers sign off.

## 4. Red tests — Level 3 prerequisite gating

### T-MMM-L3-PREREQ-001 — Level 3 invite blocked before Level 2 complete

Given one or more required domains have not reached Level 2 approval,
when the Level 1 user attempts to invite Level 3 approvers,
then the action must be blocked with a visible prerequisite failure.

### T-MMM-L3-PREREQ-002 — Level 3 invite allowed after Level 2 complete

Given all required domains have Level 2 approval,
when the Level 1 user starts final approval,
then the Level 3 invite flow may open.

### T-MMM-L3-PREREQ-003 — Level 3 round uses full roadmap scope

Given Level 3 approval is initiated,
then the approval round must represent full roadmap/control standard scope and not only a single domain.

### T-MMM-L3-PREREQ-004 — Level 3 starts `level_3_pending`

Given Level 3 approvers are invited,
then affected domains/framework approval state must be representable as `level_3_pending` until final approval or change request.

### T-MMM-L3-PREREQ-005 — Final-locked roadmap cannot start another Level 3 round

Given the roadmap/control standard is already final locked,
when the user attempts to start another Level 3 round,
then the action must be rejected by the future API/UI expectation.

## 5. Red tests — Multi-approver Level 3 invitation

### T-MMM-L3-INVITE-001 — Level 3 invite supports multiple final approvers

Given the Level 3 invite flow is open,
when the Level 1 user adds multiple final approvers,
then each approver row must be preserved and submitted as part of the final approval round.

### T-MMM-L3-INVITE-002 — Duplicate Level 3 approver e-mails are blocked

Given two Level 3 approver rows use the same e-mail address,
when the user submits the invite flow,
then submission must be blocked before calling the future approval round API.

### T-MMM-L3-INVITE-003 — Level 3 approver payload includes full-roadmap scope

Given the Level 3 invite flow is submitted,
then each approver payload must include approval level `level_3` and full roadmap/control standard scope.

### T-MMM-L3-INVITE-004 — Level 3 invitation queues notification events

Given Level 3 invitations are successfully created,
then a `level_3_invitation` notification event must be queued for each invited final approver.

## 6. Red tests — Level 3 workspace scope

### T-MMM-L3-WORKSPACE-001 — Level 3 approver sees full roadmap summary

Given a Level 3 approver accepts an invitation,
then the workspace must show the full roadmap/control standard summary, including domain count, MPS count, criteria count, and approval status.

### T-MMM-L3-WORKSPACE-002 — Level 3 approver can navigate domains

Given the roadmap includes multiple domains,
then the Level 3 workspace must allow the approver to navigate each domain under the roadmap scope.

### T-MMM-L3-WORKSPACE-003 — Level 3 approver can inspect MPS, intent, criteria, and descriptors

Given a domain contains MPS, intent statements, criteria, and descriptors,
then the Level 3 workspace must allow review of each layer.

### T-MMM-L3-WORKSPACE-004 — Level 3 workspace preserves display references

Given a Level 3 approver reviews or proposes a change,
then the workspace must preserve references such as `Domain: Governance / MPS 4 / Criteria 7 / Descriptor: Compliant`.

### T-MMM-L3-WORKSPACE-005 — Level 3 workspace does not expose unrelated organisation data

Given the Level 3 approver has scoped access to one organisation roadmap,
then unrelated organisations, frameworks, and domains must not be visible.

## 7. Red tests — Level 3 proposed changes

### T-MMM-L3-CHANGE-001 — Level 3 approver can propose changes

Given a Level 3 approver reviews a domain, MPS, intent statement, criterion, or descriptor,
then the workspace must allow a proposed change to be staged for that field.

### T-MMM-L3-CHANGE-002 — Proposed Level 3 change does not mutate canonical content

Given a Level 3 approver proposes a change,
then canonical model content must remain unchanged until the controlled Level 1 response flow applies a change.

### T-MMM-L3-CHANGE-003 — Level 3 proposed change captures context

Given a Level 3 approver proposes a change,
then the proposed-change payload must include approval round id, final approver id, object type, object id, field name, display reference, original value, proposed value, comment, and affected domain id.

### T-MMM-L3-CHANGE-004 — Level 3 proposed changes route to Level 1

Given Level 3 proposed changes are submitted,
then the Level 1 user must receive an actionable change request notification.

### T-MMM-L3-CHANGE-005 — Level 3 proposed changes identify affected Level 2 approvers

Given a Level 3 proposed change affects a domain previously approved at Level 2,
then the notification payload must identify Level 2 approvers associated with the affected domain.

## 8. Red tests — Copied Level 2 correspondence

### T-MMM-L3-COPY-001 — Affected Level 2 approvers are copied

Given a Level 3 change request affects a domain,
then Level 2 approvers for that domain must be copied on the Level 3 change correspondence.

### T-MMM-L3-COPY-002 — Copied Level 2 approvers can comment

Given a copied Level 2 approver opens the affected change correspondence,
then they must be able to add comments according to scoped comment visibility rules.

### T-MMM-L3-COPY-003 — Copied Level 2 approvers are not final approvers

Given a Level 2 approver is copied on Level 3 correspondence,
then they must not count as a Level 3 final approver unless separately invited to the Level 3 round.

### T-MMM-L3-COPY-004 — Copied Level 2 comments are included in audit trail

Given a copied Level 2 approver comments on a Level 3 change request,
then the comment must be included in the approval round audit trail.

## 9. Red tests — Temporary unlock behavior

### T-MMM-L3-UNLOCK-001 — Level 3 change temporarily unlocks affected item only

Given a Level 3 change request targets one locked criterion,
when the change request is accepted for resolution,
then only that affected criterion path may enter temporary unlock state.

### T-MMM-L3-UNLOCK-002 — Level 3 change does not unlock unrelated domains

Given a Level 3 change request affects Domain A,
then Domain B and its child objects must remain locked.

### T-MMM-L3-UNLOCK-003 — Temporary unlock records round and reason

Given an affected item is temporarily unlocked,
then the lock record must include approval round id, object scope, reason, actor, and timestamp.

### T-MMM-L3-UNLOCK-004 — Temporary unlock closes after change loop resolution

Given Level 1 resolves the Level 3 change request and required reconfirmation is complete,
then the affected item must return to the appropriate locked state unless final approval immediately applies final lock.

## 10. Red tests — Final approval and final lock

### T-MMM-L3-FINAL-001 — Single final approval does not complete multi-approver round

Given multiple Level 3 approvers are required,
when only one final approver signs off,
then the round must not be marked final approved.

### T-MMM-L3-FINAL-002 — All Level 3 approvers required for final approval

Given all required Level 3 approvers sign off,
then the round may become `approved_by_all` and final approval may complete.

### T-MMM-L3-FINAL-003 — Final approval creates final lock

Given all Level 3 approvers sign off,
then the roadmap/control standard must enter `locked_by_final_approval`.

### T-MMM-L3-FINAL-004 — Final approval queues completion notifications

Given final approval completes,
then `final_approval_complete` notification events must be queued for Level 1, Level 2 approvers, and Level 3 approvers.

### T-MMM-L3-FINAL-005 — Final locked content cannot be changed in this workflow

Given the roadmap/control standard is final locked,
when a user attempts to change a domain, MPS, criterion, descriptor, or approval response through this workflow,
then the action must be blocked.

## 11. Red tests — Notification, audit, and AI learning events

### T-MMM-L3-EVENT-001 — Level 3 invitation creates notification events

Given Level 3 approvers are invited,
then `level_3_invitation` notification events must be created.

### T-MMM-L3-EVENT-002 — Level 3 change request creates notification events

Given a Level 3 approver submits proposed changes,
then `level_3_changes_submitted` notification events must be created for Level 1 and copied affected Level 2 approvers.

### T-MMM-L3-EVENT-003 — Level 3 proposed change creates audit event

Given a Level 3 proposed change is submitted,
then an audit event must record actor, action, approval round, target object, original value, proposed value, comment, and timestamp.

### T-MMM-L3-EVENT-004 — Level 3 proposed change creates AI learning event

Given a Level 3 proposed change is submitted,
then an AI learning event must capture organisation id, approval level `level_3`, object context, original value, proposed value, decision/context `level_3_change_requested`, actor role, and timestamp.

### T-MMM-L3-EVENT-005 — Final approval creates audit and AI learning events

Given final approval completes,
then audit and AI learning events must record final sign-off, approvers, approval round, final lock state, actor roles, and timestamp.

## 12. Red tests — Authorization and boundary states

### T-MMM-L3-AUTH-001 — Non-invited user cannot access Level 3 workspace

Given a user is not a Level 3 approver or copied affected Level 2 approver,
when they attempt to access the Level 3 workspace,
then access must be denied.

### T-MMM-L3-AUTH-002 — Copied Level 2 approver cannot approve final round

Given a copied Level 2 approver is not invited as a Level 3 approver,
when they attempt to approve the final round,
then the action must be rejected.

### T-MMM-L3-AUTH-003 — Level 3 approver cannot alter canonical content directly

Given a Level 3 approver proposes a change,
then the approver must not be able to directly update canonical domain/MPS/criteria/descriptor content.

### T-MMM-L3-AUTH-004 — Expired Level 3 invitation blocks access

Given a Level 3 invitation is expired or revoked,
when the invitee attempts to accept it,
then access must be denied.

## 13. Non-goals for this QA-to-red wave

The future implementation wave must not use these tests to implement:

- published maturity model view;
- evidence management modal;
- MAT evidence harvest;
- Level 2 invite/workspace runtime behavior;
- production e-mail delivery beyond notification event expectations.

## 14. Acceptance criteria for this QA-to-red artifact

This artifact is complete when a future builder can convert these expectations into executable failing tests before implementing:

- Level 3 invitation prerequisite gates;
- multi-approver Level 3 invitation;
- full roadmap/control standard approval scope;
- Level 3 workspace and proposed-change behavior;
- copied Level 2 correspondence;
- temporary unlock behavior;
- final approval and final lock behavior;
- notification, audit, and AI learning event capture;
- authorization and scope boundaries.
