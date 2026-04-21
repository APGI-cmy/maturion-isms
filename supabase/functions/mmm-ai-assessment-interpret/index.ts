/**
 * Supabase Edge Function: mmm-ai-assessment-interpret
 *
 * Wave B7 — Boundary Integrations (live wire)
 * Route:   POST /api/ai/assessment-interpret
 * Tests:   T-MMM-S6-099, T-MMM-S6-106, T-MMM-S6-107, T-MMM-S6-108, T-MMM-S6-122
 * Issue:   maturion-isms#1428
 * Builder: integration-builder (B7)
 * Date:    2026-04-25
 *
 * JWT required.
 *
 * OB-1 / CG-002: Consumer boundary only — no direct LLM calls.
 * AIMC_BASE_URL: Deno.env.get('AIMC_BASE_URL') — provisioned via SB-003
 * AIMC_SERVICE_TOKEN: Deno.env.get('AIMC_SERVICE_TOKEN') — provisioned via SB-003
 *
 * T-MMM-S6-122: No auto-accept — interpretation is advisory only.
 * Interpretation results are stored as proposals, NOT applied to mmm_maturity_scores.
 *
 * Behaviour:
 *   - Calls AIMC /api/ai/assessment-interpret (TR-011–TR-015)
 *   - Authorization: Bearer AIMC_SERVICE_TOKEN (TR-011)
 *   - AbortController timeout 60s + 1 retry (TR-014)
 *   - Circuit breaker (TR-009)
 *   - Records ai_interaction (TR-034, T-MMM-S6-124)
 *   - Return: { interpretation, confidence, request_id }
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
    assessment_id?: string;
    session_token?: string;
    domain_responses?: unknown[];
    context?: Record<string, unknown>;
  };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { assessment_id, session_token, domain_responses, context } = body;

  if (!assessment_id && !session_token) {
    return jsonResponse({ error: 'assessment_id or session_token is required' }, 400);
  }

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  const aimcResult = await callAimc(
    'assessment-interpret',
    claims.orgId,
    claims.userId,
    {
      assessment_id: assessment_id ?? null,
      session_token: session_token ?? null,
      domain_responses: domain_responses ?? [],
      ...(context ?? {}),
    },
  );

  if (aimcResult.fallback) {
    return jsonResponse({ fallback: true, reason: aimcResult.fallback_reason, message: 'AI features temporarily unavailable' }, 503);
  }

  if (!aimcResult.success) {
    return jsonResponse({ error: 'AIMC call failed', detail: aimcResult.error }, 502);
  }

  const aiData = (aimcResult.data as any) ?? {};
  const confidence: number = aiData.confidence ?? 0.75;
  const interpretation: string = aiData.interpretation ?? aiData.content ?? '';

  // Record ai_interaction (T-MMM-S6-124)
  await supabase.from('mmm_ai_interactions').insert({
    organisation_id: claims.orgId,
    actor_id: claims.userId,
    interaction_type: 'ASSESSMENT_INTERPRET',
    operation: 'assessment-interpret',
    aimc_request_id: aimcResult.request_id,
    model_id: aiData.model_id ?? 'aimc-routed',
    model_version: aiData.model_version ?? null,
    confidence: confidence,
    created_at: new Date().toISOString(),
  }).catch((err: Error) => console.warn(`[mmm-ai-assessment-interpret] ai_interactions warn: ${err.message}`));

  // T-MMM-S6-122: Interpretation is advisory only — NOT auto-applied to maturity_scores
  return jsonResponse({
    interpretation,
    confidence,
    request_id: aimcResult.request_id,
  });
});
