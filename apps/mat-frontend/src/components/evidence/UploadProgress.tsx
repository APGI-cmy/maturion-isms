export default function UploadProgress() {
  return (
    <div className="space-y-2">
      <p className="text-sm">Uploading...</p>
      <div className="h-2 rounded-full bg-gray-200">
        <div className="h-full w-3/4 bg-primary" />
      </div>
    </div>
  );
}
