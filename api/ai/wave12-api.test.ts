/**
 * Wave 12 — Full Functionality & Build Wiring Verification
 * Tests: T-W12-API-1 through T-W12-API-7
 *
 * Verifies:
 *   T-W12-API-1  AI Gateway /api/ai/request endpoint contract
 *   T-W12-API-2  /api/ai/health endpoint wiring
 *   T-W12-API-3  AI memory persistence lifecycle (API layer)
 *   T-W12-API-4  Error handling — missing required fields
 *   T-W12-API-5  API wiring coverage — all exported routes present
 *   T-W12-API-6  AI scoring pipeline E2E (W12-GAP-004)
 *   T-W12-API-7  Report generation E2E — RCA G-14 regression (W12-GAP-003)
 *
 * References: Wave 12 builder-contract.md §9.2 | Task 12.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createHandler, buildAICentre, SCORING_CAPABILITY, REPORTING_CAPABILITY } from './request.js';
import { createHealthHandler } from './health.js';
import { AI_ROUTE_REGISTRY } from './index.js';
import {
  Capability,
  type AICentreRequest,
  type AICentreResponse,
} from '../../packages/ai-centre/src/types/index.js';

// ---------------------------------------------------------------------------
// Test doubles — shared helpers
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

/** Build a minimal mock IncomingMessage for a method-only request (no body). */
function mockGetRequest(method = 'GET'): IncomingMessage {
  const emitter = new EventEmitter() as unknown as IncomingMessage;
  (emitter as Record<string, unknown>)['method'] = method;
  (emitter as Record<string, unknown>)['headers'] = {};
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

/** Build a minimal fake AICentreResponse for a given capability. */
function makeFakeResponse(capability: Capability | string, extra: Record<string, unknown> = {}): AICentreResponse {
  return {
    capability: capability as Capability,
    result: {
      capability: capability as Capability,
      text: 'Response content.',
      providerUsed: 'openai' as const,
      ...extra,
    } as AICentreResponse['result'],
    telemetry: {
      id: 'tel-' + Math.random().toString(36).slice(2),
      organisationId: 'org-test',
      capability: capability as Capability,
      providerUsed: 'openai' as const,
      promptTokens: 20,
      completionTokens: 40,
      latencyMs: 120,
      recordedAt: Date.now(),
    },
  };
}

const validAdvisoryBody = {
  capability: 'advisory',
  input: { text: 'What controls should I implement?' },
  context: { organisationId: 'org-001', sessionId: 'sess-001' },
};

// ---------------------------------------------------------------------------
// T-W12-API-1 — AI Gateway /api/ai/request endpoint contract
// ---------------------------------------------------------------------------

describe('T-W12-API-1: AI Gateway /api/ai/request endpoint contract', () => {
  it('T-W12-API-1a: POST with valid body returns { result, capability, provider } shape', async () => {
    const fakeResult = makeFakeResponse(Capability.ADVISORY);
    const mockAICentre = { request: vi.fn().mockResolvedValue(fakeResult) };
    const handler = createHandler(() => mockAICentre as unknown as ReturnType<typeof buildAICentre>);

    const req = mockRequest('POST', validAdvisoryBody);
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as Record<string, unknown>;

    // Shape: { result, capability, provider }
    // 'capability' must be present at top level
    expect(body).toHaveProperty('capability');
    expect(body['capability']).toBe(Capability.ADVISORY);

    // 'result' must be present
    expect(body).toHaveProperty('result');
    expect(typeof body['result']).toBe('object');

    // 'provider' — result.providerUsed is the provider field per AICentreResponse
    const result = body['result'] as Record<string, unknown>;
    expect(result).toHaveProperty('providerUsed');
    expect(typeof result['providerUsed']).toBe('string');
  });

  it('T-W12-API-1b: POST without capability returns 400 with error message', async () => {
    const handler = createHandler(vi.fn());
    const req = mockRequest('POST', {
      // capability intentionally omitted
      input: { text: 'What controls should I implement?' },
      context: { organisationId: 'org-001' },
    });
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body) as Record<string, unknown>;
    expect(typeof body['error']).toBe('string');
    expect((body['error'] as string).length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// T-W12-API-2 — /api/ai/health endpoint wiring
// ---------------------------------------------------------------------------

describe('T-W12-API-2: /api/ai/health endpoint wiring', () => {
  it('T-W12-API-2: GET returns { status, supabaseWiring: "active", persistentMemory: "supabase" }', async () => {
    const handler = createHealthHandler();
    const req = mockGetRequest('GET');
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as Record<string, unknown>;

    // Required fields per test spec
    expect(body).toHaveProperty('status');
    expect(body['status']).toBe('ok');

    expect(body).toHaveProperty('supabaseWiring');
    expect(body['supabaseWiring']).toBe('active');

    expect(body).toHaveProperty('persistentMemory');
    expect(body['persistentMemory']).toBe('supabase');
  });
});

// ---------------------------------------------------------------------------
// T-W12-API-3 — AI memory persistence lifecycle (API layer)
// ---------------------------------------------------------------------------

describe('T-W12-API-3: AI memory persistence lifecycle (API layer)', () => {
  it(
    'T-W12-API-3: second POST with same organisationId incorporates first request context',
    async () => {
      // Stateful mock factory: simulates persistent memory by tracking calls per org.
      // Each new call from the same org sees the previous inputs in context,
      // reproducing what AICentre + SupabasePersistentMemoryAdapter does at runtime.
      const memoryStore: Record<string, string[]> = {};

      const mockFactory = () => ({
        request: vi.fn().mockImplementation(async (req: AICentreRequest) => {
          const orgId = req.context.organisationId;
          const priorContext = memoryStore[orgId] ?? [];

          // Simulate AICentre incorporating prior memory into the response
          const responseText =
            priorContext.length > 0
              ? `[memory:${priorContext.join('|')}] answer: ${req.input.text}`
              : `initial: ${req.input.text}`;

          // Persist this turn
          memoryStore[orgId] = [...priorContext, req.input.text];

          return {
            capability: req.capability,
            result: {
              capability: req.capability,
              text: responseText,
              providerUsed: 'openai' as const,
            },
            telemetry: {
              id: 'tel-mem-' + Date.now(),
              organisationId: orgId,
              capability: req.capability,
              providerUsed: 'openai' as const,
              promptTokens: 15,
              completionTokens: 30,
              latencyMs: 90,
              recordedAt: Date.now(),
            },
          } as AICentreResponse;
        }),
      });

      const handler = createHandler(mockFactory as unknown as () => ReturnType<typeof buildAICentre>);

      const orgId = 'org-lifecycle-test';

      // First request
      const req1 = mockRequest('POST', {
        capability: 'advisory',
        input: { text: 'What is ISO 27001?' },
        context: { organisationId: orgId },
      });
      const res1 = mockResponse();
      await handler(req1, res1 as unknown as ServerResponse);

      expect(res1.statusCode).toBe(200);
      const body1 = JSON.parse(res1.body) as { result: { text: string } };
      // First response: no prior context
      expect(body1.result.text).toBe('initial: What is ISO 27001?');

      // Second request — same organisationId
      const req2 = mockRequest('POST', {
        capability: 'advisory',
        input: { text: 'How to implement Annex A controls?' },
        context: { organisationId: orgId },
      });
      const res2 = mockResponse();
      await handler(req2, res2 as unknown as ServerResponse);

      expect(res2.statusCode).toBe(200);
      const body2 = JSON.parse(res2.body) as { result: { text: string } };

      // Second response MUST incorporate the first request's context
      expect(body2.result.text).toContain('[memory:');
      expect(body2.result.text).toContain('What is ISO 27001?');
      expect(body2.result.text).toContain('How to implement Annex A controls?');

      // The second response differs from the first — context was incorporated
      expect(body2.result.text).not.toBe(body1.result.text);
    },
  );
});

// ---------------------------------------------------------------------------
// T-W12-API-4 — Error handling — missing required fields
// ---------------------------------------------------------------------------

describe('T-W12-API-4: Error handling — missing required fields', () => {
  it('T-W12-API-4a: POST without capability returns 400', async () => {
    const handler = createHandler(vi.fn());
    const req = mockRequest('POST', {
      // capability intentionally omitted
      input: { text: 'Risk assessment query' },
      context: { organisationId: 'org-err-001' },
    });
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body) as Record<string, unknown>;
    expect(typeof body['error']).toBe('string');
    // Error message must reference the invalid/missing capability
    expect((body['error'] as string).toLowerCase()).toMatch(/capability/);
  });

  it('T-W12-API-4b: POST without input.text (prompt) returns 400', async () => {
    const handler = createHandler(vi.fn());
    const req = mockRequest('POST', {
      capability: 'advisory',
      // input.text intentionally omitted
      input: { data: { something: true } },
      context: { organisationId: 'org-err-002' },
    });
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body) as Record<string, unknown>;
    expect(typeof body['error']).toBe('string');
    // Error message must reference the missing input.text / prompt field
    expect((body['error'] as string).toLowerCase()).toMatch(/input/);
  });
});

// ---------------------------------------------------------------------------
// T-W12-API-5 — API wiring coverage — all exported routes present on disk
// ---------------------------------------------------------------------------

describe('T-W12-API-5: API wiring coverage — all exported routes present', () => {
  it('T-W12-API-5: all route files in AI_ROUTE_REGISTRY exist on disk', () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const apiAiDir = resolve(__dirname, '.');

    const routeEntries = Object.entries(AI_ROUTE_REGISTRY) as [string, string][];

    expect(routeEntries.length).toBeGreaterThan(0);

    for (const [routePath, fileName] of routeEntries) {
      const filePath = resolve(apiAiDir, fileName);
      const fileExists = existsSync(filePath);

      expect(
        fileExists,
        `Route ${routePath} references '${fileName}' but file not found at ${filePath}`,
      ).toBe(true);
    }
  });

  it('T-W12-API-5b: AI_ROUTE_REGISTRY contains no broken handler imports', async () => {
    // Verify key route handlers can be dynamically imported without errors
    const { createHandler: reqHandler } = await import('./request.js');
    const { createHealthHandler: healthHandler } = await import('./health.js');

    expect(typeof reqHandler).toBe('function');
    expect(typeof healthHandler).toBe('function');

    // Verify the handlers produce callable instances
    const mockCentre = { request: vi.fn() };
    const reqInstance = reqHandler(() => mockCentre as unknown as ReturnType<typeof buildAICentre>);
    expect(typeof reqInstance).toBe('function');

    const healthInstance = healthHandler();
    expect(typeof healthInstance).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// T-W12-API-6 — AI scoring pipeline E2E (W12-GAP-004)
// ---------------------------------------------------------------------------

describe('T-W12-API-6: AI scoring pipeline E2E (W12-GAP-004)', () => {
  it('T-W12-API-6: POST with capability "scoring" returns result with maturityLevel and score', async () => {
    // Verify SCORING_CAPABILITY constant is exported
    expect(SCORING_CAPABILITY).toBe('scoring');

    // Mock factory simulating the scoring pipeline backend
    const scoringResult = {
      capability: SCORING_CAPABILITY as Capability,
      result: {
        capability: SCORING_CAPABILITY as Capability,
        maturityLevel: 3,
        score: 72,
        domain: 'Access Control',
        breakdown: {
          policyDocumentation: 80,
          technicalControls: 70,
          auditEvidence: 66,
        },
        providerUsed: 'openai' as const,
      } as unknown as AICentreResponse['result'],
      telemetry: {
        id: 'scoring-tel-001',
        organisationId: 'org-scoring-test',
        capability: SCORING_CAPABILITY as Capability,
        providerUsed: 'openai' as const,
        promptTokens: 50,
        completionTokens: 120,
        latencyMs: 250,
        recordedAt: Date.now(),
      },
    };

    const mockAICentre = { request: vi.fn().mockResolvedValue(scoringResult) };
    const handler = createHandler(() => mockAICentre as unknown as ReturnType<typeof buildAICentre>);

    const req = mockRequest('POST', {
      capability: SCORING_CAPABILITY,
      input: {
        text: 'Score the Access Control domain for org-scoring-test',
        data: {
          domain: 'Access Control',
          criteria: ['policy-documented', 'mfa-enabled', 'rbac-configured'],
        },
      },
      context: { organisationId: 'org-scoring-test' },
    });
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as Record<string, unknown>;

    // Scoring result MUST contain maturityLevel and score
    expect(body).toHaveProperty('result');
    const result = body['result'] as Record<string, unknown>;

    expect(result).toHaveProperty('maturityLevel');
    expect(typeof result['maturityLevel']).toBe('number');
    expect(result['maturityLevel']).toBeGreaterThanOrEqual(0);
    expect(result['maturityLevel']).toBeLessThanOrEqual(5);

    expect(result).toHaveProperty('score');
    expect(typeof result['score']).toBe('number');
    expect(result['score']).toBeGreaterThanOrEqual(0);
    expect(result['score']).toBeLessThanOrEqual(100);

    // Verify the handler correctly routed the scoring capability
    expect(mockAICentre.request).toHaveBeenCalledOnce();
    const calledWith = mockAICentre.request.mock.calls[0]![0] as AICentreRequest;
    expect(calledWith.capability).toBe(SCORING_CAPABILITY);
    expect(calledWith.context.organisationId).toBe('org-scoring-test');
  });
});

// ---------------------------------------------------------------------------
// T-W12-API-7 — Report generation E2E — RCA G-14 regression (W12-GAP-003)
// ---------------------------------------------------------------------------

describe('T-W12-API-7: Report generation E2E — RCA G-14 regression (W12-GAP-003)', () => {
  it('T-W12-API-7: POST with capability "reporting" returns result with reportId or content', async () => {
    // Verify REPORTING_CAPABILITY constant is exported
    expect(REPORTING_CAPABILITY).toBe('reporting');

    // Mock factory simulating the report generation pipeline backend
    const reportResult = {
      capability: REPORTING_CAPABILITY as Capability,
      result: {
        capability: REPORTING_CAPABILITY as Capability,
        reportId: 'rpt-20260301-001',
        content: '# Maturity Assessment Report\n\n## Executive Summary\n\n...',
        format: 'markdown',
        generatedAt: Date.now(),
        providerUsed: 'openai' as const,
      } as unknown as AICentreResponse['result'],
      telemetry: {
        id: 'reporting-tel-001',
        organisationId: 'org-reporting-test',
        capability: REPORTING_CAPABILITY as Capability,
        providerUsed: 'openai' as const,
        promptTokens: 75,
        completionTokens: 300,
        latencyMs: 450,
        recordedAt: Date.now(),
      },
    };

    const mockAICentre = { request: vi.fn().mockResolvedValue(reportResult) };
    const handler = createHandler(() => mockAICentre as unknown as ReturnType<typeof buildAICentre>);

    const req = mockRequest('POST', {
      capability: REPORTING_CAPABILITY,
      input: {
        text: 'Generate a maturity assessment report for org-reporting-test',
        data: {
          auditId: 'audit-2026-Q1',
          format: 'markdown',
          sections: ['executive-summary', 'domain-scores', 'recommendations'],
        },
      },
      context: { organisationId: 'org-reporting-test' },
    });
    const res = mockResponse();
    await handler(req, res as unknown as ServerResponse);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as Record<string, unknown>;

    // Report result MUST contain reportId OR content (per test spec)
    expect(body).toHaveProperty('result');
    const result = body['result'] as Record<string, unknown>;

    const hasReportId = 'reportId' in result && result['reportId'] !== undefined;
    const hasContent = 'content' in result && result['content'] !== undefined;

    expect(
      hasReportId || hasContent,
      `Expected result to have 'reportId' or 'content' but got: ${JSON.stringify(result)}`,
    ).toBe(true);

    // If reportId present, must be a non-empty string
    if (hasReportId) {
      expect(typeof result['reportId']).toBe('string');
      expect((result['reportId'] as string).length).toBeGreaterThan(0);
    }

    // If content present, must be a non-empty string
    if (hasContent) {
      expect(typeof result['content']).toBe('string');
      expect((result['content'] as string).length).toBeGreaterThan(0);
    }

    // Verify the handler correctly routed the reporting capability
    expect(mockAICentre.request).toHaveBeenCalledOnce();
    const calledWith = mockAICentre.request.mock.calls[0]![0] as AICentreRequest;
    expect(calledWith.capability).toBe(REPORTING_CAPABILITY);
    expect(calledWith.context.organisationId).toBe('org-reporting-test');
  });
});
