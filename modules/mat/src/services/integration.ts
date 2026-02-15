/**
 * Integration Service
 * Architecture: modules/mat/02-architecture/integration-architecture.md
 * Implements PIT module export and Maturity Roadmap export endpoints
 */

import type {
  PITExportData,
  MaturityRoadmapExportData,
  MaturityLevel,
  HumanScoreConfirmation,
  PluginDescriptor,
  PluginRegistry
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

/**
 * Creates a plugin registry for extensible evidence types and AI capabilities
 * Architecture: §3.4, §3.10
 * FRS: FR-055
 * 
 * Supports registration of new evidence types (e.g., IoT),
 * AI capabilities, parsing rules, and maturity models
 * via a plugin architecture with governance approval gates.
 * 
 * @param plugins - Array of plugin descriptors to register
 * @returns Plugin registry with registration timestamp
 */
export function createPluginRegistry(plugins: PluginDescriptor[]): PluginRegistry {
  return {
    plugins: plugins.map(p => ({ ...p })),
    registered_at: new Date().toISOString()
  };
}

/**
 * Registers a new plugin into an existing registry
 * Architecture: §3.4, §3.10
 * FRS: FR-055
 * 
 * @param registry - Existing plugin registry
 * @param plugin - Plugin descriptor to add
 * @returns Updated plugin registry
 * @throws Error if plugin ID already exists
 */
export function registerPlugin(
  registry: PluginRegistry,
  plugin: PluginDescriptor
): PluginRegistry {
  if (registry.plugins.some(p => p.id === plugin.id)) {
    throw new Error(`Plugin with ID '${plugin.id}' already registered`);
  }

  return {
    plugins: [...registry.plugins, { ...plugin }],
    registered_at: registry.registered_at
  };
}

/**
 * Lists plugins of a specific type from the registry
 * Architecture: §3.4, §3.10
 * FRS: FR-055
 * 
 * @param registry - Plugin registry to query
 * @param type - Plugin type filter
 * @returns Filtered array of plugin descriptors
 */
export function getPluginsByType(
  registry: PluginRegistry,
  type: PluginDescriptor['type']
): PluginDescriptor[] {
  return registry.plugins.filter(p => p.type === type);
}

/**
 * Validates API contract for PIT export endpoint
 * Architecture: integration-architecture.md
 * FRS: FR-056
 * 
 * Validates that the export payload conforms to the PIT API contract:
 * required fields, data types, and structural integrity.
 * 
 * @param data - PIT export data to validate
 * @returns Validation result with any errors
 */
export function validatePITContract(
  data: PITExportData
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.audit_id) errors.push('audit_id is required');
  if (!data.organisation_id) errors.push('organisation_id is required');
  if (!data.exported_at) errors.push('exported_at is required');
  if (!Array.isArray(data.criteria_scores)) errors.push('criteria_scores must be an array');
  if (!data.summary) errors.push('summary is required');

  if (data.summary) {
    if (typeof data.summary.total_criteria !== 'number') errors.push('summary.total_criteria must be a number');
    if (typeof data.summary.scored_criteria !== 'number') errors.push('summary.scored_criteria must be a number');
    if (typeof data.summary.average_maturity !== 'number') errors.push('summary.average_maturity must be a number');
  }

  for (const score of data.criteria_scores) {
    if (!score.criterion_id) errors.push('criteria_scores[].criterion_id is required');
    if (typeof score.maturity_level !== 'number' || score.maturity_level < 1 || score.maturity_level > 5) {
      errors.push(`criteria_scores[].maturity_level must be 1-5, got ${score.maturity_level}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
