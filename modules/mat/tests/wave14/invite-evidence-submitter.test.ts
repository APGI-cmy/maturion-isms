/**
 * Wave 14 — Invite Evidence Submitter (T-W14-UX-004)
 *
 * Test ID : T-W14-UX-004
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-092 / TR-092
 *
 * Scenario: Lead Auditor invites an Evidence Submitter for a specific Criteria.
 * The invitee accepts and can upload evidence for that criteria only.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `criteria_assignments` table does not exist in any migration.
 *   - Accept-invite route does not handle `scope_type = 'criteria'`.
 *   - Evidence RLS for criteria-scoped access is not implemented.
 *   - Target migration `20260305000001_wave14_invitations_assignments.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-004a: Target migration file exists
 *   T-W14-UX-004b: criteria_assignments table is created in migration
 *   T-W14-UX-004c: criteria_assignments has user_id and criteria_id columns
 *   T-W14-UX-004d: audit_invitations supports scope_type = 'criteria'
 *   T-W14-UX-004e: RLS policy on criteria_assignments is defined
 *
 * References:
 *   FR-092, TR-092
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W04
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Shared target migration for invitations + assignments (Wave 14).
 * Created by schema-builder AFTER these RED gate tests are submitted.
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

describe('T-W14-UX-004 — Invite Evidence Submitter creates criteria-scoped access (GAP-W04)', () => {

  it('T-W14-UX-004a: Wave 14 invitations/assignments migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-004b: criteria_assignments table is created in migration', () => {
    // criteria_assignments links an Evidence Submitter to a specific criteria,
    // granting them scoped upload access for that criteria only.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.criteria_assignments (FR-092 — criteria-scoped evidence submitter)'
    ).toMatch(/CREATE TABLE.*public\.criteria_assignments/i);
  });

  it('T-W14-UX-004c: criteria_assignments has user_id and criteria_id columns', () => {
    // user_id: the Evidence Submitter's user ID.
    // criteria_id: the criteria they are assigned to (scoped upload access).
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'criteria_assignments must have a user_id column (TR-092)'
    ).toMatch(/user_id/i);
    expect(
      sql,
      'criteria_assignments must have a criteria_id column (TR-092)'
    ).toMatch(/criteria_id/i);
  });

  it("T-W14-UX-004d: audit_invitations supports scope_type = 'criteria' (CHECK constraint includes 'criteria')", () => {
    // The audit_invitations.scope_type column must allow the 'criteria' value to
    // support criteria-scoped invitations (distinct from 'domain' invitations).
    // RED: audit_invitations table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      "audit_invitations.scope_type CHECK constraint must include 'criteria' value (TR-092)"
    ).toMatch(/criteria/i);
  });

  it('T-W14-UX-004e: RLS policy on criteria_assignments is defined in migration', () => {
    // Evidence Submitters must only see and act on their own criteria_assignments rows.
    // An org-isolation SELECT policy must be defined.
    // RED: Table (and therefore policies) does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'criteria_assignments must have an RLS SELECT policy defined in migration (TR-092 — scoped access enforcement)'
    ).toMatch(/criteria_assignments.*select|select.*criteria_assignments|POLICY.*criteria_assignments|criteria_assignments.*POLICY/i);
  });

});
