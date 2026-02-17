interface DomainStats {
  domain: string;
  totalCriteria: number;
  completedCriteria: number;
  averageMaturity: number;
}

interface DomainDashboardProps {
  domainStats?: DomainStats[];
  onDomainClick?: (domain: string) => void;
}

const DomainDashboard = ({ domainStats = [], onDomainClick }: DomainDashboardProps) => {
  const getCompletionPercentage = (completed: number, total: number): number => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getMaturityColor = (level: number): string => {
    if (level >= 4) return 'text-green-600';
    if (level >= 3) return 'text-blue-600';
    if (level >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6">Domain Performance</h3>

      {domainStats.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No domain data available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domainStats.map((domain) => {
            const completionPct = getCompletionPercentage(domain.completedCriteria, domain.totalCriteria);
            
            return (
              <div
                key={domain.domain}
                onClick={() => onDomainClick?.(domain.domain)}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && onDomainClick?.(domain.domain)}
              >
                <h4 className="font-semibold text-gray-900 mb-3">{domain.domain}</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Completion</span>
                      <span className="font-semibold">{completionPct}%</span>
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

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Maturity</span>
                    <span className={`text-lg font-bold ${getMaturityColor(domain.averageMaturity)}`}>
                      L{domain.averageMaturity.toFixed(1)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 border-t pt-2">
                    {domain.completedCriteria} / {domain.totalCriteria} criteria
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DomainDashboard;
