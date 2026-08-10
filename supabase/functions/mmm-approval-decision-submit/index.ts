/**
 * Supabase Edge Function: mmm-approval-decision-submit
 * Route: POST /mmm-approval-decision-submit
 * Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
 *
 * Records an approver approval/rejection decision.
 * Implements consensus logic: all approvers must approve to proceed to Level 3.
 * Creates domain locks when all approvers approve.
 *
 * Contract Reference:
 * - modules/MMM/approval-workflow/approval-workflow-db-api-contract.md §16
 * - Implements T-MMM-APPROVAL-DB-012, T-MMM-APPROVAL-DB-013, T-MMM-APPROVAL-DB-014
 *
 * State Machine:
 * - Approval Round: changes_requested → approved_by_all (when all approve)
 * - Lock State: unlocked → locked_by_level_2 (when approved_by_all)
 *
 * Failure Modes:
 * - Pending proposed changes by same approver
 * - Approver not in round
 * - Round superseded
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsonResponse, corsHeaders, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

type Decision = 'approved' | 'changes_requested' | 'rejected';

interface SubmitDecisionRequest {
  approval_round_id: string;
  approver_id: string;
  decision: Decision;
  decision_comment?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Validate JWT
    const claims = await validateJWT(req, supabase);
    const userId = claims.userId;
    const orgId = claims.orgId;

    const body = (await req.json()) as SubmitDecisionRequest;
    const { approval_round_id, approver_id, decision, decision_comment } = body;

    if (!approval_round_id || !approver_id || !decision) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    // Fetch approval round
    const { data: round, error: roundError } = await supabase
      .from('mmm_approval_rounds')
      .select('*')
      .eq('id', approval_round_id)
      .eq('organisation_id', orgId)
      .maybeSingle();

    if (roundError || !round) {
      return jsonResponse({ error: 'Approval round not found' }, 404);
    }

    if (round.status === 'superseded' || round.status === 'cancelled') {
      return jsonResponse({ error: 'Round has been superseded or cancelled' }, 400);
    }

    // Fetch approver
    const { data: approver, error: approverError } = await supabase
      .from('mmm_approval_approvers')
      .select('*')
      .eq('id', approver_id)
      .eq('approval_round_id', approval_round_id)
      .eq('organisation_id', orgId)
      .maybeSingle();

    if (approverError || !approver) {
      return jsonResponse({ error: 'Approver not found in this round' }, 403);
    }

    // Check for pending proposed changes by this approver
    const { data: pendingChanges, error: pendingError } = await supabase
      .from('mmm_approval_proposed_changes')
      .select('id')
      .eq('approval_round_id', approval_round_id)
      .eq('approver_id', approver_id)
      .eq('status', 'proposed');

    if (pendingError) {
      return jsonResponse({ error: 'Database error checking pending changes', details: pendingError.message }, 500);
    }

    if (pendingChanges && pendingChanges.length > 0) {
      return jsonResponse(
        { error: 'Cannot submit decision: approver has pending proposed changes' },
        400
      );
    }

    // Update approver decision
    const { error: updateError } = await supabase
      .from('mmm_approval_approvers')
      .update({
        status: decision,
        decision: decision,
        decision_comment: decision_comment || null,
        decided_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', approver_id);

    if (updateError) {
      return jsonResponse({ error: 'Failed to update approver decision', details: updateError.message }, 500);
    }

    // Create audit event
    const { error: auditError } = await supabase
      .from('mmm_approval_audit_events')
      .insert({
        organisation_id: orgId,
        approval_round_id,
        event_type: 'decision_submitted',
        actor_id: userId,
        timestamp: new Date().toISOString(),
      });

    if (auditError) {
      console.error('Audit event error (non-blocking):', auditError);
    }

    // Recalculate round status based on all approver decisions
    const { data: allApprovers, error: allApproversError } = await supabase
      .from('mmm_approval_approvers')
      .select('status, decision')
      .eq('approval_round_id', approval_round_id);

    if (allApproversError) {
      return jsonResponse({ error: 'Database error fetching approvers', details: allApproversError.message }, 500);
    }

    if (!allApprovers || allApprovers.length === 0) {
      return jsonResponse({ error: 'No approvers found for round' }, 500);
    }

    // Determine new round status
    let newRoundStatus = round.status;
    const lockStateChanges: Array<{ object_type: string; object_id: string; lock_state: string }> = [];

    // If any approver decision is 'changes_requested', round status is 'changes_requested'
    const hasChangesRequested = allApprovers.some((a) => a.decision === 'changes_requested');

    if (hasChangesRequested) {
      newRoundStatus = 'changes_requested';
    } else if (allApprovers.every((a) => a.decision === 'approved')) {
      // All approvers approved
      newRoundStatus = 'approved_by_all';

      // Create domain lock when all approvers approve
      if (round.domain_id) {
        const lockData = {
          organisation_id: orgId,
          approval_round_id,
          object_type: 'domain',
          object_id: round.domain_id,
          lock_state: 'locked_by_level_2',
          locked_at: new Date().toISOString(),
        };

        const { error: lockError } = await supabase
          .from('mmm_approval_locks')
          .insert(lockData);

        if (lockError) {
          console.error('Lock creation error (non-blocking):', lockError);
        } else {
          lockStateChanges.push({
            object_type: 'domain',
            object_id: round.domain_id,
            lock_state: 'locked_by_level_2',
          });
        }
      }
    }

    // Update round status if changed
    if (newRoundStatus !== round.status) {
      const { error: statusError } = await supabase
        .from('mmm_approval_rounds')
        .update({
          status: newRoundStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', approval_round_id);

      if (statusError) {
        return jsonResponse({ error: 'Failed to update round status', details: statusError.message }, 500);
      }
    }

    // Create notification event if approved_by_all
    let notificationEventIds: string[] = [];
    if (newRoundStatus === 'approved_by_all') {
      const idempotencyKey = `all_approved:${approval_round_id}`;
      const { data: notifData, error: notifError } = await supabase
        .from('mmm_approval_notification_events')
        .insert({
          organisation_id: orgId,
          approval_round_id,
          notification_type: 'level_2_all_approved',
          payload_json: {
            domain_id: round.domain_id,
            framework_id: round.framework_id,
          },
          idempotency_key: idempotencyKey,
          status: 'queued',
          queued_at: new Date().toISOString(),
        })
        .select('id');

      if (notifError) {
        console.error('Notification event error (non-blocking):', notifError);
      } else if (notifData && notifData.length > 0) {
        notificationEventIds = [notifData[0].id];
      }
    }

    return jsonResponse({
      approval_round_id,
      round_status: newRoundStatus,
      lock_state_changes: lockStateChanges,
      notification_event_ids: notificationEventIds,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error', details: String(e) }, 500);
  }
});
