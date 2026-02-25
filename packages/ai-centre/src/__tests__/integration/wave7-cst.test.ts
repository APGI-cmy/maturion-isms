/**
 * RED Gate QA Suite — Wave 7 Component System Tests (CST)
 *
 * All tests MUST FAIL until Wave 7 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-006 (deep-search), GRS-007 (threat intelligence) |
 *             APS §5.3, §6.1, §8.1 | AAD §7 (Wave 7 row)
 *
 * Mapped requirements:
 *   GRS-006  Progressive provider delivery — deep-search capability via Perplexity API;
 *            PerplexityAdapter wraps /chat/completions endpoint with citation extraction
 *   GRS-007  Threat intelligence search — PerplexityAdapter serves XDetect and Risk modules;
 *            grounded search results include citation URLs for evidence traceability
 *   APS §8.1 Persona loading — xdetect-advisor and risk-advisor persona files must be
 *            resolvable by PersonaLoader at gateway dispatch time
 *
 * AAWP Wave 7 mandated integration tests:
 *   1. ai.request({ capability: 'deep-search', ... }) routes to PerplexityAdapter
 *      → DeepSearchResult shape verified (summary, citations, providerUsed)
 *   2. PersonaLoader.load('xdetect-advisor') returns non-empty Markdown string
 *   3. PersonaLoader.load('risk-advisor') returns non-empty Markdown string
 *   4. ai.request({ capability: 'deep-search', agent: 'risk-advisor', ... }) succeeds
 *      and logs telemetry when persona is loaded (integration path: persona + gateway + mock adapter)
 *
 * ─── RED CONDITIONS (before Wave 7) ───────────────────────────────────────────
 *
 *  Test 1 — PerplexityAdapter.ts does NOT exist yet.
 *            The `import { PerplexityAdapter }` at the top of this file fails with
 *            "Cannot find module '../../adapters/PerplexityAdapter.js'".
 *            vitest treats the module resolution failure as a suite-level error →
 *            ALL tests in this file fail RED before any test body executes.
 *
 *  Test 2 — PersonaLoader.load('xdetect-advisor') throws PersonaNotFoundError
 *            because packages/ai-centre/src/agents/xdetect-advisor.md does NOT exist yet.
 *            Test FAILS RED with the unhandled PersonaNotFoundError rejection.
 *
 *  Test 3 — PersonaLoader.load('risk-advisor') throws PersonaNotFoundError
 *            because packages/ai-centre/src/agents/risk-advisor.md does NOT exist yet.
 *            Test FAILS RED with the unhandled PersonaNotFoundError rejection.
 *
 *  Test 4 — PersonaLoader.load('risk-advisor') throws PersonaNotFoundError (REAL loader).
 *            Gateway catches the error and returns AICentreErrorResponse { errorCode: UNKNOWN_AGENT }.
 *            Casting to AICentreResponse, response.result is absent →
 *            response.result.capability throws TypeError → test FAILS RED.
 *
 * ─── GREEN CONDITIONS (after Wave 7 deliverables) ────────────────────────────
 *
 *  Test 1 GREEN: api-builder creates PerplexityAdapter.ts with:
 *                  - providerName: 'perplexity'
 *                  - supportedCapabilities includes DEEP_SEARCH
 *                  - execute() calls injected fetchFn → Perplexity /chat/completions →
 *                    parses choices[0].message.content as summary, citations array as Citation[]
 *                  - Returns DeepSearchResult shape
 *                Import resolves → PerplexityAdapter instantiated with mock fetch →
 *                gateway routes DEEP_SEARCH to 'perplexity' → mock fetch returns
 *                Perplexity-shaped response → all assertions pass GREEN.
 *
 *  Test 2 GREEN: api-builder creates xdetect-advisor.md under
 *                packages/ai-centre/src/agents/ →
 *                PersonaLoader.load('xdetect-advisor') reads and returns
 *                the file content as a non-empty Markdown string → all assertions pass.
 *
 *  Test 3 GREEN: api-builder creates risk-advisor.md under
 *                packages/ai-centre/src/agents/ →
 *                PersonaLoader.load('risk-advisor') reads and returns
 *                the file content as a non-empty Markdown string → all assertions pass.
 *
 *  Test 4 GREEN: risk-advisor.md created → REAL PersonaLoader.load('risk-advisor') succeeds →
 *                gateway routes DEEP_SEARCH to 'perplexity' → inline mock adapter.execute()
 *                returns DeepSearchResult → telemetryWriter.write() called once with
 *                capability DEEP_SEARCH → response.capability and result shape verified →
 *                all assertions pass GREEN.
 */

import { describe, it, expect, vi } from 'vitest';
import { PerplexityAdapter } from '../../adapters/PerplexityAdapter.js';
import type { FetchFn } from '../../adapters/PerplexityAdapter.js';
import { PersonaLoader } from '../../personas/PersonaLoader.js';
import { AICentre } from '../../gateway/AICentre.js';
import {
  Capability,
  ProviderHealthStatus,
  type AICentreConfig,
  type AICentreRequest,
  type AICentreResponse,
  type DeepSearchResult,
  type ProviderAdapter,
  type ProviderName,
} from '../../types/index.js';
import { ProviderKeyStore } from '../../keys/ProviderKeyStore.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mock key store that returns a fake token without reading env vars. */
function makeMockKeyStore(): ProviderKeyStore {
  return {
    getKey: vi.fn().mockReturnValue('test-token'),
  } as unknown as ProviderKeyStore;
}

/**
 * Mock fetch returning a well-formed Perplexity API response.
 * Mirrors the real POST /chat/completions JSON shape for Perplexity's
 * sonar-pro (grounded search) model.
 * Injected into PerplexityAdapter so no live API calls are made.
 * This fetch will be exercised in GREEN state once api-builder creates PerplexityAdapter
 * with DEEP_SEARCH support and routes calls to the Perplexity /chat/completions endpoint.
 *
 * Reference: https://docs.perplexity.ai/api-reference/chat-completions
 */
function makeMockPerplexityFetch(): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content: 'Summary of threat intelligence findings.' } }],
      citations: [
        'https://example.com/source1',
        'https://example.com/source2',
      ],
    }),
  } as unknown as Response);
}

/**
 * Inline mock implementing the ProviderAdapter interface for 'perplexity'.
 *
 * Used in Test 4 to exercise the ROUTING and PERSONA LOADING paths through the gateway
 * without coupling to the real PerplexityAdapter implementation. The contract tests and
 * Test 1 handle the real adapter's behaviour. This mock isolates the gateway/persona
 * integration path so Test 4 specifically verifies:
 *   1. REAL PersonaLoader resolves 'risk-advisor' (fails RED until md file created)
 *   2. Gateway routes DEEP_SEARCH to the inline mock adapter
 *   3. TelemetryWriter is called with the correct capability
 *
 * In GREEN state, execute() is called by the gateway and returns a valid
 * DeepSearchResult satisfying all Test 4 assertions.
 *
 * @returns ProviderAdapter mock with providerName: 'perplexity', DEEP_SEARCH capability.
 */
function makeMockPerplexityAdapter(): ProviderAdapter {
  return {
    providerName: 'perplexity' as const,
    supportedCapabilities: new Set([Capability.DEEP_SEARCH]),
    execute: vi.fn().mockResolvedValue({
      capability: Capability.DEEP_SEARCH,
      summary:
        'Risk assessment findings: Multiple critical vulnerabilities detected in network ' +
        'perimeter controls. Recommend immediate patching of CVE-2024-1234 per NIST guidelines.',
      citations: [
        {
          title: 'NVD CVE-2024-1234',
          url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-1234',
          snippet: 'Critical vulnerability in network perimeter controls.',
        },
        {
          title: 'CISA Advisory AA24-001',
          url: 'https://www.cisa.gov/advisory/2024/01',
          snippet: 'CISA recommends immediate patching of affected systems.',
        },
      ],
      providerUsed: 'perplexity',
    } as DeepSearchResult),
    healthCheck: vi.fn().mockResolvedValue(ProviderHealthStatus.HEALTHY),
  };
}

function makeDeepSearchRequest(): AICentreRequest {
  return {
    capability: Capability.DEEP_SEARCH,
    // No agent specified — persona loading is skipped; test focuses on adapter routing.
    input: {
      text: 'Latest threat intelligence on ransomware targeting healthcare organisations',
    },
    context: {
      organisationId: 'org-wave7',
      sessionId: 'sess-wave7-deepsearch',
      userId: 'user-001',
    },
  };
}

function makeRiskAdvisorRequest(): AICentreRequest {
  return {
    capability: Capability.DEEP_SEARCH,
    agent: 'risk-advisor',
    input: {
      text: 'Assess current threat landscape for ISO 27001 risk treatment planning',
    },
    context: {
      organisationId: 'org-wave7',
      sessionId: 'sess-wave7-risk',
      userId: 'user-001',
    },
  };
}

/**
 * Full routing table — all capabilities must be present (consistent with prior wave CST
 * patterns in wave4-cst.test.ts, wave5-cst.test.ts, and wave6-cst.test.ts).
 */
const FULL_ROUTE_MAP: Record<Capability, ProviderName[]> = {
  [Capability.ADVISORY]: ['github-models'],
  [Capability.ANALYSIS]: ['openai'],
  [Capability.EMBEDDINGS]: ['openai'],
  [Capability.DOCUMENT_GENERATION]: ['anthropic'],
  [Capability.IMAGE_GENERATION]: ['openai'],
  [Capability.DEEP_SEARCH]: ['perplexity'],
  [Capability.VIDEO_GENERATION]: ['runway'],
  [Capability.ALGORITHM_EXECUTION]: [],
};

/**
 * Build AICentreConfig wired for deep-search routing tests (Test 1).
 *
 * CRITICAL — uses REAL PerplexityAdapter with injected mock fetch (AAD §8.2):
 *   The real PerplexityAdapter is constructed with a mock fetch so that no live
 *   API calls are made. This config fails RED until api-builder creates
 *   PerplexityAdapter.ts (the import at the top of this file causes module resolution
 *   failure until then).
 *
 * No 'agent' is specified in makeDeepSearchRequest() so the personaLoader is not called.
 */
function makeDeepSearchConfig(): AICentreConfig {
  // Real PerplexityAdapter — does NOT exist until Wave 7 api-builder delivers it.
  // RED: import at top of file fails → module not found → entire test file fails to load.
  // GREEN: PerplexityAdapter.ts created → execute() invokes injected mock fetch.
  const perplexityAdapter = new PerplexityAdapter(
    makeMockKeyStore(),
    makeMockPerplexityFetch(),
  );

  return {
    routing: { routes: FULL_ROUTE_MAP },
    keyStore: { getKey: vi.fn().mockReturnValue('test-key') },
    telemetryWriter: { write: vi.fn().mockResolvedValue('tel-wave7-deepsearch-001') },
    persistentMemory: {
      retrieve: vi.fn().mockResolvedValue([]),
      persist: vi.fn().mockResolvedValue(undefined),
      pruneExpired: vi.fn().mockResolvedValue(0),
    },
    sessionMemory: {
      append: vi.fn(),
      getHistory: vi.fn().mockReturnValue([]),
      prune: vi.fn(),
      clearSession: vi.fn(),
    },
    // Mocked personaLoader — no agent specified in deep-search request; persona loading skipped.
    personaLoader: {
      load: vi.fn().mockResolvedValue(''),
      listAvailable: vi.fn().mockResolvedValue([]),
    },
    healthRegistry: {
      getHealth: vi.fn().mockReturnValue(ProviderHealthStatus.HEALTHY),
      recordSuccess: vi.fn(),
      recordFailure: vi.fn(),
    },
    adapters: [perplexityAdapter],
  };
}

/**
 * Build AICentreConfig wired for the risk-advisor integration test (Test 4).
 *
 * CRITICAL — uses REAL PersonaLoader:
 *   The real PersonaLoader is injected so that Test 4 fails RED until
 *   packages/ai-centre/src/agents/risk-advisor.md is created by api-builder.
 *   PersonaLoader.load('risk-advisor') throws PersonaNotFoundError → gateway returns
 *   AICentreErrorResponse { errorCode: UNKNOWN_AGENT } → assertions on
 *   DeepSearchResult fail RED.
 *
 * Uses an INLINE MOCK PerplexityAdapter (not the real one):
 *   Decouples Test 4 from the PerplexityAdapter implementation status.
 *   The inline mock ensures that once risk-advisor.md exists, the gateway
 *   routes DEEP_SEARCH to 'perplexity' → execute() returns a canned DeepSearchResult →
 *   telemetryWriter.write() is called → all assertions pass GREEN.
 *
 * Callers may pass partial `overrides` to adjust any config property.
 */
function makeRiskAdvisorConfig(
  overrides: Partial<AICentreConfig> = {},
): AICentreConfig & { telemetryWriter: { write: ReturnType<typeof vi.fn> } } {
  const telemetryWriter = { write: vi.fn().mockResolvedValue('tel-wave7-risk-001') };

  return {
    routing: { routes: FULL_ROUTE_MAP },
    keyStore: { getKey: vi.fn().mockReturnValue('test-key') },
    telemetryWriter,
    persistentMemory: {
      retrieve: vi.fn().mockResolvedValue([]),
      persist: vi.fn().mockResolvedValue(undefined),
      pruneExpired: vi.fn().mockResolvedValue(0),
    },
    sessionMemory: {
      append: vi.fn(),
      getHistory: vi.fn().mockReturnValue([]),
      prune: vi.fn(),
      clearSession: vi.fn(),
    },
    // REAL PersonaLoader — will throw PersonaNotFoundError for 'risk-advisor'
    // until packages/ai-centre/src/agents/risk-advisor.md is created (Wave 7).
    personaLoader: new PersonaLoader(),
    healthRegistry: {
      getHealth: vi.fn().mockReturnValue(ProviderHealthStatus.HEALTHY),
      recordSuccess: vi.fn(),
      recordFailure: vi.fn(),
    },
    adapters: [makeMockPerplexityAdapter()],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// RED Gate Integration Test 1 — Deep search routing (AAWP Wave 7)
// ---------------------------------------------------------------------------

describe('Wave 7 CST — Deep search routing (GRS-006, GRS-007, APS §5.3, AAD §7)', () => {
  it(
    // AAWP Wave 7 integration test #1
    // GRS-006 | GRS-007 | APS §5.3 | AAD §7
    "ai.request({ capability: 'deep-search', ... }) routes to PerplexityAdapter and returns DeepSearchResult",
    async () => {
      // RED: PerplexityAdapter.ts does NOT exist yet.
      //      The import at the top of this file fails with "Cannot find module".
      //      vitest aborts loading the entire test file → ALL tests fail RED before
      //      any test body executes.
      //
      // GREEN (after Wave 7): api-builder creates PerplexityAdapter.ts →
      //      import resolves → PerplexityAdapter instantiated with injected mock fetch →
      //      gateway routes DEEP_SEARCH to 'perplexity' → execute() invokes mock fetch →
      //      mock fetch returns Perplexity-shaped response:
      //        { choices: [{ message: { content: '...' } }], citations: ['...'] }
      //      adapter parses summary from choices[0].message.content and citations array →
      //      returns DeepSearchResult → all assertions pass GREEN.
      const config = makeDeepSearchConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(makeDeepSearchRequest()) as AICentreResponse;

      expect(response.capability).toBe(Capability.DEEP_SEARCH);
      expect(response.result.capability).toBe(Capability.DEEP_SEARCH);
      const deepResult = response.result as DeepSearchResult;
      expect(typeof deepResult.summary).toBe('string');
      expect(deepResult.summary.length).toBeGreaterThan(0);
      expect(Array.isArray(deepResult.citations)).toBe(true);
      expect(deepResult.providerUsed).toBe('perplexity');
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 2 — XDetect persona (AAWP Wave 7)
// ---------------------------------------------------------------------------

describe('Wave 7 CST — XDetect advisor persona (APS §8.1)', () => {
  it(
    // AAWP Wave 7 integration test #2
    // APS §8.1 | AAD §7
    "PersonaLoader.load('xdetect-advisor') returns non-empty Markdown string",
    async () => {
      // RED: packages/ai-centre/src/agents/xdetect-advisor.md does not exist.
      //      PersonaLoader.load('xdetect-advisor') throws PersonaNotFoundError →
      //      test FAILS RED with the unhandled rejection.
      //
      // GREEN (after Wave 7): api-builder creates xdetect-advisor.md under
      //      packages/ai-centre/src/agents/ →
      //      PersonaLoader.load('xdetect-advisor') reads and returns the
      //      file content as a non-empty Markdown string → all assertions pass GREEN.
      const loader = new PersonaLoader();

      const persona = await loader.load('xdetect-advisor');

      expect(typeof persona).toBe('string');
      expect(persona.length).toBeGreaterThan(0);
      expect(persona.trim()).not.toBe('');
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 3 — Risk advisor persona (AAWP Wave 7)
// ---------------------------------------------------------------------------

describe('Wave 7 CST — Risk advisor persona (APS §8.1)', () => {
  it(
    // AAWP Wave 7 integration test #3
    // APS §8.1 | AAD §7
    "PersonaLoader.load('risk-advisor') returns non-empty Markdown string",
    async () => {
      // RED: packages/ai-centre/src/agents/risk-advisor.md does not exist.
      //      PersonaLoader.load('risk-advisor') throws PersonaNotFoundError →
      //      test FAILS RED with the unhandled rejection.
      //
      // GREEN (after Wave 7): api-builder creates risk-advisor.md under
      //      packages/ai-centre/src/agents/ →
      //      PersonaLoader.load('risk-advisor') reads and returns the
      //      file content as a non-empty Markdown string → all assertions pass GREEN.
      const loader = new PersonaLoader();

      const persona = await loader.load('risk-advisor');

      expect(typeof persona).toBe('string');
      expect(persona.length).toBeGreaterThan(0);
      expect(persona.trim()).not.toBe('');
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 4 — Risk advisor domain review evidence (AAWP Wave 7)
// ---------------------------------------------------------------------------

describe('Wave 7 CST — Risk advisor domain review evidence (GRS-007, APS §8.1, AAD §7)', () => {
  it(
    // AAWP Wave 7 integration test #4
    // GRS-007 | APS §8.1 | AAD §7
    "ai.request({ capability: 'deep-search', agent: 'risk-advisor', ... }) succeeds and logs telemetry when persona is loaded",
    async () => {
      // RED condition (before Wave 7):
      //   The REAL PersonaLoader (injected via makeRiskAdvisorConfig) throws PersonaNotFoundError
      //   for 'risk-advisor' because the persona file does not exist yet.
      //   Gateway catches the error and returns AICentreErrorResponse { errorCode: UNKNOWN_AGENT }.
      //   Casting to AICentreResponse, response.result is absent →
      //   response.result.capability throws TypeError → test FAILS RED.
      //
      // GREEN (after Wave 7): risk-advisor.md is created by api-builder →
      //   REAL PersonaLoader.load('risk-advisor') succeeds → gateway resolves routes
      //   DEEP_SEARCH → 'perplexity' → inline mock adapter.execute() returns
      //   DeepSearchResult { summary, citations, providerUsed: 'perplexity' } →
      //   gateway calls telemetryWriter.write() once with the resolved capability →
      //   all assertions pass GREEN.
      const config = makeRiskAdvisorConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(makeRiskAdvisorRequest()) as AICentreResponse;

      // Gateway must return a successful AICentreResponse (not an error response).
      expect(response.capability).toBe(Capability.DEEP_SEARCH);
      expect(response.result.capability).toBe(Capability.DEEP_SEARCH);

      // DeepSearchResult shape invariants.
      const deepResult = response.result as DeepSearchResult;
      expect(typeof deepResult.summary).toBe('string');
      expect(deepResult.summary.length).toBeGreaterThan(0);
      expect(Array.isArray(deepResult.citations)).toBe(true);
      expect(deepResult.providerUsed).toBe('perplexity');

      // Telemetry must have been written (GRS-007 audit trail requirement).
      expect(config.telemetryWriter.write).toHaveBeenCalledOnce();
    },
  );
});
