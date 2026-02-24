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
import { describe, it, expect } from 'vitest';
import {
  Capability,
  ProviderHealthStatus,
  type ProviderAdapter,
  type NormalisedProviderRequest,
} from '../../types/index.js';
import { GitHubModelsAdapter } from '../../adapters/GitHubModelsAdapter.js';

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
 *   2. Add an instance to the array:
 *        new GitHubModelsAdapter()
 *   3. The parameterised contract tests below will automatically run against it.
 *
 * WAVE DELIVERY SCHEDULE (AAD §6.2 / APS §6.2):
 *   Wave 3  → GitHubModelsAdapter  (advisory capability)
 *   Wave 4  → OpenAIAdapter        (analysis, embeddings)
 *   Wave 6  → AnthropicAdapter     (document-generation)
 *   Wave 7  → PerplexityAdapter    (deep-search)
 *   Wave 8  → RunwayAdapter        (video-generation)
 *
 * The sentinel test below fails RED until at least one adapter is registered.
 * It will automatically stop failing once you add your adapter to this array.
 */
const ADAPTERS_UNDER_TEST: ProviderAdapter[] = [
  new GitHubModelsAdapter(), // Wave 3
  // Wave 4: new OpenAIAdapter()       — import and uncomment when implemented
  // Wave 6: new AnthropicAdapter()    — import and uncomment when implemented
  // Wave 7: new PerplexityAdapter()   — import and uncomment when implemented
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
