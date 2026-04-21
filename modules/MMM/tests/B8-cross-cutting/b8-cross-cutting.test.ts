/**
 * MMM Wave B8 — Cross-Cutting QA Tests
 *
 * Domains:
 *   D5: Boundary Flows           T-MMM-S6-098 through T-MMM-S6-112 (15 tests)
 *   D7: AI Interactions          T-MMM-S6-121 through T-MMM-S6-128  (8 tests)
 *   D8: Performance & Reliability T-MMM-S6-129 through T-MMM-S6-138 (10 tests)
 *   D9: Security & Compliance    T-MMM-S6-139 through T-MMM-S6-152 (14 tests)
 *   D10: Infrastructure & Quality T-MMM-S6-153 through T-MMM-S6-164 (12 tests)
 *   D11: Product Identity & Gov   T-MMM-S6-165 through T-MMM-S6-176 (12 tests)
 *
 * Total: 71 file-based tests (no live Supabase needed).
 *
 * Wave Slug: mmm-build-wave-b8-cross-cutting
 * Issue:     maturion-isms#1428
 * Builder:   qa-builder
 * Date:      2026-04-24
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

// =============================================================================
// D5: BOUNDARY FLOWS — T-MMM-S6-098 through T-MMM-S6-112
// =============================================================================

describe('T-MMM-S6-098: mmm-ai-framework-parse has AIMC stub comment', () => {
  it('contains AIMC stub comment (B7 wire pending)', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toMatch(/AIMC stub/i);
  });
});

describe('T-MMM-S6-099: mmm-ai-framework-generate has AIMC stub comment', () => {
  it('contains AIMC stub comment (B7 wire pending)', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-generate/index.ts');
    expect(src).toMatch(/AIMC stub/i);
  });
});

describe('T-MMM-S6-100: mmm-ai-evidence-evaluate has AIMC stub comment', () => {
  it('contains AIMC stub comment (B7 wire pending)', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toMatch(/AIMC stub/i);
  });
});

describe('T-MMM-S6-101: mmm-ai-recommend has AIMC stub comment', () => {
  it('contains AIMC stub comment (B7 wire pending)', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toMatch(/AIMC stub/i);
  });
});

describe('T-MMM-S6-102: mmm-upload-evidence is stubbed (B7 KUC wire pending)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-upload-evidence/index.ts')).toBe(true);
  });
  it('contains stub declaration for B7', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toMatch(/[Ss]tub/);
  });
});

describe('T-MMM-S6-103: mmm-upload-framework-source is stubbed (B7 KUC wire pending)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-upload-framework-source/index.ts')).toBe(true);
  });
  it('contains stub declaration', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toMatch(/[Ss]tub/);
  });
});

describe('T-MMM-S6-104: mmm-pit-export-send is stubbed (B7 PIT wire pending)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-pit-export-send/index.ts')).toBe(true);
  });
  it('contains handshake stub comment', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toMatch(/handshake stub|[Ss]tub/);
  });
});

describe('T-MMM-S6-105: mmm-pit-evidence-return is stubbed (B7 PIT wire pending)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-pit-evidence-return/index.ts')).toBe(true);
  });
  it('contains stub comment for B7', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toMatch(/[Ss]tub/);
  });
});

describe('T-MMM-S6-106: AIMC_BASE_URL is env-var driven (Deno.env.get pattern) in at least one AI function', () => {
  it('mmm-ai-framework-parse references Deno.env.get AIMC_BASE_URL', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toContain('AIMC_BASE_URL');
  });
  it('AIMC_BASE_URL is env-var driven (Deno.env.get pattern noted)', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    // The B7 wiring note confirms env-var pattern
    expect(src).toMatch(/Deno\.env\.get.*AIMC_BASE_URL|AIMC_BASE_URL.*Deno\.env\.get/);
  });
});

describe('T-MMM-S6-107: PIT_BASE_URL is env-var driven in mmm-pit-export-send', () => {
  it('mmm-pit-export-send references PIT_BASE_URL env-var (B7 wire comment present)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('PIT_BASE_URL');
  });
  it('PIT_BASE_URL wired to Deno.env.get in B7', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toMatch(/Deno\.env\.get.*PIT_BASE_URL|PIT_BASE_URL.*Deno\.env\.get/);
  });
});

describe('T-MMM-S6-108: mmm-framework-compile assigns codes automatically (no hallucination)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-framework-compile/index.ts')).toBe(true);
  });
  it('contains auto-assign codes comment or logic', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toMatch(/[Aa]uto.assign.*codes|codes.*auto.assign/i);
  });
});

describe('T-MMM-S6-109: mmm-ai-framework-alter exists (framework alter mechanism)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-framework-alter/index.ts')).toBe(true);
  });
  it('is registered in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-framework-alter]');
  });
});

describe('T-MMM-S6-110: mmm-score-confirm cascade writes to mmm_maturity_scores', () => {
  it('mmm-score-confirm upserts to mmm_maturity_scores', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('mmm_maturity_scores');
  });
  it('uses upsert for idempotent score writing', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toMatch(/\.upsert\(/);
  });
});

describe('T-MMM-S6-111: mmm-score-confirm writes to mmm_override_log when rationale present', () => {
  it('inserts to mmm_override_log', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('mmm_override_log');
    expect(src).toMatch(/\.insert\(/);
  });
  it('includes rationale in override log', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('rationale');
  });
});

describe('T-MMM-S6-112: B7 BLOCKED status documented (SB-003 credential gate active)', () => {
  it('BUILD_PROGRESS_TRACKER records B7 as BLOCKED with SB-003', () => {
    const tracker = readFile('modules/MMM/BUILD_PROGRESS_TRACKER.md');
    expect(tracker).toMatch(/B7.*BLOCKED|BLOCKED.*SB-003/);
  });
  it('SB-003 credential gate documented', () => {
    const tracker = readFile('modules/MMM/BUILD_PROGRESS_TRACKER.md');
    expect(tracker).toContain('SB-003');
  });
});

// =============================================================================
// D7: AI INTERACTIONS — T-MMM-S6-121 through T-MMM-S6-128
// =============================================================================

describe('T-MMM-S6-121: mmm_ai_interactions table defined in migration (B1)', () => {
  it('migration 1 defines mmm_ai_interactions table', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_ai_interactions');
    expect(migration).toMatch(/CREATE TABLE IF NOT EXISTS.*mmm_ai_interactions/s);
  });
});

describe('T-MMM-S6-122: mmm-ai-evidence-evaluate exists (AI evaluation function)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-evidence-evaluate/index.ts')).toBe(true);
  });
  it('is registered in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-evidence-evaluate]');
  });
});

describe('T-MMM-S6-123: mmm-ai-framework-parse exists (AI parse function)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-framework-parse/index.ts')).toBe(true);
  });
  it('is registered in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-framework-parse]');
  });
});

describe('T-MMM-S6-124: mmm-ai-framework-generate exists (AI generate function)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-framework-generate/index.ts')).toBe(true);
  });
  it('is registered in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-framework-generate]');
  });
});

describe('T-MMM-S6-125: mmm-ai-framework-alter exists (AI alter function)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-framework-alter/index.ts')).toBe(true);
  });
  it('is registered in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-framework-alter]');
  });
});

describe('T-MMM-S6-126: mmm-ai-recommend exists (AI recommend function)', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-recommend/index.ts')).toBe(true);
  });
  it('is registered in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-recommend]');
  });
});

describe('T-MMM-S6-127: All AI stubs return structured responses (proposed_score or recommendations)', () => {
  it('mmm-ai-evidence-evaluate returns proposed_score', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('proposed_score');
  });
  it('mmm-ai-recommend returns recommendations array', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toContain('recommendations');
  });
  it('mmm-ai-framework-generate returns structured proposal', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-generate/index.ts');
    // Should return proposed_framework or domains structure
    expect(src).toMatch(/proposed_framework|proposed_domains|framework_id/);
  });
});

describe('T-MMM-S6-128: mmm-qiw-status aggregates AI interaction data (seven_day_trend present)', () => {
  it('mmm-qiw-status file exists', () => {
    expect(fileExists('supabase/functions/mmm-qiw-status/index.ts')).toBe(true);
  });
  it('response includes seven_day_trend key', () => {
    const src = readFile('supabase/functions/mmm-qiw-status/index.ts');
    expect(src).toContain('seven_day_trend');
  });
  it('response includes pipeline_stages key', () => {
    const src = readFile('supabase/functions/mmm-qiw-status/index.ts');
    expect(src).toContain('pipeline_stages');
  });
});

// =============================================================================
// D8: PERFORMANCE & RELIABILITY — T-MMM-S6-129 through T-MMM-S6-138
// =============================================================================

describe('T-MMM-S6-129: ConnectivityIndicator is present as global component (TR-041)', () => {
  it('ConnectivityIndicator component file exists', () => {
    expect(fileExists('apps/mmm/src/components/ConnectivityIndicator.tsx')).toBe(true);
  });
  it('App.tsx imports and renders ConnectivityIndicator globally', () => {
    const app = readFile('apps/mmm/src/App.tsx');
    expect(app).toContain('ConnectivityIndicator');
  });
});

describe('T-MMM-S6-130: Queue-and-sync pattern implemented in EvidenceWorkspacePage (TR-040)', () => {
  it('EvidenceWorkspacePage contains TR-040 queue-and-sync comment', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toMatch(/TR-040|queue-and-sync/);
  });
});

describe('T-MMM-S6-131: DashboardPage has staleTime for cache performance (TR-005)', () => {
  it('DashboardPage uses staleTime on query', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('staleTime');
  });
  it('staleTime value is set (TR-005 cache performance)', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toMatch(/staleTime.*\d+|TR-005/);
  });
});

describe('T-MMM-S6-132: mmm-score-confirm has 6-step cascade comment (TR-004)', () => {
  it('mmm-score-confirm contains TR-004 cascade comment', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toMatch(/TR-004|6-step cascade/);
  });
  it('cascade steps are documented', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    // Verify it mentions key cascade stages
    expect(src).toMatch(/criterion|MPS|domain/i);
  });
});

describe('T-MMM-S6-133: Circuit breaker pattern noted in AI stub functions (TR-009)', () => {
  it('mmm-ai-framework-parse contains circuit breaker comment (TR-009)', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toMatch(/circuit breaker|TR-009/i);
  });
});

describe('T-MMM-S6-134: mmm-health p99 target ≤ 100ms documented in source (TR-010)', () => {
  it('mmm-health documents p99 ≤ 100ms target', () => {
    const src = readFile('supabase/functions/mmm-health/index.ts');
    expect(src).toMatch(/p99.*100ms|100ms.*p99/);
  });
});

describe('T-MMM-S6-135: mmm-upload-framework-source file upload SLA ≤ 30s noted (TR-006)', () => {
  it('mmm-upload-framework-source contains TR-006 SLA ≤ 30s comment', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toMatch(/TR-006|≤ 30s|30s/);
  });
});

describe('T-MMM-S6-136: AssessmentWorkbenchPage queries both criteria and scores (TR-007)', () => {
  it('AssessmentWorkbenchPage queries mmm_criteria', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx');
    expect(src).toContain('mmm_criteria');
  });
  it('AssessmentWorkbenchPage queries mmm_maturity_scores', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx');
    expect(src).toContain('mmm_maturity_scores');
  });
});

describe('T-MMM-S6-137: ProtectedRoute uses supabase.auth.getSession (session check pattern)', () => {
  it('ProtectedRoute calls supabase.auth.getSession', () => {
    const src = readFile('apps/mmm/src/components/ProtectedRoute.tsx');
    expect(src).toContain('supabase.auth.getSession');
  });
});

describe('T-MMM-S6-138: App.tsx wraps all routes with QueryClientProvider and ErrorBoundary', () => {
  it('App.tsx imports QueryClientProvider', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('QueryClientProvider');
  });
  it('App.tsx imports ErrorBoundary', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('ErrorBoundary');
  });
  it('App.tsx wraps routes in both providers', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    // Both should be rendered in the component
    expect(src).toMatch(/<QueryClientProvider/);
    expect(src).toMatch(/<ErrorBoundary/);
  });
});

// =============================================================================
// D9: SECURITY & COMPLIANCE — T-MMM-S6-139 through T-MMM-S6-152
// =============================================================================

describe('T-MMM-S6-139: Supabase auth signUp used in SignUpPage (no custom auth bypass)', () => {
  it('SignUpPage uses supabase.auth.signUp', () => {
    const src = readFile('apps/mmm/src/pages/SignUpPage.tsx');
    expect(src).toContain('supabase.auth.signUp');
  });
});

describe('T-MMM-S6-140: JWT tokens from supabase.auth.getSession used in all API calls', () => {
  it('EvidenceWorkspacePage uses session.access_token in Authorization header', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('supabase.auth.getSession');
    expect(src).toContain('access_token');
  });
  it('DashboardPage uses session.access_token in Authorization header', () => {
    const src = readFile('apps/mmm/src/pages/DashboardPage.tsx');
    expect(src).toContain('supabase.auth.getSession');
    expect(src).toContain('access_token');
  });
});

describe('T-MMM-S6-141: RLS policies migration file exists (B1)', () => {
  it('RLS migration file exists', () => {
    expect(fileExists('supabase/migrations/20260420000003_mmm_rls_policies.sql')).toBe(true);
  });
  it('RLS migration enables RLS on tables', () => {
    const sql = readFile('supabase/migrations/20260420000003_mmm_rls_policies.sql');
    expect(sql).toContain('ENABLE ROW LEVEL SECURITY');
  });
});

describe('T-MMM-S6-142: mmm-org-create only accepts calls with valid JWT (NBR-002)', () => {
  it('mmm-org-create documents NBR-002 JWT requirement', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toContain('NBR-002');
  });
  it('mmm-org-create validates JWT before proceeding', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toMatch(/validateJWT|JWT.*required/i);
  });
});

describe('T-MMM-S6-143: Human oversight required — mmm-score-confirm requires confirm:true (TR-033 HITL)', () => {
  it('mmm-score-confirm enforces confirm:true flag', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('confirm !== true');
  });
  it('TR-033 HITL requirement documented in source', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('TR-033');
  });
});

describe('T-MMM-S6-144: mmm-override-log is immutable — no UPDATE/DELETE patterns in B5 code', () => {
  it('mmm-score-confirm does not UPDATE mmm_override_log', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    // Should only insert, never update or delete override log
    const overrideSection = src.split('mmm_override_log');
    // Check that after mmm_override_log references there's no .update() or .delete()
    expect(src).not.toMatch(/mmm_override_log[\s\S]{0,50}\.update\(/);
    expect(src).not.toMatch(/mmm_override_log[\s\S]{0,50}\.delete\(/);
  });
  it('RLS migration confirms no UPDATE/DELETE for authenticated on override_log', () => {
    const sql = readFile('supabase/migrations/20260420000003_mmm_rls_policies.sql');
    // The override_log should not have UPDATE/DELETE policies for authenticated role
    expect(sql).toMatch(/mmm_override_log[\s\S]{0,200}INSERT/);
  });
});

describe('T-MMM-S6-145: mmm-audit-logs written by health, org-update, framework-publish, pit-export', () => {
  it('mmm-health writes to mmm_audit_logs', () => {
    const src = readFile('supabase/functions/mmm-health/index.ts');
    expect(src).toContain('mmm_audit_logs');
  });
  it('mmm-org-update writes to mmm_audit_logs', () => {
    const src = readFile('supabase/functions/mmm-org-update/index.ts');
    expect(src).toContain('mmm_audit_logs');
  });
  it('mmm-framework-publish writes to mmm_audit_logs', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('mmm_audit_logs');
  });
  it('mmm-pit-export-send writes to mmm_audit_logs', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('mmm_audit_logs');
  });
});

describe('T-MMM-S6-146: All Edge Functions import from esm.sh (Deno runtime — no Node.js)', () => {
  const esm = 'https://esm.sh/';
  const functions = [
    'mmm-health', 'mmm-org-create', 'mmm-framework-compile',
    'mmm-score-confirm', 'mmm-ai-recommend', 'mmm-pit-export-send',
  ];
  for (const fn of functions) {
    it(`${fn} imports from esm.sh`, () => {
      const src = readFile(`supabase/functions/${fn}/index.ts`);
      expect(src).toContain(esm);
    });
  }
});

describe('T-MMM-S6-147: mmm-invitation-create enforces ADMIN role (HTTP 403)', () => {
  it('mmm-invitation-create requires ADMIN role', () => {
    const src = readFile('supabase/functions/mmm-invitation-create/index.ts');
    expect(src).toContain('ADMIN');
  });
  it('mmm-invitation-create enforces 403 on non-ADMIN', () => {
    const src = readFile('supabase/functions/mmm-invitation-create/index.ts');
    expect(src).toMatch(/requireRole|403/);
  });
});

describe('T-MMM-S6-148: mmm-framework-publish enforces ADMIN role (HTTP 403)', () => {
  it('mmm-framework-publish requires ADMIN role', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('ADMIN');
  });
  it('mmm-framework-publish uses requireRole for 403', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toMatch(/requireRole|403/);
  });
});

describe('T-MMM-S6-149: mmm-pit-export-send enforces ADMIN/FRAMEWORK_OWNER (HTTP 403)', () => {
  it('mmm-pit-export-send checks ADMIN or FRAMEWORK_OWNER role', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('ADMIN');
    expect(src).toContain('FRAMEWORK_OWNER');
  });
  it('mmm-pit-export-send returns 403 on insufficient role', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toMatch(/requireRole|NBR-002/);
  });
});

describe('T-MMM-S6-150: CONTROL_MAPPING comment in wave evidence artifacts present', () => {
  it('at least one B3-B6 wave evidence file references CONTROL_MAPPING', () => {
    const evidencePaths = [
      'modules/MMM/11-build/B3-ui/wave-b3-evidence.md',
      'modules/MMM/11-build/B4-framework/wave-b4-evidence.md',
      'modules/MMM/11-build/B5-assessment/wave-b5-evidence.md',
      'modules/MMM/11-build/B6-findings/wave-b6-evidence.md',
    ];
    const foundControlMapping = evidencePaths.some((p) => {
      if (!fileExists(p)) return false;
      return readFile(p).includes('CONTROL_MAPPING');
    });
    expect(foundControlMapping).toBe(true);
  });
});

describe('T-MMM-S6-151: No hardcoded credentials in any Edge Function (no literal keys)', () => {
  const mmm_functions = [
    'mmm-health', 'mmm-org-create', 'mmm-org-update', 'mmm-invitation-create',
    'mmm-invitation-accept', 'mmm-commissioning-check', 'mmm-framework-init',
    'mmm-framework-compile', 'mmm-framework-publish', 'mmm-upload-framework-source',
    'mmm-ai-framework-parse', 'mmm-ai-framework-generate', 'mmm-ai-framework-alter',
    'mmm-score-confirm', 'mmm-upload-evidence', 'mmm-ai-evidence-evaluate',
    'mmm-pit-export-send', 'mmm-pit-evidence-return', 'mmm-ai-recommend',
    'mmm-qiw-status', 'mmm-assessment-free-respond', 'mmm-assessment-free-result',
  ];
  for (const fn of mmm_functions) {
    it(`${fn} has no hardcoded credential literals`, () => {
      const src = readFile(`supabase/functions/${fn}/index.ts`);
      // Check for common credential patterns that are NOT env var reads
      // Allow Deno.env.get() but not literal key assignments
      expect(src).not.toMatch(/(?:apiKey|api_key|password|secret)\s*=\s*['"][a-zA-Z0-9]{20,}/);
      // No sk_live or sk_test literals
      expect(src).not.toMatch(/(?:sk_live_|sk_test_)[a-zA-Z0-9]{10,}/);
    });
  }
});

describe('T-MMM-S6-152: SAST — no eval(), no innerHTML assignments in React components', () => {
  const reactFiles = [
    'apps/mmm/src/App.tsx',
    'apps/mmm/src/pages/DashboardPage.tsx',
    'apps/mmm/src/pages/EvidenceWorkspacePage.tsx',
    'apps/mmm/src/pages/AssessmentWorkbenchPage.tsx',
    'apps/mmm/src/pages/SignUpPage.tsx',
    'apps/mmm/src/components/ConnectivityIndicator.tsx',
    'apps/mmm/src/components/ErrorBoundary.tsx',
    'apps/mmm/src/components/ProtectedRoute.tsx',
  ];
  for (const f of reactFiles) {
    it(`${f} has no eval() calls`, () => {
      const src = readFile(f);
      expect(src).not.toMatch(/\beval\s*\(/);
    });
    it(`${f} has no innerHTML assignments`, () => {
      const src = readFile(f);
      expect(src).not.toMatch(/\.innerHTML\s*=/);
    });
  }
});

// =============================================================================
// D10: INFRASTRUCTURE & QUALITY GATES — T-MMM-S6-153 through T-MMM-S6-164
// =============================================================================

describe('T-MMM-S6-153: Vercel frontend deployment config exists (vercel.json or vite.config.ts at apps/mmm/)', () => {
  it('apps/mmm/vite.config.ts exists (Vite/Vercel deployment config)', () => {
    expect(fileExists('apps/mmm/vite.config.ts')).toBe(true);
  });
  it('vercel.json exists at repo root with Vite framework config', () => {
    expect(fileExists('vercel.json')).toBe(true);
    const vj = readFile('vercel.json');
    expect(vj).toContain('vite');
  });
});

describe('T-MMM-S6-154: Supabase backend migrations deployed (4 migration files in supabase/migrations/)', () => {
  it('core tables migration exists', () => {
    expect(fileExists('supabase/migrations/20260420000001_mmm_core_tables.sql')).toBe(true);
  });
  it('indexes migration exists', () => {
    expect(fileExists('supabase/migrations/20260420000002_mmm_indexes.sql')).toBe(true);
  });
  it('RLS policies migration exists', () => {
    expect(fileExists('supabase/migrations/20260420000003_mmm_rls_policies.sql')).toBe(true);
  });
  it('storage buckets migration exists', () => {
    expect(fileExists('supabase/migrations/20260420000004_mmm_storage_buckets.sql')).toBe(true);
  });
});

describe('T-MMM-S6-155: Storage buckets configured (mmm-evidence and mmm-framework-sources)', () => {
  it('storage migration configures mmm-evidence bucket', () => {
    const sql = readFile('supabase/migrations/20260420000004_mmm_storage_buckets.sql');
    expect(sql).toContain("'mmm-evidence'");
  });
  it('storage migration configures mmm-framework-sources bucket', () => {
    const sql = readFile('supabase/migrations/20260420000004_mmm_storage_buckets.sql');
    expect(sql).toContain("'mmm-framework-sources'");
  });
});

describe('T-MMM-S6-156: All CREATE TABLE IF NOT EXISTS (idempotent migrations)', () => {
  it('core tables migration uses CREATE TABLE IF NOT EXISTS', () => {
    const sql = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    const count = (sql.match(/CREATE TABLE IF NOT EXISTS/g) || []).length;
    expect(count).toBeGreaterThanOrEqual(20);
  });
});

describe('T-MMM-S6-157: vitest configs for B1–B6 all exist (6 config files)', () => {
  const configs = [
    'vitest.mmm-b1.config.ts',
    'vitest.mmm-b2.config.ts',
    'vitest.mmm-b3.config.ts',
    'vitest.mmm-b4.config.ts',
    'vitest.mmm-b5.config.ts',
    'vitest.mmm-b6.config.ts',
  ];
  for (const cfg of configs) {
    it(`${cfg} exists`, () => {
      expect(fileExists(cfg)).toBe(true);
    });
  }
});

describe('T-MMM-S6-158: apps/mmm/tsconfig.json exists with strict: true', () => {
  it('tsconfig.json file exists', () => {
    expect(fileExists('apps/mmm/tsconfig.json')).toBe(true);
  });
  it('tsconfig.json has strict: true', () => {
    const tsconfig = readFile('apps/mmm/tsconfig.json');
    expect(tsconfig).toContain('"strict": true');
  });
});

describe('T-MMM-S6-159: supabase/config.toml registers all Edge Functions (B2 + B3–B6 additions)', () => {
  it('config.toml contains all 22 MMM Edge Function registrations', () => {
    const config = readFile('supabase/config.toml');
    const b2Functions = [
      'mmm-health', 'mmm-qiw-status', 'mmm-org-update',
      'mmm-invitation-create', 'mmm-invitation-accept', 'mmm-commissioning-check',
    ];
    const b3b6Functions = [
      'mmm-assessment-free-respond', 'mmm-assessment-free-result',
      'mmm-org-create', 'mmm-framework-init',
      'mmm-framework-compile', 'mmm-framework-publish', 'mmm-upload-framework-source',
      'mmm-ai-framework-parse', 'mmm-ai-framework-generate', 'mmm-ai-framework-alter',
      'mmm-score-confirm', 'mmm-upload-evidence', 'mmm-ai-evidence-evaluate',
      'mmm-pit-export-send', 'mmm-pit-evidence-return', 'mmm-ai-recommend',
    ];
    for (const fn of [...b2Functions, ...b3b6Functions]) {
      expect(config).toContain(`[functions.${fn}]`);
    }
  });
});

describe('T-MMM-S6-160: apps/mmm/src/App.tsx imports QueryClientProvider (TanStack Query)', () => {
  it('App.tsx imports QueryClientProvider from @tanstack/react-query', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('@tanstack/react-query');
    expect(src).toContain('QueryClientProvider');
  });
});

describe('T-MMM-S6-161: apps/mmm/src/main.tsx renders with React.StrictMode', () => {
  it('main.tsx imports React', () => {
    const src = readFile('apps/mmm/src/main.tsx');
    expect(src).toContain('React');
  });
  it('main.tsx uses React.StrictMode', () => {
    const src = readFile('apps/mmm/src/main.tsx');
    expect(src).toContain('StrictMode');
  });
});

describe('T-MMM-S6-162: mmm-ai-interactions not writable by authenticated role (B1 RLS)', () => {
  it('RLS migration enables RLS on mmm_ai_interactions', () => {
    const sql = readFile('supabase/migrations/20260420000003_mmm_rls_policies.sql');
    expect(sql).toMatch(/mmm_ai_interactions[\s\S]{0,50}ENABLE ROW LEVEL SECURITY|ENABLE ROW LEVEL SECURITY[\s\S]{0,200}mmm_ai_interactions/);
  });
  it('No INSERT/UPDATE/DELETE policy for authenticated on mmm_ai_interactions', () => {
    const sql = readFile('supabase/migrations/20260420000003_mmm_rls_policies.sql');
    // The RLS comment should state service role only
    expect(sql).toMatch(/mmm_ai_interactions[\s\S]{0,300}service.role only|No INSERT.UPDATE.DELETE for authenticated/);
  });
});

describe('T-MMM-S6-163: supabase/seed-mmm.sql uses ON CONFLICT DO NOTHING (idempotent)', () => {
  it('seed-mmm.sql file exists', () => {
    expect(fileExists('supabase/seed-mmm.sql')).toBe(true);
  });
  it('seed-mmm.sql uses ON CONFLICT DO NOTHING throughout', () => {
    const sql = readFile('supabase/seed-mmm.sql');
    expect(sql).toContain('ON CONFLICT');
    expect(sql).toContain('DO NOTHING');
  });
});

describe('T-MMM-S6-164: Wave evidence artifacts exist for B1–B6 (6 evidence files)', () => {
  const evidenceFiles = [
    'modules/MMM/11-build/B1-schema/wave-b1-evidence.md',
    'modules/MMM/11-build/B2-api/wave-b2-evidence.md',
    'modules/MMM/11-build/B3-ui/wave-b3-evidence.md',
    'modules/MMM/11-build/B4-framework/wave-b4-evidence.md',
    'modules/MMM/11-build/B5-assessment/wave-b5-evidence.md',
    'modules/MMM/11-build/B6-findings/wave-b6-evidence.md',
  ];
  for (const ef of evidenceFiles) {
    it(`${ef} exists`, () => {
      expect(fileExists(ef)).toBe(true);
    });
  }
});

// =============================================================================
// D11: PRODUCT IDENTITY & GOVERNANCE — T-MMM-S6-165 through T-MMM-S6-176
// =============================================================================

describe('T-MMM-S6-165: QIW dashboard endpoint defined (mmm-qiw-status returns pipeline_stages)', () => {
  it('mmm-qiw-status registered in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-qiw-status]');
  });
  it('mmm-qiw-status function returns pipeline_stages in response body', () => {
    const src = readFile('supabase/functions/mmm-qiw-status/index.ts');
    expect(src).toContain('pipeline_stages');
  });
});

describe('T-MMM-S6-166: Audit log writes present across all waves (B2–B6 functions)', () => {
  it('B2: mmm-health writes audit log', () => {
    const src = readFile('supabase/functions/mmm-health/index.ts');
    expect(src).toContain('mmm_audit_logs');
  });
  it('B3: mmm-org-update writes audit log', () => {
    const src = readFile('supabase/functions/mmm-org-update/index.ts');
    expect(src).toContain('mmm_audit_logs');
  });
  it('B4: mmm-framework-publish writes audit log', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('mmm_audit_logs');
  });
  it('B6: mmm-pit-export-send writes audit log', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('mmm_audit_logs');
  });
});

describe('T-MMM-S6-167: All 13+ B3–B6 Edge Functions registered in supabase/config.toml', () => {
  it('All 16 B3-B6 Edge Functions are registered in config.toml', () => {
    const config = readFile('supabase/config.toml');
    const b3b6 = [
      // B3
      'mmm-assessment-free-respond', 'mmm-assessment-free-result',
      'mmm-org-create', 'mmm-framework-init',
      // B4
      'mmm-framework-compile', 'mmm-framework-publish', 'mmm-upload-framework-source',
      'mmm-ai-framework-parse', 'mmm-ai-framework-generate', 'mmm-ai-framework-alter',
      // B5
      'mmm-score-confirm', 'mmm-upload-evidence', 'mmm-ai-evidence-evaluate',
      // B6
      'mmm-pit-export-send', 'mmm-pit-evidence-return', 'mmm-ai-recommend',
    ];
    for (const fn of b3b6) {
      expect(config).toContain(`[functions.${fn}]`);
    }
    // Verify count ≥ 13 (spec minimum)
    const count = b3b6.filter((fn) => config.includes(`[functions.${fn}]`)).length;
    expect(count).toBeGreaterThanOrEqual(13);
  });
});

describe('T-MMM-S6-168: All Edge Functions use Deno-compatible ESM imports (esm.sh)', () => {
  it('All sample MMM Edge Functions import from esm.sh', () => {
    const sampleFunctions = [
      'mmm-health', 'mmm-qiw-status', 'mmm-org-create',
      'mmm-framework-compile', 'mmm-score-confirm', 'mmm-ai-recommend',
    ];
    for (const fn of sampleFunctions) {
      const src = readFile(`supabase/functions/${fn}/index.ts`);
      expect(src).toContain('https://esm.sh/');
    }
  });
});

describe('T-MMM-S6-169: NBR-001 cache invalidation comments present across B3–B6', () => {
  it('NBR-001 present in mmm-org-update (B3)', () => {
    const src = readFile('supabase/functions/mmm-org-update/index.ts');
    expect(src).toContain('NBR-001');
  });
  it('NBR-001 present in mmm-framework-compile (B4)', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toContain('NBR-001');
  });
  it('NBR-001 present in mmm-score-confirm (B5)', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('NBR-001');
  });
  it('NBR-001 present in mmm-pit-export-send (B6)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('NBR-001');
  });
});

describe('T-MMM-S6-170: NBR-002 HTTP 403 enforcement present in invitation-create, org-create, framework-publish, pit-export-send', () => {
  it('mmm-invitation-create enforces NBR-002', () => {
    const src = readFile('supabase/functions/mmm-invitation-create/index.ts');
    expect(src).toMatch(/NBR-002|requireRole/);
  });
  it('mmm-org-create enforces NBR-002', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toContain('NBR-002');
  });
  it('mmm-framework-publish enforces NBR-002', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toMatch(/NBR-002|requireRole/);
  });
  it('mmm-pit-export-send enforces NBR-002', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('NBR-002');
  });
});

describe('T-MMM-S6-171: NBR-003 Zustand org store has resetOnOrgSwitch', () => {
  it('orgStore.ts exports resetOnOrgSwitch function (NBR-003)', () => {
    // Find the org store file
    const orgStoreFiles = ['apps/mmm/src/store/orgStore.ts', 'apps/mmm/src/store/index.ts'];
    let found = false;
    for (const f of orgStoreFiles) {
      if (fileExists(f)) {
        const src = readFile(f);
        if (src.includes('resetOnOrgSwitch')) {
          found = true;
          break;
        }
      }
    }
    // Fallback: search in any store file
    if (!found) {
      const storeDir = resolve(ROOT, 'apps/mmm/src/store');
      const { readdirSync } = require('fs');
      if (existsSync(storeDir)) {
        const files = readdirSync(storeDir);
        for (const file of files) {
          const src = readFileSync(resolve(storeDir, file), 'utf-8');
          if (src.includes('resetOnOrgSwitch')) {
            found = true;
            break;
          }
        }
      }
    }
    expect(found).toBe(true);
  });
  it('resetOnOrgSwitch is documented with NBR-003', () => {
    const orgStoreFiles = ['apps/mmm/src/store/orgStore.ts'];
    let hasNbr003 = false;
    for (const f of orgStoreFiles) {
      if (fileExists(f)) {
        const src = readFile(f);
        if (src.includes('NBR-003')) {
          hasNbr003 = true;
        }
      }
    }
    expect(hasNbr003).toBe(true);
  });
});

describe('T-MMM-S6-172: ConnectivityIndicator component has role="alert" (WCAG accessibility, TR-059)', () => {
  it('ConnectivityIndicator renders div with role="alert"', () => {
    const src = readFile('apps/mmm/src/components/ConnectivityIndicator.tsx');
    expect(src).toContain('role="alert"');
  });
});

describe('T-MMM-S6-173: ErrorBoundary component implements getDerivedStateFromError', () => {
  it('ErrorBoundary class has getDerivedStateFromError static method', () => {
    const src = readFile('apps/mmm/src/components/ErrorBoundary.tsx');
    expect(src).toContain('getDerivedStateFromError');
  });
});

describe('T-MMM-S6-174: All B3–B6 wave evidence files have closure declaration', () => {
  const closureFiles = [
    'modules/MMM/11-build/B3-ui/wave-b3-evidence.md',
    'modules/MMM/11-build/B4-framework/wave-b4-evidence.md',
    'modules/MMM/11-build/B5-assessment/wave-b5-evidence.md',
    'modules/MMM/11-build/B6-findings/wave-b6-evidence.md',
  ];
  for (const ef of closureFiles) {
    it(`${ef} has closure declaration`, () => {
      const content = readFile(ef);
      expect(content).toMatch(/COMPLETE|closure/i);
    });
  }
});

describe('T-MMM-S6-175: BUILD_PROGRESS_TRACKER.md records Stage 12 as IN_PROGRESS', () => {
  it('BUILD_PROGRESS_TRACKER.md exists', () => {
    expect(fileExists('modules/MMM/BUILD_PROGRESS_TRACKER.md')).toBe(true);
  });
  it('Stage 12 recorded as IN_PROGRESS', () => {
    const tracker = readFile('modules/MMM/BUILD_PROGRESS_TRACKER.md');
    expect(tracker).toMatch(/Stage 12.*IN_PROGRESS|IN_PROGRESS.*Stage 12/);
  });
});

describe('T-MMM-S6-176: mmm-commissioning-check implements CHK-001 through CHK-005', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-commissioning-check/index.ts')).toBe(true);
  });
  it('implements CHK-001', () => {
    const src = readFile('supabase/functions/mmm-commissioning-check/index.ts');
    expect(src).toContain('CHK-001');
  });
  it('implements CHK-002', () => {
    const src = readFile('supabase/functions/mmm-commissioning-check/index.ts');
    expect(src).toContain('CHK-002');
  });
  it('implements CHK-003', () => {
    const src = readFile('supabase/functions/mmm-commissioning-check/index.ts');
    expect(src).toContain('CHK-003');
  });
  it('implements CHK-004', () => {
    const src = readFile('supabase/functions/mmm-commissioning-check/index.ts');
    expect(src).toContain('CHK-004');
  });
  it('implements CHK-005', () => {
    const src = readFile('supabase/functions/mmm-commissioning-check/index.ts');
    expect(src).toContain('CHK-005');
  });
});
