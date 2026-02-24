/**
 * GitHubModelsAdapter — Wave 3 implementation
 *
 * Wraps the GitHub Models REST API into the ProviderAdapter interface.
 * Supports the `advisory` capability only (Wave 3 scope).
 *
 * References: GRS-005, GRS-006, GRS-015 | APS §6.1, §6.2 | AAD §5.5, §8.2
 */
import {
  Capability,
  ProviderHealthStatus,
  ProviderError,
  type ProviderAdapter,
  type NormalisedProviderRequest,
  type CapabilityResult,
  type AdvisoryResult,
} from '../types/index.js';
import { ProviderKeyStore } from '../keys/ProviderKeyStore.js';

const GITHUB_MODELS_ENDPOINT =
  'https://models.github.ai/inference/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

/** Minimal subset of the Fetch API used by this adapter (enables test injection). */
export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

export class GitHubModelsAdapter implements ProviderAdapter {
  readonly providerName = 'github-models' as const;
  readonly supportedCapabilities = new Set([Capability.ADVISORY]);

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
    if (request.capability !== Capability.ADVISORY) {
      throw new ProviderError(
        this.providerName,
        `Unsupported capability: ${request.capability}`,
      );
    }

    let token: string;
    try {
      token = this.keyStore.getKey('github-models');
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'GitHub Models API key is not configured.',
        err,
      );
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

    let response: Response;
    try {
      response = await this.fetchFn(GITHUB_MODELS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages,
          max_tokens: request.maxTokens ?? 800,
        }),
      });
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'GitHub Models API request failed.',
        err,
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        this.providerName,
        `GitHub Models API returned HTTP ${response.status}.`,
      );
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Failed to parse GitHub Models API response.',
        err,
      );
    }

    const text =
      (
        data as {
          choices: Array<{ message: { content: string } }>;
        }
      ).choices[0]?.message?.content ?? '';

    const result: AdvisoryResult = {
      capability: Capability.ADVISORY,
      text,
      providerUsed: this.providerName,
    };

    return result;
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    try {
      this.keyStore.getKey('github-models');
      return ProviderHealthStatus.HEALTHY;
    } catch {
      return ProviderHealthStatus.UNAVAILABLE;
    }
  }
}
