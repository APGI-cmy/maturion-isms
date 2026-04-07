/**
 * EpisodicMemoryAdapter — Supabase-backed implementation (GAP-009 / F-D4-001)
 *
 * Resolves GAP-009: the Wave 9.3 in-memory implementation silently violated
 * GRS-009 tenant isolation. This implementation wires record() and retrieve()
 * to the Supabase `ai_episodic_events` table.
 *
 * Append-only contract: record() and retrieve() only — no update() or delete().
 * The ai_episodic_events table enforces immutability via SQL rules.
 *
 * References: GRS-009 | APS §7.6 | AAD §9.4
 * Schema: packages/ai-centre/supabase/migrations/004_ai_episodic_memory.sql
 */
import type {
  EpisodicMemoryAdapter as IEpisodicMemoryAdapter,
  EpisodicEventEntry,
} from '../types/index.js';

// ---------------------------------------------------------------------------
// Minimal Supabase client interface — avoids @supabase/supabase-js as a
// direct package dependency of @maturion/ai-centre. The root package carries
// the real @supabase/supabase-js dep; request.ts injects a compatible client.
// ---------------------------------------------------------------------------

interface SupabaseMinimalClient {
  rpc(
    fn: string,
    params?: Record<string, unknown>,
  ): PromiseLike<{ error: unknown }>;
  from(table: string): {
    insert(data: Record<string, unknown>): PromiseLike<{ error: unknown }>;
    select(cols?: string): {
      eq(
        col: string,
        val: unknown,
      ): {
        eq(
          col: string,
          val: unknown,
        ): {
          order(
            col: string,
            opts?: unknown,
          ): PromiseLike<{
            data: Record<string, unknown>[] | null;
            error: unknown;
          }>;
        };
        order(
          col: string,
          opts?: unknown,
        ): PromiseLike<{
          data: Record<string, unknown>[] | null;
          error: unknown;
        }>;
      };
    };
  };
}

// ---------------------------------------------------------------------------
// Row mapping helpers
// ---------------------------------------------------------------------------

/** Map an EpisodicEventEntry (camelCase) → ai_episodic_events row (snake_case). */
function toRow(entry: EpisodicEventEntry): Record<string, unknown> {
  return {
    organisation_id: entry.organisationId,
    session_id: entry.sessionId,
    agent_id: entry.agentId,
    event_type: entry.eventType,
    capability: entry.capability,
    summary: entry.summary,
    full_context: entry.fullContext ?? null,
  };
}

/** Map an ai_episodic_events row (snake_case) → EpisodicEventEntry (camelCase). */
function fromRow(row: Record<string, unknown>): EpisodicEventEntry {
  const createdAtRaw = row['created_at'];
  const createdAt =
    typeof createdAtRaw === 'string'
      ? new Date(createdAtRaw).getTime()
      : typeof createdAtRaw === 'number'
        ? createdAtRaw
        : undefined;

  return {
    organisationId: row['organisation_id'] as string,
    sessionId: row['session_id'] as string,
    agentId: row['agent_id'] as string,
    eventType: row['event_type'] as string,
    capability: row['capability'] as EpisodicEventEntry['capability'],
    summary: row['summary'] as string,
    fullContext: (row['full_context'] as string | null) ?? undefined,
    createdAt,
  };
}

// ---------------------------------------------------------------------------
// EpisodicMemoryAdapter
// ---------------------------------------------------------------------------

export class EpisodicMemoryAdapter implements IEpisodicMemoryAdapter {
  private readonly supabase: SupabaseMinimalClient;

  constructor(supabaseClient: SupabaseMinimalClient) {
    if (!supabaseClient) {
      throw new Error('SupabaseClient is required for EpisodicMemoryAdapter');
    }
    this.supabase = supabaseClient;
  }

  /**
   * Record an episodic event by INSERTing into ai_episodic_events.
   *
   * Sets app.current_organisation_id before INSERT for RLS enforcement (GRS-009).
   * The ai_episodic_events INSERT policy checks:
   *   organisation_id = current_setting('app.current_organisation_id', true)
   */
  async record(entry: EpisodicEventEntry): Promise<void> {
    const { error: settingError } = await this.supabase.rpc('set_config', {
      parameter: 'app.current_organisation_id',
      value: entry.organisationId,
      is_local: true,
    });
    if (settingError) {
      throw settingError;
    }

    const { error } = await this.supabase
      .from('ai_episodic_events')
      .insert(toRow(entry));
    if (error) {
      throw error;
    }
  }

  /**
   * Retrieve episodic events for the given organisation (and optionally session).
   *
   * GRS-009: every query scopes to organisation_id for tenant isolation at the
   * application layer. Entries are returned newest-first.
   */
  async retrieve(params: {
    organisationId: string;
    sessionId?: string;
    limit?: number;
  }): Promise<EpisodicEventEntry[]> {
    let result: {
      data: Record<string, unknown>[] | null;
      error: unknown;
    };

    if (params.sessionId !== undefined) {
      result = await this.supabase
        .from('ai_episodic_events')
        .select('*')
        .eq('organisation_id', params.organisationId)
        .eq('session_id', params.sessionId)
        .order('created_at', { ascending: false });
    } else {
      result = await this.supabase
        .from('ai_episodic_events')
        .select('*')
        .eq('organisation_id', params.organisationId)
        .order('created_at', { ascending: false });
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
}
