# Scope Declaration — APW Specialist Build-to-Green v0.1

**Scope ID**: APW-SPEC-BUILD-GREEN-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 6 — APW Specialist Build-to-Green v0.1  
**Date**: 2026-06-30  
**Authority**: CS2 — Johan Ras  
**Operating Role**: Foreman-led governed delivery  
**Task Type**: controlled implementation wave — internal build-to-green only  
**Affected Scope**: `apps/mat-ai-gateway` internal APW Specialist routing support  
**Implementation Status**: Internal adapter only; no public routing; no activation

---

## 1. Purpose

This wave builds from the Batch 5 red tests and stubs into an internal APW Specialist build-to-green path.

It answers:

```text
Can valid public APW requests pass the internal APW Specialist adapter while unsafe cases remain blocked and public activation remains separate?
```

---

## 2. Source Authority

This scope is governed by:

- Batch 1 Runtime Agent Network prebuild;
- Batch 2 Runtime Knowledge Grounding prebuild;
- Batch 3 APW Specialist prebuild;
- Batch 4 Runtime Activation Readiness Pack;
- Batch 5 APW Specialist Red Tests + Stubs;
- `Maturion/prebuild/runtime-activation-readiness/MRAR-APW-Specialist-Implementation-FRS-v0.1.md`;
- `Maturion/prebuild/runtime-activation-readiness/MRAR-APW-Specialist-Implementation-TRS-v0.1.md`;
- `Maturion/prebuild/runtime-activation-readiness/MRAR-QA-to-Red-Implementation-Test-Plan-v0.1.md`;
- Foreman operating model and PR scope discipline.

---

## 3. Planned In Scope

This wave is intended to update:

1. `apps/mat-ai-gateway/services/apw_specialist_stubs.py`
2. `apps/mat-ai-gateway/tests/test_apw_specialist_red_stubs.py`
3. `.agent-admin/builder-appointments/apw-specialist-build-to-green-builder-appointment-v0.1.md`
4. PR-bound scope declaration after PR number assignment;
5. IAA prebrief after PR number assignment;
6. `.agent-admin/control/delegation-order.json` proof after implementation commits exist;
7. this wave scope declaration.

---

## 4. Build-to-Green Boundary

Batch 6 may:

- convert valid internal APW Specialist adapter cases from blocked to eligible;
- produce deterministic internal draft outputs for valid public APW questions;
- validate draft outputs before handoff to Maturion;
- preserve denial coverage for invalid context, registry, source metadata and private mandate requests;
- preserve no public chat wiring;
- preserve no production activation.

---

## 5. Out of Scope

This wave does not:

- wire APW Specialist into `/api/v1/public-chat`;
- change public APW behaviour;
- create live model calls for APW Specialist;
- call OpenAI, Supabase, vector search or external services from APW Specialist;
- create or mutate production runtime registry records;
- create Supabase tables, policies, functions, migrations or data;
- create embeddings or retrieval services;
- expose APW Specialist directly to users;
- change `.github/agents` contracts;
- grant Maturion or APW Specialist CS2 authority;
- deploy anything to preview or production as an activation step.

---

## 6. Success Criteria

This wave succeeds when:

1. valid internal public APW cases pass through a build-to-green adapter;
2. unsafe cases remain blocked;
3. draft output remains non-final and subject to Maturion synthesis;
4. no public chat endpoint wiring is introduced;
5. no activation state is introduced;
6. tests cover both green and blocked cases;
7. PR-bound scope, delegation-order and IAA prebrief are present.

---

## 7. Follow-On Work

The next wave may be APW Specialist Public APW Integration only after CS2 approves Batch 6 and opens a separate integration scope.
