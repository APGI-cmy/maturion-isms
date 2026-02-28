/**
 * RED Gate QA Suite — Wave 9.2 ai_knowledge Metadata Columns
 *
 * Wave 9.2 — Schema: ai_knowledge table amendment (Knowledge Base Inventory support)
 *
 * ALL TESTS MUST FAIL (RED) until Wave 9.2 schema-builder creates:
 *   `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql`
 *
 * Do NOT modify these tests to pass without corresponding implementation.
 * Tests verify the migration SQL structure — they are the source of truth
 * for what the schema-builder MUST deliver.
 *
 * References:
 *   ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md §4.1
 *   ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md §5.1
 *   Issue #658 — Wave 9.2: ai_knowledge Amendment
 *
 * Authority: CS2 (@APGI-cmy) via foreman-v2-agent session-069-20260227
 *
 * Test IDs: W9.2-T-011 through W9.2-T-018
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
  '../../../supabase/migrations/006_ai_knowledge_metadata.sql',
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

describe('Wave 9.2 — ai_knowledge Metadata Columns Schema', () => {
  // -------------------------------------------------------------------------
  // W9.2-T-011: Migration file existence
  // -------------------------------------------------------------------------

  it('W9.2-T-011: migration file 006_ai_knowledge_metadata.sql exists', () => {
    expect(
      fs.existsSync(MIGRATION_PATH),
      `Migration file not found at: ${MIGRATION_PATH}`,
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-012: Migration uses ALTER TABLE ai_knowledge
  // -------------------------------------------------------------------------

  it('W9.2-T-012: migration contains ALTER TABLE ai_knowledge', () => {
    const sql = readMigrationSQL();

    expect(sql, 'SQL must contain ALTER TABLE ai_knowledge').toMatch(
      /ALTER\s+TABLE\s+ai_knowledge/i,
    );
  });

  // -------------------------------------------------------------------------
  // W9.2-T-013: domain column is added
  // -------------------------------------------------------------------------

  it('W9.2-T-013: migration adds domain TEXT column to ai_knowledge', () => {
    const sql = readMigrationSQL();

    expect(sql, 'domain column must be TEXT').toMatch(/\bdomain\b\s+TEXT/i);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-014: module column is added
  // -------------------------------------------------------------------------

  it('W9.2-T-014: migration adds module TEXT column to ai_knowledge', () => {
    const sql = readMigrationSQL();

    expect(sql, 'module column must be TEXT').toMatch(/\bmodule\b\s+TEXT/i);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-015: standard_ref column is added
  // -------------------------------------------------------------------------

  it('W9.2-T-015: migration adds standard_ref TEXT column to ai_knowledge', () => {
    const sql = readMigrationSQL();

    expect(sql, 'standard_ref column must be TEXT').toMatch(/\bstandard_ref\b\s+TEXT/i);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-016: freshness_date column is added as TIMESTAMPTZ
  // -------------------------------------------------------------------------

  it('W9.2-T-016: migration adds freshness_date TIMESTAMPTZ column to ai_knowledge', () => {
    const sql = readMigrationSQL();

    expect(sql, 'freshness_date column must be TIMESTAMPTZ').toMatch(
      /\bfreshness_date\b\s+TIMESTAMPTZ/i,
    );
  });

  // -------------------------------------------------------------------------
  // W9.2-T-017: approval_status CHECK constraint with pending/approved/retired
  // -------------------------------------------------------------------------

  it("W9.2-T-017: approval_status CHECK constraint permits only 'pending', 'approved', 'retired'", () => {
    const sql = readMigrationSQL();

    expect(sql, 'approval_status column must be present').toMatch(/\bapproval_status\b/i);

    expect(
      sql,
      "approval_status CHECK constraint must include 'pending'",
    ).toMatch(/CHECK\s*\([^)]*approval_status\s+IN\s*\([^)]*'pending'/is);

    expect(
      sql,
      "approval_status CHECK constraint must include 'approved'",
    ).toMatch(/CHECK\s*\([^)]*approval_status\s+IN\s*\([^)]*'approved'/is);

    expect(
      sql,
      "approval_status CHECK constraint must include 'retired'",
    ).toMatch(/CHECK\s*\([^)]*approval_status\s+IN\s*\([^)]*'retired'/is);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-018: Index on approval_status is created
  // -------------------------------------------------------------------------

  it('W9.2-T-018: migration creates an index on approval_status for filtered queries', () => {
    const sql = readMigrationSQL();

    expect(sql, 'CREATE INDEX on approval_status must be present').toMatch(
      /CREATE\s+INDEX\s+(IF\s+NOT\s+EXISTS\s+)?\S+\s+ON\s+ai_knowledge[^;]*\(\s*approval_status\s*\)/is,
    );
  });
});
