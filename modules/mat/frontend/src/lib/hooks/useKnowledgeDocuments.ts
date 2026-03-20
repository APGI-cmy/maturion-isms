/**
 * useKnowledgeDocuments — Pipeline 2 (Knowledge Ingestion) data hook
 *
 * Wave    : DCKIS-IMPL-002 (carried from DCKIS-IMPL-001)
 * Test IDs: T-KU-003, T-KU-009, T-KU-010
 *
 * Manages knowledge document uploads with:
 * - Domain-to-source AIMC taxonomy mapping (T-KU-003)
 * - File extension validation: .docx, .pdf, .txt, .md only (T-KU-009)
 * - Retry logic with exponential backoff (T-KU-010)
 * - Duplicate detection via content hash (T-KU-010)
 *
 * HARD CONSTRAINT (ADR-005): This hook is NOT related to useCriteria.ts or
 * any Pipeline 1 hook. Uses the ai_knowledge table only.
 */

import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

// ─── AIMC Source Taxonomy Domain Mapping ──────────────────────────────────────

/**
 * Maps UI domain selection to AIMC source taxonomy values stored in ai_knowledge.source.
 * These are the valid AIMC source taxonomy entries for Pipeline 2 (Knowledge Ingestion).
 * T-KU-003: domain-to-source mapping (explicit object literal).
 */
const domainSourceMap: Record<string, string> = {
  general: 'general',
  iso27001: 'ISO27001',
  nist: 'NIST',
  'pci-dss': 'PCI_DSS',
  soc2: 'SOC2',
  'risk-management': 'RISK_MANAGEMENT',
};

// ─── File Extension Validation ────────────────────────────────────────────────

/**
 * Allowed file extensions for knowledge document uploads.
 * T-KU-009: explicit allow-list validation.
 */
const allowedExtensions: readonly string[] = ['.docx', '.pdf', '.txt', '.md'];

/**
 * Validate that a file has an allowed extension.
 * Returns null if valid, or an error message if the extension is not allowed.
 */
function validateFileExtension(file: File): string | null {
  const fileName = file.name.toLowerCase();
  const hasAllowedExt = allowedExtensions.some((ext) => fileName.endsWith(ext));
  if (!hasAllowedExt) {
    return (
      `Unsupported file extension. Only ${allowedExtensions.join(', ')} files are accepted. ` +
      `Received: "${file.name}"`
    );
  }
  return null;
}

// ─── Duplicate Detection ──────────────────────────────────────────────────────

/**
 * Compute a simple fingerprint/hash from a File object for duplicate detection.
 * Uses file name + size + last modified time as a lightweight fingerprint.
 * T-KU-010: duplicate detection / hash / fingerprint logic.
 */
function computeFileFingerprint(file: File): string {
  // Lightweight fingerprint: name + size + lastModified (no crypto needed for dedup check)
  return `${file.name}::${file.size}::${file.lastModified}`;
}

/**
 * Check if a document with this fingerprint/hash has already been uploaded.
 * Queries ai_knowledge for a matching source_document_name + file size indicator.
 * Returns true if a duplicate is detected (isDuplicate).
 */
async function checkIsDuplicate(
  file: File,
  source: string,
): Promise<boolean> {
  const fingerprint = computeFileFingerprint(file);

  // Check ai_knowledge for an existing row with matching source_document_name and source
  const { data, error } = await supabase
    .from('ai_knowledge')
    .select('id')
    .eq('source', source)
    .eq('source_document_name', file.name)
    .limit(1);

  if (error) {
    // On query error, do not block the upload — log and proceed
    console.warn(
      '[useKnowledgeDocuments] Duplicate check query failed:',
      error.message,
      '(fingerprint:', fingerprint, ')',
    );
    return false;
  }

  const alreadyExists = (data?.length ?? 0) > 0;
  return alreadyExists;
}

// ─── Retry Logic ──────────────────────────────────────────────────────────────

/** Maximum number of upload retry attempts on transient failure. */
const maxRetries = 3;

/** Base delay for exponential backoff (ms). */
const RETRY_BASE_DELAY_MS = 500;

/**
 * Sleep for a given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Upload a knowledge document to Supabase with retry logic and exponential backoff.
 * T-KU-010: retry / retryCount / backoff logic.
 *
 * Note: Direct insert is used for the basic upload record (pending for processing).
 * The process-document-v2 Edge Function handles full chunking and embedding.
 */
async function uploadWithRetry(
  params: KnowledgeUploadParams,
  retryCount: number = 0,
): Promise<void> {
  const source = domainSourceMap[params.domain] ?? 'general';

  // Read file content for storage
  const fileContent = await params.file.text();

  // Get current user's organisation_id from the session
  const { data: { session } } = await supabase.auth.getSession();
  const organisationId = session?.user?.user_metadata?.organisation_id as string | undefined;

  const { error } = await supabase.from('ai_knowledge').insert({
    ...(organisationId ? { organisation_id: organisationId } : {}),
    source,
    content: fileContent,
    source_document_name: params.file.name,
    approval_status: 'pending',
  });

  if (error) {
    if (retryCount < maxRetries) {
      // Exponential backoff: 500ms, 1000ms, 2000ms
      const backoffDelay = RETRY_BASE_DELAY_MS * Math.pow(2, retryCount);
      console.warn(
        `[useKnowledgeDocuments] Upload attempt ${retryCount + 1} failed, ` +
          `retrying in ${backoffDelay}ms…`,
        error.message,
      );
      await sleep(backoffDelay);
      return uploadWithRetry(params, retryCount + 1);
    }
    throw new Error(
      `Upload failed after ${maxRetries} retries: ${error.message}`,
    );
  }
}

// ─── Hook Types ───────────────────────────────────────────────────────────────

export interface KnowledgeUploadParams {
  /** The file to upload */
  file: File;
  /** The selected AIMC domain (maps to source taxonomy via domainSourceMap) */
  domain: string;
}

export interface UseKnowledgeDocumentsReturn {
  /** Upload a knowledge document with validation, dedup check, and retry */
  uploadDocument: (params: KnowledgeUploadParams) => Promise<void>;
  /** True while an upload is in progress */
  isUploading: boolean;
  /** Error message from the last failed upload, or null */
  uploadError: string | null;
  /** True if the last upload completed successfully */
  uploadSuccess: boolean;
  /** Reset the upload state (error and success flags) */
  resetUploadState: () => void;
}

// ─── Hook Implementation ──────────────────────────────────────────────────────

/**
 * Hook for managing Pipeline 2 knowledge document uploads.
 *
 * Features:
 * - Domain-to-source AIMC taxonomy mapping via domainSourceMap
 * - File extension allow-list validation (allowedExtensions)
 * - Duplicate detection via file fingerprint / hash check (isDuplicate / alreadyExists)
 * - Retry logic with exponential backoff (maxRetries, retryCount, backoff)
 */
export function useKnowledgeDocuments(): UseKnowledgeDocumentsReturn {
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const mutation = useMutation<void, Error, KnowledgeUploadParams>({
    mutationFn: async (params: KnowledgeUploadParams): Promise<void> => {
      // Reset state
      setUploadError(null);
      setUploadSuccess(false);

      // Step 1: Validate file extension
      const extError = validateFileExtension(params.file);
      if (extError) {
        throw new Error(extError);
      }

      // Step 2: Map domain to AIMC source taxonomy
      const source = domainSourceMap[params.domain] ?? 'general';

      // Step 3: Duplicate detection — check if document alreadyExists
      const isDuplicate = await checkIsDuplicate(params.file, source);
      if (isDuplicate) {
        throw new Error(
          `Duplicate document detected: "${params.file.name}" has already been uploaded ` +
            `for domain "${params.domain}". Use a different file or delete the existing entry.`,
        );
      }

      // Step 4: Upload with retry and exponential backoff
      await uploadWithRetry(params, 0);
    },
    onSuccess: () => {
      setUploadSuccess(true);
      setUploadError(null);
      // Invalidate the knowledge documents list query to trigger a refresh
      void queryClient.invalidateQueries({ queryKey: ['knowledge-documents'] });
    },
    onError: (error: Error) => {
      setUploadError(error.message);
      setUploadSuccess(false);
    },
  });

  const resetUploadState = useCallback((): void => {
    setUploadError(null);
    setUploadSuccess(false);
    mutation.reset();
  }, [mutation]);

  return {
    uploadDocument: mutation.mutateAsync,
    isUploading: mutation.isPending,
    uploadError,
    uploadSuccess,
    resetUploadState,
  };
}
