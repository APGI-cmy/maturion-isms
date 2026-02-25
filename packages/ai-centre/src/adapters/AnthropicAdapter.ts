/**
 * AnthropicAdapter — Wave 6 implementation
 *
 * Wraps the Anthropic Messages API into the ProviderAdapter interface.
 * Supports the `document-generation` capability (Wave 6 scope).
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
  type DocumentGenerationResult,
} from '../types/index.js';
import { ProviderKeyStore } from '../keys/ProviderKeyStore.js';

const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';
const ANTHROPIC_API_VERSION = '2023-06-01';

/** Minimal subset of the Fetch API used by this adapter (enables test injection). */
export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

export class AnthropicAdapter implements ProviderAdapter {
  readonly providerName = 'anthropic' as const;
  readonly supportedCapabilities = new Set([Capability.DOCUMENT_GENERATION]);

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
      token = this.keyStore.getKey('anthropic');
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Anthropic API key is not configured.',
        err,
      );
    }

    const body = {
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      system: request.systemPrompt || 'You are a helpful assistant.',
      messages: [
        {
          role: 'user' as const,
          content: request.userInput,
        },
      ],
    };

    let response: Response;
    try {
      response = await this.fetchFn(ANTHROPIC_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': token,
          'anthropic-version': ANTHROPIC_API_VERSION,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Anthropic API request failed.',
        err,
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        this.providerName,
        `Anthropic API returned HTTP ${response.status}.`,
      );
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Failed to parse Anthropic API response.',
        err,
      );
    }

    const markdown =
      (
        data as {
          content: Array<{ type: string; text: string }>;
        }
      ).content[0]?.text ?? '';

    const result: DocumentGenerationResult = {
      capability: Capability.DOCUMENT_GENERATION,
      markdown,
      providerUsed: this.providerName,
    };

    return result;
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    try {
      this.keyStore.getKey('anthropic');
      return ProviderHealthStatus.HEALTHY;
    } catch {
      return ProviderHealthStatus.UNAVAILABLE;
    }
  }
}
