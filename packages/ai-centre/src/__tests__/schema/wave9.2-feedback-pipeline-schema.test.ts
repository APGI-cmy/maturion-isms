/**
 * RED Gate QA Suite — Wave 9.2 Feedback Pipeline Schema
 *
 * Wave 9.2 — Schema: AI Feedback Pipeline (Self-Learning Loop Migration to AIMC)
 *
 * ALL TESTS MUST FAIL (RED) until Wave 9.2 schema-builder creates:
 *   `packages/ai-centre/supabase/migrations/005_ai_feedback_pipeline.sql`
 *   `packages/ai-centre/src/types/feedback.ts`
 *
 * Do NOT modify these tests to pass without corresponding implementation.
 * Tests verify the migration SQL structure and TypeScript types — they are
 * the source of truth for what the schema-builder MUST deliver.
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.1 (schema)
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §6.1 (RED QA definition)
 *   Issue #613 — AI Feedback Pipeline (AIMC Wave 9.2)
 *
 * Authority: CS2 (@APGI-cmy) via foreman-v2-agent session-060-20260226
 *
 * Test IDs: W9.2-T-001 through W9.2-T-010
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
 * Path traversal:     schema/ → __tests__/ → src/ → ai-centre/ (package root)
 * Relative path:      ../../../supabase/migrations/
 */
const MIGRATION_PATH = path.resolve(
  __dirname,
  '../../../supabase/migrations/005_ai_feedback_pipeline.sql',
);

/**
 * Resolve path to the feedback types file.
 * Types file lives at: packages/ai-centre/src/types/feedback.ts
 * Relative path from test: ../../types/feedback.ts
 */
const TYPES_FEEDBACK_PATH = path.resolve(
  __dirname,
  '../../types/feedback.ts',
);

// ---------------------------------------------------------------------------
// Helper — read migration SQL (throws clearly if file not found)
// ---------------------------------------------------------------------------

function readMigrationSQL(): string {
  return fs.readFileSync(MIGRATION_PATH, 'utf-8');
}

function readFeedbackTypes(): string {
  return fs.readFileSync(TYPES_FEEDBACK_PATH, 'utf-8');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Wave 9.2 — AI Feedback Pipeline Schema', () => {
  // -------------------------------------------------------------------------
  // W9.2-T-001: Migration file existence
  // -------------------------------------------------------------------------

  it('W9.2-T-001: migration file 005_ai_feedback_pipeline.sql exists', () => {
    expect(
      fs.existsSync(MIGRATION_PATH),
      `Migration file not found at: ${MIGRATION_PATH}`,
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-002: ai_feedback_events table has id column as UUID PK
  // -------------------------------------------------------------------------

  it('W9.2-T-002: ai_feedback_events table has id column UUID PK', () => {
    const sql = readMigrationSQL();

    // Verify CREATE TABLE for ai_feedback_events exists
    expect(sql, 'SQL must contain CREATE TABLE ai_feedback_events').toMatch(
      /CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?ai_feedback_events/i,
    );

    // Verify id column as UUID PRIMARY KEY
    expect(sql, 'id column must be UUID PRIMARY KEY with gen_random_uuid()').toMatch(
      /\bid\b\s+UUID\s+PRIMARY\s+KEY\s+DEFAULT\s+gen_random_uuid\(\)/i,
    );
  });

  // -------------------------------------------------------------------------
  // W9.2-T-003: arc_status CHECK constraint exists
  // -------------------------------------------------------------------------

  it("W9.2-T-003: ai_feedback_events has arc_status CHECK constraint with pending/approved/rejected", () => {
    const sql = readMigrationSQL();

    // Verify arc_status column exists
    expect(sql, 'arc_status column must be present').toMatch(/\barc_status\b/i);

    // Verify CHECK constraint with all three values
    expect(
      sql,
      "arc_status CHECK constraint must include 'pending'",
    ).toMatch(/CHECK\s*\([^)]*arc_status\s+IN\s*\([^)]*'pending'/is);

    expect(
      sql,
      "arc_status CHECK constraint must include 'approved'",
    ).toMatch(/CHECK\s*\([^)]*arc_status\s+IN\s*\([^)]*'approved'/is);

    expect(
      sql,
      "arc_status CHECK constraint must include 'rejected'",
    ).toMatch(/CHECK\s*\([^)]*arc_status\s+IN\s*\([^)]*'rejected'/is);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-004: feedback_type CHECK constraint exists
  // -------------------------------------------------------------------------

  it("W9.2-T-004: ai_feedback_events has feedback_type CHECK constraint with positive/negative/correction/flag", () => {
    const sql = readMigrationSQL();

    // Verify feedback_type column exists
    expect(sql, 'feedback_type column must be present').toMatch(/\bfeedback_type\b/i);

    // Verify CHECK constraint with all four values
    expect(
      sql,
      "feedback_type CHECK constraint must include 'positive'",
    ).toMatch(/CHECK\s*\([^)]*feedback_type\s+IN\s*\([^)]*'positive'/is);

    expect(
      sql,
      "feedback_type CHECK constraint must include 'negative'",
    ).toMatch(/CHECK\s*\([^)]*feedback_type\s+IN\s*\([^)]*'negative'/is);

    expect(
      sql,
      "feedback_type CHECK constraint must include 'correction'",
    ).toMatch(/CHECK\s*\([^)]*feedback_type\s+IN\s*\([^)]*'correction'/is);

    expect(
      sql,
      "feedback_type CHECK constraint must include 'flag'",
    ).toMatch(/CHECK\s*\([^)]*feedback_type\s+IN\s*\([^)]*'flag'/is);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-005: RLS insert policy exists
  // -------------------------------------------------------------------------

  it('W9.2-T-005: ai_feedback_events RLS insert policy exists', () => {
    const sql = readMigrationSQL();

    // Enable RLS must be present
    expect(sql, 'ENABLE ROW LEVEL SECURITY must be present').toMatch(
      /ALTER\s+TABLE\s+ai_feedback_events\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/i,
    );

    // INSERT policy must exist
    expect(sql, 'An INSERT CREATE POLICY for ai_feedback_events must exist').toMatch(
      /CREATE\s+POLICY\s+\S+\s+ON\s+ai_feedback_events[^;]*FOR\s+INSERT/is,
    );
  });

  // -------------------------------------------------------------------------
  // W9.2-T-006: RLS org select policy exists
  // -------------------------------------------------------------------------

  it('W9.2-T-006: ai_feedback_events RLS org select policy exists', () => {
    const sql = readMigrationSQL();

    // SELECT policy scoped to organisation must exist
    expect(sql, 'A SELECT CREATE POLICY for ai_feedback_events must exist').toMatch(
      /CREATE\s+POLICY\s+\S+\s+ON\s+ai_feedback_events[^;]*FOR\s+SELECT/is,
    );

    // Must reference organisation_id for org isolation
    expect(
      sql,
      'SELECT policy must reference organisation_id for org isolation',
    ).toMatch(/organisation_id/i);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-007: RLS service_role UPDATE policy exists
  // -------------------------------------------------------------------------

  it('W9.2-T-007: ai_feedback_events RLS arc update policy exists (service_role)', () => {
    const sql = readMigrationSQL();

    // UPDATE policy must exist
    expect(sql, 'An UPDATE CREATE POLICY for ai_feedback_events must exist').toMatch(
      /CREATE\s+POLICY\s+\S+\s+ON\s+ai_feedback_events[^;]*FOR\s+UPDATE/is,
    );

    // Must be restricted to service_role
    expect(
      sql,
      'UPDATE policy must be restricted to service_role',
    ).toMatch(/service_role/i);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-008: TypeScript type FeedbackEvent is exported from types/feedback.ts
  // -------------------------------------------------------------------------

  it('W9.2-T-008: TypeScript type FeedbackEvent is exported from types/feedback.ts', () => {
    expect(
      fs.existsSync(TYPES_FEEDBACK_PATH),
      `Feedback types file not found at: ${TYPES_FEEDBACK_PATH}`,
    ).toBe(true);

    const source = readFeedbackTypes();

    expect(
      source,
      'FeedbackEvent interface must be exported from feedback.ts',
    ).toMatch(/export\s+(interface|type)\s+FeedbackEvent\b/);
  });

  // -------------------------------------------------------------------------
  // W9.2-T-009: ARCReviewStatus is exported from feedback.ts
  // -------------------------------------------------------------------------

  it("W9.2-T-009: ARCReviewStatus is a union type of 'pending' | 'approved' | 'rejected'", () => {
    const source = readFeedbackTypes();

    expect(
      source,
      'ARCReviewStatus must be exported from feedback.ts',
    ).toMatch(/export\s+type\s+ARCReviewStatus\b/);

    // Verify all three union members are present
    expect(source, "ARCReviewStatus must include 'pending'").toContain("'pending'");
    expect(source, "ARCReviewStatus must include 'approved'").toContain("'approved'");
    expect(source, "ARCReviewStatus must include 'rejected'").toContain("'rejected'");
  });

  // -------------------------------------------------------------------------
  // W9.2-T-010: FeedbackPipelineInterface declares all required methods
  // -------------------------------------------------------------------------

  it('W9.2-T-010: FeedbackPipelineInterface declares submit/listPending/approve/reject', () => {
    const source = readFeedbackTypes();

    expect(
      source,
      'FeedbackPipelineInterface must be exported from feedback.ts',
    ).toMatch(/export\s+interface\s+FeedbackPipelineInterface\b/);

    expect(
      source,
      'FeedbackPipelineInterface must declare submit() method',
    ).toMatch(/\bsubmit\s*\(/);

    expect(
      source,
      'FeedbackPipelineInterface must declare listPending() method',
    ).toMatch(/\blistPending\s*\(/);

    expect(
      source,
      'FeedbackPipelineInterface must declare approve() method',
    ).toMatch(/\bapprove\s*\(/);

    expect(
      source,
      'FeedbackPipelineInterface must declare reject() method',
    ).toMatch(/\breject\s*\(/);
  });
});
