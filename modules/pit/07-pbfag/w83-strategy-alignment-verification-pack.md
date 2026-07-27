# PIT PBFAG Addendum — W8.3 Strategy Alignment

## Gate objective

Verify before implementation that the proposed W8.3 design can support the approved hierarchy and governance journeys without weakening later-wave boundaries.

## Golden paths

### GP-W83-01 — Manual project hierarchy setup

Project leader creates milestones, assigns dates and owners; milestone owner accepts and creates deliverables; deliverable owner accepts and creates tasks. Every task has a deliverable parent and the complete hierarchy is visible on the Implementation page.

### GP-W83-02 — MMM-origin hierarchy proposal

An approved MMM implementation package produces a reviewable PIT proposal where Domain→milestone, MPS→deliverable and each criterion→one or more tasks. User edits wording, approves structure and source lineage remains intact.

### GP-W83-03 — Valid structural transfer and cancellation

Requester attempts to cancel a milestone with incomplete deliverables. PIT blocks cancellation, collects target mappings and rationale, project leader approves, and all moves plus cancellation commit atomically with complete audit history.

### GP-W83-04 — Scoped collaboration

All project members can view authorised project context. Milestone and deliverable owners can edit only their owned subtrees. Viewer and cross-tenant actors cannot mutate or infer unauthorised records.

### GP-W83-05 — AI-assisted setup with human control

User asks Maturion for suggestions. AIMC returns draft proposals. User edits and approves selected items. Canonical hierarchy changes only after approval. Declining learning creates no preference record.

## Failure paths

1. Task without deliverable is rejected.
2. Cross-project or cross-tenant parent is rejected.
3. Invalid date order is rejected.
4. Out-of-range date without explicit confirmation is rejected.
5. Cancellation with incomplete descendants is blocked.
6. Non-project-leader approval is denied.
7. Stale proposal is denied.
8. Mid-transaction failure rolls back all moves, cancellation and audit effects.
9. Audit or lineage update/delete by application role is denied.
10. AIMC outage leaves manual setup usable.
11. Evidence service outage leaves evidence pending and produces no score.
12. W8.3 creates no live Incident Workflow call.

## Evidence required for later GREEN closure

- browser screenshots/video for wizards and role states;
- HAR traces for successful and denied calls;
- Supabase SQL/RPC evidence for invariants, RLS and rollback;
- before/after hierarchy snapshots;
- append-only audit output;
- MMM transformation contract fixture;
- AIMC proposal/acceptance audit fixture;
- executable test output showing all W83 RED tests GREEN without weakening assertions.

## Wave boundaries

- W8.3: schema, routes, hierarchy lifecycle, contextual mutation boundaries and structural-change request foundation.
- W8.4: real invitation delivery, acceptance notifications, My Work and reminders.
- W8.5: evidence upload/review and audit export.
- W8.6: visual timeline drag/resize.
- W8.7: roll-up, RAG and watchdog.
- W8.9: live AIMC hierarchy suggestions, governed preference memory and shared evidence evaluation wiring.
- future governed wave: Incident Workflow work-activity handoff.

## Gate disposition

PBFAG remains `NO-GO` for implementation appointment until the executable RED baseline is run and shown to fail for the intended missing capabilities, Foreman QP/ECAP are complete, and independent IAA issues a PASS.
