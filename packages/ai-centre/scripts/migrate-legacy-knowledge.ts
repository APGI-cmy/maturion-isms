/**
 * CL-6 Migration Script — LKIAC Wave 3 Knowledge Re-ingestion
 *
 * Wave:         CL-6 (LKIAC Wave 3 — Knowledge Re-ingestion Migration)
 * Branch:       copilot/cl-6-relaunch-knowledge-ingestion
 * Issue:        #1240
 * Deliverable:  CL-6-D2
 * Agent:        api-builder
 *
 * Architecture Freeze: `.agent-admin/architecture/cl6-architecture-freeze-20260406.md`
 * Authority:    CS2 (@APGI-cmy) via CEP v1.8.0 §Wave CL-6
 *
 * SECURITY (CL6-FFA-014):
 *   All Supabase connection strings come exclusively from environment variables:
 *     - LEGACY_SUPABASE_URL
 *     - LEGACY_SUPABASE_SERVICE_KEY
 *     - AIMC_SUPABASE_URL
 *     - AIMC_SUPABASE_SERVICE_KEY
 *   No hardcoded project IDs are permitted in this file.
 */

// @supabase/supabase-js is imported dynamically inside runMigration() so that
// the constants exported from this module (used by the CL-6-D1 test suite)
// are resolvable without requiring the Supabase package at module-load time.
// The actual migration runtime requires AIMC_SUPABASE_URL, AIMC_SUPABASE_SERVICE_KEY,
// LEGACY_SUPABASE_URL, and LEGACY_SUPABASE_SERVICE_KEY to be set.
import * as crypto from 'node:crypto';

// ---------------------------------------------------------------------------
// Exported constants — all consumed by the CL-6-D1 RED gate test suite
// ---------------------------------------------------------------------------

/**
 * CL6-FFA-004 — Approved domain source labels for ai_knowledge.source_label.
 * Adopted from CL-2-D2 domain mapping + CP-2 additions (ldcs, diamond-industry).
 */
export const APPROVED_SOURCE_LABELS = [
  'iso27001',
  'nist',
  'pci-dss',
  'soc2',
  'risk-management',
  'general',
  'ldcs',
  'diamond-industry',
] as const;

/**
 * CL6-FFA-005 — All migrated rows receive approval_status = 'pending'.
 * Human review gates promotion to 'approved'.
 */
export const DEFAULT_APPROVAL_STATUS = 'pending' as const;

/**
 * ADR-005 / CL6-FFA-006 — Pipeline 1 source exclusion token.
 * Sources matching any entry in this array are excluded from migration.
 * 'criteria' sources belong exclusively to Pipeline 1 (CriteriaUpload flow).
 */
export const PIPELINE_1_SOURCE_EXCLUSION = ['criteria'] as const;

/**
 * CL6-FFA-010 — Schema descriptor mapping org_page_chunks (source) to
 * ai_knowledge (target) column set, plus the required embedding dimension.
 */
export const ORG_PAGE_CHUNKS_SCHEMA = {
  columns: [
    'id',
    'organisation_id',
    'content',
    'source',
    'source_url',
    'metadata',
    'embedding',
    'content_hash',
    'approval_status',
    'source_label',
    'created_at',
  ] as string[],
  /** CL6-FFA-003 — Must match AIMC vector model (OpenAI-compatible 1536-dim). */
  embeddingDimension: 1536,
} as const;

/**
 * MIGRATION_SPEC — Full migration specification.
 * Consumed by test suite (CL-6-D1) to verify governance compliance.
 */
export const MIGRATION_SPEC = {
  /** CL6-FFA-009 — SHA-256 content_hash deduplication prevents duplicate rows on re-runs. */
  deduplicateByContentHash: true,

  /** CEP §CL-6 — Batched fetch: 100 rows per batch with per-row error isolation. */
  batchSize: 100,

  /** CL6-FFA-007 — RLS policy scoped to authenticated role only; anon INSERT prohibited. */
  rlsPolicy: {
    name: 'ai_knowledge_org_insert',
    roles: ['authenticated'] as string[],
  },

  /** CL6-FFA-008 — ARC queue must be able to query migrated knowledge by domain. */
  arcQueueIntegration: {
    domainQueryable: true,
  },

  /** Architecture freeze §Migration Report — migrated count must be ≥ legacy count. */
  rowValidation: {
    migratedCountMustBeAtLeastLegacyCount: true,
  },

  /**
   * CL6-FFA-004 — Domain validation rules V-001 through V-005.
   * Enforces domain tag governance and security constraints at row level.
   */
  domainValidationRules: [
    { id: 'V-001', description: 'Source label must be in APPROVED_SOURCE_LABELS' },
    { id: 'V-002', description: 'Embedding dimension must be 1536' },
    { id: 'V-003', description: 'content_hash must be SHA-256 of content' },
    { id: 'V-004', description: 'Pipeline 1 sources (criteria) are excluded' },
    { id: 'V-005', description: 'approval_status must be DEFAULT_APPROVAL_STATUS on insert' },
  ],
} as const;

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

type ApprovedSourceLabel = (typeof APPROVED_SOURCE_LABELS)[number];

// SupabaseClient type — referenced only in internal function signatures below.
// Using a local interface avoids a hard dependency on @supabase/supabase-js types
// at the module level (the package is loaded dynamically at runtime).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface LegacyRow {
  id: string;
  organisation_id: string;
  content: string;
  source?: string;
  source_url?: string;
  metadata?: Record<string, unknown>;
  embedding?: number[];
  source_label?: string;
  created_at?: string;
}

interface AimcRow {
  organisation_id: string;
  content: string;
  source: string;
  source_url: string | null;
  metadata: Record<string, unknown>;
  embedding: number[] | null;
  content_hash: string;
  approval_status: typeof DEFAULT_APPROVAL_STATUS;
  source_label: ApprovedSourceLabel;
  created_at: string;
}

interface MigrationResult {
  legacyTotal: number;
  migrated: number;
  skippedDedup: number;
  skippedPipeline1: number;
  errors: number;
  perDomainCounts: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Compute SHA-256 hash of a string — CL6-FFA-009 / V-003.
 * CL6-FFA-014: uses node crypto, not any hardcoded value.
 */
function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Resolve the approved source label for a row.
 * Falls back to 'general' if source is not in the approved set.
 * V-001: must be in APPROVED_SOURCE_LABELS.
 */
function resolveSourceLabel(rawLabel?: string): ApprovedSourceLabel {
  if (rawLabel && (APPROVED_SOURCE_LABELS as readonly string[]).includes(rawLabel)) {
    return rawLabel as ApprovedSourceLabel;
  }
  return 'general';
}

/**
 * Check whether a source value is excluded by Pipeline 1 isolation (ADR-005).
 * V-004: Pipeline 1 sources (criteria) are excluded.
 */
function isPipeline1Source(source?: string): boolean {
  if (!source) return false;
  return (PIPELINE_1_SOURCE_EXCLUSION as readonly string[]).some(
    (exclusion) => source.toLowerCase().includes(exclusion),
  );
}

/**
 * CL6-FFA-014 — Read Supabase credentials from environment variables ONLY.
 * No hardcoded project IDs, URLs, or service keys.
 */
function getEnvOrThrow(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new Error(
      `Required environment variable "${varName}" is not set. ` +
        'Migration cannot proceed without all four Supabase credentials.',
    );
  }
  return value;
}

// ---------------------------------------------------------------------------
// Core migration logic
// ---------------------------------------------------------------------------

/**
 * Fetch a batch of rows from the legacy Supabase project.
 * Reads from the org_page_chunks table (source of migrated knowledge).
 * CL6-FFA-014: URL and service key come from LEGACY_SUPABASE_URL and
 * LEGACY_SUPABASE_SERVICE_KEY environment variables.
 */
async function fetchLegacyBatch(
  legacyClient: SupabaseClient,
  offset: number,
  batchSize: number,
): Promise<LegacyRow[]> {
  const { data, error } = await legacyClient
    .from('org_page_chunks')
    .select(
      'id, organisation_id, content, source, source_url, metadata, embedding, source_label, created_at',
    )
    .range(offset, offset + batchSize - 1);

  if (error) {
    throw new Error(`Failed to fetch legacy batch at offset ${offset}: ${error.message}`);
  }
  return (data ?? []) as LegacyRow[];
}

/**
 * Check whether a content_hash already exists in the AIMC ai_knowledge table.
 * CL6-FFA-009 — deduplication by SHA-256 content_hash.
 */
async function contentHashExists(
  aimcClient: SupabaseClient,
  contentHash: string,
): Promise<boolean> {
  const { count, error } = await aimcClient
    .from('ai_knowledge')
    .select('id', { count: 'exact', head: true })
    .eq('content_hash', contentHash);

  if (error) {
    throw new Error(`Failed to check content_hash existence: ${error.message}`);
  }
  return (count ?? 0) > 0;
}

/**
 * Insert a batch of rows into the AIMC ai_knowledge table.
 * CL6-FFA-014: URL and service key come from AIMC_SUPABASE_URL and
 * AIMC_SUPABASE_SERVICE_KEY environment variables.
 */
async function insertAimcBatch(
  aimcClient: SupabaseClient,
  rows: AimcRow[],
): Promise<void> {
  if (rows.length === 0) return;

  const { error } = await aimcClient.from('ai_knowledge').insert(rows);

  if (error) {
    throw new Error(`Failed to insert batch into ai_knowledge: ${error.message}`);
  }
}

/**
 * CL6-FFA-003 / V-002 — Validate or regenerate embedding.
 * If the legacy row has an embedding of the correct dimension (1536), reuse it.
 * Otherwise return null (embedding will need to be re-generated via the AIMC
 * embedding pipeline post-migration).
 */
function validateEmbedding(embedding?: number[]): number[] | null {
  if (
    Array.isArray(embedding) &&
    embedding.length === ORG_PAGE_CHUNKS_SCHEMA.embeddingDimension
  ) {
    return embedding;
  }
  // Embedding missing or wrong dimension — leave null for re-embedding
  return null;
}

// ---------------------------------------------------------------------------
// Main migration entry point
// ---------------------------------------------------------------------------

/**
 * runMigration — Orchestrates the full LKIAC Wave 3 knowledge re-ingestion.
 *
 * Reads from legacy Supabase project (via LEGACY_SUPABASE_URL + LEGACY_SUPABASE_SERVICE_KEY)
 * and inserts into AIMC ai_knowledge (via AIMC_SUPABASE_URL + AIMC_SUPABASE_SERVICE_KEY).
 *
 * Governance:
 *   - CL6-FFA-005: Sets approval_status = DEFAULT_APPROVAL_STATUS ('pending') on all rows
 *   - CL6-FFA-006: Skips Pipeline 1 sources (PIPELINE_1_SOURCE_EXCLUSION)
 *   - CL6-FFA-009: Deduplicates by SHA-256 content_hash
 *   - CL6-FFA-014: Credentials from env vars only
 *   - ADR-005:     Pipeline 1 files not touched
 */
export async function runMigration(): Promise<MigrationResult> {
  // CL6-FFA-014: All credentials from environment variables
  const legacyUrl = getEnvOrThrow('LEGACY_SUPABASE_URL');
  const legacyKey = getEnvOrThrow('LEGACY_SUPABASE_SERVICE_KEY');
  const aimcUrl = getEnvOrThrow('AIMC_SUPABASE_URL');
  const aimcKey = getEnvOrThrow('AIMC_SUPABASE_SERVICE_KEY');

  // Dynamic import: @supabase/supabase-js is only required at runtime
  // (not at module load time, keeping tests runnable without the package installed).
  const { createClient } = await import('@supabase/supabase-js');
  const legacyClient: SupabaseClient = createClient(legacyUrl, legacyKey);
  const aimcClient: SupabaseClient = createClient(aimcUrl, aimcKey);

  const result: MigrationResult = {
    legacyTotal: 0,
    migrated: 0,
    skippedDedup: 0,
    skippedPipeline1: 0,
    errors: 0,
    perDomainCounts: {},
  };

  // Determine total legacy row count
  const { count: legacyTotal, error: countError } = await legacyClient
    .from('org_page_chunks')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    throw new Error(`Failed to count legacy rows: ${countError.message}`);
  }
  result.legacyTotal = legacyTotal ?? 0;

  let offset = 0;
  const { batchSize } = MIGRATION_SPEC;

  while (offset < result.legacyTotal) {
    const batch = await fetchLegacyBatch(legacyClient, offset, batchSize);
    if (batch.length === 0) break;

    const rowsToInsert: AimcRow[] = [];

    for (const row of batch) {
      try {
        // V-004 / ADR-005: Skip Pipeline 1 sources
        if (isPipeline1Source(row.source)) {
          result.skippedPipeline1++;
          continue;
        }

        // V-003 / CL6-FFA-009: Compute SHA-256 content_hash
        const contentHash = sha256(row.content);

        // CL6-FFA-009: Deduplication — skip if content_hash already exists
        const isDuplicate = await contentHashExists(aimcClient, contentHash);
        if (isDuplicate) {
          result.skippedDedup++;
          continue;
        }

        // V-001: Resolve approved source label
        const sourceLabel = resolveSourceLabel(row.source_label ?? row.source);

        // V-002: Validate embedding dimension
        const embedding = validateEmbedding(row.embedding);

        const aimcRow: AimcRow = {
          organisation_id: row.organisation_id,
          content: row.content,
          source: row.source ?? 'general',
          source_url: row.source_url ?? null,
          metadata: row.metadata ?? {},
          embedding,
          content_hash: contentHash,
          // V-005 / CL6-FFA-005: All migrated rows get approval_status = 'pending'
          approval_status: DEFAULT_APPROVAL_STATUS,
          source_label: sourceLabel,
          created_at: row.created_at ?? new Date().toISOString(),
        };

        rowsToInsert.push(aimcRow);

        // Track per-domain counts (CL6-FFA-008 — ARC queue queryability)
        result.perDomainCounts[sourceLabel] =
          (result.perDomainCounts[sourceLabel] ?? 0) + 1;
      } catch (rowError) {
        // Per-row error isolation — log and continue
        console.error(`Error processing row ${row.id}:`, rowError);
        result.errors++;
      }
    }

    // Batch insert
    if (rowsToInsert.length > 0) {
      await insertAimcBatch(aimcClient, rowsToInsert);
      result.migrated += rowsToInsert.length;
    }

    offset += batchSize;
  }

  // rowValidation (T-CL6-ROW-001): Verify migrated count ≥ legacy count minus exclusions
  const expectedMinimum = result.legacyTotal - result.skippedPipeline1;
  if (MIGRATION_SPEC.rowValidation.migratedCountMustBeAtLeastLegacyCount) {
    const effectiveMigrated = result.migrated + result.skippedDedup;
    if (effectiveMigrated < expectedMinimum) {
      throw new Error(
        `Row validation failed: effective migrated rows (${effectiveMigrated}) ` +
          `is less than expected minimum (${expectedMinimum}).`,
      );
    }
  }

  return result;
}
