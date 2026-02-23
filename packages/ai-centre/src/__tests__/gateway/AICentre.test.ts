/**
 * RED Gate QA Suite — AICentre Gateway
 *
 * All tests MUST FAIL until Wave 2 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-001, GRS-002, GRS-003, GRS-014 | APS §4 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-001  Single gateway entry point
 *   GRS-002  Typed request/response contract
 *   GRS-003  Capability routing by type/cost/health
 *   GRS-014  Graceful degradation / fallback
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AICentre } from '../../gateway/AICentre.js';
import {
  Capability,
  AICentreErrorCode,
  ProviderHealthStatus,
  type AICentreConfig,
  type AICentreRequest,
  type AICentreResponse,
  type AICentreErrorResponse,
} from '../../types/index.js';

// ---------------------------------------------------------------------------
// Minimal test doubles
// ---------------------------------------------------------------------------

function makeRequest(overrides: Partial<AICentreRequest> = {}): AICentreRequest {
  return {
    capability: Capability.ADVISORY,
    agent: 'mat-advisor',
    input: { text: 'What is my maturity score?' },
    context: { organisationId: 'org-001', sessionId: 'sess-001' },
    ...overrides,
  };
}

function makeConfig(): AICentreConfig {
  return {
    routing: {
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
    },
    keyStore: { getKey: vi.fn().mockReturnValue('test-key') },
    telemetryWriter: { write: vi.fn().mockResolvedValue('tel-id-001') },
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
      load: vi.fn().mockResolvedValue('# MAT Advisor\nYou are a maturity advisor.'),
      listAvailable: vi.fn().mockResolvedValue(['mat-advisor']),
    },
    healthRegistry: {
      getHealth: vi.fn().mockReturnValue(ProviderHealthStatus.HEALTHY),
      recordSuccess: vi.fn(),
      recordFailure: vi.fn(),
    },
    adapters: [
      {
        providerName: 'github-models' as const,
        supportedCapabilities: new Set([Capability.ADVISORY]),
        execute: vi.fn().mockResolvedValue({
          capability: Capability.ADVISORY,
          text: 'Your maturity score is 3.2.',
          providerUsed: 'github-models',
        }),
        healthCheck: vi.fn().mockResolvedValue(ProviderHealthStatus.HEALTHY),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Tests (GRS-001, GRS-002, GRS-003, GRS-014)
// ---------------------------------------------------------------------------

describe('AICentre Gateway', () => {
  let config: AICentreConfig;

  beforeEach(() => {
    config = makeConfig();
  });

  it(
    // GRS-001, GRS-002 | AAD §9.2
    "request() returns AICentreResponse for a valid advisory request",
    async () => {
      const gateway = new AICentre(config);
      const response = await gateway.request(makeRequest()) as AICentreResponse;

      expect(response).toBeDefined();
      expect(response.capability).toBe(Capability.ADVISORY);
      expect(response.result).toBeDefined();
      expect(response.telemetry).toBeDefined();
    },
  );

  it(
    // GRS-003, GRS-014 | AAD §9.2
    "request() routes to fallback adapter when primary provider is UNAVAILABLE",
    async () => {
      // Primary provider (github-models) is UNAVAILABLE; fallback (openai) should be tried
      config.healthRegistry.getHealth = vi
        .fn()
        .mockImplementation((provider: string) =>
          provider === 'github-models'
            ? ProviderHealthStatus.UNAVAILABLE
            : ProviderHealthStatus.HEALTHY,
        );
      config.adapters.push({
        providerName: 'openai' as const,
        supportedCapabilities: new Set([Capability.ADVISORY]),
        execute: vi.fn().mockResolvedValue({
          capability: Capability.ADVISORY,
          text: 'Fallback response.',
          providerUsed: 'openai',
        }),
        healthCheck: vi.fn().mockResolvedValue(ProviderHealthStatus.HEALTHY),
      });

      const gateway = new AICentre(config);
      const response = await gateway.request(makeRequest()) as AICentreResponse;

      expect((response.result as { providerUsed: string }).providerUsed).toBe('openai');
    },
  );

  it(
    // GRS-014 | AAD §9.2
    "request() returns ALL_PROVIDERS_UNAVAILABLE when all providers are UNAVAILABLE",
    async () => {
      config.healthRegistry.getHealth = vi
        .fn()
        .mockReturnValue(ProviderHealthStatus.UNAVAILABLE);

      const gateway = new AICentre(config);
      const response = await gateway.request(makeRequest()) as AICentreErrorResponse;

      expect(response.errorCode).toBe(AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE);
    },
  );

  it(
    // GRS-002 | AAD §9.2
    "request() returns UNKNOWN_AGENT when agentId does not match any persona file",
    async () => {
      config.personaLoader.load = vi
        .fn()
        .mockRejectedValue(new Error('PersonaNotFoundError: unknown-agent'));

      const gateway = new AICentre(config);
      const response = await gateway.request(
        makeRequest({ agent: 'unknown-agent' }),
      ) as AICentreErrorResponse;

      expect(response.errorCode).toBe(AICentreErrorCode.UNKNOWN_AGENT);
    },
  );

  it(
    // GRS-012 | AAD §9.2
    "request() writes a TelemetryEvent for every call (success and failure)",
    async () => {
      const gateway = new AICentre(config);
      await gateway.request(makeRequest());

      expect(config.telemetryWriter.write).toHaveBeenCalledTimes(1);
    },
  );

  it(
    // GRS-002, GRS-014 | AAD §9.2
    "request() never exposes raw provider error messages in AICentreErrorResponse",
    async () => {
      const rawError = new Error('Raw provider SDK error: token expired, retry with x-api-key');
      config.adapters[0]!.execute = vi.fn().mockRejectedValue(rawError);
      config.healthRegistry.getHealth = vi
        .fn()
        .mockReturnValue(ProviderHealthStatus.UNAVAILABLE);

      const gateway = new AICentre(config);
      const response = await gateway.request(makeRequest()) as AICentreErrorResponse;

      expect(response.message).not.toContain('token expired');
      expect(response.message).not.toContain('x-api-key');
    },
  );

  it(
    // GRS-030 | AAD §9.2
    "request() calls MemoryLifecycle.recordTurn() after every successful response",
    async () => {
      const recordTurn = vi.fn().mockResolvedValue(undefined);
      config.memoryLifecycle = {
        assembleContextWindow: vi.fn().mockResolvedValue([]),
        recordTurn,
        pruneSession: vi.fn(),
        pruneExpiredPersistentMemory: vi.fn().mockResolvedValue(0),
      };

      const gateway = new AICentre(config);
      await gateway.request(makeRequest());

      expect(recordTurn).toHaveBeenCalledTimes(1);
    },
  );
});
