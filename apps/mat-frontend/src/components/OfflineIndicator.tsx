/**
 * Offline Indicator Component
 * FRS: FR-047 (Offline Support)
 * TRS: TR-036
 */
export function OfflineIndicator() {
  return (
    <div className="offline-indicator" role="status" aria-live="polite">
      <span>🔌 Online</span>
    </div>
  );
}
