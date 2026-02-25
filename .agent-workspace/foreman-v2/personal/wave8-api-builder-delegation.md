# Wave 8 — api-builder Delegation Specification

**Issued by**: foreman-v2-agent
**Issued to**: `api-builder`
**Date**: 2026-02-25
**Wave**: Wave 8 — Video Generation + Algorithm Execution + Governance Certification
**Authority**: AAWP Wave 8 | GRS-006 | APS §5.3 | AAD §7
**Status**: BLOCKED — awaiting qa-builder RED gate verification

> ⚠️ **DO NOT BEGIN UNTIL ALL GATE CONDITIONS ARE MET**
> Gate 1: CS2 explicit wave-start authorization (@APGI-cmy)
> Gate 2: qa-builder has delivered Wave 8 RED gate tests
> Gate 3: Foreman has verified RED state (both wave8-cst.test.ts and ProviderAdapter.contract.test.ts fail RED)
>
> This specification is pre-prepared. api-builder MUST NOT act on it until foreman
> issues an explicit "proceed" instruction after all gate conditions are confirmed.

---

## Step 0 — Mandatory Preflight (BLOCKING — execute before any other action)

Read your agent contract file FIRST: `.github/agents/api-builder.md`
Complete Phase 1 PREFLIGHT in full. Produce declared output for every step.
Record Phase 1 evidence in session memory at `.agent-workspace/api-builder/memory/session-wave8-YYYYMMDD.md`

**Failure to execute Phase 1 first is a POLC breach and will result in QP FAIL on delivery.**

---

## Architecture Reference

Before writing any code, read the following frozen architecture documents:
- `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md` — AAD §7 Wave 8 row
- `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` — Wave 8 deliverables
- `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` — GRS-005, GRS-006, GRS-012, GRS-015

---

## Deliverable 1 — `RunwayAdapter.ts`

**Path**: `packages/ai-centre/src/adapters/RunwayAdapter.ts`

**Requirements**:
- `providerName`: `'runway' as const`
- `supportedCapabilities`: `new Set([Capability.VIDEO_GENERATION])`
- Constructor: `constructor(keyStore?: ProviderKeyStore, fetchFn?: FetchFn)` — injectable dependencies per AAD §8.2
- `execute()`: calls `ProviderKeyStore.getKey('runway')`, calls Runway Gen-2 API (`https://api.runwayml.com/v1/image_to_video`), parses response to `VideoGenerationResult`
- `healthCheck()`: returns `HEALTHY` when key is configured, `UNAVAILABLE` when not
- All provider errors wrapped in `ProviderError` (no raw errors surfaced — GRS-014)
- No API key hard-coded in source (GRS-015)

**API response shape** (Runway Gen-2):
```json
{
  "id": "task_xxx",
  "output": ["https://cdn.runwayml.com/generated/video.mp4"]
}
```

**VideoGenerationResult shape** (from `types/index.ts`):
```typescript
{
  capability: Capability.VIDEO_GENERATION,
  videoUrl: string,     // parsed from output[0]
  providerUsed: 'runway'
}
```

**Pattern to follow**: `PerplexityAdapter.ts` — same constructor pattern, same error handling, same FetchFn type export.

---

## Deliverable 2 — `OpenAIAdapter.ts` Extension (ALGORITHM_EXECUTION)

**Path**: `packages/ai-centre/src/adapters/OpenAIAdapter.ts`

**Requirements** (AAWP Wave 8 Algorithm Execution Note):
> "The `algorithm-execution` capability does not require a new adapter file. It is handled
> entirely via capability routing configuration directing requests to `OpenAIAdapter` using
> the OpenAI o3 model (ref: AAD §7, AIMC_STRATEGY.md §4)."

- Add `Capability.ALGORITHM_EXECUTION` to `supportedCapabilities`
- Add `ALGORITHM_EXECUTION` branch in `execute()`:
  - Routes to OpenAI Responses API: `https://api.openai.com/v1/responses`
  - Uses model: `o3`
  - Returns `AlgorithmExecutionResult`: `{ capability: Capability.ALGORITHM_EXECUTION, output: unknown, providerUsed: 'openai' }`
- Import `AlgorithmExecutionResult` from types

**AlgorithmExecutionResult shape** (from `types/index.ts`):
```typescript
{
  capability: Capability.ALGORITHM_EXECUTION,
  output: unknown,
  providerUsed: 'openai'
}
```

---

## Deliverable 3 — Routing Configuration Confirmation

The Wave 8 test suite (`wave8-cst.test.ts`, already written by qa-builder) uses this routing table:
```typescript
[Capability.ALGORITHM_EXECUTION]: ['openai'],
[Capability.VIDEO_GENERATION]: ['runway'],
```

Confirm that the routing table in the test file is correct. No changes to `CapabilityRouter.ts` are required — routing is configuration-driven, not code-driven.

---

## Acceptance Criteria (Foreman QP Review)

Foreman will verify all of the following before QP PASS:

- [ ] Phase 1 PREFLIGHT evidenced in deliverable (preflight attestation block present)
- [ ] `RunwayAdapter.ts` created — all contract requirements met:
  - [ ] `providerName: 'runway'`
  - [ ] `supportedCapabilities` includes `VIDEO_GENERATION`
  - [ ] Constructor uses DI for keyStore and fetchFn
  - [ ] `execute()` calls Runway API endpoint
  - [ ] `execute()` returns `VideoGenerationResult`
  - [ ] `healthCheck()` returns HEALTHY/UNAVAILABLE based on key availability
  - [ ] All errors wrapped in `ProviderError`
  - [ ] No API key in source (GRS-015)
- [ ] `OpenAIAdapter.ts` extended:
  - [ ] `ALGORITHM_EXECUTION` in `supportedCapabilities`
  - [ ] `execute()` handles `ALGORITHM_EXECUTION` → o3 model → `AlgorithmExecutionResult`
- [ ] **Wave 8 tests all pass GREEN** (wave8-cst.test.ts: 4 tests, contract: 4 additional)
- [ ] **All prior tests remain GREEN** (zero regressions — all 16 prior suites)
- [ ] Total test count: 17 files, 85 tests (77 prior + 4 wave8-cst + 4 RunwayAdapter contract)
- [ ] `TypeScript strict: true` — zero compiler errors
- [ ] Zero deprecation warnings
- [ ] PREHANDOVER proof present with full test run evidence
- [ ] Session memory present and complete
- [ ] Parking station entry appended

---

## Cost Governance Evidence (for AIMC_GOVERNANCE_CERTIFICATION.md)

After api-builder completes implementation and QP PASS is confirmed, Foreman will author the `AIMC_GOVERNANCE_CERTIFICATION.md`. api-builder should compile:
1. Confirmation that `ProviderKeyStore.getKey('runway')` is the only mechanism used to retrieve the Runway API key (GRS-015)
2. Confirmation that `telemetryWriter.write()` is called for every VIDEO_GENERATION and ALGORITHM_EXECUTION request (GRS-012)
3. Test run evidence (full 85-test GREEN run)

---

*Issued by: foreman-v2-agent v6.2.0 | Authority: CS2 (@APGI-cmy) | 2026-02-25*
*Status: BLOCKED — awaiting cs2 wave-start + qa-builder RED gate verification*
