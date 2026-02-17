export default function AuditorAssignment() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Assign Auditor</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Auditor</label>
        <select className="w-full rounded-md border p-2">
          <option>Choose an auditor...</option>
          <option>Auditor 1</option>
          <option>Auditor 2</option>
        </select>
        <button className="w-full rounded-md bg-primary px-4 py-2 text-white">Assign</button>
      </div>
    </div>
  );
}
