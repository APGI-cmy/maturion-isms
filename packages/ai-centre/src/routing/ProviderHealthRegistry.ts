/**
 * ProviderHealthRegistry — Wave 2 implementation
 *
 * Tracks provider health state with thresholds for DEGRADED and UNAVAILABLE.
 *
 * References: GRS-014 | APS §5.3 | AAD §5.3
 */
import {
  ProviderHealthStatus,
  type ProviderHealthRegistry as IProviderHealthRegistry,
  type ProviderName,
} from '../types/index.js';

export { ProviderHealthStatus };

const DEGRADED_THRESHOLD = 3;
const UNAVAILABLE_THRESHOLD = 10;

interface ProviderState {
  failures: number;
}

export class ProviderHealthRegistry implements IProviderHealthRegistry {
  private readonly state = new Map<ProviderName, ProviderState>();

  private getState(provider: ProviderName): ProviderState {
    if (!this.state.has(provider)) {
      this.state.set(provider, { failures: 0 });
    }
    return this.state.get(provider)!;
  }

  getHealth(provider: ProviderName): ProviderHealthStatus {
    const { failures } = this.getState(provider);
    if (failures >= UNAVAILABLE_THRESHOLD) return ProviderHealthStatus.UNAVAILABLE;
    if (failures >= DEGRADED_THRESHOLD) return ProviderHealthStatus.DEGRADED;
    return ProviderHealthStatus.HEALTHY;
  }

  recordSuccess(provider: ProviderName): void {
    const s = this.getState(provider);
    s.failures = Math.max(0, s.failures - 3);
  }

  recordFailure(provider: ProviderName): void {
    const s = this.getState(provider);
    s.failures += 1;
  }
}
