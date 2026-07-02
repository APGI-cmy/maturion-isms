# Builder Appointment — Public APW Maturion Integration v0.1

**Artifact ID**: APW-PUBLIC-INTEGRATION-BUILDER-APPOINTMENT-001  
**Version**: 0.1.0  
**Status**: ACTIVE FOR BATCH 7 ONLY  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 7 — Public APW Maturion Integration v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-07-01

---

## 1. Appointment

The builder is appointed only to integrate the existing APW Specialist internal adapter into Maturion public chat behind a default-off control.

---

## 2. Allowed Work

The builder may:

- add a default-off integration flag;
- add public APW route classification inside public chat;
- call the internal APW Specialist adapter only when explicitly enabled;
- keep Maturion responsible for final synthesis;
- add tests for flag-off, flag-on and blocked routes;
- preserve the existing public chat behaviour when disabled;
- provide PR-scoped delegation evidence required by the gate.

---

## 3. Allowed Paths

The builder may modify or create files only under:

- `apps/mat-ai-gateway/services/public_chat.py`
- `apps/mat-ai-gateway/services/apw_specialist_stubs.py`
- `apps/mat-ai-gateway/tests/test_public_chat.py`
- `apps/mat-ai-gateway/tests/test_apw_specialist_red_stubs.py`
- `.agent-admin/scope-declarations/`
- `.agent-admin/builder-appointments/`
- `.agent-admin/assurance/`
- `.agent-admin/control/delegation-orders/pr-1887.json`

---

## 4. Required Evidence

The implementation PR must show:

1. default-off public chat behaviour is unchanged;
2. enabled valid APW route uses internal draft support;
3. Maturion final response authority is preserved;
4. unsafe/private APW requests remain blocked or safely degraded;
5. no external service calls are introduced by APW Specialist;
6. no production activation is introduced;
7. PR-scoped delegation evidence is present.

---

## 5. Handover Boundary

A later Batch 8 preview activation wave must receive a new scope declaration, builder appointment, IAA prebrief and CS2 approval.
