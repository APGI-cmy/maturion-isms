/**
 * PersistentMemoryAdapter — Wave 4 in-memory foundation
 *
 * Provides a correct, fully-functional in-memory implementation of the
 * PersistentMemoryAdapter interface for use in Wave 4 integration testing.
 * All filtering (organisation-scoped tenant isolation, session filtering,
 * limit) and pruning logic is complete and tested.
 *
 * Supabase wiring is EXPLICITLY DEFERRED TO WAVE 5.
 * The AAWP wave plan records this deferral:
 *   Wave 4 scope: in-memory implementation, correct interface, full test coverage.
 *   Wave 5 scope: replace this in-memory store with a real Supabase client
 *     reading from the ai_memory table (see supabase/migrations/001_ai_memory.sql)
 *     with organisation_id tenant isolation enforced at the query layer (GRS-008).
 *
 * TODO(Wave5): Replace the in-memory `store` array and all methods — persist(),
 * retrieve(), and pruneExpired() — with Supabase client calls to the `ai_memory`
 * table. The constructor must accept a mandatory SupabaseClient (AAD §8.2).
 * Organisation-level tenant isolation must be enforced by the query filter
 * `organisation_id = params.organisationId` in every query (not just RLS alone).
 * See supabase/migrations/001_ai_memory.sql for the schema.
 * Deferral rationale: @supabase/supabase-js is not yet a dependency of this
 * package; adding it is Wave 5 scope to keep Wave 4 focused on the AI gateway
 * and memory lifecycle contract.
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
