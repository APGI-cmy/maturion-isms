import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

type DomainApprovalAction = 'submit' | 'return' | 'resubmit' | 'approve' | 'reassign' | 'mark_revision_required';

type DomainState = 'draft' | 'submitted_l1' | 'returned_l2' | 'resubmitted_l1' | 'approved_l2' | 'revision_required';

const transitions: Record<DomainState, Partial<Record<DomainApprovalAction, DomainState>>> = {
  draft: { submit: 'submitted_l1' },
  submitted_l1: { return: 'returned_l2', approve: 'approved_l2', reassign: 'submitted_l1' },
  returned_l2: { resubmit: 'resubmitted_l1' },
  resubmitted_l1: { return: 'returned_l2', approve: 'approved_l2', reassign: 'resubmitted_l1' },
  approved_l2: { mark_revision_required: 'revision_required' },
  revision_required: { submit: 'submitted_l1' },
};

const lockedStates = new Set<DomainState>(['submitted_l1', 'resubmitted_l1', 'approved_l2']);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return jsonResponse({ error: 'Service configuration error' }, 500);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let claims: { userId: string; orgId: string; role: string };
  try { claims = await validateJWT(req, supabase); } catch (response) { return response as Response; }

  let body: {
    domain_id?: string;
    action_type?: DomainApprovalAction;
    assigned_reviewer?: string | null;
    expected_state?: DomainState;
    expected_version?: number;
    idempotency_key?: string;
    reason?: string;
  } = {};
  try { body = await req.json(); } catch { return jsonResponse({ error: 'Invalid JSON body' }, 400); }

  if (!body.domain_id || !body.action_type || !body.expected_state || !Number.isInteger(body.expected_version) || !body.idempotency_key?.trim()) {
    return jsonResponse({ error: 'domain_id, action_type, expected_state, expected_version and idempotency_key are required.' }, 400);
  }
  if (['submit', 'return', 'resubmit', 'approve', 'reassign'].includes(body.action_type) && !body.reason?.trim()) {
    return jsonResponse({ error: 'A reason or comment is required.' }, 422);
  }

  const { data: domain, error: domainError } = await supabase
    .from('mmm_domains')
    .select('id, framework_id, framework:mmm_frameworks!inner(id, organisation_id)')
    .eq('id', body.domain_id)
    .eq('mmm_frameworks.organisation_id', claims.orgId)
    .maybeSingle();
  if (domainError) return jsonResponse({ error: domainError.message }, 500);
  if (!domain?.id) return jsonResponse({ error: 'Domain not found in caller organisation scope.' }, 403);

  const { data: existing, error: existingError } = await supabase
    .from('mmm_domain_approval_requests')
    .select('id, status, version, submitted_by, assigned_reviewer, locked, idempotency_key')
    .eq('domain_id', body.domain_id)
    .eq('organisation_id', claims.orgId)
    .maybeSingle();
  if (existingError) return jsonResponse({ error: existingError.message }, 500);

  if (existing?.idempotency_key === body.idempotency_key) {
    return jsonResponse({ ok: true, idempotent_replay: true, request_id: existing.id, status: existing.status, version: existing.version, locked: existing.locked }, 200);
  }

  const currentState = (existing?.status ?? 'draft') as DomainState;
  const currentVersion = existing?.version ?? 0;
  if (currentState !== body.expected_state || currentVersion !== body.expected_version) {
    return jsonResponse({ error: 'Approval state/version conflict.', current_state: currentState, current_version: currentVersion }, 409);
  }

  const nextState = transitions[currentState]?.[body.action_type];
  if (!nextState) return jsonResponse({ error: `Invalid domain transition ${currentState} -> ${body.action_type}.` }, 409);

  if (['approve', 'return'].includes(body.action_type)) {
    if (existing?.submitted_by === claims.userId) return jsonResponse({ error: 'Self-approval is prohibited.' }, 403);
    if (!existing?.assigned_reviewer || existing.assigned_reviewer !== claims.userId) return jsonResponse({ error: 'Only the assigned_reviewer may perform this action.' }, 403);
  }

  if (['submit', 'resubmit'].includes(body.action_type)) {
    const { count: criteriaCount, error: criteriaError } = await supabase
      .from('mmm_criteria')
      .select('id, mps:mmm_maturity_process_steps!inner(domain_id)', { count: 'exact', head: true })
      .eq('mmm_maturity_process_steps.domain_id', body.domain_id);
    if (criteriaError) return jsonResponse({ error: criteriaError.message }, 500);
    const { count: descriptorCount, error: descriptorError } = await supabase
      .from('mmm_level_descriptors')
      .select('id, criterion:mmm_criteria!inner(mps:mmm_maturity_process_steps!inner(domain_id))', { count: 'exact', head: true })
      .eq('mmm_criteria.mmm_maturity_process_steps.domain_id', body.domain_id);
    if (descriptorError) return jsonResponse({ error: descriptorError.message }, 500);
    const complete = (criteriaCount ?? 0) > 0 && descriptorCount === (criteriaCount ?? 0) * 5;
    if (!complete) return jsonResponse({ error: 'Domain package is incomplete.' }, 422);
  }

  const nextVersion = currentVersion + 1;
  const now = new Date().toISOString();
  let requestId = existing?.id as string | undefined;

  if (!requestId) {
    const { data: created, error } = await supabase.from('mmm_domain_approval_requests').insert({
      organisation_id: claims.orgId,
      framework_id: domain.framework_id,
      domain_id: body.domain_id,
      submitted_by: claims.userId,
      assigned_reviewer: body.assigned_reviewer ?? null,
      status: nextState,
      locked: lockedStates.has(nextState),
      version: nextVersion,
      idempotency_key: body.idempotency_key,
      latest_reason: body.reason,
      latest_action_by: claims.userId,
      latest_action_at: now,
    }).select('id').single();
    if (error || !created?.id) return jsonResponse({ error: error?.message ?? 'Failed to create approval request.' }, 500);
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
    if (body.assigned_reviewer !== undefined) payload.assigned_reviewer = body.assigned_reviewer;
    const { data: updated, error } = await supabase.from('mmm_domain_approval_requests').update(payload)
      .eq('id', requestId).eq('version', currentVersion).select('id').maybeSingle();
    if (error) return jsonResponse({ error: error.message }, 500);
    if (!updated?.id) return jsonResponse({ error: 'Approval version conflict.' }, 409);
  }

  const transition = {
    organisation_id: claims.orgId,
    framework_id: domain.framework_id,
    domain_id: body.domain_id,
    request_id: requestId,
    package_type: 'domain',
    action: body.action_type,
    state_before: currentState,
    state_after: nextState,
    version_before: currentVersion,
    version_after: nextVersion,
    actor_user_id: claims.userId,
    actor_role: claims.role,
    reason: body.reason,
    idempotency_key: body.idempotency_key,
  };
  const { error: transitionError } = await supabase.from('mmm_approval_transitions').insert(transition);
  if (transitionError) return jsonResponse({ error: `Transition persistence failed: ${transitionError.message}` }, 500);

  const { error: auditError } = await supabase.from('mmm_audit_logs').insert({
    action_type: 'DOMAIN_APPROVAL_TRANSITION', actor_id: claims.userId, target_entity_type: 'domain', target_entity_id: body.domain_id,
    before_state: { status: currentState, version: currentVersion }, after_state: { status: nextState, version: nextVersion, locked: lockedStates.has(nextState) },
  });
  if (auditError) return jsonResponse({ error: `Audit persistence failed: ${auditError.message}` }, 500);

  return jsonResponse({ ok: true, request_id: requestId, status: nextState, version: nextVersion, locked: lockedStates.has(nextState) }, 200);
});
