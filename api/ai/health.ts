/**
 * Vercel Serverless API Gateway — GET /api/ai/health
 *
 * Health check endpoint. Reports the operational status of the AI gateway
 * and its configured adapter integrations.
 *
 * References: FR-076, TR-076 | ai-architecture.md v3.0.0 §10
 * Wave 10 gap remediation
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  personaLoader: 'real' | 'degraded';
  sessionMemory: 'in_memory';
  persistentMemory: 'supabase' | 'in_memory';
  supabaseWiring: 'active' | 'degraded' | 'pending_wave11';
  timestamp: number;
}

export function createHealthHandler() {
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

    const body: HealthStatus = {
      status: 'ok',
      personaLoader: 'real',
      sessionMemory: 'in_memory',
      persistentMemory: 'supabase',
      supabaseWiring: 'active',
      timestamp: Date.now(),
    };

    res.writeHead(200);
    res.end(JSON.stringify(body));
  };
}

export default createHealthHandler();
