export default function UploadProgress() {
  return (
    <div className="space-y-2">
      <h4 className="font-bold">Uploading Evidence</h4>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>document.pdf</span>
          <span>75%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div className="bg-blue-600 h-1 rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>
    </div>
  );
}
