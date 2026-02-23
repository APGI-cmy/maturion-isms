# AI MANAGEMENT CENTRE (AIMC) STRATEGY

## Status
**Type**: Canonical Governance Definition  
**Authority**: Constitutional Canon  
**Version**: 1.0.0  
**Effective Date**: 2026-02-23  
**Owner**: Maturion Engineering Leadership (Johan Ras, CS2)  
**Precedence**: Subordinate to LIVING_AGENT_SYSTEM.md  
**Applies To**: All Maturion ISMS modules and applications  
**Integration**: COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md (build-time orchestration), THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md (knowledge management)  
**Provenance**: Canonized from maturion/strategy/MATURION_AI_MANAGEMENT_CENTRE_STRATEGY.md via PR #1182

---

## 1. Purpose

This document defines the **Maturion AI Management Centre (AIMC)** — a centralised AI capability platform that serves as the single, governed integration point for all AI capabilities across the Maturion ISMS ecosystem.

**Strategic Mandate**: Enable all ISMS modules to access diverse AI capabilities (conversational advisory, structured analysis, image generation, video generation, deep search, algorithm execution, document generation, and semantic embeddings) via a single, plug-and-play integration point without coupling to specific providers or fragmenting governance.

**Governing Principle**: **Modules declare WHAT they need. The AI Centre decides HOW to fulfil it. No module may call an AI provider directly.**

**Problem Context**:
- ISMS modules require fundamentally diverse AI capabilities that no single provider or API covers completely
- Building AI integration into each module individually creates duplication, vendor lock-in, fragile key management, inconsistent memory, and zero reusability
- Memory must be centralised per constitutional memory governance (MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md)
- AI spend must be tracked, capped, and governed centrally with per-module and per-organisation attribution
- Provider landscape will continue to evolve; modules must be insulated from this evolution

---

## 2. Constitutional Mandate

This canon derives authority from and implements:
- **LIVING_AGENT_SYSTEM.md** v6.2.0 — Living Agent framework and governance binding
- **COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md** — Build-time cognitive capability orchestration principles (single identity, capability abstraction, vendor-agnostic classes)
- **MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md** — Memory integrity and unified memory authority
- **THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md** — Knowledge management and semantic embeddings
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** — Governance as canonical memory and control system

**Relationship to Build-Time Orchestration**: The COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md governs build-time agent orchestration (Foreman, orchestrator/specialist architecture, model tiering for build agents). This AIMC canon governs runtime application AI platform for end-user-facing modules. These are complementary and non-overlapping namespaces.

---

## 3. Architectural Overview

The AIMC is implemented as a centralised package (`packages/ai-centre/`) inside the `maturion-isms` repository. All ISMS modules import and use this package exclusively for all AI interactions.

```
┌─────────────────────────────────────────────────────────┐
│              ISMS Modules & Apps                        │
│  [mat] [course-crafter] [risk] [incident-intelligence]  │
│  [xdetect] [pit] [maturity-roadmap] [isms-core] [...]   │
└──────────────────┬──────────────────────────────────────┘
                   │  import { ai } from '@maturion/ai-centre'
                   │  ai.request({ capability, agent, input, context })
┌──────────────────▼──────────────────────────────────────┐
│              AI Management Centre (AIMC)                │
│              packages/ai-centre/                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │   Gateway    │  │    Router    │  │  Capability   │ │
│  │  (single     │  │  (selects    │  │  Registry     │ │
│  │  entry point)│  │   provider)  │  │               │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Capability Handlers                             │   │
│  │  advisory | analysis | deep-search | image-gen   │   │
│  │  video-gen | document-gen | embeddings | algo    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────┐  ┌─────────────────────────────┐  │
│  │  Agent Personas  │  │   Memory Manager            │  │
│  │  (system prompts │  │   (context assembly,        │  │
│  │   per module)    │  │    Supabase persistent,     │  │
│  │                  │  │    in-memory session)       │  │
│  └──────────────────┘  └─────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Provider Adapters                               │   │
│  │  github-models | openai | anthropic |            │   │
│  │  perplexity | runway | (future)                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
 GitHub Models  OpenAI API  Anthropic API
 (primary pool) (DALL-E,    (Claude —
                embeddings)  advisory)
                        ...Perplexity, Runway (future)
```

### 3.1 Gateway
The Gateway is the single entry point exported from `@maturion/ai-centre`. It accepts a structured request object (`capability`, `agent`, `input`, `context`) and returns a structured response. Modules interact exclusively with the Gateway — never directly with Router, Handlers, or Provider Adapters.

### 3.2 Router
The Router selects the appropriate Provider Adapter for each request based on: capability type, configured cost tier, provider health check, and organisation-level configuration overrides. The Router decision is opaque to the calling module.

### 3.3 Capability Registry
The Capability Registry declares all supported capability types, their default providers, and their fallback providers. It is the authoritative source for what the AIMC can do and how each capability is fulfilled.

### 3.4 Capability Handlers
Each capability type has a dedicated handler that normalises the request into the format expected by the target provider, handles response parsing, and applies capability-specific logic (e.g., chunking for long document generation).

### 3.5 Agent Personas
Agent Personas are system prompts loaded from `packages/ai-centre/agents/`. They define the personality, knowledge scope, tone, and constraints for each module's AI advisor. The Gateway loads the appropriate persona and prepends it to every AI call for that agent.

**Namespace Separation**: App-facing advisor personas (`packages/ai-centre/agents/*.md`) are constitutionally separate from build agents (`.github/agents/*.md`). These namespaces must never be merged or confused.

### 3.6 Memory Manager
The Memory Manager assembles the full context window for each AI call and persists conversation history after each call. It operates on two layers: in-memory session state and Supabase-backed persistent memory. See Section 6 for full detail.

### 3.7 Provider Adapters
Each Provider Adapter translates AIMC-normalised requests into the specific format required by that provider's API, handles authentication via centrally managed secrets, and wraps provider errors into AIMC-standard error objects.

---

## 4. Capability Taxonomy

The AIMC defines eight capability types. All modules request capabilities by name. **No module references a provider, model name, or API endpoint.**

| Capability | Purpose | Primary Provider | Fallback | Modules |
|---|---|---|---|---|
| `advisory` | Conversational guidance, recommendations, Q&A | GitHub Models (GPT-4o) | OpenAI direct | All modules |
| `analysis` | Scoring, structured reasoning, evaluation | GitHub Models (o3-mini) | OpenAI o1 | MAT, risk, incident-intelligence, PIT |
| `deep-search` | Real-time research, threat intel, standards lookup | Perplexity API *(Phase 5 — future)* | OpenAI web search | incident-intelligence, risk, isms-core |
| `image-generation` | Diagrams, visuals, course materials | OpenAI DALL-E 3 | Flux (open source) | course-crafter, maturity-roadmap |
| `video-generation` | Course videos, explainers, walkthroughs | Runway API | (future: Sora) | course-crafter |
| `document-generation` | Long-form structured documents, reports | Anthropic (Claude 3.5 Sonnet) | GitHub Models (GPT-4o) | All modules |
| `embeddings` | Vector embeddings for semantic search / RAG | OpenAI embeddings | Supabase pgvector | All modules (knowledge retrieval) |
| `algorithm-execution` | Structured analytical models, scoring algorithms | OpenAI o3 | Claude Opus | xdetect, risk, MAT |

**Constitutional Rule**: No module may call a provider directly. All AI requests MUST route through the AIMC gateway.

---

## 5. AI Provider Strategy

### 5.1 Primary Pool — GitHub Models API
`models.github.ai` provides an OpenAI-compatible REST API covering text reasoning, multi-turn conversation, and document generation. Billed via existing GitHub account. GitHub Models is the default provider for `advisory` and `analysis` capabilities.

### 5.2 OpenAI Direct
CS2's existing OpenAI subscription is used for capabilities GitHub Models does not currently provide: image generation (DALL-E 3) and embeddings. This is not a fallback — it is the designated primary for these capability types.

### 5.3 Anthropic Claude API
Primary for long-form document generation (Claude 3.5 Sonnet). Fallback or co-primary for advisory. Uses OpenAI-compatible interface. CS2's Anthropic subscription is wired through the AIMC — no module holds the Anthropic key.

### 5.4 Perplexity API
Future integration for real-time deep search capability (Phase 5). Separate API key managed centrally. Used by incident-intelligence and risk modules.

### 5.5 Runway API
Future integration for video generation capability (Phase 6). Direct API integration. Used by course-crafter.

### 5.6 Provider Selection Principle
The Router selects a provider based on: (a) capability type, (b) cost tier configuration, (c) availability/health check result, (d) organisation-level configuration override. Provider selection is completely transparent to the calling module. **Modules never know which provider fulfilled a request.**

### 5.7 BYOK — Bring Your Own Key
CS2 manages all provider API keys centrally in environment secrets. No module holds, references, or rotates a provider key. Key rotation is an AIMC concern, invisible to modules.

---

## 6. Memory Centre Architecture

The AIMC is also the home of the Memory Centre. Every AI call requires context. Context comes from memory. Memory must be assembled before the call and updated after. This logic belongs in one place — the AIMC.

### 6.1 Two Memory Layers

**Session Memory (in-memory, ephemeral)**

The current conversation buffer, active document state, and multi-turn context for the current user session. Lives in process memory. Cleared on session end. Provides fast, low-latency access to recent conversational context without a database round-trip.

**Persistent Memory (Supabase PostgreSQL)**

Conversation history, user preferences, prior analysis results, module interaction history, and the learned organisation profile. Persisted across sessions. Subject to `organisation_id` Row Level Security (RLS). The source of truth for long-term contextual awareness.

### 6.2 Context Assembly

The `context-builder.ts` module assembles the full context window for each AI call from four sources, in order:

1. **System prompt** — the agent persona file for the relevant module/agent.
2. **Session memory** — recent turns from the in-memory conversation buffer.
3. **Persistent memory** — relevant history retrieved from Supabase, including prior analysis results and user preferences.
4. **Knowledge** — domain content retrieved via semantic search from the embeddings/RAG layer.

The module calling the AIMC never touches context assembly. It passes only `{ organisationId, userId }` and the AIMC handles the rest.

### 6.3 Supabase as Backbone

The AIMC's persistent memory layer is built on Supabase:

- **pgvector extension**: Enables semantic memory search so the context-builder retrieves the most relevant prior context rather than the most recent.
- **Row Level Security**: Enforces strict `organisation_id` tenant isolation at the database level. No application-layer enforcement is sufficient on its own.
- **Realtime**: Enables streaming AI responses to the client via Supabase Realtime channels.
- **Schema ownership**: The AIMC Supabase schema is defined and owned by `packages/ai-centre/`. No module defines its own AI memory tables.

### 6.4 Governance Reference

Memory governance principles are defined in `maturion-foreman-governance` memory strategy. This section is the application of those principles inside `maturion-isms`. This strategy does not redefine memory governance — it implements it.

---

## 7. Agent Personas

### 7.1 What They Are
Each module has one or more agent personas — markdown files containing the system prompt that defines the AI advisor's personality, knowledge scope, tone, and constraints for that module's users. For example, the MAT advisor persona defines how the AI presents maturity assessment guidance; the risk advisor persona defines how it presents risk management advice.

### 7.2 Where They Live
All agent persona files live in `packages/ai-centre/agents/` inside `maturion-isms`. Examples:
- `maturity-advisor.md`
- `risk-advisor.md`
- `course-crafter-advisor.md`
- `isms-navigator.md`

### 7.3 What They Are NOT
These are NOT `.github/agents/` files. They are NOT GitHub Copilot build agents. They are NOT Living Agent System agents. They are runtime advisor personas for application end-users only.

### 7.4 Format
Plain markdown. The AIMC Gateway loads the file content and passes it as the `system` message in every AI call made for that persona. No structured schema is required — the file content is the system prompt, verbatim.

### 7.5 Governance
Persona files are authored and maintained in `packages/ai-centre/agents/`. Changes follow the standard PR process. No special agent authority or governance gate is required — these are content files, not build agents.

### 7.6 Separation Principle
**Build agents** (`.github/agents/*.md`) govern repository maintenance and are part of the Living Agent System.
**App personas** (`packages/ai-centre/agents/*.md`) govern user-facing AI advisors and are runtime content files.

These are architecturally distinct namespaces. They must never be confused, and no file from one namespace belongs in the other.

---

## 8. Build Sequence (Phased)

The AIMC is built incrementally. Each phase unlocks AI capabilities for specific modules. No module may implement AI features outside this sequence.

| Phase | Deliverable | Prerequisite | Unlocks |
|---|---|---|---|
| Phase 1 | Gateway + `advisory` capability + GitHub Models provider + in-memory session + MAT advisor persona | MAT module complete | MAT can offer AI advisory to users |
| Phase 2 | `analysis` capability + OpenAI provider + Supabase persistent memory adapter + `organisation_id` context | Supabase schema established | Persistent, context-aware advisory across all modules |
| Phase 3 | Knowledge centre + `embeddings` capability + RAG pipeline | Supabase pgvector enabled | Domain-knowledge-grounded advisory (ISO standards, MAT framework) |
| Phase 4 | `image-generation` + `document-generation` capabilities + course-crafter persona | Phase 2 complete | Course Crafter AI features |
| Phase 5 | `deep-search` (Perplexity) + xdetect persona + risk persona | Phase 2 complete | Research-backed incident intelligence, risk advisory |
| Phase 6 | `video-generation` (Runway) + `algorithm-execution` | Phase 4 complete | Course video generation, advanced scoring models |

**Strategic Constraint**: Phase 1 must be architected and stubbed (even if not fully implemented) before any module adds AI features. No module may implement AI capabilities outside the AIMC pattern, regardless of phase.

---

## 9. Governance Principles

These are constitutional rules for the AIMC. They bind all modules and all future AIMC development.

1. **Single gateway**: All AI calls from all modules and apps MUST route through `@maturion/ai-centre`. Direct provider calls from modules are prohibited.

2. **Capability abstraction**: Modules request capabilities by name (`advisory`, `analysis`, etc.) — never by provider, model name, or API endpoint.

3. **Provider transparency**: Modules are never aware of which provider or model fulfilled a request. The Router decides; the module receives only the result.

4. **Tenant isolation**: All AI calls MUST include `organisationId`. Memory and context are strictly scoped by `organisation_id`. RLS enforces this at the database level. Application-layer enforcement alone is insufficient.

5. **Central key management**: All provider API keys are managed by CS2 in environment secrets. No module holds, references, or rotates API keys.

6. **Fix once, deploy everywhere**: When the AIMC is improved (new provider, better model, memory upgrade), all modules benefit immediately. No module-level AI updates are required.

7. **Persona governance**: App-facing advisor personas live in `packages/ai-centre/agents/`. Build agents live in `.github/agents/`. These namespaces are constitutionally separate and must never be merged or confused.

8. **Cost governance**: AI usage telemetry is captured centrally by the AIMC. Per-module, per-organisation cost attribution is mandatory at scale. No AI spend may be invisible to the central governance layer.

9. **Graceful degradation**: If a primary provider is unavailable, the Router falls back to the configured fallback provider. If all providers for a capability fail, the AIMC returns a structured error — it never surfaces a raw provider error to a module.

---

## 10. Relationship to Existing Governance

### 10.1 COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md (v1.1.0)
That canon covers AI model tiering (complexity-aware capability selection) for the **build agent orchestrator/specialist architecture** inside `maturion-foreman-office-app`. It defines how routing, synthesis, and escalation models are assigned to build-time agent classes.

This AIMC canon covers the **runtime application AI platform** inside `maturion-isms`. It defines how end-user-facing modules access diverse AI capabilities at runtime.

**These two canons are complementary and non-overlapping.** The model tiering principles from COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md (lightweight → core → premium escalation) are adopted and extended here for the application layer: the AIMC Router applies equivalent tiering logic when selecting providers for `analysis` and `algorithm-execution` capabilities.

### 10.2 Memory Strategy (MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md)
The memory governance principles defined in MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md are the constitutional authority for the Memory Centre design described in Section 6. This AIMC canon implements those principles — it does not redefine or supersede them. Any conflict between Section 6 and the memory strategy is resolved in favour of the memory strategy.

### 10.3 Living Agent System v6.2.0
The AIMC agent personas defined in Section 7 are NOT Living Agent System agents. They are runtime content files loaded by the AIMC Gateway at call time. The Living Agent System governs build agents only. The namespaces are constitutionally separate as stated in Section 7.6 and Section 9 Principle 7.

### 10.4 THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md
The AIMC `embeddings` capability and RAG pipeline (Phase 3) implement the knowledge management principles defined in THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md for runtime application use. The AIMC is the application-layer implementation of the knowledge architecture for end-user modules.

### 10.5 Module Builds (MAT, course-crafter, etc.)
No module may add AI features before Phase 1 of the AIMC build sequence is available and structurally in place. Module build waves requiring AI features must be sequenced after AIMC Phase 1 is complete. This constraint is absolute — it is not subject to per-module exception or acceleration.

---

## 11. Enforcement and Compliance

### 11.1 Merge Gate Requirements
PRs to `maturion-isms` that introduce AI provider calls outside the AIMC gateway MUST be rejected at merge gate. The governance alignment gate must detect direct provider imports (e.g., `import { OpenAI }`, `import Anthropic`) in module code.

### 11.2 Audit Trail
All AI calls through the AIMC are logged with: timestamp, `organisationId`, `userId`, capability type, selected provider, token usage, and latency. This audit trail is mandatory for cost attribution and governance oversight.

### 11.3 Ripple Awareness
Changes to this canon trigger layer-down ripple to `maturion-isms` repository per CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md. Consumer repos must align to capability taxonomy and provider strategy updates.

### 11.4 CS2 Authority
Modifications to capability taxonomy (Section 4), provider strategy (Section 5), or governance principles (Section 9) require CS2 approval per AGENT_CONTRACT_PROTECTION_PROTOCOL.md.

---

## 12. References

**Constitutional Canon**:
- LIVING_AGENT_SYSTEM.md v6.2.0 — Living Agent framework
- COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md v1.1.0 — Build-time orchestration
- MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md — Memory governance
- THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md — Knowledge management
- GOVERNANCE_PURPOSE_AND_SCOPE.md — Governance control system

**Operational Canon**:
- CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md — Ripple protocol
- AGENT_CONTRACT_PROTECTION_PROTOCOL.md — CS2 approval requirements
- GOVERNANCE_RIPPLE_MODEL.md — Ripple detection and execution

**Source Material**:
- maturion/strategy/MATURION_AI_MANAGEMENT_CENTRE_STRATEGY.md — Original strategy document (PR #1182)

---

*End of Document*

**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0  
**Contract**: governance-repo-administrator-v2.agent.md  
**Canonized**: 2026-02-23 via session-047  
**Provenance**: PR #1182 (commit 6cd642c5932788d571d6ec16a5c7c63e05fd2c2e)
