/**
 * Upload Progress Bar Component
 * FRS: FR-019 (Concurrent Uploads)
 * TRS: TR-047
 */
export function UploadProgressBar() {
  return (
    <div className="upload-progress-bar" role="progressbar" aria-valuenow={50}>
      <div className="progress-bar-fill" style={{ width: '50%' }} />
    </div>
  );
}
