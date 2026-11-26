# Maturion Agent Network Organigram Strategy

## Status Header

| Field | Value |
|---|---|
| Document | Maturion Agent Network Organigram Strategy |
| Strategy ID | MANO-001 |
| Version | 0.1.0 |
| Status | STRATEGY - Draft for CS2 review |
| Authority | CS2 - Johan Ras |
| Repository | `APGI-cmy/maturion-isms` |
| Primary location | `Maturion/strategy/` |
| Created | 2026-06-24 |
| Wave | Maturion agent network organigram strategy v0.1 |
| Scope | Strategy only; no runtime code, registry mutation, specialist activation, or canon promotion in this wave |

---

## 1. Purpose

This strategy defines the intended organigram for the Maturion agent ecosystem before additional agent contracts, runtime specialists, or authority promotions are implemented.

It exists because the current ecosystem already contains several related but distinct concepts:

1. Build-time and governance agents in `.github/agents/`.
2. Runtime or onboard application agents that will operate through Maturion/AIMC inside APGI applications.
3. Maturion as a single unified user-facing AI interface.
4. Maturion's future role in the App Management Centre, including potential delegated CS2 authority.
5. Supabase/AIMC knowledge stores that ground specialist and Maturion reasoning.
6. Governance canon that must eventually enforce the stable parts of this strategy.

The purpose of this document is to prevent agent sprawl, authority confusion, duplicate specialists, runtime/build-time conflation, and unsafe knowledge use.

---

## 2. Strategy Position

This document is a strategy artifact. It is not yet canon, not an implementation specification, and not a runtime registry.

The correct progression is:

```text
Strategy
  -> CS2 review and correction
    -> canon promotion for stable authority and structural rules
      -> execution checklists / templates / registry updates
        -> specialist creation and runtime implementation
```

No runtime agent should be treated as production-active merely because this document names it. No authority should be granted to Maturion-as-CS2 merely because this document defines maturity levels.

---

## 3. Non-Negotiable Separation: Build Agents vs Runtime App Agents

The agent ecosystem must distinguish two networks.

### 3.1 Builder / Governance Agent Network

The builder/governance network operates around repositories, issues, PRs, canon, gates, quality, assurance, and delivery governance.

It answers:

```text
How do we safely plan, build, review, govern, and merge platform work?
```

Examples include:

- CS2 / Johan Ras
- future Maturion-as-CS2 in the App Management Centre
- Foreman / Builder-Maturion
- builder agents
- IAA agents
- ECAP/admin agents
- QP/quality review roles
- CodexAdvisor / agent factory roles
- governance liaison agents
- repository/module build specialists

Build/governance agents may use `.github/agents/` contracts, governance canon, pre-build artifacts, branch/PR evidence, CI results, and repo state.

### 3.2 Runtime / Onboard App Agent Network

The runtime/onboard app network operates inside APGI products and applications. It is user-facing only through Maturion unless a deliberate product design says otherwise.

It answers:

```text
How does Maturion assist a user inside an app using governed subject knowledge, app context, tenant context, memory, and specialist capability?
```

Examples include:

- Runtime Maturion
- APW specialist
- ISMS specialist
- MMM specialist
- MAT specialist
- PIT specialist
- XDETECT specialist
- risk-platform specialist
- document parser specialist
- criteria generator specialist
- maturity scoring specialist
- report writer specialist
- training/LMS specialist
- tenant/context retrieval services
- memory and knowledge services

Runtime specialists may be inspired by `.github/agents/` contracts, but they must be governed through AIMC/runtime architecture and may not be assumed to be identical to build-time agents.

### 3.3 Boundary Rule

```text
Build agents govern and build the system.
Runtime agents operate inside the system for users.
```

No implementation may silently convert a build-time `.github/agents` contract into a production runtime specialist without strategy alignment, canon coverage, runtime registry design, security review, and CS2 approval.

---

## 4. Current Observed Agent Network State

The current Maturion strategy and registry already define a one-orchestrator / many-specialists direction.

Known runtime or specialist concepts include:

| Agent / Specialist | Current Strategic Role | Current Status / Note |
|---|---|---|
| `maturion-agent` | Orchestrator identity across apps and specialists | Exists as thin-core build/governance contract and strategic identity anchor |
| `risk-platform-agent` | Risk, threat, vulnerability, controls, incident and mitigation expertise | Registered as specialist stub |
| `mat-specialist` | MAT workflows, LDCS, audit lifecycle and maturity assessment | Registered as specialist stub |
| `criteria-generator-agent` | Criteria extraction, chunking, embedding, framework mapping | Registered as specialist stub |
| `maturity-scoring-agent` | Maturity scoring, gap analysis, roadmap logic | Registered as specialist stub |
| `report-writer-agent` | Audit, maturity, compliance and executive reporting | Registered as specialist stub |
| `document-parser-agent` | Document ingestion and structural parsing | Registered as specialist stub |
| `pit-specialist` | PIT workflows, threat intelligence, IOC/TTP/vulnerability handling | Registered as active specialist |
| `xdetect-specialist` | XDETECT workflows and contraband/privacy protocols | Planned |
| `maturity-roadmap-specialist` | Gap analysis, improvement planning and maturity progression | Planned |
| `security-controls-agent` | ISO/NIST/CIS controls definitions and mappings | Planned |
| `apw-specialist` | APGI public website, public-safe messaging and APW handoff context | Missing / recommended |
| `isms-specialist` | ISMS shell, public front door, subscription, onboarding, shared context | Missing / recommended |
| `app-management-centre-specialist` | Future build/project orchestration support for Maturion-as-CS2 | Missing / future |

This document recommends adding the missing app specialists deliberately, starting with APW and ISMS definitions, but only after this organigram strategy is reviewed.

---

## 5. Maturion's Core Position in the Organigram

Maturion is the single AI interface. Users should not need to understand which specialist, source class, app registry, table, or memory plane was used behind the scenes.

The user-facing principle is:

```text
One Maturion interface. Many governed capabilities behind it.
```

Maturion is responsible for:

1. detecting app, embodiment, user, organisation, tenant, industry, time, timezone and permission context where available;
2. selecting the correct knowledge planes;
3. retrieving governed subject knowledge;
4. retrieving app state and customer context only when authorised;
5. routing to specialists when specialist expertise is required;
6. validating specialist outputs against guardrails, tenant boundaries, and authority rules;
7. synthesising one coherent answer;
8. escalating when knowledge, authority, safety, or permissions are insufficient.

Maturion is not a mere chatbot and not a mere router. Runtime Maturion owns context assembly, retrieval policy, source prioritisation, final synthesis, and safe user-facing communication.

Specialists own deep-domain or app-specific reasoning within declared boundaries.

---

## 6. High-Level Agent Organigram

### 6.1 Authority and Governance View

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

### 6.2 Runtime User Experience View

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

The user should not experience agent fragmentation. Internal routing may be logged for audit and debugging, but the product experience remains unified.

---

## 7. Maturion-as-CS2 Authority Maturity Model

Maturion may eventually become CS2 inside the App Management Centre, but authority must be staged.

### Level 0 - Advisor

Maturion provides analysis, recommendations, risk flags, merge concerns, strategy drafts, and suggested dispositions. Johan remains the only authority.

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

Maturion may evaluate a stage or PR on Johan's behalf when explicitly authorised for that wave.

Conditions:

- explicit CS2 authorisation recorded for the wave;
- transparent proxy wording;
- evidence bundle present;
- no material unresolved conflict;
- all limitations disclosed.

### Level 2 - Delegated CS2 for Low-Risk Governed Actions

Maturion may approve narrow, pre-defined, low-risk actions where canon defines the authority, evidence, rollback and escalation path.

Examples may include:

- documentation-only progression where all checks are satisfied;
- tracker update acceptance after verified merge;
- administrative signoff where no product behaviour changes.

Not allowed without further canon:

- security-sensitive runtime changes;
- schema/migration approval;
- tenant isolation changes;
- secret/configuration changes;
- irreversible production decisions.

### Level 3 - Operational CS2 Orchestrator

Maturion orchestrates build projects through the App Management Centre, including wave setup, scope declaration, builder appointment proposals, gate tracking, CI/status inspection, evidence bundle validation, and CS2 disposition preparation.

At this level Maturion may issue delegated dispositions only for domains already covered by canon and only within measurable authority boundaries.

### Level 4 - Autonomous CS2 with Human Override

Maturion acts as operational CS2 across defined work classes, with Johan retaining override, audit review, and constitutional authority.

This level requires:

- mature canon;
- stable memory architecture;
- verified tenant isolation;
- robust audit trails;
- conflict escalation;
- rollback and freeze mechanisms;
- proven reliability across repeated waves.

This level must not be implemented from this strategy alone.

---

## 8. Runtime App Specialist Categories

### 8.1 App Specialists

App specialists know the current product/application context, routes, workflows, public/private boundaries, user journeys, module authority and handoff contracts.

Recommended app specialists:

| Specialist | Mandate |
|---|---|
| APW specialist | APGI public website, public-safe messaging, APW route intent, public Maturion widget context, public CTA and handoff behaviour |
| ISMS specialist | ISMS platform shell, public front door, subscription, checkout, onboarding, shared user/org/tenant context, Ask Maturion continuity |
| MMM / Maturity Roadmap specialist | Maturity roadmap flows, framework/domain/MPS/criteria state, roadmap sequencing and maturity workspace context |
| MAT specialist | MAT workflows, LDCS, audit lifecycle, evidence, maturity assessment and criteria structure |
| PIT specialist | Threat intelligence, IOC, TTP, CVE, STIX/TAXII, vulnerability prioritisation and PIT workflows |
| XDETECT specialist | Detection workflows, contraband protocols, privacy-sensitive screening context |
| App Management Centre specialist | Build-project orchestration, agent staffing, gate dashboards and Maturion-as-CS2 operating support |

### 8.2 Domain Specialists

Domain specialists know disciplines rather than apps.

Examples:

- risk-platform specialist;
- security-controls specialist;
- threat-intelligence specialist;
- human-rights / VPSHR specialist;
- data analytics / remote assurance specialist;
- training and capability-building specialist.

### 8.3 Knowledge and Data Specialists

Knowledge and data specialists support ingestion, parsing, retrieval, ranking, metadata inspection and memory boundaries.

Examples:

- document-parser specialist;
- criteria-generator specialist;
- knowledge-ingestion specialist;
- retrieval/ranking specialist;
- memory specialist or Arbiter-facing service.

### 8.4 Output Specialists

Output specialists transform governed reasoning into approved output formats.

Examples:

- maturity-scoring specialist;
- report-writer specialist;
- evidence-pack specialist;
- executive-summary specialist.

---

## 9. APW Specialist Recommendation

An APW specialist should be created, but not as a broad APGI answer bot.

### 9.1 Proposed Mandate

The APW specialist is responsible for:

- APGI public website route and content intent;
- public-safe APGI messaging;
- public loss-prevention and maturity narrative;
- free maturity assessment handoff behaviour;
- APGI Hub public explanation;
- Maturion public widget behaviour and boundaries;
- public route launch readiness and custom-domain status;
- public privacy/terms/team placeholder state where applicable.

### 9.2 Explicit Non-Scope

The APW specialist must not access or answer from:

- private ISMS workspaces;
- customer tenant records;
- framework/context domain records;
- Supabase service-role data;
- confidential uploaded documents;
- authenticated app state;
- internal build governance not marked public-safe;
- secret/configuration values.

### 9.3 APW Runtime Retrieval Boundary

In public APW mode, Maturion may consult the APW specialist and public-safe knowledge only.

A future APW public retrieval filter should require the equivalent of:

```text
approval_status = 'approved'
AND visibility = 'public'
AND public_safe = true
AND tenant_context = null
```

If the current schema does not yet have explicit `visibility` or `public_safe` fields, those values should be defined in `metadata` before APW public retrieval is enabled.

---

## 10. Knowledge Plane Dependency

The runtime agent network depends on clear knowledge planes.

### 10.1 Subject Knowledge Domain

Subject Knowledge Domain teaches Maturion the discipline. It is CS2/superuser governed and should include approved security, loss-prevention, risk, maturity, standards, methodology and Maturion doctrine.

### 10.2 Framework / Context Domain

Framework / Context Domain teaches Maturion about a specific customer's environment. It is organisation-scoped and must never bleed into other organisations or public APW mode.

### 10.3 App Context Domain

App Context Domain teaches Maturion where he is operating:

- APW public website;
- ISMS shell;
- MMM workspace;
- MAT audit workflow;
- PIT threat intelligence workflow;
- App Management Centre build orchestration;
- other future apps.

### 10.4 Memory Domain

Memory must be partitioned by authority and scope:

- constitutional memory;
- global subject memory;
- app/embodiment memory;
- tenant/org memory;
- user/session memory;
- episodic incident/watchdog memory.

Private organisational data must never be written into global shared memory.

---

## 11. Registry Strategy

The ecosystem likely requires two related but distinct registry models.

### 11.1 Build/Governance Agent Registry

Tracks build-time contracts, governance agents, Foreman, Builder, IAA, ECAP, CodexAdvisor and related delivery roles.

Candidate existing locations:

- `.github/agents/`
- `governance/AGENT_REGISTRY.json`
- `.agent-workspace/<agent>/knowledge/`

### 11.2 Runtime Agent Registry

Tracks onboard application agents and runtime specialists available to Maturion in product contexts.

A future runtime registry should include:

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

Runtime registry design should be created before runtime specialists are treated as production capabilities.

---

## 12. Specialist Lifecycle

Specialists should progress through explicit lifecycle states.

```text
PROPOSED
  -> STRATEGY_DEFINED
    -> STUB_CONTRACTED
      -> KNOWLEDGE_BASED
        -> RUNTIME_REGISTERED
          -> ACTIVE
            -> DEGRADED / DEPRECATED / RETIRED
```

### 12.1 PROPOSED

The specialist is named as a potential need but has no contract, knowledge base or routing authority.

### 12.2 STRATEGY_DEFINED

The specialist's mandate, scope, non-scope and knowledge boundaries are defined in strategy.

### 12.3 STUB_CONTRACTED

A build/governance or runtime stub exists, but the specialist is not production-reliable.

### 12.4 KNOWLEDGE_BASED

The specialist has approved Tier 2/domain knowledge and retrieval boundaries.

### 12.5 RUNTIME_REGISTERED

The specialist appears in the runtime registry with input/output schema, allowed apps, allowed knowledge planes, and status.

### 12.6 ACTIVE

The specialist may be invoked by Maturion in production contexts within declared limits.

### 12.7 DEGRADED / DEPRECATED / RETIRED

The specialist is unavailable, superseded, or removed. Maturion must degrade gracefully and disclose limitations where relevant.

---

## 13. Delegation Transparency Rules

Maturion should normally hide internal routing from end users unless transparency is useful, legally required, educational, or necessary to explain a limitation.

### 13.1 Invisible Delegation

Use invisible delegation when the specialist performs routine retrieval, formatting, scoring, classification or app-context interpretation.

User experience:

```text
Maturion answers directly.
```

### 13.2 Transparent Delegation

Use transparent delegation when:

- the answer depends on a specialist limitation;
- multiple expert perspectives disagree;
- human approval is required;
- a specialist is unavailable or stubbed;
- the user explicitly asks how Maturion reached an answer;
- audit or trust is improved by naming the source class or specialist.

User experience:

```text
Maturion may say that he checked the APW context, the risk specialist, or approved subject knowledge.
```

The user should still not have to manage specialists manually.

---

## 14. Required Context Envelope

Every runtime Maturion request should eventually carry a context envelope.

### 14.1 Public APW Example

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

### 14.2 Authenticated ISMS/MMM/MAT/PIT Example

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

Runtime specialists should receive only the context fields required for their task.

---

## 15. Knowledge Retrieval Policy

Maturion and specialists should use sources in the following authority order:

1. Tier 1 constitutional/canon/runtime rules.
2. Approved Subject Knowledge Domain material.
3. App-specific approved operational knowledge.
4. Framework / Context Domain material only when authenticated and scoped.
5. Current session input.
6. Public internet/current-awareness material only when explicitly allowed and never as an override.

Public APW mode must not retrieve tenant/customer context.

If approved knowledge is missing, Maturion should say so or answer cautiously within known public-safe boundaries. He must not invent APGI facts from general model memory when governed APGI knowledge is expected.

---

## 16. Strategy Correction to Existing Model

The existing orchestrator/specialist principle is correct for preventing monolithic agents, but runtime Maturion needs a precise adjustment.

### Current principle

```text
Orchestrators coordinate; specialists execute.
```

### Runtime refinement

```text
Runtime Maturion orchestrates, retrieves, frames, validates, and synthesises.
Specialists execute deep-domain or app-specific reasoning within declared boundaries.
```

This refinement prevents two failure modes:

1. Maturion becoming a hollow router with no contextual intelligence.
2. Specialists becoming independent user-facing personas that fragment the product experience.

Maturion remains the coherent interface and final synthesiser. Specialists remain bounded expert capability providers.

---

## 17. Governance Promotion Path

After CS2 review, stable parts of this strategy should be promoted into canon.

Candidate canon artifacts:

- `governance/canon/MATURION_AGENT_NETWORK_ORGANIGRAM.md`
- `governance/canon/MATURION_RUNTIME_AGENT_REGISTRY_ARCHITECTURE.md`
- `governance/canon/MATURION_CS2_AUTHORITY_MATURITY_MODEL.md`

Candidate execution artifacts:

- runtime specialist contract checklist;
- APW specialist creation checklist;
- runtime registry schema;
- public-safe retrieval checklist;
- Maturion-as-CS2 authority evidence checklist.

No specialist should become ACTIVE solely from this strategy. Activation requires canon, registry, knowledge base, runtime contract, test/evidence, and CS2 approval.

---

## 18. Immediate Recommended Waves

### Wave 1 - Strategy Review and Correction

Review this organigram strategy for correctness, missing roles, authority risks and naming.

### Wave 2 - Canon Promotion

Promote stable structural and authority rules into governance canon.

### Wave 3 - Runtime Registry Strategy / Schema

Define how runtime specialists are registered, discovered, invoked, degraded and audited.

### Wave 4 - APW Specialist Definition

Create APW specialist as the first public-app specialist, with narrow public-safe scope.

### Wave 5 - Maturion Knowledge Grounding v0.3

Implement approved knowledge retrieval for public Maturion responses only after public-safe knowledge metadata is defined and verified.

### Wave 6 - App Management Centre Authority Strategy

Define Maturion-as-CS2 authority mechanics, evidence requirements, gate interaction and human override before operational use.

---

## 19. Non-Goals for This Strategy

This document does not:

- activate APW specialist;
- modify `.github/agents/`;
- modify `governance/AGENT_REGISTRY.json`;
- create a runtime agent registry;
- query or mutate Supabase;
- implement public chat retrieval;
- grant CS2 authority to Maturion;
- change PR gates;
- change tenant isolation rules;
- change memory write rules.

---

## 20. CS2 Review Questions

1. Should APW specialist be the first runtime app specialist after this strategy, or should ISMS specialist come first because ISMS is the platform shell?
2. Should Maturion-as-CS2 be canonised as a separate authority model or inside the agent organigram canon?
3. Should runtime agents have their own registry separate from build/governance `AGENT_REGISTRY.json`?
4. Should public-safe knowledge metadata be mandatory before any public APW retrieval is enabled?
5. Should App Management Centre become the operational home for Maturion-as-CS2, Foreman replacement, and build-project orchestration dashboards?

---

## 21. Foreman Disposition

This strategy recommends proceeding cautiously and in layers.

The concept is workable. The main risk is not the multi-agent model itself. The main risk is uncontrolled registry sprawl: creating many named agents before authority, scope, knowledge boundaries, app context, runtime registry and lifecycle states are governed.

Therefore the recommended path is:

```text
Organigram strategy
  -> canon promotion
    -> runtime registry architecture
      -> narrow APW specialist creation
        -> knowledge-grounded public Maturion
          -> broader runtime specialist activation
            -> Maturion-as-CS2 authority maturation
```

This keeps Maturion as one coherent intelligence while allowing the ecosystem to scale safely behind him.
