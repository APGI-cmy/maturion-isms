export default function MaturityDistribution() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Maturity Distribution</h3>
      <div className="border p-4 rounded">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="w-20">Level 1</span>
            <div className="flex-1 bg-gray-200 rounded h-6">
              <div className="bg-blue-600 h-6 rounded" style={{ width: '20%' }}></div>
            </div>
            <span>20%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-20">Level 2</span>
            <div className="flex-1 bg-gray-200 rounded h-6">
              <div className="bg-blue-600 h-6 rounded" style={{ width: '30%' }}></div>
            </div>
            <span>30%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
