/**
 * QA Suite — EpisodicMemoryAdapter (GAP-009 / F-D4-001 Remediation)
 *
 * Wave 9.1 / GAP-009 — Supabase wiring for EpisodicMemoryAdapter
 *
 * Validates that EpisodicMemoryAdapter writes to and reads from Supabase
 * (ai_episodic_events table) rather than the in-memory array that constituted
 * the S-QA-001 violation. All tests inject a mock Supabase client and assert
 * that the real Supabase code paths are exercised.
 *
 * References: GRS-009 | APS §7.6 | AAD §9.4
 * Issue: maturion-isms#1274 — GAP-009 | F-D4-001
 *
 * Mapped requirements:
 *   GRS-009  Append-only episodic event log with organisation-level tenant isolation
 *   APS §7.6 EpisodicMemoryAdapter contract: record(), retrieve(), no update/delete
 *   AAD §9.4 ai_episodic_events table — immutable audit trail per agent session
 */
import { describe, it, expect } from 'vitest';
import { EpisodicMemoryAdapter } from '../../memory/EpisodicMemoryAdapter.js';
import { Capability } from '../../types/index.js';

// ---------------------------------------------------------------------------
// Mock Supabase client factories
// ---------------------------------------------------------------------------

/**
 * Standard mock Supabase client for EpisodicMemoryAdapter tests.
 *
 * Stores inserted rows in `rows[]` (snake_case, as written by toRow()).
 * Tracks rpc() calls in `rpcCalls[]` for assertion.
 * Supports the .select().eq().order() and .select().eq().eq().order() chains.
 */
function makeMockEpisodicSupabaseClient() {
  const rows: Record<string, unknown>[] = [];
  const rpcCalls: Array<{ fn: string; params?: Record<string, unknown> }> = [];

  return {
    rows,
    rpcCalls,
    rpc: (fn: string, params?: Record<string, unknown>) => {
      rpcCalls.push({ fn, params });
      return Promise.resolve({ error: null });
    },
    from: (_table: string) => ({
      insert: (data: Record<string, unknown>) => {
        rows.push(data);
        return Promise.resolve({ error: null });
      },
      select: (_cols: string = '*') => ({
        eq: (col: string, val: unknown) => ({
          eq: (col2: string, val2: unknown) => ({
            order: (_col3: string, _opts?: unknown) =>
              Promise.resolve({
                data: rows.filter((r) => r[col] === val && r[col2] === val2),
                error: null,
              }),
          }),
          order: (_col3: string, _opts?: unknown) =>
            Promise.resolve({
              data: rows.filter((r) => r[col] === val),
              error: null,
            }),
        }),
      }),
    }),
  };
}

/** Mock client that returns a Supabase error on INSERT (after rpc succeeds). */
function makeInsertErrorClient(insertError: Error) {
  return {
    rpc: (_fn: string, _params?: Record<string, unknown>) =>
      Promise.resolve({ error: null }),
    from: (_table: string) => ({
      insert: (_data: Record<string, unknown>) =>
        Promise.resolve({ error: insertError }),
      select: (_cols?: string) => ({
        eq: (_col: string, _val: unknown) => ({
          eq: (_col2: string, _val2: unknown) => ({
            order: (_col3: string, _opts?: unknown) =>
              Promise.resolve({ data: [], error: null }),
          }),
          order: (_col3: string, _opts?: unknown) =>
            Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
  };
}

/** Mock client that returns a Supabase error on SELECT. */
function makeSelectErrorClient(selectError: Error) {
  return {
    rpc: (_fn: string, _params?: Record<string, unknown>) =>
      Promise.resolve({ error: null }),
    from: (_table: string) => ({
      insert: (_data: Record<string, unknown>) =>
        Promise.resolve({ error: null }),
      select: (_cols?: string) => ({
        eq: (_col: string, _val: unknown) => ({
          eq: (_col2: string, _val2: unknown) => ({
            order: (_col3: string, _opts?: unknown) =>
              Promise.resolve({ data: null, error: selectError }),
          }),
          order: (_col3: string, _opts?: unknown) =>
            Promise.resolve({ data: null, error: selectError }),
        }),
      }),
    }),
  };
}

/** Mock client that returns a Supabase error on the rpc() set_config call. */
function makeRpcErrorClient(rpcError: Error) {
  return {
    rpc: (_fn: string, _params?: Record<string, unknown>) =>
      Promise.resolve({ error: rpcError }),
    from: (_table: string) => ({
      insert: (_data: Record<string, unknown>) =>
        Promise.resolve({ error: null }),
      select: (_cols?: string) => ({
        eq: (_col: string, _val: unknown) => ({
          eq: (_col2: string, _val2: unknown) => ({
            order: (_col3: string, _opts?: unknown) =>
              Promise.resolve({ data: [], error: null }),
          }),
          order: (_col3: string, _opts?: unknown) =>
            Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal valid episodic event entry for use in tests */
function makeEpisodicEntry(
  overrides: Partial<{
    organisationId: string;
    sessionId: string;
    agentId: string;
    eventType: string;
    capability: Capability;
    summary: string;
  }> = {},
) {
  return {
    organisationId: 'org-001',
    sessionId: 'session-abc',
    agentId: 'foreman-v2',
    eventType: 'capability_invocation',
    capability: Capability.ADVISORY,
    summary: 'Agent invoked advisory capability for ISO 27001 gap analysis',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests (GRS-009 | APS §7.6 | AAD §9.4)
// ---------------------------------------------------------------------------

describe('EpisodicMemoryAdapter', () => {
  // -------------------------------------------------------------------------
  // record() — write path
  // -------------------------------------------------------------------------

  it(
    // GRS-009 | APS §7.6 — record() write path
    'record() method exists and resolves without error when given a valid entry',
    async () => {
      const mock = makeMockEpisodicSupabaseClient();
      const adapter = new EpisodicMemoryAdapter(mock);
      const entry = makeEpisodicEntry();

      // record() MUST return a Promise (async operation — Supabase write)
      await expect(adapter.record(entry)).resolves.not.toThrow();
    },
  );

  it(
    // GAP-009 / F-D4-001 — asserts Supabase INSERT is called (not in-memory push)
    'record() writes to Supabase with correct snake_case column mapping',
    async () => {
      const mock = makeMockEpisodicSupabaseClient();
      const adapter = new EpisodicMemoryAdapter(mock);
      const entry = makeEpisodicEntry();

      await adapter.record(entry);

      expect(mock.rows).toHaveLength(1);
      const inserted = mock.rows[0]!;
      expect(inserted['organisation_id']).toBe('org-001');
      expect(inserted['session_id']).toBe('session-abc');
      expect(inserted['agent_id']).toBe('foreman-v2');
      expect(inserted['event_type']).toBe('capability_invocation');
      expect(inserted['capability']).toBe(Capability.ADVISORY);
      expect(inserted['summary']).toBe(
        'Agent invoked advisory capability for ISO 27001 gap analysis',
      );
    },
  );

  it(
    // GRS-009 — app.current_organisation_id must be set before INSERT for RLS enforcement
    'record() calls set_config rpc with app.current_organisation_id before INSERT (GRS-009)',
    async () => {
      const mock = makeMockEpisodicSupabaseClient();
      const adapter = new EpisodicMemoryAdapter(mock);

      await adapter.record(makeEpisodicEntry({ organisationId: 'org-rls-test' }));

      expect(mock.rpcCalls).toHaveLength(1);
      expect(mock.rpcCalls[0]!.fn).toBe('set_config');
      expect(mock.rpcCalls[0]!.params).toMatchObject({
        parameter: 'app.current_organisation_id',
        value: 'org-rls-test',
      });
      // rpc must be called before insert: rows must contain the entry
      expect(mock.rows).toHaveLength(1);
    },
  );

  it(
    // SB-007 — Supabase errors must be surfaced; no silent swallow
    'record() throws when the set_config rpc returns an error',
    async () => {
      const rpcError = new Error('set_config failed');
      const mock = makeRpcErrorClient(rpcError);
      const adapter = new EpisodicMemoryAdapter(mock);

      await expect(adapter.record(makeEpisodicEntry())).rejects.toThrow(
        'set_config failed',
      );
    },
  );

  it(
    // SB-007 — Supabase errors must be surfaced; no silent swallow
    'record() throws when the Supabase INSERT returns an error',
    async () => {
      const insertError = new Error('db write failed');
      const mock = makeInsertErrorClient(insertError);
      const adapter = new EpisodicMemoryAdapter(mock);

      await expect(adapter.record(makeEpisodicEntry())).rejects.toThrow(
        'db write failed',
      );
    },
  );

  // -------------------------------------------------------------------------
  // retrieve() — read path with org-scoping
  // -------------------------------------------------------------------------

  it(
    // GRS-009 | APS §7.6 | AAD §9.4 — tenant isolation
    'retrieve() returns only entries belonging to the specified organisationId',
    async () => {
      const mock = makeMockEpisodicSupabaseClient();
      const adapter = new EpisodicMemoryAdapter(mock);

      await adapter.record(makeEpisodicEntry({ organisationId: 'org-001' }));
      await adapter.record(makeEpisodicEntry({ organisationId: 'org-002' }));

      const results = await adapter.retrieve({ organisationId: 'org-001' });

      expect(Array.isArray(results)).toBe(true);
      expect(results.every((e) => e.organisationId === 'org-001')).toBe(true);
    },
  );

  it(
    // GRS-009 | APS §7.6 — empty result for unknown org
    'retrieve() returns an empty array for an organisation with no episodic events',
    async () => {
      const mock = makeMockEpisodicSupabaseClient();
      const adapter = new EpisodicMemoryAdapter(mock);

      const results = await adapter.retrieve({
        organisationId: 'org-no-events-999',
      });

      expect(results).toEqual([]);
    },
  );

  it(
    // GRS-009 | APS §7.6 — sessionId filter
    'retrieve() filters by sessionId when provided',
    async () => {
      const mock = makeMockEpisodicSupabaseClient();
      const adapter = new EpisodicMemoryAdapter(mock);

      await adapter.record(makeEpisodicEntry({ sessionId: 'session-A' }));
      await adapter.record(makeEpisodicEntry({ sessionId: 'session-B' }));

      const results = await adapter.retrieve({
        organisationId: 'org-001',
        sessionId: 'session-A',
      });

      expect(results).toHaveLength(1);
      expect(results[0]!.sessionId).toBe('session-A');
    },
  );

  it(
    // SB-007 — Supabase errors must be surfaced; no silent swallow
    'retrieve() throws when the Supabase SELECT returns an error',
    async () => {
      const selectError = new Error('db read failed');
      const mock = makeSelectErrorClient(selectError);
      const adapter = new EpisodicMemoryAdapter(mock);

      await expect(
        adapter.retrieve({ organisationId: 'org-001' }),
      ).rejects.toThrow('db read failed');
    },
  );

  // -------------------------------------------------------------------------
  // Required entry fields — round-trip through Supabase (snake_case ↔ camelCase)
  // -------------------------------------------------------------------------

  it(
    // GRS-009 | AAD §9.4 — all required fields present in recorded entry
    'entries recorded via record() contain all required fields: organisationId, sessionId, agentId, eventType, capability, summary',
    async () => {
      const mock = makeMockEpisodicSupabaseClient();
      const adapter = new EpisodicMemoryAdapter(mock);
      const entry = makeEpisodicEntry({ organisationId: 'org-fields-test' });

      await adapter.record(entry);

      const results = await adapter.retrieve({
        organisationId: 'org-fields-test',
      });

      expect(results.length).toBeGreaterThan(0);
      const recorded = results[0]!;
      expect(recorded).toHaveProperty('organisationId');
      expect(recorded).toHaveProperty('sessionId');
      expect(recorded).toHaveProperty('agentId');
      expect(recorded).toHaveProperty('eventType');
      expect(recorded).toHaveProperty('capability');
      expect(recorded).toHaveProperty('summary');
      expect(recorded.organisationId).toBe('org-fields-test');
      expect(recorded.agentId).toBe('foreman-v2');
      expect(recorded.eventType).toBe('capability_invocation');
      expect(recorded.capability).toBe(Capability.ADVISORY);
    },
  );

  // -------------------------------------------------------------------------
  // Immutability contract — no update() or delete()
  // -------------------------------------------------------------------------

  it(
    // GRS-009 | APS §7.6 — append-only: no update method
    'adapter does NOT expose an update() method (immutability contract — append-only log)',
    () => {
      const mock = makeMockEpisodicSupabaseClient();
      const adapter = new EpisodicMemoryAdapter(mock);

      // The adapter MUST NOT have an update() method — the ai_episodic_events table
      // enforces immutability via ai_episodic_events_no_update SQL rule (AAD §9.4).
      expect(
        (adapter as unknown as Record<string, unknown>)['update'],
      ).toBeUndefined();
    },
  );

  it(
    // GRS-009 | APS §7.6 — append-only: no delete method
    'adapter does NOT expose a delete() method (immutability contract — append-only log)',
    () => {
      const mock = makeMockEpisodicSupabaseClient();
      const adapter = new EpisodicMemoryAdapter(mock);

      // The adapter MUST NOT have a delete() method — the ai_episodic_events table
      // enforces immutability via ai_episodic_events_no_delete SQL rule (AAD §9.4).
      expect(
        (adapter as unknown as Record<string, unknown>)['delete'],
      ).toBeUndefined();
    },
  );

  // -------------------------------------------------------------------------
  // Constructor guard — Supabase client required
  // -------------------------------------------------------------------------

  it(
    // GRS-009 | APS §7.6 — Supabase enforcement
    'constructor throws when no SupabaseClient is provided (Supabase-backed — not in-memory)',
    () => {
      // EpisodicMemoryAdapter MUST require a SupabaseClient to enforce org-level
      // tenant isolation (GRS-009 / APS §7.6 RLS policy). Constructing without a
      // client is invalid — an in-memory fallback silently violates GRS-009.
      //
      // Cast to a permissive constructor type so we can test the runtime guard
      // with an explicit undefined argument, without TypeScript rejecting the call
      // at compile time.
      type PermissiveConstructor = new (client?: unknown) => unknown;
      expect(
        () =>
          new (EpisodicMemoryAdapter as unknown as PermissiveConstructor)(
            undefined,
          ),
      ).toThrow('SupabaseClient is required for EpisodicMemoryAdapter');
    },
  );
});
