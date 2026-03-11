/**
 * Wave 17 — User-Guided AI Parsing Instruction System — QA Gate Tests
 * Test ID Suite: T-W17-QA-001 through T-W17-QA-012
 *
 * Wave    : wave-17-parsing-instructions
 * Branch  : copilot/implement-user-guided-ai-parsing
 * Session : session-qa-wave17-parsing-instructions-20260311
 * Producing Agent: qa-builder
 *
 * Coverage:
 *   T-W17-QA-001  — Migration file exists + adds parsing_instructions column
 *   T-W17-QA-002  — Migration creates parsing_instruction_templates table with correct columns
 *   T-W17-QA-003  — AI Gateway ParseRequest has user_instructions field
 *   T-W17-QA-004  — AI Gateway _call_gpt4_turbo accepts user_instructions parameter
 *   T-W17-QA-005  — ParsingInstructionsModal.tsx component file exists
 *   T-W17-QA-006  — ParsingInstructionsModal defines onConfirm and onCancel props
 *   T-W17-QA-007  — CriteriaUpload.tsx imports ParsingInstructionsModal
 *   T-W17-QA-008  — Edge Function BackgroundParseArgs interface has userInstructions field
 *   T-W17-QA-009  — Edge Function stores parsing_instructions to criteria_documents
 *   T-W17-QA-010  — AI Gateway _SYSTEM_PROMPT contains invariant schema guardrails
 *   T-W17-QA-011  — useCriteria.ts useTriggerAIParsing mutation type includes user_instructions
 *   T-W17-QA-012  — CriteriaUpload.tsx renders <ParsingInstructionsModal
 *
 * All tests are FILE-BASED (read actual source files, no live DB, no network calls).
 * Authority: foreman-v2-agent delegation T-W17-QA-001 through T-W17-QA-012
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Path constants ────────────────────────────────────────────────────────────

const MIGRATION_PATH = path.resolve(
  process.cwd(),
  'apps/maturion-maturity-legacy/supabase/migrations',
);

const WAVE17_MIGRATION = path.resolve(
  MIGRATION_PATH,
  '20260311000002_wave17_parsing_instructions.sql',
);

const PARSING_PY_PATH = path.resolve(
  process.cwd(),
  'apps/mat-ai-gateway/services/parsing.py',
);

const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

const MODAL_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/components/criteria/ParsingInstructionsModal.tsx',
);

const CRITERIA_UPLOAD_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx',
);

const USE_CRITERIA_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/lib/hooks/useCriteria.ts',
);

// ─── Helpers ───────────────────────────────────────────────────────────────────

function readFile(filePath: string, label: string): string {
  expect(
    fs.existsSync(filePath),
    `[INVARIANT] ${label} must exist at: ${filePath}`,
  ).toBe(true);
  return fs.readFileSync(filePath, 'utf-8');
}

// ══════════════════════════════════════════════════════════════════════════════
// Test Suite
// ══════════════════════════════════════════════════════════════════════════════

describe(
  'Wave 17 — User-Guided AI Parsing Instruction System (T-W17-QA-001 to T-W17-QA-012)',
  () => {

    // ── T-W17-QA-001 — Migration exists and adds parsing_instructions column ──

    it('[T-W17-QA-001] Migration file exists and contains ADD COLUMN IF NOT EXISTS parsing_instructions TEXT', () => {
      /*
       * GREEN STATE: The migration file 20260311000002_wave17_parsing_instructions.sql
       * exists and contains the ADD COLUMN clause that adds the parsing_instructions
       * TEXT column to criteria_documents.
       *
       * The column is nullable (no NOT NULL) so that existing documents without
       * instructions are unaffected.
       *
       * Note: The migration uses a PL/pgSQL DO block for idempotency. The relevant
       * ADD COLUMN clause is: ADD COLUMN parsing_instructions TEXT
       */
      const sql = readFile(
        WAVE17_MIGRATION,
        'Wave 17 migration (20260311000002_wave17_parsing_instructions.sql)',
      );

      expect(
        sql,
        '[T-W17-QA-001] FAIL — Migration does not contain ADD COLUMN ... parsing_instructions TEXT.\n' +
        'Required to persist user parsing guidance against the criteria_documents row.\n' +
        `Migration path: ${WAVE17_MIGRATION}`,
      ).toMatch(/ADD\s+COLUMN(?:\s+IF\s+NOT\s+EXISTS)?\s+parsing_instructions\s+TEXT/i);
    });

    // ── T-W17-QA-002 — Migration creates parsing_instruction_templates table ──

    it('[T-W17-QA-002] Migration creates parsing_instruction_templates table with required columns', () => {
      /*
       * GREEN STATE: The migration contains CREATE TABLE IF NOT EXISTS
       * public.parsing_instruction_templates with the following columns:
       *   id UUID, name TEXT NOT NULL, instructions TEXT NOT NULL,
       *   is_default BOOLEAN, is_system BOOLEAN, created_by UUID, created_at TIMESTAMPTZ
       *
       * This table stores named, reusable parsing instruction templates for tenants.
       */
      const sql = readFile(
        WAVE17_MIGRATION,
        'Wave 17 migration (20260311000002_wave17_parsing_instructions.sql)',
      );

      // Table creation
      expect(
        sql,
        '[T-W17-QA-002] FAIL — Migration missing CREATE TABLE IF NOT EXISTS public.parsing_instruction_templates.',
      ).toMatch(
        /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.parsing_instruction_templates/i,
      );

      // id UUID column
      expect(
        sql,
        '[T-W17-QA-002] FAIL — parsing_instruction_templates missing `id UUID` column.',
      ).toMatch(/\bid\s+UUID\b/i);

      // name TEXT NOT NULL
      expect(
        sql,
        '[T-W17-QA-002] FAIL — parsing_instruction_templates missing `name TEXT NOT NULL` column.',
      ).toMatch(/\bname\s+TEXT\b[^;]*NOT\s+NULL/i);

      // instructions TEXT NOT NULL
      expect(
        sql,
        '[T-W17-QA-002] FAIL — parsing_instruction_templates missing `instructions TEXT NOT NULL` column.',
      ).toMatch(/\binstructions\s+TEXT\b[^;]*NOT\s+NULL/i);

      // is_default BOOLEAN
      expect(
        sql,
        '[T-W17-QA-002] FAIL — parsing_instruction_templates missing `is_default BOOLEAN` column.',
      ).toMatch(/\bis_default\s+BOOLEAN\b/i);

      // is_system BOOLEAN
      expect(
        sql,
        '[T-W17-QA-002] FAIL — parsing_instruction_templates missing `is_system BOOLEAN` column.',
      ).toMatch(/\bis_system\s+BOOLEAN\b/i);

      // created_by UUID
      expect(
        sql,
        '[T-W17-QA-002] FAIL — parsing_instruction_templates missing `created_by UUID` column.',
      ).toMatch(/\bcreated_by\s+UUID\b/i);

      // created_at TIMESTAMPTZ
      expect(
        sql,
        '[T-W17-QA-002] FAIL — parsing_instruction_templates missing `created_at TIMESTAMPTZ` column.',
      ).toMatch(/\bcreated_at\s+TIMESTAMPTZ\b/i);
    });

    // ── T-W17-QA-003 — ParseRequest has user_instructions field ─────────────

    it('[T-W17-QA-003] parsing.py ParseRequest class contains user_instructions field definition', () => {
      /*
       * GREEN STATE: The ParseRequest Pydantic model in apps/mat-ai-gateway/services/parsing.py
       * has `user_instructions: str | None = None` allowing the edge function to pass
       * optional caller-supplied parsing guidance to the AI Gateway.
       *
       * BD-017/BD-018: user_instructions is injected into the user-role message,
       * never concatenated into the system prompt.
       */
      const src = readFile(PARSING_PY_PATH, 'AI Gateway parsing.py');

      expect(
        src,
        '[T-W17-QA-003] FAIL — ParseRequest in parsing.py does not define `user_instructions` field.\n' +
        'Required for Wave 17 user-guided parsing. Field should be `user_instructions: str | None = None`.\n' +
        `File: ${PARSING_PY_PATH}`,
      ).toMatch(/\buser_instructions\s*:\s*str\s*\|\s*None\s*=\s*None/);
    });

    // ── T-W17-QA-004 — _call_gpt4_turbo accepts user_instructions parameter ──

    it('[T-W17-QA-004] parsing.py _call_gpt4_turbo function accepts user_instructions parameter', () => {
      /*
       * GREEN STATE: The _call_gpt4_turbo function signature in parsing.py includes
       * a `user_instructions` parameter (str | None), so it can accept optional
       * guidance from the request and inject it into the user-role message.
       */
      const src = readFile(PARSING_PY_PATH, 'AI Gateway parsing.py');

      // Match function definition with user_instructions parameter
      expect(
        src,
        '[T-W17-QA-004] FAIL — _call_gpt4_turbo in parsing.py does not accept `user_instructions` parameter.\n' +
        'Required signature: def _call_gpt4_turbo(document_text: str, user_instructions: str | None = None)\n' +
        `File: ${PARSING_PY_PATH}`,
      ).toMatch(/def\s+_call_gpt4_turbo\s*\([^)]*user_instructions/);
    });

    // ── T-W17-QA-005 — ParsingInstructionsModal.tsx exists ──────────────────

    it('[T-W17-QA-005] ParsingInstructionsModal.tsx exists at the correct path', () => {
      /*
       * GREEN STATE: The ParsingInstructionsModal component file exists at
       * modules/mat/frontend/src/components/criteria/ParsingInstructionsModal.tsx
       *
       * This component provides the UI for users to enter/select parsing instructions
       * before triggering AI document parsing (Wave 17 T-W17-UI-001).
       */
      expect(
        fs.existsSync(MODAL_PATH),
        '[T-W17-QA-005] FAIL — ParsingInstructionsModal.tsx does NOT exist.\n' +
        `Expected path: ${MODAL_PATH}\n` +
        'This component is required for the Wave 17 user-guided parsing UI.',
      ).toBe(true);
    });

    // ── T-W17-QA-006 — ParsingInstructionsModal defines onConfirm + onCancel ─

    it('[T-W17-QA-006] ParsingInstructionsModal.tsx defines onConfirm and onCancel props', () => {
      /*
       * GREEN STATE: The ParsingInstructionsModalProps interface in ParsingInstructionsModal.tsx
       * defines both:
       *   - onConfirm: callback invoked when the user submits instructions
       *   - onCancel: callback invoked when the user dismisses the modal
       *
       * These props are the public API surface of the modal component.
       */
      const src = readFile(MODAL_PATH, 'ParsingInstructionsModal.tsx');

      expect(
        src,
        '[T-W17-QA-006] FAIL — ParsingInstructionsModal.tsx missing `onConfirm` prop definition.\n' +
        `File: ${MODAL_PATH}`,
      ).toMatch(/\bonConfirm\s*:/);

      expect(
        src,
        '[T-W17-QA-006] FAIL — ParsingInstructionsModal.tsx missing `onCancel` prop definition.\n' +
        `File: ${MODAL_PATH}`,
      ).toMatch(/\bonCancel\s*:/);
    });

    // ── T-W17-QA-007 — CriteriaUpload.tsx imports ParsingInstructionsModal ──

    it('[T-W17-QA-007] CriteriaUpload.tsx imports ParsingInstructionsModal', () => {
      /*
       * GREEN STATE: CriteriaUpload.tsx has an import statement that imports
       * ParsingInstructionsModal from './ParsingInstructionsModal' (or equivalent
       * relative path), integrating the modal into the upload workflow.
       */
      const src = readFile(CRITERIA_UPLOAD_PATH, 'CriteriaUpload.tsx');

      expect(
        src,
        '[T-W17-QA-007] FAIL — CriteriaUpload.tsx does not import `ParsingInstructionsModal`.\n' +
        'The upload component must import the modal to display parsing instruction UI.\n' +
        `File: ${CRITERIA_UPLOAD_PATH}`,
      ).toMatch(/import[^;]*ParsingInstructionsModal/);
    });

    // ── T-W17-QA-008 — Edge Function BackgroundParseArgs has userInstructions ─

    it('[T-W17-QA-008] Edge function BackgroundParseArgs interface includes userInstructions field', () => {
      /*
       * GREEN STATE: The BackgroundParseArgs interface in
       * supabase/functions/invoke-ai-parse-criteria/index.ts includes a
       * `userInstructions` field, enabling the background parsing worker to
       * forward user instructions to the AI Gateway.
       */
      const src = readFile(EDGE_FN_PATH, 'invoke-ai-parse-criteria/index.ts');

      // Locate the BackgroundParseArgs interface block
      const interfaceMatch = src.match(
        /interface\s+BackgroundParseArgs\s*\{[^}]+\}/s,
      );

      expect(
        interfaceMatch,
        '[T-W17-QA-008] FAIL — BackgroundParseArgs interface not found in Edge Function.\n' +
        `File: ${EDGE_FN_PATH}`,
      ).not.toBeNull();

      expect(
        interfaceMatch![0],
        '[T-W17-QA-008] FAIL — BackgroundParseArgs interface does not include `userInstructions` field.\n' +
        'Required to thread user parsing instructions through to the AI Gateway.\n' +
        `File: ${EDGE_FN_PATH}`,
      ).toMatch(/\buserInstructions\b/);
    });

    // ── T-W17-QA-009 — Edge Function stores parsing_instructions to criteria_documents

    it('[T-W17-QA-009] Edge function stores parsing_instructions to criteria_documents', () => {
      /*
       * GREEN STATE: The Edge Function contains logic to persist the user-supplied
       * parsing instructions to the criteria_documents table via a Supabase update
       * call containing `parsing_instructions: userInstructions`.
       *
       * This is the "store intent, not outcome" pattern — instructions are stored
       * before background dispatch so they survive gateway failures.
       */
      const src = readFile(EDGE_FN_PATH, 'invoke-ai-parse-criteria/index.ts');

      expect(
        src,
        '[T-W17-QA-009] FAIL — Edge Function does not persist `parsing_instructions` to criteria_documents.\n' +
        'Required pattern: `.update({ parsing_instructions: userInstructions })`\n' +
        `File: ${EDGE_FN_PATH}`,
      ).toMatch(/parsing_instructions\s*:\s*userInstructions/);
    });

    // ── T-W17-QA-010 — _SYSTEM_PROMPT contains invariant schema guardrails ──

    it('[T-W17-QA-010] parsing.py _SYSTEM_PROMPT contains invariant schema guardrails', () => {
      /*
       * GREEN STATE: The _SYSTEM_PROMPT constant in parsing.py contains all three
       * required guardrail elements:
       *   1. "INVARIANT" — schema cannot be changed by user instructions
       *   2. "VERBATIM" or "verbatim" — description fields must be extracted verbatim
       *   3. JSON schema spec with "domains", "mini_performance_standards", "criteria"
       *      ensuring the AI always outputs the correct structured format
       *
       * This ensures user instructions cannot override the fundamental output contract.
       * BD-017/BD-018: user instructions are injected into the user-role message only;
       * the system prompt schema is immutable.
       */
      const src = readFile(PARSING_PY_PATH, 'AI Gateway parsing.py');

      // Locate the _SYSTEM_PROMPT constant block
      const promptMatch = src.match(/_SYSTEM_PROMPT\s*=\s*"""[\s\S]+?"""/);

      expect(
        promptMatch,
        '[T-W17-QA-010] FAIL — _SYSTEM_PROMPT constant not found in parsing.py.\n' +
        `File: ${PARSING_PY_PATH}`,
      ).not.toBeNull();

      const prompt = promptMatch![0];

      // Must contain INVARIANT keyword
      expect(
        prompt,
        '[T-W17-QA-010] FAIL — _SYSTEM_PROMPT missing "INVARIANT" guardrail.\n' +
        'Required to prevent user instructions from overriding the output schema.\n' +
        `File: ${PARSING_PY_PATH}`,
      ).toMatch(/INVARIANT/);

      // Must contain VERBATIM or verbatim keyword
      expect(
        prompt,
        '[T-W17-QA-010] FAIL — _SYSTEM_PROMPT missing "VERBATIM"/"verbatim" guardrail.\n' +
        'Required to ensure description fields contain complete criterion text.\n' +
        `File: ${PARSING_PY_PATH}`,
      ).toMatch(/[Vv][Ee][Rr][Bb][Aa][Tt][Ii][Mm]/);

      // Must contain domains in JSON schema spec
      expect(
        prompt,
        '[T-W17-QA-010] FAIL — _SYSTEM_PROMPT missing "domains" in JSON schema spec.\n' +
        `File: ${PARSING_PY_PATH}`,
      ).toMatch(/"domains"/);

      // Must contain mini_performance_standards in JSON schema spec
      expect(
        prompt,
        '[T-W17-QA-010] FAIL — _SYSTEM_PROMPT missing "mini_performance_standards" in JSON schema spec.\n' +
        `File: ${PARSING_PY_PATH}`,
      ).toMatch(/"mini_performance_standards"/);

      // Must contain criteria in JSON schema spec
      expect(
        prompt,
        '[T-W17-QA-010] FAIL — _SYSTEM_PROMPT missing "criteria" in JSON schema spec.\n' +
        `File: ${PARSING_PY_PATH}`,
      ).toMatch(/"criteria"/);
    });

    // ── T-W17-QA-011 — useCriteria.ts useTriggerAIParsing includes user_instructions

    it('[T-W17-QA-011] useCriteria.ts useTriggerAIParsing mutation type includes user_instructions', () => {
      /*
       * GREEN STATE: The useTriggerAIParsing hook in useCriteria.ts uses a mutation
       * type that includes a `user_instructions` field, enabling callers to pass
       * optional parsing instructions through the React Query mutation call.
       *
       * Expected pattern: { auditId: string; filePath: string; user_instructions?: string | null }
       */
      const src = readFile(USE_CRITERIA_PATH, 'useCriteria.ts');

      expect(
        src,
        '[T-W17-QA-011] FAIL — useCriteria.ts useTriggerAIParsing does not include `user_instructions` in mutation type.\n' +
        'Required for CriteriaUpload to pass user instructions through to the Edge Function.\n' +
        `File: ${USE_CRITERIA_PATH}`,
      ).toMatch(/\buser_instructions\b/);
    });

    // ── T-W17-QA-012 — CriteriaUpload.tsx renders <ParsingInstructionsModal ──

    it('[T-W17-QA-012] CriteriaUpload.tsx renders <ParsingInstructionsModal component', () => {
      /*
       * GREEN STATE: CriteriaUpload.tsx contains a JSX usage of the
       * ParsingInstructionsModal component (<ParsingInstructionsModal ...).
       *
       * This confirms the modal is not only imported (T-W17-QA-007) but also
       * rendered in the component tree so it is visible to users.
       */
      const src = readFile(CRITERIA_UPLOAD_PATH, 'CriteriaUpload.tsx');

      expect(
        src,
        '[T-W17-QA-012] FAIL — CriteriaUpload.tsx does not render <ParsingInstructionsModal.\n' +
        'The component must be rendered (not just imported) for the Wave 17 UI to work.\n' +
        `File: ${CRITERIA_UPLOAD_PATH}`,
      ).toMatch(/<ParsingInstructionsModal/);
    });
  },
);
