import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface SubmitApprovalDecisionResponse {
  approval_round_id: string;
  decision: 'approved' | 'changes_requested' | 'declined';
  status: string;
  notification_event_id: string;
  audit_event_id: string;
}

/**
 * Hook to submit approval decision for Level 2 approver
 * Calls the mmm-approval-decision-submit Edge Function
 */
export function useSubmitApprovalDecision() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitDecision = async (params: {
    approvalRoundId: string;
    approverId: string;
    decision: 'approved' | 'changes_requested' | 'declined';
    comment?: string;
  }): Promise<SubmitApprovalDecisionResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!params.approvalRoundId) {
        throw new Error('Approval round ID is required');
      }

      if (!params.approverId) {
        throw new Error('Approver ID is required');
      }

      if (!params.decision || !['approved', 'changes_requested', 'declined'].includes(params.decision)) {
        throw new Error('Decision must be "approved", "changes_requested", or "declined"');
      }

      const { data, error: functionError } = await supabase.functions.invoke(
        'mmm-approval-decision-submit',
        {
          body: {
            approval_round_id: params.approvalRoundId,
            approver_id: params.approverId,
            decision: params.decision,
            decision_comment: params.comment,
          },
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!data) {
        throw new Error('No response from approval decision submission');
      }

      return data as SubmitApprovalDecisionResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit approval decision';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitDecision, isLoading, error };
}

export default useSubmitApprovalDecision;
