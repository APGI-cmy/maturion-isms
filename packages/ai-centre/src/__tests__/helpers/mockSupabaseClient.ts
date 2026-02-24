/**
 * Test helper — createMockSupabaseClient
 *
 * Creates a minimal mock of the Supabase JS client backed by an in-memory
 * array. Supports the fluent builder pattern used by PersistentMemoryAdapter:
 * from / select / insert / delete / eq / lt / not / limit.
 *
 * Use this in unit tests to exercise PersistentMemoryAdapter without a live
 * Supabase instance.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

interface Row extends Record<string, unknown> {
  id: string;
}

type FilterFn = (row: Row) => boolean;

/**
 * Returns a mock SupabaseClient whose `from()` operations run against a
 * shared in-memory store that is private to the returned client instance.
 */
export function createMockSupabaseClient(): SupabaseClient {
  const store: Row[] = [];
  let idCounter = 0;

  /** Build a thenable query builder for SELECT or DELETE operations. */
  function makeBuilder(mode: 'select' | 'delete') {
    const filters: FilterFn[] = [];
    let limitVal: number | undefined;
    let returnDeleted = false;

    const self = {
      select(_cols?: string) {
        if (mode === 'delete') {
          returnDeleted = true;
        }
        return self;
      },
      eq(col: string, val: unknown) {
        filters.push((r) => r[col] === val);
        return self;
      },
      lt(col: string, val: unknown) {
        filters.push((r) => {
          const v = r[col];
          return v !== null && v !== undefined && String(v) < String(val);
        });
        return self;
      },
      not(col: string, op: string, _val: unknown) {
        if (op === 'is') {
          filters.push((r) => r[col] !== null && r[col] !== undefined);
        }
        return self;
      },
      limit(n: number) {
        limitVal = n;
        return self;
      },
      then(
        onfulfilled: (result: { data: Row[] | null; error: null }) => unknown,
        _onrejected?: unknown,
      ) {
        const matched = store.filter((r) => filters.every((f) => f(r)));

        if (mode === 'delete') {
          const ids = new Set(matched.map((r) => r.id));
          for (let i = store.length - 1; i >= 0; i--) {
            if (ids.has(store[i]!.id)) store.splice(i, 1);
          }
          return Promise.resolve(
            onfulfilled({ data: returnDeleted ? matched : null, error: null }),
          );
        }

        // SELECT
        let result = matched.slice();
        if (limitVal !== undefined) result = result.slice(0, limitVal);
        return Promise.resolve(onfulfilled({ data: result, error: null }));
      },
    };

    return self;
  }

  const client = {
    from(_table: string) {
      return {
        select(cols?: string) {
          const b = makeBuilder('select');
          // The initial `.select()` call marks the mode; return builder
          void cols;
          return b;
        },
        insert(rows: Record<string, unknown> | Record<string, unknown>[]) {
          const toInsert = Array.isArray(rows) ? rows : [rows];
          for (const row of toInsert) {
            store.push({ id: `mid-${++idCounter}`, ...row });
          }
          return Promise.resolve({ data: null, error: null });
        },
        delete() {
          return makeBuilder('delete');
        },
      };
    },
  };

  return client as unknown as SupabaseClient;
}
