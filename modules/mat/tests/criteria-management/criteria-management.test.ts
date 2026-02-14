/**
 * MAT Red Test Suite — CAT-02: criteria management
 *
 * QA-to-Red: All tests MUST fail with NOT_IMPLEMENTED.
 * These tests define expected behavior before implementation exists.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  uploadCriteriaDocument,
  parseCriteriaDocument,
  validateNoHallucination,
  validateCoverageRule,
  approveParsedCriteria,
  validateCriteriaNumberingImmutability,
  markCriterionNotUsed,
  trackCriterionStatus
} from '../../src/services/criteria-management.js';
import type { Criterion } from '../../src/types/index.js';

describe('CAT-02: criteria management', () => {
  it('MAT-T-0004: Criteria Document Upload', () => {
    // Architecture: §3.12 Path 2 — Criteria Upload & AI Parsing
    // FRS: FR-004
    // TRS: TR-013
    // Type: integration | Priority: P0
    
    const fileContent = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
    const fileName = 'iso27001.pdf';
    const mimeType = 'application/pdf';

    const result = uploadCriteriaDocument(fileContent, fileName, mimeType);

    expect(result).toBeDefined();
    expect(result.file_path).toContain(fileName);
    expect(result.sha256_hash).toBeDefined();
    expect(result.sha256_hash).toHaveLength(64); // SHA-256 produces 64 hex characters
    expect(result.file_size).toBe(5); // 5 bytes
  });

  it('MAT-T-0005: AI Criteria Parsing', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-005
    // TRS: TR-037
    // Type: integration | Priority: P0
    
    const sourceText = `
A.5.1 Information Security Policies
Management direction for information security
A.5.2 Review of Information Security Policies
Ensuring policies remain suitable and effective
A.5.3 Document Control
Protecting and controlling documents
`;

    const result = parseCriteriaDocument(sourceText, 3);

    expect(result).toBeDefined();
    expect(result.criteria).toHaveLength(3);
    expect(result.criteria[0].number).toBe('A.5.1');
    expect(result.criteria[0].title).toContain('Information Security Policies');
    expect(result.coverage_ratio).toBeGreaterThanOrEqual(0.95);
    expect(result.is_valid).toBe(true);
  });

  it('MAT-T-0006: No-Hallucination Rule', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-006
    // TRS: TR-037
    // Type: unit | Priority: P0
    
    const sourceText = `
A.5.1 Information Security Policies
Management direction for information security
`;

    // Valid criteria - should pass
    const validCriteria = [{
      number: 'A.5.1',
      title: 'Information Security Policies',
      description: 'Management direction for information security',
      source_text: 'A.5.1 Information Security Policies\nManagement direction for information security'
    }];

    const validResult = validateNoHallucination(validCriteria, sourceText);
    expect(validResult.valid).toBe(true);
    expect(validResult.hallucinations).toHaveLength(0);

    // Hallucinated criteria - should fail
    const hallucinatedCriteria = [{
      number: 'A.9.9',
      title: 'Fake Security Control',
      description: 'This does not exist in source',
      source_text: 'A.9.9 Fake Security Control'
    }];

    const invalidResult = validateNoHallucination(hallucinatedCriteria, sourceText);
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.hallucinations.length).toBeGreaterThan(0);
  });

  it('MAT-T-0007: Coverage Rule', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-007
    // TRS: TR-037
    // Type: unit | Priority: P0
    
    // Full coverage - should pass
    const fullCriteria = [
      { number: 'A.5.1', title: 'Policy 1', description: 'Desc 1', source_text: '' },
      { number: 'A.5.2', title: 'Policy 2', description: 'Desc 2', source_text: '' },
      { number: 'A.5.3', title: 'Policy 3', description: 'Desc 3', source_text: '' },
      { number: 'A.5.4', title: 'Policy 4', description: 'Desc 4', source_text: '' },
      { number: 'A.5.5', title: 'Policy 5', description: 'Desc 5', source_text: '' }
    ];

    const fullResult = validateCoverageRule(fullCriteria, 5);
    expect(fullResult.coverage_ratio).toBe(1.0);
    expect(fullResult.is_sufficient).toBe(true);

    // Partial coverage below 95% - should fail
    const partialCriteria = [
      { number: 'A.5.1', title: 'Policy 1', description: 'Desc 1', source_text: '' },
      { number: 'A.5.2', title: 'Policy 2', description: 'Desc 2', source_text: '' }
    ];

    const partialResult = validateCoverageRule(partialCriteria, 10);
    expect(partialResult.coverage_ratio).toBe(0.2);
    expect(partialResult.is_sufficient).toBe(false);

    // Edge case: 95% exactly - should pass
    const edgeCriteria = Array(95).fill(null).map((_, i) => ({
      number: `A.${i}`,
      title: `Policy ${i}`,
      description: `Desc ${i}`,
      source_text: ''
    }));

    const edgeResult = validateCoverageRule(edgeCriteria, 100);
    expect(edgeResult.coverage_ratio).toBe(0.95);
    expect(edgeResult.is_sufficient).toBe(true);
  });

  it('MAT-T-0008: Human Approval of Parsed Criteria', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-008
    // TRS: TR-012
    // Type: integration | Priority: P0
    
    const parsedCriteria = [
      { number: 'A.5.1', title: 'Policy 1', description: 'Desc 1', source_text: '' },
      { number: 'A.5.2', title: 'Policy 2', description: 'Desc 2', source_text: '' }
    ];
    const mpsId = 'mps_123';

    // lead_auditor can approve
    const approvedByLead = approveParsedCriteria(parsedCriteria, mpsId, 'lead_auditor');
    expect(approvedByLead).toHaveLength(2);
    expect(approvedByLead[0].is_approved).toBe(true);
    expect(approvedByLead[0].status).toBe('not_started');
    expect(approvedByLead[0].mps_id).toBe(mpsId);

    // admin can approve
    const approvedByAdmin = approveParsedCriteria(parsedCriteria, mpsId, 'admin');
    expect(approvedByAdmin).toHaveLength(2);
    expect(approvedByAdmin[0].is_approved).toBe(true);

    // evidence_contributor cannot approve - should throw
    expect(() => {
      approveParsedCriteria(parsedCriteria, mpsId, 'evidence_contributor');
    }).toThrow('not authorized to approve criteria');

    // domain_auditor cannot approve - should throw
    expect(() => {
      approveParsedCriteria(parsedCriteria, mpsId, 'domain_auditor');
    }).toThrow('not authorized to approve criteria');
  });

  it('MAT-T-0009: Criteria Numbering Immutability', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-009
    // TRS: TR-012
    // Type: integration | Priority: P0
    
    const existingCriteria: Criterion[] = [
      {
        id: 'crit_1',
        mps_id: 'mps_123',
        number: 'A.5.1',
        title: 'Policy 1',
        description: 'Desc 1',
        status: 'not_started',
        is_approved: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'crit_2',
        mps_id: 'mps_123',
        number: 'A.5.2',
        title: 'Policy 2',
        description: 'Desc 2',
        status: 'not_started',
        is_approved: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    // Same numbers - should pass
    const unchangedCriteria: Criterion[] = [
      { ...existingCriteria[0], title: 'Updated Title 1' },
      { ...existingCriteria[1], title: 'Updated Title 2' }
    ];

    const validResult = validateCriteriaNumberingImmutability(existingCriteria, unchangedCriteria);
    expect(validResult.valid).toBe(true);
    expect(validResult.violations).toHaveLength(0);

    // Changed number - should fail
    const changedCriteria: Criterion[] = [
      { ...existingCriteria[0], number: 'A.5.99' }, // Changed number
      existingCriteria[1]
    ];

    const invalidResult = validateCriteriaNumberingImmutability(existingCriteria, changedCriteria);
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.violations.length).toBeGreaterThan(0);
    expect(invalidResult.violations[0]).toContain('A.5.1');
    expect(invalidResult.violations[0]).toContain('A.5.99');
  });

  it('MAT-T-0012: Not Used Exclusion', () => {
    // Architecture: §3.1
    // FRS: FR-012
    // TRS: TR-012
    // Type: integration | Priority: P0
    
    const criterion: Criterion = {
      id: 'crit_1',
      mps_id: 'mps_123',
      number: 'A.5.1',
      title: 'Policy 1',
      description: 'Desc 1',
      status: 'not_started',
      is_approved: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    // With valid reason - should succeed
    const result = markCriterionNotUsed(criterion, 'Not applicable to organization');
    expect(result.status).toBe('not_used');
    expect(result.updated_at).not.toBe(criterion.updated_at);

    // Without reason - should throw
    expect(() => {
      markCriterionNotUsed(criterion, '');
    }).toThrow('Reason is required');

    expect(() => {
      markCriterionNotUsed(criterion, '   ');
    }).toThrow('Reason is required');
  });

  it('MAT-T-0054: Criterion Status Tracking', () => {
    // Architecture: §3.1
    // FRS: FR-054
    // TRS: TR-012
    // Type: integration | Priority: P0
    
    const criterion: Criterion = {
      id: 'crit_1',
      mps_id: 'mps_123',
      number: 'A.5.1',
      title: 'Policy 1',
      description: 'Desc 1',
      status: 'not_started',
      is_approved: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    // Valid transition: not_started -> in_progress
    const inProgress = trackCriterionStatus(criterion, 'in_progress');
    expect(inProgress.status).toBe('in_progress');
    expect(inProgress.updated_at).not.toBe(criterion.updated_at);

    // Valid transition: in_progress -> submitted
    const submitted = trackCriterionStatus(inProgress, 'submitted');
    expect(submitted.status).toBe('submitted');

    // Valid transition: submitted -> ai_scored
    const aiScored = trackCriterionStatus(submitted, 'ai_scored');
    expect(aiScored.status).toBe('ai_scored');

    // Valid transition: ai_scored -> confirmed
    const confirmed = trackCriterionStatus(aiScored, 'confirmed');
    expect(confirmed.status).toBe('confirmed');

    // Invalid transition: not_started -> confirmed (skipping steps)
    expect(() => {
      trackCriterionStatus(criterion, 'confirmed');
    }).toThrow('Invalid status transition');

    // Invalid transition: confirmed -> anything (terminal state)
    expect(() => {
      trackCriterionStatus(confirmed, 'not_started');
    }).toThrow('Invalid status transition');

    // Valid transition to not_used from not_started
    const notUsed = trackCriterionStatus(criterion, 'not_used');
    expect(notUsed.status).toBe('not_used');

    // Invalid transition: not_used -> anything (terminal state)
    expect(() => {
      trackCriterionStatus(notUsed, 'in_progress');
    }).toThrow('Invalid status transition');
  });
});
