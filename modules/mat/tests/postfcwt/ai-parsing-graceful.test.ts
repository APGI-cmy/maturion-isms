/**
 * Post-FCWT RED Gate — AI Parsing Graceful Degradation Tests
 * Incident: INC-POST-FCWT-EDGE-FN-001
 *
 * RCA: useTriggerAIParsing() calls supabase.functions.invoke('invoke-ai-parse-criteria').
 *      The Edge Function did not exist at deployment. When the parsing call threw, it
 *      propagated to the upload catch block and the entire upload was surfaced as failed.
 *      Upload to storage succeeded; only the AI parsing trigger step failed.
 *
 * Immediate mitigation: CriteriaUpload.tsx wraps triggerParsing.mutateAsync in its own
 *      try/catch so parsing failure never fails the upload success path. A warning element
 *      is rendered (not a hard error) when parsing fails.
 *
 * All tests are file-based (no live Supabase env required).
 * Tests T-PFCWT-004 to T-PFCWT-005 go GREEN once CriteriaUpload.tsx is updated.
 *
 * Wave 17 architecture update (2026-03-12): CriteriaUpload.tsx was refactored in Wave 17
 *      to use a ParsingInstructionsModal flow. Parsing is now triggered from
 *      handleParsingConfirm / handleParsingCancel (each with their own try/catch),
 *      replacing the inline inner try/catch in the upload handler. The `parsingSucceeded`
 *      flag and alert() call were removed — success is now indicated via setUploadSuccess()
 *      inside the try block, and failure via setAiParsingWarning() in the catch block.
 *      T-PFCWT-006 assertions updated to reflect this Wave 17 pattern. Intent preserved.
 *
 * Authority: CS2 (Johan Ras / @APGI-cmy) | Date: 2026-03-06 | Updated: 2026-03-12
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const FRONTEND_SRC = path.resolve(process.cwd(), 'modules/mat/frontend/src');
const CRITERIA_UPLOAD_PATH = path.join(FRONTEND_SRC, 'components/criteria/CriteriaUpload.tsx');

describe('Post-FCWT — AI Parsing Graceful Degradation (INC-POST-FCWT-EDGE-FN-001)', () => {

  it('T-PFCWT-004: CriteriaUpload.tsx wraps triggerParsing.mutateAsync in its own try/catch so parsing failure does not propagate to the upload error path', () => {
    const src = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');

    // The upload result assignment and the parsing trigger must be in separate try/catch scopes:
    // the outer try must contain the upload (mutateAsync for uploadCriteria),
    // and an inner try must separately wrap the parsing call so its failure is isolated.
    expect(
      src,
      'CriteriaUpload.tsx must wrap triggerParsing.mutateAsync in a separate inner try/catch — ' +
      'parsing failure must NOT reach the outer catch that alerts "Upload failed:"'
    ).toMatch(/try\s*\{[\s\S]*?triggerParsing\.mutateAsync[\s\S]*?\}\s*catch/);

    // Confirm the outer catch block only handles upload failures — not parsing failures
    // The parsing call must be in its own nested try/catch block
    const innerTryCatchPattern = /try\s*\{[\s\S]*?triggerParsing\.mutateAsync[\s\S]*?\}\s*catch\s*\(\s*\w+\s*\)\s*\{[\s\S]*?console\.warn/;
    expect(
      src,
      'CriteriaUpload.tsx must log a console.warn (not throw) when parsing fails — ' +
      'the inner catch for triggerParsing must call console.warn, not rethrow or alert "Upload failed"'
    ).toMatch(innerTryCatchPattern);
  });

  it('T-PFCWT-005: CriteriaUpload.tsx renders a warning element (not an error) when AI parsing fails', () => {
    const src = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');

    // Assert: warning element with data-testid is present in the JSX
    expect(
      src,
      'CriteriaUpload.tsx must render an element with data-testid="criteria-upload-ai-parsing-warning" when AI parsing fails — ' +
      'this must be a warning (role="alert" or similar) rendered conditionally, not a thrown error'
    ).toContain('data-testid="criteria-upload-ai-parsing-warning"');

    // Assert: the warning element is conditional (not always shown)
    expect(
      src,
      'The criteria-upload-ai-parsing-warning element must be conditionally rendered based on parsing failure state'
    ).toMatch(/aiParsingWarning[\s\S]*?criteria-upload-ai-parsing-warning/);
  });

  it('T-PFCWT-006: CriteriaUpload.tsx sets upload success state only when AI parsing succeeds (not when parsing fails)', () => {
    const src = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');

    // Wave 17 replaces the `parsingSucceeded` flag and `alert()` with state-based feedback.
    // Assert: setUploadSuccess is called only inside the try block that wraps
    // triggerParsing.mutateAsync — it must NOT be called unconditionally after parsing.
    expect(
      src,
      'CriteriaUpload.tsx must call setUploadSuccess only in the try block that wraps ' +
      'triggerParsing.mutateAsync — success state must NOT be set when parsing fails'
    ).toMatch(/try\s*\{[\s\S]*?triggerParsing\.mutateAsync[\s\S]*?setUploadSuccess[\s\S]*?\}\s*catch/);

    // Assert: setAiParsingWarning is called in the catch block (failure path),
    // not setUploadSuccess — the two state updates must be in separate code paths.
    expect(
      src,
      'CriteriaUpload.tsx must call setAiParsingWarning in the catch block when parsing fails — ' +
      'the failure path must set a warning, not an upload success state'
    ).toMatch(/catch\s*\(\s*\w+\s*\)\s*\{[\s\S]*?setAiParsingWarning/);
  });

});
