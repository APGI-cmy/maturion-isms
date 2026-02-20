/**
 * Scoring Page
 * FRS: FR-021 to FR-024 (Scoring & Reports)
 * TRS: TR-050, TR-053
 * Task: 5.6.5
 */
import { useState } from 'react';
import { useAudits } from '../lib/hooks/useAudits';
import { ReviewTable } from '../components/scoring/ReviewTable';
import { ReportGenerator } from '../components/reports/ReportGenerator';

export function ScoringPage() {
  const { data: audits } = useAudits();
  const [selectedAuditId, setSelectedAuditId] = useState<string>('');

  // Get the first audit if none selected
  const auditId = selectedAuditId || audits?.[0]?.id || '';
  const selectedAudit = audits?.find(a => a.id === auditId);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Scoring Review</h1>

      {/* Audit Selector */}
      {audits && audits.length > 0 && (
        <div className="mb-6">
          <label htmlFor="audit-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Audit
          </label>
          <select
            id="audit-select"
            value={auditId}
            onChange={(e) => setSelectedAuditId(e.target.value)}
            className="max-w-md border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            {audits.map((audit) => (
              <option key={audit.id} value={audit.id}>
                {audit.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {!auditId ? (
        <div className="border-2 border-gray-300 bg-gray-50 rounded p-8 text-center">
          <p className="text-gray-600">Create an audit first to review scoring.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Review Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Scores</h2>
            <ReviewTable auditId={auditId} />
          </div>

          {/* Report Generator */}
          {selectedAudit && (
            <ReportGenerator auditId={auditId} auditTitle={selectedAudit.title} />
          )}
        </div>
      )}
    </div>
  );
}
