# Builder Appointment — APW Specialist Build-to-Green v0.1

**Artifact ID**: APW-BUILD-GREEN-BUILDER-APPOINTMENT-001  
**Version**: 0.1.0  
**Status**: ACTIVE FOR BATCH 6 ONLY  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 6 — APW Specialist Build-to-Green v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-30

---

## 1. Appointment

The builder is appointed only to turn the internal APW Specialist adapter from red/stub state into build-to-green state.

This appointment does not authorise public routing, production activation, public APW behaviour changes or registry mutation.

---

## 2. Allowed Work

The builder may:

- update internal APW Specialist adapter logic;
- add deterministic draft output support for valid public APW cases;
- update tests so valid internal cases pass;
- preserve blocked-case coverage from Batch 5;
- prove draft output remains non-final and behind Maturion;
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
- deploy preview or production behaviour as activation;
- claim public integration completion.

---

## 5. Required Evidence

The implementation PR must show:

1. valid internal public APW route passes;
2. deterministic draft output is produced;
3. draft output validates but remains non-final;
4. blocked context cases remain blocked;
5. blocked registry cases remain blocked;
6. blocked source metadata cases remain blocked;
7. private mandate cases remain blocked;
8. public chat endpoint remains unchanged.

---

## 6. Handover Boundary

A later public APW integration wave must begin from Batch 6 output but must receive a new scope declaration, builder appointment, IAA prebrief and CS2 approval.
