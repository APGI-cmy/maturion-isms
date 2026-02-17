import AuditStatusBadge from './AuditStatusBadge';

interface Audit {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in_progress' | 'review' | 'completed' | 'archived';
  startDate: string;
  createdAt: string;
}

interface AuditListProps {
  audits?: Audit[];
  onAuditClick?: (auditId: string) => void;
  onCreateNew?: () => void;
}

const AuditList = ({ audits = [], onAuditClick, onCreateNew }: AuditListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Audits</h2>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            aria-label="Create new audit"
          >
            + New Audit
          </button>
        )}
      </div>

      {audits.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No audits found. Create your first audit to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {audits.map((audit) => (
            <div
              key={audit.id}
              onClick={() => onAuditClick?.(audit.id)}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && onAuditClick?.(audit.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{audit.name}</h3>
                <AuditStatusBadge status={audit.status} />
              </div>
              <p className="text-gray-600 mb-4">{audit.description}</p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>Started: {new Date(audit.startDate).toLocaleDateString()}</span>
                <span>Created: {new Date(audit.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditList;
