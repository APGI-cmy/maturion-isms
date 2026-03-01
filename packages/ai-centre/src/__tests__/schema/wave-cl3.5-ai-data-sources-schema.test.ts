/**
 * RED Gate QA Suite — Wave CL-3.5 ai_data_sources Schema
 *
 * Wave CL-3.5 — AIMC Data Sources Registry
 *
 * ALL TESTS MUST FAIL (RED) until Wave CL-3.5 schema-builder creates:
 *   `packages/ai-centre/supabase/migrations/007_ai_data_sources.sql`
 *
 * Do NOT modify these tests to pass without corresponding implementation.
 * Tests verify the migration SQL structure — they are the source of truth
 * for what the schema-builder MUST deliver.
 *
 * References:
 *   governance/aimc/CL3_5_DATA_MODEL_SPEC.md §3 (Table Definition)
 *   governance/aimc/CL3_5_DATA_MODEL_SPEC.md §4 (RLS Design)
 *   governance/aimc/CL3_5_DATA_MODEL_SPEC.md §5 (Indexes)
 *   governance/aimc/CL3_5_DATA_MODEL_SPEC.md §7 (Constraints Summary)
 *
 * Authority: CS2 (@APGI-cmy) via foreman-v2-agent session-082 (Wave CL-3.5)
 *
 * Test IDs: CL3.5-T-001 through CL3.5-T-015
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve path to the migrations directory relative to this test file.
 * Test file lives at: packages/ai-centre/src/__tests__/schema/
 * Migration lives at: packages/ai-centre/supabase/migrations/
 * Relative path:      ../../../supabase/migrations/
 */
const MIGRATION_PATH = path.resolve(
  __dirname,
  '../../../supabase/migrations/007_ai_data_sources.sql',
);

// ---------------------------------------------------------------------------
// Helper — read migration SQL (throws clearly if file not found)
// ---------------------------------------------------------------------------

function readMigrationSQL(): string {
  return fs.readFileSync(MIGRATION_PATH, 'utf-8');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Wave CL-3.5 — ai_data_sources Schema Migration', () => {
  // -------------------------------------------------------------------------
  // CL3.5-T-001: Migration file existence
  // -------------------------------------------------------------------------

  it('CL3.5-T-001: migration file 007_ai_data_sources.sql exists', () => {
    expect(
      fs.existsSync(MIGRATION_PATH),
      `Migration file not found at: ${MIGRATION_PATH}`,
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-002: Table creation
  // -------------------------------------------------------------------------

  it('CL3.5-T-002: migration creates table ai_data_sources', () => {
    const sql = readMigrationSQL();

    expect(sql, 'SQL must contain CREATE TABLE ai_data_sources').toMatch(
      /CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?(public\.)?ai_data_sources/i,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-003: id column — UUID PRIMARY KEY with gen_random_uuid()
  // -------------------------------------------------------------------------

  it('CL3.5-T-003: id column is UUID PRIMARY KEY with gen_random_uuid()', () => {
    const sql = readMigrationSQL();

    expect(sql, 'id column must be UUID type').toMatch(/\bid\b\s+UUID/i);
    expect(sql, 'id column must be PRIMARY KEY').toMatch(/\bid\b[^,\n]*PRIMARY\s+KEY/i);
    expect(sql, 'id column must default to gen_random_uuid()').toMatch(
      /\bid\b[^,\n]*gen_random_uuid\s*\(\s*\)/i,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-004: organisation_id — TEXT NOT NULL (British spelling)
  // -------------------------------------------------------------------------

  it('CL3.5-T-004: organisation_id is TEXT NOT NULL (British spelling)', () => {
    const sql = readMigrationSQL();

    // Must use British spelling — organisation_id, NOT organization_id
    expect(sql, 'Must use British spelling: organisation_id (not organization_id)').toMatch(
      /\borganisation_id\b/i,
    );
    expect(sql, 'organisation_id must not appear with American spelling').not.toMatch(
      /\borganization_id\b/i,
    );
    expect(sql, 'organisation_id must be TEXT NOT NULL').toMatch(
      /\borganisation_id\b\s+TEXT\s+NOT\s+NULL/i,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-005: source_name — TEXT NOT NULL
  // -------------------------------------------------------------------------

  it('CL3.5-T-005: source_name is TEXT NOT NULL', () => {
    const sql = readMigrationSQL();

    expect(sql, 'source_name must be TEXT NOT NULL').toMatch(
      /\bsource_name\b\s+TEXT\s+NOT\s+NULL/i,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-006: source_type — TEXT NOT NULL with CHECK constraint
  // -------------------------------------------------------------------------

  it('CL3.5-T-006: source_type is TEXT NOT NULL with CHECK constraint', () => {
    const sql = readMigrationSQL();

    expect(sql, 'source_type must be TEXT NOT NULL').toMatch(
      /\bsource_type\b\s+TEXT\s+NOT\s+NULL/i,
    );
    expect(sql, 'source_type must have a CHECK constraint').toMatch(
      /CHECK\s*\([^)]*source_type/is,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-007: source_type CHECK — permits only 'supabase', 'google_drive',
  //              'sharepoint', 'api'
  // -------------------------------------------------------------------------

  it("CL3.5-T-007: source_type CHECK constraint permits only 'supabase', 'google_drive', 'sharepoint', 'api'", () => {
    const sql = readMigrationSQL();

    expect(
      sql,
      "source_type CHECK must include 'supabase'",
    ).toMatch(/CHECK\s*\([^)]*source_type\s+IN\s*\([^)]*'supabase'/is);

    expect(
      sql,
      "source_type CHECK must include 'google_drive'",
    ).toMatch(/CHECK\s*\([^)]*source_type\s+IN\s*\([^)]*'google_drive'/is);

    expect(
      sql,
      "source_type CHECK must include 'sharepoint'",
    ).toMatch(/CHECK\s*\([^)]*source_type\s+IN\s*\([^)]*'sharepoint'/is);

    expect(
      sql,
      "source_type CHECK must include 'api'",
    ).toMatch(/CHECK\s*\([^)]*source_type\s+IN\s*\([^)]*'api'/is);
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-008: status — TEXT NOT NULL with CHECK constraint, default 'inactive'
  // -------------------------------------------------------------------------

  it("CL3.5-T-008: status is TEXT NOT NULL with CHECK constraint, default 'inactive'", () => {
    const sql = readMigrationSQL();

    expect(sql, 'status must be TEXT NOT NULL').toMatch(/\bstatus\b\s+TEXT\s+NOT\s+NULL/i);
    expect(sql, 'status must have a CHECK constraint').toMatch(
      /CHECK\s*\([^)]*status/is,
    );
    expect(sql, "status must default to 'inactive'").toMatch(
      /\bstatus\b[^,\n]*DEFAULT\s+'inactive'/i,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-009: status CHECK — permits only 'active', 'inactive', 'syncing', 'error'
  // -------------------------------------------------------------------------

  it("CL3.5-T-009: status CHECK constraint permits only 'active', 'inactive', 'syncing', 'error'", () => {
    const sql = readMigrationSQL();

    expect(
      sql,
      "status CHECK must include 'active'",
    ).toMatch(/CHECK\s*\([^)]*status\s+IN\s*\([^)]*'active'/is);

    expect(
      sql,
      "status CHECK must include 'inactive'",
    ).toMatch(/CHECK\s*\([^)]*status\s+IN\s*\([^)]*'inactive'/is);

    expect(
      sql,
      "status CHECK must include 'syncing'",
    ).toMatch(/CHECK\s*\([^)]*status\s+IN\s*\([^)]*'syncing'/is);

    expect(
      sql,
      "status CHECK must include 'error'",
    ).toMatch(/CHECK\s*\([^)]*status\s+IN\s*\([^)]*'error'/is);
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-010: RLS is enabled on ai_data_sources
  // -------------------------------------------------------------------------

  it('CL3.5-T-010: RLS is enabled on ai_data_sources (ENABLE ROW LEVEL SECURITY)', () => {
    const sql = readMigrationSQL();

    expect(sql, 'ENABLE ROW LEVEL SECURITY must be present on ai_data_sources').toMatch(
      /ALTER\s+TABLE\s+(public\.)?ai_data_sources\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/i,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-011: RLS policy uses AIMC organisation isolation pattern
  //              (current_setting('app.current_organisation_id', true))
  // -------------------------------------------------------------------------

  it("CL3.5-T-011: RLS policy uses current_setting('app.current_organisation_id', true) AIMC pattern", () => {
    const sql = readMigrationSQL();

    expect(sql, "RLS USING clause must reference current_setting('app.current_organisation_id', true)").toMatch(
      /current_setting\s*\(\s*'app\.current_organisation_id'\s*,\s*true\s*\)/i,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-012: idx_ai_data_sources_org index on organisation_id
  // -------------------------------------------------------------------------

  it('CL3.5-T-012: idx_ai_data_sources_org index on organisation_id is created', () => {
    const sql = readMigrationSQL();

    expect(sql, 'idx_ai_data_sources_org index must be present').toMatch(
      /CREATE\s+INDEX\s+(IF\s+NOT\s+EXISTS\s+)?idx_ai_data_sources_org\s+ON\s+(public\.)?ai_data_sources[^;]*\(\s*organisation_id\s*\)/is,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-013: idx_ai_data_sources_type index on source_type
  // -------------------------------------------------------------------------

  it('CL3.5-T-013: idx_ai_data_sources_type index on source_type is created', () => {
    const sql = readMigrationSQL();

    expect(sql, 'idx_ai_data_sources_type index must be present').toMatch(
      /CREATE\s+INDEX\s+(IF\s+NOT\s+EXISTS\s+)?idx_ai_data_sources_type\s+ON\s+(public\.)?ai_data_sources[^;]*\(\s*source_type\s*\)/is,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-014: idx_ai_data_sources_status index on status
  // -------------------------------------------------------------------------

  it('CL3.5-T-014: idx_ai_data_sources_status index on status is created', () => {
    const sql = readMigrationSQL();

    expect(sql, 'idx_ai_data_sources_status index must be present').toMatch(
      /CREATE\s+INDEX\s+(IF\s+NOT\s+EXISTS\s+)?idx_ai_data_sources_status\s+ON\s+(public\.)?ai_data_sources[^;]*\(\s*status\s*\)/is,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-015: connection_config — JSONB NOT NULL with default '{}'
  // -------------------------------------------------------------------------

  it("CL3.5-T-015: connection_config is JSONB NOT NULL with default '{}'", () => {
    const sql = readMigrationSQL();

    expect(sql, 'connection_config must be JSONB NOT NULL').toMatch(
      /\bconnection_config\b\s+JSONB\s+NOT\s+NULL/i,
    );
    expect(sql, "connection_config must default to '{}'").toMatch(
      /\bconnection_config\b[^,\n]*DEFAULT\s+'{}'/i,
    );
  });
});
