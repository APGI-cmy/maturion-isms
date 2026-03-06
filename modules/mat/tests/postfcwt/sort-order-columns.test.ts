/**
 * Post-FCWT RED Gate — sort_order Column Migration Tests
 * Incident: INC-POST-FCWT-SORT-ORDER-001
 *
 * RCA: useCriteriaTree() calls .order('sort_order') on domains, mini_performance_standards,
 *      and criteria tables, but no migration had ever added the sort_order column.
 *      Schema-to-hook drift — same class as INC-W14-COL-MAPPING-001.
 *
 * A-027 extension: .order('column_name') calls are column references and MUST be covered
 *      by column-level migration tests (not only .select() and .insert() calls).
 *
 * All tests are file-based (no live Supabase env required).
 * Tests T-PFCWT-001 to T-PFCWT-003 go GREEN once migration
 * 20260306000000_domains_sort_order.sql is applied.
 *
 * Authority: CS2 (Johan Ras / @APGI-cmy) | Date: 2026-03-06
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_FILE = path.resolve(
  process.cwd(),
  'apps/maturion-maturity-legacy/supabase/migrations/20260306000000_domains_sort_order.sql'
);

function migrationSql(): string {
  return fs.readFileSync(MIGRATION_FILE, 'utf-8');
}

describe('Post-FCWT — sort_order Column Migration Guard (INC-POST-FCWT-SORT-ORDER-001)', () => {

  it('T-PFCWT-001: migration file 20260306000000_domains_sort_order.sql exists and contains sort_order addition for domains', () => {
    expect(
      fs.existsSync(MIGRATION_FILE),
      'Migration file 20260306000000_domains_sort_order.sql must exist — create it with ADD COLUMN IF NOT EXISTS sort_order for domains, mini_performance_standards, and criteria'
    ).toBe(true);

    const sql = migrationSql();
    expect(
      sql,
      'Migration must add sort_order to public.domains — add: ALTER TABLE public.domains ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0'
    ).toMatch(/ALTER\s+TABLE\s+public\.domains[\s\S]*?sort_order/i);
  });

  it('T-PFCWT-002: migration contains sort_order addition for mini_performance_standards', () => {
    const sql = migrationSql();
    expect(
      sql,
      'Migration must add sort_order to public.mini_performance_standards — add: ALTER TABLE public.mini_performance_standards ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0'
    ).toMatch(/ALTER\s+TABLE\s+public\.mini_performance_standards[\s\S]*?sort_order/i);
  });

  it('T-PFCWT-003: migration contains sort_order addition for criteria', () => {
    const sql = migrationSql();
    expect(
      sql,
      'Migration must add sort_order to public.criteria — add: ALTER TABLE public.criteria ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0'
    ).toMatch(/ALTER\s+TABLE\s+public\.criteria[\s\S]*?sort_order/i);
  });

});
