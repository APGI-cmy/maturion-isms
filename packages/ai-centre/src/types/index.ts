/**
 * @maturion/ai-centre — Type Definitions
 *
 * Canonical TypeScript types derived from:
 * - APS (AIMC_AGENT_PROTOCOL_SPECIFICATION.md) §4–§9
 * - GRS (AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md)
 *
 * These interfaces are NORMATIVE. Implementations MUST match signatures exactly.
 */

// ---------------------------------------------------------------------------
// Feedback Pipeline (Wave 9.2) — re-exported for convenience
// ---------------------------------------------------------------------------

export type {
  ARCReviewStatus,
  FeedbackType,
  FeedbackEvent,
  FeedbackPipelineInterface,
} from './feedback.js';

// ---------------------------------------------------------------------------
// Provider names
// ---------------------------------------------------------------------------

export type ProviderName =
  | 'github-models'
  | 'openai'
  | 'anthropic'
  | 'perplexity'
  | 'runway';

// ---------------------------------------------------------------------------
// Capability enum (APS §4.4, GRS-003)
// ---------------------------------------------------------------------------

export enum Capability {
  ADVISORY = 'advisory',
  ANALYSIS = 'analysis',
  EMBEDDINGS = 'embeddings',
  DOCUMENT_GENERATION = 'document-generation',
  IMAGE_GENERATION = 'image-generation',
  DEEP_SEARCH = 'deep-search',
  VIDEO_GENERATION = 'video-generation',
  ALGORITHM_EXECUTION = 'algorithm-execution',
}

// ---------------------------------------------------------------------------
// Error codes (APS §4.3)
// ---------------------------------------------------------------------------

export enum AICentreErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNKNOWN_CAPABILITY = 'UNKNOWN_CAPABILITY',
  UNKNOWN_AGENT = 'UNKNOWN_AGENT',
  ALL_PROVIDERS_UNAVAILABLE = 'ALL_PROVIDERS_UNAVAILABLE',
  CONTEXT_ASSEMBLY_FAILED = 'CONTEXT_ASSEMBLY_FAILED',
  MEMORY_READ_FAILED = 'MEMORY_READ_FAILED',
  TELEMETRY_WRITE_FAILED = 'TELEMETRY_WRITE_FAILED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// ---------------------------------------------------------------------------
// Telemetry (APS §9.1)
// ---------------------------------------------------------------------------

export interface TelemetryEvent {
  id: string;
  organisationId: string;
  userId?: string;
  capability: Capability;
  providerUsed: ProviderName;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  errorCode?: AICentreErrorCode;
  recordedAt: number;
}

// ---------------------------------------------------------------------------
// Capability result types (APS §4.5)
// ---------------------------------------------------------------------------

export interface Citation {
  title: string;
  url: string;
  snippet?: string;
}

export interface AdvisoryResult {
  capability: Capability.ADVISORY;
  text: string;
  providerUsed: ProviderName;
}

export interface AnalysisResult {
  capability: Capability.ANALYSIS;
  data: Record<string, unknown>;
  providerUsed: ProviderName;
}

export interface EmbeddingsResult {
  capability: Capability.EMBEDDINGS;
  vectors: number[][];
  providerUsed: ProviderName;
}

export interface DocumentGenerationResult {
  capability: Capability.DOCUMENT_GENERATION;
  markdown: string;
  providerUsed: ProviderName;
}

export interface ImageGenerationResult {
  capability: Capability.IMAGE_GENERATION;
  imageUrls: string[];
  providerUsed: ProviderName;
}

export interface DeepSearchResult {
  capability: Capability.DEEP_SEARCH;
  summary: string;
  citations: Citation[];
  providerUsed: ProviderName;
}

export interface VideoGenerationResult {
  capability: Capability.VIDEO_GENERATION;
  videoUrl: string;
  providerUsed: ProviderName;
}

export interface AlgorithmExecutionResult {
  capability: Capability.ALGORITHM_EXECUTION;
  output: unknown;
  providerUsed: ProviderName;
}

export type CapabilityResult =
  | AdvisoryResult
  | AnalysisResult
  | EmbeddingsResult
  | DocumentGenerationResult
  | ImageGenerationResult
  | DeepSearchResult
  | VideoGenerationResult
  | AlgorithmExecutionResult;

// ---------------------------------------------------------------------------
// Request / Response (APS §4.2, §4.3)
// ---------------------------------------------------------------------------

export interface AICentreInput {
  text: string;
  data?: Record<string, unknown>;
}

export interface AICentreContext {
  organisationId: string;
  sessionId?: string;
  userId?: string;
  maxContextTokens?: number;
}

export interface AICentreRequest {
  capability: Capability;
  agent?: string;
  input: AICentreInput;
  context: AICentreContext;
}

export interface AICentreResponse {
  capability: Capability;
  result: CapabilityResult;
  telemetry: TelemetryEvent;
}

export interface AICentreErrorResponse {
  capability: Capability;
  errorCode: AICentreErrorCode;
  message: string;
  retryable: boolean;
  telemetry: TelemetryEvent;
}

// ---------------------------------------------------------------------------
// Provider health (APS §5.3)
// ---------------------------------------------------------------------------

export enum ProviderHealthStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface ProviderHealthRegistry {
  getHealth(provider: ProviderName): ProviderHealthStatus;
  recordSuccess(provider: ProviderName): void;
  recordFailure(provider: ProviderName): void;
}

// ---------------------------------------------------------------------------
// Capability routing (APS §5.1, §5.2)
// ---------------------------------------------------------------------------

export interface RoutingConfiguration {
  routes: Record<Capability, ProviderName[]>;
}

export interface CapabilityRouter {
  resolveProviders(
    capability: Capability,
    healthRegistry: ProviderHealthRegistry,
  ): ProviderName[];
}

// ---------------------------------------------------------------------------
// Provider adapter (APS §6.1)
// ---------------------------------------------------------------------------

export interface ContextMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface NormalisedProviderRequest {
  capability: Capability;
  systemPrompt: string;
  userInput: string;
  contextMessages: ContextMessage[];
  data?: Record<string, unknown>;
  maxTokens?: number;
}

export interface ProviderAdapter {
  readonly providerName: ProviderName;
  readonly supportedCapabilities: Set<Capability>;
  execute(request: NormalisedProviderRequest): Promise<CapabilityResult>;
  healthCheck(): Promise<ProviderHealthStatus>;
}

export class ProviderError extends Error {
  constructor(
    public readonly providerName: ProviderName,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

// ---------------------------------------------------------------------------
// Provider key store (APS §6.3)
// ---------------------------------------------------------------------------

export interface ProviderKeyStore {
  getKey(provider: ProviderName): string;
}

export class ProviderKeyNotFoundError extends Error {
  constructor(provider: ProviderName) {
    super(`API key for provider '${provider}' is not configured.`);
    this.name = 'ProviderKeyNotFoundError';
  }
}

// ---------------------------------------------------------------------------
// Memory (APS §7.1, §7.2, §7.5)
// ---------------------------------------------------------------------------

export interface MemoryTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  estimatedTokens: number;
}

export interface SessionMemoryStore {
  append(sessionId: string, turn: MemoryTurn): void;
  getHistory(sessionId: string): MemoryTurn[];
  prune(sessionId: string, maxTokenBudget: number): void;
  clearSession(sessionId: string): void;
}

export interface PersistedMemoryEntry {
  id?: string;
  organisationId: string;
  sessionId?: string;
  userId?: string;
  role: 'user' | 'assistant';
  content: string;
  capability: Capability;
  timestamp: number;
  expiresAt?: string;
}

export interface PersistentMemoryAdapter {
  retrieve(params: {
    organisationId: string;
    sessionId?: string;
    limit?: number;
  }): Promise<PersistedMemoryEntry[]>;
  persist(entry: PersistedMemoryEntry): Promise<void>;
  pruneExpired(organisationId: string): Promise<number>;
}

// ---------------------------------------------------------------------------
// Knowledge retrieval (APS §7.4 / Wave 5 RAG pipeline)
// ---------------------------------------------------------------------------

export interface KnowledgeEntry {
  content: string;
  source?: string;
}

export interface KnowledgeRetriever {
  retrieve(
    query: string,
    organisationId: string,
    limit?: number,
  ): Promise<KnowledgeEntry[]>;
}

export interface AssembledContextSegment {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AssembleContextWindowParams {
  organisationId: string;
  sessionId?: string;
  userInput: string;
  personaSystemPrompt: string;
}

export interface MemoryLifecycle {
  /**
   * Assemble the context window in canonical order (GRS-030 / APS §7.3):
   * 1. Persona system prompt
   * 2. Persistent memory (org-scoped, newest-first)
   * 3. Session memory (session-scoped, chronological)
   * 4. (Wave 5+) Domain knowledge via RAG
   * 5. Current user input
   */
  assembleContextWindow(
    params: AssembleContextWindowParams,
  ): Promise<AssembledContextSegment[]>;

  recordTurn(params: {
    request: AICentreRequest;
    response: AICentreResponse;
  }): Promise<void>;
  pruneSession(sessionId: string): void;
  pruneExpiredPersistentMemory(organisationId: string): Promise<number>;
}

// ---------------------------------------------------------------------------
// Persona loading (APS §8.1)
// ---------------------------------------------------------------------------

export interface PersonaLoader {
  load(agentId: string): Promise<string>;
  listAvailable(): Promise<string[]>;
}

export class PersonaNotFoundError extends Error {
  constructor(agentId: string) {
    super(
      `Persona '${agentId}' not found. ` +
        `Check that packages/ai-centre/agents/${agentId}.md exists.`,
    );
    this.name = 'PersonaNotFoundError';
  }
}

// ---------------------------------------------------------------------------
// Telemetry writer (APS §9.2)
// ---------------------------------------------------------------------------

export interface TelemetryWriter {
  write(event: Omit<TelemetryEvent, 'id'>): Promise<string>;
}

// ---------------------------------------------------------------------------
// AICentre gateway config (APS §12, AAD §12.1)
// ---------------------------------------------------------------------------

export interface AICentreConfig {
  routing: RoutingConfiguration;
  keyStore: ProviderKeyStore;
  telemetryWriter: TelemetryWriter;
  persistentMemory: PersistentMemoryAdapter;
  sessionMemory: SessionMemoryStore;
  personaLoader: PersonaLoader;
  healthRegistry: ProviderHealthRegistry;
  adapters: ProviderAdapter[];
  /** Optional MemoryLifecycle collaborator injected for testability (AAD §12.1). */
  memoryLifecycle?: MemoryLifecycle;
}
