/**
 * Wave 15 — Criteria Parsing Pipeline RED Gate Tests
 * Test ID Suite: T-W15-CP-001 through T-W15-CP-014
 *
 * Wave    : Wave 15 — Post-Delivery Oversight Remediation (Criteria Parsing Pipeline)
 * Session : session-wave15-orchestration-20260306
 * Delegating Agent: foreman-v2-agent (T-W15-QA-001)
 *
 * RED STATE (expected before Wave 15 implementation):
 *   - supabase/functions/invoke-ai-parse-criteria/index.ts does NOT exist
 *   - apps/mat-ai-gateway/services/parsing.py is a STUB (no GPT-4 call,
 *     no text extraction, no DB inserts, no source_anchor, no review flags,
 *     no LDCS-pattern detection, no audit trail)
 *   - modules/mat/frontend/src/lib/hooks/useCriteria.ts has no parse-status
 *     polling logic
 *   - modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx does not
 *     surface explicit inline error messages for upload failures (FR-103)
 *
 * All tests are file-based (no live Supabase/network env required).
 * All 14 tests MUST be RED before Wave 15 implementation begins.
 *
 * Authority: foreman-v2-agent delegation T-W15-QA-001
 *
 * NOTE ON FILE LOCATION: The delegation specified `modules/mat/src/test/` as the
 * target directory, but that path does not exist in this repository. Existing Wave
 * test files live in `modules/mat/tests/<wave>/` and are discovered by the root
 * vitest.config.ts (include glob for modules/mat/tests). This file is placed at
 * `modules/mat/tests/wave15/wave15-criteria-parsing.test.ts` to match the
 * established convention and be picked up by the existing test runner.
 * Decision recorded in: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
 * and session memory `session-wave15-orchestration-20260306.md`.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Path constants ────────────────────────────────────────────────────────────

/** Target Edge Function — does NOT exist yet (Wave 15 creates it). */
const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

/** AI Gateway parsing service — EXISTS but is a stub. */
const PARSING_PY_PATH = path.resolve(
  process.cwd(),
  'apps/mat-ai-gateway/services/parsing.py',
);

/** useCriteria hook — EXISTS but lacks polling. */
const USE_CRITERIA_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/lib/hooks/useCriteria.ts',
);

/** CriteriaUpload component — EXISTS but uses alert() not inline error messages. */
const CRITERIA_UPLOAD_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx',
);

// ─── Helper: read Edge Function (fails RED if file absent) ────────────────────

function readEdgeFunction(): string {
  const exists = fs.existsSync(EDGE_FN_PATH);
  expect(
    exists,
    `[RED STATE — EXPECTED before Wave 15 implementation]\n` +
    `Edge Function not found: ${EDGE_FN_PATH}\n` +
    `schema-builder / api-builder must create this file to turn this test GREEN.\n` +
    `File: supabase/functions/invoke-ai-parse-criteria/index.ts`,
  ).toBe(true);
  return fs.readFileSync(EDGE_FN_PATH, 'utf-8');
}

// ─── Helper: read parsing.py (must already exist) ─────────────────────────────

function readParsingPy(): string {
  const exists = fs.existsSync(PARSING_PY_PATH);
  expect(
    exists,
    `parsing.py must exist at: ${PARSING_PY_PATH}`,
  ).toBe(true);
  return fs.readFileSync(PARSING_PY_PATH, 'utf-8');
}

// ══════════════════════════════════════════════════════════════════════════════
// Test Suite
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 15 — Criteria Parsing Pipeline (T-W15-CP-001 to T-W15-CP-014)', () => {

  // ── Edge Function existence ─────────────────────────────────────────────────

  it('[T-W15-CP-001] Edge Function invoke-ai-parse-criteria/index.ts exists', () => {
    /*
     * RED:  supabase/functions/invoke-ai-parse-criteria/index.ts does not exist.
     * GREEN: api-builder/schema-builder creates the Edge Function file.
     *
     * This is the root prerequisite for the entire criteria parsing pipeline.
     * The Edge Function receives the uploaded document path, calls the AI Gateway,
     * and writes structured criteria to the DB.
     */
    readEdgeFunction(); // will fail with descriptive message while file is absent
  });

  // ── Edge Function: missing filePath error handling ──────────────────────────

  it('[T-W15-CP-002] Edge Function handles missing filePath — returns error payload', () => {
    /*
     * RED:  File does not exist, so content check cannot proceed.
     * GREEN: Edge Function exists AND contains validation / early-return for
     *        missing or empty filePath (e.g. `if (!filePath)` guard clause that
     *        returns a 400-class error response).
     *
     * FR-103 (error surfacing) requires the Edge Function to return a structured
     * error when required parameters are absent, not silently fail.
     */
    const src = readEdgeFunction();
    expect(
      src,
      '[T-W15-CP-002] Edge Function must contain missing-filePath error handling.\n' +
      "Add a guard clause that checks for `filePath` and returns an error payload when absent.\n" +
      "Example: `if (!filePath) return new Response(JSON.stringify({ error: 'filePath is required' }), { status: 400 })`",
    ).toMatch(/filePath|file_path/i);
    // Ensure it actually handles the missing case (error/return guard present)
    expect(
      src,
      '[T-W15-CP-002] Edge Function must explicitly guard against missing filePath ' +
      '(e.g. early return with error payload, not just reference the variable).',
    ).toMatch(/if\s*\(.*(?:filePath|file_path).*\)|(?:filePath|file_path).*error|error.*(?:filePath|file_path)/i);
  });

  // ── AI Gateway: real /parse endpoint (not stub) ─────────────────────────────

  it('[T-W15-CP-003] AI Gateway /parse endpoint is defined in services/parsing.py (not stub)', () => {
    /*
     * RED:  parsing.py is a stub — it defines DocumentParser as a plain class
     *       with no FastAPI route decorators. There is no @router.post, no
     *       APIRouter, and no /parse route definition.
     * GREEN: parsing.py (or a router it wires into) defines a @router.post('/parse')
     *        or equivalent FastAPI endpoint that receives a document URL and
     *        returns structured criteria JSON.
     *
     * Architecture ref: modules/mat/02-architecture/system-architecture.md §3.4
     */
    const src = readParsingPy();
    expect(
      src,
      '[T-W15-CP-003] parsing.py must define a FastAPI route for /parse.\n' +
      "The current file is a stub with no router. Add: router = APIRouter() and\n" +
      "@router.post('/parse') to expose the endpoint as required by the architecture.",
    ).toMatch(/@router\.(post|get)|APIRouter\(\)|app\.(post|get)\s*\(\s*['\"]/i);
  });

  // ── AI Gateway: text extraction logic ──────────────────────────────────────

  it('[T-W15-CP-004] DocumentParser.parse() contains text extraction logic (pypdf2 or python-docx)', () => {
    /*
     * RED:  parsing.py stub contains no text extraction — DocumentParser.parse()
     *       simply returns a static "queued" dict without reading the document.
     * GREEN: parsing.py imports and uses pypdf2 (PdfReader) or python-docx (Document)
     *        to extract text from the uploaded PDF or DOCX file before sending it
     *        to the AI model.
     *
     * Architecture ref: §3.4 "PDF/DOCX → structured criteria JSON"
     */
    const src = readParsingPy();
    expect(
      src,
      '[T-W15-CP-004] parsing.py must import a text-extraction library.\n' +
      'Add: `import pypdf2` (or `from pypdf2 import PdfReader`) for PDF support, and/or\n' +
      '`from docx import Document` (python-docx) for DOCX support.\n' +
      'The current stub returns a static dict without reading document content.',
    ).toMatch(/pypdf2|PdfReader|python[-_]docx|from docx import|import docx/i);
  });

  // ── AI Gateway: GPT-4.1 call ───────────────────────────────────────────────

  it('[T-W15-CP-005] DocumentParser.parse() calls GPT-4.1 (OpenAI client present in parsing.py)', () => {
    /*
     * RED:  parsing.py stub has no OpenAI import or API call. The parse() method
     *       returns a static "queued" dict immediately.
     * GREEN: parsing.py imports the OpenAI client and calls it with model="gpt-4.1"
     *        to process the extracted document text.
     *
     * Architecture ref: §3.4 "GPT-4.1" as the parsing model (upgraded from gpt-4-turbo in PR #1040).
     */
    const src = readParsingPy();
    expect(
      src,
      '[T-W15-CP-005] parsing.py must import openai and invoke the GPT-4.1 model.\n' +
      'Add: `import openai` or `from openai import OpenAI` and call the client with\n' +
      'model="gpt-4.1".\n' +
      'The current stub returns a static dict without calling any AI model.',
    ).toMatch(/openai|OpenAI/i);
    // Also verify the GPT-4.1 model string is referenced (upgraded from gpt-4-turbo in PR #1040)
    expect(
      src,
      '[T-W15-CP-005] parsing.py must reference "gpt-4.1" as the model.\n' +
      'The architecture specifies GPT-4.1 for document parsing — use exactly this model.',
    ).toMatch(/gpt-4\.1/i);
  });

  // ── AI Gateway: source_anchor in response ──────────────────────────────────

  it('[T-W15-CP-006] AI Gateway /parse response schema includes source_anchor field', () => {
    /*
     * RED:  parsing.py stub returns { status, task_id, document_url, tenant_id }
     *       with no source_anchor field. source_anchor is required for traceability —
     *       it links each extracted criterion back to the original document section.
     * GREEN: parsing.py includes "source_anchor" in the response dict or Pydantic
     *        response model so callers can trace criteria back to their document origin.
     *
     * FR requirement: criteria must carry their provenance for audit traceability.
     */
    const src = readParsingPy();
    expect(
      src,
      '[T-W15-CP-006] parsing.py /parse response must include a `source_anchor` field.\n' +
      'Add `source_anchor` to the return dict / Pydantic response model to trace\n' +
      'each extracted criterion back to its source section in the original document.\n' +
      'Current stub response: { status, task_id, document_url, tenant_id } — no source_anchor.',
    ).toMatch(/source_anchor/i);
  });

  // ── Edge Function: DB inserts ───────────────────────────────────────────────

  it('[T-W15-CP-007] Edge Function contains DB insert logic for domains table', () => {
    /*
     * RED:  supabase/functions/invoke-ai-parse-criteria/index.ts does not exist.
     * GREEN: Edge Function exists AND inserts parsed domain rows into the `domains`
     *        table using the Supabase client (e.g. `supabase.from('domains').insert(...)`).
     *
     * The parsing pipeline must persist extracted criteria in the hierarchical
     * Domain → MPS → Criteria structure. Domains are the top-level entity.
     */
    const src = readEdgeFunction();
    expect(
      src,
      "[T-W15-CP-007] Edge Function must insert or upsert rows into the `domains` table.\n" +
      "Add: `await supabase.from('domains').insert([...])` or `.upsert([...])` after parsing is complete.\n" +
      "The domains table is the root of the Domain → MPS → Criteria hierarchy.",
    ).toMatch(/from\s*\(\s*['"`]domains['"`]\s*\)\s*\.(insert|upsert)|(?:insert|upsert).*domains/i);
  });

  it('[T-W15-CP-008] Edge Function contains DB insert logic for mini_performance_standards table', () => {
    /*
     * RED:  supabase/functions/invoke-ai-parse-criteria/index.ts does not exist.
     * GREEN: Edge Function exists AND inserts parsed MPS rows into the
     *        `mini_performance_standards` table.
     *
     * mini_performance_standards are the second tier in the hierarchy.
     * Each domain contains multiple MPS (the LDCS defines 25 MPS).
     */
    const src = readEdgeFunction();
    expect(
      src,
      "[T-W15-CP-008] Edge Function must insert or upsert rows into the `mini_performance_standards` table.\n" +
      "Add: `await supabase.from('mini_performance_standards').insert([...])` or `.upsert([...])` after domains are inserted.\n" +
      "MPS are the second tier of the Domain → MPS → Criteria hierarchy.",
    ).toMatch(/from\s*\(\s*['"`]mini_performance_standards['"`]\s*\)\s*\.(insert|upsert)|(?:insert|upsert).*mini_performance_standards/i);
  });

  it('[T-W15-CP-009] Edge Function contains DB insert logic for criteria table', () => {
    /*
     * RED:  supabase/functions/invoke-ai-parse-criteria/index.ts does not exist.
     * GREEN: Edge Function exists AND inserts parsed criteria rows into the
     *        `criteria` table (leaf nodes of the hierarchy).
     *
     * criteria are the leaf tier: Domain → MPS → Criteria.
     * Each criterion maps to a single auditable requirement.
     */
    const src = readEdgeFunction();
    expect(
      src,
      "[T-W15-CP-009] Edge Function must insert or upsert rows into the `criteria` table.\n" +
      "Add: `await supabase.from('criteria').insert([...])` or `.upsert([...])` after MPS rows are inserted.\n" +
      "criteria are leaf nodes in the Domain → MPS → Criteria hierarchy.",
    ).toMatch(/from\s*\(\s*['"`]criteria['"`]\s*\)\s*\.(insert|upsert)|(?:insert|upsert).*\bcriteria\b/i);
  });

  // ── useCriteria.ts: parse-status polling ────────────────────────────────────

  it('[T-W15-CP-010] useCriteria.ts contains parse-status polling logic', () => {
    /*
     * RED:  useCriteria.ts has no polling logic. useTriggerAIParsing() fires a
     *       mutation and returns — there is no hook that polls for parsing completion,
     *       no refetchInterval, no useInterval, and no useParseStatus type query.
     * GREEN: A `useParseStatus` (or similar) hook is added to useCriteria.ts that
     *        polls the parse task status using `refetchInterval` (TanStack Query)
     *        until status reaches "completed" or "failed".
     *
     * FR requirement: The UI must reflect parsing progress in real time (not just
     * fire-and-forget). Users need to see when parsing finishes or fails.
     */
    const exists = fs.existsSync(USE_CRITERIA_PATH);
    expect(exists, `useCriteria.ts must exist at: ${USE_CRITERIA_PATH}`).toBe(true);
    const src = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(
      src,
      '[T-W15-CP-010] useCriteria.ts must include parse-status polling logic.\n' +
      'Add a `useParseStatus` hook (or similar) with `refetchInterval` that polls\n' +
      'the parsing task status until it resolves to "completed" or "failed".\n' +
      'Current implementation has no polling — useTriggerAIParsing() is fire-and-forget.',
    ).toMatch(/refetchInterval|useParseStatus|parseStatus|parse.?status|polling/i);
  });

  // ── CriteriaUpload.tsx: explicit error surface (FR-103) ─────────────────────

  it('[T-W15-CP-011] CriteriaUpload.tsx surfaces explicit inline error messages per FR-103', () => {
    /*
     * RED:  CriteriaUpload.tsx uses browser `alert()` for upload failure messages.
     *       FR-103 requires explicit, rendered error messages in the UI — not browser
     *       dialogs. There is no `uploadError` state, no `data-testid="criteria-upload-error"`,
     *       and no rendered error element for upload failures.
     * GREEN: CriteriaUpload.tsx replaces `alert()` with a React state variable
     *        (e.g. `uploadError`) that renders an inline error message with
     *        `data-testid="criteria-upload-error"` and `role="alert"` so that
     *        error messages are visible in the DOM and testable.
     *
     * FR-103: "Upload component MUST surface explicit error messages — not silent fail."
     */
    const exists = fs.existsSync(CRITERIA_UPLOAD_PATH);
    expect(exists, `CriteriaUpload.tsx must exist at: ${CRITERIA_UPLOAD_PATH}`).toBe(true);
    const src = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(
      src,
      '[T-W15-CP-011] CriteriaUpload.tsx must have a rendered error state for upload failures (FR-103).\n' +
      'Add: an `uploadError` state variable + a JSX element with `data-testid="criteria-upload-error"`\n' +
      'that renders the error message inline in the component instead of calling `alert()`.\n' +
      'Current code calls `alert(...)` on upload failure — this violates FR-103.',
    ).toMatch(/data-testid=["']criteria-upload-error["']|uploadError/i);
  });

  // ── needs_human_review flag ──────────────────────────────────────────────────

  it('[T-W15-CP-012] DocumentParser or Edge Function contains needs_human_review flag logic', () => {
    /*
     * RED:  Neither parsing.py (stub) nor the Edge Function (absent) contain any
     *       `needs_human_review` or `needs_review` flag. The stub returns a static
     *       "queued" response with no confidence-based review routing.
     * GREEN: parsing.py's parse() return value (or the Edge Function response) includes
     *        a `needs_human_review` boolean field (set based on AI confidence score or
     *        parse quality heuristics) so that low-confidence extractions are flagged
     *        for manual review before criteria are activated.
     *
     * This flag supports the oversight workflow: uncertain AI output → human review queue.
     */
    const parsingSrc = readParsingPy();

    // Check parsing.py first, then also check Edge Function if it exists
    const edgeFnExists = fs.existsSync(EDGE_FN_PATH);
    const combinedSrc = edgeFnExists
      ? parsingSrc + '\n' + fs.readFileSync(EDGE_FN_PATH, 'utf-8')
      : parsingSrc;

    expect(
      combinedSrc,
      '[T-W15-CP-012] parsing.py or the Edge Function must include `needs_human_review` or ' +
      '`needs_review` flag logic.\n' +
      'Add: a boolean field to the parse() return dict that is set to True when AI confidence\n' +
      'is below threshold, signalling that the extracted criteria require human review.\n' +
      "Example: `needs_human_review: confidence_score < 0.8`",
    ).toMatch(/needs_human_review|needs_review/i);
  });

  // ── LDCS-pattern detection ───────────────────────────────────────────────────

  it('[T-W15-CP-013] Edge Function or AI Gateway contains LDCS-pattern detection (25 MPS / numbered hierarchy)', () => {
    /*
     * RED:  parsing.py stub has no LDCS-specific parsing logic. The Edge Function
     *       does not exist. Neither contains numbered-hierarchy pattern detection
     *       or knowledge of the 25-MPS LDCS structure.
     * GREEN: parsing.py (or the Edge Function) contains logic that detects the LDCS
     *        numbered hierarchy pattern (e.g. regex matching "X.Y.Z" numbered criteria,
     *        reference to "25" MPS, or explicit LDCS pattern strings).
     *
     * The LDCS uses a specific numbered structure: Domain > MPS (25 total) > Criteria.
     * Pattern detection ensures the parser correctly identifies LDCS-format documents
     * and applies the appropriate parsing strategy.
     */
    const parsingSrc = readParsingPy();
    const edgeFnExists = fs.existsSync(EDGE_FN_PATH);
    const combinedSrc = edgeFnExists
      ? parsingSrc + '\n' + fs.readFileSync(EDGE_FN_PATH, 'utf-8')
      : parsingSrc;

    expect(
      combinedSrc,
      '[T-W15-CP-013] parsing.py or Edge Function must contain LDCS-pattern detection.\n' +
      'Add: logic that identifies the LDCS numbered hierarchy (e.g. regex for "X.Y criteria numbers",\n' +
      'reference to 25 MPS, or LDCS document structure constants).\n' +
      'This ensures the AI parser correctly handles LDCS-format compliance documents.',
    ).toMatch(/ldcs|LDCS|25.*mps|mps.*25|\d+\.\d+\.\d+.*pattern|numbered.*hierarchy|hierarchy.*numbered/i);
  });

  // ── Audit trail logging ──────────────────────────────────────────────────────

  it('[T-W15-CP-014] Parsing outcome is logged to audit trail (audit_logs table insert present)', () => {
    /*
     * RED:  supabase/functions/invoke-ai-parse-criteria/index.ts does not exist.
     *       Even if it did, there is no audit trail logging — no insert into
     *       `audit_logs` or equivalent audit table.
     * GREEN: Edge Function (or parsing.py) contains a DB insert into `audit_logs`
     *        (or an equivalent audit table) recording the parsing event: who triggered
     *        it, when, which document, and what outcome (success/failure/review-required).
     *
     * This supports the ISMS audit trail requirement: all significant data-processing
     * actions must be recorded for compliance purposes.
     */
    const src = readEdgeFunction();
    expect(
      src,
      "[T-W15-CP-014] Edge Function must log parsing outcomes to the audit trail.\n" +
      "Add: `await supabase.from('audit_logs').insert({...})` (or equivalent audit table insert)\n" +
      "recording the parse event, actor, document, and outcome.\n" +
      "This satisfies the ISMS audit trail requirement for AI-driven data processing.",
    ).toMatch(/audit_logs|audit_trail|audit_events/i);
  });

});
