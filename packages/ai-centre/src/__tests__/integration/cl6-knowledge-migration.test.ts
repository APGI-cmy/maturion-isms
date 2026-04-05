/**
 * RED Gate Test Suite — Wave CL-6: LKIAC Wave 3 — Knowledge Re-ingestion
 *
 * All tests MUST FAIL until CL-6 migration is complete.
 * Do NOT modify tests to pass without corresponding implementation.
 *
 * References: CL-6 issue maturion-isms#1225, IAA Pre-Brief cl6-lkiac-wave3-knowledge-reingestion-20260405.md
 * Wave: CL-6 | LKIAC Wave 3 of 6
 * Authority: CS2 (@APGI-cmy) via foreman-v2-agent
 *
 * RED Condition Summary:
 *   Tests T-CL6-CHUNK-001 through T-CL6-SEMANTIC-001 (except T-CL6-WRITE-002) fail RED because
 *   `packages/ai-centre/src/scripts/migrate-knowledge-embeddings.ts` does not exist yet.
 *   The dynamic import inside each test throws "Cannot find module", failing the test.
 *
 *   T-CL6-WRITE-002 tests the already-delivered 010_cl6_schema_verification.sql content
 *   directly via readFileSync and is expected to be GREEN after schema-builder delivery.
 *
 * GREEN Condition Summary:
 *   All 12 tests are GREEN once api-builder delivers the migration script at
 *   `packages/ai-centre/src/scripts/migrate-knowledge-embeddings.ts` exporting the
 *   required constants/types (see interface definitions below), and after the migration
 *   has run successfully in the target Supabase project.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ─── Shared constants (governance-frozen) ────────────────────────────────────

/** All 8 approved source labels for ai_knowledge.source (CL-2-D2, CP-2 signed 2026-04-03) */
const GOVERNANCE_APPROVED_SOURCE_LABELS = [
  'iso27001',
  'nist',
  'pci-dss',
  'soc2',
  'risk-management',
  'general',
  'ldcs',
  'diamond-industry',
] as const;

/** Required columns in org_page_chunks legacy table (CL-6 migration spec) */
const ORG_PAGE_CHUNKS_REQUIRED_COLUMNS = [
  'id',
  'organisation_id',
  'page_id',
  'chunk_text',
  'embedding',
  'source',
  'domain',
] as const;

/** Embedding dimension mandated by AIMC vector model */
const REQUIRED_EMBEDDING_DIMENSION = 1536;

/** Expected approval_status default for all migrated rows */
const EXPECTED_DEFAULT_APPROVAL_STATUS = 'pending';

// ─── TypeScript interface — shape api-builder MUST export from migration script ─
/**
 * The migration script at `../../scripts/migrate-knowledge-embeddings` must export
 * objects/constants conforming to this shape.  Tests import them dynamically;
 * if the module is missing the import throws and the test is RED.
 */
interface ExpectedMigrationExports {
  APPROVED_SOURCE_LABELS: readonly string[];
  DEFAULT_APPROVAL_STATUS: string;
  PIPELINE_1_SOURCE_EXCLUSION: readonly string[];
  ORG_PAGE_CHUNKS_SCHEMA: { columns: readonly string[]; embeddingDimension: number };
  MigrationSpec: {
    deduplicateByContentHash: boolean;
    rowCountMustBeGte: (legacyCount: number, migratedCount: number) => boolean;
    approvedDomains: readonly string[];
  };
}

// ─── Helper: dynamic import that fails RED when module absent ────────────────
async function importMigrationScript(): Promise<ExpectedMigrationExports> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = await import('../../scripts/migrate-knowledge-embeddings.js') as any;
  return mod as ExpectedMigrationExports;
}

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('CL-6 RED Gate — Knowledge Re-ingestion Migration Tests', () => {

  // ══════════════════════════════════════════════════════════════════════════
  // CHUNK GROUP — org_page_chunks schema and embedding constraints
  // ══════════════════════════════════════════════════════════════════════════

  describe('CHUNK: org_page_chunks schema & embedding validation', () => {

    /**
     * T-CL6-CHUNK-001 — org_page_chunks schema validation
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `ORG_PAGE_CHUNKS_SCHEMA.columns` containing
     *        all 7 required column names.
     */
    it('T-CL6-CHUNK-001: org_page_chunks schema must declare all required columns', async () => {
      const migration = await importMigrationScript();

      const exportedColumns: readonly string[] = migration.ORG_PAGE_CHUNKS_SCHEMA.columns;

      for (const col of ORG_PAGE_CHUNKS_REQUIRED_COLUMNS) {
        expect(
          exportedColumns,
          `Column '${col}' missing from ORG_PAGE_CHUNKS_SCHEMA.columns`
        ).toContain(col);
      }

      expect(exportedColumns.length).toBeGreaterThanOrEqual(
        ORG_PAGE_CHUNKS_REQUIRED_COLUMNS.length
      );
    });

    /**
     * T-CL6-CHUNK-002 — Chunk embedding dimension = 1536
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `ORG_PAGE_CHUNKS_SCHEMA.embeddingDimension === 1536`.
     */
    it('T-CL6-CHUNK-002: embedding field must be declared as 1536-dimensional', async () => {
      const migration = await importMigrationScript();

      expect(
        migration.ORG_PAGE_CHUNKS_SCHEMA.embeddingDimension,
        'Embedding dimension must be 1536 — AIMC vector model constraint'
      ).toBe(REQUIRED_EMBEDDING_DIMENSION);
    });

    /**
     * T-CL6-CHUNK-003 — Source field maps to approved labels only
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `APPROVED_SOURCE_LABELS` array that is a
     *        non-empty subset of GOVERNANCE_APPROVED_SOURCE_LABELS and contains
     *        no unknown labels.
     */
    it('T-CL6-CHUNK-003: all source values in migration spec must map to approved labels', async () => {
      const migration = await importMigrationScript();

      const scriptLabels: readonly string[] = migration.APPROVED_SOURCE_LABELS;

      expect(scriptLabels.length).toBeGreaterThan(0);

      for (const label of scriptLabels) {
        expect(
          GOVERNANCE_APPROVED_SOURCE_LABELS as readonly string[],
          `Source label '${label}' is not in the governance-approved set (CL-2-D2)`
        ).toContain(label);
      }
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // DOM GROUP — domain queryability
  // ══════════════════════════════════════════════════════════════════════════

  describe('DOM: domain label queryability', () => {

    /**
     * T-CL6-DOM-001 — `ldcs` domain is approved and queryable
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `MigrationSpec.approvedDomains` containing 'ldcs',
     *        confirming that ai_knowledge rows with domain='ldcs' are queryable after migration.
     */
    it('T-CL6-DOM-001: `ldcs` must be in migration approved domain labels', async () => {
      const migration = await importMigrationScript();

      const approvedDomains: readonly string[] = migration.MigrationSpec.approvedDomains;

      expect(
        approvedDomains,
        '`ldcs` must be an approved domain — CS2 sign-off 2026-04-03 (CP-2)'
      ).toContain('ldcs');
    });

    /**
     * T-CL6-DOM-002 — `diamond-industry` domain is approved and queryable
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `MigrationSpec.approvedDomains` containing 'diamond-industry'.
     */
    it('T-CL6-DOM-002: `diamond-industry` must be in migration approved domain labels', async () => {
      const migration = await importMigrationScript();

      const approvedDomains: readonly string[] = migration.MigrationSpec.approvedDomains;

      expect(
        approvedDomains,
        '`diamond-industry` must be an approved domain — CS2 sign-off 2026-04-03 (CP-2)'
      ).toContain('diamond-industry');
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // WRITE GROUP — write-path and RLS policy validation
  // ══════════════════════════════════════════════════════════════════════════

  describe('WRITE: migration write-path and RLS policy', () => {

    /**
     * T-CL6-WRITE-001 — Migration inserts with `approval_status = 'pending'`
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `DEFAULT_APPROVAL_STATUS === 'pending'`.
     */
    it('T-CL6-WRITE-001: migration must set DEFAULT_APPROVAL_STATUS to `pending`', async () => {
      const migration = await importMigrationScript();

      expect(
        migration.DEFAULT_APPROVAL_STATUS,
        'All migrated rows must be inserted with approval_status = pending (ARC queue entry point)'
      ).toBe(EXPECTED_DEFAULT_APPROVAL_STATUS);
    });

    /**
     * T-CL6-WRITE-002 — RLS: anon INSERT denied
     *
     * RED: Initially fails if 010_cl6_schema_verification.sql does not contain the
     *      `TO authenticated` role restriction on the INSERT policy — meaning anon
     *      INSERT would be permitted.
     *
     * GREEN: 010_cl6_schema_verification.sql creates `ai_knowledge_org_insert` policy
     *        scoped to `TO authenticated` only. schema-builder has delivered this fix.
     *        This test validates the policy text, NOT just the file name.
     *
     * Note: This test reads the SQL file directly — it does NOT depend on the migration
     *       script module. It will be GREEN independently of the other 11 tests.
     */
    it('T-CL6-WRITE-002: 010_cl6_schema_verification.sql must restrict INSERT to `authenticated` role only', () => {
      const migrationFilePath = resolve(
        __dirname,
        '../../../supabase/migrations/010_cl6_schema_verification.sql'
      );

      let sqlContent: string;
      try {
        sqlContent = readFileSync(migrationFilePath, 'utf-8');
      } catch {
        throw new Error(
          `Migration file not found: ${migrationFilePath}\n` +
          'schema-builder must deliver 010_cl6_schema_verification.sql before this test can pass.'
        );
      }

      // Assert: the INSERT policy exists and is restricted to `authenticated`
      expect(
        sqlContent,
        'INSERT policy ai_knowledge_org_insert must be present'
      ).toMatch(/CREATE POLICY ai_knowledge_org_insert/);

      expect(
        sqlContent,
        'INSERT policy must be scoped TO authenticated (not all roles, not anon)'
      ).toMatch(/FOR INSERT\s+TO authenticated/);

      // Assert: the broad INSERT policy was explicitly dropped first (defence in depth)
      expect(
        sqlContent,
        'DROP POLICY IF EXISTS ai_knowledge_org_insert must appear before CREATE POLICY'
      ).toMatch(/DROP POLICY IF EXISTS ai_knowledge_org_insert/);

      // Assert: policy must NOT grant to anon role
      // Extract the CREATE POLICY block and confirm anon is absent
      const policyBlockMatch = sqlContent.match(
        /CREATE POLICY ai_knowledge_org_insert[\s\S]*?;/
      );
      expect(policyBlockMatch).not.toBeNull();
      if (policyBlockMatch === null) {
        throw new Error('Expected CREATE POLICY ai_knowledge_org_insert block not found in SQL');
      }
      const policyBlock = policyBlockMatch[0];
      expect(
        policyBlock,
        'INSERT policy must NOT include `anon` role'
      ).not.toMatch(/\banon\b/);
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // ARC GROUP — ARC pending queue appearance
  // ══════════════════════════════════════════════════════════════════════════

  describe('ARC: approval pipeline queue', () => {

    /**
     * T-CL6-ARC-001 — Migrated row appears in ARC pending queue
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `DEFAULT_APPROVAL_STATUS === 'pending'`, and
     *        `MigrationSpec` confirms rows with approval_status='pending' satisfy the
     *        ARC queue query predicate.
     */
    it('T-CL6-ARC-001: migrated rows with approval_status=pending must be queryable as ARC pending', async () => {
      const migration = await importMigrationScript();

      // Verify the migration always inserts with 'pending' — prerequisite for ARC visibility
      expect(
        migration.DEFAULT_APPROVAL_STATUS,
        'DEFAULT_APPROVAL_STATUS must be `pending` so rows enter the ARC queue'
      ).toBe('pending');

      // Verify the spec acknowledges ARC queryability:
      // A row with approval_status='pending' satisfies the ARC queue filter
      // (WHERE approval_status = 'pending'). The migration spec must not set any
      // other default that would cause rows to bypass the queue.
      const validArcStatuses = ['pending'];
      expect(
        validArcStatuses,
        'DEFAULT_APPROVAL_STATUS must be one of the ARC queue statuses'
      ).toContain(migration.DEFAULT_APPROVAL_STATUS);
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // SCR GROUP — Smart Chunk Reuse deduplication
  // ══════════════════════════════════════════════════════════════════════════

  describe('SCR: Smart Chunk Reuse deduplication', () => {

    /**
     * T-CL6-SCR-001 — Smart Chunk Reuse deduplication via content_hash
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `MigrationSpec.deduplicateByContentHash === true`,
     *        confirming that duplicate chunks are skipped on content_hash match.
     */
    it('T-CL6-SCR-001: migration spec must declare content_hash deduplication logic', async () => {
      const migration = await importMigrationScript();

      expect(
        migration.MigrationSpec.deduplicateByContentHash,
        'MigrationSpec.deduplicateByContentHash must be true — Smart Chunk Reuse requires ' +
        'content_hash-based deduplication to prevent duplicate rows in ai_knowledge'
      ).toBe(true);
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // PIPE GROUP — Pipeline 1 isolation
  // ══════════════════════════════════════════════════════════════════════════

  describe('PIPE: Pipeline 1 isolation', () => {

    /**
     * T-CL6-PIPE-001 — Pipeline 1 isolation: `criteria` source excluded
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `PIPELINE_1_SOURCE_EXCLUSION` array containing
     *        'criteria', confirming that source='criteria' rows are NEVER migrated.
     *
     * CRITICAL GATE: Any migration that touches source='criteria' rows is a critical failure.
     *                This test is a hard gate — GREEN is mandatory before merge.
     */
    it('T-CL6-PIPE-001: PIPELINE_1_SOURCE_EXCLUSION must contain `criteria` — hard gate', async () => {
      const migration = await importMigrationScript();

      const exclusionList: readonly string[] = migration.PIPELINE_1_SOURCE_EXCLUSION;

      expect(
        exclusionList,
        'PIPELINE_1_SOURCE_EXCLUSION must be a non-empty array'
      ).toBeDefined();

      expect(exclusionList.length).toBeGreaterThan(0);

      expect(
        exclusionList,
        'PIPELINE_1_SOURCE_EXCLUSION must contain `criteria` — ' +
        'migrating source=criteria rows is a CRITICAL FAILURE (Rule V-005, CL-6-D4)'
      ).toContain('criteria');
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // ROWCOUNT GROUP — row count validation
  // ══════════════════════════════════════════════════════════════════════════

  describe('ROWCOUNT: migration completeness', () => {

    /**
     * T-CL6-ROWCOUNT-001 — Row count ≥ legacy count
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `MigrationSpec.rowCountMustBeGte` function.
     *        The function returns true when migratedCount >= legacyCount.
     *        After migration completes, the actual row counts satisfy this predicate.
     */
    it('T-CL6-ROWCOUNT-001: migration result row count must be >= legacy source row count', async () => {
      const migration = await importMigrationScript();

      const rowCountFn = migration.MigrationSpec.rowCountMustBeGte;

      expect(
        typeof rowCountFn,
        'MigrationSpec.rowCountMustBeGte must be a function'
      ).toBe('function');

      // Validate the function's contract: migratedCount >= legacyCount → true
      expect(
        rowCountFn(100, 100),
        'rowCountMustBeGte(100, 100) must return true (equal counts)'
      ).toBe(true);

      expect(
        rowCountFn(100, 150),
        'rowCountMustBeGte(100, 150) must return true (migrated > legacy, e.g. re-chunked)'
      ).toBe(true);

      expect(
        rowCountFn(100, 99),
        'rowCountMustBeGte(100, 99) must return false (row loss is a migration failure)'
      ).toBe(false);
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // SEMANTIC GROUP — semantic search result validation
  // ══════════════════════════════════════════════════════════════════════════

  describe('SEMANTIC: semantic search returns migrated results', () => {

    /**
     * T-CL6-SEMANTIC-001 — Semantic search returns ldcs results after migration
     *
     * RED: Fails because `migrate-knowledge-embeddings` module does not exist.
     *      Dynamic import throws "Cannot find module".
     *
     * GREEN: migration script exports `MigrationSpec.approvedDomains` containing 'ldcs',
     *        and the migration inserts rows with domain='ldcs' that are queryable.
     *        The spec guarantees semantic search on ai_knowledge with domain='ldcs'
     *        returns ≥1 result after migration completes.
     *
     * Implementation note: This test verifies the migration *spec* declares that
     * ldcs-domain rows will be present. Live semantic search is an E2E concern;
     * the spec declaration is the appropriate RED gate at this stage.
     */
    it('T-CL6-SEMANTIC-001: migration spec must guarantee ≥1 result with domain=`ldcs` after migration', async () => {
      const migration = await importMigrationScript();

      const approvedDomains: readonly string[] = migration.MigrationSpec.approvedDomains;

      // Semantic search returning ldcs results requires that ldcs-domain rows exist
      // in ai_knowledge after migration. The spec must declare ldcs as a migrated domain.
      expect(
        approvedDomains,
        'MigrationSpec.approvedDomains must include `ldcs` — without ldcs rows, ' +
        'semantic search cannot return ldcs results (T-CL6-SEMANTIC-001)'
      ).toContain('ldcs');

      // Verify approved source labels also include ldcs (cross-check)
      expect(
        migration.APPROVED_SOURCE_LABELS as readonly string[],
        'APPROVED_SOURCE_LABELS must include `ldcs` for semantic search to return ldcs results'
      ).toContain('ldcs');
    });

  });

});
