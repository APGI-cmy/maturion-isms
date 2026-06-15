# ISMS Edge/Backend Boundary Registry

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Wave | W6 — Backend Boundary, Persistence, Schema/RLS, Audit |
| Status | ACTIVE — W6 boundary contract |
| Date | 2026-06-10 |

---

## Boundary decision

W6 introduces **schema/RLS/audit boundary definitions** for ISMS, but does not introduce any Supabase Edge Function invocation from the portal runtime.

```text
EDGE FUNCTION DECISION: NO EDGE FUNCTIONS INTRODUCED IN W6
```

Rationale:

- W1-W5 runtime surfaces currently need persisted objects and audit boundaries, not server-side execution.
- Ask Maturion remains a deterministic local adapter until a later explicitly appointed wave authorizes live provider integration.
- Introducing Edge Functions before schema/RLS ownership would create an unregistered backend invocation risk.

---

## Registered backend capabilities

| Capability | W6 status | Caller | Input | Output | Auth model | Error model | Deploy status |
|---|---|---|---|---|---|---|---|
| Free assessment persistence | Schema registered | Future hook | assessment context, answers, report summary | `isms_assessments` row | authenticated user scoped by RLS | Hook must fail closed if no authenticated user or insert/select policy denies access | Migration only |
| Onboarding profile persistence | Schema registered | Future hook | organisation profile | `isms_onboarding_profiles` row | authenticated user scoped by RLS | Hook must fail closed if no authenticated user or policy denies access | Migration only |
| Entitlement state persistence | Schema registered | Future hook | module key, source, status | `isms_entitlements` row | authenticated user scoped by RLS | Hook must fail closed if no authenticated user or policy denies access | Migration only |
| Maturity handoff persistence | Schema registered | Future hook | handoff payload | `isms_maturity_handoffs` row | authenticated user scoped by RLS | Hook must fail closed if no authenticated user or policy denies access | Migration only |
| Prompt audit logging | Schema registered | Future hook | prompt metadata, mode, status | `isms_audit_events` row | authenticated user scoped by RLS; append-only client policy | Hook must fail closed if insert policy denies access; no client update/delete path | Migration only |

---

## Explicitly unregistered in W6

The following remain out of scope and must not be invoked by W6 runtime code:

- live AI provider calls;
- Ask Maturion provider adapters;
- payment provider webhooks;
- entitlement provisioning services;
- private MMM execution functions;
- deployment automation functions.

---

## Invocation rule

No frontend code may call a backend function unless that function is listed in this registry with:

- caller;
- input contract;
- output contract;
- auth model;
- error model;
- deploy status.

As of W6, there are **no allowed Edge Function invocations** for ISMS portal runtime.
