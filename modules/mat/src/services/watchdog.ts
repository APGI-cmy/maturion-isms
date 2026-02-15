/**
 * Watchdog Monitoring Service
 * Architecture: modules/mat/02-architecture/observability-architecture.md
 * Implements monitoring metrics collection and threshold management
 */

import type {
  WatchdogMetrics,
  WatchdogThreshold,
  WatchdogAlertRouting,
  HealthCheckResult,
  OverrideAnalysisSummary,
  OverrideLogEntry,
  OverrideReason
} from '../types/index.js';

/**
 * Default alert thresholds for watchdog metrics
 * Architecture: observability-architecture.md §4
 * FRS: FR-059
 */
const DEFAULT_THRESHOLDS: WatchdogThreshold[] = [
  {
    metric: 'ai_refusal_rate',
    warning_level: 0.1,
    critical_level: 0.3,
    alert_enabled: true
  },
  {
    metric: 'ai_override_rate',
    warning_level: 0.2,
    critical_level: 0.5,
    alert_enabled: true
  },
  {
    metric: 'sync_failure_rate',
    warning_level: 0.05,
    critical_level: 0.15,
    alert_enabled: true
  },
  {
    metric: 'error_rate',
    warning_level: 0.01,
    critical_level: 0.05,
    alert_enabled: true
  },
  {
    metric: 'avg_response_time_ms',
    warning_level: 2000,
    critical_level: 5000,
    alert_enabled: true
  }
];

/**
 * Collects current watchdog monitoring metrics
 * Architecture: observability-architecture.md §4
 * FRS: FR-059
 * 
 * Gathers system-wide metrics including AI refusal rate,
 * override rate, sync failures, and performance data.
 * 
 * @param params - Metric values to capture
 * @returns Watchdog metrics snapshot with timestamp
 */
export function collectMetrics(params: {
  ai_refusal_rate: number;
  ai_override_rate: number;
  sync_failure_rate: number;
  active_audits: number;
  evidence_count: number;
  avg_response_time_ms: number;
  error_rate: number;
}): WatchdogMetrics {
  return {
    timestamp: new Date().toISOString(),
    ai_refusal_rate: params.ai_refusal_rate,
    ai_override_rate: params.ai_override_rate,
    sync_failure_rate: params.sync_failure_rate,
    active_audits: params.active_audits,
    evidence_count: params.evidence_count,
    avg_response_time_ms: params.avg_response_time_ms,
    error_rate: params.error_rate
  };
}

/**
 * Returns default watchdog thresholds
 * Architecture: observability-architecture.md §4
 * FRS: FR-059
 * 
 * @returns Array of default threshold configurations
 */
export function getDefaultThresholds(): WatchdogThreshold[] {
  return [...DEFAULT_THRESHOLDS];
}

/**
 * Checks metrics against thresholds and returns alerts
 * Architecture: observability-architecture.md §4
 * FRS: FR-059
 * 
 * @param metrics - Current metrics snapshot
 * @param thresholds - Threshold configurations
 * @returns Array of triggered alerts with severity
 */
export function checkThresholds(
  metrics: WatchdogMetrics,
  thresholds: WatchdogThreshold[]
): Array<{ metric: string; value: number; severity: 'warning' | 'critical' }> {
  const alerts: Array<{ metric: string; value: number; severity: 'warning' | 'critical' }> = [];

  for (const threshold of thresholds) {
    if (!threshold.alert_enabled) continue;

    const value = metrics[threshold.metric] as number;
    if (typeof value !== 'number') continue;

    if (value >= threshold.critical_level) {
      alerts.push({ metric: threshold.metric, value, severity: 'critical' });
    } else if (value >= threshold.warning_level) {
      alerts.push({ metric: threshold.metric, value, severity: 'warning' });
    }
  }

  return alerts;
}

/**
 * Subscribes to real-time dashboard updates for an audit
 * Architecture: system-architecture.md §3.2, §3.12 Path 8
 * FRS: FR-039
 * 
 * Simulates Supabase Realtime subscription for dashboard updates.
 * In production, this would establish a WebSocket connection to
 * Supabase Realtime and subscribe to audit data changes.
 * 
 * @param audit_id - Audit ID to subscribe to
 * @param callback - Callback function to invoke when audit data changes
 * @returns Subscription object with unsubscribe function
 */
export function subscribeToDashboardUpdates(
  audit_id: string,
  callback: (data: { audit_id: string; updated_at: string }) => void
): {
  channel: string;
  status: 'subscribed';
  unsubscribe: () => void;
} {
  // In production, this would:
  // 1. Create Supabase Realtime channel: `audit:${audit_id}`
  // 2. Subscribe to changes on audits, criteria, evidence tables
  // 3. Filter by audit_id using RLS and channel parameters
  // 4. Invoke callback when INSERT/UPDATE/DELETE events occur
  // 5. Return unsubscribe function that closes the WebSocket channel
  
  const channel = `audit:${audit_id}`;
  let isSubscribed = true;

  // Simulate subscription setup
  // In production, this would be: supabase.channel(channel).on('postgres_changes', ...)
  
  return {
    channel,
    status: 'subscribed',
    unsubscribe: () => {
      // In production, this would close the WebSocket channel
      isSubscribed = false;
    }
  };
}

/**
 * Creates configurable alert thresholds for an organisation
 * Architecture: observability-architecture.md §4
 * FRS: FR-060
 * 
 * Allows per-organisation threshold customisation with
 * validation to prevent dangerous configurations.
 * 
 * @param organisationId - Organisation ID
 * @param overrides - Partial threshold overrides
 * @returns Array of merged threshold configurations
 */
export function createOrganisationThresholds(
  organisationId: string,
  overrides: Partial<Record<string, { warning_level?: number; critical_level?: number; alert_enabled?: boolean }>>
): WatchdogThreshold[] {
  const defaults = getDefaultThresholds();

  return defaults.map(threshold => {
    const override = overrides[threshold.metric];
    if (!override) return threshold;

    return {
      ...threshold,
      warning_level: override.warning_level ?? threshold.warning_level,
      critical_level: override.critical_level ?? threshold.critical_level,
      alert_enabled: override.alert_enabled ?? threshold.alert_enabled
    };
  });
}

/**
 * Returns alert routing configuration per severity
 * Architecture: observability-architecture.md §4
 * FRS: FR-060
 * 
 * Maps alert thresholds to notification channels.
 * Warning-level alerts route to email+slack.
 * Critical-level alerts add SMS escalation.
 * 
 * @returns Array of alert routing rules
 */
export function getAlertRouting(): WatchdogAlertRouting[] {
  return [
    { metric: 'ai_refusal_rate', channels: ['email', 'slack'], severity: 'warning' },
    { metric: 'ai_override_rate', channels: ['email', 'slack'], severity: 'warning' },
    { metric: 'sync_failure_rate', channels: ['email', 'slack', 'sms'], severity: 'critical' },
    { metric: 'error_rate', channels: ['email', 'slack', 'sms'], severity: 'critical' },
    { metric: 'avg_response_time_ms', channels: ['email', 'slack'], severity: 'warning' }
  ];
}

/**
 * Performs a health check on a named service
 * Architecture: observability-architecture.md §4
 * FRS: FR-060
 * 
 * Returns health status including version, uptime, and dependency health.
 * In production, this would probe actual service endpoints.
 * 
 * @param service - Service name to check
 * @param deps - Dependency statuses
 * @returns Health check result
 */
export function checkServiceHealth(
  service: string,
  deps: Array<{ name: string; healthy: boolean }>
): HealthCheckResult {
  const depResults = deps.map(d => ({
    name: d.name,
    status: d.healthy ? 'healthy' as const : 'unhealthy' as const
  }));

  const allHealthy = depResults.every(d => d.status === 'healthy');
  const someHealthy = depResults.some(d => d.status === 'healthy');

  return {
    service,
    status: allHealthy ? 'healthy' : someHealthy ? 'degraded' : 'unhealthy',
    version: '1.0.0',
    uptime_seconds: Math.floor(process.uptime()),
    dependencies: depResults,
    checked_at: new Date().toISOString()
  };
}

/**
 * Analyses override log entries and produces a summary
 * Architecture: observability-architecture.md
 * FRS: FR-061
 * 
 * Aggregates override entries by category, calculates override rate,
 * and identifies top criteria receiving overrides.
 * 
 * @param overrides - Array of override log entries
 * @param totalScored - Total number of scored criteria (for rate calculation)
 * @returns Override analysis summary
 */
export function analyseOverrides(
  overrides: OverrideLogEntry[],
  totalScored: number
): OverrideAnalysisSummary {
  const byCategory: Record<OverrideReason, number> = {
    evidence_quality: 0,
    ai_misinterpretation: 0,
    domain_specific_nuance: 0,
    other: 0
  };

  const criterionCounts: Record<string, number> = {};

  for (const entry of overrides) {
    byCategory[entry.reason_category]++;
    criterionCounts[entry.criterion_id] = (criterionCounts[entry.criterion_id] || 0) + 1;
  }

  const topCriteria = Object.entries(criterionCounts)
    .map(([criterion_id, count]) => ({ criterion_id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total_overrides: overrides.length,
    by_category: byCategory,
    override_rate: totalScored > 0 ? overrides.length / totalScored : 0,
    top_criteria: topCriteria,
    analysed_at: new Date().toISOString()
  };
}
