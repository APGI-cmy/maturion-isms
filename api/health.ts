/**
 * Vercel Serverless Function — GET /health
 *
 * Public health check endpoint for the MAT frontend deployment.
 * Returns { status: 'healthy' } with HTTP 200 — no authentication required.
 *
 * Fixes: T-W13-E2E-1 — Live deployment health check
 * Wave 13: E2E Live Deployment Wiring | MAT-RCA-002
 *
 * NOTE: This is intentionally separate from api/ai/health.ts which reports
 * AI gateway status at /api/ai/health. This endpoint serves the top-level
 * deployment health check required by the E2E CWT test suite.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

export default function handler(
  _req: IncomingMessage,
  res: ServerResponse,
): void {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200);
  res.end(JSON.stringify({ status: 'healthy' }));
}
