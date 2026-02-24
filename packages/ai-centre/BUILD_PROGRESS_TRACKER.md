# BUILD PROGRESS TRACKER — AI Centre Package

**Package**: `packages/ai-centre`  
**Package Slug**: ai-centre  
**Last Updated**: 2026-02-24  
**Updated By**: foreman-v2 (session-wave5-polc-RCA-20260224)

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
| **Wave 5** | PersistentMemoryAdapter Supabase wiring — replace in-memory store with Supabase client, ai_memory table, organisation_id tenant isolation per GRS-008 | 🔴 **NOT DELIVERED** | — | **PR #500 CLOSED — governance breach (see GOV-BREACH-AIMC-W5-001 below). Must be re-executed with proper builder delegation.** |

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
| Wave 5 | `src/__tests__/memory/PersistentMemoryAdapter.test.ts` (Red gate only — Supabase assertions absent) | 5 (4 pass in-memory, 1 constructor guard) | 🔴 NOT MET — in-memory tests do not satisfy GRS-008 |

---

## Key Architecture References

- **GRS-008**: Supabase persistent memory with organisation-level tenant isolation
- **AAD §8.2**: PersistentMemoryAdapter constructor must accept mandatory SupabaseClient
- **APS §7.2 / §7.4**: RLS policy enforcement at query layer (not RLS alone)
- **`supabase/migrations/001_ai_memory.sql`**: Schema for ai_memory table
- **`FULLY_FUNCTIONAL_DELIVERY_STANDARD.md §11`**: Integration tests must target live Supabase, not in-memory mocks

---

*Authority: foreman-v2 v2.2.0 | Governance Ref: maturion-isms#496 | GOV-BREACH-AIMC-W5-001*  
*Last Updated: 2026-02-24*
