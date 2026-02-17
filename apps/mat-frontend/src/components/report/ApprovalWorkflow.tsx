export default function ApprovalWorkflow() {
  return (
    <div className="space-y-4">
      <h4 className="font-bold">Report Approval</h4>
      <div className="border p-4 rounded">
        <p className="mb-4">Status: Pending Approval</p>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded">Request Changes</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded">Reject</button>
        </div>
      </div>
    </div>
  );
}
