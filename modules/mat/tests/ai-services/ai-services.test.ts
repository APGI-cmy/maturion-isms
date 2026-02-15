/**
 * MAT Test Suite — CAT-04: ai services
 *
 * Build-to-Green for MAT-T-0023–0025 (Wave 2 scope).
 * Remaining tests stay QA-to-Red for future waves.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  scoreMaturity,
  validateEvidenceFirst,
  confirmScore
} from '../../src/services/ai-scoring.js';
import { collectTextEvidence, reviewEvidence } from '../../src/services/evidence-collection.js';
import type { MaturityLevel } from '../../src/types/index.js';

describe('CAT-04: ai services', () => {
  it('MAT-T-0023: AI Maturity Scoring', () => {
    // Architecture: §3.12 Path 4 — AI Maturity Scoring
    // FRS: FR-023
    // TRS: TR-038
    // Type: integration | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Detailed compliance evidence for criterion',
      uploaded_by: 'user-001'
    });

    const score = scoreMaturity('crit-001', [evidence], 'gpt-4-turbo-2024');

    expect(score.criterion_id).toBe('crit-001');
    expect(score.maturity_level).toBeGreaterThanOrEqual(1);
    expect(score.maturity_level).toBeLessThanOrEqual(5);
    expect(score.confidence).toBeGreaterThan(0);
    expect(score.confidence).toBeLessThanOrEqual(1);
    expect(score.rationale).toBeDefined();
    expect(score.rationale.length).toBeGreaterThan(0);
    expect(score.evidence_citations).toContain(evidence.id);
    expect(score.model_version).toBe('gpt-4-turbo-2024');
    expect(score.scored_at).toBeDefined();
  });

  it('MAT-T-0024: Evidence-First Scoring Rule', () => {
    // Architecture: §3.12 Path 4
    // FRS: FR-024
    // TRS: TR-038
    // Type: unit | Priority: P0
    expect(validateEvidenceFirst([])).toBe(false);

    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence content',
      uploaded_by: 'user-001'
    });
    expect(validateEvidenceFirst([evidence])).toBe(true);

    expect(() => scoreMaturity('crit-001', [], 'gpt-4-turbo-2024')).toThrow(
      'Insufficient evidence'
    );
  });

  it('MAT-T-0025: Human Score Confirmation', () => {
    // Architecture: §3.12 Path 4
    // FRS: FR-025
    // TRS: TR-038
    // Type: integration | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for scoring',
      uploaded_by: 'user-001'
    });

    const aiScore = scoreMaturity('crit-001', [evidence], 'gpt-4-turbo-2024');

    // Confirm without override
    const confirmed = confirmScore(aiScore, aiScore.maturity_level, 'user-002', 'lead_auditor');
    expect(confirmed.is_override).toBe(false);
    expect(confirmed.confirmed_level).toBe(aiScore.maturity_level);
    expect(confirmed.override_justification).toBeNull();
    expect(confirmed.confirmed_by).toBe('user-002');

    // Override with justification
    const overrideLevel = aiScore.maturity_level === 5 ? 4 : (aiScore.maturity_level + 1) as 1 | 2 | 3 | 4 | 5;
    const overridden = confirmScore(
      aiScore, overrideLevel, 'user-002', 'lead_auditor',
      'Evidence suggests higher maturity based on additional context'
    );
    expect(overridden.is_override).toBe(true);
    expect(overridden.override_justification).toBeDefined();

    // Override without justification should fail
    const differentLevel = aiScore.maturity_level === 1 ? 2 : 1 as MaturityLevel;
    expect(() => confirmScore(aiScore, differentLevel, 'user-002', 'lead_auditor')).toThrow(
      'Override justification is required'
    );

    // Unauthorized role should fail
    expect(() => confirmScore(aiScore, aiScore.maturity_level, 'user-003', 'evidence_contributor')).toThrow(
      'lacks authority to confirm scores'
    );
  });

  it('MAT-T-0026: Override Logging', () => {
    // Architecture: §3.12 Path 4
    // FRS: FR-026
    // TRS: TR-025
    // Type: integration | Priority: P1
    throw new Error('NOT_IMPLEMENTED: MAT-T-0026 — Override Logging');
  });

  it('MAT-T-0027: Maturity Model (5-Level)', () => {
    // Architecture: §3.1
    // FRS: FR-027
    // TRS: TR-038
    // Type: unit | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0027 — Maturity Model (5-Level)');
  });

  it('MAT-T-0028: AI Task Routing', () => {
    // Architecture: §3.3, §3.4
    // FRS: FR-028
    // TRS: TR-040
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0028 — AI Task Routing');
  });

  it('MAT-T-0029: AI Invocation Logging', () => {
    // Architecture: §3.3
    // FRS: FR-029
    // TRS: TR-017
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0029 — AI Invocation Logging');
  });

  it('MAT-T-0030: AI Confidence Flagging', () => {
    // Architecture: §3.4
    // FRS: FR-030
    // TRS: TR-038
    // Type: unit | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0030 — AI Confidence Flagging');
  });

  it('MAT-T-0031: AI Rate Limiting', () => {
    // Architecture: §3.3
    // FRS: FR-031
    // TRS: TR-041
    // Type: integration | Priority: P1
    throw new Error('NOT_IMPLEMENTED: MAT-T-0031 — AI Rate Limiting');
  });

  it('MAT-T-0032: AI Model Versioning', () => {
    // Architecture: §3.4
    // FRS: FR-032
    // TRS: TR-040
    // Type: unit | Priority: P1
    throw new Error('NOT_IMPLEMENTED: MAT-T-0032 — AI Model Versioning');
  });

  it('MAT-T-0035: Report Generation', () => {
    // Architecture: §3.12 Path 5 — Report Generation
    // FRS: FR-035
    // TRS: TR-042
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0035 — Report Generation');
  });

  it('MAT-T-0036: Report Formats (DOCX/PDF/JSON)', () => {
    // Architecture: §3.12 Path 5
    // FRS: FR-036
    // TRS: TR-042
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0036 — Report Formats (DOCX/PDF/JSON)');
  });

  it('MAT-T-0076: AI Service Failure — Circuit Breaker', () => {
    // Architecture: §3.3, §3.12 Path 10 — AI Service Failure
    // FRS: FR-031
    // TRS: TR-041
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0076 — AI Service Failure — Circuit Breaker');
  });

  it('MAT-T-0077: AI Degraded Mode — Manual Scoring', () => {
    // Architecture: §3.12 Path 13 — AI Degraded Mode
    // FRS: FR-023, FR-031
    // TRS: TR-041
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0077 — AI Degraded Mode — Manual Scoring');
  });
});
