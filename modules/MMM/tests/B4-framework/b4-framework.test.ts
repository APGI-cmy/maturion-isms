/**
 * MMM Wave B4 — Framework Lifecycle Tests
 * Domain D2: T-MMM-S6-021 through T-MMM-S6-050
 *
 * Wave Slug: mmm-build-wave-b4-framework
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

// ─── T-MMM-S6-021: mmm-framework-compile Edge Function exists ─────────────────
describe('T-MMM-S6-021: mmm-framework-compile Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-framework-compile/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-framework-compile]');
  });
});

// ─── T-MMM-S6-022: mmm-framework-publish Edge Function exists ─────────────────
describe('T-MMM-S6-022: mmm-framework-publish Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-framework-publish/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-framework-publish]');
  });
});

// ─── T-MMM-S6-023: mmm-upload-framework-source Edge Function exists ──────────
describe('T-MMM-S6-023: mmm-upload-framework-source Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-upload-framework-source/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-upload-framework-source]');
  });
});

// ─── T-MMM-S6-024: mmm-ai-framework-parse Edge Function exists ───────────────
describe('T-MMM-S6-024: mmm-ai-framework-parse Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-framework-parse/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-framework-parse]');
  });
});

// ─── T-MMM-S6-025: mmm-ai-framework-generate Edge Function exists ────────────
describe('T-MMM-S6-025: mmm-ai-framework-generate Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-framework-generate/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-framework-generate]');
  });
});

// ─── T-MMM-S6-026: mmm-ai-framework-alter Edge Function exists ───────────────
describe('T-MMM-S6-026: mmm-ai-framework-alter Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-framework-alter/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-framework-alter]');
  });
});

// ─── T-MMM-S6-027: FrameworkListPage.tsx exists ──────────────────────────────
describe('T-MMM-S6-027: FrameworkListPage.tsx exists', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/FrameworkListPage.tsx')).toBe(true);
  });
  it('queries mmm_frameworks', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkListPage.tsx');
    expect(src).toContain('mmm_frameworks');
  });
  it('has frameworks query key', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkListPage.tsx');
    expect(src).toContain("queryKey: ['frameworks']");
  });
});

// ─── T-MMM-S6-028: FrameworkUploadPage.tsx has 3 mode options ────────────────
describe('T-MMM-S6-028: FrameworkUploadPage.tsx has 3 mode options', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/FrameworkUploadPage.tsx')).toBe(true);
  });
  it('has Mode A (upload)', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain("mode==='A'");
  });
  it('has Mode B (AI generate)', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain("mode==='B'");
  });
  it('has Mode C (hybrid)', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain("mode==='C'");
  });
});

// ─── T-MMM-S6-029: FrameworkReviewPage.tsx has compile and publish buttons ───
describe('T-MMM-S6-029: FrameworkReviewPage.tsx has compile and publish buttons', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/FrameworkReviewPage.tsx')).toBe(true);
  });
  it('has Compile button', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkReviewPage.tsx');
    expect(src).toContain('Compile');
  });
  it('has Publish button', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkReviewPage.tsx');
    expect(src).toContain('Publish');
  });
  it('calls compile and publish API endpoints', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkReviewPage.tsx');
    expect(src).toContain('/compile');
    expect(src).toContain('/publish');
  });
});

// ─── T-MMM-S6-030: mmm-framework-compile validates hierarchy ─────────────────
describe('T-MMM-S6-030: mmm-framework-compile validates hierarchy (min 1 MPS per domain)', () => {
  it('checks for min 1 MPS per domain', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('has no Maturity Process Steps');
  });
  it('checks for min 1 criterion per MPS', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('has no criteria');
  });
  it('returns 400 on validation failure', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('}, 400)');
  });
});

// ─── T-MMM-S6-031: mmm-framework-publish checks REVIEW status ────────────────
describe('T-MMM-S6-031: mmm-framework-publish checks REVIEW status before publishing', () => {
  it('validates REVIEW status', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain("!== 'REVIEW'");
  });
  it('sets status to PUBLISHED', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain("'PUBLISHED'");
  });
  it('increments version', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('version');
    expect(src).toContain('+ 1');
  });
});

// ─── T-MMM-S6-032: mmm-framework-publish returns HTTP 403 without ADMIN ─────
describe('T-MMM-S6-032: mmm-framework-publish returns HTTP 403 without ADMIN (NBR-002)', () => {
  it('uses requireRole with ADMIN', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain("requireRole(claims.role, ['ADMIN'])");
  });
  it('has NBR-002 comment', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('NBR-002');
  });
});

// ─── T-MMM-S6-033: mmm-framework-publish logs FRAMEWORK_PUBLISH ──────────────
describe('T-MMM-S6-033: mmm-framework-publish logs FRAMEWORK_PUBLISH to audit_logs', () => {
  it('inserts FRAMEWORK_PUBLISH action', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('FRAMEWORK_PUBLISH');
  });
  it('writes to mmm_audit_logs', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('mmm_audit_logs');
  });
});

// ─── T-MMM-S6-034: mmm-ai-framework-parse is a stub (AIMC_BASE_URL comment) ──
describe('T-MMM-S6-034: mmm-ai-framework-parse is a stub (AIMC_BASE_URL comment present)', () => {
  it('has AIMC_BASE_URL comment', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toContain('AIMC_BASE_URL');
  });
  it('is marked as stub for B4', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toContain('stub');
  });
  it('updates parse job to COMPLETE', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toContain("'COMPLETE'");
  });
});

// ─── T-MMM-S6-035: FrameworkReviewPage invalidates ['frameworks', id] on compile
describe("T-MMM-S6-035: FrameworkReviewPage invalidates ['frameworks', id] on compile (NBR-001)", () => {
  it("invalidates ['frameworks', id] on compile", () => {
    const src = readFile('apps/mmm/src/pages/FrameworkReviewPage.tsx');
    expect(src).toContain("queryKey: ['frameworks', id]");
  });
  it("invalidates ['domains', id] on compile (NBR-001)", () => {
    const src = readFile('apps/mmm/src/pages/FrameworkReviewPage.tsx');
    expect(src).toContain("queryKey: ['domains', id]");
  });
});

// ─── T-MMM-S6-036: FrameworkReviewPage invalidates ['frameworks'] on publish ─
describe("T-MMM-S6-036: FrameworkReviewPage invalidates ['frameworks'] on publish (NBR-001)", () => {
  it("invalidates ['frameworks'] on publish", () => {
    const src = readFile('apps/mmm/src/pages/FrameworkReviewPage.tsx');
    expect(src).toContain("queryKey: ['frameworks']");
  });
  it('has NBR-001 comments', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkReviewPage.tsx');
    expect(src).toContain('NBR-001');
  });
});

// ─── T-MMM-S6-037: App.tsx has routes for /frameworks and /frameworks/upload ─
describe('T-MMM-S6-037: App.tsx has routes for /frameworks and /frameworks/upload', () => {
  it('has /frameworks route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/frameworks"');
  });
  it('has /frameworks/upload route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/frameworks/upload"');
  });
  it('has /frameworks/:id/review route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/frameworks/:id/review"');
  });
});

// ─── T-MMM-S6-038: mmm-upload-framework-source creates mmm_parse_jobs record ─
describe('T-MMM-S6-038: mmm-upload-framework-source creates mmm_parse_jobs record', () => {
  it('inserts into mmm_parse_jobs', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('mmm_parse_jobs');
  });
  it('sets status=PENDING', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain("status: 'PENDING'");
  });
  it('returns parse_job_id', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('parse_job_id');
  });
});

// ─── T-MMM-S6-039: mmm-framework-compile auto-assigns codes ──────────────────
describe('T-MMM-S6-039: mmm-framework-compile auto-assigns codes', () => {
  it('auto-assigns domain codes (D001)', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('D${padNum');
  });
  it('auto-assigns MPS codes (D001.MPS001)', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('MPS${padNum');
  });
  it('auto-assigns criterion codes (D001.MPS001.C001)', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('C${padNum');
  });
});

// ─── T-MMM-S6-040: mmm-framework-compile writes to mmm_domains (canonical) ───
describe('T-MMM-S6-040: mmm-framework-compile writes to mmm_domains (canonical)', () => {
  it('inserts into mmm_domains', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('mmm_domains');
  });
  it('inserts into mmm_maturity_process_steps', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('mmm_maturity_process_steps');
  });
  it('inserts into mmm_criteria', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('mmm_criteria');
  });
  it('updates framework status to REVIEW', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain("status: 'REVIEW'");
  });
});

// ─── T-MMM-S6-041: NBR-001 comments present in B4 edge functions ─────────────
describe('T-MMM-S6-041: NBR-001 comments present in B4 edge functions', () => {
  it('mmm-framework-compile has NBR-001', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('NBR-001');
  });
  it('mmm-framework-publish has NBR-001', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('NBR-001');
  });
  it('mmm-upload-framework-source has NBR-001', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('NBR-001');
  });
});

// ─── T-MMM-S6-042: mmm-ai-framework-generate returns proposed_domains count ───
describe('T-MMM-S6-042: mmm-ai-framework-generate returns proposed_domains count', () => {
  it('returns proposed_domains count', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-generate/index.ts');
    expect(src).toContain('proposed_domains');
  });
  it('creates proposed domain records', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-generate/index.ts');
    expect(src).toContain('mmm_proposed_domains');
  });
});

// ─── T-MMM-S6-043: mmm-ai-framework-alter returns { updated: true } ──────────
describe('T-MMM-S6-043: mmm-ai-framework-alter returns { updated: true }', () => {
  it('returns updated: true', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-alter/index.ts');
    expect(src).toContain('updated: true');
  });
  it('can update proposed domains', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-alter/index.ts');
    expect(src).toContain('mmm_proposed_domains');
  });
});

// ─── T-MMM-S6-044: FrameworkListPage is wrapped in ProtectedRoute ────────────
describe('T-MMM-S6-044: FrameworkListPage is wrapped in ProtectedRoute', () => {
  it('App.tsx wraps /frameworks in ProtectedRoute', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('ProtectedRoute');
    expect(src).toContain('FrameworkListPage');
  });
});

// ─── T-MMM-S6-045: apps/mmm/package.json exists with correct dependencies ────
describe('T-MMM-S6-045: apps/mmm/package.json exists with correct dependencies', () => {
  it('package.json exists', () => {
    expect(fileExists('apps/mmm/package.json')).toBe(true);
  });
  it('has @tanstack/react-query dependency', () => {
    const pkg = JSON.parse(readFile('apps/mmm/package.json'));
    expect(pkg.dependencies['@tanstack/react-query']).toBeDefined();
  });
  it('has zustand dependency', () => {
    const pkg = JSON.parse(readFile('apps/mmm/package.json'));
    expect(pkg.dependencies['zustand']).toBeDefined();
  });
  it('has react-router-dom dependency', () => {
    const pkg = JSON.parse(readFile('apps/mmm/package.json'));
    expect(pkg.dependencies['react-router-dom']).toBeDefined();
  });
});

// ─── T-MMM-S6-046: apps/mmm/vite.config.ts exists ───────────────────────────
describe('T-MMM-S6-046: apps/mmm/vite.config.ts exists', () => {
  it('vite.config.ts exists', () => {
    expect(fileExists('apps/mmm/vite.config.ts')).toBe(true);
  });
  it('uses @vitejs/plugin-react', () => {
    const src = readFile('apps/mmm/vite.config.ts');
    expect(src).toContain('@vitejs/plugin-react');
  });
});

// ─── T-MMM-S6-047: apps/mmm/tsconfig.json exists with correct settings ───────
describe('T-MMM-S6-047: apps/mmm/tsconfig.json exists with correct settings', () => {
  it('tsconfig.json exists', () => {
    expect(fileExists('apps/mmm/tsconfig.json')).toBe(true);
  });
  it('has jsx: react-jsx', () => {
    const cfg = JSON.parse(readFile('apps/mmm/tsconfig.json'));
    expect(cfg.compilerOptions.jsx).toBe('react-jsx');
  });
  it('has strict mode enabled', () => {
    const cfg = JSON.parse(readFile('apps/mmm/tsconfig.json'));
    expect(cfg.compilerOptions.strict).toBe(true);
  });
});

// ─── T-MMM-S6-048: apps/mmm/index.html exists ────────────────────────────────
describe('T-MMM-S6-048: apps/mmm/index.html exists', () => {
  it('index.html exists', () => {
    expect(fileExists('apps/mmm/index.html')).toBe(true);
  });
  it('has root div', () => {
    const src = readFile('apps/mmm/index.html');
    expect(src).toContain('id="root"');
  });
  it('references main.tsx', () => {
    const src = readFile('apps/mmm/index.html');
    expect(src).toContain('/src/main.tsx');
  });
});

// ─── T-MMM-S6-049: FrameworkUploadPage calls correct endpoints per mode ───────
describe('T-MMM-S6-049: FrameworkUploadPage calls correct endpoints per mode', () => {
  it('Mode A calls /api/upload/framework-source', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain('/api/upload/framework-source');
  });
  it('Mode B calls /api/ai/framework-generate', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain('/api/ai/framework-generate');
  });
});

// ─── T-MMM-S6-050: mmm-framework-compile returns compiled counts ──────────────
describe('T-MMM-S6-050: mmm-framework-compile returns compiled counts', () => {
  it('returns compiled_domains', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('compiled_domains');
  });
  it('returns compiled_mps', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('compiled_mps');
  });
  it('returns compiled_criteria', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('compiled_criteria');
  });
});
