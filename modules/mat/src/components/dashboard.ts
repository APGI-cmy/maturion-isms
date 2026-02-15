/**
 * Dashboard Component
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md
 * Implements global audit dashboard with aggregate metrics
 * FRS: FR-039
 */

import type {
  DashboardMetrics,
  DashboardDomainMetric,
  HumanScoreConfirmation,
  MaturityLevel
} from '../types/index.js';

/**
 * Generates global dashboard metrics from confirmation data
 * Architecture: UI Component Architecture — Dashboards
 * FRS: FR-039
 * 
 * @param auditId - Audit ID
 * @param confirmations - Array of confirmed score records
 * @param totalCriteria - Total number of criteria in the audit
 * @param domainMapping - Map of criterion IDs to domain info
 * @returns Dashboard metrics
 */
export function generateDashboardMetrics(
  auditId: string,
  confirmations: HumanScoreConfirmation[],
  totalCriteria: number,
  domainMapping: Map<string, { domain_id: string; domain_name: string }>
): DashboardMetrics {
  const scoredCriteria = confirmations.length;
  const confirmedCriteria = confirmations.length;

  const avgMaturity = scoredCriteria > 0
    ? confirmations.reduce((sum, c) => sum + c.confirmed_level, 0) / scoredCriteria
    : 0;

  const completionPct = totalCriteria > 0
    ? Math.round((scoredCriteria / totalCriteria) * 100)
    : 0;

  // Build domain-level metrics
  const domainMetricsMap = new Map<string, {
    domain_name: string;
    scores: MaturityLevel[];
    total: number;
  }>();

  for (const confirmation of confirmations) {
    const domainInfo = domainMapping.get(confirmation.criterion_id);
    if (domainInfo) {
      const existing = domainMetricsMap.get(domainInfo.domain_id);
      if (existing) {
        existing.scores.push(confirmation.confirmed_level);
      } else {
        domainMetricsMap.set(domainInfo.domain_id, {
          domain_name: domainInfo.domain_name,
          scores: [confirmation.confirmed_level],
          total: 0
        });
      }
    }
  }

  // Count total criteria per domain
  for (const [, domainInfo] of domainMapping) {
    const existing = domainMetricsMap.get(domainInfo.domain_id);
    if (existing) {
      existing.total++;
    } else {
      domainMetricsMap.set(domainInfo.domain_id, {
        domain_name: domainInfo.domain_name,
        scores: [],
        total: 1
      });
    }
  }

  const domains: DashboardDomainMetric[] = [];
  for (const [domainId, data] of domainMetricsMap) {
    const domainAvg = data.scores.length > 0
      ? data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length
      : 0;

    domains.push({
      domain_id: domainId,
      domain_name: data.domain_name,
      criteria_count: data.total,
      scored_count: data.scores.length,
      average_maturity: Math.round(domainAvg * 100) / 100
    });
  }

  return {
    audit_id: auditId,
    total_criteria: totalCriteria,
    scored_criteria: scoredCriteria,
    confirmed_criteria: confirmedCriteria,
    average_maturity: Math.round(avgMaturity * 100) / 100,
    completion_percentage: completionPct,
    domains,
    generated_at: new Date().toISOString()
  };
}

/**
 * Validates dashboard metrics for completeness
 * 
 * @param metrics - Dashboard metrics to validate
 * @returns Validation result
 */
export function validateDashboardMetrics(metrics: DashboardMetrics): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!metrics.audit_id) errors.push('Missing audit_id');
  if (metrics.total_criteria < 0) errors.push('Invalid total_criteria');
  if (metrics.scored_criteria > metrics.total_criteria) errors.push('Scored exceeds total');
  if (metrics.average_maturity < 0 || metrics.average_maturity > 5) errors.push('Invalid average_maturity');
  if (metrics.completion_percentage < 0 || metrics.completion_percentage > 100) errors.push('Invalid completion_percentage');

  return {
    valid: errors.length === 0,
    errors
  };
}
