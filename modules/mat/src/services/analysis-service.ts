/**
 * Analysis Service — Wave 8: AIMC Analysis Integration
 *
 * Routes analysis requests through the @maturion/ai-centre AICentre Gateway.
 * This service is the MAT server-side entry point for analysis AI capabilities
 * (criteria document parsing, maturity scoring).
 *
 * Architecture mandate (ai-architecture.md v2.0.0):
 *   - All AI calls MUST go through @maturion/ai-centre — no direct provider calls.
 *   - MAT MUST NOT hold any AI provider API keys.
 *   - Model selection, routing, and fallback are all AIMC responsibilities.
 *
 * References: FR-005, FR-023 | TR-037, TR-038, TR-040 | ai-architecture.md v2.0.0
 */

// All imports from the @maturion/ai-centre package barrel (GRS-001 / CL-4 ARCH-001 fix).
// AICentre is imported on a single line to satisfy static-analysis gateway checks.
import { AICentre } from '../../../../packages/ai-centre';
import {
  Capability,
  OpenAIAdapter,
  ProviderHealthRegistry,
  ProviderKeyStore,
  TelemetryWriter,
  type AICentreResponse,
  type ISessionMemoryStore as SessionMemoryStore,
  type PersistentMemoryAdapter,
} from '../../../../packages/ai-centre';
// Re-export gate: all imports above originate from the @maturion/ai-centre package
// (packages/ai-centre). No direct provider SDK (openai, @anthropic-ai) imported.
import type { ParseResult, Evidence, AIScoreResult } from '../types/index.js';

// ---------------------------------------------------------------------------
// Null collaborators — no-op impls for stateless/service context
// ---------------------------------------------------------------------------

const nullSessionMemory: SessionMemoryStore = {
  append(): void {},
  getHistory(): [] {
    return [];
  },
  prune(): void {},
  clearSession(): void {},
};

const nullPersistentMemory: PersistentMemoryAdapter = {
  async retrieve(): Promise<[]> {
    return [];
  },
  async persist(): Promise<void> {},
  async pruneExpired(): Promise<number> {
    return 0;
  },
};

// ---------------------------------------------------------------------------
// Internal AICentre factory
// ---------------------------------------------------------------------------

/**
 * Build a fully wired AICentre instance for analysis use.
 * Follows the same pattern as advisory-service.ts — all routing and provider
 * management is delegated to the AIMC package.
 *
 * Routes only Capability.ANALYSIS — other capabilities are not used by this service.
 */
function buildAnalysisAICentre(): AICentre {
  const keyStore = new ProviderKeyStore();
  const healthRegistry = new ProviderHealthRegistry();
  const telemetryWriter = new TelemetryWriter();

  return new AICentre({
    routing: {
      routes: {
        [Capability.ADVISORY]: [],
        [Capability.ANALYSIS]: ['openai'],
        [Capability.EMBEDDINGS]: [],
        [Capability.DOCUMENT_GENERATION]: [],
        [Capability.IMAGE_GENERATION]: [],
        [Capability.DEEP_SEARCH]: [],
        [Capability.VIDEO_GENERATION]: [],
        [Capability.ALGORITHM_EXECUTION]: [],
      },
    },
    keyStore,
    telemetryWriter,
    persistentMemory: nullPersistentMemory,
    sessionMemory: nullSessionMemory,
    healthRegistry,
    adapters: [new OpenAIAdapter(keyStore)],
  });
}

// ---------------------------------------------------------------------------
// parseCriteriaDocument
// ---------------------------------------------------------------------------

/**
 * Parse a criteria document via the AIMC Analysis Gateway.
 *
 * Accepts an optional `aiCentre` for dependency injection (testability).
 * When not provided, constructs a default instance via buildAnalysisAICentre().
 *
 * On success: parses the JSON result from the AIMC Analysis response into
 * a ParseResult shape.
 * On error/unavailable: returns graceful fallback (empty criteria, success: false)
 * so callers are never thrown an unhandled exception from AIMC unavailability.
 *
 * Architecture: ai-architecture.md v2.0.0 §3 — Criteria document parsing
 * References: FR-005, TR-037
 *
 * @param sourceText - Raw document text to be parsed
 * @param sections - Number of expected sections (passed as context to AIMC)
 * @param aiCentre - Optional injected AICentre instance (for testing)
 * @returns Parsed criteria result, or empty fallback on failure
 */
export async function parseCriteriaDocument(
  sourceText: string,
  sections: number,
  aiCentre?: AICentre,
): Promise<ParseResult> {
  const centre = aiCentre ?? buildAnalysisAICentre();

  const fallback: ParseResult = {
    criteria: [],
    coverage_ratio: 0,
    hallucination_flags: [],
    is_valid: false,
  };

  try {
    const response = await centre.request({
      capability: Capability.ANALYSIS,
      agent: 'document-parser',
      input: {
        text: `Parse the following criteria document into structured criteria. Expected sections: ${sections}.\n\n${sourceText}`,
      },
    });

    if ('errorCode' in response) {
      return fallback;
    }

    const okResponse = response as AICentreResponse;
    const rawContent = (okResponse.result as { content?: string }).content;

    if (!rawContent) {
      return fallback;
    }

    const parsed = JSON.parse(rawContent) as Partial<ParseResult>;

    return {
      criteria: Array.isArray(parsed.criteria) ? parsed.criteria : [],
      coverage_ratio: typeof parsed.coverage_ratio === 'number' ? parsed.coverage_ratio : 0,
      hallucination_flags: Array.isArray(parsed.hallucination_flags) ? parsed.hallucination_flags : [],
      is_valid: typeof parsed.is_valid === 'boolean' ? parsed.is_valid : false,
    };
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// scoreMaturity
// ---------------------------------------------------------------------------

/**
 * Score maturity for a criterion via the AIMC Analysis Gateway.
 *
 * Accepts an optional `aiCentre` for dependency injection (testability).
 * When not provided, constructs a default instance via buildAnalysisAICentre().
 *
 * On success: parses the JSON result from the AIMC Analysis response into
 * an AIScoreResult shape.
 * On error/unavailable: returns null (caller must handle gracefully — e.g.
 * fall back to manual scoring).
 *
 * Architecture: ai-architecture.md v2.0.0 §3 — Maturity scoring per criterion
 * References: FR-023, TR-038
 *
 * @param criterionId - ID of the criterion to score
 * @param evidence - Array of evidence items for the criterion
 * @param aiCentre - Optional injected AICentre instance (for testing)
 * @returns AI score result, or null if AIMC Analysis Gateway is unavailable
 */
export async function scoreMaturity(
  criterionId: string,
  evidence: Evidence[],
  aiCentre?: AICentre,
): Promise<AIScoreResult | null> {
  const centre = aiCentre ?? buildAnalysisAICentre();

  try {
    const evidenceSummary = evidence
      .map((e) => `[${e.evidence_type}] ${e.content_text ?? e.file_name ?? '(no text)'}`)
      .join('\n');

    const response = await centre.request({
      capability: Capability.ANALYSIS,
      agent: 'scoring-assistant',
      input: {
        text: `Score maturity for criterion ${criterionId} based on the following evidence:\n\n${evidenceSummary}`,
      },
    });

    if ('errorCode' in response) {
      return null;
    }

    const okResponse = response as AICentreResponse;
    const rawContent = (okResponse.result as { content?: string }).content;

    if (!rawContent) {
      return null;
    }

    const parsed = JSON.parse(rawContent) as Partial<AIScoreResult>;

    // Validate required fields are present
    if (
      typeof parsed.criterion_id !== 'string' ||
      typeof parsed.maturity_level !== 'number' ||
      typeof parsed.confidence !== 'number'
    ) {
      return null;
    }

    return {
      criterion_id: parsed.criterion_id,
      maturity_level: parsed.maturity_level as AIScoreResult['maturity_level'],
      confidence: parsed.confidence,
      rationale: parsed.rationale ?? '',
      evidence_citations: Array.isArray(parsed.evidence_citations) ? parsed.evidence_citations : [],
      model_version: parsed.model_version ?? 'aimc-analysis',
      scored_at: parsed.scored_at ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
