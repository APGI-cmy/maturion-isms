/**
 * Supabase Edge Function: mmm-org-create
 *
 * Wave B3 — Core UI: Onboarding
 * Route:   POST /api/organisations
 * Tests:   T-MMM-S6-013, T-MMM-S6-017
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required.
 *
 * Behaviour:
 *   - Body: { name: string, tier: string }
 *   - Create mmm_organisations record
 *   - Create/update mmm_profiles for the user (set organisation_id, role='ADMIN')
 *   - NBR-001: UI must call queryClient.invalidateQueries(['organisations'])
 *   - NBR-002: HTTP 403 if no valid JWT
 *   - Return: { organisation }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

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

  // NBR-002: HTTP 403 if no valid JWT
  let claims: { userId: string; orgId: string; role: string };
  try {
    claims = await validateJWT(req, supabase);
  } catch (response) {
    return response as Response;
  }

  let body: { name?: string; tier?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { name, tier } = body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return jsonResponse({ error: 'name is required' }, 400);
  }

  if (!tier || typeof tier !== 'string') {
    return jsonResponse({ error: 'tier is required' }, 400);
  }

  // Create mmm_organisations record
  const { data: org, error: orgError } = await supabase
    .from('mmm_organisations')
    .insert({ name: name.trim(), tier })
    .select()
    .single();

  if (orgError || !org) {
    console.error('[mmm-org-create] org insert error:', orgError?.message);
    return jsonResponse({ error: 'Failed to create organisation' }, 500);
  }

  // Create/update mmm_profiles for the user with organisation_id and role='ADMIN'
  const { error: profileError } = await supabase
    .from('mmm_profiles')
    .upsert(
      {
        user_id: claims.userId,
        organisation_id: org.id,
        role: 'ADMIN',
      },
      { onConflict: 'user_id' },
    );

  if (profileError) {
    console.error('[mmm-org-create] profile upsert error:', profileError.message);
    return jsonResponse({ error: 'Failed to update user profile' }, 500);
  }

  // NBR-001: UI must call queryClient.invalidateQueries(['organisations'])
  return jsonResponse({ organisation: org }, 201);
});
