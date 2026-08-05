import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../../../..');
const MIGRATIONS = resolve(ROOT, 'supabase/migrations');
const CRITERIA_BOOTSTRAP = '20260729120338_criteria_foundational_bootstrap.sql';
const CASCADE_TRIGGERS = '20260729130000_exclusion_cascade_triggers.sql';

type Migration = { filename: string; sql: string };

function sourceMigrations(): Migration[] {
  return readdirSync(MIGRATIONS)
    .filter((filename) => filename.endsWith('.sql'))
    .sort()
    .map((filename) => ({ filename, sql: readFileSync(resolve(MIGRATIONS, filename), 'utf8') }));
}

function bootstrap(table: string): Migration | undefined {
  return sourceMigrations().find(({ sql }) => new RegExp(
    `create\\s+table(?:\\s+if\\s+not\\s+exists)?\\s+public\\.${table}\\b`,
    'i',
  ).test(sql));
}

function assertBeforeCriteria(migration: Migration | undefined, table: string): asserts migration is Migration {
  expect(migration, `missing source bootstrap for public.${table}`).toBeDefined();
  expect(migration!.filename < CRITERIA_BOOTSTRAP).toBe(true);
}

function allSqlForTable(table: string): string {
  return sourceMigrations()
    .map(({ sql }) => sql)
    .join('\n');
}

describe('Issue #1990 legacy audit-model prerequisites — refreshed QA-to-RED', () => {
  it('reconstructs the ordered audits root contract before criteria', () => {
    const audits = bootstrap('audits');
    assertBeforeCriteria(audits, 'audits');
    expect(audits.sql).toMatch(/organisation_id\s+uuid\s+not\s+null\s+references\s+public\.organisations\s*\(\s*id\s*\)\s+on\s+delete\s+cascade/i);
    expect(audits.sql).toMatch(/status\s+text\s+not\s+null\s+default\s+'draft'/i);
    expect(audits.sql).toMatch(/organisation_name\s+varchar\s*\(\s*255\s*\)\s+not\s+null/i);
    expect(audits.sql).toMatch(/criteria_approved\s+boolean\s+not\s+null\s+default\s+false/i);
    expect(audits.sql).toMatch(/alter\s+table\s+public\.audits\s+enable\s+row\s+level\s+security/i);
  });

  it('reconstructs the ordered domains contract and its production isolation/cascade posture', () => {
    const domains = bootstrap('domains');
    assertBeforeCriteria(domains, 'domains');
    expect(domains.sql).toMatch(/audit_id\s+uuid\s+not\s+null\s+references\s+public\.audits\s*\(\s*id\s*\)\s+on\s+delete\s+cascade/i);
    expect(domains.sql).toMatch(/organisation_id\s+uuid\s+not\s+null\s+references\s+public\.organisations\s*\(\s*id\s*\)\s+on\s+delete\s+cascade/i);
    expect(domains.sql).toMatch(/unique\s*\(\s*audit_id\s*,\s*number\s*\)/i);
    expect(domains.sql).toMatch(/excluded\s+boolean\s+not\s+null\s+default\s+false/i);
    expect(domains.sql).toMatch(/sort_order\s+integer\s+not\s+null\s+default\s+0/i);
    expect(domains.sql).toMatch(/alter\s+table\s+public\.domains\s+enable\s+row\s+level\s+security/i);
    expect(domains.sql).toMatch(/create\s+policy\s+domains_select_org_isolation[\s\S]{0,800}for\s+select[\s\S]{0,120}to\s+authenticated/i);
  });

  it('reconstructs the ordered MPS contract and preserves its read-only authenticated posture', () => {
    const mps = bootstrap('mini_performance_standards');
    assertBeforeCriteria(mps, 'mini_performance_standards');
    expect(mps.sql).toMatch(/domain_id\s+uuid\s+not\s+null\s+references\s+public\.domains\s*\(\s*id\s*\)\s+on\s+delete\s+cascade/i);
    expect(mps.sql).toMatch(/audit_id\s+uuid\s+not\s+null\s+references\s+public\.audits\s*\(\s*id\s*\)\s+on\s+delete\s+cascade/i);
    expect(mps.sql).toMatch(/organisation_id\s+uuid\s+not\s+null\s+references\s+public\.organisations\s*\(\s*id\s*\)\s+on\s+delete\s+cascade/i);
    expect(mps.sql).toMatch(/intent_statement\s+text/i);
    expect(mps.sql).toMatch(/guidance\s+text/i);
    expect(mps.sql).toMatch(/alter\s+table\s+public\.mini_performance_standards\s+enable\s+row\s+level\s+security/i);
    expect(mps.sql).toMatch(/create\s+policy\s+mini_performance_standards_select_org_isolation[\s\S]{0,800}for\s+select[\s\S]{0,120}to\s+public/i);
    expect(mps.sql).not.toMatch(/create\s+policy\s+mini_performance_standards_(?:insert|update|delete)/i);
  });

  it('restores the proven exclusion-cascade triggers only after criteria exists', () => {
    const migrations = sourceMigrations();
    const cascade = migrations.find(({ sql }) => /create\s+trigger\s+exclude_cascade_domains_trigger/i.test(sql));
    expect(cascade, 'missing production-equivalent exclusion cascade recovery').toBeDefined();
    expect(cascade!.filename > CRITERIA_BOOTSTRAP).toBe(true);
    expect(cascade!.sql).toMatch(/create\s+trigger\s+exclude_cascade_domains_trigger[\s\S]{0,320}after\s+update\s+of\s+excluded\s+on\s+public\.domains/i);
    expect(cascade!.sql).toMatch(/create\s+trigger\s+exclude_cascade_mps_trigger[\s\S]{0,320}after\s+update\s+of\s+excluded\s+on\s+public\.mini_performance_standards/i);
  });

  it('applies production-parity corrections to audits: period columns, varchar facility_location, no organisation_name default', () => {
    const migrations = sourceMigrations();
    const corrections = migrations.find(({ sql }) =>
      /alter\s+table\s+public\.audits[\s\S]{0,120}audit_period_start/i.test(sql),
    );
    expect(corrections, 'missing production-parity corrections migration for public.audits').toBeDefined();
    expect(corrections!.filename > CASCADE_TRIGGERS).toBe(true);
    expect(corrections!.sql).toMatch(/audit_period_start\s+date/i);
    expect(corrections!.sql).toMatch(/audit_period_end\s+date/i);
    expect(corrections!.sql).toMatch(/facility_location\s+type\s+varchar/i);
    expect(corrections!.sql).toMatch(/organisation_name\s+drop\s+default/i);
  });

  it('applies production-parity corrections to audits: insert and all org-isolation policies', () => {
    const migrations = sourceMigrations();
    const allSql = migrations.map(({ sql }) => sql).join('\n');
    expect(allSql).toMatch(/create\s+policy\s+audits_insert_authenticated[\s\S]{0,400}for\s+insert[\s\S]{0,200}created_by\s*=\s*auth\.uid\(\)/i);
    expect(allSql).toMatch(/create\s+policy\s+audits_org_isolation[\s\S]{0,400}for\s+all[\s\S]{0,400}organisation_id\s+in/i);
  });

  it('applies production-parity corrections to domains: delete policy TO public', () => {
    const migrations = sourceMigrations();
    const allSql = migrations.map(({ sql }) => sql).join('\n');
    expect(allSql).toMatch(/create\s+policy\s+domains_delete_org_isolation[\s\S]{0,400}for\s+delete[\s\S]{0,120}to\s+public/i);
  });

  it('sets production-equivalent search path on cascade_exclude_to_children function', () => {
    const migrations = sourceMigrations();
    const allSql = migrations.map(({ sql }) => sql).join('\n');
    expect(allSql).toMatch(/set\s+search_path\s*=\s*public\s*,\s*auth\s*,\s*storage\s*,\s*extensions\s*,\s*pg_temp/i);
  });
});
