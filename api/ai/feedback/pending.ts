/**
 * Vercel Serverless API Gateway — GET /api/ai/feedback/pending
 *
 * ARC (Adaptive Review Committee) endpoint that lists pending feedback events
 * for a given organisation. Requires either:
 *   - x-arc-token header matching ARC_APPROVAL_TOKEN (CS2-gated direct access), or
 *   - Authorization: Bearer <supabase-session-jwt> (Supabase-verified operator session)
 *     with organisationId provided as a query parameter.
 *
 * F-D3-002 remediation: Bearer tokens are verified via supabase.auth.getUser() —
 * structural-only (3-part format) validation has been replaced with real Supabase
 * JWT signature and expiry verification.
 *
 * Query parameters:
 *   organisationId — required; the organisation whose pending events are returned
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.2 (API)
 *   Issue #628 — Wave 9.4-FU authority: CS2 (@APGI-cmy)
 *   GRS-011 | APS §10 | AAD §10.1
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';

import { createClient } from '@supabase/supabase-js';
import { FeedbackPipeline } from '../../../packages/ai-centre/src/feedback/FeedbackPipeline.js';
import type { FeedbackPipelineInterface } from '../../../packages/ai-centre/src/types/feedback.js';

// ---------------------------------------------------------------------------
// Bearer validator (injectable for testing)
// ---------------------------------------------------------------------------

/**
 * A function that verifies a Bearer token is a valid, live Supabase session.
 * Returns true if the token is verified, false otherwise.
 * Injectable via createHandler to allow unit tests to run without a real Supabase instance.
 */
export type BearerValidator = (token: string) => Promise<boolean>;

/**
 * Build a BearerValidator backed by supabase.auth.getUser().
 * This performs real Supabase JWT signature and expiry verification — not structural-only.
 * F-D3-002 remediation: replaces the prior structural-only 3-part format check.
 */
export function buildBearerValidator(): BearerValidator {
  return async (token: string): Promise<boolean> => {
    try {
      const supabaseUrl = process.env['SUPABASE_URL'] ?? '';
      const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'] ?? '';
      if (!supabaseUrl || !supabaseAnonKey) return false;
      const authClient = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await authClient.auth.getUser(token);
      return !error && data.user !== null;
    } catch {
      return false;
    }
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export type FeedbackPipelineFactory = () => FeedbackPipelineInterface;

/**
 * Build a FeedbackPipeline instance for list (read-only) operations.
 * Uses anon key — listPending() is scoped by organisationId and Supabase
 * RLS enforces org isolation at the data layer. service_role is NOT needed
 * here (that is reserved for approve/reject in feedback/approve.ts).
 * In tests, inject via createHandler(mockFactory).
 */
export function buildFeedbackPipeline(): FeedbackPipelineInterface {
  const supabaseUrl = process.env['SUPABASE_URL'] ?? '';
  const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'] ?? '';
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return new FeedbackPipeline(supabaseClient);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

/**
 * Create a handler with an injectable FeedbackPipeline factory and optional BearerValidator.
 * The default export uses buildFeedbackPipeline() and buildBearerValidator().
 * Tests may inject mock implementations to avoid real Supabase calls.
 */
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

    // Authentication: x-arc-token (CS2-gated direct) or Supabase-verified Bearer token.
    // F-D3-002 remediation: structural-only JWT checks are replaced with supabase.auth.getUser().
    const authHeader = (req.headers as Record<string, string | string[] | undefined>)['authorization'];
    const arcTokenHeader = (req.headers as Record<string, string | string[] | undefined>)['x-arc-token'];
    const expectedToken = process.env['ARC_APPROVAL_TOKEN'];

    let organisationId: string | null = null;

    const isArcTokenAuth =
      typeof arcTokenHeader === 'string' && expectedToken && arcTokenHeader === expectedToken;

    if (isArcTokenAuth) {
      // Server-side ARC token path: require organisationId query param
      const url = new URL(req.url ?? '/', 'http://localhost');
      organisationId = url.searchParams.get('organisationId');
    } else if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      // Supabase session JWT path.
      // F-D3-002 remediation: verify via supabase.auth.getUser() — not structural-only.
      const token = authHeader.slice(7);
      const isValidBearer = await validateBearer(token);
      if (!isValidBearer) {
        res.writeHead(403);
        res.end(JSON.stringify({ error: 'Forbidden. Bearer token could not be verified.' }));
        return;
      }
      // After successful Supabase verification, organisationId must be supplied as query param.
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
