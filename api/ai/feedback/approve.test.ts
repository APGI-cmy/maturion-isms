/**
 * Unit tests — POST /api/ai/feedback/approve serverless handler
 *
 * Wave 9.4 — ARC Approval Endpoint
 *
 * Verifies HTTP behaviour: ARC token guard, body parsing,
 * FeedbackPipeline.approve/reject delegation, success response shape.
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.2 (API)
 *   Issue #613 — Wave 9.4 authority: CS2 (@APGI-cmy)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';

import { createHandler } from './approve.js';
import type { FeedbackPipelineInterface, FeedbackEvent } from '../../../packages/ai-centre/src/types/feedback.js';

// ---------------------------------------------------------------------------
// Test doubles
// ---------------------------------------------------------------------------

function mockRequest(
  method: string,
  body: unknown,
  headers: Record<string, string> = {},
): IncomingMessage {
  const emitter = new EventEmitter() as unknown as IncomingMessage;
  (emitter as Record<string, unknown>)['method'] = method;
  (emitter as Record<string, unknown>)['headers'] = {
    'content-type': 'application/json',
    ...headers,
  };

  setImmediate(() => {
    const chunk = typeof body === 'string' ? body : JSON.stringify(body);
    emitter.emit('data', Buffer.from(chunk));
    emitter.emit('end');
  });

  return emitter;
}

interface MockResponse {
  statusCode: number | undefined;
  body: string;
  headers: Record<string, string>;
  writeHead: ReturnType<typeof vi.fn>;
  end: ReturnType<typeof vi.fn>;
  setHeader: ReturnType<typeof vi.fn>;
}

function mockResponse(): MockResponse {
  const res: MockResponse = {
    statusCode: undefined,
    body: '',
    headers: {},
    writeHead: vi.fn((code: number) => {
      res.statusCode = code;
    }),
    end: vi.fn((data?: string) => {
      res.body = data ?? '';
    }),
    setHeader: vi.fn((key: string, value: string) => {
      res.headers[key] = value;
    }),
  };
  return res;
}

const validApproveBody = {
  eventId: 'evt-uuid-001',
  decision: 'approved',
  reviewedBy: 'arc-reviewer',
  notes: 'Approved for knowledge base promotion',
};

const approvedEvent: FeedbackEvent = {
  id: 'evt-uuid-001',
  organisationId: 'org-001',
  sessionId: 'sess-001',
  interactionId: 'interaction-001',
  feedbackType: 'positive',
  capability: 'advisory',
  agentId: 'mat-advisor',
  arcStatus: 'approved',
  arcReviewedBy: 'arc-reviewer',
  arcReviewedAt: new Date('2026-02-26T11:00:00Z'),
  arcNotes: 'Approved for knowledge base promotion',
  createdAt: new Date('2026-02-26T10:00:00Z'),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Wave 9.4 — POST /api/ai/feedback/approve', () => {
  afterEach(() => {
    delete process.env['ARC_APPROVAL_TOKEN'];
  });

  it('W9.4-T-009: returns 403 when x-arc-token header is missing or incorrect', async () => {
    process.env['ARC_APPROVAL_TOKEN'] = 'secret-arc-token';

    const handler = createHandler(vi.fn());

    // Missing token
    const req1 = mockRequest('POST', validApproveBody);
    const res1 = mockResponse();
    await handler(req1, res1 as unknown as ServerResponse);
    expect(res1.statusCode).toBe(403);

    // Wrong token
    const req2 = mockRequest('POST', validApproveBody, {
      'x-arc-token': 'wrong-token',
    });
    const res2 = mockResponse();
    await handler(req2, res2 as unknown as ServerResponse);
    expect(res2.statusCode).toBe(403);
  });

  it('W9.4-T-010: returns 200 with updated event when valid ARC token and payload provided', async () => {
    process.env['ARC_APPROVAL_TOKEN'] = 'secret-arc-token';

    const mockPipeline: FeedbackPipelineInterface = {
      submit: vi.fn().mockResolvedValue(approvedEvent),
      listPending: vi.fn().mockResolvedValue([]),
      approve: vi.fn().mockResolvedValue(approvedEvent),
      reject: vi.fn().mockResolvedValue(approvedEvent),
    };
    const handler = createHandler(() => mockPipeline);
    const req = mockRequest('POST', validApproveBody, {
      'x-arc-token': 'secret-arc-token',
    });
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('id', 'evt-uuid-001');
    expect(body).toHaveProperty('arcStatus', 'approved');
  });
});
