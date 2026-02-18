/**
 * Custom hooks for evidence management
 * FRS: FR-013 to FR-020 (Evidence Collection)
 * TRS: TR-049, TR-051, TR-052
 * Task: 5.6.4 (Evidence Collection)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export interface Evidence {
  id: string;
  criterion_id: string;
  type: 'text' | 'photo' | 'audio' | 'video' | 'document' | 'interview';
  content?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  metadata?: any;
  created_at: string;
  created_by: string;
}

export interface EvidenceUploadInput {
  criterionId: string;
  type: Evidence['type'];
  file?: File;
  content?: string;
  metadata?: any;
}

/**
 * Fetch all evidence for a criterion
 */
export function useCriterionEvidence(criterionId: string) {
  return useQuery<Evidence[], Error>({
    queryKey: ['evidence', criterionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evidence')
        .select('*')
        .eq('criterion_id', criterionId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch evidence: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!criterionId,
  });
}

/**
 * Upload evidence (file-based or text)
 */
export function useUploadEvidence() {
  const queryClient = useQueryClient();

  return useMutation<Evidence, Error, EvidenceUploadInput>({
    mutationFn: async ({ criterionId, type, file, content, metadata }) => {
      let filePath: string | undefined;
      let fileName: string | undefined;
      let fileSize: number | undefined;
      let mimeType: string | undefined;

      // Handle file upload if file provided
      if (file) {
        fileName = file.name;
        fileSize = file.size;
        mimeType = file.type;

        // Upload to Supabase Storage
        const storageFolder = type === 'photo' ? 'photos' :
                            type === 'audio' ? 'audio' :
                            type === 'video' ? 'videos' :
                            type === 'document' ? 'documents' :
                            'other';

        const path = `evidence/${criterionId}/${storageFolder}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('audit-documents')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Failed to upload file: ${uploadError.message}`);
        }

        filePath = uploadData.path;
      }

      // Create evidence record in database
      const { data, error } = await supabase
        .from('evidence')
        .insert({
          criterion_id: criterionId,
          type,
          content,
          file_path: filePath,
          file_name: fileName,
          file_size: fileSize,
          mime_type: mimeType,
          metadata,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create evidence record: ${error.message}`);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['evidence', variables.criterionId] });
    },
  });
}

/**
 * Delete evidence
 */
export function useDeleteEvidence() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; criterionId: string; filePath?: string }>({
    mutationFn: async ({ id, filePath }) => {
      // Delete file from storage if it exists
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('audit-documents')
          .remove([filePath]);

        if (storageError) {
          console.warn('Failed to delete file from storage:', storageError);
          // Continue with database deletion even if storage fails
        }
      }

      // Delete evidence record
      const { error } = await supabase
        .from('evidence')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete evidence: ${error.message}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['evidence', variables.criterionId] });
    },
  });
}
