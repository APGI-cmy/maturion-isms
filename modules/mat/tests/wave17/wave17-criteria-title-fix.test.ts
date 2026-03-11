/**
 * Wave AI Criteria Creation Fix — Schema & Edge Function RED Gate Tests
 * Test ID Suite: T-W17-CP-001 through T-W17-CP-005
 *
 * Wave    : wave-ai-criteria-creation-fix
 * Branch  : copilot/fix-ai-criteria-creation-failure
 * Task ID : T-W17-QA-001
 * Session : session-qa-wave-ai-criteria-creation-fix-20260311
 * Producing Agent: qa-builder
 *
 * ROOT CAUSE (documented in IAA Pre-Brief):
 *   1. PRIMARY — criteria DDL missing `title TEXT` column:
 *      apps/maturion-maturity-legacy/supabase/migrations/20260302000000_mat_core_tables.sql
 *      Edge Function (line 318) inserts `title: c.title ?? null` — column doesn't exist
 *      → PostgreSQL error: "column 'title' of relation 'criteria' does not exist"
 *      → criteria never inserted → parse_failed
 *
 *   2. SECONDARY — `description TEXT NOT NULL` in criteria DDL, but Edge Function sends
 *      `c.description ?? null` — null description would cause NOT NULL violation.
 *
 * RED STATE (expected BEFORE schema-builder applies the migration):
 *   T-W17-CP-001 — FAIL: criteria DDL has no `title` column
 *   T-W17-CP-002 — FAIL: criteria DDL has `description TEXT NOT NULL` (must be nullable)
 *   T-W17-CP-003 — PASS: Edge Function already sends `title:` in upsert payload
 *   T-W17-CP-004 — FAIL: new migration file doesn't exist yet
 *   T-W17-CP-005 — FAIL: migration file doesn't exist (content check fails)
 *
 * GREEN STATE (after schema-builder creates the migration):
 *   All 5 tests PASS — migration exists, DDL has title column, description nullable.
 *
 * All tests are FILE-BASED (read actual source/migration files, no live DB required).
 * Authority: foreman-v2-agent delegation T-W17-QA-001
 * IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-wave-ai-criteria-creation-fix.md
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Path constants ────────────────────────────────────────────────────────────

/**
 * Core DDL migration file that defines the criteria table.
 * This is the authoritative schema source per A-032 (Schema Column Compliance).
 */
const CORE_MIGRATION_PATH = path.resolve(
  process.cwd(),
  'apps/maturion-maturity-legacy/supabase/migrations/20260302000000_mat_core_tables.sql',
);

/**
 * Edge Function that upserts criteria rows after AI parsing.
 * Line 318: `title: c.title ?? null` — fails if criteria table has no title column.
 */
const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

/**
 * Expected path of the new migration that fixes the criteria table schema.
 * schema-builder must create this file to turn T-W17-CP-004 and T-W17-CP-005 GREEN.
 *
 * The glob pattern below checks for any migration file whose name matches
 * *_criteria_add_title_column.sql under the same migrations directory,
 * accommodating minor timestamp variation while anchoring to the canonical suffix.
 */
const MIGRATIONS_DIR = path.resolve(
  process.cwd(),
  'apps/maturion-maturity-legacy/supabase/migrations',
);
const EXPECTED_MIGRATION_SUFFIX = '_criteria_add_title_column.sql';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Read the core DDL migration file. Fails with a descriptive assertion if absent. */
function readCoreMigration(): string {
  const exists = fs.existsSync(CORE_MIGRATION_PATH);
  expect(
    exists,
    `[INVARIANT] Core DDL migration must exist: ${CORE_MIGRATION_PATH}\n` +
    'This file defines the criteria table schema. If it is missing, the project is broken.',
  ).toBe(true);
  return fs.readFileSync(CORE_MIGRATION_PATH, 'utf-8');
}

/** Read the Edge Function source. Fails with a descriptive assertion if absent. */
function readEdgeFunction(): string {
  const exists = fs.existsSync(EDGE_FN_PATH);
  expect(
    exists,
    `[INVARIANT] Edge Function must exist: ${EDGE_FN_PATH}\n` +
    'This file is the AI parsing pipeline entry point.',
  ).toBe(true);
  return fs.readFileSync(EDGE_FN_PATH, 'utf-8');
}

/**
 * Locate the title-fix migration file by matching the canonical suffix.
 * Returns the full path if found, or null if not found.
 */
function findTitleFixMigration(): string | null {
  if (!fs.existsSync(MIGRATIONS_DIR)) return null;
  const files = fs.readdirSync(MIGRATIONS_DIR);
  const match = files.find((f) => f.endsWith(EXPECTED_MIGRATION_SUFFIX));
  return match ? path.join(MIGRATIONS_DIR, match) : null;
}

// ══════════════════════════════════════════════════════════════════════════════
// Test Suite
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave AI Criteria Creation Fix — Schema & Edge Function Gate (T-W17-CP-001 to T-W17-CP-005)', () => {

  // ── T-W17-CP-001 — criteria DDL must include `title TEXT` column (nullable) ──

  it('[T-W17-CP-001] criteria table DDL must include `title TEXT` column (nullable)', () => {
    /*
     * RED STATE:  The criteria CREATE TABLE block in 20260302000000_mat_core_tables.sql
     *             has NO `title` column at all. The Edge Function inserts
     *             `title: c.title ?? null` on every upsert → PostgreSQL rejects it →
     *             all criteria creation fails silently (parse_failed).
     *
     * GREEN STATE: After schema-builder creates the fix migration, the criteria table
     *              DDL (or an ALTER TABLE migration) includes `title TEXT` or `title text`
     *              without NOT NULL — nullable to match the `?? null` in the Edge Function.
     *
     * A-032 compliance: IAA will cross-check every INSERT column in the Edge Function
     * against the DDL. `title` must appear in the schema for A-032 to PASS.
     *
     * Note: This test checks EITHER the core DDL OR any migration that adds the column,
     * making it forward-compatible with the ALTER TABLE approach.
     */
    const coreDdl = readCoreMigration();

    // Extract only the criteria CREATE TABLE block to avoid false matches from other tables
    // (e.g. the `audits` table has `title TEXT NOT NULL` at line 31 — that must not satisfy this check)
    const criteriaTableMatch = coreDdl.match(
      /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?criteria\s*\([^;]+\);/is,
    );
    const criteriaBlock = criteriaTableMatch ? criteriaTableMatch[0] : '';

    // Check the criteria DDL block (NOT the whole file) for a `title` column
    const hasTitleInCoreDdl = /\btitle\s+text\b/i.test(criteriaBlock);

    // Check any fix migration for an ADD COLUMN ... title
    const fixMigrationPath = findTitleFixMigration();
    const hasTitleInFixMigration =
      fixMigrationPath !== null &&
      /ADD\s+COLUMN(?:\s+IF\s+NOT\s+EXISTS)?\s+title\s+text/i.test(
        fs.readFileSync(fixMigrationPath, 'utf-8'),
      );

    const titleColumnProvided = hasTitleInCoreDdl || hasTitleInFixMigration;

    expect(
      titleColumnProvided,
      '[T-W17-CP-001] FAIL — criteria table has no `title TEXT` column.\n' +
      '\n' +
      'Root cause: Edge Function line 318 inserts `title: c.title ?? null` but the\n' +
      'criteria CREATE TABLE DDL in 20260302000000_mat_core_tables.sql does not define\n' +
      'a `title` column. PostgreSQL rejects the INSERT with:\n' +
      '  "column \'title\' of relation \'criteria\' does not exist"\n' +
      '\n' +
      'Note: The `audits` table has a `title TEXT NOT NULL` column — this check is\n' +
      'scoped to the criteria CREATE TABLE block ONLY and must not be satisfied by other tables.\n' +
      '\n' +
      'Fix required (schema-builder):\n' +
      `  Create migration: ${MIGRATIONS_DIR}/<timestamp>_criteria_add_title_column.sql\n` +
      '  Content must include: ADD COLUMN IF NOT EXISTS title TEXT  (nullable — no NOT NULL)\n' +
      '\n' +
      `Checked criteria DDL block: ${criteriaBlock ? '(found)' : '(criteria block NOT found in DDL)'}\n` +
      `Checked core DDL           : ${CORE_MIGRATION_PATH}\n` +
      `Fix migration found        : ${fixMigrationPath ?? 'NOT FOUND'}\n`,
    ).toBe(true);
  });

  // ── T-W17-CP-002 — criteria DDL must allow nullable description ─────────────

  it('[T-W17-CP-002] criteria table DDL must NOT have `description TEXT NOT NULL`', () => {
    /*
     * RED STATE:  The core DDL has `description TEXT NOT NULL` for the criteria table.
     *             The Edge Function upserts `description: c.description ?? null` — when
     *             description is absent from the parsed output, `null` is sent, violating
     *             the NOT NULL constraint → PostgreSQL rejects the INSERT.
     *
     * GREEN STATE: After the fix migration runs, `description` is nullable (either the
     *              core DDL is updated, OR an ALTER COLUMN ... DROP NOT NULL migration
     *              exists), so `null` values are accepted.
     *
     * Note: This test checks EITHER that the core DDL no longer declares description NOT NULL
     * for the criteria table, OR that a migration exists which drops the NOT NULL constraint.
     */
    const coreDdl = readCoreMigration();

    // Extract only the criteria CREATE TABLE block to avoid false matches from other tables
    // We look for the block starting at CREATE TABLE.*criteria and ending at the closing );
    const criteriaTableMatch = coreDdl.match(
      /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?criteria\s*\([^;]+\);/is,
    );
    const criteriaBlock = criteriaTableMatch ? criteriaTableMatch[0] : coreDdl;

    // Check if description is still NOT NULL in the criteria block
    const hasDescriptionNotNull = /\bdescription\s+TEXT\s+NOT\s+NULL\b/i.test(criteriaBlock);

    // Check if a fix migration drops the NOT NULL constraint
    const fixMigrationPath = findTitleFixMigration();
    const fixDropsNotNull =
      fixMigrationPath !== null &&
      /ALTER\s+COLUMN\s+description\s+DROP\s+NOT\s+NULL/i.test(
        fs.readFileSync(fixMigrationPath, 'utf-8'),
      );

    const descriptionIsNullable = !hasDescriptionNotNull || fixDropsNotNull;

    expect(
      descriptionIsNullable,
      '[T-W17-CP-002] FAIL — criteria table `description` column is NOT NULL but Edge\n' +
      'Function sends `c.description ?? null`, which will cause a NOT NULL violation\n' +
      'when description is absent from the AI-parsed output.\n' +
      '\n' +
      'Fix required (schema-builder):\n' +
      `  In the fix migration (${MIGRATIONS_DIR}/<timestamp>_criteria_add_title_column.sql)\n` +
      '  add: ALTER TABLE public.criteria ALTER COLUMN description DROP NOT NULL;\n' +
      '\n' +
      `Checked core DDL        : ${CORE_MIGRATION_PATH}\n` +
      `Fix migration found     : ${fixMigrationPath ?? 'NOT FOUND'}\n` +
      `description NOT NULL    : ${hasDescriptionNotNull}\n` +
      `fix drops NOT NULL      : ${fixDropsNotNull}\n`,
    ).toBe(true);
  });

  // ── T-W17-CP-003 — Edge Function criteria upsert includes title field ────────

  it('[T-W17-CP-003] Edge Function criteria upsert payload includes `title:` field', () => {
    /*
     * EXPECTED TO PASS IN CURRENT STATE:
     *   The Edge Function already contains `title: c.title ?? null` at line 318.
     *   This test confirms the code-side is correct — only the schema side needs fixing.
     *   If this test becomes RED, it means someone accidentally removed `title` from
     *   the Edge Function upsert payload (regression guard).
     *
     * GREEN STATE: Always GREEN — Edge Function has `title:` in the criteria insert/upsert.
     *
     * A-032 compliance: confirms that `title` is present in the Edge Function INSERT
     * payload so that once the schema column is added, the pipeline will work.
     */
    const src = readEdgeFunction();

    expect(
      src,
      '[T-W17-CP-003] FAIL — Edge Function does not include `title:` in the criteria\n' +
      'upsert payload. This is a regression: the field must be present to populate\n' +
      'the title column once it is added to the schema.\n' +
      '\n' +
      `Edge Function path: ${EDGE_FN_PATH}\n` +
      'Expected to find:   title: c.title ?? null  (or similar) in the criteria upsert.',
    ).toMatch(/\btitle\s*:/);
  });

  // ── T-W17-CP-004 — New migration file exists for criteria title fix ──────────

  it('[T-W17-CP-004] Fix migration file exists for criteria title column', () => {
    /*
     * RED STATE:  No migration file matching *_criteria_add_title_column.sql exists in
     *             apps/maturion-maturity-legacy/supabase/migrations/.
     *             schema-builder must create this file to turn this test GREEN.
     *
     * GREEN STATE: A migration file whose name ends with `_criteria_add_title_column.sql`
     *              exists in the migrations directory.
     *
     * Naming pattern: <timestamp>_criteria_add_title_column.sql
     * Example        : 20260311000001_criteria_add_title_column.sql
     *
     * The exact timestamp prefix is flexible (schema-builder chooses it) but the
     * canonical suffix `_criteria_add_title_column.sql` is required for
     * deterministic discovery by T-W17-CP-005.
     */
    const fixMigrationPath = findTitleFixMigration();

    expect(
      fixMigrationPath,
      '[T-W17-CP-004] FAIL — Fix migration file NOT FOUND.\n' +
      '\n' +
      'Fix required (schema-builder):\n' +
      `  Create file: ${MIGRATIONS_DIR}/<timestamp>_criteria_add_title_column.sql\n` +
      '  The file name MUST end with `_criteria_add_title_column.sql`.\n' +
      '\n' +
      `Searched directory: ${MIGRATIONS_DIR}\n` +
      `Required suffix   : ${EXPECTED_MIGRATION_SUFFIX}\n` +
      'Existing files    : ' +
        (fs.existsSync(MIGRATIONS_DIR)
          ? fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.includes('criteria')).join(', ') || '(none)'
          : '(migrations dir not found)'),
    ).not.toBeNull();
  });

  // ── T-W17-CP-005 — Migration file adds title column with IF NOT EXISTS guard ─

  it('[T-W17-CP-005] Fix migration adds `title` column with ADD COLUMN IF NOT EXISTS guard', () => {
    /*
     * RED STATE:  Migration file doesn't exist (T-W17-CP-004 fails first), so content
     *             check also fails. Even if the file is created without the proper content,
     *             this test catches that.
     *
     * GREEN STATE: The fix migration file exists AND contains:
     *   1. `ADD COLUMN IF NOT EXISTS title` — idempotent title column addition
     *   2. Column type `TEXT` — nullable (no NOT NULL) to match `c.title ?? null`
     *
     * The IF NOT EXISTS guard is REQUIRED for idempotent migration execution.
     * Without it, re-running migrations on a database that already has the column
     * will throw "column already exists" and abort the migration.
     *
     * Example content (minimum required):
     *   ALTER TABLE public.criteria ADD COLUMN IF NOT EXISTS title TEXT;
     *   ALTER TABLE public.criteria ALTER COLUMN description DROP NOT NULL;
     */
    const fixMigrationPath = findTitleFixMigration();

    // First assert the file exists — mirrors T-W17-CP-004 but as a pre-condition here
    expect(
      fixMigrationPath,
      '[T-W17-CP-005] FAIL (pre-condition) — Fix migration file does not exist.\n' +
      'T-W17-CP-004 must pass before T-W17-CP-005 can validate content.\n' +
      `Expected file matching *${EXPECTED_MIGRATION_SUFFIX} in ${MIGRATIONS_DIR}`,
    ).not.toBeNull();

    // If we reach here, file exists — read and assert content
    const content = fs.readFileSync(fixMigrationPath as string, 'utf-8');

    // Assert: ADD COLUMN IF NOT EXISTS title  (case-insensitive, spaces flexible)
    expect(
      content,
      '[T-W17-CP-005] FAIL — Fix migration does not contain required\n' +
      '  `ADD COLUMN IF NOT EXISTS title` clause.\n' +
      '\n' +
      'Required for idempotent migration execution — without IF NOT EXISTS, re-running\n' +
      'the migration on a DB that already has the column throws "column already exists".\n' +
      '\n' +
      'Required SQL pattern:\n' +
      '  ALTER TABLE public.criteria ADD COLUMN IF NOT EXISTS title TEXT;\n' +
      '\n' +
      `Migration file: ${fixMigrationPath}\n`,
    ).toMatch(/ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+title/i);

    // Assert: column type is TEXT (nullable — no NOT NULL after it)
    expect(
      content,
      '[T-W17-CP-005] FAIL — Fix migration `title` column must be type TEXT ' +
      'and nullable (no NOT NULL constraint). The Edge Function sends ' +
      '`c.title ?? null` so the column must accept NULL values.\n' +
      '\n' +
      `Migration file: ${fixMigrationPath}\n`,
    ).toMatch(/ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+title\s+TEXT(?!\s+NOT\s+NULL)/i);
  });
});
