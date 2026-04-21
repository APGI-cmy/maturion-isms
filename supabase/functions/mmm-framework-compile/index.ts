/**
 * Supabase Edge Function: mmm-framework-compile
 *
 * Wave B4 — Framework Lifecycle
 * Route:   POST /api/frameworks/:id/compile
 * Tests:   T-MMM-S6-021, T-MMM-S6-030, T-MMM-S6-039, T-MMM-S6-040
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required + ADMIN role.
 *
 * Behaviour:
 *   - Reads mmm_proposed_domains, mmm_proposed_mps, mmm_proposed_criteria for framework_id
 *   - Hierarchy validation: min 1 MPS per domain, min 1 criterion per MPS
 *   - Auto-assigns codes (D001, D001.MPS001, D001.MPS001.C001)
 *   - Writes to mmm_domains, mmm_maturity_process_steps, mmm_criteria (canonical tables)
 *   - Updates mmm_frameworks.status = 'REVIEW'
 *   - NBR-001: UI must invalidate ['frameworks', id] and ['domains', id]
 *   - Return: { compiled_domains, compiled_mps, compiled_criteria }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

function padNum(n: number, width = 3): string {
  return String(n).padStart(width, '0');
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

  // Extract framework id from URL path
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const frameworkId = pathParts[pathParts.indexOf('frameworks') + 1] ?? pathParts[pathParts.length - 2];

  if (!frameworkId || frameworkId === 'compile') {
    return jsonResponse({ error: 'framework id is required in path' }, 400);
  }

  // Fetch proposed domains
  const { data: proposedDomains, error: domError } = await supabase
    .from('mmm_proposed_domains')
    .select('*')
    .eq('framework_id', frameworkId)
    .order('position');

  if (domError) {
    return jsonResponse({ error: 'Failed to fetch proposed domains' }, 500);
  }

  if (!proposedDomains || proposedDomains.length === 0) {
    return jsonResponse({ error: 'No proposed domains found for this framework' }, 400);
  }

  // Fetch proposed MPS
  const { data: proposedMPS, error: mpsError } = await supabase
    .from('mmm_proposed_mps')
    .select('*')
    .eq('framework_id', frameworkId)
    .order('position');

  if (mpsError) {
    return jsonResponse({ error: 'Failed to fetch proposed MPS' }, 500);
  }

  // Fetch proposed criteria
  const { data: proposedCriteria, error: critError } = await supabase
    .from('mmm_proposed_criteria')
    .select('*')
    .eq('framework_id', frameworkId)
    .order('position');

  if (critError) {
    return jsonResponse({ error: 'Failed to fetch proposed criteria' }, 500);
  }

  // Hierarchy validation: min 1 MPS per domain, min 1 criterion per MPS
  for (const domain of proposedDomains) {
    const domainMPS = (proposedMPS ?? []).filter((m: any) => m.proposed_domain_id === domain.id);
    if (domainMPS.length === 0) {
      return jsonResponse({
        error: `Domain "${domain.name}" has no Maturity Process Steps. Min 1 MPS per domain required.`,
      }, 400);
    }
    for (const mps of domainMPS) {
      const mpsCriteria = (proposedCriteria ?? []).filter((c: any) => c.proposed_mps_id === mps.id);
      if (mpsCriteria.length === 0) {
        return jsonResponse({
          error: `MPS "${mps.name}" in domain "${domain.name}" has no criteria. Min 1 criterion per MPS required.`,
        }, 400);
      }
    }
  }

  // Auto-assign codes and write to canonical tables
  let domainCount = 0;
  let mpsCount = 0;
  let criteriaCount = 0;

  for (let di = 0; di < proposedDomains.length; di++) {
    const domain = proposedDomains[di];
    const domainCode = `D${padNum(di + 1)}`;

    // Write to mmm_domains (canonical)
    const { data: canonicalDomain, error: cdError } = await supabase
      .from('mmm_domains')
      .insert({
        framework_id: frameworkId,
        name: domain.name,
        description: domain.description ?? null,
        code: domainCode,
        position: di + 1,
      })
      .select()
      .single();

    if (cdError || !canonicalDomain) {
      console.error('[mmm-framework-compile] domain insert error:', cdError?.message);
      return jsonResponse({ error: `Failed to compile domain "${domain.name}"` }, 500);
    }
    domainCount++;

    const domainMPS = (proposedMPS ?? []).filter((m: any) => m.proposed_domain_id === domain.id);

    for (let mi = 0; mi < domainMPS.length; mi++) {
      const mps = domainMPS[mi];
      const mpsCode = `${domainCode}.MPS${padNum(mi + 1)}`;

      // Write to mmm_maturity_process_steps (canonical)
      const { data: canonicalMPS, error: cmError } = await supabase
        .from('mmm_maturity_process_steps')
        .insert({
          framework_id: frameworkId,
          domain_id: canonicalDomain.id,
          name: mps.name,
          description: mps.description ?? null,
          code: mpsCode,
          position: mi + 1,
        })
        .select()
        .single();

      if (cmError || !canonicalMPS) {
        console.error('[mmm-framework-compile] MPS insert error:', cmError?.message);
        return jsonResponse({ error: `Failed to compile MPS "${mps.name}"` }, 500);
      }
      mpsCount++;

      const mpsCriteria = (proposedCriteria ?? []).filter((c: any) => c.proposed_mps_id === mps.id);

      for (let ci = 0; ci < mpsCriteria.length; ci++) {
        const criterion = mpsCriteria[ci];
        const criterionCode = `${mpsCode}.C${padNum(ci + 1)}`;

        // Write to mmm_criteria (canonical)
        const { error: ccError } = await supabase
          .from('mmm_criteria')
          .insert({
            framework_id: frameworkId,
            mps_id: canonicalMPS.id,
            domain_id: canonicalDomain.id,
            name: criterion.name,
            description: criterion.description ?? null,
            code: criterionCode,
            maturity_level: criterion.maturity_level ?? 1,
            position: ci + 1,
          });

        if (ccError) {
          console.error('[mmm-framework-compile] criterion insert error:', ccError.message);
          return jsonResponse({ error: `Failed to compile criterion "${criterion.name}"` }, 500);
        }
        criteriaCount++;
      }
    }
  }

  // Update framework status to 'REVIEW'
  await supabase
    .from('mmm_frameworks')
    .update({ status: 'REVIEW' })
    .eq('id', frameworkId);

  // NBR-001: UI must invalidate ['frameworks', id] and ['domains', id]
  return jsonResponse({
    compiled_domains: domainCount,
    compiled_mps: mpsCount,
    compiled_criteria: criteriaCount,
  });
});
