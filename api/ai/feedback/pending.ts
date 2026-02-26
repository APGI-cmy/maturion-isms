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

export function buildFeedbackPipeline(): FeedbackPipelineInterface {
  const supabaseUrl = process.env['SUPABASE_URL'] ?? '';
  const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';
  const supabaseClient = createClient(supabaseUrl, serviceRoleKey);
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

    // ARC token guard
    const arcToken = (req.headers as Record<string, string | string[] | undefined>)['x-arc-token'];
    const expectedToken = process.env['ARC_APPROVAL_TOKEN'];

    if (!arcToken || typeof arcToken !== 'string' || !expectedToken || arcToken !== expectedToken) {
      res.writeHead(403);
      res.end(JSON.stringify({ error: 'Forbidden. Valid x-arc-token header is required.' }));
      return;
    }

    // Parse and validate organisationId query parameter
    const url = new URL(req.url ?? '/', 'http://localhost');
    const organisationId = url.searchParams.get('organisationId');
    if (!organisationId) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'organisationId query parameter is required.' }));
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
