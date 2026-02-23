/**
 * @maturion/ai-centre — Public API
 *
 * References: APS §4.1 | AAD §3.2
 */
export { AICentre } from './gateway/AICentre.js';
export type {
  AICentreRequest,
  AICentreResponse,
  AICentreErrorResponse,
  Capability,
  CapabilityResult,
} from './types/index.js';
