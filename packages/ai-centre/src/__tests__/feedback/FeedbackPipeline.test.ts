/**
 * RED Gate QA Suite — FeedbackPipeline
 *
 * Wave 9.4 — API: FeedbackPipeline Class + ARC Endpoints
 *
 * ALL tests MUST FAIL until Wave 9.4 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.2 (API)
 *   Issue #613 — Wave 9.4 authority: CS2 (@APGI-cmy)
 *   GRS-011 | APS §10 | AAD §10.1
 */

import { describe, it, expect, vi } from 'vitest';

// T-006: Load FeedbackPipeline source as raw string for legacy-bypass assertion.
// Uses Vite's ?raw import (no Node.js fs module needed — zero new TS errors).
import feedbackPipelineSource from '../../feedback/FeedbackPipeline.ts?raw';

import { FeedbackPipeline } from '../../feedback/FeedbackPipeline.js';
import { AIMCBypassError } from '../../errors/AIMCBypassError.js';
import type { FeedbackEvent } from '../../types/feedback.js';

// ---------------------------------------------------------------------------
// Helpers — Chainable Supabase mock
// ---------------------------------------------------------------------------

/**
 * Build a minimal chainable Supabase query builder mock.
 * The chain object is both method-chainable and thenable (awaitable).
 * .single() terminates the chain with a direct Promise.
 */
function makeChain(terminalResult: { data: unknown; error: null | { message: string } }) {
  const resultPromise = Promise.resolve(terminalResult);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: any = {
    insert: vi.fn(() => chain),
    select: vi.fn(() => chain),
    update: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    order: vi.fn(() => chain),
    single: vi.fn(() => resultPromise),
    // Thenability — so `await chain` returns terminalResult
    then: resultPromise.then.bind(resultPromise),
    catch: resultPromise.catch.bind(resultPromise),
  };
  return chain;
}

function makeSupabaseMock(terminalResult: { data: unknown; error: null | { message: string } }) {
  return {
    from: vi.fn(() => makeChain(terminalResult)),
  };
}

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const sampleEvent: Omit<FeedbackEvent, 'id' | 'arcStatus' | 'createdAt'> = {
  organisationId: 'org-001',
  sessionId: 'sess-001',
  userId: 'user-001',
  interactionId: 'interaction-001',
  feedbackType: 'positive',
  rating: 5,
  comment: 'Very helpful',
  capability: 'advisory',
  agentId: 'mat-advisor',
};

/**
 * Snake_case database row fixtures — represent what Supabase actually returns.
 * The FeedbackPipeline fromRow() mapper converts these to camelCase FeedbackEvent.
 */
const persistedRow = {
  id: 'evt-uuid-001',
  organisation_id: 'org-001',
  session_id: 'sess-001',
  user_id: 'user-001',
  interaction_id: 'interaction-001',
  feedback_type: 'positive',
  rating: 5,
  comment: 'Very helpful',
  correction_text: null,
  capability: 'advisory',
  agent_id: 'mat-advisor',
  arc_status: 'pending',
  arc_reviewed_by: null,
  arc_reviewed_at: null,
  arc_notes: null,
  created_at: '2026-02-26T10:00:00.000Z',
};

const approvedRow = {
  ...persistedRow,
  arc_status: 'approved',
  arc_reviewed_by: 'arc-reviewer',
  arc_reviewed_at: '2026-02-26T11:00:00.000Z',
  arc_notes: 'Approved for promotion',
};

const rejectedRow = {
  ...persistedRow,
  arc_status: 'rejected',
  arc_reviewed_by: 'arc-reviewer',
  arc_reviewed_at: '2026-02-26T11:00:00.000Z',
  arc_notes: 'Not suitable',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Wave 9.4 — FeedbackPipeline', () => {
  it('W9.4-T-001: FeedbackPipeline class is importable', () => {
    expect(FeedbackPipeline).toBeDefined();
    expect(typeof FeedbackPipeline).toBe('function');
  });

  it('W9.4-T-002: submit() returns FeedbackEvent with arcStatus=pending', async () => {
    const supabase = makeSupabaseMock({ data: persistedRow, error: null });
    const pipeline = new FeedbackPipeline(supabase);

    const result = await pipeline.submit(sampleEvent);

    expect(result).toBeDefined();
    expect(result.arcStatus).toBe('pending');
    expect(result.organisationId).toBe('org-001');
    expect(result.id).toBeDefined();
  });

  it('W9.4-T-003: listPending() returns filtered array', async () => {
    const pending = [persistedRow];
    const supabase = makeSupabaseMock({ data: pending, error: null });
    const pipeline = new FeedbackPipeline(supabase);

    const results = await pipeline.listPending('org-001');

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0]!.arcStatus).toBe('pending');
  });

  it('W9.4-T-004: approve() sets arcStatus to approved', async () => {
    const supabase = makeSupabaseMock({ data: approvedRow, error: null });
    const pipeline = new FeedbackPipeline(supabase);

    const result = await pipeline.approve('evt-uuid-001', 'arc-reviewer', 'Approved for promotion');

    expect(result.arcStatus).toBe('approved');
    expect(result.arcReviewedBy).toBe('arc-reviewer');
  });

  it('W9.4-T-005: reject() sets arcStatus to rejected', async () => {
    const supabase = makeSupabaseMock({ data: rejectedRow, error: null });
    const pipeline = new FeedbackPipeline(supabase);

    const result = await pipeline.reject('evt-uuid-001', 'arc-reviewer', 'Not suitable');

    expect(result.arcStatus).toBe('rejected');
    expect(result.arcReviewedBy).toBe('arc-reviewer');
  });

  it('W9.4-T-006: FeedbackPipeline does NOT import from learningLayer.ts', () => {
    // Reads FeedbackPipeline.ts source via Vite ?raw import (no Node.js fs needed).
    // Asserts absence of legacy learning layer references (ARCH-FREEZE §4.2 constraint).
    expect(feedbackPipelineSource).not.toContain('learningLayer');
    expect(feedbackPipelineSource).not.toContain('ai_learning_patterns');
    expect(feedbackPipelineSource).not.toContain('ai_feedback_submissions');
  });

  it('W9.4-T-011: submit() throws AIMCBypassError if organisationId is missing', async () => {
    const supabase = makeSupabaseMock({ data: persistedRow, error: null });
    const pipeline = new FeedbackPipeline(supabase);

    // organisationId is empty string
    await expect(
      pipeline.submit({ ...sampleEvent, organisationId: '' }),
    ).rejects.toThrow(AIMCBypassError);

    // organisationId is undefined (cast to test runtime guard)
    await expect(
      pipeline.submit({ ...sampleEvent, organisationId: undefined as unknown as string }),
    ).rejects.toThrow(AIMCBypassError);
  });
});

describe('Wave 9.4 — AIMCBypassError', () => {
  it('AIMCBypassError is a real Error subclass with correct name', () => {
    const err = new AIMCBypassError('test message');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AIMCBypassError);
    expect(err.name).toBe('AIMCBypassError');
    expect(err.message).toBe('test message');
  });
});
