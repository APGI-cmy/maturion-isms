# MAT Wave 8 — api-builder Delegation Specification

**Issued by**: foreman-v2-agent  
**Issued to**: `api-builder`  
**Date**: 2026-02-26  
**Wave**: MAT Wave 8 — AIMC Analysis Integration  
**Authority**: modules/mat/03-implementation-plan/implementation-plan.md §2.9 | ai-architecture.md v2.0.0  
**Status**: AUTHORIZED — qa-builder RED gate PASS (QP verified), AIMC Wave 4 GREEN, CS2 wave-start confirmed

> ⚠️ **MANDATORY PREFLIGHT FIRST**
> Read your agent contract file FIRST: `.github/agents/api-builder.md`
> Complete Phase 1 PREFLIGHT in full before any other action.
> Failure to execute Phase 1 first is a POLC breach and will result in QP FAIL.

---

## Step 0 — Mandatory Preflight (BLOCKING — execute before any other action)

Read your agent contract file FIRST: `.github/agents/api-builder.md`
Complete Phase 1 PREFLIGHT in full. Produce declared output for every step.
Record Phase 1 evidence in session memory.

---

## Gates Confirmed (all GREEN before this spec was issued)

- AIMC Wave 4 (Analysis Gateway): **GREEN** — `wave4-cst.test.ts` passing, `Capability.ANALYSIS` live in `OpenAIAdapter.ts`
- MAT Wave 7 (AIMC Advisory Integration): **COMPLETE** — `advisory-service.ts` delivered
- RED gate tests MAT-T-AIMC-011–020: **CONFIRMED RED** (7 failing, 3 regression guards GREEN)
- QP on qa-builder deliverable: **PASS**

---

## Architecture Reference

Read before writing any code:
- `modules/mat/02-architecture/ai-architecture.md` v2.0.0 §3 — AIMC Integration requirements
- `modules/mat/03-implementation-plan/implementation-plan.md` §2.9 — Wave 8 acceptance criteria
- `modules/mat/src/services/advisory-service.ts` — PATTERN TO FOLLOW exactly

---

## Context

MAT Wave 8 refactors two services from direct-provider pattern to AIMC gateway pattern.

Current state:
1. `criteria-management.ts` — `parseCriteriaDocument()` has comment "In production, this would call GPT-4 Turbo via AI Gateway" — no AIMC wiring yet.
2. `ai-scoring.ts` — `scoreMaturity()` references an `AI_ROUTING_TABLE` with hardcoded model names (`gpt-4-turbo`, `gpt-4o-mini`, etc.) at lines ~348–355.

Pattern to follow: `modules/mat/src/services/advisory-service.ts` (Wave 7) — uses `AICentre` from `../../../../packages/ai-centre/src/gateway/AICentre.js`, `Capability.ANALYSIS` from types, null memory collaborators, injectable dependencies.

---

## Deliverable 1 — `analysis-service.ts` (NEW FILE)

**Path**: `modules/mat/src/services/analysis-service.ts`

**Architecture mandate**: Create a dedicated analysis service that wraps the AIMC Analysis Gateway. Do NOT inline AIMC calls in `criteria-management.ts` or `ai-scoring.ts` directly — create this dedicated service layer.

**Pattern**: Follow `advisory-service.ts` exactly — same import structure, same null collaborators, same factory function, same AICentre construction.

**Imports required**:
```typescript
import { AICentre } from '../../../../packages/ai-centre/src/gateway/AICentre.js';
import {
  Capability,
  type AICentreResponse,
  type SessionMemoryStore,
  type PersistentMemoryAdapter,
} from '../../../../packages/ai-centre/src/types/index.js';
import { OpenAIAdapter } from '../../../../packages/ai-centre/src/adapters/OpenAIAdapter.js';
import { ProviderHealthRegistry } from '../../../../packages/ai-centre/src/routing/ProviderHealthRegistry.js';
import { ProviderKeyStore } from '../../../../packages/ai-centre/src/keys/ProviderKeyStore.js';
import { TelemetryWriter } from '../../../../packages/ai-centre/src/telemetry/TelemetryWriter.js';
```

**Exports required**:

1. `parseCriteriaDocument(sourceText: string, sections: number, aiCentre?: AICentre): Promise<ParseResult>`
   - Routes via `Capability.ANALYSIS`
   - Does NOT hold OpenAI API key — uses AICentre
   - On success: parses `result.content` (JSON) into `ParseResult` shape
   - On error/unavailable: graceful degradation (return empty criteria, `success: false`)
   - Import `ParseResult` from `'../types/index.js'`

2. `scoreMaturity(criterionId: string, evidence: EvidenceItem[], aiCentre?: AICentre): AIScoreResult | null`
   - Routes via `Capability.ANALYSIS`
   - Does NOT hold hardcoded model names — delegates to AIMC
   - On success: parses `result.content` (JSON) into `AIScoreResult` shape
   - On error: returns `null`
   - Import `EvidenceItem`, `AIScoreResult` from `'../types/index.js'`

**Factory function** (same pattern as advisory-service.ts):
```typescript
function buildAnalysisAICentre(): AICentre {
  const keyStore = new ProviderKeyStore();
  const healthRegistry = new ProviderHealthRegistry();
  const telemetryWriter = new TelemetryWriter();
  
  return new AICentre({
    routing: {
      routes: {
        [Capability.ADVISORY]: [],
        [Capability.ANALYSIS]: ['openai'],
        [Capability.EMBEDDINGS]: [],
        [Capability.DOCUMENT_GENERATION]: [],
        [Capability.IMAGE_GENERATION]: [],
        [Capability.DEEP_SEARCH]: [],
        [Capability.VIDEO_GENERATION]: [],
        [Capability.ALGORITHM_EXECUTION]: [],
      },
    },
    keyStore,
    telemetryWriter,
    persistentMemory: nullPersistentMemory,
    sessionMemory: nullSessionMemory,
    healthRegistry,
    adapters: [new OpenAIAdapter(keyStore)],
  });
}
```

---

## Deliverable 2 — Update `ai-scoring.ts`

**Path**: `modules/mat/src/services/ai-scoring.ts`

**Change required**: Remove the `AI_ROUTING_TABLE` (lines ~348–355 with hardcoded model names `gpt-4-turbo`, `gpt-4o-mini`, etc.) and all code that references it for scoring purposes.

The `scoreMaturity()` function at line ~53 and the `scoreMaturityWithFallback()` at line ~640 must be updated to either:
- Remove model references (scoreMaturity already takes a modelVersion param — can retain signature but no longer route via AI_ROUTING_TABLE)
- OR delegate to `analysis-service.ts` scoreMaturity for the AI-backed path

**Key constraint**: After your changes, `ai-scoring.ts` must NOT contain strings `'gpt-4-turbo'` or `'gpt-4o-mini'`. These are the strings that MAT-T-AIMC-016 asserts against.

**Note**: `criteria-management.ts` is already clean — no changes needed there for MAT-T-AIMC-015.

---

## Deliverable 3 — Update `BUILD_PROGRESS_TRACKER.md`

**Path**: `modules/mat/BUILD_PROGRESS_TRACKER.md`

Update the Wave 8 entry to show COMPLETE:
- Find: `- [ ] **Wave 8: AIMC Analysis Integration** — **BLOCKED — Awaiting AIMC Wave 4** (Analysis Gateway)`
- Replace with: `- [x] **Wave 8: AIMC Analysis Integration** — **COMPLETE** (AIMC Wave 4 confirmed; analysis-service.ts delivered, AI_ROUTING_TABLE removed from ai-scoring.ts)`

Also add a completion summary section for Wave 8.

---

## Acceptance Criteria (Foreman QP Review)

Foreman will evaluate ALL of the following:

- [ ] Phase 1 PREFLIGHT evidenced in session memory (preflight attestation block present)
- [ ] `modules/mat/src/services/analysis-service.ts` created
  - [ ] Exports `parseCriteriaDocument` function
  - [ ] Exports `scoreMaturity` function
  - [ ] Imports `AICentre` from ai-centre package (relative path)
  - [ ] Uses `Capability.ANALYSIS` for routing
  - [ ] No direct provider SDK imports (openai, @anthropic-ai)
  - [ ] No hardcoded API keys
- [ ] `ai-scoring.ts` updated
  - [ ] `AI_ROUTING_TABLE` removed (or gpt-4-turbo / gpt-4o-mini strings removed)
  - [ ] File does NOT contain 'gpt-4-turbo' or 'gpt-4o-mini'
  - [ ] All existing tests for ai-scoring still pass (no regressions in other test files)
- [ ] `BUILD_PROGRESS_TRACKER.md` Wave 8 entry updated to COMPLETE
- [ ] **All 10 MAT Wave 8 RED gate tests NOW PASS GREEN**
  - MAT-T-AIMC-011 through MAT-T-AIMC-020 all GREEN
- [ ] **ALL prior test suites remain GREEN (zero regressions)**
  - Total test count across all MAT test suites: 153+ tests GREEN
- [ ] TypeScript compiles — zero type errors
- [ ] Zero deprecation warnings
- [ ] Session memory present and complete
- [ ] PREHANDOVER proof present with full test run evidence (all 10 Wave 8 tests GREEN)
- [ ] Parking station entry appended

---

## Test Run Evidence Required

After implementation, run: `./node_modules/.bin/vitest run modules/mat/tests/`

Expected output:
```
Test Files  16 passed (16)
Tests       153 passed (153)  [or more — never fewer]
```

Include this full test run output in your session memory and PREHANDOVER proof.

---

*Issued by: foreman-v2-agent v6.2.0 | Authority: CS2 (@APGI-cmy) | 2026-02-26*
