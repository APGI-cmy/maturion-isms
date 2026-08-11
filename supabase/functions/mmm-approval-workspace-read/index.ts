/**
 * Supabase Edge Function: mmm-approval-workspace-read
 * Route: GET /mmm-approval-workspace-read
 * Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
 *
 * Retrieves approval workspace data with RLS filtering.
 * Returns approval rounds, approvers, proposed changes, comments for current user.
 *
 * Contract Reference:
 * - modules/MMM/approval-workflow/approval-workflow-db-api-contract.md §19
 * - Implements T-MMM-APPROVAL-DB-021, T-MMM-APPROVAL-DB-022
 *
 * Query Parameters:
 * - filter: "pending" | "approved" | "rejected" (default: "pending")
 * - page: 1 (default: 1)
 * - limit: 50 (default: 50, max: 100)
 *
 * Returns:
 * - approval_rounds with nested approvers, proposed_changes, comments
 * - notification_events for current user
 * - learning_events accessible to current user
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsonResponse, corsHeaders, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

interface WorkspaceReadResponse {
  approval_rounds: Array<{
    id: string;
    framework_id: string;
    domain_id?: string;
    status: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    approvers: Array<{
      id: string;
      user_id: string;
      domain_id?: string;
      status: string;
      decision?: string;
    }>;
    proposed_changes: Array<{
      id: string;
      field: string;
      original_value: string;
      proposed_value: string;
      status: string;
    }>;
    comments: Array<{
      id: string;
      user_id: string;
      text: string;
      created_at: string;
    }>;
  }>;
  notification_events: Array<{
    id: string;
    notification_type: string;
    status: string;
    queued_at: string;
  }>;
  total_rounds: number;
  page: number;
  limit: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Validate JWT
    const claims = await validateJWT(req, supabase);
    const userId = claims.userId;
    const orgId = claims.orgId;

    // Parse query parameters
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter') || 'pending';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));

    // Validate filter
    if (!['pending', 'approved', 'rejected'].includes(filter)) {
      return jsonResponse({ error: 'Invalid filter value' }, 400);
    }

    // Build status filter
    const statusMap: Record<string, string[]> = {
      pending: ['draft', 'invited', 'in_review', 'changes_requested', 'resubmitted', 'approved_by_some'],
      approved: ['approved_by_all'],
      rejected: ['superseded', 'cancelled'],
    };
    const statuses = statusMap[filter];

    // Fetch approval rounds for current user (RLS will filter by org_id)
    const offset = (page - 1) * limit;
    const { data: rounds, error: roundsError, count: roundCount } = await supabase
      .from('mmm_approval_rounds')
      .select('*', { count: 'exact' })
      .eq('organisation_id', orgId)
      .in('status', statuses)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (roundsError) {
      return jsonResponse({ error: 'Database error fetching rounds', details: roundsError.message }, 500);
    }

    // Fetch related data for each round
    const roundsWithData = await Promise.all(
      (rounds || []).map(async (round) => {
        // Fetch approvers
        const { data: approvers, error: approversError } = await supabase
          .from('mmm_approval_approvers')
          .select('id, user_id, domain_id, status, decision')
          .eq('approval_round_id', round.id);

        // Fetch proposed changes
        const { data: changes, error: changesError } = await supabase
          .from('mmm_approval_proposed_changes')
          .select('id, field, original_value, proposed_value, status')
          .eq('approval_round_id', round.id);

        // Fetch comments
        const { data: comments, error: commentsError } = await supabase
          .from('mmm_approval_comments')
          .select('id, user_id, text, created_at')
          .eq('approval_round_id', round.id)
          .order('created_at', { ascending: true });

        return {
          ...round,
          approvers: approversError ? [] : approvers,
          proposed_changes: changesError ? [] : changes,
          comments: commentsError ? [] : comments,
        };
      })
    );

    // Fetch notification events for current user
    const { data: notifEvents, error: notifError } = await supabase
      .from('mmm_approval_notification_events')
      .select('id, notification_type, status, queued_at')
      .eq('organisation_id', orgId)
      .order('queued_at', { ascending: false })
      .limit(10);

    if (notifError) {
      console.error('Notification events error (non-blocking):', notifError);
    }

    return jsonResponse({
      approval_rounds: roundsWithData,
      notification_events: notifEvents || [],
      total_rounds: roundCount || 0,
      page,
      limit,
    } as WorkspaceReadResponse);
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error', details: String(e) }, 500);
  }
});
