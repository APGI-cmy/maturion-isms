import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

type FrameworkAction = 'submit' | 'return' | 'resubmit' | 'approve' | 'reassign' | 'mark_revision_required';
type FrameworkState = 'draft' | 'ready_for_l3' | 'submitted_l3' | 'returned_l3' | 'approved_l3' | 'revision_required';

const transitions: Record<FrameworkState, Partial<Record<FrameworkAction, FrameworkState>>> = {
  draft: { submit: 'submitted_l3' },
  ready_for_l3: { submit: 'submitted_l3' },
  submitted_l3: { return: 'returned_l3', approve: 'approved_l3', reassign: 'submitted_l3' },
  returned_l3: { resubmit: 'submitted_l3' },
  approved_l3: { mark_revision_required: 'revision_required' },
  revision_required: { submit: 'submitted_l3' },
};

const lockedStates = new Set<FrameworkState>(['submitted_l3', 'approved_l3']);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return jsonResponse({ error: 'Service configuration error' }, 500);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let claims: { userId: string; orgId: string; role: string };
  try { claims = await validateJWT(req, supabase); } catch (response) { return response as Response; }

  let body: {
    framework_id?: string;
    action_type?: FrameworkAction;
    assigned_approver?: string | null;
    expected_state?: FrameworkState;
    expected_version?: number;
    idempotency_key?: string;
    reason?: string;
  } = {};
  try { body = await req.json(); } catch { return jsonResponse({ error: 'Invalid JSON body' }, 400); }

  if (!body.framework_id || !body.action_type || !body.expected_state || !Number.isInteger(body.expected_version) || !body.idempotency_key?.trim()) {
    return jsonResponse({ error: 'framework_id, action_type, expected_state, expected_version and idempotency_key are required.' }, 400);
  }
  if (['submit', 'return', 'resubmit', 'approve', 'reassign'].includes(body.action_type) && !body.reason?.trim()) {
    return jsonResponse({ error: 'A reason or comment is required.' }, 422);
  }

  const { data: framework, error: frameworkError } = await supabase.from('mmm_frameworks')
    .select('id, organisation_id').eq('id', body.framework_id).eq('organisation_id', claims.orgId).maybeSingle();
  if (frameworkError) return jsonResponse({ error: frameworkError.message }, 500);
  if (!framework?.id) return jsonResponse({ error: 'Framework not found in caller organisation scope.' }, 403);

  const { data: existing, error: existingError } = await supabase.from('mmm_framework_approval_requests')
    .select('id, status, version, submitted_by, assigned_approver, locked, idempotency_key')
    .eq('framework_id', body.framework_id).eq('organisation_id', claims.orgId).maybeSingle();
  if (existingError) return jsonResponse({ error: existingError.message }, 500);

  if (existing?.idempotency_key === body.idempotency_key) {
    return jsonResponse({ ok: true, idempotent_replay: true, request_id: existing.id, status: existing.status, version: existing.version, locked: existing.locked }, 200);
  }

  const currentState = (existing?.status ?? 'draft') as FrameworkState;
  const currentVersion = existing?.version ?? 0;
  if (currentState !== body.expected_state || currentVersion !== body.expected_version) {
    return jsonResponse({ error: 'Approval state/version conflict.', current_state: currentState, current_version: currentVersion }, 409);
  }
  const nextState = transitions[currentState]?.[body.action_type];
  if (!nextState) return jsonResponse({ error: `Invalid framework transition ${currentState} -> ${body.action_type}.` }, 409);

  if (['approve', 'return'].includes(body.action_type)) {
    if (existing?.submitted_by === claims.userId) return jsonResponse({ error: 'Self-approval is prohibited.' }, 403);
    if (!existing?.assigned_approver || existing.assigned_approver !== claims.userId) return jsonResponse({ error: 'Only the assigned_approver or authorised executive may perform this action.' }, 403);
  }

  if (['submit', 'resubmit'].includes(body.action_type)) {
    const { data: domains, error: domainsError } = await supabase.from('mmm_domains').select('id').eq('framework_id', body.framework_id);
    if (domainsError) return jsonResponse({ error: domainsError.message }, 500);
    const domainIds = (domains ?? []).map((domain) => domain.id);
    if (domainIds.length === 0) return jsonResponse({ error: 'Framework has no required domains.' }, 422);
    const { data: approvals, error: approvalsError } = await supabase.from('mmm_domain_approval_requests')
      .select('domain_id, status').eq('organisation_id', claims.orgId).in('domain_id', domainIds);
    if (approvalsError) return jsonResponse({ error: approvalsError.message }, 500);
    const approved = new Set((approvals ?? []).filter((row) => row.status === 'approved_l2').map((row) => row.domain_id));
    if (domainIds.some((id) => !approved.has(id))) return jsonResponse({ error: 'All required domains must hold current approved_l2 status before Level 3 submission.' }, 422);
  }

  const nextVersion = currentVersion + 1;
  const now = new Date().toISOString();
  let requestId = existing?.id as string | undefined;
  if (!requestId) {
    const { data: created, error } = await supabase.from('mmm_framework_approval_requests').insert({
      organisation_id: claims.orgId,
      framework_id: body.framework_id,
      submitted_by: claims.userId,
      assigned_approver: body.assigned_approver ?? null,
      status: nextState,
      locked: lockedStates.has(nextState),
      version: nextVersion,
      idempotency_key: body.idempotency_key,
      latest_reason: body.reason,
      latest_action_by: claims.userId,
      latest_action_at: now,
    }).select('id').single();
    if (error || !created?.id) return jsonResponse({ error: error?.message ?? 'Failed to create framework approval request.' }, 500);
    requestId = created.id;
  } else {
    const payload: Record<string, unknown> = {
      status: nextState,
      locked: lockedStates.has(nextState),
      version: nextVersion,
      idempotency_key: body.idempotency_key,
      latest_reason: body.reason,
      latest_action_by: claims.userId,
      latest_action_at: now,
      updated_at: now,
    };
    if (body.assigned_approver !== undefined) payload.assigned_approver = body.assigned_approver;
    const { data: updated, error } = await supabase.from('mmm_framework_approval_requests').update(payload)
      .eq('id', requestId).eq('version', currentVersion).select('id').maybeSingle();
    if (error) return jsonResponse({ error: error.message }, 500);
    if (!updated?.id) return jsonResponse({ error: 'Approval version conflict.' }, 409);
  }

  const { error: transitionError } = await supabase.from('mmm_approval_transitions').insert({
    organisation_id: claims.orgId,
    framework_id: body.framework_id,
    request_id: requestId,
    package_type: 'framework',
    action: body.action_type,
    state_before: currentState,
    state_after: nextState,
    version_before: currentVersion,
    version_after: nextVersion,
    actor_user_id: claims.userId,
    actor_role: claims.role,
    reason: body.reason,
    idempotency_key: body.idempotency_key,
  });
  if (transitionError) return jsonResponse({ error: `Transition persistence failed: ${transitionError.message}` }, 500);

  const { error: auditError } = await supabase.from('mmm_audit_logs').insert({
    action_type: 'FRAMEWORK_APPROVAL_TRANSITION', actor_id: claims.userId, target_entity_type: 'framework', target_entity_id: body.framework_id,
    before_state: { status: currentState, version: currentVersion }, after_state: { status: nextState, version: nextVersion, locked: lockedStates.has(nextState) },
  });
  if (auditError) return jsonResponse({ error: `Audit persistence failed: ${auditError.message}` }, 500);

  return jsonResponse({ ok: true, request_id: requestId, status: nextState, version: nextVersion, locked: lockedStates.has(nextState) }, 200);
});
