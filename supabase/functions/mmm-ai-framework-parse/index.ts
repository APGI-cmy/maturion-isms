/**
 * Supabase Edge Function: mmm-ai-framework-parse
 *
 * Wave B4 — Framework Lifecycle (stub)
 * Wave B7 — Boundary Integrations (AIMC stub (B7 live wire complete — AIMC_STUB replaced with callAimc consumer boundary))
 * Route:   POST /api/ai/framework-parse
 * Tests:   T-MMM-S6-024, T-MMM-S6-034, T-MMM-S6-099, T-MMM-S6-106, T-MMM-S6-107, T-MMM-S6-108
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
 *   - Calls AIMC /api/ai/framework-parse with operation envelope (TR-012)
 *   - Authorization: Bearer AIMC_SERVICE_TOKEN (TR-011)
 *   - AbortController timeout 60s + 1 retry with 10s backoff (TR-014)
 *   - Circuit breaker on AIMC boundary (TR-009)
 *   - Records ai_interaction for audit trail (TR-034)
 *   - Creates mmm_proposed_domains, mmm_proposed_mps, mmm_proposed_criteria from AIMC response
 *   - Updates mmm_parse_jobs status to 'COMPLETE'
 *   - Return: { proposed_domains: number, parse_job_id, request_id }
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

  let body: { parse_job_id?: string; framework_id?: string; source_text?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { parse_job_id, framework_id, source_text } = body;

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  // Authorization: Bearer AIMC_SERVICE_TOKEN on every call (TR-011)
  const aimcResult = await callAimc(
    'framework-parse',
    claims.orgId,
    claims.userId,
    {
      parse_job_id: parse_job_id ?? null,
      framework_id: framework_id ?? null,
      source_text: source_text ?? null,
    },
  );

  // TR-009: Circuit breaker fallback — return graceful degradation response
  if (aimcResult.fallback) {
    return jsonResponse(
      {
        fallback: true,
        reason: aimcResult.fallback_reason,
        message: 'AI features temporarily unavailable — circuit breaker open',
      },
      503,
    );
  }

  // NBR-002: Non-200 from AIMC propagated as error
  if (!aimcResult.success) {
    console.error(`[mmm-ai-framework-parse] AIMC error: ${aimcResult.error}`);
    return jsonResponse({ error: 'AIMC call failed', detail: aimcResult.error }, 502);
  }

  // Record ai_interaction for audit trail (TR-034, T-MMM-S6-124, T-MMM-S6-128)
  await supabase.from('mmm_ai_interactions').insert({
    organisation_id: claims.orgId,
    actor_id: claims.userId,
    interaction_type: 'FRAMEWORK_PARSE',
    operation: 'framework-parse',
    aimc_request_id: aimcResult.request_id,
    model_id: (aimcResult.data as any)?.model_id ?? 'aimc-routed',
    model_version: (aimcResult.data as any)?.model_version ?? null,
    confidence: (aimcResult.data as any)?.confidence ?? null,
    created_at: new Date().toISOString(),
  }).catch((err: Error) => {
    console.warn(`[mmm-ai-framework-parse] ai_interactions insert warn: ${err.message}`);
  });

  // Extract proposed structure from AIMC response (TR-012 data envelope)
  const aiData = (aimcResult.data as any) ?? {};
  const proposedDomains: Array<{
    name: string;
    description: string;
    mps?: Array<{ name: string; description: string; criteria?: Array<{ name: string; description: string; maturity_level: number }> }>;
  }> = aiData.proposed_domains ?? [];

  let domainCount = 0;

  // Persist AIMC-proposed structure to MMM tables
  for (let di = 0; di < proposedDomains.length; di++) {
    const domain = proposedDomains[di];

    const { data: proposedDomain, error: domError } = await supabase
      .from('mmm_proposed_domains')
      .insert({
        framework_id: framework_id ?? null,
        parse_job_id: parse_job_id ?? null,
        name: domain.name,
        description: domain.description,
        position: di + 1,
        source: 'AIMC_LIVE',
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

  // Update parse job status to 'COMPLETE'
  if (parse_job_id) {
    await supabase
      .from('mmm_parse_jobs')
      .update({
        status: 'COMPLETE',
        completed_at: new Date().toISOString(),
        aimc_request_id: aimcResult.request_id,
      })
      .eq('id', parse_job_id);
  }

  return jsonResponse({
    proposed_domains: domainCount,
    parse_job_id: parse_job_id ?? null,
    request_id: aimcResult.request_id,
  });
});
