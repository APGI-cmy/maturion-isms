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

/**
 * Fetch criteria tree for an audit (hierarchical: Domain → MPS → Criteria)
 */
export function useCriteriaTree(auditId: string) {
  return useQuery<any[], Error>({
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
