interface Evidence {
  id: string;
  name: string;
  type: 'document' | 'photo' | 'video' | 'audio';
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  size: number;
}

interface EvidenceReviewProps {
  evidence?: Evidence[];
  onApprove?: (evidenceId: string) => void;
  onReject?: (evidenceId: string) => void;
  onDelete?: (evidenceId: string) => void;
}

const EvidenceReview = ({ evidence = [], onApprove, onReject, onDelete }: EvidenceReviewProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTypeIcon = (type: Evidence['type']) => {
    const icons = {
      document: '📄',
      photo: '📷',
      video: '🎥',
      audio: '🎤',
    };
    return icons[type];
  };

  const getStatusBadge = (status: Evidence['status']) => {
    const config = {
      pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
    };
    return config[status];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Evidence Review</h3>

      {evidence.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No evidence to review</p>
      ) : (
        <div className="space-y-3">
          {evidence.map((item) => {
            const statusBadge = getStatusBadge(item.status);
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-2xl" aria-hidden="true">{getTypeIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                        <span>{formatFileSize(item.size)}</span>
                        <span>•</span>
                        <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove?.(item.id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          aria-label={`Approve ${item.name}`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReject?.(item.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          aria-label={`Reject ${item.name}`}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDelete?.(item.id)}
                      className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                      aria-label={`Delete ${item.name}`}
                    >
                      Delete
                    </button>
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

export default EvidenceReview;
