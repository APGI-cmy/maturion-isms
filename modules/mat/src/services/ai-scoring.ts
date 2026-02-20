/**
 * AI Scoring Service
 * Architecture: modules/mat/02-architecture/ai-architecture.md
 * Implements AI maturity scoring, evidence-first rule, and human confirmation
 */

import type {
  AIScoreResult,
  HumanScoreConfirmation,
  MaturityLevel,
  MaturityLevelName,
  MaturityLevelDefinition,
  Evidence,
  UserRole,
  OverrideReason,
  OverrideLogEntry,
  AITaskType,
  AIRoutingConfig,
  AIInvocationLog,
  ConfidenceFlagResult,
  CircuitBreakerState,
  CircuitBreaker,
  AIModelVersion,
  ManualScoreEntry
} from '../types/index.js';

/**
 * Minimum evidence count required before AI scoring is permitted
 * Architecture: §3.12 Path 4 — AI Maturity Scoring
 * FRS: FR-024
 */
const MINIMUM_EVIDENCE_COUNT = 1;

/**
 * Roles authorized to confirm AI scores
 */
const SCORE_CONFIRMATION_ROLES: UserRole[] = ['lead_auditor', 'domain_auditor', 'admin'];

/**
 * Generates an AI maturity score for a criterion
 * Architecture: §3.12 Path 4 — AI Maturity Scoring
 * FRS: FR-023
 * 
 * Produces maturity level (1-5), confidence, rationale, and evidence citations.
 * In production, this would call GPT-4 Turbo via AI Gateway.
 * 
 * @param criterionId - ID of criterion to score
 * @param evidence - Array of evidence items for the criterion
 * @param modelVersion - AI model version used for scoring
 * @returns AI score result with maturity level and confidence
 * @throws Error if insufficient evidence (evidence-first rule)
 */
export function scoreMaturity(
  criterionId: string,
  evidence: Evidence[],
  modelVersion: string
): AIScoreResult {
  if (!validateEvidenceFirst(evidence)) {
    throw new Error(
      `Insufficient evidence for criterion ${criterionId}. ` +
      `Minimum ${MINIMUM_EVIDENCE_COUNT} evidence item(s) required before scoring.`
    );
  }

  const maturityLevel = calculateMaturityLevel(evidence);
  const confidence = calculateConfidence(evidence);

  return {
    criterion_id: criterionId,
    maturity_level: maturityLevel,
    confidence,
    rationale: generateRationale(evidence, maturityLevel),
    evidence_citations: evidence.map(e => e.id),
    model_version: modelVersion,
    scored_at: new Date().toISOString()
  };
}

/**
 * Validates evidence-first scoring rule
 * Architecture: §3.12 Path 4
 * FRS: FR-024
 * 
 * AI scoring is only permitted when minimum evidence threshold is met.
 * This prevents scoring without supporting evidence.
 * 
 * @param evidence - Array of evidence items
 * @returns true if evidence meets minimum threshold, false otherwise
 */
export function validateEvidenceFirst(evidence: Evidence[]): boolean {
  return evidence.length >= MINIMUM_EVIDENCE_COUNT;
}

/**
 * Confirms or overrides an AI score with human judgment
 * Architecture: §3.12 Path 4
 * FRS: FR-025
 * 
 * Human confirmation is mandatory — AI scores are never auto-committed.
 * If the human assigns a different level, it is recorded as an override
 * with mandatory justification.
 * 
 * @param aiScore - Original AI score result
 * @param confirmedLevel - Human-confirmed maturity level
 * @param confirmerId - ID of user confirming
 * @param confirmerRole - Role of user confirming
 * @param overrideJustification - Required if confirmedLevel differs from AI score
 * @returns Human score confirmation record
 * @throws Error if role lacks authority or override lacks justification
 */
export function confirmScore(
  aiScore: AIScoreResult,
  confirmedLevel: MaturityLevel,
  confirmerId: string,
  confirmerRole: UserRole,
  overrideJustification?: string
): HumanScoreConfirmation {
  if (SCORE_CONFIRMATION_ROLES.indexOf(confirmerRole) === -1) {
    throw new Error(
      `Role ${confirmerRole} lacks authority to confirm scores. ` +
      `Allowed roles: ${SCORE_CONFIRMATION_ROLES.join(', ')}`
    );
  }

  const isOverride = confirmedLevel !== aiScore.maturity_level;

  if (isOverride && !overrideJustification) {
    throw new Error(
      'Override justification is required when confirmed level differs from AI score'
    );
  }

  return {
    criterion_id: aiScore.criterion_id,
    ai_score: aiScore,
    confirmed_level: confirmedLevel,
    is_override: isOverride,
    override_justification: isOverride ? (overrideJustification || null) : null,
    confirmed_by: confirmerId,
    confirmed_at: new Date().toISOString()
  };
}

/**
 * Calculates maturity level based on evidence quality and quantity
 * 
 * @param evidence - Array of evidence items
 * @returns Maturity level 1-5
 */
function calculateMaturityLevel(evidence: Evidence[]): MaturityLevel {
  const count = evidence.length;
  const acceptedCount = evidence.filter(e => e.status === 'accepted').length;
  
  if (acceptedCount >= 5) return 5;
  if (acceptedCount >= 4) return 4;
  if (acceptedCount >= 3) return 3;
  if (count >= 2) return 2;
  return 1;
}

/**
 * Calculates confidence score based on evidence
 * 
 * @param evidence - Array of evidence items
 * @returns Confidence between 0 and 1
 */
function calculateConfidence(evidence: Evidence[]): number {
  const count = evidence.length;
  const acceptedRatio = evidence.filter(e => e.status === 'accepted').length / count;
  const typesDiversity = new Set(evidence.map(e => e.evidence_type)).size / 5;
  
  return Math.min(1, (acceptedRatio * 0.6 + typesDiversity * 0.4));
}

/**
 * Generates scoring rationale based on evidence
 * 
 * @param evidence - Array of evidence items
 * @param level - Assigned maturity level
 * @returns Rationale text
 */
function generateRationale(evidence: Evidence[], level: MaturityLevel): string {
  const types = [...new Set(evidence.map(e => e.evidence_type))];
  return `Maturity level ${level} assigned based on ${evidence.length} evidence item(s) ` +
    `of type(s): ${types.join(', ')}. ` +
    `${evidence.filter(e => e.status === 'accepted').length} item(s) accepted.`;
}

// ============================================================
// Override Logging (FR-026)
// ============================================================

/**
 * Logs a human override of an AI score for learning improvement
 * Architecture: §3.12 Path 4
 * FRS: FR-026
 * 
 * @param confirmation - The human score confirmation containing override details
 * @param auditId - Audit ID for context
 * @param reasonCategory - Categorized reason for the override
 * @param evidenceIds - Evidence item IDs relevant to the override
 * @returns Override log entry
 * @throws Error if confirmation is not an override
 */
export function logOverride(
  confirmation: HumanScoreConfirmation,
  auditId: string,
  reasonCategory: OverrideReason,
  evidenceIds: string[]
): OverrideLogEntry {
  if (!confirmation.is_override) {
    throw new Error('Cannot log override for a non-override confirmation');
  }

  return {
    id: generateUniqueId(),
    criterion_id: confirmation.criterion_id,
    audit_id: auditId,
    original_ai_level: confirmation.ai_score.maturity_level,
    human_selected_level: confirmation.confirmed_level,
    justification: confirmation.override_justification || '',
    reason_category: reasonCategory,
    evidence_ids: evidenceIds,
    logged_by: confirmation.confirmed_by,
    logged_at: new Date().toISOString()
  };
}

/**
 * Aggregates override data for analysis
 * FRS: FR-026 (AC3)
 * 
 * @param overrides - Array of override log entries
 * @returns Aggregated override analysis
 */
export function aggregateOverrides(overrides: OverrideLogEntry[]): {
  total: number;
  by_reason: Record<OverrideReason, number>;
  average_level_difference: number;
} {
  const byReason: Record<OverrideReason, number> = {
    evidence_quality: 0,
    ai_misinterpretation: 0,
    domain_specific_nuance: 0,
    other: 0
  };

  let totalDifference = 0;
  for (const override of overrides) {
    byReason[override.reason_category]++;
    totalDifference += Math.abs(override.human_selected_level - override.original_ai_level);
  }

  return {
    total: overrides.length,
    by_reason: byReason,
    average_level_difference: overrides.length > 0 ? totalDifference / overrides.length : 0
  };
}

// ============================================================
// Maturity Model (FR-027)
// ============================================================

/**
 * 5-Level maturity model definitions
 * Architecture: §3.1
 * FRS: FR-027
 */
const MATURITY_MODEL: MaturityLevelDefinition[] = [
  {
    level: 1,
    name: 'Basic',
    description: 'Ad-hoc processes, no formal controls',
    indicators: ['No documented procedures', 'Reactive approach', 'Individual knowledge-dependent']
  },
  {
    level: 2,
    name: 'Reactive',
    description: 'Some documented processes, reactive response to incidents',
    indicators: ['Basic documentation exists', 'Incident-driven improvements', 'Partial compliance awareness']
  },
  {
    level: 3,
    name: 'Compliant',
    description: 'Formal processes established, meets regulatory requirements',
    indicators: ['Documented procedures', 'Regular reviews', 'Compliance monitoring active']
  },
  {
    level: 4,
    name: 'Proactive',
    description: 'Proactive risk management, continuous improvement',
    indicators: ['Risk-based approach', 'KPI tracking', 'Regular internal audits', 'Improvement programs']
  },
  {
    level: 5,
    name: 'Resilient',
    description: 'Adaptive, resilient, industry-leading practices',
    indicators: ['Adaptive controls', 'Predictive analytics', 'Industry leadership', 'Innovation-driven']
  }
];

/**
 * Returns the complete 5-level maturity model
 * FRS: FR-027 (AC1, AC2)
 * 
 * @returns Array of maturity level definitions
 */
export function getMaturityModel(): MaturityLevelDefinition[] {
  return [...MATURITY_MODEL];
}

/**
 * Returns definition for a specific maturity level
 * FRS: FR-027 (AC3)
 * 
 * @param level - Maturity level (1-5)
 * @returns Maturity level definition
 * @throws Error if level is invalid
 */
export function getMaturityLevelDefinition(level: MaturityLevel): MaturityLevelDefinition {
  const definition = MATURITY_MODEL.find(m => m.level === level);
  if (!definition) {
    throw new Error(`Invalid maturity level: ${level}`);
  }
  return { ...definition };
}

/**
 * Returns the maturity level name for a numeric level
 * 
 * @param level - Maturity level number
 * @returns Maturity level name
 */
export function getMaturityLevelName(level: MaturityLevel): MaturityLevelName {
  return getMaturityLevelDefinition(level).name;
}

// ============================================================
// AI Task Routing (FR-028)
// ============================================================

/**
 * Default AI routing configuration table
 * Architecture: §5 — AI Model Routing Configuration (TR-040)
 * FRS: FR-028
 */
const AI_ROUTING_TABLE: AIRoutingConfig[] = [
  { task_type: 'document_parsing', primary_model: 'gpt-4-turbo', fallback_model: 'gpt-4o-mini', max_tokens: 4096, temperature: 0.1 },
  { task_type: 'transcription', primary_model: 'whisper-1', fallback_model: null, max_tokens: null, temperature: null },
  { task_type: 'scoring', primary_model: 'gpt-4-turbo', fallback_model: 'gpt-4o-mini', max_tokens: 2048, temperature: 0.2 },
  { task_type: 'image_analysis', primary_model: 'gpt-4-vision-preview', fallback_model: 'gpt-4-turbo', max_tokens: 2048, temperature: 0.1 },
  { task_type: 'report_generation', primary_model: 'gpt-4-turbo', fallback_model: 'gpt-4o-mini', max_tokens: 8192, temperature: 0.3 },
  { task_type: 'routine', primary_model: 'gpt-4o-mini', fallback_model: null, max_tokens: 1024, temperature: 0.1 },
  { task_type: 'assistant', primary_model: 'gpt-4-turbo', fallback_model: 'gpt-4o-mini', max_tokens: 2048, temperature: 0.7 }
];

/**
 * Routes an AI task to the correct model based on task type
 * Architecture: §5 — AI Model Routing Configuration
 * FRS: FR-028
 * 
 * @param taskType - Type of AI task
 * @returns Routing configuration for the task
 * @throws Error if task type is not recognized
 */
export function routeAITask(taskType: AITaskType): AIRoutingConfig {
  const config = AI_ROUTING_TABLE.find(r => r.task_type === taskType);
  if (!config) {
    throw new Error(`Unknown AI task type: ${taskType}`);
  }
  return { ...config };
}

/**
 * Returns the fallback model for a given task type
 * FRS: FR-028 (AC8)
 * 
 * @param taskType - Type of AI task
 * @returns Fallback model name or null if none configured
 */
export function getFallbackModel(taskType: AITaskType): string | null {
  const config = routeAITask(taskType);
  return config.fallback_model;
}

/**
 * Returns the full routing table
 * 
 * @returns Copy of the routing table
 */
export function getRoutingTable(): AIRoutingConfig[] {
  return AI_ROUTING_TABLE.map(r => ({ ...r }));
}

// ============================================================
// AI Invocation Logging (FR-029)
// ============================================================

/**
 * In-memory invocation log store (append-only)
 * FRS: FR-029 (AC2)
 */
const invocationLogs: AIInvocationLog[] = [];

/**
 * Logs an AI invocation for audit trail
 * Architecture: §5 — Invocation Logging
 * FRS: FR-029
 * 
 * @param params - Invocation log parameters
 * @returns Created invocation log entry
 */
export function logAIInvocation(params: {
  model: string;
  model_version: string;
  prompt_tokens: number;
  completion_tokens: number;
  latency_ms: number;
  cost_estimate: number;
  task_type: AITaskType;
  audit_id: string;
  criterion_id?: string;
  status: 'success' | 'error' | 'timeout';
  error_message?: string;
}): AIInvocationLog {
  const entry: AIInvocationLog = {
    id: generateUniqueId(),
    model: params.model,
    model_version: params.model_version,
    prompt_tokens: params.prompt_tokens,
    completion_tokens: params.completion_tokens,
    latency_ms: params.latency_ms,
    cost_estimate: params.cost_estimate,
    timestamp: new Date().toISOString(),
    task_type: params.task_type,
    audit_id: params.audit_id,
    criterion_id: params.criterion_id || null,
    status: params.status,
    error_message: params.error_message || null
  };

  invocationLogs.push(entry);
  return entry;
}

/**
 * Queries invocation logs by audit ID
 * FRS: FR-029 (AC3)
 * 
 * @param auditId - Audit ID to filter by
 * @returns Matching invocation log entries
 */
export function queryInvocationLogs(auditId: string): AIInvocationLog[] {
  return invocationLogs.filter(log => log.audit_id === auditId);
}

/**
 * Returns all invocation logs (for testing/monitoring)
 * 
 * @returns All invocation log entries
 */
export function getAllInvocationLogs(): AIInvocationLog[] {
  return [...invocationLogs];
}

/**
 * Clears invocation logs (for testing only)
 */
export function clearInvocationLogs(): void {
  invocationLogs.length = 0;
}

// ============================================================
// AI Confidence Flagging (FR-030)
// ============================================================

/**
 * Confidence threshold for flagging
 * Architecture: §3 — AI Maturity Scoring Pipeline
 * FRS: FR-030
 */
const CONFIDENCE_FLAG_THRESHOLD = 0.70;

/**
 * Evaluates an AI score result and flags if confidence is below threshold
 * Architecture: §3 — Confidence Check
 * FRS: FR-030
 * 
 * @param scoreResult - AI score result to evaluate
 * @returns Confidence flag result
 */
export function flagLowConfidence(scoreResult: AIScoreResult): ConfidenceFlagResult {
  const flagged = scoreResult.confidence < CONFIDENCE_FLAG_THRESHOLD;

  return {
    criterion_id: scoreResult.criterion_id,
    confidence: scoreResult.confidence,
    flagged,
    flag_reason: flagged ? `Confidence ${scoreResult.confidence.toFixed(2)} below threshold ${CONFIDENCE_FLAG_THRESHOLD}` : null,
    review_queue_priority: flagged
      ? (scoreResult.confidence < 0.4 ? 'high' : scoreResult.confidence < 0.55 ? 'medium' : 'low')
      : null
  };
}

// ============================================================
// AI Rate Limiting & Circuit Breaker (FR-031)
// ============================================================

/**
 * Creates a new circuit breaker instance
 * Architecture: §6 — AI Rate Limiting and Circuit Breaker (TR-041)
 * FRS: FR-031
 * 
 * @returns Initial circuit breaker state (CLOSED)
 */
export function createCircuitBreaker(): CircuitBreaker {
  const now = new Date().toISOString();
  return {
    state: 'CLOSED',
    error_count: 0,
    success_count: 0,
    last_error_at: null,
    last_state_change: now,
    window_start: now
  };
}

/**
 * Error rate threshold for triggering circuit breaker
 */
const ERROR_RATE_THRESHOLD = 0.10;

/**
 * Minimum request count before error rate evaluation
 */
const MIN_REQUEST_COUNT = 5;

/**
 * Consecutive successes needed to close half-open circuit
 */
const HALF_OPEN_SUCCESS_THRESHOLD = 3;

/**
 * Records an error and potentially transitions circuit breaker state
 * Architecture: §6 — Circuit Breaker States
 * FRS: FR-031 (AC2)
 * 
 * @param breaker - Current circuit breaker state
 * @returns Updated circuit breaker state
 */
export function recordCircuitBreakerError(breaker: CircuitBreaker): CircuitBreaker {
  const now = new Date().toISOString();
  const newErrorCount = breaker.error_count + 1;
  const totalRequests = newErrorCount + breaker.success_count;

  if (breaker.state === 'HALF_OPEN') {
    return {
      ...breaker,
      state: 'OPEN',
      error_count: newErrorCount,
      success_count: 0,
      last_error_at: now,
      last_state_change: now
    };
  }

  const errorRate = totalRequests >= MIN_REQUEST_COUNT ? newErrorCount / totalRequests : 0;

  if (breaker.state === 'CLOSED' && errorRate > ERROR_RATE_THRESHOLD) {
    return {
      ...breaker,
      state: 'OPEN',
      error_count: newErrorCount,
      last_error_at: now,
      last_state_change: now
    };
  }

  return {
    ...breaker,
    error_count: newErrorCount,
    last_error_at: now
  };
}

/**
 * Records a success and potentially transitions circuit breaker state
 * Architecture: §6 — Circuit Breaker States
 * FRS: FR-031
 * 
 * @param breaker - Current circuit breaker state
 * @returns Updated circuit breaker state
 */
export function recordCircuitBreakerSuccess(breaker: CircuitBreaker): CircuitBreaker {
  const now = new Date().toISOString();
  const newSuccessCount = breaker.success_count + 1;

  if (breaker.state === 'HALF_OPEN' && newSuccessCount >= HALF_OPEN_SUCCESS_THRESHOLD) {
    return {
      ...breaker,
      state: 'CLOSED',
      error_count: 0,
      success_count: 0,
      last_state_change: now,
      window_start: now
    };
  }

  return {
    ...breaker,
    success_count: newSuccessCount
  };
}

/**
 * Transitions circuit breaker from OPEN to HALF_OPEN (after timeout)
 * Architecture: §6 — OPEN → HALF_OPEN after 30 seconds
 * FRS: FR-031
 * 
 * @param breaker - Current circuit breaker state
 * @returns Updated circuit breaker state
 * @throws Error if breaker is not in OPEN state
 */
export function transitionToHalfOpen(breaker: CircuitBreaker): CircuitBreaker {
  if (breaker.state !== 'OPEN') {
    throw new Error(`Cannot transition to HALF_OPEN from state ${breaker.state}`);
  }

  return {
    ...breaker,
    state: 'HALF_OPEN',
    success_count: 0,
    last_state_change: new Date().toISOString()
  };
}

/**
 * Scores maturity with fallback model support
 * Architecture: §6 — Fallback Mode
 * FRS: FR-031 (AC3, AC4)
 * 
 * @param criterionId - Criterion ID
 * @param evidence - Evidence array
 * @param breaker - Circuit breaker state
 * @returns Score result with model info, or null if both primary and fallback fail
 */
export function scoreWithFallback(
  criterionId: string,
  evidence: Evidence[],
  breaker: CircuitBreaker
): { score: AIScoreResult | null; model_used: string; fallback_used: boolean } {
  const routing = routeAITask('scoring');

  if (breaker.state === 'CLOSED' || breaker.state === 'HALF_OPEN') {
    const score = scoreMaturity(criterionId, evidence, routing.primary_model);
    return { score, model_used: routing.primary_model, fallback_used: false };
  }

  // OPEN state — use fallback
  if (routing.fallback_model) {
    const score = scoreMaturity(criterionId, evidence, routing.fallback_model);
    return { score, model_used: routing.fallback_model, fallback_used: true };
  }

  // No fallback available
  return { score: null, model_used: 'none', fallback_used: false };
}

/**
 * Creates a manual score entry when AI is unavailable
 * Architecture: §6 — Fallback Failure
 * FRS: FR-031 (AC4)
 * 
 * @param criterionId - Criterion ID
 * @param level - Manually assigned maturity level
 * @param rationale - Human rationale
 * @param scorerId - User performing manual scoring
 * @param reason - Why manual scoring was needed
 * @returns Manual score entry
 */
export function createManualScore(
  criterionId: string,
  level: MaturityLevel,
  rationale: string,
  scorerId: string,
  reason: ManualScoreEntry['manual_reason']
): ManualScoreEntry {
  return {
    criterion_id: criterionId,
    maturity_level: level,
    rationale,
    scored_by: scorerId,
    scored_at: new Date().toISOString(),
    is_manual: true,
    manual_reason: reason
  };
}

// ============================================================
// AI Model Versioning (FR-032)
// ============================================================

/**
 * In-memory model version registry
 */
const modelVersionRegistry: AIModelVersion[] = [];

/**
 * Registers an AI model version
 * Architecture: §5 — Model Versioning
 * FRS: FR-032
 * 
 * @param params - Model version parameters
 * @returns Registered model version
 */
export function registerModelVersion(params: {
  model_id: string;
  version: string;
  task_types: AITaskType[];
  regression_tested: boolean;
}): AIModelVersion {
  const entry: AIModelVersion = {
    model_id: params.model_id,
    version: params.version,
    task_types: params.task_types,
    is_active: true,
    deployed_at: new Date().toISOString(),
    regression_tested: params.regression_tested
  };

  modelVersionRegistry.push(entry);
  return entry;
}

/**
 * Gets the active model version for a task type
 * FRS: FR-032 (AC1)
 * 
 * @param taskType - AI task type
 * @returns Active model version or null
 */
export function getActiveModelVersion(taskType: AITaskType): AIModelVersion | null {
  const versions = modelVersionRegistry.filter(
    v => v.is_active && v.task_types.indexOf(taskType) !== -1
  );
  return versions.length > 0 ? { ...versions[versions.length - 1] } : null;
}

/**
 * Validates that a model version has been regression tested
 * FRS: FR-032 (AC2)
 * 
 * @param modelVersion - Model version to check
 * @returns true if regression tested
 */
export function isRegressionTested(modelVersion: AIModelVersion): boolean {
  return modelVersion.regression_tested;
}

/**
 * Clears model version registry (for testing only)
 */
export function clearModelVersionRegistry(): void {
  modelVersionRegistry.length = 0;
}

/**
 * Generates a unique ID for entities
 * 
 * @returns Unique identifier string
 */
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
