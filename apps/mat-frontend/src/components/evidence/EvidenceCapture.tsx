export default function EvidenceCapture() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Capture Evidence</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="border p-4 rounded hover:bg-gray-50">📷 Photo</button>
        <button className="border p-4 rounded hover:bg-gray-50">🎤 Voice</button>
        <button className="border p-4 rounded hover:bg-gray-50">📄 Document</button>
        <button className="border p-4 rounded hover:bg-gray-50">🎥 Video</button>
      </div>
    </div>
  );
}
