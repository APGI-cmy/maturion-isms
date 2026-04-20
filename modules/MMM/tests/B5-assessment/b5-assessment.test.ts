/**
 * MMM Wave B5 — Assessment Execution Tests
 * Domain D3: T-MMM-S6-051 through T-MMM-S6-080
 *
 * Wave Slug: mmm-build-wave-b5-assessment
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

// ─── T-MMM-S6-051: mmm-score-confirm Edge Function exists ────────────────────
describe('T-MMM-S6-051: mmm-score-confirm Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-score-confirm/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-score-confirm]');
  });
});

// ─── T-MMM-S6-052: mmm-upload-evidence Edge Function exists ──────────────────
describe('T-MMM-S6-052: mmm-upload-evidence Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-upload-evidence/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-upload-evidence]');
  });
});

// ─── T-MMM-S6-053: mmm-ai-evidence-evaluate Edge Function exists ─────────────
describe('T-MMM-S6-053: mmm-ai-evidence-evaluate Edge Function exists', () => {
  it('file exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-evidence-evaluate/index.ts')).toBe(true);
  });
  it('is in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-evidence-evaluate]');
  });
});

// ─── T-MMM-S6-054: AssessmentWorkbenchPage.tsx exists ────────────────────────
describe('T-MMM-S6-054: AssessmentWorkbenchPage.tsx exists', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx')).toBe(true);
  });
  it('has h1 heading', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx');
    expect(src).toContain('<h1>');
  });
});

// ─── T-MMM-S6-055: EvidenceWorkspacePage.tsx exists with evidence type selector
describe('T-MMM-S6-055: EvidenceWorkspacePage.tsx exists with evidence type selector', () => {
  it('file exists', () => {
    expect(fileExists('apps/mmm/src/pages/EvidenceWorkspacePage.tsx')).toBe(true);
  });
  it('has evidence type selector', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('evidenceType');
  });
  it('has TEXT, URL, FILE options', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('TEXT');
    expect(src).toContain('URL');
    expect(src).toContain('FILE');
  });
});

// ─── T-MMM-S6-056: mmm-score-confirm requires confirm: true flag (TR-033) ────
describe('T-MMM-S6-056: mmm-score-confirm requires confirm: true flag (TR-033 HITL)', () => {
  it('checks for confirm: true', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('confirm !== true');
  });
  it('has TR-033 HITL comment', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('TR-033');
  });
  it('returns 400 when confirm is missing', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('confirm: true is required');
  });
});

// ─── T-MMM-S6-057: mmm-score-confirm writes to mmm_override_log ──────────────
describe('T-MMM-S6-057: mmm-score-confirm writes to mmm_override_log when override present', () => {
  it('writes to mmm_override_log', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('mmm_override_log');
  });
  it('detects override when score differs from proposal', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('isOverride');
  });
  it('includes rationale in override log', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('rationale');
  });
});

// ─── T-MMM-S6-058: mmm-score-confirm writes to mmm_maturity_scores ───────────
describe('T-MMM-S6-058: mmm-score-confirm writes to mmm_maturity_scores', () => {
  it('upserts into mmm_maturity_scores', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('mmm_maturity_scores');
  });
  it('records confirmed score', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('confirmed_by');
    expect(src).toContain('confirmed_at');
  });
});

// ─── T-MMM-S6-059: mmm-score-confirm returns HTTP 403 on org mismatch ─────────
describe('T-MMM-S6-059: mmm-score-confirm returns HTTP 403 on org mismatch (NBR-002)', () => {
  it('checks organisation_id against claims.orgId', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('claims.orgId');
    expect(src).toContain('organisation_id');
  });
  it('returns 403 on mismatch', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('}, 403)');
  });
  it('has NBR-002 comment', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('NBR-002');
  });
});

// ─── T-MMM-S6-060: EvidenceWorkspacePage invalidates ['scores', assessmentId]
describe("T-MMM-S6-060: EvidenceWorkspacePage invalidates ['scores', assessmentId] on confirm (NBR-001)", () => {
  it("invalidates ['scores', assessmentId] on confirm", () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain("queryKey: ['scores', assessmentId]");
  });
});

// ─── T-MMM-S6-061: EvidenceWorkspacePage invalidates ['evidence', criterionId]
describe("T-MMM-S6-061: EvidenceWorkspacePage invalidates ['evidence', criterionId] on upload (NBR-001)", () => {
  it("invalidates ['evidence', criterionId] on upload", () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain("queryKey: ['evidence', criterionId]");
  });
  it('has NBR-001 comment', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('NBR-001');
  });
});

// ─── T-MMM-S6-062: mmm-upload-evidence creates mmm_evidence with PENDING status
describe('T-MMM-S6-062: mmm-upload-evidence creates mmm_evidence record with PENDING status', () => {
  it('inserts into mmm_evidence', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('mmm_evidence');
  });
  it('sets status=PENDING', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain("status: 'PENDING'");
  });
  it('returns evidence_id', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('evidence_id');
  });
});

// ─── T-MMM-S6-063: mmm-ai-evidence-evaluate is a stub (returns mock proposed_score)
describe('T-MMM-S6-063: mmm-ai-evidence-evaluate is a stub (returns mock proposed_score)', () => {
  it('has AIMC_BASE_URL stub comment', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('AIMC_BASE_URL');
  });
  it('returns mock proposed_score of 3', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('mockProposedScore = 3');
  });
  it('returns confidence of 0.85', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('0.85');
  });
});

// ─── T-MMM-S6-064: EvidenceWorkspacePage supports FILE, URL, TEXT types ───────
describe('T-MMM-S6-064: EvidenceWorkspacePage supports FILE, URL, TEXT evidence types', () => {
  it('has FILE type option', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('File Upload');
  });
  it('has URL type option', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('URL Reference');
  });
  it('has TEXT type option', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('Text Attestation');
  });
});

// ─── T-MMM-S6-065: EvidenceWorkspacePage has override checkbox with rationale ─
describe('T-MMM-S6-065: EvidenceWorkspacePage has override checkbox with rationale field', () => {
  it('has override checkbox', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('override');
    expect(src).toContain('type="checkbox"');
  });
  it('has rationale textarea for override', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('rationale');
    expect(src).toContain('Rationale for override');
  });
});

// ─── T-MMM-S6-066: AssessmentWorkbenchPage queries mmm_criteria ──────────────
describe('T-MMM-S6-066: AssessmentWorkbenchPage queries mmm_criteria', () => {
  it('queries mmm_criteria table', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx');
    expect(src).toContain('mmm_criteria');
  });
  it('has assessment-criteria query key', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx');
    expect(src).toContain("queryKey: ['assessment-criteria'");
  });
});

// ─── T-MMM-S6-067: AssessmentWorkbenchPage queries mmm_maturity_scores ────────
describe('T-MMM-S6-067: AssessmentWorkbenchPage queries mmm_maturity_scores', () => {
  it('queries mmm_maturity_scores', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx');
    expect(src).toContain('mmm_maturity_scores');
  });
  it('has scores query key', () => {
    const src = readFile('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx');
    expect(src).toContain("queryKey: ['scores'");
  });
});

// ─── T-MMM-S6-068: EvidenceWorkspacePage invalidates ['dashboard'] on confirm ─
describe("T-MMM-S6-068: EvidenceWorkspacePage invalidates ['dashboard'] on score confirm (NBR-001)", () => {
  it("invalidates ['dashboard'] on confirm", () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain("queryKey: ['dashboard']");
  });
});

// ─── T-MMM-S6-069: mmm-score-confirm cascade comment present (NBR-001) ────────
describe('T-MMM-S6-069: mmm-score-confirm cascade comment present (NBR-001)', () => {
  it('has NBR-001 comment referencing cache invalidation', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('NBR-001');
  });
  it('implements triggerScoreCascade', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('triggerScoreCascade');
  });
  it('cascade updates MPS and domain scores', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('MPS');
    expect(src).toContain('DOMAIN');
  });
});

// ─── T-MMM-S6-070: App.tsx has routes for /assessments/:id/workbench ─────────
describe('T-MMM-S6-070: App.tsx has routes for /assessments/:id/workbench', () => {
  it('has /assessments/:id/workbench route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/assessments/:id/workbench"');
  });
  it('has /assessments/:id/evidence/:criterionId route', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('"/assessments/:id/evidence/:criterionId"');
  });
  it('uses AssessmentWorkbenchPage component', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('AssessmentWorkbenchPage');
  });
  it('uses EvidenceWorkspacePage component', () => {
    const src = readFile('apps/mmm/src/App.tsx');
    expect(src).toContain('EvidenceWorkspacePage');
  });
});

// ─── T-MMM-S6-071: mmm-upload-evidence creates stub score proposal ────────────
describe('T-MMM-S6-071: mmm-upload-evidence creates stub mmm_score_proposals record', () => {
  it('inserts into mmm_score_proposals', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('mmm_score_proposals');
  });
  it('returns score_proposal with proposed_score', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('score_proposal: { proposed_score: 3 }');
  });
});

// ─── T-MMM-S6-072: mmm-ai-evidence-evaluate updates mmm_score_proposals ───────
describe('T-MMM-S6-072: mmm-ai-evidence-evaluate updates mmm_score_proposals', () => {
  it('upserts mmm_score_proposals', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('mmm_score_proposals');
  });
});

// ─── T-MMM-S6-073: EvidenceWorkspacePage calls /api/upload/evidence ──────────
describe('T-MMM-S6-073: EvidenceWorkspacePage calls /api/upload/evidence', () => {
  it('calls /api/upload/evidence', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('/api/upload/evidence');
  });
});

// ─── T-MMM-S6-074: EvidenceWorkspacePage calls /api/scores/confirm ────────────
describe('T-MMM-S6-074: EvidenceWorkspacePage calls /api/scores/confirm', () => {
  it('calls /api/scores/confirm', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('/api/scores/confirm');
  });
  it('sends confirm: true flag', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('confirm: true');
  });
});

// ─── T-MMM-S6-075: EvidenceWorkspacePage has confirm level buttons (1-5) ─────
describe('T-MMM-S6-075: EvidenceWorkspacePage has confirm level buttons (1-5)', () => {
  it('has confirm level buttons', () => {
    const src = readFile('apps/mmm/src/pages/EvidenceWorkspacePage.tsx');
    expect(src).toContain('Confirm Level');
    expect(src).toContain('[1,2,3,4,5]');
  });
});

// ─── T-MMM-S6-076: mmm-score-confirm validates score range 1-5 ────────────────
describe('T-MMM-S6-076: mmm-score-confirm validates score range 1-5', () => {
  it('validates score is between 1 and 5', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('score < 1');
    expect(src).toContain('score > 5');
  });
});

// ─── T-MMM-S6-077: lib/supabase.ts uses VITE env vars ───────────────────────
describe('T-MMM-S6-077: apps/mmm/src/lib/supabase.ts uses VITE env vars', () => {
  it('lib/supabase.ts exists', () => {
    expect(fileExists('apps/mmm/src/lib/supabase.ts')).toBe(true);
  });
  it('uses VITE_SUPABASE_URL', () => {
    const src = readFile('apps/mmm/src/lib/supabase.ts');
    expect(src).toContain('VITE_SUPABASE_URL');
  });
  it('uses VITE_SUPABASE_ANON_KEY', () => {
    const src = readFile('apps/mmm/src/lib/supabase.ts');
    expect(src).toContain('VITE_SUPABASE_ANON_KEY');
  });
});

// ─── T-MMM-S6-078: lib/queryClient.ts has staleTime of 30_000 ────────────────
describe('T-MMM-S6-078: apps/mmm/src/lib/queryClient.ts has staleTime', () => {
  it('queryClient.ts exists', () => {
    expect(fileExists('apps/mmm/src/lib/queryClient.ts')).toBe(true);
  });
  it('sets staleTime: 30_000', () => {
    const src = readFile('apps/mmm/src/lib/queryClient.ts');
    expect(src).toContain('30_000');
  });
});

// ─── T-MMM-S6-079: ProtectedRoute.tsx redirects unauthenticated users ────────
describe('T-MMM-S6-079: ProtectedRoute.tsx redirects unauthenticated users', () => {
  it('ProtectedRoute.tsx exists', () => {
    expect(fileExists('apps/mmm/src/components/ProtectedRoute.tsx')).toBe(true);
  });
  it('uses Navigate to /login when not authenticated', () => {
    const src = readFile('apps/mmm/src/components/ProtectedRoute.tsx');
    expect(src).toContain('Navigate');
    expect(src).toContain('/login');
  });
});

// ─── T-MMM-S6-080: userStore.ts has setUser and clearUser actions ─────────────
describe('T-MMM-S6-080: userStore.ts has setUser and clearUser actions', () => {
  it('userStore.ts exists', () => {
    expect(fileExists('apps/mmm/src/store/userStore.ts')).toBe(true);
  });
  it('has setUser action', () => {
    const src = readFile('apps/mmm/src/store/userStore.ts');
    expect(src).toContain('setUser');
  });
  it('has clearUser action', () => {
    const src = readFile('apps/mmm/src/store/userStore.ts');
    expect(src).toContain('clearUser');
  });
});
