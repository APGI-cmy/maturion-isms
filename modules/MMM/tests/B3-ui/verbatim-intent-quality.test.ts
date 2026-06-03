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

describe('T-MMM-S6-220: Verbatim intent generation quality gate', () => {
  it('uses processed organisation-source chunks from ai_knowledge before fallback mapping', () => {
    const src = readFile('apps/mmm/src/hooks/useIntentGeneration.ts');
    expect(src).toContain("doc.tags.some((tag) => tag === 'source_mode:VERBATIM')");
    expect(src).toContain(".from('ai_knowledge')");
    expect(src).toContain('pickVerbatimIntentFromKnowledge');
    expect(src).toContain('no source-faithful intent text could be extracted');
  });

  it('subject-knowledge ingestion supports KUC parsed-text extraction for non-text source files', () => {
    const shared = readFile('supabase/functions/_shared/mmm-subject-knowledge.ts');
    const upload = readFile('supabase/functions/mmm-subject-knowledge-upload/index.ts');
    const reprocess = readFile('supabase/functions/mmm-subject-knowledge-reprocess/index.ts');
    expect(shared).toContain('extractBestEffortText');
    expect(shared).toContain('collectKucTextSegments');
    expect(upload).toContain('extractBestEffortText');
    expect(reprocess).toContain('extractBestEffortText');
  });

  it('queries canonical verbatim index before secondary extraction paths', () => {
    const src = readFile('apps/mmm/src/hooks/useIntentGeneration.ts');
    expect(src).toContain(".from('mmm_org_source_verbatim_index')");
    expect(src).toContain(".eq('organisation_id', orgId)");
    expect(src).toContain(".ilike('domain_name', `%${domainName}%`)");
  });

  it('keeps chunked verbatim organisation source completed when no extractable intents are indexed', () => {
    const upload = readFile('supabase/functions/mmm-subject-knowledge-upload/index.ts');
    const reprocess = readFile('supabase/functions/mmm-subject-knowledge-reprocess/index.ts');
    expect(upload).toContain('mmm_org_source_verbatim_index');
    expect(upload).toContain("processing_status: hasExtractedChunks ? 'completed' : 'failed'");
    expect(upload).toContain('VERBATIM source index warning: no extractable MPS intent statements were indexed; chunk fallback remains available.');
    expect(upload).toContain('mps_headings=');
    expect(reprocess).toContain('mmm_org_source_verbatim_index');
    expect(reprocess).toContain("processing_status: hasExtractedChunks ? 'completed' : 'failed'");
    expect(reprocess).toContain('VERBATIM source index warning: no extractable MPS intent statements were indexed; chunk fallback remains available.');
    expect(reprocess).toContain('mps_headings=');
  });

  it('normalizes malformed KUC_BASE_URL values before upload calls', () => {
    const kucClient = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(kucClient).toContain('function normalizeKucBaseUrl');
    expect(kucClient).toContain("raw.replace(/^\\s*KUC_BASE_URL\\s*=\\s*/i, '').trim()");
    expect(kucClient).toContain("replace(/\\/api\\/upload\\/[^/?#]+\\/?$/i, '')");
  });

  it('includes deterministic MPS/Intent fallback extraction for LDCS-style source text blocks', () => {
    const upload = readFile('supabase/functions/mmm-subject-knowledge-upload/index.ts');
    const reprocess = readFile('supabase/functions/mmm-subject-knowledge-reprocess/index.ts');
    expect(upload).toContain('Intent\\s*(?::|\\n)');
    expect(upload).toContain('Required\\s+Actions');
    expect(reprocess).toContain('Intent\\s*(?::|\\n)');
    expect(reprocess).toContain('Required\\s+Actions');
  });

  it('requires AI Gateway parse schema to include MPS-level verbatim intent extraction fields', () => {
    const gateway = readFile('apps/mat-ai-gateway/services/parsing.py');
    expect(gateway).toContain('class ParsedMPS(TypedDict, total=False):');
    expect(gateway).toContain('intent_statement: str');
    expect(gateway).toContain('"mini_performance_standards": [');
    expect(gateway).toContain('"intent_statement": "..."');
    expect(gateway).toContain('"guidance": "..."');
  });
});
