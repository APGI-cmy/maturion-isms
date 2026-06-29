# Scope Declaration — APW Specialist Red Tests + Stubs v0.1

**Scope ID**: APW-SPEC-RED-STUBS-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 5 — APW Specialist Implementation: Red Tests + Stubs v0.1  
**Date**: 2026-06-29  
**Authority**: CS2 — Johan Ras  
**Operating Role**: Foreman-led governed delivery  
**Task Type**: controlled implementation wave — red tests and non-activating stubs only  
**Affected Scope**: `apps/mat-ai-gateway` internal APW Specialist routing support  
**Implementation Status**: Stub-only implementation; no public routing; no activation

---

## 1. Purpose

This wave creates the first executable APW Specialist implementation footing by adding red tests and safe internal stubs.

It answers:

```text
Can the system prove unsafe APW Specialist routes are blocked before any later build-to-green work?
```

---

## 2. Source Authority

This scope is governed by:

- Batch 1 Runtime Agent Network prebuild;
- Batch 2 Runtime Knowledge Grounding prebuild;
- Batch 3 APW Specialist prebuild;
- Batch 4 Runtime Activation Readiness Pack;
- `Maturion/prebuild/runtime-activation-readiness/MRAR-QA-to-Red-Implementation-Test-Plan-v0.1.md`;
- `Maturion/prebuild/runtime-activation-readiness/MRAR-APW-Specialist-Implementation-FRS-v0.1.md`;
- `Maturion/prebuild/runtime-activation-readiness/MRAR-APW-Specialist-Implementation-TRS-v0.1.md`;
- Foreman operating model and PR scope discipline.

---

## 3. In Scope

This wave creates:

1. `apps/mat-ai-gateway/services/apw_specialist_stubs.py`
2. `apps/mat-ai-gateway/tests/test_apw_specialist_red_stubs.py`
3. `.agent-admin/builder-appointments/apw-specialist-red-tests-stubs-builder-appointment-v0.1.md`
4. `.agent-admin/scope-declarations/pr-1866.md`
5. `.agent-admin/assurance/iaa-wave-record-apw-specialist-red-tests-stubs-v01-20260629.md`
6. this wave scope declaration.

---

## 4. Required Red Coverage

The executable test suite must cover:

- non-APW context blocked;
- tenant context blocked in public mode;
- missing registry record blocked;
- non-active registry record blocked;
- unsafe source metadata blocked;
- missing source metadata blocked;
- private/tenant/internal request blocked;
- otherwise valid route blocked until a later activation wave;
- stub never invokes specialist even with activation flag;
- unsafe specialist output blocked;
- output without source limitation blocked;
- valid draft remains non-final and behind Maturion.

---

## 5. Out of Scope

This wave does not:

- wire APW Specialist into `/api/v1/public-chat`;
- change APW public behaviour;
- create live specialist invocation;
- call OpenAI, Supabase, vector search or external services from APW Specialist;
- create or mutate runtime registry records;
- create Supabase tables, policies, functions, migrations or data;
- create embeddings or retrieval services;
- expose APW Specialist directly to users;
- change `.github/agents` contracts;
- grant Maturion or APW Specialist CS2 authority;
- deploy anything to preview or production.

---

## 6. Success Criteria

This wave succeeds when:

1. internal APW Specialist stubs exist;
2. executable tests prove unsafe routes fail closed;
3. tests prove APW Specialist is not invoked in Batch 5;
4. tests prove draft output remains non-final;
5. public chat endpoint remains unchanged;
6. no production activation is introduced;
7. PR-bound scope and IAA prebrief are present.

---

## 7. Follow-On Work

The next wave may be APW Specialist Build-to-Green only after CS2 approves the Batch 5 red tests/stubs PR and opens a separate build-to-green scope.
