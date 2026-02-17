interface ParsedCriterion {
  id: string;
  number: string;
  text: string;
  domain?: string;
  approved: boolean;
}

interface CriteriaApprovalProps {
  criteria?: ParsedCriterion[];
  onApprove?: (criteriaIds: string[]) => void;
  onReject?: (criteriaIds: string[]) => void;
  onApproveAll?: () => void;
}

const CriteriaApproval = ({ criteria = [], onApprove, onReject, onApproveAll }: CriteriaApprovalProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Review Parsed Criteria</h3>
        {criteria.length > 0 && onApproveAll && (
          <button
            onClick={onApproveAll}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            aria-label="Approve all criteria"
          >
            Approve All
          </button>
        )}
      </div>

      {criteria.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No criteria to review</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-mono text-gray-600">{criterion.number}</span>
                    {criterion.domain && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">{criterion.domain}</span>
                    )}
                  </div>
                  <p className="text-gray-900">{criterion.text}</p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {!criterion.approved && (
                    <>
                      <button
                        onClick={() => onApprove?.([criterion.id])}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        aria-label={`Approve criterion ${criterion.number}`}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => onReject?.([criterion.id])}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        aria-label={`Reject criterion ${criterion.number}`}
                      >
                        ✗
                      </button>
                    </>
                  )}
                  {criterion.approved && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                      Approved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CriteriaApproval;
