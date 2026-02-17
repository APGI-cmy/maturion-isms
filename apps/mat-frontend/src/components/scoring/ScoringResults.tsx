export default function ScoringResults() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">AI Scoring Results</h3>
      <div className="border p-4 rounded">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Maturity Level: 3</span>
          <span className="text-sm text-gray-600">Confidence: 85%</span>
        </div>
        <p className="mt-2 text-sm">Rationale: Evidence demonstrates established processes...</p>
      </div>
    </div>
  );
}
