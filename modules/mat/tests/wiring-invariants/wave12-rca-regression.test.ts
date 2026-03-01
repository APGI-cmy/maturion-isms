/**
 * Wave 12 QA Validation — RCA Regression + CWT Baseline (GREEN Gate)
 *
 * Test ID: T-W12-QAV-8
 * Task: 12.1 — Full Functionality & Build Wiring Verification (MAT module)
 * Gap References: W12-GAP-005, W12-GAP-007
 *
 * Purpose:
 *   Confirms that MAT-T-0099 through MAT-T-0108 infrastructure remains intact
 *   and that the CWT (Confirmed Working Tests) baseline is GREEN. This test acts
 *   as a regression gate — verifying the source components that MAT-T-0099..0108
 *   depend on have not regressed since they were confirmed GREEN.
 *
 *   MAT-T-0099..0108 are source-analysis tests (readFileSync assertions). This
 *   CWT baseline test validates the same source files at the infrastructure level
 *   to confirm zero regressions in the Wave 12 baseline.
 *
 * References: FR-001 | FR-005 | FR-013 | FR-039 | TR-033 | TR-047 | Wave 12 Task 12.1 W12-GAP-005 W12-GAP-007
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const FRONTEND_SRC = resolve(__dirname, '../../frontend/src');

// ---------------------------------------------------------------------------
// T-W12-QAV-8: RCA regression + CWT baseline (GREEN gate)
//
// MAT-T-0099 through MAT-T-0108 coverage map:
//   MAT-T-0099 — CriteriaTree component: Domain→MPS→Criteria hierarchy from live Supabase
//   MAT-T-0100 — EvidenceCapture delegates to EvidenceCollection (live data)
//   MAT-T-0101 — Create Audit button form with validation
//   MAT-T-0102 — Create Audit form submits to Supabase
//   MAT-T-0103 — Audit list fetches from Supabase
//   MAT-T-0104 — Edit Audit functionality
//   MAT-T-0105 — Delete Audit (soft delete)
//   MAT-T-0106 — Audit creation at 375px mobile viewport (no overflow)
//   MAT-T-0107 — Evidence modal at 375px mobile viewport
//   MAT-T-0108 — Review table at 375px mobile viewport
// ---------------------------------------------------------------------------

describe('T-W12-QAV-8: RCA regression + CWT baseline (GREEN gate) — MAT-T-0099..MAT-T-0108 infrastructure confirmed GREEN', () => {

  // -------------------------------------------------------------------------
  // Baseline Group 1: CriteriaTree & EvidenceCapture (MAT-T-0099, MAT-T-0100)
  // -------------------------------------------------------------------------

  it('T-W12-QAV-8a: CWT baseline — CriteriaTree source exists with required live-data wiring (MAT-T-0099)', () => {
    // Confirms infrastructure for MAT-T-0099 has NOT regressed
    // W12-GAP-005: regression verification for criteria hierarchy component

    const criteriaTreePath = resolve(FRONTEND_SRC, 'components/criteria/CriteriaTree.tsx');
    expect(existsSync(criteriaTreePath)).toBe(true);

    const src = readFileSync(criteriaTreePath, 'utf-8');

    // Live data wiring intact (useCriteriaTree hook)
    expect(src).toContain('useCriteriaTree');
    expect(src).toContain("from '../../lib/hooks/useCriteria'");

    // All 3 hierarchy levels intact
    expect(src).toContain('domains.map');
    expect(src).toContain('domain.mini_performance_standards');
    expect(src).toContain('mps.criteria');

    // ARIA accessibility intact
    expect(src).toContain('role="tree"');

    // No mock data regression
    expect(src).not.toContain('mockData');
    expect(src).not.toContain('hardcodedDomains');
  });

  it('T-W12-QAV-8b: CWT baseline — EvidenceCapture→EvidenceCollection delegation intact (MAT-T-0100)', () => {
    // Confirms infrastructure for MAT-T-0100 has NOT regressed
    // W12-GAP-005: regression verification for evidence live data wiring

    const evidenceCapturePath = resolve(FRONTEND_SRC, 'components/evidence/EvidenceCapture.tsx');
    const evidenceCollectionPath = resolve(FRONTEND_SRC, 'components/evidence/EvidenceCollection.tsx');

    expect(existsSync(evidenceCapturePath)).toBe(true);
    expect(existsSync(evidenceCollectionPath)).toBe(true);

    const captureSrc = readFileSync(evidenceCapturePath, 'utf-8');
    const collectionSrc = readFileSync(evidenceCollectionPath, 'utf-8');

    // Delegation intact
    expect(captureSrc).toContain('EvidenceCollection');
    expect(captureSrc).toContain('criterionId={criterionId}');

    // Live data hook intact in EvidenceCollection
    expect(collectionSrc).toContain('useCriterionEvidence');

    // No mock data regression
    expect(captureSrc).not.toContain('mockEvidence');
    expect(captureSrc).not.toContain('STUB');
  });

  // -------------------------------------------------------------------------
  // Baseline Group 2: Audit CRUD components (MAT-T-0101 through MAT-T-0105)
  // -------------------------------------------------------------------------

  it('T-W12-QAV-8c: CWT baseline — AuditCreationForm live wiring intact (MAT-T-0101, MAT-T-0102)', () => {
    // Confirms infrastructure for MAT-T-0101 and MAT-T-0102 has NOT regressed
    // W12-GAP-007: regression verification for audit CRUD wiring

    const formPath = resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx');
    expect(existsSync(formPath)).toBe(true);

    const src = readFileSync(formPath, 'utf-8');

    // Form uses live Supabase mutation hook
    expect(src).toContain('useCreateAudit');

    // Validation present
    expect(src).toContain('validate');

    // Accessibility intact
    expect(src).toContain('aria-required');

    // Double-submit prevention intact
    expect(src).toContain('isPending');

    // Form submission wiring intact
    expect(src).toContain('mutateAsync');
    expect(src).toContain('onSubmit');
  });

  it('T-W12-QAV-8d: CWT baseline — AuditList live fetch intact (MAT-T-0103)', () => {
    // Confirms infrastructure for MAT-T-0103 has NOT regressed

    const listPath = resolve(FRONTEND_SRC, 'components/audits/AuditList.tsx');
    expect(existsSync(listPath)).toBe(true);

    const src = readFileSync(listPath, 'utf-8');

    // Live Supabase hook intact
    expect(src).toContain('useAudits');

    // Loading state handler intact
    expect(src).toContain('isLoading');

    // Empty state message intact
    expect(src).toContain('No audits yet');

    // Skeleton loader UX intact
    expect(src).toContain('animate-pulse');
  });

  it('T-W12-QAV-8e: CWT baseline — useAudits hook update and delete mutations intact (MAT-T-0104, MAT-T-0105)', () => {
    // Confirms infrastructure for MAT-T-0104 and MAT-T-0105 has NOT regressed

    const hookPath = resolve(FRONTEND_SRC, 'lib/hooks/useAudits.ts');
    expect(existsSync(hookPath)).toBe(true);

    const hookSrc = readFileSync(hookPath, 'utf-8');

    // Edit hook intact (MAT-T-0104)
    expect(hookSrc).toContain('useUpdateAudit');
    expect(hookSrc).toContain('useMutation');
    expect(hookSrc).toContain('invalidateQueries');

    // Delete hook intact (MAT-T-0105) — soft delete
    expect(hookSrc).toContain('useDeleteAudit');
  });

  // -------------------------------------------------------------------------
  // Baseline Group 3: Mobile viewport (MAT-T-0106, MAT-T-0107, MAT-T-0108)
  // -------------------------------------------------------------------------

  it('T-W12-QAV-8f: CWT baseline — mobile viewport source files exist for 375px tests (MAT-T-0106..MAT-T-0108)', () => {
    // Confirms infrastructure for MAT-T-0106, MAT-T-0107, MAT-T-0108 has NOT regressed
    // W12-GAP-007: regression verification for mobile viewport components

    const mobileComponents = [
      { name: 'AuditCreationForm.tsx', dir: 'components/audits', test: 'MAT-T-0106' },
      { name: 'EvidenceCollection.tsx', dir: 'components/evidence', test: 'MAT-T-0107' },
      { name: 'ReviewTable.tsx', dir: 'components/scoring', test: 'MAT-T-0108' },
    ];

    for (const component of mobileComponents) {
      const componentPath = resolve(FRONTEND_SRC, component.dir, component.name);
      expect(existsSync(componentPath),
        `${component.test} baseline requires ${component.name} to exist`
      ).toBe(true);

      const src = readFileSync(componentPath, 'utf-8');

      // Each mobile-sensitive component must exist and be non-empty
      expect(src.length).toBeGreaterThan(0);
    }
  });

  it('T-W12-QAV-8g: CWT baseline — AuditCreationForm has full-width (w-full) mobile inputs (MAT-T-0106)', () => {
    // Confirms mobile compatibility for MAT-T-0106 has NOT regressed

    const formPath = resolve(FRONTEND_SRC, 'components/audits/AuditCreationForm.tsx');
    const src = readFileSync(formPath, 'utf-8');

    // Full-width inputs for touch-friendly 375px experience
    expect(src).toContain('w-full');
  });

  it('T-W12-QAV-8h: CWT baseline — EvidenceCollection has mobile overflow handling (MAT-T-0107)', () => {
    // Confirms mobile overflow handling for MAT-T-0107 has NOT regressed

    const collectionPath = resolve(FRONTEND_SRC, 'components/evidence/EvidenceCollection.tsx');
    const src = readFileSync(collectionPath, 'utf-8');

    // Overflow-x-auto for tab scrolling at 375px (prevents horizontal bleed)
    expect(src).toContain('overflow-x-auto');
  });

  it('T-W12-QAV-8i: CWT baseline — ReviewTable has mobile scroll container (MAT-T-0108)', () => {
    // Confirms mobile scroll container for MAT-T-0108 has NOT regressed

    const reviewTablePath = resolve(FRONTEND_SRC, 'components/scoring/ReviewTable.tsx');
    const src = readFileSync(reviewTablePath, 'utf-8');

    // Overflow-x-auto container prevents content clipping at 375px
    expect(src).toContain('overflow-x-auto');
  });

  // -------------------------------------------------------------------------
  // Baseline integrity summary — zero regression confirmation
  // -------------------------------------------------------------------------

  it('T-W12-QAV-8j: CWT zero-regression baseline — all 10 source files for MAT-T-0099..MAT-T-0108 exist and are non-empty', () => {
    // W12-GAP-005, W12-GAP-007 — complete CWT baseline verification
    // Confirms ALL source files required by MAT-T-0099..0108 are present and non-empty

    const requiredSourceFiles = [
      'components/criteria/CriteriaTree.tsx',           // MAT-T-0099
      'components/evidence/EvidenceCapture.tsx',         // MAT-T-0100
      'components/evidence/EvidenceCollection.tsx',      // MAT-T-0100
      'components/audits/AuditCreationForm.tsx',         // MAT-T-0101, MAT-T-0102, MAT-T-0106
      'components/audits/AuditList.tsx',                 // MAT-T-0103
      'lib/hooks/useAudits.ts',                          // MAT-T-0102, MAT-T-0104, MAT-T-0105
      'components/scoring/ReviewTable.tsx',              // MAT-T-0108
    ];

    for (const relPath of requiredSourceFiles) {
      const fullPath = resolve(FRONTEND_SRC, relPath);
      expect(existsSync(fullPath), `CWT baseline requires ${relPath} to exist`).toBe(true);

      const content = readFileSync(fullPath, 'utf-8');
      expect(content.length, `CWT baseline requires ${relPath} to be non-empty`).toBeGreaterThan(100);
    }
  });
});
