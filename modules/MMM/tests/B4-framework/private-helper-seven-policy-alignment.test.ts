import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const REPOSITORY_ROOT = resolve(__dirname, '../../../..');
const MIGRATIONS_DIRECTORY = join(REPOSITORY_ROOT, 'supabase/migrations');
const MIGRATION_SUFFIX = '_mmm_rls_seven_policy_private_helper_alignment.sql';

const POLICY_TARGETS = [
  ['public', 'mmm_criteria', 'mmm_criteria_update_own_org'],
  ['public', 'mmm_level_descriptors', 'mmm_level_descriptors_insert_own_org'],
  ['public', 'mmm_level_descriptors', 'mmm_level_descriptors_update_own_org'],
  ['storage', 'objects', 'mmm_evidence_org_read_v2'],
  ['storage', 'objects', 'mmm_evidence_org_insert_v2'],
  ['storage', 'objects', 'mmm_evidence_org_update_v2'],
  ['storage', 'objects', 'mmm_evidence_org_delete_v2'],
] as const;

function loadAlignmentMigration(): string {
  const migrations = readdirSync(MIGRATIONS_DIRECTORY).filter((file) =>
    file.endsWith(MIGRATION_SUFFIX),
  );

  expect(migrations, 'exactly one CLI-generated alignment migration').toHaveLength(1);
  return readFileSync(join(MIGRATIONS_DIRECTORY, migrations[0]), 'utf8');
}

describe('Issue #1959 seven-policy private-helper alignment', () => {
  it('T-MMM-RLS-1959-001 alters exactly the seven authorised policies', () => {
    const migration = loadAlignmentMigration();
    const alteredPolicies = [
      ...migration.matchAll(
        /ALTER\s+POLICY\s+"([^"]+)"\s+ON\s+(public|storage)\.([a-z_]+)/gi,
      ),
    ].map((match) => [match[2].toLowerCase(), match[3], match[1]]);

    expect(alteredPolicies).toEqual(POLICY_TARGETS);
  });

  it('T-MMM-RLS-1959-002 uses only the qualified private organisation helper', () => {
    const migration = loadAlignmentMigration();

    expect(
      migration.match(/app_private\.mmm_current_user_org_id\(\)/g),
    ).toHaveLength(10);
    expect(migration).not.toMatch(/public\.mmm_current_user_org_id\(\)/);
    expect(migration).not.toMatch(
      /(^|[^.\w])mmm_current_user_org_id\(\)/m,
    );
  });

  it('T-MMM-RLS-1959-003 preserves the helper and privilege boundary', () => {
    const migration = loadAlignmentMigration();

    expect(migration).not.toMatch(
      /\b(?:GRANT|REVOKE|CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION|ALTER\s+FUNCTION)\b/i,
    );
    expect(migration).not.toMatch(/\b(?:anon|service_role)\b/i);
  });

  it('T-MMM-RLS-1959-004 is deterministically idempotent', () => {
    const migration = loadAlignmentMigration();

    expect(migration).not.toMatch(/\bDROP\s+POLICY\b/i);
    expect(migration).not.toMatch(/\bCREATE\s+POLICY\b/i);
    expect(migration.match(/\bALTER\s+POLICY\b/gi)).toHaveLength(7);
  });
});
