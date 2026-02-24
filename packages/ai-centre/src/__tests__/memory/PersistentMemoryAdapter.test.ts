/**
 * RED Gate QA Suite — PersistentMemoryAdapter
 *
 * All tests MUST FAIL until Wave 4 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-008 | APS §7.2 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-008  Supabase persistent memory with organisation-level tenant isolation
 *
 * ⚠️  WAVE 4 BUILDER MANDATORY REQUIREMENTS:
 *
 * 1. SUPABASE BACKEND REQUIRED — GRS-008 mandates Supabase-backed storage with
 *    organisation-level RLS. An in-memory implementation silently violates tenant
 *    isolation and WILL NOT satisfy GRS-008. The constructor MUST accept a
 *    SupabaseClient parameter and MUST throw if none is supplied.
 *
 * 2. CONSTRUCTOR SIGNATURE — update the stub constructor signature to:
 *      constructor(supabaseClient: SupabaseClient)
 *    and throw `new Error('SupabaseClient is required for PersistentMemoryAdapter')`
 *    if the client is undefined/null.
 *
 * 3. RLS ENFORCEMENT — all queries MUST include `organisation_id` scoping that
 *    aligns with the `ai_memory` table RLS policy in AAD §7.4 / APS §7.4.
 *
 * 4. DO NOT satisfy these tests by using in-memory maps or arrays.
 */
import { describe, it, expect } from 'vitest';
import { PersistentMemoryAdapter } from '../../memory/PersistentMemoryAdapter.js';
import { Capability, type PersistedMemoryEntry } from '../../types/index.js';
import { createMockSupabaseClient } from '../helpers/mockSupabaseClient.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEntry(overrides: Partial<PersistedMemoryEntry> = {}): PersistedMemoryEntry {
  return {
    organisationId: 'org-001',
    role: 'user',
    content: 'What are the ISO 27001 Annex A controls?',
    capability: Capability.ADVISORY,
    timestamp: Date.now(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests (GRS-008)
// ---------------------------------------------------------------------------

describe('PersistentMemoryAdapter', () => {
  it(
    // GRS-008 | AAD §9.2
    "retrieve() returns only entries belonging to the specified organisationId",
    async () => {
      const adapter = new PersistentMemoryAdapter(createMockSupabaseClient());

      await adapter.persist(makeEntry({ organisationId: 'org-001' }));
      await adapter.persist(makeEntry({ organisationId: 'org-002' }));

      const results = await adapter.retrieve({ organisationId: 'org-001' });

      expect(results.every((e) => e.organisationId === 'org-001')).toBe(true);
    },
  );

  it(
    // GRS-008 | AAD §9.2
    "retrieve() returns empty array for an organisation with no persisted memory",
    async () => {
      const adapter = new PersistentMemoryAdapter(createMockSupabaseClient());

      const results = await adapter.retrieve({ organisationId: 'org-999' });

      expect(results).toEqual([]);
    },
  );

  it(
    // GRS-008 | AAD §9.2
    "persist() stores the entry tagged with the correct organisationId",
    async () => {
      const adapter = new PersistentMemoryAdapter(createMockSupabaseClient());
      const entry = makeEntry({ organisationId: 'org-abc' });

      await adapter.persist(entry);

      const results = await adapter.retrieve({ organisationId: 'org-abc' });

      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.organisationId).toBe('org-abc');
    },
  );

  it(
    // GRS-008 | AAD §9.2
    "pruneExpired() deletes entries past their expiresAt timestamp",
    async () => {
      const adapter = new PersistentMemoryAdapter(createMockSupabaseClient());

      const expiredEntry = makeEntry({
        organisationId: 'org-prune',
        // expiresAt set in the past
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      });
      await adapter.persist(expiredEntry);

      const deletedCount = await adapter.pruneExpired('org-prune');

      expect(deletedCount).toBeGreaterThan(0);
      const remaining = await adapter.retrieve({ organisationId: 'org-prune' });
      expect(remaining.length).toBe(0);
    },
  );

  it(
    // GRS-008 | AAD §9.2 — Supabase enforcement (see file header for Wave 4 requirements)
    "is backed by Supabase — constructor accepts a Supabase client (not in-memory)",
    () => {
      // PersistentMemoryAdapter MUST require a SupabaseClient to enforce org-level
      // tenant isolation (GRS-008 / APS §7.4 RLS policy). Constructing without a
      // client is invalid — an in-memory fallback silently violates GRS-008.
      //
      // Wave 4 builder: update the constructor to accept SupabaseClient and throw
      // 'SupabaseClient is required for PersistentMemoryAdapter' when absent.
      // Cast to a permissive constructor type so we can test the runtime guard
      // with an explicit undefined argument, without TypeScript rejecting the call
      // at compile time (the real constructor signature is updated in Wave 4).
      type PermissiveConstructor = new (client?: unknown) => unknown;
      expect(
        () => new (PersistentMemoryAdapter as unknown as PermissiveConstructor)(undefined),
      ).toThrow('SupabaseClient is required for PersistentMemoryAdapter');
    },
  );
});
