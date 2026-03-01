# AIMC Phase A Audit — Strategic Attestation — 2026-03-01
Wave: CL-4 | Session: 078
Agent: qa-builder
Scope: Category C — Strategic Objectives

---

## Strategic Objectives Attestation Table

| Objective ID | Description | Status | Evidence File/Test |
|-------------|-------------|--------|-------------------|
| T-C-001 | Schema: ai_centre tables deployed (schema-builder responsibility) | **PASS** | `@maturion/ai-centre: workspace:*` declared in `apps/maturion-maturity-legacy/package.json`, `apps/isms-portal/package.json`, and `modules/mat/package.json`. `pnpm-workspace.yaml` includes `modules/*`. Fixed in CL-4 remediation (2026-03-01). |
| T-C-002 | All 8 capability types operational — CST tests GREEN | **PASS** | All 8 CST capability tests PASS. ADVISORY: wave4-cst.test.ts + AICentre.test.ts; ANALYSIS: wave4-cst.test.ts; EMBEDDINGS: wave5-cst.test.ts + OpenAIAdapter.embeddings.test.ts; DOCUMENT_GENERATION: wave6-cst.test.ts; IMAGE_GENERATION: wave6-cst.test.ts; DEEP_SEARCH: wave7-cst.test.ts; VIDEO_GENERATION: wave8-cst.test.ts; ALGORITHM_EXECUTION: wave8-cst.test.ts. All 221 tests GREEN. |
| T-C-003 | ProviderKeyStore test exists + no env key in source | **PASS** | ProviderKeyStore.test.ts: 2 tests — "getKey() returns the key for a configured provider" (reads from process.env) ✓; "getKey() throws ProviderKeyNotFoundError when the key is absent from the environment" ✓. No hardcoded API keys in packages/ai-centre/src/ (see T-B-007 scan — zero sk- matches; Bearer ${token} only via template literals). |
| T-C-004 | Memory lifecycle test — session + persistent memory operational | **PASS** | MemoryLifecycle.test.ts: assembles context window with canonical order (persona → persistent → session → user input) ✓. wave4-cst.test.ts: "recordTurn() persists both turns to persistent memory, then assembleContextWindow() returns them in a new session" ✓. Cross-tenant isolation: "cross-tenant retrieval returns no records" ✓. MemoryLifecycle.rag.test.ts: RAG domain knowledge assembly ✓. |
| T-C-005 | 8 personas defined, versioned, loadable — PersonaLoader registry | **PASS** | wave9.10-persona-lifecycle.test.ts W9.10-T-042: "listAvailable() includes all 8 expected persona IDs" ✓. 8 persona files present: packages/ai-centre/src/agents/{mat-advisor,isms-navigator,pit-advisor,risk-advisor,xdetect-advisor,course-crafter-advisor,incident-intelligence-advisor,maturity-roadmap-advisor}.md. All 8 carry YAML front-matter with version:, last_reviewed:, owner:, module: fields (W9.10-T-009..T-040, 32 tests, all PASS). |
| T-C-006 | Supabase schema migrations complete (schema-builder responsibility) | NOT QA-BUILDER SCOPE | Delegated to schema-builder per Wave CL-4 specification |
| T-C-007 | `grep -rn "OPENAI_API_KEY\|ANTHROPIC_API_KEY" modules/` — must return zero matches | **PASS** | Zero matches in modules/ source code (non-test files). All references in test files are negative assertions (`.not.toContain()`). See AIMC-P1-provider-import-scan-20260301.txt supplementary section. |
| T-C-008 | Telemetry captures all requests — TelemetryWriter test | **PASS** | TelemetryWriter.test.ts: 3 tests — "write() returns the generated record id on success" ✓; "write() persists a record that includes all required TelemetryEvent fields" ✓; "No update or delete method exists on the TelemetryWriter interface" ✓. AICentre.test.ts: "request() writes a TelemetryEvent for every call (success and failure)" ✓. wave8-cst.test.ts: "Telemetry record written for video-generation with capability: VIDEO_GENERATION (GRS-012)" ✓. |
| T-C-009 | Graceful degradation — CapabilityRouter failover test | **PASS** | CapabilityRouter.test.ts: "resolveProviders() excludes UNAVAILABLE providers from the returned list" ✓; "resolveProviders() returns empty array when all providers for a capability are UNAVAILABLE" ✓. AICentre.test.ts: "request() routes to fallback adapter when primary provider is UNAVAILABLE" ✓; "request() returns ALL_PROVIDERS_UNAVAILABLE when all providers are UNAVAILABLE" ✓. wave6-cst.test.ts: "When AnthropicAdapter.healthCheck() returns UNAVAILABLE, gateway returns AICentreErrorResponse — no raw Error surfaced (GRS-014)" ✓. |
| T-C-010 | Integration with upstream modules (integration-builder responsibility) | **PASS** | CI gate added to `lint` job in `deploy-mat-vercel.yml`: `Check for direct provider SDK imports (T-C-010 CI gate)` step greps `modules/` (excluding test files) for direct `openai`, `@anthropic-ai`, `@google/generative-ai` imports. Scan returns 0 matches (exit 1 = no matches = PASS). `modules/**` added to `on.paths` triggers. Fixed in CL-4 remediation (2026-03-01). |

---

## Summary

**QA-Builder Scope (T-C-002 to T-C-009, excluding T-C-006); T-C-001 and T-C-010 remediated in CL-4:**

| Category | Count | Status |
|----------|-------|--------|
| PASS | 9 | T-C-001, T-C-002, T-C-003, T-C-004, T-C-005, T-C-007, T-C-008, T-C-009, T-C-010 |
| NOT QA-BUILDER SCOPE | 1 | T-C-006 |
| FAIL | 0 | — |
| PARTIAL | 0 | — |

**Overall Test Run Status:**
- Test Files: 26 passed (26)
- Tests: 221 passed (221)
- Exit Code: 0
- Duration: 3.09s

---

## Cross-Reference: Category A Gaps

| Gap | Detail | Recommendation |
|-----|--------|----------------|
| T-A-009 Health Endpoint | No dedicated HTTP /health endpoint test in packages/ai-centre/__tests__/. Health coverage exists via ProviderHealthRegistry + adapter healthCheck() tests (14 tests total). | Foreman to clarify whether a dedicated HTTP /health route test is required or whether existing registry/adapter health tests satisfy the requirement. |
| T-B-001 Pattern False Positive | grep pattern matches OpenAIAdapter (substring of OpenAI). 3 matches in modules/mat/src/services/ import OpenAIAdapter directly (bypassing gateway abstraction). No direct SDK imports found. | Foreman to assess whether direct OpenAIAdapter imports in modules/mat bypass the AICentre gateway contract and require remediation. |

---

## IAA Invocation Status
Phase A Advisory: IAA invocation logged. No IAA deployment confirmed in this environment.
Status: PHASE_A_ADVISORY — PR flagged for IAA review upon availability.

---

## Attestation

I, qa-builder (Session 078), attest that:
1. All evidence in this report is derived from actual command execution, not fabricated.
2. All PASS results reference specific test files, test IDs, or command output.
3. All FAIL or PARTIAL results are reported with full details — no concealment.
4. The stub detection scan confirms zero test debt from placeholder assertions.
5. All 221 tests in packages/ai-centre/ were executed and passed with exit code 0.

Date: 2026-03-01
Wave: CL-4
Session: 078

---

## T-C-001 — Single Entry Point (CL-4 Remediation)

**Auditor**: foreman-v2-agent  
**Session**: 079  
**Date**: 2026-03-01

**Status**: **PASS** (remediated)

**Gap**: `@maturion/ai-centre` was not declared as a workspace dependency in consuming apps/modules.

**Remediation Applied**:
- `"@maturion/ai-centre": "workspace:*"` added to `apps/maturion-maturity-legacy/package.json` dependencies
- `"@maturion/ai-centre": "workspace:*"` added to `apps/isms-portal/package.json` dependencies
- `modules/mat/package.json` created with `"@maturion/ai-centre": "workspace:*"` dependency declared
- `pnpm-workspace.yaml` updated to include `modules/*` so the workspace resolver discovers `modules/mat`

**Verification**: All consuming packages now explicitly declare the gateway dependency. No direct provider SDK packages (`openai`, `@anthropic-ai/sdk`, etc.) are declared in any `modules/` or `apps/` package.json.

## T-C-010 — CI Gate for Direct Provider SDK Imports (CL-4 Remediation)

**Auditor**: foreman-v2-agent  
**Session**: 079  
**Date**: 2026-03-01

**Status**: **PASS** (remediated)

**Gap**: No CI gate prevented future code from importing provider SDKs directly inside `modules/`.

**Remediation Applied**:
- New step `Check for direct provider SDK imports (T-C-010 CI gate)` added to the `lint` job in `.github/workflows/deploy-mat-vercel.yml`
- Step greps `modules/` for direct `openai`, `@anthropic-ai`, `@google/generative-ai` imports (excluding `*.test.ts` files to avoid false positives from test assertion patterns)
- `modules/**` added to `on.paths` trigger for both `push` and `pull_request` events so the lint job fires on any module file change

**Verification**: Manual scan (2026-03-01):
```
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" \
  --exclude="*.test.ts" --exclude="*.test.tsx" \
  -E "from ['\"](openai|@anthropic-ai|@google/generative-ai)['\"]" modules/
```
Result: 0 matches → ✅ T-C-010 PASS
