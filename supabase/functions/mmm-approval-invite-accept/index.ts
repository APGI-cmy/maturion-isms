/**
 * Supabase Edge Function: mmm-approval-invite-accept
 * Route: POST /mmm-approval-invite-accept
 * Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
 *
 * Accepts an approval invitation and binds approver to user account.
 * No JWT required (token-based access).
 *
 * Contract Reference:
 * - modules/MMM/approval-workflow/approval-workflow-db-api-contract.md §14
 * - Implements T-MMM-APPROVAL-DB-004, T-MMM-APPROVAL-DB-005
 *
 * State Machine:
 * - Invitation: pending_send → accepted
 * - Approval Round: invited → in_review (when first approver accepts)
 *
 * Failure Modes:
 * - Invalid/expired token
 * - Invitation revoked or already accepted
 * - Email mismatch
 * - Round superseded
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsonResponse, corsHeaders } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

interface AcceptInviteRequest {
  token: string;
  user_id?: string;
  email: string;
  full_name?: string;
}

// Utility: Hash token for comparison
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body = (await req.json()) as AcceptInviteRequest;
    const { token, user_id, email, full_name } = body;

    if (!token || !email) {
      return jsonResponse({ error: 'token and email are required' }, 400);
    }

    // Hash the provided token to compare against stored token_hash
    const tokenHash = await hashToken(token);

    // Fetch invitation by token hash
    const { data: invitations, error: fetchError } = await supabase
      .from('mmm_approval_invitations')
      .select('*')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (fetchError || !invitations) {
      return jsonResponse({ error: 'Invalid token' }, 400);
    }

    const inv = invitations;

    // Validate invitation state
    if (inv.status === 'accepted') {
      return jsonResponse({ error: 'Invitation already accepted' }, 400);
    }

    if (inv.status === 'revoked') {
      return jsonResponse({ error: 'Invitation revoked' }, 400);
    }

    if (inv.status === 'expired' || new Date(inv.expires_at) < new Date()) {
      // Update status to expired if not already
      await supabase
        .from('mmm_approval_invitations')
        .update({ status: 'expired' })
        .eq('id', inv.id);
      return jsonResponse({ error: 'Invitation expired' }, 400);
    }

    // Validate email matches
    if (inv.email !== email) {
      return jsonResponse({ error: 'Email does not match invitation' }, 400);
    }

    // Check if round is superseded
    const { data: round, error: roundError } = await supabase
      .from('mmm_approval_rounds')
      .select('status')
      .eq('id', inv.approval_round_id)
      .maybeSingle();

    if (roundError || !round) {
      return jsonResponse({ error: 'Approval round not found' }, 500);
    }

    if (round.status === 'superseded' || round.status === 'cancelled') {
      return jsonResponse({ error: 'Round has been superseded or cancelled' }, 400);
    }

    // Accept invitation: update status and timestamp
    const { error: updateError } = await supabase
      .from('mmm_approval_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', inv.id);

    if (updateError) {
      return jsonResponse({ error: 'Failed to accept invitation', details: updateError.message }, 500);
    }

    // Bind user_id to approver record if provided
    if (user_id) {
      const { error: approverError } = await supabase
        .from('mmm_approval_approvers')
        .update({
          user_id,
          status: 'accepted',
          accepted_invite_at: new Date().toISOString(),
        })
        .eq('id', inv.approver_id);

      if (approverError) {
        return jsonResponse({ error: 'Failed to bind user to approver', details: approverError.message }, 500);
      }
    }

    // Fetch round organization for audit event
    const { data: roundForAudit, error: roundAuditError } = await supabase
      .from('mmm_approval_rounds')
      .select('organisation_id')
      .eq('id', inv.approval_round_id)
      .maybeSingle();

    // Create audit event for invitation acceptance
    const { error: auditError } = await supabase
      .from('mmm_approval_audit_events')
      .insert({
        organisation_id: roundForAudit?.organisation_id,
        approval_round_id: inv.approval_round_id,
        event_type: 'invitation_accepted',
        actor_id: user_id || null,
        actor_role: 'level_2',
        details: null,
      });

    if (auditError) {
      console.error('Audit event error (non-blocking):', auditError);
    }

    // Transition round status from invited to in_review when first approver accepts
    // Check if any other approvers have already accepted
    const { data: acceptedApprovers, error: checkError } = await supabase
      .from('mmm_approval_approvers')
      .select('id')
      .eq('approval_round_id', inv.approval_round_id)
      .eq('status', 'accepted');

    if (!checkError && acceptedApprovers && acceptedApprovers.length > 0) {
      // At least one approver has accepted, transition round to in_review
      const { error: statusError } = await supabase
        .from('mmm_approval_rounds')
        .update({
          status: 'in_review',
          updated_at: new Date().toISOString(),
        })
        .eq('id', inv.approval_round_id)
        .eq('status', 'invited'); // Only transition if still in invited state

      if (statusError) {
        console.error('Round status transition error (non-blocking):', statusError);
      }
    }

    // Create notification event to inform Level 1 that approver has accepted
    const idempotencyKey = `approver_accepted:${inv.approver_id}:${inv.approval_round_id}`;
    const { error: notifError } = await supabase
      .from('mmm_approval_notification_events')
      .insert({
        organisation_id: inv.organisation_id,
        approval_round_id: inv.approval_round_id,
        recipient_email: inv.email,
        notification_type: 'approver_accepted',
        payload_json: {
          approver_full_name: inv.full_name || 'Approver',
          approver_email: inv.email,
        },
        idempotency_key: idempotencyKey,
        status: 'queued',
        queued_at: new Date().toISOString(),
      });

    if (notifError) {
      console.error('Notification event error (non-blocking):', notifError);
    }

    return jsonResponse({
      approval_round_id: inv.approval_round_id,
      approver_id: inv.approver_id,
      access_scope: {
        framework_id: inv.framework_id,
        domain_id: inv.domain_id,
        approval_level: round.approval_level,
      },
    });
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error', details: String(e) }, 500);
  }
});
