/**
 * MAT Test Suite — CAT-04: ai services
 *
 * Build-to-Green for MAT-T-0023–0032, MAT-T-0035–0036, MAT-T-0076–0077 (Wave 2+3 scope).
 * Remaining tests stay QA-to-Red for future waves.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  scoreMaturity,
  validateEvidenceFirst,
  confirmScore,
  logOverride,
  aggregateOverrides,
  getMaturityModel,
  getMaturityLevelDefinition,
  getMaturityLevelName,
  routeAITask,
  getFallbackModel,
  getRoutingTable,
  logAIInvocation,
  queryInvocationLogs,
  clearInvocationLogs,
  flagLowConfidence,
  createCircuitBreaker,
  recordCircuitBreakerError,
  recordCircuitBreakerSuccess,
  transitionToHalfOpen,
  scoreWithFallback,
  createManualScore,
  registerModelVersion,
  getActiveModelVersion,
  isRegressionTested,
  clearModelVersionRegistry
} from '../../src/services/ai-scoring.js';
import { generateReport, generateAllFormats, validateReport } from '../../src/services/reporting.js';
import { collectTextEvidence, reviewEvidence } from '../../src/services/evidence-collection.js';
import type { MaturityLevel, AIScoreResult } from '../../src/types/index.js';

describe('CAT-04: ai services', () => {
  beforeEach(() => {
    clearInvocationLogs();
    clearModelVersionRegistry();
  });
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
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for override test',
      uploaded_by: 'user-001'
    });

    const aiScore = scoreMaturity('crit-001', [evidence], 'gpt-4-turbo-2024');
    const overrideLevel = aiScore.maturity_level === 5 ? 4 : (aiScore.maturity_level + 1) as MaturityLevel;
    const overridden = confirmScore(
      aiScore, overrideLevel, 'user-002', 'lead_auditor',
      'Evidence suggests higher maturity based on additional context'
    );

    // Log the override
    const overrideLog = logOverride(overridden, 'audit-001', 'evidence_quality', [evidence.id]);
    expect(overrideLog.criterion_id).toBe('crit-001');
    expect(overrideLog.audit_id).toBe('audit-001');
    expect(overrideLog.original_ai_level).toBe(aiScore.maturity_level);
    expect(overrideLog.human_selected_level).toBe(overrideLevel);
    expect(overrideLog.reason_category).toBe('evidence_quality');
    expect(overrideLog.evidence_ids).toContain(evidence.id);
    expect(overrideLog.logged_at).toBeDefined();

    // Non-override confirmation should throw
    const confirmed = confirmScore(aiScore, aiScore.maturity_level, 'user-002', 'lead_auditor');
    expect(() => logOverride(confirmed, 'audit-001', 'other', [])).toThrow(
      'Cannot log override for a non-override confirmation'
    );

    // Aggregation test
    const overrideLog2 = logOverride(overridden, 'audit-001', 'ai_misinterpretation', [evidence.id]);
    const aggregated = aggregateOverrides([overrideLog, overrideLog2]);
    expect(aggregated.total).toBe(2);
    expect(aggregated.by_reason.evidence_quality).toBe(1);
    expect(aggregated.by_reason.ai_misinterpretation).toBe(1);
    expect(aggregated.average_level_difference).toBeGreaterThan(0);
  });

  it('MAT-T-0027: Maturity Model (5-Level)', () => {
    // Architecture: §3.1
    // FRS: FR-027
    // TRS: TR-038
    // Type: unit | Priority: P0
    const model = getMaturityModel();
    expect(model).toHaveLength(5);

    // Verify all 5 levels present
    expect(model[0].level).toBe(1);
    expect(model[0].name).toBe('Basic');
    expect(model[1].level).toBe(2);
    expect(model[1].name).toBe('Reactive');
    expect(model[2].level).toBe(3);
    expect(model[2].name).toBe('Compliant');
    expect(model[3].level).toBe(4);
    expect(model[3].name).toBe('Proactive');
    expect(model[4].level).toBe(5);
    expect(model[4].name).toBe('Resilient');

    // Each level has description and indicators
    for (const level of model) {
      expect(level.description).toBeDefined();
      expect(level.description.length).toBeGreaterThan(0);
      expect(level.indicators).toBeDefined();
      expect(level.indicators.length).toBeGreaterThan(0);
    }

    // Test specific level lookup
    const level3 = getMaturityLevelDefinition(3);
    expect(level3.name).toBe('Compliant');
    expect(level3.indicators.length).toBeGreaterThan(0);

    // Test level name lookup
    expect(getMaturityLevelName(1)).toBe('Basic');
    expect(getMaturityLevelName(5)).toBe('Resilient');
  });

  it('MAT-T-0028: AI Task Routing', () => {
    // Architecture: §3.3, §3.4
    // FRS: FR-028
    // TRS: TR-040
    // Type: integration | Priority: P0
    // Document parsing → GPT-4 Turbo
    const docConfig = routeAITask('document_parsing');
    expect(docConfig.primary_model).toBe('gpt-4-turbo');
    expect(docConfig.fallback_model).toBe('gpt-4o-mini');

    // Transcription → Whisper
    const transConfig = routeAITask('transcription');
    expect(transConfig.primary_model).toBe('whisper-1');

    // Scoring → GPT-4 Turbo
    const scoreConfig = routeAITask('scoring');
    expect(scoreConfig.primary_model).toBe('gpt-4-turbo');
    expect(scoreConfig.fallback_model).toBe('gpt-4o-mini');

    // Image analysis → GPT-4 Vision
    const imgConfig = routeAITask('image_analysis');
    expect(imgConfig.primary_model).toBe('gpt-4-vision-preview');

    // Report generation → GPT-4 Turbo
    const reportConfig = routeAITask('report_generation');
    expect(reportConfig.primary_model).toBe('gpt-4-turbo');

    // Routine → GPT-4o Mini
    const routineConfig = routeAITask('routine');
    expect(routineConfig.primary_model).toBe('gpt-4o-mini');

    // Fallback model test
    expect(getFallbackModel('scoring')).toBe('gpt-4o-mini');
    expect(getFallbackModel('transcription')).toBeNull();

    // Full routing table
    const table = getRoutingTable();
    expect(table.length).toBe(7);
  });

  it('MAT-T-0029: AI Invocation Logging', () => {
    // Architecture: §3.3
    // FRS: FR-029
    // TRS: TR-017
    // Type: integration | Priority: P0
    const log1 = logAIInvocation({
      model: 'gpt-4-turbo',
      model_version: 'gpt-4-turbo-2024-01',
      prompt_tokens: 500,
      completion_tokens: 200,
      latency_ms: 1200,
      cost_estimate: 0.015,
      task_type: 'scoring',
      audit_id: 'audit-001',
      criterion_id: 'crit-001',
      status: 'success'
    });

    expect(log1.id).toBeDefined();
    expect(log1.model).toBe('gpt-4-turbo');
    expect(log1.prompt_tokens).toBe(500);
    expect(log1.completion_tokens).toBe(200);
    expect(log1.latency_ms).toBe(1200);
    expect(log1.task_type).toBe('scoring');
    expect(log1.status).toBe('success');
    expect(log1.timestamp).toBeDefined();
    expect(log1.error_message).toBeNull();

    // Log an error invocation
    const log2 = logAIInvocation({
      model: 'gpt-4-turbo',
      model_version: 'gpt-4-turbo-2024-01',
      prompt_tokens: 300,
      completion_tokens: 0,
      latency_ms: 5000,
      cost_estimate: 0.005,
      task_type: 'scoring',
      audit_id: 'audit-001',
      criterion_id: 'crit-002',
      status: 'error',
      error_message: 'Rate limit exceeded'
    });

    expect(log2.status).toBe('error');
    expect(log2.error_message).toBe('Rate limit exceeded');

    // Query by audit ID
    const logs = queryInvocationLogs('audit-001');
    expect(logs.length).toBe(2);
    expect(logs[0].audit_id).toBe('audit-001');
    expect(logs[1].audit_id).toBe('audit-001');
  });

  it('MAT-T-0030: AI Confidence Flagging', () => {
    // Architecture: §3.4
    // FRS: FR-030
    // TRS: TR-038
    // Type: unit | Priority: P0
    // Low confidence score should be flagged
    const lowConfidenceScore: AIScoreResult = {
      criterion_id: 'crit-001',
      maturity_level: 2,
      confidence: 0.45,
      rationale: 'Limited evidence',
      evidence_citations: ['ev-001'],
      model_version: 'gpt-4-turbo-2024',
      scored_at: new Date().toISOString()
    };

    const flagged = flagLowConfidence(lowConfidenceScore);
    expect(flagged.flagged).toBe(true);
    expect(flagged.flag_reason).toContain('below threshold');
    expect(flagged.review_queue_priority).toBeDefined();
    expect(flagged.criterion_id).toBe('crit-001');

    // High confidence score should not be flagged
    const highConfidenceScore: AIScoreResult = {
      criterion_id: 'crit-002',
      maturity_level: 4,
      confidence: 0.92,
      rationale: 'Strong evidence',
      evidence_citations: ['ev-002', 'ev-003'],
      model_version: 'gpt-4-turbo-2024',
      scored_at: new Date().toISOString()
    };

    const notFlagged = flagLowConfidence(highConfidenceScore);
    expect(notFlagged.flagged).toBe(false);
    expect(notFlagged.flag_reason).toBeNull();
    expect(notFlagged.review_queue_priority).toBeNull();

    // Borderline confidence (exactly at threshold)
    const borderlineScore: AIScoreResult = {
      criterion_id: 'crit-003',
      maturity_level: 3,
      confidence: 0.70,
      rationale: 'Adequate evidence',
      evidence_citations: ['ev-004'],
      model_version: 'gpt-4-turbo-2024',
      scored_at: new Date().toISOString()
    };

    const borderline = flagLowConfidence(borderlineScore);
    expect(borderline.flagged).toBe(false);
  });

  it('MAT-T-0031: AI Rate Limiting', () => {
    // Architecture: §3.3
    // FRS: FR-031
    // TRS: TR-041
    // Type: integration | Priority: P1
    // Create circuit breaker in CLOSED state
    let breaker = createCircuitBreaker();
    expect(breaker.state).toBe('CLOSED');

    // Record successes — should stay CLOSED
    for (let i = 0; i < 4; i++) {
      breaker = recordCircuitBreakerSuccess(breaker);
    }
    expect(breaker.state).toBe('CLOSED');

    // Record errors to trigger OPEN state (>10% error rate with min 5 requests)
    breaker = recordCircuitBreakerError(breaker);
    // 4 success + 1 error = 20% error rate > 10% threshold with 5 requests
    expect(breaker.state).toBe('OPEN');

    // Cannot process through primary in OPEN state
    // Transition to HALF_OPEN after timeout
    breaker = transitionToHalfOpen(breaker);
    expect(breaker.state).toBe('HALF_OPEN');

    // Error in HALF_OPEN returns to OPEN
    breaker = recordCircuitBreakerError(breaker);
    expect(breaker.state).toBe('OPEN');

    // Transition to HALF_OPEN again and succeed 3 times → CLOSED
    breaker = transitionToHalfOpen(breaker);
    expect(breaker.state).toBe('HALF_OPEN');
    breaker = recordCircuitBreakerSuccess(breaker);
    breaker = recordCircuitBreakerSuccess(breaker);
    breaker = recordCircuitBreakerSuccess(breaker);
    expect(breaker.state).toBe('CLOSED');

    // Cannot transition to HALF_OPEN from CLOSED
    expect(() => transitionToHalfOpen(breaker)).toThrow(
      'Cannot transition to HALF_OPEN from state CLOSED'
    );
  });

  it('MAT-T-0032: AI Model Versioning', () => {
    // Architecture: §3.4
    // FRS: FR-032
    // TRS: TR-040
    // Type: unit | Priority: P1
    // Register a model version
    const version1 = registerModelVersion({
      model_id: 'gpt-4-turbo',
      version: '2024-01-25',
      task_types: ['scoring', 'document_parsing'],
      regression_tested: true
    });

    expect(version1.model_id).toBe('gpt-4-turbo');
    expect(version1.version).toBe('2024-01-25');
    expect(version1.is_active).toBe(true);
    expect(version1.regression_tested).toBe(true);
    expect(version1.deployed_at).toBeDefined();

    // Get active version for a task type
    const active = getActiveModelVersion('scoring');
    expect(active).not.toBeNull();
    expect(active!.model_id).toBe('gpt-4-turbo');

    // No active version for unregistered task type
    const noVersion = getActiveModelVersion('routine');
    expect(noVersion).toBeNull();

    // Validate regression testing requirement
    expect(isRegressionTested(version1)).toBe(true);

    const untestedVersion = registerModelVersion({
      model_id: 'gpt-4o-mini',
      version: '2024-02-01',
      task_types: ['routine'],
      regression_tested: false
    });
    expect(isRegressionTested(untestedVersion)).toBe(false);
  });

  it('MAT-T-0035: Report Generation', () => {
    // Architecture: §3.12 Path 5 — Report Generation
    // FRS: FR-035
    // TRS: TR-042
    // Type: integration | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for report generation',
      uploaded_by: 'user-001'
    });

    const aiScore = scoreMaturity('crit-001', [evidence], 'gpt-4-turbo-2024');
    const confirmation = confirmScore(aiScore, aiScore.maturity_level, 'user-002', 'lead_auditor');

    const report = generateReport({
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      format: 'pdf',
      title: 'Maturity Assessment Report',
      generated_by: 'user-002',
      confirmations: [confirmation]
    });

    expect(report.id).toBeDefined();
    expect(report.audit_id).toBe('audit-001');
    expect(report.organisation_id).toBe('org-001');
    expect(report.format).toBe('pdf');
    expect(report.title).toBe('Maturity Assessment Report');
    expect(report.generated_at).toBeDefined();
    expect(report.generated_by).toBe('user-002');
    expect(report.sections.length).toBeGreaterThan(0);
    expect(report.summary).toBeDefined();
    expect(report.summary.length).toBeGreaterThan(0);

    // Validate report
    const validation = validateReport(report);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('MAT-T-0036: Report Formats (DOCX/PDF/JSON)', () => {
    // Architecture: §3.12 Path 5
    // FRS: FR-036
    // TRS: TR-042
    // Type: integration | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for multi-format report',
      uploaded_by: 'user-001'
    });

    const aiScore = scoreMaturity('crit-001', [evidence], 'gpt-4-turbo-2024');
    const confirmation = confirmScore(aiScore, aiScore.maturity_level, 'user-002', 'lead_auditor');

    const allReports = generateAllFormats({
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      title: 'Multi-format Report',
      generated_by: 'user-002',
      confirmations: [confirmation]
    });

    // Verify all 3 formats generated
    expect(allReports.docx).toBeDefined();
    expect(allReports.pdf).toBeDefined();
    expect(allReports.json).toBeDefined();

    expect(allReports.docx.format).toBe('docx');
    expect(allReports.pdf.format).toBe('pdf');
    expect(allReports.json.format).toBe('json');

    // All formats have same data
    expect(allReports.docx.audit_id).toBe('audit-001');
    expect(allReports.pdf.audit_id).toBe('audit-001');
    expect(allReports.json.audit_id).toBe('audit-001');

    // All formats have sections and summary
    for (const format of ['docx', 'pdf', 'json'] as const) {
      expect(allReports[format].sections.length).toBeGreaterThan(0);
      expect(allReports[format].summary.length).toBeGreaterThan(0);
      expect(validateReport(allReports[format]).valid).toBe(true);
    }
  });

  it('MAT-T-0076: AI Service Failure — Circuit Breaker', () => {
    // Architecture: §3.3, §3.12 Path 10 — AI Service Failure
    // FRS: FR-031
    // TRS: TR-041
    // Type: integration | Priority: P0
    const evidence = collectTextEvidence({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Evidence for circuit breaker test',
      uploaded_by: 'user-001'
    });

    // CLOSED state — use primary model
    const closedBreaker = createCircuitBreaker();
    const result1 = scoreWithFallback('crit-001', [evidence], closedBreaker);
    expect(result1.score).not.toBeNull();
    expect(result1.model_used).toBe('gpt-4-turbo');
    expect(result1.fallback_used).toBe(false);

    // OPEN state — use fallback model
    let openBreaker = createCircuitBreaker();
    for (let i = 0; i < 4; i++) {
      openBreaker = recordCircuitBreakerSuccess(openBreaker);
    }
    openBreaker = recordCircuitBreakerError(openBreaker);
    expect(openBreaker.state).toBe('OPEN');

    const result2 = scoreWithFallback('crit-001', [evidence], openBreaker);
    expect(result2.score).not.toBeNull();
    expect(result2.model_used).toBe('gpt-4o-mini');
    expect(result2.fallback_used).toBe(true);

    // HALF_OPEN state — use primary model (test request)
    const halfOpenBreaker = transitionToHalfOpen(openBreaker);
    const result3 = scoreWithFallback('crit-001', [evidence], halfOpenBreaker);
    expect(result3.score).not.toBeNull();
    expect(result3.model_used).toBe('gpt-4-turbo');
    expect(result3.fallback_used).toBe(false);
  });

  it('MAT-T-0077: AI Degraded Mode — Manual Scoring', () => {
    // Architecture: §3.12 Path 13 — AI Degraded Mode
    // FRS: FR-023, FR-031
    // TRS: TR-041
    // Type: integration | Priority: P0
    // When both primary and fallback fail, manual scoring is available
    const manualScore = createManualScore(
      'crit-001',
      3,
      'Manual assessment based on documentary evidence review',
      'user-002',
      'ai_unavailable'
    );

    expect(manualScore.criterion_id).toBe('crit-001');
    expect(manualScore.maturity_level).toBe(3);
    expect(manualScore.rationale).toBeDefined();
    expect(manualScore.rationale.length).toBeGreaterThan(0);
    expect(manualScore.scored_by).toBe('user-002');
    expect(manualScore.scored_at).toBeDefined();
    expect(manualScore.is_manual).toBe(true);
    expect(manualScore.manual_reason).toBe('ai_unavailable');

    // Circuit breaker active manual score
    const cbManualScore = createManualScore(
      'crit-002',
      2,
      'Manual scoring due to circuit breaker',
      'user-003',
      'circuit_breaker_active'
    );
    expect(cbManualScore.manual_reason).toBe('circuit_breaker_active');

    // Fallback failed manual score
    const fallbackManualScore = createManualScore(
      'crit-003',
      4,
      'Manual scoring after fallback failure',
      'user-004',
      'fallback_failed'
    );
    expect(fallbackManualScore.manual_reason).toBe('fallback_failed');
  });
});
