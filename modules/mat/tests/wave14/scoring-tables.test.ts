/**
 * Wave 14 — Scoring Tables (T-W14-UX-013)
 *
 * Test ID : T-W14-UX-013
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-101 / TR-101
 *
 * Scenario: The `maturity_levels`, `scoring_rules`, and `aggregate_scores` tables
 * exist with correct schemas. A global default scoring rule is seeded. The frontend
 * can query `maturity_levels` without hardcoding numeric values.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `maturity_levels` table does not exist in any migration.
 *   - `scoring_rules` table does not exist in any migration.
 *   - `aggregate_scores` table does not exist in any migration.
 *   - No seed data migration exists for the 5 maturity levels.
 *   - Target migration `20260305000007_wave14_scoring_tables.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-013a: Target migration file exists
 *   T-W14-UX-013b: maturity_levels table is created in migration
 *   T-W14-UX-013c: All 5 maturity level names are seeded (Basic, Reactive, Compliant, Proactive, Resilient)
 *   T-W14-UX-013d: scoring_rules table is created in migration
 *   T-W14-UX-013e: Global default scoring_rules row seeded (organisation_id IS NULL, aggregation_method = 'weighted_average')
 *   T-W14-UX-013f: aggregate_scores table is created in migration
 *   T-W14-UX-013g: aggregate_scores has UPSERT-compatible UNIQUE constraint on (audit_id, level_type, scope_id)
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
 * Target Wave 14 scoring tables migration.
 * Created by schema-builder AFTER these RED gate tests are submitted.
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

describe('T-W14-UX-013 — Scoring tables exist and default rule is seeded (GAP-W13)', () => {

  it('T-W14-UX-013a: Wave 14 scoring tables migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-013b: maturity_levels table is created in migration', () => {
    // maturity_levels is a reference table mapping level names to numeric values (1–5).
    // The frontend queries this table to avoid hardcoding level numeric values.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.maturity_levels (FR-101 — maturity level reference table)'
    ).toMatch(/CREATE TABLE.*public\.maturity_levels/i);
  });

  it('T-W14-UX-013c: All 5 maturity level names are seeded in migration (Basic, Reactive, Compliant, Proactive, Resilient)', () => {
    // The maturity_levels table must be pre-populated with exactly 5 rows.
    // Names are: Basic (1), Reactive (2), Compliant (3), Proactive (4), Resilient (5).
    // RED: Table does not exist; no seed data exists.
    const sql = readTargetMigration();
    expect(sql, "maturity_levels seed must include 'Basic' level (TR-101)").toMatch(/Basic/i);
    expect(sql, "maturity_levels seed must include 'Reactive' level (TR-101)").toMatch(/Reactive/i);
    expect(sql, "maturity_levels seed must include 'Compliant' level (TR-101)").toMatch(/Compliant/i);
    expect(sql, "maturity_levels seed must include 'Proactive' level (TR-101)").toMatch(/Proactive/i);
    expect(sql, "maturity_levels seed must include 'Resilient' level (TR-101)").toMatch(/Resilient/i);
  });

  it('T-W14-UX-013d: scoring_rules table is created in migration', () => {
    // scoring_rules stores the aggregation configuration (e.g. weighted_average).
    // Supports a global default (organisation_id IS NULL) and per-org overrides.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.scoring_rules (FR-101 — scoring configuration table)'
    ).toMatch(/CREATE TABLE.*public\.scoring_rules/i);
  });

  it("T-W14-UX-013e: Global default scoring_rules row is seeded with aggregation_method = 'weighted_average'", () => {
    // The global default row has organisation_id = NULL (applies to all orgs that have
    // no specific override). aggregation_method must be 'weighted_average'.
    // RED: Table and seed do not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      "scoring_rules seed must include 'weighted_average' aggregation method (TR-101 — global default)"
    ).toMatch(/weighted_average/i);
  });

  it('T-W14-UX-013f: aggregate_scores table is created in migration', () => {
    // aggregate_scores stores the computed maturity score per audit, per scope
    // (criteria, MPS, domain, or overall). Updated by the scoring compute function.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.aggregate_scores (FR-101 — computed score storage)'
    ).toMatch(/CREATE TABLE.*public\.aggregate_scores/i);
  });

  it('T-W14-UX-013g: aggregate_scores has UNIQUE constraint on (audit_id, level_type, scope_id) for UPSERT', () => {
    // UPSERT support requires a UNIQUE constraint on (audit_id, level_type, scope_id).
    // Without this, ON CONFLICT is impossible and the compute function must DELETE+INSERT.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'aggregate_scores must have a UNIQUE or PRIMARY constraint on (audit_id, level_type, scope_id) for UPSERT (TR-101)'
    ).toMatch(/UNIQUE.*audit_id.*level_type|UNIQUE.*scope_id|audit_id.*level_type.*scope_id/i);
  });

});
