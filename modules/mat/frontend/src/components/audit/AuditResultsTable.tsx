/**
 * Audit Results Table Component
 * FRS: FR-097 (Audit Results Table)
 * TRS: TR-097
 * Wave: 14 — TASK-W14-BB-006
 *
 * Renders all criteria for an audit with columns:
 * Domain | MPS | Criteria | Findings Summary | Rating | Recommendations
 *
 * Excluded criteria are shown with "Excluded" label and greyed treatment.
 * Sort/filter controls by domain and status.
 *
 * Depends on: criteria_evaluations table (LEFT JOIN via criteria_evaluations query)
 */
import { useState, useMemo } from 'react';

export interface CriterionResult {
  id: string;
  domain: string;
  mps: string;
  criteria_name: string;
  criteria_code?: string;
  findings_summary?: string;
  rating?: number;
  recommendations?: string;
  excluded?: boolean;
  evaluation_status?: 'pending_review' | 'confirmed' | 'overridden';
}

interface AuditResultsTableProps {
  auditId: string;
  criteria: CriterionResult[];
  /** criteria_evaluations data (LEFT JOIN results mapped to criteria array) */
  evaluations?: Record<string, { status: string; proposed_level: number; findings_summary?: string; rationale?: string }>;
  onCriterionClick?: (criterionId: string) => void;
}

type SortField = 'domain' | 'mps' | 'criteria_name' | 'rating' | 'evaluation_status';
type SortDirection = 'asc' | 'desc';

const RATING_LABELS: Record<number, string> = {
  0: 'Not Assessed',
  1: 'Initial',
  2: 'Developing',
  3: 'Defined',
  4: 'Managed',
  5: 'Optimising',
};

const STATUS_COLOURS: Record<string, string> = {
  pending_review: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  overridden: 'bg-purple-100 text-purple-700',
};

export function AuditResultsTable({
  auditId: _auditId,
  criteria,
  evaluations = {},
  onCriterionClick,
}: AuditResultsTableProps) {
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('domain');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Derive distinct domains for filter
  const domains = useMemo(() => {
    const all = criteria.map((c) => c.domain).filter(Boolean);
    return ['all', ...Array.from(new Set(all))];
  }, [criteria]);

  // Apply filters and sorting
  const displayCriteria = useMemo(() => {
    let result = [...criteria];

    if (domainFilter !== 'all') {
      result = result.filter((c) => c.domain === domainFilter);
    }

    if (statusFilter === 'excluded') {
      result = result.filter((c) => c.excluded);
    } else if (statusFilter === 'pending') {
      result = result.filter((c) => !c.excluded && c.evaluation_status === 'pending_review');
    } else if (statusFilter === 'confirmed') {
      result = result.filter((c) => !c.excluded && c.evaluation_status === 'confirmed');
    } else if (statusFilter === 'overridden') {
      result = result.filter((c) => !c.excluded && c.evaluation_status === 'overridden');
    }

    result.sort((a, b) => {
      const aVal = a[sortField as keyof CriterionResult] ?? '';
      const bVal = b[sortField as keyof CriterionResult] ?? '';
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [criteria, domainFilter, statusFilter, sortField, sortDirection]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  function getSortIndicator(field: SortField) {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  }

  return (
    <div
      className="audit-results-table-wrapper"
      data-testid="audit-results-table"
      aria-label="Audit Results Table"
    >
      {/* Filter controls */}
      <div className="flex flex-wrap gap-3 mb-4" data-testid="results-filter-controls">
        <div className="flex items-center gap-2">
          <label htmlFor="domain-filter" className="text-sm text-gray-600 font-medium">
            Domain:
          </label>
          <select
            id="domain-filter"
            className="text-sm border border-gray-300 rounded px-2 py-1"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            data-testid="domain-filter"
          >
            {domains.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Domains' : d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm text-gray-600 font-medium">
            Status:
          </label>
          <select
            id="status-filter"
            className="text-sm border border-gray-300 rounded px-2 py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            data-testid="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="confirmed">Confirmed</option>
            <option value="overridden">Overridden</option>
            <option value="excluded">Excluded</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-500">
          {displayCriteria.length} of {criteria.length} criteria
        </div>
      </div>

      {/* Results table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table
          className="min-w-full divide-y divide-gray-200"
          data-testid="results-table-element"
        >
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('domain')}
                aria-sort={sortField === 'domain' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Domain {getSortIndicator('domain')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('mps')}
                aria-sort={sortField === 'mps' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                {/* MPS = Mini Performance Standard */}
                MPS {getSortIndicator('mps')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('criteria_name')}
                aria-sort={sortField === 'criteria_name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Criteria {getSortIndicator('criteria_name')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Findings Summary
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('rating')}
                aria-sort={sortField === 'rating' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Rating {getSortIndicator('rating')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Recommendations
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {displayCriteria.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                  No criteria match the current filter.
                </td>
              </tr>
            )}
            {displayCriteria.map((criterion) => {
              const evalData = evaluations[criterion.id];
              const isExcluded = criterion.excluded === true;

              return (
                <tr
                  key={criterion.id}
                  className={`transition-colors ${
                    isExcluded
                      ? 'bg-gray-50 opacity-60'
                      : 'hover:bg-blue-50 cursor-pointer'
                  }`}
                  onClick={() => !isExcluded && onCriterionClick?.(criterion.id)}
                  data-testid={`results-row-${criterion.id}`}
                  aria-disabled={isExcluded}
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{criterion.domain}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{criterion.mps}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      {criterion.criteria_code && (
                        <span className="text-xs font-mono text-gray-400">
                          {criterion.criteria_code}
                        </span>
                      )}
                      <span>{criterion.criteria_name}</span>
                      {/* Excluded label */}
                      {isExcluded && (
                        <span
                          className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded ml-1"
                          data-testid="excluded-label"
                        >
                          Excluded
                        </span>
                      )}
                      {/* Evaluation status badge */}
                      {!isExcluded && evalData?.status && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ml-1 ${STATUS_COLOURS[evalData.status] ?? ''}`}
                        >
                          {evalData.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {criterion.findings_summary ?? evalData?.findings_summary ?? (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isExcluded ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <span
                        className="font-medium text-gray-700"
                        data-testid="criterion-rating"
                      >
                        {criterion.rating !== undefined
                          ? `${criterion.rating} — ${RATING_LABELS[criterion.rating] ?? ''}`
                          : evalData?.proposed_level !== undefined
                          ? `${evalData.proposed_level} — ${RATING_LABELS[evalData.proposed_level] ?? ''}`
                          : '—'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {criterion.recommendations ?? evalData?.rationale ?? (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditResultsTable;
