export type DescriptorSourceMode = 'verbatim_source' | 'hybrid_source' | 'new_generation_context';

export type DescriptorLearningRecord = {
  id?: string;
  tenantId: string;
  frameworkId?: string | null;
  criterionId?: string | null;
  criterionCode?: string | null;
  sourceMode?: DescriptorSourceMode | string | null;
  grammarShape?: string | null;
  reuseScope: string;
  reviewStatus: string;
  conflictStatus?: string | null;
  reuseSuccessCount?: number | null;
  createdAt?: string | null;
  originalCriterionText?: string | null;
  originalGeneratedDescriptorText?: string | null;
  userCorrectedDescriptorText?: string | null;
  maturityLevelCorrected?: number | null;
  correctionCategory?: string | null;
  transformationSummary?: string | null;
  reusablePatternCandidateText?: string | null;
  learnedEvidenceSubject?: string | null;
  consentedAt?: string | null;
};

export type DescriptorLearningRetrievalContext = {
  tenantId: string;
  frameworkId?: string | null;
  criterionId?: string | null;
  criterionCode?: string | null;
  sourceMode: DescriptorSourceMode;
  grammarShape?: string | null;
  criterionText?: string | null;
};

export type DescriptorLearningMatchType = 'same_criterion' | 'similar_pattern';

export type RankedDescriptorLearningRecord = DescriptorLearningRecord & {
  retrievalScore: number;
  retrievalReason: string;
  matchType: DescriptorLearningMatchType;
  criterionSimilarity: number;
};

const STOP_TOKENS = new Set([
  'that', 'this', 'these', 'those', 'with', 'from', 'into', 'will', 'shall', 'should', 'must',
  'have', 'has', 'been', 'being', 'their', 'there', 'where', 'which', 'within', 'through', 'including',
  'source', 'hybrid', 'evidence', 'documented', 'process', 'policy', 'criteria', 'criterion',
]);

export const SIMILAR_CRITERION_MIN_TOKEN_OVERLAP = 0.34;
export const STRONG_SIMILAR_CRITERION_MIN_TOKEN_OVERLAP = 0.55;

function tokenize(value?: string | null): Set<string> {
  return new Set(
    String(value ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 3 && !STOP_TOKENS.has(token)),
  );
}

export function descriptorCriterionTokenOverlap(left?: string | null, right?: string | null): number {
  const leftTokens = tokenize(left);
  const rightTokens = tokenize(right);
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;
  let overlap = 0;
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) overlap += 1;
  });
  return overlap / Math.max(leftTokens.size, rightTokens.size);
}

export function extractEvidenceSubjectFromDescriptor(descriptorText?: string | null): string | null {
  const text = String(descriptorText ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return null;

  const patterns = [
    /^Evidence that\s+(.+?)\s+is absent, weak, outdated, inconsistent, fragmented, or person-dependent\b/i,
    /^Evidence that\s+(.+?)\s+exists in some form\b/i,
    /^Evidence that\s+(.+?)\s+is current, complete, traceable\b/i,
    /^Evidence that\s+(.+?)\s+shows owner-led\b/i,
    /^Evidence that\s+(.+?)\s+is embedded\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim().replace(/[.;:,]+$/g, '');
  }

  const generic = text.match(/^Evidence that\s+(.+?)\s+(?:is|are|exists|shows)\b/i);
  if (generic?.[1]) return generic[1].trim().replace(/[.;:,]+$/g, '');

  return null;
}

export function getLearnedEvidenceSubject(record: DescriptorLearningRecord): string | null {
  return (
    record.learnedEvidenceSubject?.trim() ||
    extractEvidenceSubjectFromDescriptor(record.userCorrectedDescriptorText) ||
    null
  );
}

export function canUseDescriptorLearningRecordForTenant(
  record: DescriptorLearningRecord,
  currentTenantId: string,
): boolean {
  if (record.tenantId === currentTenantId) return true;

  return (
    record.reuseScope === 'approved_global_methodology_pattern' &&
    record.reviewStatus === 'approved_global'
  );
}

function lifecycleAllowsRetrieval(record: DescriptorLearningRecord): boolean {
  if (record.conflictStatus === 'conflict_flagged') return false;
  return ['active', 'validated', 'approved_global'].includes(record.reviewStatus);
}

function freshnessScore(createdAt?: string | null): number {
  if (!createdAt) return 0;
  const timestamp = Date.parse(createdAt);
  if (!Number.isFinite(timestamp)) return 0;
  const ageDays = Math.max(0, (Date.now() - timestamp) / 86_400_000);
  if (ageDays <= 30) return 3;
  if (ageDays <= 180) return 2;
  if (ageDays <= 365) return 1;
  return 0;
}

function resolveMatchType(
  record: DescriptorLearningRecord,
  context: DescriptorLearningRetrievalContext,
  similarity: number,
): DescriptorLearningMatchType | null {
  const sameCriterion = Boolean(
    record.criterionId && context.criterionId && record.criterionId === context.criterionId,
  );
  const sameCriterionCode = Boolean(
    record.criterionCode && context.criterionCode && record.criterionCode === context.criterionCode,
  );
  if (sameCriterion || sameCriterionCode) return 'same_criterion';

  const sameGrammar = Boolean(
    record.grammarShape && context.grammarShape && record.grammarShape === context.grammarShape,
  );
  const evidenceBundleGrammar = context.grammarShape === 'evidence_bundle_minutes_actions_decisions';

  if (sameGrammar && similarity >= SIMILAR_CRITERION_MIN_TOKEN_OVERLAP) return 'similar_pattern';
  if (evidenceBundleGrammar && sameGrammar && similarity >= 0.25) return 'similar_pattern';
  if (similarity >= STRONG_SIMILAR_CRITERION_MIN_TOKEN_OVERLAP) return 'similar_pattern';

  return null;
}

export function rankDescriptorLearningRecord(
  record: DescriptorLearningRecord,
  context: DescriptorLearningRetrievalContext,
): RankedDescriptorLearningRecord | null {
  if (!canUseDescriptorLearningRecordForTenant(record, context.tenantId)) return null;
  if (!lifecycleAllowsRetrieval(record)) return null;

  const similarity = descriptorCriterionTokenOverlap(record.originalCriterionText, context.criterionText);
  const matchType = resolveMatchType(record, context, similarity);
  if (!matchType) return null;

  let retrievalScore = matchType === 'same_criterion' ? 100 : 40;
  const reasons: string[] = [matchType === 'same_criterion' ? 'same-criterion' : 'relevance-threshold-met'];

  if (record.tenantId === context.tenantId) {
    retrievalScore += 10;
    reasons.push('same-tenant');
  } else {
    retrievalScore += 2;
    reasons.push('approved-global');
  }

  if (record.frameworkId && context.frameworkId && record.frameworkId === context.frameworkId) {
    retrievalScore += 5;
    reasons.push('same-framework');
  }

  if (record.sourceMode === context.sourceMode) {
    retrievalScore += 3;
    reasons.push('same-source-mode');
  }

  if (record.grammarShape && context.grammarShape && record.grammarShape === context.grammarShape) {
    retrievalScore += 10;
    reasons.push('same-grammar-shape');
  }

  if (similarity > 0) {
    retrievalScore += Math.round(similarity * 30);
    reasons.push(`criterion-similarity:${similarity.toFixed(2)}`);
  }

  if (getLearnedEvidenceSubject(record)) {
    retrievalScore += 2;
    reasons.push('learned-evidence-subject');
  }

  retrievalScore += Math.min(record.reuseSuccessCount ?? 0, 5);
  retrievalScore += freshnessScore(record.createdAt ?? record.consentedAt);

  return {
    ...record,
    retrievalScore,
    retrievalReason: reasons.join(', '),
    matchType,
    criterionSimilarity: similarity,
  };
}

export function retrieveDescriptorLearningRecords(
  records: DescriptorLearningRecord[],
  context: DescriptorLearningRetrievalContext,
  limit = 7,
): RankedDescriptorLearningRecord[] {
  const safeLimit = Math.max(0, Math.min(limit, 10));

  return records
    .map((record) => rankDescriptorLearningRecord(record, context))
    .filter((record): record is RankedDescriptorLearningRecord => Boolean(record))
    .sort((left, right) => {
      if (left.matchType !== right.matchType) return left.matchType === 'same_criterion' ? -1 : 1;
      if (right.retrievalScore !== left.retrievalScore) return right.retrievalScore - left.retrievalScore;
      return (right.reuseSuccessCount ?? 0) - (left.reuseSuccessCount ?? 0);
    })
    .slice(0, safeLimit);
}
