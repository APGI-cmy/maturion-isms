# PIT W8.3 Pre-Build Strategy Alignment — Scope Declaration

## Status

- Governing issue: `#1968`
- Parent Stage 12 authority: `#1767`
- Module: PIT
- Wave: Stage 12 / W8.3 pre-build alignment and implementation readiness
- CS2 Authority: Johan Ras
- Current disposition: `PRE-BUILD ALIGNMENT IN PROGRESS — RUNTIME IMPLEMENTATION NOT AUTHORISED`

## Purpose

Align the authoritative PIT pre-build chain with the confirmed product strategy before any W8.3 implementation builder is appointed.

The alignment covers:

- strict hierarchy: Project → Milestone → Deliverable → Task / Action Item;
- cascading accountability and subtree-scoped editing;
- guided setup and invitation journeys;
- governed cancellation with approved atomic re-parenting of incomplete work;
- date containment and lifecycle semantics;
- MMM → PIT hierarchy transformation and immutable source lineage;
- AIMC-routed, human-reviewed hierarchy suggestions;
- consent-governed learning from accepted user edits;
- reuse of MMM evidence assurance rather than duplicate PIT scoring;
- future PIT → Incident Workflow handoff boundary;
- QA-to-RED coverage representing the future build.

## In scope

1. App Description alignment addendum and governance mirror.
2. UX Workflow & Wiring alignment addendum.
3. Functional Requirements alignment addendum.
4. Technical Requirements and traceability alignment addendum.
5. Architecture, data, RLS, lifecycle and integration alignment addendum.
6. QA-to-RED contract, test catalogue additions, negative-path matrix and executable-harness contract.
7. PBFAG golden-path and failure-path alignment.
8. Stage 8 wave-boundary reconciliation.
9. Build Process Improvement Register entry.
10. Foreman QP, ECAP administrative evidence and independent IAA pre-brief/readiness disposition.

## Explicitly out of scope

- Runtime React implementation.
- Supabase schema or migration changes.
- RLS deployment.
- Vercel or Render configuration changes.
- Production or staging activation.
- Appointment of the W8.3 implementation builder.
- W8.4 assignment/notification runtime.
- W8.5 evidence upload/review runtime.
- W8.6 timeline engine runtime.
- W8.7 roll-up/watchdog runtime.
- W8.9 AIMC runtime.
- Closure of Issue `#1944`.

## Governing decisions

### Decision 1 — strict task parentage

Every task/action item must belong to a deliverable. Direct project-level ad-hoc tasks are not part of W8.3 and require a separately governed future extension.

### Decision 2 — no active descendants beneath a cancelled parent

A milestone or deliverable containing incomplete descendant work may not be cancelled directly. The requester must propose valid existing target parents. The project leader must approve. Re-parenting and cancellation must execute atomically and be append-only audited.

### Decision 3 — contextual responsibility and write scope

Users may view the wider project according to membership, but edit authority is restricted to their governed project, milestone, deliverable or task scope. Parent owners remain accountable for all descendant work.

### Decision 4 — date containment

`end < start` is hard-blocked. A child outside its parent date range requires an explicit warning, confirmation and recorded exception; no silent date mutation is permitted.

### Decision 5 — lifecycle wording

Normal users receive Archive, Cancel and Restore actions—not unrestricted Delete. Physical deletion is separately governed administrative cleanup only.

## Required exit evidence

The wave may return appointment `GO` only when:

- all addenda form a consistent authority chain;
- old conflicting clauses are explicitly superseded;
- requirement-to-TRS-to-architecture-to-RED traceability is complete;
- RED tests cover success, denial, invariant and audit paths;
- current runtime is demonstrably RED for the missing hierarchy capabilities;
- no RED test is weakened or deleted;
- PBFAG confirms the intended end-to-end journeys;
- independent IAA confirms readiness;
- CS2 accepts the final disposition.

No runtime implementation is authorised by this scope declaration.
