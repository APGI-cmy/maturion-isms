/**
 * Wave 14 — Responsibility Cascade (T-W14-UX-014)
 *
 * Test ID : T-W14-UX-014
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-102 / TR-102
 *
 * Scenario: Without assignment rows, all responsibility resolves to the Lead Auditor
 * (audit.created_by). When a domain_assignments row is inserted, the domain responsibility
 * changes. MPS and criteria cascade to the domain auditor. When an mps_assignments row
 * is inserted, MPS and criteria resolve to the MPS auditor.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `domain_assignments` table does not exist in any migration.
 *   - `mps_assignments` table does not exist in any migration.
 *   - `criteria_assignments` table does not exist in any migration.
 *   - Responsibility cascade view or function is not implemented.
 *   - Target migration `20260305000001_wave14_invitations_assignments.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-014a: Target migration file exists
 *   T-W14-UX-014b: domain_assignments table is created in migration
 *   T-W14-UX-014c: mps_assignments table is created in migration
 *   T-W14-UX-014d: criteria_assignments table is created in migration
 *   T-W14-UX-014e: Migration defines a responsibility cascade view or function
 *   T-W14-UX-014f: Assignment tables have audit_id column (scoped to audit, not global)
 *
 * References:
 *   FR-102, TR-102
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W14
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Shared target migration for invitations + assignments (Wave 14).
 * Contains domain_assignments, mps_assignments, criteria_assignments.
 */
const TARGET_MIGRATION_FILE = '20260305000001_wave14_invitations_assignments.sql';
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

describe('T-W14-UX-014 — Responsibility cascade defaults to Lead Auditor when no assignment (GAP-W14)', () => {

  it('T-W14-UX-014a: Wave 14 invitations/assignments migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-014b: domain_assignments table is created in migration', () => {
    // domain_assignments links a user to a domain within an audit, overriding
    // responsibility for that domain from the Lead Auditor to the Domain Auditor.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.domain_assignments (FR-102 — domain responsibility assignment)'
    ).toMatch(/CREATE TABLE.*public\.domain_assignments/i);
  });

  it('T-W14-UX-014c: mps_assignments table is created in migration', () => {
    // mps_assignments links a user to an MPS within an audit, overriding
    // responsibility at the MPS level (cascades down to criteria under that MPS).
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.mps_assignments (FR-102 — MPS responsibility assignment)'
    ).toMatch(/CREATE TABLE.*public\.mps_assignments/i);
  });

  it('T-W14-UX-014d: criteria_assignments table is created in migration', () => {
    // criteria_assignments links an Evidence Submitter to a specific criteria.
    // At the responsibility cascade level, it also overrides the responsible user
    // for that individual criteria.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.criteria_assignments (FR-102 — criteria responsibility assignment)'
    ).toMatch(/CREATE TABLE.*public\.criteria_assignments/i);
  });

  it('T-W14-UX-014e: Migration defines a responsibility cascade view or SQL function', () => {
    // The responsibility cascade must be implemented as a DB VIEW or stored function
    // that resolves the responsible user for any domain/MPS/criteria by walking up
    // the assignment hierarchy: criteria_assignments → mps_assignments → domain_assignments → audit.created_by.
    // RED: No such view or function exists.
    const sql = readTargetMigration();
    expect(
      sql,
      'Wave 14 migration must define a VIEW or FUNCTION for responsibility cascade resolution (TR-102)'
    ).toMatch(/CREATE\s+(OR\s+REPLACE\s+)?(VIEW|FUNCTION).*responsib|responsib.*(VIEW|FUNCTION)/i);
  });

  it('T-W14-UX-014f: Assignment tables include audit_id (assignments are scoped to a specific audit)', () => {
    // Assignments must be scoped to a specific audit (not global). The audit_id column
    // ensures that a Domain Auditor assigned for Audit A does not gain access to Audit B.
    // RED: Tables do not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'Assignment tables must include audit_id column (TR-102 — audit-scoped responsibility)'
    ).toMatch(/audit_id/i);
  });

});
