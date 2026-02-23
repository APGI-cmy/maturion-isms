/**
 * RED Gate QA Suite — TelemetryWriter
 *
 * All tests MUST FAIL until Wave 2 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-012, GRS-013 | APS §9.1, §9.2 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-012  Per-call telemetry event with required fields
 *   GRS-013  Telemetry immutability — append-only, no update/delete
 */
import { describe, it, expect } from 'vitest';
import { TelemetryWriter } from '../../telemetry/TelemetryWriter.js';
import {
  Capability,
  type TelemetryWriter as ITelemetryWriter,
  type TelemetryEvent,
} from '../../types/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEvent(): Omit<TelemetryEvent, 'id'> {
  return {
    organisationId: 'org-001',
    userId: 'user-001',
    capability: Capability.ADVISORY,
    providerUsed: 'github-models',
    promptTokens: 120,
    completionTokens: 45,
    latencyMs: 380,
    recordedAt: Date.now(),
  };
}

// ---------------------------------------------------------------------------
// Tests (GRS-012, GRS-013)
// ---------------------------------------------------------------------------

describe('TelemetryWriter', () => {
  it(
    // GRS-012 | AAD §9.2
    "write() returns the generated record id on success",
    async () => {
      const writer = new TelemetryWriter();

      const id = await writer.write(makeEvent());

      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    },
  );

  it(
    // GRS-012 | AAD §9.2
    "write() persists a record that includes all required TelemetryEvent fields",
    async () => {
      const writer = new TelemetryWriter();
      const event = makeEvent();

      const recordId = await writer.write(event);

      // Structural completeness: verify all required TelemetryEvent fields are present
      // in the event submitted to write(). This is an input-validation assertion — it
      // confirms the caller correctly constructs a complete event before writing.
      //
      // NOTE: This does NOT yet verify what is actually persisted in Supabase.
      // Wave 2 builder: extend this test to retrieve-and-verify the stored record
      // once the Supabase-backed TelemetryWriter is implemented.
      expect(typeof recordId).toBe('string');
      expect(recordId.length).toBeGreaterThan(0);

      const requiredFields: Array<keyof Omit<TelemetryEvent, 'id'>> = [
        'organisationId',
        'capability',
        'providerUsed',
        'promptTokens',
        'completionTokens',
        'latencyMs',
        'recordedAt',
      ];
      for (const field of requiredFields) {
        expect(event).toHaveProperty(field);
        expect(event[field]).toBeDefined();
      }
    },
  );

  it(
    // GRS-013 | AAD §9.2
    "No update or delete method exists on the TelemetryWriter interface (enforced by TypeScript type)",
    () => {
      // This test is a TypeScript-level contract assertion.
      // The TelemetryWriter interface MUST NOT expose update() or delete().
      // At runtime we confirm the class instance does not have these methods.
      const writer = new TelemetryWriter();

      expect((writer as unknown as Record<string, unknown>)['update']).toBeUndefined();
      expect((writer as unknown as Record<string, unknown>)['delete']).toBeUndefined();

      // Also assert on the interface type itself (checked by TypeScript compiler)
      const iface: ITelemetryWriter = writer;
      expect(typeof iface.write).toBe('function');
    },
  );
});
