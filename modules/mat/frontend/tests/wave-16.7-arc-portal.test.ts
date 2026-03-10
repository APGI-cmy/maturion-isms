/**
 * Wave 16.7 — ARC Portal Frontend RED QA Suite
 *
 * QA-to-Red: ALL tests in this file MUST fail until Wave 16.7 implementation
 * builds the ARC (Adaptive Review Committee) portal UI.
 *
 * Gap addressed:
 *   GAP-013 — No ARC portal frontend; feedback approval workflow endpoints exist
 *             (api/ai/feedback/approve.ts, api/ai/feedback/pending.ts) but there
 *             is no UI for ARC operators to review, approve, or reject pending
 *             feedback items.
 *
 * Acceptance Criteria (from implementation-plan.md Wave 16.7):
 *   AC-1  An ARC Review portal page is accessible to users with the ARC operator role;
 *         it lists all pending feedback items with criteria details, AI-generated
 *         recommendations, and approve/reject action buttons wired to the existing
 *         ARC API endpoints (GET /api/ai/feedback/pending,
 *         POST /api/ai/feedback/approve).
 *   AC-2  Approved feedback is reflected in the audit's criteria evaluation status;
 *         rejected feedback returns to the submitter with the ARC operator's comment;
 *         all ARC actions are logged to audit_logs.
 *
 * Test IDs: T-W16.7-UI-001, T-W16.7-UI-002, T-W16.7-UI-003
 *
 * Architecture: architecture/implementation-plan.md Wave 16.7
 * FRS: GAP-013
 * ARC API endpoints:
 *   GET  /api/ai/feedback/pending  — api/ai/feedback/pending.ts
 *   POST /api/ai/feedback/approve  — api/ai/feedback/approve.ts
 * Session: qa-builder wave16.7 RED suite
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

// ---------------------------------------------------------------------------
// Candidate paths for the ARC portal page
// Multiple naming conventions are accepted (both will fail initially).
// ---------------------------------------------------------------------------

const ARC_PAGE_CANDIDATES = [
  path.join(PAGES, 'arc', 'index.tsx'),
  path.join(PAGES, 'arc-portal', 'index.tsx'),
  path.join(PAGES, 'ArcPortalPage.tsx'),
  path.join(PAGES, 'ARCPortalPage.tsx'),
  path.join(PAGES, 'ARCReviewPage.tsx'),
  path.join(PAGES, 'ArcReviewPage.tsx'),
];

/**
 * Return the first ARC portal page that exists on disk, or undefined.
 */
function findArcPortalPage(): string | undefined {
  return ARC_PAGE_CANDIDATES.find((f) => fs.existsSync(f));
}

// ---------------------------------------------------------------------------
// T-W16.7-UI-001 — ARC portal page must exist
//   GAP-013: Currently no ARC portal page file exists anywhere in the frontend.
//   The ARC API endpoints exist (api/ai/feedback/approve.ts,
//   api/ai/feedback/pending.ts) but there is no UI to drive them.
//   RED until an ARC portal page is created at one of the accepted paths.
// ---------------------------------------------------------------------------

describe('T-W16.7-UI-001: ARC portal page file exists', () => {
  it('ARC portal page file exists at one of the accepted page paths', () => {
    // RED: No ARC portal page currently exists anywhere in pages/.
    // GREEN: A page file must exist at one of ARC_PAGE_CANDIDATES.
    const arcPage = findArcPortalPage();

    expect(
      arcPage !== undefined,
      'Expected an ARC portal page file to exist at one of the following paths:\n' +
        ARC_PAGE_CANDIDATES.map((c) => `  ${c}`).join('\n') +
        '\n\nGAP-013: Create the ARC Review portal page. The ARC API endpoints ' +
        'already exist:\n' +
        '  GET  /api/ai/feedback/pending   — lists pending feedback items\n' +
        '  POST /api/ai/feedback/approve   — approve or reject a feedback item\n\n' +
        'Create the portal at pages/arc/index.tsx (preferred) or pages/arc-portal/index.tsx.',
    ).toBe(true);
  });

  it('ARC portal page is not a stub (contains substantive content beyond a placeholder div)', () => {
    // RED: Even if the file is created as a placeholder, this test catches it.
    // GREEN: The page must have real structure — at minimum a component function
    //   with some rendering beyond a single static <div>.
    const arcPage = findArcPortalPage();
    if (!arcPage) {
      throw new Error(
        'ARC portal page not found. Create it at: ' + ARC_PAGE_CANDIDATES[0],
      );
    }

    const content = fs.readFileSync(arcPage, 'utf-8');

    // A real page has a named export, renders meaningful markup, and references
    // the pending feedback or ARC API. A stub typically has only a plain div.
    const hasNamedExport = /export\s+(default\s+)?function|export\s+const/.test(content);
    const hasSubstantiveContent =
      // Data fetching, state, or API reference
      /useState|useEffect|useQuery|fetch|pending|approve|reject|feedback/.test(content);

    expect(
      hasNamedExport && hasSubstantiveContent,
      'Expected the ARC portal page to contain a named export function AND ' +
        'substantive rendering logic (state management, data fetching, or ' +
        'references to approve/reject/pending/feedback).\n\n' +
        `File: ${arcPage}\n\nContent:\n\n${content}\n\n` +
        'GAP-013: Implement the ARC portal — list pending feedback with ' +
        'approve/reject action buttons wired to the API.',
    ).toBe(true);
  });

  it('App.tsx or router registers a route for the ARC portal', () => {
    // RED: No /arc route currently exists in App.tsx.
    // GREEN: App.tsx must define a /arc or /arc-portal route.
    const appFile = path.join(SRC, 'App.tsx');
    if (!fs.existsSync(appFile)) {
      throw new Error(`App.tsx not found: ${appFile}`);
    }
    const content = fs.readFileSync(appFile, 'utf-8');

    const hasArcRoute =
      /\/arc|ArcPortal|ARCPortal|ArcReview|ARCReview/.test(content);

    expect(
      hasArcRoute,
      'Expected App.tsx to register a route for the ARC portal ' +
        '(e.g. path="/arc" or importing ArcPortalPage).\n\n' +
        'Current routes / imports in App.tsx:\n\n' +
        content
          .split('\n')
          .filter((l) => /Route|path=|import/.test(l))
          .join('\n') +
        '\n\nGAP-013: Add a <Route path="/arc" element={<ArcPortalPage />} /> ' +
        'in App.tsx behind a RoleGuard for the ARC operator role.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.7-UI-002 — ARC portal must have approve AND reject action handlers
//   GAP-013: The api/ai/feedback/approve.ts endpoint accepts
//   { decision: 'approved' | 'rejected' }, so the UI must have distinct
//   approve and reject actions.
//   RED until the portal page contains both approve and reject handler logic.
// ---------------------------------------------------------------------------

describe('T-W16.7-UI-002: ARC portal has approve and reject action handlers', () => {
  it('ARC portal page references approve action', () => {
    // RED: Page does not exist yet.
    // GREEN: The page must contain approve handler logic (button, function, or
    //   API call with 'approved' decision).
    const arcPage = findArcPortalPage();
    if (!arcPage) {
      throw new Error(
        'ARC portal page not found — create it at: ' + ARC_PAGE_CANDIDATES[0],
      );
    }

    const content = fs.readFileSync(arcPage, 'utf-8');

    // Accept: function name, button label, API call, decision string
    const hasApprove =
      /approve|Approve|APPROVE|'approved'|"approved"/.test(content);

    expect(
      hasApprove,
      'Expected the ARC portal page to reference an approve action ' +
        '(e.g. an "Approve" button, handleApprove function, or ' +
        "decision: 'approved' API call).\n\n" +
        `File: ${arcPage}\n\nContent:\n\n${content}\n\n` +
        'GAP-013: Wire an Approve button to POST /api/ai/feedback/approve ' +
        "with { decision: 'approved' }.",
    ).toBe(true);
  });

  it('ARC portal page references reject action', () => {
    // RED: Page does not exist yet.
    // GREEN: The page must contain reject handler logic.
    const arcPage = findArcPortalPage();
    if (!arcPage) {
      throw new Error(
        'ARC portal page not found — create it at: ' + ARC_PAGE_CANDIDATES[0],
      );
    }

    const content = fs.readFileSync(arcPage, 'utf-8');

    // Accept: function name, button label, API call, decision string
    const hasReject =
      /reject|Reject|REJECT|'rejected'|"rejected"/.test(content);

    expect(
      hasReject,
      'Expected the ARC portal page to reference a reject action ' +
        '(e.g. a "Reject" button, handleReject function, or ' +
        "decision: 'rejected' API call).\n\n" +
        `File: ${arcPage}\n\nContent:\n\n${content}\n\n` +
        'GAP-013: Wire a Reject button to POST /api/ai/feedback/approve ' +
        "with { decision: 'rejected' } and include an operator comment field.",
    ).toBe(true);
  });

  it('ARC portal page references the pending feedback API endpoint', () => {
    // RED: Page does not exist yet.
    // GREEN: The page must reference GET /api/ai/feedback/pending
    //   (or a hook that fetches pending feedback) to populate the review list.
    const arcPage = findArcPortalPage();
    if (!arcPage) {
      throw new Error(
        'ARC portal page not found — create it at: ' + ARC_PAGE_CANDIDATES[0],
      );
    }

    const content = fs.readFileSync(arcPage, 'utf-8');

    // Accept: direct URL reference, hook name, or fetch of pending endpoint
    const referencesPendingApi =
      /pending|usePendingFeedback|useFeedbackPending|\/api\/ai\/feedback/.test(
        content,
      );

    expect(
      referencesPendingApi,
      'Expected the ARC portal page to reference the pending feedback API ' +
        '(/api/ai/feedback/pending) or a hook that fetches pending feedback.\n\n' +
        `File: ${arcPage}\n\nContent:\n\n${content}\n\n` +
        'GAP-013: Fetch pending items via GET /api/ai/feedback/pending and ' +
        'render them in a review list before the operator approves/rejects.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.7-UI-003 — ARC actions must be logged to audit_logs
//   GAP-013: Acceptance Criteria AC-2 requires all ARC actions to be logged
//   to the audit_logs table. The UI must invoke the logging mechanism
//   (directly or via the backend endpoint which already writes to audit_logs).
//   RED until the ARC portal references audit_logs or an audit log hook.
// ---------------------------------------------------------------------------

describe('T-W16.7-UI-003: ARC actions are logged to audit_logs', () => {
  it('ARC portal page references audit_logs or an audit log hook', () => {
    // RED: Page does not exist yet.
    // GREEN: The page (or a hook it imports) must reference audit_logs, useAuditLog,
    //   or logAuditEvent — ensuring all approve/reject decisions are traceable.
    const arcPage = findArcPortalPage();
    if (!arcPage) {
      throw new Error(
        'ARC portal page not found — create it at: ' + ARC_PAGE_CANDIDATES[0],
      );
    }

    const content = fs.readFileSync(arcPage, 'utf-8');

    const referencesAuditLog =
      /audit_logs|auditLogs|useAuditLog|logAuditEvent|audit_log/.test(content);

    expect(
      referencesAuditLog,
      'Expected the ARC portal page to reference audit_logs (or a logging hook) ' +
        'so that every ARC approve/reject action is traceable.\n\n' +
        `File: ${arcPage}\n\nContent:\n\n${content}\n\n` +
        'GAP-013: Ensure every approve/reject call writes a record to audit_logs. ' +
        'This can be done server-side (the approve endpoint already receives ' +
        '"reviewedBy" and "notes" fields) but the frontend must reference the ' +
        'logging mechanism — either through a useAuditLog hook or by confirming ' +
        'the API endpoint logs actions (reference it in a comment or JSDoc).',
    ).toBe(true);
  });

  it('ARC portal page references reviewedBy or operator identity for log traceability', () => {
    // RED: Page does not exist yet.
    // GREEN: The page must pass an operator identity (reviewedBy) to the approve
    //   endpoint so audit_logs records are attributable to the ARC operator.
    //   The api/ai/feedback/approve.ts signature requires: { reviewedBy: string }.
    const arcPage = findArcPortalPage();
    if (!arcPage) {
      throw new Error(
        'ARC portal page not found — create it at: ' + ARC_PAGE_CANDIDATES[0],
      );
    }

    const content = fs.readFileSync(arcPage, 'utf-8');

    // The approve API requires `reviewedBy` — the UI must supply it
    const hasOperatorIdentity =
      /reviewedBy|reviewed_by|operatorId|operator_id|currentUser|useAuth/.test(
        content,
      );

    expect(
      hasOperatorIdentity,
      'Expected the ARC portal page to supply operator identity (reviewedBy) ' +
        'when calling the approve/reject endpoint, ensuring audit_logs records ' +
        'are attributable to the ARC operator.\n\n' +
        `File: ${arcPage}\n\nContent:\n\n${content}\n\n` +
        'GAP-013: Pass reviewedBy (from useAuth or the current session) to the ' +
        'POST /api/ai/feedback/approve payload so each ARC action is attributed ' +
        'to the operator in audit_logs.',
    ).toBe(true);
  });
});
