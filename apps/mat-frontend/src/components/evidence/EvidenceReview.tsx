export default function EvidenceReview() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Evidence Review</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded">
          <p className="text-sm">Photo 1</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm">Audio 1</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm">Document 1</p>
        </div>
      </div>
    </div>
  );
}
