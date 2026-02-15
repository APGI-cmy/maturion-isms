/**
 * Performance Budget Service
 * Architecture: modules/mat/02-architecture/performance-architecture.md
 * Implements performance budget definitions and validation
 */

import type {
  PerformanceBudget,
  PerformanceBudgetResult
} from '../types/index.js';

/**
 * Default performance budgets per architecture specification
 * Architecture: performance-architecture.md
 * FRS: FR-068, FR-069
 */
const PERFORMANCE_BUDGETS: PerformanceBudget[] = [
  {
    metric: 'lcp',
    target: 2500,
    unit: 'ms',
    threshold_warning: 2000,
    threshold_critical: 2500
  },
  {
    metric: 'cls',
    target: 0.1,
    unit: 'score',
    threshold_warning: 0.08,
    threshold_critical: 0.1
  },
  {
    metric: 'initial_js_bundle_kb',
    target: 300,
    unit: 'KB',
    threshold_warning: 250,
    threshold_critical: 300
  },
  {
    metric: 'api_response_p95_crud',
    target: 200,
    unit: 'ms',
    threshold_warning: 150,
    threshold_critical: 200
  },
  {
    metric: 'api_response_p95_list',
    target: 500,
    unit: 'ms',
    threshold_warning: 400,
    threshold_critical: 500
  },
  {
    metric: 'api_response_p95_aggregation',
    target: 1000,
    unit: 'ms',
    threshold_warning: 800,
    threshold_critical: 1000
  },
  {
    metric: 'document_parsing_50pages',
    target: 60000,
    unit: 'ms',
    threshold_warning: 45000,
    threshold_critical: 60000
  },
  {
    metric: 'maturity_scoring_per_criterion',
    target: 30000,
    unit: 'ms',
    threshold_warning: 20000,
    threshold_critical: 30000
  },
  {
    metric: 'report_generation_500criteria',
    target: 120000,
    unit: 'ms',
    threshold_warning: 90000,
    threshold_critical: 120000
  },
  {
    metric: 'large_audit_compilation_1000',
    target: 300000,
    unit: 'ms',
    threshold_warning: 240000,
    threshold_critical: 300000
  },
  {
    metric: 'concurrent_users',
    target: 100,
    unit: 'users',
    threshold_warning: 80,
    threshold_critical: 100
  },
  {
    metric: 'page_load_cold_4g',
    target: 3000,
    unit: 'ms',
    threshold_warning: 2500,
    threshold_critical: 3000
  },
  {
    metric: 'spa_navigation',
    target: 500,
    unit: 'ms',
    threshold_warning: 400,
    threshold_critical: 500
  }
];

/**
 * Returns all defined performance budgets
 * Architecture: performance-architecture.md
 * FRS: FR-068
 * 
 * @returns Array of performance budget definitions
 */
export function getPerformanceBudgets(): PerformanceBudget[] {
  return [...PERFORMANCE_BUDGETS];
}

/**
 * Returns the performance budget for a specific metric
 * Architecture: performance-architecture.md
 * FRS: FR-068
 * 
 * @param metric - Metric name to look up
 * @returns Budget definition or undefined
 */
export function getBudgetForMetric(metric: string): PerformanceBudget | undefined {
  return PERFORMANCE_BUDGETS.find(b => b.metric === metric);
}

/**
 * Validates an actual measurement against a budget target
 * Architecture: performance-architecture.md
 * FRS: FR-068, FR-069
 * 
 * @param metric - Metric name
 * @param actual - Actual measured value
 * @returns Validation result with pass/warning/fail status
 */
export function validateBudget(metric: string, actual: number): PerformanceBudgetResult {
  const budget = getBudgetForMetric(metric);
  if (!budget) {
    return {
      metric,
      target: 0,
      actual,
      unit: 'unknown',
      status: 'fail'
    };
  }

  let status: 'pass' | 'warning' | 'fail';
  if (actual > budget.threshold_critical) {
    status = 'fail';
  } else if (actual > budget.threshold_warning) {
    status = 'warning';
  } else {
    status = 'pass';
  }

  return {
    metric,
    target: budget.target,
    actual,
    unit: budget.unit,
    status
  };
}

/**
 * Validates concurrent user capacity definition
 * Architecture: performance-architecture.md
 * FRS: FR-069
 * 
 * Returns the concurrent user budget and validates
 * that a given user count meets the target.
 * 
 * @param userCount - Number of concurrent users to validate
 * @returns Budget result for concurrent users
 */
export function validateConcurrentCapacity(userCount: number): PerformanceBudgetResult {
  return validateBudget('concurrent_users', userCount);
}

/**
 * Validates large audit compilation budget
 * Architecture: performance-architecture.md
 * FRS: FR-068
 * 
 * Validates that a given criteria count and compilation time
 * meet the large audit performance targets.
 * 
 * @param criteriaCount - Number of criteria in the audit
 * @param compilationTimeMs - Actual compilation time in milliseconds
 * @returns Budget result
 */
export function validateLargeAuditBudget(
  criteriaCount: number,
  compilationTimeMs: number
): PerformanceBudgetResult {
  return validateBudget('large_audit_compilation_1000', compilationTimeMs);
}

/**
 * Returns AI processing performance budgets
 * Architecture: performance-architecture.md
 * FRS: FR-068
 * 
 * @returns Array of AI-specific performance budgets
 */
export function getAIPerformanceBudgets(): PerformanceBudget[] {
  const aiMetrics = [
    'document_parsing_50pages',
    'maturity_scoring_per_criterion',
    'report_generation_500criteria'
  ];
  return PERFORMANCE_BUDGETS.filter(b => aiMetrics.includes(b.metric));
}
