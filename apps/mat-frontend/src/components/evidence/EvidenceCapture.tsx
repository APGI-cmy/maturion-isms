export default function EvidenceCapture() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Capture Evidence</h3>
      <div className="grid gap-2">
        <button className="rounded-md border p-2 hover:bg-gray-50">Text Note</button>
        <button className="rounded-md border p-2 hover:bg-gray-50">Voice Recording</button>
        <button className="rounded-md border p-2 hover:bg-gray-50">Photo</button>
        <button className="rounded-md border p-2 hover:bg-gray-50">Document</button>
      </div>
    </div>
  );
}
