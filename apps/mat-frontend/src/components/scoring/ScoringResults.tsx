interface ScoringResult {
  criterionId: string;
  criterionNumber: string;
  aiScore: number;
  confidence: number;
  rationale: string;
  evidenceBased: boolean;
}

interface ScoringResultsProps {
  results?: ScoringResult[];
  onReview?: (criterionId: string) => void;
}

const ScoringResults = ({ results = [], onReview }: ScoringResultsProps) => {
  const getMaturityLabel = (score: number): string => {
    const labels = ['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
    return labels[score] || 'Unknown';
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">AI Scoring Results</h3>

      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No scoring results available</p>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.criterionId}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-mono text-gray-600">{result.criterionNumber}</span>
                    {!result.evidenceBased && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        No Evidence
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-sm text-gray-600">AI Score: </span>
                      <span className="text-lg font-bold text-gray-900">
                        {getMaturityLabel(result.aiScore)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Confidence: </span>
                      <span className={`text-lg font-semibold ${getConfidenceColor(result.confidence)}`}>
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onReview?.(result.criterionId)}
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                  aria-label={`Review scoring for criterion ${result.criterionNumber}`}
                >
                  Review
                </button>
              </div>

              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Rationale: </span>
                  {result.rationale}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoringResults;
