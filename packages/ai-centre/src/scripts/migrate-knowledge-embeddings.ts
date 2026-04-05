/**
 * CL-6 Migration Script — Knowledge Re-ingestion
 *
 * Wave: CL-6 | LKIAC Wave 3 of 6
 * Task: CL-6-D2
 * Reference: IAA Pre-Brief cl6-lkiac-wave3-knowledge-reingestion-20260405.md
 * Authority: api-builder under Foreman supervision
 * Branch: copilot/cl-6-migrate-knowledge-embeddings
 *
 * Purpose: Migrate rows from legacy Supabase `org_page_chunks` table into
 *          AIMC `ai_knowledge` table with domain/source validation, deduplication
 *          by content_hash, and Pipeline 1 isolation.
 *
 * Security (IAA SB-001): ALL credentials via environment variables — NEVER hardcoded.
 *
 * Environment variables required at runtime:
 *   LEGACY_SUPABASE_URL        — URL of legacy Supabase project
 *   LEGACY_SUPABASE_SERVICE_KEY — Service role key for legacy project
 *   AIMC_SUPABASE_URL          — URL of AIMC Supabase project
 *   AIMC_SUPABASE_SERVICE_KEY  — Service role key for AIMC project
 */

import { createHash } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Governance-frozen constants ──────────────────────────────────────────────

/**
 * All 8 approved source labels for ai_knowledge.source
 * (CL-2-D2, CP-2 signed 2026-04-03)
 */
export const APPROVED_SOURCE_LABELS: string[] = [
  'iso27001',
  'nist',
  'pci-dss',
  'soc2',
  'risk-management',
  'general',
  'ldcs',
  'diamond-industry',
];

/**
 * Default approval_status for all rows migrated via this script.
 * All migrated rows enter the ARC review queue as 'pending'.
 * Rule V-004: approval_status = 'pending' on all migrated rows.
 */
export const DEFAULT_APPROVAL_STATUS = 'pending' as const;

/**
 * Source labels excluded from this migration pipeline.
 * Rule V-005: source='criteria' rows belong to Pipeline 1 (criteria ingestion)
 * and MUST NEVER be migrated via this script — critical isolation hard gate.
 */
export const PIPELINE_1_SOURCE_EXCLUSION: string[] = ['criteria'];

/**
 * Schema descriptor for the legacy org_page_chunks table.
 * Columns and embedding dimension are governance-frozen for CL-6.
 */
export const ORG_PAGE_CHUNKS_SCHEMA = {
  columns: [
    'id',
    'organisation_id',
    'page_id',
    'chunk_text',
    'embedding',
    'source',
    'domain',
  ],
  embeddingDimension: 1536,
} as const;

// ─── MigrationSpec interface ──────────────────────────────────────────────────

/**
 * Shape of the migration specification object.
 * Tests import and access MigrationSpec as a runtime value.
 */
export interface MigrationSpecShape {
  /** Whether to deduplicate rows by content_hash (Smart Chunk Reuse T-CL6-SCR-001). */
  deduplicateByContentHash: boolean;
  /**
   * Row count validation predicate.
   * Returns true when the new table count is >= the legacy count.
   * A return value of false indicates a CRITICAL migration failure (row loss).
   */
  rowCountMustBeGte: (legacyCount: number, newCount: number) => boolean;
  /** Approved domain labels for ai_knowledge.domain (CL-6, CP-2). */
  approvedDomains: string[];
}

/**
 * Governance-frozen migration specification.
 * Exported as `MigrationSpec` (value) so tests can import and introspect it directly.
 */
export const MigrationSpec: MigrationSpecShape = {
  deduplicateByContentHash: true,
  rowCountMustBeGte: (legacyCount: number, newCount: number): boolean =>
    newCount >= legacyCount,
  approvedDomains: [
    'iso27001',
    'nist',
    'pci-dss',
    'soc2',
    'risk-management',
    'general',
    'ldcs',
    'diamond-industry',
  ],
};

// ─── Column mapping ───────────────────────────────────────────────────────────

/** Maps legacy org_page_chunks columns to ai_knowledge target columns. */
const COLUMN_MAP = {
  organisation_id: 'organisation_id',
  page_id: 'document_id',
  chunk_text: 'content',
  source: 'source',
  domain: 'domain',
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface LegacyRow {
  id: string;
  organisation_id: string;
  page_id: string;
  chunk_text: string;
  embedding: number[] | null;
  source: string | null;
  domain: string | null;
}

interface AiKnowledgeInsert {
  organisation_id: string;
  document_id: string;
  content: string;
  source: string;
  domain: string;
  approval_status: typeof DEFAULT_APPROVAL_STATUS;
  content_hash: string;
  chunk_index: number;
}

export interface MigrationReport {
  legacyCount: number;
  rowsMigrated: number;
  rowsSkipped: number;
  rowsFlagged: number;
  rowCountMatch: boolean;
  domainDistribution: Record<string, number>;
  timestamp: string;
  durationMs: number;
  criticalFailure: boolean;
  criticalFailureReason?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute a deterministic SHA-256 content hash for deduplication.
 * Uses the raw chunk_text as input.
 */
function computeContentHash(chunkText: string): string {
  return createHash('sha256').update(chunkText, 'utf8').digest('hex');
}

/**
 * Sleep for `ms` milliseconds (used for retry backoff).
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a fetch operation with exponential backoff.
 * Max 3 retries with 1s, 2s, 4s delays.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  label = 'operation'
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000;
        console.warn(`[migrate] ${label} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delayMs}ms...`);
        await sleep(delayMs);
      }
    }
  }
  throw lastError;
}

// ─── Validation helpers ───────────────────────────────────────────────────────

/**
 * Validate a row's source label per domain-handling rules V-001–V-005.
 *
 * V-001: Unknown source → FLAGGED, skip
 * V-002: NULL source → use 'general'
 * V-005: source='criteria' → REJECT (Pipeline 1 isolation hard gate)
 *
 * Returns { valid: true, resolvedSource } or { valid: false, reason }.
 */
function validateSource(
  rawSource: string | null
): { valid: true; resolvedSource: string } | { valid: false; reason: string } {
  // V-005: Pipeline 1 isolation hard gate — reject criteria source
  if (rawSource !== null && PIPELINE_1_SOURCE_EXCLUSION.includes(rawSource)) {
    return { valid: false, reason: `V-005: source='criteria' is Pipeline 1 isolation reject` };
  }

  // V-002: NULL source → normalise to 'general'
  if (rawSource === null || rawSource.trim() === '') {
    return { valid: true, resolvedSource: 'general' };
  }

  // V-001: Unknown source → FLAGGED, skip
  if (!APPROVED_SOURCE_LABELS.includes(rawSource)) {
    return { valid: false, reason: `V-001: unknown source label '${rawSource}'` };
  }

  return { valid: true, resolvedSource: rawSource };
}

/**
 * Validate a row's domain label per rule V-003.
 *
 * V-003: Unknown domain → FLAGGED, fallback to 'general'
 *
 * Returns { resolvedDomain, flagged }.
 */
function validateDomain(
  rawDomain: string | null
): { resolvedDomain: string; flagged: boolean } {
  if (rawDomain === null || rawDomain.trim() === '') {
    return { resolvedDomain: 'general', flagged: false };
  }

  if (!MigrationSpec.approvedDomains.includes(rawDomain)) {
    console.warn(`[migrate] V-003: unknown domain '${rawDomain}', flagging and falling back to 'general'`);
    return { resolvedDomain: 'general', flagged: true };
  }

  return { resolvedDomain: rawDomain, flagged: false };
}

// ─── Supabase REST client helpers ─────────────────────────────────────────────

interface SupabaseConfig {
  url: string;
  serviceKey: string;
}

/**
 * Fetch a batch of rows from the legacy org_page_chunks table via Supabase REST API.
 * Uses service role key (bypasses RLS).
 */
async function fetchLegacyBatch(
  config: SupabaseConfig,
  offset: number,
  limit: number
): Promise<LegacyRow[]> {
  const url = `${config.url}/rest/v1/org_page_chunks?select=id,organisation_id,page_id,chunk_text,source,domain&offset=${offset}&limit=${limit}`;

  const response = await withRetry(
    () =>
      fetch(url, {
        headers: {
          apikey: config.serviceKey,
          Authorization: `Bearer ${config.serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'count=exact',
        },
      }),
    3,
    `fetchLegacyBatch(offset=${offset})`
  );

  if (!response.ok) {
    throw new Error(`Legacy fetch failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as LegacyRow[];
  return data;
}

/**
 * Get the total row count from legacy org_page_chunks.
 */
async function getLegacyRowCount(config: SupabaseConfig): Promise<number> {
  const url = `${config.url}/rest/v1/org_page_chunks?select=id`;

  const response = await withRetry(
    () =>
      fetch(url, {
        headers: {
          apikey: config.serviceKey,
          Authorization: `Bearer ${config.serviceKey}`,
          Prefer: 'count=exact',
          'Range-Unit': 'items',
          Range: '0-0',
        },
      }),
    3,
    'getLegacyRowCount'
  );

  if (!response.ok) {
    throw new Error(`Legacy count failed: ${response.status} ${response.statusText}`);
  }

  const contentRange = response.headers.get('Content-Range');
  if (contentRange) {
    const match = contentRange.match(/\/(\d+)$/);
    if (match) return parseInt(match[1], 10);
  }

  // Fallback: count from body
  const data = await response.json() as unknown[];
  return data.length;
}

/**
 * Get current row count in AIMC ai_knowledge.
 */
async function getAimcRowCount(config: SupabaseConfig): Promise<number> {
  const url = `${config.url}/rest/v1/ai_knowledge?select=id`;

  const response = await withRetry(
    () =>
      fetch(url, {
        headers: {
          apikey: config.serviceKey,
          Authorization: `Bearer ${config.serviceKey}`,
          Prefer: 'count=exact',
          'Range-Unit': 'items',
          Range: '0-0',
        },
      }),
    3,
    'getAimcRowCount'
  );

  if (!response.ok) {
    throw new Error(`AIMC count failed: ${response.status} ${response.statusText}`);
  }

  const contentRange = response.headers.get('Content-Range');
  if (contentRange) {
    const match = contentRange.match(/\/(\d+)$/);
    if (match) return parseInt(match[1], 10);
  }

  const data = await response.json() as unknown[];
  return data.length;
}

/**
 * Upsert a batch of rows into AIMC ai_knowledge.
 * Deduplicates by content_hash (onConflict = content_hash → do nothing).
 */
async function upsertBatch(
  config: SupabaseConfig,
  rows: AiKnowledgeInsert[]
): Promise<void> {
  if (rows.length === 0) return;

  const url = `${config.url}/rest/v1/ai_knowledge`;

  const response = await withRetry(
    () =>
      fetch(url, {
        method: 'POST',
        headers: {
          apikey: config.serviceKey,
          Authorization: `Bearer ${config.serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify(rows),
      }),
    3,
    `upsertBatch(${rows.length} rows)`
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '<unreadable>');
    throw new Error(
      `AIMC upsert failed: ${response.status} ${response.statusText} — ${errorBody}`
    );
  }
}

// ─── Semantic search validation ───────────────────────────────────────────────

/**
 * Validate that semantic search can return results for key domains post-migration.
 *
 * T-CL6-DOM-001: Queries for domain='ldcs'
 * T-CL6-DOM-002: Queries for domain='diamond-industry'
 *
 * Returns true if both domains have ≥1 row in ai_knowledge.
 */
export async function validateSemanticSearch(aimcConfig: SupabaseConfig): Promise<boolean> {
  const domainsToCheck = ['ldcs', 'diamond-industry'];
  let allPresent = true;

  for (const domain of domainsToCheck) {
    const url = `${aimcConfig.url}/rest/v1/ai_knowledge?domain=eq.${encodeURIComponent(domain)}&select=id&limit=1`;

    try {
      const response = await withRetry(
        () =>
          fetch(url, {
            headers: {
              apikey: aimcConfig.serviceKey,
              Authorization: `Bearer ${aimcConfig.serviceKey}`,
              'Content-Type': 'application/json',
            },
          }),
        3,
        `validateSemanticSearch(domain=${domain})`
      );

      if (!response.ok) {
        console.warn(`[migrate] Semantic search validation failed for domain='${domain}': ${response.status}`);
        allPresent = false;
        continue;
      }

      const rows = await response.json() as unknown[];
      if (rows.length === 0) {
        console.warn(`[migrate] No rows found with domain='${domain}' — semantic search will return empty results`);
        allPresent = false;
      } else {
        console.log(`[migrate] Semantic search validation OK for domain='${domain}' (${rows.length}+ rows)`);
      }
    } catch (err) {
      console.warn(`[migrate] Semantic search validation error for domain='${domain}': ${err}`);
      allPresent = false;
    }
  }

  return allPresent;
}

// ─── Report writing ───────────────────────────────────────────────────────────

/**
 * Write the migration report to .agent-admin/reports/cl6-migration-report.md.
 * CL-6-D4 deliverable.
 */
function writeMigrationReport(report: MigrationReport, repoRoot: string): void {
  const reportDir = resolve(repoRoot, '.agent-admin', 'reports');
  try {
    mkdirSync(reportDir, { recursive: true });
  } catch {
    // Directory may already exist
  }

  const reportPath = resolve(reportDir, 'cl6-migration-report.md');

  const domainRows = Object.entries(report.domainDistribution)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([domain, count]) => `| ${domain} | ${count} |`)
    .join('\n');

  const content = `# CL-6 Migration Report — Knowledge Re-ingestion

**Wave**: CL-6 | LKIAC Wave 3  
**Task**: CL-6-D2 (Migration Script) / CL-6-D4 (Report)  
**Timestamp**: ${report.timestamp}  
**Duration**: ${report.durationMs}ms  

---

## Summary

| Metric | Value |
|--------|-------|
| Legacy row count | ${report.legacyCount} |
| Rows migrated | ${report.rowsMigrated} |
| Rows skipped | ${report.rowsSkipped} |
| Rows flagged | ${report.rowsFlagged} |
| Row count match | ${report.rowCountMatch ? '✅ YES' : '❌ NO'} |
| Critical failure | ${report.criticalFailure ? `❌ YES — ${report.criticalFailureReason ?? 'unknown'}` : '✅ NO'} |

---

## Domain Distribution

| Domain | Row Count |
|--------|-----------|
${domainRows || '| (none) | 0 |'}

---

## Validation Rules Applied

| Rule | Description | Result |
|------|-------------|--------|
| V-001 | Unknown source → FLAGGED, skip | Applied |
| V-002 | NULL source → use 'general' | Applied |
| V-003 | Unknown domain → FLAGGED, fallback to 'general' | Applied |
| V-004 | All migrated rows: approval_status = 'pending' | Applied |
| V-005 | source='criteria' → REJECT (Pipeline 1 isolation) | Applied |

---

## Pipeline 1 Isolation

- Rows with \`source='criteria'\`: REJECTED (not migrated)  
- PIPELINE_1_SOURCE_EXCLUSION: ${JSON.stringify(PIPELINE_1_SOURCE_EXCLUSION)}  
- Pipeline 1 isolation: ✅ PRESERVED

---

## Smart Chunk Reuse

- Deduplication by \`content_hash\`: ✅ ENABLED  
- Conflict resolution: IGNORE DUPLICATES (upsert on content_hash)

---

_Report generated by \`packages/ai-centre/src/scripts/migrate-knowledge-embeddings.ts\`_  
_CL-6-D4 deliverable — Wave CL-6 branch: copilot/cl-6-migrate-knowledge-embeddings_
`;

  writeFileSync(reportPath, content, 'utf8');
  console.log(`[migrate] Migration report written to: ${reportPath}`);
}

// ─── Main migration function ──────────────────────────────────────────────────

const BATCH_SIZE = 100;

/**
 * Run the full CL-6 knowledge re-ingestion migration.
 *
 * Steps:
 *   1. Connect to legacy Supabase project (via env vars)
 *   2. Fetch all rows from org_page_chunks (batched)
 *   3. Validate each row (source/domain rules V-001–V-005)
 *   4. Compute content_hash and map columns
 *   5. Upsert into AIMC ai_knowledge (dedup by content_hash)
 *   6. Verify row count >= legacy count
 *   7. Write migration report
 *
 * @param repoRoot - Absolute path to repository root (for report output)
 * @returns MigrationReport
 */
export async function runMigration(
  repoRoot: string = resolve(fileURLToPath(import.meta.url), '../../../../../..')
): Promise<MigrationReport> {
  const startTime = Date.now();

  // ── Resolve env vars (IAA SB-001: NO hardcoded credentials) ──────────────
  const legacyUrl = process.env['LEGACY_SUPABASE_URL'];
  const legacyKey = process.env['LEGACY_SUPABASE_SERVICE_KEY'];
  const aimcUrl = process.env['AIMC_SUPABASE_URL'];
  const aimcKey = process.env['AIMC_SUPABASE_SERVICE_KEY'];

  if (!legacyUrl || !legacyKey || !aimcUrl || !aimcKey) {
    throw new Error(
      '[migrate] Missing required environment variables: ' +
      'LEGACY_SUPABASE_URL, LEGACY_SUPABASE_SERVICE_KEY, AIMC_SUPABASE_URL, AIMC_SUPABASE_SERVICE_KEY'
    );
  }

  const legacyConfig: SupabaseConfig = { url: legacyUrl, serviceKey: legacyKey };
  const aimcConfig: SupabaseConfig = { url: aimcUrl, serviceKey: aimcKey };

  // ── Step 1: Get legacy row count ──────────────────────────────────────────
  console.log('[migrate] Fetching legacy row count...');
  const legacyCount = await getLegacyRowCount(legacyConfig);
  console.log(`[migrate] Legacy row count: ${legacyCount}`);

  // ── Step 2–5: Process rows in batches ─────────────────────────────────────
  let rowsMigrated = 0;
  let rowsSkipped = 0;
  let rowsFlagged = 0;
  let chunkIndex = 0;
  const domainDistribution: Record<string, number> = {};
  const processedHashes = new Set<string>();

  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    console.log(`[migrate] Fetching batch offset=${offset} limit=${BATCH_SIZE}...`);

    let batch: LegacyRow[];
    try {
      batch = await fetchLegacyBatch(legacyConfig, offset, BATCH_SIZE);
    } catch (err) {
      console.error(`[migrate] CRITICAL: Failed to fetch batch at offset=${offset}: ${err}`);
      break;
    }

    if (batch.length === 0) {
      hasMore = false;
      break;
    }

    const insertBatch: AiKnowledgeInsert[] = [];

    for (const row of batch) {
      try {
        // V-005 + V-001 + V-002: source validation
        const sourceResult = validateSource(row.source);
        if (!sourceResult.valid) {
          console.warn(
            `[migrate] Skipping row id=${row.id}: ${sourceResult.reason}`
          );
          if (sourceResult.reason.startsWith('V-001')) {
            rowsFlagged++;
          }
          rowsSkipped++;
          continue;
        }

        // V-003: domain validation
        const { resolvedDomain, flagged } = validateDomain(row.domain);
        if (flagged) {
          rowsFlagged++;
        }

        // Compute content_hash for Smart Chunk Reuse (T-CL6-SCR-001)
        const contentHash = computeContentHash(row.chunk_text);

        // Skip in-memory duplicate (additional guard alongside DB upsert)
        if (processedHashes.has(contentHash)) {
          rowsSkipped++;
          continue;
        }
        processedHashes.add(contentHash);

        const insertRow: AiKnowledgeInsert = {
          organisation_id: row.organisation_id,
          document_id: row.page_id,
          content: row.chunk_text,
          source: sourceResult.resolvedSource,
          domain: resolvedDomain,
          approval_status: DEFAULT_APPROVAL_STATUS, // V-004: always 'pending'
          content_hash: contentHash,
          chunk_index: chunkIndex++,
        };

        insertBatch.push(insertRow);

        // Track domain distribution
        domainDistribution[resolvedDomain] = (domainDistribution[resolvedDomain] ?? 0) + 1;
      } catch (rowErr) {
        // Individual row error: log and continue (don't abort migration)
        console.error(`[migrate] Error processing row id=${row.id}: ${rowErr}`);
        rowsSkipped++;
      }
    }

    // Upsert the valid batch
    if (insertBatch.length > 0) {
      try {
        await upsertBatch(aimcConfig, insertBatch);
        rowsMigrated += insertBatch.length;
        console.log(`[migrate] Upserted ${insertBatch.length} rows (total: ${rowsMigrated})`);
      } catch (upsertErr) {
        console.error(`[migrate] CRITICAL: Upsert failed for batch at offset=${offset}: ${upsertErr}`);
        // Count as skipped (don't abort — continue with next batch)
        // rowsMigrated is not decremented — it was never incremented for this batch
        rowsSkipped += insertBatch.length;
      }
    }

    offset += batch.length;

    if (batch.length < BATCH_SIZE) {
      hasMore = false;
    }
  }

  // ── Step 6: Verify row count ──────────────────────────────────────────────
  console.log('[migrate] Verifying AIMC row count...');
  const newCount = await getAimcRowCount(aimcConfig);
  const rowCountMatch = MigrationSpec.rowCountMustBeGte(legacyCount, newCount);

  if (!rowCountMatch) {
    console.error(
      `[migrate] CRITICAL FAILURE: Row count deficit! Legacy=${legacyCount}, AIMC=${newCount}`
    );
  } else {
    console.log(`[migrate] Row count OK: AIMC=${newCount} >= legacy=${legacyCount}`);
  }

  const durationMs = Date.now() - startTime;

  const report: MigrationReport = {
    legacyCount,
    rowsMigrated,
    rowsSkipped,
    rowsFlagged,
    rowCountMatch,
    domainDistribution,
    timestamp: new Date().toISOString(),
    durationMs,
    criticalFailure: !rowCountMatch,
    criticalFailureReason: rowCountMatch
      ? undefined
      : `Row count deficit: legacy=${legacyCount}, AIMC=${newCount}`,
  };

  // ── Step 7: Write migration report (CL-6-D4) ─────────────────────────────
  writeMigrationReport(report, repoRoot);

  return report;
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

// When executed directly (not imported), run the migration
const isMain =
  typeof process !== 'undefined' &&
  process.argv[1] !== undefined &&
  (process.argv[1].endsWith('migrate-knowledge-embeddings.ts') ||
    process.argv[1].endsWith('migrate-knowledge-embeddings.js'));

if (isMain) {
  const repoRoot = resolve(fileURLToPath(import.meta.url), '../../../../../..');
  runMigration(repoRoot)
    .then((report) => {
      console.log('[migrate] Migration complete:', JSON.stringify(report, null, 2));
      if (report.criticalFailure) {
        console.error('[migrate] CRITICAL FAILURE — check report for details');
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('[migrate] Migration failed with unhandled error:', err);
      process.exit(1);
    });
}
