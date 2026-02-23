/**
 * AICentre Gateway — Wave 2 implementation
 *
 * Single entry point for all AI capability requests. Handles routing,
 * persona loading, execution, telemetry, and memory recording.
 *
 * References: GRS-001, GRS-002, GRS-003, GRS-014 | APS §4.1 | AAD §5.1
 */
import {
  AICentreErrorCode,
  ProviderHealthStatus,
  type AICentreConfig,
  type AICentreRequest,
  type AICentreResponse,
  type AICentreErrorResponse,
  type ProviderAdapter,
  type CapabilityResult,
} from '../types/index.js';
import { CapabilityRouter } from '../routing/CapabilityRouter.js';
import { PersonaNotFoundError } from '../types/index.js';

export class AICentre {
  private readonly config: AICentreConfig;
  private readonly router: CapabilityRouter;

  constructor(config: AICentreConfig) {
    this.config = config;
    this.router = new CapabilityRouter(config.routing);
  }

  async request(
    req: AICentreRequest,
  ): Promise<AICentreResponse | AICentreErrorResponse> {
    const startTime = Date.now();

    // Resolve persona system prompt
    let personaSystemPrompt = '';
    if (req.agent) {
      try {
        personaSystemPrompt = await this.config.personaLoader.load(req.agent);
      } catch (err) {
        if (
          err instanceof PersonaNotFoundError ||
          (err instanceof Error && err.message.includes('PersonaNotFoundError'))
        ) {
          const telId = await this._writeTelemetry(req, undefined, startTime, AICentreErrorCode.UNKNOWN_AGENT);
          return this._errorResponse(req, AICentreErrorCode.UNKNOWN_AGENT, 'Unknown agent persona.', false, telId, startTime);
        }
        const telId = await this._writeTelemetry(req, undefined, startTime, AICentreErrorCode.INTERNAL_ERROR);
        return this._errorResponse(req, AICentreErrorCode.INTERNAL_ERROR, 'Failed to load agent persona.', true, telId, startTime);
      }
    }

    // Resolve available providers
    const providers = this.router.resolveProviders(req.capability, this.config.healthRegistry);

    if (providers.length === 0) {
      const telId = await this._writeTelemetry(req, undefined, startTime, AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE);
      return this._errorResponse(req, AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE, 'All providers are currently unavailable.', true, telId, startTime);
    }

    // Try each provider in priority order
    let result: CapabilityResult | undefined;
    let usedAdapter: ProviderAdapter | undefined;

    for (const providerName of providers) {
      const adapter = this.config.adapters.find((a) => a.providerName === providerName);
      if (!adapter) continue;

      if (this.config.healthRegistry.getHealth(providerName) === ProviderHealthStatus.UNAVAILABLE) {
        continue;
      }

      try {
        result = await adapter.execute({
          capability: req.capability,
          systemPrompt: personaSystemPrompt,
          userInput: req.input.text,
          contextMessages: [],
          data: req.input.data,
        });
        usedAdapter = adapter;
        this.config.healthRegistry.recordSuccess(providerName);
        break;
      } catch {
        this.config.healthRegistry.recordFailure(providerName);
      }
    }

    if (!result || !usedAdapter) {
      const telId = await this._writeTelemetry(req, undefined, startTime, AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE);
      return this._errorResponse(req, AICentreErrorCode.ALL_PROVIDERS_UNAVAILABLE, 'All providers are currently unavailable.', true, telId, startTime);
    }

    const telId = await this._writeTelemetry(req, usedAdapter.providerName, startTime, undefined);

    const response: AICentreResponse = {
      capability: req.capability,
      result,
      telemetry: {
        id: telId,
        organisationId: req.context.organisationId,
        userId: req.context.userId,
        capability: req.capability,
        providerUsed: usedAdapter.providerName,
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: Date.now() - startTime,
        recordedAt: startTime,
      },
    };

    // Record memory turn via MemoryLifecycle if provided
    if (this.config.memoryLifecycle) {
      try {
        await this.config.memoryLifecycle.recordTurn({ request: req, response });
      } catch {
        // Non-fatal: memory recording failure does not fail the request
      }
    }

    return response;
  }

  private _errorProviderName(req: AICentreRequest): import('../types/index.js').ProviderName {
    const routes = this.config.routing.routes[req.capability];
    return (routes && routes.length > 0 ? routes[0] : 'github-models') as import('../types/index.js').ProviderName;
  }

  private async _writeTelemetry(
    req: AICentreRequest,
    providerUsed: string | undefined,
    startTime: number,
    errorCode: AICentreErrorCode | undefined,
  ): Promise<string> {
    try {
      return await this.config.telemetryWriter.write({
        organisationId: req.context.organisationId,
        userId: req.context.userId,
        capability: req.capability,
        providerUsed: (providerUsed ?? this._errorProviderName(req)) as import('../types/index.js').ProviderName,
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: Date.now() - startTime,
        errorCode,
        recordedAt: startTime,
      });
    } catch {
      return '';
    }
  }

  private _errorResponse(
    req: AICentreRequest,
    errorCode: AICentreErrorCode,
    message: string,
    retryable: boolean,
    telId: string,
    startTime: number,
  ): AICentreErrorResponse {
    return {
      capability: req.capability,
      errorCode,
      message,
      retryable,
      telemetry: {
        id: telId,
        organisationId: req.context.organisationId,
        userId: req.context.userId,
        capability: req.capability,
        providerUsed: this._errorProviderName(req),
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: Date.now() - startTime,
        errorCode,
        recordedAt: startTime,
      },
    };
  }
}
