# Foreman QP and ECAP — APW Durable Paid-Call Runtime PR #1977

**Wave**: APW-DURABLE-PAID-CALL-RUNTIME-IMPLEMENTATION-V01  
**PR**: #1977  
**CS2 Authority**: Johan Ras  
**Reviewed implementation head**: `e0889bdc1832f3fc8f86a0faee928d7717897c60`  
**Date**: 2026-07-28

## 1. Governed ancestry

| Stage | Evidence |
|---|---|
| PR-scoped task set | `e107208f6408f90ef42efc466af891f89d9aabb3` |
| Independent IAA prebrief | `47b9ef55322fcfbf68be31fe972e976ce25bb552` |
| Runtime-builder appointment | `53ed397d3af85325e9ed544ec48b922474b5648c` |
| Runtime core began | `648a61977e03b3908c5515b10717e5618b93f0a0` |
| Gate-detected first implementation-like path | `ed54be17febbc14b8f8dcef41706fe4c3c8066b8` |
| Delegation evidence reconciled | `e0889bdc1832f3fc8f86a0faee928d7717897c60` |

The independent prebrief and builder appointment are strict ancestors of all implementation commits.

## 2. Delivered runtime controls

- shared durable usage-store abstraction;
- atomic call and estimated-token reservation before provider invocation;
- success reconciliation from estimated to actual token usage;
- provider-failure release and shared failure counting;
- durable daily call and token ceilings;
- privacy-safe HMAC client buckets derived from server-observed request metadata;
- per-client daily request ceiling;
- shared fail-closed circuit breaker;
- fail-closed `durable_budget_unavailable` response when configuration or RPC access is unavailable;
- route-safe categorical and numeric budget telemetry;
- deterministic shared in-memory adapter for isolated tests;
- service-role-only PostgreSQL/Supabase RPC migration artefact;
- explicit provider-budget and observation-window activation gates.

## 3. Security and privacy review

PASS:

- no raw prompt or answer is added to budget persistence or telemetry;
- no raw IP/client identifier is logged or persisted;
- client bucket is a keyed non-reversible HMAC digest;
- client-supplied identity is overwritten with server-observed request metadata;
- `anon` and `authenticated` have no migration table or RPC privileges;
- the service-role credential remains server-side only;
- the model allowlist remains `gpt-4o-mini`;
- restricted requests remain static and zero-token;
- Maturion remains final visible public-response authority;
- paid calls remain default-off.

## 4. Test and workflow evidence

The exact implementation head passed:

- `APW-RED-PAID-001..016` as GREEN;
- focused concurrency, token-budget, per-client, failure/circuit and privacy tests;
- existing public-chat regression;
- complete MAT AI Gateway regression;
- gateway lint and test workflow;
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

CodeQL must be green on the final assurance head before independent IAA disposition.

## 5. Migration and infrastructure boundary

The migration:

```text
supabase/migrations/20260728080000_apw_durable_paid_call_budget.sql
```

is committed but unapplied. No Supabase, Render, Vercel or OpenAI configuration was changed. No branch deployment or paid provider call was authorised or performed.

Required live state remains:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

## 6. Foreman QP disposition

```text
QP_PASS — DURABLE_PAID_CALL_RUNTIME_IMPLEMENTED_TO_GREEN — DEPLOYMENT_NO_GO
```

## 7. ECAP validation

- scope declaration present and aligned;
- machine delegation-order record present and gate-aligned;
- task set and prebrief precede appointment;
- appointment precedes all implementation;
- SQL migration explicitly marked unapplied;
- operator runbook preserves deployment and paid-call NO-GO;
- no unrelated module or tenant-data changes;
- independent final IAA remains mandatory.

```text
ECAP_PASS — ADMINISTRATIVE_EVIDENCE_COMPLETE — FINAL_IAA_PENDING
```

Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.
