/**
 * MMM Subject Knowledge — Resource Budget Helpers (issue #2025 / task #2029)
 *
 * Pure, dependency-free decision/utility functions backing the bounded/async-capable
 * redesign of `mmm-subject-knowledge-reprocess`. Deliberately kept free of Deno-specific
 * globals (e.g. `Deno.env`) and remote ESM specifiers (unlike
 * `../_shared/mmm-subject-knowledge.ts`, which imports JSZip via an `https://esm.sh/...`
 * import) so this module can be imported both by the Deno Edge Function runtime AND by the
 * repository's existing Vitest/Node test setup, for genuine behavioral unit-test coverage —
 * see `modules/MMM/tests/B4-framework/mmm-subject-knowledge-resource-budget.test.ts`.
 *
 * Production fault under remediation (issue #2025): `mmm-subject-knowledge-reprocess`
 * previously performed synchronous, unbounded work (KUC upload, an AI Gateway parse call with
 * its own 120s internal timeout, best-effort text extraction, chunk building/indexing) inside
 * a single Edge Function invocation, causing HTTP 546 WORKER_RESOURCE_LIMIT at ~125.6s for
 * resource-heavy documents.
 *
 * Supabase Edge Function platform limits (https://supabase.com/docs/guides/functions/limits):
 *   - Maximum CPU time: 2s per request (excludes async I/O wait)
 *   - Maximum wall-clock duration: 150s (free plan) / 400s (paid plans)
 *   - Request idle timeout: 150s (if no response is sent, 504 Gateway Timeout)
 *
 * These constants and helpers keep every phase of the reprocess pipeline safely bounded well
 * under those ceilings, and support handing off long-running work to
 * `EdgeRuntime.waitUntil()` background completion
 * (https://supabase.com/docs/guides/functions/background-tasks) instead of ever blocking the
 * HTTP response on unbounded upstream work.
 */

/**
 * Hard ceiling for a single AI Gateway parse upstream call. Reduced from the prior 120_000ms
 * (2 minutes) — the primary contributor to the ~125.6s WORKER_RESOURCE_LIMIT fault. A single
 * upstream fetch must never be allowed to consume a large fraction of the platform's
 * 150s/400s wall-clock ceilings by itself.
 */
export const AI_PARSE_TIMEOUT_MS = 15_000;

/**
 * Overall "try to finish synchronously" budget. If the full pipeline (storage download + KUC
 * upload + AI Gateway parse + text extraction + chunk build + ai_knowledge/verbatim index
 * writes + final document status write) has not resolved within this window, the request
 * handler stops waiting on it and instead hands the still-running pipeline promise off to
 * `EdgeRuntime.waitUntil()` for background completion, responding immediately with a
 * `processing_status: 'processing'` acknowledgement.
 *
 * This preserves the existing single-document happy-path response shape (a full result
 * payload returned synchronously) for the common case of small/fast documents, while
 * guaranteeing the HTTP response itself can never be the thing that exhausts the Edge
 * Function worker resource limit — no document, however large or slow to parse, can hold the
 * response open past this budget.
 */
export const SYNC_COMPLETION_BUDGET_MS = 8_000;

/**
 * Hard ceiling for the deferred/background completion of the pipeline (only reached when the
 * sync budget above has already been exceeded). Chosen so the worst case — sync budget spent
 * (8s) plus this ceiling (100s) = 108s — stays safely under the free plan's 150s wall-clock /
 * idle-timeout ceiling (42s margin), with much larger margin under the paid plan's 400s
 * ceiling. If this fires, a durable `processing_status: 'failed'` update is written so the
 * per-file status the client polls never gets silently stuck at `processing` because the
 * platform killed the worker before the pipeline's own completion handler ran.
 */
export const BACKGROUND_COMPLETION_HARD_TIMEOUT_MS = 100_000;

/**
 * Hard cap on the number of characters of extracted text that will be pushed through the
 * CPU-bound chunk/regex extraction pipeline in a single pass. Protects against a
 * pathologically large text-like (TXT/MD/CSV/JSON) source, or an oversized AI/KUC-derived
 * text blob, burning past the platform's ~2s per-request CPU-time budget synchronously.
 * Content beyond this cap is truncated for processing purposes only (the original uploaded
 * file in storage is never modified).
 */
export const MAX_SYNCHRONOUS_TEXT_CHARS = 4_000_000;

/**
 * Decide whether the pipeline's synchronous completion budget has been exceeded.
 *
 * Pure function: no I/O, no globals, deterministic for given inputs.
 */
export function isSyncBudgetExceeded(
  elapsedMs: number,
  budgetMs: number = SYNC_COMPLETION_BUDGET_MS,
): boolean {
  return elapsedMs >= budgetMs;
}

export type TruncationResult = {
  text: string;
  truncated: boolean;
  originalLength: number;
};

/**
 * Bound the amount of text handed to CPU-bound chunk/regex extraction.
 *
 * Pure and side-effect-free: never throws, always returns a `text` no longer than `maxChars`.
 */
export function truncateForSynchronousProcessing(
  text: string,
  maxChars: number = MAX_SYNCHRONOUS_TEXT_CHARS,
): TruncationResult {
  const safeText = typeof text === 'string' ? text : '';
  if (safeText.length <= maxChars) {
    return { text: safeText, truncated: false, originalLength: safeText.length };
  }
  return {
    text: safeText.slice(0, maxChars),
    truncated: true,
    originalLength: safeText.length,
  };
}

/**
 * Build the fast, non-blocking response body returned when the pipeline is deferred to
 * background completion (`EdgeRuntime.waitUntil()`). Kept as a pure function so its shape is
 * unit-testable without a running Edge Function/Deno runtime.
 */
export function buildDeferredAcceptedResponse(documentId: string): Record<string, unknown> {
  return {
    success: true,
    document_id: documentId,
    processing_status: 'processing',
    deferred: true,
    message:
      'Document accepted for processing; ingestion continues in the background and ' +
      'processing_status will be updated to completed/failed when it finishes.',
  };
}

/**
 * Build the durable-status DB update payload written when the background completion hard
 * timeout fires before the underlying pipeline settled. Pure/deterministic aside from the
 * caller-supplied timestamp/user id, so tests can assert on shape without touching
 * `Date.now()`/mocks.
 */
export function buildBackgroundTimeoutFailureUpdate(
  nowIso: string,
  updatedBy: string,
): Record<string, unknown> {
  return {
    processing_status: 'failed',
    processing_error:
      'Reprocess exceeded the background completion time budget ' +
      `(${BACKGROUND_COMPLETION_HARD_TIMEOUT_MS}ms) and was aborted to protect platform ` +
      'resources. Re-run reprocess, or contact support if this recurs for this document.',
    updated_by: updatedBy,
    updated_at: nowIso,
  };
}
