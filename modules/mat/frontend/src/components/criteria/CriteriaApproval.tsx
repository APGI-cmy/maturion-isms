/**
 * Criteria Approval Component
 * FRS: FR-008 (Human Approval of Parsed Criteria)
 * TRS: TR-047, TR-012
 */
import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useApproveCriterion } from '../../lib/hooks/useCriteria';

interface CriteriaApprovalProps {
  criterionId: string;
  criterionNumber: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

export function CriteriaApproval({
  criterionId,
  criterionNumber,
  currentStatus,
  onStatusChange,
}: CriteriaApprovalProps) {
  const approveCriterion = useApproveCriterion();
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isApproved = currentStatus === 'approved';
  const isRejected = currentStatus === 'rejected';
  const isAlreadyDecided = isApproved || isRejected;

  const handleAction = async (approved: boolean) => {
    const action = approved ? 'approve' : 'reject';
    if (confirmAction !== action) {
      setConfirmAction(action);
      return;
    }

    setErrorMessage('');
    try {
      const updated = await approveCriterion.mutateAsync({ criterionId, approved });
      setConfirmAction(null);
      onStatusChange?.(updated.status);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : `Failed to ${action} criterion`,
      );
      setConfirmAction(null);
    }
  };

  const handleCancel = () => {
    setConfirmAction(null);
    setErrorMessage('');
  };

  if (isAlreadyDecided) {
    return (
      <div className="criteria-approval">
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
            isApproved
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
          role="status"
          aria-live="polite"
        >
          {isApproved ? (
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" aria-hidden="true" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" aria-hidden="true" />
          )}
          <span
            className={`text-sm font-medium ${
              isApproved ? 'text-green-800' : 'text-red-800'
            }`}
          >
            Criterion {criterionNumber} has been{' '}
            {isApproved ? 'approved' : 'rejected'}.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="criteria-approval space-y-4">
      <p className="text-sm text-gray-700">
        Review and approve or reject this criterion before it is included in the audit.
      </p>

      {errorMessage && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200"
          role="alert"
        >
          <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {confirmAction && (
        <div
          className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${
            confirmAction === 'approve'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
          role="alertdialog"
          aria-labelledby="confirm-label"
        >
          <div className="flex-1">
            <p id="confirm-label" className="text-sm font-medium text-gray-900">
              Confirm{' '}
              {confirmAction === 'approve' ? 'approval' : 'rejection'} of criterion{' '}
              {criterionNumber}?
            </p>
            <p className="text-xs text-gray-600 mt-1">
              This action will update the criterion status in the database.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleAction(true)}
          disabled={approveCriterion.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          aria-label={`Approve criterion ${criterionNumber}`}
        >
          {approveCriterion.isPending && confirmAction === 'approve' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
          )}
          {confirmAction === 'approve' ? 'Confirm Approve' : 'Approve'}
        </button>

        <button
          onClick={() => handleAction(false)}
          disabled={approveCriterion.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          aria-label={`Reject criterion ${criterionNumber}`}
        >
          {approveCriterion.isPending && confirmAction === 'reject' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <XCircle className="h-4 w-4" aria-hidden="true" />
          )}
          {confirmAction === 'reject' ? 'Confirm Reject' : 'Reject'}
        </button>

        {confirmAction && (
          <button
            onClick={handleCancel}
            disabled={approveCriterion.isPending}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
