import { useState } from 'react';

interface Criterion {
  id: string;
  number: string;
  text: string;
  domain?: string;
  notUsed?: boolean;
}

interface CriteriaModalProps {
  criterion?: Criterion;
  isOpen: boolean;
  onClose: () => void;
  onToggleNotUsed?: (criterionId: string, notUsed: boolean) => void;
}

const CriteriaModal = ({ criterion, isOpen, onClose, onToggleNotUsed }: CriteriaModalProps) => {
  const [notUsed, setNotUsed] = useState(criterion?.notUsed || false);

  if (!isOpen || !criterion) {
    return null;
  }

  const handleToggleNotUsed = () => {
    const newValue = !notUsed;
    setNotUsed(newValue);
    onToggleNotUsed?.(criterion.id, newValue);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="criteria-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 id="criteria-modal-title" className="text-2xl font-bold text-gray-900">
              Criterion {criterion.number}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {criterion.domain && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {criterion.domain}
              </span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Criterion Text</h3>
            <p className="text-gray-900">{criterion.text}</p>
          </div>

          <div className="mb-6 border-t pt-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notUsed}
                onChange={handleToggleNotUsed}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                aria-label="Mark as not used"
              />
              <span className="text-sm text-gray-700">
                Mark as "Not Used" (exclude from audit)
              </span>
            </label>
            {notUsed && (
              <p className="mt-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                This criterion will be excluded from the audit scope.
              </p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Evidence</h3>
            <p className="text-sm text-gray-500 mb-4">Evidence collection for this criterion</p>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              + Add Evidence
            </button>
          </div>

          <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriteriaModal;
