import { useEffect, useMemo } from 'react';
import { useAuditMetrics } from '../lib/hooks/useAuditMetrics';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// Gate: criteria_evaluations WHERE status IN ('confirmed', 'overridden')
// The "Create Report" button is disabled until all non-excluded criteria have a
// status of 'confirmed' or 'overridden' in the criteria_evaluations table.
// Gate query: SELECT COUNT(*) FROM criteria
//   WHERE excluded = false
//   AND id NOT IN (
//     SELECT criteria_id FROM criteria_evaluations
//     WHERE status IN ('confirmed', 'overridden')
//   )
// Returns 0 → all evaluated → Create Report enabled.

export function DashboardPage() {
  const { data: metrics, isLoading, isError, error } = useAuditMetrics();
  const queryClient = useQueryClient();

  // Create Report handler — wired to the gate button (FR-099, TR-099)
  // Batch C: wire to active audit selection + AI generation pipeline
  // Pattern: supabase.from('audit_reports').insert({
  //   audit_id: selectedAuditId,
  //   organisation_id: orgId,
  //   storage_path: 'pending',
  //   status: 'generating',
  //   triggered_by: userId,
  // })
  const handleCreateReport = () => {
    /* Batch C: wire to active audit context + AI report generation pipeline (FR-099) */
  };

  // Realtime subscription for live updates (MAT-T-0100)
  useEffect(() => {
    const channel = supabase
      .channel('audit-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'audits' },
        () => {
          // Invalidate metrics query when audits table changes
          queryClient.invalidateQueries({ queryKey: ['audit-metrics'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Error state (MAT-T-0099)
  useEffect(() => {
    if (isError) {
      console.error('Dashboard error:', error);
      // Toast notification would go here
    }
  }, [isError, error]);

  // Wave 14 — Dashboard metrics (FR-098):
  // submittedCount: criteria with a completed evaluation (confirmed or overridden)
  // outstandingCount: non-excluded criteria without a confirmed/overridden evaluation
  // excludedCount: criteria marked excluded = true
  // Gate: Create Report is disabled while outstandingCount > 0

  // Derived metrics for display — computed from metrics data
  const displayMetrics = useMemo(() => {
    const outstanding = metrics?.outstandingCount ?? 0;
    return {
      submittedCount: metrics?.submittedCount ?? 0,
      outstandingCount: outstanding,
      excludedCount: metrics?.excludedCount ?? 0,
      isCreateReportEnabled: outstanding === 0,
    };
  }, [metrics]);

  // Loading skeleton (MAT-T-0099)
  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Audits</h2>
          <p className="text-3xl font-bold text-primary-600">{metrics?.totalAudits || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Completion Rate</h2>
          <p className="text-3xl font-bold text-primary-600">{metrics?.completionRate || 0}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Average Maturity</h2>
          <p className="text-3xl font-bold text-primary-600">{metrics?.averageMaturity?.toFixed(1) || '0.0'}</p>
        </div>
        {/* FR-039 through FR-042 - Dashboard functionality */}

        {/* Wave 14 — Criteria evaluation metrics (FR-098) */}
        {/* Submitted: criteria with confirmed or overridden evaluation in criteria_evaluations */}
        <div
          className="bg-white rounded-lg shadow p-6"
          data-testid="metric-submitted"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Submitted</h2>
          <p
            className="text-3xl font-bold text-green-600"
            data-testid="submitted-count"
          >
            {displayMetrics.submittedCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Criteria with confirmed evaluation</p>
        </div>

        {/* Outstanding: non-excluded criteria without confirmed/overridden evaluation */}
        <div
          className="bg-white rounded-lg shadow p-6"
          data-testid="metric-outstanding"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Outstanding</h2>
          <p
            className={`text-3xl font-bold ${displayMetrics.outstandingCount > 0 ? 'text-orange-500' : 'text-green-600'}`}
            data-testid="outstanding-count"
          >
            {displayMetrics.outstandingCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Criteria pending evaluation</p>
        </div>

        {/* Excluded: criteria marked excluded = true */}
        <div
          className="bg-white rounded-lg shadow p-6"
          data-testid="metric-excluded"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Excluded</h2>
          <p
            className="text-3xl font-bold text-gray-500"
            data-testid="excluded-count"
          >
            {displayMetrics.excludedCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Criteria excluded from audit</p>
        </div>
      </div>

      {/* Create Report gate (FR-098, TR-098)
          Disabled until all non-excluded criteria have status IN ('confirmed', 'overridden')
          Gate checks: criteria_evaluations WHERE status IN ('confirmed', 'overridden') */}
      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
            displayMetrics.isCreateReportEnabled
              ? 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!displayMetrics.isCreateReportEnabled}
          aria-disabled={!displayMetrics.isCreateReportEnabled}
          onClick={handleCreateReport}
          data-testid="create-report-button"
          title={
            displayMetrics.isCreateReportEnabled
              ? 'All criteria evaluated — Create Report'
              : `${displayMetrics.outstandingCount} criteria still outstanding`
          }
        >
          Create Report
        </button>
        {!displayMetrics.isCreateReportEnabled && (
          <p className="text-sm text-orange-600" data-testid="create-report-gate-message">
            {displayMetrics.outstandingCount} criteria outstanding — all criteria must be confirmed or overridden to create a report.
          </p>
        )}
      </div>
    </div>
  );
}
