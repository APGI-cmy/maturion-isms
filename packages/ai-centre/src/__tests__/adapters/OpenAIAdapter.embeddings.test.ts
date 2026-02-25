/**
 * RED Gate QA Suite — OpenAIAdapter Embeddings
 *
 * All tests MUST FAIL until Wave 5 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-006 (embeddings), GRS-030 (RAG context assembly) | APS §6.2 | AAD §7 (Wave 5 row)
 */
import { describe, it, expect, vi } from 'vitest';
import {
  Capability,
  type NormalisedProviderRequest,
  type EmbeddingsResult,
} from '../../types/index.js';
import { OpenAIAdapter } from '../../adapters/OpenAIAdapter.js';
import { ProviderKeyStore } from '../../keys/ProviderKeyStore.js';
import type { FetchFn } from '../../adapters/OpenAIAdapter.js';

// ---------------------------------------------------------------------------
// Test doubles (AAD §8.2 — dependency injection for testability)
// ---------------------------------------------------------------------------

/** Mock key store that returns a fake token without reading env vars. */
function makeMockKeyStore(): ProviderKeyStore {
  return {
    getKey: vi.fn().mockReturnValue('test-token'),
  } as unknown as ProviderKeyStore;
}

/**
 * Mock fetch that returns a well-formed OpenAI embeddings response.
 * This is the shape returned by the real /v1/embeddings endpoint.
 */
function makeMockEmbeddingsFetch(): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      data: [{ embedding: [0.1, 0.2, 0.3], index: 0, object: 'embedding' }],
      model: 'text-embedding-3-small',
      object: 'list',
    }),
  } as unknown as Response);
}

/** Build a canonical EMBEDDINGS request. */
function makeEmbeddingsRequest(): NormalisedProviderRequest {
  return {
    capability: Capability.EMBEDDINGS,
    systemPrompt: '',
    userInput: 'ISO 27001 access control requirements',
    contextMessages: [],
  };
}

// ---------------------------------------------------------------------------
// RED Gate Tests — will FAIL until Wave 5 OpenAIAdapter.EMBEDDINGS support is built
// ---------------------------------------------------------------------------

describe('OpenAIAdapter — Wave 5 EMBEDDINGS capability (RED gate)', () => {
  it(
    // GRS-006 | APS §6.2 — Wave 5 adapter capability registration
    'supportedCapabilities includes Capability.EMBEDDINGS',
    () => {
      // RED: Currently only ANALYSIS and ADVISORY are registered.
      // Wave 5 builder must add Capability.EMBEDDINGS to the Set.
      const adapter = new OpenAIAdapter(makeMockKeyStore(), makeMockEmbeddingsFetch());

      expect(adapter.supportedCapabilities.has(Capability.EMBEDDINGS)).toBe(true);
    },
  );

  it(
    // GRS-006 | APS §6.2 — execute() returns correct result shape for EMBEDDINGS
    'execute() with EMBEDDINGS capability returns an EmbeddingsResult with vectors: number[][]',
    async () => {
      // RED: execute() currently throws ProviderError("Unsupported capability: embeddings")
      // because EMBEDDINGS is not in supportedCapabilities.
      const adapter = new OpenAIAdapter(makeMockKeyStore(), makeMockEmbeddingsFetch());

      const result = (await adapter.execute(makeEmbeddingsRequest())) as EmbeddingsResult;

      expect(result.capability).toBe(Capability.EMBEDDINGS);
      expect(result.providerUsed).toBe('openai');
      expect(Array.isArray(result.vectors)).toBe(true);
      expect(result.vectors.length).toBeGreaterThan(0);
    },
  );

  it(
    // GRS-006 | APS §6.2 — correct endpoint routing
    'execute() with EMBEDDINGS calls the /v1/embeddings endpoint, not /v1/chat/completions',
    async () => {
      // RED: execute() throws before making any fetch call because capability is unsupported.
      // Wave 5 builder must route EMBEDDINGS requests to the /v1/embeddings endpoint.
      const mockFetch = makeMockEmbeddingsFetch();
      const adapter = new OpenAIAdapter(makeMockKeyStore(), mockFetch);

      await adapter.execute(makeEmbeddingsRequest());

      // The fetch call must target the embeddings endpoint, not chat completions
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/embeddings'),
        expect.objectContaining({ method: 'POST' }),
      );
      expect(mockFetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/v1/chat/completions'),
        expect.anything(),
      );
    },
  );

  it(
    // GRS-006 | APS §6.2 — correct request body construction
    'execute() passes the userInput as the embedding input text in the request body',
    async () => {
      // RED: execute() throws before making any fetch call.
      // Wave 5 builder must pass userInput as the 'input' field of the embeddings request body.
      const mockFetch = makeMockEmbeddingsFetch();
      const adapter = new OpenAIAdapter(makeMockKeyStore(), mockFetch);

      const request = makeEmbeddingsRequest();
      await adapter.execute(request);

      const [, fetchInit] = (mockFetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
        string,
        RequestInit,
      ];
      const body = JSON.parse(fetchInit.body as string) as Record<string, unknown>;

      expect(body['input']).toBe(request.userInput);
    },
  );

  it(
    // GRS-006 | APS §6.2 — EmbeddingsResult.vectors shape invariant
    'EmbeddingsResult.vectors is an array of number arrays (number[][])',
    async () => {
      // RED: execute() currently throws for EMBEDDINGS capability.
      // Wave 5 builder must parse the OpenAI embeddings response and return each
      // embedding vector as a number[].
      const adapter = new OpenAIAdapter(makeMockKeyStore(), makeMockEmbeddingsFetch());

      const result = (await adapter.execute(makeEmbeddingsRequest())) as EmbeddingsResult;

      // Each element of vectors must itself be an array of numbers
      expect(result.vectors.every((v) => Array.isArray(v))).toBe(true);
      expect(result.vectors.every((v) => v.every((n) => typeof n === 'number'))).toBe(true);
    },
  );
});
