/**
 * Evidence-First Scoring Rule Enforcement
 * FRS: FR-028 (Evidence-First Rule)
 * TRS: TR-047
 */
export function EvidenceRequirement() {
  return (
    <div className="evidence-requirement" role="alert">
      <p>⚠️ Evidence required before scoring</p>
    </div>
  );
}
