/**
 * RED Gate QA Suite — Wave 6 Component System Tests (CST)
 *
 * All tests MUST FAIL until Wave 6 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-006 (doc-gen, image-gen), GRS-014 (graceful degradation) |
 *             APS §5.3, §6.1, §8.1 | AAD §7 (Wave 6 row)
 *
 * Mapped requirements:
 *   GRS-006  Progressive provider delivery — document-generation (Anthropic Claude) and
 *            image-generation (OpenAI DALL-E 3) capabilities
 *   GRS-014  Graceful degradation — governed AICentreErrorResponse when all providers
 *            unavailable; no raw provider error surfaced to consumers
 *   APS §8.1 Persona loading — course-crafter-advisor persona file for Course Crafter module
 *
 * AAWP Wave 6 mandated integration tests:
 *   1. ai.request({ capability: 'document-generation', agent: 'course-crafter-advisor', ... })
 *      routes to (mock) AnthropicAdapter → DocumentGenerationResult shape verified
 *   2. ai.request({ capability: 'image-generation', ... }) routes to OpenAIAdapter (DALL-E 3)
 *      → ImageGenerationResult shape verified
 *   3. When healthRegistry marks 'anthropic' UNAVAILABLE, gateway returns governed
 *      AICentreErrorResponse(ALL_PROVIDERS_UNAVAILABLE) — no raw Error surfaced (GRS-014)
 *   4. PersonaLoader.load('course-crafter-advisor') returns non-empty Markdown string
 *
 * ─── RED CONDITIONS (before Wave 6) ───────────────────────────────────────────
 *
 *  Test 1 — PersonaLoader.load('course-crafter-advisor') throws PersonaNotFoundError
 *            because packages/ai-centre/src/agents/course-crafter-advisor.md does NOT
 *            exist yet. Gateway returns AICentreErrorResponse { errorCode: UNKNOWN_AGENT }.
 *            Assertions on DocumentGenerationResult.markdown fail RED.
 *
 *  Test 2 — OpenAIAdapter.supportedCapabilities does NOT include IMAGE_GENERATION.
 *            adapter.execute() throws ProviderError('Unsupported capability: image-generation').
 *            Gateway catches → ALL_PROVIDERS_UNAVAILABLE. Assertions on
 *            ImageGenerationResult.imageUrls fail RED.
 *
 *  Test 3 — PersonaLoader.load('course-crafter-advisor') throws PersonaNotFoundError.
 *            Gateway returns AICentreErrorResponse { errorCode: UNKNOWN_AGENT }.
 *            Assertion expect(errorCode).toBe(ALL_PROVIDERS_UNAVAILABLE) fails RED
 *            (UNKNOWN_AGENT ≠ ALL_PROVIDERS_UNAVAILABLE).
 *
 *  Test 4 — PersonaLoader.load('course-crafter-advisor') throws PersonaNotFoundError.
 *            Test fails RED with the thrown exception.
 *
 * ─── GREEN CONDITIONS (after Wave 6 deliverables) ────────────────────────────
 *
 *  Test 1 GREEN: course-crafter-advisor.md created → PersonaLoader succeeds →
 *                gateway routes DOCUMENT_GENERATION to 'anthropic' mock →
 *                mock adapter returns DocumentGenerationResult → all assertions pass.
 *
 *  Test 2 GREEN: api-builder adds IMAGE_GENERATION to OpenAIAdapter (DALL-E 3 endpoint) →
 *                execute() called with injected mock fetch → returns ImageGenerationResult →
 *                all assertions pass.
 *
 *  Test 3 GREEN: course-crafter-advisor.md created → PersonaLoader succeeds →
 *                gateway routes DOCUMENT_GENERATION to 'anthropic' →
 *                healthRegistry.getHealth('anthropic') → UNAVAILABLE → adapter skipped →
 *                execute() not called → ALL_PROVIDERS_UNAVAILABLE → all assertions pass.
 *
 *  Test 4 GREEN: course-crafter-advisor.md created → PersonaLoader.load() returns
 *                Markdown string → all assertions pass.
 */

import { describe, it, expect, vi } from 'vitest';
import { OpenAIAdapter } from '../../adapters/OpenAIAdapter.js';
import { PersonaLoader } from '../../personas/PersonaLoader.js';
import { AICentre } from '../../gateway/AICentre.js';
import {
  Capability,
  ProviderHealthStatus,
  AICentreErrorCode,
  type AICentreConfig,
  type AICentreRequest,
  type AICentreResponse,
  type AICentreErrorResponse,
  type DocumentGenerationResult,
  type ImageGenerationResult,
  type ProviderAdapter,
  type ProviderName,
} from '../../types/index.js';
import { ProviderKeyStore } from '../../keys/ProviderKeyStore.js';
import type { FetchFn } from '../../adapters/OpenAIAdapter.js';

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
 * Mock fetch returning a well-formed OpenAI DALL-E 3 image-generation response.
 * Mirrors the real POST /v1/images/generations JSON shape.
 * Injected into OpenAIAdapter so no live API calls are made.
 * This fetch will be exercised in GREEN state once api-builder extends OpenAIAdapter
 * with IMAGE_GENERATION support and routes calls to the DALL-E 3 endpoint.
 */
function makeMockDallE3Fetch(): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      created: Math.floor(Date.now() / 1000),
      data: [
        { url: 'https://example.com/generated-infographic-1.png' },
        { url: 'https://example.com/generated-infographic-2.png' },
      ],
    }),
  } as unknown as Response);
}

/**
 * Inline mock implementing the ProviderAdapter interface for 'anthropic'.
 *
 * Used in Tests 1 & 3 to exercise the ROUTING path through the gateway without
 * importing AnthropicAdapter.ts (which does not exist until Wave 6 api-builder
 * delivers it). The contract tests handle the real adapter's behaviour contract.
 *
 * In GREEN state, execute() is called by the gateway and returns a valid
 * DocumentGenerationResult satisfying all Test 1 assertions.
 *
 * @returns ProviderAdapter mock with providerName: 'anthropic', DOCUMENT_GENERATION capability.
 */
function makeMockAnthropicAdapter(): ProviderAdapter {
  return {
    providerName: 'anthropic' as const,
    supportedCapabilities: new Set([Capability.DOCUMENT_GENERATION]),
    execute: vi.fn().mockResolvedValue({
      capability: Capability.DOCUMENT_GENERATION,
      markdown: [
        '# ISO 27001 Course Outline',
        '',
        '## Module 1: Introduction to ISO 27001',
        'Overview of the standard, scope, and applicability to your organisation.',
        '',
        '## Module 2: Information Security Risk Assessment',
        'Risk identification, analysis, and treatment methodology.',
        '',
        '## Module 3: Annex A Controls Implementation',
        'Selecting and implementing controls aligned to your risk treatment plan.',
        '',
        '## Module 4: Audit Readiness',
        'Evidence collection, internal audit process, and certification preparation.',
      ].join('\n'),
      providerUsed: 'anthropic',
    } as DocumentGenerationResult),
    healthCheck: vi.fn().mockResolvedValue(ProviderHealthStatus.HEALTHY),
  };
}

function makeDocGenRequest(): AICentreRequest {
  return {
    capability: Capability.DOCUMENT_GENERATION,
    agent: 'course-crafter-advisor',
    input: { text: 'Create a course outline for ISO 27001' },
    context: {
      organisationId: 'org-wave6',
      sessionId: 'sess-wave6-docgen',
      userId: 'user-001',
    },
  };
}

function makeImageGenRequest(): AICentreRequest {
  return {
    capability: Capability.IMAGE_GENERATION,
    // No agent specified — persona loading is skipped; test focuses on adapter routing.
    input: { text: 'A professional infographic about cybersecurity' },
    context: {
      organisationId: 'org-wave6',
      sessionId: 'sess-wave6-imggen',
      userId: 'user-001',
    },
  };
}

/**
 * Full routing table — all capabilities must be present (consistent with prior wave CST
 * patterns in wave4-cst.test.ts and wave5-cst.test.ts).
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
 * Build AICentreConfig wired for document-generation routing tests (Tests 1 & 3).
 *
 * CRITICAL — uses REAL PersonaLoader:
 *   The real PersonaLoader is injected so that Tests 1 & 3 fail RED until
 *   packages/ai-centre/src/agents/course-crafter-advisor.md is created by api-builder.
 *   PersonaLoader.load('course-crafter-advisor') throws PersonaNotFoundError → gateway
 *   returns UNKNOWN_AGENT error → assertions on DocumentGenerationResult fail RED.
 *
 * Callers may pass partial `overrides` to adjust healthRegistry or adapters (Test 3).
 */
function makeDocGenConfig(overrides: Partial<AICentreConfig> = {}): AICentreConfig {
  return {
    routing: { routes: FULL_ROUTE_MAP },
    keyStore: { getKey: vi.fn().mockReturnValue('test-key') },
    telemetryWriter: { write: vi.fn().mockResolvedValue('tel-wave6-docgen-001') },
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
    // REAL PersonaLoader — will throw PersonaNotFoundError for 'course-crafter-advisor'
    // until packages/ai-centre/src/agents/course-crafter-advisor.md is created (Wave 6).
    personaLoader: new PersonaLoader(),
    healthRegistry: {
      getHealth: vi.fn().mockReturnValue(ProviderHealthStatus.HEALTHY),
      recordSuccess: vi.fn(),
      recordFailure: vi.fn(),
    },
    adapters: [makeMockAnthropicAdapter()],
    ...overrides,
  };
}

/**
 * Build AICentreConfig wired for image-generation routing tests (Test 2).
 *
 * Uses REAL OpenAIAdapter with injected DALL-E 3 mock fetch (AAD §8.2):
 *   OpenAIAdapter.supportedCapabilities does NOT include IMAGE_GENERATION → execute()
 *   throws ProviderError('Unsupported capability: image-generation') → gateway returns
 *   ALL_PROVIDERS_UNAVAILABLE → assertions on ImageGenerationResult fail RED.
 *   Wave 6 api-builder must extend OpenAIAdapter with IMAGE_GENERATION capability
 *   and implement the DALL-E 3 (/v1/images/generations) endpoint call.
 *
 * No 'agent' is specified in makeImageGenRequest() so the personaLoader is not called.
 */
function makeImageGenConfig(): AICentreConfig {
  // Real OpenAIAdapter — currently lacks IMAGE_GENERATION in supportedCapabilities.
  const openaiAdapter = new OpenAIAdapter(makeMockKeyStore(), makeMockDallE3Fetch());

  return {
    routing: { routes: FULL_ROUTE_MAP },
    keyStore: { getKey: vi.fn().mockReturnValue('test-key') },
    telemetryWriter: { write: vi.fn().mockResolvedValue('tel-wave6-imggen-001') },
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
    // Mocked personaLoader — no agent specified in image-gen request; persona loading skipped.
    personaLoader: {
      load: vi.fn().mockResolvedValue(''),
      listAvailable: vi.fn().mockResolvedValue([]),
    },
    healthRegistry: {
      getHealth: vi.fn().mockReturnValue(ProviderHealthStatus.HEALTHY),
      recordSuccess: vi.fn(),
      recordFailure: vi.fn(),
    },
    adapters: [openaiAdapter],
  };
}

// ---------------------------------------------------------------------------
// RED Gate Integration Test 1 — Document generation routing (AAWP Wave 6)
// ---------------------------------------------------------------------------

describe('Wave 6 CST — Document generation routing (GRS-006, APS §5.3, AAD §7)', () => {
  it(
    // AAWP Wave 6 integration test #1
    // GRS-006 | APS §5.3 | AAD §7
    "ai.request({ capability: 'document-generation', agent: 'course-crafter-advisor' }) routes to AnthropicAdapter and returns DocumentGenerationResult",
    async () => {
      // RED: PersonaLoader.load('course-crafter-advisor') throws PersonaNotFoundError because
      //      packages/ai-centre/src/agents/course-crafter-advisor.md does not exist yet.
      //      Gateway returns AICentreErrorResponse { errorCode: UNKNOWN_AGENT }.
      //      Casting the result to AICentreResponse, response.result is absent →
      //      response.result.capability throws TypeError → test FAILS RED.
      //
      // GREEN (after Wave 6): course-crafter-advisor.md is created by api-builder →
      //      PersonaLoader.load() succeeds → gateway resolves routes DOCUMENT_GENERATION →
      //      'anthropic' → mock adapter.execute() returns DocumentGenerationResult →
      //      all assertions pass GREEN.
      const config = makeDocGenConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(makeDocGenRequest()) as AICentreResponse;

      expect(response.capability).toBe(Capability.DOCUMENT_GENERATION);
      expect(response.result.capability).toBe(Capability.DOCUMENT_GENERATION);
      const docResult = response.result as DocumentGenerationResult;
      expect(typeof docResult.markdown).toBe('string');
      expect(docResult.markdown.length).toBeGreaterThan(0);
      expect(docResult.providerUsed).toBe('anthropic');
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 2 — Image generation routing (AAWP Wave 6)
// ---------------------------------------------------------------------------

describe('Wave 6 CST — Image generation routing (GRS-006, APS §5.3, AAD §7)', () => {
  it(
    // AAWP Wave 6 integration test #2
    // GRS-006 | APS §5.3 | AAD §7
    "ai.request({ capability: 'image-generation', ... }) routes to OpenAIAdapter (DALL-E 3) and returns ImageGenerationResult",
    async () => {
      // RED: OpenAIAdapter.supportedCapabilities does NOT include Capability.IMAGE_GENERATION.
      //      When the gateway calls adapter.execute({ capability: IMAGE_GENERATION, ... }),
      //      OpenAIAdapter throws ProviderError('Unsupported capability: image-generation').
      //      Gateway catches the error, calls healthRegistry.recordFailure('openai'), exhausts
      //      all configured providers, and returns AICentreErrorResponse { errorCode:
      //      ALL_PROVIDERS_UNAVAILABLE }.
      //      Casting to AICentreResponse, response.result is absent →
      //      response.result.capability throws TypeError → test FAILS RED.
      //
      // GREEN (after Wave 6): api-builder extends OpenAIAdapter to include IMAGE_GENERATION in
      //      supportedCapabilities and implements the DALL-E 3 /v1/images/generations call →
      //      execute() invokes the injected mock DALL-E 3 fetch → returns ImageGenerationResult →
      //      all assertions pass GREEN.
      const config = makeImageGenConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(makeImageGenRequest()) as AICentreResponse;

      expect(response.capability).toBe(Capability.IMAGE_GENERATION);
      expect(response.result.capability).toBe(Capability.IMAGE_GENERATION);
      const imgResult = response.result as ImageGenerationResult;
      expect(Array.isArray(imgResult.imageUrls)).toBe(true);
      expect(imgResult.imageUrls.length).toBeGreaterThan(0);
      expect(
        imgResult.imageUrls.every((url: string) => typeof url === 'string'),
      ).toBe(true);
      expect(imgResult.providerUsed).toBe('openai');
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 3 — Graceful degradation GRS-014 (AAWP Wave 6)
// ---------------------------------------------------------------------------

describe('Wave 6 CST — Graceful degradation when provider UNAVAILABLE (GRS-014)', () => {
  it(
    // AAWP Wave 6 integration test #3
    // GRS-014 | APS §5.3 | AAD §7
    "When AnthropicAdapter.healthCheck() returns UNAVAILABLE, gateway returns AICentreErrorResponse — no raw Error surfaced (GRS-014)",
    async () => {
      // RED condition (before Wave 6):
      //   The REAL PersonaLoader (injected via makeDocGenConfig) throws PersonaNotFoundError
      //   for 'course-crafter-advisor' because the persona file does not exist yet.
      //   Gateway returns AICentreErrorResponse { errorCode: UNKNOWN_AGENT }.
      //   Assertion: expect(errorCode).toBe(ALL_PROVIDERS_UNAVAILABLE) → FAILS RED
      //   because 'UNKNOWN_AGENT' ≠ 'ALL_PROVIDERS_UNAVAILABLE'.
      //
      // GREEN (after Wave 6): course-crafter-advisor.md is created by api-builder →
      //   PersonaLoader.load() succeeds → gateway routes DOCUMENT_GENERATION to 'anthropic' →
      //   healthRegistry.getHealth('anthropic') returns UNAVAILABLE (simulating a provider
      //   whose healthCheck() has reported unavailability) → gateway skips the adapter
      //   without calling execute() → exhausts all providers → returns AICentreErrorResponse
      //   { errorCode: ALL_PROVIDERS_UNAVAILABLE }.
      //   GRS-014 verified: no raw Error escapes the gateway; a governed error response is
      //   always returned when all providers are unavailable.
      //
      // Note: mockAdapter.execute is a spy — asserting it is NOT called verifies that the
      //       gateway correctly honours UNAVAILABLE health status (does not attempt execution).

      // Mock adapter that would successfully execute in HEALTHY state, but should be skipped
      // entirely when health registry reports UNAVAILABLE.
      const mockExecute = vi.fn();
      const mockAdapter: ProviderAdapter = {
        providerName: 'anthropic' as const,
        supportedCapabilities: new Set([Capability.DOCUMENT_GENERATION]),
        execute: mockExecute,
        healthCheck: vi.fn().mockResolvedValue(ProviderHealthStatus.UNAVAILABLE),
      };

      const config = makeDocGenConfig({
        // Override health registry to return UNAVAILABLE for 'anthropic'.
        // Simulates the scenario where AnthropicAdapter.healthCheck() has returned UNAVAILABLE
        // and the registry has been updated accordingly.
        healthRegistry: {
          getHealth: vi.fn().mockImplementation((provider: ProviderName) =>
            provider === 'anthropic'
              ? ProviderHealthStatus.UNAVAILABLE
              : ProviderHealthStatus.HEALTHY,
          ),
          recordSuccess: vi.fn(),
          recordFailure: vi.fn(),
        },
        adapters: [mockAdapter],
      });

      const gateway = new AICentre(config);

      // GRS-014: gateway MUST NOT surface a raw Error — wrap in try/catch to verify.
      let thrownError: unknown;
      let response: AICentreResponse | AICentreErrorResponse | undefined;

      try {
        response = await gateway.request({
          capability: Capability.DOCUMENT_GENERATION,
          agent: 'course-crafter-advisor',
          input: { text: 'Generate ISO 27001 training content' },
          context: { organisationId: 'org-wave6-grs014' },
        });
      } catch (err) {
        thrownError = err;
      }

      // GRS-014 invariant 1: no raw Error must escape the gateway boundary.
      expect(thrownError).toBeUndefined();

      // GRS-014 invariant 2: gateway must return a governed AICentreErrorResponse
      // with errorCode === ALL_PROVIDERS_UNAVAILABLE (not a raw throw, not UNKNOWN_AGENT).
      expect(response).toBeDefined();
      expect((response as AICentreErrorResponse).errorCode).toBe(
        AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE,
      );

      // GRS-014 invariant 3: execute() MUST NOT have been called on the UNAVAILABLE adapter.
      // Verifies the gateway correctly honours health registry UNAVAILABLE status by skipping
      // the adapter rather than attempting a doomed execution.
      expect(mockExecute).not.toHaveBeenCalled();
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 4 — Course Crafter persona (AAWP Wave 6)
// ---------------------------------------------------------------------------

describe('Wave 6 CST — Course Crafter persona (APS §8.1)', () => {
  it(
    // AAWP Wave 6 integration test #4
    // APS §8.1 | AAD §7
    "PersonaLoader.load('course-crafter-advisor') returns non-empty Markdown string",
    async () => {
      // RED: packages/ai-centre/src/agents/course-crafter-advisor.md does not exist.
      //      PersonaLoader.load('course-crafter-advisor') throws PersonaNotFoundError →
      //      test FAILS RED with the thrown exception (unhandled rejection).
      //
      // GREEN (after Wave 6): api-builder creates course-crafter-advisor.md under
      //      packages/ai-centre/src/agents/ → PersonaLoader.load() reads and returns the
      //      file content as a non-empty Markdown string → all assertions pass GREEN.
      const loader = new PersonaLoader();

      const persona = await loader.load('course-crafter-advisor');

      expect(typeof persona).toBe('string');
      expect(persona.length).toBeGreaterThan(0);
      expect(persona.trim()).not.toBe('');
    },
  );
});
