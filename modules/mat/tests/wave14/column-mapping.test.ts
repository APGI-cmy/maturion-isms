/**
 * Wave 14 — Column Mapping Drift Tests
 * INC-W14-COL-MAPPING-001
 *
 * All tests are file-based (no live Supabase env required).
 * Tests T-W14-COL-001 to T-W14-COL-006 are all GREEN after the Wave 14 Addendum A migrations
 * (20260304000000_profiles_add_full_name_and_preferences.sql,
 *  20260304000001_audits_add_criteria_approved.sql,
 *  20260304000002_audit_scores_table.sql) are applied.
 *
 * Incident: INC-W14-COL-MAPPING-001
 * Authority: CS2 (Johan Ras) | Date: 2026-03-03
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

function allMigrationSql(): string {
  const files = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.sql'));
  return files.map(f => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8')).join('\n');
}

describe('Wave 14 — Column Mapping Drift Guard (INC-W14-COL-MAPPING-001)', () => {

  it('T-W14-COL-001: profiles.full_name column exists in migration (INC-W14-PROFILES-COL-001)', () => {
    expect(
      allMigrationSql(),
      'profiles.full_name column must be in a migration — add ADD COLUMN IF NOT EXISTS full_name TEXT'
    ).toMatch(/full_name/i);
  });

  it('T-W14-COL-002: profiles.preferences JSONB column exists in migration (INC-W14-PROFILES-COL-002)', () => {
    expect(
      allMigrationSql(),
      'profiles.preferences JSONB column must be in a migration — add ADD COLUMN IF NOT EXISTS preferences JSONB'
    ).toMatch(/preferences.*jsonb/i);
  });

  it('T-W14-COL-003: audits.criteria_approved column exists in migration (INC-W14-AUDITS-COL-001)', () => {
    expect(
      allMigrationSql(),
      'audits.criteria_approved column must be in a migration — add ADD COLUMN IF NOT EXISTS criteria_approved BOOLEAN'
    ).toMatch(/criteria_approved/i);
  });

  it('T-W14-COL-004: audit_scores table migration exists (INC-W13-AUDIT-SCORES-001 carry-forward)', () => {
    expect(
      allMigrationSql(),
      'audit_scores table must exist in a migration — add CREATE TABLE IF NOT EXISTS public.audit_scores'
    ).toMatch(/CREATE TABLE IF NOT EXISTS public\.audit_scores/i);
  });

  it('T-W14-COL-005: useSettings.ts does NOT write full_name without profiles.full_name migration existing', () => {
    const SETTINGS_HOOK = path.resolve(process.cwd(), 'modules/mat/frontend/src/lib/hooks/useSettings.ts');
    const source = fs.readFileSync(SETTINGS_HOOK, 'utf-8');
    const migrationSql = allMigrationSql();
    if (source.includes('full_name')) {
      expect(
        migrationSql,
        'useSettings.ts writes full_name but no migration adds this column to profiles'
      ).toMatch(/full_name/i);
    }
  });

  it('T-W14-COL-006: useAudits.ts does NOT write criteria_approved without audits.criteria_approved migration existing', () => {
    const AUDITS_HOOK = path.resolve(process.cwd(), 'modules/mat/frontend/src/lib/hooks/useAudits.ts');
    const source = fs.readFileSync(AUDITS_HOOK, 'utf-8');
    const migrationSql = allMigrationSql();
    if (source.includes('criteria_approved')) {
      expect(
        migrationSql,
        'useAudits.ts writes criteria_approved but no migration adds this column to audits'
      ).toMatch(/criteria_approved/i);
    }
  });

});
