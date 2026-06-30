# Builder Appointment — APW Specialist Red Tests + Stubs v0.1

**Artifact ID**: APW-RED-STUBS-BUILDER-APPOINTMENT-001  
**Version**: 0.1.0  
**Status**: ACTIVE FOR BATCH 5 ONLY  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 5 — APW Specialist Implementation: Red Tests + Stubs v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-29

---

## 1. Appointment

The builder is appointed only to create red tests and non-activating APW Specialist stubs.

This appointment does not authorise build-to-green, public routing, production activation, public APW behaviour changes or registry mutation.

---

## 2. Allowed Work

The builder may:

- create internal APW Specialist stub helpers;
- create executable pytest coverage for unsafe routing cases;
- create stub output validation helpers;
- prove the specialist is not invoked in this wave;
- preserve the existing public chat endpoint behaviour;
- maintain PR scope and IAA prebrief records.

---

## 3. Allowed Paths

The builder may modify or create files only under:

- `apps/mat-ai-gateway/services/apw_specialist_stubs.py`
- `apps/mat-ai-gateway/tests/test_apw_specialist_red_stubs.py`
- `.agent-admin/scope-declarations/`
- `.agent-admin/builder-appointments/`
- `.agent-admin/assurance/`
- `.agent-admin/control/delegation-order.json`

---

## 4. Forbidden Work

The builder must not:

- modify `apps/mat-ai-gateway/services/public_chat.py`;
- modify `apps/mat-ai-gateway/routers/ai_routes.py`;
- change `/api/v1/public-chat` behaviour;
- call OpenAI, Supabase or vector search from APW Specialist;
- create or mutate runtime registry records;
- create migrations, tables, policies or production data;
- expose APW Specialist directly to users;
- change `.github/agents` contracts;
- deploy preview or production behaviour;
- claim activation or build-to-green completion.

---

## 5. Required Evidence

The implementation PR must show:

1. tests for public context-envelope denial;
2. tests for registry denial;
3. tests for unsafe source metadata denial;
4. tests for private mandate denial;
5. tests proving otherwise valid requests still block until activation;
6. tests proving Batch 5 stubs never invoke APW Specialist;
7. tests for output validation;
8. no endpoint wiring or public behaviour change.

---

## 6. Handover Boundary

A later Build-to-Green wave must begin from the Batch 5 stubs and tests but must receive a new scope declaration, builder appointment, IAA prebrief and CS2 approval.
