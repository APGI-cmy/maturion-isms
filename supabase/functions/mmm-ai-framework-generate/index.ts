/**
 * Supabase Edge Function: mmm-ai-framework-generate
 *
 * Wave B4 — Framework Lifecycle (stub)
 * Wave B7 — Boundary Integrations (AIMC stub (B7 live wire complete — AIMC_STUB replaced with callAimc consumer boundary))
 * Capability: mmm-ai-framework-generate (Supabase Edge Function invoke)
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
 *   - Calls AIMC framework-generate operation (TR-011–TR-015)
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

/** Derive a DB-safe code slug from a name if the AI response omits the 'code' field. */
function toCode(n: string, idx: number): string {
  const slug = n.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 20);
  return slug || `ITEM_${idx + 1}`;
}

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

  if (!framework_id || typeof framework_id !== 'string') {
    return jsonResponse({ error: 'framework_id is required and must be a string' }, 400);
  }

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  const aimcResult = await callAimc(
    'framework-generate',
    claims.orgId,
    claims.userId,
    { framework_id, name: name ?? null, ...(context ?? {}) },
  );

  if (aimcResult.fallback) {
    return jsonResponse({ fallback: true, reason: aimcResult.fallback_reason, message: 'AI features temporarily unavailable' }, 503);
  }

  if (!aimcResult.success) {
    return jsonResponse({ error: 'AIMC call failed', detail: aimcResult.error }, 502);
  }

  // Record ai_interaction (TR-034, T-MMM-S6-124)
  // Columns: actor_id, action_type, context_type, target_entity_id, status, request_json, response_json
  await supabase.from('mmm_ai_interactions').insert({
    actor_id: claims.userId,
    action_type: 'FRAMEWORK_GENERATE',
    context_type: 'framework',
    target_entity_id: framework_id,
    status: 'completed',
    request_json: { framework_id, name: name ?? null, ...(context ?? {}) },
    response_json: (aimcResult.data as Record<string, unknown>) ?? null,
  }).catch((err: Error) => console.warn(`[mmm-ai-framework-generate] ai_interactions warn: ${err.message}`));

  const aiData = (aimcResult.data as any) ?? {};
  const proposedDomains: Array<{
    name: string;
    code?: string;
    mps?: Array<{
      name: string;
      code?: string;
      description?: string;
      intent_statement?: string;
      criteria?: Array<{ name: string; code?: string; description?: string; maturity_level?: number }>;
    }>;
  }> = aiData.proposed_domains ?? [];

  // Derive a code slug from a name if the AI response omits it
  // (moved to module scope — see toCode() above)

  let domainCount = 0;

  for (let di = 0; di < proposedDomains.length; di++) {
    const domain = proposedDomains[di];

    // mmm_proposed_domains: framework_id, name, code, sort_order, source ('AI'|'HUMAN')
    const { data: proposedDomain, error: domError } = await supabase
      .from('mmm_proposed_domains')
      .insert({
        framework_id,
        name: domain.name,
        code: domain.code ?? toCode(domain.name, di),
        sort_order: di + 1,
        source: 'AI',
      })
      .select()
      .single();

    if (domError || !proposedDomain) continue;
    domainCount++;

    for (let mi = 0; mi < (domain.mps ?? []).length; mi++) {
      const mps = (domain.mps ?? [])[mi];

      // mmm_proposed_mps: proposed_domain_id, name, code, sort_order, intent_statement, source
      const { data: proposedMPS } = await supabase
        .from('mmm_proposed_mps')
        .insert({
          proposed_domain_id: proposedDomain.id,
          name: mps.name,
          code: mps.code ?? toCode(mps.name, mi),
          sort_order: mi + 1,
          // intent_statement: prefer AIMC 'intent_statement'; fall back to 'description' if AIMC uses that field name
          intent_statement: mps.intent_statement ?? mps.description ?? null,
          source: 'AI',
        })
        .select()
        .single();

      if (!proposedMPS) continue;

      for (let ci = 0; ci < (mps.criteria ?? []).length; ci++) {
        const crit = (mps.criteria ?? [])[ci];

        // mmm_proposed_criteria: proposed_mps_id, name, code, sort_order, maturity_level_target, source
        await supabase.from('mmm_proposed_criteria').insert({
          proposed_mps_id: proposedMPS.id,
          name: crit.name,
          code: crit.code ?? toCode(crit.name, ci),
          sort_order: ci + 1,
          maturity_level_target: crit.maturity_level ?? null,
          source: 'AI',
        });
      }
    }
  }

  return jsonResponse({ proposed_domains: domainCount, request_id: aimcResult.request_id });
});
