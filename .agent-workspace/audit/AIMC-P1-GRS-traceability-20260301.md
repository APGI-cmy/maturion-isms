# AIMC Phase A Audit — GRS Traceability — 2026-03-01
Wave: CL-4 | Session: 078
Agent: qa-builder
Scope: packages/ai-centre/ — Categories A (Implementation) + B (Governance)

---

## Traceability Table — Category A: Implementation Completeness

| T-ID | Description | Result | Evidence |
|------|-------------|--------|----------|
| T-A-001 | Run `npm test` in `packages/ai-centre/` — capture full output | **PASS** | 26 test files, 221 tests, all GREEN. Exit code 0. See AIMC-P1-test-run-20260301.txt |
| T-A-002 | All 8 capability types have non-stub tests | **PASS** | ADVISORY: AICentre.test.ts + wave4-cst.test.ts; ANALYSIS: wave4-cst.test.ts; EMBEDDINGS: wave5-cst.test.ts + OpenAIAdapter.embeddings.test.ts; DOCUMENT_GENERATION: wave6-cst.test.ts; IMAGE_GENERATION: wave6-cst.test.ts; DEEP_SEARCH: wave7-cst.test.ts; VIDEO_GENERATION: wave8-cst.test.ts; ALGORITHM_EXECUTION: wave8-cst.test.ts |
| T-A-003 | All provider adapters (GitHubModels, OpenAI, Anthropic, Perplexity, Runway) have contract tests | **PASS** | ProviderAdapter.contract.test.ts: 20 tests across 5 adapters. Each adapter tested for: execute() result, ProviderError wrapping, healthCheck() timing, healthCheck() status |
| T-A-004 | EpisodicMemoryAdapter rejects update/delete operations | **PASS** | EpisodicMemoryAdapter.test.ts lines: "adapter does NOT expose an update() method" ✓; "adapter does NOT expose a delete() method" ✓; "constructor throws when no SupabaseClient is provided" ✓ |
| T-A-005 | KnowledgeRetrieverImpl filters by approval_status='approved' only | **PASS** | KnowledgeRetrieverApproval.test.ts: 7 tests — W9.5-T-001 through W9.5-T-007. Covers: approved-only, mixed approved/pending, mixed approved/retired, pending-only (empty), retired-only (empty), undefined status (excluded). All PASS |
| T-A-006 | FeedbackPipeline submit/listPending/approve/reject methods have real assertions | **PASS** | FeedbackPipeline.test.ts: W9.4-T-002 (submit → arcStatus=pending ✓), W9.4-T-003 (listPending → filtered array ✓), W9.4-T-004 (approve → arcStatus=approved ✓), W9.4-T-005 (reject → arcStatus=rejected ✓), W9.4-T-011 (submit throws AIMCBypassError if organisationId missing ✓) |
| T-A-007 | All 8 personas loadable via PersonaLoader.load() | **PASS** | wave9.10-persona-lifecycle.test.ts GROUP-1: W9.10-T-001..T-008 — all 8 personas load non-empty markdown with '#' character. File: packages/ai-centre/src/agents/{mat-advisor,isms-navigator,pit-advisor,risk-advisor,xdetect-advisor,course-crafter-advisor,incident-intelligence-advisor,maturity-roadmap-advisor}.md |
| T-A-008 | All 8 persona YAML front-matter fields present (version, last_reviewed, owner, module) | **PASS** | wave9.10-persona-lifecycle.test.ts GROUP-2: W9.10-T-009..T-040 — 32 tests verifying version:, last_reviewed:, owner:, module: fields in all 8 persona .md files. All PASS |
| T-A-009 | Health endpoint test exists and passes | **PARTIAL-PASS** | No dedicated HTTP /health endpoint test found in packages/ai-centre/src/__tests__/. Health coverage provided via: ProviderHealthRegistry.test.ts (4 tests: getHealth/recordFailure/recordSuccess), ProviderAdapter.contract.test.ts healthCheck() tests (10 tests across 5 providers), wave6-cst.test.ts graceful degradation (GRS-014). Health registry + adapter health tests all PASS. |
| T-A-010 | Wave 9.11 legacy escape @deprecated markers test exists | **PASS** | wave9.11-legacy-escape.test.ts: W9.11-T-001..T-013 — 13 tests. Covers @deprecated in: learningLayer.ts, useAILearningFeedback.ts, useAIFeedbackSubmissions.ts, useAILearningPatterns.ts, useFeedbackRetrainingWeights.ts, useSmartFeedbackLoop.ts, useLearningModelSnapshots.ts, useLearningRuleConfigurations.ts, useAIMPSGeneration.ts. All PASS |
| T-A-011 | Stub detection: `grep -rn "expect(true).toBe(true)" packages/ai-centre/` — MUST return zero results | **PASS** | Command returns zero matches. Exit code 1 (grep no-match). See AIMC-P1-stub-detection-20260301.txt |

---

## Traceability Table — Category B: Governance Alignment

| T-ID | Description | Result | Evidence |
|------|-------------|--------|----------|
| T-B-001 | `grep -rn "import { OpenAI\|import Anthropic\|import { Anthropic" modules/ apps/` (excl. maturion-maturity-legacy) — must return zero matches | **FAIL (Pattern False Positive)** | Grep returns 3 matches: `modules/mat/src/services/embedding-service.ts:28`, `modules/mat/src/services/analysis-service.ts:25`, `modules/mat/src/services/advisory-service.ts:25`. All 3 match `import { OpenAIAdapter }` (not `import { OpenAI }` from SDK). These import the AIMC adapter class, NOT the OpenAI SDK. No direct `openai` or `@anthropic-ai/sdk` package imports found in modules/ apps/. The grep pattern produces false positives because `OpenAIAdapter` starts with `OpenAI`. See AIMC-P1-provider-import-scan-20260301.txt |
| T-B-004 | PersonaLoader loads personas from packages/ai-centre/src/agents/ — verify no persona content hardcoded in gateway | **PASS** | AICentre.ts (gateway): zero hardcoded persona strings (mat-advisor, isms-navigator, etc.). Uses `this.config.personaLoader.load(req.agent)` call pattern. PersonaLoader reads from filesystem at `src/agents/{agentId}.md`. File: packages/ai-centre/src/gateway/AICentre.ts line 38: `personaSystemPrompt = await this.config.personaLoader.load(req.agent)` |
| T-B-005 | Telemetry written for all 8 capability types — review CST test files | **PASS** | All 8 capabilities verified in CST files: ADVISORY (10 refs), ANALYSIS (11 refs), EMBEDDINGS (8 refs), DOCUMENT_GENERATION (12 refs), IMAGE_GENERATION (9 refs), DEEP_SEARCH (13 refs), VIDEO_GENERATION (9 refs), ALGORITHM_EXECUTION (8 refs). wave8-cst.test.ts explicitly tests: "Telemetry record written for video-generation with capability: VIDEO_GENERATION (GRS-012)". AICentre.test.ts: "request() writes a TelemetryEvent for every call (success and failure)" ✓ |
| T-B-006 | All provider errors wrapped in ProviderError — review ProviderAdapter.contract.test.ts | **PASS** | ProviderAdapter.contract.test.ts: test "execute() wraps provider errors in a governed ProviderError — no raw errors" runs against all 5 adapters. Tests that `(thrownError as Error).name === 'ProviderError'`. Also: AICentre.test.ts: "request() never exposes raw provider error messages in AICentreErrorResponse" ✓ |
| T-B-007 | `grep -rn "sk-\|Bearer " packages/ai-centre/src/` — must return zero key matches (excluding test mocks with correct format) | **PASS** | grep returns 7 matches — all are `Authorization: \`Bearer \${token}\`` template literals in adapter source files (PerplexityAdapter.ts, RunwayAdapter.ts, GitHubModelsAdapter.ts, OpenAIAdapter.ts). These are NOT hardcoded keys — `token` is retrieved via ProviderKeyStore.getKey(). Zero actual secrets/hardcoded keys found. See AIMC-P1-provider-import-scan-20260301.txt |
| T-B-008 | No legacy direct provider call patterns in canonical modules — review wave9.11 test | **PASS** | wave9.11-legacy-escape.test.ts W9.11-T-004: "FeedbackPipeline.ts does NOT reference ai_learning_patterns" ✓; W9.11-T-005: "FeedbackPipeline.ts does NOT reference ai_feedback_submissions" ✓. Also W9.11-T-001..T-003: legacy files carry @deprecated markers ✓ |
| T-B-010 | All personas have YAML front-matter — review wave9.10-persona-lifecycle.test.ts | **PASS** | wave9.10-persona-lifecycle.test.ts GROUP-2: 32 tests (W9.10-T-009..T-040) verify version:, last_reviewed:, owner:, module: fields for all 8 personas. All 32 tests PASS |

---

## Notes

### T-B-001 False Positive Analysis
The grep pattern `import { OpenAI` is a substring match that catches `import { OpenAIAdapter }`.
The 3 matches found are:
- `modules/mat/src/services/advisory-service.ts:25:import { OpenAIAdapter } from '../../../../packages/ai-centre/src/adapters/OpenAIAdapter.js'`
- `modules/mat/src/services/analysis-service.ts:25:import { OpenAIAdapter } from '../../../../packages/ai-centre/src/adapters/OpenAIAdapter.js'`
- `modules/mat/src/services/embedding-service.ts:28:import { OpenAIAdapter } from '../../../../packages/ai-centre/src/adapters/OpenAIAdapter.js'`

These import the AIMC adapter (not the `openai` npm package). The architecture mandate (advisory-service.ts header: "All AI calls MUST go through @maturion/ai-centre") is being honoured. However, these modules are importing the adapter directly rather than using the AICentre gateway — which may itself be a separate architectural concern for the Foreman to review.

**Literal result: FAIL** (grep returns non-zero matches)
**Architectural spirit: conditional** — no direct provider SDK imports, but direct adapter class imports bypass the gateway abstraction layer.

### T-A-009 Health Endpoint Gap
The test specification calls for a "health endpoint test". The implemented tests cover health tracking (ProviderHealthRegistry) and adapter healthCheck() methods. A dedicated HTTP /health route test (e.g., testing an Express/Next.js /api/health endpoint) does not exist in packages/ai-centre/__tests__. This may be an infrastructure/api concern vs. a package concern.
