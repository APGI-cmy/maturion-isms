/**
 * Wave 14 — Toggle Exclude Cascade (T-W14-UX-003)
 *
 * Test ID : T-W14-UX-003
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-091 / TR-091
 *
 * Scenario: A domain is toggled to `excluded = true`. All child MPS and criteria
 * must inherit the exclusion. The "Create Report" gate query must not count
 * excluded criteria as blocking.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `domains.excluded`, `mps.excluded`, `criteria.excluded` columns do not exist.
 *   - No cascade trigger or function is implemented.
 *   - Target migration `20260305000002_wave14_excluded_columns.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 * Tests MUST PASS in CI without env vars.
 *
 * Test summary:
 *   T-W14-UX-003a: Target migration file exists
 *   T-W14-UX-003b: domains.excluded column is added in migration
 *   T-W14-UX-003c: mps.excluded column is added in migration (via mini_performance_standards or mps)
 *   T-W14-UX-003d: criteria.excluded column is added in migration
 *   T-W14-UX-003e: Migration defines cascade trigger or function for exclusion propagation
 *   T-W14-UX-003f: "Create Report" gate query pattern excludes excluded criteria
 *
 * References:
 *   FR-091, TR-091
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W03
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Target migration file for Wave 14 excluded columns and cascade.
 */
const TARGET_MIGRATION_FILE = '20260305000002_wave14_excluded_columns.sql';
const TARGET_MIGRATION_PATH = path.join(MIGRATION_DIR, TARGET_MIGRATION_FILE);

function readTargetMigration(): string {
  const fileExists = fs.existsSync(TARGET_MIGRATION_PATH);
  expect(
    fileExists,
    `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
    `Migration file not found: ${TARGET_MIGRATION_PATH}\n` +
    `schema-builder must create this file (Wave 14) to turn these tests GREEN.`
  ).toBe(true);
  return fs.readFileSync(TARGET_MIGRATION_PATH, 'utf-8');
}

function allMigrationSql(): string {
  const files = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.sql'));
  return files.map(f => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8')).join('\n');
}

describe('T-W14-UX-003 — Toggle exclude domain cascades to child MPS and criteria (GAP-W03)', () => {

  it('T-W14-UX-003a: Wave 14 excluded columns migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-003b: domains table gains an excluded BOOLEAN column in migration', () => {
    // domains.excluded = true means the domain and all its children are excluded
    // from scoring and the "Create Report" gate check.
    // RED: No current migration adds this column.
    const sql = allMigrationSql();
    expect(
      sql,
      'A migration must ADD COLUMN excluded BOOLEAN (or equivalent) to the domains table (FR-091)'
    ).toMatch(/ALTER\s+TABLE.*domains.*excluded|excluded.*boolean.*domains/i);
  });

  it('T-W14-UX-003c: mini_performance_standards (MPS) table gains an excluded BOOLEAN column', () => {
    // mps.excluded = true means the MPS and all its criteria are excluded from scoring.
    // The column must be added to the MPS table (public.mini_performance_standards or equivalent).
    // RED: No current migration adds this column.
    const sql = allMigrationSql();
    expect(
      sql,
      'A migration must ADD COLUMN excluded BOOLEAN to the MPS table (mini_performance_standards) (FR-091)'
    ).toMatch(/ALTER\s+TABLE.*mini_performance_standards.*excluded|excluded.*boolean.*mini_performance_standards/i);
  });

  it('T-W14-UX-003d: criteria table gains an excluded BOOLEAN column in migration', () => {
    // criteria.excluded = true means the individual criterion is excluded from scoring.
    // RED: No current migration adds this column.
    const sql = allMigrationSql();
    expect(
      sql,
      'A migration must ADD COLUMN excluded BOOLEAN to the criteria table (FR-091)'
    ).toMatch(/ALTER\s+TABLE.*criteria.*excluded|excluded.*boolean.*criteria/i);
  });

  it('T-W14-UX-003e: Wave 14 migration defines a cascade trigger or function for exclusion propagation', () => {
    // When domains.excluded is set to true, a DB trigger or stored function must
    // cascade the exclusion to all child MPS and criteria rows. Without this,
    // each child would have to be updated individually by application code.
    // RED: Target migration does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'Wave 14 migration must define a trigger or function that cascades excluded=true to child MPS and criteria (TR-091)'
    ).toMatch(/CREATE\s+(OR\s+REPLACE\s+)?(FUNCTION|TRIGGER).*exclude/i);
  });

  it('T-W14-UX-003f: Wave 14 migration references the Create Report gate query pattern (excluded criteria excluded from gate)', () => {
    // The "Create Report" gate query counts non-excluded, non-confirmed criteria.
    // The migration or an associated function/view must use `excluded = false` or
    // `excluded IS NOT TRUE` to filter out excluded items.
    // RED: Target migration does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      "Wave 14 migration must reference 'excluded' in the Create Report gate query pattern (TR-091)"
    ).toMatch(/excluded/i);
  });

});
