/**
 * PerplexityAdapter — Wave 7 implementation
 *
 * Wraps the Perplexity /chat/completions API into the ProviderAdapter interface.
 * Supports the `deep-search` capability (Wave 7 scope) with citation extraction
 * for evidence traceability (GRS-006, GRS-007).
 *
 * References: GRS-005, GRS-006, GRS-007 | APS §5.3, §6.1 | AAD §7, §8.2
 */
import {
  Capability,
  ProviderHealthStatus,
  ProviderError,
  type ProviderAdapter,
  type NormalisedProviderRequest,
  type CapabilityResult,
  type DeepSearchResult,
  type Citation,
} from '../types/index.js';
import { ProviderKeyStore } from '../keys/ProviderKeyStore.js';

const PERPLEXITY_ENDPOINT = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_MODEL = 'sonar-pro';

/** Minimal subset of the Fetch API used by this adapter (enables test injection). */
export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

export class PerplexityAdapter implements ProviderAdapter {
  readonly providerName = 'perplexity' as const;
  readonly supportedCapabilities = new Set([Capability.DEEP_SEARCH]);

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
      token = this.keyStore.getKey('perplexity');
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Perplexity API key is not configured.',
        err,
      );
    }

    const messages: Array<{ role: string; content: string }> = [];

    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }

    for (const msg of request.contextMessages) {
      messages.push({ role: msg.role, content: msg.content });
    }

    messages.push({ role: 'user', content: request.userInput });

    const body = {
      model: PERPLEXITY_MODEL,
      messages,
    };

    let response: Response;
    try {
      response = await this.fetchFn(PERPLEXITY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Perplexity API request failed.',
        err,
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        this.providerName,
        `Perplexity API returned HTTP ${response.status}.`,
      );
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Failed to parse Perplexity API response.',
        err,
      );
    }

    const parsed = data as {
      choices: Array<{ message: { content: string } }>;
      citations?: string[];
    };

    const summary = parsed.choices[0]?.message?.content ?? '';

    const citations: Citation[] = (parsed.citations ?? []).map((url: string) => ({
      title: url,
      url,
    }));

    const result: DeepSearchResult = {
      capability: Capability.DEEP_SEARCH,
      summary,
      citations,
      providerUsed: this.providerName,
    };

    return result;
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    try {
      this.keyStore.getKey('perplexity');
      return ProviderHealthStatus.HEALTHY;
    } catch {
      return ProviderHealthStatus.UNAVAILABLE;
    }
  }
}
