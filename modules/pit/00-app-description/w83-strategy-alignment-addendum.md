# PIT App Description Addendum — W8.3 Strategy Alignment

## Status

- Governing issue: `#1968`
- Pull request: `#1972`
- Applies to: PIT Stage 12 W8.3 and later dependent waves
- Authority: CS2 / Johan Ras
- Supersedes conflicting downstream wording only; does not replace the canonical App Description.

## 1. Strict execution hierarchy

PIT shall enforce:

`Project → Milestone → Deliverable → Task / Action Item`

Every task must have one active deliverable parent. Every deliverable must have one active milestone parent. Every milestone must have one project parent. Direct project-level tasks are excluded from W8.3 and require separately approved future change control.

## 2. Cascading accountability

- The project leader is accountable for the complete project.
- A milestone owner is accountable for the milestone and all descendant deliverables and tasks.
- A deliverable owner is accountable for the deliverable and all descendant tasks.
- A task owner is accountable for execution, progress and evidence for the task.
- Delegation does not remove accountability from the parent owner.
- Authorised members may view the wider project, but write authority is restricted to the user's governed scope.

## 3. Guided creation and assignment

After project creation, PIT shall guide the project leader through milestone creation, timeline placement and owner assignment. The milestone owner shall be guided through deliverable creation and assignment. The deliverable owner shall be guided through task creation and assignment.

An invited owner must receive an email explaining:

- the project and assigned hierarchy item;
- the accountable outcome;
- the assigned timeline;
- responsibility for identifying and managing child work;
- the visibility and editing scope granted after acceptance.

Acceptance shall lead to secure signup/link-in and role-scoped access.

## 4. Visual timeline placement

Milestones, deliverables and tasks shall be placeable and adjustable on the project timeline through drag/resize interactions in the W8.6 timeline wave. W8.3 must preserve complete, deterministic date fields and exception metadata required for that later visual interaction.

## 5. Governed cancellation and structural change

A milestone or deliverable with incomplete descendants cannot be cancelled directly.

The system shall:

1. block cancellation;
2. explain that incomplete work remains;
3. require the requester to select valid existing target parents for continuing work;
4. submit the proposed structural change to the project leader;
5. make no hierarchy changes before approval;
6. on approval, re-parent the selected work and cancel the original parent atomically;
7. on rejection, expiry or withdrawal, leave the hierarchy unchanged;
8. preserve requester, approver, rationale, source and target parents, affected records, timestamps and decision in an append-only audit trail.

No active descendant may remain beneath a cancelled parent.

## 6. Lifecycle vocabulary

Normal user actions shall use:

- Archive Project;
- Restore Project;
- Cancel Milestone;
- Cancel Deliverable;
- Cancel Task;
- Restore.

Unrestricted Delete is not a normal user action. Physical deletion is separately governed administrative cleanup and is prohibited where lineage, evidence or audit history must be preserved.

## 7. MMM-origin implementation structure

For an MMM-origin project:

- maturity framework / implementation programme → PIT project;
- Domain → milestone;
- MPS → deliverable;
- Criterion → one or more executable tasks.

A criterion may produce multiple tasks where implementation requires separate actions. Generated records must preserve immutable source lineage to the originating framework, domain, MPS and criterion.

## 8. Maturion assistance

At project, milestone and deliverable setup levels, the responsible user may request Maturion assistance to suggest milestones, deliverables or tasks. Suggestions must:

- use the approved project purpose, description, source context and hierarchy lineage;
- route through AIMC only;
- remain draft proposals;
- be reviewable and editable;
- require explicit human approval before persistence.

## 9. Consent-governed learning

When a user edits an AI suggestion, PIT may ask whether the user wishes to contribute the accepted edit to their governed Maturion preference/memory profile.

No learning occurs without explicit opt-in. The eventual memory contract must support user and tenant isolation, provenance, inspection, correction, deletion and opt-out. PIT shall not perform silent model training or uncontrolled memory writes.

## 10. Evidence assurance reuse

Tasks shall support evidence upload. PIT shall not duplicate the MMM evidence-evaluation engine. Evidence assessment shall use a shared, context-aware assurance service based on the MMM capability, with PIT supplying the task statement, acceptance criteria and source criterion lineage where applicable.

AI evaluation produces a proposal. Canonical evidence acceptance, score or progress effect requires the approved human-confirmation rule and audit trail.

## 11. Incident Workflow integration boundary

A later governed integration may create Incident Workflow Management work activities from PIT tasks. The integration must define identity, state ownership, evidence return, status synchronisation, retry/idempotency and audit provenance. It is not part of W8.3 runtime.

## 12. Completion rule

No milestone, deliverable or task may be represented as complete merely because time elapsed. Completion must be supported by the applicable child completion state, required evidence and approval rules.
