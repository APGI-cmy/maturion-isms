/**
 * Wave 14 — Dashboard Create Report Gate (T-W14-UX-010)
 *
 * Test ID : T-W14-UX-010
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-098 / TR-098
 *
 * Scenario: "Create Report" is disabled until all non-excluded criteria have a
 * confirmed or overridden evaluation. Gate query returns > 0 when criteria are
 * pending, returns 0 when all are confirmed. Dashboard metrics (Total, Submitted,
 * Outstanding, Excluded counts) are correctly computed.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `criteria_evaluations` table does not exist (gate query is impossible).
 *   - Dashboard metrics query is not implemented.
 *   - "Create Report" button gating logic is not implemented.
 *   - Target migration `20260305000004_wave14_evaluations.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-010a: Target migration file exists
 *   T-W14-UX-010b: criteria_evaluations table defined in migration
 *   T-W14-UX-010c: DashboardPage or hook references the gate query pattern (excluded + status)
 *   T-W14-UX-010d: Gate query pattern uses 'confirmed' and 'overridden' status values
 *   T-W14-UX-010e: Dashboard metrics (Submitted/Outstanding/Excluded) are referenced in source
 *
 * References:
 *   FR-098, TR-098
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W10
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');
const SRC_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src');

/**
 * Shared Wave 14 evaluations migration.
 */
const TARGET_MIGRATION_FILE = '20260305000004_wave14_evaluations.sql';
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

describe('T-W14-UX-010 — Dashboard gating: Create Report disabled until all criteria evaluated (GAP-W10)', () => {

  it('T-W14-UX-010a: Wave 14 evaluations migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-010b: criteria_evaluations table is defined in migration (gate query dependency)', () => {
    // The gate query: SELECT COUNT(*) FROM criteria WHERE excluded = false AND id NOT IN
    // (SELECT criteria_id FROM criteria_evaluations WHERE status IN ('confirmed','overridden'))
    // requires criteria_evaluations to exist.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.criteria_evaluations (FR-098 — dashboard gate query dependency)'
    ).toMatch(/CREATE TABLE.*public\.criteria_evaluations/i);
  });

  it('T-W14-UX-010c: DashboardPage or useAudits hook references gate query pattern with criteria_evaluations', () => {
    // The "Create Report" gate must be implemented in the dashboard page or an associated
    // hook. The source must query or reference criteria_evaluations.
    // RED: DashboardPage.tsx does not reference criteria_evaluations.
    const dashboardPage = path.join(SRC_DIR, 'pages', 'DashboardPage.tsx');
    const hookPath = path.join(SRC_DIR, 'lib', 'hooks', 'useAudits.ts');

    const candidateFiles = [dashboardPage, hookPath];
    const anyReferences = candidateFiles.some(f => {
      if (!fs.existsSync(f)) return false;
      const source = fs.readFileSync(f, 'utf-8');
      return /criteria_evaluations/i.test(source);
    });

    expect(
      anyReferences,
      `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
      `Neither DashboardPage.tsx nor useAudits.ts references 'criteria_evaluations'.\n` +
      `The Create Report gate query must be wired in one of these files. (FR-098)`
    ).toBe(true);
  });

  it("T-W14-UX-010d: Gate query pattern uses 'confirmed' and 'overridden' as gate-passing statuses", () => {
    // The gate passes (returns 0) when all non-excluded criteria have status
    // IN ('confirmed', 'overridden'). Both values must be referenced in the implementation.
    // RED: DashboardPage.tsx does not reference these status values in any gate context.
    const dashboardPage = path.join(SRC_DIR, 'pages', 'DashboardPage.tsx');
    const hookPath = path.join(SRC_DIR, 'lib', 'hooks', 'useAudits.ts');
    const hookDashboard = path.join(SRC_DIR, 'lib', 'hooks', 'useDashboard.ts');

    const candidateFiles = [dashboardPage, hookPath, hookDashboard];
    const anyReferences = candidateFiles.some(f => {
      if (!fs.existsSync(f)) return false;
      const source = fs.readFileSync(f, 'utf-8');
      return /confirmed/i.test(source) && /overridden/i.test(source);
    });

    expect(
      anyReferences,
      `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
      `Gate query status values 'confirmed' and 'overridden' not found in dashboard/hook files.\n` +
      `Create Report gate must check these statuses. (TR-098)`
    ).toBe(true);
  });

  it('T-W14-UX-010e: Dashboard source references Submitted, Outstanding, and Excluded count metrics', () => {
    // The dashboard must show 4 metrics: Total criteria, Submitted, Outstanding, Excluded.
    // These must be computed and rendered. The source must reference all three dynamic ones.
    // RED: DashboardPage.tsx does not compute these metrics.
    const dashboardPage = path.join(SRC_DIR, 'pages', 'DashboardPage.tsx');
    const source = fs.readFileSync(dashboardPage, 'utf-8');

    expect(
      source,
      'DashboardPage must reference Submitted count metric (FR-098 — dashboard metrics)'
    ).toMatch(/Submitted|submitted_count|submittedCount/i);

    expect(
      source,
      'DashboardPage must reference Outstanding count metric (FR-098 — dashboard metrics)'
    ).toMatch(/Outstanding|outstanding_count|outstandingCount/i);

    expect(
      source,
      'DashboardPage must reference Excluded count metric (FR-098 — dashboard metrics)'
    ).toMatch(/Excluded|excluded_count|excludedCount/i);
  });

});
