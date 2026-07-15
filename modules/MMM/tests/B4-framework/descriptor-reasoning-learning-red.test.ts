import { describe, expect, it } from 'vitest';
import {
  canUseDescriptorLearningRecordForTenant,
  extractEvidenceSubjectFromDescriptor,
  retrieveDescriptorLearningRecords,
  type DescriptorLearningRecord,
} from '../../../../apps/mmm/src/lib/descriptorLearningRetrieval';
import { descriptorLearningRecordsFromInteractions } from '../../../../apps/mmm/src/lib/descriptorLearningPersistence';
import {
  cleanCriterionForDescriptorReasoning,
  classifyDescriptorGrammarShape,
  generateDescriptorReasoningResult,
  reconstructEvidenceStateClause,
} from '../../../../apps/mmm/src/lib/descriptorReasoning';

// -----------------------------------------------------------------------------
// Issue #1900 / #1914 QA-to-RED expansion
// MMM Descriptor Reasoning + Governed Learning Retrieval/Persistence
// -----------------------------------------------------------------------------

describe('T-MMM-DRGL-001: verbatim nominal phrase descriptor reasoning', () => {
  it('reconstructs "Review and approval of X" into an evidence-state clause', () => {
    const result = generateDescriptorReasoningResult({
      tenantId: 'tenant-a',
      frameworkId: 'framework-1',
      criterionId: 'criterion-1',
      criterionText: 'Review and approval of facility design changes for adequate Security measures.',
      sourceMode: 'verbatim_source',
    });

    expect(result.sourceMode).toBe('verbatim_source');
    expect(result.grammarShape).toBe('nominal_review_and_approval');
    expect(result.evidenceStateClause).toBe(
      'facility design changes are reviewed and approved for adequate Security measures',
    );
    expect(result.descriptors[0].descriptorText).toContain(
      'Evidence that facility design changes are reviewed and approved for adequate Security measures is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
    );
    expect(result.descriptors[0].descriptorText).not.toContain('Evidence that Review and approval of facility design changes');
  });

  it('reconstructs a later similar "Review and approval of X" clause consistently', () => {
    expect(
      reconstructEvidenceStateClause(
        'Review and approval of emergency response changes for adequate Security measures.',
      ),
    ).toBe('emergency response changes are reviewed and approved for adequate Security measures');
  });
});

describe('T-MMM-DUIR-002: DCC evidence bundle preservation', () => {
  it('preserves minutes, actions, decisions, accountability, and delivery traceability', () => {
    const result = generateDescriptorReasoningResult({
      tenantId: 'tenant-a',
      frameworkId: 'framework-1',
      criterionId: 'D001.MPS002.C017',
      criterionText:
        'The DCC will meet at least four times a year. Minutes will be taken of these meetings, actions agreed, decisions recorded, and individuals made accountable for their delivery.',
      sourceMode: 'verbatim_source',
    });

    expect(result.grammarShape).toBe('evidence_bundle_minutes_actions_decisions');
    expect(result.evidenceStateClause).toContain('the DCC meets at least four times a year');
    expect(result.evidenceStateClause).toContain('minutes are taken');
    expect(result.evidenceStateClause).toContain('actions are agreed');
    expect(result.evidenceStateClause).toContain('decisions are recorded');
    expect(result.evidenceStateClause).toContain('individuals are made accountable');
    expect(result.evidenceStateClause).toContain('delivery or implementation is traceable');
    expect(result.descriptors[0].descriptorText).not.toBe(
      'Evidence that the DCC meets at least four times a year is absent, weak, outdated, inconsistent, fragmented, or person-dependent. Records do not yet show repeatable ownership, communication, execution, review, or reliable evidence retention.',
    );
  });
});

describe('T-MMM-DRGL-003 and T-MMM-DRGL-014: source mode and fallback reporting', () => {
  it('includes source mode and reports deterministic fallback when learning is unavailable', () => {
    const result = generateDescriptorReasoningResult({
      tenantId: 'tenant-a',
      criterionText: 'The policy should be prominently displayed.',
      sourceMode: 'verbatim_source',
      learningRecords: [],
    });

    expect(result.sourceMode).toBe('verbatim_source');
    expect(result.learningApplied).toBe(false);
    expect(result.fallbackMethodologyApplied).toBe(true);
    expect(result.evidenceStateClause).toBe('The policy is prominently displayed');
  });
});

describe('T-MMM-DRGL-004 and T-MMM-DRGL-005: guidance stripping and instruction wording', () => {
  it('strips Note/Guidance/Reference content while preserving plural grammar', () => {
    const criterion =
      'Specific Security accountabilities and performance measures should be documented within role descriptions. (Note: This is especially important during high-risk diamond handling activities.)';

    expect(cleanCriterionForDescriptorReasoning(criterion)).not.toContain('Note:');
    expect(reconstructEvidenceStateClause(criterion)).toBe(
      'Specific Security accountabilities and performance measures are documented within role descriptions',
    );
  });

  it('normalises gerund and instruction wording into evidence-state clauses', () => {
    expect(
      reconstructEvidenceStateClause('Assessing incentive schemes and measures for their impact on Security;'),
    ).toBe('incentive schemes and measures are assessed for their impact on Security');

    expect(
      reconstructEvidenceStateClause(
        'Security roles and responsibilities are to be clearly defined and presented in the form of a RACI chart.',
      ),
    ).toBe('Security roles and responsibilities are clearly defined and presented in the form of a RACI chart');
  });
});

describe('T-MMM-DRGL-010 to T-MMM-DRGL-013: governed learning retrieval', () => {
  it('excludes anonymised global candidates from cross-tenant descriptor retrieval through the production guardrail', () => {
    const record: DescriptorLearningRecord = {
      tenantId: 'tenant-a',
      reuseScope: 'anonymised_global_pattern_candidate',
      reviewStatus: 'candidate',
    };

    expect(canUseDescriptorLearningRecordForTenant(record, 'tenant-b')).toBe(false);
  });

  it('allows only approved global methodology records across tenants through the production guardrail', () => {
    const record: DescriptorLearningRecord = {
      tenantId: 'tenant-a',
      reuseScope: 'approved_global_methodology_pattern',
      reviewStatus: 'approved_global',
    };

    expect(canUseDescriptorLearningRecordForTenant(record, 'tenant-b')).toBe(true);
  });

  it('ranks, scopes, bounds, and excludes conflict-flagged learning records', () => {
    const records: DescriptorLearningRecord[] = [
      {
        id: 'global-candidate',
        tenantId: 'other-tenant',
        reuseScope: 'anonymised_global_pattern_candidate',
        reviewStatus: 'candidate',
        sourceMode: 'verbatim_source',
        grammarShape: 'nominal_review_and_approval',
      },
      {
        id: 'conflict',
        tenantId: 'tenant-a',
        reuseScope: 'tenant_specific_pattern',
        reviewStatus: 'active',
        conflictStatus: 'conflict_flagged',
      },
      {
        id: 'same-criterion',
        tenantId: 'tenant-a',
        frameworkId: 'framework-1',
        criterionId: 'criterion-1',
        reuseScope: 'tenant_specific_pattern',
        reviewStatus: 'validated',
        sourceMode: 'verbatim_source',
        grammarShape: 'nominal_review_and_approval',
        reuseSuccessCount: 5,
      },
    ];

    const retrieved = retrieveDescriptorLearningRecords(records, {
      tenantId: 'tenant-a',
      frameworkId: 'framework-1',
      criterionId: 'criterion-1',
      sourceMode: 'verbatim_source',
      grammarShape: 'nominal_review_and_approval',
    });

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].id).toBe('same-criterion');
    expect(retrieved[0].retrievalScore).toBeGreaterThan(0);
  });

  it('applies retrieved learning state when permitted learning records are present', () => {
    const result = generateDescriptorReasoningResult({
      tenantId: 'tenant-a',
      frameworkId: 'framework-1',
      criterionId: 'criterion-1',
      sourceMode: 'verbatim_source',
      criterionText: 'Review and approval of facility design changes for adequate Security measures.',
      learningRecords: [
        {
          tenantId: 'tenant-a',
          frameworkId: 'framework-1',
          criterionId: 'criterion-1',
          reuseScope: 'tenant_specific_pattern',
          reviewStatus: 'validated',
          sourceMode: 'verbatim_source',
          grammarShape: classifyDescriptorGrammarShape(
            'Review and approval of facility design changes for adequate Security measures.',
          ),
        },
      ],
    });

    expect(result.learningApplied).toBe(true);
    expect(result.fallbackMethodologyApplied).toBe(false);
    expect(result.retrievedLearningRecords).toHaveLength(1);
  });
});

describe('T-MMM-DRGL-015: maturity levels remain distinct operating states', () => {
  it('generates five distinct maturity descriptors', () => {
    const result = generateDescriptorReasoningResult({
      tenantId: 'tenant-a',
      criterionText: 'Review and approval of facility design changes for adequate Security measures.',
      sourceMode: 'verbatim_source',
    });

    expect(result.descriptors).toHaveLength(5);
    expect(new Set(result.descriptors.map((descriptor) => descriptor.descriptorText)).size).toBe(5);
  });
});

describe('T-MMM-DLPR: persisted descriptor learning replay', () => {
  it('extracts corrected evidence subjects from user-corrected descriptors', () => {
    expect(
      extractEvidenceSubjectFromDescriptor(
        'Evidence that the committee meets quarterly, minutes record actions, decisions, accountable owners, and delivery status is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
      ),
    ).toBe('the committee meets quarterly, minutes record actions, decisions, accountable owners, and delivery status');
  });

  it('maps persisted consented interactions into tenant-scoped learning records', () => {
    const records = descriptorLearningRecordsFromInteractions([
      {
        id: 'interaction-1',
        target_entity_id: 'criterion-1',
        status: 'recorded',
        created_at: '2026-07-08T10:00:00Z',
        request_json: {
          tenant_id: 'tenant-a',
          framework_id: 'framework-1',
          source_mode: 'verbatim_source',
          criterion_id: 'criterion-1',
          criterion_code: 'D001.MPS002.C017',
          criterion_text:
            'The DCC will meet at least four times a year. Minutes will be taken of these meetings, actions agreed, decisions recorded, and individuals made accountable for their delivery.',
          learning_events: [
            {
              level: 1,
              original_generated_descriptor_text: 'Evidence that the DCC meets at least four times a year is absent...',
              user_corrected_descriptor_text:
                'Evidence that the DCC meets at least four times a year, minutes record actions, decisions, accountable individuals, and delivery status is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
              learned_evidence_subject:
                'the DCC meets at least four times a year, minutes record actions, decisions, accountable individuals, and delivery status',
              correction_category: 'evidence_bundle_preservation',
              reusable_pattern_candidate_text:
                'Preserve meeting cadence, minutes, actions, decisions, accountability and delivery evidence.',
            },
          ],
        },
        response_json: {
          reuse_scope: 'tenant_specific_pattern',
          review_status: 'validated',
          conflict_status: 'none',
          consented_at: '2026-07-08T10:00:00Z',
        },
      },
    ]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      tenantId: 'tenant-a',
      frameworkId: 'framework-1',
      criterionId: 'criterion-1',
      reuseScope: 'tenant_specific_pattern',
      reviewStatus: 'validated',
      conflictStatus: 'none',
      correctionCategory: 'evidence_bundle_preservation',
    });
  });

  it('replays learned evidence subject across all five maturity levels without copying one level', () => {
    const result = generateDescriptorReasoningResult({
      tenantId: 'tenant-a',
      frameworkId: 'framework-1',
      criterionId: 'criterion-1',
      criterionCode: 'D001.MPS002.C017',
      sourceMode: 'verbatim_source',
      criterionText:
        'The DCC will meet at least four times a year. Minutes will be taken of these meetings, actions agreed, decisions recorded, and individuals made accountable for their delivery.',
      learningRecords: [
        {
          tenantId: 'tenant-a',
          frameworkId: 'framework-1',
          criterionId: 'criterion-1',
          criterionCode: 'D001.MPS002.C017',
          reuseScope: 'tenant_specific_pattern',
          reviewStatus: 'validated',
          conflictStatus: 'none',
          sourceMode: 'verbatim_source',
          grammarShape: 'evidence_bundle_minutes_actions_decisions',
          originalCriterionText:
            'The DCC will meet at least four times a year. Minutes will be taken of these meetings, actions agreed, decisions recorded, and individuals made accountable for their delivery.',
          learnedEvidenceSubject:
            'the DCC meets at least four times a year, minutes record actions, decisions, accountable individuals, and delivery status',
        },
      ],
    });

    expect(result.learningApplied).toBe(true);
    expect(result.evidenceStateClause).toContain('minutes record actions');
    expect(result.descriptors).toHaveLength(5);
    expect(new Set(result.descriptors.map((descriptor) => descriptor.descriptorText)).size).toBe(5);
    result.descriptors.forEach((descriptor) => {
      expect(descriptor.descriptorText).toContain('minutes record actions');
      expect(descriptor.descriptorText).toContain('accountable individuals');
      expect(descriptor.descriptorText).toContain('delivery status');
    });
  });

  it('uses similar-criterion reasoning patterns without hard-coding DCC or criterion code', () => {
    const result = generateDescriptorReasoningResult({
      tenantId: 'tenant-a',
      frameworkId: 'framework-1',
      criterionId: 'criterion-2',
      criterionCode: 'D999.MPS888.C777',
      sourceMode: 'verbatim_source',
      criterionText:
        'The governance forum will meet monthly. Minutes will be taken of these meetings, actions agreed, decisions recorded, and owners made accountable for their delivery.',
      learningRecords: [
        {
          tenantId: 'tenant-a',
          frameworkId: 'framework-1',
          criterionId: 'criterion-1',
          criterionCode: 'D001.MPS002.C017',
          reuseScope: 'tenant_specific_pattern',
          reviewStatus: 'validated',
          sourceMode: 'verbatim_source',
          grammarShape: 'evidence_bundle_minutes_actions_decisions',
          originalCriterionText:
            'The committee will meet monthly. Minutes will be taken of these meetings, actions agreed, decisions recorded, and owners made accountable for their delivery.',
          learnedEvidenceSubject:
            'meeting cadence, minutes, agreed actions, recorded decisions, accountable owners, and delivery status are traceable',
        },
      ],
    });

    expect(result.learningApplied).toBe(true);
    expect(result.evidenceStateClause).toContain('meeting cadence');
    expect(result.evidenceStateClause).not.toContain('DCC');
    expect(result.evidenceStateClause).not.toContain('D001.MPS002.C017');
  });
});

describe('T-MMM-DUIR-003: descriptor reasoning adapter yields ordered level drafts', () => {
  it('maps reasoning output into Basic→Resilient level drafts (1-5)', async () => {
    const { descriptorReasoningDraftsFromResult } = await import(
      '../../../../apps/mmm/src/components/assessment/CriteriaManagement'
    );
    const result = generateDescriptorReasoningResult({
      tenantId: 'tenant-a',
      criterionText: 'Review and approval of facility design changes for adequate Security measures.',
      sourceMode: 'verbatim_source',
    });

    const drafts = descriptorReasoningDraftsFromResult(result);
    expect(drafts).toHaveLength(5);
    expect(drafts.map((draft) => draft.level)).toEqual([1, 2, 3, 4, 5]);
    expect(drafts.map((draft) => draft.label)).toEqual([
      'Basic',
      'Reactive',
      'Compliant',
      'Proactive',
      'Resilient',
    ]);
    drafts.forEach((draft) => {
      expect(draft.descriptor_text.length).toBeGreaterThan(0);
    });
  });
});
