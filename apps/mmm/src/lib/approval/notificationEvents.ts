import { supabase } from '../../lib/supabase';

export type NotificationType =
  | 'level_2_invitation'
  | 'level_2_changes_submitted'
  | 'level_1_response_submitted'
  | 'level_2_all_approved'
  | 'level_3_invitation'
  | 'level_3_changes_submitted'
  | 'final_approval_complete';

export interface CreateNotificationEventParams {
  approvalRoundId: string;
  recipientUserId: string;
  recipientEmail: string;
  notificationType: NotificationType;
  payloadJson: Record<string, any>;
}

/**
 * Queue a notification event for delivery
 * Inserts to mmm_approval_notification_events with status="queued"
 * 
 * Requirements:
 * - Idempotency key prevents duplicate notifications
 * - recipient_email is required (NOT NULL)
 * - Async delivery (status="queued" until delivery service processes)
 * - RLS by organisation_id
 * - Failure handling required (see failure_reason column)
 */
export async function queueNotification(params: CreateNotificationEventParams) {
  try {
    const {
      approvalRoundId,
      recipientUserId,
      recipientEmail,
      notificationType,
      payloadJson,
    } = params;

    // Validate required fields
    if (!recipientEmail || !recipientEmail.includes('@')) {
      throw new Error('Valid recipient_email is required');
    }

    // Get the approval round to fetch organisation_id
    const { data: round, error: roundError } = await supabase
      .from('mmm_approval_rounds')
      .select('organisation_id')
      .eq('id', approvalRoundId)
      .single();

    if (roundError || !round) {
      throw new Error(`Approval round not found: ${approvalRoundId}`);
    }

    // Generate idempotency key (consistent across retries)
    const idempotencyKey = `${approvalRoundId}:${recipientUserId}:${notificationType}`;

    // Queue notification
    const { data, error } = await supabase
      .from('mmm_approval_notification_events')
      .insert({
        approval_round_id: approvalRoundId,
        organisation_id: round.organisation_id,
        recipient_user_id: recipientUserId,
        recipient_email: recipientEmail,
        notification_type: notificationType,
        payload_json: payloadJson,
        idempotency_key: idempotencyKey,
        status: 'queued',
        queued_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Check if this is a duplicate (idempotency key already exists)
      if (error.code === '23505') {
        return { success: true, duplicate: true, message: 'Notification already queued' };
      }
      throw error;
    }

    return { success: true, notificationId: data.id };
  } catch (err) {
    console.error('Failed to queue notification:', err);
    throw err;
  }
}

/**
 * Get notification events for approval round
 */
export async function getNotificationEvents(approvalRoundId: string) {
  try {
    const { data, error } = await supabase
      .from('mmm_approval_notification_events')
      .select('*')
      .eq('approval_round_id', approvalRoundId)
      .order('queued_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch notification events:', err);
    throw err;
  }
}

/**
 * Get pending notifications for delivery
 * Used by notification delivery service
 */
export async function getPendingNotifications(limit: number = 100) {
  try {
    const { data, error } = await supabase
      .from('mmm_approval_notification_events')
      .select('*')
      .eq('status', 'queued')
      .order('queued_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch pending notifications:', err);
    throw err;
  }
}

/**
 * Mark notification as sent
 */
export async function markNotificationSent(notificationId: string) {
  try {
    const { error } = await supabase
      .from('mmm_approval_notification_events')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error('Failed to mark notification sent:', err);
    throw err;
  }
}

/**
 * Mark notification as failed
 */
export async function markNotificationFailed(
  notificationId: string,
  failureReason: string
) {
  try {
    const { error } = await supabase
      .from('mmm_approval_notification_events')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString(),
        failure_reason: failureReason,
      })
      .eq('id', notificationId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error('Failed to mark notification failed:', err);
    throw err;
  }
}

export default {
  queueNotification,
  getNotificationEvents,
  getPendingNotifications,
  markNotificationSent,
  markNotificationFailed,
};
