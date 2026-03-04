/**
 * Wave 14 — Evidence Upload Panel (T-W14-UX-005)
 *
 * Test ID : T-W14-UX-005
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-093 / TR-093
 *
 * Scenario: A user uploads one of each of the 6 evidence types (text findings,
 * file, voice note, photo, video, transcript). All items are stored correctly.
 * Remove and Replace controls function. Findings text auto-saves.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `evidence` table exists but is missing required Wave 14 columns:
 *     `findings_text TEXT`, `deleted BOOLEAN` (existing schema uses `deleted_at TIMESTAMPTZ`),
 *     and `storage_path TEXT` (existing schema uses `file_path`).
 *   - Evidence type enum does not include 'file' and 'voice' values
 *     (current: 'text','photo','audio','video','document','interview').
 *   - Target migration `20260305000003_wave14_evidence_schema.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-005a: Target migration file exists
 *   T-W14-UX-005b: evidence.findings_text column is added in migration
 *   T-W14-UX-005c: evidence.deleted BOOLEAN column is added in migration
 *   T-W14-UX-005d: evidence.storage_path column is added in migration
 *   T-W14-UX-005e: evidence type constraint adds 'file' and 'voice' values
 *   T-W14-UX-005f: EvidenceUploadPanel component file exists in frontend src
 *
 * References:
 *   FR-093, TR-093
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W05
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');
const SRC_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src');

/**
 * Target Wave 14 evidence schema migration.
 * Created by schema-builder AFTER these RED gate tests are submitted.
 */
const TARGET_MIGRATION_FILE = '20260305000003_wave14_evidence_schema.sql';
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

describe('T-W14-UX-005 — Evidence upload panel supports all 6 types and stores files (GAP-W05)', () => {

  it('T-W14-UX-005a: Wave 14 evidence schema migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-005b: evidence.findings_text TEXT column is added in migration', () => {
    // findings_text stores the user-typed observations for a criteria.
    // Auto-save debounce writes this column. Not present in the existing schema.
    // RED: Current evidence migration does not define findings_text.
    const sql = readTargetMigration();
    expect(
      sql,
      'Wave 14 migration must ADD COLUMN findings_text (TEXT) to the evidence table (FR-093)'
    ).toMatch(/findings_text/i);
  });

  it('T-W14-UX-005c: evidence.deleted BOOLEAN column is added in migration (replaces deleted_at semantics)', () => {
    // The Wave 14 spec requires a boolean `deleted` column for soft-delete.
    // The existing schema uses `deleted_at TIMESTAMPTZ` which is a different semantics.
    // The migration must add `deleted BOOLEAN NOT NULL DEFAULT false`.
    // RED: Column does not exist in current evidence migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Wave 14 migration must ADD COLUMN deleted BOOLEAN to the evidence table (FR-093 — soft delete)'
    ).toMatch(/\bdeleted\b.*boolean|boolean.*\bdeleted\b/i);
  });

  it('T-W14-UX-005d: evidence.storage_path TEXT column is added in migration', () => {
    // storage_path stores the Supabase Storage object path for uploaded evidence files.
    // The existing schema uses file_path, but storage_path is needed for the Wave 14
    // storage bucket integration.
    // RED: Column does not exist in current evidence migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Wave 14 migration must ADD COLUMN storage_path (TEXT) to the evidence table (FR-093 — storage bucket path)'
    ).toMatch(/storage_path/i);
  });

  it("T-W14-UX-005e: evidence type CHECK constraint is updated to include 'file' and 'voice' values", () => {
    // The existing CHECK constraint allows: 'text','photo','audio','video','document','interview'.
    // Wave 14 requires 'file' (generic file upload) and 'voice' (voice note recording).
    // The migration must DROP the old constraint and ADD a new one with 'file' and 'voice'.
    // RED: New constraint does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      "Wave 14 evidence schema migration must include 'file' in the type CHECK constraint (FR-093)"
    ).toMatch(/'file'/i);
    expect(
      sql,
      "Wave 14 evidence schema migration must include 'voice' in the type CHECK constraint (FR-093)"
    ).toMatch(/'voice'/i);
  });

  it('T-W14-UX-005f: EvidenceUploadPanel component file exists in frontend src', () => {
    // The evidence upload panel with Remove/Replace tiles and voice note recording
    // must be implemented as a dedicated component (not embedded in EvidenceCapture).
    // RED: Component file does not exist.
    const componentPath = path.join(SRC_DIR, 'components', 'evidence', 'EvidenceUploadPanel.tsx');
    const fileExists = fs.existsSync(componentPath);
    expect(
      fileExists,
      `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
      `EvidenceUploadPanel.tsx not found: ${componentPath}\n` +
      `ui-builder must create this component to turn this test GREEN. (FR-093 — evidence tile panel)`
    ).toBe(true);
  });

});
