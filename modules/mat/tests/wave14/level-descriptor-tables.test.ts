/**
 * Wave 14 — Level Descriptor Tables (T-W14-UX-012)
 *
 * Test ID : T-W14-UX-012
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-100 / TR-100
 *
 * Scenario: After AI criteria parsing, each criteria/MPS/domain has 5 descriptor rows
 * (one per maturity level). The criteria card shows the descriptor for the current
 * confirmed level. MPS and Domain cards show the descriptor for their aggregate level.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `criteria_level_descriptors` table does not exist in any migration.
 *   - `mps_level_descriptors` table does not exist in any migration.
 *   - `domain_level_descriptors` table does not exist in any migration.
 *   - Target migration `20260305000005_wave14_level_descriptors.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-012a: Target migration file exists
 *   T-W14-UX-012b: criteria_level_descriptors table is created in migration
 *   T-W14-UX-012c: mps_level_descriptors table is created in migration
 *   T-W14-UX-012d: domain_level_descriptors table is created in migration
 *   T-W14-UX-012e: descriptor_text NOT NULL constraint is enforced in migration
 *   T-W14-UX-012f: UNIQUE constraint on (criteria_id, level) for criteria_level_descriptors
 *
 * References:
 *   FR-100, TR-100
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W12
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Target Wave 14 level descriptors migration.
 * Created by schema-builder AFTER these RED gate tests are submitted.
 */
const TARGET_MIGRATION_FILE = '20260305000005_wave14_level_descriptors.sql';
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

describe('T-W14-UX-012 — Level descriptors exist on criteria, MPS, and domain cards (GAP-W12)', () => {

  it('T-W14-UX-012a: Wave 14 level descriptors migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-012b: criteria_level_descriptors table is created in migration', () => {
    // criteria_level_descriptors stores 5 rows per criteria (one per maturity level)
    // describing what achieving that level means for this specific criteria.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.criteria_level_descriptors (FR-100 — criteria-level descriptor storage)'
    ).toMatch(/CREATE TABLE.*public\.criteria_level_descriptors/i);
  });

  it('T-W14-UX-012c: mps_level_descriptors table is created in migration', () => {
    // mps_level_descriptors stores maturity level descriptors for each MPS,
    // displayed on the MPS card when the aggregate level is computed.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.mps_level_descriptors (FR-100 — MPS-level descriptor storage)'
    ).toMatch(/CREATE TABLE.*public\.mps_level_descriptors/i);
  });

  it('T-W14-UX-012d: domain_level_descriptors table is created in migration', () => {
    // domain_level_descriptors stores maturity level descriptors for each domain,
    // displayed on the Domain card when the aggregate level is computed.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.domain_level_descriptors (FR-100 — domain-level descriptor storage)'
    ).toMatch(/CREATE TABLE.*public\.domain_level_descriptors/i);
  });

  it('T-W14-UX-012e: descriptor_text is NOT NULL (mandatory descriptor content constraint)', () => {
    // A descriptor row without text is semantically invalid. The NOT NULL constraint
    // prevents AI parsing from inserting incomplete descriptor rows.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'descriptor_text must be NOT NULL in the level descriptor tables (TR-100 — descriptor content required)'
    ).toMatch(/descriptor_text.*NOT\s+NULL|NOT\s+NULL.*descriptor_text/i);
  });

  it('T-W14-UX-012f: UNIQUE constraint on (criteria_id, level) prevents duplicate descriptors per level', () => {
    // Each criteria may have exactly one descriptor per maturity level (1–5).
    // A UNIQUE constraint on (criteria_id, level) enforces this invariant.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'criteria_level_descriptors must have a UNIQUE constraint on (criteria_id, level) (TR-100 — one descriptor per level)'
    ).toMatch(/UNIQUE.*criteria_id.*level|UNIQUE.*level.*criteria_id|criteria_id.*level.*UNIQUE/i);
  });

});
