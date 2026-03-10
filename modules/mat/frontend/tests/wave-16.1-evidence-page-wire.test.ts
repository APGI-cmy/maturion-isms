/**
 * Wave 16.1 — Evidence Collection Page Wire RED QA Suite
 *
 * QA-to-Red: ALL tests in this file MUST fail until Wave 16.1 implementation
 * rewires the /evidence route to the real EvidenceCollection component.
 *
 * Gap addressed:
 *   GAP-003 — /evidence page is wired to a stub component (EvidenceCollectionPage)
 *             instead of the real EvidenceCollection component.
 *
 * Acceptance Criteria (from implementation-plan.md Wave 16.1):
 *   - The /evidence page route must render EvidenceCollection.tsx (not the stub)
 *   - Import chain from pages/evidence/index.tsx leads to
 *     components/evidence/EvidenceCollection.tsx, NOT to EvidenceCollectionPage.tsx
 *
 * Test IDs: T-W16.1-UI-001, T-W16.1-UI-002
 *
 * Architecture: architecture/implementation-plan.md Wave 16.1
 * FRS: GAP-003, FR-013 through FR-022
 * Session: qa-builder wave16.1 RED suite
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

/**
 * Resolve paths relative to the frontend source directory.
 * The test file lives at modules/mat/frontend/tests/ so __dirname is that dir.
 * We navigate up one level to modules/mat/frontend/.
 */
const FRONTEND_SRC = path.resolve(__dirname, '..', 'src');

const ROUTE_FILE = path.join(FRONTEND_SRC, 'pages', 'evidence', 'index.tsx');
const STUB_FILE = path.join(FRONTEND_SRC, 'pages', 'EvidenceCollectionPage.tsx');
const REAL_COMPONENT = path.join(
  FRONTEND_SRC,
  'components',
  'evidence',
  'EvidenceCollection.tsx',
);

// ---------------------------------------------------------------------------
// T-W16.1-UI-001 — Route must NOT import stub; MUST reference real component
// ---------------------------------------------------------------------------

describe('T-W16.1-UI-001: /evidence route does not import EvidenceCollectionPage stub', () => {
  it('pages/evidence/index.tsx exists', () => {
    // Precondition: the route file must exist regardless of what it imports.
    expect(
      fs.existsSync(ROUTE_FILE),
      `Expected route file to exist at:\n  ${ROUTE_FILE}`,
    ).toBe(true);
  });

  it('pages/evidence/index.tsx does NOT re-export from EvidenceCollectionPage (stub)', () => {
    // RED: Currently index.tsx contains `export * from '../EvidenceCollectionPage'`
    //      which is the stub.  This test FAILS until that import is removed.
    // GREEN: Route imports from the real component instead.
    if (!fs.existsSync(ROUTE_FILE)) {
      throw new Error(`Route file not found: ${ROUTE_FILE}`);
    }
    const content = fs.readFileSync(ROUTE_FILE, 'utf-8');

    // Match any import/export that references EvidenceCollectionPage
    const stubImportPattern = /['"]\.\.\/EvidenceCollectionPage['"]/;
    const stubExportPattern = /export\s+\*\s+from\s+['"]\.\.\/EvidenceCollectionPage['"]/;

    const importsStub =
      stubImportPattern.test(content) || stubExportPattern.test(content);

    expect(
      importsStub,
      'Expected pages/evidence/index.tsx to NOT reference EvidenceCollectionPage (stub). ' +
        'Current content:\n\n' +
        content +
        '\n\nGAP-003: Remove the EvidenceCollectionPage re-export and wire to ' +
        'components/evidence/EvidenceCollection instead.',
    ).toBe(false);
  });

  it('pages/evidence/index.tsx references EvidenceCollection from components', () => {
    // RED: Current index.tsx exports the stub, not the real component.
    // GREEN: index.tsx imports/re-exports from components/evidence/EvidenceCollection.
    if (!fs.existsSync(ROUTE_FILE)) {
      throw new Error(`Route file not found: ${ROUTE_FILE}`);
    }
    const content = fs.readFileSync(ROUTE_FILE, 'utf-8');

    // Accept any relative import that resolves to the real EvidenceCollection
    // component (various possible relative path forms).
    const realComponentPattern =
      /['"][^'"]*components\/evidence\/EvidenceCollection['"]/;

    expect(
      realComponentPattern.test(content),
      'Expected pages/evidence/index.tsx to import from ' +
        '"components/evidence/EvidenceCollection" (the real component). ' +
        'Current content:\n\n' +
        content +
        '\n\nGAP-003: Wire the /evidence route to EvidenceCollection.tsx.',
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T-W16.1-UI-002 — Import chain must lead to real EvidenceCollection (not stub)
// ---------------------------------------------------------------------------

describe('T-W16.1-UI-002: /evidence route import chain leads to real EvidenceCollection component', () => {
  it('real EvidenceCollection component file exists at components/evidence/EvidenceCollection.tsx', () => {
    // Precondition: the real component must exist for the wire to be possible.
    expect(
      fs.existsSync(REAL_COMPONENT),
      `Expected real EvidenceCollection component at:\n  ${REAL_COMPONENT}\n` +
        'This file must exist before the route can be wired to it.',
    ).toBe(true);
  });

  it('real EvidenceCollection component is NOT a stub/placeholder', () => {
    // RED-adjacent guard: ensures the target component itself is real implementation,
    // not another placeholder.  Will stay GREEN as long as the real component exists
    // with substantive content, but forms part of the import-chain verification.
    if (!fs.existsSync(REAL_COMPONENT)) {
      throw new Error(`Real EvidenceCollection not found: ${REAL_COMPONENT}`);
    }
    const content = fs.readFileSync(REAL_COMPONENT, 'utf-8');

    // The stub pattern: only a simple div with placeholder text and no hooks.
    // The real component uses React hooks (useState/useRef) and evidence hooks.
    const hasHooks =
      content.includes('useState') || content.includes('useRef') || content.includes('useEffect');
    const hasEvidenceLogic =
      content.includes('useEvidence') ||
      content.includes('useCriterionEvidence') ||
      content.includes('criterionId');

    expect(
      hasHooks || hasEvidenceLogic,
      'Expected EvidenceCollection.tsx at components/evidence/ to be a real implementation ' +
        '(containing React hooks or evidence-domain logic), not a placeholder stub. ' +
        'GAP-003 requires the route to render the real component.',
    ).toBe(true);
  });

  it('pages/evidence/index.tsx import chain does NOT terminate at EvidenceCollectionPage stub', () => {
    // RED: Current chain: pages/evidence/index.tsx → EvidenceCollectionPage.tsx (stub)
    // GREEN: pages/evidence/index.tsx → components/evidence/EvidenceCollection.tsx (real)
    //
    // This test traces one level of indirection to confirm the route file does
    // not reach the stub at any point in its re-export chain.
    if (!fs.existsSync(ROUTE_FILE)) {
      throw new Error(`Route file not found: ${ROUTE_FILE}`);
    }
    const routeContent = fs.readFileSync(ROUTE_FILE, 'utf-8');

    // Resolve any "export * from '<relative>'" statements in the route file
    // and check that none of them resolve to EvidenceCollectionPage.
    const reExportPattern = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;
    const resolvedTargets: string[] = [];

    while ((match = reExportPattern.exec(routeContent)) !== null) {
      const relPath = match[1];
      // Resolve relative to the route file's directory
      const routeDir = path.dirname(ROUTE_FILE);
      const candidates = [`${relPath}.tsx`, `${relPath}.ts`, `${relPath}/index.tsx`];
      for (const candidate of candidates) {
        const resolved = path.resolve(routeDir, candidate);
        if (fs.existsSync(resolved)) {
          resolvedTargets.push(resolved);
          break;
        }
      }
    }

    // Also check direct imports (import ... from '...')
    const importPattern = /import\s+[^'"]*from\s+['"]([^'"]+)['"]/g;
    while ((match = importPattern.exec(routeContent)) !== null) {
      const relPath = match[1];
      const routeDir = path.dirname(ROUTE_FILE);
      const candidates = [`${relPath}.tsx`, `${relPath}.ts`, `${relPath}/index.tsx`];
      for (const candidate of candidates) {
        const resolved = path.resolve(routeDir, candidate);
        if (fs.existsSync(resolved)) {
          resolvedTargets.push(resolved);
          break;
        }
      }
    }

    // None of the resolved import targets should be the stub
    const stubResolved = path.resolve(STUB_FILE);
    const routesToStub = resolvedTargets.some(
      (t) => path.resolve(t) === stubResolved,
    );

    expect(
      routesToStub,
      'Expected pages/evidence/index.tsx import chain to NOT lead to EvidenceCollectionPage.tsx. ' +
        `Resolved import targets:\n  ${resolvedTargets.join('\n  ')}\n\n` +
        'GAP-003: Remove the re-export of EvidenceCollectionPage and wire directly to ' +
        'components/evidence/EvidenceCollection.',
    ).toBe(false);
  });

  it('pages/evidence/index.tsx import chain leads to the real EvidenceCollection component', () => {
    // RED: Current chain leads to stub, not to real component.
    // GREEN: Import chain terminates at components/evidence/EvidenceCollection.tsx.
    if (!fs.existsSync(ROUTE_FILE)) {
      throw new Error(`Route file not found: ${ROUTE_FILE}`);
    }
    const routeContent = fs.readFileSync(ROUTE_FILE, 'utf-8');

    const routeDir = path.dirname(ROUTE_FILE);
    const realResolved = path.resolve(REAL_COMPONENT);

    // Check all export/import statements for a reference that resolves to the real component
    const allImportExportPattern =
      /(?:export\s+\*\s+from|import\s+[^'"]*from)\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;
    let leadsToReal = false;

    while ((match = allImportExportPattern.exec(routeContent)) !== null) {
      const relPath = match[1];
      const candidates = [`${relPath}.tsx`, `${relPath}.ts`, `${relPath}/index.tsx`];
      for (const candidate of candidates) {
        const resolved = path.resolve(routeDir, candidate);
        if (path.resolve(resolved) === realResolved) {
          leadsToReal = true;
        }
      }
    }

    expect(
      leadsToReal,
      'Expected pages/evidence/index.tsx to import/re-export from ' +
        `components/evidence/EvidenceCollection.tsx (resolved: ${realResolved}).\n` +
        'Current route content:\n\n' +
        routeContent +
        '\n\nGAP-003: Update the route file to wire to the real EvidenceCollection component.',
    ).toBe(true);
  });
});
