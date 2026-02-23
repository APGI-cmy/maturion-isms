/**
 * SessionMemoryStore — Wave 2 implementation
 *
 * In-process in-memory session turn storage.
 *
 * References: GRS-007, GRS-031 | APS §7.1 | AAD §5.5
 */
import type {
  SessionMemoryStore as ISessionMemoryStore,
  MemoryTurn,
} from '../types/index.js';

export class SessionMemoryStore implements ISessionMemoryStore {
  private readonly sessions = new Map<string, MemoryTurn[]>();

  append(sessionId: string, turn: MemoryTurn): void {
    const turns = this.sessions.get(sessionId) ?? [];
    turns.push(turn);
    this.sessions.set(sessionId, turns);
  }

  getHistory(sessionId: string): MemoryTurn[] {
    return this.sessions.get(sessionId) ?? [];
  }

  prune(sessionId: string, maxTokenBudget: number): void {
    const turns = this.sessions.get(sessionId);
    if (!turns) return;

    let total = turns.reduce((sum, t) => sum + t.estimatedTokens, 0);
    while (total > maxTokenBudget && turns.length > 0) {
      const removed = turns.shift()!;
      total -= removed.estimatedTokens;
    }
    this.sessions.set(sessionId, turns);
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
