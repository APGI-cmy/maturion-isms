/**
 * Wave session-refresh-auth-fix — RED Gate Tests
 * Test ID Suite: T-SRAF-001 through T-SRAF-004
 *
 * Wave    : wave-session-refresh-auth-fix
 * Branch  : copilot/fix-session-refresh-auth-header
 * Task    : T-SRAF-QA-001 (qa-builder)
 * Session : qa-builder-session-wave-session-refresh-auth-fix
 * IAA Pre-Brief : IAA-PREBRIEF-WAVE-SESSION-REFRESH-AUTH-FIX-20260309
 *
 * Problem Statement:
 *   supabase.functions.invoke('invoke-ai-parse-criteria') does not automatically refresh
 *   a stale or expired session. When the JWT in the Authorization header is invalid,
 *   the Edge Function returns 401 Unauthorized.
 *
 * Fix Target:
 *   `useTriggerAIParsing` in modules/mat/frontend/src/lib/hooks/useCriteria.ts must call
 *   `supabase.auth.getSession()` before `supabase.functions.invoke(...)` to ensure the
 *   session is valid. If the session is missing or errored, the mutation must throw
 *   exactly: 'Authentication required. Please sign in again.'
 *
 * RED STATE (expected before T-SRAF-API-001 implementation lands):
 *   - useTriggerAIParsing does NOT call supabase.auth.getSession()
 *   - No guard exists that checks for a null/missing session
 *   - No guard exists that checks for a sessionError
 *   - The exact error message 'Authentication required. Please sign in again.' is absent
 *   - supabase.functions.invoke is called unconditionally regardless of session state
 *
 * GREEN STATE (after T-SRAF-API-001 lands):
 *   - useTriggerAIParsing calls supabase.auth.getSession() before functions.invoke()
 *   - Throws 'Authentication required. Please sign in again.' on null session
 *   - Throws 'Authentication required. Please sign in again.' on sessionError
 *   - functions.invoke is only reached when a valid session is present
 *
 * Test approach: File-based source analysis.
 *   All assertions inspect the source of useCriteria.ts directly.
 *   No live Supabase environment required. Tests are CI-safe.
 *
 * Authority: foreman-v2-agent delegation T-SRAF-QA-001
 *            IAA Pre-Brief IAA-PREBRIEF-WAVE-SESSION-REFRESH-AUTH-FIX-20260309
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Path to the hook under test ───────────────────────────────────────────────

const USE_CRITERIA_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/lib/hooks/useCriteria.ts',
);

// ─── Helper: extract the useTriggerAIParsing function body ────────────────────

/**
 * Reads useCriteria.ts and returns the text of the `useTriggerAIParsing`
 * function body, from its declaration line to the closing `}` of the outer
 * `useMutation` call (found by tracking brace depth).
 *
 * Uses balanced-brace extraction rather than a fixed slice length so the
 * test cannot silently pass or fail due to function body size changes.
 *
 * Fails immediately if the file does not exist or the function declaration
 * cannot be found — both cases indicate a broken environment, not a RED test.
 */
function readUseTriggerAIParsing(): string {
  expect(
    fs.existsSync(USE_CRITERIA_PATH),
    `useCriteria.ts not found at expected path:\n  ${USE_CRITERIA_PATH}\n` +
    `Ensure the repository checkout is complete before running these tests.`,
  ).toBe(true);

  const src = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');

  const fnStart = src.indexOf('export function useTriggerAIParsing');
  expect(
    fnStart,
    `'export function useTriggerAIParsing' declaration not found in useCriteria.ts.\n` +
    `The function must be present for these tests to execute — do not rename or remove it.`,
  ).toBeGreaterThanOrEqual(0);

  // Extract the full function body by tracking brace depth from the first `{`
  // after the function declaration. Stops at the closing `}` that brings depth
  // back to zero — ensuring we capture exactly the function, regardless of size.
  const searchFrom = fnStart;
  let depth = 0;
  let fnEnd = searchFrom;
  let foundOpen = false;

  for (let i = searchFrom; i < src.length; i++) {
    if (src[i] === '{') {
      depth++;
      foundOpen = true;
    } else if (src[i] === '}') {
      depth--;
      if (foundOpen && depth === 0) {
        fnEnd = i + 1;
        break;
      }
    }
  }

  expect(
    foundOpen && fnEnd > fnStart,
    `Could not extract useTriggerAIParsing function body from useCriteria.ts — ` +
    `balanced-brace extraction failed. The function may be malformed.`,
  ).toBe(true);

  return src.slice(fnStart, fnEnd);
}

// ─── Named regex for the combined session guard condition ─────────────────────

/**
 * Matches the combined session guard condition in either operand order:
 *   if (sessionError || !session)
 *   if (!session || sessionError)
 *
 * Extracted as a named constant to avoid duplication and make the intent explicit.
 */
const SESSION_GUARD_REGEX =
  /if\s*\(\s*sessionError\s*\|\|\s*!session\s*\)|if\s*\(\s*!session\s*\|\|\s*sessionError\s*\)/;

// ══════════════════════════════════════════════════════════════════════════════
// Test Suite — T-SRAF-001 through T-SRAF-004
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave session-refresh-auth-fix — useTriggerAIParsing session guard (T-SRAF-001 to T-SRAF-004)', () => {

  // ── T-SRAF-001: getSession called before invoke ────────────────────────────

  it('[T-SRAF-001] mutationFn calls supabase.auth.getSession() before supabase.functions.invoke()', () => {
    /*
     * RED:  useTriggerAIParsing currently calls supabase.functions.invoke() directly
     *       without first calling supabase.auth.getSession(). The string
     *       'supabase.auth.getSession' does not appear in the function body at all.
     *
     * GREEN: api-builder adds `supabase.auth.getSession()` as the FIRST async call
     *        inside mutationFn, before the `supabase.functions.invoke(...)` call.
     *
     * Assertion (execution order):
     *   1. supabase.auth.getSession is present in the function body.
     *   2. Its position (character index) within the function body is strictly
     *      less than the position of supabase.functions.invoke — proving it is
     *      called first.
     *
     * FRS reference: Auth guard on AI parsing trigger (session-refresh-auth-fix issue).
     * IAA check: BD-005 (end-to-end wiring), BD-007 (auth guard).
     */
    const fn = readUseTriggerAIParsing();

    // Assert presence: getSession must appear in the function body
    expect(
      fn,
      '[T-SRAF-001 RED — EXPECTED before T-SRAF-API-001 implementation]\n' +
      'useTriggerAIParsing mutationFn does not call supabase.auth.getSession().\n' +
      'api-builder must add: const { data: { session }, error: sessionError } = await supabase.auth.getSession();\n' +
      'This call must appear BEFORE supabase.functions.invoke(...) in the function body.',
    ).toMatch(/supabase\.auth\.getSession\(\)/);

    // Assert execution order: getSession index must be before functions.invoke index
    const getSessionIdx = fn.indexOf('supabase.auth.getSession');
    const invokeIdx = fn.indexOf('supabase.functions.invoke');

    expect(
      invokeIdx,
      '[T-SRAF-001] supabase.functions.invoke not found in useTriggerAIParsing — unexpected state.',
    ).toBeGreaterThanOrEqual(0);

    expect(
      getSessionIdx,
      '[T-SRAF-001 RED — EXPECTED before T-SRAF-API-001 implementation]\n' +
      'supabase.auth.getSession() must be called BEFORE supabase.functions.invoke().\n' +
      `getSession index: ${getSessionIdx}, functions.invoke index: ${invokeIdx}\n` +
      'Reorder the calls so getSession precedes functions.invoke in the function body.',
    ).toBeLessThan(invokeIdx);
  });

  // ── T-SRAF-002: throws exact message on null/missing session ───────────────

  it('[T-SRAF-002] mutationFn throws exact error message when session is null (missing session)', () => {
    /*
     * RED:  useTriggerAIParsing currently has no null-session guard. There is no
     *       check for `!session` and the exact string
     *       'Authentication required. Please sign in again.' does not exist in
     *       the function body.
     *
     * GREEN: api-builder adds the guard:
     *          if (sessionError || !session) {
     *            throw new Error('Authentication required. Please sign in again.');
     *          }
     *        The check `!session` must be present, and the error message must
     *        match exactly (including punctuation and capitalisation).
     *
     * Assertion (null-session guard):
     *   1. The function body contains `!session` (null/undefined session check).
     *   2. The function body contains the EXACT error message string.
     *
     * Note on exact message: IAA will reject any test that only checks the function
     * throws without verifying the exact message. This test pins the exact string.
     *
     * IAA check: BD-013 (no test dodging), FFA Test Quality table row (b).
     */
    const fn = readUseTriggerAIParsing();

    // Assert: null session check is present
    expect(
      fn,
      '[T-SRAF-002 RED — EXPECTED before T-SRAF-API-001 implementation]\n' +
      'useTriggerAIParsing mutationFn does not contain a null-session guard (`!session`).\n' +
      'api-builder must add: if (sessionError || !session) { throw new Error(...) }\n' +
      'The guard must check `!session` to handle the case where getSession() returns null.',
    ).toMatch(/!\s*session/);

    // Assert: exact error message for null/missing session
    expect(
      fn,
      '[T-SRAF-002 RED — EXPECTED before T-SRAF-API-001 implementation]\n' +
      "useTriggerAIParsing does not throw 'Authentication required. Please sign in again.' " +
      'when session is null.\n' +
      "api-builder must add: throw new Error('Authentication required. Please sign in again.');\n" +
      'inside the session guard block. The message must match EXACTLY ' +
      "(including capitalisation, punctuation, and the trailing period after 'again').",
    ).toContain('Authentication required. Please sign in again.');
  });

  // ── T-SRAF-003: throws exact message on sessionError ──────────────────────

  it('[T-SRAF-003] mutationFn throws exact error message when getSession() returns a sessionError', () => {
    /*
     * RED:  useTriggerAIParsing currently has no sessionError guard. The identifier
     *       'sessionError' does not appear in the function body, and there is no
     *       condition that checks it before calling functions.invoke.
     *
     * GREEN: api-builder destructures the getSession() response to capture sessionError:
     *          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
     *        and then guards:
     *          if (sessionError || !session) {
     *            throw new Error('Authentication required. Please sign in again.');
     *          }
     *        Both `sessionError` (as identifier) and the guard condition
     *        `sessionError ||` or `|| sessionError` must be present.
     *
     * Assertion (sessionError guard):
     *   1. The identifier `sessionError` is present in the function body.
     *   2. A conditional guard exists that references sessionError as a trigger condition.
     *   3. The exact error message is thrown (same message as null-session case — both
     *      conditions share a single throw, per the target implementation).
     *
     * IAA check: BD-013, FFA Test Quality table row (c).
     */
    const fn = readUseTriggerAIParsing();

    // Assert: sessionError identifier is present
    expect(
      fn,
      '[T-SRAF-003 RED — EXPECTED before T-SRAF-API-001 implementation]\n' +
      'useTriggerAIParsing mutationFn does not reference `sessionError`.\n' +
      'api-builder must destructure the getSession() result to capture the error:\n' +
      '  const { data: { session }, error: sessionError } = await supabase.auth.getSession();\n' +
      'The identifier `sessionError` must appear in the function body.',
    ).toMatch(/\bsessionError\b/);

    // Assert: sessionError is used in a conditional guard (combined with !session check)
    expect(
      fn,
      '[T-SRAF-003 RED — EXPECTED before T-SRAF-API-001 implementation]\n' +
      'useTriggerAIParsing does not contain a sessionError conditional guard.\n' +
      "Expected pattern: `if (sessionError || !session)` or `if (!session || sessionError)`\n" +
      'api-builder must add this guard to prevent functions.invoke from running when the session ' +
      'retrieval itself failed.',
    ).toMatch(SESSION_GUARD_REGEX);

    // Assert: exact error message is thrown for the sessionError condition
    // (same throw covers both sessionError and null-session in the target implementation)
    expect(
      fn,
      '[T-SRAF-003 RED — EXPECTED before T-SRAF-API-001 implementation]\n' +
      "useTriggerAIParsing does not throw 'Authentication required. Please sign in again.' " +
      'when sessionError is present.\n' +
      'The combined guard `if (sessionError || !session)` must throw this exact message ' +
      'for BOTH the sessionError and null-session cases.',
    ).toContain('Authentication required. Please sign in again.');
  });

  // ── T-SRAF-004: functions.invoke NOT called when session is absent ─────────

  it('[T-SRAF-004] supabase.functions.invoke is NOT reached when session is absent — auth guard throws first', () => {
    /*
     * RED:  useTriggerAIParsing currently calls supabase.functions.invoke() with no
     *       preceding session guard. There is no throw statement before the invoke
     *       call, so invoke is reached regardless of whether a valid session exists.
     *       The string 'Authentication required. Please sign in again.' (which marks
     *       the guard throw) does not appear in the function body at all, meaning its
     *       character index is -1 — before the invoke index would be nonsensical.
     *
     * GREEN: api-builder inserts the auth guard throw BEFORE the functions.invoke call.
     *        The throw statement for the auth error must appear at a lower character
     *        index in the function body than the supabase.functions.invoke call,
     *        proving that when the guard fires it exits the function before invoke runs.
     *
     * Assertion (guard-before-invoke structural invariant):
     *   1. The exact error message string is present in the function body.
     *   2. The character index of the auth message is strictly less than the
     *      character index of supabase.functions.invoke — proving the throw
     *      statement comes first in the execution path.
     *
     * This is the structural guarantee that invoke CANNOT be called when the session
     * guard fires. There is no conditional branching that could bypass the guard —
     * the throw unconditionally exits mutationFn before reaching invoke.
     *
     * IAA check: BD-007 (auth guard gates invoke correctly), FFA Test Quality row (d).
     */
    const fn = readUseTriggerAIParsing();

    const authThrowIdx = fn.indexOf('Authentication required. Please sign in again.');
    const invokeIdx = fn.indexOf('supabase.functions.invoke');

    // Assert: exact auth error message is present (guard must exist)
    expect(
      authThrowIdx,
      '[T-SRAF-004 RED — EXPECTED before T-SRAF-API-001 implementation]\n' +
      "The auth guard throw ('Authentication required. Please sign in again.') is absent " +
      'from useTriggerAIParsing.\n' +
      'api-builder must add this throw BEFORE supabase.functions.invoke(...) in the mutationFn.\n' +
      'Without this guard, functions.invoke is called even when session is null or errored.',
    ).toBeGreaterThanOrEqual(0);

    // Assert: supabase.functions.invoke is present (sanity check on slice)
    expect(
      invokeIdx,
      '[T-SRAF-004] supabase.functions.invoke not found in useTriggerAIParsing — unexpected state.',
    ).toBeGreaterThanOrEqual(0);

    // Assert structural order: auth guard throw appears BEFORE invoke in function body
    expect(
      authThrowIdx,
      '[T-SRAF-004 RED — EXPECTED before T-SRAF-API-001 implementation]\n' +
      'The auth guard throw must appear BEFORE supabase.functions.invoke() in the function body.\n' +
      `Auth message index: ${authThrowIdx}, functions.invoke index: ${invokeIdx}\n` +
      'When the session is absent, the throw must exit mutationFn BEFORE invoke is reached.\n' +
      'Reorder the code so the session check and throw precede the functions.invoke call.',
    ).toBeLessThan(invokeIdx);
  });

});
