/**
 * CL-6 RED Gate Test Suite — Knowledge Re-ingestion Migration
 *
 * Wave:      CL-6 (LKIAC Wave 3 — Knowledge Re-ingestion Migration)
 * Branch:    copilot/cl-6-relaunch-knowledge-ingestion
 * Issue:     #1240
 * Deliverable: CL-6-D1
 * Agent:     qa-builder
 *
 * RED GATE SEQUENCING (CL6-FFA-001):
 *   ALL 12 tests MUST be FAILING (RED) before any migration implementation
 *   code is written.  This file is committed BEFORE CL-6-D2 (the migration
 *   script) is created, proving the RED gate requirement.
 *
 * RED Mechanism (two layers):
 *   Layer 1 — Static import at top of file: vitest will fail to resolve
 *             `../../scripts/migrate-legacy-knowledge` (ENOENT / MODULE_NOT_FOUND)
 *             and error the ENTIRE file → all tests immediately RED.
 *   Layer 2 — `readFileSync` source-content checks in T-CL6-WRITE-001: when
 *             the migration script file exists in future, its source is read
 *             and inspected for disallowed hardcoded project IDs.
 *
 * Architecture Freeze: `.agent-admin/architecture/cl6-architecture-freeze-20260406.md`
 * IAA Pre-Brief:       `.agent-admin/assurance/iaa-prebrief-cl6-relaunch-20260406.md`
 * Authority:           CS2 (@APGI-cmy) | foreman-v2-agent delegation
 *
 * QA Catalog:
 *   T-CL6-SCHEMA-001  T-CL6-EMBED-001   T-CL6-DOMAIN-001  T-CL6-STATUS-001
 *   T-CL6-PIPE1-001   T-CL6-DEDUP-001   T-CL6-RLS-001     T-CL6-BATCH-001
 *   T-CL6-WRITE-001   T-CL6-ARC-001     T-CL6-ROW-001     T-CL6-DOMAIN-002
 */

import { describe, it, expect } from 'vitest';
// @ts-ignore — @types/node not in package tsconfig; same pattern as existing tests
import { readFileSync } from 'node:fs';
// @ts-ignore — @types/node not in package tsconfig
import { resolve, dirname } from 'node:path';
// @ts-ignore — @types/node not in package tsconfig
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// CL-6 RED GATE — Static import of the non-existent migration script (Layer 1)
//
// This import WILL FAIL with "Cannot find module" / ENOENT because
// `packages/ai-centre/scripts/migrate-legacy-knowledge.ts` does NOT YET EXIST.
// Vitest reports the entire test file as an error → every test below is RED.
//
// When api-builder implements CL-6-D2 at the CEP-canonical path
//   packages/ai-centre/scripts/migrate-legacy-knowledge.ts
// the import resolves, the file loads, and each individual assertion runs.
// ---------------------------------------------------------------------------
import {
  APPROVED_SOURCE_LABELS,
  DEFAULT_APPROVAL_STATUS,
  PIPELINE_1_SOURCE_EXCLUSION,
  ORG_PAGE_CHUNKS_SCHEMA,
  MIGRATION_SPEC,
} from '../../scripts/migrate-legacy-knowledge';

// ---------------------------------------------------------------------------
// Layer-2 helper — source-content checks for T-CL6-WRITE-001
//
// __dirname resolves to:  packages/ai-centre/src/migrations/
// Two "../" traversals reach packages/ai-centre/
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve a path relative to the packages/ai-centre root.
 * From src/migrations/ → two levels up.
 */
function aiCentreFile(...segments: string[]): string {
  return resolve(__dirname, '..', '..', ...segments);
}

// ===========================================================================
// T-CL6-SCHEMA-001 — Chunk schema column set
//
// Architecture ref: CL6-FFA-010 — Schema verification correctness
// Naming clarification: `ORG_PAGE_CHUNKS_SCHEMA` is the migration pipeline
// schema descriptor — it maps the SOURCE table (`org_page_chunks`) column
// shape to the TARGET table (`ai_knowledge`) columns.  The 11 required
// columns listed below are those that must exist in the TARGET `ai_knowledge`
// table after migration (confirmed by migration chain 003→006→008→009).
// ===========================================================================

describe('CL-6 Schema — ORG_PAGE_CHUNKS_SCHEMA (source→target migration column map)', () => {

  it('T-CL6-SCHEMA-001: ORG_PAGE_CHUNKS_SCHEMA declares all required columns', () => {
    // T-CL6-SCHEMA-001: <schema exports required column names>
    const requiredColumns = [
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
    ];

    expect(ORG_PAGE_CHUNKS_SCHEMA).toBeDefined();
    expect(typeof ORG_PAGE_CHUNKS_SCHEMA).toBe('object');

    // columns property lists the declared column names
    const declaredColumns: string[] = Array.isArray(ORG_PAGE_CHUNKS_SCHEMA.columns)
      ? ORG_PAGE_CHUNKS_SCHEMA.columns
      : Object.keys(ORG_PAGE_CHUNKS_SCHEMA.columns ?? {});

    for (const col of requiredColumns) {
      expect(
        declaredColumns,
        `ORG_PAGE_CHUNKS_SCHEMA is missing required column: "${col}"`,
      ).toContain(col);
    }
  });

  // T-CL6-EMBED-001 — Embedding dimension
  //
  // Architecture ref: CL6-FFA-003 — 1536-dim embedding must be declared and
  // enforced to match AIMC vector model (OpenAI-compatible).
  it('T-CL6-EMBED-001: ORG_PAGE_CHUNKS_SCHEMA.embeddingDimension === 1536', () => {
    // T-CL6-EMBED-001: <embedding dimension is 1536>
    expect(ORG_PAGE_CHUNKS_SCHEMA.embeddingDimension).toBe(1536);
  });

});

// ===========================================================================
// T-CL6-DOMAIN-001 — Approved domain source labels
//
// Architecture ref: CL6-FFA-004 — only the 8 approved source labels (adopted
// from CL-2-D2 domain mapping + CP-2 additions: `ldcs`, `diamond-industry`)
// may be written into `ai_knowledge.source` during migration.
// ===========================================================================

describe('CL-6 Domain Tags — APPROVED_SOURCE_LABELS', () => {

  it('T-CL6-DOMAIN-001: APPROVED_SOURCE_LABELS contains exactly the 8 approved domain labels', () => {
    // T-CL6-DOMAIN-001: <exactly 8 approved domain source labels>
    const expectedLabels = [
      'iso27001',
      'nist',
      'pci-dss',
      'soc2',
      'risk-management',
      'general',
      'ldcs',
      'diamond-industry',
    ];

    expect(APPROVED_SOURCE_LABELS).toBeDefined();
    expect(Array.isArray(APPROVED_SOURCE_LABELS)).toBe(true);
    expect(
      APPROVED_SOURCE_LABELS.length,
      `Expected exactly 8 labels but got ${APPROVED_SOURCE_LABELS.length}: ${JSON.stringify(APPROVED_SOURCE_LABELS)}`,
    ).toBe(8);

    for (const label of expectedLabels) {
      expect(
        APPROVED_SOURCE_LABELS,
        `APPROVED_SOURCE_LABELS is missing required label: "${label}"`,
      ).toContain(label);
    }
  });

});

// ===========================================================================
// T-CL6-STATUS-001 — Default approval status
//
// Architecture ref: CL6-FFA-005 — All migrated rows MUST have
// `approval_status = 'pending'`; human review gates promotion to `approved`.
// ===========================================================================

describe('CL-6 Approval Status — DEFAULT_APPROVAL_STATUS', () => {

  it("T-CL6-STATUS-001: DEFAULT_APPROVAL_STATUS === 'pending'", () => {
    // T-CL6-STATUS-001: <default approval status is 'pending'>
    expect(DEFAULT_APPROVAL_STATUS).toBe('pending');
  });

});

// ===========================================================================
// T-CL6-PIPE1-001 — Pipeline 1 isolation (ADR-005 hard gate)
//
// Architecture ref: CL6-FFA-006 — Pipeline 1 files (CriteriaUpload.tsx,
// CriteriaManagementPage.tsx, useCriteria.ts, invoke-ai-parse-criteria Edge
// Function) MUST NOT be modified by this wave. `PIPELINE_1_SOURCE_EXCLUSION`
// must declare the 'criteria' exclusion token to signal the hard gate.
// ===========================================================================

describe('CL-6 Pipeline 1 Isolation — PIPELINE_1_SOURCE_EXCLUSION', () => {

  it("T-CL6-PIPE1-001: PIPELINE_1_SOURCE_EXCLUSION contains 'criteria' (Pipeline 1 isolation hard gate)", () => {
    // T-CL6-PIPE1-001: <Pipeline 1 exclusion token is declared>
    expect(PIPELINE_1_SOURCE_EXCLUSION).toBeDefined();
    expect(Array.isArray(PIPELINE_1_SOURCE_EXCLUSION)).toBe(true);
    expect(
      PIPELINE_1_SOURCE_EXCLUSION,
      "PIPELINE_1_SOURCE_EXCLUSION must contain 'criteria' as the Pipeline 1 isolation token",
    ).toContain('criteria');
  });

});

// ===========================================================================
// T-CL6-DEDUP-001 — Content hash based deduplication
//
// Architecture ref: CL6-FFA-009 — SHA-256 `content_hash` deduplication must
// be declared in MIGRATION_SPEC to prevent duplicate rows on re-runs.
// ===========================================================================

describe('CL-6 Migration Spec — MIGRATION_SPEC', () => {

  it('T-CL6-DEDUP-001: MIGRATION_SPEC.deduplicateByContentHash === true', () => {
    // T-CL6-DEDUP-001: <deduplication by content_hash is declared>
    expect(MIGRATION_SPEC).toBeDefined();
    expect(MIGRATION_SPEC.deduplicateByContentHash).toBe(true);
  });

  // T-CL6-RLS-001 — RLS policy scoped to authenticated role only
  //
  // Architecture ref: CL6-FFA-007 — `ai_knowledge_org_insert` RLS policy must
  // be scoped `TO authenticated` only; the `anon` role must NOT have INSERT
  // access to ai_knowledge.
  it("T-CL6-RLS-001: MIGRATION_SPEC.rlsPolicy declares ai_knowledge_org_insert scoped to 'authenticated' role only (not 'anon')", () => {
    // T-CL6-RLS-001: <RLS policy scoped to authenticated only>
    expect(MIGRATION_SPEC.rlsPolicy).toBeDefined();

    const rlsPolicy = MIGRATION_SPEC.rlsPolicy;

    expect(
      rlsPolicy.name,
      "MIGRATION_SPEC.rlsPolicy.name must be 'ai_knowledge_org_insert'",
    ).toBe('ai_knowledge_org_insert');

    expect(
      rlsPolicy.roles,
      'MIGRATION_SPEC.rlsPolicy.roles must contain "authenticated"',
    ).toContain('authenticated');

    expect(
      rlsPolicy.roles,
      'MIGRATION_SPEC.rlsPolicy.roles must NOT include "anon" — anon INSERT access is prohibited',
    ).not.toContain('anon');
  });

  // T-CL6-BATCH-001 — Batch size
  //
  // Architecture ref: CEP §CL-6 — batched fetch (100 rows per batch) with
  // per-row error isolation is mandatory to avoid timeouts and partial failures.
  it('T-CL6-BATCH-001: MIGRATION_SPEC.batchSize === 100', () => {
    // T-CL6-BATCH-001: <batch size is 100>
    expect(MIGRATION_SPEC.batchSize).toBe(100);
  });

  // T-CL6-ARC-001 — ARC queue domain queryability
  //
  // Architecture ref: CL6-FFA-008 — ARC queue must be able to query migrated
  // knowledge by domain after migration completes. MIGRATION_SPEC must declare
  // arcQueueIntegration with domain queryability support.
  it('T-CL6-ARC-001: MIGRATION_SPEC.arcQueueIntegration declares domain queryability support', () => {
    // T-CL6-ARC-001: <ARC queue domain queryability is declared>
    expect(MIGRATION_SPEC.arcQueueIntegration).toBeDefined();

    const arc = MIGRATION_SPEC.arcQueueIntegration;

    expect(
      arc.domainQueryable,
      'MIGRATION_SPEC.arcQueueIntegration.domainQueryable must be true',
    ).toBe(true);
  });

  // T-CL6-ROW-001 — Minimum row count validation
  //
  // Architecture ref: Architecture freeze §Migration Report — migrated row count
  // must be ≥ legacy row count (no data loss permitted).
  it('T-CL6-ROW-001: MIGRATION_SPEC declares minimum row validation (migrated count ≥ legacy count)', () => {
    // T-CL6-ROW-001: <minimum row validation is declared>
    expect(MIGRATION_SPEC.rowValidation).toBeDefined();

    const rv = MIGRATION_SPEC.rowValidation;

    expect(
      rv.migratedCountMustBeAtLeastLegacyCount,
      'MIGRATION_SPEC.rowValidation.migratedCountMustBeAtLeastLegacyCount must be true',
    ).toBe(true);
  });

});

// ===========================================================================
// T-CL6-WRITE-001 — No hardcoded Supabase project IDs in migration script
//
// Architecture ref: CL6-FFA-014 — All connection strings MUST come from
// environment variables: LEGACY_SUPABASE_URL, LEGACY_SUPABASE_SERVICE_KEY,
// AIMC_SUPABASE_URL, AIMC_SUPABASE_SERVICE_KEY.  The legacy project ID
// `dmhlxhatogrrrvuruayv` must NOT appear as a hardcoded literal in the script.
//
// RED (Layer 2): readFileSync throws ENOENT because the script doesn't exist.
// GREEN: source must reference only env vars; no hardcoded project IDs.
// ===========================================================================

describe('CL-6 Security — No Hardcoded Credentials', () => {

  it('T-CL6-WRITE-001: Migration script exports no hardcoded Supabase project IDs — all connection strings come from env vars', () => {
    // T-CL6-WRITE-001: <no hardcoded project IDs; env vars only>
    const scriptPath = aiCentreFile('scripts', 'migrate-legacy-knowledge.ts');

    // Layer 2 RED mechanism: readFileSync throws ENOENT when file doesn't exist
    const source = readFileSync(scriptPath, 'utf-8') as string;

    // Must NOT contain the hardcoded legacy project ID
    expect(
      source,
      'Migration script must NOT contain hardcoded Supabase project ID "dmhlxhatogrrrvuruayv"',
    ).not.toContain('dmhlxhatogrrrvuruayv');

    // Must reference the required environment variable names
    const requiredEnvVars = [
      'LEGACY_SUPABASE_URL',
      'LEGACY_SUPABASE_SERVICE_KEY',
      'AIMC_SUPABASE_URL',
      'AIMC_SUPABASE_SERVICE_KEY',
    ];
    for (const envVar of requiredEnvVars) {
      expect(
        source,
        `Migration script must reference environment variable "${envVar}"`,
      ).toContain(envVar);
    }
  });

});

// ===========================================================================
// T-CL6-DOMAIN-002 — Domain validation rules V-001–V-005 exported
//
// Architecture ref: CL6-FFA-004 (domain tag governance) — The migration script
// must export/declare domain validation rules V-001 through V-005 so that
// the row-level domain tag enforcement is auditable and testable.
// ===========================================================================

describe('CL-6 Domain Validation Rules', () => {

  it('T-CL6-DOMAIN-002: Domain validation rules V-001–V-005 are exported/declared', () => {
    // T-CL6-DOMAIN-002: <domain validation rules V-001–V-005 are declared>

    // MIGRATION_SPEC or a top-level export must declare domainValidationRules
    // that covers the range V-001 through V-005.
    const rules = MIGRATION_SPEC.domainValidationRules;

    expect(
      rules,
      'MIGRATION_SPEC.domainValidationRules must be defined',
    ).toBeDefined();

    expect(
      Array.isArray(rules),
      'MIGRATION_SPEC.domainValidationRules must be an array',
    ).toBe(true);

    const ruleIds: string[] = rules.map((r: { id: string }) => r.id);

    const requiredRuleIds = ['V-001', 'V-002', 'V-003', 'V-004', 'V-005'];
    for (const ruleId of requiredRuleIds) {
      expect(
        ruleIds,
        `MIGRATION_SPEC.domainValidationRules must include rule "${ruleId}"`,
      ).toContain(ruleId);
    }
  });

});
