/**
 * KnowledgeDocumentsList — Pipeline 2 (Knowledge Ingestion) documents list UI
 *
 * Wave    : DCKIS-IMPL-002
 * Test IDs: T-KU-006
 *
 * Displays uploaded knowledge documents with their approval_status badge.
 * Status values: pending (yellow/gray), approved (green), rejected (red)
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

/** Approval status values for knowledge documents (ai_knowledge table) */
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface KnowledgeDocument {
  id: string;
  source: string;
  content: string;
  approval_status: ApprovalStatus;
  source_document_name?: string;
  created_at: string;
  chunk_index?: number;
}

/** Maps approval_status to Tailwind CSS classes for the badge */
function getApprovalStatusBadgeClass(status: ApprovalStatus): string {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
}

/** Human-readable label for the approval_status badge */
function getApprovalStatusLabel(status: ApprovalStatus): string {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'pending':
    default:
      return 'Pending';
  }
}

async function fetchKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const { data, error } = await supabase
    .from('ai_knowledge')
    .select('id, source, content, approval_status, source_document_name, created_at, chunk_index')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(`Failed to fetch knowledge documents: ${error.message}`);
  }
  return (data ?? []) as KnowledgeDocument[];
}

export function KnowledgeDocumentsList(): React.ReactElement {
  const {
    data: documents,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<KnowledgeDocument[], Error>({
    queryKey: ['knowledge-documents'],
    queryFn: fetchKnowledgeDocuments,
    staleTime: 30_000,
    retry: 2,
  });

  return (
    <section
      aria-labelledby="knowledge-docs-heading"
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          id="knowledge-docs-heading"
          className="text-lg font-semibold text-gray-900"
        >
          📄 Knowledge Documents
        </h2>
        <button
          type="button"
          onClick={() => void refetch()}
          aria-label="Refresh knowledge documents list"
          className="text-sm text-sky-600 hover:text-sky-800 focus:outline-none focus:underline"
        >
          Refresh
        </button>
      </div>

      {isLoading && (
        <div role="status" aria-live="polite" className="text-sm text-gray-500">
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent mr-2"
            aria-hidden="true"
          />
          Loading knowledge documents…
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          Failed to load documents:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      )}

      {!isLoading && !isError && documents && documents.length === 0 && (
        <p className="text-sm text-gray-500">
          No knowledge documents found. Upload a document using the form above.
        </p>
      )}

      {!isLoading && !isError && documents && documents.length > 0 && (
        <div
          role="list"
          aria-label="Knowledge documents"
          className="space-y-3"
        >
          {documents.map((doc) => (
            <article
              key={doc.id}
              role="listitem"
              className="rounded-md border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              aria-label={`Knowledge document: ${doc.source_document_name ?? doc.source}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.source_document_name ?? doc.source ?? 'Unknown document'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Source: <span className="font-mono">{doc.source}</span>
                    {doc.chunk_index != null && (
                      <span className="ml-2">· Chunk {doc.chunk_index + 1}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(doc.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* approval_status badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getApprovalStatusBadgeClass(doc.approval_status)}`}
                  aria-label={`Approval status: ${getApprovalStatusLabel(doc.approval_status)}`}
                >
                  {getApprovalStatusLabel(doc.approval_status)}
                </span>
              </div>

              {/* Content preview */}
              <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                {doc.content.slice(0, 200)}
                {doc.content.length > 200 && '…'}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
