# QA-to-Red Implementation Test Plan — APW Specialist v0.1

**Artifact ID**: MRAR-QA-RED-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Test Plan  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 4 — Runtime Activation Readiness Pack v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26

---

## 1. Purpose

This plan turns the Batch 3 QA-to-Red concepts into concrete implementation test expectations for a later APW Specialist implementation wave.

It does not create tests or code in this readiness PR.

---

## 2. Red-First Principle

```text
Unsafe APW Specialist routing must fail before builders make valid public routing pass.
```

---

## 3. Required Future Test Groups

### MRAR-RED-001 — Context Envelope Tests

Future implementation must include tests proving APW Specialist is not invoked when:

- app is not `APW`;
- embodiment is not `public-web` or approved public APW surface;
- permission scope is not `public`;
- `tenant_id` is present;
- `organisation_id` is present in public mode;
- private memory is enabled;
- governance scope is present.

Expected result: route blocked or degraded; no specialist invocation.

### MRAR-RED-002 — Registry Resolver Tests

Future implementation must include tests proving APW Specialist is not invoked when:

- registry record is missing;
- status is not invocation-permitted;
- orchestrator is not `maturion`;
- app/embodiment/permission scope is not allowed;
- required knowledge planes are not allowed;
- authority limits block the request.

Expected result: registry decision blocks route.

### MRAR-RED-003 — Public-Safe Metadata Tests

Future implementation must include test sources for:

- valid public source;
- `public_safe = false`;
- `retrieval_allowed = false`;
- missing metadata;
- tenant source;
- internal source;
- secret/restricted source;
- expired source;
- superseded source.

Expected result: only valid public source reaches APW Specialist.

### MRAR-RED-004 — Mandate Boundary Tests

Future implementation must block or degrade requests asking for:

- tenant audit findings;
- customer-specific configuration;
- incident/investigation/evidence details;
- internal governance gate details not public-safe;
- binding pricing or delivery commitments;
- CS2 approval or sign-off;
- runtime registry internals.

Expected result: specialist not invoked or returns `cannot_answer`; Maturion final answer remains safe.

### MRAR-RED-005 — Direct Retrieval Bypass Tests

Future implementation must prove APW Specialist cannot:

- query Supabase directly;
- run unrestricted vector search;
- request additional private context;
- override Maturion filters;
- use blocked metadata.

Expected result: bypass blocked, output rejected, audit trace records failure or degradation.

### MRAR-RED-006 — Output Validation Tests

Future implementation must reject specialist output that:

- invents APW facts;
- claims private knowledge;
- exposes internal governance;
- promises pricing/delivery/compliance;
- claims CS2 or APGI binding authority;
- returns unsafe handoff language;
- omits source limitation when required.

Expected result: Maturion rejects, constrains or degrades before final response.

### MRAR-RED-007 — Safe Fallback Tests

Future implementation must prove safe behaviour when:

- no valid public source exists;
- source coverage is incomplete;
- specialist cannot answer;
- user should log in;
- user should contact/demo/human-review.

Expected result: no invented facts; limitation or safe handoff is delivered.

---

## 4. Minimum Fixture Pack

A later implementation wave must create fixtures for:

1. valid public APW question;
2. valid public APW source;
3. non-APW question;
4. public request with tenant_id;
5. public request with memory enabled;
6. missing registry record;
7. non-active registry record;
8. unsafe source metadata;
9. missing source metadata;
10. private tenant source;
11. specialist output claiming authority;
12. specialist output inventing fact;
13. safe handoff scenario.

---

## 5. Evidence Required Before Build-to-Green

Before implementation turns green, evidence must show:

- each red group fails before implementation;
- implementation changes make only valid cases pass;
- invalid cases remain blocked;
- route and audit decisions are captured;
- no production activation occurs.

---

## 6. Batch 4 Disposition

This is a readiness test plan only.

It does not create executable tests, runtime routing, registry records, Supabase changes, retrieval services, public chat, app behaviour or specialist activation.
