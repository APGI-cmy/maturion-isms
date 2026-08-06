# Independent Final IAA — APW Durable Paid-Call Runtime PR #1977

**IAA Token**: `IAA-APW-DURABLE-PAID-CALL-RUNTIME-1977-20260728-PASS`  
**Wave**: APW-DURABLE-PAID-CALL-RUNTIME-IMPLEMENTATION-V01  
**PR**: #1977  
**Assessed frozen head**: `ddf376b2d1b5c746b4e22be06e06d59e75e07200`  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-07-28  
**Verdict**: PASS

## 1. Independence statement

This assurance disposition evaluates the frozen implementation against the prebrief, the merged `APW-RED-PAID-001..016` contract, the builder boundary and the repository evidence. It does not authorise deployment, infrastructure mutation or paid model use.

## 2. Delegation and governance review

PASS:

- task set committed before the prebrief;
- independent prebrief committed before appointment;
- bounded runtime-builder appointment committed before implementation;
- gate-detected first implementation-like commit is a strict descendant of appointment;
- PR-scoped scope and delegation records are present;
- Builder Delegation Order Gate passes;
- Preflight, POLC, ECAP, Foreman Pre-Handover, routing, stub, Wave 7 and merge-alignment gates pass.

## 3. Functional assurance

PASS:

- `APW-RED-PAID-001..016` are GREEN;
- one shared durable-store interface replaces process-local authoritative budget state;
- reservation occurs atomically before provider invocation;
- call and token budgets are bounded;
- concurrent requests cannot overspend the in-memory contract adapter;
- provider success reconciles estimated to actual tokens;
- provider failure releases reservations and contributes to a shared circuit breaker;
- per-client limiting uses a keyed non-reversible bucket;
- server-observed request metadata overrides client-supplied client identity;
- unavailable durable authority fails closed;
- safe containment reasons and budget telemetry are present;
- existing public-chat and complete gateway regressions are GREEN.

## 4. Database and privilege assurance

PASS, as an unapplied repository artefact:

- private budget, client-bucket and reservation tables are defined;
- atomic reserve/success/failure RPCs are defined;
- table RLS is enabled;
- public, `anon` and `authenticated` privileges are revoked;
- table and RPC access is bounded to `service_role`;
- no migration was applied and no live project was mutated.

A governed deployment review must still verify the actual target project, function ownership, grants, RLS and transaction behaviour after application.

## 5. Privacy and telemetry assurance

PASS:

- no prompt or answer content is stored in the spend ledger;
- no raw IP or client identifier is persisted or logged;
- the emitted rate-limit bucket is a keyed digest;
- telemetry is limited to route, mode, containment, model, token counts and categorical/numeric budget state;
- credentials, secrets and environment values are excluded.

## 6. Cost-control assurance

PASS for repository implementation readiness:

- paid calls remain default-off;
- model allowlist remains `gpt-4o-mini`;
- output ceiling remains bounded;
- daily call, daily token and per-client ceilings are represented;
- store unavailability and circuit-open states fail closed;
- provider-budget evidence and bounded observation-window gates remain separate and unsatisfied.

## 7. Exact-head workflow evidence

The assessed head passed:

- APW Paid-Call Durable Spend Evidence;
- full MAT AI Gateway lint and test workflow;
- CodeQL JavaScript/TypeScript and Python analysis;
- Builder Delegation Order Gate;
- IAA Pre-Brief Contract Alignment;
- Preflight Evidence Gate;
- POLC Boundary Validation;
- ECAP Admin Boundary Gate;
- Foreman Pre-Handover Lane Gate;
- Routing Governance Check;
- Stub Detection Check;
- Wave 7 Governance Validation;
- Merge Gate Required Checks Alignment;
- Actions Deprecation Gate.

## 8. Residual boundaries

The following remain explicitly unauthorised:

- applying `supabase/migrations/20260728080000_apw_durable_paid_call_budget.sql`;
- changing Supabase, Render, Vercel or OpenAI configuration;
- deploying PR #1977;
- enabling paid calls;
- marking provider-budget evidence verified;
- approving a paid-call observation window.

The required live state remains:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

## 9. Final disposition

```text
IAA_PASS — DURABLE_PAID_CALL_RUNTIME_IMPLEMENTATION_COMPLETE — MERGE_ELIGIBLE — DEPLOYMENT_AND_PAID_CALLS_NO_GO
```

Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.
