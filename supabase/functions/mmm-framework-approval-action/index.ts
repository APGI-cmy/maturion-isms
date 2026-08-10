import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

type FrameworkApprovalAction = 'submit' | 'return' | 'approve';

function mapFrameworkAction(action: FrameworkApprovalAction): { status: string; locked: boolean } {
  switch (action) {
    case 'submit':
      return { status: 'submitted_l3', locked: true };
    case 'return':
      return { status: 'returned_l3', locked: false };
    case 'approve':
      return { status: 'approved_l3', locked: true };
    default:
      throw new Error(`Unknown framework approval action: ${action}`);
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

  let body: {
    framework_id?: string;
    action_type?: FrameworkApprovalAction;
    assigned_approver?: string | null;
    idempotency_key?: string;
    correlation_id?: string;
    expected_status?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.framework_id || !body.action_type) {
    return jsonResponse({ error: 'framework_id and action_type are required.' }, 400);
  }

  const correlationId = body.correlation_id ?? body.idempotency_key ?? crypto.randomUUID();
  const transition = mapFrameworkAction(body.action_type);
  const now = new Date().toISOString();

  const { data: existing, error: existingError } = await supabase
    .from('mmm_framework_approval_requests')
    .select('id,status,organisation_id,submitted_by')
    .eq('framework_id', body.framework_id)
    .eq('organisation_id', claims.orgId)
    .maybeSingle();
  if (existingError) {
    return jsonResponse({ error: existingError.message || 'Failed to load framework approval request.' }, 500);
  }

  if (existing?.submitted_by && existing.submitted_by === claims.userId && body.action_type === 'approve') {
    return jsonResponse({ error: 'submitter and approver must differ for executive approval.' }, 403);
  }

  if (body.expected_status && existing?.status && existing.status !== body.expected_status) {
    return jsonResponse({ error: 'Approval status conflict.', conflict: true, status: existing.status }, 409);
  }

  let requestId = existing?.id as string | undefined;
  if (!requestId) {
    const { data: created, error: createError } = await supabase
      .from('mmm_framework_approval_requests')
      .insert({
        organisation_id: claims.orgId,
        framework_id: body.framework_id,
        submitted_by: claims.userId,
        assigned_approver: body.assigned_approver ?? null,
        status: transition.status,
        locked: transition.locked,
        latest_action_by: claims.userId,
        latest_action_at: now,
      })
      .select('id')
      .single();
    if (createError || !created?.id) {
      return jsonResponse({ error: createError?.message || 'Failed to create framework approval request.' }, 500);
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
    if (body.assigned_approver !== undefined) {
      payload.assigned_approver = body.assigned_approver;
    }
    const { error: updateError } = await supabase
      .from('mmm_framework_approval_requests')
      .update(payload)
      .eq('id', requestId);
    if (updateError) {
      return jsonResponse({ error: updateError.message || 'Failed to update framework approval request.' }, 500);
    }
  }

  await supabase.from('mmm_audit_logs').insert({
    action_type: 'FRAMEWORK_L3_ACTION',
    actor_id: claims.userId,
    target_entity_type: 'framework',
    target_entity_id: body.framework_id,
    after_state: {
      request_id: requestId,
      action_type: body.action_type,
      transition: transition.status,
      approved_l2: existing?.status === 'approved_l2',
      correlation_id: correlationId,
      assigned_approver: body.assigned_approver ?? null,
      executive: true,
    },
  });

  return jsonResponse({ ok: true, request_id: requestId, status: transition.status, correlation_id: correlationId }, 200);
});
