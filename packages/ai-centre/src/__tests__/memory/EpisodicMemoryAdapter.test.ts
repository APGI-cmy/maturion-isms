/**
 * RED Gate QA Suite — EpisodicMemoryAdapter
 *
 * Wave 9.1 — Schema: Episodic Memory Table (ai_episodic_events)
 * Track A (Foundation Schema)
 *
 * ALL TESTS MUST FAIL (RED) until:
 *   1. Wave 9.3 api-builder creates `src/memory/EpisodicMemoryAdapter.ts`
 *   2. Wave 9.1 schema-builder creates migration `004_ai_episodic_memory.sql`
 *
 * Do NOT modify these tests to pass without a corresponding implementation.
 * Do NOT stub the adapter with in-memory data — Supabase persistence is required.
 *
 * References: GRS-009 | APS §7.6 | AAD §9.4
 *
 * Mapped requirements:
 *   GRS-009  Append-only episodic event log with organisation-level tenant isolation
 *   APS §7.6 EpisodicMemoryAdapter contract: record(), retrieve(), no update/delete
 *   AAD §9.4 ai_episodic_events table — immutable audit trail per agent session
 *
 * ⚠️  WAVE 9.3 API BUILDER MANDATORY REQUIREMENTS:
 *
 * 1. SUPABASE BACKEND REQUIRED — GRS-009 mandates Supabase-backed storage with
 *    organisation-level RLS. An in-memory implementation silently violates tenant
 *    isolation and WILL NOT satisfy GRS-009. The constructor MUST accept a
 *    SupabaseClient parameter and MUST throw if none is supplied.
 *
 * 2. CONSTRUCTOR SIGNATURE —
 *      constructor(supabaseClient: SupabaseClient)
 *    MUST throw `new Error('SupabaseClient is required for EpisodicMemoryAdapter')`
 *    if the client is undefined or null.
 *
 * 3. APPEND-ONLY CONSTRAINT — the adapter MUST expose record() and retrieve() only.
 *    No update() or delete() methods are permitted on this adapter.
 *    The ai_episodic_events table enforces this at the database layer via SQL rules
 *    (ai_episodic_events_no_update, ai_episodic_events_no_delete).
 *
 * 4. RLS ENFORCEMENT — all queries MUST include `organisation_id` scoping aligned
 *    with the ai_episodic_events RLS policy in AAD §9.4 / APS §7.6.
 *
 * 5. REQUIRED ENTRY FIELDS — every recorded entry MUST carry:
 *    organisationId, sessionId, agentId, eventType, capability, summary
 */
import { describe, it, expect } from 'vitest';
import { EpisodicMemoryAdapter } from '../../memory/EpisodicMemoryAdapter.js';
import { Capability } from '../../types/index.js';

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
      const adapter = new EpisodicMemoryAdapter();
      const entry = makeEpisodicEntry();

      // record() MUST return a Promise (async operation — Supabase write)
      await expect(adapter.record(entry)).resolves.not.toThrow();
    },
  );

  // -------------------------------------------------------------------------
  // retrieve() — read path with org-scoping
  // -------------------------------------------------------------------------

  it(
    // GRS-009 | APS §7.6 | AAD §9.4 — tenant isolation
    'retrieve() returns only entries belonging to the specified organisationId',
    async () => {
      const adapter = new EpisodicMemoryAdapter();

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
      const adapter = new EpisodicMemoryAdapter();

      const results = await adapter.retrieve({ organisationId: 'org-no-events-999' });

      expect(results).toEqual([]);
    },
  );

  // -------------------------------------------------------------------------
  // Required entry fields
  // -------------------------------------------------------------------------

  it(
    // GRS-009 | AAD §9.4 — all required fields present in recorded entry
    'entries recorded via record() contain all required fields: organisationId, sessionId, agentId, eventType, capability, summary',
    async () => {
      const adapter = new EpisodicMemoryAdapter();
      const entry = makeEpisodicEntry({ organisationId: 'org-fields-test' });

      await adapter.record(entry);

      const results = await adapter.retrieve({ organisationId: 'org-fields-test' });

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
      const adapter = new EpisodicMemoryAdapter();

      // The adapter MUST NOT have an update() method — the ai_episodic_events table
      // enforces immutability via ai_episodic_events_no_update SQL rule (AAD §9.4).
      expect((adapter as unknown as Record<string, unknown>)['update']).toBeUndefined();
    },
  );

  it(
    // GRS-009 | APS §7.6 — append-only: no delete method
    'adapter does NOT expose a delete() method (immutability contract — append-only log)',
    () => {
      const adapter = new EpisodicMemoryAdapter();

      // The adapter MUST NOT have a delete() method — the ai_episodic_events table
      // enforces immutability via ai_episodic_events_no_delete SQL rule (AAD §9.4).
      expect((adapter as unknown as Record<string, unknown>)['delete']).toBeUndefined();
    },
  );

  // -------------------------------------------------------------------------
  // Constructor guard — Supabase client required
  // -------------------------------------------------------------------------

  it(
    // GRS-009 | APS §7.6 — Supabase enforcement (see file header for Wave 9.3 requirements)
    'constructor throws when no SupabaseClient is provided (Supabase-backed — not in-memory)',
    () => {
      // EpisodicMemoryAdapter MUST require a SupabaseClient to enforce org-level
      // tenant isolation (GRS-009 / APS §7.6 RLS policy). Constructing without a
      // client is invalid — an in-memory fallback silently violates GRS-009.
      //
      // Wave 9.3 api-builder: implement constructor(supabaseClient: SupabaseClient)
      // and throw 'SupabaseClient is required for EpisodicMemoryAdapter' when absent.
      // Cast to a permissive constructor type so we can test the runtime guard
      // with an explicit undefined argument, without TypeScript rejecting the call
      // at compile time.
      type PermissiveConstructor = new (client?: unknown) => unknown;
      expect(
        () => new (EpisodicMemoryAdapter as unknown as PermissiveConstructor)(undefined),
      ).toThrow('SupabaseClient is required for EpisodicMemoryAdapter');
    },
  );
});
