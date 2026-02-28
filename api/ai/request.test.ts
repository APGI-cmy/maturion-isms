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
  buildPersonaLoader,   // RED: not exported yet — Wave 10 gate
  buildSessionMemory,   // RED: not exported yet — Wave 10 gate
  buildPersistentMemory, // RED: not exported yet — Wave 10 gate
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

// ---------------------------------------------------------------------------
// Wave 10 RED gate — buildAICentre adapters non-null requirement (T-073–T-075)
//
// These tests FAIL with the current null-stub collaborators in request.ts
// because buildPersonaLoader / buildSessionMemory / buildPersistentMemory are
// not yet exported.  They turn GREEN once api-builder wires the real
// @maturion/ai-centre implementations and exports the factory functions.
//
// References: FR-073, FR-074, FR-075, TR-073, TR-074, TR-075 | Wave 10
// ---------------------------------------------------------------------------

describe('buildAICentre adapters — non-null requirement (T-073 through T-075)', () => {
  // ---------------------------------------------------------------------------
  // Type-assertion pattern note:
  //   `buildPersonaLoader / buildSessionMemory / buildPersistentMemory` are
  //   imported as named exports but are NOT yet exported from request.ts.
  //   Vite/vitest resolves missing named exports to `undefined` at runtime
  //   (rather than throwing at parse time), so existing tests stay GREEN.
  //   The `as unknown as () => unknown` double-cast is intentional: it lets
  //   TypeScript compile the test file, while the actual call at runtime throws
  //   `TypeError: <name> is not a function` — the correct RED failure mode.
  //   Once api-builder exports the factories, the casts become safely callable
  //   and the downstream assertions drive the test to GREEN.
  // ---------------------------------------------------------------------------

  // T-073-1 ----------------------------------------------------------------
  it('buildPersonaLoader() is exported and returns a real PersonaLoader instance', () => {
    // RED: buildPersonaLoader is undefined (not exported) — throws at call site
    const loader = (buildPersonaLoader as unknown as () => unknown)();
    expect(loader).toBeDefined();
    // Real PersonaLoader class name is 'PersonaLoader'; the null stub is a plain
    // object literal whose constructor.name is 'Object'.
    expect(
      (loader as { constructor: { name: string } }).constructor.name,
    ).toBe('PersonaLoader');
  });

  // T-073-2 ----------------------------------------------------------------
  it('buildPersonaLoader().listAvailable() resolves to an array (real fs attempt)', async () => {
    // RED: buildPersonaLoader is undefined (not exported) — throws at call site
    const loader = (buildPersonaLoader as unknown as () => unknown)() as {
      listAvailable(): Promise<string[]>;
    };
    const result = await loader.listAvailable();
    // Null stub always returns [] with no fs access.
    // Real PersonaLoader calls readdir — even an empty agents/ dir returns [].
    // The gate is that the factory EXISTS and returns a genuine class instance.
    expect(Array.isArray(result)).toBe(true);
  });

  // T-074-1 ----------------------------------------------------------------
  it('buildSessionMemory() accumulates turns (non-null behaviour)', () => {
    // RED: buildSessionMemory is undefined (not exported) — throws at call site
    const store = (buildSessionMemory as unknown as () => unknown)() as {
      append(sessionId: string, turn: Record<string, unknown>): void;
      getHistory(sessionId: string): Array<{ content: string }>;
    };

    store.append('sess-red-001', {
      role: 'user',
      content: 'hello',
      timestamp: Date.now(),
      estimatedTokens: 5,
    });

    const history = store.getHistory('sess-red-001');
    // Null stub always returns [] — real SessionMemoryStore persists turns.
    expect(history).toHaveLength(1);
    expect(history[0]!.content).toBe('hello');
  });

  // T-075-1 ----------------------------------------------------------------
  it('buildPersistentMemory() stores and retrieves entries (non-null behaviour)', async () => {
    // RED: buildPersistentMemory is undefined (not exported) — throws at call site
    const adapter = (buildPersistentMemory as unknown as () => unknown)() as {
      persist(entry: Record<string, unknown>): Promise<void>;
      retrieve(params: { organisationId: string }): Promise<Array<{ content: string }>>;
    };

    await adapter.persist({
      organisationId: 'org-red-001',
      sessionId: 'sess-red-001',
      role: 'user',
      content: 'test memory entry',
      capability: Capability.ADVISORY,
      timestamp: Date.now(),
    });

    const results = await adapter.retrieve({ organisationId: 'org-red-001' });
    // Null stub always returns [] — real PersistentMemoryAdapter retains entries.
    expect(results).toHaveLength(1);
    expect(results[0]!.content).toBe('test memory entry');
  });
});
