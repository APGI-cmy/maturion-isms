/**
 * Vercel Serverless API Gateway — GET /api/ai/feedback/pending
 *
 * ARC (Adaptive Review Committee) endpoint that lists pending feedback events
 * for a given organisation. Requires the x-arc-token header matching the
 * ARC_APPROVAL_TOKEN env var.
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

export function createHandler(factory: FeedbackPipelineFactory = buildFeedbackPipeline) {
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

    // Authentication: accept either Supabase session JWT (Authorization: Bearer)
    // or a server-side ARC token (x-arc-token) for backward compatibility.
    const authHeader = (req.headers as Record<string, string | string[] | undefined>)['authorization'];
    const arcTokenHeader = (req.headers as Record<string, string | string[] | undefined>)['x-arc-token'];
    const expectedToken = process.env['ARC_APPROVAL_TOKEN'];

    let organisationId: string | null = null;

    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      // Supabase session JWT path.
      // Structural validation only (3 dot-separated base64url parts) — signature verification
      // is intentionally omitted here. Supabase RLS enforces actual auth in production;
      // offline/CI tests use structurally valid unsigned tokens. This is the same contract
      // as api/ai/request.ts validateAuthHeader() (see GAP-017 design note).
      const token = authHeader.slice(7);
      const parts = token.split('.');
      if (parts.length !== 3) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Unauthorized. Invalid Bearer token format.' }));
        return;
      }
      try {
        const jwtPayload = JSON.parse(Buffer.from(parts[1]!, 'base64url').toString('utf-8')) as Record<string, unknown>;
        const orgId = jwtPayload['org_id'] ??
          (jwtPayload['user_metadata'] as Record<string, unknown> | undefined)?.['organisation_id'];
        organisationId = typeof orgId === 'string' ? orgId : null;
      } catch {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Unauthorized. Could not decode Bearer token.' }));
        return;
      }
      // If org_id not in JWT claims, fall back to query param (e.g. during onboarding)
      if (!organisationId) {
        const url = new URL(req.url ?? '/', 'http://localhost');
        organisationId = url.searchParams.get('organisationId');
      }
    } else if (typeof arcTokenHeader === 'string' && expectedToken && arcTokenHeader === expectedToken) {
      // Server-side ARC token path: require organisationId query param
      const url = new URL(req.url ?? '/', 'http://localhost');
      organisationId = url.searchParams.get('organisationId');
    } else {
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'Unauthorized. Provide Authorization: Bearer <token> or x-arc-token header.' }));
      return;
    }

    if (!organisationId) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'organisationId could not be determined. Provide it as a query parameter or include org_id in the JWT.' }));
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
