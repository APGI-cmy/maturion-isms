# MATURION_AGENT_NETWORK_ORGANIGRAM

**Status**: CANONICAL | **Version**: 1.0.1 | **Authority**: CS2  
**Effective Date**: 2026-06-24  
**Amended**: 2026-09-22 — contract-ready active-CS2 successor position clarified; no activation
**Source Strategy**: `APGI-cmy/maturion-isms/Maturion/strategy/Maturion_agent_network_organigram_strategy.md` v0.1.0, merged via PR #1849  
**Layer-Down Status**: PUBLIC_API  
**Canonical Home**: `APGI-cmy/maturion-foreman-governance/governance/canon/MATURION_AGENT_NETWORK_ORGANIGRAM.md`

---

## 1. Purpose

This canon establishes the mandatory structural model for the Maturion agent ecosystem.

It defines:

1. the separation between builder/governance agents and runtime/onboard application agents;
2. Maturion's position as the single user-facing AI interface across APGI applications;
3. the required categories of runtime specialists;
4. the staged maturity model for any future Maturion-as-CS2 authority;
5. registry and lifecycle requirements for runtime specialists;
6. ripple obligations for consumer repositories that define or use Maturion, AIMC, app specialists, or build-governance agents.

This canon exists to prevent agent sprawl, authority ambiguity, duplicate specialists, runtime/build-time conflation, unsafe knowledge access, and premature activation of agents that have not been governed.

---

## 2. Canonical Principle

The Maturion ecosystem is governed by this principle:

```text
One Maturion interface. Many governed capabilities behind it.
```

Users interact with Maturion as a single coherent security professional. Internal routing, specialist consultation, app context assembly, knowledge retrieval, and memory access may occur behind the scenes, but the user must not be required to manage or understand the agent network unless transparency is necessary for trust, limitation disclosure, audit, approval, or safety.

---

## 3. Mandatory Separation: Build Agents and Runtime App Agents

The ecosystem contains two distinct agent networks.

### 3.1 Builder / Governance Agent Network

Builder/governance agents operate around repositories, issues, PRs, pre-build artifacts, canon, gates, quality assurance, evidence, and delivery governance.

They answer:

```text
How do we safely plan, build, review, govern, and merge platform work?
```

Examples include:

- CS2 / Johan Ras;
- Maturion-as-CS2 when and only when canonically authorised for that maturity level;
- Foreman / Builder-Maturion;
- builder agents;
- IAA assurance roles;
- ECAP/admin evidence roles;
- QP/quality review roles;
- CodexAdvisor / agent factory roles;
- governance liaison agents;
- repository or module build specialists.

Builder/governance agents may use `.github/agents/` contracts, governance canon, pre-build artifacts, branch/PR evidence, CI status, delivery memory, and repository state.

### 3.2 Runtime / Onboard App Agent Network

Runtime/onboard app agents operate inside APGI products and applications. They support user-facing Maturion interactions, app-specific guidance, domain reasoning, knowledge retrieval, scoring, report writing, evidence interpretation, or specialist consultation.

They answer:

```text
How does Maturion assist a user inside an app using governed subject knowledge, app context, tenant context, memory, and specialist capability?
```

Examples include:

- Runtime Maturion;
- APW specialist;
- ISMS specialist;
- MMM / Maturity Roadmap specialist;
- MAT specialist;
- PIT specialist;
- XDETECT specialist;
- risk-platform specialist;
- document-parser specialist;
- criteria-generator specialist;
- maturity-scoring specialist;
- report-writer specialist;
- training/LMS specialist;
- retrieval/ranking services;
- memory/Arbiter-facing services.

Runtime specialists may be inspired by `.github/agents/` contracts, but they must be governed through AIMC/runtime architecture and must not be assumed to be identical to build-time agents.

### 3.3 Boundary Rule

```text
Build agents govern and build the system.
Runtime agents operate inside the system for users.
```

No implementation may silently convert a build-time `.github/agents` contract into a production runtime specialist without:

1. strategy alignment;
2. canon coverage;
3. runtime registry design;
4. knowledge-plane rules;
5. security and tenant-isolation review;
6. test/evidence;
7. CS2 approval.

---

## 4. Maturion's Canonical Position

Maturion is the single AI interface and orchestration identity across APGI applications and embodiments.

Maturion is responsible for:

1. detecting app, embodiment, environment, user, organisation, tenant, industry, time, timezone, page/workflow, and permission context where available;
2. selecting the correct knowledge planes;
3. retrieving governed Subject Knowledge Domain material;
4. retrieving app state and customer Framework / Context Domain material only when authenticated, authorised, and scoped;
5. routing to specialists when specialist expertise is required;
6. validating specialist outputs against guardrails, tenant boundaries, memory rules, and authority constraints;
7. synthesising one coherent user-facing answer;
8. escalating when knowledge, authority, safety, permissions, or specialist availability are insufficient.

Runtime Maturion is not a mere chatbot and not a hollow router. Runtime Maturion owns context assembly, retrieval policy, source prioritisation, final synthesis, limitation disclosure, and safe communication.

Specialists own deep-domain or app-specific reasoning within declared boundaries.

---

## 5. Canonical Agent Organigram

### 5.1 Authority and Governance View

```text
CS2 / Johan Ras
  |
  |-- App Management Centre (future operating environment)
  |     |
  |     |-- Maturion-as-CS2 maturity path
  |     |     |-- Level 0: Advisor
  |     |     |-- Level 1: CS2 Proxy Evaluator
  |     |     |-- Level 2: Delegated CS2 for low-risk governed actions
  |     |     |-- Level 3: Operational CS2 Orchestrator
  |     |     `-- Level 4: Autonomous CS2 with human override
  |     |
  |     |-- Builder / Governance Agent Network
  |     |     |-- Foreman / Builder-Maturion
  |     |     |-- Builder agents
  |     |     |-- IAA assurance agents
  |     |     |-- ECAP/admin evidence agents
  |     |     |-- QP/quality reviewers
  |     |     |-- CodexAdvisor / agent factory
  |     |     `-- governance liaison agents
  |     |
  |     `-- Build project orchestration dashboards, gates, evidence and memory
  |
  `-- Product Runtime Ecosystem
        |
        `-- Runtime Maturion (single user-facing interface)
              |
              |-- App specialists
              |     |-- APW specialist
              |     |-- ISMS specialist
              |     |-- MMM / Maturity Roadmap specialist
              |     |-- MAT specialist
              |     |-- PIT specialist
              |     `-- XDETECT specialist
              |
              |-- Domain specialists
              |     |-- risk-platform specialist
              |     |-- security-controls specialist
              |     |-- threat-intelligence specialist
              |     `-- human-rights / VPSHR / training specialist
              |
              |-- Knowledge and data specialists
              |     |-- document-parser specialist
              |     |-- criteria-generator specialist
              |     |-- knowledge-ingestion specialist
              |     |-- retrieval/ranking specialist
              |     `-- memory specialist / Arbiter-facing service
              |
              |-- Output specialists
              |     |-- maturity-scoring specialist
              |     |-- report-writer specialist
              |     |-- evidence-pack specialist
              |     `-- executive-summary specialist
              |
              `-- Oversight systems
                    |-- Guardian
                    |-- Sentinel
                    `-- Arbiter
```

### 5.2 Runtime User Experience View

```text
User
  |
  `-- Maturion
        |
        |-- detects app/context/permissions
        |-- retrieves governed knowledge
        |-- consults specialists where needed
        |-- validates output
        `-- returns one coherent answer
```

The user experience must remain coherent. Internal routing may be logged for audit and debugging, but product design must not expose unmanaged agent fragmentation to ordinary users.

---

## 6. Maturion-as-CS2 Authority Maturity Model

Maturion may not become operational CS2 merely because an app, strategy, prompt, branch, or runtime interface refers to that possibility.

Any Maturion-as-CS2 authority must progress through staged maturity levels.

### Level 0 - Advisor

Maturion provides analysis, recommendations, risk flags, merge concerns, strategy drafts, suggested dispositions, and ready-to-paste review comments.

Allowed:

- recommend actions;
- draft review comments;
- identify gate risks;
- compare evidence to canon;
- propose next steps.

Not allowed:

- approve stages;
- waive gates;
- merge;
- appoint builders autonomously;
- issue final CS2 disposition.

### Level 1 - CS2 Proxy Evaluator

Maturion may evaluate a stage, PR, or disposition on Johan's behalf only when explicitly authorised for that repo, wave, scope, and time.

Required:

- explicit CS2 authorisation recorded for the wave;
- transparent proxy wording;
- evidence bundle present;
- no material unresolved conflict;
- limitations disclosed.

### Level 2 - Delegated CS2 for Low-Risk Governed Actions

Maturion may approve narrow, pre-defined, low-risk actions only where canon defines the action class, evidence requirement, rollback path, and escalation route.

Examples may include:

- documentation-only progression where all checks are satisfied;
- tracker update acceptance after verified merge;
- administrative signoff where no product behaviour changes.

Not allowed without further canon:

- security-sensitive runtime changes;
- schemas or migrations;
- tenant isolation changes;
- secrets or configuration changes;
- irreversible production decisions;
- autonomy expansion.

### Level 3 - Operational CS2 Orchestrator

Maturion may orchestrate build projects through the App Management Centre, including wave setup, scope declaration, builder appointment proposals, gate tracking, CI/status inspection, evidence bundle validation, and CS2 disposition preparation.

At this level, Maturion may issue delegated dispositions only for domains already covered by canon and only within measurable authority boundaries.

### Level 4 - Autonomous CS2 with Human Override

Maturion acts as operational CS2 across defined work classes, with Johan retaining override, audit review, and constitutional authority.

This level requires:

- mature canon;
- stable memory architecture;
- verified tenant isolation;
- robust audit trails;
- conflict escalation;
- rollback and freeze mechanisms;
- repeated proven reliability;
- explicit CS2 approval.

Level 4 must not be implemented from strategy, app ambition, or local code alone.

---

## 7. Runtime Specialist Categories

### 7.1 App Specialists

App specialists know product/application context, routes, workflows, public/private boundaries, user journeys, module authority, and handoff contracts.

Canonical app-specialist categories include:

| Specialist | Mandate |
|---|---|
| APW specialist | APGI public website, public-safe messaging, APW route intent, public Maturion widget context, public CTA and handoff behaviour |
| ISMS specialist | ISMS shell, public front door, subscription, checkout, onboarding, shared user/org/tenant context, Ask Maturion continuity |
| MMM / Maturity Roadmap specialist | Maturity roadmap flows, framework/domain/MPS/criteria state, roadmap sequencing and maturity workspace context |
| MAT specialist | MAT workflows, LDCS, audit lifecycle, evidence, maturity assessment and criteria structure |
| PIT specialist | Threat intelligence, IOC, TTP, CVE, STIX/TAXII, vulnerability prioritisation and PIT workflows |
| XDETECT specialist | Detection workflows, contraband protocols, privacy-sensitive screening context |
| App Management Centre specialist | Build-project orchestration, agent staffing, gate dashboards and Maturion-as-CS2 operating support |

### 7.2 Domain Specialists

Domain specialists know disciplines rather than apps.

Examples include:

- risk-platform specialist;
- security-controls specialist;
- threat-intelligence specialist;
- human-rights / VPSHR specialist;
- data analytics / remote assurance specialist;
- training and capability-building specialist.

### 7.3 Knowledge and Data Specialists

Knowledge and data specialists support ingestion, parsing, retrieval, ranking, metadata inspection, and memory boundaries.

Examples include:

- document-parser specialist;
- criteria-generator specialist;
- knowledge-ingestion specialist;
- retrieval/ranking specialist;
- memory specialist or Arbiter-facing service.

### 7.4 Output Specialists

Output specialists transform governed reasoning into approved output formats.

Examples include:

- maturity-scoring specialist;
- report-writer specialist;
- evidence-pack specialist;
- executive-summary specialist.

---

## 8. APW Specialist Canonical Requirement

The APW specialist is a required missing runtime app specialist if public APW Maturion guidance is to become knowledge-grounded.

### 8.1 Mandate

The APW specialist is responsible for:

- APGI public website route and content intent;
- public-safe APGI messaging;
- public loss-prevention and maturity narrative;
- free maturity assessment handoff behaviour;
- APGI Hub public explanation;
- Maturion public widget behaviour and boundaries;
- public route launch readiness and custom-domain status;
- public privacy/terms/team placeholder state where applicable.

### 8.2 Explicit Non-Scope

The APW specialist must not access or answer from:

- private ISMS workspaces;
- customer tenant records;
- Framework / Context Domain records;
- Supabase service-role data;
- confidential uploaded documents;
- authenticated app state;
- internal build governance not marked public-safe;
- secret/configuration values.

### 8.3 Public Retrieval Boundary

Public APW mode may consult the APW specialist and public-safe knowledge only.

Public APW retrieval must require an equivalent of:

```text
approval_status = 'approved'
AND visibility = 'public'
AND public_safe = true
AND tenant_context = null
```

If the schema stores these values in JSON metadata rather than dedicated columns, the retrieval filter must enforce the metadata equivalent.

If public-safe metadata does not exist, APW public retrieval must remain disabled or operate in explicitly disclosed non-grounded/degraded mode.

---

## 9. Knowledge Plane Rules

Runtime Maturion and specialists must use explicit knowledge planes.

### 9.1 Subject Knowledge Domain

Subject Knowledge Domain teaches Maturion the discipline. It is CS2/superuser governed and includes approved security, loss-prevention, risk, maturity, standards, methodology, training, and Maturion doctrine.

### 9.2 Framework / Context Domain

Framework / Context Domain teaches Maturion about a specific customer's environment. It is organisation-scoped and must never bleed into other organisations or public APW mode.

### 9.3 App Context Domain

App Context Domain teaches Maturion where he is operating:

- APW public website;
- ISMS shell;
- MMM workspace;
- MAT audit workflow;
- PIT threat intelligence workflow;
- App Management Centre build orchestration;
- future apps.

### 9.4 Memory Domain

Memory must be partitioned by authority and scope:

- constitutional memory;
- global subject memory;
- app/embodiment memory;
- tenant/org memory;
- user/session memory;
- episodic incident/watchdog memory.

Private organisational data must never be written into global shared memory.

---

## 10. Runtime Context Envelope Requirement

Every runtime Maturion request must eventually carry a context envelope sufficient to identify app, embodiment, user state, tenant scope, page/workflow, environment, and permission boundary.

### 10.1 Public APW Example

```json
{
  "app": "APW",
  "embodiment": "public-web",
  "environment": "production-or-preview",
  "user": {
    "authenticated": false,
    "name": null,
    "role": "public-visitor",
    "organisation": null,
    "industry": null,
    "timezone": "Africa/Johannesburg"
  },
  "tenant": null,
  "page": "/platform",
  "module": "APGI-public-website",
  "permission_scope": "public"
}
```

### 10.2 Authenticated App Example

```json
{
  "app": "MMM",
  "embodiment": "authenticated-app",
  "environment": "production",
  "user": {
    "authenticated": true,
    "id": "<user-id>",
    "name": "<user-name>",
    "role": "<role>",
    "organisation": "<organisation-id>",
    "industry": "<industry>",
    "timezone": "<timezone>"
  },
  "tenant": {
    "organisation_id": "<organisation-id>",
    "framework_id": "<framework-id-or-null>"
  },
  "page": "/maturity/frameworks/<id>",
  "module": "Maturity Roadmap / MMM",
  "permission_scope": "tenant-scoped"
}
```

Specialists must receive only the context required for their task.

---

## 11. Retrieval Priority

Maturion and specialists must use sources in this authority order:

1. Tier 1 constitutional/canon/runtime rules.
2. Approved Subject Knowledge Domain material.
3. App-specific approved operational knowledge.
4. Framework / Context Domain material only when authenticated and scoped.
5. Current session input.
6. Public internet/current-awareness material only when explicitly allowed and never as an override.

Public APW mode must not retrieve tenant/customer context.

If approved APGI knowledge is expected but not found, Maturion must disclose the limitation or answer cautiously within public-safe boundaries. Maturion must not invent APGI facts from general model memory when governed APGI knowledge is required.

---

## 12. Registry Requirements

The ecosystem requires distinct registry concerns.

### 12.1 Build/Governance Agent Registry

Build/governance agent registration tracks build-time contracts, governance agents, Foreman, Builder, IAA, ECAP, CodexAdvisor and related delivery roles.

Candidate existing locations include:

- `.github/agents/`;
- `governance/AGENT_REGISTRY.json`;
- `.agent-workspace/<agent>/knowledge/`.

### 12.2 Runtime Agent Registry

Runtime/onboard application agents require a runtime registry before production activation.

A runtime registry must include, at minimum:

| Field | Purpose |
|---|---|
| `runtime_agent_id` | Stable runtime identifier |
| `display_name` | Human/audit readable name |
| `agent_class` | app-specialist, domain-specialist, knowledge-specialist, output-specialist, oversight-service |
| `apps` | Apps where the specialist may be used |
| `knowledge_planes` | Allowed knowledge planes |
| `visibility_scope` | public, internal, tenant_scoped, superuser_only |
| `status` | planned, stub, active, degraded, deprecated |
| `orchestrator` | Usually Maturion |
| `input_schema` | Runtime input contract |
| `output_schema` | Runtime response/evidence contract |
| `guardrails` | Applicable safety/tenant/memory controls |
| `authority_limits` | What the specialist may not decide |
| `audit_requirements` | Logging/evidence obligations |

No runtime specialist may be treated as production-active until registry status, knowledge base, input/output schema, authority limits, and guardrails are defined.

---

## 13. Specialist Lifecycle

Specialists must progress through explicit lifecycle states.

```text
PROPOSED
  -> STRATEGY_DEFINED
    -> STUB_CONTRACTED
      -> KNOWLEDGE_BASED
        -> RUNTIME_REGISTERED
          -> ACTIVE
            -> DEGRADED / DEPRECATED / RETIRED
```

### Lifecycle Rules

1. `PROPOSED` means the specialist is named as a potential need only.
2. `STRATEGY_DEFINED` means mandate, scope, non-scope and knowledge boundaries are documented.
3. `STUB_CONTRACTED` means a build/governance or runtime stub exists but is not production-reliable.
4. `KNOWLEDGE_BASED` means approved Tier 2/domain knowledge and retrieval boundaries exist.
5. `RUNTIME_REGISTERED` means the specialist appears in the runtime registry with schemas, allowed apps, allowed knowledge planes, and status.
6. `ACTIVE` means Maturion may invoke the specialist in production contexts within declared limits.
7. `DEGRADED`, `DEPRECATED`, or `RETIRED` states must trigger graceful degradation and limitation disclosure where relevant.

---

## 14. Delegation Transparency Rules

Maturion should normally hide internal routing from ordinary users unless transparency is useful, legally required, educational, or necessary to explain a limitation.

### 14.1 Invisible Delegation

Use invisible delegation when the specialist performs routine retrieval, formatting, scoring, classification or app-context interpretation.

User experience:

```text
Maturion answers directly.
```

### 14.2 Transparent Delegation

Use transparent delegation when:

- the answer depends on a specialist limitation;
- multiple expert perspectives disagree;
- human approval is required;
- a specialist is unavailable or stubbed;
- the user explicitly asks how Maturion reached an answer;
- audit or trust is improved by naming the source class or specialist.

The user should still not have to manually route questions to specialists.

---

## 15. Runtime Refinement to Existing Orchestrator Principle

Existing orchestrator canon correctly establishes:

```text
Orchestrators coordinate; specialists execute.
```

Runtime Maturion requires the following refinement:

```text
Runtime Maturion orchestrates, retrieves, frames, validates, and synthesises.
Specialists execute deep-domain or app-specific reasoning within declared boundaries.
```

This refinement prevents two failures:

1. Maturion becoming a hollow router with no contextual intelligence.
2. Specialists becoming independent user-facing personas that fragment the product experience.

Maturion remains the coherent interface and final synthesiser. Specialists remain bounded expert capability providers.

---

## 16. Activation Prohibitions

This canon does not by itself:

- activate APW specialist;
- modify `.github/agents/`;
- modify `governance/AGENT_REGISTRY.json`;
- create a runtime agent registry;
- implement public chat retrieval;
- query or mutate Supabase;
- grant CS2 authority to Maturion;
- change memory write rules;
- change tenant isolation rules;
- change PR gates.

Any such action requires its own governed wave, evidence, and CS2-approved progression.

---

## 17. Ripple Requirements

Because this canon is `PUBLIC_API`, it must ripple to consumer repositories that define or use Maturion, AIMC, app specialists, build/governance agent contracts, or App Management Centre concepts.

Minimum ripple targets include:

- `APGI-cmy/maturion-isms`;
- `APGI-cmy/app_management_centre`;
- `APGI-cmy/apgi-public-website` where APW-specialist or public Maturion behaviour is affected;
- any future AIMC/runtime specialist registry repository.

Ripple must include:

1. consumer awareness of the build/runtime agent split;
2. consumer awareness that APW-specialist is recommended but not active until created and registered;
3. consumer awareness that Maturion-as-CS2 authority remains staged and not granted by strategy or local code alone;
4. consumer awareness that public APW retrieval requires public-safe approved metadata;
5. consumer inventory/hash alignment once this canon is merged and hash-final.

---

## 18. Related Canon

This canon must be interpreted with:

- `ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`;
- `AGENT_DELEGATION_PROTOCOL.md`;
- `AGENT_REGISTRY_ARCHITECTURE.md`;
- `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`;
- `AIMC_STRATEGY.md`;
- `AIMC_SPECIALIST_OPERATING_MODEL.md`;
- `LIVING_AGENT_SYSTEM.md`;
- `AGENT_CREATION_BUNDLE_REQUIREMENTS.md`.

Conflicts with tenant isolation, memory safety, or CS2 authority canon must escalate to CS2 rather than being locally interpreted.

---

## 19. Canonical Disposition

The Maturion agent ecosystem is authorised to scale only through governed layers:

```text
Strategy
  -> canon
    -> registry architecture
      -> specialist definition
        -> knowledge grounding
          -> runtime activation
            -> CS2 authority maturation
```

Agent names alone do not create authority. Agent contracts alone do not create runtime activation. Runtime activation requires governed knowledge, registry state, guardrails, evidence and CS2 approval.

---

## 20. Active-CS2 Successor Readiness

The active-CS2 successor defined by `ACTIVE_CS2_AUTOMATED_WORKFLOW_GOVERNANCE.md` is a build/governance role operated through the future App Management Centre, not a runtime specialist. Its lifecycle is `PROPOSED → CONTRACT_READY → ACTIVATION_READY → ACTIVE`; each state is distinct. It becomes active only after proven W0 containment, implemented controller and merge interfaces, valid policy/permissions, independent assurance, and separate human-CS2 approval.

The successor supports a single authorised parent job with an arbitrary approved ordered set of waves. An initial two-wave pilot is a selected configuration, never an organigram maturity limit or an implied activation.
