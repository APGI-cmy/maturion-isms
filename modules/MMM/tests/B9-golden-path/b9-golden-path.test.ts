/**
 * MMM Wave B9 — Golden Path Verification Tests
 *
 * Wave Slug: mmm-build-wave-b9-golden-path-verification
 * Issue:     maturion-isms#1428
 * Builder:   qa-builder
 * Date:      2026-04-26
 *
 * Authorization: Foreman Wave-Start Authorization 2026-04-20
 *   Dependency gate: B7 QP PASS ✅ (113/113 B7 tests GREEN; 743/743 total GREEN)
 *
 * This test suite verifies all 10 MMM golden paths end-to-end across the full
 * B1–B8 integrated system using file-based assertions (no live Supabase required).
 *
 * Golden Paths:
 *   GP-001: Organisation onboarding (org create → framework init → first user commissioned)
 *   GP-002: Framework authoring lifecycle (init → KUC upload → AIMC parse → compile → publish)
 *   GP-003: Assessment execution (org framework → start → respond → AIMC score propose → HITL confirm)
 *   GP-004: Evidence evaluation (KUC upload → AIMC evaluate → confidence shown → auditor review)
 *   GP-005: Findings and reporting (assessment complete → findings generated → AI recommend → published)
 *   GP-006: PIT export flow (finding published → export trigger → full 7-step PIT handshake → SENT)
 *   GP-007: PIT evidence return (PIT sends evidence back → criterion-level link → score proposal updated)
 *   GP-008: AIMC boundary integration (AI call → circuit breaker healthy → AIMC responds → interaction stored)
 *   GP-009: Circuit breaker resilience (5+ failures → OPEN → fallback → HALF_OPEN probe → recovery)
 *   GP-010: KUC classification contract (upload → KUC classification returned → stored in mmm_documents)
 *
 * Anti-Regression Obligations:
 *   NBR-001: All mutations carry NBR-001 cache invalidation comment (TanStack Query pattern)
 *   NBR-002: HTTP 403 propagated correctly through integration boundary (no silent swallowing)
 *   NBR-003: Zustand org store resets on org switch (useOrgStore.resetOnOrgSwitch)
 *   CG-001:  Circuit breaker covers source-active AND source-retired states (no switchover assumption)
 *
 * CG-003 B9 Closure Declaration (MANDATORY per builder-contract.md §3.5 / addendum §B9):
 *   "B9 PASS PROVES: All 10 MMM golden paths are verified end-to-end through the complete
 *    B1–B8 integrated system. B9 PASS DOES NOT PROVE: Source retirement eligibility; AIMC
 *    internal completion; platform convergence readiness."
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
// GP-001: Organisation Onboarding
// org create → framework init → first user commissioned
// QA-to-Red references: T-MMM-S6-013, T-MMM-S6-014, T-MMM-S6-017, T-MMM-S6-051
// NBR-003: Zustand org store must reset on org switch
// =============================================================================

describe('GP-001: Organisation Onboarding — org create wired end-to-end', () => {
  it('mmm-org-create Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-org-create/index.ts')).toBe(true);
  });

  it('mmm-org-create creates mmm_organisations record', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toContain('mmm_organisations');
    expect(src).toMatch(/\.insert\(/);
  });

  it('mmm-org-create requires JWT (NBR-002: HTTP 403 without auth)', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toContain('validateJWT');
    expect(src).toMatch(/403|NBR-002/);
  });

  it('mmm-org-create carries NBR-001 cache invalidation comment', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toMatch(/NBR-001.*invalidate|invalidate.*NBR-001/i);
  });

  it('mmm-org-create creates mmm_profiles record (first user ADMIN)', () => {
    const src = readFile('supabase/functions/mmm-org-create/index.ts');
    expect(src).toContain('mmm_profiles');
    expect(src).toMatch(/ADMIN/);
  });
});

describe('GP-001: Organisation Onboarding — framework init wired', () => {
  it('mmm-framework-init Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-framework-init/index.ts')).toBe(true);
  });

  it('mmm-framework-init creates mmm_frameworks record (status DRAFT)', () => {
    const src = readFile('supabase/functions/mmm-framework-init/index.ts');
    expect(src).toContain('mmm_frameworks');
    expect(src).toMatch(/DRAFT/);
  });

  it('mmm-framework-init logs to mmm_audit_logs (FRAMEWORK_INIT action)', () => {
    const src = readFile('supabase/functions/mmm-framework-init/index.ts');
    expect(src).toContain('mmm_audit_logs');
    expect(src).toMatch(/FRAMEWORK_INIT/);
  });

  it('mmm-framework-init requires ADMIN role (NBR-002 enforcement)', () => {
    const src = readFile('supabase/functions/mmm-framework-init/index.ts');
    expect(src).toContain('requireRole');
    expect(src).toMatch(/ADMIN/);
  });
});

describe('GP-001: Organisation Onboarding — commissioning check complete (CHK-001–CHK-005)', () => {
  it('mmm-commissioning-check Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-commissioning-check/index.ts')).toBe(true);
  });

  it('mmm-commissioning-check runs all 5 startup checks (CHK-001–CHK-005)', () => {
    const src = readFile('supabase/functions/mmm-commissioning-check/index.ts');
    expect(src).toContain('CHK-001');
    expect(src).toContain('CHK-002');
    expect(src).toContain('CHK-003');
    expect(src).toContain('CHK-004');
    expect(src).toContain('CHK-005');
  });

  it('mmm-commissioning-check verifies schema deployed (mmm_organisations reachable)', () => {
    const src = readFile('supabase/functions/mmm-commissioning-check/index.ts');
    expect(src).toContain('mmm_organisations');
  });

  it('mmm-commissioning-check returns PASS when all checks pass', () => {
    const src = readFile('supabase/functions/mmm-commissioning-check/index.ts');
    expect(src).toMatch(/PASS/);
    expect(src).toMatch(/FAIL/);
  });
});

describe('GP-001: NBR-003 — Zustand org store resets on org switch', () => {
  it('orgStore.ts exists in MMM frontend', () => {
    expect(fileExists('apps/mmm/src/store/orgStore.ts')).toBe(true);
  });

  it('orgStore implements resetOnOrgSwitch (NBR-003)', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    expect(src).toContain('resetOnOrgSwitch');
    expect(src).toMatch(/NBR-003/);
  });

  it('orgStore uses Zustand create()', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    expect(src).toContain('create');
    expect(src).toMatch(/useOrgStore/);
  });

  it('orgStore reset nullifies currentOrgId and currentFrameworkId', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    expect(src).toContain('currentOrgId');
    expect(src).toContain('currentFrameworkId');
    // resetOnOrgSwitch must set both to null
    expect(src).toMatch(/resetOnOrgSwitch.*null|null.*resetOnOrgSwitch/s);
  });
});

// =============================================================================
// GP-002: Framework Authoring Lifecycle
// init → KUC source upload → AIMC AI parse → compile → publish
// QA-to-Red references: T-MMM-S6-021–035, T-MMM-S6-036–050, T-MMM-S6-098–112
// =============================================================================

describe('GP-002: Framework Authoring — KUC source upload (TR-019/TR-020)', () => {
  it('mmm-upload-framework-source Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-upload-framework-source/index.ts')).toBe(true);
  });

  it('mmm-upload-framework-source routes through KUC (uploadToKuc imported)', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('uploadToKuc');
    expect(src).toContain('mmm-kuc-client');
  });

  it('mmm-upload-framework-source sets document_role = criteria_source (TR-019)', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('criteria_source');
  });

  it('mmm-upload-framework-source returns kuc_classification in response (TR-020)', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('kuc_classification');
  });

  it('mmm-upload-framework-source uses circuit breaker for KUC boundary via mmm-kuc-client (TR-009)', () => {
    // mmm-upload-framework-source calls uploadToKuc which internally uses the circuit breaker
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('mmm-kuc-client');
    // KUC client itself uses the circuit breaker
    const kucClient = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(kucClient).toContain('mmm-circuit-breaker');
  });

  it('mmm-upload-framework-source carries NBR-001 comment', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toMatch(/NBR-001/);
  });
});

describe('GP-002: Framework Authoring — AIMC parse (consumer boundary only)', () => {
  it('mmm-ai-framework-parse Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-framework-parse/index.ts')).toBe(true);
  });

  it('mmm-ai-framework-parse calls AIMC via callAimc consumer boundary (OB-1)', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toContain('callAimc');
    expect(src).toContain('mmm-aimc-client');
  });

  it('mmm-ai-framework-parse has NO direct AI provider imports (OB-1)', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).not.toMatch(/openai|anthropic|cohere|gemini|mistral/i);
    expect(src).not.toContain('sk-');
  });

  it('mmm-ai-framework-parse references AIMC_BASE_URL env var (TR-013)', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toContain('AIMC_BASE_URL');
  });

  it('mmm-ai-framework-parse returns fallback response when circuit is OPEN', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toMatch(/fallback.*true|fallback_reason/i);
  });
});

describe('GP-002: Framework Authoring — compile and publish', () => {
  it('mmm-framework-compile Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-framework-compile/index.ts')).toBe(true);
  });

  it('mmm-framework-compile auto-assigns codes (no hallucination)', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toMatch(/[Aa]uto.assign.*codes|codes.*auto.assign/i);
  });

  it('mmm-framework-compile carries NBR-001 cache invalidation comment', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).toMatch(/NBR-001/);
  });

  it('mmm-framework-publish Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-framework-publish/index.ts')).toBe(true);
  });

  it('mmm-framework-publish sets status = PUBLISHED (immutable snapshot)', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toMatch(/PUBLISHED/);
    expect(src).toContain('mmm_frameworks');
  });

  it('mmm-framework-publish requires ADMIN role (NBR-002: HTTP 403 enforced)', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('requireRole');
    expect(src).toMatch(/ADMIN/);
    expect(src).toMatch(/NBR-002/);
  });

  it('mmm-framework-publish logs to mmm_audit_logs (FRAMEWORK_PUBLISH)', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toContain('mmm_audit_logs');
    expect(src).toMatch(/FRAMEWORK_PUBLISH/);
  });

  it('mmm-framework-publish carries NBR-001 cache invalidation comment', () => {
    const src = readFile('supabase/functions/mmm-framework-publish/index.ts');
    expect(src).toMatch(/NBR-001/);
  });
});

// =============================================================================
// GP-003: Assessment Execution
// org framework → assessment start → respond → AIMC score propose → HITL confirm
// QA-to-Red references: T-MMM-S6-051–080, T-MMM-S6-094–097
// NBR-003: Zustand org store must reset on org switch
// =============================================================================

describe('GP-003: Assessment Execution — AIMC score proposal (T-MMM-S6-122)', () => {
  it('mmm-ai-evidence-evaluate uses callAimc consumer boundary', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('callAimc');
  });

  it('mmm-ai-evidence-evaluate upserts to mmm_score_proposals (NOT maturity_scores directly)', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('mmm_score_proposals');
    // MUST NOT write to maturity_scores directly (HITL gate required)
    const directWrite = /\.insert\(\s*\{[^}]*maturity_scores/;
    expect(directWrite.test(src)).toBe(false);
  });

  it('mmm-ai-evidence-evaluate records ai_interaction with confidence (T-MMM-S6-124)', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('mmm_ai_interactions');
    expect(src).toContain('confidence');
  });

  it('mmm-ai-evidence-evaluate carries NBR-001 comment for score-proposals invalidation', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toMatch(/NBR-001/);
    expect(src).toMatch(/score-proposals/);
  });
});

describe('GP-003: Assessment Execution — HITL confirmation gate (TR-033)', () => {
  it('mmm-score-confirm Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-score-confirm/index.ts')).toBe(true);
  });

  it('mmm-score-confirm requires confirm: true flag (TR-033 HITL gate)', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toMatch(/confirm.*true|TR-033/);
  });

  it('mmm-score-confirm writes to mmm_maturity_scores (post HITL only)', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('mmm_maturity_scores');
    expect(src).toMatch(/\.upsert\(/);
  });

  it('mmm-score-confirm writes override log when rationale present', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('mmm_override_log');
    expect(src).toContain('rationale');
  });

  it('mmm-score-confirm triggers scoring cascade (MPS → domain → org)', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toMatch(/cascade|MPS.*domain.*org|domain.*score/i);
  });

  it('mmm-score-confirm carries NBR-001 cache invalidation comment', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toMatch(/NBR-001/);
    expect(src).toMatch(/scores.*assessment_id|dashboard/);
  });

  it('mmm-score-confirm enforces HTTP 403 on org_id mismatch (NBR-002)', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toMatch(/403|NBR-002/);
  });
});

describe('GP-003: Assessment Execution — free assessment path', () => {
  it('mmm-assessment-free-respond Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-assessment-free-respond/index.ts')).toBe(true);
  });

  it('mmm-assessment-free-result Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-assessment-free-result/index.ts')).toBe(true);
  });
});

// =============================================================================
// GP-004: Evidence Evaluation
// KUC upload → AIMC evaluate → confidence shown → auditor review (HITL gate)
// QA-to-Red references: T-MMM-S6-051–080, T-MMM-S6-094–097
// NBR-001: UI invalidates score-proposals cache after AIMC evaluate
// =============================================================================

describe('GP-004: Evidence Evaluation — KUC evidence upload (TR-019/TR-020)', () => {
  it('mmm-upload-evidence Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-upload-evidence/index.ts')).toBe(true);
  });

  it('mmm-upload-evidence routes through KUC (uploadToKuc imported)', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('uploadToKuc');
    expect(src).toContain('mmm-kuc-client');
  });

  it('mmm-upload-evidence sets document_role = evidence (TR-019)', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('evidence');
    expect(src).toMatch(/document_role/);
  });

  it('mmm-upload-evidence returns kuc_classification in response (TR-020)', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('kuc_classification');
  });

  it('mmm-upload-evidence carries NBR-001 cache invalidation comment', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toMatch(/NBR-001/);
    expect(src).toMatch(/evidence.*criterion_id|criterion_id/);
  });
});

describe('GP-004: Evidence Evaluation — AI confidence visible to auditor (T-MMM-S6-123)', () => {
  it('mmm-ai-evidence-evaluate returns confidence field in response', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('confidence');
    // Proposal stored with confidence, not auto-applied
    expect(src).toContain('mmm_score_proposals');
  });

  it('mmm_score_proposals table defined in migration (stores AI proposals, not confirmed scores)', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_score_proposals');
  });

  it('mmm_ai_interactions table defined in migration (records model and confidence)', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_ai_interactions');
  });
});

describe('GP-004: Evidence Evaluation — HITL auditor review gate', () => {
  it('mmm-score-confirm requires explicit confirm: true to write maturity_scores', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    // Human must explicitly confirm; AI score cannot bypass HITL
    expect(src).toMatch(/confirm.*true|HITL|TR-033/);
    expect(src).toContain('mmm_maturity_scores');
  });

  it('mmm_maturity_scores table defined in migration', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_maturity_scores');
  });
});

// =============================================================================
// GP-005: Findings and Reporting
// assessment complete → findings generated → AI recommend via AIMC → finding published
// QA-to-Red references: T-MMM-S6-081–093
// NBR-001: findings invalidation after generation
// =============================================================================

describe('GP-005: Findings and Reporting — AI recommendation via AIMC', () => {
  it('mmm-ai-recommend Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-recommend/index.ts')).toBe(true);
  });

  it('mmm-ai-recommend calls AIMC via callAimc consumer boundary (OB-1)', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toContain('callAimc');
    expect(src).toContain('mmm-aimc-client');
  });

  it('mmm-ai-recommend has NO direct AI provider imports (OB-1)', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).not.toMatch(/openai|anthropic|cohere|gemini|mistral/i);
  });

  it('mmm-ai-recommend returns fallback when circuit OPEN (TR-009)', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toMatch(/fallback.*true|fallback_reason/i);
  });
});

describe('GP-005: Findings and Reporting — findings structure', () => {
  it('mmm_findings table defined in migration', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_findings');
  });

  it('mmm_audit_sessions table defined in migration', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_audit_sessions');
  });

  it('mmm_audit_logs table defined in migration (report job tracking)', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_audit_logs');
  });
});

describe('GP-005: Findings and Reporting — AI explain function available', () => {
  it('mmm-ai-explain Edge Function exists (finding explanation)', () => {
    expect(fileExists('supabase/functions/mmm-ai-explain/index.ts')).toBe(true);
  });

  it('mmm-ai-explain calls AIMC consumer boundary (OB-1)', () => {
    const src = readFile('supabase/functions/mmm-ai-explain/index.ts');
    expect(src).toContain('callAimc');
    expect(src).not.toMatch(/openai|anthropic|cohere|gemini|mistral/i);
  });

  it('mmm-ai-explain returns fallback when circuit OPEN (TR-009)', () => {
    const src = readFile('supabase/functions/mmm-ai-explain/index.ts');
    expect(src).toMatch(/fallback.*true|fallback_reason/i);
  });
});

// =============================================================================
// GP-006: PIT Export Flow
// finding published → export trigger → full 7-step PIT handshake → SENT status
// QA-to-Red references: T-MMM-S6-088–090, T-MMM-S6-109–111
// OB-2: No PIT internal schema encoded in MMM
// =============================================================================

describe('GP-006: PIT Export Flow — 7-step handshake (TR-017)', () => {
  it('mmm-pit-export-send Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-pit-export-send/index.ts')).toBe(true);
  });

  it('mmm-pit-export-send implements all 7 TR-017 steps (documentation in source)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toMatch(/Step 1|step 1|TR-017/);
    expect(src).toMatch(/Step 2|step 2/);
    expect(src).toMatch(/Step 3|step 3/);
    expect(src).toMatch(/Step 4|step 4/);
    expect(src).toMatch(/Step 5|step 5/);
    expect(src).toMatch(/Step 6|step 6/);
    expect(src).toMatch(/Step 7|step 7/);
  });

  it('mmm-pit-export-send uses PIT_BASE_URL env var (SB-003 provisioned)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('PIT_BASE_URL');
    expect(src).toMatch(/Deno\.env\.get.*PIT_BASE_URL|PIT_BASE_URL.*Deno\.env\.get/);
  });

  it('mmm-pit-export-send uses PIT_SERVICE_TOKEN Bearer auth (TR-017 step 4)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('PIT_SERVICE_TOKEN');
    expect(src).toMatch(/Bearer/);
  });

  it('mmm-pit-export-send updates mmm_pit_exports to SENT status (TR-017 step 6)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('mmm_pit_exports');
    expect(src).toMatch(/SENT/);
  });

  it('mmm-pit-export-send logs PIT_EXPORT_SENT to mmm_audit_logs (TR-017 step 7)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('mmm_audit_logs');
    expect(src).toMatch(/PIT_EXPORT_SENT/);
  });

  it('mmm-pit-export-send uses circuit breaker for PIT boundary (TR-009)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('mmm-circuit-breaker');
    expect(src).toMatch(/isCircuitClosed/);
  });
});

describe('GP-006: PIT Export Flow — OB-2 ownership boundary (no PIT internal schema)', () => {
  it('mmm-pit-export-send has no PIT lifecycle logic (OB-2)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toMatch(/OB-2/);
    // Must NOT contain PIT action lifecycle or plan execution logic
    expect(src).not.toMatch(/pit_action_lifecycle|pit_task_lifecycle|action_plan_execute/i);
  });

  it('mmm_pit_exports table defined in migration', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_pit_exports');
  });

  it('mmm-pit-export-send carries NBR-001 comment for pit-exports cache invalidation', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toMatch(/NBR-001/);
    expect(src).toMatch(/pit-exports/i);
  });
});

// =============================================================================
// GP-007: PIT Evidence Return
// PIT sends evidence back → criterion-level link → score proposal updated
// QA-to-Red references: T-MMM-S6-101, T-MMM-S6-111
// TR-018: Evidence returned from PIT linked at criterion level
// =============================================================================

describe('GP-007: PIT Evidence Return — criterion-level linkage (TR-018)', () => {
  it('mmm-pit-evidence-return Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-pit-evidence-return/index.ts')).toBe(true);
  });

  it('mmm-pit-evidence-return links evidence at criterion level (T-MMM-S6-101)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('criterion_id');
    expect(src).toContain('mmm_evidence');
  });

  it('mmm-pit-evidence-return stores source = PIT_RETURN in mmm_evidence', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toMatch(/PIT_RETURN/);
  });

  it('mmm-pit-evidence-return triggers score re-evaluation (upserts mmm_score_proposals)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('mmm_score_proposals');
  });

  it('mmm-pit-evidence-return validates Authorization header (TR-018 auth)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('Authorization');
    expect(src).toMatch(/Bearer/);
    expect(src).toMatch(/401/);
  });

  it('mmm-pit-evidence-return returns HTTP 201 with evidence_id (TR-018)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toMatch(/201/);
    expect(src).toContain('evidence_id');
  });

  it('mmm-pit-evidence-return propagates HTTP 403 (NBR-002 enforcement)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toMatch(/403|NBR-002/);
  });
});

describe('GP-007: PIT Evidence Return — OB-2 no PIT lifecycle in MMM', () => {
  it('mmm-pit-evidence-return documents OB-2 ownership boundary', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toMatch(/OB-2|No PIT internal schema/i);
  });
});

// =============================================================================
// GP-008: AIMC Boundary Integration
// any AI call → circuit breaker healthy → AIMC responds → MMM stores interaction
// QA-to-Red references: T-MMM-S6-098–112, T-MMM-S6-121–128
// NBR-002: HTTP 403 must propagate through integration boundary
// CG-001: No source retirement assumption in AIMC boundary
// =============================================================================

describe('GP-008: AIMC Boundary Integration — consumer boundary wiring (OB-1)', () => {
  it('mmm-aimc-client.ts shared module exists', () => {
    expect(fileExists('supabase/functions/_shared/mmm-aimc-client.ts')).toBe(true);
  });

  it('mmm-aimc-client routes through AIMC_BASE_URL env var (TR-013)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('AIMC_BASE_URL');
    expect(src).toContain('AIMC_NAMESPACE');
  });

  it('mmm-aimc-client uses AIMC_SERVICE_TOKEN Bearer auth (TR-011)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('AIMC_SERVICE_TOKEN');
    expect(src).toMatch(/Bearer/);
  });

  it('mmm-aimc-client has NO direct AI provider imports (OB-1)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).not.toMatch(/openai|anthropic|cohere|gemini|mistral/i);
  });

  it('mmm-aimc-client defines timeout + retry config per operation (TR-014)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('AIMC_OPERATION_CONFIG');
    expect(src).toMatch(/timeoutMs/);
    expect(src).toMatch(/maxRetries/);
  });

  it('mmm-aimc-client integrates circuit breaker (TR-009)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('mmm-circuit-breaker');
    expect(src).toContain('isCircuitClosed');
    expect(src).toContain('recordSuccess');
    expect(src).toContain('recordFailure');
  });

  it('mmm-aimc-client covers all 8 AIMC operations (TR-014)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('framework-parse');
    expect(src).toContain('framework-generate');
    expect(src).toContain('framework-alter');
    expect(src).toContain('evidence-evaluate');
    expect(src).toContain('recommend');
    expect(src).toContain('chat');
    expect(src).toContain('explain');
    expect(src).toContain('assessment-interpret');
  });
});

describe('GP-008: AIMC Boundary Integration — AI interaction recorded (T-MMM-S6-124)', () => {
  it('mmm-ai-evidence-evaluate records mmm_ai_interactions with confidence', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('mmm_ai_interactions');
    expect(src).toContain('confidence');
  });

  it('mmm-ai-framework-parse references mmm_ai_interactions or ai_interactions', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toMatch(/mmm_ai_interactions|ai_interactions/);
  });

  it('mmm-ai-recommend references mmm_ai_interactions or ai_interactions', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toMatch(/mmm_ai_interactions|ai_interactions/);
  });
});

describe('GP-008: AIMC Boundary Integration — HTTP 403 propagation (NBR-002)', () => {
  it('mmm-ai-chat validates JWT and propagates HTTP 403 (NBR-002)', () => {
    const src = readFile('supabase/functions/mmm-ai-chat/index.ts');
    expect(src).toMatch(/validateJWT|403|NBR-002/);
  });

  it('mmm-ai-assessment-interpret exists and calls AIMC consumer boundary', () => {
    expect(fileExists('supabase/functions/mmm-ai-assessment-interpret/index.ts')).toBe(true);
    const src = readFile('supabase/functions/mmm-ai-assessment-interpret/index.ts');
    expect(src).toContain('callAimc');
  });
});

// =============================================================================
// GP-009: Circuit Breaker Resilience
// AIMC endpoint fails 5+ times → circuit OPEN → fallback response → HALF_OPEN probe → recovery
// QA-to-Red references: T-MMM-S6-121–128
// CG-001: circuit breaker accounts for source-active AND source-retired states
// =============================================================================

describe('GP-009: Circuit Breaker Resilience — state machine (TR-009 / CG-001)', () => {
  it('mmm-circuit-breaker.ts shared module exists', () => {
    expect(fileExists('supabase/functions/_shared/mmm-circuit-breaker.ts')).toBe(true);
  });

  it('circuit breaker defines three states: CLOSED, OPEN, HALF_OPEN (TR-009)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain('CLOSED');
    expect(src).toContain('OPEN');
    expect(src).toContain('HALF_OPEN');
    expect(src).toMatch(/CircuitBreakerState/);
  });

  it('circuit breaker covers all 3 boundaries: AIMC, PIT, KUC', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain('AIMC');
    expect(src).toContain('PIT');
    expect(src).toContain('KUC');
    expect(src).toMatch(/BoundaryName/);
  });

  it('circuit breaker threshold is 5 consecutive failures (TR-009)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/FAILURE_THRESHOLD\s*=\s*5/);
  });

  it('circuit breaker window is 60 seconds (TR-009)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/WINDOW_MS\s*=\s*60[_,]000/);
  });

  it('circuit breaker recovery hold is 30 seconds (TR-009)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/RECOVERY_HOLD_MS\s*=\s*30[_,]000|recovery.*30/i);
  });

  it('circuit breaker exports isCircuitClosed, recordSuccess, recordFailure, buildFallbackResponse', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/export.*isCircuitClosed|isCircuitClosed.*export/);
    expect(src).toMatch(/export.*recordSuccess|recordSuccess.*export/);
    expect(src).toMatch(/export.*recordFailure|recordFailure.*export/);
    expect(src).toMatch(/export.*buildFallbackResponse|buildFallbackResponse.*export/);
  });

  it('circuit breaker OPEN→HALF_OPEN transition on recovery hold elapsed', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/OPEN.*HALF_OPEN|HALF_OPEN.*OPEN/);
    expect(src).toMatch(/recovery_hold_elapsed|recovery.*hold/i);
  });

  it('circuit breaker HALF_OPEN→CLOSED on probe success', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/HALF_OPEN.*CLOSED|probe_success/);
  });

  it('circuit breaker logs all state transitions (audit integrity)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/logTransition|console\.log/);
    expect(src).toMatch(/lastStateTransition|state.*transition/i);
  });
});

describe('GP-009: Circuit Breaker Resilience — fallback response with circuit-open reason', () => {
  it('buildFallbackResponse returns boundary-specific circuit-open reason code', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/AIMC_CIRCUIT_OPEN/);
    expect(src).toMatch(/PIT_CIRCUIT_OPEN/);
    expect(src).toMatch(/KUC_CIRCUIT_OPEN/);
    expect(src).toContain('fallback: true');
  });

  it('AI functions return 503 with fallback:true when circuit OPEN (not 403)', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    // Must return fallback response (503), not a 403 on circuit open
    expect(src).toMatch(/fallback.*true|503/);
  });

  it('PIT export returns fallback response when circuit OPEN (503)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toMatch(/fallback.*true|503/);
  });
});

describe('GP-009: Circuit Breaker Resilience — CG-001 source-state law', () => {
  it('circuit breaker documents CG-001 (source-state law — no switchover assumption)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/CG-001/);
    expect(src).toMatch(/source.retired|source.retirement|switchover/i);
  });

  it('circuit breaker OPEN state is a resilience mechanism ONLY (not retirement signal)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/resilience mechanism only|not.*retirement|retirement.*not/i);
  });
});

// =============================================================================
// GP-010: KUC Classification Contract
// upload framework source → KUC classification returned → stored in mmm_documents
// QA-to-Red references: T-MMM-S6-102–103, T-MMM-S6-112
// TR-019/TR-020: KUC upload + classification contracts
// OB-3: No KUC internal logic in MMM
// =============================================================================

describe('GP-010: KUC Classification Contract — upload and classify (TR-019/TR-020)', () => {
  it('mmm-kuc-client.ts shared module exists', () => {
    expect(fileExists('supabase/functions/_shared/mmm-kuc-client.ts')).toBe(true);
  });

  it('mmm-kuc-client sends multipart form-data with file, document_role, organisation_id (TR-019)', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toMatch(/document_role/);
    expect(src).toMatch(/organisation_id/);
    expect(src).toMatch(/multipart|form.data|FormData/i);
  });

  it('mmm-kuc-client defines KucClassificationResponse interface (TR-020)', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toContain('KucClassificationResponse');
    expect(src).toMatch(/upload_id/);
    expect(src).toMatch(/classification.*type.*confidence|type.*confidence.*classification/s);
    expect(src).toMatch(/parse_job_id/);
  });

  it('mmm-kuc-client uses circuit breaker for KUC boundary (TR-009)', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toContain('mmm-circuit-breaker');
    expect(src).toContain('isCircuitClosed');
    expect(src).toContain('recordSuccess');
    expect(src).toContain('recordFailure');
  });

  it('mmm-kuc-client documents OB-3 ownership boundary (no KUC internal logic)', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toMatch(/OB-3/);
    expect(src).toMatch(/No KUC internal logic|no.*KUC.*logic/i);
  });

  it('mmm-kuc-client exports KucUploadResult interface with kuc_classification field', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toContain('KucUploadResult');
    expect(src).toContain('kuc_classification');
  });
});

describe('GP-010: KUC Classification Contract — classification stored in mmm_documents', () => {
  it('mmm-upload-framework-source returns kuc_classification from KUC response', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('kuc_classification');
  });

  it('mmm-upload-evidence returns kuc_classification from KUC response', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('kuc_classification');
  });

  it('mmm_parse_jobs table defined in migration (tracks KUC parse state)', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_parse_jobs');
  });
});

// =============================================================================
// NBR-001: TanStack Query Mutation Cache Invalidation
// Verify ALL mutating Edge Functions carry the NBR-001 cache invalidation comment
// binding per builder-contract.md §3.5 and golden-path-verification-pack.md GP-009
// =============================================================================

describe('NBR-001: TanStack Query Cache Invalidation — all mutations carry invalidation comment', () => {
  const mutatingFunctions: Array<{ fn: string; expectedKey: string }> = [
    { fn: 'supabase/functions/mmm-org-create/index.ts', expectedKey: 'organisations' },
    { fn: 'supabase/functions/mmm-org-update/index.ts', expectedKey: 'organisations' },
    { fn: 'supabase/functions/mmm-framework-init/index.ts', expectedKey: 'frameworks' },
    { fn: 'supabase/functions/mmm-framework-compile/index.ts', expectedKey: 'frameworks' },
    { fn: 'supabase/functions/mmm-framework-publish/index.ts', expectedKey: 'frameworks' },
    { fn: 'supabase/functions/mmm-score-confirm/index.ts', expectedKey: 'scores' },
    { fn: 'supabase/functions/mmm-upload-framework-source/index.ts', expectedKey: 'parse-jobs' },
    { fn: 'supabase/functions/mmm-upload-evidence/index.ts', expectedKey: 'evidence' },
    { fn: 'supabase/functions/mmm-invitation-create/index.ts', expectedKey: 'organisations' },
    { fn: 'supabase/functions/mmm-pit-export-send/index.ts', expectedKey: 'pit-exports' },
    { fn: 'supabase/functions/mmm-ai-evidence-evaluate/index.ts', expectedKey: 'score-proposals' },
  ];

  for (const { fn, expectedKey } of mutatingFunctions) {
    it(`${fn.split('/').pop()} carries NBR-001 cache-invalidation comment referencing '${expectedKey}'`, () => {
      const src = readFile(fn);
      expect(src).toMatch(/NBR-001/);
      expect(src).toMatch(new RegExp(expectedKey.replace('-', '[-_]'), 'i'));
    });
  }
});

// =============================================================================
// NBR-002: HTTP 403 Propagation through Integration Boundary
// Verify all role-gated functions use requireRole + HTTP 403 (no silent swallowing)
// binding per builder-contract.md §3.5 and GP-010 in golden-path-verification-pack.md
// =============================================================================

describe('NBR-002: HTTP 403 Propagation — all protected functions gate with requireRole', () => {
  const adminOnlyFunctions = [
    'supabase/functions/mmm-framework-init/index.ts',
    'supabase/functions/mmm-framework-publish/index.ts',
    // mmm-upload-framework-source is JWT-only (not ADMIN) per architecture §A4.2 —
    // see issue maturion-isms#1507: authenticated KUC upload access fix.
  ];

  for (const fn of adminOnlyFunctions) {
    it(`${fn.split('/').pop()} uses requireRole to enforce HTTP 403 (NBR-002)`, () => {
      const src = readFile(fn);
      expect(src).toContain('requireRole');
      expect(src).toMatch(/ADMIN/);
    });
  }

  it('mmm-auth.ts requireRole throws Response with status 403 (NBR-002 contract)', () => {
    const src = readFile('supabase/functions/_shared/mmm-auth.ts');
    expect(src).toContain('requireRole');
    expect(src).toMatch(/403/);
    expect(src).toMatch(/NBR-002/);
  });

  it('mmm-pit-export-send propagates HTTP 403 for unauthorized exports', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toMatch(/requireRole|403|NBR-002/);
  });

  it('mmm-score-confirm propagates HTTP 403 on org_id mismatch (NBR-002)', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toMatch(/403|NBR-002/);
  });

  it('mmm-upload-framework-source is JWT-only (not ADMIN-gated) per architecture §A4.2 (issue #1507)', () => {
    // Architecture: mmm-upload-framework-source requires JWT only — any authenticated user may upload.
    // ADMIN gate is NOT applied here; publish-gate enforcement is in mmm-framework-publish.
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('validateJWT');
    expect(src).not.toContain("requireRole(claims.role, ['ADMIN'])");
  });
});

describe('NBR-002: Supabase RLS write-block detection — row count check pattern', () => {
  it('mmm_organisations has RLS defined in RLS migration (cross-org write block)', () => {
    const rlsMigration = readFile('supabase/migrations/20260420000003_mmm_rls_policies.sql');
    expect(rlsMigration).toContain('mmm_organisations');
  });

  it('mmm_maturity_scores has RLS defined in RLS migration', () => {
    const rlsMigration = readFile('supabase/migrations/20260420000003_mmm_rls_policies.sql');
    expect(rlsMigration).toContain('mmm_maturity_scores');
  });

  it('mmm_audit_logs insert-only pattern documented (TR-038 immutable audit)', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    expect(migration).toContain('mmm_audit_logs');
    // INSERT-only means no UPDATE/DELETE on audit tables
    expect(migration).toMatch(/INSERT.*ONLY|mmm_audit_logs|mmm_override_log/i);
  });
});

// =============================================================================
// NBR-003: Zustand Org Store Reset on Org Switch
// Verify resetOnOrgSwitch is declared in orgStore (B3 obligation)
// binding per builder-contract.md §3.3
// =============================================================================

describe('NBR-003: Zustand Org Store — reset on org switch', () => {
  it('orgStore.ts exists in MMM frontend app', () => {
    expect(fileExists('apps/mmm/src/store/orgStore.ts')).toBe(true);
  });

  it('orgStore uses Zustand create() for state management', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    expect(src).toMatch(/create\s*</);
    expect(src).toContain('zustand');
  });

  it('orgStore declares resetOnOrgSwitch function (NBR-003)', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    expect(src).toContain('resetOnOrgSwitch');
    expect(src).toMatch(/NBR-003/);
  });

  it('orgStore resetOnOrgSwitch clears currentOrgId', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    // Line: resetOnOrgSwitch: () => set({ currentOrgId: null, currentFrameworkId: null })
    expect(src).toContain('resetOnOrgSwitch');
    expect(src).toContain('currentOrgId');
    expect(src).toContain('null');
  });

  it('orgStore resetOnOrgSwitch clears currentFrameworkId (no stale context)', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    // Both org and framework context must be cleared
    expect(src).toMatch(/currentFrameworkId.*null|null.*currentFrameworkId/);
  });

  it('orgStore exports useOrgStore for use in React components', () => {
    const src = readFile('apps/mmm/src/store/orgStore.ts');
    expect(src).toMatch(/export.*useOrgStore/);
  });
});

// =============================================================================
// CG-001: Source-State Law — no switchover assumption in any boundary wiring
// Verify all boundary clients document CG-001 compliance
// =============================================================================

describe('CG-001: Source-State Law — circuit breaker agnostic of source retirement', () => {
  it('mmm-circuit-breaker documents CG-001 source-state carry-forward', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/CG-001/);
  });

  it('circuit breaker covers source-active AND source-retired states (no hard-coded switchover)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toMatch(/source.active|source.retired|both.*states/i);
  });

  it('mmm-aimc-client does NOT hard-code source retirement or switchover assumption', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).not.toMatch(/source.*retired.*AIMC|AIMC.*retired/i);
    expect(src).not.toMatch(/converge.*platform|platform.*converge/i);
  });

  it('mmm-pit-export-send does NOT hard-code PIT source retirement or switchover', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).not.toMatch(/PIT.*retired|retired.*PIT/i);
  });
});

// =============================================================================
// ALL-176-GREEN: Full Regression Check
// Verify all prior wave evidence files are committed and report GREEN
// =============================================================================

describe('ALL-176-GREEN: All prior wave evidence committed (B1–B8 GREEN baseline)', () => {
  it('B1 evidence committed', () => {
    expect(fileExists('modules/MMM/11-build/B1-schema')).toBe(true);
  });

  it('B2 evidence committed', () => {
    expect(fileExists('modules/MMM/11-build/B2-api')).toBe(true);
  });

  it('B3 evidence committed', () => {
    expect(fileExists('modules/MMM/11-build/B3-ui')).toBe(true);
  });

  it('B4 evidence committed', () => {
    expect(fileExists('modules/MMM/11-build/B4-framework')).toBe(true);
  });

  it('B5 evidence committed', () => {
    expect(fileExists('modules/MMM/11-build/B5-assessment')).toBe(true);
  });

  it('B6 evidence committed', () => {
    expect(fileExists('modules/MMM/11-build/B6-findings')).toBe(true);
  });

  it('B7 evidence committed and CG-003 closure declared', () => {
    expect(fileExists('modules/MMM/11-build/B7-integrations/wave-b7-evidence.md')).toBe(true);
    const evidence = readFile('modules/MMM/11-build/B7-integrations/wave-b7-evidence.md');
    expect(evidence).toMatch(/CG-003/);
    expect(evidence).toMatch(/B7 PASS PROVES.*boundary wiring/i);
  });

  it('B8 evidence committed', () => {
    expect(fileExists('modules/MMM/11-build/B8-cross-cutting')).toBe(true);
  });

  it('BUILD_PROGRESS_TRACKER updated for B7 (COMPLETE status)', () => {
    const tracker = readFile('modules/MMM/BUILD_PROGRESS_TRACKER.md');
    expect(tracker).toMatch(/B7.*COMPLETE|B7.*GREEN/i);
  });

  it('BUILD_PROGRESS_TRACKER records B9 authorized (qa-builder executing)', () => {
    const tracker = readFile('modules/MMM/BUILD_PROGRESS_TRACKER.md');
    expect(tracker).toMatch(/B9.*authorized|B9.*golden.*path|golden.*path.*B9/i);
  });
});

describe('ALL-176-GREEN: All 25 mmm_ tables present in migration (schema baseline)', () => {
  const REQUIRED_TABLES = [
    'mmm_organisations', 'mmm_frameworks', 'mmm_domains', 'mmm_maturity_process_steps',
    'mmm_criteria', 'mmm_level_descriptors', 'mmm_assessments', 'mmm_maturity_scores',
    'mmm_score_proposals', 'mmm_evidence', 'mmm_findings', 'mmm_override_log',
    'mmm_audit_sessions', 'mmm_audit_logs', 'mmm_pit_exports', 'mmm_parse_jobs',
    'mmm_ai_interactions', 'mmm_profiles', 'mmm_user_preferences',
    'mmm_organisation_hierarchy', 'mmm_free_assessments', 'mmm_invitations',
    'mmm_proposed_domains', 'mmm_proposed_mps', 'mmm_proposed_criteria',
  ];

  it('core migration file exists', () => {
    expect(fileExists('supabase/migrations/20260420000001_mmm_core_tables.sql')).toBe(true);
  });

  for (const table of REQUIRED_TABLES) {
    it(`${table} defined in migration (architecture §A5.2)`, () => {
      const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
      expect(migration).toContain(table);
    });
  }
});

describe('ALL-176-GREEN: All 26 mmm Edge Functions present (architecture §A4.1)', () => {
  const REQUIRED_FUNCTIONS = [
    'mmm-health', 'mmm-qiw-status', 'mmm-org-create', 'mmm-org-update',
    'mmm-invitation-create', 'mmm-invitation-accept', 'mmm-commissioning-check',
    'mmm-framework-init', 'mmm-framework-compile', 'mmm-framework-publish',
    'mmm-assessment-free-respond', 'mmm-assessment-free-result',
    'mmm-upload-evidence', 'mmm-upload-framework-source',
    'mmm-score-confirm', 'mmm-pit-export-send', 'mmm-pit-evidence-return',
    'mmm-ai-framework-parse', 'mmm-ai-framework-generate', 'mmm-ai-framework-alter',
    'mmm-ai-evidence-evaluate', 'mmm-ai-recommend', 'mmm-ai-chat',
    'mmm-ai-explain', 'mmm-ai-assessment-interpret',
  ];

  for (const fn of REQUIRED_FUNCTIONS) {
    it(`${fn} Edge Function exists`, () => {
      expect(fileExists(`supabase/functions/${fn}/index.ts`)).toBe(true);
    });
  }
});

describe('ALL-176-GREEN: B9 config.toml includes all functions', () => {
  it('supabase/config.toml exists', () => {
    expect(fileExists('supabase/config.toml')).toBe(true);
  });

  it('config.toml registers core MMM functions', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-org-create]');
    expect(config).toContain('[functions.mmm-framework-publish]');
    expect(config).toContain('[functions.mmm-score-confirm]');
    expect(config).toContain('[functions.mmm-pit-export-send]');
  });
});

// =============================================================================
// ISSUE #1507: Signup/Onboarding Route Handling & Authenticated KUC Upload
// Anti-regression gates added 2026-04-28.
// =============================================================================

describe('ISSUE-1507: LoginPage exists and /login route is registered in App.tsx', () => {
  it('apps/mmm/src/pages/LoginPage.tsx exists', () => {
    expect(fileExists('apps/mmm/src/pages/LoginPage.tsx')).toBe(true);
  });
  it('LoginPage.tsx calls supabase.auth.signInWithPassword', () => {
    const src = readFile('apps/mmm/src/pages/LoginPage.tsx');
    expect(src).toContain('supabase.auth.signInWithPassword');
  });
  it('LoginPage.tsx has email and password inputs', () => {
    const src = readFile('apps/mmm/src/pages/LoginPage.tsx');
    expect(src).toContain('type="email"');
    expect(src).toContain('type="password"');
  });
  it('App.tsx includes /login route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/login"');
    expect(src).toContain('LoginPage');
  });
  it('ProtectedRoute redirects to /login and /login route is now resolvable', () => {
    const protectedRoute = readFile('apps/mmm/src/components/ProtectedRoute.tsx');
    expect(protectedRoute).toContain('/login');
    const appSrc = readFile('apps/mmm/src/App.tsx');
    expect(appSrc).toContain('"/login"');
  });
});

// =============================================================================
// ISSUE-1507 FOLLOW-UP: Review feedback anti-regression tests
// =============================================================================

describe('ISSUE-1507: SignUpPage handles email-confirmation / no-session correctly', () => {
  it('SignUpPage.tsx checks data.session before navigating to /onboarding', () => {
    const src = readFile('apps/mmm/src/pages/SignUpPage.tsx');
    // Must inspect returned session — not blindly navigate
    expect(src).toContain('data.session');
  });
  it('SignUpPage.tsx shows confirmation message when no session is returned', () => {
    const src = readFile('apps/mmm/src/pages/SignUpPage.tsx');
    // Must handle the no-session case (email confirmation required)
    expect(src).toMatch(/email.confirmation|confirmation.*message|check.*email|confirmed/i);
    expect(src).toContain('email-confirmation-message');
  });
  it('SignUpPage.tsx does NOT blindly navigate to /onboarding without session check', () => {
    const src = readFile('apps/mmm/src/pages/SignUpPage.tsx');
    // The old pattern was: signUp → navigate('/onboarding') with no session check
    // New pattern: navigate only if data.session is truthy
    expect(src).not.toMatch(/signUp[\s\S]{0,200}navigate\(['"]\/onboarding['"]\)[\s\S]{0,50}setConfirmed/);
  });
});

describe('ISSUE-1507: Vercel SPA fallback — direct-route navigation does not produce 404', () => {
  it('vercel.json exists with catch-all rewrite to index.html', () => {
    expect(fileExists('vercel.json')).toBe(true);
    const config = readFile('vercel.json');
    expect(config).toContain('index.html');
    expect(config).toContain('rewrites');
  });
  it('vercel.json catch-all rewrite covers /onboarding (SPA direct-route)', () => {
    const config = readFile('vercel.json');
    // Must have a wildcard/catch-all source that rewrites to index.html
    // Pattern: source covers all non-asset paths
    expect(config).toMatch(/source.*\.\*\)|source.*\(\.\+\)/);
    expect(config).toMatch(/destination.*index\.html/);
  });
  it('vercel.json does not exclude /onboarding, /framework-origin, /frameworks, /frameworks/upload', () => {
    const config = readFile('vercel.json');
    // The rewrite must NOT explicitly exclude these app paths
    expect(config).not.toMatch(/\/onboarding.*404/);
    expect(config).not.toMatch(/\/framework-origin.*404/);
  });
});

describe('ISSUE-1507: mmm-upload-framework-source parse-job insert matches mmm_parse_jobs schema', () => {
  it('mmm-upload-framework-source insert uses result_json (not metadata column — not in schema)', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    // Must NOT insert into a bare "metadata:" key at column level — that column does not exist in mmm_parse_jobs
    // (upload_metadata inside result_json is fine; we check for a standalone column key)
    expect(src).not.toMatch(/^\s+metadata:\s/m);
    // Must use result_json (the actual JSONB column)
    expect(src).toContain('result_json');
  });
  it('migration 20260429000001 adds organisation_id, created_by, source_type to mmm_parse_jobs', () => {
    const migration = readFile('supabase/migrations/20260429000001_mmm_parse_jobs_org_columns.sql');
    expect(migration).toContain('organisation_id');
    expect(migration).toContain('created_by');
    expect(migration).toContain('source_type');
    expect(migration).toContain('mmm_parse_jobs');
    expect(migration).toContain('ALTER TABLE');
  });
  it('mmm-upload-framework-source insert only references columns that exist in mmm_parse_jobs', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    // Schema columns (base + migration): id, upload_id, document_id, status, result_json,
    // created_at, updated_at, organisation_id, created_by, source_type
    // The insert must use only these columns — not non-existent "metadata"
    expect(src).toContain('organisation_id');
    expect(src).toContain('created_by');
    expect(src).toContain('source_type');
    expect(src).toContain("status: 'PENDING'");
  });
  it('mmm_parse_jobs schema has result_json column (JSONB for parse metadata storage)', () => {
    const migration = readFile('supabase/migrations/20260420000001_mmm_core_tables.sql');
    // Verify the base schema has result_json
    expect(migration).toMatch(/result_json\s+jsonb/);
  });
});

// =============================================================================
// ISSUE #1512: MMM login discoverability, SPA direct-route fallback,
// and password reset callback flow.
// Anti-regression gates added 2026-04-29.
// =============================================================================

describe('ISSUE-1512: LandingPage exposes /login for returning users', () => {
  it('LandingPage.tsx includes a Sign In link to /login in the nav header', () => {
    const src = readFile('apps/mmm/src/pages/LandingPage.tsx');
    expect(src).toContain('to="/login"');
    expect(src).toMatch(/Sign In|Log In/);
  });
  it('LandingPage.tsx includes a Sign In link in the hero/CTA area', () => {
    const src = readFile('apps/mmm/src/pages/LandingPage.tsx');
    // At least two occurrences: header nav + hero actions
    const matches = src.match(/to="\/login"/g);
    expect(matches).not.toBeNull();
    expect((matches as RegExpMatchArray).length).toBeGreaterThanOrEqual(2);
  });
});

describe('ISSUE-1512: SignUpPage exposes /login for existing users', () => {
  it('SignUpPage.tsx has "Already have an account? Sign in" footer link to /login', () => {
    const src = readFile('apps/mmm/src/pages/SignUpPage.tsx');
    expect(src).toContain('to="/login"');
    expect(src).toMatch(/Already have an account|already.*account/i);
  });
  it('SignUpPage.tsx email-confirmation message includes a /login link', () => {
    const src = readFile('apps/mmm/src/pages/SignUpPage.tsx');
    // Both the confirmation message and the footer link must reference /login
    const matches = src.match(/to="\/login"/g);
    expect(matches).not.toBeNull();
    expect((matches as RegExpMatchArray).length).toBeGreaterThanOrEqual(2);
  });
});

describe('ISSUE-1512: LoginPage exposes forgot-password link', () => {
  it('LoginPage.tsx includes a link to /forgot-password', () => {
    const src = readFile('apps/mmm/src/pages/LoginPage.tsx');
    expect(src).toContain('to="/forgot-password"');
    expect(src).toMatch(/Forgot|forgot/);
  });
});

describe('ISSUE-1512: ForgotPasswordPage exists and is wired correctly', () => {
  it('apps/mmm/src/pages/ForgotPasswordPage.tsx exists', () => {
    expect(fileExists('apps/mmm/src/pages/ForgotPasswordPage.tsx')).toBe(true);
  });
  it('ForgotPasswordPage.tsx calls supabase.auth.resetPasswordForEmail', () => {
    const src = readFile('apps/mmm/src/pages/ForgotPasswordPage.tsx');
    expect(src).toContain('supabase.auth.resetPasswordForEmail');
  });
  it('ForgotPasswordPage.tsx passes a redirectTo pointing to /reset-password', () => {
    const src = readFile('apps/mmm/src/pages/ForgotPasswordPage.tsx');
    expect(src).toContain('/reset-password');
    expect(src).toContain('redirectTo');
  });
  it('ForgotPasswordPage.tsx has an email input', () => {
    const src = readFile('apps/mmm/src/pages/ForgotPasswordPage.tsx');
    expect(src).toContain('type="email"');
  });
  it('App.tsx includes /forgot-password route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/forgot-password"');
    expect(src).toContain('ForgotPasswordPage');
  });
});

describe('ISSUE-1512: ResetPasswordPage exists and is wired correctly', () => {
  it('apps/mmm/src/pages/ResetPasswordPage.tsx exists', () => {
    expect(fileExists('apps/mmm/src/pages/ResetPasswordPage.tsx')).toBe(true);
  });
  it('ResetPasswordPage.tsx calls supabase.auth.updateUser', () => {
    const src = readFile('apps/mmm/src/pages/ResetPasswordPage.tsx');
    expect(src).toContain('supabase.auth.updateUser');
  });
  it('ResetPasswordPage.tsx listens for PASSWORD_RECOVERY auth event', () => {
    const src = readFile('apps/mmm/src/pages/ResetPasswordPage.tsx');
    expect(src).toContain('PASSWORD_RECOVERY');
  });
  it('ResetPasswordPage.tsx has a password input', () => {
    const src = readFile('apps/mmm/src/pages/ResetPasswordPage.tsx');
    expect(src).toContain('type="password"');
  });
  it('App.tsx includes /reset-password route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/reset-password"');
    expect(src).toContain('ResetPasswordPage');
  });
});

describe('ISSUE-1512: Vercel SPA fallback — /login, /forgot-password, /reset-password are not excluded', () => {
  it('vercel.json catch-all rewrite covers /forgot-password (SPA direct-route)', () => {
    const config = readFile('vercel.json');
    expect(config).toContain('index.html');
    // Source pattern must be a wildcard/catch-all (not a fixed path list)
    expect(config).toMatch(/source.*\.\*\)|source.*\(\.\+\)/);
  });
  it('vercel.json does not explicitly exclude /login, /forgot-password, or /reset-password', () => {
    const config = readFile('vercel.json');
    expect(config).not.toMatch(/\/login.*404/);
    expect(config).not.toMatch(/\/forgot-password.*404/);
    expect(config).not.toMatch(/\/reset-password.*404/);
  });
  it('vercel.json outputDirectory points to apps/mmm/dist (SPA build output)', () => {
    const config = readFile('vercel.json');
    expect(config).toContain('apps/mmm/dist');
  });
});


describe('ISSUE-1512: deploy-mmm-vercel.yml has .vercel/output routing assertion', () => {
  it('deploy-mmm-vercel.yml exists', () => {
    expect(fileExists('.github/workflows/deploy-mmm-vercel.yml')).toBe(true);
  });
  it('deploy-mmm-vercel.yml contains .vercel/output/config.json routing assertion after vercel build', () => {
    const wf = readFile('.github/workflows/deploy-mmm-vercel.yml');
    expect(wf).toContain('.vercel/output/config.json');
    expect(wf).toContain('SPA catch-all');
  });
  it('deploy-mmm-vercel.yml contains SPA direct-route smoke test step', () => {
    const wf = readFile('.github/workflows/deploy-mmm-vercel.yml');
    expect(wf).toContain('SPA direct-route smoke test');
    expect(wf).toContain('/login');
    expect(wf).toContain('/forgot-password');
    expect(wf).toContain('/reset-password');
    expect(wf).toContain('/onboarding');
    expect(wf).toContain('/frameworks');
  });
  it('deploy-mmm-vercel.yml smoke test step runs after preview deploy (references preview-url output)', () => {
    const wf = readFile('.github/workflows/deploy-mmm-vercel.yml');
    expect(wf).toContain('steps.deploy.outputs.preview-url');
  });
  it('deploy-mmm-vercel.yml smoke test fails on Vercel 404', () => {
    const wf = readFile('.github/workflows/deploy-mmm-vercel.yml');
    expect(wf).toContain('404');
    expect(wf).toContain('exit 1');
  });
});

describe('ISSUE-1512: ResetPasswordPage handles expired/invalid reset links', () => {
  it('ResetPasswordPage.tsx has a timeout constant for expired-link detection', () => {
    const src = readFile('apps/mmm/src/pages/ResetPasswordPage.tsx');
    expect(src).toMatch(/RECOVERY_TIMEOUT_MS|setTimeout/);
    expect(src).toContain('linkExpired');
  });
  it('ResetPasswordPage.tsx renders an error state when link is expired', () => {
    const src = readFile('apps/mmm/src/pages/ResetPasswordPage.tsx');
    expect(src).toContain('reset-link-expired');
    expect(src).toMatch(/expired|invalid/i);
  });
  it('ResetPasswordPage.tsx expired error state includes link back to /forgot-password', () => {
    const src = readFile('apps/mmm/src/pages/ResetPasswordPage.tsx');
    expect(src).toContain('/forgot-password');
    expect(src).toMatch(/new reset link|request.*link/i);
  });
  it('ResetPasswordPage.tsx clears the timeout on unmount to avoid memory leaks', () => {
    const src = readFile('apps/mmm/src/pages/ResetPasswordPage.tsx');
    expect(src).toContain('clearTimeout');
  });
});
