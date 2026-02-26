/**
 * RED Gate QA Suite — Schema Test Template Utility
 *
 * Wave 9.1-FU — Gap 3: Schema Test Template Utility
 * Track A (Foundation Test Tooling)
 *
 * Agent Assignment:  schema-builder (Wave 9.1-FU)
 * Issue Reference:   Wave 9.1-FU (Compliance & Data Integrity Gaps)
 * Contract Phase:    QA-to-Red (Phase 3 — Build Script)
 *
 * ALL TESTS MUST FAIL (RED) until Wave 9.1-FU schema-builder creates:
 *   `packages/ai-centre/src/__tests__/utils/schema-test-template.ts`
 *
 * Tests verify that the utility exports and correctly implements:
 *   - readMigrationSQL(path)         — reads a migration file to string
 *   - assertColumn(sql, name, type)  — validates column definitions
 *   - assertIndex(sql, name)         — validates index presence
 *   - assertCheckConstraint(sql, …)  — validates CHECK constraint values
 *
 * Failure mode: These tests FAIL at module-import level because
 * `../utils/schema-test-template` does not yet exist.  That IS the RED gate.
 * Once schema-builder creates the utility, the import resolves and each
 * test must then pass individually on its own logic.
 *
 * References: Wave 9.1-FU architecture specification
 *
 * ⚠️  WAVE 9.1-FU SCHEMA BUILDER MANDATORY REQUIREMENTS:
 *
 * 1. CREATE utility file at:
 *      packages/ai-centre/src/__tests__/utils/schema-test-template.ts
 *
 * 2. EXPORT the following four functions with correct TypeScript signatures:
 *      readMigrationSQL(migrationPath: string): string
 *      assertColumn(sql, columnName, dataType, options?): void
 *      assertIndex(sql, indexName, options?): void
 *      assertCheckConstraint(sql, columnName, allowedValues): void
 *
 * 3. assertColumn, assertIndex, assertCheckConstraint MUST call vitest
 *    expect() assertions internally — failures must surface as test failures.
 */

import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// ⚠️  RED GATE — This import WILL FAIL (module not found) until
// Wave 9.1-FU schema-builder creates schema-test-template.ts.
// ---------------------------------------------------------------------------
import {
  readMigrationSQL,
  assertColumn,
  assertIndex,
  assertCheckConstraint,
} from './schema-test-template';

// ---------------------------------------------------------------------------
// Path resolution — test fixtures
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Path to an existing migration used as a known-good test fixture.
 * Test file lives at: packages/ai-centre/src/__tests__/utils/
 * Migration lives at: packages/ai-centre/supabase/migrations/
 * Traversal:          utils/ → __tests__/ → src/ → ai-centre/ (root)
 * Relative path:      ../../../supabase/migrations/
 */
const MIGRATION_004 = path.resolve(
  __dirname,
  '../../../supabase/migrations/004_ai_episodic_memory.sql',
);

// ---------------------------------------------------------------------------
// Inline SQL fixtures used for assertColumn / assertIndex / assertCheckConstraint
// ---------------------------------------------------------------------------

const SQL_WITH_COLUMNS = `
  CREATE TABLE test_fixture (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    description     TEXT,
    score           INTEGER     NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

const SQL_WITH_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_fixture_name    ON test_fixture (name);
  CREATE INDEX IF NOT EXISTS idx_fixture_session ON test_fixture (session_id) WHERE session_id IS NOT NULL;
  CREATE INDEX IF NOT EXISTS idx_fixture_created ON test_fixture (created_at);
`;

const SQL_WITH_CHECK = `
  CREATE TABLE capability_fixture (
    id         UUID PRIMARY KEY,
    capability TEXT NOT NULL CHECK (capability IN ('advisory', 'analysis', 'embeddings'))
  );
`;

const SQL_WITHOUT_CHECK = `
  CREATE TABLE no_constraint_fixture (
    id         UUID PRIMARY KEY,
    capability TEXT NOT NULL
  );
`;

// ---------------------------------------------------------------------------
// Tests: readMigrationSQL
// ---------------------------------------------------------------------------

describe('schema-test-template — readMigrationSQL', () => {
  it(
    'readMigrationSQL is exported as a function',
    () => {
      expect(typeof readMigrationSQL).toBe('function');
    },
  );

  it(
    'readMigrationSQL reads a file at the given path and returns a non-empty string',
    () => {
      const contents = readMigrationSQL(MIGRATION_004);
      expect(typeof contents).toBe('string');
      expect(contents.length).toBeGreaterThan(0);
    },
  );

  it(
    'readMigrationSQL returns the SQL text for the 004_ai_episodic_memory migration',
    () => {
      const contents = readMigrationSQL(MIGRATION_004);
      expect(contents).toContain('ai_episodic_events');
      expect(contents).toContain('CREATE TABLE');
    },
  );

  it(
    'readMigrationSQL throws (or rejects) when the file path does not exist',
    () => {
      expect(() => readMigrationSQL('/non/existent/path/migration.sql')).toThrow();
    },
  );
});

// ---------------------------------------------------------------------------
// Tests: assertColumn
// ---------------------------------------------------------------------------

describe('schema-test-template — assertColumn', () => {
  it(
    'assertColumn is exported as a function',
    () => {
      expect(typeof assertColumn).toBe('function');
    },
  );

  it(
    'assertColumn does NOT throw when the column exists with the expected data type',
    () => {
      expect(() => assertColumn(SQL_WITH_COLUMNS, 'name', 'TEXT')).not.toThrow();
    },
  );

  it(
    'assertColumn does NOT throw for a NOT NULL column when { notNull: true } is specified',
    () => {
      expect(() =>
        assertColumn(SQL_WITH_COLUMNS, 'name', 'TEXT', { notNull: true }),
      ).not.toThrow();
    },
  );

  it(
    'assertColumn does NOT throw for a nullable column when { nullable: true } is specified',
    () => {
      expect(() =>
        assertColumn(SQL_WITH_COLUMNS, 'description', 'TEXT', { nullable: true }),
      ).not.toThrow();
    },
  );

  it(
    'assertColumn does NOT throw for a TIMESTAMPTZ column',
    () => {
      expect(() => assertColumn(SQL_WITH_COLUMNS, 'created_at', 'TIMESTAMPTZ')).not.toThrow();
    },
  );

  it(
    'assertColumn THROWS when the named column does not exist in the SQL',
    () => {
      expect(() => assertColumn(SQL_WITH_COLUMNS, 'nonexistent_column', 'TEXT')).toThrow();
    },
  );

  it(
    'assertColumn THROWS when the column exists but with a different data type',
    () => {
      // 'score' is INTEGER — asserting TEXT should fail
      expect(() => assertColumn(SQL_WITH_COLUMNS, 'score', 'TEXT')).toThrow();
    },
  );
});

// ---------------------------------------------------------------------------
// Tests: assertIndex
// ---------------------------------------------------------------------------

describe('schema-test-template — assertIndex', () => {
  it(
    'assertIndex is exported as a function',
    () => {
      expect(typeof assertIndex).toBe('function');
    },
  );

  it(
    'assertIndex does NOT throw when the named index exists',
    () => {
      expect(() => assertIndex(SQL_WITH_INDEXES, 'idx_fixture_name')).not.toThrow();
    },
  );

  it(
    'assertIndex does NOT throw for a partial index when { partial: true } is specified',
    () => {
      expect(() =>
        assertIndex(SQL_WITH_INDEXES, 'idx_fixture_session', { partial: true }),
      ).not.toThrow();
    },
  );

  it(
    'assertIndex does NOT throw for a non-partial index when { partial: false } is specified',
    () => {
      expect(() =>
        assertIndex(SQL_WITH_INDEXES, 'idx_fixture_created', { partial: false }),
      ).not.toThrow();
    },
  );

  it(
    'assertIndex THROWS when the named index does not exist in the SQL',
    () => {
      expect(() => assertIndex(SQL_WITH_INDEXES, 'idx_nonexistent_index')).toThrow();
    },
  );

  it(
    'assertIndex THROWS for a non-partial index when { partial: true } is specified',
    () => {
      // idx_fixture_name has no WHERE clause — it is not partial
      expect(() =>
        assertIndex(SQL_WITH_INDEXES, 'idx_fixture_name', { partial: true }),
      ).toThrow();
    },
  );
});

// ---------------------------------------------------------------------------
// Tests: assertCheckConstraint
// ---------------------------------------------------------------------------

describe('schema-test-template — assertCheckConstraint', () => {
  it(
    'assertCheckConstraint is exported as a function',
    () => {
      expect(typeof assertCheckConstraint).toBe('function');
    },
  );

  it(
    'assertCheckConstraint does NOT throw when CHECK constraint contains all allowed values',
    () => {
      expect(() =>
        assertCheckConstraint(SQL_WITH_CHECK, 'capability', [
          'advisory',
          'analysis',
          'embeddings',
        ]),
      ).not.toThrow();
    },
  );

  it(
    'assertCheckConstraint does NOT throw when checking a single value that is present',
    () => {
      expect(() =>
        assertCheckConstraint(SQL_WITH_CHECK, 'capability', ['advisory']),
      ).not.toThrow();
    },
  );

  it(
    'assertCheckConstraint THROWS when no CHECK constraint exists for the column',
    () => {
      expect(() =>
        assertCheckConstraint(SQL_WITHOUT_CHECK, 'capability', ['advisory', 'analysis']),
      ).toThrow();
    },
  );

  it(
    'assertCheckConstraint THROWS when a required value is absent from the constraint',
    () => {
      // SQL_WITH_CHECK only has: 'advisory', 'analysis', 'embeddings'
      // Requesting 'document-generation' should fail
      expect(() =>
        assertCheckConstraint(SQL_WITH_CHECK, 'capability', [
          'advisory',
          'analysis',
          'embeddings',
          'document-generation',
        ]),
      ).toThrow();
    },
  );

  it(
    'assertCheckConstraint THROWS when ALL values are missing (no constraint at all)',
    () => {
      expect(() =>
        assertCheckConstraint(SQL_WITHOUT_CHECK, 'capability', [
          'advisory',
          'analysis',
          'embeddings',
          'document-generation',
          'image-generation',
          'deep-search',
          'video-generation',
          'algorithm-execution',
        ]),
      ).toThrow();
    },
  );
});
