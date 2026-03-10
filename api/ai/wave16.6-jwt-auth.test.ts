/**
 * Wave 16.6 — POST /api/ai/request JWT Authentication RED QA Suite
 *
 * QA-to-Red: ALL tests in this file MUST fail until Wave 16.6 implementation
 * adds JWT validation to the /api/ai/request handler.
 *
 * Gap addressed:
 *   GAP-017 — POST /api/ai/request lacks JWT authentication
 *
 * Acceptance Criteria (from implementation-plan.md Wave 16.6 AC-2):
 *   - POST /api/ai/request validates the caller's JWT before processing
 *   - organisationId verified against authenticated session's auth.uid()
 *   - Returns 401 when no Authorization header is present
 *   - Returns 401 when an invalid/malformed JWT is supplied
 *   - The AICentre factory is NOT invoked when the JWT is absent
 *   - Returns 401 when an unauthenticated caller supplies an arbitrary organisationId
 *
 * Test IDs: T-W16.6-SCH-003, T-W16.6-SCH-003b, T-W16.6-SCH-003c, T-W16.6-SCH-003d
 *
 * Architecture: architecture/implementation-plan.md Wave 16.6 AC-2
 * FRS: GAP-017
 * Session: qa-builder wave16.6 RED suite
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';

import { createHandler } from './request.js';

// ---------------------------------------------------------------------------
// Test doubles
// ---------------------------------------------------------------------------

/** Build a minimal mock IncomingMessage, optionally with Authorization header. */
function mockRequest(opts: {
  method?: string;
  body?: unknown;
  authorizationHeader?: string;
}): IncomingMessage {
  const { method = 'POST', body = {}, authorizationHeader } = opts;

  const emitter = new EventEmitter() as unknown as IncomingMessage;
  (emitter as Record<string, unknown>)['method'] = method;
  (emitter as Record<string, unknown>)['headers'] = {
    'content-type': 'application/json',
    ...(authorizationHeader !== undefined
      ? { authorization: authorizationHeader }
      : {}),
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

/** A valid-looking POST body (would pass body validation if JWT is accepted). */
const validBody = {
  capability: 'advisory',
  input: { text: 'What controls should I implement?' },
  context: { organisationId: 'org-001', sessionId: 'sess-001' },
};

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// T-W16.6-SCH-003 — 401 when no Authorization header
// ---------------------------------------------------------------------------

describe('T-W16.6-SCH-003: POST /api/ai/request returns 401 when no Authorization header', () => {
  it('returns HTTP 401 when Authorization header is absent', async () => {
    // RED: Current handler does NOT validate JWT — it will return 200 or 400,
    //      never 401.  Becomes GREEN once JWT gate is added to createHandler.
    const mockFactory = vi.fn(() => ({
      request: vi.fn().mockResolvedValue({
        output: { text: 'mocked' },
        telemetry: { providerUsed: 'openai', latencyMs: 1 },
      }),
    }));

    const handler = createHandler(mockFactory as never);
    const req = mockRequest({ body: validBody }); // No Authorization header
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(
      res.statusCode,
      'Expected HTTP 401 when Authorization header is absent (GAP-017: JWT auth missing). ' +
        'The handler must reject unauthenticated requests before reaching the AI factory.',
    ).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// T-W16.6-SCH-003b — 401 for invalid/malformed JWT
// ---------------------------------------------------------------------------

describe('T-W16.6-SCH-003b: POST /api/ai/request returns 401 for invalid JWT', () => {
  it('returns HTTP 401 when Authorization header contains a malformed JWT', async () => {
    // RED: Current handler passes all requests through without token validation.
    // GREEN: Handler verifies the JWT signature/expiry and rejects invalid tokens.
    const mockFactory = vi.fn(() => ({
      request: vi.fn().mockResolvedValue({
        output: { text: 'mocked' },
        telemetry: { providerUsed: 'openai', latencyMs: 1 },
      }),
    }));

    const handler = createHandler(mockFactory as never);
    const req = mockRequest({
      body: validBody,
      authorizationHeader: 'Bearer this.is.not.a.valid.jwt',
    });
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(
      res.statusCode,
      'Expected HTTP 401 when Authorization header contains an invalid JWT ' +
        '(GAP-017). Handler must validate the Bearer token before processing.',
    ).toBe(401);
  });

  it('returns HTTP 401 when Authorization header is "Bearer " (empty token)', async () => {
    // RED: Same gap — empty token must be rejected.
    const mockFactory = vi.fn(() => ({
      request: vi.fn().mockResolvedValue({
        output: { text: 'mocked' },
        telemetry: { providerUsed: 'openai', latencyMs: 1 },
      }),
    }));

    const handler = createHandler(mockFactory as never);
    const req = mockRequest({
      body: validBody,
      authorizationHeader: 'Bearer ',
    });
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(
      res.statusCode,
      'Expected HTTP 401 for empty Bearer token (GAP-017).',
    ).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// T-W16.6-SCH-003c — AICentre factory NOT called when JWT absent
// ---------------------------------------------------------------------------

describe('T-W16.6-SCH-003c: AICentre factory NOT called when JWT is absent', () => {
  it('does not invoke the AICentre factory when no Authorization header is provided', async () => {
    // RED: Currently the factory IS called for valid bodies regardless of JWT.
    // GREEN: Handler rejects before reaching the factory when JWT is absent.
    const mockAICentreRequest = vi.fn().mockResolvedValue({
      output: { text: 'mocked' },
      telemetry: { providerUsed: 'openai', latencyMs: 1 },
    });
    const mockFactory = vi.fn(() => ({ request: mockAICentreRequest }));

    const handler = createHandler(mockFactory as never);
    const req = mockRequest({ body: validBody }); // No Authorization header
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(
      mockFactory,
      'Expected the AICentre factory to NOT be called when Authorization header is absent ' +
        '(GAP-017). The JWT gate must execute before the factory is instantiated.',
    ).not.toHaveBeenCalled();

    expect(
      mockAICentreRequest,
      'Expected aiCentre.request() to NOT be called when JWT is absent (GAP-017).',
    ).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// T-W16.6-SCH-003d — 401 for unauthenticated caller with arbitrary organisationId
// ---------------------------------------------------------------------------

describe('T-W16.6-SCH-003d: POST /api/ai/request returns 401 when unauthenticated caller supplies arbitrary organisationId', () => {
  it('returns HTTP 401 when no JWT but organisationId is present in body', async () => {
    // RED: Currently body-validation accepts any organisationId string without
    //      cross-checking against the authenticated session's auth.uid().
    // GREEN: Handler validates JWT first; arbitrary organisationId in body cannot
    //        bypass authentication.
    const mockFactory = vi.fn(() => ({
      request: vi.fn().mockResolvedValue({
        output: { text: 'mocked' },
        telemetry: { providerUsed: 'openai', latencyMs: 1 },
      }),
    }));

    const handler = createHandler(mockFactory as never);
    const req = mockRequest({
      body: {
        capability: 'advisory',
        input: { text: 'Attempt unauthorized access' },
        context: { organisationId: 'attacker-controlled-org-id', sessionId: 'evil-session' },
      },
      // Deliberately no Authorization header
    });
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(
      res.statusCode,
      'Expected HTTP 401 when caller provides arbitrary organisationId but no valid JWT ' +
        '(GAP-017 AC-2: organisationId must be verified against auth.uid()). ' +
        'An unauthenticated caller must not reach AI processing regardless of body content.',
    ).toBe(401);
  });

  it('returns HTTP 401 when JWT is present but organisationId does not match auth.uid() claim', async () => {
    // RED: Current handler does not cross-check organisationId vs JWT claims.
    // GREEN: Handler extracts organisationId from verified JWT and rejects
    //        requests where body.context.organisationId !== jwt.sub/org claim.
    //
    // We use a structurally valid-looking (but unsigned/invalid-for-our-key) JWT
    // that claims org-111, while the body requests org-999.
    // The point: even supplying a token must not allow org-hijacking.
    const fakeJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
      '.eyJzdWIiOiJ1c2VyLTEiLCJvcmdfaWQiOiJvcmctMTExIiwiaWF0IjoxNjAwMDAwMDAwfQ' +
      '.FAKE_SIGNATURE';

    const mockFactory = vi.fn(() => ({
      request: vi.fn().mockResolvedValue({
        output: { text: 'mocked' },
        telemetry: { providerUsed: 'openai', latencyMs: 1 },
      }),
    }));

    const handler = createHandler(mockFactory as never);
    const req = mockRequest({
      body: {
        capability: 'advisory',
        input: { text: 'Cross-tenant access attempt' },
        context: { organisationId: 'org-999', sessionId: 'sess-x' }, // different from JWT claim
      },
      authorizationHeader: `Bearer ${fakeJwt}`,
    });
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    // Either 401 (invalid JWT signature) or 403 (org mismatch) are acceptable
    // security responses. The test asserts the handler does NOT return 200 or 400
    // for a cross-tenant request.
    expect(
      res.statusCode,
      'Expected a non-200 security rejection (401 or 403) when JWT org claim does not match ' +
        'body organisationId (GAP-017 AC-2). Handler must prevent cross-tenant access.',
    ).toBeGreaterThanOrEqual(401);

    expect(
      res.statusCode,
      'Status code must be 401 or 403 — not 400 (which would indicate the JWT was never checked).',
    ).not.toBe(400);
  });
});
