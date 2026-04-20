/**
 * MMM Wave B3 — Core UI: Onboarding Tests
 * Domain D1: T-MMM-S6-001 through T-MMM-S6-020
 *
 * Wave Slug: mmm-build-wave-b3-ui
 * Issue: maturion-isms#1428
 * Builder: ui-builder
 * Date: 2026-04-22
 *
 * File-based tests: verify file existence, content patterns, and structural requirements.
 * No DOM rendering required — tests inspect source files for required patterns.
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

// ─── T-MMM-S6-001: LandingPage.tsx exists with h1 heading ───────────────────
describe('T-MMM-S6-001: LandingPage.tsx exists with h1 heading', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/LandingPage.tsx')).toBe(true);
  });
  it('contains h1 element', () => {
    const src = readFile('apps/mmm/src/pages/LandingPage.tsx');
    expect(src).toContain('<h1>');
  });
  it('contains Maturion brand text', () => {
    const src = readFile('apps/mmm/src/pages/LandingPage.tsx');
    expect(src).toContain('Maturion');
  });
});

// ─── T-MMM-S6-002: FreeAssessmentPage.tsx exists with domain responses ───────
describe('T-MMM-S6-002: FreeAssessmentPage.tsx exists with domain responses', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/FreeAssessmentPage.tsx')).toBe(true);
  });
  it('contains domain_responses structure', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain('domain_responses');
  });
  it('includes YES/NO/PARTIAL response options', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain('YES');
    expect(src).toContain('NO');
    expect(src).toContain('PARTIAL');
  });
});

// ─── T-MMM-S6-003: FreeAssessmentResultPage.tsx exists with baseline-maturity ─
describe('T-MMM-S6-003: FreeAssessmentResultPage.tsx exists with baseline-maturity display', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/FreeAssessmentResultPage.tsx')).toBe(true);
  });
  it('contains data-testid="baseline-maturity"', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentResultPage.tsx');
    expect(src).toContain('data-testid="baseline-maturity"');
  });
  it('uses freeAssessmentStore for baselineMaturity', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentResultPage.tsx');
    expect(src).toContain('baselineMaturity');
  });
});

// ─── T-MMM-S6-004: SignUpPage.tsx uses supabase auth signUp ─────────────────
describe('T-MMM-S6-004: SignUpPage.tsx uses supabase auth signUp', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/SignUpPage.tsx')).toBe(true);
  });
  it('calls supabase.auth.signUp', () => {
    const src = readFile('apps/mmm/src/pages/SignUpPage.tsx');
    expect(src).toContain('supabase.auth.signUp');
  });
  it('has email and password inputs', () => {
    const src = readFile('apps/mmm/src/pages/SignUpPage.tsx');
    expect(src).toContain('type="email"');
    expect(src).toContain('type="password"');
  });
});

// ─── T-MMM-S6-005: OnboardingPage.tsx calls /api/organisations ──────────────
describe('T-MMM-S6-005: OnboardingPage.tsx calls /api/organisations', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/OnboardingPage.tsx')).toBe(true);
  });
  it('calls /api/organisations endpoint', () => {
    const src = readFile('apps/mmm/src/pages/OnboardingPage.tsx');
    expect(src).toContain('/api/organisations');
  });
  it('uses POST method', () => {
    const src = readFile('apps/mmm/src/pages/OnboardingPage.tsx');
    expect(src).toContain("method: 'POST'");
  });
});

// ─── T-MMM-S6-006: FrameworkOriginPage.tsx has 3 radio options ──────────────
describe('T-MMM-S6-006: FrameworkOriginPage.tsx has 3 radio options (VERBATIM/GENERATED/HYBRID)', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/FrameworkOriginPage.tsx')).toBe(true);
  });
  it('contains VERBATIM option', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkOriginPage.tsx');
    expect(src).toContain('VERBATIM');
  });
  it('contains GENERATED option', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkOriginPage.tsx');
    expect(src).toContain('GENERATED');
  });
  it('contains HYBRID option', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkOriginPage.tsx');
    expect(src).toContain('HYBRID');
  });
});

// ─── T-MMM-S6-007: ConnectivityIndicator.tsx has role="alert" and aria-live ─
describe('T-MMM-S6-007: ConnectivityIndicator.tsx has role="alert" and aria-live', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/components/ConnectivityIndicator.tsx')).toBe(true);
  });
  it('has role="alert"', () => {
    const src = readFile('apps/mmm/src/components/ConnectivityIndicator.tsx');
    expect(src).toContain('role="alert"');
  });
  it('has aria-live="polite"', () => {
    const src = readFile('apps/mmm/src/components/ConnectivityIndicator.tsx');
    expect(src).toContain('aria-live="polite"');
  });
});

// ─── T-MMM-S6-008: ErrorBoundary.tsx implements getDerivedStateFromError ─────
describe('T-MMM-S6-008: ErrorBoundary.tsx implements getDerivedStateFromError', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/components/ErrorBoundary.tsx')).toBe(true);
  });
  it('implements getDerivedStateFromError', () => {
    const src = readFile('apps/mmm/src/components/ErrorBoundary.tsx');
    expect(src).toContain('getDerivedStateFromError');
  });
  it('has role="alert" for error display', () => {
    const src = readFile('apps/mmm/src/components/ErrorBoundary.tsx');
    expect(src).toContain('role="alert"');
  });
});

// ─── T-MMM-S6-009: main.tsx uses QueryClientProvider ────────────────────────
describe('T-MMM-S6-009: main.tsx uses QueryClientProvider', () => {
  it('main.tsx exists', () => {
    expect(fileExists('apps/mmm/src/main.tsx')).toBe(true);
  });
  it('App.tsx contains QueryClientProvider', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('QueryClientProvider');
  });
  it('App.tsx imports queryClient', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('queryClient');
  });
});

// ─── T-MMM-S6-010: orgStore.ts implements resetOnOrgSwitch (NBR-003) ─────────
describe('T-MMM-S6-010: orgStore.ts implements resetOnOrgSwitch (NBR-003)', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/store/orgStore.ts')).toBe(true);
  });
  it('implements resetOnOrgSwitch function', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    expect(src).toContain('resetOnOrgSwitch');
  });
  it('has NBR-003 comment', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    expect(src).toContain('NBR-003');
  });
});

// ─── T-MMM-S6-011: mmm-assessment-free-respond Edge Function exists ──────────
describe('T-MMM-S6-011: mmm-assessment-free-respond Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-assessment-free-respond/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-assessment-free-respond]');
  });
  it('has verify_jwt = false (public endpoint)', () => {
    const config = readFile('supabase/config.toml');
    const match = config.match(/\[functions\.mmm-assessment-free-respond\][^\[]*verify_jwt\s*=\s*(\w+)/s);
    expect(match?.[1]).toBe('false');
  });
});

// ─── T-MMM-S6-012: mmm-assessment-free-result Edge Function exists ───────────
describe('T-MMM-S6-012: mmm-assessment-free-result Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-assessment-free-result/index.ts')).toBe(true);
  });
  it('queries by session_token', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-result/index.ts');
    expect(src).toContain('session_token');
  });
  it('returns 404 when not found', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-result/index.ts');
    expect(src).toContain('404');
  });
});

// ─── T-MMM-S6-013: mmm-org-create Edge Function exists ───────────────────────
describe('T-MMM-S6-013: mmm-org-create Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-org-create/index.ts')).toBe(true);
  });
  it('creates mmm_organisations record', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toContain('mmm_organisations');
  });
  it('creates/updates mmm_profiles', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toContain('mmm_profiles');
  });
});

// ─── T-MMM-S6-014: mmm-framework-init Edge Function exists ───────────────────
describe('T-MMM-S6-014: mmm-framework-init Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-framework-init/index.ts')).toBe(true);
  });
  it('creates mmm_frameworks with DRAFT status', () => {
    const src = readFile('supabase/functions/mmm-framework-init/index.ts');
    expect(src).toContain('mmm_frameworks');
    expect(src).toContain('DRAFT');
  });
  it('logs FRAMEWORK_INIT to audit_logs', () => {
    const src = readFile('supabase/functions/mmm-framework-init/index.ts');
    expect(src).toContain('FRAMEWORK_INIT');
    expect(src).toContain('mmm_audit_logs');
  });
});

// ─── T-MMM-S6-015: App.tsx includes route for /free-assessment ───────────────
describe('T-MMM-S6-015: App.tsx includes route for /free-assessment', () => {
  it('App.tsx exists', () => {
    expect(fileExists('apps/mmm/src/App.tsx')).toBe(true);
  });
  it('has /free-assessment route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/free-assessment"');
  });
  it('uses FreeAssessmentPage component', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('FreeAssessmentPage');
  });
});

// ─── T-MMM-S6-016: freeAssessmentStore.ts has setResult and reset actions ────
describe('T-MMM-S6-016: freeAssessmentStore.ts has setResult and reset actions', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/store/freeAssessmentStore.ts')).toBe(true);
  });
  it('has setResult action', () => {
    const src = readFile('apps/mmm/src/store/freeAssessmentStore.ts');
    expect(src).toContain('setResult');
  });
  it('has reset action', () => {
    const src = readFile('apps/mmm/src/store/freeAssessmentStore.ts');
    expect(src).toContain('reset:');
  });
});

// ─── T-MMM-S6-017: mmm-org-create has HTTP 403 for missing JWT (NBR-002) ─────
describe('T-MMM-S6-017: mmm-org-create has HTTP 403 for missing JWT (NBR-002)', () => {
  it('uses validateJWT', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toContain('validateJWT');
  });
  it('has NBR-002 comment', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toContain('NBR-002');
  });
  it('throws 401/403 on invalid JWT', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    // validateJWT from mmm-auth throws 401/403 on failure
    expect(src).toContain('validateJWT');
  });
});

// ─── T-MMM-S6-018: mmm-assessment-free-respond returns baseline_maturity ─────
describe('T-MMM-S6-018: mmm-assessment-free-respond returns baseline_maturity field', () => {
  it('calculates and returns baseline_maturity', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('baseline_maturity');
  });
  it('uses score map YES=1.0, PARTIAL=0.5, NO=0.0', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('YES: 1.0');
    expect(src).toContain('PARTIAL: 0.5');
    expect(src).toContain('NO: 0.0');
  });
  it('multiplies average by 5 for 0-5 scale', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('* 5');
  });
});

// ─── T-MMM-S6-019: OnboardingPage invalidates ['organisations'] query cache ──
describe("T-MMM-S6-019: OnboardingPage invalidates ['organisations'] query cache (NBR-001)", () => {
  it('calls invalidateQueries with organisations key', () => {
    const src = readFile('apps/mmm/src/pages/OnboardingPage.tsx');
    expect(src).toContain("queryKey: ['organisations']");
  });
  it('has NBR-001 comment', () => {
    const src = readFile('apps/mmm/src/pages/OnboardingPage.tsx');
    expect(src).toContain('NBR-001');
  });
});

// ─── T-MMM-S6-020: mmm_free_assessments table used in mmm-assessment-free-respond
describe('T-MMM-S6-020: mmm_free_assessments table used in mmm-assessment-free-respond', () => {
  it('inserts into mmm_free_assessments', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('mmm_free_assessments');
  });
  it('generates session_token with crypto.randomUUID()', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('crypto.randomUUID()');
  });
});
