/**
 * TelemetryWriter — Wave 2 implementation
 *
 * In-memory append-only telemetry store. Replaced by Supabase in Wave 4.
 *
 * References: GRS-012, GRS-013 | APS §9.2 | AAD §5.10
 */
import type {
  TelemetryWriter as ITelemetryWriter,
  TelemetryEvent,
} from '../types/index.js';

let counter = 0;

function generateId(): string {
  counter += 1;
  return `tel-${Date.now()}-${counter}`;
}

export class TelemetryWriter implements ITelemetryWriter {
  private readonly events: TelemetryEvent[] = [];

  async write(event: Omit<TelemetryEvent, 'id'>): Promise<string> {
    const id = generateId();
    this.events.push({ id, ...event });
    return id;
  }
}
