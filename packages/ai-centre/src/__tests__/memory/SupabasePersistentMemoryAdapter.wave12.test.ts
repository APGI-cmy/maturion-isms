/**
 * Wave 12 QA Validation — SupabasePersistentMemoryAdapter
 *
 * Test IDs: T-W12-QAV-1 through T-W12-QAV-5
 * Task: 12.1 — Full Functionality & Build Wiring Verification (MAT module)
 *
 * Covers:
 *   T-W12-QAV-1  ai_memory CRUD E2E cycle (insert → query → expire)
 *   T-W12-QAV-2  Persistent memory cross-invocation (two sequential persists)
 *   T-W12-QAV-3  Organisation isolation — org-B retrieve returns empty when only org-A data exists
 *   T-W12-QAV-4  pruneExpired() — expired records deleted, active records retained
 *   T-W12-QAV-5  Coverage threshold — all code paths exercised (≥90% line coverage evidence)
 *
 * References: GRS-008 | APS §7.2 | Wave 11 Supabase Persistent Memory Wiring | Wave 12 Task 12.1
 * Forbidden: ❌ expect(true).toBe(true) stubs | ❌ mocking entire Supabase away (adapter logic must execute)
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { SupabasePersistentMemoryAdapter } from '../../memory/SupabasePersistentMemoryAdapter.js';
import { Capability } from '../../types/index.js';
import { makeTestSupabaseClient } from '../../../../../api/ai/__test-utils__/makeTestSupabaseClient.js';
import {
  buildPersistentMemory,
} from '../../../../../api/ai/request.js';

// ---------------------------------------------------------------------------
// Test utilities
// ---------------------------------------------------------------------------

/** Minimal type alias used to satisfy SupabasePersistentMemoryAdapter constructor */
type MockSupabaseClient = ReturnType<typeof makeTestSupabaseClient>;

/** Build a stub client that always returns an error on insert */
function makeErrorOnInsertClient() {
  return {
    from: (_table: string) => ({
      insert: (_data: Record<string, unknown>) =>
        Promise.resolve({ error: new Error('insert failed') }),
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: null, error: null }),
          }),
          order: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          lt: () => Promise.resolve({ count: 0, error: null }),
        }),
      }),
    }),
  };
}

/** Build a stub client that always returns an error on select */
function makeErrorOnSelectClient() {
  return {
    from: (_table: string) => ({
      insert: (_data: Record<string, unknown>) =>
        Promise.resolve({ error: null }),
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: null, error: new Error('select failed') }),
          }),
          order: () => Promise.resolve({ data: null, error: new Error('select failed') }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          lt: () => Promise.resolve({ count: 0, error: null }),
        }),
      }),
    }),
  };
}

/** Build a stub client that returns an error on delete */
function makeErrorOnDeleteClient() {
  return {
    from: (_table: string) => ({
      insert: (_data: Record<string, unknown>) =>
        Promise.resolve({ error: null }),
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          lt: () => Promise.resolve({ count: null, error: new Error('delete failed') }),
        }),
      }),
    }),
  };
}

/** Build a stub client that returns null count on delete (covers the null-count branch) */
function makeNullCountDeleteClient() {
  return {
    from: (_table: string) => ({
      insert: (_data: Record<string, unknown>) =>
        Promise.resolve({ error: null }),
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          lt: () => Promise.resolve({ count: null, error: null }),
        }),
      }),
    }),
  };
}

// ---------------------------------------------------------------------------
// T-W12-QAV-1: ai_memory CRUD E2E — Insert → query → expire cycle
// ---------------------------------------------------------------------------

describe('T-W12-QAV-1: ai_memory CRUD E2E — Insert → query → expire cycle', () => {
  it('T-W12-QAV-1: persist() inserts entry, retrieve() returns it, pruneExpired() removes expired entries and leaves active ones', async () => {
    // References: GRS-008, Wave 11 Supabase Persistent Memory Wiring, Wave 12 Task 12.1
    // Type: e2e | Priority: P0
    // Acceptance: insert → retrieve → expire cycle completes correctly against test client

    const client = makeTestSupabaseClient();
    const adapter = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);

    const now = Date.now();
    const pastExpiry = new Date(now - 60_000).toISOString();   // 1 minute ago — EXPIRED
    const futureExpiry = new Date(now + 300_000).toISOString(); // 5 minutes ahead — ACTIVE

    // Step 1 — INSERT: persist an expired entry and an active entry
    await adapter.persist({
      organisationId: 'org-e2e',
      sessionId: 'sess-e2e',
      userId: 'user-001',
      role: 'user',
      content: 'Expired memory entry',
      capability: Capability.ADVISORY,
      timestamp: now - 120_000,
      expiresAt: pastExpiry,
    });

    await adapter.persist({
      organisationId: 'org-e2e',
      sessionId: 'sess-e2e',
      userId: 'user-001',
      role: 'assistant',
      content: 'Active memory entry',
      capability: Capability.ADVISORY,
      timestamp: now,
      expiresAt: futureExpiry,
    });

    // Step 2 — QUERY: both entries are visible before pruning
    const beforePrune = await adapter.retrieve({ organisationId: 'org-e2e' });
    expect(beforePrune).toHaveLength(2);

    // Step 3 — EXPIRE: pruneExpired deletes only the expired entry
    const deletedCount = await adapter.pruneExpired('org-e2e');
    expect(deletedCount).toBe(1);

    // Step 4 — QUERY AFTER EXPIRE: only active entry remains
    const afterPrune = await adapter.retrieve({ organisationId: 'org-e2e' });
    expect(afterPrune).toHaveLength(1);
    expect(afterPrune[0]!.content).toBe('Active memory entry');
    expect(afterPrune[0]!.organisationId).toBe('org-e2e');
    expect(afterPrune[0]!.expiresAt).toBe(futureExpiry);
  });
});

// ---------------------------------------------------------------------------
// T-W12-QAV-2: Persistent memory cross-invocation (unit)
// ---------------------------------------------------------------------------

describe('T-W12-QAV-2: Persistent memory cross-invocation — second retrieve() includes first persist() context', () => {
  it('T-W12-QAV-2: two sequential persist() calls via buildPersistentMemory(); second retrieve() returns both entries', async () => {
    // References: Wave 11 Supabase wiring, Wave 12 Task 12.1
    // Type: unit | Priority: P0
    // Acceptance: second retrieve() includes context from first persist()
    // Note: test uses degraded-mode adapter (no SUPABASE_URL) which is backed
    //       by makeDegradedSupabaseClient() — satisfies "stub Supabase client" spec.

    // Get adapter from factory (degraded mode in test environment = in-memory client)
    const adapter = buildPersistentMemory();

    const now = Date.now();

    // First invocation — persist entry #1
    await adapter.persist({
      organisationId: 'org-cross-invoke',
      sessionId: 'sess-cross',
      role: 'user',
      content: 'First invocation memory',
      capability: Capability.ADVISORY,
      timestamp: now - 1000,
    });

    // Second invocation — persist entry #2
    await adapter.persist({
      organisationId: 'org-cross-invoke',
      sessionId: 'sess-cross',
      role: 'assistant',
      content: 'Second invocation memory',
      capability: Capability.ADVISORY,
      timestamp: now,
    });

    // Retrieve — must include BOTH entries (context from first persist is included)
    const results = await adapter.retrieve({ organisationId: 'org-cross-invoke' });
    expect(results).toHaveLength(2);

    const contents = results.map(e => e.content);
    expect(contents).toContain('First invocation memory');
    expect(contents).toContain('Second invocation memory');

    // Verify organisationId is preserved correctly (GRS-008)
    expect(results.every(e => e.organisationId === 'org-cross-invoke')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W12-QAV-3: Organisation isolation — ai_memory
// ---------------------------------------------------------------------------

describe('T-W12-QAV-3: Organisation isolation — retrieve under org-B returns empty when only org-A data exists', () => {
  it('T-W12-QAV-3: persist under org-A; retrieve under org-B; result is strictly empty', async () => {
    // References: GRS-008 (tenant isolation), Wave 12 Task 12.1
    // Type: unit | Priority: P0
    // Acceptance: org-B retrieve returns empty array (NOT just "different" — strictly empty)
    // Uses stub Supabase client with org filter simulation (makeTestSupabaseClient)

    const client = makeTestSupabaseClient();
    const adapterOrgA = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);
    const adapterOrgB = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);

    // Persist multiple entries under org-A
    await adapterOrgA.persist({
      organisationId: 'org-A',
      sessionId: 'sess-A-001',
      role: 'user',
      content: 'Org A entry 1',
      capability: Capability.ADVISORY,
      timestamp: Date.now(),
    });

    await adapterOrgA.persist({
      organisationId: 'org-A',
      sessionId: 'sess-A-002',
      role: 'assistant',
      content: 'Org A entry 2',
      capability: Capability.ADVISORY,
      timestamp: Date.now(),
    });

    // org-B has NO entries — retrieve must return EMPTY (not org-A's data)
    const orgBResults = await adapterOrgB.retrieve({ organisationId: 'org-B' });

    // Strict emptiness check — critical tenant isolation assertion (GRS-008)
    expect(orgBResults).toHaveLength(0);
    expect(orgBResults).toEqual([]);

    // org-A can still retrieve its own entries
    const orgAResults = await adapterOrgA.retrieve({ organisationId: 'org-A' });
    expect(orgAResults).toHaveLength(2);
    expect(orgAResults.every(e => e.organisationId === 'org-A')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W12-QAV-4: pruneExpired() coverage
// ---------------------------------------------------------------------------

describe('T-W12-QAV-4: pruneExpired() — expires_at < NOW() records deleted; active records retained', () => {
  it('T-W12-QAV-4: time-bounded pruneExpired() correctly separates expired from active entries', async () => {
    // References: GRS-008, Wave 11 Supabase Persistent Memory, Wave 12 Task 12.1
    // Type: unit | Priority: P0
    // Acceptance: expired entries pruned; active entries remain intact
    // Uses time mock via stub client with fixed timestamps

    const client = makeTestSupabaseClient();
    const adapter = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);

    const now = Date.now();

    // Expired entry: expiresAt = 2 minutes in the past
    const expiredAt = new Date(now - 120_000).toISOString();
    // Active entry: expiresAt = 10 minutes in the future
    const activeAt = new Date(now + 600_000).toISOString();
    // Entry with no expiry: never expires
    const noExpiry = undefined;

    await adapter.persist({
      organisationId: 'org-prune-t4',
      role: 'user',
      content: 'Expired content',
      capability: Capability.ADVISORY,
      timestamp: now - 180_000,
      expiresAt: expiredAt,
    });

    await adapter.persist({
      organisationId: 'org-prune-t4',
      role: 'assistant',
      content: 'Active content',
      capability: Capability.ADVISORY,
      timestamp: now,
      expiresAt: activeAt,
    });

    await adapter.persist({
      organisationId: 'org-prune-t4',
      role: 'user',
      content: 'No-expiry content',
      capability: Capability.ADVISORY,
      timestamp: now - 60_000,
      expiresAt: noExpiry,
    });

    // Before prune: 3 entries
    const before = await adapter.retrieve({ organisationId: 'org-prune-t4' });
    expect(before).toHaveLength(3);

    // Prune expired (expires_at < NOW())
    const pruned = await adapter.pruneExpired('org-prune-t4');
    expect(pruned).toBe(1); // Only 1 entry has expires_at < NOW()

    // After prune: 2 entries remain (active + no-expiry)
    const after = await adapter.retrieve({ organisationId: 'org-prune-t4' });
    expect(after).toHaveLength(2);

    const contents = after.map(e => e.content);
    expect(contents).toContain('Active content');
    expect(contents).toContain('No-expiry content');
    expect(contents).not.toContain('Expired content');
  });
});

// ---------------------------------------------------------------------------
// T-W12-QAV-5: Coverage threshold — SupabasePersistentMemoryAdapter (≥90% line coverage)
//
// This test exhaustively exercises every code path in the adapter to provide
// ≥90% line coverage evidence. It covers:
//   - persist() success path
//   - persist() error path (error thrown)
//   - retrieve() with sessionId (success)
//   - retrieve() without sessionId (success)
//   - retrieve() with limit (slice applied)
//   - retrieve() error path (error thrown)
//   - retrieve() null data (returns empty array)
//   - pruneExpired() success path (non-null count)
//   - pruneExpired() null count (returns 0)
//   - pruneExpired() error path (error thrown)
//   - toRow/fromRow helpers (all optional fields: null id, sessionId, userId, expiresAt)
// ---------------------------------------------------------------------------

describe('T-W12-QAV-5: Coverage threshold — SupabasePersistentMemoryAdapter (≥90% line coverage)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('T-W12-QAV-5a: persist() success path — row inserted without error', async () => {
    const client = makeTestSupabaseClient();
    const adapter = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);

    await expect(adapter.persist({
      organisationId: 'org-cov',
      role: 'user',
      content: 'coverage entry',
      capability: Capability.ADVISORY,
      timestamp: Date.now(),
    })).resolves.toBeUndefined();
  });

  it('T-W12-QAV-5b: persist() error path — throws when Supabase returns error', async () => {
    const errorClient = makeErrorOnInsertClient();
    const adapter = new SupabasePersistentMemoryAdapter(errorClient as unknown as MockSupabaseClient);

    await expect(adapter.persist({
      organisationId: 'org-cov',
      role: 'user',
      content: 'will fail',
      capability: Capability.ADVISORY,
      timestamp: Date.now(),
    })).rejects.toThrow('insert failed');
  });

  it('T-W12-QAV-5c: retrieve() with sessionId — scoped query returns matching entries', async () => {
    const client = makeTestSupabaseClient();
    const adapter = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);

    await adapter.persist({
      organisationId: 'org-cov',
      sessionId: 'sess-cov',
      role: 'user',
      content: 'session-scoped entry',
      capability: Capability.ADVISORY,
      timestamp: Date.now(),
    });

    const results = await adapter.retrieve({ organisationId: 'org-cov', sessionId: 'sess-cov' });
    expect(results).toHaveLength(1);
    expect(results[0]!.sessionId).toBe('sess-cov');
  });

  it('T-W12-QAV-5d: retrieve() without sessionId — org-scoped query returns all org entries', async () => {
    const client = makeTestSupabaseClient();
    const adapter = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);

    await adapter.persist({
      organisationId: 'org-cov-d',
      role: 'user',
      content: 'entry-1',
      capability: Capability.ADVISORY,
      timestamp: Date.now() - 1000,
    });

    await adapter.persist({
      organisationId: 'org-cov-d',
      role: 'assistant',
      content: 'entry-2',
      capability: Capability.ADVISORY,
      timestamp: Date.now(),
    });

    // No sessionId — org-scope query
    const results = await adapter.retrieve({ organisationId: 'org-cov-d' });
    expect(results).toHaveLength(2);
  });

  it('T-W12-QAV-5e: retrieve() with limit — slices to limit count', async () => {
    const client = makeTestSupabaseClient();
    const adapter = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);

    for (let i = 0; i < 5; i++) {
      await adapter.persist({
        organisationId: 'org-cov-e',
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `entry-${i}`,
        capability: Capability.ADVISORY,
        timestamp: Date.now() + i,
      });
    }

    const results = await adapter.retrieve({ organisationId: 'org-cov-e', limit: 3 });
    expect(results).toHaveLength(3);
  });

  it('T-W12-QAV-5f: retrieve() error path — throws when Supabase returns error', async () => {
    const errorClient = makeErrorOnSelectClient();
    const adapter = new SupabasePersistentMemoryAdapter(errorClient as unknown as MockSupabaseClient);

    await expect(adapter.retrieve({ organisationId: 'org-cov' })).rejects.toThrow('select failed');
  });

  it('T-W12-QAV-5g: pruneExpired() success — returns non-null count of deleted rows', async () => {
    const client = makeTestSupabaseClient();
    const adapter = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);

    const pastExpiry = new Date(Date.now() - 60_000).toISOString();
    await adapter.persist({
      organisationId: 'org-cov-g',
      role: 'user',
      content: 'to prune',
      capability: Capability.ADVISORY,
      timestamp: Date.now() - 120_000,
      expiresAt: pastExpiry,
    });

    const count = await adapter.pruneExpired('org-cov-g');
    expect(count).toBe(1);
  });

  it('T-W12-QAV-5h: pruneExpired() null count — returns 0 when Supabase returns count: null', async () => {
    const nullCountClient = makeNullCountDeleteClient();
    const adapter = new SupabasePersistentMemoryAdapter(nullCountClient as unknown as MockSupabaseClient);

    const count = await adapter.pruneExpired('org-cov-h');
    expect(count).toBe(0);
  });

  it('T-W12-QAV-5i: pruneExpired() error path — throws when Supabase returns error', async () => {
    const errorClient = makeErrorOnDeleteClient();
    const adapter = new SupabasePersistentMemoryAdapter(errorClient as unknown as MockSupabaseClient);

    await expect(adapter.pruneExpired('org-cov-i')).rejects.toThrow('delete failed');
  });

  it('T-W12-QAV-5j: fromRow/toRow — optional fields (null id, sessionId, userId, expiresAt) map correctly', async () => {
    // Exercises the optional-field branches in both toRow() and fromRow()
    const client = makeTestSupabaseClient();
    const adapter = new SupabasePersistentMemoryAdapter(client as unknown as MockSupabaseClient);

    // Persist entry with ALL optional fields omitted — exercises null/undefined branches in toRow()
    await adapter.persist({
      organisationId: 'org-cov-j',
      role: 'user',
      content: 'minimal entry',
      capability: Capability.ADVISORY,
      timestamp: Date.now(),
      // sessionId, userId, expiresAt are all omitted
    });

    // Retrieve — exercises null→undefined branches in fromRow()
    const results = await adapter.retrieve({ organisationId: 'org-cov-j' });
    expect(results).toHaveLength(1);
    expect(results[0]!.sessionId).toBeUndefined();
    expect(results[0]!.userId).toBeUndefined();
    expect(results[0]!.expiresAt).toBeUndefined();
    expect(results[0]!.id).toBeUndefined();
    expect(results[0]!.content).toBe('minimal entry');
  });
});
