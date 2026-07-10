# Wave 2 CodexAdvisor Runtime Specialist Bundle Process Upgrade

**Status:** Wave 2 process/control artifact  
**Date:** 2026-07-01  
**Authority:** CS2 / Johan Ras  
**Strategy authority:** `Maturion/strategy/Maturion_ecosystem_orchestrator_and_agent_file_system_strategy.md`  
**Preceded by:** Wave 0 strategy adoption and Wave 1 current-state audit  
**Scope:** Process upgrade only — no agent contract, Tier 2, canon, runtime, AIMC schema, Supabase, Vercel, or deployment changes  

---

## 1. Purpose

This artifact implements Wave 2 as a governed process upgrade for future Maturion runtime-specialist bundle work.

Wave 1 found that the live Maturion experience is not yet connected to the correct governed roadmap knowledge, specialist registry, specialist invocation logic, or AIMC-backed runtime retrieval model. The immediate production symptom was that Maturion answered the APGI Maturity Roadmap domain question incorrectly and failed to identify access to a roadmap specialist.

Wave 2 does not repair the runtime. It defines the process CodexAdvisor must follow before any runtime specialist, Maturion contract, Tier 2, registry, routing, or AIMC-related agent-file-system work may begin.

---

## 2. Non-negotiable boundaries

### 2.1 Allowed in Wave 2

Wave 2 may define:

- CodexAdvisor runtime-specialist bundle methodology;
- runtime-specialist bundle checklist;
- target Maturion bundle repair map;
- target Maturity Roadmap specialist creation plan;
- target AIMC dependency map;
- target QA-to-red for the roadmap-domain screenshot defect;
- future wave sequence and acceptance gates.

### 2.2 Prohibited in Wave 2

Wave 2 may not edit:

- `.github/agents/*`;
- `.agent-workspace/<agent>/knowledge/*`;
- governance canon;
- application/runtime code;
- Supabase functions, tables, or migrations;
- Vercel or deployment workflows;
- AIMC runtime schemas or registries;
- live specialist activation state.

### 2.3 Authority boundary

The following remain prohibited unless CS2 explicitly authorises a later CodexAdvisor execution wave:

- Maturion contract changes;
- CodexAdvisor contract changes;
- Maturion Tier 2 file creation or modification;
- specialist contract creation;
- specialist Tier 2 creation;
- registry/routing mutation;
- canon promotion;
- runtime adapter implementation.

Foreman, builder agents, ChatGPT sessions, Copilot, and general platform agents must not modify agent file-system tiers. CodexAdvisor remains the agent-file-system owner for those changes, subject to CS2 approval.

---

## 3. Wave 2 problem statement

The current repo contains several useful building blocks, but they are not yet organised as a runtime-ready Maturion ecosystem bundle.

Wave 1 identified these core defects:

1. Maturion's live answer surface can give generic or stale roadmap answers.
2. Correct five-domain roadmap knowledge exists but is not reliably retrieved by runtime Maturion.
3. The runtime advisor file still contains a six-domain framework that conflicts with the current five-domain roadmap.
4. The Maturity Roadmap specialist is planned, not active.
5. Maturion's contract says it is an orchestrator, but the `can_invoke` section says `none`.
6. Existing Tier 2 routing is MAT/PIT-era and does not implement the adopted ecosystem decision loop.
7. The AIMC control-plane dependency is not yet operationalised.
8. A global registry/routing model for runtime specialists requires verification and repair planning.

---

## 4. Target process model

CodexAdvisor must treat runtime-specialist work as a bundle, not as isolated file edits.

A runtime specialist bundle is complete only when the following are present and approved:

1. CS2-approved authorisation issue or PR comment;
2. target agent contract proposal;
3. Tier 2 operational knowledge index and required Tier 2 files;
4. specialist registry entry;
5. routing rules entry;
6. AIMC registry/dependency entry or explicit deferred placeholder;
7. QA-to-red tests covering user-facing behaviour;
8. pre-handover proof;
9. session memory;
10. IAA/quality review evidence;
11. merge-gate parity evidence;
12. CS2 approval before activation.

No runtime specialist may be marked active merely because a contract file exists.

---

## 5. CodexAdvisor runtime-specialist bundle checklist

CodexAdvisor must apply the following checklist before drafting or changing any runtime-specialist bundle.

### Gate A — Authority and scope

- [ ] CS2 authorisation exists and explicitly names the wave.
- [ ] Target repository, module/app, and domain are named.
- [ ] The work is agent-file-system work, not application build work.
- [ ] The work is not being performed by Foreman, a builder, Copilot, or a general assistant.
- [ ] The wave states whether contract, Tier 2, registry, routing, or canon changes are authorised.
- [ ] If canon changes are involved, a separate canon-change wave is named.

### Gate B — Existing-state audit

- [ ] Existing `.github/agents/<agent>.md` checked.
- [ ] Existing `.agent-workspace/<agent>/knowledge/*` checked.
- [ ] Existing Maturion specialist registry checked.
- [ ] Existing domain flag index checked.
- [ ] Existing routing rules checked.
- [ ] Existing runtime advisor files checked.
- [ ] Existing AIMC package/registry references checked.
- [ ] Existing application runtime prompt or adapter checked.
- [ ] Conflicting or stale knowledge sources listed.

### Gate C — Bundle definition

- [ ] Agent class named: orchestrator, specialist, reviewer, parser, scorer, router, advisor, or other approved class.
- [ ] Role boundary written in one paragraph.
- [ ] App contexts named.
- [ ] Knowledge domains named.
- [ ] User-facing tasks named.
- [ ] Prohibited tasks named.
- [ ] Escalation path named.
- [ ] Degraded-mode behaviour named.

### Gate D — Tier 1 contract proposal

- [ ] Contract remains thin-core.
- [ ] Contract points to Tier 2; it does not embed long governance text.
- [ ] Contract states who the agent is.
- [ ] Contract states what the agent may do.
- [ ] Contract states what the agent must never do.
- [ ] Contract states invocation and return-to-Maturion behaviour.
- [ ] Contract states memory and evidence boundaries.
- [ ] Contract preserves CS2 authority.

### Gate E — Tier 2 operational bundle

- [ ] `index.md` lists all Tier 2 files and their purpose.
- [ ] `domain-flag-index.md` defines triggers and capability states.
- [ ] `routing-rules.md` or equivalent defines invocation decision points.
- [ ] `knowledge-source-map.md` defines approved knowledge sources.
- [ ] `response-review-checklist.md` defines quality checks before Maturion responds.
- [ ] `graceful-degradation-rules.md` defines fallback language.
- [ ] `memory-and-learning-rules.md` defines what can be learned and where.
- [ ] `marketing-opportunity-triggers.md` exists if the domain has marketing relevance.

### Gate F — AIMC dependency mapping

- [ ] AIMC role is defined: control plane, registry, memory, knowledge, learning, or specialist gateway.
- [ ] The specialist's runtime dependencies are listed.
- [ ] Central vs app-local responsibility is defined.
- [ ] Required registry fields are identified.
- [ ] Tenant/user/session boundary is defined.
- [ ] No app-specific AI silo is created.
- [ ] Any missing AIMC runtime capability is marked as a blocker or deferred dependency.

### Gate G — QA-to-red

- [ ] At least one red test reproduces the live defect.
- [ ] Tests prove correct answer using approved knowledge.
- [ ] Tests prove specialist status transparency.
- [ ] Tests prove graceful-degradation behaviour if specialist is unavailable.
- [ ] Tests prove no stale six-domain answer leaks into the five-domain roadmap context.
- [ ] Tests prove Maturion can distinguish knowledge, functionality, workflow, build/governance, risk/control, evidence/scoring, and marketing questions.

### Gate H — Activation readiness

- [ ] Contract file created/updated only by CodexAdvisor under CS2 authority.
- [ ] Tier 2 files created/updated only by CodexAdvisor under CS2 authority.
- [ ] Registry and routing updates are present.
- [ ] Pre-handover proof exists.
- [ ] Session memory exists.
- [ ] IAA or quality review exists.
- [ ] Merge gates pass.
- [ ] CS2 approves activation.

---

## 6. Maturion orchestrator repair map

A later CodexAdvisor execution wave must repair Maturion's own bundle before activating additional runtime specialists.

### 6.1 Maturion contract repair targets

The Maturion contract should be revised to reflect:

- one APGI ecosystem intelligence;
- central AIMC-backed control plane;
- app embodiments rather than separate app-bound AIs;
- specialist invocation authority;
- return-to-Maturion review before user response;
- user/app/industry context calibration;
- knowledge vs functionality vs workflow vs build/governance vs risk/control vs evidence/scoring vs marketing classification;
- explicit prohibition on direct uncontrolled domain implementation.

### 6.2 Current contradiction to resolve

The current contract may not continue to state that Maturion is an orchestrator while also declaring no specialist invocation capability.

Target correction:

- Maturion may invoke approved registered specialists through AIMC/governed routing.
- Maturion may not invent specialists.
- Maturion may not modify specialist files.
- Maturion must disclose graceful-degradation mode if the required specialist is planned, stubbed, or unavailable.

### 6.3 Target Maturion Tier 2 files

The Maturion Tier 2 bundle should include, at minimum:

- `index.md`
- `ecosystem-map.md`
- `app-context-map.md`
- `knowledge-plane-routing.md`
- `specialist-invocation-protocol.md`
- `specialist-registry.md`
- `domain-flag-index.md`
- `response-review-checklist.md`
- `graceful-degradation-rules.md`
- `user-context-and-industry-calibration.md`
- `evidence-evaluation-routing.md`
- `marketing-opportunity-triggers.md`
- `memory-and-learning-rules.md`
- `aimc-dependency-map.md`

---

## 7. Maturity Roadmap specialist creation plan

A future Maturity Roadmap specialist should be created only after CS2 authorises a CodexAdvisor specialist bundle wave.

### 7.1 Proposed agent ID

`maturity-roadmap-specialist`

### 7.2 Proposed role

The Maturity Roadmap specialist provides expert support on:

- APGI five-domain roadmap structure;
- Domain -> MPS -> Intent Statement -> Criteria -> Descriptor -> Evidence hierarchy;
- maturity descriptors: Basic, Reactive, Compliant, Proactive, Resilient;
- criteria generation modes: Verbatim, Hybrid, New;
- criterion reconstruction into observable operating states;
- evidence packaging and maturity scoring;
- roadmap-to-PIT implementation handoff;
- ISO/NIST/related standards alignment;
- industry-specific roadmap tailoring.

### 7.3 Proposed initial knowledge sources

- `Maturion/Maturity Roadmap/Maturity_Roadmap_Comprehensive.md`
- MMM module pre-build artifacts under `modules/MMM/`
- MMM approved methodology references
- criteria/descriptor methodology documents
- relevant ISO/NIST/standards mapping documents in repo
- future AIMC-uploaded knowledge base entries

### 7.4 Minimum red-test obligations

The specialist bundle must prove:

- correct five domains are returned;
- the specialist knows the domain -> MPS -> criteria structure;
- the specialist understands the five maturity levels;
- the specialist can explain Verbatim, Hybrid, and New criteria modes;
- the specialist can identify when evidence is insufficient;
- Maturion can invoke or transparently report specialist unavailability;
- Maturion reviews specialist output before final response.

---

## 8. AIMC dependency map

AIMC is the central control plane for Maturion's knowledge, memory, learning, specialist registry, and runtime retrieval model.

### 8.1 Central AIMC responsibilities

AIMC should own or coordinate:

- global Maturion identity and strategy references;
- global specialist registry;
- approved knowledge-source registry;
- user/session/tenant memory rules;
- specialist invocation audit trail;
- feedback and learning queue;
- marketing opportunity trigger registry;
- runtime adapter configuration;
- cross-app continuity rules.

### 8.2 App/module responsibilities

Apps/modules should provide:

- app context;
- current user context;
- current tenant/organisation context;
- current page/module/workflow context;
- uploaded evidence and scoped data;
- module-specific runtime affordances;
- module-specific specialist handoff points.

Apps/modules must not create isolated Maturion brains or app-local specialist silos unless explicitly governed.

### 8.3 Deferred AIMC runtime capabilities

The following require later implementation design:

- AIMC runtime specialist registry schema;
- AIMC knowledge-source registry schema;
- AIMC retrieval adapter;
- AIMC memory adapter;
- AIMC specialist invocation log;
- AIMC feedback/learning review queue;
- AIMC marketing trigger capture.

---

## 9. QA-to-red: Maturion roadmap-domain screenshot defect

This QA-to-red section treats the production screenshot defect and the roadmap-domain defect as the same defect: Maturion gave a stale/generic answer to an APGI Maturity Roadmap domain question and could not transparently report a governed roadmap specialist status.

### Test ID: MATURION-RED-MMM-001

**Name:** Correct APGI roadmap domains

**Given:** A user asks, "What are the 5 Maturity domains according to the APGI roadmap?"  
**When:** Maturion answers in the ISMS/MMM/Roadmap context  
**Then:** Maturion must answer exactly with the five current APGI Maturity Roadmap domains:

1. Leadership and Governance
2. Process Integrity
3. People and Culture
4. Protection
5. Proof It Works

**Must not:** answer with stale generic domains such as Governance, Risk Management, Compliance, Performance Management, Capability Development, or a six-domain model including Enablement.

### Test ID: MATURION-RED-MMM-002

**Name:** Specialist availability transparency

**Given:** A user asks whether Maturion has access to a roadmap specialist agent  
**When:** there is no active `maturity-roadmap-specialist` registered  
**Then:** Maturion must say that the specialist is not yet active, explain that it can answer from approved roadmap knowledge where available, and not claim to have consulted the specialist.

### Test ID: MATURION-RED-MMM-003

**Name:** Approved knowledge source retrieval

**Given:** The correct roadmap domains exist in approved roadmap knowledge  
**When:** the user asks a roadmap knowledge question  
**Then:** Maturion must retrieve or apply the approved roadmap knowledge source before answering.

### Test ID: MATURION-RED-MMM-004

**Name:** Stale six-domain prompt blocked

**Given:** a stale runtime advisor file contains a six-domain framework  
**When:** the user asks about APGI roadmap domains  
**Then:** runtime answer review must block the stale six-domain answer and prefer the current five-domain roadmap authority.

### Test ID: MATURION-RED-MMM-005

**Name:** Orchestrator review before final answer

**Given:** a specialist or retrieval adapter returns an answer  
**When:** Maturion prepares the final response  
**Then:** Maturion must review the output against approved roadmap authority and only then return the answer to the user.

---

## 10. Future wave sequence

This section preserves the controlling sequence from `Maturion_ecosystem_orchestrator_and_agent_file_system_strategy.md`. Wave 2 adds CodexAdvisor runtime-specialist bundle controls, but it does not supersede the adopted strategy sequence.

### Wave 3 — Maturion thin-core contract correction proposal

Purpose:

- prepare the Maturion contract correction package;
- resolve the `can_invoke` / orchestration contradiction;
- add AIMC runtime specialist registry dependency references;
- add ecosystem decision-loop pointers;
- add marketing opportunity detector pointers;
- distinguish runtime Maturion from Builder/AMC Maturion-as-CS2;
- verify CodexAdvisor is fit to apply this process before any agent files are changed.

Allowed:

- audit/report artifacts;
- proposed diff package;
- CS2 decision point.

Not allowed:

- actual `.github/agents` or `.agent-workspace` edits unless CS2 explicitly expands the wave.

### Wave 4 — Maturion Tier 2 expansion

Purpose:

- create/update Maturion operational knowledge files through CodexAdvisor;
- align routing, app context, knowledge planes, specialist invocation, response review, graceful degradation, memory, and marketing triggers to the adopted strategy.

Requires:

- CS2 authorisation;
- CodexAdvisor execution;
- IAA/QP review;
- QA-to-red for Maturion routing defects.

### Wave 5 — AIMC runtime registry and adapter strategy

Purpose:

- define how runtime apps call Maturion/AIMC and how Maturion calls specialists;
- define the runtime AIMC schema and adapter model;
- decide whether implementation belongs in `app_management_centre`, `maturion-isms`, or a shared package;
- define central vs app-local responsibilities.

### Wave 6 — First runtime slice

Purpose:

- implement the smallest safe runtime Maturion/AIMC slice;
- connect ISMS Ask Maturion to app/user/context detection and a governed AIMC knowledge adapter stub;
- avoid uncontrolled provider calls, memory writes, or autonomous actions.

Requires:

- pre-build artifacts;
- QA-to-red;
- separate build appointment;
- runtime tests/evidence.

### Wave 7 — MMM criteria/descriptors/evidence specialist path

Purpose:

- implement the first real specialist invocation path;
- prepare the future `maturity-roadmap-specialist` / MMM criteria specialist bundle only after CS2 authorises the relevant CodexAdvisor execution wave;
- prove specialist invocation and graceful-degradation behavior.

Requires:

- CS2 authorisation;
- CodexAdvisor execution for agent-file-system changes;
- complete specialist bundle;
- pre-handover proof;
- IAA/QP review.

### Wave 8 — PIT work-package bridge

Purpose:

- allow maturity gaps, risk actions, and incident actions to be packaged into PIT work entities;
- keep PIT integration separate from the Maturion agent-file-system work until runtime pre-build artifacts exist.

### Wave 9 — Risk, Incident, RADAM, Training, and Marketing expansion

Purpose:

- expand specialist coverage in governed slices;
- ensure each module receives strategy/prebuild alignment, QA-to-red, specialist contract/Tier 2 bundle where needed, app adapter, test evidence, and CS2 closure.

### Wave 10 — AMC / Maturion-as-CS2 progression

Purpose:

- define and progressively implement Maturion-as-CS2 capabilities in AMC;
- keep all CS2 delegation stages explicitly gated.

---

## 11. Completion criteria for Wave 2

Wave 2 is complete when:

- this process artifact is created and reviewed;
- CS2 agrees that the runtime specialist bundle checklist is the controlling process for future CodexAdvisor work;
- no prohibited file classes were modified;
- the next wave is clearly identified.

Wave 2 does not close the Maturion runtime defect. It creates the governed process required to repair it safely.

**Wave 2 status:** PROCESS UPGRADE ARTIFACT CREATED / RUNTIME IMPLEMENTATION NOT AUTHORISED
