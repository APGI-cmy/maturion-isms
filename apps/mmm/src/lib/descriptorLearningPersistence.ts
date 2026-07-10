import type { DescriptorLearningRecord, DescriptorSourceMode } from './descriptorLearningRetrieval';

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as UnknownRecord) : {};
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeSourceMode(value: unknown): DescriptorSourceMode | null {
  if (value === 'verbatim_source' || value === 'VERBATIM') return 'verbatim_source';
  if (value === 'hybrid_source' || value === 'HYBRID') return 'hybrid_source';
  if (value === 'new_generation_context' || value === 'GENERATED') return 'new_generation_context';
  return null;
}

export type DescriptorLearningInteractionRow = {
  id?: string | null;
  target_entity_id?: string | null;
  status?: string | null;
  created_at?: string | null;
  request_json?: unknown;
  response_json?: unknown;
};

export function descriptorLearningRecordsFromInteractions(
  rows: DescriptorLearningInteractionRow[],
): DescriptorLearningRecord[] {
  return rows.flatMap((row) => {
    const request = asRecord(row.request_json);
    const response = asRecord(row.response_json);
    const learningEvents = Array.isArray(request.learning_events) ? request.learning_events : [];
    const tenantId = asString(request.tenant_id) ?? asString(request.organisation_id);
    if (!tenantId) return [];

    return learningEvents.map((event, index) => {
      const learningEvent = asRecord(event);
      const sourceMode = normalizeSourceMode(request.source_mode);
      const criterionText = asString(request.criterion_text);
      const inferredGrammarShape = criterionText
        ? /\bminutes\b/i.test(criterionText) && /\bactions\b/i.test(criterionText) && /\bdecisions\b/i.test(criterionText)
          ? 'evidence_bundle_minutes_actions_decisions'
          : /^Review and approval of\b/i.test(criterionText)
            ? 'nominal_review_and_approval'
            : null
        : null;

      return {
        id: `${row.id ?? row.target_entity_id ?? 'descriptor-learning'}:${index}`,
        tenantId,
        frameworkId: asString(request.framework_id),
        criterionId: asString(request.criterion_id) ?? row.target_entity_id ?? null,
        criterionCode: asString(request.criterion_code),
        sourceMode,
        grammarShape: asString(request.grammar_shape) ?? inferredGrammarShape,
        reuseScope: asString(response.reuse_scope) ?? 'tenant_specific_pattern',
        reviewStatus: asString(response.review_status) ?? (row.status === 'recorded' ? 'validated' : 'active'),
        conflictStatus: asString(response.conflict_status) ?? 'none',
        reuseSuccessCount: asNumber(response.reuse_success_count) ?? 0,
        createdAt: asString(row.created_at),
        originalCriterionText: criterionText,
        originalGeneratedDescriptorText: asString(learningEvent.original_generated_descriptor_text),
        userCorrectedDescriptorText: asString(learningEvent.user_corrected_descriptor_text),
        maturityLevelCorrected: asNumber(learningEvent.level),
        correctionCategory: asString(learningEvent.correction_category),
        transformationSummary: asString(learningEvent.transformation_summary),
        reusablePatternCandidateText: asString(learningEvent.reusable_pattern_candidate_text),
        learnedEvidenceSubject: asString(learningEvent.learned_evidence_subject),
        consentedAt: asString(response.consented_at),
      } satisfies DescriptorLearningRecord;
    });
  });
}
