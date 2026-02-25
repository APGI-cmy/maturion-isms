/**
 * RunwayAdapter — Wave 8 implementation
 *
 * Wraps the Runway /v1/image_to_video API into the ProviderAdapter interface.
 * Supports the `video-generation` capability (Wave 8 scope).
 *
 * References: GRS-005, GRS-006 | APS §6.1 | AAD §7 (Wave 8 row)
 */
import {
  Capability,
  ProviderHealthStatus,
  ProviderError,
  type ProviderAdapter,
  type NormalisedProviderRequest,
  type CapabilityResult,
  type VideoGenerationResult,
} from '../types/index.js';
import { ProviderKeyStore } from '../keys/ProviderKeyStore.js';

const RUNWAY_ENDPOINT = 'https://api.runwayml.com/v1/image_to_video';

/** Minimal subset of the Fetch API used by this adapter (enables test injection). */
export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

export class RunwayAdapter implements ProviderAdapter {
  readonly providerName = 'runway' as const;
  readonly supportedCapabilities = new Set([Capability.VIDEO_GENERATION]);

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
      token = this.keyStore.getKey('runway');
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Runway API key is not configured.',
        err,
      );
    }

    let response: Response;
    try {
      response = await this.fetchFn(RUNWAY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: request.userInput,
          model: 'gen2',
        }),
      });
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Runway API request failed.',
        err,
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        this.providerName,
        `Runway API returned HTTP ${response.status}.`,
      );
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (err) {
      throw new ProviderError(
        this.providerName,
        'Failed to parse Runway API response.',
        err,
      );
    }

    const parsed = data as { id: string; output: string[] };

    const result: VideoGenerationResult = {
      capability: Capability.VIDEO_GENERATION,
      videoUrl: parsed.output[0]!,
      providerUsed: this.providerName,
    };

    return result;
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    try {
      this.keyStore.getKey('runway');
      return ProviderHealthStatus.HEALTHY;
    } catch {
      return ProviderHealthStatus.UNAVAILABLE;
    }
  }
}
