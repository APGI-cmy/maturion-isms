/**
 * Integration Service
 * Architecture: modules/mat/02-architecture/integration-architecture.md
 * Implements PIT module export and Maturity Roadmap export endpoints
 */

import type {
  PITExportData,
  MaturityRoadmapExportData,
  MaturityLevel,
  HumanScoreConfirmation
} from '../types/index.js';

/**
 * Exports audit data for PIT module integration
 * Architecture: §3.6, §3.11.2 [M]
 * FRS: FR-056
 * 
 * Generates a PIT-compatible export containing scored criteria,
 * maturity levels, confidence scores, and evidence counts.
 * 
 * @param auditId - ID of audit to export
 * @param organisationId - Organisation ID
 * @param confirmations - Array of confirmed score records
 * @returns PIT export data
 */
export function exportForPIT(
  auditId: string,
  organisationId: string,
  confirmations: HumanScoreConfirmation[]
): PITExportData {
  const criteriaScores = confirmations.map(c => ({
    criterion_id: c.criterion_id,
    criterion_number: c.criterion_id,
    maturity_level: c.confirmed_level,
    confidence: c.ai_score.confidence,
    evidence_count: c.ai_score.evidence_citations.length
  }));

  const scoredCriteria = criteriaScores.length;
  const avgMaturity = scoredCriteria > 0
    ? criteriaScores.reduce((sum, c) => sum + c.maturity_level, 0) / scoredCriteria
    : 0;

  return {
    audit_id: auditId,
    organisation_id: organisationId,
    exported_at: new Date().toISOString(),
    criteria_scores: criteriaScores,
    summary: {
      total_criteria: scoredCriteria,
      scored_criteria: scoredCriteria,
      average_maturity: Math.round(avgMaturity * 100) / 100
    }
  };
}

/**
 * Exports audit data for Maturity Roadmap integration
 * Architecture: §3.6, §3.11.2 [N]
 * FRS: FR-057
 * 
 * Generates a roadmap-compatible export containing gap analysis,
 * current vs target maturity levels, and prioritized recommendations.
 * 
 * @param auditId - ID of audit to export
 * @param organisationId - Organisation ID
 * @param confirmations - Array of confirmed score records
 * @param targetLevel - Target maturity level for gap analysis
 * @returns Maturity Roadmap export data
 */
export function exportForMaturityRoadmap(
  auditId: string,
  organisationId: string,
  confirmations: HumanScoreConfirmation[],
  targetLevel: MaturityLevel
): MaturityRoadmapExportData {
  const gaps = confirmations
    .filter(c => c.confirmed_level < targetLevel)
    .map(c => {
      const gap = targetLevel - c.confirmed_level;
      return {
        criterion_id: c.criterion_id,
        criterion_number: c.criterion_id,
        current_level: c.confirmed_level,
        target_level: targetLevel,
        gap_description: `Gap of ${gap} level(s) from current ${c.confirmed_level} to target ${targetLevel}`,
        priority: classifyGapPriority(gap)
      };
    });

  const recommendations = generateRecommendations(gaps, targetLevel);

  return {
    audit_id: auditId,
    organisation_id: organisationId,
    exported_at: new Date().toISOString(),
    gaps,
    recommendations
  };
}

/**
 * Classifies gap priority based on gap size
 * 
 * @param gap - Difference between target and current level
 * @returns Priority classification
 */
function classifyGapPriority(gap: number): 'immediate' | 'medium_term' | 'long_term' {
  if (gap >= 3) return 'immediate';
  if (gap >= 2) return 'medium_term';
  return 'long_term';
}

/**
 * Generates recommendations based on gap analysis
 * 
 * @param gaps - Array of identified gaps
 * @param targetLevel - Target maturity level
 * @returns Array of recommendation strings
 */
function generateRecommendations(
  gaps: Array<{ priority: string; current_level: MaturityLevel; criterion_id: string }>,
  targetLevel: MaturityLevel
): string[] {
  const recommendations: string[] = [];

  const immediatePriority = gaps.filter(g => g.priority === 'immediate');
  if (immediatePriority.length > 0) {
    recommendations.push(
      `Address ${immediatePriority.length} immediate priority gap(s) to reach target level ${targetLevel}`
    );
  }

  const mediumPriority = gaps.filter(g => g.priority === 'medium_term');
  if (mediumPriority.length > 0) {
    recommendations.push(
      `Plan for ${mediumPriority.length} medium-term improvement(s)`
    );
  }

  if (gaps.length === 0) {
    recommendations.push(`All criteria meet or exceed target maturity level ${targetLevel}`);
  }

  return recommendations;
}
