/**
 * MAT Test Suite — CAT-08: performance
 *
 * Build-to-Green for MAT-T-0071, MAT-T-0072, MAT-T-0073, MAT-T-0074, MAT-T-0075.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  getPerformanceBudget,
  getScalabilityTargets,
  benchmarkLargeAuditCompilation,
  benchmarkConcurrentAuditors,
  benchmarkPageLoad,
  benchmarkAPIResponseTime,
  benchmarkAIProcessing
} from '../../src/services/performance.js';

describe('CAT-08: performance', () => {
  it('MAT-T-0071: Large Audit Compilation', () => {
    // Architecture: §3.2
    // FRS: FR-068
    // TRS: TR-010
    // Type: performance | Priority: P1

    const targets = getScalabilityTargets();

    // 1. Verify scalability targets
    expect(targets.max_criteria_per_audit).toBeGreaterThanOrEqual(2000);
    expect(targets.max_evidence_per_audit).toBeGreaterThanOrEqual(10000);

    // 2. Benchmark with 2000 criteria and 10000 evidence items
    const result = benchmarkLargeAuditCompilation(2000, 10000);
    expect(result.name).toBe('Large Audit Compilation');
    expect(result.target_ms).toBe(300000); // 5 minutes
    expect(result.passed).toBe(true);
    expect(result.actual_ms).toBeLessThan(result.target_ms);
    expect(result.margin_ms).toBeGreaterThan(0);

    // 3. Benchmark with extreme values
    const extreme = benchmarkLargeAuditCompilation(5000, 50000);
    expect(extreme.passed).toBe(true);
  });

  it('MAT-T-0072: Concurrent Auditor Support', () => {
    // Architecture: §3.2
    // FRS: FR-069
    // TRS: TR-010
    // Type: performance | Priority: P1

    const targets = getScalabilityTargets();
    expect(targets.max_concurrent_users).toBeGreaterThanOrEqual(100);

    // 1. Benchmark with 100 concurrent users
    const result = benchmarkConcurrentAuditors(100, 10);
    expect(result.scenario).toBe('Concurrent Auditor Support');
    expect(result.concurrent_users).toBe(100);
    expect(result.total_requests).toBe(1000);
    expect(result.failed_requests).toBe(0);
    expect(result.successful_requests).toBe(1000);
    expect(result.passed).toBe(true);
    expect(result.p95_response_ms).toBeLessThan(1000);

    // 2. Benchmark with 200 concurrent users
    const result200 = benchmarkConcurrentAuditors(200, 10);
    expect(result200.passed).toBe(true);
    expect(result200.failed_requests).toBe(0);
    expect(result200.p95_response_ms).toBeLessThan(1000);
  });

  it('MAT-T-0073: Page Load Performance (LCP < 2.5s)', () => {
    // Architecture: §3.1, performance-architecture.md
    // FRS: FR-010, FR-039
    // TRS: TR-007
    // Type: performance | Priority: P0

    const budget = getPerformanceBudget();

    // 1. Verify budget targets
    expect(budget.lcp_ms).toBe(2500);
    expect(budget.fid_ms).toBe(100);
    expect(budget.cls).toBe(0.1);
    expect(budget.initial_bundle_kb).toBe(300);

    // 2. Benchmark with good metrics
    const good = benchmarkPageLoad(1800, 50, 0.05, 250);
    expect(good.lcp.passed).toBe(true);
    expect(good.fid.passed).toBe(true);
    expect(good.cls_result.passed).toBe(true);
    expect(good.bundle.passed).toBe(true);
    expect(good.overall_passed).toBe(true);

    // 3. Benchmark at threshold
    const atThreshold = benchmarkPageLoad(2500, 100, 0.1, 300);
    expect(atThreshold.overall_passed).toBe(true);

    // 4. Benchmark with failing LCP
    const failingLcp = benchmarkPageLoad(3000, 50, 0.05, 250);
    expect(failingLcp.lcp.passed).toBe(false);
    expect(failingLcp.overall_passed).toBe(false);
  });

  it('MAT-T-0074: API Response Time (< 200ms p95 CRUD)', () => {
    // Architecture: performance-architecture.md
    // FRS: FR-039
    // TRS: TR-008
    // Type: performance | Priority: P0

    const budget = getPerformanceBudget();
    expect(budget.api_crud_p95_ms).toBe(200);
    expect(budget.api_search_p95_ms).toBe(500);
    expect(budget.dashboard_aggregation_p95_ms).toBe(1000);

    // 1. CRUD operations within budget
    const create = benchmarkAPIResponseTime('create', 150);
    expect(create.passed).toBe(true);
    expect(create.target_ms).toBe(200);

    const read = benchmarkAPIResponseTime('read', 80);
    expect(read.passed).toBe(true);

    const update = benchmarkAPIResponseTime('update', 190);
    expect(update.passed).toBe(true);

    const del = benchmarkAPIResponseTime('delete', 100);
    expect(del.passed).toBe(true);

    // 2. Search within budget
    const search = benchmarkAPIResponseTime('search', 400);
    expect(search.passed).toBe(true);
    expect(search.target_ms).toBe(500);

    // 3. Aggregation within budget
    const aggregation = benchmarkAPIResponseTime('aggregation', 800);
    expect(aggregation.passed).toBe(true);
    expect(aggregation.target_ms).toBe(1000);

    // 4. Failing CRUD (exceeds 200ms)
    const failingCrud = benchmarkAPIResponseTime('create', 250);
    expect(failingCrud.passed).toBe(false);
  });

  it('MAT-T-0075: AI Processing Performance', () => {
    // Architecture: §3.3, §3.4
    // FRS: FR-005, FR-023, FR-035
    // TRS: TR-009
    // Type: performance | Priority: P0

    const budget = getPerformanceBudget();
    expect(budget.ai_document_parsing_max_s).toBe(60);
    expect(budget.ai_scoring_max_s).toBe(30);
    expect(budget.ai_transcription_realtime_factor).toBe(2);
    expect(budget.ai_report_generation_max_s).toBe(120);

    // 1. Document parsing (50 pages, < 60s)
    const parsing = benchmarkAIProcessing('document_parsing', 45, 50);
    expect(parsing.passed).toBe(true);
    expect(parsing.target_ms).toBe(60000);

    // 2. Maturity scoring (< 30s per criterion)
    const scoring = benchmarkAIProcessing('scoring', 20, 1);
    expect(scoring.passed).toBe(true);
    expect(scoring.target_ms).toBe(30000);

    // 3. Transcription (< 2x real-time, 60s audio)
    const transcription = benchmarkAIProcessing('transcription', 100, 60);
    expect(transcription.passed).toBe(true);
    expect(transcription.target_ms).toBe(120000); // 60s * 2

    // 4. Report generation (500 criteria, < 120s)
    const report = benchmarkAIProcessing('report_generation', 90, 500);
    expect(report.passed).toBe(true);
    expect(report.target_ms).toBe(120000);

    // 5. Failing: parsing exceeds 60s
    const failParsing = benchmarkAIProcessing('document_parsing', 75, 50);
    expect(failParsing.passed).toBe(false);
  });
});
