import { supabase } from '../../lib/supabase';

export interface CreateLearningEventParams {
  approvalRoundId: string;
  userId: string;
  learningText: string;
  consent: boolean;
}

/**
 * Capture learning event (human override of AI scoring)
 * Stores to mmm_ai_learning_events table
 * 
 * Requirements:
 * - consent=true required before capturing
 * - Anonymize PII if needed
 * - Immutable after creation
 * - Link to descriptor reasoning version for feedback loop
 * - Support export for ML pipeline
 */
export async function captureLearningEvent(params: CreateLearningEventParams) {
  try {
    const { approvalRoundId, userId, learningText, consent } = params;

    if (!consent) {
      console.log('Learning event not captured: user consent not granted');
      return { success: false, message: 'Consent required for learning capture' };
    }

    // Get the approval round to fetch organisation_id
    const { data: round, error: roundError } = await supabase
      .from('mmm_approval_rounds')
      .select('organisation_id, framework_id')
      .eq('id', approvalRoundId)
      .single();

    if (roundError || !round) {
      throw new Error(`Approval round not found: ${approvalRoundId}`);
    }

    // Anonymize PII from learning text
    const anonymizedText = anonymizePII(learningText);

    // Create learning event
    const { data, error } = await supabase
      .from('mmm_ai_learning_events')
      .insert({
        approval_round_id: approvalRoundId,
        organisation_id: round.organisation_id,
        framework_id: round.framework_id,
        approval_level: 'level_2',
        object_type: 'maturity_descriptor',
        object_id: approvalRoundId,
        original_value: null,
        proposed_value: null,
        final_value: null,
        decision: 'edited',
        reason: anonymizedText,
        actor_role: 'level_2',
        consent_given: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, eventId: data.id };
  } catch (err) {
    console.error('Failed to capture learning event:', err);
    throw err;
  }
}

/**
 * Get learning events for approval round
 */
export async function getLearningEvents(approvalRoundId: string) {
  try {
    const { data, error } = await supabase
      .from('mmm_ai_learning_events')
      .select('*')
      .eq('approval_round_id', approvalRoundId)
      .eq('consent_given', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch learning events:', err);
    throw err;
  }
}

/**
 * Export learning events for ML pipeline
 * Filters by consent and date range
 */
export async function exportLearningEvents(params: {
  startDate: string;
  endDate: string;
  limit?: number;
}) {
  try {
    const { startDate, endDate, limit = 1000 } = params;

    const { data, error } = await supabase
      .from('mmm_ai_learning_events')
      .select('*')
      .eq('consent_given', true)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to export learning events:', err);
    throw err;
  }
}

/**
 * Get learning events for user
 * For showing user's override history
 */
export async function getUserLearningEvents(userId: string, limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('mmm_ai_learning_events')
      .select('*')
      .eq('user_id', userId)
      .eq('consent_given', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch user learning events:', err);
    throw err;
  }
}

/**
 * Anonymize PII from learning text
 * Removes email addresses, phone numbers, and personal identifiers
 */
function anonymizePII(text: string): string {
  // Remove email addresses
  let anonymized = text.replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[EMAIL]');

  // Remove phone numbers (common patterns)
  anonymized = anonymized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');

  // Remove SSN pattern
  anonymized = anonymized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');

  // Optional: Remove common domain names (if sensitive)
  // anonymized = anonymized.replace(/\b[a-z0-9]{2,20}\.[a-z]{2,6}\b/g, '[DOMAIN]');

  return anonymized;
}

export default {
  captureLearningEvent,
  getLearningEvents,
  exportLearningEvents,
  getUserLearningEvents,
};
