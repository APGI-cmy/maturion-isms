/**
 * Confidence Indicator Component
 * FRS: FR-030 (Confidence Flagging)
 * TRS: TR-047
 */
export function ConfidenceIndicator() {
  return (
    <div className="confidence-indicator" role="status">
      <span>Confidence: High (85%)</span>
    </div>
  );
}
