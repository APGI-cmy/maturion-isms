/**
 * Document Upload Component
 * FRS: FR-016 (Document Evidence)
 * TRS: TR-047
 */
export function DocumentUpload() {
  return (
    <div className="document-upload">
      <input type="file" aria-label="Upload document" accept=".pdf,.doc,.docx" />
      <p>Document upload component</p>
    </div>
  );
}
