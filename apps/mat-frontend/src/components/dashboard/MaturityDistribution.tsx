interface MaturityData {
  level: number;
  count: number;
  percentage: number;
}

interface MaturityDistributionProps {
  data?: MaturityData[];
  title?: string;
}

const MaturityDistribution = ({ data = [], title = 'Maturity Distribution' }: MaturityDistributionProps) => {
  const maturityLevels = [
    { level: 0, label: 'L0 - Not Achieved', color: 'bg-red-500' },
    { level: 1, label: 'L1 - Ad Hoc', color: 'bg-orange-500' },
    { level: 2, label: 'L2 - Repeatable', color: 'bg-yellow-500' },
    { level: 3, label: 'L3 - Defined', color: 'bg-blue-500' },
    { level: 4, label: 'L4 - Managed', color: 'bg-green-500' },
    { level: 5, label: 'L5 - Optimizing', color: 'bg-green-700' },
  ];

  const getDataForLevel = (level: number): MaturityData => {
    return data.find(d => d.level === level) || { level, count: 0, percentage: 0 };
  };

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>

      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No maturity data available</p>
      ) : (
        <div className="space-y-4">
          {/* Bar Chart */}
          <div className="space-y-3">
            {maturityLevels.map((level) => {
              const levelData = getDataForLevel(level.level);
              const barWidth = maxCount > 0 ? (levelData.count / maxCount) * 100 : 0;

              return (
                <div key={level.level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{level.label}</span>
                    <span className="text-sm text-gray-600">
                      {levelData.count} ({levelData.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className={`${level.color} h-6 rounded-full flex items-center justify-end px-2 transition-all`}
                      style={{ width: `${barWidth}%` }}
                      role="progressbar"
                      aria-valuenow={levelData.count}
                      aria-valuemin={0}
                      aria-valuemax={maxCount}
                      aria-label={`${level.label}: ${levelData.count} criteria`}
                    >
                      {barWidth > 15 && (
                        <span className="text-xs font-semibold text-white">{levelData.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="border-t pt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.reduce((sum, d) => sum + d.count, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Criteria</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                L{(data.reduce((sum, d) => sum + (d.level * d.count), 0) / Math.max(data.reduce((sum, d) => sum + d.count, 0), 1)).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Maturity</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaturityDistribution;
