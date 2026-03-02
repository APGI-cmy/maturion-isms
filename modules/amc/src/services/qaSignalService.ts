/**
 * QA Signal Service — CL-13 D6/D7
 *
 * Provides data fetching logic for:
 *   D6: Unified QA Signal Aggregation (watchdog_alerts + qa_metrics)
 *   D7: Health Module Test Results history
 *
 * Design: all Supabase client access is via dependency injection.
 * No imports from packages/ai-centre or other apps.
 *
 * Governance: Wave CL-13 | api-builder
 * Authority:  CS2 (@APGI-cmy) | foreman-v2-agent delegation
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QASignalMetrics {
  /** Overall system health score: 0–100 */
  systemHealth: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  /** ISO 8601 datetime string, or 'Never' when no runs exist */
  lastRunTime: string;
  categories: QASignalCategory[];
}

export interface QASignalCategory {
  id: string;
  name: string;
  passed: number;
  failed: number;
}

export interface QATestResult {
  test_name: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  timestamp: string;
  category: string;
}

/** Aggregated raw data from both signal sources */
export interface QAStatusSources {
  watchdog_alerts: WatchdogAlert[];   // signal source 1
  qa_metrics: QAMetricRecord[];       // signal source 2
}

export interface WatchdogAlert {
  severity_level: string;
  resolved: boolean;
  organization_id: string;
}

export interface QAMetricRecord {
  metric_type: string;
  metric_value: number;
  metric_data: Record<string, unknown>;
  organization_id: string;
  recorded_at: string;
}

// ---------------------------------------------------------------------------
// Internal Supabase query helper types
// ---------------------------------------------------------------------------

/** Minimal builder returned by `supabaseClient.from()` */
interface SupabaseQueryBuilder {
  select: (columns: string) => SupabaseFilterBuilder;
}

interface SupabaseFilterBuilder {
  eq: (column: string, value: string) => SupabaseFilterBuilder;
  in: (column: string, values: string[]) => SupabaseFilterBuilder;
  order: (column: string, opts?: { ascending: boolean }) => SupabaseFilterBuilder;
  limit: (n: number) => SupabaseFilterBuilder;
  then: (
    resolve: (result: { data: unknown[] | null; error: { message: string } | null }) => void
  ) => void;
}

/** Shape of the Supabase client accepted by exported functions */
export interface SupabaseClientLike {
  from: (table: string) => unknown;
}

// ---------------------------------------------------------------------------
// Default / fallback values
// ---------------------------------------------------------------------------

const DEFAULT_METRICS: QASignalMetrics = {
  systemHealth: 0,
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  lastRunTime: 'Never',
  categories: [],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch aggregated QA signal metrics from ≥2 sources:
 *   - watchdog_alerts (signal source 1)
 *   - qa_metrics      (signal source 2)
 *
 * Returns DEFAULT_METRICS on any error so callers can always render safely.
 */
export async function fetchQASignalMetrics(
  organizationId: string,
  supabaseClient: SupabaseClientLike
): Promise<QASignalMetrics> {
  try {
    const [alertsResult, metricsResult] = await Promise.all([
      _queryWatchdogAlerts(organizationId, supabaseClient),
      _queryQAMetrics(organizationId, supabaseClient),
    ]);

    const sources: QAStatusSources = {
      watchdog_alerts: alertsResult,
      qa_metrics: metricsResult,
    };

    const systemHealth = calculateHealthScore(sources);
    const { totalTests, passedTests, failedTests, lastRunTime, categories } =
      _aggregateTestCounts(metricsResult);

    return {
      systemHealth,
      totalTests,
      passedTests,
      failedTests,
      lastRunTime,
      categories,
    };
  } catch {
    return { ...DEFAULT_METRICS };
  }
}

/**
 * Fetch QA test results for history display (D7).
 *
 * Returns results matching the optional status filter, or all results when
 * no filter is supplied.  Returns an empty array on error.
 */
export async function fetchTestResults(
  organizationId: string,
  supabaseClient: SupabaseClientLike,
  filter?: { status?: 'passed' | 'failed' | 'warning' }
): Promise<QATestResult[]> {
  try {
    const client = supabaseClient.from('qa_metrics') as SupabaseQueryBuilder;

    let query = client
      .select('metric_type,metric_value,metric_data,organization_id,recorded_at')
      .eq('organization_id', organizationId)
      .order('recorded_at', { ascending: false })
      .limit(100);

    // Apply status filter when provided.
    //
    // NOTE: This filter matches rows where status is encoded in metric_type
    // as the pattern "test_result_{status}" (e.g. "test_result_failed").
    // Records whose status is stored only in metric_data.status — rather than
    // in metric_type — will NOT be caught by this server-side filter.
    // Post-fetch client-side filtering for those records is intentionally
    // omitted to avoid fetching unlimited rows.
    // Recommendation for strict status filtering: pass no filter parameter and
    // apply client-side filtering using the returned QATestResult[].status field
    // (e.g. results.filter(r => r.status === 'failed')) after calling this
    // function without a filter argument.
    if (filter?.status) {
      query = query.eq('metric_type', `test_result_${filter.status}`);
    }

    const { data, error } = await new Promise<{
      data: unknown[] | null;
      error: { message: string } | null;
    }>((resolve) => {
      (query as unknown as SupabaseFilterBuilder).then(resolve);
    });

    if (error || !data) {
      return [];
    }

    return data.map((row) => _rowToTestResult(row as QAMetricRecord));
  } catch {
    return [];
  }
}

/**
 * Calculate a 0–100 system health score from both signal sources.
 *
 * Scoring algorithm:
 *   - Start at 100 points.
 *   - Deduct up to 50 points for unresolved watchdog_alerts (source 1).
 *     Each unresolved alert costs: critical → 10 pts, high → 5 pts, else → 2 pts.
 *   - Deduct up to 50 points based on the failed-test ratio from qa_metrics (source 2).
 *   - Clamp result to [0, 100].
 */
export function calculateHealthScore(sources: QAStatusSources): number {
  let score = 100;

  // --- Source 1: watchdog_alerts ---
  let alertDeduction = 0;
  for (const alert of sources.watchdog_alerts) {
    if (!alert.resolved) {
      switch (alert.severity_level.toLowerCase()) {
        case 'critical':
          alertDeduction += 10;
          break;
        case 'high':
          alertDeduction += 5;
          break;
        default:
          alertDeduction += 2;
      }
    }
  }
  score -= Math.min(alertDeduction, 50);

  // --- Source 2: qa_metrics ---
  if (sources.qa_metrics.length > 0) {
    const total = sources.qa_metrics.length;
    const failed = sources.qa_metrics.filter(
      (m) =>
        m.metric_type === 'test_result_failed' ||
        (typeof m.metric_data?.status === 'string' &&
          m.metric_data.status === 'failed')
    ).length;
    const failRatio = failed / total;
    const metricDeduction = Math.round(failRatio * 50);
    score -= Math.min(metricDeduction, 50);
  }

  return Math.max(0, Math.min(100, score));
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function _queryWatchdogAlerts(
  organizationId: string,
  supabaseClient: SupabaseClientLike
): Promise<WatchdogAlert[]> {
  const client = supabaseClient.from('watchdog_alerts') as SupabaseQueryBuilder;
  const query = client
    .select('severity_level,resolved,organization_id')
    .eq('organization_id', organizationId);

  const { data, error } = await new Promise<{
    data: unknown[] | null;
    error: { message: string } | null;
  }>((resolve) => {
    (query as unknown as SupabaseFilterBuilder).then(resolve);
  });

  if (error || !data) return [];

  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      severity_level: String(r['severity_level'] ?? 'unknown'),
      resolved: Boolean(r['resolved'] ?? false),
      organization_id: String(r['organization_id'] ?? ''),
    };
  });
}

async function _queryQAMetrics(
  organizationId: string,
  supabaseClient: SupabaseClientLike
): Promise<QAMetricRecord[]> {
  const client = supabaseClient.from('qa_metrics') as SupabaseQueryBuilder;
  const query = client
    .select('metric_type,metric_value,metric_data,organization_id,recorded_at')
    .eq('organization_id', organizationId)
    .order('recorded_at', { ascending: false })
    .limit(500);

  const { data, error } = await new Promise<{
    data: unknown[] | null;
    error: { message: string } | null;
  }>((resolve) => {
    (query as unknown as SupabaseFilterBuilder).then(resolve);
  });

  if (error || !data) return [];

  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      metric_type: String(r['metric_type'] ?? ''),
      metric_value: Number(r['metric_value'] ?? 0),
      metric_data: (r['metric_data'] as Record<string, unknown>) ?? {},
      organization_id: String(r['organization_id'] ?? ''),
      recorded_at: String(r['recorded_at'] ?? ''),
    };
  });
}

/** Convert a raw qa_metrics row to a QATestResult */
function _rowToTestResult(row: QAMetricRecord): QATestResult {
  const md = row.metric_data ?? {};

  // Derive status in priority order:
  //   1. Explicit metric_data.status (most specific)
  //   2. metric_type pattern "test_result_{status}"
  //   3. 'warning' as a safe fallback — 'warning' is used rather than 'passed'
  //      because it signals to callers that the status requires investigation,
  //      avoiding the risk of incorrectly treating unknown statuses as 'passed'
  //      which could mask real failures in downstream health checks or alerts.
  let status: QATestResult['status'] = 'warning'; // safe default
  if (typeof md['status'] === 'string') {
    const s = md['status'];
    if (s === 'failed' || s === 'warning' || s === 'passed') {
      status = s;
    }
  } else if (row.metric_type === 'test_result_passed') {
    status = 'passed';
  } else if (row.metric_type === 'test_result_failed') {
    status = 'failed';
  } else if (row.metric_type === 'test_result_warning') {
    status = 'warning';
  }
  // If none of the above patterns matched, status remains 'warning'
  // so callers can identify records that need investigation.

  return {
    test_name: String(md['test_name'] ?? row.metric_type),
    status,
    message: String(md['message'] ?? ''),
    timestamp: row.recorded_at,
    category: String(md['category'] ?? 'general'),
  };
}

/**
 * Derive aggregated counts and categories from qa_metrics rows.
 * Groups rows by category and counts passed/failed per category.
 */
function _aggregateTestCounts(metrics: QAMetricRecord[]): {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  lastRunTime: string;
  categories: QASignalCategory[];
} {
  if (metrics.length === 0) {
    return {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      lastRunTime: 'Never',
      categories: [],
    };
  }

  let passedTests = 0;
  let failedTests = 0;
  const categoryMap = new Map<string, { passed: number; failed: number }>();

  for (const m of metrics) {
    const result = _rowToTestResult(m);
    const cat = result.category;

    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { passed: 0, failed: 0 });
    }
    const counts = categoryMap.get(cat)!;

    if (result.status === 'passed') {
      passedTests++;
      counts.passed++;
    } else if (result.status === 'failed') {
      failedTests++;
      counts.failed++;
    }
    // 'warning' counts in total but not in passed/failed
  }

  const totalTests = metrics.length;

  // Most recent recorded_at (metrics are ordered descending, so first = latest)
  const lastRunTime = metrics[0]?.recorded_at ?? 'Never';

  const categories: QASignalCategory[] = Array.from(categoryMap.entries()).map(
    ([id, counts]) => ({
      id,
      name: _formatCategoryName(id),
      passed: counts.passed,
      failed: counts.failed,
    })
  );

  return { totalTests, passedTests, failedTests, lastRunTime, categories };
}

/** Convert a snake_case category id to a human-readable name */
function _formatCategoryName(id: string): string {
  return id
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
