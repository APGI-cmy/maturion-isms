# AI Management Centre — Agent & Protocol Specification (APS)

**Document Type**: Foundation Artefact — Wave 1 Deliverable  
**Status**: DRAFT — Awaiting CS2 Sign-Off (blocked until GRS is frozen)  
**Version**: 0.1.0  
**Effective Date**: 2026-02-23  
**Owner**: Maturion Engineering Leadership (Johan Ras, CS2)  
**Location**: `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md`  

**Authorities**:
- `governance/canon/AIMC_STRATEGY.md` v1.0.0 (Constitutional Canon)
- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 (Constitutional Canon)
- `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md` (ACD) — foundational input
- `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` (GRS) — primary input

**Freeze Condition**:
> **IMPORTANT**: This APS is a DRAFT and MAY be iterated in parallel with the GRS during Wave 1. However, the APS MUST NOT be considered final or released until the GRS is CS2-signed-off and frozen. No Wave 3 implementation code may be written until this APS is also CS2-signed-off.

**Feeds into**:
- Wave 2: Package Scaffold & Schema (TypeScript interfaces defined here are the scaffold target)
- Wave 3+: All capability implementations (adapters, gateway, memory, persona loader)

---

## 1. Purpose of This Document

This Agent & Protocol Specification (APS) defines the **concrete, implementable contracts** for the AI Management Centre. It translates the formal requirements captured in the GRS into TypeScript interface definitions, request/response schemas, provider adapter contracts, memory protocols, persona loading protocols, error models, and telemetry event shapes.

Every GRS requirement is explicitly mapped to one or more protocol elements in this document. Builders implementing the AIMC MUST conform to the interfaces and protocols specified here without deviation. Any deviation requires a frozen APS amendment and a new CS2 sign-off before implementation proceeds.

---

## 2. Document Conventions

- **MUST** / **SHALL**: Mandatory; non-conformance is a build violation.
- **SHOULD**: Strongly recommended; deviation requires documented justification.
- **MAY**: Optional; use judgement.
- All TypeScript in this document is **normative**. Implementations MUST match the defined signatures exactly (names, types, optionality).
- `/* ... */` in code blocks indicates prose descriptions of implementation logic, not actual comments to be preserved verbatim.

---

## 3. GRS-to-APS Requirement Mapping Index

The following table maps every GRS requirement to its APS section. All GRS requirements MUST be covered.

| GRS ID | Requirement Summary | APS Section |
|---|---|---|
| GRS-001 | Single gateway entry point | §4.1 |
| GRS-002 | Typed request/response contract | §4.2, §4.3 |
| GRS-003 | Capability routing by type/cost/health | §5.1 |
| GRS-004 | Governed routing configuration | §5.2 |
| GRS-005 | Provider adapter interface | §6.1 |
| GRS-006 | Progressive provider delivery (W3–W8) | §6.2 |
| GRS-007 | In-process session memory | §7.1, §7.3 |
| GRS-008 | Supabase persistent memory with org isolation | §7.2, §7.3 |
| GRS-009 | No module-owned AI memory tables | §7.4 (enforcement note) |
| GRS-010 | Persona files in `packages/ai-centre/agents/` | §8.1 |
| GRS-011 | Namespace segregation app vs build personas | §8.2 |
| GRS-012 | Per-call telemetry event (required fields) | §9.1 |
| GRS-013 | Telemetry immutability | §9.2 |
| GRS-014 | Graceful degradation / fallback | §5.3 |
| GRS-015 | Central key management | §6.3 |
| GRS-016 | No direct provider calls from modules | §4.1 (enforcement note) |
| GRS-017 | Build-time agent orchestration exclusion | §8.2 (enforcement note) |
| GRS-018 | No UI/UX in AIMC package | §4.1 (scope note) |
| GRS-019 | Sequential wave gates | §10.1 |
| GRS-020 | GRS+APS gate for Wave 2 | §10.2 |
| GRS-021 | APS frozen gate for Wave 3 | §10.2 |
| GRS-022 | Wave 8 governance certification | §10.3 |
| GRS-023 | POLC governance for all waves | §10.1 |
| GRS-024 | Artefact storage in `governance/aimc/` | §1 (location) |
| GRS-025 | Package at `packages/ai-centre/` | §11.1 |
| GRS-026 | TypeScript strict compliance | §4 (all interfaces) |
| GRS-027 | Supabase migrations + RLS | §7.4 |
| GRS-028 | Persona loading by `agentId` | §8.1 |
| GRS-029 | Persona files as plain Markdown only | §8.3 |
| GRS-030 | Context window assembly order | §7.3 |
| GRS-031 | Memory lifecycle with PRUNE | §7.5 |

---

## 4. Gateway Public API

### 4.1 Entry Point Contract

The `@maturion/ai-centre` package MUST export a singleton gateway instance as its primary API surface. Modules MUST use this surface exclusively (GRS-001, GRS-016, GRS-018).

```typescript
// packages/ai-centre/src/index.ts — public API surface

export { AICentre } from './gateway/AICentre';
export type {
  AICentreRequest,
  AICentreResponse,
  AICentreErrorResponse,
  Capability,
  CapabilityResult,
} from './types';
```

The package MUST NOT export any provider SDK types, UI components, React hooks, or internal implementation details.

---

### 4.2 Request Schema (GRS-002)

```typescript
/**
 * AICentreRequest — the single typed request shape accepted by the gateway.
 * All ISMS modules MUST construct requests conforming to this type.
 */
export interface AICentreRequest {
  /** The AI capability required. Determines routing and provider selection. */
  capability: Capability;

  /**
   * The agentId identifying which persona file to load as system prompt.
   * MUST correspond to a file at packages/ai-centre/agents/<agentId>.md.
   * Required for all capability types except 'embeddings' and 'algorithm-execution'.
   */
  agent?: string;

  /** The user-facing input payload (text prompt, document reference, etc.). */
  input: AICentreInput;

  /** Caller-supplied context that supplements memory assembly. */
  context: AICentreContext;
}

export interface AICentreInput {
  /** Primary natural-language input from the user or calling module. */
  text: string;

  /**
   * Optional structured data payload (e.g., JSON for analysis capabilities).
   * Must be serialisable to JSON.
   */
  data?: Record<string, unknown>;
}

export interface AICentreContext {
  /** Organisation identifier — used for tenant-isolated memory retrieval. REQUIRED. */
  organisationId: string;

  /**
   * Session identifier — used for in-process session memory scoping.
   * If absent, the gateway treats this as a stateless (single-turn) request.
   */
  sessionId?: string;

  /**
   * User identifier within the organisation.
   * Used for per-user telemetry attribution and future per-user memory.
   */
  userId?: string;

  /**
   * Optional override for maximum context tokens for this request.
   * If absent, the gateway uses the configured default for the capability type.
   */
  maxContextTokens?: number;
}
```

---

### 4.3 Response Schema (GRS-002)

```typescript
/**
 * AICentreResponse — the single typed response returned by the gateway for all
 * successful requests. Modules MUST depend only on this type; no provider-specific
 * response fields are exposed.
 */
export interface AICentreResponse {
  /** The capability that was invoked. */
  capability: Capability;

  /** The typed result payload, discriminated by capability. */
  result: CapabilityResult;

  /** Telemetry metadata for this call. Always present. */
  telemetry: TelemetryEvent;
}

/**
 * AICentreErrorResponse — returned when the gateway cannot fulfil the request
 * (including all provider fallbacks exhausted). Must never expose raw provider errors.
 */
export interface AICentreErrorResponse {
  capability: Capability;

  /** Governed error code — drawn from the AICentreErrorCode enum. */
  errorCode: AICentreErrorCode;

  /** Human-readable message safe for logging. No provider internals. */
  message: string;

  /** Whether a retry is safe for the caller to attempt. */
  retryable: boolean;

  /** Telemetry metadata for this call. Always present even on error. */
  telemetry: TelemetryEvent;
}

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
```

---

### 4.4 Capability Enum (GRS-003)

```typescript
/**
 * Capability — the exhaustive set of AI capability types the AIMC supports.
 * Values map directly to ACD Section 4.1 and the 8-wave plan (ACD Section 5).
 */
export enum Capability {
  /** Wave 3: conversational advisory. Uses GitHub Models (primary), OpenAI (fallback). */
  ADVISORY = 'advisory',

  /** Wave 4: structured analysis over data payloads. Uses OpenAI. */
  ANALYSIS = 'analysis',

  /** Wave 5: semantic vector embeddings. Uses OpenAI text-embedding models. */
  EMBEDDINGS = 'embeddings',

  /** Wave 6: long-form document generation. Uses Anthropic Claude. */
  DOCUMENT_GENERATION = 'document-generation',

  /** Wave 6: image generation. Uses OpenAI DALL-E 3. */
  IMAGE_GENERATION = 'image-generation',

  /** Wave 7: web-grounded research search. Uses Perplexity API. */
  DEEP_SEARCH = 'deep-search',

  /** Wave 8: video generation. Uses Runway API. */
  VIDEO_GENERATION = 'video-generation',

  /** Wave 8: algorithm execution over structured inputs. */
  ALGORITHM_EXECUTION = 'algorithm-execution',
}
```

---

### 4.5 Capability Result Types

```typescript
/**
 * CapabilityResult — discriminated union of result types for all capabilities.
 * Each variant is specialised to the output of the corresponding capability.
 */
export type CapabilityResult =
  | AdvisoryResult
  | AnalysisResult
  | EmbeddingsResult
  | DocumentGenerationResult
  | ImageGenerationResult
  | DeepSearchResult
  | VideoGenerationResult
  | AlgorithmExecutionResult;

export interface AdvisoryResult {
  capability: Capability.ADVISORY;
  /** The AI-generated advisory text response. */
  text: string;
  /** Provider that fulfilled this request. */
  providerUsed: ProviderName;
}

export interface AnalysisResult {
  capability: Capability.ANALYSIS;
  /** Structured analysis output. Shape is defined per use-case in module documentation. */
  data: Record<string, unknown>;
  providerUsed: ProviderName;
}

export interface EmbeddingsResult {
  capability: Capability.EMBEDDINGS;
  /** The embedding vector(s). */
  vectors: number[][];
  providerUsed: ProviderName;
}

export interface DocumentGenerationResult {
  capability: Capability.DOCUMENT_GENERATION;
  /** The generated document as Markdown text. */
  markdown: string;
  providerUsed: ProviderName;
}

export interface ImageGenerationResult {
  capability: Capability.IMAGE_GENERATION;
  /** Signed URL(s) to the generated image(s). Valid for a limited TTL. */
  imageUrls: string[];
  providerUsed: ProviderName;
}

export interface DeepSearchResult {
  capability: Capability.DEEP_SEARCH;
  /** The research summary with inline citations. */
  summary: string;
  /** Source citations. */
  citations: Citation[];
  providerUsed: ProviderName;
}

export interface Citation {
  title: string;
  url: string;
  snippet?: string;
}

export interface VideoGenerationResult {
  capability: Capability.VIDEO_GENERATION;
  /** Signed URL to the generated video. Valid for a limited TTL. */
  videoUrl: string;
  providerUsed: ProviderName;
}

export interface AlgorithmExecutionResult {
  capability: Capability.ALGORITHM_EXECUTION;
  /** Output of the algorithm as a JSON-serialisable value. */
  output: unknown;
  providerUsed: ProviderName;
}
```

---

## 5. Capability Routing Protocol

### 5.1 Router Interface (GRS-003)

```typescript
/**
 * CapabilityRouter — determines which provider to use for a given capability
 * and current provider health state.
 */
export interface CapabilityRouter {
  /**
   * Resolve the ordered list of providers to try for the given capability,
   * filtered by health and ordered by priority (primary first, then fallbacks).
   */
  resolveProviders(
    capability: Capability,
    healthRegistry: ProviderHealthRegistry
  ): ProviderName[];
}
```

---

### 5.2 Routing Configuration (GRS-004)

```typescript
/**
 * RoutingConfiguration — the governed configuration document that defines
 * the provider priority list for each capability.
 * This MUST be externally configurable without redeployment.
 */
export interface RoutingConfiguration {
  /** Mapping of capability to ordered provider list (primary first). */
  routes: Record<Capability, ProviderName[]>;
}
```

The routing configuration MUST be loaded from an environment-injected configuration source (e.g., a Supabase-backed config table or a CS2-managed environment variable) and MUST NOT be hardcoded in application source.

---

### 5.3 Provider Health Registry (GRS-014)

```typescript
/**
 * ProviderHealthRegistry — tracks current health state for each provider.
 * Used by the router to skip unavailable providers.
 */
export interface ProviderHealthRegistry {
  /**
   * Returns the current health status for a provider.
   * HEALTHY: provider accepting requests.
   * DEGRADED: provider responding but with elevated latency or errors.
   * UNAVAILABLE: provider rejecting requests or not reachable.
   */
  getHealth(provider: ProviderName): ProviderHealthStatus;

  /** Record a successful request outcome for a provider. */
  recordSuccess(provider: ProviderName): void;

  /** Record a failure outcome for a provider. */
  recordFailure(provider: ProviderName, error: Error): void;
}

export enum ProviderHealthStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum ProviderName {
  GITHUB_MODELS = 'github-models',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  PERPLEXITY = 'perplexity',
  RUNWAY = 'runway',
}
```

When all providers for a capability are `UNAVAILABLE`, the gateway MUST return an `AICentreErrorResponse` with `errorCode: AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE` and MUST NOT surface any provider-specific error message to the caller.

---

## 6. Provider Adapter Protocol

### 6.1 Adapter Interface (GRS-005)

```typescript
/**
 * ProviderAdapter — the interface ALL provider integrations MUST implement.
 * Adding a new provider requires only a new class implementing this interface.
 * The gateway and router MUST NOT contain provider-specific branching logic.
 */
export interface ProviderAdapter {
  /** Identifies this adapter's provider. */
  readonly providerName: ProviderName;

  /**
   * Returns the set of capabilities this adapter supports.
   * Routing will never dispatch an unsupported capability to this adapter.
   */
  readonly supportedCapabilities: Set<Capability>;

  /**
   * Execute the AI request and return the raw provider response.
   * The adapter is responsible for:
   * - Constructing the provider-specific API payload from the normalised request.
   * - Calling the provider API using the key from ProviderKeyStore.
   * - Mapping the provider response to the typed CapabilityResult.
   * - Wrapping provider errors in a governed ProviderError (never propagating raw errors).
   */
  execute(request: NormalisedProviderRequest): Promise<CapabilityResult>;

  /**
   * Perform a lightweight health probe.
   * Called by ProviderHealthRegistry on a configured interval.
   * MUST complete within 5 seconds and MUST NOT count against quota.
   */
  healthCheck(): Promise<ProviderHealthStatus>;
}

export interface NormalisedProviderRequest {
  capability: Capability;
  systemPrompt: string;
  userInput: string;
  contextMessages: ContextMessage[];
  data?: Record<string, unknown>;
  maxTokens?: number;
}

export interface ContextMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
```

---

### 6.2 Progressive Provider Delivery Schedule (GRS-006)

| Wave | Provider | Capabilities |
|---|---|---|
| Wave 3 | GitHub Models | `advisory` |
| Wave 4 | OpenAI | `analysis`, `embeddings` |
| Wave 6 | Anthropic | `document-generation` |
| Wave 6 | OpenAI (DALL-E 3) | `image-generation` |
| Wave 7 | Perplexity | `deep-search` |
| Wave 8 | Runway | `video-generation` |
| Wave 8 | Internal | `algorithm-execution` |

Each wave MUST deliver a passing adapter test suite that covers: (a) successful request execution, (b) error wrapping (no raw errors exposed), and (c) health check probe behaviour.

---

### 6.3 Provider Key Store (GRS-015)

```typescript
/**
 * ProviderKeyStore — the exclusive interface through which adapters obtain
 * provider API keys. Keys MUST NOT be embedded in source code or module config.
 */
export interface ProviderKeyStore {
  /**
   * Returns the API key for the given provider.
   * Keys are loaded exclusively from CS2-managed environment secrets.
   * Throws ProviderKeyNotFoundError if the key is not configured.
   */
  getKey(provider: ProviderName): string;
}
```

All provider adapter implementations MUST obtain their API key via `ProviderKeyStore.getKey()`. Hardcoded keys or module-level environment variable reads are a build violation.

---

## 7. Memory Protocol

### 7.1 In-Process Session Memory (GRS-007)

```typescript
/**
 * SessionMemoryStore — manages in-process session-scoped conversation history.
 * Scoped to a single server process lifetime; does not survive restarts.
 */
export interface SessionMemoryStore {
  /**
   * Append a new message pair (user turn + assistant turn) to the session.
   */
  append(sessionId: string, turn: MemoryTurn): void;

  /**
   * Retrieve all turns for the session, ordered chronologically (oldest first).
   * Returns empty array if sessionId is unknown.
   */
  getHistory(sessionId: string): MemoryTurn[];

  /**
   * Prune the session to fit within the token budget.
   * Removes oldest turns first until the total estimated tokens are within budget.
   */
  prune(sessionId: string, maxTokenBudget: number): void;

  /** Explicitly end a session and release its memory. */
  clearSession(sessionId: string): void;
}

export interface MemoryTurn {
  role: 'user' | 'assistant';
  content: string;
  /** Unix timestamp (ms) of this turn. */
  timestamp: number;
  /** Estimated token count for this turn (used for pruning decisions). */
  estimatedTokens: number;
}
```

---

### 7.2 Persistent Memory Adapter (GRS-008)

```typescript
/**
 * PersistentMemoryAdapter — interface for Supabase-backed cross-session memory.
 * All queries MUST be scoped to organisationId (tenant isolation).
 */
export interface PersistentMemoryAdapter {
  /**
   * Retrieve persisted memory entries for an organisation and optional session.
   * MUST enforce organisationId filter at the database layer (RLS).
   * Returns entries ordered by recency (newest first), up to `limit`.
   */
  retrieve(params: {
    organisationId: string;
    sessionId?: string;
    limit?: number;
  }): Promise<PersistedMemoryEntry[]>;

  /**
   * Write a memory entry for an organisation.
   * The entry MUST be tagged with organisationId before storage.
   */
  persist(entry: PersistedMemoryEntry): Promise<void>;

  /**
   * Delete expired memory entries for an organisation.
   * Called by the AIMC maintenance process on a configured schedule.
   */
  pruneExpired(organisationId: string): Promise<number>;
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
  /** ISO-8601 expiry date. Null means the entry never expires. */
  expiresAt?: string;
}
```

---

### 7.3 Context Window Assembly Protocol (GRS-030)

The gateway MUST assemble the context window in the following strict order before dispatching to the provider adapter:

1. **Persona System Prompt** — loaded from `packages/ai-centre/agents/<agentId>.md` (see §8.1).
2. **Persistent Memory** — retrieved via `PersistentMemoryAdapter.retrieve()` scoped to `organisationId`. Newest-first, trimmed to token budget.
3. **Session Memory** — retrieved via `SessionMemoryStore.getHistory()` scoped to `sessionId`. Chronological, trimmed to token budget.
4. **Domain Knowledge** — (Wave 5+) retrieved via RAG pipeline; semantic search results from pgvector.
5. **Current User Input** — the `input.text` field from the `AICentreRequest`.

The assembled window MUST be passed to the adapter as a `NormalisedProviderRequest` with `contextMessages` containing segments 2–4 as `ContextMessage[]` objects in the order above, and `systemPrompt` set to segment 1.

---

### 7.4 Supabase Schema Requirements (GRS-027)

The following Supabase tables MUST be defined in `packages/ai-centre/supabase/migrations/`:

**`ai_memory`** — persistent conversation memory:

| Column | Type | Constraint |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `organisation_id` | `uuid` | NOT NULL, FK to organisations |
| `session_id` | `text` | NULLABLE |
| `user_id` | `uuid` | NULLABLE |
| `role` | `text` | NOT NULL, CHECK IN ('user', 'assistant') |
| `content` | `text` | NOT NULL |
| `capability` | `text` | NOT NULL |
| `timestamp` | `bigint` | NOT NULL |
| `expires_at` | `timestamptz` | NULLABLE |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() |

RLS policy MUST enforce: `organisation_id = auth.jwt()->>'organisation_id'` for all SELECT, INSERT, UPDATE, DELETE operations.

**`ai_telemetry`** — per-call audit log:

| Column | Type | Constraint |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `organisation_id` | `uuid` | NOT NULL |
| `user_id` | `uuid` | NULLABLE |
| `capability` | `text` | NOT NULL |
| `provider_used` | `text` | NOT NULL |
| `prompt_tokens` | `integer` | NOT NULL |
| `completion_tokens` | `integer` | NOT NULL |
| `latency_ms` | `integer` | NOT NULL |
| `error_code` | `text` | NULLABLE |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() |

RLS policy for `ai_telemetry`: SELECT permitted for `organisation_id = auth.jwt()->>'organisation_id'`. INSERT permitted by AIMC service role only. UPDATE and DELETE MUST be denied for all principals including organisation members (GRS-013).

---

### 7.5 Memory Lifecycle (GRS-031)

```typescript
/**
 * MemoryLifecycle — orchestrates the full lifecycle of memory entries.
 */
export interface MemoryLifecycle {
  /**
   * Called after each successful gateway response.
   * Appends the user turn and assistant turn to session memory.
   * Asynchronously persists to Supabase if sessionId is provided.
   */
  recordTurn(params: {
    request: AICentreRequest;
    response: AICentreResponse;
  }): Promise<void>;

  /**
   * Prune session memory to fit within the configured max context tokens.
   * Called before context window assembly.
   */
  pruneSession(sessionId: string): void;

  /**
   * Maintenance job — prune expired persistent memory records.
   * Should be called on a schedule (e.g., daily).
   */
  pruneExpiredPersistentMemory(organisationId: string): Promise<number>;
}
```

---

## 8. Persona Loading Protocol

### 8.1 Persona Loader Interface (GRS-010, GRS-028)

```typescript
/**
 * PersonaLoader — discovers and loads persona files from the governed directory.
 * Persona files are plain Markdown stored at packages/ai-centre/agents/<agentId>.md.
 */
export interface PersonaLoader {
  /**
   * Load the persona file content for the given agentId.
   * Returns the full Markdown content as a string.
   * Throws PersonaNotFoundError if the file does not exist.
   */
  load(agentId: string): Promise<string>;

  /**
   * Returns the set of agentId values for which persona files exist.
   * Used at gateway startup for validation.
   */
  listAvailable(): Promise<string[]>;
}

export class PersonaNotFoundError extends Error {
  constructor(agentId: string) {
    super(
      `Persona '${agentId}' not found. ` +
      `Check that packages/ai-centre/agents/${agentId}.md exists.`
    );
    this.name = 'PersonaNotFoundError';
  }
}
```

The persona loader MUST resolve file paths relative to `packages/ai-centre/agents/` and MUST NOT traverse outside this directory (path traversal protection: reject any `agentId` containing `/`, `\`, or `..`).

---

### 8.2 Constitutional Namespace Segregation (GRS-011, GRS-017)

The following rule MUST be enforced at the implementation and CI level:

| Namespace | Path | Purpose | Cross-reference allowed? |
|---|---|---|---|
| App advisor personas | `packages/ai-centre/agents/` | Runtime system prompts for module AI advisors | NO reference to `.github/agents/` |
| Build agent personas | `.github/agents/` | Living Agent System build agent contracts | NO reference to `packages/ai-centre/agents/` |

The CI MUST include a lint check that fails if any file in `packages/ai-centre/` imports or references a path under `.github/agents/`, or if any file under `.github/agents/` references `packages/ai-centre/agents/`.

---

### 8.3 Persona File Format (GRS-029)

Persona files MUST conform to the following rules:

1. File extension MUST be `.md`.
2. Content MUST be plain Markdown — no code fences containing executable code (TypeScript, JavaScript, Python, shell, etc.).
3. Content MUST NOT contain JSON blocks with configuration fields.
4. Content MUST NOT reference provider names, API keys, or environment variables.
5. Content MUST NOT contain instructions for memory injection or context manipulation.
6. Files SHOULD begin with a front-matter block (YAML) containing at minimum: `agentId`, `description`, `module`, and `version`.

Example persona front-matter:

```yaml
---
agentId: mat-advisor
description: MAT Module AI Advisor — supports governance and maturity assessment conversations
module: mat
version: 1.0.0
---
```

---

## 9. Telemetry Protocol

### 9.1 Telemetry Event Schema (GRS-012)

```typescript
/**
 * TelemetryEvent — emitted for every gateway request (successful or failed).
 * Provides the canonical audit record for cost attribution and compliance.
 */
export interface TelemetryEvent {
  /** Unique identifier for this telemetry record. */
  id: string;

  /** Organisation that made the request. REQUIRED. */
  organisationId: string;

  /** User within the organisation. May be null for system-initiated requests. */
  userId?: string;

  /** The capability invoked. */
  capability: Capability;

  /** The provider that fulfilled the request (or was attempted on error). */
  providerUsed: ProviderName;

  /** Number of tokens in the assembled prompt. */
  promptTokens: number;

  /** Number of tokens in the provider response. Zero on error. */
  completionTokens: number;

  /** Total request latency in milliseconds, from gateway entry to response return. */
  latencyMs: number;

  /**
   * Error code if the request failed. Null on success.
   * MUST be an AICentreErrorCode value — never a raw provider error code.
   */
  errorCode?: AICentreErrorCode;

  /** Unix timestamp (ms) when this event was recorded. */
  recordedAt: number;
}
```

---

### 9.2 Telemetry Writer Interface (GRS-013)

```typescript
/**
 * TelemetryWriter — writes telemetry events to the governed audit store.
 * The backing store is the ai_telemetry Supabase table (see §7.4).
 * Writes are append-only; no update or delete operations are exposed.
 */
export interface TelemetryWriter {
  /**
   * Write a telemetry event.
   * Implementations MUST NOT offer any mechanism to overwrite or delete records.
   * Returns the generated record id on success.
   */
  write(event: Omit<TelemetryEvent, 'id'>): Promise<string>;
}
```

---

## 10. Wave Gate Protocol

### 10.1 General Gate Requirements (GRS-019, GRS-023)

Every wave in the AIMC 8-wave plan is gated. The Foreman MUST verify the following before issuing a wave-start authorisation:

1. The preceding wave's deliverables are CS2-signed-off.
2. A frozen architecture document for the current wave exists in `governance/aimc/`.
3. A RED QA suite (all tests failing) is in place for the wave's deliverables.
4. Builder agents are available in the specialist registry.

No builder agent MAY begin implementation without a Foreman-issued wave-start authorisation that satisfies all four conditions above.

---

### 10.2 Wave 1 → Wave 2 Gate (GRS-020, GRS-021)

Wave 2 MUST NOT commence until:

| Condition | Document | Status Required |
|---|---|---|
| GRS frozen and CS2-signed-off | `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` | `APPROVED` |
| APS frozen and CS2-signed-off | `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md` (this document) | `APPROVED` |

Wave 3 MUST NOT commence until:

| Condition | Document | Status Required |
|---|---|---|
| APS frozen and CS2-signed-off | This document | `APPROVED` |
| Wave 2 package scaffold delivered | `packages/ai-centre/` | All Wave 2 tests GREEN |

---

### 10.3 Wave 8 Governance Certification Gate (GRS-022)

Wave 8 close MUST deliver a Governance Certification report that includes:

1. Full audit of all `ai_telemetry` records — verifying no gaps, no tampered records.
2. Confirmation of all 8 wave-close sign-off records in governance memory.
3. RLS policy verification for all AIMC tables.
4. Provider adapter coverage verification (all 8 capabilities have passing tests).
5. CS2-signed production-readiness certification.

---

## 11. Package Structure

### 11.1 Directory Layout (GRS-025)

```
packages/ai-centre/
├── src/
│   ├── index.ts                    # Public API surface (exports only)
│   ├── gateway/
│   │   └── AICentre.ts             # Main gateway class implementing the entry point
│   ├── routing/
│   │   ├── CapabilityRouter.ts     # Router implementation
│   │   └── ProviderHealthRegistry.ts
│   ├── adapters/
│   │   ├── ProviderAdapter.ts      # Interface (re-export)
│   │   ├── GitHubModelsAdapter.ts  # Wave 3
│   │   ├── OpenAIAdapter.ts        # Wave 4
│   │   ├── AnthropicAdapter.ts     # Wave 6
│   │   ├── PerplexityAdapter.ts    # Wave 7
│   │   └── RunwayAdapter.ts        # Wave 8
│   ├── memory/
│   │   ├── SessionMemoryStore.ts
│   │   ├── PersistentMemoryAdapter.ts
│   │   └── MemoryLifecycle.ts
│   ├── personas/
│   │   └── PersonaLoader.ts
│   ├── telemetry/
│   │   └── TelemetryWriter.ts
│   ├── keys/
│   │   └── ProviderKeyStore.ts
│   └── types/
│       └── index.ts                # All exported type definitions from this APS
├── agents/                         # Persona files (plain Markdown only)
│   ├── mat-advisor.md              # Wave 3
│   ├── course-crafter-advisor.md   # Wave 6
│   ├── xdetect-advisor.md          # Wave 7
│   └── risk-advisor.md             # Wave 7
├── supabase/
│   └── migrations/                 # AIMC-owned schema migrations
│       ├── 001_ai_memory.sql
│       └── 002_ai_telemetry.sql
├── package.json
└── tsconfig.json
```

---

## 12. AICentre Gateway Class

The `AICentre` class is the single public implementation of the gateway. Its interface:

```typescript
export class AICentre {
  constructor(config: AICentreConfig) { /* ... */ }

  /**
   * The primary public method. All modules call this and nothing else.
   * Returns either AICentreResponse or AICentreErrorResponse.
   */
  async request(req: AICentreRequest): Promise<AICentreResponse | AICentreErrorResponse>;
}

export interface AICentreConfig {
  /** Routing configuration — provider priority per capability. */
  routing: RoutingConfiguration;

  /** Key store implementation to inject. */
  keyStore: ProviderKeyStore;

  /** Telemetry writer implementation to inject. */
  telemetryWriter: TelemetryWriter;

  /** Persistent memory adapter implementation to inject. */
  persistentMemory: PersistentMemoryAdapter;

  /** Session memory store implementation to inject. */
  sessionMemory: SessionMemoryStore;

  /** Persona loader implementation to inject. */
  personaLoader: PersonaLoader;

  /** Provider health registry implementation to inject. */
  healthRegistry: ProviderHealthRegistry;

  /** Adapters to register. All adapters in the registry are available for routing. */
  adapters: ProviderAdapter[];
}
```

All dependencies MUST be injected via `AICentreConfig`. The gateway class MUST NOT construct its own dependencies. This enables testability and dependency inversion.

---

## 13. References

| Document | Location | Role |
|---|---|---|
| ACD — Capability Description | `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md` | Foundation input; defines capabilities and scope |
| GRS — Governance Requirements Specification | `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` | Primary requirements input for this APS; all GRS requirements are mapped in §3 |
| `AIMC_STRATEGY.md` v1.0.0 | `governance/canon/AIMC_STRATEGY.md` | Constitutional authority for architecture, provider strategy, and governance principles |
| `LIVING_AGENT_SYSTEM.md` v6.2.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` | Living Agent framework; governs build agents implementing the AIMC |
| `MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md` | `governance/canon/MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md` | Memory protocol authority |
| `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` | `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` | Knowledge management; governs RAG pipeline design (Wave 5) |

---

## 14. Acceptance Criteria

This APS is complete and ready for CS2 sign-off when all of the following are satisfied:

- [x] File exists at `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md`
- [x] GRS is referenced as primary input and all GRS requirements are mapped in the traceability index (§3)
- [x] All public TypeScript interfaces are defined: `AICentreRequest`, `AICentreResponse`, `AICentreErrorResponse`, `Capability`, `ProviderAdapter`, `SessionMemoryStore`, `PersistentMemoryAdapter`, `MemoryLifecycle`, `PersonaLoader`, `TelemetryWriter`, `TelemetryEvent`, `ProviderKeyStore`, `CapabilityRouter`, `RoutingConfiguration`, `ProviderHealthRegistry`
- [x] Context window assembly order is specified (§7.3)
- [x] Persona loading protocol is specified including namespace segregation (§8)
- [x] Supabase schema for `ai_memory` and `ai_telemetry` is defined with RLS requirements (§7.4)
- [x] Wave gate protocol is defined (§10)
- [x] Package directory structure is defined (§11)
- [x] `AICentre` gateway class signature and dependency injection contract defined (§12)
- [x] APS is marked as DRAFT with explicit freeze condition referencing GRS sign-off
- [ ] GRS CS2 sign-off received (prerequisite for APS freeze)
- [ ] APS CS2 review and sign-off received

---

*End of Document*

**Authority**: `governance/canon/AIMC_STRATEGY.md` v1.0.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0  
**Input**: `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md` | `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md`  
**Drafted**: 2026-02-23  
**Next Action**: GRS CS2 sign-off → APS CS2 sign-off → Wave 2 start
