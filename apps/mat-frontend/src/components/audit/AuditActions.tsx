interface AuditActionsProps {
  auditId: string;
  status: string;
  onDelete?: (auditId: string) => void;
  onArchive?: (auditId: string) => void;
  onRestore?: (auditId: string) => void;
}

const AuditActions = ({ auditId, status, onDelete, onArchive, onRestore }: AuditActionsProps) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this audit? This action cannot be undone.')) {
      onDelete?.(auditId);
    }
  };

  const handleArchive = () => {
    if (window.confirm('Are you sure you want to archive this audit?')) {
      onArchive?.(auditId);
    }
  };

  return (
    <div className="flex space-x-2">
      {status !== 'archived' && onArchive && (
        <button
          onClick={handleArchive}
          className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
          aria-label="Archive audit"
        >
          Archive
        </button>
      )}
      
      {status === 'archived' && onRestore && (
        <button
          onClick={() => onRestore(auditId)}
          className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
          aria-label="Restore audit"
        >
          Restore
        </button>
      )}
      
      {onDelete && (
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          aria-label="Delete audit"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default AuditActions;
