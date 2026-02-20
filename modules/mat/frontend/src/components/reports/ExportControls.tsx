/**
 * Multi-Format Export Controls
 * FRS: FR-036, FR-037 (Multi-Format Export)
 * TRS: TR-047
 */
export function ExportControls() {
  return (
    <div className="export-controls">
      <button aria-label="Export as PDF">Export PDF</button>
      <button aria-label="Export as DOCX">Export DOCX</button>
      <button aria-label="Export as XLSX">Export XLSX</button>
    </div>
  );
}
