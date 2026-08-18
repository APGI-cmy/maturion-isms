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

describe('T-MMM-S6-196: Framework origin progression passes auth headers to framework init', () => {
  it('FrameworkOriginPage calls mmm-framework-init with getEdgeInvokeHeaders', () => {
    const src = readFile('apps/mmm/src/pages/FrameworkOriginPage.tsx');
    expect(src).toContain("supabase.functions.invoke('mmm-framework-init'");
    expect(src).toContain('getEdgeInvokeHeaders');
    expect(src).toContain("navigate(`/frameworks/upload?mode=${uploadMode}");
  });
});

