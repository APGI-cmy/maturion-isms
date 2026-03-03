/**
 * Wave 13 — Schema Existence Tests (T-W13-SCH-1 to T-W13-SCH-12)
 *
 * Test IDs : T-W13-SCH-1 to T-W13-SCH-12
 * Task     : Wave 13 — Red QA Gate for the MAT module + Addendum C (Table Pathway Audit)
 * Builder  : schema-builder (T-W13-SCH-1–4), qa-builder (T-W13-SCH-5–12)
 * Wave     : 13 — Live Deployment Wiring Regression
 * Branch   : copilot/fix-live-deployment-wiring-regression
 *
 * RED gate (T-W13-SCH-1–4): These tests MUST FAIL until schema-builder applies production migration.
 *
 * GREEN gate (T-W13-SCH-5–12): File-based tests — do NOT require a live Supabase connection.
 *   These WILL PASS in CI without env vars. Added per Wave 13 Addendum C (INC-W13-COL-TEST-001)
 *   to prevent column-level drift and table-name drift from reaching production undetected.
 *
 * RCA Reference: MAT-RCA-002
 *   F-02: "Could not find the table 'public.audits' in the schema cache"
 *
 * Incident References (T-W13-SCH-5–12):
 *   INC-W13-PROFILE-TABLE-001  — useSettings.ts referenced user_profiles instead of profiles
 *   INC-W13-AUDIT-SCHEMA-001   — audit_period_start / audit_period_end missing from audits migration
 *   INC-W13-EVIDENCE-TABLE-001 — evidence table absent from production migration
 *   INC-W13-SCORES-TABLE-001   — scores table absent from production migration
 *   INC-W13-ORG-SETTINGS-001   — organisation_settings table absent from production migration
 *   INC-W13-BUCKET-001         — storage buckets absent from production migration
 *
 * POLC Note: T-W13-SCH-1–4 committed as FAILING (RED) per Wave 13 QA gate mandate.
 *            Do NOT modify those tests to pass — implement the fix instead.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('T-W13-SCH: Schema Existence and Env Var Audit', () => {
  it('T-W13-SCH-1: public.audits table exists in production schema', async () => {
    // RED: fails until migration is applied to production Supabase
    // The test verifies the audits table is accessible via Supabase client.
    // Without the env vars pointing to a real Supabase project with the migration
    // applied, this will fail with "VITE_SUPABASE_URL must be set".
    const { createClient } = await import('@supabase/supabase-js');
    // @ts-expect-error — import.meta.env is Vite-specific; vitest exposes it
    const supabaseUrl: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_URL;
    // @ts-expect-error — import.meta.env is Vite-specific; vitest exposes it
    const supabaseAnonKey: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;

    // RED: env vars not configured in test environment
    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const client = createClient(supabaseUrl!, supabaseAnonKey!);
    const { error } = await client.from('audits').select('id').limit(1);

    // RED: Error will be "Could not find the table 'public.audits' in the schema cache"
    expect(error, `Schema error: ${error?.message}`).toBeNull();
  });

  it('T-W13-SCH-2: public.criteria table exists in production schema', async () => {
    // RED: fails until schema-builder applies production migration
    const { createClient } = await import('@supabase/supabase-js');
    // @ts-expect-error — import.meta.env
    const supabaseUrl: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_URL;
    // @ts-expect-error — import.meta.env
    const supabaseAnonKey: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const client = createClient(supabaseUrl!, supabaseAnonKey!);
    const { error } = await client.from('criteria').select('id').limit(1);

    expect(error, `Schema error: ${error?.message}`).toBeNull();
  });

  it('T-W13-SCH-3: public.domains table exists in production schema', async () => {
    // RED: fails until schema-builder applies production migration
    const { createClient } = await import('@supabase/supabase-js');
    // @ts-expect-error — import.meta.env
    const supabaseUrl: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_URL;
    // @ts-expect-error — import.meta.env
    const supabaseAnonKey: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set').toBeTruthy();

    const client = createClient(supabaseUrl!, supabaseAnonKey!);
    const { error } = await client.from('domains').select('id').limit(1);

    expect(error, `Schema error: ${error?.message}`).toBeNull();
  });

  it('T-W13-SCH-4: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars are set', () => {
    // RED: fails in environments where env vars are not configured (CI / dev without .env)
    // This is the foundational env var audit — must pass before any Supabase call.
    // @ts-expect-error — import.meta.env
    const supabaseUrl: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_URL;
    // @ts-expect-error — import.meta.env
    const supabaseAnonKey: string | undefined = (import.meta as Record<string, unknown> & { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl, 'VITE_SUPABASE_URL must be set and non-empty').toBeTruthy();
    expect(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY must be set and non-empty').toBeTruthy();
    expect(supabaseUrl).not.toBe('https://placeholder.supabase.co');
    expect(supabaseAnonKey).not.toBe('placeholder-key');
  });

  // ─── T-W13-SCH-5 to T-W13-SCH-12: File-based tests (Wave 13 Addendum C) ───
  // Added per INC-W13-COL-TEST-001.  These tests do NOT require a live Supabase
  // connection and MUST PASS in CI without env vars.

  it('T-W13-SCH-5: useSettings.ts must reference profiles table, not user_profiles (INC-W13-PROFILE-TABLE-001)', () => {
    // INC-W13-PROFILE-TABLE-001: useSettings.ts was referencing 'user_profiles' (wrong table).
    // This test prevents recurrence: if 'user_profiles' ever reappears, it fails immediately.
    const SETTINGS_HOOK = path.resolve(process.cwd(), 'modules/mat/frontend/src/lib/hooks/useSettings.ts');
    expect(fs.existsSync(SETTINGS_HOOK), `useSettings.ts not found at ${SETTINGS_HOOK}`).toBe(true);
    const source = fs.readFileSync(SETTINGS_HOOK, 'utf-8');
    expect(source, 'useSettings.ts must NOT reference user_profiles — use profiles (INC-W13-PROFILE-TABLE-001)').not.toMatch(/'user_profiles'/);
    expect(source, 'useSettings.ts must reference profiles table').toMatch(/from\('profiles'\)/);
  });

  it('T-W13-SCH-6: audits period columns migration exists and includes both period columns (INC-W13-AUDIT-SCHEMA-001)', () => {
    // INC-W13-AUDIT-SCHEMA-001: audit_period_start and audit_period_end were missing from
    // the initial audits migration. This test ensures the remediation migration exists.
    const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');
    const files = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.sql'));

    // Find any migration file that adds these columns
    const allSql = files.map(f => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8')).join('\n');

    expect(allSql, 'No migration adds audit_period_start column').toMatch(/audit_period_start/i);
    expect(allSql, 'No migration adds audit_period_end column').toMatch(/audit_period_end/i);
  });

  it('T-W13-SCH-7: evidence table migration exists (INC-W13-EVIDENCE-TABLE-001)', () => {
    // INC-W13-EVIDENCE-TABLE-001: evidence table was missing from production migration
    const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');
    const files = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.sql'));
    const allSql = files.map(f => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8')).join('\n');
    expect(allSql, 'No migration creates public.evidence table').toMatch(/CREATE TABLE IF NOT EXISTS public\.evidence/i);
  });

  it('T-W13-SCH-8: scores table migration exists (INC-W13-SCORES-TABLE-001)', () => {
    // INC-W13-SCORES-TABLE-001: scores table (used by useScoring.ts) was missing from production migration
    const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');
    const files = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.sql'));
    const allSql = files.map(f => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8')).join('\n');
    expect(allSql, 'No migration creates public.scores table').toMatch(/CREATE TABLE IF NOT EXISTS public\.scores/i);
  });

  it('T-W13-SCH-9: organisation_settings table migration exists (INC-W13-ORG-SETTINGS-001)', () => {
    // INC-W13-ORG-SETTINGS-001: organisation_settings table was missing from production migration
    const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');
    const files = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.sql'));
    const allSql = files.map(f => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8')).join('\n');
    expect(allSql, 'No migration creates public.organisation_settings table').toMatch(/CREATE TABLE IF NOT EXISTS public\.organisation_settings/i);
  });

  it('T-W13-SCH-10: storage bucket migration exists for audit-documents and organisation-assets (INC-W13-BUCKET-001)', () => {
    // INC-W13-BUCKET-001: storage buckets were not created in any migration
    const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');
    const files = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.sql'));
    const allSql = files.map(f => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8')).join('\n');
    expect(allSql, 'No migration creates audit-documents storage bucket').toMatch(/audit-documents/);
    expect(allSql, 'No migration creates organisation-assets storage bucket').toMatch(/organisation-assets/);
  });

  it('T-W13-SCH-11: no frontend hook references a table absent from all migrations (table name drift guard)', () => {
    // This test enumerates all .from('table') calls in hooks and verifies each table name
    // appears in at least one migration. This catches INC-W13-PROFILE-TABLE-001 class of bug.
    const HOOKS_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src/lib/hooks');
    const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

    // Tables that are Supabase Storage buckets (not DB tables) — exempt from this check
    const STORAGE_BUCKETS = new Set(['audit-documents', 'organisation-assets']);

    // Tables explicitly documented as optional / not-yet-migrated in hook source — exempt.
    // audit_scores: useAuditMetrics.ts line ~67 — "Note: audit_scores table may not exist yet in schema"
    const OPTIONAL_TABLES = new Set(['audit_scores']);

    const hookFiles = fs.readdirSync(HOOKS_DIR).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
    const allHookSource = hookFiles.map(f => fs.readFileSync(path.join(HOOKS_DIR, f), 'utf-8')).join('\n');

    // Extract all .from('tableName') references (DB table pattern — not storage)
    const tableRefs = new Set<string>();
    const tablePattern = /\.from\('([^']+)'\)/g;
    let match;
    while ((match = tablePattern.exec(allHookSource)) !== null) {
      const tableName = match[1];
      if (!STORAGE_BUCKETS.has(tableName) && !OPTIONAL_TABLES.has(tableName)) {
        tableRefs.add(tableName);
      }
    }

    const migrationFiles = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.sql'));
    const allMigrationSql = migrationFiles.map(f => fs.readFileSync(path.join(MIGRATION_DIR, f), 'utf-8')).join('\n');

    // Every table referenced in hooks must appear in at least one migration
    for (const tableName of tableRefs) {
      expect(
        allMigrationSql,
        `Table '${tableName}' referenced in frontend hooks has no migration — add a CREATE TABLE migration`
      ).toMatch(new RegExp(tableName, 'i'));
    }
  });

  it('T-W13-SCH-12: lib/api/profile.ts references profiles table (regression guard)', () => {
    // Regression guard: ensure profile.ts stays wired to the correct table
    const PROFILE_API = path.resolve(process.cwd(), 'modules/mat/frontend/src/lib/api/profile.ts');
    expect(fs.existsSync(PROFILE_API), `profile.ts not found at ${PROFILE_API}`).toBe(true);
    const source = fs.readFileSync(PROFILE_API, 'utf-8');
    expect(source, 'profile.ts must reference profiles table').toMatch(/from\('profiles'\)/);
    expect(source, 'profile.ts must NOT reference user_profiles').not.toMatch(/'user_profiles'/);
  });
});
