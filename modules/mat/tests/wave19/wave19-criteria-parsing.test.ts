/**
 * Wave 19 — MAT Criteria Parsing Holistic Repair
 * RED Gate Test Suite: T-W19-001 through T-W19-015
 *
 * Wave    : Wave 19 — MAT Criteria Parsing Holistic Repair
 * Branch  : copilot/wave-19-holistic-mat-criteria-repair
 * Issue   : maturion-isms#1135 (wave-gov-mat-criteria-repair-1135)
 * Task ID : T-W19A-001 through T-W19A-012 (qa-builder Batch A)
 * Session : session-qa-wave19-criteria-parsing-repair
 * Producing Agent: qa-builder
 *
 * IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-wave19-criteria-parsing-repair.md
 * Plan: modules/mat/00-app-description/WAVE-19-PLAN-PROPOSAL.md
 * Gap Register: modules/mat/00-app-description/CRITERIA-PARSING-GAP-REGISTER.md
 *
 * ── Gap → Test ID Mapping ─────────────────────────────────────────────────────
 *   GAP-PARSE-001  criteria.number INTEGER cannot hold LDCS IDs like "1.4.1"
 *     → T-W19-002: criteria.number TEXT type assertion
 *     → T-W19-001: Edge Function uses c.number (not idx+1)
 *     → T-W19-015: criteria.number column accepts TEXT hierarchical format
 *
 *   GAP-PARSE-002  mini_performance_standards missing intent_statement/guidance columns
 *     → T-W19-003: MPS intent_statement column exists in DB migration
 *     → T-W19-004: Edge Function writes MPS intent_statement to DB
 *
 *   GAP-PARSE-003  No audit_logs parse events in production (0 rows confirmed)
 *     → T-W19-005: criteria_parsed only written when criteria_inserted > 0
 *     → T-W19-006: criteria_parse_failed includes reason field in details
 *
 *   GAP-PARSE-004  Zero-insert case declared success (no minimum-count assertion)
 *     → T-W19-007: zero-insert → criteria_parse_failed event
 *
 *   GAP-PARSE-005  DB write-back not transactional — partial data on failure
 *     → T-W19-008: parse_write_back_atomic RPC function exists in migrations
 *
 *   GAP-PARSE-006  AI_GATEWAY_URL not set → Edge Function silently skips AI parse
 *     → T-W19-010: Edge Function startup with AI_GATEWAY_URL='' → 500
 *
 *   GAP-PARSE-007  Legacy/new MAT schema alignment unverified in CI
 *     → T-W19-011: CI schema validation script exists
 *
 *   GAP-PARSE-008  MpsResult model missing intent_statement/guidance fields
 *     → T-W19-012: MpsResult Pydantic model has intent_statement field
 *
 *   GAP-PARSE-009  usePollCriteriaDocumentStatus polls forever (no timeout)
 *     → T-W19-013: poll timeout guard exists in usePollCriteriaDocumentStatus
 *
 *   GAP-PARSE-010  No E2E content assertion tests with real LDCS fixture
 *     → T-W19-014: LDCS test fixture file exists with known content
 *
 * ── RED STATE (BEFORE Wave 19 implementation) ─────────────────────────────────
 *   T-W19-001  FAIL  Edge Function uses `idx + 1` instead of `c.number`
 *   T-W19-002  FAIL  No migration changes criteria.number to TEXT
 *   T-W19-003  FAIL  No migration adds intent_statement to mini_performance_standards
 *   T-W19-004  FAIL  Edge Function MPS insert does not include intent_statement
 *   T-W19-005  FAIL  Edge Function writes criteria_parsed with criteria_inserted=0
 *   T-W19-006  FAIL  criteria_parse_failed details does not include reason field
 *   T-W19-007  FAIL  No zero-insert assertion before declaring success
 *   T-W19-008  FAIL  No parse_write_back_atomic RPC function in migrations
 *   T-W19-010  FAIL  Edge Function does not return 500 when AI_GATEWAY_URL is empty
 *   T-W19-011  FAIL  No CI script validates module hooks vs migrations schema alignment
 *   T-W19-012  FAIL  MpsResult Pydantic model has no intent_statement field
 *   T-W19-013  FAIL  usePollCriteriaDocumentStatus has no maximum poll count
 *   T-W19-014  FAIL  No LDCS test fixture file exists
 *   T-W19-015  FAIL  criteria.number column is INTEGER (cannot store '1.4.1' format)
 *
 * ── GREEN STATE (after Wave 19 implementation) ────────────────────────────────
 *   All 14 TypeScript tests + 1 Python test (T-W19-016) PASS once the implementation
 *   batches (B schema, C api, D ui, E integration) apply their fixes.
 *
 * All tests are FILE-BASED (no live DB / network / Supabase calls required).
 * Authority: foreman-v2-agent delegation T-W19A-001 through T-W19A-012
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ── Path constants ─────────────────────────────────────────────────────────────

/** Directory containing all Maturion-legacy Supabase migrations. */
const MIGRATIONS_DIR = path.resolve(
  process.cwd(),
  'apps/maturion-maturity-legacy/supabase/migrations',
);

/** AI Gateway parsing service — must be extended by Wave 19. */
const PARSING_PY_PATH = path.resolve(
  process.cwd(),
  'apps/mat-ai-gateway/services/parsing.py',
);

/** Edge Function: invoke-ai-parse-criteria — must be fixed by Wave 19. */
const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

/** Root of the MAT frontend source. */
const FRONTEND_HOOKS_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/lib/hooks/useCriteria.ts',
);

/** CI scripts directory. */
const CI_SCRIPTS_DIR = path.resolve(
  process.cwd(),
  '.github/scripts',
);

/** CI workflows directory. */
const CI_WORKFLOWS_DIR = path.resolve(
  process.cwd(),
  '.github/workflows',
);

/** Expected location for the LDCS E2E test fixture. */
const LDCS_FIXTURE_DIR = path.resolve(
  process.cwd(),
  'modules/mat/tests/wave19/fixtures',
);

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Read ALL SQL migration files and return their content as an array. */
function readAllMigrations(): Array<{ filename: string; content: string }> {
  const dirExists = fs.existsSync(MIGRATIONS_DIR);
  expect(
    dirExists,
    `Migrations directory not found: ${MIGRATIONS_DIR}`,
  ).toBe(true);
  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));
  return files.map(f => ({
    filename: f,
    content: fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf-8'),
  }));
}

/**
 * Return all migration files that contain `contentPattern`.
 * If `filenamePattern` is given, only matching filenames are searched.
 */
function findMigrations(
  contentPattern: RegExp,
  filenamePattern?: RegExp,
): Array<{ filename: string; content: string }> {
  return readAllMigrations().filter(
    m =>
      contentPattern.test(m.content) &&
      (filenamePattern == null || filenamePattern.test(m.filename)),
  );
}

/** Read parsing.py — fail with a clear message when absent. */
function readParsingPy(): string {
  expect(
    fs.existsSync(PARSING_PY_PATH),
    `parsing.py not found: ${PARSING_PY_PATH}`,
  ).toBe(true);
  return fs.readFileSync(PARSING_PY_PATH, 'utf-8');
}

/** Read the Edge Function — fail with a clear message when absent. */
function readEdgeFunction(): string {
  expect(
    fs.existsSync(EDGE_FN_PATH),
    `Edge Function not found: ${EDGE_FN_PATH}`,
  ).toBe(true);
  return fs.readFileSync(EDGE_FN_PATH, 'utf-8');
}

/** Read the frontend criteria hook — fail with a clear message when absent. */
function readCriteriaHook(): string {
  expect(
    fs.existsSync(FRONTEND_HOOKS_PATH),
    `useCriteria.ts hook not found: ${FRONTEND_HOOKS_PATH}`,
  ).toBe(true);
  return fs.readFileSync(FRONTEND_HOOKS_PATH, 'utf-8');
}

/**
 * Extract the MpsResult class body from parsing.py.
 * Returns the substring from 'class MpsResult' to the next top-level class definition.
 * This prevents false positives from fields defined in later classes (e.g. DomainResult).
 */
function extractMpsResultClass(content: string): string {
  const classIdx = content.indexOf('class MpsResult');
  if (classIdx === -1) return '';
  // Find the next 'class ' definition after MpsResult to know where it ends
  const nextClassIdx = content.indexOf('\nclass ', classIdx + 1);
  if (nextClassIdx === -1) {
    // No subsequent class — take up to 2000 chars
    return content.slice(classIdx, classIdx + 2000);
  }
  return content.slice(classIdx, nextClassIdx);
}

/**
 * Recursively walk `dir` and return every file path whose basename matches
 * the provided regex pattern.
 */
function findFilesRecursive(dir: string, nameMatcher: RegExp): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFilesRecursive(fullPath, nameMatcher));
    } else if (nameMatcher.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-001: criteria.number TEXT type (T-W19-002) + INTEGER column check (T-W19-015)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-001: criteria.number must be TEXT for LDCS hierarchical IDs', () => {

  it('[T-W19-002] A Wave 19 migration changes criteria.number column type to TEXT', () => {
    /*
     * Gap: GAP-PARSE-001 — criteria.number is INTEGER NOT NULL, but LDCS criteria
     * identifiers are hierarchical strings like "1.4.1", "2.7.5", "5.26.7".
     * An INTEGER column cannot store these values. The Edge Function works around
     * this by substituting idx+1 (sequential integer), discarding the real IDs.
     *
     * RED:   No migration file converts criteria.number from INTEGER to TEXT.
     *        The base migration (20260302000000_mat_core_tables.sql) defines
     *        `number INTEGER NOT NULL` for the criteria table. No subsequent migration
     *        issues `ALTER TABLE criteria ALTER COLUMN number TYPE TEXT`.
     *
     * GREEN: schema-builder (T-W19B-001) creates a migration containing:
     *        ALTER TABLE public.criteria ALTER COLUMN number TYPE TEXT USING number::TEXT;
     *        (or equivalent DDL that changes the column type to TEXT)
     *
     * Authority: GAP-PARSE-001, AD-W19-001, WAVE-19-PLAN-PROPOSAL.md T-W19B-001
     */
    const matches = findMigrations(
      /ALTER\s+TABLE\s+(?:public\.)?criteria\s+ALTER\s+COLUMN\s+number\s+TYPE\s+TEXT/i,
    );
    expect(
      matches.length,
      '[T-W19-002] RED: No migration changes criteria.number to TYPE TEXT.\n' +
      'schema-builder must create a migration containing:\n' +
      '  ALTER TABLE public.criteria ALTER COLUMN number TYPE TEXT USING number::TEXT;\n' +
      `Searched directory: ${MIGRATIONS_DIR}\n` +
      'This is required for LDCS criteria IDs like "1.4.1" to be stored correctly.',
    ).toBeGreaterThan(0);
  });

  it('[T-W19-015] criteria.number base DDL is NOT defined as INTEGER (blocking LDCS IDs)', () => {
    /*
     * Gap: GAP-PARSE-001 — The base migration defines criteria.number as INTEGER NOT NULL.
     * This makes it impossible to store hierarchical LDCS criterion numbers like "1.4.1".
     *
     * RED:   The net schema has criteria.number as INTEGER. A migration that converts it
     *        to TEXT does not yet exist. Therefore the column is still INTEGER, and any
     *        attempt to INSERT "1.4.1" into it would fail with a type error.
     *
     * GREEN: After T-W19B-001 migration is applied, criteria.number is TEXT.
     *        The migration history converts INTEGER → TEXT. The base DDL still has INTEGER
     *        (that is correct — migrations alter it), but the final effective type is TEXT.
     *        This test passes when:
     *        (a) The base DDL has INTEGER (unchanged — correct migration practice), AND
     *        (b) At least one migration converts it to TEXT (checked by T-W19-002 above).
     *        Specifically this test is RED until condition (b) is met.
     *
     * Authority: GAP-PARSE-001, AD-W19-001
     */
    // Assert base DDL still defines number as INTEGER (correct — migrations alter it)
    const migrations = readAllMigrations();
    const baseMigration = migrations.find(m => m.filename.includes('mat_core_tables'));
    expect(
      baseMigration,
      '[T-W19-015] RED: Could not find mat_core_tables base migration.\n' +
      'Expected a migration file with "mat_core_tables" in its name.',
    ).toBeDefined();

    const hasIntegerInBase = /number\s+INTEGER/i.test(baseMigration!.content);
    expect(
      hasIntegerInBase,
      '[T-W19-015] Base migration should define criteria.number as INTEGER (migration practice: alter columns via subsequent migration).',
    ).toBe(true);

    // Now assert that a TYPE TEXT conversion migration also exists
    // (same assertion as T-W19-002 — makes this test RED until migration is added)
    const textConversionMigrations = findMigrations(
      /ALTER\s+TABLE\s+(?:public\.)?criteria\s+ALTER\s+COLUMN\s+number\s+TYPE\s+TEXT/i,
    );
    expect(
      textConversionMigrations.length,
      '[T-W19-015] RED: criteria.number is still INTEGER in the effective schema — no TEXT conversion migration found.\n' +
      'The LDCS format "1.4.1" requires TEXT. schema-builder must add:\n' +
      '  ALTER TABLE public.criteria ALTER COLUMN number TYPE TEXT USING number::TEXT;',
    ).toBeGreaterThan(0);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-002: Edge Function uses c.number (not idx+1) (T-W19-001)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-001/GAP-PARSE-012: Edge Function must use c.number not idx+1', () => {

  it('[T-W19-001] Edge Function criteria upsert uses c.number instead of idx + 1', () => {
    /*
     * Gap: GAP-PARSE-012 — The Edge Function (supabase/functions/invoke-ai-parse-criteria/index.ts)
     * discards the AI-extracted criterion number (e.g. "1.4.1") and substitutes
     * `idx + 1` (a sequential counter). This means the LDCS hierarchical structure
     * is entirely lost in the database.
     *
     * RED:   The Edge Function contains `number: idx + 1` in the criteria upsert
     *        loop. This is the current state before Wave 19 api-builder fixes it.
     *        The line is present at multiple points in the file.
     *
     * GREEN: api-builder (T-W19C-001 / T-W19C-009) replaces `number: idx + 1` with
     *        `number: c.number` (or equivalent that uses the AI-extracted value),
     *        AND criteria.number column is TEXT (after T-W19B-001 migration).
     *
     * Authority: GAP-PARSE-001, GAP-PARSE-012, WAVE-19-PLAN-PROPOSAL.md T-W19C-001
     */
    const edgeFn = readEdgeFunction();

    // Assert the bug is NOT present (currently it IS present → this test is RED)
    const hasIdxPlusOne = /number:\s*idx\s*\+\s*1/.test(edgeFn);
    expect(
      hasIdxPlusOne,
      '[T-W19-001] RED: Edge Function uses `number: idx + 1` in criteria upsert.\n' +
      'api-builder must replace this with `number: c.number` to preserve LDCS IDs.\n' +
      `Edge Function path: ${EDGE_FN_PATH}`,
    ).toBe(false);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-003: MPS intent_statement column (T-W19-003)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-002: mini_performance_standards needs intent_statement column', () => {

  it('[T-W19-003] A Wave 19 migration adds intent_statement column to mini_performance_standards', () => {
    /*
     * Gap: GAP-PARSE-002 — The mini_performance_standards table is missing `intent_statement`
     * and `guidance` columns. LDCS documents contain MPS-level Intent statements that define
     * the purpose of each Mini Performance Standard; these are never stored.
     *
     * RED:   No migration adds `intent_statement` to `mini_performance_standards`.
     *        The base DDL (20260302000000_mat_core_tables.sql) for mini_performance_standards
     *        has no such column. No subsequent migration adds it.
     *
     * GREEN: schema-builder (T-W19B-002) creates a migration containing:
     *        ALTER TABLE public.mini_performance_standards
     *          ADD COLUMN IF NOT EXISTS intent_statement TEXT,
     *          ADD COLUMN IF NOT EXISTS guidance TEXT;
     *
     * Authority: GAP-PARSE-002, WAVE-19-PLAN-PROPOSAL.md T-W19B-002
     */
    const matches = findMigrations(
      /ALTER\s+TABLE\s+(?:public\.)?mini_performance_standards.*ADD\s+COLUMN.*intent_statement/is,
    );
    expect(
      matches.length,
      '[T-W19-003] RED: No migration adds `intent_statement` to mini_performance_standards.\n' +
      'schema-builder must create a migration containing:\n' +
      '  ALTER TABLE public.mini_performance_standards\n' +
      '    ADD COLUMN IF NOT EXISTS intent_statement TEXT,\n' +
      '    ADD COLUMN IF NOT EXISTS guidance TEXT;\n' +
      `Searched directory: ${MIGRATIONS_DIR}`,
    ).toBeGreaterThan(0);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-004: MPS intent_statement written by Edge Fn + MpsResult model (T-W19-004, T-W19-012)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-002/GAP-PARSE-008: MPS intent_statement extraction and write-back', () => {

  it('[T-W19-004] Edge Function MPS upsert includes intent_statement field from AI result', () => {
    /*
     * Gap: GAP-PARSE-002 — Even after the schema migration adds intent_statement, the
     * Edge Function must be updated to write the AI-extracted intent_statement to the
     * mini_performance_standards table. Without this, the column will always be NULL.
     *
     * RED:   The Edge Function MPS upsert does not include `intent_statement` as a
     *        column being written. Searching the file for `intent_statement` in proximity
     *        to `mini_performance_standards` yields no match — the field is never written.
     *
     * GREEN: api-builder (T-W19C-002) adds `intent_statement: m.intent_statement` (or
     *        equivalent) to the MPS insert/upsert body, after MpsResult is updated to
     *        include this field (T-W19C-006 / T-W19-012).
     *
     * Authority: GAP-PARSE-002, WAVE-19-PLAN-PROPOSAL.md T-W19C-002
     */
    const edgeFn = readEdgeFunction();

    // The Edge Function must write intent_statement when inserting/upserting MPS rows.
    // Check for `intent_statement` in proximity to the mini_performance_standards insert
    // (within 3000 chars of the `mini_performance_standards` insert block)
    const mpsInsertIdx = edgeFn.indexOf("'mini_performance_standards'");
    expect(
      mpsInsertIdx,
      '[T-W19-004] RED: Could not find mini_performance_standards insert block in Edge Function.',
    ).toBeGreaterThan(-1);

    const mpsInsertBlock = edgeFn.slice(
      Math.max(0, mpsInsertIdx - 500),
      Math.min(edgeFn.length, mpsInsertIdx + 3000),
    );
    const writesIntentStatement = /intent_statement/.test(mpsInsertBlock);
    expect(
      writesIntentStatement,
      '[T-W19-004] RED: Edge Function does not write `intent_statement` to mini_performance_standards.\n' +
      'api-builder must add `intent_statement: m.intent_statement` to the MPS upsert body.\n' +
      `Edge Function path: ${EDGE_FN_PATH}`,
    ).toBe(true);
  });

  it('[T-W19-012] MpsResult Pydantic model in parsing.py has intent_statement field', () => {
    /*
     * Gap: GAP-PARSE-008 — The AI Gateway MpsResult Pydantic model does not include
     * `intent_statement` or `guidance` fields. The AI is never asked to extract these,
     * so even after schema and Edge Function fixes, no data would flow through.
     *
     * RED:   The MpsResult class in parsing.py has no `intent_statement` field.
     *        The current MpsResult only includes: domain_name, name, number,
     *        sort_order, level_descriptors.
     *
     * GREEN: api-builder (T-W19C-006) adds:
     *          intent_statement: str = ""
     *          guidance: str = ""
     *        to MpsResult, and updates the AI system prompt (T-W19C-007) to extract
     *        MPS-level intent and guidance from LDCS documents.
     *
     * Authority: GAP-PARSE-008, WAVE-19-PLAN-PROPOSAL.md T-W19C-006
     */
    const parsingPy = readParsingPy();
    const mpsResultClass = extractMpsResultClass(parsingPy);

    expect(
      mpsResultClass.length,
      '[T-W19-012] RED: MpsResult class not found in parsing.py.',
    ).toBeGreaterThan(0);

    const hasIntentStatement = /intent_statement/.test(mpsResultClass);
    expect(
      hasIntentStatement,
      '[T-W19-012] RED: MpsResult Pydantic model in parsing.py has no `intent_statement` field.\n' +
      'api-builder must add:\n' +
      '  intent_statement: str = ""\n' +
      '  guidance: str = ""\n' +
      `to the MpsResult class in ${PARSING_PY_PATH}`,
    ).toBe(true);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-005: audit_logs criteria_parsed row structure (T-W19-005, T-W19-006)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-003: audit_logs parse events must have correct structure', () => {

  it('[T-W19-005] Edge Function does NOT write criteria_parsed when criteria_inserted = 0', () => {
    /*
     * Gap: GAP-PARSE-003 / GAP-PARSE-004 — In production, the SQL probe found 0 rows
     * in audit_logs for criteria_parsed/criteria_parse_failed actions. Part of the
     * root cause is that when AI_GATEWAY_URL is empty (not configured), the Edge Function
     * takes the zero-domain path and writes a "success" criteria_parsed log with
     * `criteria_inserted: 0`. This masks the real failure.
     *
     * After Wave 19 fixes:
     *   - A zero-insert result (0 domains/MPS/criteria) must trigger criteria_parse_failed
     *   - criteria_parsed must only be written when criteria_inserted > 0
     *
     * RED:   The Edge Function currently has a code path (domains.length === 0 branch)
     *        that writes `action: 'criteria_parsed'` with `criteria_inserted: 0`.
     *        This means the `criteria_parsed` event does NOT guarantee any data was stored.
     *        Specifically: the zero-domain path writes `criteria_parsed` but should write
     *        `criteria_parse_failed` (per GAP-PARSE-004 fix).
     *
     * GREEN: api-builder (T-W19C-003) replaces the zero-domain success path with a
     *        zero-insert assertion that throws an error → criteria_parse_failed is written.
     *        The `criteria_parsed` action is only written when criteria_inserted > 0.
     *
     * Authority: GAP-PARSE-003, GAP-PARSE-004, WAVE-19-PLAN-PROPOSAL.md T-W19C-003
     */
    const edgeFn = readEdgeFunction();

    // Find the zero-domain/empty-result branch (when domains.length === 0)
    // The bug: this branch currently writes 'criteria_parsed' with criteria_inserted: 0
    // After fix: this branch should write 'criteria_parse_failed'
    //
    // 1000-char lookahead: the zero-domain branch writes criteria_parsed within approximately
    // 400 chars of `domains.length === 0` (the audit_logs insert follows the upsert in the
    // same branch). 1000 chars is conservative to accommodate reformatting while staying
    // well short of reaching unrelated code sections.
    const zeroDomainCriteriaParseSuccess = /domains\.length\s*===\s*0[\s\S]{0,1000}action:\s*['"]criteria_parsed['"]/
      .test(edgeFn);

    expect(
      zeroDomainCriteriaParseSuccess,
      '[T-W19-005] RED: Edge Function writes `criteria_parsed` in the zero-domain path.\n' +
      'When 0 domains are returned, the Edge Function must NOT declare success.\n' +
      'The zero-insert path should write `criteria_parse_failed` instead.\n' +
      'api-builder must implement the zero-insert assertion (T-W19C-003):\n' +
      '  if (domainsInserted === 0 && mpsInserted === 0 && criteriaInserted === 0) {\n' +
      '    throw new Error("Zero inserts — treating as failure");\n' +
      '  }\n' +
      `Edge Function path: ${EDGE_FN_PATH}`,
    ).toBe(false);
  });

  it('[T-W19-006] criteria_parse_failed audit_log details includes a reason field', () => {
    /*
     * Gap: GAP-PARSE-003 — The criteria_parse_failed audit log entry uses
     * `{ error: message, outcome: 'failure' }` in its details object, but the
     * audit log spec requires a `reason` field for structured failure reporting.
     * The reason field enables automated failure analysis and user-facing error messages.
     *
     * RED:   The Edge Function catch block writes:
     *          details: { error: message, outcome: 'failure' }
     *        It uses the key `error` instead of the required `reason` key.
     *        This means audit_logs queries for `details->>'reason'` will return NULL.
     *
     * GREEN: api-builder updates the criteria_parse_failed audit_log insert to include:
     *          details: { reason: message, error: message, outcome: 'failure' }
     *        (reason is the primary key; error may be kept for backward compatibility)
     *
     * Authority: GAP-PARSE-003, WAVE-19-PLAN-PROPOSAL.md
     */
    const edgeFn = readEdgeFunction();

    // Find the criteria_parse_failed audit_log insert block
    const parseFailedIdx = edgeFn.indexOf("'criteria_parse_failed'");
    expect(
      parseFailedIdx,
      '[T-W19-006] RED: Could not find criteria_parse_failed insert in Edge Function.',
    ).toBeGreaterThan(-1);

    // Extract the details object near the criteria_parse_failed write
    // Look 500 chars before and 500 after to capture the full insert block
    const failedBlock = edgeFn.slice(
      Math.max(0, parseFailedIdx - 100),
      Math.min(edgeFn.length, parseFailedIdx + 600),
    );

    const hasReasonField = /reason\s*:/.test(failedBlock);
    expect(
      hasReasonField,
      '[T-W19-006] RED: criteria_parse_failed audit log details lacks a `reason` field.\n' +
      'Current code: `details: { error: message, outcome: \'failure\' }`\n' +
      'Required: `details: { reason: message, error: message, outcome: \'failure\' }`\n' +
      'api-builder must add `reason: message` to the criteria_parse_failed details.\n' +
      `Edge Function path: ${EDGE_FN_PATH}`,
    ).toBe(true);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-006: zero-insert → criteria_parse_failed (T-W19-007)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-004: zero-insert must trigger criteria_parse_failed', () => {

  it('[T-W19-007] Edge Function has zero-insert assertion before declaring parse success', () => {
    /*
     * Gap: GAP-PARSE-004 — The Edge Function currently declares a parse "successful"
     * even when 0 domains, 0 MPS, and 0 criteria were inserted. This can happen when
     * the AI Gateway returns an empty result (e.g., wrong language, parsing failure).
     * The user sees "0 criteria" with no error, not understanding the pipeline failed.
     *
     * RED:   No zero-insert assertion exists. The Edge Function does not have code
     *        resembling:
     *          if (domainsInserted === 0 && mpsInserted === 0 && criteriaInserted === 0)
     *            throw new Error('Zero inserts')
     *        The code path for domains.length === 0 silently writes `criteria_parsed`.
     *
     * GREEN: api-builder (T-W19C-003) adds the zero-insert assertion so that a parse
     *        that produces 0 records is treated as a failure, triggering
     *        `criteria_parse_failed` in audit_logs and `parse_failed` in criteria_documents.
     *
     * Authority: GAP-PARSE-004, WAVE-19-PLAN-PROPOSAL.md T-W19C-003
     */
    const edgeFn = readEdgeFunction();

    // The fix must add code that checks for zero inserts and throws or writes parse_failed
    // Acceptable patterns: explicit count check OR checking domains.length with parse_failed
    const hasZeroInsertAssertion = (
      /(?:domainsInserted|domains_inserted|insertedDomains)[\s\S]{0,200}(?:criteriaInserted|criteria_inserted)[\s\S]{0,200}(?:throw|parse_failed|criteria_parse_failed)/
        .test(edgeFn) ||
      /if\s*\([\s\S]{0,100}=== 0[\s\S]{0,200}(?:throw|criteria_parse_failed)/.test(edgeFn)
    );

    expect(
      hasZeroInsertAssertion,
      '[T-W19-007] RED: Edge Function has no zero-insert assertion.\n' +
      'When AI Gateway returns 0 domains/MPS/criteria, the pipeline must fail explicitly.\n' +
      'api-builder must add (T-W19C-003):\n' +
      '  if (domainsInserted === 0 && mpsInserted === 0 && criteriaInserted === 0) {\n' +
      "    throw new Error('Zero inserts — AI Gateway returned empty result, treating as failure');\n" +
      '  }\n' +
      `Edge Function path: ${EDGE_FN_PATH}`,
    ).toBe(true);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-007: criteria INSERT fail → domains/MPS rolled back (T-W19-008)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-005: DB write-back must be atomic (parse_write_back_atomic RPC)', () => {

  it('[T-W19-008] A Wave 19 migration creates the parse_write_back_atomic RPC function', () => {
    /*
     * Gap: GAP-PARSE-005 — The Edge Function performs sequential DB inserts (domains,
     * then MPS, then criteria) without a wrapping SQL transaction. If criteria INSERT
     * fails, domains and MPS rows remain in the database — orphaned data with no criteria.
     *
     * RED:   No migration creates a `parse_write_back_atomic` Postgres function.
     *        The Edge Function contains a comment acknowledging this gap (T-W15-TXN).
     *        Sequential inserts exist without BEGIN/COMMIT/ROLLBACK.
     *
     * GREEN: schema-builder (T-W19B-003) creates a migration with:
     *        CREATE OR REPLACE FUNCTION parse_write_back_atomic(...)
     *        RETURNS JSON LANGUAGE plpgsql AS $$ BEGIN ... END $$;
     *        api-builder (T-W19C-004) then replaces sequential inserts with
     *        supabase.rpc('parse_write_back_atomic', {...}).
     *
     * Authority: GAP-PARSE-005, WAVE-19-PLAN-PROPOSAL.md T-W19B-003, T-W19C-004
     */
    const matches = findMigrations(
      /parse_write_back_atomic/i,
    );
    expect(
      matches.length,
      '[T-W19-008] RED: No migration creates the parse_write_back_atomic RPC function.\n' +
      'schema-builder must create a migration containing:\n' +
      '  CREATE OR REPLACE FUNCTION public.parse_write_back_atomic(...)\n' +
      '  RETURNS JSON LANGUAGE plpgsql AS $$ ... $$;\n' +
      'This ensures that domain/MPS/criteria inserts are atomic — if criteria fails,\n' +
      'domains and MPS are rolled back.\n' +
      `Searched directory: ${MIGRATIONS_DIR}`,
    ).toBeGreaterThan(0);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-008: Edge Function startup validation (T-W19-010)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-006: Edge Function must return 500 when AI_GATEWAY_URL is empty', () => {

  it('[T-W19-010] Edge Function request handler returns 500 when AI_GATEWAY_URL is empty string', () => {
    /*
     * Gap: GAP-PARSE-006 — When AI_GATEWAY_URL is not configured (empty string), the
     * Edge Function currently:
     *   1. Returns 202 ACCEPTED (success)
     *   2. Dispatches a background task that skips the AI Gateway call
     *   3. Writes criteria_parsed with 0 inserts (silent success)
     *   4. User sees the parse "succeeded" but no criteria were stored
     *
     * After Wave 19 fix, the Edge Function must:
     *   1. Check AI_GATEWAY_URL at request time (in the fast synchronous path)
     *   2. Return HTTP 500 with a descriptive error if AI_GATEWAY_URL is empty
     *   3. NEVER dispatch a background task when AI_GATEWAY_URL is unset
     *
     * RED:   The Edge Function handler does NOT have early-exit logic for empty
     *        AI_GATEWAY_URL. The current handler only logs a warning at cold-start.
     *        In the request handler, the code checks `if (AI_GATEWAY_URL)` to skip
     *        the AI call in the background, but the 202 response is always returned.
     *        There is NO code path that returns status 500 when AI_GATEWAY_URL is ''.
     *
     * GREEN: api-builder (T-W19C-005) adds startup validation in the Deno.serve handler:
     *        if (!AI_GATEWAY_URL) {
     *          return new Response(
     *            JSON.stringify({ error: 'AI_GATEWAY_URL not configured', code: 'MISSING_ENV' }),
     *            { status: 500 }
     *          );
     *        }
     *
     * Authority: GAP-PARSE-006, WAVE-19-PLAN-PROPOSAL.md T-W19C-005
     */
    const edgeFn = readEdgeFunction();

    // The handler must have code that returns status 500 when AI_GATEWAY_URL is empty.
    // Look for a conditional check on AI_GATEWAY_URL that returns a 500 response.
    // Valid patterns:
    //   if (!AI_GATEWAY_URL) { return new Response(..., { status: 500 }) }
    //   !AI_GATEWAY_URL → 500
    const hasStartupValidation500 = /if\s*\(\s*!AI_GATEWAY_URL\s*\)[\s\S]{0,500}status:\s*500/.test(edgeFn);
    expect(
      hasStartupValidation500,
      '[T-W19-010] RED: Edge Function does not return 500 when AI_GATEWAY_URL is empty.\n' +
      'Current behavior: Returns 202 and silently skips the AI parse.\n' +
      'Required behavior: Check AI_GATEWAY_URL in the request handler; return 500 if empty.\n' +
      'api-builder must add (T-W19C-005):\n' +
      '  if (!AI_GATEWAY_URL) {\n' +
      "    return new Response(\n" +
      "      JSON.stringify({ error: 'AI_GATEWAY_URL not configured', code: 'MISSING_ENV' }),\n" +
      '      { status: 500, headers: ... }\n' +
      '    );\n' +
      '  }\n' +
      `Edge Function path: ${EDGE_FN_PATH}`,
    ).toBe(true);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-009: poll timeout (T-W19-013)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-009: usePollCriteriaDocumentStatus must have a poll timeout', () => {

  it('[T-W19-013] usePollCriteriaDocumentStatus hook has a maximum poll count / timeout guard', () => {
    /*
     * Gap: GAP-PARSE-009 — usePollCriteriaDocumentStatus polls every 3 seconds with
     * no upper limit on iterations. If criteria_documents.status never reaches a
     * terminal state (e.g., background task silently crashed before writing status),
     * the UI will poll forever. The user sees a perpetual loading state with no error.
     *
     * RED:   usePollCriteriaDocumentStatus uses `refetchInterval: 3000` with no
     *        maximum poll count, no timeout constant, and no error state returned on
     *        timeout. The hook file contains no reference to POLL_MAX, MAX_POLL,
     *        MAX_ITERATIONS, pollCount, timeoutMs, or equivalent constructs.
     *
     * GREEN: ui-builder (T-W19D-001) adds poll timeout:
     *        - MAX_POLL_ITERATIONS constant (e.g. 600 → 30 minutes at 3s/poll)
     *        - pollCount state that increments on each refetch
     *        - When pollCount >= MAX_POLL_ITERATIONS: stop polling + return user-visible error
     *        - Error message: "Parsing is taking longer than expected. Please try again."
     *
     * Authority: GAP-PARSE-009, AD-W19-003 (30 min timeout), WAVE-19-PLAN-PROPOSAL.md T-W19D-001
     */
    const hook = readCriteriaHook();

    // Find the usePollCriteriaDocumentStatus function and extract its body
    const pollFnIdx = hook.indexOf('usePollCriteriaDocumentStatus');
    expect(
      pollFnIdx,
      '[T-W19-013] RED: usePollCriteriaDocumentStatus not found in useCriteria.ts.',
    ).toBeGreaterThan(-1);

    // Extract up to 3000 chars from the function definition
    const pollFnBody = hook.slice(pollFnIdx, Math.min(hook.length, pollFnIdx + 3000));

    // Check for any timeout/max-iteration guard
    // Primary pattern: named constant for max iterations (the canonical fix)
    const hasPrimaryTimeoutGuard = /MAX_POLL|POLL_MAX|MAX_ITER|pollCount|poll_count|iterationCount|timeoutMs|pollTimeout/.test(pollFnBody);
    const hasTimeoutGuard = hasPrimaryTimeoutGuard;
    expect(
      hasTimeoutGuard,
      '[T-W19-013] RED: usePollCriteriaDocumentStatus has no poll timeout guard.\n' +
      'Current behavior: polls every 3 seconds indefinitely.\n' +
      'Required behavior: after MAX_POLL_ITERATIONS (e.g. 600 = 30 min), stop and surface error.\n' +
      'ui-builder must add (T-W19D-001):\n' +
      '  const MAX_POLL_ITERATIONS = 600; // 30 minutes at 3s per poll\n' +
      '  // track iteration count; when exceeded, return timeout error to user\n' +
      `Hook path: ${FRONTEND_HOOKS_PATH}`,
    ).toBe(true);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-011: CI schema validation (T-W19-011)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-007: CI schema validation for module hooks vs migrations', () => {

  it('[T-W19-011] A CI workflow or script validates schema alignment between module and migrations', () => {
    /*
     * Gap: GAP-PARSE-007 — The legacy MAT implementation (apps/maturion-maturity-legacy/)
     * and the new MAT module (modules/mat/) coexist. Schema alignment between the
     * legacy migration files and the new module has never been validated in CI.
     * This means schema drift can occur silently across waves.
     *
     * RED:   No CI workflow job or script specifically validates:
     *        - Module-level schema definitions (if any) vs migration files
     *        - Schema drift between legacy and new MAT paths
     *        - That Wave 19 schema changes (criteria.number TEXT, MPS intent_statement)
     *          are reflected in both paths
     *
     * GREEN: integration-builder (T-W19E-004) adds a CI step or script:
     *        .github/scripts/validate-mat-schema-alignment.sh  or
     *        A job in .github/workflows/deploy-mat-vercel.yml (or a new workflow)
     *        that checks module hooks vs migration files for schema alignment.
     *
     * Authority: GAP-PARSE-007, WAVE-19-PLAN-PROPOSAL.md T-W19E-004
     */

    // Check for a schema alignment validation script
    const schemaAlignmentScript = path.join(CI_SCRIPTS_DIR, 'validate-mat-schema-alignment.sh');
    const hasAlignmentScript = fs.existsSync(schemaAlignmentScript);

    // Check for schema alignment in CI workflows
    const workflowFiles = fs.existsSync(CI_WORKFLOWS_DIR)
      ? fs.readdirSync(CI_WORKFLOWS_DIR).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
      : [];

    const workflowHasSchemaAlignmentJob = workflowFiles.some(f => {
      const content = fs.readFileSync(path.join(CI_WORKFLOWS_DIR, f), 'utf-8');
      return /schema[-_]align|mat[-_]schema[-_]validation|module.*hook.*migration|validate.*mat.*schema/i.test(content);
    });

    const hasCiSchemaValidation = hasAlignmentScript || workflowHasSchemaAlignmentJob;

    expect(
      hasCiSchemaValidation,
      '[T-W19-011] RED: No CI schema alignment validation found.\n' +
      'Expected one of:\n' +
      `  (a) Script: ${schemaAlignmentScript}\n` +
      `  (b) A workflow in ${CI_WORKFLOWS_DIR} containing schema alignment check\n` +
      'integration-builder must add (T-W19E-004) a CI check that validates:\n' +
      '  - Wave 19 schema changes are present in migration files\n' +
      '  - Module hooks are consistent with migration-defined schema\n' +
      '  - No schema drift between legacy apps/ path and modules/ path',
    ).toBe(true);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W19A-012: E2E LDCS fixture (T-W19-014)
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 19 — GAP-PARSE-010: E2E LDCS fixture for content assertion tests', () => {

  it('[T-W19-014] An LDCS test fixture file exists in modules/mat/tests/wave19/fixtures/', () => {
    /*
     * Gap: GAP-PARSE-010 — No end-to-end content assertion tests exist for the
     * criteria parsing pipeline. Current QA tests verify schema column existence
     * and code structure, but never assert that parsing a known LDCS document
     * produces the expected structured output (correct criteria count, hierarchy,
     * number format).
     *
     * RED:   No LDCS test fixture exists at:
     *          modules/mat/tests/wave19/fixtures/
     *        This directory does not exist. There is no canonical LDCS document
     *        with a known expected parse output for content assertion tests.
     *
     * GREEN: qa-builder (T-W19F-001, Batch F) creates:
     *          modules/mat/tests/wave19/fixtures/ldcs-fixture.json
     *        containing a representative LDCS parse output with known fields:
     *        - criteria_count: expected number of criteria
     *        - sample_criteria_number: a hierarchical ID like "1.4.1"
     *        - mps_count: expected number of MPS
     *        - has_intent_statement: true
     *        (Exact format defined by mat-specialist in T-W19F-001)
     *
     * Authority: GAP-PARSE-010, WAVE-19-PLAN-PROPOSAL.md T-W19F-001, T-W19F-002
     */
    const fixtureExists = fs.existsSync(LDCS_FIXTURE_DIR);
    expect(
      fixtureExists,
      '[T-W19-014] RED: LDCS test fixture directory does not exist.\n' +
      `Expected: ${LDCS_FIXTURE_DIR}\n` +
      'qa-builder (Batch F) must create this directory with a fixture file:\n' +
      '  modules/mat/tests/wave19/fixtures/ldcs-fixture.json\n' +
      'The fixture must contain:\n' +
      '  - criteria_count: <expected criteria count from a representative LDCS parse>\n' +
      '  - sample_criteria_number: a hierarchical ID like "1.4.1"\n' +
      '  - mps_count: <expected MPS count>\n' +
      '  - has_intent_statement: true',
    ).toBe(true);

    // If the directory exists, check that at least one fixture file is present
    const fixtureFiles = fs.readdirSync(LDCS_FIXTURE_DIR)
      .filter(f => f.endsWith('.json') || f.endsWith('.jsonl') || f.endsWith('.yaml'));
    expect(
      fixtureFiles.length,
      '[T-W19-014] RED: LDCS fixture directory exists but contains no fixture files (*.json).\n' +
      `Directory: ${LDCS_FIXTURE_DIR}\n` +
      'qa-builder (Batch F) must create ldcs-fixture.json in this directory.',
    ).toBeGreaterThan(0);
  });

});
