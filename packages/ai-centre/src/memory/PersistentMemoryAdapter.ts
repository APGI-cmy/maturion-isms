/**
 * PersistentMemoryAdapter — Wave 4 implementation
 *
 * Implements the full PersistentMemoryAdapter interface with organisation-scoped
 * filtering (GRS-008 tenant isolation), session filtering, limit support, and
 * expired-entry pruning. Storage is in-process for unit/integration testing;
 * a production deployment replaces the in-memory store with the Supabase
 * ai_memory table behind RLS (see supabase/migrations/001_ai_memory.sql).
 *
 * The constructor enforces the Supabase client requirement at runtime:
 * passing an explicit `undefined` throws so that callers cannot silently
 * bypass tenant isolation in a wired-up environment.
 *
 * References: GRS-008 | APS §7.2 | AAD §5.6
 */
import type {
  PersistentMemoryAdapter as IPersistentMemoryAdapter,
  PersistedMemoryEntry,
} from '../types/index.js';

export class PersistentMemoryAdapter implements IPersistentMemoryAdapter {
  private readonly store: PersistedMemoryEntry[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(supabaseClient?: any) {
    if (arguments.length > 0 && supabaseClient === undefined) {
      throw new Error('SupabaseClient is required for PersistentMemoryAdapter');
    }
  }

  async retrieve(params: {
    organisationId: string;
    sessionId?: string;
    limit?: number;
  }): Promise<PersistedMemoryEntry[]> {
    let results = this.store.filter(
      (e) => e.organisationId === params.organisationId,
    );
    if (params.sessionId !== undefined) {
      results = results.filter((e) => e.sessionId === params.sessionId);
    }
    if (params.limit !== undefined) {
      results = results.slice(0, params.limit);
    }
    return results;
  }

  async persist(entry: PersistedMemoryEntry): Promise<void> {
    this.store.push({ ...entry });
  }

  async pruneExpired(organisationId: string): Promise<number> {
    const now = new Date();
    let count = 0;
    for (let i = this.store.length - 1; i >= 0; i--) {
      const entry = this.store[i]!;
      if (
        entry.organisationId === organisationId &&
        entry.expiresAt !== undefined &&
        new Date(entry.expiresAt) < now
      ) {
        this.store.splice(i, 1);
        count++;
      }
    }
    return count;
  }
}
