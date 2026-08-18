/**
 * T-2025-API: behavioral unit tests for the pure resource-budget decision helpers backing the
 * resource-safe redesign of `mmm-subject-knowledge-reprocess` (issue #2025 / task #2029).
 *
 * Unlike the repo's existing precedent for "testing" Deno Edge Function code (source-text
 * presence checks via `readFileSync(...).toContain(...)`, see e.g.
 * `dmc-subject-knowledge-routing.test.ts` / `ai-linkage-fallbacks.test.ts`), this file performs
 * a genuine runtime `import` of the module under test and asserts on actual behavior. This is
 * possible because `../_shared/mmm-subject-knowledge-resource-budget.ts` was deliberately
 * written free of Deno-specific globals and remote ESM specifiers so it is a plain,
 * Node/Vitest-importable TypeScript module.
 *
 * There is no Deno test harness in this repository (confirmed: no `supabase/functions/**\/*.test.ts`
 * files exist, and the Deno CLI is unavailable in this environment) and this file does not
 * attempt to fabricate one — it covers only the pure, extractable decision logic, and the
 * final builder report explicitly discloses that the surrounding `Deno.serve` handler wiring
 * (storage download, KUC upload, AI Gateway fetch, Supabase table writes) is NOT covered by an
 * executable test in this environment, only by careful manual review.
 */
import { describe, expect, it } from 'vitest';
import {
  AI_PARSE_TIMEOUT_MS,
  BACKGROUND_COMPLETION_HARD_TIMEOUT_MS,
  MAX_SYNCHRONOUS_TEXT_CHARS,
  SYNC_COMPLETION_BUDGET_MS,
  buildBackgroundTimeoutFailureUpdate,
  buildDeferredAcceptedResponse,
  isSyncBudgetExceeded,
  truncateForSynchronousProcessing,
} from '../../../../supabase/functions/_shared/mmm-subject-knowledge-resource-budget.ts';

describe('T-2025-API: resource-budget constants stay safely under platform limits', () => {
  it('reduces the AI Gateway parse timeout well below the prior 120_000ms root cause', () => {
    expect(AI_PARSE_TIMEOUT_MS).toBeLessThan(120_000);
    expect(AI_PARSE_TIMEOUT_MS).toBeGreaterThan(0);
  });

  it('keeps sync completion budget + background hard timeout under the free-plan 150s wall-clock ceiling', () => {
    const worstCaseMs = SYNC_COMPLETION_BUDGET_MS + BACKGROUND_COMPLETION_HARD_TIMEOUT_MS;
    expect(worstCaseMs).toBeLessThan(150_000);
  });

  it('keeps the sync completion budget well under the client-side 45_000ms invoke abort timeout', () => {
    // OrganisationContextPage.tsx REPROCESS_INVOKE_TIMEOUT_MS = 45_000.
    expect(SYNC_COMPLETION_BUDGET_MS).toBeLessThan(45_000);
  });

  it('caps synchronous text processing to a bounded character count', () => {
    expect(MAX_SYNCHRONOUS_TEXT_CHARS).toBeGreaterThan(0);
    expect(Number.isFinite(MAX_SYNCHRONOUS_TEXT_CHARS)).toBe(true);
  });
});

describe('T-2025-API: isSyncBudgetExceeded', () => {
  it('returns false when elapsed time is under the default budget', () => {
    expect(isSyncBudgetExceeded(SYNC_COMPLETION_BUDGET_MS - 1)).toBe(false);
  });

  it('returns true when elapsed time exactly equals the default budget', () => {
    expect(isSyncBudgetExceeded(SYNC_COMPLETION_BUDGET_MS)).toBe(true);
  });

  it('returns true when elapsed time exceeds the default budget', () => {
    expect(isSyncBudgetExceeded(SYNC_COMPLETION_BUDGET_MS + 1)).toBe(true);
  });

  it('honors a custom budget override', () => {
    expect(isSyncBudgetExceeded(500, 1_000)).toBe(false);
    expect(isSyncBudgetExceeded(1_000, 1_000)).toBe(true);
    expect(isSyncBudgetExceeded(1_500, 1_000)).toBe(true);
  });
});

describe('T-2025-API: truncateForSynchronousProcessing', () => {
  it('leaves short text unchanged and reports truncated: false', () => {
    const result = truncateForSynchronousProcessing('hello world');
    expect(result).toEqual({ text: 'hello world', truncated: false, originalLength: 11 });
  });

  it('truncates text longer than the default max to exactly maxChars and reports originalLength', () => {
    const longText = 'a'.repeat(MAX_SYNCHRONOUS_TEXT_CHARS + 500);
    const result = truncateForSynchronousProcessing(longText);
    expect(result.truncated).toBe(true);
    expect(result.text.length).toBe(MAX_SYNCHRONOUS_TEXT_CHARS);
    expect(result.originalLength).toBe(MAX_SYNCHRONOUS_TEXT_CHARS + 500);
  });

  it('honors a custom maxChars override', () => {
    const result = truncateForSynchronousProcessing('abcdefghij', 4);
    expect(result).toEqual({ text: 'abcd', truncated: true, originalLength: 10 });
  });

  it('treats text exactly at maxChars as not truncated', () => {
    const exact = 'abcd';
    const result = truncateForSynchronousProcessing(exact, 4);
    expect(result).toEqual({ text: 'abcd', truncated: false, originalLength: 4 });
  });

  it('coerces non-string input to an empty string without throwing', () => {
    // deliberate any-cast: exercising the runtime defensive coercion for non-string inputs
    // that pure-TS typing alone can't fully prevent (e.g. a null coming from a JS caller).
    const result = truncateForSynchronousProcessing(null as unknown as string);
    expect(result).toEqual({ text: '', truncated: false, originalLength: 0 });
  });
});

describe('T-2025-API: buildDeferredAcceptedResponse', () => {
  it('builds the expected fast-path accepted response shape', () => {
    const response = buildDeferredAcceptedResponse('doc-123');
    expect(response).toMatchObject({
      success: true,
      document_id: 'doc-123',
      processing_status: 'processing',
      deferred: true,
    });
    expect(typeof response.message).toBe('string');
    expect((response.message as string).length).toBeGreaterThan(0);
  });
});

describe('T-2025-API: buildBackgroundTimeoutFailureUpdate', () => {
  it('builds a durable failed-status update payload referencing the hard timeout value', () => {
    const nowIso = '2026-08-18T12:00:00.000Z';
    const update = buildBackgroundTimeoutFailureUpdate(nowIso, 'user-abc');
    expect(update).toMatchObject({
      processing_status: 'failed',
      updated_by: 'user-abc',
      updated_at: nowIso,
    });
    expect(typeof update.processing_error).toBe('string');
    expect(update.processing_error as string).toContain(String(BACKGROUND_COMPLETION_HARD_TIMEOUT_MS));
  });
});
