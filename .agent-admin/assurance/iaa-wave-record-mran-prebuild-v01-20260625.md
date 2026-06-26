# IAA Wave Record — MRAN Prebuild v0.1

**Wave ID**: MRAN-PREBUILD-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Date**: 2026-06-25  
**Scope Declaration**: `.agent-admin/scope-declarations/maturion-runtime-agent-network-prebuild-v01.md`  
**Related Artifacts**:

- `Maturion/prebuild/runtime-agent-network/MRAN-FRS-v0.1.md`
- `Maturion/prebuild/runtime-agent-network/MRAN-TRS-context-envelope-runtime-registry-v0.1.md`
- `Maturion/prebuild/runtime-agent-network/MRAN-QA-to-Red-v0.1.md`

---

## PRE-BRIEF

### 1. Assurance Context

This pre-brief asks IAA to review Batch 1 architecture prebuild artifacts for the Maturion runtime agent network.

The work is prebuild-only. It defines the runtime agent-network shape, context-envelope expectations, runtime registry architecture and QA-to-red expectations before any runtime implementation begins.

### 2. Source Authority

IAA should review against:

- `FOREMAN_OPERATING_MODEL.md`;
- `.github/agents/foreman-v2-agent.md`;
- `governance/canon/MATURION_AGENT_NETWORK_ORGANIGRAM.md`;
- `Maturion/strategy/Maturion_agent_network_organigram_strategy.md`;
- existing Maturion/AIMC strategy and specialist-registry materials.

### 3. Review Questions

IAA should determine whether the Batch 1 artifacts:

1. preserve the separation between builder/governance agents and runtime/onboard app agents;
2. keep Maturion as the single user-facing runtime interface;
3. prevent runtime specialists from being treated as active merely because they are named in strategy, canon, docs or `.github/agents`;
4. define sufficient context-envelope requirements before routing;
5. define sufficient runtime registry requirements before specialist invocation;
6. define safe degradation when context, registry, permission, authority or knowledge-plane requirements are missing;
7. prevent public/unauthenticated contexts from accessing tenant/customer knowledge;
8. prevent Maturion-as-CS2 authority from being granted by runtime code or configuration alone;
9. keep Batch 1 as prebuild-only, with no code, Supabase mutation, registry activation, specialist activation or `.github/agents` modification;
10. provide adequate QA-to-red expectations for a later builder implementation wave.

### 4. Known Non-Implementation Boundary

This wave does not:

- create runtime code;
- alter application behaviour;
- create or mutate Supabase tables;
- create or activate runtime specialists;
- create APW specialist;
- create ISMS specialist;
- change `.github/agents` files;
- implement gateway routing;
- implement retrieval;
- implement memory writes;
- grant Maturion CS2 authority.

### 5. Requested IAA Output

IAA should provide a later independent assurance verdict or rejection package after reviewing the prebuild artifact set.

This file records the pre-brief only. It does not contain IAA final assurance, a merge verdict, or CS2 approval.
