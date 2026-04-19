# MMM — Stage 8 Convergence-Governance Addendum

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: Stage 8 Addendum (Convergence-Governance Overlay)
- **Status**: COMPLETE
- **Version**: 1.0.0
- **Date**: 2026-04-19
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: mat-specialist (delegated by foreman-v2-agent v6.2.0)
- **Issue**: [maturion-isms#1404](https://github.com/APGI-cmy/maturion-isms/issues/1404)
- **Wave**: mmm-stage8-addendum-20260419
- **Branch**: copilot/produce-convergence-governance-addendum
- **IAA Pre-Brief**: `.agent-admin/assurance/iaa-wave-record-mmm-stage8-addendum-20260419.md` — CLEARED
- **Foreman Session**: session-mmm-stage8-addendum-20260419
- **Upstream Authority (Stage 8)**: `modules/MMM/07-implementation-plan/implementation-plan.md` v1.0.0
- **Upstream Authority (Stage 7)**: `modules/MMM/06-pbfag/pbfag-checklist.md` — IAA token: IAA-session-mmm-stage7-pbfag-20260415-PASS
- **Harvest Map**: `modules/MMM/harvest-map/harvest-map.md` v0.2.1

---

## Section 1 — Purpose and Authority

This addendum is the **convergence-governance overlay** for MMM Stage 8. It supplements the canonical
Stage 8 Implementation Plan (`modules/MMM/07-implementation-plan/implementation-plan.md` v1.0.0)
without modifying it. The Implementation Plan remains stable and unchanged.

### 1.1 Role of the Implementation Plan

The Stage 8 Implementation Plan (`implementation-plan.md` v1.0.0) is the **canonical build-wave
authority** for MMM Stages 9–12. It defines the nine named build waves (B1–B9), their scope,
sequencing, dependencies, builder classes, and completion conditions. It is the primary document from
which all downstream stages derive.

### 1.2 Role of This Addendum

This addendum does **not** modify the wave plan. It does **not** create a new numbered stage. Instead,
it imposes governance constraints on how each wave executes by:

- Restating the source-state model and switchover gate conditions that remain in force throughout
  Stage 12 build execution.
- Defining explicit closure laws for waves B7 and B9 — clarifying what these waves prove and what they
  do not authorize.
- Specifying ownership boundary obligations that builders must observe in every wave.
- Declaring the carry-forward requirements that the Stage 9 Builder Checklist must import from this
  document.

### 1.3 Derivation Requirement

All downstream stages must derive from **both** the Implementation Plan **and** this addendum:

| Downstream Stage | Must Derive From |
|-----------------|-----------------|
| Stage 9 — Builder Checklist | `implementation-plan.md` v1.0.0 + this addendum |
| Stage 10 — IAA Pre-Brief | `implementation-plan.md` v1.0.0 + this addendum |
| Stage 11 — Builder Appointment | `implementation-plan.md` v1.0.0 + this addendum |
| Stage 12 — Build Execution | `implementation-plan.md` v1.0.0 + this addendum |

No downstream stage may treat the Implementation Plan as its sole authority. The governance
constraints in this addendum are mandatory overlays on the wave plan.

### 1.4 Authority

- **Authority**: CS2 (Johan Ras / @APGI-cmy)
- **Issue**: maturion-isms#1404
- **Delegated to**: mat-specialist by foreman-v2-agent v6.2.0

---

## Section 2 — Source-State / Switchover Overlay

### 2.1 Source-State Model (Verbatim from Harvest Map)

The following source-state model is drawn verbatim from
`modules/MMM/harvest-map/harvest-map.md` §Source-State Vocabulary. All states in this model
remain in force for every harvested capability throughout Stage 12 build execution.

| State | Meaning |
|-------|---------|
| ACTIVE_SOURCE | Capability is live in source system, current production path. No destination equivalent yet. |
| PARALLEL_RUN | Both source and destination live simultaneously. Entry: destination passes initial deployment verification. Exit: all SG-1 through SG-5 satisfied. |
| TRACEABILITY_ONLY | Source capability superseded. Retained for audit/historical reference only — no live execution. |
| READY_FOR_RETIREMENT | Switchover gate complete. All dependencies on source eliminated. Awaiting formal retirement execution. |
| RETIRED | Formally decommissioned. No code, routes, or data paths remain active. Traceability record archived. |

**Default source-state at Stage 12 entry**: All harvested capabilities (RR-xx, MT-xx, LG-xx)
remain `ACTIVE_SOURCE`. No destination equivalent has been built yet. This is the baseline from
which every build wave must be evaluated.

**Transition direction**: A capability may only move forward through the states in the order listed
above. Backward transitions require explicit CS2 authorization.

### 2.2 Source-State Governance Constraints

The following constraints apply throughout Stage 12 build execution without exception:

1. **Completion of B3–B9 does NOT automatically authorize source retirement or source-state
   transition.** Build wave completion (QA-to-Green) is evidence of destination readiness — it is
   not a switchover-gate pass.

2. **Any source-state transition still requires the defined switchover conditions AND CS2 approval.**
   The Foreman may propose a gate pass; CS2 must approve. No source-state transition is self-executing.

3. **Source-state changes must be explicitly recorded in the harvest map — they are NOT implied by
   build completion.** The harvest map source-state column is the authoritative record of each
   capability's lifecycle position. An unrecorded source-state change is a governance defect.

4. **Backward transitions (e.g., from TRACEABILITY_ONLY back to PARALLEL_RUN) require explicit
   CS2 authorization** and must be recorded in the deprecation register with rationale.

---

## Section 3 — Switchover Gate Law

### 3.1 Switchover Gate Conditions (Verbatim from Harvest Map)

The following switchover gate model is drawn from
`modules/MMM/harvest-map/harvest-map.md` §Switchover Gate Model. All five gate conditions
(SG-1 through SG-5) must be satisfied before any source capability moves past `PARALLEL_RUN`.

| Gate | Condition | Responsible Party |
|------|-----------|------------------|
| SG-1 | Destination capability implemented | Builder |
| SG-2 | Destination capability verified | QA (qa-builder) |
| SG-3 | Data/state migration completed where applicable | schema-builder |
| SG-4 | Deprecation register updated | Foreman |
| SG-5 | Source-state transition explicitly recorded | Foreman |

### 3.2 Gate Authority and Conditions

- **Gate authority**: CS2. The Foreman may propose a gate pass; CS2 must approve.
- **Destination readiness alone is insufficient**: all 5 conditions (SG-1 through SG-5) must be
  satisfied before any source capability moves past `PARALLEL_RUN`. A builder delivering a wave to
  QA-Green satisfies SG-1 and provides evidence toward SG-2; it does not satisfy SG-3, SG-4, or SG-5.
- **Partial gate pass is NOT permitted.** There is no "SG-1 through SG-3 pass" or "SG-1 through
  SG-4 pass". All five conditions must be satisfied as a unit.
- **SG-3 N/A clause**: Where the source capability holds no persistent data or state, SG-3 may be
  marked N/A with explicit rationale. This is the only permitted partial exception; it must be
  documented per capability and approved by CS2.

### 3.3 Evidence Retention

All gate evidence must be retained as traceability artifacts in
`modules/MMM/_legacy/switchover-evidence/` or equivalent governed location. Evidence retention
is a prerequisite for CS2 approval of any source-state transition.

### 3.4 Rollback Authority

If a destination equivalent fails post-switchover, CS2 may authorize rollback to `PARALLEL_RUN`.
This rollback must be recorded in the deprecation register with rationale. Rollback does not
constitute a governance failure but must be explicitly approved and documented.

---

## Section 4 — Ownership Boundary Table

### 4.1 Canonical Boundary Assignments

The following table carries forward the canonical ownership boundaries from the harvest map and
the Stage 3 FRS boundary definitions. These boundaries are in force for every wave in Stage 12.

| Boundary | Owned By | Scope | Anti-Pattern Warning |
|----------|---------|-------|---------------------|
| Findings / recommendations | MMM | Structured outputs from maturity assessment | Must not bleed into PIT-owned planning logic |
| Maturity model UX | MMM | All maturity-related user journeys (J-01–J-17) | — |
| Scoring / evidence business flows | MMM | Score computation, evidence ingestion, HITL confirmation | — |
| PIT export payload preparation | MMM | Structuring the JSON export package for PIT consumption | Must not execute PIT planning logic |
| Executable implementation plans | PIT | All implementation plan execution after export from MMM | PIT owns downstream; MMM must not replicate |
| AI routing / governance / provider abstraction | AIMC | All AI routing and provider-layer decisions | MMM must not wire directly to AI providers |
| AI service boundary | AIMC | Service layer between AI providers and consuming apps | No bypass permitted |
| Knowledge ingestion path | KUC (within AIMC) | Single governed document upload / ingestion path | MMM must not create parallel ingestion infrastructure |

### 4.2 Anti-Pattern Prohibition

> **WARNING: The following anti-patterns are prohibited and constitute ownership boundary violations
> during Stage 12 build execution:**
>
> 1. Hidden PIT-owned planning logic remaining inside MMM (in any wave from B1–B9). MMM may
>    contain recommendation-to-plan conversion stubs and the export payload preparation step; it
>    must not contain plan execution, task tracking, assignment logic, or status tracking.
>
> 2. Direct provider/LLM wiring from MMM bypassing AIMC (prohibited by TR-011 and architecture
>    §A3.1). All AI calls from MMM must route through the AIMC service boundary. No direct SDK
>    calls to AI providers are permitted within MMM code.
>
> 3. MMM inventing parallel ingestion infrastructure outside the governed KUC path (prohibited
>    by harvest map LG-02 disposition). All document uploads must go through the single common
>    ingestion path (Knowledge Upload Centre within AIMC scope). MMM must not create a separate
>    document parsing or upload endpoint.

---

## Section 5 — B7 Closure Law

**Wave reference**: mmm-build-wave-b7-boundary-integrations

### 5.1 What B7 PROVES

When wave B7 closes to QA-Green, it proves the following:

- **MMM-side live boundary wiring readiness**: AIMC, PIT, and KUC integration contracts are
  implemented on the MMM side and ready for live integration.
- **Contract conformance at the MMM boundary**: Request/response shapes conform to TR-011
  (AIMC interface), TR-017 (PIT export contract), and the KUC upload contract as defined in
  the Stage 4 TRS.
- **Proper AI/HITL/gateway behaviour on the MMM side**: The HITL confirmation gate is
  implemented; AI proposals are not auto-accepted; the AI proposal acceptance flow works
  correctly as specified.
- **All 176 S6 tests passing for the boundary integration domain** — those tests within the
  176-test RED suite that cover boundary integration behaviour are green.

### 5.2 What B7 Does NOT Prove

B7 does **not** prove the following:

- **Broader platform-level retirement or completion of all AIMC/LKIAC programme work.**
  B7 proves MMM's contract side — it does not prove that AIMC's internal implementation is
  complete or that the AIMC/LKIAC programme has reached any milestone.
- **Source retirement or deprecation completion elsewhere in the platform.** No source-state
  transition is authorized by B7 alone.
- **Closure of unrelated upstream knowledge/routing work not owned by MMM.** MMM closes only
  what is within its own module boundary.
- **That AIMC internal implementation is complete.** MMM proves its own contract side; AIMC's
  internal implementation is governed by AIMC's own stage model.
- **That PIT's downstream implementation planning capability is ready.** PIT owns its own
  build readiness; B7 proves MMM's export contract only.

---

## Section 6 — B9 Closure Law

**Wave reference**: mmm-build-wave-b9-golden-path-verification

### 6.1 What B9 PROVES

When wave B9 closes to QA-Green, it proves the following:

- **Destination readiness for MMM build execution**: all 10 golden paths verified GREEN
  (GP-001 through GP-010 as defined in the Stage 7 PBFAG golden path pack).
- **Golden-path and anti-regression conformance on the destination side**: NBR-001 (TanStack
  Query mutation cache invalidation) and NBR-002 (Supabase RLS write-block detection) are
  both verified as passing on the destination.
- **Stage 12 build execution is complete for MMM's own module scope**: all 9 waves (B1–B9)
  have been delivered to QA-Green.

### 6.2 What B9 Does NOT Automatically Authorize

B9 completion does **not** automatically authorize the following:

- **Source-state transition for ANY harvested capability.** Every capability classified in
  the harvest map (RR-01 through RR-08, MT-01 through MT-08, LG-01 through LG-05) remains
  at its current source-state until separate switchover gate evidence (SG-1 through SG-5)
  is assembled per capability and approved by CS2.
- **Retirement of harvested source capabilities.** Roadmap, MAT, and Legacy components
  remain `ACTIVE_SOURCE` or `PARALLEL_RUN` (as applicable) until all five switchover gate
  conditions are satisfied per capability. B9 Green is SG-1 evidence and partial SG-2
  evidence; it does not satisfy SG-3, SG-4, or SG-5.
- **Deprecation closure without separate switchover evidence and CS2 approval.** The
  deprecation register must be updated with explicit entries per capability before any
  source capability is formally retired.
- **Closure of platform-level AIMC/LKIAC/KUC programme work not directly proven by MMM
  build execution.** MMM closes only what is within its own module boundary. Broader
  AIMC/LKIAC programme work is governed on its own timeline.

---

## Section 7 — Stage 9 Carry-Forward Requirements

The Stage 9 Builder Checklist MUST import all of the following from this addendum. The Foreman
is responsible for verifying that these carry-forward items are present in the Builder Checklist
before authorizing Stage 9 completion.

| Requirement | What Stage 9 Must Include |
|-------------|--------------------------|
| Source-state conditions | For each harvested capability class (RR-xx, MT-xx, LG-xx), declare current source-state and switchover conditions that apply during build |
| Switchover preconditions | Confirmation that switchover gate (SG-1 through SG-5) is NOT implicitly satisfied by build wave completion |
| Deprecation-register update expectations | Each wave that implements a harvested capability must note deprecation-register update requirement at wave close |
| PIT boundary checks | Checklist item confirming no PIT-owned planning logic remains in MMM at each wave close |
| AIMC/KUC ownership-conformance checks | Checklist item confirming no direct provider wiring and no parallel ingestion infrastructure per wave |
| Separation of destination readiness and source retirement | Explicit checklist item at B9 close confirming that B9 PASS does NOT authorize source retirement — separate CS2 decision required |

### 7.1 Source-State Declaration Template

For each capability class, the Stage 9 Builder Checklist must declare:

```
Capability class: [RR-xx / MT-xx / LG-xx]
Current source-state at Stage 9 entry: ACTIVE_SOURCE
Switchover gate applicable: SG-1 through SG-5 (SG-3 N/A if no persistent data/state — state rationale)
Source retirement authorized by build wave completion? NO
Separate CS2 approval required for source-state transition? YES
```

### 7.2 Per-Wave PIT / AIMC / KUC Conformance Items

At the close of every build wave in Stage 12, the builder must confirm:

1. No PIT-owned planning logic was introduced in this wave.
2. No direct provider/LLM wiring was introduced in this wave.
3. No parallel document-ingestion infrastructure was introduced in this wave.
4. Deprecation register note filed (if this wave implements a harvested capability).

---

## Section 8 — LKIAC / Platform Dependency Nuance

### 8.1 MMM Module-Level Scope

MMM may proceed on the basis of its approved module-level prerequisites. The IAA tokens issued per
stage (through Stage 7 IAA-session-mmm-stage7-pbfag-20260415-PASS) confirm that MMM's own governance
chain is complete and that Stage 12 build execution is lawfully authorized, subject to the governance
constraints in this addendum.

### 8.2 Broader Platform Work Is Not Silently Closed

Broader AIMC/LKIAC, knowledge-domain, and AI-routing dependencies that remain active elsewhere in
the platform are **NOT** silently "closed" by MMM implementation alone. Specifically:

- The AIMC internal implementation, LKIAC programme, and KUC build lifecycle proceed on their own
  governance timeline — governed by AIMC's own stage model and CS2's broader programme decisions.
- MMM implementation does not authorize, certify, or close any AIMC, LKIAC, or KUC programme
  deliverable that is not directly within MMM's own module boundary.
- CL-13 core deliverables (D1–D4) remain PENDING as separate LKIAC items; they are not MMM
  blockers but are also not closed by MMM build completion.

### 8.3 MMM's Contracted Obligation at Boundaries

MMM must prove its own contractual side of each external boundary:

- **AIMC boundary**: Correct request/response shapes per TR-011; HITL gate implemented; no direct
  provider bypass; all AIMC calls routed through the service boundary.
- **PIT boundary**: Correct export payload per FR-049 / TR-016 through TR-018; no PIT-owned
  planning logic retained in MMM.
- **KUC boundary**: All document uploads routed through AIMC/KUC; no parallel ingestion endpoint.

MMM must not overclaim broader programme closure. MMM's B9 pass certifies MMM's own module;
it does not certify the readiness of the systems that MMM's boundaries connect to.

---

## Section 9 — Tracker / Governance Alignment Note

### 9.1 Status of This Addendum

This addendum is a **required Stage 8 convergence-governance supplement**. It supplements the
canonical Stage 8 Implementation Plan and imposes governance constraints that are mandatory for
all downstream stages. It does not create a new numbered stage.

### 9.2 Stage 9 Gate Condition

**Stage 9 Builder Checklist MUST NOT begin until this addendum has been committed with IAA
governance review.** The Foreman must confirm, at Stage 9 wave-start, that:

1. This addendum (`convergence-governance-addendum.md` v1.0.0) is committed and accessible.
2. The IAA governance review for wave mmm-stage8-addendum-20260419 has been completed
   (see IAA Pre-Brief: `.agent-admin/assurance/iaa-wave-record-mmm-stage8-addendum-20260419.md`).
3. The BUILD_PROGRESS_TRACKER Stage 8 section has been updated to reflect this addendum.

### 9.3 Tracker Update

The `modules/MMM/BUILD_PROGRESS_TRACKER.md` Stage 8 section has been updated in this wave to
record this addendum as a required Stage 8 supplement. See that document for the tracker entry.

### 9.4 No New Numbered Stage

This addendum supplements Stage 8. It does not constitute Stage 8.1 or any intermediate stage.
The canonical 12-stage model is unchanged. The next numbered stage after Stage 8 is Stage 9
(Builder Checklist).
