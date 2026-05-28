import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const ACTION_TO_STATE: Record<string, string> = {
  approve: 'approved_l1',
  reopen: 'draft',
  reject: 'rejected_l1',
  regenerate: 'draft',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
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

  let body: { mps_id?: string; domain_id?: string; action_type?: string; notes?: string } = {};
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.mps_id || !body.domain_id || !body.action_type) {
    return jsonResponse({ error: 'mps_id, domain_id, and action_type are required.' }, 400);
  }

  const resultingState = ACTION_TO_STATE[body.action_type];
  if (!resultingState) {
    return jsonResponse({ error: 'Invalid action_type.' }, 400);
  }

  const { error: insertError } = await supabase.from('mmm_mps_approval_actions').insert({
    organisation_id: claims.orgId,
    domain_id: body.domain_id,
    mps_id: body.mps_id,
    actor_id: claims.userId,
    action_type: body.action_type,
    notes: body.notes ?? null,
    resulting_state: resultingState,
  });
  if (insertError) {
    return jsonResponse({ error: insertError.message || 'Failed to persist MPS approval action.' }, 500);
  }

  await supabase.from('mmm_audit_logs').insert({
    action_type: 'MPS_L1_ACTION',
    actor_id: claims.userId,
    target_entity_type: 'mps',
    target_entity_id: body.mps_id,
    after_state: {
      domain_id: body.domain_id,
      action_type: body.action_type,
      resulting_state: resultingState,
      notes: body.notes ?? null,
    },
  });

  return jsonResponse({ ok: true, resulting_state: resultingState }, 200);
});
