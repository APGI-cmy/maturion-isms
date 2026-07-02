import { describe, expect, it } from 'vitest';
import {
  normalizeDescriptorEvidenceGrammar,
} from '../../../../apps/mmm/src/components/assessment/CriteriaManagement';

// -----------------------------------------------------------------------------
// Issue #1900 / PR #1898 QA-to-RED expansion
// MMM Descriptor Reasoning + Governed Learning Retrieval
//
// These tests intentionally codify the first failing runtime expectations before
// implementation. They prove that the existing descriptor grammar closure is not
// enough for verbatim-source descriptor reasoning.
// -----------------------------------------------------------------------------

describe('T-MMM-DRGL-001: verbatim nominal phrase descriptor reasoning', () => {
  it('reconstructs "Review and approval of X" into an evidence-state clause', () => {
    const descriptor = normalizeDescriptorEvidenceGrammar(
      'Evidence that Review and approval of facility design changes for adequate Security measures is absent, weak, outdated, inconsistent, fragmented, or person-dependent. Records do not yet show repeatable ownership, communication, execution, review, or reliable evidence retention.',
    );

    expect(descriptor).toContain(
      'Evidence that facility design changes are reviewed and approved for adequate Security measures is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
    );
    expect(descriptor).not.toContain('Evidence that Review and approval of facility design changes');
  });

  it('reconstructs a later similar "Review and approval of X" clause consistently', () => {
    const descriptor = normalizeDescriptorEvidenceGrammar(
      'Evidence that Review and approval of emergency response changes for adequate Security measures is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
    );

    expect(descriptor).toContain(
      'Evidence that emergency response changes are reviewed and approved for adequate Security measures is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
    );
    expect(descriptor).not.toContain('Evidence that Review and approval of emergency response changes');
  });
});

describe('T-MMM-DRGL-004: guidance material is not used as descriptor subject', () => {
  it('strips Note/Guidance/Reference content from evidence leads', () => {
    const descriptor = normalizeDescriptorEvidenceGrammar(
      'Evidence that Specific Security accountabilities and performance measures should be documented within role descriptions. (Note: This is especially important during high-risk diamond handling activities.) is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
    );

    expect(descriptor).toContain(
      'Evidence that Specific Security accountabilities and performance measures are documented within role descriptions is absent, weak, outdated, inconsistent, fragmented, or person-dependent.',
    );
    expect(descriptor).not.toContain('Note:');
    expect(descriptor).not.toContain('This is especially important');
  });
});

describe('T-MMM-DRGL-013: tenant isolation learning retrieval guardrail', () => {
  type LearningRecord = {
    organisation_id: string;
    approved_for_reuse_scope: string;
    review_status: string;
  };

  const canUseLearningRecordForOrganisation = (
    record: LearningRecord,
    currentOrganisationId: string,
  ) =>
    record.organisation_id === currentOrganisationId ||
    (record.approved_for_reuse_scope === 'approved_global_methodology_pattern' &&
      record.review_status === 'approved_global');

  it('excludes anonymised global candidates from cross-tenant descriptor retrieval', () => {
    const record: LearningRecord = {
      organisation_id: 'organisation-a',
      approved_for_reuse_scope: 'anonymised_global_pattern_candidate',
      review_status: 'candidate',
    };

    expect(canUseLearningRecordForOrganisation(record, 'organisation-b')).toBe(false);
  });

  it('allows only approved global methodology records across tenants', () => {
    const record: LearningRecord = {
      organisation_id: 'organisation-a',
      approved_for_reuse_scope: 'approved_global_methodology_pattern',
      review_status: 'approved_global',
    };

    expect(canUseLearningRecordForOrganisation(record, 'organisation-b')).toBe(true);
  });
});
