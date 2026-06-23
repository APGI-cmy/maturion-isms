# MMM Approval Workflow Gap Analysis

Status: pre-build alignment
Date: 2026-06-23
Wave: `wave-mmm-approval-workflow-prebuild-2026-06-23`
CS2 Authority: Johan Ras
Module: MMM — Maturity Model Management

## 1. Purpose

This artifact aligns MMM pre-build requirements with the approval workflow described by CS2 and the Maturity Roadmap source document.

The next development stage begins after maturity descriptors are generated and minor edits are complete. At that point, the user submits a configured domain for approval.

This gap analysis confirms what is already aligned, what is missing, and what downstream build waves must implement in sequence.

## 2. Authority summary

The roadmap describes a layered maturity model configuration process:

1. Domains.
2. Mini Performance Standards (MPSs).
3. Intent statements.
4. Criteria.
5. Maturity level descriptors and level evaluator.
6. Evidence management.
7. Human-loop auditor / approval verification.

The approval workflow has three major approval levels:

- Level 1: initial approval by the user/compiler at component level.
- Level 2: domain-level approval by one or more second-level approvers.
- Level 3: full maturity roadmap / control standard approval by one or more final approvers.

The roadmap also states that evidence management becomes available after publication and must support uploaded documents, system/database links, PIT/risk-platform links, AI evaluation, re-evaluation, escalation, overrides, independent auditor referrals, and audit trail capture.

## 3. Current alignment

### 3.1 MMM structure is aligned

MMM already has pre-build requirements for canonical ownership of domains, MPSs, criteria, evidence, scoring state, and evidence audit trail.

The current app work also already includes domain/MPS/criteria generation and maturity descriptor generation as the live configuration path.

Alignment level: strong.

### 3.2 Maturity descriptor configuration is aligned

The current descriptor generation/editing flow supports the immediate prerequisite for this approval workflow: the domain can move toward a state where all MPSs, intent statements, criteria, and maturity descriptors exist.

Alignment level: strong for content generation; partial for approval state transitions.

### 3.3 Evidence management harvest source exists

MAT contains a harvest source for criterion-linked evidence upload at:

```text
modules/mat/frontend/src/components/evidence/EvidenceUploadPanel.tsx
```

The MAT panel supports:

- document / URL;
- photo / image;
- text / findings;
- video;
- spreadsheet/file;
- voice note;
- criterion-linked storage path convention;
- remove / replace controls.

Alignment level: useful harvest source, not final MMM evidence workflow.

## 4. Major gaps

### GAP-APPROVAL-001 — Domain approval state model is missing

Required states are not yet explicitly modelled for:

- draft configuration;
- level 1 component approval;
- domain submitted to level 2;
- level 2 changes requested;
- level 2 approval pending by approver;
- level 2 approved by one approver;
- level 2 approved by all approvers;
- domain locked after level 2 approval;
- level 3 pending;
- level 3 changes requested;
- final approval;
- final lock / publication.

Impact: implementation could confuse temporary user acceptance with domain lock.

Required pre-build response: define approval states and allowed transitions before DB/API work.

### GAP-APPROVAL-002 — Multi-approver invitation model is missing

The workflow must support more than one level 2 approver and more than one level 3 approver.

Missing rules:

- whether approval requires all approvers or a quorum;
- how pending approvers are tracked;
- what happens if one approver requests changes while others approve;
- how re-submission reopens pending approvals;
- how approvers are reminded or replaced.

CS2 direction for now: third level approval activates only when the last approver signs off. Apply the same conservative rule to level 2 unless CS2 later defines quorum.

### GAP-APPROVAL-003 — Approver invite modal contract is missing

The modal must allow the user to invite one or more approvers.

Required fields:

- approver full name;
- e-mail address;
- approval level;
- designation / role;
- optional message;
- optional due date;
- selected scope to approve;
- invitation status.

The modal must validate multiple approvers before submission.

### GAP-APPROVAL-004 — Approver access / signup flow is missing

Invited approvers may not yet be users.

Required behavior:

- send invite link;
- support signup as approver;
- grant scoped access to the domain or maturity model under review;
- limit write authority to proposed changes and comments;
- prevent broad app access beyond invitation scope.

### GAP-APPROVAL-005 — Proposed-change model is missing

Approver edits must not silently overwrite level 1 content.

Every proposed change must capture:

- object type: domain, MPS, intent statement, criterion, maturity descriptor;
- object identifier;
- human-readable reference;
- original value;
- proposed value;
- approver comment;
- author;
- timestamp;
- approval round;
- status: proposed, accepted, edited, rejected, superseded, applied.

### GAP-APPROVAL-006 — Change highlighting is missing

Level 2 and level 3 UI must show proposed changes clearly.

Required display modes:

- changed fields highlighted;
- original and proposed values visible;
- comments attached to the changed item;
- status badges for proposed / accepted / rejected / applied;
- filter by approver and object type.

### GAP-APPROVAL-007 — E-mail summary contract is missing

When an approver submits proposed changes, the level 1 user must receive an e-mail summary.

Each item must include a precise reference, such as:

- `Domain: Leadership and Governance / name`;
- `MPS 2 / title`;
- `MPS 3 / intent statement`;
- `MPS 4 / Criteria 7 / statement`;
- `MPS 4 / Criteria 7 / Descriptor: Compliant`.

The e-mail must include:

- summary count;
- approver name;
- approval level;
- link back to review workspace;
- per-change before/after summary;
- comments.

### GAP-APPROVAL-008 — Accept / reject / edit / apply workflow is missing

Level 1 user must be able to:

- accept a proposed change;
- reject it with reason;
- edit and apply a modified version;
- add a reply comment;
- resubmit to level 2 or level 3.

All actions must be recorded as audit trail and AI learning events.

### GAP-APPROVAL-009 — Lock and unlock rules are missing

Domain lock rules:

- level 1 approval does not lock the domain;
- level 2 approval by all invited approvers locks the domain;
- change requests reopen only the affected components for the level 1 user;
- level 3 change requests can reopen previously locked domain items through the approval loop;
- final approval locks the maturity roadmap/control standard;
- post-final changes require a future change-management process.

### GAP-APPROVAL-010 — AI learning capture is underspecified

The workflow must record AI learning from:

- level 1 edits;
- level 2 proposed changes;
- level 1 accept/reject/edit decisions;
- level 3 proposed changes;
- final sign-off decisions;
- evidence evaluation overrides later.

The event record must retain organisation context because each organisation will have a specialist AI that learns that organisation's model and criteria.

### GAP-APPROVAL-011 — Level 3 approval propagation is missing

Level 3 approval must activate only after level 2 approval is achieved.

Level 3 changes must:

- go to the main user;
- copy level 2 approvers;
- permit level 2 approvers to comment;
- allow level 1 to implement or respond;
- loop until all required final approvers sign off.

### GAP-APPROVAL-012 — Published model view is underdefined

After final approval, the maturity model must be generated into a published view with collapsible structure:

- top level: MPSs;
- next level: intent statements;
- next level: criteria;
- criterion card tabs:
  - evidence management;
  - current level;
  - next level;
  - maturity descriptor reference;
  - AI help / evidence scoring assistance.

### GAP-APPROVAL-013 — Evidence management modal harvest is incomplete

MAT evidence upload panel exists, but MMM requires additional capabilities:

- mobile evidence capture;
- direct photo capture;
- direct video capture;
- voice-note recording;
- document upload;
- meeting recording upload;
- image upload;
- linked evidence from PIT / risk / incident databases;
- AI evidence evaluation;
- re-evaluation;
- escalation / override / independent auditor workflow;
- criterion-level evidence traceability.

The MAT component should be harvested as a starting UI pattern, not copied blindly as final MMM evidence management.

## 5. Required implementation sequence

### Wave A — Approval workflow DB/API contract

Define database and API contracts for:

- approval rounds;
- approvers;
- invitations;
- proposed changes;
- comments;
- notifications;
- locks;
- AI learning events.

### Wave B — Level 2 invitation and workspace

Implement:

- submit-domain modal;
- multi-approver invitation;
- e-mail invite;
- approver signup / scoped access;
- level 2 approval workspace.

### Wave C — Proposed changes and summary e-mail

Implement:

- proposed field edits;
- change highlighting;
- summary e-mail to level 1;
- accept / reject / edit / apply loop.

### Wave D — Level 3 approval expansion

Implement:

- final approver invitation;
- level 2 copied correspondence;
- final approval loop;
- final lock conditions.

### Wave E — Published maturity model view

Implement:

- collapsible MPS / intent / criteria view;
- criterion cards with evidence, current level, next level, descriptors, and AI assistance entry points.

### Wave F — Evidence management harvest/adaptation

Adapt MAT evidence upload capability into MMM evidence management with mobile capture and AI evaluation contracts.

## 6. Recommendation

Do not begin UI or backend implementation until Wave A defines the database/API contract.

The immediate next PR after this pre-build alignment should be the database/API contract for approval rounds, approvers, proposed edits, comments, notifications, locks, and AI learning events.
