/**
 * Custom hooks for criteria management
 * FRS: FR-004 to FR-009
 * TRS: TR-047, TR-016, TR-028
 * Task: 5.6.3 (Criteria Management CRUD)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export interface Criterion {
  id: string;
  audit_id: string;
  mps_id: string;
  number: string;
  title: string;
  name?: string;
  description?: string;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CriteriaUploadInput {
  auditId: string;
  file: File;
}

export interface MiniPerformanceStandard {
  id: string;
  domain_id: string;
  number: string;
  name: string;
  title?: string;
  sort_order: number;
  criteria?: Criterion[];
}

export interface Domain {
  id: string;
  audit_id: string;
  name: string;
  title?: string;
  sort_order: number;
  mini_performance_standards?: MiniPerformanceStandard[];
}

/**
 * Fetch criteria tree for an audit (hierarchical: Domain → MPS → Criteria)
 */
export function useCriteriaTree(auditId: string) {
  return useQuery<Domain[], Error>({
    queryKey: ['criteria-tree', auditId],
    queryFn: async () => {
      // Fetch domains with nested MPS and criteria
      const { data: domains, error: domainsError } = await supabase
        .from('domains')
        .select(`
          *,
          mini_performance_standards (
            *,
            criteria (*)
          )
        `)
        .eq('audit_id', auditId)
        .order('sort_order', { ascending: true });

      if (domainsError) {
        throw new Error(`Failed to fetch criteria tree: ${domainsError.message}`);
      }

      return domains || [];
    },
    enabled: !!auditId,
  });
}

/**
 * Upload criteria document to Supabase Storage
 */
export function useUploadCriteria() {
  const queryClient = useQueryClient();

  return useMutation<{ path: string; hash: string }, Error, CriteriaUploadInput>({
    mutationFn: async ({ auditId, file }) => {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only PDF, DOCX, and XLSX files are allowed.');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit.');
      }

      // Compute SHA-256 hash
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Fetch authenticated user and their organisation_id (required for RLS-compliant storage paths)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required to import criteria');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organisation_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw new Error(`Failed to fetch user profile: ${profileError.message}`);
      if (!profile?.organisation_id) {
        throw new Error('Your account is not linked to an organisation.');
      }
      const organisationId = profile.organisation_id;

      // Upload to Supabase Storage
      // Path must start with organisationId to satisfy RLS: split_part(name, '/', 1) = organisation_id
      const filePath = `${organisationId}/criteria/${auditId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('audit-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      return { path: data.path, hash };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['criteria-tree', variables.auditId] });
    },
  });
}

/**
 * Trigger AI parsing for uploaded criteria document
 */
export function useTriggerAIParsing() {
  return useMutation<void, Error, { auditId: string; filePath: string }>({
    mutationFn: async ({ auditId, filePath }) => {
      // Call Edge Function to trigger AI parsing
      const { data, error } = await supabase.functions.invoke('invoke-ai-parse-criteria', {
        body: { auditId, filePath }
      });

      if (error) {
        throw new Error(`Failed to trigger AI parsing: ${error.message}`);
      }

      return data;
    },
  });
}

/**
 * Poll AI parsing task status until terminal state (completed / failed)
 *
 * Wave 15 — T-W15-IMPL-002 (ui-builder)
 * FR requirement: The UI must reflect parsing progress in real time.
 *
 * Uses TanStack Query refetchInterval to poll parse status every 3 seconds
 * until the task reaches "completed" or "failed" terminal state.
 */
export function useParseStatus(auditId: string | null, taskId: string | null) {
  return useQuery<{ status: string; parse_status?: string; error?: string }, Error>({
    queryKey: ['parse-status', auditId, taskId],
    queryFn: async () => {
      if (!taskId || !auditId) return { status: 'idle' };

      const { data, error } = await supabase
        .from('parse_tasks')
        .select('status, error_message, created_at, updated_at')
        .eq('id', taskId)
        .eq('audit_id', auditId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch parse status: ${error.message}`);
      }

      return {
        status: data?.status ?? 'unknown',
        parse_status: data?.status,
        error: data?.error_message,
      };
    },
    enabled: !!taskId && !!auditId,
    // polling: refetch every 3 s until terminal state
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') {
        return false; // stop polling at terminal state
      }
      return 3000; // poll every 3 seconds
    },
  });
}
