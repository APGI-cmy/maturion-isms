# AI Management Centre — Agent Assignment Wave Plan (AAWP)

**Document Type**: Foundation Artefact — Wave 1 Deliverable (Step 7)
**Status**: DRAFT — Awaiting CS2 Review and Sign-Off
**Version**: 0.1.0
**Effective Date**: 2026-02-23
**Owner**: Maturion Engineering Leadership (Johan Ras, CS2)
**Location**: `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md`

**Authorities**:
- `governance/canon/AIMC_STRATEGY.md` v1.0.0 (Constitutional Canon)
- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 (Constitutional Canon)
- `governance/canon/WAVE_MODEL.md` (Wave Execution Canon)
- `governance/canon/FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md`

**Derived From (Step 1–6 Artefacts)**:
- Step 1: `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md` (ACD)
- Step 2: `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` (GRS)
- Step 3: `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md` (APS)
- Step 4: `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md` (AAD)
- Step 5: RED Gate QA Suite (test scaffolding defined in AAD §9)
- Step 6: CS2 review gate — all Wave 1 artefacts (ACD, GRS, APS, AAD, Red QA) approved

**Step Gate**:
> **IMPORTANT**: This AAWP is a Wave 1 planning deliverable. CS2 MUST review and sign off this document before Step 8 (Wave 2 execution) may commence. No build agent may begin Wave 2 work until CS2 approval is recorded in Section 10.

---

## 1. Purpose of This Document

The Agent Assignment Wave Plan (AAWP) is the **seventh artefact** of the AIMC Wave 1 planning sequence (ACD → GRS → APS → AAD → Red QA Suite → CS2 Wave 1 Gate → **AAWP** → Wave 2 Execution). It translates the 8-wave implementation plan defined in the ACD (§5) and the architecture defined in the AAD (§7) into an actionable, wave-by-wave execution blueprint.

This document answers three questions for every wave:
1. **What** must be built and tested? (scope, deliverables, test requirements)
2. **Who** builds it? (agent assignments and coordinator)
3. **How** does the wave close? (handover gates, merge criteria, approver checkpoints)

All subsequent waves must be executed in strict compliance with this plan. Any deviation requires a CS2-approved AAWP amendment before the affected wave may proceed.

---

## 2. Agent Roster

The following agents are registered for AIMC build wave execution. All agents operate under Foreman (`foreman-v2`) POLC supervision. Builder agents MUST NOT begin any wave until Foreman has issued a formal wave-start authorisation for that wave.

| Agent ID | Role | Domain | Authority |
|---|---|---|---|
| `foreman-v2` | Wave Coordinator / POLC Supervisor | All waves — orchestration only, no implementation | `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 |
| `schema-builder` | Builder — Database Schema | Supabase migrations, RLS policies, table definitions | `governance/checklists/BUILDER_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| `api-builder` | Builder — API / Business Logic | Gateway, router, adapters, memory, telemetry, provider integrations | `governance/checklists/BUILDER_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| `ui-builder` | Builder — Frontend | No AIMC scope (AIMC is a back-end package — ACD §4.2) | `governance/checklists/BUILDER_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| `qa-builder` | Builder — QA / Testing | RED gate QA suite, per-wave test execution, quality certification | `governance/checklists/BUILDER_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| `governance-liaison-isms-agent` | Governance Oversight | Canon alignment, ripple processing, governance artefact integrity | `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` |

> **Note on `ui-builder`**: The AIMC package (`packages/ai-centre/`) has no UI scope per ACD §4.2. `ui-builder` has no delivery role in AIMC waves. Module-level UI integration is each consumer module's responsibility and falls outside this plan.

---

## 3. Wave Execution Rules (Applicable to All Waves)

The following rules apply to every wave in this plan. They are derived from the WAVE_MODEL.md canonical governance and must not be overridden at the wave level.

1. **Sequential execution**: Waves execute in strict order (Wave 1 → Wave 8). No wave may start until the preceding wave is Foreman-certified complete.
2. **Architecture primacy**: The AAD is the frozen architecture document. No builder may deviate from `packages/ai-centre/` module layout without a CS2-approved AAD amendment.
3. **QA-to-Red before code**: For each wave, Foreman appoints `qa-builder` to define or extend the failing test suite *before* `api-builder` or `schema-builder` write implementation code.
4. **100% GREEN gate**: A wave may not close unless all tests (unit + integration in scope) pass at 100% GREEN with zero skipped, zero todo, and zero stub tests for the wave's scope.
5. **Zero test debt**: No test may be commented out, skipped, or left failing at wave close. Zero test debt is a handover pre-condition.
6. **Stub compliance**: Files stubbed for future waves MUST satisfy the `ProviderAdapter` TypeScript interface so that compilation remains clean throughout. Stubs throw `new Error('Not implemented — Wave N')`.
7. **OPOJD Gate at close**: Foreman applies the OPOJD gate at each wave closure: 0 test failures, 0 skipped/todo/stub tests, 0 deprecation warnings, 0 compiler/linter warnings.
8. **CS2 approval checkpoints**: Identified at specific gates below. Execution MUST pause at each checkpoint until CS2 approval is recorded.
9. **Merge gate parity**: Foreman runs all `merge_gate_interface.required_checks` locally and verifies parity with CI before opening any merge PR.

---

## 4. Wave Plans

---

### Wave 1 — Foundation & Governance

**Status**: IN PROGRESS (this document is a Wave 1 deliverable)

**Plain Language Summary**:
Wave 1 produces all governance artefacts needed to ensure the AIMC architecture is fully specified, agreed, and testable before a single line of implementation code is written. No AIMC implementation code is produced in Wave 1. The entire wave is governance and planning.

**Deliverables**:

| Step | Artefact | Location | Status |
|---|---|---|---|
| 1 | ACD — Capability Description | `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md` | DRAFT (awaiting CS2) |
| 2 | GRS — Governance Requirements Specification | `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` | DRAFT (awaiting CS2) |
| 3 | APS — Agent & Protocol Specification | `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md` | DRAFT (awaiting CS2) |
| 4 | AAD — Artefact Architecture Description | `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md` | DRAFT (awaiting CS2) |
| 5 | RED Gate QA Suite | `packages/ai-centre/` (test scaffolding per AAD §9) | Pending |
| 6 | CS2 Wave 1 Gate (all above reviewed and approved) | — | Pending |
| 7 | AAWP — Agent Assignment Wave Plan (this document) | `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` | DRAFT (awaiting CS2) |
| 8 | CS2 AAWP Approval Gate — authorises Wave 2 execution | — | Pending |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Supervises all Step deliverables; issues CS2 review requests; certifies Wave 1 complete |
| Governance Author | CS2 / Foreman delegation | Drafting of Steps 1–4 artefacts |
| QA Builder | `qa-builder` | Authoring RED Gate QA Suite (Step 5) — all tests must fail RED before any Wave 2 code |
| Governance Liaison | `governance-liaison-isms-agent` | Confirms canon alignment for all Wave 1 artefacts |

**Handover / Merge / Test Requirements**:
- No implementation code is merged in Wave 1
- All artefact files committed to `governance/aimc/`
- RED Gate QA Suite scaffolding committed to `packages/ai-centre/` with all tests failing (confirmed RED)
- CS2 sign-off recorded on all Step 1–5 artefacts before Step 6 gate closes

**CS2 Approval Checkpoint — Wave 1 Gate (Step 6)**:
> CS2 MUST review and sign off the ACD, GRS, APS, AAD, and RED Gate QA Suite before this gate closes and Wave 2 may start. This is a hard stop.

**CS2 Approval Checkpoint — AAWP Gate (Step 8)**:
> CS2 MUST review and sign off this AAWP before Wave 2 execution begins. This gate is the execution launchpad.

---

### Wave 2 — Package Scaffold & Schema

**Plain Language Summary**:
Wave 2 creates the physical `packages/ai-centre/` package with its full TypeScript interface layer, all stub files, and the Supabase schema (tables, RLS policies, indexes). No live AI provider calls are made. The wave ends with a compilable package that fully satisfies the type system and passes all RED-gate structural tests.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| Package manifest | `packages/ai-centre/package.json` | name: `@maturion/ai-centre` |
| TypeScript config | `packages/ai-centre/tsconfig.json` | `strict: true` |
| Public API surface | `packages/ai-centre/src/index.ts` | Exports defined in APS §4.1 |
| All TypeScript types | `packages/ai-centre/src/types/index.ts` | Full types from APS §4.2–§4.3 |
| `AICentre` gateway (interface only) | `packages/ai-centre/src/gateway/AICentre.ts` | Stub — no live logic |
| All provider adapter stubs | `packages/ai-centre/src/adapters/*.ts` (×5) | All implement `ProviderAdapter`; throw `Not implemented` |
| `PersistentMemoryAdapter` stub | `packages/ai-centre/src/memory/PersistentMemoryAdapter.ts` | Returns empty; no-ops |
| `TelemetryWriter` stub | `packages/ai-centre/src/telemetry/TelemetryWriter.ts` | No-op stub |
| Supabase migration: `ai_memory` | `packages/ai-centre/supabase/migrations/001_ai_memory.sql` | Table + RLS (GRS-008, GRS-027) |
| Supabase migration: `ai_telemetry` | `packages/ai-centre/supabase/migrations/002_ai_telemetry.sql` | Table + RLS append-only (GRS-013) |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red before code; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | Extends RED Gate QA Suite with Wave 2 structural tests; confirms all tests RED before `schema-builder` / `api-builder` start |
| Schema Builder | `schema-builder` | Authors Supabase migrations (001, 002), RLS policies, indexes |
| API Builder | `api-builder` | Authors TypeScript package scaffold: `package.json`, `tsconfig.json`, `src/index.ts`, `src/types/index.ts`, all stub source files |

**Handover / Merge / Test Requirements**:
- `qa-builder` delivers RED Gate suite extension first; Foreman confirms 100% RED before builders start
- `schema-builder` and `api-builder` execute in parallel after QA-Red confirmation
- All TypeScript compiles clean with `strict: true` — zero errors
- All Wave 2 RED Gate tests pass GREEN at wave close
- Supabase migrations execute without error on a local Supabase instance
- `schema-builder` handover: migration SQL files + RLS policy evidence
- `api-builder` handover: TypeScript package with passing type checks + unit test results
- Foreman OPOJD gate: 0 failures, 0 skipped, 0 warnings
- Foreman certifies wave complete; merge PR raised to main branch

**CS2 Approval Checkpoint — Wave 2 Start**:
> Foreman confirms CS2 AAWP sign-off is on record before issuing Wave 2 wave-start to builders.

---

### Wave 3 — Gateway + Advisory Capability

**Plain Language Summary**:
Wave 3 delivers the first live AI capability: a working `AICentre` gateway that routes `advisory` requests through the GitHub Models provider adapter, backed by in-process session memory and the MAT advisor persona. After Wave 3, MAT can request AI advisory responses via `@maturion/ai-centre`.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `AICentre` gateway (full) | `packages/ai-centre/src/gateway/AICentre.ts` | Full routing, memory assembly, persona loading, telemetry |
| `CapabilityRouter` | `packages/ai-centre/src/routing/CapabilityRouter.ts` | Routes by capability type, cost tier, provider health |
| `ProviderHealthRegistry` | `packages/ai-centre/src/routing/ProviderHealthRegistry.ts` | Provider health check registry |
| `SessionMemoryStore` | `packages/ai-centre/src/memory/SessionMemoryStore.ts` | In-process session-scoped conversation history |
| `MemoryLifecycle` (partial) | `packages/ai-centre/src/memory/MemoryLifecycle.ts` | Session memory only; persistent memory still stubbed |
| `PersonaLoader` | `packages/ai-centre/src/personas/PersonaLoader.ts` | Loads Markdown persona files by `agentId` |
| `GitHubModelsAdapter` | `packages/ai-centre/src/adapters/GitHubModelsAdapter.ts` | First live provider adapter — `advisory` capability |
| `ProviderKeyStore` | `packages/ai-centre/src/keys/ProviderKeyStore.ts` | Central key retrieval from environment secrets (GRS-015) |
| `TelemetryWriter` (full) | `packages/ai-centre/src/telemetry/TelemetryWriter.ts` | Append-only telemetry to `ai_telemetry` table |
| MAT advisor persona | `packages/ai-centre/agents/mat-advisor.md` | Markdown persona file for MAT AI advisory |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red before code; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | Extends RED Gate suite with Wave 3 gateway, routing, and advisory integration tests; confirms all new tests RED before builders start |
| API Builder | `api-builder` | Authors all Wave 3 TypeScript implementation files; persona file |
| Governance Liaison | `governance-liaison-isms-agent` | Confirms MAT advisor persona file complies with APS §8 persona governance rules |

**Handover / Merge / Test Requirements**:
- `qa-builder` delivers extended RED Gate suite first; Foreman confirms all new tests RED
- `api-builder` implements all Wave 3 files; stubs for Waves 4–8 remain in place
- End-to-end advisory test: `ai.request({ capability: 'advisory', agent: 'mat-advisor', input: '...', context })` returns a structured response
- `TelemetryWriter` test: per-call telemetry event is written with all required fields (GRS-012)
- `PersonaLoader` test: loading `mat-advisor` returns the correct Markdown content
- All remaining stub files still satisfy `ProviderAdapter` interface (TypeScript clean)
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies wave complete; merge PR raised

**CS2 Approval Checkpoint — Wave 3 Advisory Review**:
> Foreman presents `api-builder` handover evidence to CS2 for review of the first live AI capability before the Wave 3 merge PR is merged to main. This is a quality gate, not a blocking hold — CS2 may approve asynchronously within 1 business day. If concerns are raised, `api-builder` receives a remediation order from Foreman before merge proceeds.

---

### Wave 4 — Analysis Capability + Persistent Memory

**Plain Language Summary**:
Wave 4 adds the `analysis` capability via the OpenAI provider adapter and enables cross-session, tenant-isolated persistent memory via the Supabase `ai_memory` table. After Wave 4, all ISMS modules can receive context-aware AI advisory that remembers prior interactions within their organisation.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `OpenAIAdapter` (analysis + embeddings) | `packages/ai-centre/src/adapters/OpenAIAdapter.ts` | Implements `analysis` capability; embeddings stubbed for Wave 5 |
| `PersistentMemoryAdapter` (full) | `packages/ai-centre/src/memory/PersistentMemoryAdapter.ts` | Supabase-backed; `organisation_id` tenant isolation (GRS-008) |
| `MemoryLifecycle` (full) | `packages/ai-centre/src/memory/MemoryLifecycle.ts` | Session + persistent memory; context assembly order (GRS-030) |
| ISMS Navigator persona | `packages/ai-centre/agents/isms-navigator.md` | **CS2 wave-confirmation required before implementation** (see note) |

> **CS2 Wave-Confirmation Note (ISMS Navigator persona)**: The AAD flags that the ISMS Navigator persona wave assignment is TBD-CS2. Foreman MUST confirm with CS2 whether this persona is in scope for Wave 4 or deferred to a later wave before `api-builder` authors this file.

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; CS2 confirmation on ISMS Navigator; supervises QA-Red; certifies wave |
| QA — Test Suite (pre-code) | `qa-builder` | Extends RED Gate suite with Wave 4 persistent memory and analysis integration tests |
| API Builder | `api-builder` | Authors `OpenAIAdapter`, `PersistentMemoryAdapter`, full `MemoryLifecycle`, and ISMS Navigator persona (if CS2 confirms) |
| Schema Builder | `schema-builder` | Confirms `001_ai_memory.sql` migration is correctly applied and RLS is enforced for `organisation_id` isolation |

**Handover / Merge / Test Requirements**:
- CS2 ISMS Navigator confirmation recorded in wave-start authorisation before implementation begins
- Integration test: `PersistentMemoryAdapter.persist()` writes to `ai_memory` with correct `organisation_id`; `retrieve()` returns only records matching caller's `organisation_id`
- Cross-session test: a second request within the same organisation retrieves prior conversation history
- Analysis capability test: `ai.request({ capability: 'analysis', ... })` routes to `OpenAIAdapter` and returns structured analysis
- RLS enforcement test: cross-tenant memory retrieval returns no records
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies wave complete; merge PR raised

---

### Wave 5 — Knowledge Centre + Embeddings + RAG

**Plain Language Summary**:
Wave 5 builds the semantic knowledge layer. It extends the OpenAI adapter with embedding generation, integrates pgvector for similarity search, and connects the RAG pipeline so that AI responses are grounded in domain knowledge (ISO standards, MAT framework documents, etc.) rather than relying solely on the model's training data.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `OpenAIAdapter` (embeddings extension) | `packages/ai-centre/src/adapters/OpenAIAdapter.ts` | Adds `embeddings` capability to existing adapter |
| RAG pipeline integration | `packages/ai-centre/src/memory/MemoryLifecycle.ts` | Adds domain knowledge segment to context assembly (GRS-030) |
| pgvector search integration | Supabase migration / `PersistentMemoryAdapter.ts` extension | Vector similarity search for knowledge retrieval |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red; certifies wave |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests for embeddings generation, vector search, and RAG context assembly |
| API Builder | `api-builder` | Implements embeddings extension in `OpenAIAdapter`, RAG pipeline in `MemoryLifecycle` |
| Schema Builder | `schema-builder` | pgvector extension and migration for vector storage in Supabase |

**Handover / Merge / Test Requirements**:
- Embeddings test: `ai.request({ capability: 'embeddings', input: '...' })` returns a valid vector representation
- RAG test: a domain knowledge document, once embedded and stored, is retrieved and included in the context assembly for a subsequent advisory request
- pgvector migration executes cleanly on local Supabase; vector index verified
- Context assembly order test: domain knowledge segment appears in the correct position (GRS-030)
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies wave complete; merge PR raised

---

### Wave 6 — Document Generation + Image Generation

**Plain Language Summary**:
Wave 6 adds two new capabilities: the ability to generate structured documents (via Anthropic Claude) and images (via OpenAI DALL-E 3). The Course Crafter advisor persona is delivered, enabling the Course Crafter module to leverage both capabilities for content generation.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `AnthropicAdapter` | `packages/ai-centre/src/adapters/AnthropicAdapter.ts` | `document-generation` capability via Claude |
| `OpenAIAdapter` (image-generation extension) | `packages/ai-centre/src/adapters/OpenAIAdapter.ts` | `image-generation` capability via DALL-E 3 |
| Course Crafter advisor persona | `packages/ai-centre/agents/course-crafter-advisor.md` | Markdown persona for Course Crafter module |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red; certifies wave |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests for document generation and image generation capabilities, including fallback behaviour |
| API Builder | `api-builder` | Implements `AnthropicAdapter`, image-generation extension in `OpenAIAdapter`, Course Crafter persona |

**Handover / Merge / Test Requirements**:
- Document generation test: `ai.request({ capability: 'document-generation', agent: 'course-crafter-advisor', ... })` routes to `AnthropicAdapter` and returns a structured document object
- Image generation test: `ai.request({ capability: 'image-generation', ... })` routes to `OpenAIAdapter` (DALL-E 3) and returns an image response
- Graceful degradation test: if `AnthropicAdapter.healthCheck()` returns `UNAVAILABLE`, gateway falls back to configured secondary without surfacing a raw provider error (GRS-014)
- Course Crafter persona test: `PersonaLoader.load('course-crafter-advisor')` returns non-empty Markdown
- `PerplexityAdapter` and `RunwayAdapter` stubs remain clean (TypeScript compilation passes)
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies wave complete; merge PR raised

---

### Wave 7 — Deep Search + XDetect + Risk Personas

**Plain Language Summary**:
Wave 7 delivers research-backed intelligence by integrating the Perplexity API for deep-search capability. Two new advisor personas (XDetect and Risk) are delivered, enabling the XDetect and Risk platform modules to provide AI-powered incident intelligence and risk advisory grounded in live research.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `PerplexityAdapter` | `packages/ai-centre/src/adapters/PerplexityAdapter.ts` | `deep-search` capability via Perplexity API |
| XDetect advisor persona | `packages/ai-centre/agents/xdetect-advisor.md` | Markdown persona for XDetect incident intelligence |
| Risk advisor persona | `packages/ai-centre/agents/risk-advisor.md` | Markdown persona for Risk platform advisory |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red; certifies wave |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests for deep-search routing, response handling, and both new personas |
| API Builder | `api-builder` | Implements `PerplexityAdapter`, XDetect persona, Risk persona |
| Specialist Advisor | `risk-platform-agent` | Advisory review of Risk advisor persona content for domain accuracy — consulted by `api-builder`, not a primary builder |

**Handover / Merge / Test Requirements**:
- Deep search test: `ai.request({ capability: 'deep-search', ... })` routes to `PerplexityAdapter` and returns a research-backed response
- XDetect persona test: `PersonaLoader.load('xdetect-advisor')` returns non-empty Markdown with correct domain framing
- Risk persona test: `PersonaLoader.load('risk-advisor')` returns non-empty Markdown; `risk-platform-agent` advisory review completed and recorded in handover evidence
- `RunwayAdapter` stub remains clean (TypeScript compilation passes)
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies wave complete; merge PR raised

---

### Wave 8 — Video Generation + Algorithm Execution + Governance Certification

**Plain Language Summary**:
Wave 8 completes the AIMC capability set by delivering the Runway video generation adapter and enabling algorithm execution via the OpenAI o3 model. It concludes with a full cost-governance audit, audit trail verification, and formal production-readiness certification by CS2. After Wave 8, the AIMC is declared production-ready and all ISMS modules may consume AI capabilities.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `RunwayAdapter` | `packages/ai-centre/src/adapters/RunwayAdapter.ts` | `video-generation` capability via Runway API |
| Algorithm execution routing | `packages/ai-centre/src/routing/CapabilityRouter.ts` (extension) | `algorithm-execution` routes to `OpenAIAdapter` (o3 model) via capability routing config |
| Cost governance audit report | `governance/aimc/AIMC_GOVERNANCE_CERTIFICATION.md` | Full cost attribution, telemetry audit trail, key management review |
| Production-readiness certification | `governance/aimc/AIMC_GOVERNANCE_CERTIFICATION.md` | CS2 sign-off: AIMC certified production-ready |

> **Algorithm Execution Note**: The `algorithm-execution` capability does not require a new adapter file. It is handled entirely via capability routing configuration directing requests to `OpenAIAdapter` using the OpenAI o3 model (ref: AAD §7, AIMC_STRATEGY.md §4).

> **Wave 8 Governance Certification Extension Note**: The Governance Certification gate (cost audit + production-readiness sign-off) extends the canonical ACD §5 Wave 8 scope beyond code delivery. This extension is a Wave 1 governance decision (per ACD §5 footnote) and does not constitute a modification to the canonical capability taxonomy, provider strategy, or governance principles. No CS2 canon amendment is required.

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red; runs OPOJD gate; prepares Governance Certification evidence; presents to CS2 |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests for video generation, algorithm execution routing, and full end-to-end telemetry audit coverage |
| API Builder | `api-builder` | Implements `RunwayAdapter`; confirms algorithm execution routing configuration; assists in cost audit evidence compilation |
| Governance Liaison | `governance-liaison-isms-agent` | Reviews Governance Certification document for canon alignment; confirms all canon references are current |

**Handover / Merge / Test Requirements**:
- Video generation test: `ai.request({ capability: 'video-generation', ... })` routes to `RunwayAdapter` and returns a video job response
- Algorithm execution test: `ai.request({ capability: 'algorithm-execution', ... })` routes to `OpenAIAdapter` (o3 model) and returns a structured result
- Zero stubs remaining: all five provider adapters have live implementations; no `throw new Error('Not implemented')` remaining in production code
- Telemetry audit test: for each capability type, at least one telemetry record exists in `ai_telemetry` with all required fields (GRS-012)
- Key management test: no provider key appears in any source file; all keys are retrieved via `ProviderKeyStore` from environment secrets (GRS-015)
- Cost attribution: all telemetry records have non-null `organisation_id`, `capability`, `provider`, `tokens_used` (GRS-012)
- Full regression: all prior wave tests pass GREEN in combined wave test run
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies all 8 waves complete; Governance Certification document authored

**CS2 Approval Checkpoint — Wave 8 Production-Readiness Certification (Final Gate)**:
> Foreman presents the complete evidence bundle (all wave certifications, telemetry audit, key management review, full test results) to CS2. CS2 reviews and signs off the `AIMC_GOVERNANCE_CERTIFICATION.md`. Only after CS2 sign-off is the AIMC declared production-ready and ISMS modules authorised to consume AI capabilities in production.

---

## 5. Wave Dependency Chain

```
Wave 1 (Foundation & Governance)
  │   └── CS2 Gate: ACD + GRS + APS + AAD + Red QA + AAWP all approved
  ↓
Wave 2 (Package Scaffold & Schema)
  │   └── Gate: TypeScript compiles clean; Supabase migrations succeed; RED Gate passes GREEN
  ↓
Wave 3 (Gateway + Advisory)
  │   └── Gate: Advisory end-to-end passes; telemetry writes; MAT persona loads; CS2 advisory review
  ↓
Wave 4 (Analysis + Persistent Memory)
  │   └── Gate: Persistent memory isolation verified; analysis capability live; CS2 ISMS Navigator confirmation
  ↓
Wave 5 (Knowledge + Embeddings + RAG)
  │   └── Gate: Embeddings generate; RAG retrieves; context assembly order correct
  ↓
Wave 6 (Document + Image Generation)
  │   └── Gate: Document and image capabilities live; graceful degradation verified; Course Crafter persona
  ↓
Wave 7 (Deep Search + XDetect + Risk)
  │   └── Gate: Deep search live; XDetect and Risk personas loaded; risk-platform-agent review complete
  ↓
Wave 8 (Video + Algorithm + Certification)
      └── Final Gate: All 8 capabilities live; all stubs replaced; cost audit complete; CS2 certifies production-ready
```

---

## 6. Cross-Wave Testing Obligations

At each wave close, the following cross-wave (regression) test scope applies:

| Closing Wave | Regression Test Scope |
|---|---|
| Wave 2 | Wave 2 structural tests only |
| Wave 3 | Waves 2–3 full suite |
| Wave 4 | Waves 2–4 full suite |
| Wave 5 | Waves 2–5 full suite |
| Wave 6 | Waves 2–6 full suite |
| Wave 7 | Waves 2–7 full suite |
| Wave 8 | Waves 2–8 full suite (combined wave test run) |

No wave may close with a regression failure in any prior wave's test suite. This ensures the `@maturion/ai-centre` package remains continuously deliverable.

---

## 7. CS2 Approval Checkpoints Summary

| Checkpoint | Wave | Trigger | Blocking? |
|---|---|---|---|
| Wave 1 Gate — ACD + GRS + APS + AAD + Red QA | Wave 1 → 2 | All Step 1–5 artefacts submitted for CS2 review | **Hard stop** — Wave 2 cannot start |
| AAWP Gate (this document) | Wave 1 → 2 | This AAWP submitted for CS2 review | **Hard stop** — Wave 2 cannot start |
| Wave 3 Advisory Review | Wave 3 close | First live capability evidence presented | Quality gate — 1 business day; remediation if concerns raised |
| Wave 4 ISMS Navigator Confirmation | Wave 4 start | Foreman requests CS2 wave-assignment confirmation | **Blocking** — ISMS Navigator persona scope must be confirmed before implementation |
| Wave 8 Production-Readiness Certification | Wave 8 close | Complete evidence bundle submitted | **Hard stop** — AIMC not declared production-ready until CS2 sign-off |

---

## 8. Artefact Traceability

All AAWP wave plans are traceable to the prior Wave 1 artefacts as follows:

| AAWP Wave | Primary ACD Reference | Primary GRS Requirements | Primary APS Sections | Primary AAD Section |
|---|---|---|---|---|
| Wave 2 | ACD §5 Wave 2 | GRS-019, GRS-020, GRS-025, GRS-026, GRS-027 | APS §4, §6.1, §7.4 | AAD §4, §7 (Wave 2 row) |
| Wave 3 | ACD §5 Wave 3 | GRS-001, GRS-002, GRS-003, GRS-005, GRS-006, GRS-007, GRS-010, GRS-012, GRS-015, GRS-021 | APS §4, §5, §6.1, §7.1, §7.3, §8.1, §9.1 | AAD §5, §7 (Wave 3 row) |
| Wave 4 | ACD §5 Wave 4 | GRS-004, GRS-008, GRS-009, GRS-030, GRS-031 | APS §6.2, §7.2, §7.3, §7.5 | AAD §5.4, §7 (Wave 4 row) |
| Wave 5 | ACD §5 Wave 5 | GRS-006 (embeddings), GRS-030 | APS §6.2 | AAD §7 (Wave 5 row) |
| Wave 6 | ACD §5 Wave 6 | GRS-006 (doc-gen, image-gen), GRS-014 | APS §5.3, §6.1 | AAD §7 (Wave 6 row) |
| Wave 7 | ACD §5 Wave 7 | GRS-006 (deep-search) | APS §6.1 | AAD §7 (Wave 7 row) |
| Wave 8 | ACD §5 Wave 8, ACD §5 footnote | GRS-022, GRS-023 | APS §10.3 | AAD §7 (Wave 8 row) |

---

## 9. References

**Constitutional Canon** (direct authorities for this document):

| Document | Location | Role |
|---|---|---|
| `AIMC_STRATEGY.md` v1.0.0 | `governance/canon/AIMC_STRATEGY.md` | Constitutional authority for capability taxonomy, provider strategy, governance principles |
| `LIVING_AGENT_SYSTEM.md` v6.2.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` | Living Agent framework governing all builder agents executing AIMC waves |
| `WAVE_MODEL.md` | `governance/canon/WAVE_MODEL.md` | Wave lifecycle, phase transitions, wave/subwave definitions |
| `FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md` | `governance/canon/` | FM wave planning authority and artifact generation protocol |

**Input Artefacts (Steps 1–6)**:

| Document | Location | Role |
|---|---|---|
| ACD | `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md` | 8-wave plan (§5) — primary input for wave scope definitions |
| GRS | `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` | Requirement IDs cited per wave |
| APS | `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md` | Interface contracts cited per wave |
| AAD | `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md` | Wave delivery schedule (§7) — primary input for deliverable file lists |

**Agent Governance**:

| Document | Location | Role |
|---|---|---|
| `BUILDER_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` | `governance/checklists/` | Builder agent execution contract |
| `SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` | `governance/checklists/` | Specialist agent execution contract |
| Specialist Registry | `.agent-workspace/foreman-v2/knowledge/specialist-registry.md` | Agent registry used by Foreman v2 for delegation |

---

## 10. Acceptance Criteria

This AAWP is complete and ready for CS2 sign-off when all of the following are satisfied:

- [x] File exists at `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md`
- [x] All 8 waves are described in plain language (Section 4)
- [x] Each wave specifies deliverables, agent assignments, handover requirements, and test requirements
- [x] Agent assignments are clear for every wave — coordinator and builder roles named
- [x] CS2 approval checkpoints are identified (Sections 4 and 7)
- [x] Wave dependency chain is explicit (Section 5)
- [x] Cross-wave regression testing obligations are stated (Section 6)
- [x] All deliverable files are traceable to the ACD §5 wave plan and AAD §7 delivery schedule
- [x] GRS requirement IDs are cited in the traceability table (Section 8)
- [x] Document cites `AIMC_STRATEGY.md`, `LIVING_AGENT_SYSTEM.md` v6.2.0, `WAVE_MODEL.md` as direct authorities
- [x] Wave 8 Governance Certification extension is explicitly noted and traced to ACD §5 footnote
- [x] ISMS Navigator persona CS2 wave-confirmation flag is preserved from AAD
- [ ] CS2 review and sign-off received (required before Wave 2 execution begins)

---

*End of Document*

**Authority**: `governance/canon/AIMC_STRATEGY.md` v1.0.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0  
**Drafted**: 2026-02-23  
**Next Action**: CS2 review → sign-off → Wave 2 execution authorised
