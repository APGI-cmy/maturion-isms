import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '../../../..');

function readFile(relPath: string): string {
  const abs = resolve(ROOT, relPath);
  if (!existsSync(abs)) {
    throw new Error(`File not found: ${relPath}`);
  }
  return readFileSync(abs, 'utf-8');
}

describe('T-MMM-S6-199: MPS AI linkage uses user-scoped endpoint + fallback', () => {
  it('useAIMPSGeneration invokes mmm-ai-chat-user and preserves legacy fallback pack', () => {
    const src = readFile('apps/mmm/src/hooks/useAIMPSGeneration.ts');
    expect(src).toContain('/functions/v1/mmm-ai-chat-user');
    expect(src).toContain('toFallbackDrafts(domainName)');
  });
});

describe('T-MMM-S6-200: Intent AI linkage uses user-scoped endpoint + fallback', () => {
  it('useIntentGeneration invokes mmm-ai-chat-user and returns deterministic fallback intent', () => {
    const hookSrc = readFile('apps/mmm/src/hooks/useIntentGeneration.ts');
    const uiSrc = readFile('apps/mmm/src/components/assessment/IntentCreator.tsx');
    expect(hookSrc).toContain("invoke('mmm-ai-chat-user'");
    expect(uiSrc).toContain('Loaded fallback intent draft.');
  });
});

describe('T-MMM-S6-201: Criteria AI linkage uses user-scoped endpoint + fallback', () => {
  it('CriteriaManagement invokes mmm-ai-chat-user and builds fallback criteria set', () => {
    const src = readFile('apps/mmm/src/components/assessment/CriteriaManagement.tsx');
    expect(src).toContain("invoke('mmm-ai-chat-user'");
    expect(src).toContain('buildFallbackCriteria');
    expect(src).toContain('Loaded fallback criteria draft.');
  });
});

describe('T-MMM-S6-202: AIMC boundary supports AI_GATEWAY_URL alias for base URL', () => {
  it('shared AIMC client reads AIMC_BASE_URL with AI_GATEWAY_URL fallback alias', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain("Deno.env.get('AIMC_BASE_URL')");
    expect(src).toContain("Deno.env.get('AI_GATEWAY_URL')");
  });
});

describe('T-MMM-S6-203: MPS generation surfaces concrete edge failure detail', () => {
  it('useAIMPSGeneration parses edge response detail/reason/error/message before fallback', () => {
    const src = readFile('apps/mmm/src/hooks/useAIMPSGeneration.ts');
    expect(src).toContain('(data.detail as string | undefined)');
    expect(src).toContain('(data.reason as string | undefined)');
    expect(src).toContain('(data.error as string | undefined)');
    expect(src).toContain('(data.message as string | undefined)');
  });
});

describe('T-MMM-S6-204: AIMC client probes endpoint variants for operation routes', () => {
  it('shared AIMC client includes multiple endpoint candidates for each operation', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('${AIMC_BASE_URL}${AIMC_NAMESPACE}/${operation}');
    expect(src).toContain('${AIMC_BASE_URL}/api/${operation}');
    expect(src).toContain('${AIMC_BASE_URL}/${operation}');
  });
});

describe('T-MMM-S6-205: AI chat bridge supports OpenAI-compatible fallback on AIMC 404', () => {
  it('mmm-ai-chat-user includes /v1/chat/completions compatibility bridge', () => {
    const src = readFile('supabase/functions/mmm-ai-chat-user/index.ts');
    expect(src).toContain('/v1/chat/completions');
    expect(src).toContain("if (err.includes('http 404'))");
    expect(src).toContain('compat_fallback');
  });
});

describe('T-MMM-S6-206: Verbatim MPS mode bypasses AIMC chat and loads framework-proposed MPS directly', () => {
  it('useAIMPSGeneration reads proposed/canonical framework MPS tables before AIMC path', () => {
    const src = readFile('apps/mmm/src/hooks/useAIMPSGeneration.ts');
    expect(src).toContain('loadVerbatimDraftsFromFramework');
    expect(src).toContain('.eq(\'domain_id\', options.sourceDomainId)');
    expect(src).toContain(".from('mmm_proposed_domains')");
    expect(src).toContain(".from('mmm_proposed_mps')");
    expect(src).toContain(".from('mmm_domains')");
    expect(src).toContain(".from('mmm_maturity_process_steps')");
  });
});
