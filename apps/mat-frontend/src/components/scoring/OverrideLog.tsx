interface Override {
  id: string;
  criterionNumber: string;
  aiScore: number;
  humanScore: number;
  auditor: string;
  timestamp: string;
  rationale: string;
}

interface OverrideLogProps {
  overrides?: Override[];
}

const OverrideLog = ({ overrides = [] }: OverrideLogProps) => {
  const getMaturityLabel = (score: number): string => {
    const labels = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];
    return labels[score] || 'Unknown';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Override History</h3>

      {overrides.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No overrides recorded</p>
      ) : (
        <div className="space-y-3">
          {overrides.map((override) => (
            <div
              key={override.id}
              className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-mono text-gray-900 font-semibold">
                    {override.criterionNumber}
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">AI: </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-semibold">
                      {getMaturityLabel(override.aiScore)}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm text-gray-600">Human: </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-semibold">
                      {getMaturityLabel(override.humanScore)}
                    </span>
                  </div>
                </div>
                
                <div className="text-right text-xs text-gray-500">
                  <div>{override.auditor}</div>
                  <div>{new Date(override.timestamp).toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Rationale: </span>
                  {override.rationale}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {overrides.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
          <span className="font-semibold">Total Overrides: </span>
          {overrides.length}
        </div>
      )}
    </div>
  );
};

export default OverrideLog;
