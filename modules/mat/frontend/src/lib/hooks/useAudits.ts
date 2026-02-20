/**
 * Custom hooks for audit CRUD operations
 * FRS: FR-001 (Create Audit), FR-002 (Audit Listing), FR-003 (Audit Deletion)
 * TRS: TR-047 (Audit Management UI), TR-016 (Supabase Integration)
 * Task: 5.6.2 (Audit Management CRUD)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export interface Audit {
  id: string;
  organisation_id: string;
  title: string;
  organisation_name: string;
  facility_location?: string;
  audit_lead_id?: string;
  audit_period_start?: string;
  audit_period_end?: string;
  status: 'not_started' | 'in_progress' | 'under_review' | 'completed' | 'archived';
  criteria_approved: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateAuditInput {
  title: string;
  organisation_name: string;
  facility_location?: string;
  audit_lead_id?: string;
  audit_period_start?: string;
  audit_period_end?: string;
}

/**
 * Fetch all audits (excluding soft-deleted)
 */
export function useAudits() {
  return useQuery<Audit[], Error>({
    queryKey: ['audits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch audits: ${error.message}`);
      }

      return data || [];
    },
  });
}

/**
 * Fetch single audit by ID
 */
export function useAudit(id: string) {
  return useQuery<Audit, Error>({
    queryKey: ['audit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(`Failed to fetch audit: ${error.message}`);
      }

      return data;
    },
    enabled: !!id,
  });
}

/**
 * Create new audit
 */
export function useCreateAudit() {
  const queryClient = useQueryClient();

  return useMutation<Audit, Error, CreateAuditInput>({
    mutationFn: async (input) => {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // TODO: Get organisation_id from user profile
      // For now, using a placeholder
      const organisation_id = user.user_metadata?.organisation_id || '00000000-0000-0000-0000-000000000000';

      const { data, error } = await supabase
        .from('audits')
        .insert({
          ...input,
          organisation_id,
          created_by: user.id,
          status: 'not_started',
          criteria_approved: false,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create audit: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate audits cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      queryClient.invalidateQueries({ queryKey: ['audit-metrics'] });
    },
  });
}

/**
 * Update existing audit
 */
export function useUpdateAudit() {
  const queryClient = useQueryClient();

  return useMutation<Audit, Error, { id: string; updates: Partial<CreateAuditInput> }>({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('audits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update audit: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      queryClient.invalidateQueries({ queryKey: ['audit', data.id] });
      queryClient.invalidateQueries({ queryKey: ['audit-metrics'] });
    },
  });
}

/**
 * Delete audit (soft delete)
 */
export function useDeleteAudit() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('audits')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete audit: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      queryClient.invalidateQueries({ queryKey: ['audit-metrics'] });
    },
  });
}
