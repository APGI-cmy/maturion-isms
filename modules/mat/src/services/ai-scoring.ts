/**
 * AI Scoring Service
 * Architecture: modules/mat/02-architecture/ai-architecture.md
 * Implements AI maturity scoring, evidence-first rule, and human confirmation
 */

import type {
  AIScoreResult,
  HumanScoreConfirmation,
  MaturityLevel,
  Evidence,
  UserRole
} from '../types/index.js';

/**
 * Minimum evidence count required before AI scoring is permitted
 * Architecture: §3.12 Path 4 — AI Maturity Scoring
 * FRS: FR-024
 */
const MINIMUM_EVIDENCE_COUNT = 1;

/**
 * Roles authorized to confirm AI scores
 */
const SCORE_CONFIRMATION_ROLES: UserRole[] = ['lead_auditor', 'domain_auditor', 'admin'];

/**
 * Generates an AI maturity score for a criterion
 * Architecture: §3.12 Path 4 — AI Maturity Scoring
 * FRS: FR-023
 * 
 * Produces maturity level (1-5), confidence, rationale, and evidence citations.
 * In production, this would call GPT-4 Turbo via AI Gateway.
 * 
 * @param criterionId - ID of criterion to score
 * @param evidence - Array of evidence items for the criterion
 * @param modelVersion - AI model version used for scoring
 * @returns AI score result with maturity level and confidence
 * @throws Error if insufficient evidence (evidence-first rule)
 */
export function scoreMaturity(
  criterionId: string,
  evidence: Evidence[],
  modelVersion: string
): AIScoreResult {
  if (!validateEvidenceFirst(evidence)) {
    throw new Error(
      `Insufficient evidence for criterion ${criterionId}. ` +
      `Minimum ${MINIMUM_EVIDENCE_COUNT} evidence item(s) required before scoring.`
    );
  }

  const maturityLevel = calculateMaturityLevel(evidence);
  const confidence = calculateConfidence(evidence);

  return {
    criterion_id: criterionId,
    maturity_level: maturityLevel,
    confidence,
    rationale: generateRationale(evidence, maturityLevel),
    evidence_citations: evidence.map(e => e.id),
    model_version: modelVersion,
    scored_at: new Date().toISOString()
  };
}

/**
 * Validates evidence-first scoring rule
 * Architecture: §3.12 Path 4
 * FRS: FR-024
 * 
 * AI scoring is only permitted when minimum evidence threshold is met.
 * This prevents scoring without supporting evidence.
 * 
 * @param evidence - Array of evidence items
 * @returns true if evidence meets minimum threshold, false otherwise
 */
export function validateEvidenceFirst(evidence: Evidence[]): boolean {
  return evidence.length >= MINIMUM_EVIDENCE_COUNT;
}

/**
 * Confirms or overrides an AI score with human judgment
 * Architecture: §3.12 Path 4
 * FRS: FR-025
 * 
 * Human confirmation is mandatory — AI scores are never auto-committed.
 * If the human assigns a different level, it is recorded as an override
 * with mandatory justification.
 * 
 * @param aiScore - Original AI score result
 * @param confirmedLevel - Human-confirmed maturity level
 * @param confirmerId - ID of user confirming
 * @param confirmerRole - Role of user confirming
 * @param overrideJustification - Required if confirmedLevel differs from AI score
 * @returns Human score confirmation record
 * @throws Error if role lacks authority or override lacks justification
 */
export function confirmScore(
  aiScore: AIScoreResult,
  confirmedLevel: MaturityLevel,
  confirmerId: string,
  confirmerRole: UserRole,
  overrideJustification?: string
): HumanScoreConfirmation {
  if (SCORE_CONFIRMATION_ROLES.indexOf(confirmerRole) === -1) {
    throw new Error(
      `Role ${confirmerRole} lacks authority to confirm scores. ` +
      `Allowed roles: ${SCORE_CONFIRMATION_ROLES.join(', ')}`
    );
  }

  const isOverride = confirmedLevel !== aiScore.maturity_level;

  if (isOverride && !overrideJustification) {
    throw new Error(
      'Override justification is required when confirmed level differs from AI score'
    );
  }

  return {
    criterion_id: aiScore.criterion_id,
    ai_score: aiScore,
    confirmed_level: confirmedLevel,
    is_override: isOverride,
    override_justification: isOverride ? (overrideJustification || null) : null,
    confirmed_by: confirmerId,
    confirmed_at: new Date().toISOString()
  };
}

/**
 * Calculates maturity level based on evidence quality and quantity
 * 
 * @param evidence - Array of evidence items
 * @returns Maturity level 1-5
 */
function calculateMaturityLevel(evidence: Evidence[]): MaturityLevel {
  const count = evidence.length;
  const acceptedCount = evidence.filter(e => e.status === 'accepted').length;
  
  if (acceptedCount >= 5) return 5;
  if (acceptedCount >= 4) return 4;
  if (acceptedCount >= 3) return 3;
  if (count >= 2) return 2;
  return 1;
}

/**
 * Calculates confidence score based on evidence
 * 
 * @param evidence - Array of evidence items
 * @returns Confidence between 0 and 1
 */
function calculateConfidence(evidence: Evidence[]): number {
  const count = evidence.length;
  const acceptedRatio = evidence.filter(e => e.status === 'accepted').length / count;
  const typesDiversity = new Set(evidence.map(e => e.evidence_type)).size / 5;
  
  return Math.min(1, (acceptedRatio * 0.6 + typesDiversity * 0.4));
}

/**
 * Generates scoring rationale based on evidence
 * 
 * @param evidence - Array of evidence items
 * @param level - Assigned maturity level
 * @returns Rationale text
 */
function generateRationale(evidence: Evidence[], level: MaturityLevel): string {
  const types = [...new Set(evidence.map(e => e.evidence_type))];
  return `Maturity level ${level} assigned based on ${evidence.length} evidence item(s) ` +
    `of type(s): ${types.join(', ')}. ` +
    `${evidence.filter(e => e.status === 'accepted').length} item(s) accepted.`;
}
