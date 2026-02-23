/**
 * CapabilityRouter — STUB (Wave 2 implementation pending)
 *
 * All methods throw NOT_IMPLEMENTED until Wave 2 implementation is complete.
 * Tests against this stub will FAIL (RED) as required by AAD §9 / Step 6.
 *
 * References: GRS-003, GRS-004 | APS §5.1 | AAD §5.2
 */
import type {
  CapabilityRouter as ICapabilityRouter,
  Capability,
  ProviderHealthRegistry,
  ProviderName,
  RoutingConfiguration,
} from '../types/index.js';

export class CapabilityRouter implements ICapabilityRouter {
  constructor(_config: RoutingConfiguration) {
    // Wave 2 implementation pending
  }

  resolveProviders(
    _capability: Capability,
    _healthRegistry: ProviderHealthRegistry,
  ): ProviderName[] {
    throw new Error('NOT_IMPLEMENTED: CapabilityRouter.resolveProviders()');
  }
}
