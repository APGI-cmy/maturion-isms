# ISMS Stage 11 — Builder Appointment: W4 Shared Context, Entitlement, MMM Handoff

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact | Builder Appointment |
| Stage | Stage 11 |
| Wave | W4 — Shared Context, Entitlement, MMM Handoff |
| Appointment ID | `isms-stage11-w4-context-entitlement-handoff-20260610` |
| Status | APPOINTED FOR W4 ONLY |
| Foreman | foreman-agent |
| Builder Role | implementation-builder-w4-context-entitlement-handoff |

---

## 1. Appointment Decision

The Foreman appoints the W4 implementation builder for the ISMS shared context, entitlement checks, and protected maturity roadmap handoff surface.

This appointment is limited to W4 only.

```text
W4 — Shared Context, Entitlement, MMM Handoff
```

This appointment does not authorize W5-W8, live Ask Maturion integration, Supabase persistence, RLS, audit writer, deployment hardening, cumulative regression/PBFAG rerun, production payment/auth, or implementation handover.

---

## 2. Builder Acknowledgement

The appointed builder acknowledges:

| ID | Required acknowledgement | Status |
|---|---|---|
| ACK-001 | Read Stage 8 Implementation Plan | Acknowledged |
| ACK-002 | Read Stage 9 Builder Checklist | Acknowledged |
| ACK-003 | Read Stage 10 IAA Pre-Brief/Acknowledgements | Acknowledged |
| ACK-004 | Accepts W4-only scope and constraints | Acknowledged |
| ACK-005 | Accepts build/lint/test/CI evidence obligations | Acknowledged |
| ACK-006 | Accepts that implementation handover remains blocked until later gates | Acknowledged |

---

## 3. W4 Scope

Primary scope:

- implement shared ISMS context provider/hook;
- implement local mock entitlement interpretation from W3 checkout state;
- implement entitlement checks for private module access;
- route unsubscribed module access to explanation/upgrade path;
- route subscribed maturity roadmap access to `/maturity/setup` with a handoff payload;
- reserve/protect future module private routes;
- keep persistence, audit and production entitlement out of scope.

---

## 4. Likely Files in Scope

- `apps/isms-portal/src/context/IsmsContext.tsx`
- `apps/isms-portal/src/lib/entitlements.ts`
- `apps/isms-portal/src/lib/handoff.ts`
- `apps/isms-portal/src/pages/Dashboard.tsx`
- `apps/isms-portal/src/pages/MaturitySetup.tsx`
- `apps/isms-portal/src/App.tsx`
- W4 evidence and PR-scoped functional delivery artifacts.

---

## 5. Explicitly Out of Scope

The builder must not implement:

- W5 Ask Maturion adapter or live AI provider integration;
- W6 Supabase persistence, RLS, edge/backend functions, audit writer, or production entitlement store;
- W7 deployment hardening;
- W8 cumulative regression/PBFAG rerun;
- real payment provider or real auth provider;
- production handover claims.

---

## 6. Required Evidence on Completion

Before W4 can be accepted, the builder must provide:

- changed-file scope evidence;
- context/handoff evidence;
- entitlement/protected route evidence;
- QA mapping to Stage 6 D5 RED tests;
- build/lint/test or CI evidence;
- review conversation disposition;
- confirmation that W5-W8 remain unappointed and unimplemented.

---

## 7. Appointment Result

```text
BUILDER APPOINTMENT: APPROVED FOR W4 ONLY
RUNTIME EXECUTION: AUTHORIZED ONLY FOR W4 SHARED CONTEXT, ENTITLEMENT AND MATURITY HANDOFF
IMPLEMENTATION HANDOVER: NOT AUTHORIZED
PRODUCTION READINESS: NOT AUTHORIZED
```
