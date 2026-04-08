# MMM Harvest Map and Ownership Transition Matrix

**Artifact Type**: Convergence Control Planning Artifact  
**Module**: MMM — Maturity Model Management  
**Status**: DRAFT — For CS2 review and approval  
**Version**: 0.1.0  
**Date**: 2026-04-08  
**Authority**: CS2 (Johan Ras / @APGI-cmy) — Issue maturion-isms#1300  
**Produced By**: foreman-v2-agent (POLC-Orchestration mode)  
**Inputs Used**:
- `modules/MMM/00-app-description/MMM_app_description.md` v0.4.0
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
- **with what treatment** (Adopt as-is / Adapt / Redesign / Traceability-only / Retire)
- **under whose canonical ownership** after convergence
- **whether the source remains active, temporary, traceability-only, or retired**

This document is the governance authority for all FRS, TRS, and architecture derivation
decisions regarding capability ownership in the MMM convergence.

---

## Definitions

| Term | Meaning |
|------|---------|
| **Adopt as-is** | Capability transferred to destination without structural change |
| **Adapt** | Capability transferred with modification (scope, interface, or integration points change) |
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

## Harvest Map — Complete Capability Table

> **Column guide**:
> - **Source System**: MAT / Maturity Roadmap / Legacy Maturity
> - **Capability / Asset**: The named capability or asset being harvested
> - **Current Role**: What this capability does in the source system today
> - **Destination**: MMM / AIMC / PIT / Shared Platform / Retire
> - **Treatment**: Adopt as-is / Adapt / Redesign / Traceability-only / Retire
> - **Canonical Owner After Convergence**: The module or component that will own this capability
> - **Why**: Rationale for the treatment and destination decision
> - **Stage of Formalisation**: App Description / UX Workflow / FRS / TRS / Architecture / later wave
> - **Migration / Decommission Note**: Specific action required; source state after handover
> - **Open Question?**: Yes / No (if Yes, the question is stated)

---

### Section A — From Maturity Roadmap

| # | Source System | Capability / Asset | Current Role | Destination | Treatment | Canonical Owner After Convergence | Why | Stage of Formalisation | Migration / Decommission Note | Open Question? |
|---|---|---|---|---|---|---|---|---|---|---|
| RR-01 | Maturity Roadmap | Free assessment flow | Pre-subscription entry point; customer attraction and initial maturity self-evaluation without login | MMM | Adopt as-is | MMM | Free assessment is the primary customer acquisition entry point per Roadmap strategy. It survives as-is in MMM as the front door. Roadmap backbone is the dominant conceptual skeleton for MMM. | App Description | Roadmap free-assessment routes decommissioned after MMM launch; traceability anchor retained | No |
| RR-02 | Maturity Roadmap | Onboarding / organisation setup | Post-subscription organisational information collection; establishes the organisational context for all maturity work | MMM | Adopt as-is | MMM | Roadmap onboarding logic is the canonical model for organisation setup in MMM. No alternative ownership is appropriate. | App Description | Roadmap onboarding flow becomes traceability-only after MMM onboarding is confirmed live | No |
| RR-03 | Maturity Roadmap | Maturity governance backbone (Domain → MPS → Criteria hierarchy) | Defines the canonical hierarchical structure for all maturity standards and criteria | MMM | Adopt as-is | MMM | The Domain → MPS → Criteria hierarchy is the single canonical structure. MMM must be the sole owner — there may never be two separate copies of this hierarchy. MAT's copy is dissolved. | App Description | MAT's Domain/MPS/Criteria ownership dissolved on MMM adoption; Roadmap's copy becomes the canonical MMM copy | No |
| RR-04 | Maturity Roadmap | Approval logic (criteria and framework approval workflow) | Controls framework publishing and maturity state transitions through defined approval steps | MMM | Adopt as-is | MMM | Approval workflow is tightly coupled to the maturity governance backbone. Natural continuation in MMM. | FRS | Roadmap approval workflow decommissioned after equivalent MMM approval workflow confirmed | No |
| RR-05 | Maturity Roadmap | Live maturity engine (continuous scoring engine) | Maintains a live, continuously updated organisational maturity score based on evidence | MMM | Adapt | MMM | Core scoring capability. Must be adapted to accommodate both Roadmap-origin and MAT-origin evidence flows. Evidence now arrives from multiple modes (walkabout, modal upload, RADAM automated feed). | FRS / TRS | Roadmap scoring engine becomes traceability-only after MMM live engine is confirmed; adaptation scope defined in TRS | No |
| RR-06 | Maturity Roadmap | Dashboard / publication logic | Generates and publishes the live organisational maturity dashboard for internal and external consumption | MMM | Adopt as-is | MMM | Dashboard publication is a core Roadmap capability with no overlap in MAT or Legacy. Retain as MMM capability. | App Description | Roadmap dashboard routes decommissioned after MMM dashboard confirmed live | No |
| RR-07 | Maturity Roadmap | Action-planning / PIT transition logic | Converts maturity findings and recommendations into structured implementation plans for export to PIT | PIT | Adopt as-is | PIT | PIT canonically owns implementation plan execution. The action-planning output from MMM findings is a PIT input. MMM owns the findings; PIT owns the plan. The handover interface (findings → PIT import) must be defined in FRS. | FRS | Roadmap action-planning logic becomes traceability-only; PIT integration interface derived from MMM FRS output fork | No |
| RR-08 | Maturity Roadmap | User hierarchy / invitation model | Defines and enforces the organisational user structure, role assignment, and invitation management | MMM | Adopt as-is | MMM | Roadmap user hierarchy is the canonical user model for the maturity platform. MAT had a separate model that is dissolved. MMM inherits the Roadmap model as the single canonical user model. | App Description | MAT user model dissolved; Roadmap user model becomes canonical MMM model | No |

---

### Section B — From MAT

| # | Source System | Capability / Asset | Current Role | Destination | Treatment | Canonical Owner After Convergence | Why | Stage of Formalisation | Migration / Decommission Note | Open Question? |
|---|---|---|---|---|---|---|---|---|---|---|
| MT-01 | MAT | Criteria upload / parsing flow | Accepts document uploads (e.g. PDF of existing standard) and uses AI to extract and structure criteria into Domain → MPS → Criteria format | MMM | Adopt as-is | MMM | This is one of the two primary framework-origin modes in MMM (Mode A — Verbatim Upload). The capability is valuable and proven. It must land in MMM as the governed upload/import path, using AIMC for AI-assisted extraction. | App Description / FRS | MAT criteria-upload routes decommissioned after MMM upload flow confirmed; AIMC governs AI extraction layer | No |
| MT-02 | MAT | Portable audit execution (field audit / audit workbench) | Enables structured audit execution against defined criteria, including evidence collection in the field | MMM | Adapt | MMM | MAT becomes the "Audit Workbench / Field Audit Mode" within MMM — not a peer product. The portable audit capability is valuable and survives but is repositioned as an operating mode of MMM, not a standalone identity. | FRS | MAT standalone audit routes become traceability-only after MMM audit mode confirmed; scope of adaptation defined in FRS | No |
| MT-03 | MAT | Criterion-level evidence management | Links, manages, and tracks evidence directly at the criterion level across findings, uploads, voice, photo, video, and transcripts | MMM | Adopt as-is | MMM | Criterion-level evidence management is one of the most important convergence points per MMM strategy. The evidence management modal from MAT is adopted directly into the MMM criterion view. This preserves the strongest MAT evidence UX. | App Description / FRS | MAT evidence management routes decommissioned after MMM criterion evidence workspace confirmed | No |
| MT-04 | MAT | Evidence modal / evidence workspace | UI component presenting evidence management interface for a single criterion, supporting multi-type evidence capture | MMM | Adopt as-is | MMM | The evidence modal is a proven UX pattern that directly maps to the MMM criterion-level interaction model. Adopt as the canonical evidence entry point within the MMM criterion view. | FRS / UX Workflow | MAT evidence modal becomes source reference for MMM equivalent; decommissioned after MMM modal confirmed | No |
| MT-05 | MAT | Mobile / walkabout evidence capture | Enables evidence collection on mobile devices in the field, supporting offline or low-connectivity scenarios | MMM | Adapt | MMM | Walkabout capture is a differentiating capability that MMM must preserve. Adaptation needed to ensure alignment with MMM's unified evidence model and AIMC connectivity model. Offline patterns retained where technically viable. | FRS / TRS | MAT mobile routes become traceability-only after MMM mobile capability confirmed; offline support scope clarified in TRS | Yes — Q: What is the minimum offline capability requirement for MMM walkabout mode? To be answered in TRS. |
| MT-06 | MAT | Findings and recommendations | Generates structured findings per criterion based on evidence assessment and maturity scoring, with AI-assisted recommendations | MMM | Adopt as-is | MMM | MMM strategy mandates a shared findings model as the single source of truth from which both Report and PIT outputs are derived. MAT's findings model is adopted as the canonical base, enriched with Roadmap's governance context. | App Description / FRS | MAT findings routes decommissioned after MMM findings model confirmed; double-entry risk eliminated | No |
| MT-07 | MAT | Report-generation pathway | Produces PDF/DOCX audit report and structured JSON export from findings and evidence | MMM | Adapt | MMM | Report generation is one of the two output paths in the MMM output fork (Option A — Create Report). Adaptation needed to accommodate the unified finding model and new evidence structure from both Roadmap and audit modes. | FRS | MAT report routes decommissioned after MMM report output pathway confirmed; dual-output fork (Report / PIT) formalised in FRS | No |
| MT-08 | MAT | Human-in-the-loop scoring / confirmation | Requires human confirmation of AI-proposed maturity scores before recording; prevents unchecked AI scoring | MMM | Adopt as-is | MMM | Human-in-the-loop scoring is a mandatory governance pattern per MMM app description. AI proposes; human confirms. This is non-negotiable and must be adopted without modification. | App Description | MAT HITL scoring logic becomes reference implementation for MMM; decommissioned after MMM scoring confirmation flow confirmed | No |

---

### Section C — From Legacy Maturity (`apps/maturion-maturity-legacy`)

| # | Source System | Capability / Asset | Current Role | Destination | Treatment | Canonical Owner After Convergence | Why | Stage of Formalisation | Migration / Decommission Note | Open Question? |
|---|---|---|---|---|---|---|---|---|---|---|
| LG-01 | Legacy Maturity | Framework generation (AI-assisted new criteria creation) | Uses AI to generate new maturity frameworks from scratch, creating domains, MPSs, and criteria based on organisational inputs | MMM | Redesign | MMM | Framework generation is one of the two primary framework-origin modes in MMM (Mode B — New Criteria Creation). The legacy implementation is a prior-generation implementation. MMM should redesign this capability using AIMC as the AI layer, with the legacy implementation as the specification reference. | FRS / TRS | Legacy framework-generation routes decommissioned after MMM Mode B (New Criteria Creation) confirmed live; AIMC governs AI layer | No |
| LG-02 | Legacy Maturity | Knowledge / document handling (ingestion and management) | Provides document upload, knowledge storage, and retrieval capabilities for maturity-related materials | AIMC | Adopt as-is | AIMC (KUC) | Per MMM strategy, all document uploads must go through the single common ingestion path (Knowledge Upload Centre within AIMC scope). This prevents duplicated upload logic and parsing entry points. Legacy document handling is dissolved into AIMC/KUC. | App Description / FRS | Legacy document-handling routes decommissioned after AIMC/KUC confirmed as the single ingestion path; metadata extension per MMM strategy §8 required | No |
| LG-03 | Legacy Maturity | Reusable UI / workflow assets | UI components, patterns, and workflow building blocks developed in the legacy context that remain applicable to MMM | Shared Platform | Harvest | Shared Platform | Reusable UI and workflow assets that are still technically sound and design-compatible should be harvested into the Shared Platform component library. This prevents duplication and accelerates MMM assembly. Components must be individually evaluated before harvesting. | Architecture wave | Individual component audit required before harvesting; components that do not meet current design system standards are retired | Yes — Q: Has a component audit of the legacy UI assets been performed? To be scoped in the Architecture wave. |
| LG-04 | Legacy Maturity | Maturity authoring assets (templates, scoring tables, framework reference docs) | Provides authoring materials used during maturity framework creation and criteria definition | MMM | Traceability-only | MMM | Legacy authoring assets are reference materials that informed prior implementations. They are not directly adoptable as live assets in MMM but serve as specification references for FRS/TRS derivation. Traceability link required. | FRS | Legacy authoring assets archived as traceability references in modules/MMM/_legacy/; no live execution | No |
| LG-05 | Legacy Maturity | Legacy components identified for retirement (duplicates of Roadmap/MAT capabilities) | Any legacy capability that duplicates Roadmap or MAT capabilities without meaningful differentiation | Retire | Retire | N/A | Per MMM strategy, duplication must be eliminated. Any legacy component that replicates functionality already present in Roadmap or MAT — without improvement — should be retired. No capability may be left in vague limbo. | App Description | Legacy duplication candidates decommissioned after capability audit; audit must be completed before FRS derivation | Yes — Q: Has a full duplication audit of legacy vs Roadmap/MAT been performed? To be scoped in the Architecture wave. |

---

## Ownership Transition Summary

This section summarises the canonical ownership decision for each major capability area after MMM convergence is complete.

| Capability Area | Current Owners | Canonical Owner After Convergence | Source State Post-Convergence |
|---|---|---|---|
| Maturity Framework Hierarchy (Domain/MPS/Criteria) | Roadmap (primary), MAT (copy) | **MMM** | Roadmap becomes traceability-only; MAT copy dissolved |
| Free Assessment Entry | Roadmap | **MMM** | Roadmap routes decommissioned |
| Onboarding / Organisation Setup | Roadmap | **MMM** | Roadmap routes decommissioned |
| Approval Logic | Roadmap | **MMM** | Roadmap routes decommissioned |
| Live Maturity Scoring Engine | Roadmap | **MMM** | Roadmap engine becomes traceability-only after adaptation |
| Dashboard / Publication | Roadmap | **MMM** | Roadmap dashboard decommissioned |
| User Hierarchy / Invitation | Roadmap | **MMM** | MAT user model dissolved; Roadmap model becomes canonical |
| Criteria Upload / Import | MAT | **MMM** | MAT routes decommissioned |
| Portable / Field Audit Execution | MAT | **MMM** (Audit Workbench mode) | MAT standalone identity dissolved |
| Criterion-level Evidence Management | MAT | **MMM** | MAT evidence routes decommissioned |
| Evidence Modal / Workspace | MAT | **MMM** | MAT modal becomes MMM reference implementation |
| Mobile / Walkabout Evidence Capture | MAT | **MMM** | MAT mobile routes become traceability-only |
| Findings and Recommendations | Roadmap + MAT (overlap) | **MMM** | Unified model; both overlap-owners dissolved |
| Report Generation | MAT | **MMM** | MAT report routes decommissioned |
| Human-in-the-loop Scoring | MAT | **MMM** | MAT HITL logic becomes reference; decommissioned after MMM confirms |
| Action Planning / PIT Transition | Roadmap | **PIT** | Roadmap action-planning becomes traceability-only; PIT interface defined in FRS |
| AI Routing and Provider Abstraction | Dispersed (MAT local + Roadmap) | **AIMC** | All dispersed AI routing dissolved into AIMC |
| Framework Generation (AI) | Legacy Maturity | **MMM** (via AIMC) | Legacy routes decommissioned after MMM Mode B confirmed |
| Knowledge / Document Ingestion | Legacy Maturity + MAT + Roadmap (dispersed) | **AIMC (KUC)** | All dispersed ingestion routes dissolved into AIMC/KUC |
| Reusable UI / Workflow Assets | Legacy Maturity | **Shared Platform** | Legacy assets individually harvested or retired |
| Maturity Authoring Reference Assets | Legacy Maturity | **MMM** (traceability) | Archived in modules/MMM/_legacy/ |

---

## Open Questions Register

All open questions surfaced during harvest map production are recorded here. Each must be answered before the associated Stage of Formalisation artifact (FRS, TRS, or Architecture) is completed.

| # | Ref | Question | Stage Required By | Responsibility |
|---|---|---|---|---|
| OQ-001 | MT-05 | What is the minimum offline capability requirement for MMM walkabout mode? Is full offline evidence storage required, or is low-connectivity / cached-submission sufficient? | TRS | CS2 + Product Owner |
| OQ-002 | LG-03 | Has a component audit of the legacy UI assets been performed? Which components are design-system-compatible and ready for Shared Platform harvesting? | Architecture wave | Foreman + Architecture team |
| OQ-003 | LG-05 | Has a full duplication audit of legacy vs Roadmap/MAT capabilities been completed? Which legacy components are confirmed duplicates for retirement? | Architecture wave | Foreman + Architecture team |

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
| Retirement / traceability-only decisions made explicit | ✅ LG-04 (Traceability-only), LG-05 (Retire), RR-07 (PIT), LG-02 (AIMC) |
| No duplicate canonical ownership remains unaddressed | ✅ Domain/MPS/Criteria overlap resolved (RR-03); Findings overlap resolved (MT-06); AI routing consolidated to AIMC |
| Artifact suitable to guide Stage 2, FRS, and TRS derivation | ✅ All capabilities classified to destination with treatment and ownership declared |

---

## Ripple / Cross-Agent Assessment

This artifact is a planning document only — it creates no schema changes, no API changes, no
workflow changes, and no production code.

**Downstream ripple assessment**: NO DOWNSTREAM RIPPLE REQUIRED.

Rationale:
- This document declares convergence intent but does not constitute an implementation action.
- Downstream agents (api-builder, schema-builder, ui-builder, etc.) will be appointed in
  subsequent waves when FRS/TRS derivation begins.
- The governance-liaison-isms-agent does not need to be notified — this is a MMM-internal
  planning artifact, not a governance canon change.
- AIMC and PIT agents are not triggered by a planning document; they will be engaged when
  FRS derivation formalises their interface requirements.

---

## Authority and Governance

| Field | Value |
|---|---|
| **CS2 Authorization** | maturion-isms#1300 (opened by @APGI-cmy) |
| **Wave** | mmm-harvest-map |
| **Session** | session-161-mmm-harvest-map-20260408 |
| **Produced By** | foreman-v2-agent v6.2.0 (POLC-Orchestration mode) |
| **IAA Pre-Brief** | `.agent-admin/assurance/iaa-prebrief-wave1300-mmm-harvest-map-20260408.md` |
| **Next Step** | CS2 review and approval → proceed to UX Workflow / FRS derivation for MMM |
