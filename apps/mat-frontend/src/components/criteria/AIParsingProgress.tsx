/**
 * AI Parsing Progress Indicator
 * FRS: FR-004 (AI Parsing Progress)
 * TRS: TR-047
 */
export function AIParsingProgress() {
  return (
    <div className="ai-parsing-progress" role="progressbar" aria-valuenow={0}>
      <p>Parsing criteria...</p>
    </div>
  );
}
