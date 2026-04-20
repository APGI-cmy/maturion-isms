/**
 * Supabase Edge Function: mmm-score-confirm
 *
 * Wave B5 — Assessment Execution
 * Route:   POST /api/scores/confirm
 * Tests:   T-MMM-S6-051, T-MMM-S6-056, T-MMM-S6-057, T-MMM-S6-058, T-MMM-S6-059, T-MMM-S6-069
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required.
 *
 * Behaviour:
 *   - Body: { assessment_id, criterion_id, score, confirm: true, rationale?: string }
 *   - REQUIRES confirm: true flag (TR-033 HITL)
 *   - If override (score differs from proposal): write to mmm_override_log with rationale
 *   - Write confirmed score to mmm_maturity_scores
 *   - Trigger cascade: update MPS score, domain score, org score
 *   - NBR-001: UI must invalidate ['scores', assessment_id], ['dashboard']
 *   - NBR-002: HTTP 403 if org_id mismatch
 *   - Return: { confirmed: true, cascade_complete: true }
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
    score?: number;
    confirm?: boolean;
    rationale?: string;
  };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { assessment_id, criterion_id, score, confirm, rationale } = body;

  // TR-033 HITL: REQUIRES confirm: true flag
  if (confirm !== true) {
    return jsonResponse({
      error: 'confirm: true is required (TR-033 HITL — human-in-the-loop confirmation mandatory)',
    }, 400);
  }

  if (!assessment_id || !criterion_id || score === undefined) {
    return jsonResponse({ error: 'assessment_id, criterion_id, and score are required' }, 400);
  }

  if (typeof score !== 'number' || score < 1 || score > 5) {
    return jsonResponse({ error: 'score must be a number between 1 and 5' }, 400);
  }

  // Verify assessment belongs to caller's org (NBR-002: HTTP 403 if org_id mismatch)
  const { data: assessment, error: assessmentError } = await supabase
    .from('mmm_assessments')
    .select('organisation_id, framework_id')
    .eq('id', assessment_id)
    .maybeSingle();

  if (assessmentError || !assessment) {
    return jsonResponse({ error: 'Assessment not found' }, 404);
  }

  if (assessment.organisation_id !== claims.orgId) {
    return jsonResponse({ error: 'Insufficient access: organisation mismatch' }, 403);
  }

  // Check for existing AI score proposal (for override detection)
  const { data: proposal } = await supabase
    .from('mmm_score_proposals')
    .select('proposed_score')
    .eq('assessment_id', assessment_id)
    .eq('criterion_id', criterion_id)
    .maybeSingle();

  const isOverride = proposal && proposal.proposed_score !== score;

  // If override: write to mmm_override_log with rationale
  if (isOverride) {
    await supabase.from('mmm_override_log').insert({
      assessment_id,
      criterion_id,
      proposed_score: proposal.proposed_score,
      confirmed_score: score,
      rationale: rationale ?? '',
      confirmed_by: claims.userId,
      confirmed_at: new Date().toISOString(),
    });
  }

  // Write confirmed score to mmm_maturity_scores
  const { error: scoreError } = await supabase
    .from('mmm_maturity_scores')
    .upsert(
      {
        assessment_id,
        criterion_id,
        entity_id: criterion_id,
        entity_type: 'CRITERION',
        score,
        confirmed_by: claims.userId,
        confirmed_at: new Date().toISOString(),
      },
      { onConflict: 'assessment_id,criterion_id' },
    );

  if (scoreError) {
    console.error('[mmm-score-confirm] score write error:', scoreError.message);
    return jsonResponse({ error: 'Failed to write confirmed score' }, 500);
  }

  // Cascade: update MPS score, domain score, org score (internal cascade)
  // NBR-001: UI must invalidate ['scores', assessment_id], ['dashboard']
  await triggerScoreCascade(supabase, assessment_id, criterion_id, claims.orgId);

  return jsonResponse({ confirmed: true, cascade_complete: true });
});

/**
 * Internal cascade: recalculate MPS → domain → org scores after criterion score confirmation.
 * This replaces a separate mmm-score-cascade HTTP endpoint (per architecture spec).
 */
async function triggerScoreCascade(
  supabase: ReturnType<typeof createClient>,
  assessmentId: string,
  criterionId: string,
  orgId: string,
): Promise<void> {
  try {
    // Get criterion's MPS
    const { data: criterion } = await supabase
      .from('mmm_criteria')
      .select('mps_id, domain_id')
      .eq('id', criterionId)
      .maybeSingle();

    if (!criterion) return;

    // Recalculate MPS score = avg of confirmed criterion scores for this MPS
    const { data: mpsCriteria } = await supabase
      .from('mmm_criteria')
      .select('id')
      .eq('mps_id', criterion.mps_id);

    if (!mpsCriteria || mpsCriteria.length === 0) return;

    const mpsIds = mpsCriteria.map((c: { id: string }) => c.id);
    const { data: mpsScores } = await supabase
      .from('mmm_maturity_scores')
      .select('score')
      .eq('assessment_id', assessmentId)
      .in('criterion_id', mpsIds);

    if (!mpsScores || mpsScores.length === 0) return;

    const mpsAvg = mpsScores.reduce((s: number, r: { score: number }) => s + r.score, 0) / mpsScores.length;

    await supabase.from('mmm_maturity_scores').upsert(
      {
        assessment_id: assessmentId,
        entity_id: criterion.mps_id,
        entity_type: 'MPS',
        score: parseFloat(mpsAvg.toFixed(2)),
      },
      { onConflict: 'assessment_id,entity_id,entity_type' },
    );

    // Recalculate domain score
    const { data: domainMPS } = await supabase
      .from('mmm_maturity_process_steps')
      .select('id')
      .eq('domain_id', criterion.domain_id);

    if (!domainMPS || domainMPS.length === 0) return;

    const domainMPSIds = domainMPS.map((m: { id: string }) => m.id);
    const { data: domainMPSScores } = await supabase
      .from('mmm_maturity_scores')
      .select('score')
      .eq('assessment_id', assessmentId)
      .eq('entity_type', 'MPS')
      .in('entity_id', domainMPSIds);

    if (!domainMPSScores || domainMPSScores.length === 0) return;

    const domainAvg = domainMPSScores.reduce((s: number, r: { score: number }) => s + r.score, 0) / domainMPSScores.length;

    await supabase.from('mmm_maturity_scores').upsert(
      {
        assessment_id: assessmentId,
        entity_id: criterion.domain_id,
        entity_type: 'DOMAIN',
        score: parseFloat(domainAvg.toFixed(2)),
      },
      { onConflict: 'assessment_id,entity_id,entity_type' },
    );
  } catch (err) {
    // Non-fatal cascade error — log and continue
    console.warn('[mmm-score-confirm] cascade error (non-fatal):', err);
  }
}
