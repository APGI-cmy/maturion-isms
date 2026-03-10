/**
 * Audit List Component
 * FRS: FR-002 (Audit Listing)
 * TRS: TR-047
 * Task: 5.6.2 (Audit Management CRUD)
 */
import { useAudits, useDeleteAudit } from '../../lib/hooks/useAudits';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function AuditList() {
  const { data: audits, isLoading, error } = useAudits();
  const deleteAudit = useDeleteAudit();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>('');

  if (isLoading) {
    return (
      <div className="audit-list" role="status" aria-live="polite">
        <h3>Audits</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="audit-list" role="alert">
        <h3>Audits</h3>
        <div className="error-message p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">Error loading audits: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!audits || audits.length === 0) {
    return (
      <div className="audit-list">
        <h3>Audits</h3>
        <div className="empty-state p-6 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No audits yet</p>
          <p className="text-gray-500 text-sm mt-2">Create your first audit to get started.</p>
        </div>
      </div>
    );
  }

  // Filter audits
  const filteredAudits = audits.filter(audit => {
    const matchesSearch =
      searchTerm === '' ||
      audit.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, title: string) => {
    setConfirmDeleteId(id);
    setConfirmDeleteTitle(title);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setConfirmDeleteTitle('');
    try {
      await deleteAudit.mutateAsync(id);
    } catch (error) {
      toast.error(`Failed to delete audit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="audit-list">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Audits ({filteredAudits.length})</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search audits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
            aria-label="Search audits"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <ul className="space-y-2">
        {filteredAudits.map((audit) => (
          <li key={audit.id} className="p-4 bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{audit.title}</h4>
                {audit.organisation_name && (
                  <p className="text-sm text-gray-600 mt-1">{audit.organisation_name}</p>
                )}
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>Status: <span className="font-medium">{audit.status.replace('_', ' ')}</span></span>
                  <span>Created: {new Date(audit.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  aria-label={`Edit ${audit.title}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(audit.id, audit.title)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={deleteAudit.isPending}
                  aria-label={`Delete ${audit.title}`}
                >
                  {deleteAudit.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            {/* Delete confirmation banner — matches CriteriaUpload.tsx pattern (GAP-024) */}
            {confirmDeleteId === audit.id && (
              <div
                className="mt-4 p-4 bg-red-50 border border-red-300 rounded"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="audit-delete-confirm-heading"
              >
                <p
                  id="audit-delete-confirm-heading"
                  className="text-red-800 text-sm font-semibold"
                >
                  Delete audit &ldquo;{confirmDeleteTitle}&rdquo;? This action cannot be undone.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => void handleConfirmDelete()}
                    disabled={deleteAudit.isPending}
                    className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Confirm delete audit"
                  >
                    {deleteAudit.isPending ? 'Deleting…' : 'Yes, delete'}
                  </button>
                  <button
                    onClick={() => { setConfirmDeleteId(null); setConfirmDeleteTitle(''); }}
                    disabled={deleteAudit.isPending}
                    className="px-3 py-1 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
                    aria-label="Cancel delete audit"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
