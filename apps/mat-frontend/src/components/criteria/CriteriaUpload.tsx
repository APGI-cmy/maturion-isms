/**
 * Criteria Upload Component
 * FRS: FR-004 (Criteria Upload)
 * TRS: TR-047
 */
export function CriteriaUpload() {
  return (
    <div className="criteria-upload">
      <h3>Upload Criteria</h3>
      <input type="file" accept=".pdf,.docx" aria-label="Upload criteria file" />
    </div>
  );
}
