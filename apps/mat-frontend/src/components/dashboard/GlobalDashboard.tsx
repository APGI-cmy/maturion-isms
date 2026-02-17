/**
 * Global Audit Dashboard Component
 * FRS: FR-039 (Global Dashboard)
 * TRS: TR-047, TR-033
 * Task: 5.6.1 (Dashboard Data Fetching)
 */
import { useAuditMetrics } from '../../lib/hooks/useAuditMetrics';

export function GlobalDashboard() {
  const { data: metrics, isLoading, error } = useAuditMetrics();

  // Loading state - skeleton loaders
  if (isLoading) {
    return (
      <div className="global-dashboard" role="status" aria-live="polite" aria-label="Loading dashboard data">
        <h2>Global Audit Dashboard</h2>
        <div className="metrics-grid">
          <div className="metric animate-pulse">
            <span>Total Audits</span>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="metric animate-pulse">
            <span>Completion Rate</span>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="metric animate-pulse">
            <span>Average Maturity</span>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="global-dashboard" role="alert" aria-live="assertive">
        <h2>Global Audit Dashboard</h2>
        <div className="error-message p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">
            <strong>Error loading dashboard data:</strong> {error.message}
          </p>
          <p className="text-red-600 text-sm mt-2">
            Please check your Supabase connection and try again.
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!metrics || metrics.totalAudits === 0) {
    return (
      <div className="global-dashboard">
        <h2>Global Audit Dashboard</h2>
        <div className="empty-state p-6 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600 text-lg">No audits found</p>
          <p className="text-gray-500 text-sm mt-2">
            Create your first audit to see metrics here.
          </p>
        </div>
      </div>
    );
  }

  // Success state - display real metrics
  return (
    <div className="global-dashboard">
      <h2>Global Audit Dashboard</h2>
      <div className="metrics-grid grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric p-4 bg-white border border-gray-200 rounded shadow-sm">
          <span className="text-gray-600 text-sm block mb-2">Total Audits</span>
          <strong className="text-3xl font-bold text-gray-900">{metrics.totalAudits}</strong>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.inProgressAudits} in progress
          </p>
        </div>
        <div className="metric p-4 bg-white border border-gray-200 rounded shadow-sm">
          <span className="text-gray-600 text-sm block mb-2">Completion Rate</span>
          <strong className="text-3xl font-bold text-gray-900">{metrics.completionRate}%</strong>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.completedAudits} completed
          </p>
        </div>
        <div className="metric p-4 bg-white border border-gray-200 rounded shadow-sm">
          <span className="text-gray-600 text-sm block mb-2">Average Maturity</span>
          <strong className="text-3xl font-bold text-gray-900">{metrics.averageMaturity.toFixed(1)}</strong>
          <p className="text-xs text-gray-500 mt-1">
            out of 5.0
          </p>
        </div>
      </div>
    </div>
  );
}
