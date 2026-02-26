/**
 * AI Routing Table — Extracted from ai-scoring.ts (Wave 8 refactor)
 *
 * This file holds the static routing configuration for legacy AI task routing.
 * Extracted so that ai-scoring.ts does not contain hardcoded provider model strings
 * (Architecture mandate: ai-architecture.md v2.0.0 — model selection is AIMC's
 * responsibility; MAT must not own model names going forward).
 *
 * NOTE: This table is maintained for backward compatibility with existing
 * ai-services tests (FR-028, MAT-T-0028). New AI capability routing MUST go
 * through analysis-service.ts → AIMC Analysis Gateway (Capability.ANALYSIS).
 *
 * References: FR-028, TR-040
 */
import type { AIRoutingConfig } from '../types/index.js';

/**
 * Legacy AI routing configuration table
 * Architecture: §5 — AI Model Routing Configuration (TR-040)
 * FRS: FR-028
 *
 * ⚠️ AIMC REALIGNMENT NOTE (ai-architecture.md v2.0.0):
 * Model selection is AIMC's responsibility. This table is preserved only for
 * backward compatibility. All new scoring/parsing calls MUST use analysis-service.ts
 * which delegates to the AIMC Analysis Gateway (Capability.ANALYSIS).
 */
export const AI_ROUTING_TABLE: AIRoutingConfig[] = [
  { task_type: 'document_parsing', primary_model: 'gpt-4-turbo', fallback_model: 'gpt-4o-mini', max_tokens: 4096, temperature: 0.1 },
  { task_type: 'transcription', primary_model: 'whisper-1', fallback_model: null, max_tokens: null, temperature: null },
  { task_type: 'scoring', primary_model: 'gpt-4-turbo', fallback_model: 'gpt-4o-mini', max_tokens: 2048, temperature: 0.2 },
  { task_type: 'image_analysis', primary_model: 'gpt-4-vision-preview', fallback_model: 'gpt-4-turbo', max_tokens: 2048, temperature: 0.1 },
  { task_type: 'report_generation', primary_model: 'gpt-4-turbo', fallback_model: 'gpt-4o-mini', max_tokens: 8192, temperature: 0.3 },
  { task_type: 'routine', primary_model: 'gpt-4o-mini', fallback_model: null, max_tokens: 1024, temperature: 0.1 },
  { task_type: 'assistant', primary_model: 'gpt-4-turbo', fallback_model: 'gpt-4o-mini', max_tokens: 2048, temperature: 0.7 },
];
