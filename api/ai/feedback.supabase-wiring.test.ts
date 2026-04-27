/**
 * RED Gate QA — Wave 9.11-FU-2: Supabase Client Wiring
 * Source-inspection tests verifying no null stubs remain.
 */
import { describe, it, expect } from 'vitest';
// @ts-ignore
import { readFileSync } from 'node:fs';
// @ts-ignore
import { resolve, dirname } from 'node:path';
// @ts-ignore
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const feedbackSource = readFileSync(resolve(__dirname, 'feedback.ts'), 'utf-8');
const approveSource = readFileSync(resolve(__dirname, 'feedback', 'approve.ts'), 'utf-8');

describe('Wave 9.11-FU — Supabase Client Wiring', () => {
  it('W9.11-FU-T-001: feedback.ts does NOT contain null Supabase client', () => {
    expect(feedbackSource).not.toContain('supabaseClient: any = null');
  });
  it('W9.11-FU-T-002: feedback.ts references SUPABASE_URL', () => {
    expect(feedbackSource).toContain('SUPABASE_URL');
  });
  it('W9.11-FU-T-003: approve.ts does NOT contain null Supabase client', () => {
    expect(approveSource).not.toContain('supabaseClient: any = null');
  });
  it('W9.11-FU-T-004: approve.ts references SUPABASE_SERVICE_ROLE_KEY', () => {
    expect(approveSource).toContain('SUPABASE_SERVICE_ROLE_KEY');
  });
  it('W9.11-FU-T-005: pending.ts uses SUPABASE_SERVICE_ROLE_KEY (server-side, ARC-gated — approved)', () => {
    // Service-role is approved for the pending endpoint: endpoint auth (x-arc-token or
    // Supabase-verified Bearer) is enforced before listPending() is called. The key is
    // used server-side only and is never exposed to client or Vite/browser code.
    const pendingSource = readFileSync(resolve(__dirname, 'feedback', 'pending.ts'), 'utf-8');
    expect(pendingSource).toContain('SUPABASE_SERVICE_ROLE_KEY');
  });
  it('W9.11-FU-T-006: pending.ts references SUPABASE_ANON_KEY (bearer token verification)', () => {
    const pendingSource = readFileSync(resolve(__dirname, 'feedback', 'pending.ts'), 'utf-8');
    expect(pendingSource).toContain('SUPABASE_ANON_KEY');
  });
  it('W9.11-FU-T-007: pending.ts enforces auth guard before privileged access (Forbidden path present)', () => {
    // Security boundary: unauthenticated requests must fail with a Forbidden response
    // before any privileged list operation is performed. Source must contain both the
    // x-arc-token check and the Forbidden guard so the auth gate cannot be removed silently.
    const pendingSource = readFileSync(resolve(__dirname, 'feedback', 'pending.ts'), 'utf-8');
    expect(pendingSource).toContain('Forbidden');
    expect(pendingSource).toContain('x-arc-token');
    expect(pendingSource).toContain('ARC_APPROVAL_TOKEN');
  });
});
