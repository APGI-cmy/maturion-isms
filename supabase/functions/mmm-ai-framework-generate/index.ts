/**
 * Supabase Edge Function: mmm-ai-framework-generate
 *
 * Wave B4 — Framework Lifecycle (stub)
 * Wave B7 — Boundary Integrations (AIMC stub (B7 live wire complete — AIMC_STUB replaced with callAimc consumer boundary))
 * Route:   POST /api/ai/framework-generate
 * Tests:   T-MMM-S6-025, T-MMM-S6-099, T-MMM-S6-106, T-MMM-S6-107, T-MMM-S6-108
 * Issue:   maturion-isms#1428
 * Builder: integration-builder (B7 live wire)
 * Date:    2026-04-25
 *
 * JWT required + ADMIN role.
 *
 * AIMC stub (B7 live wire complete — AIMC_STUB replaced with callAimc consumer boundary).
 * OB-1 / CG-002: Consumer boundary only — no direct LLM calls.
 * AIMC_BASE_URL: Deno.env.get('AIMC_BASE_URL') — provisioned via SB-003
 * AIMC_SERVICE_TOKEN: Deno.env.get('AIMC_SERVICE_TOKEN') — provisioned via SB-003
 *
 * Behaviour (B7 live):
 *   - Calls AIMC /api/ai/framework-generate (TR-011–TR-015)
 *   - Authorization: Bearer AIMC_SERVICE_TOKEN (TR-011)
 *   - AbortController timeout 90s + 1 retry (TR-014)
 *   - Circuit breaker (TR-009)
 *   - Records ai_interaction (TR-034)
 *   - Creates mmm_proposed_domains structure from AIMC response
 *   - Return: { proposed_domains: number, request_id }
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

  let body: { name?: string; framework_id?: string; hybrid?: boolean; context?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { framework_id, name, context } = body;

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  const aimcResult = await callAimc(
    'framework-generate',
    claims.orgId,
    claims.userId,
    { framework_id: framework_id ?? null, name: name ?? null, ...(context ?? {}) },
  );

  if (aimcResult.fallback) {
    return jsonResponse({ fallback: true, reason: aimcResult.fallback_reason, message: 'AI features temporarily unavailable' }, 503);
  }

  if (!aimcResult.success) {
    return jsonResponse({ error: 'AIMC call failed', detail: aimcResult.error }, 502);
  }

  // Record ai_interaction (TR-034, T-MMM-S6-124)
  await supabase.from('mmm_ai_interactions').insert({
    organisation_id: claims.orgId,
    actor_id: claims.userId,
    interaction_type: 'FRAMEWORK_GENERATE',
    operation: 'framework-generate',
    aimc_request_id: aimcResult.request_id,
    model_id: (aimcResult.data as any)?.model_id ?? 'aimc-routed',
    model_version: (aimcResult.data as any)?.model_version ?? null,
    confidence: (aimcResult.data as any)?.confidence ?? null,
    created_at: new Date().toISOString(),
  }).catch((err: Error) => console.warn(`[mmm-ai-framework-generate] ai_interactions warn: ${err.message}`));

  const aiData = (aimcResult.data as any) ?? {};
  const proposedDomains: Array<{
    name: string;
    description: string;
    mps?: Array<{ name: string; description: string; criteria?: Array<{ name: string; description: string; maturity_level: number }> }>;
  }> = aiData.proposed_domains ?? [];

  let domainCount = 0;

  for (let di = 0; di < proposedDomains.length; di++) {
    const domain = proposedDomains[di];

    const { data: proposedDomain, error: domError } = await supabase
      .from('mmm_proposed_domains')
      .insert({
        framework_id: framework_id ?? null,
        name: domain.name,
        description: domain.description,
        position: di + 1,
        source: 'AIMC_GENERATE_LIVE',
        aimc_request_id: aimcResult.request_id,
      })
      .select()
      .single();

    if (domError || !proposedDomain) continue;
    domainCount++;

    for (let mi = 0; mi < (domain.mps ?? []).length; mi++) {
      const mps = (domain.mps ?? [])[mi];
      const { data: proposedMPS } = await supabase
        .from('mmm_proposed_mps')
        .insert({
          framework_id: framework_id ?? null,
          proposed_domain_id: proposedDomain.id,
          name: mps.name,
          description: mps.description,
          position: mi + 1,
        })
        .select()
        .single();

      if (!proposedMPS) continue;

      for (let ci = 0; ci < (mps.criteria ?? []).length; ci++) {
        const crit = (mps.criteria ?? [])[ci];
        await supabase.from('mmm_proposed_criteria').insert({
          framework_id: framework_id ?? null,
          proposed_mps_id: proposedMPS.id,
          name: crit.name,
          description: crit.description,
          maturity_level: crit.maturity_level,
          position: ci + 1,
        });
      }
    }
  }

  return jsonResponse({ proposed_domains: domainCount, request_id: aimcResult.request_id });
});

