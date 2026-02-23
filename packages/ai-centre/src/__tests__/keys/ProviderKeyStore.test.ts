/**
 * RED Gate QA Suite — ProviderKeyStore
 *
 * All tests MUST FAIL until Wave 2 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-015 | APS §6.3 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-015  Central key management — all adapters obtain keys exclusively
 *            via ProviderKeyStore; no hardcoded keys or direct env reads in adapters
 */
import { describe, it, expect, afterEach } from 'vitest';
import { ProviderKeyStore } from '../../keys/ProviderKeyStore.js';
import { ProviderKeyNotFoundError } from '../../types/index.js';

// ---------------------------------------------------------------------------
// Tests (GRS-015)
// ---------------------------------------------------------------------------

describe('ProviderKeyStore', () => {
  afterEach(() => {
    // Clean up any env vars set during tests
    delete process.env['GITHUB_TOKEN'];
    delete process.env['OPENAI_API_KEY'];
    delete process.env['ANTHROPIC_API_KEY'];
    delete process.env['PERPLEXITY_API_KEY'];
    delete process.env['RUNWAY_API_KEY'];
  });

  it(
    // GRS-015 | AAD §9.2
    "getKey() returns the key for a configured provider",
    () => {
      process.env['GITHUB_TOKEN'] = 'ghp_test_token_12345';

      const store = new ProviderKeyStore();

      const key = store.getKey('github-models');

      expect(key).toBe('ghp_test_token_12345');
    },
  );

  it(
    // GRS-015 | AAD §9.2
    "getKey() throws ProviderKeyNotFoundError when the key is absent from the environment",
    () => {
      // Ensure the env var is NOT set
      delete process.env['OPENAI_API_KEY'];

      const store = new ProviderKeyStore();

      expect(() => store.getKey('openai')).toThrow(ProviderKeyNotFoundError);
    },
  );
});
