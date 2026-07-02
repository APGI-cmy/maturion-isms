import { describe, expect, it } from 'vitest';
import {
  normalizeDescriptorEvidenceGrammar,
} from '../../../../apps/mmm/src/components/assessment/CriteriaManagement';
import {
  canUseDescriptorLearningRecordForTenant,
  type DescriptorLearningRecord,
} from '../../../../apps/mmm/src/lib/descriptorLearningRetrieval';

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
  it('strips Note/Guidance/Reference content from evidence leads while preserving plural grammar', () => {
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

  it('continues to allow tenant-specific learning for the same tenant', () => {
    const record: DescriptorLearningRecord = {
      tenantId: 'tenant-a',
      reuseScope: 'tenant_specific_pattern',
      reviewStatus: 'active',
    };

    expect(canUseDescriptorLearningRecordForTenant(record, 'tenant-a')).toBe(true);
  });
});
