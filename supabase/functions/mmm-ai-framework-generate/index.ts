/**
 * Supabase Edge Function: mmm-ai-framework-generate
 *
 * Wave B4 — Framework Lifecycle
 * Route:   POST /api/ai/framework-generate
 * Tests:   T-MMM-S6-025
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required + ADMIN role.
 *
 * AIMC stub: generates mock framework proposal.
 *
 * Behaviour:
 *   - Creates mmm_proposed_domains, mmm_proposed_mps, mmm_proposed_criteria
 *   - Return: { proposed_domains: number }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
// AIMC_BASE_URL: will be wired to Deno.env.get('AIMC_BASE_URL') in B7

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

  let body: { name?: string; framework_id?: string; hybrid?: boolean };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { framework_id } = body;

  // AIMC stub: generate mock proposed framework structure
  const generatedDomains = [
    { name: 'Leadership & Governance', description: 'Strategic direction and governance structures' },
    { name: 'Process Management', description: 'Core operational process definitions' },
    { name: 'Technology Enablement', description: 'Technology infrastructure and tooling' },
    { name: 'People & Culture', description: 'Human capital and organisational culture' },
  ];

  let domainCount = 0;

  for (let di = 0; di < generatedDomains.length; di++) {
    const domain = generatedDomains[di];

    const { data: proposedDomain, error: domError } = await supabase
      .from('mmm_proposed_domains')
      .insert({
        framework_id: framework_id ?? null,
        name: domain.name,
        description: domain.description,
        position: di + 1,
        source: 'AIMC_GENERATE_STUB',
      })
      .select()
      .single();

    if (domError || !proposedDomain) continue;
    domainCount++;

    // One MPS per domain (stub)
    const { data: proposedMPS } = await supabase
      .from('mmm_proposed_mps')
      .insert({
        framework_id: framework_id ?? null,
        proposed_domain_id: proposedDomain.id,
        name: `${domain.name} — Core Practices`,
        description: 'Core maturity practices for this domain',
        position: 1,
      })
      .select()
      .single();

    if (!proposedMPS) continue;

    // Two criteria per MPS (stub)
    await supabase.from('mmm_proposed_criteria').insert([
      {
        framework_id: framework_id ?? null,
        proposed_mps_id: proposedMPS.id,
        name: 'Initial Capability',
        description: 'Basic capability exists',
        maturity_level: 1,
        position: 1,
      },
      {
        framework_id: framework_id ?? null,
        proposed_mps_id: proposedMPS.id,
        name: 'Managed Capability',
        description: 'Capability is actively managed',
        maturity_level: 2,
        position: 2,
      },
    ]);
  }

  return jsonResponse({ proposed_domains: domainCount });
});
