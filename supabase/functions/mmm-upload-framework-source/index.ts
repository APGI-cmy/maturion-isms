/**
 * Supabase Edge Function: mmm-upload-framework-source
 *
 * Wave B4 — Framework Lifecycle (stub)
 * Wave B7 — Boundary Integrations (B7 KUC LIVE WIRE COMPLETE)
 * Route:   POST /api/upload/framework-source
 * Tests:   T-MMM-S6-023, T-MMM-S6-038, T-MMM-S6-102, T-MMM-S6-103, T-MMM-S6-112
 * Issue:   maturion-isms#1428
 * Builder: integration-builder (B7 live wire)
 * Date:    2026-04-25
 *
 * JWT required + ADMIN role.
 * The full framework lifecycle (init → upload → parse → compile → publish) is ADMIN-only.
 * ADMIN required here to align with mmm-ai-framework-parse (which also requires ADMIN),
 * preventing a role mismatch where a non-admin upload creates a parse job that the parser
 * then rejects (403), leaving the job permanently in PENDING/FAILED.
 * See architecture §A4.2 (ADMIN-only framework operations).
 *
 * Stub replaced with live KUC wiring in B7.
 * OB-3 / CG-002: No KUC internal logic in MMM — MMM routes to KUC and receives classification.
 * KUC_BASE_URL: Deno.env.get('KUC_BASE_URL') — optional (KUC within AIMC scope)
 *
 * TR-006: file upload SLA ≤ 30s — enforced via AbortController timeout.
 *
 * TR-019: KUC Upload Request Contract
 *   document_role: 'criteria_source'
 *   multipart/form-data with file, document_role, organisation_id, user_id, metadata
 *
 * TR-020: KUC Classification Response Contract
 *   kuc_classification: { upload_id, document_role, classification: { type, confidence, categories }, parse_job_id }
 *
 * T-MMM-S6-103: document_role = 'criteria_source' on all framework-source uploads.
 * T-MMM-S6-102: kuc_classification returned in response.
 * TR-009: Circuit breaker on KUC boundary.
 * NBR-001: UI must invalidate ['parse-jobs']
 * Return: { parse_job_id, status: 'PENDING', kuc_classification, document_role }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';
import { uploadToKuc } from '../_shared/mmm-kuc-client.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'Service configuration error' }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let claims: { userId: string; orgId: string; role: string };
  try {
    claims = await validateJWT(req, supabase);
  } catch (response) {
    return response as Response;
  }

  // Auth policy: ADMIN role required.
  // The full framework lifecycle (init → upload → parse → compile → publish) is ADMIN-only.
  // This aligns with mmm-framework-init, mmm-ai-framework-parse, mmm-framework-compile,
  // and mmm-framework-publish which all require ADMIN.
  // Enforcing ADMIN here prevents a role mismatch where a non-admin upload would
  // successfully create a parse job but then fail the parse trigger (403 from
  // mmm-ai-framework-parse), leaving the parse job stuck in PENDING/FAILED.
  try {
    requireRole(claims.role, ['ADMIN']);
  } catch (response) {
    return response as Response;
  }

  // TR-019: Accept multipart or JSON
  let fileBlob: Blob | null = null;
  let metadata: Record<string, unknown> = {};
  const contentType = req.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      const file = formData.get('file');
      if (file && typeof file === 'object' && 'name' in file) {
        fileBlob = file as File;
        metadata = {
          filename: (file as File).name,
          mime_type: (file as File).type || 'application/octet-stream',
          size_bytes: (file as File).size,
          upload_context: 'framework_source',
        };
      }
      const metaRaw = formData.get('metadata');
      if (metaRaw && typeof metaRaw === 'string') {
        try { Object.assign(metadata, JSON.parse(metaRaw)); } catch { /* ignore */ }
      }
    } catch {
      metadata = {};
    }
  } else {
    try {
      metadata = await req.json();
      metadata.upload_context = 'framework_source';
    } catch {
      metadata = { upload_context: 'framework_source' };
    }
  }

  // TR-019: document_role must be 'criteria_source' for framework-source uploads
  // T-MMM-S6-103: Framework-Source Ingestion Uses criteria_source document_role
  const documentRole = 'criteria_source' as const;

  // TR-019/TR-020: Route through KUC and receive classification
  // OB-3: No KUC internal logic — MMM only passes file and reads classification
  let kucResult = null;
  if (fileBlob) {
    kucResult = await uploadToKuc(
      fileBlob,
      documentRole,
      claims.orgId,
      claims.userId,
      {
        filename: (metadata.filename as string) || 'framework-source.bin',
        mime_type: (metadata.mime_type as string) || 'application/octet-stream',
        size_bytes: (metadata.size_bytes as number) || 0,
        upload_context: 'framework_source',
      },
    );

    // TR-020: Validate KUC classification response (T-MMM-S6-112)
    if (!kucResult.success && !kucResult.fallback) {
      return jsonResponse({ error: 'KUC upload failed', detail: kucResult.error }, 502);
    }
  }

  // Create mmm_parse_jobs record (status='PENDING')
  // Schema columns: id, upload_id, document_id, status, result_json, created_at, updated_at
  // + migration 20260429000001: organisation_id, created_by, source_type
  // + migration 20260510000001: framework_id (first-class link — not only in result_json)
  const rawFrameworkId = metadata.framework_id as string | undefined;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const frameworkIdForJob = rawFrameworkId && UUID_RE.test(rawFrameworkId) ? rawFrameworkId : null;

  const { data: parseJob, error: jobError } = await supabase
    .from('mmm_parse_jobs')
    .insert({
      organisation_id: claims.orgId,
      created_by: claims.userId,
      framework_id: frameworkIdForJob,
      status: 'PENDING',
      source_type: (metadata.source_type as string) ?? 'VERBATIM',
      result_json: {
        document_role: documentRole,
        kuc_upload_id: kucResult?.kuc_classification?.upload_id ?? null,
        kuc_parse_job_id: kucResult?.kuc_classification?.parse_job_id ?? null,
        upload_metadata: metadata,
      },
    })
    .select()
    .single();

  if (jobError || !parseJob) {
    console.error('[mmm-upload-framework-source] parse job insert error:', jobError?.message);
    return jsonResponse({ error: 'Failed to create parse job' }, 500);
  }

  // Fire-and-forget: invoke mmm-ai-framework-parse to convert the uploaded document into
  // proposed domains/MPS/criteria. This is the functional bridge for Mode A.
  // The parse function updates the parse job from PENDING → PROCESSING → COMPLETE/FAILED.
  // If the trigger itself fails (network error or non-2xx), the parse job is updated to FAILED
  // so the review page polling does not hang indefinitely.
  if (frameworkIdForJob) {
    const authHeader = req.headers.get('Authorization') ?? '';
    const parseUrl = `${SUPABASE_URL}/functions/v1/mmm-ai-framework-parse`;
    const parseJobId = parseJob.id;
    fetch(parseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({
        parse_job_id: parseJobId,
        framework_id: frameworkIdForJob,
      }),
    }).then(async (res: Response) => {
      if (!res.ok) {
        console.warn(`[mmm-upload-framework-source] mmm-ai-framework-parse returned HTTP ${res.status} for parse_job ${parseJobId}`);
        await supabase
          .from('mmm_parse_jobs')
          .update({ status: 'FAILED', result_json: { error_type: 'parse_trigger_failed', http_status: res.status } })
          .eq('id', parseJobId);
      }
    }).catch(async (err: Error) => {
      console.warn(`[mmm-upload-framework-source] Failed to trigger mmm-ai-framework-parse: ${err.message}`);
      await supabase
        .from('mmm_parse_jobs')
        .update({ status: 'FAILED', result_json: { error_type: 'parse_trigger_network_error', message: err.message } })
        .eq('id', parseJobId);
    });
  }

  // NBR-001: UI must invalidate ['parse-jobs']
  // T-MMM-S6-102: kuc_classification returned in response
  return jsonResponse(
    {
      parse_job_id: parseJob.id,
      status: 'PENDING',
      document_role: documentRole,
      kuc_classification: kucResult?.kuc_classification ?? null,
    },
    201,
  );
});
