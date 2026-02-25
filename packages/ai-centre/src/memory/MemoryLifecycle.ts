/**
 * MemoryLifecycle — Wave 4 full implementation
 *
 * Assembles context window in canonical order and manages turn recording.
 * recordTurn() now persists turns to both session and persistent memory (AAD §5.8).
 *
 * References: GRS-030 | APS §7.3, §7.5 | AAD §5.7, §5.8
 */
import type {
  MemoryLifecycle as IMemoryLifecycle,
  AssembledContextSegment,
  AssembleContextWindowParams,
  AICentreRequest,
  AICentreResponse,
  SessionMemoryStore,
  PersistentMemoryAdapter,
  PersistedMemoryEntry,
  KnowledgeRetriever,
} from '../types/index.js';

export interface MemoryLifecycleDeps {
  sessionStore: SessionMemoryStore;
  persistentAdapter: PersistentMemoryAdapter;
  knowledgeRetriever?: KnowledgeRetriever;
}

const DEFAULT_PRUNE_TOKEN_BUDGET = 2000;

export class MemoryLifecycle implements IMemoryLifecycle {
  private readonly sessionStore: SessionMemoryStore;
  private readonly persistentAdapter: PersistentMemoryAdapter;
  private readonly knowledgeRetriever?: KnowledgeRetriever;

  constructor(deps: MemoryLifecycleDeps) {
    this.sessionStore = deps.sessionStore;
    this.persistentAdapter = deps.persistentAdapter;
    this.knowledgeRetriever = deps.knowledgeRetriever;
  }

  async assembleContextWindow(
    params: AssembleContextWindowParams,
  ): Promise<AssembledContextSegment[]> {
    const segments: AssembledContextSegment[] = [];

    // 1. Persona system prompt
    segments.push({ role: 'system', content: params.personaSystemPrompt });

    // 2. Persistent memory (org-scoped)
    const persistent = await this.persistentAdapter.retrieve({
      organisationId: params.organisationId,
    });
    for (const entry of persistent) {
      segments.push({ role: entry.role, content: entry.content });
    }

    // 3. Session memory (session-scoped, chronological)
    if (params.sessionId) {
      const history = this.sessionStore.getHistory(params.sessionId);
      for (const turn of history) {
        segments.push({ role: turn.role, content: turn.content });
      }
    }

    // 4. Domain knowledge via RAG (Wave 5 / GRS-030)
    if (this.knowledgeRetriever) {
      const knowledge = await this.knowledgeRetriever.retrieve(
        params.userInput,
        params.organisationId,
        5,
      );
      for (const entry of knowledge) {
        segments.push({ role: 'system', content: entry.content });
      }
    }

    // 5. Current user input
    segments.push({ role: 'user', content: params.userInput });

    return segments;
  }

  async recordTurn(params: {
    request: AICentreRequest;
    response: AICentreResponse;
  }): Promise<void> {
    const sessionId = params.request.context.sessionId;
    if (!sessionId) return;

    const now = Date.now();
    const inputText = params.request.input.text;
    const resultText =
      'text' in params.response.result
        ? (params.response.result as { text: string }).text
        : JSON.stringify(params.response.result);

    this.sessionStore.append(sessionId, {
      role: 'user',
      content: inputText,
      timestamp: now,
      estimatedTokens: Math.ceil(inputText.length / 4),
    });
    this.sessionStore.append(sessionId, {
      role: 'assistant',
      content: resultText,
      timestamp: now + 1,
      estimatedTokens: Math.ceil(resultText.length / 4),
    });

    // Persist both turns to cross-session memory (AAD §5.8)
    const baseEntry: Omit<PersistedMemoryEntry, 'role' | 'content' | 'timestamp'> = {
      organisationId: params.request.context.organisationId,
      sessionId,
      userId: params.request.context.userId,
      capability: params.request.capability,
    };

    await Promise.all([
      this.persistentAdapter.persist({
        ...baseEntry,
        role: 'user',
        content: inputText,
        timestamp: now,
      }),
      this.persistentAdapter.persist({
        ...baseEntry,
        role: 'assistant',
        content: resultText,
        timestamp: now + 1,
      }),
    ]);
  }

  pruneSession(sessionId: string): void {
    this.sessionStore.prune(sessionId, DEFAULT_PRUNE_TOKEN_BUDGET);
  }

  async pruneExpiredPersistentMemory(organisationId: string): Promise<number> {
    return this.persistentAdapter.pruneExpired(organisationId);
  }
}
