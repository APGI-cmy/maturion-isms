/**
 * SupabasePersistentMemoryAdapter — Wave 11 Supabase Persistent Memory
 *
 * Implements the PersistentMemoryAdapter interface backed by the Supabase
 * `ai_memory` table. All queries include organisation_id scoping to enforce
 * tenant isolation at the application layer (GRS-008).
 *
 * Schema reference: packages/ai-centre/supabase/migrations/001_ai_memory.sql
 * References: GRS-008 | APS §7.2 | AAD §9.2 | Wave 11 (Supabase Persistent Memory Wiring)
 */
import type {
  PersistentMemoryAdapter as IPersistentMemoryAdapter,
  PersistedMemoryEntry,
  Capability,
} from '../types/index.js';

// ---------------------------------------------------------------------------
// Minimal Supabase client interface — avoids @supabase/supabase-js as a
// direct package dependency of @maturion/ai-centre. The root package carries
// the real @supabase/supabase-js dep; request.ts injects a compatible client.
// ---------------------------------------------------------------------------

interface SupabaseMinimalClient {
  from(table: string): {
    insert(data: Record<string, unknown>): PromiseLike<{ error: unknown }>;
    select(cols?: string): {
      eq(col: string, val: unknown): {
        eq(col: string, val: unknown): {
          order(
            col: string,
            opts?: unknown,
          ): PromiseLike<{ data: Record<string, unknown>[] | null; error: unknown }>;
        };
        order(
          col: string,
          opts?: unknown,
        ): PromiseLike<{ data: Record<string, unknown>[] | null; error: unknown }>;
      };
    };
    delete(): {
      eq(col: string, val: unknown): {
        lt(
          col: string,
          val: unknown,
        ): PromiseLike<{ count: number | null; error: unknown }>;
      };
    };
  };
}

// ---------------------------------------------------------------------------
// Row mapping helpers
// ---------------------------------------------------------------------------

/** Map a PersistedMemoryEntry (camelCase) → ai_memory row (snake_case). */
function toRow(entry: PersistedMemoryEntry): Record<string, unknown> {
  return {
    organisation_id: entry.organisationId,
    session_id: entry.sessionId ?? null,
    user_id: entry.userId ?? null,
    role: entry.role,
    content: entry.content,
    capability: entry.capability,
    timestamp: entry.timestamp,
    expires_at: entry.expiresAt ?? null,
  };
}

/** Map an ai_memory row (snake_case) → PersistedMemoryEntry (camelCase). */
function fromRow(row: Record<string, unknown>): PersistedMemoryEntry {
  return {
    id: (row['id'] as string | null) ?? undefined,
    organisationId: row['organisation_id'] as string,
    sessionId: (row['session_id'] as string | null) ?? undefined,
    userId: (row['user_id'] as string | null) ?? undefined,
    role: row['role'] as 'user' | 'assistant',
    content: row['content'] as string,
    capability: row['capability'] as Capability,
    timestamp: row['timestamp'] as number,
    expiresAt: (row['expires_at'] as string | null) ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// SupabasePersistentMemoryAdapter
// ---------------------------------------------------------------------------

export class SupabasePersistentMemoryAdapter implements IPersistentMemoryAdapter {
  private readonly supabase: SupabaseMinimalClient;

  constructor(supabaseClient: SupabaseMinimalClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Persist a single memory entry into the ai_memory table.
   * GRS-008: organisation_id is always stored so tenant isolation queries work.
   */
  async persist(entry: PersistedMemoryEntry): Promise<void> {
    const { error } = await this.supabase.from('ai_memory').insert(toRow(entry));
    if (error) {
      throw error;
    }
  }

  /**
   * Retrieve memory entries for the given organisation (and optionally session).
   * GRS-008: every query scopes to organisation_id for tenant isolation.
   */
  async retrieve(params: {
    organisationId: string;
    sessionId?: string;
    limit?: number;
  }): Promise<PersistedMemoryEntry[]> {
    let result: { data: Record<string, unknown>[] | null; error: unknown };

    if (params.sessionId !== undefined) {
      result = await this.supabase
        .from('ai_memory')
        .select('*')
        .eq('organisation_id', params.organisationId)
        .eq('session_id', params.sessionId)
        .order('timestamp', { ascending: false });
    } else {
      result = await this.supabase
        .from('ai_memory')
        .select('*')
        .eq('organisation_id', params.organisationId)
        .order('timestamp', { ascending: false });
    }

    if (result.error) {
      throw result.error;
    }

    const rows = result.data ?? [];
    const entries = rows.map(fromRow);

    if (params.limit !== undefined) {
      return entries.slice(0, params.limit);
    }
    return entries;
  }

  /**
   * Delete all expired entries for the given organisation.
   * GRS-008: scoped to organisation_id; returns count of deleted rows.
   */
  async pruneExpired(organisationId: string): Promise<number> {
    const result = await this.supabase
      .from('ai_memory')
      .delete()
      .eq('organisation_id', organisationId)
      .lt('expires_at', new Date().toISOString());

    if (result.error) {
      throw result.error;
    }

    return result.count ?? 0;
  }
}
