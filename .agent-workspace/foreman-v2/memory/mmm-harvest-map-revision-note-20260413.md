# MMM Harvest Map Revision — Change Note

**Wave**: mmm-harvest-map-revision  
**Issue**: maturion-isms#1345  
**Date**: 2026-04-13  
**Artifact Revised**: `modules/MMM/harvest-map/harvest-map.md` (v0.1.0 → v0.2.0)  
**Agent**: foreman-v2-agent v6.2.0 (POLC-Orchestration mode)  
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Summary

Nine governance-hardening improvements were applied to the MMM Harvest Map / Ownership
Transition Matrix per CS2 directive in issue #1345. These improvements strengthen the
artifact's suitability as the final governance-grade transition-control artifact before
MMM Stage 2 / FRS / TRS derivation proceeds.

No implementation code was produced. No builder delegation occurred. This is a governance
planning artifact revision only.

---

## Changes Made

### 1. Explicit source-state / switchover status model

**What changed**: Added a new §Source-State Vocabulary section defining five governed lifecycle
states: `ACTIVE_SOURCE`, `PARALLEL_RUN`, `TRACEABILITY_ONLY`, `READY_FOR_RETIREMENT`, `RETIRED`.
Added `Source-State` column to all capability tables and the Ownership Transition Summary.

**Why**: The original harvest map used descriptive prose for source-state transitions (e.g.
"becomes traceability-only") without a formal vocabulary. This made it impossible to
systematically track which capabilities had completed the transition and which were still in
progress. The new vocabulary provides a governed, enumerated set of states with explicit
transition direction rules.

**All capabilities are currently `ACTIVE_SOURCE`** because MMM is pre-Stage-2 and no
destination equivalents exist yet.

### 2. Formal switchover-gate logic

**What changed**: Added a new §Switchover Gate Model section defining 5 mandatory gate
conditions (SG-1 through SG-5) that must be satisfied before any source capability can
transition from `ACTIVE_SOURCE`/`PARALLEL_RUN` to `TRACEABILITY_ONLY` or beyond.

**Why**: The original harvest map had no explicit gate model for when a source capability
could be decommissioned. The switchover gate ensures that no source capability is retired
without: (a) destination equivalent implemented, (b) destination verified, (c) data/state
migration confirmed, (d) deprecation register updated, (e) source-state transition recorded.

### 3. Reassessment of overconfident "Adopt as-is" labels

**What changed**: Six rows were reclassified from "Adopt as-is" to "Adopt with convergence
wiring":
- **RR-01** (Free assessment flow): Requires shared auth alignment, MMM shell integration, telemetry wiring
- **RR-02** (Onboarding / organisation setup): Requires shared auth integration and MMM UX shell wiring
- **RR-06** (Dashboard / publication logic): Requires MMM UX shell integration, unified telemetry, CL-13 reconciliation
- **RR-08** (User hierarchy / invitation model): Requires shared auth alignment and data-shape adaptation
- **MT-01** (Criteria upload / parsing flow): Requires AIMC integration wiring, shared auth, MMM UX shell integration
- **MT-03** (Criterion-level evidence management): Requires data-shape alignment with MMM unified evidence model and telemetry integration

Additionally, **RR-07** (Action-planning / PIT transition logic) was reclassified from
"Adopt as-is" to "Adapt (minimal)" — the current logic requires adaptation to produce the
structured export format that PIT will consume.

**Why**: "Adopt as-is" in the original document was defined as "Capability transferred to
destination without structural change." However, several rows labelled as "Adopt as-is" actually
require meaningful convergence wiring (shared auth, telemetry, UX shell integration, data-shape
alignment) before they are fully operational at their destination. The reclassification introduces
"Adopt with convergence wiring" as a more accurate treatment category.

**Rows that correctly remain "Adopt as-is"**: RR-03 (pure data-structure adoption), RR-04
(pure governance-logic transfer), MT-04 (pure UI pattern transfer), MT-06 (pure data-model
adoption), MT-08 (pure governance-logic transfer), LG-02 (ingestion path transfer).

### 4. MMM ↔ PIT boundary definition

**What changed**: Added a new §MMM ↔ PIT Boundary Definition section explicitly defining
the ownership boundary, transition path, and FRS requirements for the MMM → PIT handoff.

**Why**: The original harvest map acknowledged that "PIT canonically owns implementation
plan execution" but did not make explicit: (a) that MMM owns findings and recommendations,
(b) that PIT owns executable plans, (c) that a formal export/interface contract is required,
(d) that no hidden PIT-owned planning logic may remain inside MMM. The new section eliminates
ambiguity for FRS derivation.

### 5. Framework-source vs evidence-source ingestion distinction

**What changed**: Added a new §Framework-Source vs Evidence-Source Ingestion section with a
detailed comparison table covering: what is ingested, purpose, AIMC role, metadata model,
lifecycle, downstream usage, canonical owner, and harvest map references.

**Why**: The original harvest map correctly placed document/knowledge handling under AIMC/KUC
ownership but did not distinguish between the two fundamentally different ingestion pathways.
Framework-source ingestion (standards, regulations → criteria hierarchy) and evidence-source
ingestion (audit evidence → scoring and findings) share governed infrastructure but differ in
metadata, lifecycle, and downstream usage. FRS/TRS specifications must treat them independently.

### 6. Legacy retirement wording tightened

**What changed**: LG-05 now explicitly states that it is "not a blanket retirement
authorization." Each legacy component must be individually named, audited against Roadmap
and MAT equivalents, and confirmed as a duplicate before retirement. A component-level
duplication audit artifact is now required before any retirement execution.

**Why**: The original LG-05 wording ("Any legacy component that replicates functionality
already present in Roadmap or MAT — without improvement — should be retired") functioned
as a quasi-retirement approval without requiring a component-level duplication audit. This
created the risk that legacy components could be retired without explicit confirmation that
a Roadmap/MAT equivalent exists and is functionally adequate.

### 7. CL-3.5 and CL-13 carry-over obligations anchored

**What changed**: Added a new §LKIAC Carry-Over Obligations section explicitly documenting:
- CL-3.5 (data-source registry carry-over): affects MT-01, LG-01, LG-02; must be resolved before/during FRS
- CL-13 (QA/dashboard legacy carry-over, extended scope): affects RR-06, LG-03; must be resolved before/during FRS

Added corresponding open questions OQ-005 and OQ-006.

**Why**: The original harvest map was detached from the active LKIAC dependency path. CL-3.5
and CL-13 represent active carry-over obligations from prior implementation work. Without
anchoring them in the harvest map, FRS/TRS derivation could proceed without resolving these
dependencies — creating a governance gap.

### 8. Migration-class clarity

**What changed**: Added a `Migration Class` column to all capability tables with the following
values: Data, Workflow, UI, Service, Governance, Reference-only.

**Why**: The original harvest map did not classify capabilities by migration type. Adding a
migration-class dimension makes Stage 2 / FRS / TRS derivation easier by allowing teams to
group capabilities by the type of migration work required. It also reduces hidden ambiguity
about what kind of work each transition entails.

### 9. Open-questions register extended

**What changed**: Added four new open questions:
- OQ-004: MMM → PIT export/interface contract definition (FRS)
- OQ-005: CL-3.5 data-source registry carry-over status (FRS)
- OQ-006: CL-13 extended scope QA/dashboard carry-over status (FRS)
- OQ-007: Switchover gate parameterisation per migration class (FRS/Architecture)

**Why**: The original register had 3 questions. The governance-hardening pass surfaced 4
additional questions that must be answered before FRS or Architecture derivation.

---

## Items Open by Design

The following items remain intentionally open:
- All source-states are `ACTIVE_SOURCE` — this is correct because MMM is pre-Stage-2
- Switchover gate evidence requirements are not yet parameterised per migration class (tracked as OQ-007)
- MMM → PIT export/interface contract is not yet defined (tracked as OQ-004)
- CL-3.5 and CL-13 resolution status is not yet confirmed (tracked as OQ-005, OQ-006)
- Component-level duplication audit for LG-05 has not been performed (tracked as OQ-003)
- Component audit of legacy UI assets for LG-03 has not been performed (tracked as OQ-002)

These are all correctly deferred to FRS or Architecture waves. The harvest map documents their
existence and tracking status.

---

## Non-Changes

The following were reviewed and confirmed as NOT requiring change:
- RR-03 (Maturity governance backbone): Correctly "Adopt as-is" — pure data-structure adoption with no wiring
- RR-04 (Approval logic): Correctly "Adopt as-is" — pure governance-logic transfer
- RR-05 (Live maturity engine): Correctly "Adapt" — adaptation scope is accurately described
- MT-04 (Evidence modal): Correctly "Adopt as-is" — pure UI pattern transfer
- MT-06 (Findings): Correctly "Adopt as-is" — pure data-model adoption
- MT-08 (HITL scoring): Correctly "Adopt as-is" — pure governance-logic transfer with no modification permitted
- LG-01 (Framework generation): Correctly "Redesign" — prior-generation implementation requires full redesign
- LG-04 (Authoring assets): Correctly "Traceability-only" — reference materials only

---

**Produced by**: foreman-v2-agent v6.2.0  
**Authority**: CS2 (Johan Ras / @APGI-cmy)
