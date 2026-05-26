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
    expect(src).toContain("invoke('mmm-ai-chat-user'");
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
