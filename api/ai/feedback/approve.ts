/*
 * Vercel Serverless API Gateway - POST /api/ai/feedback/approve
 *
 * ARC (Adaptive Review Committee) approval/rejection endpoint.
 * Accepts either:
 *   - x-arc-token header matching ARC_APPROVAL_TOKEN (CS2-gated direct access), or
 *   - Authorization: Bearer <supabase-session-jwt> (Supabase-verified operator session).
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

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
  const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';
  const supabaseClient = createClient(supabaseUrl, serviceRoleKey);
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

export function createHandler(
  factory: FeedbackPipelineFactory = buildFeedbackPipeline,
  validateBearer: BearerValidator = buildBearerValidator(),
) {
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

    const arcTokenHeader = (req.headers as Record<string, string | string[] | undefined>)['x-arc-token'];
    const authHeader = (req.headers as Record<string, string | string[] | undefined>)['authorization'];
    const expectedToken = process.env['ARC_APPROVAL_TOKEN'];

    const isArcTokenAuth =
      typeof arcTokenHeader === 'string' && expectedToken && arcTokenHeader === expectedToken;

    if (!isArcTokenAuth) {
      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const isValidBearer = await validateBearer(token);
        if (!isValidBearer) {
          res.writeHead(403);
          res.end(JSON.stringify({ error: 'Forbidden. Bearer token could not be verified.' }));
          return;
        }
      } else {
        res.writeHead(403);
        res.end(JSON.stringify({ error: 'Forbidden. Valid x-arc-token or authenticated session required.' }));
        return;
      }
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
