# Scope Declaration — Maturion Runtime Knowledge Grounding Prebuild v0.1

**Scope ID**: MRKG-PREBUILD-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Maturion Runtime Knowledge Grounding Prebuild v0.1  
**Date**: 2026-06-26  
**Authority**: CS2 — Johan Ras  
**Operating Role**: Foreman-led governed delivery  
**Task Type**: Prebuild architecture artifacts only  
**Affected Scope**: Cross-module Maturion / AIMC knowledge grounding  
**Implementation Status**: No implementation in this wave

---

## 1. Purpose

This wave creates Batch 2 prebuild artifacts for Maturion runtime knowledge grounding.

It defines how Maturion and runtime specialists may use Supabase/AIMC knowledge safely, including public/private/tenant filters, source hierarchy, metadata expectations, safe fallback behaviour, and failure-first QA expectations.

This batch answers:

```text
What knowledge can Maturion use, from where, under what authority, and with what safety filters?
```

---

## 2. Source Authority

This scope is governed by:

- `FOREMAN_OPERATING_MODEL.md`;
- `.github/agents/foreman-v2-agent.md`;
- `governance/canon/MATURION_AGENT_NETWORK_ORGANIGRAM.md`;
- `Maturion/prebuild/runtime-agent-network/MRAN-FRS-v0.1.md`;
- `Maturion/prebuild/runtime-agent-network/MRAN-TRS-context-envelope-runtime-registry-v0.1.md`;
- `Maturion/prebuild/runtime-agent-network/MRAN-QA-to-Red-v0.1.md`;
- `Maturion/strategy/Maturion_agent_network_organigram_strategy.md`.

---

## 3. In Scope

This wave creates:

1. `Maturion/prebuild/runtime-knowledge-grounding/MRKG-FRS-addendum-v0.1.md`
2. `Maturion/prebuild/runtime-knowledge-grounding/MRKG-TRS-supabase-aimc-metadata-v0.1.md`
3. `Maturion/prebuild/runtime-knowledge-grounding/MRKG-QA-to-Red-v0.1.md`
4. `.agent-admin/assurance/iaa-wave-record-mrkg-prebuild-v01-20260626.md`
5. this wave scope declaration.

The artifacts define:

- knowledge-plane behaviour;
- Supabase/AIMC metadata requirements;
- public/private/tenant filtering;
- source hierarchy and trust order;
- missing metadata behaviour;
- fallback/degraded modes;
- QA-to-Red tests for public-safe retrieval, tenant isolation, missing metadata and fallback behaviour;
- IAA pre-brief for independent review.

---

## 4. Out of Scope

This wave does not:

- create runtime code;
- alter application behaviour;
- create or mutate Supabase tables;
- run migrations;
- create embeddings;
- upload or reclassify knowledge documents;
- create or activate runtime specialists;
- create APW specialist;
- create retrieval services;
- alter tenant isolation;
- write or read production tenant data;
- change `.github/agents` files;
- grant Maturion CS2 authority.

---

## 5. Foreman Boundary

Foreman may create and organise these prebuild artifacts. Foreman may not implement runtime, Supabase, retrieval, migration, registry, or product behaviour.

Builder appointment is not part of this wave.

---

## 6. Success Criteria

This wave succeeds when:

1. the scope declaration exists;
2. FRS addendum defines knowledge-plane and retrieval behaviour;
3. TRS addendum defines Supabase/AIMC metadata, filters and source hierarchy;
4. QA-to-Red defines failure-first expectations for public-safe retrieval, tenant isolation, missing metadata and fallback behaviour;
5. IAA pre-brief is recorded in canonical form;
6. no implementation files are changed;
7. no Supabase mutation occurs;
8. no runtime specialist is activated;
9. no Maturion-as-CS2 authority is granted.

---

## 7. Known Follow-On Waves

This wave intentionally leaves the following to later batches:

1. Batch 3 — APW Specialist Prebuild.
2. Implementation waves for metadata enforcement, retrieval services, registry integration, audit trace storage, and public Maturion behaviour.
3. Supabase schema or migration work only after the relevant prebuild artifacts, QA-to-red, IAA pre-brief, builder appointment, QP, ECAP, IAA final, and CS2 review are satisfied.
