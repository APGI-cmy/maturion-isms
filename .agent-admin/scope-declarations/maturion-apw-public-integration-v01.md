# Scope Declaration — Public APW Maturion Integration v0.1

**Scope ID**: APW-PUBLIC-INTEGRATION-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 7 — Public APW Maturion Integration v0.1  
**Date**: 2026-06-30  
**Authority**: CS2 — Johan Ras  
**Operating Role**: Foreman-led governed delivery  
**Task Type**: controlled integration wave — feature-flagged public APW route only  
**Affected Scope**: `apps/mat-ai-gateway` public chat routing and APW Specialist adapter  
**Implementation Status**: Feature-flagged integration; default off; no production activation

---

## 1. Purpose

This wave integrates the APW Specialist internal adapter into Maturion's public APW routing path behind a default-off control.

It answers:

```text
Can Maturion route valid public APW questions to the internal APW Specialist adapter when explicitly enabled, while preserving safe fallback and no production activation by default?
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
- `Maturion/prebuild/runtime-activation-readiness/MRAR-APW-Specialist-Implementation-FRS-v0.1.md`;
- `Maturion/prebuild/runtime-activation-readiness/MRAR-APW-Specialist-Implementation-TRS-v0.1.md`;
- Foreman operating model and PR scope discipline.

---

## 3. Planned In Scope

This wave may update:

1. `apps/mat-ai-gateway/services/public_chat.py`
2. `apps/mat-ai-gateway/services/apw_specialist_stubs.py`
3. `apps/mat-ai-gateway/tests/test_public_chat.py`
4. `apps/mat-ai-gateway/tests/test_apw_specialist_red_stubs.py`
5. `.agent-admin/builder-appointments/apw-public-integration-builder-appointment-v0.1.md`
6. `.agent-admin/control/delegation-orders/pr-1887.json`
7. PR-bound scope declaration after PR number assignment;
8. IAA prebrief after PR number assignment;
9. this wave scope declaration.

This wave uses PR-scoped delegation evidence. It does not change the legacy singleton `.agent-admin/control/delegation-order.json`.

---

## 4. Integration Boundary

Batch 7 may:

- add a default-off APW Specialist integration flag;
- classify public APW questions inside Maturion public chat;
- call the internal APW Specialist adapter only when the flag is enabled;
- preserve existing public chat behaviour when the flag is disabled;
- preserve Maturion final response authority;
- add tests for flag-off, flag-on, and unsafe request behaviour;
- provide PR-scoped delegation evidence required by the gate.

---

## 5. Out of Scope

This wave does not:

- activate APW Specialist in production by default;
- expose APW Specialist directly to users;
- let APW Specialist produce final public answers;
- call OpenAI, Supabase, vector search or external services from APW Specialist;
- create or mutate production runtime registry records;
- create Supabase tables, policies, functions, migrations or data;
- create embeddings or retrieval services;
- change `.github/agents` contracts;
- grant Maturion or APW Specialist CS2 authority;
- perform Batch 8 controlled preview activation.

---

## 6. Success Criteria

This wave succeeds when:

1. public chat behaviour is unchanged when the APW integration flag is off;
2. valid public APW questions use internal APW draft support when the flag is on;
3. Maturion synthesises final output;
4. unsafe/private/tenant requests remain blocked or safely degraded;
5. no external calls or registry mutation are introduced;
6. tests cover default-off, enabled, and blocked routes;
7. PR-bound scope, PR-scoped delegation evidence and IAA prebrief are present.

---

## 7. Follow-On Work

The next wave may be Batch 8 — Controlled Preview Activation only after CS2 approves this integration PR and opens a separate activation scope.
