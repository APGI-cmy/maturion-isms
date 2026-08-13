import { supabase } from '../../lib/supabase';

export type AuditEventType =
  | 'round_created'
  | 'invitations_sent'
  | 'invitation_accepted'
  | 'proposed_changes_submitted'
  | 'decision_submitted'
  | 'state_transition'
  | 'round_approved'
  | 'round_rejected'
  | 'round_cancelled';

export type ActorRole = 'level_1' | 'level_2' | 'level_3' | 'system';

export interface CreateAuditEventParams {
  approvalRoundId: string;
  eventType: AuditEventType;
  actorId: string;
  actorRole: ActorRole;
  details?: Record<string, any>;
}

/**
 * Create audit event for approval workflow actions
 * Logs to mmm_approval_audit_events table
 * 
 * Requirements:
 * - Immutable after creation
 * - Includes full context (actor, role, timestamp)
 * - Enforces RLS by organisation_id
 * - Includes optional details JSON
 */
export async function createAuditEvent(params: CreateAuditEventParams) {
  try {
    const { approvalRoundId, eventType, actorId, actorRole, details } = params;

    // Get the approval round to fetch organisation_id
    const { data: round, error: roundError } = await supabase
      .from('mmm_approval_rounds')
      .select('organisation_id')
      .eq('id', approvalRoundId)
      .single();

    if (roundError || !round) {
      throw new Error(`Approval round not found: ${approvalRoundId}`);
    }

    // Create audit event
    const { data, error } = await supabase
      .from('mmm_approval_audit_events')
      .insert({
        approval_round_id: approvalRoundId,
        organisation_id: round.organisation_id,
        event_type: eventType,
        actor_id: actorId,
        actor_role: actorRole,
        details: details || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, eventId: data.id };
  } catch (err) {
    console.error('Failed to create audit event:', err);
    throw err;
  }
}

/**
 * Query audit events for approval round
 * Respects RLS and tenant isolation
 */
export async function getAuditEvents(approvalRoundId: string) {
  try {
    const { data, error } = await supabase
      .from('mmm_approval_audit_events')
      .select('*')
      .eq('approval_round_id', approvalRoundId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch audit events:', err);
    throw err;
  }
}

/**
 * Export audit events to CSV
 */
export function exportAuditEventsToCSV(events: any[]): string {
  if (!events || events.length === 0) {
    return 'No events to export';
  }

  const headers = ['Date', 'Event Type', 'Actor', 'Role', 'Details'];
  const rows = events.map((event) => [
    new Date(event.created_at).toLocaleString(),
    event.event_type,
    event.actor_id,
    event.actor_role,
    event.details ? JSON.stringify(event.details) : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape CSV values with quotes
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(',')
    ),
  ].join('\n');

  return csvContent;
}

export default { createAuditEvent, getAuditEvents, exportAuditEventsToCSV };
