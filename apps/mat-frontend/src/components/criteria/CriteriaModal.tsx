export default function CriteriaModal() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-lg font-semibold mb-2">Criterion Details</h3>
      <div className="space-y-2">
        <p className="text-sm"><span className="font-medium">Clause:</span> 5.1</p>
        <p className="text-sm text-muted-foreground">Criterion text goes here...</p>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span className="text-sm">Mark as "Not Used"</span>
        </label>
      </div>
    </div>
  );
}
