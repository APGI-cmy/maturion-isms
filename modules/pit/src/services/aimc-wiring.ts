/**
 * PIT AIMC Wiring Service
 *
 * Capability: analysis
 * Agent: pit-advisor
 *
 * Architecture Freeze: ARCH-FREEZE-WAVE9-TRACK-C-20260226
 * Wave: 9.7 — Module Integration: PIT (Project Implementation Tracker)
 * AAWP Reference: governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md v0.2.0, §4, Wave 9.7
 *
 * Routes all AI analysis requests through the AIMC gateway (POST /api/ai/request).
 * Direct provider SDK calls are explicitly prohibited per architecture freeze §2.2.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AimcAnalysisResponse {
  content: string;
  capability: string;
  agent: string;
  success: boolean;
}

export interface AimcAnalysisRequest {
  prompt: string;
  context?: {
    analysisType?: string;
    sourceModule?: string;
    [key: string]: unknown;
  };
}

type FetchLike = (
  url: string,
  init?: Record<string, unknown>,
) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

export interface PitAimcWiringOptions {
  fetch?: FetchLike;
}

// ---------------------------------------------------------------------------
// Wiring service
// ---------------------------------------------------------------------------

/**
 * PitAimcWiring — routes PIT analysis requests through the AIMC gateway.
 *
 * Usage (production):
 *   const wiring = new PitAimcWiring();
 *   const response = await wiring.requestAnalysis({ prompt: 'Analyse task backlog for project X' });
 *
 * Usage (tests — dependency injection via options.fetch):
 *   const wiring = new PitAimcWiring({ fetch: mockFetch });
 */
export class PitAimcWiring {
  /** AIMC gateway endpoint — MUST remain '/api/ai/request' per architecture freeze */
  private readonly endpoint = '/api/ai/request';

  /** AIMC capability routing key — PIT uses 'analysis' (not 'advisory') */
  private readonly capability = 'analysis';

  /** AIMC agent persona identifier */
  private readonly agent = 'pit-advisor';

  /** Fetch implementation (injectable for testing) */
  private readonly fetchFn: FetchLike;

  constructor(options?: PitAimcWiringOptions) {
    // Use injected fetch (tests) or global fetch (production)
    this.fetchFn =
      options?.fetch ??
      (typeof globalThis.fetch === 'function'
        ? (globalThis.fetch as FetchLike).bind(globalThis)
        : _noFetch);
  }

  /**
   * Send an analysis request to the AIMC gateway.
   * Calls POST /api/ai/request with capability: 'analysis', agent: 'pit-advisor'.
   */
  async requestAnalysis(
    request: AimcAnalysisRequest,
  ): Promise<AimcAnalysisResponse> {
    const response = await this.fetchFn(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        capability: 'analysis',
        agent: 'pit-advisor',
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
      'Provide one via PitAimcWiringOptions.fetch, or ensure globalThis.fetch is defined.',
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default PitAimcWiring;
