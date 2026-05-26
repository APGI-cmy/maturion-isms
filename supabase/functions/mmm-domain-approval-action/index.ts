import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

type DomainApprovalAction = 'submit' | 'return' | 'resubmit' | 'approve';

function mapAction(action: DomainApprovalAction): { status: string; locked: boolean } {
  switch (action) {
    case 'submit':
      return { status: 'submitted_l2', locked: true };
    case 'return':
      return { status: 'returned_l2', locked: false };
    case 'resubmit':
      return { status: 'submitted_l2', locked: true };
    case 'approve':
      return { status: 'approved_l2', locked: true };
  }
}

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

  let body: { domain_id?: string; action_type?: DomainApprovalAction; assigned_reviewer?: string | null } = {};
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }
  if (!body.domain_id || !body.action_type) {
    return jsonResponse({ error: 'domain_id and action_type are required.' }, 400);
  }

  const transition = mapAction(body.action_type);
  const now = new Date().toISOString();

  const { data: existing, error: existingError } = await supabase
    .from('mmm_domain_approval_requests')
    .select('id')
    .eq('domain_id', body.domain_id)
    .eq('organisation_id', claims.orgId)
    .maybeSingle();
  if (existingError) {
    return jsonResponse({ error: existingError.message || 'Failed to load domain approval request.' }, 500);
  }

  let requestId = existing?.id as string | undefined;
  if (!requestId) {
    const { data: created, error: createError } = await supabase
      .from('mmm_domain_approval_requests')
      .insert({
        organisation_id: claims.orgId,
        domain_id: body.domain_id,
        submitted_by: claims.userId,
        assigned_reviewer: body.assigned_reviewer ?? null,
        status: transition.status,
        locked: transition.locked,
        latest_action_by: claims.userId,
        latest_action_at: now,
      })
      .select('id')
      .single();
    if (createError || !created?.id) {
      return jsonResponse({ error: createError?.message || 'Failed to create domain approval request.' }, 500);
    }
    requestId = created.id as string;
  } else {
    const payload: Record<string, unknown> = {
      status: transition.status,
      locked: transition.locked,
      latest_action_by: claims.userId,
      latest_action_at: now,
      updated_at: now,
    };
    if (body.assigned_reviewer !== undefined) {
      payload.assigned_reviewer = body.assigned_reviewer;
    }
    const { error: updateError } = await supabase
      .from('mmm_domain_approval_requests')
      .update(payload)
      .eq('id', requestId);
    if (updateError) {
      return jsonResponse({ error: updateError.message || 'Failed to update domain approval request.' }, 500);
    }
  }

  await supabase.from('mmm_audit_logs').insert({
    action_type: 'DOMAIN_L2_ACTION',
    actor_id: claims.userId,
    target_entity_type: 'domain',
    target_entity_id: body.domain_id,
    after_state: {
      request_id: requestId,
      action_type: body.action_type,
      status: transition.status,
      locked: transition.locked,
    },
  });

  return jsonResponse({ ok: true, request_id: requestId, status: transition.status, locked: transition.locked }, 200);
});
