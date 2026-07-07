export type DescriptorSourceMode = 'verbatim_source' | 'hybrid_source' | 'new_generation_context';

export type DescriptorLearningRecord = {
  id?: string;
  tenantId: string;
  frameworkId?: string | null;
  criterionId?: string | null;
  sourceMode?: DescriptorSourceMode | string | null;
  grammarShape?: string | null;
  reuseScope: string;
  reviewStatus: string;
  conflictStatus?: string | null;
  reuseSuccessCount?: number | null;
  createdAt?: string | null;
};

export type DescriptorLearningRetrievalContext = {
  tenantId: string;
  frameworkId?: string | null;
  criterionId?: string | null;
  sourceMode: DescriptorSourceMode;
  grammarShape?: string | null;
};

export type RankedDescriptorLearningRecord = DescriptorLearningRecord & {
  retrievalScore: number;
  retrievalReason: string;
};

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

export function rankDescriptorLearningRecord(
  record: DescriptorLearningRecord,
  context: DescriptorLearningRetrievalContext,
): RankedDescriptorLearningRecord | null {
  if (!canUseDescriptorLearningRecordForTenant(record, context.tenantId)) return null;
  if (!lifecycleAllowsRetrieval(record)) return null;

  let retrievalScore = 0;
  const reasons: string[] = [];

  if (record.tenantId === context.tenantId) {
    retrievalScore += 50;
    reasons.push('same-tenant');
  } else {
    retrievalScore += 10;
    reasons.push('approved-global');
  }

  if (record.criterionId && context.criterionId && record.criterionId === context.criterionId) {
    retrievalScore += 40;
    reasons.push('same-criterion');
  }

  if (record.frameworkId && context.frameworkId && record.frameworkId === context.frameworkId) {
    retrievalScore += 25;
    reasons.push('same-framework');
  }

  if (record.sourceMode === context.sourceMode) {
    retrievalScore += 20;
    reasons.push('same-source-mode');
  }

  if (record.grammarShape && context.grammarShape && record.grammarShape === context.grammarShape) {
    retrievalScore += 15;
    reasons.push('same-grammar-shape');
  }

  retrievalScore += Math.min(record.reuseSuccessCount ?? 0, 10);
  retrievalScore += freshnessScore(record.createdAt);

  return {
    ...record,
    retrievalScore,
    retrievalReason: reasons.join(', ') || 'permitted-fallback',
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
      if (right.retrievalScore !== left.retrievalScore) return right.retrievalScore - left.retrievalScore;
      return (right.reuseSuccessCount ?? 0) - (left.reuseSuccessCount ?? 0);
    })
    .slice(0, safeLimit);
}
