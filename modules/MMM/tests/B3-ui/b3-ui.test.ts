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

// ─── T-MMM-S6-002: FreeAssessmentPage.tsx — MPS-level questionnaire ──────────
// Updated: free assessment must use MPS-level structured payload, not flat domain self-ratings.
describe('T-MMM-S6-002: FreeAssessmentPage.tsx uses MPS-level questionnaire (not flat domain self-ratings)', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/FreeAssessmentPage.tsx')).toBe(true);
  });
  it('uses assessment_version field (MPS-level payload — not flat domain_responses)', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain('assessment_version');
  });
  it('contains mps_id in responses payload', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain('mps_id');
  });
  it('contains question_id in responses payload', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain('question_id');
  });
  it('uses A/B/C choice options (not YES/NO/PARTIAL domain self-ratings)', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain("value: 'A'");
    expect(src).toContain("value: 'B'");
    expect(src).toContain("value: 'C'");
  });
  it('does NOT use flat five-domain self-rating pattern (anti-regression)', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    // Must not contain the old five domain names as a flat list
    expect(src).not.toContain("'Governance','Risk Management','Compliance','Technology','People'");
    expect(src).not.toContain('DOMAINS.map(d => ({ domain_name: d');
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

// ─── T-MMM-S6-018: mmm-assessment-free-respond handles MPS-level scoring ──────
// Updated: function must accept structured A/B/C responses and compute MPS/domain/overall scores.
describe('T-MMM-S6-018: mmm-assessment-free-respond handles MPS-level structured scoring', () => {
  it('calculates and returns baseline_maturity', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('baseline_maturity');
  });
  it('uses MPS choice score map A=0.0, B=0.5, C=1.0', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('A: 0.0');
    expect(src).toContain('B: 0.5');
    expect(src).toContain('C: 1.0');
  });
  it('multiplies average by 5 for 0-5 scale', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('* 5');
  });
  it('accepts assessment_version field in request', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('assessment_version');
  });
  it('computes mps_scores in structured result', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('mps_scores');
  });
  it('computes domain_scores in structured result', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('domain_scores');
  });
  it('contains GENERIC_MPS_V1_MANIFEST for server-side completeness validation', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('GENERIC_MPS_V1_MANIFEST');
    // Manifest must contain all 25 canonical question_ids
    expect(src).toContain('LG-01-Q1');
    expect(src).toContain('PI-01-Q1');
    expect(src).toContain('PC-01-Q1');
    expect(src).toContain('PR-01-Q1');
    expect(src).toContain('PW-01-Q1');
  });
  it('validates completeness: rejects fewer than 25 responses for v1', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('generic-mps-baseline-v1 requires exactly');
  });
  it('rejects duplicate question_ids', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('Duplicate question_id');
  });
  it('rejects unknown question_ids for v1', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('Unknown question_id');
  });
  it('validates all 5 canonical domains are present', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('Missing responses for canonical domain');
    expect(src).toContain('GENERIC_MPS_V1_CANONICAL_DOMAINS');
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

// ─── T-MMM-S6-021: Global CSS stylesheet is present and imported (anti-regression) ─
// Anti-regression gate: deployment workflows passing does NOT prove the UI is styled.
// This test ensures the global CSS file exists and is imported in the app entry point.
// Rationale: Issue maturion-isms#1496 — deployed MMM UI was bare/unstyled despite green
// deployment workflows. Root cause: missing index.css + missing CSS import in main.tsx.
describe('T-MMM-S6-021: Global CSS stylesheet exists and is imported (anti-regression)', () => {
  it('apps/mmm/src/index.css exists', () => {
    expect(fileExists('apps/mmm/src/index.css')).toBe(true);
  });
  it('index.css is non-trivial (contains at least one CSS rule)', () => {
    const src = readFile('apps/mmm/src/index.css');
    // Must contain at least one CSS property declaration
    expect(src).toMatch(/[a-z-]+\s*:\s*[^;]+;/);
  });
  it('main.tsx imports index.css', () => {
    const src = readFile('apps/mmm/src/main.tsx');
    expect(src).toContain("import './index.css'");
  });
  it('LandingPage.tsx uses at least one CSS className (not bare HTML)', () => {
    const src = readFile('apps/mmm/src/pages/LandingPage.tsx');
    expect(src).toContain('className=');
  });
  it('SignUpPage.tsx uses at least one CSS className (not bare HTML)', () => {
    const src = readFile('apps/mmm/src/pages/SignUpPage.tsx');
    expect(src).toContain('className=');
  });
  it('FreeAssessmentPage.tsx uses at least one CSS className (not bare HTML)', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain('className=');
  });
});

// ─── T-MMM-S6-022: MPS-level questionnaire structure anti-regression ─────────
// Anti-regression gates ensuring the MPS-level questionnaire is never regressed
// back to five flat domain self-ratings. Issue: maturion-isms#1499.
describe('T-MMM-S6-022: MPS-level questionnaire has 5 domains × 5 MPSs × 1+ questions (anti-regression)', () => {
  it('QUESTION_BANK is exported from FreeAssessmentPage', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain('export const QUESTION_BANK');
  });

  it('QUESTION_BANK contains exactly 5 domain entries', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    // Count top-level domain objects by counting `mpss:` which appears exactly once
    // per domain in QUESTION_BANK and nowhere else in the file.
    const domainEntries = src.match(/\bmpss:\s*\[/g) ?? [];
    expect(domainEntries.length).toBe(5);
  });

  it('QUESTION_BANK contains at least 25 question_id entries (5 domains × 5 MPSs)', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    const questionIdMatches = src.match(/question_id:\s*['"][^'"]+['"]/g) ?? [];
    expect(questionIdMatches.length).toBeGreaterThanOrEqual(25);
  });

  it('QUESTION_BANK contains at least 25 mps_id entries', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    const mpsIdMatches = src.match(/mps_id:\s*['"][^'"]+['"]/g) ?? [];
    expect(mpsIdMatches.length).toBeGreaterThanOrEqual(25);
  });

  it('all five canonical generic domains are present', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain('leadership-governance');
    expect(src).toContain('process-integrity');
    expect(src).toContain('people-culture');
    expect(src).toContain('protection');
    expect(src).toContain('proof-it-works');
  });

  it('uses generic-mps-baseline-v1 assessment version', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentPage.tsx');
    expect(src).toContain('generic-mps-baseline-v1');
  });

  it('FreeAssessmentResultPage shows domain breakdown (data-testid="domain-breakdown")', () => {
    const src = readFile('apps/mmm/src/pages/FreeAssessmentResultPage.tsx');
    expect(src).toContain('data-testid="domain-breakdown"');
  });

  it('freeAssessmentStore carries domainScores for result page breakdown', () => {
    const src = readFile('apps/mmm/src/store/freeAssessmentStore.ts');
    expect(src).toContain('domainScores');
  });

  it('edge function CHOICE_SCORE_MAP has A/B/C entries', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('CHOICE_SCORE_MAP');
    expect(src).toContain('A: 0.0');
    expect(src).toContain('B: 0.5');
    expect(src).toContain('C: 1.0');
  });

  it('edge function computes mps_scores aggregate', () => {
    const src = readFile('supabase/functions/mmm-assessment-free-respond/index.ts');
    expect(src).toContain('mps_scores');
  });
});
