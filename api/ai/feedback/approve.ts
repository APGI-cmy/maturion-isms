/**
 * Vercel Serverless API Gateway — POST /api/ai/feedback/approve
 *
 * ARC (Adaptive Review Committee) approval/rejection endpoint.
 * Requires the x-arc-token header matching the ARC_APPROVAL_TOKEN env var.
 * This endpoint is CS2-gated — only authorised ARC operators may call it.
 *
 * Request body: { eventId: string, decision: 'approved' | 'rejected', reviewedBy: string, notes?: string }
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.2 (API)
 *   Issue #613 — Wave 9.4 authority: CS2 (@APGI-cmy)
 *   GRS-011 | APS §10 | AAD §10.1
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

import { FeedbackPipeline } from '../../../packages/ai-centre/src/feedback/FeedbackPipeline.js';
import type { FeedbackPipelineInterface } from '../../../packages/ai-centre/src/types/feedback.js';

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export type FeedbackPipelineFactory = () => FeedbackPipelineInterface;

export function buildFeedbackPipeline(): FeedbackPipelineInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseClient: any = null; // Replaced by real service_role client in production
  return new FeedbackPipeline(supabaseClient);
}

// ---------------------------------------------------------------------------
// Request parsing
// ---------------------------------------------------------------------------

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

interface ApproveBody {
  eventId: string;
  decision: 'approved' | 'rejected';
  reviewedBy: string;
  notes?: string;
}

export function validateApproveBody(body: unknown): ApproveBody {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Request body must be a JSON object');
  }

  const b = body as Record<string, unknown>;

  if (typeof b['eventId'] !== 'string' || !b['eventId']) {
    throw new Error('eventId is required');
  }
  if (b['decision'] !== 'approved' && b['decision'] !== 'rejected') {
    throw new Error("decision must be 'approved' or 'rejected'");
  }
  if (typeof b['reviewedBy'] !== 'string' || !b['reviewedBy']) {
    throw new Error('reviewedBy is required');
  }

  return {
    eventId: b['eventId'],
    decision: b['decision'],
    reviewedBy: b['reviewedBy'],
    notes: typeof b['notes'] === 'string' ? b['notes'] : undefined,
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

    // ARC token guard — must match ARC_APPROVAL_TOKEN environment variable
    const arcToken = (req.headers as Record<string, string | string[] | undefined>)['x-arc-token'];
    const expectedToken = process.env['ARC_APPROVAL_TOKEN'];

    if (
      !arcToken ||
      typeof arcToken !== 'string' ||
      !expectedToken ||
      arcToken !== expectedToken
    ) {
      res.writeHead(403);
      res.end(JSON.stringify({ error: 'Forbidden. Valid x-arc-token header is required.' }));
      return;
    }

    let payload: ApproveBody;
    try {
      const body = await parseBody(req);
      payload = validateApproveBody(body);
    } catch (err) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Invalid request',
        }),
      );
      return;
    }

    try {
      const pipeline = factory();
      let updated;

      if (payload.decision === 'approved') {
        updated = await pipeline.approve(payload.eventId, payload.reviewedBy, payload.notes);
      } else {
        updated = await pipeline.reject(payload.eventId, payload.reviewedBy, payload.notes);
      }

      res.writeHead(200);
      res.end(JSON.stringify(updated));
    } catch {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'ARC review operation encountered an internal error.' }));
    }
  };
}

export default createHandler();
