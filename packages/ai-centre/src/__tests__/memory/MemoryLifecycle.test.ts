/**
 * RED Gate QA Suite — MemoryLifecycle
 *
 * All tests MUST FAIL until Wave 2 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-030 | APS §7.5 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-030  Context window assembly order:
 *            1. Persona system prompt
 *            2. Persistent memory (org-scoped)
 *            3. Session memory (session-scoped)
 *            4. (Wave 5+) Domain knowledge via RAG
 *            5. Current user input
 */
import { describe, it, expect, vi } from 'vitest';
import { MemoryLifecycle } from '../../memory/MemoryLifecycle.js';
import {
  Capability,
  type AICentreRequest,
  type AICentreResponse,
  type SessionMemoryStore,
  type PersistentMemoryAdapter,
  type PersistedMemoryEntry,
  type MemoryTurn,
} from '../../types/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(): AICentreRequest {
  return {
    capability: Capability.ADVISORY,
    agent: 'mat-advisor',
    input: { text: 'How do I improve my maturity score?' },
    context: { organisationId: 'org-001', sessionId: 'sess-001', userId: 'user-001' },
  };
}

function makeResponse(): AICentreResponse {
  return {
    capability: Capability.ADVISORY,
    result: {
      capability: Capability.ADVISORY,
      text: 'Focus on access control and risk management.',
      providerUsed: 'github-models',
    },
    telemetry: {
      id: 'tel-001',
      organisationId: 'org-001',
      capability: Capability.ADVISORY,
      providerUsed: 'github-models',
      promptTokens: 50,
      completionTokens: 20,
      latencyMs: 350,
      recordedAt: Date.now(),
    },
  };
}

function makeSessionStore(): SessionMemoryStore {
  const data: Record<string, MemoryTurn[]> = {};
  return {
    append: vi.fn((sessionId: string, turn: MemoryTurn) => {
      data[sessionId] = [...(data[sessionId] ?? []), turn];
    }),
    getHistory: vi.fn((sessionId: string) => data[sessionId] ?? []),
    prune: vi.fn(),
    clearSession: vi.fn((sessionId: string) => {
      delete data[sessionId];
    }),
  };
}

function makePersistentAdapter(): PersistentMemoryAdapter {
  const store: PersistedMemoryEntry[] = [];
  return {
    retrieve: vi.fn(async () => [...store]),
    persist: vi.fn(async (entry: PersistedMemoryEntry) => {
      store.push(entry);
    }),
    pruneExpired: vi.fn(async () => 0),
  };
}

// ---------------------------------------------------------------------------
// Tests (GRS-030)
// ---------------------------------------------------------------------------

describe('MemoryLifecycle', () => {
  it(
    // GRS-030 | AAD §9.2 — context window assembly order
    "assembles context window with segments in the canonical order (persona, persistent, session, user input)",
    async () => {
      const sessionStore = makeSessionStore();
      const persistentAdapter = makePersistentAdapter();

      // Pre-populate session memory
      sessionStore.append('sess-001', {
        role: 'user',
        content: 'Previous question',
        timestamp: Date.now() - 2000,
        estimatedTokens: 5,
      });
      sessionStore.append('sess-001', {
        role: 'assistant',
        content: 'Previous answer',
        timestamp: Date.now() - 1000,
        estimatedTokens: 5,
      });

      // Pre-populate persistent memory
      await persistentAdapter.persist({
        organisationId: 'org-001',
        role: 'user',
        content: 'Long-term context',
        capability: Capability.ADVISORY,
        timestamp: Date.now() - 10000,
      });

      const lifecycle = new MemoryLifecycle({
        sessionStore,
        persistentAdapter,
      });

      const assembled = await lifecycle.assembleContextWindow({
        organisationId: 'org-001',
        sessionId: 'sess-001',
        userInput: 'What should I focus on next?',
        personaSystemPrompt: '# MAT Advisor',
      });

      // Verify order: persona → persistent → session → user input
      expect(assembled[0]).toMatchObject({ role: 'system' }); // persona
      expect(assembled[1]).toMatchObject({ content: 'Long-term context' }); // persistent
      expect(assembled[2]).toMatchObject({ content: 'Previous question' }); // session (user)
      expect(assembled[3]).toMatchObject({ content: 'Previous answer' }); // session (assistant)
      expect(assembled[assembled.length - 1]).toMatchObject({
        role: 'user',
        content: 'What should I focus on next?',
      }); // current user input
    },
  );

  it(
    // GRS-030 | AAD §9.2
    "recordTurn() appends user and assistant turns to session memory after a successful response",
    async () => {
      const sessionStore = makeSessionStore();
      const lifecycle = new MemoryLifecycle({
        sessionStore,
        persistentAdapter: makePersistentAdapter(),
      });

      await lifecycle.recordTurn({ request: makeRequest(), response: makeResponse() });

      const history = sessionStore.getHistory('sess-001');
      expect(history).toHaveLength(2);
      expect(history[0]!.role).toBe('user');
      expect(history[1]!.role).toBe('assistant');
    },
  );

  it(
    // GRS-031 | AAD §9.2
    "pruneSession() trims session memory before context assembly",
    () => {
      const sessionStore = makeSessionStore();

      // Add 10 turns, each 100 tokens
      for (let i = 0; i < 10; i++) {
        sessionStore.append('sess-001', {
          role: 'user',
          content: `Turn ${i}`,
          timestamp: i * 1000,
          estimatedTokens: 100,
        });
      }

      const lifecycle = new MemoryLifecycle({
        sessionStore,
        persistentAdapter: makePersistentAdapter(),
      });

      lifecycle.pruneSession('sess-001');

      // After pruning, the session store's prune method should have been called
      expect(sessionStore.prune).toHaveBeenCalledWith('sess-001', expect.any(Number));
    },
  );
});
