/**
 * Unit tests — POST /api/ai/request serverless handler
 *
 * Verifies HTTP behaviour: method guard, input validation, AICentre delegation,
 * success response shape, and safe error handling.
 *
 * References: FR-072, TR-072 | Wave 6 gap remediation
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';

import {
  parseBody,
  validateRequest,
  buildAICentre,
  createHandler,
} from './request.js';
import {
  Capability,
  AICentreErrorCode,
} from '../../packages/ai-centre/src/types/index.js';

// ---------------------------------------------------------------------------
// Test doubles
// ---------------------------------------------------------------------------

/** Build a minimal mock IncomingMessage with a JSON body. */
function mockRequest(method: string, body: unknown): IncomingMessage {
  const emitter = new EventEmitter() as unknown as IncomingMessage;
  (emitter as Record<string, unknown>)['method'] = method;
  (emitter as Record<string, unknown>)['headers'] = {
    'content-type': 'application/json',
  };

  setImmediate(() => {
    const chunk =
      typeof body === 'string' ? body : JSON.stringify(body);
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

const validBody = {
  capability: 'advisory',
  input: { text: 'What controls should I implement?' },
  context: { organisationId: 'org-001', sessionId: 'sess-001' },
};

// ---------------------------------------------------------------------------
// parseBody
// ---------------------------------------------------------------------------

describe('parseBody', () => {
  it('resolves with the parsed JSON object', async () => {
    const req = mockRequest('POST', { capability: 'advisory' });
    const result = await parseBody(req);
    expect(result).toEqual({ capability: 'advisory' });
  });

  it('rejects when the body is not valid JSON', async () => {
    const badReq = new EventEmitter() as unknown as IncomingMessage;
    setImmediate(() => {
      badReq.emit('data', Buffer.from('not-valid-json'));
      badReq.emit('end');
    });
    await expect(parseBody(badReq)).rejects.toThrow('Invalid JSON body');
  });
});

// ---------------------------------------------------------------------------
// validateRequest
// ---------------------------------------------------------------------------

describe('validateRequest', () => {
  it('returns a typed AICentreRequest for a valid body', () => {
    const req = validateRequest(validBody);
    expect(req.capability).toBe(Capability.ADVISORY);
    expect(req.input.text).toBe('What controls should I implement?');
    expect(req.context.organisationId).toBe('org-001');
  });

  it('accepts an optional agent field', () => {
    const req = validateRequest({ ...validBody, agent: 'mat-advisor' });
    expect(req.agent).toBe('mat-advisor');
  });

  it('omits agent when not present', () => {
    const req = validateRequest(validBody);
    expect(req.agent).toBeUndefined();
  });

  it('throws when body is not an object', () => {
    expect(() => validateRequest(null)).toThrow(
      'Request body must be a JSON object',
    );
    expect(() => validateRequest('string')).toThrow(
      'Request body must be a JSON object',
    );
  });

  it('throws for an unknown capability', () => {
    expect(() =>
      validateRequest({ ...validBody, capability: 'unknown-capability' }),
    ).toThrow('Invalid capability');
  });

  it('throws when input.text is missing', () => {
    expect(() =>
      validateRequest({ ...validBody, input: { data: {} } }),
    ).toThrow('input.text is required');
  });

  it('throws when context.organisationId is missing', () => {
    expect(() =>
      validateRequest({ ...validBody, context: {} }),
    ).toThrow('context.organisationId is required');
  });
});

// ---------------------------------------------------------------------------
// buildAICentre
// ---------------------------------------------------------------------------

describe('buildAICentre', () => {
  afterEach(() => {
    delete process.env['GITHUB_TOKEN'];
    delete process.env['OPENAI_API_KEY'];
  });

  it('returns an AICentre instance', () => {
    process.env['GITHUB_TOKEN'] = 'ghp_test';
    process.env['OPENAI_API_KEY'] = 'sk_test';
    const centre = buildAICentre();
    expect(centre).toBeDefined();
    expect(typeof centre.request).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// handler (via createHandler with injected mock factory)
// ---------------------------------------------------------------------------

describe('handler', () => {
  it('returns 405 for non-POST methods', async () => {
    const handler = createHandler(vi.fn());
    const req = mockRequest('GET', null);
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);
    expect(res.statusCode).toBe(405);
    expect(JSON.parse(res.body)).toMatchObject({
      error: expect.stringContaining('Method not allowed'),
    });
  });

  it('returns 204 for OPTIONS preflight', async () => {
    const handler = createHandler(vi.fn());
    const req = mockRequest('OPTIONS', null);
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);
    expect(res.statusCode).toBe(204);
  });

  it('returns 400 for an invalid capability', async () => {
    const handler = createHandler(vi.fn());
    const req = mockRequest('POST', {
      capability: 'invalid-cap',
      input: { text: 'hi' },
      context: { organisationId: 'org-1' },
    });
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toContain('Invalid capability');
  });

  it('returns 200 with structured result on success', async () => {
    const fakeResponse = {
      capability: Capability.ADVISORY,
      result: {
        capability: Capability.ADVISORY,
        text: 'Focus on Annex A controls.',
        providerUsed: 'github-models' as const,
      },
      telemetry: {
        id: 'tel-001',
        organisationId: 'org-001',
        capability: Capability.ADVISORY,
        providerUsed: 'github-models' as const,
        promptTokens: 10,
        completionTokens: 20,
        latencyMs: 150,
        recordedAt: Date.now(),
      },
    };

    const mockAICentre = { request: vi.fn().mockResolvedValue(fakeResponse) };
    const handler = createHandler(() => mockAICentre as unknown as ReturnType<typeof buildAICentre>);
    const req = mockRequest('POST', validBody);
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.capability).toBe(Capability.ADVISORY);
    expect(body.result.text).toBe('Focus on Annex A controls.');
  });

  it('returns 502 when AICentre returns an error response', async () => {
    const fakeErrorResponse = {
      capability: Capability.ADVISORY,
      errorCode: AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE,
      message: 'All providers are currently unavailable.',
      retryable: true,
      telemetry: {
        id: 'tel-002',
        organisationId: 'org-001',
        capability: Capability.ADVISORY,
        providerUsed: 'github-models' as const,
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: 10,
        errorCode: AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE,
        recordedAt: Date.now(),
      },
    };

    const mockAICentre = {
      request: vi.fn().mockResolvedValue(fakeErrorResponse),
    };
    const handler = createHandler(
      () => mockAICentre as unknown as ReturnType<typeof buildAICentre>,
    );
    const req = mockRequest('POST', validBody);
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(502);
    const body = JSON.parse(res.body);
    expect(body.errorCode).toBe(AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE);
    // Provider error message must NOT be forwarded to client
    expect(body).not.toHaveProperty('message');
  });

  it('returns 500 and does not expose internal error details when AICentre throws', async () => {
    const mockAICentre = {
      request: vi.fn().mockRejectedValue(new Error('internal secret error')),
    };
    const handler = createHandler(
      () => mockAICentre as unknown as ReturnType<typeof buildAICentre>,
    );
    const req = mockRequest('POST', validBody);
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(500);
    const body = JSON.parse(res.body);
    // Must NOT expose the internal error message
    expect(body.error).not.toContain('internal secret error');
    expect(body.error).toContain('internal error');
  });

  it('sets Content-Type and CORS headers on every response', async () => {
    const handler = createHandler(vi.fn());
    const req = mockRequest('GET', null);
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.headers['Content-Type']).toBe('application/json');
    expect(res.headers['Access-Control-Allow-Methods']).toContain('POST');
  });
});
