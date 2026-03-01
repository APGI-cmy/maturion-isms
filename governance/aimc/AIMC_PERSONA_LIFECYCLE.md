# AIMC Persona Lifecycle

**Document Type**: Governance Artefact — Wave 9.10 Deliverable
**Status**: ACTIVE
**Version**: 1.1.0
**Effective Date**: 2026-03-01
**Owner**: CS2 — Johan Ras (@APGI-cmy)
**Location**: `governance/aimc/AIMC_PERSONA_LIFECYCLE.md`

**Audit Reference**: Gap 5 (§4.5) — `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md`
**AAWP Reference**: Wave 9.10 — Persona Lifecycle: Missing Personas + Versioning + Governance Document
**Architecture Reference**: `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md`
**Strategy Reference**: `governance/aimc/AIMC_STRATEGY.md` §7
**APS Reference**: `APS §5` — Persona governance rules
**Agent Assignment Reference**: `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` §Wave 9.10

---

## 1. Purpose

This document defines the **AIMC Persona Lifecycle** — the formal, governed protocol for creating, reviewing, updating, versioning, and retiring AI advisor personas in the Maturion AIMC (AI Management Centre).

An AIMC persona is a Markdown file located in `packages/ai-centre/src/agents/` that defines the identity, role, domain expertise, and behavioural constraints of an AI advisor for a specific Maturion module. Personas are injected into the AI context window by the `PersonaLoader` and `MemoryLifecycle` components of the AIMC gateway.

This document exists to:
- Define the authoritative process for persona creation, review, and retirement
- Establish versioning standards to ensure all persona changes are traceable
- Document the gap analysis performed in Wave 9.10 and the remediation applied
- Provide a compliance reference for the persona governance requirements of `APS §5` and `AIMC_STRATEGY.md §7`
- Serve as the audit trail anchor for all future persona lifecycle events

**Critical Policy Requirement**: All persona files MUST include valid YAML front-matter conforming to the schema in §5 of this document before they may be used in any live AI interaction. Compliance with this requirement is enforced via automated tests/CI and persona governance processes, and runtime components such as the `PersonaLoader` MUST NOT be modified in ways that weaken these checks without corresponding governance updates.

---

## 2. Persona Registry

The following table is the **authoritative Persona Registry** for the Maturion AIMC. It lists all current personas, their module assignment, version, wiring status, and last review date.

| `agentId` | Module | Description | Version | Status | Wiring State | `last_reviewed` | `owner` |
|---|---|---|---|---|---|---|---|
| `mat-advisor` | MAT | MAT Module AI Advisor — maturity assessment and ISO 27001 governance | 1.0.0 | ACTIVE | WIRED ✅ | 2026-02-28 | CS2 |
| `isms-navigator` | ISMS | ISMS Navigator — cross-module ISMS strategy and programme management | 1.0.0 | ACTIVE | IDLE ⚠️ | 2026-02-28 | CS2 |
| `pit-advisor` | PIT | PIT Module AI Advisor — project implementation tracking, task generation, scheduling | 1.0.0 | ACTIVE | IDLE ⚠️ | 2026-02-26 | CS2 |
| `risk-advisor` | Risk Management | Risk Advisor — cross-module risk assessment, threat analysis, control effectiveness | 1.0.0 | ACTIVE | IDLE ⚠️ | 2026-02-28 | CS2 |
| `xdetect-advisor` | XDetect | XDetect Module AI Advisor — anomaly detection, incident triage, IOC analysis | 1.0.0 | ACTIVE | IDLE ⚠️ | 2026-02-28 | CS2 |
| `course-crafter-advisor` | Course Crafter | Course Crafter Advisor — AI-powered instructional design for ISMS learning content | 1.0.0 | ACTIVE | IDLE ⚠️ | 2026-02-28 | CS2 |
| `incident-intelligence-advisor` | Incident Intelligence | Incident Intelligence Module AI Advisor — incident analysis, IOC enrichment, TTP correlation | 1.0.0 | ACTIVE | IDLE ⚠️ | 2026-02-28 | CS2 |
| `maturity-roadmap-advisor` | Maturity Roadmap | Maturity Roadmap Module AI Advisor — roadmap generation, remediation planning, gap prioritisation | 1.0.0 | ACTIVE | IDLE ⚠️ | 2026-02-28 | CS2 |
| `maturion-advisor` | Maturion (cross-module) | Maturion Enterprise AI Advisor — enterprise security, operational maturity, and ISMS governance across all six maturity domains | 1.0.0 | ACTIVE | IDLE ⚠️ | 2026-03-01 | CS2 |

**Wiring State Legend**:
- `WIRED ✅` — Module has active AIMC gateway integration and uses this persona in production
- `IDLE ⚠️` — Persona exists and is versioned; module wiring is pending (see Wave 9.6, 9.7, 9.8, 9.9)
- `RETIRED 🔴` — Persona is deprecated; not loaded into any AI interaction

**Registry Location**: `packages/ai-centre/src/agents/`
**Registry Update Trigger**: Any persona creation, update, or retirement must update this table.

---

## 3. Persona Creation Process

### 3.1 Overview

A new persona is required when:
1. A new Maturion module is added that requires AI advisory capability
2. A new AI capability domain is introduced that is architecturally distinct from existing personas
3. An existing persona is retired and a replacement is commissioned
4. CS2 explicitly authorises a new persona for an existing module (e.g., a specialised sub-advisor)

Persona creation follows the **Propose → Review → Author → Validate → Commit** lifecycle.

### 3.2 Creation Workflow

```
[CS2 authorises new persona]
         │
         ▼
[Foreman issues wave-start + wave scoping]
         │
         ▼
[QA Builder authors RED gate test]
(PersonaLoader.load('<agentId>') must return non-empty Markdown)
(YAML front-matter fields validated: agentId, module, version, last_reviewed, owner, description)
         │
         ▼
[api-builder authors persona file at packages/ai-centre/src/agents/<agentId>.md]
Specialist advisor (domain expert) provides domain accuracy advisory if applicable
         │
         ▼
[governance-liaison-isms-agent confirms APS §5 compliance and YAML front-matter validity]
         │
         ▼
[Foreman certifies wave complete; PR raised]
         │
         ▼
[Governance Liaison updates Persona Registry (§2) and Change Log (§9) in this document]
         │
         ▼
[MERGED — persona is ACTIVE in registry]
```

### 3.3 Creation Requirements

| Requirement | Detail |
|---|---|
| **CS2 Authorisation** | All new personas require explicit CS2 authorisation (wave issue or written instruction) |
| **RED Gate Test** | `qa-builder` must author a failing test before `api-builder` authors the persona file |
| **Domain Expert Review** | Specialist advisor (e.g., `pit-specialist`, `risk-platform-agent`, `mat-specialist`) must review domain accuracy for their module |
| **YAML Front-Matter** | All required fields from §5 must be present and valid |
| **Governance Liaison Confirmation** | `governance-liaison-isms-agent` must confirm APS §5 compliance |
| **Persona Registry Update** | The registry table in §2 must be updated before the PR is merged |
| **Change Log Entry** | A new row in the change log (§9) must record the creation event |

### 3.4 Persona File Location

All persona files must be placed at:
```
packages/ai-centre/src/agents/<agentId>.md
```

The `agentId` used in the filename must exactly match the `agentId` field in the YAML front-matter.

---

## 4. Persona Review and Update Process

### 4.1 Scheduled Review Cadence

All active personas undergo **quarterly review** (every 90 days from the `last_reviewed` date in YAML front-matter). The review is triggered by:

| Trigger Type | Description | Initiator |
|---|---|---|
| **Quarterly Scheduled Review** | Routine freshness check every 90 days | Governance Liaison monitors; escalates to CS2 if overdue |
| **Module Capability Change** | A significant new capability is added to the module (new API endpoint, new data model, new workflow) | Foreman flags during wave planning |
| **Framework Reference Change** | A referenced compliance standard (ISO 27001, NIST CSF, PCI-DSS) undergoes a material revision | Governance Liaison or CS2 flags |
| **Observed Drift** | AI responses from a persona are observed to be inconsistent with current module behaviour | Any agent or CS2 |
| **Specialist Advisory Request** | A domain specialist identifies factual inaccuracies in persona content | Domain specialist submits review request to CS2 |

### 4.2 Review Workflow

```
[Review trigger identified]
         │
         ▼
[Governance Liaison or Foreman creates review issue]
(tags: persona-review, module name)
         │
         ▼
[CS2 assigns domain specialist for content accuracy review]
         │
         ▼
[api-builder implements approved changes to persona file]
         │
         ▼
[YAML front-matter updated: version (patch/minor bump), last_reviewed = today]
         │
         ▼
[Regression: PersonaLoader.load() tests pass GREEN]
         │
         ▼
[Governance Liaison updates §2 Persona Registry and §9 Change Log]
         │
         ▼
[PR merged — persona updated in registry]
```

### 4.3 Version Bump Rules

| Change Type | Version Bump | Example |
|---|---|---|
| Correction of factual error, typo, or minor wording fix | **PATCH** (`x.y.Z`) | `1.0.0` → `1.0.1` |
| Addition or removal of domain expertise areas, tools, or capabilities | **MINOR** (`x.Y.0`) | `1.0.0` → `1.1.0` |
| Fundamental rewrite of persona identity, role scope, or behavioural constraints | **MAJOR** (`X.0.0`) | `1.0.0` → `2.0.0` |

A MAJOR version bump requires explicit CS2 authorisation before authoring begins.

### 4.4 Review Evidence Requirements

Every completed review must produce:
1. Updated persona file with incremented version and current `last_reviewed` date
2. Updated Persona Registry (§2) reflecting new version and review date
3. Change Log entry (§9) documenting what changed and why
4. Handover evidence in the authoring agent's session memory

---

## 5. Versioning Standards

### 5.1 YAML Front-Matter Schema

Every persona file must contain a YAML front-matter block at the top of the file. The following fields are **required**:

| Field | Type | Description | Example |
|---|---|---|---|
| `agentId` | `string` | Unique identifier matching the filename (without `.md` extension) | `mat-advisor` |
| `description` | `string` | One-sentence description of the persona's role and domain | `MAT Module AI Advisor — supports governance and maturity assessment conversations` |
| `module` | `string` | The Maturion module this persona serves | `mat` |
| `version` | `string` | Semantic version of this persona file (`MAJOR.MINOR.PATCH`) | `1.0.0` |
| `last_reviewed` | `string` (ISO 8601 date) | Date this persona file was last reviewed and approved | `2026-02-28` |
| `owner` | `string` | Identity of the persona owner (always `CS2` unless explicitly delegated) | `CS2` |

The following fields are **optional** but recommended where the persona has a distinct technical capability profile:

| Field | Type | Description | Example |
|---|---|---|---|
| `capability` | `string` | Primary AI capability used by this persona (`advisory`, `analysis`, `document-generation`, `deep-search`) | `deep-search` |

### 5.2 Canonical YAML Front-Matter Template

```yaml
---
agentId: <agentId>
description: <One-sentence description of the persona's role and domain>
module: <module-name>
version: 1.0.0
last_reviewed: YYYY-MM-DD
owner: CS2
capability: <advisory|analysis|document-generation|deep-search>   # optional
---
```

### 5.3 Semantic Versioning Rules

Personas follow [Semantic Versioning 2.0.0](https://semver.org):

- **MAJOR** (`X.0.0`): Breaking change to persona identity or fundamental behavioural constraints. Requires CS2 authorisation.
- **MINOR** (`x.Y.0`): Backward-compatible addition of new domain expertise, tools, or capability scope.
- **PATCH** (`x.y.Z`): Backward-compatible correction of errors, typos, or minor wording improvements.

All personas begin at version `1.0.0` on first deployment. Version `0.x.y` is not used for production personas.

### 5.4 Validation Enforcement

**Target behaviour (governance requirement)**  
The `PersonaLoader` component (`packages/ai-centre/src/personas/PersonaLoader.ts`) **must** validate persona YAML front-matter at load time. Once implemented, any persona file missing required front-matter fields (including version metadata) **must** cause `PersonaLoader.load()` to throw a `PersonaValidationError` rather than silently loading a malformed persona.

This will be a **hard gate**: after validation is implemented, a persona without valid versioned front-matter must not be injected into an AI interaction.

**Current implementation state (Wave 9.10)**  
As of this document version, `PersonaLoader.load()` does **not yet** perform structured validation of persona YAML front-matter and does **not** throw `PersonaValidationError`. Introduction of the `PersonaValidationError` type and corresponding validation logic is tracked as future work and is required to bring the implementation in line with this governance requirement.

---

## 6. Persona Retirement Process

### 6.1 Retirement Triggers

A persona is retired when:
1. The Maturion module it serves is decommissioned
2. The persona is replaced by a new persona with a different `agentId`
3. The persona's domain is absorbed into another persona (consolidation)
4. CS2 explicitly authorises retirement

### 6.2 Retirement Workflow

```
[Retirement trigger identified]
         │
         ▼
[CS2 authorises retirement in writing (issue or wave instruction)]
         │
         ▼
[Foreman issues deprecation notice wave]
         │
         ▼
[All AIMC gateway calls referencing this agentId are audited]
(No production system may reference a retired persona — api-builder confirms zero active references)
         │
         ▼
[Persona file moved to packages/ai-centre/src/agents/retired/<agentId>-v<version>.md]
(File is preserved for audit and historical reference — it is NOT deleted)
         │
         ▼
[YAML front-matter updated:
  status: retired
  retired_date: YYYY-MM-DD
  retired_reason: <brief reason>]
         │
         ▼
[Governance Liaison updates §2 Persona Registry: wiring state → RETIRED 🔴]
[Change Log entry added to §9]
         │
         ▼
[All PersonaLoader.load('<agentId>') calls for the retired persona are removed or redirected]
         │
         ▼
[PR merged — retirement complete]
```

### 6.3 Retired Persona Preservation

Retired persona files are **never deleted**. They are moved to the `retired/` subdirectory and preserved for:
- Audit trail and compliance evidence
- Reactivation if circumstances change (requires CS2 authorisation)
- Historical reference during incident investigations

---

## 7. Process Compliance

### 7.1 Compliance Enforcement Mechanism

| Gate | Enforcement Point | Enforced By |
|---|---|---|
| YAML front-matter schema | Automated tests/CI (RED gate); runtime validation is future work (tracked) | `qa-builder` RED gate tests verify; `PersonaLoader` runtime enforcement pending |
| Persona Registry currency | Governance Liaison review at each wave handover | `governance-liaison-isms-agent` |
| APS §5 alignment | Governance Liaison review before PR merge | `governance-liaison-isms-agent` |
| Version increment on every change | PR review diff check | Foreman wave certification |
| CS2 authorisation for MAJOR bumps and retirements | Wave issue or explicit written instruction | CS2 approval gate in PR |
| Quarterly freshness review | Governance Liaison monitoring cadence | `governance-liaison-isms-agent` escalates overdue reviews to CS2 |

### 7.2 Automated Test Coverage

The following test files enforce persona lifecycle compliance:

| Test File | What It Enforces |
|---|---|
| `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` | PersonaLoader loads all registered personas; path traversal guard; unknown agent error handling; `listAvailable()` behavior |
| `packages/ai-centre/src/__tests__/personas/wave9.10-persona-lifecycle.test.ts` | Lifecycle governance document existence (`T-041`); all 8 personas loadable; YAML front-matter fields present for all personas |

Tests must remain **100% GREEN, zero skipped** at all times. Any persona change that causes a test regression is a **MERGE BLOCKER** until resolved.

### 7.3 Audit Trail

This document is the primary audit trail anchor for all persona lifecycle events. The Change Log in §9 is the canonical record of:
- When each persona was created, updated, or retired
- What changed and why
- Who authorised the change
- Which wave delivered the change

All future persona lifecycle events must produce a Change Log entry in §9 of this document, updated in the same PR that modifies the persona file.

---

## 8. Gap Analysis: Wave 9.10 Findings

This section documents the persona gap analysis performed as part of Wave 9.10. It records the pre-Wave-9.10 state, the gaps identified, and the remediation applied.

### 8.1 Audit Reference

- **Source**: `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` §4.5 — Gap 5: Persona Lifecycle
- **Severity**: MEDIUM
- **Architecture References**: `AIMC_STRATEGY.md §7`, `APS §5`

### 8.2 Pre-Wave-9.10 State

The authoritative pre-Wave-9.10 state is recorded in `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` §4.5, which identified five application-facing advisor personas in existence (mat, isms-navigator, risk, xdetect, course-crafter) and three that were missing (pit, incident-intelligence, maturity-roadmap). The following table captures this state:

| `agentId` | Pre-Wave-9.10 State | Deficiency |
|---|---|---|
| `mat-advisor` | File existed, WIRED to MAT module | No YAML front-matter (`version`, `last_reviewed`, `owner`, `module` missing) |
| `isms-navigator` | File existed, module not wired | No YAML front-matter |
| `risk-advisor` | File existed, module not wired | No YAML front-matter |
| `xdetect-advisor` | File existed, module not wired | No YAML front-matter |
| `course-crafter-advisor` | File existed, module not wired | No YAML front-matter |
| `pit-advisor` | **FILE DID NOT EXIST** (audit §4.5, line: "PIT module persona not yet created") | Missing persona — PIT module had no AI advisor |
| `incident-intelligence-advisor` | **FILE DID NOT EXIST** | Missing persona — Incident Intelligence module had no AI advisor |
| `maturity-roadmap-advisor` | **FILE DID NOT EXIST** | Missing persona — Maturity Roadmap module had no AI advisor |

> **Note on `pit-advisor.md` dates**: The current `pit-advisor.md` file carries `last_reviewed: 2026-02-26`. This date reflects the file's creation date during Wave 9.10 execution (which ran 2026-02-26 to 2026-02-28). It does not indicate the file existed before Wave 9.10. The audit (the authoritative pre-Wave-9.10 source) explicitly confirms the file was missing prior to this wave.

### 8.3 Gaps Identified

The audit identified five discrete gaps:

| Gap ID | Gap Description | Severity | Remediated By |
|---|---|---|---|
| **G5-1** | `pit-advisor.md` persona file missing | HIGH — PIT module cannot use AIMC without a persona | Wave 9.10 (`api-builder`) |
| **G5-2** | `incident-intelligence-advisor.md` persona file missing | HIGH — Incident Intelligence module cannot use AIMC | Wave 9.10 (`api-builder`) |
| **G5-3** | `maturity-roadmap-advisor.md` persona file missing | HIGH — Maturity Roadmap module cannot use AIMC | Wave 9.10 (`api-builder`) |
| **G5-4** | All existing personas missing YAML front-matter (`version`, `last_reviewed`, `owner`, `module`) | MEDIUM — no versioning or review traceability | Wave 9.10 (`api-builder`) |
| **G5-5** | No documented persona review or freshness protocol; no persona versioning standard | MEDIUM — no governance process for persona lifecycle | Wave 9.10 (`governance-liaison-isms-agent`) |

### 8.4 Wave 9.10 Remediation Applied

| Deliverable | Location | Notes | Status |
|---|---|---|---|
| `pit-advisor.md` created with full YAML front-matter | `packages/ai-centre/src/agents/pit-advisor.md` | New file; created 2026-02-26 during Wave 9.10 execution | ✅ DELIVERED |
| `incident-intelligence-advisor.md` created with full YAML front-matter | `packages/ai-centre/src/agents/incident-intelligence-advisor.md` | New file; created during Wave 9.10 | ✅ DELIVERED |
| `maturity-roadmap-advisor.md` created with full YAML front-matter | `packages/ai-centre/src/agents/maturity-roadmap-advisor.md` | New file; created during Wave 9.10 | ✅ DELIVERED |
| YAML front-matter added to all 5 existing personas | `packages/ai-centre/src/agents/*.md` | Added to mat-advisor, isms-navigator, risk-advisor, xdetect-advisor, course-crafter-advisor | ✅ DELIVERED |
| Persona Lifecycle governance document | `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` (this document) | Authored by `governance-liaison-isms-agent` | ✅ DELIVERED |

### 8.5 Residual Items

The following items are **not** remediated by Wave 9.10 but are tracked for subsequent waves:

| Item | Description | Tracked In |
|---|---|---|
| Module wiring for IDLE personas | `isms-navigator`, `pit-advisor`, `risk-advisor`, `xdetect-advisor`, `course-crafter-advisor`, `incident-intelligence-advisor`, `maturity-roadmap-advisor` are all ACTIVE but not yet wired to their modules | Waves 9.6, 9.7, 9.8, 9.9 |
| `PersonaLoader` YAML validation enforcement | PersonaLoader must throw on missing required front-matter fields | Wave 9.10 RED gate tests define the requirement; `api-builder` to implement if not already present |

---

## 9. Change Log

| Version | Date | Author | Wave | Change Summary |
|---|---|---|---|---|
| 1.1.0 | 2026-03-01 | `foreman-v2-agent` session-078 | CL-1 (LKIAC Wave 1) | Added `maturion-advisor` to Persona Registry (§2). Migrated from legacy `apps/maturion-maturity-legacy/src/agents/maturion/prompts/system.md`. IDLE — wiring pending CP-1 CS2 sign-off. |
| 1.0.1 | 2026-02-28 | `governance-liaison-isms-agent` | Wave 9.10 follow-up | Corrected §1 Critical Invariant, §5.4 Validation Enforcement, §7.1 compliance table, and §7.2 test table to reflect that PersonaLoader does not yet perform runtime YAML validation; documented target state as future requirement. PR reviewer comments r2867457935, r2867457937, r2867457942, r2867457944. |
| 1.0.0 | 2026-02-28 | `governance-liaison-isms-agent` | Wave 9.10 | Initial creation. Establishes persona lifecycle governance protocol. Persona Registry populated with all 8 current personas. Gap analysis (Wave 9.10, Gap 5) documented. Remediation of G5-1 through G5-5 recorded. |

---

**Authority**: CS2 — Johan Ras (@APGI-cmy)
**Living Agent System**: v6.2.0
**Contract Pattern**: Four-Phase Canonical v3.2.0
**Policy**: `APS §5` | `AIMC_STRATEGY.md §7` | `AAWP Wave 9.10`
