interface ValidationResult {
  coverage: number;
  hallucinationScore: number;
  missingCriteria: string[];
  extraCriteria: string[];
  warnings: string[];
}

interface ValidationResultsProps {
  results?: ValidationResult;
}

const ValidationResults = ({ results }: ValidationResultsProps) => {
  if (!results) {
    return null;
  }

  const coveragePercentage = Math.round(results.coverage * 100);
  const hallucinationPercentage = Math.round(results.hallucinationScore * 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Validation Results</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Coverage</div>
          <div className="text-2xl font-bold text-blue-600">{coveragePercentage}%</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${coveragePercentage}%` }}
              role="progressbar"
              aria-valuenow={coveragePercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Coverage percentage"
            ></div>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Hallucination Risk</div>
          <div className="text-2xl font-bold text-green-600">{hallucinationPercentage}%</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${hallucinationPercentage > 10 ? 'bg-red-600' : 'bg-green-600'}`}
              style={{ width: `${hallucinationPercentage}%` }}
              role="progressbar"
              aria-valuenow={hallucinationPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Hallucination risk percentage"
            ></div>
          </div>
        </div>
      </div>

      {results.missingCriteria.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">Missing Criteria ({results.missingCriteria.length})</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {results.missingCriteria.map((criterion, idx) => (
              <li key={idx}>• {criterion}</li>
            ))}
          </ul>
        </div>
      )}

      {results.extraCriteria.length > 0 && (
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded">
          <h4 className="font-semibold text-orange-800 mb-2">Extra Criteria ({results.extraCriteria.length})</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            {results.extraCriteria.map((criterion, idx) => (
              <li key={idx}>• {criterion}</li>
            ))}
          </ul>
        </div>
      )}

      {results.warnings.length > 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <h4 className="font-semibold text-gray-800 mb-2">Warnings</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {results.warnings.map((warning, idx) => (
              <li key={idx}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationResults;
