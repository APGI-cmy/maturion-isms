/**
 * MAT Test Suite — CAT-07: watchdog observability
 *
 * Build-to-Green for MAT-T-0058, MAT-T-0059, MAT-T-0060 (Wave 2+5 scope).
 * Remaining tests stay QA-to-Red for future waves.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  collectMetrics,
  getDefaultThresholds,
  checkThresholds,
  subscribeToDashboardUpdates,
  routeAlert,
  getHealthStatus,
  analyzeOverridePatterns
} from '../../src/services/watchdog.js';
import type { OverrideLogEntry } from '../../src/types/index.js';

describe('CAT-07: watchdog observability', () => {
  it('MAT-T-0058: Watchdog Monitoring Metrics', () => {
    // Architecture: §3.2, observability-architecture.md §4
    // FRS: FR-059
    // TRS: TR-062
    // Type: integration | Priority: P1
    const metrics = collectMetrics({
      ai_refusal_rate: 0.05,
      ai_override_rate: 0.15,
      sync_failure_rate: 0.02,
      active_audits: 10,
      evidence_count: 150,
      avg_response_time_ms: 450,
      error_rate: 0.005
    });

    expect(metrics.timestamp).toBeDefined();
    expect(metrics.ai_refusal_rate).toBe(0.05);
    expect(metrics.ai_override_rate).toBe(0.15);
    expect(metrics.sync_failure_rate).toBe(0.02);
    expect(metrics.active_audits).toBe(10);
    expect(metrics.evidence_count).toBe(150);
    expect(metrics.avg_response_time_ms).toBe(450);
    expect(metrics.error_rate).toBe(0.005);

    const thresholds = getDefaultThresholds();
    expect(thresholds.length).toBeGreaterThan(0);
    expect(thresholds.find(t => t.metric === 'ai_refusal_rate')).toBeDefined();
    expect(thresholds.find(t => t.metric === 'sync_failure_rate')).toBeDefined();

    // Normal metrics — no alerts
    const alerts = checkThresholds(metrics, thresholds);
    expect(alerts).toHaveLength(0);

    // High metrics — should trigger alerts
    const highMetrics = collectMetrics({
      ai_refusal_rate: 0.35,
      ai_override_rate: 0.55,
      sync_failure_rate: 0.20,
      active_audits: 10,
      evidence_count: 150,
      avg_response_time_ms: 6000,
      error_rate: 0.10
    });

    const criticalAlerts = checkThresholds(highMetrics, thresholds);
    expect(criticalAlerts.length).toBeGreaterThan(0);
    expect(criticalAlerts.some(a => a.severity === 'critical')).toBe(true);
  });

  it('MAT-T-0059: Watchdog Alert Thresholds', () => {
    // Architecture: observability-architecture.md §4
    // FRS: FR-060
    // TRS: TR-062
    // Type: integration | Priority: P1

    // 1. Verify alert thresholds are defined for all key metrics
    const thresholds = getDefaultThresholds();
    const metricNames = thresholds.map(t => t.metric);
    expect(metricNames).toContain('ai_refusal_rate');
    expect(metricNames).toContain('ai_override_rate');
    expect(metricNames).toContain('sync_failure_rate');
    expect(metricNames).toContain('error_rate');
    expect(metricNames).toContain('avg_response_time_ms');

    // 2. Verify each threshold has warning and critical levels
    for (const threshold of thresholds) {
      expect(threshold.warning_level).toBeDefined();
      expect(threshold.critical_level).toBeDefined();
      expect(threshold.critical_level).toBeGreaterThan(threshold.warning_level);
      expect(threshold.alert_enabled).toBe(true);
    }

    // 3. Verify alert routing for warning severity
    const warningAlert = { metric: 'ai_override_rate', value: 0.30, severity: 'warning' as const };
    const routedWarning = routeAlert(warningAlert);
    expect(routedWarning.channels).toContain('email');
    expect(routedWarning.channels).toContain('slack');
    expect(routedWarning.channels).not.toContain('sms');
    expect(routedWarning.routed_at).toBeDefined();

    // 4. Verify alert routing for critical severity
    const criticalAlert = { metric: 'error_rate', value: 0.10, severity: 'critical' as const };
    const routedCritical = routeAlert(criticalAlert);
    expect(routedCritical.channels).toContain('email');
    expect(routedCritical.channels).toContain('slack');
    expect(routedCritical.channels).toContain('sms');

    // 5. Verify health check endpoint returns correct status
    const healthyMetrics = collectMetrics({
      ai_refusal_rate: 0.01,
      ai_override_rate: 0.05,
      sync_failure_rate: 0.01,
      active_audits: 5,
      evidence_count: 100,
      avg_response_time_ms: 200,
      error_rate: 0.001
    });
    const healthyStatus = getHealthStatus('mat-api', healthyMetrics, thresholds);
    expect(healthyStatus.service).toBe('mat-api');
    expect(healthyStatus.status).toBe('healthy');
    expect(healthyStatus.checked_at).toBeDefined();
    expect(healthyStatus.alerts).toHaveLength(0);

    // 6. Verify degraded status with warning-level metrics
    const degradedMetrics = collectMetrics({
      ai_refusal_rate: 0.15,
      ai_override_rate: 0.25,
      sync_failure_rate: 0.01,
      active_audits: 5,
      evidence_count: 100,
      avg_response_time_ms: 200,
      error_rate: 0.001
    });
    const degradedStatus = getHealthStatus('mat-api', degradedMetrics, thresholds);
    expect(degradedStatus.status).toBe('degraded');
    expect(degradedStatus.alerts.length).toBeGreaterThan(0);
    expect(degradedStatus.alerts.every(a => a.severity === 'warning')).toBe(true);

    // 7. Verify unhealthy status with critical-level metrics
    const unhealthyMetrics = collectMetrics({
      ai_refusal_rate: 0.35,
      ai_override_rate: 0.55,
      sync_failure_rate: 0.20,
      active_audits: 5,
      evidence_count: 100,
      avg_response_time_ms: 6000,
      error_rate: 0.10
    });
    const unhealthyStatus = getHealthStatus('mat-api', unhealthyMetrics, thresholds);
    expect(unhealthyStatus.status).toBe('unhealthy');
    expect(unhealthyStatus.alerts.some(a => a.severity === 'critical')).toBe(true);
  });

  it('MAT-T-0060: Override Analysis and Feedback Loop', () => {
    // Architecture: observability-architecture.md
    // FRS: FR-061
    // TRS: TR-062
    // Type: integration | Priority: P1

    // 1. Analyze override patterns with multiple entries
    const overrides: OverrideLogEntry[] = [
      {
        id: 'ovr-001',
        criterion_id: 'crit-001',
        audit_id: 'audit-001',
        original_ai_level: 2,
        human_selected_level: 3,
        justification: 'AI underestimated maturity based on evidence',
        reason_category: 'ai_misinterpretation',
        evidence_ids: ['ev-001', 'ev-002'],
        logged_by: 'user-001',
        logged_at: '2026-02-10T10:00:00Z'
      },
      {
        id: 'ovr-002',
        criterion_id: 'crit-002',
        audit_id: 'audit-001',
        original_ai_level: 4,
        human_selected_level: 3,
        justification: 'Evidence quality insufficient for level 4',
        reason_category: 'evidence_quality',
        evidence_ids: ['ev-003'],
        logged_by: 'user-001',
        logged_at: '2026-02-10T11:00:00Z'
      },
      {
        id: 'ovr-003',
        criterion_id: 'crit-003',
        audit_id: 'audit-001',
        original_ai_level: 1,
        human_selected_level: 3,
        justification: 'Domain-specific context not captured by AI',
        reason_category: 'domain_specific_nuance',
        evidence_ids: ['ev-004', 'ev-005'],
        logged_by: 'user-002',
        logged_at: '2026-02-10T12:00:00Z'
      },
      {
        id: 'ovr-004',
        criterion_id: 'crit-004',
        audit_id: 'audit-001',
        original_ai_level: 3,
        human_selected_level: 2,
        justification: 'AI misread the compliance evidence',
        reason_category: 'ai_misinterpretation',
        evidence_ids: ['ev-006'],
        logged_by: 'user-001',
        logged_at: '2026-02-10T13:00:00Z'
      }
    ];

    const analysis = analyzeOverridePatterns(overrides);

    // 2. Verify total overrides count
    expect(analysis.total_overrides).toBe(4);

    // 3. Verify breakdown by reason category
    expect(analysis.by_reason.ai_misinterpretation).toBe(2);
    expect(analysis.by_reason.evidence_quality).toBe(1);
    expect(analysis.by_reason.domain_specific_nuance).toBe(1);
    expect(analysis.by_reason.other).toBe(0);

    // 4. Verify average level difference (|1|+|1|+|2|+|1| = 5 / 4 = 1.25)
    expect(analysis.average_level_difference).toBe(1.25);

    // 5. Verify direction analysis (upward: 2, downward: 2)
    expect(analysis.direction.upward).toBe(2);
    expect(analysis.direction.downward).toBe(2);

    // 6. Verify most common reason
    expect(analysis.most_common_reason).toBe('ai_misinterpretation');

    // 7. Verify empty override analysis
    const emptyAnalysis = analyzeOverridePatterns([]);
    expect(emptyAnalysis.total_overrides).toBe(0);
    expect(emptyAnalysis.average_level_difference).toBe(0);
    expect(emptyAnalysis.most_common_reason).toBeNull();
    expect(emptyAnalysis.direction.upward).toBe(0);
    expect(emptyAnalysis.direction.downward).toBe(0);
  });

  it('MAT-T-0098: Dashboard Realtime Update Wiring', () => {
    // Architecture: §3.12 Path 8 — Dashboard Real-time Updates
    // FRS: FR-039
    // TRS: TR-016
    // Type: integration | Priority: P0
    
    const audit_id = 'test-audit-123';
    const updates: Array<{ audit_id: string; updated_at: string }> = [];
    
    // Subscribe to dashboard updates
    const subscription = subscribeToDashboardUpdates(audit_id, (data) => {
      updates.push(data);
    });

    // Verify subscription structure
    expect(subscription).toBeDefined();
    expect(subscription.channel).toBe(`audit:${audit_id}`);
    expect(subscription.status).toBe('subscribed');
    expect(subscription.unsubscribe).toBeDefined();
    expect(typeof subscription.unsubscribe).toBe('function');

    // Verify unsubscribe works
    expect(() => subscription.unsubscribe()).not.toThrow();
  });
});
