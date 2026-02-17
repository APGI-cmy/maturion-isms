interface AuditStatusBadgeProps {
  status: string;
}

export default function AuditStatusBadge({ status }: AuditStatusBadgeProps) {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
      {status}
    </span>
  );
}
