# ISMS Stage 11 — Builder Appointment: W6 Backend Boundary, Persistence, Schema/RLS, Audit

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact | Builder Appointment |
| Stage | Stage 11 |
| Wave | W6 — Backend Boundary, Persistence, Schema/RLS, Audit |
| Appointment ID | `isms-stage11-w6-backend-persistence-audit-20260610` |
| Status | APPOINTED FOR W6 ONLY |
| Foreman | foreman-agent |
| Builder Role | implementation-builder-w6-backend-persistence-audit |

---

## 1. Appointment Decision

The Foreman appoints the W6 implementation builder for the ISMS backend boundary, persistence schema, RLS, and audit-boundary work.

This appointment is limited to W6 only.

```text
W6 — Backend Boundary, Persistence, Schema/RLS, Audit
```

This appointment does not authorize W7-W8, deployment hardening, cumulative regression/PBFAG rerun, production handover, or live AI provider integration.

---

## 2. Builder Acknowledgement

The appointed builder acknowledges:

| ID | Required acknowledgement | Status |
|---|---|
| ACK-001 | Read Stage 8 Implementation Plan | Acknowledged |
| ACK-002 | Read Stage 9 Builder Checklist | Acknowledged |
| ACK-003 | Read Stage 10 IAA Pre-Brief/Acknowledgements | Acknowledged |
| ACK-004 | Accepts W6-only scope and constraints | Acknowledged |
| ACK-005 | Accepts schema/RLS/audit evidence obligations | Acknowledged |
| ACK-006 | Accepts that implementation handover remains blocked until later gates | Acknowledged |

---

## 3. W6 Scope

Primary scope:

- define the ISMS backend/edge function boundary;
- record any explicit no-edge-function decisions;
- introduce minimum Supabase persistence schema required by W1-W5 surfaces;
- enable RLS on W6 tables;
- define user-scoped RLS policies;
- register persistence capabilities in a frontend boundary helper;
- add tests for registry behavior;
- document that runtime writes remain schema-registered only until hooks are explicitly authorized.

---

## 4. Explicitly Out of Scope

The builder must not implement:

- W7 deployment hardening;
- W8 cumulative regression/PBFAG rerun;
- live AI provider invocation;
- production prompt logging beyond schema/audit boundary;
- payment-provider webhooks;
- private MMM execution functions;
- production handover claims.

---

## 5. Required Evidence on Completion

Before W6 can be accepted, the builder must provide:

- changed-file scope evidence;
- backend/edge registry evidence;
- migration/schema evidence;
- RLS evidence;
- schema-to-hook or explicit no-hook evidence;
- audit-boundary evidence;
- build/lint/test or CI evidence;
- review conversation disposition;
- confirmation that W7-W8 remain unappointed and unimplemented.

---

## 6. Appointment Result

```text
BUILDER APPOINTMENT: APPROVED FOR W6 ONLY
RUNTIME EXECUTION: AUTHORIZED ONLY FOR BACKEND BOUNDARY, PERSISTENCE SCHEMA, RLS AND AUDIT BOUNDARY
IMPLEMENTATION HANDOVER: NOT AUTHORIZED
PRODUCTION READINESS: NOT AUTHORIZED
```
