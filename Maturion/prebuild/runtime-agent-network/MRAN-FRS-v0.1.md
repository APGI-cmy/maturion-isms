# FRS — Maturion Runtime Agent Network v0.1

**Artifact ID**: MRAN-FRS-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Functional Requirements  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Maturion Runtime Agent Network Architecture Prebuild v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-25  
**Scope Declaration**: `.agent-admin/scope-declarations/maturion-runtime-agent-network-prebuild-v01.md`

---

## 1. Purpose

This Functional Requirements Specification defines what the Maturion runtime agent network must do before any runtime implementation begins.

The runtime agent network is not a visible swarm of bots. It is the governed capability layer behind Maturion, allowing Maturion to consult app specialists, domain specialists, knowledge/data specialists, output specialists and oversight services while preserving one coherent user-facing interface.

Canonical principle:

```text
One Maturion interface. Many governed capabilities behind it.
```

---

## 2. Product Intent

Maturion must become the unified runtime AI interface across APGI applications.

A user should experience one coherent security professional who understands:

- which app or embodiment he is operating in;
- whether the user is public, authenticated, organisation-scoped, tenant-scoped or privileged;
- what knowledge planes may be used;
- which specialist capabilities are available;
- when specialist routing is appropriate;
- what must be refused, degraded, or escalated.

---

## 3. Functional Boundary

### 3.1 In Scope

The runtime agent network must support:

1. app/embodiment context detection;
2. context envelope intake and validation;
3. runtime specialist discovery through a governed registry;
4. specialist lifecycle enforcement;
5. allowed knowledge-plane selection;
6. safe delegation to specialists;
7. specialist output validation;
8. one final Maturion response synthesis;
9. limitation disclosure and graceful degradation;
10. audit trace sufficient for governance review.

### 3.2 Out of Scope for Batch 1

Batch 1 does not implement:

- runtime code;
- Supabase retrieval;
- embeddings or vector search;
- public APW retrieval;
- APW specialist activation;
- ISMS specialist activation;
- runtime registry storage;
- memory writes;
- tenant-context queries;
- Maturion-as-CS2 authority.

---

## 4. Runtime Maturion Functional Requirements

### FRS-MRAN-001 — Single Interface

Maturion must remain the single user-facing AI interface unless a later product design explicitly approves an exception.

Specialists must not become unmanaged user-facing personas.

### FRS-MRAN-002 — Context Awareness

Maturion must operate from a context envelope that identifies, at minimum:

- app;
- embodiment;
- environment;
- authentication state;
- user role where available;
- organisation/tenant scope where available;
- page or workflow;
- permission scope;
- session id or trace id where available.

### FRS-MRAN-003 — Permission-Aware Knowledge Use

Maturion must select knowledge based on permission scope. Public or unauthenticated contexts must not use tenant/customer knowledge. Tenant-scoped contexts must not bleed into other tenants or global memory.

### FRS-MRAN-004 — Runtime Registry Lookup

Maturion must consult a governed runtime registry before treating any specialist as available or active.

Named specialists in strategy, canon, `.github/agents`, or documentation are not sufficient for runtime activation.

### FRS-MRAN-005 — Specialist Lifecycle Enforcement

Maturion must respect specialist lifecycle states:

```text
PROPOSED
  -> STRATEGY_DEFINED
    -> STUB_CONTRACTED
      -> KNOWLEDGE_BASED
        -> RUNTIME_REGISTERED
          -> ACTIVE
            -> DEGRADED / DEPRECATED / RETIRED
```

Only `ACTIVE` specialists may be used for production runtime answers. `DEGRADED` specialists may be used only with disclosed limitations. `PROPOSED`, `STRATEGY_DEFINED`, `STUB_CONTRACTED`, and `KNOWLEDGE_BASED` specialists must not be treated as production-ready.

### FRS-MRAN-006 — Delegation Boundary

Maturion may delegate specialist reasoning internally, but must retain responsibility for:

- context assembly;
- authority checking;
- final answer synthesis;
- limitation disclosure;
- escalation decisions.

### FRS-MRAN-007 — Specialist Non-Autonomy

Specialists must not independently expand authority, change tenant scope, write memory, approve actions, or issue user-facing final answers unless explicitly authorised by runtime architecture and governance.

### FRS-MRAN-008 — Build-Agent Separation

Build/governance agents and runtime/onboard app agents must remain distinct.

`.github/agents` contracts may inform runtime design, but may not be used as runtime agent activation records.

### FRS-MRAN-009 — Degraded Mode

If a required specialist, registry entry, context envelope field, or knowledge plane is missing, Maturion must degrade safely.

Safe degradation includes:

- answering only from allowed public/general knowledge;
- disclosing that governed knowledge is not available;
- refusing tenant/private questions in public mode;
- escalating rather than guessing.

### FRS-MRAN-010 — Audit Trace

Runtime orchestration must eventually produce an audit trace showing:

- context envelope summary;
- registry decision;
- specialist invoked or not invoked;
- knowledge-plane class used;
- degradation or escalation outcome;
- final response class.

The audit trace must avoid storing secrets or unnecessary tenant data.

---

## 5. Specialist Functional Categories

The runtime registry must support at least these specialist categories:

| Category | Purpose |
|---|---|
| App specialist | Knows app routes, workflows, public/private boundaries and handoff behaviour. |
| Domain specialist | Knows a professional domain such as risk, controls, threat intelligence, or training. |
| Knowledge/data specialist | Supports parsing, ranking, retrieval, metadata and knowledge hygiene. |
| Output specialist | Produces governed reports, summaries, scores, evidence packs, or executive outputs. |
| Oversight service | Applies safety, memory, tenant, policy, or anomaly guardrails. |

---

## 6. First Known Runtime Specialist Candidates

The following are candidates only unless a future governed wave registers and activates them:

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
- memory / Arbiter-facing service.

This FRS does not activate any of them.

---

## 7. Prohibited Runtime Behaviour

The runtime agent network must never:

1. treat a strategy-named specialist as active without registry activation;
2. use `.github/agents` as production runtime activation records;
3. expose tenant context in public APW mode;
4. retrieve customer documents without authenticated scoped authority;
5. write private organisational data into global shared memory;
6. allow specialists to bypass Maturion final synthesis;
7. allow specialists to issue CS2 or governance authority;
8. grant Maturion CS2 authority from runtime code alone;
9. call private tools/secrets from public browser code;
10. invent governed APGI facts when approved knowledge is missing.

---

## 8. Acceptance Conditions for FRS v0.1

This FRS is acceptable for Batch 1 only if it preserves:

- one Maturion interface;
- build/runtime agent separation;
- registry-before-activation;
- context-envelope-before-routing;
- permission-aware knowledge selection;
- safe degradation;
- no implementation in Batch 1.

---

## 9. Deferred to Batch 2

Batch 2 must define knowledge grounding in detail, including:

- Supabase/AIMC metadata requirements;
- source hierarchy;
- public-safe filtering;
- tenant/private filters;
- missing metadata behaviour;
- retrieval audit evidence.

---

## 10. Deferred to Batch 3

Batch 3 must define the first specialist prebuild, likely APW specialist, including mandate, non-scope, public-mode behaviour, public-safe knowledge rules and routing conditions.
