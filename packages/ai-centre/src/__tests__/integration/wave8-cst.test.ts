/**
 * RED Gate QA Suite — Wave 8 Component System Tests (CST)
 *
 * All tests MUST FAIL until Wave 8 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-006, GRS-012 | APS §6.1 | AAD §7 (Wave 8 row)
 *
 * Mapped requirements:
 *   GRS-006  Progressive provider delivery — video-generation capability via Runway API;
 *            RunwayAdapter wraps /v1/image_to_video endpoint
 *   GRS-006  Progressive provider delivery — algorithm-execution capability via OpenAI /v1/responses (o3)
 *   GRS-012  Telemetry — capability field must be VIDEO_GENERATION for video generation requests
 *
 * AAWP Wave 8 mandated integration tests:
 *   1. ai.request({ capability: 'video-generation', ... }) routes to RunwayAdapter
 *      → VideoGenerationResult shape verified (videoUrl, providerUsed)
 *   2. ai.request({ capability: 'algorithm-execution', ... }) routes to OpenAIAdapter (o3 model)
 *      → AlgorithmExecutionResult shape verified (output, providerUsed)
 *   3. All five adapters have live execute() — no 'Not implemented' error thrown
 *   4. Telemetry record written for video-generation with capability: VIDEO_GENERATION (GRS-012)
 */

import { describe, it, expect, vi } from 'vitest';
import { RunwayAdapter } from '../../adapters/RunwayAdapter.js';
import type { FetchFn } from '../../adapters/RunwayAdapter.js';
import { GitHubModelsAdapter } from '../../adapters/GitHubModelsAdapter.js';
import { OpenAIAdapter } from '../../adapters/OpenAIAdapter.js';
import { AnthropicAdapter } from '../../adapters/AnthropicAdapter.js';
import { PerplexityAdapter } from '../../adapters/PerplexityAdapter.js';
import { AICentre } from '../../gateway/AICentre.js';
import {
  Capability,
  ProviderHealthStatus,
  type AICentreConfig,
  type AICentreRequest,
  type AICentreResponse,
  type VideoGenerationResult,
  type AlgorithmExecutionResult,
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

function makeMockVideoFetch(): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true, status: 200,
    json: async () => ({
      id: 'task_wave8_001',
      output: ['https://cdn.runwayml.com/generated/wave8-test.mp4'],
    }),
  } as unknown as Response);
}

function makeMockAlgoFetch() {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      id: 'resp_wave8_001',
      output: [{ type: 'message', content: [{ type: 'output_text', text: 'Algorithm result.' }] }],
    }),
  } as unknown as Response);
}

function makeMockChatFetch(text: string = 'Advisory response text.') {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content: text } }],
    }),
  } as unknown as Response);
}

function makeMockDocumentFetch() {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      id: 'msg_wave8doc001',
      type: 'message',
      role: 'assistant',
      content: [{ type: 'text', text: '# Document\n\nContent here.' }],
      model: 'claude-opus-4-5',
      stop_reason: 'end_turn',
      stop_sequence: null,
      usage: { input_tokens: 10, output_tokens: 20 },
    }),
  } as unknown as Response);
}

function makeMockDeepSearchFetch() {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content: 'Deep search summary.' } }],
      citations: ['https://example.com/source1'],
    }),
  } as unknown as Response);
}

/**
 * Full routing table — all capabilities must be present.
 */
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

function makeVideoRequest(): AICentreRequest {
  return {
    capability: Capability.VIDEO_GENERATION,
    input: {
      text: 'Generate a short video of a maturity assessment dashboard.',
    },
    context: {
      organisationId: 'org-wave8',
      sessionId: 'sess-wave8-video',
      userId: 'user-001',
    },
  };
}

function makeAlgoRequest(): AICentreRequest {
  return {
    capability: Capability.ALGORITHM_EXECUTION,
    input: {
      text: 'Calculate the ISO 27001 maturity score for the given control set.',
    },
    context: {
      organisationId: 'org-wave8',
      sessionId: 'sess-wave8-algo',
      userId: 'user-001',
    },
  };
}

function makeVideoConfig(
  overrides: Partial<AICentreConfig> = {},
): AICentreConfig & { telemetryWriter: { write: ReturnType<typeof vi.fn> } } {
  const telemetryWriter = { write: vi.fn().mockResolvedValue('tel-wave8-video-001') };
  const runwayAdapter = new RunwayAdapter(makeMockKeyStore(), makeMockVideoFetch());

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
    personaLoader: {
      load: vi.fn().mockResolvedValue(''),
      listAvailable: vi.fn().mockResolvedValue([]),
    },
    healthRegistry: {
      getHealth: vi.fn().mockReturnValue(ProviderHealthStatus.HEALTHY),
      recordSuccess: vi.fn(),
      recordFailure: vi.fn(),
    },
    adapters: [runwayAdapter],
    ...overrides,
  };
}

function makeAlgoConfig(): AICentreConfig {
  const openaiAdapter = new OpenAIAdapter(makeMockKeyStore(), makeMockAlgoFetch());

  return {
    routing: { routes: FULL_ROUTE_MAP },
    keyStore: { getKey: vi.fn().mockReturnValue('test-key') },
    telemetryWriter: { write: vi.fn().mockResolvedValue('tel-wave8-algo-001') },
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
// RED Gate Integration Test 1 — Video generation routing (AAWP Wave 8)
// ---------------------------------------------------------------------------

describe('Wave 8 CST — Video generation routing (GRS-006, AAD §7)', () => {
  it(
    // AAWP Wave 8 integration test #1
    // GRS-006 | AAD §7
    "ai.request({ capability: 'video-generation', ... }) routes to RunwayAdapter and returns VideoGenerationResult",
    async () => {
      const config = makeVideoConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(makeVideoRequest()) as AICentreResponse;

      expect(response.capability).toBe(Capability.VIDEO_GENERATION);
      expect(response.result.capability).toBe(Capability.VIDEO_GENERATION);
      const videoResult = response.result as VideoGenerationResult;
      expect(typeof videoResult.videoUrl).toBe('string');
      expect(videoResult.videoUrl.length).toBeGreaterThan(0);
      expect(videoResult.providerUsed).toBe('runway');
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 2 — Algorithm execution routing (AAWP Wave 8)
// ---------------------------------------------------------------------------

describe('Wave 8 CST — Algorithm execution routing (GRS-006, AAD §7)', () => {
  it(
    // AAWP Wave 8 integration test #2
    // GRS-006 | AAD §7
    "ai.request({ capability: 'algorithm-execution', ... }) routes to OpenAIAdapter (o3 model) and returns AlgorithmExecutionResult",
    async () => {
      const config = makeAlgoConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(makeAlgoRequest()) as AICentreResponse;

      expect(response.capability).toBe(Capability.ALGORITHM_EXECUTION);
      expect(response.result.capability).toBe(Capability.ALGORITHM_EXECUTION);
      const algoResult = response.result as AlgorithmExecutionResult;
      expect(algoResult.output).toBeDefined();
      expect(algoResult.providerUsed).toBe('openai');
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 3 — All five adapters have live execute() (AAWP Wave 8)
// ---------------------------------------------------------------------------

describe('Wave 8 CST — All five adapters have live execute() (GRS-005, AAD §9.2)', () => {
  it(
    // AAWP Wave 8 integration test #3
    // GRS-005 | AAD §9.2
    "All five adapters have live execute() — no 'Not implemented' error thrown",
    async () => {
      const adapters: ProviderAdapter[] = [
        new GitHubModelsAdapter(makeMockKeyStore(), makeMockChatFetch()),
        new OpenAIAdapter(makeMockKeyStore(), makeMockChatFetch()),
        new AnthropicAdapter(makeMockKeyStore(), makeMockDocumentFetch()),
        new PerplexityAdapter(makeMockKeyStore(), makeMockDeepSearchFetch()),
        new RunwayAdapter(makeMockKeyStore(), makeMockVideoFetch()),
      ];

      for (const adapter of adapters) {
        const capability = [...adapter.supportedCapabilities][0]!;
        const request = {
          capability,
          systemPrompt: '',
          userInput: 'test input',
          contextMessages: [] as [],
        };

        let thrownError: unknown;
        try {
          await adapter.execute(request);
        } catch (err) {
          thrownError = err;
        }

        if (thrownError !== undefined) {
          expect((thrownError as Error).message).not.toContain('Not implemented');
        }
      }
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 4 — Telemetry for video-generation (AAWP Wave 8)
// ---------------------------------------------------------------------------

describe('Wave 8 CST — Telemetry for video-generation (GRS-012, AAD §7)', () => {
  it(
    // AAWP Wave 8 integration test #4
    // GRS-012 | AAD §7
    "Telemetry record written for video-generation with capability: VIDEO_GENERATION (GRS-012)",
    async () => {
      const config = makeVideoConfig();
      const gateway = new AICentre(config);

      await gateway.request(makeVideoRequest());

      expect(config.telemetryWriter.write).toHaveBeenCalledOnce();
      const [[telemetryEvent]] = config.telemetryWriter.write.mock.calls as [[{ capability: Capability }]];
      expect(telemetryEvent.capability).toBe(Capability.VIDEO_GENERATION);
    },
  );
});
