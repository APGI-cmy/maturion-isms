/**
 * Supabase Edge Function: mmm-approval-lock-transition
 * Route: POST /mmm-approval-lock-transition
 * Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
 *
 * Internal API for transitioning lock states when Level 3 final approval completes.
 * Updates lock state from locked_by_level_2 to locked_by_final_approval.
 *
 * Contract Reference:
 * - modules/MMM/approval-workflow/approval-workflow-db-api-contract.md §18
 * - Implements T-MMM-APPROVAL-DB-015
 *
 * State Machine:
 * - Lock State: locked_by_level_2 → locked_by_final_approval
 * - Approval Round: level_3_pending → approved/rejected
 *
 * Failure Modes:
 * - Unauthorised (service role only)
 * - Lock state already transitioned
 * - Round status invalid
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsonResponse, corsHeaders } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const SERVICE_ROLE_SECRET = Deno.env.get('MMM_SERVICE_ROLE_SECRET') ?? '';

interface TransitionLockRequest {
  approval_round_id: string;
  new_lock_state: 'locked_by_final_approval' | 'unlocked';
  organisation_id: string;
  service_secret?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  // Service-role-only endpoint
  const serviceSecret = req.headers.get('x-service-secret') || '';
  if (serviceSecret !== SERVICE_ROLE_SECRET) {
    return jsonResponse({ error: 'Unauthorised (service role required)' }, 403);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body = (await req.json()) as TransitionLockRequest;
    const { approval_round_id, new_lock_state, organisation_id } = body;

    if (!approval_round_id || !new_lock_state || !organisation_id) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    if (!['locked_by_final_approval', 'unlocked'].includes(new_lock_state)) {
      return jsonResponse({ error: 'Invalid lock state' }, 400);
    }

    // Fetch approval round
    const { data: round, error: roundError } = await supabase
      .from('mmm_approval_rounds')
      .select('*')
      .eq('id', approval_round_id)
      .eq('organisation_id', organisation_id)
      .maybeSingle();

    if (roundError || !round) {
      return jsonResponse({ error: 'Approval round not found' }, 404);
    }

    // Validate round status (must be level_3_pending or approved/rejected for unlock)
    const validStatuses = new_lock_state === 'locked_by_final_approval' ?
      ['level_3_pending'] :
      ['approved', 'rejected'];

    if (!validStatuses.includes(round.status)) {
      return jsonResponse(
        { error: `Cannot transition lock when round status is ${round.status}` },
        400
      );
    }

    // Find all locks for this round
    const { data: locks, error: locksError } = await supabase
      .from('mmm_approval_locks')
      .select('*')
      .eq('approval_round_id', approval_round_id);

    if (locksError) {
      return jsonResponse({ error: 'Database error fetching locks', details: locksError.message }, 500);
    }

    // Update lock states
    const updatedLockIds: string[] = [];
    for (const lock of locks || []) {
      const { error: updateError } = await supabase
        .from('mmm_approval_locks')
        .update({
          lock_state: new_lock_state,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lock.id);

      if (updateError) {
        return jsonResponse({ error: 'Failed to update lock', details: updateError.message }, 500);
      }

      updatedLockIds.push(lock.id);
    }

    // Create audit event
    const { error: auditError } = await supabase
      .from('mmm_approval_audit_events')
      .insert({
        organisation_id,
        approval_round_id,
        event_type: 'lock_transition',
        actor_id: '00000000-0000-0000-0000-000000000000',
        actor_role: 'system',
        details: null,
      });

    if (auditError) {
      console.error('Audit event error (non-blocking):', auditError);
    }

    return jsonResponse({
      approval_round_id,
      lock_state: new_lock_state,
      updated_lock_ids: updatedLockIds,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error', details: String(e) }, 500);
  }
});
