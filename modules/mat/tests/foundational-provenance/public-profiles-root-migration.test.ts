import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Issue #1993 — source-only QA-to-RED guard.
 *
 * Intended RED against main before the recovery migration exists:
 * public.profiles has no committed root migration in the active inventory.
 *
 * This guard intentionally checks only the shared profiles foundation. It must
 * not validate or restore legacy MAT tables, triggers, storage, grants, runtime,
 * or workflow behaviour.
 */
const migrationDirectory = resolve(process.cwd(), 'supabase/migrations');
const migrationName = '20260615000000_public_profiles_root_provenance.sql';
const migrationPath = resolve(migrationDirectory, migrationName);
const pitSlice4Version = '20260722102655_pit_stage12_slice4_project_persistence.sql';

function source(): string {
  expect(
    existsSync(migrationPath),
    `missing root migration: ${migrationName}`,
  ).toBe(true);

  return readFileSync(migrationPath, 'utf8');
}

describe('Issue #1993 — public.profiles root migration provenance', () => {
  it('T-1993-RED-001: introduces the root migration in the required ordering window', () => {
    expect(migrationName > '20260610180000_isms_w6_persistence_audit.sql').toBe(true);
    expect(migrationName < pitSlice4Version).toBe(true);
    source();
  });

  it('T-1993-RED-002: preserves precisely the 11-column live-compatible profile contract and defaults', () => {
    const sql = source();

    expect(sql).toMatch(/id\s+uuid\s+primary key\s+references\s+auth\.users\s*\(id\)\s+on delete cascade/i);
    expect(sql).toMatch(/organisation_id\s+uuid\s+references\s+public\.organisations\s*\(id\)/i);
    expect(sql).toMatch(/display_name\s+text/i);
    expect(sql).toMatch(/email\s+text/i);
    expect(sql).toMatch(/language\s+text\s+default\s+'en'/i);
    expect(sql).toMatch(/theme\s+text\s+default\s+'light'/i);
    expect(sql).toMatch(/role\s+text\s+default\s+'viewer'/i);
    expect(sql).toMatch(/created_at\s+timestamptz\s+not null\s+default\s+now\(\)/i);
    expect(sql).toMatch(/updated_at\s+timestamptz\s+not null\s+default\s+now\(\)/i);
    expect(sql).toMatch(/full_name\s+text/i);
    expect(sql).toMatch(/preferences\s+jsonb\s+default\s+'\{\}'::jsonb/i);
  });

  it('T-1993-RED-003: preserves only the two required foreign keys and restrictive RLS', () => {
    const sql = source();

    expect(sql).toMatch(/references\s+auth\.users\s*\(id\)\s+on delete cascade/i);
    expect(sql).toMatch(/references\s+public\.organisations\s*\(id\)/i);
    expect(sql).toMatch(/alter table\s+public\.profiles\s+enable row level security/i);
  });

  it('T-1993-RED-004: creates only the three self-only profile policies', () => {
    const sql = source();

    for (const policy of ['profiles_select_own', 'profiles_insert_own', 'profiles_update_own']) {
      expect(sql).toMatch(new RegExp(`create policy\\s+${policy}\\s+on\\s+public\\.profiles`, 'i'));
    }

    expect(sql).toMatch(/for select[\s\S]*using\s*\(\s*auth\.uid\(\)\s*=\s*id\s*\)/i);
    expect(sql).toMatch(/for insert[\s\S]*with check\s*\(\s*auth\.uid\(\)\s*=\s*id\s*\)/i);
    expect(sql).toMatch(/for update[\s\S]*using\s*\(\s*auth\.uid\(\)\s*=\s*id\s*\)[\s\S]*with check\s*\(\s*auth\.uid\(\)\s*=\s*id\s*\)/i);
  });

  it('T-1993-RED-005: excludes unrelated legacy objects and broad access grants', () => {
    const sql = source();

    expect(sql).not.toMatch(/public\.(audits|domains|criteria|mini_performance_standards|audit_scores)/i);
    expect(sql).not.toMatch(/create\s+trigger|storage\.|\bgrant\b/i);
  });
});
