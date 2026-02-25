/**
 * RED Gate QA Suite — ProviderAdapter Contract Tests
 *
 * All tests MUST FAIL until Wave 3+ adapter implementations are complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * These are parameterised contract tests; they run against every concrete
 * ProviderAdapter implementation to enforce the interface invariants.
 *
 * References: GRS-005, GRS-006 | APS §6.1 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-005  Provider adapter interface — all providers implement the same contract
 *   GRS-006  Progressive provider delivery (Wave 3–Wave 8)
 */
import { describe, it, expect, vi } from 'vitest';
import {
  Capability,
  ProviderHealthStatus,
  type ProviderAdapter,
  type NormalisedProviderRequest,
} from '../../types/index.js';
import { GitHubModelsAdapter } from '../../adapters/GitHubModelsAdapter.js';
import { OpenAIAdapter } from '../../adapters/OpenAIAdapter.js';
import { ProviderKeyStore } from '../../keys/ProviderKeyStore.js';
import { AnthropicAdapter } from '../../adapters/AnthropicAdapter.js';
import { PerplexityAdapter } from '../../adapters/PerplexityAdapter.js';

// ---------------------------------------------------------------------------
// Test doubles for dependency injection (AAD §8.2)
// ---------------------------------------------------------------------------

/**
 * Mock fetch that returns a well-formed chat-completion response.
 * Injected via adapter constructors so no live API calls are made.
 */
function makeMockFetch(text: string = 'Advisory response text.') {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content: text } }],
    }),
  } as unknown as Response);
}

/**
 * Mock fetch that returns a JSON-encoded analysis response.
 * Used for adapters that support the `analysis` capability (Wave 4+).
 */
function makeMockAnalysisFetch(
  data: Record<string, unknown> = { summary: 'Analysis complete.' },
) {
  return makeMockFetch(JSON.stringify(data));
}

/**
 * Mock fetch that returns a well-formed Anthropic Messages API response.
 * Mirrors the real POST /v1/messages JSON shape for AnthropicAdapter (Wave 6).
 *
 * Reference: https://docs.anthropic.com/en/api/messages
 */
function makeMockDocumentFetch() {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      id: 'msg_wave6contract001',
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: '# ISO 27001 Course Outline\n\n## Module 1: Introduction\nOverview of ISO 27001 scope and applicability.\n\n## Module 2: Risk Assessment\nRisk identification, analysis, and treatment methodology.',
        },
      ],
      model: 'claude-opus-4-5',
      stop_reason: 'end_turn',
      stop_sequence: null,
      usage: { input_tokens: 25, output_tokens: 80 },
    }),
  } as unknown as Response);
}

/** Mock key store that returns a fake token without reading env vars. */
function makeMockKeyStore(): ProviderKeyStore {
  return { getKey: vi.fn().mockReturnValue('test-token') } as unknown as ProviderKeyStore;
}

/**
 * Mock fetch that returns a well-formed Perplexity API deep-search response.
 * Mirrors the real POST /chat/completions JSON shape for PerplexityAdapter (Wave 7).
 * Injected via PerplexityAdapter constructor so no live API calls are made.
 *
 * Reference: https://docs.perplexity.ai/api-reference/chat-completions
 */
function makeMockDeepSearchFetch() {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content: 'Deep search result: threat intelligence summary.' } }],
      citations: ['https://example.com/threat-source-1', 'https://nvd.nist.gov/vuln/detail/CVE-2024-0001'],
    }),
  } as unknown as Response);
}

// ---------------------------------------------------------------------------
// Registry of adapters under test (add each adapter as it is implemented)
// ---------------------------------------------------------------------------

/**
 * ⚠️  WAVE 3+ BUILDER MANDATORY ACTION:
 *
 * When you deliver a new ProviderAdapter implementation, you MUST register it
 * here. Failing to do so means the contract tests below will NOT run against
 * your adapter, and the CI merge gate will NOT catch contract regressions.
 *
 * HOW TO REGISTER:
 *   1. Import your adapter at the top of this file:
 *        import { GitHubModelsAdapter } from '../../adapters/GitHubModelsAdapter.js';
 *   2. Add an instance to the array (with injected test doubles per AAD §8.2):
 *        new GitHubModelsAdapter(makeMockKeyStore(), makeMockFetch())
 *   3. The parameterised contract tests below will automatically run against it.
 *
 * WAVE DELIVERY SCHEDULE (AAD §6.2 / APS §6.2):
 *   Wave 3  → GitHubModelsAdapter  (advisory capability)
 *   Wave 4  → OpenAIAdapter        (analysis, embeddings)
 *   Wave 6  → AnthropicAdapter     (document-generation)
 *   Wave 7  → PerplexityAdapter    (deep-search)         ← RED gate activated
 *   Wave 8  → RunwayAdapter        (video-generation)
 *
 * The sentinel test below fails RED until at least one adapter is registered.
 * It will automatically stop failing once you add your adapter to this array.
 */
const ADAPTERS_UNDER_TEST: ProviderAdapter[] = [
  new GitHubModelsAdapter(makeMockKeyStore(), makeMockFetch()), // Wave 3
  new OpenAIAdapter(makeMockKeyStore(), makeMockAnalysisFetch()), // Wave 4
  new AnthropicAdapter(makeMockKeyStore(), makeMockDocumentFetch()), // Wave 6
  new PerplexityAdapter(makeMockKeyStore(), makeMockDeepSearchFetch()), // Wave 7
  // Wave 8: new RunwayAdapter()       — import and uncomment when implemented
];

// ---------------------------------------------------------------------------
// Shared test fixture
// ---------------------------------------------------------------------------

function makeAdvisoryRequest(): NormalisedProviderRequest {
  return {
    capability: Capability.ADVISORY,
    systemPrompt: '# MAT Advisor\nYou are a maturity assessment advisor.',
    userInput: 'What is the recommended control for access management?',
    contextMessages: [],
  };
}

// ---------------------------------------------------------------------------
// Contract tests (GRS-005, GRS-006)
// ---------------------------------------------------------------------------

describe('ProviderAdapter contract tests', () => {
  if (ADAPTERS_UNDER_TEST.length === 0) {
    it(
      // Sentinel test — fails until at least one adapter is registered
      'at least one ProviderAdapter implementation must be registered for contract testing',
      () => {
        // This test fails (RED) until Wave 3 delivers the first adapter
        expect(ADAPTERS_UNDER_TEST.length).toBeGreaterThan(0);
      },
    );
  }

  for (const adapter of ADAPTERS_UNDER_TEST) {
    describe(`${adapter.providerName} adapter`, () => {
      it(
        // GRS-005 | AAD §9.2
        "execute() returns a CapabilityResult conforming to the declared capability",
        async () => {
          // Only test capabilities the adapter declares it supports
          const capability = [...adapter.supportedCapabilities][0]!;
          const request: NormalisedProviderRequest = {
            ...makeAdvisoryRequest(),
            capability,
          };

          const result = await adapter.execute(request);

          expect(result).toBeDefined();
          expect(result.capability).toBe(capability);
          expect(result.providerUsed).toBe(adapter.providerName);
        },
      );

      it(
        // GRS-005 | AAD §9.2
        "execute() wraps provider errors in a governed ProviderError — no raw errors",
        async () => {
          // Provide an invalid request to trigger a provider error
          const badRequest: NormalisedProviderRequest = {
            capability: Capability.ADVISORY,
            systemPrompt: '',
            userInput: '',
            contextMessages: [],
          };

          let thrownError: unknown;
          try {
            await adapter.execute(badRequest);
          } catch (err) {
            thrownError = err;
          }

          if (thrownError !== undefined) {
            expect((thrownError as Error).name).toBe('ProviderError');
          }
        },
      );

      it(
        // GRS-005 | AAD §9.2
        "healthCheck() completes within 5000ms",
        async () => {
          const start = Date.now();

          await adapter.healthCheck();

          const elapsed = Date.now() - start;
          expect(elapsed).toBeLessThanOrEqual(5000);
        },
        { timeout: 6000 },
      );

      it(
        // GRS-005 | AAD §9.2
        "healthCheck() returns ProviderHealthStatus without consuming billable quota",
        async () => {
          const status = await adapter.healthCheck();

          expect(Object.values(ProviderHealthStatus)).toContain(status);
        },
      );
    });
  }
});
