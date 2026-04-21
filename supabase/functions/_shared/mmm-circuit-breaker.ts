/**
 * MMM Circuit Breaker — supabase/functions/_shared/mmm-circuit-breaker.ts
 *
 * Wave B7 — Boundary Integrations
 * Issue: maturion-isms#1428
 * Builder: integration-builder
 * Date: 2026-04-25
 *
 * TR-009: Circuit breaker threshold — opens after ≥5 consecutive failures within a 60s window.
 * Holds for ≥30s recovery period before HALF_OPEN probe.
 *
 * CG-001 (source-state law): Circuit breaker must account for BOTH source-active AND source-retired
 * states. No hard-coded switchover assumption. The OPEN state is purely a resilience mechanism —
 * it does NOT imply source retirement or platform convergence.
 *
 * Boundaries covered (all 3):
 *   - AIMC (AI Management Centre)
 *   - PIT (Platform Implementation Tracker)
 *   - KUC (Knowledge Upload Centre)
 *
 * State transitions (TR-009):
 *   CLOSED  → OPEN       (≥5 consecutive failures in 60s window)
 *   OPEN    → HALF_OPEN  (30s hold elapsed; probe request sent)
 *   HALF_OPEN → CLOSED   (probe success)
 *   HALF_OPEN → OPEN     (probe failure — reset 30s hold)
 *
 * Observable: all state transitions are logged (audit integrity requirement).
 */

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export type BoundaryName = 'AIMC' | 'PIT' | 'KUC';

export interface CircuitBreakerStatus {
  boundary: BoundaryName;
  state: CircuitBreakerState;
  consecutiveFailures: number;
  lastFailureAt: number | null;
  openedAt: number | null;
  lastStateTransition: string;
}

interface CircuitBreakerEntry {
  state: CircuitBreakerState;
  consecutiveFailures: number;
  windowStart: number;
  openedAt: number | null;
  lastFailureAt: number | null;
}

/** In-memory state store (per Edge Function runtime instance — TR-009) */
const _state: Record<BoundaryName, CircuitBreakerEntry> = {
  AIMC: {
    state: 'CLOSED',
    consecutiveFailures: 0,
    windowStart: Date.now(),
    openedAt: null,
    lastFailureAt: null,
  },
  PIT: {
    state: 'CLOSED',
    consecutiveFailures: 0,
    windowStart: Date.now(),
    openedAt: null,
    lastFailureAt: null,
  },
  KUC: {
    state: 'CLOSED',
    consecutiveFailures: 0,
    windowStart: Date.now(),
    openedAt: null,
    lastFailureAt: null,
  },
};

/** TR-009: failure threshold before opening */
const FAILURE_THRESHOLD = 5;
/** TR-009: observation window in milliseconds */
const WINDOW_MS = 60_000;
/** TR-009: minimum recovery hold before HALF_OPEN probe */
const RECOVERY_HOLD_MS = 30_000;

/**
 * Log a state transition for observability (audit integrity requirement).
 * CG-001: transition reason must never imply source retirement.
 */
function logTransition(
  boundary: BoundaryName,
  from: CircuitBreakerState,
  to: CircuitBreakerState,
  reason: string,
): void {
  console.log(
    `[MMM-CIRCUIT-BREAKER] boundary=${boundary} transition=${from}->${to} ` +
      `reason=${reason} ts=${new Date().toISOString()}`,
  );
}

/**
 * Returns true if the circuit is CLOSED or HALF_OPEN and should attempt a call.
 * Returns false if the circuit is OPEN (caller must return fallback response).
 *
 * CG-001: OPEN state is a resilience mechanism only — not a source-retirement signal.
 */
export function isCircuitClosed(boundary: BoundaryName): boolean {
  const entry = _state[boundary];
  const now = Date.now();

  if (entry.state === 'CLOSED') {
    return true;
  }

  if (entry.state === 'OPEN') {
    // Check if recovery hold period has elapsed
    if (entry.openedAt !== null && now - entry.openedAt >= RECOVERY_HOLD_MS) {
      // Transition to HALF_OPEN for probe
      logTransition(boundary, 'OPEN', 'HALF_OPEN', 'recovery_hold_elapsed');
      entry.state = 'HALF_OPEN';
      return true; // Allow probe request
    }
    return false; // Still in recovery hold
  }

  // HALF_OPEN — allow the probe
  return true;
}

/**
 * Record a successful call. Resets failure count; transitions HALF_OPEN → CLOSED.
 */
export function recordSuccess(boundary: BoundaryName): void {
  const entry = _state[boundary];

  if (entry.state === 'HALF_OPEN') {
    logTransition(boundary, 'HALF_OPEN', 'CLOSED', 'probe_success');
    entry.state = 'CLOSED';
    entry.consecutiveFailures = 0;
    entry.windowStart = Date.now();
    entry.openedAt = null;
    return;
  }

  if (entry.state === 'CLOSED') {
    // Reset consecutive failure count on any success
    entry.consecutiveFailures = 0;
    entry.windowStart = Date.now();
  }
}

/**
 * Record a failed call. Opens circuit after ≥5 consecutive failures in 60s window (TR-009).
 * HALF_OPEN probe failure resets the 30s hold and re-opens.
 */
export function recordFailure(boundary: BoundaryName, reason: string): void {
  const entry = _state[boundary];
  const now = Date.now();

  if (entry.state === 'HALF_OPEN') {
    // Probe failed — re-open with fresh hold
    logTransition(boundary, 'HALF_OPEN', 'OPEN', `probe_failure:${reason}`);
    entry.state = 'OPEN';
    entry.openedAt = now;
    entry.lastFailureAt = now;
    entry.consecutiveFailures++;
    return;
  }

  // Reset window if 60s has elapsed since first failure in window
  if (now - entry.windowStart > WINDOW_MS) {
    entry.consecutiveFailures = 0;
    entry.windowStart = now;
  }

  entry.consecutiveFailures++;
  entry.lastFailureAt = now;

  if (entry.state === 'CLOSED' && entry.consecutiveFailures >= FAILURE_THRESHOLD) {
    logTransition(
      boundary,
      'CLOSED',
      'OPEN',
      `consecutive_failures=${entry.consecutiveFailures} threshold=${FAILURE_THRESHOLD}`,
    );
    entry.state = 'OPEN';
    entry.openedAt = now;
  }
}

/**
 * Returns current status for all boundaries — used by health endpoint (TR-052).
 */
export function getCircuitBreakerStatus(): Record<BoundaryName, CircuitBreakerStatus> {
  const now = Date.now();
  const boundaries: BoundaryName[] = ['AIMC', 'PIT', 'KUC'];
  const result = {} as Record<BoundaryName, CircuitBreakerStatus>;

  for (const boundary of boundaries) {
    const entry = _state[boundary];

    let lastStateTransition = 'INITIAL';
    if (entry.state === 'OPEN' && entry.openedAt) {
      lastStateTransition = `OPENED_AT:${new Date(entry.openedAt).toISOString()}`;
    } else if (entry.state === 'HALF_OPEN' && entry.openedAt) {
      const holdRemaining = Math.max(0, RECOVERY_HOLD_MS - (now - entry.openedAt));
      lastStateTransition = `HALF_OPEN_PROBE_ELIGIBLE:hold_remaining=${holdRemaining}ms`;
    } else {
      lastStateTransition = `CLOSED:failures=${entry.consecutiveFailures}`;
    }

    result[boundary] = {
      boundary,
      state: entry.state,
      consecutiveFailures: entry.consecutiveFailures,
      lastFailureAt: entry.lastFailureAt,
      openedAt: entry.openedAt,
      lastStateTransition,
    };
  }

  return result;
}

/**
 * Build a fallback response for OPEN circuit (TR-009).
 * Returned when circuit breaker prevents a call.
 */
export function buildFallbackResponse(boundary: BoundaryName): {
  fallback: true;
  reason: string;
  circuit_state: CircuitBreakerState;
  boundary: BoundaryName;
} {
  const reasonMap: Record<BoundaryName, string> = {
    AIMC: 'AIMC_CIRCUIT_OPEN',
    PIT: 'PIT_CIRCUIT_OPEN',
    KUC: 'KUC_CIRCUIT_OPEN',
  };

  return {
    fallback: true,
    reason: reasonMap[boundary],
    circuit_state: _state[boundary].state,
    boundary,
  };
}
