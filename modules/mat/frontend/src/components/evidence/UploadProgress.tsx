/**
 * Upload Progress Component for Evidence
 * FRS: FR-019 (Concurrent Uploads)
 * TRS: TR-047
 */
export function UploadProgress() {
  return (
    <div className="upload-progress" role="progressbar">
      <p>Uploading evidence... 50%</p>
    </div>
  );
}
