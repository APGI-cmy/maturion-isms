/**
 * xDetect AIMC Wiring Service
 *
 * Capability: advisory
 * Agent: xdetect-advisor
 *
 * Architecture Freeze: ARCH-FREEZE-WAVE9-TRACK-C-20260226
 * Wave: 9.6 — Module Integration: xDetect + Risk Management
 * AAWP Reference: governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md v0.2.0, §4, Wave 9.6
 *
 * Routes all AI advisory requests through the AIMC gateway (POST /api/ai/request).
 * Direct provider SDK calls are explicitly prohibited per architecture freeze §2.2.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AimcAdvisoryResponse {
  content: string;
  capability: string;
  agent: string;
  success: boolean;
}

export interface AimcAdvisoryRequest {
  prompt: string;
  context?: Record<string, unknown>;
}

type FetchLike = (
  url: string,
  init?: Record<string, unknown>,
) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

export interface XDetectAimcWiringOptions {
  fetch?: FetchLike;
}

// ---------------------------------------------------------------------------
// Wiring service
// ---------------------------------------------------------------------------

/**
 * XDetectAimcWiring — routes xDetect advisory requests through the AIMC gateway.
 *
 * Usage (production):
 *   const wiring = new XDetectAimcWiring();
 *   const response = await wiring.requestAdvisory({ prompt: 'Analyse IOC 1.2.3.4' });
 *
 * Usage (tests — dependency injection via options.fetch):
 *   const wiring = new XDetectAimcWiring({ fetch: mockFetch });
 */
export class XDetectAimcWiring {
  /** AIMC gateway endpoint — MUST remain '/api/ai/request' per architecture freeze */
  private readonly endpoint = '/api/ai/request';

  /** AIMC capability routing key */
  private readonly capability = 'advisory';

  /** AIMC agent persona identifier */
  private readonly agent = 'xdetect-advisor';

  /** Fetch implementation (injectable for testing) */
  private readonly fetchFn: FetchLike;

  constructor(options?: XDetectAimcWiringOptions) {
    // Use injected fetch (tests) or global fetch (production)
    this.fetchFn =
      options?.fetch ??
      (typeof globalThis.fetch === 'function'
        ? (globalThis.fetch as FetchLike).bind(globalThis)
        : _noFetch);
  }

  /**
   * Send an advisory request to the AIMC gateway.
   * Calls POST /api/ai/request with capability: 'advisory', agent: 'xdetect-advisor'.
   */
  async requestAdvisory(
    request: AimcAdvisoryRequest,
  ): Promise<AimcAdvisoryResponse> {
    const response = await this.fetchFn(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        capability: 'advisory',
        agent: 'xdetect-advisor',
        prompt: request.prompt,
        context: request.context ?? {},
      }),
    });

    if (!response.ok) {
      throw new Error(
        `AIMC gateway returned non-OK status when calling ${this.endpoint}`,
      );
    }

    const data = (await response.json()) as Record<string, unknown>;

    return {
      content:
        typeof data.content === 'string'
          ? data.content
          : typeof data.text === 'string'
            ? data.text
            : typeof data.message === 'string'
              ? data.message
              : '',
      capability:
        typeof data.capability === 'string' ? data.capability : this.capability,
      agent:
        typeof data.agent === 'string' ? data.agent : this.agent,
      success: true,
    };
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Placeholder used when no fetch is available at construction time */
async function _noFetch(): Promise<never> {
  throw new Error(
    'No fetch implementation available. ' +
      'Provide one via XDetectAimcWiringOptions.fetch, or ensure globalThis.fetch is defined.',
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default XDetectAimcWiring;
