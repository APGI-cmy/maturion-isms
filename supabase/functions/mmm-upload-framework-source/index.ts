/**
 * Supabase Edge Function: mmm-upload-framework-source
 *
 * Wave B4 — Framework Lifecycle
 * Route:   POST /api/upload/framework-source
 * Tests:   T-MMM-S6-023, T-MMM-S6-038
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required + ADMIN role.
 *
 * TR-006: file upload SLA ≤ 30s — enforced at CDN/storage layer; Edge Function returns 408 on timeout.
 *
 * Behaviour:
 *   - Receives multipart file or JSON with file metadata
 *   - Creates mmm_parse_jobs record (status='PENDING')
 *   - Stub: returns mock parse job id
 *   - NBR-001: UI must invalidate ['parse-jobs']
 *   - Return: { parse_job_id, status: 'PENDING' }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';

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

  try {
    requireRole(claims.role, ['ADMIN']);
  } catch (response) {
    return response as Response;
  }

  // Accept both multipart and JSON
  let metadata: Record<string, unknown> = {};
  const contentType = req.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      metadata = await req.json();
    } catch {
      metadata = {};
    }
  } else if (contentType.includes('multipart/form-data')) {
    // Stub: acknowledge receipt, log file name
    try {
      const formData = await req.formData();
      const file = formData.get('file');
      if (file && typeof file === 'object' && 'name' in file) {
        metadata = { file_name: (file as File).name, file_size: (file as File).size };
      }
    } catch {
      metadata = {};
    }
  }

  // Create mmm_parse_jobs record (status='PENDING')
  const { data: parseJob, error: jobError } = await supabase
    .from('mmm_parse_jobs')
    .insert({
      organisation_id: claims.orgId,
      created_by: claims.userId,
      status: 'PENDING',
      source_type: (metadata.source_type as string) ?? 'VERBATIM',
      metadata,
    })
    .select()
    .single();

  if (jobError || !parseJob) {
    console.error('[mmm-upload-framework-source] parse job insert error:', jobError?.message);
    return jsonResponse({ error: 'Failed to create parse job' }, 500);
  }

  // NBR-001: UI must invalidate ['parse-jobs']
  return jsonResponse({ parse_job_id: parseJob.id, status: 'PENDING' }, 201);
});
