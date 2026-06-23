# MMM Approval Workflow Pre-Build Contract

Status: pre-build functional contract
Date: 2026-06-23
Wave: `wave-mmm-approval-workflow-prebuild-2026-06-23`
CS2 Authority: Johan Ras

## 1. Contract purpose

This contract defines the required behavior for MMM approval workflow implementation waves after maturity descriptors are generated.

It is not a database migration, API implementation, UI implementation, or e-mail implementation. It is the pre-build contract those later implementation waves must satisfy.

## 2. Workflow scope

The workflow begins when a level 1 user has configured a domain with:

- domain name and description;
- MPS names and descriptions;
- intent statements;
- criteria;
- maturity level descriptors.

The workflow ends when:

- all required level 2 approvers have signed off the domain; and later
- all required level 3 approvers have signed off the maturity roadmap / control standard.

## 3. Roles

### 3.1 Level 1 user / compiler

The level 1 user is the person who compiled the domain model.

Capabilities:

- submit domain for level 2 approval;
- invite one or more level 2 approvers;
- receive proposed changes;
- accept proposed changes;
- reject proposed changes with reason;
- edit proposed changes and apply a modified version;
- resubmit the domain;
- invite level 3 approvers when level 2 approval is achieved.

### 3.2 Level 2 approver

A level 2 approver reviews one domain.

Capabilities:

- access only the invited domain approval workspace;
- review domain, MPS, intent, criteria, and maturity descriptors;
- propose changes;
- add comments;
- submit proposed changes to level 1;
- approve the domain;
- receive correspondence when level 3 proposes changes on a domain they approved.

### 3.3 Level 3 approver

A level 3 approver reviews the full maturity roadmap / control standard after all relevant domains have level 2 approval.

Capabilities:

- access the full approval workspace for the maturity roadmap/control standard;
- sign off;
- propose changes;
- route changes back to level 1 with level 2 approvers copied;
- add comments.

### 3.4 AI learning service

AI must record approval-loop learning events for organisation-specific improvement.

Capabilities:

- record original and proposed text;
- record accepted, rejected, edited, or superseded outcomes;
- connect edits to organisation, domain, MPS, criterion, and descriptor context;
- learn from repeated acceptance patterns and rejection reasons.

## 4. Approval state model

### 4.1 Domain states

Required domain approval states:

- `draft_configuration`
- `level_1_component_approved`
- `submitted_for_level_2`
- `level_2_changes_requested`
- `level_2_partially_approved`
- `level_2_approved`
- `domain_locked_after_level_2`
- `level_3_changes_requested`
- `final_approved`
- `final_locked`

### 4.2 Approval round states

Required approval round states:

- `draft`
- `invited`
- `in_review`
- `changes_requested`
- `resubmitted`
- `approved_by_some`
- `approved_by_all`
- `cancelled`
- `superseded`

### 4.3 Proposed change states

Required proposed change states:

- `proposed`
- `accepted`
- `edited_by_level_1`
- `rejected`
- `applied`
- `superseded`

### 4.4 Lock states

Required lock states:

- `unlocked`
- `locked_by_level_2`
- `temporarily_unlocked_for_change_request`
- `locked_by_final_approval`

## 5. Multi-approver rule

Default rule: all invited approvers for the active approval level must approve before the workflow advances.

For level 2:

- one approver may request changes while others have approved;
- any changes requested state pauses final level 2 lock;
- resubmission must notify all approvers in the active round;
- previously approving approvers may be asked to reconfirm if accepted changes alter their reviewed scope.

For level 3:

- final approval activates only after all required domains have level 2 approval;
- all invited final approvers must sign off unless CS2 later defines a quorum model;
- proposed changes from level 3 reopen affected items through the level 2 to level 1 loop.

## 6. Submit-domain invite modal contract

The submit modal must support one or more approvers.

Required fields per approver:

- full name;
- e-mail address;
- approval level;
- designation / role;
- organisation or department context where applicable;
- optional message;
- optional due date;
- selected scope.

Required modal behavior:

- add approver row;
- remove approver row;
- validate e-mail format;
- prevent duplicate e-mail addresses in the same approval round;
- show selected domain and included MPS/criteria count;
- confirm submission before sending invitations;
- show success/failure state per invitation.

## 7. Approver workspace contract

The approver workspace must show:

- domain summary;
- MPS list;
- each MPS intent statement;
- criteria list under each MPS;
- maturity descriptors under each criterion;
- approval status;
- proposed changes and comments;
- submit changes button;
- approve button.

The workspace must preserve context with references such as:

- `Domain: Leadership and Governance`;
- `MPS 2: <name>`;
- `MPS 2 / Intent statement`;
- `MPS 2 / Criteria 5`;
- `MPS 2 / Criteria 5 / Descriptor: Compliant`.

## 8. Proposed-change contract

Each proposed change must include:

- approval round id;
- approval level;
- object type;
- object id;
- display reference;
- field name;
- original value;
- proposed value;
- approver comment;
- author user id;
- author e-mail;
- created timestamp;
- status;
- applied timestamp where applicable.

Valid object types:

- `domain`
- `mps`
- `intent_statement`
- `criterion`
- `maturity_descriptor`

## 9. Change summary e-mail contract

When approvers submit changes, the level 1 user must receive a summary e-mail.

Required e-mail contents:

- domain name;
- approval level;
- approver names;
- number of proposed changes;
- number of comments;
- grouped changes by object type;
- before/after summary;
- precise display reference;
- link to approval workspace.

Example item:

```text
MPS 4 / Criteria 7 / Descriptor: Compliant
Original: There is a policy in place and it is current.
Proposed: There is an approved policy in place, communicated to accountable owners, reviewed at defined intervals, and supported by retained implementation evidence.
Comment: Please make ownership and evidence retention explicit.
```

## 10. Accept / reject / edit / apply contract

Level 1 must be able to act on each proposed change.

Actions:

- accept as proposed;
- reject with reason;
- edit proposed text and apply modified version;
- request clarification;
- add reply comment.

Each action must create an audit event and an AI learning event.

## 11. Lock / unlock contract

Rules:

1. Level 1 approval does not lock the domain.
2. Domain is locked only after all level 2 approvers approve.
3. If level 2 requests changes, affected items become editable by level 1 for that approval round.
4. Level 3 change requests may reopen affected locked items, but only through the controlled approval loop.
5. Final approval locks the complete maturity roadmap / control standard.
6. Post-final changes require a later change-management workflow.

## 12. Notification contract

Required notifications:

- level 2 invitation e-mail;
- level 2 proposed changes e-mail to level 1;
- level 1 response / resubmission e-mail to level 2;
- level 2 all-approved notification to level 1;
- level 3 invitation e-mail;
- level 3 proposed changes e-mail to level 1 with level 2 approvers copied;
- final approval notification to level 1 and relevant approvers.

## 13. AI learning event contract

AI learning events must capture:

- organisation id;
- approval round id;
- approval level;
- object type;
- object id;
- original value;
- proposed value;
- final value;
- decision: accepted, rejected, edited, superseded;
- reason/comment;
- actor role;
- timestamp.

The AI learning event must be suitable for organisation-specific model learning.

## 14. Published model view contract

After final approval, the published domain/model view must provide collapsible layers:

1. MPS only.
2. MPS plus intent statements.
3. MPS plus intent plus criteria.
4. Criterion detail with maturity descriptors.
5. Criterion detail with evidence management.

Criterion cards must provide:

- evidence management entry point;
- current maturity level tab;
- next maturity level tab;
- view all descriptors modal;
- AI question interface;
- future evidence scoring upload interface.

## 15. Evidence modal harvest contract

MAT harvest source:

```text
modules/mat/frontend/src/components/evidence/EvidenceUploadPanel.tsx
```

Harvestable capabilities:

- document upload;
- photo/image upload;
- video upload;
- voice note upload;
- spreadsheet/file upload;
- text findings;
- remove/replace controls;
- criterion-linked storage path pattern.

Required MMM adaptations:

- convert upload panel into an evidence management modal or criterion tab;
- add mobile capture considerations;
- add direct camera/photo capture;
- add direct video capture;
- add audio recording flow;
- add evidence AI evaluation and re-evaluation;
- add evidence approval/escalation workflow;
- add PIT/risk/incident data-link evidence sources;
- maintain criterion-level traceability.

## 16. Downstream wave boundaries

### Wave 1 after this contract — DB/API contract

Allowed work:

- database model proposal;
- API route/edge-function contract;
- notification contract;
- lock contract;
- QA-to-red tests.

No UI implementation.

### Wave 2 — Level 2 invite modal and approval workspace

Allowed work:

- modal UI;
- workspace UI;
- invite service integration;
- scoped access handling.

### Wave 3 — Change summary e-mail and accept/reject/apply

Allowed work:

- proposed-change UI;
- summary generation;
- e-mail dispatch;
- accept/reject/apply actions.

### Wave 4 — Level 3 approval expansion

Allowed work:

- final approver invite;
- level 2 copied correspondence;
- full-roadmap approval workspace.

### Wave 5 — Published maturity model view

Allowed work:

- collapsible model view;
- criterion card tabs;
- maturity descriptor navigation.

### Wave 6 — Evidence modal harvest/adaptation

Allowed work:

- adapt MAT evidence upload source into MMM;
- add AI evidence evaluation contracts;
- add mobile capture enhancements.

## 17. Acceptance criteria for this pre-build wave

This pre-build wave is acceptable when:

- gap analysis exists;
- approval workflow pre-build contract exists;
- level 2 and level 3 approval loops are represented;
- multiple approvers are supported in the contract;
- proposed-change and e-mail summary requirements are explicit;
- evidence harvest source is identified;
- downstream implementation sequence is bounded.
