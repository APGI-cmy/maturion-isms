# Builder Appointment — APW Durable Paid-Call Runtime v0.1

**Appointment ID**: APW-DURABLE-PAID-CALL-RUNTIME-001  
**Appointed role**: `runtime-builder`  
**Builder identity**: `apw-durable-paid-call-runtime-builder`  
**Authority**: CS2 — Johan Ras  
**PR**: #1977  
**Branch**: `apw-durable-paid-call-runtime-v01`  
**Wave task commit**: `e107208f6408f90ef42efc466af891f89d9aabb3`  
**IAA prebrief commit**: `47b9ef55322fcfbf68be31fe972e976ce25bb552`  
**Date**: 2026-07-28

## Appointment

The runtime builder is appointed only to implement the repository-side controls required to build `APW-RED-PAID-001..016` to GREEN while preserving zero-cost production containment.

## In scope

- durable paid-call usage-store abstraction;
- PostgreSQL/Supabase schema and atomic RPC migration artefacts;
- atomic call and token reservation;
- success and provider-failure reconciliation;
- daily call and token ceilings shared across workers and replicas;
- privacy-safe keyed anonymous-client fingerprinting and rate limits;
- shared fail-closed circuit breaker;
- safe containment reasons and route-safe budget telemetry;
- deterministic in-memory test adapter that shares state across service instances;
- executable unit, concurrency, restart and regression tests;
- operator documentation for unapplied migration and required server-side configuration;
- PR-scoped delegation, QP, ECAP and final IAA evidence.

## Out of scope

- applying any database migration;
- changing Supabase, Render, Vercel or OpenAI configuration;
- deploying this branch;
- enabling paid calls in staging or production;
- adding models or providers;
- private, tenant or customer retrieval;
- logging or persisting raw prompts, answers, IP addresses, credentials, secrets or tokens;
- changing Maturion final public-response authority.

## Mandatory controls

1. Implementation begins only after this appointment commit.
2. `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false` remains mandatory in all live environments.
3. Paid-call eligibility must fail closed if durable budget configuration or reservation fails.
4. Provider invocation must occur only after an atomic call and token reservation succeeds.
5. Actual usage must be reconciled after success; failures must release or mark reservations safely.
6. Client identifiers must use a keyed non-reversible fingerprint and must never expose the raw identifier.
7. No prompt or answer content may enter budget records or telemetry.
8. Existing public-chat tests and privacy routing must remain GREEN.
9. SQL and infrastructure artefacts remain unapplied until a later explicit CS2 deployment decision.
10. Return to independent IAA before merge or deployment proposal.

## Required handover evidence

- migration and RPC review;
- one-to-one `APW-RED-PAID-001..016` GREEN evidence;
- focused concurrency and failure tests;
- full gateway regression result;
- safe telemetry inspection;
- changed-file scope;
- QP and ECAP;
- independent final IAA.

## Current disposition

```text
RUNTIME_BUILDER_APPOINTED — IMPLEMENTATION_AUTHORISED — DEPLOYMENT_AND_PAID_CALLS_NO_GO
```

Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.
