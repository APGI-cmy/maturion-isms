/**
 * Dashboard Component
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md
 * Implements global audit dashboard with aggregate metrics, domain/MPS drill-down,
 * and maturity distribution visualization
 * FRS: FR-039, FR-040, FR-041, FR-042
 */

import type {
  DashboardMetrics,
  DashboardDomainMetric,
  HumanScoreConfirmation,
  MaturityLevel
} from '../types/index.js';

/**
 * Domain drill-down metrics (FR-040)
 */
export interface DomainDrilldownMetrics {
  domain_id: string;
  domain_name: string;
  criteria_count: number;
  scored_count: number;
  average_maturity: number;
  completion_percentage: number;
  mps_breakdown: MPSDrilldownMetric[];
  generated_at: string;
}

/**
 * MPS drill-down metric within a domain (FR-041)
 */
export interface MPSDrilldownMetric {
  mps_id: string;
  mps_number: string;
  mps_title: string;
  criteria_count: number;
  scored_count: number;
  average_maturity: number;
  criteria: CriterionScoreDetail[];
}

/**
 * Criterion-level score detail (FR-041)
 */
export interface CriterionScoreDetail {
  criterion_id: string;
  criterion_number: string;
  ai_maturity_level: MaturityLevel;
  confirmed_level: MaturityLevel;
  is_override: boolean;
  confidence: number;
}

/**
 * Maturity distribution data for visualization (FR-042)
 */
export interface MaturityDistribution {
  audit_id: string;
  distribution: MaturityLevelCount[];
  total_scored: number;
  median_level: number;
  mode_level: MaturityLevel;
  generated_at: string;
}

/**
 * Count per maturity level
 */
export interface MaturityLevelCount {
  level: MaturityLevel;
  count: number;
  percentage: number;
}

/**
 * MPS mapping entry for drill-down
 */
export interface MPSMappingEntry {
  domain_id: string;
  domain_name: string;
  mps_id: string;
  mps_number: string;
  mps_title: string;
  criterion_number: string;
}

/**
 * Rounds a number to two decimal places
 *
 * @param value - Number to round
 * @returns Number rounded to 2 decimal places
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

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
      average_maturity: roundToTwoDecimals(domainAvg)
    });
  }

  return {
    audit_id: auditId,
    total_criteria: totalCriteria,
    scored_criteria: scoredCriteria,
    confirmed_criteria: confirmedCriteria,
    average_maturity: roundToTwoDecimals(avgMaturity),
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

/**
 * Generates domain drill-down metrics from confirmation data
 * Architecture: UI Component Architecture — Domain Dashboard
 * FRS: FR-040
 *
 * @param domainId - Domain ID to drill into
 * @param domainName - Domain name
 * @param confirmations - Array of confirmed score records
 * @param mpsMapping - Map of criterion IDs to MPS info
 * @returns Domain drill-down metrics with MPS breakdown
 */
export function generateDomainDrilldown(
  domainId: string,
  domainName: string,
  confirmations: HumanScoreConfirmation[],
  mpsMapping: Map<string, MPSMappingEntry>
): DomainDrilldownMetrics {
  // Group confirmations by MPS
  const mpsMetricsMap = new Map<string, {
    mps_number: string;
    mps_title: string;
    scores: HumanScoreConfirmation[];
    total: number;
  }>();

  // Count total criteria per MPS
  for (const [criterionId, mapping] of mpsMapping) {
    if (mapping.domain_id !== domainId) continue;
    const existing = mpsMetricsMap.get(mapping.mps_id);
    if (existing) {
      existing.total++;
    } else {
      mpsMetricsMap.set(mapping.mps_id, {
        mps_number: mapping.mps_number,
        mps_title: mapping.mps_title,
        scores: [],
        total: 1
      });
    }
  }

  // Assign confirmations to MPS
  for (const confirmation of confirmations) {
    const mapping = mpsMapping.get(confirmation.criterion_id);
    if (mapping && mapping.domain_id === domainId) {
      const existing = mpsMetricsMap.get(mapping.mps_id);
      if (existing) {
        existing.scores.push(confirmation);
      }
    }
  }

  // Build MPS breakdown
  const mps_breakdown: MPSDrilldownMetric[] = [];
  let totalCriteria = 0;
  let totalScored = 0;

  for (const [mpsId, data] of mpsMetricsMap) {
    const mpsAvg = data.scores.length > 0
      ? data.scores.reduce((sum, c) => sum + c.confirmed_level, 0) / data.scores.length
      : 0;

    const criteria: CriterionScoreDetail[] = data.scores.map(c => {
      const mapping = mpsMapping.get(c.criterion_id);
      return {
        criterion_id: c.criterion_id,
        criterion_number: mapping?.criterion_number || c.criterion_id,
        ai_maturity_level: c.ai_score.maturity_level,
        confirmed_level: c.confirmed_level,
        is_override: c.is_override,
        confidence: c.ai_score.confidence
      };
    });

    mps_breakdown.push({
      mps_id: mpsId,
      mps_number: data.mps_number,
      mps_title: data.mps_title,
      criteria_count: data.total,
      scored_count: data.scores.length,
      average_maturity: roundToTwoDecimals(mpsAvg),
      criteria
    });

    totalCriteria += data.total;
    totalScored += data.scores.length;
  }

  const allScores = confirmations.filter(c => {
    const mapping = mpsMapping.get(c.criterion_id);
    return mapping && mapping.domain_id === domainId;
  });

  const domainAvg = allScores.length > 0
    ? allScores.reduce((sum, c) => sum + c.confirmed_level, 0) / allScores.length
    : 0;

  const completionPct = totalCriteria > 0
    ? Math.round((totalScored / totalCriteria) * 100)
    : 0;

  return {
    domain_id: domainId,
    domain_name: domainName,
    criteria_count: totalCriteria,
    scored_count: totalScored,
    average_maturity: roundToTwoDecimals(domainAvg),
    completion_percentage: completionPct,
    mps_breakdown,
    generated_at: new Date().toISOString()
  };
}

/**
 * Generates maturity distribution data for visualization charts
 * Architecture: UI Component Architecture — Maturity Distribution Visualization
 * FRS: FR-042
 *
 * @param auditId - Audit ID
 * @param confirmations - Array of confirmed score records
 * @returns Maturity distribution with counts per level
 */
export function generateMaturityDistribution(
  auditId: string,
  confirmations: HumanScoreConfirmation[]
): MaturityDistribution {
  const levels: MaturityLevel[] = [1, 2, 3, 4, 5];
  const counts = new Map<MaturityLevel, number>();

  for (const level of levels) {
    counts.set(level, 0);
  }

  for (const confirmation of confirmations) {
    const current = counts.get(confirmation.confirmed_level) || 0;
    counts.set(confirmation.confirmed_level, current + 1);
  }

  const totalScored = confirmations.length;

  const distribution: MaturityLevelCount[] = levels.map(level => ({
    level,
    count: counts.get(level) || 0,
    percentage: totalScored > 0
      ? Math.round(((counts.get(level) || 0) / totalScored) * 100)
      : 0
  }));

  // Calculate median
  const sortedLevels = confirmations
    .map(c => c.confirmed_level)
    .sort((a, b) => a - b);
  const medianLevel = sortedLevels.length > 0
    ? sortedLevels[Math.floor(sortedLevels.length / 2)]
    : 0;

  // Calculate mode (most frequent level)
  let modeLevel: MaturityLevel = 1;
  let maxCount = 0;
  for (const [level, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      modeLevel = level;
    }
  }

  return {
    audit_id: auditId,
    distribution,
    total_scored: totalScored,
    median_level: medianLevel,
    mode_level: modeLevel,
    generated_at: new Date().toISOString()
  };
}
