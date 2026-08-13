import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ProposedChange } from '../components/approval/ProposeChangeModal';

interface SubmitProposedChangesResponse {
  changes_count: number;
  notification_event_id: string;
}

/**
 * Hook to submit proposed changes for Level 2 approval
 * Calls the mmm-approval-proposed-changes-submit Edge Function
 */
export function useSubmitProposedChanges() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitChanges = async (params: {
    approvalRoundId: string;
    approverId: string;
    changes: ProposedChange[];
  }): Promise<SubmitProposedChangesResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!params.changes || params.changes.length === 0) {
        throw new Error('No changes to submit');
      }

      const { data, error: functionError } = await supabase.functions.invoke(
        'mmm-approval-proposed-changes-submit',
        {
          body: {
            approval_round_id: params.approvalRoundId,
            approver_id: params.approverId,
            changes: params.changes.map((change) => ({
              object_type: change.objectType,
              object_id: change.objectId,
              field_name: change.fieldName,
              display_reference: change.displayReference,
              original_value: change.originalValue,
              proposed_value: change.proposedValue,
              comment: change.comment,
            })),
          },
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!data) {
        throw new Error('No response from proposed changes submission');
      }

      return data as SubmitProposedChangesResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit proposed changes';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitChanges, isLoading, error };
}

export default useSubmitProposedChanges;
