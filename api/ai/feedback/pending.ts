/*
 * Vercel Serverless API Gateway - GET /api/ai/feedback/pending
 *
 * ARC (Adaptive Review Committee) endpoint that lists pending feedback events
 * for a given organisation. Requires either:
 *   - x-arc-token header matching ARC_APPROVAL_TOKEN (CS2-gated direct access), or
 *   - Authorization: Bearer <supabase-session-jwt> (Supabase-verified operator session)
 *     with organisationId provided as a query parameter.
 *
 * F-D3-002 remediation: Bearer tokens are verified via Supabase auth getUser.
 *
 * Query parameters:
 *   organisationId - required; the organisation whose pending events are returned
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';

import { createClient } from '@supabase/supabase-js';
import { FeedbackPipeline } from '../../../packages/ai-centre/src/feedback/FeedbackPipeline.js';
import type { FeedbackPipelineInterface } from '../../../packages/ai-centre/src/types/feedback.js';

// ---------------------------------------------------------------------------
// Bearer validator (injectable for testing)
// ---------------------------------------------------------------------------

export type BearerValidator = (token: string) => Promise<boolean>;

type SupabaseAuthUserResponse = {
  data?: { user?: unknown | null };
  error?: unknown | null;
};

type SupabaseAuthWithGetUser = {
  getUser: (jwt?: string) => Promise<SupabaseAuthUserResponse>;
};

async function verifyBearerWithSupabaseAuth(auth: unknown, token: string): Promise<boolean> {
  const authWithGetUser = auth as Partial<SupabaseAuthWithGetUser>;

  if (typeof authWithGetUser.getUser !== 'function') {
    return false;
  }

  const { data, error } = await authWithGetUser.getUser(token);
  return !error && Boolean(data?.user);
}

export function buildBearerValidator(): BearerValidator {
  return async (token: string): Promise<boolean> => {
    try {
      const supabaseUrl = process.env['SUPABASE_URL'] ?? '';
      const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'] ?? '';
      if (!supabaseUrl || !supabaseAnonKey) return false;
      const authClient = createClient(supabaseUrl, supabaseAnonKey);
      return await verifyBearerWithSupabaseAuth(authClient.auth, token);
    } catch {
      return false;
    }
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export type FeedbackPipelineFactory = () => FeedbackPipelineInterface;

export function buildFeedbackPipeline(): FeedbackPipelineInterface {
  const supabaseUrl = process.env['SUPABASE_URL'] ?? '';
  const supabaseServiceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for feedback pending pipeline');
  }
  const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
  return new FeedbackPipeline(supabaseClient);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export function createHandler(
  factory: FeedbackPipelineFactory = buildFeedbackPipeline,
  validateBearer: BearerValidator = buildBearerValidator(),
) {
  return async function handler(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'GET') {
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method not allowed. Use GET.' }));
      return;
    }

    const authHeader = (req.headers as Record<string, string | string[] | undefined>)['authorization'];
    const arcTokenHeader = (req.headers as Record<string, string | string[] | undefined>)['x-arc-token'];
    const expectedToken = process.env['ARC_APPROVAL_TOKEN'];

    let organisationId: string | null = null;

    const isArcTokenAuth =
      typeof arcTokenHeader === 'string' && expectedToken && arcTokenHeader === expectedToken;

    if (isArcTokenAuth) {
      const url = new URL(req.url ?? '/', 'http://localhost');
      organisationId = url.searchParams.get('organisationId');
    } else if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const isValidBearer = await validateBearer(token);
      if (!isValidBearer) {
        res.writeHead(403);
        res.end(JSON.stringify({ error: 'Forbidden. Bearer token could not be verified.' }));
        return;
      }
      const url = new URL(req.url ?? '/', 'http://localhost');
      organisationId = url.searchParams.get('organisationId');
    } else {
      res.writeHead(403);
      res.end(JSON.stringify({ error: 'Forbidden. Valid x-arc-token or authenticated session required.' }));
      return;
    }

    if (!organisationId) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'organisationId is required. Provide it as a query parameter.' }));
      return;
    }

    try {
      const pipeline = factory();
      const events = await pipeline.listPending(organisationId);
      res.writeHead(200);
      res.end(JSON.stringify(events));
    } catch (error) {
      console.error('Error listing pending feedback:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Pending feedback retrieval encountered an internal error.' }));
    }
  };
}

export default createHandler();
