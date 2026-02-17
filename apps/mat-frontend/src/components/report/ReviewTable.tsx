interface CriterionReview {
  id: string;
  number: string;
  text: string;
  score: number;
  findings: string;
  recommendations: string;
  editable?: boolean;
}

interface ReviewTableProps {
  criteria?: CriterionReview[];
}

const ReviewTable = ({ criteria = [] }: ReviewTableProps) => {

  const getMaturityLabel = (score: number): string => {
    const labels = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];
    return labels[score] || 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criterion</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Findings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendations</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {criteria.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No criteria to review</td></tr>
            ) : (
              criteria.map((criterion) => (
                <tr key={criterion.id}>
                  <td className="px-6 py-4 text-sm font-mono">{criterion.number}</td>
                  <td className="px-6 py-4 text-sm">{criterion.text}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded">{getMaturityLabel(criterion.score)}</span></td>
                  <td className="px-6 py-4 text-sm">{criterion.findings}</td>
                  <td className="px-6 py-4 text-sm">{criterion.recommendations}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewTable;
