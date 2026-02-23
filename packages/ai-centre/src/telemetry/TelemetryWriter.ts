/**
 * TelemetryWriter — STUB (Wave 2 implementation pending)
 *
 * All methods throw NOT_IMPLEMENTED until Wave 2 implementation is complete.
 * Tests against this stub will FAIL (RED) as required by AAD §9 / Step 6.
 *
 * References: GRS-012, GRS-013 | APS §9.2 | AAD §5.10
 */
import type {
  TelemetryWriter as ITelemetryWriter,
  TelemetryEvent,
} from '../types/index.js';

export class TelemetryWriter implements ITelemetryWriter {
  async write(_event: Omit<TelemetryEvent, 'id'>): Promise<string> {
    throw new Error('NOT_IMPLEMENTED: TelemetryWriter.write()');
  }
}
