/**
 * Wave 16-2R — RED QA Suite: Deferred Frontend UX Gaps
 *
 * Test IDs : T-W162R-009a/b/c, T-W162R-014a/b, T-W162R-015a/b/c/d,
 *            T-W162R-024a/b/c/d
 * Task     : T-W162R-QA-001 — Write RED QA suite for GAP-009, GAP-014,
 *            GAP-015, GAP-024
 * Builder  : qa-builder (RED gate — must FAIL against current codebase)
 *
 * Strategy : Source-level assertions (readFileSync / existsSync) verify
 *            that live-wired implementations are present. All tests are
 *            written RED-first: they assert the REQUIRED end-state which
 *            does NOT yet exist in the current codebase.
 *
 * IAA FFA  : BD-001 (all 4 gaps), BD-005 (GAP-009 real hooks, GAP-015
 *            consumers), BD-006 (AuditContext writer + ≥2 consumers),
 *            BD-009 (no double-state for auditId), BD-013 (confirm() spy),
 *            BD-018 (audio src safety), BD-019 (ARIA labels),
 *            BD-022 (GAP-024 matches CriteriaUpload pattern)
 *
 * Gap refs : GAP-009 | GAP-014 | GAP-015 | GAP-024
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Resolved path constants
// ---------------------------------------------------------------------------
const FRONTEND_SRC = resolve(__dirname, '../../frontend/src');

// ---------------------------------------------------------------------------
// GAP-009: Wire CriteriaModal to real data hooks
// ---------------------------------------------------------------------------
describe('T-W162R-009: GAP-009 — CriteriaModal wired to real data hooks', () => {
  const modalPath = resolve(FRONTEND_SRC, 'components/criteria/CriteriaModal.tsx');

  it('T-W162R-009a: CriteriaModal must NOT contain hardcoded placeholder text for Interview tab', () => {
    expect(
      existsSync(modalPath),
      'CriteriaModal.tsx must exist at components/criteria/CriteriaModal.tsx'
    ).toBe(true);

    const src = readFileSync(modalPath, 'utf-8');

    // RED: currently contains "Interview recording interface will be implemented in Task 5.6.4"
    expect(src).not.toContain(
      'Interview recording interface will be implemented in Task 5.6.4'
    );
  });

  it('T-W162R-009b: CriteriaModal must import at least one real data hook', () => {
    const src = readFileSync(modalPath, 'utf-8');

    // RED: currently imports only useState/useEffect/useRef — no data hooks
    const hasDataHook =
      src.includes('useCriteria') ||
      src.includes('useScoring') ||
      src.includes('useCriterionEvaluation') ||
      src.includes('useCriteriaEvaluations');

    expect(
      hasDataHook,
      'CriteriaModal.tsx must import at least one data hook ' +
        '(useCriteria, useScoring, useCriterionEvaluation, or useCriteriaEvaluations)'
    ).toBe(true);
  });

  it('T-W162R-009c: CriteriaModal findings textarea must be a controlled input (value + onChange)', () => {
    const src = readFileSync(modalPath, 'utf-8');

    // RED: currently has uncontrolled <textarea> in findings tab — no value= on the findings textarea,
    // no dedicated findings state variable, no onChange= on the findings textarea.
    // The controlled pattern requires a state variable tied to the findings textarea.
    //
    // Check that the findings textarea carries a value= attribute.
    // Strategy: extract the findings tab section and assert it contains value=
    const findingsTabIdx = src.indexOf("activeTab === 'findings'");
    expect(
      findingsTabIdx,
      "CriteriaModal.tsx must contain findings tab rendering (activeTab === 'findings')"
    ).toBeGreaterThan(-1);

    // Slice the findings tab block and check for controlled textarea with value= binding
    const findingsBlock = src.slice(findingsTabIdx, findingsTabIdx + 600);
    expect(
      findingsBlock,
      'CriteriaModal.tsx findings textarea must have value= attribute (controlled input)'
    ).toMatch(/value=\{/);
  });
});

// ---------------------------------------------------------------------------
// GAP-014: Audio player for type='audio' and type='interview'
// ---------------------------------------------------------------------------
describe('T-W162R-014: GAP-014 — Audio player for evidence playback', () => {
  const evidenceComponentPath = resolve(
    FRONTEND_SRC,
    'components/evidence/EvidenceCollection.tsx'
  );

  it('T-W162R-014a: EvidenceCollection component must contain an <audio> element tag', () => {
    expect(
      existsSync(evidenceComponentPath),
      'components/evidence/EvidenceCollection.tsx must exist'
    ).toBe(true);

    const src = readFileSync(evidenceComponentPath, 'utf-8');

    // RED: currently no <audio element present in the component
    expect(
      src,
      'EvidenceCollection.tsx must render an <audio element for playback'
    ).toContain('<audio');
  });

  it('T-W162R-014b: EvidenceCollection must conditionally render audio player for type=audio or type=interview', () => {
    const src = readFileSync(evidenceComponentPath, 'utf-8');

    // RED: currently no conditional logic for audio/interview playback.
    // The implementation must render a player only for audio and interview evidence types.
    const hasAudioTypeCheck =
      src.includes("=== 'audio'") || src.includes('=== "audio"');
    const hasInterviewTypeCheck =
      src.includes("=== 'interview'") || src.includes('=== "interview"');

    // Must also have the <audio element to be a real player (not just type checks)
    expect(
      src,
      'EvidenceCollection.tsx must contain <audio for playback'
    ).toContain('<audio');

    expect(
      hasAudioTypeCheck,
      "EvidenceCollection.tsx must check for type === 'audio' to conditionally render player"
    ).toBe(true);

    expect(
      hasInterviewTypeCheck,
      "EvidenceCollection.tsx must check for type === 'interview' to conditionally render player"
    ).toBe(true);

    // BD-018: audio src must be bound from data (not hardcoded / unsafe)
    // The <audio element must have a src= or similar binding from evidence data
    const audioBlock = src.slice(src.indexOf('<audio'));
    expect(
      audioBlock,
      'audio element must have src= bound to evidence data (BD-018 audio src safety)'
    ).toMatch(/src[={]/);
  });
});

// ---------------------------------------------------------------------------
// GAP-015: Global AuditContext provider
// ---------------------------------------------------------------------------
describe('T-W162R-015: GAP-015 — Global AuditContext provider', () => {
  const contextPath = resolve(FRONTEND_SRC, 'contexts/AuditContext.tsx');
  const appPath = resolve(FRONTEND_SRC, 'App.tsx');
  const criteriaPagePath = resolve(FRONTEND_SRC, 'pages/CriteriaManagementPage.tsx');
  const scoringPagePath = resolve(FRONTEND_SRC, 'pages/ScoringPage.tsx');

  it('T-W162R-015a: contexts/AuditContext.tsx must exist', () => {
    // RED: currently only AuthContext.tsx exists — no AuditContext
    expect(
      existsSync(contextPath),
      'contexts/AuditContext.tsx must exist — currently absent (only AuthContext.tsx exists)'
    ).toBe(true);
  });

  it('T-W162R-015b: App.tsx must import and use AuditContext or AuditProvider', () => {
    expect(
      existsSync(appPath),
      'App.tsx must exist'
    ).toBe(true);

    const src = readFileSync(appPath, 'utf-8');

    // RED: App.tsx currently has no AuditContext or AuditProvider reference
    // BD-006: AuditContext writer must be present in App.tsx and ≥2 consumers wired
    const hasAuditProvider =
      src.includes('AuditContext') || src.includes('AuditProvider');

    expect(
      hasAuditProvider,
      'App.tsx must import and use AuditContext or AuditProvider to wrap the router'
    ).toBe(true);
  });

  it('T-W162R-015c: CriteriaManagementPage must NOT declare local selectedAuditId state (must use context)', () => {
    expect(
      existsSync(criteriaPagePath),
      'pages/CriteriaManagementPage.tsx must exist'
    ).toBe(true);

    const src = readFileSync(criteriaPagePath, 'utf-8');

    // RED: currently has `const [selectedAuditId` as local useState
    // BD-009: no double-state for auditId once AuditContext exists
    expect(
      src,
      'CriteriaManagementPage.tsx must NOT have local selectedAuditId useState ' +
        '— must read from AuditContext instead'
    ).not.toContain('const [selectedAuditId');
  });

  it('T-W162R-015d: ScoringPage must NOT declare local selectedAuditId state (must use context)', () => {
    expect(
      existsSync(scoringPagePath),
      'pages/ScoringPage.tsx must exist'
    ).toBe(true);

    const src = readFileSync(scoringPagePath, 'utf-8');

    // RED: currently has `const [selectedAuditId` as local useState
    // BD-009: no double-state for auditId once AuditContext exists
    expect(
      src,
      'ScoringPage.tsx must NOT have local selectedAuditId useState ' +
        '— must read from AuditContext instead'
    ).not.toContain('const [selectedAuditId');
  });
});

// ---------------------------------------------------------------------------
// GAP-024: State-based confirmation dialogs (replace native confirm())
// ---------------------------------------------------------------------------
describe('T-W162R-024: GAP-024 — State-based confirmation dialogs replace native confirm()', () => {
  const auditListPath = resolve(FRONTEND_SRC, 'components/audits/AuditList.tsx');
  const evidenceComponentPath = resolve(
    FRONTEND_SRC,
    'components/evidence/EvidenceCollection.tsx'
  );

  it('T-W162R-024a: AuditList.tsx must NOT use window.confirm()', () => {
    expect(
      existsSync(auditListPath),
      'components/audits/AuditList.tsx must exist'
    ).toBe(true);

    const src = readFileSync(auditListPath, 'utf-8');

    // RED: currently uses window.confirm(...)
    // BD-013: confirm() spy assertions must be genuine — no window.confirm in source
    expect(
      src,
      'AuditList.tsx must NOT call window.confirm() — use accessible state-based dialog instead'
    ).not.toContain('window.confirm(');
  });

  it('T-W162R-024b: EvidenceCollection.tsx must NOT use native confirm()', () => {
    expect(
      existsSync(evidenceComponentPath),
      'components/evidence/EvidenceCollection.tsx must exist'
    ).toBe(true);

    const src = readFileSync(evidenceComponentPath, 'utf-8');

    // RED: currently uses confirm('Are you sure...')
    // BD-013: confirm() spy assertions must be genuine — no native confirm in source
    expect(
      src,
      'EvidenceCollection.tsx must NOT call native confirm() — use accessible state-based dialog instead'
    ).not.toContain("if (!confirm(");
  });

  it('T-W162R-024c: AuditList.tsx confirmation UI must have ARIA role="alertdialog"', () => {
    const src = readFileSync(auditListPath, 'utf-8');

    // RED: currently no role="alertdialog" — no accessible confirmation UI
    // BD-019: ARIA labels required; BD-022: must match CriteriaUpload.tsx pattern
    expect(
      src,
      'AuditList.tsx must include accessible confirmation dialog with role="alertdialog"'
    ).toContain('role="alertdialog"');
  });

  it('T-W162R-024d: EvidenceCollection.tsx confirmation UI must have ARIA role="alertdialog"', () => {
    const src = readFileSync(evidenceComponentPath, 'utf-8');

    // RED: currently no role="alertdialog" — no accessible confirmation UI
    // BD-019: ARIA labels required; BD-022: must match CriteriaUpload.tsx pattern
    expect(
      src,
      'EvidenceCollection.tsx must include accessible confirmation dialog with role="alertdialog"'
    ).toContain('role="alertdialog"');
  });
});
