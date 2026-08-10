# APW Durable Paid-Call Runtime Implementation Wave Proposal v0.1

**Artifact ID**: APW-DURABLE-PAID-CALL-RUNTIME-WAVE-001  
**Version**: 0.1.0  
**Status**: PROPOSED — RUNTIME IMPLEMENTATION NO-GO PENDING EXPLICIT CS2 AUTHORITY  
**Authority**: CS2 — Johan Ras  
**Repository**: `APGI-cmy/maturion-isms`  
**Branch**: `apw-durable-paid-call-runtime-v01`  
**Date**: 2026-07-28

## 1. Purpose

Create the separate governed carrier for building the durable APW public-chat spend controls specified and independently assured through merged PR #1976.

This proposal does not itself authorise implementation or paid calls.

## 2. Merged QA authority

PR #1976 merged at:

```text
3d5b02e61da046636b103ddfca766f374e1c81e6
```

Final IAA token:

```text
IAA-APW-PAID-CALL-QA-RED-1976-20260728-PASS
```

The merged 16-case QA contract defines the future build target:

- persistent shared usage authority;
- atomic call reservation;
- atomic token reservation and reconciliation;
- restart-, worker- and replica-safe daily limits;
- privacy-safe anonymous-client rate limiting;
- shared fail-closed circuit breaking;
- provider-failure reconciliation;
- route-safe durable budget telemetry;
- provider-budget evidence and bounded observation-window gates.

## 3. Required governance sequence

Before runtime implementation begins:

1. Explicit CS2 authorisation of the bounded runtime implementation wave.
2. PR-scoped task set.
3. Canonical independent IAA prebrief.
4. Bounded runtime-builder appointment referencing the prebrief.
5. Machine-readable delegation-order evidence.
6. Implementation only after appointment.
7. Build all `APW-RED-PAID-001..016` cases to GREEN without weakening them.
8. Preserve the existing public-chat regression suite.
9. Complete Foreman QP and ECAP.
10. Freeze the final head and obtain independent final IAA.
11. Separate later authority for any infrastructure deployment or paid-call activation.

## 4. Proposed implementation scope

The future bounded runtime wave may include:

- durable budget-store abstraction and implementation;
- atomic call/token reservation and reconciliation;
- daily budget state shared across service instances;
- privacy-safe rate-limit keys without raw identifier logging;
- shared circuit-breaker state and fail-closed behaviour;
- provider-error reservation reconciliation;
- safe numeric and categorical telemetry;
- unit, concurrency, restart and integration tests;
- operator documentation for required configuration.

## 5. Explicit non-scope

Until separately authorised, this branch and PR must not:

- implement runtime code;
- create or apply database migrations;
- mutate Supabase, Render, Vercel or OpenAI configuration;
- enable paid calls in staging or production;
- change the model allowlist;
- introduce private or tenant retrieval;
- change Maturion final public-response authority;
- deploy or activate any new infrastructure.

## 6. Required live state

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

## 7. Proposed next CS2 decision

```text
AUTHORISE_APW_DURABLE_PAID_CALL_RUNTIME_IMPLEMENTATION_WAVE
```

That decision should authorise only the bounded prebrief, runtime-builder appointment and build-to-GREEN implementation. Infrastructure deployment and paid-call activation must remain separate later decisions.

## 8. Current disposition

```text
RUNTIME_CARRIER_OPENING_AUTHORISED — IMPLEMENTATION_BUILDER_NO_GO — PAID_CALLS_DISABLED
```
