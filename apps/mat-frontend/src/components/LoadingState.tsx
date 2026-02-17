/**
 * Loading State Component
 * TRS: TR-047, TR-033
 */
export function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span>Loading...</span>
    </div>
  );
}
