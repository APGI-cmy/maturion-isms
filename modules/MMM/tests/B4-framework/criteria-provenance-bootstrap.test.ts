import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../../../..');
const MIGRATIONS = resolve(ROOT, 'supabase/migrations');

type Migration = { filename: string; sql: string };

function sourceMigrations(): Migration[] {
  return readdirSync(MIGRATIONS)
    .filter((filename) => filename.endsWith('.sql'))
    .sort()
    .map((filename) => ({ filename, sql: readFileSync(resolve(MIGRATIONS, filename), 'utf8') }));
}

function matchingMigrations(pattern: RegExp): Migration[] {
  return sourceMigrations().filter(({ sql }) => pattern.test(sql));
}

function criteriaBootstrap(): Migration | undefined {
  return matchingMigrations(/create\s+table(?:\s+if\s+not\s+exists)?\s+public\.criteria\b/i)[0];
}

function firstDefinition(pattern: RegExp): Migration | undefined {
  return matchingMigrations(pattern)[0];
}

describe('Issue #1990 public.criteria provenance — refreshed QA-to-RED', () => {
  it('supplies exactly one ordered criteria bootstrap after every proven direct prerequisite', () => {
    const candidates = matchingMigrations(/create\s+table(?:\s+if\s+not\s+exists)?\s+public\.criteria\b/i);
    expect(candidates).toHaveLength(1);

    const criteria = candidates[0];
    expect(criteria.filename).toMatch(/^\d{14}_criteria_foundational_bootstrap\.sql$/);

    const prerequisites = [
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.organisations\b/i,
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.audits\b/i,
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.domains\b/i,
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.mini_performance_standards\b/i,
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.profiles\b/i,
    ];

    for (const prerequisite of prerequisites) {
      const migration = firstDefinition(prerequisite);
      expect(migration, `missing direct prerequisite for public.criteria: ${prerequisite}`).toBeDefined();
      expect(migration!.filename < criteria.filename).toBe(true);
    }
  });

  it('preserves every production column, nullable field, and default', () => {
    const sql = criteriaBootstrap()?.sql ?? '';

    for (const required of [
      /\bid\s+uuid\s+primary\s+key\s+default\s+gen_random_uuid\s*\(\s*\)/i,
      /\bmps_id\s+uuid\s+not\s+null/i,
      /\bdomain_id\s+uuid\s+not\s+null/i,
      /\baudit_id\s+uuid\s+not\s+null/i,
      /\borganisation_id\s+uuid\s+not\s+null/i,
      /\bnumber\s+text\s+not\s+null/i,
      /\bdescription\s+text\b/i,
      /\bguidance\s+text\b/i,
      /\bcreated_at\s+timestamptz\s+not\s+null\s+default\s+now\s*\(\s*\)/i,
      /\bupdated_at\s+timestamptz\s+not\s+null\s+default\s+now\s*\(\s*\)/i,
      /\bexcluded\s+boolean\s+not\s+null\s+default\s+false/i,
      /\bsort_order\s+integer\s+not\s+null\s+default\s+0/i,
      /\btitle\s+text\b/i,
      /\bsource_anchor\s+text\b/i,
      /\bintent_statement\s+text\b/i,
    ]) expect(sql).toMatch(required);
  });

  it('preserves the four cascade foreign keys and audit-number uniqueness', () => {
    const sql = criteriaBootstrap()?.sql ?? '';

    for (const parent of ['mini_performance_standards', 'domains', 'audits', 'organisations']) {
      expect(sql).toMatch(new RegExp(`references\\s+public\\.${parent}\\s*\\(\\s*id\\s*\\)\\s+on\\s+delete\\s+cascade`, 'i'));
    }

    expect(sql).toMatch(/unique\s*\(\s*audit_id\s*,\s*number\s*\)/i);
  });

  it('enables RLS and recreates the exact three organisation-isolation policy forms', () => {
    const sql = criteriaBootstrap()?.sql ?? '';

    expect(sql).toMatch(/alter\s+table\s+public\.criteria\s+enable\s+row\s+level\s+security/i);

    expect(sql).toMatch(/create\s+policy\s+criteria_select_org_isolation[\s\S]{0,400}for\s+select[\s\S]{0,160}to\s+authenticated[\s\S]{0,500}profiles[\s\S]{0,500}auth\.uid\s*\(\s*\)/i);
    expect(sql).toMatch(/create\s+policy\s+criteria_insert_org_isolation[\s\S]{0,400}for\s+insert[\s\S]{0,160}to\s+public[\s\S]{0,500}profiles[\s\S]{0,500}auth\.uid\s*\(\s*\)/i);
    expect(sql).toMatch(/create\s+policy\s+criteria_update_org_isolation[\s\S]{0,400}for\s+update[\s\S]{0,160}to\s+public[\s\S]{0,700}using[\s\S]{0,700}with\s+check/i);
  });

  it('does not silently combine criteria recovery with the separate native-migration ledger', () => {
    const sql = criteriaBootstrap()?.sql ?? '';
    expect(sql).not.toMatch(/mmm_native_migrations/i);
  });
});