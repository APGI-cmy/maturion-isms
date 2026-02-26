/**
 * FeedbackPipeline — Wave 9.4
 *
 * Implements FeedbackPipelineInterface for AIMC-governed feedback submission
 * and ARC (Adaptive Review Committee) approval gate operations.
 *
 * All operations route exclusively through the `ai_feedback_events` table
 * via an injected Supabase client. Legacy table access is PROHIBITED in this file.
 *
 * Critical constraints (ARCH-FREEZE-WAVE9-SLL-20260226 §4.2):
 *   - MUST NOT import from legacy learning modules
 *   - MUST NOT reference legacy table names (these are tracked in Wave 9.11)
 *   - submit() MUST throw AIMCBypassError if organisationId is empty/undefined
 *   - Uses Supabase client injected via constructor (same pattern as PersistentMemoryAdapter)
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.2 (API)
 *   Issue #613 — Wave 9.4 authority: CS2 (@APGI-cmy)
 *   GRS-011 | APS §10 | AAD §10.1
 */

import type {
  FeedbackPipelineInterface,
  FeedbackEvent,
} from '../types/feedback.js';
import { AIMCBypassError } from '../errors/AIMCBypassError.js';

// ---------------------------------------------------------------------------
// Internal — snake_case row shape (matches ai_feedback_events table)
// ---------------------------------------------------------------------------

interface FeedbackRow {
  id?: string;
  organisation_id: string;
  session_id: string;
  user_id?: string | null;
  interaction_id: string;
  feedback_type: string;
  rating?: number | null;
  comment?: string | null;
  correction_text?: string | null;
  capability: string;
  agent_id: string;
  arc_status?: string;
  arc_reviewed_by?: string | null;
  arc_reviewed_at?: string | null;
  arc_notes?: string | null;
  created_at?: string;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

/** Convert a FeedbackEvent (camelCase) to a database row (snake_case). */
function toRow(
  event: Omit<FeedbackEvent, 'id' | 'arcStatus' | 'createdAt'>,
): Omit<FeedbackRow, 'id' | 'arc_status' | 'created_at'> {
  return {
    organisation_id: event.organisationId,
    session_id: event.sessionId,
    user_id: event.userId ?? null,
    interaction_id: event.interactionId,
    feedback_type: event.feedbackType,
    rating: event.rating ?? null,
    comment: event.comment ?? null,
    correction_text: event.correctionText ?? null,
    capability: event.capability,
    agent_id: event.agentId,
  };
}

/** Convert a database row (snake_case) to a FeedbackEvent (camelCase). */
function fromRow(row: FeedbackRow): FeedbackEvent {
  return {
    id: row.id,
    organisationId: row.organisation_id,
    sessionId: row.session_id,
    userId: row.user_id ?? undefined,
    interactionId: row.interaction_id,
    feedbackType: row.feedback_type as FeedbackEvent['feedbackType'],
    rating: row.rating ?? undefined,
    comment: row.comment ?? undefined,
    correctionText: row.correction_text ?? undefined,
    capability: row.capability,
    agentId: row.agent_id,
    arcStatus: (row.arc_status as FeedbackEvent['arcStatus']) ?? 'pending',
    arcReviewedBy: row.arc_reviewed_by ?? undefined,
    arcReviewedAt: row.arc_reviewed_at ? new Date(row.arc_reviewed_at) : undefined,
    arcNotes: row.arc_notes ?? undefined,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
  };
}

// ---------------------------------------------------------------------------
// FeedbackPipeline implementation
// ---------------------------------------------------------------------------

/**
 * AIMC-governed feedback pipeline.
 *
 * Accepts a Supabase client via constructor injection (consistent with the
 * PersistentMemoryAdapter pattern). The client must have service_role
 * credentials for approve() and reject() operations (ARC gate).
 */
export class FeedbackPipeline implements FeedbackPipelineInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly supabaseClient: any) {}

  /**
   * Submit a new feedback event to the AIMC pipeline.
   *
   * @throws AIMCBypassError if organisationId is missing or empty.
   */
  async submit(
    event: Omit<FeedbackEvent, 'id' | 'arcStatus' | 'createdAt'>,
  ): Promise<FeedbackEvent> {
    if (!event.organisationId) {
      throw new AIMCBypassError(
        'FeedbackPipeline.submit(): organisationId is required. ' +
          'Submitting feedback without a valid organisationId constitutes an AIMC governance bypass.',
      );
    }

    const row = toRow(event);

    const { data, error } = await this.supabaseClient
      .from('ai_feedback_events')
      .insert(row)
      .select('*')
      .single();

    if (error !== null && error !== undefined) {
      throw new Error(`FeedbackPipeline.submit() failed: ${error.message}`);
    }

    return fromRow(data as FeedbackRow);
  }

  /**
   * List all pending feedback events for an organisation.
   *
   * Returns events with arc_status = 'pending', ordered by created_at ascending.
   */
  async listPending(organisationId: string): Promise<FeedbackEvent[]> {
    const { data, error } = await this.supabaseClient
      .from('ai_feedback_events')
      .select('*')
      .eq('arc_status', 'pending')
      .eq('organisation_id', organisationId)
      .order('created_at', { ascending: true });

    if (error !== null && error !== undefined) {
      throw new Error(`FeedbackPipeline.listPending() failed: ${error.message}`);
    }

    const rows = (data ?? []) as FeedbackRow[];
    return rows.map(fromRow);
  }

  /**
   * ARC-approve a pending feedback event.
   *
   * Sets arc_status = 'approved'. Requires service_role token on the
   * underlying Supabase client (enforced via RLS — see migration 005).
   */
  async approve(id: string, reviewedBy: string, notes?: string): Promise<FeedbackEvent> {
    const { data, error } = await this.supabaseClient
      .from('ai_feedback_events')
      .update({
        arc_status: 'approved',
        arc_reviewed_by: reviewedBy,
        arc_reviewed_at: new Date().toISOString(),
        arc_notes: notes ?? null,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error !== null && error !== undefined) {
      throw new Error(`FeedbackPipeline.approve() failed: ${error.message}`);
    }

    return fromRow(data as FeedbackRow);
  }

  /**
   * ARC-reject a pending feedback event.
   *
   * Sets arc_status = 'rejected'. Requires service_role token on the
   * underlying Supabase client (enforced via RLS — see migration 005).
   */
  async reject(id: string, reviewedBy: string, notes?: string): Promise<FeedbackEvent> {
    const { data, error } = await this.supabaseClient
      .from('ai_feedback_events')
      .update({
        arc_status: 'rejected',
        arc_reviewed_by: reviewedBy,
        arc_reviewed_at: new Date().toISOString(),
        arc_notes: notes ?? null,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error !== null && error !== undefined) {
      throw new Error(`FeedbackPipeline.reject() failed: ${error.message}`);
    }

    return fromRow(data as FeedbackRow);
  }
}
