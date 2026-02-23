/**
 * SessionMemoryStore — STUB (Wave 2 implementation pending)
 *
 * All methods throw NOT_IMPLEMENTED until Wave 2 implementation is complete.
 * Tests against this stub will FAIL (RED) as required by AAD §9 / Step 6.
 *
 * References: GRS-007, GRS-031 | APS §7.1 | AAD §5.5
 */
import type {
  SessionMemoryStore as ISessionMemoryStore,
  MemoryTurn,
} from '../types/index.js';

export class SessionMemoryStore implements ISessionMemoryStore {
  append(_sessionId: string, _turn: MemoryTurn): void {
    throw new Error('NOT_IMPLEMENTED: SessionMemoryStore.append()');
  }

  getHistory(_sessionId: string): MemoryTurn[] {
    throw new Error('NOT_IMPLEMENTED: SessionMemoryStore.getHistory()');
  }

  prune(_sessionId: string, _maxTokenBudget: number): void {
    throw new Error('NOT_IMPLEMENTED: SessionMemoryStore.prune()');
  }

  clearSession(_sessionId: string): void {
    throw new Error('NOT_IMPLEMENTED: SessionMemoryStore.clearSession()');
  }
}
