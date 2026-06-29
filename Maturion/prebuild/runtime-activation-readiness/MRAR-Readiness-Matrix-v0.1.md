# Runtime Activation Readiness Matrix v0.1

**Artifact ID**: MRAR-MATRIX-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Readiness Matrix  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 4 — Runtime Activation Readiness Pack v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26  
**Scope Declaration**: `.agent-admin/scope-declarations/maturion-runtime-activation-readiness-pack-v01.md`

---

## 1. Purpose

This matrix consolidates the outputs of Batches 1–3 into readiness conditions for a later APW Specialist implementation wave.

It does not approve implementation or activation. It identifies what is ready, what is blocked, and what must be proven before build-to-green begins.

---

## 2. Readiness Principle

```text
Prebuild artifacts are not runtime permission.
A specialist can be implemented only after its context, registry, knowledge, tests, audit, fallback and authority boundaries are explicit and testable.
```

---

## 3. Readiness Status Legend

| Status | Meaning |
|---|---|
| READY_FOR_IMPLEMENTATION_DESIGN | Enough is defined to design implementation tasks. |
| NEEDS_TEST_FIXTURES | Concept is defined but test data/scripts must be created. |
| NEEDS_SCHEMA_DECISION | Concept is defined but storage or schema location is not yet chosen. |
| BLOCKED_UNTIL_IMPLEMENTATION_WAVE | Must not be changed in this readiness PR. |
| BLOCKED_UNTIL_ACTIVATION_WAVE | May be built later but cannot be activated until a separate gate passes. |

---

## 4. Consolidated Matrix

| Area | Source Batch | Current State | Readiness | Required Next Evidence |
|---|---|---:|---|---|
| Runtime agent network | Batch 1 | Context envelope and registry architecture defined | READY_FOR_IMPLEMENTATION_DESIGN | Implementation task breakdown with file boundaries |
| Public APW context envelope | Batch 1 + Batch 3 | Required public envelope shape defined | NEEDS_TEST_FIXTURES | Valid/invalid APW envelope fixtures |
| Runtime registry | Batch 1 + Batch 3 | Minimum registry record defined as future constraint | NEEDS_SCHEMA_DECISION | Storage decision: database, JSON registry, or hybrid |
| Specialist lifecycle | Batch 1 + Batch 3 | APW Specialist limited to prebuild/stub contracted | BLOCKED_UNTIL_ACTIVATION_WAVE | Separate activation PR and CS2 decision |
| Knowledge planes | Batch 1 + Batch 2 | Subject, app context, framework/context, tenant, memory and session boundaries defined | READY_FOR_IMPLEMENTATION_DESIGN | Mapping between metadata records and runtime knowledge planes |
| Public-safe retrieval | Batch 2 + Batch 3 | Public filters defined | NEEDS_TEST_FIXTURES | Metadata fixture pack covering public/unsafe/missing cases |
| Tenant isolation | Batch 2 + Batch 3 | Public APW mode must not receive tenant context | NEEDS_TEST_FIXTURES | Negative tests with tenant_id and tenant sources |
| APW Specialist mandate | Batch 3 | Public APW explanation/navigation/onboarding/signposting defined | READY_FOR_IMPLEMENTATION_DESIGN | Route classifier criteria and examples |
| APW Specialist prohibited knowledge | Batch 3 | Tenant/private/internal/secret/protected knowledge prohibited | NEEDS_TEST_FIXTURES | Leakage and prompt-injection style negative fixtures |
| Maturion final synthesis | Batch 1 + Batch 3 | Specialist output is draft only | READY_FOR_IMPLEMENTATION_DESIGN | Output validation contract and tests |
| Direct retrieval prevention | Batch 2 + Batch 3 | Specialist must not query Supabase directly | NEEDS_TEST_FIXTURES | Test proving specialist cannot bypass filtered context |
| Audit trace | Batch 1 + Batch 3 | Required fields defined at concept level | NEEDS_SCHEMA_DECISION | Storage and retention decision |
| Degraded mode | Batch 1 + Batch 3 | Block/degrade/handoff defined | NEEDS_TEST_FIXTURES | Handoff and limitation scenarios |
| Builder appointment | Batch 3 + Batch 4 | Future appointment package exists; active readiness package to be defined | BLOCKED_UNTIL_IMPLEMENTATION_WAVE | CS2 approval of next PR scope |

---

## 5. Minimum Conditions Before Implementation Wave

Before an APW Specialist implementation wave begins, the following must be true:

1. CS2 approves the readiness pack.
2. Implementation scope declares exact files allowed and forbidden.
3. Runtime registry storage decision is recorded.
4. Context envelope source for public APW is identified.
5. Public-safe knowledge-filter integration point is identified.
6. Red-first test fixtures are created or specified.
7. Builder appointment is current-head bound.
8. IAA preflight is recorded for the implementation PR.
9. No production activation is included in the implementation PR.

---

## 6. Activation Remains Separate

Even after implementation, APW Specialist must not be activated until a later activation PR proves:

- implementation tests pass;
- registry status transition is approved;
- public APW preview behaviour is validated;
- audit trace is captured;
- rollback is defined;
- CS2 approves activation.
