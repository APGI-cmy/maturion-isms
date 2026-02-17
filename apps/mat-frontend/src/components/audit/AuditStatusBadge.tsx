interface AuditStatusBadgeProps {
  status: 'draft' | 'in_progress' | 'completed';
}

export default function AuditStatusBadge({ status }: AuditStatusBadgeProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
