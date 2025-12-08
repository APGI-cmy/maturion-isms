/**
 * Scoring Library for Maturity Model
 * 
 * This library implements the scoring engine for the MATURION ISMS maturity model.
 * It provides functions to compute evidence confidence, criterion scores, MPS scores,
 * domain scores, and overall organization maturity.
 */

export interface MaturityThreshold {
  level: number;
  minScore: number;
  maxScore: number;
}

export interface EvidenceScore {
  confidence: number;
}

export interface CriterionInput {
  criterionId: string;
  cycleId: string;
  targetLevel: number;
  weight: number;
  evidenceScores: EvidenceScore[];
}

export interface CriterionScore {
  criterionId: string;
  cycleId: string;
  numericScore: number;
  maturityLevel: number;
  targetLevel: number;
  gap: number;
  evidenceCount: number;
  avgEvidenceConfidence?: number;
}

export interface MpsScore {
  mpsId: string;
  cycleId: string;
  numericScore: number;
  maturityLevel: number;
  targetLevel: number;
  gap: number;
}

export interface DomainScore {
  domainId: string;
  cycleId: string;
  numericScore: number;
  maturityLevel: number;
  targetLevel: number;
  gap: number;
}

export interface OrganizationScore {
  numericScore: number;
  maturityLevel: number;
}

/**
 * Computes evidence confidence by multiplying base weight, recency factor, and metadata factor
 * Formula: confidence = base * recency * metadata
 * Result is clamped to [0, 1]
 */
export function computeEvidenceConfidence(
  base: number,
  recency: number,
  metadata: number
): number {
  const confidence = base * recency * metadata;
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Determines maturity level based on numeric score and thresholds
 */
export function getMaturityLevel(
  score: number,
  thresholds: MaturityThreshold[]
): number {
  for (const threshold of thresholds) {
    if (score >= threshold.minScore && score <= threshold.maxScore) {
      return threshold.level;
    }
  }
  // Default to level 1 if no threshold matches
  return 1;
}

/**
 * Computes criterion score based on evidence scores
 */
export function computeCriterionScore(
  input: CriterionInput,
  thresholds: MaturityThreshold[]
): CriterionScore {
  const { criterionId, cycleId, targetLevel, evidenceScores } = input;

  // Calculate average confidence from evidence
  let numericScore = 0;
  let avgEvidenceConfidence: number | undefined;

  if (evidenceScores.length > 0) {
    const totalConfidence = evidenceScores.reduce(
      (sum, evidence) => sum + evidence.confidence,
      0
    );
    avgEvidenceConfidence = totalConfidence / evidenceScores.length;
    numericScore = avgEvidenceConfidence;
  }

  // Clamp numeric score to [0, 1]
  numericScore = Math.max(0, Math.min(1, numericScore));

  // Determine maturity level
  const maturityLevel = getMaturityLevel(numericScore, thresholds);

  // Calculate gap
  const gap = targetLevel - maturityLevel;

  return {
    criterionId,
    cycleId,
    numericScore,
    maturityLevel,
    targetLevel,
    gap,
    evidenceCount: evidenceScores.length,
    avgEvidenceConfidence,
  };
}

/**
 * Computes MPS score as weighted average of criterion scores
 */
export function computeMpsScore(
  mpsId: string,
  cycleId: string,
  targetLevel: number,
  criteriaScores: Array<{ criterionId: string; numericScore: number }>,
  criteriaWeights: Record<string, number>,
  thresholds: MaturityThreshold[]
): MpsScore {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const criterionScore of criteriaScores) {
    const weight = criteriaWeights[criterionScore.criterionId] || 1;
    weightedSum += criterionScore.numericScore * weight;
    totalWeight += weight;
  }

  const numericScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const maturityLevel = getMaturityLevel(numericScore, thresholds);
  const gap = targetLevel - maturityLevel;

  return {
    mpsId,
    cycleId,
    numericScore,
    maturityLevel,
    targetLevel,
    gap,
  };
}

/**
 * Computes domain score as weighted average of MPS scores
 */
export function computeDomainScore(
  domainId: string,
  cycleId: string,
  targetLevel: number,
  mpsScores: Array<{ mpsId: string; numericScore: number }>,
  mpsWeights: Record<string, number>,
  thresholds: MaturityThreshold[]
): DomainScore {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const mpsScore of mpsScores) {
    const weight = mpsWeights[mpsScore.mpsId] || 1;
    weightedSum += mpsScore.numericScore * weight;
    totalWeight += weight;
  }

  const numericScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const maturityLevel = getMaturityLevel(numericScore, thresholds);
  const gap = targetLevel - maturityLevel;

  return {
    domainId,
    cycleId,
    numericScore,
    maturityLevel,
    targetLevel,
    gap,
  };
}

/**
 * Computes organization maturity as weighted average of domain scores
 */
export function computeOrganizationMaturity(
  domainScores: Array<{ domainId: string; numericScore: number }>,
  domainWeights: Record<string, number>,
  thresholds: MaturityThreshold[]
): OrganizationScore {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const domainScore of domainScores) {
    const weight = domainWeights[domainScore.domainId] || 1;
    weightedSum += domainScore.numericScore * weight;
    totalWeight += weight;
  }

  const numericScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const maturityLevel = getMaturityLevel(numericScore, thresholds);

  return {
    numericScore,
    maturityLevel,
  };
}
