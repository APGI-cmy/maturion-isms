/**
 * MMM Wave B6 — Findings & Reporting Tests
 * Domain D4: T-MMM-S6-081 through T-MMM-S6-097
 *
 * Wave Slug: mmm-build-wave-b6-findings
 * Issue: maturion-isms#1428
 * Builder: ui-builder
 * Date: 2026-04-22
 *
 * File-based tests: verify file existence, content patterns, and structural requirements.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '../../../..');

function readFile(relPath: string): string {
  const abs = resolve(ROOT, relPath);
  if (!existsSync(abs)) throw new Error(`File not found: ${relPath}`);
  return readFileSync(abs, 'utf-8');
}

function fileExists(relPath: string): boolean {
  return existsSync(resolve(ROOT, relPath));
}

// ─── T-MMM-S6-081: mmm-pit-export-send Edge Function exists ──────────────────
describe('T-MMM-S6-081: mmm-pit-export-send Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-pit-export-send/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-pit-export-send]');
  });
});

// ─── T-MMM-S6-082: mmm-pit-evidence-return Edge Function exists ──────────────
describe('T-MMM-S6-082: mmm-pit-evidence-return Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-pit-evidence-return/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-pit-evidence-return]');
  });
  it('creates mmm_evidence records', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('mmm_evidence');
  });
  it('returns received: true and evidence_count', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('received: true');
    expect(src).toContain('evidence_count');
  });
});

// ─── T-MMM-S6-083: mmm-ai-recommend Edge Function exists ─────────────────────
describe('T-MMM-S6-083: mmm-ai-recommend Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-recommend/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-recommend]');
  });
});

// ─── T-MMM-S6-084: FindingsPage.tsx exists ───────────────────────────────────
describe('T-MMM-S6-084: FindingsPage.tsx exists', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/FindingsPage.tsx')).toBe(true);
  });
  it('has h1 heading', () => {
    const src = readFile('apps/mmm/src/pages/FindingsPage.tsx');
    expect(src).toContain('<h1>');
  });
});

// ─── T-MMM-S6-085: ReportPage.tsx exists ─────────────────────────────────────
describe('T-MMM-S6-085: ReportPage.tsx exists', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/ReportPage.tsx')).toBe(true);
  });
  it('has Maturity Report heading', () => {
    const src = readFile('apps/mmm/src/pages/ReportPage.tsx');
    expect(src).toContain('Maturity Report');
  });
  it('has Export PDF button', () => {
    const src = readFile('apps/mmm/src/pages/ReportPage.tsx');
    expect(src).toContain('Export PDF');
  });
});

// ─── T-MMM-S6-086: DashboardPage.tsx exists ──────────────────────────────────
describe('T-MMM-S6-086: DashboardPage.tsx exists', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/DashboardPage.tsx')).toBe(true);
  });
  it('has Maturity Dashboard heading', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('Maturity Dashboard');
  });
});

// ─── T-MMM-S6-087: PitExportPage.tsx exists ──────────────────────────────────
describe('T-MMM-S6-087: PitExportPage.tsx exists', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/PitExportPage.tsx')).toBe(true);
  });
  it('has PIT Export heading', () => {
    const src = readFile('apps/mmm/src/pages/PitExportPage.tsx');
    expect(src).toContain('PIT Export');
  });
  it('calls send endpoint', () => {
    const src = readFile('apps/mmm/src/pages/PitExportPage.tsx');
    expect(src).toContain('/send');
  });
});

// ─── T-MMM-S6-088: mmm-pit-export-send implements 7-step handshake ───────────
describe('T-MMM-S6-088: mmm-pit-export-send implements 7-step handshake', () => {
  it('has Step 1 comment (validate export record)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('Step 1');
  });
  it('has Step 2 comment (serialize findings)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('Step 2');
  });
  it('has Step 3 comment (sign payload)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('Step 3');
  });
  it('has Step 4 comment (POST to PIT endpoint)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('Step 4');
  });
  it('has Step 5 comment (record pit_task_id)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('Step 5');
  });
  it('has Step 6 comment (set status=SENT)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('Step 6');
  });
  it('has Step 7 comment (log to audit)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('Step 7');
  });
});

// ─── T-MMM-S6-089: mmm-pit-export-send logs PIT_EXPORT_SENT ──────────────────
describe('T-MMM-S6-089: mmm-pit-export-send logs PIT_EXPORT_SENT to mmm_audit_logs', () => {
  it('inserts PIT_EXPORT_SENT to mmm_audit_logs', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('PIT_EXPORT_SENT');
    expect(src).toContain('mmm_audit_logs');
  });
});

// ─── T-MMM-S6-090: mmm-pit-export-send returns HTTP 403 without ADMIN ────────
describe('T-MMM-S6-090: mmm-pit-export-send returns HTTP 403 without ADMIN/FRAMEWORK_OWNER (NBR-002)', () => {
  it('requires ADMIN or FRAMEWORK_OWNER role', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain("requireRole(claims.role, ['ADMIN', 'FRAMEWORK_OWNER'])");
  });
  it('has NBR-002 comment', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('NBR-002');
  });
});

// ─── T-MMM-S6-091: PitExportPage invalidates ['pit-exports', exportId] ───────
describe("T-MMM-S6-091: PitExportPage invalidates ['pit-exports', exportId] on success (NBR-001)", () => {
  it("invalidates ['pit-exports', exportId]", () => {
    const src = readFile('apps/mmm/src/pages/PitExportPage.tsx');
    expect(src).toContain("queryKey: ['pit-exports', exportId]");
  });
  it('has NBR-001 comment', () => {
    const src = readFile('apps/mmm/src/pages/PitExportPage.tsx');
    expect(src).toContain('NBR-001');
  });
});

// ─── T-MMM-S6-092: DashboardPage queries /api/qiw/status ─────────────────────
describe('T-MMM-S6-092: DashboardPage queries /api/qiw/status', () => {
  it('fetches /api/qiw/status', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('/api/qiw/status');
  });
  it('uses dashboard query key', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain("queryKey: ['dashboard']");
  });
});

// ─── T-MMM-S6-093: DashboardPage uses staleTime for performance (TR-005) ─────
describe('T-MMM-S6-093: DashboardPage uses staleTime for performance (TR-005)', () => {
  it('has staleTime: 30_000 comment for TR-005', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('staleTime: 30_000');
    expect(src).toContain('TR-005');
  });
});

// ─── T-MMM-S6-094: FindingsPage queries mmm_findings table ───────────────────
describe('T-MMM-S6-094: FindingsPage queries mmm_findings table', () => {
  it('queries mmm_findings', () => {
    const src = readFile('apps/mmm/src/pages/FindingsPage.tsx');
    expect(src).toContain('mmm_findings');
  });
  it('orders by maturity_position', () => {
    const src = readFile('apps/mmm/src/pages/FindingsPage.tsx');
    expect(src).toContain('maturity_position');
  });
  it('has findings query key', () => {
    const src = readFile('apps/mmm/src/pages/FindingsPage.tsx');
    expect(src).toContain("queryKey: ['findings']");
  });
});

// ─── T-MMM-S6-095: ReportPage queries mmm_maturity_scores by DOMAIN ──────────
describe('T-MMM-S6-095: ReportPage queries mmm_maturity_scores by DOMAIN entity_type', () => {
  it('queries mmm_maturity_scores', () => {
    const src = readFile('apps/mmm/src/pages/ReportPage.tsx');
    expect(src).toContain('mmm_maturity_scores');
  });
  it("filters by entity_type = 'DOMAIN'", () => {
    const src = readFile('apps/mmm/src/pages/ReportPage.tsx');
    expect(src).toContain("'DOMAIN'");
  });
  it('has report-scores query key', () => {
    const src = readFile('apps/mmm/src/pages/ReportPage.tsx');
    expect(src).toContain("queryKey: ['report-scores'");
  });
});

// ─── T-MMM-S6-096: App.tsx has routes for /findings, /reports, /dashboard, /pit-export
describe('T-MMM-S6-096: App.tsx has routes for /findings, /reports/:assessmentId, /dashboard, /pit-export/:id', () => {
  it('has /findings route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/findings"');
  });
  it('has /reports/:assessmentId route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/reports/:assessmentId"');
  });
  it('has /dashboard route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/dashboard"');
  });
  it('has /pit-export/:id route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/pit-export/:id"');
  });
});

// ─── T-MMM-S6-097: mmm-ai-recommend is a stub (returns mock recommendations) ─
describe('T-MMM-S6-097: mmm-ai-recommend is a stub (returns mock recommendations)', () => {
  it('has AIMC_BASE_URL stub comment', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toContain('AIMC_BASE_URL');
  });
  it('returns recommendations array', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toContain('recommendations');
  });
  it('includes domain, gap_to_next, recommendation_text fields', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toContain('domain');
    expect(src).toContain('gap_to_next');
    expect(src).toContain('recommendation_text');
  });
  it('is marked as stub for B6', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toContain('stub');
  });
});

// ─── T-MMM-S6-177: DashboardPage renders app shell/nav links (post-login navigation) ────────────
// Issue: maturion-isms#1535 — post-login dashboard UI completeness fix
// Oversight recorded: login discoverability + post-login dashboard completeness
describe('T-MMM-S6-177: DashboardPage renders app shell/nav with post-login workflow links', () => {
  it('renders app shell header element', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('app-shell__header');
  });
  it('has app nav element', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('app-nav');
  });
  it('has link to /dashboard', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('to="/dashboard"');
  });
  it('has link to /frameworks', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('to="/frameworks"');
  });
  it('has link to /frameworks/upload', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('to="/frameworks/upload"');
  });
  it('has link to /onboarding', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('to="/onboarding"');
  });
  it('imports Link from react-router-dom', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain("from 'react-router-dom'");
    expect(src).toContain('Link');
  });
});

// ─── T-MMM-S6-178: DashboardPage renders useful empty state when data is absent ─────────────────
// Oversight: empty production state must not show blank labels (post-login dashboard completeness)
describe('T-MMM-S6-178: DashboardPage renders useful empty state when dashboard data is absent', () => {
  it('has dashboard-empty-state element', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('dashboard-empty-state');
  });
  it('empty state communicates that no source-pack data has been uploaded', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('No framework source-pack data has been uploaded yet');
  });
  it('empty state includes CTA link to /frameworks/upload', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    // CTA must be inside the empty state block; locate the block boundaries defensively
    const emptyStateStart = src.indexOf('dashboard-empty-state');
    const emptyStateEnd = src.indexOf('dashboard-empty-state__body');
    expect(emptyStateStart).toBeGreaterThan(-1);
    // The upload CTA (data-testid="dashboard-upload-cta") must follow the empty state heading/body
    const afterEmptyState = src.slice(emptyStateStart);
    expect(afterEmptyState).toContain('dashboard-upload-cta');
    expect(afterEmptyState).toContain('to="/frameworks/upload"');
    expect(emptyStateEnd).toBeGreaterThan(emptyStateStart);
  });
  it('checks for empty pipeline before rendering content', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('hasData');
  });
});

// ─── T-MMM-S6-179: DashboardPage renders explicit error/permission error state ───────────────────
// Oversight: dashboard did not distinguish permission failure, API failure, or malformed response
describe('T-MMM-S6-179: DashboardPage renders explicit error state on /api/qiw/status failure', () => {
  it('checks HTTP response status before calling res.json()', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('res.status');
    expect(src).toContain('res.ok');
  });
  it('handles 403 permission error distinctly', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('403');
    expect(src).toContain('dashboard-permission-error');
  });
  it('renders error alert for non-success responses', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('dashboard-error');
    expect(src).toContain('alert-error');
  });
  it('uses isError state from useQuery', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('isError');
  });
  it('renders permission message guiding user to contact admin', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('ADMIN or LEAD_AUDITOR');
  });
});

// ─── T-MMM-S6-180: DashboardPage includes CTA to /frameworks/upload ──────────────────────────────
// Oversight: post-login UI must guide user to the next operational workflow step
describe('T-MMM-S6-180: DashboardPage includes CTA to /frameworks/upload (next-step workflow guidance)', () => {
  it('has Upload Framework Source-Pack CTA text', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('Upload Framework Source-Pack');
  });
  it('dashboard-actions section has links to /frameworks/upload and /frameworks', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('dashboard-actions');
  });
  it('dashboard-upload-cta data-testid present', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('dashboard-upload-cta');
  });
});
