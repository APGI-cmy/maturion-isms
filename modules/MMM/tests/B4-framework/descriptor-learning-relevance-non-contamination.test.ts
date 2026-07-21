import { describe, expect, it } from 'vitest';
import {
  EVIDENCE_BUNDLE_MIN_TOKEN_OVERLAP,
  SIMILAR_CRITERION_MIN_TOKEN_OVERLAP,
  descriptorCriterionTokenOverlap,
  retrieveDescriptorLearningRecords,
  type DescriptorLearningRecord,
} from '../../../../apps/mmm/src/lib/descriptorLearningRetrieval';
import { generateDescriptorReasoningResult } from '../../../../apps/mmm/src/lib/descriptorReasoning';

const learnedMeetingRecord: DescriptorLearningRecord = {
  id: 'meeting-learning',
  tenantId: 'framework-1',
  frameworkId: 'framework-1',
  criterionId: 'criterion-meeting',
  criterionCode: 'D001.MPS002.C017',
  reuseScope: 'tenant_specific_pattern',
  reviewStatus: 'validated',
  conflictStatus: 'none',
  sourceMode: 'hybrid_source',
  grammarShape: 'evidence_bundle_minutes_actions_decisions',
  originalCriterionText:
    'The committee will meet monthly. Minutes will be taken of these meetings, actions agreed, decisions recorded, and owners made accountable for their delivery.',
  learnedEvidenceSubject:
    'the committee meets monthly, minutes record actions, decisions, accountable owners, and delivery status',
  correctionCategory: 'evidence_bundle_preservation',
};

describe('T-MMM-DLRN-001: explicit descriptor-learning relevance threshold', () => {
  it('exports and applies explicit similar-criterion and evidence-bundle overlap thresholds', () => {
    expect(EVIDENCE_BUNDLE_MIN_TOKEN_OVERLAP).toBeGreaterThan(0);
    expect(EVIDENCE_BUNDLE_MIN_TOKEN_OVERLAP).toBeLessThan(SIMILAR_CRITERION_MIN_TOKEN_OVERLAP);
    expect(SIMILAR_CRITERION_MIN_TOKEN_OVERLAP).toBeGreaterThan(0);
    expect(
      descriptorCriterionTokenOverlap(
        learnedMeetingRecord.originalCriterionText,
        'A documented governance charter defines leadership responsibilities and decision authority.',
      ),
    ).toBeLessThan(EVIDENCE_BUNDLE_MIN_TOKEN_OVERLAP);
  });

  it('does not retrieve learning merely because tenant, framework, and source mode match', () => {
    const retrieved = retrieveDescriptorLearningRecords([learnedMeetingRecord], {
      tenantId: 'framework-1',
      frameworkId: 'framework-1',
      criterionId: 'criterion-charter',
      criterionCode: 'D001.MPS001.C003',
      sourceMode: 'hybrid_source',
      grammarShape: 'standard_clause',
      criterionText:
        'A documented governance charter defines leadership responsibilities and decision authority.',
    });

    expect(retrieved).toEqual([]);
  });
});

describe('T-MMM-DLRN-002: same-criterion replay remains direct', () => {
  it('replays the corrected evidence subject for the same criterion', () => {
    const result = generateDescriptorReasoningResult({
      tenantId: 'framework-1',
      frameworkId: 'framework-1',
      criterionId: 'criterion-meeting',
      criterionCode: 'D001.MPS002.C017',
      sourceMode: 'hybrid_source',
      criterionText: learnedMeetingRecord.originalCriterionText ?? '',
      learningRecords: [learnedMeetingRecord],
    });

    expect(result.learningApplied).toBe(true);
    expect(result.retrievedLearningRecords[0]?.matchType).toBe('same_criterion');
    expect(result.evidenceStateClause).toBe(learnedMeetingRecord.learnedEvidenceSubject);
  });
});

describe('T-MMM-DLRN-003: similar criteria use a pattern, not old wording', () => {
  it('preserves the new criterion actor and evidence objects without pasting old or generic wording', () => {
    const result = generateDescriptorReasoningResult({
      tenantId: 'framework-1',
      frameworkId: 'framework-1',
      criterionId: 'criterion-forum',
      criterionCode: 'D999.MPS888.C777',
      sourceMode: 'hybrid_source',
      criterionText:
        'The governance forum will meet monthly. Minutes will be taken of these meetings, actions agreed, decisions recorded, and owners made accountable for their delivery.',
      learningRecords: [learnedMeetingRecord],
    });

    expect(result.learningApplied).toBe(true);
    expect(result.retrievedLearningRecords[0]?.matchType).toBe('similar_pattern');
    expect(result.evidenceStateClause).toContain('governance forum');
    expect(result.evidenceStateClause).toContain('minutes');
    expect(result.evidenceStateClause).toContain('actions');
    expect(result.evidenceStateClause).toContain('decisions');
    expect(result.evidenceStateClause).toContain('accountable');
    expect(result.evidenceStateClause).not.toContain('the committee meets monthly');
    expect(result.evidenceStateClause).not.toContain('DCC');
    expect(result.evidenceStateClause).not.toContain('with the meeting cadence and related evidence bundle preserved for this criterion');
  });

  it('does not claim learning was applied when only a mismatched-grammar similar record is retrieved', () => {
    const mismatchedGrammarRecord: DescriptorLearningRecord = {
      ...learnedMeetingRecord,
      id: 'standard-clause-learning',
      criterionId: 'criterion-standard',
      criterionCode: 'D010.MPS010.C010',
      grammarShape: 'standard_clause',
      originalCriterionText:
        'The governance forum meets monthly and records minutes, actions, decisions and accountable owners for delivery.',
    };

    const criterionText =
      'The assurance forum will meet monthly. Minutes will be taken of these meetings, actions agreed, decisions recorded, and owners made accountable for their delivery.';
    const result = generateDescriptorReasoningResult({
      tenantId: 'framework-1',
      frameworkId: 'framework-1',
      criterionId: 'criterion-assurance-forum',
      criterionCode: 'D020.MPS020.C020',
      sourceMode: 'hybrid_source',
      criterionText,
      learningRecords: [mismatchedGrammarRecord],
    });

    expect(result.retrievedLearningRecords[0]?.matchType).toBe('similar_pattern');
    expect(result.retrievedLearningRecords[0]?.grammarShape).toBe('standard_clause');
    expect(result.learningApplied).toBe(false);
    expect(result.fallbackMethodologyApplied).toBe(true);
    expect(result.evidenceStateClause).toContain('assurance forum');
    expect(result.evidenceStateClause).not.toContain('committee');
  });
});

describe('T-MMM-DLRN-004: unrelated criteria cannot be contaminated', () => {
  it('keeps governance-charter descriptors criterion-specific and reports no learning', () => {
    const criterionText =
      'A documented governance charter defines leadership responsibilities and decision authority (hybrid source).';
    const result = generateDescriptorReasoningResult({
      tenantId: 'framework-1',
      frameworkId: 'framework-1',
      criterionId: 'criterion-charter',
      criterionCode: 'D001.MPS001.C003',
      sourceMode: 'hybrid_source',
      criterionText,
      learningRecords: [learnedMeetingRecord],
    });

    expect(result.learningApplied).toBe(false);
    expect(result.retrievedLearningRecords).toEqual([]);
    expect(result.evidenceStateClause).toContain('governance charter');
    expect(result.evidenceStateClause).not.toContain('committee');
    expect(result.evidenceStateClause).not.toContain('minutes');
  });

  it('keeps induction-policy descriptors criterion-specific and reports no learning', () => {
    const criterionText =
      'The Policy will be incorporated into the operation’s induction process for all personnel, contractors and visitors. A process will exist for recording that all personnel, contractors and visitors understand and agree to comply with it.';
    const result = generateDescriptorReasoningResult({
      tenantId: 'framework-1',
      frameworkId: 'framework-1',
      criterionId: 'criterion-induction',
      criterionCode: 'D002.MPS004.C010',
      sourceMode: 'hybrid_source',
      criterionText,
      learningRecords: [learnedMeetingRecord],
    });

    expect(result.learningApplied).toBe(false);
    expect(result.retrievedLearningRecords).toEqual([]);
    expect(result.evidenceStateClause).toContain('induction process');
    expect(result.evidenceStateClause).not.toContain('committee');
    expect(result.evidenceStateClause).not.toContain('minutes');
  });
});
