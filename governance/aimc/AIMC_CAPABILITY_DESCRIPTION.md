# AI Management Centre — Capability Description (ACD)

**Document Type**: Foundation Artefact  
**Status**: DRAFT — Awaiting CS2 Sign-Off  
**Version**: 0.1.0  
**Effective Date**: 2026-02-23  
**Owner**: Maturion Engineering Leadership (Johan Ras, CS2)  
**Location**: `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md`  
**Authorities**:
- `governance/canon/AIMC_STRATEGY.md` v1.0.0 (Constitutional Canon)
- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 (Constitutional Canon)

**Feeds into**:
- Governance Requirements Specification (GRS) — next artefact in sequence
- Agent & Protocol Specification (APS) — follows GRS

---

## 1. Purpose of This Document

This Capability Description (ACD) is the **first artefact** of the AIMC 8-wave implementation plan. It establishes a shared, plain-language understanding of what the AI Management Centre is, why it exists, what it will and will not do, and how it relates to the Maturion ISMS ecosystem and its governance canon. No subsequent AIMC artefact may be started until this document has been CS2 reviewed and accepted.

---

## 2. What is the AIMC?

The **AI Management Centre (AIMC)** is a centralised AI capability platform built inside the `maturion-isms` monorepo (`packages/ai-centre/`). It is the **single, governed integration point** through which every ISMS module accesses all AI capabilities — conversational advisory, structured analysis, deep search, document generation, image generation, video generation, semantic embeddings, and algorithm execution.

**In plain language**: instead of each ISMS application (MAT, PIT, xDetect, Course Crafter, etc.) building its own AI integration, all applications share one central AI platform. That platform manages providers, keys, memory, personas, routing, cost tracking, and graceful degradation in one place. Applications declare *what* AI capability they need; the AIMC decides *how* to deliver it.

**Governing Principle** (from `AIMC_STRATEGY.md` Section 1): *Modules declare WHAT they need. The AI Centre decides HOW to fulfil it. No module may call an AI provider directly.*

---

## 3. Problem Being Solved

Without the AIMC, each ISMS module would independently integrate AI providers, leading to:

- **Duplication**: The same provider boilerplate re-implemented across every module.
- **Vendor lock-in**: Modules coupled to specific provider APIs; a provider change breaks multiple modules simultaneously.
- **Fragile key management**: API keys scattered across modules and environments.
- **Inconsistent memory**: No shared conversational context or organisation-level memory across modules.
- **Zero reusability**: Improvements in one module's AI integration do not benefit other modules.
- **Ungoverned cost**: AI spend with no central visibility, attribution, or cap enforcement.

The AIMC solves all of these by consolidating AI capability behind a single, governed gateway.

---

## 4. Scope

### 4.1 In Scope

| Capability | Description |
|---|---|
| **Single Gateway** | One entry point (`@maturion/ai-centre`) for all AI calls from all ISMS modules. |
| **Capability Routing** | Routing of requests to the appropriate provider based on capability type, cost tier, and provider health. |
| **Provider Adapters** | Adapters for GitHub Models, OpenAI, Anthropic, Perplexity (future), and Runway (future). |
| **Memory Centre** | In-process session memory and Supabase-backed persistent memory, assembled per-call from system prompt, session history, persistent history, and domain knowledge. |
| **Agent Personas** | Module-specific advisor persona files (`packages/ai-centre/agents/`) loaded as system prompts. |
| **Cost & Audit Telemetry** | Per-call logging of organisation, capability, provider, token usage, and latency for central cost attribution. |
| **Graceful Degradation** | Automatic fallback to configured secondary providers; never surfaces raw provider errors to modules. |
| **Central Key Management** | All provider API keys managed by CS2 in environment secrets; no module holds a key. |

### 4.2 Out of Scope

| Not In Scope | Reason |
|---|---|
| **Direct provider calls from modules** | Prohibited by constitutional rule; all AI calls MUST route through the gateway. |
| **Build-time agent orchestration** | Governed separately by `COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md`; the AIMC covers *runtime application AI*, not *build-time agent execution*. |
| **Living Agent System build agents** | `.github/agents/` personas are build agents, constitutionally separate from `packages/ai-centre/agents/` app personas. |
| **Module-owned AI memory tables** | The AIMC owns all AI memory schema; no module defines its own AI memory tables. |
| **Per-module API key management** | Key rotation and secret management are AIMC concerns, invisible to modules. |
| **UI/UX components** | The AIMC is a back-end platform package; front-end rendering of AI responses is each module's responsibility. |

---

## 5. The 8-Wave Implementation Plan

The AIMC is instantiated through eight sequential waves. Each wave builds on the previous; no wave may be skipped.

| Wave | Name | Purpose |
|---|---|---|
| **1** | Foundation & Governance | Produce the governance artefact sequence (ACD → GRS → APS) that freezes the architecture and defines acceptance criteria before any code is written. |
| **2** | Package Scaffold & Schema | Establish the `packages/ai-centre/` package structure, TypeScript interfaces, Supabase schema, and RLS policies so that the build skeleton is in place. |
| **3** | Gateway + Advisory Capability | Implement the single Gateway entry point, the `advisory` capability handler, the GitHub Models provider adapter, in-memory session state, and the MAT advisor persona — enabling MAT to deliver AI advisory to users. |
| **4** | Analysis Capability + Persistent Memory | Add the `analysis` capability, the OpenAI provider adapter, and the Supabase persistent memory adapter with `organisation_id` tenant isolation, enabling context-aware advisory across all modules. |
| **5** | Knowledge Centre + Embeddings + RAG | Build the `embeddings` capability, pgvector integration, and the RAG pipeline so that AI responses are grounded in domain knowledge (ISO standards, MAT framework, etc.). |
| **6** | Document Generation + Image Generation | Deliver the `document-generation` capability (Anthropic Claude) and the `image-generation` capability (OpenAI DALL-E 3), along with the Course Crafter advisor persona. |
| **7** | Deep Search + XDetect + Risk Personas | Integrate the `deep-search` capability (Perplexity API) and deliver the XDetect and Risk advisor personas to enable research-backed incident intelligence and risk advisory. |
| **8** | Video Generation + Algorithm Execution + Governance Certification | Complete the `video-generation` capability (Runway API) and the `algorithm-execution` capability, then perform a full cost-governance audit, verify the audit trail, and certify the AIMC production-ready. |

> **Wave 1 is the current wave.** This ACD is its first deliverable.

> **Wave 8 extension note**: The Governance Certification gate added to Wave 8 extends Canon §8 Phase 6 (which covers `video-generation` + `algorithm-execution` only). This extension is a Wave 1 governance decision and does not constitute a modification to the canonical capability taxonomy, provider strategy, or governance principles. No CS2 canon amendment is required.

---

## 6. Relationship to the ISMS Agent System and Canon Files

### 6.1 Relationship to `AIMC_STRATEGY.md`

`governance/canon/AIMC_STRATEGY.md` is the **constitutional authority** for the AIMC. It defines the architectural overview, capability taxonomy, provider strategy, memory architecture, agent persona governance, and the nine governance principles that bind all modules. This ACD is a plain-language exposition of that canon — it does not add to or modify it. Any conflict between this document and `AIMC_STRATEGY.md` is resolved in favour of the canon.

### 6.2 Relationship to `LIVING_AGENT_SYSTEM.md` v6.2.0

`governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 governs the **build-time Living Agent System** — the framework for Foreman, Orchestrator, and Specialist build agents that operate inside `.github/agents/`. The AIMC's application-facing advisor personas (`packages/ai-centre/agents/`) are **not** Living Agent System agents. They are runtime content files loaded by the AIMC Gateway as system prompts. These are constitutionally separate namespaces (ref: `AIMC_STRATEGY.md` Sections 7.6 and 10.3). The LIVING_AGENT_SYSTEM.md is cited here as a direct authority because the AIMC implementation itself is governed and built under the Living Agent System framework.

### 6.3 Relationship to ISMS Modules

Every ISMS application — MAT, PIT, xDetect, Course Crafter, ISMS Core, Maturity Roadmap, Incident Intelligence, and all future modules — is a **consumer** of the AIMC. Modules import `@maturion/ai-centre` and call `ai.request({ capability, agent, input, context })`. They never import a provider SDK, hold a provider key, or manage memory directly. The AIMC is a prerequisite: no module may implement AI features before Wave 3 of the AIMC build sequence is in place.

### 6.4 Relationship to Existing Build Governance

The Foreman agent (`foreman-v2`) supervises all AIMC build waves under the POLC model. Each wave requires a frozen architecture document, a Red QA suite, and a CS2-approved wave-start before builders begin. The AIMC build sequence is therefore governed by the same wave model that governs all other ISMS module builds.

---

## 7. Seeding Context for Subsequent Artefacts

This ACD immediately feeds the next two documents in the governance artefact sequence:

### 7.1 Governance Requirements Specification (GRS)
The GRS will translate the capability scope (Section 4) and the 8-wave plan (Section 5) into formal, testable governance requirements. Each in-scope capability and each boundary stated in the Out of Scope table becomes a verifiable requirement in the GRS. The GRS is the **Wave 1 Wave-2-blocker**: Wave 2 may not commence until the GRS is CS2 approved.

### 7.2 Agent & Protocol Specification (APS)
The APS will define the concrete TypeScript interfaces, request/response schemas, provider adapter contracts, memory protocol, and persona loading protocol that builders must implement. It draws from the architectural overview in `AIMC_STRATEGY.md` Section 3 and from the formal requirements produced by the GRS. The APS is the **Wave 2 Wave-3-blocker**: Wave 3 code may not be written until the APS is frozen.

---

## 8. References

**Constitutional Canon** (direct authorities for this document):

| Document | Location | Role |
|---|---|---|
| `AIMC_STRATEGY.md` v1.0.0 | `governance/canon/AIMC_STRATEGY.md` (this repo) | Constitutional authority for AIMC architecture, capability taxonomy, provider strategy, memory, and governance principles |
| `LIVING_AGENT_SYSTEM.md` v6.2.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` (this repo) | Living Agent framework governing the build agents that will implement the AIMC |

**Supporting Canon**:

| Document | Location | Role |
|---|---|---|
| `COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md` | `governance/canon/` | Governs build-time model tiering; complementary and non-overlapping with AIMC runtime scope |
| `MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md` | `governance/canon/` | Constitutional authority for the Memory Centre design (AIMC Section 6 implements this) |
| `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` | `governance/canon/` | Knowledge management principles implemented by AIMC `embeddings` + RAG pipeline |
| `WAVE_MODEL.md` | `governance/canon/` | Wave model governing the 8-wave implementation sequence |

**Operational Canon**:

| Document | Location | Role |
|---|---|---|
| `GOVERNANCE_PURPOSE_AND_SCOPE.md` | `governance/canon/` | Governance as canonical memory and control system; constitutional basis cited in `AIMC_STRATEGY.md` §2 |
| `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` | `governance/canon/` | Ripple protocol — changes to AIMC canon trigger layer-down to `maturion-isms`; referenced in `AIMC_STRATEGY.md` §11.3 |
| `AGENT_CONTRACT_PROTECTION_PROTOCOL.md` | `governance/canon/` | CS2 approval gate for modifications to capability taxonomy, provider strategy, or governance principles; referenced in `AIMC_STRATEGY.md` §11.4 |
| `GOVERNANCE_RIPPLE_MODEL.md` | `governance/canon/` | Ripple detection and execution model governing how AIMC canon changes propagate to consumer repos |

---

## 9. Acceptance Criteria

This ACD is complete and ready for CS2 sign-off when all of the following are satisfied:

- [x] File exists at `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md`
- [x] Section 2 provides a plain-language description of the AIMC
- [x] Section 3 articulates the problem being solved
- [x] Section 4 clearly demarcates in-scope capabilities and out-of-scope items
- [x] Section 5 enumerates all 8 waves with a one-sentence purpose per wave
- [x] Section 6 explains the AIMC's relationship to the ISMS agent system and canon files
- [x] Section 7 seeds context for the GRS and APS
- [x] Section 8 cites `AIMC_STRATEGY.md` and `LIVING_AGENT_SYSTEM.md` v6.2.0 as direct authorities
- [x] Section 8 includes all Supporting Canon and Operational Canon references aligned to `AIMC_STRATEGY.md` §12
- [x] Wave 8 Governance Certification extension is explicitly footnoted as a Wave 1 governance decision
- [ ] CS2 review and sign-off received

---

*End of Document*

**Authority**: `governance/canon/AIMC_STRATEGY.md` v1.0.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0  
**Drafted**: 2026-02-23  
**Next Action**: CS2 review → sign-off → commence GRS drafting
