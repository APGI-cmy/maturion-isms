/**
 * MAT Tests — Wave 9: AIMC Embeddings/RAG Integration
 * Tests: MAT-T-AIMC-021 to MAT-T-AIMC-030
 *
 * RED gate — these tests define acceptance criteria for Wave 9.
 * They FAIL before Wave 9 implementation and PASS after.
 *
 * Architecture: modules/mat/02-architecture/ai-architecture.md v2.0.0
 * Implementation Plan: modules/mat/03-implementation-plan/implementation-plan.md §2.10
 * FRS: FR-055, FR-056
 * TRS: TR-017
 *
 * Expected RED/GREEN status (pre-Wave 9):
 *   MAT-T-AIMC-021 RED  — embedding-service.ts does not exist yet
 *   MAT-T-AIMC-022 RED  — embedding-service.ts does not exist yet
 *   MAT-T-AIMC-023 RED  — embedding-service.ts does not exist yet
 *   MAT-T-AIMC-024 RED  — embedding-service.ts does not exist yet
 *   MAT-T-AIMC-025 RED  — embedding-service.ts does not exist yet
 *   MAT-T-AIMC-026 GREEN — regression guard (no vector DB credentials in MAT src)
 *   MAT-T-AIMC-027 GREEN — regression guard (no vector DB package imports in MAT src)
 *   MAT-T-AIMC-028 GREEN — regression guard (modules/mat/.env.example already clean of vector DB creds)
 *   MAT-T-AIMC-029 GREEN — regression guard (no direct openai embedding imports in MAT src)
 *   MAT-T-AIMC-030 RED  — BUILD_PROGRESS_TRACKER.md Wave 9 entry is IN_PROGRESS, not COMPLETE
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

const ROOT = process.cwd(); // repo root — resolved at runtime via process.cwd()

function resolveFromRoot(...segments: string[]): string {
  return path.join(ROOT, ...segments);
}

/**
 * Recursively collect all .ts / .tsx file paths under `dir`.
 */
function collectSourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectSourceFiles(fullPath));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

// ──────────────────────────────────────────────────────────────────────────────
// Constants — paths under test
// ──────────────────────────────────────────────────────────────────────────────

const EMBEDDING_SERVICE_PATH = resolveFromRoot(
  'modules/mat/src/services/embedding-service.ts',
);
const MAT_SRC_DIR = resolveFromRoot('modules/mat/src');
const MAT_ENV_EXAMPLE_PATH = resolveFromRoot('modules/mat/.env.example');
const BUILD_PROGRESS_TRACKER_PATH = resolveFromRoot(
  'modules/mat/BUILD_PROGRESS_TRACKER.md',
);

// ──────────────────────────────────────────────────────────────────────────────
// Test suite
// ──────────────────────────────────────────────────────────────────────────────

describe('MAT Wave 9 — AIMC Embeddings/RAG Integration RED Gate', () => {
  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-021
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-021: embedding-service.ts exists at ' +
      'modules/mat/src/services/embedding-service.ts',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   MAT criteria similarity search and evidence-to-criterion matching MUST be
       *   delegated to AIMC Embeddings/RAG Gateway via a dedicated service layer.
       *   Direct vector DB calls or embedding API calls are forbidden in MAT src.
       *
       * Wave 9 requires a new `embedding-service.ts` that wraps AIMC Embeddings/RAG
       * calls so criteria matching can be performed without direct provider or
       * vector database coupling.
       *
       * Acceptance criteria (FR-055, FR-056):
       *   1. File exists at modules/mat/src/services/embedding-service.ts
       *
       * Status: RED — embedding-service.ts does not exist (Wave 9 not yet built).
       */
      expect(
        fs.existsSync(EMBEDDING_SERVICE_PATH),
        `embedding-service.ts must exist at: ${EMBEDDING_SERVICE_PATH}`,
      ).toBe(true);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-022
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-022: embedding-service.ts exports searchSimilarCriteria function',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   The embedding service must expose `searchSimilarCriteria` so that MAT
       *   criteria-management and audit workflows can delegate similarity search
       *   to AIMC Embeddings/RAG Gateway (Capability.RAG) without any direct
       *   vector database queries.
       *
       * Acceptance criteria (FR-055):
       *   1. embedding-service.ts exists
       *   2. Exports a `searchSimilarCriteria` function (named or const export)
       *
       * Status: RED — embedding-service.ts does not exist (Wave 9 not yet built).
       */
      expect(
        fs.existsSync(EMBEDDING_SERVICE_PATH),
        `embedding-service.ts must exist at: ${EMBEDDING_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(EMBEDDING_SERVICE_PATH, 'utf-8');

      expect(
        content,
        'embedding-service.ts must export a searchSimilarCriteria function',
      ).toMatch(
        /export\s+(?:async\s+)?(?:function\s+searchSimilarCriteria|const\s+searchSimilarCriteria\s*(?::[^=]+=|\s*=))/,
      );
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-023
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-023: embedding-service.ts exports matchEvidenceToCriteria function',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   The embedding service must expose `matchEvidenceToCriteria` so that MAT
       *   evidence collection and audit scoring workflows can delegate evidence
       *   matching to AIMC Embeddings/RAG Gateway (Capability.RAG) without any
       *   direct embedding API calls or vector store interactions.
       *
       * Acceptance criteria (FR-056):
       *   1. embedding-service.ts exists
       *   2. Exports a `matchEvidenceToCriteria` function (named or const export)
       *
       * Status: RED — embedding-service.ts does not exist (Wave 9 not yet built).
       */
      expect(
        fs.existsSync(EMBEDDING_SERVICE_PATH),
        `embedding-service.ts must exist at: ${EMBEDDING_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(EMBEDDING_SERVICE_PATH, 'utf-8');

      expect(
        content,
        'embedding-service.ts must export a matchEvidenceToCriteria function',
      ).toMatch(
        /export\s+(?:async\s+)?(?:function\s+matchEvidenceToCriteria|const\s+matchEvidenceToCriteria\s*(?::[^=]+=|\s*=))/,
      );
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-024
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-024: embedding-service.ts imports AICentre (or AICentreGateway) ' +
      'from @maturion/ai-centre — AIMC gateway pattern confirmed',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   All AI calls in MAT MUST go through the AIMC gateway (`@maturion/ai-centre`
       *   package). The embedding service must use the canonical gateway class —
       *   `AICentre` or `AICentreGateway` — as its sole entry point for all
       *   embedding and RAG calls. Direct embedding API clients, vector DB SDKs,
       *   or custom HTTP wrappers that bypass AIMC are strictly forbidden.
       *
       * Acceptance criteria (TR-017):
       *   1. embedding-service.ts exists
       *   2. Contains an import that destructures or imports `AICentre` or
       *      `AICentreGateway` from the @maturion/ai-centre package
       *
       * Status: RED — embedding-service.ts does not exist (Wave 9 not yet built).
       */
      expect(
        fs.existsSync(EMBEDDING_SERVICE_PATH),
        `embedding-service.ts must exist at: ${EMBEDDING_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(EMBEDDING_SERVICE_PATH, 'utf-8');

      // Must import AICentre or AICentreGateway from the ai-centre package
      const hasAICentreImport =
        /import\s+.*from\s+['"]@maturion\/ai-centre['"]/.test(content) ||
        /import\s+.*from\s+['"](?:[^'"]*\/)?ai-centre['"]/.test(content);

      expect(
        hasAICentreImport,
        'embedding-service.ts must import from @maturion/ai-centre or a relative ' +
          'path to the ai-centre package (AIMC gateway). Expected pattern: ' +
          'import { AICentre } from "@maturion/ai-centre"',
      ).toBe(true);

      // Must import the canonical gateway class
      expect(
        content,
        'embedding-service.ts must import AICentre or AICentreGateway from the ' +
          '@maturion/ai-centre package (canonical AIMC gateway class). ' +
          'Expected pattern: import { AICentre } from "@maturion/ai-centre"',
      ).toMatch(/import\s+.*\bAICentre(?:Gateway)?\b.*from/);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-025
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-025: embedding-service.ts uses Capability.RAG from ' +
      '@maturion/ai-centre — correct capability routing confirmed',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   AIMC uses a Capability enum to route requests to the appropriate
       *   underlying AI infrastructure. Embedding and RAG operations MUST be
       *   routed via `Capability.RAG`, not `Capability.ANALYSIS`, `Capability.ADVISORY`,
       *   or any other capability. This ensures AIMC routes the request to the
       *   correct provider/model configured for vector search and retrieval.
       *
       * Acceptance criteria (TR-017):
       *   1. embedding-service.ts exists
       *   2. Contains a reference to `Capability.RAG` (imported or used inline)
       *
       * Status: RED — embedding-service.ts does not exist (Wave 9 not yet built).
       */
      expect(
        fs.existsSync(EMBEDDING_SERVICE_PATH),
        `embedding-service.ts must exist at: ${EMBEDDING_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(EMBEDDING_SERVICE_PATH, 'utf-8');

      expect(
        content,
        'embedding-service.ts must use Capability.RAG from @maturion/ai-centre ' +
          'to correctly route embedding/RAG requests. Using Capability.ANALYSIS ' +
          'or Capability.ADVISORY would route to the wrong AIMC infrastructure.',
      ).toMatch(/\bCapability\.RAG\b/);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-026 — REGRESSION GUARD (GREEN pre-Wave 9)
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-026: No vector database connection strings or embedding API keys ' +
      'in modules/mat/src/ ' +
      '[REGRESSION GUARD — must remain GREEN]',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   All vector database and embedding provider infrastructure is managed by
       *   AIMC. MAT source code must never contain direct vector DB connection
       *   strings (Pinecone, Weaviate, Qdrant) or embedding API keys. These belong
       *   exclusively in AIMC configuration.
       *
       * Current state (pre-Wave 9):
       *   No vector DB credentials or embedding API keys exist in modules/mat/src/.
       *   This is a regression guard to ensure Wave 9 (and all future waves) do not
       *   accidentally introduce vector DB credentials into MAT source files.
       *
       * Status: GREEN — modules/mat/src/ is already clean of vector DB credentials.
       *   This test must remain GREEN through Wave 9 and beyond.
       */
      const sourceFiles = collectSourceFiles(MAT_SRC_DIR);

      expect(
        sourceFiles.length,
        'MAT_SRC_DIR must be non-empty (sanity check that path is correct)',
      ).toBeGreaterThan(0);

      const FORBIDDEN_CREDENTIAL_PATTERN =
        /(?:PINECONE_API_KEY|WEAVIATE_API_KEY|QDRANT_API_KEY|EMBEDDING_MODEL|VECTOR_DB_URL)/;

      const violatingFiles = sourceFiles.filter((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return FORBIDDEN_CREDENTIAL_PATTERN.test(content);
      });

      expect(
        violatingFiles,
        `No MAT src files must contain vector DB connection strings or embedding API keys.\n` +
          `These credentials belong in AIMC configuration, not MAT.\n` +
          `Violating files: ${violatingFiles.join(', ')}`,
      ).toHaveLength(0);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-027 — REGRESSION GUARD (GREEN pre-Wave 9)
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-027: No direct vector DB package imports ' +
      '(@pinecone-database/pinecone, weaviate-ts-client, @qdrant/js-client-rest) ' +
      'in modules/mat/src/ ' +
      '[REGRESSION GUARD — must remain GREEN]',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   All vector database infrastructure (Pinecone, Weaviate, Qdrant) is managed
       *   exclusively by AIMC. MAT source files must never directly import vector DB
       *   client packages. If MAT requires vector search, it MUST go through the
       *   AIMC Embeddings/RAG Gateway (Capability.RAG) via embedding-service.ts.
       *
       * Current state (pre-Wave 9):
       *   No vector DB package imports exist in modules/mat/src/. This is a regression
       *   guard to ensure Wave 9 (and all future waves) route all vector DB operations
       *   through AIMC rather than importing vector DB SDKs directly into MAT.
       *
       * Status: GREEN — modules/mat/src/ has no direct vector DB package imports.
       *   This test must remain GREEN through Wave 9 and beyond.
       */
      const sourceFiles = collectSourceFiles(MAT_SRC_DIR);

      expect(
        sourceFiles.length,
        'MAT_SRC_DIR must be non-empty (sanity check that path is correct)',
      ).toBeGreaterThan(0);

      const FORBIDDEN_VECTOR_DB_IMPORT_PATTERN =
        /import\s+.*from\s+['"](?:@pinecone-database\/pinecone|weaviate-ts-client|@qdrant\/js-client-rest)['"]/;

      const violatingFiles = sourceFiles.filter((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return FORBIDDEN_VECTOR_DB_IMPORT_PATTERN.test(content);
      });

      expect(
        violatingFiles,
        `No MAT src files must import vector DB packages directly.\n` +
          `All embedding/RAG operations must go through AIMC Gateway (Capability.RAG).\n` +
          `Forbidden packages: @pinecone-database/pinecone, weaviate-ts-client, @qdrant/js-client-rest\n` +
          `Violating files: ${violatingFiles.join(', ')}`,
      ).toHaveLength(0);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-028 — REGRESSION GUARD (GREEN pre-Wave 9)
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-028: modules/mat/.env.example does NOT contain vector database ' +
      'credentials (PINECONE_API_KEY, WEAVIATE_API_KEY, QDRANT_API_KEY, ' +
      'EMBEDDING_MODEL, VECTOR_DB_URL) ' +
      '[REGRESSION GUARD — must remain GREEN]',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   Provider and infrastructure configuration (vector DB endpoints, embedding
       *   model names, vector store API keys) belongs exclusively in AIMC configuration.
       *   MAT's environment configuration must remain free of all vector database
       *   and embedding provider variables.
       *
       * Current state (pre-Wave 9):
       *   modules/mat/.env.example does NOT contain any vector DB credential
       *   variables. Wave 7 and Wave 8 already cleaned the environment configuration.
       *   This test is a regression guard to ensure Wave 9 does not introduce
       *   vector DB config into MAT's environment template.
       *
       * Status: GREEN — modules/mat/.env.example is already clean of vector DB creds.
       *   This test must remain GREEN through Wave 9 and beyond.
       */
      expect(
        fs.existsSync(MAT_ENV_EXAMPLE_PATH),
        `modules/mat/.env.example must exist at: ${MAT_ENV_EXAMPLE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(MAT_ENV_EXAMPLE_PATH, 'utf-8');

      expect(
        content,
        'modules/mat/.env.example must NOT contain PINECONE_API_KEY ' +
          '(vector DB credentials belong in AIMC, not MAT)',
      ).not.toContain('PINECONE_API_KEY');

      expect(
        content,
        'modules/mat/.env.example must NOT contain WEAVIATE_API_KEY ' +
          '(vector DB credentials belong in AIMC, not MAT)',
      ).not.toContain('WEAVIATE_API_KEY');

      expect(
        content,
        'modules/mat/.env.example must NOT contain QDRANT_API_KEY ' +
          '(vector DB credentials belong in AIMC, not MAT)',
      ).not.toContain('QDRANT_API_KEY');

      expect(
        content,
        'modules/mat/.env.example must NOT contain EMBEDDING_MODEL ' +
          '(embedding model selection belongs in AIMC routing config, not MAT)',
      ).not.toContain('EMBEDDING_MODEL');

      expect(
        content,
        'modules/mat/.env.example must NOT contain VECTOR_DB_URL ' +
          '(vector store endpoint belongs in AIMC infrastructure config, not MAT)',
      ).not.toContain('VECTOR_DB_URL');
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-029 — REGRESSION GUARD (GREEN pre-Wave 9)
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-029: No direct openai package imports for embeddings ' +
      '(import.*openai.*embed pattern) in modules/mat/src/ — ' +
      'all embeddings must use AIMC Gateway ' +
      '[REGRESSION GUARD — must remain GREEN]',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   Embedding generation via OpenAI (or any other provider) must be proxied
       *   through AIMC Embeddings/RAG Gateway (Capability.RAG). MAT source files
       *   must NOT import the `openai` package directly for embedding operations.
       *   Any reference to openai embedding APIs (embeddings.create, etc.) must
       *   live in AIMC, not in MAT src.
       *
       * Current state (pre-Wave 9):
       *   No MAT src file directly imports the openai package for embedding calls.
       *   Note: advisory-service.ts references 'openai' as a string value in a
       *   capability-to-provider routing table (not as an import statement) — this
       *   is acceptable until Wave 8 cleans it up; it does not trigger this guard.
       *
       * Status: GREEN — no direct openai embedding imports in modules/mat/src/.
       *   This test must remain GREEN through Wave 9 and beyond.
       */
      const sourceFiles = collectSourceFiles(MAT_SRC_DIR);

      expect(
        sourceFiles.length,
        'MAT_SRC_DIR must be non-empty (sanity check that path is correct)',
      ).toBeGreaterThan(0);

      // Check for import statements from the openai package (direct SDK usage)
      const DIRECT_OPENAI_IMPORT =
        /^import\s+.*from\s+['"]openai['"]/m;

      const violatingFiles = sourceFiles.filter((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return DIRECT_OPENAI_IMPORT.test(content);
      });

      expect(
        violatingFiles,
        `No MAT src files must import the openai package directly for embedding operations.\n` +
          `All embedding calls must go through AIMC Gateway (Capability.RAG) via embedding-service.ts.\n` +
          `Violating files: ${violatingFiles.join(', ')}`,
      ).toHaveLength(0);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-030
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-030: BUILD_PROGRESS_TRACKER.md Wave 9 entry exists and is marked ' +
      'COMPLETE (post-delivery acceptance check)',
    () => {
      /**
       * BL-029 mandate:
       *   When completing a wave, the builder MUST update BUILD_PROGRESS_TRACKER.md.
       *   The Wave 9 entry must be marked COMPLETE (not IN_PROGRESS, BLOCKED, etc.)
       *   and must reference AIMC Embeddings or RAG Integration.
       *
       * Current state (pre-Wave 9):
       *   Wave 9 entry reads: "IN_PROGRESS — AIMC Wave 5 confirmed; CS2 authorized
       *   via issue #632; QA-to-Red gate in progress — 2026-02-26"
       *   This test will FAIL until Wave 9 delivery updates the tracker.
       *
       * Acceptance criteria:
       *   BUILD_PROGRESS_TRACKER.md contains a Wave 9 section that:
       *     1. Mentions "AIMC Embeddings" or "RAG Integration"
       *     2. Is marked COMPLETE (not IN_PROGRESS / BLOCKED / NOT_STARTED)
       *
       * Status: RED — Wave 9 is currently IN_PROGRESS in the tracker.
       *   This test flips GREEN when api-builder delivers Wave 9 and updates the tracker.
       */
      expect(
        fs.existsSync(BUILD_PROGRESS_TRACKER_PATH),
        `BUILD_PROGRESS_TRACKER.md must exist at: ${BUILD_PROGRESS_TRACKER_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(BUILD_PROGRESS_TRACKER_PATH, 'utf-8');

      // Wave 9 section must exist and reference AIMC Embeddings or RAG Integration
      // Use a tight single-line match — the tracker format is: "Wave 9: AIMC Embeddings/RAG Integration"
      expect(
        content,
        'BUILD_PROGRESS_TRACKER.md must contain a Wave 9 section referencing ' +
          'AIMC Embeddings or RAG Integration',
      ).toMatch(/Wave\s+9[^\n]{0,80}(?:AIMC\s+Embeddings|RAG\s+Integration|Embeddings\/RAG)/);

      // The Wave 9 entry must be marked COMPLETE — not IN_PROGRESS or any other non-complete status
      expect(
        content,
        'BUILD_PROGRESS_TRACKER.md Wave 9 entry must be marked COMPLETE ' +
          '(currently shows IN_PROGRESS — Wave 9 not yet delivered)',
      ).toMatch(/Wave\s+9[\s\S]{0,400}COMPLETE/);

      // Negative assertion: must NOT still show IN_PROGRESS after completion
      const wave9InProgressPattern =
        /Wave\s+9[^\n]{0,150}IN_PROGRESS/;
      expect(
        wave9InProgressPattern.test(content),
        'BUILD_PROGRESS_TRACKER.md Wave 9 entry must NOT still show ' +
          '"IN_PROGRESS" after Wave 9 delivery',
      ).toBe(false);
    },
  );
});
