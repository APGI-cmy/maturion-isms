# PIT FRS Addendum — W8.3 Strategy Alignment

## Status and precedence

These requirements supplement the canonical PIT FRS. Where an older clause permits project-level tasks, unsafe cancellation, unrestricted delete wording or active descendants beneath a cancelled parent, this addendum supersedes it.

## Requirement set

### PIT-FR-124 — Strict hierarchy parentage

Every task/action item shall reference exactly one deliverable; every deliverable exactly one milestone; every milestone exactly one project.

**Acceptance:** API and database reject a task without `deliverable_id`, a deliverable without `milestone_id`, or a milestone without `project_id`.

### PIT-FR-125 — Parent and organisation consistency

All descendants shall carry the same project and organisation binding as their parent chain.

**Acceptance:** cross-project or cross-organisation parent assignment is rejected and no partial record is created.

### PIT-FR-126 — Cascading accountability

Project, milestone, deliverable and task owners shall be accountable for their defined scope and descendants; delegation shall not remove parent accountability.

### PIT-FR-127 — Scoped write authority

Authorised project members may view the project according to membership, but mutation shall be limited to the actor's project/subtree role.

**Acceptance:** a milestone owner cannot edit a sibling milestone; a deliverable owner cannot edit a sibling deliverable; a task owner cannot alter parent structure.

### PIT-FR-128 — Guided hierarchy setup

The system shall provide role-specific guided setup for project leaders to create milestones, milestone owners to create deliverables, and deliverable owners to create tasks.

### PIT-FR-129 — Responsibility invitation content

Invitations shall identify project, hierarchy item, accountable outcome, timeline, descendant-management responsibility and access scope.

### PIT-FR-130 — Invitation acceptance access

Accepted invitations shall link or create the user account and activate only the approved project visibility and edit scope.

### PIT-FR-131 — Date-order validation

For every hierarchy item, `end_at` earlier than `start_at` shall be rejected.

### PIT-FR-132 — Parent-date exception

A child outside its parent date range shall require explicit confirmation and rationale, recorded as a date exception. No silent adjustment is permitted.

### PIT-FR-133 — Lifecycle vocabulary

Normal users shall receive Archive Project, Cancel Milestone, Cancel Deliverable, Cancel Task and Restore actions. Normal user-facing Delete is prohibited.

### PIT-FR-134 — Cancellation descendant check

Before cancellation, the system shall identify incomplete descendants.

**Acceptance:** cancellation is blocked when incomplete descendants exist and no state changes occur.

### PIT-FR-135 — Structural transfer proposal

A blocked requester may propose transfer of each incomplete child to a valid active target parent and provide rationale.

### PIT-FR-136 — Project-leader approval

A transfer proposal shall require project-leader approval. The requester may not self-approve unless the requester is also the recorded project leader and policy permits self-approval.

### PIT-FR-137 — Atomic transfer and cancellation

On approval, all approved re-parenting and source cancellation shall occur in one transaction. Any failure shall roll back the complete operation.

### PIT-FR-138 — Structural-change audit

The system shall preserve requester, approver, rationale, source and target parents, affected records, decision, timestamps and transaction outcome in an append-only audit record.

### PIT-FR-139 — No active descendants under cancelled parent

The system shall prevent any final state where an active/incomplete descendant is bound to a cancelled milestone or deliverable.

### PIT-FR-140 — MMM-to-PIT transformation

For MMM-origin implementation packages, Domain shall map to milestone, MPS to deliverable and Criterion to one or more executable tasks.

### PIT-FR-141 — Immutable source lineage

Every MMM-generated hierarchy record shall preserve immutable framework, domain, MPS and criterion source identifiers and transformation provenance.

### PIT-FR-142 — Criterion decomposition

The system shall allow one criterion to generate multiple executable tasks while retaining common criterion lineage.

### PIT-FR-143 — Optional Maturion assistance

At supported setup levels, the responsible user may request Maturion suggestions. Suggestions shall route through AIMC, remain drafts and require explicit approval.

### PIT-FR-144 — AI suggestion editing and decision history

Users shall be able to accept, edit or reject suggestions. Original suggestion, accepted form and decision shall remain auditable.

### PIT-FR-145 — Consent-governed preference learning

After an accepted edit, the system may request explicit opt-in to store a governed preference. Default shall be no consent. Users shall be able to inspect, correct and delete stored preferences.

### PIT-FR-146 — No uncontrolled memory writes

PIT shall not write model memory, training data or cross-tenant learning records without the approved consent and isolation contract.

### PIT-FR-147 — Task evidence requirement

Tasks shall support a clear evidence requirement and evidence upload entry point, with live upload/review implementation allocated to W8.5.

### PIT-FR-148 — Shared evidence-assurance service

PIT evidence evaluation shall consume the shared MMM-derived assurance capability rather than duplicate the scoring engine.

### PIT-FR-149 — Context-aware evidence evaluation

Evidence evaluation shall use the task statement and acceptance criteria and, for MMM-origin tasks, the originating criterion and maturity context.

### PIT-FR-150 — Human confirmation of AI evaluation

AI evidence output shall be a proposal. Canonical acceptance, score or progress effect shall require the approved human confirmation/override rule.

### PIT-FR-151 — Future Incident Workflow handoff

PIT shall preserve integration fields for a later governed Incident Workflow work-activity handoff, without implementing that runtime in W8.3.

### PIT-FR-152 — Notification digest contract reservation

The data model shall preserve due-state and responsibility fields required for W8.4 daily and near-horizon notifications; W8.3 shall not claim live delivery.

## Traceability target

PIT-FR-124..152 shall trace to the W8.3 TRS/architecture addendum and RED tests `PIT-RED-W83-001..036`.
