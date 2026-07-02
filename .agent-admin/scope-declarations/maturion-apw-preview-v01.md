# Scope Declaration — APW Specialist Controlled Preview v0.1

**Scope ID**: APW-PREVIEW-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 8 — APW Specialist Controlled Preview v0.1  
**Date**: 2026-07-02  
**Authority**: CS2 — Johan Ras  
**Operating Role**: Foreman-led governed delivery  
**Task Type**: controlled preview wave — preview enablement evidence only  
**Affected Scope**: APW Specialist preview controls and operational evidence  
**Implementation Status**: Preview-only; production default remains off

---

## 1. Purpose

This wave prepares controlled preview use of the APW Specialist public integration delivered in Batch 7.

It answers:

```text
Can APW Specialist public integration be previewed under controlled conditions, with rollback and evidence, without making it a general production activation?
```

---

## 2. Source Authority

This scope is governed by:

- Batch 1 Runtime Agent Network prebuild;
- Batch 2 Runtime Knowledge Grounding prebuild;
- Batch 3 APW Specialist prebuild;
- Batch 4 Runtime Activation Readiness Pack;
- Batch 5 APW Specialist Red Tests + Stubs;
- Batch 6 APW Specialist Build-to-Green;
- Batch 7 Public APW Maturion Integration;
- Foreman operating model and PR scope discipline.

---

## 3. Planned In Scope

This wave may create or update:

1. `Maturion/prebuild/runtime-activation-readiness/APW-Controlled-Preview-Activation-Runbook-v0.1.md`
2. `apps/mat-ai-gateway/tests/test_apw_preview_activation.py`
3. `.agent-admin/builder-appointments/apw-preview-builder-appointment-v0.1.md`
4. `.agent-admin/control/delegation-orders/pr-<PR>.json`
5. PR-bound scope declaration after PR number assignment;
6. IAA prebrief after PR number assignment;
7. this wave scope declaration.

---

## 4. Preview Boundary

Batch 8 may:

- document how to enable `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true` only in preview or staging;
- document rollback by setting the flag back to false or removing it;
- add tests that prove preview-enabled behaviour and rollback-disabled behaviour;
- capture required preview evidence and acceptance criteria;
- keep Maturion final response authority intact.

---

## 5. Out of Scope

This wave does not:

- enable production by default;
- change production environment variables;
- expose APW Specialist directly to users;
- let APW Specialist produce final public answers;
- create live model calls for APW Specialist;
- call Supabase or vector search from APW Specialist;
- create or mutate production runtime registry records;
- create Supabase tables, policies, functions, migrations or data;
- create embeddings or retrieval services;
- change `.github/agents` contracts;
- grant Maturion or APW Specialist CS2 authority;
- perform Batch 9 production activation.

---

## 6. Success Criteria

This wave succeeds when:

1. controlled preview enablement steps are documented;
2. rollback steps are documented;
3. tests prove preview-on and rollback-off behaviour;
4. private or unsafe prompts remain outside the APW Specialist route;
5. Maturion remains final public response authority;
6. no production activation is introduced;
7. PR-bound scope, PR-scoped delegation evidence and IAA prebrief are present.

---

## 7. Follow-On Work

The next wave may be Batch 9 — Production Activation Decision only after CS2 reviews preview evidence and approves a separate production decision scope.
