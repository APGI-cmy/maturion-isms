/**
 * Custom hooks for criteria management
 * FRS: FR-004 to FR-009
 * TRS: TR-047, TR-016, TR-028
 * Task: 5.6.3 (Criteria Management CRUD)
 *
 * Wave 15R — T-W15R-UI-001 / T-W15R-UI-004 (ui-builder)
 * Added: useUploadedDocuments hook, useParseStatus terminal-state fixes
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

/** Terminal status values for criteria_documents.status */
const CRITERIA_DOCUMENT_TERMINAL_STATUSES = new Set(['pending_review', 'parse_failed']);

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

export interface UploadedDocumentDetails {
  file_path?: string;
  error?: string;
  domains_inserted?: number;
  mps_inserted?: number;
  criteria_inserted?: number;
  // Index signature required: `details` is a JSONB column and may contain additional arbitrary keys
  // depending on which Edge Function action wrote the row. All defined properties above are typed explicitly.
  [key: string]: unknown;
}

/**
 * Row from audit_logs representing an uploaded criteria document.
 * `action` is 'criteria_upload' (pending), 'criteria_parsed' (success), or 'criteria_parse_failed' (failure).
 */
export interface UploadedDocument {
  id: string;
  file_path: string | null;
  action: string;
  details: UploadedDocumentDetails;
  created_at: string;
  created_by: string | null;
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

      // Write immediate audit_log entry so document appears in UI even if Edge Function fails
      // Failure to write audit_log is non-fatal: upload result still returned
      try {
        await supabase.from('audit_logs').insert({
          audit_id: auditId,
          organisation_id: organisationId,
          action: 'criteria_upload',
          file_path: data.path,
          created_by: user.id,
          details: {
            file_path: data.path,
            file_name: file.name,
            file_size: file.size,
            hash,
          },
        });
      } catch (err) {
        // Non-fatal: audit_log write failure must not block the upload result
        console.warn('[useUploadCriteria] audit_log write failed; document may not appear in list', err);
      }

      return { path: data.path, hash };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['criteria-tree', variables.auditId] });
      queryClient.invalidateQueries({ queryKey: ['uploaded-documents', variables.auditId] });
    },
  });
}

/**
 * Trigger AI parsing for uploaded criteria document
 */
export function useTriggerAIParsing() {
  return useMutation<void, Error, { auditId: string; filePath: string }>({
    mutationFn: async ({ auditId, filePath }) => {
      // Refresh session before invoking Edge Function to ensure Authorization header is valid
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError || !session) {
        throw new Error('Authentication required. Please sign in again.');
      }

      const { data, error } = await supabase.functions.invoke('invoke-ai-parse-criteria', {
        body: { auditId, filePath },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) {
        throw new Error(`Failed to trigger AI parsing: ${error.message}`);
      }

      return data;
    },
  });
}

/**
 * Fetch uploaded criteria documents for an audit from audit_logs.
 *
 * Wave 15R — T-W15R-UI-001 (ui-builder) / T-WUF-API-001 (api-builder)
 * Queries audit_logs filtered by audit_id and action IN ('criteria_upload', 'criteria_parsed', 'criteria_parse_failed').
 * Returns documents ordered by created_at descending, then deduplicated by resource_id/file_path
 * keeping the highest-priority status row per document (criteria_parsed > criteria_parse_failed > criteria_upload).
 */
export function useUploadedDocuments(auditId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<UploadedDocument[], Error>({
    queryKey: ['uploaded-documents', auditId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('id, file_path, action, details, created_at, created_by')
        .eq('audit_id', auditId)
        .in('action', ['criteria_upload', 'criteria_parsed', 'criteria_parse_failed'])
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch uploaded documents: ${error.message}`);
      }

      // Deduplicate by resource_id/file_path using a Map, keeping best-status row per document.
      // Priority: criteria_parsed (3) > criteria_parse_failed (2) > criteria_upload (1)
      const STATUS_PRIORITY: Record<string, number> = {
        criteria_parsed: 3,
        criteria_parse_failed: 2,
        criteria_upload: 1,
      };

      const deduplicationMap = new Map<string, UploadedDocument>();
      for (const row of (data ?? [])) {
        const key = row.details?.file_path ?? row.file_path ?? '';
        const existing = deduplicationMap.get(key);
        if (!existing) {
          deduplicationMap.set(key, row);
        } else {
          const existingPriority = STATUS_PRIORITY[existing.action] ?? 0;
          const rowPriority = STATUS_PRIORITY[row.action] ?? 0;
          if (rowPriority > existingPriority) {
            deduplicationMap.set(key, row);
          }
        }
      }
      const deduplicated = Array.from(deduplicationMap.values());

      return deduplicated as UploadedDocument[];
    },
    enabled: !!auditId,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['uploaded-documents', auditId] });

  return { ...query, invalidate };
}

/**
 * Poll criteria_documents.status for a specific auditId + filePath until terminal state.
 *
 * Hotfix (issue #1019): The Edge Function now returns 202 Accepted immediately and runs
 * the AI parse in the background via EdgeRuntime.waitUntil(). The fast path writes
 * status='processing' to criteria_documents. This hook polls that status column every
 * 3 seconds until it transitions to 'pending_review' (success) or 'parse_failed' (error).
 *
 * Terminal states: 'pending_review', 'parse_failed'
 * Non-terminal: 'processing', 'pending_parse'
 *
 * Invalidates 'uploaded-documents' and 'criteria-tree' queries on terminal state.
 */
export function usePollCriteriaDocumentStatus(
  auditId: string | null,
  filePath: string | null,
) {
  const queryClient = useQueryClient();

  return useQuery<{ status: string }, Error>({
    queryKey: ['criteria-document-status', auditId, filePath],
    queryFn: async () => {
      if (!auditId || !filePath) return { status: 'pending_parse' };

      const { data, error } = await supabase
        .from('criteria_documents')
        .select('status')
        .eq('audit_id', auditId)
        .eq('file_path', filePath)
        .single();

      // No row yet — treat as pre-creation state
      if (error?.code === 'PGRST116') {
        return { status: 'pending_parse' };
      }

      if (error) {
        throw new Error(`Failed to fetch criteria document status: ${error.message}`);
      }

      return { status: data?.status ?? 'pending_parse' };
    },
    enabled: !!auditId && !!filePath,
    // polling: refetch every 3 s until terminal state
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const isTerminal = CRITERIA_DOCUMENT_TERMINAL_STATUSES.has(status ?? '');

      if (isTerminal) {
        // Refresh document list and criteria tree when parse resolves
        if (auditId) {
          queryClient.invalidateQueries({ queryKey: ['uploaded-documents', auditId] });
          queryClient.invalidateQueries({ queryKey: ['criteria-tree', auditId] });
        }
        return false; // stop polling
      }
      return 3000; // poll every 3 seconds
    },
  });
}

/**
 * Poll AI parsing task status until terminal state (completed / failed)
 *
 * Wave 15 — T-W15-IMPL-002 (ui-builder)
 * FR requirement: The UI must reflect parsing progress in real time.
 *
 * Wave 15R — T-W15R-UI-004 (ui-builder)
 * - Returns { status: 'PENDING' } when parse_tasks has no entry yet (handles pre-creation gap)
 * - Terminal states: COMPLETE, FAILED (uppercase) + completed, failed (backward compat)
 * - Invalidates uploaded-documents on terminal state so document list refreshes
 *
 * Uses TanStack Query refetchInterval to poll parse status every 3 seconds
 * until the task reaches a terminal state.
 */
export function useParseStatus(auditId: string | null, taskId: string | null) {
  const queryClient = useQueryClient();

  return useQuery<{ status: string; parse_status?: string; error?: string }, Error>({
    queryKey: ['parse-status', auditId, taskId],
    queryFn: async () => {
      if (!taskId || !auditId) return { status: 'PENDING' };

      const { data, error } = await supabase
        .from('parse_tasks')
        .select('status, error_message, created_at, updated_at')
        .eq('id', taskId)
        .eq('audit_id', auditId)
        .single();

      // No row yet — task is still being created; treat as PENDING
      if (error?.code === 'PGRST116') {
        return { status: 'PENDING' };
      }

      if (error) {
        throw new Error(`Failed to fetch parse status: ${error.message}`);
      }

      const rawStatus = data?.status ?? 'PENDING';

      return {
        status: rawStatus,
        parse_status: rawStatus,
        error: data?.error_message,
      };
    },
    enabled: !!taskId && !!auditId,
    // polling: refetch every 3 s until terminal state
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const isTerminal =
        status === 'COMPLETE' ||
        status === 'FAILED' ||
        status === 'completed' ||
        status === 'failed';

      if (isTerminal) {
        // Refresh document list when parse resolves
        if (auditId) {
          queryClient.invalidateQueries({ queryKey: ['uploaded-documents', auditId] });
        }
        return false; // stop polling
      }
      return 3000; // poll every 3 seconds
    },
  });
}
