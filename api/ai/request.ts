/**
 * Vercel Serverless API Gateway — POST /api/ai/request
 *
 * Accepts AI capability requests from the MAT frontend and routes them through
 * the AICentre gateway server-side, keeping GITHUB_TOKEN and OPENAI_API_KEY
 * out of the browser entirely.
 *
 * References: FR-072–FR-077, TR-072–TR-077 | ai-architecture.md v3.0.0 §9–§11
 * Wave 6 gap remediation — Issue: Implement Vercel Serverless API Gateway for AIMC Provider Calls
 * Wave 10 — AI Gateway Memory Wiring (null stubs replaced with real collaborators)
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

import { AICentre } from '../../packages/ai-centre/src/gateway/AICentre.js';
import { GitHubModelsAdapter } from '../../packages/ai-centre/src/adapters/GitHubModelsAdapter.js';
import { OpenAIAdapter } from '../../packages/ai-centre/src/adapters/OpenAIAdapter.js';
import { ProviderHealthRegistry } from '../../packages/ai-centre/src/routing/ProviderHealthRegistry.js';
import { ProviderKeyStore } from '../../packages/ai-centre/src/keys/ProviderKeyStore.js';
import { TelemetryWriter } from '../../packages/ai-centre/src/telemetry/TelemetryWriter.js';
import { PersonaLoader } from '../../packages/ai-centre/src/personas/PersonaLoader.js';
import { SessionMemoryStore } from '../../packages/ai-centre/src/memory/SessionMemoryStore.js';
import { PersistentMemoryAdapter } from '../../packages/ai-centre/src/memory/PersistentMemoryAdapter.js';
import {
  Capability,
  AICentreErrorCode,
  type AICentreRequest,
  type AICentreResponse,
  type AICentreErrorResponse,
} from '../../packages/ai-centre/src/types/index.js';

// ---------------------------------------------------------------------------
// Real collaborator factories — Wave 10: null stubs replaced
// ---------------------------------------------------------------------------

/** Returns a real PersonaLoader instance for use in this serverless handler. */
export function buildPersonaLoader(): PersonaLoader {
  return new PersonaLoader();
}

/** Returns a real SessionMemoryStore instance for use in this serverless handler. */
export function buildSessionMemory(): SessionMemoryStore {
  return new SessionMemoryStore();
}

/**
 * Returns a real PersistentMemoryAdapter instance.
 * Wave 10 baseline: in-memory implementation (Supabase wiring deferred to Wave 11).
 * Wave 11 TODO: Replace with SupabasePersistentMemoryAdapter(supabaseClient).
 * See: packages/ai-centre/supabase/migrations/001_ai_memory.sql
 */
export function buildPersistentMemory(): PersistentMemoryAdapter {
  return new PersistentMemoryAdapter();
}

// ---------------------------------------------------------------------------
// AICentre factory
// ---------------------------------------------------------------------------

/** Build a fully wired AICentre instance for this serverless request. */
export function buildAICentre(): AICentre {
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
    persistentMemory: buildPersistentMemory(),
    sessionMemory: buildSessionMemory(),
    personaLoader: buildPersonaLoader(),
    healthRegistry,
    adapters: [
      new GitHubModelsAdapter(keyStore),
      new OpenAIAdapter(keyStore),
    ],
  });
}

// ---------------------------------------------------------------------------
// Request parsing and validation
// ---------------------------------------------------------------------------

/** Accumulate the raw request body and parse it as JSON. */
export async function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8')));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

const ALLOWED_CAPABILITIES = new Set<string>(Object.values(Capability));

/** Validate the parsed body and return a typed AICentreRequest. */
export function validateRequest(body: unknown): AICentreRequest {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Request body must be a JSON object');
  }

  const b = body as Record<string, unknown>;

  if (typeof b['capability'] !== 'string' || !ALLOWED_CAPABILITIES.has(b['capability'])) {
    throw new Error(
      `Invalid capability. Must be one of: ${[...ALLOWED_CAPABILITIES].join(', ')}`,
    );
  }

  const input = b['input'];
  if (
    typeof input !== 'object' ||
    input === null ||
    typeof (input as Record<string, unknown>)['text'] !== 'string'
  ) {
    throw new Error('input.text is required and must be a string');
  }

  const context = b['context'];
  if (
    typeof context !== 'object' ||
    context === null ||
    typeof (context as Record<string, unknown>)['organisationId'] !== 'string'
  ) {
    throw new Error('context.organisationId is required and must be a string');
  }

  return {
    capability: b['capability'] as Capability,
    agent: typeof b['agent'] === 'string' ? b['agent'] : undefined,
    input: input as AICentreRequest['input'],
    context: context as AICentreRequest['context'],
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export type AICentreFactory = () => AICentre;

/**
 * Create a handler with an injectable AICentre factory.
 * The default export uses buildAICentre(); tests may inject a mock factory.
 */
export function createHandler(factory: AICentreFactory = buildAICentre) {
  return async function handler(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    res.setHeader('Content-Type', 'application/json');

    // CORS preflight — allow MAT frontend origin
    const allowedOrigin = process.env['VITE_API_BASE_URL'] ?? '*';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
      return;
    }

    let aiRequest: AICentreRequest;
    try {
      const body = await parseBody(req);
      aiRequest = validateRequest(body);
    } catch (err) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Invalid request',
        }),
      );
      return;
    }

    let result: AICentreResponse | AICentreErrorResponse;
    try {
      const aiCentre = factory();
      result = await aiCentre.request(aiRequest);
    } catch {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'AI gateway encountered an internal error.' }));
      return;
    }

    // Minimal telemetry — server-side only; keys and provider details never leave the server
    const isError = 'errorCode' in result;
    console.log(
      JSON.stringify({
        event: 'aimc_gateway_request',
        capability: aiRequest.capability,
        agent: aiRequest.agent ?? null,
        providerUsed: result.telemetry.providerUsed,
        latencyMs: result.telemetry.latencyMs,
        errorCode: isError ? (result as AICentreErrorResponse).errorCode : null,
        organisationId: aiRequest.context.organisationId,
      }),
    );

    if (isError) {
      const errResult = result as AICentreErrorResponse;
      const httpStatus =
        errResult.errorCode === AICentreErrorCode.INVALID_REQUEST ? 400 : 502;
      res.writeHead(httpStatus);
      res.end(
        JSON.stringify({
          error: 'AI provider request failed.',
          retryable: errResult.retryable,
          errorCode: errResult.errorCode,
        }),
      );
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify(result));
  };
}

export default createHandler();
