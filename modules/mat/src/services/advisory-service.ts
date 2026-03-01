/**
 * Advisory Service — Wave 7: AIMC Advisory Integration
 *
 * Routes advisory requests through the @maturion/ai-centre AICentre Gateway.
 * This service is the MAT server-side entry point for advisory AI capabilities.
 *
 * Architecture mandate (ai-architecture.md v2.0.0):
 *   - All AI calls MUST go through @maturion/ai-centre — no direct provider calls.
 *   - MAT MUST NOT hold any AI provider API keys.
 *   - Persona list MUST come from AIMC canonical PersonaLoader (not hardcoded).
 *
 * References: FR-072, TR-072 | ai-architecture.md v2.0.0
 */
// All imports from the @maturion/ai-centre package barrel (GRS-001 / CL-4 ARCH-001 fix).
// No deep internal path imports — only the package root is used.
import {
  AICentre,
  Capability,
  PersonaLoader,
  GitHubModelsAdapter,
  OpenAIAdapter,
  ProviderHealthRegistry,
  ProviderKeyStore,
  TelemetryWriter,
  type AICentreResponse,
  type AICentreErrorResponse,
  type ISessionMemoryStore as SessionMemoryStore,
  type IPersonaLoader,
  type PersistentMemoryAdapter,
} from '../../../../packages/ai-centre';

// ---------------------------------------------------------------------------
// Null collaborators — no-op impls for stateless/service context
// ---------------------------------------------------------------------------

const nullSessionMemory: SessionMemoryStore = {
  append(): void {},
  getHistory(): [] {
    return [];
  },
  prune(): void {},
  clearSession(): void {},
};

const nullPersistentMemory: PersistentMemoryAdapter = {
  async retrieve(): Promise<[]> {
    return [];
  },
  async persist(): Promise<void> {},
  async pruneExpired(): Promise<number> {
    return 0;
  },
};

// ---------------------------------------------------------------------------
// Internal AICentre factory
// ---------------------------------------------------------------------------

/**
 * Build a fully wired AICentre instance for advisory use.
 * Mirrors the pattern in api/ai/request.ts — all routing and provider
 * management is delegated to the AIMC package.
 */
function buildAdvisoryAICentre(personaLoader: IPersonaLoader): AICentre {
  const keyStore = new ProviderKeyStore();
  const healthRegistry = new ProviderHealthRegistry();
  const telemetryWriter = new TelemetryWriter();

  return new AICentre({
    routing: {
      routes: {
        [Capability.ADVISORY]: ['github-models', 'openai'],
        [Capability.ANALYSIS]: ['openai'],
        [Capability.EMBEDDINGS]: ['openai'],
        [Capability.DOCUMENT_GENERATION]: ['openai'],
        [Capability.IMAGE_GENERATION]: ['openai'],
        [Capability.DEEP_SEARCH]: ['openai'],
        [Capability.VIDEO_GENERATION]: [],
        [Capability.ALGORITHM_EXECUTION]: [],
      },
    },
    keyStore,
    telemetryWriter,
    persistentMemory: nullPersistentMemory,
    sessionMemory: nullSessionMemory,
    personaLoader,
    healthRegistry,
    adapters: [
      new GitHubModelsAdapter(keyStore),
      new OpenAIAdapter(keyStore),
    ],
  });
}

// ---------------------------------------------------------------------------
// invokeAdvisory
// ---------------------------------------------------------------------------

/**
 * Invoke an advisory AI request via the AIMC AICentre Gateway.
 *
 * Accepts an optional `aiCentre` for dependency injection (testability).
 * When not provided, constructs a default instance via buildAdvisoryAICentre().
 *
 * Returns either a success shape (with text and invocationReferenceId)
 * or a structured error shape (never throws) so callers can handle
 * AIMC unavailability gracefully without unhandled exceptions.
 *
 * @param params - Advisory request parameters
 * @param aiCentre - Optional injected AICentre instance (for testing)
 */
export async function invokeAdvisory(
  params: {
    text: string;
    agentId?: string;
    organisationId: string;
    sessionId?: string;
    userId?: string;
  },
  aiCentre?: AICentre,
): Promise<
  | { success: true; text: string; invocationReferenceId: string }
  | { success: false; error: string; retryable: boolean }
> {
  const centre = aiCentre ?? buildAdvisoryAICentre(new PersonaLoader());

  try {
    const response = await centre.request({
      capability: Capability.ADVISORY,
      agent: params.agentId,
      input: { text: params.text },
      context: {
        organisationId: params.organisationId,
        sessionId: params.sessionId,
        userId: params.userId,
      },
    });

    // Distinguish error responses from success responses (APS §4.3)
    const isError = 'errorCode' in response;
    if (isError) {
      const errResponse = response as AICentreErrorResponse;
      return {
        success: false,
        error: errResponse.message,
        retryable: errResponse.retryable,
      };
    }

    // Success path — capture invocationReferenceId from telemetry
    const okResponse = response as AICentreResponse;
    const invocationReferenceId = okResponse.telemetry.id;
    const advisoryResult = okResponse.result as { text?: string };

    return {
      success: true,
      text: advisoryResult.text ?? '',
      invocationReferenceId,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Advisory service unavailable',
      retryable: true,
    };
  }
}

// ---------------------------------------------------------------------------
// listAdvisoryPersonas
// ---------------------------------------------------------------------------

/**
 * List available advisory personas from the AIMC canonical agent directory.
 *
 * Sources personas from PersonaLoader.listAvailable() — MAT does NOT maintain
 * its own hardcoded persona list (ai-architecture.md v2.0.0 mandate).
 *
 * Returns an empty array if the persona directory is unavailable (graceful degradation).
 */
export async function listAdvisoryPersonas(): Promise<string[]> {
  try {
    const personaLoader = new PersonaLoader();
    return await personaLoader.listAvailable();
  } catch {
    return [];
  }
}
