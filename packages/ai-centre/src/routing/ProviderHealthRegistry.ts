/**
 * ProviderHealthRegistry — STUB (Wave 2 implementation pending)
 *
 * All methods throw NOT_IMPLEMENTED until Wave 2 implementation is complete.
 * Tests against this stub will FAIL (RED) as required by AAD §9 / Step 6.
 *
 * References: GRS-014 | APS §5.3 | AAD §5.3
 */
import {
  ProviderHealthStatus,
  type ProviderHealthRegistry as IProviderHealthRegistry,
  type ProviderName,
} from '../types/index.js';

export { ProviderHealthStatus };

export class ProviderHealthRegistry implements IProviderHealthRegistry {
  getHealth(_provider: ProviderName): ProviderHealthStatus {
    throw new Error('NOT_IMPLEMENTED: ProviderHealthRegistry.getHealth()');
  }

  recordSuccess(_provider: ProviderName): void {
    throw new Error('NOT_IMPLEMENTED: ProviderHealthRegistry.recordSuccess()');
  }

  recordFailure(_provider: ProviderName): void {
    throw new Error('NOT_IMPLEMENTED: ProviderHealthRegistry.recordFailure()');
  }
}
