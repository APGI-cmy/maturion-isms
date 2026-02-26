/**
 * Wave 9.7 RED Gate — PIT AI Gateway Smoke Tests
 * Tests: PIT-AIMC-T-007 to PIT-AIMC-T-008
 *
 * QA-to-Red mandate: ALL tests in this file MUST fail (RED) before implementation.
 * These smoke tests verify the PIT AIMC wiring service is instantiable and
 * returns AIMC-compatible response structures for threat analysis requests.
 *
 * Architecture Freeze: ARCH-FREEZE-WAVE9-TRACK-C-20260226
 * Architecture: governance/aimc/freezes/ARCH_FREEZE-wave9-track-c-module-integration-20260226.md
 * AAWP Reference: governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md v0.2.0, §4, Wave 9.7
 * Foreman Session: session-063-20260226
 * Foreman Authorization: foreman-v2-agent — Issue #634 by @APGI-cmy
 *
 * Expected RED status (pre-Wave 9.7 implementation):
 *   PIT-AIMC-T-007 RED — modules/pit/src/services/aimc-wiring.ts does not exist
 *   PIT-AIMC-T-008 RED — modules/pit/src/services/aimc-wiring.ts does not exist
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ROOT = process.cwd();

const WIRING_SERVICE_PATH = path.join(
  ROOT,
  'modules/pit/src/services/aimc-wiring.ts',
);

// ─────────────────────────────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────────────────────────────

describe('Wave 9.7 RED Gate — PIT AI Gateway Smoke Tests', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // PIT-AIMC-T-007
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'PIT-AIMC-T-007: PIT AIMC wiring service can be instantiated',
    async () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.2):
       *   The PIT AIMC wiring service must be a class or factory that can be
       *   instantiated without throwing errors. Instantiation validates that:
       *   1. The module exports a default or named class/factory
       *   2. Dependencies are injectable (no hard-coded side effects at construction)
       *
       * Acceptance criteria:
       *   1. modules/pit/src/services/aimc-wiring.ts exists
       *   2. Module exports a class or function (PitAimcWiringService or equivalent)
       *   3. Can be instantiated / called without errors
       *
       * Status: RED — modules/pit/src/services/aimc-wiring.ts does not exist.
       *   Dynamic import will throw MODULE_NOT_FOUND.
       *   Will turn GREEN once Wave 9.7 implementation is delivered.
       */
      // Verify the file exists first (provides clearer failure message)
      expect(
        fs.existsSync(WIRING_SERVICE_PATH),
        `PIT AIMC wiring service must exist at: ${WIRING_SERVICE_PATH}\n` +
          'This file will be created by api-builder/integration-builder in Wave 9.7.',
      ).toBe(true);

      // Dynamically import the wiring service
      // Will fail with MODULE_NOT_FOUND until Wave 9.7 implementation is delivered
      const wiringModule = await import(
        '../../src/services/aimc-wiring.js'
      );

      // The module must export a default class or a named class
      const WiringServiceClass =
        wiringModule.default ?? wiringModule.PitAimcWiringService;

      expect(
        WiringServiceClass,
        'aimc-wiring.ts must export a default class or PitAimcWiringService named export',
      ).toBeDefined();

      // Must be instantiable without throwing
      const service = new WiringServiceClass();
      expect(service).toBeDefined();
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // PIT-AIMC-T-008
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'PIT-AIMC-T-008: PIT threat analysis request returns AIMC-compatible response structure',
    async () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §2.2):
       *   The PIT wiring service threat analysis method must return an AIMC-compatible
       *   response. AIMC gateway response structure includes at minimum:
       *   - content: string (the analysis text)
       *   - capability: string (echoes the requested capability — 'analysis' for PIT)
       *   - agent: string (echoes the agent persona used — 'pit-advisor')
       *
       *   The service itself may wrap this in a higher-level object, but the
       *   AIMC gateway response fields must be accessible.
       *
       * Acceptance criteria:
       *   The wiring service exports a method (e.g. requestAnalysis / invoke / analyze)
       *   that returns an object with at minimum: { content, capability, agent }
       *   OR wraps the AIMC response and exposes those fields.
       *
       * Status: RED — modules/pit/src/services/aimc-wiring.ts does not exist.
       *   Dynamic import will throw MODULE_NOT_FOUND.
       *   Will turn GREEN once Wave 9.7 implementation is delivered.
       *
       * Note: This is a STRUCTURAL check only. No actual HTTP calls are made.
       *   Implementations are expected to accept a mock/stub fetch function for testing.
       *   PIT uses capability: 'analysis' (threat analysis), NOT capability: 'advisory'.
       */
      // Verify the file exists first (provides clearer failure message)
      expect(
        fs.existsSync(WIRING_SERVICE_PATH),
        `PIT AIMC wiring service must exist at: ${WIRING_SERVICE_PATH}\n` +
          'This file will be created by api-builder/integration-builder in Wave 9.7.',
      ).toBe(true);

      // Dynamically import the wiring service
      const wiringModule = await import(
        '../../src/services/aimc-wiring.js'
      );

      const WiringServiceClass =
        wiringModule.default ?? wiringModule.PitAimcWiringService;

      expect(WiringServiceClass, 'Wiring service class must be exported').toBeDefined();

      // The service must expose a method for threat analysis requests
      // Acceptable method names: requestAnalysis, invoke, analyze, request
      const service = new WiringServiceClass();
      const analysisMethod =
        service.requestAnalysis ??
        service.invoke ??
        service.analyze ??
        service.request;

      expect(
        analysisMethod,
        'PIT wiring service must expose a threat analysis method: ' +
          'requestAnalysis, invoke, analyze, or request',
      ).toBeDefined();

      expect(
        typeof analysisMethod,
        'The threat analysis method must be a function',
      ).toBe('function');

      // Structural type check on the returned response shape
      // Uses a mock fetch to avoid real HTTP calls
      const mockFetch = async () => ({
        ok: true,
        json: async () => ({
          content: 'Mock threat analysis response',
          capability: 'analysis',
          agent: 'pit-advisor',
        }),
      });

      // Create instance with mock fetch (dependency injection)
      const serviceWithMock = new WiringServiceClass({ fetch: mockFetch });
      const response =
        (await serviceWithMock.requestAnalysis?.({
          prompt: 'Analyze this threat: CVE-2024-1234 exploit attempt detected',
          context: {},
        })) ??
        (await serviceWithMock.invoke?.({
          prompt: 'Analyze this threat: CVE-2024-1234 exploit attempt detected',
        }));

      // Response must be defined
      expect(response, 'Threat analysis method must return a response object').toBeDefined();

      // Response must contain AIMC-compatible fields
      const hasContent =
        typeof response?.content === 'string' ||
        typeof response?.text === 'string' ||
        typeof response?.message === 'string';

      expect(
        hasContent,
        'AIMC-compatible response must include a content/text/message string field. ' +
          `Received: ${JSON.stringify(response)}`,
      ).toBe(true);
    },
  );
});
