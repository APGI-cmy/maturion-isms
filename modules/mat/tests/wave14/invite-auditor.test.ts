/**
 * Wave 14 — Invite Auditor (T-W14-UX-002)
 *
 * Test ID : T-W14-UX-002
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-090 / TR-090
 *
 * Scenario: Lead Auditor invites a Domain Auditor via modal. An `audit_invitations`
 * row is created. The `send-invitation` Edge Function is triggered. The invitee
 * accepts the invite via `/accept-invite?token=…`, a user account is created, and
 * a `domain_assignments` row is inserted. `audit_invitations.status` → 'accepted'.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `audit_invitations` table does not exist in any migration.
 *   - `domain_assignments` table does not exist in any migration.
 *   - Target migration `20260305000001_wave14_invitations_assignments.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 * Tests MUST PASS in CI without env vars.
 *
 * Test summary:
 *   T-W14-UX-002a: Target migration file exists
 *   T-W14-UX-002b: audit_invitations table is created in migration
 *   T-W14-UX-002c: audit_invitations has scope_type and invitation_token columns
 *   T-W14-UX-002d: audit_invitations has status column with 'pending'/'accepted' values
 *   T-W14-UX-002e: domain_assignments table is created in migration
 *   T-W14-UX-002f: domain_assignments has user_id and domain_id columns
 *   T-W14-UX-002g: RLS policy on audit_invitations enforces org isolation
 *
 * References:
 *   FR-090, TR-090
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W02
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Target migration file for Wave 14 invitations and assignments.
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
    `schema-builder must create this file (Wave 14) to turn these tests GREEN.`
  ).toBe(true);
  return fs.readFileSync(TARGET_MIGRATION_PATH, 'utf-8');
}

describe('T-W14-UX-002 — Invite Auditor modal creates invitation and triggers email (GAP-W02)', () => {

  it('T-W14-UX-002a: Wave 14 invitations/assignments migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-002b: audit_invitations table is created in migration', () => {
    // The audit_invitations table stores pending and accepted audit invitations.
    // Created by schema-builder in Wave 14 migration.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.audit_invitations (FR-090 — invite auditor)'
    ).toMatch(/CREATE TABLE.*public\.audit_invitations/i);
  });

  it('T-W14-UX-002c: audit_invitations has scope_type and invitation_token columns', () => {
    // scope_type: 'domain' | 'criteria' — determines what the invitee is assigned to.
    // invitation_token: non-null unique UUID used in the accept-invite URL.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'audit_invitations must have a scope_type column (domain or criteria scoping) (TR-090)'
    ).toMatch(/scope_type/i);
    expect(
      sql,
      'audit_invitations must have an invitation_token column (unique token for accept-invite URL) (TR-090)'
    ).toMatch(/invitation_token/i);
  });

  it('T-W14-UX-002d: audit_invitations has status column with allowed values (pending/accepted)', () => {
    // status tracks the lifecycle: 'pending' on creation, 'accepted' after the
    // invitee visits the accept-invite URL and creates their account.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'audit_invitations must have a status column (FR-090)'
    ).toMatch(/status/i);
    expect(
      sql,
      "audit_invitations.status must include 'pending' as a valid value (TR-090)"
    ).toMatch(/pending/i);
    expect(
      sql,
      "audit_invitations.status must include 'accepted' as a valid value (TR-090)"
    ).toMatch(/accepted/i);
  });

  it('T-W14-UX-002e: domain_assignments table is created in migration', () => {
    // domain_assignments links a user to a specific domain within an audit,
    // granting them Domain Auditor access scoped to that domain only.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.domain_assignments (FR-090 — domain auditor scoping)'
    ).toMatch(/CREATE TABLE.*public\.domain_assignments/i);
  });

  it('T-W14-UX-002f: domain_assignments has user_id and domain_id columns', () => {
    // user_id: the invited auditor's user ID.
    // domain_id: the domain they are assigned to audit.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'domain_assignments must have a user_id column (TR-090)'
    ).toMatch(/user_id/i);
    expect(
      sql,
      'domain_assignments must have a domain_id column (TR-090)'
    ).toMatch(/domain_id/i);
  });

  it('T-W14-UX-002g: RLS policy on audit_invitations enforces org isolation', () => {
    // Users from Org A must not be able to SELECT or INSERT audit_invitations
    // belonging to Org B. The org-isolation SELECT policy must be defined in the migration.
    // RED: Table (and therefore policies) does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'audit_invitations must have an org-isolation SELECT RLS policy (TR-090 — cross-org leakage prevention)'
    ).toMatch(/audit_invitations.*select|select.*audit_invitations/i);
  });

});
