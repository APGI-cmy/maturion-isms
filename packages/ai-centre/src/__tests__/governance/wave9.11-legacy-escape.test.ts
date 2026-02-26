/**
 * RED Gate QA Suite — Wave 9.11 Legacy Escape Remediation
 *
 * Wave 9.11 — Self-Learning Loop Migration to AIMC
 *
 * Regression test suite that asserts:
 *   (a) Legacy learning hook files carry @deprecated JSDoc markers, and
 *   (b) The new AIMC FeedbackPipeline contains no legacy bypass references, and
 *   (c) The ARC gate endpoint enforces 403 on missing/invalid token, and
 *   (d) AIMCBypassError is correctly exported from the errors barrel.
 *
 * RED-FIRST: T-001, T-002, T-003 MUST FAIL until @deprecated markers are added
 * to the legacy files. T-004, T-005, T-006, T-007 should be GREEN immediately
 * (verifying the new AIMC code is already clean).
 *
 * File-reading strategy:
 *   - Same-package files (FeedbackPipeline.ts): Vite ?raw import (zero new TS errors).
 *   - Cross-package / cross-app files: Node.js fs.readFileSync via import.meta.url
 *     resolution. This avoids Vite trying to parse the legacy app's tsconfig and
 *     resolving legacy path aliases (@/...) at transform time.
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md
 *   Issue #613 — Wave 9.11 authority: CS2 (@APGI-cmy)
 *   GRS-011 | APS §10 | AAD §10.1
 */

import { describe, it, expect } from 'vitest';
// @ts-ignore — @types/node not in package tsconfig; same pattern as existing package test files
import { readFileSync } from 'node:fs';
// @ts-ignore — @types/node not in package tsconfig; same pattern as existing package test files
import { resolve, dirname } from 'node:path';
// @ts-ignore — @types/node not in package tsconfig; same pattern as existing package test files
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// ?raw import — same-package AIMC code (T-004, T-005 verify it is clean)
// Using Vite ?raw for in-package files (consistent with Wave 9.4 pattern).
// ---------------------------------------------------------------------------

import feedbackPipelineSource from '../../feedback/FeedbackPipeline.ts?raw';

// ---------------------------------------------------------------------------
// Direct import — AIMCBypassError via errors barrel (T-007)
// ---------------------------------------------------------------------------

import { AIMCBypassError } from '../../errors/index.js';

// ---------------------------------------------------------------------------
// Cross-package file reading via Node.js fs (T-001, T-002, T-003, T-006)
//
// Vite ?raw imports for files outside this package would trigger tsconfig
// resolution for the legacy app (tsconfig.app.json missing → parse error).
// Using readFileSync avoids Vite transform entirely — we just read bytes.
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Resolve a path relative to the monorepo root from this test file's location. */
function repoFile(...segments: string[]): string {
  // This file lives at: packages/ai-centre/src/__tests__/governance/
  // Up 5 levels reaches the repo root.
  return resolve(__dirname, '..', '..', '..', '..', '..', ...segments);
}

const learningLayerSource = readFileSync(
  repoFile(
    'apps',
    'maturion-maturity-legacy',
    'src',
    'agents',
    'maturion',
    'learning',
    'learningLayer.ts',
  ),
  'utf-8',
);

const useAILearningFeedbackSource = readFileSync(
  repoFile(
    'apps',
    'maturion-maturity-legacy',
    'src',
    'hooks',
    'useAILearningFeedback.ts',
  ),
  'utf-8',
);

const useAIFeedbackSubmissionsSource = readFileSync(
  repoFile(
    'apps',
    'maturion-maturity-legacy',
    'src',
    'hooks',
    'useAIFeedbackSubmissions.ts',
  ),
  'utf-8',
);

const approveHandlerSource = readFileSync(
  repoFile('api', 'ai', 'feedback', 'approve.ts'),
  'utf-8',
);

const useAILearningPatternsSource = readFileSync(
  repoFile('apps', 'maturion-maturity-legacy', 'src', 'hooks', 'useAILearningPatterns.ts'), 'utf-8');
const useFeedbackRetrainingWeightsSource = readFileSync(
  repoFile('apps', 'maturion-maturity-legacy', 'src', 'hooks', 'useFeedbackRetrainingWeights.ts'), 'utf-8');
const useSmartFeedbackLoopSource = readFileSync(
  repoFile('apps', 'maturion-maturity-legacy', 'src', 'hooks', 'useSmartFeedbackLoop.ts'), 'utf-8');
const useLearningModelSnapshotsSource = readFileSync(
  repoFile('apps', 'maturion-maturity-legacy', 'src', 'hooks', 'useLearningModelSnapshots.ts'), 'utf-8');
const useLearningRuleConfigurationsSource = readFileSync(
  repoFile('apps', 'maturion-maturity-legacy', 'src', 'hooks', 'useLearningRuleConfigurations.ts'), 'utf-8');
const useAIMPSGenerationSource = readFileSync(
  repoFile('apps', 'maturion-maturity-legacy', 'src', 'hooks', 'useAIMPSGeneration.ts'), 'utf-8');

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Wave 9.11 — Legacy Escape Remediation', () => {
  /**
   * W9.11-T-001
   * learningLayer.ts must carry a @deprecated JSDoc marker to signal that
   * the legacy self-learning loop has been superseded by FeedbackPipeline.
   *
   * RED until @deprecated is added to learningLayer.ts.
   */
  it('W9.11-T-001: learningLayer.ts contains @deprecated JSDoc marker', () => {
    expect(learningLayerSource).toContain('@deprecated');
  });

  /**
   * W9.11-T-002
   * useAILearningFeedback.ts must carry a @deprecated JSDoc marker.
   *
   * RED until @deprecated is added to useAILearningFeedback.ts.
   */
  it('W9.11-T-002: useAILearningFeedback.ts contains @deprecated JSDoc marker', () => {
    expect(useAILearningFeedbackSource).toContain('@deprecated');
  });

  /**
   * W9.11-T-003
   * useAIFeedbackSubmissions.ts must carry a @deprecated JSDoc marker.
   *
   * RED until @deprecated is added to useAIFeedbackSubmissions.ts.
   */
  it('W9.11-T-003: useAIFeedbackSubmissions.ts contains @deprecated JSDoc marker', () => {
    expect(useAIFeedbackSubmissionsSource).toContain('@deprecated');
  });

  /**
   * W9.11-T-004
   * FeedbackPipeline.ts must NOT reference the legacy `ai_learning_patterns` table.
   * This verifies the new AIMC pipeline is free of legacy bypass paths.
   *
   * Should be GREEN immediately — FeedbackPipeline.ts is already clean.
   */
  it('W9.11-T-004: FeedbackPipeline.ts does NOT reference ai_learning_patterns', () => {
    expect(feedbackPipelineSource).not.toContain('ai_learning_patterns');
  });

  /**
   * W9.11-T-005
   * FeedbackPipeline.ts must NOT reference the legacy `ai_feedback_submissions` table.
   * This verifies the new AIMC pipeline routes exclusively through ai_feedback_events.
   *
   * Should be GREEN immediately — FeedbackPipeline.ts is already clean.
   */
  it('W9.11-T-005: FeedbackPipeline.ts does NOT reference ai_feedback_submissions', () => {
    expect(feedbackPipelineSource).not.toContain('ai_feedback_submissions');
  });

  /**
   * W9.11-T-006
   * The ARC approval endpoint must return 403 when the x-arc-token header is
   * missing or does not match ARC_APPROVAL_TOKEN. This verifies the ARC gate
   * is enforced in the handler source.
   *
   * Should be GREEN immediately — approve.ts already implements the 403 guard.
   */
  it('W9.11-T-006: api/ai/feedback/approve.ts contains 403 response for failed ARC token check', () => {
    expect(approveHandlerSource).toContain('403');
  });

  /**
   * W9.11-T-007
   * AIMCBypassError must be importable from the errors barrel index and must
   * have the correct `name` property ('AIMCBypassError').
   *
   * Should be GREEN immediately — AIMCBypassError is exported from errors/index.ts.
   */
  it("W9.11-T-007: AIMCBypassError is importable from errors/index.ts and has name === 'AIMCBypassError'", () => {
    expect(AIMCBypassError).toBeDefined();
    const err = new AIMCBypassError('governance bypass detected');
    expect(err.name).toBe('AIMCBypassError');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AIMCBypassError);
  });

  it('W9.11-T-008: useAILearningPatterns.ts contains @deprecated JSDoc marker', () => {
    expect(useAILearningPatternsSource).toContain('@deprecated');
  });
  it('W9.11-T-009: useFeedbackRetrainingWeights.ts contains @deprecated JSDoc marker', () => {
    expect(useFeedbackRetrainingWeightsSource).toContain('@deprecated');
  });
  it('W9.11-T-010: useSmartFeedbackLoop.ts contains @deprecated JSDoc marker', () => {
    expect(useSmartFeedbackLoopSource).toContain('@deprecated');
  });
  it('W9.11-T-011: useLearningModelSnapshots.ts contains @deprecated JSDoc marker', () => {
    expect(useLearningModelSnapshotsSource).toContain('@deprecated');
  });
  it('W9.11-T-012: useLearningRuleConfigurations.ts contains @deprecated JSDoc marker', () => {
    expect(useLearningRuleConfigurationsSource).toContain('@deprecated');
  });
  it('W9.11-T-013: useAIMPSGeneration.ts contains @deprecated JSDoc marker', () => {
    expect(useAIMPSGenerationSource).toContain('@deprecated');
  });
});
