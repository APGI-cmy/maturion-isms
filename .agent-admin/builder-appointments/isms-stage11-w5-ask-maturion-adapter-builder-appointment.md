# ISMS Stage 11 — Builder Appointment: W5 Ask Maturion Adapter

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact | Builder Appointment |
| Stage | Stage 11 |
| Wave | W5 — Ask Maturion Adapter |
| Appointment ID | `isms-stage11-w5-ask-maturion-adapter-20260610` |
| Status | APPOINTED FOR W5 ONLY |
| Foreman | foreman-agent |
| Builder Role | implementation-builder-w5-ask-maturion-adapter |

---

## 1. Appointment Decision

The Foreman appoints the W5 implementation builder for the ISMS Ask Maturion adapter and prompt seed wiring.

This appointment is limited to W5 only.

```text
W5 — Ask Maturion Adapter
```

This appointment does not authorize W6-W8, live AI provider calls, backend persistence, RLS, audit writer, deployment hardening, cumulative regression/PBFAG rerun, production auth/payment changes, or implementation handover.

---

## 2. Builder Acknowledgement

The appointed builder acknowledges:

| ID | Required acknowledgement | Status |
|---|---|---|
| ACK-001 | Read Stage 8 Implementation Plan | Acknowledged |
| ACK-002 | Read Stage 9 Builder Checklist | Acknowledged |
| ACK-003 | Read Stage 10 IAA Pre-Brief/Acknowledgements | Acknowledged |
| ACK-004 | Accepts W5-only scope and constraints | Acknowledged |
| ACK-005 | Accepts build/lint/test/CI evidence obligations | Acknowledged |
| ACK-006 | Accepts that implementation handover remains blocked until later gates | Acknowledged |

---

## 3. W5 Scope

Primary scope:

- implement safe Ask Maturion adapter contract;
- implement public educational prompt seeds;
- implement authenticated prompt seeds with filtered context;
- ensure Ask Maturion respects entitlement checks and route guards;
- provide non-blocking fallback behavior because live AI provider calls remain out of scope;
- wire Ask Maturion into relevant public/private surfaces;
- add unit tests for public/private adapter behavior.

---

## 4. Explicitly Out of Scope

The builder must not implement:

- live AI provider calls;
- Supabase persistence, RLS, edge/backend functions or audit writer;
- production prompt logging;
- W6 backend boundary or schema work;
- W7 deployment hardening;
- W8 cumulative regression/PBFAG rerun;
- production handover claims.

---

## 5. Required Evidence on Completion

Before W5 can be accepted, the builder must provide:

- changed-file scope evidence;
- adapter contract evidence;
- public/private prompt seed evidence;
- entitlement and route-guard respect evidence;
- fallback behavior evidence;
- build/lint/test or CI evidence;
- review conversation disposition;
- confirmation that W6-W8 remain unappointed and unimplemented.

---

## 6. Appointment Result

```text
BUILDER APPOINTMENT: APPROVED FOR W5 ONLY
RUNTIME EXECUTION: AUTHORIZED ONLY FOR SAFE ASK MATURION ADAPTER AND PROMPT SEED WIRING
IMPLEMENTATION HANDOVER: NOT AUTHORIZED
PRODUCTION READINESS: NOT AUTHORIZED
```
