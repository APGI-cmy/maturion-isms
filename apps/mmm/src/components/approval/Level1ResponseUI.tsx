import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export interface ProposedChangeReview {
  id: string;
  approverName: string;
  approverEmail: string;
  approvalLevel: string;
  decision: 'approved' | 'rejected';
  comment?: string;
  decidedAt: string;
  proposedChanges?: Array<{
    field: string;
    original: string;
    proposed: string;
  }>;
}

interface Level1ResponseUIProps {
  approvalRoundId: string;
  domain: {
    id: string;
    name: string;
  };
  proposedChanges: ProposedChangeReview[];
  onAcceptChanges: (changeIds: string[]) => Promise<void>;
  onRejectChanges: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Level 1 Response UI Component
 * Allows Level 1 domain owner to review Level 2 approvals and proposed changes
 * 
 * Features:
 * - Display each Level 2 approver's decision (approved/rejected)
 * - Show proposed changes grouped by approver
 * - Accept all changes or reject with reason
 * - Evidence modal for detailed change review
 * 
 * Test Coverage:
 * - T-MMM-L1-RESPONSE-001 through T-MMM-L1-RESPONSE-030 (Phase 4)
 */
export function Level1ResponseUI({
  approvalRoundId,
  domain,
  proposedChanges,
  onAcceptChanges,
  onRejectChanges,
  isLoading = false,
}: Level1ResponseUIProps) {
  const [selectedApproverId, setSelectedApproverId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Count decisions
  const approvedCount = proposedChanges.filter((c) => c.decision === 'approved').length;
  const rejectedCount = proposedChanges.filter((c) => c.decision === 'rejected').length;
  const hasRejections = rejectedCount > 0;

  const handleAccept = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const changeIds = proposedChanges
        .filter((c) => c.decision === 'approved')
        .map((c) => c.id);

      await onAcceptChanges(changeIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason?.trim()) {
      setError('Rejection reason is required');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onRejectChanges(rejectReason);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{domain.name}</h1>
        <p className="text-gray-600 mt-1">Review Level 2 Approvals</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Summary Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-green-200 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-green-700 font-semibold">Approved</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            <p className="text-sm text-gray-600">approvers approved domain</p>
          </div>

          <div className={`bg-white border rounded p-4 ${hasRejections ? 'border-red-200' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={20} className={hasRejections ? 'text-red-600' : 'text-gray-400'} />
              <span className={hasRejections ? 'text-red-700' : 'text-gray-700'}>
                {hasRejections ? 'Rejected' : 'No Rejections'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${hasRejections ? 'text-red-600' : 'text-gray-600'}`}>
              {rejectedCount}
            </p>
            <p className="text-sm text-gray-600">rejections received</p>
          </div>
        </div>
      </div>

      {hasRejections && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <XCircle size={20} />
            Rejections Received
          </h3>
          <p className="text-red-700 mb-4">
            One or more Level 2 approvers have rejected this domain. You must address their concerns
            before this domain can progress to Level 3 approval.
          </p>
        </div>
      )}

      {/* Approvals List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Approver Decisions</h2>
        <div className="space-y-4">
          {proposedChanges.map((approval) => (
            <div
              key={approval.id}
              className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                approval.decision === 'approved'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
              onClick={() => setSelectedApproverId(selectedApproverId === approval.id ? null : approval.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {approval.decision === 'approved' ? (
                    <CheckCircle className="text-green-600" />
                  ) : (
                    <XCircle className="text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{approval.approverName}</p>
                    <p className="text-sm text-gray-600">{approval.approverEmail}</p>
                    <p className="text-xs text-gray-500 mt-1">{approval.approvalLevel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${approval.decision === 'approved' ? 'text-green-700' : 'text-red-700'}`}>
                    {approval.decision === 'approved' ? 'Approved' : 'Rejected'}
                  </p>
                  <p className="text-xs text-gray-600">{new Date(approval.decidedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedApproverId === approval.id && (
                <div className="mt-4 pt-4 border-t border-gray-300 space-y-4">
                  {approval.comment && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase mb-2 flex items-center gap-1">
                        <MessageSquare size={14} />
                        Approver Comment
                      </p>
                      <p className="text-sm text-gray-700 italic">{approval.comment}</p>
                    </div>
                  )}

                  {approval.proposedChanges && approval.proposedChanges.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
                        Proposed Changes ({approval.proposedChanges.length})
                      </p>
                      <div className="space-y-2">
                        {approval.proposedChanges.map((change, idx) => (
                          <div key={idx} className="bg-white rounded p-3 text-sm">
                            <p className="font-medium text-gray-900">{change.field}</p>
                            <p className="text-gray-700 mt-1">
                              <span className="text-gray-600">Original: </span>
                              <span className="text-gray-900">{change.original}</span>
                            </p>
                            <p className="text-gray-700">
                              <span className="text-gray-600">Proposed: </span>
                              <span className="text-gray-900 font-semibold">{change.proposed}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Response Actions */}
      {!hasRejections ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Accept Changes</h3>
          <p className="text-blue-700 mb-6">
            All Level 2 approvers have approved this domain. You can accept their proposed changes
            and move forward with Level 3 final approval.
          </p>
          <button
            onClick={handleAccept}
            disabled={isLoading || isSubmitting}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Accepting...' : 'Accept All Changes and Proceed to L3'}
          </button>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Address Rejections</h3>
          <p className="text-red-700 mb-4">
            To proceed, you must address the rejections. You can:
            1. Revise your domain and resubmit, or
            2. Formally reject the feedback and escalate
          </p>
          <div className="mb-4">
            <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rejection (required) *
            </label>
            <textarea
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Explain why you are rejecting the approver feedback..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              disabled={isLoading || isSubmitting || !rejectReason?.trim()}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Formally Reject Feedback'}
            </button>
            <button
              disabled={isLoading || isSubmitting}
              className="flex-1 px-4 py-3 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
            >
              Revise and Resubmit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Level1ResponseUI;
