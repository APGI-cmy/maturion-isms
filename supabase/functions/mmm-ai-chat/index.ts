/**
 * Supabase Edge Function: mmm-ai-chat
 *
 * Wave B7 — Boundary Integrations (live wire)
 * Route:   POST /api/ai/chat
 * Tests:   T-MMM-S6-099, T-MMM-S6-106, T-MMM-S6-107, T-MMM-S6-125, T-MMM-S6-127
 * Issue:   maturion-isms#1428
 * Builder: integration-builder (B7)
 * Date:    2026-04-25
 *
 * JWT required + ADMIN role (T-MMM-S6-125: Admin AI Chat Accessible to Admin Role Only).
 *
 * OB-1 / CG-002: Consumer boundary only — no direct LLM calls.
 * AIMC_BASE_URL: Deno.env.get('AIMC_BASE_URL') — provisioned via SB-003
 * AIMC_SERVICE_TOKEN: Deno.env.get('AIMC_SERVICE_TOKEN') — provisioned via SB-003
 *
 * T-MMM-S6-127: Back-office AI chat (admin route) — separated from end-user AI chat.
 * Admin AI chat route: /api/ai/chat (admin scope)
 *
 * Behaviour:
 *   - Calls AIMC /api/ai/chat (TR-011–TR-015)
 *   - Authorization: Bearer AIMC_SERVICE_TOKEN (TR-011)
 *   - AbortController timeout 45s + 1 retry (TR-014)
 *   - Circuit breaker (TR-009)
 *   - Records ai_interaction (TR-034, T-MMM-S6-124, T-MMM-S6-128)
 *   - Return: { reply, request_id }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';
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

  // T-MMM-S6-125: Admin AI Chat Accessible to Admin Role Only (NBR-002)
  try {
    requireRole(claims.role, ['ADMIN']);
  } catch (response) {
    return response as Response;
  }

  let body: {
    message?: string;
    conversation_id?: string;
    context?: Record<string, unknown>;
  };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { message, conversation_id, context } = body;

  if (!message) {
    return jsonResponse({ error: 'message is required' }, 400);
  }

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  const aimcResult = await callAimc(
    'chat',
    claims.orgId,
    claims.userId,
    {
      message,
      conversation_id: conversation_id ?? null,
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

  // Record ai_interaction (T-MMM-S6-124, T-MMM-S6-128)
  await supabase.from('mmm_ai_interactions').insert({
    organisation_id: claims.orgId,
    actor_id: claims.userId,
    interaction_type: 'CHAT',
    operation: 'chat',
    aimc_request_id: aimcResult.request_id,
    model_id: aiData.model_id ?? 'aimc-routed',
    model_version: aiData.model_version ?? null,
    confidence: aiData.confidence ?? null,
    created_at: new Date().toISOString(),
  }).catch((err: Error) => console.warn(`[mmm-ai-chat] ai_interactions warn: ${err.message}`));

  return jsonResponse({
    reply: aiData.reply ?? aiData.message ?? aiData.content ?? '',
    request_id: aimcResult.request_id,
  });
});
