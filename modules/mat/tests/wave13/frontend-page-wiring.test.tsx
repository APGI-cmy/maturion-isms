/**
 * Wave 13 — Frontend Page Wiring Tests (T-W13-WIRE-1 to T-W13-WIRE-8)
 *
 * Test IDs : T-W13-WIRE-1 through T-W13-WIRE-8
 * Task     : Wave 13 — Red QA Gate for the MAT module
 * Builder  : ui-builder
 * Wave     : 13 — Live Deployment Wiring Regression
 * Branch   : copilot/fix-live-deployment-wiring-regression
 *
 * RED gate : These tests MUST FAIL until ui-builder wires frontend pages to live context.
 *
 * RCA Reference: MAT-RCA-002
 *   F-03 through F-12: All blank/placeholder page failures
 *
 * Strategy : Source-level assertions verify that correctly-named, live-wired React
 *            components exist at canonical paths and expose required data-testid
 *            attributes in their JSX source. This mirrors the Wave 12 pattern
 *            (readFileSync / existsSync) to remain runnable without a JSX transform.
 *
 * POLC Note: Committed as FAILING (RED) per Wave 13 QA gate mandate.
 *            Do NOT modify these tests to pass — implement the fix instead.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const PAGES_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src/pages');
const COMPONENTS_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src/components');

/**
 * Helper: read a source file and return its contents.
 * Fails the test with a clear message if the file doesn't exist.
 */
function readSource(filePath: string, label: string): string {
  expect(
    fs.existsSync(filePath),
    `${label} not found at ${filePath} — ui-builder must create it`
  ).toBe(true);
  return fs.readFileSync(filePath, 'utf-8');
}

describe('T-W13-WIRE: Frontend Page Wiring', () => {
  it('T-W13-WIRE-1: AuditManagement component exists and renders audit-list testid', () => {
    // RED: fails until ui-builder creates AuditManagement.tsx (NOT AuditManagementPage.tsx)
    // wired to live Supabase context and exposes data-testid="audit-list"
    //
    // Currently the canonical component is named AuditManagementPage.tsx and does not
    // have a data-testid="audit-list" attribute on the list container.
    const filePath = path.join(PAGES_DIR, 'AuditManagement.tsx');

    // RED: file doesn't exist at this canonical path
    const source = readSource(filePath, 'AuditManagement.tsx');

    // RED: data-testid not present
    expect(
      source,
      'AuditManagement must include data-testid="audit-list" on the list container'
    ).toContain('data-testid="audit-list"');

    // RED: must use live Supabase query, not static/placeholder data
    expect(
      source,
      'AuditManagement must call supabase or useQuery to fetch live audit data'
    ).toMatch(/useQuery|supabase\.from\(['"]audits['"]\)|from\(['"]audits['"]\)/);
  });

  it('T-W13-WIRE-2: CriteriaManagement component exists and renders criteria-upload-pane testid', () => {
    // RED: fails until ui-builder creates CriteriaManagement.tsx wired to live context.
    // Currently shows "Create an audit first to upload criteria" placeholder — must
    // show the upload pane when an auditId is provided.
    const filePath = path.join(PAGES_DIR, 'CriteriaManagement.tsx');
    const source = readSource(filePath, 'CriteriaManagement.tsx');

    // RED: data-testid not present
    expect(
      source,
      'CriteriaManagement must include data-testid="criteria-upload-pane"'
    ).toContain('data-testid="criteria-upload-pane"');

    // RED: placeholder text must be removed (replaced with real UI)
    expect(
      source,
      'CriteriaManagement must NOT show "Create an audit first to upload criteria" placeholder'
    ).not.toContain('Create an audit first to upload criteria');
  });

  it('T-W13-WIRE-3: EvidenceCollection component exists and renders evidence-collection-form testid', () => {
    // RED: fails until ui-builder creates EvidenceCollection.tsx.
    // Currently page shows a "placeholder" text instead of the evidence form.
    const filePath = path.join(PAGES_DIR, 'EvidenceCollection.tsx');
    const source = readSource(filePath, 'EvidenceCollection.tsx');

    // RED: data-testid not present
    expect(
      source,
      'EvidenceCollection must include data-testid="evidence-collection-form"'
    ).toContain('data-testid="evidence-collection-form"');

    // RED: placeholder text must not be present
    expect(
      source,
      'EvidenceCollection must NOT contain raw "placeholder" text in rendered output'
    ).not.toMatch(/>\s*placeholder\s*</i);
  });

  it('T-W13-WIRE-4: Scoring component exists and renders scoring-content testid', () => {
    // RED: fails until ui-builder creates Scoring.tsx with live scoring content.
    // Currently the scoring page renders blank — no data-testid exposed.
    const filePath = path.join(PAGES_DIR, 'Scoring.tsx');
    const source = readSource(filePath, 'Scoring.tsx');

    // RED: data-testid not present
    expect(
      source,
      'Scoring must include data-testid="scoring-content"'
    ).toContain('data-testid="scoring-content"');
  });

  it('T-W13-WIRE-5: Reports component exists and renders reports-content testid', () => {
    // RED: fails until ui-builder creates Reports.tsx with live report content.
    const filePath = path.join(PAGES_DIR, 'Reports.tsx');
    const source = readSource(filePath, 'Reports.tsx');

    // RED: data-testid not present
    expect(
      source,
      'Reports must include data-testid="reports-content"'
    ).toContain('data-testid="reports-content"');
  });

  it('T-W13-WIRE-6: Dashboard component exists and renders dashboard-content testid', () => {
    // RED: fails until ui-builder creates Dashboard.tsx with live dashboard content.
    const filePath = path.join(PAGES_DIR, 'Dashboard.tsx');
    const source = readSource(filePath, 'Dashboard.tsx');

    // RED: data-testid not present
    expect(
      source,
      'Dashboard must include data-testid="dashboard-content"'
    ).toContain('data-testid="dashboard-content"');
  });

  it('T-W13-WIRE-7: Settings component exists and exposes language and theme dropdown testids', () => {
    // RED: fails until ui-builder creates Settings.tsx with persisted dropdowns.
    // Language and theme dropdowns must maintain state across re-renders.
    const filePath = path.join(PAGES_DIR, 'Settings.tsx');
    const source = readSource(filePath, 'Settings.tsx');

    // RED: language dropdown testid not present
    expect(
      source,
      'Settings must include data-testid="settings-language-dropdown"'
    ).toContain('data-testid="settings-language-dropdown"');

    // RED: theme dropdown testid not present
    expect(
      source,
      'Settings must include data-testid="settings-theme-dropdown"'
    ).toContain('data-testid="settings-theme-dropdown"');

    // RED: dropdown state must be persisted (localStorage or profile)
    expect(
      source,
      'Settings dropdowns must use localStorage or profile storage to persist state'
    ).toMatch(/localStorage|useProfile|updateProfile/);
  });

  it('T-W13-WIRE-8: AIChatModal component exists and does not render no-access overlay for authenticated users', () => {
    // RED: fails until ui-builder creates AIChatModal.tsx that conditionally hides the
    // "no access" overlay when user is authenticated. Currently the overlay is always shown.
    const filePath = path.join(COMPONENTS_DIR, 'AIChatModal.tsx');
    const source = readSource(filePath, 'AIChatModal.tsx');

    // RED: ai-chat-input testid not present
    expect(
      source,
      'AIChatModal must include data-testid="ai-chat-input" for authenticated users'
    ).toContain('data-testid="ai-chat-input"');

    // RED: no-access overlay is always rendered (must be conditional)
    // The overlay must only render when !isAuthenticated, not unconditionally
    const noAccessPattern = /ai-chat-no-access-overlay/;
    if (noAccessPattern.test(source)) {
      // If the overlay element exists, it must be conditional (inside an if/ternary)
      expect(
        source,
        'ai-chat-no-access-overlay must be conditionally rendered (not always shown)'
      ).toMatch(/(!isAuthenticated|!session|!user)[\s\S]{0,200}ai-chat-no-access-overlay/);
    }
    // If the overlay doesn't exist at all, the test verifies the input IS present
    // (already checked above) — that is sufficient.
  });
});
