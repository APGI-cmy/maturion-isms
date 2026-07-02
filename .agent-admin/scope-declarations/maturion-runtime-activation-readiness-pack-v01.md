# Scope Declaration — Runtime Activation Readiness Pack v0.1

**Scope ID**: MRAR-PREBUILD-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 4 — Runtime Activation Readiness Pack v0.1  
**Date**: 2026-06-29  
**Authority**: CS2 — Johan Ras  
**Operating Role**: Foreman-led governed delivery  
**Task Type**: readiness consolidation and implementation-prep artifacts only  
**Affected Scope**: Runtime Maturion / APW Specialist activation readiness  
**Implementation Status**: No implementation, no activation, no production routing

---

## 1. Purpose

This wave consolidates Batches 1–3 into a controlled readiness pack before any APW Specialist implementation or activation starts.

It answers:

```text
What exactly must be true before APW-specialist can be built, registered, tested, and safely activated?
```

---

## 2. Source Authority

This scope is governed by:

- `FOREMAN_OPERATING_MODEL.md`;
- `.github/agents/foreman-v2-agent.md`;
- `governance/canon/MATURION_AGENT_NETWORK_ORGANIGRAM.md`;
- `Maturion/strategy/Maturion_agent_network_organigram_strategy.md`;
- `Maturion/prebuild/runtime-agent-network/MRAN-FRS-v0.1.md`;
- `Maturion/prebuild/runtime-agent-network/MRAN-TRS-context-envelope-runtime-registry-v0.1.md`;
- `Maturion/prebuild/runtime-knowledge-grounding/MRKG-FRS-addendum-v0.1.md`;
- `Maturion/prebuild/runtime-knowledge-grounding/MRKG-TRS-supabase-aimc-metadata-v0.1.md`;
- `Maturion/prebuild/runtime-knowledge-grounding/MRKG-QA-to-Red-v0.1.md`;
- `Maturion/prebuild/apw-specialist/APW-Specialist-Scope-Contract-v0.1.md`;
- `Maturion/prebuild/apw-specialist/APW-Maturion-FRS-TRS-addendum-v0.1.md`;
- `Maturion/prebuild/apw-specialist/APW-QA-to-Red-specialist-routing-v0.1.md`;
- `.agent-admin/builder-appointments/apw-specialist-implementation-wave-builder-appointment-v0.1.md`.

---

## 3. In Scope

This wave creates:

1. `Maturion/prebuild/runtime-activation-readiness/MRAR-Readiness-Matrix-v0.1.md`
2. `Maturion/prebuild/runtime-activation-readiness/MRAR-APW-Specialist-Implementation-FRS-v0.1.md`
3. `Maturion/prebuild/runtime-activation-readiness/MRAR-APW-Specialist-Implementation-TRS-v0.1.md`
4. `Maturion/prebuild/runtime-activation-readiness/MRAR-QA-to-Red-Implementation-Test-Plan-v0.1.md`
5. `.agent-admin/builder-appointments/apw-specialist-implementation-wave-active-builder-appointment-v0.1.md`
6. `.agent-admin/assurance/iaa-wave-record-runtime-activation-readiness-v01-20260629.md`
7. this wave scope declaration.

---

## 4. Out of Scope

This wave does not:

- create runtime code;
- activate APW Specialist;
- create or mutate runtime registry records;
- create Supabase tables, policies, functions, migrations or data;
- create embeddings or retrieval services;
- change APW public app behaviour;
- implement public chat;
- change `.github/agents` contracts;
- grant Maturion or APW Specialist CS2 authority;
- appoint a builder to start coding immediately;
- deploy anything to preview or production.

---

## 5. Success Criteria

This wave succeeds when:

1. Batches 1–3 are mapped into readiness conditions;
2. implementation FRS and TRS are defined without code;
3. red-first test expectations are defined;
4. builder appointment conditions are explicit but not yet executed;
5. activation prerequisites are listed and gated;
6. IAA pre-brief exists in gate-readable format;
7. no runtime behaviour changes are introduced.

---

## 6. Follow-On Work

The next wave may be APW Specialist Implementation — Red Tests + Stubs only after CS2 approves the readiness pack and a separate implementation PR scope is opened.
