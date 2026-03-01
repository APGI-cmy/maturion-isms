/**
 * Wave 12 Task 12.3 — UI Flow Verification (Source-Level Assertions)
 *
 * Test IDs : T-W12-UI-1 through T-W12-UI-9
 * Task     : 12.3 — Full Functionality & Build Wiring Verification (MAT module)
 * Builder  : ui-builder
 * Baseline : 474 tests GREEN (Task 12.2 GREEN gate confirmed)
 *
 * Strategy : Source-level assertions (readFileSync / existsSync) verify that
 *            live-wired React components, hooks, and service files are present
 *            and correctly connected.  No mocks, no stubs, no placeholder text.
 *
 * Gap refs : W12-GAP-002 (offline sync), W12-GAP-005 (criteria hierarchy /
 *            evidence modal), W12-GAP-006 (mobile 375 px viewport)
 *
 * References: FR-001 | FR-005 | FR-013 | FR-039 | TR-033 | TR-047 | TR-049 |
 *             TR-050 | TR-051 | TR-052 | WCAG 2.1 AA
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Resolved path constants
// ---------------------------------------------------------------------------
const FRONTEND_SRC = resolve(__dirname, '../../frontend/src');
const MAT_SRC      = resolve(__dirname, '../../src');

// ---------------------------------------------------------------------------
// T-W12-UI-1  Audit creation flow — live wiring
// ---------------------------------------------------------------------------
describe('T-W12-UI-1: Audit creation flow — live wiring', () => {
  const formPath = resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx');

  it('T-W12-UI-1a: AuditCreationForm.tsx exists at canonical path', () => {
    expect(
      existsSync(formPath),
      'AuditCreationForm.tsx must exist at components/audits/AuditCreationForm.tsx'
    ).toBe(true);
  });

  it('T-W12-UI-1b: AuditCreationForm uses useCreateAudit hook (not mock)', () => {
    const src = readFileSync(formPath, 'utf-8');

    // Live Supabase mutation hook
    expect(src).toContain('useCreateAudit');
    expect(src).toContain('mutateAsync');

    // Must NOT use mock/stub data
    expect(src).not.toContain('mockAudit');
    expect(src).not.toContain('STUB');
    expect(src).not.toContain('TODO: wire');
  });

  it('T-W12-UI-1c: AuditCreationForm renders with aria-required inputs', () => {
    const src = readFileSync(formPath, 'utf-8');

    // WCAG 2.1 AA — form inputs must carry aria-required="true"
    expect(src).toContain('aria-required');

    // Form submission wiring
    expect(src).toContain('onSubmit');

    // Double-submit prevention
    expect(src).toContain('isPending');
  });

  it('T-W12-UI-1d: AuditCreationForm imports from live hook module', () => {
    const src = readFileSync(formPath, 'utf-8');
    expect(src).toContain("from '../../lib/hooks/useAudits'");
  });
});

// ---------------------------------------------------------------------------
// T-W12-UI-2  Criteria scoring flow — live wiring
// ---------------------------------------------------------------------------
describe('T-W12-UI-2: Criteria scoring flow — live wiring', () => {
  const reviewTablePath = resolve(FRONTEND_SRC, 'components/scoring/ReviewTable.tsx');

  it('T-W12-UI-2a: ReviewTable.tsx exists at canonical path', () => {
    expect(
      existsSync(reviewTablePath),
      'ReviewTable.tsx must exist at components/scoring/ReviewTable.tsx'
    ).toBe(true);
  });

  it('T-W12-UI-2b: ReviewTable references live scoring hook (not hardcoded data)', () => {
    const src = readFileSync(reviewTablePath, 'utf-8');

    // Live scoring hook — queries Supabase scoring data
    expect(src).toContain('useAuditScores');

    // No mock/hardcoded data
    expect(src).not.toContain('mockScores');
    expect(src).not.toContain('hardcodedScores');
    expect(src).not.toContain('STUB');
  });

  it('T-W12-UI-2c: ReviewTable renders scoring result fields (scoring_results data shape)', () => {
    const src = readFileSync(reviewTablePath, 'utf-8');

    // Scoring data fields (scoring_results domain: ai_score, human_score, status)
    expect(src).toContain('ai_score');
    expect(src).toContain('human_score');
    expect(src).toContain('status');
  });

  it('T-W12-UI-2d: useScoring hook file exists with live Supabase wiring', () => {
    const hookPath = resolve(FRONTEND_SRC, 'lib/hooks/useScoring.ts');
    expect(existsSync(hookPath)).toBe(true);

    const hookSrc = readFileSync(hookPath, 'utf-8');
    expect(hookSrc).toContain('useAuditScores');
    expect(hookSrc).toContain('useQuery');
    expect(hookSrc).toContain('supabase');
  });
});

// ---------------------------------------------------------------------------
// T-W12-UI-3  Evidence upload flow — live wiring
// ---------------------------------------------------------------------------
describe('T-W12-UI-3: Evidence upload flow — live wiring', () => {
  const collectionPath = resolve(FRONTEND_SRC, 'components/evidence/EvidenceCollection.tsx');

  it('T-W12-UI-3a: EvidenceCollection.tsx exists at canonical path', () => {
    expect(
      existsSync(collectionPath),
      'EvidenceCollection.tsx must exist at components/evidence/EvidenceCollection.tsx'
    ).toBe(true);
  });

  it('T-W12-UI-3b: EvidenceCollection references useCriterionEvidence hook', () => {
    const src = readFileSync(collectionPath, 'utf-8');

    // Live evidence data hook
    expect(src).toContain('useCriterionEvidence');

    // No mock/stub data
    expect(src).not.toContain('mockEvidence');
    expect(src).not.toContain('STUB');
  });

  it('T-W12-UI-3c: EvidenceCollection has photo capture upload wiring (capture="environment")', () => {
    const src = readFileSync(collectionPath, 'utf-8');

    // Photo capture wiring — capture="environment" for mobile native camera (G-07)
    expect(src).toContain('capture="environment"');
    expect(src).toContain('accept="image/*"');
  });

  it('T-W12-UI-3d: EvidenceCollection imports from live hook module', () => {
    const src = readFileSync(collectionPath, 'utf-8');
    expect(src).toContain("from '../../lib/hooks/useEvidence'");
  });
});

// ---------------------------------------------------------------------------
// T-W12-UI-4  Dashboard navigation — component structure
// ---------------------------------------------------------------------------
describe('T-W12-UI-4: Dashboard navigation — component structure', () => {
  const layoutPath = resolve(FRONTEND_SRC, 'components/Layout.tsx');
  const appPath    = resolve(FRONTEND_SRC, 'App.tsx');

  it('T-W12-UI-4a: Layout.tsx (DashboardLayout equivalent) exists', () => {
    expect(
      existsSync(layoutPath),
      'Layout.tsx must exist — serves as DashboardLayout / navigation shell'
    ).toBe(true);
  });

  it('T-W12-UI-4b: Layout contains audits navigation link', () => {
    const src = readFileSync(layoutPath, 'utf-8');
    expect(src).toContain('/audits');
  });

  it('T-W12-UI-4c: Layout contains criteria navigation link', () => {
    const src = readFileSync(layoutPath, 'utf-8');
    expect(src).toContain('/criteria');
  });

  it('T-W12-UI-4d: Layout contains evidence navigation link', () => {
    const src = readFileSync(layoutPath, 'utf-8');
    expect(src).toContain('/evidence');
  });

  it('T-W12-UI-4e: App.tsx wires dashboard, audits, criteria, evidence routes', () => {
    expect(existsSync(appPath)).toBe(true);
    const src = readFileSync(appPath, 'utf-8');

    expect(src).toContain('DashboardPage');
    expect(src).toContain('AuditManagementPage');
    expect(src).toContain('CriteriaManagementPage');
    expect(src).toContain('EvidenceCollectionPage');
  });
});

// ---------------------------------------------------------------------------
// T-W12-UI-5  Accessibility audit — ARIA compliance
// ---------------------------------------------------------------------------
describe('T-W12-UI-5: Accessibility audit — ARIA compliance', () => {
  it('T-W12-UI-5a: AuditCreationForm has aria-label on required inputs', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx'),
      'utf-8'
    );

    // Labelled inputs (WCAG 2.1 AA SC 1.3.1, 4.1.2)
    expect(src).toContain('aria-label');
    expect(src).toContain('aria-required');
    expect(src).toContain('htmlFor');
  });

  it('T-W12-UI-5b: ReviewTable has accessible search and filter controls', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/scoring/ReviewTable.tsx'),
      'utf-8'
    );

    // Labelled controls (WCAG 2.1 AA SC 4.1.2)
    expect(src).toContain('aria-label');
  });

  it('T-W12-UI-5c: EvidenceCollection has aria-label on file inputs', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/evidence/EvidenceCollection.tsx'),
      'utf-8'
    );

    expect(src).toContain('aria-label');
  });

  it('T-W12-UI-5d: CriteriaTree has role="tree" and aria-label (WCAG tree widget)', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/criteria/CriteriaTree.tsx'),
      'utf-8'
    );

    expect(src).toContain('role="tree"');
    expect(src).toContain('aria-label');
  });

  it('T-W12-UI-5e: Layout has skip-to-main link for keyboard accessibility', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/Layout.tsx'),
      'utf-8'
    );

    // Skip navigation link (WCAG 2.1 AA SC 2.4.1)
    expect(src).toContain('main-content');
    expect(src).toContain('Skip');
  });

  it('T-W12-UI-5f: AuditCreationForm error messages use role="alert" for SR announcement', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx'),
      'utf-8'
    );

    // Live region for error announcement (WCAG 2.1 AA SC 4.1.3)
    expect(src).toContain('role="alert"');
  });
});

// ---------------------------------------------------------------------------
// T-W12-UI-6  Offline sync UI — RCA G-16 regression  (W12-GAP-002)
// ---------------------------------------------------------------------------
describe('T-W12-UI-6: Offline sync UI — RCA G-16 regression [W12-GAP-002]', () => {
  it('T-W12-UI-6a: offline-sync service file exists', () => {
    const offlineSyncPath = resolve(MAT_SRC, 'services/offline-sync.ts');
    expect(
      existsSync(offlineSyncPath),
      'modules/mat/src/services/offline-sync.ts must exist'
    ).toBe(true);
  });

  it('T-W12-UI-6b: Service worker registration wiring present in main.tsx', () => {
    const mainPath = resolve(FRONTEND_SRC, 'main.tsx');
    expect(existsSync(mainPath)).toBe(true);

    const src = readFileSync(mainPath, 'utf-8');

    // ServiceWorker registration for PWA offline support
    expect(src).toContain('serviceWorker');
    expect(src).toContain("register('/sw.js')");
  });

  it('T-W12-UI-6c: OfflineIndicator sync status component exists', () => {
    const offlineIndicatorPath = resolve(FRONTEND_SRC, 'components/OfflineIndicator.tsx');
    expect(
      existsSync(offlineIndicatorPath),
      'OfflineIndicator.tsx (sync status indicator) must exist'
    ).toBe(true);
  });

  it('T-W12-UI-6d: OfflineIndicator has role="status" ARIA live region', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/OfflineIndicator.tsx'),
      'utf-8'
    );

    // Accessibility: sync status communicated to screen readers (WCAG 2.1 AA SC 4.1.3)
    expect(src).toContain('role="status"');
    expect(src).toContain('aria-live');
  });

  it('T-W12-UI-6e: offline-sync service exports sync engine functions', () => {
    const src = readFileSync(resolve(MAT_SRC, 'services/offline-sync.ts'), 'utf-8');

    // Core offline engine functions must be exported
    expect(src).toContain('createOfflineEvidenceEntry');
    expect(src).toContain('processSyncQueue');
  });
});

// ---------------------------------------------------------------------------
// T-W12-UI-7  Criteria hierarchy render — RCA G-03 regression  (W12-GAP-005)
// ---------------------------------------------------------------------------
describe('T-W12-UI-7: Criteria hierarchy render — RCA G-03 regression [W12-GAP-005]', () => {
  const criteriaTreePath = resolve(FRONTEND_SRC, 'components/criteria/CriteriaTree.tsx');

  it('T-W12-UI-7a: CriteriaTree.tsx exists at canonical path', () => {
    expect(existsSync(criteriaTreePath)).toBe(true);
  });

  it('T-W12-UI-7b: CriteriaTree uses live useCriteriaTree hook (not hardcoded data)', () => {
    const src = readFileSync(criteriaTreePath, 'utf-8');

    // Live hook
    expect(src).toContain('useCriteriaTree');
    expect(src).toContain("from '../../lib/hooks/useCriteria'");

    // No hardcoded/mock data
    expect(src).not.toContain('mockData');
    expect(src).not.toContain('hardcodedDomains');
    expect(src).not.toContain('STUB');
  });

  it('T-W12-UI-7c: CriteriaTree renders all 3 hierarchy levels (Domain→MPS→Criteria)', () => {
    const src = readFileSync(criteriaTreePath, 'utf-8');

    // Level 1: Domain
    expect(src).toContain('domains.map');

    // Level 2: MPS (Mini Performance Standards)
    expect(src).toContain('domain.mini_performance_standards');

    // Level 3: Criteria
    expect(src).toContain('mps.criteria');
  });

  it('T-W12-UI-7d: CriteriaTree has role="tree" ARIA widget for keyboard navigation', () => {
    const src = readFileSync(criteriaTreePath, 'utf-8');
    expect(src).toContain('role="tree"');
  });
});

// ---------------------------------------------------------------------------
// T-W12-UI-8  Evidence modal live data — RCA G-04 regression  (W12-GAP-005)
// ---------------------------------------------------------------------------
describe('T-W12-UI-8: Evidence modal live data — RCA G-04 regression [W12-GAP-005]', () => {
  const evidenceCapturePath    = resolve(FRONTEND_SRC, 'components/evidence/EvidenceCapture.tsx');
  const evidenceCollectionPath = resolve(FRONTEND_SRC, 'components/evidence/EvidenceCollection.tsx');

  it('T-W12-UI-8a: EvidenceCapture.tsx exists', () => {
    expect(existsSync(evidenceCapturePath)).toBe(true);
  });

  it('T-W12-UI-8b: EvidenceCapture delegates to EvidenceCollection component', () => {
    const src = readFileSync(evidenceCapturePath, 'utf-8');

    // Delegation pattern (G-04 fix: no direct hardcoded data)
    expect(src).toContain('EvidenceCollection');
    expect(src).toContain('criterionId={criterionId}');
  });

  it('T-W12-UI-8c: EvidenceCapture contains no mock or hardcoded evidence data', () => {
    const src = readFileSync(evidenceCapturePath, 'utf-8');
    expect(src).not.toContain('mockEvidence');
    expect(src).not.toContain('STUB');
    expect(src).not.toContain('hardcodedEvidence');
  });

  it('T-W12-UI-8d: EvidenceCollection uses useCriterionEvidence hook (not hardcoded)', () => {
    const src = readFileSync(evidenceCollectionPath, 'utf-8');

    // Live Supabase data hook
    expect(src).toContain('useCriterionEvidence');

    // Not a fake/stub
    expect(src).not.toContain('mockEvidence');
    expect(src).not.toContain('hardcodedEvidence');
  });

  it('T-W12-UI-8e: EvidenceCollection imports from live useEvidence hook module', () => {
    const src = readFileSync(evidenceCollectionPath, 'utf-8');
    expect(src).toContain("from '../../lib/hooks/useEvidence'");
  });
});

// ---------------------------------------------------------------------------
// T-W12-UI-9  Mobile viewport 375px — RCA G-15 regression  (W12-GAP-006)
// ---------------------------------------------------------------------------
describe('T-W12-UI-9: Mobile viewport 375px — RCA G-15 regression [W12-GAP-006]', () => {
  it('T-W12-UI-9a: AuditCreationForm has w-full responsive classes (no fixed-width at 375px)', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx'),
      'utf-8'
    );

    // Full-width inputs do not break 375px layout
    expect(src).toContain('w-full');

    // No fixed-pixel widths that would overflow at 375px
    expect(src).not.toMatch(/width:\s*\d{3,}px/);
    expect(src).not.toMatch(/w-\[(?:[4-9]\d{2}|[1-9]\d{3,})px\]/);
  });

  it('T-W12-UI-9b: EvidenceCollection has overflow-x-auto for horizontal scroll at 375px', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/evidence/EvidenceCollection.tsx'),
      'utf-8'
    );

    // Overflow scroll prevents content clipping on narrow viewports
    expect(src).toContain('overflow-x-auto');
  });

  it('T-W12-UI-9c: ReviewTable has overflow-x-auto scroll container for 375px table safety', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/scoring/ReviewTable.tsx'),
      'utf-8'
    );

    // Table must scroll horizontally, not overflow/clip, at 375px
    expect(src).toContain('overflow-x-auto');
  });

  it('T-W12-UI-9d: AuditCreationForm has no inline min-width that exceeds 375px', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx'),
      'utf-8'
    );

    // Reject explicit min-width values wider than mobile viewport
    expect(src).not.toMatch(/min-w-\[(?:[4-9]\d{2}|[1-9]\d{3,})px\]/);
    expect(src).not.toMatch(/minWidth:\s*["']?(?:[4-9]\d{2}|[1-9]\d{3,})px/);
  });

  it('T-W12-UI-9e: Layout uses responsive sidebar (translate-based show/hide for mobile)', () => {
    const src = readFileSync(
      resolve(FRONTEND_SRC, 'components/Layout.tsx'),
      'utf-8'
    );

    // Sidebar hidden by default on mobile via CSS transforms (not fixed display:none)
    expect(src).toContain('translate-x-0');
    expect(src).toContain('-translate-x-full');
  });
});
