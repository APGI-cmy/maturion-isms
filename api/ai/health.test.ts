/**
 * Unit tests — GET /api/ai/health serverless handler
 *
 * RED gate tests for Wave 10 health check endpoint.
 * ALL tests in this file are RED until api/ai/health.ts is created by
 * api-builder.  The module-not-found error at collection time is the expected
 * failure mode — it confirms the file does not yet exist.
 *
 * References: FR-076, TR-076 | Wave 10 gap remediation
 */
import { describe, it, expect, vi } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';

// RED: This import FAILS until api-builder creates api/ai/health.ts.
// The module-not-found error bubbles as a collection failure — all four tests
// below show as RED for that exact reason.
import { createHealthHandler } from './health.js';

// ---------------------------------------------------------------------------
// Test doubles
// ---------------------------------------------------------------------------

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

/** Build a minimal mock IncomingMessage for a method-only request (no body). */
function mockGetRequest(method: string = 'GET'): IncomingMessage {
  const emitter = new EventEmitter() as unknown as IncomingMessage;
  (emitter as Record<string, unknown>)['method'] = method;
  (emitter as Record<string, unknown>)['headers'] = {};
  return emitter;
}

// ---------------------------------------------------------------------------
// T-076-1 through T-076-4
// All fail with: "Cannot find module './health.js'" until health.ts is created
// ---------------------------------------------------------------------------

describe('GET /api/ai/health — health check endpoint (T-076-1 through T-076-4)', () => {
  // T-076-1 ----------------------------------------------------------------
  it('T-076-1: returns 200 with status ok for a GET request', async () => {
    const handler = createHealthHandler();
    const req = mockGetRequest('GET');
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as Record<string, unknown>;
    expect(body['status']).toBe('ok');
  });

  // T-076-2 ----------------------------------------------------------------
  it('T-076-2: returns 405 for non-GET methods (POST, DELETE, PATCH)', async () => {
    for (const method of ['POST', 'DELETE', 'PATCH']) {
      const handler = createHealthHandler();
      const req = mockGetRequest(method);
      const res = mockResponse();

      await handler(req, res as unknown as ServerResponse);

      expect(res.statusCode).toBe(405);
      const body = JSON.parse(res.body) as Record<string, unknown>;
      expect(typeof body['error']).toBe('string');
    }
  });

  // T-076-3 ----------------------------------------------------------------
  it('T-076-3: response body includes a numeric timestamp field', async () => {
    const handler = createHealthHandler();
    const req = mockGetRequest('GET');
    const res = mockResponse();

    await handler(req, res as unknown as ServerResponse);

    const body = JSON.parse(res.body) as Record<string, unknown>;
    // timestamp must be a positive integer (Unix ms epoch)
    expect(typeof body['timestamp']).toBe('number');
    expect(body['timestamp'] as number).toBeGreaterThan(0);
  });

  // T-076-4 ----------------------------------------------------------------
  it('T-076-4: sets Content-Type: application/json on every response', async () => {
    const handler = createHealthHandler();
    // Test both a valid GET and an invalid method
    for (const method of ['GET', 'POST']) {
      const req = mockGetRequest(method);
      const res = mockResponse();

      await handler(req, res as unknown as ServerResponse);

      expect(res.headers['Content-Type']).toBe('application/json');
    }
  });
});
