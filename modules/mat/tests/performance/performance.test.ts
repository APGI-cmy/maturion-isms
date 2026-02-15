/**
 * MAT Test Suite — CAT-08: performance
 *
 * Build-to-Green: Tests validate performance budget definitions
 * and validation logic per performance-architecture.md.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  getPerformanceBudgets,
  getBudgetForMetric,
  validateBudget,
  validateConcurrentCapacity,
  validateLargeAuditBudget,
  getAIPerformanceBudgets
} from '../../src/services/performance.js';

describe('CAT-08: performance', () => {
  it('MAT-T-0071: Large Audit Compilation', () => {
    // Architecture: §3.2
    // FRS: FR-068
    // TRS: TR-010
    // Type: performance | Priority: P1

    const budget = getBudgetForMetric('large_audit_compilation_1000');
    expect(budget).toBeDefined();
    expect(budget!.target).toBe(300000); // 5 minutes in ms
    expect(budget!.unit).toBe('ms');

    // Under budget → pass
    const passResult = validateLargeAuditBudget(1000, 180000);
    expect(passResult.status).toBe('pass');
    expect(passResult.actual).toBe(180000);

    // At warning threshold → warning
    const warningResult = validateLargeAuditBudget(1000, 250000);
    expect(warningResult.status).toBe('warning');

    // Over budget → fail
    const failResult = validateLargeAuditBudget(1000, 350000);
    expect(failResult.status).toBe('fail');

    // Report generation budget exists
    const reportBudget = getBudgetForMetric('report_generation_500criteria');
    expect(reportBudget).toBeDefined();
    expect(reportBudget!.target).toBe(120000); // 2 minutes in ms
  });

  it('MAT-T-0072: Concurrent Auditor Support', () => {
    // Architecture: §3.2
    // FRS: FR-069
    // TRS: TR-010
    // Type: performance | Priority: P1

    const budget = getBudgetForMetric('concurrent_users');
    expect(budget).toBeDefined();
    expect(budget!.target).toBe(100);
    expect(budget!.unit).toBe('users');

    // 100+ concurrent users without degradation
    const passResult = validateConcurrentCapacity(50);
    expect(passResult.status).toBe('pass');

    // At warning threshold
    const warningResult = validateConcurrentCapacity(90);
    expect(warningResult.status).toBe('warning');

    // Over target → fail
    const failResult = validateConcurrentCapacity(150);
    expect(failResult.status).toBe('fail');

    // Page load budget for concurrent scenario
    const pageLoadBudget = getBudgetForMetric('page_load_cold_4g');
    expect(pageLoadBudget).toBeDefined();
    expect(pageLoadBudget!.target).toBe(3000); // < 3 seconds
  });

  it('MAT-T-0073: Page Load Performance (LCP < 2.5s)', () => {
    // Architecture: §3.1, performance-architecture.md
    // FRS: FR-010, FR-039
    // TRS: TR-007
    // Type: performance | Priority: P0

    const lcpBudget = getBudgetForMetric('lcp');
    expect(lcpBudget).toBeDefined();
    expect(lcpBudget!.target).toBe(2500);
    expect(lcpBudget!.unit).toBe('ms');

    // Under budget → pass
    const passResult = validateBudget('lcp', 1800);
    expect(passResult.status).toBe('pass');

    // At warning → warning
    const warningResult = validateBudget('lcp', 2200);
    expect(warningResult.status).toBe('warning');

    // Over critical → fail
    const failResult = validateBudget('lcp', 3000);
    expect(failResult.status).toBe('fail');

    // CLS budget
    const clsBudget = getBudgetForMetric('cls');
    expect(clsBudget).toBeDefined();
    expect(clsBudget!.target).toBe(0.1);

    // Initial JS bundle budget
    const bundleBudget = getBudgetForMetric('initial_js_bundle_kb');
    expect(bundleBudget).toBeDefined();
    expect(bundleBudget!.target).toBe(300); // < 300KB gzipped

    // SPA navigation budget
    const spaBudget = getBudgetForMetric('spa_navigation');
    expect(spaBudget).toBeDefined();
    expect(spaBudget!.target).toBe(500); // < 500ms
  });

  it('MAT-T-0074: API Response Time (< 200ms p95 CRUD)', () => {
    // Architecture: performance-architecture.md
    // FRS: FR-039
    // TRS: TR-008
    // Type: performance | Priority: P0

    const crudBudget = getBudgetForMetric('api_response_p95_crud');
    expect(crudBudget).toBeDefined();
    expect(crudBudget!.target).toBe(200);
    expect(crudBudget!.unit).toBe('ms');

    // Under budget → pass
    const passResult = validateBudget('api_response_p95_crud', 120);
    expect(passResult.status).toBe('pass');

    // Over critical → fail
    const failResult = validateBudget('api_response_p95_crud', 250);
    expect(failResult.status).toBe('fail');

    // List endpoint budget: 500ms
    const listBudget = getBudgetForMetric('api_response_p95_list');
    expect(listBudget).toBeDefined();
    expect(listBudget!.target).toBe(500);

    // Aggregation endpoint budget: 1000ms
    const aggBudget = getBudgetForMetric('api_response_p95_aggregation');
    expect(aggBudget).toBeDefined();
    expect(aggBudget!.target).toBe(1000);
  });

  it('MAT-T-0075: AI Processing Performance', () => {
    // Architecture: §3.3, §3.4
    // FRS: FR-005, FR-023, FR-035
    // TRS: TR-009
    // Type: performance | Priority: P0

    const aiBudgets = getAIPerformanceBudgets();
    expect(aiBudgets.length).toBe(3);

    // Document parsing budget: < 60s for 50 pages
    const parsingBudget = getBudgetForMetric('document_parsing_50pages');
    expect(parsingBudget).toBeDefined();
    expect(parsingBudget!.target).toBe(60000);

    const passResult = validateBudget('document_parsing_50pages', 35000);
    expect(passResult.status).toBe('pass');

    // Maturity scoring budget: < 30s per criterion
    const scoringBudget = getBudgetForMetric('maturity_scoring_per_criterion');
    expect(scoringBudget).toBeDefined();
    expect(scoringBudget!.target).toBe(30000);

    const scoringPass = validateBudget('maturity_scoring_per_criterion', 15000);
    expect(scoringPass.status).toBe('pass');

    // Report generation budget: < 2min for 500 criteria
    const reportBudget = getBudgetForMetric('report_generation_500criteria');
    expect(reportBudget).toBeDefined();
    expect(reportBudget!.target).toBe(120000);

    const reportFail = validateBudget('report_generation_500criteria', 150000);
    expect(reportFail.status).toBe('fail');

    // Unknown metric returns fail
    const unknownResult = validateBudget('nonexistent_metric', 100);
    expect(unknownResult.status).toBe('fail');
  });
});
