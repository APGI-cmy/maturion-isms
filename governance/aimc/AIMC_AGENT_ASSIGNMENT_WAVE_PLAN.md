# AI Management Centre — Agent Assignment Wave Plan (AAWP)

**Document Type**: Foundation Artefact — Wave 1 Deliverable (Step 7); amended post-Wave 8 audit
**Status**: ACTIVE — Wave 9 CS2 sign-off recorded; Combined Execution Plan is authoritative
**Version**: 0.4.0
**Effective Date**: 2026-03-01
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

**Wave 9 Amendment Input**:
- `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` v1.0.0 (post-Wave 8 functionality audit)

**Combined Execution Plan Reference** (v0.3.0 addition):
- `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.4.0 — AIMC + LKIAC Combined Waved Execution Plan; authoritative execution sequence for all CL-* waves; supersedes AAWP standalone sequence for scheduling purposes

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

**Wave 9 Amendment (v0.2.0 — 2026-02-26)**: Following the successful delivery of all 8 planned waves (235 tests GREEN, zero failures), a post-production architecture audit (`governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` v1.0.0) identified five gaps that must be addressed before AIMC is fully production-ready as the sole governed AI integration layer. This amendment adds Wave 9 (11 subwaves) to the plan, covering episodic memory, self-learning loop migration, knowledge base governance, module integration for the 7 unwired modules, persona lifecycle management, and legacy escape remediation.

**Combined Execution Plan Amendment (v0.3.0 — 2026-03-01)**: The AIMC + LKIAC Combined Waved Execution Plan (`governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.4.0 (latest, incorporating CL-3.5, CL-13 D5/D6/D7 scope extensions, and CL-0/CL-1 COMPLETE status), produced by `foreman-v2-agent` session 075, amended through session 082) is now the **authoritative combined execution roadmap** for all remaining AIMC and LKIAC work. That plan supersedes this AAWP's standalone execution sequence for all CL-* combined waves, governing combined ordering and inter-programme dependencies. This AAWP remains the authoritative source for wave-level scope definitions, agent assignments, deliverables, and handover requirements. CS2 Wave 9 sign-off is formally recorded in this v0.3.0 amendment, clearing all Wave 9 subwaves to proceed per the Combined Execution Plan. This amendment resolves governance gap **GOV-006**.

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

### Wave 9 — Post-Audit Gap Remediation

**Status**: PENDING CS2 WAVE-START AUTHORISATION

**Context and Audit Reference**:
Wave 9 is triggered by the post-Wave 8 functionality audit (`governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` v1.0.0, 2026-02-26). The audit confirmed all 235 Wave 1–8 tests pass GREEN, but identified five architectural gaps that must be closed before AIMC is production-ready as the sole governed AI integration point for all 8 Maturion ISMS modules. Wave 9 consists of 11 subwaves grouped into four tracks that may partially execute in parallel according to the dependency rules below.

**Gap Summary (from audit)**:

| Priority | Audit Gap | Wave 9 Subwaves |
|---|---|---|
| P1 | Self-Learning Loop — legacy implementation not migrated to AIMC | 9.2, 9.4, 9.11 |
| P1 | Module Integration Layer — 7 of 8 modules not wired to AIMC gateway | 9.6, 9.7, 9.8, 9.9 |
| P2 | Episodic Memory (Tier 3) — not implemented | 9.1, 9.3 |
| P2 | Knowledge Base Inventory and ARC Approval Protocol — not documented | 9.2, 9.5 |
| P3 | Persona Lifecycle — missing personas, no versioning protocol | 9.10 |

**Wave 9 Execution Sequence**:

```
Track A — Foundation Schema (parallel, no dependencies)
  Wave 9.1 — Schema: Episodic Memory Table
  Wave 9.2 — Schema: Feedback Pipeline + ai_knowledge Amendment
    ↓
Track B — AIMC Package Extension (depends on Track A)
  Wave 9.3 — API: Episodic Memory Adapter (depends on 9.1)
  Wave 9.4 — API: Feedback Pipeline + ARC Endpoint (depends on 9.2)
  Wave 9.5 — Governance: KB Inventory + ARC Protocol (depends on 9.2)
    ↓
Track C — Module Integration (gateway stable — can start after 9.3/9.4/9.5 and 9.10)
  Wave 9.6 — Module Integration: xDetect + Risk (P1, existing personas)
  Wave 9.7 — Module Integration: PIT (new persona required)
  Wave 9.8 — Module Integration: Course Crafter + ISMS Navigator (P2)
  Wave 9.9 — Module Integration: Incident Intelligence + Maturity Roadmap (P2/P3)
    ↓
Track D — Lifecycle and Governance (parallel with Tracks A–B)
  Wave 9.10 — Persona Lifecycle (no dependencies — can run immediately)
  Wave 9.11 — Legacy Escape Remediation (depends on 9.3 and 9.4)
```

> **CS2 Wave 9 Pre-Authorisation Note**: No subwave of Wave 9 may begin until CS2 has reviewed and approved this AAWP amendment and issued explicit wave-start authorisation per POLC governance rules. This is a hard stop.

---

#### Wave 9.1 — Schema: Episodic Memory Table (`ai_episodic_events`)

**Audit Reference**: Gap 1 (§4.1), Recommended Sub-Issue §6.1  
**Scope Issue**: `[Wave 9.1]` — Schema: Episodic Memory Table  
**Track**: A (Foundation Schema) — no dependency

**Plain Language Summary**:
Creates the immutable, append-only `ai_episodic_events` Supabase table that will store significant AI interactions, decisions, and outcomes as a Tier 3 episodic memory log. This table has no UPDATE or DELETE RLS policies — records are permanent.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| Supabase migration `004_ai_episodic_memory.sql` | `packages/ai-centre/supabase/migrations/` | Immutable table: `id`, `organisation_id`, `session_id`, `user_id`, `agent_id`, `event_type`, `capability`, `summary`, `full_context`, `created_at` — no UPDATE or DELETE policies |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: schema structure, immutability (no `update()`/`delete()` operations), org/session scoping — all must fail RED before `schema-builder` starts |
| Schema Builder | `schema-builder` | Authors `004_ai_episodic_memory.sql` migration, RLS policies (INSERT + SELECT only), indexes |

**Handover / Merge / Test Requirements**:
- `qa-builder` delivers RED gate tests first; Foreman confirms all new tests RED before `schema-builder` starts
- Immutability test: no UPDATE or DELETE RLS policy exists on `ai_episodic_events`
- Scoping test: SELECT policy enforces `organisation_id` tenant isolation
- Migration executes cleanly on local Supabase instance
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

**CS2 Approval Checkpoint — Wave 9 Start**:
> Foreman confirms CS2 wave-start authorisation for Wave 9 is on record before issuing 9.1 wave-start to builders. This checkpoint covers the entire Wave 9 cluster.

---

#### Wave 9.2 — Schema: Feedback Pipeline Table + `ai_knowledge` Amendment

**Audit Reference**: Gap 2 (§4.2), Gap 3 (§4.3), Recommended Sub-Issue §6.1  
**Scope Issue**: `[Wave 9.2]` — Schema: Feedback Pipeline + ai_knowledge Amendment  
**Track**: A (Foundation Schema) — no dependency (parallel with 9.1)

**Plain Language Summary**:
Creates the ARC-gated `ai_feedback_events` table for the self-learning feedback pipeline, and amends the existing `ai_knowledge` table to add domain metadata and approval status columns required for the Knowledge Base Inventory and ARC Knowledge Promotion Protocol.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| Supabase migration `005_ai_feedback_pipeline.sql` | `packages/ai-centre/supabase/migrations/` | `ai_feedback_events` table with ARC approval status: `pending | approved | rejected` |
| Supabase migration `006_ai_knowledge_metadata.sql` | `packages/ai-centre/supabase/migrations/` | Adds `domain TEXT`, `module TEXT`, `standard_ref TEXT`, `freshness_date TIMESTAMPTZ`, `approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'retired'))` to `ai_knowledge` |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: `ai_feedback_events` schema and ARC status constraint; `ai_knowledge` new column presence and `approval_status` CHECK constraint |
| Schema Builder | `schema-builder` | Authors both migrations, RLS policies, and indexes |

**Handover / Merge / Test Requirements**:
- `qa-builder` delivers RED gate tests first; Foreman confirms all new tests RED
- Feedback status constraint test: `ai_feedback_events.approval_status` only accepts `pending`, `approved`, `rejected`
- Knowledge metadata test: `ai_knowledge` contains `domain`, `module`, `standard_ref`, `freshness_date`, `approval_status` columns
- Both migrations execute cleanly; zero errors
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

---

#### Wave 9.3 — API: Episodic Memory Adapter + MemoryLifecycle Integration

**Audit Reference**: Gap 1 (§4.1), Recommended Sub-Issue §6.2  
**Scope Issue**: `[Wave 9.3]` — API: Episodic Memory Adapter and MemoryLifecycle Integration  
**Track**: B (AIMC Package Extension) — **depends on Wave 9.1**

**Plain Language Summary**:
Implements the `EpisodicMemoryAdapter` class and integrates it into the `MemoryLifecycle.recordTurn()` method so that significant AI interactions are durably written to the `ai_episodic_events` table. Extends `AICentreConfig` with the new injection point.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `EpisodicMemoryAdapter` class | `packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts` | Supabase-backed, immutable append-only writes to `ai_episodic_events` |
| `EpisodicMemoryAdapter` interface | `packages/ai-centre/src/types/index.ts` | Type extension for new adapter |
| `AICentreConfig` extension | `packages/ai-centre/src/types/index.ts` | Add `episodicMemory: EpisodicMemoryAdapter` injection point |
| `MemoryLifecycle.recordTurn()` update | `packages/ai-centre/src/memory/MemoryLifecycle.ts` | Write significant turns to episodic log |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start (after 9.1 certified complete); supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: `EpisodicMemoryAdapter` immutability (no `update()`/`delete()` methods), schema correctness, org/session scoping, `recordTurn()` integration |
| API Builder | `api-builder` | Authors `EpisodicMemoryAdapter`, type extensions, `AICentreConfig` injection point, `MemoryLifecycle` update |

**Handover / Merge / Test Requirements**:
- Wave 9.1 must be Foreman-certified complete before 9.3 wave-start is issued
- `EpisodicMemoryAdapter` has no `update()` or `delete()` methods (immutability contract)
- `recordTurn()` test: significant turn is written to `ai_episodic_events` with correct `organisation_id`, `session_id`, `agent_id`, `capability`
- Dependency injection test: `AICentreConfig.episodicMemory` is optional; `AICentre` operates correctly when not provided
- Full regression: all prior wave tests (Waves 1–8 + 9.1) pass GREEN
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

---

#### Wave 9.4 — API: Feedback Pipeline + ARC Approval Endpoint

**Audit Reference**: Gap 2 (§4.2), Recommended Sub-Issue §6.2  
**Scope Issue**: `[Wave 9.4]` — API: Feedback Pipeline + ARC Approval Endpoint  
**Track**: B (AIMC Package Extension) — **depends on Wave 9.2**

**Plain Language Summary**:
Implements the governed self-learning feedback pipeline within the AIMC package. Replaces the legacy direct-to-Supabase feedback pattern with a formally typed `FeedbackPipeline` class and ARC-gated API endpoints.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `FeedbackPipeline` class | `packages/ai-centre/src/feedback/FeedbackPipeline.ts` | `submit()`, `listPending()`, `approve()`, `reject()` methods |
| Feedback types | `packages/ai-centre/src/types/index.ts` | `FeedbackEvent`, `FeedbackPipeline`, `ARCReviewStatus` |
| Feedback submit endpoint | `api/ai/feedback/submit.ts` | `POST /api/ai/feedback/submit` — accepts feedback events |
| ARC approval endpoint | `api/ai/feedback/approve.ts` | `POST /api/ai/feedback/approve` — CS2-gated; promotes feedback to approved status |
| Migration path documentation | `governance/aimc/AIMC_FEEDBACK_MIGRATION_PATH.md` | Documents how `ai_feedback_submissions` and `ai_learning_patterns` data should be migrated to the new schema |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start (after 9.2 certified complete); supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: `FeedbackPipeline` methods, ARC approval flow, CS2 gate enforcement on approve endpoint |
| API Builder | `api-builder` | Authors all deliverables above |
| Governance Liaison | `governance-liaison-isms-agent` | Reviews `AIMC_FEEDBACK_MIGRATION_PATH.md` for canon alignment |

**Handover / Merge / Test Requirements**:
- Wave 9.2 must be Foreman-certified complete before 9.4 wave-start is issued
- `submit()` test: feedback event is written to `ai_feedback_events` with `approval_status: 'pending'`
- `approve()` test: only CS2-authorised callers can set `approval_status: 'approved'`; unauthorised callers receive a 403
- `listPending()` test: returns only records with `approval_status: 'pending'`
- Full regression: all prior wave tests pass GREEN
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

**CS2 Approval Checkpoint — Wave 9.4 ARC Gate Review**:
> Foreman presents the ARC approval endpoint implementation and CS2-gate enforcement evidence to CS2 for review before the Wave 9.4 merge PR is merged. This is a security-sensitive capability — CS2 must confirm that the ARC approval gate is correctly implemented and that no unauthenticated caller can promote feedback to `approved` status.

---

#### Wave 9.5 — Governance: Knowledge Base Inventory + ARC Protocol

**Audit Reference**: Gap 3 (§4.3), Recommended Sub-Issue §6.2  
**Scope Issue**: `[Wave 9.5]` — Governance: Knowledge Base Inventory + ARC Protocol  
**Track**: B (AIMC Package Extension) — **depends on Wave 9.2**

**Plain Language Summary**:
Produces two new governance documents that define the canonical Knowledge Base Inventory and the ARC Knowledge Promotion Protocol. Also updates `KnowledgeRetriever` to filter by `approval_status = 'approved'` so that only ARC-approved knowledge is injected into AI context windows.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| Knowledge Base Inventory | `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md` | Canonical listing of all knowledge by domain, module, source, upload date, last-reviewed date, ARC approval status |
| ARC Knowledge Promotion Protocol | `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` | Step-by-step workflow: upload → ARC review → approve → tag freshness date → periodic refresh |
| `KnowledgeRetriever` approval filter | `packages/ai-centre/src/memory/MemoryLifecycle.ts` (or retriever class) | `retrieve()` filters by `approval_status = 'approved'`; pending/retired entries excluded from context |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start (after 9.2 certified complete); supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: `KnowledgeRetriever.retrieve()` returns only `approved` entries; `pending` and `retired` entries are excluded |
| API Builder | `api-builder` | Implements `KnowledgeRetriever` approval filter |
| Governance Liaison | `governance-liaison-isms-agent` | Authors `AIMC_KNOWLEDGE_BASE_INVENTORY.md` and `AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`; confirms canon alignment |

**Handover / Merge / Test Requirements**:
- Wave 9.2 must be Foreman-certified complete before 9.5 wave-start is issued
- Filter test: `KnowledgeRetriever.retrieve()` with a mix of `approved`, `pending`, and `retired` entries returns only `approved` records
- Governance documents committed to `governance/aimc/`
- Full regression: all prior wave tests pass GREEN
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

---

#### Wave 9.6 — Module Integration: xDetect + Risk Management

**Audit Reference**: Gap 4 (§4.4), Recommended Sub-Issue §6.3  
**Scope Issue**: `[Wave 9.6]` — Module Integration: xDetect and Risk Management  
**Track**: C (Module Integration) — **gateway must be stable; recommended after 9.3, 9.4, 9.5, and 9.10 complete**

**Plain Language Summary**:
Wires the xDetect and Risk Management modules to the AIMC gateway using their existing personas (`xdetect-advisor.md` and `risk-advisor.md`). Adds wiring invariant tests and AI gateway smoke tests matching the MAT module pattern. Deprecates any legacy AI invocations in both modules.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| xDetect AIMC wiring | `apps/xdetect/` (or `modules/xdetect/`) | `POST /api/ai/request` calls with `capability: 'advisory'` and `agent: 'xdetect-advisor'` |
| xDetect wiring invariant tests | `modules/xdetect/tests/wiring-invariants/` | Match MAT pattern (`modules/mat/tests/wiring-invariants/`) |
| xDetect AI gateway smoke tests | `modules/xdetect/tests/ai-gateway-smoke/` | Match MAT pattern |
| Risk Management AIMC wiring | `apps/risk-management/` (or `modules/risk-management/`) | `POST /api/ai/request` calls with `capability: 'advisory'` and `agent: 'risk-advisor'` |
| Risk Management wiring invariant tests | `modules/risk-management/tests/wiring-invariants/` | Match MAT pattern |
| Risk Management AI gateway smoke tests | `modules/risk-management/tests/ai-gateway-smoke/` | Match MAT pattern |
| Legacy AI path deprecation | Both modules | Remove or gate any direct AI provider calls or legacy Supabase function invocations |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: wiring invariants and smoke tests for both modules |
| API Builder | `api-builder` | Implements AIMC gateway wiring in both modules |
| UI Builder | `ui-builder` | Frontend integration for AI advisory UI components in both modules (if applicable) |
| Specialist Advisor | `risk-platform-agent` | Advisory review of Risk Management wiring for domain accuracy — consulted, not primary builder |

**Handover / Merge / Test Requirements**:
- Wiring invariant tests must confirm both modules call `POST /api/ai/request` and not any legacy AI provider directly
- Smoke test: a request through each module's AI advisory UI reaches the AIMC gateway and returns a valid response
- No legacy AI invocations remain in either module
- Full regression: all prior wave tests pass GREEN
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

---

#### Wave 9.7 — Module Integration: PIT (new persona required)

**Audit Reference**: Gap 4 (§4.4), Recommended Sub-Issue §6.3  
**Scope Issue**: `[Wave 9.7]` — Module Integration: PIT  
**Track**: C (Module Integration) — **depends on Wave 9.10 for persona creation**

**Plain Language Summary**:
Creates the `pit-advisor.md` persona and wires the PIT (Penetration Intelligence Tool) module to the AIMC gateway. PIT threat analysis capabilities are routed through `capability: 'analysis'` with the new PIT advisor persona.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `pit-advisor.md` persona | `packages/ai-centre/src/agents/pit-advisor.md` | New persona for PIT module threat analysis (see also Wave 9.10) |
| PIT AIMC wiring | `apps/pit/` (or `modules/pit/`) | `POST /api/ai/request` calls with `capability: 'analysis'` and `agent: 'pit-advisor'` |
| PIT wiring invariant tests | `modules/pit/tests/wiring-invariants/` | Match MAT pattern |
| PIT AI gateway smoke tests | `modules/pit/tests/ai-gateway-smoke/` | Match MAT pattern |
| Legacy path deprecation | PIT module | Remove or gate `maturion-ai-chat` and other legacy AI invocations in PIT |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start (after Wave 9.10 delivers `pit-advisor.md`); supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: PIT wiring invariants, smoke tests, persona load |
| API Builder | `api-builder` | Implements PIT AIMC gateway wiring; `pit-advisor.md` persona (or confirms delivery from Wave 9.10) |
| UI Builder | `ui-builder` | Frontend integration for PIT threat analysis AI components (if applicable) |
| Specialist Advisor | `pit-specialist` | Advisory review of `pit-advisor.md` persona content for domain accuracy |

**Handover / Merge / Test Requirements**:
- `pit-advisor.md` must exist and load correctly before PIT wiring tests can pass GREEN
- Wiring invariant tests confirm PIT does not call legacy AI providers directly
- `pit-specialist` advisory review of persona content completed and recorded in handover evidence
- Full regression: all prior wave tests pass GREEN
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

---

#### Wave 9.8 — Module Integration: Course Crafter + ISMS Navigator

**Audit Reference**: Gap 4 (§4.4), Recommended Sub-Issue §6.3  
**Scope Issue**: `[Wave 9.8]` — Module Integration: Course Crafter and ISMS Navigator  
**Track**: C (Module Integration) — **gateway must be stable; recommended after 9.3, 9.4, 9.5, and 9.10 complete**

**Plain Language Summary**:
Wires the Course Crafter and ISMS Navigator modules to the AIMC gateway using their existing personas. Course Crafter leverages `document-generation` and `video-generation` capabilities; ISMS Navigator uses `advisory`.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| Course Crafter AIMC wiring | `apps/course-crafter/` (or `modules/course-crafter/`) | `document-generation` (agent: `course-crafter-advisor`) and `video-generation` capability routing |
| Course Crafter wiring invariant tests | `modules/course-crafter/tests/wiring-invariants/` | Match MAT pattern |
| Course Crafter AI gateway smoke tests | `modules/course-crafter/tests/ai-gateway-smoke/` | Match MAT pattern |
| ISMS Navigator AIMC wiring | `apps/isms-navigator/` (or `modules/isms-navigator/`) | `capability: 'advisory'`, `agent: 'isms-navigator'` |
| ISMS Navigator wiring invariant tests | `modules/isms-navigator/tests/wiring-invariants/` | Match MAT pattern |
| ISMS Navigator AI gateway smoke tests | `modules/isms-navigator/tests/ai-gateway-smoke/` | Match MAT pattern |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: wiring invariants and smoke tests for both modules |
| API Builder | `api-builder` | Implements AIMC gateway wiring in both modules |
| UI Builder | `ui-builder` | Frontend integration for AI advisory UI components in both modules (if applicable) |

**Handover / Merge / Test Requirements**:
- Course Crafter wiring test: `document-generation` and `video-generation` routes reach AIMC gateway
- ISMS Navigator wiring test: advisory requests reach AIMC gateway with correct `agent: 'isms-navigator'`
- No legacy AI invocations remain in either module
- Full regression: all prior wave tests pass GREEN
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

---

#### Wave 9.9 — Module Integration: Incident Intelligence + Maturity Roadmap

**Audit Reference**: Gap 4 (§4.4), Recommended Sub-Issue §6.3  
**Scope Issue**: `[Wave 9.9]` — Module Integration: Incident Intelligence and Maturity Roadmap  
**Track**: C (Module Integration) — **depends on Wave 9.10 for new persona creation**

**Plain Language Summary**:
Creates personas for Incident Intelligence and Maturity Roadmap, then wires both modules to the AIMC gateway. Incident Intelligence uses `deep-search` for threat investigation; Maturity Roadmap uses `analysis` or `document-generation` for roadmap generation.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `incident-intelligence-advisor.md` persona | `packages/ai-centre/src/agents/incident-intelligence-advisor.md` | New persona for deep-search-backed incident intelligence (see also Wave 9.10) |
| `maturity-roadmap-advisor.md` persona | `packages/ai-centre/src/agents/maturity-roadmap-advisor.md` | New persona for maturity roadmap generation (see also Wave 9.10) |
| Incident Intelligence AIMC wiring | `apps/incident-intelligence/` (or `modules/incident-intelligence/`) | `capability: 'deep-search'`, `agent: 'incident-intelligence-advisor'` |
| Incident Intelligence wiring invariant tests | `modules/incident-intelligence/tests/wiring-invariants/` | Match MAT pattern |
| Incident Intelligence AI gateway smoke tests | `modules/incident-intelligence/tests/ai-gateway-smoke/` | Match MAT pattern |
| Maturity Roadmap AIMC wiring | `apps/maturity-roadmap/` (or `modules/maturity-roadmap/`) | `capability: 'analysis'` or `'document-generation'`, `agent: 'maturity-roadmap-advisor'` |
| Maturity Roadmap wiring invariant tests | `modules/maturity-roadmap/tests/wiring-invariants/` | Match MAT pattern |
| Maturity Roadmap AI gateway smoke tests | `modules/maturity-roadmap/tests/ai-gateway-smoke/` | Match MAT pattern |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start (after Wave 9.10 delivers new personas); supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: wiring invariants and smoke tests for both modules; new persona load tests |
| API Builder | `api-builder` | Implements AIMC gateway wiring in both modules; confirms persona files from Wave 9.10 |
| UI Builder | `ui-builder` | Frontend integration for AI advisory UI components in both modules (if applicable) |

**Handover / Merge / Test Requirements**:
- Wave 9.10 must have delivered `incident-intelligence-advisor.md` and `maturity-roadmap-advisor.md` before this wave starts
- Both personas load correctly via `PersonaLoader`
- Wiring invariant tests confirm both modules call AIMC gateway exclusively
- Full regression: all prior wave tests pass GREEN
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

---

#### Wave 9.10 — Persona Lifecycle: Missing Personas + Versioning + Governance Document

**Audit Reference**: Gap 5 (§4.5), Recommended Sub-Issue §6.4  
**Scope Issue**: `[Wave 9.10]` — Persona Lifecycle: missing personas, versioning, governance  
**Track**: D (Lifecycle and Governance) — **no dependencies; can execute immediately after CS2 Wave 9 authorisation**

**Plain Language Summary**:
Creates the three missing module personas, adds YAML front-matter version metadata to all existing personas, and produces the `AIMC_PERSONA_LIFECYCLE.md` governance document that defines the persona creation, review, and retirement protocol.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| `pit-advisor.md` (new) | `packages/ai-centre/src/agents/pit-advisor.md` | PIT module threat analysis persona |
| `incident-intelligence-advisor.md` (new) | `packages/ai-centre/src/agents/incident-intelligence-advisor.md` | Incident Intelligence deep-search persona |
| `maturity-roadmap-advisor.md` (new) | `packages/ai-centre/src/agents/maturity-roadmap-advisor.md` | Maturity Roadmap generation persona |
| YAML front-matter on all existing personas | `packages/ai-centre/src/agents/*.md` | Add `version`, `last_reviewed`, `owner`, `module` fields to `mat-advisor.md`, `risk-advisor.md`, `xdetect-advisor.md`, `course-crafter-advisor.md`, `isms-navigator.md` |
| Persona Lifecycle governance document | `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` | Persona creation, review, and retirement protocol |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start; supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: all 8 personas load via `PersonaLoader`; YAML front-matter validated for all personas |
| API Builder | `api-builder` | Authors all three new persona files; adds YAML front-matter to existing personas |
| Governance Liaison | `governance-liaison-isms-agent` | Authors `AIMC_PERSONA_LIFECYCLE.md`; confirms canon alignment |
| Specialist Advisors | `pit-specialist`, `risk-platform-agent`, `mat-specialist` | Advisory review of domain-specific persona content accuracy for their respective modules |

**Handover / Merge / Test Requirements**:
- All 8 personas (5 existing + 3 new) load correctly via `PersonaLoader.load(agentId)`
- YAML front-matter test: all persona files contain `version`, `last_reviewed`, `owner`, `module` fields
- `AIMC_PERSONA_LIFECYCLE.md` committed to `governance/aimc/`
- Full regression: all prior wave tests pass GREEN
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

---

#### Wave 9.11 — Legacy Escape Remediation

**Audit Reference**: §3.2 (Architecture Drift and Legacy AI Escape Detection), Recommended Sub-Issue §6.4  
**Scope Issue**: `[Wave 9.11]` — Legacy Escape Remediation  
**Track**: D (Lifecycle and Governance) — **depends on Waves 9.3 and 9.4 (AIMC replacement capabilities must exist)**

**Plain Language Summary**:
Audits and remediates all confirmed legacy AI escape paths in `apps/maturion-maturity-legacy/`. Each legacy Supabase Edge Function that bypasses the AIMC gateway is gated or deprecated. The client-side `OpenAIKeyManager.tsx` architectural violation is resolved. Legacy learning loop hooks are disconnected and replaced with AIMC `FeedbackPipeline` calls.

**Deliverables**:

| Deliverable | Location | Notes |
|---|---|---|
| Legacy Edge Function gating | `apps/maturion-maturity-legacy/supabase/functions/maturion-ai-chat/` | Gate or deprecate; route through AIMC gateway or mark as legacy-only with sunset date |
| Legacy RAG Edge Function gating | `apps/maturion-maturity-legacy/supabase/functions/search-ai-context/` | Gate or deprecate; route through AIMC gateway or mark as legacy-only with sunset date |
| Document processing Edge Function gating | `apps/maturion-maturity-legacy/supabase/functions/process-ai-document/` | Gate or deprecate |
| `OpenAIKeyManager.tsx` remediation | `apps/maturion-maturity-legacy/src/components/ai/OpenAIKeyManager.tsx` | Remove client-side key management; route key retrieval through server-side `ProviderKeyStore` |
| Legacy learning loop migration | `apps/maturion-maturity-legacy/src/agents/maturion/learning/learningLayer.ts` | Replace direct Supabase calls with AIMC `FeedbackPipeline.submit()` |
| Legacy feedback hooks migration | `apps/maturion-maturity-legacy/src/hooks/useAILearningFeedback.ts`, `useAIFeedbackSubmissions.ts` | Migrate to AIMC `FeedbackPipeline` API surface |
| Legacy escape remediation report | `governance/aimc/AIMC_LEGACY_ESCAPE_REMEDIATION_REPORT.md` | Documents each escape path, remediation action, and sunset/migration timeline |

**Agent Assignments**:

| Role | Agent | Responsibility |
|---|---|---|
| Wave Coordinator | `foreman-v2` | Issues wave-start (after 9.3 and 9.4 certified complete); supervises QA-Red; certifies wave complete |
| QA — Test Suite (pre-code) | `qa-builder` | RED gate tests: no direct AI provider calls remain in legacy app; `OpenAIKeyManager` does not expose keys to browser; `learningLayer.ts` calls AIMC `FeedbackPipeline` |
| API Builder | `api-builder` | Implements all legacy remediations and Edge Function gating |
| Governance Liaison | `governance-liaison-isms-agent` | Authors `AIMC_LEGACY_ESCAPE_REMEDIATION_REPORT.md`; confirms canon alignment |

**Handover / Merge / Test Requirements**:
- Waves 9.3 and 9.4 must be Foreman-certified complete before 9.11 wave-start is issued
- Security test: no provider API key is accessible from browser context after remediation
- Escape path test: no direct AI provider calls remain ungated in `maturion-maturity-legacy`
- Legacy hook migration test: `useAILearningFeedback.ts` and `useAIFeedbackSubmissions.ts` no longer write to legacy tables directly
- `AIMC_LEGACY_ESCAPE_REMEDIATION_REPORT.md` committed to `governance/aimc/`
- Full regression: all prior wave tests pass GREEN
- 100% GREEN; zero skipped; OPOJD gate passes
- Foreman certifies subwave complete; merge PR raised

**CS2 Approval Checkpoint — Wave 9 Closure (Post-Audit Certification)**:
> After all 11 Wave 9 subwaves are Foreman-certified complete, Foreman presents a Wave 9 completion evidence bundle to CS2. The bundle must include: all subwave OPOJD evidence, full regression test results (235 + all Wave 9 tests GREEN), `AIMC_LEGACY_ESCAPE_REMEDIATION_REPORT.md`, updated `AIMC_KNOWLEDGE_BASE_INVENTORY.md`, and `AIMC_PERSONA_LIFECYCLE.md`. CS2 reviews and signs off the Wave 9 closure. Only after CS2 sign-off is AIMC declared fully production-ready as the sole governed AI integration layer for all 8 Maturion ISMS modules.

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
  │   └── Final Gate: All 8 capabilities live; all stubs replaced; cost audit complete; CS2 certifies production-ready
  ↓
CS2 Wave 9 Authorisation Gate (AAWP v0.2.0 amendment sign-off)
  ↓
Wave 9 — Post-Audit Gap Remediation (11 subwaves)
  │
  ├── Track A — Foundation Schema (parallel, no dependencies)
  │     ├── Wave 9.1 (Episodic Memory Schema)
  │     └── Wave 9.2 (Feedback Pipeline Schema + ai_knowledge Amendment)
  │           ↓
  ├── Track B — AIMC Package Extension (depends on Track A)
  │     ├── Wave 9.3 (Episodic Memory Adapter) ← depends on 9.1
  │     ├── Wave 9.4 (Feedback Pipeline API + ARC Endpoint) ← depends on 9.2
  │     └── Wave 9.5 (KB Inventory + ARC Protocol) ← depends on 9.2
  │           ↓
  ├── Track C — Module Integration (depends on Track B complete + Wave 9.10)
  │     ├── Wave 9.6 (xDetect + Risk Management wiring) ← 9.3, 9.4, 9.5, 9.10
  │     ├── Wave 9.7 (PIT wiring) ← 9.10 (pit-advisor persona)
  │     ├── Wave 9.8 (Course Crafter + ISMS Navigator wiring) ← 9.3, 9.4, 9.5, 9.10
  │     └── Wave 9.9 (Incident Intelligence + Maturity Roadmap) ← 9.10 (new personas)
  │
  └── Track D — Lifecycle and Governance
        ├── Wave 9.10 (Persona Lifecycle) ← no dependencies; start immediately
        └── Wave 9.11 (Legacy Escape Remediation) ← depends on 9.3 + 9.4
              ↓
  CS2 Wave 9 Closure Gate: All 11 subwaves certified; AIMC fully production-ready
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
| Wave 9.1 | Waves 2–8 + Wave 9.1 tests |
| Wave 9.2 | Waves 2–8 + Waves 9.1–9.2 tests |
| Wave 9.3 | Waves 2–8 + Waves 9.1–9.3 tests |
| Wave 9.4 | Waves 2–8 + Waves 9.1–9.4 tests |
| Wave 9.5 | Waves 2–8 + Waves 9.1–9.5 tests |
| Wave 9.6 | Waves 2–8 + Waves 9.1–9.6 tests |
| Wave 9.7 | Waves 2–8 + Waves 9.1–9.7 tests |
| Wave 9.8 | Waves 2–8 + Waves 9.1–9.8 tests |
| Wave 9.9 | Waves 2–8 + Waves 9.1–9.9 tests |
| Wave 9.10 | Waves 2–8 + Waves 9.1–9.10 tests |
| Wave 9.11 | Waves 2–8 + Waves 9.1–9.11 full suite (Wave 9 closure run) |

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
| Wave 9 Authorisation Gate — AAWP v0.2.0 amendment | Wave 8 → 9 | AAWP amendment submitted for CS2 review | **Hard stop** — no Wave 9 subwave may start without CS2 sign-off |
| Wave 9.4 ARC Gate Review | Wave 9.4 close | ARC approval endpoint implementation and CS2-gate enforcement evidence presented | **Security gate** — CS2 must confirm correct ARC gating before merge |
| Wave 9 Closure — Post-Audit Production Certification | Wave 9.11 close | Complete Wave 9 evidence bundle: all 11 subwave OPOJD evidence, full regression, AIMC_LEGACY_ESCAPE_REMEDIATION_REPORT.md, AIMC_KNOWLEDGE_BASE_INVENTORY.md, AIMC_PERSONA_LIFECYCLE.md | **Hard stop** — AIMC not declared fully production-ready until CS2 sign-off |

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

**Wave 9 traceability** (audit-driven — traceable to `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` v1.0.0):

| AAWP Subwave | Audit Gap Reference | Audit Section | Primary Architecture Reference |
|---|---|---|---|
| Wave 9.1 | Gap 1 — Episodic Memory (Tier 3) | §4.1 | APS §7, AAD §5.7–5.8 |
| Wave 9.2 | Gap 2 — Self-Learning Loop; Gap 3 — KB Inventory | §4.2, §4.3 | APS §8 (implied), APS §6, AAD §5.10 |
| Wave 9.3 | Gap 1 — Episodic Memory (Tier 3) | §4.1 | APS §7, AAD §5.7–5.8 |
| Wave 9.4 | Gap 2 — Self-Learning Loop | §4.2 | APS §8 (implied), GRS (ARC review) |
| Wave 9.5 | Gap 3 — Knowledge Base Inventory and ARC Protocol | §4.3 | APS §6, AAD §5.10, migration 003 |
| Wave 9.6 | Gap 4 — Module Integration (xDetect, Risk) | §4.4 | AIMC_STRATEGY.md §3, GRS-001 |
| Wave 9.7 | Gap 4 — Module Integration (PIT) | §4.4 | AIMC_STRATEGY.md §3, GRS-001 |
| Wave 9.8 | Gap 4 — Module Integration (Course Crafter, ISMS Navigator) | §4.4 | AIMC_STRATEGY.md §3, GRS-001 |
| Wave 9.9 | Gap 4 — Module Integration (Incident Intelligence, Maturity Roadmap) | §4.4 | AIMC_STRATEGY.md §3, GRS-001 |
| Wave 9.10 | Gap 5 — Persona Lifecycle | §4.5 | AIMC_STRATEGY.md §7, APS §5 |
| Wave 9.11 | §3.2 — Architecture Drift and Legacy AI Escape Detection | §3.2 | AIMC_STRATEGY.md §3, GRS-001 |

---

## 9. References

**Constitutional Canon** (direct authorities for this document):

| Document | Location | Role |
|---|---|---|
| `AIMC_STRATEGY.md` v1.0.0 | `governance/canon/AIMC_STRATEGY.md` | Constitutional authority for capability taxonomy, provider strategy, governance principles |
| `LIVING_AGENT_SYSTEM.md` v6.2.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` | Living Agent framework governing all builder agents executing AIMC waves |
| `WAVE_MODEL.md` | `governance/canon/WAVE_MODEL.md` | Wave lifecycle, phase transitions, wave/subwave definitions |
| `FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md` | `governance/canon/` | FM wave planning authority and artifact generation protocol |

**Combined Execution Plan** (v0.3.0 addition):

| Document | Location | Version | Role |
|---|---|---|---|
| AIMC + LKIAC Combined Waved Execution Plan | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` | v1.4.0 | Supersedes AAWP standalone execution sequence for all CL-* waves; governs combined ordering, inter-programme dependencies, and CS2 checkpoints across AIMC and LKIAC programmes |

**Input Artefacts (Steps 1–6)**:

| Document | Location | Role |
|---|---|---|
| ACD | `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md` | 8-wave plan (§5) — primary input for wave scope definitions |
| GRS | `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` | Requirement IDs cited per wave |
| APS | `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md` | Interface contracts cited per wave |
| AAD | `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md` | Wave delivery schedule (§7) — primary input for deliverable file lists |

**Wave 9 Input Artefact**:

| Document | Location | Role |
|---|---|---|
| Wave 9 Functionality Audit | `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` v1.0.0 | Post-Wave 8 architecture audit — primary input for all Wave 9 subwave scope definitions; identifies five gaps (§4) and 11 recommended sub-issues (§6) |

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
- [x] CS2 review and sign-off received (required before Wave 2 execution begins)

**Wave 9 Amendment (v0.2.0) — additional criteria for CS2 Wave 9 sign-off**:

- [x] AAWP amended to v0.2.0 with Wave 9 amendment context and audit reference documented (Section 1)
- [x] All 11 Wave 9 subwaves described with plain-language summary, deliverables, agent assignments, and test requirements (Section 4)
- [x] Wave 9 execution sequence (four tracks) and inter-subwave dependencies are explicit (Section 4 Wave 9 header and Section 5)
- [x] Wave 9 cross-wave regression rows added to cross-wave testing obligations (Section 6)
- [x] Wave 9 CS2 approval checkpoints added: Wave 9 Authorisation Gate, Wave 9.4 ARC Gate, Wave 9 Closure (Section 7)
- [x] Wave 9 artefact traceability table links each subwave to its audit gap reference, audit section, and architecture reference (Section 8)
- [x] `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` v1.0.0 cited as Wave 9 input artefact (Section 9)
- [x] CS2 review and sign-off received for Wave 9 execution start (recorded 2026-03-01 — v0.3.0 amendment)

---

*End of Document*

**Owner**: `governance-liaison-isms-agent`  
**Authority**: `governance/canon/AIMC_STRATEGY.md` v1.0.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0  
**Drafted**: 2026-02-23 | **Amended**: 2026-02-26 (v0.2.0 — Wave 9 scope added) | **Amended**: 2026-03-01 (v0.3.0 — Wave 9 CS2 sign-off recorded; Combined Execution Plan reference added; GOV-006 resolved) | **Amended**: 2026-03-01 (v0.4.0 — Combined Execution Plan reference updated to v1.4.0; CL-0/CL-1 COMPLETE noted)  
**Next Action**: Wave 9 execution authorised and in progress — CL-0 COMPLETE, CL-1 COMPLETE, CL-2 through CL-15 per AIMC + LKIAC Combined Execution Plan (`governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.4.0)
