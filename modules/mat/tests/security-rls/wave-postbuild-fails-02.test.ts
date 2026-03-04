/**
 * Wave postbuild-fails-02 — RLS Policy Existence Tests (GAP-006 to GAP-013)
 *
 * Test IDs : T-PBF2-001 to T-PBF2-008
 * Wave     : postbuild-fails-02 — MAT App: Supabase RLS Full Remediation
 * Issue    : #897
 *
 * GAP mappings (from modules/mat/03-implementation-plan/supabase-sync-audit-20260304.md):
 *   GAP-006: organisations           — missing INSERT + UPDATE policies
 *   GAP-007: domains                 — missing INSERT + UPDATE policies
 *   GAP-008: mini_performance_standards — missing SELECT org-isolation policy
 *                                        (write must remain service_role only; no INSERT/UPDATE for app users)
 *   GAP-009: criteria                — missing INSERT + UPDATE policies
 *   GAP-010: evidence                — missing INSERT + UPDATE + DELETE policies
 *   GAP-011: scores                  — missing INSERT + UPDATE policies
 *   GAP-012: organisation_settings   — missing INSERT + UPDATE policies
 *   GAP-013: audit_scores            — missing INSERT + UPDATE policies
 *
 * All tests are file-based (no live Supabase env required).
 * Tests MUST PASS in CI without env vars.
 *
 * RED STATE (expected before Task 5 migration lands):
 *   All tests fail because the target migration file
 *   `apps/maturion-maturity-legacy/supabase/migrations/20260304000004_fix_rls_remaining_tables.sql`
 *   does not yet exist. This is the intended RED state — schema-builder (TASK-PBF2-005)
 *   will create the migration and turn these tests GREEN.
 *
 * Test summary:
 *   T-PBF2-001 (GAP-010): evidence INSERT + UPDATE + DELETE policies
 *   T-PBF2-002 (GAP-011): scores INSERT + UPDATE policies
 *   T-PBF2-003 (GAP-013): audit_scores INSERT + UPDATE policies
 *   T-PBF2-004 (GAP-012): organisation_settings INSERT + UPDATE policies
 *   T-PBF2-005 (GAP-009): criteria INSERT + UPDATE policies
 *   T-PBF2-006 (GAP-007): domains INSERT + UPDATE policies
 *   T-PBF2-007 (GAP-006): organisations INSERT + UPDATE policies
 *   T-PBF2-008 (GAP-008): mini_performance_standards — read-only guard (SELECT only, no INSERT/UPDATE)
 *
 * References:
 *   FR-084–FR-088 (functional-requirements.md — RLS remediation)
 *   TR-084–TR-088 (technical-requirements-specification.md — RLS remediation)
 *   supabase-sync-audit-20260304.md (authoritative gap register)
 *   Prior wave: T-PBF-001 to T-PBF-004 in wave-postbuild-fails-01.test.ts (unchanged, unrelated)
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Target migration file for Wave postbuild-fails-02 (Task 5 / TASK-PBF2-005).
 * Created by schema-builder AFTER these RED gate tests are submitted.
 * All tests assert file existence first — absent file = RED state (expected at PR time).
 */
const TARGET_MIGRATION_FILE = '20260304000004_fix_rls_remaining_tables.sql';
const TARGET_MIGRATION_PATH = path.join(MIGRATION_DIR, TARGET_MIGRATION_FILE);

/**
 * Read the target wave migration SQL.
 * Fails immediately (RED) if the migration file does not yet exist.
 */
function readWaveMigrationSql(): string {
  const fileExists = fs.existsSync(TARGET_MIGRATION_PATH);
  expect(
    fileExists,
    `[RED STATE — EXPECTED before Task 5 lands]\n` +
    `Migration file not found: ${TARGET_MIGRATION_PATH}\n` +
    `schema-builder must create this file (TASK-PBF2-005) to turn these tests GREEN.`
  ).toBe(true);
  return fs.readFileSync(TARGET_MIGRATION_PATH, 'utf-8');
}

describe('Wave postbuild-fails-02 — RLS Fix Guard (GAP-006 to GAP-013)', () => {

  it('T-PBF2-001: evidence INSERT + UPDATE + DELETE policies exist in migration (GAP-010)', () => {
    // GAP-010: evidence table missing INSERT, UPDATE, and DELETE RLS policies.
    // evidence rows are user + org scoped; all write operations must be restricted to row owners.
    // The migration must add all three: INSERT, UPDATE, and DELETE policies.
    // Reference: supabase-sync-audit-20260304.md § GAP-010
    const sql = readWaveMigrationSql();
    expect(
      sql,
      'evidence INSERT policy (e.g. evidence_insert_authenticated or evidence_insert_own) must be defined in migration (GAP-010)'
    ).toMatch(/evidence_insert_/i);
    expect(
      sql,
      'evidence UPDATE policy (e.g. evidence_update_own) must be defined in migration (GAP-010)'
    ).toMatch(/evidence_update_/i);
    expect(
      sql,
      'evidence DELETE policy (e.g. evidence_delete_own) must be defined in migration (GAP-010)'
    ).toMatch(/evidence_delete_/i);
  });

  it('T-PBF2-002: scores INSERT + UPDATE policies exist in migration (GAP-011)', () => {
    // GAP-011: scores table missing INSERT and UPDATE RLS policies.
    // scores rows are user + org scoped; writes must be restricted to authenticated users in context.
    // Reference: supabase-sync-audit-20260304.md § GAP-011
    const sql = readWaveMigrationSql();
    expect(
      sql,
      'scores INSERT policy (e.g. scores_insert_authenticated or scores_insert_own) must be defined in migration (GAP-011)'
    ).toMatch(/scores_insert_/i);
    expect(
      sql,
      'scores UPDATE policy (e.g. scores_update_own) must be defined in migration (GAP-011)'
    ).toMatch(/scores_update_/i);
  });

  it('T-PBF2-003: audit_scores INSERT + UPDATE policies exist in migration (GAP-013)', () => {
    // GAP-013: audit_scores table missing INSERT and UPDATE RLS policies.
    // audit_scores rows are org-scoped; writes are tied to audit ownership.
    // Reference: supabase-sync-audit-20260304.md § GAP-013
    const sql = readWaveMigrationSql();
    expect(
      sql,
      'audit_scores INSERT policy (e.g. audit_scores_insert_authenticated or audit_scores_insert_org_isolation) must be defined in migration (GAP-013)'
    ).toMatch(/audit_scores_insert_/i);
    expect(
      sql,
      'audit_scores UPDATE policy (e.g. audit_scores_update_own) must be defined in migration (GAP-013)'
    ).toMatch(/audit_scores_update_/i);
  });

  it('T-PBF2-004: organisation_settings INSERT + UPDATE policies exist in migration (GAP-012)', () => {
    // GAP-012: organisation_settings table missing INSERT and UPDATE RLS policies.
    // organisation_settings rows are org-owner scoped; only org admins should write settings.
    // Reference: supabase-sync-audit-20260304.md § GAP-012
    const sql = readWaveMigrationSql();
    expect(
      sql,
      'organisation_settings INSERT policy (e.g. organisation_settings_insert_org_isolation) must be defined in migration (GAP-012)'
    ).toMatch(/organisation_settings_insert_/i);
    expect(
      sql,
      'organisation_settings UPDATE policy (e.g. organisation_settings_update_org_isolation) must be defined in migration (GAP-012)'
    ).toMatch(/organisation_settings_update_/i);
  });

  it('T-PBF2-005: criteria INSERT + UPDATE policies exist in migration (GAP-009)', () => {
    // GAP-009: criteria table missing INSERT and UPDATE RLS policies.
    // criteria rows are org-scoped; writes must be restricted to the owning organisation.
    // Reference: supabase-sync-audit-20260304.md § GAP-009
    const sql = readWaveMigrationSql();
    expect(
      sql,
      'criteria INSERT policy (e.g. criteria_insert_org_isolation) must be defined in migration (GAP-009)'
    ).toMatch(/criteria_insert_/i);
    expect(
      sql,
      'criteria UPDATE policy (e.g. criteria_update_org_isolation) must be defined in migration (GAP-009)'
    ).toMatch(/criteria_update_/i);
  });

  it('T-PBF2-006: domains INSERT + UPDATE policies exist in migration (GAP-007)', () => {
    // GAP-007: domains table missing INSERT and UPDATE RLS policies.
    // domains rows are org-scoped; writes must be restricted to the owning organisation.
    // Reference: supabase-sync-audit-20260304.md § GAP-007
    const sql = readWaveMigrationSql();
    expect(
      sql,
      'domains INSERT policy (e.g. domains_insert_org_isolation) must be defined in migration (GAP-007)'
    ).toMatch(/domains_insert_/i);
    expect(
      sql,
      'domains UPDATE policy (e.g. domains_update_org_isolation) must be defined in migration (GAP-007)'
    ).toMatch(/domains_update_/i);
  });

  it('T-PBF2-007: organisations INSERT + UPDATE policies exist in migration (GAP-006)', () => {
    // GAP-006: organisations table missing INSERT and UPDATE RLS policies.
    // organisations rows are org-owner scoped; only the owner should write to their org record.
    // Reference: supabase-sync-audit-20260304.md § GAP-006
    const sql = readWaveMigrationSql();
    expect(
      sql,
      'organisations INSERT policy (e.g. organisations_insert_own or organisations_insert_authenticated) must be defined in migration (GAP-006)'
    ).toMatch(/organisations_insert_/i);
    expect(
      sql,
      'organisations UPDATE policy (e.g. organisations_update_own) must be defined in migration (GAP-006)'
    ).toMatch(/organisations_update_/i);
  });

  it('T-PBF2-008: mini_performance_standards has NO INSERT or UPDATE policies — read-only guard (GAP-008)', () => {
    // GAP-008: mini_performance_standards is a reference/lookup table managed by service_role only.
    // Application users (anon / authenticated) MUST NOT be granted INSERT or UPDATE access.
    // The migration MUST add a SELECT org-isolation policy for read access.
    // The migration MUST NOT add INSERT or UPDATE policies accessible to application users.
    //
    // This test is a security guard: if schema-builder accidentally adds INSERT/UPDATE policies
    // for mini_performance_standards, this test will turn RED, blocking the PR.
    //
    // RED state (pre-migration): test fails because the migration file does not yet exist.
    // GREEN state (post-migration): migration exists, has SELECT policy, has NO INSERT/UPDATE.
    //
    // Reference: supabase-sync-audit-20260304.md § GAP-008
    // IAA rule: MINI_PERFORMANCE_STANDARDS_SPECIAL_RULE (iaa-prebrief-wave-postbuild-fails-02.md)
    const sql = readWaveMigrationSql();

    // Positive assertion: migration must address mini_performance_standards with a SELECT policy
    // (org-isolation guard ensuring tenants can only read their own rows)
    expect(
      sql,
      'mini_performance_standards SELECT policy (e.g. mini_performance_standards_select_org_isolation) must be defined in migration (GAP-008)'
    ).toMatch(/mini_performance_standards_select_/i);

    // Negative assertion (security guard): no INSERT policy must be created for application users
    const hasMpsInsert = /CREATE\s+POLICY\s+mini_performance_standards_insert_/i.test(sql);
    expect(
      hasMpsInsert,
      'mini_performance_standards MUST NOT have an INSERT policy for application users — ' +
      'this table is service_role-write-only. An INSERT policy would be a security over-grant. (GAP-008 read-only guard)'
    ).toBe(false);

    // Negative assertion (security guard): no UPDATE policy must be created for application users
    const hasMpsUpdate = /CREATE\s+POLICY\s+mini_performance_standards_update_/i.test(sql);
    expect(
      hasMpsUpdate,
      'mini_performance_standards MUST NOT have an UPDATE policy for application users — ' +
      'this table is service_role-write-only. An UPDATE policy would be a security over-grant. (GAP-008 read-only guard)'
    ).toBe(false);
  });

});
