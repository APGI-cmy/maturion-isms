/**
 * Loading Skeleton Component
 * TRS: TR-007 (Perceived Performance)
 */
export function LoadingSkeleton() {
  return (
    <div className="loading-skeleton" role="status">
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
    </div>
  );
}
