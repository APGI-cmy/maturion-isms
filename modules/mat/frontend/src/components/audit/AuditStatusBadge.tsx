/**
 * Audit Status Badge Component
 * FRS: FR-002 (Status Lifecycle)
 * TRS: TR-047, TR-033
 */
export function AuditStatusBadge({ status }: { status: string }) {
  return (
    <span className="audit-status-badge" role="status">
      {status}
    </span>
  );
}
