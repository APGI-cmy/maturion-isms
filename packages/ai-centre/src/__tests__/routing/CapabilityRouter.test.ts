/**
 * RED Gate QA Suite — CapabilityRouter
 *
 * All tests MUST FAIL until Wave 2 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-003, GRS-004 | APS §5.1, §5.2 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-003  Capability routing by type/cost/health
 *   GRS-004  Governed routing configuration
 */
import { describe, it, expect, vi } from 'vitest';
import { CapabilityRouter } from '../../routing/CapabilityRouter.js';
import {
  Capability,
  ProviderHealthStatus,
  type RoutingConfiguration,
  type ProviderHealthRegistry,
} from '../../types/index.js';

// ---------------------------------------------------------------------------
// Test doubles
// ---------------------------------------------------------------------------

function makeConfig(): RoutingConfiguration {
  return {
    routes: {
      [Capability.ADVISORY]: ['github-models', 'openai'],
      [Capability.ANALYSIS]: ['openai'],
      [Capability.EMBEDDINGS]: ['openai'],
      [Capability.DOCUMENT_GENERATION]: ['anthropic'],
      [Capability.IMAGE_GENERATION]: ['openai'],
      [Capability.DEEP_SEARCH]: ['perplexity'],
      [Capability.VIDEO_GENERATION]: ['runway'],
      [Capability.ALGORITHM_EXECUTION]: [],
    },
  };
}

function makeHealthyRegistry(): ProviderHealthRegistry {
  return {
    getHealth: vi.fn().mockReturnValue(ProviderHealthStatus.HEALTHY),
    recordSuccess: vi.fn(),
    recordFailure: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// Tests (GRS-003, GRS-004)
// ---------------------------------------------------------------------------

describe('CapabilityRouter', () => {
  it(
    // GRS-003 | AAD §9.2
    "resolveProviders() returns providers in priority order for a healthy capability",
    () => {
      const router = new CapabilityRouter(makeConfig());
      const registry = makeHealthyRegistry();

      const providers = router.resolveProviders(Capability.ADVISORY, registry);

      expect(providers).toEqual(['github-models', 'openai']);
    },
  );

  it(
    // GRS-003 | AAD §9.2
    "resolveProviders() excludes UNAVAILABLE providers from the returned list",
    () => {
      const router = new CapabilityRouter(makeConfig());
      const registry: ProviderHealthRegistry = {
        getHealth: vi
          .fn()
          .mockImplementation((p: string) =>
            p === 'github-models'
              ? ProviderHealthStatus.UNAVAILABLE
              : ProviderHealthStatus.HEALTHY,
          ),
        recordSuccess: vi.fn(),
        recordFailure: vi.fn(),
      };

      const providers = router.resolveProviders(Capability.ADVISORY, registry);

      expect(providers).not.toContain('github-models');
      expect(providers).toContain('openai');
    },
  );

  it(
    // GRS-003, GRS-014 | AAD §9.2
    "resolveProviders() returns empty array when all providers for a capability are UNAVAILABLE",
    () => {
      const router = new CapabilityRouter(makeConfig());
      const registry: ProviderHealthRegistry = {
        getHealth: vi.fn().mockReturnValue(ProviderHealthStatus.UNAVAILABLE),
        recordSuccess: vi.fn(),
        recordFailure: vi.fn(),
      };

      const providers = router.resolveProviders(Capability.ADVISORY, registry);

      expect(providers).toEqual([]);
    },
  );
});
