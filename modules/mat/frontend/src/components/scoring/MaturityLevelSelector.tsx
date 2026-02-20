/**
 * Maturity Level Selector/Display Component
 * FRS: FR-027 (Maturity Levels)
 * TRS: TR-047
 */
export function MaturityLevelSelector() {
  return (
    <div className="maturity-level-selector">
      <label htmlFor="maturity-level">Maturity Level</label>
      <select id="maturity-level" aria-label="Select maturity level">
        <option value="0">Level 0: Not Assessed</option>
        <option value="1">Level 1: Initial</option>
        <option value="2">Level 2: Managed</option>
        <option value="3">Level 3: Defined</option>
        <option value="4">Level 4: Quantitatively Managed</option>
        <option value="5">Level 5: Optimizing</option>
      </select>
    </div>
  );
}
