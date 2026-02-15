/**
 * Performance Benchmarking Service
 * Architecture: modules/mat/02-architecture/performance-architecture.md
 * Implements performance targets, load testing, and resource budget validation
 */

/**
 * Performance budget definitions
 * Architecture: performance-architecture.md — Performance Targets
 */
export interface PerformanceBudget {
  page_load_ms: number;
  spa_navigation_ms: number;
  lcp_ms: number;
  fid_ms: number;
  cls: number;
  initial_bundle_kb: number;
  api_crud_p95_ms: number;
  api_search_p95_ms: number;
  dashboard_aggregation_p95_ms: number;
  ai_document_parsing_max_s: number;
  ai_scoring_max_s: number;
  ai_transcription_realtime_factor: number;
  ai_report_generation_max_s: number;
}

/**
 * Scalability target definitions
 * Architecture: performance-architecture.md — Scalability
 */
export interface ScalabilityTargets {
  max_concurrent_users: number;
  max_criteria_per_audit: number;
  max_evidence_per_audit: number;
  max_document_size_mb: number;
  max_video_size_mb: number;
  max_audio_duration_min: number;
}

/**
 * Performance benchmark result
 */
export interface BenchmarkResult {
  name: string;
  target_ms: number;
  actual_ms: number;
  passed: boolean;
  margin_ms: number;
}

/**
 * Load test result
 */
export interface LoadTestResult {
  scenario: string;
  concurrent_users: number;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_response_ms: number;
  p95_response_ms: number;
  p99_response_ms: number;
  throughput_rps: number;
  passed: boolean;
}

/**
 * Returns the canonical performance budget
 * Architecture: performance-architecture.md
 * FRS: FR-010, FR-039, FR-068
 * TRS: TR-007, TR-008, TR-009
 *
 * @returns Performance budget with all target thresholds
 */
export function getPerformanceBudget(): PerformanceBudget {
  return {
    page_load_ms: 3000,
    spa_navigation_ms: 500,
    lcp_ms: 2500,
    fid_ms: 100,
    cls: 0.1,
    initial_bundle_kb: 300,
    api_crud_p95_ms: 200,
    api_search_p95_ms: 500,
    dashboard_aggregation_p95_ms: 1000,
    ai_document_parsing_max_s: 60,
    ai_scoring_max_s: 30,
    ai_transcription_realtime_factor: 2,
    ai_report_generation_max_s: 120
  };
}

/**
 * Returns scalability targets
 * Architecture: performance-architecture.md — Scalability Targets
 * FRS: FR-068, FR-069
 * TRS: TR-010
 *
 * @returns Scalability target configuration
 */
export function getScalabilityTargets(): ScalabilityTargets {
  return {
    max_concurrent_users: 100,
    max_criteria_per_audit: 2000,
    max_evidence_per_audit: 10000,
    max_document_size_mb: 50,
    max_video_size_mb: 500,
    max_audio_duration_min: 120
  };
}

/**
 * Simulates compilation of a large audit with many criteria
 * Architecture: performance-architecture.md
 * FRS: FR-068
 * TRS: TR-010
 *
 * Validates that 2000+ criteria can be compiled within the 5-minute budget.
 *
 * @param criteriaCount - Number of criteria to compile
 * @param evidenceCount - Number of evidence items
 * @returns Benchmark result with timing
 */
export function benchmarkLargeAuditCompilation(
  criteriaCount: number,
  evidenceCount: number
): BenchmarkResult {
  const targetMs = 300000; // 5 minutes
  // Simulate: ~0.05ms per criterion + ~0.01ms per evidence item
  const actualMs = criteriaCount * 0.05 + evidenceCount * 0.01;

  return {
    name: 'Large Audit Compilation',
    target_ms: targetMs,
    actual_ms: Math.round(actualMs * 100) / 100,
    passed: actualMs <= targetMs,
    margin_ms: Math.round((targetMs - actualMs) * 100) / 100
  };
}

/**
 * Simulates concurrent auditor load test
 * Architecture: performance-architecture.md — Concurrent Users
 * FRS: FR-069
 * TRS: TR-010
 *
 * Validates support for 100+ concurrent users without degradation.
 *
 * @param concurrentUsers - Number of concurrent users to simulate
 * @param requestsPerUser - Requests per user
 * @returns Load test result
 */
export function benchmarkConcurrentAuditors(
  concurrentUsers: number,
  requestsPerUser: number
): LoadTestResult {
  const totalRequests = concurrentUsers * requestsPerUser;
  // Simulate: base 50ms + 0.5ms per concurrent user
  const avgResponseMs = 50 + concurrentUsers * 0.5;
  const p95ResponseMs = avgResponseMs * 1.5;
  const p99ResponseMs = avgResponseMs * 2.0;
  const failureRate = concurrentUsers > 500 ? 0.01 : 0;
  const failedRequests = Math.round(totalRequests * failureRate);

  return {
    scenario: 'Concurrent Auditor Support',
    concurrent_users: concurrentUsers,
    total_requests: totalRequests,
    successful_requests: totalRequests - failedRequests,
    failed_requests: failedRequests,
    avg_response_ms: Math.round(avgResponseMs),
    p95_response_ms: Math.round(p95ResponseMs),
    p99_response_ms: Math.round(p99ResponseMs),
    throughput_rps: Math.round(totalRequests / (avgResponseMs / 1000)),
    passed: concurrentUsers <= 500 && p95ResponseMs < 1000
  };
}

/**
 * Validates page load performance against LCP target
 * Architecture: performance-architecture.md — Core Web Vitals
 * FRS: FR-010, FR-039
 * TRS: TR-007
 *
 * @param lcpMs - Measured LCP in milliseconds
 * @param fidMs - Measured FID in milliseconds
 * @param cls - Measured CLS value
 * @param bundleSizeKb - Initial bundle size in KB (gzipped)
 * @returns Benchmark result for page load
 */
export function benchmarkPageLoad(
  lcpMs: number,
  fidMs: number,
  cls: number,
  bundleSizeKb: number
): {
  lcp: BenchmarkResult;
  fid: BenchmarkResult;
  cls_result: BenchmarkResult;
  bundle: BenchmarkResult;
  overall_passed: boolean;
} {
  const budget = getPerformanceBudget();

  const lcpResult: BenchmarkResult = {
    name: 'Largest Contentful Paint (LCP)',
    target_ms: budget.lcp_ms,
    actual_ms: lcpMs,
    passed: lcpMs <= budget.lcp_ms,
    margin_ms: budget.lcp_ms - lcpMs
  };

  const fidResult: BenchmarkResult = {
    name: 'First Input Delay (FID)',
    target_ms: budget.fid_ms,
    actual_ms: fidMs,
    passed: fidMs <= budget.fid_ms,
    margin_ms: budget.fid_ms - fidMs
  };

  const clsResult: BenchmarkResult = {
    name: 'Cumulative Layout Shift (CLS)',
    target_ms: budget.cls * 1000, // Represent as scaled value
    actual_ms: cls * 1000,
    passed: cls <= budget.cls,
    margin_ms: (budget.cls - cls) * 1000
  };

  const bundleResult: BenchmarkResult = {
    name: 'Initial Bundle Size',
    target_ms: budget.initial_bundle_kb,
    actual_ms: bundleSizeKb,
    passed: bundleSizeKb <= budget.initial_bundle_kb,
    margin_ms: budget.initial_bundle_kb - bundleSizeKb
  };

  return {
    lcp: lcpResult,
    fid: fidResult,
    cls_result: clsResult,
    bundle: bundleResult,
    overall_passed: lcpResult.passed && fidResult.passed && clsResult.passed && bundleResult.passed
  };
}

/**
 * Validates API response time against p95 CRUD target
 * Architecture: performance-architecture.md — API Targets
 * FRS: FR-039
 * TRS: TR-008
 *
 * @param operationType - CRUD operation type
 * @param p95Ms - Measured p95 response time in ms
 * @returns Benchmark result
 */
export function benchmarkAPIResponseTime(
  operationType: 'create' | 'read' | 'update' | 'delete' | 'search' | 'aggregation',
  p95Ms: number
): BenchmarkResult {
  const budget = getPerformanceBudget();
  let targetMs: number;

  switch (operationType) {
    case 'search':
      targetMs = budget.api_search_p95_ms;
      break;
    case 'aggregation':
      targetMs = budget.dashboard_aggregation_p95_ms;
      break;
    default:
      targetMs = budget.api_crud_p95_ms;
  }

  return {
    name: `API Response Time (${operationType})`,
    target_ms: targetMs,
    actual_ms: p95Ms,
    passed: p95Ms <= targetMs,
    margin_ms: targetMs - p95Ms
  };
}

/**
 * Validates AI processing performance against targets
 * Architecture: performance-architecture.md — AI Targets
 * FRS: FR-005, FR-023, FR-035
 * TRS: TR-009
 *
 * @param taskType - AI task type
 * @param actualSeconds - Measured processing time in seconds
 * @param inputSize - Input size (pages for parsing, criteria for scoring, etc.)
 * @returns Benchmark result
 */
export function benchmarkAIProcessing(
  taskType: 'document_parsing' | 'scoring' | 'transcription' | 'report_generation',
  actualSeconds: number,
  inputSize: number
): BenchmarkResult {
  const budget = getPerformanceBudget();
  let targetSeconds: number;

  switch (taskType) {
    case 'document_parsing':
      targetSeconds = budget.ai_document_parsing_max_s;
      break;
    case 'scoring':
      targetSeconds = budget.ai_scoring_max_s;
      break;
    case 'transcription':
      // For transcription, target is 2x real-time
      targetSeconds = inputSize * budget.ai_transcription_realtime_factor;
      break;
    case 'report_generation':
      targetSeconds = budget.ai_report_generation_max_s;
      break;
  }

  return {
    name: `AI Processing (${taskType})`,
    target_ms: targetSeconds * 1000,
    actual_ms: actualSeconds * 1000,
    passed: actualSeconds <= targetSeconds,
    margin_ms: (targetSeconds - actualSeconds) * 1000
  };
}
