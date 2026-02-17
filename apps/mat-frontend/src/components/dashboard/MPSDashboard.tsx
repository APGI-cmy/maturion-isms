interface MPSData {
  mpsName: string;
  totalCriteria: number;
  completedCriteria: number;
  averageMaturity: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface MPSDashboardProps {
  mpsData?: MPSData[];
  onMPSClick?: (mpsName: string) => void;
}

const MPSDashboard = ({ mpsData = [], onMPSClick }: MPSDashboardProps) => {
  const getStatusBadge = (status: MPSData['status']) => {
    const config = {
      not_started: { label: 'Not Started', color: 'bg-gray-100 text-gray-800' },
      in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    };
    return config[status];
  };

  const getCompletionPercentage = (completed: number, total: number): number => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6">MPS (Maturity Profile Segment) Analysis</h3>

      {mpsData.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No MPS data available</p>
      ) : (
        <div className="space-y-4">
          {mpsData.map((mps) => {
            const badge = getStatusBadge(mps.status);
            const completionPct = getCompletionPercentage(mps.completedCriteria, mps.totalCriteria);

            return (
              <div
                key={mps.mpsName}
                onClick={() => onMPSClick?.(mps.mpsName)}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && onMPSClick?.(mps.mpsName)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{mps.mpsName}</h4>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Completion</div>
                    <div className="text-lg font-bold text-gray-900">{completionPct}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Avg. Maturity</div>
                    <div className="text-lg font-bold text-primary-600">L{mps.averageMaturity.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Criteria</div>
                    <div className="text-lg font-bold text-gray-900">
                      {mps.completedCriteria}/{mps.totalCriteria}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${completionPct}%` }}
                    role="progressbar"
                    aria-valuenow={completionPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MPSDashboard;
