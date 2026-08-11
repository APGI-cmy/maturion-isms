# PIT TRS Addendum — W8.3 Strategy Alignment

## Technical contract

### PIT-TR-125 — Hierarchy keys

- `milestones.project_id NOT NULL`
- `deliverables.milestone_id NOT NULL`
- `tasks.deliverable_id NOT NULL`
- no project-only task foreign key in W8.3
- all records carry immutable `organisation_id` and `project_id` consistency enforced server-side

### PIT-TR-126 — Mutation boundary

All hierarchy mutation shall use authenticated RPC/Edge Function boundaries. Direct authenticated table INSERT/UPDATE/DELETE grants are prohibited. Reads remain organisation- and project-scoped through RLS.

### PIT-TR-127 — Contextual access resolver

The backend shall resolve project membership plus contextual ownership. UI role checks are advisory only; server-side policy is authoritative.

### PIT-TR-128 — Lifecycle state machine

Allowed states shall distinguish active, completed, cancelled and archived where applicable. State transitions must reject invalid transitions and preserve history. Physical deletion is not exposed to normal users.

### PIT-TR-129 — Date invariant

Database/API validation rejects `end_at < start_at`. Parent-range exceptions require `confirmed_by`, `confirmed_at` and `rationale`.

### PIT-TR-130 — Structural-change requests

A `hierarchy_change_requests` aggregate shall record requester, project, source parent, requested cancellation, child transfer plan, rationale, status and project-leader decision.

### PIT-TR-131 — Atomic approval RPC

Approval shall execute under one transaction with row locking and revalidation of:

- requester and approver authority;
- source/target active state;
- project/organisation consistency;
- descendant completeness state;
- no cycles;
- unchanged proposal version.

All child moves and source cancellation commit together or roll back together.

### PIT-TR-132 — Append-only structural audit

Each request and decision produces immutable audit events. Update/delete of audit events is denied to application roles.

### PIT-TR-133 — Source lineage

MMM-origin records shall carry typed source references and transformation version. Lineage fields are immutable after creation except through separately governed correction.

### PIT-TR-134 — AI proposal storage

Maturion suggestions shall be stored separately from canonical hierarchy records until accepted. Calls route through AIMC and include project purpose, description, hierarchy context and source lineage.

### PIT-TR-135 — Governed preference memory

Preference-memory writes require explicit consent token, user/tenant scope, provenance and retention controls. W8.3 reserves interfaces only; runtime belongs to W8.9.

### PIT-TR-136 — Shared evidence assurance

PIT shall call a shared evidence-assurance interface owned by the MMM/AIMC boundary. Payload includes task statement, acceptance criteria, evidence metadata and optional criterion context. Response is a proposal, not canonical progress.

### PIT-TR-137 — Incident workflow reservation

Task records may carry nullable integration identifiers and idempotency metadata for a future work-activity handoff. No live Incident Workflow call is permitted in W8.3.

### PIT-TR-138 — Required routes

W8.3 must support route contracts for project Implementation, milestones, deliverables, tasks and project settings with loading, empty, permission/error, network-error and data states.

### PIT-TR-139 — Testability

Every mutation RPC shall expose deterministic error codes for unauthenticated, forbidden, cross-tenant, invalid-parent, invalid-date, active-descendants, approval-required, stale-proposal and transaction-failed paths.

## FRS mapping

- FR-124..125 → TR-125..126
- FR-126..130 → TR-127, TR-138
- FR-131..132 → TR-129
- FR-133..139 → TR-128, TR-130..132
- FR-140..142 → TR-133
- FR-143..146 → TR-134..135
- FR-147..150 → TR-136
- FR-151 → TR-137
- FR-152 → TR-125/138 reserved fields
