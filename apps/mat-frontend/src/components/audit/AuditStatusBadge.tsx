import React from 'react';

interface AuditStatusBadgeProps {
  status: string;
}

export default function AuditStatusBadge({ status }: AuditStatusBadgeProps) {
  const colors: Record<string, string> = {
    planning: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    review: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}
