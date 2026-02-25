# Session Memory — session-wave7-red-20260226

---

## Agent Metadata

```yaml
session_id: session-wave7-red-20260226
agent: qa-builder
agent_class: builder
agent_version: 6.2.0
contract_version: 4.0.0
wave: "Wave 7 — PerplexityAdapter / XDetect Advisor / Risk Advisor personas"
date: 2026-02-26
foreman_order: "Wave 7 RED Gate QA Delivery — Create wave7-cst.test.ts + activate PerplexityAdapter contract gate"
prior_sessions_reviewed:
  - session-001-20260225
  - session-wave6-red-20260225
```

---

## Phase 1 Preflight Attestation

```yaml
phase_1_preflight:
  agent_file_read: YES
  agent_file_path: ".github/agents/qa-builder.md"
  agent_identity_declared:
    agent_id: "qa-builder"
    agent_class: "builder"
    agent_version: "6.2.0"
    identity_role: "QA Builder (specialized)"
    identity_class_boundary: "Test implementation and quality assurance only. No feature code, no architecture changes, no weakening test assertions."
    lock_id: "SELF-MOD-QA-001"

  canon_inventory_verified: YES
  canon_inventory_path: "governance/CANON_INVENTORY.json"
  canon_inventory_result: "PASS — 182 canons, zero degraded (zero placeholder/null/empty file_hash_sha256 entries)"
  canon_inventory_total_canons: 182
  canon_inventory_placeholder_count: 0
  canon_inventory_degraded_mode: false

  sessions_reviewed:
    - "session-001-20260225 — Wave 5 RED-gate delivery. 61 tests GREEN."
    - "session-wave6-red-20260225 — Wave 6 RED-gate with Phase 1 preflight evidence. wave6-cst.test.ts delivered."
  unresolved_escalations: NONE
  unresolved_blockers: NONE

  preflight_complete: YES
  preflight_declaration: "PREFLIGHT COMPLETE. Proceeding to Wave 7 RED gate delivery."
```

---

## Task Description

Wave 7 RED Gate QA Delivery. Three deliverables are NOT yet implemented:
1. `packages/ai-centre/src/adapters/PerplexityAdapter.ts` — does NOT exist
2. `packages/ai-centre/src/agents/xdetect-advisor.md` — does NOT exist
3. `packages/ai-centre/src/agents/risk-advisor.md` — does NOT exist

Task: Create `wave7-cst.test.ts` with 4 RED tests, and activate `PerplexityAdapter` in the contract test suite. Both files must fail RED (module not found) until api-builder creates the implementation.

---

## Deliverables

```yaml
deliverables:
  - path: "packages/ai-centre/src/__tests__/integration/wave7-cst.test.ts"
    description: "4 RED-gate CST integration tests for Wave 7 (deep-search routing, xdetect-advisor persona, risk-advisor persona, risk advisor domain review)"
    sha256: "87dfb9ee62a4107868d40ac3bfd6e5238ebc6cca4d69e30b25c79437241f9c0a"
    status: CREATED

  - path: "packages/ai-centre/src/__tests__/adapters/ProviderAdapter.contract.test.ts"
    description: "Updated contract test — PerplexityAdapter import added, Wave 7 adapter registered in ADAPTERS_UNDER_TEST, makeMockDeepSearchFetch() helper added"
    sha256: "e101224d809b7530980ad2b17e8628ab2bff76f551c2b03b419c5fed0ecaac5a"
    status: MODIFIED
```

---

## Actions Taken

1. Read agent contract at `.github/agents/qa-builder.md` — identity confirmed.
2. Verified `governance/CANON_INVENTORY.json` — 182 canons, no placeholder hashes, no degraded mode.
3. Loaded prior session memories (session-001, session-wave6-red) — no outstanding blockers.
4. Explored full codebase pattern: `wave6-cst.test.ts`, `wave5-cst.test.ts`, `ProviderAdapter.contract.test.ts`, `AnthropicAdapter.ts`, `types/index.ts`, `PersonaLoader.ts`.
5. Identified `DeepSearchResult` type with `summary: string`, `citations: Citation[]`, `providerUsed: ProviderName`.
6. Created `wave7-cst.test.ts` with 4 RED tests following exact wave6 structural pattern.
7. Updated `ProviderAdapter.contract.test.ts`:
   - Added `import { PerplexityAdapter } from '../../adapters/PerplexityAdapter.js'`
   - Added `makeMockDeepSearchFetch()` helper returning Perplexity-shaped response
   - Uncommented Wave 7 line: `new PerplexityAdapter(makeMockKeyStore(), makeMockDeepSearchFetch())`
   - Updated wave delivery schedule comment to mark Wave 7 RED gate as activated
8. Ran `npm test` — confirmed RED gate in effect.

---

## Decisions Made

```yaml
decisions:
  - id: DEC-W7-001
    decision: "Test 1 uses REAL PerplexityAdapter (not inline mock) per AAD §8.2 requirement for real adapter integration testing"
    rationale: "Consistent with wave6 Test 2 (real OpenAIAdapter for DALL-E 3). The real adapter import being missing is precisely the RED mechanism."

  - id: DEC-W7-002
    decision: "Test 4 uses INLINE MOCK PerplexityAdapter + REAL PersonaLoader"
    rationale: "Decouples the gateway/persona integration path from the adapter implementation. Same pattern as wave6 Tests 1&3 used inline mock AnthropicAdapter. The REAL PersonaLoader provides the RED condition (missing risk-advisor.md)."

  - id: DEC-W7-003
    decision: "citations assertion uses Array.isArray() not length check"
    rationale: "DeepSearchResult.citations is Citation[] — api-builder may map Perplexity string URLs to Citation objects or return an empty array if no citations. Array.isArray() is the correct invariant. Any length assertion would be brittle."

  - id: DEC-W7-004
    decision: "Test 4 asserts telemetryWriter.write was called once"
    rationale: "Task specification says test must verify 'logs telemetry'. Gateway writes one TelemetryEvent per request. The mock telemetryWriter is accessible via the returned config reference."

  - id: DEC-W7-005
    decision: "Contract test uses makeMockDeepSearchFetch() returning Perplexity citations-shape response"
    rationale: "Contract test only verifies ProviderAdapter interface invariants (execute returns CapabilityResult, healthCheck completes). The mock shape is what api-builder's PerplexityAdapter will expect to parse."
```

---

## Evidence

```yaml
test_run:
  exit_code: 1  # Correct — RED gate active
  test_files_total: 16
  test_files_passed: 14
  test_files_failed: 2
  tests_passed: 57
  tests_failed: 0  # No test bodies executed in RED files (module load fails before execution)
  
  red_files:
    - file: "src/__tests__/integration/wave7-cst.test.ts"
      error: "Failed to load url ../../adapters/PerplexityAdapter.js — Does the file exist?"
      expected: YES  # PerplexityAdapter.ts not yet created
    - file: "src/__tests__/adapters/ProviderAdapter.contract.test.ts"
      error: "Failed to load url ../../adapters/PerplexityAdapter.js — Does the file exist?"
      expected: YES  # Same root cause — both files import PerplexityAdapter

  green_baseline:
    description: "All 57 non-Wave-7 tests remain GREEN — zero regressions"
    previously_passing: 57  # (69 total - 12 contract tests now RED = 57)
    note: "12 contract tests temporarily RED because contract file imports PerplexityAdapter. This is correct and expected — when api-builder creates PerplexityAdapter.ts, all 16 contract tests (12 existing + 4 new) will pass GREEN."
```

---

## Governance Alignment Verification

```yaml
governance_alignment:
  zero_test_debt: PASS — no .skip(), .todo(), or commented-out tests
  no_feature_code: PASS — only test code written; no PerplexityAdapter.ts implementation
  no_arch_modification: PASS — types/index.ts not modified
  no_governance_modification: PASS — governance/ directory not touched
  assertions_not_weakened: PASS — all assertions match spec exactly
  self_modification_prohibited: PASS — did not write to .github/agents/qa-builder.md
  bl_024_constitutional_sandbox: PASS — no Tier-1 constitutional boundaries crossed
  bl_029_tracker_update: DEFERRED — BUILD_PROGRESS_TRACKER.md update appropriate at wave completion, not RED gate delivery
```

---

## IAA Invocation

```yaml
iaa_invocation:
  result: PHASE_A_ADVISORY
  note: "IAA not yet deployed. Invocation attempt logged per contract Phase 4.6. PR flagged for IAA review when raised."
```

---

## STOP-AND-FIX Events

None.

---

## Outcome

```
COMPLETE — Wave 7 RED gate delivered.
2 test suites fail RED as required (PerplexityAdapter.ts absent).
57 prior tests remain GREEN (zero regressions).
Ready for api-builder to implement:
  1. packages/ai-centre/src/adapters/PerplexityAdapter.ts
  2. packages/ai-centre/src/agents/xdetect-advisor.md
  3. packages/ai-centre/src/agents/risk-advisor.md
```

---

## Lessons

```yaml
lessons:
  what_worked:
    - "Reading the exact pattern of wave6-cst.test.ts first ensured structural consistency — no drift."
    - "Importing FetchFn type from the non-existent adapter is the cleanest RED mechanism: one missing file breaks both the CST and the contract test suite simultaneously, which is correct — api-builder delivers one file and both become GREEN."
    - "The makeRiskAdvisorConfig return type annotation with telemetryWriter mock access pattern works cleanly for the telemetry assertion in Test 4."

  what_was_challenging:
    - "DeepSearchResult.citations is Citation[] (objects with title/url/snippet), not string[]. The Perplexity API returns raw string URLs. The assertion uses Array.isArray() to be robust — api-builder decides how to map strings to Citation objects."
    - "Making Test 4 telemetry assertion work required exposing the telemetryWriter.write mock through the config return type. The return type annotation on makeRiskAdvisorConfig() was added to allow direct access without casting."

  future_sessions_should_know:
    - "PerplexityAdapter constructor must match (keyStore?: ProviderKeyStore, fetchFn?: FetchFn) — this is the pattern all Wave N adapters follow (AnthropicAdapter, OpenAIAdapter, GitHubModelsAdapter). api-builder must not deviate."
    - "When PerplexityAdapter.ts is created, BOTH wave7-cst.test.ts and ProviderAdapter.contract.test.ts will become loadable. The contract test will then run 4 PerplexityAdapter tests (execute, error wrapping, healthCheck timing, healthCheck status)."
    - "xdetect-advisor.md and risk-advisor.md must be under packages/ai-centre/src/agents/ — PersonaLoader resolves from dirname(import.meta.url)/../agents."
```
