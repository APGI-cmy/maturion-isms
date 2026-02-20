/**
 * Loading/Skeleton States for Async Operations
 * TRS: TR-047, TR-033
 */
export function LoadingSkeleton() {
  return (
    <div className="loading-skeleton" role="status" aria-live="polite">
      <span className="sr-only">Loading...</span>
      <div className="skeleton-box h-8 w-full bg-gray-200 animate-pulse rounded" />
    </div>
  );
}
