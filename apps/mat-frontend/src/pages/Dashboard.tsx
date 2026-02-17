export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Global Audit Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded">
          <p className="text-sm text-gray-600">Completion Rate</p>
          <p className="text-3xl font-bold">68%</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm text-gray-600">Average Maturity</p>
          <p className="text-3xl font-bold">2.8</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm text-gray-600">Total Audits</p>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          <li className="text-sm">Audit 1 updated - 2 hours ago</li>
          <li className="text-sm">New evidence added - 4 hours ago</li>
        </ul>
      </div>
    </div>
  );
}
