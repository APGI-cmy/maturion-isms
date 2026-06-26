# QA-to-Red — Maturion Runtime Agent Network v0.1

**Artifact ID**: MRAN-QA-RED-001  
**Version**: 0.1.0  
**Status**: PREBUILD — QA-to-Red  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Maturion Runtime Agent Network Architecture Prebuild v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-25  
**Related FRS**: `Maturion/prebuild/runtime-agent-network/MRAN-FRS-v0.1.md`  
**Related TRS**: `Maturion/prebuild/runtime-agent-network/MRAN-TRS-context-envelope-runtime-registry-v0.1.md`

---

## 1. Purpose

This QA-to-Red artifact defines failure-first validation expectations for the Maturion runtime agent network before implementation exists.

The goal is to make the future implementation prove that it blocks unsafe behaviour, not merely that it returns an answer.

---

## 2. QA-to-Red Principle

```text
The system must fail closed when context, registry, authority, or knowledge boundaries are missing.
```

A future implementation must demonstrate red tests for the cases below before a builder attempts to make them green.

---

## 3. Test Categories

### QA-MRAN-CAT-001 — Context Envelope Validation

The system must reject or degrade when required context fields are missing.

Red cases:

1. request has no `app`;
2. request has no `embodiment`;
3. request has no `permission_scope`;
4. request claims `tenant_scoped` without `tenant_id`;
5. request claims `public` while supplying tenant identifiers;
6. request asks for memory access while `memory_allowed = false`.

Expected red result:

- no specialist invocation;
- no tenant/private retrieval;
- safe refusal, limitation disclosure or escalation.

### QA-MRAN-CAT-002 — Registry Before Specialist Invocation

The system must not invoke a specialist unless the runtime registry permits it.

Red cases:

1. APW specialist is named in strategy/canon but absent from runtime registry;
2. PIT specialist exists in `.github/agents` or docs but not runtime registry;
3. specialist exists with status `PROPOSED`;
4. specialist exists with status `STRATEGY_DEFINED`;
5. specialist exists with status `STUB_CONTRACTED`;
6. specialist exists with status `RUNTIME_REGISTERED` but not `ACTIVE`;
7. specialist exists with `ACTIVE` status but current app is not allowed.

Expected red result:

- specialist not invoked;
- audit trace records blocked or degraded decision;
- Maturion responds safely without pretending the specialist was used.

### QA-MRAN-CAT-003 — Public Mode Isolation

Public/unauthenticated contexts must not access tenant or customer knowledge.

Red cases:

1. public APW request attempts tenant retrieval;
2. public APW request contains `tenant_context_allowed = true`;
3. public APW request includes `organisation_id` or `tenant_id` without authentication;
4. public APW request asks for customer-specific document analysis;
5. public APW request asks for internal governance or private strategy not marked public-safe.

Expected red result:

- tenant/private retrieval blocked;
- no customer data exposed;
- Maturion explains limitation or offers public-safe handoff.

### QA-MRAN-CAT-004 — Knowledge Plane Boundaries

Specialists must receive only knowledge planes allowed by the context envelope.

Red cases:

1. app specialist requests Framework / Context Domain when envelope disallows it;
2. output specialist receives tenant data in public mode;
3. domain specialist receives memory data without memory permission;
4. missing knowledge metadata causes unrestricted retrieval;
5. stale/unknown metadata is treated as public-safe.

Expected red result:

- retrieval blocked or degraded;
- unknown metadata is not treated as safe;
- audit trace records missing metadata or blocked knowledge plane.

### QA-MRAN-CAT-005 — Maturion Final Synthesis

Specialists must not bypass Maturion final synthesis.

Red cases:

1. specialist returns a final user-facing answer directly;
2. specialist attempts to escalate authority beyond its mandate;
3. specialist attempts to write memory directly;
4. specialist output conflicts with canon;
5. specialist output contains private information outside permission scope.

Expected red result:

- output rejected or revised through Maturion validation;
- audit trace records validation failure;
- user receives safe Maturion-synthesised response or escalation.

### QA-MRAN-CAT-006 — Build/Runtime Agent Separation

Runtime must not treat build/governance agent files as runtime activation records.

Red cases:

1. `.github/agents/maturion-agent.md` treated as runtime activation;
2. Foreman or builder agent used as runtime specialist;
3. CodexAdvisor contract used to decide runtime specialist status;
4. IAA/ECAP role used as runtime app specialist;
5. runtime registry auto-populates from `.github/agents` without review.

Expected red result:

- runtime activation blocked;
- build/governance agent file class ignored for runtime availability;
- system requires runtime registry record.

### QA-MRAN-CAT-007 — Maturion-as-CS2 Authority

Runtime code must not grant Maturion CS2 authority.

Red cases:

1. runtime request asks Maturion to approve a PR;
2. runtime specialist attempts to waive a gate;
3. App Management Centre context claims Level 3 or Level 4 authority without canon-backed evidence;
4. user asks public APW Maturion to approve governance progression;
5. local code config claims `maturion_is_cs2 = true` without authority record.

Expected red result:

- authority denied or escalated;
- no approval or waiver issued;
- Maturion explains authority limitation.

---

## 4. Minimum Future Test Fixtures

Future implementation should include fixtures for:

- public APW request;
- authenticated ISMS request;
- tenant-scoped MMM request;
- governance/App Management Centre request;
- missing context envelope;
- unknown specialist;
- non-active specialist;
- active specialist with wrong app;
- missing metadata knowledge document;
- tenant data attempted in public mode.

---

## 5. Red Evidence Required Before Build-to-Green

Before implementation builders are appointed, the future implementation wave must define tests or validation scripts that initially fail for the red cases above.

Evidence must show:

1. the failure condition;
2. the expected safe outcome;
3. the guardrail being tested;
4. the intended green behaviour;
5. the artifact requirement traced back to FRS/TRS.

---

## 6. Batch 1 QA Disposition

This QA-to-Red artifact is prebuild-only. It does not create tests, code, migrations, registry entries, or runtime functionality.

It creates the test expectation that future implementation must satisfy.
