/**
 * RED Gate QA Suite — ProviderHealthRegistry
 *
 * All tests MUST FAIL until Wave 2 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-014 | APS §5.3 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-014  Graceful degradation / fallback via provider health tracking
 */
import { describe, it, expect } from 'vitest';
import { ProviderHealthRegistry } from '../../routing/ProviderHealthRegistry.js';
import { ProviderHealthStatus } from '../../types/index.js';

// ---------------------------------------------------------------------------
// Tests (GRS-014)
// ---------------------------------------------------------------------------

describe('ProviderHealthRegistry', () => {
  it(
    // GRS-014 | AAD §9.2
    "getHealth() returns HEALTHY for a newly registered provider",
    () => {
      const registry = new ProviderHealthRegistry();

      const status = registry.getHealth('github-models');

      expect(status).toBe(ProviderHealthStatus.HEALTHY);
    },
  );

  it(
    // GRS-014 | AAD §9.2
    "recordFailure() transitions provider to DEGRADED after configured threshold",
    () => {
      const registry = new ProviderHealthRegistry();

      // Record failures up to (but not exceeding) the UNAVAILABLE threshold
      registry.recordFailure('github-models');
      registry.recordFailure('github-models');
      registry.recordFailure('github-models');

      const status = registry.getHealth('github-models');

      expect(status).toBe(ProviderHealthStatus.DEGRADED);
    },
  );

  it(
    // GRS-014 | AAD §9.2
    "recordFailure() transitions provider to UNAVAILABLE after sustained failures",
    () => {
      const registry = new ProviderHealthRegistry();

      // Exceed the UNAVAILABLE threshold
      for (let i = 0; i < 10; i++) {
        registry.recordFailure('github-models');
      }

      const status = registry.getHealth('github-models');

      expect(status).toBe(ProviderHealthStatus.UNAVAILABLE);
    },
  );

  it(
    // GRS-014 | AAD §9.2
    "recordSuccess() transitions provider back toward HEALTHY",
    () => {
      const registry = new ProviderHealthRegistry();

      // First degrade the provider
      for (let i = 0; i < 10; i++) {
        registry.recordFailure('github-models');
      }
      expect(registry.getHealth('github-models')).toBe(ProviderHealthStatus.UNAVAILABLE);

      // Then record successes to recover
      registry.recordSuccess('github-models');
      registry.recordSuccess('github-models');
      registry.recordSuccess('github-models');

      const status = registry.getHealth('github-models');

      // Should be DEGRADED or HEALTHY after recoveries
      expect([ProviderHealthStatus.HEALTHY, ProviderHealthStatus.DEGRADED]).toContain(status);
    },
  );
});
