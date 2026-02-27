/**
 * Wave 9.6 RED Gate — xDetect AI Gateway Smoke Tests
 * Tests: XDETECT-AIMC-T-007 to XDETECT-AIMC-T-008
 *
 * QA-to-Red mandate: ALL tests in this file MUST fail (RED) before implementation.
 * These smoke tests verify the xDetect AIMC wiring service is instantiable and
 * returns AIMC-compatible response structures.
 *
 * Architecture Freeze: ARCH-FREEZE-WAVE9-TRACK-C-20260226
 * Architecture: governance/aimc/freezes/ARCH_FREEZE-wave9-track-c-module-integration-20260226.md
 * AAWP Reference: governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md v0.2.0, §4, Wave 9.6
 * Foreman Session: session-063-20260226
 * Foreman Authorization: foreman-v2-agent — Issue #634 by @APGI-cmy
 *
 * Expected RED status (pre-Wave 9.6):
 *   XDETECT-AIMC-T-007 RED — modules/xdetect/src/services/aimc-wiring.ts does not exist
 *   XDETECT-AIMC-T-008 RED — modules/xdetect/src/services/aimc-wiring.ts does not exist
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
  'modules/xdetect/src/services/aimc-wiring.ts',
);

// ─────────────────────────────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────────────────────────────

describe('Wave 9.6 RED Gate — xDetect AI Gateway Smoke Tests', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // XDETECT-AIMC-T-007
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'XDETECT-AIMC-T-007: xDetect AIMC wiring service can be instantiated',
    async () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.1):
       *   The xDetect AIMC wiring service must be a class or factory that can be
       *   instantiated without throwing errors. Instantiation validates that:
       *   1. The module exports a default or named class/factory
       *   2. Dependencies are injectable (no hard-coded side effects at construction)
       *
       * Acceptance criteria:
       *   1. modules/xdetect/src/services/aimc-wiring.ts exists
       *   2. Module exports a class or function (XDetectAimcWiringService or equivalent)
       *   3. Can be instantiated / called without errors
       *
       * Status: RED — modules/xdetect/src/services/aimc-wiring.ts does not exist.
       *   Dynamic import will throw MODULE_NOT_FOUND.
       *   Will turn GREEN once Wave 9.6 implementation is delivered.
       */
      // Verify the file exists first (provides clearer failure message)
      expect(
        fs.existsSync(WIRING_SERVICE_PATH),
        `xDetect AIMC wiring service must exist at: ${WIRING_SERVICE_PATH}\n` +
          'This file will be created by api-builder/integration-builder in Wave 9.6.',
      ).toBe(true);

      // Dynamically import the wiring service
      // Will fail with MODULE_NOT_FOUND until Wave 9.6 implementation is delivered
      const wiringModule = await import(
        '../../src/services/aimc-wiring.js'
      );

      // The module must export a default class or a named class
      const WiringServiceClass =
        wiringModule.default ?? wiringModule.XDetectAimcWiringService;

      expect(
        WiringServiceClass,
        'aimc-wiring.ts must export a default class or XDetectAimcWiringService named export',
      ).toBeDefined();

      // Must be instantiable without throwing
      const service = new WiringServiceClass();
      expect(service).toBeDefined();
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // XDETECT-AIMC-T-008
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'XDETECT-AIMC-T-008: xDetect advisory request returns AIMC-compatible response structure',
    async () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §2.2):
       *   The wiring service advisory method must return an AIMC-compatible response.
       *   AIMC gateway response structure includes at minimum:
       *   - content: string (the advisory text)
       *   - capability: string (echoes the requested capability)
       *   - agent: string (echoes the agent persona used)
       *
       *   The service itself may wrap this in a higher-level object, but the
       *   AIMC gateway response fields must be accessible.
       *
       * Acceptance criteria:
       *   The wiring service exports a method (e.g. requestAdvisory / invoke / advise)
       *   that returns an object with at minimum: { content, capability, agent }
       *   OR wraps the AIMC response and exposes those fields.
       *
       * Status: RED — modules/xdetect/src/services/aimc-wiring.ts does not exist.
       *   Dynamic import will throw MODULE_NOT_FOUND.
       *   Will turn GREEN once Wave 9.6 implementation is delivered.
       *
       * Note: This is a STRUCTURAL check only. No actual HTTP calls are made.
       *   Implementations are expected to accept a mock/stub fetch function for testing.
       */
      // Verify the file exists first (provides clearer failure message)
      expect(
        fs.existsSync(WIRING_SERVICE_PATH),
        `xDetect AIMC wiring service must exist at: ${WIRING_SERVICE_PATH}\n` +
          'This file will be created by api-builder/integration-builder in Wave 9.6.',
      ).toBe(true);

      // Dynamically import the wiring service
      const wiringModule = await import(
        '../../src/services/aimc-wiring.js'
      );

      const WiringServiceClass =
        wiringModule.default ?? wiringModule.XDetectAimcWiringService;

      expect(WiringServiceClass, 'Wiring service class must be exported').toBeDefined();

      // The service must expose a method for advisory requests
      // Acceptable method names: requestAdvisory, invoke, advise, request
      const service = new WiringServiceClass();
      const advisoryMethod =
        service.requestAdvisory ??
        service.invoke ??
        service.advise ??
        service.request;

      expect(
        advisoryMethod,
        'xDetect wiring service must expose an advisory method: ' +
          'requestAdvisory, invoke, advise, or request',
      ).toBeDefined();

      expect(
        typeof advisoryMethod,
        'The advisory method must be a function',
      ).toBe('function');

      // Structural type check on the returned response shape
      // Uses a mock fetch to avoid real HTTP calls
      const mockFetch = async () => ({
        ok: true,
        json: async () => ({
          content: 'Mock advisory response',
          capability: 'advisory',
          agent: 'xdetect-advisor',
        }),
      });

      // Create instance with mock fetch (dependency injection)
      const serviceWithMock = new WiringServiceClass({ fetch: mockFetch });
      const response = await serviceWithMock.requestAdvisory?.({
        prompt: 'Analyze this threat indicator: 192.168.1.1',
        context: {},
      }) ?? await serviceWithMock.invoke?.({
        prompt: 'Analyze this threat indicator: 192.168.1.1',
      });

      // Response must be defined
      expect(response, 'Advisory method must return a response object').toBeDefined();

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
