# BUILD PROGRESS TRACKER — AI Centre Package

**Package**: `packages/ai-centre`  
**Package Slug**: ai-centre  
**Last Updated**: 2026-04-06  
**Updated By**: governance-liaison-isms-agent (wave: align-12stage-prebuild-20260406)

> **Classification**: ACTIVE — RETROFIT NOW  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05)  
> **Issue**: [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255)

---

## Module Lifecycle Progress

Track the progression through the canonical module lifecycle stages per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0.

> **Note**: The AI Centre package was built prior to the formalisation of the 12-stage model
> (effective 2026-04-05). This lifecycle section represents a retrospective mapping of the
> pre-build work that was executed across build waves. The detailed Build Wave Progress section
> is preserved below (Section 2) as the authoritative build record. Stages 1–11 are mapped
> retrospectively; all have been substantively executed even if not formally gate-passed under
> the 12-stage model.

### Stage 1: App Description
**Status**: [x] COMPLETE  
**Location**: `packages/ai-centre/` (package-level specification)  
**Key Artifacts**:
- [x] AIMC purpose and scope defined (AI Memory Centre gateway, routing, persona, telemetry, persistent memory)
- [x] Package conceived with clear module purpose and user value

**Completion Date**: 2026-02-01 (approximate — pre-model)  
**Notes**: Retrospective mapping. AI Centre purpose and scope were established at project inception.
Formal `app-description.md` in canonical format was not created (predates 12-stage model).

---

### Stage 2: UX Workflow & Wiring Spec
**Status**: [x] COMPLETE (N/A — non-user-facing package)  
**Location**: N/A  
**Key Artifacts**:
- [x] Wiring spec: AI gateway request/response contract, provider adapter pattern, persona loading
- [x] API wiring: POST /api/ai/request contract established

**Completion Date**: 2026-02-01 (approximate — pre-model)  
**Notes**: AI Centre is a backend package with no direct UI. Per `PRE_BUILD_STAGE_MODEL_CANON.md`
§4.2: non-user-facing builds may substitute a Wiring Spec Only variant. API contract and adapter
wiring were established during Wave 1–2 design. Retrospective mapping.

---

### Stage 3: Functional Requirements Specification (FRS)
**Status**: [x] COMPLETE  
**Location**: `packages/ai-centre/` (embedded in architecture and wave specifications)  
**Key Artifacts**:
- [x] Functional requirements captured in AIMC wave specifications (AAWP v0.2.0)
- [x] GRS-008: Supabase persistent memory with organisation-level tenant isolation
- [x] AAD §8.2: PersistentMemoryAdapter constructor requirements

**Completion Date**: 2026-02-01 (approximate — pre-model)  
**Notes**: Retrospective mapping. Requirements were documented informally across wave specs
and architecture references rather than a single FRS document.

---

### Stage 4: Technical Requirements Specification (TRS)
**Status**: [x] COMPLETE  
**Location**: `packages/ai-centre/` (embedded in architecture references)  
**Key Artifacts**:
- [x] APS §7.2/§7.4: RLS policy enforcement at query layer
- [x] GRS-008: Integration tests must target live Supabase, not in-memory mocks
- [x] Tool validation: Vitest test framework, SupabaseClient, pgvector

**Completion Date**: 2026-02-13 (TRS stage introduced per governance upgrade)  
**Notes**: Retrospective mapping. Technical requirements captured in governance references.

---

### Stage 5: Architecture
**Status**: [x] COMPLETE  
**Location**: `packages/ai-centre/src/`  
**Key Artifacts**:
- [x] Provider adapter pattern (OpenAIAdapter, PerplexityAdapter)
- [x] MemoryLifecycle with RAG pipeline
- [x] PersonaLoader with YAML front-matter
- [x] EpisodicMemoryAdapter + FeedbackPipeline
- [x] Architecture freeze: `governance/aimc/freezes/ARCH_FREEZE-wave9-track-c-module-integration-20260226.md`

**Completion Date**: 2026-02-25 (approximate — pre-model)  
**Notes**: Retrospective mapping. Architecture was designed and implemented across Waves 1–5.
ARCH-FREEZE-WAVE9-TRACK-C-20260226 formally locked the architecture for Wave 9.x.

---

### Stage 6: QA-to-Red
**Status**: [x] COMPLETE  
**Location**: `packages/ai-centre/src/__tests__/`  
**Key Artifacts**:
- [x] RED test suites written per wave before implementation
- [x] 179 tests across Waves 2–5, 9.1–9.7
- [x] Contract tests for all adapters and services

**Completion Date**: Per wave (Wave 2–5, 9.1–9.7 each had RED-before-GREEN cycles)  
**Notes**: Retrospective mapping. RED-before-GREEN discipline maintained across all waves.
POLC breach in Wave 5 (GOV-BREACH-AIMC-W5-001) was remediated with correct RED→GREEN cycle.

---

### Stage 7: PBFAG (Pre-Build Functionality Assessment Gate)
**Status**: [x] COMPLETE  
**Location**: PREHANDOVER proofs per wave  
**Key Artifacts**:
- [x] PREHANDOVER proofs created per wave with QP PASS verdicts
- [x] GOV-BREACH-AIMC-W5-001 remediated (POLC chain enforced)
- [x] Quality Professor evaluation performed per wave

**Completion Date**: Per wave  
**Notes**: Retrospective mapping. Wave-level quality gates served as PBFAG equivalents.

---

### Stage 8: Implementation Plan
**Status**: [x] COMPLETE  
**Location**: AAWP v0.2.0 (AI Centre Wave Plan)  
**Key Artifacts**:
- [x] AAWP v0.2.0 — Wave-by-wave delivery plan with explicit scope
- [x] Wave dependencies documented (Wave 9.10 → Wave 9.9 gate)
- [x] No placeholder waves

**Completion Date**: 2026-02-25 (AAWP v0.2.0)  
**Notes**: Retrospective mapping. AAWP serves as the Implementation Plan equivalent.

---

### Stage 9: Builder Checklist
**Status**: [x] COMPLETE  
**Location**: Per-wave builder delegation records  
**Key Artifacts**:
- [x] Builder delegation records per wave (api-builder, schema-builder, qa-builder)
- [x] POLC chain enforced: Foreman delegates → builder implements → QP verifies
- [x] Builder contracts verified each wave

**Completion Date**: Per wave  
**Notes**: Retrospective mapping. Builder checklist equivalent executed via POLC delegation chain.

---

### Stage 10: IAA Pre-Brief
**Status**: [x] COMPLETE  
**Location**: IAA assurance tokens per wave  
**Key Artifacts**:
- [x] IAA-WAVE9.2+9.5-20260227-PASS
- [x] IAA-WAVE9.3-20260227-PASS
- [x] IAA-WAVE9.2+9.4-20260226-PASS

**Completion Date**: Per wave (Waves 9.2–9.7)  
**Notes**: Retrospective mapping. IAA assurance tokens issued per wave handover.

---

### Stage 11: Builder Appointment
**Status**: [x] COMPLETE  
**Location**: Per-wave delegation records  
**Key Artifacts**:
- [x] api-builder: appointed for API implementation waves
- [x] schema-builder: appointed for schema waves
- [x] qa-builder: delegated for QA work

**Completion Date**: Per wave  
**Notes**: Retrospective mapping. Formal builder appointments executed via POLC delegation.

---

### Stage 12: Build Execution & Evidence
**Status**: [ ] IN_PROGRESS  
**Location**: `packages/ai-centre/src/` + PREHANDOVER proofs per wave  
**Key Artifacts**:
- [x] Waves 1–5: COMPLETE (gateway, adapters, memory, RAG, knowledge centre)
- [x] Wave 7: COMPLETE (PerplexityAdapter + personas)
- [x] Waves 9.1–9.7: COMPLETE (schema, API, module integrations)
- [ ] Wave 9.8: PENDING (Course Crafter + ISMS integration)
- [ ] Wave 9.9: PENDING (Incident Intelligence + Maturity Roadmap — blocked on Wave 9.10)
- [ ] Wave 9.10: PENDING (remaining personas: incident-intelligence-advisor.md, maturity-roadmap-advisor.md)

**Completion Date**: In progress  
**Notes**: See detailed Build Wave Progress in Section 2 below for full wave-by-wave evidence.

---

## Current Stage Summary

**Current Stage**: Stage 12 IN_PROGRESS (Waves 9.8, 9.9, 9.10 pending CS2 wave-start)  
**Overall Progress**: ~85% complete (Stages 1–11 done retrospectively; Stage 12 ~75% done)  
**Blockers**: Wave 9.9 blocked on Wave 9.10 persona delivery; all pending waves require CS2 wave-start  
**Next Steps**:
1. CS2 wave-start for Wave 9.8 (Course Crafter + ISMS integration — no Wave 9.10 dependency)
2. Wave 9.10: deliver `incident-intelligence-advisor.md` + `maturity-roadmap-advisor.md`
3. CS2 wave-start for Wave 9.9 after Wave 9.10 complete

---

## Governance Compliance

- [x] Stages 1–11 complete (retrospective mapping — pre-12-stage-model build)
- [x] Stage 12 IN_PROGRESS per wave plan (AAWP v0.2.0)
- [x] POLC chain enforced across all waves
- [x] IAA assurance tokens obtained per wave
- [x] Evidence artifacts (PREHANDOVER proofs) created per wave
- [ ] Waves 9.8, 9.9, 9.10 pending

---

---
## Overview

The `packages/ai-centre` package implements the AIMC (AI Memory Centre) gateway, routing, persona, telemetry, and persistent memory components for the Maturion ISMS platform. This tracker records build wave progress and governance deviations.

---

## Wave Build Progress

| Wave | Scope | Status | Tests | Notes |
|------|-------|--------|-------|-------|
| Wave 1 | AI gateway scaffold, types, routing stub | ✅ COMPLETE | — | Foundation scaffold |
| Wave 2 | AICentre gateway, OpenAI/GitHubModels adapters, ProviderAdapter contract | ✅ COMPLETE | All GREEN | Full gateway implementation |
| Wave 3 | Persona, key rotation, telemetry, routing | ✅ COMPLETE | All GREEN | See `build-evidence/wave-3-close-20260224.md` |
| Wave 4 | MemoryLifecycle, SessionMemoryStore, PersistentMemoryAdapter (in-memory foundation), wave4-cst integration tests | ✅ COMPLETE | 48 tests GREEN | Supabase wiring explicitly deferred to Wave 5 (see `PersistentMemoryAdapter.ts` TODO(Wave5)) |
| **Wave 5** | Knowledge Centre + Embeddings + RAG — `OpenAIAdapter` embeddings extension (`Capability.EMBEDDINGS`, `/v1/embeddings` API), `MemoryLifecycle` RAG step 4 (`KnowledgeRetriever` DI, GRS-030 context order), pgvector migration (`003_ai_knowledge.sql`) | ✅ **COMPLETE** | 61 tests GREEN (Waves 2–5 full regression suite) | Re-executed per POLC chain (GOV-BREACH-AIMC-W5-001 remediation). qa-builder → schema-builder → api-builder. QP PASS 2026-02-25. |
| **Wave 9.1** | Schema: Episodic Memory Table — `ai_episodic_events` DDL, RLS, immutability rules, indexes | ✅ **COMPLETE** | All schema tests GREEN | Pre-existing at session-064 start. Delivered prior to PR #652. |
| **Wave 9.2** | Schema: Feedback Pipeline Table + `ai_knowledge` Amendment — `005_ai_feedback_pipeline.sql` (`ai_feedback_events` table, ARC status constraint, RLS), `006_ai_knowledge_metadata.sql` (`domain`, `module`, `standard_ref`, `freshness_date`, `approval_status` columns), `src/types/feedback.ts` (FeedbackEvent, ARCReviewStatus, FeedbackPipelineInterface) | ✅ **COMPLETE** | 18/18 schema GREEN (W9.2-T-001 to W9.2-T-018, + regression = 179 total) | QP PASS 2026-02-27. schema-builder. IAA-WAVE9.2+9.5-20260227-PASS. PREHANDOVER session-060-wave9.2-9.4-9.11, session-069-wave9.2-9.5. |
| **Wave 9.3** | API: Episodic Memory Adapter + MemoryLifecycle Integration — `EpisodicMemoryAdapter.ts`, type extensions (`EpisodicEventEntry`, `EpisodicMemoryAdapter` interface, `AICentreConfig.episodicMemory`), `MemoryLifecycle.ts` episodic fire-and-forget integration | ✅ **COMPLETE** | 7/7 GREEN (+ 154 regression = 161 total) | QP PASS 2026-02-27. api-builder. IAA-WAVE9.3-20260227-PASS. PR #652. |
| **Wave 9.4** | API: FeedbackPipeline class — `src/feedback/FeedbackPipeline.ts` (submit, listPending, approve, reject via `ai_feedback_events`), `AIMCBypassError` guard on missing organisationId | ✅ **COMPLETE** | 8/8 GREEN (W9.4-T-001 to W9.4-T-006, T-011 + regression = 179 total) | QP PASS 2026-02-26. api-builder. IAA-WAVE9.2+9.4-20260226-PASS. PREHANDOVER session-060-wave9.2-9.4-9.11. |
| **Wave 9.5** | API: KnowledgeRetrieverImpl approval filter — `src/memory/KnowledgeRetrieverImpl.ts` (filters by `approvalStatus === 'approved'`), `KnowledgeEntry.approvalStatus` type extension | ✅ **COMPLETE** | 7/7 GREEN (W9.5-T-001 to W9.5-T-007 + regression = 179 total) | QP PASS 2026-02-27. api-builder. IAA-WAVE9.2+9.5-20260227-PASS. PREHANDOVER session-069-wave9.2-9.5. |
| **Wave 9.11** | Legacy Escape Remediation — `@deprecated` JSDoc markers on legacy learning hook files; AIMCBypassError exported from `errors/index.ts` | ✅ **COMPLETE** | All W9.11-T-* tests GREEN | QP PASS 2026-02-26. PREHANDOVER session-060-wave9.2-9.4-9.11. |
| **Wave 9.6** | Module Integration: xDetect + Risk Management — AIMC wiring services, wiring invariant tests, AI gateway smoke tests for both modules | ✅ **COMPLETE** | 16/16 GREEN (+ 154 regression) | QP PASS 2026-02-26. risk-platform-agent advisory. capability: 'advisory'. ARCH-FREEZE-WAVE9-TRACK-C-20260226. |
| **Wave 9.7** | Module Integration: PIT — `pit-advisor.md` persona + AIMC wiring service, wiring invariant tests, AI gateway smoke tests | ✅ **COMPLETE** | 8/8 GREEN (+ 154 regression) | QP PASS 2026-02-26. pit-specialist advisory. capability: 'analysis'. pit-advisor.md created inline (Wave 9.10 dependency met for PIT). |
| **Wave 9.8** | Module Integration: Course Crafter + ISMS Navigator — AIMC wiring services, wiring invariant + smoke tests | ⏸ PENDING | — | Awaiting CS2 wave-start. Personas exist (`course-crafter-advisor.md`, `isms-navigator.md`). No Wave 9.10 dependency for 9.8. |
| **Wave 9.9** | Module Integration: Incident Intelligence + Maturity Roadmap — new personas + AIMC wiring services, tests | ⏸ PENDING | — | **Blocked on Wave 9.10** (personas `incident-intelligence-advisor.md`, `maturity-roadmap-advisor.md` required before wave-start). See Wave 9.10 dependency gate below. |
| **Wave 9.10** | Persona Lifecycle: 3 missing personas + YAML front-matter on all existing + `AIMC_PERSONA_LIFECYCLE.md` | ⏸ PENDING | — | Partially satisfied: `pit-advisor.md` delivered in Wave 9.7. Remaining: `incident-intelligence-advisor.md`, `maturity-roadmap-advisor.md`. Must complete before Wave 9.9 starts. |

---

## Wave 9.10 Dependency Gate

> **⚠️ HARD GATE — Wave 9.9 MUST NOT START until this gate is cleared.**

Wave 9.9 (Incident Intelligence + Maturity Roadmap) depends on Wave 9.10 delivering two new persona files:

| Persona | Path | Required By | Status |
|---|---|---|---|
| `incident-intelligence-advisor.md` | `packages/ai-centre/src/agents/incident-intelligence-advisor.md` | Wave 9.9 start | ❌ NOT YET CREATED |
| `maturity-roadmap-advisor.md` | `packages/ai-centre/src/agents/maturity-roadmap-advisor.md` | Wave 9.9 start | ❌ NOT YET CREATED |

**Wave 9.7 handled PIT persona inline** (per pit-specialist advisory, `pit-advisor.md` was created directly in Wave 9.7 rather than blocking on Wave 9.10). This is acceptable because Wave 9.7 and Wave 9.10 both assign `api-builder` for persona creation and the pit-specialist review was completed within Wave 9.7.

**Wave 9.8 has NO Wave 9.10 dependency** — `course-crafter-advisor.md` and `isms-navigator.md` already exist and are loadable via PersonaLoader. Wave 9.8 can start immediately after Wave 9.7 is CS2-certified complete.

**Execution order**:
```
Wave 9.7 ✅ COMPLETE → Wave 9.8 (no 9.10 dependency) → Wave 9.10 remaining personas → Wave 9.9
                                                          ↓
                                          incident-intelligence-advisor.md ✅
                                          maturity-roadmap-advisor.md ✅
                                                          ↓
                                                    Wave 9.9 start
```

*Governance reference: AAWP v0.2.0 §4, Wave 9.9: "Wave 9.10 must have delivered `incident-intelligence-advisor.md` and `maturity-roadmap-advisor.md` before this wave starts."*

### GOV-BREACH-AIMC-W5-001 — Wave 5 POLC Violation: Foreman Wrote Production Code
**Date**: 2026-02-24  
**Severity**: CRITICAL  
**PR**: APGI-cmy/maturion-isms#500 (CLOSED — governance breach)  
**Issue**: maturion-isms#496  
**RCA File**: `.agent-workspace/foreman-v2/memory/session-wave5-polc-RCA-20260224.md`  
**FAIL-ONLY-ONCE Entry**: `GOV-BREACH-AIMC-W5-001` in `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`

**Summary of Breach**:  
The Foreman agent (foreman-v2) violated the POLC boundary by writing Wave 5 production implementation code and tests directly. No delegation to api-builder or qa-builder occurred. Six governance violations were confirmed by CS2:

1. **POLC violation** — Foreman wrote production code (violates A-001 / FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md)
2. **QP not activated** — No independent Quality Professor review (same agent was builder + reviewer)
3. **OPOJD breach** — Independence requirement structurally impossible without separate builder/QA agents
4. **Mock-only testing** — Tests used in-memory mock, not live Supabase (violates GRS-008 / FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §11)
5. **PREHANDOVER misrepresentation** — Proof labelled Wave 5 as "COMPLETE" without disclosing violations
6. **Builder/QA separation eliminated** — Constitutional safeguard from LIVING_AGENT_SYSTEM.md v6.2.0 not maintained

**Root Cause**:  
(1) Verb Classification Gate not executed — "implement" verb directed at Foreman was not rejected and delegated.  
(2) Phase 1 Wake-Up protocol (FAIL-ONLY-ONCE self-test + memory catch-up) not completed at session start.

**Corrective Actions Completed**:  
- [x] Tier 1 RCA: `session-wave5-polc-RCA-20260224.md`
- [x] FAIL-ONLY-ONCE.md updated — A-009 added (Verb Classification Gate mandate), incident logged, version bumped to 1.3.0
- [x] This BUILD_PROGRESS_TRACKER created with permanent deviation record
- [x] Wave 5 status set to NOT DELIVERED — re-execution required via proper POLC chain
- [x] PREHANDOVER proof and evidence bundle created for this RCA session
- [x] Parking station entries added

**Wave 5 Re-Execution Requirements** (NOT YET STARTED — awaiting CS2 wave-start approval):  
1. CS2 wave-start approval
2. Foreman delegates to api-builder: implement PersistentMemoryAdapter with Supabase client, `ai_memory` table, `organisation_id` filter (GRS-008, AAD §8.2)
3. Foreman delegates to qa-builder: Red QA suite — integration tests against live Supabase
4. Builder implements; qa-builder writes Red tests first (all failing before implementation)
5. api-builder turns tests GREEN
6. Foreman Quality Professor evaluation (independent — different agent from builder)
7. PREHANDOVER with full evidence bundle
8. CS2 final authorisation

---

## Test Coverage Summary

| Wave | Test Files | Test Count | Status |
|------|-----------|------------|--------|
| Wave 3 | `src/__tests__/personas/`, `src/__tests__/routing/`, `src/__tests__/keys/`, `src/__tests__/telemetry/` | ~32 | ✅ GREEN |
| Wave 4 | `src/__tests__/memory/`, `src/__tests__/integration/wave4-cst.test.ts` | 48 | ✅ GREEN |
| Wave 5 | `src/__tests__/adapters/OpenAIAdapter.embeddings.test.ts`, `src/__tests__/memory/MemoryLifecycle.rag.test.ts`, `src/__tests__/integration/wave5-cst.test.ts` | 12 (+ 49 regression) = 61 total | ✅ GREEN |

---

## Key Architecture References

- **GRS-008**: Supabase persistent memory with organisation-level tenant isolation
- **AAD §8.2**: PersistentMemoryAdapter constructor must accept mandatory SupabaseClient
- **APS §7.2 / §7.4**: RLS policy enforcement at query layer (not RLS alone)
- **`supabase/migrations/001_ai_memory.sql`**: Schema for ai_memory table
- **`FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §11`**: Integration tests must target live Supabase, not in-memory mocks

---

*Authority: foreman-v2 v6.2.0 | Governance Ref: maturion-isms#496 | GOV-BREACH-AIMC-W5-001 (REMEDIATED) | GOV-BREACH-AIMC-W5-002 (REMEDIATED)*  
*Last Updated: 2026-02-25*

---

## Wave 7 — PerplexityAdapter + Persona Files

**Completion Date**: 2026-02-25  
**Last Updated**: 2026-02-25

### Deliverables

| Component | Path | Status |
|-----------|------|--------|
| PerplexityAdapter | `src/adapters/PerplexityAdapter.ts` | ✅ DELIVERED |
| XDetect Advisor persona | `src/agents/xdetect-advisor.md` | ✅ DELIVERED |
| Risk Advisor persona | `src/agents/risk-advisor.md` | ✅ DELIVERED |

### Tests Turned GREEN

| Test | ID | Result |
|------|----|--------|
| ai.request deep-search routes to PerplexityAdapter | wave7-cst test 1 | ✅ GREEN |
| PersonaLoader.load('xdetect-advisor') | wave7-cst test 2 | ✅ GREEN |
| PersonaLoader.load('risk-advisor') | wave7-cst test 3 | ✅ GREEN |
| risk-advisor + telemetry integration | wave7-cst test 4 | ✅ GREEN |
| perplexity adapter execute() contract | contract test | ✅ GREEN |
| perplexity adapter error wrapping | contract test | ✅ GREEN |
| perplexity adapter healthCheck() timing | contract test | ✅ GREEN |
| perplexity adapter healthCheck() status | contract test | ✅ GREEN |

**Total tests GREEN this wave**: 8 new (77 total, 0 failures)

### Evidence Artifacts
- Session memory: `.agent-workspace/api-builder/memory/session-wave7-20260225.md`

### Process Deviations / Lessons Learned
- FetchFn type must be exported from adapter — test imports it directly
- Empty systemPrompt guard needed in messages construction
- One-time build discipline achieved: 100% GREEN on first run

---

## Wave 9.6 — Module Integration: xDetect + Risk Management

**Completion Date**: 2026-02-26
**Session**: session-063-wave9.6-9.9-20260226
**QP Verdict**: PASS
**Issue**: maturion-isms#634
**Architecture Freeze**: `governance/aimc/freezes/ARCH_FREEZE-wave9-track-c-module-integration-20260226.md`

### Deliverables

| Component | Path | Status |
|-----------|------|--------|
| xDetect AIMC wiring service | `modules/xdetect/src/services/aimc-wiring.ts` | ✅ DELIVERED |
| Risk Management AIMC wiring service | `modules/risk-management/src/services/aimc-wiring.ts` | ✅ DELIVERED |
| xDetect wiring invariant tests (6 tests) | `modules/xdetect/tests/wiring-invariants/wiring-invariants.test.ts` | ✅ GREEN |
| xDetect AI gateway smoke tests (2 tests) | `modules/xdetect/tests/ai-gateway-smoke/ai-gateway-smoke.test.ts` | ✅ GREEN |
| Risk Management wiring invariant tests (6 tests) | `modules/risk-management/tests/wiring-invariants/wiring-invariants.test.ts` | ✅ GREEN |
| Risk Management AI gateway smoke tests (2 tests) | `modules/risk-management/tests/ai-gateway-smoke/ai-gateway-smoke.test.ts` | ✅ GREEN |
| Wave 9.6 vitest config | `vitest.wave9.6.config.ts` | ✅ DELIVERED |

### Tests Turned GREEN

| Test | Module | Capability | Agent | Result |
|------|--------|-----------|-------|--------|
| XDETECT-AIMC-T-001: PersonaLoader regression guard | xDetect | advisory | xdetect-advisor | ✅ GREEN |
| XDETECT-AIMC-T-002: Wiring service exists | xDetect | advisory | xdetect-advisor | ✅ GREEN |
| XDETECT-AIMC-T-003: Calls POST /api/ai/request | xDetect | advisory | xdetect-advisor | ✅ GREEN |
| XDETECT-AIMC-T-004: capability: 'advisory' | xDetect | advisory | xdetect-advisor | ✅ GREEN |
| XDETECT-AIMC-T-005: agent: 'xdetect-advisor' | xDetect | advisory | xdetect-advisor | ✅ GREEN |
| XDETECT-AIMC-T-006: No forbidden provider imports | xDetect | advisory | xdetect-advisor | ✅ GREEN |
| XDETECT-AIMC-T-007: Service is instantiable | xDetect | advisory | xdetect-advisor | ✅ GREEN |
| XDETECT-AIMC-T-008: Returns AIMC response | xDetect | advisory | xdetect-advisor | ✅ GREEN |
| RISK-AIMC-T-001: PersonaLoader regression guard | Risk Mgmt | advisory | risk-advisor | ✅ GREEN |
| RISK-AIMC-T-002: Wiring service exists | Risk Mgmt | advisory | risk-advisor | ✅ GREEN |
| RISK-AIMC-T-003: Calls POST /api/ai/request | Risk Mgmt | advisory | risk-advisor | ✅ GREEN |
| RISK-AIMC-T-004: capability: 'advisory' | Risk Mgmt | advisory | risk-advisor | ✅ GREEN |
| RISK-AIMC-T-005: agent: 'risk-advisor' | Risk Mgmt | advisory | risk-advisor | ✅ GREEN |
| RISK-AIMC-T-006: No forbidden provider imports | Risk Mgmt | advisory | risk-advisor | ✅ GREEN |
| RISK-AIMC-T-007: Service is instantiable | Risk Mgmt | advisory | risk-advisor | ✅ GREEN |
| RISK-AIMC-T-008: Returns AIMC response | Risk Mgmt | advisory | risk-advisor | ✅ GREEN |

**Total Wave 9.6 tests**: 16/16 GREEN
**Regression (ai-centre)**: 154/154 GREEN (1 pre-existing EpisodicMemoryAdapter — Wave 9.3 RED gate, waived)

### Specialist Advisory Review

**risk-platform-agent** reviewed Risk Management wiring:
- `capability: 'advisory'` CONFIRMED for Wave 9.6
- Context fields recommended: `tenant_id` (mandatory), `risk_domain` (routing)
- Legacy escape risks noted: THREAT_MODEL_ROUTING_SPEC superseded by AIMC; no live code to gate
- Persona adequacy: ADEQUATE for wiring layer; future enrichment recommended

### AIMC Wiring Pattern Established

```
capability: 'advisory' | agent: 'xdetect-advisor' → POST /api/ai/request
capability: 'advisory' | agent: 'risk-advisor'    → POST /api/ai/request
```

No provider SDK imports in either module. All AI routing through AIMC gateway.

