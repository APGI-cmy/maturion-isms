/**
 * @maturion/ai-centre — Public API
 *
 * References: APS §4.1 | AAD §3.2
 *
 * CL-4 ARCH-001 fix: expanded to export all public collaborator classes so
 * consumers never need deep internal path imports (GRS-001 compliance).
 */
export { AICentre } from './gateway/AICentre.js';

// ---------------------------------------------------------------------------
// Enums — exported as values (not type-only) so runtime usage is possible
// ---------------------------------------------------------------------------
export { Capability, AICentreErrorCode } from './types/index.js';

// ---------------------------------------------------------------------------
// Type-only exports from the types barrel
// ---------------------------------------------------------------------------
export type {
  AICentreRequest,
  AICentreResponse,
  AICentreErrorResponse,
  CapabilityResult,
  PersistentMemoryAdapter,
  // The SessionMemoryStore interface (from types) is aliased as ISessionMemoryStore
  // to avoid a name clash with the concrete SessionMemoryStore class exported below.
  SessionMemoryStore as ISessionMemoryStore,
  // The PersonaLoader interface (from types) is aliased as IPersonaLoader so
  // consumers can type function parameters against the interface rather than
  // the concrete class (preserving loose coupling and testability).
  PersonaLoader as IPersonaLoader,
} from './types/index.js';

// ---------------------------------------------------------------------------
// Concrete collaborator classes (CL-4 ARCH-001 — barrel public API additions)
// ---------------------------------------------------------------------------
export { OpenAIAdapter } from './adapters/OpenAIAdapter.js';
export { GitHubModelsAdapter } from './adapters/GitHubModelsAdapter.js';
export { AnthropicAdapter } from './adapters/AnthropicAdapter.js';
export { ProviderHealthRegistry } from './routing/ProviderHealthRegistry.js';
export { ProviderKeyStore } from './keys/ProviderKeyStore.js';
export { TelemetryWriter } from './telemetry/TelemetryWriter.js';
export { PersonaLoader } from './personas/PersonaLoader.js';
export { SessionMemoryStore } from './memory/SessionMemoryStore.js';
export { SupabasePersistentMemoryAdapter } from './memory/SupabasePersistentMemoryAdapter.js';
