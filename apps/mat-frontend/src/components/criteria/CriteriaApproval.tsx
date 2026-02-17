export default function CriteriaApproval() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review Parsed Criteria</h3>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground">Parsed criteria awaiting approval...</p>
      </div>
      <div className="flex gap-2">
        <button className="rounded-md bg-primary px-4 py-2 text-white">Approve</button>
        <button className="rounded-md border px-4 py-2">Reject</button>
      </div>
    </div>
  );
}
