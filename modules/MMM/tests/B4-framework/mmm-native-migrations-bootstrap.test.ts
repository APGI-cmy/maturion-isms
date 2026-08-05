import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../../../..');
const MIGRATIONS = resolve(ROOT, 'supabase/migrations');

// The hardening migration that conditionally references the table — must exist before the bootstrap
const HARDENING_MIGRATION = '20260530000002_mmm_security_advisor_hardening.sql';

type Migration = { filename: string; sql: string };

function sourceMigrations(): Migration[] {
  return readdirSync(MIGRATIONS)
    .filter((filename) => filename.endsWith('.sql'))
    .sort()
    .map((filename) => ({ filename, sql: readFileSync(resolve(MIGRATIONS, filename), 'utf8') }));
}

describe('Issue #1990 mmm_native_migrations source bootstrap — QA-to-RED', () => {
  it('supplies exactly one ordered source bootstrap for public.mmm_native_migrations before the hardening migration references it', () => {
    const migrations = sourceMigrations();
    const bootstrap = migrations.find(({ sql }) =>
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.mmm_native_migrations\b/i.test(sql),
    );
    expect(bootstrap, 'missing source bootstrap for public.mmm_native_migrations').toBeDefined();
    expect(
      bootstrap!.filename < HARDENING_MIGRATION,
      `bootstrap ${bootstrap?.filename} must precede hardening migration ${HARDENING_MIGRATION}`,
    ).toBe(true);
  });

  it('preserves the exact production contract: name PK and applied_at with default', () => {
    const migrations = sourceMigrations();
    const bootstrap = migrations.find(({ sql }) =>
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.mmm_native_migrations\b/i.test(sql),
    );
    expect(bootstrap, 'missing source bootstrap for public.mmm_native_migrations').toBeDefined();
    expect(bootstrap!.sql).toMatch(/name\s+text\s+(?:not\s+null\s+)?primary\s+key/i);
    expect(bootstrap!.sql).toMatch(/applied_at\s+timestamptz\s+not\s+null\s+default\s+now\(\)/i);
  });

  it('enables RLS and does not add any policies, triggers, foreign keys, or client-role grants', () => {
    const migrations = sourceMigrations();
    const bootstrap = migrations.find(({ sql }) =>
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.mmm_native_migrations\b/i.test(sql),
    );
    expect(bootstrap, 'missing source bootstrap for public.mmm_native_migrations').toBeDefined();
    expect(bootstrap!.sql).toMatch(
      /alter\s+table\s+(?:public\.)?mmm_native_migrations\s+enable\s+row\s+level\s+security/i,
    );
    // No policies may be created in the bootstrap
    expect(bootstrap!.sql).not.toMatch(/create\s+policy/i);
    // No triggers
    expect(bootstrap!.sql).not.toMatch(/create\s+(?:or\s+replace\s+)?trigger/i);
    // No foreign keys beyond the table itself
    expect(bootstrap!.sql).not.toMatch(/references\s+public\./i);
    // No anon/authenticated grants
    expect(bootstrap!.sql).not.toMatch(/grant\s+[\s\S]{0,80}(anon|authenticated)/i);
  });

  it('does not pre-populate the 17 production ledger rows', () => {
    const migrations = sourceMigrations();
    const bootstrap = migrations.find(({ sql }) =>
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.mmm_native_migrations\b/i.test(sql),
    );
    expect(bootstrap, 'missing source bootstrap for public.mmm_native_migrations').toBeDefined();
    expect(bootstrap!.sql).not.toMatch(/insert\s+into\s+(?:public\.)?mmm_native_migrations/i);
  });

  it('does not modify the deployment workflow or any existing migration body', () => {
    // Verify the bootstrap is self-contained: it must not touch other migrations or workflow files
    const migrations = sourceMigrations();
    const bootstrap = migrations.find(({ sql }) =>
      /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.mmm_native_migrations\b/i.test(sql),
    );
    expect(bootstrap, 'missing source bootstrap for public.mmm_native_migrations').toBeDefined();
    // Should not reference other migration filenames (no bulk-import of ledger content)
    expect(bootstrap!.sql).not.toMatch(/20260[0-9]{9}_mmm_/i);
  });
});
