# MMM FRS/TRS/Architecture Alignment Addendum

Status: governance alignment addendum
Date: 2026-06-23
Wave: `wave-mmm-frs-trs-architecture-alignment-2026-06-23`
CS2 Authority: Johan Ras

## 1. Purpose

This addendum aligns the newly merged MMM approval workflow, published maturity model view, and evidence modal harvest/adaptation QA-to-red artifacts with the formal MMM FRS, TRS, and Architecture baselines before runtime build-to-GREEN begins.

This artifact is not runtime implementation. It does not add UI components, executable tests, database migrations, API routes, edge functions, e-mail delivery, evidence upload runtime, AI runtime, storage adapters, or deployment changes.

## 2. Governance conclusion

Build-to-GREEN for Steps 1-7 should not start until this alignment addendum is merged.

After this addendum is merged, the first implementation wave may begin, provided it:

1. starts from a fresh branch from `main`;
2. creates a new implementation scope declaration;
3. creates a new IAA pre-brief record;
4. creates a builder appointment for implementation;
5. converts the relevant QA-to-red expectations into executable failing tests before runtime code;
6. implements only inside the explicitly authorized build boundary;
7. preserves typed integration client compliance under Architecture law.

## 3. Authority chain

### 3.1 Formal upstream baselines

- FRS: `modules/MMM/02-frs/functional-requirements.md`
- TRS: `modules/MMM/03-trs/technical-requirements-specification.md`
- Architecture: `modules/MMM/04-architecture/architecture.md`

### 3.2 Step 1-7 downstream artifacts now requiring baseline alignment

- `approval-workflow-gap-analysis.md`
- `approval-workflow-prebuild-contract.md`
- `approval-workflow-db-api-contract.md`
- `approval-workflow-notification-lock-contract.md`
- `approval-workflow-qa-to-red.md`
- `level2-invite-workspace-qa-to-red.md`
- `change-summary-accept-reject-apply-qa-to-red.md`
- `level3-approval-expansion-qa-to-red.md`
- `published-model-view-qa-to-red.md`
- `evidence-modal-harvest-qa-to-red.md`

## 4. FRS alignment addendum

The following functional capabilities are now formally aligned to the MMM FRS build baseline for implementation planning. They extend the FRS without replacing the existing FRS text.

### FRS-AW-001 — Level 1 approval preparation

MMM must allow a Level 1 user/compiler to complete domain model preparation after maturity descriptors are generated and prepare that domain for approval.

Functional scope:

- domain name and description;
- MPS names and descriptions;
- intent statements;
- criteria;
- maturity descriptors;
- Level 1 component approval without final lock.

### FRS-AW-002 — Level 2 invitation and workspace

MMM must allow the Level 1 user to invite one or more Level 2 approvers for a domain approval round.

Functional scope:

- approver name and e-mail capture;
- duplicate e-mail prevention;
- selected domain/MPS/criteria scope summary;
- invitation notifications;
- scoped approver workspace access;
- Level 2 review of domain, MPS, intent, criteria, and maturity descriptors.

### FRS-AW-003 — Level 2 proposed changes and comments

MMM must allow Level 2 approvers to propose changes and comments against domain, MPS, intent, criteria, and maturity descriptor fields without directly mutating canonical model content.

Functional scope:

- original value capture;
- proposed value capture;
- display reference capture;
- approver comment capture;
- grouped change summary to Level 1.

### FRS-AW-004 — Level 1 response loop

MMM must allow Level 1 to respond to proposed changes.

Functional scope:

- accept proposed change;
- reject with reason;
- edit proposed text and apply modified value;
- request clarification;
- add reply comment;
- create audit and AI learning events for every Level 1 action;
- resubmit to approvers when required.

### FRS-AW-005 — Level 2 finalization and domain lock

MMM must lock a domain only after all required Level 2 approvers approve it.

Functional scope:

- support partial Level 2 approval state;
- pause lock when any approver requests changes;
- lock approved domain after all required approvals;
- keep Level 1-only approval non-locking.

### FRS-AW-006 — Level 3 final approval workflow

MMM must allow Level 1 to invite Level 3 final approvers only after required Level 2 approval is complete.

Functional scope:

- full roadmap/control standard approval scope;
- multiple Level 3 approvers;
- `level_3_pending` state;
- Level 3 proposed changes;
- affected Level 2 approvers copied on Level 3 change correspondence;
- Level 2 copied comment rights without final approver authority;
- final approval only after all required Level 3 approvers sign off.

### FRS-AW-007 — Lock/unlock and final lock behavior

MMM must enforce controlled lock states across approval workflow.

Functional scope:

- unlocked;
- locked by Level 2;
- temporarily unlocked for change request;
- locked by final approval;
- temporary unlock only for affected items;
- no unrelated domain unlocks;
- post-final changes require a later change-management workflow.

### FRS-AW-008 — Notification and correspondence

MMM must create user-facing notification/correspondence events for approval workflow activity.

Functional scope:

- Level 2 invitation;
- Level 2 proposed changes to Level 1;
- Level 1 response/resubmission to Level 2;
- Level 2 all-approved notice to Level 1;
- Level 3 invitation;
- Level 3 proposed changes to Level 1 with affected Level 2 approvers copied;
- final approval completion notice.

### FRS-AW-009 — Audit and AI learning events

MMM must record audit events and AI learning events for approval-loop actions.

Functional scope:

- organisation id;
- approval round id;
- approval level;
- object type and object id;
- original/proposed/final values;
- decision and reason/comment;
- actor role;
- timestamp;
- organisation-specific learning suitability.

### FRS-PUB-001 — Published maturity model view

MMM must provide a published maturity model view after final approval and final lock.

Functional scope:

- published view hidden before final approval/final lock;
- published view visible to authorized users after final lock;
- read-only final-approved content;
- framework/domain identity and publication status;
- no canonical content mutation through published navigation.

### FRS-PUB-002 — Published model navigation and traceability

MMM must provide collapsible published model navigation.

Functional scope:

- MPS-first view;
- MPS plus intent statements;
- MPS plus criteria;
- criterion detail with maturity descriptors;
- domain/MPS/criterion/descriptor traceability;
- deep-link context preservation.

### FRS-PUB-003 — Criterion card, maturity tabs, and descriptor modal

MMM must provide criterion detail UX expectations in the published view.

Functional scope:

- criterion card statement and status;
- current maturity level tab;
- next maturity level tab;
- maturity descriptor modal;
- Basic, Reactive, Compliant, Proactive, and Resilient descriptor levels where available;
- read-only descriptor modal behavior.

### FRS-EVID-001 — Criterion-linked evidence modal entry

MMM must provide an evidence management entry point from criterion context.

Functional scope:

- entry from published criterion card;
- domain, MPS, criterion, and descriptor context preservation;
- criterion-scoped evidence list;
- visible loading, empty, and error states.

### FRS-EVID-002 — Evidence type parity from MAT

MMM must harvest/adapt the MAT evidence panel behavior for evidence type parity.

Functional scope:

- document/URL;
- photo/image;
- text findings;
- video;
- spreadsheet/file;
- voice note/audio;
- remove/replace controls;
- criterion-linked storage path context.

### FRS-EVID-003 — Evidence capture and integration placeholders

MMM must reserve evidence capture and integration expectations for later runtime implementation.

Functional scope:

- mobile photo capture expectation;
- mobile video capture expectation;
- mobile voice note/audio capture expectation;
- direct camera/photo/video capture expectation;
- AI evidence evaluation placeholder;
- AI evidence re-evaluation placeholder;
- PIT/risk/incident link placeholders.

## 5. TRS alignment addendum

The following technical expectations are now formally aligned to the MMM TRS build baseline for implementation planning. They extend the TRS without replacing the existing TRS text.

### TR-AW-001 — Approval persistence model

Future implementation must represent approval workflow data with durable persistence for:

- approval rounds;
- approvers;
- proposed changes;
- comments;
- lock state;
- notification events;
- audit events;
- AI learning events.

### TR-AW-002 — Approval state machine

Future implementation must enforce the approval state model from the approval workflow pre-build contract:

- domain states;
- approval round states;
- proposed change states;
- lock states.

State transitions must be validated server-side, not only in UI.

### TR-AW-003 — Notification event contract

Future implementation must write notification/correspondence events before any delivery-specific e-mail runtime is treated as complete.

E-mail delivery may be implemented later, but the event contract must be testable first.

### TR-AW-004 — Audit event contract

Future implementation must create audit events for approval-loop actions, proposed changes, Level 1 responses, copied Level 2 comments, Level 3 changes, locks, unlocks, and final approval.

### TR-AW-005 — AI learning event contract

Future implementation must create AI learning events for approval-loop actions in a shape suitable for organisation-specific learning.

AI learning event persistence is required before live model learning behavior is considered complete.

### TR-AW-006 — Lock and unlock enforcement

Future implementation must enforce locks server-side:

- Level 1 approval must not lock content;
- Level 2 all-approved locks the domain;
- Level 3 change requests temporarily unlock only affected items;
- final approval locks the complete roadmap/control standard;
- post-final edits must be blocked unless later change-management workflow is authorized.

### TR-AW-007 — Typed client approval API surface

Future frontend implementation must call approval behavior through a typed integration client, not ad-hoc fetch calls.

The typed client must expose testable methods for:

- creating approval rounds;
- inviting approvers;
- reading approver workspace data;
- submitting proposed changes;
- responding to proposed changes;
- requesting clarification;
- adding comments;
- approving Level 2 domain scope;
- approving Level 3 final scope;
- applying controlled unlock/lock transitions.

### TR-PUB-001 — Published model API/client surface

Future frontend implementation must call published model behavior through a typed integration client.

The typed client must expose testable methods for:

- fetching published model summary;
- fetching domain/MPS/criteria/descriptor hierarchy;
- fetching criterion detail;
- fetching current and next maturity level data;
- preserving deep-link context;
- returning loading/error/empty state-compatible responses.

### TR-EVID-001 — Evidence modal API/client surface

Future frontend implementation must call evidence behavior through a typed integration client.

The typed client must expose testable methods for:

- fetching criterion evidence list;
- creating document/URL evidence metadata;
- creating file/media evidence metadata;
- replacing evidence metadata;
- removing evidence metadata;
- preserving criterion-scoped context;
- preparing AI evaluation and re-evaluation requests;
- preparing PIT/risk/incident linkage requests.

### TR-EVID-002 — Evidence storage path expectation

Future implementation must preserve organisation, framework/roadmap, domain, MPS, and criterion identity in evidence storage path or metadata.

MAT storage patterns may be harvested, but MMM must adapt them to MMM canonical domain/MPS/criterion context.

### TR-EVID-003 — Evidence runtime boundary

Evidence upload, camera capture, audio capture, video capture, AI evaluation, and PIT/risk/incident integration runtime are not authorized merely by this addendum. They must be implemented only inside a later explicitly scoped build wave that first converts QA-to-red expectations into executable failing tests.

## 6. Architecture alignment addendum

This section extends Architecture build authorization for the approval workflow, published model, and evidence modal flows.

### ARCH-AW-001 — Typed integration client remains mandatory

All new approval workflow, published model, and evidence modal frontend actions must call the approved backend runtime through typed integration clients.

Direct ad-hoc `fetch('/api/...')` calls from UI/page/feature components remain prohibited.

### ARCH-AW-002 — Extended route-to-capability map

The following route/capability rows extend the MMM route-to-capability build authorization baseline for the implementation waves that follow this addendum.

| Journey / Route Area | Backend Capability | Edge Function / Route Expectation | DB / Persistence Surface |
|---|---|---|---|
| Level 2 approval invite | `mmm-approval-round-create`, `mmm-approver-invite` | typed approval client; route finalized by implementation wave | approval rounds, approvers, notification events |
| Level 2 approver workspace | `mmm-approval-workspace-read` | typed approval client | approval rounds, approvers, proposed changes, comments |
| Level 2 proposed changes | `mmm-proposed-change-create` | typed approval client | proposed changes, comments, audit events, AI learning events |
| Level 1 response loop | `mmm-proposed-change-respond` | typed approval client | proposed changes, model content changes, audit events, AI learning events |
| Clarification/comment loop | `mmm-approval-comment-create` | typed approval client | comments, notification events, audit events, AI learning events |
| Level 2 domain approval | `mmm-domain-level2-approve` | typed approval client | approval rounds, lock states, notification events |
| Level 3 final approval invite | `mmm-final-approval-round-create`, `mmm-final-approver-invite` | typed approval client | approval rounds, approvers, notification events |
| Level 3 final workspace | `mmm-final-approval-workspace-read` | typed approval client | roadmap/control standard scope, proposed changes, comments |
| Level 3 proposed changes | `mmm-final-proposed-change-create` | typed approval client | proposed changes, copied correspondence, audit events, AI learning events |
| Final approval completion | `mmm-final-approval-complete` | typed approval client | final lock state, notification events, audit events, AI learning events |
| Published model view | `mmm-published-model-read` | typed published model client | published framework/model snapshot, domain/MPS/criteria/descriptors |
| Published criterion detail | `mmm-published-criterion-read` | typed published model client | criterion, descriptors, current/next maturity data |
| Evidence modal read | `mmm-evidence-list` | typed evidence client | evidence, evidence metadata |
| Evidence metadata create | `mmm-evidence-create` | typed evidence client | evidence, evidence metadata, audit events |
| Evidence replace/remove | `mmm-evidence-update`, `mmm-evidence-remove` | typed evidence client | evidence, evidence metadata, audit events |
| Evidence AI placeholder | `mmm-evidence-ai-evaluation-prepare` | typed evidence/AIMC client boundary, runtime later | AI request intent/audit metadata |
| PIT/risk/incident link placeholder | `mmm-evidence-link-prepare` | typed evidence client, integration runtime later | evidence link metadata |

### ARCH-AW-003 — Build authorization rule

Implementation builders may not create a frontend journey, UI action, integration call, route handler, database mutation, or edge function outside the extended route-to-capability map unless CS2 authorizes an additional architecture addendum or revision.

### ARCH-AW-004 — Existing architecture remains binding

This addendum does not relax any existing MMM architecture laws, including:

- React/Vite frontend stack;
- Supabase backend/database/storage/auth/RLS;
- Supabase Edge Functions for server-side business logic;
- AIMC-only AI provider boundary;
- typed integration client law;
- no direct AI provider calls from MMM;
- RLS tenant isolation;
- no ad-hoc frontend `/api/...` fetches.

## 7. Step 1-7 traceability matrix

| Step | Artifact(s) | FRS alignment | TRS alignment | Architecture alignment | Build note |
|---|---|---|---|---|---|
| 1 | `approval-workflow-gap-analysis.md`, `approval-workflow-prebuild-contract.md` | FRS-AW-001 through FRS-AW-009 | TR-AW-001 through TR-AW-006 | ARCH-AW-001 through ARCH-AW-004 | Establishes approval workflow behavior. |
| 2 | `approval-workflow-db-api-contract.md`, `approval-workflow-notification-lock-contract.md`, `approval-workflow-qa-to-red.md` | FRS-AW-002 through FRS-AW-009 | TR-AW-001 through TR-AW-007 | ARCH-AW-002 | Establishes DB/API, notification, lock, audit, and AI event expectations. |
| 3 | `level2-invite-workspace-qa-to-red.md` | FRS-AW-002, FRS-AW-003, FRS-AW-005 | TR-AW-001, TR-AW-002, TR-AW-007 | ARCH-AW-002 Level 2 rows | Must become executable failing tests before Level 2 UI/API runtime. |
| 4 | `change-summary-accept-reject-apply-qa-to-red.md` | FRS-AW-003, FRS-AW-004, FRS-AW-008, FRS-AW-009 | TR-AW-003, TR-AW-004, TR-AW-005, TR-AW-007 | ARCH-AW-002 Level 1 response/comment rows | Every Level 1 action must create audit and AI learning events. |
| 5 | `level3-approval-expansion-qa-to-red.md` | FRS-AW-006, FRS-AW-007, FRS-AW-008, FRS-AW-009 | TR-AW-001 through TR-AW-007 | ARCH-AW-002 Level 3 rows | Final approval only after all required final approvers sign off. |
| 6 | `published-model-view-qa-to-red.md` | FRS-PUB-001 through FRS-PUB-003 | TR-PUB-001 | ARCH-AW-002 published model rows | Published view remains read-only after final lock. |
| 7 | `evidence-modal-harvest-qa-to-red.md` | FRS-EVID-001 through FRS-EVID-003 | TR-EVID-001 through TR-EVID-003 | ARCH-AW-002 evidence rows | Evidence runtime requires separate implementation wave. |

## 8. Build-to-GREEN sequencing recommendation

The first runtime implementation wave should not attempt to build all Steps 1-7 in one PR.

Recommended sequence:

1. Approval workflow foundation: persistence, typed client contract, state machine, notification/audit/AI event stubs, executable tests.
2. Level 2 invite modal and workspace runtime.
3. Level 1 change-summary response runtime.
4. Level 3 final approval runtime.
5. Published maturity model view runtime.
6. Evidence modal harvest/adaptation runtime.

Each implementation wave must:

- create fresh scope;
- create IAA pre-brief;
- create builder appointment;
- convert the relevant QA-to-red expectations into executable failing tests first;
- then implement runtime code to GREEN;
- run governance gates and visible CI.

## 9. Non-goals of this addendum

This addendum does not implement:

- database schema migrations;
- edge functions;
- API route handlers;
- typed client source code;
- React components;
- e-mail templates;
- evidence upload runtime;
- AI evidence evaluation runtime;
- PIT/risk/incident integrations;
- approval workflow runtime state transitions.

## 10. Alignment result

After this addendum merges, the FRS, TRS, Architecture, and Steps 1-7 QA-to-red artifacts are aligned enough to authorize the first implementation build-to-GREEN wave.

The builder must still obey the one-wave-at-a-time implementation sequence and must convert QA-to-red into executable failing tests before runtime implementation.
