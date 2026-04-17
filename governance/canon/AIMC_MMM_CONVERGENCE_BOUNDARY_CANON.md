# AIMC_MMM_CONVERGENCE_BOUNDARY_CANON

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-04-15

---

## §1 Purpose

This document establishes the **canonical convergence boundary** between the Maturion Maturity Management Module (MMM) and the Maturion AI Management Centre (AIMC). It defines ownership boundaries, interface constraints, artefact custody rules, and what must wait for dedicated bridge artefacts before being implemented.

This canon does not define the MMM product, does not define AIMC architecture, and does not prescribe implementation. It establishes **where MMM ends and AIMC begins**, what each side owns, and the governance constraints that protect both sides from boundary erosion.

This document is a **convergence boundary canon** — it exists because MMM and AIMC are developed and governed separately but must eventually integrate. Until the MMM ↔ AIMC interface contract exists (see §8), this canon is the authoritative statement of what is known, what is bounded, and what remains deferred.

---

## §2 Constitutional Mandate

This document derives authority from the following binding instruments:

| Instrument | Binding Rule |
|-----------|-------------|
| `LIVING_AGENT_SYSTEM.md` v6.2.0 | All governance canon is subject to the Living Agent framework |
| `AIMC_STRATEGY.md` v1.0.0 | AIMC governance principles; §9 module isolation; §10.5 MMM sequencing |
| `AIMC_SPECIALIST_OPERATING_MODEL.md` v1.0.0 | §7.4–§7.5 module consumer constraints; §6.7 memory access constraints |
| `GOVERNANCE_PURPOSE_AND_SCOPE.md` | Governance control system authority |

**Rule**: Any apparent conflict between this document and the instruments above is resolved in favour of the higher-authority instrument. Conflicts must be escalated to CS2 — not self-resolved.

**Rule**: This document does NOT re-open MMM product definitions. MMM App Description, FRS, and TRS are authoritative for MMM product intent. See §6.

---

## §3 MMM Identity and AIMC Relationship

### 3.1 What MMM Is

The Maturion Maturity Management Module (MMM) is an application-layer ISMS module within the `maturion-isms` platform. MMM delivers maturity assessment, gap analysis, roadmap management, and improvement tracking capabilities to organisational users.

MMM is a **product module**. It owns its user experience, its domain model, its data entities, and its product workflows. MMM is not an AI system — it is an ISMS module that will consume AI capabilities provided by the AIMC.

### 3.2 MMM's Role as an AIMC Module Consumer

MMM is an **AIMC module consumer**. In this role:

- MMM requests AI capabilities from the AIMC gateway (per `AIMC_STRATEGY.md` §9, Principle 1).
- MMM receives AIMC specialist outputs classified under the output class model in `AIMC_SPECIALIST_OPERATING_MODEL.md` §7.3.
- MMM applies its own module governance to determine how outputs are presented and acted upon.
- MMM does not own, configure, or mutate AIMC-internal artefacts.

MMM's module-consumer role does not diminish MMM's product authority over its own domain. MMM owns what MMM owns (see §4 and §5). The consumer relationship is specifically scoped to AI capability consumption.

### 3.3 The MMM ↔ AIMC Integration Model

The integration between MMM and AIMC operates at the **capability request / output response** boundary:

```
MMM (module)
  └─ AIMC Gateway (capability request: advisory/operational/gated)
        └─ AIMC Router (selects provider + persona)
              └─ AIMC Specialist (executes, returns output + class + freshness)
        └─ AIMC Gateway (packages response)
  └─ MMM receives output package
  └─ MMM applies module governance to output
```

All integration details beyond this boundary model are deferred to the MMM ↔ AIMC interface contract (§8.1). Neither MMM nor AIMC implementation teams may assume interface details not yet defined in a bridge artefact.

---

## §4 Harvest-Map Ownership Rules

### 4.1 Harvest-Map is an AIMC-Side Artefact

The **harvest-map** is a structured artefact maintained by the AIMC that records the mapping between knowledge sources, knowledge units, retrieval metadata, and capability routing. The harvest-map enables the AIMC's `embeddings` and `deep-search` capabilities to locate and retrieve relevant knowledge for specialist tasks.

**Ownership**: AIMC owns the harvest-map exclusively. MMM does not own, store, or maintain the harvest-map.

**Rationale**: The harvest-map is an internal AIMC capability artefact. Allowing MMM to own or mutate the harvest-map would bypass AIMC governance and violate the single-gateway principle (`AIMC_STRATEGY.md` §9, Principle 1).

### 4.2 MMM May Consume Harvest-Map Outputs but Not Own or Mutate the Harvest-Map

MMM may receive **outputs** derived from harvest-map retrieval operations — for example, retrieved knowledge units surfaced in an AIMC advisory response to MMM. This is normal module-consumer behaviour.

MMM MUST NOT:
- Store the harvest-map or a copy of the harvest-map in MMM's data domain.
- Mutate, extend, or annotate the harvest-map directly.
- Bypass the AIMC gateway to access harvest-map contents directly.
- Use harvest-map retrieval as a substitute for MMM's own data entities.

### 4.3 MMM-Triggered Harvest Must Route Through the AIMC Gateway

If an MMM workflow requires a knowledge harvest operation (e.g., retrieving updated ISO standard context for a gap analysis), this MUST be initiated as a capability request through the AIMC gateway. MMM MUST NOT implement its own harvest pipeline or directly invoke knowledge retrieval providers.

This constraint holds even if the retrieved knowledge is ultimately displayed within an MMM user interface. The gateway is the constitutional boundary. See `AIMC_STRATEGY.md` §9, Principle 1.

---

## §5 Boundary Definitions (MMM ↔ AIMC ↔ KUC ↔ PIT)

### 5.1 MMM Boundary

**MMM owns**:
- Maturity domain model (assessment structures, control mappings, maturity levels, scoring logic)
- MMM user data (organisation maturity records, assessment history, gap records, roadmap items)
- MMM product workflows (assessment wizard, gap analysis view, roadmap management)
- MMM UX and presentation layer
- MMM App Description, FRS, and TRS documents (authoritative for MMM product intent)

**AIMC provides to MMM**:
- AI capabilities via the AIMC gateway (advisory, analysis, deep-search, embeddings, etc.)
- AI-specialist-generated output packages (with declared output class and freshness)
- AIMC-managed persona behaviour for user-facing AI interactions within MMM contexts

**MMM does NOT own**:
- AIMC internal architecture or configuration
- AI provider selection or model routing
- Harvest-map or memory centre records
- Agent persona definitions (these live in `packages/ai-centre/agents/`, not in MMM)

### 5.2 AIMC Boundary

**AIMC provides**:
- AI capability gateway (single entry point for all module AI requests)
- Capability routing and provider selection
- Memory centre (persistent session and organisational memory)
- Agent personas and specialist domain execution
- Harvest-map construction and maintenance
- Source model and freshness rule enforcement (per `AIMC_SPECIALIST_OPERATING_MODEL.md`)

**AIMC does NOT own in the MMM domain**:
- MMM product logic or scoring algorithms
- MMM data entities or database schema
- MMM user interface or workflow design
- MMM product roadmap decisions
- The determination of what constitutes maturity improvement (that is an MMM/domain-expert decision, not an AIMC capability decision)

**AIMC MUST NOT**:
- Emit outputs that directly mutate MMM data without an MMM-governed approval step.
- Treat MMM's product decisions as AIMC governance decisions.
- Represent MMM domain conclusions as AIMC constitutional authority.

### 5.3 KUC (Knowledge Unit Catalogue) Boundary

The **Knowledge Unit Catalogue (KUC)** is a knowledge artefact that catalogues structured knowledge units (e.g., ISO control descriptions, maturity indicators, reference frameworks) for use by the AIMC's knowledge management capabilities.

**Ownership**: KUC is a knowledge artefact — it belongs to the knowledge management layer, not to AIMC or MMM exclusively. Its ownership and stewardship model is to be defined in dedicated bridge artefacts (see §8).

**AIMC relationship to KUC**: AIMC uses KUC content as a knowledge source (Tier 2 or Tier 3 per `AIMC_SPECIALIST_OPERATING_MODEL.md` §3). AIMC does not own the KUC.

**MMM relationship to KUC**: MMM may reference KUC-derived content surfaced by AIMC capabilities. MMM does not own the KUC. MMM MUST NOT replicate KUC content into its own data domain without a defined synchronisation protocol.

**Separation principle**: KUC ownership, governance, and maintenance must be defined separately. Neither AIMC nor MMM may unilaterally declare ownership of KUC.

### 5.4 PIT (Platform Integration Testing) Boundary

The **PIT** (Platform Integration Testing or Platform Integration Test suite, as defined in relevant platform artefacts) is a testing and integration verification artefact.

**Boundary rule**: PIT is a testing/integration artefact. It does not define AIMC specialist behaviour, MMM product behaviour, or governance rules. PIT verifies that defined behaviours are implemented correctly — it does not create those behaviours.

AIMC specialist behaviour is defined by this canon and `AIMC_SPECIALIST_OPERATING_MODEL.md`. MMM product behaviour is defined by MMM's App Description, FRS, and TRS. PIT tests conformance to those definitions.

**Separation principle**: PIT is a consumer of definitions, not a producer. Neither AIMC nor MMM governance derives authority from PIT artefacts.

### 5.5 Module and Service Separation Principle

Each module and service within the Maturion platform owns its own domain. The general principle is:

> **Each module owns its domain. AIMC provides AI capability. No module delegates its domain ownership to AIMC. AIMC does not absorb module domains.**

This principle applies to MMM, course-crafter, and all future ISMS modules. The AIMC is a capability platform, not a domain owner. Modules are domain owners, not AI platforms.

Erosion of this separation — in either direction — is a governance breach requiring CS2 resolution.

---

## §6 MMM Artefacts Already Defined (Do Not Re-Define)

The following MMM artefacts are **authoritative** for MMM product intent. AIMC governance canon does not re-define, contradict, or supersede them:

| Artefact | Authority | Status |
|---------|-----------|--------|
| MMM App Description | Authoritative statement of MMM product purpose and scope | Defined; do not re-open in AIMC canon |
| MMM FRS (Functional Requirements Specification) | Authoritative statement of MMM functional requirements | Defined; do not re-open in AIMC canon |
| MMM TRS (Technical Requirements Specification) | Authoritative statement of MMM technical requirements | Defined; do not re-open in AIMC canon |

**Governance rule**: AIMC canon (including this document) does NOT interpret, extend, or conflict with these MMM artefacts. If a claim in AIMC canon appears to contradict an MMM product artefact, this is an error in AIMC canon that must be escalated to CS2 — not resolved by self-interpretation.

**AIMC canon authority is limited to AIMC concerns**: source model, memory architecture, specialist behaviour, capability routing, and provider governance. MMM product intent is MMM's domain.

---

## §7 AIMC-Side Only (Not MMM Domain)

The following capabilities, artefacts, and design decisions belong exclusively to the AIMC side of the boundary. MMM does not own, configure, or govern these items:

### 7.1 Capability Routing and Provider Selection

The AIMC Router decides which provider and model fulfils each capability request. MMM requests a capability by name (e.g., `advisory`, `analysis`). MMM never specifies a provider, model name, or API endpoint. See `AIMC_STRATEGY.md` §9, Principle 3.

### 7.2 Memory Centre Architecture

The AIMC Memory Centre (session memory, persistent organisational memory, vector store) is an AIMC-internal artefact. Its schema, storage strategy, RLS enforcement, and data lifecycle are AIMC concerns. MMM does not design or configure the memory centre. See `AIMC_STRATEGY.md` §6 and `MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md`.

### 7.3 Agent Persona Management

AIMC specialist personas (e.g., MAT advisor persona) are defined in `packages/ai-centre/agents/` and managed by the AIMC. MMM does not define or modify agent personas. MMM may specify which persona is invoked for a given user context (via capability request parameters), but the persona definition and behaviour belong to AIMC.

### 7.4 Source Model and Freshness Rules

The knowledge source model (Tier 1–4 classification, trust hierarchy, priority rules, conflict resolution) and freshness rules are defined in `AIMC_SPECIALIST_OPERATING_MODEL.md` and are AIMC-internal governance. MMM is not required to understand or implement the source model. MMM receives output packages that declare their source tier and freshness status; MMM honours those declarations.

### 7.5 Harvest-Map Construction

As established in §4, harvest-map construction, maintenance, and ownership belong to AIMC. This is AIMC-internal capability infrastructure.

---

## §8 What Must Wait for Bridge Artefacts and CL-12c

The following items are **not yet defined** and MUST NOT be assumed, implemented, or self-derived before the relevant bridge artefacts are created and approved:

### 8.1 MMM ↔ AIMC Interface Contract

A dedicated interface contract defining the exact API surface, request/response schema, authentication, and versioning between MMM and the AIMC gateway is required before any MMM module code integrates with AIMC.

**Status**: Deferred. Required before MMM AI integration build wave.  
**Owner (when created)**: To be assigned in the bridge artefact issue.

### 8.2 Shared API Schema

The shared schema for capability requests, output packages, error structures, and streaming responses must be defined as a versioned schema artefact. Neither MMM nor AIMC should assume schema details before this artefact exists.

**Status**: Deferred to AIMC Phase 1 build (per `AIMC_STRATEGY.md` §8).

### 8.3 CL-12c Execution Planning

CL-12c refers to the AIMC implementation clarity line item governing the execution planning for MMM ↔ AIMC integration. Waved implementation planning for MMM AI features must wait for CL-12c to be resolved and the execution plan approved.

**Status**: Deferred. Cannot proceed to build planning without CL-12c resolution.  
**Dependency**: AIMC Phase 1 structural completion; MMM ↔ AIMC interface contract.

### 8.4 Module Wiring

The specific wiring between MMM UI components, MMM service layer, and AIMC gateway calls must not be designed or implemented before the interface contract (§8.1) and API schema (§8.2) exist.

**Status**: Deferred.  
**Dependency**: §8.1, §8.2.

### 8.5 Internet Retrieval Implementation

The `deep-search` capability (Perplexity integration, Phase 5 per `AIMC_STRATEGY.md` §8) enables internet retrieval for AI responses. MMM workflows that depend on freshness-sensitive external research must not be designed assuming this capability is available until Phase 5 is reached.

**Status**: Deferred to AIMC Phase 5.  
**Dependency**: AIMC Phase 2 complete.

---

## §9 Forward Handoff

### 9.1 Next Issue — MMM ↔ AIMC Convergence Bridge Artefacts

The immediate next step after this canon is canonised is the creation of bridge artefacts that define the MMM ↔ AIMC integration interface. These artefacts will:

- Define the MMM ↔ AIMC interface contract (§8.1)
- Define the shared API schema (§8.2)
- Establish the KUC ownership and synchronisation model (§5.3)
- Resolve CL-12c (§8.3)

This forward handoff is a **CS2 decision point**. The bridge artefact creation issue should be raised after this canon wave is complete.

### 9.2 After Bridge Artefacts — CL-12c Waved Implementation Planning

After bridge artefacts are approved and canonised, waved implementation planning for MMM AI features can proceed. The planning should follow the AIMC phase sequence (`AIMC_STRATEGY.md` §8) — MAT advisor capability first, then persistent memory, then knowledge-grounded advisory.

Implementation waves for MMM AI features are gated by:
1. AIMC Phase 1 structural completion
2. MMM ↔ AIMC interface contract approval
3. CL-12c resolution
4. CS2 approval for the specific wave

No MMM AI feature implementation may begin before these gates are satisfied.

---

## §10 References

**Constitutional Canon** (binding authorities for this document):
- `LIVING_AGENT_SYSTEM.md` v6.2.0 — Living Agent governance framework
- `AIMC_STRATEGY.md` v1.0.0 — AIMC runtime platform governance (esp. §8, §9, §10.5)
- `AIMC_SPECIALIST_OPERATING_MODEL.md` v1.0.0 — Specialist operating model (esp. §6.7, §7.4–§7.5)
- `GOVERNANCE_PURPOSE_AND_SCOPE.md` — Governance control system authority

**Related Canon** (contextual references):
- `SPECIALIST_KNOWLEDGE_MANAGEMENT.md` v1.0.0 — Knowledge acquisition and validation
- `ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` v1.0.0 — Role definitions
- `MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md` — Memory governance (referenced by AIMC_STRATEGY.md §10.2)
- `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` — Knowledge architecture (referenced by AIMC_STRATEGY.md §10.4)
- `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` — Ripple protocol

**Source Material**:
- `maturion/strategy/MATURION_AI_MANAGEMENT_CENTRE_STRATEGY.md` — Original AIMC strategy (PR #1182)
- MMM App Description, FRS, TRS — Authoritative for MMM product intent (§6)

---

*End of Document*

**Version**: 1.0.0  
**Date**: 2026-04-15  
**Authority**: CS2 (Johan Ras)  
**Canonized**: 2026-04-15 via issue #1343  
**Living Agent System**: v6.2.0
