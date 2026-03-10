/**
 * Wave 16.6 — Schema & Audit Completeness RED QA Suite
 *
 * QA-to-Red: ALL tests in this file MUST fail until Wave 16.6 implementation
 * is merged. This suite validates that the migration and schema artefacts exist
 * and contain the correct policy names, audit log action types, and table
 * definitions specified in the acceptance criteria.
 *
 * Gaps addressed:
 *   GAP-011 — scores INSERT/UPDATE RLS policies incomplete
 *   GAP-012 — audit_scores INSERT/UPDATE RLS policies incomplete
 *   GAP-016 — audit logging only covers criteria parsing (missing event types)
 *   GAP-019 — evidence_submissions table missing
 *
 * Acceptance Criteria (from implementation-plan.md Wave 16.6):
 *   AC-1: INSERT and UPDATE RLS policies on `scores` and `audit_scores` match
 *         the existing SELECT pattern (org-scoped, Lead Auditor role); audit_log
 *         entries for evidence_upload, score_confirmed, score_overridden,
 *         report_generated with organisation_id NOT NULL; evidence_submissions
 *         migration exists or all code references removed.
 *
 * Test IDs: T-W16.6-COL-001, T-W16.6-COL-002,
 *           T-W16.6-SCH-001 through T-W16.6-SCH-005
 *
 * Architecture: architecture/implementation-plan.md Wave 16.6
 * FRS: GAP-011, GAP-012, GAP-016, GAP-019
 * Session: qa-builder wave16.6 RED suite
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(process.cwd());

/**
 * The canonical Wave 16.6 migration file that MUST be created by the
 * schema-builder before these tests go GREEN.
 */
const WAVE_16_6_MIGRATION = path.join(
  REPO_ROOT,
  'apps/maturion-maturity-legacy/supabase/migrations',
  '20260310000001_wave16_6_schema_audit_completeness.sql',
);

/**
 * Return every SQL migration file under apps/maturion-maturity-legacy/supabase/migrations.
 * Used by COL tests that only need to know whether a policy name appears
 * *anywhere* in the migration history.
 */
function allMigrationFiles(): string[] {
  const migrationsDir = path.join(
    REPO_ROOT,
    'apps/maturion-maturity-legacy/supabase/migrations',
  );
  if (!fs.existsSync(migrationsDir)) return [];
  return fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .map((f) => path.join(migrationsDir, f));
}

/** Read the Wave 16.6 migration file content (empty string when absent). */
function migrationContent(): string {
  if (!fs.existsSync(WAVE_16_6_MIGRATION)) return '';
  return fs.readFileSync(WAVE_16_6_MIGRATION, 'utf-8');
}

// ---------------------------------------------------------------------------
// T-W16.6-COL-001 — scores INSERT/UPDATE RLS policy name (corpus scan)
// ---------------------------------------------------------------------------

describe('T-W16.6-COL-001: scores_insert_lead_auditor policy exists in migrations', () => {
  it('at least one migration SQL file contains the scores_insert_lead_auditor policy name', () => {
    // RED: No migration currently defines this policy.
    // GREEN: Wave 16.6 migration introduces scores_insert_lead_auditor.
    const files = allMigrationFiles();
    const found = files.some((f) =>
      fs.readFileSync(f, 'utf-8').includes('scores_insert_lead_auditor'),
    );
    expect(
      found,
      'Expected a migration file to contain "scores_insert_lead_auditor" RLS policy ' +
        '(GAP-011: scores INSERT RLS incomplete). ' +
        'Create 20260310000001_wave16_6_schema_audit_completeness.sql with this policy.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.6-COL-002 — audit_scores INSERT/UPDATE RLS policy name (corpus scan)
// ---------------------------------------------------------------------------

describe('T-W16.6-COL-002: audit_scores_insert_lead_auditor policy exists in migrations', () => {
  it('at least one migration SQL file contains the audit_scores_insert_lead_auditor policy name', () => {
    // RED: No migration currently defines this policy.
    // GREEN: Wave 16.6 migration introduces audit_scores_insert_lead_auditor.
    const files = allMigrationFiles();
    const found = files.some((f) =>
      fs.readFileSync(f, 'utf-8').includes('audit_scores_insert_lead_auditor'),
    );
    expect(
      found,
      'Expected a migration file to contain "audit_scores_insert_lead_auditor" RLS policy ' +
        '(GAP-012: audit_scores INSERT RLS incomplete). ' +
        'Create 20260310000001_wave16_6_schema_audit_completeness.sql with this policy.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.6-SCH-001 — canonical Wave 16.6 migration file exists
// ---------------------------------------------------------------------------

describe('T-W16.6-SCH-001: Wave 16.6 migration file exists and contains scores_insert_lead_auditor', () => {
  it('migration file 20260310000001_wave16_6_schema_audit_completeness.sql exists', () => {
    // RED: File does not exist yet.
    expect(
      fs.existsSync(WAVE_16_6_MIGRATION),
      `Expected migration file to exist at:\n  ${WAVE_16_6_MIGRATION}\n` +
        'Create this file as part of Wave 16.6 schema delivery.',
    ).toBe(true);
  });

  it('migration file contains scores_insert_lead_auditor policy', () => {
    // RED: File absent → content empty.
    const content = migrationContent();
    expect(
      content.includes('scores_insert_lead_auditor'),
      'Expected migration SQL to define the "scores_insert_lead_auditor" CREATE POLICY statement ' +
        '(GAP-011). Ensure the policy is present in 20260310000001_wave16_6_schema_audit_completeness.sql.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.6-SCH-002 — canonical migration contains audit_scores policy
// ---------------------------------------------------------------------------

describe('T-W16.6-SCH-002: Wave 16.6 migration contains audit_scores_insert_lead_auditor', () => {
  it('migration file contains audit_scores_insert_lead_auditor policy', () => {
    // RED: File absent → content empty.
    const content = migrationContent();
    expect(
      content.includes('audit_scores_insert_lead_auditor'),
      'Expected migration SQL to define the "audit_scores_insert_lead_auditor" CREATE POLICY statement ' +
        '(GAP-012). Ensure the policy is present in 20260310000001_wave16_6_schema_audit_completeness.sql.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.6-SCH-004 — audit log action types in migration
// ---------------------------------------------------------------------------

describe('T-W16.6-SCH-004: Wave 16.6 migration defines all required audit log action types', () => {
  const REQUIRED_ACTION_TYPES = [
    'evidence_upload',
    'score_confirmed',
    'score_overridden',
    'report_generated',
  ] as const;

  for (const actionType of REQUIRED_ACTION_TYPES) {
    it(`migration contains audit log action type: "${actionType}"`, () => {
      // RED: File absent → content empty; none of these action types exist yet.
      // GREEN: Wave 16.6 migration introduces CHECK/ENUM or comment-documented
      //        action types to the audit_logs table (GAP-016).
      const content = migrationContent();
      expect(
        content.includes(actionType),
        `Expected migration SQL to reference audit log action type "${actionType}" ` +
          `(GAP-016: audit logging only covers criteria parsing). ` +
          `Add "${actionType}" to the audit_logs action constraint or CHECK clause in ` +
          `20260310000001_wave16_6_schema_audit_completeness.sql.`,
      ).toBe(true);
    });
  }
});

// ---------------------------------------------------------------------------
// T-W16.6-SCH-005 — evidence_submissions table in migration
// ---------------------------------------------------------------------------

describe('T-W16.6-SCH-005: Wave 16.6 migration creates evidence_submissions table', () => {
  it('migration file contains CREATE TABLE evidence_submissions', () => {
    // RED: File absent → content empty. No evidence_submissions table exists.
    // GREEN: Wave 16.6 migration creates the table (GAP-019).
    const content = migrationContent();
    const hasTable =
      content.includes('evidence_submissions') &&
      // Accept both "CREATE TABLE evidence_submissions" and
      // "CREATE TABLE IF NOT EXISTS evidence_submissions"
      /CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?evidence_submissions/i.test(content);
    expect(
      hasTable,
      'Expected migration SQL to contain a CREATE TABLE statement for "evidence_submissions" ' +
        '(GAP-019: evidence_submissions table missing). ' +
        'Add the table definition to 20260310000001_wave16_6_schema_audit_completeness.sql.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.6-SCH-006 — evidence_submissions INSERT RLS binds submitted_by to auth.uid()
// ---------------------------------------------------------------------------

describe('T-W16.6-SCH-006: evidence_submissions INSERT policy enforces submitted_by = auth.uid()', () => {
  it('INSERT policy WITH CHECK clause contains submitted_by = auth.uid()', () => {
    // GREEN: INSERT policy must bind submitted_by to the current user to prevent
    // impersonation within the same org (security finding addressed post-IAA).
    const content = migrationContent();
    const hasSubmittedByCheck =
      content.includes('evidence_submissions_insert_authenticated') &&
      /submitted_by\s*=\s*auth\.uid\(\)/.test(content);
    expect(
      hasSubmittedByCheck,
      'Expected the evidence_submissions INSERT RLS policy to include ' +
        '"submitted_by = auth.uid()" in its WITH CHECK clause to prevent ' +
        'impersonation of other submitters within the same organisation.',
    ).toBe(true);
  });
});
