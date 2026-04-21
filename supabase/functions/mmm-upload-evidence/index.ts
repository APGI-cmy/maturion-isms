/**
 * Supabase Edge Function: mmm-upload-evidence
 *
 * Wave B5 — Assessment Execution (stub)
 * Wave B7 — Boundary Integrations (B7 KUC LIVE WIRE COMPLETE)
 * Route:   POST /api/upload/evidence
 * Tests:   T-MMM-S6-052, T-MMM-S6-062, T-MMM-S6-102, T-MMM-S6-104, T-MMM-S6-112
 * Issue:   maturion-isms#1428
 * Builder: integration-builder (B7 live wire)
 * Date:    2026-04-25
 *
 * JWT required.
 *
 * Stub replaced with live KUC wiring in B7.
 * OB-3 / CG-002: No KUC internal logic in MMM — MMM routes to KUC and receives classification.
 * KUC_BASE_URL: Deno.env.get('KUC_BASE_URL') — optional (KUC within AIMC scope)
 *
 * TR-019: KUC Upload Request Contract
 *   document_role: 'evidence'
 *   multipart/form-data with file, document_role, organisation_id, user_id, metadata
 *
 * TR-020: KUC Classification Response Contract
 *   kuc_classification: { upload_id, document_role, classification: { type, confidence, categories }, parse_job_id }
 *
 * T-MMM-S6-104: document_role = 'evidence' on all evidence uploads.
 * T-MMM-S6-102: kuc_classification returned in response.
 * TR-009: Circuit breaker on KUC boundary.
 * NBR-001: UI must invalidate ['evidence', criterion_id]
 * Return: { evidence_id, score_proposal, kuc_classification, document_role }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';
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

  // T-MMM-S6-104: document_role = 'evidence' for all evidence uploads
  const documentRole = 'evidence' as const;

  // Accept both multipart and JSON bodies
  const contentType = req.headers.get('content-type') ?? '';
  let fileBlob: Blob | null = null;
  let bodyData: Record<string, unknown> = {};

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      const file = formData.get('file');
      if (file && typeof file === 'object' && 'name' in file) {
        fileBlob = file as File;
      }
      // Extract JSON fields from form
      const fields = ['assessment_id', 'criterion_id', 'type', 'content', 'metadata'];
      for (const field of fields) {
        const val = formData.get(field);
        if (val) bodyData[field] = typeof val === 'string' ? val : (val as File).name;
      }
    } catch {
      bodyData = {};
    }
  } else {
    try {
      bodyData = await req.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }
  }

  const { assessment_id, criterion_id, type, content } = bodyData as {
    assessment_id?: string;
    criterion_id?: string;
    type?: string;
    content?: string;
  };

  if (!assessment_id || !criterion_id) {
    return jsonResponse({ error: 'assessment_id and criterion_id are required' }, 400);
  }

  // Validate evidence type
  const evidenceType = type ?? 'TEXT';
  if (!['FILE', 'URL', 'TEXT', 'INTEGRATION'].includes(evidenceType)) {
    return jsonResponse({ error: 'type must be FILE, URL, TEXT, or INTEGRATION' }, 400);
  }

  // TR-019/TR-020: Route file upload through KUC if file present
  // OB-3: No KUC internal logic
  let kucResult = null;
  if (fileBlob) {
    const filename = (fileBlob as File).name || 'evidence.bin';
    kucResult = await uploadToKuc(
      fileBlob,
      documentRole,
      claims.orgId,
      claims.userId,
      {
        filename,
        mime_type: (fileBlob as File).type || 'application/octet-stream',
        size_bytes: (fileBlob as File).size || 0,
        upload_context: 'evidence',
      },
    );

    if (!kucResult.success && !kucResult.fallback) {
      return jsonResponse({ error: 'KUC upload failed', detail: kucResult.error }, 502);
    }
  }

  // Create mmm_evidence record (status='PENDING')
  const { data: evidence, error: evidenceError } = await supabase
    .from('mmm_evidence')
    .insert({
      assessment_id,
      criterion_id,
      type: evidenceType,
      content: content ?? null,
      status: 'PENDING',
      submitted_by: claims.userId,
      organisation_id: claims.orgId,
      document_role: documentRole,
      kuc_upload_id: kucResult?.kuc_classification?.upload_id ?? null,
      kuc_classification: kucResult?.kuc_classification?.classification ?? null,
    })
    .select()
    .single();

  if (evidenceError || !evidence) {
    console.error('[mmm-upload-evidence] evidence insert error:', evidenceError?.message);
    return jsonResponse({ error: 'Failed to upload evidence' }, 500);
  }

  // Create score_proposals record (T-MMM-S6-122: NOT auto-applied — human confirmation required)
  const kucConfidence = kucResult?.kuc_classification?.classification?.confidence ?? 0.5;
  const { error: proposalError } = await supabase.from('mmm_score_proposals').insert({
    assessment_id,
    criterion_id,
    evidence_id: evidence.id,
    proposed_score: 3, // Placeholder — AIMC will refine via /api/ai/evidence-evaluate
    confidence: kucConfidence,
    rationale: 'Evidence submitted — AIMC evaluation pending',
    status: 'PENDING',
  });

  if (proposalError) {
    console.warn('[mmm-upload-evidence] score proposal insert error:', proposalError.message);
  }

  // NBR-001: UI must invalidate ['evidence', criterion_id]
  // T-MMM-S6-102: kuc_classification returned in response
  return jsonResponse(
    {
      evidence_id: evidence.id,
      document_role: documentRole,
      score_proposal: { proposed_score: 3 },
      kuc_classification: kucResult?.kuc_classification ?? null,
    },
    201,
  );
});
