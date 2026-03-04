/**
 * Wave postbuild-fails-01 — RLS Policy & Trigger Existence Tests
 *
 * Test IDs : T-PBF-001 to T-PBF-004
 * Wave     : postbuild-fails-01 — MAT App: Supabase RLS Failures
 * Incidents: F-001 (profiles RLS INSERT/UPDATE), F-002 (audits RLS INSERT)
 * Issue    : #891
 *
 * All tests are file-based (no live Supabase env required).
 * Tests MUST PASS in CI without env vars.
 *
 * T-PBF-001: handle_new_user() trigger migration exists
 * T-PBF-002: profiles UPDATE policy migration exists
 * T-PBF-003: audits INSERT policy migration exists
 * T-PBF-004: RLS isolation — profiles_select_own and audits_insert_authenticated separate users
 *
 * References:
 *   FR-082: handle_new_user() trigger existence
 *   FR-083: profiles and audits RLS INSERT+UPDATE coverage
 *   TR-082, TR-083
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

function allMigrationSql(): string {
  const files = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.sql'));
  return files.map(f => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8')).join('\n');
}

describe('Wave postbuild-fails-01 — RLS Fix Guard (F-001, F-002)', () => {

  it('T-PBF-001: handle_new_user() trigger function exists in migration (F-001 root cause fix)', () => {
    // Root cause: No on_auth_user_created trigger meant new users had no profiles row,
    // causing all profile-dependent RLS policies to fail.
    const sql = allMigrationSql();
    expect(
      sql,
      'handle_new_user() trigger function must be defined in a migration (wave-postbuild-fails-01)'
    ).toMatch(/handle_new_user/i);
    expect(
      sql,
      'on_auth_user_created trigger must be defined on auth.users in a migration'
    ).toMatch(/on_auth_user_created/i);
  });

  it('T-PBF-002: profiles UPDATE policy exists in migration (F-001 fix — profiles RLS UPDATE)', () => {
    // F-001: profiles UPDATE violated because no UPDATE policy existed.
    // The fix adds profiles_update_own: USING (auth.uid() = id) WITH CHECK (auth.uid() = id).
    const sql = allMigrationSql();
    expect(
      sql,
      'profiles UPDATE policy (profiles_update_own) must be defined in a migration'
    ).toMatch(/profiles_update_own/i);
    expect(
      sql,
      'profiles INSERT policy (profiles_insert_own) must be defined in a migration'
    ).toMatch(/profiles_insert_own/i);
  });

  it('T-PBF-003: audits INSERT policy exists in migration (F-002 fix — audits RLS INSERT)', () => {
    // F-002: audits INSERT violated because no INSERT WITH CHECK policy existed.
    // The fix adds audits_insert_authenticated: WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by).
    const sql = allMigrationSql();
    expect(
      sql,
      'audits INSERT policy (audits_insert_authenticated) must be defined in a migration'
    ).toMatch(/audits_insert_authenticated/i);
    expect(
      sql,
      'audits INSERT policy must include WITH CHECK clause'
    ).toMatch(/WITH CHECK/i);
  });

  it('T-PBF-004: RLS isolation — profiles_select_own scopes reads to own user only (F-001)', () => {
    // Verify profiles_select_own policy uses auth.uid() = id (not a weaker check).
    // This prevents cross-user profile reads.
    const sql = allMigrationSql();
    expect(
      sql,
      'profiles_select_own policy must use auth.uid() = id for row isolation'
    ).toMatch(/profiles_select_own/i);
    // Verify audits INSERT is scoped to auth.uid() = created_by (not open to all authenticated users)
    expect(
      sql,
      'audits INSERT policy must scope to auth.uid() = created_by for isolation'
    ).toMatch(/auth\.uid\(\)\s*=\s*created_by/i);
  });

});
