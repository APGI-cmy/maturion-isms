/**
 * DCKIS-QA-RED — Pipeline 2 RED Gate Test Suite
 * Test IDs: T-KU-001 through T-KU-012
 *
 * Wave    : DCKIS-QA-RED
 * Branch  : copilot/dckis-qa-red-execute-failing-tests-again
 * Issue   : [qa-builder] DCKIS-QA-RED: Execute 12 RED Gate Failing Tests — Knowledge Ingestion
 * Task ID : T-DCKIS-QA-001
 * Session : session-dckis-qa-red-20260319
 * Producing Agent: qa-builder
 *
 * IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-dckis-qa-red.md
 * Alignment Plan: governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md §4
 * Authority: foreman-v2-agent delegation T-DCKIS-QA-001
 *
 * ── Source spec (DCKIS-QA-RED §4) ───────────────────────────────────────────
 *   These 12 tests cover Pipeline 2 (MAT Knowledge Ingestion) components:
 *   - KnowledgeUploadPanel (UI component)
 *   - DocumentChunkTester (chunk preview UI)
 *   - KnowledgeDocumentsList (ARC status display UI)
 *   - useKnowledgeDocuments (data hook)
 *   - process-document-v2 (Edge Function — migrated from legacy to packages/ai-centre/)
 *   - ai_knowledge schema (chunk metadata columns)
 *   - ai_knowledge RLS (INSERT policy with WITH CHECK)
 *
 * ── RED STATE (BEFORE DCKIS-IMPL-001 and DCKIS-IMPL-002 implementation) ─────
 *   T-KU-001  FAIL  KnowledgeUploadPanel.tsx does not exist
 *   T-KU-002  FAIL  DocumentChunkTester.tsx does not exist
 *   T-KU-003  FAIL  useKnowledgeDocuments.ts does not exist
 *   T-KU-004  FAIL  No migration adds chunk metadata columns to ai_knowledge
 *   T-KU-005  FAIL  No INSERT WITH CHECK RLS policy for ai_knowledge org isolation
 *   T-KU-006  FAIL  KnowledgeDocumentsList.tsx does not exist
 *   T-KU-007  FAIL  process-document-v2 (packages/ai-centre) does not exist
 *   T-KU-008  FAIL  process-document-v2 (packages/ai-centre) does not exist
 *   T-KU-009  FAIL  useKnowledgeDocuments.ts does not exist
 *   T-KU-010  FAIL  useKnowledgeDocuments.ts does not exist
 *   T-KU-011  FAIL  process-document-v2 (packages/ai-centre) does not exist
 *   T-KU-012  FAIL  process-document-v2 (packages/ai-centre) does not exist
 *
 * ── GREEN STATE (after DCKIS-IMPL-001 + DCKIS-IMPL-002 implementation) ──────
 *   All 12 tests PASS once api-builder and ui-builder deliver their waves.
 *
 * All tests are FILE-BASED (no live DB / network / Supabase calls required).
 * Authority: foreman-v2-agent delegation T-DCKIS-QA-001
 * IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-dckis-qa-red.md
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Path constants ────────────────────────────────────────────────────────────

/** Knowledge UI component: file picker + domain selector upload form. */
const KNOWLEDGE_UPLOAD_PANEL = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx',
);

/** Knowledge UI component: local chunk preview with configurable size/overlap. */
const DOCUMENT_CHUNK_TESTER = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx',
);

/** Knowledge UI component: list of uploaded documents with approval_status badge. */
const KNOWLEDGE_DOCUMENTS_LIST = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx',
);

/** Data hook: manages knowledge document uploads, validation, retry, deduplication. */
const USE_KNOWLEDGE_DOCUMENTS = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts',
);

/** Edge Function (packages/ai-centre): replaces legacy process-document with Smart Chunk Reuse. */
const PROCESS_DOCUMENT_V2 = path.resolve(
  process.cwd(),
  'packages/ai-centre/supabase/functions/process-document-v2/index.ts',
);

/** Directory containing ai-centre Supabase SQL migrations (schema + RLS). */
const AI_CENTRE_MIGRATIONS_DIR = path.resolve(
  process.cwd(),
  'packages/ai-centre/supabase/migrations',
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Read all .sql migration files from AI_CENTRE_MIGRATIONS_DIR.
 * Throws a clear expect-failure if the directory does not exist.
 */
function readAllAiCentreMigrations(): Array<{ filename: string; content: string }> {
  const dirExists = fs.existsSync(AI_CENTRE_MIGRATIONS_DIR);
  expect(
    dirExists,
    `AI Centre migrations directory not found: ${AI_CENTRE_MIGRATIONS_DIR}`,
  ).toBe(true);

  const files = fs
    .readdirSync(AI_CENTRE_MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'));

  return files.map((f) => ({
    filename: f,
    content: fs.readFileSync(path.join(AI_CENTRE_MIGRATIONS_DIR, f), 'utf-8'),
  }));
}

/**
 * Return all migration files whose content matches `contentPattern`.
 * Optionally restrict to files whose name matches `filenamePattern`.
 */
function findMigrationsByContent(
  contentPattern: RegExp,
  filenamePattern?: RegExp,
): Array<{ filename: string; content: string }> {
  return readAllAiCentreMigrations().filter(
    (m) =>
      contentPattern.test(m.content) &&
      (filenamePattern == null || filenamePattern.test(m.filename)),
  );
}

/**
 * Assert a file exists and return its UTF-8 content.
 * Fails the test with an actionable message when the file is absent.
 */
function requireFile(filePath: string): string {
  expect(
    fs.existsSync(filePath),
    `Expected file to exist (not yet created — implement DCKIS-IMPL-001 or DCKIS-IMPL-002): ${filePath}`,
  ).toBe(true);
  return fs.readFileSync(filePath, 'utf-8');
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('DCKIS-QA-RED — Pipeline 2 MAT Knowledge Ingestion (12 RED gate tests)', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-001  KnowledgeUploadPanel component exists
  // RED: modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx
  //      does not exist.
  // GREEN: ui-builder (DCKIS-IMPL-002) creates the component with a file picker
  //        (accept=".docx,.pdf,.txt,.md") and a domain selector <select>.
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-001] Knowledge Upload panel component exists with file picker and domain selector', () => {
    // File must exist — test fails immediately when absent (RED state).
    const content = requireFile(KNOWLEDGE_UPLOAD_PANEL);

    // Verify the component contains a file input element.
    expect(
      content,
      'KnowledgeUploadPanel must contain a file input element (type="file" or <input ... type="file">)',
    ).toMatch(/type=["']file["']/);

    // Verify the component contains a domain selector.
    expect(
      content,
      'KnowledgeUploadPanel must contain a domain selector element (<select> or Select component)',
    ).toMatch(/domain/i);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-002  DocumentChunkTester shows local chunk preview (size=2000, overlap=200)
  // RED: modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx
  //      does not exist.
  // GREEN: ui-builder (DCKIS-IMPL-002) creates the component with default
  //        chunkSize=2000 and chunkOverlap=200 constants visible in source.
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-002] Chunk Preflight Tester component exists with size=2000 and overlap=200 defaults', () => {
    const content = requireFile(DOCUMENT_CHUNK_TESTER);

    // Verify default chunk size constant.
    expect(
      content,
      'DocumentChunkTester must define default chunk size of 2000',
    ).toMatch(/2000/);

    // Verify default chunk overlap constant.
    expect(
      content,
      'DocumentChunkTester must define default chunk overlap of 200',
    ).toMatch(/200/);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-003  Domain selection maps to valid AIMC `source` taxonomy value
  // RED: modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts does not exist.
  // GREEN: api-builder (DCKIS-IMPL-001) creates the hook; domain→source mapping
  //        references the AIMC taxonomy (e.g. 'LDCS', 'ISO27001', 'NIST' etc.).
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-003] Domain selection maps to valid AIMC source taxonomy value in useKnowledgeDocuments', () => {
    const content = requireFile(USE_KNOWLEDGE_DOCUMENTS);

    // The hook must reference domain-to-source mapping logic.
    // Acceptable patterns: a domainSourceMap object, a switch/case on domain,
    // or an explicit reference to the `source` field with domain values.
    const hasDomainMapping =
      /domainSource|domain.*source|source.*domain|AIMC|taxonomy/i.test(content);

    expect(
      hasDomainMapping,
      'useKnowledgeDocuments must contain domain-to-source mapping logic (domainSourceMap, taxonomy reference, or domain→source assignment)',
    ).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-004  ai_knowledge has chunk metadata columns
  //           (chunk_index, chunk_size, chunk_overlap, source_document_name)
  // RED: No DCKIS migration adds these columns. The current 003_ai_knowledge.sql
  //      defines: id, organisation_id, content, source, embedding, created_at only.
  // GREEN: schema-builder (DCKIS-IMPL-001) adds a migration that ALTERs or
  //        creates ai_knowledge with all four chunk metadata columns.
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-004] ai_knowledge migration adds chunk metadata columns (chunk_index, chunk_size, chunk_overlap, source_document_name)', () => {
    // Search all ai-centre migrations for the chunk_index column definition.
    const chunkIndexMigrations = findMigrationsByContent(/chunk_index/i);

    expect(
      chunkIndexMigrations.length,
      `Expected at least one migration in ${AI_CENTRE_MIGRATIONS_DIR} to define a "chunk_index" column on ai_knowledge. ` +
      'No such migration exists yet — implement DCKIS-IMPL-001 (schema-builder wave).',
    ).toBeGreaterThan(0);

    // The same or an additional migration must also add the other three columns.
    const allMigrationContent = chunkIndexMigrations
      .map((m) => m.content)
      .join('\n');

    expect(
      allMigrationContent,
      'Migration(s) adding chunk_index must also define chunk_size column',
    ).toMatch(/chunk_size/i);

    expect(
      allMigrationContent,
      'Migration(s) adding chunk_index must also define chunk_overlap column',
    ).toMatch(/chunk_overlap/i);

    expect(
      allMigrationContent,
      'Migration(s) adding chunk_index must also define source_document_name column',
    ).toMatch(/source_document_name/i);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-005  ai_knowledge INSERT RLS policy enforces organisation_id WITH CHECK
  // RED: Current 003_ai_knowledge.sql only has a USING policy for SELECT.
  //      No WITH CHECK clause exists anywhere in the migrations for ai_knowledge.
  // GREEN: schema-builder (DCKIS-IMPL-001) adds an INSERT policy with both
  //        USING and WITH CHECK on organisation_id for org isolation.
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-005] ai_knowledge INSERT RLS policy enforces organisation_id with WITH CHECK clause', () => {
    // Look for a migration that has BOTH "ai_knowledge" AND "WITH CHECK" AND "organisation_id".
    const withCheckMigrations = findMigrationsByContent(
      /WITH\s+CHECK/i,
    ).filter((m) =>
      /ai_knowledge/i.test(m.content) &&
      /organisation_id/i.test(m.content),
    );

    expect(
      withCheckMigrations.length,
      `Expected at least one migration in ${AI_CENTRE_MIGRATIONS_DIR} to define a WITH CHECK INSERT policy on ai_knowledge ` +
      'scoped to organisation_id. No such policy exists yet — implement DCKIS-IMPL-001 (schema-builder wave).',
    ).toBeGreaterThan(0);

    // Confirm the policy is scoped to INSERT (not just a SELECT policy).
    const policyContent = withCheckMigrations.map((m) => m.content).join('\n');
    expect(
      policyContent,
      'The ai_knowledge WITH CHECK policy must be an INSERT policy (FOR INSERT)',
    ).toMatch(/FOR\s+INSERT/i);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-006  KnowledgeDocumentsList shows approval_status badge
  // RED: modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx
  //      does not exist.
  // GREEN: ui-builder (DCKIS-IMPL-002) creates the component; it renders an
  //        approval_status badge (e.g. <Badge status={doc.approval_status} />).
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-006] KnowledgeDocumentsList component exists with approval_status badge', () => {
    const content = requireFile(KNOWLEDGE_DOCUMENTS_LIST);

    // Verify the component references approval_status.
    expect(
      content,
      'KnowledgeDocumentsList must reference approval_status (badge, status display, or conditional render)',
    ).toMatch(/approval_status/);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-007  process-document-v2 Edge Function has Smart Chunk Reuse logic
  //           (chunked_from_tester flag)
  // RED: packages/ai-centre/supabase/functions/process-document-v2/index.ts
  //      does not exist.
  // GREEN: api-builder (DCKIS-IMPL-001) creates the function; it inspects the
  //        `chunked_from_tester` flag in the request body and skips re-chunking
  //        when pre-validated chunks are passed in from DocumentChunkTester.
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-007] process-document-v2 Edge Function has Smart Chunk Reuse logic (chunked_from_tester)', () => {
    const content = requireFile(PROCESS_DOCUMENT_V2);

    expect(
      content,
      'process-document-v2 must contain Smart Chunk Reuse logic referencing "chunked_from_tester" flag',
    ).toMatch(/chunked_from_tester/);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-008  process-document-v2 does NOT write to criteria, domains, or
  //           mini_performance_standards tables (scope isolation)
  // RED: packages/ai-centre/supabase/functions/process-document-v2/index.ts
  //      does not exist — file-not-found causes FAIL.
  // GREEN: api-builder (DCKIS-IMPL-001) creates the function; it must NOT
  //        reference or write to any criteria/domains/MPS tables, ensuring
  //        clean separation between Knowledge Ingestion and Criteria pipelines.
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-008] process-document-v2 does NOT write to criteria, domains, or mini_performance_standards', () => {
    const content = requireFile(PROCESS_DOCUMENT_V2);

    // These table names must not appear in any INSERT/UPDATE/UPSERT statements.
    const forbiddenWritePattern =
      /\.(from|insert|update|upsert)\s*\(\s*['"`](criteria|domains|mini_performance_standards)['"`]/i;

    expect(
      forbiddenWritePattern.test(content),
      'process-document-v2 MUST NOT write to criteria, domains, or mini_performance_standards tables. ' +
      'Found a forbidden table reference — remove it to keep Knowledge Ingestion isolated from Criteria pipeline.',
    ).toBe(false);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-009  useKnowledgeDocuments validates file extension
  //           (accepts: .docx, .pdf, .txt, .md only)
  // RED: modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts does not exist.
  // GREEN: api-builder (DCKIS-IMPL-001) creates the hook with a file extension
  //        allow-list that rejects unsupported file types before upload.
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-009] useKnowledgeDocuments validates file extension (.docx/.pdf/.txt/.md only)', () => {
    const content = requireFile(USE_KNOWLEDGE_DOCUMENTS);

    // Must reference all four accepted extensions.
    expect(content, 'useKnowledgeDocuments must accept .docx files').toMatch(/\.docx/i);
    expect(content, 'useKnowledgeDocuments must accept .pdf files').toMatch(/\.pdf/i);
    expect(content, 'useKnowledgeDocuments must accept .txt files').toMatch(/\.txt/i);
    expect(content, 'useKnowledgeDocuments must accept .md files').toMatch(/\.md/i);

    // Must contain validation/rejection logic (not just accept attribute).
    const hasValidationLogic =
      /invalid.*ext|unsupported.*file|allow.*list|allowedExt|validExt|extension.*check/i.test(
        content,
      );
    expect(
      hasValidationLogic,
      'useKnowledgeDocuments must contain explicit file extension validation logic ' +
      '(allowedExtensions check, error on invalid type, etc.)',
    ).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-010  useKnowledgeDocuments has retry / duplicate-detection logic
  // RED: modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts does not exist.
  // GREEN: api-builder (DCKIS-IMPL-001) creates the hook; it includes retry
  //        logic on transient upload failures AND duplicate-detection
  //        (preventing re-upload of a document with the same name/hash).
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-010] useKnowledgeDocuments has retry and duplicate-detection logic', () => {
    const content = requireFile(USE_KNOWLEDGE_DOCUMENTS);

    // Retry logic: look for retry keyword, exponential back-off, or attempt counter.
    const hasRetryLogic =
      /retry|retryCount|attempt|backoff|maxRetries/i.test(content);
    expect(
      hasRetryLogic,
      'useKnowledgeDocuments must contain retry logic (retryCount, maxRetries, backoff, or equivalent)',
    ).toBe(true);

    // Duplicate detection: look for hash, fingerprint, or existing-document check.
    const hasDuplicateDetection =
      /duplicate|isDuplicate|alreadyExists|hash|fingerprint|checksum/i.test(
        content,
      );
    expect(
      hasDuplicateDetection,
      'useKnowledgeDocuments must contain duplicate-detection logic (hash, isDuplicate, alreadyExists, or equivalent)',
    ).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-011  process-document-v2 has chunk-splitting with size=2000, overlap=200
  // RED: packages/ai-centre/supabase/functions/process-document-v2/index.ts
  //      does not exist.
  // GREEN: api-builder (DCKIS-IMPL-001) creates the function with chunk-splitting
  //        constants: CHUNK_SIZE = 2000, CHUNK_OVERLAP = 200 (matching the tester).
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-011] process-document-v2 has chunk-splitting with size=2000 and overlap=200', () => {
    const content = requireFile(PROCESS_DOCUMENT_V2);

    expect(
      content,
      'process-document-v2 must define chunk size of 2000 (CHUNK_SIZE = 2000 or equivalent)',
    ).toMatch(/2000/);

    expect(
      content,
      'process-document-v2 must define chunk overlap of 200 (CHUNK_OVERLAP = 200 or equivalent)',
    ).toMatch(/200/);

    // Must also reference a chunking/splitting function or loop.
    const hasChunkLogic =
      /chunk|split|slice|splitText|chunkText|splitDocument/i.test(content);
    expect(
      hasChunkLogic,
      'process-document-v2 must contain chunk-splitting logic (chunkText, splitText, splitDocument, or equivalent loop)',
    ).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // T-KU-012  process-document-v2 calls embedding API with 1536-dimension spec
  // RED: packages/ai-centre/supabase/functions/process-document-v2/index.ts
  //      does not exist.
  // GREEN: api-builder (DCKIS-IMPL-001) creates the function; it calls the
  //        embedding model that produces 1536-dimension vectors (matching the
  //        vector(1536) column definition in ai_knowledge).
  // ──────────────────────────────────────────────────────────────────────────
  it('[T-KU-012] process-document-v2 calls embedding API with 1536-dimension spec', () => {
    const content = requireFile(PROCESS_DOCUMENT_V2);

    // Must reference the 1536 dimension (hard-coded constant or inline value).
    expect(
      content,
      'process-document-v2 must reference 1536-dimension embedding spec ' +
      '(e.g. vector(1536), EMBEDDING_DIM = 1536, dimensions: 1536)',
    ).toMatch(/1536/);

    // Must reference an embedding API call (createEmbedding, embed, embeddings.create, etc.).
    const hasEmbeddingCall =
      /embed|createEmbedding|embeddings\.create|generateEmbedding/i.test(
        content,
      );
    expect(
      hasEmbeddingCall,
      'process-document-v2 must call an embedding API (createEmbedding, embed, embeddings.create, or equivalent)',
    ).toBe(true);
  });
});
