# Builder Appointment Package — APW Specialist Implementation Wave v0.1

**Artifact ID**: MRAR-BUILDER-APPOINTMENT-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Implementation Appointment Conditions  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 4 — Runtime Activation Readiness Pack v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26

---

## 1. Purpose

This package defines the conditions for appointing a builder in the next APW Specialist implementation wave.

It is not a current instruction to code. It prepares the appointment contract that must be explicitly accepted in a later implementation PR.

---

## 2. Appointment Status

| Field | Value |
|---|---|
| Current status | NOT APPOINTED / NOT STARTED |
| Next possible wave | APW Specialist Implementation — Red Tests + Stubs |
| Runtime implementation allowed in Batch 4 | No |
| Specialist activation allowed in Batch 4 | No |
| Registry mutation allowed in Batch 4 | No |
| Database mutation allowed in Batch 4 | No |
| Public APW behaviour change allowed in Batch 4 | No |

---

## 3. Future Builder Mandate

A future builder may be appointed to implement only a red-tests-and-stubs wave first.

Permitted future implementation tasks may include:

- creating red test fixtures;
- creating a context-envelope validation stub;
- creating a route-classifier stub;
- creating a runtime registry resolver stub or abstraction;
- creating a public-safe filter adapter stub;
- creating an APW Specialist invocation adapter stub;
- creating output validation stubs;
- proving unsafe cases fail red;
- documenting remaining build-to-green work.

---

## 4. Future Builder Must Not Do Initially

The first implementation builder must not:

- activate APW Specialist;
- create a production ACTIVE registry record;
- expose APW Specialist directly to users;
- change public APW behaviour;
- deploy public chat;
- query or mutate Supabase directly from APW Specialist;
- pass tenant, private, internal or secret context to the specialist;
- bypass Maturion final synthesis;
- change `.github/agents` contracts;
- grant CS2 authority to Maturion or APW Specialist.

---

## 5. Required Appointment Inputs

Before the next implementation PR is opened, the appointment must include:

1. builder identity;
2. implementation branch name;
3. exact allowed file paths;
4. forbidden paths;
5. runtime registry storage decision or temporary stub decision;
6. public APW context source decision;
7. knowledge filter integration decision;
8. QA-to-Red fixture list;
9. audit trace storage decision or temporary stub decision;
10. rollback plan;
11. IAA preflight brief;
12. CS2 approval checkpoint.

---

## 6. Suggested Next Implementation Wave Boundary

Recommended next wave:

```text
Batch 5 — APW Specialist Implementation: Red Tests + Stubs
```

Recommended allowed scope:

- test fixtures;
- validation stubs;
- resolver abstractions;
- route decision stubs;
- no production activation.

Recommended forbidden scope:

- production registry activation;
- public APW UI changes;
- Supabase migrations unless separately approved;
- production retrieval services;
- `.github/agents` changes;
- release/deployment changes.

---

## 7. Handover to Later Builder

The later builder must begin with the readiness matrix, implementation FRS, implementation TRS and QA-to-Red implementation test plan.

The builder must not infer permission from this package alone. A separate PR scope and CS2 instruction are required.
