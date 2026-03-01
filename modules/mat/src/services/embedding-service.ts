/**
 * Embedding Service — Wave 9: AIMC Embeddings/RAG Integration
 *
 * Routes embedding and RAG requests through the @maturion/ai-centre AICentre Gateway.
 * This service is the MAT server-side entry point for Embeddings/RAG AI capabilities
 * (criteria similarity search, evidence-to-criterion matching).
 *
 * Architecture mandate (ai-architecture.md v2.0.0):
 *   - All AI calls MUST go through @maturion/ai-centre — no direct provider calls.
 *   - MAT MUST NOT hold any AI provider API keys or vector DB connection strings.
 *   - Model selection, routing, and fallback are all AIMC responsibilities.
 *   - All vector database and embedding provider infrastructure is managed by AIMC.
 *   - Capability.RAG is the correct routing capability for all embedding/RAG operations.
 *
 * References: FR-055, FR-056 | TR-017 | ai-architecture.md v2.0.0
 * AIMC Wave: 5 (RAG pipeline)
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
// No vector DB packages (@pinecone-database/pinecone, weaviate-ts-client, @qdrant/js-client-rest) imported.
import type { Evidence } from '../types/index.js';

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
// Result types
// ---------------------------------------------------------------------------

/** A single criteria match result from similarity search */
export interface CriteriaMatch {
  criterionId: string;
  similarity: number;
  text: string;
}

/** Result of matching evidence items to criteria */
export interface EvidenceMatchResult {
  criterionId: string;
  evidenceIds: string[];
  confidence: number;
  rationale: string;
}

// ---------------------------------------------------------------------------
// Internal AICentre factory
// ---------------------------------------------------------------------------

/**
 * Build a fully wired AICentre instance for embedding/RAG use.
 * Follows the same pattern as analysis-service.ts — all routing and provider
 * management is delegated to the AIMC package.
 *
 * Routes only Capability.RAG — other capabilities are not used by this service.
 * Capability.RAG is the correct routing capability for vector search and retrieval
 * per ai-architecture.md v2.0.0.
 */
function buildEmbeddingAICentre(): AICentre {
  const keyStore = new ProviderKeyStore();
  const healthRegistry = new ProviderHealthRegistry();
  const telemetryWriter = new TelemetryWriter();

  return new AICentre({
    routing: {
      routes: {
        [Capability.RAG]: ['openai'],
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
// searchSimilarCriteria
// ---------------------------------------------------------------------------

/**
 * Search for criteria similar to the given query text via the AIMC RAG Gateway.
 *
 * Accepts an optional `aiCentre` for dependency injection (testability).
 * When not provided, constructs a default instance via buildEmbeddingAICentre().
 *
 * Delegates all vector search operations to AIMC Embeddings/RAG Gateway
 * (Capability.RAG). MAT source code never accesses vector DB infrastructure
 * directly — all vector operations are AIMC responsibilities.
 *
 * On success: parses the JSON result from the AIMC RAG response into an
 * array of CriteriaMatch objects.
 * On error/unavailable: returns empty array so callers are never thrown
 * an unhandled exception from AIMC unavailability.
 *
 * Architecture: ai-architecture.md v2.0.0 §3 — Criteria similarity search
 * References: FR-055, TR-017
 *
 * @param query - Search query text to find similar criteria for
 * @param topK - Maximum number of similar criteria to return (default: 5)
 * @param aiCentre - Optional injected AICentre instance (for testing)
 * @returns Array of CriteriaMatch results sorted by similarity, or empty on failure
 */
export async function searchSimilarCriteria(
  query: string,
  topK: number = 5,
  aiCentre?: AICentre,
): Promise<CriteriaMatch[]> {
  const centre = aiCentre ?? buildEmbeddingAICentre();

  try {
    const response = await centre.request({
      capability: Capability.RAG,
      agent: 'criteria-retriever',
      input: {
        text: `Search for the top ${topK} criteria most similar to the following query:\n\n${query}`,
      },
    });

    if ('errorCode' in response) {
      return [];
    }

    const okResponse = response as AICentreResponse;
    const rawContent = (okResponse.result as { content?: string }).content;

    if (!rawContent) {
      return [];
    }

    const parsed = JSON.parse(rawContent) as Partial<{ matches: CriteriaMatch[] }>;
    const matches = Array.isArray(parsed.matches) ? parsed.matches : [];

    return matches.filter(
      (m): m is CriteriaMatch =>
        typeof m.criterionId === 'string' &&
        typeof m.similarity === 'number' &&
        typeof m.text === 'string',
    );
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// matchEvidenceToCriteria
// ---------------------------------------------------------------------------

/**
 * Match evidence items to relevant criteria via the AIMC RAG Gateway.
 *
 * Accepts an optional `aiCentre` for dependency injection (testability).
 * When not provided, constructs a default instance via buildEmbeddingAICentre().
 *
 * Delegates all embedding and matching operations to AIMC Embeddings/RAG Gateway
 * (Capability.RAG). MAT source code never calls embedding APIs or accesses vector
 * stores directly — all such infrastructure is AIMC's responsibility.
 *
 * On success: parses the JSON result from the AIMC RAG response into an
 * array of EvidenceMatchResult objects.
 * On error/unavailable: returns null (caller must handle gracefully — e.g.
 * fall back to manual evidence assignment).
 *
 * Architecture: ai-architecture.md v2.0.0 §3 — Evidence-to-criterion matching
 * References: FR-056, TR-017
 *
 * @param evidenceItems - Array of evidence items to match against criteria
 * @param criterionIds - Array of criterion IDs to match evidence against
 * @param aiCentre - Optional injected AICentre instance (for testing)
 * @returns Array of EvidenceMatchResult, or null if AIMC RAG Gateway is unavailable
 */
export async function matchEvidenceToCriteria(
  evidenceItems: Evidence[],
  criterionIds: string[],
  aiCentre?: AICentre,
): Promise<EvidenceMatchResult[] | null> {
  const centre = aiCentre ?? buildEmbeddingAICentre();

  try {
    const evidenceSummary = evidenceItems
      .map((e) => `[${e.evidence_type}] ${e.content_text ?? e.file_name ?? '(no text)'}`)
      .join('\n');

    const response = await centre.request({
      capability: Capability.RAG,
      agent: 'evidence-matcher',
      input: {
        text: `Match the following evidence items to the most relevant criteria from the list [${criterionIds.join(', ')}]:\n\n${evidenceSummary}`,
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

    const parsed = JSON.parse(rawContent) as Partial<{ matches: EvidenceMatchResult[] }>;
    const matches = Array.isArray(parsed.matches) ? parsed.matches : null;

    if (!matches) {
      return null;
    }

    return matches.filter(
      (m): m is EvidenceMatchResult =>
        typeof m.criterionId === 'string' &&
        Array.isArray(m.evidenceIds) &&
        typeof m.confidence === 'number' &&
        typeof m.rationale === 'string',
    );
  } catch {
    return null;
  }
}
