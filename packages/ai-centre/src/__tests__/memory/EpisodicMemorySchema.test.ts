/**
 * RED Gate QA Suite — EpisodicMemorySchema (Migration SQL Verification)
 *
 * Wave 9.1 — Schema: Episodic Memory Table (ai_episodic_events)
 * Track A (Foundation Schema)
 *
 * ALL TESTS MUST FAIL (RED) until Wave 9.1 schema-builder creates:
 *   `packages/ai-centre/supabase/migrations/004_ai_episodic_memory.sql`
 *
 * Do NOT modify these tests to pass without a corresponding migration file.
 * Tests verify the migration SQL structure — they are the source of truth for
 * what the schema-builder MUST deliver.
 *
 * References: GRS-009 | APS §7.6 | AAD §9.4
 *
 * Mapped requirements:
 *   GRS-009  Append-only episodic event log with organisation-level tenant isolation
 *   AAD §9.4 ai_episodic_events table definition, RLS policies, immutability rules
 *
 * ⚠️  WAVE 9.1 SCHEMA BUILDER MANDATORY REQUIREMENTS:
 *
 * 1. MIGRATION FILE — create `supabase/migrations/004_ai_episodic_memory.sql`
 *    with full table DDL, indexes, RLS, and immutability rules.
 *
 * 2. TABLE DEFINITION — `CREATE TABLE IF NOT EXISTS ai_episodic_events` with
 *    all required columns (id, organisation_id, session_id, user_id, agent_id,
 *    event_type, capability, summary, full_context, created_at).
 *
 * 3. IMMUTABILITY — SQL rules MUST block UPDATE and DELETE:
 *    - `ai_episodic_events_no_update` rule (same pattern as ai_telemetry)
 *    - `ai_episodic_events_no_delete` rule (same pattern as ai_telemetry)
 *
 * 4. RLS — ENABLE ROW LEVEL SECURITY; INSERT and SELECT policies scoped to
 *    `organisation_id` via `current_setting('app.current_organisation_id', true)`.
 *    No UPDATE or DELETE policies permitted.
 *
 * 5. INDEXES — all 4 required indexes for query performance:
 *    idx_ai_episodic_events_org, idx_ai_episodic_events_session (partial, WHERE NOT NULL),
 *    idx_ai_episodic_events_event_type, idx_ai_episodic_events_created_at
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Migration file path resolution
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve path to the migrations directory relative to this test file.
 * Test file lives at: packages/ai-centre/src/__tests__/memory/
 * Migration lives at: packages/ai-centre/supabase/migrations/
 * Path traversal:     memory/ → __tests__/ → src/ → ai-centre/ (package root)
 * Relative path:      ../../../supabase/migrations/
 */
const MIGRATION_PATH = path.resolve(
  __dirname,
  '../../../supabase/migrations/004_ai_episodic_memory.sql',
);

// ---------------------------------------------------------------------------
// Helper — read migration SQL (lazy, memoised per test run)
// ---------------------------------------------------------------------------

function readMigrationSQL(): string {
  return fs.readFileSync(MIGRATION_PATH, 'utf-8');
}

// ---------------------------------------------------------------------------
// Tests (GRS-009 | AAD §9.4)
// ---------------------------------------------------------------------------

describe('EpisodicMemorySchema — 004_ai_episodic_memory.sql', () => {
  // -------------------------------------------------------------------------
  // File existence
  // -------------------------------------------------------------------------

  it(
    // AAD §9.4 — migration file must exist before any other checks
    'migration file 004_ai_episodic_memory.sql exists at the expected path',
    () => {
      expect(
        fs.existsSync(MIGRATION_PATH),
        `Migration not found at: ${MIGRATION_PATH}\n` +
          'Wave 9.1 schema-builder must create this file.',
      ).toBe(true);
    },
  );

  // -------------------------------------------------------------------------
  // Table DDL
  // -------------------------------------------------------------------------

  it(
    // AAD §9.4 — table creation statement
    'migration contains CREATE TABLE IF NOT EXISTS ai_episodic_events',
    () => {
      const sql = readMigrationSQL();
      expect(sql).toMatch(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+ai_episodic_events/i);
    },
  );

  it(
    // AAD §9.4 — all required columns present in table DDL
    'migration contains all required columns: id, organisation_id, session_id, user_id, agent_id, event_type, capability, summary, full_context, created_at',
    () => {
      const sql = readMigrationSQL();

      // id — UUID primary key with gen_random_uuid() default
      expect(sql).toMatch(/\bid\b.*UUID.*PRIMARY\s+KEY.*gen_random_uuid\(\)/is);

      // organisation_id — TEXT NOT NULL (tenant isolation anchor)
      expect(sql).toMatch(/\borganisation_id\b.*TEXT.*NOT\s+NULL/is);

      // session_id — TEXT nullable
      expect(sql).toMatch(/\bsession_id\b.*TEXT/i);

      // user_id — TEXT nullable
      expect(sql).toMatch(/\buser_id\b.*TEXT/i);

      // agent_id — TEXT nullable
      expect(sql).toMatch(/\bagent_id\b.*TEXT/i);

      // event_type — TEXT NOT NULL
      expect(sql).toMatch(/\bevent_type\b.*TEXT.*NOT\s+NULL/is);

      // capability — TEXT NOT NULL
      expect(sql).toMatch(/\bcapability\b.*TEXT.*NOT\s+NULL/is);

      // summary — TEXT nullable
      expect(sql).toMatch(/\bsummary\b.*TEXT/i);

      // full_context — TEXT nullable
      expect(sql).toMatch(/\bfull_context\b.*TEXT/i);

      // created_at — TIMESTAMPTZ NOT NULL DEFAULT now()
      expect(sql).toMatch(/\bcreated_at\b.*TIMESTAMPTZ.*NOT\s+NULL.*DEFAULT\s+now\(\)/is);
    },
  );

  // -------------------------------------------------------------------------
  // Immutability rules (append-only enforcement)
  // -------------------------------------------------------------------------

  it(
    // GRS-009 | AAD §9.4 — SQL rule blocks UPDATE operations
    'migration contains ai_episodic_events_no_update rule to block UPDATE',
    () => {
      const sql = readMigrationSQL();
      // Must follow the ai_telemetry pattern:
      //   CREATE RULE ai_episodic_events_no_update AS ON UPDATE TO ai_episodic_events DO INSTEAD NOTHING;
      expect(sql).toMatch(/CREATE\s+RULE\s+ai_episodic_events_no_update/i);
      expect(sql).toMatch(/ON\s+UPDATE\s+TO\s+ai_episodic_events\s+DO\s+INSTEAD\s+NOTHING/i);
    },
  );

  it(
    // GRS-009 | AAD §9.4 — SQL rule blocks DELETE operations
    'migration contains ai_episodic_events_no_delete rule to block DELETE',
    () => {
      const sql = readMigrationSQL();
      // Must follow the ai_telemetry pattern:
      //   CREATE RULE ai_episodic_events_no_delete AS ON DELETE TO ai_episodic_events DO INSTEAD NOTHING;
      expect(sql).toMatch(/CREATE\s+RULE\s+ai_episodic_events_no_delete/i);
      expect(sql).toMatch(/ON\s+DELETE\s+TO\s+ai_episodic_events\s+DO\s+INSTEAD\s+NOTHING/i);
    },
  );

  // -------------------------------------------------------------------------
  // Row Level Security
  // -------------------------------------------------------------------------

  it(
    // AAD §9.4 — RLS enabled on ai_episodic_events
    'migration enables Row Level Security on ai_episodic_events',
    () => {
      const sql = readMigrationSQL();
      expect(sql).toMatch(/ALTER\s+TABLE\s+ai_episodic_events\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/i);
    },
  );

  it(
    // AAD §9.4 — INSERT policy exists with correct name
    'migration contains INSERT RLS policy: ai_episodic_events_insert_org_scope',
    () => {
      const sql = readMigrationSQL();
      expect(sql).toMatch(/CREATE\s+POLICY\s+ai_episodic_events_insert_org_scope/i);
      expect(sql).toMatch(/FOR\s+INSERT/i);
    },
  );

  it(
    // AAD §9.4 — SELECT policy exists with org_id scoping
    'migration contains SELECT RLS policy scoped to organisation_id: ai_episodic_events_select_org_scope',
    () => {
      const sql = readMigrationSQL();
      expect(sql).toMatch(/CREATE\s+POLICY\s+ai_episodic_events_select_org_scope/i);
      expect(sql).toMatch(/FOR\s+SELECT/i);
      // Must scope by organisation_id via app.current_organisation_id setting
      expect(sql).toMatch(/organisation_id\s*=\s*current_setting\s*\(\s*'app\.current_organisation_id'/i);
    },
  );

  // -------------------------------------------------------------------------
  // Indexes
  // -------------------------------------------------------------------------

  it(
    // AAD §9.4 — all 4 required indexes present
    'migration contains all 4 required indexes: org, session (partial), event_type, created_at',
    () => {
      const sql = readMigrationSQL();

      // Primary org-scoped query index
      expect(sql).toMatch(/CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS\s+idx_ai_episodic_events_org/i);

      // Partial index on session_id (WHERE session_id IS NOT NULL)
      expect(sql).toMatch(/CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS\s+idx_ai_episodic_events_session/i);
      expect(sql).toMatch(/WHERE\s+session_id\s+IS\s+NOT\s+NULL/i);

      // Event type index for filtering by event category
      expect(sql).toMatch(/CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS\s+idx_ai_episodic_events_event_type/i);

      // Temporal index for time-range queries
      expect(sql).toMatch(/CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS\s+idx_ai_episodic_events_created_at/i);
    },
  );
});
