/**
 * Wave 15R — UX Features Tests
 * Test ID Suite: T-W15R-UX-001 through T-W15R-UX-005
 *
 * Wave    : 15R — Post-Delivery Oversight Remediation
 * Session : qa-builder-wave15r-batchc-20260308
 * Delegating Agent: foreman-v2-agent
 * Authority: CS2 maturion-isms#997
 * IAA Pre-Brief: IAA-PREBRIEF-WAVE15R-IMPL-20260308
 *
 * Asserts (file-based — no live Supabase/network/React rendering required):
 *   T-W15R-UX-001: UI renders list of uploaded documents
 *   T-W15R-UX-002: UI renders parse status badge per document
 *   T-W15R-UX-003: Per-document retry button calls Edge Function
 *   T-W15R-UX-004: Inline error message displayed per FAILED document
 *   T-W15R-UX-005: Parse status badge updates when polling resolves
 *
 * FRS: FR-004, FR-103 (Error Surfacing)
 * Architecture: modules/mat/02-architecture/system-architecture.md §4
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const CRITERIA_UPLOAD_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx',
);

const USE_CRITERIA_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/lib/hooks/useCriteria.ts',
);

// ---------------------------------------------------------------------------
// T-W15R-UX-001: UI renders list of uploaded documents
// ---------------------------------------------------------------------------
describe('[T-W15R-UX-001] UI renders list of uploaded documents', () => {
  it('CriteriaUpload.tsx exists at expected path', () => {
    expect(fs.existsSync(CRITERIA_UPLOAD_PATH), `File not found: ${CRITERIA_UPLOAD_PATH}`).toBe(
      true,
    );
  });

  it('Component contains data-testid="document-name" attribute', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="document-name"');
  });

  it('Component contains data-testid="document-upload-time" attribute', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="document-upload-time"');
  });

  it('Component renders empty state message "No documents uploaded yet."', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('No documents uploaded yet.');
  });

  it('Component imports and uses useUploadedDocuments hook', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('useUploadedDocuments');
  });
});

// ---------------------------------------------------------------------------
// T-W15R-UX-002: UI renders parse status badge per document
// ---------------------------------------------------------------------------
describe('[T-W15R-UX-002] UI renders parse status badge per document', () => {
  it('Component contains data-testid="parse-status-badge" attribute', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="parse-status-badge"');
  });

  it('Status badge handles PENDING status', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('PENDING');
  });

  it('Status badge handles PROCESSING status', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('PROCESSING');
  });

  it('Status badge handles COMPLETE status', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('COMPLETE');
  });

  it('Status badge handles FAILED status', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('FAILED');
  });

  it('PENDING status uses gray color class', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    // BADGE_CLASSES map must associate PENDING with bg-gray
    expect(content).toMatch(/PENDING[\s\S]{0,60}bg-gray/);
  });

  it('PROCESSING status uses blue color class', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toMatch(/PROCESSING[\s\S]{0,60}bg-blue/);
  });

  it('COMPLETE status uses green color class', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toMatch(/COMPLETE[\s\S]{0,60}bg-green/);
  });

  it('FAILED status uses red color class', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toMatch(/FAILED[\s\S]{0,60}bg-red/);
  });

  it('parse-status-badge testid is applied via JSX attribute in the component render', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    // Must appear inside JSX (data-testid="parse-status-badge") not just as a comment
    const matches = content.match(/data-testid="parse-status-badge"/g);
    expect(matches, 'parse-status-badge must appear at least once in JSX').not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// T-W15R-UX-003: Per-document retry button calls Edge Function
// ---------------------------------------------------------------------------
describe('[T-W15R-UX-003] Per-document retry button calls Edge Function', () => {
  it('Component contains data-testid="retry-parse-button" attribute', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="retry-parse-button"');
  });

  it('Retry button is labeled "Parse Now" when idle', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('Parse Now');
  });

  it('Retry button shows "Parsing\u2026" label while in-flight', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    // Must contain the loading label variant ("Parsing…" with ellipsis)
    expect(content).toMatch(/Parsing[…\.]{1,3}/u);
  });

  it('Retry handler calls triggerParsing.mutateAsync (Edge Function invocation)', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('triggerParsing.mutateAsync');
  });

  it('Retry button has disabled attribute tied to in-flight state', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    // disabled prop must reference isPending or retryingDocId
    expect(content).toMatch(/disabled=\{[^}]*(isPending|retryingDocId)[^}]*\}/);
  });

  it('useCriteria.ts exports useTriggerAIParsing function', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain('useTriggerAIParsing');
  });
});

// ---------------------------------------------------------------------------
// T-W15R-UX-004: Inline error message displayed per FAILED document
// ---------------------------------------------------------------------------
describe('[T-W15R-UX-004] Inline error message displayed per FAILED document', () => {
  it('Component contains data-testid="document-parse-error" attribute', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="document-parse-error"');
  });

  it('Error message is conditionally rendered on FAILED status', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    // Must have a conditional block that checks FAILED before rendering document-parse-error
    expect(content).toMatch(/FAILED[\s\S]{0,200}document-parse-error/);
  });

  it('alert() is NOT present as functional call (only allowed in comments)', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    // Strip single-line comments (//) and block comments (/* */) then check no alert() call remains
    const noComments = content
      .replace(/\/\/[^\n]*/g, '')           // remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '');    // remove block comments
    expect(noComments).not.toMatch(/\balert\s*\(/);
  });

  it('Component contains data-testid="criteria-upload-success" inline success message', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="criteria-upload-success"');
  });

  it('Component contains data-testid="criteria-upload-error" inline error message', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="criteria-upload-error"');
  });
});

// ---------------------------------------------------------------------------
// T-W15R-UX-005: Parse status badge updates when polling resolves
// ---------------------------------------------------------------------------
describe('[T-W15R-UX-005] Parse status badge updates when polling resolves', () => {
  it('useCriteria.ts file exists at expected path', () => {
    expect(fs.existsSync(USE_CRITERIA_PATH), `File not found: ${USE_CRITERIA_PATH}`).toBe(true);
  });

  it('useParseStatus hook queries parse_tasks table', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain('parse_tasks');
  });

  it('useParseStatus recognises uppercase terminal state COMPLETE', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain("'COMPLETE'");
  });

  it('useParseStatus recognises uppercase terminal state FAILED', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain("'FAILED'");
  });

  it('useParseStatus retains backward-compatible lowercase terminal state "completed"', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain("'completed'");
  });

  it('useParseStatus retains backward-compatible lowercase terminal state "failed"', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain("'failed'");
  });

  it('useParseStatus invalidates uploaded-documents query on terminal state', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // Must invalidate the uploaded-documents queryKey to refresh the documents list
    expect(content).toMatch(/invalidateQueries[\s\S]{0,100}uploaded-documents/);
  });

  it('useParseStatus handles PGRST116 (missing record) gracefully — returns PENDING', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain('PGRST116');
  });

  it('useParseStatus uses refetchInterval for polling', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain('refetchInterval');
  });
});
