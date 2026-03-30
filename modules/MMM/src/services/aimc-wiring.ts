/**
 * Risk Management AIMC Wiring Service
 *
 * Capability: advisory
 * Agent: risk-advisor
 *
 * Architecture Freeze: ARCH-FREEZE-WAVE9-TRACK-C-20260226
 * Wave: 9.6 — Module Integration: xDetect + Risk Management
 * AAWP Reference: governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md v0.2.0, §4, Wave 9.6
 *
 * Routes all AI advisory requests through the AIMC gateway (POST /api/ai/request).
 * Direct provider SDK calls are explicitly prohibited per architecture freeze §2.2.
 *
 * Domain requirements (risk-platform-agent specialist advisory review):
 * - Context supports optional risk_domain and tenant_id fields
 * - Does NOT follow legacy THREAT_MODEL_ROUTING_SPEC_v1.0.md (superseded by AIMC)
 * - No provider model names (no 'gpt-4', 'claude', 'whisper', etc.)
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

/**
 * Advisory request for the Risk Management module.
 * Context may include risk_domain and tenant_id for domain-aware routing.
 */
export interface AimcAdvisoryRequest {
  prompt: string;
  context?: {
    risk_domain?: string;
    tenant_id?: string;
    [key: string]: unknown;
  };
}

type FetchLike = (
  url: string,
  init?: Record<string, unknown>,
) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

export interface RiskManagementAimcWiringOptions {
  fetch?: FetchLike;
}

// ---------------------------------------------------------------------------
// Wiring service
// ---------------------------------------------------------------------------

/**
 * RiskManagementAimcWiring — routes Risk Management advisory requests through the AIMC gateway.
 *
 * Supersedes: THREAT_MODEL_ROUTING_SPEC_v1.0.md (legacy routing, replaced by AIMC)
 *
 * Usage (production):
 *   const wiring = new RiskManagementAimcWiring();
 *   const response = await wiring.requestAdvisory({
 *     prompt: 'Assess risk: exposed RDP on production',
 *     context: { risk_domain: 'infrastructure', tenant_id: 'tenant-123' },
 *   });
 *
 * Usage (tests — dependency injection via options.fetch):
 *   const wiring = new RiskManagementAimcWiring({ fetch: mockFetch });
 */
export class RiskManagementAimcWiring {
  /** AIMC gateway endpoint — MUST remain '/api/ai/request' per architecture freeze */
  private readonly endpoint = '/api/ai/request';

  /** AIMC capability routing key */
  private readonly capability = 'advisory';

  /** AIMC agent persona identifier */
  private readonly agent = 'risk-advisor';

  /** Fetch implementation (injectable for testing) */
  private readonly fetchFn: FetchLike;

  constructor(options?: RiskManagementAimcWiringOptions) {
    // Use injected fetch (tests) or global fetch (production)
    this.fetchFn =
      options?.fetch ??
      (typeof globalThis.fetch === 'function'
        ? (globalThis.fetch as FetchLike).bind(globalThis)
        : _noFetch);
  }

  /**
   * Send an advisory request to the AIMC gateway.
   * Calls POST /api/ai/request with capability: 'advisory', agent: 'risk-advisor'.
   * Context may include risk_domain and tenant_id for domain-aware responses.
   */
  async requestAdvisory(
    request: AimcAdvisoryRequest,
  ): Promise<AimcAdvisoryResponse> {
    const response = await this.fetchFn(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        capability: 'advisory',
        agent: 'risk-advisor',
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
      'Provide one via RiskManagementAimcWiringOptions.fetch, or ensure globalThis.fetch is defined.',
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default RiskManagementAimcWiring;
