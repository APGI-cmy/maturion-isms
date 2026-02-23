/**
 * RED Gate QA Suite — SessionMemoryStore
 *
 * All tests MUST FAIL until Wave 2 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-007, GRS-031 | APS §7.1 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-007  In-process session memory
 *   GRS-031  Memory lifecycle with PRUNE
 */
import { describe, it, expect } from 'vitest';
import { SessionMemoryStore } from '../../memory/SessionMemoryStore.js';
import type { MemoryTurn } from '../../types/index.js';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function makeTurn(overrides: Partial<MemoryTurn> = {}): MemoryTurn {
  return {
    role: 'user',
    content: 'Tell me about ISO 27001.',
    timestamp: Date.now(),
    estimatedTokens: 10,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests (GRS-007, GRS-031)
// ---------------------------------------------------------------------------

describe('SessionMemoryStore', () => {
  it(
    // GRS-007 | AAD §9.2
    "getHistory() returns empty array for an unknown sessionId",
    () => {
      const store = new SessionMemoryStore();

      const history = store.getHistory('session-does-not-exist');

      expect(history).toEqual([]);
    },
  );

  it(
    // GRS-007 | AAD §9.2
    "append() adds a turn to the session in chronological order",
    () => {
      const store = new SessionMemoryStore();
      const t1 = makeTurn({ content: 'First message', timestamp: 1000 });
      const t2 = makeTurn({ role: 'assistant', content: 'First reply', timestamp: 2000 });

      store.append('sess-001', t1);
      store.append('sess-001', t2);

      const history = store.getHistory('sess-001');

      expect(history).toHaveLength(2);
      expect(history[0]!.content).toBe('First message');
      expect(history[1]!.content).toBe('First reply');
    },
  );

  it(
    // GRS-031 | AAD §9.2
    "prune() removes oldest turns when token budget is exceeded",
    () => {
      const store = new SessionMemoryStore();

      // Append 5 turns, each with 100 estimated tokens (total = 500)
      for (let i = 1; i <= 5; i++) {
        store.append('sess-002', makeTurn({ content: `Turn ${i}`, estimatedTokens: 100, timestamp: i * 1000 }));
      }

      // Prune to fit within 250 tokens — should remove 3 oldest turns
      store.prune('sess-002', 250);

      const history = store.getHistory('sess-002');

      // At most 2 turns (2 × 100 = 200 ≤ 250) should remain
      expect(history.length).toBeLessThanOrEqual(2);
      // The remaining turns should be the most recent ones
      if (history.length > 0) {
        expect(history[history.length - 1]!.content).toBe('Turn 5');
      }
    },
  );

  it(
    // GRS-007 | AAD §9.2
    "clearSession() releases all memory for the session",
    () => {
      const store = new SessionMemoryStore();

      store.append('sess-003', makeTurn());
      store.append('sess-003', makeTurn({ role: 'assistant' }));
      expect(store.getHistory('sess-003')).toHaveLength(2);

      store.clearSession('sess-003');

      expect(store.getHistory('sess-003')).toEqual([]);
    },
  );
});
