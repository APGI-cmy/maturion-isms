/**
 * MemoryLifecycle — Wave 2 implementation
 *
 * Assembles context window in canonical order and manages turn recording.
 *
 * References: GRS-030 | APS §7.3, §7.5 | AAD §5.7
 */
import type {
  MemoryLifecycle as IMemoryLifecycle,
  AssembledContextSegment,
  AssembleContextWindowParams,
  AICentreRequest,
  AICentreResponse,
  SessionMemoryStore,
  PersistentMemoryAdapter,
} from '../types/index.js';

export interface MemoryLifecycleDeps {
  sessionStore: SessionMemoryStore;
  persistentAdapter: PersistentMemoryAdapter;
}

const DEFAULT_PRUNE_TOKEN_BUDGET = 2000;

export class MemoryLifecycle implements IMemoryLifecycle {
  private readonly sessionStore: SessionMemoryStore;
  private readonly persistentAdapter: PersistentMemoryAdapter;

  constructor(deps: MemoryLifecycleDeps) {
    this.sessionStore = deps.sessionStore;
    this.persistentAdapter = deps.persistentAdapter;
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

    // 4. (Wave 5+) Domain knowledge via RAG — not yet implemented

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
  }

  pruneSession(sessionId: string): void {
    this.sessionStore.prune(sessionId, DEFAULT_PRUNE_TOKEN_BUDGET);
  }

  async pruneExpiredPersistentMemory(organisationId: string): Promise<number> {
    return this.persistentAdapter.pruneExpired(organisationId);
  }
}
