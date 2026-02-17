export default function ApprovalWorkflow() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Report Approval</h3>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Status: Pending Review</p>
        <div className="mt-4 flex gap-2">
          <button className="rounded-md bg-green-500 px-4 py-2 text-white">Approve</button>
          <button className="rounded-md bg-red-500 px-4 py-2 text-white">Reject</button>
        </div>
      </div>
    </div>
  );
}
