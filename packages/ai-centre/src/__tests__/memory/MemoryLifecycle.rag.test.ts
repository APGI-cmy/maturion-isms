/**
 * RED Gate QA Suite — MemoryLifecycle RAG / KnowledgeRetriever
 *
 * All tests MUST FAIL until Wave 5 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-006 (embeddings), GRS-030 (RAG context assembly) | APS §6.2 | AAD §7 (Wave 5 row)
 */
import { describe, it, expect, vi } from 'vitest';
import { MemoryLifecycle } from '../../memory/MemoryLifecycle.js';
import type { MemoryLifecycleDeps } from '../../memory/MemoryLifecycle.js';
import {
  Capability,
  type SessionMemoryStore,
  type PersistentMemoryAdapter,
  type PersistedMemoryEntry,
  type MemoryTurn,
  type KnowledgeEntry,
  type KnowledgeRetriever,
} from '../../types/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

/**
 * Mock KnowledgeRetriever — returns the supplied entries from retrieve().
 * Injected into MemoryLifecycle deps to exercise the Wave 5 RAG path.
 */
function makeKnowledgeRetriever(entries: KnowledgeEntry[] = []): KnowledgeRetriever {
  return {
    retrieve: vi.fn().mockResolvedValue(entries),
  };
}

/**
 * Build MemoryLifecycle deps that include a knowledgeRetriever.
 *
 * NOTE: The current MemoryLifecycleDeps interface does NOT include
 * knowledgeRetriever — Wave 5 builder must extend it.  We use a type cast
 * here so the test file compiles today; the RED assertions will fail at
 * runtime because the retriever is silently ignored by the constructor.
 */
function makeDepsWithRetriever(
  retriever: KnowledgeRetriever,
): MemoryLifecycleDeps {
  return {
    sessionStore: makeSessionStore(),
    persistentAdapter: makePersistentAdapter(),
    // RED: knowledgeRetriever is NOT a valid key in MemoryLifecycleDeps yet.
    // Wave 5 builder adds it; until then this property is ignored → RED assertions below.
    knowledgeRetriever: retriever,
  } as unknown as MemoryLifecycleDeps;
}

// ---------------------------------------------------------------------------
// RED Gate Tests — will FAIL until Wave 5 MemoryLifecycle RAG path is built
// ---------------------------------------------------------------------------

describe('MemoryLifecycle — Wave 5 RAG / KnowledgeRetriever (RED gate)', () => {
  it(
    // GRS-030 | APS §7.3 — step 4: domain knowledge segment
    'assembleContextWindow() includes domain knowledge segment when KnowledgeRetriever is provided',
    async () => {
      // RED: MemoryLifecycleDeps does not yet accept knowledgeRetriever.
      // The retriever is ignored → no domain knowledge segment appears → assertion fails.
      const entries: KnowledgeEntry[] = [
        { content: 'ISO 27001 Annex A.9: Access Control policy requires MFA.', source: 'iso27001' },
      ];
      const retriever = makeKnowledgeRetriever(entries);
      const lifecycle = new MemoryLifecycle(makeDepsWithRetriever(retriever));

      const assembled = await lifecycle.assembleContextWindow({
        organisationId: 'org-001',
        sessionId: undefined,
        userInput: 'What is the MFA requirement?',
        personaSystemPrompt: '# MAT Advisor',
      });

      // At least one segment must carry the knowledge entry content
      const knowledgeSegment = assembled.find((s) =>
        s.content.includes('ISO 27001 Annex A.9'),
      );
      expect(knowledgeSegment).toBeDefined();
    },
  );

  it(
    // GRS-030 | APS §7.3 — GRS-030 canonical order: persona → persistent → session → domain knowledge → user input
    'assembleContextWindow() inserts domain knowledge BEFORE user input (GRS-030 order: persona → persistent → session → domain knowledge → user input)',
    async () => {
      // RED: Domain knowledge step is not implemented — no knowledge segment is inserted.
      // Wave 5 builder must insert knowledge entries at position 4 (before user input).
      const entries: KnowledgeEntry[] = [
        { content: 'NIST SP 800-53 AC-2: Account Management controls.', source: 'nist' },
      ];
      const retriever = makeKnowledgeRetriever(entries);
      const lifecycle = new MemoryLifecycle(makeDepsWithRetriever(retriever));

      const assembled = await lifecycle.assembleContextWindow({
        organisationId: 'org-001',
        sessionId: undefined,
        userInput: 'Explain account management.',
        personaSystemPrompt: '# MAT Advisor',
      });

      const userInputIdx = assembled.findIndex(
        (s) => s.role === 'user' && s.content === 'Explain account management.',
      );
      const knowledgeIdx = assembled.findIndex((s) =>
        s.content.includes('NIST SP 800-53 AC-2'),
      );

      // Domain knowledge must appear AND must be before the final user input
      expect(knowledgeIdx).toBeGreaterThanOrEqual(0);
      expect(knowledgeIdx).toBeLessThan(userInputIdx);
    },
  );

  it(
    // GRS-030 | APS §7.3 — retriever is wired to assembleContextWindow query
    'assembleContextWindow() calls KnowledgeRetriever.retrieve() with the userInput as query',
    async () => {
      // RED: retriever.retrieve() is never called because the RAG step is not wired up.
      const retriever = makeKnowledgeRetriever([]);
      const lifecycle = new MemoryLifecycle(makeDepsWithRetriever(retriever));

      const userInput = 'How do I achieve ISO 27001 certification?';
      await lifecycle.assembleContextWindow({
        organisationId: 'org-001',
        sessionId: undefined,
        userInput,
        personaSystemPrompt: '# MAT Advisor',
      });

      // retrieve() must have been called with the userInput as the query argument
      expect(retriever.retrieve).toHaveBeenCalledWith(
        userInput,
        'org-001',
        expect.anything(),
      );
    },
  );

  it(
    // GRS-030 | APS §7.3 — multiple knowledge entries produce multiple segments
    'assembleContextWindow() includes multiple knowledge entries as separate segments',
    async () => {
      // RED: No knowledge segments are inserted (RAG step not implemented).
      // Wave 5 builder must iterate retriever results and push one segment per entry.
      const entries: KnowledgeEntry[] = [
        { content: 'Entry A: risk treatment options.', source: 'doc-A' },
        { content: 'Entry B: vulnerability management.', source: 'doc-B' },
        { content: 'Entry C: audit trail requirements.', source: 'doc-C' },
      ];
      const retriever = makeKnowledgeRetriever(entries);
      const lifecycle = new MemoryLifecycle(makeDepsWithRetriever(retriever));

      const assembled = await lifecycle.assembleContextWindow({
        organisationId: 'org-001',
        sessionId: undefined,
        userInput: 'Summarise the risk and audit requirements.',
        personaSystemPrompt: '# MAT Advisor',
      });

      const knowledgeSegments = assembled.filter(
        (s) =>
          s.content.includes('Entry A') ||
          s.content.includes('Entry B') ||
          s.content.includes('Entry C'),
      );

      // All three knowledge entries must appear as separate segments
      expect(knowledgeSegments.length).toBe(3);
    },
  );

  // ---------------------------------------------------------------------------
  // BACKWARD COMPATIBILITY — this test MUST PASS (no regression)
  // ---------------------------------------------------------------------------

  it(
    // GRS-030 | APS §7.3 — backward compatibility: no knowledgeRetriever means no domain knowledge segment
    'assembleContextWindow() without KnowledgeRetriever produces no domain knowledge segment (backward compatible)',
    async () => {
      // SHOULD PASS: the current implementation already produces this behaviour —
      // step 4 (RAG) is commented out, so no domain knowledge segments are added.
      const lifecycle = new MemoryLifecycle({
        sessionStore: makeSessionStore(),
        persistentAdapter: makePersistentAdapter(),
      });

      const assembled = await lifecycle.assembleContextWindow({
        organisationId: 'org-001',
        sessionId: undefined,
        userInput: 'How do I get started?',
        personaSystemPrompt: '# MAT Advisor',
      });

      // With no retriever: only persona (system) + user input — exactly 2 segments
      expect(assembled).toHaveLength(2);
      expect(assembled[0]).toMatchObject({ role: 'system' }); // persona
      expect(assembled[1]).toMatchObject({ role: 'user', content: 'How do I get started?' });
    },
  );
});
