export default function ValidationResults() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Validation Results</h3>
      <div className="border p-4 rounded">
        <p className="text-green-600">✓ Coverage: 100%</p>
        <p className="text-green-600">✓ No hallucinations detected</p>
      </div>
    </div>
  );
}
