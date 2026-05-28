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

describe('T-MMM-S6-197: Organisation Context has edge-runtime fallback', () => {
  it('OrganisationContextPage falls back to direct table reads/writes when invoke fails', () => {
    const src = readFile('apps/mmm/src/pages/OrganisationContextPage.tsx');
    expect(src).toContain("from('mmm_profiles')");
    expect(src).toContain("from('mmm_organisations')");
    expect(src).toContain('Fallback path');
  });
});

describe('T-MMM-S6-198: DMC inventory has edge-runtime fallback', () => {
  it('DocumentManagementCenterPage falls back to canonical table read when list invoke fails', () => {
    const src = readFile('apps/mmm/src/pages/DocumentManagementCenterPage.tsx');
    expect(src).toContain("supabase.functions.invoke('mmm-subject-knowledge-list'");
    expect(src).toContain("from('mmm_subject_knowledge_documents')");
    expect(src).toContain('Fallback path');
  });
});

