# Scope Declaration — Maturion Runtime Agent Network Prebuild v0.1

**Scope ID**: MRAN-PREBUILD-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Maturion Runtime Agent Network Architecture Prebuild v0.1  
**Date**: 2026-06-25  
**Authority**: CS2 — Johan Ras  
**Operating Role**: Foreman-led governed delivery  
**Task Type**: Prebuild architecture artifacts only  
**Affected Scope**: Cross-module Maturion / AIMC runtime architecture  
**Implementation Status**: No implementation in this wave

---

## 1. Purpose

This wave creates the first architecture prebuild artifact set for the runtime Maturion agent network.

The purpose is to define the system shape before any builder writes runtime code, modifies Supabase, creates runtime registries, activates specialists, changes `.github/agents`, or grants Maturion additional authority.

This batch answers:

```text
What exactly is the system we are about to build, and what must never happen?
```

---

## 2. Source Authority

This scope is governed by:

- `FOREMAN_OPERATING_MODEL.md`;
- `.github/agents/foreman-v2-agent.md`;
- `governance/canon/MATURION_AGENT_NETWORK_ORGANIGRAM.md`;
- `Maturion/strategy/Maturion_agent_network_organigram_strategy.md`;
- existing Maturion/AIMC strategy and specialist-registry materials.

---

## 3. In Scope

This wave creates the following prebuild artifacts:

1. `Maturion/prebuild/runtime-agent-network/MRAN-FRS-v0.1.md`
2. `Maturion/prebuild/runtime-agent-network/MRAN-TRS-context-envelope-runtime-registry-v0.1.md`
3. `Maturion/prebuild/runtime-agent-network/MRAN-QA-to-Red-v0.1.md`
4. `.agent-admin/assurance/iaa-wave-record-mran-prebuild-v01-20260625.md`
5. this scope declaration.

The artifacts define:

- runtime agent-network purpose and boundaries;
- Maturion's runtime orchestration responsibilities;
- context-envelope requirements;
- runtime registry architecture requirements;
- specialist lifecycle states;
- activation prohibitions;
- QA-to-red validation expectations;
- IAA pre-brief questions for independent assurance.

---

## 4. Out of Scope

This wave does not:

- create runtime code;
- alter application behaviour;
- create or mutate Supabase tables;
- create or activate runtime specialists;
- create APW specialist;
- create ISMS specialist;
- change `.github/agents` files;
- modify build/governance agent contracts;
- implement gateway routing;
- implement retrieval;
- implement memory writes;
- alter tenant isolation;
- grant Maturion CS2 authority;
- update App Management Centre implementation.

---

## 5. Foreman Boundary

Foreman may create and organise these prebuild artifacts. Foreman may not implement product/runtime artifacts.

Builder appointment is not part of this wave. If Batch 1 is accepted, the next governed wave may create Batch 2 knowledge-grounding prebuild artifacts. Builder implementation remains blocked until the relevant prebuild range and QA-to-red are accepted.

---

## 6. Success Criteria

This wave succeeds when:

1. the scope declaration exists;
2. FRS defines the runtime agent-network behaviour and prohibitions;
3. TRS defines context-envelope and runtime-registry architecture;
4. QA-to-red defines failure-first expectations for registry/context-envelope behaviour;
5. IAA pre-brief is recorded for independent review;
6. no implementation files are changed;
7. no runtime specialist is activated;
8. no Maturion-as-CS2 authority is granted.

---

## 7. Known Follow-On Waves

This wave intentionally leaves the following to later batches:

1. Batch 2 — Knowledge Grounding Prebuild: Supabase/AIMC metadata, source hierarchy, public/private/tenant filters.
2. Batch 3 — APW Specialist Prebuild: public APW specialist scope, public-safe Maturion behaviour, APW routing and fallback rules.
3. Later implementation waves — only after prebuild artifacts, QA-to-red, IAA pre-brief, builder appointment, QP, ECAP, IAA final, and CS2 review are satisfied.
