/**
 * Schema Test Suite — Migration 011: ai_episodic_events capability CHECK constraint (GAP-009)
 *
 * Verifies migration 011_ai_episodic_capability_rag.sql correctly adds 'rag' to the
 * capability CHECK constraint on ai_episodic_events, resolving the Capability.RAG
 * type/schema mismatch found during CL-11-D4 audit (F-D4-001 remediation).
 *
 * References:
 *   GAP-009 / F-D4-001 — CL-11-D4 audit
 *   APS §7.4 — RAG pipeline (Wave 5)
 *   Capability enum (packages/ai-centre/src/types/index.ts)
 *   iaa-token-session-gap009-wave-gap-009-20260407.md — carry-forward CF-001
 *
 * Test IDs: GAP009-SCH-T-001 through GAP009-SCH-T-005
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATION_011_PATH = path.resolve(
  __dirname,
  '../../../supabase/migrations/011_ai_episodic_capability_rag.sql',
);

const MIGRATION_004_PATH = path.resolve(
  __dirname,
  '../../../supabase/migrations/004_ai_episodic_memory.sql',
);

function readSQL(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

describe('GAP-009 — ai_episodic_events capability CHECK constraint (migration 011)', () => {
  // -------------------------------------------------------------------------
  // GAP009-SCH-T-001: Migration file existence
  // -------------------------------------------------------------------------
  it('GAP009-SCH-T-001: migration file 011_ai_episodic_capability_rag.sql exists', () => {
    expect(
      fs.existsSync(MIGRATION_011_PATH),
      'Migration 011_ai_episodic_capability_rag.sql must exist in packages/ai-centre/supabase/migrations/',
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // GAP009-SCH-T-002: Migration drops the old CHECK constraint
  // -------------------------------------------------------------------------
  it('GAP009-SCH-T-002: migration drops the old capability CHECK constraint', () => {
    const sql = readSQL(MIGRATION_011_PATH);
    expect(
      sql,
      'Migration must DROP the old anonymous capability CHECK constraint',
    ).toMatch(/DROP\s+CONSTRAINT\s+IF\s+EXISTS\s+ai_episodic_events_capability_check/i);
  });

  // -------------------------------------------------------------------------
  // GAP009-SCH-T-003: Migration adds new CHECK constraint including 'rag'
  // -------------------------------------------------------------------------
  it("GAP009-SCH-T-003: migration adds a CHECK constraint containing 'rag'", () => {
    const sql = readSQL(MIGRATION_011_PATH);
    expect(
      sql,
      "New CHECK constraint must include 'rag'",
    ).toMatch(/'rag'/i);
    expect(
      sql,
      'Migration must ADD CONSTRAINT to ai_episodic_events',
    ).toMatch(/ADD\s+CONSTRAINT\s+ai_episodic_events_capability_check/i);
  });

  // -------------------------------------------------------------------------
  // GAP009-SCH-T-004: New constraint retains all 8 original capability values
  // -------------------------------------------------------------------------
  it('GAP009-SCH-T-004: migration retains all 8 original capability values in new CHECK constraint', () => {
    const sql = readSQL(MIGRATION_011_PATH);
    const requiredValues = [
      'advisory',
      'analysis',
      'embeddings',
      'document-generation',
      'image-generation',
      'deep-search',
      'video-generation',
      'algorithm-execution',
    ];
    for (const value of requiredValues) {
      expect(
        sql,
        `New CHECK constraint must retain original value '${value}'`,
      ).toContain(`'${value}'`);
    }
  });

  // -------------------------------------------------------------------------
  // GAP009-SCH-T-005: Migration 004 confirms capability CHECK originally missing 'rag'
  // (documents the root cause: pre-existing omission in 004_ai_episodic_memory.sql)
  // -------------------------------------------------------------------------
  it("GAP009-SCH-T-005: migration 004 does NOT contain 'rag' in the capability CHECK (root cause documentation)", () => {
    const sql = readSQL(MIGRATION_004_PATH);
    // Extract the CHECK constraint block from migration 004
    const checkMatch = sql.match(/capability\s+IN\s*\([\s\S]*?\)/i);
    expect(
      checkMatch,
      'Migration 004 must contain a capability IN (...) CHECK block',
    ).not.toBeNull();
    const checkBlock = checkMatch![0];
    expect(
      checkBlock,
      "Migration 004 CHECK constraint must NOT contain 'rag' (that is the pre-fix root cause)",
    ).not.toContain("'rag'");
  });
});
