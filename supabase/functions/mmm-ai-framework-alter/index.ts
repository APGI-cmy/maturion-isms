/**
 * Supabase Edge Function: mmm-ai-framework-alter
 *
 * Wave B4 — Framework Lifecycle
 * Route:   POST /api/ai/framework-alter
 * Tests:   T-MMM-S6-026
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required + ADMIN role.
 *
 * AIMC stub: alters proposed framework.
 *
 * Behaviour:
 *   - Updates mmm_proposed_domains/mps/criteria as directed
 *   - Return: { updated: true }
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

  let body: {
    framework_id?: string;
    domain_updates?: { id: string; name?: string; description?: string }[];
    mps_updates?: { id: string; name?: string; description?: string }[];
    criteria_updates?: { id: string; name?: string; description?: string; maturity_level?: number }[];
  };

  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { framework_id, domain_updates = [], mps_updates = [], criteria_updates = [] } = body;

  // Apply domain updates
  for (const update of domain_updates) {
    const { id, ...fields } = update;
    await supabase.from('mmm_proposed_domains').update(fields).eq('id', id);
  }

  // Apply MPS updates
  for (const update of mps_updates) {
    const { id, ...fields } = update;
    await supabase.from('mmm_proposed_mps').update(fields).eq('id', id);
  }

  // Apply criteria updates
  for (const update of criteria_updates) {
    const { id, ...fields } = update;
    await supabase.from('mmm_proposed_criteria').update(fields).eq('id', id);
  }

  return jsonResponse({ updated: true });
});
