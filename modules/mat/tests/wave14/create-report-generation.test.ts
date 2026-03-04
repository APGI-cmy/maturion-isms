/**
 * Wave 14 — Create Report Generation (T-W14-UX-011)
 *
 * Test ID : T-W14-UX-011
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-099 / TR-099
 *
 * Scenario: Lead Auditor clicks "Create Report". The AI generation endpoint is called,
 * a PDF is generated, stored in the `reports` bucket, and an `audit_reports` row is
 * created with a signed download URL returned to the frontend.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `audit_reports` table does not exist in any migration.
 *   - `generate-report` endpoint is not implemented.
 *   - `generate-pdf` Edge Function is not implemented.
 *   - `reports` storage bucket is not configured in migrations.
 *   - Target migration `20260305000006_wave14_audit_reports.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-011a: Target migration file exists
 *   T-W14-UX-011b: audit_reports table is created in migration
 *   T-W14-UX-011c: audit_reports has storage_path NOT NULL constraint
 *   T-W14-UX-011d: audit_reports has status column
 *   T-W14-UX-011e: reports storage bucket is defined in migration (storage.buckets)
 *   T-W14-UX-011f: RLS on audit_reports restricts SELECT to Lead Auditor of the audit's org
 *
 * References:
 *   FR-099, TR-099
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W11
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Target Wave 14 audit reports migration.
 * Created by schema-builder AFTER these RED gate tests are submitted.
 */
const TARGET_MIGRATION_FILE = '20260305000006_wave14_audit_reports.sql';
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

describe('T-W14-UX-011 — Create Report generates PDF and stores audit_reports row (GAP-W11)', () => {

  it('T-W14-UX-011a: Wave 14 audit reports migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-011b: audit_reports table is created in migration', () => {
    // audit_reports stores metadata for each generated audit report including the
    // storage path, status, and organisation scoping for RLS.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.audit_reports (FR-099 — report generation output storage)'
    ).toMatch(/CREATE TABLE.*public\.audit_reports/i);
  });

  it('T-W14-UX-011c: audit_reports.storage_path is NOT NULL (mandatory storage path constraint)', () => {
    // Every audit_reports row must point to a valid storage object.
    // A NOT NULL constraint at the DB level prevents rows with missing storage paths.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'audit_reports.storage_path must be NOT NULL (TR-099 — every report must have a storage path)'
    ).toMatch(/storage_path.*NOT\s+NULL|NOT\s+NULL.*storage_path/i);
  });

  it('T-W14-UX-011d: audit_reports has a status column (expected values include final, generating, failed)', () => {
    // status tracks the report lifecycle: 'generating' when the AI is working,
    // 'final' when the PDF is ready, 'failed' if generation errors out.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'audit_reports must have a status column (TR-099 — report lifecycle status)'
    ).toMatch(/\bstatus\b/i);
    expect(
      sql,
      "audit_reports.status must include 'final' as a valid value (TR-099)"
    ).toMatch(/final/i);
  });

  it('T-W14-UX-011e: reports storage bucket is configured in migration (storage.buckets INSERT)', () => {
    // The `reports` Supabase Storage bucket must be created in a migration so that
    // the PDF files can be stored at `reports/{organisation_id}/{audit_id}/`.
    // RED: No migration configures the reports bucket.
    const sql = readTargetMigration();
    expect(
      sql,
      "Wave 14 migration must INSERT or reference the 'reports' storage bucket (TR-099 — PDF storage)"
    ).toMatch(/reports/i);
    // Must reference storage bucket creation (INSERT INTO storage.buckets or similar)
    expect(
      sql,
      "Wave 14 migration must configure storage.buckets for the reports bucket (TR-099)"
    ).toMatch(/storage\.buckets|INSERT.*reports.*bucket|bucket.*reports/i);
  });

  it('T-W14-UX-011f: RLS on audit_reports enforces org isolation (SELECT policy defined)', () => {
    // Users from Org A must not be able to SELECT audit_reports rows belonging to Org B.
    // An org-isolation SELECT RLS policy must be defined in the migration.
    // RED: Table (and therefore policies) does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'audit_reports must have an org-isolation SELECT RLS policy (TR-099 — cross-org report access prevention)'
    ).toMatch(/POLICY.*audit_reports|audit_reports.*POLICY|audit_reports.*select.*policy|policy.*select.*audit_reports/i);
  });

});
