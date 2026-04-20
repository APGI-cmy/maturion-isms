/**
 * MMM AIMC Client — supabase/functions/_shared/mmm-aimc-client.ts
 *
 * Wave B7 — Boundary Integrations
 * Issue: maturion-isms#1428
 * Builder: integration-builder
 * Date: 2026-04-25
 *
 * Consumer boundary pattern (OB-1 / CG-002):
 *   - MMM is an AIMC CONSUMER ONLY — never a direct LLM caller
 *   - Zero direct AI-provider SDK calls (OB-1). All traffic routed through AIMC consumer boundary.
 *   - No provider SDK imports. No model-name constants. No provider API keys.
 *   - All AI operations route through AIMC's published service interface
 *
 * TR-011: Service-to-service JWT authentication
 *   - Authorization: Bearer <AIMC_SERVICE_TOKEN> on every call
 *   - Token read from Deno.env.get('AIMC_SERVICE_TOKEN')
 *   - Token max TTL: 3600 seconds (must be refreshed before expiry per TR-011)
 *
 * TR-012: AIMC data format contract
 *   Request envelope:  { operation, organisation_id, actor_id, context }
 *   Response envelope: { success, data, error, request_id }
 *
 * TR-013: Routing to /api/ai/* namespace
 *   Base URL: Deno.env.get('AIMC_BASE_URL')
 *
 * TR-014: Timeout and retry contract
 *   Per-operation timeouts and retry policies (AbortController)
 *
 * TR-009: Circuit breaker integration
 *   Tracks AIMC boundary state; opens after ≥5 failures in 60s window
 */

import {
  isCircuitClosed,
  recordSuccess,
  recordFailure,
  buildFallbackResponse,
} from './mmm-circuit-breaker.ts';

/** AIMC service base URL — TR-013 */
const AIMC_BASE_URL = Deno.env.get('AIMC_BASE_URL') ?? '';
/** AIMC service-to-service token — TR-011 */
const AIMC_SERVICE_TOKEN = Deno.env.get('AIMC_SERVICE_TOKEN') ?? '';

/** AIMC endpoint namespace — TR-013 */
const AIMC_NAMESPACE = '/api/ai';

/** TR-014 timeout and retry config per operation type */
export const AIMC_OPERATION_CONFIG: Record<
  string,
  { timeoutMs: number; maxRetries: number; retryBackoffMs: number }
> = {
  'framework-parse':        { timeoutMs: 60_000, maxRetries: 1, retryBackoffMs: 10_000 },
  'framework-generate':     { timeoutMs: 90_000, maxRetries: 1, retryBackoffMs: 15_000 },
  'framework-alter':        { timeoutMs: 60_000, maxRetries: 1, retryBackoffMs: 10_000 },
  'evidence-evaluate':      { timeoutMs: 30_000, maxRetries: 2, retryBackoffMs: 5_000  },
  'recommend':              { timeoutMs: 30_000, maxRetries: 2, retryBackoffMs: 5_000  },
  'chat':                   { timeoutMs: 45_000, maxRetries: 1, retryBackoffMs: 10_000 },
  'explain':                { timeoutMs: 45_000, maxRetries: 1, retryBackoffMs: 10_000 },
  'assessment-interpret':   { timeoutMs: 60_000, maxRetries: 1, retryBackoffMs: 10_000 },
};

/** AIMC canonical response envelope — TR-012 */
export interface AimcResponseEnvelope {
  success: boolean;
  data: unknown;
  error: { code: string; message: string } | null;
  request_id: string;
}

/** MMM → AIMC canonical request envelope — TR-012 */
export interface AimcRequestEnvelope {
  operation: string;
  organisation_id: string;
  actor_id: string;
  context: Record<string, unknown>;
}

export interface AimcCallResult {
  success: boolean;
  data: unknown;
  error: string | null;
  request_id: string;
  fallback: boolean;
  fallback_reason?: string;
}

/**
 * Sleep helper for retry backoff.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Make a single HTTP call to AIMC with AbortController timeout.
 * Authorization: Bearer <AIMC_SERVICE_TOKEN> — TR-011.
 * Content-Type: application/json — TR-012.
 */
async function makeAimcHttpCall(
  operation: string,
  payload: AimcRequestEnvelope,
  timeoutMs: number,
): Promise<AimcResponseEnvelope> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${AIMC_BASE_URL}${AIMC_NAMESPACE}/${operation}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${AIMC_SERVICE_TOKEN}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => 'unknown error');
      throw new Error(`AIMC HTTP ${response.status}: ${errText}`);
    }

    const envelope = (await response.json()) as AimcResponseEnvelope;
    return envelope;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Call an AIMC endpoint with circuit breaker, timeout, and retry logic.
 *
 * OB-1 / CG-002: Consumer boundary only — no direct LLM endpoint wiring.
 * TR-011: Authorization: Bearer header on every call.
 * TR-012: Canonical request/response envelope enforced.
 * TR-013: Routes to /api/ai/<operation> namespace.
 * TR-014: Per-operation timeout and retry config.
 * TR-009: Circuit breaker — fallback returned when OPEN.
 * NBR-002: Non-200 HTTP from AIMC propagated as error (not swallowed).
 */
export async function callAimc(
  operation: string,
  organisationId: string,
  actorId: string,
  context: Record<string, unknown>,
): Promise<AimcCallResult> {
  // TR-009: Check circuit breaker state
  if (!isCircuitClosed('AIMC')) {
    const fallback = buildFallbackResponse('AIMC');
    console.log(
      `[MMM-AIMC-CLIENT] circuit=OPEN operation=${operation} org=${organisationId} ` +
        `returning fallback`,
    );
    return {
      success: false,
      data: null,
      error: fallback.reason,
      request_id: `fallback-${crypto.randomUUID()}`,
      fallback: true,
      fallback_reason: fallback.reason,
    };
  }

  const config = AIMC_OPERATION_CONFIG[operation] ?? {
    timeoutMs: 30_000,
    maxRetries: 1,
    retryBackoffMs: 5_000,
  };

  // TR-012: Build canonical request envelope
  const payload: AimcRequestEnvelope = {
    operation,
    organisation_id: organisationId,
    actor_id: actorId,
    context,
  };

  let lastError: Error | null = null;
  const totalAttempts = config.maxRetries + 1;

  for (let attempt = 0; attempt < totalAttempts; attempt++) {
    if (attempt > 0) {
      // Exponential backoff between retries (TR-014)
      await sleep(config.retryBackoffMs * attempt);
    }

    try {
      const envelope = await makeAimcHttpCall(operation, payload, config.timeoutMs);

      // TR-012: Validate response envelope
      if (envelope.success === false && envelope.error) {
        throw new Error(`AIMC error [${envelope.error.code}]: ${envelope.error.message}`);
      }

      // TR-009: Record success — may close circuit if HALF_OPEN
      recordSuccess('AIMC');

      return {
        success: true,
        data: envelope.data,
        error: null,
        request_id: envelope.request_id,
        fallback: false,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(
        `[MMM-AIMC-CLIENT] operation=${operation} attempt=${attempt + 1}/${totalAttempts} ` +
          `error=${lastError.message}`,
      );
    }
  }

  // All retries exhausted — record failure for circuit breaker
  recordFailure('AIMC', lastError?.message ?? 'unknown');

  return {
    success: false,
    data: null,
    error: lastError?.message ?? 'AIMC call failed after retries',
    request_id: `error-${crypto.randomUUID()}`,
    fallback: false,
  };
}

/**
 * Check AIMC reachability (commissioning check CHK-004).
 * Uses OPTIONS request — no JWT required for reachability probe.
 */
export async function checkAimcReachability(): Promise<boolean> {
  if (!AIMC_BASE_URL) return false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5_000);
    const response = await fetch(`${AIMC_BASE_URL}/api/ai/health`, {
      method: 'OPTIONS',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok || response.status === 200 || response.status === 204 || response.status === 405;
  } catch {
    return false;
  }
}
