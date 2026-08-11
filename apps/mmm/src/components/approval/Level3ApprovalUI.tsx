import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export interface Level3ApprovalProps {
  approvalRoundId: string;
  domain: {
    id: string;
    name: string;
    description?: string;
  };
  level2ApproversCount: number;
  level2ApprovalsReceived: number;
  requiredDomains: string[];
  missingApprovals?: string[];
  onSubmitApproval: (decision: 'approved' | 'rejected', comment?: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Level 3 Approval Component
 * Final approval authority reviews all Level 2 approvals and makes final decision
 * 
 * Features:
 * - Display Level 2 approvals progress
 * - Show which domains have completed approvals
 * - Show missing approvals preventing L3 decision
 * - Submit final approval or rejection
 * - View published model if all approvals complete
 * 
 * Test Coverage:
 * - T-MMM-L3-APPROVAL-001 through T-MMM-L3-APPROVAL-025 (Phase 5)
 */
export function Level3ApprovalUI({
  approvalRoundId,
  domain,
  level2ApproversCount,
  level2ApprovalsReceived,
  requiredDomains,
  missingApprovals = [],
  onSubmitApproval,
  isLoading = false,
}: Level3ApprovalProps) {
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allApprovalsReceived = level2ApprovalsReceived === level2ApproversCount;
  const allDomainsApproved = missingApprovals.length === 0;
  const canApprove = allApprovalsReceived && allDomainsApproved;

  const handleSubmit = async () => {
    if (!decision) {
      setError('Please select Approve or Reject');
      return;
    }

    if (decision === 'rejected' && !comment?.trim()) {
      setError('Rejection reason is required');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmitApproval(decision, comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit approval decision');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Level 3 Final Approval</h1>
        <p className="text-gray-600 mt-1">{domain.name}</p>
        {domain.description && <p className="text-sm text-gray-700 mt-2">{domain.description}</p>}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Level 2 Approvals Progress */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Level 2 Approvals Progress</h2>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-gray-900">
              {level2ApprovalsReceived} / {level2ApproversCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${(level2ApprovalsReceived / level2ApproversCount) * 100}%` }}
            />
          </div>
        </div>

        {allApprovalsReceived && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-700 font-semibold">All Level 2 approvals received</span>
            </div>
          </div>
        )}

        {!allApprovalsReceived && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-yellow-600" size={20} />
              <span className="text-yellow-700 font-semibold">Awaiting Level 2 approvals</span>
            </div>
            <p className="text-sm text-yellow-700">
              {level2ApproversCount - level2ApprovalsReceived} more approval{level2ApproversCount - level2ApprovalsReceived !== 1 ? 's' : ''} required before you can proceed.
            </p>
          </div>
        )}
      </div>

      {/* Required Domains Status */}
      {requiredDomains.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Domains</h2>
          <div className="space-y-3">
            {requiredDomains.map((domainName) => {
              const isApproved = !missingApprovals.includes(domainName);
              return (
                <div
                  key={domainName}
                  className={`flex items-center gap-3 p-3 rounded border ${
                    isApproved
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <AlertCircle className="text-red-600" size={20} />
                  )}
                  <span className={isApproved ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {domainName}
                  </span>
                  <span className={`ml-auto text-xs font-semibold ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
                    {isApproved ? 'APPROVED' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Blocking Issues */}
      {!canApprove && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            Cannot Approve Yet
          </h2>
          <ul className="space-y-2 text-red-700">
            {!allApprovalsReceived && (
              <li className="text-sm">
                ⏳ Waiting for {level2ApproversCount - level2ApprovalsReceived} Level 2 approvals
              </li>
            )}
            {!allDomainsApproved && (
              <li className="text-sm">
                ❌ {missingApprovals.length} required domain{missingApprovals.length !== 1 ? 's' : ''} not yet approved: {missingApprovals.join(', ')}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Approval Decision */}
      {canApprove && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Make Final Decision</h2>

          <p className="text-blue-700 mb-6">
            All Level 2 approvals have been received and all required domains have approved.
            You can now make the final decision on this domain.
          </p>

          {/* Decision Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => {
                setDecision('approved');
                setComment('');
                setError(null);
              }}
              className={`p-4 rounded-lg border-2 transition-colors ${
                decision === 'approved'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-white border-gray-200 hover:border-green-300'
              }`}
            >
              <CheckCircle
                className={decision === 'approved' ? 'text-green-600' : 'text-gray-400'}
                size={24}
              />
              <p className={`mt-2 font-semibold ${decision === 'approved' ? 'text-green-700' : 'text-gray-700'}`}>
                Approve
              </p>
            </button>

            <button
              onClick={() => {
                setDecision('rejected');
                setError(null);
              }}
              className={`p-4 rounded-lg border-2 transition-colors ${
                decision === 'rejected'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-white border-gray-200 hover:border-red-300'
              }`}
            >
              <AlertCircle
                className={decision === 'rejected' ? 'text-red-600' : 'text-gray-400'}
                size={24}
              />
              <p className={`mt-2 font-semibold ${decision === 'rejected' ? 'text-red-700' : 'text-gray-700'}`}>
                Reject
              </p>
            </button>
          </div>

          {/* Comment Field (if rejecting) */}
          {decision === 'rejected' && (
            <div className="mb-6">
              <label htmlFor="rejectionComment" className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                id="rejectionComment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Explain why you are rejecting this domain..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          {/* Comment Field (if approving) */}
          {decision === 'approved' && (
            <div className="mb-6">
              <label htmlFor="approvalComment" className="block text-sm font-medium text-gray-700 mb-2">
                Approval Note (optional)
              </label>
              <textarea
                id="approvalComment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Add any final comments or notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Submit Button */}
          {decision && (
            <button
              onClick={handleSubmit}
              disabled={isLoading || isSubmitting}
              className={`w-full px-4 py-3 font-semibold rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                decision === 'approved'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSubmitting
                ? decision === 'approved'
                  ? 'Approving...'
                  : 'Rejecting...'
                : decision === 'approved'
                  ? 'Approve Domain'
                  : 'Reject Domain'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Level3ApprovalUI;
