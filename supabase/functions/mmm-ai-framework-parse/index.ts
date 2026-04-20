/**
 * Supabase Edge Function: mmm-ai-framework-parse
 *
 * Wave B4 — Framework Lifecycle
 * Route:   POST /api/ai/framework-parse
 * Tests:   T-MMM-S6-024, T-MMM-S6-034
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required + ADMIN role.
 *
 * AIMC stub (B4; live in B7): returns mock proposed domains/MPS/criteria.
 * NOTE: In production (B7), replace stub with real AIMC call.
 * // AIMC_BASE_URL: will be wired to Deno.env.get('AIMC_BASE_URL') in B7
 *
 * Behaviour:
 *   - Creates mmm_proposed_domains, mmm_proposed_mps, mmm_proposed_criteria records
 *   - Updates mmm_parse_jobs status to 'COMPLETE'
 *   - Return: { proposed_domains: number, parse_job_id }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
// AIMC_BASE_URL: will be wired to Deno.env.get('AIMC_BASE_URL') in B7

const STUB_DOMAINS = [
  { name: 'Governance', description: 'Organisational governance practices' },
  { name: 'Risk Management', description: 'Risk identification and treatment' },
  { name: 'Compliance', description: 'Regulatory and policy compliance' },
];

const STUB_MPS_PER_DOMAIN = [
  { name: 'Policy Framework', description: 'Formal policy documentation' },
  { name: 'Implementation', description: 'Operational implementation' },
];

const STUB_CRITERIA_PER_MPS = [
  { name: 'Defined', description: 'Process is defined and documented', maturity_level: 1 },
  { name: 'Managed', description: 'Process is actively managed', maturity_level: 2 },
];

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

  let body: { parse_job_id?: string; framework_id?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { parse_job_id, framework_id } = body;

  // Create mock proposed domains
  for (let di = 0; di < STUB_DOMAINS.length; di++) {
    const domain = STUB_DOMAINS[di];
    const { data: proposedDomain, error: domError } = await supabase
      .from('mmm_proposed_domains')
      .insert({
        framework_id: framework_id ?? null,
        parse_job_id: parse_job_id ?? null,
        name: domain.name,
        description: domain.description,
        position: di + 1,
        source: 'AIMC_STUB',
      })
      .select()
      .single();

    if (domError || !proposedDomain) continue;

    for (let mi = 0; mi < STUB_MPS_PER_DOMAIN.length; mi++) {
      const mps = STUB_MPS_PER_DOMAIN[mi];
      const { data: proposedMPS, error: mpsError } = await supabase
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

      if (mpsError || !proposedMPS) continue;

      for (let ci = 0; ci < STUB_CRITERIA_PER_MPS.length; ci++) {
        const crit = STUB_CRITERIA_PER_MPS[ci];
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
      .update({ status: 'COMPLETE', completed_at: new Date().toISOString() })
      .eq('id', parse_job_id);
  }

  return jsonResponse({ proposed_domains: STUB_DOMAINS.length, parse_job_id: parse_job_id ?? null });
});
