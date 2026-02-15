/**
 * MAT Test Suite — CAT-07: watchdog observability
 *
 * Build-to-Green for MAT-T-0058 (Wave 2 scope).
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
  createOrganisationThresholds,
  getAlertRouting,
  checkServiceHealth,
  analyseOverrides
} from '../../src/services/watchdog.js';
import type { OverrideLogEntry, OverrideReason } from '../../src/types/index.js';

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

    // Configurable thresholds per organisation
    const orgThresholds = createOrganisationThresholds('org-001', {
      ai_refusal_rate: { warning_level: 0.12, critical_level: 0.25 },
      error_rate: { alert_enabled: false }
    });

    expect(orgThresholds.length).toBe(5);
    const refusal = orgThresholds.find(t => t.metric === 'ai_refusal_rate')!;
    expect(refusal.warning_level).toBe(0.12);
    expect(refusal.critical_level).toBe(0.25);

    const errorRate = orgThresholds.find(t => t.metric === 'error_rate')!;
    expect(errorRate.alert_enabled).toBe(false);

    // Non-overridden thresholds retain defaults
    const syncThreshold = orgThresholds.find(t => t.metric === 'sync_failure_rate')!;
    const defaults = getDefaultThresholds();
    const defaultSync = defaults.find(t => t.metric === 'sync_failure_rate')!;
    expect(syncThreshold.warning_level).toBe(defaultSync.warning_level);

    // Custom thresholds trigger alerts correctly
    const metrics = collectMetrics({
      ai_refusal_rate: 0.20,
      ai_override_rate: 0.10,
      sync_failure_rate: 0.01,
      active_audits: 5,
      evidence_count: 100,
      avg_response_time_ms: 300,
      error_rate: 0.08
    });

    const alerts = checkThresholds(metrics, orgThresholds);
    // ai_refusal_rate 0.20 >= custom warning 0.12 → warning alert
    expect(alerts.some(a => a.metric === 'ai_refusal_rate' && a.severity === 'warning')).toBe(true);
    // error_rate disabled → no alert even though value is high
    expect(alerts.some(a => a.metric === 'error_rate')).toBe(false);

    // Alert routing configuration
    const routing = getAlertRouting();
    expect(routing.length).toBeGreaterThan(0);
    const criticalRoutes = routing.filter(r => r.severity === 'critical');
    expect(criticalRoutes.every(r => r.channels.includes('sms'))).toBe(true);
    const warningRoutes = routing.filter(r => r.severity === 'warning');
    expect(warningRoutes.every(r => r.channels.includes('email'))).toBe(true);

    // Health check endpoints
    const healthResult = checkServiceHealth('api', [
      { name: 'database', healthy: true },
      { name: 'ai-gateway', healthy: true }
    ]);
    expect(healthResult.service).toBe('api');
    expect(healthResult.status).toBe('healthy');
    expect(healthResult.version).toBeDefined();
    expect(healthResult.uptime_seconds).toBeGreaterThanOrEqual(0);
    expect(healthResult.dependencies).toHaveLength(2);
    expect(healthResult.checked_at).toBeDefined();

    // Degraded health when some deps fail
    const degradedHealth = checkServiceHealth('api', [
      { name: 'database', healthy: true },
      { name: 'ai-gateway', healthy: false }
    ]);
    expect(degradedHealth.status).toBe('degraded');
  });

  it('MAT-T-0060: Override Analysis and Feedback Loop', () => {
    // Architecture: observability-architecture.md
    // FRS: FR-061
    // TRS: TR-062
    // Type: integration | Priority: P1

    const overrides: OverrideLogEntry[] = [
      {
        id: 'ovr-001',
        criterion_id: 'crit-001',
        audit_id: 'audit-001',
        original_ai_level: 3,
        human_selected_level: 4,
        justification: 'AI missed recent policy update evidence',
        reason_category: 'ai_misinterpretation',
        evidence_ids: ['ev-001', 'ev-002'],
        logged_by: 'user-001',
        logged_at: new Date().toISOString()
      },
      {
        id: 'ovr-002',
        criterion_id: 'crit-002',
        audit_id: 'audit-001',
        original_ai_level: 2,
        human_selected_level: 3,
        justification: 'Evidence quality insufficient for AI but valid per domain expert',
        reason_category: 'evidence_quality',
        evidence_ids: ['ev-003'],
        logged_by: 'user-002',
        logged_at: new Date().toISOString()
      },
      {
        id: 'ovr-003',
        criterion_id: 'crit-001',
        audit_id: 'audit-001',
        original_ai_level: 4,
        human_selected_level: 3,
        justification: 'Domain-specific nuance in healthcare sector',
        reason_category: 'domain_specific_nuance',
        evidence_ids: ['ev-004'],
        logged_by: 'user-001',
        logged_at: new Date().toISOString()
      }
    ];

    const analysis = analyseOverrides(overrides, 20);

    // Total override count
    expect(analysis.total_overrides).toBe(3);

    // Override rate calculation: 3 overrides / 20 total scored = 0.15
    expect(analysis.override_rate).toBeCloseTo(0.15, 5);

    // Category breakdown
    expect(analysis.by_category.ai_misinterpretation).toBe(1);
    expect(analysis.by_category.evidence_quality).toBe(1);
    expect(analysis.by_category.domain_specific_nuance).toBe(1);
    expect(analysis.by_category.other).toBe(0);

    // Top criteria (crit-001 overridden twice)
    expect(analysis.top_criteria[0].criterion_id).toBe('crit-001');
    expect(analysis.top_criteria[0].count).toBe(2);

    // Timestamp is present
    expect(analysis.analysed_at).toBeDefined();

    // Edge case: empty overrides
    const emptyAnalysis = analyseOverrides([], 10);
    expect(emptyAnalysis.total_overrides).toBe(0);
    expect(emptyAnalysis.override_rate).toBe(0);
    expect(emptyAnalysis.top_criteria).toHaveLength(0);
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
