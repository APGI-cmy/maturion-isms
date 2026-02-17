export default function MPSDashboard() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">MPS Dashboard</h3>
      <div className="space-y-2">
        <div className="border p-4 rounded">
          <p className="font-bold">MPS 1.1</p>
          <p className="text-sm text-gray-600">Criteria: 10 | Completed: 8</p>
        </div>
        <div className="border p-4 rounded">
          <p className="font-bold">MPS 1.2</p>
          <p className="text-sm text-gray-600">Criteria: 15 | Completed: 12</p>
        </div>
      </div>
    </div>
  );
}
