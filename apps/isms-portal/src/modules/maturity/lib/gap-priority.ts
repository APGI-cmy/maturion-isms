/**
 * Gap Priority Engine Library
 * 
 * Implements the Gap Priority Engine v1.0 specification for calculating
 * priority scores for maturity gaps based on multiple factors including
 * gap size, evidence confidence, criticality, risks, regulatory requirements,
 * and time exposure.
 * 
 * Architecture Reference: architecture/modules/pit/Architecture/GAP_PRIORITY_ENGINE_v1.0.md
 */

export interface GapPriorityInput {
  // Core gap metrics
  gap: number;                              // 0-4 levels
  current_level: number;                    // 1-5
  target_level: number;                     // 1-5
  
  // Evidence quality
  evidence_count: number;
  avg_evidence_confidence: number;          // 0.00-1.00
  
  // Business impact
  criticality: 'low' | 'medium' | 'high' | 'critical';
  
  // Risk factors
  linked_risks?: {
    count: number;
    max_severity: 'low' | 'medium' | 'high' | 'critical';
    total_risk_score?: number;
  };
  
  // Regulatory & compliance
  regulatory_relevance: 'none' | 'moderate' | 'high';
  compliance_frameworks?: string[];
  audit_flags?: string[];
  
  // Time factors
  time_exposed_days: number;
  
  // Existing work
  existing_pit_tasks?: {
    open_count: number;
    overdue_count: number;
  };
}

export interface GapPriorityModifiers {
  evidence_confidence: number;    // 0.75 - 1.25
  criticality: number;            // 1.0 - 3.0
  linked_risks: number;           // 1.0 - 2.0
  regulatory_relevance: number;   // 1.0 - 1.5
  time_exposed: number;           // 1.0 - 2.0
  existing_tasks: number;         // 0.5 - 1.0
}

export interface GapPriorityOutput {
  priority_score: number;         // 0.00 - 4.00+ (unbounded upward)
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  base_priority: number;          // From gap size
  modifiers: GapPriorityModifiers;
}

/**
 * Computes base priority from gap size
 * Formula: base_priority = gap / 4
 */
export function computeBasePriority(gap: number): number {
  // Clamp gap to valid range [0, 4]
  const clampedGap = Math.max(0, Math.min(4, gap));
  return clampedGap / 4;
}

/**
 * Computes evidence confidence modifier
 * Formula: modifier = 1.0 + (0.70 - avg_evidence_confidence) / 2
 * Clamped to [0.75, 1.25]
 * 
 * Logic:
 * - High confidence (0.90-1.00) → reduces priority (gap is well-documented)
 * - Low confidence (0.00-0.50) → increases priority (gap needs investigation)
 */
export function computeEvidenceConfidenceModifier(
  evidence_count: number,
  avg_evidence_confidence: number
): number {
  // No evidence = maximum penalty
  if (evidence_count === 0) {
    return 1.25;
  }
  
  const modifier = 1.0 + (0.70 - avg_evidence_confidence) / 2;
  return Math.max(0.75, Math.min(1.25, modifier));
}

/**
 * Computes criticality modifier
 * Maps business criticality to multiplier
 */
export function computeCriticalityModifier(
  criticality: 'low' | 'medium' | 'high' | 'critical'
): number {
  const mapping = {
    low: 1.0,
    medium: 1.5,
    high: 2.0,
    critical: 3.0,
  };
  return mapping[criticality];
}

/**
 * Computes linked risks modifier
 * Formula: 1.0 + (severity_score / 10) + risk_count_factor
 * Clamped to [1.0, 2.0]
 */
export function computeLinkedRisksModifier(
  linked_risks?: {
    count: number;
    max_severity: 'low' | 'medium' | 'high' | 'critical';
  }
): number {
  if (!linked_risks || linked_risks.count === 0) {
    return 1.0;
  }
  
  // Map severity to score
  const severityMapping = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  
  const severityScore = severityMapping[linked_risks.max_severity];
  const riskCountFactor = Math.min(linked_risks.count / 5, 0.5);
  
  const modifier = 1.0 + (severityScore / 10) + riskCountFactor;
  return Math.max(1.0, Math.min(2.0, modifier));
}

/**
 * Computes regulatory relevance modifier
 * Clamped to [1.0, 1.5]
 */
export function computeRegulatoryRelevanceModifier(
  regulatory_relevance: 'none' | 'moderate' | 'high',
  compliance_frameworks?: string[],
  audit_flags?: string[]
): number {
  const baseMapping = {
    none: 1.0,
    moderate: 1.2,
    high: 1.5,
  };
  
  let modifier = baseMapping[regulatory_relevance];
  
  // High-priority frameworks override
  const highPriorityFrameworks = ['ISO 27001', 'SOC 2', 'HIPAA', 'GDPR'];
  if (compliance_frameworks && compliance_frameworks.length > 0) {
    const hasHighPriority = compliance_frameworks.some(fw => 
      highPriorityFrameworks.includes(fw)
    );
    if (hasHighPriority) {
      modifier = Math.max(modifier, 1.3);
    }
  }
  
  // Auditor attention adds weight
  if (audit_flags && audit_flags.length > 0) {
    modifier = Math.min(modifier + 0.1, 1.5);
  }
  
  return Math.max(1.0, Math.min(1.5, modifier));
}

/**
 * Computes time exposed modifier
 * Increases priority for long-standing gaps
 * Clamped to [1.0, 2.0]
 */
export function computeTimeExposedModifier(time_exposed_days: number): number {
  if (time_exposed_days <= 30) {
    return 1.0;
  } else if (time_exposed_days <= 90) {
    return 1.1;
  } else if (time_exposed_days <= 180) {
    return 1.3;
  } else if (time_exposed_days <= 365) {
    return 1.5;
  } else {
    return 2.0;
  }
}

/**
 * Computes existing tasks modifier
 * Reduces priority if work is in progress, maintains if overdue
 * Clamped to [0.5, 1.0]
 */
export function computeExistingTasksModifier(
  existing_pit_tasks?: {
    open_count: number;
    overdue_count: number;
  }
): number {
  if (!existing_pit_tasks || existing_pit_tasks.open_count === 0) {
    return 1.0;
  }
  
  if (existing_pit_tasks.overdue_count > 0) {
    return 1.0; // Overdue tasks = maintain urgency
  }
  
  return 0.9; // Active tasks = slightly reduce priority
}

/**
 * Maps priority score to priority level
 * Based on deterministic thresholds
 */
export function mapPriorityLevel(
  priority_score: number,
  criticality?: 'low' | 'medium' | 'high' | 'critical'
): 'low' | 'medium' | 'high' | 'critical' {
  let level: 'low' | 'medium' | 'high' | 'critical';
  
  if (priority_score >= 2.51) {
    level = 'critical';
  } else if (priority_score >= 1.51) {
    level = 'high';
  } else if (priority_score >= 0.51) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  // Override rule: critical business criticality = minimum high priority
  if (criticality === 'critical' && (level === 'low' || level === 'medium')) {
    level = 'high';
  }
  
  return level;
}

/**
 * Main function to compute gap priority
 * Implements the full Gap Priority Engine v1.0 calculation
 */
export function computeGapPriority(input: GapPriorityInput): GapPriorityOutput {
  // Compute base priority
  const base_priority = computeBasePriority(input.gap);
  
  // Compute all modifiers
  const modifiers: GapPriorityModifiers = {
    evidence_confidence: computeEvidenceConfidenceModifier(
      input.evidence_count,
      input.avg_evidence_confidence
    ),
    criticality: computeCriticalityModifier(input.criticality),
    linked_risks: computeLinkedRisksModifier(input.linked_risks),
    regulatory_relevance: computeRegulatoryRelevanceModifier(
      input.regulatory_relevance,
      input.compliance_frameworks,
      input.audit_flags
    ),
    time_exposed: computeTimeExposedModifier(input.time_exposed_days),
    existing_tasks: computeExistingTasksModifier(input.existing_pit_tasks),
  };
  
  // Calculate final priority score
  const priority_score = 
    base_priority *
    modifiers.evidence_confidence *
    modifiers.criticality *
    modifiers.linked_risks *
    modifiers.regulatory_relevance *
    modifiers.time_exposed *
    modifiers.existing_tasks;
  
  // Map to priority level
  const priority_level = mapPriorityLevel(priority_score, input.criticality);
  
  return {
    priority_score,
    priority_level,
    base_priority,
    modifiers,
  };
}
