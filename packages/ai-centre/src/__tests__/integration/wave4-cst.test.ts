/**
 * Wave 4 CST (Component System Tests) — Integration Test Suite
 *
 * Mandated by AAWP Wave 4 handover/merge requirements.
 * These tests verify end-to-end behaviour across MemoryLifecycle,
 * PersistentMemoryAdapter, and the AICentre gateway.
 *
 * CS2 ISMS Navigator Wave-Confirmation: CS2 confirmed via PR #487 comment
 * (2026-02-24) that the ISMS Navigator persona is authorised for Wave 4.
 * Implementation proceeded under this authorisation.
 *
 * References: GRS-008, GRS-030 | APS §7.2, §7.3, §7.5 | AAD §5.7, §5.8
 *
 * Mapped requirements:
 *   GRS-008  Supabase persistent memory with organisation-level tenant isolation
 *   GRS-030  Context window assembly order
 *
 * AAWP Wave 4 mandated integration tests:
 *   1. PersistentMemoryAdapter.persist() writes with correct organisation_id;
 *      retrieve() returns only matching records   → PersistentMemoryAdapter.test.ts
 *   2. Cross-session: prior turn retrieved in new session via persistent memory → THIS FILE
 *   3. Analysis capability: ai.request({ capability: 'analysis' }) returns AnalysisResult → THIS FILE
 *   4. RLS: cross-tenant retrieval returns no records → PersistentMemoryAdapter.test.ts
 */
import { describe, it, expect, vi } from 'vitest';
import { MemoryLifecycle } from '../../memory/MemoryLifecycle.js';
import { PersistentMemoryAdapter } from '../../memory/PersistentMemoryAdapter.js';
import { SessionMemoryStore } from '../../memory/SessionMemoryStore.js';
import { AICentre } from '../../gateway/AICentre.js';
import {
  Capability,
  ProviderHealthStatus,
  type AICentreConfig,
  type AICentreRequest,
  type AICentreResponse,
  type AnalysisResult,
} from '../../types/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(overrides: Partial<AICentreRequest> = {}): AICentreRequest {
  return {
    capability: Capability.ADVISORY,
    agent: 'mat-advisor',
    input: { text: 'What controls should I implement for ISO 27001?' },
    context: { organisationId: 'org-wave4', sessionId: 'sess-wave4', userId: 'user-001' },
    ...overrides,
  };
}

function makeAdvisoryResponse(sessionId = 'sess-wave4') {
  return {
    capability: Capability.ADVISORY as const,
    result: {
      capability: Capability.ADVISORY as const,
      text: 'Focus on Annex A controls and risk treatment.',
      providerUsed: 'github-models' as const,
    },
    telemetry: {
      id: 'tel-wave4-001',
      organisationId: 'org-wave4',
      capability: Capability.ADVISORY as const,
      providerUsed: 'github-models' as const,
      promptTokens: 40,
      completionTokens: 15,
      latencyMs: 200,
      recordedAt: Date.now(),
    },
  };
}

function makeAnalysisConfig(): AICentreConfig {
  return {
    routing: {
      routes: {
        [Capability.ADVISORY]: ['github-models'],
        [Capability.ANALYSIS]: ['openai'],
        [Capability.EMBEDDINGS]: ['openai'],
        [Capability.DOCUMENT_GENERATION]: ['anthropic'],
        [Capability.IMAGE_GENERATION]: ['openai'],
        [Capability.DEEP_SEARCH]: ['perplexity'],
        [Capability.VIDEO_GENERATION]: ['runway'],
        [Capability.ALGORITHM_EXECUTION]: [],
      },
    },
    keyStore: { getKey: vi.fn().mockReturnValue('test-key') },
    telemetryWriter: { write: vi.fn().mockResolvedValue('tel-analysis-001') },
    persistentMemory: {
      retrieve: vi.fn().mockResolvedValue([]),
      persist: vi.fn().mockResolvedValue(undefined),
      pruneExpired: vi.fn().mockResolvedValue(0),
    },
    sessionMemory: {
      append: vi.fn(),
      getHistory: vi.fn().mockReturnValue([]),
      prune: vi.fn(),
      clearSession: vi.fn(),
    },
    personaLoader: {
      load: vi.fn().mockResolvedValue('# ISMS Navigator\nYou are the Maturion ISMS Navigator.'),
      listAvailable: vi.fn().mockResolvedValue(['isms-navigator']),
    },
    healthRegistry: {
      getHealth: vi.fn().mockReturnValue(ProviderHealthStatus.HEALTHY),
      recordSuccess: vi.fn(),
      recordFailure: vi.fn(),
    },
    adapters: [
      {
        providerName: 'openai' as const,
        supportedCapabilities: new Set([Capability.ANALYSIS, Capability.ADVISORY]),
        execute: vi.fn().mockResolvedValue({
          capability: Capability.ANALYSIS,
          data: { summary: 'Risk level: LOW', controls: ['A.9.1', 'A.10.1'] },
          providerUsed: 'openai',
        } as AnalysisResult),
        healthCheck: vi.fn().mockResolvedValue(ProviderHealthStatus.HEALTHY),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Integration Test 2: Cross-session persistent memory retrieval (AAWP Wave 4)
// ---------------------------------------------------------------------------

describe('Wave 4 CST — Cross-session persistent memory (GRS-008, GRS-030)', () => {
  it(
    // AAWP Wave 4 integration test #2
    // GRS-008 | GRS-030 | AAD §5.8
    "recordTurn() persists both turns to persistent memory, then assembleContextWindow() returns them in a new session",
    async () => {
      const persistentAdapter = new PersistentMemoryAdapter();
      const sessionStore = new SessionMemoryStore();

      const lifecycle = new MemoryLifecycle({ sessionStore, persistentAdapter });

      // Simulate a completed turn in session A
      const req = makeRequest({ context: { organisationId: 'org-wave4', sessionId: 'sess-A', userId: 'user-001' } });
      const resp = makeAdvisoryResponse('sess-A');

      await lifecycle.recordTurn({ request: req, response: resp });

      // Verify persistent memory was populated with both turns
      const persisted = await persistentAdapter.retrieve({ organisationId: 'org-wave4' });
      expect(persisted.length).toBe(2);
      expect(persisted.some((e) => e.role === 'user')).toBe(true);
      expect(persisted.some((e) => e.role === 'assistant')).toBe(true);
      expect(persisted.every((e) => e.organisationId === 'org-wave4')).toBe(true);

      // Simulate a NEW session B — assembleContextWindow should pull in prior history
      const assembled = await lifecycle.assembleContextWindow({
        organisationId: 'org-wave4',
        sessionId: 'sess-B',
        userInput: 'What else should I do?',
        personaSystemPrompt: '# MAT Advisor',
      });

      // canonical order: persona → persistent → (empty session-B) → user input
      expect(assembled[0]).toMatchObject({ role: 'system' }); // persona
      expect(assembled.some((s) => s.content === req.input.text)).toBe(true); // prior user turn
      expect(assembled.some((s) => s.content === resp.result.text)).toBe(true); // prior assistant turn
      expect(assembled[assembled.length - 1]).toMatchObject({
        role: 'user',
        content: 'What else should I do?',
      }); // current input
    },
  );

  it(
    // AAWP Wave 4 integration test #2 — tenant isolation
    // GRS-008 | AAD §5.8
    "recordTurn() persists only to the correct organisationId — cross-tenant retrieval returns no records",
    async () => {
      const persistentAdapter = new PersistentMemoryAdapter();
      const sessionStore = new SessionMemoryStore();
      const lifecycle = new MemoryLifecycle({ sessionStore, persistentAdapter });

      const req = makeRequest({ context: { organisationId: 'org-tenant-A', sessionId: 'sess-tenant', userId: 'u1' } });
      const resp = makeAdvisoryResponse('sess-tenant');

      await lifecycle.recordTurn({ request: req, response: resp });

      // Cross-tenant: org-tenant-B should see no records
      const crossTenantResults = await persistentAdapter.retrieve({ organisationId: 'org-tenant-B' });
      expect(crossTenantResults).toEqual([]);

      // Correct tenant should see records
      const correctTenantResults = await persistentAdapter.retrieve({ organisationId: 'org-tenant-A' });
      expect(correctTenantResults.length).toBe(2);
    },
  );
});

// ---------------------------------------------------------------------------
// Integration Test 3: Analysis capability end-to-end (AAWP Wave 4)
// ---------------------------------------------------------------------------

describe('Wave 4 CST — Analysis capability routing (GRS-004, APS §6.2)', () => {
  it(
    // AAWP Wave 4 integration test #3
    // GRS-004 | APS §6.2 | AAD §5.5
    "ai.request({ capability: 'analysis' }) routes to OpenAIAdapter and returns AnalysisResult",
    async () => {
      const config = makeAnalysisConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(
        makeRequest({ capability: Capability.ANALYSIS, agent: 'isms-navigator' }),
      ) as AICentreResponse;

      expect(response.capability).toBe(Capability.ANALYSIS);
      expect(response.result.capability).toBe(Capability.ANALYSIS);
      expect((response.result as AnalysisResult).data).toBeDefined();
      expect(typeof (response.result as AnalysisResult).data).toBe('object');
      expect(response.result.providerUsed).toBe('openai');
    },
  );

  it(
    // AAWP Wave 4 integration test #3 — structured result shape
    // GRS-004 | APS §6.2
    "AnalysisResult.data is a Record<string, unknown> (structured analysis, not plain text)",
    async () => {
      const config = makeAnalysisConfig();
      const gateway = new AICentre(config);

      const response = await gateway.request(
        makeRequest({ capability: Capability.ANALYSIS }),
      ) as AICentreResponse;

      const result = response.result as AnalysisResult;
      expect(result.data).toMatchObject(expect.any(Object));
      // Must not be a string — analysis returns structured data
      expect(typeof result.data).not.toBe('string');
    },
  );
});
