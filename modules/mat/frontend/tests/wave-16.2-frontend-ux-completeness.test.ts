/**
 * Wave 16.2 — Frontend UX Completeness RED QA Suite
 *
 * QA-to-Red: ALL tests in this file MUST fail until Wave 16.2 implementation
 * addresses the six UX completeness gaps identified in implementation-plan.md.
 *
 * Gaps addressed:
 *   GAP-006 — `gap_analysis` JSONB in DB never displayed in any UI
 *   GAP-007 — /reports page is a stub; no listing of previously generated reports
 *   GAP-008 — 29 `alert()` calls across 8 files create poor UX (no toast system)
 *   GAP-009 — CriteriaModal shows no next_level_guidance (criterion detail not wired)
 *   GAP-014 — Interview recording playback not implemented (audio saved, no player)
 *   GAP-015 — No global audit selection context; each page manages its own auditId
 *   GAP-020 — Score gap_analysis JSONB never displayed
 *   GAP-024 — No unsaved-changes warnings or confirmation dialogs
 *   GAP-025 — useAuditMetrics polling (30 s) has no stop condition
 *
 * Acceptance Criteria (from implementation-plan.md Wave 16.2):
 *   AC-1  A dedicated Feedback/Recommendations page renders scores.gap_analysis
 *         (immediate/medium/long_term arrays) and criteria_evaluations.next_level_guidance
 *         for the active audit; the /reports page lists audit_reports rows with signed
 *         URL download buttons.
 *   AC-2  All 29 window.alert() / alert() calls across the frontend are replaced with a
 *         react-hot-toast (or equivalent) toast notification; the global Toaster is mounted
 *         in App.tsx or layout; destructive actions display a confirmation dialog before
 *         proceeding.
 *
 * Test IDs: T-W16.2-UI-001 … T-W16.2-UI-006
 *
 * Architecture: architecture/implementation-plan.md Wave 16.2
 * FRS: GAP-006, GAP-007, GAP-008, GAP-009, GAP-014, GAP-015, GAP-020, GAP-024, GAP-025
 * Session: qa-builder wave16.2 RED suite
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Shared path resolution helpers
// ---------------------------------------------------------------------------

/**
 * The test file lives at modules/mat/frontend/tests/
 * Navigate up one level to modules/mat/frontend/
 */
const FRONTEND_ROOT = path.resolve(__dirname, '..');
const SRC = path.join(FRONTEND_ROOT, 'src');
const PAGES = path.join(SRC, 'pages');
const HOOKS = path.join(SRC, 'lib', 'hooks');
const COMPONENTS = path.join(SRC, 'components');

// ---------------------------------------------------------------------------
// Utility: recursively collect all .ts / .tsx files under a directory
// ---------------------------------------------------------------------------

function collectSourceFiles(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(full, files);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// T-W16.2-UI-001 — /reports page must NOT be a stub
//   GAP-007: reports page currently renders a static placeholder with no
//   data fetching, no list of audit_reports, and no download buttons.
//   RED until ReportsPage is replaced with a real implementation.
// ---------------------------------------------------------------------------

describe('T-W16.2-UI-001: /reports page is not a stub placeholder', () => {
  it('ReportsPage.tsx exists', () => {
    const reportPageFile = path.join(PAGES, 'ReportsPage.tsx');
    // Precondition — file must exist (it does today as a stub)
    expect(
      fs.existsSync(reportPageFile),
      `Expected ReportsPage.tsx to exist at:\n  ${reportPageFile}`,
    ).toBe(true);
  });

  it('ReportsPage.tsx contains a data list of audit_reports rows, not just a static placeholder', () => {
    // RED: Current ReportsPage.tsx renders only a static paragraph:
    //   "Generate and download audit reports."
    //   with no data fetching, no table/list, no download links.
    // GREEN: The component must reference audit_reports data (via hook, query, or
    //   table/list rendering) — not just a static description string.
    const reportPageFile = path.join(PAGES, 'ReportsPage.tsx');
    if (!fs.existsSync(reportPageFile)) {
      throw new Error(`ReportsPage.tsx not found: ${reportPageFile}`);
    }
    const content = fs.readFileSync(reportPageFile, 'utf-8');

    // The real implementation must contain at least one of these indicators:
    //  • a hook call referencing reports data
    //  • a reference to audit_reports table/type
    //  • a signed URL download pattern
    //  • a list/table of reports
    const hasDataFetching =
      /useAuditReports|useReports|audit_reports|signedUrl|signed_url|downloadUrl|download_url/.test(content);

    expect(
      hasDataFetching,
      'Expected ReportsPage.tsx to contain real data-fetching logic referencing ' +
        '"audit_reports", a download URL, or a reports hook — not a static placeholder.\n\n' +
        'Current ReportsPage.tsx content:\n\n' +
        content +
        '\n\nGAP-007: Replace the stub with a real implementation that lists ' +
        'audit_reports rows with signed URL download buttons.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.2-UI-002 — reports page must import/use a useAuditReports hook or equivalent
//   GAP-007: No hook for fetching the audit_reports table exists yet.
//   RED until a dedicated reports hook is created AND wired into the page.
// ---------------------------------------------------------------------------

describe('T-W16.2-UI-002: reports page references a useAuditReports hook or equivalent', () => {
  it('a hook for fetching audit reports exists', () => {
    // RED: No useAuditReports (or equivalent) hook file currently exists.
    // GREEN: A file named useAuditReports.ts (or useReports.ts) must be present.
    const candidates = [
      path.join(HOOKS, 'useAuditReports.ts'),
      path.join(HOOKS, 'useReports.ts'),
      path.join(SRC, 'hooks', 'useAuditReports.ts'),
      path.join(SRC, 'hooks', 'useReports.ts'),
    ];
    const hookExists = candidates.some((f) => fs.existsSync(f));

    expect(
      hookExists,
      'Expected a hook file for fetching audit reports to exist at one of:\n' +
        candidates.map((c) => `  ${c}`).join('\n') +
        '\n\nGAP-007: Create a useAuditReports hook that queries the audit_reports ' +
        'table and returns rows with their signed download URLs.',
    ).toBe(true);
  });

  it('ReportsPage.tsx imports a useAuditReports or useReports hook', () => {
    // RED: Current ReportsPage.tsx has zero imports — it is a plain stub.
    // GREEN: The component must import (and use) a hook for report data.
    const reportPageFile = path.join(PAGES, 'ReportsPage.tsx');
    if (!fs.existsSync(reportPageFile)) {
      throw new Error(`ReportsPage.tsx not found: ${reportPageFile}`);
    }
    const content = fs.readFileSync(reportPageFile, 'utf-8');

    const importsHook =
      /import\s+[^'"]*useAuditReports|import\s+[^'"]*useReports/.test(content);

    expect(
      importsHook,
      'Expected ReportsPage.tsx to import a useAuditReports or useReports hook.\n\n' +
        'Current ReportsPage.tsx imports:\n\n' +
        content.split('\n').filter((l) => l.startsWith('import')).join('\n') +
        '\n\nGAP-007: Wire ReportsPage to a real reports hook.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.2-UI-003 — zero alert() calls remaining in frontend src/
//   GAP-008: 29 bare alert() calls exist across 8 source files:
//     EvidenceCollection.tsx (12), SettingsPage.tsx (5), ReviewTable.tsx (5),
//     CriteriaModal.tsx (1), AuditCreationForm.tsx (2), AuditList.tsx (1),
//     ReportGenerator.tsx (2), InterviewRecorder.tsx (1).
//   RED until every alert() is replaced with a toast notification.
// ---------------------------------------------------------------------------

describe('T-W16.2-UI-003: zero bare alert() calls remain in frontend src/', () => {
  it('src/ contains 0 bare alert() calls (all replaced with toast notifications)', () => {
    // RED: 29 bare alert() calls currently exist.
    // GREEN: Count must be 0.
    //
    // Strategy: scan every .ts/.tsx file for lines that call alert() as a
    // statement (not as a variable name, import, or comment).
    // We match the pattern: optional whitespace + "alert(" on a line.
    // False-positive guard: skip lines that start with "//" (single-line comments).
    const allFiles = collectSourceFiles(SRC);
    const violations: { file: string; line: number; text: string }[] = [];

    const ALERT_CALL = /^\s*alert\s*\(/;

    for (const filePath of allFiles) {
      const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
      lines.forEach((lineText, idx) => {
        const trimmed = lineText.trimStart();
        // Skip single-line comments
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
        if (ALERT_CALL.test(lineText)) {
          violations.push({ file: filePath, line: idx + 1, text: lineText.trim() });
        }
      });
    }

    const violationReport = violations
      .map((v) => `  ${path.relative(SRC, v.file)}:${v.line}  ${v.text}`)
      .join('\n');

    expect(
      violations.length,
      `Expected 0 bare alert() calls in src/, found ${violations.length}:\n\n${violationReport}\n\n` +
        'GAP-008: Replace every alert() with a react-hot-toast (or equivalent) ' +
        'toast notification. Mount a global <Toaster /> in App.tsx.',
    ).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// T-W16.2-UI-004 — react-hot-toast (or equivalent) must be in package.json
//                   AND mounted in App.tsx / layout component
//   GAP-008: No toast library dependency exists; no <Toaster /> in App.tsx.
//   RED until react-hot-toast (or sonner / @radix-ui/react-toast) is added
//   and the global Toaster component is mounted.
// ---------------------------------------------------------------------------

describe('T-W16.2-UI-004: toast notification library installed and Toaster mounted in App', () => {
  it('package.json lists a toast notification library as a dependency', () => {
    // RED: Current package.json has no toast library.
    // GREEN: At least one of the accepted toast libraries must be present.
    const pkgFile = path.join(FRONTEND_ROOT, 'package.json');
    expect(
      fs.existsSync(pkgFile),
      `Expected package.json at:\n  ${pkgFile}`,
    ).toBe(true);

    const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    };

    // Accept any of the widely-used toast solutions
    const TOAST_LIBRARIES = [
      'react-hot-toast',
      'sonner',
      '@radix-ui/react-toast',
      'react-toastify',
    ];
    const hasToastLib = TOAST_LIBRARIES.some((lib) => lib in allDeps);

    expect(
      hasToastLib,
      'Expected package.json to list a toast notification library.\n' +
        'Accepted libraries: ' +
        TOAST_LIBRARIES.join(', ') +
        '\n\nCurrent dependencies:\n' +
        Object.keys(allDeps).join(', ') +
        '\n\nGAP-008: Add a toast library (e.g. react-hot-toast) to package.json ' +
        'and mount the global <Toaster /> in App.tsx.',
    ).toBe(true);
  });

  it('App.tsx mounts a global Toaster component', () => {
    // RED: Current App.tsx has no Toaster import or usage.
    // GREEN: App.tsx must contain a Toaster (or Toast provider) render.
    const appFile = path.join(SRC, 'App.tsx');
    if (!fs.existsSync(appFile)) {
      throw new Error(`App.tsx not found: ${appFile}`);
    }
    const content = fs.readFileSync(appFile, 'utf-8');

    // Match any of the common Toaster patterns
    const hasToaster =
      /Toaster|ToastContainer|ToastProvider/.test(content);

    expect(
      hasToaster,
      'Expected App.tsx to mount a global <Toaster /> (or <ToastContainer /> / ' +
        '<ToastProvider />) component.\n\n' +
        'Current App.tsx content (first 30 import lines):\n\n' +
        content.split('\n').filter((l) => l.startsWith('import')).join('\n') +
        '\n\nGAP-008: Mount the toast Toaster in App.tsx so all components can ' +
        'trigger notifications without alert().',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.2-UI-005 — useAuditMetrics must have a visibility / unmount stop condition
//   GAP-025: Current useAuditMetrics uses refetchInterval: 30000 with no stop
//   condition — it polls continuously even when the tab is hidden or the
//   component is unmounted.
//   RED until the hook adds document.visibilityState awareness or
//   refetchIntervalInBackground: false (or equivalent) to suppress polling
//   when the user is not viewing the page.
// ---------------------------------------------------------------------------

describe('T-W16.2-UI-005: useAuditMetrics has a polling stop condition when tab is hidden', () => {
  it('useAuditMetrics hook file exists', () => {
    const hookFile = path.join(HOOKS, 'useAuditMetrics.ts');
    expect(
      fs.existsSync(hookFile),
      `Expected useAuditMetrics.ts at:\n  ${hookFile}`,
    ).toBe(true);
  });

  it('useAuditMetrics stops polling when document is not visible (refetchIntervalInBackground or visibilityState check)', () => {
    // RED: Current implementation only has `refetchInterval: 30000` with no stop
    //      condition. The hook polls every 30 s even when the browser tab is hidden.
    // GREEN: One of the following patterns must be present:
    //   • refetchIntervalInBackground: false  (react-query built-in)
    //   • document.visibilityState check inside refetchInterval callback
    //   • useEffect with visibilitychange event listener and interval clearance
    //   • enabled: document.visibilityState === 'visible'  (or similar)
    const hookFile = path.join(HOOKS, 'useAuditMetrics.ts');
    if (!fs.existsSync(hookFile)) {
      throw new Error(`useAuditMetrics.ts not found: ${hookFile}`);
    }
    const content = fs.readFileSync(hookFile, 'utf-8');

    const hasStopCondition =
      /refetchIntervalInBackground/.test(content) ||
      /visibilityState/.test(content) ||
      /visibilitychange/.test(content) ||
      /document\.hidden/.test(content);

    expect(
      hasStopCondition,
      'Expected useAuditMetrics.ts to contain a polling stop condition when the ' +
        'browser tab is not visible.\n\n' +
        'Accepted patterns:\n' +
        '  • refetchIntervalInBackground: false\n' +
        '  • document.visibilityState check inside the refetchInterval callback\n' +
        '  • visibilitychange event listener that clears the poll interval\n' +
        '  • document.hidden guard\n\n' +
        'Current useAuditMetrics.ts content (relevant lines):\n\n' +
        content
          .split('\n')
          .filter((l) => /refetch|interval|visibility|hidden/i.test(l))
          .join('\n') +
        '\n\nGAP-025: Add `refetchIntervalInBackground: false` to the useQuery call ' +
        'so polling automatically pauses when the browser tab is hidden.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.2-UI-006 — FeedbackPage / RecommendationsPage must exist and display gap_analysis
//   GAP-006 + GAP-020: The gap_analysis JSONB column (scores table) is populated
//   by the scoring engine but never rendered in any UI component. There is also no
//   dedicated Feedback or Recommendations page.
//   RED until a FeedbackPage (or RecommendationsPage) component is created that
//   renders gap_analysis.immediate, gap_analysis.medium_term, gap_analysis.long_term.
// ---------------------------------------------------------------------------

describe('T-W16.2-UI-006: FeedbackPage/RecommendationsPage component exists and renders gap_analysis', () => {
  it('a FeedbackPage or RecommendationsPage component file exists', () => {
    // RED: No such page currently exists anywhere in the frontend.
    // GREEN: A file matching the Feedback/Recommendations pattern must exist.
    const FEEDBACK_PAGE_CANDIDATES = [
      path.join(PAGES, 'FeedbackPage.tsx'),
      path.join(PAGES, 'RecommendationsPage.tsx'),
      path.join(PAGES, 'feedback', 'index.tsx'),
      path.join(PAGES, 'recommendations', 'index.tsx'),
    ];

    const pageExists = FEEDBACK_PAGE_CANDIDATES.some((f) => fs.existsSync(f));

    expect(
      pageExists,
      'Expected a Feedback or Recommendations page file to exist at one of:\n' +
        FEEDBACK_PAGE_CANDIDATES.map((c) => `  ${c}`).join('\n') +
        '\n\nGAP-006 + GAP-020: Create a FeedbackPage (or RecommendationsPage) that ' +
        'renders the gap_analysis JSONB from the scores table.',
    ).toBe(true);
  });

  it('FeedbackPage / RecommendationsPage renders gap_analysis data', () => {
    // RED: The page does not exist, so it cannot reference gap_analysis.
    // GREEN: The page must reference gap_analysis (immediate/medium/long_term)
    //   and/or next_level_guidance from criteria_evaluations.
    const FEEDBACK_PAGE_CANDIDATES = [
      path.join(PAGES, 'FeedbackPage.tsx'),
      path.join(PAGES, 'RecommendationsPage.tsx'),
      path.join(PAGES, 'feedback', 'index.tsx'),
      path.join(PAGES, 'recommendations', 'index.tsx'),
    ];

    const existingPage = FEEDBACK_PAGE_CANDIDATES.find((f) => fs.existsSync(f));
    if (!existingPage) {
      throw new Error(
        'No FeedbackPage or RecommendationsPage found. Create one at: ' +
          FEEDBACK_PAGE_CANDIDATES[0],
      );
    }

    const content = fs.readFileSync(existingPage, 'utf-8');

    // Must reference gap_analysis fields or next_level_guidance
    const rendersGapAnalysis =
      /gap_analysis|gapAnalysis|next_level_guidance|nextLevelGuidance|immediate|long_term/.test(
        content,
      );

    expect(
      rendersGapAnalysis,
      'Expected FeedbackPage/RecommendationsPage to reference gap_analysis ' +
        '(or its fields: immediate, medium_term, long_term) and/or ' +
        'next_level_guidance from criteria_evaluations.\n\n' +
        `File: ${existingPage}\n\nContent:\n\n${content}\n\n` +
        'GAP-006 + GAP-020: Wire the page to the scores.gap_analysis JSONB and ' +
        'criteria_evaluations.next_level_guidance fields.',
    ).toBe(true);
  });

  it('App.tsx or router registers a route for the feedback/recommendations page', () => {
    // RED: No route exists for the feedback/recommendations page.
    // GREEN: App.tsx must define a route to /feedback or /recommendations
    //   (or equivalent path).
    const appFile = path.join(SRC, 'App.tsx');
    if (!fs.existsSync(appFile)) {
      throw new Error(`App.tsx not found: ${appFile}`);
    }
    const content = fs.readFileSync(appFile, 'utf-8');

    const hasRoute =
      /\/feedback|\/recommendations|FeedbackPage|RecommendationsPage/.test(content);

    expect(
      hasRoute,
      'Expected App.tsx to register a route for /feedback or /recommendations ' +
        '(or import FeedbackPage / RecommendationsPage).\n\n' +
        'Current routes in App.tsx:\n\n' +
        content
          .split('\n')
          .filter((l) => /Route|path=|import/.test(l))
          .join('\n') +
        '\n\nGAP-006 + GAP-020: Add a <Route path="/feedback" element={<FeedbackPage />} /> ' +
        'in App.tsx and import the new page component.',
    ).toBe(true);
  });
});
