# Builder Appointment — APW Paid-Call QA-to-RED Readiness v0.1

**Appointment ID**: APW-PAID-CALL-QA-TO-RED-READINESS-001  
**Appointed role**: `qa-builder`  
**Authority**: CS2 — Johan Ras  
**PR**: #1976  
**Branch**: `apw-paid-call-readiness-v01`  
**Wave task commit**: `19d037b20f3a710c5ee26ad8d417d356d6f1faa6`  
**IAA prebrief commit**: `9a3d9c784875c7546cfccc3b3d6cb2808230ea8f`  
**Date**: 2026-07-27

## Appointment

The QA builder is appointed only to define and implement the executable QA-to-RED contract for durable APW public-chat paid-call spend controls.

## In scope

- one-to-one RED inventory and traceability map;
- executable tests for a shared persistent usage ledger;
- executable tests for atomic call and token reservations;
- restart-, worker- and replica-safe budget enforcement tests;
- concurrency and race-condition tests;
- bounded anonymous-client request controls using privacy-safe identifiers;
- shared fail-closed circuit-breaker tests;
- provider-failure reservation reconciliation tests;
- route-safe telemetry contract tests;
- preservation tests for existing privacy, zero-call, model-allowlist, output-ceiling and Maturion-authority controls;
- raw RED output and existing GREEN regression evidence.

## Out of scope

- production runtime implementation;
- creation of the persistent ledger, reservation engine, rate limiter or circuit breaker;
- Supabase migration or live database mutation;
- Render, Vercel, OpenAI or other infrastructure changes;
- enabling paid calls in staging or production;
- provider or model expansion;
- private or tenant retrieval;
- changing Maturion final public-response authority;
- implementation-builder appointment.

## Mandatory controls

1. QA work begins only after this appointment commit.
2. Every RED ID must map to an executable test.
3. Tests must fail because the durable control is missing, not because of syntax, import, fixture or environment failure.
4. No test may make a real provider call.
5. No test may require or mutate a live environment.
6. No raw prompt, answer, IP address, credential, secret or token may be logged.
7. Existing zero-call containment and public-chat regression tests must remain GREEN.
8. `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false` remains mandatory.
9. The QA lane must return to independent IAA before any implementation appointment is proposed.

## Required handover evidence

- complete RED inventory and traceability map;
- exact commands and collected test count;
- intended RED failures with zero harness failures;
- existing GREEN regression result;
- changed-file scope;
- Foreman QP and ECAP update;
- newly frozen head for independent final IAA.

## Current disposition

```text
QA_BUILDER_APPOINTED — EXECUTABLE_QA_TO_RED_AUTHORISED — RUNTIME_IMPLEMENTATION_NO_GO
```

Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.
