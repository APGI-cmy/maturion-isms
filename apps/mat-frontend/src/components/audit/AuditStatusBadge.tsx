interface AuditStatusBadgeProps {
  status: 'draft' | 'in_progress' | 'review' | 'completed' | 'archived';
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  archived: { label: 'Archived', color: 'bg-gray-200 text-gray-600' },
};

const AuditStatusBadge = ({ status }: AuditStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      role="status"
      aria-label={`Audit status: ${config.label}`}
    >
      {config.label}
    </span>
  );
};

export default AuditStatusBadge;
