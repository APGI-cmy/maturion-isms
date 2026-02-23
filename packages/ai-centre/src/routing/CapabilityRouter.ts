/**
 * CapabilityRouter — Wave 2 implementation
 *
 * Resolves providers for a capability, filtered by health registry.
 *
 * References: GRS-003, GRS-004 | APS §5.1 | AAD §5.2
 */
import {
  ProviderHealthStatus,
  type CapabilityRouter as ICapabilityRouter,
  type Capability,
  type ProviderHealthRegistry,
  type ProviderName,
  type RoutingConfiguration,
} from '../types/index.js';

export class CapabilityRouter implements ICapabilityRouter {
  private readonly config: RoutingConfiguration;

  constructor(config: RoutingConfiguration) {
    this.config = config;
  }

  resolveProviders(
    capability: Capability,
    healthRegistry: ProviderHealthRegistry,
  ): ProviderName[] {
    const configured = this.config.routes[capability] ?? [];
    return configured.filter(
      (p) => healthRegistry.getHealth(p) !== ProviderHealthStatus.UNAVAILABLE,
    );
  }
}
