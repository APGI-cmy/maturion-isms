/**
 * Wave audit-field-sync — Column Drift Guard & Implementation Gate Tests
 * TASK-AFS-001 | Session: session-099
 * FAIL-ONLY-ONCE Rules: A-027 (COLUMN-LEVEL-DRIFT-QA-TO-RED), A-016 (PHASE-4-BEFORE-REPORT-PROGRESS)
 *
 * All tests are file-based (no live Supabase connection required).
 *
 * DUAL-ROLE DESIGN — read before modifying:
 * ─────────────────────────────────────────
 * Tests T-AFS-COL-001 through T-AFS-COL-004 are MIGRATION DRIFT GUARDS.
 * They assert that the FINAL NET SCHEMA STATE of public.audits contains the required
 * columns, computed by simulating all migrations in chronological order. This means:
 *   - ADD COLUMN adds a column to the net state
 *   - DROP COLUMN removes it from the net state
 *   - RENAME COLUMN updates the name in the net state
 * A future migration that drops or renames a column will immediately make these tests RED,
 * even though the old ADD COLUMN SQL still exists in earlier migration files.
 *
 * This is a stronger guarantee than checking raw text presence (allMigrationSql()): raw text
 * checks pass even when a later migration reverts the column, giving false confidence.
 *
 * Test T-AFS-COL-005 is the PRIMARY QA-TO-RED IMPLEMENTATION GATE for this wave.
 * It asserts that useAudits.ts does NOT contain the incorrect workaround
 * `description: input.organisation_name`. On the current branch this test is RED (FAIL)
 * because the workaround is still present (~line 110 of useAudits.ts).
 * TASK-AFS-002 (ui-builder) must fix the hook to make this test GREEN.
 *
 * Expected results after TASK-AFS-002 fix:
 *   T-AFS-COL-001: PASS ✅ (net-schema guard — organisation_name in final schema state)
 *   T-AFS-COL-002: PASS ✅ (net-schema guard — facility_location in final schema state)
 *   T-AFS-COL-003: PASS ✅ (net-schema guard — audit_period_start in final schema state)
 *   T-AFS-COL-004: PASS ✅ (net-schema guard — audit_period_end in final schema state)
 *   T-AFS-COL-005: PASS ✅ (implementation gate — description workaround removed)
 *
 * Authority: IAA Pre-Brief .agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md
 * IAA Trigger Category: AAWP_MAT
 */
import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(
  process.cwd(),
  'apps/maturion-maturity-legacy/supabase/migrations'
);

const USE_AUDITS_HOOK = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/lib/hooks/useAudits.ts'
);

interface NetSchemaResult {
  /** Column names present in the final schema state of public.audits */
  columns: Set<string>;
  /** Maps column name → migration filename that last added/renamed-into the column */
  addedBy: Map<string, string>;
  /** Maps column name → migration filename that dropped/renamed-away the column */
  droppedBy: Map<string, string>;
}

/**
 * Simulate all migrations for public.audits in chronological order and return
 * the FINAL NET SCHEMA STATE — i.e., the set of columns that would exist after
 * applying every migration from first to last.
 *
 * Handles: ADD COLUMN [IF NOT EXISTS], DROP COLUMN [IF EXISTS], RENAME COLUMN.
 * Migration files are sorted lexicographically (YYYYMMDDNNNNNN prefix = chronological).
 *
 * Why this is better than allMigrationSql() + regex:
 *   A simple regex over all migration text passes even when a later migration
 *   `DROP COLUMN`s the column, because the old migration file still contains
 *   the ADD COLUMN statement. Net-schema simulation catches that regression.
 */
function computeAuditsNetSchema(): NetSchemaResult {
  const files = fs
    .readdirSync(MIGRATION_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // lexicographic sort = chronological order for YYYYMMDDNNNNNN_ prefix

  const columns = new Set<string>();
  const addedBy = new Map<string, string>();
  const droppedBy = new Map<string, string>();

  for (const file of files) {
    // Preserve original SQL text (for debug diagnostics); use /i flag on regexes for case-insensitive matching
    const sql = fs.readFileSync(path.join(MIGRATION_DIR, file), 'utf-8');

    // ADD COLUMN [IF NOT EXISTS] <col>  on  public.audits  (or unqualified audits)
    const addRe =
      /alter\s+table\s+(?:public\.)?audits\s+add\s+column\s+(?:if\s+not\s+exists\s+)?(\w+)/gi;
    let m: RegExpExecArray | null;
    while ((m = addRe.exec(sql)) !== null) {
      const col = m[1].toLowerCase(); // normalise to lowercase — PostgreSQL identifiers are case-insensitive
      columns.add(col);
      addedBy.set(col, file);
      droppedBy.delete(col);
    }

    // DROP COLUMN [IF EXISTS] <col>  on  public.audits
    const dropRe =
      /alter\s+table\s+(?:public\.)?audits\s+drop\s+column\s+(?:if\s+exists\s+)?(\w+)/gi;
    while ((m = dropRe.exec(sql)) !== null) {
      const col = m[1].toLowerCase();
      if (columns.has(col)) {
        columns.delete(col);
        droppedBy.set(col, file);
      }
    }

    // RENAME COLUMN <old> TO <new>  on  public.audits
    const renameRe =
      /alter\s+table\s+(?:public\.)?audits\s+rename\s+column\s+(\w+)\s+to\s+(\w+)/gi;
    while ((m = renameRe.exec(sql)) !== null) {
      const oldCol = m[1].toLowerCase();
      const newCol = m[2].toLowerCase();
      if (columns.has(oldCol)) {
        columns.delete(oldCol);
        droppedBy.set(oldCol, `${file} (renamed to ${newCol})`);
        columns.add(newCol);
        addedBy.set(newCol, `${file} (renamed from ${oldCol})`);
      }
    }
  }

  return { columns, addedBy, droppedBy };
}

describe('Wave audit-field-sync — Column Drift Guard & Implementation Gate (TASK-AFS-001)', () => {
  let netSchema: NetSchemaResult;

  beforeAll(() => {
    try {
      netSchema = computeAuditsNetSchema();
    } catch (err) {
      throw new Error(
        `computeAuditsNetSchema() failed — check that the migration directory exists and is readable.\n` +
          `Expected path: ${MIGRATION_DIR}\n` +
          `Original error: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  });

  it('T-AFS-COL-001: organisation_name must be present in final net schema state of public.audits', () => {
    const col = 'organisation_name';
    const dropInfo = netSchema.droppedBy.get(col);
    expect(
      netSchema.columns.has(col),
      dropInfo
        ? `audits.${col} was dropped/renamed by migration: ${dropInfo}. ` +
          `A later migration removed a column that is required by the frontend.`
        : `audits.${col} was never added by any migration. ` +
          `Expected an ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS ${col} statement.`
    ).toBe(true);
  });

  it('T-AFS-COL-002: facility_location must be present in final net schema state of public.audits', () => {
    const col = 'facility_location';
    const dropInfo = netSchema.droppedBy.get(col);
    expect(
      netSchema.columns.has(col),
      dropInfo
        ? `audits.${col} was dropped/renamed by migration: ${dropInfo}. ` +
          `A later migration removed a column that is required by the frontend.`
        : `audits.${col} was never added by any migration. ` +
          `Expected an ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS ${col} statement.`
    ).toBe(true);
  });

  it('T-AFS-COL-003: audit_period_start must be present in final net schema state of public.audits', () => {
    const col = 'audit_period_start';
    const dropInfo = netSchema.droppedBy.get(col);
    expect(
      netSchema.columns.has(col),
      dropInfo
        ? `audits.${col} was dropped/renamed by migration: ${dropInfo}. ` +
          `A later migration removed a column that is required by the frontend.`
        : `audits.${col} was never added by any migration. ` +
          `Expected an ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS ${col} statement.`
    ).toBe(true);
  });

  it('T-AFS-COL-004: audit_period_end must be present in final net schema state of public.audits', () => {
    const col = 'audit_period_end';
    const dropInfo = netSchema.droppedBy.get(col);
    expect(
      netSchema.columns.has(col),
      dropInfo
        ? `audits.${col} was dropped/renamed by migration: ${dropInfo}. ` +
          `A later migration removed a column that is required by the frontend.`
        : `audits.${col} was never added by any migration. ` +
          `Expected an ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS ${col} statement.`
    ).toBe(true);
  });

  it('T-AFS-COL-005: useAudits.ts must NOT contain description workaround for organisation_name (RED implementation gate)', () => {
    const source = fs.readFileSync(USE_AUDITS_HOOK, 'utf-8');
    expect(
      source,
      'useAudits.ts must not map organisation_name to description column — fix: use organisation_name: input.organisation_name'
    ).not.toContain('description: input.organisation_name');
  });
});
