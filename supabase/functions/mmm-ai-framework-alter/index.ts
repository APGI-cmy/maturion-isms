/**
 * Supabase Edge Function: mmm-ai-framework-alter
 *
 * Wave B4 — Framework Lifecycle (stub)
 * Wave B7 — Boundary Integrations (AIMC_STUB — B7 LIVE WIRE COMPLETE)
 * Route:   POST /api/ai/framework-alter
 * Tests:   T-MMM-S6-026, T-MMM-S6-099, T-MMM-S6-106, T-MMM-S6-107, T-MMM-S6-108
 * Issue:   maturion-isms#1428
 * Builder: integration-builder (B7 live wire)
 * Date:    2026-04-25
 *
 * JWT required + ADMIN role.
 *
 * AIMC_STUB — B7 LIVE WIRE COMPLETE.
 * OB-1 / CG-002: Consumer boundary only — no direct LLM calls.
 * AIMC_BASE_URL: Deno.env.get('AIMC_BASE_URL') — provisioned via SB-003
 *
 * Behaviour (B7 live):
 *   - Calls AIMC /api/ai/framework-alter (TR-011–TR-015)
 *   - Authorization: Bearer AIMC_SERVICE_TOKEN (TR-011)
 *   - AbortController timeout 60s + 1 retry (TR-014)
 *   - Circuit breaker (TR-009)
 *   - Records ai_interaction (TR-034)
 *   - Applies AIMC-proposed alterations to proposed domains/MPS/criteria
 *   - Return: { updated: true, request_id }
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

  try {
    requireRole(claims.role, ['ADMIN']);
  } catch (response) {
    return response as Response;
  }

  let body: {
    framework_id?: string;
    alteration_request?: string;
    domain_updates?: { id: string; name?: string; description?: string }[];
    mps_updates?: { id: string; name?: string; description?: string }[];
    criteria_updates?: { id: string; name?: string; description?: string; maturity_level?: number }[];
  };

  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { framework_id, alteration_request, domain_updates = [], mps_updates = [], criteria_updates = [] } = body;

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  const aimcResult = await callAimc(
    'framework-alter',
    claims.orgId,
    claims.userId,
    {
      framework_id: framework_id ?? null,
      alteration_request: alteration_request ?? null,
      domain_updates,
      mps_updates,
      criteria_updates,
    },
  );

  if (aimcResult.fallback) {
    return jsonResponse({ fallback: true, reason: aimcResult.fallback_reason, message: 'AI features temporarily unavailable' }, 503);
  }

  if (!aimcResult.success) {
    return jsonResponse({ error: 'AIMC call failed', detail: aimcResult.error }, 502);
  }

  // Record ai_interaction (TR-034)
  await supabase.from('mmm_ai_interactions').insert({
    organisation_id: claims.orgId,
    actor_id: claims.userId,
    interaction_type: 'FRAMEWORK_ALTER',
    operation: 'framework-alter',
    aimc_request_id: aimcResult.request_id,
    model_id: (aimcResult.data as any)?.model_id ?? 'aimc-routed',
    model_version: (aimcResult.data as any)?.model_version ?? null,
    confidence: (aimcResult.data as any)?.confidence ?? null,
    created_at: new Date().toISOString(),
  }).catch((err: Error) => console.warn(`[mmm-ai-framework-alter] ai_interactions warn: ${err.message}`));

  // Apply AIMC-recommended alterations
  const aiData = (aimcResult.data as any) ?? {};
  const resolvedDomainUpdates = aiData.domain_updates ?? domain_updates;
  const resolvedMpsUpdates = aiData.mps_updates ?? mps_updates;
  const resolvedCriteriaUpdates = aiData.criteria_updates ?? criteria_updates;

  for (const update of resolvedDomainUpdates) {
    const { id, ...fields } = update;
    await supabase.from('mmm_proposed_domains').update(fields).eq('id', id);
  }

  for (const update of resolvedMpsUpdates) {
    const { id, ...fields } = update;
    await supabase.from('mmm_proposed_mps').update(fields).eq('id', id);
  }

  for (const update of resolvedCriteriaUpdates) {
    const { id, ...fields } = update;
    await supabase.from('mmm_proposed_criteria').update(fields).eq('id', id);
  }

  return jsonResponse({ updated: true, request_id: aimcResult.request_id });
});
