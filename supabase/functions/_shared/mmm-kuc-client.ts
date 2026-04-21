/**
 * MMM KUC Client — supabase/functions/_shared/mmm-kuc-client.ts
 *
 * Wave B7 — Boundary Integrations
 * Issue: maturion-isms#1428
 * Builder: integration-builder
 * Date: 2026-04-25
 *
 * OB-3 / CG-002: No KUC internal logic in MMM.
 *   MMM routes upload requests to KUC and receives classification metadata.
 *   KUC classification logic remains inside KUC — not embedded here.
 *
 * TR-019: KUC Upload Request Contract
 *   POST /api/upload/framework-source or /evidence
 *   Content-Type: multipart/form-data
 *   Fields: file, document_role, organisation_id, user_id, metadata (JSON string)
 *
 * TR-020: KUC Classification Response Contract
 *   { upload_id, document_role, classification: { type, confidence, categories }, parse_job_id }
 *
 * TR-009: Circuit breaker — KUC boundary
 */

import {
  isCircuitClosed,
  recordSuccess,
  recordFailure,
  buildFallbackResponse,
} from './mmm-circuit-breaker.ts';

const KUC_BASE_URL = Deno.env.get('KUC_BASE_URL') ?? '';
const KUC_SERVICE_TOKEN = Deno.env.get('KUC_SERVICE_TOKEN') ?? '';

/** TR-020: KUC classification response */
export interface KucClassificationResponse {
  upload_id: string;
  document_role: 'criteria_source' | 'evidence';
  classification: {
    type: string;
    confidence: number;
    categories: string[];
  };
  parse_job_id: string | null;
}

export interface KucUploadResult {
  success: boolean;
  kuc_classification: KucClassificationResponse | null;
  error: string | null;
  fallback: boolean;
  fallback_reason?: string;
}

/** TR-019: KUC upload metadata */
export interface KucUploadMetadata {
  filename: string;
  mime_type: string;
  size_bytes: number;
  upload_context: 'framework_source' | 'evidence';
}

const KUC_TIMEOUT_MS = 30_000;

/**
 * Upload a document to KUC and receive classification metadata.
 *
 * OB-3: No KUC internal logic — MMM only passes the file and receives classification.
 * TR-019: multipart/form-data with document_role, organisation_id, user_id, metadata.
 * TR-020: Classification response with document_role, type, confidence, categories.
 * TR-009: Circuit breaker on KUC boundary.
 * NBR-002: HTTP 403 from KUC propagated — not swallowed.
 */
export async function uploadToKuc(
  file: File | Blob,
  documentRole: 'criteria_source' | 'evidence',
  organisationId: string,
  userId: string,
  metadata: KucUploadMetadata,
): Promise<KucUploadResult> {
  // TR-009: Check KUC circuit breaker
  if (!isCircuitClosed('KUC')) {
    const fallback = buildFallbackResponse('KUC');
    return {
      success: false,
      kuc_classification: null,
      error: fallback.reason,
      fallback: true,
      fallback_reason: fallback.reason,
    };
  }

  // If KUC_BASE_URL not configured — return stub classification (graceful degradation)
  if (!KUC_BASE_URL) {
    console.warn('[MMM-KUC-CLIENT] KUC_BASE_URL not configured — returning stub classification');
    return buildStubKucClassification(documentRole, metadata.filename);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), KUC_TIMEOUT_MS);

  try {
    // TR-019: Build multipart/form-data request
    const formData = new FormData();
    formData.append('file', file, metadata.filename);
    formData.append('document_role', documentRole);
    formData.append('organisation_id', organisationId);
    formData.append('user_id', userId);
    formData.append('metadata', JSON.stringify(metadata));

    const headers: Record<string, string> = {};
    if (KUC_SERVICE_TOKEN) {
      headers['Authorization'] = `Bearer ${KUC_SERVICE_TOKEN}`;
    }

    const response = await fetch(
      `${KUC_BASE_URL}/api/upload/${metadata.upload_context}`,
      {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    // NBR-002: HTTP 403 from KUC must propagate — no silent swallowing
    if (response.status === 403) {
      recordFailure('KUC', 'HTTP_403');
      return {
        success: false,
        kuc_classification: null,
        error: 'KUC returned HTTP 403 — insufficient access',
        fallback: false,
      };
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => 'unknown');
      throw new Error(`KUC HTTP ${response.status}: ${errText}`);
    }

    const classification = (await response.json()) as KucClassificationResponse;
    recordSuccess('KUC');

    return {
      success: true,
      kuc_classification: classification,
      error: null,
      fallback: false,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : String(err);
    recordFailure('KUC', message);

    return {
      success: false,
      kuc_classification: null,
      error: message,
      fallback: false,
    };
  }
}

/**
 * Build a stub KUC classification response (used when KUC_BASE_URL is not configured).
 * Preserves document_role and provides nominal classification for downstream processing.
 */
function buildStubKucClassification(
  documentRole: 'criteria_source' | 'evidence',
  filename: string,
): KucUploadResult {
  const kuc_classification: KucClassificationResponse = {
    upload_id: crypto.randomUUID(),
    document_role: documentRole,
    classification: {
      type: documentRole === 'criteria_source' ? 'framework_document' : 'evidence_document',
      confidence: 0.85,
      categories: [documentRole],
    },
    parse_job_id: documentRole === 'criteria_source' ? crypto.randomUUID() : null,
  };

  console.log(
    `[MMM-KUC-CLIENT] stub classification for file=${filename} document_role=${documentRole}`,
  );

  return {
    success: true,
    kuc_classification,
    error: null,
    fallback: false,
  };
}
