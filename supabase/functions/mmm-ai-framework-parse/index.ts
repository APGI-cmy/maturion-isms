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
import { buildFallbackFrameworkStructure, insertProposedFrameworkStructure, toFallbackSourceType } from '../_shared/mmm-fallback-framework.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

/** Derive a DB-safe code slug from a name if the AI response omits the 'code' field. */
function toCode(n: string, idx: number): string {
  const slug = n.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 20);
  return slug || `ITEM_${idx + 1}`;
}

/** Mark a parse job as FAILED with the given error message. */
async function failParseJob(supabase: ReturnType<typeof createClient>, parseJobId: string | undefined, reason: string): Promise<void> {
  if (!parseJobId) return;
  await supabase.from('mmm_parse_jobs').update({ status: 'FAILED', result_json: { error: reason } }).eq('id', parseJobId);
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

  let body: { parse_job_id?: string; framework_id?: string; source_text?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { parse_job_id, framework_id, source_text } = body;

  // Mark parse job as PROCESSING before starting AIMC call
  if (parse_job_id) {
    await supabase
      .from('mmm_parse_jobs')
      .update({ status: 'PROCESSING' })
      .eq('id', parse_job_id);
  }

  // Fetch parse job row to extract KUC identifiers stored by mmm-upload-framework-source.
  // These are passed to AIMC so the parse operation is grounded in the actual uploaded document.
  let kucUploadId: string | null = null;
  let kucParseJobId: string | null = null;
  let uploadMetadata: Record<string, unknown> | null = null;

  if (parse_job_id) {
    const { data: parseJobRow } = await supabase
      .from('mmm_parse_jobs')
      .select('result_json')
      .eq('id', parse_job_id)
      .single();

    if (parseJobRow?.result_json) {
      const rj = parseJobRow.result_json as Record<string, unknown>;
      kucUploadId = typeof rj.kuc_upload_id === 'string' ? rj.kuc_upload_id : null;
      kucParseJobId = typeof rj.kuc_parse_job_id === 'string' ? rj.kuc_parse_job_id : null;
      uploadMetadata = rj.upload_metadata && typeof rj.upload_metadata === 'object' && !Array.isArray(rj.upload_metadata)
        ? (rj.upload_metadata as Record<string, unknown>)
        : null;
    }
  }

  const completeWithFallbackStructure = async (reason: string, request_id: string) => {
    if (!framework_id) {
      await failParseJob(supabase, parse_job_id, reason);
      return jsonResponse({ error: 'framework_id is required for fallback parse structure' }, 400);
    }

    try {
      const sourceType = toFallbackSourceType(uploadMetadata?.source_type, 'VERBATIM');
      const proposedDomains = buildFallbackFrameworkStructure(sourceType);
      const domainCount = await insertProposedFrameworkStructure(supabase, framework_id, proposedDomains);
      if (parse_job_id) {
        await supabase
          .from('mmm_parse_jobs')
          .update({
            status: 'COMPLETE',
            result_json: { proposed_domains: domainCount, request_id, fallback: true, reason },
          })
          .eq('id', parse_job_id);
      }
      return jsonResponse({
        proposed_domains: domainCount,
        parse_job_id: parse_job_id ?? null,
        request_id,
        fallback: true,
        reason,
      });
    } catch (err) {
      console.error(`[mmm-ai-framework-parse] fallback structure insert failed: ${err instanceof Error ? err.message : 'unknown'}`);
      await failParseJob(supabase, parse_job_id, 'fallback_structure_insert_failed');
      return jsonResponse({ error: 'Failed to create fallback parse structure' }, 500);
    }
  };

  if (!Deno.env.get('AIMC_BASE_URL')) {
    return await completeWithFallbackStructure('AIMC_BASE_URL_MISSING', `fallback-${crypto.randomUUID()}`);
  }

  // TR-009 + TR-011–TR-015: Call AIMC via consumer boundary (OB-1 / CG-002)
  // Authorization: Bearer AIMC_SERVICE_TOKEN on every call (TR-011)
  // Pass KUC identifiers so AIMC can retrieve and parse the uploaded document.
  const aimcResult = await callAimc(
    'framework-parse',
    claims.orgId,
    claims.userId,
    {
      parse_job_id: parse_job_id ?? null,
      framework_id: framework_id ?? null,
      source_text: source_text ?? null,
      kuc_upload_id: kucUploadId,
      kuc_parse_job_id: kucParseJobId,
      upload_metadata: uploadMetadata,
    },
  );

  // TR-009: Circuit breaker fallback — return graceful degradation response
  if (aimcResult.fallback) {
    return await completeWithFallbackStructure(
      aimcResult.fallback_reason ?? 'circuit_breaker_open',
      aimcResult.request_id,
    );
  }

  // NBR-002: Non-200 from AIMC propagated as error
  if (!aimcResult.success) {
    console.error(`[mmm-ai-framework-parse] AIMC error: ${aimcResult.error}`);
    await failParseJob(supabase, parse_job_id, aimcResult.error ?? 'aimc_error');
    return jsonResponse({ error: 'AIMC call failed', detail: aimcResult.error }, 502);
  }

  // Record ai_interaction for audit trail (TR-034, T-MMM-S6-124, T-MMM-S6-128)
  // Columns: actor_id, action_type, context_type, target_entity_id, status, request_json, response_json
  await supabase.from('mmm_ai_interactions').insert({
    actor_id: claims.userId,
    action_type: 'FRAMEWORK_PARSE',
    context_type: 'parse_job',
    target_entity_id: parse_job_id ?? framework_id ?? null,
    status: 'completed',
    request_json: { parse_job_id: parse_job_id ?? null, framework_id: framework_id ?? null, source_text: source_text ?? null, kuc_upload_id: kucUploadId, kuc_parse_job_id: kucParseJobId },
    response_json: (aimcResult.data as Record<string, unknown>) ?? null,
  }).catch((err: Error) => {
    console.warn(`[mmm-ai-framework-parse] ai_interactions insert warn: ${err.message}`);
  });

  // Extract proposed structure from AIMC response (TR-012 data envelope)
  const aiData = (aimcResult.data as any) ?? {};
  const proposedDomains: Array<{
    name: string;
    code?: string;
    mps?: Array<{
      name: string;
      code?: string;
      intent_statement?: string;
      description?: string;
      criteria?: Array<{ name: string; code?: string; maturity_level?: number }>;
    }>;
  }> = aiData.proposed_domains ?? [];

  let domainCount = 0;

  // Persist AIMC-proposed structure to MMM tables
  for (let di = 0; di < proposedDomains.length; di++) {
    const domain = proposedDomains[di];

    // mmm_proposed_domains: framework_id (NOT NULL), name, code, sort_order, source ('AI'|'HUMAN')
    const { data: proposedDomain, error: domError } = await supabase
      .from('mmm_proposed_domains')
      .insert({
        framework_id: framework_id ?? null,
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

  // Update parse job status to 'COMPLETE' — only update valid schema columns (status, result_json)
  if (parse_job_id) {
    await supabase
      .from('mmm_parse_jobs')
      .update({
        status: 'COMPLETE',
        result_json: { proposed_domains: domainCount, request_id: aimcResult.request_id },
      })
      .eq('id', parse_job_id);
  }

  return jsonResponse({
    proposed_domains: domainCount,
    parse_job_id: parse_job_id ?? null,
    request_id: aimcResult.request_id,
  });
});
