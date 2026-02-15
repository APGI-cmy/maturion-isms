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
