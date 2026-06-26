# Scope Declaration — APW Specialist Prebuild v0.1

**Scope ID**: APW-SPEC-PREBUILD-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: First Specialist Prebuild — APW Specialist v0.1  
**Date**: 2026-06-26  
**Authority**: CS2 — Johan Ras  
**Operating Role**: Foreman-led governed delivery  
**Task Type**: Specialist prebuild contract and implementation-prep artifacts only  
**Affected Scope**: Runtime Maturion / APW public specialist behaviour  
**Implementation Status**: No implementation and no activation in this wave

---

## 1. Purpose

This wave defines the first runtime specialist candidate for Maturion: APW Specialist.

It answers:

```text
What does APW-specialist do, what may it not know, and how does public Maturion use it safely?
```

The wave creates a prebuild scope/contract, functional and technical addenda for public APW Maturion behaviour, QA-to-Red expectations for specialist routing, a later-builder appointment package, and IAA pre-brief evidence.

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
- `Maturion/prebuild/runtime-knowledge-grounding/MRKG-QA-to-Red-v0.1.md`.

---

## 3. In Scope

This wave creates:

1. `Maturion/prebuild/apw-specialist/APW-Specialist-Scope-Contract-v0.1.md`
2. `Maturion/prebuild/apw-specialist/APW-Maturion-FRS-TRS-addendum-v0.1.md`
3. `Maturion/prebuild/apw-specialist/APW-QA-to-Red-specialist-routing-v0.1.md`
4. `.agent-admin/builder-appointments/apw-specialist-implementation-wave-builder-appointment-v0.1.md`
5. `.agent-admin/assurance/iaa-wave-record-apw-specialist-prebuild-v01-20260626.md`
6. this wave scope declaration.

The artifacts define:

- APW Specialist mandate and prohibited knowledge;
- public APW Maturion invocation behaviour;
- context-envelope preconditions;
- runtime registry preconditions;
- public-safe knowledge rules;
- fallback and degraded behaviour;
- QA-to-Red cases for public specialist routing;
- a non-active builder appointment package for a later implementation wave.

---

## 4. Out of Scope

This wave does not:

- create runtime code;
- alter APW public app behaviour;
- create a runtime registry record;
- mark APW Specialist as ACTIVE;
- create or modify `.github/agents` files;
- modify build/governance agent contracts;
- create retrieval services;
- query or mutate Supabase;
- create embeddings;
- alter public website content;
- alter tenant isolation;
- read or write production tenant data;
- implement public chat;
- grant Maturion CS2 authority;
- appoint a builder to start implementation now.

---

## 5. Specialist Lifecycle Boundary

APW Specialist may be described only as a candidate runtime app specialist.

Its maximum lifecycle state after this wave is:

```text
STUB_CONTRACTED / PREBUILD_DEFINED
```

It must not be treated as:

- runtime registered;
- active;
- invokable in production;
- a `.github/agents` build/governance agent;
- a source of CS2 authority;
- a direct retriever of tenant, internal or secret knowledge.

---

## 6. Success Criteria

This wave succeeds when:

1. APW Specialist scope/contract exists;
2. public APW Maturion FRS/TRS addendum exists;
3. QA-to-Red covers unsafe public routing and specialist knowledge leakage;
4. later-builder appointment package exists but does not start implementation;
5. IAA pre-brief is recorded in gate-readable format;
6. no implementation files are changed;
7. no runtime specialist is activated;
8. no runtime registry is created or mutated;
9. no Supabase mutation occurs;
10. no Maturion-as-CS2 authority is granted.

---

## 7. Follow-On Work

Future implementation remains blocked until separate implementation-wave governance is complete, including current-head bound builder appointment, QP package, ECAP review, IAA assurance, QA-to-Red evidence, and CS2 merge/release decision.
