import React, { useState } from 'react';

export interface ProposedChange {
  id: string;
  objectType: 'domain' | 'mps' | 'criterion' | 'maturity_descriptor';
  objectId: string;
  fieldName: string;
  displayReference: string;
  originalValue: string;
  proposedValue: string;
  comment?: string;
}

interface ProposeChangeModalProps {
  objectType: 'domain' | 'mps' | 'criterion' | 'maturity_descriptor';
  objectId: string;
  fieldName: string;
  displayReference: string;
  originalValue: string;
  onClose: () => void;
  onSave: (change: ProposedChange) => void;
}

/**
 * Propose Change Modal
 * Captures proposed changes to domain, MPS, criteria, or descriptors
 * 
 * Features:
 * - Display original value for reference
 * - Capture proposed value (required)
 * - Optional comment/reason
 * - Validation (proposed value cannot be empty)
 * - Show reference context (e.g., "MPS 2 / Criteria 5 / Descriptor")
 * 
 * Test Coverage:
 * - T-MMM-L2-WORKSPACE-010: Control exists
 * - T-MMM-L2-WORKSPACE-012: Captures original and proposed values
 * - T-MMM-L2-WORKSPACE-013: Requires proposed value
 */
export function ProposeChangeModal({
  objectType,
  objectId,
  fieldName,
  displayReference,
  originalValue,
  onClose,
  onSave,
}: ProposeChangeModalProps) {
  const [proposedValue, setProposedValue] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setError(null);

    // Validation: proposed value is required
    if (!proposedValue?.trim()) {
      setError('Proposed value is required');
      return;
    }

    // Validation: proposed value should be different from original
    if (proposedValue === originalValue) {
      setError('Proposed value must be different from original');
      return;
    }

    setIsSaving(true);

    try {
      const change: ProposedChange = {
        id: crypto.randomUUID(),
        objectType,
        objectId,
        fieldName,
        displayReference,
        originalValue,
        proposedValue: proposedValue.trim(),
        comment: comment.trim() || undefined,
      };

      onSave(change);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save change');
    } finally {
      setIsSaving(false);
    }
  };

  const getObjectTypeLabel = (): string => {
    const labels = {
      domain: 'Domain',
      mps: 'Management Practice Statement',
      criterion: 'Criterion',
      maturity_descriptor: 'Maturity Descriptor',
    };
    return labels[objectType];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Propose Change</h2>
          <p className="text-sm text-gray-600 mt-1">
            {getObjectTypeLabel()} — <span className="font-mono text-gray-700">{displayReference}</span>
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Original Value Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Original Value</label>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                {originalValue || '<empty>'}
              </p>
            </div>
          </div>

          {/* Proposed Value */}
          <div>
            <label htmlFor="proposedValue" className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Value *
            </label>
            <textarea
              id="proposedValue"
              value={proposedValue}
              onChange={(e) => {
                setProposedValue(e.target.value);
                setError(null);
              }}
              rows={4}
              placeholder="Enter the proposed value..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-600 mt-1">
              Character count: {proposedValue.length}
            </p>
          </div>

          {/* Comment/Reason */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comment/Reason (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Explain why this change is needed..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-600 mt-1">
              Character count: {comment.length}
            </p>
          </div>

          {/* Field Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-xs text-blue-900 font-semibold uppercase">Reference Information</p>
            <div className="mt-2 text-sm text-blue-800 space-y-1">
              <p><span className="font-medium">Object Type:</span> {getObjectTypeLabel()}</p>
              <p><span className="font-medium">Object ID:</span> <span className="font-mono">{objectId}</span></p>
              <p><span className="font-medium">Field:</span> {fieldName}</p>
              <p><span className="font-medium">Path:</span> {displayReference}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !proposedValue?.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Change'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProposeChangeModal;
