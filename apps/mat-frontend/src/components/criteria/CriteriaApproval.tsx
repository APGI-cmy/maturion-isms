export default function CriteriaApproval() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Review Parsed Criteria</h3>
      <div className="border p-4 rounded">
        <p>Criterion 1.1 - Sample criterion text</p>
        <div className="flex gap-2 mt-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded">Reject</button>
        </div>
      </div>
    </div>
  );
}
