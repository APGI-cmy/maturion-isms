/**
 * Watchdog Monitoring Service
 * Architecture: modules/mat/02-architecture/observability-architecture.md
 * Implements monitoring metrics collection and threshold management
 */

import type {
  WatchdogMetrics,
  WatchdogThreshold,
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
 * Routes an alert to the appropriate channels based on severity
 * Architecture: observability-architecture.md §4
 * FRS: FR-060
 * 
 * Determines routing channels using the alert threshold table:
 * - warning: email + slack
 * - critical: email + slack + sms
 * 
 * @param alert - Alert with metric, value, and severity
 * @returns Routed alert with channels and timestamp
 */
export function routeAlert(alert: {
  metric: string;
  value: number;
  severity: 'warning' | 'critical';
}): {
  metric: string;
  value: number;
  severity: 'warning' | 'critical';
  channels: string[];
  routed_at: string;
} {
  const channels = alert.severity === 'critical'
    ? ['email', 'slack', 'sms']
    : ['email', 'slack'];

  return {
    metric: alert.metric,
    value: alert.value,
    severity: alert.severity,
    channels,
    routed_at: new Date().toISOString()
  };
}

/**
 * Returns health status for a service
 * Architecture: observability-architecture.md §3
 * FRS: FR-062
 * 
 * Evaluates service health based on current metrics against thresholds.
 * Returns 'healthy' if no alerts, 'degraded' if warnings only,
 * 'unhealthy' if any critical alerts exist.
 * 
 * @param serviceName - Name of the service to check
 * @param metrics - Current metrics snapshot
 * @param thresholds - Threshold configurations
 * @returns Health status object
 */
export function getHealthStatus(
  serviceName: string,
  metrics: WatchdogMetrics,
  thresholds: WatchdogThreshold[]
): {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  checked_at: string;
  alerts: Array<{ metric: string; value: number; severity: 'warning' | 'critical' }>;
} {
  const alerts = checkThresholds(metrics, thresholds);
  const hasCritical = alerts.some(a => a.severity === 'critical');
  const hasWarning = alerts.some(a => a.severity === 'warning');

  let status: 'healthy' | 'degraded' | 'unhealthy';
  if (hasCritical) {
    status = 'unhealthy';
  } else if (hasWarning) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }

  return {
    service: serviceName,
    status,
    checked_at: new Date().toISOString(),
    alerts
  };
}

/**
 * Analyzes override patterns for feedback loop
 * Architecture: observability-architecture.md §4
 * FRS: FR-061
 * 
 * Aggregates override log entries to identify patterns in human
 * overrides of AI scores, enabling model improvement feedback.
 * 
 * @param overrides - Array of override log entries
 * @returns Override pattern analysis with breakdown by reason and direction
 */
export function analyzeOverridePatterns(overrides: OverrideLogEntry[]): {
  total_overrides: number;
  by_reason: Record<OverrideReason, number>;
  average_level_difference: number;
  direction: { upward: number; downward: number };
  most_common_reason: OverrideReason | null;
} {
  const byReason: Record<OverrideReason, number> = {
    evidence_quality: 0,
    ai_misinterpretation: 0,
    domain_specific_nuance: 0,
    other: 0
  };

  let totalDifference = 0;
  let upward = 0;
  let downward = 0;

  for (const override of overrides) {
    byReason[override.reason_category]++;
    const diff = override.human_selected_level - override.original_ai_level;
    totalDifference += Math.abs(diff);
    if (diff > 0) upward++;
    else if (diff < 0) downward++;
  }

  let mostCommonReason: OverrideReason | null = null;
  let maxCount = 0;
  for (const [reason, count] of Object.entries(byReason)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonReason = reason as OverrideReason;
    }
  }

  return {
    total_overrides: overrides.length,
    by_reason: byReason,
    average_level_difference: overrides.length > 0 ? totalDifference / overrides.length : 0,
    direction: { upward, downward },
    most_common_reason: overrides.length > 0 ? mostCommonReason : null
  };
}
