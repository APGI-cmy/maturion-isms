import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../../../..');
const MIGRATIONS = resolve(ROOT, 'supabase/migrations');
const PIT_PROJECTS_MIGRATION = '20260722102655_pit_stage12_slice4_project_persistence.sql';

function sourceMigrations(): Array<{ filename: string; sql: string }> {
  return readdirSync(MIGRATIONS)
    .filter((filename) => filename.endsWith('.sql'))
    .sort()
    .map((filename) => ({ filename, sql: readFileSync(resolve(MIGRATIONS, filename), 'utf8') }));
}

function profilesBootstrap() {
  return sourceMigrations().find(({ sql }) => /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.profiles\b/i.test(sql));
}

describe('Issue #1990 foundational public.profiles bootstrap — QA-to-RED', () => {
  it('supplies one ordered source bootstrap before PIT projects depends on it', () => {
    const bootstrap = profilesBootstrap();
    expect(bootstrap, 'a source migration must create public.profiles').toBeDefined();
    expect(bootstrap!.filename < PIT_PROJECTS_MIGRATION).toBe(true);
    expect(existsSync(resolve(MIGRATIONS, PIT_PROJECTS_MIGRATION))).toBe(true);
  });

  it('preserves the production identity and organisation dependencies', () => {
    const sql = profilesBootstrap()?.sql ?? '';
    expect(sql).toMatch(/\bid\s+uuid\s+(?:primary\s+key\s+)?references\s+auth\.users\s*\(\s*id\s*\)\s+on\s+delete\s+cascade/i);
    expect(sql).toMatch(/\borganisation_id\s+uuid\b[\s\S]{0,180}references\s+public\.organisations\s*\(\s*id\s*\)/i);
  });

  it('enables RLS and establishes own-row SELECT, INSERT and UPDATE protection', () => {
    const sql = profilesBootstrap()?.sql ?? '';
    expect(sql).toMatch(/alter\s+table\s+public\.profiles\s+enable\s+row\s+level\s+security/i);
    for (const command of ['select', 'insert', 'update']) {
      expect(sql).toMatch(new RegExp(`create\\s+policy[\\s\\S]{0,360}on\\s+public\\.profiles\\s+for\\s+${command}[\\s\\S]{0,360}auth\\.uid\\s*\\(\\s*\\)\\s*=\\s*id`, 'i'));
    }
  });
});
