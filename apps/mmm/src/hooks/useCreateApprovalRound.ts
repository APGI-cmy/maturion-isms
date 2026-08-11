import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Approver {
  fullName: string;
  email: string;
  approvalLevel: 'level_2' | 'level_3';
  designation: string;
}

interface CreateApprovalRoundResponse {
  approval_round_id: string;
  approver_ids: string[];
  notification_event_ids: string[];
}

/**
 * Hook to create an approval round and invite Level 2/3 approvers
 * Calls the mmm-approval-round-create Edge Function
 */
export function useCreateApprovalRound() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRound = async (
    params: {
      domainId: string;
      frameworkId: string;
      organisationId: string;
      approvers: Approver[];
      inviteMessage?: string;
      dueDate?: Date;
    }
  ): Promise<CreateApprovalRoundResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'mmm-approval-round-create',
        {
          body: {
            domain_id: params.domainId,
            framework_id: params.frameworkId,
            organisation_id: params.organisationId,
            approval_level: 'level_2',
            approvers: params.approvers,
            invite_message: params.inviteMessage,
            due_date: params.dueDate?.toISOString(),
          },
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!data) {
        throw new Error('No response from approval round creation');
      }

      return data as CreateApprovalRoundResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create approval round';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createRound, isLoading, error };
}

export default useCreateApprovalRound;
