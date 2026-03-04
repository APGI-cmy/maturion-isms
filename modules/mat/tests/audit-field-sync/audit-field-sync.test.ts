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
 * They assert that migration SQL files in the migrations directory already contain the
 * required columns. On the current branch these tests are GREEN immediately, because:
 *   - organisation_name and facility_location are present in
 *     20260304000001_audits_add_criteria_approved.sql
 *   - audit_period_start and audit_period_end are present in
 *     20260303000000_audits_add_period_columns.sql
 * Their purpose is to PROTECT against future column removal / schema drift. If any migration
 * is dropped or the column is removed, these tests go RED and alert the team.
 *
 * Test T-AFS-COL-005 is the PRIMARY QA-TO-RED IMPLEMENTATION GATE for this wave.
 * It asserts that useAudits.ts does NOT contain the incorrect workaround
 * `description: input.organisation_name`. On the current branch this test is RED (FAIL)
 * because the workaround is still present (~line 110 of useAudits.ts).
 * TASK-AFS-002 (ui-builder) must fix the hook to make this test GREEN.
 *
 * Expected results before TASK-AFS-002 fix:
 *   T-AFS-COL-001: PASS ✅ (migration guard — organisation_name in migration)
 *   T-AFS-COL-002: PASS ✅ (migration guard — facility_location in migration)
 *   T-AFS-COL-003: PASS ✅ (migration guard — audit_period_start in migration)
 *   T-AFS-COL-004: PASS ✅ (migration guard — audit_period_end in migration)
 *   T-AFS-COL-005: FAIL ❌ (RED gate — useAudits.ts has description workaround)
 *
 * Authority: IAA Pre-Brief .agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md
 * IAA Trigger Category: AAWP_MAT
 */
import { describe, it, expect } from 'vitest';
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

/** Concatenate all *.sql migration files into a single string for pattern assertions. */
function allMigrationSql(): string {
  const files = fs.readdirSync(MIGRATION_DIR).filter((f) => f.endsWith('.sql'));
  return files
    .map((f) => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8'))
    .join('\n');
}

describe('Wave audit-field-sync — Column Drift Guard & Implementation Gate (TASK-AFS-001)', () => {

  it('T-AFS-COL-001: organisation_name column must be present in a migration (migration drift guard)', () => {
    expect(
      allMigrationSql(),
      'audits.organisation_name column must be in a migration — ADD COLUMN IF NOT EXISTS organisation_name'
    ).toMatch(/organisation_name/i);
  });

  it('T-AFS-COL-002: facility_location column must be present in a migration (migration drift guard)', () => {
    expect(
      allMigrationSql(),
      'audits.facility_location column must be in a migration — ADD COLUMN IF NOT EXISTS facility_location'
    ).toMatch(/facility_location/i);
  });

  it('T-AFS-COL-003: audit_period_start column must be present in a migration (migration drift guard)', () => {
    expect(
      allMigrationSql(),
      'audits.audit_period_start column must be in a migration — ADD COLUMN IF NOT EXISTS audit_period_start'
    ).toMatch(/audit_period_start/i);
  });

  it('T-AFS-COL-004: audit_period_end column must be present in a migration (migration drift guard)', () => {
    expect(
      allMigrationSql(),
      'audits.audit_period_end column must be in a migration — ADD COLUMN IF NOT EXISTS audit_period_end'
    ).toMatch(/audit_period_end/i);
  });

  it('T-AFS-COL-005: useAudits.ts must NOT contain description workaround for organisation_name (RED implementation gate)', () => {
    const source = fs.readFileSync(USE_AUDITS_HOOK, 'utf-8');
    expect(
      source,
      'useAudits.ts must not map organisation_name to description column — fix: use organisation_name: input.organisation_name'
    ).not.toContain('description: input.organisation_name');
  });

});
