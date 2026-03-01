/**
 * RED Gate QA Suite — Wave CL-3.5 Edge Functions
 *
 * Wave CL-3.5 — AIMC Data Sources Registry
 *
 * ALL TESTS MUST FAIL (RED) until Wave CL-3.5 api-builder creates the four
 * Edge Functions under `packages/ai-centre/supabase/functions/`:
 *   - connect-data-source/index.ts
 *   - sync-data-source/index.ts
 *   - query-data-source/index.ts
 *   - test-data-sources-api/index.ts
 *
 * Do NOT create stubs or placeholders to make these tests pass.
 * Tests verify Edge Function file existence and structural content — they are
 * the source of truth for what api-builder MUST deliver.
 *
 * References:
 *   governance/aimc/CL3_5_DATA_MODEL_SPEC.md §6 (Edge Function Interface Summary)
 *
 * Authority: CS2 (@APGI-cmy) via foreman-v2-agent session-082 (Wave CL-3.5)
 *
 * Test IDs: CL3.5-T-016 through CL3.5-T-027
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
 * Resolve paths to Edge Function files relative to this test file.
 * Test file lives at: packages/ai-centre/src/__tests__/schema/
 * Functions live at:  packages/ai-centre/supabase/functions/<name>/index.ts
 * Relative path:      ../../../supabase/functions/
 */
const FUNCTIONS_BASE = path.resolve(__dirname, '../../../supabase/functions');

const CONNECT_FN = path.join(FUNCTIONS_BASE, 'connect-data-source', 'index.ts');
const SYNC_FN = path.join(FUNCTIONS_BASE, 'sync-data-source', 'index.ts');
const QUERY_FN = path.join(FUNCTIONS_BASE, 'query-data-source', 'index.ts');
const TEST_API_FN = path.join(FUNCTIONS_BASE, 'test-data-sources-api', 'index.ts');

// ---------------------------------------------------------------------------
// Helper — read Edge Function source (throws clearly if file not found)
// ---------------------------------------------------------------------------

function readFunction(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Wave CL-3.5 — AIMC Data Sources Edge Functions', () => {
  // =========================================================================
  // FILE EXISTENCE TESTS (CL3.5-T-016 through CL3.5-T-019)
  // =========================================================================

  // -------------------------------------------------------------------------
  // CL3.5-T-016: connect-data-source/index.ts exists
  // -------------------------------------------------------------------------

  it('CL3.5-T-016: packages/ai-centre/supabase/functions/connect-data-source/index.ts exists', () => {
    expect(
      fs.existsSync(CONNECT_FN),
      `Edge Function not found at: ${CONNECT_FN}`,
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-017: sync-data-source/index.ts exists
  // -------------------------------------------------------------------------

  it('CL3.5-T-017: packages/ai-centre/supabase/functions/sync-data-source/index.ts exists', () => {
    expect(
      fs.existsSync(SYNC_FN),
      `Edge Function not found at: ${SYNC_FN}`,
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-018: query-data-source/index.ts exists
  // -------------------------------------------------------------------------

  it('CL3.5-T-018: packages/ai-centre/supabase/functions/query-data-source/index.ts exists', () => {
    expect(
      fs.existsSync(QUERY_FN),
      `Edge Function not found at: ${QUERY_FN}`,
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-019: test-data-sources-api/index.ts exists
  // -------------------------------------------------------------------------

  it('CL3.5-T-019: packages/ai-centre/supabase/functions/test-data-sources-api/index.ts exists', () => {
    expect(
      fs.existsSync(TEST_API_FN),
      `Edge Function not found at: ${TEST_API_FN}`,
    ).toBe(true);
  });

  // =========================================================================
  // CONNECT-DATA-SOURCE TESTS (CL3.5-T-020 through CL3.5-T-021)
  // =========================================================================

  // -------------------------------------------------------------------------
  // CL3.5-T-020: connect-data-source handles POST requests (contains serve function or Deno.serve)
  // -------------------------------------------------------------------------

  it('CL3.5-T-020: connect-data-source handles POST requests (contains serve function or Deno.serve)', () => {
    const src = readFunction(CONNECT_FN);

    expect(
      src,
      'connect-data-source must contain serve() or Deno.serve() for HTTP handling',
    ).toMatch(/\b(Deno\.serve|serve)\s*\(/);
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-021: connect-data-source reads source_name, source_type,
  //              connection_config from request body
  // -------------------------------------------------------------------------

  it('CL3.5-T-021: connect-data-source reads source_name, source_type, connection_config from request body', () => {
    const src = readFunction(CONNECT_FN);

    expect(src, 'connect-data-source must reference source_name').toMatch(/\bsource_name\b/);
    expect(src, 'connect-data-source must reference source_type').toMatch(/\bsource_type\b/);
    expect(src, 'connect-data-source must reference connection_config').toMatch(
      /\bconnection_config\b/,
    );
  });

  // =========================================================================
  // SYNC-DATA-SOURCE TESTS (CL3.5-T-022 through CL3.5-T-023)
  // =========================================================================

  // -------------------------------------------------------------------------
  // CL3.5-T-022: sync-data-source handles POST and reads source_id from body
  // -------------------------------------------------------------------------

  it('CL3.5-T-022: sync-data-source handles POST and reads source_id from body', () => {
    const src = readFunction(SYNC_FN);

    expect(
      src,
      'sync-data-source must contain serve() or Deno.serve() for HTTP handling',
    ).toMatch(/\b(Deno\.serve|serve)\s*\(/);
    expect(src, 'sync-data-source must reference source_id from request body').toMatch(
      /\bsource_id\b/,
    );
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-023: sync-data-source updates status to 'syncing' in the database
  // -------------------------------------------------------------------------

  it("CL3.5-T-023: sync-data-source updates status to 'syncing' in the database", () => {
    const src = readFunction(SYNC_FN);

    expect(src, "sync-data-source must set status to 'syncing'").toMatch(/['"]syncing['"]/);
  });

  // =========================================================================
  // QUERY-DATA-SOURCE TESTS (CL3.5-T-024)
  // =========================================================================

  // -------------------------------------------------------------------------
  // CL3.5-T-024: query-data-source handles POST and reads source_id and query
  //              from body
  // -------------------------------------------------------------------------

  it('CL3.5-T-024: query-data-source handles POST and reads source_id and query from body', () => {
    const src = readFunction(QUERY_FN);

    expect(
      src,
      'query-data-source must contain serve() or Deno.serve() for HTTP handling',
    ).toMatch(/\b(Deno\.serve|serve)\s*\(/);
    expect(src, 'query-data-source must reference source_id').toMatch(/\bsource_id\b/);
    expect(src, 'query-data-source must reference query parameter from body').toMatch(
      /\bquery\b/,
    );
  });

  // =========================================================================
  // TEST-DATA-SOURCES-API TESTS (CL3.5-T-025)
  // =========================================================================

  // -------------------------------------------------------------------------
  // CL3.5-T-025: test-data-sources-api handles GET and returns sources array
  // -------------------------------------------------------------------------

  it('CL3.5-T-025: test-data-sources-api handles GET requests and returns sources array', () => {
    const src = readFunction(TEST_API_FN);

    expect(
      src,
      'test-data-sources-api must contain serve() or Deno.serve() for HTTP handling',
    ).toMatch(/\b(Deno\.serve|serve)\s*\(/);
    expect(src, "test-data-sources-api must return a 'sources' array in its response").toMatch(
      /\bsources\b/,
    );
  });

  // =========================================================================
  // SECURITY & SHARED PATTERN TESTS (CL3.5-T-026 through CL3.5-T-027)
  // =========================================================================

  // -------------------------------------------------------------------------
  // CL3.5-T-026: connect-data-source uses service role key
  //              (contains SUPABASE_SERVICE_ROLE_KEY)
  // -------------------------------------------------------------------------

  it('CL3.5-T-026: connect-data-source uses service role key (contains SUPABASE_SERVICE_ROLE_KEY)', () => {
    const src = readFunction(CONNECT_FN);

    expect(
      src,
      'connect-data-source must reference SUPABASE_SERVICE_ROLE_KEY for admin operations',
    ).toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
  });

  // -------------------------------------------------------------------------
  // CL3.5-T-027: All four functions import from Supabase
  //              (contain supabase client initialization)
  // -------------------------------------------------------------------------

  it('CL3.5-T-027: All four functions import from Supabase (contain supabase client initialization)', () => {
    const connectSrc = readFunction(CONNECT_FN);
    const syncSrc = readFunction(SYNC_FN);
    const querySrc = readFunction(QUERY_FN);
    const testApiSrc = readFunction(TEST_API_FN);

    // Each function must contain a supabase client reference
    const supabasePattern = /\bsupabase\b/i;

    expect(connectSrc, 'connect-data-source must initialize a supabase client').toMatch(
      supabasePattern,
    );
    expect(syncSrc, 'sync-data-source must initialize a supabase client').toMatch(
      supabasePattern,
    );
    expect(querySrc, 'query-data-source must initialize a supabase client').toMatch(
      supabasePattern,
    );
    expect(testApiSrc, 'test-data-sources-api must initialize a supabase client').toMatch(
      supabasePattern,
    );
  });
});
