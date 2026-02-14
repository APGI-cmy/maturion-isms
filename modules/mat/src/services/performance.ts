/**
 * Performance Measurement Service
 * Architecture: modules/mat/02-architecture/performance-architecture.md
 * Implements performance metrics measurement and validation for:
 * - Large audit compilation (FR-068, TR-010)
 * - Concurrent auditor support (FR-069, TR-010)
 * - Page load performance / LCP (FR-010, FR-039, TR-007)
 */

/** Performance metric types */
export type PerformanceMetricType =
  | 'audit_compilation'
  | 'concurrent_users'
  | 'page_load'
  | 'spa_navigation'
  | 'lcp'
  | 'api_response';

/** Performance threshold configuration */
export interface PerformanceThreshold {
  metricType: PerformanceMetricType;
  maxValue: number;
  unit: 'ms' | 's' | 'minutes' | 'count';
  description: string;
}

/** Performance measurement result */
export interface PerformanceMeasurement {
  metricType: PerformanceMetricType;
  value: number;
  unit: string;
  threshold: number;
  passed: boolean;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/** Audit compilation performance result */
export interface AuditCompilationResult {
  criteriaCount: number;
  compilationTimeMs: number;
  compilationTimeMinutes: number;
  passed: boolean;
  threshold: string;
}

/** Concurrent user performance result */
export interface ConcurrentUserResult {
  concurrentUsers: number;
  averagePageLoadMs: number;
  p95PageLoadMs: number;
  passed: boolean;
  threshold: string;
}

/** Page load performance result */
export interface PageLoadResult {
  initialLoadMs: number;
  spaNavigationMs: number;
  lcpMs: number;
  allPassed: boolean;
  details: {
    initialLoadPassed: boolean;
    spaNavigationPassed: boolean;
    lcpPassed: boolean;
  };
}

/** Performance thresholds from architecture spec */
export const PERFORMANCE_THRESHOLDS: Record<PerformanceMetricType, PerformanceThreshold> = {
  audit_compilation: {
    metricType: 'audit_compilation',
    maxValue: 5,
    unit: 'minutes',
    description: '1000+ criteria compiled in < 5 minutes',
  },
  concurrent_users: {
    metricType: 'concurrent_users',
    maxValue: 2000,
    unit: 'ms',
    description: '100+ concurrent users with < 2s page load',
  },
  page_load: {
    metricType: 'page_load',
    maxValue: 3000,
    unit: 'ms',
    description: 'Initial page load < 3s on 4G',
  },
  spa_navigation: {
    metricType: 'spa_navigation',
    maxValue: 500,
    unit: 'ms',
    description: 'SPA navigation < 500ms',
  },
  lcp: {
    metricType: 'lcp',
    maxValue: 2500,
    unit: 'ms',
    description: 'Largest Contentful Paint < 2.5s',
  },
  api_response: {
    metricType: 'api_response',
    maxValue: 200,
    unit: 'ms',
    description: 'API response < 200ms p95 CRUD',
  },
};

/**
 * Measures audit compilation performance
 * FR-068, TR-010: 1000+ criteria compiled in < 5 minutes
 */
export function measureAuditCompilation(
  criteriaCount: number,
  compilationTimeMs: number
): AuditCompilationResult {
  const compilationTimeMinutes = compilationTimeMs / (1000 * 60);
  const threshold = PERFORMANCE_THRESHOLDS.audit_compilation;

  return {
    criteriaCount,
    compilationTimeMs,
    compilationTimeMinutes,
    passed: compilationTimeMinutes < threshold.maxValue,
    threshold: `${threshold.maxValue} ${threshold.unit}`,
  };
}

/**
 * Measures concurrent user performance
 * FR-069, TR-010: 100+ concurrent users, < 2s page load
 */
export function measureConcurrentUsers(
  concurrentUsers: number,
  pageLoadTimesMs: number[]
): ConcurrentUserResult {
  if (pageLoadTimesMs.length === 0) {
    return {
      concurrentUsers,
      averagePageLoadMs: 0,
      p95PageLoadMs: 0,
      passed: false,
      threshold: `${PERFORMANCE_THRESHOLDS.concurrent_users.maxValue}ms`,
    };
  }

  const sorted = [...pageLoadTimesMs].sort((a, b) => a - b);
  const averagePageLoadMs = sorted.reduce((sum, t) => sum + t, 0) / sorted.length;
  const p95Index = Math.ceil(sorted.length * 0.95) - 1;
  const p95PageLoadMs = sorted[Math.min(p95Index, sorted.length - 1)];

  const threshold = PERFORMANCE_THRESHOLDS.concurrent_users;

  return {
    concurrentUsers,
    averagePageLoadMs: Math.round(averagePageLoadMs),
    p95PageLoadMs,
    passed: concurrentUsers >= 100 && p95PageLoadMs < threshold.maxValue,
    threshold: `${threshold.maxValue}ms`,
  };
}

/**
 * Measures page load performance
 * FR-010, FR-039, TR-007: Initial < 3s, SPA < 500ms, LCP < 2.5s
 */
export function measurePageLoad(
  initialLoadMs: number,
  spaNavigationMs: number,
  lcpMs: number
): PageLoadResult {
  const initialLoadPassed = initialLoadMs < PERFORMANCE_THRESHOLDS.page_load.maxValue;
  const spaNavigationPassed = spaNavigationMs < PERFORMANCE_THRESHOLDS.spa_navigation.maxValue;
  const lcpPassed = lcpMs < PERFORMANCE_THRESHOLDS.lcp.maxValue;

  return {
    initialLoadMs,
    spaNavigationMs,
    lcpMs,
    allPassed: initialLoadPassed && spaNavigationPassed && lcpPassed,
    details: {
      initialLoadPassed,
      spaNavigationPassed,
      lcpPassed,
    },
  };
}

/**
 * Creates a performance measurement entry
 */
export function createMeasurement(
  metricType: PerformanceMetricType,
  value: number,
  metadata?: Record<string, unknown>
): PerformanceMeasurement {
  const threshold = PERFORMANCE_THRESHOLDS[metricType];

  return {
    metricType,
    value,
    unit: threshold.unit,
    threshold: threshold.maxValue,
    passed: value < threshold.maxValue,
    timestamp: new Date().toISOString(),
    metadata,
  };
}

/**
 * Simulates audit compilation for performance testing
 * Generates criteria data and measures compilation time
 */
export function simulateAuditCompilation(criteriaCount: number): AuditCompilationResult {
  const startTime = performance.now();

  // Simulate criteria compilation work
  const compiledCriteria: Array<{ id: string; compiled: boolean }> = [];
  for (let i = 0; i < criteriaCount; i++) {
    compiledCriteria.push({
      id: `criterion_${i}`,
      compiled: true,
    });
  }

  const endTime = performance.now();
  const compilationTimeMs = endTime - startTime;

  return measureAuditCompilation(criteriaCount, compilationTimeMs);
}

/** Simulated page load baseline time in ms */
const BASE_PAGE_LOAD_MS = 400;
/** Simulated page load variance range in ms */
const LOAD_TIME_VARIANCE_MS = 600;

/**
 * Simulates concurrent user page loads for performance testing
 */
export function simulateConcurrentUsers(userCount: number): ConcurrentUserResult {
  // Simulate page load times for each concurrent user
  // In production, this would be actual load testing results
  const pageLoadTimesMs: number[] = [];
  for (let i = 0; i < userCount; i++) {
    // Simulate realistic page load times with some variance
    const variance = Math.random() * LOAD_TIME_VARIANCE_MS;
    pageLoadTimesMs.push(BASE_PAGE_LOAD_MS + variance);
  }

  return measureConcurrentUsers(userCount, pageLoadTimesMs);
}
