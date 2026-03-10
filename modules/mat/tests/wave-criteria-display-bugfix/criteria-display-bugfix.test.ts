/**
 * Bug Fix: Criteria Not Displayed After Parsing — Column Mapping Mismatch
 * Issue: #1049
 *
 * Root Cause: normaliseMpsNumber in invoke-ai-parse-criteria/index.ts used
 *   String(Number(v)) which returns "NaN" for strings like "MPS 6", causing
 *   all criteria with AI-generated MPS numbers in "MPS N" format to be silently
 *   filtered out by validCriteriaList.filter() and never inserted into the DB.
 *
 * Fix: normaliseMpsNumber now strips any leading alphabetic prefix before the
 *   numeric conversion, so "MPS 6" → "6", "MPS 6.0" → "6", etc.
 *
 * Test IDs: T-WCDB-001 to T-WCDB-005
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

function readEdgeFn(): string {
  expect(fs.existsSync(EDGE_FN_PATH), `Edge Function not found: ${EDGE_FN_PATH}`).toBe(true);
  return fs.readFileSync(EDGE_FN_PATH, 'utf-8');
}

describe('Bug Fix #1049 — normaliseMpsNumber handles "MPS N" prefix format', () => {

  it('[T-WCDB-001] normaliseMpsNumber strips leading alphabetic prefix before numeric conversion', () => {
    // BEFORE FIX: String(Number("MPS 6")) === "NaN" — criteria silently dropped.
    // AFTER FIX:  normaliseMpsNumber strips the "MPS " prefix before numeric conversion.
    // The implementation must use .replace() with a regex to strip the alphabetic prefix.
    const src = readEdgeFn();
    expect(
      src,
      '[T-WCDB-001] normaliseMpsNumber must strip leading alphabetic prefix.\n' +
      'The original implementation String(Number(v)) returns "NaN" for "MPS 6".\n' +
      'Fix: use .replace() to strip non-numeric prefix before calling Number().',
    ).toMatch(/const normaliseMpsNumber[\s\S]{0,300}\.replace\s*\(/);
  });

  it('[T-WCDB-002] normaliseMpsNumber does NOT use bare String(Number(v)) pattern', () => {
    /*
     * The bare String(Number(v)) pattern is the root cause of the bug.
     * It must NOT appear as the sole implementation body of normaliseMpsNumber.
     * (The stripped version can still call Number() and String() internally,
     * but only after stripping the prefix.)
     */
    const src = readEdgeFn();
    // Extract just the normaliseMpsNumber function body
    const match = src.match(/const normaliseMpsNumber\s*=\s*\(v:[^)]+\)[^=]*=>[^;]+;/s);
    if (match) {
      const fnBody = match[0];
      expect(
        fnBody,
        '[T-WCDB-002] normaliseMpsNumber must not be the bare one-liner String(Number(v)).\n' +
        'The bug is that String(Number("MPS 6")) === "NaN". The fix strips the prefix first.',
      ).not.toMatch(/^const normaliseMpsNumber\s*=\s*\(v:[^)]+\)\s*:\s*string\s*=>\s*String\(Number\(v\)\)\s*;$/);
    }
  });

  it('[T-WCDB-003] normaliseMpsNumber implementation uses isNaN guard for non-numeric fallback', () => {
    /*
     * The fixed implementation must include an isNaN guard so that if the
     * stripped value is still non-numeric, the original trimmed string is
     * returned rather than "NaN" (fail-safe behaviour).
     */
    const src = readEdgeFn();
    expect(
      src,
      '[T-WCDB-003] normaliseMpsNumber must include an isNaN guard for safety.\n' +
      'Without isNaN, non-numeric values would still produce "NaN" after stripping.\n' +
      'Example: return isNaN(num) ? v.trim() : String(num);',
    ).toMatch(/isNaN/);
  });

  it('[T-WCDB-004] resolveMpsKey uses normaliseMpsNumber for fallback matching', () => {
    /*
     * resolveMpsKey is the function that resolves a criterion's mps_number to
     * the actual key in mpsMap. It must use normaliseMpsNumber for fallback
     * matching so that "MPS 6" can be matched against the map key "6".
     */
    const src = readEdgeFn();
    expect(
      src,
      '[T-WCDB-004] resolveMpsKey must call normaliseMpsNumber for fallback matching.',
    ).toMatch(/resolveMpsKey[\s\S]{0,300}normaliseMpsNumber/);
  });

  it('[T-WCDB-005] validCriteriaList is filtered using resolveMpsKey', () => {
    /*
     * validCriteriaList must use resolveMpsKey (which uses the fixed
     * normaliseMpsNumber) to filter criteria. This ensures that criteria
     * with "MPS N" format MPS numbers are not silently dropped.
     */
    const src = readEdgeFn();
    expect(
      src,
      '[T-WCDB-005] validCriteriaList must filter using resolveMpsKey.',
    ).toMatch(/validCriteriaList[\s\S]{0,100}resolveMpsKey/);
  });

});
