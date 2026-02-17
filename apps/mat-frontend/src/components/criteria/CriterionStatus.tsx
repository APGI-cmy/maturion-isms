interface CriterionStatusProps {
  status: 'pending' | 'in_progress' | 'completed' | 'not_used';
}

export default function CriterionStatus({ status }: CriterionStatusProps) {
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    not_used: 'bg-orange-100 text-orange-800',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
