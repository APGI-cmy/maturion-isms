# ISMS Stage 11 — Builder Appointment: W3 Subscribe, Checkout Mock, Auth, Onboarding

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact | Builder Appointment |
| Stage | Stage 11 |
| Wave | W3 — Subscribe, Checkout Mock, Auth, Onboarding |
| Appointment ID | `isms-stage11-w3-subscribe-auth-onboarding-20260608` |
| Status | APPOINTED FOR W3 ONLY |
| Foreman | foreman-agent |
| Builder Role | implementation-builder-w3-subscribe-auth-onboarding |

---

## 1. Appointment Decision

The Foreman appoints the W3 implementation builder for the ISMS subscribe, checkout mock, auth entry, and onboarding shell journey.

This appointment is limited to W3 only.

```text
W3 — Subscribe, Checkout Mock, Auth, Onboarding
```

This appointment does not authorize W4-W8, entitlement implementation, private MMM handoff, live payment provider integration, production auth provider implementation, backend persistence, deployment workflow creation, or implementation handover.

---

## 2. Builder Acknowledgement

The appointed builder acknowledges:

| ID | Required acknowledgement | Status |
|---|---|---|
| ACK-001 | Read Stage 8 Implementation Plan | Acknowledged |
| ACK-002 | Read Stage 9 Builder Checklist | Acknowledged |
| ACK-003 | Read Stage 10 IAA Pre-Brief/Acknowledgements | Acknowledged |
| ACK-004 | Accepts W3-only scope and constraints | Acknowledged |
| ACK-005 | Accepts build/lint/test/CI evidence obligations | Acknowledged |
| ACK-006 | Accepts that implementation handover remains blocked until later gates | Acknowledged |

---

## 3. W3 Scope

Primary scope:

- preserve and refine subscribe page package/module selection;
- accept optional source journey context from free assessment or marketing paths;
- implement checkout mock with explicit non-production status;
- route unauthenticated checkout success to `/auth`;
- route authenticated checkout success to `/onboarding`;
- implement mock auth entry sufficient for W3 journey continuity;
- implement onboarding shell with required context fields;
- validate required onboarding fields;
- route onboarding completion to a protected placeholder/dashboard path;
- keep W4 entitlement/MMM handoff out of scope.

---

## 4. Likely Files in Scope

- `apps/isms-portal/src/pages/Subscribe.tsx`
- `apps/isms-portal/src/pages/SubscribeCheckout.tsx`
- `apps/isms-portal/src/components/auth/LoginForm.tsx`
- `apps/isms-portal/src/context/AuthContext.tsx`
- `apps/isms-portal/src/pages/Onboarding.tsx`
- `apps/isms-portal/src/lib/subscription.ts`
- W3 evidence and PR-scoped functional delivery artifacts.

---

## 5. Explicitly Out of Scope

The builder must not implement:

- W4 entitlement checks or MMM handoff payload;
- W5 Ask Maturion adapter or live AI provider integration;
- W6 Supabase persistence, RLS, edge/backend functions, audit writer, or production auth;
- W7 deployment hardening;
- W8 cumulative regression/PBFAG rerun;
- production payment provider integration;
- production handover claims.

---

## 6. Required Evidence on Completion

Before W3 can be accepted, the builder must provide:

- changed-file scope evidence;
- transition path evidence;
- onboarding validation evidence;
- QA mapping to Stage 6 D4 RED tests;
- build/lint/test or CI evidence;
- review conversation disposition;
- confirmation that W4-W8 remain unappointed and unimplemented.

---

## 7. Appointment Result

```text
BUILDER APPOINTMENT: APPROVED FOR W3 ONLY
RUNTIME EXECUTION: AUTHORIZED ONLY FOR W3 SUBSCRIBE/CHECKOUT/AUTH/ONBOARDING FLOW
IMPLEMENTATION HANDOVER: NOT AUTHORIZED
PRODUCTION READINESS: NOT AUTHORIZED
```
