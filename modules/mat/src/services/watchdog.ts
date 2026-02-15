/**
 * Watchdog Monitoring Service
 * Architecture: modules/mat/02-architecture/observability-architecture.md
 * Implements monitoring metrics collection and threshold management
 */

import type {
  WatchdogMetrics,
  WatchdogThreshold
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
