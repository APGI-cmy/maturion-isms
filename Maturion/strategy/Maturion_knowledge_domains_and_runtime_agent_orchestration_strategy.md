# Maturion Knowledge Domains and Runtime Agent Orchestration Strategy

**Type**: Platform Strategy Addendum  
**Strategy ID**: MKD-RAO-001  
**Authority**: Johan Ras (CS2)  
**Status**: Agreed Strategy  
**Version**: 1.0.0  
**Created**: 2026-05-21  
**Applies To**: MMM, MAT, AIMC, legacy knowledge upload centre migration, Maturion runtime agent orchestration  
**Related**:
- `Maturion/strategy/Maturion_agent_usage_escalation_strategy.md`
- `governance/canon/AIMC_STRATEGY.md`
- `Maturion/strategy/DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md`
- `governance/canon/AIMC_SPECIALIST_OPERATING_MODEL.md`
- `Maturion/strategy/ORCHESTRATOR_SPECIALIST_ARCHITECTURE_STRATEGY.md`
- `LEGACY_KNOWLEDGE_INTEGRATION_AND_ARCHITECTURE_CONSOLIDATION_STRATEGY.md`

---

## 1. Purpose

This document clarifies the operating distinction between the **Subject Knowledge Domain** and the **Framework / Context Domain**, and defines how Maturion must use those knowledge planes together with the runtime specialist agent network when generating frameworks, MPSs, intent statements, criteria, recommendations, explanations, and reports.

This addendum exists because the current strategy set contains the required components — AIMC, knowledge ingestion, runtime personas, orchestration, specialist registry, and legacy upload centre migration — but does not yet state the two-domain knowledge model explicitly enough for implementation agents to avoid routing upload and AI-generation work incorrectly.

---

## 2. Core Strategic Decision

Maturion must reason from two distinct governed knowledge planes:

```txt
Subject Knowledge Domain = teaches Maturion the discipline.
Framework / Context Domain = teaches Maturion the customer.
```

Both domains feed Maturion's runtime reasoning, but they have different owners, scopes, upload interfaces, approval paths, and retrieval rules.

---

## 3. Subject Knowledge Domain

### 3.1 Definition

The **Subject Knowledge Domain** is the superuser-curated authority layer containing the knowledge Maturion needs in order to act as a high-level consulting agent.

It includes, but is not limited to:

- ISO, NIST, SOC 2, PCI DSS, LDCS, and related standards knowledge
- criteria design principles
- methodology and consulting doctrine
- Maturion-specific frameworks and interpretation rules
- approved subject-matter material
- specialist reference material
- domain taxonomies and mappings
- Maturion persona and specialist operating instructions

### 3.2 Owner

The Subject Knowledge Domain is owned by CS2 / superuser authority. It is not an ordinary customer upload area.

### 3.3 Upload and Access

The legacy document management / knowledge upload centre must be linked to the highest authority profile only. In the current role language this is expected to be the **superuser** or equivalent highest-level platform authority.

The superuser profile must provide access to:

1. **Subject Knowledge Domain upload and management** — for platform/domain knowledge.
2. **Framework Domain / Context Domain access** — for support, testing, review, or intervention where authorised.

Normal end users must not be able to upload into or alter the Subject Knowledge Domain.

### 3.4 Storage Target

Subject Knowledge Domain content must ultimately be governed by AIMC and stored/retrieved through the AIMC knowledge architecture, including `ai_knowledge` or its successor schema, with proper source/domain tags, approval status, organisation/scope handling, and semantic retrieval metadata.

### 3.5 Approval

Subject Knowledge Domain uploads require governance review before use in production AI context. Where ARC or equivalent approval workflow exists, newly uploaded subject knowledge must remain pending until approved.

---

## 4. Framework / Context Domain

### 4.1 Definition

The **Framework / Context Domain** is the organisation-specific context layer. It exists to teach Maturion about the customer's actual environment.

It includes, but is not limited to:

- company policies
- procedures
- standards adopted by the organisation
- process documents
- evidence documents
- operating model information
- industry context
- sector context
- risk profile inputs
- organisational structure
- control environment material
- customer-specific maturity context

### 4.2 Owner

The Framework / Context Domain is owned by the customer organisation or authorised customer users.

### 4.3 Upload and Access

Customer users upload context documents into their own Framework / Context Domain. These uploads do not teach Maturion globally; they contextualise Maturion's outputs for that organisation only.

End-user uploads must be scoped to the relevant organisation, framework, assessment, and/or domain context. They must not bleed into other organisations or into the global Subject Knowledge Domain.

### 4.4 Purpose

The Framework / Context Domain allows Maturion to tailor generated MPSs, intent statements, criteria, recommendations, maturity interpretation, evidence requests, and reports to the customer's real operating environment.

### 4.5 Storage Target

Framework / Context Domain documents must be chunked, parsed, embedded, and retrieved through AIMC-compatible memory/knowledge infrastructure, but with strict organisation and framework scoping.

---

## 5. Upload Interface Routing Model

The platform must not treat “Upload” as a single ambiguous action.

### 5.1 Required Upload Categories

| Upload Category | User | Purpose | Knowledge Plane |
|---|---|---|---|
| Framework Source Upload | CS2 / authorised framework builder | Upload framework/standard source material for domain/MPS/criteria generation | Framework generation pipeline |
| Subject Knowledge Upload | CS2 / superuser | Upload authoritative Maturion/domain knowledge | Subject Knowledge Domain |
| Context Document Upload | Customer/org user | Upload customer policies, procedures, evidence, and operating context | Framework / Context Domain |
| Evidence Upload | Customer/org user | Upload proof against specific criteria | Assessment/evidence domain |

### 5.2 Navigation Principle

The current generic `Upload` navigation label must be resolved into role-aware destinations.

Recommended routing:

```txt
Superuser / CS2:
  - Subject Knowledge Upload
  - Framework Source Upload
  - Context Domain access for support/testing

Customer Admin / Organisation User:
  - Context Document Upload
  - Evidence Upload
  - Framework workspace/review actions where authorised

Unauthorised / ordinary user:
  - No Subject Knowledge access
```

### 5.3 No Accidental Conflation

Framework Source Upload, Subject Knowledge Upload, Context Document Upload, and Evidence Upload must not share an unlabelled UI path unless the screen clearly disambiguates the target knowledge plane before upload.

---

## 6. Maturion Runtime Orchestration Model

### 6.1 Maturion as Main Consulting Agent

Maturion is the primary runtime consulting orchestrator. Maturion is not merely a chatbot and not merely a single prompt.

Maturion must:

1. assemble subject knowledge;
2. assemble customer context;
3. inspect current framework/domain/MPS/criteria state;
4. determine which specialist expertise is required;
5. delegate to runtime specialists where appropriate;
6. validate and reconcile specialist outputs;
7. return a coherent consulting output to the user;
8. route draft-assist or recommendation outputs through human approval where required.

### 6.2 Agent Network

Maturion may delegate to specialist agents for specialist expertise. Existing specialist definitions include, but are not limited to:

- `document-parser-agent`
- `criteria-generator-agent`
- `mat-specialist`
- `risk-platform-agent`
- `maturity-scoring-agent`
- `report-writer-agent`
- `pit-specialist`

These specialists currently exist in principle and may include stubbed or incomplete specialisation boundaries. Their domain definitions, prompts, routing keywords, source access rules, input/output schemas, and validation duties must be optimised before full production reliance.

### 6.3 Runtime vs Build-Time Separation

The `.github/agents/` files are build/governance agent contracts. They may be used as design inputs for runtime specialist behaviour, but runtime application agents/personas must be registered and governed through AIMC runtime architecture.

No implementation may confuse:

```txt
Build agents = repository/governance/build-time agents.
Runtime specialists = Maturion/AIMC application agents used by end users.
```

### 6.4 Criteria Generation Example

When Maturion generates criteria, the intended reasoning flow is:

```txt
1. Retrieve Subject Knowledge Domain content relevant to the selected framework/domain.
2. Retrieve Framework / Context Domain content for the customer organisation.
3. Inspect current domain, MPS, intent, and criteria state.
4. Ask document-parser-agent to interpret uploaded source/context material where needed.
5. Ask criteria-generator-agent to draft criteria aligned to the domain/MPS structure.
6. Ask mat-specialist to validate MAT/MMM structural correctness.
7. Ask risk-platform-agent or other domain specialists where the domain requires deeper subject review.
8. Ask maturity-scoring-agent where maturity-level logic or sequencing is involved.
9. Maturion synthesises the outputs into a coherent draft.
10. The consuming module presents the draft for human review, edit, approval, and save.
```

This output is draft-assist unless explicitly classified otherwise. It must not bypass approval/correction/sign-off gates.

---

## 7. Knowledge Retrieval Rules

### 7.1 Retrieval Inputs

Maturion and specialists must draw from at least these context sources where applicable:

- Maturion persona / system instructions
- Subject Knowledge Domain semantic retrieval
- Framework / Context Domain semantic retrieval
- current application state (framework, domain, MPS, intent, criteria)
- organisation/user/session memory
- specialist-specific approved knowledge
- governance/canon constraints

### 7.2 Priority Rules

Subject Knowledge Domain material governs the discipline. Framework / Context Domain material governs customer context. Where they conflict:

- Subject Knowledge governs what is correct as a discipline or platform methodology.
- Context Knowledge governs what is true about the customer environment.
- Maturion must not let customer context override platform/canonical subject rules.
- Maturion must not ignore customer context when tailoring outputs.
- Material conflicts that affect correctness, legality, safety, or approval must be surfaced and routed to human review.

### 7.3 Tenant Isolation

Customer context retrieval must be organisation-scoped. No customer document may be retrieved for another customer's AI interaction.

### 7.4 Knowledge Promotion

Customer context uploads do not automatically become Subject Knowledge Domain content. Promotion from context knowledge to subject knowledge requires explicit superuser/CS2 approval and a governed knowledge promotion flow.

---

## 8. Implementation Implications

### 8.1 Immediate Consequence for Upload Centre Work

Before adapting the legacy document upload centre, implementation agents must explicitly decide which upload plane is being wired:

1. Subject Knowledge Domain upload; or
2. Framework / Context Domain upload; or
3. Evidence upload; or
4. Framework source upload.

An implementation that routes all uploads through a single generic page without role-aware classification is architecturally incomplete.

### 8.2 Legacy Upload Centre Migration

The legacy document management section must first be treated as the Subject Knowledge Domain upload centre for superuser authority, unless a separate issue explicitly scopes it as the customer context upload centre.

The same underlying chunking/parsing machinery may later be reused for customer context uploads, but the access control, ownership, approval, and retrieval scope are different.

### 8.3 Current MMM Upload Link

The existing MMM `Upload` link must be reviewed because it currently risks conflating framework source upload with knowledge/context upload. It should be relabelled or routed through a role-aware upload landing page in a later implementation wave.

---

## 9. Specialist Optimisation Backlog

The specialist network must be optimised before full reliance. Each specialist needs:

- precise domain boundary
- current runtime purpose
- source access rules
- allowed knowledge planes
- input schema
- output schema
- confidence threshold
- escalation triggers
- validation responsibilities
- human-in-the-loop classification rules
- prompt/persona registration in AIMC where runtime use is intended

Priority specialists for MMM criteria generation:

1. `document-parser-agent`
2. `criteria-generator-agent`
3. `mat-specialist`
4. `risk-platform-agent`
5. `maturity-scoring-agent`
6. `report-writer-agent`

---

## 10. Decisions Locked by This Addendum

1. The Subject Knowledge Domain and Framework / Context Domain are separate knowledge planes.
2. Superuser/CS2 has access to Subject Knowledge Domain and Framework / Context Domain functions.
3. Customer users upload to Framework / Context Domain and evidence areas, not to the global Subject Knowledge Domain.
4. Maturion is the main runtime consulting orchestrator.
5. Maturion may delegate to runtime specialists through AIMC.
6. `.github/agents/` are build/governance contracts and must not be directly confused with runtime AIMC personas.
7. Legacy upload centre migration must not proceed until the target upload plane is explicit.
8. Criteria generation must use both subject knowledge and customer context, mediated through Maturion and specialist routing.
9. Customer context must never become cross-tenant or global knowledge without explicit governed promotion.
10. Generated criteria and related outputs remain draft-assist/recommendation outputs until human approval/sign-off occurs.

---

## 11. Next Implementation Wave Recommended

Create a follow-up issue:

```txt
Title: Align upload architecture with Subject Knowledge Domain and Framework/Context Domain strategy

Goal:
Restore/adapt the legacy document upload centre as a role-aware upload architecture that distinguishes Subject Knowledge upload, Context Document upload, Framework Source upload, and Evidence upload.

Required first step:
Audit the legacy upload centre and current MMM upload route, then produce a routing and storage plan before implementation.
```

---

*Authority: Johan Ras (CS2)*  
*Strategy ID: MKD-RAO-001*  
*Version: 1.0.0 — 2026-05-21*
