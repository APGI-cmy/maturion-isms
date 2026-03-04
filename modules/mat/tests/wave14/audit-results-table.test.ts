/**
 * Wave 14 — Audit Results Table (T-W14-UX-009)
 *
 * Test ID : T-W14-UX-009
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-097 / TR-097
 *
 * Scenario: An audit with criteria across domains and MPS renders a Results table.
 * Columns: Domain, MPS, Criteria, Findings Summary, Rating, Recommendations.
 * Excluded criteria are shown with "Excluded" label. Domain Auditor RLS scoping restricts
 * the view to their assigned domain only.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `criteria_evaluations` table does not exist (blocks the LEFT JOIN).
 *   - AuditResultsTable component does not exist.
 *   - Results tab does not exist in the audit view.
 *   - Target migration `20260305000004_wave14_evaluations.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-009a: Target migration file exists (criteria_evaluations)
 *   T-W14-UX-009b: criteria_evaluations table defined in migration
 *   T-W14-UX-009c: AuditResultsTable component file exists
 *   T-W14-UX-009d: AuditResultsTable source renders required columns (Domain, MPS, Criteria, Rating)
 *   T-W14-UX-009e: AuditResultsTable source handles excluded criteria visual treatment
 *   T-W14-UX-009f: results tab is registered in the audit page routing/tabs
 *
 * References:
 *   FR-097, TR-097
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W09
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

describe('T-W14-UX-009 — Audit results table renders all criteria with correct columns (GAP-W09)', () => {

  it('T-W14-UX-009a: Wave 14 evaluations migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-009b: criteria_evaluations table is defined in migration (enables LEFT JOIN for results query)', () => {
    // The results table query joins audits→domains→mps→criteria→criteria_evaluations.
    // Without criteria_evaluations, the results query is impossible.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.criteria_evaluations (FR-097 — results table query dependency)'
    ).toMatch(/CREATE TABLE.*public\.criteria_evaluations/i);
  });

  it('T-W14-UX-009c: AuditResultsTable component file exists in frontend src', () => {
    // The audit results table must be implemented as a dedicated component.
    // RED: Component does not exist.
    const candidatePaths = [
      path.join(SRC_DIR, 'components', 'audit', 'AuditResultsTable.tsx'),
      path.join(SRC_DIR, 'components', 'results', 'AuditResultsTable.tsx'),
      path.join(SRC_DIR, 'components', 'AuditResultsTable.tsx'),
    ];
    const exists = candidatePaths.some(p => fs.existsSync(p));
    expect(
      exists,
      `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
      `AuditResultsTable.tsx not found in any of:\n` +
      candidatePaths.map(p => `  ${p}`).join('\n') + '\n' +
      `ui-builder must create this component to turn this test GREEN. (FR-097)`
    ).toBe(true);
  });

  it('T-W14-UX-009d: AuditResultsTable source references required columns: Domain, MPS, Criteria, Rating', () => {
    // The table must render columns: Domain, MPS, Criteria, Findings Summary, Rating, Recommendations.
    // RED: Component does not exist.
    const candidatePaths = [
      path.join(SRC_DIR, 'components', 'audit', 'AuditResultsTable.tsx'),
      path.join(SRC_DIR, 'components', 'results', 'AuditResultsTable.tsx'),
      path.join(SRC_DIR, 'components', 'AuditResultsTable.tsx'),
    ];
    const existingPath = candidatePaths.find(p => fs.existsSync(p));
    expect(
      existingPath,
      `[RED STATE] AuditResultsTable component not found — cannot verify column definitions. (FR-097)`
    ).toBeDefined();
    if (existingPath) {
      const source = fs.readFileSync(existingPath, 'utf-8');
      expect(source, 'AuditResultsTable must reference Domain column label (TR-097)').toMatch(/Domain/i);
      expect(source, 'AuditResultsTable must reference MPS column label (TR-097)').toMatch(/MPS|mini.performance/i);
      expect(source, 'AuditResultsTable must reference Criteria column label (TR-097)').toMatch(/Criteria/i);
      expect(source, 'AuditResultsTable must reference Rating column label (TR-097)').toMatch(/Rating/i);
    }
  });

  it('T-W14-UX-009e: AuditResultsTable source handles excluded criteria with visual treatment', () => {
    // Excluded criteria rows must be visually distinguished (greyed, "Excluded" label).
    // The source must reference the `excluded` field or an "Excluded" label rendering.
    // RED: Component does not exist.
    const candidatePaths = [
      path.join(SRC_DIR, 'components', 'audit', 'AuditResultsTable.tsx'),
      path.join(SRC_DIR, 'components', 'results', 'AuditResultsTable.tsx'),
      path.join(SRC_DIR, 'components', 'AuditResultsTable.tsx'),
    ];
    const existingPath = candidatePaths.find(p => fs.existsSync(p));
    expect(
      existingPath,
      `[RED STATE] AuditResultsTable component not found — cannot verify excluded criteria handling. (FR-097)`
    ).toBeDefined();
    if (existingPath) {
      const source = fs.readFileSync(existingPath, 'utf-8');
      expect(
        source,
        'AuditResultsTable must handle excluded criteria (show Excluded label or grey treatment) (TR-097)'
      ).toMatch(/excluded|Excluded/i);
    }
  });

  it('T-W14-UX-009f: Results tab is registered in the audit page routing or tabs definition', () => {
    // The Results tab must be reachable from the audit view. It must be registered
    // in the audit page routing or a tabs configuration file.
    // RED: No Results tab exists in the current audit pages.
    const auditPage = path.join(SRC_DIR, 'pages', 'AuditManagementPage.tsx');
    const source = fs.readFileSync(auditPage, 'utf-8');
    expect(
      source,
      'AuditManagementPage must include a Results tab (AuditResultsTable or results route) (FR-097)'
    ).toMatch(/results|Results|AuditResultsTable/i);
  });

});
