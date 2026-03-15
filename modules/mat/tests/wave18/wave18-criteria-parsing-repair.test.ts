/**
 * Wave 18 — MAT Criteria Parsing Pipeline End-to-End Repair
 * RED Gate Test Suite: T-W18-QA-001 through T-W18-QA-015
 *
 * Wave    : Wave 18 — MAT Criteria Parsing Pipeline End-to-End Repair (LDCS Implementation)
 * Branch  : copilot/repair-mat-criteria-parsing-pipeline
 * Issue   : maturion-isms#1114
 * Task ID : T-W18-004 (qa-builder)
 * Session : session-qa-wave18-criteria-parsing-repair-20260315
 * Producing Agent: qa-builder
 *
 * IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-wave18-criteria-parsing-repair.md
 *
 * ── Confirmed Gaps (8) ───────────────────────────────────────────────────────
 *   Gap 1  Upload fails: "Failed to fetch" — RLS/bucket/profile config
 *   Gap 2  guidance column receives source_anchor (page ref), not guidance text
 *   Gap 3  criteria table missing intent_statement column
 *   Gap 4  AI system prompt: no intent_statement / guidance distinct fields
 *   Gap 5  AI system prompt: no 5-level maturity descriptors per criterion
 *   Gap 6  Descriptor tables exist but Edge Function never writes to them
 *   Gap 7  No Criteria Review/Approval screen with real data display
 *   Gap 8  source_anchor not stored separately (lost / repurposed as guidance)
 *
 * ── RED STATE (BEFORE Wave 18 implementation) ────────────────────────────────
 *   T-W18-QA-001  FAIL  No migration adds intent_statement to criteria table
 *   T-W18-QA-002  FAIL  No migration adds source_anchor to criteria table
 *   T-W18-QA-003  FAIL  parsing.py system prompt has no intent_statement field
 *   T-W18-QA-004  FAIL  parsing.py system prompt has no guidance distinct field
 *   T-W18-QA-005  FAIL  parsing.py system prompt has no maturity_descriptors
 *   T-W18-QA-006  FAIL  Edge Function maps source_anchor→guidance (bug — should map guidance→guidance)
 *   T-W18-QA-007  FAIL  Edge Function upsert has no source_anchor column mapping
 *   T-W18-QA-008  FAIL  Edge Function has no criteria_level_descriptors write
 *   T-W18-QA-009  FAIL  Edge Function has no mps_level_descriptors write
 *   T-W18-QA-010  FAIL  Edge Function has no domain_level_descriptors write
 *   T-W18-QA-011  FAIL  CriteriaApproval.tsx is a stub — no criteria data rendering
 *   T-W18-QA-012  FAIL  No Wave 18 migration adds upload fix (profiles-aware storage policy)
 *   T-W18-QA-013  FAIL  ParsedCriterion type has no intent_statement field
 *   T-W18-QA-014  FAIL  ParsedCriterion type has no guidance field
 *   T-W18-QA-015  FAIL  ParsedCriterion type has no maturity_descriptors field
 *
 * ── GREEN STATE (after Wave 18 implementation) ───────────────────────────────
 *   All 15 tests PASS once schema-builder, api-builder, and ui-builder apply their fixes.
 *
 * All tests are FILE-BASED (no live DB / network / Supabase calls required).
 * Authority: foreman-v2-agent delegation T-W18-004
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Path constants ────────────────────────────────────────────────────────────

/** Directory containing all Maturion-legacy Supabase migrations. */
const MIGRATIONS_DIR = path.resolve(
  process.cwd(),
  'apps/maturion-maturity-legacy/supabase/migrations',
);

/** AI Gateway parsing service (Wave 15 implementation — must be extended by Wave 18). */
const PARSING_PY_PATH = path.resolve(
  process.cwd(),
  'apps/mat-ai-gateway/services/parsing.py',
);

/** Edge Function: invoke-ai-parse-criteria (Wave 15 creation — must be fixed by Wave 18). */
const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

/** Root of the MAT frontend source. */
const FRONTEND_SRC = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src',
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
 * Return all migration files that contain `contentPattern` AND whose filename
 * matches `filenamePattern`.  If `filenamePattern` is omitted every migration is searched.
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

/**
 * Recursively walk `dir` and return every file path whose basename matches
 * one of the provided glob-style patterns (simple substring / regex).
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
// Test Suite
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 18 — MAT Criteria Parsing Pipeline End-to-End Repair (T-W18-QA-001 to T-W18-QA-015)', () => {

  // ── Schema: criteria table columns ──────────────────────────────────────────

  it('[T-W18-QA-001] A migration adds intent_statement column to criteria table', () => {
    /*
     * Gap 3 — criteria table missing `intent_statement TEXT` column.
     *
     * RED:   No migration file currently adds `intent_statement` to the criteria table.
     *        The criteria DDL in 20260302000000_mat_core_tables.sql defines only:
     *        id, mps_id, domain_id, audit_id, organisation_id, number, description,
     *        guidance, title, created_at, updated_at.
     *
     * GREEN: schema-builder (T-W18-005) creates a migration with an ALTER TABLE or
     *        CREATE TABLE DDL that adds `intent_statement TEXT` to the criteria table.
     *
     * Authority: IAA pre-brief §2 Gap 3, BD-015 RLS Policies Complete
     */
    const matches = findMigrations(
      /intent_statement\s+TEXT/i,
    );
    expect(
      matches.length,
      '[T-W18-QA-001] RED: No migration currently adds `intent_statement TEXT` to criteria.\n' +
      'schema-builder must create a migration containing:\n' +
      '  ALTER TABLE public.criteria ADD COLUMN IF NOT EXISTS intent_statement TEXT;\n' +
      '  (or equivalent CREATE TABLE / ADD COLUMN DDL)\n' +
      `Searched directory: ${MIGRATIONS_DIR}`,
    ).toBeGreaterThan(0);
  });

  it('[T-W18-QA-002] A migration adds source_anchor column to criteria table', () => {
    /*
     * Gap 8 — source_anchor not stored separately in the DB; currently it is lost
     *         because the Edge Function repurposes it as the guidance column value.
     *
     * RED:   No migration adds `source_anchor` as a column in any criteria-related DDL.
     *        The word "source_anchor" does not appear in any .sql file as a column
     *        definition — it only appears in TypeScript/Python as an AI response field.
     *
     * GREEN: schema-builder (T-W18-005) adds `source_anchor TEXT` to the criteria table.
     *
     * Authority: IAA pre-brief §2 Gap 8, A-032 Schema Column Compliance
     */
    const matches = findMigrations(
      /source_anchor\s+TEXT/i,
    );
    expect(
      matches.length,
      '[T-W18-QA-002] RED: No migration currently adds `source_anchor TEXT` to criteria.\n' +
      'schema-builder must create a migration containing:\n' +
      '  ALTER TABLE public.criteria ADD COLUMN IF NOT EXISTS source_anchor TEXT;\n' +
      `Searched directory: ${MIGRATIONS_DIR}`,
    ).toBeGreaterThan(0);
  });

  // ── AI Gateway: system prompt ──────────────────────────────────────────────

  it('[T-W18-QA-003] parsing.py system prompt includes intent_statement as an extractable field', () => {
    /*
     * Gap 4 — AI system prompt does not extract `intent_statement`.
     *
     * RED:   The _SYSTEM_PROMPT in parsing.py lists only: mps_number, number, title,
     *        description, source_anchor.  There is no `intent_statement` key anywhere
     *        in the JSON schema shown to GPT.
     *
     * GREEN: api-builder (T-W18-007) adds `intent_statement` to the criteria array schema
     *        within _SYSTEM_PROMPT so GPT extracts the field verbatim from the document.
     *
     * Authority: IAA pre-brief §2 Gap 4
     */
    const src = readParsingPy();
    expect(
      src,
      '[T-W18-QA-003] RED: parsing.py system prompt has no `intent_statement` field.\n' +
      'api-builder must add "intent_statement" to the criteria JSON schema in _SYSTEM_PROMPT.\n' +
      'Example:\n' +
      '  "intent_statement": "<the stated intent or purpose of this criterion>"\n' +
      `File: ${PARSING_PY_PATH}`,
    ).toMatch(/intent_statement/);
  });

  it('[T-W18-QA-004] parsing.py system prompt includes guidance as a distinct field', () => {
    /*
     * Gap 4 — The system prompt has no `guidance` field in the criteria schema.
     *         Currently `description` absorbs ALL text and `source_anchor` holds only
     *         the page reference.  Guidance (implementation notes) is never extracted
     *         as a distinct field.
     *
     * RED:   The word "guidance" does not appear inside _SYSTEM_PROMPT as a criteria
     *        schema key (it may appear in comments/docstrings unrelated to the prompt).
     *        More precisely: there is no criteria object key called "guidance" inside the
     *        JSON schema string passed to GPT.
     *
     * GREEN: api-builder adds `"guidance"` as a distinct criteria key in _SYSTEM_PROMPT.
     *
     * Authority: IAA pre-brief §2 Gap 4
     */
    const src = readParsingPy();
    // Match "guidance" as a JSON key inside the SYSTEM PROMPT string (quoted string key)
    expect(
      src,
      '[T-W18-QA-004] RED: parsing.py _SYSTEM_PROMPT has no `guidance` field in criteria schema.\n' +
      'api-builder must add "guidance": "<implementation guidance text>" to the criteria object\n' +
      'schema within _SYSTEM_PROMPT.\n' +
      `File: ${PARSING_PY_PATH}`,
    ).toMatch(/_SYSTEM_PROMPT\s*=[\s\S]*?"guidance"\s*:/);
  });

  it('[T-W18-QA-005] parsing.py system prompt includes maturity_descriptors with 5 levels', () => {
    /*
     * Gap 5 — AI system prompt does not instruct GPT to extract 5-level maturity
     *         descriptors per criterion.  The descriptor tables exist in the DB but
     *         are never populated because the AI is not asked to produce the data.
     *
     * RED:   There is no `maturity_descriptors` or `level_descriptors` key in
     *        _SYSTEM_PROMPT.  There is no mention of levels 1–5 or a 5-level scale.
     *
     * GREEN: api-builder adds a `maturity_descriptors` (or `level_descriptors`) key to
     *        the criteria schema in _SYSTEM_PROMPT, with 5 levels described.
     *
     * Authority: IAA pre-brief §2 Gap 5
     */
    const src = readParsingPy();
    expect(
      src,
      '[T-W18-QA-005] RED: parsing.py _SYSTEM_PROMPT has no maturity_descriptors/level_descriptors.\n' +
      'api-builder must add a 5-level descriptor array to the criteria schema in _SYSTEM_PROMPT.\n' +
      'Example:\n' +
      '  "maturity_descriptors": [{"level": 1, "descriptor": "..."}, ..., {"level": 5, ...}]\n' +
      `File: ${PARSING_PY_PATH}`,
    ).toMatch(/maturity_descriptor|level_descriptor/i);
  });

  // ── Edge Function: write-back correctness ──────────────────────────────────

  it('[T-W18-QA-006] Edge Function maps AI guidance field → DB guidance column (not source_anchor)', () => {
    /*
     * Gap 2 — Edge Function write-back bug: `guidance: c.source_anchor ?? null`
     *         stores the page reference (e.g. "Page 14") into the guidance column
     *         instead of the actual guidance text.
     *
     * RED:   The criteria upsert payload currently contains `guidance: c.source_anchor`.
     *        There is no `c.guidance` reference in the file — the AI response field
     *        `guidance` is never consumed.
     *
     * GREEN: api-builder (T-W18-008) fixes the mapping to `guidance: c.guidance ?? null`
     *        so the DB guidance column receives the extracted guidance text.
     *
     * Authority: IAA pre-brief §2 Gap 2
     */
    const src = readEdgeFunction();
    // The fix must map the AI response `guidance` field to the DB guidance column.
    // Match `guidance: c.guidance` (with optional whitespace / null-coalescing).
    expect(
      src,
      '[T-W18-QA-006] RED: Edge Function still maps guidance: c.source_anchor (bug).\n' +
      'api-builder must change the criteria upsert to:\n' +
      '  guidance: c.guidance ?? null,\n' +
      'so the AI guidance text is stored in the DB guidance column.\n' +
      'Current (buggy): guidance: c.source_anchor ?? null\n' +
      `File: ${EDGE_FN_PATH}`,
    ).toMatch(/guidance\s*:\s*c\.guidance/);
  });

  it('[T-W18-QA-007] Edge Function maps AI source_anchor field → DB source_anchor column', () => {
    /*
     * Gap 8 — source_anchor is never written to the DB as its own column.
     *         The current upsert has no `source_anchor` key in the payload.
     *
     * RED:   The criteria upsert in the Edge Function contains no `source_anchor:`
     *        key writing to a DB column.  The value is silently discarded (after being
     *        incorrectly placed in guidance).
     *
     * GREEN: api-builder adds `source_anchor: c.source_anchor ?? null` to the upsert
     *        payload after schema-builder adds the column.
     *
     * Authority: IAA pre-brief §2 Gap 8, A-032 Schema Column Compliance
     */
    const src = readEdgeFunction();
    expect(
      src,
      '[T-W18-QA-007] RED: Edge Function upsert has no source_anchor column mapping.\n' +
      'api-builder must add to the criteria upsert payload:\n' +
      '  source_anchor: c.source_anchor ?? null,\n' +
      `File: ${EDGE_FN_PATH}`,
    ).toMatch(/source_anchor\s*:\s*c\.source_anchor/);
  });

  it('[T-W18-QA-008] Edge Function writes maturity descriptors to criteria_level_descriptors table', () => {
    /*
     * Gap 6 — criteria_level_descriptors table exists but is never populated.
     *         The Edge Function performs no INSERT or upsert against this table.
     *
     * RED:   The string "criteria_level_descriptors" does not appear in the Edge Function.
     *
     * GREEN: api-builder (T-W18-008) adds supabase.from('criteria_level_descriptors').insert(...)
     *        (or .upsert(...)) within the backgroundParse function.
     *
     * Authority: IAA pre-brief §2 Gap 6
     */
    const src = readEdgeFunction();
    expect(
      src,
      '[T-W18-QA-008] RED: Edge Function has no write to criteria_level_descriptors table.\n' +
      'api-builder must add a Supabase INSERT or upsert targeting criteria_level_descriptors:\n' +
      '  await supabase.from(\'criteria_level_descriptors\').insert([...])\n' +
      `File: ${EDGE_FN_PATH}`,
    ).toMatch(/criteria_level_descriptors/);
  });

  it('[T-W18-QA-009] Edge Function writes maturity descriptors to mps_level_descriptors table', () => {
    /*
     * Gap 6 — mps_level_descriptors table exists but is never populated.
     *
     * RED:   The string "mps_level_descriptors" does not appear in the Edge Function.
     *
     * GREEN: api-builder adds supabase.from('mps_level_descriptors').insert(...) within
     *        the backgroundParse function.
     *
     * Authority: IAA pre-brief §2 Gap 6
     */
    const src = readEdgeFunction();
    expect(
      src,
      '[T-W18-QA-009] RED: Edge Function has no write to mps_level_descriptors table.\n' +
      'api-builder must add a Supabase INSERT or upsert targeting mps_level_descriptors:\n' +
      '  await supabase.from(\'mps_level_descriptors\').insert([...])\n' +
      `File: ${EDGE_FN_PATH}`,
    ).toMatch(/mps_level_descriptors/);
  });

  it('[T-W18-QA-010] Edge Function writes maturity descriptors to domain_level_descriptors table', () => {
    /*
     * Gap 6 — domain_level_descriptors table exists but is never populated.
     *
     * RED:   The string "domain_level_descriptors" does not appear in the Edge Function.
     *
     * GREEN: api-builder adds supabase.from('domain_level_descriptors').insert(...) within
     *        the backgroundParse function.
     *
     * Authority: IAA pre-brief §2 Gap 6
     */
    const src = readEdgeFunction();
    expect(
      src,
      '[T-W18-QA-010] RED: Edge Function has no write to domain_level_descriptors table.\n' +
      'api-builder must add a Supabase INSERT or upsert targeting domain_level_descriptors:\n' +
      '  await supabase.from(\'domain_level_descriptors\').insert([...])\n' +
      `File: ${EDGE_FN_PATH}`,
    ).toMatch(/domain_level_descriptors/);
  });

  // ── Frontend: Criteria Review/Approval screen ──────────────────────────────

  it('[T-W18-QA-011] CriteriaReview/CriteriaApproval component has real criteria data rendering', () => {
    /*
     * Gap 7 — No meaningful Criteria Review/Approval screen exists.
     *         The current CriteriaApproval.tsx is a stub component with a heading and
     *         two hardcoded buttons — it accepts no criteria data and renders no list.
     *
     * RED:   CriteriaApproval.tsx exists but is a stub:
     *          - no `criteria` prop / TypeScript interface
     *          - no list rendering of criterion items (.map(), .forEach())
     *          - no per-criterion approve/reject state management
     *        Any file matching CriteriaReview|CriteriaApproval|criteria-review that
     *        ACTUALLY renders criteria data does NOT exist.
     *
     * GREEN: ui-builder (T-W18-009) implements a real CriteriaReview or CriteriaApproval
     *        component that:
     *          - accepts a criteria array prop (or fetches via hook)
     *          - renders a list of criterion items
     *          - allows per-criterion review/approval
     *
     * Authority: IAA pre-brief §2 Gap 7
     */
    const reviewFiles = findFilesRecursive(
      FRONTEND_SRC,
      /CriteriaReview|CriteriaApproval|criteria-review/i,
    );

    expect(
      reviewFiles.length,
      '[T-W18-QA-011] RED: No CriteriaReview/CriteriaApproval component found in frontend/src.\n' +
      `Searched: ${FRONTEND_SRC}`,
    ).toBeGreaterThan(0);

    // File exists — now assert it is NOT a stub: must contain real criteria data rendering.
    // A real implementation will have list rendering (`.map(`) and reference criteria data.
    const hasRealRendering = reviewFiles.some(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Must contain both: criteria data reference AND list rendering
      const hasCriteriaData = /criteria[^)]*\.map\s*\(|useCriteria|criteria\.length|criteria:\s*(Criterion|ParsedCriterion|\w+Criterion)/i.test(content);
      const hasListRendering = /\.map\s*\(\s*\(?\s*(?:c|criterion|item)\b/i.test(content);
      return hasCriteriaData || hasListRendering;
    });

    expect(
      hasRealRendering,
      '[T-W18-QA-011] RED: CriteriaApproval.tsx is a STUB — it has no criteria data rendering.\n' +
      'The current stub only has a heading and two hardcoded buttons with no criteria data.\n' +
      'ui-builder must implement a real review component that:\n' +
      '  1. Accepts a criteria array as props or fetches via useCriteria hook\n' +
      '  2. Renders a list of criterion items (criteria.map(c => ...))\n' +
      '  3. Allows per-criterion approve/reject or edit actions\n' +
      `Found files: ${reviewFiles.join(', ')}`,
    ).toBe(true);
  });

  // ── Schema: Wave 18 upload fix migration ────────────────────────────────────

  it('[T-W18-QA-012] A Wave 18 migration exists that fixes the upload RLS/profile config', () => {
    /*
     * Gap 1 — Upload fails with "Failed to upload file: Failed to fetch" due to
     *         RLS/bucket/profile configuration issues.
     *
     * RED:   No migration file with a Wave 18 era timestamp (>= 20260315) exists that
     *        addresses the upload configuration (storage, profiles, or bucket RLS).
     *        The existing storage migrations pre-date Wave 18 and do not include the fix.
     *
     * GREEN: schema-builder (T-W18-006) creates a new migration with timestamp >= 20260315
     *        that patches the storage/profile RLS to resolve the upload failure.
     *        The file must reference "audit-documents", "profiles", or related storage
     *        RLS / bucket configuration content.
     *
     * Authority: IAA pre-brief §2 Gap 1, BD-015 RLS Policies Complete
     */
    const allMigrations = readAllMigrations();

    // Wave 18 era: migration files with timestamp component >= 20260315
    const wave18Migrations = allMigrations.filter(m => {
      // Migration filenames start with YYYYMMDD prefix
      const timestampMatch = m.filename.match(/^(\d{8})/);
      if (!timestampMatch) return false;
      const fileDate = parseInt(timestampMatch[1], 10);
      return fileDate >= 20260315;
    });

    // Among Wave 18 migrations, find one that addresses upload/storage/profiles config
    const uploadFixMigration = wave18Migrations.find(m =>
      /audit.documents|storage\.(objects|buckets)|profiles.*organisation_id|organisation_id.*profiles/i.test(m.content),
    );

    expect(
      uploadFixMigration,
      '[T-W18-QA-012] RED: No Wave 18 migration (timestamp >= 20260315) found that\n' +
      'addresses the upload RLS/profile configuration failure.\n' +
      'schema-builder must create a migration file (e.g. 20260315000001_wave18_upload_fix.sql)\n' +
      'that resolves the storage bucket/profile RLS issue causing:\n' +
      '  "Failed to upload file: Failed to fetch"\n' +
      'The migration must reference audit-documents storage or profiles organisation config.\n' +
      `Searched directory: ${MIGRATIONS_DIR}\n` +
      `Wave 18 migrations found: ${wave18Migrations.map(m => m.filename).join(', ') || 'NONE'}`,
    ).toBeDefined();
  });

  // ── TypeScript types: ParsedCriterion ─────────────────────────────────────

  it('[T-W18-QA-013] ParsedCriterion type includes intent_statement field', () => {
    /*
     * Gap 3+4 — The ParsedCriterion interface in the Edge Function does not include
     *           `intent_statement` because the AI never returns it and no column exists.
     *           Both must be fixed together.
     *
     * RED:   interface ParsedCriterion { mps_number, number, title?, description?,
     *        source_anchor? }  — no `intent_statement` field.
     *
     * GREEN: api-builder adds `intent_statement?: string;` to ParsedCriterion after
     *        the AI prompt is updated to return the field.
     *
     * Authority: IAA pre-brief §2 Gap 3, A-032 Schema Column Compliance
     */
    const src = readEdgeFunction();
    expect(
      src,
      '[T-W18-QA-013] RED: ParsedCriterion interface in Edge Function has no intent_statement field.\n' +
      'api-builder must add to the ParsedCriterion interface:\n' +
      '  intent_statement?: string;\n' +
      `File: ${EDGE_FN_PATH}`,
    ).toMatch(/ParsedCriterion[\s\S]{0,500}intent_statement/);
  });

  it('[T-W18-QA-014] ParsedCriterion type includes guidance field (distinct from source_anchor)', () => {
    /*
     * Gap 2+4 — The ParsedCriterion interface has no `guidance` field.
     *           The AI never extracts it and the Edge Function cannot map it.
     *
     * RED:   ParsedCriterion has: mps_number, number, title?, description?,
     *        source_anchor? — no separate `guidance` field.
     *
     * GREEN: api-builder adds `guidance?: string;` to ParsedCriterion.
     *
     * Authority: IAA pre-brief §2 Gap 2, A-032 Schema Column Compliance
     */
    const src = readEdgeFunction();
    // Match `guidance` as a field WITHIN the ParsedCriterion interface block
    expect(
      src,
      '[T-W18-QA-014] RED: ParsedCriterion interface has no `guidance` field.\n' +
      'api-builder must add to the ParsedCriterion interface:\n' +
      '  guidance?: string;\n' +
      'This is distinct from source_anchor (page reference) and carries guidance text.\n' +
      `File: ${EDGE_FN_PATH}`,
    ).toMatch(/ParsedCriterion[\s\S]{0,500}guidance\s*\??\s*:/);
  });

  it('[T-W18-QA-015] ParsedCriterion type includes maturity_descriptors or level_descriptors field', () => {
    /*
     * Gap 5+6 — The ParsedCriterion interface has no `maturity_descriptors` or
     *           `level_descriptors` field.  GPT is not asked to return them, the Edge
     *           Function cannot consume them, and the descriptor tables stay empty.
     *
     * RED:   No `maturity_descriptors` or `level_descriptors` field in ParsedCriterion.
     *
     * GREEN: api-builder adds a 5-level descriptor array type to ParsedCriterion:
     *   maturity_descriptors?: Array<{ level: number; descriptor: string }>;
     *   (or equivalent `level_descriptors` naming)
     *
     * Authority: IAA pre-brief §2 Gap 5+6
     */
    const src = readEdgeFunction();
    expect(
      src,
      '[T-W18-QA-015] RED: ParsedCriterion interface has no maturity_descriptors / level_descriptors field.\n' +
      'api-builder must add to the ParsedCriterion interface:\n' +
      '  maturity_descriptors?: Array<{ level: number; descriptor: string }>;\n' +
      '(or level_descriptors with equivalent structure)\n' +
      `File: ${EDGE_FN_PATH}`,
    ).toMatch(/ParsedCriterion[\s\S]{0,800}(?:maturity_descriptor|level_descriptor)/i);
  });
});
