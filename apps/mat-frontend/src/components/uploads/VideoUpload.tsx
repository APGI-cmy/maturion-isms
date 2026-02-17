/**
 * Video Upload Component
 * FRS: FR-017 (Video Evidence)
 * TRS: TR-047
 */
export function VideoUpload() {
  return (
    <div className="video-upload">
      <input type="file" aria-label="Upload video" accept="video/*" />
      <p>Video upload component</p>
    </div>
  );
}
