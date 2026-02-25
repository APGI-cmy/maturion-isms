/**
 * OpenAIAdapter — Wave 5 implementation
 *
 * Wraps the OpenAI Chat Completions and Embeddings APIs into the ProviderAdapter interface.
 * Supports the `analysis`, `advisory`, and `embeddings` capabilities (Wave 5 scope).
 *
 * References: GRS-005, GRS-006 | APS §6.1, §6.2 | AAD §5.5, §8.2
 */
import {
  Capability,
  ProviderHealthStatus,
  ProviderError,
  type ProviderAdapter,
  type NormalisedProviderRequest,
  type CapabilityResult,
  type AnalysisResult,
  type AdvisoryResult,
  type EmbeddingsResult,
  type ImageGenerationResult,
  type AlgorithmExecutionResult,
} from '../types/index.js';
import { ProviderKeyStore } from '../keys/ProviderKeyStore.js';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_EMBEDDINGS_ENDPOINT = 'https://api.openai.com/v1/embeddings';
const OPENAI_IMAGES_ENDPOINT = 'https://api.openai.com/v1/images/generations';
const OPENAI_RESPONSES_ENDPOINT = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-4o';
const EMBEDDINGS_MODEL = 'text-embedding-3-small';

/** Minimal subset of the Fetch API used by this adapter (enables test injection). */
export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

export class OpenAIAdapter implements ProviderAdapter {
  readonly providerName = 'openai' as const;
  readonly supportedCapabilities = new Set([
    Capability.ANALYSIS,
    Capability.ADVISORY,
    Capability.EMBEDDINGS,
    Capability.IMAGE_GENERATION,
    Capability.ALGORITHM_EXECUTION,
  ]);

  private readonly keyStore: ProviderKeyStore;
  private readonly fetchFn: FetchFn;

  /**
   * @param keyStore  - Injectable key store (defaults to env-backed ProviderKeyStore).
   * @param fetchFn   - Injectable fetch function (defaults to global fetch).
   *                    Injecting a mock here enables unit testing without live API calls
   *                    per AAD §8.2 Testability via Dependency Injection.
   */
  constructor(keyStore?: ProviderKeyStore, fetchFn?: FetchFn) {
    this.keyStore = keyStore ?? new ProviderKeyStore();
    this.fetchFn = fetchFn ?? ((url, init) => fetch(url, init));
  }

  async execute(request: NormalisedProviderRequest): Promise<CapabilityResult> {
    if (!this.supportedCapabilities.has(request.capability)) {
      throw new ProviderError(
        this.providerName,
        `Unsupported capability: ${request.capability}`,
      );
    }

    let token: string;
    try {
      token = this.keyStore.getKey('openai');
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'OpenAI API key is not configured.',
        err,
      );
    }

    // Embeddings capability — routes to /v1/embeddings (GRS-006)
    if (request.capability === Capability.EMBEDDINGS) {
      let embResponse: Response;
      try {
        embResponse = await this.fetchFn(OPENAI_EMBEDDINGS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ model: EMBEDDINGS_MODEL, input: request.userInput }),
        });
      } catch (err) {
        throw new ProviderError(this.providerName, 'OpenAI API request failed.', err);
      }

      if (!embResponse.ok) {
        throw new ProviderError(
          this.providerName,
          `OpenAI API returned HTTP ${embResponse.status}.`,
        );
      }

      let embData: unknown;
      try {
        embData = await embResponse.json();
      } catch (err) {
        throw new ProviderError(
          this.providerName,
          'Failed to parse OpenAI API response.',
          err,
        );
      }

      const vectors = (
        embData as { data: Array<{ embedding: number[] }> }
      ).data.map((item) => item.embedding);

      const embResult: EmbeddingsResult = {
        capability: Capability.EMBEDDINGS,
        vectors,
        providerUsed: this.providerName,
      };
      return embResult;
    }

    // Image generation capability — routes to /v1/images/generations (DALL-E 3) (GRS-006)
    if (request.capability === Capability.IMAGE_GENERATION) {
      let imgResponse: Response;
      try {
        imgResponse = await this.fetchFn(OPENAI_IMAGES_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: request.userInput,
            n: 1,
            size: '1024x1024',
          }),
        });
      } catch (err) {
        throw new ProviderError(this.providerName, 'OpenAI API request failed.', err);
      }

      if (!imgResponse.ok) {
        throw new ProviderError(
          this.providerName,
          `OpenAI API returned HTTP ${imgResponse.status}.`,
        );
      }

      let imgData: unknown;
      try {
        imgData = await imgResponse.json();
      } catch (err) {
        throw new ProviderError(
          this.providerName,
          'Failed to parse OpenAI API response.',
          err,
        );
      }

      const imageUrls = (
        imgData as { data: Array<{ url: string }> }
      ).data.map((item) => item.url);

      const imgResult: ImageGenerationResult = {
        capability: Capability.IMAGE_GENERATION,
        imageUrls,
        providerUsed: this.providerName,
      };
      return imgResult;
    }

    // Algorithm execution capability — routes to /v1/responses (o3 model) (GRS-006, Wave 8)
    if (request.capability === Capability.ALGORITHM_EXECUTION) {
      let algoResponse: Response;
      try {
        algoResponse = await this.fetchFn(OPENAI_RESPONSES_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            model: 'o3',
            input: request.userInput,
          }),
        });
      } catch (err) {
        throw new ProviderError(this.providerName, 'OpenAI API request failed.', err);
      }

      if (!algoResponse.ok) {
        throw new ProviderError(
          this.providerName,
          `OpenAI API returned HTTP ${algoResponse.status}.`,
        );
      }

      let algoData: unknown;
      try {
        algoData = await algoResponse.json();
      } catch (err) {
        throw new ProviderError(
          this.providerName,
          'Failed to parse OpenAI API response.',
          err,
        );
      }

      const algoResult: AlgorithmExecutionResult = {
        capability: Capability.ALGORITHM_EXECUTION,
        output: algoData,
        providerUsed: this.providerName,
      };
      return algoResult;
    }

    const messages: Array<{ role: string; content: string }> = [
      {
        role: 'system',
        content: request.systemPrompt || 'You are a helpful assistant.',
      },
      ...request.contextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: request.userInput },
    ];

    const body: Record<string, unknown> = {
      model: DEFAULT_MODEL,
      messages,
      max_tokens: request.maxTokens ?? 800,
    };

    // Request structured JSON output for analysis capability
    if (request.capability === Capability.ANALYSIS) {
      body['response_format'] = { type: 'json_object' };
    }

    let response: Response;
    try {
      response = await this.fetchFn(OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'OpenAI API request failed.',
        err,
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        this.providerName,
        `OpenAI API returned HTTP ${response.status}.`,
      );
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Failed to parse OpenAI API response.',
        err,
      );
    }

    const text =
      (
        data as {
          choices: Array<{ message: { content: string } }>;
        }
      ).choices[0]?.message?.content ?? '';

    if (request.capability === Capability.ANALYSIS) {
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(text) as Record<string, unknown>;
      } catch {
        parsed = { raw: text };
      }
      const result: AnalysisResult = {
        capability: Capability.ANALYSIS,
        data: parsed,
        providerUsed: this.providerName,
      };
      return result;
    }

    const result: AdvisoryResult = {
      capability: Capability.ADVISORY,
      text,
      providerUsed: this.providerName,
    };

    return result;
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    try {
      this.keyStore.getKey('openai');
      return ProviderHealthStatus.HEALTHY;
    } catch {
      return ProviderHealthStatus.UNAVAILABLE;
    }
  }
}
