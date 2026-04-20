/**
 * Supabase Edge Function: mmm-ai-explain
 *
 * Wave B7 — Boundary Integrations (live wire)
 * Route:   POST /api/ai/explain
 * Tests:   T-MMM-S6-099, T-MMM-S6-106, T-MMM-S6-107, T-MMM-S6-108
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
 * Behaviour:
 *   - Calls AIMC /api/ai/explain (TR-011–TR-015)
 *   - Authorization: Bearer AIMC_SERVICE_TOKEN (TR-011)
 *   - AbortController timeout 45s + 1 retry (TR-014)
 *   - Circuit breaker (TR-009)
 *   - Records ai_interaction (TR-034, T-MMM-S6-124)
 *   - Return: { explanation, request_id }
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
    subject?: string;
    subject_type?: string;
    criterion_id?: string;
    context?: Record<string, unknown>;
  };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { subject, subject_type, criterion_id, context } = body;

  if (!subject) {
    return jsonResponse({ error: 'subject is required' }, 400);
  }

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  const aimcResult = await callAimc(
    'explain',
    claims.orgId,
    claims.userId,
    {
      subject,
      subject_type: subject_type ?? 'criterion',
      criterion_id: criterion_id ?? null,
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

  // Record ai_interaction (T-MMM-S6-124)
  await supabase.from('mmm_ai_interactions').insert({
    organisation_id: claims.orgId,
    actor_id: claims.userId,
    interaction_type: 'EXPLAIN',
    operation: 'explain',
    aimc_request_id: aimcResult.request_id,
    model_id: aiData.model_id ?? 'aimc-routed',
    model_version: aiData.model_version ?? null,
    confidence: aiData.confidence ?? null,
    created_at: new Date().toISOString(),
  }).catch((err: Error) => console.warn(`[mmm-ai-explain] ai_interactions warn: ${err.message}`));

  return jsonResponse({
    explanation: aiData.explanation ?? aiData.content ?? '',
    request_id: aimcResult.request_id,
  });
});
