# ISMS — Architecture Remediation Pack

| Field | Value |
|---|---|
| Product | ISMS |
| Artifact | Architecture Remediation Pack |
| Status | DRAFT — PBFAG remediation |
| Wave | `isms-stage7-architecture-remediation-20260531` |

---

## 1. Purpose

This pack addresses the Stage 7 PBFAG remediation requirements before Stage 8 Implementation Plan.

It does not implement code or approve implementation transfer.

---

## 2. Deployment and Runtime Architecture

Target app:

```text
apps/isms-portal
```

Runtime:

```text
Vite React TypeScript SPA
```

Required runtime paths:

| Item | Path |
|---|---|
| package | `apps/isms-portal/package.json` |
| HTML entry | `apps/isms-portal/index.html` |
| React entry | `apps/isms-portal/src/main.tsx` |
| App router | `apps/isms-portal/src/App.tsx` |
| Build output | `apps/isms-portal/dist/` |

Required commands:

```text
npm run lint
npm run test:run
npm run build
```

Deployment target remains provider-pending. Until selected, the implementation plan must assume static SPA hosting with route fallback to `index.html`.

---

## 3. Environment Variable Registry

Minimum env registry to be finalized before implementation:

| Variable | Purpose | Public? | Required when |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | yes | Supabase enabled |
| `VITE_SUPABASE_ANON_KEY` | Supabase browser anon key | yes | Supabase enabled |
| `VITE_AI_ENABLED` | Toggle Ask Maturion affordances | yes | AI UI enabled |
| `VITE_CHECKOUT_PROVIDER` | Checkout provider mode | yes | Subscription flow enabled |
| `VITE_APP_ENV` | Runtime environment label | yes | all environments |

Non-browser service credentials must not be exposed through `VITE_*` variables.

`.env.example` must be updated when implementation starts.

---

## 4. Supabase Data Architecture

Initial persistence decision:

- Public marketing pages may use static/config data.
- Onboarding, entitlements, assessment results, handoff events, and audit events require persistence before production use.
- Early non-production waves may use explicit mock/local state if documented.

Candidate tables:

| Table | Purpose |
|---|---|
| `isms_org_profiles` | organisation onboarding profile |
| `isms_user_profiles` | user role and preferences |
| `isms_subscriptions` | package and entitlement state |
| `isms_assessment_results` | free assessment baseline reference |
| `isms_handoff_events` | module handoff records |
| `isms_audit_events` | audit event stream |

Migration plan must define file location, order, rollback, and seed/mock policy before implementation.

---

## 5. RLS and Tenant Isolation Matrix

Every persisted tenant-scoped table must have RLS or equivalent tenant isolation before production.

| Table | Tenant Boundary | Public Access | Authenticated Access |
|---|---|---|---|
| `isms_org_profiles` | `org_id` | none | own org only |
| `isms_user_profiles` | `user_id`, `org_id` | none | own profile / own org role rules |
| `isms_subscriptions` | `org_id` | none | own org only |
| `isms_assessment_results` | session/ref + optional `org_id` | result owner only | own org/user after claim |
| `isms_handoff_events` | `org_id` | none | own org admin/audit role |
| `isms_audit_events` | `org_id` | none | own org admin/audit role |

Stage 8 must turn this into executable policies or an explicit no-persistence waiver.

---

## 6. Edge Function Registry

Initial decision:

```text
No ISMS-specific edge functions are approved by this remediation pack.
```

If implementation introduces an edge function, the registry must be amended with:

- function name;
- caller;
- input contract;
- output contract;
- auth requirement;
- error behavior;
- deploy status.

Known candidate boundaries:

| Candidate | Initial Status |
|---|---|
| free assessment persistence | undecided; client/session or Supabase direct initially |
| checkout callback | provider-dependent |
| audit event write | direct Supabase or future function |
| AI request mediation | package adapter initially, function only if needed |

---

## 7. AI Capability Architecture

Ask Maturion must use an adapter boundary.

Adapter contract:

| Field | Description |
|---|---|
| `mode` | `public` or `authenticated` |
| `route` | current route |
| `moduleId` | active module if any |
| `userRole` | authenticated role only |
| `orgId` | authenticated only |
| `subscriptionState` | allowed module summary only |
| `promptSeed` | approved prompt seed |

Rules:

- public mode is educational only;
- public mode must not require tenant data;
- authenticated mode may use filtered context;
- AI may not bypass route guards or entitlements;
- failure must show a non-blocking fallback.

---

## 8. System Wiring Map

Minimum wiring paths:

| Path | Wiring |
|---|---|
| landing to module marketing | route constants -> module card config -> router |
| landing to free assessment | CTA -> `/free-assessment` -> result state -> subscribe/auth |
| marketing to subscribe | CTA -> `/subscribe` with optional source context |
| subscribe to checkout | package selection -> `/subscribe/checkout` |
| checkout to auth/onboarding | unauthenticated -> `/auth`; authenticated -> `/onboarding` |
| onboarding to private shell | context init -> dashboard/preferred module |
| private module entry | entitlement check -> handoff payload -> protected route |
| Ask Maturion | UI affordance -> AI adapter -> package/function boundary -> response/fallback |
| audit events | material event -> audit writer -> storage/mock sink |

---

## 9. E2E Functional Paths

Required path traces for Stage 8:

1. visitor lands -> module page -> subscribe;
2. visitor lands -> free assessment -> result -> subscribe;
3. subscribe -> checkout -> auth -> onboarding -> dashboard;
4. authenticated user opens subscribed MMM -> `/maturity/setup`;
5. authenticated user opens unsubscribed module -> explanation/upgrade;
6. public Ask Maturion prompt -> educational response/fallback;
7. authenticated Ask Maturion prompt -> filtered context response/fallback;
8. unauthorized route attempt -> auth/access message + audit event;
9. checkout failure -> visible recovery;
10. dependency failure -> degraded mode.

---

## 10. Error and Observability Architecture

Error classes:

- validation error;
- authentication error;
- authorization error;
- dependency error;
- checkout error;
- AI error;
- system error.

Observability requirements:

- user-visible recovery message;
- non-sensitive diagnostic event;
- no credential or payment data in logs;
- handoff and route denial events record source/target route and decision.

---

## 11. Subscription, Checkout, Entitlement Architecture

Provider decision is pending.

Implementation plan must choose one:

1. mock checkout for early internal wave;
2. configured provider callback for production-ready wave.

Minimum entitlement state:

| Field | Purpose |
|---|---|
| `subscriptionKey` | package id |
| `enabledModules` | accessible modules |
| `trialModules` | temporary access |
| `expiredModules` | expired access |
| `upgradeRoute` | upgrade path |

Activation rule:

- checkout success creates or updates entitlement state;
- enabled modules become private-route eligible;
- unsubscribed modules route to explanation/upgrade.

---

## 12. Implementation Wave Plan

Recommended waves:

| Wave | Scope | Required QA |
|---|---|---|
| W1 | route registry, public pages, redirects | D1, D2 |
| W2 | free assessment result flow | D3 |
| W3 | subscribe, checkout mock, auth, onboarding | D4 |
| W4 | shared context, entitlement, MMM handoff | D5 |
| W5 | Ask Maturion adapter | D6 |
| W6 | data persistence, schema/RLS/audit | D8, D9 |
| W7 | deployment/env/CI hardening | D10 |
| W8 | cumulative regression and PBFAG rerun | D11 + all prior |

Each wave must be fully wired inside its own scope. No wave may hand over future wiring as complete.

---

## 13. Remediation Disposition

This pack closes the first architecture-remediation pass at the design level.

Before implementation transfer:

- Stage 7 PBFAG must be amended or rerun;
- Stage 8 Implementation Plan must derive from this pack;
- Stage 9 Builder Checklist must use the wave plan above;
- CI/build/test evidence remains required for implementation waves.
