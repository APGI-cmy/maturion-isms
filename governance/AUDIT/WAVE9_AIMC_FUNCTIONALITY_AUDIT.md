# AIMC Functionality Audit — Wave 9 Scoping Report

**Document Type**: Governance Audit Artefact  
**Status**: FINAL  
**Version**: 1.0.0  
**Date**: 2026-02-26  
**Produced By**: foreman-v2-agent (Wave 9 Scoping, Issue #[Wave 9 Scoping])  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Location**: `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md`  
**Scope**: All AIMC capability waves 1–8, post-production architecture review  

---

## 1. Executive Summary

The AIMC package (`packages/ai-centre/`) has successfully delivered all 8 planned capability waves. All 235 automated tests pass across 32 test files (100% GREEN, zero skipped, zero failures). The core gateway, routing, adapters, memory, personas, telemetry, and knowledge retrieval subsystems are implemented and tested.

However, architectural review reveals five significant gaps that must be addressed in Wave 9 before AIMC can be considered fully production-ready as the sole governed AI integration layer for all Maturion ISMS modules:

| Priority | Gap | Risk Level |
|---|---|---|
| P1 | Self-Learning Loop — legacy implementation not migrated to AIMC | HIGH |
| P1 | Module Integration Layer — only MAT is wired to AIMC; all others bypass it | HIGH |
| P2 | Episodic Memory (Tier 3) — not implemented | MEDIUM |
| P2 | Knowledge Base Inventory and ARC Approval Protocol — not documented | MEDIUM |
| P3 | Persona Lifecycle — personas defined but modules not wired to use them | MEDIUM |

---

## 2. Test Suite Audit Results

### 2.1 Full Regression Suite — Wave 8+

**Run date**: 2026-02-26  
**Command**: `npm test` (vitest, root config `vitest.config.ts`)  
**Result**: ✅ **235 tests passed, 0 failed, 0 skipped — 32 test files**

| Test File | Scope | Wave | Result |
|---|---|---|---|
| `packages/ai-centre/src/__tests__/integration/wave4-cst.test.ts` | CST — Embeddings + RAG baseline | Wave 4 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/integration/wave5-cst.test.ts` | CST — Embeddings capability | Wave 5 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/integration/wave6-cst.test.ts` | CST — Document/Image generation | Wave 6 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/integration/wave7-cst.test.ts` | CST — Deep search, persona, risk adapters | Wave 7 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/integration/wave8-cst.test.ts` | CST — Video generation (Runway), Algorithm execution (OpenAI o3) | Wave 8 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/gateway/AICentre.test.ts` | AICentre gateway unit tests | All waves | ✅ GREEN |
| `packages/ai-centre/src/__tests__/memory/MemoryLifecycle.test.ts` | MemoryLifecycle — session + persistent | Wave 4 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/memory/MemoryLifecycle.rag.test.ts` | MemoryLifecycle — RAG/knowledge retrieval | Wave 5 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/memory/PersistentMemoryAdapter.test.ts` | PersistentMemoryAdapter — Supabase-backed | Wave 3 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/memory/SessionMemoryStore.test.ts` | SessionMemoryStore — in-memory, token-pruned | Wave 2 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/adapters/ProviderAdapter.contract.test.ts` | All 5 adapters — contract compliance | Waves 2–8 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/adapters/OpenAIAdapter.embeddings.test.ts` | OpenAI embeddings endpoint | Wave 5 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/routing/CapabilityRouter.test.ts` | CapabilityRouter — provider priority | Wave 2 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/routing/ProviderHealthRegistry.test.ts` | ProviderHealthRegistry — health state machine | Wave 2 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` | PersonaLoader — load, list, path traversal guard | Wave 7 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/keys/ProviderKeyStore.test.ts` | ProviderKeyStore — key resolution from env | Wave 1 | ✅ GREEN |
| `packages/ai-centre/src/__tests__/telemetry/TelemetryWriter.test.ts` | TelemetryWriter — immutable write, no update/delete | Wave 3 | ✅ GREEN |
| `api/ai/request.test.ts` | POST /api/ai/request serverless handler | Wave 6 gap | ✅ GREEN |
| `modules/mat/tests/...` (14 test files) | MAT module — wiring invariants, security, offline, mobile, AI integration | MAT | ✅ GREEN |

**Conclusion**: All Wave 1–8 regression tests pass. No test debt. No skipped tests. No deprecation warnings detected during run.

---

## 3. Module Integration Crosscheck

### 3.1 AIMC Gateway (`ai.request()` / `POST /api/ai/request`) Usage by Module

The AIMC gateway pattern requires modules to call `POST /api/ai/request` (the Vercel serverless handler) rather than invoking AI providers directly or calling legacy Supabase Edge Functions.

| Module | AIMC Gateway Wired | Evidence | Status |
|---|---|---|---|
| **MAT** (Manual Auditing Tool) | ✅ YES | `modules/mat/tests/wiring-invariants/` — tests MAT-T-0084 through MAT-T-0092 assert AIMC gateway wiring; `api/ai/request.ts` delivered and tested | **ACTIVE** |
| **PIT** (Penetration Intelligence Tool) | ❌ NO | `apps/pit/tests/` exists but contains no AIMC gateway tests; no `ai.request()` usage found in PIT source | **NOT WIRED** |
| **xDetect** | ❌ NO | No AIMC gateway calls found in xDetect module; `xdetect-advisor` persona exists but is unused | **NOT WIRED** |
| **Risk Management** | ❌ NO | No AIMC gateway calls found in risk-management module; `risk-advisor` persona exists but is unused | **NOT WIRED** |
| **Course Crafter** | ❌ NO | No AIMC gateway calls found in course-crafter module; `course-crafter-advisor` persona exists but is unused | **NOT WIRED** |
| **ISMS Navigator** | ❌ NO | No AIMC gateway calls found; `isms-navigator` persona exists but is unused | **NOT WIRED** |
| **Incident Intelligence** | ❌ NO | No AIMC gateway calls found; module scaffold only | **NOT WIRED** |
| **Maturity Roadmap** | ❌ NO | No AIMC gateway calls found; module scaffold only | **NOT WIRED** |

**Summary**: Only 1 of 8 ISMS modules (MAT) is actively wired to the AIMC gateway. Seven modules bypass the gateway entirely.

### 3.2 Architecture Drift and Legacy AI Escape Detection

The following files and patterns represent confirmed or potential AIMC governance escape points — places where the production core can be bypassed or where modules may revert to legacy AI integration:

| Location | Pattern | Risk | Classification |
|---|---|---|---|
| `apps/maturion-maturity-legacy/supabase/functions/maturion-ai-chat/` | Supabase Edge Function invokes AI providers directly (OpenAI, Anthropic) without going through AIMC gateway | HIGH | **LEGACY ESCAPE — ACTIVE** |
| `apps/maturion-maturity-legacy/supabase/functions/search-ai-context/` | Supabase Edge Function performs vector search and AI chat outside AIMC | HIGH | **LEGACY ESCAPE — ACTIVE** |
| `apps/maturion-maturity-legacy/supabase/functions/process-ai-document/` | Document processing invokes AI outside AIMC gateway | MEDIUM | **LEGACY ESCAPE — ACTIVE** |
| `apps/maturion-maturity-legacy/src/components/ai/OpenAIKeyManager.tsx` | Client-side component manages OpenAI API key directly — keys potentially exposed to browser | HIGH | **ARCHITECTURAL VIOLATION** |
| `apps/maturion-maturity-legacy/src/agents/maturion/learning/learningLayer.ts` | Reads/writes `ai_learning_patterns` and `ai_feedback_submissions` directly — bypasses AIMC | HIGH | **LEGACY LEARNING LOOP — NOT MIGRATED** |
| `apps/maturion-maturity-legacy/src/hooks/useAILearningFeedback.ts` | UI hook wired to legacy `ai_feedback_log` table directly | MEDIUM | **LEGACY ESCAPE** |
| `apps/maturion-maturity-legacy/src/hooks/useAIFeedbackSubmissions.ts` | UI hook wired to legacy `ai_feedback_submissions` table directly | MEDIUM | **LEGACY ESCAPE** |

**Note**: The `apps/maturion-maturity-legacy/` app is identified by its directory name as a legacy application. The transition plan to `apps/maturity/` (canonical MAT target) must ensure none of these patterns are carried forward.

---

## 4. Gap Analysis — Wave 9 Scope

### 4.1 Gap 1: Episodic Memory (Tier 3) — NOT IMPLEMENTED

**Severity**: MEDIUM  
**Architecture reference**: APS §7, AAD §5.7–5.8, memory architecture Tier 3  

#### What exists
- `SessionMemoryStore` — in-memory, session-scoped, pruned by token budget, not persisted
- `PersistentMemoryAdapter` — Supabase-backed, org-scoped, mutable, expiry-supported (`ai_memory` table)
- `MemoryLifecycle` — assembles context window from persona, persistent memory, session memory, and RAG

#### What is missing
The architecture specifies a **Tier 3 Episodic Memory layer** — an immutable, append-only event log of significant AI interactions, decisions, and outcomes that enables AI self-awareness over time. This is distinct from:
- Session memory (volatile, within-session context window)
- Persistent memory (mutable, organisational facts)

Episodic memory records would capture: *what was decided, when, by which agent, in response to what event, with what outcome* — enabling the AI to reason about its own history.

#### Required Wave 9 deliverables
- New Supabase migration: `004_ai_episodic_memory.sql` — immutable append-only table (`ai_episodic_events`) with columns: `id`, `organisation_id`, `session_id`, `user_id`, `agent_id`, `event_type`, `capability`, `summary`, `full_context`, `created_at` — **no UPDATE or DELETE policies**
- New `EpisodicMemoryAdapter` class in `packages/ai-centre/src/memory/`
- New `EpisodicMemoryAdapter` interface in `packages/ai-centre/src/types/index.ts`
- Integration into `MemoryLifecycle.recordTurn()` — significant turns written to episodic log
- RED QA gate before implementation: tests must verify immutability (no `update()`/`delete()` methods), correct schema, and correct org/session scoping
- `AICentreConfig` extended with `episodicMemory: EpisodicMemoryAdapter` injection point

---

### 4.2 Gap 2: Self-Learning Loop — LEGACY, NOT MIGRATED

**Severity**: HIGH  
**Architecture reference**: APS §8 (implied), governance — ARC review pipeline  

#### What exists (legacy, to be migrated)
- `apps/maturion-maturity-legacy/src/agents/maturion/learning/learningLayer.ts` — reads and writes `ai_learning_patterns` and `ai_feedback_submissions` directly via Supabase client, with no AIMC governance gate
- `apps/maturion-maturity-legacy/src/hooks/useAIFeedbackSubmissions.ts` and `useAILearningFeedback.ts` — UI hooks consuming legacy tables
- Legacy UI components: `AIFeedbackInterface.tsx`, `FeedbackDashboard.tsx`, `PatternRecognitionDashboard.tsx`, `SuperuserLearningDashboard.tsx` — all wired to legacy tables

#### What is missing
A formally governed **Self-Learning Loop** within the AIMC package that:
1. Captures user feedback events (positive/negative/corrections) via `AICentre.request()` response objects
2. Writes feedback to a new `ai_feedback_events` table (distinct from legacy `ai_feedback_submissions`)
3. Applies ARC (Adaptive Review Committee) approval before any pattern is promoted to the live knowledge base
4. Provides a `FeedbackPipeline` class in `packages/ai-centre/src/` with `submit()`, `listPending()`, `approve()`, `reject()` methods
5. Exposes a typed API surface (not direct Supabase client calls from the UI)

#### Required Wave 9 deliverables
- New Supabase migration: `005_ai_feedback_pipeline.sql` — `ai_feedback_events` table with ARC approval status column (`pending | approved | rejected`)
- New `FeedbackPipeline` class in `packages/ai-centre/src/feedback/`
- New types in `packages/ai-centre/src/types/`: `FeedbackEvent`, `FeedbackPipeline`, `ARCReviewStatus`
- ARC approval endpoint: `POST /api/ai/feedback/approve` (CS2-gated)
- Migration path: document how existing `ai_feedback_submissions` and `ai_learning_patterns` data should be migrated to the new schema
- RED QA gate before implementation

---

### 4.3 Gap 3: Knowledge Base Inventory and ARC Approval Protocol — NOT DOCUMENTED

**Severity**: MEDIUM  
**Architecture reference**: APS §6, AAD §5.10, migration `003_ai_knowledge.sql`  

#### What exists
- `packages/ai-centre/supabase/migrations/003_ai_knowledge.sql` — `ai_knowledge` table with `organisation_id`, `content`, `source`, `embedding` fields, RLS-protected
- `KnowledgeRetriever` interface in types — `retrieve(query, organisationId, limit)` method
- RAG integration in `MemoryLifecycle.assembleContextWindow()` — knowledge entries retrieved and injected as context

#### What is missing
1. **Domain/module/standard metadata** on `ai_knowledge` entries — the current schema has no `domain`, `module`, `standard_ref`, `freshness_date`, or `approval_status` columns. It is impossible to audit which knowledge is loaded for which module or verify freshness.
2. **Knowledge Base Inventory document** — a canonical listing of all uploaded knowledge, organised by domain (MAT, PIT, xDetect, risk, compliance standards), with source, upload date, last-reviewed date, and gap identification.
3. **ARC Knowledge Promotion Protocol** — a documented workflow for how new knowledge documents are: (a) uploaded, (b) reviewed by ARC, (c) approved for promotion to the live KB, (d) tagged with freshness date, and (e) periodically refreshed.

#### Required Wave 9 deliverables
- Schema amendment to `ai_knowledge` table: add `domain TEXT`, `module TEXT`, `standard_ref TEXT`, `freshness_date TIMESTAMPTZ`, `approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'retired'))`
- New governance document: `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md` — canonical listing with ARC approval status per entry
- New governance document: `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` — step-by-step workflow for knowledge promotion
- RED QA gate: tests verifying schema fields and `KnowledgeRetriever.retrieve()` filters by `approval_status = 'approved'`

---

### 4.4 Gap 4: Module Integration Layer — CRITICAL, 7 OF 8 MODULES UNWIRED

**Severity**: HIGH  
**Architecture reference**: AIMC_STRATEGY.md §3, GRS-001 (all modules MUST use gateway)  

#### What exists
- `api/ai/request.ts` — Vercel serverless gateway, fully implemented and tested (17 unit tests GREEN)
- MAT module wiring invariant tests confirming MAT is correctly wired

#### What is missing
Seven ISMS modules have no AIMC integration whatsoever. The AIMC strategy mandates that all modules use the gateway. The following module-specific integration tickets are required:

| Module | Required Integration Ticket | Persona Available | Priority |
|---|---|---|---|
| **PIT** | Wire PIT threat analysis UI to `POST /api/ai/request` with `capability: 'analysis'` and `agent: 'pit-advisor'` (new persona needed); deprecate `maturion-ai-chat` invocations | Needs creation | P1 |
| **xDetect** | Wire xDetect detection/advisory UI to AIMC gateway with `capability: 'advisory'` and `agent: 'xdetect-advisor'` | ✅ `xdetect-advisor.md` exists | P1 |
| **Risk Management** | Wire risk advisory UI to AIMC gateway with `capability: 'advisory'` and `agent: 'risk-advisor'` | ✅ `risk-advisor.md` exists | P1 |
| **Course Crafter** | Wire course content generation to AIMC gateway with `capability: 'document-generation'` and `agent: 'course-crafter-advisor'`; wire video generation to `capability: 'video-generation'` | ✅ `course-crafter-advisor.md` exists | P2 |
| **ISMS Navigator** | Wire ISMS advisory to AIMC gateway with `capability: 'advisory'` and `agent: 'isms-navigator'` | ✅ `isms-navigator.md` exists | P2 |
| **Incident Intelligence** | Wire deep search and analysis to AIMC gateway with `capability: 'deep-search'` and `agent: 'incident-intelligence-advisor'` (new persona needed) | Needs creation | P2 |
| **Maturity Roadmap** | Wire roadmap generation to AIMC gateway with `capability: 'analysis'` or `capability: 'document-generation'` | Needs creation | P3 |

Each module integration ticket must include:
- Wiring invariant tests (matching MAT pattern in `modules/mat/tests/wiring-invariants/`)
- AI gateway smoke test (matching `modules/mat/tests/ai-gateway-smoke/` pattern)
- Deprecation/removal of any legacy AI invocation paths for that module

---

### 4.5 Gap 5: Persona Lifecycle — PARTIALLY ADDRESSED

**Severity**: MEDIUM  
**Architecture reference**: AIMC_STRATEGY.md §7, APS §5  

#### What exists
Five application-facing advisor personas in `packages/ai-centre/src/agents/`:
- `mat-advisor.md` — MAT module, ACTIVE (wired to MAT via AIMC gateway)
- `risk-advisor.md` — Risk Management, IDLE (module not wired)
- `xdetect-advisor.md` — xDetect, IDLE (module not wired)
- `course-crafter-advisor.md` — Course Crafter, IDLE (module not wired)
- `isms-navigator.md` — ISMS Navigator, IDLE (module not wired)

#### What is missing
1. **`pit-advisor.md`** — PIT module persona not yet created
2. **`incident-intelligence-advisor.md`** — Incident Intelligence persona not yet created
3. **`maturity-roadmap-advisor.md`** — Maturity Roadmap persona not yet created
4. **Persona review and freshness protocol** — no documented process for keeping persona prompts aligned with evolving module capabilities or compliance standards
5. **Persona versioning** — no version field or last-reviewed date in persona files

#### Required Wave 9 deliverables
- Create `packages/ai-centre/src/agents/pit-advisor.md`
- Create `packages/ai-centre/src/agents/incident-intelligence-advisor.md`
- Create `packages/ai-centre/src/agents/maturity-roadmap-advisor.md`
- Add YAML front-matter header to each existing persona file: `version`, `last_reviewed`, `owner`, `module`
- New governance section: `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` — persona creation, review, and retirement protocol

---

## 5. Pre-Production Readiness Conditions

The following conditions must be met before AIMC can be declared fully production-ready as the sole governed AI integration point for all modules:

| Condition | Status | Required By |
|---|---|---|
| All Wave 1–8 tests GREEN (235 tests) | ✅ MET | Wave 8 closure |
| Gateway operational (`api/ai/request.ts`) | ✅ MET | Wave 6 gap |
| MAT module wired to AIMC gateway | ✅ MET | Wave 6 gap |
| All remaining 7 modules wired to AIMC gateway | ❌ NOT MET | Wave 9 |
| Self-Learning Loop migrated to AIMC package | ❌ NOT MET | Wave 9 |
| Episodic Memory (Tier 3) implemented | ❌ NOT MET | Wave 9 |
| Knowledge Base Inventory documented with ARC protocol | ❌ NOT MET | Wave 9 |
| Legacy AI escape paths in `maturion-maturity-legacy` eliminated or gated | ❌ NOT MET | Wave 9 |
| All module personas created and versioned | ❌ NOT MET | Wave 9 |

---

## 6. Recommended Wave 9 Sub-Issues

The following sub-issues should be created and prioritised for Wave 9. They are listed in recommended execution order (dependencies flow downward):

### 6.1 Foundation (must complete first)

**[Wave 9.1] Schema — Episodic Memory Table (`ai_episodic_events`)**
- Scope: Supabase migration `004_ai_episodic_memory.sql`
- Agents: `schema-builder`, reviewed by `qa-builder`
- Dependency: None

**[Wave 9.2] Schema — Feedback Pipeline Table (`ai_feedback_events`) + `ai_knowledge` Schema Amendment**
- Scope: Supabase migrations for ARC-gated feedback and knowledge metadata columns
- Agents: `schema-builder`, reviewed by `qa-builder`
- Dependency: None (can run parallel with 9.1)

### 6.2 AIMC Package Extension (after 9.1 and 9.2)

**[Wave 9.3] API — Episodic Memory Adapter and MemoryLifecycle Integration**
- Scope: `EpisodicMemoryAdapter` class, types, `AICentreConfig` injection, `MemoryLifecycle.recordTurn()` update
- Agents: `api-builder`, QA: `qa-builder`
- Dependency: Wave 9.1

**[Wave 9.4] API — Feedback Pipeline + ARC Approval Endpoint**
- Scope: `FeedbackPipeline` class, `POST /api/ai/feedback/submit`, `POST /api/ai/feedback/approve` (CS2-gated)
- Agents: `api-builder`, QA: `qa-builder`
- Dependency: Wave 9.2

**[Wave 9.5] Governance — Knowledge Base Inventory + ARC Protocol**
- Scope: `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md`, `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`, `KnowledgeRetriever` filtered by `approval_status`
- Agents: `api-builder` (code), `governance-liaison-isms-agent` (docs)
- Dependency: Wave 9.2

### 6.3 Module Integration (can start in parallel after gateway confirmed stable)

**[Wave 9.6] Module Integration — xDetect, Risk Management (P1 unwired modules with existing personas)**
- Scope: Wire both modules to AIMC gateway; wiring invariant tests; deprecate legacy paths
- Agents: `api-builder`, `ui-builder`, `qa-builder`
- Dependency: Gateway operational (already met)

**[Wave 9.7] Module Integration — PIT (requires new persona)**
- Scope: Create `pit-advisor.md`; wire PIT to AIMC gateway; tests
- Agents: `api-builder`, `ui-builder`, `qa-builder`
- Dependency: Gateway operational (already met)

**[Wave 9.8] Module Integration — Course Crafter, ISMS Navigator (P2)**
- Scope: Wire both modules; confirm `course-crafter-advisor.md` and `isms-navigator.md` are adequate; tests
- Agents: `api-builder`, `ui-builder`, `qa-builder`
- Dependency: Gateway operational (already met)

**[Wave 9.9] Module Integration — Incident Intelligence, Maturity Roadmap (P2/P3)**
- Scope: Create new personas; wire both modules; tests
- Agents: `api-builder`, `ui-builder`, `qa-builder`
- Dependency: Gateway operational (already met)

### 6.4 Lifecycle and Governance (can run in parallel)

**[Wave 9.10] Persona Lifecycle — Create missing personas + versioning + governance doc**
- Scope: `pit-advisor.md`, `incident-intelligence-advisor.md`, `maturity-roadmap-advisor.md`; YAML front-matter for all personas; `governance/aimc/AIMC_PERSONA_LIFECYCLE.md`
- Agents: `api-builder` (persona files), `governance-liaison-isms-agent` (lifecycle doc)
- Dependency: None

**[Wave 9.11] Legacy Escape Remediation — Audit and gate `maturion-maturity-legacy` AI paths**
- Scope: Identify all Supabase Edge Functions and UI components that bypass AIMC; gate or deprecate each; document migration path for `ai_feedback_submissions` / `ai_learning_patterns` data
- Agents: `api-builder`, reviewed by `qa-builder`
- Dependency: Waves 9.3, 9.4 (replacement AIMC capabilities must exist first)

---

## 7. Priorities — What Must Be Solved Before Further Module Integration

The following must be resolved before expanding AIMC integration to additional modules:

1. **Self-Learning Loop migration (9.3, 9.4)** — modules being wired to AIMC should not also depend on legacy `ai_feedback_submissions`. The feedback pipeline must be available in the AIMC package before further modules are wired.

2. **Knowledge Base metadata schema (9.2, 9.5)** — modules that consume RAG results should be receiving knowledge from an ARC-approved, domain-tagged knowledge base. The current `ai_knowledge` schema has no domain or approval metadata.

3. **Persona versioning (9.10)** — before wiring additional modules, all personas should carry version metadata so the review cycle is auditable.

Items 9.6–9.9 (module wiring) may proceed once items 9.1–9.5 and 9.10 are complete and Foreman-certified.

---

## 8. Appendix — Files Reviewed

| File / Directory | Relevance |
|---|---|
| `packages/ai-centre/src/` | AIMC core package — gateway, adapters, memory, personas, routing, telemetry, types |
| `packages/ai-centre/supabase/migrations/001–003` | Existing DB schema — memory, telemetry, knowledge |
| `packages/ai-centre/src/__tests__/` | Full test suite — all waves |
| `api/ai/request.ts` + `api/ai/request.test.ts` | Serverless gateway handler |
| `modules/mat/tests/wiring-invariants/` | MAT AIMC wiring evidence |
| `apps/maturion-maturity-legacy/src/agents/maturion/learning/learningLayer.ts` | Legacy learning loop |
| `apps/maturion-maturity-legacy/src/hooks/useAILearning*.ts` | Legacy UI hooks |
| `apps/maturion-maturity-legacy/src/components/ai/OpenAIKeyManager.tsx` | Client-side key management (architectural violation) |
| `apps/maturion-maturity-legacy/supabase/functions/maturion-ai-chat/` | Legacy AI chat Edge Function |
| `apps/maturion-maturity-legacy/supabase/functions/search-ai-context/` | Legacy RAG Edge Function |
| `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` | Wave plan (waves 1–8) |
| `governance/canon/AIMC_STRATEGY.md` | Constitutional AIMC strategy |
| `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md` | AIMC APS |
| `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md` | AIMC AAD |
| `modules/MODULE_MIGRATION_MAP.md` | Module canonical migration targets |

---

*Audit produced by foreman-v2-agent under CS2 authority (Johan Ras / @APGI-cmy). Wave 9 execution must not begin until CS2 has reviewed and approved this audit and issued formal wave-start authorisation per the AAWP and POLC governance model.*
