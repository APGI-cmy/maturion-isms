/**
 * EpisodicMemoryAdapter — Wave 9.3 in-memory foundation
 *
 * Provides a correct, fully-functional in-memory implementation of the
 * EpisodicMemoryAdapter interface for use in Wave 9 integration testing.
 * Append-only contract: record() and retrieve() only — no update() or delete().
 *
 * Supabase wiring is EXPLICITLY DEFERRED to a future wave.
 * The AAWP wave plan records this deferral:
 *   Wave 9.3 scope: in-memory implementation, correct interface, full test coverage.
 *   Future wave scope: replace in-memory store with real Supabase client writing
 *     to the ai_episodic_events table (see supabase/migrations/004_ai_episodic_memory.sql)
 *     with organisation_id tenant isolation enforced at the query layer (GRS-009).
 *
 * TODO(Future): Replace in-memory `store` array and all methods — record() and
 * retrieve() — with Supabase client calls to the `ai_episodic_events` table.
 * The constructor must enforce a mandatory SupabaseClient (AAD §9.4).
 * Organisation-level tenant isolation must be enforced by the query filter
 * `organisation_id = params.organisationId` in every query (not just RLS alone).
 * See supabase/migrations/004_ai_episodic_memory.sql for the schema.
 *
 * References: GRS-009 | APS §7.6 | AAD §9.4
 */
import type {
  EpisodicMemoryAdapter as IEpisodicMemoryAdapter,
  EpisodicEventEntry,
} from '../types/index.js';

export class EpisodicMemoryAdapter implements IEpisodicMemoryAdapter {
  private readonly store: EpisodicEventEntry[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(supabaseClient?: any) {
    if (arguments.length > 0 && supabaseClient === undefined) {
      throw new Error('SupabaseClient is required for EpisodicMemoryAdapter');
    }
  }

  async record(entry: EpisodicEventEntry): Promise<void> {
    this.store.push({ ...entry });
  }

  async retrieve(params: {
    organisationId: string;
    sessionId?: string;
    limit?: number;
  }): Promise<EpisodicEventEntry[]> {
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
}
