/**
 * Supabase Edge Function: mmm-approval-level1-response-submit
 * Route: POST /mmm-approval-level1-response-submit
 * Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
 *
 * Allows Level 1 (framework owner) to accept, reject, edit, or apply proposed changes.
 * Creates AI learning events for each response.
 *
 * Contract Reference:
 * - modules/MMM/approval-workflow/approval-workflow-db-api-contract.md §17
 * - Implements T-MMM-APPROVAL-DB-009, T-MMM-APPROVAL-DB-010, T-MMM-APPROVAL-DB-011
 *
 * State Machine:
 * - Proposed Change: proposed → accepted/rejected/edited_by_level_1/applied
 * - Approval Round: can resubmit if changes_requested
 *
 * Failure Modes:
 * - Level 1 user not authorised
 * - Proposed change already applied/rejected/superseded
 * - Target object is final locked
 * - Final value empty for accept/edit action
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsonResponse, corsHeaders, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

type L1Action = 'accepted' | 'edited_by_level_1' | 'rejected';
type LearningDecision = 'accepted' | 'rejected' | 'edited' | 'superseded' | 'final_signed_off';

interface L1Response {
  proposed_change_id: string;
  action: L1Action;
  final_value?: string;
  response_comment?: string;
}

interface SubmitL1ResponseRequest {
  approval_round_id: string;
  level_1_user_id: string;
  responses: L1Response[];
  resubmit?: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Validate JWT
    const claims = await validateJWT(req, supabase);
    const userId = claims.userId;
    const orgId = claims.orgId;

    const body = (await req.json()) as SubmitL1ResponseRequest;
    const { approval_round_id, level_1_user_id, responses, resubmit } = body;

    if (!approval_round_id || !level_1_user_id || !responses || responses.length === 0) {
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

    // Authorisation: User must be the framework owner (Level 1) — derived from round, not request body
    if (round.submitted_by_user_id !== userId) {
      return jsonResponse({ error: 'Unauthorised: not the framework owner' }, 403);
    }

    // Process each L1 response
    const appliedChangeIds: string[] = [];
    const learningEventIds: string[] = [];
    const notificationEventIds: string[] = [];

    for (const response of responses) {
      // Fetch proposed change
      const { data: change, error: changeError } = await supabase
        .from('mmm_approval_proposed_changes')
        .select('*')
        .eq('id', response.proposed_change_id)
        .eq('approval_round_id', approval_round_id)
        .eq('organisation_id', orgId)
        .maybeSingle();

      if (changeError || !change) {
        return jsonResponse({ error: `Proposed change ${response.proposed_change_id} not found` }, 404);
      }

      // Validate change status (must be 'proposed')
      if (change.status !== 'proposed') {
        return jsonResponse(
          { error: `Proposed change already ${change.status}, cannot apply` },
          400
        );
      }

      // Check if target object is final-locked
      const { data: locks, error: lockError } = await supabase
        .from('mmm_approval_locks')
        .select('lock_state')
        .eq('object_type', change.object_type)
        .eq('object_id', change.object_id)
        .eq('lock_state', 'locked_by_final_approval');

      if (lockError) {
        return jsonResponse({ error: 'Database error checking locks', details: lockError.message }, 500);
      }

      if (locks && locks.length > 0) {
        return jsonResponse(
          { error: `Target object is final-locked, cannot modify` },
          400
        );
      }

      // Validate final value for accept/edit actions
      if ((response.action === 'accepted' || response.action === 'edited_by_level_1') &&
        (!response.final_value || response.final_value.trim().length === 0)) {
        return jsonResponse({ error: 'final_value required for accept/edit actions' }, 400);
      }

      // Update proposed change
      const updateData: Record<string, unknown> = {
        status: response.action === 'edited_by_level_1' ? 'edited_by_level_1' : 
                response.action === 'accepted' ? 'accepted' :
                'rejected',
        level_1_response: response.action,
        applied_by_user_id: userId,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (response.final_value) {
        updateData.final_value = response.final_value;
      }

      const { error: updateError } = await supabase
        .from('mmm_approval_proposed_changes')
        .update(updateData)
        .eq('id', response.proposed_change_id);

      if (updateError) {
        return jsonResponse({ error: 'Failed to update proposed change', details: updateError.message }, 500);
      }

      if (response.action === 'accepted' || response.action === 'edited_by_level_1') {
        appliedChangeIds.push(response.proposed_change_id);

        // Write final_value to the actual target object in the maturity model
        if (response.final_value) {
          const objectId = change.object_id;
          const objectType = change.object_type as string;
          let writeError: { message: string } | null = null;

          if (objectType === 'domain') {
            const { error } = await supabase
              .from('mmm_domains')
              .update({ name: response.final_value, updated_at: new Date().toISOString() })
              .eq('id', objectId);
            writeError = error;
          } else if (objectType === 'mps' || objectType === 'intent_statement') {
            const { error } = await supabase
              .from('mmm_maturity_process_steps')
              .update({ intent_statement: response.final_value, updated_at: new Date().toISOString() })
              .eq('id', objectId);
            writeError = error;
          } else if (objectType === 'criterion') {
            const { error } = await supabase
              .from('mmm_criteria')
              .update({ name: response.final_value, updated_at: new Date().toISOString() })
              .eq('id', objectId);
            writeError = error;
          } else if (objectType === 'maturity_descriptor') {
            const { error } = await supabase
              .from('mmm_level_descriptors')
              .update({ descriptor_text: response.final_value })
              .eq('id', objectId);
            writeError = error;
          }

          if (writeError) {
            return jsonResponse({ error: 'Failed to apply final value to target object', details: writeError.message }, 500);
          }
        }
      }

      // Create audit event
      const { error: auditError } = await supabase
        .from('mmm_approval_audit_events')
        .insert({
          organisation_id: orgId,
          approval_round_id,
          event_type: 'change_applied',
          actor_id: userId,
          actor_role: 'level_1',
          details: null,
        });

      if (auditError) {
        console.error('Audit event error (non-blocking):', auditError);
      }

      // Create AI learning event
      const learningDecision: LearningDecision = response.action === 'accepted' ? 'accepted' :
                                                 response.action === 'edited_by_level_1' ? 'edited' :
                                                 'rejected';

      const { data: learningData, error: learningError } = await supabase
        .from('mmm_ai_learning_events')
        .insert({
          organisation_id: orgId,
          framework_id: round.framework_id,
          approval_round_id,
          proposed_change_id: response.proposed_change_id,
          approval_level: null,
          object_type: change.object_type,
          object_id: change.object_id,
          original_value: change.original_value,
          proposed_value: change.proposed_value,
          final_value: response.final_value || null,
          decision: learningDecision,
          reason: response.response_comment || null,
          actor_role: 'level_1',
          consent_given: false,
        })
        .select('id');

      if (learningError) {
        return jsonResponse({ error: 'Failed to create learning event', details: learningError.message }, 500);
      }

      if (learningData && learningData.length > 0) {
        learningEventIds.push(learningData[0].id);
      }
    }

    // If resubmit, create new approval round with rejected changes
    let newRoundId: string | null = null;
    if (resubmit) {
      // Get rejected changes
      const { data: rejectedChanges, error: rejectedError } = await supabase
        .from('mmm_approval_proposed_changes')
        .select('*')
        .eq('approval_round_id', approval_round_id)
        .eq('level_1_response', 'rejected');

      if (rejectedError) {
        console.error('Error fetching rejected changes (non-blocking):', rejectedError);
      } else if (rejectedChanges && rejectedChanges.length > 0) {
        // Create new approval round with resubmitted_from_round_id
        const { data: newRound, error: newRoundError } = await supabase
          .from('mmm_approval_rounds')
          .insert({
            organisation_id: orgId,
            framework_id: round.framework_id,
            domain_id: round.domain_id,
            approval_level: round.approval_level,
            status: 'drafted',
            submitted_by_user_id: userId,
            resubmitted_from_round_id: approval_round_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select('id');

        if (newRoundError) {
          console.error('Error creating new round (non-blocking):', newRoundError);
        } else if (newRound && newRound.length > 0) {
          newRoundId = newRound[0].id;
        }
      }
    }

    // Create notification event
    const idempotencyKey = `level1_response:${approval_round_id}:${Date.now()}`;
    const { data: notifData, error: notifError } = await supabase
      .from('mmm_approval_notification_events')
      .insert({
        organisation_id: orgId,
        approval_round_id,
        notification_type: 'level_1_response_submitted',
        payload_json: {
          applied_count: appliedChangeIds.length,
          learning_events: learningEventIds.length,
          resubmit: resubmit || false,
        },
        idempotency_key: idempotencyKey,
        status: 'queued',
        queued_at: new Date().toISOString(),
      })
      .select('id');

    if (notifError) {
      console.error('Notification event error (non-blocking):', notifError);
    } else if (notifData && notifData.length > 0) {
      notificationEventIds.push(notifData[0].id);
    }

    return jsonResponse({
      approval_round_id,
      new_round_id: newRoundId,
      applied_change_ids: appliedChangeIds,
      ai_learning_event_ids: learningEventIds,
      notification_event_ids: notificationEventIds,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error', details: String(e) }, 500);
  }
});
