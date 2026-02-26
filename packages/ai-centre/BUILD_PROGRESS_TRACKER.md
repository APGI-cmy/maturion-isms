# BUILD PROGRESS TRACKER — AI Centre Package

**Package**: `packages/ai-centre`  
**Package Slug**: ai-centre  
**Last Updated**: 2026-02-26  
**Updated By**: foreman-v2 (session-063-wave9.6-9.9-20260226)

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

---

## Governance Deviations

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

