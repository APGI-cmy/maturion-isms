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
    expect(src).toContain("supabase.functions.invoke('mmm-framework-compile',");
    expect(src).toContain("supabase.functions.invoke('mmm-framework-publish',");
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
  it('routes compile success to legacy framework workspace', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkReviewPage.tsx');
    expect(src).toContain('/assessment/framework');
    expect(src).toContain('window.location.assign');
    expect(src).toContain('framework_id=');
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
  it('requires framework_id before generation', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-generate/index.ts');
    expect(src).toContain('framework_id is required and must be a string');
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

// ─── T-MMM-S6-049: FrameworkUploadPage calls correct capabilities per mode ─────
describe('T-MMM-S6-049: FrameworkUploadPage calls correct capabilities per mode', () => {
  it('Mode A calls mmm-upload-framework-source', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain("supabase.functions.invoke('mmm-upload-framework-source',");
  });
  it('Mode A renders file picker input for source upload', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain('id="framework-source-file"');
    expect(src).toContain('type="file"');
  });
  it('Mode A sends FormData with file and source_type', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain('const formData = new FormData();');
    expect(src).toContain("formData.append('file', sourceFile);");
    expect(src).toContain("formData.append('source_type', 'VERBATIM');");
    expect(src).toContain('body: formData');
  });
  it('Mode A initializes framework with VERBATIM before upload invoke', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain("const frameworkId = await initFramework('Uploaded Framework', 'VERBATIM');");
    const initIndex = src.indexOf("const frameworkId = await initFramework('Uploaded Framework', 'VERBATIM');");
    const uploadIndex = src.indexOf("supabase.functions.invoke('mmm-upload-framework-source',");
    expect(initIndex).toBeGreaterThan(-1);
    expect(uploadIndex).toBeGreaterThan(-1);
    expect(initIndex).toBeLessThan(uploadIndex);
  });
  it('Mode B calls mmm-ai-framework-generate', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain("mode==='B'");
    expect(src).toContain("supabase.functions.invoke('mmm-framework-init',");
    expect(src).toContain("const frameworkId = await initFramework('New Framework', 'GENERATED');");
    expect(src).toContain("source_type: sourceType");
    expect(src).toContain("supabase.functions.invoke('mmm-ai-framework-generate',");
    expect(src).toContain('framework_id: frameworkId');
    expect(src).toContain("body: { name: 'New Framework', mode, framework_id: frameworkId }");
  });
  it('Mode C uploads hybrid source with framework context payload', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain("mode==='C'");
    expect(src).toContain("const frameworkId = await initFramework('Hybrid Framework', 'HYBRID');");
    expect(src).toContain("supabase.functions.invoke('mmm-upload-framework-source',");
    expect(src).toContain("formData.append('source_type', 'HYBRID');");
    expect(src).toContain('framework_id: frameworkId');
    expect(src).toContain("metadata', JSON.stringify({ source_type: 'HYBRID', mode, framework_id: frameworkId })");
  });
  it('renders visible failure state without unwired-backend placeholder copy', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkUploadPage.tsx');
    expect(src).toContain('upload-page__next-state-panel');
    expect(src).toContain('framework action right now');
    expect(src).not.toContain('Full backend workflow is not yet wired for this mode');
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

// ─── T-MMM-S6-051: AssessmentFrameworkHandoffPage.tsx exists ─────────────────
describe('T-MMM-S6-051: AssessmentFrameworkHandoffPage.tsx exists', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx')).toBe(true);
  });
  it('reads framework_id from query string', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('useSearchParams');
    expect(src).toContain("searchParams.get('framework_id')");
  });
  it('shows error state when framework_id is missing', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-missing-framework-id"');
    expect(src).toContain('No framework ID provided');
  });
  it('shows error state when framework is not found', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-framework-not-found"');
    expect(src).toContain('Framework not found');
  });
  it('renders visible workspace container', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-workspace"');
    expect(src).toContain('data-testid="handoff-framework-name"');
  });
  it('renders domains section', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-domains"');
  });
  it('queries mmm_frameworks for the resolved framework', () => {
    const src = readFile('apps/mmm/src/lib/useFrameworkHandoffContext.ts');
    expect(src).toContain("from('mmm_frameworks')");
  });
  it('queries mmm_domains for the framework domains', () => {
    const src = readFile('apps/mmm/src/lib/useFrameworkHandoffContext.ts');
    expect(src).toContain("from('mmm_domains')");
  });
});

// ─── T-MMM-S6-052: App.tsx registers /assessment/framework route ─────────────
describe('T-MMM-S6-052: App.tsx registers /assessment/framework route', () => {
  it('has /assessment/framework route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/assessment/framework"');
  });
  it('route is wrapped in ProtectedRoute', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    const routeIdx = src.indexOf('"/assessment/framework"');
    const surroundingCtx = src.slice(Math.max(0, routeIdx - 50), routeIdx + 200);
    expect(surroundingCtx).toContain('ProtectedRoute');
  });
  it('route uses AssessmentFrameworkHandoffPage', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('AssessmentFrameworkHandoffPage');
  });
});

// ─── T-MMM-S6-177: Compile success renders canonical five domain cards ─────────
describe('T-MMM-S6-177: Compile success renders canonical five domain cards', () => {
  it('AssessmentFrameworkHandoffPage renders visible workspace container', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-workspace"');
  });
  it('workspace renders framework name prominently', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-framework-name"');
  });
  it('canonical domain names are declared in an ordered array of 5', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('CANONICAL_DOMAIN_NAMES');
  });
  it('domain cards use data-testid="domain-card"', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="domain-card"');
  });
  it('verify-mmm-modes.mjs asserts visible workspace not just URL navigation', () => {
    const src = readFile('scripts/mmm-live-dashboard-diagnosis/verify-mmm-modes.mjs');
    expect(src).toContain('handoff-workspace');
    expect(src).toContain("state: 'visible'");
  });
});

// ─── T-MMM-S6-178: Raw harvested-domain-only list is a failing workspace state ─
describe('T-MMM-S6-178: Raw harvested-domain-only list is a failing workspace state', () => {
  it('canonical domain cards are present (not just raw harvested domain list)', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    // Canonical domain array drives the workspace — raw harvested-domain-only list is not the success state.
    expect(src).toContain('CANONICAL_DOMAIN_NAMES');
    expect(src).toContain('data-testid="domain-card"');
  });
  it('workspace renders domains section via canonical domain cards', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-domains"');
    // Canonical domain array (not a raw harvested list) powers the cards.
    expect(src).toContain('CANONICAL_DOMAIN_NAMES');
  });
  it('verify-mmm-modes.mjs asserts domain-card selector (canonical) exists', () => {
    const src = readFile('scripts/mmm-live-dashboard-diagnosis/verify-mmm-modes.mjs');
    // Script targets the canonical domain-card testid, not just any domain list.
    expect(src).toContain('domain-card');
  });
});

// ─── T-MMM-S6-179: All five canonical domain labels are present ───────────────
describe('T-MMM-S6-179: All five canonical domain labels are present', () => {
  it('contains Leadership and Governance', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('Leadership and Governance');
  });
  it('contains Process Integrity', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('Process Integrity');
  });
  it('contains People and Culture', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('People and Culture');
  });
  it('contains Protection', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('Protection');
  });
  it('contains Proof It Works', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('Proof It Works');
  });
});

// ─── T-MMM-S6-180: Each domain card exposes mini-dashboard structure ──────────
describe('T-MMM-S6-180: Each domain card exposes mini-dashboard structure', () => {
  it('domain-mps-count slot exists', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="domain-mps-count"');
  });
  it('domain-criteria-count slot exists', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="domain-criteria-count"');
  });
  it('domain-maturity-level slot exists', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="domain-maturity-level"');
  });
  it('domain-evidence-completion slot exists', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="domain-evidence-completion"');
  });
  it('domain-approval-status slot exists', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="domain-approval-status"');
  });
  it('domain-compile-status slot exists', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="domain-compile-status"');
  });
});

// ─── T-MMM-S6-181: Domain card click-through contract exists ──────────────────
describe('T-MMM-S6-181: Domain card click-through contract exists', () => {
  it('domain card contains link to /assessment/framework/domain/', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('/assessment/framework/domain/');
  });
  it('DomainWorkspacePage.tsx file exists', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toBeTruthy();
  });
  it('DomainWorkspacePage has data-testid="domain-workspace"', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toContain('data-testid="domain-workspace"');
  });
  it('DomainWorkspacePage declares downstream action: Compile MPSs', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toContain('Compile MPSs');
  });
  it('DomainWorkspacePage declares downstream action: Compile intent statements', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toContain('Compile intent statements');
  });
  it('DomainWorkspacePage declares downstream action: Compile criteria', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toContain('Compile criteria');
  });
  it('App.tsx registers /assessment/framework/domain/:domainId route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('/assessment/framework/domain/');
    expect(src).toContain('DomainWorkspacePage');
  });
  it('domain workspace route is behind ProtectedRoute', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('ProtectedRoute');
    expect(src).toContain('/assessment/framework/domain/');
  });
});

// ─── T-MMM-S6-182: Contextual navigation avoids generic framework-list loop ───
describe('T-MMM-S6-182: Contextual navigation avoids generic framework-list loop', () => {
  it('AssessmentFrameworkHandoffPage contains "Back to Review Framework"', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('Back to Review Framework');
  });
  it('AssessmentFrameworkHandoffPage passes domain_name query param in click-through path', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('domain_name');
    expect(src).toContain('encodeURIComponent(canonicalName)');
  });
  it('AssessmentFrameworkHandoffPage uses canonical slug (not placeholder-N) as route key', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('canonicalNameToSlug');
    expect(src).not.toContain('placeholder-${index}');
    expect(src).not.toContain('placeholder-${i}');
  });
  it('DomainWorkspacePage displays domainLabel (from domain_name param), not raw domainId', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toContain('domainLabel');
    expect(src).not.toContain('`Domain Workspace: ${domainId}`');
    expect(src).not.toContain(': ${domainId}');
  });
  it('DomainWorkspacePage reads domain_name from useSearchParams', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toContain('domain_name');
    expect(src).toContain('searchParams.get');
  });
});

// ─── T-MMM-S6-183: Compile handoff preserves framework_id workspace context ───
describe('T-MMM-S6-183: Compile handoff preserves framework_id workspace context', () => {
  it('page reads framework_id from query string', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('useSearchParams');
    expect(src).toContain("searchParams.get('framework_id')");
  });
  it('page queries mmm_frameworks using the resolved id', () => {
    const hookSrc = readFile('apps/mmm/src/lib/useFrameworkHandoffContext.ts');
    expect(hookSrc).toContain("from('mmm_frameworks')");
    expect(hookSrc).toContain('.select(');
  });
  it('framework query uses the extracted framework_id as filter', () => {
    const hookSrc = readFile('apps/mmm/src/lib/useFrameworkHandoffContext.ts');
    expect(hookSrc).toContain('.eq(');
    expect(hookSrc).toContain('frameworkId');
  });
  it('FrameworkReviewPage compile handler passes framework_id to handoff URL', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkReviewPage.tsx');
    expect(src).toContain('framework_id=');
    expect(src).toContain('/assessment/framework');
  });
  it('verify-mmm-modes.mjs checks visible workspace for compile handoff', () => {
    const src = readFile('scripts/mmm-live-dashboard-diagnosis/verify-mmm-modes.mjs');
    expect(src).toContain('handoff-workspace');
    expect(src).toContain("state: 'visible'");
    expect(src).toContain('waitFor(');
  });
  it('DomainWorkspacePage reads framework_id from useSearchParams', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toContain('useSearchParams');
    expect(src).toContain('framework_id');
  });
});

// ─── T-MMM-S6-184: Missing/invalid framework_id error states remain intact ────
describe('T-MMM-S6-184: Missing/invalid framework_id error states remain intact', () => {
  it('page renders explicit error for missing framework_id', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-missing-framework-id"');
  });
  it('missing framework_id error message is user-visible text', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('No framework ID provided');
  });
  it('missing framework_id renders recovery action (not blank page)', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-missing-framework-id"');
    expect(src).toContain('Back to Frameworks');
  });
  it('page renders explicit error for unresolvable framework_id', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-framework-not-found"');
  });
  it('framework not found error has user-facing message', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('Framework not found');
  });
  it('no blank render: page always shows workspace or explicit error state', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx');
    expect(src).toContain('data-testid="handoff-missing-framework-id"');
    expect(src).toContain('data-testid="handoff-framework-not-found"');
    expect(src).toContain('data-testid="handoff-workspace"');
  });
});

// ─── T-MMM-S6-185: MMM app has an explicit DomainAuditBuilder component ──────
// RED: forces ui-builder to introduce a DomainAuditBuilder-named component
// in the current MMM app, not just a generic DomainWorkspacePage-only solution.
describe('T-MMM-S6-185: MMM app has an explicit DomainAuditBuilder component', () => {
  it('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx exists', () => {
    expect(fileExists('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx')).toBe(true);
  });
  it('DomainAuditBuilder component is named DomainAuditBuilder (default or named export)', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    // Component must be declared/exported by name — not just mentioned in a comment or import.
    expect(src).toMatch(/export (default |const |function )DomainAuditBuilder/);
  });
  it('DomainAuditBuilder accepts a domainId prop (legacy parity)', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    expect(src).toContain('domainId');
  });
});

// ─── T-MMM-S6-186: DomainWorkspacePage delegates to DomainAuditBuilder ───────
// RED: forces DomainWorkspacePage to be a thin delegation shell, not the
// entire domain workflow implementation.
describe('T-MMM-S6-186: DomainWorkspacePage delegates to DomainAuditBuilder component', () => {
  it('DomainWorkspacePage imports DomainAuditBuilder', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toContain('DomainAuditBuilder');
  });
  it('DomainWorkspacePage renders <DomainAuditBuilder', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    expect(src).toContain('<DomainAuditBuilder');
  });
  it('DomainWorkspacePage passes domainId down to DomainAuditBuilder', () => {
    const src = readFile('apps/mmm/src/pages/DomainWorkspacePage.tsx');
    // Must forward domainId as an explicit prop on <DomainAuditBuilder.
    expect(src).toMatch(/<DomainAuditBuilder[^>]*domainId/);
  });
});

// ─── T-MMM-S6-187: MMM app useDomainAuditBuilder hook exists and is used ─────
// RED: forces ui-builder to introduce a current-app hook mirroring the
// legacy useDomainAuditBuilder contract.
describe('T-MMM-S6-187: MMM app useDomainAuditBuilder hook exists and is used', () => {
  it('apps/mmm/src/hooks/useDomainAuditBuilder.ts exists', () => {
    expect(fileExists('apps/mmm/src/hooks/useDomainAuditBuilder.ts')).toBe(true);
  });
  it('hook exports useDomainAuditBuilder', () => {
    const src = readFile('apps/mmm/src/hooks/useDomainAuditBuilder.ts');
    expect(src).toContain('useDomainAuditBuilder');
  });
  it('DomainAuditBuilder component imports useDomainAuditBuilder from the mmm hooks path', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    expect(src).toContain('useDomainAuditBuilder');
  });
});

// ─── T-MMM-S6-188: MMM app has explicit adaptation points for MPSSelectionModal,
//     IntentCreator and CriteriaManagement ──────────────────────────────────────
// RED: forces the structural presence of the three modal components that the
// legacy DomainAuditBuilder workflow depends on.
describe('T-MMM-S6-188: MMM app adaptation points for legacy modal components', () => {
  it('apps/mmm/src/components/assessment/MPSSelectionModal.tsx exists', () => {
    expect(fileExists('apps/mmm/src/components/assessment/MPSSelectionModal.tsx')).toBe(true);
  });
  it('apps/mmm/src/components/assessment/IntentCreator.tsx exists', () => {
    expect(fileExists('apps/mmm/src/components/assessment/IntentCreator.tsx')).toBe(true);
  });
  it('apps/mmm/src/components/assessment/CriteriaManagement.tsx exists', () => {
    expect(fileExists('apps/mmm/src/components/assessment/CriteriaManagement.tsx')).toBe(true);
  });
  it('DomainAuditBuilder component imports MPSSelectionModal', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    expect(src).toContain('MPSSelectionModal');
  });
  it('DomainAuditBuilder component imports IntentCreator', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    expect(src).toContain('IntentCreator');
  });
  it('DomainAuditBuilder component imports CriteriaManagement', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    expect(src).toContain('CriteriaManagement');
  });
});

// ─── T-MMM-S6-189: Legacy three-step model is preserved in MMM app ───────────
// RED: forces the current app DomainAuditBuilder to declare the three
// ordered steps from the legacy workflow, not a generic action list.
describe('T-MMM-S6-189: Legacy step model preserved — Create MPSs / Create Intent / Create Criteria', () => {
  it('DomainAuditBuilder contains step title "Create MPSs"', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    expect(src).toContain('Create MPSs');
  });
  it('DomainAuditBuilder contains step title "Create Intent"', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    expect(src).toContain('Create Intent');
  });
  it('DomainAuditBuilder contains step title "Create Criteria"', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    expect(src).toContain('Create Criteria');
  });
  it('step "Create MPSs" appears before "Create Intent" in source order', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    // Search for quoted/templated step titles as they appear in JSX/object literals.
    const mpssIdx = src.search(/'Create MPSs'|"Create MPSs"|`Create MPSs`/);
    const intentIdx = src.search(/'Create Intent'|"Create Intent"|`Create Intent`/);
    expect(mpssIdx).toBeGreaterThan(-1);
    expect(intentIdx).toBeGreaterThan(-1);
    expect(mpssIdx).toBeLessThan(intentIdx);
  });
  it('step "Create Intent" appears before "Create Criteria" in source order', () => {
    const src = readFile('apps/mmm/src/components/assessment/DomainAuditBuilder.tsx');
    const intentIdx = src.search(/'Create Intent'|"Create Intent"|`Create Intent`/);
    const criteriaIdx = src.search(/'Create Criteria'|"Create Criteria"|`Create Criteria`/);
    expect(intentIdx).toBeGreaterThan(-1);
    expect(criteriaIdx).toBeGreaterThan(-1);
    expect(intentIdx).toBeLessThan(criteriaIdx);
  });
  it('useDomainAuditBuilder hook exposes handleStepClick (step dispatch contract)', () => {
    const src = readFile('apps/mmm/src/hooks/useDomainAuditBuilder.ts');
    expect(src).toContain('handleStepClick');
  });
});
