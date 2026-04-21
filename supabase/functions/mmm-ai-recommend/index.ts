/**
 * Supabase Edge Function: mmm-ai-recommend
 *
 * Wave B6 — Findings & Reporting (stub)
 * Wave B7 — Boundary Integrations (AIMC stub (B7 live wire complete — AIMC_STUB replaced with callAimc consumer boundary))
 * Route:   POST /api/ai/recommend
 * Tests:   T-MMM-S6-083, T-MMM-S6-097, T-MMM-S6-099, T-MMM-S6-106, T-MMM-S6-108
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
 *   - Body: { assessment_id }
 *   - Calls AIMC /api/ai/recommend (TR-011–TR-015)
 *   - Authorization: Bearer AIMC_SERVICE_TOKEN (TR-011)
 *   - AbortController timeout 30s + 2 retries (TR-014)
 *   - Circuit breaker (TR-009)
 *   - Records ai_interaction (TR-034)
 *   - Return: { recommendations: [...], request_id }
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

  let body: { assessment_id?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { assessment_id } = body;

  if (!assessment_id) {
    return jsonResponse({ error: 'assessment_id is required' }, 400);
  }

  // Fetch maturity scores to provide context to AIMC
  const { data: scores } = await supabase
    .from('mmm_maturity_scores')
    .select('entity_type, entity_id, score')
    .eq('assessment_id', assessment_id);

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  const aimcResult = await callAimc(
    'recommend',
    claims.orgId,
    claims.userId,
    {
      assessment_id,
      maturity_scores: scores ?? [],
    },
  );

  if (aimcResult.fallback) {
    return jsonResponse({ fallback: true, reason: aimcResult.fallback_reason, message: 'AI features temporarily unavailable' }, 503);
  }

  if (!aimcResult.success) {
    return jsonResponse({ error: 'AIMC call failed', detail: aimcResult.error }, 502);
  }

  const aiData = (aimcResult.data as any) ?? {};
  // Recommendations structure (B6 backward compat): domain, gap_to_next, recommendation_text fields
  const recommendations = (aiData.recommendations ?? []).map((r: any) => ({
    ...r,
    domain: r.domain ?? null,
    gap_to_next: r.gap_to_next ?? null,
    recommendation_text: r.recommendation_text ?? r.text ?? '',
  }));

  // Record ai_interaction (TR-034, T-MMM-S6-124)
  await supabase.from('mmm_ai_interactions').insert({
    organisation_id: claims.orgId,
    actor_id: claims.userId,
    interaction_type: 'RECOMMEND',
    operation: 'recommend',
    aimc_request_id: aimcResult.request_id,
    model_id: aiData.model_id ?? 'aimc-routed',
    model_version: aiData.model_version ?? null,
    confidence: aiData.confidence ?? null,
    created_at: new Date().toISOString(),
  }).catch((err: Error) => console.warn(`[mmm-ai-recommend] ai_interactions warn: ${err.message}`));

  return jsonResponse({ recommendations, request_id: aimcResult.request_id });
});
