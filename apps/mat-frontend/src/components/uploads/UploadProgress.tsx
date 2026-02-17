/**
 * Upload Progress Indicator
 * FRS: FR-019 (Concurrent Uploads)
 * TRS: TR-047
 */
export function UploadProgress() {
  return (
    <div className="upload-progress" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
      <p>Upload progress: 0%</p>
    </div>
  );
}
