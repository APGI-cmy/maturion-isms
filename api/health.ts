/**
 * Vercel Serverless Function — GET /health
 *
 * Public health check endpoint for the MAT frontend deployment.
 * Returns { status: 'healthy' } with HTTP 200 — no authentication required.
 *
 * Fixes: T-W13-E2E-1 — Live deployment health check
 * Wave 13: E2E Live Deployment Wiring
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ status: 'healthy' });
}
