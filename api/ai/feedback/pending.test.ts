/**
 * Unit tests — GET /api/ai/feedback/pending serverless handler
 *
 * Wave 9.4-FU — ARC Pending Events Endpoint
 *
 * Verifies HTTP behaviour: ARC token guard, organisationId validation,
 * FeedbackPipeline.listPending delegation, success response shape.
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.2 (API)
 *   Issue #628 — Wave 9.4-FU authority: CS2 (@APGI-cmy)
 *   GRS-011 | APS §10 | AAD §10.1
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';
// @ts-ignore
import { readFileSync } from 'node:fs';
// @ts-ignore
import { resolve, dirname } from 'node:path';
// @ts-ignore
import { fileURLToPath } from 'node:url';

import { createHandler } from './pending.js';
import type { FeedbackPipelineInterface, FeedbackEvent } from '../../../packages/ai-centre/src/types/feedback.js';

// ---------------------------------------------------------------------------
// Test doubles
// ---------------------------------------------------------------------------

function mockRequest(
  method: string,
  headers: Record<string, string> = {},
  url: string = '/api/ai/feedback/pending',
): IncomingMessage {
  const emitter = new EventEmitter() as unknown as IncomingMessage;
  (emitter as Record<string, unknown>)['method'] = method;
  (emitter as Record<string, unknown>)['url'] = url;
  (emitter as Record<string, unknown>)['headers'] = {
    'content-type': 'application/json',
    ...headers,
  };
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

const pendingEvent: FeedbackEvent = {
  id: 'evt-uuid-002',
  organisationId: 'org-001',
  sessionId: 'sess-001',
  interactionId: 'interaction-001',
  feedbackType: 'positive',
  capability: 'advisory',
  agentId: 'mat-advisor',
  arcStatus: 'pending',
  createdAt: new Date('2026-02-26T10:00:00Z'),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Wave 9.4-FU — GET /api/ai/feedback/pending', () => {
  afterEach(() => {
    delete process.env['ARC_APPROVAL_TOKEN'];
  });

  it('W9.4-FU-T-001: file exists and contains listPending', () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const source = readFileSync(resolve(__dirname, 'pending.ts'), 'utf-8');
    expect(source).toContain('listPending');
  });

  it('W9.4-FU-T-002: returns 403 without ARC token', async () => {
    process.env['ARC_APPROVAL_TOKEN'] = 'secret-arc-token';

    const handler = createHandler(vi.fn());

    // Missing token
    const req1 = mockRequest('GET', {}, '/api/ai/feedback/pending?organisationId=org-001');
    const res1 = mockResponse();
    await handler(req1, res1 as unknown as ServerResponse);
    expect(res1.statusCode).toBe(403);

    // Wrong token
    const req2 = mockRequest('GET', { 'x-arc-token': 'wrong-token' }, '/api/ai/feedback/pending?organisationId=org-001');
    const res2 = mockResponse();
    await handler(req2, res2 as unknown as ServerResponse);
    expect(res2.statusCode).toBe(403);
  });

  it('W9.4-FU-T-003: returns 200 with array when valid ARC token + organisationId param', async () => {
    process.env['ARC_APPROVAL_TOKEN'] = 'secret-arc-token';

    const mockPipeline: FeedbackPipelineInterface = {
      submit: vi.fn().mockResolvedValue(pendingEvent),
      listPending: vi.fn().mockResolvedValue([pendingEvent]),
      approve: vi.fn().mockResolvedValue(pendingEvent),
      reject: vi.fn().mockResolvedValue(pendingEvent),
    };
    const handler = createHandler(() => mockPipeline);
    const req = mockRequest(
      'GET',
      { 'x-arc-token': 'secret-arc-token' },
      '/api/ai/feedback/pending?organisationId=org-001',
    );
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(1);
    expect(body[0]).toHaveProperty('id', 'evt-uuid-002');
    expect(mockPipeline.listPending).toHaveBeenCalledWith('org-001');
  });

  it('W9.4-FU-T-004: returns 400 when organisationId is missing', async () => {
    process.env['ARC_APPROVAL_TOKEN'] = 'secret-arc-token';

    const mockPipeline: FeedbackPipelineInterface = {
      submit: vi.fn().mockResolvedValue(pendingEvent),
      listPending: vi.fn().mockResolvedValue([]),
      approve: vi.fn().mockResolvedValue(pendingEvent),
      reject: vi.fn().mockResolvedValue(pendingEvent),
    };
    const handler = createHandler(() => mockPipeline);
    const req = mockRequest(
      'GET',
      { 'x-arc-token': 'secret-arc-token' },
      '/api/ai/feedback/pending',
    );
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('error');
    expect(body.error).toContain('organisationId');
  });
});
