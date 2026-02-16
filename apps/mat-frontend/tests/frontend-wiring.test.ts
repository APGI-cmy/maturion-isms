/**
 * MAT Frontend QA-to-Red Test Suite — CAT-FE-02: Frontend Application Wiring
 *
 * QA-to-Red: Tests define expected behavior for FR-071 (Frontend Wiring & Completeness).
 * Status at creation: RED — frontend application wiring not yet implemented.
 *
 * FRS: FR-071 (Frontend Application Wiring and Completeness)
 * TRS: TR-001, TR-033, TR-047
 * Registry: governance/TEST_REGISTRY.json
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const APP_ROOT = resolve(__dirname, '..');
const SRC_DIR = resolve(APP_ROOT, 'src');

describe('CAT-FE-02: frontend application wiring (FR-071)', () => {
  it('MAT-FE-T-009: Route definitions exist for all major sections', () => {
    // FRS: FR-071 AC-1
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — routes not yet created

    // Check for a router configuration file
    const routerCandidates = [
      resolve(SRC_DIR, 'router.tsx'),
      resolve(SRC_DIR, 'routes.tsx'),
      resolve(SRC_DIR, 'App.tsx'),
    ];
    const routerExists = routerCandidates.some((p) => existsSync(p));
    expect(routerExists).toBe(true);
  });

  it('MAT-FE-T-010: Audit management page exists', () => {
    // FRS: FR-071 AC-1 (audit management)
    // FRS: FR-001, FR-002, FR-003
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — page not yet created

    const pageCandidates = [
      resolve(SRC_DIR, 'pages/audits'),
      resolve(SRC_DIR, 'pages/audit'),
      resolve(SRC_DIR, 'pages/AuditManagement.tsx'),
      resolve(SRC_DIR, 'modules/audit'),
    ];
    const pageExists = pageCandidates.some((p) => existsSync(p));
    expect(pageExists).toBe(true);
  });

  it('MAT-FE-T-011: Criteria management page exists', () => {
    // FRS: FR-071 AC-1 (criteria management)
    // FRS: FR-004, FR-005, FR-008, FR-010
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — page not yet created

    const pageCandidates = [
      resolve(SRC_DIR, 'pages/criteria'),
      resolve(SRC_DIR, 'pages/CriteriaManagement.tsx'),
      resolve(SRC_DIR, 'modules/criteria'),
    ];
    const pageExists = pageCandidates.some((p) => existsSync(p));
    expect(pageExists).toBe(true);
  });

  it('MAT-FE-T-012: Evidence collection page exists', () => {
    // FRS: FR-071 AC-1 (evidence collection)
    // FRS: FR-013 through FR-022
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — page not yet created

    const pageCandidates = [
      resolve(SRC_DIR, 'pages/evidence'),
      resolve(SRC_DIR, 'pages/EvidenceCollection.tsx'),
      resolve(SRC_DIR, 'modules/evidence'),
    ];
    const pageExists = pageCandidates.some((p) => existsSync(p));
    expect(pageExists).toBe(true);
  });

  it('MAT-FE-T-013: AI scoring review page exists', () => {
    // FRS: FR-071 AC-1 (AI scoring review)
    // FRS: FR-023 through FR-032
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — page not yet created

    const pageCandidates = [
      resolve(SRC_DIR, 'pages/scoring'),
      resolve(SRC_DIR, 'pages/AIScoring.tsx'),
      resolve(SRC_DIR, 'modules/scoring'),
    ];
    const pageExists = pageCandidates.some((p) => existsSync(p));
    expect(pageExists).toBe(true);
  });

  it('MAT-FE-T-014: Dashboard page exists', () => {
    // FRS: FR-071 AC-1 (dashboards)
    // FRS: FR-039 through FR-042
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — page not yet created

    const pageCandidates = [
      resolve(SRC_DIR, 'pages/dashboard'),
      resolve(SRC_DIR, 'pages/Dashboard.tsx'),
      resolve(SRC_DIR, 'modules/dashboard'),
    ];
    const pageExists = pageCandidates.some((p) => existsSync(p));
    expect(pageExists).toBe(true);
  });

  it('MAT-FE-T-015: Report generation page exists', () => {
    // FRS: FR-071 AC-1 (report generation)
    // FRS: FR-035 through FR-038
    // TRS: TR-047
    // Type: structural | Priority: P0
    // Status: RED — page not yet created

    const pageCandidates = [
      resolve(SRC_DIR, 'pages/reports'),
      resolve(SRC_DIR, 'pages/ReportGeneration.tsx'),
      resolve(SRC_DIR, 'modules/reports'),
    ];
    const pageExists = pageCandidates.some((p) => existsSync(p));
    expect(pageExists).toBe(true);
  });

  it('MAT-FE-T-016: Navigation component exists (sidebar or top nav)', () => {
    // FRS: FR-071 AC-3
    // TRS: TR-047, TR-033
    // Type: structural | Priority: P0
    // Status: RED — navigation not yet implemented

    const navCandidates = [
      resolve(SRC_DIR, 'components/Navigation.tsx'),
      resolve(SRC_DIR, 'components/Sidebar.tsx'),
      resolve(SRC_DIR, 'components/Layout.tsx'),
      resolve(SRC_DIR, 'components/AppShell.tsx'),
      resolve(SRC_DIR, 'components/layout'),
    ];
    const navExists = navCandidates.some((p) => existsSync(p));
    expect(navExists).toBe(true);
  });

  it('MAT-FE-T-017: PWA manifest registered', () => {
    // FRS: FR-071 AC-5
    // FRS: FR-063
    // TRS: TR-036
    // Type: structural | Priority: P1
    // Status: RED — PWA not yet configured

    const manifestCandidates = [
      resolve(APP_ROOT, 'public/manifest.json'),
      resolve(APP_ROOT, 'public/manifest.webmanifest'),
    ];
    const manifestExists = manifestCandidates.some((p) => existsSync(p));
    expect(manifestExists).toBe(true);
  });

  it('MAT-FE-T-018: Service worker registered', () => {
    // FRS: FR-071 AC-5
    // FRS: FR-063, FR-047
    // TRS: TR-036, TR-046
    // Type: structural | Priority: P1
    // Status: RED — service worker not yet created

    const swCandidates = [
      resolve(APP_ROOT, 'public/sw.js'),
      resolve(APP_ROOT, 'public/service-worker.js'),
      resolve(SRC_DIR, 'sw.ts'),
      resolve(SRC_DIR, 'service-worker.ts'),
    ];
    const swExists = swCandidates.some((p) => existsSync(p));
    expect(swExists).toBe(true);
  });
});
