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
});
