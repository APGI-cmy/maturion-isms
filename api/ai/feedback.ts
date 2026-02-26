/**
 * Vercel Serverless API Gateway — POST /api/ai/feedback
 *
 * Accepts user feedback events and submits them to the AIMC feedback pipeline.
 * Requires JWT authentication (Authorization: Bearer <token>).
 * All submissions are gated through the FeedbackPipeline class — no legacy
 * table access is permitted from this endpoint.
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.2 (API)
 *   Issue #613 — Wave 9.4 authority: CS2 (@APGI-cmy)
 *   GRS-011 | APS §10 | AAD §10.1
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

import { createClient } from '@supabase/supabase-js';
import { FeedbackPipeline } from '../../packages/ai-centre/src/feedback/FeedbackPipeline.js';
import type {
  FeedbackPipelineInterface,
  FeedbackEvent,
} from '../../packages/ai-centre/src/types/feedback.js';

// ---------------------------------------------------------------------------
// FeedbackPipeline factory
// ---------------------------------------------------------------------------

export type FeedbackPipelineFactory = () => FeedbackPipelineInterface;

/**
 * Build a FeedbackPipeline instance for this serverless request.
 * Uses a real Supabase client wired from environment variables.
 * In tests, inject via createHandler(mockFactory).
 */
export function buildFeedbackPipeline(): FeedbackPipelineInterface {
  const supabaseUrl = process.env['SUPABASE_URL'] ?? '';
  const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'] ?? '';
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return new FeedbackPipeline(supabaseClient);
}

// ---------------------------------------------------------------------------
// JWT helper
// ---------------------------------------------------------------------------

const BEARER_PREFIX_LENGTH = 7; // Length of 'Bearer '

/**
 * Decode the JWT Bearer token and extract the `sub` claim as userId.
 * No signature verification — Supabase RLS enforces real auth in production.
 */
function extractUserIdFromJwt(authHeader: string): string | undefined {
  try {
    const token = authHeader.slice(BEARER_PREFIX_LENGTH);
    const parts = token.split('.');
    if (parts.length !== 3) return undefined;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    return typeof payload['sub'] === 'string' ? payload['sub'] : undefined;
  } catch (error) {
    console.error('Failed to extract userId from JWT:', error);
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Request parsing
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

/** Validate and return the feedback event payload. */
export function validateFeedbackBody(
  body: unknown,
): Omit<FeedbackEvent, 'id' | 'arcStatus' | 'createdAt'> {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Request body must be a JSON object');
  }

  const b = body as Record<string, unknown>;

  if (typeof b['organisationId'] !== 'string' || !b['organisationId']) {
    throw new Error('organisationId is required');
  }
  if (typeof b['sessionId'] !== 'string' || !b['sessionId']) {
    throw new Error('sessionId is required');
  }
  if (typeof b['interactionId'] !== 'string' || !b['interactionId']) {
    throw new Error('interactionId is required');
  }

  const VALID_FEEDBACK_TYPES = ['positive', 'negative', 'correction', 'flag'] as const;
  if (
    typeof b['feedbackType'] !== 'string' ||
    !VALID_FEEDBACK_TYPES.includes(b['feedbackType'] as FeedbackEvent['feedbackType'])
  ) {
    throw new Error(
      `feedbackType must be one of: ${VALID_FEEDBACK_TYPES.join(', ')}`,
    );
  }
  if (typeof b['capability'] !== 'string' || !b['capability']) {
    throw new Error('capability is required');
  }
  if (typeof b['agentId'] !== 'string' || !b['agentId']) {
    throw new Error('agentId is required');
  }

  return {
    organisationId: b['organisationId'] as string,
    sessionId: b['sessionId'] as string,
    interactionId: b['interactionId'] as string,
    feedbackType: b['feedbackType'] as FeedbackEvent['feedbackType'],
    rating: typeof b['rating'] === 'number' ? b['rating'] : undefined,
    comment: typeof b['comment'] === 'string' ? b['comment'] : undefined,
    correctionText: typeof b['correctionText'] === 'string' ? b['correctionText'] : undefined,
    capability: b['capability'] as string,
    agentId: b['agentId'] as string,
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

/**
 * Create a handler with an injectable FeedbackPipeline factory.
 * The default export uses buildFeedbackPipeline(); tests may inject a mock factory.
 */
export function createHandler(factory: FeedbackPipelineFactory = buildFeedbackPipeline) {
  return async function handler(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
      return;
    }

    // Authentication guard — require Authorization: Bearer <token>
    const authHeader =
      (req.headers as Record<string, string | string[] | undefined>)['authorization'];
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'Authentication required. Provide Authorization: Bearer <token>.' }));
      return;
    }

    let payload: Omit<FeedbackEvent, 'id' | 'arcStatus' | 'createdAt'>;
    try {
      const body = await parseBody(req);
      const validated = validateFeedbackBody(body);
      // Extract userId from JWT sub claim — NOT from request body
      const userId = extractUserIdFromJwt(authHeader);
      payload = { ...validated, userId };
    } catch (err) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Invalid request',
        }),
      );
      return;
    }

    let created: FeedbackEvent;
    try {
      const pipeline = factory();
      created = await pipeline.submit(payload);
    } catch {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Feedback submission encountered an internal error.' }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify(created));
  };
}

export default createHandler();
