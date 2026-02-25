/**
 * RED Gate QA Suite — Wave 5 Component System Tests (CST)
 *
 * All tests MUST FAIL until Wave 5 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-006 (embeddings), GRS-030 (RAG context assembly) | APS §6.2 | AAD §7 (Wave 5 row)
 *
 * Mapped requirements:
 *   GRS-006  OpenAI embeddings capability — /v1/embeddings endpoint, EmbeddingsResult shape
 *   GRS-030  Context window assembly order — domain knowledge at position 4
 *
 * AAWP Wave 5 mandated integration tests:
 *   1. ai.request({ capability: 'embeddings', ... }) routes to OpenAIAdapter → EmbeddingsResult
 *   2. EmbeddingsResult.vectors is a non-empty array of float arrays
 *   3. MemoryLifecycle with KnowledgeRetriever: domain knowledge appears before user input
 */
import { describe, it, expect, vi } from 'vitest';
import { MemoryLifecycle } from '../../memory/MemoryLifecycle.js';
import type { MemoryLifecycleDeps } from '../../memory/MemoryLifecycle.js';
import { OpenAIAdapter } from '../../adapters/OpenAIAdapter.js';
import { ProviderKeyStore } from '../../keys/ProviderKeyStore.js';
import { AICentre } from '../../gateway/AICentre.js';
import {
  Capability,
  ProviderHealthStatus,
  type AICentreConfig,
  type AICentreRequest,
  type AICentreResponse,
  type EmbeddingsResult,
  type KnowledgeEntry,
  type KnowledgeRetriever,
  type SessionMemoryStore,
  type PersistentMemoryAdapter,
  type MemoryTurn,
  type PersistedMemoryEntry,
} from '../../types/index.js';
import type { FetchFn } from '../../adapters/OpenAIAdapter.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(overrides: Partial<AICentreRequest> = {}): AICentreRequest {
  return {
    capability: Capability.EMBEDDINGS,
    agent: 'isms-navigator',
    input: { text: 'ISO 27001 access control requirements for MFA' },
    context: { organisationId: 'org-wave5', sessionId: 'sess-wave5', userId: 'user-001' },
    ...overrides,
  };
}

/** Mock key store that returns a fake token without reading env vars. */
function makeMockKeyStore(): ProviderKeyStore {
  return {
    getKey: vi.fn().mockReturnValue('test-token'),
  } as unknown as ProviderKeyStore;
}

/**
 * Mock fetch that returns a well-formed OpenAI embeddings response.
 * Mirrors the real /v1/embeddings JSON shape.
 */
function makeMockEmbeddingsFetch(): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      data: [
        { embedding: [0.1, 0.2, 0.3], index: 0, object: 'embedding' },
        { embedding: [0.4, 0.5, 0.6], index: 1, object: 'embedding' },
      ],
      model: 'text-embedding-3-small',
      object: 'list',
    }),
  } as unknown as Response);
}

function makeSessionStore(): SessionMemoryStore {
  const data: Record<string, MemoryTurn[]> = {};
  return {
    append: vi.fn((sessionId: string, turn: MemoryTurn) => {
      data[sessionId] = [...(data[sessionId] ?? []), turn];
    }),
    getHistory: vi.fn((sessionId: string) => data[sessionId] ?? []),
    prune: vi.fn(),
    clearSession: vi.fn((sessionId: string) => { delete data[sessionId]; }),
  };
}

function makePersistentAdapter(): PersistentMemoryAdapter {
  const store: PersistedMemoryEntry[] = [];
  return {
    retrieve: vi.fn(async () => [...store]),
    persist: vi.fn(async (entry: PersistedMemoryEntry) => { store.push(entry); }),
    pruneExpired: vi.fn(async () => 0),
  };
}

function makeKnowledgeRetriever(entries: KnowledgeEntry[] = []): KnowledgeRetriever {
  return {
    retrieve: vi.fn().mockResolvedValue(entries),
  };
}

/**
 * Build AICentreConfig wired for Wave 5 embeddings routing.
 * Uses the real OpenAIAdapter with injected mock fetch so no live API calls are made.
 * The OpenAIAdapter does NOT yet support EMBEDDINGS → execute() throws → tests fail RED.
 */
function makeEmbeddingsConfig(): AICentreConfig {
  const openaiAdapter = new OpenAIAdapter(makeMockKeyStore(), makeMockEmbeddingsFetch());

  return {
    routing: {
      routes: {
        [Capability.ADVISORY]: ['github-models'],
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
    telemetryWriter: { write: vi.fn().mockResolvedValue('tel-wave5-001') },
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
      load: vi.fn().mockResolvedValue('# ISMS Navigator\nYou are the Maturion ISMS Navigator.'),
      listAvailable: vi.fn().mockResolvedValue(['isms-navigator']),
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
// RED Gate Integration Test 1 — Embeddings capability routing (AAWP Wave 5)
// ---------------------------------------------------------------------------

describe('Wave 5 CST — Embeddings capability routing (GRS-006, APS §6.2)', () => {
  it(
    // AAWP Wave 5 integration test #1
    // GRS-006 | APS §6.2 | AAD §7
    "ai.request({ capability: 'embeddings', ... }) routes to OpenAIAdapter and returns EmbeddingsResult",
    async () => {
      // RED: OpenAIAdapter.supportedCapabilities does not include EMBEDDINGS.
      // The gateway will either find no capable adapter or the adapter will throw
      // ProviderError("Unsupported capability: embeddings").
      // Wave 5 builder must add EMBEDDINGS support to OpenAIAdapter.
      const config = makeEmbeddingsConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(makeRequest()) as AICentreResponse;

      expect(response.capability).toBe(Capability.EMBEDDINGS);
      expect(response.result.capability).toBe(Capability.EMBEDDINGS);
      expect(response.result.providerUsed).toBe('openai');
    },
  );

  it(
    // AAWP Wave 5 integration test #2
    // GRS-006 | APS §6.2 — EmbeddingsResult shape invariant
    'EmbeddingsResult.vectors is a non-empty array of float arrays',
    async () => {
      // RED: Same root cause — OpenAIAdapter does not yet support EMBEDDINGS.
      // Wave 5 builder must parse the embeddings response and populate vectors.
      const config = makeEmbeddingsConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(makeRequest()) as AICentreResponse;
      const result = response.result as EmbeddingsResult;

      // Must be a non-empty array
      expect(Array.isArray(result.vectors)).toBe(true);
      expect(result.vectors.length).toBeGreaterThan(0);

      // Each element must be a non-empty array of numbers (the embedding vector)
      for (const vector of result.vectors) {
        expect(Array.isArray(vector)).toBe(true);
        expect(vector.length).toBeGreaterThan(0);
        expect(vector.every((n) => typeof n === 'number')).toBe(true);
      }
    },
  );
});

// ---------------------------------------------------------------------------
// RED Gate Integration Test 3 — RAG context assembly (AAWP Wave 5)
// ---------------------------------------------------------------------------

describe('Wave 5 CST — MemoryLifecycle with KnowledgeRetriever (GRS-030)', () => {
  it(
    // AAWP Wave 5 integration test #3
    // GRS-030 | APS §7.3 | AAD §7
    'MemoryLifecycle with KnowledgeRetriever: domain knowledge appears in assembled context before user input',
    async () => {
      // RED: MemoryLifecycleDeps does not yet accept knowledgeRetriever.
      // The retriever is silently ignored → no domain knowledge segments appear.
      // Wave 5 builder must:
      //   1. Add knowledgeRetriever to MemoryLifecycleDeps
      //   2. Wire step 4 of assembleContextWindow to call retrieve() and insert segments
      //      between session memory and the user input (GRS-030 order).
      const knowledgeEntries: KnowledgeEntry[] = [
        {
          content: 'ISO 27001 clause 9.1: Performance evaluation and monitoring.',
          source: 'iso27001-clause-9',
        },
        {
          content: 'NIST SP 800-53 CA-7: Continuous monitoring requirement.',
          source: 'nist-800-53',
        },
      ];
      const retriever = makeKnowledgeRetriever(knowledgeEntries);

      const deps: MemoryLifecycleDeps = {
        sessionStore: makeSessionStore(),
        persistentAdapter: makePersistentAdapter(),
        // RED: not yet a valid key in MemoryLifecycleDeps — cast required
        knowledgeRetriever: retriever,
      } as unknown as MemoryLifecycleDeps;

      const lifecycle = new MemoryLifecycle(deps);

      const userInput = 'What monitoring controls do I need?';
      const assembled = await lifecycle.assembleContextWindow({
        organisationId: 'org-wave5',
        sessionId: 'sess-wave5',
        userInput,
        personaSystemPrompt: '# ISMS Navigator',
      });

      const userInputIdx = assembled.findIndex(
        (s) => s.role === 'user' && s.content === userInput,
      );

      const isoKnowledgeIdx = assembled.findIndex((s) =>
        s.content.includes('ISO 27001 clause 9.1'),
      );
      const nistKnowledgeIdx = assembled.findIndex((s) =>
        s.content.includes('NIST SP 800-53 CA-7'),
      );

      // Both knowledge entries must appear in the context
      expect(isoKnowledgeIdx).toBeGreaterThanOrEqual(0);
      expect(nistKnowledgeIdx).toBeGreaterThanOrEqual(0);

      // Both must appear BEFORE the user input (GRS-030 canonical order)
      expect(isoKnowledgeIdx).toBeLessThan(userInputIdx);
      expect(nistKnowledgeIdx).toBeLessThan(userInputIdx);

      // retriever.retrieve() must have been called with the userInput as query
      expect(retriever.retrieve).toHaveBeenCalledWith(
        userInput,
        'org-wave5',
        expect.anything(),
      );
    },
  );
});
