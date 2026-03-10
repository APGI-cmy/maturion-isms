/**
 * Reports Page
 * FRS: FR-035 to FR-038 (Report Generation)
 * Wave 16.2 — GAP-007: Lists audit_reports rows with signed URL download buttons
 */
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useAuditReports } from '../lib/hooks/useAuditReports';

export function ReportsPage() {
  const { data: auditReports, isLoading, isError, error } = useAuditReports();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
            Ready
          </span>
        );
      case 'pending':
      case 'generating':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
            Generating…
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-6 w-6 text-blue-600" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-gray-900">Generated Audit Reports</h2>
        </div>

        {/* FR-035 through FR-038 - Report generation and listing */}

        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center py-12 gap-3 text-gray-500"
          >
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            <span>Loading reports…</span>
          </div>
        )}

        {isError && (
          <div role="alert" className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" aria-hidden="true" />
            <p className="text-red-800 text-sm">
              Failed to load reports: {error?.message ?? 'Unknown error'}
            </p>
          </div>
        )}

        {!isLoading && !isError && (!auditReports || auditReports.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" aria-hidden="true" />
            <p className="font-medium">No reports generated yet</p>
            <p className="text-sm mt-1">
              Generate a report from the Scoring page to see it listed here.
            </p>
          </div>
        )}

        {!isLoading && !isError && auditReports && auditReports.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Audit reports">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Audit ID</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Format</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Status</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Created</th>
                  <th className="pb-3 font-semibold text-gray-700">Download</th>
                </tr>
              </thead>
              <tbody>
                {auditReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-4 text-gray-600 font-mono text-xs">
                      {report.audit_id.slice(0, 8)}…
                    </td>
                    <td className="py-3 pr-4 text-gray-800 uppercase font-medium text-xs">
                      {report.format}
                    </td>
                    <td className="py-3 pr-4">{getStatusBadge(report.status)}</td>
                    <td className="py-3 pr-4 text-gray-600">{formatDate(report.created_at)}</td>
                    <td className="py-3">
                      {report.signed_url ? (
                        <a
                          href={report.signed_url}
                          download
                          aria-label={`Download ${report.format.toUpperCase()} report`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          Download
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Not available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
