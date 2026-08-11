import React from 'react';
import { X } from 'lucide-react';
import { ProposedChange } from './ProposeChangeModal';

interface ProposedChangesSummaryProps {
  changes: ProposedChange[];
  onRemoveChange: (changeId: string) => void;
  onClearAll: () => void;
  isSubmitting?: boolean;
}

/**
 * Proposed Changes Summary Component
 * Displays all staged proposed changes for review before submission
 * 
 * Features:
 * - Display all changes with original and proposed values
 * - Show display references for context
 * - Remove individual changes
 * - Clear all changes
 * - Ready for submission indicator
 * 
 * Test Coverage:
 * - T-MMM-L2-WORKSPACE-014: Changes can be reviewed before submission
 */
export function ProposedChangesSummary({
  changes,
  onRemoveChange,
  onClearAll,
  isSubmitting = false,
}: ProposedChangesSummaryProps) {
  if (changes.length === 0) {
    return null;
  }

  const getObjectTypeLabel = (objectType: string): string => {
    const labels = {
      domain: 'Domain',
      mps: 'MPS',
      criterion: 'Criterion',
      descriptor: 'Descriptor',
    };
    return labels[objectType as keyof typeof labels] || objectType;
  };

  const getObjectTypeColor = (objectType: string): string => {
    const colors = {
      domain: 'bg-purple-50 border-purple-200',
      mps: 'bg-blue-50 border-blue-200',
      criterion: 'bg-green-50 border-green-200',
      descriptor: 'bg-orange-50 border-orange-200',
    };
    return colors[objectType as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  const getObjectTypeTagColor = (objectType: string): string => {
    const colors = {
      domain: 'bg-purple-100 text-purple-800',
      mps: 'bg-blue-100 text-blue-800',
      criterion: 'bg-green-100 text-green-800',
      descriptor: 'bg-orange-100 text-orange-800',
    };
    return colors[objectType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Proposed Changes ({changes.length})
        </h3>
        {changes.length > 0 && (
          <button
            onClick={onClearAll}
            disabled={isSubmitting}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
          >
            Clear All
          </button>
        )}
      </div>

      <p className="text-sm text-gray-700 mb-4">
        Review all proposed changes before submitting. You can remove individual changes or clear all.
      </p>

      <div className="space-y-3">
        {changes.map((change) => (
          <div
            key={change.id}
            className={`border rounded-lg p-4 ${getObjectTypeColor(change.objectType)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getObjectTypeTagColor(change.objectType)}`}>
                  {getObjectTypeLabel(change.objectType)}
                </span>
                <span className="text-sm font-mono text-gray-700">{change.displayReference}</span>
              </div>
              <button
                onClick={() => onRemoveChange(change.id)}
                disabled={isSubmitting}
                className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                title="Remove this change"
              >
                <X size={16} />
              </button>
            </div>

            {/* Field Information */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 uppercase font-semibold">Field: {change.fieldName}</p>
            </div>

            {/* Value Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              {/* Original Value */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Original Value</p>
                <div className="bg-white border border-gray-300 rounded p-2 text-sm text-gray-700">
                  <p className="whitespace-pre-wrap break-words">
                    {change.originalValue || '<empty>'}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <span className="text-gray-400 font-bold">→</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Proposed Value */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Proposed Value</p>
                <div className="bg-white border border-gray-300 rounded p-2 text-sm text-gray-900 font-semibold">
                  <p className="whitespace-pre-wrap break-words">
                    {change.proposedValue}
                  </p>
                </div>
              </div>

              {/* Spacer */}
              <div />
            </div>

            {/* Comment */}
            {change.comment && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs font-medium text-gray-700 mb-1">Comment/Reason</p>
                <p className="text-sm text-gray-700 italic">{change.comment}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-yellow-300">
        <p className="text-sm text-gray-700">
          <strong>{changes.length}</strong> change{changes.length !== 1 ? 's' : ''} pending submission.
          <br />
          <span className="text-xs text-gray-600">Submit changes to notify Level 1 user, or approve without changes.</span>
        </p>
      </div>
    </div>
  );
}

export default ProposedChangesSummary;
