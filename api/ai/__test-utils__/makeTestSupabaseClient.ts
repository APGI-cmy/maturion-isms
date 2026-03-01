/**
 * Shared test utility — minimal in-memory Supabase client stub.
 *
 * Used by:
 *   - request.test.ts  (T-075-SUP-* tests for SupabasePersistentMemoryAdapter)
 *
 * This is the test-only counterpart of the production `makeDegradedSupabaseClient()`
 * in request.ts. Both implement the same minimal interface consumed by
 * `SupabasePersistentMemoryAdapter`; this version is exported for direct use
 * in tests so the two implementations are not duplicated across test files.
 *
 * `makeTestSupabaseClient()` creates a fresh `rows[]` store per call so tests
 * cannot bleed state into each other.
 *
 * References: Wave 11 — Supabase Persistent Memory Wiring
 */

export function makeTestSupabaseClient() {
  const rows: Record<string, unknown>[] = [];
  return {
    rows, // exposed for test inspection
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
                data: rows.filter(r => r[col] === val && r[col2] === val2),
                error: null,
              }),
          }),
          order: (_col3: string, _opts?: unknown) =>
            Promise.resolve({
              data: rows.filter(r => r[col] === val),
              error: null,
            }),
        }),
      }),
      delete: () => ({
        eq: (col: string, val: unknown) => ({
          lt: (col2: string, val2: unknown) => {
            const toDelete = rows.filter(
              r =>
                r[col] === val &&
                r[col2] !== undefined &&
                (r[col2] as string) < (val2 as string),
            );
            toDelete.forEach(r => {
              const idx = rows.indexOf(r);
              if (idx !== -1) rows.splice(idx, 1);
            });
            return Promise.resolve({ count: toDelete.length, error: null });
          },
        }),
      }),
    }),
  };
}

/** Convenience type alias for the client shape returned by makeTestSupabaseClient(). */
export type TestSupabaseClient = ReturnType<typeof makeTestSupabaseClient>;
