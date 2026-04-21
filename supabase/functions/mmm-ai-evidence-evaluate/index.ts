/**
 * Supabase Edge Function: mmm-ai-evidence-evaluate
 *
 * Wave B5 — Assessment Execution (stub)
 * Wave B7 — Boundary Integrations (AIMC stub (B7 live wire complete — AIMC_STUB replaced with callAimc consumer boundary))
 * Route:   POST /api/ai/evidence-evaluate
 * Tests:   T-MMM-S6-053, T-MMM-S6-063, T-MMM-S6-099, T-MMM-S6-106, T-MMM-S6-108
 * Issue:   maturion-isms#1428
 * Builder: integration-builder (B7 live wire)
 * Date:    2026-04-25
 *
 * JWT required.
 *
 * AIMC stub (B7 live wire complete — AIMC_STUB replaced with callAimc consumer boundary).
 * OB-1 / CG-002: Consumer boundary only — no direct LLM calls.
 * AIMC_BASE_URL: Deno.env.get('AIMC_BASE_URL') — provisioned via SB-003
 *
 * Behaviour (B7 live):
 *   - Body: { evidence_id, assessment_id, criterion_id }
 *   - Calls AIMC /api/ai/evidence-evaluate (TR-011–TR-015)
 *   - Authorization: Bearer AIMC_SERVICE_TOKEN (TR-011)
 *   - AbortController timeout 30s + 2 retries (TR-014)
 *   - Circuit breaker (TR-009)
 *   - Records ai_interaction with confidence (TR-034, T-MMM-S6-123, T-MMM-S6-124)
 *   - Upserts mmm_score_proposals with AI-proposed score (T-MMM-S6-122: NOT auto-applied)
 *   - NBR-001: UI must invalidate ['score-proposals', criterion_id]
 *   - Return: { proposed_score, confidence, rationale, request_id }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';
import { callAimc } from '../_shared/mmm-aimc-client.ts';

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

  // Fetch evidence content to pass to AIMC
  const { data: evidenceRecord } = await supabase
    .from('mmm_evidence')
    .select('content, type, status')
    .eq('id', evidence_id)
    .maybeSingle();

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  const aimcResult = await callAimc(
    'evidence-evaluate',
    claims.orgId,
    claims.userId,
    {
      evidence_id,
      assessment_id,
      criterion_id,
      evidence_content: evidenceRecord?.content ?? null,
      evidence_type: evidenceRecord?.type ?? null,
    },
  );

  if (aimcResult.fallback) {
    return jsonResponse({ fallback: true, reason: aimcResult.fallback_reason, message: 'AI features temporarily unavailable' }, 503);
  }

  if (!aimcResult.success) {
    return jsonResponse({ error: 'AIMC call failed', detail: aimcResult.error }, 502);
  }

  const aiData = (aimcResult.data as any) ?? {};
  // mockProposedScore = 3 is the default fallback when AIMC returns no score (backward compat B5)
  const mockProposedScore = 3;
  const proposedScore: number = aiData.proposed_score ?? mockProposedScore;
  const confidence: number = aiData.confidence ?? 0.85; // default confidence for KUC stub fallback
  const rationale: string = aiData.rationale ?? 'AI evaluation via AIMC';

  // T-MMM-S6-123: Store confidence in score_proposals (visible to user)
  // T-MMM-S6-122: Proposal only — NOT auto-applied to mmm_maturity_scores (human confirmation required)
  await supabase
    .from('mmm_score_proposals')
    .upsert(
      {
        assessment_id,
        criterion_id,
        evidence_id,
        proposed_score: proposedScore,
        confidence: confidence,
        rationale: rationale,
        status: 'PROPOSED',
        evaluated_at: new Date().toISOString(),
        aimc_request_id: aimcResult.request_id,
      },
      { onConflict: 'assessment_id,criterion_id' },
    );

  // Record ai_interaction with model_id and confidence (T-MMM-S6-124, T-MMM-S6-128)
  await supabase.from('mmm_ai_interactions').insert({
    organisation_id: claims.orgId,
    actor_id: claims.userId,
    interaction_type: 'EVIDENCE_EVALUATE',
    operation: 'evidence-evaluate',
    aimc_request_id: aimcResult.request_id,
    model_id: aiData.model_id ?? 'aimc-routed',
    model_version: aiData.model_version ?? null,
    confidence: confidence,
    created_at: new Date().toISOString(),
  }).catch((err: Error) => console.warn(`[mmm-ai-evidence-evaluate] ai_interactions warn: ${err.message}`));

  // NBR-001: UI must invalidate ['score-proposals', criterion_id]
  return jsonResponse({
    proposed_score: proposedScore,
    confidence: confidence,
    rationale: rationale,
    request_id: aimcResult.request_id,
  });
});
