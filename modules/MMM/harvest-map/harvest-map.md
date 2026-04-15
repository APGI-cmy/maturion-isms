# MMM Harvest Map and Ownership Transition Matrix

**Artifact Type**: Convergence Control Planning Artifact  
**Module**: MMM — Maturity Model Management  
**Status**: DRAFT — Revised for CS2 review and approval  
**Version**: 0.3.0  
**Date**: 2026-04-14  
**Authority**: CS2 (Johan Ras / @APGI-cmy) — Issues maturion-isms#1300, maturion-isms#1345, maturion-isms#1358; Stage 3 FRS wave  
**Produced By**: foreman-v2-agent (POLC-Orchestration mode)  
**Revision**: Governance-hardening pass per maturion-isms#1345 (9 required improvements); normalization pass per maturion-isms#1358 (stale references corrected, LKIAC OQ answers updated); Stage 3 FRS pass (OQ-004, OQ-006, OQ-007 resolved)  
**Inputs Used**:
- `modules/MMM/00-app-description/MMM_app_description.md` v0.5.0 (CS2-approved, maturion-isms#1298)
- `modules/MMM/MMM_strategy.md` v0.1.0
- `modules/mat/00-app-description/MAT_APP_DESCRIPTION_v2.0.md`
- `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md`

---

## Purpose

This artifact is the explicit convergence-control bridge between the approved MMM convergence
intent (documented in `MMM_strategy.md` and `MMM_app_description.md`) and the concrete
migration and control decisions required before Stage 2 / FRS / TRS derivation proceeds.

It answers, for every harvested capability or capability group:
- **what** is being harvested
- **from where** (source system)
- **into what destination** (MMM / AIMC / PIT / Shared Platform / Retire)
- **with what treatment** (Adopt as-is / Adapt / Adopt with convergence wiring / Redesign / Traceability-only / Retire)
- **under whose canonical ownership** after convergence
- **what is the current source-state** and the governed transition path toward retirement or traceability
- **what migration class** applies (Data / Workflow / UI / Service / Governance / Reference-only)

This document is the governance authority for all FRS, TRS, and architecture derivation
decisions regarding capability ownership in the MMM convergence.

---

## Definitions

| Term | Meaning |
|------|---------|
| **Adopt as-is** | Capability transferred to destination without structural change; no convergence wiring, auth alignment, telemetry integration, UX integration, or data-shape adaptation required |
| **Adopt with convergence wiring** | Capability transferred to destination without functional redesign, but requiring integration wiring (shared auth, telemetry hooks, UX shell integration, or data-shape alignment) before it is fully operational at destination |
| **Adapt (minimal)** | Capability transferred with minor modification (limited scope, interface, or integration point changes); convergence wiring is included |
| **Adapt** | Capability transferred with significant modification (scope, interface, or integration points change materially) |
| **Redesign** | Capability rebuilt from scratch at destination using source as specification reference |
| **Traceability-only** | Source capability retained only as historical reference; no live execution |
| **Retire** | Capability decommissioned; no continuation at any destination |
| **Temporary parallel-run** | Capability continues in source and destination simultaneously until replacement is confirmed |
| **MMM** | Maturity Model Management — the new canonical maturity platform |
| **AIMC** | AI Management Centre — canonical owner of all AI routing, knowledge services, and AI governance |
| **PIT** | Project Implementation Tracker — canonical owner of implementation plan execution |
| **Shared Platform** | Reusable component library / shared infrastructure for the Maturion ecosystem |
| **KUC** | Knowledge Upload Centre — governed document/knowledge ingestion infrastructure (within AIMC scope) |

---

## Source-State Vocabulary

Each capability in this harvest map has a **source-state** indicating its current lifecycle position
in the convergence transition. The following states form the governed transition model:

| Source-State | Meaning |
|---|---|
| **ACTIVE_SOURCE** | Capability is live in the source system and is the current production path. No destination equivalent exists yet. |
| **PARALLEL_RUN** | Capability is live in both source and destination simultaneously. Destination equivalent exists but is not yet confirmed as the sole production path. Entry: destination capability passes initial deployment verification. Exit: switchover gate conditions SG-1 through SG-5 are satisfied. |
| **TRACEABILITY_ONLY** | Source capability has been superseded by the destination equivalent. Source is retained for audit trail and historical reference only — no live execution. |
| **READY_FOR_RETIREMENT** | Source capability has completed the switchover gate (see below). All dependencies on the source have been eliminated. Awaiting formal retirement execution. |
| **RETIRED** | Source capability has been formally decommissioned. No code, routes, or data paths remain active. Traceability record archived. |

**Transition direction**: A capability may only move forward through the states in the order listed above.
Backward transitions (e.g. from TRACEABILITY_ONLY back to PARALLEL_RUN) require explicit CS2 authorization
and must be recorded in the deprecation register with rationale.

**Default source-state**: All capabilities in this harvest map are currently `ACTIVE_SOURCE`.
The destination equivalent for each capability does not yet exist — MMM has produced the Stage 2
UX Workflow & Wiring Spec, pending CS2 approval. Stage 3 (FRS) is next. No destination
equivalents have been built yet, so all source capabilities remain `ACTIVE_SOURCE`.

---

## Switchover Gate Model

Before any source capability may transition from `ACTIVE_SOURCE` or `PARALLEL_RUN` into
`TRACEABILITY_ONLY`, `READY_FOR_RETIREMENT`, or `RETIRED`, the following switchover gate
must be satisfied. No exceptions without explicit CS2 authorization.

### Switchover Gate Requirements

| # | Gate Condition | Evidence Required | Responsible |
|---|---|---|---|
| SG-1 | **Destination equivalent implemented** | Destination capability exists, is deployed, and passes functional acceptance criteria defined in the FRS | Builder agent + QA-builder |
| SG-2 | **Destination verified** | Destination capability has been independently verified (IAA or QA pass) as functionally equivalent to the source capability for all documented use cases | IAA + Foreman (QP mode) |
| SG-3 | **Data / state migration path confirmed** | Where the source capability holds persistent data or state, the migration path to the destination has been defined, tested, and confirmed. If no data/state is involved, this gate is marked N/A with rationale. | Schema-builder + Foreman |
| SG-4 | **Deprecation register updated** | The source capability has been formally entered into the deprecation register with: source identifier, destination identifier, migration status, and planned retirement date | Foreman |
| SG-5 | **Source-state transition explicitly recorded** | The source-state column in this harvest map has been updated to reflect the new state, with a dated note recording the transition decision | Foreman |

### Switchover Gate Governance

- **Gate authority**: CS2. The Foreman may propose a gate pass; CS2 must approve.
- **Evidence retention**: All gate evidence must be retained as traceability artifacts in `modules/MMM/_legacy/switchover-evidence/` or equivalent governed location.
- **Partial gate pass**: Not permitted. All 5 conditions must be satisfied before a source capability moves past `PARALLEL_RUN`.
- **Rollback authority**: If a destination equivalent fails post-switchover, CS2 may authorize a rollback to `PARALLEL_RUN`. This rollback must be recorded in the deprecation register with rationale.

---

## Harvest Map — Complete Capability Table

> **Column guide**:
> - **Source System**: MAT / Maturity Roadmap / Legacy Maturity
> - **Capability / Asset**: The named capability or asset being harvested
> - **Current Role**: What this capability does in the source system today
> - **Destination**: MMM / AIMC / PIT / Shared Platform / Retire
> - **Treatment**: Adopt as-is / Adopt with convergence wiring / Adapt (minimal) / Adapt / Redesign / Traceability-only / Retire
> - **Migration Class**: Data / Workflow / UI / Service / Governance / Reference-only
> - **Canonical Owner After Convergence**: The module or component that will own this capability
> - **Source-State**: ACTIVE_SOURCE / PARALLEL_RUN / TRACEABILITY_ONLY / READY_FOR_RETIREMENT / RETIRED
> - **Why**: Rationale for the treatment and destination decision
> - **Stage of Formalisation**: App Description / UX Workflow / FRS / TRS / Architecture / later wave
> - **Migration / Decommission Note**: Specific action required; source state after handover
> - **Open Question?**: Yes / No (if Yes, the question is stated)

---

### Section A — From Maturity Roadmap

| # | Source System | Capability / Asset | Current Role | Destination | Treatment | Migration Class | Canonical Owner After Convergence | Source-State | Why | Stage of Formalisation | Migration / Decommission Note | Open Question? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RR-01 | Maturity Roadmap | Free assessment flow | Pre-subscription entry point; customer attraction and initial maturity self-evaluation without login | MMM | Adopt with convergence wiring | Workflow | MMM | ACTIVE_SOURCE | Free assessment is the primary customer acquisition entry point per Roadmap strategy. It survives in MMM as the front door. Roadmap backbone is the dominant conceptual skeleton for MMM. Reclassified from "Adopt as-is": requires shared auth alignment, MMM shell integration, and telemetry wiring before operational in MMM context. | App Description | Roadmap free-assessment routes decommissioned after MMM launch via switchover gate; traceability anchor retained | No |
| RR-02 | Maturity Roadmap | Onboarding / organisation setup | Post-subscription organisational information collection; establishes the organisational context for all maturity work | MMM | Adopt with convergence wiring | Workflow | MMM | ACTIVE_SOURCE | Roadmap onboarding logic is the canonical model for organisation setup in MMM. No alternative ownership is appropriate. Reclassified from "Adopt as-is": requires shared auth integration and MMM UX shell wiring. | App Description | Roadmap onboarding flow becomes TRACEABILITY_ONLY after MMM onboarding is confirmed live and switchover gate passed | No |
| RR-03 | Maturity Roadmap | Maturity governance backbone (Domain → MPS → Criteria hierarchy) | Defines the canonical hierarchical structure for all maturity standards and criteria | MMM | Adopt as-is | Data | MMM | ACTIVE_SOURCE | The Domain → MPS → Criteria hierarchy is the single canonical structure. MMM must be the sole owner — there may never be two separate copies of this hierarchy. MAT's copy is dissolved. This is a pure data-structure adoption with no integration wiring required. | App Description | MAT's Domain/MPS/Criteria ownership dissolved on MMM adoption; Roadmap's copy becomes the canonical MMM copy | No |
| RR-04 | Maturity Roadmap | Approval logic (criteria and framework approval workflow) | Controls framework publishing and maturity state transitions through defined approval steps | MMM | Adopt as-is | Governance | MMM | ACTIVE_SOURCE | Approval workflow is tightly coupled to the maturity governance backbone. Natural continuation in MMM. Pure governance-logic transfer. | FRS | Roadmap approval workflow decommissioned after equivalent MMM approval workflow confirmed and switchover gate passed | No |
| RR-05 | Maturity Roadmap | Live maturity engine (continuous scoring engine) | Maintains a live, continuously updated organisational maturity score based on evidence | MMM | Adapt | Service | MMM | ACTIVE_SOURCE | Core scoring capability. Must be adapted to accommodate both Roadmap-origin and MAT-origin evidence flows. Evidence now arrives from multiple modes (walkabout, modal upload, RADAM automated feed). | FRS / TRS | Roadmap scoring engine becomes TRACEABILITY_ONLY after MMM live engine is confirmed and switchover gate passed; adaptation scope defined in TRS | No |
| RR-06 | Maturity Roadmap | Dashboard / publication logic | Generates and publishes the live organisational maturity dashboard for internal and external consumption | MMM | Adopt with convergence wiring | UI | MMM | ACTIVE_SOURCE | Dashboard publication is a core Roadmap capability with no overlap in MAT or Legacy. Retain as MMM capability. Reclassified from "Adopt as-is": requires MMM UX shell integration, unified telemetry, and convergence with CL-13 extended scope dashboard carry-over obligations. | App Description | Roadmap dashboard routes decommissioned after MMM dashboard confirmed live and switchover gate passed | No |
| RR-07 | Maturity Roadmap | Action-planning / PIT transition logic | Converts maturity findings and recommendations into structured implementation plans for export to PIT | PIT | Adapt (minimal) | Workflow | PIT | ACTIVE_SOURCE | PIT canonically owns implementation plan execution. MMM owns findings and recommendations; PIT owns executable implementation plans. The handover requires a formal export/interface contract (findings → PIT import). The current action-planning logic requires adaptation to produce the structured export format that PIT will consume. No hidden PIT-owned planning logic may remain inside MMM. | FRS | Roadmap action-planning logic becomes TRACEABILITY_ONLY after PIT integration interface confirmed via switchover gate; export contract defined in MMM FRS as a formal interface specification | Yes — Q: Has the MMM → PIT export/interface contract been defined? Required before FRS. See OQ-004. |
| RR-08 | Maturity Roadmap | User hierarchy / invitation model | Defines and enforces the organisational user structure, role assignment, and invitation management | MMM | Adopt with convergence wiring | Data | MMM | ACTIVE_SOURCE | Roadmap user hierarchy is the canonical user model for the maturity platform. MAT had a separate model that is dissolved. MMM inherits the Roadmap model. Reclassified from "Adopt as-is": requires shared auth alignment and data-shape adaptation to accommodate MAT-origin user references. | App Description | MAT user model dissolved; Roadmap user model becomes canonical MMM model after auth alignment | No |

---

### Section B — From MAT

| # | Source System | Capability / Asset | Current Role | Destination | Treatment | Migration Class | Canonical Owner After Convergence | Source-State | Why | Stage of Formalisation | Migration / Decommission Note | Open Question? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| MT-01 | MAT | Criteria upload / parsing flow | Accepts document uploads (e.g. PDF of existing standard) and uses AI to extract and structure criteria into Domain → MPS → Criteria format | MMM | Adopt with convergence wiring | Workflow | MMM | ACTIVE_SOURCE | This is one of the two primary framework-origin modes in MMM (Mode A — Verbatim Upload). The capability is valuable and proven. Reclassified from "Adopt as-is": requires AIMC integration wiring for AI-assisted extraction (framework-source ingestion path — see §Framework vs Evidence Ingestion below), shared auth alignment, and MMM UX shell integration. | App Description / FRS | MAT criteria-upload routes decommissioned after MMM upload flow confirmed via switchover gate; AIMC governs AI extraction layer | No |
| MT-02 | MAT | Portable audit execution (field audit / audit workbench) | Enables structured audit execution against defined criteria, including evidence collection in the field | MMM | Adapt | Workflow | MMM | ACTIVE_SOURCE | MAT becomes the "Audit Workbench / Field Audit Mode" within MMM — not a peer product. The portable audit capability is valuable and survives but is repositioned as an operating mode of MMM, not a standalone identity. | FRS | MAT standalone audit routes become TRACEABILITY_ONLY after MMM audit mode confirmed via switchover gate; scope of adaptation defined in FRS | No |
| MT-03 | MAT | Criterion-level evidence management | Links, manages, and tracks evidence directly at the criterion level across findings, uploads, voice, photo, video, and transcripts | MMM | Adopt with convergence wiring | Data | MMM | ACTIVE_SOURCE | Criterion-level evidence management is one of the most important convergence points per MMM strategy. The evidence management modal from MAT is adopted into the MMM criterion view. Reclassified from "Adopt as-is": requires data-shape alignment with MMM unified evidence model (evidence-source ingestion path — see §Framework vs Evidence Ingestion below) and telemetry integration. | App Description / FRS | MAT evidence management routes decommissioned after MMM criterion evidence workspace confirmed via switchover gate | No |
| MT-04 | MAT | Evidence modal / evidence workspace | UI component presenting evidence management interface for a single criterion, supporting multi-type evidence capture | MMM | Adopt as-is | UI | MMM | ACTIVE_SOURCE | The evidence modal is a proven UX pattern that directly maps to the MMM criterion-level interaction model. Adopt as the canonical evidence entry point within the MMM criterion view. Pure UI pattern transfer with no integration wiring required. | FRS / UX Workflow | MAT evidence modal becomes source reference for MMM equivalent; decommissioned after MMM modal confirmed via switchover gate | No |
| MT-05 | MAT | Mobile / walkabout evidence capture | Enables evidence collection on mobile devices in the field, supporting offline or low-connectivity scenarios | MMM | Adapt | UI | MMM | ACTIVE_SOURCE | Walkabout capture is a differentiating capability that MMM must preserve. Adaptation needed to ensure alignment with MMM's unified evidence model and AIMC connectivity model. Offline patterns retained where technically viable. | FRS / TRS | MAT mobile routes become TRACEABILITY_ONLY after MMM mobile capability confirmed via switchover gate; offline support scope clarified in TRS | Yes — Q: What is the minimum offline capability requirement for MMM walkabout mode? To be answered in TRS. |
| MT-06 | MAT | Findings and recommendations | Generates structured findings per criterion based on evidence assessment and maturity scoring, with AI-assisted recommendations | MMM | Adopt as-is | Data | MMM | ACTIVE_SOURCE | MMM strategy mandates a shared findings model as the single source of truth from which both Report and PIT outputs are derived. MAT's findings model is adopted as the canonical base, enriched with Roadmap's governance context. Pure data-model adoption. | App Description / FRS | MAT findings routes decommissioned after MMM findings model confirmed via switchover gate; double-entry risk eliminated | No |
| MT-07 | MAT | Report-generation pathway | Produces PDF/DOCX audit report and structured JSON export from findings and evidence | MMM | Adapt | Service | MMM | ACTIVE_SOURCE | Report generation is one of the two output paths in the MMM output fork (Option A — Create Report). Adaptation needed to accommodate the unified finding model and new evidence structure from both Roadmap and audit modes. | FRS | MAT report routes decommissioned after MMM report output pathway confirmed via switchover gate; dual-output fork (Report / PIT) formalised in FRS | No |
| MT-08 | MAT | Human-in-the-loop scoring / confirmation | Requires human confirmation of AI-proposed maturity scores before recording; prevents unchecked AI scoring | MMM | Adopt as-is | Governance | MMM | ACTIVE_SOURCE | Human-in-the-loop scoring is a mandatory governance pattern per MMM app description. AI proposes; human confirms. This is non-negotiable and must be adopted without modification. Pure governance-logic transfer. | App Description | MAT HITL scoring logic becomes reference implementation for MMM; decommissioned after MMM scoring confirmation flow confirmed via switchover gate | No |

---

### Section C — From Legacy Maturity (`apps/maturion-maturity-legacy`)

| # | Source System | Capability / Asset | Current Role | Destination | Treatment | Migration Class | Canonical Owner After Convergence | Source-State | Why | Stage of Formalisation | Migration / Decommission Note | Open Question? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| LG-01 | Legacy Maturity | Framework generation (AI-assisted new criteria creation) | Uses AI to generate new maturity frameworks from scratch, creating domains, MPSs, and criteria based on organisational inputs | MMM | Redesign | Service | MMM | ACTIVE_SOURCE | Framework generation is one of the two primary framework-origin modes in MMM (Mode B — New Criteria Creation). The legacy implementation is a prior-generation implementation. MMM should redesign this capability using AIMC as the AI layer (framework-source ingestion path), with the legacy implementation as the specification reference. | FRS / TRS | Legacy framework-generation routes decommissioned after MMM Mode B (New Criteria Creation) confirmed live via switchover gate; AIMC governs AI layer | No |
| LG-02 | Legacy Maturity | Knowledge / document handling (ingestion and management) | Provides document upload, knowledge storage, and retrieval capabilities for maturity-related materials | AIMC | Adopt as-is | Data | AIMC (KUC) | ACTIVE_SOURCE | Per MMM strategy, all document uploads must go through the single common ingestion path (Knowledge Upload Centre within AIMC scope). This prevents duplicated upload logic and parsing entry points. Legacy document handling is dissolved into AIMC/KUC. This is an evidence-source ingestion path (see §Framework vs Evidence Ingestion below). | App Description / FRS | Legacy document-handling routes decommissioned after AIMC/KUC confirmed as the single ingestion path via switchover gate; metadata extension per MMM strategy §8 required | No |
| LG-03 | Legacy Maturity | Reusable UI / workflow assets | UI components, patterns, and workflow building blocks developed in the legacy context that remain applicable to MMM | Shared Platform | Adapt | UI | Shared Platform | ACTIVE_SOURCE | Reusable UI and workflow assets that are still technically sound and design-compatible should be adapted into the Shared Platform component library. This prevents duplication and accelerates MMM assembly. Components must be individually evaluated before adoption via a component-level duplication audit. | Architecture | Individual component audit required before adoption; components that do not meet current design system standards are retired via switchover gate. Component audit is a prerequisite — no blanket adoption permitted. | Yes — Q: Has a component audit of the legacy UI assets been performed? To be scoped in the Architecture wave. |
| LG-04 | Legacy Maturity | Maturity authoring assets (templates, scoring tables, framework reference docs) | Provides authoring materials used during maturity framework creation and criteria definition | MMM | Traceability-only | Reference-only | MMM | ACTIVE_SOURCE | Legacy authoring assets are reference materials that informed prior implementations. They are not directly adoptable as live assets in MMM but serve as specification references for FRS/TRS derivation. Traceability link required. | FRS | Legacy authoring assets archived as traceability references in modules/MMM/_legacy/; no live execution; source-state transitions directly to TRACEABILITY_ONLY (no PARALLEL_RUN phase needed as these are reference materials) | No |
| LG-05 | Legacy Maturity | Legacy components identified for retirement (duplicates of Roadmap/MAT capabilities) | Any legacy capability that duplicates Roadmap or MAT capabilities without meaningful differentiation | Retire | Retire | Reference-only | N/A | ACTIVE_SOURCE | Per MMM strategy, duplication must be eliminated. **LG-05 is not a blanket retirement authorization.** Each legacy component must be individually named, audited against Roadmap and MAT equivalents, and confirmed as a duplicate before retirement. A component-level duplication audit artifact must be produced before any retirement execution. LG-05 establishes the policy; named retirement decisions are required per component. | App Description | **Prerequisite**: Component-level duplication audit must be completed before any retirement execution. Each retired component must have: (a) named component identifier, (b) confirmed Roadmap/MAT equivalent, (c) duplication-audit evidence reference. Legacy duplication candidates decommissioned only after duplication audit is complete and approved by CS2. | Yes — Q: Has a full duplication audit of legacy vs Roadmap/MAT been performed? To be scoped in the Architecture wave. See OQ-003. |

---

## Ownership Transition Summary

This section summarises the canonical ownership decision for each major capability area after MMM convergence is complete.

| Capability Area | Current Owners | Canonical Owner After Convergence | Treatment | Source-State | Source State Post-Convergence |
|---|---|---|---|---|---|
| Maturity Framework Hierarchy (Domain/MPS/Criteria) | Roadmap (primary), MAT (copy) | **MMM** | Adopt as-is | ACTIVE_SOURCE | Roadmap hierarchy definition/data is migrated into MMM as the canonical hierarchy baseline; after switchover gate, the Roadmap system becomes TRACEABILITY_ONLY and the MAT copy is dissolved |
| Free Assessment Entry | Roadmap | **MMM** | Adopt with convergence wiring | ACTIVE_SOURCE | Roadmap routes decommissioned via switchover gate |
| Onboarding / Organisation Setup | Roadmap | **MMM** | Adopt with convergence wiring | ACTIVE_SOURCE | Roadmap routes decommissioned via switchover gate |
| Approval Logic | Roadmap | **MMM** | Adopt as-is | ACTIVE_SOURCE | Roadmap routes decommissioned via switchover gate |
| Live Maturity Scoring Engine | Roadmap | **MMM** | Adapt | ACTIVE_SOURCE | Roadmap engine becomes TRACEABILITY_ONLY after adaptation and switchover gate |
| Dashboard / Publication | Roadmap | **MMM** | Adopt with convergence wiring | ACTIVE_SOURCE | Roadmap dashboard decommissioned via switchover gate; CL-13 carry-over obligations apply |
| User Hierarchy / Invitation | Roadmap | **MMM** | Adopt with convergence wiring | ACTIVE_SOURCE | MAT user model dissolved; Roadmap model becomes canonical after auth alignment |
| Criteria Upload / Import | MAT | **MMM** | Adopt with convergence wiring | ACTIVE_SOURCE | MAT routes decommissioned via switchover gate; AIMC integration wiring required |
| Portable / Field Audit Execution | MAT | **MMM** (Audit Workbench mode) | Adapt | ACTIVE_SOURCE | MAT standalone identity dissolved via switchover gate |
| Criterion-level Evidence Management | MAT | **MMM** | Adopt with convergence wiring | ACTIVE_SOURCE | MAT evidence routes decommissioned via switchover gate |
| Evidence Modal / Workspace | MAT | **MMM** | Adopt as-is | ACTIVE_SOURCE | MAT modal becomes MMM reference implementation |
| Mobile / Walkabout Evidence Capture | MAT | **MMM** | Adapt | ACTIVE_SOURCE | MAT mobile routes become TRACEABILITY_ONLY via switchover gate |
| Findings and Recommendations | Roadmap + MAT (overlap) | **MMM** | Adopt as-is | ACTIVE_SOURCE | Unified model; both overlap-owners dissolved via switchover gate |
| Report Generation | MAT | **MMM** | Adapt | ACTIVE_SOURCE | MAT report routes decommissioned via switchover gate |
| Human-in-the-loop Scoring | MAT | **MMM** | Adopt as-is | ACTIVE_SOURCE | MAT HITL logic becomes reference; decommissioned via switchover gate |
| Action Planning / PIT Transition | Roadmap | **PIT** | Adapt (minimal) | ACTIVE_SOURCE | Roadmap action-planning becomes TRACEABILITY_ONLY; PIT export/interface contract required in FRS |
| AI Routing and Provider Abstraction | Dispersed (MAT local + Roadmap) | **AIMC** | Redesign | ACTIVE_SOURCE | All dispersed AI routing dissolved into AIMC via switchover gate |
| Framework Generation (AI) | Legacy Maturity | **MMM** (via AIMC) | Redesign | ACTIVE_SOURCE | Legacy routes decommissioned after MMM Mode B confirmed via switchover gate |
| Knowledge / Document Ingestion | Legacy Maturity + MAT + Roadmap (dispersed) | **AIMC (KUC)** | Adopt as-is | ACTIVE_SOURCE | All dispersed ingestion routes dissolved into AIMC/KUC via switchover gate |
| Reusable UI / Workflow Assets | Legacy Maturity | **Shared Platform** | Adapt | ACTIVE_SOURCE | Legacy assets individually harvested or retired (component audit required) |
| Maturity Authoring Reference Assets | Legacy Maturity | **MMM** (traceability) | Traceability-only | ACTIVE_SOURCE | Archived in modules/MMM/_legacy/ |

---

## MMM ↔ PIT Boundary Definition

This section makes explicit the ownership boundary between MMM and PIT for action-planning and
implementation plan capabilities.

### Ownership Boundary

| Domain | Owner | Boundary Rule |
|---|---|---|
| **Maturity findings and recommendations** | MMM | MMM owns the generation, storage, and presentation of all maturity findings and recommendations. These are the output of audit/assessment cycles. |
| **Executable implementation plans** | PIT | PIT owns the conversion of findings into executable, trackable implementation plans. PIT is the canonical owner of implementation plan execution lifecycle. |
| **Export/interface contract** | MMM (producer) → PIT (consumer) | A formal export/interface contract must be defined in the MMM FRS specifying the exact data shape, trigger conditions, and handover protocol for findings → PIT import. |
| **Planning logic inside MMM** | PROHIBITED | No hidden PIT-owned planning logic may remain inside MMM. If any current Roadmap action-planning logic contains executable plan management (task tracking, assignment, status tracking), that logic must be extracted to PIT. MMM may contain recommendation-to-plan conversion stubs but not plan execution. |

### Transition Path

1. MMM generates findings and recommendations from audit/assessment evidence
2. User triggers "Create Implementation Plan" (MMM output fork Option B)
3. MMM produces a structured export package conforming to the MMM → PIT interface contract
4. PIT receives the export package and creates the executable implementation plan
5. PIT owns all downstream plan lifecycle (assignment, tracking, status, completion)

### FRS Requirement

The MMM FRS must define the MMM → PIT export/interface contract as a formal interface specification.
This is tracked as OQ-004 in the Open Questions Register.

---

## Framework-Source vs Evidence-Source Ingestion

Under AIMC/KUC ownership, two distinct ingestion pathways share governed infrastructure but differ
in metadata, lifecycle, and downstream usage. This distinction must be maintained throughout
FRS/TRS derivation.

### Ingestion Pathway Comparison

| Dimension | Framework-Source Ingestion | Evidence-Source Ingestion |
|---|---|---|
| **What is ingested** | Maturity framework documents (standards, regulations, compliance frameworks) — e.g. ISO 27001, NIST CSF, PCI-DSS | Audit evidence (documents, photos, voice recordings, transcripts, automated feeds) |
| **Purpose** | Populate the Domain → MPS → Criteria hierarchy with structured criteria | Link evidence to specific criteria for maturity scoring and findings |
| **AIMC role** | AI-assisted extraction: parse source document → extract domains, MPSs, criteria → structure into hierarchy | AI-assisted classification: parse evidence → classify against criteria → suggest maturity scores |
| **Metadata model** | Framework metadata: standard name, version, effective date, regulatory body, domain mappings, criteria count | Evidence metadata: evidence type, capture date, capture method, linked criterion, audit session, contributor |
| **Lifecycle** | Long-lived: framework definitions persist and are versioned. Updates are infrequent and governance-gated. | Short-to-medium-lived: evidence is collected per assessment cycle. New evidence may supersede prior evidence for the same criterion. |
| **Downstream usage** | Feeds the maturity governance backbone (RR-03). Defines what is measured. | Feeds the scoring engine (RR-05) and findings model (MT-06). Provides the measurement input. |
| **Canonical owner** | MMM (framework definition) via AIMC (extraction layer) | MMM (evidence management) via AIMC (classification layer) |
| **Harvest map refs** | MT-01, LG-01, LG-02 | MT-03, MT-04, MT-05 |

### Shared Infrastructure

Both pathways share:
- AIMC/KUC governed upload endpoints
- Common document parsing infrastructure
- Shared auth and access control
- Unified telemetry and audit logging

### Governance Rule

Framework-source and evidence-source ingestion must not be conflated in FRS/TRS specifications.
Each pathway must be specified independently with its own metadata model, validation rules, and
lifecycle management — even though they share underlying AIMC infrastructure.

---

## LKIAC Carry-Over Obligations

This section explicitly anchors the known LKIAC (Legacy Known Issues and Carry-overs) obligations
that the harvest map must account for. These obligations represent active dependency paths that
connect prior implementation work to the MMM convergence.

### CL-3.5 — Data-Source Registry Carry-Over

**LKIAC Reference**: CL-3.5  
**Obligation**: Data-source registry carry-over obligations are tracked through CL-3.5.  
**Impact on Harvest Map**: The data-source registry is a prerequisite for the framework-source
ingestion pathway (MT-01, LG-01). The registry defines which external data sources are governed
and how they map to the AIMC/KUC ingestion infrastructure. If CL-3.5 is not complete, the
framework ingestion pathway cannot be fully specified in the FRS.

**Affected rows**: MT-01, LG-01, LG-02  
**Status**: ✅ RESOLVED — CL-3.5 is COMPLETE (session-082, 2026-03-01; 27/27 tests GREEN).
DEP-008 at `PARALLEL-RUN`. CP-3.5 CS2-approved 2026-04-03. See
`modules/MMM/_readiness/lkiac-carryover-closure-note.md` v1.0.0.  
**Tracked in**: Open Questions Register (OQ-005 — ANSWERED)

### CL-13 — QA/Dashboard Legacy Carry-Over (Extended Scope)

**LKIAC Reference**: CL-13 (extended scope)  
**Obligation**: QA/dashboard legacy carry-over obligations are tracked through CL-13 extended scope.  
**Impact on Harvest Map**: CL-13 covers dashboard and QA capabilities that overlap with RR-06
(Dashboard / publication logic). The extended scope includes legacy dashboard components that
must be reconciled with the MMM dashboard before the Roadmap dashboard can be decommissioned.

**Affected rows**: RR-06, LG-03  
**Status**: ✅ RESOLVED (extended scope) — CL-13 extended scope (D5/D6/D7) is COMPLETE
(session-083, 2026-03-01; 15/15 tests GREEN). DEP-005/006/007 at `PARALLEL-RUN`. CL-13 core
deliverables (D1–D4) remain PENDING as a separate LKIAC item. See
`modules/MMM/_readiness/lkiac-carryover-closure-note.md` v1.0.0.  
**Tracked in**: Open Questions Register (OQ-006 — PARTIALLY ANSWERED)

### Governance Rule

The harvest map is not detached from the LKIAC dependency path. Any FRS/TRS derivation that
proceeds without confirming CL-3.5 and CL-13 resolution status must be flagged as a governance
gap.

---

## Open Questions Register

All open questions surfaced during harvest map production are recorded here. Each must be answered before the associated Stage of Formalisation artifact (FRS, TRS, or Architecture) is completed.

| # | Ref | Question | Stage Required By | Responsibility | Status |
|---|---|---|---|---|---|
| OQ-001 | MT-05 | What is the minimum offline capability requirement for MMM walkabout mode? Is full offline evidence storage required, or is low-connectivity / cached-submission sufficient? | TRS | CS2 + Product Owner | OPEN |
| OQ-002 | LG-03 | Has a component audit of the legacy UI assets been performed? Which components are design-system-compatible and ready for Shared Platform harvesting? | Architecture wave | Foreman + Architecture team | ✅ RESOLVED (Stage 5 Architecture, 2026-04-14) — Component audit complete. The sub-folders in `modules/MMM/04-architecture/capabilities/` (erm-framework, risk-assessment, threat-module, vulnerability-module, wrac) are ERM/WRAC risk management artifacts from a prior module migration. They are not MMM architecture assets and are not design-system-compatible candidates for Shared Platform harvesting in the MMM maturity context. Disposition: TRACEABILITY-ONLY for all five sub-folders. MMM components are to be built fresh from FRS/TRS specifications. See `modules/MMM/04-architecture/architecture.md` §A11 and `modules/MMM/04-architecture/capabilities/index.md`. |
| OQ-003 | LG-05 | Has a full duplication audit of legacy vs Roadmap/MAT capabilities been completed? Which legacy components are confirmed duplicates for retirement? This audit must produce a named-component-level artifact before any retirement execution. | Architecture wave | Foreman + Architecture team | ✅ RESOLVED (Stage 5 Architecture, 2026-04-14) — Duplication audit complete. Named-component-level audit confirms: None of the ERM/WRAC sub-folder files (7 named component sets audited) are duplicates of MAT or Roadmap maturity capabilities — they are a different domain. Active duplication candidates (RR-01, RR-02, RR-03, MT-01, MT-02, MT-03, MT-06) remain ACTIVE_SOURCE pending MMM build and switchover gate (SG-1 through SG-5) completion. Duplicate detection rule, canonical source rule, retirement/supersession rule, and architecture-level enforcement points are all defined. See `modules/MMM/04-architecture/architecture.md` §A12. |
| OQ-004 | RR-07 | Has the MMM → PIT export/interface contract been defined? What is the exact data shape, trigger conditions, and handover protocol for findings → PIT import? This contract must be formalised in the MMM FRS. | FRS | Foreman + PIT team | ✅ RESOLVED (Stage 3 FRS, 2026-04-14) — Interface contract formalized in FR-049: data shape (structured JSON payload: findings[], recommendations[], implementation_tasks[]), trigger (user confirms on J-14 output fork screen), handover protocol (POST /api/pit-export/:id/send; PIT acknowledges via callback; sent_at recorded), evidence return path (POST /api/evidence/pit-return). See `modules/MMM/02-frs/functional-requirements.md` FR-049 and FR-054. |
| OQ-005 | CL-3.5 | What is the current resolution status of the CL-3.5 data-source registry carry-over? Is the registry complete enough to support framework-source ingestion pathway specification in the FRS? | FRS | Foreman + CS2 | ✅ ANSWERED — CL-3.5 is COMPLETE (session-082, 27/27 tests GREEN, DEP-008 at PARALLEL-RUN, CP-3.5 CS2-approved 2026-04-03). The data-source registry is available to support FRS specification. See `modules/MMM/_readiness/lkiac-carryover-closure-note.md`. |
| OQ-006 | CL-13 | What is the current resolution status of the CL-13 extended scope QA/dashboard carry-over? Have legacy dashboard components been reconciled with the MMM dashboard specification? | FRS | Foreman + CS2 | ✅ RESOLVED (Stage 3 FRS, 2026-04-14) — CL-13 extended scope (D5/D6/D7) components are compatible with the MMM dashboard specification (FR-050). No reconciliation wave required before FRS approval. CL-13 core deliverables (D1–D4) remain PENDING as separate LKIAC items — not MMM blockers. See `modules/MMM/02-frs/functional-requirements.md` FR-051. |
| OQ-007 | Switchover Gate | What exact rule and evidence standard governs a move from `PARALLEL_RUN` to `TRACEABILITY_ONLY` / `RETIRED`? The switchover gate model in this document provides the framework, but the specific evidence requirements for each capability may vary. Should the switchover gate be parameterised per migration class? Must be resolved before the first capability enters `PARALLEL_RUN` (i.e. before any destination equivalent reaches deployment verification). | FRS / Architecture | CS2 + Foreman | ✅ RESOLVED (Stage 3 FRS, 2026-04-14) — Standard gate model (SG-1 through SG-5) applies to all migration classes. SG-3 N/A clause provides effective parameterisation for data-free migrations. No per-class gate model required. Any class-specific deviation requires CS2 authorization and harvest-map update. See `modules/MMM/02-frs/functional-requirements.md` FR-058. |

---

## Non-Goals Confirmed

Per issue #1300, this artifact does **not** include:
- final FRS wording
- final TRS wording
- implementation code
- builder appointment
- architecture completion

This is a convergence-control artifact to support lawful and lossless FRS/TRS derivation.

---

## Acceptance Criteria Verification

| Criterion | Status |
|---|---|
| Harvest map artifact created | ✅ This document |
| MAT capabilities explicitly classified | ✅ Section B (MT-01 through MT-08) |
| Maturity Roadmap capabilities explicitly classified | ✅ Section A (RR-01 through RR-08) |
| Legacy maturity capabilities explicitly classified | ✅ Section C (LG-01 through LG-05) |
| Destination owner declared for each major capability group | ✅ See Ownership Transition Summary |
| Treatment decision declared for each major capability group | ✅ All rows include Treatment column |
| Retirement / traceability-only decisions made explicit | ✅ LG-04 (Traceability-only), LG-05 (Retire with component audit), RR-07 (PIT), LG-02 (AIMC) |
| No duplicate canonical ownership remains unaddressed | ✅ Domain/MPS/Criteria overlap resolved (RR-03); Findings overlap resolved (MT-06); AI routing consolidated to AIMC |
| Artifact suitable to guide Stage 2, FRS, and TRS derivation | ✅ All capabilities classified to destination with treatment, source-state, and migration class declared |
| Explicit source-state / switchover status model added (v0.2.0) | ✅ See §Source-State Vocabulary |
| Formal switchover-gate logic added (v0.2.0) | ✅ See §Switchover Gate Model |
| Overused "Adopt as-is" rows reviewed and corrected (v0.2.0) | ✅ RR-01, RR-02, RR-06, RR-08, MT-01, MT-03 reclassified to "Adopt with convergence wiring" |
| MMM ↔ PIT handoff clarified (v0.2.0) | ✅ See §MMM ↔ PIT Boundary Definition |
| Framework-ingestion vs evidence-ingestion distinguished (v0.2.0) | ✅ See §Framework-Source vs Evidence-Source Ingestion |
| Legacy retirement wording tightened (v0.2.0) | ✅ LG-05 now requires component-level duplication audit; blanket retirement prohibited |
| CL-3.5 and CL-13 carry-over obligations anchored (v0.2.0) | ✅ See §LKIAC Carry-Over Obligations |
| Migration-class clarity added (v0.2.0) | ✅ Migration Class column added to all capability rows |
| Open-question register extended (v0.2.0) | ✅ OQ-004 through OQ-007 added |
| OQ-005 (CL-3.5) answered (v0.2.1) | ✅ CL-3.5 COMPLETE — see §LKIAC Carry-Over Obligations |
| OQ-006 (CL-13) partially answered (v0.2.1) | ✅ CL-13 extended scope COMPLETE — see §LKIAC Carry-Over Obligations |
| Pre-Stage-2 stale references corrected (v0.2.1) | ✅ Default source-state note updated |
| OQ-004 (PIT interface contract) resolved (v0.3.0) | ✅ Interface contract formalized in Stage 3 FRS FR-049 and FR-054 |
| OQ-006 (CL-13 dashboard) fully resolved (v0.3.0) | ✅ CL-13 extended scope confirmed compatible with MMM dashboard spec (FR-050, FR-051) |
| OQ-007 (switchover gate parameterisation) resolved (v0.3.0) | ✅ Standard SG-1–SG-5 gate model applies to all migration classes; SG-3 N/A clause handles data-free migrations (FR-058) |

---

## Ripple / Cross-Agent Assessment

This revision introduces governance-strengthening changes to the harvest map that have
downstream implications for other modules and agents.

**Downstream ripple assessment**: RIPPLE IDENTIFIED — documentation-level only.

### Identified Ripple Points

| # | Affected Module/Agent | Impact | Action Required | Blocking? |
|---|---|---|---|---|
| R-01 | PIT (pit-specialist) | MMM ↔ PIT boundary definition now requires a formal export/interface contract in the MMM FRS. PIT team must be engaged when FRS derivation begins. | Engage PIT team at FRS wave start | No (documentation only; no immediate implementation) |
| R-02 | AIMC | Framework-source vs evidence-source ingestion distinction now formally documented. AIMC/KUC FRS must respect this distinction. | AIMC team must align at FRS wave start | No (documentation only) |
| R-03 | Maturity Roadmap | Dashboard carry-over obligations now tied to CL-13 extended scope. Roadmap dashboard decommission is gated by CL-13 resolution. | Monitor CL-13 resolution status | No (planning constraint only) |
| R-04 | Legacy Maturity | Legacy retirement now requires component-level duplication audit. Blanket retirement is prohibited. | Component audit must be scoped in Architecture wave | No (planning constraint only) |

### Non-Impacted Agents

- Builder agents (api-builder, schema-builder, ui-builder, integration-builder): Not triggered — no implementation artifacts produced
- governance-liaison-isms-agent: Not triggered — this is a MMM-internal planning artifact, not a governance canon change
- CodexAdvisor-agent: Not triggered — no agent contract files modified

---

## Authority and Governance

| Field | Value |
|---|---|
| **CS2 Authorization** | maturion-isms#1300 (original), maturion-isms#1345 (revision — opened by @APGI-cmy), maturion-isms#1358 (normalization), Stage 3 FRS wave (OQ resolutions 2026-04-14) |
| **Wave** | mmm-harvest-map-revision (v0.2.0); mmm-doc-normalization (v0.2.1); mmm-stage3-frs (v0.3.0) |
| **Session** | session-mmm-harvest-map-revision-20260413 (v0.2.0); session-mmm-doc-normalization-20260413 (v0.2.1); session-mmm-stage3-frs-20260414 (v0.3.0) |
| **Produced By** | foreman-v2-agent v6.2.0 (POLC-Orchestration mode) |
| **Original Version** | v0.1.0 (2026-04-08, session-161-mmm-harvest-map-20260408) |
| **Current Version** | v0.3.0 (2026-04-14, Stage 3 FRS OQ resolution pass) |
| **IAA Pre-Brief** | v0.2.0 / revision: `.agent-admin/assurance/iaa-wave-record-mmm-harvest-map-revision-20260413.md`; v0.2.1 / normalization: `.agent-admin/assurance/iaa-wave-record-mmm-doc-normalization-20260413.md`; v0.3.0 / stage3-frs: `.agent-admin/assurance/iaa-wave-record-mmm-stage3-20260414.md` |
| **Next Step** | CS2 review/approval of Stage 3 FRS → Stage 4 (TRS) wave-start |
