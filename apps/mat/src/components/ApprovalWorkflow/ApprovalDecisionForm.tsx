/**
 * Level 2 Approver Decision Form — Phase 3 UI Component
 * File: apps/mat/src/components/ApprovalWorkflow/ApprovalDecisionForm.tsx
 * Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
 *
 * Implements T-MMM-APPROVAL-DB-012, T-MMM-APPROVAL-DB-013, T-MMM-APPROVAL-DB-014
 * Allows Level 2 domain approvers to submit decisions (approve/changes_requested/reject).
 * Wires to mmm-approval-decision-submit Edge Function.
 * Creates domain locks when all approvers reach consensus.
 *
 * Contract: approval-workflow-db-api-contract.md §16
 */

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

type Decision = 'approved' | 'changes_requested' | 'rejected';

interface ApprovalRound {
  id: string;
  framework_id: string;
  domain_id?: string;
  status: string;
  created_at: string;
}

interface Approver {
  id: string;
  user_id: string;
  domain_id?: string;
  status: string;
  decision?: string;
}

export const ApprovalDecisionForm: React.FC<{ roundId: string }> = ({ roundId }) => {
  const [decision, setDecision] = useState<Decision>('approved');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch approval round and approvers
  const { data: roundData, isLoading: roundLoading } = useQuery({
    queryKey: ['approval-round', roundId],
    queryFn: async () => {
      const response = await fetch(`/api/mmm-approval-workspace-read?filter=pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch round');
      const data = await response.json();
      return data.approval_rounds.find((r: ApprovalRound) => r.id === roundId);
    },
  });

  const { data: approvers, isLoading: approversLoading } = useQuery({
    queryKey: ['approval-round-approvers', roundId],
    queryFn: async () => {
      const response = await fetch(`/api/mmm-approval-workspace-read?filter=pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch approvers');
      const data = await response.json();
      const round = data.approval_rounds.find((r: ApprovalRound) => r.id === roundId);
      return round?.approvers || [];
    },
  });

  // Submit decision mutation
  const { mutate: submitDecision } = useMutation({
    mutationFn: async () => {
      const approverId = approvers?.find((a: Approver) => a.user_id === localStorage.getItem('user_id'))?.id;
      if (!approverId) {
        throw new Error('Approver not found in this round');
      }

      const response = await fetch('/api/mmm-approval-decision-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          approval_round_id: roundId,
          approver_id: approverId,
          decision,
          decision_comment: comment || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit decision');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setSuccess(`Decision submitted. Round status: ${data.round_status}`);
      if (data.lock_state_changes?.length > 0) {
        setSuccess(`Decision submitted. Domain locked at Level 2 ✓`);
      }
      setDecision('approved');
      setComment('');
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to submit decision');
      setSuccess(null);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    submitDecision();
  };

  if (roundLoading || approversLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!roundData) {
    return <div className="p-4 text-red-600">Round not found</div>;
  }

  // Check for pending changes by current user
  const currentUserId = localStorage.getItem('user_id');
  const currentApprover = approvers?.find((a: Approver) => a.user_id === currentUserId);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Approval Decision</h2>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Round Info */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Round Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Framework:</strong> {roundData.framework_id}</p>
            <p><strong>Domain:</strong> {roundData.domain_id || '(not specified)'}</p>
            <p><strong>Status:</strong> {roundData.status}</p>
          </div>
        </div>

        {/* Approver Roster */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Approver Roster</h3>
          <div className="space-y-2 text-sm">
            {approvers?.map((approver: Approver) => (
              <div key={approver.id} className="flex items-center justify-between">
                <span className="text-gray-700">
                  {approver.user_id === currentUserId ? '(You) ' : ''}{approver.domain_id || 'General'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  approver.decision ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {approver.decision || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Options */}
        <fieldset>
          <legend className="font-semibold mb-3">Your Decision</legend>
          <div className="space-y-3">
            {(['approved', 'changes_requested', 'rejected'] as const).map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="decision"
                  value={option}
                  checked={decision === option}
                  onChange={(e) => setDecision(e.target.value as Decision)}
                  className="w-4 h-4 mr-3"
                  disabled={isSubmitting}
                />
                <span className="text-gray-700 capitalize">
                  {option === 'approved' && '✓ Approve'}
                  {option === 'changes_requested' && '→ Request Changes'}
                  {option === 'rejected' && '✗ Reject'}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Comment */}
        <div>
          <label className="block font-semibold mb-2">Decision Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add any feedback or reasoning for your decision..."
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || roundData.status === 'approved_by_all'}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Decision'}
        </button>

        {roundData.status === 'approved_by_all' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            ✓ All approvers have approved. Domain is locked at Level 2.
          </div>
        )}
      </form>
    </div>
  );
};

export default ApprovalDecisionForm;
