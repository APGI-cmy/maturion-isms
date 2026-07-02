# Builder Appointment — APW Specialist Preview v0.1

**Artifact ID**: APW-PREVIEW-BUILDER-APPOINTMENT-001  
**Version**: 0.1.0  
**Status**: ACTIVE FOR BATCH 8 ONLY  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 8 — APW Specialist Controlled Preview v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-07-02

---

## 1. Appointment

The builder is appointed only to add controlled preview runbook and test evidence for the existing Batch 7 APW public integration.

---

## 2. Allowed Work

The builder may:

- add preview enablement steps for the existing feature flag;
- add rollback steps for the same flag;
- add tests for preview-on and rollback-off behaviour;
- add tests proving restricted prompts avoid the APW route;
- preserve Maturion final response authority;
- provide PR-scoped delegation evidence required by the gate.

---

## 3. Allowed Paths

The builder may modify or create files only under:

- `Maturion/prebuild/runtime-activation-readiness/APW-Controlled-Preview-Runbook-v0.1.md`
- `apps/mat-ai-gateway/tests/test_apw_preview.py`
- `.agent-admin/scope-declarations/`
- `.agent-admin/builder-appointments/`
- `.agent-admin/assurance/`
- `.agent-admin/control/delegation-orders/pr-1895.json`

---

## 4. Required Evidence

The PR must show:

1. preview-on behaviour is covered;
2. rollback-off behaviour is covered;
3. restricted prompt routing is covered;
4. production default remains off;
5. Maturion remains final response authority;
6. PR-scoped delegation evidence is present.

---

## 5. Handover Boundary

A later production decision wave must receive a new scope declaration, builder appointment, IAA prebrief and CS2 approval.
