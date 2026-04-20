/**
 * Supabase Edge Function: mmm-ai-evidence-evaluate
 *
 * Wave B5 — Assessment Execution
 * Route:   POST /api/ai/evidence-evaluate
 * Tests:   T-MMM-S6-053, T-MMM-S6-063
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required.
 *
 * AIMC stub (B5): returns mock evaluation result.
 *
 * Behaviour:
 *   - Body: { evidence_id, assessment_id, criterion_id }
 *   - Updates mmm_score_proposals with AI proposal
 *   - NBR-001: UI must invalidate ['score-proposals', criterion_id]
 *   - Return: { proposed_score: 3, confidence: 0.85, rationale: 'Stub evaluation' }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
// AIMC_BASE_URL: will be wired to Deno.env.get('AIMC_BASE_URL') in B7

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
    evidence_id?: string;
    assessment_id?: string;
    criterion_id?: string;
  };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { evidence_id, assessment_id, criterion_id } = body;

  if (!evidence_id || !assessment_id || !criterion_id) {
    return jsonResponse({ error: 'evidence_id, assessment_id, and criterion_id are required' }, 400);
  }

  // AIMC stub: mock evaluation result
  const mockProposedScore = 3;
  const mockConfidence = 0.85;
  const mockRationale = 'Stub evaluation — AIMC integration pending (B7)';

  // Update mmm_score_proposals with AI proposal
  await supabase
    .from('mmm_score_proposals')
    .upsert(
      {
        assessment_id,
        criterion_id,
        evidence_id,
        proposed_score: mockProposedScore,
        confidence: mockConfidence,
        rationale: mockRationale,
        status: 'PROPOSED',
        evaluated_at: new Date().toISOString(),
      },
      { onConflict: 'assessment_id,criterion_id' },
    );

  // NBR-001: UI must invalidate ['score-proposals', criterion_id]
  return jsonResponse({
    proposed_score: mockProposedScore,
    confidence: mockConfidence,
    rationale: mockRationale,
  });
});
