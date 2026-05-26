import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
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

  let body: Record<string, unknown> = {};
  if (req.method === 'POST') {
    try {
      body = await req.json();
    } catch {
      body = {};
    }
  }

  const requestedAction = typeof body.action === 'string' ? body.action : 'get';

  if (req.method === 'GET' || (req.method === 'POST' && requestedAction === 'get')) {
    const { data, error } = await supabase
      .from('mmm_organisations')
      .select('id,name,tier,context,onboarding_complete,context_updated_at')
      .eq('id', claims.orgId)
      .single();
    if (error) {
      return jsonResponse({ error: error.message || 'Failed to load organisation context.' }, 500);
    }
    return jsonResponse({ organisation: data }, 200);
  }

  if (req.method === 'PUT' || (req.method === 'POST' && requestedAction === 'update')) {
    if (req.method === 'PUT') {
      try {
        body = await req.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON body' }, 400);
      }
    }

    const payload: Record<string, unknown> = {};
    if (typeof body.name === 'string' && body.name.trim()) payload.name = body.name.trim();
    if (typeof body.tier === 'string' && body.tier.trim()) payload.tier = body.tier.trim();
    if (body.context && typeof body.context === 'object') payload.context = body.context;
    payload.context_updated_at = new Date().toISOString();

    const { data: updatedOrg, error: updateError } = await supabase
      .from('mmm_organisations')
      .update(payload)
      .eq('id', claims.orgId)
      .select('id,name,tier,context,onboarding_complete,context_updated_at')
      .single();
    if (updateError || !updatedOrg) {
      return jsonResponse({ error: updateError?.message || 'Failed to update organisation context.' }, 500);
    }

    await supabase.from('mmm_audit_logs').insert({
      action_type: 'ORG_CONTEXT_UPDATED',
      actor_id: claims.userId,
      target_entity_type: 'organisation',
      target_entity_id: claims.orgId,
      after_state: updatedOrg,
    });

    return jsonResponse({ organisation: updatedOrg }, 200);
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
});
