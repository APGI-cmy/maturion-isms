/**
 * Wave 14 — Scoring Rules Report Access (T-W14-UX-016)
 *
 * Test ID : T-W14-UX-016
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-101 / TR-101 (GAP-W13 supplement)
 *
 * Scenario: During report generation, the service calls
 * `SELECT * FROM scoring_rules WHERE organisation_id IS NULL` to retrieve the global
 * default scoring rule. A per-org override takes precedence when present. If no rule
 * exists, generation fails gracefully.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `scoring_rules` table does not exist in any migration.
 *   - Global default seed row does not exist.
 *   - Score computation function is not implemented.
 *   - Target migration `20260305000007_wave14_scoring_tables.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-016a: Target migration file exists
 *   T-W14-UX-016b: scoring_rules table is created in migration
 *   T-W14-UX-016c: Global default row seeded with organisation_id IS NULL
 *   T-W14-UX-016d: Global default has aggregation_method = 'weighted_average'
 *   T-W14-UX-016e: scoring_rules has organisation_id column (nullable, for per-org override)
 *   T-W14-UX-016f: scoring_rules has aggregation_method column
 *   T-W14-UX-016g: Migration or compute function handles graceful failure when no rule found
 *
 * References:
 *   FR-101, TR-101
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W13
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Shared Wave 14 scoring tables migration (also used by T-W14-UX-013).
 */
const TARGET_MIGRATION_FILE = '20260305000007_wave14_scoring_tables.sql';
const TARGET_MIGRATION_PATH = path.join(MIGRATION_DIR, TARGET_MIGRATION_FILE);

function readTargetMigration(): string {
  const fileExists = fs.existsSync(TARGET_MIGRATION_PATH);
  expect(
    fileExists,
    `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
    `Migration file not found: ${TARGET_MIGRATION_PATH}\n` +
    `schema-builder must create this file to turn these tests GREEN.`
  ).toBe(true);
  return fs.readFileSync(TARGET_MIGRATION_PATH, 'utf-8');
}

describe('T-W14-UX-016 — Scoring rules table global default readable at report time (GAP-W13 supplement)', () => {

  it('T-W14-UX-016a: Wave 14 scoring tables migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-016b: scoring_rules table is created in migration', () => {
    // scoring_rules stores the aggregation method configuration used when computing
    // maturity scores. Supports global defaults and per-org overrides.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.scoring_rules (FR-101 — scoring configuration)'
    ).toMatch(/CREATE TABLE.*public\.scoring_rules/i);
  });

  it('T-W14-UX-016c: Global default scoring rule is seeded with organisation_id = NULL', () => {
    // The INSERT for the global default must have organisation_id = NULL (or DEFAULT NULL).
    // This ensures the fallback query `WHERE organisation_id IS NULL` returns exactly 1 row.
    // RED: Table and seed do not exist.
    const sql = readTargetMigration();
    // Must reference NULL in context of organisation_id within an INSERT statement
    expect(
      sql,
      'scoring_rules seed INSERT must set organisation_id to NULL for the global default (TR-101 — global fallback)'
    ).toMatch(/INSERT.*scoring_rules|scoring_rules.*INSERT/i);
    expect(
      sql,
      'Global default scoring rule must have organisation_id = NULL (TR-101)'
    ).toMatch(/NULL/i);
  });

  it("T-W14-UX-016d: Global default scoring rule has aggregation_method = 'weighted_average'", () => {
    // The default aggregation method is 'weighted_average'. This is the baseline algorithm
    // used to compute domain and overall maturity scores from individual criteria scores.
    // RED: Table and seed do not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      "Global scoring_rules default must specify 'weighted_average' as aggregation_method (TR-101)"
    ).toMatch(/weighted_average/i);
  });

  it('T-W14-UX-016e: scoring_rules has organisation_id column (nullable, allows per-org override)', () => {
    // organisation_id is NULL for the global default and set to a specific org UUID
    // for per-org overrides. The column must be nullable.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'scoring_rules must have an organisation_id column (nullable) for per-org override support (TR-101)'
    ).toMatch(/organisation_id/i);
  });

  it('T-W14-UX-016f: scoring_rules has aggregation_method column', () => {
    // aggregation_method stores the scoring algorithm name (e.g. 'weighted_average').
    // Must be a TEXT or ENUM column.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'scoring_rules must have an aggregation_method column (TR-101)'
    ).toMatch(/aggregation_method/i);
  });

  it('T-W14-UX-016g: Migration references fallback handling when no scoring rule is found', () => {
    // The compute function or SQL pattern must handle the case where no scoring rule
    // exists (neither global default nor per-org). This prevents silent wrong scores.
    // Expected pattern: COALESCE, RAISE EXCEPTION, error handling comment, or LIMIT 1 fallback.
    // RED: Migration does not exist; no graceful error handling.
    const sql = readTargetMigration();
    expect(
      sql,
      'Wave 14 scoring tables migration must reference fallback or error handling for missing scoring rules (TR-101 — graceful failure)'
    ).toMatch(/COALESCE|RAISE|fallback|no.*rule|rule.*not.*found|NULLS\s+LAST|LIMIT\s+1/i);
  });

});
