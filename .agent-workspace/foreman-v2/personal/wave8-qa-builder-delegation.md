# Wave 8 — qa-builder Delegation Specification

**Issued by**: foreman-v2-agent
**Issued to**: `qa-builder`
**Date**: 2026-02-25
**Wave**: Wave 8 — Video Generation + Algorithm Execution + Governance Certification
**Authority**: AAWP Wave 8 | GRS-006 | APS §5.3 | AAD §7
**Status**: AWAITING CS2 WAVE-START AUTHORIZATION

> ⚠️ **DO NOT BEGIN UNTIL CS2 WAVE-START AUTHORIZATION IS CONFIRMED**
> Wave 8 requires explicit CS2 (@APGI-cmy) wave-start approval per AAWP §4.
> This delegation specification is pre-prepared but may NOT be actioned until CS2 authorizes.

---

## Step 0 — Mandatory Preflight (BLOCKING — execute before any other action)

Read your agent contract file FIRST: `.github/agents/qa-builder.md`
Complete Phase 1 PREFLIGHT in full. Produce declared output for every step.
Record Phase 1 evidence in session memory at `.agent-workspace/qa-builder/memory/session-wave8-red-YYYYMMDD.md`

**Failure to execute Phase 1 first is a POLC breach and will result in QP FAIL on delivery.**

---

## Task Scope

Deliver the **Wave 8 RED gate test suite** for `@maturion/ai-centre`.

All tests MUST FAIL (RED) before api-builder writes any implementation code.
Foreman will verify RED state before issuing the api-builder task.

---

## Deliverable 1 — `wave8-cst.test.ts`

**Path**: `packages/ai-centre/src/__tests__/integration/wave8-cst.test.ts`

**AAWP Wave 8 mandated integration tests** (4 tests):

| Test | Requirement | RED Condition |
|------|-------------|---------------|
| 1 | `ai.request({ capability: 'video-generation', ... })` routes to `RunwayAdapter` and returns `VideoGenerationResult` shape | RED: `RunwayAdapter.ts` does not exist → import fails → suite fails to load |
| 2 | `ai.request({ capability: 'algorithm-execution', ... })` routes to `OpenAIAdapter` (o3 model) and returns `AlgorithmExecutionResult` | RED: `ALGORITHM_EXECUTION` not in `OpenAIAdapter.supportedCapabilities` → ProviderError thrown → assertions fail |
| 3 | All five adapters have live execute() — no `'Not implemented'` error thrown | RED: `RunwayAdapter.ts` does not exist → import fails → suite fails to load |
| 4 | Telemetry record written for video-generation with `capability: VIDEO_GENERATION` (GRS-012) | RED: same as Test 1 |

**Pattern to follow**: `wave7-cst.test.ts` — same structure, same routing table pattern, same mock fetch injection.

**Routing table** (FULL_ROUTE_MAP must include all capabilities, same as prior waves):
```typescript
const FULL_ROUTE_MAP: Record<Capability, ProviderName[]> = {
  [Capability.ADVISORY]: ['github-models'],
  [Capability.ANALYSIS]: ['openai'],
  [Capability.EMBEDDINGS]: ['openai'],
  [Capability.DOCUMENT_GENERATION]: ['anthropic'],
  [Capability.IMAGE_GENERATION]: ['openai'],
  [Capability.DEEP_SEARCH]: ['perplexity'],
  [Capability.VIDEO_GENERATION]: ['runway'],
  [Capability.ALGORITHM_EXECUTION]: ['openai'],
};
```

---

## Deliverable 2 — Updated `ProviderAdapter.contract.test.ts`

**Path**: `packages/ai-centre/src/__tests__/adapters/ProviderAdapter.contract.test.ts`

Add to `ADAPTERS_UNDER_TEST`:
```typescript
import { RunwayAdapter } from '../../adapters/RunwayAdapter.js';
// ...
new RunwayAdapter(makeMockKeyStore(), makeMockVideoFetch()), // Wave 8
```

Add `makeMockVideoFetch()` helper mirroring Runway Gen-2 `/v1/image_to_video` response shape:
```typescript
function makeMockVideoFetch() {
  return vi.fn().mockResolvedValue({
    ok: true, status: 200,
    json: async () => ({
      id: 'task_contract_001',
      output: ['https://cdn.runwayml.com/generated/contract-test.mp4'],
    }),
  } as unknown as Response);
}
```

**RED condition**: Import of `RunwayAdapter` fails (file doesn't exist) → both suite and contract suite fail to load.

---

## Expected RED Test Run Output

```
Test Files  2 failed | 14 passed
Tests:      77 passed | 0 failed (RED files fail at module load, before test execution)

FAILING SUITES (RED — expected):
  src/__tests__/integration/wave8-cst.test.ts
    Error: Failed to load url ../../adapters/RunwayAdapter.js
  src/__tests__/adapters/ProviderAdapter.contract.test.ts
    Error: Failed to load url ../../adapters/RunwayAdapter.js

PASSING SUITES (GREEN — regression check):
  All prior wave tests must remain GREEN (no regressions)
```

---

## Deliverable 3 — PREHANDOVER Proof and Session Memory

Per qa-builder contract Phase 4:
- Write session memory to `.agent-workspace/qa-builder/memory/session-wave8-red-YYYYMMDD.md`
- Write PREHANDOVER proof to `.agent-admin/prehandover/proof-wave8-red-YYYYMMDD.md`
- Include test run evidence (RED state confirmed)
- Append parking station entry

---

## Acceptance Criteria (Foreman QP Review)

Foreman will verify all of the following before QP PASS:

- [ ] Phase 1 PREFLIGHT evidenced in deliverable (preflight attestation block present)
- [ ] wave8-cst.test.ts created with 4 tests
- [ ] ProviderAdapter.contract.test.ts updated with RunwayAdapter import and registration
- [ ] Both failing suites fail RED at module load (not with test-body failures)
- [ ] All 14 prior wave test suites remain GREEN (zero regressions)
- [ ] PREHANDOVER proof present with test run evidence
- [ ] Session memory present and complete

---

*Issued by: foreman-v2-agent v6.2.0 | Authority: CS2 (@APGI-cmy) | 2026-02-25*
*Status: AWAITING CS2 WAVE-START AUTHORIZATION*
