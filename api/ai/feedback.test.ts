/**
 * Unit tests — POST /api/ai/feedback serverless handler
 *
 * Wave 9.4 — AI Feedback Pipeline Endpoint
 *
 * Verifies HTTP behaviour: authentication guard, body parsing,
 * FeedbackPipeline delegation, success response shape.
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.2 (API)
 *   Issue #613 — Wave 9.4 authority: CS2 (@APGI-cmy)
 */

import { describe, it, expect, vi } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';

import { createHandler } from './feedback.js';
import type { FeedbackPipelineInterface, FeedbackEvent } from '../../packages/ai-centre/src/types/feedback.js';

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

const validFeedbackBody = {
  organisationId: 'org-001',
  sessionId: 'sess-001',
  interactionId: 'interaction-001',
  feedbackType: 'positive',
  rating: 5,
  comment: 'Very helpful',
  capability: 'advisory',
  agentId: 'mat-advisor',
};

const persistedEvent: FeedbackEvent = {
  id: 'evt-uuid-001',
  ...validFeedbackBody,
  feedbackType: 'positive',
  arcStatus: 'pending',
  createdAt: new Date('2026-02-26T10:00:00Z'),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Wave 9.4 — POST /api/ai/feedback', () => {
  it('W9.4-T-007: returns 401 when no Authorization header is provided', async () => {
    const handler = createHandler(vi.fn());
    const req = mockRequest('POST', validFeedbackBody);
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('error');
  });

  it('W9.4-T-008: returns 200 with created event when valid payload and auth provided', async () => {
    const mockPipeline: FeedbackPipelineInterface = {
      submit: vi.fn().mockResolvedValue(persistedEvent),
      listPending: vi.fn().mockResolvedValue([]),
      approve: vi.fn().mockResolvedValue(persistedEvent),
      reject: vi.fn().mockResolvedValue(persistedEvent),
    };
    const handler = createHandler(() => mockPipeline);
    const req = mockRequest('POST', validFeedbackBody, {
      authorization: 'Bearer test-jwt-token',
    });
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('id', 'evt-uuid-001');
    expect(body).toHaveProperty('arcStatus', 'pending');
  });

  it('W9.4-FU-T-005: submit() is NOT called with body userId (JWT sub claim takes precedence)', async () => {
    let capturedPayload: unknown;
    const mockPipeline: FeedbackPipelineInterface = {
      submit: vi.fn().mockImplementation((payload: unknown) => {
        capturedPayload = payload;
        return Promise.resolve(persistedEvent);
      }),
      listPending: vi.fn().mockResolvedValue([]),
      approve: vi.fn().mockResolvedValue(persistedEvent),
      reject: vi.fn().mockResolvedValue(persistedEvent),
    };
    const handler = createHandler(() => mockPipeline);

    // Body includes userId: 'body-user' — this MUST be ignored
    const bodyWithUserId = { ...validFeedbackBody, userId: 'body-user' };
    // JWT with a different sub claim
    const jwtHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const jwtPayload = Buffer.from(JSON.stringify({ sub: 'jwt-user-001' })).toString('base64url');
    const fakeJwt = `${jwtHeader}.${jwtPayload}.fakesig`;

    const req = mockRequest('POST', bodyWithUserId, {
      authorization: `Bearer ${fakeJwt}`,
    });
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    expect((capturedPayload as Record<string, unknown>)['userId']).not.toBe('body-user');
    // Also assert the JWT sub claim was used instead
    expect((capturedPayload as Record<string, unknown>)['userId']).toBe('jwt-user-001');
  });

  it('W9.4-FU-T-006: submit() is called with JWT sub claim as userId', async () => {
    let capturedPayload: unknown;
    const mockPipeline: FeedbackPipelineInterface = {
      submit: vi.fn().mockImplementation((payload: unknown) => {
        capturedPayload = payload;
        return Promise.resolve(persistedEvent);
      }),
      listPending: vi.fn().mockResolvedValue([]),
      approve: vi.fn().mockResolvedValue(persistedEvent),
      reject: vi.fn().mockResolvedValue(persistedEvent),
    };
    const handler = createHandler(() => mockPipeline);

    // Construct a fake JWT with sub: 'jwt-user-001'
    const jwtHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const jwtPayload = Buffer.from(JSON.stringify({ sub: 'jwt-user-001' })).toString('base64url');
    const fakeJwt = `${jwtHeader}.${jwtPayload}.fakesig`;

    const req = mockRequest('POST', validFeedbackBody, {
      authorization: `Bearer ${fakeJwt}`,
    });
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    expect((capturedPayload as Record<string, unknown>)['userId']).toBe('jwt-user-001');
  });
});
