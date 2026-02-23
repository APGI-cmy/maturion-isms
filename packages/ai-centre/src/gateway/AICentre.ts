/**
 * AICentre Gateway — STUB (Wave 2 implementation pending)
 *
 * All methods throw NOT_IMPLEMENTED until Wave 2 implementation is complete.
 * Tests against this stub will FAIL (RED) as required by AAD §9 / Step 6.
 *
 * References: GRS-001, GRS-002, GRS-003, GRS-014 | APS §4.1 | AAD §5.1
 */
import type {
  AICentreConfig,
  AICentreRequest,
  AICentreResponse,
  AICentreErrorResponse,
} from '../types/index.js';

export class AICentre {
  constructor(_config: AICentreConfig) {
    // Dependency injection root — Wave 2 implementation pending
  }

  async request(
    _req: AICentreRequest,
  ): Promise<AICentreResponse | AICentreErrorResponse> {
    throw new Error('NOT_IMPLEMENTED: AICentre.request()');
  }
}
