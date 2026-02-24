/**
 * PersistentMemoryAdapter — Wave 5 Supabase-backed implementation
 *
 * Implements persistent memory storage via Supabase client against the
 * `ai_memory` table (see supabase/migrations/001_ai_memory.sql).
 *
 * Organisation-level tenant isolation is enforced at the query layer via the
 * explicit SQL filter `organisation_id = params.organisationId` in every query,
 * in addition to the RLS policy defined in the migration (GRS-008).
 *
 * Constructor requires a SupabaseClient (AAD §8.2). Passing undefined throws.
 *
 * References: GRS-008 | APS §7.2 | AAD §5.6, §8.2
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  PersistentMemoryAdapter as IPersistentMemoryAdapter,
  PersistedMemoryEntry,
} from '../types/index.js';

/** Row shape as stored in the ai_memory table. */
interface AiMemoryRow {
  id: string;
  organisation_id: string;
  session_id: string | null;
  user_id: string | null;
  role: 'user' | 'assistant';
  content: string;
  capability: string;
  timestamp: number;
  expires_at: string | null;
}

export class PersistentMemoryAdapter implements IPersistentMemoryAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly client: SupabaseClient<any, any, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(supabaseClient?: SupabaseClient<any, any, any>) {
    if (supabaseClient === undefined || supabaseClient === null) {
      throw new Error('SupabaseClient is required for PersistentMemoryAdapter');
    }
    this.client = supabaseClient;
  }

  async retrieve(params: {
    organisationId: string;
    sessionId?: string;
    limit?: number;
  }): Promise<PersistedMemoryEntry[]> {
    let query = this.client
      .from('ai_memory')
      .select('*')
      .eq('organisation_id', params.organisationId);

    if (params.sessionId !== undefined) {
      query = query.eq('session_id', params.sessionId);
    }

    if (params.limit !== undefined) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`PersistentMemoryAdapter.retrieve failed: ${error.message}`);
    }

    return ((data as AiMemoryRow[]) ?? []).map((row) => ({
      id: row.id,
      organisationId: row.organisation_id,
      sessionId: row.session_id ?? undefined,
      userId: row.user_id ?? undefined,
      role: row.role,
      content: row.content,
      capability: row.capability as PersistedMemoryEntry['capability'],
      timestamp: row.timestamp,
      expiresAt: row.expires_at ?? undefined,
    }));
  }

  async persist(entry: PersistedMemoryEntry): Promise<void> {
    const row: Record<string, unknown> = {
      organisation_id: entry.organisationId,
      session_id: entry.sessionId ?? null,
      user_id: entry.userId ?? null,
      role: entry.role,
      content: entry.content,
      capability: entry.capability,
      timestamp: entry.timestamp,
      expires_at: entry.expiresAt ?? null,
    };
    if (entry.id !== undefined) {
      row['id'] = entry.id;
    }
    const { error } = await this.client.from('ai_memory').insert(row);

    if (error) {
      throw new Error(`PersistentMemoryAdapter.persist failed: ${error.message}`);
    }
  }

  async pruneExpired(organisationId: string): Promise<number> {
    const { data, error } = await this.client
      .from('ai_memory')
      .delete()
      .eq('organisation_id', organisationId)
      .lt('expires_at', new Date().toISOString())
      .not('expires_at', 'is', null)
      .select('id');

    if (error) {
      throw new Error(`PersistentMemoryAdapter.pruneExpired failed: ${error.message}`);
    }

    return (data as { id: string }[] | null)?.length ?? 0;
  }
}
