import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../../../..');
const MIGRATIONS = resolve(ROOT, 'supabase/migrations');
const WORKFLOWS = resolve(ROOT, '.github/workflows');

// The hardening migration that conditionally references the table — must exist before the bootstrap
const HARDENING_MIGRATION = '20260530000002_mmm_security_advisor_hardening.sql';

// The base commit before this PR's changes — used to identify pre-existing files
const PR_BASE_SHA = '9c464c14931d40deb980a388be7e27ca3097c958';

const CREATE_TABLE_RE = /create\s+table(?:\s+if\s+not\s+exists)?\s+public\.mmm_native_migrations\b/i;

type Migration = { filename: string; sql: string };

function sourceMigrations(): Migration[] {
  return readdirSync(MIGRATIONS)
    .filter((filename) => filename.endsWith('.sql'))
    .sort()
    .map((filename) => ({ filename, sql: readFileSync(resolve(MIGRATIONS, filename), 'utf8') }));
}

/** Returns the repo-relative file paths that existed under a directory at the given git ref. */
function filesAtRef(ref: string, pathPrefix: string): string[] {
  try {
    const output = execSync(`git ls-tree --name-only "${ref}" "${pathPrefix}/"`, {
      cwd: ROOT,
      encoding: 'utf8',
    });
    return output.split('\n').map((l) => l.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

/** Returns the content of a file at the given git ref, or null if absent. */
function fileContentAtRef(ref: string, repoRelativePath: string): string | null {
  try {
    return execSync(`git show "${ref}:${repoRelativePath}"`, {
      cwd: ROOT,
      encoding: 'utf8',
    });
  } catch {
    return null;
  }
}

describe('Issue #1990 mmm_native_migrations source bootstrap — QA-to-RED', () => {
  it('supplies exactly one ordered source bootstrap for public.mmm_native_migrations before the hardening migration references it', () => {
    const migrations = sourceMigrations();
    const bootstraps = migrations.filter(({ sql }) => CREATE_TABLE_RE.test(sql));
    expect(
      bootstraps.length,
      `expected exactly 1 bootstrap for public.mmm_native_migrations, found ${bootstraps.length}`,
    ).toBe(1);
    const [bootstrap] = bootstraps;
    expect(
      bootstrap.filename < HARDENING_MIGRATION,
      `bootstrap ${bootstrap.filename} must precede hardening migration ${HARDENING_MIGRATION}`,
    ).toBe(true);
  });

  it('preserves the exact production contract: name PK and applied_at with default', () => {
    const migrations = sourceMigrations();
    const bootstraps = migrations.filter(({ sql }) => CREATE_TABLE_RE.test(sql));
    expect(bootstraps.length, 'missing source bootstrap for public.mmm_native_migrations').toBe(1);
    const [bootstrap] = bootstraps;
    expect(bootstrap.sql).toMatch(/name\s+text\s+(?:not\s+null\s+)?primary\s+key/i);
    expect(bootstrap.sql).toMatch(/applied_at\s+timestamptz\s+not\s+null\s+default\s+now\(\)/i);
  });

  it('enables RLS and does not add any policies, triggers, foreign keys, or client-role grants', () => {
    const migrations = sourceMigrations();
    const bootstraps = migrations.filter(({ sql }) => CREATE_TABLE_RE.test(sql));
    expect(bootstraps.length, 'missing source bootstrap for public.mmm_native_migrations').toBe(1);
    const [bootstrap] = bootstraps;
    expect(bootstrap.sql).toMatch(
      /alter\s+table\s+(?:public\.)?mmm_native_migrations\s+enable\s+row\s+level\s+security/i,
    );
    expect(bootstrap.sql).not.toMatch(/create\s+policy/i);
    expect(bootstrap.sql).not.toMatch(/create\s+(?:or\s+replace\s+)?trigger/i);
    expect(bootstrap.sql).not.toMatch(/references\s+public\./i);
    expect(bootstrap.sql).not.toMatch(/grant\s+[\s\S]{0,80}(anon|authenticated)/i);
  });

  it('does not pre-populate the 17 production ledger rows', () => {
    const migrations = sourceMigrations();
    const bootstraps = migrations.filter(({ sql }) => CREATE_TABLE_RE.test(sql));
    expect(bootstraps.length, 'missing source bootstrap for public.mmm_native_migrations').toBe(1);
    const [bootstrap] = bootstraps;
    expect(bootstrap.sql).not.toMatch(/insert\s+into\s+(?:public\.)?mmm_native_migrations/i);
  });

  it('does not modify any pre-existing migration body or deployment workflow file', () => {
    // Collect pre-existing migration file paths (repo-relative) from git at the base commit.
    // Only assert files that still exist at the same path — files that were removed or renamed
    // as part of the authorised identity reconciliation are intentionally absent and are skipped.
    const preExistingMigrationPaths = filesAtRef(PR_BASE_SHA, 'supabase/migrations');
    for (const repoPath of preExistingMigrationPaths) {
      if (!repoPath.endsWith('.sql')) continue;
      const absolutePath = resolve(ROOT, repoPath);
      if (!existsSync(absolutePath)) continue; // intentionally renamed/removed by identity reconciliation
      const baseContent = fileContentAtRef(PR_BASE_SHA, repoPath);
      if (baseContent === null) continue;
      const currentContent = readFileSync(absolutePath, 'utf8');
      expect(
        currentContent,
        `pre-existing migration body must not be modified by this recovery lane: ${repoPath}`,
      ).toBe(baseContent);
    }

    // Collect pre-existing workflow file paths (repo-relative) from git at the base commit.
    const preExistingWorkflowPaths = filesAtRef(PR_BASE_SHA, '.github/workflows');
    for (const repoPath of preExistingWorkflowPaths) {
      const absolutePath = resolve(ROOT, repoPath);
      if (!existsSync(absolutePath)) continue;
      const baseContent = fileContentAtRef(PR_BASE_SHA, repoPath);
      if (baseContent === null) continue;
      const currentContent = readFileSync(absolutePath, 'utf8');
      expect(
        currentContent,
        `deployment workflow must not be modified by this recovery lane: ${repoPath}`,
      ).toBe(baseContent);
    }
  });
});
