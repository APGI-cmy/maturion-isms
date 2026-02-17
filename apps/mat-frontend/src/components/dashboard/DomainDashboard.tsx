export default function DomainDashboard() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Domain Dashboard</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded">
          <p className="text-sm text-gray-600">Domain 1</p>
          <p className="text-2xl font-bold">75%</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm text-gray-600">Domain 2</p>
          <p className="text-2xl font-bold">60%</p>
        </div>
      </div>
    </div>
  );
}
