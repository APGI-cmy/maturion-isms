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

      // Upload to Supabase Storage
      const filePath = `criteria/${auditId}/${Date.now()}-${file.name}`;
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
 * Fetch a single criterion by ID from Supabase
 * FRS: FR-011 (Criteria Modal — real data)
 * TRS: TR-047
 */
export function useCriterion(criterionId: string) {
  return useQuery<Criterion, Error>({
    queryKey: ['criterion', criterionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('criteria')
        .select('*')
        .eq('id', criterionId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch criterion: ${error.message}`);
      }

      return data as Criterion;
    },
    enabled: !!criterionId,
  });
}

/**
 * Approve or reject a criterion (updates status in Supabase)
 * FRS: FR-008 (Human Approval)
 * TRS: TR-012, TR-047
 */
export function useApproveCriterion() {
  const queryClient = useQueryClient();

  return useMutation<Criterion, Error, { criterionId: string; approved: boolean }>({
    mutationFn: async ({ criterionId, approved }) => {
      const newStatus = approved ? 'approved' : 'rejected';
      const { data, error } = await supabase
        .from('criteria')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', criterionId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to ${newStatus} criterion: ${error.message}`);
      }

      return data as Criterion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['criterion', data.id] });
      queryClient.invalidateQueries({ queryKey: ['criteria-tree', data.audit_id] });
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
