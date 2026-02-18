/**
 * Audit List Component
 * FRS: FR-002 (Audit Listing)
 * TRS: TR-047
 * Task: 5.6.2 (Audit Management CRUD)
 */
import { useAudits, useDeleteAudit } from '../../lib/hooks/useAudits';
import { useState } from 'react';

export function AuditList() {
  const { data: audits, isLoading, error } = useAudits();
  const deleteAudit = useDeleteAudit();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
    const matchesSearch = audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.organisation_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await deleteAudit.mutateAsync(id);
      } catch (error) {
        alert(`Failed to delete audit: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
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
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="under_review">Under Review</option>
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
                <p className="text-sm text-gray-600">{audit.organisation_name}</p>
                {audit.facility_location && (
                  <p className="text-sm text-gray-500">Location: {audit.facility_location}</p>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
