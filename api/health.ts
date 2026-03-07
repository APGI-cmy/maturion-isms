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
 *
 * Uses @vercel/node VercelRequest/VercelResponse so Vercel's runtime routes
 * this function correctly without applying authentication middleware.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ status: 'healthy' });
}