/**
 * Criteria Review/Approval Component
 * FRS: FR-008 (Human Approval)
 * TRS: TR-047
 *
 * Wave 18 — T-W18-009 (ui-builder)
 * Gap 7: Post-parse the user cannot see, edit, or approve the extracted criteria
 * structure before it is locked.  This component implements the real review screen.
 */
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCriteria, type Criterion } from '../../lib/hooks/useCriteria';
import { supabase } from '../../lib/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 25;

// ─── Types ──────────────────────────────────────────────────────────────────

interface CriteriaApprovalProps {
  /** The audit whose parsed criteria are under review. */
  auditId: string;
  /** Optional: file path of the criteria_documents row to approve. */
  filePath?: string;
  /** Called after a successful approval mutation. */
  onApproved?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Truncate text to maxLen characters, appending "…" when truncated. */
function truncate(text: string | null | undefined, maxLen: number): string {
  if (!text) return '';
  return text.length <= maxLen ? text : `${text.slice(0, maxLen)}…`;
}

// ─── Sub-component: individual criterion row ─────────────────────────────────

interface CriterionRowProps {
  criterion: Criterion;
}

function CriterionRow({ criterion }: CriterionRowProps) {
  const [expanded, setExpanded] = useState(false);

  const { description, intent_statement: intentStatement, guidance, source_anchor: sourceAnchor } = criterion;

  const displayDescription = expanded ? (description ?? '') : truncate(description, 200);

  return (
    <li
      className="criterion-row border rounded-lg p-4 mb-3 bg-white shadow-sm"
      aria-label={`Criterion ${criterion.number}: ${criterion.title ?? criterion.name ?? ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-mono font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded mr-2">
            {criterion.number}
          </span>
          <span className="font-semibold text-gray-900">
            {criterion.title ?? criterion.name ?? '(Untitled)'}
          </span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="mt-2 text-sm text-gray-700" id={`desc-${criterion.id}`}>
          <span className="font-medium text-gray-500 mr-1">Description:</span>
          {displayDescription}
          {description.length > 200 && (
            <button
              type="button"
              className="ml-1 text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded text-xs"
              onClick={() => setExpanded(prev => !prev)}
              aria-expanded={expanded}
              aria-controls={`desc-${criterion.id}`}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Intent statement */}
      {intentStatement && (
        <div className="mt-1 text-sm text-gray-700">
          <span className="font-medium text-gray-500 mr-1">Intent:</span>
          {intentStatement}
        </div>
      )}

      {/* Guidance */}
      {guidance && (
        <div className="mt-1 text-sm text-gray-700">
          <span className="font-medium text-gray-500 mr-1">Guidance:</span>
          {guidance}
        </div>
      )}

      {/* Source anchor (traceability) */}
      {sourceAnchor && (
        <div className="mt-1 text-xs text-gray-500">
          <span className="font-medium mr-1">Source:</span>
          <code className="bg-gray-100 px-1 rounded">{sourceAnchor}</code>
        </div>
      )}
    </li>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CriteriaApproval({ auditId, filePath, onApproved }: CriteriaApprovalProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  // Fetch the flat criteria list for this audit
  const { data: criteria, isLoading, isError, error } = useCriteria(auditId);

  // Mutation: set criteria_documents.status → 'approved'
  const approveMutation = useMutation<void, Error>({
    mutationFn: async () => {
      const query = supabase
        .from('criteria_documents')
        .update({ status: 'approved' })
        .eq('audit_id', auditId);

      if (filePath) {
        query.eq('file_path', filePath);
      }

      const { error: mutError } = await query;
      if (mutError) {
        throw new Error(`Failed to approve criteria: ${mutError.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criteria', auditId] });
      queryClient.invalidateQueries({ queryKey: ['uploaded-documents', auditId] });
      queryClient.invalidateQueries({ queryKey: ['criteria-document-status', auditId] });
      onApproved?.();
    },
  });

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="criteria-approval" role="status" aria-live="polite">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="h-20 bg-gray-200 rounded w-full" />
          <div className="h-20 bg-gray-200 rounded w-full" />
          <div className="h-20 bg-gray-200 rounded w-full" />
        </div>
        <span className="sr-only">Loading criteria for review…</span>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="criteria-approval" role="alert">
        <div className="border-2 border-red-500 bg-red-50 rounded p-4">
          <p className="text-red-800">
            Failed to load criteria: {error?.message ?? 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!criteria || criteria.length === 0) {
    return (
      <div className="criteria-approval">
        <h3 className="text-lg font-semibold mb-2">Review Parsed Criteria</h3>
        <p className="text-gray-500 text-sm">No criteria have been parsed for this audit yet.</p>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  const totalCriteria = criteria.length;
  const pageCount = Math.ceil(totalCriteria / PAGE_SIZE);
  const pagedCriteria = criteria.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="criteria-approval">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Review Parsed Criteria
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({totalCriteria} {totalCriteria === 1 ? 'criterion' : 'criteria'})
          </span>
        </h3>

        {/* Approval action */}
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => approveMutation.mutate()}
          disabled={approveMutation.isPending}
          aria-busy={approveMutation.isPending}
        >
          {approveMutation.isPending ? 'Approving…' : 'Approve All'}
        </button>
      </div>

      {/* Approve mutation error */}
      {approveMutation.isError && (
        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-300 rounded text-sm text-red-700">
          {approveMutation.error?.message ?? 'Approval failed. Please try again.'}
        </div>
      )}

      {/* Approve mutation success */}
      {approveMutation.isSuccess && (
        <div role="status" className="mb-4 p-3 bg-green-50 border border-green-300 rounded text-sm text-green-700">
          Criteria approved successfully.
        </div>
      )}

      {/* Criteria list (paginated) */}
      <ul
        className="criteria-list divide-y divide-gray-100"
        aria-label="Parsed criteria list"
        aria-live="polite"
      >
        {pagedCriteria.map(criterion => (
          <CriterionRow key={criterion.id} criterion={criterion} />
        ))}
      </ul>

      {/* Pagination controls */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCriteria)} of {totalCriteria}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              aria-label="Previous page"
            >
              ← Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= pageCount - 1}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
