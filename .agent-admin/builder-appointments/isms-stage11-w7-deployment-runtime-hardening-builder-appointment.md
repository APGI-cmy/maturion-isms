# ISMS Stage 11 — Builder Appointment: W7 Deployment, Runtime, Env, CI Hardening

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact | Builder Appointment |
| Stage | Stage 11 |
| Wave | W7 — Deployment, Runtime, Env, CI Hardening |
| Appointment ID | `isms-stage11-w7-deployment-runtime-hardening-20260611` |
| Status | APPOINTED FOR W7 ONLY |
| Foreman | foreman-agent |
| Builder Role | implementation-builder-w7-deployment-runtime-hardening |

---

## 1. Appointment Decision

The Foreman appoints the W7 implementation builder for ISMS deployment/runtime/env/CI hardening.

This appointment is limited to W7 only.

```text
W7 — Deployment, Runtime, Env, CI Hardening
```

This appointment does not authorize W8 cumulative regression/PBFAG rerun, implementation handover, live AI provider work, production auth/payment changes, Supabase runtime persistence hooks, Edge Function invocation, or production audit writer invocation.

---

## 2. Builder Acknowledgement

The appointed builder acknowledges:

| ID | Required acknowledgement | Status |
|---|---|---|
| ACK-001 | Read Stage 8 Implementation Plan | Acknowledged |
| ACK-002 | Read Stage 9 Builder Checklist | Acknowledged |
| ACK-003 | Read Stage 10 IAA Pre-Brief/Acknowledgements | Acknowledged |
| ACK-004 | Accepts W7-only scope and constraints | Acknowledged |
| ACK-005 | Accepts deployment/env/route verification evidence obligations | Acknowledged |
| ACK-006 | Accepts that implementation handover remains blocked until W8/later gates | Acknowledged |

---

## 3. W7 Scope

Primary scope:

- select/document deployment target;
- configure SPA fallback for deep links;
- add ISMS portal env example/registry alignment;
- add route verification script;
- align package scripts for W7 CI verification;
- document rollback/redeploy strategy;
- update tracker/evidence.

---

## 4. Explicitly Out of Scope

The builder must not implement:

- W8 cumulative regression/PBFAG rerun;
- live AI provider calls;
- production auth/payment;
- Supabase runtime persistence hooks;
- Edge Function invocation;
- production audit writer invocation;
- production handover claims.

---

## 5. Required Evidence on Completion

Before W7 can be accepted, the builder must provide:

- deployment target evidence;
- SPA fallback evidence;
- env example/registry evidence;
- route verification evidence;
- CI command alignment evidence;
- rollback/redeploy documentation;
- build/lint/test or CI evidence;
- review conversation disposition;
- confirmation W8 remains unappointed and unimplemented.

---

## 6. Appointment Result

```text
BUILDER APPOINTMENT: APPROVED FOR W7 ONLY
RUNTIME EXECUTION: AUTHORIZED ONLY FOR DEPLOYMENT/RUNTIME/ENV/CI HARDENING
IMPLEMENTATION HANDOVER: NOT AUTHORIZED
PRODUCTION READINESS: NOT AUTHORIZED
```
