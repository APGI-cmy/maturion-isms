/**
 * Supabase Edge Function: mmm-upload-evidence
 *
 * Wave B5 — Assessment Execution
 * Route:   POST /api/upload/evidence
 * Tests:   T-MMM-S6-052, T-MMM-S6-062
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required.
 *
 * Stub in B5 (live KUC wire in B7).
 *
 * Behaviour:
 *   - Body: { assessment_id, criterion_id, type: 'FILE'|'URL'|'TEXT', content: string }
 *   - Create mmm_evidence record (status='PENDING')
 *   - Create stub mmm_score_proposals record
 *   - NBR-001: UI must invalidate ['evidence', criterion_id]
 *   - Return: { evidence_id, score_proposal: { proposed_score: 3 } }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

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

  let body: {
    assessment_id?: string;
    criterion_id?: string;
    type?: string;
    content?: string;
  };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { assessment_id, criterion_id, type, content } = body;

  if (!assessment_id || !criterion_id || !type || !content) {
    return jsonResponse({ error: 'assessment_id, criterion_id, type, and content are required' }, 400);
  }

  if (!['FILE', 'URL', 'TEXT'].includes(type)) {
    return jsonResponse({ error: 'type must be FILE, URL, or TEXT' }, 400);
  }

  // Create mmm_evidence record (status='PENDING')
  const { data: evidence, error: evidenceError } = await supabase
    .from('mmm_evidence')
    .insert({
      assessment_id,
      criterion_id,
      type,
      content,
      status: 'PENDING',
      submitted_by: claims.userId,
      organisation_id: claims.orgId,
    })
    .select()
    .single();

  if (evidenceError || !evidence) {
    console.error('[mmm-upload-evidence] evidence insert error:', evidenceError?.message);
    return jsonResponse({ error: 'Failed to upload evidence' }, 500);
  }

  // Create stub mmm_score_proposals record (B5 stub — live AI evaluation in B7)
  const { error: proposalError } = await supabase.from('mmm_score_proposals').insert({
    assessment_id,
    criterion_id,
    evidence_id: evidence.id,
    proposed_score: 3, // Stub default
    confidence: 0.5,
    rationale: 'Stub proposal — AI evaluation pending (B7)',
    status: 'PENDING',
  });

  if (proposalError) {
    console.warn('[mmm-upload-evidence] score proposal insert error:', proposalError.message);
  }

  // NBR-001: UI must invalidate ['evidence', criterion_id]
  return jsonResponse({
    evidence_id: evidence.id,
    score_proposal: { proposed_score: 3 },
  }, 201);
});
