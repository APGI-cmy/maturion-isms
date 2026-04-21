/**
 * Supabase Edge Function: mmm-framework-init
 *
 * Wave B3 — Core UI: Onboarding
 * Route:   POST /api/frameworks/init
 * Tests:   T-MMM-S6-014
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required + ADMIN role.
 *
 * Behaviour:
 *   - Body: { name: string, source_type: 'VERBATIM'|'GENERATED'|'HYBRID', origin_mode: string }
 *   - Create mmm_frameworks record (status='DRAFT', organisation_id from JWT)
 *   - Log to mmm_audit_logs (action_type: 'FRAMEWORK_INIT')
 *   - NBR-001: UI must invalidate ['frameworks'] query cache
 *   - Return: { framework }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';

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

  // ADMIN required
  try {
    requireRole(claims.role, ['ADMIN']);
  } catch (response) {
    return response as Response;
  }

  let body: { name?: string; source_type?: string; origin_mode?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { name, source_type, origin_mode } = body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return jsonResponse({ error: 'name is required' }, 400);
  }

  if (!source_type || !['VERBATIM', 'GENERATED', 'HYBRID'].includes(source_type)) {
    return jsonResponse({ error: 'source_type must be VERBATIM, GENERATED, or HYBRID' }, 400);
  }

  // Create mmm_frameworks record (status='DRAFT', organisation_id from JWT)
  const { data: framework, error: frameworkError } = await supabase
    .from('mmm_frameworks')
    .insert({
      name: name.trim(),
      source_type,
      origin_mode: origin_mode ?? source_type,
      status: 'DRAFT',
      organisation_id: claims.orgId,
      created_by: claims.userId,
    })
    .select()
    .single();

  if (frameworkError || !framework) {
    console.error('[mmm-framework-init] framework insert error:', frameworkError?.message);
    return jsonResponse({ error: 'Failed to initialise framework' }, 500);
  }

  // Log to mmm_audit_logs (action_type: 'FRAMEWORK_INIT')
  await supabase.from('mmm_audit_logs').insert({
    action_type: 'FRAMEWORK_INIT',
    actor_id: claims.userId,
    actor_type: 'USER',
    target_entity_type: 'FRAMEWORK',
    target_entity_id: framework.id,
    organisation_id: claims.orgId,
    metadata: { name: framework.name, source_type, origin_mode },
  });

  // NBR-001: UI must invalidate ['frameworks'] query cache
  return jsonResponse({ framework }, 201);
});
