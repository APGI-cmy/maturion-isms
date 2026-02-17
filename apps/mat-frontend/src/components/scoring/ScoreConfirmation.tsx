import { useState } from 'react';

interface ScoreConfirmationProps {
  criterionId: string; // For future use in API calls
  criterionNumber: string;
  aiScore: number;
  aiRationale: string;
  onConfirm?: (finalScore: number, override: boolean, notes?: string) => void;
  onCancel?: () => void;
}

const ScoreConfirmation = ({
  criterionNumber,
  aiScore,
  aiRationale,
  onConfirm,
  onCancel,
}: ScoreConfirmationProps) => {
  const [finalScore, setFinalScore] = useState(aiScore);
  const [notes, setNotes] = useState('');
  const isOverride = finalScore !== aiScore;

  const maturityLevels = [
    { value: 0, label: 'Level 0 - Not Achieved' },
    { value: 1, label: 'Level 1 - Ad Hoc' },
    { value: 2, label: 'Level 2 - Repeatable' },
    { value: 3, label: 'Level 3 - Defined' },
    { value:4, label: 'Level 4 - Managed' },
    { value: 5, label: 'Level 5 - Optimizing' },
  ];

  const handleConfirm = () => {
    onConfirm?.(finalScore, isOverride, notes || undefined);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Confirm Score - Criterion {criterionNumber}
      </h3>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">AI Recommendation</h4>
        <div className="flex items-center space-x-4 mb-2">
          <span className="text-2xl font-bold text-blue-900">
            {maturityLevels[aiScore].label}
          </span>
        </div>
        <p className="text-sm text-blue-800">{aiRationale}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Final Score <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {maturityLevels.map((level) => (
            <label
              key={level.value}
              className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                finalScore === level.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="finalScore"
                value={level.value}
                checked={finalScore === level.value}
                onChange={(e) => setFinalScore(Number(e.target.value))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-900">{level.label}</span>
            </label>
          ))}
        </div>
      </div>

      {isOverride && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex items-start space-x-2">
            <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-900 mb-1">Override Detected</h4>
              <p className="text-sm text-yellow-800">
                You are overriding the AI recommendation. Please provide justification below.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes {isOverride && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder={isOverride ? 'Please explain why you are overriding the AI score...' : 'Optional notes about this scoring decision...'}
          required={isOverride}
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={isOverride && !notes.trim()}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Confirm Score
        </button>
      </div>
    </div>
  );
};

export default ScoreConfirmation;
