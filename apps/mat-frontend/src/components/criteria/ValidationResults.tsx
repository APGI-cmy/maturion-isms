export default function ValidationResults() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Validation Results</h3>
      <div className="rounded-lg border bg-card p-4">
        <div className="space-y-2">
          <p className="text-sm"><span className="font-medium">Coverage:</span> 100%</p>
          <p className="text-sm"><span className="font-medium">Hallucinations:</span> None detected</p>
        </div>
      </div>
    </div>
  );
}
