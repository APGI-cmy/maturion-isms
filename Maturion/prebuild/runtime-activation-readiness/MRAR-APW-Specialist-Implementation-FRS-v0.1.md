# APW Specialist Implementation FRS v0.1

**Artifact ID**: MRAR-APW-FRS-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Implementation Readiness FRS  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 4 — Runtime Activation Readiness Pack v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26

---

## 1. Purpose

This Functional Requirements Specification defines the user-visible and orchestration behaviour expected from a later APW Specialist implementation wave.

It does not implement that behaviour.

---

## 2. Functional Principle

```text
Public APW users talk to Maturion.
Maturion may use APW Specialist only as a governed behind-the-scenes helper.
Maturion remains responsible for the final public answer.
```

---

## 3. Public APW User Behaviour

### MRAR-FRS-001 — Public APW Maturion Entry Point

Public APW users must see Maturion as the single assistant. APW Specialist must not be exposed as a separate public assistant in the initial implementation.

### MRAR-FRS-002 — Public APW Question Types

Maturion may consider APW Specialist support for:

- APW product explanation;
- APW public module explanation;
- onboarding guidance;
- public navigation support;
- capability explanation;
- safe contact/demo/login signposting;
- clarification of APW boundaries and limitations.

### MRAR-FRS-003 — Private Question Refusal or Handoff

If a user asks for tenant, customer, account, internal, secret, incident, investigation, audit, evidence or authenticated context, Maturion must not route the question to APW Specialist in public mode.

### MRAR-FRS-004 — Public-Safe Knowledge Only

Maturion may answer public APW questions only from public-safe sources or current-session user-provided content, with limitations clearly disclosed where source coverage is incomplete.

### MRAR-FRS-005 — No Invention of APW Facts

Where approved public APW knowledge is missing, Maturion must not invent product facts. It must either answer generally with clear limitation language or provide a safe handoff.

### MRAR-FRS-006 — Specialist Output Is Draft Support

APW Specialist output must be treated as draft support for Maturion. Maturion must validate and synthesise the final answer.

### MRAR-FRS-007 — Safe Handoff Routes

Maturion may offer only approved safe handoff routes such as contact, demo, login, onboarding enquiry or human review. Handoff language must not imply guaranteed acceptance, delivery, pricing or contractual commitment.

### MRAR-FRS-008 — No Authority Escalation

APW Specialist must not approve, commit, quote binding pricing, promise delivery, sign off governance work, speak as CS2, or change app state.

---

## 4. Routing Functional Requirements

### MRAR-FRS-009 — Route Classification

Maturion must classify a public APW request as one of:

| Route | Meaning |
|---|---|
| `maturion_only` | Answer without APW Specialist. |
| `apw_specialist_candidate` | Request is eligible for specialist support if all gates pass. |
| `blocked_private_context` | Request needs private/authenticated/tenant context. |
| `blocked_unsafe_source` | Required source is not public-safe. |
| `handoff` | Human/contact/login/demo route is safer. |
| `cannot_answer` | Insufficient approved knowledge. |

### MRAR-FRS-010 — Route Eligibility

A request is eligible for APW Specialist only when:

1. app context is APW;
2. embodiment is public web or later-approved public APW surface;
3. permission scope is public;
4. user is unauthenticated or has no tenant context in public mode;
5. task is within APW Specialist mandate;
6. required sources pass public-safe filters;
7. future registry permits invocation.

### MRAR-FRS-011 — Degraded Public Answer

When a route is blocked, Maturion must degrade safely. Degraded answers may include:

- limitation disclosure;
- public-only explanation;
- contact/demo/login signpost;
- request for the user to authenticate where appropriate;
- refusal to provide private or internal information.

---

## 5. Acceptance Criteria

A later implementation is functionally acceptable only if:

- public APW users interact with Maturion, not APW Specialist directly;
- APW Specialist is invoked only for eligible public APW requests;
- private/tenant/internal/secret requests are blocked in public mode;
- no APW fact is invented when source coverage is missing;
- Maturion validates specialist output before final response;
- safe handoff works;
- activation remains separate from implementation unless a separate activation PR is approved.
